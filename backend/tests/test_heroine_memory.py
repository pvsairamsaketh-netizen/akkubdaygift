import pytest
from chat.services.rag_graph import RAGGraphService
from memories.models import PersonalMemory

@pytest.mark.django_db
class TestHeroineMemoryRAG:
    def test_saved_heroine_memory_grounded_answer(self):
        """Verify that when 'Akku favourite heroine is Sai Pallavi' is saved, asking for her favourite heroine answers correctly."""
        PersonalMemory.objects.create(
            user_id="default_user",
            memory_text="Akku favourite heroine is Sai Pallavi",
            category="likes_dislikes",
            subject="Films",
            source_type="user_memory",
            status="current",
            version=2,
            is_active=True
        )

        svc = RAGGraphService()
        svc.clear_cache()
        res = svc.answer_question("Who is akkus favourite heroine ?")

        assert res.get("grounded") is True
        ans = res.get("answer", "")
        assert "Sai Pallavi" in ans
        assert "not have that memory" not in ans.lower()
        assert "don't have" not in ans.lower()

    def test_hero_and_heroine_distinction(self):
        """Verify that asking for favorite hero does not confuse with heroine memory."""
        PersonalMemory.objects.create(
            user_id="default_user",
            memory_text="Akku favourite heroine is Sai Pallavi",
            category="likes_dislikes",
            subject="Films",
            source_type="user_memory",
            status="current",
            version=2,
            is_active=True
        )

        svc = RAGGraphService()
        svc.clear_cache()
        res = svc.answer_question("Who is Akku's favourite hero?")
        ans = res.get("answer", "")

        # Should either say Thalapathy Vijay (canonical) or not have saved memory, but NOT Sai Pallavi
        assert "sai pallavi" not in ans.lower()
