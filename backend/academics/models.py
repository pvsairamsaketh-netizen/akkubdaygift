import uuid
from django.db import models

class AcademicNote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, default='default_user', db_index=True)
    day_number = models.IntegerField(null=True, blank=True, help_text="Curriculum day (1-100) linked to this note")
    topic_id = models.CharField(max_length=100, blank=True, default='', help_text="e.g. spark_joins, sql_window")
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Markdown note content")
    category = models.CharField(max_length=100, default='General', help_text="Python, SQL, Spark, Kafka, Airflow, etc.")
    tags = models.JSONField(default=list, blank=True)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']
        verbose_name = "Academic Note"
        verbose_name_plural = "Academic Notes"

    def __str__(self):
        day_str = f" [Day {self.day_number}]" if self.day_number else ""
        return f"{self.title}{day_str} ({self.category})"


class AcademicProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, unique=True, default='default_user', db_index=True)
    completed_days = models.JSONField(default=list, blank=True, help_text="List of completed day numbers [1, 2, ...]")
    day_status = models.JSONField(default=dict, blank=True, help_text="Per day progress status { '1': { 'learned': true, 'mcq': 100 } }")
    quiz_scores = models.JSONField(default=dict, blank=True, help_text="Quiz attempts and high scores per day/topic")
    coding_submissions = models.JSONField(default=dict, blank=True, help_text="Solved coding/SQL exercises")
    saved_cheat_sheets = models.JSONField(default=list, blank=True, help_text="Saved cheat sheet day IDs")
    bookmarks = models.JSONField(default=list, blank=True, help_text="Bookmarked lessons and interview questions")
    revision_items = models.JSONField(default=list, blank=True, help_text="Spaced repetition revision items")
    capstone_progress = models.JSONField(default=dict, blank=True, help_text="Completed milestones for capstone project")
    streak_count = models.IntegerField(default=1)
    last_active_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Academic Progress"
        verbose_name_plural = "Academic Progress Records"

    def __str__(self):
        return f"Progress for {self.user_id}: {len(self.completed_days)}/100 days"


class SQLQueryHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, default='default_user', db_index=True)
    query = models.TextField()
    status = models.CharField(max_length=20, default='success')  # success, error
    execution_time_ms = models.FloatField(default=0.0)
    row_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "SQL Query History"
        verbose_name_plural = "SQL Query History"

    def __str__(self):
        return f"[{self.status}] {self.query[:60]} ({self.execution_time_ms}ms)"


# ============================================================================
# PHD OPTIONS IN INDIA & ABROAD — DATA MODELS (PHASE 5, 6, 9, 10, 13, 14, 20)
# ============================================================================

class PhDUniversity(models.Model):
    VERIFICATION_CHOICES = [
        ('verified', 'Verified Official Source'),
        ('partially_verified', 'Partially Verified'),
        ('unverified', 'Unverified / Pending Check'),
        ('outdated', 'Outdated / Needs Re-Check'),
        ('conflicting', 'Conflicting Sources')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, help_text="Official university name")
    short_name = models.CharField(max_length=50, blank=True, help_text="e.g. IISc, IITB, Stanford, MIT")
    country = models.CharField(max_length=100, db_index=True, help_text="India, United States, Germany, etc.")
    country_code = models.CharField(max_length=10, default="IN", db_index=True)
    state_region = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, db_index=True)
    website_url = models.URLField(max_length=500)
    admissions_url = models.URLField(max_length=500)
    departments = models.JSONField(default=list, blank=True, help_text="List of relevant department names")
    research_centers = models.JSONField(default=list, blank=True, help_text="Relevant institutes or labs")
    university_type = models.CharField(max_length=100, default="Public Research University")
    verification_status = models.CharField(max_length=30, choices=VERIFICATION_CHOICES, default='verified', db_index=True)
    last_verified_at = models.DateTimeField(auto_now=True)
    ranking_note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "PhD University"
        verbose_name_plural = "PhD Universities"

    def __str__(self):
        return f"{self.name} ({self.country})"


class PhDResearchArea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=100, db_index=True)
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    key_topics = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['category', 'name']
        verbose_name = "PhD Research Area"
        verbose_name_plural = "PhD Research Areas"

    def __str__(self):
        return f"{self.name} [{self.category}]"


