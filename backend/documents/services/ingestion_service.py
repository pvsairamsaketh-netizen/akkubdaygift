"""
Ingestion Service for Saki & Akku relationship documentation.
Orchestrates PDF extraction, duplicate checking, chunking, embedding generation,
and storage in both ChromaDB and SQLite.
"""

import os
import hashlib
import logging
from typing import Dict, Any, Optional
from django.utils import timezone
from django.db import transaction

from documents.models import Document, DocumentChunk
from documents.services.pdf_extractor import PDFExtractor
from documents.services.chunker import DocumentChunker
from documents.services.vector_store import ChromaVectorStore
from chat.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self):
        self.extractor = PDFExtractor()
        self.chunker = DocumentChunker()
        self.vector_store = ChromaVectorStore.get_instance()
        self.embedding_service = EmbeddingService.get_instance()

    @staticmethod
    def compute_sha256(file_path: str) -> str:
        """Computes SHA-256 hash of a file to prevent duplicate ingestion."""
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def ingest_pdf(self, file_path: str, force_reindex: bool = False) -> Dict[str, Any]:
        """
        Ingests a PDF document into SQLite and ChromaDB.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        filename = os.path.basename(file_path)
        content_hash = self.compute_sha256(file_path)

        # Check for existing document by hash
        existing_doc = Document.objects.filter(content_hash=content_hash).first()
        if existing_doc and not force_reindex:
            if existing_doc.status == 'indexed':
                logger.info(f"Document '{filename}' already indexed (ID: {existing_doc.id}). Skipping.")
                return {
                    "document_id": str(existing_doc.id),
                    "filename": existing_doc.filename,
                    "status": "already_indexed",
                    "total_pages": existing_doc.total_pages,
                    "total_chunks": existing_doc.total_chunks,
                    "empty_pages": existing_doc.empty_pages,
                    "message": "Document is already fully indexed and up to date."
                }

        # Create or update document record
        with transaction.atomic():
            if existing_doc:
                doc = existing_doc
                doc.status = 'processing'
                doc.file_path = file_path
                doc.error_message = None
                doc.save()
                # Clean existing DB chunks and Chroma vectors
                doc.chunks.all().delete()
                self.vector_store.delete_document(str(doc.id))
            else:
                doc = Document.objects.create(
                    filename=filename,
                    file_path=file_path,
                    content_hash=content_hash,
                    status='processing'
                )

        try:
            # 1. Extract text page by page
            extraction_result = self.extractor.extract_from_pdf(file_path)
            pages = extraction_result["pages"]
            total_pages = extraction_result["total_pages"]
            empty_pages = extraction_result["empty_pages"]

            # 2. Chunk text
            chunks = self.chunker.chunk_document(pages, filename, str(doc.id))

            if not chunks:
                doc.status = 'failed'
                doc.error_message = "No extractable text chunks found in document."
                doc.total_pages = total_pages
                doc.empty_pages = empty_pages
                doc.save()
                return {
                    "document_id": str(doc.id),
                    "filename": filename,
                    "status": "failed",
                    "error": doc.error_message,
                    "empty_pages": empty_pages
                }

            # 3. Generate embeddings
            texts_to_embed = [chunk["text"] for chunk in chunks]
            embeddings = self.embedding_service.embed_documents(texts_to_embed)

            # 4. Store in ChromaDB
            self.vector_store.add_chunks(chunks, embeddings)

            # 5. Store chunks in database
            chunk_objects = [
                DocumentChunk(
                    document=doc,
                    chunk_index=chunk["chunk_index"],
                    page_number=chunk["page_number"],
                    text=chunk["text"],
                    email_subject=chunk.get("email_subject") or None,
                    email_date=chunk.get("email_date") or None,
                    token_count=chunk.get("token_count", 0)
                )
                for chunk in chunks
            ]
            DocumentChunk.objects.bulk_create(chunk_objects)

            # 6. Update document status
            doc.status = 'indexed'
            doc.total_pages = total_pages
            doc.total_chunks = len(chunks)
            doc.empty_pages = empty_pages
            doc.last_ingested_at = timezone.now()
            doc.save()

            logger.info(f"Ingested '{filename}': {total_pages} pages ({len(empty_pages)} empty), {len(chunks)} chunks.")
            return {
                "document_id": str(doc.id),
                "filename": filename,
                "status": "indexed",
                "total_pages": total_pages,
                "total_chunks": len(chunks),
                "empty_pages": empty_pages,
                "total_vector_count": self.vector_store.count(),
                "message": f"Successfully indexed {len(chunks)} chunks across {total_pages} pages."
            }

        except Exception as e:
            logger.error(f"Failed to ingest document '{filename}': {e}", exc_info=True)
            doc.status = 'failed'
            doc.error_message = str(e)
            doc.save()
            raise RuntimeError(f"Ingestion failed for {filename}: {e}") from e

    def delete_document(self, document_id: str) -> bool:
        """Deletes a document from SQLite and ChromaDB."""
        try:
            doc = Document.objects.filter(id=document_id).first()
            if not doc:
                return False
            self.vector_store.delete_document(str(doc.id))
            doc.delete()
            return True
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {e}")
            raise

    def reindex_all(self) -> Dict[str, Any]:
        """Clears vector store and re-indexes all active documents."""
        self.vector_store.clear()
        docs = Document.objects.all()
        results = []
        for doc in docs:
            if doc.file_path and os.path.exists(doc.file_path):
                res = self.ingest_pdf(doc.file_path, force_reindex=True)
                results.append(res)
        return {
            "reindexed_count": len(results),
            "documents": results,
            "total_vectors": self.vector_store.count()
        }
