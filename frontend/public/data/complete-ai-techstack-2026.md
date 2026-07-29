================================================================================================================
                                        COMPLETE AI TECH STACK 2026 — MASTER REFERENCE
================================================================================================================
                                        LLM PROVIDERS / MODEL APIS
================================================================================================================

| Category                | Providers                                                                                   |
|-------------------------|---------------------------------------------------------------------------------------------|
| Frontier OpenAI         | GPT-4.1, o3, o4-mini, GPT-4o                                                               |
| Frontier Anthropic      | Claude Sonnet 4.6, Opus 4.7, Haiku 4.5                                                      |
| Frontier Google         | Gemini 2.5 Pro, Gemini 2.5 Flash                                                            |
| Frontier Meta           | Llama 4 (Scout, Maverick, Behemoth)                                                         |
| Open-weight Meta        | Llama 4, Llama 3.3                                                                          |
| Open-weight Mistral     | Mistral Large 3, Mistral Small 3, Pixtral                                                    |
| Open-weight DeepSeek    | DeepSeek V4, DeepSeek R2, DeepSeek Coder V3                                                  |
| Open-weight Alibaba     | Qwen 3, Qwen 3 Coder, Qwen 3 VL                                                              |
| Open-weight Microsoft   | Phi-4, Phi-4-mini, Phi-4-vision                                                              |
| Open-weight Databricks  | DBRX, DBRX Instruct                                                                          |
| Open-weight Google      | Gemma 3, Gemma 3 Pali                                                                        |
| Open-weight TII         | Falcon 3                                                                                     |
| Open-weight 01.AI       | Yi-VL, Yi-Lightning                                                                          |
| Routing / Aggregators   | OpenRouter (200+ models), Together AI, Fireworks AI, Groq, DeepInfra, Replicate, Anyscale, Novita AI |
| Cloud ML Platforms      | AWS Bedrock, GCP Vertex AI, Azure AI Studio, Anthropic Foundry, NVIDIA NIM, IBM watsonx, Oracle OCI AI |
| Local Inference         | Ollama, LM Studio, vLLM, llama.cpp, Jan, LocalAI, GPT4All, LMFlow                            |
| Code-Specialized        | GitHub Copilot (GPT-4.1/Claude), Cursor (Sonnet 4.6), CodeGemma, DeepSeek Coder V3, StarCoder 3, Code Llama |
| Small Language Models   | Phi-3.5, Gemma 3, Llama 3.2, H2O-Danube, SmolLM, TinyLlama, MobileLLM                        |

================================================================================================================
                                        AGENT FRAMEWORKS
================================================================================================================

| Framework              | Creator              | Architecture                                               | Graph-Based? | Multi-Agent? | HIL? |
|------------------------|----------------------|------------------------------------------------------------|-------------|-------------|------|
| LangChain / LangGraph  | LangChain            | Graph-based state machines, checkpointing, persistent state | Yes         | Yes         | Yes  |
| CrewAI                 | CrewAI               | Role-based multi-agent, sequential/parallel/hierarchical    | No          | Yes         | Yes  |
| AutoGen (AG2)          | Microsoft Research   | Conversational multi-agent, actor model v0.4, Azure-tuned   | No          | Yes         | Yes  |
| Semantic Kernel        | Microsoft            | .NET/TypeScript, planner, plugin ecosystem, enterprise      | No          | Yes         | Yes  |
| LlamaIndex             | LlamaIndex           | RAG-first, knowledge graphs, data-centric agents            | No          | Yes         | Partial |
| OpenAI Agents SDK      | OpenAI               | Lightweight, handoffs, guardrails, tracing                  | No          | Yes         | Yes  |
| Claude Agent SDK       | Anthropic            | MCP-native, tool use, computer use, extended thinking       | No          | No          | No   |
| DSPy                   | Stanford             | Programmatic compiler, auto-prompt optimization             | No          | No          | No   |
| Pydantic AI            | Pydantic             | Type-safe agents, structured outputs, Logfire observability | No          | No          | No   |
| Haystack               | deepset              | NLP pipelines, RAG, eval tooling, document processing       | No          | No          | No   |
| Smolagents             | HuggingFace          | Lightweight code-agents, HF model integration               | No          | Yes         | No   |
| Camel                  | CAMEL-AI             | Role-playing multi-agent, society of mind, research-focused | No          | Yes         | No   |
| Agency                 | Agency               | Decentralized agent swarms, P2P communication               | No          | Yes         | No   |
| Temporal + AI          | Temporal             | Durable execution, long-running agent workflows, retries    | Yes         | Yes         | Yes  |
| TaskWeaver             | Microsoft            | Code-first agent, plugin-based, stateful conversation       | No          | No          | No   |
| Adept (ACT-2)          | Adept                | Computer use, GUI agent, end-to-end                         | No          | No          | No   |

