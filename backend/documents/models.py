import uuid
from django.db import models

class Document(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('indexed', 'Indexed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filename = models.CharField(max_length=255)
    file_path = models.CharField(max_length=512, blank=True, null=True)
    content_hash = models.CharField(max_length=64, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_pages = models.PositiveIntegerField(default=0)
    total_chunks = models.PositiveIntegerField(default=0)
    empty_pages = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_ingested_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} ({self.status}) - {self.total_chunks} chunks"


class DocumentChunk(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.PositiveIntegerField()
    page_number = models.PositiveIntegerField()
    text = models.TextField()
    email_subject = models.CharField(max_length=255, blank=True, null=True)
    email_date = models.CharField(max_length=100, blank=True, null=True)
    token_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['document', 'chunk_index']
        unique_together = ('document', 'chunk_index')

    def __str__(self):
        return f"{self.document.filename} [P.{self.page_number} Chunk {self.chunk_index}]"
