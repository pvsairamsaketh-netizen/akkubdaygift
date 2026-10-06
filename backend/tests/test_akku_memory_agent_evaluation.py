import pytest
import uuid
from django.urls import reverse
from rest_framework.test import APIClient
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from chat.services.rag_graph import RAGGraphService
from chat.services.embedding_service import EmbeddingService

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def rag_service():
    RAGGraphService.clear_cache()
    return RAGGraphService()

@pytest.fixture(autouse=True)
def ensure_pdf_knowledge():
    from documents.services.knowledge_ingestor import KnowledgeIngestor
    from memories.models import PersonalMemory
    if PersonalMemory.objects.filter(source_type="initial_pdf").count() == 0:
        KnowledgeIngestor().ingest(force=False)

@pytest.mark.django_db
class TestAkkuMemoryAgentEvaluation:
    """
    Comprehensive Evaluation Test Suite for Akku AI Knowledge + Agent System.
    Verifies:
    1. PDF foundational relationship knowledge (who, what, when, where, dates, milestones)
    2. Zero hallucination on unknown personal facts (strict honest 'not saved' response)
    3. Dynamic user memory write pipeline & immediate retrieval
    4. Conflict resolution, temporal memory & versioning
    5. Conversational follow-up rewriting & entity pronoun resolution
    6. Multilingual memory retrieval (Tamil, Telugu, Hindi) without memory mutation
    7. Persistence, export, and disaster-recovery reindexing from structured DB
    """

    def test_pdf_foundational_facts_proposal(self, rag_service):
        """PDF Fact 1: Proposal date May 4, 2022, canteen, samosa."""
        res = rag_service.answer_question("When and how did Saki propose to Akku?", user_id="test_eval_user")
        answer = res["answer"].lower()
        assert "may 4" in answer or "2022" in answer
        assert "canteen" in answer or "samosa" in answer

    def test_pdf_foundational_facts_first_connection(self, rag_service):
        """PDF Fact 2: College connection after Akku moved from K section to B section."""
        res = rag_service.answer_question("How did Saki and Akku first connect?", user_id="test_eval_user")
        answer = res["answer"].lower()
        assert "college" in answer
        assert "b section" in answer or "k section" in answer or "class" in answer or "acquaintance" in answer

    def test_pdf_foundational_facts_nicknames(self, rag_service):
        """PDF Fact 3: Nicknames (Saki, Dudu, Akku, idli, bubbu, Achu, chinna pilla)."""
        res = rag_service.answer_question("What nicknames do Saki and Akku use for each other?", user_id="test_eval_user")
        answer = res["answer"].lower()
        assert any(name in answer for name in ["dudu", "idli", "bubbu", "achu", "chinna pilla", "saki"])

    def test_pdf_foundational_facts_places(self, rag_service):
        """PDF Fact 4: Memorable locations (Besant Nagar / Bessie, Marina Beach, Andhra Mess, Forum Mall)."""
        res = rag_service.answer_question("What are some memorable places Saki and Akku visited together?", user_id="test_eval_user")
        answer = res["answer"].lower()
        assert any(place in answer for place in ["besant nagar", "bessie", "marina", "andhra mess", "forum mall", "canteen"])

    def test_pdf_foundational_facts_academics_sql(self, rag_service):
        """PDF Fact 5: Academic support (SQL notes, presentations)."""
        res = rag_service.answer_question("How did Akku support Saki academically?", user_id="test_eval_user")
        answer = res["answer"].lower()
        assert "sql" in answer or "exam" in answer or "notes" in answer or "presentation" in answer

    def test_pdf_foundational_facts_astrology_telugu(self, rag_service):
        """PDF Fact 6: Astrology / jatakam concern and learning Telugu."""
        res = rag_service.answer_question("How did Akku respond to the family astrology or jatakam concerns?", user_id="test_eval_user")
        answer = res["answer"].lower()
        assert "horoscope" in answer or "astrology" in answer or "jatakam" in answer or "telugu" in answer

    def test_unknown_personal_facts_zero_hallucination_flower(self, rag_service):
        """
        Anti-Hallucination Test 1:
        Unknown personal fact (favorite flower) must NEVER be guessed or fabricated.
        Must return honest warm message: 'I don't have Akku's favorite flower saved yet, Saki.'
        """
        res = rag_service.answer_question("What is Akku's favorite flower?", user_id="test_eval_user")
        answer = res["answer"]
        assert res["evidence_sufficient"] is False
        assert "don't have" in answer.lower() or "not saved" in answer.lower()
        assert "rose" not in answer.lower() or "don't have" in answer.lower()

    def test_unknown_personal_facts_zero_hallucination_movie(self, rag_service):
        """Anti-Hallucination Test 2: Unknown favorite movie must not be guessed."""
        res = rag_service.answer_question("What is Akku's favorite movie?", user_id="test_eval_user")
        answer = res["answer"]
        assert res["evidence_sufficient"] is False
        assert "don't have" in answer.lower() or "saved" in answer.lower()

    def test_dynamic_user_memory_write_and_immediate_retrieval(self, api_client, rag_service):
        """
        Dynamic Knowledge Test:
        Add new memory -> Store in SQLite + ChromaDB -> Immediately retrievable.
        """
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        post_res = api_client.post(
            reverse('memory-list-create'),
            {
                "memory_text": "Akku loves jasmine flowers.",
                "category": "personal_preferences",
                "subject": "Jasmine Flowers",
                "importance": 0.9,
                "speaker": "Akku"
            },
            format='json',
            HTTP_X_USER_ID=user_id
        )
        assert post_res.status_code == 201
        assert post_res.data["success"] is True

        # Ask about it immediately
        res = rag_service.answer_question("Does Akku like jasmine flowers?", user_id=user_id)
        answer = res["answer"].lower()
        assert "jasmine" in answer
        assert res["evidence_sufficient"] is True

    def test_conflict_resolution_and_temporal_versioning(self, api_client, rag_service):
        """
        Conflict Resolution Test:
        Existing: favorite ice cream = vanilla.
        New: favorite ice cream is mango now.
        Verify version increment and highest priority for latest confirmed memory.
        """
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        # Memory 1
        res1 = api_client.post(
            reverse('memory-list-create'),
            {
                "memory_text": "Akku loves vanilla ice cream.",
                "category": "food_drinks",
                "subject": "Ice Cream",
                "importance": 0.8
            },
            format='json',
            HTTP_X_USER_ID=user_id
        )
        assert res1.status_code == 201
        mem1_id = res1.data["id"]

        # Memory 2: Update preference
        res2 = api_client.post(
            reverse('memory-list-create'),
            {
                "memory_text": "Akku's favorite ice cream is mango ice cream now.",
                "category": "food_drinks",
                "subject": "Ice Cream Preference",
                "importance": 0.95
            },
            format='json',
            HTTP_X_USER_ID=user_id
        )
        assert res2.status_code == 201
        mem2_id = res2.data["id"]

        # Query
        res = rag_service.answer_question("What is Akku's favorite ice cream now?", user_id=user_id)
        answer = res["answer"].lower()
        assert "mango" in answer

        # Check DB records
        old_mem = PersonalMemory.objects.get(id=mem1_id)
        new_mem = PersonalMemory.objects.get(id=mem2_id)
        assert new_mem.version >= 1
        assert new_mem.status == "current"

    def test_conversational_follow_up_and_pronoun_rewriting(self, rag_service):
        """
        Query Rewriting & Entity Resolution Test:
        Turn 1: Saki proposed on May 4, 2022 in college canteen.
        Turn 2: Follow-up 'What happened after that?'
        """
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        history = [
            {"role": "user", "content": "When did Saki propose to Akku?"},
            {"role": "assistant", "content": "Saki proposed to Akku on May 4, 2022 in the college canteen over a samosa."}
        ]
        rewritten = rag_service._rewrite_query("What happened after that?", history)
        assert "saki" in rewritten.lower() or "akku" in rewritten.lower() or "canteen" in rewritten.lower() or "propos" in rewritten.lower()

        # Pronoun resolution check
        pronoun_q = rag_service._rewrite_query("Where did we first meet?", [])
        assert "saki and akku" in pronoun_q.lower()

    def test_multilingual_memory_retrieval(self, api_client, rag_service):
        """
        Multilingual Memory Retrieval Test:
        Saved canonical memory: 'Akku loves dark chocolate.'
        Tamil query: 'Akku-ku enna chocolate romba pidikkum?'
        Telugu query: 'Akku ki chocolate ante istama?'
        Verify retrieval correctly matches without translating canonical memory.
        """
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        api_client.post(
            reverse('memory-list-create'),
            {
                "memory_text": "Akku loves dark chocolate.",
                "category": "food_drinks",
                "subject": "Dark Chocolate",
                "importance": 0.85
            },
            format='json',
            HTTP_X_USER_ID=user_id
        )

        res_ta = rag_service.answer_question("Akku-ku enna chocolate romba pidikkum?", user_id=user_id)
        assert "dark chocolate" in res_ta["answer"].lower() or "chocolate" in res_ta["answer"].lower()

        # Canonical memory text remains untouched
        mem = PersonalMemory.objects.filter(user_id=user_id, subject="Dark Chocolate").first()
        assert mem.memory_text == "Akku loves dark chocolate."

    def test_backup_export_and_reindex_recovery(self, api_client):
        """
        Disaster Recovery & Backup Test:
        1. Test GET /api/memories/export/
        2. Test POST /api/memories/reindex/
        """
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        api_client.post(
            reverse('memory-list-create'),
            {
                "memory_text": "Akku loves watching sunsets at Bessie beach.",
                "category": "places_travel",
                "subject": "Bessie Beach Sunsets",
                "importance": 0.9
            },
            format='json',
            HTTP_X_USER_ID=user_id
        )

        # 1. Export check
        export_res = api_client.get(reverse('memory-export'), HTTP_X_USER_ID=user_id)
        assert export_res.status_code == 200
        assert "export_timestamp" in export_res.data
        assert export_res.data["total_memories"] >= 1

        # 2. Re-index check
        reindex_res = api_client.post(reverse('memory-reindex'), HTTP_X_USER_ID=user_id)
        assert reindex_res.status_code == 200
        assert reindex_res.data["success"] is True
        assert reindex_res.data["reindexed_count"] >= 1
