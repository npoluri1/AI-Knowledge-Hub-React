"""Project 1: Simple RAG API — Complete AI Tools & Agents Catalog Reference"""
# This file provides quick reference to tools used in Project 1
# Full catalog: edureka_ai_tools_catalog.md

# ============================================================
# LLM PROVIDERS USED IN PROJECT 1
# ============================================================
# 1. Ollama (Local) — FREE
#    - Default provider for development
#    - Models: llama3.2, mistral, phi3, codellama
#    - Install: https://ollama.ai
#
# 2. OpenAI — PAID
#    - GPT-4o, GPT-4o-mini, GPT-4-turbo
#    - Best for: Production quality, function calling
#
# 3. Anthropic (Claude) — PAID
#    - Claude Sonnet 4, Claude 3.5 Sonnet
#    - Best for: Long context, reasoning
#
# 4. Google (Gemini) — PAID
#    - Gemini 2.0 Flash, Gemini 1.5 Pro
#    - Best for: Multimodal, free tier available
#
# 5. Groq — FREE tier
#    - Fast inference for open models
#    - Llama 3.1 70B at 750 tokens/sec
#
# 6. Together AI — PAID
#    - Access to 100+ open models
#    - Fine-tuning support

# ============================================================
# EMBEDDING PROVIDERS
# ============================================================
# 1. sentence-transformers (Local) — FREE
#    - all-MiniLM-L6-v2 (default, 384 dim)
#    - all-mpnet-base-v2 (768 dim, better quality)
#
# 2. OpenAI Embeddings — PAID
#    - text-embedding-3-small (1536 dim)
#    - text-embedding-3-large (3072 dim)
#
# 3. Voyage AI — PAID
#    - voyage-2 (1024 dim)
#    - Best for: Code, multilingual
#
# 4. Cohere — PAID
#    - embed-english-v3.0 (1024 dim)
#    - Best for: Search, classification

# ============================================================
# VECTOR DATABASES
# ============================================================
# 1. ChromaDB (Local) — FREE
#    - Default in Project 1
#    - Good for: Prototyping, small datasets
#
# 2. Qdrant — FREE tier
#    - Good for: Production, filtering
#    - Rust-based, fast
#
# 3. Pinecone — FREE tier
#    - Good for: Managed solution, serverless
#
# 4. Weaviate — FREE tier
#    - Good for: Hybrid search, GraphQL
#
# 5. pgvector — FREE
#    - Good for: Already using PostgreSQL

# ============================================================
# ORCHESTRATION FRAMEWORKS
# ============================================================
# 1. LangChain — USED IN PROJECT 1
#    - Most popular, huge ecosystem
#    - Chains, agents, retrieval
#
# 2. LlamaIndex — USED IN PROJECT 1
#    - Best for: RAG, document indexing
#    - Advanced retrieval strategies
#
# 3. Haystack — ALTERNATIVE
#    - Good for: Production pipelines
#    - Deepset AI, enterprise focus

# ============================================================
# DATA EXTRACTION
# ============================================================
# 1. PyPDF — USED IN PROJECT 1
#    - Free PDF extraction
#
# 2. LlamaParse — FREE tier
#    - Best for: Complex PDFs, tables
#
# 3. Crawl4AI — FREE
#    - Best for: Web crawling, scraping
#
# 4. Firecrawl — FREE tier
#    - Best for: Structured web data
#
# 5. Unstructured — FREE
#    - Best for: Multiple formats

# ============================================================
# EVALUATION
# ============================================================
# 1. Ragas — USED IN PROJECT 1
#    - Faithfulness, relevancy, context precision
#    - LLM-as-judge metrics
#
# 2. DeepEval — USED IN PROJECT 1
#    - Answer relevancy, faithfulness
#    - Hallucination detection

# ============================================================
# MONITORING
# ============================================================
# 1. LangSmith — FREE tier
#    - Tracing, evaluation, datasets
#
# 2. Prometheus + Grafana — FREE
#    - Metrics, dashboards, alerts
#
# 3. OpenTelemetry — FREE
#    - Distributed tracing standard

# ============================================================
# SECURITY
# ============================================================
# 1. NeMo Guardrails — USED IN PROJECT 1
#    - NVIDIA, input/output filtering
#
# 2. Guardrails AI — ALTERNATIVE
#    - Validation, correction
#
# 3. Rebuff — ALTERNATIVE
#    - Prompt injection detection
