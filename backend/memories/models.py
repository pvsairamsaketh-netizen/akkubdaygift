import uuid
from django.db import models

class PersonalMemory(models.Model):
    CATEGORY_CHOICES = [
        ('relationship', 'Relationship & Love Story'),
        ('personal_preferences', 'Personal Preferences'),
        ('favorite', 'Favorites'),
        ('food_drinks', 'Food & Drinks'),
        ('places_travel', 'Places & Travel'),
        ('important_dates', 'Important Dates & Occasions'),
        ('shared_experiences', 'Shared Experiences & Incidents'),
        ('music_entertainment', 'Music & Entertainment'),
        ('likes_dislikes', 'Likes & Dislikes'),
        ('health_wellness', 'Health & Wellness'),
        ('habits_routines', 'Habits & Daily Routines'),
        ('family_friends', 'Family & Friends'),
        ('future_plans', 'Future Plans & Promises'),
        ('gifts_surprises', 'Gifts & Surprises'),
        ('education', 'Education & College'),
        ('career', 'Career & Work'),
        ('emotion', 'Emotions & Feelings'),
        ('movie', 'Movies & Shows'),
        ('other', 'Other Memories'),
    ]

    STATUS_CHOICES = [
        ('current', 'Current (Active)'),
        ('historical', 'Historical (Past / Superseded)'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, default='default_user', db_index=True, help_text="User ID for isolation")
    memory_text = models.TextField(help_text="The extracted fact or memory statement about Akku")
    summary = models.TextField(blank=True, null=True, help_text="Concise summary for semantic indexing")
    original_input = models.TextField(blank=True, null=True, help_text="The original message spoken or typed by Saketh")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='personal_preferences')
    subject = models.CharField(max_length=150, blank=True, null=True, help_text="Short topic (e.g. Ice Cream, Headache, Favorite Song)")
    speaker = models.CharField(max_length=50, default='Akku', help_text="Speaker or subject: Akku, Saki, Both, or User")
    source = models.CharField(max_length=50, default='text')  # 'voice', 'text', 'manual', 'agent'
    source_type = models.CharField(max_length=50, default='user_memory', db_index=True, help_text="initial_pdf, user_memory, conversation, agent_extracted, manual_update")
    source_reference = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Page 4, chat session, etc.")
    confidence = models.FloatField(default=1.0, help_text="Confidence score from 0.0 to 1.0")
    importance = models.FloatField(default=0.8, help_text="Importance score from 0.1 to 1.0")
    content_hash = models.CharField(max_length=64, db_index=True, blank=True, null=True, help_text="SHA-256 content hash for deduplication")
    version = models.PositiveIntegerField(default=1, help_text="Memory version number")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='current', db_index=True)
    event_date = models.CharField(max_length=100, blank=True, null=True)
    conversation_timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, db_index=True)
    is_visible = models.BooleanField(default=True, db_index=True)
    visibility = models.CharField(max_length=20, default='visible', db_index=True)
    is_user_confirmed = models.BooleanField(default=True)
    superseded_by = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='previous_versions'
    )
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-conversation_timestamp']
        verbose_name_plural = "Personal Memories"

    def __str__(self):
        return f"[{self.category}] v{self.version} ({self.status}) {self.memory_text[:60]}"


class PersonalVocabulary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    term = models.CharField(max_length=100, unique=True, help_text="Correct term (e.g. Akku, Saki, Saketh, Besant Nagar)")
    misrecognitions = models.JSONField(default=list, blank=True, help_text="Misrecognized spellings to replace automatically")
    category = models.CharField(max_length=50, default="name")
    created_at = models.DateTimeField(auto_now_add=True)
    times_used = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['term']
        verbose_name_plural = "Personal Vocabulary"

    def __str__(self):
        return f"{self.term} ({len(self.misrecognitions)} aliases)"


class BirthdayConfig(models.Model):
    creator_name = models.CharField(max_length=100, default="Saki")
    recipient_name = models.CharField(max_length=100, default="Akku")
    greeting_title = models.CharField(max_length=255, default="Happy Birthday, Akku! ❤️")
    love_letter = models.TextField(
        default="Happy Birthday to the most special person in my life. Every little moment, message, and memory we have shared means the world to me. I made this little world just for you."
    )
    surprise_message = models.TextField(
        default="You are my favorite journey, my dearest Akku. Every day with you is a gift. Happy Birthday!"
    )
    birthday_date = models.CharField(max_length=100, default="October 20")
    background_music_enabled = models.BooleanField(default=False)
    theme = models.CharField(max_length=50, default="romantic_rose")
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_config(cls):
        config, _ = cls.objects.get_or_create(id=1)
        return config

    def __str__(self):
        return f"Birthday Config for {self.recipient_name} by {self.creator_name}"
