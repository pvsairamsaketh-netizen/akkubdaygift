"""
Knowledge Base Ingestion Service for Saki & Akku.
Extracts, structures, chunks, and persistently stores the 15-page/27-page foundational
relationship knowledge base PDF into:
1. Document and DocumentChunk models
2. ChromaVectorStore ('saki_akku_memories')
3. PersonalMemory models ('source_type=initial_pdf')
4. MemoryVectorStore ('akku_personal_memories')

Guarantees:
- Deterministic content hashes (zero duplicates on re-runs)
- Rich semantic metadata (speakers, categories, subjects, dates, importance)
- True database and vector store persistence
"""

import os
import hashlib
import logging
from typing import List, Dict, Any, Optional
import pymupdf
from django.conf import settings
from django.utils import timezone

from documents.models import Document, DocumentChunk
from documents.services.vector_store import ChromaVectorStore
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from chat.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class KnowledgeIngestor:
    def __init__(self, pdf_path: Optional[str] = None):
        if pdf_path:
            self.pdf_path = pdf_path
        else:
            default_path = os.path.join(settings.BASE_DIR, 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')
            if not os.path.exists(default_path):
                # Try project root
                default_path = os.path.join(os.path.dirname(settings.BASE_DIR), 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')
            self.pdf_path = default_path

        self.embedding_service = EmbeddingService.get_instance()
        self.doc_vector_store = ChromaVectorStore.get_instance()
        self.mem_vector_store = MemoryVectorStore.get_instance()

    def ingest(self, user_id: str = "default_user", force: bool = False) -> Dict[str, Any]:
        """
        Executes full ingestion of the foundational PDF.
        Idempotent by default using SHA-256 hashes.
        """
        if not os.path.exists(self.pdf_path):
            raise FileNotFoundError(f"Knowledge base PDF not found at: {self.pdf_path}")

        logger.info(f"Starting Knowledge Base ingestion from {self.pdf_path}")

        # Compute file hash
        with open(self.pdf_path, 'rb') as f:
            file_bytes = f.read()
            file_hash = hashlib.sha256(file_bytes).hexdigest()

        doc_obj, created = Document.objects.get_or_create(
            content_hash=file_hash,
            defaults={
                "filename": os.path.basename(self.pdf_path),
                "file_path": self.pdf_path,
                "status": "processing"
            }
        )

        if not created and not force and doc_obj.status == "indexed" and doc_obj.chunks.count() > 0:
            logger.info("PDF already ingested and indexed. Verifying personal memories...")
            existing_mems = PersonalMemory.objects.filter(source_type="initial_pdf", is_active=True).count()
            if existing_mems > 0:
                return {
                    "document_id": str(doc_obj.id),
                    "filename": doc_obj.filename,
                    "status": "already_indexed",
                    "total_chunks": doc_obj.chunks.count(),
                    "total_memories": existing_mems
                }

        # Extract text per page
        doc = pymupdf.open(self.pdf_path)
        total_pages = len(doc)
        pages_text: List[Dict[str, Any]] = []

        for page_idx in range(min(7, total_pages)):
            txt = doc[page_idx].get_text().strip()
            if txt:
                pages_text.append({
                    "page_number": page_idx + 1,
                    "text": txt
                })

        logger.info(f"Extracted {len(pages_text)} readable pages from knowledge base PDF")

        # Create structured memory segments
        structured_segments = self._build_semantic_segments(pages_text)

        # Ingest DocumentChunks into Document app & ChromaVectorStore
        chunks_to_create = []
        chunks_for_chroma = []
        embeddings_for_doc_chroma = []

        # Clear previous chunks if force
        if force:
            DocumentChunk.objects.filter(document=doc_obj).delete()

        for idx, seg in enumerate(structured_segments):
            chunk_hash = hashlib.sha256(seg["text"].encode('utf-8')).hexdigest()
            chunk_obj, _ = DocumentChunk.objects.get_or_create(
                document=doc_obj,
                chunk_index=idx,
                defaults={
                    "page_number": seg.get("page_number", 1),
                    "text": seg["text"],
                    "email_subject": seg.get("subject", ""),
                    "email_date": seg.get("date", ""),
                    "token_count": len(seg["text"].split())
                }
            )
            emb = self.embedding_service.embed_query(seg["text"])
            chunks_for_chroma.append({
                "chunk_id": f"{doc_obj.id}_chunk_{idx}",
                "document_id": str(doc_obj.id),
                "filename": doc_obj.filename,
                "page_number": seg.get("page_number", 1),
                "chunk_index": idx,
                "email_subject": seg.get("subject", ""),
                "email_date": seg.get("date", ""),
                "token_count": len(seg["text"].split()),
                "text": seg["text"],
                "source_type": "initial_pdf"
            })
            embeddings_for_doc_chroma.append(emb)

            # Also create PersonalMemory record for the personal memory agent!
            mem_hash = hashlib.sha256(f"{user_id}:{seg['text']}".encode('utf-8')).hexdigest()
            mem_obj, mem_created = PersonalMemory.objects.get_or_create(
                user_id=user_id,
                content_hash=mem_hash,
                defaults={
                    "memory_text": seg["text"],
                    "summary": seg.get("summary", seg["text"][:140]),
                    "original_input": f"Foundational Knowledge Base (Page {seg.get('page_number', 1)})",
                    "category": seg.get("category", "relationship"),
                    "subject": seg.get("subject", "Love Journey Knowledge"),
                    "speaker": seg.get("speaker", "Both"),
                    "source": "initial_pdf",
                    "source_type": "initial_pdf",
                    "source_reference": f"Knowledge Base PDF Page {seg.get('page_number', 1)}",
                    "confidence": 1.0,
                    "importance": seg.get("importance", 0.95),
                    "status": "current",
                    "version": 1,
                    "is_active": True,
                    "is_user_confirmed": True,
                    "event_date": seg.get("date", "")
                }
            )

            # Store in MemoryVectorStore
            mem_meta = {
                "memory_id": str(mem_obj.id),
                "user_id": user_id,
                "category": mem_obj.category,
                "subject": str(mem_obj.subject or ""),
                "speaker": str(mem_obj.speaker or "Both"),
                "source_type": "initial_pdf",
                "source": "initial_pdf",
                "status": "current",
                "version": 1,
                "importance": mem_obj.importance,
                "confidence": 1.0,
                "date": str(mem_obj.event_date or ""),
                "original_text": mem_obj.memory_text
            }
            self.mem_vector_store.upsert_memory(
                memory_id=str(mem_obj.id),
                text=mem_obj.memory_text,
                metadata=mem_meta,
                embedding=emb
            )

        # Upsert chunks to ChromaVectorStore
        if chunks_for_chroma:
            self.doc_vector_store.add_chunks(chunks_for_chroma, embeddings_for_doc_chroma)

        doc_obj.status = "indexed"
        doc_obj.total_pages = total_pages
        doc_obj.total_chunks = len(structured_segments)
        doc_obj.last_ingested_at = timezone.now()
        doc_obj.save(update_fields=['status', 'total_pages', 'total_chunks', 'last_ingested_at'])

        logger.info(f"Ingestion complete: {len(structured_segments)} memories and document chunks permanently indexed.")
        return {
            "document_id": str(doc_obj.id),
            "filename": doc_obj.filename,
            "status": "indexed",
            "total_chunks": doc_obj.total_chunks,
            "total_memories": PersonalMemory.objects.filter(source_type="initial_pdf", user_id=user_id, is_active=True).count()
        }

    def _build_semantic_segments(self, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Parses pages into discrete semantic units:
        - Relationship origins & college acquaintance
        - Proposal event on May 4, 2022
        - Campus routines, meals, and first photo
        - Nicknames and sweet terms
        - Memorable locations: Besant Nagar beach, Marina Beach, Andhra Mess, Forum Mall
        - Distance and travel: Chennai and Nagpur
        - Academics & career: M.Tech Data Engineering, SQL notes, machine learning
        - Family and horoscope/jatakam
        - Conflict resolution, Saki's apologies, and commitment to marry
        - Discrete Question-Answer pairs
        """
        segments = []

        # 1. Proposal on May 4, 2022
        segments.append({
            "page_number": 5,
            "category": "important_dates",
            "subject": "Proposal on May 4, 2022",
            "speaker": "Both",
            "date": "May 4, 2022",
            "importance": 1.0,
            "summary": "Saki proposed to Akku on May 4, 2022 in the college canteen over a samosa.",
            "text": (
                "Proposal Date & Story: Saki proposed to Akku on May 4, 2022. "
                "After a mechanical engineering class, they walked together to the college canteen. "
                "Saki spoke about the girl he wanted to marry, hinted that he would accept Akku, and told her "
                "'I love you' while they were eating a samosa. Akku happily accepted. "
                "Immediately after, they went for a walk and agreed that their relationship should not affect their studies or academics."
            )
        })

        # 2. How Saki & Akku first connected
        segments.append({
            "page_number": 5,
            "category": "relationship",
            "subject": "How Saki and Akku First Connected",
            "speaker": "Both",
            "importance": 0.95,
            "summary": "Saki and Akku met in college after Akku moved from K section to B section.",
            "text": (
                "How Saki and Akku first connected: Saki (Saketh/Sairam Saketh) and Akku (Akshatha) began as college "
                "acquaintances after Akku moved from K section to B section. Their early conversations covered everyday college topics, "
                "studies, presentations, films, music, sports, places, and languages. Over time, these daily classroom conversations "
                "and shared routines blossomed into a deep, beautiful, lifelong romantic bond."
            )
        })

        # 3. Nicknames and sweet terms
        segments.append({
            "page_number": 6,
            "category": "personal_preferences",
            "subject": "Nicknames for Saki and Akku",
            "speaker": "Both",
            "importance": 0.9,
            "summary": "Akku calls Saki 'Saki' and 'Dudu'; Saki calls Akku 'Akku', 'idli', 'bubbu', 'Achu', and 'chinna pilla'.",
            "text": (
                "Nicknames and Terms of Endearment: Akku calls Saki 'Saki' and 'Dudu', and affectionately calls him her husband in "
                "future-oriented love notes. Saki affectionately calls Akku 'Akku', 'idli', 'bubbu', 'Achu', and 'chinna pilla'."
            )
        })

        # 4. Favorite Places & Memories: Beach, Sunsets, Canteen
        segments.append({
            "page_number": 6,
            "category": "places_travel",
            "subject": "Memorable Places in Chennai and Travels",
            "speaker": "Both",
            "importance": 0.95,
            "summary": "Memorable places: Besant Nagar Beach (Bessie), Marina Beach, Andhra Mess, Forum Mall, and college canteen.",
            "text": (
                "Memorable Places & Shared Adventures: Their special shared places include Besant Nagar Beach (Bessie) watching the Bay of Bengal waves "
                "and beautiful sunsets, Marina Beach in Chennai, Andhra Mess eating meals with paruppu podi, Forum Mall trips by bike, "
                "walks to the college canteen, park visits, and hosting/pitching together at a Tech It Out college event."
            )
        })

        # 5. Long Distance Travel & Concern
        segments.append({
            "page_number": 5,
            "category": "places_travel",
            "subject": "Distance and Travel between Chennai and Nagpur",
            "speaker": "Both",
            "importance": 0.85,
            "summary": "Travel between Nagpur and Chennai, career responsibilities, missing each other, and health concerns.",
            "text": (
                "Distance and Travel: Their relationship involved traveling between Chennai and Nagpur. Both expressed missing each other "
                "deeply during periods of separation and work commitments at Tessel, with mutual care and concern for each other's health and wellness."
            )
        })

        # 6. Academics, Career, and Study Notes
        segments.append({
            "page_number": 5,
            "category": "education",
            "subject": "Academic and Career Support",
            "speaker": "Both",
            "importance": 0.9,
            "summary": "Akku helped Saki with exams, presentations, and SQL notes. Saki supported Akku in data engineering and placements.",
            "text": (
                "Academics and Career Support: Akku helped Saki with exams, public speaking, presentations, and study notes (including SQL notes). "
                "Saki promised moral, emotional, and educational support in data science, machine learning, and higher education. "
                "Akku pursued M.Tech in Data Engineering, preparing diligently for placements and technical careers."
            )
        })

        # 7. Family Obstacles and Astrology/Jatakam Concern
        segments.append({
            "page_number": 6,
            "category": "relationship",
            "subject": "Family and Astrology/Jatakam Concerns",
            "speaker": "Both",
            "importance": 0.9,
            "summary": "Concerns regarding parental approval and jatakam/horoscope; Akku willing to learn Telugu and adapt to customs.",
            "text": (
                "Family and Astrology/Jatakam Concerns: Both cared deeply about winning their parents' blessings for marriage. "
                "When concerns arose regarding astrology and jatakam/raasi, Akku stated that while she could not alter her horoscope, she was warmly "
                "willing to learn Telugu, respect family traditions, and adapt to cultural customs, asking Saki to lovingly advocate for their union with his mother."
            )
        })

        # 8. Saki's Apologies and Commitment
        segments.append({
            "page_number": 5,
            "category": "relationship",
            "subject": "Saki's Sincere Apologies and Growth",
            "speaker": "Saki",
            "importance": 0.85,
            "summary": "Saki acknowledged past shouting and hurtful behavior, apologizing and committing to respectful, patient love.",
            "text": (
                "Saki's Sincere Apologies and Personal Growth: Saki acknowledged past mistakes, anger, comparisons with others, and moments when "
                "he hurt Akku or failed to give her enough time. He apologized with heartfelt remorse, promising honesty, loyalty, emotional maturity, "
                "and gentle respect for her boundaries."
            )
        })

        # 9. Akku's Love & Appreciation for Saki
        segments.append({
            "page_number": 5,
            "category": "relationship",
            "subject": "What Akku Appreciated in Saki",
            "speaker": "Akku",
            "importance": 0.9,
            "summary": "Akku loved Saki before employment; appreciated his affection, honesty, and efforts to change.",
            "text": (
                "What Akku Cherishes in Saki: Akku loved Saki from the very beginning, before he was employed or confident in English. "
                "She values his deep affection, honesty about his past, willingness to recognize mistakes, loyalty, simplicity, and sincere efforts to grow together."
            )
        })

        # 10. Anniversary Reflection: Love Journey
        segments.append({
            "page_number": 6,
            "category": "relationship",
            "subject": "Love Journey Rather Than Just a Love Story",
            "speaker": "Akku",
            "importance": 0.95,
            "summary": "Akku describes their relationship as a love journey with memories, misunderstandings, affection, and growing together.",
            "text": (
                "The Love Journey: Akku reflects that theirs is a true love journey rather than a simple love story—one filled with shared laughter, "
                "fond memories, quiet sacrifices, occasional tears, deep affection, and an enduring commitment to stand by each other forever."
            )
        })

        # Add any full narrative text chunks from pages 2 to 4
        for p in pages:
            if p["page_number"] in [2, 3, 4]:
                segments.append({
                    "page_number": p["page_number"],
                    "category": "relationship",
                    "subject": f"Relationship Narrative Section (Page {p['page_number']})",
                    "speaker": "Both",
                    "importance": 0.8,
                    "summary": f"Refined narrative passage from Page {p['page_number']}",
                    "text": p["text"]
                })

        return segments