================================================================================================================
                                        MCP PROTOCOL & TOOL ECOSYSTEM
================================================================================================================

| Layer                    | Details                                                                                    |
|--------------------------|--------------------------------------------------------------------------------------------|
| Protocol                 | Model Context Protocol (MCP) — Linux Foundation governed, JSON-RPC 2.0 over stdio/SSE/WebSocket |
| Complement Protocols     | Google A2A (Agent-to-Agent), OpenAI Function Calling, Anthropic Tool Use                    |
| MCP Hosts                | Claude Desktop, Cursor, Windsurf, VS Code, GitHub Copilot, ChatGPT, JetBrains, Zed, Continue.dev |
| First-Party MCP Servers  | Filesystem, GitHub, GitLab, PostgreSQL, SQLite, Slack, Notion, Google Drive, Gmail, Puppeteer, Playwright, Brave Search, Docker, Kubernetes, Sentry, PagerDuty, Jira, Linear, Figma, Memory, Vector DB, AWS, GCP, Azure, Airtable, Salesforce, Stripe, HubSpot |
| Community MCP Servers    | 8000+ servers across Smithery, OpenTools, mcpsvr, GitHub MCP registry, MCP.so, PulseMCP   |
| MCP Developer Tools      | MCP Inspector, MCP Proxy, MCP Gateway, MCP Tunnel, MCP Client SDK (Python/TS/Java/Kotlin), MCP Server Scaffolding |
| MCP Stats (2026)         | 97M+ monthly SDK downloads, 16K+ valid projects, 8K+ servers, 350+ clients                |

================================================================================================================
                                        AI OBSERVABILITY & MONITORING
================================================================================================================

| Category                 | Tools                                                                                     |
|--------------------------|-------------------------------------------------------------------------------------------|
| LLM-native Observability | LangSmith, Langfuse, Arize Phoenix, MLflow, Helicone, Braintrust, AgentOps, Maxim AI, Logfire (Pydantic), OpenLIT, Lunary, Traceloop, Galileo, Highlight.io |
| APM-converged AI Obs     | Datadog LLM Observability, New Relic AI Monitoring, Grafana + OpenLLMetry, Elastic Observability AI, Dynatrace AI, Splunk AI, SigNoz |
| Open Source              | Arize Phoenix, Langfuse (self-host), MLflow, OpenLIT, OpenLLMetry, OpenInference, Traceloop, Helix |
| Eval Platforms           | RAGAS, DeepEval, Confident AI, Galileo Evaluate, Arthur AI, Giskard, Kolena, EvalCrafter, TruLens |
| Trace-specific           | LangSmith traces, Arize Phoenix traces, Langfuse traces, MLflow traces, OpenTelemetry + OpenLLMetry |

================================================================================================================
                                        AI SECURITY & GUARDRAILS
================================================================================================================

| Category                    | Tools                                                                                     |
|-----------------------------|-------------------------------------------------------------------------------------------|
| Guardrails Frameworks       | Guardrails AI, NVIDIA NeMo Guardrails, Azure AI Content Safety, Galileo Guardrails, Lakera Guard, Prompt Security, Guardrails Hub |
| LLM Firewalls               | Akamai Firewall for AI, Cloudflare AI Gateway, Microsoft SSE AI Gateway, Portkey AI Gateway, Rebuff, ZenGuard AI, AI Security (AIShield) |
| Red Teaming & Pen Testing   | Garak, PyRIT (Microsoft), Giskard LLM Scan, LangChain Red Teaming, Adversa AI, Promptfoo, LLM Red Team (Anthropic) |
| PII / Data Leakage          | Private AI, Skyflow, Nightfall AI, BigID, Microsoft Purview AI Hub, Tonic AI, Gretel      |
| Prompt Injection Detection  | Protect AI, Lakera Guard API, Rebuff, ZenGuard, Prompt Injection Detection (HuggingFace), Guardrails AI input check |
| Standards & Frameworks      | OWASP LLM Top 10, OWASP Agentic AI Threats & Mitigations, NIST AI RMF, EU AI Act, ISO 42001, Singapore AI Verify, Singapore PDPA / IM8 |

