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
