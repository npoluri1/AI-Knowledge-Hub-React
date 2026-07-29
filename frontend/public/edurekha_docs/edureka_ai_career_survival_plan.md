# AI Career Survival Plan — Complete Roadmap 2026–2031
## Target: Job safety next 10 years | Budget: Zero-cost (free tools)
## Background: 15+ yr Java/Spring enterprise dev | Singapore market

---

================================================================================
PHASE 0 — MINDSET & REALITY CHECK
================================================================================

| Factor | Reality | Your Action |
|--------|---------|-------------|
| AI job impact | Automates TASKS not ROLES | Become the person who BUILDS the AI |
| Your edge | 15+ yr enterprise delivery | Bridge old systems with new AI |
| Quantity trap | 500 shallow projects = waste | 5-8 DEEP production-grade projects |
| Cost concern | Free tools exist | Use Ollama + HF free tier + ChromaDB |
| Singapore market | High demand AI integration | Focus on banking/govt/healthcare AI |

### The Math of Career Safety
- 15 years of enterprise Java/Spring = you understand systems at scale
- AI is not replacing you — it is a new tool you must master
- The engineer who bridges legacy enterprise + AI is worth 2x either alone
- Singapore's AI market is projected to grow 40% CAGR through 2030
- Every bank, government agency, and healthcare system needs AI integration

### What "Job Safe" Means in 2026–2031
1. You can build and deploy AI-powered features (not just prototypes)
2. You understand production concerns: cost, latency, safety, compliance
3. You can design AI systems (architecture) not just prompt ChatGPT
4. You maintain your Java/Spring expertise while adding AI capabilities
5. You can evaluate and select the right AI tool for each problem

---

================================================================================
PHASE 1 — FOUNDATION (Months 0–3)
================================================================================

| Week | Topic | Tools/Models | What to Build | Verification |
|------|-------|--------------|---------------|-------------|
| 1 | Python for AI | Python 3.12+ | Async CLI tool | Can use asyncio + typing |
| 1 | FastAPI basics | FastAPI, Uvicorn | Hello world API | /docs endpoint works |
| 2 | Pydantic models | Pydantic v2 | Data validation layer | Type errors caught |
| 2 | Flask alternative | Flask, Gunicorn | Simple REST API | Compare vs FastAPI |
| 3 | LLM Fundamentals | OpenAI SDK, Anthropic | Token counter, cost calc | Know tokens, temp, top_p |
| 3 | Prompt Patterns | System/user/asst | Prompt template lib | 10 reusable prompts |
| 4 | Embeddings | sentence-transformers | Text similarity search | Cosine similarity works |
| 4 | VectorDB Intro | ChromaDB (local) | Store/query embeddings | CRUD on vectors |
| 5 | RAG Basic | LangChain + ChromaDB | Q&A over PDF | Answers from doc content |
| 5 | Chunking | Recursive split, semantic | Compare chunk strategies | Know tradeoffs |
| 6 | Retrieval | MMR, similarity | Hybrid search demo | Both dense+sparse work |
| 6 | FastAPI + LLM | FastAPI + LangChain | Chat API with history | Streaming response |
| 7 | Async in Python | asyncio, aiohttp | Concurrent API calls | 10x speedup vs sync |
| 7 | Type hints | typing module | Typed codebase | mypy passes |
| 8 | REST best practices | FastAPI routers | Structured API project | Clean file hierarchy |
| 8 | Error handling | Exception middleware | Robust error responses | All errors caught |
| 9 | Logging | structlog, loguru | Structured logs | JSON log output |
| 9 | Testing | pytest, httpx | API tests | >80% coverage |
| 10 | Project 1 | Full stack | RAG chatbot with UI | Deployed somewhere |
| 10 | Review week | All above | Fix gaps | Can explain each concept |
| 11 | API security | API keys, rate limit | Secure API | Auth middleware works |
| 11 | Config management | pydantic-settings | Env-based config | Works in dev/prod |
| 12 | Phase 1 capstone | All above | Production-ready RAG API | Deployed with docs |

### Phase 1 Key Milestones
- [ ] Python async/typing comfortable
- [ ] FastAPI API with streaming LLM responses
- [ ] ChromaDB vector store with embeddings
- [ ] Basic RAG pipeline (PDF → chunks → embeddings → Q&A)
- [ ] Project 1 deployed and documented

### Phase 1 Deep Dive — Python for AI
```
Week 1-2 Focus:
├── asyncio basics → async def, await, asyncio.gather
├── Type hints → Dict[str, Any], List[Model], Optional, Union
├── Pydantic v2 → BaseModel, Field, validator, model_config
├── Data classes vs Pydantic → when to use which
└── Generators → yield, lazy evaluation for large datasets
```

### Phase 1 Deep Dive — FastAPI for AI
```
Week 1-2 Focus:
├── Route decorators → @app.get, @app.post, @app.websocket
├── Request body → Pydantic models for structured input
├── Response model → Return types, StreamingResponse
├── Dependency injection → API keys, DB connections
├── Background tasks → Long-running AI inference
├── WebSocket → Real-time token streaming
└── /docs → OpenAPI auto-documentation
```

### Phase 1 Deep Dive — LLM Fundamentals
```
Week 3 Focus:
├── Tokens → Encoding, token counting, cost calculation
├── Temperature → Creativity vs determinism (0.0 - 2.0)
├── Top-p → Nucleus sampling for diversity
├── Max tokens → Output length control
├── System prompt → Persona, rules, constraints
├── Few-shot examples → In-context learning
├── Streaming → Token-by-token response delivery
└── Error handling → Rate limits, timeouts, retries
```

### Phase 1 Deep Dive — Embeddings & VectorDB
```
Week 4 Focus:
├── Embeddings → Dense vector representations of text
├── Cosine similarity → Measuring semantic distance
├── ChromaDB → Collection, add, query, update, delete
├── Embedding models → all-MiniLM-L6-v2 (fast), text-embedding-3 (OpenAI)
├── Dimension → 384 vs 1536 vs 3072 (speed vs quality)
├── Batch operations → Efficient bulk insert/query
└── Metadata filtering → Combine vector search with filters
```

### Phase 1 Deep Dive — RAG Basics
```
Week 5-6 Focus:
├── Document loading → PDF, text, web, database sources
├── Text splitting → RecursiveCharacterTextSplitter, chunk_size, chunk_overlap
├── Embedding → Convert chunks to vectors
├── Vector store → ChromaDB with embeddings + metadata
├── Retrieval → similarity_search, MMR, threshold filtering
├── Chain → retriever | prompt | LLM | output_parser
├── Streaming → Token-by-token RAG response
└── Evaluation → Does answer come from the document?
```

---

================================================================================
PHASE 2 — AGENTIC AI (Months 3–6) — HIGHEST PRIORITY
================================================================================

| Week | Topic | Tools/Models | What to Build | Verification |
|------|-------|--------------|---------------|-------------|
| 13 | LangChain basics | LangChain, LCEL | Chain pipeline | Understand LCEL |
| 13 | Tool calling | @tool decorator | Tool-enabled LLM | LLM calls tools correctly |
| 14 | Memory systems | ConversationBuffer, SummaryBuffer | Chat with memory | Remembers context |
| 14 | LangGraph intro | StateGraph | Simple state machine | State transitions work |
| 15 | LangGraph nodes | Nodes, edges, cond. | Branching workflow | Conditional paths work |
| 15 | Human-in-loop | interrupt, checkpoint | Approval workflow | Human can override |
| 16 | Multi-agent 1 | Supervisor pattern | Two agents, one super. | Agents delegate work |
| 16 | Multi-agent 2 | Team/crew pattern | Research+write team | Coordinated output |
| 17 | MCP intro | MCP protocol | MCP tool server | Client can call tool |
| 17 | MCP resources | Resource templates | Dynamic resource server | Resources served via MCP |
| 18 | MCP + LangGraph | MCP client in graph | Agent with MCP tools | Full MCP integration |
| 18 | CrewAI basic | CrewAI framework | Simple crew of agents | Crew completes tasks |
| 19 | CrewAI advanced | Processes, tasks | Research crew | Multi-step research |
| 19 | AutoGen intro | AutoGen | Conversational agents | Agents talk to each other |
| 20 | Agent comparison | LangGraph vs CrewAI | Same problem, 2 frameworks | Know when to use which |
| 20 | ReAct pattern | ReAct implementation | LLM thinks + acts | Understand thought loop |
| 21 | Planning agents | Plan-execute | Task planning agent | Breaks down complex tasks |
| 21 | Reflection agents | Self-critique | Self-improving agent | Iterates on own output |
| 22 | Advanced RAG 1 | HyDE, multi-query | Enhanced RAG pipeline | Better retrieval results |
| 22 | Advanced RAG 2 | Reranking, compression | Production RAG | Precision improved |
| 23 | Fine-tuning intro | LoRA, PEFT | Fine-tune small model | Loss decreases |
| 23 | Fine-tuning local | Ollama + Modelfile | Custom Ollama model | Local model works |
| 24 | Phase 2 capstone | Multi-agent system | Full agentic app | End-to-end demo ready |

### Phase 2 Key Milestones
- [ ] LangGraph StateGraph with conditional branching
- [ ] Multi-agent system with supervisor pattern
- [ ] MCP tool server + client integration
- [ ] Advanced RAG with HyDE and reranking
- [ ] Project 2 deployed (multi-agent research system)

### Phase 2 Deep Dive — LangChain & LCEL
```
Week 13 Focus:
├── LCEL → | pipe operator for chain composition
├── RunnablePassthrough → Pass input through unchanged
├── RunnableParallel → Run multiple chains concurrently
├── RunnableLambda → Custom function in chain
├── chain.invoke() → Single execution
├── chain.stream() → Token-by-token streaming
├── chain.batch() → Parallel execution
├── Prompt templates → Structured prompt construction
├── Output parsers → PydanticOutputParser, StrOutputParser
└── Tool binding → @tool decorator, tool.invoke()
```

