"""
Conversation Management Service.
Handles conversation creation, updating, retrieval, message persistence,
and title generation based on initial user question.
"""

from typing import List, Dict, Any, Optional
from chat.models import Conversation, Message

class ConversationService:
    @staticmethod
    def get_or_create_conversation(conversation_id: Optional[str] = None) -> Conversation:
        if conversation_id:
            try:
                return Conversation.objects.get(id=conversation_id)
            except (Conversation.DoesNotExist, ValueError):
                pass
        return Conversation.objects.create()

    @staticmethod
    def add_message(
        conversation: Conversation,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Message:
        msg = Message.objects.create(
            conversation=conversation,
            role=role,
            content=content,
            metadata=metadata or {}
        )
        # Update conversation title if this is the first user message and title is default
        if role == 'user' and conversation.title == "New Relationship Memory":
            # Set title from first question (up to 40 chars)
            clean_title = content.strip().replace('\n', ' ')
            if len(clean_title) > 40:
                clean_title = clean_title[:37] + "..."
            conversation.title = clean_title
            conversation.save(update_fields=['title', 'updated_at'])
        else:
            conversation.save(update_fields=['updated_at'])

        return msg

    @staticmethod
    def get_history(conversation: Conversation, limit: int = 10) -> List[Dict[str, str]]:
        messages = conversation.messages.all()[:limit]
        return [{"role": m.role, "content": m.content} for m in messages]