================================================================================================================
                                        VECTOR DATABASES
================================================================================================================

| Database        | Language     | License        | Self-Host | Managed                    | Hybrid Search        | GPU Indexing | Max Scale  |
|-----------------|-------------|----------------|----------|----------------------------|----------------------|-------------|------------|
| Pinecone        | Proprietary | Proprietary    | BYOC preview | Pinecone Serverless         | Yes (sparse+dense)   | No          | Billions   |
| Qdrant          | Rust        | Apache 2.0     | Yes       | Qdrant Cloud                | Yes (sparse vectors) | Yes (HNSW)  | 100M+      |
| Weaviate        | Go          | BSD-3          | Yes       | Weaviate Cloud              | Yes (BM25+vector)    | No          | 100M+      |
| Milvus          | Go/C++      | Apache 2.0     | Yes       | Zilliz Cloud                | Yes                  | Yes (CAGRA) | 10B+       |
| Chroma          | Python      | Apache 2.0     | Yes       | Chroma Cloud                | Limited              | No          | 10M+       |
| pgvector        | C (PG ext)  | PostgreSQL     | Yes       | Any PG host (Supabase etc.) | Via pg_bm25          | No          | 100M+      |
| Elasticsearch   | Java        | Elastic License| Yes       | Elastic Cloud               | Yes (kNN+BM25)       | No          | Billions   |
| Vespa           | Java        | Apache 2.0     | Yes       | Vespa Cloud                 | Yes                  | Yes         | Billions   |
| LanceDB         | Rust        | Apache 2.0     | Yes       | LanceDB Cloud               | Yes                  | No          | 100M+      |
| Vald            | Go          | Apache 2.0     | Yes       | Vald Cloud                  | No                   | No          | Billions   |
| Typesense       | C++         | GPLv3          | Yes       | Typesense Cloud             | Yes                  | No          | 10M+       |
| Redis Stack     | C           | Redis          | Yes       | Redis Cloud                 | Yes                  | No          | 10M+       |
| MongoDB Atlas   | C++         | SSPL           | No        | MongoDB Atlas               | Yes                  | No          | Billions   |
| Neo4j           | Java        | GPL/Commons    | Yes       | Neo4j AuraDB                | Yes (graph+vector)   | No          | 100M+      |
| OpenSearch      | Java        | Apache 2.0     | Yes       | AWS OpenSearch              | Yes                  | No          | Billions   |

================================================================================================================
                                        EMBEDDING MODELS
================================================================================================================

| Provider       | Models                         | Dimensions  | Max Tokens | Type             |
|----------------|--------------------------------|------------|------------|------------------|
| OpenAI         | text-embedding-3-large         | 3072       | 8192       | Dense            |
| OpenAI         | text-embedding-3-small         | 1536       | 8192       | Dense            |
| Cohere         | embed-english-v3.0             | 1024       | 512        | Dense            |
| Cohere         | embed-multilingual-v3.0        | 1024       | 512        | Dense            |
| Google         | text-embedding-004             | 768        | 2048       | Dense            |
| Google         | multimodalembedding            | 1408       | 2048       | Multimodal       |
| Voyage         | voyage-3                       | 1024       | 32000      | Dense            |
| Voyage         | voyage-3-lite                  | 768        | 32000      | Dense            |
| Voyage         | voyage-code-3                  | 1536       | 32000      | Code-optimized   |
| Jina           | jina-embeddings-v3             | 1024       | 8192       | Dense            |
| Jina           | jina-colbert-v2                | 128/chunk  | 8192       | Late interaction |
| BAAI           | bge-large-en-v1.5              | 1024       | 512        | Dense            |
| BAAI           | bge-m3                         | 1024       | 8192       | Multi-lingual    |
| BAAI           | bge-reranker-v2-m3             | N/A        | 8192       | Cross-encoder    |
| intfloat       | e5-mistral-7b-instruct         | 4096       | 32768      | Dense            |
| mixedbread-ai  | mxbai-embed-large-v1           | 1024       | 512        | Dense            |
| Nomic          | nomic-embed-text-v2            | 768        | 8192       | Dense+Matryoshka |
| Nomic          | nomic-embed-vision-v2          | 768        | N/A        | Vision+Text      |
| Amazon         | Titan Embeddings v2            | 256/512/1024 | 8000      | Dense            |
| Meta           | Llama 4 embedding              | 4096       | N/A        | Interleaved      |
| sentence-transformers | all-MiniLM-L6-v2        | 384        | 256        | Lightweight      |