### Phase 2 Deep Dive — LangGraph
```
Week 14-16 Focus:
├── StateGraph → Define graph with typed state
├── Nodes → Functions that transform state
├── Edges → Transitions between nodes (conditional or fixed)
├── State → TypedDict with reducer functions
├── Checkpointing → State persistence via MemorySaver
├── Human-in-the-loop → interrupt_before/interrupt_after
├── Command → Resume with human input
├── Subgraphs → Composable graph nodes
├── Streaming → Stream node outputs in real-time
└── Error handling → Fallback nodes, retry logic
```

### Phase 2 Deep Dive — Multi-Agent Patterns
```
Week 16-19 Focus:
├── Supervisor → One agent routes to worker agents
├── Team → Multiple agents with shared goals
├── Debate → Multiple agents argue then synthesize
├── Sequential → Agent A → Agent B → Agent C
├── Parallel → Multiple agents run simultaneously
├── Handoff → Agents transfer control explicitly
├── Shared state → All agents read/write common state
├── Private state → Agent-specific memory
├── Tool delegation → Agent hands off to specialist
└── Termination conditions → When to stop the agent loop
```

### Phase 2 Deep Dive — MCP
```
Week 17-18 Focus:
├── Protocol → JSON-RPC over stdio/SSE
├── Server → Exposes tools, resources, prompts
├── Client → Connects to server, invokes tools
├── Tools → Functions the LLM can call
├── Resources → Data sources for context
├── Prompts → Reusable prompt templates
├── Sampling → Server-initiated LLM requests
├── Roots → Filesystem boundaries
├── Transport → stdio (local) or HTTP+SSE (remote)
├── Security → OAuth 2.0, PKCE, tool approval
└── Registry → modelcontextprotocol.io
```

### Phase 2 Deep Dive — Agent Framework Comparison
```
Week 20 Focus:
├── LangGraph → Best for complex stateful workflows, fine control
├── CrewAI → Best for role-based multi-agent teams, simple setup
├── AutoGen → Best for conversational multi-agent, research
├── Decision factors:
│   ├── Need fine-grained control? → LangGraph
│   ├── Need team of specialists? → CrewAI
│   ├── Need agent conversations? → AutoGen
│   └── Need production monitoring? → LangGraph + LangSmith
└── Recommendation: Start with LangGraph (most versatile)
```

### Phase 2 Deep Dive — Advanced RAG
```
Week 22 Focus:
├── HyDE → Generate hypothetical answer, embed, retrieve
├── Multi-query → Generate multiple query variations
├── Parent document → Small chunks for retrieval, large for context
├── Reranking → Cross-encoder reranks top-k results
├── Compression → LLM strips irrelevant context
├── Self-RAG → On-demand retrieval + reflection
├── Corrective RAG → Self-correction on retrieval quality
├── Ensemble retrieval → Combine multiple retrievers
├── Metadata filtering → Filter by date, source, type
└── Hybrid search → Dense + sparse (BM25) combined
```

### Phase 2 Deep Dive — Fine-Tuning
```
Week 23 Focus:
├── When to fine-tune → After RAG is insufficient
├── LoRA → Low-rank adaptation, trainable matrices only
├── QLoRA → 4-bit quantized LoRA, fits on consumer GPU
├── PEFT → Parameter-efficient fine-tuning (umbrella)
├── Data preparation → Instruction format, quality over quantity
├── Training loop → Loss monitoring, overfitting detection
├── Evaluation → Before/after comparison on held-out set
├── Ollama Modelfile → Custom model configuration
├── Merge → Combine LoRA weights with base model
└── Deployment → Serve fine-tuned model via vLLM/Ollama
```

---

================================================================================
PHASE 3 — ENTERPRISE AI + SPECIALISATION (Months 6–12)
================================================================================

| Week | Topic | Tools/Models | What to Build | Verification |
|------|-------|--------------|---------------|-------------|
| 25 | Docker for AI | Docker, docker-compose | Containerised AI app | docker-compose up works |
| 25 | GPU in Docker | nvidia-docker | GPU container | nvidia-smi inside container |
| 26 | K8s basics | minikube, kubectl | Deploy AI service | pod running |
| 26 | K8s GPU sched. | Volcano, device plugin | GPU workload on k8s | GPU job runs |
| 27 | Model serving | vLLM, TGI | Serve LLM with vLLM | /v1/chat/completions works |
| 27 | Inference optim. | Continuous batching | Benchmark throughput | Lower latency |
| 28 | Spring AI bridge | Spring AI, Java | Java AI service | Java calls LLM |
| 28 | Python ↔ Java | gRPC, REST bridge | Hybrid microservice | Both lang work together |
| 29 | AI Security 1 | NVIDIA NeMo Guardrails | Prompt injection shield | Attack blocked |
| 29 | AI Security 2 | Content filtering | Output safety filter | PII masked |
| 30 | Data governance | PDPA compliance | Data handling layer | Compliant by design |
| 30 | LLMOps Intro | LangSmith, W&B | Trace + evaluate | Single run trace |
| 31 | Evals framework | Ragas, DeepEval | Evaluation pipeline | Metrics reported |
| 31 | Prometheus + AI | Custom metrics | Monitor token usage | Dashboard live |
| 32 | CI/CD for AI | GitHub Actions | Auto-deploy pipeline | Push → deploy |
| 32 | Model registry | MLflow, DVC | Versioned models | Rollback works |
| 33 | Caching strategies | Redis, semantic cache | Cache layer for AI | Latency reduced 10x |
| 33 | Rate limiting | Token bucket, sliding | API rate limiter | Limits enforced |
| 34 | Cost optimization | Token accounting | Cost dashboard | Know $/query |
| 34 | Observability | OpenTelemetry | Full observability | Traces + metrics + logs |
| 35 | Project 3 | Enterprise RAG system | Docs Q&A for enterprise | Deployed, tested |
| 35 | Project 4 | Multi-agent workflow | Automated report gen | End-to-end automation |
| 36 | Robotics intro | ROS2 basics | Simple robot node | Pub/sub works (sim) |
| 36 | LLM + Robot | LLM → action | Task planner for robot | Plan → execute |
| 37 | Phase 3 review | All above | Portfolio polish | 5 projects on GitHub |
| 37 | Mock interview | AI system design | 1-hr system design | Can explain all choices |
| 38-48 | Deepen weak areas | Based on gaps | 2-3 more projects | Ready for senior AI role |

### Phase 3 Key Milestones
- [ ] Docker containerized AI service running
- [ ] vLLM serving LLM with /v1/chat/completions endpoint
- [ ] Spring AI Java service calling LLM
- [ ] NeMo Guardrails blocking prompt injection
- [ ] LLMOps trace from request to response
- [ ] Evaluation pipeline with Ragas metrics
- [ ] CI/CD auto-deploying AI service
- [ ] 5 production-quality projects on GitHub

### Phase 3 Deep Dive — Docker for AI
```
Week 25 Focus:
├── Dockerfile → Python base image, dependencies, entrypoint
├── docker-compose → Multi-service: API + VectorDB + Cache
├── GPU support → nvidia-docker, CUDA base images
├── Volume mounts → Persistent vector store data
├── Environment variables → API keys, model paths
├── Health checks → /health endpoint for orchestrators
├── Resource limits → Memory, GPU memory constraints
└── Multi-stage builds → Reduce image size
```

### Phase 3 Deep Dive — Model Serving
```
Week 27 Focus:
├── vLLM → PagedAttention, continuous batching
├── TGI → HuggingFace's text generation inference
├── Triton → Multi-model serving with dynamic batching
├── /v1/chat/completions → OpenAI-compatible API
├── Continuous batching → New requests join running batches
├── Quantization → INT8, INT4, FP8 for memory reduction
├── Speculative decoding → Draft model + verify for speedup
├── Tensor parallelism → Split model across GPUs
├── Prefix caching → Share prompt cache across requests
└── Benchmarking → Throughput, latency, cost per token
```

### Phase 3 Deep Dive — Spring AI Bridge
```
Week 28 Focus:
├── ChatClient → Unified LLM interface across providers
├── PromptTemplate → Structured prompt construction
├── Structured output → Bean output, autodetect
├── Function calling → @Bean tools, tool registration
├── RAG pipeline → DocumentRetriever → ContentRetriever
├── Advisors → QuestionAnswerAdvisor, SafeGuardAdvisor
├── ChatMemory → In-memory, JDBC persistence
├── Observability → Micrometer metrics + traces
├── Python ↔ Java → gRPC, REST, message queue
└── Deployment → Spring Boot + Docker + K8s
```

### Phase 3 Deep Dive — AI Security
```
Week 29 Focus:
├── Prompt injection → Direct/indirect attack vectors
├── Jailbreak techniques → DAN, role-play, encoding bypass
├── Input filtering → NeMo Guardrails input rails
├── Output filtering → Toxicity, PII, topic restriction
├── Content moderation → OpenAI moderation API, custom filters
├── PII detection → Named entity recognition, regex patterns
├── Data masking → [REDACTED_*] for sensitive fields
├── Audit logging → Every LLM call logged for compliance
├── RBAC → Role-based access to AI features
└── Singapore compliance → PDPA, IM8, sector-specific rules
```

### Phase 3 Deep Dive — LLMOps & Evaluation
```
Week 30-31 Focus:
├── LangSmith → Trace, debug, evaluate LLM applications
├── Tracing → Every LLM call, chain step, agent action
├── Datasets → Curated evaluation sets with ground truth
├── Online evaluation → Real-time quality monitoring
├── Ragas metrics → Faithfulness, relevancy, context precision
├── DeepEval → Additional eval metrics
├── Prometheus → Custom metrics for token usage, latency
├── Grafana → Dashboards for LLM monitoring
├── Alerting → Anomaly detection on LLM behavior
└── Cost tracking → Per-request token cost accounting
```

