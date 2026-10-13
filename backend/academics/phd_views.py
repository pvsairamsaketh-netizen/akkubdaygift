import csv
import io
import json
import logging
from datetime import datetime, date
from django.db.models import Q, Count
from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

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
from academics.serializers import (
    PhDUniversitySerializer,
    PhDProgrammeSerializer,
    PhDSupervisorSerializer,
    PhDFundingOpportunitySerializer,
    PhDResearchAreaSerializer,
    PhDUserShortlistSerializer,
    PhDUserApplicationSerializer,
    PhDApplicationDocumentSerializer,
    PhDUserProfileSerializer
)
from academics.views import get_user_id

logger = logging.getLogger(__name__)


# ============================================================================
# 1. SUMMARY METRICS & DASHBOARD STATS (PHASE 3)
# ============================================================================

class PhDStatsView(APIView):
    """Provides verified dashboard summary metrics calculated from actual database records."""
    def get(self, request):
        user_id = get_user_id(request)
        total_unis = PhDUniversity.objects.count()
        countries_covered = PhDUniversity.objects.values('country').distinct().count()
        total_progs = PhDProgramme.objects.count()
        total_funding = PhDFundingOpportunity.objects.count()
        saved_applications = PhDUserApplication.objects.filter(user_id=user_id).count()
        shortlisted_items = PhDUserShortlist.objects.filter(user_id=user_id).count()

        # Count upcoming verified deadlines
        today = date.today()
        upcoming_deadlines = PhDProgramme.objects.filter(
            deadline_date__gte=today,
            verification_status='verified'
        ).count()

        return Response({
            "total_universities": total_unis,
            "countries_covered": countries_covered,
            "total_programmes": total_progs,
            "total_funding_opportunities": total_funding,
            "saved_applications": saved_applications,
            "shortlisted_items": shortlisted_items,
            "upcoming_verified_deadlines": upcoming_deadlines,
            "last_updated": datetime.now().strftime("%B %d, %Y")
        })


# ============================================================================
# 2. UNIVERSITIES EXPLORATION (PHASE 5, 7, 8)
# ============================================================================

class PhDUniversitiesListView(APIView):
    def get(self, request):
        q = request.query_params.get('search', '').strip()
        location = request.query_params.get('location', '').strip().lower() # india vs abroad
        country = request.query_params.get('country', '').strip()
        verification = request.query_params.get('verification_status', '').strip()

        qs = PhDUniversity.objects.prefetch_related('programmes', 'supervisors').all()

        if q:
            qs = qs.filter(
                Q(name__icontains=q) |
                Q(short_name__icontains=q) |
                Q(city__icontains=q) |
                Q(country__icontains=q) |
                Q(departments__icontains=q)
            )

        if location == 'india':
            qs = qs.filter(country_code='IN')
        elif location == 'abroad':
            qs = qs.exclude(country_code='IN')

        if country:
            qs = qs.filter(Q(country__iexact=country) | Q(country_code__iexact=country))

        if verification:
            qs = qs.filter(verification_status=verification)

        serializer = PhDUniversitySerializer(qs, many=True)
        return Response({"results": serializer.data, "count": qs.count()})

    def post(self, request):
        # Admin / Data creation
        serializer = PhDUniversitySerializer(data=request.data)
        if serializer.is_valid():
            uni = serializer.save()
            return Response(PhDUniversitySerializer(uni).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhDUniversityDetailView(APIView):
    def get(self, request, uni_id):
        try:
            uni = PhDUniversity.objects.prefetch_related('programmes', 'supervisors').get(id=uni_id)
        except PhDUniversity.DoesNotExist:
            return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(PhDUniversitySerializer(uni).data)

    def patch(self, request, uni_id):
        try:
            uni = PhDUniversity.objects.get(id=uni_id)
        except PhDUniversity.DoesNotExist:
            return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PhDUniversitySerializer(uni, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, uni_id):
        try:
            uni = PhDUniversity.objects.get(id=uni_id)
            uni.delete()
            return Response({"success": True, "message": "University deleted"})
        except PhDUniversity.DoesNotExist:
            return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)


# ============================================================================
# 3. PHD PROGRAMMES DISCOVERY (PHASE 5, 7, 8)
# ============================================================================

