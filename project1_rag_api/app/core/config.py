"""Project 1: Simple RAG API — Configuration"""
from pydantic_settings import BaseSettings
from typing import Optional
from enum import Enum


class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    OLLAMA = "ollama"


class EmbeddingProvider(str, Enum):
    OPENAI = "openai"
    SENTENCE_TRANSFORMERS = "sentence-transformers"
    COHERE = "cohere"
    VOYAGE = "voyage"


class VectorDBProvider(str, Enum):
    CHROMA = "chroma"
    QDRANT = "qdrant"
    PGVECTOR = "pgvector"


class Settings(BaseSettings):
    # App
    app_name: str = "RAG API"
    app_version: str = "1.0.0"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    # LLM
    llm_provider: LLMProvider = LLMProvider.OLLAMA
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    google_api_key: Optional[str] = None
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"
    openai_model: str = "gpt-4o"
    anthropic_model: str = "claude-sonnet-4-20250514"
    google_model: str = "gemini-2.0-flash"
    temperature: float = 0.1
    max_tokens: int = 4096

    # Embeddings
    embedding_provider: EmbeddingProvider = EmbeddingProvider.SENTENCE_TRANSFORMERS
    embedding_model: str = "all-MiniLM-L6-v2"
    embedding_dim: int = 384

    # VectorDB
    vectordb_provider: VectorDBProvider = VectorDBProvider.CHROMA
    chroma_persist_dir: str = "./data/chroma"
    chroma_collection: str = "documents"
    qdrant_url: str = "http://localhost:6333"
    pgvector_url: str = "postgresql://localhost:5432/rag_db"

    # RAG
    chunk_size: int = 1000
    chunk_overlap: int = 200
    retrieval_top_k: int = 5
    retrieval_score_threshold: float = 0.7
    rerank_top_n: int = 3

    # Agent
    agent_max_iterations: int = 10
    agent_enable_tools: bool = True

    # Monitoring
    langsmith_api_key: Optional[str] = None
    langsmith_project: str = "rag-api-project"
    enable_tracing: bool = False

    # Security
    api_key_header: str = "X-API-Key"
    api_keys: list[str] = []
    enable_guardrails: bool = True
    max_request_size_mb: int = 10

    # Evaluation
    enable_eval: bool = False
    eval_sample_size: int = 10

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