### Phase 3 Deep Dive — CI/CD for AI
```
Week 32 Focus:
├── GitHub Actions → Auto-deploy on push
├── Tests → Unit, integration, eval tests
├── Linting → Ruff, mypy for Python
├── Evaluation gates → Block deploy if evals fail
├── Model registry → MLflow versioning
├── Rollback → Revert to previous model version
├── A/B testing → Deploy to subset, compare metrics
├── Canary deploy → Gradual rollout
├── Infrastructure as code → Terraform, Docker compose
└── Monitoring → Post-deploy observability
```

---

================================================================================
PHASE 4 — FUTURE-PROOF (Year 1–5)
================================================================================

| Year | Topic | Tools/Models | When to Start | Notes |
|------|-------|--------------|---------------|-------|
| 1-2 | Production depth | All above + scaling | After Phase 3 | Master deployment at scale |
| 2 | Quantum intro | Qiskit | Year 2, basic only | 1 hour/week, conceptual |
| 2-3 | Quantum ML | PennyLane | Year 2-3 | Basic quantum circuits |
| 3 | AI+Quantum | Hybrid algorithms | Year 3 | Research phase, not urgent |
| 3-4 | Quantum+Agentics | Quantum optimisation | Year 3-4 | For agent planning |
| 4-5 | Full convergence | AI+Quantum+Robotics | Year 4+ | Emerging field, monitor |
| 1-5 | Architecture | System design patterns | Continuous | Read papers, blogs |
| 1-5 | Leadership | Tech lead, architect | Continuous | Mentor others |

### Year 1–2: Production Mastery
- Scale AI services to thousands of concurrent users
- Multi-region deployment with failover
- Cost optimization at scale (model routing, caching, batching)
- Enterprise security: audit trails, compliance, data governance
- Team leadership: mentoring junior AI engineers

### Year 2–3: Quantum Awareness
- Understand qubits, superposition, entanglement conceptually
- Know which problems quantum solves (optimization, simulation, factoring)
- Recognize when quantum + AI hybrid approaches emerge
- 1 hour/week maximum — conceptual awareness only

### Year 3–5: Convergence Monitoring
- Watch for quantum advantage in ML optimization
- Monitor quantum-enhanced agent planning research
- Evaluate quantum computing for specific enterprise use cases
- Build hybrid quantum-classical prototypes if relevant

---

================================================================================
SKILL TRACKER — Tick when confident
================================================================================

| Skill | Phase | Priority | Status | Date |
|-------|-------|----------|--------|------|
| Python async/typing | 1 | HIGH | [ ] | |
| FastAPI REST API | 1 | HIGH | [ ] | |
| LLM Fundamentals | 1 | HIGH | [ ] | |
| Prompt Engineering | 1 | HIGH | [ ] | |
| Embeddings | 1 | HIGH | [ ] | |
| ChromaDB / VectorDB | 1 | HIGH | [ ] | |
| Basic RAG | 1 | HIGH | [ ] | |
| LangChain LCEL | 2 | HIGH | [ ] | |
| LangGraph StateGraph | 2 | HIGH | [ ] | |
| Multi-agent orchestration | 2 | HIGH | [ ] | |
| MCP Protocol | 2 | HIGH | [ ] | |
| CrewAI / AutoGen | 2 | MEDIUM | [ ] | |
| Advanced RAG (HyDE etc) | 2 | HIGH | [ ] | |
| Fine-tuning (LoRA) | 2 | MEDIUM | [ ] | |
| LLM Evals (Ragas) | 2 | HIGH | [ ] | |
| Docker for AI | 3 | HIGH | [ ] | |
| K8s for AI | 3 | MEDIUM | [ ] | |
| Model serving (vLLM) | 3 | HIGH | [ ] | |
| Spring AI bridge | 3 | MEDIUM | [ ] | |
| AI Security | 3 | HIGH | [ ] | |
| LLMOps / Monitoring | 3 | HIGH | [ ] | |
| CI/CD for AI | 3 | MEDIUM | [ ] | |
| Cost optimization | 3 | HIGH | [ ] | |
| Robotics + AI basics | 3 | LOW | [ ] | |
| Quantum concepts | 4 | LOW | [ ] | |
| System design (AI) | ALL | HIGH | [ ] | |

---

================================================================================
PROJECT PORTFOLIO — Build these 8 (not 500)
================================================================================

| # | Project | Phase | Tech Stack | Demo Ready |
|---|---------|-------|------------|-----------|
| 1 | RAG Q&A Chatbot | 1 | FastAPI + ChromaDB + LLM | [ ] |
| 2 | Multi-Agent Research | 2 | LangGraph + MCP + Tools | [ ] |
| 3 | Document Pipeline | 2 | OCR → RAG → Summary | [ ] |
| 4 | Enterprise Doc Portal | 3 | Docker + Spring AI + RAG | [ ] |
| 5 | AI API Gateway | 3 | FastAPI + Redis + Guard | [ ] |
| 6 | Agent Dashboard | 2-3 | LangGraph + FastAPI + UI | [ ] |
| 7 | Eval + Monitoring Sys | 3 | Ragas + Prometheus + Graf | [ ] |
| 8 | Full Enterprise AI App | 3-4 | All combined + K8s | [ ] |

### Project 1 — RAG Q&A Chatbot
```
Tech Stack: FastAPI + ChromaDB + LangChain + OpenAI/Ollama
Features:
├── PDF upload and processing
├── Chunking with configurable strategies
├── Embedding and vector storage
├── Conversational Q&A with memory
├── Source attribution in responses
├── API endpoints: /upload, /chat, /history
├── Simple web UI (Streamlit or Gradio)
└── Docker deployment
README must include: Architecture diagram, setup instructions, API docs
```

### Project 2 — Multi-Agent Research System
```
Tech Stack: LangGraph + MCP + FastAPI
Features:
├── Supervisor agent orchestrating worker agents
├── Research agent (web search, article parsing)
├── Writing agent (structured report generation)
├── Analysis agent (data extraction, summarization)
├── MCP tool server for external data access
├── State persistence across conversations
├── Human-in-the-loop for plan approval
└── Streaming output to web UI
README must include: Agent flow diagram, MCP server docs
```

### Project 3 — Document Processing Pipeline
```
Tech Stack: Python + OCR + LangChain + ChromaDB
Features:
├── Multi-format input: PDF, DOCX, images, scans
├── OCR extraction (Tesseract or cloud OCR)
├── Intelligent chunking with metadata preservation
├── Entity extraction and tagging
├── Vector storage with rich metadata
├── Semantic search across document collection
├── Summary generation for document clusters
└── Batch processing with queue management
README must include: Pipeline diagram, supported formats
```

### Project 4 — Enterprise Document Portal
```
Tech Stack: Docker + Spring AI + LangChain + PostgreSQL + pgvector
Features:
├── Spring AI Java backend for enterprise integration
├── Python microservice for AI/ML operations
├── gRPC bridge between Java and Python services
├── Role-based access control
├── Document management with version control
├── RAG-powered search with citation tracking
├── Audit logging for compliance
└── Docker Compose deployment
README must include: Enterprise architecture, compliance notes
```

### Project 5 — AI API Gateway
```
Tech Stack: FastAPI + Redis + NeMo Guardrails
Features:
├── Unified API for multiple LLM providers
├── Rate limiting (token bucket algorithm)
├── Semantic caching (Redis + embedding similarity)
├── Input guardrails (injection detection, PII masking)
├── Output guardrails (toxicity, topic restriction)
├── Cost tracking per API key
├── Request/response logging
├── Health checks and circuit breakers
README must include: Security model, rate limit config
```

### Project 6 — Agent Dashboard
```
Tech Stack: LangGraph + FastAPI + React/Streamlit
Features:
├── Visual agent workflow editor
├── Real-time agent execution monitoring
├── Human-in-the-loop approval interface
├── Agent conversation history
├── Performance metrics (latency, tokens, cost)
├── Error tracking and retry management
├── A/B testing for agent configurations
└── Export conversation logs
README must include: Dashboard screenshots, setup guide
```

### Project 7 — Eval + Monitoring System
```
Tech Stack: Ragas + Prometheus + Grafana + LangSmith
Features:
├── Automated evaluation pipeline
├── Faithfulness, relevancy, context precision metrics
├── Custom domain-specific evaluation criteria
├── Prometheus metrics: tokens, latency, cost, errors
├── Grafana dashboards for real-time monitoring
├── Alerting on anomalies (latency spikes, quality drops)
├── Historical trend analysis
├── A/B test comparison reports
README must include: Metric definitions, dashboard configs
```

### Project 8 — Full Enterprise AI Application
```
Tech Stack: All combined — Docker + K8s + vLLM + LangGraph + Spring AI
Features:
├── Microservices architecture (API gateway, AI service, data service)
├── Kubernetes deployment with GPU scheduling
├── vLLM model serving with quantization
├── Multi-agent orchestration with LangGraph
├── Enterprise security (SSO, RBAC, audit)
├── Full LLMOps pipeline (trace, eval, monitor)
├── CI/CD with evaluation gates
├── Cost optimization (model routing, caching)
├── Disaster recovery and failover
└── Comprehensive documentation and runbooks
README must include: Full architecture diagram, deployment guide, runbook
```

---

================================================================================
DAILY ROUTINE (6 months, 6 days/week, 4–6 hours/day)
================================================================================

| Time Slot | Activity | Notes |
|-----------|----------|-------|
| Morning (1hr) | Theory + reading | Papers, docs, architecture |
| Mid-day (2hr) | Hands-on coding | Build the week's project |
| Evening (1-2hr) | Deep work / experiment | Debug, optimise, refactor |
| Night (30min) | Review + journal | What worked, what's next |
| Sunday | Rest OR portfolio polish | GitHub README, deploy, blog |