class PhDProgramme(models.Model):
    FUNDING_STATUS_CHOICES = [
        ('fully_funded_verified', 'Fully Funded & Verified'),
        ('competitive_funding', 'Competitive Funding Available'),
        ('partially_funded', 'Partially Funded'),
        ('self_funded', 'Self-Funded'),
        ('funding_unknown', 'Funding Unknown')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    university = models.ForeignKey(PhDUniversity, related_name='programmes', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, help_text="Official programme title as published")
    department = models.CharField(max_length=255)
    degree_type = models.CharField(max_length=100, default="PhD", help_text="PhD, DPhil, Direct PhD, etc.")
    research_areas = models.JSONField(default=list, blank=True, help_text="List of area names/slugs")
    research_keywords = models.JSONField(default=list, blank=True, help_text="Fine-grained research keywords")
    official_url = models.URLField(max_length=500)
    application_portal_url = models.URLField(max_length=500, blank=True)
    admission_cycle = models.CharField(max_length=100, default="Fall 2027 / August 2027")
    application_deadline = models.CharField(max_length=255, help_text="Published deadline or rolling schedule")
    deadline_date = models.DateField(null=True, blank=True, help_text="Next parsed deadline if confirmed")
    deadline_timezone = models.CharField(max_length=50, default="Asia/Kolkata")
    intake_term = models.CharField(max_length=100, default="Autumn (August)")
    eligibility_criteria = models.TextField(help_text="Detailed academic prerequisites")
    mtech_accepted = models.BooleanField(default=True, help_text="Whether M.Tech / ME graduates are accepted")
    mtech_details = models.TextField(blank=True, help_text="Specific M.Tech prerequisites or exemptions")
    min_gpa_or_percent = models.CharField(max_length=100, blank=True)
    prerequisites = models.JSONField(default=list, blank=True)
    required_documents = models.JSONField(default=list, blank=True)
    english_requirements = models.CharField(max_length=255, blank=True)
    test_requirements = models.CharField(max_length=255, blank=True, help_text="GATE, NET JRF, GRE, etc.")
    application_fee = models.CharField(max_length=100, blank=True)
    tuition_fee = models.CharField(max_length=100, blank=True)
    funding_status = models.CharField(max_length=50, choices=FUNDING_STATUS_CHOICES, default='fully_funded_verified', db_index=True)
    funding_details = models.TextField(blank=True)
    stipend_amount = models.CharField(max_length=255, blank=True)
    stipend_currency = models.CharField(max_length=10, default="INR")
    supervisor_availability_note = models.TextField(blank=True)
    verification_status = models.CharField(max_length=30, choices=PhDUniversity.VERIFICATION_CHOICES, default='verified', db_index=True)
    source_url = models.URLField(max_length=500, help_text="Official verification source link")
    last_verified_at = models.DateTimeField(auto_now=True)
    notes_and_limitations = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['university__name', 'title']
        verbose_name = "PhD Programme"
        verbose_name_plural = "PhD Programmes"

    def __str__(self):
        return f"{self.title} — {self.university.name}"


class PhDSupervisor(models.Model):
    RECRUITMENT_CHOICES = [
        ('confirmed_open', 'Confirmed Open Position'),
        ('published_recruitment', 'Published Recruitment Notice'),
        ('general_fit', 'General Research Fit'),
        ('unknown', 'Recruitment Status Unknown')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    university = models.ForeignKey(PhDUniversity, related_name='supervisors', on_delete=models.CASCADE)
    programmes = models.ManyToManyField(PhDProgramme, blank=True, related_name='supervisors')
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=100, default="Professor")
    department = models.CharField(max_length=255)
    lab_name = models.CharField(max_length=255, blank=True)
    lab_url = models.URLField(max_length=500, blank=True)
    faculty_profile_url = models.URLField(max_length=500)
    email = models.CharField(max_length=255, blank=True, help_text="Public institutional email")
    research_interests = models.JSONField(default=list, blank=True)
    recruitment_status = models.CharField(max_length=50, choices=RECRUITMENT_CHOICES, default='general_fit', db_index=True)
    funded_positions_note = models.TextField(blank=True)
    recent_publications = models.JSONField(default=list, blank=True)
    verification_status = models.CharField(max_length=30, choices=PhDUniversity.VERIFICATION_CHOICES, default='verified')
    last_verified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = "PhD Supervisor"
        verbose_name_plural = "PhD Supervisors"

    def __str__(self):
        return f"{self.name} ({self.university.short_name or self.university.name})"


class PhDFundingOpportunity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, help_text="Scholarship / Fellowship title")
    provider = models.CharField(max_length=255, help_text="e.g. Ministry of Education (MoE), DAAD, NSF, University")
    funding_type = models.CharField(max_length=50, default="government", help_text="government, institutional, industry, fellowship")
    eligible_countries = models.JSONField(default=list, blank=True)
    eligible_universities = models.ManyToManyField(PhDUniversity, blank=True, related_name='funding_opportunities')
    stipend_amount = models.CharField(max_length=255)
    tuition_coverage = models.CharField(max_length=100, default="100% Tuition Waiver")
    living_allowance = models.CharField(max_length=255, blank=True)
    travel_allowance = models.CharField(max_length=255, blank=True)
    deadline_description = models.CharField(max_length=255, blank=True)
    is_guaranteed_or_competitive = models.CharField(max_length=50, default="competitive")
    official_source_url = models.URLField(max_length=500)
    verification_status = models.CharField(max_length=30, choices=PhDUniversity.VERIFICATION_CHOICES, default='verified')
    last_verified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']
        verbose_name = "PhD Funding Opportunity"
        verbose_name_plural = "PhD Funding Opportunities"

    def __str__(self):
        return f"{self.title} ({self.provider})"


