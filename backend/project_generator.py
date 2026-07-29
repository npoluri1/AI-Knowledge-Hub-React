"""
project_generator.py — Generates complete project structures from job descriptions.

Takes a job's tech stack, domain, and requirements, and generates:
  - Project architecture (components, layers, data flow)
  - Full source code files (backend, frontend, infra, configs)
  - Architecture diagrams (Mermaid.js format)
  - Business domain documentation
  - Design patterns documentation
"""

import json
import re
from dataclasses import dataclass, field, asdict
from typing import Any

# =========================================================================
# Data Models
# =========================================================================

@dataclass
class ArchitectureComponent:
    name: str
    description: str
    tech: str
    layer: str  # frontend, backend, ai, data, infra
    dependencies: list[str] = field(default_factory=list)

@dataclass
class DataFlow:
    from_component: str
    to_component: str
    protocol: str
    description: str

@dataclass
class SourceFile:
    path: str
    content: str
    description: str

@dataclass
class GeneratedProject:
    job_title: str
    company: str
    domain: str
    description: str
    architecture: list[ArchitectureComponent]
    data_flows: list[DataFlow]
    design_patterns: list[dict]
    files: list[SourceFile]
    mermaid_arch: str  # Architecture diagram in Mermaid format
    mermaid_business: str  # Business flow diagram in Mermaid format
    mermaid_deploy: str  # Deployment diagram in Mermaid format

# =========================================================================
# Analysis & Generation
# =========================================================================

def analyze_tech_stack(techs: list[str]) -> dict:
    """Categorize the tech stack into layers."""
    categories = {
        "frontend": [],
        "backend": [],
        "ai_ml": [],
        "data": [],
        "infra": [],
        "agent": [],
    }

    mapping = {
        "frontend": {"react", "reactjs", "nextjs", "typescript", "javascript", "tailwind", "html", "css"},
        "backend": {"fastapi", "flask", "django", "nodejs", "express", "go", "java", "spring", "rust", "graphql"},
        "ai_ml": {"pytorch", "tensorflow", "transformers", "hugging face", "llms", "openai", "anthropic",
                   "langchain", "llamaindex", "embedding", "fine-tun", "lora", "qlora", "mlflow"},
        "agent": {"langgraph", "creawai", "autogen", "crewai", "mcp", "agent", "tool", "function call",
                   "multi-agent", "react", "agent gateway", "agent loop"},
        "data": {"vector db", "pinecone", "chromadb", "faiss", "qdrant", "weaviate", "postgresql",
                  "sql", "redis", "kafka", "airflow", "spark", "snowflake", "mongodb"},
        "infra": {"docker", "kubernetes", "k8s", "aws", "azure", "gcp", "ci/cd", "mlops",
                   "observability", "monitoring", "prometheus", "grafana"},
    }

    for tech in techs:
        tl = tech.lower()
        placed = False
        for category, keywords in mapping.items():
            for kw in keywords:
                if kw in tl:
                    categories[category].append(tech)
                    placed = True
                    break
            if placed:
                break
        if not placed:
            categories["backend"].append(tech)

    return categories


def generate_project(job_title: str, company: str, techs: list[str],
                     desc: str, use_cases: str) -> GeneratedProject:
    """Generate a complete project structure from a job description."""
    categorized = analyze_tech_stack(techs)
    domain = _extract_domain(desc, use_cases)

    # Build architecture components
    components = _build_architecture(categorized, domain)
    data_flows = _build_data_flows(components)
    design_patterns = _build_design_patterns(categorized, domain)
    files = _build_source_files(categorized, domain, job_title, company)

    mermaid_arch = _build_architecture_diagram(components)
    mermaid_business = _build_business_diagram(domain, use_cases)
    mermaid_deploy = _build_deployment_diagram(categorized)

    return GeneratedProject(
        job_title=job_title,
        company=company,
        domain=domain,
        description=desc[:500] + "...",
        architecture=components,
        data_flows=data_flows,
        design_patterns=design_patterns,
        files=files,
        mermaid_arch=mermaid_arch,
        mermaid_business=mermaid_business,
        mermaid_deploy=mermaid_deploy,
    )


def _extract_domain(desc: str, use_cases: str) -> str:
    """Extract business domain from job description."""
    combined = (desc + " " + use_cases).lower()
    domain_keywords = {
        "automotive": ["automotive", "hyundai", "auto", "car", "vehicle", "mobility"],
        "healthcare": ["healthcare", "health", "medical", "patient", "hipaa", "pharma"],
        "finance": ["finance", "banking", "investment", "insurance", "fintech"],
        "manufacturing": ["manufacturing", "factory", "supply chain", "logistics"],
        "technology": ["saas", "platform", "cloud", "software"],
        "retail": ["retail", "ecommerce", "customer"],
        "defense": ["defense", "security", "government", "public sector"],
        "energy": ["energy", "power", "geothermal", "oil", "gas"],
    }

    scores = {}
    for domain, keywords in domain_keywords.items():
        scores[domain] = sum(1 for kw in keywords if kw in combined)

    if scores:
        best = max(scores, key=scores.get)
        if scores[best] > 0:
            return best
    return "technology"


def _build_architecture(categorized: dict, domain: str) -> list[ArchitectureComponent]:
    """Build system architecture components based on tech stack."""
    components = []

    # Frontend Layer
    if categorized["frontend"]:
        fe_tech = categorized["frontend"][0]
    else:
        fe_tech = "React"

    components.append(ArchitectureComponent(
        name=f"{fe_tech} Frontend",
        description=f"User interface with real-time streaming, agent interaction dashboard, and monitoring UI",
        tech=fe_tech,
        layer="frontend",
        dependencies=["API Gateway", "WebSocket Server"],
    ))

    # Backend Layer
    be_tech = categorized["backend"][0] if categorized["backend"] else "FastAPI"
    components.append(ArchitectureComponent(
        name=f"{be_tech} API Gateway",
        description=f"API gateway and request routing, authentication, rate limiting",
        tech=be_tech,
        layer="backend",
        dependencies=[],
    ))

    # AI/ML Layer
    if categorized["ai_ml"]:
        components.append(ArchitectureComponent(
            name="LLM Orchestration Engine",
            description="Multi-provider LLM integration with prompt management, model routing, fallback chains",
            tech=", ".join(categorized["ai_ml"][:3]),
            layer="ai",
            dependencies=["API Gateway", "Vector Database"],
        ))
        components.append(ArchitectureComponent(
            name="RAG Pipeline",
            description="Retrieval-Augmented Generation with hybrid search, re-ranking, context assembly",
            tech="LangChain + Embedding Models",
            layer="ai",
            dependencies=["Vector Database", "LLM Orchestration"],
        ))

    # Agent Layer
    if categorized["agent"]:
        components.append(ArchitectureComponent(
            name="Multi-Agent Orchestrator",
            description="Autonomous agent system with planning, execution, tool-use, and human-in-the-loop",
            tech=", ".join(categorized["agent"][:3]),
            layer="agent",
            dependencies=["LLM Orchestration", "API Gateway"],
        ))
        components.append(ArchitectureComponent(
            name="Agent Gateway & MCP Server",
            description="Model Context Protocol server for standardized agent-to-tool communication",
            tech="MCP + Tool Registry",
            layer="agent",
            dependencies=["Multi-Agent Orchestrator"],
        ))

    # Data Layer
    if categorized["data"]:
        components.append(ArchitectureComponent(
            name="Vector Database",
            description="High-dimensional vector storage for semantic search and RAG",
            tech=", ".join(categorized["data"][:2]),
            layer="data",
            dependencies=[],
        ))
    components.append(ArchitectureComponent(
        name="Message Queue & Event Bus",
        description="Async event-driven communication between services",
        tech="Kafka / RabbitMQ",
        layer="data",
        dependencies=[],
    ))

    # Infrastructure Layer
    if categorized["infra"]:
        components.append(ArchitectureComponent(
            name="Container Orchestration",
            description="Containerized microservices with auto-scaling and service mesh",
            tech=", ".join(categorized["infra"][:2]),
            layer="infra",
            dependencies=[],
        ))
    components.append(ArchitectureComponent(
        name="Observability Stack",
        description="Metrics, logging, tracing, and monitoring for all services",
        tech="Prometheus + Grafana + OpenTelemetry",
        layer="infra",
        dependencies=[],
    ))
    components.append(ArchitectureComponent(
        name="Evaluation & Guardrails Engine",
        description="LLM output validation, safety checks, bias detection, and performance evaluation",
        tech="Guardrails + Evaluation Framework",
        layer="ai",
        dependencies=["LLM Orchestration"],
    ))

    return components


