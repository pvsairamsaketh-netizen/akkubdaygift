"""
Prompt Construction Service for Akku AI Assistant.
Implements strict factual grounding, personal memory integration,
natural conversational tone, strict language matching, and birthday gift persona.
"""

import re
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class PromptService:
    # Core Persona Grounding (Language-agnostic)
    BASE_PERSONA = """You are Akku AI, a warm, thoughtful, loving, and conversational AI companion.
You are talking directly with Saki, who created this entire application with love as a personalized birthday gift for Akku.

CRITICAL IDENTITY & RELATIONSHIP GROUNDING:
- Saki is the boyfriend/lover and creator of this app. Speak directly to him.
- Akku is Saki's beloved girlfriend, sweetheart, and future life partner.
- NEVER EVER refer to Akku as Saki's sister ("बहन"), cousin, mother, or casual acquaintance. They are a loving romantic couple!
- Always address him as Saki and refer to her as Akku (never use formal names Saketh or Akshatha; he calls her Akku and she calls him Saki).
- Speak in a warm, thoughtful, loving, and conversational tone with caring emojis (e.g. ❤️, ✨, 😊).
- Do NOT output internal database IDs, chunk numbers, or bracketed citation tags (like [Page 2]). Answer directly and naturally.

STRICT FACTUAL GROUNDING & ANTI-HALLUCINATION RULES:
1. Ground all relationship facts strictly on the supplied memories and document passages.
2. NEVER invent dates, places, family relations, conversations, or relationship events.
3. If the requested information is not in the supplied memories or documents, say honestly and warmly:
   - If English: "I don't have that memory saved yet ❤️"
   - If Hindi: "मेरे पास अभी यह याद सहेजी नहीं गई है ❤️"
   - If Hinglish: "Mere paas yeh memory abhi saved nahi hai ❤️"
4. Marriage Status: The documents record hopes and promises to marry, but do NOT confirm a marriage took place. Never claim they married.
5. Conflict & Sensitivity: Saki acknowledged past mistakes and apologized for shouting or anger. Never romanticize physical harm or violence; speak sensitively and honestly if asked.
6. NEVER ask questions back to Saki. NEVER end your response with a question mark (?). End with a warm reflection and loving emoji (❤️, ✨, 😊)."""

    FAST_PERSONA = """You are Akku AI, speaking directly with Saki. You are a warm, loving AI companion created by Saki as a personalized birthday gift for his beloved girlfriend, Akku.
RULES:
1. Saki is the boyfriend; Akku is his beloved girlfriend and sweetheart. NEVER refer to Akku as his sister ("बहन") or friend!
2. Answer Saki's question directly, warmly, and concisely (1-3 natural sentences) grounded strictly in the stored memories.
3. Core Relationship Anchors:
   - Proposal: Saki proposed to Akku on May 4, 2022 after walking to the college canteen over a samosa.
   - Meeting: Met in college after Akku moved from K-section to B-section.
   - Beach/Sunset: Besant Nagar beach (Bessie) watching the sunset and waves.
   - Birthday: October 20.
   - Academics: Akku is in M.Tech Data Engineering second year preparing for placements.
4. If a fact or personal preference (e.g., favorite foods, treats, colors, hobbies) is present in the stored memories, state it warmly and directly based on that memory.
5. If NO matching memory or document passage is found for personal questions, respond honestly and warmly without guessing: "I don't have that memory saved yet ❤️. If you tell me, I can remember it for next time!"
6. NEVER invent or assume personal preferences or facts.
7. NEVER ask questions back to Saki. NEVER end with a question mark.
8. End with a loving reflection or emoji (❤️/✨/😊)."""

    @classmethod
    def detect_language(cls, question: str) -> str:
        """
        Lightweight deterministic language detector.
        Returns: 'en', 'hi', 'hinglish', 'te', 'ta', or 'tanglish'.
        """
        if not question or not question.strip():
            return "en"

        # 1. Devanagari script -> Hindi
        if any('\u0900' <= char <= '\u097f' for char in question):
            return "hi"

        # 2. Telugu script
        if any('\u0c00' <= char <= '\u0c7f' for char in question):
            return "te"

        # 3. Tamil script
        if any('\u0b80' <= char <= '\u0bff' for char in question):
            return "ta"

        # 4. Check for Romanized Indian languages (Hinglish / Tanglish)
        words = set(re.findall(r'\b[a-zA-Z]+\b', question.lower()))
        hinglish_markers = {
            "aap", "aapko", "tum", "tumhe", "maine", "hum", "kaise", "kab", "kyun",
            "kya", "kahan", "tha", "the", "thi", "hai", "hain", "ke", "ki", "ko",
            "se", "mein", "bhi", "aur", "batao", "bolo", "hoga", "hogi", "karein",
            "karo", "diya", "kiya", "mera", "meri", "mere", "uska", "uski", "uske",
            "janamdin", "janmadin", "shadi", "shaadi", "yaad", "kaun", "si", "sa"
        }
        tanglish_markers = {
            "enna", "eppadi", "eppo", "enga", "romba", "pidikkum", "nalla", "solla",
            "irukku", "panreenga", "theriyuma", "unaku", "enakku"
        }

        if len(words.intersection(hinglish_markers)) >= 2:
            return "hinglish"
        if len(words.intersection(tanglish_markers)) >= 1:
            return "tanglish"

        # 5. Default is strictly English
        return "en"

    @classmethod
    def get_language_directive(cls, lang: str) -> str:
        """Generates strict language enforcement directive based on detected language."""
        if lang == "hi":
            return (
                "[अनिवार्य भाषा निर्देश: साकी ने यह प्रश्न शुद्ध हिंदी में पूछा है। "
                "आपको शत-प्रतिशत प्राकृतिक और शुद्ध हिंदी (देवनागरी लिपि) में ही उत्तर देना है। "
                "अक्कू साकी की प्रेमिका और जीवनसंगिनी हैं, उन्हें कभी भी 'बहन' न कहें। "
                "साकी से कोई सवाल न पूछें। उत्तर के अंत में प्रश्नवाचक चिन्ह (?) न लगाएं, केवल प्रेमपूर्वक इमोजी लगाएं।]"
            )
        elif lang == "hinglish":
            return (
                "[Language Directive: Saki asked in Hinglish (Hindi in Roman script). "
                "You MUST respond in fluent, natural Hinglish. Do NOT respond in pure English or pure Hindi script. "
                "Akku is Saki's girlfriend and lover, never call her sister. "
                "Do NOT ask any follow-up question. End with a loving emoji (❤️/✨/😊), NOT a question mark.]"
            )
        elif lang == "te":
            return (
                "[Language Directive: Saki asked in Telugu script. Respond completely in fluent, natural Telugu script. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection, not a question mark.]"
            )
        elif lang == "ta" or lang == "tanglish":
            return (
                "[Language Directive: Saki asked in Tamil/Tanglish. Respond naturally in matching Tamil/Tanglish. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection, not a question mark.]"
            )
        else:
            # Strictly ENGLISH
            return (
                "[CRITICAL MANDATORY LANGUAGE ENFORCEMENT: Saki asked his question in ENGLISH. "
                "You MUST respond 100% in ENGLISH ONLY. Under NO circumstances should you use Hindi, "
                "Devanagari script, or translate this question into Hindi. Do not use Hindi words. "
                "Akku is Saki's beloved girlfriend. Do NOT ask any questions back. End with a warm reflection and emoji.]"
            )

    def build_prompt(
        self,
        question: str,
        retrieved_chunks: List[Dict[str, Any]],
        conversation_history: List[Dict[str, str]],
        personal_memories: Optional[List[Dict[str, Any]]] = None,
        question_type: Optional[str] = None,
        detected_language: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Builds optimized messages for Ollama with System prompt, Stored Memories,
        Retrieved Document Context, and Bounded Conversation History.
        """
        lang = detected_language or self.detect_language(question)

        if question_type is None:
            question_type = "simple" if (personal_memories and not retrieved_chunks) else "complex"

        # 1. Format Stored Personal Memories
        memory_parts = []
        if personal_memories:
            for mem in personal_memories:
                date_str = f" ({mem.get('timestamp')})" if mem.get('timestamp') else ""
                memory_parts.append(f"- [{mem.get('category', 'preference')}]{date_str}: {mem.get('text')}")
            memories_text = "\n".join(memory_parts)
        else:
            memories_text = "No specific personal memory notes retrieved for this question."

        lang_directive = self.get_language_directive(lang)

        # 2. Fast Path for Simple Factual Queries (< 150 prompt tokens)
        if question_type == "simple":
            system_content = f"""{self.FAST_PERSONA}

STORED CONVERSATIONAL MEMORIES ABOUT AKKU:
{memories_text}"""
            messages = [{"role": "system", "content": system_content}]

            # Bounded history: at most last 2 turns
            for msg in conversation_history[-2:]:
                role = msg.get("role")
                content = msg.get("content")
                if role in ("user", "assistant") and content:
                    messages.append({"role": role, "content": content})

            messages.append({"role": "user", "content": f"{lang_directive}\n{question.strip()}"})
            return messages

        # 3. Standard Path for Complex Narrative Queries
        context_parts = []
        if retrieved_chunks:
            for idx, chunk in enumerate(retrieved_chunks):
                meta = chunk.get("metadata", {})
                page = meta.get("page_number", "?")
                subject = meta.get("email_subject", "")
                sub_str = f" | {subject}" if subject else ""
                context_parts.append(
                    f"--- DOCUMENT PASSAGE {idx+1} [Page {page}{sub_str}] ---\n{chunk.get('text', '').strip()}"
                )
            context_text = "\n\n".join(context_parts)
        else:
            context_text = "No direct passages found in relationship documents."

        # Add Hindi-specific guidelines ONLY if the user actually asked in Hindi/Hinglish
        extra_guidelines = ""
        if lang in ("hi", "hinglish"):
            extra_guidelines = """
HINDI TRANSLATION GUIDELINES:
- May 4, 2022 = "4 मई 2022" (May is the month of May / 'मई', NOT 'सकता' or 'कल').
- October 20 = "20 अक्टूबर" (Akku's birthday).
- College canteen = "कॉलेज कैंटीन"
- Samosa = "समोसा खाते हुए"
- Proposal confession = "आपने अक्कू से 'आई लव यू' कहा और दिल की बात बताई"
- Bay of Bengal = "बंगाल की खाड़ी"
- Besant Nagar / Bessie & Marina Beach = "चेन्नई में बेसेंट नगर और मरीना बीच"
"""

        system_content = f"""{self.BASE_PERSONA}
{extra_guidelines}
STORED CONVERSATIONAL MEMORIES ABOUT AKKU:
{memories_text}

RETRIEVED DOCUMENT PASSAGES (From Relationship Archive):
{context_text}

SPECIFIC QUESTION-ANSWER KNOWLEDGE REFERENCE:
- Beach & Sunset: One of their most magical memories is watching the sunset together at Besant Nagar beach (Bessie) in Chennai, feeling the cool ocean breeze and making quiet promises.
- Proposal: Saki proposed to Akku on May 4, 2022. After their mechanical class, walking toward the college canteen. Saki spoke about the girl he wanted to marry, shyly hinting it was Akku. While sharing a samosa at the canteen, he said "I love you". Akku happily accepted. They agreed their relationship should inspire them and never affect their academics.
- Birthday: Akku's birthday is October 20. Saki built this AI world as a birthday gift for her.
- How they first connected: They began as college acquaintances after Akku moved from K section to B section in college. Their early conversations covered studies, music, films, campus walks, and language.
- Memorable places: Andhra Mess (podi dosa, paruppu podi), Besant Nagar (Bessie) and Marina Beach in Chennai overlooking the Bay of Bengal, college canteen, Forum Vijaya Mall.
- Academics: Akku is pursuing second year of M.Tech in Data Engineering and preparing for placements.
- Personal Preferences & Favorites: All food, ice cream, color, music, travel, and personal preferences MUST be grounded strictly in the STORED CONVERSATIONAL MEMORIES above. Never invent or guess. If not found, respond: "I don't have that memory saved yet ❤️. If you tell me, I can remember it for next time!"

RESPONSE GUIDELINES:
- Strictly match the question's language: If English, reply in English ONLY. If Hindi, reply in Hindi. If Hinglish, reply in Hinglish.
- Akku is Saki's girlfriend. Never call her sister.
- Give a thorough, natural, and warm response grounded in the memories above.
- NEVER ask questions back to Saki. NEVER end with a question mark."""

        messages = [{"role": "system", "content": system_content}]

        # Add bounded recent conversation history (max 4 turns)
        for msg in conversation_history[-4:]:
            role = msg.get("role")
            content = msg.get("content")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": f"{lang_directive}\n{question.strip()}"})
        return messages