================================================================================================================
                                        RAG STACK
================================================================================================================

| Component                    | Tools                                                                                      |
|------------------------------|--------------------------------------------------------------------------------------------|
| Document Ingestion & Parsing | Unstructured, LlamaParse, Docling, Azure Document Intelligence, Google Document AI, Marker, PyMuPDF4LLM, pdfminer, pypdf, pdfplumber |
| OCR & Document Extraction    | Tesseract, Azure OCR, Google Cloud Vision, Amazon Textract, PaddleOCR, Surya OCR, Marker    |
| Chunking Strategies          | LangChain text splitters, LlamaIndex node parsers, Semchunk, Jina segmenter, recursive character splitter, semantic chunker |
| Retrieval Methods            | Hybrid (dense vector + BM25/sparse), SPLADE sparse vectors, ColBERTv2 late interaction, ColPali vision retrieval, Dense Passage Retrieval (DPR) |
| Cross-Encoder Rerankers      | Cohere Rerank v3, BAAI bge-reranker-v2, Jina Reranker, Voyage Rerank, mixedbread-ai reranker, ms-marco-MiniLM-L-12-v2 |
| Fusion Methods               | Reciprocal Rank Fusion (RRF), weighted fusion, DenseFusion, rank fusion LM                |
| Graph RAG                    | Microsoft GraphRAG, LightRAG, Neo4j + GraphRAG, NebulaGraph + LLM, FalkorDB, Kùzu + GraphRAG |
| Agentic RAG Patterns         | Self-RAG, Corrective RAG (CRAG), Adaptive RAG, RAPTOR (tree summarization), HyDE (hypothetical docs), FLARE |
| Advanced RAG                 | Contextual Retrieval (Anthropic), ColBERTv2, ColPali, Late Chunking, Late Interaction, RAPTOR, CRAG, Self-RAG |
| Evaluation                   | RAGAS, DeepEval, TruLens, ARES, RECALL, RGB (RAG Benchmark), RAGChecker                   |

================================================================================================================
                                        AI GATEWAYS & PROXY LAYERS
================================================================================================================

| Tool                 | Caching | Routing | Rate Limit | Fallback | Guardrails | Observability | Open Source |
|----------------------|---------|---------|-----------|----------|-----------|--------------|-------------|
| Portkey              | Yes     | Yes     | Yes       | Yes      | Yes       | Yes          | No          |
| Helicone             | Yes     | No      | No        | No       | No        | Yes          | Yes         |
| Cloudflare AI Gateway| Yes     | Yes     | Yes       | Yes      | Yes       | Yes          | No          |
| Azure API Mgmt AI    | Yes     | Yes     | Yes       | Yes      | Yes       | Yes          | No          |
| AWS Bedrock Gateway  | No      | Yes     | Yes       | Yes      | Yes       | Yes          | No          |
| Kong AI Gateway      | Yes     | Yes     | Yes       | Yes      | Yes       | Yes          | Yes         |
| Envoy AI Filter      | No      | Yes     | No        | No       | No        | Yes          | Yes         |
| Zuplo                | Yes     | Yes     | Yes       | Yes      | No        | Yes          | No          |
| Apache APISIX AI     | Yes     | Yes     | Yes       | No       | No        | Yes          | Yes         |

================================================================================================================
                                        PROMPT ENGINEERING & MANAGEMENT
================================================================================================================