def _build_data_flows(components: list[ArchitectureComponent]) -> list[DataFlow]:
    """Define data flows between components."""
    flows = []
    comp_map = {c.name: c for c in components}

    flow_defs = [
        ("React Frontend", f"{components[1].name if len(components) > 1 else 'API Gateway'}", "REST/WebSocket", "User requests and real-time updates"),
    ]

    for name, deps in [(c.name, c.dependencies) for c in components]:
        for dep in deps:
            if dep in comp_map:
                flows.append(DataFlow(
                    from_component=name,
                    to_component=dep,
                    protocol="gRPC / REST",
                    description=f"Service-to-service communication",
                ))

    return flows


def _build_design_patterns(categorized: dict, domain: str) -> list[dict]:
    """Identify relevant design patterns."""
    patterns = [
        {
            "name": "Multi-Agent Orchestration",
            "pattern": "Orchestrator-Worker",
            "description": "Central orchestrator agent decomposes tasks and delegates to specialized worker agents",
            "when_to_use": "Complex multi-step workflows requiring specialized agent capabilities",
        },
        {
            "name": "RAG with Hybrid Search",
            "pattern": "Retrieval-Augmented Generation + Fusion",
            "description": "Combine vector similarity, BM25 keyword search, and knowledge graph traversal with RRF fusion",
            "when_to_use": "High-accuracy information retrieval from large knowledge bases",
        },
        {
            "name": "Agent Communication Protocol",
            "pattern": "Model Context Protocol (MCP)",
            "description": "Standardized protocol for agents to discover and invoke tools, share context, and coordinate",
            "when_to_use": "Multi-agent systems requiring standardized tool access and context sharing",
        },
        {
            "name": "Human-in-the-Loop",
            "pattern": "Approval Gateway",
            "description": "High-risk agent actions pause and request human approval before execution",
            "when_to_use": "Enterprise deployments requiring governance, compliance, and risk management",
        },
        {
            "name": "CQRS + Event Sourcing",
            "pattern": "Command Query Responsibility Segregation",
            "description": "Separate read and write models for agent state, audit trails, and analytics",
            "when_to_use": "Systems requiring audit logging, event replay, and scalable read/write paths",
        },
        {
            "name": "Circuit Breaker",
            "pattern": "Resilience Pattern",
            "description": "Prevent cascading failures when external LLM APIs or services are unavailable",
            "when_to_use": "Any system depending on external LLM APIs with rate limits and variable latency",
        },
        {
            "name": "Semantic Caching",
            "pattern": "Cache-Aside with Embedding Similarity",
            "description": "Cache LLM responses based on semantic similarity of queries to reduce cost and latency",
            "when_to_use": "Production systems with repeated or similar queries to reduce LLM costs",
        },
    ]

    if "agent" in categorized and categorized["agent"]:
        patterns.insert(0, {
            "name": "ReAct Pattern",
            "pattern": "Reasoning + Acting",
            "description": "Interleaved reasoning traces with tool-calling actions for transparent agent decision-making",
            "when_to_use": "All agent systems requiring explainable, step-by-step reasoning",
        })

    return patterns


def _build_source_files(categorized: dict, domain: str,
                        job_title: str, company: str) -> list[SourceFile]:
    """Generate complete source code files for the project."""
    files = []
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', job_title.lower()).strip('-')[:40]
    company_slug = re.sub(r'[^a-zA-Z0-9]+', '-', company.lower()).strip('-')[:20]

    # ====== BACKEND CORE ======

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/main.py",
        content=generate_backend_main(categorized, domain, job_title),
        description="FastAPI application entry point with all routes",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/config.py",
        content=generate_config(categorized),
        description="Configuration management with environment variables",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/models/schemas.py",
        content=generate_schemas(),
        description="Pydantic models for API request/response validation",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/services/rag_service.py",
        content=generate_rag_service(categorized),
        description="RAG pipeline with hybrid search and re-ranking",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/services/agent_orchestrator.py",
        content=generate_agent_orchestrator(categorized),
        description="Multi-agent orchestration with LangGraph/CrewAI",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/services/llm_factory.py",
        content=generate_llm_factory(),
        description="Multi-provider LLM abstraction with fallback chains",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/services/guardrails.py",
        content=generate_guardrails(),
        description="Input/output guardrails, PII detection, content safety",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/services/evaluation.py",
        content=generate_evaluation(),
        description="LLM output evaluation, accuracy metrics, and tracing",
    ))

    # ====== AGENT GATEWAY MCP ======

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/mcp/server.py",
        content=generate_mcp_server(),
        description="Model Context Protocol server for agent tool integration",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/backend/app/mcp/tools.py",
        content=generate_mcp_tools(),
        description="MCP tool definitions for enterprise system integration",
    ))

    # ====== FRONTEND ======

    fe_tech = "Next.js" if "nextjs" in str(categorized).lower() else "React"
    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/frontend/package.json",
        content=generate_package_json(fe_tech),
        description=f"{fe_tech} frontend project configuration",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/frontend/src/app/page.tsx",
        content=generate_frontend_main(fe_tech),
        description="Main application page with agent chat interface",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/frontend/src/components/AgentChat.tsx",
        content=generate_agent_chat(),
        description="Real-time agent chat interface with streaming responses",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/frontend/src/components/Dashboard.tsx",
        content=generate_dashboard(),
        description="Agent performance dashboard with metrics and monitoring",
    ))

    # ====== INFRASTRUCTURE ======

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/docker-compose.yml",
        content=generate_docker_compose(categorized),
        description="Docker Compose for local development",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/kubernetes/deployment.yaml",
        content=generate_kubernetes(),
        description="Kubernetes deployment manifests",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/.env.example",
        content=generate_env_example(categorized),
        description="Environment variable template",
    ))

    # ====== DOCUMENTATION ======

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/docs/architecture.md",
        content=generate_architecture_doc(categorized, domain),
        description="System architecture documentation",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/docs/api.md",
        content=generate_api_doc(),
        description="API reference documentation",
    ))

    files.append(SourceFile(
        path=f"projects/{company_slug}/{slug}/README.md",
        content=generate_readme(job_title, company, domain),
        description="Project README with setup instructions",
    ))

    return files


# =========================================================================
# Code Generators
# =========================================================================