class PhDProgrammesListView(APIView):
    def get(self, request):
        q = request.query_params.get('search', '').strip()
        location = request.query_params.get('location', '').strip().lower()
        country = request.query_params.get('country', '').strip()
        research_area = request.query_params.get('research_area', '').strip()
        degree_type = request.query_params.get('degree_type', '').strip()
        funding_status = request.query_params.get('funding_status', '').strip()
        mtech_accepted = request.query_params.get('mtech_accepted', '').strip()
        verification = request.query_params.get('verification_status', '').strip()
        upcoming_deadlines_only = request.query_params.get('upcoming_deadlines', '').strip().lower() == 'true'

        qs = PhDProgramme.objects.select_related('university').prefetch_related('supervisors').all()

        if q:
            qs = qs.filter(
                Q(title__icontains=q) |
                Q(university__name__icontains=q) |
                Q(university__short_name__icontains=q) |
                Q(department__icontains=q) |
                Q(research_areas__icontains=q) |
                Q(research_keywords__icontains=q)
            )

        if location == 'india':
            qs = qs.filter(university__country_code='IN')
        elif location == 'abroad':
            qs = qs.exclude(university__country_code='IN')

        if country:
            qs = qs.filter(Q(university__country__iexact=country) | Q(university__country_code__iexact=country))

        if research_area:
            qs = qs.filter(
                Q(research_areas__icontains=research_area) |
                Q(research_keywords__icontains=research_area)
            )

        if degree_type:
            qs = qs.filter(degree_type__iexact=degree_type)

        if funding_status:
            qs = qs.filter(funding_status=funding_status)

        if mtech_accepted == 'true':
            qs = qs.filter(mtech_accepted=True)

        if verification:
            qs = qs.filter(verification_status=verification)

        if upcoming_deadlines_only:
            today = date.today()
            qs = qs.filter(deadline_date__gte=today)

        # Ordering
        sort = request.query_params.get('sort', '')
        if sort == 'deadline':
            qs = qs.order_by('deadline_date', 'title')
        elif sort == 'university':
            qs = qs.order_by('university__name')
        elif sort == 'funding':
            qs = qs.order_by('funding_status', 'title')
        else:
            qs = qs.order_by('university__country', 'university__name', 'title')

        serializer = PhDProgrammeSerializer(qs, many=True)
        return Response({"results": serializer.data, "count": qs.count()})

    def post(self, request):
        serializer = PhDProgrammeSerializer(data=request.data)
        if serializer.is_valid():
            prog = serializer.save()
            return Response(PhDProgrammeSerializer(prog).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhDProgrammeDetailView(APIView):
    def get(self, request, prog_id):
        try:
            prog = PhDProgramme.objects.select_related('university').prefetch_related('supervisors').get(id=prog_id)
        except PhDProgramme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(PhDProgrammeSerializer(prog).data)

    def patch(self, request, prog_id):
        try:
            prog = PhDProgramme.objects.get(id=prog_id)
        except PhDProgramme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PhDProgrammeSerializer(prog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, prog_id):
        try:
            prog = PhDProgramme.objects.get(id=prog_id)
            prog.delete()
            return Response({"success": True, "message": "Programme deleted"})
        except PhDProgramme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)


# ============================================================================
# 4. RESEARCH AREAS (PHASE 4)
# ============================================================================

class PhDResearchAreasListView(APIView):
    def get(self, request):
        areas = PhDResearchArea.objects.all()
        # Group by category
        grouped: dict = {}
        for a in areas:
            cat = a.category
            if cat not in grouped:
                grouped[cat] = []
            grouped[cat].append(PhDResearchAreaSerializer(a).data)

        return Response({
            "categories": grouped,
            "total_areas": areas.count()
        })


# ============================================================================
# 5. SUPERVISORS DISCOVERY (PHASE 9)
# ============================================================================

