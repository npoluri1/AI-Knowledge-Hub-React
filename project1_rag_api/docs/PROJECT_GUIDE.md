# Project 1: Simple RAG API — Complete Documentation
## Iterative Complexity Build Guide

---

## Overview

Project 1 is a production-ready RAG (Retrieval-Augmented Generation) API that demonstrates
the full AI tech stack. It's built iteratively across 8 complexity layers, from a simple
Hello World to a fully deployed, monitored, and evaluated system.

**Time to build:** 8-12 hours (Layer 0-3), 20-30 hours (all layers)
**Difficulty:** Beginner → Advanced
**Prerequisites:** Python 3.10+, basic API knowledge

---

## Layer-by-Layer Breakdown

### Layer 0: Hello World API (30 min)
**Goal:** FastAPI server running with /docs endpoint

**What you learn:**
- FastAPI basics (routes, middleware, error handling)
- Pydantic models for request/response validation
- async/await patterns
- Structured logging with structlog

**Files created:**
- `app/main.py` — FastAPI app with middleware
- `app/core/config.py` — Settings management
- `requirements.txt` — Dependencies
- `README.md` — Project documentation

**Test it:**
```bash
uvicorn app.main:app --reload
# Visit http://localhost:8000/docs
```

---

### Layer 1: LLM Integration (1 hour)
**Goal:** Chat endpoint that calls an LLM

**What you learn:**
- Multi-provider LLM abstraction (OpenAI, Anthropic, Google, Ollama)
- Streaming responses (SSE)
- Session management
- Error handling and retry logic

**Files added:**
- `app/services/llm_service.py` — Multi-LLM wrapper
- `app/api/chat.py` — Chat endpoints

**Key features:**
- Support for 4+ LLM providers
- Streaming and non-streaming modes
- Conversation history
- Model switching per request

---

### Layer 2: Embeddings + VectorDB (2 hours)
**Goal:** Store and retrieve document embeddings

**What you learn:**
- Embedding generation (sentence-transformers, OpenAI)
- Vector database operations (ChromaDB, Qdrant)
- Document indexing pipeline
- Similarity search

**Files added:**
- `app/services/embedding_service.py` — Embedding generation
- `app/services/vectorstore_service.py` — ChromaDB operations
- `app/api/documents.py` — Document upload endpoints

**Key features:**
- Multiple embedding providers
- Persistent storage
- Metadata filtering
- Batch operations

---

### Layer 3: Basic RAG (2 hours)
**Goal:** Upload PDF → Ask question → Get answer from document

**What you learn:**
- Document loading (PDF, TXT, DOCX, CSV)
- Text splitting strategies (recursive, fixed, sentence)
- RAG pipeline (retrieve → augment → generate)
- Source citation

**Files added:**
- `app/services/rag_service.py` — RAG pipeline
- `app/services/document_loader.py` — PDF/text extraction
- `app/services/text_splitter.py` — Chunking strategies

**Key features:**
- Multiple document formats
- Configurable chunking
- Score-based retrieval
- Source attribution

---

### Layer 4: Advanced RAG (3 hours)
**Goal:** Hybrid search, reranking, multiple retrieval strategies

**What you learn:**
- Hybrid search (dense + sparse)
- Reciprocal Rank Fusion
- Cross-encoder reranking
- Query transformation (HyDE, multi-query, step-back)

**Files added:**
- `app/services/hybrid_search.py` — Dense + sparse retrieval
- `app/services/reranker.py` — Cross-encoder reranking
- `app/services/query_transform.py` — HyDE, multi-query

**Key features:**
- BM25 + semantic search fusion
- LLM-based reranking fallback
- Query expansion
- Step-back prompting

---

### Layer 5: Multi-LLM Support (2 hours)
**Goal:** Switch between OpenAI, Claude, Gemini, Ollama

**What you learn:**
- Factory pattern for LLM providers
- Provider-specific optimizations
- Cost optimization (route to cheapest provider)
- Fallback chains

**Files added:**
- `app/services/llm_factory.py` — LLM provider abstraction
- `app/core/llm_config.py` — Provider configurations