| Tool              | Purpose                                                 | Open Source | Cloud             |
|-------------------|---------------------------------------------------------|-------------|-------------------|
| LangSmith Hub     | Prompt versioning, playground, A/B testing, datasets    | No          | Yes               |
| Langfuse          | Prompt management, versioning, production prompts       | Yes         | Yes + Self-host   |
| Agenta            | Open-source prompt management, eval, variation experiments | Yes       | No                |
| PromptLayer       | Logging, analytics, prompt registry, cost tracking      | No          | Yes               |
| Promptfoo         | Red teaming, eval, CI integration, security testing     | Yes         | No                |
| HumanLoop         | Prompt monitoring, templates, collaboration             | No          | Yes               |
| Vellum            | Prompt engineering, evals, workflow builder, model comparison | No     | Yes               |
| Spellbook (Scale) | Prompt IDE, RLHF datasets, human feedback               | No          | Yes               |
| DSPy              | Automatic prompt optimization (compiler-based)          | Yes         | No                |
| Flowise           | Visual prompt builder, low-code RAG, agent flow         | Yes         | No                |

================================================================================================================
                                        SPEECH / AUDIO / VIDEO AI
================================================================================================================

| Category             | Tools                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------|
| Speech-to-Text (STT) | OpenAI Whisper (local + API), AssemblyAI (diarization), Deepgram (Nova-3), Google Cloud STT, Azure Speech, Rev AI, Speechmatics, Meta SeamlessM4T |
| Text-to-Speech (TTS) | ElevenLabs, OpenAI TTS (tts-1), Cartesia, Google TTS, Azure TTS (Neural), Amazon Polly, Bark (Suno), Coqui TTS, Meta Voicebox |
| Voice Cloning        | ElevenLabs Voice Lab, Respeecher, PlayHT, RVC (Retrieval-based Voice Conversion), Fish Audio, OpenVoice |
| Music Generation     | Suno v4, Udio, Meta MusicGen, Stable Audio 2, Riffusion, SoundRaw                         |
| Video Generation     | OpenAI Sora, Runway Gen-4, Pika 2.0, Synthesia (avatars), HeyGen (avatars), Kling 2.0, Luma Dream Machine, Stable Video Diffusion, Vidu, Hailuo, Veo 2 (Google), Meta Movie Gen |
| Audio Diarization    | AssemblyAI, Deepgram, PyAnnote Audio, NVIDIA NeMo diarization, WhisperX                   |

================================================================================================================
                                        IMAGE / VISION AI
================================================================================================================

| Category                       | Tools                                                                                     |
|--------------------------------|-------------------------------------------------------------------------------------------|
| Image Generation               | DALL-E 3, Midjourney v7, Stable Diffusion 3.5 / SDXL, Flux (Black Forest Labs), Adobe Firefly 3, Ideogram 3, Imagen 3 (Google), Leonardo AI, Recraft, ComfyUI, Automatic1111 |
| Vision / Multimodal            | GPT-4o Vision, Claude 3.5/4 Sonnet Vision, Gemini 2.5 Pro Vision, Llama 4 Vision, Qwen-VL, Pixtral (Mistral), CogVLM, Kosmos-2 |
| Object Detection / Segmentation| YOLOv12 / YOLO-World, SAM 2 / SAM 2.1 (Meta), DINOv2 / Grounding DINO, Mask R-CNN, Detrex, mmdetection |
| OCR                            | Tesseract 5, Azure Document Intelligence, Google Document AI, Amazon Textract, PaddleOCR, Surya, Marker, EasyOCR |
| Computer Vision Libraries      | OpenCV, Pillow, scikit-image, Albumentations, Kornia, Detectron2, MMDetection, MMOCR     |
| 3D Generation                  | Meshy, Luma AI, Rodin (Meta), Point-E/Shap-E (OpenAI), TripoSR, Zero-1-to-3, NeRF/Gaussian Splatting |
| Image Editing / Inpainting     | DALL-E 3 editing, Stable Diffusion Inpainting, InstructPix2Pix, ClipDrop, Remove.bg, Lama Cleaner, Firefly Generative Fill |

================================================================================================================
                                        DATA / ETL / PIPELINES
================================================================================================================

| Category                      | Tools                                                                                     |
|-------------------------------|-------------------------------------------------------------------------------------------|
| ETL for AI / Unstructured Data| Unstructured, LlamaParse, Airbyte, Fivetran, dbt, Melusine (govtech), Mage.ai, Prefect, Dagster, Bytewax, Pathway |
| Feature Stores                | Feast, Tecton, Hopsworks, SageMaker Feature Store, Azure Feature Store, Databricks Feature Store |
| Data Processing Engines       | Apache Spark, Apache Flink, Pandas, Polars, DuckDB, Dask, Ray, Modin, cuDF               |
| Synthetic Data Generation     | Mostly AI, Gretel AI, Tonic AI, Syntho, Haize Labs, YData, Datagen, MDClone              |
| Vector Pipelines              | Unstructured + Chroma, LlamaIndex ingestion, LangChain document loaders, Airbyte + vector sync |

