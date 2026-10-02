import uuid
from django.db import models

class PersonalMemory(models.Model):
    CATEGORY_CHOICES = [
        ('food_drinks', 'Food & Drinks'),
        ('likes_dislikes', 'Likes & Dislikes'),
        ('personal_preferences', 'Personal Preferences'),
        ('health_wellness', 'Health & Wellness'),
        ('habits_routines', 'Habits & Daily Routines'),
        ('important_dates', 'Important Dates & Occasions'),
        ('shared_experiences', 'Shared Experiences & Incidents'),
        ('music_entertainment', 'Music & Entertainment'),
        ('places_travel', 'Places & Travel'),
        ('family_friends', 'Family & Friends'),
        ('future_plans', 'Future Plans'),
        ('gifts_surprises', 'Gifts & Surprises'),
        ('other', 'Other Memories'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100, default='default_user', db_index=True, help_text="User ID for isolation")
    memory_text = models.TextField(help_text="The extracted fact or memory statement about Akku")
    original_input = models.TextField(blank=True, null=True, help_text="The original message spoken or typed by Saketh")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='personal_preferences')
    subject = models.CharField(max_length=150, blank=True, null=True, help_text="Short topic (e.g. Ice Cream, Headache, Favorite Song)")
    source = models.CharField(max_length=20, default='text')  # 'voice' or 'text'
    confidence = models.FloatField(default=1.0)
    event_date = models.CharField(max_length=100, blank=True, null=True)
    conversation_timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    superseded_by = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='previous_versions'
    )
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-conversation_timestamp']
        verbose_name_plural = "Personal Memories"

    def __str__(self):
        return f"[{self.category}] {self.memory_text[:60]}"


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