def generate_backend_main(categorized: dict, domain: str, job_title: str) -> str:
    return f'''"""
{job_title} — Production AI Agent Platform
Domain: {domain}
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import json
import asyncio
import uuid
from typing import AsyncGenerator

from app.config import Settings, get_settings
from app.models.schemas import (
    ChatRequest, ChatResponse, AgentRequest, AgentResponse,
    DocumentQuery, DocumentResponse, FeedbackRequest,
)
from app.services.rag_service import RAGService
from app.services.agent_orchestrator import AgentOrchestrator
from app.services.llm_factory import LLMFactory
from app.services.guardrails import GuardrailsEngine
from app.services.evaluation import EvaluationTracker

app = FastAPI(
    title="{job_title}",
    description="Enterprise AI Agent Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
settings = get_settings()
llm_factory = LLMFactory(settings)
rag_service = RAGService(settings, llm_factory)
guardrails = GuardrailsEngine()
evaluator = EvaluationTracker()
agent_orchestrator = AgentOrchestrator(settings, llm_factory, rag_service)


@app.get("/health")
async def health():
    return {{"status": "healthy", "service": "{job_title}"}}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    \"\"\"Chat with the AI assistant using RAG-enhanced responses.\"\"\"
    # Input guardrails
    is_safe, checked_input = guardrails.check_input(request.message)
    if not is_safe:
        return ChatResponse(
            response="I cannot process that request.",
            sources=[], safety_check="blocked",
        )

    # Generate response with RAG
    result = await rag_service.query(
        query=checked_input,
        conversation_id=request.conversation_id,
        stream=request.stream,
    )

    # Output guardrails
    safe_response = guardrails.check_output(result["response"])

    return ChatResponse(
        response=safe_response,
        sources=result.get("sources", []),
        confidence=result.get("confidence", 0.0),
        safety_check="passed",
    )


@app.post("/api/agent/execute", response_model=AgentResponse)
async def execute_agent(request: AgentRequest):
    \"\"\"Execute a multi-agent workflow.\"\"\"
    task_id = str(uuid.uuid4())

    # Run agent orchestration
    result = await agent_orchestrator.execute(
        task=request.task,
        context=request.context,
        task_id=task_id,
        human_in_the_loop=request.require_approval,
    )

    # Track evaluation
    evaluator.track_run(task_id, result)

    return AgentResponse(
        task_id=task_id,
        status=result["status"],
        output=result["output"],
        steps=result.get("steps", []),
        agent_trace=result.get("trace", []),
        metrics=result.get("metrics", {{}}),
    )


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    \"\"\"Streaming chat endpoint.\"\"\"
    async def generate() -> AsyncGenerator[str, None]:
        is_safe, checked = guardrails.check_input(request.message)
        if not is_safe:
            yield json.dumps({{"error": "Content blocked"}})
            return
        async for chunk in rag_service.query_stream(checked, request.conversation_id):
            yield json.dumps(chunk) + "\\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.post("/api/documents/query", response_model=DocumentResponse)
async def query_documents(request: DocumentQuery):
    \"\"\"Query the knowledge base with RAG.\"\"\"
    results = await rag_service.search(
        query=request.query,
        top_k=request.top_k or 5,
        filters=request.filters,
    )
    return DocumentResponse(results=results, total=len(results))


@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    \"\"\"Submit feedback for response quality tracking.\"\"\"
    evaluator.record_feedback(
        request.query_id, request.rating, request.comments
    )
    return {{"status": "recorded"}}


@app.get("/api/metrics")
async def get_metrics():
    \"\"\"Get system performance metrics.\"\"\"
    return evaluator.get_summary()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''


def generate_config(categorized: dict) -> str:
    return '''"""
Application configuration with environment variable management.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    app_name: str = "AI Agent Platform"
    debug: bool = False
    environment: str = "development"

    # LLM Providers
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o"
    anthropic_api_key: Optional[str] = None
    anthropic_model: str = "claude-sonnet-4-20250514"
    local_model_url: Optional[str] = None
    embedding_model: str = "text-embedding-3-small"

    # Vector Database
    vector_db_type: str = "pinecone"
    pinecone_api_key: Optional[str] = None
    pinecone_index: str = "knowledge-base"
    chroma_host: str = "localhost"
    chroma_port: int = 8000

    # Agent Configuration
    max_agent_steps: int = 25
    agent_timeout_seconds: int = 120
    human_approval_timeout: int = 300
    enable_mcp: bool = True

    # Monitoring
    otel_endpoint: Optional[str] = None
    log_level: str = "INFO"

    # Database
    database_url: str = "postgresql+asyncpg://user:pass@localhost:5432/agents"
    redis_url: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        case_sensitive = False


_settings: Optional[Settings] = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
'''


def generate_schemas() -> str:
    return '''"""
Pydantic models for API request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    conversation_id: Optional[str] = None
    stream: bool = False
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)


class ChatResponse(BaseModel):
    response: str
    sources: list[dict] = []
    confidence: float = 0.0
    safety_check: str = "passed"
    processing_time_ms: Optional[float] = None


class AgentRequest(BaseModel):
    task: str = Field(..., min_length=1, max_length=5000)
    context: dict = {}
    require_approval: bool = False
    agent_type: str = "auto"


class AgentStep(BaseModel):
    step_id: str
    agent: str
    action: str
    input: str
    output: str
    duration_ms: float
    timestamp: datetime


class AgentResponse(BaseModel):
    task_id: str
    status: str  # completed, pending_approval, failed
    output: str
    steps: list[AgentStep] = []
    agent_trace: list[dict] = []
    metrics: dict = {}


class DocumentQuery(BaseModel):
    query: str
    top_k: int = Field(default=5, ge=1, le=50)
    filters: Optional[dict] = None


class DocumentResponse(BaseModel):
    results: list[dict]
    total: int


class FeedbackRequest(BaseModel):
    query_id: str
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None
'''


def generate_rag_service(categorized: dict) -> str:
    return '''"""
RAG Pipeline Service — Hybrid search with semantic reranking.
"""
from typing import Optional
import numpy as np


class RAGService:
    """Retrieval-Augmented Generation pipeline with hybrid search."""

    def __init__(self, settings, llm_factory):
        self.settings = settings
        self.llm = llm_factory
        self.vector_store = None  # Initialize based on settings.vector_db_type
        self.embedding_cache = {{}}

    async def embed(self, text: str) -> list[float]:
        """Generate embeddings for a text."""
        if text in self.embedding_cache:
            return self.embedding_cache[text]

        embedding = await self.llm.create_embedding(text)
        self.embedding_cache[text] = embedding
        return embedding

    async def hybrid_search(self, query: str, top_k: int = 10) -> list[dict]:
        """Perform hybrid search combining vector and keyword."""
        query_embedding = await self.embed(query)

        # Vector search
        vector_results = await self._vector_search(query_embedding, top_k * 2)

        # Keyword search (BM25)
        keyword_results = await self._keyword_search(query, top_k * 2)

        # Reciprocal Rank Fusion
        return self._rrf_fusion(vector_results, keyword_results, top_k)

    def _rrf_fusion(self, vector_results: list, keyword_results: list,
                    top_k: int, k: int = 60) -> list[dict]:
        """Reciprocal Rank Fusion for hybrid search results."""
        scores = {{}}

        for i, doc in enumerate(vector_results):
            doc_id = doc.get("id", i)
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + i + 1)
            scores[f"_{doc_id}_data"] = doc

        for i, doc in enumerate(keyword_results):
            doc_id = doc.get("id", i)
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + i + 1)
            if f"_{doc_id}_data" not in scores:
                scores[f"_{doc_id}_data"] = doc

        ranked = sorted(
            [(k, v) for k, v in scores.items() if not str(k).startswith("_")],
            key=lambda x: x[1], reverse=True,
        )

        results = []
        for doc_id, score in ranked[:top_k]:
            doc = scores.get(f"_{doc_id}_data", {{}})
            if isinstance(doc, dict):
                doc["fusion_score"] = round(score, 4)
                results.append(doc)

        return results

    async def rerank(self, query: str, documents: list[dict],
                     top_k: int = 5) -> list[dict]:
        """Rerank documents using cross-encoder."""
        if len(documents) <= top_k:
            return documents

        pairs = [(query, d.get("text", "")) for d in documents]
        # Use LLM for lightweight reranking
        scores = await self.llm.rerank(query, [d.get("text", "") for d in documents])

        for i, score in enumerate(scores):
            if i < len(documents):
                documents[i]["rerank_score"] = score

        documents.sort(key=lambda x: x.get("rerank_score", 0), reverse=True)
        return documents[:top_k]

    async def query(self, query: str, conversation_id: str = None,
                    stream: bool = False) -> dict:
        """Full RAG query pipeline."""
        # Step 1: Query rewriting
        rewritten = await self.llm.rewrite_query(query)

        # Step 2: Hybrid search
        documents = await self.hybrid_search(rewritten)

        # Step 3: Rerank
        top_docs = await self.rerank(query, documents)

        # Step 4: Context assembly
        context = self._assemble_context(top_docs)

        # Step 5: Generate response
        response = await self.llm.generate(
            system_prompt=self._build_system_prompt(context),
            user_message=query,
            stream=stream,
        )

        return {{
            "response": response,
            "sources": [{{"title": d.get("title", ""), "url": d.get("url", ""),
                          "score": d.get("fusion_score", 0)}}
                        for d in top_docs],
            "confidence": top_docs[0].get("fusion_score", 0) if top_docs else 0,
        }}

    async def query_stream(self, query: str, conversation_id: str = None):
        """Streaming RAG query."""
        rewritten = await self.llm.rewrite_query(query)
        documents = await self.hybrid_search(rewritten)
        top_docs = await self.rerank(query, documents)
        context = self._assemble_context(top_docs)

        async for chunk in self.llm.generate_stream(
            system_prompt=self._build_system_prompt(context),
            user_message=query,
        ):
            yield chunk

    def _assemble_context(self, documents: list[dict], max_tokens: int = 8000) -> str:
        """Assemble context from retrieved documents."""
        parts = []
        for i, doc in enumerate(documents[:10]):
            text = doc.get("text", "")[:2000]
            source = doc.get("title", f"Document {i+1}")
            parts.append(f"[{i+1}] {source}\\n{text}")
        return "\\n\\n---\\n\\n".join(parts)

    def _build_system_prompt(self, context: str) -> str:
        return f"""You are an expert AI assistant for {self.settings.app_name}.
Use the following context to answer the user's question accurately.
Always cite your sources using [1], [2], etc.
If you're unsure or the context doesn't contain relevant information, say so.

Context:
{context}"""

    async def _vector_search(self, embedding: list[float], top_k: int) -> list[dict]:
        """Vector similarity search. Implement based on vector DB type."""
        # Placeholder — integrate with Pinecone, ChromaDB, FAISS, etc.
        return []

    async def _keyword_search(self, query: str, top_k: int) -> list[dict]:
        """BM25 keyword search."""
        return []

    async def search(self, query: str, top_k: int = 5,
                     filters: Optional[dict] = None) -> list[dict]:
        """Public search interface."""
        return await self.hybrid_search(query, top_k)