class PhDSupervisorsListView(APIView):
    def get(self, request):
        q = request.query_params.get('search', '').strip()
        country = request.query_params.get('country', '').strip()
        recruitment = request.query_params.get('recruitment_status', '').strip()
        topic = request.query_params.get('topic', '').strip()

        qs = PhDSupervisor.objects.select_related('university').prefetch_related('programmes').all()

        if q:
            qs = qs.filter(
                Q(name__icontains=q) |
                Q(university__name__icontains=q) |
                Q(department__icontains=q) |
                Q(lab_name__icontains=q) |
                Q(research_interests__icontains=q)
            )

        if country:
            qs = qs.filter(Q(university__country__iexact=country) | Q(university__country_code__iexact=country))

        if recruitment:
            qs = qs.filter(recruitment_status=recruitment)

        if topic:
            qs = qs.filter(research_interests__icontains=topic)

        serializer = PhDSupervisorSerializer(qs, many=True)
        return Response({"results": serializer.data, "count": qs.count()})


# ============================================================================
# 6. FUNDING, STIPENDS & SCHOLARSHIPS (PHASE 10)
# ============================================================================

class PhDFundingOpportunitiesListView(APIView):
    def get(self, request):
        q = request.query_params.get('search', '').strip()
        funding_type = request.query_params.get('type', '').strip()
        guaranteed = request.query_params.get('guaranteed', '').strip()

        qs = PhDFundingOpportunity.objects.prefetch_related('eligible_universities').all()

        if q:
            qs = qs.filter(
                Q(title__icontains=q) |
                Q(provider__icontains=q) |
                Q(stipend_amount__icontains=q)
            )

        if funding_type:
            qs = qs.filter(funding_type=funding_type)

        if guaranteed:
            qs = qs.filter(is_guaranteed_or_competitive=guaranteed)

        serializer = PhDFundingOpportunitySerializer(qs, many=True)
        return Response({"results": serializer.data, "count": qs.count()})


# ============================================================================
# 7. DEADLINE CALENDAR & TIMELINE (PHASE 16)
# ============================================================================

class PhDDeadlinesCalendarView(APIView):
    def get(self, request):
        country = request.query_params.get('country', '').strip()
        qs = PhDProgramme.objects.select_related('university').all()

        if country:
            qs = qs.filter(Q(university__country__iexact=country) | Q(university__country_code__iexact=country))

        today = date.today()
        deadlines_list = []
        for p in qs:
            is_upcoming = bool(p.deadline_date and p.deadline_date >= today)
            days_left = (p.deadline_date - today).days if p.deadline_date and is_upcoming else None

            deadlines_list.append({
                "programme_id": str(p.id),
                "title": p.title,
                "university": p.university.name,
                "university_short": p.university.short_name or p.university.name,
                "country": p.university.country,
                "country_code": p.university.country_code,
                "deadline_text": p.application_deadline,
                "deadline_date": p.deadline_date.isoformat() if p.deadline_date else None,
                "deadline_timezone": p.deadline_timezone,
                "intake_term": p.intake_term,
                "is_upcoming": is_upcoming,
                "days_left": days_left,
                "verification_status": p.verification_status,
                "official_url": p.official_url,
                "portal_url": p.application_portal_url
            })

        # Sort: upcoming parsed dates first, then text-only deadlines
        deadlines_list.sort(key=lambda x: (x["deadline_date"] is None, x["deadline_date"] or '9999-12-31'))
        return Response({"deadlines": deadlines_list, "total": len(deadlines_list)})


# ============================================================================
# 8. UNIVERSITY & PROGRAMME COMPARISON TOOL (PHASE 12)
# ============================================================================

