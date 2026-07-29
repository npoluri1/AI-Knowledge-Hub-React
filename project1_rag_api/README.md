# Project 1: Simple RAG API — Complete Build Guide
## Iterative Complexity: Layer 0 → Layer 7

---

## Architecture Overview

```
Layer 0: Hello World API (FastAPI)
Layer 1: LLM Integration (OpenAI/Ollama)
Layer 2: Embeddings + VectorDB (ChromaDB)
Layer 3: Basic RAG (retrieve + generate)
Layer 4: Advanced RAG (chunking strategies, hybrid search)
Layer 5: Multi-LLM Support (OpenAI, Claude, Gemini, local)
Layer 6: Agent with Tools (web search, calculations)
Layer 7: Production (Docker, monitoring, evals, security)
```

## Tech Stack

| Layer | Component | Tool | Free? |
|-------|-----------|------|-------|
| API | Web framework | FastAPI + Uvicorn | ✅ |
| LLM | Intelligence | Ollama (local) / OpenAI / Claude | ✅/Paid |
| Embeddings | Semantic understanding | sentence-transformers / OpenAI | ✅/Paid |
| VectorDB | Memory | ChromaDB (local) / Qdrant / pgvector | ✅ |
| Orchestration | Chains | LangChain + LangGraph | ✅ |
| Data extraction | Document loading | LlamaParse / Crawl4AI | ✅/Paid |
| Monitoring | Observability | LangSmith (free tier) | ✅ |
| Evaluation | Quality metrics | Ragas / DeepEval | ✅ |
| Deployment | Containers | Docker + docker-compose | ✅ |
| Security | Guardrails | NeMo Guardrails / custom | ✅ |

---

## Layer 0: Hello World API

**Goal:** FastAPI server running with /docs endpoint

### Files to create:
1. `app/main.py` — FastAPI app entry point
2. `app/core/config.py` — Settings management
3. `requirements.txt` — Dependencies
4. `README.md` — Project documentation

---

## Layer 1: LLM Integration

**Goal:** Chat endpoint that calls an LLM

### Files to add:
5. `app/services/llm_service.py` — Multi-LLM wrapper
6. `app/api/chat.py` — Chat endpoints

---

## Layer 2: Embeddings + VectorDB

**Goal:** Store and retrieve document embeddings

### Files to add:
7. `app/services/embedding_service.py` — Embedding generation
8. `app/services/vectorstore_service.py` — ChromaDB operations
9. `app/api/documents.py` — Document upload endpoints

---

## Layer 3: Basic RAG

**Goal:** Upload PDF → Ask question → Get answer from document

### Files to add:
10. `app/services/rag_service.py` — RAG pipeline
11. `app/services/document_loader.py` — PDF/text extraction
12. `app/services/text_splitter.py` — Chunking strategies

---

## Layer 4: Advanced RAG

**Goal:** Hybrid search, reranking, multiple retrieval strategies

### Files to add:
13. `app/services/hybrid_search.py` — Dense + sparse retrieval
14. `app/services/reranker.py` — Cross-encoder reranking
15. `app/services/query_transform.py` — HyDE, multi-query

---

## Layer 5: Multi-LLM Support

**Goal:** Switch between OpenAI, Claude, Gemini, Ollama

### Files to add:
16. `app/services/llm_factory.py` — LLM provider abstraction
17. `app/core/llm_config.py` — Provider configurations

---

## Layer 6: Agent with Tools

**Goal:** Agent that can search web, do math, call APIs

### Files to add:
18. `app/services/agent_service.py` — ReAct agent
19. `app/services/tools.py` — Tool definitions
20. `app/api/agent.py` — Agent endpoints

---

## Layer 7: Production

**Goal:** Docker, monitoring, evals, security, CI/CD

### Files to add:
21. `Dockerfile` — Container build
22. `docker-compose.yml` — Multi-service setup
23. `app/api/monitoring.py` — Prometheus metrics
24. `app/services/eval_service.py` — Ragas evaluation
25. `app/services/guardrails.py` — Input/output filtering
26. `tests/test_api.py` — API tests
27. `tests/test_rag.py` — RAG tests
28. `.github/workflows/ci.yml` — GitHub Actions CI