### Daily Routine Detail

**Morning (1 hour) — Theory & Reading**
- Read 1 blog post or 1 paper section (max 30 min)
- Review yesterday's notes and today's goals (10 min)
- Skim LangChain/LangGraph docs for new features (10 min)
- Watch 1 short tutorial video if available (10 min)

**Mid-day (2 hours) — Hands-on Coding**
- Focus on this week's project (90 min)
- Build one specific feature or fix one bug (30 min)
- Commit progress to git (even if incomplete)

**Evening (1-2 hours) — Deep Work**
- Debug issues from mid-day session (45 min)
- Refactor and clean code (30 min)
- Experiment with a new technique or library (15 min)

**Night (30 minutes) — Review & Journal**
- What did I learn today? (10 min)
- What's blocking me? (5 min)
- What will I do tomorrow? (10 min)
- Update skill tracker (5 min)

**Sunday — Rest or Polish**
- REST is mandatory — burnout kills careers
- If energized: polish GitHub README, deploy project, write blog post
- If tired: completely disconnect from AI

---

================================================================================
FREE TOOLS — Zero cost learning
================================================================================

| Category | Tool | Why |
|----------|------|-----|
| Local LLM | Ollama + llama3.2/Phi-3 | Run models locally, no API cost |
| Embeddings | sentence-transformers | Free local embeddings |
| VectorDB | ChromaDB | Free, local, simple |
| Postgres vector | pgvector | Free with Postgres |
| Orchestration | LangChain + LangGraph (OSS) | Free, industry standard |
| Finetuning | HuggingFace PEFT + LoRA | Free, colab compatible |
| Container | Docker Desktop | Free for personal |
| Orchestration | minikube | Free local K8s |
| CI/CD | GitHub Actions | Free for public repos |
| Monitoring | LangSmith (free tier) | 100k traces/month free |
| Evals | Ragas, DeepEval | Open source |
| Coding assistant | Claude Free / GitHub Copilot | Accelerate learning |

### Free Tool Setup Guide
```
Step 1: Install Ollama
├── Windows: Download from ollama.com
├── Pull model: ollama pull llama3.2
├── Verify: ollama run llama3.2 "Hello"
└── API: http://localhost:11434/v1/chat/completions

Step 2: Install Python environment
├── Install Python 3.12+
├── Create venv: python -m venv .venv
├── Activate: .venv\Scripts\activate
├── Install: pip install fastapi uvicorn langchain chromadb
└── Verify: python -c "import langchain; print(langchain.__version__)"

Step 3: Install ChromaDB
├── pip install chromadb
├── Start: chroma run --path ./data
├── Verify: http://localhost:8000/api/v1/heartbeat
└── API: http://localhost:8000/api/v1/collections

Step 4: Install Docker
├── Download Docker Desktop
├── Verify: docker run hello-world
├── GPU support: Install nvidia-container-toolkit
└── Verify GPU: docker run --gpus all nvidia/cuda:11.8-base nvidia-smi

Step 5: Install LangSmith (free tier)
├── Sign up at smith.langchain.com
├── Get API key
├── Set: set LANGCHAIN_TRACING_V2=true
├── Set: set LANGCHAIN_API_KEY=your-key
└── Verify: Run any LangChain code, check traces
```

---

================================================================================
CRITICAL SUCCESS FACTORS
================================================================================

| Factor | Action |
|--------|--------|
| Depth over volume | 8 deep projects > 500 scripts. Recruiters check GitHub README quality. |
| Production mindset | Tests, docs, error handling, logging, CI/CD in every project. |
| Portfolio first | Before applying, have 5 repos with README, architecture diagram. |
| Singapore context | Build projects that solve banking/govt/EDG/healthcare problems. |
| Network | Join AI Singapore community, attend meetups after Month 6. |
| Java bridge | Your 15-yr Java + new AI skills = unique. Don't drop Spring. |
| Consistency | 4-6 hours daily > 12 hours on weekend. Small daily wins compound. |
| Health | Sleep 7hr, exercise, don't burn out. This is a marathon, not sprint. |

### Common Mistakes to Avoid
1. **Tutorial hell** — Watching 100 tutorials instead of building 1 project
2. **Framework hopping** — Learning 5 frameworks badly instead of 1 well
3. **Skipping basics** — Jumping to agents without understanding embeddings
4. **Ignoring deployment** — Building demo-quality code that can't run in production
5. **No documentation** — GitHub repos without READMEs are invisible
6. **Perfection paralysis** — Waiting for the "right" approach instead of iterating
7. **Isolation** — Not engaging with AI Singapore community
8. **Burnout** — Working 12 hours on weekends, crashing by month 3

### Singapore Market Specifics
- **Banks:** DBS, OCBC, UOB — AI for fraud detection, customer service, risk
- **Government:** GovTech, LTA, MOH — AI for public services, compliance
- **Healthcare:** Singapore General Hospital, NUH — AI for diagnostics, records
- **Tech:** Grab, Shopee, Sea Group — AI for recommendation, operations
- **Consulting:** McKinsey, Deloitte, Accenture — AI transformation projects

---

================================================================================
SUMMARY: WHAT TO LEARN (from most to least important)
================================================================================

| Order | Topic | Job Safety Impact | Time Investment |
|-------|-------|-------------------|-----------------|
| 1 | LangGraph + Multi-agent | CRITICAL | 2 months |
| 2 | RAG + Advanced RAG | CRITICAL | 1.5 months |
| 3 | FastAPI + Python for AI | CRITICAL | 1 month |
| 4 | MCP Protocol | HIGH | 2 weeks |
| 5 | LLM Evals + LLMOps | HIGH | 1 month |
| 6 | Docker + Model Serving | HIGH | 1 month |
| 7 | AI Security | HIGH | 2 weeks |
| 8 | Fine-tuning (LoRA) | MEDIUM | 2 weeks |
| 9 | Spring AI Bridge | MEDIUM | 2 weeks |
| 10 | CrewAI / AutoGen | MEDIUM | 2 weeks |
| 11 | K8s for AI | MEDIUM | 2 weeks |
| 12 | Robotics + AI | LOW (future) | Skip for now |
| 13 | Quantum computing | LOW (far future) | Skip for now |

**Your only real competition is other engineers who stop learning. Keep building.**
**Singapore needs AI engineers who can bridge old systems with new AI — that's you.**

---
---

# AI SYSTEM DESIGN & ARCHITECTURE — Best Blogs, Papers, Courses & Resources
## Architecture thinking & system design mastery across full AI tech stack
## Format: Blog | Paper | Course | Book | Video | Reference

---

================================================================================
SECTION 1 — SYSTEM DESIGN FOR AI SYSTEMS (FOUNDATION)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Designing Data-Intensive Apps | Book | Martin Kleppmann | "DDIA" book | Bible of distributed systems — every AI system is data-intensive |
| System Design Interview | Book | Alex Xu | "System Design Interview" Vol 1 & 2 | Patterns for designing at scale |
| AI System Design (Chip Huyen) | Blog | Chip Huyen | huyenchip.com/blog | Production ML, MLOps, real-world AI systems |
| Stanford CS329A: ML Systems | Course | Stanford | cs329a.stanford.edu | ML system design from Stanford |
| Building Production AI Systems | Blog | OpenAI / Databricks | blogs about MLOps | How to move from notebook to production |
| The Architecture of LLM Apps | Blog | Andreessen Horowitz | a16z.com "Emerging Architectures for LLM" | Reference architecture for LLM apps |
| LLM Application Architecture | Blog | Marton Sőrés / various | marton.dev blog | Patterns for LLM app architecture |
| Google ML System Design | Doc | Google Cloud | "ML System Design Framework" | Google's methodology |
| Uber's ML Architecture | Case St. | Uber Engineering | uber.com/blog (ML platform) | Real-world ML systems at scale |
| Netflix ML Architecture | Case St. | Netflix Tech Blog | netflixtechblog.medium.com | Recommender systems at scale |

### System Design Patterns for AI
- **RAG Pipeline Architecture** — Ingestion → Chunking → Embedding → Storage → Retrieval → Generation
- **Multi-Agent Orchestration** — Supervisor, team, router patterns for agent coordination
- **Caching Strategies** — Semantic cache, response cache, embedding cache for LLMs
- **Model Serving Architectures** — vLLM, TGI, Triton for inference at scale
- **Guardrails Architecture** — Input filtering → Processing → Output filtering
- **Hybrid Search Architecture** — Dense vectors + sparse BM25 + reranking
- **Cost-Aware Routing** — Small model for simple tasks, large model for complex
- **Human-in-the-Loop Patterns** — Approval gates, escalation, feedback loops

---

================================================================================
SECTION 2 — LLMs (Large Language Models)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| The Annotated Transformer | Blog | Harvard NLP | github.com/harvardnlp/annotated-transformer | Learn transformer architecture from code |
| Attention Is All You Need | Paper | Vaswani et al. | arxiv.org/abs/1706.03762 | The original transformer paper — required reading |
| What Is a LLM? Architecture Deep | Blog | Sebastian Raschka | sebastianraschka.com/blog | Best LLM explainer on the web |
| LLM Foundations (Lilian Weng) | Blog | Lilian Weng (OpenAI) | lilianweng.github.io | Comprehensive LLM concepts |
| Building LLM Apps (OpenAI) | Course | OpenAI | platform.openai.com/docs/guides | Official best practices |
| HuggingFace NLP Course | Course | HuggingFace | huggingface.co/learn/nlp-course | Transformers library, fine-tuning, pipelines |
| The Full Stack LLM Bootcamp | Course | Various | github.com/thefullstackllm/bootcamp | End-to-end LLM app development |
| LLM System Architecture | Blog | Taming LLMs | tamingllms.com | Architectural patterns for LLMs |
| GPT in 60 Lines of NumPy | Blog | Jay Mody | jaykmody.com/blog/gpt-from-scratch | Understand internals by building one |
| RLHF Explained | Blog | HuggingFace | huggingface.co/blog/rlhf | How RLHF works (alignment) |