'''


def generate_agent_orchestrator(categorized: dict) -> str:
    return '''"""
Multi-Agent Orchestrator — Coordinates specialized agents using LangGraph/CrewAI patterns.
"""
import asyncio
import hashlib
import json
import time
import uuid
from typing import Optional


class AgentOrchestrator:
    """Orchestrates multi-agent workflows with planning, execution, and monitoring."""

    def __init__(self, settings, llm_factory, rag_service):
        self.settings = settings
        self.llm = llm_factory
        self.rag = rag_service
        self.active_tasks: dict = {{}}
        self.agent_registry = self._register_agents()

    def _register_agents(self) -> dict:
        """Register available agent types."""
        return {{
            "research": {{
                "name": "Research Agent",
                "capabilities": ["web_search", "document_analysis", "data_extraction"],
                "model": "gpt-4o",
            }},
            "analysis": {{
                "name": "Analysis Agent",
                "capabilities": ["data_analysis", "trend_identification", "reporting"],
                "model": "claude-sonnet-4-20250514",
            }},
            "code": {{
                "name": "Code Agent",
                "capabilities": ["code_generation", "code_review", "debugging"],
                "model": "gpt-4o",
            }},
            "orchestrator": {{
                "name": "Orchestrator Agent",
                "capabilities": ["planning", "decomposition", "coordination"],
                "model": "claude-sonnet-4-20250514",
            }},
        }}

    async def execute(self, task: str, context: dict,
                      task_id: str = None, human_in_the_loop: bool = False) -> dict:
        """Execute a task using multi-agent workflow."""
        task_id = task_id or str(uuid.uuid4())
        start_time = time.time()
        steps = []
        trace = []

        # Step 1: Task Decomposition
        plan = await self._decompose_task(task, context)

        # Step 2: Agent Selection
        agents = self._select_agents(plan)
        trace.append({{"step": "planning", "plan": plan, "agents": list(agents.keys())}})

        # Step 3: Execute with agent loop
        results = {{}}
        for step_info in plan["steps"]:
            agent_type = step_info.get("agent", "research")
            agent_config = agents.get(agent_type, agents["research"])

            step_start = time.time()
            step_result = await self._execute_step(
                agent_type, step_info, context, results,
            )
            step_duration = (time.time() - step_start) * 1000

            step_entry = {{
                "step_id": str(uuid.uuid4()),
                "agent": agent_type,
                "action": step_info.get("name", "unknown"),
                "input": step_info.get("description", ""),
                "output": step_result[:500] if step_result else "",
                "duration_ms": round(step_duration, 2),
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }}
            steps.append(step_entry)
            results[step_info.get("name", f"step_{len(steps)}")] = step_result

        # Step 4: Synthesize Results
        if human_in_the_loop:
            output = await self._request_approval(task, steps, results)
            status = "pending_approval"
        else:
            output = await self._synthesize(task, steps, results)
            status = "completed"

        total_duration = (time.time() - start_time) * 1000

        return {{
            "status": status,
            "output": output,
            "steps": steps,
            "trace": trace,
            "metrics": {{
                "total_duration_ms": round(total_duration, 2),
                "steps_executed": len(steps),
                "total_tokens": sum(s.get("duration_ms", 0) for s in steps),
            }},
        }}

    async def _decompose_task(self, task: str, context: dict) -> dict:
        """Decompose complex task into subtasks using LLM."""
        prompt = f"""Decompose this task into a step-by-step execution plan:
Task: {task}
Context: {json.dumps(context, default=str)[:1000]}

Return a JSON object with:
- "steps": array of {{"name", "description", "agent", "dependencies"}}
- "estimated_complexity": "low"/"medium"/"high"

Available agents: research (search, extract), analysis (analyze, report),
                 code (implement, review), orchestrator (plan, coordinate)"""

        response = await self.llm.generate(
            system_prompt="You are a task planning expert. Output valid JSON only.",
            user_message=prompt,
        )

        try:
            plan = json.loads(response)
        except json.JSONDecodeError:
            plan = {{"steps": [{{"name": "execute", "description": task,
                                "agent": "research", "dependencies": []}}],
                     "estimated_complexity": "medium"}}
        return plan

    def _select_agents(self, plan: dict) -> dict:
        """Select appropriate agents for each subtask."""
        selected = {{}}
        for step in plan.get("steps", []):
            agent_type = step.get("agent", "research")
            if agent_type in self.agent_registry:
                selected[agent_type] = self.agent_registry[agent_type]
        if "orchestrator" not in selected:
            selected["orchestrator"] = self.agent_registry["orchestrator"]
        return selected

    async def _execute_step(self, agent_type: str, step_info: dict,
                            context: dict, previous_results: dict) -> str:
        """Execute a single agent step."""
        system_prompt = f"""You are {{self.agent_registry.get(agent_type, {{}}).get("name", "Agent")}}.
Execute the following task step with precision and clarity."""

        step_context = f"""Task: {step_info.get("description", "")}
Previous Results: {json.dumps(previous_results, default=str)[:2000]}
Context: {json.dumps(context, default=str)[:1000]}"""

        return await self.llm.generate(
            system_prompt=system_prompt,
            user_message=step_context,
        )

    async def _synthesize(self, task: str, steps: list, results: dict) -> str:
        """Synthesize all step results into final output."""
        prompt = f"""Synthesize the following execution results into a comprehensive final output.

Original Task: {task}

Steps Executed:
{json.dumps(steps, indent=2)[:3000]}

Results:
{json.dumps(results, default=str)[:3000]}"""

        return await self.llm.generate(
            system_prompt="You are a synthesis expert. Create a clear, structured final report.",
            user_message=prompt,
        )

    async def _request_approval(self, task: str, steps: list, results: dict) -> str:
        """Prepare output for human approval."""
        return f"""## Human Approval Required

Task: {task}

The following steps were executed and results are ready for review.
Steps completed: {len(steps)}

Please review and approve to proceed with final synthesis."""
'''


def generate_llm_factory() -> str:
    return '''"""
Multi-Provider LLM Factory — Abstraction layer for OpenAI, Anthropic, local models.
"""
from typing import Optional, AsyncGenerator
import asyncio
import json


