"""Project 1: Simple RAG API — Main Application"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from contextlib import asynccontextmanager
import time
import structlog

from app.core.config import settings
from app.api import chat, documents, agent, monitoring
from app.services.vectorstore_service import VectorStoreService
from app.services.llm_service import LLMService

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting RAG API", version=settings.app_version)

    # Initialize services
    app.state.vectorstore = VectorStoreService()
    app.state.llm = LLMService()

    yield

    logger.info("Shutting down RAG API")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-ready RAG API with multi-LLM support",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time, 4))
    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


# Include routers
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])
app.include_router(agent.router, prefix="/api/v1", tags=["agent"])
app.include_router(monitoring.router, prefix="/api/v1", tags=["monitoring"])


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "endpoints": {
            "chat": "/api/v1/chat",
            "documents": "/api/v1/documents",
            "agent": "/api/v1/agent",
            "health": "/api/v1/health",
        },
    }


@app.get("/api/v1/health")
async def health():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "llm_provider": settings.llm_provider.value,
        "vectordb": settings.vectordb_provider.value,
        "embedding": settings.embedding_provider.value,
    }