### Advanced LLM Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| LLM Inference Optimization | Blog | Tim Dettmers | timdettmers.com | Quantization, vLLM, PagedAttention |
| Sparse MoE Architectures | Paper | Google (Mixtral) | arxiv.org/abs/2101.03961 | Mixture of Experts — scaling LLMs |
| FlashAttention | Paper | Tri Dao | arxiv.org/abs/2205.14135 | Efficient attention — core inference tech |

---

================================================================================
SECTION 3 — RAG (Retrieval-Augmented Generation)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| RAG from Scratch (Part 1-4) | Blog | Jerry Liu (LlamaIndex) | blog.llamaindex.ai | Best RAG tutorial series — authoritative |
| Advanced RAG Techniques | Blog | Jay Patel / LlamaIndex | "Advanced RAG" on Medium / LlamaIndex blog | HyDE, multi-query, RAPTOR, CRAG |
| Building RAG with LangChain | Course | LangChain | python.langchain.com/docs/tutorials/rag | Official LangChain RAG tutorials |
| RAG Patterns (Pinecone) | Blog | Pinecone | pinecone.io/learn (RAG series) | Chunking, embedding, retrieval deep dives |
| RAG Architecture Decisions | Blog | Andreessen Horowitz | a16z.com (RAG architecture post) | When to use RAG vs fine-tuning |
| RAG for Enterprise (Databricks) | Blog | Databricks | databricks.com/blog (RAG series) | Enterprise RAG patterns at scale |
| RAGAS (RAG Evaluation) | GitHub | Exploding Gradients | github.com/explodinggradients/ragas | Metrics for RAG quality |
| RAPTOR: Recursive RAG | Paper | UC Berkeley | arxiv.org/abs/2401.18059 | Advanced RAG with hierarchical summaries |
| Corrective RAG (CRAG) | Paper | Yan et al. | arxiv.org/abs/2401.15884 | RAG with self-correction |
| Self-RAG | Paper | Asai et al. | arxiv.org/abs/2310.11511 | On-demand retrieval + reflection |

### Advanced RAG Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Hybrid Search Architecture | Blog | Weaviate / Qdrant docs | weaviate.io/developers/weaviate | Sparse + dense vector search |
| Late Interaction (ColBERT) | Paper | Khattab & Zaharia | arxiv.org/abs/2004.12832 | Token-level retrieval precision |
| Freshness-Conscious RAG | Blog | LangChain blog | blog.langchain.dev | Time-aware retrieval for RAG |

---

================================================================================
SECTION 4 — VECTOR DATABASES (VectorDB)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Vector Database Explained | Blog | Pinecone | pinecone.io/learn/vector-database | What, why, how of vector databases |
| ANN Algorithms Guide | Blog | O'Reilly / Elastic | "Approximate Nearest Neighbor" guides | HNSW, IVF, PQ, LSH — understand tradeoffs |
| ChromaDB Docs | Docs | Chroma | docs.trychroma.com | Simple, local, free — start here |
| Pinecone Docs | Docs | Pinecone | docs.pinecone.io | Managed vector DB — enterprise patterns |
| Qdrant Docs | Docs | Qdrant | qdrant.tech/documentation | High-performance vector search |
| Weaviate Docs | Docs | Weaviate | weaviate.io/developers/weaviate | Vector + scalar search combined |
| pgvector Guide | Docs | PostgreSQL | github.com/pgvector/pgvector | Vector search inside Postgres |
| Milvus Architecture | Docs | Milvus | milvus.io/docs/architecture_overview.md | Distributed vector DB at scale |
| Embedding Models Comparison | Blog | MTEB Leaderboard | huggingface.co/spaces/mteb/leaderboard | Which embedding model to use |
| Vector Search Algorithms | Paper | Various | "Efficient and robust approximate nearest" | Core algorithmic understanding |

### Advanced VectorDB Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Binary Embeddings | Blog | Cohere / Qdrant | cohere.com/blog/binary-embeddings | 32x compression for vectors |
| Hybrid Search at Uber | Paper | Uber Engineering | uber.com/blog (hybrid search) | Real-world hybrid at scale |
| Distributed Vector Search | Blog | Milvus architecture | milvus.io/docs/architecture.md | Sharding, replication for vectors |

---

================================================================================
SECTION 5 — LANGCHAIN
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| LangChain Official Docs | Docs | LangChain | python.langchain.com/docs | Source of truth — must be fluent here |
| LangChain Academy | Course | LangChain | academy.langchain.com | Free official course — very good |
| LangChain Expression Language | Guide | LangChain | python.langchain.com/docs/concepts/lcel | LCEL is the core pattern — understand deeply |
| LangChain Cookbook | GitHub | Various | github.com/langchain-ai/langchain/templates | 100+ patterns and templates |
| LangChain Callbacks (LangSmith) | Docs | LangChain | docs.smith.langchain.com | Tracing, monitoring, observability |
| LangChain + GPT-4 Architecture | Blog | LangChain blog | blog.langchain.dev | Real architecture patterns |
| LangChain Tool Calling | Guide | LangChain | python.langchain.com/docs/how_to/tool_calling | Tool definition, binding, execution |
| LangChain Memory | Guide | LangChain | python.langchain.com/docs/concepts/memory | Conversation memory patterns |

### Advanced LangChain Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Custom LangChain Components | Guide | LangChain | python.langchain.com/docs/how_to/custom_ | Build custom llms, tools, retrievers |
| LangChain + Streaming | Guide | LangChain | docs on streaming + astream events | Production streaming patterns |
| LangChain + Async | Guide | LangChain | python.langchain.com/docs/concepts/async | Async chains for throughput |

---

================================================================================
SECTION 6 — LANGGRAPH
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| LangGraph Official Docs | Docs | LangChain | langchain-ai.github.io/langgraph | THE authoritative source — study every page |
| LangGraph Tutorial (Quick Start) | Guide | LangChain | "LangGraph Quick Start" on their site | Build first agent in 20 min |
| LangGraph Concepts Deep Dive | Guide | LangChain | langchain-ai.github.io/langgraph/concepts | StateGraph, nodes, edges, checkpoints |
| Multi-Agent Supervisor Pattern | Blog | LangChain blog | blog.langchain.dev (supervisor pattern) | Core multi-agent architecture pattern |
| LangGraph Human-in-the-Loop | Guide | LangChain | langchain-ai.github.io/langgraph/concepts/hil | Breakpoints, interrupt, approval flows |
| LangGraph Streaming | Guide | LangChain | langchain-ai.github.io/langgraph/how-tos | Stream events, nodes, state |
| LangGraph + LangSmith Tracing | Guide | LangChain | docs.smith.langchain.com/tracing | Debug complex graphs |
| LangGraph Persistence | Guide | LangChain | langchain-ai.github.io/langgraph/concepts/persistence | Checkpointers, SQLite, Postgres |
| LangGraph + Memory | Guide | LangChain | langchain-ai.github.io/langgraph/concepts/memory | Store + retrieve across sessions |
| Custom Graph Nodes in LangGraph | Guide | LangChain | langchain-ai.github.io/langgraph/how-tos | Async nodes, subgraphs, parallel |
| Subgraph Architecture | Guide | LangChain | langchain-ai.github.io/langgraph/concepts/subgraphs | Compose graphs within graphs |
| Phase/Stage Planning with LangGraph | Blog | Various (community) | blog.langchain.dev (planning) | Plan-then-execute architecture |

### Advanced LangGraph Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| LangGraph for Production | Blog | LangChain | blog.langchain.dev (production patterns) | Deployment, scaling, monitoring |
| LangGraph + MCP Integration | Guide | LangChain + MCP | modelcontextprotocol.io + LangGraph docs | Tool server protocol + orchestration |
| Conditional Branching Patterns | Guide | LangChain | langchain-ai.github.io/langgraph/how-tos | Complex routing logic in graphs |
| Concurrent Execution in Graphs | Guide | LangChain | langchain-ai.github.io/langgraph/how-tos | Fan-out, fan-in parallelism |

### LangGraph Reference Architectures
| Architecture | Pattern | When to Use |
|-------------|---------|-------------|
| Supervisor | One graph calls sub-graph agents | Clear hierarchy of control |
| Team (Round-Robin) | Multiple peers, one supervisor | Collaborative tasks |
| Router | LLM decides next node from options | Dynamic workflow routing |
| Plan-Execute | Plan → Execute steps sequentially | Complex multi-step tasks |
| ReAct | Think → Act → Observe (loop) | Tool-using agents |
| Reflection | Generate → Critique → Refine | Quality improvement tasks |
| Debate | Multiple agents argue then synthesize | Consensus tasks |

---

================================================================================
SECTION 7 — MCP (Model Context Protocol)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| MCP Specification (Official) | Spec | Anthropic | modelcontextprotocol.io | THE spec — read the whole thing |
| MCP Python SDK | Docs | Anthropic | github.com/modelcontextprotocol/python-sdk | Official Python implementation |
| MCP TypeScript SDK | Docs | Anthropic | github.com/modelcontextprotocol/typescript-sdk | Alternative SDK for comparison |
| MCP Servers (Official) | GitHub | Anthropic | github.com/modelcontextprotocol/servers | Reference server implementations |
| MCP Client Architecture | Guide | ModelContextProtocol | modelcontextprotocol.io/docs/concepts/client | How MCP clients work |
| MCP Server Architecture | Guide | ModelContextProtocol | modelcontextprotocol.io/docs/concepts/server | How MCP servers expose resources |
| MCP Resources & Tools | Guide | ModelContextProtocol | modelcontextprotocol.io/docs/concepts/tools | Resource/model/tool abstractions |
| MCP Sampling | Guide | ModelContextProtocol | modelcontextprotocol.io/docs/concepts/sampling | Server-to-LLM communication |
| MCP Transport Layer | Guide | ModelContextProtocol | modelcontextprotocol.io/docs/concepts/transport | STDIO + SSE transport modes |
| MCP + LangChain Integration | Blog | LangChain | blog.langchain.dev (MCP integration) | How LangChain connects to MCP servers |
| MCP + LangGraph Integration | Blog | LangChain | blog.langchain.dev (MCP tools in graph) | MCP as tool source in agent graphs |
| MCP Security Best Practices | Guide | Protocol docs | modelcontextprotocol.io/docs/concepts/security | Auth, scoping, data isolation |