class LLMFactory:
    """Factory for multi-provider LLM access with fallback chains."""

    def __init__(self, settings):
        self.settings = settings
        self.clients = {{}}
        self._init_clients()

    def _init_clients(self):
        """Initialize API clients based on settings."""
        if self.settings.openai_api_key:
            from openai import AsyncOpenAI
            self.clients["openai"] = AsyncOpenAI(
                api_key=self.settings.openai_api_key
            )
        if self.settings.anthropic_api_key:
            from anthropic import AsyncAnthropic
            self.clients["anthropic"] = AsyncAnthropic(
                api_key=self.settings.anthropic_api_key
            )

    async def generate(self, system_prompt: str, user_message: str,
                       stream: bool = False, model: Optional[str] = None) -> str:
        """Generate response with automatic fallback between providers."""
        providers = ["openai", "anthropic"]

        for provider in providers:
            if provider not in self.clients:
                continue
            try:
                return await self._call_provider(
                    provider, system_prompt, user_message, stream,
                )
            except Exception as e:
                print(f"Provider {provider} failed: {{e}}")
                continue

        raise Exception("All LLM providers failed")

    async def generate_stream(self, system_prompt: str, user_message: str):
        """Stream response tokens."""
        async for chunk in self._stream_openai(system_prompt, user_message):
            yield chunk

    async def _call_provider(self, provider: str, system_prompt: str,
                             user_message: str, stream: bool) -> str:
        """Call specific provider."""
        if provider == "openai":
            return await self._call_openai(system_prompt, user_message)
        elif provider == "anthropic":
            return await self._call_anthropic(system_prompt, user_message)
        return ""

    async def _call_openai(self, system_prompt: str, user_message: str) -> str:
        client = self.clients.get("openai")
        if not client:
            raise Exception("OpenAI client not initialized")

        response = await client.chat.completions.create(
            model=self.settings.openai_model or "gpt-4o",
            messages=[
                {{"role": "system", "content": system_prompt}},
                {{"role": "user", "content": user_message}},
            ],
            temperature=0.7,
            max_tokens=4096,
        )
        return response.choices[0].message.content or ""

    async def _call_anthropic(self, system_prompt: str, user_message: str) -> str:
        client = self.clients.get("anthropic")
        if not client:
            raise Exception("Anthropic client not initialized")

        response = await client.messages.create(
            model=self.settings.anthropic_model or "claude-sonnet-4-20250514",
            system=system_prompt,
            messages=[{{"role": "user", "content": user_message}}],
            max_tokens=4096,
            temperature=0.7,
        )
        return response.content[0].text if response.content else ""

    async def _stream_openai(self, system_prompt: str, user_message: str):
        client = self.clients.get("openai")
        if not client:
            return

        stream = await client.chat.completions.create(
            model=self.settings.openai_model or "gpt-4o",
            messages=[
                {{"role": "system", "content": system_prompt}},
                {{"role": "user", "content": user_message}},
            ],
            stream=True,
            temperature=0.7,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def create_embedding(self, text: str) -> list[float]:
        """Create text embedding."""
        client = self.clients.get("openai")
        if not client:
            return [0.0] * 1536

        response = await client.embeddings.create(
            model=self.settings.embedding_model or "text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding

    async def rewrite_query(self, query: str) -> str:
        """Rewrite user query for better retrieval."""
        prompt = f"""Rewrite this search query to improve retrieval accuracy.
Keep the core intent but make it more specific and search-optimized.

Original query: {query}

Return only the rewritten query, nothing else."""

        return await self.generate(
            system_prompt="You are a search query optimization expert.",
            user_message=prompt,
        )

    async def rerank(self, query: str, texts: list[str]) -> list[float]:
        """Simple relevance scoring for reranking."""
        prompt = f"""Rate the relevance of each document to the query.
Return a JSON array of scores (0.0 to 1.0).

Query: {query}
Documents:
{json.dumps(texts, indent=2)[:2000]}

Return: [score1, score2, ...]"""

        response = await self.generate(
            system_prompt="Output only valid JSON arrays.",
            user_message=prompt,
        )

        try:
            scores = json.loads(response)
            return [float(s) for s in scores[:len(texts)]]
        except (json.JSONDecodeError, ValueError):
            return [0.5] * len(texts)
'''


def generate_guardrails() -> str:
    return '''"""
Guardrails Engine — Input/output validation, PII detection, content safety.
"""
import re
import json
from typing import Tuple


class GuardrailsEngine:
    """Multi-layer guardrails for LLM safety and compliance."""

    def __init__(self):
        self.injection_patterns = [
            re.compile(r"ignore (previous|all) instructions", re.IGNORECASE),
            re.compile(r"you are (?:now |)(?:DAN|jailbroken|free)", re.IGNORECASE),
            re.compile(r"bypass (?:the |)(?:rules|restrictions|guidelines)", re.IGNORECASE),
            re.compile(r"system prompt|system message|developer prompt", re.IGNORECASE),
        ]
        self.pii_patterns = {{
            "email": re.compile(r"\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b"),
            "phone": re.compile(r"\\b\\d{{3}}[-.]?\\d{{3}}[-.]?\\d{{4}}\\b"),
            "ssn": re.compile(r"\\b\\d{{3}}-\\d{{2}}-\\d{{4}}\\b"),
            "credit_card": re.compile(r"\\b\\d{{4}}[- ]?\\d{{4}}[- ]?\\d{{4}}[- ]?\\d{{4}}\\b"),
        }}
        self.harmful_categories = [
            "violence", "hate speech", "self-harm", "illegal activity",
            "weapons manufacturing", "malware generation",
        ]

    def check_input(self, text: str) -> Tuple[bool, str]:
        """Check input text for safety concerns."""
        if not text or len(text.strip()) == 0:
            return False, "Empty input"

        # Check prompt injection
        for pattern in self.injection_patterns:
            if pattern.search(text):
                return False, "Prompt injection attempt detected"

        # Redact PII but allow through
        cleaned = text
        for pii_type, pattern in self.pii_patterns.items():
            cleaned = pattern.sub(f"[REDACTED_{pii_type.upper()}]", cleaned)

        return True, cleaned

    def check_output(self, text: str) -> str:
        """Check and sanitize output text."""
        if not text:
            return ""

        # Re-check PII in output
        for pii_type, pattern in self.pii_patterns.items():
            text = pattern.sub(f"[REDACTED_{pii_type.upper()}]", text)

        # Check for harmful content indicators
        text_lower = text.lower()
        for category in self.harmful_categories:
            if category in text_lower:
                return "I cannot provide this information. It may contain harmful content."

        return text

    def check_relevance(self, query: str, response: str, context: list[str]) -> dict:
        """Check if response is grounded in provided context."""
        result = {{
            "is_grounded": True,
            "unsupported_claims": [],
            "confidence": 1.0,
        }}

        # Simple grounding check
        sentences = re.split(r'(?<=[.!?])\\s+', response)
        for sentence in sentences:
            if len(sentence) < 20:
                continue
            found = False
            for ctx in context:
                shared = set(sentence.lower().split()) & set(ctx.lower().split())
                if len(shared) > len(sentence.split()) * 0.3:
                    found = True
                    break
            if not found:
                result["unsupported_claims"].append(sentence[:100])
                result["is_grounded"] = False

        if result["unsupported_claims"]:
            result["confidence"] = 1.0 - (len(result["unsupported_claims"]) * 0.2)
        return result
'''


def generate_evaluation() -> str:
    return '''"""
Evaluation Tracker — LLM output quality assessment, metrics, and tracing.
"""
import json
import time
from collections import defaultdict
from datetime import datetime, timedelta


class EvaluationTracker:
    """Track and evaluate LLM response quality and system performance."""

    def __init__(self):
        self.runs: dict = {{}}
        self.feedback: list[dict] = []
        self.metrics: dict = defaultdict(list)

    def track_run(self, task_id: str, result: dict):
        """Track an agent execution run."""
        self.runs[task_id] = {{
            "timestamp": datetime.now().isoformat(),
            "status": result.get("status", "unknown"),
            "steps": result.get("steps", []),
            "metrics": result.get("metrics", {{}}),
            "output_length": len(result.get("output", "")),
        }}

        metrics = result.get("metrics", {{}})
        self.metrics["duration"].append(metrics.get("total_duration_ms", 0))
        self.metrics["steps"].append(metrics.get("steps_executed", 0))

    def record_feedback(self, query_id: str, rating: int, comments: str = None):
        """Record user feedback on response quality."""
        self.feedback.append({{
            "query_id": query_id,
            "rating": rating,
            "comments": comments,
            "timestamp": datetime.now().isoformat(),
        }})

    def get_summary(self) -> dict:
        """Get system performance summary."""
        durations = self.metrics.get("duration", [])
        steps = self.metrics.get("steps", [])
        ratings = [f["rating"] for f in self.feedback if f.get("rating")]

        return {{
            "total_runs": len(self.runs),
            "average_duration_ms": round(
                sum(durations) / len(durations), 2
            ) if durations else 0,
            "average_steps": round(
                sum(steps) / len(steps), 1
            ) if steps else 0,
            "total_feedback": len(self.feedback),
            "average_rating": round(
                sum(ratings) / len(ratings), 2
            ) if ratings else 0,
            "success_rate": round(
                sum(1 for r in self.runs.values()
                    if r["status"] == "completed") / len(self.runs) * 100, 1
            ) if self.runs else 0,
            "recent_runs": sorted(
                self.runs.keys(), reverse=True
            )[:10],
        }}
'''


def generate_mcp_server() -> str:
    return '''"""
MCP Server — Model Context Protocol implementation for standardized agent-tool communication.
"""
import json
import asyncio
from typing import Any, Callable
from pydantic import BaseModel


class MCPTool(BaseModel):
    """MCP tool definition."""
    name: str
    description: str
    input_schema: dict
    handler: Callable = None


class MCPServer:
    """Model Context Protocol server for agent tool integration."""

    def __init__(self, server_name: str = "enterprise-agent-gateway"):
        self.server_name = server_name
        self.tools: dict[str, MCPTool] = {{}}
        self.sessions: dict[str, dict] = {{}}
        self.context_store: dict[str, list[dict]] = {{}}

    def register_tool(self, tool: MCPTool):
        """Register a tool with the MCP server."""
        self.tools[tool.name] = tool

    def get_tools_list(self) -> list[dict]:
        """Return list of available tools."""
        return [
            {{
                "name": t.name,
                "description": t.description,
                "input_schema": t.input_schema,
            }}
            for t in self.tools.values()
        ]

    async def call_tool(self, tool_name: str,
                        arguments: dict, session_id: str = None) -> dict:
        """Call a tool by name with arguments."""
        if tool_name not in self.tools:
            return {{"error": f"Tool '{{tool_name}}' not found"}}

        tool = self.tools[tool_name]
        try:
            if tool.handler:
                result = await tool.handler(arguments, self, session_id)
                return {{"status": "success", "result": result}}
            return {{"status": "error", "message": "Tool handler not implemented"}}
        except Exception as e:
            return {{"status": "error", "message": str(e)}}

    def share_context(self, session_id: str, key: str, value: Any):
        """Share context across agents in a session."""
        if session_id not in self.context_store:
            self.context_store[session_id] = []
        self.context_store[session_id].append({{
            "key": key, "value": value,
            "timestamp": asyncio.get_event_loop().time(),
        }})

    def get_context(self, session_id: str,
                    key: str = None, limit: int = 10) -> list[dict]:
        """Retrieve shared context for a session."""
        contexts = self.context_store.get(session_id, [])
        if key:
            contexts = [c for c in contexts if c.get("key") == key]
        return contexts[-limit:]

    async def call_mcp_tool(self, tool_name: str, arguments: dict,
                            session_id: str = None) -> dict:
        """MCP-compliant tool call interface."""
        context = self.get_context(session_id)
        enriched_args = {{
            **arguments,
            "_shared_context": context,
        }}
        return await self.call_tool(tool_name, enriched_args, session_id)


# Global MCP server instance
mcp_server = MCPServer()
'''


def generate_mcp_tools() -> str:
    return '''"""
MCP Tool Definitions — Enterprise system integration tools.
"""
from app.mcp.server import MCPServer, MCPTool


def register_enterprise_tools(server: MCPServer):
    """Register enterprise integration tools with MCP server."""

    # Knowledge Base Search Tool
    server.register_tool(MCPTool(
        name="search_knowledge_base",
        description="Search the enterprise knowledge base for relevant information",
        input_schema={{
            "type": "object",
            "properties": {{
                "query": {{"type": "string", "description": "Search query"}},
                "top_k": {{"type": "integer", "description": "Number of results", "default": 5}},
            }},
            "required": ["query"],
        }},
        handler=search_knowledge_base_handler,
    ))

    # Document Retrieval Tool
    server.register_tool(MCPTool(
        name="retrieve_document",
        description="Retrieve a specific document by ID or URL",
        input_schema={{
            "type": "object",
            "properties": {{
                "document_id": {{"type": "string", "description": "Document identifier"}},
            }},
            "required": ["document_id"],
        }},
        handler=retrieve_document_handler,
    ))

    # Data Analysis Tool
    server.register_tool(MCPTool(
        name="analyze_data",
        description="Run analysis on structured data",
        input_schema={{
            "type": "object",
            "properties": {{
                "query": {{"type": "string", "description": "Analysis query or SQL"}},
                "data_source": {{"type": "string", "description": "Data source name"}},
            }},
            "required": ["query", "data_source"],
        }},
        handler=analyze_data_handler,
    ))

    # API Integration Tool
    server.register_tool(MCPTool(
        name="call_external_api",
        description="Call an external enterprise API",
        input_schema={{
            "type": "object",
            "properties": {{
                "endpoint": {{"type": "string", "description": "API endpoint URL"}},
                "method": {{"type": "string", "enum": ["GET", "POST", "PUT", "DELETE"]}},
                "body": {{"type": "object", "description": "Request body"}},
            }},
            "required": ["endpoint", "method"],
        }},
        handler=call_api_handler,
    ))

    # Workflow Trigger Tool
    server.register_tool(MCPTool(
        name="trigger_workflow",
        description="Trigger an automated enterprise workflow",
        input_schema={{
            "type": "object",
            "properties": {{
                "workflow_id": {{"type": "string", "description": "Workflow identifier"}},
                "parameters": {{"type": "object", "description": "Workflow parameters"}},
            }},
            "required": ["workflow_id"],
        }},
        handler=trigger_workflow_handler,
    ))


async def search_knowledge_base_handler(arguments: dict,
                                         server: MCPServer,
                                         session_id: str = None) -> dict:
    """Handle knowledge base search."""
    query = arguments.get("query", "")
    top_k = arguments.get("top_k", 5)
    # Implement actual search logic
    return {{
        "results": [],
        "total": 0,
        "query": query,
    }}


async def retrieve_document_handler(arguments: dict,
                                     server: MCPServer,
                                     session_id: str = None) -> dict:
    """Handle document retrieval."""
    doc_id = arguments.get("document_id", "")
    # Implement actual document retrieval
    return {{"document_id": doc_id, "content": "", "metadata": {{}}}}


async def analyze_data_handler(arguments: dict,
                                server: MCPServer,
                                session_id: str = None) -> dict:
    """Handle data analysis."""
    query = arguments.get("query", "")
    source = arguments.get("data_source", "")
    # Implement actual data analysis
    return {{"results": [], "query": query, "source": source}}


async def call_api_handler(arguments: dict,
                            server: MCPServer,
                            session_id: str = None) -> dict:
    """Handle external API call."""
    import httpx
    url = arguments.get("endpoint", "")
    method = arguments.get("method", "GET")
    body = arguments.get("body", {{}})

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.request(method, url, json=body)

    return {{
        "status_code": response.status_code,
        "body": response.text[:10000],
    }}


async def trigger_workflow_handler(arguments: dict,
                                    server: MCPServer,
                                    session_id: str = None) -> dict:
    """Handle workflow trigger."""
    workflow_id = arguments.get("workflow_id", "")
    params = arguments.get("parameters", {{}})
    # Implement actual workflow trigger
    return {{
        "workflow_id": workflow_id,
        "status": "triggered",
        "execution_id": "",
    }}
'''


def generate_package_json(fe_tech: str) -> str:
    return '''{
  "name": "ai-agent-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.395.0",
    "react-markdown": "^9.0.0",
    "@tailwindcss/typography": "^0.5.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
'''


def generate_frontend_main(fe_tech: str) -> str:
    return '''"use client";

import {{ useState, useRef, useEffect }} from "react";
import AgentChat from "@/components/AgentChat";
import Dashboard from "@/components/Dashboard";

type View = "chat" | "dashboard" | "agents";

export default function Home() {{
  const [activeView, setActiveView] = useState<View>("chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                AI Agent Platform
              </h1>
            </div>

            <nav className="flex items-center gap-1">
              {(["chat", "dashboard", "agents"] as View[]).map((view) => (
                <button
                  key={view}
                  onClick={{">"}} setActiveView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === view
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "chat" && <AgentChat />}
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "agents" && <AgentMonitor />}
      </main>
    </div>
  );
}

function AgentMonitor() {{
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Agent Monitor</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Agents</h3>
          <div className="space-y-3">
            {["Research Agent", "Analysis Agent", "Code Agent", "Orchestrator"].map((agent) => (
              <div key={agent} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-slate-200">{{agent}}</span>
                </div>
                <span className="text-xs text-slate-400">Idle</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Tasks</h3>
          <p className="text-slate-400 text-sm">No recent tasks. Start a conversation to see agent activity.</p>
        </div>
      </div>
    </div>
  );
}}
'''


def generate_agent_chat() -> str:
    return '''"use client";

import {{ useState, useRef, useEffect }} from "react";
import {{ Send, Bot, User, Loader2, AlertCircle }} from "lucide-react";

interface Message {{
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: Array<{{ title: string; url: string; score: number }}>;
  timestamp: Date;
}}

export default function AgentChat() {{
  const [messages, setMessages] = useState<Message[]>([
    {{
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant powered by multi-agent orchestration. How can I help you today?",
      timestamp: new Date(),
    }},
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {{
    messagesEndRef.current?.scrollIntoView({{ behavior: "smooth" }});
  }}, [messages, streamingContent]);

  const sendMessage = async () => {{
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {{
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }};

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {{
      const response = await fetch("/api/chat", {{
        method: "POST",
        headers: {{ "Content-Type": "application/json" }},
        body: JSON.stringify({{
          message: userMessage.content,
          stream: true,
        }}),
      }});

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {{
        const {{ done, value }} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        setStreamingContent(fullContent);
      }}

      setMessages((prev) => [
        ...prev,
        {{
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fullContent,
          timestamp: new Date(),
        }},
      ]);
      setStreamingContent("");
    }} catch (error) {{
      setMessages((prev) => [
        ...prev,
        {{
          id: (Date.now() + 1).toString(),
          role: "system",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        }},
      ]);
    }} finally {{
      setIsLoading(false);
    }}
  }};

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${{msg.role === "user" ? "justify-end" : "justify-start"}}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === "user"
                  ? "bg-blue-500/20 border border-blue-500/30"
                  : msg.role === "system"
                  ? "bg-red-500/10 border border-red-500/20"
                  : "bg-slate-700/50 border border-slate-600/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-blue-400" />
                ) : msg.role === "user" ? (
                  <User className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-slate-400">
                  {{msg.timestamp.toLocaleTimeString()}}
                </span>
              </div>
              <p className="text-slate-200 whitespace-pre-wrap">{{msg.content}}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-600/30">
                  <p className="text-xs text-slate-400 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, i) => (
                      <span
                        key={{i}}
                        className="text-xs bg-slate-600/30 text-slate-300 px-2 py-1 rounded"
                      >
                        {{source.title}}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {{streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl p-4 bg-slate-700/50 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Streaming...</span>
              </div>
              <p className="text-slate-200">{{streamingContent}}</p>
            </div>
          </div>
        )}}

        <div ref={{messagesEndRef}} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
        <div className="flex items-center gap-2">
          <input
            ref={{inputRef}}
            type="text"
            value={{input}}
            onChange={{(e) => setInput(e.target.value)}}
            onKeyDown={{(e) => e.key === "Enter" && sendMessage()}}
            placeholder="Ask anything about your enterprise data..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 px-4 py-3 outline-none"
            disabled={{isLoading}}
          />
          <button
            onClick={{sendMessage}}
            disabled={{!input.trim() || isLoading}}
            className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}}
          </button>
        </div>
      </div>
    </div>
  );
}}
'''


def generate_dashboard() -> str:
    return '''"use client";

import {{ useState, useEffect }} from "react";
import {{ BarChart3, Activity, Zap, AlertTriangle, CheckCircle, Clock }} from "lucide-react";

interface Metrics {{
  total_runs: number;
  average_duration_ms: number;
  average_steps: number;
  success_rate: number;
  average_rating: number;
}}

export default function Dashboard() {{
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    fetchMetrics();
  }}, []);

  const fetchMetrics = async () => {{
    try {{
      const response = await fetch("/api/metrics");
      const data = await response.json();
      setMetrics(data);
    }} catch (error) {{
      console.error("Failed to fetch metrics:", error);
    }} finally {{
      setLoading(false);
    }}
  }};

  const statCards = [
    {{
      label: "Total Runs",
      value: metrics?.total_runs ?? 0,
      icon: Activity,
      color: "blue",
    }},
    {{
      label: "Avg Duration",
      value: metrics ? `${{(metrics.average_duration_ms / 1000).toFixed(1)}}s` : "0s",
      icon: Clock,
      color: "purple",
    }},
    {{
      label: "Success Rate",
      value: metrics ? `${{metrics.success_rate}}%` : "0%",
      icon: CheckCircle,
      color: "green",
    }},
    {{
      label: "Avg Rating",
      value: metrics?.average_rating?.toFixed(1) ?? "0.0",
      icon: Zap,
      color: "yellow",
    }},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Dashboard</h2>
        <button
          onClick={{fetchMetrics}}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {{statCards.map((stat) => (
          <div
            key={{stat.label}}
            className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">{{stat.label}}</span>
              <stat.icon className={`w-5 h-5 text-${{stat.color}}-400`} />
            </div>
            <p className="text-3xl font-bold text-white">{{stat.value}}</p>
          </div>
        ))}}
      </div>

      {/* System Status */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="space-y-3">
          {{[
            {{ name: "API Gateway", status: "operational", latency: "12ms" }},
            {{ name: "LLM Provider", status: "operational", latency: "845ms" }},
            {{ name: "Vector Database", status: "operational", latency: "23ms" }},
            {{ name: "Agent Orchestrator", status: "operational", latency: "156ms" }},
            {{ name: "Guardrails Engine", status: "operational", latency: "3ms" }},
          ].map((service) => (
            <div
              key={{service.name}}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-slate-200">{{service.name}}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">{{service.status}}</span>
                <span className="text-xs text-slate-500">{{service.latency}}</span>
              </div>
            </div>
          ))}}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-400 mt-4">Loading metrics...</p>
        </div>
      )}
    </div>
  );
}}
'''


def generate_docker_compose(categorized: dict) -> str:
    return '''version: "3.9"

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=development
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/agents
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api
    volumes:
      - ./frontend:/app

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: agents
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  vector-db:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
'''


def generate_kubernetes() -> str:
    return '''apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-agent-platform
  labels:
    app: ai-agent-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-agent-platform
  template:
    metadata:
      labels:
        app: ai-agent-platform
    spec:
      containers:
      - name: api
        image: ai-agent-platform:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: llm-secrets
              key: openai-api-key
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ai-agent-platform-service
spec:
  selector:
    app: ai-agent-platform
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-agent-platform-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-agent-platform
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
'''


def generate_env_example(categorized: dict) -> str:
    return '''# Application
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# LLM Providers
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514
EMBEDDING_MODEL=text-embedding-3-small

