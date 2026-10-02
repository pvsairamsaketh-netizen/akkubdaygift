"""
Citation and Speech Sanitization Service.
Formats structured citations for UI display and cleans text for Text-to-Speech audio synthesis.
"""

import re
from typing import List, Dict, Any

class CitationService:
    @staticmethod
    def extract_citations(retrieved_chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Builds structured citation objects from retrieved chunks for the frontend.
        """
        citations = []
        for idx, chunk in enumerate(retrieved_chunks):
            meta = chunk.get("metadata", {})
            page = meta.get("page_number", "?")
            snippet = chunk.get("text", "")[:250].strip() + ("..." if len(chunk.get("text", "")) > 250 else "")
            
            citations.append({
                "id": idx + 1,
                "chunk_id": chunk.get("chunk_id", f"chunk_{idx+1}"),
                "page_number": page,
                "email_subject": meta.get("email_subject") or None,
                "email_date": meta.get("email_date") or None,
                "relevance_score": round(chunk.get("score", 0.0), 3),
                "snippet": snippet
            })
        return citations

    @staticmethod
    def clean_text_for_speech(text: str) -> str:
        """
        Cleans markdown, removes citation markers ([Page X]), emojis,
        and unreadable punctuation so the TTS engine speaks naturally.
        """
        if not text:
            return ""

        # Remove citations like [Page 3], [Page 4, Chunk 1], [Source: ...]
        cleaned = re.sub(r'\[(?:Page|Source|Ref)[^\]]*\]', '', text, flags=re.IGNORECASE)
        # Remove markdown bold/italics (* or _)
        cleaned = re.sub(r'[*_~`]', '', cleaned)
        # Remove headers (#)
        cleaned = re.sub(r'#+\s*', '', cleaned)
        # Remove bullet points
        cleaned = re.sub(r'^\s*[-*+]\s+', '', cleaned, flags=re.MULTILINE)
        # Remove numbering like 1. 2.
        cleaned = re.sub(r'^\s*\d+\.\s+', '', cleaned, flags=re.MULTILINE)
        # Remove URLs
        cleaned = re.sub(r'https?://\S+', '', cleaned)
        # Clean extra whitespace and newlines
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()

        return cleaned
