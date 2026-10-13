import pytest
from rest_framework.test import APIClient
from academics.models import (
    PhDUniversity,
    PhDProgramme,
    PhDSupervisor,
    PhDFundingOpportunity,
    PhDResearchArea,
    PhDUserShortlist,
    PhDUserApplication,
    PhDApplicationDocument,
    PhDUserProfile
)

@pytest.mark.django_db
class TestPhDAcademicsAPI:
    @pytest.fixture(autouse=True)
    def setup_data(self):
        self.client = APIClient()
        self.client.defaults['HTTP_X_USER_ID'] = 'test_user_akku'

        # Create sample university
        self.uni_in = PhDUniversity.objects.create(
            name="Indian Institute of Science (IISc), Bengaluru",
            short_name="IISc",
            country="India",
            country_code="IN",
            city="Bengaluru",
            website_url="https://iisc.ac.in",
            admissions_url="https://admissions.iisc.ac.in",
            verification_status="verified"
        )

        self.uni_us = PhDUniversity.objects.create(
            name="Carnegie Mellon University",
            short_name="CMU",
            country="United States",
            country_code="US",
            city="Pittsburgh",
            website_url="https://cmu.edu",
            admissions_url="https://cs.cmu.edu",
            verification_status="verified"
        )

        # Create sample programmes
        self.prog1 = PhDProgramme.objects.create(
            university=self.uni_in,
            title="PhD in Computational and Data Sciences",
            department="CDS",
            degree_type="PhD",
            research_areas=["Data Engineering and Data Systems", "AI/ML"],
            research_keywords=["Distributed Databases", "Lakehouses"],
            official_url="https://cds.iisc.ac.in/phd",
            application_deadline="March 25",
            mtech_accepted=True,
            funding_status="fully_funded_verified",
            stipend_amount="₹37,000 - ₹42,000/mo",
            verification_status="verified",
            source_url="https://cds.iisc.ac.in/phd"
        )

        self.prog2 = PhDProgramme.objects.create(
            university=self.uni_us,
            title="PhD in Computer Science (Systems)",
            department="CSD",
            degree_type="PhD",
            research_areas=["Data Engineering and Data Systems"],
            research_keywords=["Databases", "Query Optimization"],
            official_url="https://db.cs.cmu.edu",
            application_deadline="December 10",
            mtech_accepted=True,
            funding_status="fully_funded_verified",
            stipend_amount="$44,000/yr",
            verification_status="verified",
            source_url="https://db.cs.cmu.edu"
        )

        # Supervisor
        self.sup = PhDSupervisor.objects.create(
            university=self.uni_in,
            name="Prof. Test Simmhan",
            department="CDS",
            faculty_profile_url="https://cds.iisc.ac.in/test",
            research_interests=["Cloud", "Distributed Databases"],
            recruitment_status="confirmed_open"
        )
        self.sup.programmes.add(self.prog1)

        # Funding
        self.funding = PhDFundingOpportunity.objects.create(
            title="PMRF Scheme",
            provider="Ministry of Education",
            funding_type="government",
            eligible_countries=["India"],
            stipend_amount="₹70,000 - ₹80,000/mo",
            official_source_url="https://pmrf.in",
            verification_status="verified"
        )

        # Research Area
        self.area = PhDResearchArea.objects.create(
            category="Data Engineering and Data Systems",
            name="Distributed Databases",
            slug="distributed-databases"
        )

    def test_phd_stats_endpoint(self):
        res = self.client.get('/api/academics/phd/stats/')
        assert res.status_code == 200
        data = res.json()
        assert data["total_universities"] >= 2
        assert data["total_programmes"] >= 2
        assert data["countries_covered"] >= 2

    def test_universities_list_and_filters(self):
        res = self.client.get('/api/academics/phd/universities/?location=india')
        assert res.status_code == 200
        data = res.json()
        assert all(u["country_code"] == "IN" for u in data["results"])

        res_abroad = self.client.get('/api/academics/phd/universities/?location=abroad')
        assert res_abroad.status_code == 200
        data_abroad = res_abroad.json()
        assert all(u["country_code"] != "IN" for u in data_abroad["results"])

    def test_programmes_list_and_search(self):
        res = self.client.get('/api/academics/phd/programmes/?search=Computational')
        assert res.status_code == 200
        data = res.json()
        assert len(data["results"]) >= 1
        assert "Computational and Data Sciences" in data["results"][0]["title"]

    def test_compare_universities(self):
        res = self.client.post('/api/academics/phd/compare/', {
            "ids": [str(self.prog1.id), str(self.prog2.id)]
        }, format='json')
        assert res.status_code == 200
        data = res.json()
        assert len(data["comparison"]) == 2
        assert data["comparison"][0]["id"] == str(self.prog1.id)

    def test_eligibility_assessment(self):
        res = self.client.post('/api/academics/phd/eligibility/', {
            "profile": {
                "highest_qualification": "M.Tech",
                "has_mtech": True,
                "has_gate": True,
                "preferred_countries": ["India"],
                "primary_research_interests": ["Distributed Databases"]
            }
        }, format='json')
        assert res.status_code == 200
        data = res.json()
        assert "results" in data
        assert any(r["category"] in ["strong_match", "potential_match"] for r in data["results"])

    def test_shortlist_crud_and_isolation(self):
        # Add to shortlist
        res = self.client.post('/api/academics/phd/shortlist/', {
            "programme_id": str(self.prog1.id),
            "priority": "high",
            "notes": "Dream research lab"
        }, format='json')
        assert res.status_code == 201
        item_id = res.json()["id"]

        # Get shortlist
        get_res = self.client.get('/api/academics/phd/shortlist/')
        assert get_res.status_code == 200
        assert get_res.json()["count"] == 1

        # Delete item
        del_res = self.client.delete(f'/api/academics/phd/shortlist/{item_id}/')
        assert del_res.status_code == 200
        assert PhDUserShortlist.objects.count() == 0

    def test_application_tracker_and_documents(self):
        res = self.client.post('/api/academics/phd/applications/', {
            "programme_id": str(self.prog1.id),
            "stage": "in_progress"
        }, format='json')
        assert res.status_code == 201
        app_id = res.json()["id"]

        # Check seeded documents
        app = PhDUserApplication.objects.get(id=app_id)
        assert app.documents.count() >= 5
        doc = app.documents.first()

        # Toggle document
        patch_res = self.client.patch(f'/api/academics/phd/documents/{doc.id}/', {
            "status": "ready"
        }, format='json')
        assert patch_res.status_code == 200
        assert patch_res.json()["status"] == "ready"

    def test_ai_search_grounded_response(self):
        res = self.client.post('/api/academics/phd/ai-search/', {
            "query": "Find PhD programmes in Data Engineering in India"
        }, format='json')
        assert res.status_code == 200
        data = res.json()
        assert data["grounded"] is True
        assert len(data["matched_programmes"]) >= 1
        assert "IISc" in data["answer"] or "Computational" in data["answer"]
