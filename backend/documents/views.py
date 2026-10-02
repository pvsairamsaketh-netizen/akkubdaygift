import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from documents.models import Document
from documents.serializers import DocumentSerializer
from documents.services.ingestion_service import IngestionService
from documents.services.vector_store import ChromaVectorStore

class DocumentListView(APIView):
    def get(self, request):
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

class DocumentIngestView(APIView):
    def post(self, request):
        """
        Ingest a PDF from an uploaded file or a specified local file_path.
        """
        service = IngestionService()
        file_obj = request.FILES.get('file')
        file_path = request.data.get('file_path')

        if file_obj:
            # Save uploaded file temporarily in MEDIA_ROOT
            save_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
            with open(save_path, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
            target_path = save_path
        elif file_path:
            # Relative to BASE_DIR or absolute
            if not os.path.isabs(file_path):
                # Try relative to workspace
                workspace_path = os.path.abspath(os.path.join(settings.BASE_DIR, '..', file_path))
                if os.path.exists(workspace_path):
                    target_path = workspace_path
                else:
                    target_path = os.path.join(settings.BASE_DIR, file_path)
            else:
                target_path = file_path
        else:
            # Default to supplied relationship PDF in project root
            default_pdf = os.path.abspath(
                os.path.join(settings.BASE_DIR, '..', 'Saki_Akku_Refined_Love_Story_Knowledge_Base.pdf')
            )
            if os.path.exists(default_pdf):
                target_path = default_pdf
            else:
                return Response(
                    {"error": "No file uploaded and default PDF not found."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            force_reindex = request.data.get('force', False)
            result = service.ingest_pdf(target_path, force_reindex=force_reindex)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DocumentStatusView(APIView):
    def get(self, request):
        vector_store = ChromaVectorStore.get_instance()
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)
        return Response({
            "total_documents": documents.count(),
            "indexed_documents": documents.filter(status='indexed').count(),
            "total_vectors_in_store": vector_store.count(),
            "collection_name": vector_store.collection_name,
            "documents": serializer.data
        })

class DocumentReindexView(APIView):
    def post(self, request):
        try:
            service = IngestionService()
            result = service.reindex_all()
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DocumentDetailView(APIView):
    def get(self, request, doc_id):
        doc = Document.objects.filter(id=doc_id).first()
        if not doc:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DocumentSerializer(doc)
        return Response(serializer.data)

    def delete(self, request, doc_id):
        service = IngestionService()
        deleted = service.delete_document(doc_id)
        if deleted:
            return Response({"message": f"Document {doc_id} deleted successfully."})
        return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
