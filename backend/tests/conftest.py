import pytest
from chat.services.embedding_service import EmbeddingService
from documents.services.vector_store import ChromaVectorStore

@pytest.fixture(autouse=True)
def seed_test_vector_store():
    """
    Ensure the vector store has at least one proposal chunk for tests in CI environments
    where the persistent database might not be pre-seeded.
    """
    store = ChromaVectorStore.get_instance()
    if store.count() == 0:
        emb_svc = EmbeddingService.get_instance()
        text = "Saki proposed to Akku on May 4, 2022 during a walk to the canteen over a hot samosa."
        emb = emb_svc.embed_query(text)
        store.add_chunks(
            chunks=[{
                "chunk_id": "test_seed_proposal_1",
                "text": text,
                "metadata": {"document_id": "test_seed_doc", "page_number": 2, "email_subject": "Proposal Memory"}
            }],
            embeddings=[emb]
        )
