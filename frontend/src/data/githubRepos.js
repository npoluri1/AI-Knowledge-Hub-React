export const GITHUB_REPOS = [
{
    name: "LangChain",
    url: "https://github.com/langchain-ai/langchain",
    stars: "98k+",
    description: "Build context-aware reasoning applications with composable LLM chains and agents.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Chain composition", "Agent executors", "Wide LLM provider support"],
    install: "pip install langchain",
    useCase: "Building complex LLM pipelines with chaining, retrieval, and tool use"
  },
{
    name: "LangGraph",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "Library for building stateful, multi-actor applications with LLMs as nodes in a graph.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Stateful graph execution", "Cycles and branching", "Human-in-the-loop"],
    install: "pip install langgraph",
    useCase: "Building stateful, cyclical agent workflows with LangChain"
  },
{
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    stars: "40k+",
    description: "Data framework for connecting LLMs with external data for RAG and agent use cases.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Data connectors", "Index structures", "Query engines"],
    install: "pip install llama-index",
    useCase: "Building RAG applications and connecting LLMs to custom data"
  },
{
    name: "Haystack",
    url: "https://github.com/deepset-ai/haystack",
    stars: "18k+",
    description: "End-to-end framework for building NLP and LLM applications with pipelines.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Pipeline architecture", "Component-based", "RAG and agent support"],
    install: "pip install haystack-ai",
    useCase: "Building production NLP and LLM pipelines with modular components"
  },
{
    name: "Semantic Kernel",
    url: "https://github.com/microsoft/semantic-kernel",
    stars: "23k+",
    description: "Microsoft SDK for integrating LLMs with conventional programming languages.",
    category: "LLM Frameworks & Orchestrators",
    features: ["C# and Python SDK", "Planner and memory", "Azure OpenAI integration"],
    install: "pip install semantic-kernel",
    useCase: "Integrating LLMs into .NET and Python enterprise applications"
  },
{
    name: "Dify",
    url: "https://github.com/langgenius/dify",
    stars: "60k+",
    description: "Open-source LLM app development platform with RAG, agents, and workflow orchestration.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Visual workflow builder", "Built-in RAG", "Multi-model support"],
    install: "docker compose up -d",
    useCase: "Building and deploying LLM-powered apps with a visual interface"
  },
{
    name: "Flowise",
    url: "https://github.com/FlowiseAI/Flowise",
    stars: "35k+",
    description: "Drag & drop UI to build customized LLM flows and agents using LangChain.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Visual flow builder", "LangChain integration", "API endpoints"],
    install: "npx flowise start",
    useCase: "Quickly prototyping LLM flows with a no-code visual builder"
  },
{
    name: "Langflow",
    url: "https://github.com/langflow-ai/langflow",
    stars: "35k+",
    description: "Visual framework for building multi-agent and RAG applications with LangChain.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Visual drag-and-drop", "Component marketplace", "Python and JS"],
    install: "pip install langflow",
    useCase: "Building and sharing LLM workflows visually"
  },
{
    name: "CrewAI",
    url: "https://github.com/crewAIInc/crewAI",
    stars: "25k+",
    description: "Framework for orchestrating role-playing autonomous AI agents working together.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Role-based agents", "Task delegation", "Multi-agent collaboration"],
    install: "pip install crewai",
    useCase: "Building teams of AI agents that collaborate on complex tasks"
  },
{
    name: "AutoGen",
    url: "https://github.com/microsoft/autogen",
    stars: "38k+",
    description: "Microsoft framework for building multi-agent conversations and task solving.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-agent conversations", "Code execution", "Human feedback loops"],
    install: "pip install pyautogen",
    useCase: "Building multi-agent systems with conversational task solving"
  },
{
    name: "ChatDev",
    url: "https://github.com/OpenBMB/ChatDev",
    stars: "26k+",
    description: "Virtual software company powered by multi-agent collaboration for chat-driven development.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Agent role-playing", "Software development lifecycle", "Chat-based workflow"],
    install: "pip install chatdev",
    useCase: "Building software through multi-agent conversational collaboration"
  },
{
    name: "MetaGPT",
    url: "https://github.com/geekan/MetaGPT",
    stars: "48k+",
    description: "Multi-agent framework assigning different roles to GPTs for complex software tasks.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Standardized SOPs", "Role-based agents", "Software engineering pipeline"],
    install: "pip install metagpt",
    useCase: "Automating complex software engineering with multi-agent collaboration"
  },
{
    name: "OpenHands",
    url: "https://github.com/All-Hands-AI/OpenHands",
    stars: "40k+",
    description: "Platform for AI software engineers that can perform coding tasks autonomously.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Code execution sandbox", "Browser interaction", "Multiple AI backends"],
    install: "docker compose up -d",
    useCase: "AI-powered autonomous software development and debugging"
  },
{
    name: "Agno",
    url: "https://github.com/agno-agi/agno",
    stars: "15k+",
    description: "Framework for building multi-modal AI agents with memory, knowledge, and tools.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-modal agents", "Built-in memory", "100+ integrations"],
    install: "pip install agno",
    useCase: "Building production-grade multi-modal AI agents"
  },
{
    name: "Atomic Agents",
    url: "https://github.com/BrainBlend-AI/atomic-agents",
    stars: "2k+",
    description: "Lightweight, composable AI agent framework built for simplicity and modularity.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Atomic composable design", "Minimal dependencies", "Schema-based I/O"],
    install: "pip install atomic-agents",
    useCase: "Building simple, composable AI agents with minimal overhead"
  },
{
    name: "Mirascope",
    url: "https://github.com/Mirascope/mirascope",
    stars: "3k+",
    description: "Python toolkit for building LLM applications with a decorator-based interface.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Decorator-based calls", "Provider agnostic", "Type-safe responses"],
    install: "pip install mirascope",
    useCase: "Building structured LLM applications with clean Pythonic APIs"
  },
{
    name: "DSPy",
    url: "https://github.com/stanfordnlp/dspy",
    stars: "19k+",
    description: "Framework for programming rather than prompting LLMs with modular signatures.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Signature-based programming", "Automatic optimization", "Module composition"],
    install: "pip install dspy",
    useCase: "Optimizing LLM pipelines through programmatic rather than prompt-based approaches"
  },
{
    name: "LiteLLM",
    url: "https://github.com/BerriAI/litellm",
    stars: "22k+",
    description: "Unified API to access 100+ LLMs through OpenAI-compatible interface.",
    category: "LLM Frameworks & Orchestrators",
    features: ["100+ LLM support", "OpenAI-compatible proxy", "Cost tracking"],
    install: "pip install litellm",
    useCase: "Routing and managing calls across multiple LLM providers uniformly"
  },
{
    name: "LlamaDeploy",
    url: "https://github.com/run-llama/llama-deploy",
    stars: "3k+",
    description: "Deployment framework for LlamaIndex workflows as microservices.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Microservice deployment", "Workflow orchestration", "Kubernetes ready"],
    install: "pip install llama-deploy",
    useCase: "Deploying LlamaIndex workflows as production microservices"
  },
{
    name: "Pydantic AI",
    url: "https://github.com/pydantic/pydantic-ai",
    stars: "8k+",
    description: "Type-safe AI agent framework built on Pydantic with structured outputs and streaming.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Pydantic type safety", "Structured outputs", "Dependency injection"],
    install: "pip install pydantic-ai",
    useCase: "Building type-safe AI agents with structured data validation"
  },
{
    name: "Instructor",
    url: "https://github.com/jxnl/instructor",
    stars: "15k+",
    description: "Structured extraction from LLMs using Pydantic with patching for OpenAI clients.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Pydantic model extraction", "Automatic retries", "Multi-provider"],
    install: "pip install instructor",
    useCase: "Extracting structured data from LLMs with type validation"
  },
{
    name: "Magentic",
    url: "https://github.com/OutOfBedlam/magentic",
    stars: "3k+",
    description: "Build LLM-powered applications using Pydantic models as function return types.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Pydantic integration", "Type annotations", "Chat and function calls"],
    install: "pip install magentic",
    useCase: "Using type annotations to structure LLM outputs in Python"
  },
{
    name: "Griptape",
    url: "https://github.com/griptape-ai/griptape",
    stars: "3k+",
    description: "Enterprise-ready framework for building AI agents with structured data flows.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Structured data pipelines", "Memory management", "Tool chains"],
    install: "pip install griptape",
    useCase: "Building enterprise AI agents with structured data handling"
  },
{
    name: "Composio",
    url: "https://github.com/ComposioHQ/composio",
    stars: "15k+",
    description: "Platform for connecting AI agents to 200+ apps and tools with managed auth.",
    category: "LLM Frameworks & Orchestrators",
    features: ["200+ integrations", "Managed authentication", "Agent tooling"],
    install: "pip install composio-core",
    useCase: "Connecting AI agents to external apps with pre-built integrations"
  },
{
    name: "Swarms",
    url: "https://github.com/kyegomez/swarms",
    stars: "9k+",
    description: "Framework for building scalable multi-agent swarm systems with LLMs.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Agent swarms", "Scalable orchestration", "Multiple agent topologies"],
    install: "pip install swarms",
    useCase: "Building large-scale multi-agent swarm systems"
  },
{
    name: "NemoGuardrails",
    url: "https://github.com/NVIDIA/NeMo-Guardrails",
    stars: "6k+",
    description: "Toolkit for adding programmable guardrails to LLM-based conversational systems.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Colang programming", "Content moderation", "Topic control"],
    install: "pip install nemoguardrails",
    useCase: "Adding safety rails and content moderation to LLM chatbots"
  },
{
    name: "PromptFlow",
    url: "https://github.com/microsoft/promptflow",
    stars: "9k+",
    description: "Build, evaluate, and deploy high-quality LLM apps with Microsoft toolchain.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Visual flow building", "Evaluation tools", "Azure integration"],
    install: "pip install promptflow",
    useCase: "Developing and deploying LLM apps with built-in evaluation"
  },
{
    name: "Vercel AI SDK",
    url: "https://github.com/vercel/ai",
    stars: "30k+",
    description: "TypeScript toolkit for building AI-powered applications with streaming support.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Streaming responses", "React hooks", "Multi-provider support"],
    install: "npm install ai",
    useCase: "Building AI-powered web applications with TypeScript and React"
  },
{
    name: "LLMWare",
    url: "https://github.com/llmware-ai/llmware",
    stars: "9k+",
    description: "Framework for building enterprise LLM applications with retrieval and analytics.",
    category: "LLM Frameworks & Orchestrators",
    features: ["RAG pipelines", "Document parsing", "Enterprise analytics"],
    install: "pip install llmware",
    useCase: "Enterprise LLM applications with document intelligence"
  },
{
    name: "Ragflow",
    url: "https://github.com/infiniflow/ragflow",
    stars: "30k+",
    description: "Open-source RAG engine with deep document understanding and chunking.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Deep document parsing", "Intelligent chunking", "Visual knowledge base"],
    install: "docker compose up -d",
    useCase: "Building high-quality RAG with superior document understanding"
  },
{
    name: "Anything LLM",
    url: "https://github.com/Mintplex-Labs/anything-llm",
    stars: "28k+",
    description: "All-in-one desktop and Docker app for RAG with any LLM and vector DB.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-LLM support", "Multi-vector DB", "Desktop and Docker"],
    install: "docker compose up -d",
    useCase: "Personal and team RAG applications with easy setup"
  },
{
    name: "Quivr",
    url: "https://github.com/QuivrHQ/quivr",
    stars: "36k+",
    description: "Personal AI assistant that can ingest, transform, and query your documents.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-format ingestion", "Brain feature", "Chat interface"],
    install: "docker compose up -d",
    useCase: "Building a personal AI assistant over your documents"
  },
{
    name: "Private GPT",
    url: "https://github.com/zylon-ai/private-gpt",
    stars: "22k+",
    description: "Interact with your documents using LLMs with complete privacy and no data leaks.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Fully local", "RAG pipeline", "API and UI"],
    install: "pip install privategpt",
    useCase: "Private document interaction without sending data externally"
  },
{
    name: "LocalGPT",
    url: "https://github.com/danielfleischhacker/local-gpt",
    stars: "17k+",
    description: "Chat with your documents on your local device with no data leaving.",
    category: "LLM Frameworks & Orchestrators",
    features: ["100% local", "GPU and CPU support", "Multiple file formats"],
    install: "pip install -r requirements.txt",
    useCase: "Fully local document chat without internet dependency"
  },
{
    name: "H2O GPT",
    url: "https://github.com/h2oai/h2ogpt",
    stars: "11k+",
    description: "H2O.ai platform for LLMs with RAG, fine-tuning, and multi-modal support.",
    category: "LLM Frameworks & Orchestrators",
    features: ["RAG and agents", "Fine-tuning", "Image and document understanding"],
    install: "pip install h2ogpt",
    useCase: "Enterprise LLM platform with RAG and fine-tuning capabilities"
  },
{
    name: "Open WebUI",
    url: "https://github.com/open-webui/open-webui",
    stars: "50k+",
    description: "Feature-rich self-hosted web UI for LLMs with RAG and multi-model support.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-model support", "Built-in RAG", "User management"],
    install: "pip install open-webui",
    useCase: "Self-hosted web interface for multiple LLM backends"
  },
{
    name: "Khoj",
    url: "https://github.com/khoj-ai/khoj",
    stars: "17k+",
    description: "AI-powered personal assistant with self-hosted and cloud options.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Self-hosted", "Markdown and org integration", "Web and desktop"],
    install: "pip install khoj",
    useCase: "Personal AI assistant with knowledge base capabilities"
  },
{
    name: "Ollama",
    url: "https://github.com/ollama/ollama",
    stars: "115k+",
    description: "Get up and running with large language models locally on any machine.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Local LLM hosting", "Model library", "OpenAI API compatibility"],
    install: "curl -fsSL https://ollama.ai/install.sh | sh",
    useCase: "Running LLMs locally with easy model management"
  },
{
    name: "Jan",
    url: "https://github.com/janhq/jan",
    stars: "25k+",
    description: "Offline-capable open-source AI assistant that runs on consumer hardware.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Fully offline", "Multiple model support", "Desktop app"],
    install: "Download from jan.ai",
    useCase: "Private offline AI assistant on desktop"
  },
{
    name: "LM Studio",
    url: "https://github.com/lmstudio-ai/lmstudio",
    stars: "8k+",
    description: "Discover, download, and run local LLMs with a beautiful desktop interface.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Model discovery", "Local inference", "OpenAI-compatible server"],
    install: "Download from lmstudio.ai",
    useCase: "Discovering and running local LLMs with a GUI"
  },
{
    name: "text-generation-webui",
    url: "https://github.com/oobabooga/text-generation-webui",
    stars: "40k+",
    description: "Gradio UI for running LLMs locally with support for multiple backends.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-backend support", "Character system", "Extensions"],
    install: "git clone and run start script",
    useCase: "Running and experimenting with local LLMs via web UI"
  },
{
    name: "GPT4All",
    url: "https://github.com/nomic-ai/gpt4all",
    stars: "73k+",
    description: "Locally run ChatGPT-like models on any device with no data sent to cloud.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Fully local", "Desktop app", "Model zoo"],
    install: "Download from gpt4all.io",
    useCase: "Running chat models fully locally without cloud dependencies"
  },
{
    name: "Chainlit",
    url: "https://github.com/Chainlit/chainlit",
    stars: "7k+",
    description: "Open-source framework for building conversational AI interfaces in minutes.",
    category: "LLM Frameworks & Orchestrators",
    features: ["LangChain integration", "Task instrumentation", "Multi-modal"],
    install: "pip install chainlit",
    useCase: "Building production conversational AI interfaces rapidly"
  },
{
    name: "Rasa",
    url: "https://github.com/RasaHQ/rasa",
    stars: "19k+",
    description: "Open-source ML framework for automated text and voice conversations.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Intent classification", "Dialogue management", "Custom actions"],
    install: "pip install rasa",
    useCase: "Building enterprise conversational AI with dialogue management"
  },
{
    name: "Botpress",
    url: "https://github.com/botpress/botpress",
    stars: "13k+",
    description: "Open-source conversational AI platform powered by LLMs for enterprise chatbots.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Visual flow builder", "Knowledge bases", "Multi-channel"],
    install: "npm install -g botpress",
    useCase: "Enterprise chatbot development with LLM and knowledge base integration"
  },
{
    name: "Rivet",
    url: "https://github.com/Ironclad/rivet",
    stars: "3k+",
    description: "Visual AI agent programming environment for building LLM workflows.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Node-based editor", "Tauri desktop app", "Plugin system"],
    install: "Download from rivet.ironcladapp.net",
    useCase: "Visual programming of AI agent workflows and chains"
  },
{
    name: "Semantic Router",
    url: "https://github.com/aurelio-labs/semantic-router",
    stars: "4k+",
    description: "Ultra-fast decision making layer using vector embeddings for LLM routing.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Millisecond routing", "Voice support", "Dynamic route management"],
    install: "pip install semantic-router",
    useCase: "Ultra-fast intent classification and routing for LLM applications"
  },
{
    name: "Kubeflow",
    url: "https://github.com/kubeflow/kubeflow",
    stars: "14k+",
    description: "ML toolkit for Kubernetes with pipelines, training, and serving components.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Pipeline orchestration", "Model training", "Jupyter integration"],
    install: "kubectl apply -f",
    useCase: "End-to-end ML workflows on Kubernetes infrastructure"
  },
{
    name: "LangChain4j",
    url: "https://github.com/langchain4j/langchain4j",
    stars: "5k+",
    description: "Java framework for building LLM-powered applications with LangChain concepts.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Java native", "RAG support", "Agent framework"],
    install: "Maven dependency",
    useCase: "Building LLM applications in the Java ecosystem"
  },
{
    name: "LangChain.js",
    url: "https://github.com/langchain-ai/langchainjs",
    stars: "13k+",
    description: "JavaScript/TypeScript framework for building LLM-powered applications.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Full-stack support", "Node and browser", "Streaming"],
    install: "npm install langchain",
    useCase: "Building LLM applications in JavaScript and TypeScript"
  },
{
    name: "Helicone",
    url: "https://github.com/Helicone/helicone",
    stars: "4k+",
    description: "Open-source LLM observability platform for logging, analytics, and cost tracking.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Request logging", "Cost analytics", "Caching and rate limiting"],
    install: "docker compose up",
    useCase: "Monitoring and optimizing LLM API costs and performance"
  },
{
    name: "Portkey",
    url: "https://github.com/Portkey-AI/gateway",
    stars: "3k+",
    description: "AI Gateway for LLM calls with routing, fallbacks, and observability.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Multi-provider routing", "Guardrails", "Caching"],
    install: "npm install portkey-ai",
    useCase: "Managing LLM API calls with reliability and observability"
  },
{
    name: "OpenLLM",
    url: "https://github.com/bentoml/OpenLLM",
    stars: "10k+",
    description: "Open-platform for serving LLMs with built-in continuous batching and streaming.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Continuous batching", "Streaming", "Adaptive batching"],
    install: "pip install openllm",
    useCase: "Serving open-source LLMs with high throughput"
  },
{
    name: "NVIDIA NIM",
    url: "https://github.com/NVIDIA/nim-llm",
    stars: "5k+",
    description: "NVIDIA inference microservices for optimized LLM deployment.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Optimized kernels", "Multi-GPU", "Container deployment"],
    install: "docker pull nvcr.io",
    useCase: "High-performance LLM inference on NVIDIA hardware"
  },
{
    name: "LlamaCPP",
    url: "https://github.com/ggerganov/llama.cpp",
    stars: "70k+",
    description: "Port of Meta's LLaMA model in C/C++ with GGML quantization support.",
    category: "LLM Frameworks & Orchestrators",
    features: ["CPU and GPU inference", "Quantization formats", "Cross-platform"],
    install: "cmake -B build && cmake --build build",
    useCase: "Running quantized LLMs on consumer hardware efficiently"
  },
{
    name: "MLC LLM",
    url: "https://github.com/mlc-ai/mlc-llm",
    stars: "19k+",
    description: "Universal LLM deployment engine with ML compilation for any platform.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Universal deployment", "Hardware optimization", "Web and mobile"],
    install: "pip install mlc-llm",
    useCase: "Deploying LLMs efficiently on diverse hardware platforms"
  },
{
    name: "Exo",
    url: "https://github.com/exo-explore/exo",
    stars: "18k+",
    description: "Run AI at home with a decentralized cluster of consumer devices.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Device clustering", "Automatic sharding", "Peer-to-peer"],
    install: "pip install exo",
    useCase: "Distributed LLM inference across multiple consumer devices"
  },
{
    name: "Chroma",
    url: "https://github.com/chroma-core/chroma",
    stars: "16k+",
    description: "AI-native open-source embedding database for building RAG applications.",
    category: "Vector Databases & RAG",
    features: ["Embedding storage", "Similarity search", "Metadata filtering"],
    install: "pip install chromadb",
    useCase: "Building RAG applications with a simple vector database"
  },
{
    name: "Qdrant",
    url: "https://github.com/qdrant/qdrant",
    stars: "22k+",
    description: "High-performance vector similarity search engine with rich filtering.",
    category: "Vector Databases & RAG",
    features: ["Payload filtering", "Quantization", "Distributed deployment"],
    install: "docker run -p 6333:6333 qdrant/qdrant",
    useCase: "Production vector search with advanced filtering capabilities"
  },
{
    name: "Milvus",
    url: "https://github.com/milvus-io/milvus",
    stars: "30k+",
    description: "Cloud-native vector database built for scalable similarity search.",
    category: "Vector Databases & RAG",
    features: ["Scalable architecture", "GPU indexing", "Hybrid search"],
    install: "docker compose up -d",
    useCase: "Large-scale vector similarity search for AI applications"
  },
{
    name: "Weaviate",
    url: "https://github.com/weaviate/weaviate",
    stars: "12k+",
    description: "AI-native vector database with built-in modules for embeddings and generative search.",
    category: "Vector Databases & RAG",
    features: ["Built-in vectorizer", "GraphQL API", "Multi-tenancy"],
    install: "docker run -p 8080:8080 semitechnologies/weaviate",
    useCase: "Building AI-native applications with integrated vector search"
  },
{
    name: "FAISS",
    url: "https://github.com/facebookresearch/faiss",
    stars: "31k+",
    description: "Facebook AI Similarity Search library for efficient similarity search of vectors.",
    category: "Vector Databases & RAG",
    features: ["GPU acceleration", "Multiple index types", "Memory efficient"],
    install: "pip install faiss-cpu",
    useCase: "Efficient nearest neighbor search for vector embeddings"
  },
{
    name: "Annoy",
    url: "https://github.com/spotify/annoy",
    stars: "13k+",
    description: "Approximate Nearest Neighbors library optimized for memory and speed by Spotify.",
    category: "Vector Databases & RAG",
    features: ["Memory efficient", "Read-only maps", "Multiple trees"],
    install: "pip install annoy",
    useCase: "Lightweight approximate nearest neighbor search"
  },
{
    name: "ScaNN",
    url: "https://github.com/google-research/google-research",
    stars: "3k+",
    description: "Google Research library for efficient vector similarity search.",
    category: "Vector Databases & RAG",
    features: ["Anisotropic quantization", "GPU support", "High throughput"],
    install: "pip install scann",
    useCase: "High-speed vector search with Google's optimization techniques"
  },
{
    name: "Supabase pgvector",
    url: "https://github.com/pgvector/pgvector",
    stars: "12k+",
    description: "Open-source vector similarity search extension for PostgreSQL.",
    category: "Vector Databases & RAG",
    features: ["PostgreSQL native", "IVFFlat and HNSW", "SQL interface"],
    install: "CREATE EXTENSION vector;",
    useCase: "Adding vector search to existing PostgreSQL databases"
  },
{
    name: "Redis Stack",
    url: "https://github.com/RedisStack/redis-stack",
    stars: "3k+",
    description: "Redis with vector search, JSON, and time series modules for AI applications.",
    category: "Vector Databases & RAG",
    features: ["Vector search", "JSON storage", "Low latency"],
    install: "docker run -p 6379:6379 redis/redis-stack-server",
    useCase: "Ultra-low latency vector search with Redis"
  },
{
    name: "Elasticsearch",
    url: "https://github.com/elastic/elasticsearch",
    stars: "71k+",
    description: "Distributed search and analytics engine with dense vector search capabilities.",
    category: "Vector Databases & RAG",
    features: ["BM25 and vector", "Hybrid search", "ML inference"],
    install: "docker run -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch",
    useCase: "Combining text search with vector similarity in Elasticsearch"
  },
{
    name: "OpenSearch",
    url: "https://github.com/opensearch-project/OpenSearch",
    stars: "10k+",
    description: "Open-source search and analytics engine with k-NN vector search.",
    category: "Vector Databases & RAG",
    features: ["k-NN search", "Lucene and FAISS", "Distributed"],
    install: "docker run -p 9200:9200 opensearchproject/opensearch",
    useCase: "Open-source vector search with search analytics"
  },
{
    name: "LanceDB",
    url: "https://github.com/lancedb/lancedb",
    stars: "5k+",
    description: "Developer-friendly serverless vector database built on Apache Arrow.",
    category: "Vector Databases & RAG",
    features: ["Zero-copy reads", "Versioning", "Multi-modal support"],
    install: "pip install lancedb",
    useCase: "Embedded vector database for ML and AI applications"
  },
{
    name: "Marqo",
    url: "https://github.com/marqo-ai/marqo",
    stars: "6k+",
    description: "All-in-one vector search engine with built-in embedding generation.",
    category: "Vector Databases & RAG",
    features: ["Built-in embeddings", "Hybrid search", "Multi-modal"],
    install: "docker run -p 8888:8888 marqoai/marqo",
    useCase: "Unified vector search with integrated embedding generation"
  },
{
    name: "Vespa",
    url: "https://github.com/vespa-engine/vespa",
    stars: "6k+",
    description: "Big data serving engine with vector search, text search, and recommendations.",
    category: "Vector Databases & RAG",
    features: ["Hybrid search", "Ranking profiles", "Real-time indexing"],
    install: "docker run -p 8080:8080 vespaengine/vespa",
    useCase: "Complex search and recommendation systems at scale"
  },
{
    name: "Vald",
    url: "https://github.com/vdaas/vald",
    stars: "2k+",
    description: "Cloud-native distributed vector search engine designed for massive scale.",
    category: "Vector Databases & RAG",
    features: ["Kubernetes native", "Auto-indexing", "Horizontal scaling"],
    install: "helm install vald",
    useCase: "Large-scale distributed vector search on Kubernetes"
  },
{
    name: "GraphRAG",
    url: "https://github.com/microsoft/graphrag",
    stars: "21k+",
    description: "Microsoft's graph-based RAG approach for enhanced LLM reasoning over data.",
    category: "Vector Databases & RAG",
    features: ["Knowledge graphs", "Community detection", "Multi-hop reasoning"],
    install: "pip install graphrag",
    useCase: "Enhanced RAG using knowledge graph relationships"
  },
{
    name: "LightRAG",
    url: "https://github.com/HKUDS/LightRAG",
    stars: "12k+",
    description: "Simple and fast graph-based RAG with incremental update capabilities.",
    category: "Vector Databases & RAG",
    features: ["Graph-based retrieval", "Incremental updates", "Low latency"],
    install: "pip install lightrag-hku",
    useCase: "Fast graph-enhanced RAG with incremental knowledge updates"
  },
{
    name: "LlamaParse",
    url: "https://github.com/run-llama/llama_parse",
    stars: "2k+",
    description: "LlamaIndex document parser optimized for RAG with LLMs.",
    category: "Vector Databases & RAG",
    features: ["Multi-format parsing", "Table extraction", "Layout understanding"],
    install: "pip install llama-parse",
    useCase: "Parsing complex documents for RAG pipelines"
  },
{
    name: "Unstructured",
    url: "https://github.com/Unstructured-IO/unstructured",
    stars: "9k+",
    description: "Open-source library for preprocessing documents for LLM and RAG pipelines.",
    category: "Vector Databases & RAG",
    features: ["Multi-format parsing", "Table extraction", "OCR support"],
    install: "pip install unstructured",
    useCase: "Preprocessing PDFs, HTML, and other docs for RAG"
  },
{
    name: "Docling",
    url: "https://github.com/DS4SD/docling",
    stars: "14k+",
    description: "IBM document understanding toolkit converting documents to structured formats.",
    category: "Vector Databases & RAG",
    features: ["PDF understanding", "Table extraction", "Multi-format output"],
    install: "pip install docling",
    useCase: "Converting complex documents to structured data for AI"
  },
{
    name: "Marker",
    url: "https://github.com/VikParuchuri/marker",
    stars: "18k+",
    description: "Fast, high-quality PDF to markdown conversion pipeline.",
    category: "Vector Databases & RAG",
    features: ["Layout detection", "Table extraction", "Multi-format"],
    install: "pip install marker-pdf",
    useCase: "Converting PDFs to clean markdown for LLM processing"
  },
{
    name: "Nougat",
    url: "https://github.com/facebookresearch/nougat",
    stars: "9k+",
    description: "Meta's neural OCR for understanding scientific documents and equations.",
    category: "Vector Databases & RAG",
    features: ["Scientific document OCR", "Equation understanding", "Layout aware"],
    install: "pip install nougat-ocr",
    useCase: "Extracting structured content from scientific papers"
  },
{
    name: "Grobid",
    url: "https://github.com/kermitt2/grobid",
    stars: "3k+",
    description: "ML library for extracting structured information from scholarly papers.",
    category: "Vector Databases & RAG",
    features: ["PDF parsing", "Citation extraction", "TEI XML output"],
    install: "docker pull lfoppiano/grobid",
    useCase: "Parsing academic papers for structured metadata extraction"
  },
{
    name: "Jina Reader",
    url: "https://github.com/jina-ai/reader",
    stars: "16k+",
    description: "Convert any URL to an LLM-ready text with Jina Reader.",
    category: "Vector Databases & RAG",
    features: ["URL to text", "JavaScript rendering", "API endpoint"],
    install: "curl https://r.jina.ai/[url]",
    useCase: "Converting web pages to LLM-readable text for RAG"
  },
{
    name: "Kotaemon",
    url: "https://github.com/Cinnamon/kotaemon",
    stars: "16k+",
    description: "Open-source RAG UI for chatting with documents with multi-model support.",
    category: "Vector Databases & RAG",
    features: ["Multi-LLM support", "Document viewer", "Citation support"],
    install: "pip install kotaemon",
    useCase: "Interactive document Q&A with citation tracking"
  },
{
    name: "Embedchain",
    url: "https://github.com/mem0ai/mem0",
    stars: "16k+",
    description: "Memory layer for AI applications with long-term personalization.",
    category: "Vector Databases & RAG",
    features: ["Long-term memory", "Personalization", "Multi-source"],
    install: "pip install mem0ai",
    useCase: "Adding persistent memory to AI applications"
  },
{
    name: "Danswer",
    url: "https://github.com/danswer-ai/danswer",
    stars: "11k+",
    description: "Enterprise AI search and question answering across all company documents.",
    category: "Vector Databases & RAG",
    features: ["Connectors to 40+ apps", "Hybrid search", "Access control"],
    install: "docker compose up -d",
    useCase: "Enterprise AI search across connected knowledge sources"
  },
{
    name: "RAGAS",
    url: "https://github.com/explodinggradients/ragas",
    stars: "8k+",
    description: "Evaluation framework for RAG pipelines with faithfulness and relevancy metrics.",
    category: "Vector Databases & RAG",
    features: ["Faithfulness metrics", "Relevancy scoring", "Dataset generation"],
    install: "pip install ragas",
    useCase: "Evaluating and benchmarking RAG pipeline quality"
  },
{
    name: "vLLM",
    url: "https://github.com/vllm-project/vllm",
    stars: "36k+",
    description: "High-throughput LLM serving with PagedAttention for optimized inference.",
    category: "Model Serving & Inference",
    features: ["PagedAttention", "Continuous batching", "Tensor parallelism"],
    install: "pip install vllm",
    useCase: "High-throughput production LLM serving with optimal GPU memory"
  },
{
    name: "TGI",
    url: "https://github.com/huggingface/text-generation-inference",
    stars: "10k+",
    description: "Hugging Face optimized inference for LLMs with Flash Attention and quantization.",
    category: "Model Serving & Inference",
    features: ["Flash Attention", "Quantization support", "Token streaming"],
    install: "docker run ghcr.io/huggingface/text-generation-inference",
    useCase: "Production LLM serving with Hugging Face ecosystem integration"
  },
{
    name: "SGLang",
    url: "https://github.com/sgl-project/sglang",
    stars: "12k+",
    description: "Fast serving framework for large language models with RadixAttention.",
    category: "Model Serving & Inference",
    features: ["RadixAttention", "Prefix caching", "Structured generation"],
    install: "pip install sglang",
    useCase: "Ultra-fast LLM serving with automatic prefix caching"
  },
{
    name: "TensorRT-LLM",
    url: "https://github.com/NVIDIA/TensorRT-LLM",
    stars: "9k+",
    description: "NVIDIA toolkit for optimizing and deploying LLMs with TensorRT.",
    category: "Model Serving & Inference",
    features: ["FP8 quantization", "Multi-GPU", "In-flight batching"],
    install: "pip install tensorrt-llm",
    useCase: "Maximum performance LLM inference on NVIDIA GPUs"
  },
{
    name: "ONNX Runtime",
    url: "https://github.com/microsoft/onnxruntime",
    stars: "14k+",
    description: "Cross-platform ML inference accelerator for optimized model execution.",
    category: "Model Serving & Inference",
    features: ["Hardware acceleration", "Cross-platform", "Quantization"],
    install: "pip install onnxruntime",
    useCase: "Accelerated inference for models across diverse hardware"
  },
{
    name: "Ray Serve",
    url: "https://github.com/ray-project/ray",
    stars: "36k+",
    description: "Scalable model serving library for deploying ML models as APIs.",
    category: "Model Serving & Inference",
    features: ["Auto-scaling", "Multi-model", "GPU sharing"],
    install: "pip install ray[serve]",
    useCase: "Scalable model serving with automatic resource management"
  },
{
    name: "BentoML",
    url: "https://github.com/bentoml/BentoML",
    stars: "6k+",
    description: "Framework for building, shipping, and scaling production ML services.",
    category: "Model Serving & Inference",
    features: ["Model packaging", "Adaptive batching", "Cloud deployment"],
    install: "pip install bentoml",
    useCase: "Packaging and deploying ML models as production services"
  },
{
    name: "TorchServe",
    url: "https://github.com/pytorch/serve",
    stars: "9k+",
    description: "Model serving and inference for PyTorch with REST and gRPC APIs.",
    category: "Model Serving & Inference",
    features: ["PyTorch native", "Multi-model", "Snapshots and rollback"],
    install: "pip install torchserve",
    useCase: "Serving PyTorch models in production environments"
  },
{
    name: "TensorFlow Serving",
    url: "https://github.com/tensorflow/serving",
    stars: "13k+",
    description: "Flexible high-performance ML serving library for TensorFlow models.",
    category: "Model Serving & Inference",
    features: ["gRPC and REST", "Model versioning", "Batching"],
    install: "docker pull tensorflow/serving",
    useCase: "Production serving for TensorFlow models"
  },
{
    name: "Triton Inference Server",
    url: "https://github.com/triton-inference-server/server",
    stars: "8k+",
    description: "NVIDIA open-source inference server for multiple ML frameworks.",
    category: "Model Serving & Inference",
    features: ["Multi-framework", "Dynamic batching", "Concurrent model execution"],
    install: "docker pull nvcr.io/nvidia/tritonserver",
    useCase: "Unified inference serving for diverse ML models"
  },
{
    name: "LMDeploy",
    url: "https://github.com/InternLM/lmdeploy",
    stars: "4k+",
    description: "Toolkit for efficient LLM inference and serving with TurboMind engine.",
    category: "Model Serving & Inference",
    features: ["TurboMind engine", "W4A16 quantization", "Persistent batch"],
    install: "pip install lmdeploy",
    useCase: "Efficient LLM serving with optimized CUDA kernels"
  },
{
    name: "DeepSpeed",
    url: "https://github.com/microsoft/DeepSpeed",
    stars: "36k+",
    description: "Deep learning optimization library for distributed training and inference.",
    category: "Model Serving & Inference",
    features: ["ZeRO optimization", "Pipeline parallelism", "Inference engine"],
    install: "pip install deepspeed",
    useCase: "Distributed training and inference at scale for large models"
  },
{
    name: "Xinference",
    url: "https://github.com/xorbitsai/xinference",
    stars: "6k+",
    description: "Open-source platform for running and deploying AI models locally or in cloud.",
    category: "Model Serving & Inference",
    features: ["Local and cloud", "Model management", "Multi-framework"],
    install: "pip install xinference",
    useCase: "Flexible AI model deployment across local and cloud environments"
  },
{
    name: "LocalAI",
    url: "https://github.com/mudler/localai",
    stars: "26k+",
    description: "Free OpenAI-compatible API to run LLMs, image, and audio models locally.",
    category: "Model Serving & Inference",
    features: ["OpenAI-compatible", "Multi-modal", "CPU and GPU"],
    install: "docker run localai/localai",
    useCase: "Drop-in local replacement for OpenAI API"
  },
{
    name: "OpenAI Python SDK",
    url: "https://github.com/openai/openai-python",
    stars: "24k+",
    description: "Official Python library for the OpenAI API with GPT, DALL-E, and Whisper.",
    category: "Model Serving & Inference",
    features: ["GPT-4o", "DALL-E 3", "Streaming and functions"],
    install: "pip install openai",
    useCase: "Accessing OpenAI's models and APIs from Python"
  },
{
    name: "Anthropic Python SDK",
    url: "https://github.com/anthropics/anthropic-sdk-python",
    stars: "3k+",
    description: "Official Python SDK for Anthropic's Claude API with tool use support.",
    category: "Model Serving & Inference",
    features: ["Claude 3.5", "Tool use", "Streaming"],
    install: "pip install anthropic",
    useCase: "Building applications with Anthropic's Claude models"
  },
{
    name: "Groq Python SDK",
    url: "https://github.com/groq/groq-python",
    stars: "2k+",
    description: "Python SDK for Groq's ultra-fast LLM inference on LPU hardware.",
    category: "Model Serving & Inference",
    features: ["Ultra-fast inference", "LPU hardware", "OpenAI-compatible"],
    install: "pip install groq",
    useCase: "Accessing Groq's high-speed LLM inference service"
  },
{
    name: "Together AI SDK",
    url: "https://github.com/togethercomputer/together-python",
    stars: "1k+",
    description: "Python SDK for Together AI's inference and fine-tuning platform.",
    category: "Model Serving & Inference",
    features: ["Model catalog", "Fine-tuning", "Inference API"],
    install: "pip install together",
    useCase: "Using Together AI's cloud inference and fine-tuning services"
  },
{
    name: "Replicate Python",
    url: "https://github.com/replicate/replicate-python",
    stars: "2k+",
    description: "Python client for running ML models via Replicate's cloud platform.",
    category: "Model Serving & Inference",
    features: ["Model hosting", "Webhook support", "GPU infrastructure"],
    install: "pip install replicate",
    useCase: "Running and deploying ML models on Replicate's cloud"
  },
{
    name: "Modal",
    url: "https://github.com/modal-labs/modal-client",
    stars: "4k+",
    description: "Cloud platform for running AI workloads with serverless GPUs.",
    category: "Model Serving & Inference",
    features: ["Serverless GPUs", "Instant scaling", "Python-native"],
    install: "pip install modal",
    useCase: "Running AI workloads on serverless GPU infrastructure"
  },
{
    name: "Cog",
    url: "https://github.com/replicate/cog",
    stars: "7k+",
    description: "Tool for packaging ML models into reproducible Docker containers.",
    category: "Model Serving & Inference",
    features: ["Model packaging", "Docker containers", "Predict interface"],
    install: "sudo curl -o /usr/local/bin/cog -L https://github.com/replicate/cog/releases/latest/download/cog_$(uname -s)_$(uname -m)",
    useCase: "Packaging ML models as reproducible containers"
  },
{
    name: "LangServe",
    url: "https://github.com/langchain-ai/langserve",
    stars: "2k+",
    description: "Deploy LangChain chains as REST APIs with automatic schema generation.",
    category: "Model Serving & Inference",
    features: ["REST API auto-gen", "Playground UI", "LangSmith integration"],
    install: "pip install langserve",
    useCase: "Deploying LangChain chains as production REST APIs"
  },
{
    name: "FastEmbed",
    url: "https://github.com/qdrant/fastembed",
    stars: "3k+",
    description: "Fast, local, open-source embedding library by Qdrant with ONNX support.",
    category: "Model Serving & Inference",
    features: ["ONNX runtime", "Local embeddings", "Batch processing"],
    install: "pip install fastembed",
    useCase: "Fast local embedding generation without cloud APIs"
  },
{
    name: "Infinity Embeddings",
    url: "https://github.com/michaelfeil/infinity",
    stars: "4k+",
    description: "High-throughput embedding server with batching and multi-framework support.",
    category: "Model Serving & Inference",
    features: ["Batched inference", "Multi-backend", "OpenAI-compatible"],
    install: "pip install infinity-embeddings",
    useCase: "High-performance embedding generation for RAG pipelines"
  },
{
    name: "CTranslate2",
    url: "https://github.com/OpenNMT/CTranslate2",
    stars: "3k+",
    description: "Fast inference engine for Transformer models with quantization support.",
    category: "Model Serving & Inference",
    features: ["INT8 and FP16", "Dynamic batching", "CPU and GPU"],
    install: "pip install ctranslate2",
    useCase: "Efficient Transformer model inference with quantization"
  },
{
    name: "Candle",
    url: "https://github.com/huggingface/candle",
    stars: "12k+",
    description: "Minimalist ML framework for Rust with focus on performance and usability.",
    category: "Model Serving & Inference",
    features: ["Rust-native", "Metal and CUDA", "WASM support"],
    install: "cargo add candle-core",
    useCase: "Building high-performance ML applications in Rust"
  },
{
    name: "Llamafile",
    url: "https://github.com/Mozilla-Ocho/llamafile",
    stars: "20k+",
    description: "Distribute and run LLMs as a single executable file on any computer.",
    category: "Model Serving & Inference",
    features: ["Single file deployment", "Cross-platform", "OpenAI-compatible"],
    install: "Download llamafile executable",
    useCase: "Distributing LLMs as standalone executables"
  },
{
    name: "AutoGPT",
    url: "https://github.com/Significant-Gravitas/AutoGPT",
    stars: "170k+",
    description: "Autonomous AI agent that chains GPT-4 tasks to accomplish complex goals.",
    category: "AI Agents & Tools",
    features: ["Autonomous task execution", "Web browsing", "File management"],
    install: "git clone and pip install -r requirements.txt",
    useCase: "Automating complex multi-step tasks with autonomous AI"
  },
{
    name: "Langchain Agents",
    url: "https://github.com/langchain-ai/langchain",
    stars: "98k+",
    description: "Agent frameworks and tool integrations for LangChain-based AI applications.",
    category: "AI Agents & Tools",
    features: ["Tool calling", "Memory management", "Agent executors"],
    install: "pip install langchain",
    useCase: "Building AI agents with tool use and conversation memory"
  },
{
    name: "AgentGPT",
    url: "https://github.com/reworkd/AgentGPT",
    stars: "31k+",
    description: "Web-based platform for creating and deploying autonomous AI agents.",
    category: "AI Agents & Tools",
    features: ["Web UI", "Task automation", "Auto-GPT capabilities"],
    install: "git clone and docker compose up",
    useCase: "Creating and deploying AI agents through a web interface"
  },
{
    name: "BabyAGI",
    url: "https://github.com/yoheinakajima/babyagi",
    stars: "22k+",
    description: "Task-driven autonomous agent with task creation and prioritization.",
    category: "AI Agents & Tools",
    features: ["Task creation", "Priority queue", "Execution planning"],
    install: "pip install -r requirements.txt",
    useCase: "Autonomous task management and execution with AI"
  },
{
    name: "Toolhouse",
    url: "https://github.com/Toolhouse/toolhouse-sdk",
    stars: "1k+",
    description: "Platform for connecting AI agents with 80+ pre-built tools and APIs.",
    category: "AI Agents & Tools",
    features: ["80+ tools", "Managed tool hosting", "LLM integration"],
    install: "pip install toolhouse",
    useCase: "Connecting AI agents to pre-built external tools quickly"
  },
{
    name: "Langchain Tools",
    url: "https://github.com/langchain-ai/langchain/tree/master/libs/community",
    stars: "98k+",
    description: "Community tools and integrations for LangChain agent development.",
    category: "AI Agents & Tools",
    features: ["Tool abstractions", "API connectors", "Custom tool creation"],
    install: "pip install langchain-community",
    useCase: "Extending AI agents with community-built tool integrations"
  },
{
    name: "Langchain Hub",
    url: "https://github.com/langchain-ai/langsmith-sdk",
    stars: "1k+",
    description: "Centralized hub for sharing and versioning LangChain prompts and chains.",
    category: "AI Agents & Tools",
    features: ["Prompt versioning", "Chain sharing", "Hub integration"],
    install: "pip install langchainhub",
    useCase: "Managing and sharing prompts and agent configurations"
  },
{
    name: "LlamaIndex Agents",
    url: "https://github.com/run-llama/llama_index",
    stars: "40k+",
    description: "Agent frameworks for LlamaIndex with tool use and planning capabilities.",
    category: "AI Agents & Tools",
    features: ["ReAct agents", "Planning", "Tool orchestration"],
    install: "pip install llama-index",
    useCase: "Building data-aware AI agents with LlamaIndex"
  },
{
    name: "Haystack Agents",
    url: "https://github.com/deepset-ai/haystack",
    stars: "18k+",
    description: "Agent components for Haystack pipelines with tool integration.",
    category: "AI Agents & Tools",
    features: ["Tool nodes", "Prompt templates", "Pipeline agents"],
    install: "pip install haystack-ai",
    useCase: "Building agents within Haystack pipeline architectures"
  },
{
    name: "Semantic Kernels AI Agent",
    url: "https://github.com/microsoft/semantic-kernel",
    stars: "23k+",
    description: "Agent framework in Semantic Kernel for planning and tool use.",
    category: "AI Agents & Tools",
    features: ["Planner", "Memory", "Kernel functions"],
    install: "pip install semantic-kernel",
    useCase: "Building intelligent agents with Microsoft's planning framework"
  },
{
    name: "Autogen Agents",
    url: "https://github.com/microsoft/autogen",
    stars: "38k+",
    description: "Conversational agent framework with tool use and code execution.",
    category: "AI Agents & Tools",
    features: ["Agent conversations", "Code execution", "Group chat"],
    install: "pip install pyautogen",
    useCase: "Multi-agent conversational systems with tool integration"
  },
{
    name: "Pydantic AI Agent",
    url: "https://github.com/pydantic/pydantic-ai",
    stars: "8k+",
    description: "Type-safe AI agents with structured outputs and tool calling.",
    category: "AI Agents & Tools",
    features: ["Pydantic validation", "Structured tools", "Dependency injection"],
    install: "pip install pydantic-ai",
    useCase: "Building type-safe agents with validated tool inputs/outputs"
  },
{
    name: "Anthropic Tool Use",
    url: "https://github.com/anthropics/anthropic-sdk-python",
    stars: "3k+",
    description: "Claude's tool use capabilities for building powerful AI agents.",
    category: "AI Agents & Tools",
    features: ["Function calling", "JSON schemas", "Parallel tool use"],
    install: "pip install anthropic",
    useCase: "Building agents with Claude's native tool use capabilities"
  },
{
    name: "OpenAI Function Calling",
    url: "https://github.com/openai/openai-python",
    stars: "24k+",
    description: "OpenAI's function calling and tool use for agent development.",
    category: "AI Agents & Tools",
    features: ["Function definitions", "Parallel calls", "Structured output"],
    install: "pip install openai",
    useCase: "Building agents with OpenAI's function calling capabilities"
  },
{
    name: "Groq Agent",
    url: "https://github.com/groq/groq-python",
    stars: "2k+",
    description: "Ultra-fast LLM inference for real-time agent interactions.",
    category: "AI Agents & Tools",
    features: ["Sub-second responses", "Tool calling", "Streaming"],
    install: "pip install groq",
    useCase: "Building responsive agents with ultra-fast inference"
  },
{
    name: "Together Agents",
    url: "https://github.com/togethercomputer/together-python",
    stars: "1k+",
    description: "Agent-friendly inference platform with tool calling support.",
    category: "AI Agents & Tools",
    features: ["Tool calling", "Multi-model", "Fine-tuning support"],
    install: "pip install together",
    useCase: "Building agents with Together AI's inference platform"
  },
{
    name: "LLM Agents",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "Stateful agent orchestration with LangGraph's graph-based approach.",
    category: "AI Agents & Tools",
    features: ["State graphs", "Human-in-the-loop", "Persistence"],
    install: "pip install langgraph",
    useCase: "Building complex stateful agent workflows with graph execution"
  },
{
    name: "AgentOps",
    url: "https://github.com/AgentOps-AI/agentops",
    stars: "2k+",
    description: "Observability and analytics platform for AI agent monitoring and debugging.",
    category: "AI Agents & Tools",
    features: ["Agent tracing", "Cost tracking", "Session replay"],
    install: "pip install agentops",
    useCase: "Monitoring, debugging, and optimizing AI agent performance"
  },
{
    name: "OpenAI Swarm",
    url: "https://github.com/openai/swarm",
    stars: "19k+",
    description: "Lightweight multi-agent orchestration framework by OpenAI.",
    category: "AI Agents & Tools",
    features: ["Agent handoffs", "Lightweight design", "Educational"],
    install: "pip install openai-swarm",
    useCase: "Simple multi-agent systems with agent-to-agent handoffs"
  },
{
    name: "Phidata Agent",
    url: "https://github.com/agno-agi/agno",
    stars: "15k+",
    description: "Build production-grade AI agents with built-in memory and tools.",
    category: "AI Agents & Tools",
    features: ["Memory management", "Knowledge retrieval", "Tool integration"],
    install: "pip install agno",
    useCase: "Production AI agents with persistent memory and knowledge"
  },
{
    name: "CrewAI Tools",
    url: "https://github.com/crewAIInc/crewAI",
    stars: "25k+",
    description: "Tool library and framework for multi-agent collaborative AI systems.",
    category: "AI Agents & Tools",
    features: ["Tool definitions", "Agent collaboration", "Task delegation"],
    install: "pip install crewai",
    useCase: "Multi-agent teams working collaboratively with specialized tools"
  },
{
    name: "AutoGen Tools",
    url: "https://github.com/microsoft/autogen",
    stars: "38k+",
    description: "Tool and function calling infrastructure for AutoGen agents.",
    category: "AI Agents & Tools",
    features: ["Tool registration", "Code execution", "Agent communication"],
    install: "pip install pyautogen",
    useCase: "Tool-enabled multi-agent conversations with AutoGen"
  },
{
    name: "Griptape Tools",
    url: "https://github.com/griptape-ai/griptape",
    stars: "3k+",
    description: "Enterprise tool framework for structured AI agent interactions.",
    category: "AI Agents & Tools",
    features: ["Tool pipelines", "Structured I/O", "Memory systems"],
    install: "pip install griptape",
    useCase: "Enterprise AI agents with structured tool workflows"
  },
{
    name: "Swarms Tools",
    url: "https://github.com/kyegomez/swarms",
    stars: "9k+",
    description: "Tool infrastructure for building multi-agent swarm systems.",
    category: "AI Agents & Tools",
    features: ["Swarm orchestration", "Tool chains", "Agent networking"],
    install: "pip install swarms",
    useCase: "Scalable multi-agent systems with shared tool access"
  },
{
    name: "MetaGPT Agent",
    url: "https://github.com/geekan/MetaGPT",
    stars: "48k+",
    description: "Multi-agent framework with role-based tool use for software engineering.",
    category: "AI Agents & Tools",
    features: ["SOP-based agents", "Role specialization", "Tool assignment"],
    install: "pip install metagpt",
    useCase: "Software engineering agents with specialized roles and tools"
  },
{
    name: "ChatDev Agent",
    url: "https://github.com/OpenBMB/ChatDev",
    stars: "26k+",
    description: "Multi-agent system with role-playing for software development tasks.",
    category: "AI Agents & Tools",
    features: ["Developer and tester roles", "Code generation", "Tool integration"],
    install: "pip install chatdev",
    useCase: "Automated software development through agent collaboration"
  },
{
    name: "Composio Tools",
    url: "https://github.com/ComposioHQ/composio",
    stars: "15k+",
    description: "Pre-built tool integrations for AI agents across 200+ applications.",
    category: "AI Agents & Tools",
    features: ["200+ app integrations", "Managed auth", "Tool hosting"],
    install: "pip install composio-core",
    useCase: "Connecting agents to external services without custom integration"
  },
{
    name: "LangGraph Studio",
    url: "https://github.com/langchain-ai/langgraph-studio",
    stars: "2k+",
    description: "IDE for visualizing and debugging LangGraph agent workflows.",
    category: "AI Agents & Tools",
    features: ["Visual debugger", "Step-through execution", "State inspection"],
    install: "Download from LangChain",
    useCase: "Debugging and visualizing complex agent graph workflows"
  },
{
    name: "OpenAgents",
    url: "https://github.com/X-PLUG/moreuse",
    stars: "2k+",
    description: "Open platform for building and deploying AI agents with tools.",
    category: "AI Agents & Tools",
    features: ["Plugin system", "Web browsing", "Code execution"],
    install: "git clone and follow setup",
    useCase: "Building agents with web browsing and code execution capabilities"
  },
{
    name: "Agent Protocol",
    url: "https://github.com/AI-Engineer-Foundation/agent-protocol",
    stars: "2k+",
    description: "Standardized API specification for building AI agents.",
    category: "AI Agents & Tools",
    features: ["REST API standard", "Framework agnostic", "Task management"],
    install: "pip install agent-protocol",
    useCase: "Building agents with a standardized protocol and API"
  },
{
    name: "LangGraph Platform",
    url: "https://github.com/langchain-ai/langgraph-platform",
    stars: "500+",
    description: "Production platform for deploying LangGraph agents with monitoring.",
    category: "AI Agents & Tools",
    features: ["Managed deployment", "Monitoring", "Cron scheduling"],
    install: "pip install langgraph-api",
    useCase: "Deploying and managing LangGraph agents in production"
  },
{
    name: "MCP",
    url: "https://github.com/modelcontextprotocol/spec",
    stars: "4k+",
    description: "Model Context Protocol specification for connecting AI models to data sources.",
    category: "AI Agents & Tools",
    features: ["Standardized protocol", "Tool discovery", "Resource access"],
    install: "See specification",
    useCase: "Standardizing how AI models connect to external data and tools"
  },
{
    name: "MCP Python SDK",
    url: "https://github.com/modelcontextprotocol/python-sdk",
    stars: "5k+",
    description: "Python SDK for building MCP servers and clients.",
    category: "AI Agents & Tools",
    features: ["Server framework", "Client library", "Transport layers"],
    install: "pip install mcp",
    useCase: "Building MCP-compatible tool servers in Python"
  },
{
    name: "MCP TypeScript SDK",
    url: "https://github.com/modelcontextprotocol/typescript-sdk",
    stars: "3k+",
    description: "TypeScript SDK for Model Context Protocol servers and clients.",
    category: "AI Agents & Tools",
    features: ["Type-safe server", "Client library", "WebSocket transport"],
    install: "npm install @modelcontextprotocol/sdk",
    useCase: "Building MCP servers and clients in TypeScript"
  },
{
    name: "Cursor",
    url: "https://github.com/getcursor/cursor",
    stars: "4k+",
    description: "AI-first code editor with intelligent code editing and agent capabilities.",
    category: "AI Agents & Tools",
    features: ["Code editing AI", "Agent mode", "Multi-file context"],
    install: "Download from cursor.sh",
    useCase: "AI-powered code editing with context-aware suggestions"
  },
{
    name: "Aider",
    url: "https://github.com/paul-gauthier/aider",
    stars: "26k+",
    description: "AI pair programming in your terminal with git integration.",
    category: "AI Agents & Tools",
    features: ["Terminal-based", "Git integration", "Multi-model support"],
    install: "pip install aider-chat",
    useCase: "Terminal-based AI pair programming with automatic git commits"
  },
{
    name: "Continue",
    url: "https://github.com/continuedev/continue",
    stars: "18k+",
    description: "Open-source AI code assistant that integrates with VS Code and JetBrains.",
    category: "AI Agents & Tools",
    features: ["IDE integration", "Custom models", "Context providers"],
    install: "Install from VS Code marketplace",
    useCase: "Adding AI code assistance to your existing IDE"
  },
{
    name: "SWE-agent",
    url: "https://github.com/princeton-nlp/SWE-agent",
    stars: "14k+",
    description: "Agent that automatically fixes GitHub issues by modifying code.",
    category: "AI Agents & Tools",
    features: ["Issue resolution", "Code modification", "Autonomous debugging"],
    install: "pip install swe-agent",
    useCase: "Automatically fixing GitHub issues with AI"
  },
{
    name: "Sweep AI",
    url: "https://github.com/sweepai/sweep",
    stars: "7k+",
    description: "AI-powered junior developer that handles GitHub issues and PRs.",
    category: "AI Agents & Tools",
    features: ["Issue handling", "PR creation", "Codebase indexing"],
    install: "Install from GitHub marketplace",
    useCase: "Automated GitHub issue resolution and PR creation"
  },
{
    name: "Devon",
    url: "https://github.com/entropy-research/Devon",
    stars: "3k+",
    description: "Open-source AI pair programmer that can autonomously write and fix code.",
    category: "AI Agents & Tools",
    features: ["Autonomous coding", "Debugging", "Multi-file editing"],
    install: "pip install devon-agent",
    useCase: "Autonomous AI coding assistant for software development"
  },
{
    name: "GPT Engineer",
    url: "https://github.com/gpt-engineer-org/gpt-engineer",
    stars: "52k+",
    description: "Specify what you want it to build, and it builds it with AI.",
    category: "AI Agents & Tools",
    features: ["Spec-to-code", "Code generation", "Project scaffolding"],
    install: "pip install gpt-engineer",
    useCase: "Generating complete projects from natural language specifications"
  },
{
    name: "Aider Bench",
    url: "https://github.com/paul-gauthier/aider",
    stars: "26k+",
    description: "Benchmarking suite for evaluating AI coding agents on real-world tasks.",
    category: "AI Agents & Tools",
    features: ["Coding benchmarks", "Evaluation metrics", "Agent comparison"],
    install: "pip install aider-benchmark",
    useCase: "Evaluating and comparing AI coding agent performance"
  },
{
    name: "Devika",
    url: "https://github.com/adiwgansworks/devika",
    stars: "20k+",
    description: "AI software engineer that can understand instructions and write code.",
    category: "AI Agents & Tools",
    features: ["Natural language coding", "Web research", "Code generation"],
    install: "git clone and follow setup",
    useCase: "AI-powered software engineering from natural language instructions"
  },
{
    name: "OpenDevin CLI",
    url: "https://github.com/All-Hands-AI/OpenHands",
    stars: "40k+",
    description: "CLI for AI-powered autonomous software development tasks.",
    category: "AI Agents & Tools",
    features: ["Command-line agent", "Code execution", "File operations"],
    install: "docker compose up -d",
    useCase: "Autonomous software development through CLI-based AI agent"
  },
{
    name: "Kilocode",
    url: "https://github.com/kilocode/kilocode",
    stars: "500+",
    description: "AI agent for autonomous code editing and software development.",
    category: "AI Agents & Tools",
    features: ["Autonomous editing", "Multi-file changes", "Context awareness"],
    install: "npm install kilocode",
    useCase: "AI-powered autonomous code editing and refactoring"
  },
{
    name: "Mentat",
    url: "https://github.com/Cognition-AI/mentat",
    stars: "2k+",
    description: "AI-powered coding assistant that understands your codebase context.",
    category: "AI Agents & Tools",
    features: ["Codebase awareness", "Multi-file editing", "Terminal-based"],
    install: "pip install mentat",
    useCase: "Context-aware AI coding assistance in the terminal"
  },
{
    name: "Void",
    url: "https://github.com/voideditor/void",
    stars: "3k+",
    description: "Open-source AI code editor fork of VS Code with agent capabilities.",
    category: "AI Agents & Tools",
    features: ["VS Code fork", "AI editing", "Open-source backend"],
    install: "Download from voideditor.com",
    useCase: "Open-source AI-enhanced code editing"
  },
{
    name: "Roo Code",
    url: "https://github.com/RooVetGit/Roo-Code",
    stars: "5k+",
    description: "AI pair programming assistant for VS Code with multi-model support.",
    category: "AI Agents & Tools",
    features: ["VS Code extension", "Multi-model", "Custom modes"],
    install: "Install from VS Code marketplace",
    useCase: "AI pair programming within VS Code"
  },
{
    name: "PearAI",
    url: "https://github.com/trypear/pearai",
    stars: "3k+",
    description: "Open-source AI-powered code editor with integrated development tools.",
    category: "AI Agents & Tools",
    features: ["Code editing", "Terminal integration", "AI chat"],
    install: "Download from pearai.dev",
    useCase: "All-in-one AI-powered development environment"
  },
{
    name: "Cline",
    url: "https://github.com/cline/cline",
    stars: "25k+",
    description: "AI coding agent for VS Code that can edit files and run commands.",
    category: "AI Agents & Tools",
    features: ["File editing", "Command execution", "Multi-model support"],
    install: "Install from VS Code marketplace",
    useCase: "Autonomous AI coding assistance within VS Code"
  },
{
    name: "Gemini CLI",
    url: "https://github.com/google-gemini/gemini-cli",
    stars: "50k+",
    description: "Google's AI-powered CLI tool for coding assistance and development.",
    category: "AI Agents & Tools",
    features: ["Terminal AI assistant", "Code generation", "Multi-modal"],
    install: "npm install -g @google/gemini-cli",
    useCase: "AI-powered terminal-based coding assistant from Google"
  },
{
    name: "Warp",
    url: "https://github.com/warpdotdev/Warp",
    stars: "22k+",
    description: "AI-powered terminal with intelligent features for developer productivity.",
    category: "AI Agents & Tools",
    features: ["AI command suggestions", "Block-based UI", "Collaboration"],
    install: "Download from warp.dev",
    useCase: "AI-enhanced terminal for faster development workflows"
  },
{
    name: "Fig",
    url: "https://github.com/withfig/autocomplete",
    stars: "24k+",
    description: "AI-powered autocomplete for your terminal with IDE-style completions.",
    category: "AI Agents & Tools",
    features: ["Shell autocomplete", "CLI suggestions", "IDE integration"],
    install: "npm install -g @withfig/autocomplete",
    useCase: "Adding intelligent autocompletion to your terminal"
  },
{
    name: "Stable Diffusion WebUI",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    stars: "145k+",
    description: "Gradio browser interface for Stable Diffusion with extensive extensions.",
    category: "Computer Vision & Multimodal",
    features: ["Text-to-image", "Image-to-image", "Extensions ecosystem"],
    install: "git clone and run webui.sh",
    useCase: "Generating and editing images with Stable Diffusion locally"
  },
{
    name: "ComfyUI",
    url: "https://github.com/comfyanonymous/ComfyUI",
    stars: "70k+",
    description: "Node-based UI for Stable Diffusion with advanced workflow customization.",
    category: "Computer Vision & Multimodal",
    features: ["Node-based workflows", "Advanced pipelines", "GPU optimized"],
    install: "git clone and pip install -r requirements.txt",
    useCase: "Advanced image generation with customizable node-based workflows"
  },
{
    name: "Fooocus",
    url: "https://github.com/lllyasviel/Fooocus",
    stars: "42k+",
    description: "Most Stable Diffusion playground with enhanced prompt processing.",
    category: "Computer Vision & Multimodal",
    features: ["Simple interface", "Enhanced prompts", "Style presets"],
    install: "pip install -r requirements.txt",
    useCase: "Easy-to-use Stable Diffusion image generation"
  },
{
    name: "Diffusers",
    url: "https://github.com/huggingface/diffusers",
    stars: "27k+",
    description: "Hugging Face library for state-of-the-art diffusion models.",
    category: "Computer Vision & Multimodal",
    features: ["Multiple schedulers", "Pipeline components", "Model hub integration"],
    install: "pip install diffusers",
    useCase: "Using and customizing diffusion models for image and video generation"
  },
{
    name: "ControlNet",
    url: "https://github.com/lllyasviel/ControlNet",
    stars: "30k+",
    description: "Add conditional control to text-to-image diffusion models.",
    category: "Computer Vision & Multimodal",
    features: ["Edge detection", "Pose estimation", "Depth maps"],
    install: "pip install controlnet",
    useCase: "Adding structural control to diffusion model image generation"
  },
{
    name: "OpenCV",
    url: "https://github.com/opencv/opencv",
    stars: "80k+",
    description: "Open-source computer vision library with real-time image processing.",
    category: "Computer Vision & Multimodal",
    features: ["Image processing", "Object detection", "Video analysis"],
    install: "pip install opencv-python",
    useCase: "Real-time computer vision and image processing applications"
  },
{
    name: "YOLO",
    url: "https://github.com/ultralytics/ultralytics",
    stars: "35k+",
    description: "YOLO family of real-time object detection and segmentation models.",
    category: "Computer Vision & Multimodal",
    features: ["Real-time detection", "Instance segmentation", "Pose estimation"],
    install: "pip install ultralytics",
    useCase: "Real-time object detection and visual analysis"
  },
{
    name: "Segment Anything",
    url: "https://github.com/facebookresearch/segment-anything",
    stars: "48k+",
    description: "Meta's foundation model for image segmentation with promptable outputs.",
    category: "Computer Vision & Multimodal",
    features: ["Zero-shot segmentation", "Point prompts", "Box prompts"],
    install: "pip install segment-anything",
    useCase: "Universal image segmentation with simple prompts"
  },
{
    name: "Grounding DINO",
    url: "https://github.com/IDEA-Research/GroundingDINO",
    stars: "10k+",
    description: "Open-set object detection combining DINO with grounded pre-training.",
    category: "Computer Vision & Multimodal",
    features: ["Open-vocabulary detection", "Text prompts", "Zero-shot transfer"],
    install: "pip install groundingdino-py",
    useCase: "Detecting objects described by natural language in images"
  },
{
    name: "Florence-2",
    url: "https://github.com/microsoft/Florence-2",
    stars: "7k+",
    description: "Microsoft's unified vision foundation model for multiple vision tasks.",
    category: "Computer Vision & Multimodal",
    features: ["Multi-task vision", "Captioning", "Object detection"],
    install: "pip install florence-2",
    useCase: "Unified approach to multiple computer vision tasks"
  },
{
    name: "LLaVA",
    url: "https://github.com/haotian-liu/LLaVA",
    stars: "20k+",
    description: "Visual instruction tuning for large language-and-vision assistants.",
    category: "Computer Vision & Multimodal",
    features: ["Vision-language", "Instruction following", "Visual reasoning"],
    install: "pip install llava",
    useCase: "Building multimodal assistants that understand images and text"
  },
{
    name: "MiniGPT-4",
    url: "https://github.com/Vision-CAIR/MiniGPT-4",
    stars: "24k+",
    description: "Enhancing vision-language understanding with GPT-4 level capabilities.",
    category: "Computer Vision & Multimodal",
    features: ["Image understanding", "Visual Q&A", "Captioning"],
    install: "git clone and follow setup",
    useCase: "Visual understanding and description with language models"
  },
{
    name: "CogVLM",
    url: "https://github.com/THUDM/CogVLM",
    stars: "9k+",
    description: "Visual expert for pretrained language models with deep visual features.",
    category: "Computer Vision & Multimodal",
    features: ["Visual grounding", "Image understanding", "Visual Q&A"],
    install: "pip install cogvlm",
    useCase: "Deep visual understanding combined with language reasoning"
  },
{
    name: "BakLLaVA",
    url: "https://github.com/abacuspapers/bakllava",
    stars: "2k+",
    description: "Mistral 7B base combined with LLaVA 1.5 for improved multimodal performance.",
    category: "Computer Vision & Multimodal",
    features: ["Mistral backbone", "Visual understanding", "Instruction tuning"],
    install: "git clone and follow setup",
    useCase: "Multimodal chat with improved visual understanding"
  },
{
    name: "InternVL",
    url: "https://github.com/OpenGVLab/InternVL",
    stars: "8k+",
    description: "Open-source vision foundation model scaling to 6B parameters.",
    category: "Computer Vision & Multimodal",
    features: ["Vision transformer", "Dynamic resolution", "Multi-task"],
    install: "pip install -r requirements.txt",
    useCase: "Large-scale vision understanding for multiple vision tasks"
  },
{
    name: "CogVideo",
    url: "https://github.com/THUDM/CogVideo",
    stars: "10k+",
    description: "Text-to-video generation model with temporal modeling capabilities.",
    category: "Computer Vision & Multimodal",
    features: ["Text-to-video", "Temporal consistency", "Open-source"],
    install: "pip install cogvideo",
    useCase: "Generating videos from text descriptions"
  },
{
    name: "Stable Video Diffusion",
    url: "https://github.com/Stability-AI/generative-models",
    stars: "25k+",
    description: "Stability AI's video generation and manipulation models.",
    category: "Computer Vision & Multimodal",
    features: ["Image-to-video", "Video editing", "Temporal modeling"],
    install: "pip install generative-models",
    useCase: "Video generation and editing with diffusion models"
  },
{
    name: "Open-Sora",
    url: "https://github.com/hpcaitech/Open-Sora",
    stars: "22k+",
    description: "Open-source video generation model with Sora-like capabilities.",
    category: "Computer Vision & Multimodal",
    features: ["Video generation", "Diffusion transformer", "Scalable training"],
    install: "git clone and follow setup",
    useCase: "Open-source video generation similar to OpenAI Sora"
  },
{
    name: "DeepSpeed-Vision",
    url: "https://github.com/microsoft/DeepSpeed",
    stars: "36k+",
    description: "Microsoft's deep learning library with vision model support.",
    category: "Computer Vision & Multimodal",
    features: ["Distributed training", "Vision transformers", "Model parallelism"],
    install: "pip install deepspeed",
    useCase: "Training and serving large vision models at scale"
  },
{
    name: "OpenCLIP",
    url: "https://github.com/mlfoundations/open_clip",
    stars: "10k+",
    description: "Open-source implementation of CLIP with improved training approaches.",
    category: "Computer Vision & Multimodal",
    features: ["Contrastive learning", "Zero-shot classification", "Multi-modal embeddings"],
    install: "pip install open_clip_torch",
    useCase: "Training and using CLIP models for visual-language tasks"
  },
{
    name: "Whisper",
    url: "https://github.com/openai/whisper",
    stars: "72k+",
    description: "OpenAI's automatic speech recognition model for transcription and translation.",
    category: "Speech & Audio AI",
    features: ["Multi-language", "Translation", "Robust recognition"],
    install: "pip install openai-whisper",
    useCase: "High-quality speech transcription and translation"
  },
{
    name: "Faster Whisper",
    url: "https://github.com/SYSTRAN/faster-whisper",
    stars: "13k+",
    description: "CTranslate2 implementation of Whisper with 4x faster inference.",
    category: "Speech & Audio AI",
    features: ["4x speed boost", "Batch processing", "GPU and CPU"],
    install: "pip install faster-whisper",
    useCase: "High-speed speech transcription with Whisper quality"
  },
{
    name: "WhisperX",
    url: "https://github.com/m-bain/whisperX",
    stars: "12k+",
    description: "Whisper with word-level timestamps and speaker diarization.",
    category: "Speech & Audio AI",
    features: ["Word timestamps", "Speaker diarization", "VAD alignment"],
    install: "pip install whisperx",
    useCase: "Transcription with precise word-level timing and speaker identification"
  },
{
    name: "Coqui TTS",
    url: "https://github.com/coqui-ai/TTS",
    stars: "36k+",
    description: "Deep learning library for text-to-speech with multiple model architectures.",
    category: "Speech & Audio AI",
    features: ["Multi-speaker", "Voice cloning", "SSML support"],
    install: "pip install TTS",
    useCase: "High-quality text-to-speech with voice cloning capabilities"
  },
{
    name: "Bark",
    url: "https://github.com/suno-ai/bark",
    stars: "36k+",
    description: "Suno's text-to-audio model for generating expressive speech.",
    category: "Speech & Audio AI",
    features: ["Expressive speech", "Music generation", "Sound effects"],
    install: "pip install bark",
    useCase: "Generating realistic and expressive speech from text"
  },
{
    name: "XTTS",
    url: "https://github.com/coqui-ai/TTS",
    stars: "36k+",
    description: "Multilingual text-to-speech with voice cloning across 17 languages.",
    category: "Speech & Audio AI",
    features: ["17 languages", "Voice cloning", "Streaming output"],
    install: "pip install TTS",
    useCase: "Cross-language text-to-speech with voice replication"
  },
{
    name: "Piper TTS",
    url: "https://github.com/rhasspy/piper",
    stars: "8k+",
    description: "Fast, local neural text-to-speech system optimized for Raspberry Pi.",
    category: "Speech & Audio AI",
    features: ["Ultra-fast", "Local inference", "Multiple voices"],
    install: "pip install piper-tts",
    useCase: "Lightweight local text-to-speech for edge devices"
  },
{
    name: "OpenVoice",
    url: "https://github.com/myshell-ai/OpenVoice",
    stars: "29k+",
    description: "MyShell's instant voice cloning model for speech synthesis.",
    category: "Speech & Audio AI",
    features: ["Voice cloning", "Tone control", "Multi-lingual"],
    install: "pip install openvoice",
    useCase: "Instant voice cloning for text-to-speech applications"
  },
{
    name: "Tortoise TTS",
    url: "https://github.com/neonbjb/tortoise-tts",
    stars: "13k+",
    description: "Multi-voice text-to-speech with high-quality speech synthesis.",
    category: "Speech & Audio AI",
    features: ["Multi-voice", "High quality", "Custom training"],
    install: "pip install tortoise-tts",
    useCase: "High-quality multi-voice text-to-speech generation"
  },
{
    name: "ElevenLabs Python",
    url: "https://github.com/elevenlabs/elevenlabs-python",
    stars: "1k+",
    description: "Python client for ElevenLabs' AI voice generation and cloning API.",
    category: "Speech & Audio AI",
    features: ["Voice cloning", "Real-time streaming", "Multi-language"],
    install: "pip install elevenlabs",
    useCase: "Using ElevenLabs API for voice generation and cloning"
  },
{
    name: "RVC",
    url: "https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI",
    stars: "25k+",
    description: "Retrieval-based voice conversion for real-time voice transformation.",
    category: "Speech & Audio AI",
    features: ["Real-time conversion", "Voice training", "GPU acceleration"],
    install: "pip install -r requirements.txt",
    useCase: "Real-time voice conversion and transformation"
  },
{
    name: "DeepSpeech",
    url: "https://github.com/mozilla/DeepSpeech",
    stars: "26k+",
    description: "Mozilla's open-source speech-to-text engine using deep learning.",
    category: "Speech & Audio AI",
    features: ["Offline capable", "Multiple languages", "Lite model"],
    install: "pip install deepspeech",
    useCase: "Offline speech recognition for embedded devices"
  },
{
    name: "Kokoro TTS",
    url: "https://github.com/hexgrad/kokoro",
    stars: "8k+",
    description: "High-quality text-to-speech with style transfer capabilities.",
    category: "Speech & Audio AI",
    features: ["Style transfer", "Multiple voices", "Streaming"],
    install: "pip install kokoro",
    useCase: "Expressive text-to-speech with voice style control"
  },
{
    name: "GPT-SoVITS",
    url: "https://github.com/RVC-Boss/GPT-SoVITS",
    stars: "35k+",
    description: "Few-shot voice cloning combining GPT and SoVITS architectures.",
    category: "Speech & Audio AI",
    features: ["Few-shot cloning", "Cross-lingual", "Web UI"],
    install: "pip install -r requirements.txt",
    useCase: "Voice cloning from minimal audio samples"
  },
{
    name: "StyleTTS2",
    url: "https://github.com/yshlioral/styletts2",
    stars: "7k+",
    description: "Human-level text-to-speech using style diffusion and adversarial training.",
    category: "Speech & Audio AI",
    features: ["Style diffusion", "Prosody control", "High fidelity"],
    install: "pip install -r requirements.txt",
    useCase: "Human-quality speech synthesis with style control"
  },
{
    name: "MeloTTS",
    url: "https://github.com/myshell-ai/MeloTTS",
    stars: "5k+",
    description: "Fast multi-lingual text-to-speech with pronunciation dictionaries.",
    category: "Speech & Audio AI",
    features: ["Multi-lingual", "Fast inference", "Pronunciation control"],
    install: "pip install melotts",
    useCase: "Fast multi-language text-to-speech"
  },
{
    name: "F5-TTS",
    url: "https://github.com/SWivid/F5-TTS",
    stars: "12k+",
    description: "Flow-matching based text-to-speech for natural voice synthesis.",
    category: "Speech & Audio AI",
    features: ["Flow matching", "Zero-shot cloning", "Streaming"],
    install: "pip install f5-tts",
    useCase: "Natural voice synthesis with zero-shot voice cloning"
  },
{
    name: "Hugging Face Datasets",
    url: "https://github.com/huggingface/datasets",
    stars: "18k+",
    description: "Library for accessing and processing datasets for machine learning.",
    category: "Data & Training",
    features: ["10k+ datasets", "Streaming", "Auto-processing"],
    install: "pip install datasets",
    useCase: "Accessing and processing ML training datasets"
  },
{
    name: "Weights & Biases",
    url: "https://github.com/wandb/wandb",
    stars: "9k+",
    description: "Experiment tracking, model versioning, and collaboration for ML teams.",
    category: "Data & Training",
    features: ["Experiment tracking", "Model versioning", "Sweeps"],
    install: "pip install wandb",
    useCase: "Tracking ML experiments and managing model versions"
  },
{
    name: "MLflow",
    url: "https://github.com/mlflow/mlflow",
    stars: "19k+",
    description: "Open-source platform for managing ML lifecycle with experiment tracking.",
    category: "Data & Training",
    features: ["Experiment tracking", "Model registry", "Deployment"],
    install: "pip install mlflow",
    useCase: "Managing the complete ML lifecycle from experiment to deployment"
  },
{
    name: "PyTorch Lightning",
    url: "https://github.com/Lightning-AI/pytorch-lightning",
    stars: "28k+",
    description: "Deep learning framework to pretrain, finetune and deploy AI models.",
    category: "Data & Training",
    features: ["Scalable training", "Mixed precision", "Multi-GPU"],
    install: "pip install pytorch-lightning",
    useCase: "Simplifying PyTorch training with production-ready features"
  },
{
    name: "Hugging Face Transformers",
    url: "https://github.com/huggingface/transformers",
    stars: "140k+",
    description: "State-of-the-art ML models for NLP, CV, and multi-modal tasks.",
    category: "Data & Training",
    features: ["100k+ models", "Fine-tuning", "Multi-modal support"],
    install: "pip install transformers",
    useCase: "Using and fine-tuning pre-trained transformer models"
  },
{
    name: "Axolotl",
    url: "https://github.com/OpenAccess-AI-Collective/axolotl",
    stars: "8k+",
    description: "Simplified LLM fine-tuning framework supporting multiple architectures.",
    category: "Data & Training",
    features: ["Multiple architectures", "LoRA/QLoRA", "Easy configuration"],
    install: "pip install axolotl",
    useCase: "Simplified fine-tuning of LLMs with YAML configuration"
  },
{
    name: "LLaMA Factory",
    url: "https://github.com/hiyouga/LLaMA-Factory",
    stars: "40k+",
    description: "Web UI for tuning 100+ LLMs with quantization, LoRA, and RLHF.",
    category: "Data & Training",
    features: ["Web UI", "100+ LLMs", "QLoRA and RLHF"],
    install: "pip install llamafactory",
    useCase: "Fine-tuning LLMs through an intuitive web interface"
  },
{
    name: "Unsloth",
    url: "https://github.com/unslothai/unsloth",
    stars: "25k+",
    description: "Fastest LLM fine-tuning with 60% less memory and 2x faster speed.",
    category: "Data & Training",
    features: ["60% less memory", "2x faster training", "RoPE scaling"],
    install: "pip install unsloth",
    useCase: "Memory-efficient and fast LLM fine-tuning"
  },
{
    name: "PEFT",
    url: "https://github.com/huggingface/peft",
    stars: "14k+",
    description: "Hugging Face parameter-efficient fine-tuning library.",
    category: "Data & Training",
    features: ["LoRA", "QLoRA", "Prefix tuning"],
    install: "pip install peft",
    useCase: "Efficient fine-tuning with minimal parameter updates"
  },
{
    name: "TRL",
    url: "https://github.com/huggingface/trl",
    stars: "10k+",
    description: "Transformer reinforcement learning for LLM fine-tuning with RLHF.",
    category: "Data & Training",
    features: ["PPO", "DPO", "SFT trainer"],
    install: "pip install trl",
    useCase: "Fine-tuning LLMs with reinforcement learning from human feedback"
  },
{
    name: "DeepSpeed Chat",
    url: "https://github.com/microsoft/DeepSpeed",
    stars: "36k+",
    description: "DeepSpeed framework for training chat models with RLHF at scale.",
    category: "Data & Training",
    features: ["RLHF training", "ZeRO optimization", "Distributed"],
    install: "pip install deepspeed",
    useCase: "Training chat models at scale with RLHF"
  },
{
    name: "Alpaca Farm",
    url: "https://github.com/tatsu-lab/alpaca_farm",
    stars: "3k+",
    description: "Simulation framework for developing LLM alignment methods.",
    category: "Data & Training",
    features: ["RLHF simulation", "Benchmarking", "Method comparison"],
    install: "pip install alpaca-farm",
    useCase: "Developing and comparing LLM alignment techniques"
  },
{
    name: "OpenHermes",
    url: "https://github.com/hermesllm/openhermes",
    stars: "2k+",
    description: "Curated dataset and training recipes for high-quality assistant models.",
    category: "Data & Training",
    features: ["Curated dataset", "Training recipes", "Evaluation"],
    install: "git clone and follow guide",
    useCase: "Training high-quality instruction-following models"
  },
{
    name: "WizardLM",
    url: "https://github.com/nlpxucan/WizardLM",
    stars: "9k+",
    description: "Evolutionary instruction dataset generation for LLM fine-tuning.",
    category: "Data & Training",
    features: ["Evol-Instruct", "Dataset generation", "Self-play"],
    install: "git clone and follow setup",
    useCase: "Generating high-quality instruction datasets for fine-tuning"
  },
{
    name: "Label Studio",
    url: "https://github.com/HumanSignal/label-studio",
    stars: "19k+",
    description: "Open-source data labeling tool for ML with multiple annotation types.",
    category: "Data & Training",
    features: ["Multi-modal labeling", "Active learning", "ML backend"],
    install: "pip install label-studio",
    useCase: "Labeling data for training machine learning models"
  },
{
    name: "Argilla",
    url: "https://github.com/argilla-io/argilla",
    stars: "9k+",
    description: "Open-source platform for curating and labeling LLM training data.",
    category: "Data & Training",
    features: ["LLM data curation", "Human feedback", "Active learning"],
    install: "pip install argilla",
    useCase: "Curating and labeling data specifically for LLM fine-tuning"
  },
{
    name: "Snorkel",
    url: "https://github.com/snorkel-team/snorkel",
    stars: "13k+",
    description: "Programmatic data labeling framework for training data creation.",
    category: "Data & Training",
    features: ["Labeling functions", "Weak supervision", "Data augmentation"],
    install: "pip install snorkel",
    useCase: "Creating training data using programmatic labeling approaches"
  },
{
    name: "Cleanlab",
    url: "https://github.com/cleanlab/cleanlab",
    stars: "10k+",
    description: "Data-centric AI for finding and fixing label errors in datasets.",
    category: "Data & Training",
    features: ["Label error detection", "Data quality", "Confident learning"],
    install: "pip install cleanlab",
    useCase: "Improving dataset quality by detecting and fixing label issues"
  },
{
    name: "Fabricator",
    url: "https://github.com/ikawrake/fabricator",
    stars: "500+",
    description: "Dataset generation using LLMs for fine-tuning and evaluation.",
    category: "Data & Training",
    features: ["LLM-based generation", "Custom schemas", "Export formats"],
    install: "pip install fabricator",
    useCase: "Generating synthetic training datasets using LLMs"
  },
{
    name: "DataComp",
    url: "https://github.com/mlfoundations/datacomp",
    stars: "2k+",
    description: "Benchmark competition for building better CLIP datasets.",
    category: "Data & Training",
    features: ["Dataset benchmarks", "CLIP evaluation", "Scale analysis"],
    install: "pip install datacomp",
    useCase: "Benchmarking and improving multimodal dataset quality"
  },
{
    name: "COCO Dataset",
    url: "https://github.com/cocodataset/cocoapi",
    stars: "6k+",
    description: "Common Objects in Context dataset API for detection and segmentation.",
    category: "Data & Training",
    features: ["Object detection", "Segmentation", "Captioning"],
    install: "pip install pycocotools",
    useCase: "Accessing and processing the COCO dataset for computer vision"
  },
{
    name: "LMSYS Chat Arena",
    url: "https://github.com/lm-sys/FastChat",
    stars: "38k+",
    description: "Platform for benchmarking LLMs through human preference voting.",
    category: "Data & Training",
    features: ["Human evaluation", "Elo rating", "Multi-model comparison"],
    install: "pip install fastchat",
    useCase: "Benchmarking LLMs through human preference comparisons"
  },
{
    name: "Vicuna",
    url: "https://github.com/lm-sys/FastChat",
    stars: "38k+",
    description: "Open-source chatbot trained on GPT conversations with high quality.",
    category: "Data & Training",
    features: ["Chat fine-tuning", "Multi-round", "Evaluation"],
    install: "pip install fastchat",
    useCase: "Training high-quality chat models from conversation data"
  },
{
    name: "SuperGLUE",
    url: "https://github.com/nyu-mll/superglue-benchmark",
    stars: "1k+",
    description: "Benchmark suite for evaluating language understanding models.",
    category: "Data & Training",
    features: ["Multiple NLU tasks", "Evaluation metrics", "Leaderboard"],
    install: "pip install datasets",
    useCase: "Evaluating language model capabilities on NLU benchmarks"
  },
{
    name: "OpenCompass",
    url: "https://github.com/open-compass/opencompass",
    stars: "7k+",
    description: "Comprehensive evaluation platform for LLMs across 100+ benchmarks.",
    category: "Data & Training",
    features: ["100+ benchmarks", "Model evaluation", "Leaderboard"],
    install: "pip install opencompass",
    useCase: "Comprehensive evaluation of LLM capabilities"
  },
{
    name: "LM Evaluation Harness",
    url: "https://github.com/EleutherAI/lm-evaluation-harness",
    stars: "7k+",
    description: "Framework for evaluating language models on diverse benchmarks.",
    category: "Data & Training",
    features: ["Multiple benchmarks", "Custom tasks", "Reproducible evaluation"],
    install: "pip install lm-eval",
    useCase: "Standardized evaluation of language models"
  },
{
    name: "Hugging Face Evaluate",
    url: "https://github.com/huggingface/evaluate",
    stars: "3k+",
    description: "Library for evaluating ML models with community metrics.",
    category: "Data & Training",
    features: ["100+ metrics", "Community hub", "Comparisons"],
    install: "pip install evaluate",
    useCase: "Standardized evaluation metrics for ML models"
  },
{
    name: "Hugging Face Tokenizers",
    url: "https://github.com/huggingface/tokenizers",
    stars: "9k+",
    description: "Fast state-of-the-art tokenizers for NLP with Rust implementation.",
    category: "Data & Training",
    features: ["Rust-based", "Fast training", "Custom tokenizers"],
    install: "pip install tokenizers",
    useCase: "Fast tokenization for NLP model training and inference"
  },
{
    name: "Sentence Transformers",
    url: "https://github.com/UKPLab/sentence-transformers",
    stars: "15k+",
    description: "Python framework for computing embeddings for sentences and paragraphs.",
    category: "Data & Training",
    features: ["Pre-trained models", "Fine-tuning", "Multi-lingual"],
    install: "pip install sentence-transformers",
    useCase: "Generating semantic embeddings for text similarity and search"
  },
{
    name: "Hugging Face Accelerate",
    url: "https://github.com/huggingface/accelerate",
    stars: "9k+",
    description: "Library for training PyTorch models with multi-GPU and mixed precision.",
    category: "Data & Training",
    features: ["Multi-GPU", "Mixed precision", "DeepSpeed integration"],
    install: "pip install accelerate",
    useCase: "Simplifying distributed and mixed-precision training"
  },
{
    name: "Mosaic ML Composer",
    url: "https://github.com/mosaicml/composer",
    stars: "8k+",
    description: "Library for efficient neural network training with speed-up algorithms.",
    category: "Data & Training",
    features: ["Training algorithms", "Speed-ups", "Easy integration"],
    install: "pip install mosaicml",
    useCase: "Accelerating model training with algorithms and optimizations"
  },
{
    name: "PyTorch",
    url: "https://github.com/pytorch/pytorch",
    stars: "86k+",
    description: "Deep learning framework with dynamic computation graph and GPU support.",
    category: "Data & Training",
    features: ["Dynamic graph", "GPU support", "Autograd"],
    install: "pip install torch",
    useCase: "Building and training deep learning models with PyTorch"
  },
{
    name: "TensorFlow",
    url: "https://github.com/tensorflow/tensorflow",
    stars: "186k+",
    description: "End-to-end open-source platform for machine learning by Google.",
    category: "Data & Training",
    features: ["Keras integration", "TF Lite", "TF Serving"],
    install: "pip install tensorflow",
    useCase: "Building and deploying ML models with Google's framework"
  },
{
    name: "JAX",
    url: "https://github.com/google/jax",
    stars: "30k+",
    description: "Google's high-performance numerical computing library for ML research.",
    category: "Data & Training",
    features: ["Auto-differentiation", "XLA compilation", "GPU/TPU"],
    install: "pip install jax",
    useCase: "High-performance ML research with composable transformations"
  },
{
    name: "LightGBM",
    url: "https://github.com/microsoft/LightGBM",
    stars: "16k+",
    description: "Fast, distributed, high performance gradient boosting framework.",
    category: "Data & Training",
    features: ["Gradient boosting", "Categorical features", "GPU training"],
    install: "pip install lightgbm",
    useCase: "Fast gradient boosting for tabular data tasks"
  },
{
    name: "XGBoost",
    url: "https://github.com/dmlc/xgboost",
    stars: "26k+",
    description: "Scalable, portable, and distributed gradient boosting library.",
    category: "Data & Training",
    features: ["Gradient boosting", "Distributed training", "GPU support"],
    install: "pip install xgboost",
    useCase: "High-performance gradient boosting for structured data"
  },
{
    name: "Scikit-learn",
    url: "https://github.com/scikit-learn/scikit-learn",
    stars: "60k+",
    description: "Machine learning library for classical ML algorithms in Python.",
    category: "Data & Training",
    features: ["Classification", "Regression", "Clustering"],
    install: "pip install scikit-learn",
    useCase: "Classical machine learning algorithms and data processing"
  },
{
    name: "ChatGPT",
    url: "https://github.com/lobehub/lobe-chat",
    stars: "55k+",
    description: "Open-source ChatGPT alternative with plugin and multimodal support.",
    category: "AI Apps & Demos",
    features: ["Multi-model support", "Plugin system", "Visual plugins"],
    install: "docker compose up -d",
    useCase: "Self-hosted ChatGPT alternative with extensive customization"
  },
{
    name: "ChatGPT Next Web",
    url: "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web",
    stars: "80k+",
    description: "Well-designed web client for ChatGPT API with multi-model support.",
    category: "AI Apps & Demos",
    features: ["Web interface", "Multi-model", "Markdown rendering"],
    install: "docker compose up -d",
    useCase: "Clean web interface for ChatGPT-compatible APIs"
  },
{
    name: "GPT4All UI",
    url: "https://github.com/nomic-ai/gpt4all-ui",
    stars: "73k+",
    description: "Chat interface for running local GPT models with conversation history.",
    category: "AI Apps & Demos",
    features: ["Local inference", "Conversation history", "Model management"],
    install: "git clone and follow setup",
    useCase: "Web interface for local LLM interaction"
  },
{
    name: "Ollama WebUI",
    url: "https://github.com/ollama/webui",
    stars: "50k+",
    description: "Web interface for Ollama with model management and chat features.",
    category: "AI Apps & Demos",
    features: ["Model management", "Chat interface", "RAG support"],
    install: "docker compose up -d",
    useCase: "Web UI for managing and chatting with Ollama models"
  },
{
    name: "Local AI WebUI",
    url: "https://github.com/mudler/LocalAI",
    stars: "26k+",
    description: "OpenAI-compatible web interface for local AI model deployment.",
    category: "AI Apps & Demos",
    features: ["OpenAI API", "Multi-modal", "Web UI"],
    install: "docker run localai/localai",
    useCase: "Drop-in replacement for OpenAI API with local models"
  },
{
    name: "Stable Diffusion UI",
    url: "https://github.com/cmdr2/stable-diffusion-ui",
    stars: "7k+",
    description: "Easiest way to install and use Stable Diffusion on your computer.",
    category: "AI Apps & Demos",
    features: ["One-click install", "Image generation", "Gallery"],
    install: "git clone and run start script",
    useCase: "Simple Stable Diffusion installation for beginners"
  },
{
    name: "Rembg",
    url: "https://github.com/danielgatis/rembg",
    stars: "16k+",
    description: "Remove image backgrounds automatically using AI.",
    category: "AI Apps & Demos",
    features: ["Background removal", "Batch processing", "CLI and API"],
    install: "pip install rembg",
    useCase: "Automatic background removal from images"
  },
{
    name: "Whisper Desktop",
    url: "https://github.com/chidiwilliams/whisper",
    stars: "7k+",
    description: "Desktop application for speech transcription with OpenAI Whisper.",
    category: "AI Apps & Demos",
    features: ["Desktop app", "Drag-and-drop", "Multiple formats"],
    install: "Download from GitHub releases",
    useCase: "Desktop speech transcription with a simple interface"
  },
{
    name: "Bark GUI",
    url: "https://github.com/C0untFloyd/bark-gui",
    stars: "2k+",
    description: "Web interface for Suno AI's Bark text-to-audio model.",
    category: "AI Apps & Demos",
    features: ["Text-to-speech", "Sound effects", "Voice presets"],
    install: "pip install -r requirements.txt",
    useCase: "Web interface for generating speech and audio from text"
  },
{
    name: "Image2Prompt",
    url: "https://github.com/jhg023/promptgen",
    stars: "1k+",
    description: "Generate prompts from images using AI for image generation.",
    category: "AI Apps & Demos",
    features: ["Image analysis", "Prompt generation", "CLIP-based"],
    install: "pip install promptgen",
    useCase: "Extracting image generation prompts from existing images"
  },
{
    name: "Auto1111 API",
    url: "https://github.com/vladmandic/automatic",
    stars: "5k+",
    description: "Advanced fork of Stable Diffusion WebUI with API and extensions.",
    category: "AI Apps & Demos",
    features: ["API access", "Advanced options", "Extension support"],
    install: "git clone and run webui.sh",
    useCase: "Advanced Stable Diffusion with API and extended features"
  },
{
    name: "FastSD CPU",
    url: "https://github.com/rupeshs/fastsdcpu",
    stars: "4k+",
    description: "Fast stable diffusion on CPU with LCM and OpenVINO backends.",
    category: "AI Apps & Demos",
    features: ["CPU inference", "LCM models", "OpenVINO acceleration"],
    install: "pip install -r requirements.txt",
    useCase: "Running Stable Diffusion on CPU without a GPU"
  },
{
    name: "SDXL Turbo",
    url: "https://github.com/Stability-AI/generative-models",
    stars: "25k+",
    description: "Real-time text-to-image generation with SDXL Turbo model.",
    category: "AI Apps & Demos",
    features: ["1-step generation", "Real-time", "Text-to-image"],
    install: "pip install generative-models",
    useCase: "Ultra-fast image generation from text prompts"
  },
{
    name: "Llamafile Examples",
    url: "https://github.com/Mozilla-Ocho/llamafile-examples",
    stars: "500+",
    description: "Example projects and demos for llamafile local LLM deployment.",
    category: "AI Apps & Demos",
    features: ["Single-file deploy", "Cross-platform", "Examples"],
    install: "Download and execute llamafile",
    useCase: "Demo and example projects for local LLM deployment"
  },
{
    name: "Chatbot Arena",
    url: "https://github.com/lm-sys/FastChat",
    stars: "38k+",
    description: "Platform for comparing LLMs through blind human evaluation.",
    category: "AI Apps & Demos",
    features: ["Blind comparison", "Elo ratings", "Human evaluation"],
    install: "pip install fastchat",
    useCase: "Comparing LLM quality through anonymous human evaluation"
  },
{
    name: "Voice Assistant",
    url: "https://github.com/t41372/Open-LLM-VTuber",
    stars: "6k+",
    description: "Voice chat with local LLMs using voice input and animated avatars.",
    category: "AI Apps & Demos",
    features: ["Voice input", "Avatar animation", "Local LLM"],
    install: "pip install -r requirements.txt",
    useCase: "Interactive voice chat with AI using animated characters"
  },
{
    name: "Open Source Alternatives",
    url: "https://github.com/nicedoc/opensource-ai-tools",
    stars: "1k+",
    description: "Curated list of open-source alternatives to commercial AI tools.",
    category: "AI Apps & Demos",
    features: ["Tool directory", "Categorized", "Updated regularly"],
    install: "N/A",
    useCase: "Finding open-source alternatives to proprietary AI tools"
  },
{
    name: "AI Collection",
    url: "https://github.com/mahseema/awesome-ai-tools",
    stars: "6k+",
    description: "Curated list of AI-powered tools and applications across categories.",
    category: "AI Apps & Demos",
    features: ["AI tool directory", "Categories", "Regular updates"],
    install: "N/A",
    useCase: "Discovering AI tools and applications for various use cases"
  },
{
    name: "Dify Playground",
    url: "https://github.com/langgenius/dify",
    stars: "60k+",
    description: "Visual workflow builder for AI applications with RAG and agents.",
    category: "AI Apps & Demos",
    features: ["Visual builder", "RAG", "Multi-model"],
    install: "docker compose up -d",
    useCase: "Building AI apps through a visual playground interface"
  },
{
    name: "Rasa Open Source",
    url: "https://github.com/RasaHQ/rasa",
    stars: "19k+",
    description: "Open-source conversational AI framework for enterprise chatbots.",
    category: "AI Apps & Demos",
    features: ["Intent classification", "Dialogue management", "Forms"],
    install: "pip install rasa",
    useCase: "Enterprise conversational AI applications"
  },
{
    name: "Deep-Live-Cam",
    url: "https://github.com/hacksider/Deep-Live-Cam",
    stars: "42k+",
    description: "Real-time face swap and video deepfake tool.",
    category: "AI Apps & Demos",
    features: ["Real-time face swap", "Video processing", "Multiple faces"],
    install: "pip install -r requirements.txt",
    useCase: "Real-time face swapping in video streams"
  },
{
    name: "PhotoMaker",
    url: "https://github.com/TencentARC/PhotoMaker",
    stars: "9k+",
    description: "Customized realistic photo generation with identity preservation.",
    category: "AI Apps & Demos",
    features: ["Identity preservation", "Style customization", "Quality photos"],
    install: "pip install photomaker",
    useCase: "Generating customized photos while preserving identity"
  },
{
    name: "IP-Adapter",
    url: "https://github.com/tencent-ailab/IP-Adapter",
    stars: "6k+",
    description: "Image prompt adapter for text-to-image diffusion models.",
    category: "AI Apps & Demos",
    features: ["Image prompting", "Style transfer", "Multi-image"],
    install: "pip install ip-adapter",
    useCase: "Using reference images as prompts for image generation"
  },
{
    name: "SD-Webui-Rembg",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui-rembg",
    stars: "3k+",
    description: "Background removal extension for Stable Diffusion WebUI.",
    category: "AI Apps & Demos",
    features: ["Background removal", "Pre-processing", "Post-processing"],
    install: "Install from WebUI extensions",
    useCase: "Removing backgrounds in Stable Diffusion workflows"
  },
{
    name: "Omost",
    url: "https://github.com/lllyasviel/omost",
    stars: "2k+",
    description: "LVM-powered image generation with composable prompt composition.",
    category: "AI Apps & Demos",
    features: ["Prompt composition", "LVM guidance", "Detailed control"],
    install: "pip install omost",
    useCase: "Enhanced image generation with LVM-guided composition"
  },
{
    name: "Text Generation WebUI",
    url: "https://github.com/oobabooga/text-generation-webui",
    stars: "40k+",
    description: "Full-featured web UI for running language models locally.",
    category: "AI Apps & Demos",
    features: ["Chat interface", "Model management", "Extensions"],
    install: "git clone and run start script",
    useCase: "Running and chatting with local language models"
  },
{
    name: "Wandb Workspaces",
    url: "https://github.com/wandb/workspaces",
    stars: "500+",
    description: "Interactive workspaces for ML experiment monitoring and analysis.",
    category: "AI Apps & Demos",
    features: ["Visual dashboards", "Metric tracking", "Collaboration"],
    install: "pip install wandb",
    useCase: "Collaborative ML experiment monitoring and analysis"
  },
{
    name: "Stable Diffusion Prompts",
    url: "https://github.com/FilipHallqvist/StableDiffusionPrompts",
    stars: "1k+",
    description: "Collection of prompts and guides for Stable Diffusion image generation.",
    category: "AI Apps & Demos",
    features: ["Prompt library", "Style guides", "Examples"],
    install: "N/A",
    useCase: "Reference for effective Stable Diffusion prompt writing"
  },
{
    name: "Flowise Demo",
    url: "https://github.com/FlowiseAI/Flowise",
    stars: "35k+",
    description: "Drag & drop LLM flow builder with pre-built templates.",
    category: "AI Apps & Demos",
    features: ["Visual builder", "Templates", "API deployment"],
    install: "npx flowise start",
    useCase: "Quickly creating and deploying LLM workflow demos"
  },
{
    name: "Langflow Demo",
    url: "https://github.com/langflow-ai/langflow",
    stars: "35k+",
    description: "Demo playground for LangChain-based visual workflow building.",
    category: "AI Apps & Demos",
    features: ["Visual playground", "Component library", "Sharing"],
    install: "pip install langflow",
    useCase: "Interactive demos of LangChain workflow capabilities"
  },
{
    name: "Ollama Demo",
    url: "https://github.com/ollama/ollama",
    stars: "115k+",
    description: "Demo of running large language models locally with ease.",
    category: "AI Apps & Demos",
    features: ["Local LLM", "Model library", "API server"],
    install: "curl -fsSL https://ollama.ai/install.sh | sh",
    useCase: "Quick demonstration of local LLM capabilities"
  },
{
    name: "MLflow Demo",
    url: "https://github.com/mlflow/mlflow",
    stars: "19k+",
    description: "Demo of ML experiment tracking, model management, and deployment.",
    category: "AI Apps & Demos",
    features: ["Experiment tracking", "Model registry", "UI dashboard"],
    install: "pip install mlflow",
    useCase: "Demonstrating ML lifecycle management capabilities"
  },
{
    name: "Grafana",
    url: "https://github.com/grafana/grafana",
    stars: "65k+",
    description: "Open-source analytics and monitoring platform with ML capabilities.",
    category: "MLOps & Infra",
    features: ["Dashboards", "Alerting", "Machine learning"],
    install: "docker run -d -p 3000:3000 grafana/grafana",
    useCase: "Monitoring and visualizing ML system metrics and performance"
  },
{
    name: "Prometheus",
    url: "https://github.com/prometheus/prometheus",
    stars: "56k+",
    description: "Open-source monitoring and alerting toolkit for metrics collection.",
    category: "MLOps & Infra",
    features: ["Metrics collection", "Alerting rules", "Service discovery"],
    install: "docker run -p 9090:9090 prom/prometheus",
    useCase: "Collecting and monitoring ML system metrics"
  },
{
    name: "Docker ML",
    url: "https://github.com/NVIDIA/nvidia-docker",
    stars: "18k+",
    description: "NVIDIA Docker container support for GPU-accelerated ML workloads.",
    category: "MLOps & Infra",
    features: ["GPU support", "Container isolation", "NVIDIA drivers"],
    install: "docker run --gpus all",
    useCase: "Running GPU-accelerated ML workloads in containers"
  },
{
    name: "KServe",
    url: "https://github.com/kserve/kserve",
    stars: "5k+",
    description: "Highly scalable and standards-based model inference on Kubernetes.",
    category: "MLOps & Infra",
    features: ["Serverless inference", "Auto-scaling", "Multi-framework"],
    install: "kubectl apply -f",
    useCase: "Scalable model serving on Kubernetes infrastructure"
  },
{
    name: "Seldon Core",
    url: "https://github.com/SeldonIO/seldon-core",
    stars: "4k+",
    description: "ML deployment platform for Kubernetes with advanced inference features.",
    category: "MLOps & Infra",
    features: ["Canary deployments", "A/B testing", "Multi-framework"],
    install: "kubectl apply -f",
    useCase: "Enterprise ML deployment on Kubernetes"
  },
{
    name: "MLServer",
    url: "https://github.com/SeldonIO/MLServer",
    stars: "2k+",
    description: "Universal framework for building and deploying ML inference servers.",
    category: "MLOps & Infra",
    features: ["Multi-framework", "gRPC/REST", "Drift detection"],
    install: "pip install mlserver",
    useCase: "Building ML inference servers with standardized APIs"
  },
{
    name: "Volcano",
    url: "https://github.com/volcano-sh/volcano",
    stars: "4k+",
    description: "Kubernetes-native batch scheduling system for ML training workloads.",
    category: "MLOps & Infra",
    features: ["Batch scheduling", "GPU sharing", "Gang scheduling"],
    install: "kubectl apply -f",
    useCase: "Scheduling large-scale ML training jobs on Kubernetes"
  },
{
    name: "Argo Workflows",
    url: "https://github.com/argoproj/argo-workflows",
    stars: "15k+",
    description: "Kubernetes-native workflow engine for ML pipeline orchestration.",
    category: "MLOps & Infra",
    features: ["DAG workflows", "Kubernetes-native", "UI dashboard"],
    install: "kubectl apply -f",
    useCase: "Orchestrating ML pipelines on Kubernetes"
  },
{
    name: "Apache Airflow",
    url: "https://github.com/apache/airflow",
    stars: "37k+",
    description: "Platform for programmatically authoring, scheduling, and monitoring workflows.",
    category: "MLOps & Infra",
    features: ["DAG scheduling", "Rich UI", "Extensible operators"],
    install: "pip install apache-airflow",
    useCase: "Orchestrating complex ML workflows and data pipelines"
  },
{
    name: "Prefect",
    url: "https://github.com/PrefectHQ/prefect",
    stars: "19k+",
    description: "Modern workflow orchestration for data and ML pipelines.",
    category: "MLOps & Infra",
    features: ["Dynamic workflows", "Retry logic", "Observability"],
    install: "pip install prefect",
    useCase: "Modern workflow orchestration for ML and data pipelines"
  },
{
    name: "Dagster",
    url: "https://github.com/dagster-io/dagster",
    stars: "12k+",
    description: "Data orchestrator for ML with software-defined assets.",
    category: "MLOps & Infra",
    features: ["Asset-based", "Type system", "Built-in testing"],
    install: "pip install dagster",
    useCase: "Data-aware workflow orchestration for ML applications"
  },
{
    name: "ZenML",
    url: "https://github.com/zenml-io/zenml",
    stars: "5k+",
    description: "MLOps framework for creating portable, reproducible ML pipelines.",
    category: "MLOps & Infra",
    features: ["Pipeline abstraction", "Stack components", "Experiment tracking"],
    install: "pip install zenml",
    useCase: "Building portable ML pipelines across infrastructure"
  },
{
    name: "Feast",
    url: "https://github.com/feast-dev/feast",
    stars: "5k+",
    description: "Feature store for ML with offline and online feature serving.",
    category: "MLOps & Infra",
    features: ["Feature serving", "Point-in-time joins", "Scalable"],
    install: "pip install feast",
    useCase: "Managing and serving ML features consistently"
  },
{
    name: "Tecton",
    url: "https://github.com/tecton-ai/tecton",
    stars: "500+",
    description: "Managed feature platform for real-time ML applications.",
    category: "MLOps & Infra",
    features: ["Real-time features", "Managed platform", "Point-in-time"],
    install: "pip install tecton",
    useCase: "Enterprise feature platform for real-time ML"
  },
{
    name: "Hopsworks",
    url: "https://github.com/logicalclocks/hopsworks",
    stars: "1k+",
    description: "Open-source data platform for ML with feature store and model registry.",
    category: "MLOps & Infra",
    features: ["Feature store", "Model registry", "Notebooks"],
    install: "See documentation",
    useCase: "End-to-end ML platform with feature management"
  },
{
    name: "Flyte",
    url: "https://github.com/flyteorg/flyte",
    stars: "5k+",
    description: "Workflow automation platform for ML and data processing pipelines.",
    category: "MLOps & Infra",
    features: ["Type-safe workflows", "Kubernetes-native", "Caching"],
    install: "See documentation",
    useCase: "Scalable, type-safe ML workflow automation"
  },
{
    name: "Metaflow",
    url: "https://github.com/Netflix/metaflow",
    stars: "9k+",
    description: "Netflix's ML infrastructure for building and managing real-life projects.",
    category: "MLOps & Infra",
    features: ["Version control", "S3 integration", "Local to cloud"],
    install: "pip install metaflow",
    useCase: "Managing ML projects from prototype to production"
  },
{
    name: "Neptune",
    url: "https://github.com/neptune-ai/neptune-client",
    stars: "1k+",
    description: "Experiment tracking and model registry for ML teams.",
    category: "MLOps & Infra",
    features: ["Experiment tracking", "Model registry", "Dashboard"],
    install: "pip install neptune",
    useCase: "Tracking and managing ML experiments and models"
  },
{
    name: "ClearML",
    url: "https://github.com/allegroai/clearml",
    stars: "2k+",
    description: "Open-source ML platform with experiment tracking and pipeline automation.",
    category: "MLOps & Infra",
    features: ["Experiment tracking", "Pipeline automation", "Dataset management"],
    install: "pip install clearml",
    useCase: "End-to-end MLOps with experiment and pipeline management"
  },
{
    name: "SigMF",
    url: "https://github.com/gnuradio/sigmf",
    stars: "1k+",
    description: "Signal Metadata Format for describing recorded RF signals.",
    category: "MLOps & Infra",
    features: ["RF metadata", "Signal description", "Standard format"],
    install: "pip install sigmf",
    useCase: "Standardizing metadata for RF signal processing and ML"
  },
{
    name: "Kubernetes ML",
    url: "https://github.com/kubernetes/kubernetes",
    stars: "112k+",
    description: "Container orchestration platform for deploying and managing ML workloads.",
    category: "MLOps & Infra",
    features: ["Container orchestration", "Auto-scaling", "Rolling updates"],
    install: "See kubernetes.io",
    useCase: "Deploying and managing ML workloads at scale"
  },
{
    name: "Ray",
    url: "https://github.com/ray-project/ray",
    stars: "36k+",
    description: "Distributed computing framework for scaling AI and Python workloads.",
    category: "MLOps & Infra",
    features: ["Distributed computing", "Ray Serve", "Ray Train"],
    install: "pip install ray",
    useCase: "Scaling AI applications and ML training across clusters"
  },
{
    name: "DVC",
    url: "https://github.com/iterative/dvc",
    stars: "14k+",
    description: "Data version control for ML with Git-like data management.",
    category: "MLOps & Infra",
    features: ["Data versioning", "Pipeline tracking", "Cloud storage"],
    install: "pip install dvc",
    useCase: "Version controlling datasets and ML experiments with Git"
  },
{
    name: "LakeFS",
    url: "https://github.com/treeverse/lakeFS",
    stars: "5k+",
    description: "Git-like version control for data lakes and ML datasets.",
    category: "MLOps & Infra",
    features: ["Data branching", "Versioning", "Rollback"],
    install: "docker run treeverse/lakefs",
    useCase: "Version controlling ML datasets like Git repositories"
  },
{
    name: "Pachyderm",
    url: "https://github.com/pachyderm/pachyderm",
    stars: "9k+",
    description: "Data versioning and pipeline automation for ML and data science.",
    category: "MLOps & Infra",
    features: ["Data lineage", "Pipeline automation", "Versioning"],
    install: "See documentation",
    useCase: "Data-driven pipeline automation with full lineage tracking"
  },
{
    name: "Guardrails AI",
    url: "https://github.com/guardrails-ai/guardrails",
    stars: "7k+",
    description: "Toolkit for validating and correcting LLM outputs with typed validators.",
    category: "Security & Guardrails",
    features: ["Output validation", "Re-asking", "Typed validators"],
    install: "pip install guardrails-ai",
    useCase: "Validating and correcting LLM outputs for production reliability"
  },
{
    name: "LLM Guard",
    url: "https://github.com/protectai/llm-guard",
    stars: "3k+",
    description: "Toolkit for securing LLM interactions with input and output scanners.",
    category: "Security & Guardrails",
    features: ["Input scanning", "Output scanning", "PII detection"],
    install: "pip install llm-guard",
    useCase: "Securing LLM applications from prompt injection and data leaks"
  },
{
    name: "Rebuff",
    url: "https://github.com/protectai/rebuff",
    stars: "1k+",
    description: "Self-hardening prompt injection detection framework for LLMs.",
    category: "Security & Guardrails",
    features: ["Prompt injection detection", "Multi-layered", "Heuristics"],
    install: "pip install rebuff",
    useCase: "Detecting and preventing prompt injection attacks"
  },
{
    name: "Vigil",
    url: "https://github.com/protectai/vigil",
    stars: "2k+",
    description: "LLM security scanner for detecting prompt injection and jailbreaks.",
    category: "Security & Guardrails",
    features: ["Prompt scanning", "Jailbreak detection", "Custom rules"],
    install: "pip install vigil-llm",
    useCase: "Scanning LLM inputs for security threats and injection attempts"
  },
{
    name: "Microsoft Presidio",
    url: "https://github.com/microsoft/presidio",
    stars: "3k+",
    description: "Data protection and anonymization SDK for text and images.",
    category: "Security & Guardrails",
    features: ["PII detection", "Anonymization", "Custom recognizers"],
    install: "pip install presidio-analyzer presidio-anonymizer",
    useCase: "Detecting and anonymizing PII in text and images"
  },
{
    name: "NVIDIA Guardrails",
    url: "https://github.com/NVIDIA/NeMo-Guardrails",
    stars: "6k+",
    description: "Programmable guardrails for LLM-based conversational systems.",
    category: "Security & Guardrails",
    features: ["Colang language", "Topic control", "Input/output filtering"],
    install: "pip install nemoguardrails",
    useCase: "Adding programmable safety rails to LLM chatbots"
  },
{
    name: "Lakera Guard",
    url: "https://github.com/lakeraai/guard",
    stars: "2k+",
    description: "Real-time prompt injection detection for LLM applications.",
    category: "Security & Guardrails",
    features: ["Real-time detection", "Low latency", "Pre-built classifiers"],
    install: "pip install lakera-guard",
    useCase: "Real-time prompt injection protection for production LLMs"
  },
{
    name: "Aegis AI Content Safety",
    url: "https://github.com/microsoft/Aegis-AI-Content-Safety",
    stars: "1k+",
    description: "Microsoft's AI content safety classifier for moderating LLM outputs.",
    category: "Security & Guardrails",
    features: ["Content moderation", "Harmful content detection", "Azure integration"],
    install: "pip install azure-ai-content-safety",
    useCase: "Moderating and filtering harmful content in LLM outputs"
  },
{
    name: "Moderation API",
    url: "https://github.com/openai/openai-python",
    stars: "24k+",
    description: "OpenAI's content moderation API for classifying harmful content.",
    category: "Security & Guardrails",
    features: ["Content classification", "Category detection", "Batch processing"],
    install: "pip install openai",
    useCase: "Automated content moderation for LLM applications"
  },
{
    name: "ShieldGemma",
    url: "https://github.com/google-deepmind/gemma",
    stars: "30k+",
    description: "Google's safety classifier built on Gemma for content filtering.",
    category: "Security & Guardrails",
    features: ["Safety classification", "Multi-category", "Open model"],
    install: "pip install shieldgemma",
    useCase: "Content safety classification for generative AI outputs"
  },
{
    name: "LLM Firewall",
    url: "https://github.com/leondz/garak",
    stars: "4k+",
    description: "LLM vulnerability scanner and red-teaming framework.",
    category: "Security & Guardrails",
    features: ["Vulnerability scanning", "Red-teaming", "Probing"],
    install: "pip install garak",
    useCase: "Scanning LLMs for vulnerabilities and security weaknesses"
  },
{
    name: "PyRIT",
    url: "https://github.com/Azure/PyRIT",
    stars: "2k+",
    description: "Microsoft's Python Risk Identification Tool for generative AI red-teaming.",
    category: "Security & Guardrails",
    features: ["Red-teaming", "Risk identification", "Multi-modal"],
    install: "pip install pyrit",
    useCase: "Red-teaming generative AI systems to identify risks"
  },
{
    name: "Artificial Analysis",
    url: "https://github.com/ArtificialAnalysis",
    stars: "500+",
    description: "Independent benchmarking and analysis of AI model performance.",
    category: "Security & Guardrails",
    features: ["Model benchmarks", "Quality metrics", "Cost analysis"],
    install: "N/A",
    useCase: "Comparing AI model quality, speed, and cost objectively"
  },
{
    name: "Insights Safety",
    url: "https://github.com/Azure/azure-sdk-for-python",
    stars: "5k+",
    description: "Azure AI Content Safety SDK for content moderation and safety.",
    category: "Security & Guardrails",
    features: ["Text moderation", "Image analysis", "Custom categories"],
    install: "pip install azure-ai-content-safety",
    useCase: "Azure-powered content safety for AI applications"
  },
{
    name: "Guardrails Hub",
    url: "https://github.com/guardrails-ai/guardrails-hub",
    stars: "1k+",
    description: "Community hub of validators and guards for LLM output validation.",
    category: "Security & Guardrails",
    features: ["Pre-built validators", "Community contributions", "Installable"],
    install: "pip install guardrails-hub",
    useCase: "Extending Guardrails AI with community-built validators"
  },
{
    name: "AI Safety Benchmark",
    url: "https://github.com/AI-Safety-Benchmark",
    stars: "500+",
    description: "Benchmarking suite for evaluating AI safety across multiple dimensions.",
    category: "Security & Guardrails",
    features: ["Safety metrics", "Multi-dimensional", "Comparative"],
    install: "See documentation",
    useCase: "Evaluating AI model safety across multiple risk categories"
  },
{
    name: "Llama Guard",
    url: "https://github.com/meta-llama/PurpleLlama",
    stars: "3k+",
    description: "Meta's safety classifier for identifying harmful content in AI outputs.",
    category: "Security & Guardrails",
    features: ["Harmful content detection", "Multi-category", "Open model"],
    install: "pip install llama-guard",
    useCase: "Classifying and filtering harmful AI-generated content"
  },
{
    name: "Purple Llama",
    url: "https://github.com/meta-llama/PurpleLlama",
    stars: "3k+",
    description: "Meta's set of tools for evaluating and improving LLM safety.",
    category: "Security & Guardrails",
    features: ["Safety evaluation", "Cybersecurity", "Content safety"],
    install: "pip install purple-llama",
    useCase: "Comprehensive safety evaluation of LLM systems"
  },
{
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    stars: "N/A",
    description: "AI pair programmer that helps you write better code faster.",
    category: "AI Coding & Software Engineering",
    features: ["Code suggestions", "Multi-language", "IDE integration"],
    install: "Install VS Code extension",
    useCase: "Getting AI-powered code completions while coding"
  },
{
    name: "Tabby",
    url: "https://github.com/TabbyML/tabby",
    stars: "23k+",
    description: "Self-hosted AI coding assistant with code completion and chat.",
    category: "AI Coding & Software Engineering",
    features: ["Self-hosted", "Code completion", "Chat interface"],
    install: "docker run tabbyml/tabby",
    useCase: "Self-hosted AI coding assistant for teams"
  },
{
    name: "Cody",
    url: "https://github.com/sourcegraph/cody",
    stars: "3k+",
    description: "AI code assistant powered by Sourcegraph code intelligence.",
    category: "AI Coding & Software Engineering",
    features: ["Codebase context", "Multi-repo", "IDE integration"],
    install: "Install from VS Code marketplace",
    useCase: "AI coding assistant with deep codebase understanding"
  },
{
    name: "Open Interpreter",
    url: "https://github.com/OpenInterpreter/open-interpreter",
    stars: "53k+",
    description: "Run code locally with natural language using any LLM.",
    category: "AI Coding & Software Engineering",
    features: ["Natural language coding", "Local execution", "Multi-language"],
    install: "pip install open-interpreter",
    useCase: "Executing code through natural language instructions"
  },
{
    name: "E2B",
    url: "https://github.com/e2b-dev/e2b",
    stars: "7k+",
    description: "AI-powered cloud sandboxes for running and testing code.",
    category: "AI Coding & Software Engineering",
    features: ["Cloud sandboxes", "Fast startup", "SDK integration"],
    install: "pip install e2b",
    useCase: "Running AI-generated code in secure cloud sandboxes"
  },
{
    name: "Daytona",
    url: "https://github.com/daytonaio/daytona",
    stars: "12k+",
    description: "AI-powered development environment management platform.",
    category: "AI Coding & Software Engineering",
    features: ["Dev environment management", "Snapshots", "Multi-cloud"],
    install: "curl -fsSL https://get.daytona.io | bash",
    useCase: "Managing AI-optimized development environments"
  },
{
    name: "Codeium",
    url: "https://github.com/Exafunction/codeium.vim",
    stars: "3k+",
    description: "Free AI-powered code completion and chat for multiple editors.",
    category: "AI Coding & Software Engineering",
    features: ["Free tier", "Multi-editor", "Code completion"],
    install: "Install from marketplace",
    useCase: "Free AI code completion across multiple editors"
  },
{
    name: "Supermaven",
    url: "https://github.com/supermaven/supermaven",
    stars: "2k+",
    description: "Fast AI code completion with a large context window.",
    category: "AI Coding & Software Engineering",
    features: ["1M token context", "Fast completion", "Multi-language"],
    install: "Install from VS Code marketplace",
    useCase: "Ultra-fast code completion with massive context"
  },
{
    name: "Sourcebot",
    url: "https://github.com/nichochar/sourcebot",
    stars: "1k+",
    description: "AI-powered code search and navigation across repositories.",
    category: "AI Coding & Software Engineering",
    features: ["Code search", "Repository analysis", "AI navigation"],
    install: "npm install",
    useCase: "AI-enhanced code search across multiple repositories"
  },
{
    name: "OpenCommit",
    url: "https://github.com/di-sukharev/opencommit",
    stars: "5k+",
    description: "AI-powered git commit message generation from staged changes.",
    category: "AI Coding & Software Engineering",
    features: ["Auto commit messages", "Conventional commits", "Multi-language"],
    install: "npm install -g opencommit",
    useCase: "Generating meaningful git commit messages automatically"
  },
{
    name: "Morphik",
    url: "https://github.com/morphik-org/morphik",
    stars: "2k+",
    description: "AI-native database for code understanding and knowledge.",
    category: "AI Coding & Software Engineering",
    features: ["Code embeddings", "Knowledge graph", "Search"],
    install: "pip install morphik",
    useCase: "Building AI-powered code understanding and search"
  },
{
    name: "Next.js AI Chatbot",
    url: "https://github.com/vercel/ai-chatbot",
    stars: "9k+",
    description: "Full-featured AI chatbot built with Next.js and Vercel AI SDK.",
    category: "AI Web Applications",
    features: ["Next.js 14", "Vercel AI SDK", "Auth and database"],
    install: "npx create-next-app",
    useCase: "Building production AI chat applications with Next.js"
  },
{
    name: "Chatbot UI",
    url: "https://github.com/mckaywrigley/chatbot-ui",
    stars: "30k+",
    description: "Open-source ChatGPT clone for the browser.",
    category: "AI Web Applications",
    features: ["Multi-model", "Markdown rendering", "Prompt templates"],
    install: "docker compose up -d",
    useCase: "Quick deployment of a ChatGPT-like web interface"
  },
{
    name: "Streamlit",
    url: "https://github.com/streamlit/streamlit",
    stars: "38k+",
    description: "Fast way to build and share data apps and AI interfaces.",
    category: "AI Web Applications",
    features: ["Rapid prototyping", "Python-native", "Community components"],
    install: "pip install streamlit",
    useCase: "Quickly building and sharing AI data applications"
  },
{
    name: "Gradio",
    url: "https://github.com/gradio-app/gradio",
    stars: "35k+",
    description: "Build and share ML demos with a web interface in minutes.",
    category: "AI Web Applications",
    features: ["Python UI", "Shareable links", "Embedding support"],
    install: "pip install gradio",
    useCase: "Creating interactive web demos for ML models"
  },
{
    name: "NextChat",
    url: "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web",
    stars: "80k+",
    description: "Well-designed web client for ChatGPT with multi-model support.",
    category: "AI Web Applications",
    features: ["Web interface", "Multi-model", "Markdown support"],
    install: "docker compose up -d",
    useCase: "Clean web interface for ChatGPT-compatible APIs"
  },
{
    name: "LobeChat",
    url: "https://github.com/lobehub/lobe-chat",
    stars: "55k+",
    description: "Open-source ChatGPT alternative with plugin and RAG support.",
    category: "AI Web Applications",
    features: ["Multi-model", "Plugin system", "RAG support"],
    install: "docker compose up -d",
    useCase: "Self-hosted ChatGPT alternative with customization"
  },
{
    name: "Dify Web",
    url: "https://github.com/langgenius/dify",
    stars: "60k+",
    description: "Web interface for building AI apps with visual workflow builder.",
    category: "AI Web Applications",
    features: ["Visual builder", "RAG", "Multi-model"],
    install: "docker compose up -d",
    useCase: "Building AI apps through a web-based visual interface"
  },
{
    name: "React Native ExecuTorch",
    url: "https://github.com/pytorch/executorch",
    stars: "2k+",
    description: "Run PyTorch models on mobile with Meta ExecuTorch framework.",
    category: "AI Mobile Applications",
    features: ["On-device inference", "Optimized kernels", "Multi-modal"],
    install: "npm install react-native-executorch",
    useCase: "Running ML models directly on mobile devices"
  },
{
    name: "MLC LLM Mobile",
    url: "https://github.com/mlc-ai/mlc-llm",
    stars: "19k+",
    description: "Deploy LLMs on mobile devices with MLC compilation.",
    category: "AI Mobile Applications",
    features: ["Mobile deployment", "GPU acceleration", "Universal"],
    install: "pip install mlc-llm",
    useCase: "Running LLMs locally on iOS and Android devices"
  },
{
    name: "TensorFlow Lite",
    url: "https://github.com/tensorflow/tensorflow",
    stars: "186k+",
    description: "Deploy ML models on mobile and edge devices efficiently.",
    category: "AI Mobile Applications",
    features: ["Mobile inference", "Model optimization", "Android and iOS"],
    install: "pip install tflite-runtime",
    useCase: "Running optimized ML models on mobile devices"
  },
{
    name: "Core ML Tools",
    url: "https://github.com/apple/coremltools",
    stars: "2k+",
    description: "Convert ML models to Apple Core ML format for iOS and macOS.",
    category: "AI Mobile Applications",
    features: ["Model conversion", "Apple optimized", "ONNX support"],
    install: "pip install coremltools",
    useCase: "Converting and deploying ML models on Apple devices"
  },
{
    name: "MediaPipe",
    url: "https://github.com/google/mediapipe",
    stars: "28k+",
    description: "Google cross-platform ML solutions for mobile and edge.",
    category: "AI Mobile Applications",
    features: ["Face detection", "Pose estimation", "Hand tracking"],
    install: "pip install mediapipe",
    useCase: "Adding computer vision capabilities to mobile apps"
  },
{
    name: "Flutter TFLite",
    url: "https://github.com/tensorflow/flutter-tflite",
    stars: "1k+",
    description: "Flutter plugin for TensorFlow Lite model inference.",
    category: "AI Mobile Applications",
    features: ["Flutter integration", "Image classification", "Object detection"],
    install: "flutter pub add tflite_flutter",
    useCase: "Running TFLite models within Flutter mobile apps"
  },
{
    name: "ONNX Runtime Mobile",
    url: "https://github.com/microsoft/onnxruntime",
    stars: "14k+",
    description: "Cross-platform ML inference for mobile with ONNX Runtime.",
    category: "AI Mobile Applications",
    features: ["Mobile inference", "Hardware acceleration", "Multi-platform"],
    install: "pip install onnxruntime-mobile",
    useCase: "Running ONNX models on mobile devices"
  },
{
    name: "NCNN",
    url: "https://github.com/Tencent/ncnn",
    stars: "21k+",
    description: "Tencent high-performance neural network inference framework for mobile.",
    category: "AI Mobile Applications",
    features: ["Mobile optimized", "Vulkan GPU", "Tiny binary"],
    install: "See GitHub instructions",
    useCase: "High-performance neural network inference on mobile"
  },
{
    name: "MNN",
    url: "https://github.com/alibaba/MNN",
    stars: "8k+",
    description: "Alibaba lightweight deep learning framework for mobile inference.",
    category: "AI Mobile Applications",
    features: ["Lightweight", "Mobile optimized", "Multi-framework"],
    install: "See GitHub instructions",
    useCase: "Efficient deep learning inference on mobile devices"
  },
{
    name: "Spring AI",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "3k+",
    description: "Spring framework for building AI-powered Java applications.",
    category: "Spring AI & Enterprise",
    features: ["Spring Boot integration", "Vector store support", "Chat models"],
    install: "Maven dependency",
    useCase: "Building AI applications in the Spring/Java ecosystem"
  },
{
    name: "Spring AI Alibaba",
    url: "https://github.com/alibaba/spring-ai-alibaba",
    stars: "3k+",
    description: "Spring AI integration for Alibaba DashScope models.",
    category: "Spring AI & Enterprise",
    features: ["DashScope integration", "Chinese LLM support", "RAG"],
    install: "Maven dependency",
    useCase: "Building AI apps with Spring and Alibaba Cloud models"
  },
{
    name: "Quarkus LangChain4j",
    url: "https://github.com/quarkusio/quarkus",
    stars: "14k+",
    description: "Quarkus with native LangChain4j integration for GraalVM.",
    category: "Spring AI & Enterprise",
    features: ["Native compilation", "CDI integration", "Fast startup"],
    install: "Quarkus extension dependency",
    useCase: "High-performance AI with Quarkus and GraalVM"
  },
{
    name: "Azure Spring Cloud AI",
    url: "https://github.com/Azure/azure-sdk-for-java",
    stars: "5k+",
    description: "Azure SDK for Java with AI and cognitive services integration.",
    category: "Spring AI & Enterprise",
    features: ["Azure AI services", "Java SDK", "Enterprise security"],
    install: "Maven dependency",
    useCase: "Integrating Azure AI services into Java applications"
  },
{
    name: "OpenAI Java SDK",
    url: "https://github.com/openai/openai-java",
    stars: "1k+",
    description: "Official Java SDK for the OpenAI API.",
    category: "Spring AI & Enterprise",
    features: ["Java native", "Type-safe", "Streaming support"],
    install: "Maven dependency",
    useCase: "Accessing OpenAI APIs from Java applications"
  },
{
    name: "Amazon Bedrock Java SDK",
    url: "https://github.com/aws/aws-sdk-java-v2",
    stars: "2k+",
    description: "AWS SDK for Java with Bedrock and AI model integration.",
    category: "Spring AI & Enterprise",
    features: ["Bedrock integration", "Multi-model", "Enterprise security"],
    install: "Maven dependency",
    useCase: "Using AWS Bedrock models from Java applications"
  },
{
    name: "Google Cloud AI Java",
    url: "https://github.com/googleapis/google-cloud-java",
    stars: "2k+",
    description: "Google Cloud Java SDK with Vertex AI and Gemini integration.",
    category: "Spring AI & Enterprise",
    features: ["Vertex AI", "Gemini models", "Cloud-native"],
    install: "Maven dependency",
    useCase: "Integrating Google Cloud AI services into Java apps"
  },
{
    name: "Neo4j Spring AI",
    url: "https://github.com/neo4j/neo4j",
    stars: "14k+",
    description: "Neo4j graph database with Spring AI integration for knowledge graphs.",
    category: "Spring AI & Enterprise",
    features: ["Graph database", "Knowledge graphs", "Spring integration"],
    install: "Maven dependency",
    useCase: "Graph-based AI applications with Neo4j and Spring"
  },
{
    name: "Langfuse",
    url: "https://github.com/langfuse/langfuse",
    stars: "7k+",
    description: "Open-source LLM engineering platform for tracing and monitoring.",
    category: "Observability & Evaluations",
    features: ["Tracing", "Evaluation", "Cost analytics"],
    install: "docker compose up -d",
    useCase: "Observability and evaluation of LLM applications"
  },
{
    name: "LangSmith",
    url: "https://github.com/langchain-ai/langsmith-sdk",
    stars: "1k+",
    description: "LangChain platform for tracing, debugging, and evaluating LLM apps.",
    category: "Observability & Evaluations",
    features: ["Trace visualization", "Evaluation datasets", "Monitoring"],
    install: "pip install langsmith",
    useCase: "Debugging and evaluating LangChain-based LLM applications"
  },
{
    name: "Phoenix",
    url: "https://github.com/Arize-ai/phoenix",
    stars: "7k+",
    description: "Open-source observability for LLM applications with tracing.",
    category: "Observability & Evaluations",
    features: ["LLM tracing", "Evaluation", "Dataset curation"],
    install: "pip install arize-phoenix",
    useCase: "Observability and evaluation for LLM-based applications"
  },
{
    name: "DeepEval",
    url: "https://github.com/confident-ai/deepeval",
    stars: "4k+",
    description: "LLM evaluation framework with 14+ metrics for testing.",
    category: "Observability & Evaluations",
    features: ["14+ metrics", "Pytest integration", "LLM-as-judge"],
    install: "pip install deepeval",
    useCase: "Comprehensive LLM evaluation with industry-standard metrics"
  },
{
    name: "Promptfoo",
    url: "https://github.com/promptfoo/promptfoo",
    stars: "5k+",
    description: "LLM prompt testing and evaluation framework.",
    category: "Observability & Evaluations",
    features: ["Prompt testing", "Red-teaming", "Side-by-side eval"],
    install: "npm install -g promptfoo",
    useCase: "Testing and evaluating LLM prompts and configurations"
  },
{
    name: "OpenAI Evals",
    url: "https://github.com/openai/evals",
    stars: "14k+",
    description: "OpenAI framework for evaluating AI models with custom evals.",
    category: "Observability & Evaluations",
    features: ["Eval framework", "Custom tasks", "Model comparison"],
    install: "pip install openai-evals",
    useCase: "Evaluating LLM model performance on custom tasks"
  },
{
    name: "Garak",
    url: "https://github.com/leondz/garak",
    stars: "4k+",
    description: "LLM vulnerability scanner for red-teaming and security eval.",
    category: "Observability & Evaluations",
    features: ["Vulnerability scanning", "Probing", "Automated attacks"],
    install: "pip install garak",
    useCase: "Red-teaming LLMs to identify security vulnerabilities"
  },
{
    name: "Braintrust",
    url: "https://github.com/braintrustdata/braintrust-sdk",
    stars: "1k+",
    description: "Enterprise LLM evaluation and observability platform SDK.",
    category: "Observability & Evaluations",
    features: ["Evaluation SDK", "Logging", "Prompt management"],
    install: "pip install braintrust",
    useCase: "Enterprise LLM evaluation and monitoring"
  },
{
    name: "Fabric",
    url: "https://github.com/danielmiessler/fabric",
    stars: "25k+",
    description: "Framework for augmenting humans using AI with prompt patterns.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Prompt patterns", "Chain of thought", "Framework"],
    install: "go install github.com/danielmiessler/fabric@latest",
    useCase: "Applying structured prompt patterns for AI augmentation"
  },
{
    name: "Prompt Engineering Guide",
    url: "https://github.com/dair-ai/Prompt-Engineering-Guide",
    stars: "53k+",
    description: "Comprehensive guide and resources for prompt engineering.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Techniques guide", "Examples", "Research papers"],
    install: "N/A",
    useCase: "Learning prompt engineering best practices"
  },
{
    name: "Ludwig",
    url: "https://github.com/ludwig-ai/ludwig",
    stars: "12k+",
    description: "Declarative ML framework for fine-tuning and building AI pipelines.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Declarative config", "AutoML", "Multi-modal"],
    install: "pip install ludwig",
    useCase: "Declarative fine-tuning and building of ML pipelines"
  },
{
    name: "MLX",
    url: "https://github.com/ml-explore/mlx",
    stars: "20k+",
    description: "Apple's machine learning framework for Apple silicon.",
    category: "MLOps & Infra",
    features: ["Apple silicon optimized", "NumPy-like API", "Lazy computation"],
    install: "pip install mlx",
    useCase: "ML on Apple Silicon with unified memory"
  },
{
    name: "Polyaxon",
    url: "https://github.com/polyaxon/polyaxon",
    stars: "3k+",
    description: "Platform for building, training, and scaling ML projects.",
    category: "MLOps & Infra",
    features: ["ML orchestration", "Experiment tracking", "Kubernetes"],
    install: "pip install polyaxon",
    useCase: "Enterprise ML platform on Kubernetes"
  },
{
    name: "Valohai",
    url: "https://github.com/valohai",
    stars: "1k+",
    description: "MLOps platform for managing ML pipelines and infrastructure.",
    category: "MLOps & Infra",
    features: ["Pipeline orchestration", "Infrastructure management", "Versioning"],
    install: "pip install valohai",
    useCase: "Enterprise MLOps platform"
  },
{
    name: "TF Serving",
    url: "https://github.com/tensorflow/serving",
    stars: "6k+",
    description: "Flexible, high-performance serving system for ML models.",
    category: "Model Serving & Inference",
    features: ["gRPC/REST", "Model versioning", "Batching"],
    install: "pip install tensorflow-serving-api",
    useCase: "Serving TensorFlow models in production"
  },
{
    name: "Text Generation Inference",
    url: "https://github.com/huggingface/text-generation-inference",
    stars: "9k+",
    description: "Hugging Face's production-ready LLM inference server.",
    category: "Model Serving & Inference",
    features: ["Flash attention", "Continuous batching", "Quantization"],
    install: "Docker or pip",
    useCase: "Production LLM serving"
  },
{
    name: "AG2",
    url: "https://github.com/ag2ai/ag2",
    stars: "5k+",
    description: "Next-gen AutoGen fork with enhanced agent capabilities.",
    category: "AI Agents & Tools",
    features: ["Multi-agent", "Tool use", "Code execution"],
    install: "pip install ag2",
    useCase: "Advanced multi-agent systems"
  },
{
    name: "Phidata",
    url: "https://github.com/phidatahq/phidata",
    stars: "15k+",
    description: "Framework for building AI assistants with memory and knowledge.",
    category: "AI Agents & Tools",
    features: ["Memory", "Knowledge", "Structured outputs"],
    install: "pip install phidata",
    useCase: "Building AI assistants with long-term memory"
  },
{
    name: "Devin",
    url: "https://github.com/cognition-ai",
    stars: "N/A",
    description: "AI software engineer that can plan, code, and debug.",
    category: "AI Agents & Tools",
    features: ["Full-stack", "Planning", "Debugging"],
    install: "Cloud platform",
    useCase: "End-to-end software engineering"
  },
{
    name: "Gemini",
    url: "https://github.com/google/generative-ai-python",
    stars: "3k+",
    description: "Google's Gemini API for multimodal AI capabilities.",
    category: "Computer Vision & Multimodal",
    features: ["Multimodal", "Vision", "Long context"],
    install: "pip install google-generativeai",
    useCase: "Multimodal AI applications"
  },
{
    name: "GroundingDINO",
    url: "https://github.com/IDEA-Research/GroundingDINO",
    stars: "11k+",
    description: "Open-set object detection combining DINO with grounded pre-training.",
    category: "Computer Vision & Multimodal",
    features: ["Open-set detection", "Text prompts", "Zero-shot"],
    install: "pip install groundingdino-py",
    useCase: "Detecting objects with text descriptions"
  },
{
    name: "SAM 2",
    url: "https://github.com/facebookresearch/sam2",
    stars: "14k+",
    description: "Meta's Segment Anything Model for image and video segmentation.",
    category: "Computer Vision & Multimodal",
    features: ["Image segmentation", "Video tracking", "Promptable"],
    install: "pip install sam2",
    useCase: "Universal image and video segmentation"
  },
{
    name: "YOLOv9",
    url: "https://github.com/WongKinYiu/yolov9",
    stars: "9k+",
    description: "Real-time object detection with programmable gradient information.",
    category: "Computer Vision & Multimodal",
    features: ["Real-time detection", "PGI", "Efficient architecture"],
    install: "pip install ultralytics",
    useCase: "Real-time object detection"
  },
{
    name: "FastRAG",
    url: "https://github.com/IntelLabs/FastRAG",
    stars: "2k+",
    description: "Efficient RAG with Haystack and Intel optimizations.",
    category: "Vector Databases & RAG",
    features: ["Haystack-based", "Optimized", "Modular"],
    install: "pip install fastrag",
    useCase: "Optimized RAG pipelines"
  },
{
    name: "Verba",
    url: "https://github.com/weaviate/Verba",
    stars: "5k+",
    description: "Golden RAGtriever - open source RAG chatbot.",
    category: "Vector Databases & RAG",
    features: ["Weaviate backend", "Interactive UI", "Multi-format"],
    install: "pip install golden-verba",
    useCase: "Quick RAG chatbot setup"
  },
{
    name: "LibreChat",
    url: "https://github.com/danny-avila/LibreChat",
    stars: "25k+",
    description: "Enhanced ChatGPT clone with multi-user support.",
    category: "AI Web Applications",
    features: ["Multi-user", "Multi-LLM", "File upload"],
    install: "Docker compose",
    useCase: "Self-hosted ChatGPT alternative"
  },
{
    name: "Chatbox",
    url: "https://github.com/Bin-Huang/chatbox",
    stars: "22k+",
    description: "Desktop client for ChatGPT and other LLM APIs.",
    category: "AI Web Applications",
    features: ["Desktop app", "Multi-API", "Markdown"],
    install: "Download from chatboxai.app",
    useCase: "Desktop AI chat client"
  },
{
    name: "Msty",
    url: "https://github.com/nicepkg/msty",
    stars: "10k+",
    description: "Simple and powerful AI chat app with local models.",
    category: "AI Web Applications",
    features: ["Local models", "Split chat", "Offline"],
    install: "Download from msty.app",
    useCase: "Privacy-focused AI chat"
  },
{
    name: "KoboldCpp",
    url: "https://github.com/LostRuins/koboldcpp",
    stars: "3k+",
    description: "GGML/llama.cpp inference server with WebUI.",
    category: "AI Web Applications",
    features: ["WebUI", "API", "GPU acceleration"],
    install: "Binary or compile",
    useCase: "Local LLM serving with web interface"
  },
{
    name: "Nomic GPT4All",
    url: "https://github.com/nomic-ai/gpt4all",
    stars: "73k+",
    description: "Open source local AI chatbot with privacy focus.",
    category: "AI Mobile Applications",
    features: ["Local inference", "Privacy", "Cross-platform"],
    install: "Download from gpt4all.io",
    useCase: "Private AI chat on any device"
  },
{
    name: "LLama.cpp Android",
    url: "https://github.com/ggerganov/llama.cpp",
    stars: "72k+",
    description: "Port of LLaMA.cpp to Android for on-device inference.",
    category: "AI Mobile Applications",
    features: ["Android", "On-device", "GGUF support"],
    install: "Android project integration",
    useCase: "Running LLMs on Android"
  },
{
    name: "Enchanted",
    url: "https://github.com/nicepkg/enchanted",
    stars: "3k+",
    description: "Beautiful native macOS/iOS app for local LLMs.",
    category: "AI Mobile Applications",
    features: ["Native iOS/macOS", "Ollama backend", "Markdown"],
    install: "App Store",
    useCase: "Native AI chat on Apple devices"
  },
{
    name: "OpenCat",
    url: "https://github.com/nicepkg/opencat",
    stars: "3k+",
    description: "Native iOS chat client for OpenAI-compatible APIs.",
    category: "AI Mobile Applications",
    features: ["iOS native", "Multi-API", "Voice"],
    install: "App Store",
    useCase: "iOS AI chat client"
  },
{
    name: "Palette",
    url: "https://github.com/nicepkg/palette",
    stars: "2k+",
    description: "Beautiful AI assistant for macOS with local model support.",
    category: "AI Mobile Applications",
    features: ["macOS native", "Local models", "Keyboard shortcut"],
    install: "Download",
    useCase: "macOS AI assistant"
  },
{
    name: "Aichat",
    url: "https://github.com/sigoden/aichat",
    stars: "6k+",
    description: "All-in-one CLI AI tool with multi-platform support.",
    category: "AI Mobile Applications",
    features: ["CLI", "Multi-LLM", "Shell integration"],
    install: "cargo install aichat",
    useCase: "CLI-based AI assistant"
  },
{
    name: "Ollama Mobile",
    url: "https://github.com/ollama/ollama",
    stars: "110k+",
    description: "Mobile client for Ollama with chat interface.",
    category: "AI Mobile Applications",
    features: ["Mobile app", "Ollama backend", "Model management"],
    install: "App Store / Play Store",
    useCase: "Mobile AI chat with local models"
  },
{
    name: "Spring AI Ollama",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI integration with Ollama for local LLM inference.",
    category: "Spring AI & Enterprise",
    features: ["Spring Boot", "Ollama client", "Auto-configuration"],
    install: "Maven dependency",
    useCase: "Java apps with local LLM"
  },
{
    name: "Spring AI OpenAI",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI integration with OpenAI API.",
    category: "Spring AI & Enterprise",
    features: ["Chat completion", "Embeddings", "Image generation"],
    install: "Maven dependency",
    useCase: "Java apps with OpenAI"
  },
{
    name: "Spring AI Anthropic",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI integration with Claude models.",
    category: "Spring AI & Enterprise",
    features: ["Claude integration", "Streaming", "Tool use"],
    install: "Maven dependency",
    useCase: "Java apps with Claude"
  },
{
    name: "Spring AI Azure",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI integration with Azure OpenAI.",
    category: "Spring AI & Enterprise",
    features: ["Azure OpenAI", "Enterprise security", "Managed identity"],
    install: "Maven dependency",
    useCase: "Enterprise Java apps with Azure AI"
  },
{
    name: "Spring AI Pinecone",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI vector store integration with Pinecone.",
    category: "Spring AI & Enterprise",
    features: ["Vector store", "RAG", "Auto-configuration"],
    install: "Maven dependency",
    useCase: "Java RAG with Pinecone"
  },
{
    name: "Spring AI Weaviate",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI vector store integration with Weaviate.",
    category: "Spring AI & Enterprise",
    features: ["Vector store", "RAG", "Auto-configuration"],
    install: "Maven dependency",
    useCase: "Java RAG with Weaviate"
  },
{
    name: "Spring AI Qdrant",
    url: "https://github.com/spring-projects/spring-ai",
    stars: "4k+",
    description: "Spring AI vector store integration with Qdrant.",
    category: "Spring AI & Enterprise",
    features: ["Vector store", "RAG", "Auto-configuration"],
    install: "Maven dependency",
    useCase: "Java RAG with Qdrant"
  },
{
    name: "OpenTelemetry GenAI",
    url: "https://github.com/open-telemetry/opentelemetry-python",
    stars: "3k+",
    description: "OpenTelemetry instrumentation for generative AI workloads.",
    category: "Observability & Evaluations",
    features: ["GenAI spans", "Token tracking", "Tracing"],
    install: "pip install opentelemetry-api",
    useCase: "Tracing LLM calls with OpenTelemetry"
  },
{
    name: "TruLens",
    url: "https://github.com/truera/trulens",
    stars: "2k+",
    description: "Instrumentation and evaluation for LLM experiments.",
    category: "Observability & Evaluations",
    features: ["Feedback functions", "Tracing", "Dashboards"],
    install: "pip install trulens",
    useCase: "LLM app evaluation and monitoring"
  },
{
    name: "NeMo Guardrails",
    url: "https://github.com/NVIDIA/NeMo-Guardrails",
    stars: "4k+",
    description: "NVIDIA's toolkit for adding guardrails to LLM applications.",
    category: "Security & Guardrails",
    features: ["Programmable guardrails", "Topic control", "Alignment"],
    install: "pip install nemoguardrails",
    useCase: "Controlling LLM behavior"
  },
{
    name: "OpenDevin",
    url: "https://github.com/All-Hands-AI/OpenHands",
    stars: "45k+",
    description: "Open source AI software engineer agent.",
    category: "AI Coding & Software Engineering",
    features: ["Code generation", "Web browsing", "Shell access"],
    install: "Docker or pip",
    useCase: "Automating software engineering tasks"
  },
{
    name: "Windsurf",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered code editor by Codeium with Cascade AI.",
    category: "AI Coding & Software Engineering",
    features: ["Cascade AI", "Multi-file editing", "Autocomplete"],
    install: "Download",
    useCase: "AI-powered development environment"
  },
{
    name: "Mem0",
    url: "https://github.com/mem0ai/mem0",
    stars: "25k+",
    description: "Memory layer for AI applications with long-term memory.",
    category: "AI Agents & Tools",
    features: ["Long-term memory", "User preferences", "Fast retrieval"],
    install: "pip install mem0ai",
    useCase: "Adding persistent memory to AI apps"
  },
{
    name: "Zep",
    url: "https://github.com/getzep/zep",
    stars: "3k+",
    description: "Memory server for AI assistants with long-term memory.",
    category: "AI Agents & Tools",
    features: ["Temporal memory", "Knowledge graph", "RAG"],
    install: "pip install zep",
    useCase: "Memory management for AI assistants"
  },
{
    name: "Letta",
    url: "https://github.com/letta-ai/letta",
    stars: "15k+",
    description: "Stateful AI agents with self-editing memory.",
    category: "AI Agents & Tools",
    features: ["Self-editing memory", "Stateful", "REST API"],
    install: "pip install letta",
    useCase: "Building stateful AI agents"
  },
{
    name: "Swarm",
    url: "https://github.com/openai/swarm",
    stars: "18k+",
    description: "Lightweight multi-agent orchestration from OpenAI.",
    category: "AI Agents & Tools",
    features: ["Agent handoffs", "Stateless", "Simple"],
    install: "pip install openai-swarm",
    useCase: "Simple multi-agent systems"
  },
{
    name: "Firecrawl",
    url: "https://github.com/mendableai/firecrawl",
    stars: "25k+",
    description: "Turn websites into LLM-ready markdown data.",
    category: "AI Agents & Tools",
    features: ["Web scraping", "Markdown conversion", "Crawling"],
    install: "pip install firecrawl",
    useCase: "Extracting web content for LLMs"
  },
{
    name: "Crawl4AI",
    url: "https://github.com/unclecode/crawl4ai",
    stars: "30k+",
    description: "Open source LLM-friendly web crawler.",
    category: "AI Agents & Tools",
    features: ["LLM-optimized", "Batch crawling", "JavaScript rendering"],
    install: "pip install crawl4ai",
    useCase: "Crawling websites for LLM training data"
  },
{
    name: "Julep",
    url: "https://github.com/julep-ai/julep",
    stars: "3k+",
    description: "Open source platform for building stateful AI agents.",
    category: "AI Agents & Tools",
    features: ["State management", "Tools", "Scheduling"],
    install: "pip install julep",
    useCase: "Building stateful AI agent platforms"
  },
{
    name: "Agency Swarm",
    url: "https://github.com/VRSEN/agency-swarm",
    stars: "3k+",
    description: "Framework for creating collaborative AI agent swarms.",
    category: "AI Agents & Tools",
    features: ["Swarm collaboration", "Custom tools", "Agent roles"],
    install: "pip install agency-swarm",
    useCase: "Building collaborative agent teams"
  },
{
    name: "Pinecone",
    url: "https://github.com/pinecone-io",
    stars: "N/A",
    description: "Managed vector database for AI applications.",
    category: "Vector Databases & RAG",
    features: ["Managed", "Low latency", "Hybrid search"],
    install: "pip install pinecone-client",
    useCase: "Managed vector search in cloud"
  },
{
    name: "ChromaJS",
    url: "https://github.com/chroma-core/chroma",
    stars: "16k+",
    description: "JavaScript client for Chroma vector database.",
    category: "Vector Databases & RAG",
    features: ["JavaScript client", "Embedding storage", "Query"],
    install: "npm install chromadb",
    useCase: "Vector search in JavaScript apps"
  },
{
    name: "OpenLTR",
    url: "https://github.com/meta-toolkit/OpenLTR",
    stars: "500+",
    description: "Open source learning to rank toolkit.",
    category: "AI Design Patterns & Architecture",
    features: ["LTR models", "Feature engineering", "Evaluation"],
    install: "pip install OpenLTR",
    useCase: "Building learning to rank systems"
  },
{
    name: "MCP Server",
    url: "https://github.com/modelcontextprotocol/servers",
    stars: "5k+",
    description: "Reference MCP server implementations for tool integration.",
    category: "AI Design Patterns & Architecture",
    features: ["Tool servers", "Resource servers", "Protocol spec"],
    install: "Various",
    useCase: "Implementing MCP tool servers"
  },
{
    name: "Anthropic Cookbook",
    url: "https://github.com/anthropics/anthropic-cookbook",
    stars: "20k+",
    description: "Official examples and patterns for using Claude effectively.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Prompt patterns", "Chain of thought", "Tool use examples"],
    install: "Clone repo",
    useCase: "Learning effective Claude usage patterns"
  },
{
    name: "Prompt Hub",
    url: "https://github.com/anthropics/prompt-library",
    stars: "3k+",
    description: "Collection of prompts and templates for LLM applications.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Prompt templates", "Best practices", "Examples"],
    install: "Clone repo",
    useCase: "Finding and using effective prompts"
  },
{
    name: "OpenPrompt",
    url: "https://github.com/thunlp/OpenPrompt",
    stars: "3k+",
    description: "Open source prompt learning framework.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Prompt tuning", "P-tuning", "Auto prompting"],
    install: "pip install openprompt",
    useCase: "Prompt-based learning"
  },
{
    name: "LMQL",
    url: "https://github.com/eth-sri/lmql",
    stars: "3k+",
    description: "Language for programming with LLMs using constraints.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Constrained decoding", "Queries", "Integration"],
    install: "pip install lmql",
    useCase: "Programming LLMs with structured outputs"
  },
{
    name: "GPTQ",
    url: "https://github.com/IST-DASLab/gptq",
    stars: "2k+",
    description: "Post-training quantization for GPT-like models.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["4-bit quantization", "GPU optimized", "Layer-by-layer"],
    install: "pip install auto-gptq",
    useCase: "Quantizing LLMs for faster inference"
  },
{
    name: "AWQ",
    url: "https://github.com/mit-han-lab/llm-awq",
    stars: "3k+",
    description: "Activation-aware weight quantization for LLMs.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["4-bit quantization", "Preserved quality", "Fast inference"],
    install: "pip install autoawq",
    useCase: "High-quality model quantization"
  },
{
    name: "AI Gateway",
    url: "https://github.com/portkey-ai/gateway",
    stars: "5k+",
    description: "Production AI gateway with load balancing and fallbacks.",
    category: "AI Design Patterns & Architecture",
    features: ["Load balancing", "Fallbacks", "Caching"],
    install: "npm install",
    useCase: "Managing multiple LLM providers"
  },
{
    name: "LLM Router",
    url: "https://github.com/portkey-ai/gateway",
    stars: "N/A",
    description: "Intelligent routing for LLM requests based on cost and quality.",
    category: "AI Design Patterns & Architecture",
    features: ["Cost optimization", "Quality routing", "Fallbacks"],
    install: "Various",
    useCase: "Optimizing LLM costs and quality"
  },
{
    name: "ChatGPT Desktop",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Official ChatGPT desktop application with voice and vision.",
    category: "AI Apps & Demos",
    features: ["Desktop app", "Voice mode", "Vision"],
    install: "Download from OpenAI",
    useCase: "Desktop AI assistant"
  },
{
    name: "Claude Desktop",
    url: "https://www.anthropic.com/",
    stars: "N/A",
    description: "Anthropic's Claude desktop application with extended thinking.",
    category: "AI Apps & Demos",
    features: ["Desktop app", "Extended thinking", "Artifacts"],
    install: "Download from anthropic.com",
    useCase: "Desktop AI with deep reasoning"
  },
{
    name: "Gemini App",
    url: "https://gemini.google.com/",
    stars: "N/A",
    description: "Google's Gemini AI app with multimodal capabilities.",
    category: "AI Apps & Demos",
    features: ["Multimodal", "Long context", "Integration"],
    install: "Web and mobile",
    useCase: "Multimodal AI assistant"
  },
{
    name: "Perplexity",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered answer engine with real-time web search.",
    category: "AI Apps & Demos",
    features: ["Web search", "Citations", "Pro search"],
    install: "Web and mobile",
    useCase: "AI-powered research and answers"
  },
{
    name: "Pi",
    url: "https://github.com/Inflection-AI",
    stars: "N/A",
    description: "Personal AI assistant by Inflection AI.",
    category: "AI Apps & Demos",
    features: ["Personal", "Empathetic", "Long-term memory"],
    install: "Web and mobile",
    useCase: "Personal AI companion"
  },
{
    name: "Kimi",
    url: "https://github.com/MoonshotAI",
    stars: "N/A",
    description: "Moonshot AI's long-context AI assistant.",
    category: "AI Apps & Demos",
    features: ["200K context", "Web browsing", "Document analysis"],
    install: "Web and mobile",
    useCase: "Long document analysis"
  },
{
    name: "Character.ai",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Platform for creating and chatting with AI characters.",
    category: "AI Apps & Demos",
    features: ["Custom characters", "Roleplay", "Community"],
    install: "Web and mobile",
    useCase: "Creating and chatting with AI personas"
  },
{
    name: "Poe",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Multi-model AI chat platform by Quora.",
    category: "AI Apps & Demos",
    features: ["Multi-model", "Bot creation", "API access"],
    install: "Web and mobile",
    useCase: "Accessing multiple AI models"
  },
{
    name: "DuckDuckGo AI Chat",
    url: "https://github.com/duckduckgo",
    stars: "N/A",
    description: "Private AI chat powered by multiple models.",
    category: "AI Apps & Demos",
    features: ["Privacy", "Multi-model", "Free"],
    install: "Web",
    useCase: "Private AI chat"
  },
{
    name: "You.com",
    url: "https://github.com/you-apps/You.com",
    stars: "N/A",
    description: "AI search engine with chat and coding capabilities.",
    category: "AI Apps & Demos",
    features: ["Search", "Chat", "Code generation"],
    install: "Web",
    useCase: "AI-powered search and productivity"
  },
{
    name: "Phind",
    url: "https://github.com/phind/phind",
    stars: "N/A",
    description: "AI-powered search engine for developers.",
    category: "AI Apps & Demos",
    features: ["Developer-focused", "Code search", "Pair programming"],
    install: "Web",
    useCase: "Developer-oriented AI search"
  },
{
    name: "Leonardo AI",
    url: "https://github.com/leonardoai",
    stars: "N/A",
    description: "AI image generation platform for creatives.",
    category: "AI Apps & Demos",
    features: ["Image generation", "Style control", "Canvas"],
    install: "Web",
    useCase: "AI image creation"
  },
{
    name: "Midjourney",
    url: "https://github.com/midjourney",
    stars: "N/A",
    description: "AI image generation from text prompts.",
    category: "AI Apps & Demos",
    features: ["Text-to-image", "Style control", "Upscaling"],
    install: "Discord bot",
    useCase: "Creating AI art from text"
  },
{
    name: "DALL-E",
    url: "https://github.com/openai/DALL-E",
    stars: "N/A",
    description: "OpenAI's text-to-image generation model.",
    category: "AI Apps & Demos",
    features: ["Text-to-image", "Inpainting", "Editing"],
    install: "API",
    useCase: "Generating images from text"
  },
{
    name: "Stable Diffusion",
    url: "https://github.com/Stability-AI/stablediffusion",
    stars: "68k+",
    description: "Open source text-to-image generation model.",
    category: "AI Apps & Demos",
    features: ["Open source", "Text-to-image", "Inpainting"],
    install: "pip install diffusers",
    useCase: "Running image generation locally"
  },
{
    name: "Suno",
    url: "https://github.com/suno-ai",
    stars: "N/A",
    description: "AI music generation platform.",
    category: "AI Apps & Demos",
    features: ["Music generation", "Lyrics", "Style control"],
    install: "Web",
    useCase: "Creating music with AI"
  },
{
    name: "Udio",
    url: "https://github.com/udio-ai",
    stars: "N/A",
    description: "AI music generation platform with high-quality output.",
    category: "AI Apps & Demos",
    features: ["Music generation", "High quality", "Style mixing"],
    install: "Web",
    useCase: "Creating high-quality AI music"
  },
{
    name: "NotebookLM",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Google's AI-powered notebook for research and note-taking.",
    category: "AI Apps & Demos",
    features: ["Note-taking", "Source grounding", "Audio overview"],
    install: "Web",
    useCase: "AI-assisted research and note-taking"
  },
{
    name: "Gamma",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered presentation and document creation.",
    category: "AI Apps & Demos",
    features: ["Presentations", "Documents", "AI writing"],
    install: "Web",
    useCase: "Creating presentations with AI"
  },
{
    name: "Tome",
    url: "https://github.com/tomeapp",
    stars: "N/A",
    description: "AI-powered storytelling and presentation tool.",
    category: "AI Apps & Demos",
    features: ["Storytelling", "AI images", "Narrative"],
    install: "Web",
    useCase: "Creating narrative presentations"
  },
{
    name: "Notion AI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI assistant integrated into Notion workspace.",
    category: "AI Apps & Demos",
    features: ["Writing", "Summarization", "Translation"],
    install: "Web / Notion plugin",
    useCase: "AI-powered productivity in Notion"
  },
{
    name: "FlowiseAI",
    url: "https://github.com/FlowiseAI/Flowise",
    stars: "35k+",
    description: "Drag & drop UI to build customized LLM flows.",
    category: "AI Apps & Demos",
    features: ["Drag & drop", "Flows", "Agents"],
    install: "npm install",
    useCase: "Visual LLM workflow builder"
  },
{
    name: "Streamlit Chat",
    url: "https://github.com/streamlit/streamlit",
    stars: "N/A",
    description: "Chat interface components for Streamlit.",
    category: "AI Apps & Demos",
    features: ["Chat UI", "Streamlit", "Easy setup"],
    install: "pip install streamlit-chat",
    useCase: "Quick chat app prototyping"
  },
{
    name: "Yay",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI writing assistant with real-time collaboration.",
    category: "AI Apps & Demos",
    features: ["Writing", "Collaboration", "AI suggestions"],
    install: "Web",
    useCase: "AI-powered collaborative writing"
  },
{
    name: "Type.ai",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered writing in Google Docs.",
    category: "AI Apps & Demos",
    features: ["Google Docs", "Writing", "Suggestions"],
    install: "Chrome extension",
    useCase: "AI writing in Google Docs"
  },
{
    name: "Mintlify",
    url: "https://github.com/mintlify/mint",
    stars: "N/A",
    description: "AI-powered documentation platform.",
    category: "AI Apps & Demos",
    features: ["Auto-docs", "AI search", "Analytics"],
    install: "npm install",
    useCase: "Creating and maintaining documentation"
  },
{
    name: "JetBrains AI",
    url: "https://github.com/JetBrains",
    stars: "N/A",
    description: "AI assistant integrated into JetBrains IDEs.",
    category: "AI Coding & Software Engineering",
    features: ["JetBrains", "Code generation", "Chat"],
    install: "JetBrains plugin",
    useCase: "AI in JetBrains IDEs"
  },
{
    name: "Pieces",
    url: "https://github.com/pieces-app",
    stars: "1k+",
    description: "AI-powered developer productivity tool.",
    category: "AI Coding & Software Engineering",
    features: ["Code snippets", "Context", "Memory"],
    install: "Desktop app",
    useCase: "Managing and reusing code with AI"
  },
{
    name: "GitHub Copilot CLI",
    url: "https://github.com/features/copilot",
    stars: "N/A",
    description: "AI pair programmer in the command line.",
    category: "AI Coding & Software Engineering",
    features: ["CLI", "Shell commands", "Natural language"],
    install: "GitHub Copilot subscription",
    useCase: "AI-powered shell commands"
  },
{
    name: "DevPod",
    url: "https://github.com/loft-sh/devpod",
    stars: "10k+",
    description: "AI-powered development environments in the cloud.",
    category: "AI Coding & Software Engineering",
    features: ["Cloud IDE", "Dev containers", "AI assistance"],
    install: "CLI or desktop",
    useCase: "Cloud development with AI"
  },
{
    name: "Replit AI",
    url: "https://github.com/replit/replit-agent",
    stars: "N/A",
    description: "AI code generation and debugging in Replit.",
    category: "AI Coding & Software Engineering",
    features: ["Code generation", "Debugging", "Deployment"],
    install: "Web IDE",
    useCase: "AI coding in browser"
  },
{
    name: "Gitscribe",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered git commit message generator.",
    category: "AI Coding & Software Engineering",
    features: ["Auto commits", "Conventional commits", "CLI"],
    install: "npm install",
    useCase: "Generating commit messages"
  },
{
    name: "OpenAI Whisper Large V3",
    url: "https://github.com/openai/whisper",
    stars: "72k+",
    description: "Latest Whisper model with improved accuracy.",
    category: "Speech & Audio AI",
    features: ["Highest accuracy", "Multilingual", "Timestamps"],
    install: "pip install openai-whisper",
    useCase: "Highest quality transcription"
  },
{
    name: "Deepgram",
    url: "https://github.com/deepgram",
    stars: "N/A",
    description: "Speech-to-text API with real-time transcription.",
    category: "Speech & Audio AI",
    features: ["Real-time", "Multi-language", "Punctuation"],
    install: "pip install deepgram",
    useCase: "Real-time speech transcription"
  },
{
    name: "AssemblyAI",
    url: "https://github.com/AssemblyAI",
    stars: "N/A",
    description: "Speech-to-text API with advanced features.",
    category: "Speech & Audio AI",
    features: ["Punctuation", "Sentiment", "Speaker labels"],
    install: "pip install assemblyai",
    useCase: "Enterprise speech transcription"
  },
{
    name: "Google STT",
    url: "https://github.com/googleapis/python-speech",
    stars: "N/A",
    description: "Google Cloud speech-to-text with streaming support.",
    category: "Speech & Audio AI",
    features: ["Streaming", "Multi-language", "Video analysis"],
    install: "pip install google-cloud-speech",
    useCase: "Cloud speech transcription"
  },
{
    name: "AWS Transcribe",
    url: "https://github.com/aws/amazon-transcribe",
    stars: "N/A",
    description: "AWS automatic speech recognition service.",
    category: "Speech & Audio AI",
    features: ["Streaming", "Multi-language", "Medical transcribe"],
    install: "AWS SDK",
    useCase: "Enterprise speech transcription on AWS"
  },
{
    name: "Azure Speech",
    url: "https://github.com/Azure-Samples/cognitive-services-speech-sdk",
    stars: "N/A",
    description: "Microsoft Azure speech services.",
    category: "Speech & Audio AI",
    features: ["Real-time", "Multi-language", "Custom models"],
    install: "Azure SDK",
    useCase: "Enterprise speech on Azure"
  },
{
    name: "ElevenLabs",
    url: "https://github.com/elevenlabs",
    stars: "N/A",
    description: "AI voice generation and cloning platform.",
    category: "Speech & Audio AI",
    features: ["Voice cloning", "Multilingual", "Real-time"],
    install: "pip install elevenlabs",
    useCase: "AI voice generation and cloning"
  },
{
    name: "Meta AudioPaLM",
    url: "https://github.com/facebookresearch",
    stars: "N/A",
    description: "Meta's large language model for audio understanding and generation.",
    category: "Speech & Audio AI",
    features: ["Audio understanding", "Speech generation", "Multilingual"],
    install: "Research access",
    useCase: "Audio understanding with LLMs"
  },
{
    name: "Whisper.cpp",
    url: "https://github.com/ggerganov/whisper.cpp",
    stars: "37k+",
    description: "Port of OpenAI Whisper in C/C++.",
    category: "Speech & Audio AI",
    features: ["C/C++", "Fast", "Cross-platform"],
    install: "Compile or binary",
    useCase: "Fast local speech transcription"
  },
{
    name: "Qwen-VL",
    url: "https://github.com/QwenLM/Qwen-VL",
    stars: "12k+",
    description: "Alibaba's multimodal large language model.",
    category: "Computer Vision & Multimodal",
    features: ["Multilingual", "OCR", "Visual reasoning"],
    install: "pip install qwen-vl",
    useCase: "Multimodal understanding"
  },
{
    name: "GOT-OCR",
    url: "https://github.com/Ucas-HaoranWei/GOT-OCR2.0",
    stars: "4k+",
    description: "General OCR Theory for document understanding.",
    category: "Computer Vision & Multimodal",
    features: ["OCR", "Document understanding", "Chart parsing"],
    install: "pip install got-ocr",
    useCase: "Document and text recognition"
  },
{
    name: "DocOwl",
    url: "https://github.com/mPLLM/DocOwl",
    stars: "3k+",
    description: "Document visual question answering with large models.",
    category: "Computer Vision & Multimodal",
    features: ["Document VQA", "Multi-page", "Layout understanding"],
    install: "pip install docowl",
    useCase: "Document understanding"
  },
{
    name: "Monkey",
    url: "https://github.com/Yuliang-Liu/Monkey",
    stars: "3k+",
    description: "Image resolution matters for large vision-language models.",
    category: "Computer Vision & Multimodal",
    features: ["High resolution", "Multi-granularity", "Efficient"],
    install: "pip install monkey",
    useCase: "High-resolution image understanding"
  },
{
    name: "Yi-VL",
    url: "https://github.com/01-ai/Yi-VL",
    stars: "5k+",
    description: "01.AI's open source multimodal model.",
    category: "Computer Vision & Multimodal",
    features: ["Multimodal", "Bilingual", "Visual reasoning"],
    install: "pip install yi-vl",
    useCase: "Bilingual multimodal understanding"
  },
{
    name: "DeepSeek-VL",
    url: "https://github.com/deepseek-ai/DeepSeek-VL",
    stars: "4k+",
    description: "DeepSeek's multimodal vision-language model.",
    category: "Computer Vision & Multimodal",
    features: ["Vision-language", "Real-world", "Multilingual"],
    install: "pip install deepseek-vl",
    useCase: "Real-world visual understanding"
  },
{
    name: "Moondream",
    url: "https://github.com/vikhyat/moondream",
    stars: "5k+",
    description: "Small vision-language model for edge devices.",
    category: "Computer Vision & Multimodal",
    features: ["Small model", "Edge deployment", "Fast"],
    install: "pip install moondream",
    useCase: "Running vision models on edge devices"
  },
{
    name: "InternEvo",
    url: "https://github.com/InternLM/InternEvo",
    stars: "2k+",
    description: "InternLM's training framework for large models.",
    category: "Data & Training",
    features: ["Training framework", "Distributed", "Mixed precision"],
    install: "pip install intern-evo",
    useCase: "Training large language models"
  },
{
    name: "Megatron-LM",
    url: "https://github.com/NVIDIA/Megatron-LM",
    stars: "10k+",
    description: "NVIDIA's large-batch optimizer and transformer training.",
    category: "Data & Training",
    features: ["Tensor parallelism", "Pipeline parallelism", "Large-batch"],
    install: "pip install megatron-lm",
    useCase: "Training very large transformers"
  },
{
    name: "GPT-NeoX",
    url: "https://github.com/EleutherAI/gpt-neox",
    stars: "30k+",
    description: "EleutherAI's large-scale autoregressive language model.",
    category: "Data & Training",
    features: ["Open source", "Large-scale", "Training code"],
    install: "pip install gpt-neox",
    useCase: "Training and running large GPT models"
  },
{
    name: "Cerebras SDK",
    url: "https://github.com/Cerebras/cerebras-sdk",
    stars: "1k+",
    description: "SDK for Cerebras wafer-scale cluster.",
    category: "Data & Training",
    features: ["Wafer-scale", "Distributed", "High performance"],
    install: "pip install cerebras-sdk",
    useCase: "Training on Cerebras hardware"
  },
{
    name: "Lightning",
    url: "https://github.com/Lightning-AI/pytorch-lightning",
    stars: "28k+",
    description: "The deep learning framework to pretrain, finetune and deploy AI models.",
    category: "Data & Training",
    features: ["PyTorch", "Scalable", "Production-ready"],
    install: "pip install lightning",
    useCase: "Production deep learning"
  },
{
    name: "FastAI",
    url: "https://github.com/fastai/fastai",
    stars: "27k+",
    description: "High-level training loop for PyTorch.",
    category: "Data & Training",
    features: ["High-level API", "Training loops", "Best practices"],
    install: "pip install fastai",
    useCase: "Simplified deep learning training"
  },
{
    name: "Keras",
    url: "https://github.com/keras-team/keras",
    stars: "63k+",
    description: "Deep Learning API running on TensorFlow, JAX, or PyTorch.",
    category: "Data & Training",
    features: ["Multi-backend", "High-level", "Production"],
    install: "pip install keras",
    useCase: "Framework-agnostic deep learning"
  },
{
    name: "Flax",
    url: "https://github.com/google/flax",
    stars: "6k+",
    description: "Neural network library for JAX.",
    category: "Data & Training",
    features: ["JAX", "Functional", "Flexible"],
    install: "pip install flax",
    useCase: "Building neural networks with JAX"
  },
{
    name: "Triton",
    url: "https://github.com/triton-lang/triton",
    stars: "13k+",
    description: "Language and compiler for custom GPU kernels.",
    category: "Data & Training",
    features: ["GPU kernels", "Custom operations", "Auto-differentiation"],
    install: "pip install triton",
    writeCase: "Writing custom GPU operations"
  },
{
    name: "DeepSpeed-MII",
    url: "https://github.com/microsoft/DeepSpeed-MII",
    stars: "2k+",
    description: "Model inference and serving with DeepSpeed.",
    category: "Data & Training",
    features: ["Inference optimization", "Serving", "Compression"],
    install: "pip install deepspeed-mii",
    useCase: "Optimized model inference"
  },
{
    name: "PyTorch FSDP",
    url: "https://github.com/pytorch/pytorch",
    stars: "86k+",
    description: "Fully Sharded Data Parallel training in PyTorch.",
    category: "Data & Training",
    features: ["FSDP", "Distributed", "Memory-efficient"],
    install: "pip install torch",
    useCase: "Distributed training with FSDP"
  },
{
    name: "ColossalAI",
    url: "https://github.com/hpcaitech/ColossalAI",
    stars: "40k+",
    description: "Making large AI models cheaper, faster, and more accessible.",
    category: "Data & Training",
    features: ["ZeRO", "Tensor parallelism", "Easy to use"],
    install: "pip install colossalai",
    useCase: "Efficient large model training"
  },
{
    name: "LSPosed",
    url: "https://github.com/LSPosed/LSPosed",
    stars: "15k+",
    description: "Xposed framework for Android.",
    category: "AI Mobile Applications",
    features: ["Xposed", "Modules", "System-level"],
    install: "Root required",
    useCase: "Android system customization"
  },
{
    name: "Termux",
    url: "https://github.com/termux/termux-app",
    stars: "35k+",
    description: "Android terminal emulator with Linux packages.",
    category: "AI Mobile Applications",
    features: ["Terminal", "Linux packages", "CLI tools"],
    install: "F-Droid or GitHub",
    useCase: "Running AI tools on Android"
  },
{
    name: "OnDevice AI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Apple's on-device AI framework for iOS/macOS.",
    category: "AI Mobile Applications",
    features: ["On-device", "Core ML", "Privacy"],
    install: "Xcode framework",
    useCase: "Running AI on Apple devices"
  },
{
    name: "Android ML Kit",
    url: "https://github.com/googlesamples/mlkit",
    stars: "3k+",
    description: "Google's ML Kit for Android apps.",
    category: "AI Mobile Applications",
    features: ["On-device", "Vision", "NLP"],
    install: "Gradle dependency",
    useCase: "Adding ML features to Android apps"
  },
{
    name: "MLC LLM Android",
    url: "https://github.com/mlc-ai/mlc-llm",
    stars: "20k+",
    description: "LLM deployment on Android devices.",
    category: "AI Mobile Applications",
    features: ["Android", "On-device", "GPU acceleration"],
    install: "APK or SDK",
    useCase: "Running LLMs on Android"
  },
{
    name: "Samsung AI Center",
    url: "https://github.com/Samsung",
    stars: "N/A",
    description: "Samsung's AI research and mobile AI features.",
    category: "AI Mobile Applications",
    features: ["Galaxy AI", "On-device", "Multimodal"],
    install: "Galaxy devices",
    useCase: "Samsung mobile AI features"
  },
{
    name: "Apple Intelligence",
    url: "https://developer.apple.com/machine-learning/",
    stars: "N/A",
    description: "Apple's on-device AI system for iOS 18+.",
    category: "AI Mobile Applications",
    features: ["On-device", "Private Cloud Compute", "System integration"],
    install: "iOS 18+",
    useCase: "System-wide AI on Apple devices"
  },
{
    name: "Gemini Nano",
    url: "https://ai.google.dev/",
    stars: "N/A",
    description: "Google's on-device AI model for Android.",
    category: "AI Mobile Applications",
    features: ["On-device", "Android", "Multimodal"],
    install: "Android AI Core",
    useCase: "On-device AI for Android"
  },
{
    name: "Spring AI Chatbots",
    url: "https://github.com/spring-projects/spring-ai-examples",
    stars: "500+",
    description: "Example chatbot applications built with Spring AI.",
    category: "Spring AI & Enterprise",
    features: ["Chat examples", "RAG examples", "Tool use"],
    install: "Clone and run",
    useCase: "Learning Spring AI patterns"
  },
{
    name: "Spring AI RAG Example",
    url: "https://github.com/spring-projects/spring-ai-examples",
    stars: "500+",
    description: "RAG application example with Spring AI.",
    category: "Spring AI & Enterprise",
    features: ["RAG", "Vector store", "Document loading"],
    install: "Clone and run",
    useCase: "Building RAG with Spring"
  },
{
    name: "Spring AI Agents",
    url: "https://github.com/spring-projects/spring-ai-examples",
    stars: "500+",
    description: "Agent application example with Spring AI.",
    category: "Spring AI & Enterprise",
    features: ["Agent", "Tool use", "Planning"],
    install: "Clone and run",
    useCase: "Building agents with Spring"
  },
{
    name: "Spring AI multimodal",
    url: "https://github.com/spring-projects/spring-ai-examples",
    stars: "500+",
    description: "Multimodal application example with Spring AI.",
    category: "Spring AI & Enterprise",
    features: ["Vision", "Audio", "Image generation"],
    install: "Clone and run",
    useCase: "Multimodal AI with Spring"
  },
{
    name: "Micronaut AI",
    url: "https://github.com/micronaut-projects/micronaut-ai",
    stars: "500+",
    description: "Micronaut framework integration for AI/ML.",
    category: "Spring AI & Enterprise",
    features: ["Micronaut", "AI integration", "GraalVM"],
    install: "Maven dependency",
    useCase: "AI apps with Micronaut"
  },
{
    name: "Quarkus LangChain4j RAG",
    url: "https://github.com/quarkiverse/quarkus-langchain4j",
    stars: "1k+",
    description: "RAG example with Quarkus and LangChain4j.",
    category: "Spring AI & Enterprise",
    features: ["Quarkus", "RAG", "Native compilation"],
    install: "Maven dependency",
    useCase: "Cloud-native RAG with Quarkus"
  },
{
    name: "Spring Boot AI Starter",
    url: "https://github.com/spring-projects/spring-boot",
    stars: "76k+",
    description: "Spring Boot with AI auto-configuration.",
    category: "Spring AI & Enterprise",
    features: ["Auto-configuration", "Convention over configuration", "Production-ready"],
    install: "Maven dependency",
    useCase: "Rapid Spring AI app development"
  },
{
    name: "Axon Framework AI",
    url: "https://github.com/AxonFramework/axon-server",
    stars: "1k+",
    description: "Event-driven architecture with AI capabilities.",
    category: "Spring AI & Enterprise",
    features: ["Event sourcing", "CQRS", "AI integration"],
    install: "Docker or Maven",
    useCase: "Event-sourced AI applications"
  },
{
    name: "Arize Phoenix",
    url: "https://github.com/Arize-AI/phoenix",
    stars: "8k+",
    description: "Open source LLM observability and evaluation.",
    category: "Observability & Evaluations",
    features: ["Tracing", "Evaluation", "Datasets"],
    install: "pip install arize-phoenix",
    useCase: "LLM observability"
  },
{
    name: "Galileo",
    url: "https://github.com/galileo-ai/galileo",
    stars: "N/A",
    description: "LLM observability and quality platform.",
    category: "Observability & Evaluations",
    features: ["Quality metrics", "Hallucination detection", "Cost tracking"],
    install: "Web platform",
    useCase: "LLM quality monitoring"
  },
{
    name: "Weights & Biases Weave",
    url: "https://github.com/wandb/weave",
    stars: "2k+",
    description: "W&B toolkit for building and evaluating LLM applications.",
    category: "Observability & Evaluations",
    features: ["LLM tracing", "Evaluation", "Datasets"],
    install: "pip install weave",
    useCase: "LLM app development and evaluation"
  },
{
    name: "GPT Researcher",
    url: "https://github.com/assafelovic/gpt-researcher",
    stars: "17k+",
    description: "Autonomous agent for comprehensive online research.",
    category: "AI Agents & Tools",
    features: ["Research", "Web browsing", "Report generation"],
    install: "pip install gpt-researcher",
    useCase: "Automated research reports"
  },
{
    name: "AI Commit",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered git commit message generator.",
    category: "AI Coding & Software Engineering",
    features: ["Auto commits", "Conventional commits", "CLI"],
    install: "npm install",
    useCase: "Generating commit messages"
  },
{
    name: "CodeReviewAI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered code review tool.",
    category: "AI Coding & Software Engineering",
    features: ["Code review", "Suggestions", "PR integration"],
    install: "GitHub App",
    useCase: "Automated code reviews"
  },
{
    name: "Koder",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI code completion for JetBrains IDEs.",
    category: "AI Coding & Software Engineering",
    features: ["JetBrains", "Fast completions", "Context-aware"],
    install: "JetBrains plugin",
    useCase: "AI code completion in JetBrains"
  },
{
    name: "Augment Code",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI coding assistant with codebase context.",
    category: "AI Coding & Software Engineering",
    features: ["Codebase context", "Multi-IDE", "Agent mode"],
    install: "IDE extension",
    useCase: "Context-aware AI coding"
  },
{
    name: "Fireworks AI",
    url: "https://github.com/fireworks-ai",
    stars: "N/A",
    description: "Fast inference platform for open source models.",
    category: "Model Serving & Inference",
    features: ["Fast inference", "Open models", "API"],
    install: "pip install fireworks-ai",
    useCase: "High-performance model serving"
  },
{
    name: "Groq",
    url: "https://github.com/groq",
    stars: "N/A",
    description: "Ultra-fast LLM inference with LPU hardware.",
    category: "Model Serving & Inference",
    features: ["LPU", "Ultra-fast", "Low latency"],
    install: "API",
    useCase: "Fastest LLM inference"
  },
{
    name: "Together AI",
    url: "https://github.com/togethercomputer",
    stars: "N/A",
    description: "Cloud platform for running and fine-tuning open models.",
    category: "Model Serving & Inference",
    features: ["Open models", "Fine-tuning", "Inference"],
    install: "pip install together",
    useCase: "Open model cloud platform"
  },
{
    name: "Replicate",
    url: "https://github.com/replicate",
    stars: "N/A",
    description: "Run open source models in the cloud.",
    category: "Model Serving & Inference",
    features: ["Open models", "Pay-per-use", "Easy deploy"],
    install: "pip install replicate",
    useCase: "Running open source models"
  },
{
    name: "RunPod",
    url: "https://github.com/runpod",
    stars: "N/A",
    description: "GPU cloud for AI workloads.",
    category: "Model Serving & Inference",
    features: ["GPU cloud", "Serverless", "Spot instances"],
    install: "Web platform",
    useCase: "GPU cloud for AI"
  },
{
    name: "Banana",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Serverless GPU platform for AI inference.",
    category: "Model Serving & Inference",
    features: ["Serverless", "GPU", "Fast deploy"],
    install: "pip install banana-dev",
    useCase: "Serverless AI inference"
  },
{
    name: "Cerebrium",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Serverless AI inference platform.",
    category: "Model Serving & Inference",
    features: ["Serverless", "Auto-scaling", "Pay-per-use"],
    install: "pip install cerebrium",
    useCase: "Serverless model inference"
  },
{
    name: "BentoML Cloud",
    url: "https://github.com/bentoml",
    stars: "N/A",
    description: "Managed platform for deploying ML models.",
    category: "Model Serving & Inference",
    features: ["Managed", "Auto-scaling", "Monitoring"],
    install: "pip install bentoml",
    useCase: "Managed ML model deployment"
  },
{
    name: "MLOps Community",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Community-driven MLOps resources and tools.",
    category: "MLOps & Infra",
    features: ["Community", "Resources", "Best practices"],
    install: "Web",
    useCase: "MLOps learning and community"
  },
{
    name: "Feature Store",
    url: "https://github.com/feast-dev/feast",
    stars: "5k+",
    description: "Feature store for ML models.",
    category: "MLOps & Infra",
    features: ["Feature management", "Serving", "Offline/online"],
    install: "pip install feast",
    useCase: "Managing ML features"
  },
{
    name: "OpenMined",
    url: "https://github.com/OpenMined/PySyft",
    stars: "10k+",
    description: "Privacy-preserving AI with federated learning.",
    category: "Security & Guardrails",
    features: ["Federated learning", "Differential privacy", "Secure computation"],
    install: "pip install syft",
    useCase: "Privacy-preserving ML"
  },
{
    name: "Syft",
    url: "https://github.com/OpenMined/PySyft",
    stars: "10k+",
    description: "Data science on datasets you cannot see.",
    category: "Security & Guardrails",
    features: ["Remote data science", "Privacy", "Governance"],
    install: "pip install syft",
    useCase: "Privacy-preserving data science"
  },
{
    name: "Flower AI",
    url: "https://github.com/adap/flower",
    stars: "25k+",
    description: "Friendly federated learning framework.",
    category: "Security & Guardrails",
    features: ["Federated learning", "Framework-agnostic", "Easy to use"],
    install: "pip install flwr",
    useCase: "Federated learning"
  },
{
    name: "PySyft Box",
    url: "https://github.com/OpenMined/PySyft",
    stars: "10k+",
    description: "Data-centric AI with privacy by design.",
    category: "Security & Guardrails",
    features: ["Data governance", "Privacy", "Access control"],
    install: "pip install syft",
    useCase: "Governed data access for AI"
  },
{
    name: "IBM AI Fairness 360",
    url: "https://github.com/Trusted-AI/AIF360",
    stars: "2k+",
    description: "Toolkit for detecting and mitigating bias in ML.",
    category: "Security & Guardrails",
    features: ["Bias detection", "Mitigation", "Metrics"],
    install: "pip install aif360",
    useCase: "Fairness in AI systems"
  },
{
    name: "IBM AI Explainability 360",
    url: "https://github.com/Trusted-AI/AIX360",
    stars: "1k+",
    description: "Toolkit for explaining ML model decisions.",
    category: "Security & Guardrails",
    features: ["Explainability", "Multiple algorithms", "Metrics"],
    install: "pip install aix360",
    useCase: "Making AI decisions explainable"
  },
{
    name: "Presidio",
    url: "https://github.com/microsoft/presidio",
    stars: "3k+",
    description: "Data protection and de-identification SDK.",
    category: "Security & Guardrails",
    features: ["PII detection", "Anonymization", "Customizable"],
    install: "pip install presidio-analyzer",
    useCase: "Protecting sensitive data"
  },
{
    name: "Helm Chart LLM",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Helm charts for deploying LLM infrastructure.",
    category: "MLOps & Infra",
    features: ["Kubernetes", "Deployment", "Scaling"],
    install: "helm install",
    useCase: "Deploying LLM infrastructure on K8s"
  },
{
    name: "Seldon Deploy",
    url: "https://github.com/SeldonIO/seldon-core",
    stars: "N/A",
    description: "Enterprise ML deployment platform.",
    category: "MLOps & Infra",
    features: ["Enterprise", "A/B testing", "Canary"],
    install: "Deploy on Kubernetes",
    useCase: "Enterprise ML deployment"
  },
{
    name: "Vertex AI",
    url: "https://github.com/googleapis/python-aiplatform",
    stars: "N/A",
    description: "Google Cloud's ML platform.",
    category: "MLOps & Infra",
    features: ["Managed", "AutoML", "Pipelines"],
    install: "GCP",
    useCase: "Google Cloud ML platform"
  },
{
    name: "SageMaker",
    url: "https://github.com/aws/sagemaker-python-sdk",
    stars: "N/A",
    description: "AWS ML platform for building, training, and deploying models.",
    category: "MLOps & Infra",
    features: ["Managed", "Auto-scaling", "Multi-framework"],
    install: "AWS SDK",
    useCase: "AWS ML platform"
  },
{
    name: "Azure ML",
    url: "https://github.com/Azure/azure-sdk-for-python",
    stars: "N/A",
    description: "Microsoft Azure's ML platform.",
    category: "MLOps & Infra",
    features: ["Managed", "Pipelines", "Notebooks"],
    install: "Azure SDK",
    useCase: "Azure ML platform"
  },
{
    name: "Comet ML",
    url: "https://github.com/comet-ai",
    stars: "N/A",
    description: "ML experiment management platform.",
    category: "MLOps & Infra",
    features: ["Experiment tracking", "Model registry", "Dashboards"],
    install: "pip install comet-ml",
    useCase: "ML experiment management"
  },
{
    name: "Neptune.ai",
    url: "https://github.com/neptune-ai/neptune-client",
    stars: "N/A",
    description: "Metadata store for MLOps.",
    category: "MLOps & Infra",
    features: ["Metadata store", "Experiment tracking", "Model registry"],
    install: "pip install neptune",
    useCase: "MLOps metadata management"
  },
{
    name: "Gradient",
    url: "https://github.com/gradient-ai",
    stars: "N/A",
    description: "ML platform with GPU notebooks and model hosting.",
    category: "MLOps & Infra",
    features: ["GPU notebooks", "Model hosting", "Pipelines"],
    install: "pip install gradient",
    useCase: "ML development platform"
  },
{
    name: "Paperspace",
    url: "https://github.com/gradient-ai",
    stars: "N/A",
    description: "Cloud platform for ML development and deployment.",
    category: "MLOps & Infra",
    features: ["GPU instances", "Notebooks", "Model deployment"],
    install: "Web platform",
    useCase: "Cloud ML development"
  },
{
    name: "Anyscale",
    url: "https://github.com/anyscale",
    stars: "N/A",
    description: "Enterprise platform for distributed AI.",
    category: "MLOps & Infra",
    features: ["Ray-based", "Distributed", "Production"],
    install: "pip install anyscale",
    useCase: "Enterprise distributed AI"
  },
{
    name: "Lambda",
    url: "https://github.com/lambdal",
    stars: "N/A",
    description: "GPU cloud for AI with instant access.",
    category: "MLOps & Infra",
    features: ["GPU cloud", "Instant access", "Cluster"],
    install: "Web platform",
    useCase: "GPU cloud for AI training"
  },
{
    name: "CoreWeave",
    url: "https://github.com/coreweave",
    stars: "N/A",
    description: "GPU cloud for AI and VFX.",
    category: "MLOps & Infra",
    features: ["GPU cloud", "Kubernetes", "Enterprise"],
    install: "Web platform",
    useCase: "Enterprise GPU cloud"
  },
{
    name: "LangGraph.js",
    url: "https://github.com/langchain-ai/langgraphjs",
    stars: "1k+",
    description: "JavaScript/TypeScript port of LangGraph for agent workflows.",
    category: "LLM Frameworks & Orchestrators",
    features: ["JavaScript", "State graphs", "Persistence"],
    install: "npm install @langchain/langgraph",
    useCase: "Building agent workflows in JavaScript"
  },
{
    name: "LangGraph State",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "State management for LangGraph agent workflows.",
    category: "LLM Frameworks & Orchestrators",
    features: ["State graphs", "Persistence", "Human-in-the-loop"],
    install: "pip install langgraph",
    useCase: "Stateful agent workflows"
  },
{
    name: "LangGraph Prebuilt",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "Prebuilt agent components for LangGraph.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Prebuilt agents", "Tool calling", "Memory"],
    install: "pip install langgraph",
    useCase: "Quick agent setup"
  },
{
    name: "SuperAGI",
    url: "https://github.com/TransformerOptimus/SuperAGI",
    stars: "15k+",
    description: "Autonomous AI agent framework.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Autonomous", "Tool marketplace", "Vector DB"],
    install: "Docker compose",
    useCase: "Building autonomous AI agents"
  },
{
    name: "OpenAGI",
    url: "https://github.com/OpenAGI/OpenAGI",
    stars: "3k+",
    description: "Open source AGI research platform.",
    category: "LLM Frameworks & Orchestrators",
    features: ["AGI research", "Tool integration", "Learning"],
    install: "pip install openagi",
    useCase: "AGI research and development"
  },
{
    name: "Voyager",
    url: "https://github.com/MineDojo/Voyager",
    stars: "5k+",
    description: "LLM-powered lifelong learning agent in Minecraft.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Lifelong learning", "Skill library", "Exploration"],
    install: "pip install voyager",
    useCase: "LLM-powered game agents"
  },
{
    name: "Generative Agents",
    url: "https://github.com/joonspk-research/generative_agents",
    stars: "18k+",
    description: "Interactive simulacra of human behavior.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Generative agents", "Memory", "Reflection"],
    install: "pip install generative-agents",
    useCase: "Simulating human-like agents"
  },
{
    name: "LLM Agent MOOC",
    url: "https://github.com/LLM-Agent-MOOC",
    stars: "5k+",
    description: "Materials for the LLM Agents MOOC.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Educational", "Agent patterns", "Lectures"],
    install: "Clone repo",
    useCase: "Learning about LLM agents"
  },
{
    name: "PydanticAI",
    url: "https://github.com/pydantic/pydantic-ai",
    stars: "10k+",
    description: "Agent Framework / shim to use Pydantic with LLMs.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Pydantic", "Type-safe", "Structured outputs"],
    install: "pip install pydantic-ai",
    useCase: "Type-safe LLM applications"
  },
{
    name: "Wren AI",
    url: "https://github.com/Canner/WrenAI",
    stars: "5k+",
    description: "Open source AI SQL copilot for data teams.",
    category: "AI Web Applications",
    features: ["SQL generation", "Text-to-SQL", "Visualization"],
    install: "Docker compose",
    useCase: "AI-powered SQL queries"
  },
{
    name: "BI Dashboard AI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered business intelligence dashboard.",
    category: "AI Web Applications",
    features: ["Dashboard", "AI analytics", "Natural language queries"],
    install: "Web",
    useCase: "AI-powered business analytics"
  },
{
    name: "NotebookLM Plus",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Enhanced AI notebook with advanced features.",
    category: "AI Web Applications",
    features: ["Advanced RAG", "Audio", "Multi-source"],
    install: "Web",
    useCase: "Advanced AI research notebook"
  },
{
    name: "TypingMind",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI chat frontend with advanced features.",
    category: "AI Web Applications",
    features: ["Multi-LLM", "Prompts", "Plugins"],
    install: "Web",
    useCase: "Advanced AI chat interface"
  },
{
    name: "Poe Desktop",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Desktop app for Quora's Poe multi-model AI platform.",
    category: "AI Web Applications",
    features: ["Desktop", "Multi-model", "Bot creation"],
    install: "Download",
    useCase: "Desktop AI chat with multiple models"
  },
{
    name: "ChatHub",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Browser extension for comparing AI chatbots.",
    category: "AI Web Applications",
    features: ["Multi-model comparison", "Browser extension", "Side-by-side"],
    install: "Chrome extension",
    useCase: "Comparing AI chatbots"
  },
{
    name: "MaxAI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI assistant browser extension.",
    category: "AI Web Applications",
    features: ["Browser extension", "Page context", "Chat"],
    install: "Chrome extension",
    useCase: "AI assistance while browsing"
  },
{
    name: "Monica AI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered Chrome extension for writing and search.",
    category: "AI Web Applications",
    features: ["Chrome extension", "Writing", "Search"],
    install: "Chrome extension",
    useCase: "AI writing assistant in browser"
  },
{
    name: "Sider",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI chat sidebar for Chrome.",
    category: "AI Web Applications",
    features: ["Sidebar", "Multi-model", "Page context"],
    install: "Chrome extension",
    useCase: "AI chat while browsing"
  },
{
    name: "Merlin",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI chat and writing assistant Chrome extension.",
    category: "AI Web Applications",
    features: ["Chrome extension", "Writing", "Search"],
    install: "Chrome extension",
    useCase: "AI productivity in browser"
  },
{
    name: "Harpa AI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI automation and productivity Chrome extension.",
    category: "AI Web Applications",
    features: ["Automation", "Web scraping", "AI assistant"],
    install: "Chrome extension",
    useCase: "AI-powered browser automation"
  },
{
    name: "Gemini Advanced",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Google's premium AI assistant with extended capabilities.",
    category: "AI Web Applications",
    features: ["Extended context", "Code execution", "Google integration"],
    install: "Web",
    useCase: "Premium AI assistant"
  },
{
    name: "Groq Cloud",
    url: "https://github.com/groq",
    stars: "N/A",
    description: "Ultra-fast LLM inference on custom LPU hardware.",
    category: "AI Web Applications",
    features: ["Ultra-fast", "LPU", "Free tier"],
    install: "API",
    useCase: "Fast LLM inference"
  },
{
    name: "Deepseek Chat",
    url: "https://github.com/deepseek-ai",
    stars: "N/A",
    description: "DeepSeek's AI chat platform with advanced models.",
    category: "AI Web Applications",
    features: ["DeepSeek models", "Long context", "Code"],
    install: "Web",
    useCase: "Chat with DeepSeek models"
  },
{
    name: "Claude Projects",
    url: "https://www.anthropic.com/",
    stars: "N/A",
    description: "Claude's project feature for persistent context.",
    category: "AI Web Applications",
    features: ["Persistent context", "Custom instructions", "Artifacts"],
    install: "Web",
    useCase: "Persistent AI workspace"
  },
{
    name: "Grok",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "xAI's Grok model with real-time X data access.",
    category: "AI Web Applications",
    features: ["Real-time data", "X integration", "Humor"],
    install: "Web / X",
    useCase: "AI with real-time social data"
  },
{
    name: "Mistral AI",
    url: "https://github.com/mistralai",
    stars: "N/A",
    description: "Mistral's AI platform with open and proprietary models.",
    category: "AI Web Applications",
    features: ["Open models", "Le Chat", "Enterprise"],
    install: "Web / API",
    useCase: "Mistral AI models and platform"
  },
{
    name: "Inflection AI",
    url: "https://github.com/Inflection-AI",
    stars: "N/A",
    description: "Inflection's personal AI platform with Pi.",
    category: "AI Web Applications",
    features: ["Personal AI", "Empathy", "Memory"],
    install: "Web / mobile",
    useCase: "Personal AI companion"
  },
{
    name: "HuggingChat",
    url: "https://github.com/huggingface",
    stars: "N/A",
    description: "Hugging Face's open source chat interface.",
    category: "AI Web Applications",
    features: ["Open source", "Multiple models", "Free"],
    install: "Web",
    useCase: "Open source AI chat"
  },
{
    name: "Zhipu AI",
    url: "https://github.com/THUDM",
    stars: "N/A",
    description: "China's Zhipu AI platform with GLM models.",
    category: "AI Web Applications",
    features: ["GLM models", "Chinese", "Enterprise"],
    install: "Web / API",
    useCase: "Chinese AI platform"
  },
{
    name: "Alibaba Qwen",
    url: "https://github.com/QwenLM",
    stars: "N/A",
    description: "Alibaba's Qwen AI platform.",
    category: "AI Web Applications",
    features: ["Qwen models", "Multimodal", "Enterprise"],
    install: "Web / API",
    useCase: "Alibaba AI platform"
  },
{
    name: "Baidu ERNIE",
    url: "https://github.com/PaddlePaddle",
    stars: "N/A",
    description: "Baidu's ERNIE AI platform.",
    category: "AI Web Applications",
    features: ["ERNIE models", "Chinese", "Enterprise"],
    install: "Web / API",
    useCase: "Baidu AI platform"
  },
{
    name: "01.AI",
    url: "https://github.com/01-ai",
    stars: "N/A",
    description: "Kai-Fu Lee's AI startup with Yi models.",
    category: "AI Web Applications",
    features: ["Yi models", "Open source", "Enterprise"],
    install: "Web / API",
    useCase: "Yi AI models"
  },
{
    name: "Adept AI",
    url: "https://github.com/AdeptAI",
    stars: "N/A",
    description: "AI agent for computer actions.",
    category: "AI Agents & Tools",
    features: ["Computer actions", "Web automation", "Software use"],
    install: "API",
    useCase: "AI for computer automation"
  },
{
    name: "Cognition Labs",
    url: "https://github.com/cognition-ai/devin",
    stars: "N/A",
    description: "AI software engineer Devin and related tools.",
    category: "AI Agents & Tools",
    features: ["Software engineering", "Planning", "Debugging"],
    install: "Cloud platform",
    useCase: "AI software engineering"
  },
{
    name: "Poolside AI",
    url: "https://github.com/poolsideai",
    stars: "N/A",
    description: "AI coding assistant trained on real-world code.",
    category: "AI Coding & Software Engineering",
    features: ["Code generation", "Real-world training", "Enterprise"],
    install: "API",
    useCase: "Enterprise AI coding"
  },
{
    name: "Magic AI",
    url: "https://github.com/magic-ai",
    stars: "N/A",
    description: "AI code generation with very long context.",
    category: "AI Coding & Software Engineering",
    features: ["100M token context", "Code generation", "Enterprise"],
    install: "API",
    useCase: "Ultra-long context code generation"
  },
{
    name: "Factory AI",
    url: "https://github.com/factory-ai",
    stars: "N/A",
    description: "AI-powered software development automation.",
    category: "AI Coding & Software Engineering",
    features: ["Automation", "Code review", "Testing"],
    install: "Cloud platform",
    useCase: "Automated software development"
  },
{
    name: "Codegen",
    url: "https://github.com/codegen-ai",
    stars: "N/A",
    description: "AI agent for codebase operations.",
    category: "AI Coding & Software Engineering",
    features: ["Codebase ops", "Refactoring", "Migrations"],
    install: "pip install codegen",
    useCase: "AI-powered codebase management"
  },
{
    name: "Zed AI",
    url: "https://github.com/zed-industries/zed",
    stars: "N/A",
    description: "AI features in the Zed code editor.",
    category: "AI Coding & Software Engineering",
    features: ["Fast editor", "AI completion", "Collaboration"],
    install: "Download from zed.dev",
    useCase: "AI-powered code editing"
  },
{
    name: "Lapce",
    url: "https://github.com/lapce/lapce",
    stars: "35k+",
    description: "Lightning-fast and powerful code editor with AI.",
    category: "AI Coding & Software Engineering",
    features: ["Rust-based", "Fast", "Plugin system"],
    install: "Download from lapce.dev",
    useCase: "Fast code editing with AI"
  },
{
    name: "Helix",
    url: "https://github.com/helix-editor/helix",
    stars: "35k+",
    description: "Post-modern modal text editor with LSP support.",
    category: "AI Coding & Software Engineering",
    features: ["Modal", "LSP", "Fast"],
    install: "Package manager",
    useCase: "Fast code editing"
  },
{
    name: "Avante.nvim",
    url: "https://github.com/yetone/avante.nvim",
    stars: "10k+",
    description: "AI plugin for Neovim inspired by Cursor.",
    category: "AI Coding & Software Engineering",
    features: ["Neovim", "AI chat", "Code generation"],
    install: "Neovim plugin manager",
    useCase: "AI in Neovim"
  },
{
    name: "Copilot.vim",
    url: "https://github.com/github/copilot.vim",
    stars: "8k+",
    description: "GitHub Copilot for Vim and Neovim.",
    category: "AI Coding & Software Engineering",
    features: ["Vim/Neovim", "Autocomplete", "Multi-language"],
    install: "Vim plugin",
    useCase: "AI autocomplete in Vim"
  },
{
    name: "Codeium.vim",
    url: "https://github.com/Exafunction/codeium.vim",
    stars: "2k+",
    description: "Free AI code completion for Vim and Neovim.",
    category: "AI Coding & Software Engineering",
    features: ["Free", "Vim/Neovim", "Fast completions"],
    install: "Vim plugin",
    useCase: "Free AI autocomplete in Vim"
  },
{
    name: "Selenium AI",
    url: "https://github.com/SeleniumHQ/selenium",
    stars: "N/A",
    description: "AI-powered browser automation with Selenium.",
    category: "AI Agents & Tools",
    features: ["Browser automation", "AI decisions", "Selenium"],
    install: "pip install selenium",
    useCase: "AI-powered web automation"
  },
{
    name: "Playwright AI",
    url: "https://github.com/microsoft/playwright",
    stars: "N/A",
    description: "AI-powered browser automation with Playwright.",
    category: "AI Agents & Tools",
    features: ["Browser automation", "AI decisions", "Cross-browser"],
    install: "npm install playwright",
    useCase: "AI-powered cross-browser automation"
  },
{
    name: "ReAct Pattern",
    url: "https://github.com/ysymyth/ReAct",
    stars: "2k+",
    description: "Reasoning and Acting pattern for LLM agents.",
    category: "AI Design Patterns & Architecture",
    features: ["Reasoning", "Acting", "Chain of thought"],
    install: "Clone repo",
    useCase: "Implementing ReAct agents"
  },
{
    name: "Tree of Thought",
    url: "https://github.com/ysymyth/ReAct",
    stars: "2k+",
    description: "Tree of Thought prompting pattern.",
    category: "AI Design Patterns & Architecture",
    features: ["Planning", "Exploration", "Decision trees"],
    install: "Clone repo",
    useCase: "Complex reasoning with tree search"
  },
{
    name: "Chain of Thought",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Chain of Thought prompting technique.",
    category: "AI Design Patterns & Architecture",
    features: ["Step-by-step", "Reasoning", "Explanation"],
    install: "Prompt pattern",
    useCase: "Improving LLM reasoning"
  },
{
    name: "Retrieval Augmented Generation",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "RAG pattern for grounding LLMs with external data.",
    category: "AI Design Patterns & Architecture",
    features: ["Retrieval", "Generation", "Knowledge grounding"],
    install: "Framework-dependent",
    useCase: "Grounding LLMs with external knowledge"
  },
{
    name: "Guardrails Pattern",
    url: "https://github.com/guardrails-ai/guardrails",
    stars: "N/A",
    description: "Output validation and correction pattern for LLMs.",
    category: "AI Design Patterns & Architecture",
    features: ["Validation", "Correction", "Retry"],
    install: "Framework-dependent",
    useCase: "Ensuring LLM output quality"
  },
{
    name: "Human-in-the-Loop Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for incorporating human oversight in AI systems.",
    category: "AI Design Patterns & Architecture",
    features: ["Human oversight", "Approval", "Feedback"],
    install: "Implementation-dependent",
    useCase: "Adding human oversight to AI"
  },
{
    name: "Evaluation Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Systematic evaluation of LLM outputs.",
    category: "AI Design Patterns & Architecture",
    features: ["Metrics", "Benchmarking", "A/B testing"],
    install: "Framework-dependent",
    useCase: "Measuring LLM performance"
  },
{
    name: "Prompt Template Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Template-based prompt construction pattern.",
    category: "AI Design Patterns & Architecture",
    features: ["Templates", "Variables", "Chaining"],
    install: "Framework-dependent",
    useCase: "Structured prompt construction"
  },
{
    name: "Caching Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Caching LLM responses for cost and latency optimization.",
    category: "AI Design Patterns & Architecture",
    features: ["Semantic caching", "Exact matching", "TTL"],
    install: "Implementation-dependent",
    useCase: "Reducing LLM API costs"
  },
{
    name: "Streaming Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Streaming LLM responses for real-time UX.",
    category: "AI Design Patterns & Architecture",
    features: ["Real-time", "Token streaming", "SSE"],
    install: "Framework-dependent",
    useCase: "Real-time LLM response streaming"
  },
{
    name: "Agentic RAG",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "RAG pattern with autonomous retrieval decisions.",
    category: "AI Design Patterns & Architecture",
    features: ["Autonomous retrieval", "Query planning", "Multi-step"],
    install: "Framework-dependent",
    useCase: "Intelligent RAG with agent planning"
  },
{
    name: "Multi-Agent Debate",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern where multiple agents debate to reach conclusions.",
    category: "AI Design Patterns & Architecture",
    features: ["Debate", "Consensus", "Multiple perspectives"],
    install: "Implementation-dependent",
    useCase: "Improving reasoning through debate"
  },
{
    name: "Self-Reflection Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Agents that reflect on their own outputs.",
    category: "AI Design Patterns & Architecture",
    features: ["Reflection", "Self-critique", "Improvement"],
    install: "Implementation-dependent",
    useCase: "Improving agent output quality"
  },
{
    name: "Tool-Augmented LLM",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for giving LLMs access to external tools.",
    category: "AI Design Patterns & Architecture",
    features: ["Tool calling", "Function execution", "Result parsing"],
    install: "Framework-dependent",
    useCase: "Extending LLM capabilities with tools"
  },
{
    name: "Structured Output Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for getting structured outputs from LLMs.",
    category: "AI Design Patterns & Architecture",
    features: ["JSON mode", "Pydantic", "Schema validation"],
    install: "Framework-dependent",
    useCase: "Getting reliable structured data from LLMs"
  },
{
    name: "Memory Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for giving LLMs persistent memory.",
    category: "AI Design Patterns & Architecture",
    features: ["Short-term", "Long-term", "Working memory"],
    install: "Implementation-dependent",
    useCase: "Adding memory to LLM applications"
  },
{
    name: "Planning Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for LLM-driven task planning and decomposition.",
    category: "AI Design Patterns & Architecture",
    features: ["Task decomposition", "Goal setting", "Execution"],
    install: "Implementation-dependent",
    useCase: "Breaking down complex tasks"
  },
{
    name: "Reflection Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Agent pattern that reflects on past actions.",
    category: "AI Design Patterns & Architecture",
    features: ["Self-reflection", "Learning", "Improvement"],
    install: "Implementation-dependent",
    useCase: "Agents that learn from experience"
  },
{
    name: "Parallel Tool Calls",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for executing multiple tools simultaneously.",
    category: "AI Design Patterns & Architecture",
    features: ["Parallel execution", "Efficiency", "Batch tools"],
    install: "Implementation-dependent",
    useCase: "Speeding up tool execution"
  },
{
    name: "Query Decomposition",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for breaking complex queries into sub-queries.",
    category: "AI Design Patterns & Architecture",
    features: ["Sub-queries", "Parallel search", "Aggregation"],
    install: "Implementation-dependent",
    useCase: "Handling complex information needs"
  },
{
    name: "Multi-Modal Pipeline",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for processing multiple data types.",
    category: "AI Design Patterns & Architecture",
    features: ["Text", "Image", "Audio", "Video"],
    install: "Implementation-dependent",
    useCase: "Processing diverse data types"
  },
{
    name: "Progressive Disclosure",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for gradually revealing information to LLMs.",
    category: "AI Design Patterns & Architecture",
    features: ["Chunking", "Summarization", "Detail levels"],
    install: "Implementation-dependent",
    useCase: "Managing large context windows"
  },
{
    name: "Speculative Decoding",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for faster LLM inference using draft models.",
    category: "AI Design Patterns & Architecture",
    features: ["Draft model", "Verification", "Speed"],
    install: "Implementation-dependent",
    useCase: "Accelerating LLM inference"
  },
{
    name: "MoE Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Mixture of Experts pattern for efficient model scaling.",
    category: "AI Design Patterns & Architecture",
    features: ["Expert routing", "Sparse activation", "Efficiency"],
    install: "Implementation-dependent",
    useCase: "Efficient large model architecture"
  },
{
    name: "RLHF Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Reinforcement Learning from Human Feedback pattern.",
    category: "AI Design Patterns & Architecture",
    features: ["Reward model", "PPO", "Alignment"],
    install: "Implementation-dependent",
    useCase: "Aligning LLMs with human preferences"
  },
{
    name: "DPO Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Direct Preference Optimization pattern.",
    category: "AI Design Patterns & Architecture",
    features: ["Direct optimization", "No reward model", "Simpler"],
    install: "Implementation-dependent",
    useCase: "Simpler LLM alignment"
  },
{
    name: "Prompt Chaining Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for chaining multiple LLM calls.",
    category: "AI Design Patterns & Architecture",
    features: ["Sequential calls", "Data flow", "Error handling"],
    install: "Implementation-dependent",
    useCase: "Complex multi-step LLM workflows"
  },
{
    name: "Map-Reduce Pattern",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for processing large documents with LLMs.",
    category: "AI Design Patterns & Architecture",
    features: ["Chunking", "Parallel processing", "Aggregation"],
    install: "Implementation-dependent",
    useCase: "Processing large documents"
  },
{
    name: "Syntex AI",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "AI-powered content intelligence platform.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Content analysis", "Classification", "Extraction"],
    install: "Web platform",
    useCase: "Automated content understanding"
  },
{
    name: "PromptLayer",
    url: "https://github.com/PromptLayer/promptlayer",
    stars: "N/A",
    description: "Platform for managing and monitoring prompts.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Prompt management", "Versioning", "Analytics"],
    install: "pip install promptlayer",
    useCase: "Prompt lifecycle management"
  },
{
    name: "Anthropic Prompt Caching",
    url: "https://www.anthropic.com/",
    stars: "N/A",
    description: "Prompt caching for cost and latency optimization.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Caching", "Cost reduction", "Latency"],
    install: "API feature",
    useCase: "Reducing LLM costs with caching"
  },
{
    name: "OpenAI Structured Outputs",
    url: "https://github.com/openai/openai-cookbook",
    stars: "N/A",
    description: "Get reliably structured outputs from OpenAI models.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["JSON schema", "Reliable", "Type-safe"],
    install: "API feature",
    useCase: "Structured data extraction"
  },
{
    name: "CrewAI Enterprise",
    url: "https://github.com/crewAIInc/crewAI",
    stars: "N/A",
    description: "Enterprise version of CrewAI for production agent systems.",
    category: "AI Agents & Tools",
    features: ["Enterprise", "Monitoring", "Scalability"],
    install: "pip install crewai-enterprise",
    useCase: "Production multi-agent systems"
  },
{
    name: "AutoGen Studio",
    url: "https://github.com/microsoft/autogen",
    stars: "38k+",
    description: "GUI for building and testing multi-agent systems.",
    category: "AI Agents & Tools",
    features: ["GUI", "Multi-agent", "Rapid prototyping"],
    install: "pip install autogenstudio",
    useCase: "Visual multi-agent development"
  },
{
    name: "LangGraph Bigtool",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "Tool management for large numbers of tools.",
    category: "AI Agents & Tools",
    features: ["Large tool sets", "Selection", "Organization"],
    install: "pip install langgraph",
    useCase: "Managing many tools for agents"
  },
{
    name: "LangGraph Memory",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "Memory management for LangGraph agents.",
    category: "AI Agents & Tools",
    features: ["Short-term", "Long-term", "Persistence"],
    install: "pip install langgraph",
    useCase: "Adding memory to agents"
  },
{
    name: "LangGraph Smallweb",
    url: "https://github.com/langchain-ai/langgraph",
    stars: "8k+",
    description: "Web interface for LangGraph agents.",
    category: "AI Agents & Tools",
    features: ["Web UI", "Agent monitoring", "Chat"],
    install: "pip install langgraph",
    useCase: "Web interface for agents"
  },
{
    name: "HuggingFace Transformers",
    url: "https://github.com/huggingface/transformers",
    stars: "140k+",
    description: "State-of-the-art ML for PyTorch, TensorFlow, and JAX.",
    category: "Data & Training",
    features: ["1000+ models", "Multi-framework", "Pipeline API"],
    install: "pip install transformers",
    useCase: "Using pre-trained ML models"
  },
{
    name: "HuggingFace Datasets",
    url: "https://github.com/huggingface/datasets",
    stars: "20k+",
    description: "Library for accessing and sharing datasets for ML.",
    category: "Data & Training",
    features: ["10000+ datasets", "Streaming", "Arrow backend"],
    install: "pip install datasets",
    useCase: "Loading and processing ML datasets"
  },
{
    name: "HuggingFace Tokenizers",
    url: "https://github.com/huggingface/tokenizers",
    stars: "9k+",
    description: "Fast state-of-the-art tokenizers for ML.",
    category: "Data & Training",
    features: ["Rust backend", "Fast", "Customizable"],
    install: "pip install tokenizers",
    useCase: "Fast text tokenization"
  },
{
    name: "OpenAI Whisper",
    url: "https://github.com/openai/whisper",
    stars: "72k+",
    description: "General-purpose speech recognition model.",
    category: "Data & Training",
    features: ["Multilingual", "Robust", "Transcription"],
    install: "pip install openai-whisper",
    useCase: "Speech recognition training"
  },
{
    name: "Stable Baselines3",
    url: "https://github.com/DLR-RM/stable-baselines3",
    stars: "10k+",
    description: "Reliable implementations of reinforcement learning algorithms.",
    category: "Data & Training",
    features: ["RL algorithms", "PyTorch", "Gymnasium"],
    install: "pip install stable-baselines3",
    useCase: "Reinforcement learning training"
  },
{
    name: "CleanRL",
    url: "https://github.com/vwxyzjn/cleanrl",
    stars: "5k+",
    description: "High-quality single-file implementations of RL algorithms.",
    category: "Data & Training",
    features: ["Single-file", "Readable", "Research-grade"],
    install: "pip install cleanrl",
    useCase: "Learning and researching RL"
  },
{
    name: "OpenAI Gymnasium",
    url: "https://github.com/Farama-Foundation/Gymnasium",
    stars: "7k+",
    description: "Standard API for reinforcement learning.",
    category: "Data & Training",
    features: ["Standard API", "Environments", "Evaluation"],
    install: "pip install gymnasium",
    useCase: "RL environment interface"
  },
{
    name: "VLMs Dataset",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Collection of vision-language model datasets.",
    category: "Data & Training",
    features: ["Vision-language", "Multi-task", "Evaluation"],
    install: "Various",
    useCase: "Training vision-language models"
  },
{
    name: "RedPajama",
    url: "https://github.com/togethercomputer/RedPajama-Data",
    stars: "5k+",
    description: "Open source dataset for training LLMs.",
    category: "Data & Training",
    features: ["Open source", "Large-scale", "High-quality"],
    install: "pip install redpajama",
    useCase: "Training open source LLMs"
  },
{
    name: "The Pile",
    url: "https://github.com/EleutherAI/the-pile",
    stars: "3k+",
    description: "800GB dataset of diverse text for training LLMs.",
    category: "Data & Training",
    features: ["800GB", "Diverse", "Research-grade"],
    install: "Download",
    useCase: "Training large language models"
  },
{
    name: "Dolma",
    url: "https://github.com/allenai/dolma",
    stars: "2k+",
    description: "Open source toolkit for building LLM training data.",
    category: "Data & Training",
    features: ["Toolkit", "Curated", "High-quality"],
    install: "pip install dolma",
    useCase: "Building LLM training datasets"
  },
{
    name: "FineWeb",
    url: "https://github.com/HuggingFaceFW/fineweb",
    stars: "2k+",
    description: "15T token web crawl dataset for LLM training.",
    category: "Data & Training",
    features: ["15T tokens", "Deduplicated", "High-quality"],
    install: "pip install datasets",
    useCase: "Training LLMs on web data"
  },
{
    name: "StarCoder2 Dataset",
    url: "https://github.com/bigcode-project/starcoder2",
    stars: "N/A",
    description: "The Stack v2 - the largest code dataset.",
    category: "Data & Training",
    features: ["Code", "600+ languages", "Licensed"],
    install: "pip install datasets",
    useCase: "Training code generation models"
  },
{
    name: "WandB Sweeps",
    url: "https://github.com/wandb/sweeps",
    stars: "2k+",
    description: "Hyperparameter tuning with Weights & Biases.",
    category: "Data & Training",
    features: ["Hyperparameter", "Bayesian search", "Visualization"],
    install: "pip install wandb",
    useCase: "Hyperparameter optimization"
  },
{
    name: "Optuna",
    url: "https://github.com/optuna/optuna",
    stars: "12k+",
    description: "Hyperparameter optimization framework.",
    category: "Data & Training",
    features: ["Bayesian", "Pruning", "Visualization"],
    install: "pip install optuna",
    useCase: "Hyperparameter tuning"
  },
{
    name: "Ray Tune",
    url: "https://github.com/ray-project/ray",
    stars: "36k+",
    description: "Scalable hyperparameter tuning with Ray.",
    category: "Data & Training",
    features: ["Distributed", "Auto-scaling", "Multi-algorithm"],
    install: "pip install ray[tune]",
    useCase: "Distributed hyperparameter tuning"
  },
{
    name: "Ax",
    url: "https://github.com/facebook/Ax",
    stars: "2k+",
    description: "Adaptive experimentation platform by Meta.",
    category: "Data & Training",
    features: ["Bayesian optimization", "Multi-metric", "Platform-agnostic"],
    install: "pip install ax-platform",
    useCase: "Adaptive experimentation"
  },
{
    name: "BoTorch",
    url: "https://github.com/pytorch/botorch",
    stars: "3k+",
    description: "Bayesian optimization built on PyTorch.",
    category: "Data & Training",
    features: ["PyTorch", "Flexible", "GPU-accelerated"],
    install: "pip install botorch",
    useCase: "Bayesian optimization research"
  },
{
    name: "KubeFlow Pipelines",
    url: "https://github.com/kubeflow/pipelines",
    stars: "4k+",
    description: "ML workflow orchestration on Kubernetes.",
    category: "MLOps & Infra",
    features: ["Pipelines", "Kubernetes", "Components"],
    install: "Deploy on Kubernetes",
    useCase: "ML pipeline orchestration on K8s"
  },
{
    name: "Apache Spark MLlib",
    url: "https://github.com/apache/spark",
    stars: "40k+",
    description: "Scalable ML library for Apache Spark.",
    category: "MLOps & Infra",
    features: ["Distributed", "Scalable", "SQL integration"],
    install: "pip install pyspark",
    useCase: "Large-scale ML on Spark"
  },
{
    name: "dbt",
    url: "https://github.com/dbt-labs/dbt-core",
    stars: "10k+",
    description: "Data build tool for analytics engineering.",
    category: "MLOps & Infra",
    features: ["SQL transformations", "Testing", "Documentation"],
    install: "pip install dbt-core",
    useCase: "Data transformation for ML"
  },
{
    name: "Great Expectations",
    url: "https://github.com/great-expectations/great_expectations",
    stars: "10k+",
    description: "Data validation and documentation.",
    category: "MLOps & Infra",
    features: ["Validation", "Documentation", "Monitoring"],
    install: "pip install great-expectations",
    useCase: "Data quality for ML pipelines"
  },
{
    name: "Pandera",
    url: "https://github.com/unionai-oss/pandera",
    stars: "3k+",
    description: "Statistical data validation for pandas.",
    category: "MLOps & Infra",
    features: ["Pandas validation", "Statistics", "Type checking"],
    install: "pip install pandera",
    useCase: "DataFrame validation"
  },
{
    name: "Evidently AI",
    url: "https://github.com/evidentlyai/evidently",
    stars: "6k+",
    description: "ML model monitoring and evaluation.",
    category: "MLOps & Infra",
    features: ["Drift detection", "Reports", "Dashboards"],
    install: "pip install evidently",
    useCase: "Monitoring ML model performance"
  },
{
    name: "Whylabs",
    url: "https://github.com/whylabs/whylogs",
    stars: "N/A",
    description: "ML monitoring and observability platform.",
    category: "MLOps & Infra",
    features: ["Monitoring", "Alerts", "Dashboards"],
    install: "pip install whylogs",
    useCase: "Production ML monitoring"
  },
{
    name: "NannyML",
    url: "https://github.com/NannyML/nannyml",
    stars: "2k+",
    description: "Performance estimation for ML models without ground truth.",
    category: "MLOps & Infra",
    features: ["Performance estimation", "Drift detection", "CBPE"],
    install: "pip install nannyml",
    useCase: "Monitoring without labels"
  },
{
    name: "Model Registry",
    url: "https://github.com/mlflow/mlflow",
    stars: "N/A",
    description: "Model registry and versioning platform.",
    category: "MLOps & Infra",
    features: ["Registry", "Versioning", "Lineage"],
    install: "Various",
    useCase: "Model lifecycle management"
  },
{
    name: "ML Metadata",
    url: "https://github.com/ml-metadata/ml-metadata",
    stars: "2k+",
    description: "ML metadata management from Google.",
    category: "MLOps & Infra",
    features: ["Metadata", "Lineage", "Querying"],
    install: "pip install ml-metadata",
    useCase: "Tracking ML metadata"
  },
{
    name: "OpenLineage",
    url: "https://github.com/OpenLineage/OpenLineage",
    stars: "2k+",
    description: "Open standard for data lineage.",
    category: "MLOps & Infra",
    features: ["Open standard", "Lineage", "Integration"],
    install: "pip install openlineage-python",
    useCase: "Data lineage tracking"
  },
{
    name: "Marvin AI",
    url: "https://github.com/PrefectHQ/marvin",
    stars: "5k+",
    description: "AI engineering framework for building structured LLM apps.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Structured outputs", "Functions", "Extraction"],
    install: "pip install marvin",
    useCase: "Building structured LLM applications"
  },
{
    name: "LLM Compiler",
    url: "https://github.com/facebookresearch/llm-compiler",
    stars: "3k+",
    description: "LLM Compiler for parallel function calling.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Parallel execution", "Planning", "Optimization"],
    install: "pip install llm-compiler",
    useCase: "Optimizing tool call execution"
  },
{
    name: "LlamaIndex Workflows",
    url: "https://github.com/run-llama/llama_index",
    stars: "38k+",
    description: "Event-driven workflows for LLM applications.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Event-driven", "Orchestration", "Streaming"],
    install: "pip install llama-index",
    useCase: "Building event-driven LLM apps"
  },
{
    name: "CrewAI Flows",
    url: "https://github.com/crewAIInc/crewAI",
    stars: "25k+",
    description: "Structured workflows for CrewAI agents.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Workflows", "Steps", "Error handling"],
    install: "pip install crewai",
    useCase: "Building structured agent workflows"
  },
{
    name: "Atomic Agents Components",
    url: "https://github.com/BrainBlend-AI/atomic-agents",
    stars: "1k+",
    description: "Atomic components for composable AI agents.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Components", "Composable", "Type-safe"],
    install: "pip install atomic-agents",
    useCase: "Building composable agent systems"
  },
{
    name: "Phidata Assistants",
    url: "https://github.com/phidatahq/phidata",
    stars: "15k+",
    description: "Build AI assistants with knowledge and tools.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Assistants", "Knowledge", "Tools"],
    install: "pip install phidata",
    useCase: "Building AI assistants with memory"
  },
{
    name: "Swarm Agents",
    url: "https://github.com/openai/swarm",
    stars: "18k+",
    description: "Lightweight multi-agent orchestration from OpenAI.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Handoffs", "Stateless", "Simple"],
    install: "pip install openai-swarm",
    useCase: "Simple multi-agent systems"
  },
{
    name: "Google ADK",
    url: "https://github.com/google/adk-python",
    stars: "5k+",
    description: "Google's Agent Development Kit for building AI agents.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Google ecosystem", "Multi-modal", "Enterprise"],
    install: "pip install google-adk",
    useCase: "Building agents with Google AI"
  },
{
    name: "AWS Bedrock Agents",
    url: "https://github.com/aws/bedrock-agent-runtime-sdk",
    stars: "N/A",
    description: "AWS's managed agent service for Bedrock.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Managed", "AWS integration", "Enterprise"],
    install: "AWS SDK",
    useCase: "Enterprise agents on AWS"
  },
{
    name: "Azure AI Agent Service",
    url: "https://github.com/Azure/azure-sdk-for-python",
    stars: "N/A",
    description: "Microsoft Azure's managed agent service.",
    category: "LLM Frameworks & Orchestrators",
    features: ["Managed", "Azure integration", "Enterprise"],
    install: "Azure SDK",
    useCase: "Enterprise agents on Azure"
  },
{
    name: "OpenAI Assistants API",
    url: "https://github.com/openai/openai-python",
    stars: "N/A",
    description: "OpenAI's Assistants API with tool orchestration.",
    category: "AI Design Patterns & Architecture",
    features: ["Assistants", "File search", "Code interpreter"],
    install: "API",
    useCase: "Building assistants with OpenAI"
  },
{
    name: "Google Gemini Tool Use",
    url: "https://github.com/google-gemini/generative-ai-python",
    stars: "N/A",
    description: "Gemini's function calling capabilities.",
    category: "AI Design Patterns & Architecture",
    features: ["Function calling", "Code execution", "Search"],
    install: "API",
    useCase: "Using tools with Gemini"
  },
{
    name: "Groq Function Calling",
    url: "https://github.com/groq",
    stars: "N/A",
    description: "Function calling on Groq's fast inference.",
    category: "AI Design Patterns & Architecture",
    features: ["Fast", "Function calling", "Open models"],
    install: "API",
    useCase: "Fast tool execution"
  },
{
    name: "Together Function Calling",
    url: "https://github.com/togethercomputer",
    stars: "N/A",
    description: "Function calling on Together AI's platform.",
    category: "AI Design Patterns & Architecture",
    features: ["Open models", "Function calling", "Cloud"],
    install: "API",
    useCase: "Tool use with open models"
  },
{
    name: "Nous Research",
    url: "https://github.com/NousResearch",
    stars: "N/A",
    description: "Open source AI research with Hermes models.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Open source", "Hermes models", "Function calling"],
    install: "Various",
    useCase: "Fine-tuned models with tool use"
  },
{
    name: "Cohere Command R+",
    url: "https://github.com/cohere-ai",
    stars: "N/A",
    description: "Cohere's RAG-optimized model with tool use.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["RAG", "Tool use", "Multilingual"],
    install: "API",
    useCase: "RAG-optimized LLM with tools"
  },
{
    name: "Grok-2",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "xAI's Grok-2 model with advanced capabilities.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Advanced reasoning", "Real-time data", "Code"],
    install: "API",
    useCase: "Advanced AI reasoning"
  },
{
    name: "Claude 3.5 Sonnet",
    url: "https://github.com/anthropics",
    stars: "N/A",
    description: "Anthropic's balanced performance model.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Balanced", "Fast", "Vision"],
    install: "API",
    useCase: "General-purpose AI assistant"
  },
{
    name: "Gemini 1.5 Pro",
    url: "https://github.com/google-gemini",
    stars: "N/A",
    description: "Google's Gemini 1.5 Pro with 2M context.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["2M context", "Multimodal", "Fast"],
    install: "API",
    useCase: "Long-context multimodal AI"
  },
{
    name: "Llama 3.1 405B",
    url: "https://github.com/meta-llama/llama-models",
    stars: "10k+",
    description: "Meta's largest open source language model.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["405B params", "Open source", "Multilingual"],
    install: "Various",
    useCase: "Running the largest open LLM"
  },
{
    name: "Mistral Large",
    url: "https://github.com/mistralai",
    stars: "N/A",
    description: "Mistral's flagship commercial model.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Large", "Fast", "Multilingual"],
    install: "API",
    useCase: "Enterprise AI applications"
  },
{
    name: "Qwen2.5 72B",
    url: "https://github.com/QwenLM/Qwen2.5",
    stars: "12k+",
    description: "Alibaba's Qwen 2.5 flagship model.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["72B params", "Multilingual", "Code"],
    install: "Various",
    useCase: "Multilingual AI applications"
  },
{
    name: "DeepSeek V3",
    url: "https://github.com/deepseek-ai/DeepSeek-V3",
    stars: "12k+",
    description: "DeepSeek's MoE language model.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["MoE", "Open source", "Efficient"],
    install: "Various",
    useCase: "Efficient large-scale language modeling"
  },
{
    name: "Gemma 2",
    url: "https://github.com/google-deepmind/gemma",
    stars: "10k+",
    description: "Google DeepMind's open models.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Open source", "Lightweight", "Efficient"],
    install: "Various",
    useCase: "Efficient on-device AI"
  },
{
    name: "Phi-3",
    url: "https://github.com/microsoft/Phi-3CookBook",
    stars: "5k+",
    description: "Microsoft's small but capable language models.",
    category: "Prompt Engineering & Fine-Tuning",
    features: ["Small", "Efficient", "On-device"],
    install: "Various",
    useCase: "Efficient small language models"
  },
{
    name: "Cohere Embed v3",
    url: "https://github.com/cohere-ai",
    stars: "N/A",
    description: "Cohere's state-of-the-art embedding model.",
    category: "Vector Databases & RAG",
    features: ["Multilingual", "High performance", "Compression"],
    install: "API",
    useCase: "High-quality text embeddings"
  },
{
    name: "Jina Embeddings v3",
    url: "https://github.com/jina-ai/jina-embeddings-v3",
    stars: "3k+",
    description: "Jina's multitask embedding model.",
    category: "Vector Databases & RAG",
    features: ["Multilingual", "Multitask", "Matryoshka"],
    install: "pip install jina",
    useCase: "Flexible text embeddings"
  },
{
    name: "BGE Embeddings",
    url: "https://github.com/FlagOpen/FlagEmbedding",
    stars: "10k+",
    description: "BAAI's open source embedding models.",
    category: "Vector Databases & RAG",
    features: ["Open source", "Multilingual", "High performance"],
    install: "pip install FlagEmbedding",
    useCase: "Open source embeddings"
  },
{
    name: "E5 Embeddings",
    url: "https://github.com/intfloat/e5-mistral-7b-instruct",
    stars: "1k+",
    description: "Microsoft's instruction-finetuned embedding model.",
    category: "Vector Databases & RAG",
    features: ["Instruction-based", "High performance", "Open source"],
    install: "pip install sentence-transformers",
    useCase: "Instruction-following embeddings"
  },
{
    name: "Nomic Embed",
    url: "https://github.com/nomic-ai/nomic-embed-text-v1.5",
    stars: "1k+",
    description: "Open source 137M parameter embedding model.",
    category: "Vector Databases & RAG",
    features: ["Small", "Open source", "Efficient"],
    install: "pip install nomic",
    useCase: "Efficient open source embeddings"
  },
{
    name: "Voyage AI",
    url: "https://github.com/voyage-ai",
    stars: "N/A",
    description: "High-performance embedding models.",
    category: "Vector Databases & RAG",
    features: ["Code embeddings", "Multilingual", "High performance"],
    install: "API",
    useCase: "Domain-specific embeddings"
  },
{
    name: "OpenAI Embeddings v3",
    url: "https://github.com/openai/openai-python",
    stars: "N/A",
    description: "OpenAI's latest embedding models.",
    category: "Vector Databases & RAG",
    features: ["Multilingual", "Dimensions", "Performance"],
    install: "API",
    useCase: "General-purpose embeddings"
  },
{
    name: "HuggingFace Embeddings",
    url: "https://github.com/huggingface/sentence-transformers",
    stars: "15k+",
    description: "Sentence Transformers for computing embeddings.",
    category: "Vector Databases & RAG",
    features: ["100+ models", "Easy to use", "GPU support"],
    install: "pip install sentence-transformers",
    useCase: "Computing text embeddings"
  },
{
    name: "Nomic Atlas",
    url: "https://github.com/nomic-ai/atlas",
    stars: "2k+",
    description: "Visualization and exploration of embedding spaces.",
    category: "Vector Databases & RAG",
    features: ["Visualization", "Clustering", "Exploration"],
    install: "pip install nomic",
    useCase: "Exploring embedding spaces"
  },
{
    name: "TensorFlow Embedding Projector",
    url: "https://github.com/tensorflow/tensorboard",
    stars: "7k+",
    description: "Interactive embedding visualization in TensorBoard.",
    category: "Vector Databases & RAG",
    features: ["Interactive", "2D/3D", "TensorBoard"],
    install: "pip install tensorboard",
    useCase: "Visualizing embeddings"
  },
{
    name: "UMAP",
    url: "https://github.com/lmcinnes/umap",
    stars: "9k+",
    description: "Dimensionality reduction for visualization.",
    category: "Vector Databases & RAG",
    features: ["2D/3D", "Fast", "Preserves structure"],
    install: "pip install umap-learn",
    useCase: "Visualizing high-dimensional data"
  },
{
    name: "t-SNE",
    url: "https://github.com/drv-sc/tsne",
    stars: "1k+",
    description: "t-distributed stochastic neighbor embedding.",
    category: "Vector Databases & RAG",
    features: ["Visualization", "Clustering", "Nonlinear"],
    install: "pip install scikit-learn",
    useCase: "Visualizing clusters in embedding space"
  },
{
    name: "OpenAI Moderation",
    url: "https://github.com/openai/openai-python",
    stars: "N/A",
    description: "Content moderation API for filtering harmful content.",
    category: "Security & Guardrails",
    features: ["Content filtering", "Harmful content", "Categories"],
    install: "API",
    useCase: "Filtering harmful content"
  },
{
    name: "Perspective API",
    url: "https://github.com/conversationai",
    stars: "N/A",
    description: "Google's API for measuring toxic comments.",
    category: "Security & Guardrails",
    features: ["Toxicity scoring", "Comments", "Moderation"],
    install: "API",
    useCase: "Content moderation"
  },
{
    name: "HuggingFace Evaluate",
    url: "https://github.com/huggingface/evaluate",
    stars: "3k+",
    description: "Library for evaluating ML models and pipelines.",
    category: "Observability & Evaluations",
    features: ["Metrics", "Benchmarking", "Evaluation"],
    install: "pip install evaluate",
    useCase: "Evaluating ML model performance"
  },
{
    name: "HELM",
    url: "https://github.com/stanford-crfm/helm",
    stars: "2k+",
    description: "Holistic Evaluation of Language Models.",
    category: "Observability & Evaluations",
    features: ["Benchmarks", "Multiple dimensions", "Standardized"],
    install: "pip install crfm-helm",
    useCase: "Comprehensive LLM evaluation"
  },
{
    name: "BigCode Evaluation",
    url: "https://github.com/bigcode-project/bigcode-evaluation-harness",
    stars: "1k+",
    description: "Evaluation harness for code generation models.",
    category: "Observability & Evaluations",
    features: ["Code evaluation", "Multiple languages", "Execution"],
    install: "pip install bigcode-evaluation-harness",
    useCase: "Evaluating code generation"
  },
{
    name: "MT-Bench",
    url: "https://github.com/lm-sys/FastChat",
    stars: "38k+",
    description: "Multi-turn benchmark for evaluating chat models.",
    category: "Observability & Evaluations",
    features: ["Multi-turn", "Chat evaluation", "GPT-4 judge"],
    install: "pip install fschat",
    useCase: "Evaluating chat quality"
  },
{
    name: "AlpacaEval",
    url: "https://github.com/tatsu-lab/alpaca_eval",
    stars: "3k+",
    description: "Automatic evaluation of instruction-following models.",
    category: "Observability & Evaluations",
    features: ["Automatic", "Length-controlled", "GPT-4 judge"],
    install: "pip install alpaca-eval",
    useCase: "Evaluating instruction following"
  },
{
    name: "Llama Guard 3",
    url: "https://github.com/meta-llama/PurpleLlama",
    stars: "3k+",
    description: "Meta's safety model for classifying AI responses.",
    category: "Security & Guardrails",
    features: ["Safety classification", "Content moderation", "Open source"],
    install: "pip install llama-guard",
    useCase: "AI safety classification"
  },
{
    name: "PurpleLlama",
    url: "https://github.com/meta-llama/PurpleLlama",
    stars: "3k+",
    description: "Meta's set of tools for evaluating and improving LLM safety.",
    category: "Security & Guardrails",
    features: ["Safety tools", "Evaluation", "Benchmarks"],
    install: "Clone repo",
    useCase: "LLM safety evaluation"
  },
{
    name: "CyberSecEval",
    url: "https://github.com/meta-llama/PurpleLlama",
    stars: "3k+",
    description: "Benchmark for evaluating cybersecurity capabilities of LLMs.",
    category: "Security & Guardrails",
    features: ["Cybersecurity", "Benchmarks", "Safety"],
    install: "Clone repo",
    useCase: "Evaluating LLM cybersecurity"
  },
{
    name: "WildGuard",
    url: "https://github.com/allenai/wildguard",
    stars: "500+",
    description: "Prompt injection and jailbreak detection model.",
    category: "Security & Guardrails",
    features: ["Injection detection", "Jailbreak detection", "Open source"],
    install: "pip install wildguard",
    useCase: "Detecting prompt injection"
  },
{
    name: "Lakera Guard 2",
    url: "https://github.com/lakera-ai/guard",
    stars: "2k+",
    description: "Second generation prompt injection detector.",
    category: "Security & Guardrails",
    features: ["Injection detection", "PII detection", "Real-time"],
    install: "pip install lakera-guard",
    useCase: "Real-time prompt injection detection"
  },
{
    name: "Aegis Content Safety",
    url: "https://github.com/NVIDIA/aegis-content-safety-model",
    stars: "500+",
    description: "NVIDIA's content safety model.",
    category: "Security & Guardrails",
    features: ["Content safety", "Categories", "Open source"],
    install: "pip install aegis",
    useCase: "Content moderation for AI"
  },
{
    name: "Llama Guard v2",
    url: "https://github.com/meta-llama/PurpleLlama",
    stars: "3k+",
    description: "Updated safety classifier for AI outputs.",
    category: "Security & Guardrails",
    features: ["Safety", "Classification", "Open source"],
    install: "pip install llama-guard",
    useCase: "Classifying AI outputs for safety"
  },
{
    name: "Anthropic Model Spec",
    url: "https://github.com/anthropics",
    stars: "N/A",
    description: "Anthropic's specification for model behavior and safety.",
    category: "Security & Guardrails",
    features: ["Model behavior", "Safety spec", "Alignment"],
    install: "Documentation",
    useCase: "Understanding model safety alignment"
  },
{
    name: "Responsible AI Toolkit",
    url: "https://github.com/microsoft/responsible-ai-toolbox",
    stars: "2k+",
    description: "Microsoft's tools for responsible AI development.",
    category: "Security & Guardrails",
    features: ["Fairness", "Interpretability", "Error analysis"],
    install: "pip install raiwidgets",
    useCase: "Responsible AI development"
  },
{
    name: "Inference Time Scaling",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for scaling compute at inference time.",
    category: "AI Design Patterns & Architecture",
    features: ["Compute scaling", "Best-of-N", "Verification"],
    install: "Implementation-dependent",
    useCase: "Improving output quality with more compute"
  },
{
    name: "Toolformer",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for teaching LLMs to use tools autonomously.",
    category: "AI Design Patterns & Architecture",
    features: ["Tool learning", "Autonomous", "API calls"],
    install: "Implementation-dependent",
    useCase: "Teaching LLMs to use tools"
  },
{
    name: "Self-Consistency",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for improving reasoning with multiple samples.",
    category: "AI Design Patterns & Architecture",
    features: ["Multiple samples", "Majority voting", "Confidence"],
    install: "Implementation-dependent",
    useCase: "Improving reasoning accuracy"
  },
{
    name: "Chain-of-Verification",
    url: "https://github.com/nicepkg/gpt-runner",
    stars: "N/A",
    description: "Pattern for reducing hallucinations through verification.",
    category: "AI Design Patterns & Architecture",
    features: ["Verification", "Fact-checking", "Hallucination reduction"],
    install: "Implementation-dependent",
    useCase: "Reducing AI hallucinations"
  },
{
    name: "Observable Job Agent",
    url: "https://github.com/jamwithai/observable-job-agent",
    stars: "100+",
    description: "A production-grade job agent with full observability, tracing, and monitoring built in.",
    category: "AI Agents & Tools",
    features: ["Full observability", "Job orchestration", "Tracing & monitoring"],
    install: "git clone https://github.com/jamwithai/observable-job-agent",
    useCase: "Building observable AI agents with end-to-end monitoring"
  },
{
    name: "Production Agentic RAG Course",
    url: "https://github.com/jamwithai/production-agentic-rag-course",
    stars: "200+",
    description: "Course material for building production-grade agentic RAG systems with real-world patterns.",
    category: "Vector Databases & RAG",
    features: ["Agentic RAG patterns", "Production deployment", "Course material"],
    install: "git clone https://github.com/jamwithai/production-agentic-rag-course",
    useCase: "Learning production RAG with agent-based retrieval"
  },
{
    name: "Beginner Local RAG System",
    url: "https://github.com/jamwithai/beginner-local-rag-system",
    stars: "150+",
    description: "Step-by-step beginner guide for building a fully local RAG system with no cloud dependencies.",
    category: "Vector Databases & RAG",
    features: ["Fully local", "Beginner-friendly", "No cloud dependencies"],
    install: "git clone https://github.com/jamwithai/beginner-local-rag-system",
    useCase: "Getting started with local RAG for beginners"
  },
{
    name: "OpenDevOps",
    url: "https://github.com/skundu42/opendevops",
    stars: "500+",
    description: "Open-source DevOps platform with AI-powered automation for CI/CD, monitoring, and infrastructure.",
    category: "MLOps & Infra",
    features: ["AI-powered automation", "CI/CD integration", "Infrastructure management"],
    install: "git clone https://github.com/skundu42/opendevops",
    useCase: "Automating DevOps workflows with AI"
  },
{ name: "claude-cookbooks", owner: "anthropics", url: "https://github.com/anthropics/claude-cookbooks", stars: 49196, lang: "Jupyter Notebook", description: "A collection of notebooks/recipes showcasing effective ways of using Claude", category: "Prompting", features: ["Claude recipes", "Notebooks", "Best practices"], install: "Clone repo", useCase: "Learning effective Claude usage patterns" },
{ name: "anthropic-cookbook", owner: "anthropics", url: "https://github.com/anthropics/anthropic-cookbook", stars: 48435, lang: "Jupyter Notebook", description: "The Anthropic Cookbook: code and guides for building with Claude", category: "Prompting", features: ["Code guides", "Copy-paste snippets", "Tool use"], install: "Clone repo", useCase: "Building applications with Claude" },
{ name: "anthropic-sdk-python", owner: "anthropics", url: "https://github.com/anthropics/anthropic-sdk-python", stars: 2500, lang: "Python", description: "Official Python SDK for the Anthropic API", category: "AI Coding", features: ["Tool use", "Streaming", "Async support"], install: "pip install anthropic", useCase: "Building Python apps with Claude API" },
{ name: "anthropic-sdk-typescript", owner: "anthropics", url: "https://github.com/anthropics/anthropic-sdk-typescript", stars: 1800, lang: "TypeScript", description: "Official TypeScript SDK for the Anthropic API", category: "AI Coding", features: ["Type-safe", "Streaming", "Tool use"], install: "npm install @anthropic-ai/sdk", useCase: "Building TS/JS apps with Claude API" },
{ name: "courses", owner: "anthropics", url: "https://github.com/anthropics/courses", stars: 12000, lang: "Jupyter Notebook", description: "Anthropic's introductory course on building with Claude", category: "Prompting", features: ["Hands-on tutorials", "Progressive difficulty", "Real examples"], install: "Clone repo", useCase: "Learning to build with Claude from scratch" },
{ name: "lollms", owner: "ParisNeo", url: "https://github.com/ParisNeo/lollms", stars: 12500, lang: "Python", description: "Lord of Large Language Models — all-in-one AI gateway supporting 100+ LLMs, personas, RAG, code execution, and multi-modal tasks", category: "LLM Frameworks & Orchestrators", features: ["100+ LLMs", "Personas", "RAG", "Code execution", "Multi-modal"], install: "pip install lollms", useCase: "Unified AI gateway for chat, coding, RAG, and creative tasks" },
{ name: "stablediffusion", owner: "Stability-AI", url: "https://github.com/Stability-AI/stablediffusion", stars: 28500, lang: "Python", description: "Stable Diffusion — open-source text-to-image and image-to-image generation models by Stability AI", category: "Computer Vision & Multimodal", features: ["Text-to-image", "Image-to-image", "Inpainting", "Upscaling"], install: "pip install stability-sdk", useCase: "Generating and editing images with diffusion models" }
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
  { id: "security-guardrails", label: "Security & Guardrails", icon: "🛡️" },
  { id: "ai-coding", label: "AI Coding & Software Engineering", icon: "💻" },
  { id: "ai-web-apps", label: "AI Web Applications", icon: "🌐" },
  { id: "ai-mobile-apps", label: "AI Mobile Applications", icon: "📱" },
  { id: "spring-ai", label: "Spring AI & Enterprise", icon: "☕" },
  { id: "observability", label: "Observability & Evaluations", icon: "📊" },
  { id: "prompting", label: "Prompt Engineering & Fine-Tuning", icon: "📝" },
  { id: "design-patterns", label: "AI Design Patterns & Architecture", icon: "🏛️" }
];
