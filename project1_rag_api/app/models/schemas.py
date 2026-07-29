"""Pydantic models for API requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    OLLAMA = "ollama"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    session_id: Optional[str] = Field(None, description="Session ID for conversation history")
    model: Optional[str] = Field(None, description="LLM model to use")
    temperature: Optional[float] = Field(None, ge=0, le=2, description="Temperature")
    max_tokens: Optional[int] = Field(None, ge=1, le=8192, description="Max tokens")
    use_rag: bool = Field(True, description="Use RAG for context retrieval")
    top_k: int = Field(5, ge=1, le=20, description="Number of documents to retrieve")


class ChatResponse(BaseModel):
    response: str
    session_id: str
    model: str
    sources: list[dict] = []
    tokens_used: int = 0
    latency_ms: float = 0
    cached: bool = False


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    chunks: int
    embedding_dim: int
    status: str


class DocumentInfo(BaseModel):
    document_id: str
    filename: str
    chunks: int
    upload_time: str


class AgentRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    tools: list[str] = Field(default=["search", "calculate", "web_search"])
    max_iterations: int = Field(10, ge=1, le=50)


class AgentResponse(BaseModel):
    response: str
    steps: list[dict] = []
    tools_used: list[str] = []
    iterations: int = 0
    latency_ms: float = 0


class HealthResponse(BaseModel):
    status: str
    version: str
    llm_provider: str
    vectordb: str
    embedding: str