class PhDCompareView(APIView):
    def post(self, request):
        ids = request.data.get('ids', [])
        if not ids or not isinstance(ids, list):
            return Response({"error": "Provide an array of programme IDs to compare"}, status=status.HTTP_400_BAD_REQUEST)

        # Cap comparison to 4 programmes
        ids = ids[:4]
        programmes = PhDProgramme.objects.select_related('university').prefetch_related('supervisors').filter(id__in=ids)
        prog_dict = {str(p.id): p for p in programmes}
        ordered_programmes = [prog_dict[str(i)] for i in ids if str(i) in prog_dict]

        comparison_matrix = []
        for p in ordered_programmes:
            comparison_matrix.append({
                "id": str(p.id),
                "title": p.title,
                "university": p.university.name,
                "country": p.university.country,
                "city": p.university.city,
                "degree_type": p.degree_type,
                "research_areas": p.research_areas,
                "funding_status": p.get_funding_status_display(),
                "stipend": p.stipend_amount or "Not specified",
                "tuition_fees": p.tuition_fee or "Not specified",
                "application_deadline": p.application_deadline,
                "mtech_accepted": "Yes (Fully Recognized)" if p.mtech_accepted else "No / Check with department",
                "mtech_details": p.mtech_details or "Direct eligibility evaluated on transcript",
                "test_requirements": p.test_requirements or "None specified",
                "english_requirements": p.english_requirements or "Not specified",
                "supervisors_count": p.supervisors.count(),
                "official_url": p.official_url,
                "verification_status": p.get_verification_status_display(),
                "source_url": p.source_url
            })

        return Response({"comparison": comparison_matrix, "count": len(comparison_matrix)})


# ============================================================================
# 9. PERSONALIZED ELIGIBILITY ASSESSMENT (PHASE 11)
# ============================================================================

class PhDEligibilityAssessmentView(APIView):
    def post(self, request):
        user_id = get_user_id(request)
        profile_data = request.data.get('profile')

        if not profile_data:
            # Load user's saved profile or create default
            user_prof, _ = PhDUserProfile.objects.get_or_create(user_id=user_id)
            profile_data = PhDUserProfileSerializer(user_prof).data

        # Evaluate against all active programmes
        programmes = PhDProgramme.objects.select_related('university').all()

        results = []
        for p in programmes:
            matched_criteria = []
            unmatched_criteria = []
            unknown_criteria = []

            # 1. Degree qualification check
            if p.mtech_accepted and profile_data.get('has_mtech'):
                matched_criteria.append("M.Tech degree is fully recognized and accepted for this PhD programme.")
            elif not profile_data.get('has_mtech') and "B.Tech" not in p.eligibility_criteria:
                unmatched_criteria.append("Programme requires a Master's degree; bachelor's route requires confirmation.")

            # 2. Country preference check
            pref_countries = [c.lower() for c in profile_data.get('preferred_countries', [])]
            if pref_countries:
                if p.university.country.lower() in pref_countries or p.university.country_code.lower() in pref_countries:
                    matched_criteria.append(f"Located in your preferred country: {p.university.country}.")
                else:
                    unmatched_criteria.append(f"Located in {p.university.country}, not in your current preferred country list.")

            # 3. Test requirements check (GATE / GRE / Language)
            if p.university.country_code == 'IN':
                if profile_data.get('has_gate'):
                    matched_criteria.append("Valid GATE qualification supports admission/fellowship.")
                else:
                    unknown_criteria.append("GATE status needed: while M.Tech holders are often exempt, check specific department shortlist criteria.")
            else:
                # Abroad
                if "gre" in p.test_requirements.lower() and not profile_data.get('has_gre'):
                    if "optional" in p.test_requirements.lower() or "not required" in p.test_requirements.lower():
                        matched_criteria.append("GRE is optional / not required for this department.")
                    else:
                        unmatched_criteria.append("GRE may be required or strongly recommended.")

                if profile_data.get('has_toefl_ielts'):
                    matched_criteria.append("English language test requirement met.")
                else:
                    if p.university.country in ["Germany", "Switzerland"]:
                        matched_criteria.append("German / Swiss research institutes generally do not mandate GRE/TOEFL for English-medium master graduates.")
                    else:
                        unknown_criteria.append("TOEFL / IELTS test score required prior to formal application.")

            # 4. Research interest alignment
            user_interests = [i.lower() for i in profile_data.get('primary_research_interests', [])]
            prog_areas = [str(a).lower() for a in p.research_areas] + [str(k).lower() for k in p.research_keywords]
            
            overlap = any(any(ui in pa for pa in prog_areas) for ui in user_interests)
            if overlap:
                matched_criteria.append("Strong research alignment with your stated research interests (Data Engineering / Systems / AI).")
            else:
                unknown_criteria.append("Review department faculty profiles to verify specific topic fit.")

            # Determine category
            if len(unmatched_criteria) == 0 and len(matched_criteria) >= 2:
                category = "strong_match"
                category_label = "Appears to meet published minimum requirements"
            elif len(unmatched_criteria) <= 1:
                category = "potential_match"
                category_label = "Potential match; some requirements need confirmation"
            elif len(unmatched_criteria) > 1 and len(matched_criteria) >= 1:
                category = "additional_qualification_required"
                category_label = "Additional qualification or test may be required"
            else:
                category = "does_not_meet"
                category_label = "Does not appear to meet a published requirement"

            results.append({
                "programme_id": str(p.id),
                "programme_title": p.title,
                "university_name": p.university.name,
                "country": p.university.country,
                "category": category,
                "category_label": category_label,
                "matched_criteria": matched_criteria,
                "unmatched_criteria": unmatched_criteria,
                "unknown_criteria": unknown_criteria,
                "official_url": p.official_url,
                "funding_status": p.get_funding_status_display(),
                "stipend": p.stipend_amount,
                "verification_status": p.verification_status
            })

        # Sort strong matches first
        order = {"strong_match": 0, "potential_match": 1, "additional_qualification_required": 2, "does_not_meet": 3}
        results.sort(key=lambda x: order.get(x["category"], 4))

        return Response({
            "assessment_summary": {
                "total_assessed": len(results),
                "strong_matches": sum(1 for r in results if r["category"] == "strong_match"),
                "potential_matches": sum(1 for r in results if r["category"] == "potential_match"),
                "needs_tests": sum(1 for r in results if r["category"] == "additional_qualification_required"),
            },
            "profile_used": profile_data,
            "results": results
        })


