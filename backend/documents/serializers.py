from rest_framework import serializers
from documents.models import Document, DocumentChunk

class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = ['id', 'chunk_index', 'page_number', 'text', 'email_subject', 'email_date', 'token_count', 'created_at']

class DocumentSerializer(serializers.ModelSerializer):
    chunks_count = serializers.IntegerField(source='chunks.count', read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'filename', 'status', 'total_pages', 'total_chunks',
            'empty_pages', 'created_at', 'updated_at', 'last_ingested_at',
            'error_message', 'chunks_count'
        ]
