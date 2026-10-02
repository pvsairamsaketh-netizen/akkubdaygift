"""
Text Chunking Service for RAG Pipeline.
Preserves page numbers, paragraph structure, and metadata with configurable chunk size and overlap.
"""

import re
from typing import List, Dict, Any

class DocumentChunker:
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 120):
        """
        chunk_size: approximate character or token length (defaults ~800 tokens, approx 2400 chars)
        chunk_overlap: approximate character or token overlap (defaults ~120 tokens, approx 400 chars)
        """
        # Roughly 1 token ~= 3.5 to 4 characters
        self.chunk_size_chars = chunk_size * 4
        self.overlap_chars = chunk_overlap * 4

    def chunk_page(
        self,
        page_number: int,
        page_text: str,
        filename: str,
        document_id: str,
        start_chunk_idx: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Splits text from a single page into overlapping chunks while preserving
        boundaries (paragraphs, questions/answers, and headings).
        """
        if not page_text or not page_text.strip():
            return []

        # If page is shorter than chunk size, return as a single cohesive chunk
        if len(page_text) <= self.chunk_size_chars:
            subject, date = self._extract_subject_date(page_text)
            return [{
                "chunk_id": f"{document_id}_p{page_number}_c{start_chunk_idx}",
                "chunk_index": start_chunk_idx,
                "document_id": document_id,
                "filename": filename,
                "page_number": page_number,
                "text": page_text.strip(),
                "token_count": len(page_text) // 4,
                "email_subject": subject,
                "email_date": date,
                "source_type": "pdf_narrative"
            }]

        # Split into semantic units: paragraphs or Q&A items
        paragraphs = re.split(r'\n{2,}', page_text)
        chunks = []
        current_chunk = []
        current_len = 0
        chunk_idx = start_chunk_idx

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            para_len = len(para)

            # If adding this paragraph exceeds chunk size and we already have content
            if current_len + para_len > self.chunk_size_chars and current_chunk:
                combined_text = "\n\n".join(current_chunk)
                subject, date = self._extract_subject_date(combined_text)
                chunks.append({
                    "chunk_id": f"{document_id}_p{page_number}_c{chunk_idx}",
                    "chunk_index": chunk_idx,
                    "document_id": document_id,
                    "filename": filename,
                    "page_number": page_number,
                    "text": combined_text,
                    "token_count": len(combined_text) // 4,
                    "email_subject": subject,
                    "email_date": date,
                    "source_type": "pdf_narrative"
                })
                chunk_idx += 1

                # Calculate overlap: keep the last paragraph or partial text
                overlap_text = ""
                if current_chunk:
                    last_para = current_chunk[-1]
                    if len(last_para) <= self.overlap_chars:
                        overlap_text = last_para

                if overlap_text:
                    current_chunk = [overlap_text, para]
                    current_len = len(overlap_text) + len(para)
                else:
                    current_chunk = [para]
                    current_len = len(para)
            else:
                current_chunk.append(para)
                current_len += para_len

        # Append any remaining chunk
        if current_chunk:
            combined_text = "\n\n".join(current_chunk)
            subject, date = self._extract_subject_date(combined_text)
            chunks.append({
                "chunk_id": f"{document_id}_p{page_number}_c{chunk_idx}",
                "chunk_index": chunk_idx,
                "document_id": document_id,
                "filename": filename,
                "page_number": page_number,
                "text": combined_text,
                "token_count": len(combined_text) // 4,
                "email_subject": subject,
                "email_date": date,
                "source_type": "pdf_narrative"
            })

        return chunks

    def chunk_document(
        self,
        pages_data: List[Dict[str, Any]],
        filename: str,
        document_id: str
    ) -> List[Dict[str, Any]]:
        """
        Chunks all pages of a document and preserves continuous chunk indices.
        """
        all_chunks = []
        global_chunk_idx = 0

        for p in pages_data:
            if p.get("is_empty", False):
                continue
            page_chunks = self.chunk_page(
                page_number=p["page_number"],
                page_text=p["text"],
                filename=filename,
                document_id=document_id,
                start_chunk_idx=global_chunk_idx
            )
            all_chunks.extend(page_chunks)
            global_chunk_idx += len(page_chunks)

        return all_chunks

    @staticmethod
    def _extract_subject_date(text: str) -> tuple[str, str]:
        """
        Attempts to detect email subject or date if present in chunk.
        """
        subject = ""
        date = ""
        sub_match = re.search(r'(?:Subject|Topic|Theme):\s*([^\n]+)', text, re.IGNORECASE)
        if sub_match:
            subject = sub_match.group(1).strip()
        date_match = re.search(r'(?:Date|Timeline|When):\s*([^\n]+)', text, re.IGNORECASE)
        if date_match:
            date = date_match.group(1).strip()
        return subject, date
