export const GITHUB_REPOS = [
  {
    name: "LangChain",
    url: "https://github.com/langchain-ai/langchain",
    stars: "102k+",
    description: "Building applications with LLMs through composability, chains, agents, and tool use.",
    category: "LLM Frameworks and Orchestrators",
    features: ["160+ integrations", "LCEL for declarative chains", "LangGraph for agent workflows"],
    install: "pip install langchain langchain-openai",
    useCase: "Building complex LLM-powered applications"
  },
  {
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    stars: "38k+",
    description: "A data framework for connecting LLMs with external data via advanced indexing and RAG pipelines.",
    category: "LLM Frameworks and Orchestrators",
    features: ["160+ document connectors", "Advanced chunking strategies", "Multi-modal RAG support"],
    install: "pip install llama-index llama-index-vector-stores-chroma",
    useCase: "Enterprise RAG systems connecting LLMs to internal knowledge bases"
  },
  {
    name: "Haystack",
    url: "https://github.com/deepset-ai/haystack",
    stars: "19k+",
    description: "End-to-end framework for building production-grade NLP and LLM applications with pipelines.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Modular pipeline architecture", "Deepset Cloud for managed deployment", "Hybrid retrieval support"],
    install: "pip install haystack-ai",
    useCase: "Production NLP pipelines for question answering and summarization"
  },
  {
    name: "Semantic Kernel",
    url: "https://github.com/microsoft/semantic-kernel",
    stars: "24k+",
    description: "Microsoft's SDK for integrating LLMs with conventional programming languages using plugins and planners.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Native C#, Python, and Java SDKs", "Plugin architecture", "Azure AI and OpenAI integrations"],
    install: "pip install semantic-kernel",
    useCase: "Enterprise-grade LLM integration in .NET/Python/Java applications"
  },
  {
    name: "CrewAI",
    url: "https://github.com/crewAIInc/crewAI",
    stars: "25k+",
    description: "Framework for orchestrating role-playing AI agents that collaborate to solve complex tasks.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Role-based agent design", "Sequential and parallel crew execution", "Built-in tool integration"],
    install: "pip install crewai",
    useCase: "Multi-agent workflows where different AI roles collaborate on complex projects"
  },
  {
    name: "AutoGen",
    url: "https://github.com/microsoft/autogen",
    stars: "39k+",
    description: "Framework for building multi-agent conversational AI systems with human-in-the-loop support.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Multi-agent conversation patterns", "Human-in-the-loop and code execution", "Group chat strategies"],
    install: "pip install pyautogen",
    useCase: "Complex multi-agent systems with conversation-driven task completion"
  },
  {
    name: "Dify",
    url: "https://github.com/langgenius/dify",
    stars: "62k+",
    description: "Open-source LLM app development platform with a visual workflow builder, RAG engine, and agent capabilities.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Visual drag-and-drop workflow builder", "Built-in RAG engine", "Model provider abstraction"],
    install: "git clone https://github.com/langgenius/dify.git && cd dify/docker && cp .env.example .env && docker compose up -d",
    useCase: "No-code/low-code LLM app development for teams"
  },
  {
    name: "Flowise",
    url: "https://github.com/FlowiseAI/Flowise",
    stars: "32k+",
    description: "Drag-and-drop UI builder for LangChain-based LLM flows, chatbots, and agent pipelines.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Visual node-based flow editor", "100+ LangChain components", "One-click API deployment"],
    install: "npx flowise start",
    useCase: "Rapid chatbot and LLM flow prototyping without writing code"
  },
  {
    name: "Langflow",
    url: "https://github.com/langflow-ai/langflow",
    stars: "37k+",
    description: "Visual framework for building multi-agent and RAG applications with a drag-and-drop interface on LangChain.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Real-time visual flow editing", "LangChain component library", "Multi-agent orchestration graphs"],
    install: "pip install langflow && langflow run",
    useCase: "Visual development and rapid iteration of LangChain-based AI applications"
  },
  {
    name: "OpenHands",
    url: "https://github.com/All-Hands-AI/OpenHands",
    stars: "40k+",
    description: "Open platform for AI-powered software development agents that can write code, browse the web, and execute commands.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Autonomous code generation and debugging", "Browser interaction capabilities", "Sandbox-based secure code execution"],
    install: "docker pull ghcr.io/all-hands-ai/openhands:0.6 && docker run -it --rm -p 3000:3000 ghcr.io/all-hands-ai/openhands:0.6",
    useCase: "Autonomous software development agents"
  },
  {
    name: "MetaGPT",
    url: "https://github.com/geekan/MetaGPT",
    stars: "47k+",
    description: "Multi-agent framework that assigns different roles to GPTs to simulate a software company's workflow.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Role-based agent architecture", "Standardized operating procedures", "Requirement-to-code pipeline"],
    install: "pip install metagpt",
    useCase: "Generating complete software projects from natural language requirements"
  },
  {
    name: "AgentGPT",
    url: "https://github.com/reworkd/AgentGPT",
    stars: "31k+",
    description: "Browser-based platform for deploying autonomous AI agents that can research, plan, and execute tasks.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Web UI for agent creation", "Goal-oriented autonomous execution", "Task decomposition and iterative refinement"],
    install: "git clone https://github.com/reworkd/AgentGPT.git && cd AgentGPT && npm install && npm run build",
    useCase: "Creating and deploying autonomous research and task-completion agents"
  },
  {
    name: "SuperAGI",
    url: "https://github.com/TransformerOptimus/SuperAGI",
    stars: "15k+",
    description: "Open-source autonomous AI agent framework with tool management, vector embeddings, and a graphical interface.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Agent marketplace for pre-built agents", "Tool kit management system", "GUI-based agent configuration"],
    install: "git clone https://github.com/TransformerOptimus/SuperAGI.git && cd SuperAGI && docker compose up",
    useCase: "Deploying autonomous agents with tool access for business automation"
  },
  {
    name: "AutoChain",
    url: "https://github.com/forethought-technologies/AutoChain",
    stars: "2k+",
    description: "Lightweight framework for building, evaluating, and optimizing conversational agents with chain abstraction.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Simple chain-based agent composition", "Built-in evaluation tools", "Memory management"],
    install: "pip install autochain",
    useCase: "Lightweight conversational agent development with evaluation-first approach"
  },
  {
    name: "Promptflow",
    url: "https://github.com/microsoft/promptflow",
    stars: "9k+",
    description: "SDK and tools for building, evaluating, and deploying LLM-based flows with tracing and quality assessment.",
    category: "LLM Frameworks and Orchestrators",
    features: ["Visual flow designer", "Built-in evaluation metrics", "CI/CD integration"],
    install: "pip install promptflow promptflow-tools",
    useCase: "Enterprise prompt engineering with evaluation and deployment pipelines"
  },
  {
    name: "Chroma",
    url: "https://github.com/chroma-core/chroma",
    stars: "17k+",
    description: "Open-source AI-native embedding database for building LLM applications with memory and retrieval.",
    category: "Vector Databases and RAG",
    features: ["Simple Python and JS clients", "Built-in embedding functions", "Metadata filtering and querying"],
    install: "pip install chromadb",
    useCase: "Lightweight, embeddable vector database for local and production RAG applications"
  },
  {
    name: "Qdrant",
    url: "https://github.com/qdrant/qdrant",
    stars: "23k+",
    description: "High-performance vector similarity search engine with filtering, payload storage, and distributed deployment.",
    category: "Vector Databases and RAG",
    features: ["Advanced filtering with payload conditions", "Distributed clustering", "gRPC and REST API interfaces"],
    install: "pip install qdrant-client",
    useCase: "Production vector search with complex filtering and scalability"
  },
  {
    name: "Weaviate",
    url: "https://github.com/weaviate/weaviate",
    stars: "13k+",
    description: "AI-native vector database for building semantic search, generative search, and RAG applications.",
    category: "Vector Databases and RAG",
    features: ["GraphQL API for complex queries", "Built-in vectorization modules", "Hybrid search (BM25 + vector)"],
    install: "pip install weaviate-client",
    useCase: "Semantic and hybrid search applications with native vectorization"
  },
  {
    name: "Milvus",
    url: "https://github.com/milvus-io/milvus",
    stars: "32k+",
    description: "Open-source vector database built for scalable similarity search and AI applications at billion scale.",
    category: "Vector Databases and RAG",
    features: ["Billion-vector scale with sharding", "Multiple index types (IVF, HNSW, DiskANN)", "GPU-accelerated index building"],
    install: "pip install pymilvus",
    useCase: "Large-scale vector similarity search for enterprise AI applications"
  },
  {
    name: "Pinecone Python Client",
    url: "https://github.com/pinecone-io/pinecone-python-client",
    stars: "1k+",
    description: "Python client for Pinecone vector database - managed vector search for AI/ML applications.",
    category: "Vector Databases and RAG",
    features: ["Serverless and pod-based index options", "Namespaces for multi-tenancy", "Metadata filtering"],
    install: "pip install pinecone-client",
    useCase: "Managed vector database for production RAG and recommendation applications"
  },
  {
    name: "pgvector",
    url: "https://github.com/pgvector/pgvector",
    stars: "14k+",
    description: "PostgreSQL extension for vector similarity search, enabling AI workloads within your existing database.",
    category: "Vector Databases and RAG",
    features: ["IVFFlat and HNSW indexing", "Multiple distance metrics", "SQL-native vector operations"],
    install: "CREATE EXTENSION vector;",
    useCase: "Adding vector search to existing PostgreSQL databases"
  },
  {
    name: "FAISS",
    url: "https://github.com/facebookresearch/faiss",
    stars: "33k+",
    description: "Facebook AI Similarity Search - library for efficient similarity search and clustering of dense vectors.",
    category: "Vector Databases and RAG",
    features: ["CPU and GPU acceleration", "Multiple index types (IVF, HNSW, PQ, LSH)", "Billion-scale vector search"],
    install: "pip install faiss-cpu",
    useCase: "High-performance vector similarity search for research and production"
  },
  {
    name: "LanceDB",
    url: "https://github.com/lancedb/lancedb",
    stars: "12k+",
    description: "Developer-friendly, serverless vector database built on Lance columnar format for ML and AI apps.",
    category: "Vector Databases and RAG",
    features: ["Embedded and serverless mode", "Multi-modal data support", "Built-in versioning"],
    install: "pip install lancedb",
    useCase: "Serverless vector search with multi-modal data and version control"
  },
  {
    name: "Vespa",
    url: "https://github.com/vespa-engine/vespa",
    stars: "6k+",
    description: "Production platform for search, recommendation, and RAG with hybrid text + vector retrieval at scale.",
    category: "Vector Databases and RAG",
    features: ["Hybrid search (text + vector + structured)", "Real-time indexing and querying", "Tensor operations in queries"],
    install: "docker pull vespaengine/vespa && docker run -m 8g --name vespa -d -p 8080:8080 vespaengine/vespa",
    useCase: "Large-scale hybrid search and recommendation systems"
  },
  {
    name: "HyDE",
    url: "https://github.com/nyu-dsc/hyde",
    stars: "1k+",
    description: "Hypothetical Document Embeddings - query expansion technique for better retrieval.",
    category: "Vector Databases and RAG",
    features: ["LLM-based query expansion", "Improves retrieval for ambiguous queries", "Simple integration with vector stores"],
    install: "pip install HyDE",
    useCase: "Improving retrieval quality by bridging the semantic gap between queries and documents"
  },
  {
    name: "RAGFlow",
    url: "https://github.com/infiniflow/ragflow",
    stars: "31k+",
    description: "Open-source RAG engine with deep document understanding and template-based chunking for accurate answers.",
    category: "Vector Databases and RAG",
    features: ["Deep document understanding (tables, layouts, figures)", "Template-based intelligent chunking", "Citations and source traceability"],
    install: "git clone https://github.com/infiniflow/ragflow.git && cd ragflow && docker compose -f docker-compose.yml up -d",
    useCase: "Accurate document-grounded Q&A with deep understanding of complex layouts"
  },
  {
    name: "Instructor",
    url: "https://github.com/jxnl/instructor",
    stars: "18k+",
    description: "Library for structured LLM outputs via Pydantic, with retry logic, validation, and streaming support.",
    category: "Vector Databases and RAG",
    features: ["Pydantic model-based structured extraction", "Automatic retries on validation failures", "Multi-provider support"],
    install: "pip install instructor",
    useCase: "Extracting structured, typed data from LLM outputs with guaranteed schema compliance"
  },
  {
    name: "vLLM",
    url: "https://github.com/vllm-project/vllm",
    stars: "43k+",
    description: "High-throughput and memory-efficient LLM serving engine with PagedAttention for fast inference.",
    category: "Model Serving and Inference",
    features: ["PagedAttention for efficient memory management", "Continuous batching for high throughput", "OpenAI-compatible API server"],
    install: "pip install vllm",
    useCase: "High-throughput LLM serving for production deployments"
  },
  {
    name: "Text Generation Inference (TGI)",
    url: "https://github.com/huggingface/text-generation-inference",
    stars: "10k+",
    description: "Hugging Face's optimized inference solution for deploying LLMs with continuous batching and quantization.",
    category: "Model Serving and Inference",
    features: ["Continuous batching and token streaming", "Flash Attention and Flash Decoding", "GPTQ, AWQ quantization"],
    install: "docker run --gpus all -p 8080:80 -v /data:/data ghcr.io/huggingface/text-generation-inference:latest --model-id meta-llama/Llama-3-8B-Instruct",
    useCase: "Enterprise LLM inference with HF ecosystem integration"
  },
  {
    name: "Ollama",
    url: "https://github.com/ollama/ollama",
    stars: "117k+",
    description: "Run LLMs locally with a simple CLI - llama.cpp backend with model management and a REST API.",
    category: "Model Serving and Inference",
    features: ["One-command model download and run", "OpenAI-compatible REST API", "Model library with 100+ models"],
    install: "curl -fsSL https://ollama.com/install.sh | sh",
    useCase: "Running LLMs locally for privacy, experimentation, and offline AI applications"
  },
  {
    name: "LM Studio",
    url: "https://github.com/lmstudio-ai/lms.js",
    stars: "22k+",
    description: "Desktop application for running local LLMs with an OpenAI-compatible API and GUI model management.",
    category: "Model Serving and Inference",
    features: ["Beautiful GUI for model browsing", "OpenAI-compatible local API", "Model comparison and benchmarking"],
    install: "npm install -g @lmstudio/cli",
    useCase: "Desktop-based local LLM inference with GUI"
  },
  {
    name: "llama.cpp",
    url: "https://github.com/ggerganov/llama.cpp",
    stars: "74k+",
    description: "C/C++ port of Meta's LLaMA model with GGML quantization for efficient CPU and GPU inference.",
    category: "Model Serving and Inference",
    features: ["CPU-only inference (no Python required)", "Multiple quantization formats", "Metal, CUDA, and Vulkan GPU acceleration"],
    install: "git clone https://github.com/ggerganov/llama.cpp && cd llama.cpp && cmake -B build && cmake --build build --config Release",
    useCase: "Running quantized LLMs on consumer hardware with minimal requirements"
  },
  {
    name: "MLC-LLM",
    url: "https://github.com/mlc-ai/mlc-llm",
    stars: "20k+",
    description: "Universal LLM deployment engine optimizing models for any device - phones, GPUs, browsers, and more.",
    category: "Model Serving and Inference",
    features: ["Cross-platform deployment (iOS, Android, Web, GPU)", "TVM compilation for hardware optimization", "100+ model support"],
    install: "pip install mlc-ai mlc-chat",
    useCase: "Deploying LLMs to edge devices, mobile phones, and browsers"
  },
  {
    name: "LocalAI",
    url: "https://github.com/mudler/LocalAI",
    stars: "26k+",
    description: "Free, open-source OpenAI-compatible API running locally with CPU and GPU support for multiple model families.",
    category: "Model Serving and Inference",
    features: ["Drop-in OpenAI API replacement", "CPU and GPU inference (CUDA, Metal, ROCm)", "Text, image, audio, and embedding models"],
    install: "docker run -p 8080:8080 -v localai/models:/models localai/localai:latest",
    useCase: "Self-hosted, private AI inference with OpenAI API compatibility"
  },
  {
    name: "OpenLLM",
    url: "https://github.com/bentoml/OpenLLM",
    stars: "10k+",
    description: "Open-source platform for operating LLMs in production with built-in serving, fine-tuning, and deployment.",
    category: "Model Serving and Inference",
    features: ["BentoML-powered serving infrastructure", "Quantization support (GPTQ, AWQ)", "Kubernetes deployment ready"],
    install: "pip install openllm",
    useCase: "End-to-end LLM lifecycle management from development to production"
  },
  {
    name: "ctransformers",
    url: "https://github.com/mudler/ctransformers",
    stars: "3k+",
    description: "C/C++ Python bindings for GGML transformer models with CPU and GPU support via llama.cpp backend.",
    category: "Model Serving and Inference",
    features: ["GGML format support (Q4, Q5, Q8 quantization)", "Python, C, and C# bindings", "Text generation and streaming"],
    install: "pip install ctransformers",
    useCase: "Lightweight GGML model inference with minimal dependencies"
  },
  {
    name: "ExLlamaV2",
    url: "https://github.com/turboderp/exllamav2",
    stars: "5k+",
    description: "Fast inference library for GPTQ and EXL2 quantized models with CUDA optimization.",
    category: "Model Serving and Inference",
    features: ["EXL2 quantization format (mixed precision)", "CUDA-optimized for NVIDIA GPUs", "High-speed batch and streaming inference"],
    install: "pip install exllamav2",
    useCase: "Maximum-speed inference on NVIDIA GPUs with mixed-precision quantized models"
  },
  {
    name: "KoboldCpp",
    url: "https://github.com/LostRuins/koboldcpp",
    stars: "8k+",
    description: "Easy-to-use AI backend with OpenAI API compatibility, supporting GGUF models with a built-in web UI.",
    category: "Model Serving and Inference",
    features: ["Single executable deployment", "OpenAI-compatible API", "CUDA, Metal, and Vulkan GPU support"],
    install: "git clone https://github.com/LostRuins/koboldcpp && cd koboldcpp && make",
    useCase: "Simple, all-in-one local LLM backend with web UI for chat and creative writing"
  },
  {
    name: "Jan",
    url: "https://github.com/janhq/jan",
    stars: "26k+",
    description: "Open-source desktop application for running AI models locally with a ChatGPT-like interface.",
    category: "Model Serving and Inference",
    features: ["Beautiful desktop app (Windows, macOS, Linux)", "One-click model download and management", "OpenAI-compatible local API"],
    install: "winget install Jan.Jan",
    useCase: "Desktop-first local AI assistant with privacy and offline capabilities"
  },
  {
    name: "LangGraph",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "9k+",
    description: "Library for building stateful, multi-actor applications with LLMs using graph-based workflows.",
    category: "AI Agents and Tools",
    features: ["Graph-based state machine for agents", "Human-in-the-loop checkpoints", "Streaming and async support"],
    install: "pip install langgraph",
    useCase: "Building complex, stateful agent architectures with branching and human intervention"
  },
  {
    name: "AutoGPT",
    url: "https://github.com/Significant-Gravitas/AutoGPT",
    stars: "170k+",
    description: "The first fully autonomous GPT-4 agent - can browse the web, write code, and complete multi-step tasks.",
    category: "AI Agents and Tools",
    features: ["Fully autonomous goal-driven execution", "Internet browsing and web scraping", "Memory management and self-reflection"],
    install: "pip install autogpt",
    useCase: "Autonomous task completion requiring multi-step reasoning and tool use"
  },
  {
    name: "BabyAGI",
    url: "https://github.com/yoheinakajima/babyagi",
    stars: "22k+",
    description: "Simple but powerful task-driven autonomous agent using OpenAI API with prioritized task management.",
    category: "AI Agents and Tools",
    features: ["Task creation, prioritization, and execution loop", "Vector store for task memory", "Minimal codebase (~300 lines)"],
    install: "git clone https://github.com/yoheinakajima/babyagi.git && cd babyagi && pip install -r requirements.txt",
    useCase: "Research and planning agent with task decomposition and iterative execution"
  },
  {
    name: "GPT-Engineer",
    url: "https://github.com/gpt-engineer-org/gpt-engineer",
    stars: "52k+",
    description: "Platform to specify what you want it to build, then asks clarifying questions, generates code, and fixes errors.",
    category: "AI Agents and Tools",
    features: ["Natural language to full codebase generation", "Iterative debugging and improvement", "Project scaffolding and architecture"],
    install: "pip install gpt-engineer",
    useCase: "Rapid prototyping of complete software projects from natural language"
  },
  {
    name: "SWE-Agent",
    url: "https://github.com/princeton-nlp/SWE-agent",
    stars: "15k+",
    description: "Agent-computer interface that enables LLMs to autonomously fix real GitHub issues by interacting with codebases.",
    category: "AI Agents and Tools",
    features: ["Automated GitHub issue resolution", "Code editing and debugging capabilities", "Test execution and validation"],
    install: "pip install swe-agent",
    useCase: "Automating software bug fixes and code improvements from GitHub issues"
  },
  {
    name: "Open Interpreter",
    url: "https://github.com/OpenInterpreter/open-interpreter",
    stars: "54k+",
    description: "A natural language interface for computers to run code locally - interpret and execute code from chat.",
    category: "AI Agents and Tools",
    features: ["Execute Python, JavaScript, Shell code locally", "Natural language to code execution", "Multi-language support"],
    install: "pip install open-interpreter",
    useCase: "Natural language computer interaction for data analysis and system tasks"
  },
  {
    name: "Aider",
    url: "https://github.com/Aider-AI/aider",
    stars: "30k+",
    description: "AI pair programming in your terminal - chat with your codebase and make edits with git integration.",
    category: "AI Agents and Tools",
    features: ["Git-native code editing", "Multi-file editing support", "LLM support (GPT-4, Claude, local models)"],
    install: "pip install aider-chat",
    useCase: "AI-assisted coding directly in your terminal with automatic git commits"
  },
  {
    name: "OpenCode",
    url: "https://github.com/anomalyco/opencode",
    stars: "12k+",
    description: "Open-source AI coding assistant for the terminal with LLM integration and tool use.",
    category: "AI Agents and Tools",
    features: ["Terminal-native AI assistant", "Multi-model support", "MCP server integration"],
    install: "curl -fsSL https://opencode.ai/install.sh | sh",
    useCase: "AI-powered software engineering assistance from the command line"
  },
  {
    name: "Phidata",
    url: "https://github.com/phidatahq/phidata",
    stars: "15k+",
    description: "Build AI assistants with memory, knowledge, and tools. Ships with agents, RAG, and tool integrations.",
    category: "AI Agents and Tools",
    features: ["Pre-built agent recipes", "Built-in RAG with vector search", "100+ tool integrations"],
    install: "pip install phidata",
    useCase: "Building AI assistants with integrated knowledge retrieval and tool capabilities"
  },
  {
    name: "Google GenAI Toolbox",
    url: "https://github.com/google-gemini/genai-toolbox",
    stars: "3k+",
    description: "Open-source MCP server for managing and deploying tool configurations for LLM applications.",
    category: "AI Agents and Tools",
    features: ["MCP (Model Context Protocol) server", "Tool configuration management", "YAML-based configuration"],
    install: "go install github.com/google-gemini/genai-toolbox@latest",
    useCase: "Centralized tool management for LLM-based applications using MCP protocol"
  },
  {
    name: "MCP (Model Context Protocol)",
    url: "https://github.com/modelcontextprotocol/servers",
    stars: "10k+",
    description: "Collection of MCP servers for connecting LLMs to external data sources, tools, and services.",
    category: "AI Agents and Tools",
    features: ["Standardized protocol for LLM tool integration", "Reference server implementations", "File system, database, and API access"],
    install: "npm install @modelcontextprotocol/server-filesystem",
    useCase: "Connecting AI models to external tools and data sources via a standardized protocol"
  },
  {
    name: "ToolLLM",
    url: "https://github.com/OpenBMB/ToolBench",
    stars: "6k+",
    description: "Benchmark and training data for tool-augmented LLMs with 16,000+ real-world APIs.",
    category: "AI Agents and Tools",
    features: ["16,000+ real-world REST APIs", "Tool-augmented LLM training data", "Multi-step tool-use reasoning"],
    install: "pip install toolbench",
    useCase: "Training and evaluating LLMs on multi-step tool-use tasks"
  },
  {
    name: "Gorilla",
    url: "https://github.com/ShishirPatil/gorilla",
    stars: "12k+",
    description: "Fine-tuned LLMs for accurate API calls with hallucination-free generation and API benchmarking.",
    category: "AI Agents and Tools",
    features: ["LLM fine-tuned for API calling", "TorchHub, TensorFlowHub, and HuggingFace API support", "State-of-the-art API call accuracy"],
    install: "pip install gorilla-openfunctions-v2",
    useCase: "Accurate API calling from natural language with minimal hallucination"
  },
  {
    name: "APIGen",
    url: "https://github.com/SalesforceAIResearch/APIGen",
    stars: "2k+",
    description: "End-to-end pipeline for generating high-quality function-calling datasets to train tool-use models.",
    category: "AI Agents and Tools",
    features: ["Synthetic dataset generation for tool use", "Verifiable dataset pipeline", "Multi-turn tool-use conversations"],
    install: "git clone https://github.com/SalesforceAIResearch/APIGen.git && cd APIGen && pip install -r requirements.txt",
    useCase: "Generating training data for building better tool-calling AI models"
  },
  {
    name: "ToolBench",
    url: "https://github.com/OpenBMB/ToolBench",
    stars: "6k+",
    description: "Large-scale benchmark with 16K+ real-world APIs for training and evaluating tool-augmented LLMs.",
    category: "AI Agents and Tools",
    features: ["16,464 real-world REST APIs from RapidAPI", "Multi-tool and single-tool tasks", "ToolLLaMA model weights"],
    install: "pip install toolbench",
    useCase: "Training and benchmarking LLMs on realistic multi-step API interaction tasks"
  },
  {
    name: "Stable Diffusion WebUI (AUTOMATIC1111)",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    stars: "145k+",
    description: "Browser-based interface for Stable Diffusion with extensive features for image generation.",
    category: "Computer Vision and Multimodal",
    features: ["Text-to-image and image-to-image generation", "Inpainting and outpainting", "Extensive extension ecosystem"],
    install: "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git && cd stable-diffusion-webui && ./webui.sh",
    useCase: "Full-featured web interface for Stable Diffusion image generation"
  },
  {
    name: "ComfyUI",
    url: "https://github.com/comfyanonymous/ComfyUI",
    stars: "70k+",
    description: "Node-based UI for Stable Diffusion with a powerful workflow system for complex image generation pipelines.",
    category: "Computer Vision and Multimodal",
    features: ["Node-based visual workflow editor", "Supports all Stable Diffusion features", "Advanced ControlNet workflows"],
    install: "git clone https://github.com/comfyanonymous/ComfyUI.git && cd ComfyUI && pip install -r requirements.txt && python main.py",
    useCase: "Creating complex image generation workflows with a flexible node-based interface"
  },
  {
    name: "ControlNet",
    url: "https://github.com/lllyasviel/ControlNet",
    stars: "30k+",
    description: "Add conditional control to text-to-image diffusion models for precise image generation.",
    category: "Computer Vision and Multimodal",
    features: ["Edge, depth, pose, and segmentation control", "Works with SD 1.5, SDXL, and Flux", "Preprocessor models included"],
    install: "pip install controlnet-aux",
    useCase: "Precise spatial control over image generation using various conditioning types"
  },
  {
    name: "Segment Anything (SAM)",
    url: "https://github.com/facebookresearch/segment-anything",
    stars: "49k+",
    description: "Meta's foundation model for image segmentation - segment anything in any image with a click.",
    category: "Computer Vision and Multimodal",
    features: ["Zero-shot segmentation without fine-tuning", "Point, box, and mask prompt support", "SAM 2 for video segmentation"],
    install: "pip install segment-anything-2",
    useCase: "Interactive image segmentation for annotation, editing, and CV tasks"
  },
  {
    name: "GroundingDINO",
    url: "https://github.com/IDEA-Research/GroundingDINO",
    stars: "11k+",
    description: "Open-set object detection using text prompts - detect any object described in natural language.",
    category: "Computer Vision and Multimodal",
    features: ["Text-prompted object detection", "Zero-shot detection of arbitrary objects", "Integration with SAM for segmentation"],
    install: "pip install groundingdino-py",
    useCase: "Detecting arbitrary objects in images using natural language text descriptions"
  },
  {
    name: "Ultralytics YOLOv8/v11",
    url: "https://github.com/ultralytics/ultralytics",
    stars: "40k+",
    description: "State-of-the-art YOLO models for real-time detection, segmentation, classification, and pose estimation.",
    category: "Computer Vision and Multimodal",
    features: ["Object detection, segmentation, classification", "Pose estimation and tracking", "ONNX, TensorRT, CoreML export"],
    install: "pip install ultralytics",
    useCase: "Real-time computer vision for detection, tracking, and analysis tasks"
  },
  {
    name: "Florence-2",
    url: "https://github.com/microsoft/Florence-2",
    stars: "20k+",
    description: "Microsoft's vision foundation model for versatile image and video understanding tasks.",
    category: "Computer Vision and Multimodal",
    features: ["Caption, detection, segmentation in one model", "Zero-shot and fine-tunable", "Multiple task support (caption, OCR, grounding)"],
    install: "pip install transformers torch",
    useCase: "Unified vision model for captioning, detection, segmentation, and OCR"
  },
  {
    name: "LLaVA",
    url: "https://github.com/haotian-liu/LLaVA",
    stars: "20k+",
    description: "Visual instruction-tuned multimodal AI model that combines a vision encoder with LLM for visual reasoning.",
    category: "Computer Vision and Multimodal",
    features: ["Visual question answering", "Image captioning and description", "Multi-turn visual conversations"],
    install: "pip install llava",
    useCase: "Visual question answering, image description, and multimodal reasoning"
  },
  {
    name: "MiniGPT-4",
    url: "https://github.com/Vision-CAIR/MiniGPT-4",
    stars: "24k+",
    description: "Enhancing vision-language understanding with advanced language models for image description and reasoning.",
    category: "Computer Vision and Multimodal",
    features: ["Image captioning and description", "Visual question answering", "Based on Vicuna and BLIP-2"],
    install: "git clone https://github.com/Vision-CAIR/MiniGPT-4.git && cd MiniGPT-4 && pip install -r requirements.txt",
    useCase: "Lightweight multimodal AI for image understanding and visual conversations"
  },
  {
    name: "InternVL",
    url: "https://github.com/OpenGVLab/InternVL",
    stars: "8k+",
    description: "InternVL 2.5/3 series - scalable vision-language models for comprehensive multimodal understanding.",
    category: "Computer Vision and Multimodal",
    features: ["Vision-language understanding", "Multiple model sizes (1B to 108B)", "State-of-the-art on 32 benchmarks"],
    install: "pip install transformers>=4.35.0 torch",
    useCase: "Advanced multimodal understanding for images, videos, and documents"
  },
  {
    name: "Whisper",
    url: "https://github.com/openai/whisper",
    stars: "73k+",
    description: "OpenAI's general-purpose speech recognition model trained on 680,000 hours of multilingual audio data.",
    category: "Speech and Audio AI",
    features: ["Multilingual speech recognition (99 languages)", "Translation to English", "Automatic language detection"],
    install: "pip install openai-whisper",
    useCase: "Multilingual speech-to-text transcription and translation"
  },
  {
    name: "Bark",
    url: "https://github.com/suno-ai/bark",
    stars: "36k+",
    description: "Text-to-audio model capable of generating highly realistic, multilingual speech with non-verbal sounds.",
    category: "Speech and Audio AI",
    features: ["Realistic multilingual speech generation", "Non-verbal sounds (laughter, sighs, emotions)", "Music generation capability"],
    install: "pip install git+https://github.com/suno-ai/bark.git",
    useCase: "Realistic text-to-speech with emotional expression and non-verbal audio"
  },
  {
    name: "Coqui XTTS",
    url: "https://github.com/coqui-ai/TTS",
    stars: "35k+",
    description: "Deep learning toolkit for Text-to-Speech with XTTS voice cloning and multi-speaker support.",
    category: "Speech and Audio AI",
    features: ["Voice cloning from short audio samples", "17+ languages supported", "Real-time streaming synthesis"],
    install: "pip install TTS",
    useCase: "High-quality text-to-speech with voice cloning for multilingual applications"
  },
  {
    name: "Coqui TTS",
    url: "https://github.com/coqui-ai/TTS",
    stars: "35k+",
    description: "Open-source deep learning text-to-speech library with the largest collection of pre-trained models.",
    category: "Speech and Audio AI",
    features: ["20+ pre-trained TTS models", "Voice cloning and speaker adaptation", "Emotion and style control"],
    install: "pip install TTS",
    useCase: "Self-hosted TTS with multiple model options and voice customization"
  },
  {
    name: "AudioCraft",
    url: "https://github.com/facebookresearch/audiocraft",
    stars: "21k+",
    description: "Meta's library for audio processing with MusicGen, AudioGen, and EnCodec models.",
    category: "Speech and Audio AI",
    features: ["MusicGen for music generation from text", "AudioGen for sound effects generation", "EnCodec for neural audio compression"],
    install: "pip install audiocraft",
    useCase: "AI-powered music and sound effects generation from text descriptions"
  },
  {
    name: "Tortoise-TTS",
    url: "https://github.com/neonbjb/tortoise-tts",
    stars: "13k+",
    description: "Multi-voice text-to-speech with voice cloning and high-fidelity output using diffusion transformers.",
    category: "Speech and Audio AI",
    features: ["Voice cloning from few-shot examples", "Multiple preset voices included", "Diffusion-based generation"],
    install: "pip install tortoise-tts",
    useCase: "High-quality voice cloning and TTS with minimal reference audio"
  },
  {
    name: "Piper",
    url: "https://github.com/rhasspy/piper",
    stars: "8k+",
    description: "Fast, local neural text-to-speech optimized for Raspberry Pi and low-resource devices.",
    category: "Speech and Audio AI",
    features: ["Ultra-fast inference (real-time on Pi)", "50+ pre-trained voices", "ONNX runtime for portability"],
    install: "pip install piper-tts",
    useCase: "Lightweight, fast TTS for edge devices, IoT, and offline applications"
  },
  {
    name: "Faster-Whisper",
    url: "https://github.com/guillaumekln/faster-whisper",
    stars: "13k+",
    description: "Whisper implementation using CTranslate2 for faster inference with lower memory usage.",
    category: "Speech and Audio AI",
    features: ["4-8x faster than original Whisper", "Lower memory consumption", "VAD (Voice Activity Detection) integration"],
    install: "pip install faster-whisper",
    useCase: "High-performance speech recognition for production with GPU acceleration"
  },
  {
    name: "Axolotl",
    url: "https://github.com/OpenAccess-AI-Collective/axolotl",
    stars: "9k+",
    description: "User-friendly fine-tuning framework for LLMs supporting multiple architectures, datasets, and training modes.",
    category: "Data and Training",
    features: ["LoRA, QLoRA, and full fine-tuning", "Multi-GPU and FSDP support", "YAML-based configuration"],
    install: "pip install axolotl",
    useCase: "Simplified LLM fine-tuning with YAML configs and multi-GPU support"
  },
  {
    name: "LLaMA-Factory",
    url: "https://github.com/hiyouga/LLaMA-Factory",
    stars: "44k+",
    description: "Unified framework for LLM fine-tuning with 100+ models, multiple methods, and a web UI.",
    category: "Data and Training",
    features: ["Web UI for visual fine-tuning", "100+ model support", "LoRA, QLoRA, full fine-tuning, RLHF"],
    install: "git clone https://github.com/hiyouga/LLaMA-Factory.git && cd LLaMA-Factory && pip install -e '.[torch,metrics]'",
    useCase: "One-stop fine-tuning solution with visual interface"
  },
  {
    name: "OpenRLHF",
    url: "https://github.com/OpenRLHF/OpenRLHF",
    stars: "8k+",
    description: "Scalable RLHF framework for training LLMs with PPO, DPO, and other alignment algorithms.",
    category: "Data and Training",
    features: ["PPO, DPO, RLHF, and GRPO support", "Distributed training with Ray", "Multi-GPU and multi-node scaling"],
    install: "git clone https://github.com/OpenRLHF/OpenRLHF.git && cd OpenRLHF && pip install -e .",
    useCase: "Aligning LLMs with human preferences using reinforcement learning at scale"
  },
  {
    name: "TRL (Transformer Reinforcement Learning)",
    url: "https://github.com/huggingface/trl",
    stars: "12k+",
    description: "Hugging Face's library for training language models with reinforcement learning from human feedback.",
    category: "Data and Training",
    features: ["SFT, DPO, PPO, ORPO, KTO trainers", "LoRA and PEFT integration", "Integration with HF Transformers"],
    install: "pip install trl",
    useCase: "Fine-tuning and aligning LLMs with SFT, DPO, and PPO methods"
  },
  {
    name: "DeepSpeed",
    url: "https://github.com/microsoft/DeepSpeed",
    stars: "35k+",
    description: "Deep learning optimization library for distributed training and inference with memory efficiency.",
    category: "Data and Training",
    features: ["ZeRO optimizer (stages 1-3)", "Mixed precision training (fp16/bf16)", "Gradient accumulation and checkpointing"],
    install: "pip install deepspeed",
    useCase: "Distributed training for large models with memory-efficient optimization"
  },
  {
    name: "PEFT (Parameter-Efficient Fine-Tuning)",
    url: "https://github.com/huggingface/peft",
    stars: "15k+",
    description: "Hugging Face library for efficient fine-tuning of large pretrained models using LoRA, adapters, and more.",
    category: "Data and Training",
    features: ["LoRA, QLoRA, and DoRA adapters", "Prompt tuning and prefix tuning", "Integration with TRL and Transformers"],
    install: "pip install peft",
    useCase: "Memory-efficient fine-tuning of large models with adapter-based methods"
  },
  {
    name: "Datasets (Hugging Face)",
    url: "https://github.com/huggingface/datasets",
    stars: "18k+",
    description: "Library for accessing, processing, and sharing datasets for ML with streaming and caching support.",
    category: "Data and Training",
    features: ["100,000+ datasets on the Hub", "Streaming and lazy loading", "Interoperability with Pandas, NumPy, PyTorch"],
    install: "pip install datasets",
    useCase: "Accessing and processing datasets for LLM training and evaluation"
  },
  {
    name: "lm-evaluation-harness",
    url: "https://github.com/EleutherAI/lm-evaluation-harness",
    stars: "8k+",
    description: "Framework for evaluating language models on a wide range of standardized benchmarks and tasks.",
    category: "Data and Training",
    features: ["200+ evaluation tasks", "Standardized benchmarks (MMLU, ARC, HellaSwag)", "Multiple model backends"],
    install: "pip install lm-eval",
    useCase: "Standardized LLM evaluation and benchmarking across multiple tasks"
  },
  {
    name: "HELM",
    url: "https://github.com/stanford-crfm/helm",
    stars: "2k+",
    description: "Stanford's Holistic Evaluation of Language Models - comprehensive benchmark suite for LLM assessment.",
    category: "Data and Training",
    features: ["42+ scenarios and 30+ metrics", "Bias and fairness metrics", "Cost and efficiency analysis"],
    install: "pip install crfm-helm",
    useCase: "Comprehensive, holistic evaluation of language models across multiple dimensions"
  },
  {
    name: "TextBrewer",
    url: "https://github.com/airaria/TextBrewer",
    stars: "2k+",
    description: "Knowledge distillation toolkit for natural language processing models with multiple distillation methods.",
    category: "Data and Training",
    features: ["Multiple distillation methods (KD, attention, feature)", "Task-agnostic design", "Easy integration with Hugging Face models"],
    install: "pip install textbrewer",
    useCase: "Compressing large language models into smaller, faster models via knowledge distillation"
  },
  {
    name: "ChatGPT-Next-Web",
    url: "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web",
    stars: "80k+",
    description: "Well-designed, cross-platform ChatGPT web UI with one-click deployment and multi-model support.",
    category: "AI Apps and Demos",
    features: ["Beautiful responsive UI", "Multi-model support (GPT, Claude, Gemini, local)", "One-click Docker/Vercel deployment"],
    install: "docker pull yidadaa/chatgpt-next-web && docker run -d -p 3000:3000 -e OPENAI_API_KEY=your-key yidadaa/chatgpt-next-web",
    useCase: "Self-hosted ChatGPT clone with beautiful UI and multi-provider support"
  },
  {
    name: "LibreChat",
    url: "https://github.com/danny-avila/LibreChat",
    stars: "24k+",
    description: "Enhanced ChatGPT clone with multi-user support, multi-model, and plugin system.",
    category: "AI Apps and Demos",
    features: ["Multi-user and multi-conversation support", "Multiple AI providers", "File upload and analysis"],
    install: "git clone https://github.com/danny-avila/LibreChat.git && cd LibreChat && cp .env.example .env && docker compose up",
    useCase: "Enterprise-ready ChatGPT alternative with user management"
  },
  {
    name: "Open WebUI",
    url: "https://github.com/open-webui/open-webui",
    stars: "55k+",
    description: "Feature-rich, user-friendly web UI for running LLMs locally with Ollama and OpenAI compatibility.",
    category: "AI Apps and Demos",
    features: ["Multi-user support with authentication", "Ollama and OpenAI API integration", "RAG with document upload"],
    install: "docker run -d -p 3000:8080 -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://host.docker.internal:11434 ghcr.io/open-webui/open-webui:main",
    useCase: "All-in-one web UI for local LLM usage with RAG and multi-user support"
  },
  {
    name: "LobeChat",
    url: "https://github.com/lobehub/lobe-chat",
    stars: "55k+",
    description: "Modern, open-source chat UI framework with plugin system, TTS, and image generation support.",
    category: "AI Apps and Demos",
    features: ["Beautiful Material Design UI", "Plugin marketplace", "TTS and STT integration"],
    install: "docker run -d -p 3210:3210 -e OPENAI_API_KEY=your-key lobehub/lobe-chat",
    useCase: "Feature-rich chat interface with plugins, voice, and image generation"
  },
  {
    name: "AnythingLLM",
    url: "https://github.com/Mintplex-Labs/anything-llm",
    stars: "28k+",
    description: "All-in-one desktop and Docker AI app for RAG, AI agents, and document chat with full privacy.",
    category: "AI Apps and Demos",
    features: ["RAG with document upload", "AI agent capabilities", "Multi-user workspaces"],
    install: "docker pull mintplexlabs/anythingllm && docker run -d -p 3001:3001 -v anythingllm:/app/server/storage mintplexlabs/anythingllm",
    useCase: "Complete local AI workspace for document chat, RAG, and AI agents"
  },
  {
    name: "PrivateGPT",
    url: "https://github.com/zylon-ai/private-gpt",
    stars: "21k+",
    description: "Production-ready LLM project allowing 100% private interaction with documents with zero data leakage.",
    category: "AI Apps and Demos",
    features: ["100% private document Q&A", "No data leaves your infrastructure", "RAG with local LLMs"],
    install: "pip install privategpt",
    useCase: "Privacy-critical document analysis where data must stay on-premises"
  },
  {
    name: "GPT4All",
    url: "https://github.com/nomic-ai/gpt4all",
    stars: "74k+",
    description: "Run open-source LLMs locally on your device with a ChatGPT-like interface and API.",
    category: "AI Apps and Demos",
    features: ["Desktop chat application", "Local inference (no internet required)", "Model library with curated LLMs"],
    install: "brew install gpt4all",
    useCase: "Running open-source LLMs locally with a simple desktop interface"
  },
  {
    name: "Khoj",
    url: "https://github.com/khoj-ai/khoj",
    stars: "18k+",
    description: "Self-hosted AI personal assistant that can search your docs, chat, and automate tasks.",
    category: "AI Apps and Demos",
    features: ["Personal knowledge search", "Chat with your documents", "GitHub, Obsidian, and file integrations"],
    install: "pip install khoj",
    useCase: "Personal AI assistant that can search and chat with your private knowledge base"
  },
  {
    name: "Mem0",
    url: "https://github.com/mem0ai/mem0",
    stars: "25k+",
    description: "The memory layer for AI agents - persistent, adaptive memory for personalized AI experiences.",
    category: "AI Apps and Demos",
    features: ["Persistent memory across sessions", "Adaptive learning from interactions", "Multi-agent memory sharing"],
    install: "pip install mem0ai",
    useCase: "Building AI agents that remember user preferences and context over time"
  },
  {
    name: "Chainlit",
    url: "https://github.com/Chainlit/chainlit",
    stars: "7k+",
    description: "Build production-grade conversational AI apps with a Python framework and beautiful UI.",
    category: "AI Apps and Demos",
    features: ["LangChain and LlamaIndex integration", "Real-time streaming UI", "Human-in-the-loop support"],
    install: "pip install chainlit && chainlit new",
    useCase: "Production conversational AI apps with built-in UI and deployment tools"
  },
  {
    name: "Gradio",
    url: "https://github.com/gradio-app/gradio",
    stars: "36k+",
    description: "Build and share ML demos, APIs, and web apps with a Python-based UI framework.",
    category: "AI Apps and Demos",
    features: ["Python-only UI creation", "Chatbot and conversational interfaces", "One-click shareable links"],
    install: "pip install gradio",
    useCase: "Rapid ML demo and web app creation with minimal frontend code"
  },
  {
    name: "Streamlit",
    url: "https://github.com/streamlit/streamlit",
    stars: "39k+",
    description: "Fast, intuitive way to build data apps and LLM demos in pure Python with interactive widgets.",
    category: "AI Apps and Demos",
    features: ["Pure Python (no frontend code needed)", "Real-time data app updates", "Rich component library"],
    install: "pip install streamlit",
    useCase: "Rapid prototyping and deployment of data apps and LLM demos"
  },
  {
    name: "RAGFlow (Apps)",
    url: "https://github.com/infiniflow/ragflow",
    stars: "31k+",
    description: "End-to-end RAG engine with deep document understanding, visible chunking, and citation-based answers.",
    category: "AI Apps and Demos",
    features: ["Deep document parsing", "Template-based chunking with visual preview", "Citation support for all answers"],
    install: "git clone https://github.com/infiniflow/ragflow.git && cd ragflow && docker compose -f docker-compose.yml up -d",
    useCase: "Enterprise document Q&A with deep understanding of complex document layouts"
  },
  {
    name: "PromptFlow (Apps)",
    url: "https://github.com/microsoft/promptflow",
    stars: "9k+",
    description: "Build, evaluate, and deploy LLM workflows with visual tools and built-in quality assessment.",
    category: "AI Apps and Demos",
    features: ["Visual flow designer", "Testing playground", "Quality evaluation metrics"],
    install: "pip install promptflow promptflow-tools",
    useCase: "Building and evaluating LLM workflows with quality assurance built in"
  },
  {
    name: "Hugging Face Spaces",
    url: "https://github.com/huggingface/datasets",
    stars: "18k+",
    description: "Platform for hosting and sharing ML demos, models, and datasets with a vibrant community.",
    category: "AI Apps and Demos",
    features: ["Free hosting for ML demos", "Gradio and Streamlit support", "Automatic GPU allocation"],
    install: "pip install huggingface_hub",
    useCase: "Sharing ML demos and apps with the open-source community"
  },
  {
    name: "MLflow",
    url: "https://github.com/mlflow/mlflow",
    stars: "20k+",
    description: "Open-source platform for ML lifecycle management - experiment tracking, model registry, and deployment.",
    category: "MLOps and Infra",
    features: ["Experiment tracking and logging", "Model registry and versioning", "LLM tracking and evaluation"],
    install: "pip install mlflow",
    useCase: "End-to-end ML lifecycle management with tracking, registry, and deployment"
  },
  {
    name: "BentoML",
    url: "https://github.com/bentoml/BentoML",
    stars: "7k+",
    description: "Framework for building, shipping, and scaling AI/ML applications as production-ready services.",
    category: "MLOps and Infra",
    features: ["Model serving and deployment", "Adaptive batching", "Kubernetes and cloud deployment"],
    install: "pip install bentoml",
    useCase: "Building and deploying ML models as production-grade services"
  },
  {
    name: "Ray Serve",
    url: "https://github.com/ray-project/ray",
    stars: "37k+",
    description: "Scalable model serving library on Ray for deploying ML models at any scale with autoscaling.",
    category: "MLOps and Infra",
    features: ["Multi-model composition (chains, DAGs)", "GPU and CPU autoscaling", "Deployment graphs"],
    install: "pip install \"ray[serve]\"",
    useCase: "Scalable, multi-model serving with GPU autoscaling and deployment graphs"
  },
  {
    name: "NVIDIA Triton Inference Server",
    url: "https://github.com/triton-inference-server/server",
    stars: "9k+",
    description: "NVIDIA's inference server for deploying and serving ML models at scale with GPU optimization.",
    category: "MLOps and Infra",
    features: ["Multi-framework support (TensorRT, PyTorch, TensorFlow, ONNX)", "Dynamic batching", "TensorRT optimization"],
    install: "docker pull nvcr.io/nvidia/tritonserver:24.01-py3 && pip install tritonclient[all]",
    useCase: "Enterprise-grade model serving with GPU optimization and multi-framework support"
  },
  {
    name: "NVIDIA NIM",
    url: "https://catalog.ngc.nvidia.com/orgs/nim/teams/meta/containers/llama3-8b-instruct",
    stars: "5k+",
    description: "NVIDIA's inference microservices for running optimized AI models with production-ready endpoints.",
    category: "MLOps and Infra",
    features: ["Pre-optimized model containers", "OpenAI-compatible API", "GPU-optimized inference"],
    install: "docker pull nvcr.io/nim/meta/llama3-8b-instruct:1.0.0 && pip install openai",
    useCase: "Production AI inference with NVIDIA-optimized model containers"
  },
  {
    name: "KServe",
    url: "https://github.com/kserve/kserve",
    stars: "6k+",
    description: "Standardized serverless model inference platform on Kubernetes for deploying ML models.",
    category: "MLOps and Infra",
    features: ["Model serving on Kubernetes", "Canary deployments and rollback", "Auto-scaling (including to zero)"],
    install: "kubectl apply -f https://github.com/kserve/kserve/releases/latest/download/kserve.yaml",
    useCase: "Production model serving on Kubernetes with auto-scaling"
  },
  {
    name: "Docker AI (Model Runner)",
    url: "https://github.com/docker/ai",
    stars: "3k+",
    description: "Docker's AI toolkit for running and managing AI models with containers and model runner.",
    category: "MLOps and Infra",
    features: ["Container-based model serving", "Model runner for local inference", "GPU support in containers"],
    install: "docker model run llama3.1 \"Hello, how are you?\"",
    useCase: "Containerized AI model deployment with GPU support"
  },
  {
    name: "BentoHub",
    url: "https://github.com/bentoml/BentoML",
    stars: "7k+",
    description: "Cloud platform for deploying and managing ML models as scalable API services.",
    category: "MLOps and Infra",
    features: ["One-click deployment", "Auto-scaling and GPU allocation", "Multi-cloud support"],
    install: "pip install bentoml cloud && bentoml cloud login",
    useCase: "Managed cloud deployment platform for ML model serving"
  },
  {
    name: "Guardrails AI",
    url: "https://github.com/guardrails-ai/guardrails",
    stars: "7k+",
    description: "SDK for validating and correcting LLM outputs with type safety, quality checks, and formatting.",
    category: "Security and Guardrails",
    features: ["Pydantic-based output validation", "Automatic correction of invalid outputs", "30+ pre-built validators"],
    install: "pip install guardrails-ai",
    useCase: "Ensuring LLM outputs meet quality, format, and safety requirements"
  },
  {
    name: "NeMo Guardrails",
    url: "https://github.com/NVIDIA/NeMo-Guardrails",
    stars: "6k+",
    description: "NVIDIA's toolkit for adding safety rails to LLM applications with programmable guardrails.",
    category: "Security and Guardrails",
    features: ["Programmable guardrails with Colang", "Topic restriction and topical rails", "Jailbreak detection"],
    install: "pip install nemoguardrails",
    useCase: "Adding programmable safety rails and content moderation to LLM applications"
  },
  {
    name: "LLM Guard",
    url: "https://github.com/protectai/llm-guard",
    stars: "4k+",
    description: "Security toolkit for LLMs with input/output scanning for prompt injection, data leakage, and toxicity.",
    category: "Security and Guardrails",
    features: ["Input and output scanners", "Prompt injection detection", "PII detection and redaction"],
    install: "pip install llm-guard",
    useCase: "Scanning and sanitizing LLM inputs and outputs for security and compliance"
  },
  {
    name: "Rebuff",
    url: "https://github.com/rebuff/rebuff",
    stars: "2k+",
    description: "Self-hardening prompt injection detection framework with multiple detection layers.",
    category: "Security and Guardrails",
    features: ["Multi-layered injection detection", "Heuristic-based detection", "ML-based detection model"],
    install: "pip install rebuff",
    useCase: "Multi-layered defense against prompt injection attacks in LLM applications"
  },
  {
    name: "Garak (LLM Vulnerability Scanner)",
    url: "https://github.com/leondz/garak",
    stars: "3k+",
    description: "LLM vulnerability scanner that probes models for weaknesses including hallucination, jailbreaking, and data leakage.",
    category: "Security and Guardrails",
    features: ["Automated vulnerability scanning", "Jailbreak detection testing", "Extensible probe architecture"],
    install: "pip install garak",
    useCase: "Identifying vulnerabilities and weaknesses in LLMs before deployment"
  },
  {
    name: "NVIDIA Guardrails SDK",
    url: "https://github.com/NVIDIA/NeMo-Guardrails",
    stars: "6k+",
    description: "NVIDIA's programmable guardrails framework for controlling LLM behavior and ensuring safety.",
    category: "Security and Guardrails",
    features: ["Colang-based guardrail programming", "Topic and content restrictions", "Built-in moderation"],
    install: "pip install nemoguardrails",
    useCase: "Programmable safety and behavioral control for LLM applications"
  }
];

export const REPO_CATEGORIES = [
  { id: "llm-frameworks", label: "LLM Frameworks & Orchestrators", icon: "🔗" },
  { id: "vector-databases", label: "Vector Databases & RAG", icon: "🗄️" },
  { id: "model-serving", label: "Model Serving & Inference", icon: "⚡" },
  { id: "ai-agents", label: "AI Agents & Tools", icon: "🤖" },
  { id: "computer-vision", label: "Computer Vision & Multimodal", icon: "👁️" },
  { id: "speech-audio", label: "Speech & Audio AI", icon: "🎤" },
  { id: "data-training", label: "Data & Training", icon: "📊" },
  { id: "ai-apps", label: "AI Apps & Demos", icon: "🚀" },
  { id: "mlops-infra", label: "MLOps & Infra", icon: "🏗️" },
  { id: "security-guardrails", label: "Security & Guardrails", icon: "🛡️" }
];
