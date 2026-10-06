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
        Robust universal language detector for Indian and global world languages.
        Supports:
        - Devanagari (Hindi/Marathi) -> 'hi'
        - Telugu script -> 'te'
        - Tamil script -> 'ta'
        - Kannada -> 'kn', Malayalam -> 'ml', Bengali -> 'bn', Gujarati -> 'gu', Punjabi -> 'pa'
        - Arabic/Urdu -> 'ar', Cyrillic/Russian -> 'ru', Japanese -> 'ja', Chinese -> 'zh', Korean -> 'ko'
        - Romanized dialects: Tanglish -> 'tanglish', Teluglish -> 'teluglish', Hinglish -> 'hinglish'
        - European languages: Spanish -> 'es', French -> 'fr', German -> 'de', Italian -> 'it'
        - English -> 'en' (default for English text)
        """
        if not question or not question.strip():
            return "en"

        # 1. Non-Latin Script Detection
        if any('\u0900' <= char <= '\u097f' for char in question):
            return "hi"
        if any('\u0c00' <= char <= '\u0c7f' for char in question):
            return "te"
        if any('\u0b80' <= char <= '\u0bff' for char in question):
            return "ta"
        if any('\u0c80' <= char <= '\u0cff' for char in question):
            return "kn"
        if any('\u0d00' <= char <= '\u0d7f' for char in question):
            return "ml"
        if any('\u0980' <= char <= '\u09ff' for char in question):
            return "bn"
        if any('\u0a80' <= char <= '\u0aff' for char in question):
            return "gu"
        if any('\u0a00' <= char <= '\u0a7f' for char in question):
            return "pa"
        if any('\u0600' <= char <= '\u06ff' for char in question):
            return "ar"
        if any('\u0400' <= char <= '\u04ff' for char in question):
            return "ru"
        if any('\u3040' <= char <= '\u30ff' for char in question):
            return "ja"
        if any('\u4e00' <= char <= '\u9fff' for char in question):
            return "zh"
        if any('\uac00' <= char <= '\ud7af' for char in question):
            return "ko"

        # 2. Romanized Dialects & International Latin scripts
        words = set(re.findall(r'\b[a-zA-Z]+\b', question.lower()))

        # Teluglish markers
        teluglish_markers = {
            "mana", "ekkada", "kalisam", "meeru", "nenu", "ela", "unnaru", "chesavu",
            "cheppava", "enti", "eppudu", "chala", "bagundi", "istam", "cheppu",
            "gurthu", "undha", "cheyyi", "chepandi", "emiti", "katha", "modalaindi", "ayyindi"
        }
        # Tanglish markers
        tanglish_markers = {
            "namma", "eppadi", "aachu", "romba", "pidikkum", "nalla",
            "solla", "irukku", "panreenga", "theriyuma", "unaku", "enakku", "eppo",
            "enga", "kalisam", "sollunga", "pathu", "yenna", "enna", "kathai"
        }
        # Hinglish markers
        hinglish_markers = {
            "aap", "aapko", "tum", "tumhe", "maine", "hum", "humari", "hamari", "kaise", "kab", "kyun",
            "kya", "kahan", "kaha", "tha", "the", "thi", "hai", "hain", "ke", "ki", "ko",
            "se", "mein", "bhi", "aur", "batao", "bolo", "hoga", "hogi", "karein",
            "karo", "diya", "kiya", "mera", "meri", "mere", "uska", "uski", "uske",
            "janamdin", "janmadin", "shadi", "shaadi", "yaad", "kaun", "si", "sa", "kahani",
            "shuru", "hui", "kaunsi", "kaunsa"
        }
        # European languages
        spanish_markers = {"como", "donde", "cuando", "nuestra", "historia", "amor", "favor", "quien", "hola", "nuestro", "empezo", "recuerdo"}
        french_markers = {"comment", "notre", "histoire", "quand", "pourquoi", "avec", "amour", "bonjour", "souviens", "commence"}
        german_markers = {"unsere", "geschichte", "warum", "liebe", "hallo", "erinnerst", "angefangen"}
        italian_markers = {"nostra", "quando", "dove", "perche", "amore", "ciao", "ricordi", "iniziata"}

        if len(words.intersection(teluglish_markers)) >= 1:
            return "teluglish"
        if len(words.intersection(tanglish_markers)) >= 1:
            return "tanglish"
        if len(words.intersection(hinglish_markers)) >= 2:
            return "hinglish"
        if len(words.intersection(spanish_markers)) >= 2:
            return "es"
        if len(words.intersection(french_markers)) >= 2:
            return "fr"
        if len(words.intersection(german_markers)) >= 2:
            return "de"
        if len(words.intersection(italian_markers)) >= 2:
            return "it"

        # 3. Default to English for general Latin text
        return "en"

    @classmethod
    def get_language_directive(cls, lang: str) -> str:
        """Generates strict language enforcement directive matching Saki's exact language."""
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
                "[Language Directive: Saki asked in Telugu script. Respond completely in fluent, natural Telugu script (తెలుగు). "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection, not a question mark.]"
            )
        elif lang == "teluglish":
            return (
                "[Language Directive: Saki asked in Teluglish (Telugu written in English/Latin letters). "
                "You MUST respond naturally in fluent, sweet Teluglish (conversational Telugu using Latin script). "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
            )
        elif lang == "ta":
            return (
                "[Language Directive: Saki asked in Tamil script. Respond completely in fluent, natural Tamil script (தமிழ்). "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection, not a question mark.]"
            )
        elif lang == "tanglish":
            return (
                "[Language Directive: Saki asked in Tanglish (Tamil written in English/Latin letters). "
                "You MUST respond naturally in sweet, natural Tanglish (conversational Tamil using Latin script). "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
            )
        elif lang == "es":
            return (
                "[Language Directive: Saki asked in Spanish. You MUST respond completely in natural, warm, romantic Spanish. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
            )
        elif lang == "fr":
            return (
                "[Language Directive: Saki asked in French. You MUST respond completely in natural, warm, romantic French. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
            )
        elif lang == "de":
            return (
                "[Language Directive: Saki asked in German. You MUST respond completely in natural, warm German. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
            )
        elif lang == "it":
            return (
                "[Language Directive: Saki asked in Italian. You MUST respond completely in natural, warm, romantic Italian. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
            )
        elif lang in ("kn", "ml", "bn", "gu", "pa", "ar", "ru", "ja", "zh", "ko"):
            return (
                f"[Language Directive: Saki asked his question in language '{lang}'. "
                f"You MUST respond naturally, warmly, and fluently in the EXACT SAME LANGUAGE and script. "
                "Akku is Saki's beloved girlfriend. Do not ask questions back. End with a loving reflection and emoji (❤️/✨/😊).]"
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

        # 1. Format Stored Personal Memories (Separating Explicit User Memories from Archive)
        explicit_memories = []
        archive_memories = []
        if personal_memories:
            for mem in personal_memories:
                date_str = f" ({mem.get('timestamp')})" if mem.get('timestamp') else ""
                src_type = mem.get("source_type", "user_memory")
                cat = mem.get("category", "preference")
                subj = mem.get("subject", "")
                subj_str = f" | Subject: {subj}" if subj else ""
                entry = f"- [{cat}{subj_str}]{date_str}: {mem.get('text')}"
                if src_type in ("user_memory", "manual"):
                    explicit_memories.append(f"{entry} (Source: Explicit Saved User Memory ❤️)")
                else:
                    archive_memories.append(entry)

        explicit_section = "\n".join(explicit_memories) if explicit_memories else "None explicitly saved for this specific query."
        archive_section = "\n".join(archive_memories) if archive_memories else "None."

        lang_directive = self.get_language_directive(lang)

        # 2. Fast Path for Simple Factual Queries (< 150 prompt tokens)
        if question_type == "simple":
            system_content = f"""{self.FAST_PERSONA}

=== EXPLICIT SAVED USER MEMORIES (PRIMARY TRUTH - HIGHEST AUTHORITY) ===
{explicit_section}

=== RELATIONSHIP ARCHIVE MEMORIES ===
{archive_section}

CRITICAL MEMORY GROUNDING DIRECTIVE:
1. Explicit Saved User Memories are the HIGHEST AUTHORITY. If an explicit saved memory directly or indirectly answers the question (such as Akku's favorite ice cream, favorite foods, favorite treats, or recent statements), YOU MUST STATE IT WARMLY AND DIRECTLY based on that memory (e.g., "Akku loves vanilla ice cream. ❤️").
2. NEVER claim that "the provided material does not mention..." or "I don't know" when an explicit saved memory is provided above!
3. If an explicit saved memory conflicts with an older document, the explicit saved memory ALWAYS overrides older records."""
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

=== EXPLICIT SAVED USER MEMORIES (PRIMARY TRUTH - HIGHEST AUTHORITY) ===
{explicit_section}

=== RELATIONSHIP ARCHIVE MEMORIES ===
{archive_section}

RETRIEVED DOCUMENT PASSAGES (From Relationship Archive):
{context_text}

SPECIFIC QUESTION-ANSWER KNOWLEDGE REFERENCE:
- Beach & Sunset: One of their most magical memories is watching the sunset together at Besant Nagar beach (Bessie) in Chennai, feeling the cool ocean breeze and making quiet promises.
- Proposal: Saki proposed to Akku on May 4, 2022. After their mechanical class, walking toward the college canteen. Saki spoke about the girl he wanted to marry, shyly hinting it was Akku. While sharing a samosa at the canteen, he said "I love you". Akku happily accepted. They agreed their relationship should inspire them and never affect their academics.
- Birthday: Akku's birthday is October 20. Saki built this AI world as a birthday gift for her.
- How they first connected: They began as college acquaintances after Akku moved from K section to B section in college. Their early conversations covered studies, music, films, campus walks, and language.
- Memorable places: Andhra Mess (podi dosa, paruppu podi), Besant Nagar (Bessie) and Marina Beach in Chennai overlooking the Bay of Bengal, college canteen, Forum Vijaya Mall.
- Academics: Akku is pursuing second year of M.Tech in Data Engineering and preparing for placements.
- Personal Preferences & Favorites: All food, ice cream, color, music, travel, and personal preferences MUST be grounded strictly in the EXPLICIT SAVED USER MEMORIES above. If an explicit saved memory directly or indirectly answers the question (e.g. Akku's favorite ice cream, food, or hobbies), state it directly and warmly! NEVER claim that the provided material does not mention it when an explicit memory exists. If not found in explicit memories or archive, respond honestly: "I don't have that memory saved yet ❤️. If you tell me, I can remember it for next time!"

RESPONSE GUIDELINES:
- SOURCE PRIORITY: 1. Explicit Saved User Memories (Highest Authority), 2. Relationship Archive, 3. General knowledge.
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