### Advanced MCP Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Custom MCP Server Design | Guide | MCP docs + SDK | modelcontextprotocol.io/docs/tutorials | Build your own protocol-compliant server |
| MCP Resource Templates | Guide | MCP docs | modelcontextprotocol.io/docs/concepts/resources | Dynamic resources with URI templates |
| MCP Prompt Templates | Guide | MCP docs | modelcontextprotocol.io/docs/concepts/prompts | Server-defined prompt templates |
| Multi-Server MCP Architecture | Pattern | Community | various blogs (search "MCP multi-server") | Composing multiple tool servers |

---

================================================================================
SECTION 8 — AGENTIC AI / AI AGENTS
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| LLM Powered Autonomous Agents | Blog | Lilian Weng (OpenAI) | lilianweng.github.io (agents post) | THE definitive agent architecture survey |
| Building Effective Agents | Blog | Anthropic | anthropic.com/engineering/building-effective-agents | Must read — Anthropic's agent patterns |
| Agent Design Patterns | Blog | Andrew Ng | deeplearning.ai (agent design patterns) | Reflection, tool use, planning, multi-agent |
| ReAct: Reasoning + Acting | Paper | Yao et al. | arxiv.org/abs/2210.03629 | Original ReAct paper — understand deeply |
| Generative Agents (Stanford) | Paper | Park et al. | arxiv.org/abs/2304.03442 | Human-like agent simulation architecture |
| AutoGPT Architecture | Blog | Significant Gravitas | github.com/Significant-Gravitas/AutoGPT | Popular agent — study architecture |
| AgentBench | Paper | Ohio State / various | arxiv.org/abs/2308.03688 | Agent evaluation benchmark |
| Toolformer (Tool Learning) | Paper | Schick et al. (Meta) | arxiv.org/abs/2302.04761 | LLMs learning to use tools |
| SWE-Agent Architecture | Paper | Princeton | arxiv.org/abs/2405.15793 | Autonomous coding agent architecture |
| CrewAI Docs | Docs | CrewAI | docs.crewai.com | Multi-agent crew framework |
| AutoGen Docs | Docs | Microsoft | microsoft.github.io/autogen | Conversational multi-agent framework |
| Multi-Agent Debate | Paper | Google / various | arxiv.org/abs/2305.14325 | Agents debating for better reasoning |

### Advanced Agent Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Agent Memory Architecture | Blog | MemGPT / Letta | letta.ai/blog | Infinite context + agent memory |
| Agent Planning & Reflection | Paper | "Plan-and-Solve" etc | arxiv.org/abs/2305.04091 | Advanced planning strategies |
| Agent Safety | Paper | Anthropic / DeepMind | "Constitutional AI" + various | Safe agent behaviour |
| Tool-Use Evaluation | Paper | Berkeley / various | "ToolBench" arxiv.org/abs/2304.08354 | Benchmark for tool use |

### Agent Architecture Patterns
| Pattern | Description | Tools/Framework |
|---------|-------------|-----------------|
| ReAct Loop | Think → Act → Observe until done | LangGraph, plain Python |
| Plan-Execute | Create plan → Execute steps → Verify | LangGraph, LangChain |
| Supervisor | One agent routes tasks to worker agents | LangGraph, CrewAI |
| Debate | Multiple agents argue then vote final | AutoGen, custom |
| Reflection | Generate → Self-critique → Revise | LangGraph, custom |
| Orchestrator-Workers | Orchestrator delegates to specialist agents | LangGraph, custom |
| Tool Router | LLM routes to correct tool/skill | LangChain, MCP |
| Human-in-the-Loop | Agent pauses for human approve/override | LangGraph (interrupt) |

---

================================================================================
SECTION 9 — QUANTUM COMPUTING (Conceptual for now, start Year 2+)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Quantum Computing for Everyone | Book | Chris Bernhardt | Book (MIT Press) | No-math intro — start here |
| Qiskit Textbook | Course | IBM | learning.quantum.ibm.com/course/basics-qiskit | IBM's official quantum + Qiskit course |
| Quantum Computation & Information | Book | Nielsen & Chuang | "Mike and Ike" — the bible | PhD-level reference (skip for now) |
| Quantum ML with PennyLane | Course | Xanadu | pennylane.ai/qml | Quantum machine learning |
| Quantum Algorithm Zoo | Ref | Stephen Jordan (NIST) | quantumalgorithmzoo.org | Catalog of all quantum algorithms |
| IBM Quantum Learning Path | Course | IBM | learning.quantum.ibm.com | Structured curriculum |
| Quantum Advantage | Blog | Scott Aaronson | scottaaronson.blog | Realistic perspective on quantum |
| QML: Quantum Machine Learning | Blog | Pennylane blog | pennylane.ai/blog | Latest in quantum ML |
| Quantum + AI Hybrid Algorithms | Paper | Various | Search "Variational Quantum Eigensolver" | VQE, QAOA for optimisation |
| Quantum for Optimisation | Paper | Various | "QAOA" papers | Quantum for combinatorial optimisation |

### Advanced Quantum Topics (Year 3+)
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Quantum Error Correction | Paper | Various | Surface codes, Shor's code | Understanding noise + correction |
| Quantum Supremacy | Paper | Google / Sycamore | arxiv.org/abs/1910.11333 | Google's quantum advantage demo |
| Quantum + LLM (emerging) | Paper | Various (2024-25) | Search "quantum transformers" | Very early stage — monitor only |

### Reality Check on Quantum
- Do NOT spend significant time here before mastering all of Phase 1-3
- Quantum will not affect software jobs in next 5 years
- Allocate MAX 1 hour/month to stay conceptually aware
- Focus on: what problems quantum solves (optimisation, simulation, factoring)
- DO NOT learn: quantum circuit design in depth yet

---

================================================================================
SECTION 10 — AI + QUANTUM COMPUTING + AGENTS (Emerging, Year 3+)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Quantum + RL (Reinforcement) | Paper | Various | Search "quantum reinforcement learning" | Quantum for agent training optimisation |
| Variational Quantum Circuits | Paper | Various | "VQC for classification" papers | Quantum ML with shallow circuits |
| Quantum Optimisation for Agents | Paper | Various | "QAOA for agent planning" | Quantum planning for multi-agent |
| Hybrid Quantum-Classical Arch | Paper | IBM / Google | "Hybrid quantum-classical neural networks" | How quantum + classical connect |
| Quantum + NLP | Paper | Various | Search "quantum natural language processing" | Very early stage |

**ACTION:** Simply monitor this space. Read 1 paper per quarter starting Year 2. Do NOT invest learning time here for next 2 years.

---

================================================================================
SECTION 11 — ROBOTICS + AI
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| ROS2 Basics | Course | ROS2 Docs + tutorials | docs.ros.org/en/humble/Tutorials.html | Robot Operating System — foundational |
| ROS2 + Python | Guide | ROS2 community | Official ROS2 Python tutorials | Use Python for ROS2 nodes |
| RT-2 (Google Robotics) | Paper | Google DeepMind | "RT-2: Vision-Language-Action" | LLM for robot control |
| SayCan (Embedded Agents) | Paper | Google / EverydayRobot | "SayCan: Grounding LLMs in Robot Actions" | LLM + robot planning |
| PaLM-E (Embodied Multi-modal) | Paper | Google DeepMind | "PaLM-E: An Embodied Multimodal Lang Model" | LLMs with sensor data |
| VIMA (Multi-Modal Robots) | Paper | NVIDIA / Stanford | "VIMA: General Robot Manipulation" | Multi-modal robot learning |
| Robotics + LLM Survey | Paper | Various | "Large Language Models for Robotics Survey" | Comprehensive survey |
| ROS2 + AI Integration | Blog | Various | Search "ROS2 LLM integration" | Practical robot + AI tutorials |
| Simulation for Robotics | Tool | MuJoCo, Isaac Gym | Google MuJoCo + NVIDIA Isaac Sim | Train robots in simulation |
| NVIDIA Isaac Sim | Platform | NVIDIA | developer.nvidia.com/isaac-sim | Simulation + AI + robot training |
| MoveIt2 + LLM | Guide | MoveIt community | moveit.ai (tutorials) | Motion planning + LLM |

### Advanced Robotics Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Imitation Learning for Robotics | Paper | Various | "Behavior Cloning", "Diffusion Policy" | Learning from demonstration |
| Robot Task Planning with LLMs | Paper | Various | "LLM as task planner for robots" | High-level reasoning + low-level control |
| Human-Robot Interaction with LLMs | Paper | Various | Search "LLM human robot interaction" | Natural language robot commands |

### Reality Check on Robotics
- Niche field — far fewer jobs than pure AI/agent roles
- Only invest if you have genuine passion for robotics
- Singapore: some demand in manufacturing, logistics, port automation
- MAX 10% of your study time unless pivoting to robotics specifically

---

================================================================================
SECTION 12 — AI + ROBOTICS + AGENTS (Convergence)
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| ROS2 + LangGraph Integration | Blog | Community projects | Search "ROS2 LangGraph agent" | Agent orchestration for robots |
| Embodied AI Agents | Paper | Various | Search "embodied agents survey 2024" | AI agents in physical world |
| Robotics Foundation Models | Paper | Various | "RT-X", "Octo", "RFM" papers | Generalist robot models |
| Multi-Agent Robot Collaboration | Paper | Various | Search "multi-robot LLM coordination" | Multiple robots + AI agents |