================================================================================================================
                                        FINE-TUNING & MODEL CUSTOMIZATION
================================================================================================================

| Tool                  | Method              | Speedup | Memory Reduction | Models Supported                      |
|-----------------------|---------------------|---------|-----------------|---------------------------------------|
| Unsloth               | QLoRA/LoRA/GRPO     | 2x      | 50-80%          | Llama 4, Mistral, Qwen 3, Phi-4, Gemma 3, DeepSeek |
| Axolotl               | Full/LoRA/QLoRA     | 1x      | Depends         | 100+ HuggingFace models              |
| LLaMA-Factory         | LoRA/QLoRA/Full/DPO/GRPO | 1x | Depends         | 100+ models                          |
| HuggingFace PEFT      | LoRA/QAoRA/AdaLoRA/Prompt | 1x | 50-90%          | All HF models                        |
| HuggingFace TRL       | RLHF/DPO/GRPO/PPO/ORPO | N/A   | N/A             | All HF models                        |
| Together Fine-tuning  | Managed LoRA/Full   | 1x      | N/A             | Together catalog                     |
| Fireworks Fine-tuning | Managed LoRA        | Fast    | N/A             | Fireworks catalog                    |
| OpenPipe              | Fine-tune from prod | 1x      | N/A             | OpenAI-compatible                    |
| Modal                 | Cloud fine-tuning infra | N/A | N/A             | Any                                  |
| LitGPT (Lightning)    | LoRA/QLoRA/Adapter  | 1x      | N/A             | 20+ models                           |

================================================================================================================
                                        MLOPS / LLMOPS PLATFORMS
================================================================================================================

| Platform         | Experiment Track | Model Registry | Eval | Observability | Deployment | Open Source |
|------------------|-----------------|---------------|------|--------------|-----------|------------|
| MLflow           | Yes             | Yes           | Yes  | Yes          | Yes       | Yes        |
| Weights & Biases | Yes             | Yes           | Weave| Weave        | No        | No         |
| Neptune          | Yes             | Yes           | No   | Yes          | No        | No         |
| Comet            | Yes             | Yes           | Yes  | Yes          | No        | No         |
| Valohai          | Yes             | Yes           | No   | No           | Yes       | No         |
| SageMaker        | Yes             | Yes           | Yes  | Yes          | Yes       | No         |
| Vertex AI        | Yes             | Yes           | Yes  | Yes          | Yes       | No         |
| Azure ML         | Yes             | Yes           | Yes  | Yes          | Yes       | No         |
| TrueFoundry      | No              | Yes           | No   | Yes          | Yes       | No         |
| DagsHub          | Yes             | Yes           | No   | No           | No        | Yes        |
| ZenML            | Yes             | Yes           | Yes  | No           | Yes       | Yes        |
| Kubeflow         | Yes             | Yes           | No   | No           | Yes       | Yes        |
| BentoML          | No              | Yes           | No   | No           | Yes       | Yes        |
| MLRun            | Yes             | Yes           | No   | No           | Yes       | Yes        |

================================================================================================================
                                        AI AGENT-SPECIFIC INFRASTRUCTURE
================================================================================================================

| Category                       | Tools                                                                                     |
|--------------------------------|-------------------------------------------------------------------------------------------|
| Human-in-the-Loop              | LangGraph Cloud (checkpoints/approvals), HumanLayer, Scale Spellbook, Labelbox, Amazon A2I, Vellum (approval steps) |
| Agent Testing & Benchmarks     | Promptfoo, Chain Benchmark, AgentBench, GAIA, SWE-bench, WebArena, AgentEval, ToolBench, APPS, HumanEval, MBPP, EvoEval |
| Agent Memory Systems           | LangGraph checkpoint (Postgres/MongoDB), MemGPT / Letta, Zep, Motif, Graphiti (NVIDIA), Mem0, R2E |
| Agent-to-Agent Protocols       | Google A2A (Agent-to-Agent), MCP (tool), AutoGen agent chat, ADK (Agent Development Kit), AgentConnect |
| Agent Marketplaces / Stores    | Salesforce AgentExchange (14K apps/agents), OpenAI GPT Store, Claude MCP Directory, Smithery (MCP marketplace), Agent.ai, Mintlify Agent Directory |
| Agent Evaluation Frameworks    | DeepEval, RAGAS, TruLens, AgentOps, Galileo Evaluate, Arthur AI, Kolena               |
| Agent Orchestration Platforms  | Temporal + AI (durable execution), Prefect + AI, Airflow + AI (dag-factory), LangGraph Cloud, AutoGen |
| Agent Safety & Alignment       | Anthropic Constitution AI, OpenAI Safety Spec, DeepMind SPICE, Alignment Lab, Giskard, Guardrails AI |