# Vector Database
VECTOR_DB_TYPE=pinecone
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX=knowledge-base

# Agent Configuration
MAX_AGENT_STEPS=25
AGENT_TIMEOUT_SECONDS=120
HUMAN_APPROVAL_TIMEOUT=300
ENABLE_MCP=true

# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/agents
REDIS_URL=redis://localhost:6379/0

# Monitoring
OTEL_ENDPOINT=http://localhost:4318
'''


def generate_architecture_doc(categorized: dict, domain: str) -> str:
    return f'''# System Architecture

## Overview
Enterprise AI Agent Platform for the {domain.upper()} domain, built with a microservices architecture
featuring multi-agent orchestration, RAG pipelines, and MCP-based tool integration.

## Architecture Layers

### 1. Frontend Layer
- Next.js/React with real-time streaming UI
- Agent chat interface with WebSocket support
- Dashboard for metrics and monitoring
- TypeScript for type safety

### 2. API Gateway Layer
- FastAPI backend with async support
- Rate limiting and authentication
- Request/response validation
- OpenAPI documentation

### 3. Agent Orchestration Layer
- Multi-agent system with LangGraph/CrewAI patterns
- Orchestrator-Worker architecture
- ReAct reasoning loops
- Human-in-the-loop approval gates

### 4. RAG Pipeline Layer
- Hybrid search (vector + BM25)
- RRF fusion for result merging
- Cross-encoder re-ranking
- Context assembly and prompt construction