**ACTION:** Monitor only. This is 3+ year horizon for mainstream.

---

================================================================================
SECTION 13 — PYTHON / FASTAPI / FLASK FOR AI
================================================================================

| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| Python Official Docs (3.12+) | Docs | Python Foundation | docs.python.org/3 | Async, generators, typing — source of truth |
| FastAPI Official Docs | Docs | Sebastián Ramírez | fastapi.tiangolo.com | THE best API framework docs — study thoroughly |
| FastAPI + SQLModel + Pydantic | Course | FastAPI | fastapi.tiangolo.com/learn | Full stack FastAPI patterns |
| Flask Mega Tutorial | Course | Miguel Grinberg | blog.miguelgrinberg.com/post/the-flask-mega-tutorial | Flask for fallback understanding |
| Real Python Tutorials | Course | Real Python | realpython.com | Python for AI/API — very practical |
| Python Async Programming | Blog | Various | "Python asyncio guide" | async/await for AI API performance |
| Pydantic V2 Deep Dive | Docs | Pydantic | docs.pydantic.dev/latest | Data validation for AI inputs/outputs |
| Python Type Hints Guide | Guide | Python + mypy | docs.python.org/3/library/typing.html | Type-safe AI codebases |

### Advanced Python/FastAPI Topics
| Resource | Type | Author/Source | URL | Why It Matters |
|----------|------|---------------|-----|----------------|
| FastAPI + Streaming Responses | Guide | FastAPI | fastapi.tiangolo.com/advanced/custom-response | SSE + streaming for LLM output |
| FastAPI + WebSocket | Guide | FastAPI | fastapi.tiangolo.com/advanced/websocket | Real-time agent communication |
| FastAPI + Dependency Injection | Guide | FastAPI | fastapi.tiangolo.com/tutorial/dependencies | Clean architecture for AI services |
| FastAPI Background Tasks | Guide | FastAPI | fastapi.tiangolo.com/tutorial/background | Async long-running AI tasks |
| FastAPI + OpenTelemetry | Guide | OpenTelemetry + FastAPI | opentelemetry.io/docs/languages/python/ | Observability for AI APIs |

### FastAPI Architecture Patterns for AI
| Pattern | Purpose | Implementation |
|---------|---------|----------------|
| AI Service Layer | Keep AI logic separate from routes | Service classes with DI |
| Streaming Chain | Stream LLM tokens to client | StreamingResponse + EventSource |
| Background Worker | Long-running AI tasks | FastAPI BackgroundTasks + Celery |
| Cached Vector Search | Cache retrieval results | Redis + pydantic models |
| API Gateway Router | Route to different AI models | Router + model registry |
| WebSocket Agent Chat | Real-time agent interaction | WebSocket + LangGraph stream |

---

================================================================================
SECTION 14 — SYSTEM DESIGN BLUEPRINTS (Full Architecture Patterns)
================================================================================

| Blueprint | Stack | When to Use |
|-----------|-------|-------------|
| Simple RAG API | FastAPI → LangChain → ChromaDB → LLM | Document Q&A, knowledge base |
| Multi-Agent Orchestrator | LangGraph (Supervisor) → Worker agents | Complex research, reports |
| Hybrid Search System | FastAPI → Qdrant(pgvector) → Reranker | E-commerce search, enterprise search |
| Agent + MCP Gateway | FastAPI → LangGraph → MCP server pool | Tool-using agents at scale |
| Document Pipeline | FastAPI → OCR → Chunk → Embed → Store | Document processing automation |
| Chat with Memory + Auth | FastAPI → LangGraph → Postgres(history) | Enterprise chat assistant |
| Model Gateway (Unified API) | FastAPI → Router → vLLM/OpenAI/Anthropic | Multi-model abstraction |
| Eval Pipeline | FastAPI → Ragas → LangSmith → Dashboard | Quality monitoring |
| Real-Time Agent | FastAPI → WebSocket → LangGraph stream | Interactive agent sessions |
| Banking/Govt AI Compliance | FastAPI → GuardRails → RAG → Audit log | Regulated industry AI |

### Architecture Principles to Follow
1. **Layer Separation** — API Layer → Service Layer → Model Layer → Data Layer
2. **Stateless Agents** — State in DB, not memory. Scale agents horizontally
3. **Circuit Breakers** — LLM calls fail, cache or degrade gracefully
4. **Cost Awareness** — Route simple queries to cheap models, complex to powerful
5. **Hybrid First** — Combine multiple retrieval methods, don't rely on one
6. **Evaluate Everything** — No deployment without eval metrics for that use case
7. **Guardrails at Gateway** — Input filter → Process → Output filter — never skip
8. **Stream by Default** — LLMs are slow, stream responses for UX
9. **Cache Aggressively** — Semantic cache, response cache, embedding cache
10. **Observability First** — Trace every LLM call, token, latency, cost

---

================================================================================
SECTION 15 — BEST BLOGS TO FOLLOW (Bookmark These)
================================================================================

| Blog | Author | Focus Area | URL |
|------|--------|-----------|-----|
| Lilian Weng's Blog | Lilian Weng (OpenAI) | LLMs, agents, RL | lilianweng.github.io |
| Sebastian Raschka's Blog | Sebastian Raschka | LLM internals, fine-tuning | sebastianraschka.com/blog |
| Chip Huyen's Blog | Chip Huyen | ML systems, production AI | huyenchip.com/blog |
| Anthropic Engineering Blog | Anthropic | Agents, safety, architecture | anthropic.com/engineering |
| LangChain Blog | LangChain team | LangChain, LangGraph patterns | blog.langchain.dev |
| LlamaIndex Blog | LlamaIndex team | RAG, data indexing | blog.llamaindex.ai |
| a16z AI Blog | Andreessen Horowitz | AI industry, architecture trends | a16z.com/ai |
| Google AI Blog | Google DeepMind | Research papers, new models | ai.googleblog.com |
| Meta AI Blog | Meta AI | LLMs (Llama), robotics | ai.meta.com/blog |
| HuggingFace Blog | HuggingFace | Transformers, open source ML | huggingface.co/blog |
| Stability AI Blog | Stability AI | Generative models | stability.ai/blog |
| Microsoft Research AI | Microsoft | AutoGen, agents, research | microsoft.com/research |
| NVIDIA Developer Blog | NVIDIA | Robotics, AI infra, CUDA | developer.nvidia.com/blog |
| IBM Quantum Blog | IBM | Quantum computing | ibm.com/quantum/blog |
| DeepMind Blog | Google DeepMind | Robotics, RL, multi-modal | deepmind.google/blog |
| The Gradient | Various | AI research explanations | thegradient.pub |
| Stratechery | Ben Thompson | AI business + strategy | stratechery.com |
| Simon Willison's Blog | Simon Willison | LLM practical, tools, prompt ops | simonwillison.net |

---

================================================================================
SECTION 16 — TOP PAPERS TO READ (Ordered by Priority)
================================================================================

| # | Paper | Venue/Year | Why Read | Time |
|---|-------|-----------|----------|------|
| 1 | Attention Is All You Need | NeurIPS 2017 | Foundation of all modern LLMs | 1 day |
| 2 | ReAct: Synergizing Reasoning and Acting in LLMs | ICLR 2023 | Foundation of all agents | 1 day |
| 3 | LLM Powered Autonomous Agents | Lilian Weng 2023 | Survey of agent architectures | 4 hrs |
| 4 | Retrieval-Augmented Gen (RAG) | Lewis et al. 2020 | Original RAG paper | 4 hrs |
| 5 | Training Language Models to Follow Instructions with Human Feedback (RLHF) | Meta 2023 (Toolformer) | Tool-use training | 4 hrs |
| 6 | Constitutional AI | Anthropic 2022 | AI safety, alignment | 4 hrs |
| 7 | GraphRAG: RAG on Knowledge Graphs | Microsoft 2024 | Advanced RAG with knowledge graph | 4 hrs |
| 8 | PaLM-E: Embodied Multimodal Language Model | Google 2023 | Robotics + LLM | 3 hrs |
| 9 | SWE-Agent | Princeton 2024 | Autonomous coding agent | 3 hrs |
| 10 | Generative Agents | Stanford 2023 | Human-like agent simulation | 3 hrs |
| 11 | RAPTOR: Recursive Abstractive Processing for RAG | Berkeley 2024 | Advanced RAG with hierarchies | 2 hrs |
| 12 | RT-2: Vision-Language-Action Model | Google 2023 | LLM for robot control | 3 hrs |
| 13 | Self-RAG | Asai et al. 2024 | On-demand retrieval | 2 hrs |
| 14 | FlashAttention | Tri Dao 2022 | Efficient attention mechanism | 3 hrs |
| 15 | Mistral MoE (Mixtral) | Mistral 2024 | Sparse mixture of experts | 2 hrs |

### Paper Reading Strategy
- **Month 1-2:** Papers 1-2 (foundations)
- **Month 3-4:** Papers 3-6 (agents + RAG + safety)
- **Month 5-6:** Papers 7-12 (advanced topics)
- **Month 7+:** Papers 13-15 (optimization + cutting edge)
- **Weekly cadence:** 1 paper per week, 30 min skim first, deep read if relevant


================================================================================
SECTION 17 — YOUTUBE CHANNELS (Visual Learning)
================================================================================