================================================================================================================
                                        INFRASTRUCTURE & COMPUTE
================================================================================================================

| Category                     | Options                                                                                    |
|------------------------------|--------------------------------------------------------------------------------------------|
| GPU Cloud Providers          | AWS (P5/P4/P3), GCP (A3/A2), Azure (ND H100), Lambda Labs, RunPod, Vast.ai, CoreWeave, Paperspace, JarvisLabs, SaladCloud, TensorDock, DataCrunch, Nebius AI |
| Inference Optimization       | vLLM, TGI (HuggingFace Text Generation Inference), TensorRT-LLM (NVIDIA), ONNX Runtime, llama.cpp (CPU-optimized), Triton Inference Server, BentoML, OpenVINO (Intel), MLC-LLM, Candle (Rust) |
| GPU Scheduling / Orchestration | Kubernetes + Kueue (scheduling), Ray Serve, Volcano (batch), Slurm (HPC), Run:ai, Nemo Run, Hopsworks, Grid.ai |
| Serverless GPU               | Modal, Banan, Beam, Replicate, fal.ai, Together Inference, Fireworks Inference, Syzypod    |
| Edge Inference Hardware      | Apple Neural Engine (MLX), CoreML, ONNX Runtime Mobile, Qualcomm Hexagon NPU, Samsung Exynos NPU, Google TPU Edge, MediaPipe, TensorFlow Lite, ExecuTorch, OpenVINO |
| Training Infrastructure      | NVIDIA DGX, AWS Trainium, GCP TPU v5p, Azure ND-series, Lambda GPU Cloud, CoreWeave, Vast.ai, Foundry (Mosaic) |
| Distillation & Pruning       | DistilBERT, TinyBERT, MiniLM, GPT 4 Turbo compression, Intel Neural Compressor, NVIDIA TensorRT Model Optimizer, LLM-Pruner, SliceGPT, SparseGPT, Wanda, AutoCompress |
| Model Quantization           | bitsandbytes (4/8-bit), GPTQ, AWQ, GGUF/GGML, AQLM, QuIP#, NF4, FP8 (H100 native), HQQ, ONNX Runtime quantization, Intel Neural Compressor |

================================================================================================================
                                        AI HARDWARE ACCELERATORS
================================================================================================================

| Vendor       | Chip                        | Use Case                    |
|--------------|-----------------------------|-----------------------------|
| NVIDIA       | H100 (Hopper), H200, B200 (Blackwell), B300 (Vera Rubin) | Training + Inference |
| NVIDIA       | L40S, L4, A100, A10G, A2    | Inference                  |
| AMD          | MI300X, MI350               | Training + Inference        |
| AMD          | Instinct MI250              | HPC + Training              |
| Intel        | Gaudi 3                     | Training + Inference        |
| Intel        | Xeon + AMX (4th/5th/6th Gen)| CPU Inference              |
| Google       | TPU v5p, TPU v5e, TPU v6 (Trillium) | Training + Inference  |
| AWS          | Trainium 2, Inferentia 2    | AWS-native Training + Inference |
| Microsoft    | Maia 100                    | Azure Training + Inference  |
| Meta         | MTIA v2                     | Meta Inference             |
| Apple        | M4 Neural Engine, M3 Ultra  | Edge Inference             |
| Groq         | LPU (Language Processing Unit) | Ultra-low latency inference |
| Cerebras     | CS-3 (Wafer-Scale)          | Training                   |
| SambaNova    | SN40L                       | Training + Inference        |
| Tenstorrent  | Wormhole, Blackhole         | Training + Inference        |
| Graphcore    | Bow IPU                     | Training + Inference        |

================================================================================================================