class PhDUserShortlist(models.Model):
    PRIORITY_CHOICES = [
        ('high', 'High Priority'),
        ('medium', 'Medium Priority'),
        ('low', 'Low Priority')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, default='default_user', db_index=True)
    university = models.ForeignKey(PhDUniversity, null=True, blank=True, on_delete=models.CASCADE)
    programme = models.ForeignKey(PhDProgramme, null=True, blank=True, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(PhDSupervisor, null=True, blank=True, on_delete=models.CASCADE)
    funding = models.ForeignKey(PhDFundingOpportunity, null=True, blank=True, on_delete=models.CASCADE)
    item_type = models.CharField(max_length=50, default='programme')  # programme, university, supervisor, funding
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    preferred_intake = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "PhD User Shortlist"
        verbose_name_plural = "PhD User Shortlists"

    def __str__(self):
        target = self.programme.title if self.programme else (self.university.name if self.university else str(self.id))
        return f"Shortlist [{self.user_id}]: {target}"


class PhDUserApplication(models.Model):
    STAGE_CHOICES = [
        ('interested', '1. Interested'),
        ('researching', '2. Researching Requirements'),
        ('eligibility_checked', '3. Eligibility Checked'),
        ('supervisor_identified', '4. Supervisor Identified'),
        ('supervisor_contacted', '5. Supervisor Contacted'),
        ('documents_preparing', '6. Documents Being Prepared'),
        ('in_progress', '7. Application In Progress'),
        ('submitted', '8. Application Submitted'),
        ('interview_scheduled', '9. Interview Scheduled'),
        ('offer_received', '10. Offer Received 🎉'),
        ('waitlisted', '11. Waitlisted'),
        ('rejected', '12. Rejected'),
        ('accepted', '13. Offer Accepted ❤️'),
        ('declined', '14. Offer Declined'),
        ('withdrawn', '15. Withdrawn')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, default='default_user', db_index=True)
    programme = models.ForeignKey(PhDProgramme, on_delete=models.CASCADE, related_name='user_applications')
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='interested', db_index=True)
    submission_deadline = models.DateField(null=True, blank=True)
    submission_date = models.DateField(null=True, blank=True)
    interview_date = models.DateField(null=True, blank=True)
    portal_login_url = models.URLField(max_length=500, blank=True)
    application_reference_number = models.CharField(max_length=100, blank=True)
    potential_supervisor = models.CharField(max_length=255, blank=True)
    sop_draft_link = models.CharField(max_length=500, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = "PhD User Application"
        verbose_name_plural = "PhD User Applications"

    def __str__(self):
        return f"App [{self.user_id}] -> {self.programme.title} ({self.stage})"


class PhDApplicationDocument(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('ready', 'Ready to Submit'),
        ('submitted', 'Submitted')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(PhDUserApplication, related_name='documents', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, help_text="e.g. Transcripts, SOP, CV, LOR 1, LOR 2, GATE Scorecard")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='not_started')
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "PhD Application Document"
        verbose_name_plural = "PhD Application Documents"

    def __str__(self):
        return f"{self.name} ({self.status}) for {self.application_id}"


class PhDUserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, unique=True, default='default_user', db_index=True)
    highest_qualification = models.CharField(max_length=100, default="M.Tech")
    degree_title = models.CharField(max_length=255, default="M.Tech in Data Engineering")
    specialization = models.CharField(max_length=255, default="Data Systems & Distributed Computing")
    institution = models.CharField(max_length=255, blank=True, default="NIT / Top Tier Engineering Institute")
    cgpa_or_percent = models.CharField(max_length=50, default="8.7 / 10.0")
    graduation_year = models.IntegerField(null=True, blank=True, default=2025)
    research_experience_months = models.IntegerField(default=12)
    publications_count = models.IntegerField(default=1)
    thesis_title = models.TextField(blank=True, default="Scalable Query Execution on Modern Cloud Lakehouse Platforms")
    primary_research_interests = models.JSONField(default=list, blank=True)
    preferred_countries = models.JSONField(default=list, blank=True)
    has_mtech = models.BooleanField(default=True)
    has_gate = models.BooleanField(default=True)
    gate_score = models.CharField(max_length=50, blank=True, default="690 (CS/DA)")
    has_gre = models.BooleanField(default=False)
    has_toefl_ielts = models.BooleanField(default=False)
    funding_requirement = models.CharField(max_length=50, default="fully_funded")
    target_intake = models.CharField(max_length=100, default="Autumn 2027 / August 2027")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "PhD User Profile"
        verbose_name_plural = "PhD User Profiles"

    def __str__(self):
        return f"PhD Profile: {self.user_id} ({self.degree_title})"