| Channel | Creator | Best For | Search |
|---------|---------|----------|--------|
| AI Engineering | Various | LangChain, RAG, Agents | "LangGraph tutorial" on channel |
| AssemblyAI | AssemblyAI | LLM internals, transformers | "LLM architecture explained" |
| Nicholas Renotte | Nicholas Renotte | AI project tutorials | "Build a RAG chatbot" |
| DeepLearning.AI | Andrew Ng | Shorts, Agents, LLMs | "AI Agent design patterns" |
| IBM Technology | IBM | Quantum, AI architecture | "Quantum computing explained" |
| Two Minute Papers | Károly Zsolnai | AI research simplified | Shorted AI paper explainers |
| CodeBullet | CodeBullet | AI agents, robotics (fun) | "AI agents playing games" |
| Singularity | Singularity | AI news, trends, robotics | "Latest AI robotics" |
| The AI Breakdown | NLW | AI news and analysis | Daily AI update |
| Stanford Online | Stanford | CS329A, AI lectures | "Stanford CS329A ML Systems" |
| MIT OpenCourseWare | MIT | Quantum, AI, algorithms | "MIT quantum computing" |

### YouTube Learning Strategy
- **Daily (15 min):** Two Minute Papers or AI Breakdown for news
- **Weekly (1 hr):** 1 full tutorial from DeepLearning.AI or AssemblyAI
- **Monthly (2 hrs):** 1 Stanford/MIT lecture for depth
- **Always:** Play at 1.5x speed, take notes, build along


================================================================================
SECTION 18 — FREE COURSES (Structured Learning)
================================================================================

| Course | Platform | Duration | Cost | Covers |
|--------|----------|----------|------|--------|
| Full Stack LLM Bootcamp | GitHub | 8 weeks | Free | LLMs, RAG, agents, deployment |
| LangChain Academy | LangChain | 5 hrs | Free | LangChain + LangGraph |
| FastAPI Official Tutorial | FastAPI | 3 hrs | Free | FastAPI from scratch |
| HuggingFace NLP Course | HuggingFace | 10 hrs | Free | Transformers, fine-tuning |
| Stanford CS329A ML Systems | Stanford/YouTube | Sem | Free | ML system design |
| IBM Quantum Learning Path | IBM | 10 hrs | Free | Quantum computing basics |
| ROS2 Basics Tutorials | ROS2 Docs | 5 hrs | Free | ROS2 for robotics |
| Qiskit Textbook | IBM | 20 hrs | Free | Quantum with Python |
| Stanford CS224N (NLP) | Stanford/YouTube | Sem | Free | NLP with deep learning |
| MIT 6.S191 (Intro to Deep L.) | MIT/YouTube | 4 hrs | Free | Deep learning fundamentals |
| Chip Huyen's ML Systems | Online (notes) | Self | Free | Production ML architecture |
| Google ML Education | Google | 15 hrs | Free | ML fundamentals + advanced |
| DeepLearning.AI Short Courses | DeepLearning.AI | 1-2 hrs | Free/Paid | Agents, RAG, LangChain, Fine-tune |

### Course Priority Order
1. **LangChain Academy** (Week 1-2) — Free, fast, directly applicable
2. **FastAPI Tutorial** (Week 1) — Foundation for all projects
3. **HuggingFace NLP** (Week 3-4) — Transformers understanding
4. **Full Stack LLM Bootcamp** (Month 2-3) — End-to-end development
5. **Stanford CS329A** (Month 4+) — Architecture thinking
6. **IBM Quantum** (Year 2) — Only after mastering Phase 1-3


================================================================================
SECTION 19 — BUILD THESE TO MASTER ARCHITECTURE THINKING
================================================================================

| # | Project | Architecture Skill | Tech Stack |
|---|---------|-------------------|------------|
| 1 | Multi-Tenant RAG API | Horizontal scaling, isolation | FastAPI + Qdrant + LangChain |
| 2 | Agent System with MCP Tools | MCP server design, tool integration | LangGraph + MCP servers + FastAPI |
| 3 | AI API Gateway (Model Router) | Routing, fallback, circuit breaker | FastAPI + Redis + vLLM + OpenAI |
| 4 | Real-Time Agent Chat | WebSocket, streaming, state management | FastAPI WS + LangGraph + Postgres |
| 5 | Enterprise Document Pipeline | Pipeline architecture, async queue | FastAPI + Celery + RAG + OCR |
| 6 | Eval + Monitoring Dashboard | Observability, metrics, tracing | Ragas + Prometheus + LangSmith |
| 7 | Guardrail System | Security architecture, content filter | FastAPI + Guardrails + PII mask |
| 8 | Hybrid Search Service | Multi-strategy retrieval, re-ranking | Qdrant + Reranker + FastAPI |
| 9 | Multi-Agent Research Team | Supervisor pattern, parallel execution | LangGraph + CrewAI + LLMs |
| 10 | AI + Database (Text-to-SQL) | NL to structured query, safety | LangChain + SQL DB + Guardrails |

### Architecture Project Strategy
- **Projects 1-3:** Build in Phase 1-2 (foundation)
- **Projects 4-6:** Build in Phase 2-3 (intermediate)
- **Projects 7-10:** Build in Phase 3 (advanced)
- **Each project must have:** README, architecture diagram, tests, deployment


================================================================================
SECTION 20 — ARCHITECTURE DECISION FRAMEWORKS (When to Use What)
================================================================================

| Decision | Option A | Option B | Decision Rule |
|----------|----------|----------|---------------|
| RAG vs Fine-tune | RAG (dynamic data) | Fine-tune (fixed knowl) | If data changes daily → RAG. Fixed style → FT |
| Small vs Large LLM | 3B-8B model (cheap) | 70B+ model (expensive) | Task complexity: simple→small, complex→large |
| LangGraph vs CrewAI | LangGraph (custom flw) | CrewAI (predefined) | Need custom graph → LangGraph. Quick → CrewAI |
| ChromaDB vs Qdrant vs pgvector | ChromaDB (dev, local) | Qdrant (prod at scale) | Scale: small → Chroma, med → pgvec, big → Qdr |
| Sync vs Streaming API | Sync (simple) | Streaming (UX quality) | If response > 3s → stream. Else → sync |
| Monolith vs Microservices AI | Monolith (start) | Microservices (scale) | <3 services → mono. >5 → micro |
| Single Agent vs Multi-Agent | Single (simple tasks) | Multi (complex collab) | Needs 1 tool → single. Needs coordination → multi |
| Embedding: local vs API | sentence-transformers | OpenAI/text-embedding3 | Data privacy → local. Budget allows → API |
| Stateless vs Stateful Agents | Stateless (scale) | Stateful (UX) | Need conversation → stateful. Else → stateless |
| Human-in-Loop vs Auto | HITL (safety) | Auto (speed) | High risk → HITL. Low risk → auto |

### Decision Framework Usage
- **When starting a project:** Check this table before every architecture choice
- **When reviewing code:** Ask "did we make the right tradeoff here?"
- **When interviewing:** These are the exact questions interviewers ask
- **When mentoring:** Teach junior engineers to use these frameworks


================================================================================
SUMMARY — Your Learning Priority
================================================================================

| Rank | Area | 6-mo Goal | Time Budget |
|------|------|-----------|-------------|
| 1 | LangGraph | Build 5 graph architectures | 20% of total time |
| 2 | RAG + Vectordb | Build 3 RAG variants | 15% of total time |
| 3 | FastAPI + Python | Production APIs with streaming | 15% of total time |
| 4 | MCP | Build 2 MCP servers + integrate | 10% of total time |
| 5 | Multi-Agent | Build supervisor + team patterns | 15% of total time |
| 6 | LLMs | Deep understanding + prompting | 10% of total time |
| 7 | System Design | Study 10 architecture patterns | 10% of total time |
| 8 | Devops + Eval | CI/CD + monitoring + testing | 5% of total time |
| 9 | Robotics | Monitor only (ROS2 basics) | 0% (skip for now) |
| 10 | Quantum | 1 blog/month | 0% (skip for now) |

### 6-Month Milestone Check
- [ ] Month 1: FastAPI + Python comfortable, first RAG bot deployed
- [ ] Month 2: LangGraph basics, 2 graph architectures built
- [ ] Month 3: Multi-agent system, MCP integration, advanced RAG
- [ ] Month 4: Docker + vLLM serving, Spring AI bridge
- [ ] Month 5: LLMOps + evals, security, monitoring
- [ ] Month 6: 5 projects on GitHub, mock interview ready


---

================================================================================
APPENDIX — QUICK REFERENCE CARDS
================================================================================

### Card 1: When to Use RAG vs Fine-Tuning
| Use RAG When | Use Fine-Tuning When |
|-------------|---------------------|
| Knowledge changes frequently | Fixed domain knowledge |
| Need source attribution | Need specific output format |
| Want zero training cost | Have labeled training data |
| Domain is broad | Domain is narrow/specialized |
| Real-time data needed | Consistent behavior needed |

### Card 2: Agent Framework Decision Tree
```
Do you need fine-grained state control?
├── YES → LangGraph
└── NO → Do you need role-based teams?
    ├── YES → CrewAI
    └── NO → Do you need agent conversations?
        ├── YES → AutoGen
        └── NO → Do you need simple tool calling?
            ├── YES → LangChain (plain)
            └── NO → LangGraph (safest default)
```

### Card 3: Model Selection Guide
| Task | Recommended Model | Cost |
|------|------------------|------|
| Simple classification | llama3.2 (local) or gpt-4o-mini | Free / Low |
| RAG Q&A | gpt-4o or claude-sonnet | Medium |
| Complex reasoning | o3 or claude-opus | High |
| Code generation | gpt-4o or codestral | Medium |
| Creative writing | gpt-4o or claude-sonnet | Medium |
| Embedded (edge) | phi-3-mini or gemma-2b | Free |

### Card 4: Singapore AI Compliance Quick Ref
| Regulation | Scope | Your Action |
|-----------|-------|-------------|
| PDPA | All PII handling | Mask PII in logs, consent for data collection |
| IM8 | Government IT security | Audit trails, access control, encryption |
| MAS Guidelines | Financial services | Model risk management, explainability |
| Healthcare Act | Medical AI | Clinical validation, data residency |
| Cybersecurity Act | Critical infrastructure | Incident reporting, security audits |
