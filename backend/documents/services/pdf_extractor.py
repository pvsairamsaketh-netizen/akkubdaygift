"""
PDF Extraction Service for Saki & Akku relationship document.
Uses PyMuPDF to extract text page-by-page while preserving page numbers,
structure, and tracking empty pages.
"""

import os
import re
import logging
from typing import List, Dict, Any, Tuple
import pymupdf

logger = logging.getLogger(__name__)

class PDFExtractor:
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean extraction artifacts while preserving meaning and structure.
        """
        if not text:
            return ""
        # Normalize multiple spaces, but preserve newlines
        lines = [re.sub(r'[ \t]+', ' ', line.strip()) for line in text.splitlines()]
        # Remove repeated empty lines
        cleaned_lines = []
        empty_count = 0
        for line in lines:
            if not line:
                empty_count += 1
                if empty_count <= 1:
                    cleaned_lines.append("")
            else:
                empty_count = 0
                cleaned_lines.append(line)
        cleaned_text = "\n".join(cleaned_lines).strip()
        # Clean control characters
        cleaned_text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', cleaned_text)
        return cleaned_text

    @classmethod
    def extract_from_pdf(cls, file_path: str) -> Dict[str, Any]:
        """
        Extract pages and text from a PDF document.
        Returns:
            dict containing:
                - pages: List[Dict] with page_number, text, char_length, is_empty
                - total_pages: int
                - empty_pages: List[int]
                - total_chars: int
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found at: {file_path}")

        pages_data = []
        empty_pages = []
        total_chars = 0

        try:
            doc = pymupdf.open(file_path)
            total_pages = len(doc)

            for page_idx in range(total_pages):
                page_num = page_idx + 1
                try:
                    page = doc[page_idx]
                    raw_text = page.get_text("text") or ""
                    cleaned = cls.clean_text(raw_text)

                    is_empty = len(cleaned.strip()) == 0
                    if is_empty:
                        empty_pages.append(page_num)

                    pages_data.append({
                        "page_number": page_num,
                        "text": cleaned,
                        "char_length": len(cleaned),
                        "is_empty": is_empty
                    })
                    total_chars += len(cleaned)
                except Exception as page_err:
                    logger.warning(f"Error extracting page {page_num}: {page_err}")
                    empty_pages.append(page_num)
                    pages_data.append({
                        "page_number": page_num,
                        "text": "",
                        "char_length": 0,
                        "is_empty": True,
                        "error": str(page_err)
                    })

            doc.close()
            return {
                "pages": pages_data,
                "total_pages": total_pages,
                "empty_pages": empty_pages,
                "total_chars": total_chars
            }

        except Exception as e:
            logger.error(f"Failed to extract PDF {file_path}: {e}")
            raise RuntimeError(f"PDF extraction error: {e}") from e
