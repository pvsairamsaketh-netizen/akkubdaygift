from django.core.management.base import BaseCommand
from documents.services.knowledge_ingestor import KnowledgeIngestor

class Command(BaseCommand):
    help = "Ingest the foundational 15-page knowledge base PDF into SQLite and ChromaDB."

    def add_arguments(self, parser):
        parser.add_argument('--user-id', type=str, default='default_user', help='User ID for scoping memories')
        parser.add_argument('--force', action='store_true', help='Force re-ingestion even if already indexed')

    def handle(self, *args, **options):
        user_id = options['user_id']
        force = options['force']
        self.stdout.write(self.style.NOTICE(f"Ingesting foundational knowledge base for user '{user_id}' (force={force})..."))

        ingestor = KnowledgeIngestor()
        result = ingestor.ingest(user_id=user_id, force=force)

        self.stdout.write(self.style.SUCCESS(
            f"Successfully processed: Document ID={result.get('document_id')}, "
            f"Total Chunks={result.get('total_chunks')}, Total Memories={result.get('total_memories')}"
        ))