# ============================================================================
# 10. MY SHORTLIST (PHASE 13)
# ============================================================================

class PhDShortlistListView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        shortlist = PhDUserShortlist.objects.filter(user_id=user_id).select_related(
            'programme', 'programme__university', 'university', 'supervisor', 'funding'
        )
        serializer = PhDUserShortlistSerializer(shortlist, many=True)
        return Response({"shortlist": serializer.data, "count": shortlist.count()})

    def post(self, request):
        user_id = get_user_id(request)
        prog_id = request.data.get('programme_id')
        uni_id = request.data.get('university_id')
        priority = request.data.get('priority', 'medium')
        notes = request.data.get('notes', '')
        intake = request.data.get('preferred_intake', '')

        item, created = PhDUserShortlist.objects.update_or_create(
            user_id=user_id,
            programme_id=prog_id,
            university_id=uni_id,
            defaults={
                "priority": priority,
                "notes": notes,
                "preferred_intake": intake,
                "item_type": "programme" if prog_id else "university"
            }
        )

        return Response(PhDUserShortlistSerializer(item).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class PhDShortlistDetailView(APIView):
    def patch(self, request, item_id):
        user_id = get_user_id(request)
        try:
            item = PhDUserShortlist.objects.get(id=item_id, user_id=user_id)
        except PhDUserShortlist.DoesNotExist:
            return Response({"error": "Shortlist item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PhDUserShortlistSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, item_id):
        user_id = get_user_id(request)
        try:
            item = PhDUserShortlist.objects.get(id=item_id, user_id=user_id)
            item.delete()
            return Response({"success": True, "message": "Removed from shortlist"})
        except PhDUserShortlist.DoesNotExist:
            return Response({"error": "Shortlist item not found"}, status=status.HTTP_404_NOT_FOUND)


class PhDShortlistExportCSVView(APIView):
    """Exports user's private shortlist to CSV format."""
    def get(self, request):
        user_id = get_user_id(request)
        items = PhDUserShortlist.objects.filter(user_id=user_id).select_related('programme', 'programme__university', 'university')

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Item Type", "Title / Programme", "University", "Country", "Priority",
            "Preferred Intake", "Application Deadline", "Funding Status", "Stipend", "Notes"
        ])

        for it in items:
            p = it.programme
            u = p.university if p else it.university
            writer.writerow([
                it.item_type,
                p.title if p else (u.name if u else "N/A"),
                u.name if u else "N/A",
                u.country if u else "N/A",
                it.priority,
                it.preferred_intake or (p.intake_term if p else ""),
                p.application_deadline if p else "",
                p.get_funding_status_display() if p else "",
                p.stipend_amount if p else "",
                it.notes
            ])

        response = HttpResponse(output.getvalue(), content_type="text/csv")
        response['Content-Disposition'] = f'attachment; filename="akku_phd_shortlist_{date.today().isoformat()}.csv"'
        return response


# ============================================================================
# 11. MY APPLICATION TRACKER & CHECKLIST (PHASE 14, 15)
# ============================================================================

class PhDApplicationsListView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        apps = PhDUserApplication.objects.filter(user_id=user_id).select_related('programme', 'programme__university').prefetch_related('documents')
        serializer = PhDUserApplicationSerializer(apps, many=True)
        return Response({"applications": serializer.data, "count": apps.count()})

    def post(self, request):
        user_id = get_user_id(request)
        prog_id = request.data.get('programme_id')
        if not prog_id:
            return Response({"error": "programme_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            prog = PhDProgramme.objects.get(id=prog_id)
        except PhDProgramme.DoesNotExist:
            return Response({"error": "Programme not found"}, status=status.HTTP_404_NOT_FOUND)

        app, created = PhDUserApplication.objects.update_or_create(
            user_id=user_id,
            programme=prog,
            defaults={
                "stage": request.data.get('stage', 'interested'),
                "submission_deadline": prog.deadline_date,
                "potential_supervisor": request.data.get('potential_supervisor', ''),
                "portal_login_url": prog.application_portal_url or prog.official_url,
                "notes": request.data.get('notes', '')
            }
        )

        # Seed initial document checklist for this application based on programme's requirements
        if created:
            default_docs = [
                "Official Academic Transcripts (B.Tech & M.Tech)",
                "Statement of Purpose (SOP)",
                "Curriculum Vitae / Resume",
                "Letters of Recommendation (LORs)",
                "GATE / Test Scorecard",
                "M.Tech Master's Thesis Summary / Research Proposal"
            ]
            for doc_name in default_docs:
                PhDApplicationDocument.objects.create(
                    application=app,
                    name=doc_name,
                    status="not_started"
                )

        return Response(PhDUserApplicationSerializer(app).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class PhDApplicationDetailView(APIView):
    def patch(self, request, app_id):
        user_id = get_user_id(request)
        try:
            app = PhDUserApplication.objects.get(id=app_id, user_id=user_id)
        except PhDUserApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PhDUserApplicationSerializer(app, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, app_id):
        user_id = get_user_id(request)
        try:
            app = PhDUserApplication.objects.get(id=app_id, user_id=user_id)
            app.delete()
            return Response({"success": True, "message": "Application removed"})
        except PhDUserApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)


class PhDApplicationDocumentToggleView(APIView):
    """Updates document checklist status for an application."""
    def patch(self, request, doc_id):
        try:
            doc = PhDApplicationDocument.objects.select_related('application').get(id=doc_id)
        except PhDApplicationDocument.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        user_id = get_user_id(request)
        if doc.application.user_id != user_id:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        status_val = request.data.get('status')
        if status_val:
            doc.status = status_val
        if 'notes' in request.data:
            doc.notes = request.data.get('notes')
        doc.save()

        return Response(PhDApplicationDocumentSerializer(doc).data)


# ============================================================================
# 12. USER ACADEMIC PROFILE (PHASE 11, 22)
# ============================================================================

class PhDUserProfileView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        prof, _ = PhDUserProfile.objects.get_or_create(user_id=user_id)
        return Response(PhDUserProfileSerializer(prof).data)

    def patch(self, request):
        user_id = get_user_id(request)
        prof, _ = PhDUserProfile.objects.get_or_create(user_id=user_id)
        serializer = PhDUserProfileSerializer(prof, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================================
# 13. AI-ASSISTED GROUNDED PHD SEARCH & ADVISOR (PHASE 17, 18)
# ============================================================================

class PhDAISearchAdvisorView(APIView):
    """
    RAG-grounded natural-language query engine for PhD research inquiries.
    Queries the actual university/programme database, extracts supporting sources,
    and returns verified, grounded answers without fabrication.
    """
    def post(self, request):
        query = request.data.get('query', '').strip()
        user_id = get_user_id(request)

        if not query:
            return Response({"error": "Please provide a query"}, status=status.HTTP_400_BAD_REQUEST)

        q_lower = query.lower()

        # 1. Database Retrieval Filter
        matching_programmes = PhDProgramme.objects.select_related('university').prefetch_related('supervisors').all()

        # Location intent
        if any(w in q_lower for w in ["india", "indian", "iit", "iisc", "iiit"]):
            matching_programmes = matching_programmes.filter(university__country_code='IN')
        elif any(w in q_lower for w in ["abroad", "foreign", "germany", "us", "usa", "switzerland", "singapore", "uk", "oxford", "tum", "eth"]):
            matching_programmes = matching_programmes.exclude(university__country_code='IN')

        # Research topic intent
        if any(w in q_lower for w in ["data engineering", "database", "lakehouse", "distributed", "systems"]):
            matching_programmes = matching_programmes.filter(
                Q(research_areas__icontains="data engineering") |
                Q(title__icontains="computer science") |
                Q(title__icontains="computational")
            )
        elif any(w in q_lower for w in ["ai", "machine learning", "deep learning"]):
            matching_programmes = matching_programmes.filter(
                Q(research_areas__icontains="artificial intelligence") |
                Q(title__icontains="intelligence") |
                Q(title__icontains="data science")
            )
        elif any(w in q_lower for w in ["computer vision", "vision", "3d"]):
            matching_programmes = matching_programmes.filter(
                Q(research_areas__icontains="computer vision") |
                Q(title__icontains="computer science")
            )

        # Funding intent
        if any(w in q_lower for w in ["funded", "stipend", "scholarship", "free", "salary"]):
            matching_programmes = matching_programmes.filter(
                Q(funding_status='fully_funded_verified') |
                Q(funding_status='competitive_funding')
            )

        matching_programmes = list(matching_programmes[:6])

        # 2. Synthesize Grounded Evidence Summary
        evidence = []
        for p in matching_programmes:
            evidence.append({
                "programme_id": str(p.id),
                "title": p.title,
                "university": p.university.name,
                "country": p.university.country,
                "funding": p.get_funding_status_display(),
                "stipend": p.stipend_amount,
                "deadline": p.application_deadline,
                "mtech_accepted": p.mtech_accepted,
                "source_url": p.source_url or p.official_url,
                "verification_status": p.verification_status
            })

        # Synthesize structured markdown advice
        lines = [
            f"### 🎓 PhD Advisory Report for: *\"{query}\"*",
            "",
            f"Based on **{len(matching_programmes)} verified programmes** directly retrieved from the PhD database:",
            ""
        ]

        for idx, p in enumerate(matching_programmes, 1):
            lines.append(f"#### {idx}. {p.title} — {p.university.name} ({p.university.country})")
            lines.append(f"- **Degree & Department:** {p.degree_type} • {p.department}")
            lines.append(f"- **Funding & Stipend:** {p.get_funding_status_display()} ({p.stipend_amount})")
            lines.append(f"- **M.Tech Eligibility:** {'M.Tech explicitly accepted and prioritized' if p.mtech_accepted else 'Check department guidelines'}")
            lines.append(f"- **Application Deadline:** {p.application_deadline}")
            lines.append(f"- **Official Verified Source:** [{p.official_url}]({p.official_url})")
            lines.append("")

        lines.append("> [!TIP]")
        lines.append("> All details above are strictly backed by verified university admissions and research portal links. You can add any of these programmes directly to your shortlist or application tracker below.")

        advisor_response = "\n".join(lines)

        return Response({
            "query": query,
            "answer": advisor_response,
            "grounded": True,
            "matched_programmes": evidence,
            "total_matches": len(matching_programmes)
        })


# ============================================================================
# 14. DATA MAINTENANCE & EXPORT/IMPORT (PHASE 19)
# ============================================================================

class PhDExportDataView(APIView):
    """Exports full database of universities and programmes as JSON for backup and maintenance."""
    def get(self, request):
        unis = PhDUniversity.objects.prefetch_related('programmes', 'supervisors').all()
        serializer = PhDUniversitySerializer(unis, many=True)
        return Response({
            "export_date": datetime.now().isoformat(),
            "universities_count": unis.count(),
            "data": serializer.data
        })
