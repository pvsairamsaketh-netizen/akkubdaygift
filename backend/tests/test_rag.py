import pytest
from chat.services.embedding_service import EmbeddingService
from chat.services.retrieval_service import RetrievalService
from chat.services.prompt_service import PromptService
from chat.services.citation_service import CitationService
from documents.services.vector_store import ChromaVectorStore

@pytest.mark.django_db
def test_embedding_service_dimension():
    service = EmbeddingService.get_instance()
    emb = service.embed_query("When did Saki propose to Akku?")
    assert len(emb) == 384
    assert isinstance(emb[0], float)

@pytest.mark.django_db
def test_vector_store_retrieval():
    retrieval = RetrievalService()
    chunks = retrieval.retrieve("When did Saki propose?")
    assert len(chunks) > 0
    # Must retrieve chunks mentioning May 4, 2022 or proposal or samosa
    found_proposal = any("May 4, 2022" in c["text"] or "proposal" in c["text"].lower() for c in chunks)
    assert found_proposal, "Expected retrieval to return the proposal memory chunk"

def test_prompt_service_grounding_rules():
    prompt_svc = PromptService()
    messages = prompt_svc.build_prompt(
        question="Did Saki and Akku get married?",
        retrieved_chunks=[{
            "chunk_id": "c1",
            "text": "The document records repeated hopes to marry, but does not confirm marriage.",
            "metadata": {"page_number": 6}
        }],
        conversation_history=[]
    )
    system_msg = messages[0]["content"]
    assert "Never claim they married" in system_msg
    assert "Ground all relationship facts strictly" in system_msg
    assert "[Page 6]" in system_msg

def test_citation_extraction():
    chunks = [{
        "chunk_id": "chunk_42",
        "text": "Saki proposed on May 4, 2022 during a walk to the canteen.",
        "score": 0.825,
        "metadata": {"page_number": 2, "email_subject": "Proposal Memory"}
    }]
    citations = CitationService.extract_citations(chunks)
    assert len(citations) == 1
    assert citations[0]["page_number"] == 2
    assert citations[0]["relevance_score"] == 0.825
    assert "May 4, 2022" in citations[0]["snippet"]

def test_citation_service_speech_sanitization():
    raw_answer = "Saki proposed on May 4, 2022 [Page 2]. **He said** 'I love you' over a samosa [Page 5]."
    clean = CitationService.clean_text_for_speech(raw_answer)
    assert "[Page 2]" not in clean
    assert "[Page 5]" not in clean
    assert "**" not in clean
    assert "Saki proposed on May 4, 2022" in clean
