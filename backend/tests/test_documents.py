import os
import pytest
from django.conf import settings
from documents.services.pdf_extractor import PDFExtractor
from documents.services.chunker import DocumentChunker
from documents.services.ingestion_service import IngestionService
from documents.models import Document, DocumentChunk

@pytest.mark.django_db
def test_pdf_extraction_and_empty_pages():
    candidates = [
        os.path.abspath(os.path.join(settings.BASE_DIR, '..', 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')),
        os.path.abspath(os.path.join(settings.BASE_DIR, 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')),
        os.path.abspath(os.path.join(settings.BASE_DIR, 'data', 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')),
    ]
    pdf_path = next((p for p in candidates if os.path.exists(p)), candidates[0])
    assert os.path.exists(pdf_path), "PDF file must exist in workspace"

    result = PDFExtractor.extract_from_pdf(pdf_path)
    assert result['total_pages'] == 27
    assert len(result['pages']) == 27
    # Pages 1 to 7 must contain text
    assert len(result['pages'][0]['text']) > 100
    assert len(result['pages'][1]['text']) > 1000
    # Pages 8 to 27 are recorded in empty_pages
    assert len(result['empty_pages']) >= 15
    assert 8 in result['empty_pages']

def test_text_cleaner():
    raw = "Hello   world \n\n\n\n\nHow are you?\x00"
    cleaned = PDFExtractor.clean_text(raw)
    assert "\x00" not in cleaned
    assert "Hello world" in cleaned
    assert "How are you?" in cleaned

def test_document_chunker():
    chunker = DocumentChunker(chunk_size=100, chunk_overlap=20)
    pages_data = [
        {
            "page_number": 2,
            "text": "Saki and Akku met in college. Saki proposed on May 4, 2022.\n\nThey had a samosa at the canteen.",
            "is_empty": False
        },
        {
            "page_number": 8,
            "text": "",
            "is_empty": True
        }
    ]
    chunks = chunker.chunk_document(pages_data, "test.pdf", "doc_123")
    assert len(chunks) >= 1
    assert chunks[0]["page_number"] == 2
    assert chunks[0]["document_id"] == "doc_123"
    assert "May 4, 2022" in chunks[0]["text"]

@pytest.mark.django_db
def test_content_hash_and_duplicate_detection():
    candidates = [
        os.path.abspath(os.path.join(settings.BASE_DIR, '..', 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')),
        os.path.abspath(os.path.join(settings.BASE_DIR, 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')),
        os.path.abspath(os.path.join(settings.BASE_DIR, 'data', 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')),
    ]
    pdf_path = next((p for p in candidates if os.path.exists(p)), candidates[0])
    hash1 = IngestionService.compute_sha256(pdf_path)
    hash2 = IngestionService.compute_sha256(pdf_path)
    assert hash1 == hash2
    assert len(hash1) == 64