### 5. MCP Integration Layer
- Model Context Protocol server
- Standardized tool definitions
- Enterprise system integration
- Context sharing across agents

### 6. Data Layer
- Vector database for embeddings
- PostgreSQL for agent state
- Redis for caching
- Message queue for async processing

### 7. Infrastructure Layer
- Kubernetes orchestration
- Docker containerization
- Prometheus/Grafana monitoring
- OpenTelemetry tracing

## Design Patterns
- Orchestrator-Worker for multi-agent coordination
- CQRS for separating read/write models
- Event Sourcing for audit trails
- Circuit Breaker for LLM resilience
- Semantic Caching for cost optimization
- Strangler Fig for legacy migration

## Security
- RBAC for agent permissions
- PII detection and redaction
- Prompt injection prevention
- Output grounding verification
- Audit logging for compliance
'''


def generate_api_doc() -> str:
    return '''# API Documentation

## Chat Endpoints

### POST /api/chat
Send a message and get AI response with RAG-enhanced context.

### POST /api/chat/stream
Streaming chat response via SSE (Server-Sent Events).

## Agent Endpoints

### POST /api/agent/execute
Execute a multi-agent workflow with task decomposition and orchestration.

## Document Endpoints

### POST /api/documents/query
Query the knowledge base with hybrid search and reranking.

## Feedback Endpoints

### POST /api/feedback
Submit feedback for response quality tracking.

## Monitoring

### GET /api/metrics
Get system performance metrics including duration, success rate, and ratings.

### GET /health
Health check endpoint.
'''


def generate_readme(job_title: str, company: str, domain: str) -> str:
    return f'''# {job_title}

**Company:** {company}  
**Domain:** {domain}  
**Version:** 1.0.0  

## Overview
Enterprise AI Agent Platform built for the {domain.upper()} industry, featuring multi-agent
orchestration, RAG-enhanced knowledge retrieval, MCP-based tool integration, and
comprehensive guardrails and evaluation.

## Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Python 3.12, FastAPI, async/await
- **AI/ML:** LangChain, LangGraph, CrewAI, AutoGen, LlamaIndex
- **LLMs:** OpenAI GPT-4o, Anthropic Claude, open-source models
- **Vector DB:** Pinecone/ChromaDB/Qdrant
- **Infrastructure:** Docker, Kubernetes, Prometheus, Grafana
- **Protocols:** MCP (Model Context Protocol), REST, WebSocket, gRPC