**Supported providers:**
- OpenAI (GPT-4o, GPT-4o-mini)
- Anthropic (Claude Sonnet 4)
- Google (Gemini 2.0 Flash)
- Ollama (local models)
- Groq (fast inference)
- Together AI (100+ models)

---

### Layer 6: Agent with Tools (3 hours)
**Goal:** Agent that can search web, do math, call APIs

**What you learn:**
- ReAct agent pattern
- Tool use and function calling
- Multi-step reasoning
- Error recovery

**Files added:**
- `app/services/agent_service.py` — ReAct agent
- `app/services/tools.py` — Tool definitions
- `app/api/agent.py` — Agent endpoints

**Available tools:**
- `search` — Document search
- `calculate` — Math expressions
- `web_search` — Web search (placeholder)
- `summarize` — Text summarization

---

### Layer 7: Production (4 hours)
**Goal:** Docker, monitoring, evals, security, CI/CD

**What you learn:**
- Containerization with Docker
- Prometheus metrics
- RAG evaluation (Ragas, DeepEval)
- Security guardrails
- GitHub Actions CI/CD

**Files added:**
- `Dockerfile` — Container build
- `docker-compose.yml` — Multi-service setup
- `app/api/monitoring.py` — Prometheus metrics
- `app/services/eval_service.py` — Ragas evaluation
- `app/services/guardrails.py` — Input/output filtering
- `tests/test_api.py` — API tests
- `tests/test_rag.py` — RAG tests
- `.github/workflows/ci.yml` — GitHub Actions CI

---

## Tech Stack Summary

| Category | Technology | Purpose |
|----------|-----------|---------|
| API | FastAPI + Uvicorn | Web framework |
| LLM | OpenAI, Claude, Gemini, Ollama | Intelligence |
| Embeddings | sentence-transformers, OpenAI | Semantic understanding |
| VectorDB | ChromaDB, Qdrant | Memory |
| Orchestration | LangChain, LlamaIndex | Chains |
| Data | PyPDF, Crawl4AI, LlamaParse | Document loading |
| Monitoring | LangSmith, Prometheus | Observability |
| Evaluation | Ragas, DeepEval | Quality metrics |
| Deployment | Docker, docker-compose | Containers |
| Security | NeMo Guardrails | Safety |
| Testing | pytest, httpx | Quality assurance |

---

## Running the Project

### Quick Start
```bash
cd project1_rag_api
python quickstart.py
```

### Manual Start
```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Start server
uvicorn app.main:app --reload

# Run tests
pytest tests/ -v
```

### Docker Start
```bash
docker-compose up -d
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/metrics` | API metrics |
| POST | `/api/v1/chat` | Chat with RAG |
| POST | `/api/v1/chat/stream` | Stream chat response |
| GET | `/api/v1/chat/sessions/{id}` | Get session history |
| POST | `/api/v1/documents/upload` | Upload document |
| GET | `/api/v1/documents` | List documents |
| DELETE | `/api/v1/documents/{id}` | Delete document |
| POST | `/api/v1/documents/search` | Search documents |
| POST | `/api/v1/agent/run` | Run agent |
| GET | `/api/v1/agent/tools` | List agent tools |

---

## Next Steps

After completing Project 1, you can:

1. **Add more tools** to the agent (web search, API calls, database queries)
2. **Implement authentication** (API keys, OAuth)
3. **Add rate limiting** and usage tracking
4. **Deploy to cloud** (AWS, GCP, Azure)
5. **Build a frontend** (React, Next.js, Streamlit)
6. **Scale with Kubernetes** for production traffic

---

## Learning Outcomes

By completing this project, you will have learned:

- ✅ FastAPI development with async patterns
- ✅ Multi-provider LLM integration
- ✅ Embedding generation and vector databases
- ✅ RAG pipeline architecture
- ✅ Advanced retrieval techniques
- ✅ Agent development with tool use
- ✅ Production deployment with Docker
- ✅ Monitoring and evaluation
- ✅ Security best practices
- ✅ Testing strategies
