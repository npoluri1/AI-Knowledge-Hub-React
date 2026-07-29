"""Document management API endpoints."""
from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from app.models.schemas import DocumentUploadResponse, DocumentInfo
from app.services.document_loader import DocumentLoader
from app.services.text_splitter import TextSplitter
from app.services.embedding_service import EmbeddingService
import uuid
import time
import structlog

logger = structlog.get_logger()
router = APIRouter()

# In-memory document store
documents: dict[str, DocumentInfo] = {}


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    req: Request = None,
):
    """Upload a document for RAG indexing."""
    start_time = time.time()

    # Validate file type
    allowed_types = [".pdf", ".txt", ".md", ".docx", ".csv"]
    file_ext = "." + file.filename.split(".")[-1].lower()
    if file_ext not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not supported. Allowed: {allowed_types}",
        )

    try:
        # Read file content
        content = await file.read()

        # Load document
        loader = DocumentLoader()
        documents_text = loader.load(content, file_ext)

        # Split into chunks
        splitter = TextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        chunks = splitter.split(documents_text)

        # Generate embeddings and store
        doc_id = str(uuid.uuid4())
        embedding_service = EmbeddingService()
        await embedding_service.store_chunks(
            document_id=doc_id,
            chunks=chunks,
            metadata={"filename": file.filename},
        )

        # Store document info
        doc_info = DocumentInfo(
            document_id=doc_id,
            filename=file.filename,
            chunks=len(chunks),
            upload_time=time.strftime("%Y-%m-%d %H:%M:%S"),
        )
        documents[doc_id] = doc_info

        latency = (time.time() - start_time) * 1000
        logger.info(
            "Document uploaded",
            doc_id=doc_id,
            filename=file.filename,
            chunks=len(chunks),
            latency_ms=latency,
        )

        return DocumentUploadResponse(
            document_id=doc_id,
            filename=file.filename,
            chunks=len(chunks),
            embedding_dim=384,
            status="indexed",
        )

    except Exception as e:
        logger.error("Upload error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents", response_model=list[DocumentInfo])
async def list_documents():
    """List all uploaded documents."""
    return list(documents.values())


@router.get("/documents/{document_id}")
async def get_document(document_id: str):
    """Get document details."""
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
    return documents[document_id]


@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document and its embeddings."""
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete from vector store
    embedding_service = EmbeddingService()
    await embedding_service.delete_document(document_id)

    del documents[document_id]
    return {"status": "deleted", "document_id": document_id}


@router.post("/documents/search")
async def search_documents(
    query: str,
    top_k: int = 5,
):
    """Search documents by semantic similarity."""
    embedding_service = EmbeddingService()
    results = await embedding_service.search(query, top_k=top_k)
    return {"query": query, "results": results}