## Architecture
```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                 │
│         Chat UI  │  Dashboard  │  Agent Monitor      │
└────────────────────────┬────────────────────────────┘
                         │ WebSocket/REST
┌────────────────────────▼────────────────────────────┐
│              API Gateway (FastAPI)                   │
│    Auth  │  Rate Limit  │  Validation  │  Routing    │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│           Agent Orchestration Layer                  │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │
│  │Research │ │ Analysis │ │  Code  │ │Orchestrator│  │
│  └─────────┘ └──────────┘ └────────┘ └───────────┘  │
│              MCP Server (Tool Integration)           │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│              RAG Pipeline Layer                      │
│  Hybrid Search → Reranking → Context Assembly → LLM │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│           Data & Infrastructure Layer                │
│  Vector DB  │  PostgreSQL  │  Redis  │  Kafka        │
│  K8s  │  Docker  │  Prometheus  │  Grafana           │
└─────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- Docker and Docker Compose
- API keys for LLM providers

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-agent-platform
```

2. **Backend setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\\\Scripts\\\\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

3. **Frontend setup**
```bash
cd frontend
npm install
cp .env.example .env.local
```

4. **Start with Docker**
```bash
docker-compose up -d
```

5. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure
```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── config.py            # Configuration management
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   ├── services/
│   │   │   ├── rag_service.py   # RAG pipeline
│   │   │   ├── agent_orchestrator.py  # Multi-agent orchestration
│   │   │   ├── llm_factory.py   # LLM abstraction layer
│   │   │   ├── guardrails.py    # Safety guardrails
│   │   │   └── evaluation.py    # Performance evaluation
│   │   ├── mcp/
│   │   │   ├── server.py        # MCP protocol server
│   │   │   └── tools.py         # MCP tool definitions
│   │   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx         # Main application page
│   │   ├── components/
│   │   │   ├── AgentChat.tsx    # Chat interface
│   │   │   └── Dashboard.tsx    # Monitoring dashboard
│   │   └── package.json
├── kubernetes/
│   └── deployment.yaml          # K8s deployment manifests
├── docker-compose.yml           # Local development setup
└── README.md
```

## License
Proprietary - {company}
'''


# =========================================================================
# Diagram Generators
# =========================================================================

def _build_architecture_diagram(components: list[ArchitectureComponent]) -> str:
    """Generate Mermaid.js architecture diagram."""
    lines = ["graph TB", ""]

    # Group by layer
    layers = {layer: [] for layer in ["frontend", "backend", "agent", "ai", "data", "infra"]}
    for c in components:
        layers[c.layer].append(c)

    layer_colors = {
        "frontend": "#3b82f6",
        "backend": "#10b981",
        "agent": "#8b5cf6",
        "ai": "#f59e0b",
        "data": "#06b6d4",
        "infra": "#64748b",
    }

    for layer, layer_comps in layers.items():
        if not layer_comps:
            continue
        color = layer_colors.get(layer, "#64748b")
        lines.append(f"  subgraph {layer.upper()} [{layer.upper()} LAYER]")
        lines.append(f"    style {layer.upper()} fill:#{color}22,stroke:{color},stroke-width:2px")

        for comp in layer_comps:
            safe_id = comp.name.replace(" ", "_").replace("-", "_").replace(",", "")
            lines.append(f"    {safe_id}[{comp.name}]")
            lines.append(f"    style {safe_id} fill:#{color}33,stroke:{color},stroke-width:1px")

        lines.append("  end")
        lines.append("")

    # Data flows
    for flow in [
        ("React_Frontend", "FastAPI_API_Gateway", "WebSocket/REST"),
        ("FastAPI_API_Gateway", "Agent_Orchestration", "gRPC"),
        ("Agent_Orchestration", "LLM_Orchestration", "HTTP"),
        ("LLM_Orchestration", "Vector_Database", "gRPC"),
        ("RAG_Pipeline", "LLM_Orchestration", "Internal"),
        ("MCP_Server", "Agent_Orchestration", "MCP Protocol"),
        ("Evaluation_Guardrails", "LLM_Orchestration", "Internal"),
    ]:
        safe_from = flow[0].replace(" ", "_").replace("-", "_").replace(",", "")
        safe_to = flow[1].replace(" ", "_").replace("-", "_").replace(",", "")
        lines.append(f"  {safe_from} -->|{flow[2]}| {safe_to}")

    return "\n".join(lines)


def _build_business_diagram(domain: str, use_cases: str) -> str:
    """Generate Mermaid.js business flow diagram."""
    domain_upper = domain.upper()
    return f"""graph LR
    subgraph Business [BUSINESS DOMAIN: {domain_upper}]
        direction TB
        U[Users / Customers] --> P[Enterprise Platform]
        P --> A[AI Agent System]
    end

    subgraph Value [VALUE CHAIN]
        direction TB
        I[Data Input] --> PR[Processing]
        PR --> AN[Analysis]
        AN --> AC[Action]
        AC --> FB[Feedback Loop]
    end

    subgraph Outcomes [BUSINESS OUTCOMES]
        O1[Increased Efficiency]
        O2[Cost Reduction]
        O3[Faster Decisions]
        O4[24/7 Automation]
        O5[Scalable Operations]
    end

    A --> I
    FB --> I
    AC --> O1
    AC --> O2
    AC --> O3
    AC --> O4
    AC --> O5

    style Business fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px
    style Value fill:#1a3a2a,stroke:#10b981,stroke-width:2px
    style Outcomes fill:#3a1a3a,stroke:#8b5cf6,stroke-width:2px"""


def _build_deployment_diagram(categorized: dict) -> str:
    """Generate Mermaid.js deployment diagram."""
    return """graph TB
    subgraph Production [PRODUCTION ENVIRONMENT]
        subgraph K8s [Kubernetes Cluster]
            direction TB
            API[API Service<br/>3 replicas]
            AGT[Agent Service<br/>5 replicas]
            RAG[RAG Service<br/>3 replicas]
            MCP[MCP Server<br/>2 replicas]
        end

        subgraph Data [Data Layer]
            PG[(PostgreSQL<br/>Primary + Replica)]
            RD[(Redis<br/>Cluster)]
            VD[(Vector DB<br/>Sharded)]
            MQ[Message Queue<br/>Kafka Cluster]
        end

        subgraph External [External Services]
            LLM[LLM Providers<br/>OpenAI / Anthropic]
            MON[Monitoring<br/>Prometheus + Grafana]
        end

        K8s --> Data
        K8s --> LLM
        K8s --> MON
    end

    subgraph CDN [CDN]
        FE[Frontend<br/>Next.js Static]
    end

    FE --> API
    CDN --> K8s

    style Production fill:#0f172a,stroke:#3b82f6,stroke-width:2px
    style K8s fill:#1e293b,stroke:#64748b,stroke-width:1px
    style Data fill:#0c4a6e,stroke:#06b6d4,stroke-width:1px"""


# =========================================================================
# Main API
# =========================================================================

def generate_for_job(job: dict) -> dict:
    """Generate a complete project for a single job."""
    techs = job.get("techs", [])
    desc = job.get("desc", "")
    use_cases = job.get("use_cases", "")
    if isinstance(use_cases, list):
        use_cases = " ".join(use_cases)
    
    project = generate_project(
        job_title=job.get("title", "AI Engineer"),
        company=job.get("company", "Company"),
        techs=techs,
        desc=desc,
        use_cases=use_cases,
    )
    
    return {
        "job_title": project.job_title,
        "company": project.company,
        "domain": project.domain,
        "description": project.description[:300],
        "architecture": [asdict(c) for c in project.architecture],
        "data_flows": [asdict(f) for f in project.data_flows],
        "design_patterns": project.design_patterns,
        "files": [{"path": f.path, "description": f.description} for f in project.files],
        "mermaid_arch": project.mermaid_arch,
        "mermaid_business": project.mermaid_business,
        "mermaid_deploy": project.mermaid_deploy,
        "file_count": len(project.files),
    }


def generate_full_project(job: dict) -> GeneratedProject:
    """Generate a complete project with full source code for a job."""
    techs = job.get("techs", [])
    desc = job.get("desc", "")
    use_cases = job.get("use_cases", "")
    if isinstance(use_cases, list):
        use_cases = " ".join(use_cases)

    return generate_project(
        job_title=job.get("title", "AI Engineer"),
        company=job.get("company", "Company"),
        techs=techs,
        desc=desc,
        use_cases=use_cases,
    )
