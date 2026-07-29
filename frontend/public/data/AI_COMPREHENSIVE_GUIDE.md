# AI COMPREHENSIVE REFERENCE GUIDE
## SG Community | LLMs | Agents | RAG | MCP | Python | Tools
### View in Notepad++ → Set Language to **Markdown** for rich colors

---

# SECTION 001: SG BUILDER/AI COMMUNITY — REDDIT THREAD
## Source: `r/singaporestartups` — "any small builder / ai communities in sg?" by jerrypolar

| Username | Role | What They Do/Offer | Contact / Link | Tech Stack | Space? |
|---|---|---|---|---|---|
| **jerrypolar (OP)** | Builder | Wants small consistent SG community | Organizing via DMs | AI tools, building small products | — |
| **natxwang** | Community Organizer | Discord (10 people), agents, meetup mid-May | DM for Discord invite | `Hermes`, smart gadgets, smart home | — |
| **kruzibit** | Homelab / Construction | Hermes orchestrator, AI Stack, RTX 3090 | — | `Hermes`, `Proxmox`, `Unraid`, `agent-reach`, `gbrain`, `mattpocock/skills`, `locallm`, `ComfyUI` | — |
| **Western-Kiwi6572** | AI Coder | AI codes 24/7 on project (not OClaw) | DM | AI coding agents | — |
| **Narrow_Context_5908** | Builder (non-tech) | Learning by building & breaking | DM | AI tools | — |
| **snapbookkevin** | Builder / Business | AI for business (CPF, Payroll) | [kevinchia.sg](https://kevinchia.sg) | AI tools | — |
| **Palantaard** | Options Trader | AI + trading interest | DM | AI, trading | — |
| **Bitter_Management_72** | B2B Marketing / GenAI Startup | Wants cafe meetup, community curation | DM for WhatsApp | B2B marketing, GenAI | — |
| **NerdyStonks** | Space Owner | Has B1 Industrial space | [dtio.app](https://dtio.app) | — | ✅ B1 Industrial |
| **Electrical-Pipe-9824** | Space Sponsor | Space at **Upper Aljunied** | DM | 10 web apps built | ✅ Upper Aljunied |
| **ghsg2808** | Retail Space Owner | Retail space for hosting | DM | — | ✅ Retail space |
| **Kedeweth** | Hardware / Homelab | Hardware, electronics, 3D printing, AI, homelab | DM | SWE, hardware, 3D printing | — |
| **xacattac** | iOS Developer | 1 published iOS app, 2nd in review | DM | iOS, AI | — |
| **Yag4mi** | Non-profit Organizer | Free workshops, no sales pitch | DM to join | Multiple events monthly | — |
| **Hitpayapp_** | Referral | Suggested Telegram AI group | `@claudesg` (Telegram) | — | — |
| **Aggressive-Air415** | Referral | Suggested Luma app for events | [luma.cm](https://luma.cm) | Claude Code, Codex, AI Builders | — |
| **Ashamed_Poet3865** | Referral | Suggested Growth Lab & SG Innovators | [growthlab.sg](https://www.growthlab.sg/) | — | — |
| **zacadammorrison** | LLM Philosophy | Hard LLM problems, SG AI adoption | DM | LLM philosophy | — |
| **gideonfip** | AI Workflow Builder | Automated workflows via agent Skills | DM | Content creation, agent Skills | — |

**🔗 Key Links from Thread:**
| Link | Description |
|---|---|
| [growthlab.sg](https://www.growthlab.sg/) | Growth Lab SG — community & events |
| [luma.cm](https://luma.cm) | Luma app — AI/tech events in SG |
| [luma.com/HermesNightIt](https://luma.com/HermesNightIt) | Hermes Night — Clarke Quay area event |
| [kevinchia.sg](https://kevinchia.sg) | Kevin Chia (snapbookkevin) website |
| [dtio.app](https://dtio.app) | NerdyStonks website |
| `@claudesg` (Telegram) | Telegram AI community |

---

# SECTION 002: LOCAL LLMs (Run on Your Hardware)

| Name | Type | Description | URL | Key Feature | Platform |
|---|---|---|---|---|---|
| **Ollama** | 🏆 Best Overall | Most popular local LLM runner, simple CLI | [ollama.com](https://ollama.com) | Model library, OpenAI-compatible API | Win/Mac/Linux |
| **LM Studio** | 🏆 Best GUI | Desktop app, discover & download models | [lmstudio.ai](https://lmstudio.ai) | GUI, HuggingFace integration, API | Win/Mac/Linux |
| **llama.cpp** | 🔧 Backend | Lightweight C++ LLM inference | [github](https://github.com/ggerganov/llama.cpp) | CPU-first, quantized models, many bindings | Win/Mac/Linux |
| **LocalAI** | 🏗️ Server | Drop-in OpenAI API replacement, Docker | [localai.io](https://localai.io) | Docker, multi-model, OpenAI API compatible | Linux/Docker |
| **vLLM** | ⚡ Performance | High-throughput LLM serving w/ PagedAttention | [github](https://github.com/vllm-project/vllm) | High throughput, continuous batching | Linux (CUDA) |
| **Text Gen WebUI** | 🖥️ Full UI | oobabooga — full-featured web UI | [github](https://github.com/oobabooga/text-generation-webui) | Multiple backends, LoRA, chat/instruct | Win/Mac/Linux |
| **koboldcpp** | 📦 Single File | Single-file llama.cpp wrapper | [github](https://github.com/LostRuins/koboldcpp) | No install, single exe, easy | Win/Mac/Linux |
| **GPT4All** | 💻 CPU-Friendly | Runs on CPU, no GPU needed | [gpt4all.io](https://gpt4all.io) | CPU optimized, privacy, M-series Mac | Win/Mac/Linux |
| **llamafile** | 📎 Portable | Mozilla — single-file executable | [github](https://github.com/Mozilla-Ocho/llamafile) | No deps, cross-platform, run any model | Win/Mac/Linux |
| **Jan** | 🔒 Privacy-First | Desktop AI assistant, offline-first | [jan.ai](https://jan.ai) | Offline, extensible, API compatible | Win/Mac/Linux |
| **Msty** | ✨ Beautiful GUI | Polished local LLM interface | [msty.app](https://msty.app) | Multi-model, RAG, easy setup | Win/Mac |
| **Faraday** | 🎭 Character AI | Local character/roleplay LLMs | [faraday.dev](https://faraday.dev) | Character AI locally, private | Win/Mac/Linux |
| **ExLlamaV2** | 🚀 GPU Infer | Optimized Llama inference | [github](https://github.com/turboderp/exllamav2) | Fast GPU, 4-bit quantization | Linux (CUDA) |
| **AutoGPTQ** | 🔢 Quantization | GPTQ quantization for LLMs | [github](https://github.com/AutoGPTQ/AutoGPTQ) | 4-bit, memory efficient | Linux (CUDA) |
| **DeepSpeed** | 🏢 Enterprise | Microsoft deep learning optimization | [github](https://github.com/microsoft/DeepSpeed) | ZeRO, MoE, offloading, inference | Linux (CUDA) |
| **LLaMA-Factory** | 🎓 Fine-tuning | Fine-tune LLMs easily | [github](https://github.com/hiyouga/LLaMA-Factory) | LoRA/QLoRA, multi-model, web UI | Linux (CUDA) |
| **OpenLLM** | ☁️ Serving | BentoML production serving | [github](https://github.com/bentoml/OpenLLM) | Cloud-like serving, microservices | Linux/Mac |
| **Candle** | 🦀 Rust | Rust-based ML framework | [github](https://github.com/huggingface/candle) | No Python needed, HF Hub integration | Win/Mac/Linux |
| **LocalLM** | 🔀 Bridge | Reddit-mentioned, OpenAI-compatible bridge | — | Router/bridge to local models | Cross-platform |

---

# SECTION 003: CLOUD LLM PROVIDERS (API-Based)

| Provider | Model(s) | Context | Key Feature | Pricing (per 1M tokens) | API |
|---|---|---|---|---|---|
| **OpenAI** | GPT-4o, GPT-4 Turbo, o1 | 128K | Multimodal, reasoning, assistants API | $2.50–$60 | ✅ |
| **Anthropic** | Claude 3.5 Sonnet, Opus, Haiku | 200K | Best coding, **MCP** support, safety | $0.25–$75 | ✅ |
| **Google** | Gemini 1.5 Pro/Flash, 2.0 Flash | **2M tokens** | Largest context, multimodal, **free tier** | $0.075–$10.50 | ✅ |
| **Mistral AI** | Large, Small, Nemo | 32K–128K | Multilingual, open-weight | $2–$8 | ✅ |
| **Cohere** | Command R+, Command R | 128K | **RAG-optimized**, tool use, enterprise | $5–$15 | ✅ |
| **DeepSeek** | V2/V3, R1 | 128K | Strong reasoning, cheap, open-weight | ~$0.27–$1.10 | ✅ |
| **xAI (Grok)** | Grok 2/3 | 128K | Real-time X/Twitter data | X Premium $16/mo | ✅ |
| **Perplexity** | Sonar Pro | — | **Search-augmented**, citations | $20/mo Pro | ✅ |
| **Together AI** | Multi-model API | Varies | Fast open-source model inference | Pay-as-you-go | ✅ |
| **Fireworks AI** | Multi-model API | Varies | Low latency, prompt caching | Pay-as-you-go | ✅ |
| **Groq** | Multi-model API | Varies | **Ultra-fast** LPU hardware | Free tier + Paid | ✅ |
| **Azure OpenAI** | GPT-4, etc. | Varies | **Enterprise security**, SLA, VPC | Enterprise | ✅ |
| **AWS Bedrock** | Multi-model | Varies | **AWS-native**, enterprise security | Enterprise | ✅ |
| **GCP Vertex AI** | Gemini, etc. | Varies | **GCP-native**, enterprise | Enterprise | ✅ |
| **Replicate** | Open-source models | Varies | Easy API for many models | Pay-per-run | ✅ |
| **Modal** | Custom models | Varies | **Serverless GPU**, Python-native | Per-second | ✅ |

---

# SECTION 004: DESKTOP LLM APPLICATIONS

| App | Best For | Key Feature | URL | Price | OS |
|---|---|---|---|---|---|
| **LM Studio** | 🥇 Overall | GUI model browser, HF Hub | [lmstudio.ai](https://lmstudio.ai) | Free | W/M/L |
| **GPT4All** | 🥇 CPU Only | No GPU needed, local RAG | [gpt4all.io](https://gpt4all.io) | Free | W/M/L |
| **Ollama + Open WebUI** | 🥇 Self-Hosted | Beautiful web UI, multi-user | [openwebui.com](https://openwebui.com) | Free | W/M/L (Docker) |
| **Jan** | 🔒 Privacy | Offline-first, extensible | [jan.ai](https://jan.ai) | Free | W/M/L |
| **Msty** | ✨ Aesthetics | Polished, multi-model, RAG | [msty.app](https://msty.app) | Free/Paid | W/M |
| **Faraday** | 🎭 Roleplay | Character AI locally, private | [faraday.dev](https://faraday.dev) | Free | W/M/L |
| **Big-AGI** | 🛠️ Power User | Multi-provider, personas, voice | [big-agi.com](https://big-agi.com) | Free/Paid | Web/Desktop |
| **ChatGPT Desktop** | 💬 Official | GPT-4o, voice, multimodal | [chatgpt.com](https://chatgpt.com) | Free/Paid | W/M |
| **Claude Desktop** | 💬 Official | Claude 3.5, **MCP**, projects | [claude.ai](https://claude.ai) | Free/Paid | W/M |

---

# SECTION 005: FREE AI MODELS (Open Weights)

| Model | Params | Type | License | Best For | HuggingFace |
|---|---|---|---|---|---|
| **Llama 3.1 8B** | 8B | Language | Llama 3.1 | Chat, coding, assistant | ✅ |
| **Llama 3.1 70B** | 70B | Language | Llama 3.1 | Advanced reasoning | ✅ |
| **Llama 3.1 405B** | 405B | Language | Llama 3.1 | **SOTA open-weight**, enterprise | ✅ |
| **Llama 3.2 1B/3B** | 1B–3B | Language | Llama 3.2 | **Mobile**, edge devices | ✅ |
| **Llama 3.2 Vision** | 11B/90B | Multimodal | Llama 3.2 | Image + text tasks | ✅ |
| **Mistral 7B** | 7B | Language | Apache 2.0 | Chat, coding, general | ✅ |
| **Mixtral 8x7B** | 46B (MoE) | Language | Apache 2.0 | High perf, efficient | ✅ |
| **Mixtral 8x22B** | 141B (MoE) | Language | Apache 2.0 | Advanced reasoning | ✅ |
| **Mistral Nemo 12B** | 12B | Language | Apache 2.0 | Multilingual, coding | ✅ |
| **Gemma 2 2B/9B/27B** | 2B–27B | Language | Gemma | General purpose (Google) | ✅ |
| **Phi-3 Mini/Small/Medium** | 3.8B–14B | Language | MIT | Mobile, edge, general (MS) | ✅ |
| **Qwen2.5 0.5B–72B** | 0.5B–72B | Language | Apache 2.0 | **Best range**, multilingual, code | ✅ |
| **DeepSeek Coder V2** | 236B (MoE) | Code | DeepSeek | **Code-specialized** | ✅ |
| **Yi 1.5 6B/34B** | 6B–34B | Language | Apache 2.0 | General (01.AI) | ✅ |
| **DBRX** | 132B (MoE) | Language | Databricks | Advanced reasoning | ✅ |
| **Solar 10.7B** | 10.7B | Language | Apache 2.0 | General, Korean (Upstage) | ✅ |
| **Zephyr 7B** | 7B | Language | MIT | Fine-tuned chat (HF) | ✅ |
| **Falcon2 11B** | 11B | Language | Apache 2.0 | Enterprise (TII) | ✅ |
| **OLMo 1B–7B** | 1B–7B | Language | Apache 2.0 | **Fully open**, research (AI2) | ✅ |
| **Granite 3B/8B** | 3B–8B | Language | Apache 2.0 | Enterprise (IBM) | ✅ |

---

# SECTION 006: PREMIUM AI MODELS (Commercial / Paid)

| Model | Provider | Context | Key Strength | Input Price/1M | Output Price/1M |
|---|---|---|---|---|---|
| **GPT-4o** | OpenAI | 128K | 🏆 **Flagship multimodal** | $2.50 | $10.00 |
| **GPT-4 Turbo** | OpenAI | 128K | Text, function calling | $10.00 | $30.00 |
| **GPT-4o Mini** | OpenAI | 128K | 🏆 **Best value** | $0.15 | $0.60 |
| **o1** | OpenAI | 128K | 🏆 **Deep reasoning** | $15.00 | $60.00 |
| **Claude 3.5 Sonnet** | Anthropic | 200K | 🏆 **Best coding + MCP** | $3.00 | $15.00 |
| **Claude 3 Opus** | Anthropic | 200K | Deep analysis | $15.00 | $75.00 |
| **Claude 3 Haiku** | Anthropic | 200K | Fast & cheap | $0.25 | $1.25 |
| **Gemini 1.5 Pro** | Google | **2M** | 🏆 **Largest context** | $3.50 | $10.50 |
| **Gemini 1.5 Flash** | Google | 1M | Fast & cheap | $0.075 | $0.30 |
| **Gemini 2.0 Flash** | Google | 1M | Latest, live streaming | $0.10 | $0.40 |
| **Mistral Large** | Mistral AI | 128K | 🏆 **Multilingual** | $2.00 | $8.00 |
| **Command R+** | Cohere | 128K | 🏆 **Best RAG** | $5.00 | $15.00 |
| **DeepSeek V3** | DeepSeek | 128K | Strong, cheap, open | ~$0.27 | ~$1.10 |
| **Grok 2/3** | xAI | 128K | Real-time X data | X Premium ($16/mo) |

---

# SECTION 007: FREE AI TOOLS & FRAMEWORKS (Open Source)

| Tool | Category | Description | URL | Stars |
|---|---|---|---|---|
| **Ollama** | Local LLM Runner | Easiest local LLM runner | [ollama.com](https://ollama.com) | ⭐ 100K+ |
| **LM Studio** | Local LLM GUI | Desktop model manager | [lmstudio.ai](https://lmstudio.ai) | Popular |
| **llama.cpp** | LLM Backend | C++ native inference | [github](https://github.com/ggerganov/llama.cpp) | ⭐ 70K+ |
| **vLLM** | LLM Serving | High-throughput serving | [github](https://github.com/vllm-project/vllm) | ⭐ 45K+ |
| **LangChain** | RAG/Agent Framework | LLM application framework | [github](https://github.com/langchain-ai/langchain) | ⭐ 100K+ |
| **LlamaIndex** | RAG Framework | Data framework for LLMs | [github](https://github.com/run-llama/llama_index) | ⭐ 38K+ |
| **LangGraph** | Agent Framework | Stateful multi-agent orchestration | [github](https://github.com/langchain-ai/langgraph) | ⭐ 12K+ |
| **CrewAI** | Agent Framework | Multi-agent collaboration | [github](https://github.com/crewAIInc/crewAI) | ⭐ 25K+ |
| **AutoGen** | Agent Framework | MS multi-agent conversations | [github](https://github.com/microsoft/autogen) | ⭐ 37K+ |
| **Haystack** | RAG Pipeline | NLP pipeline framework (deepset) | [github](https://github.com/deepset-ai/haystack) | ⭐ 18K+ |
| **Dify** | AI Platform | Open-source LLM app platform | [github](https://github.com/langgenius/dify) | ⭐ 55K+ |
| **Flowise** | Low-Code AI | Drag-drop LLM app builder | [github](https://github.com/FlowiseAI/Flowise) | ⭐ 32K+ |
| **ChromaDB** | Vector DB | Lightweight embedding database | [github](https://github.com/chroma-core/chroma) | ⭐ 17K+ |
| **Qdrant** | Vector DB | High-performance vector search | [github](https://github.com/qdrant/qdrant) | ⭐ 23K+ |
| **Weaviate** | Vector DB | GraphQL vector database | [github](https://github.com/weaviate/weaviate) | ⭐ 12K+ |
| **FAISS** | Vector Search | Facebook similarity search | [github](https://github.com/facebookresearch/faiss) | ⭐ 32K+ |
| **Gradio** | Python UI | Quick ML web demos | [github](https://github.com/gradio-app/gradio) | ⭐ 35K+ |
| **Streamlit** | Python UI | Data app framework | [github](https://github.com/streamlit/streamlit) | ⭐ 38K+ |
| **Chainlit** | Python AI UI | Chat UI for LLM apps | [github](https://github.com/Chainlit/chainlit) | ⭐ 8K+ |
| **FastAPI** | Python API | High-performance async Python API | [github](https://github.com/fastapi/fastapi) | ⭐ 80K+ |
| **Semantic Kernel** | Agent SDK | MS AI orchestration (Python/.NET/Java) | [github](https://github.com/microsoft/semantic-kernel) | ⭐ 23K+ |
| **Transformers (HF)** | Model Library | SOTA transformer models | [github](https://github.com/huggingface/transformers) | ⭐ 140K+ |
| **PyTorch** | ML Framework | Meta deep learning | [github](https://github.com/pytorch/pytorch) | ⭐ 85K+ |
| **Open WebUI** | LLM UI | Beautiful Ollama interface | [github](https://github.com/open-webui/open-webui) | ⭐ 50K+ |
| **LangFuse** | LLM Observability | Open-source LLM monitoring | [github](https://github.com/langfuse/langfuse) | ⭐ 8K+ |
| **Guardrails AI** | LLM Safety | Input/output guardrails | [github](https://github.com/guardrails-ai/guardrails) | ⭐ 4K+ |
| **Tailscale** (via) | Networking | Secure tunnel for self-hosted AI | [tailscale.com](https://tailscale.com) | Popular |

---

# SECTION 008: PREMIUM AI TOOLS & PLATFORMS (Paid)

| Tool | Category | Description | URL | Price |
|---|---|---|---|---|
| **OpenAI Platform** | LLM API | GPT-4o, DALL-E, Whisper, TTS | [platform.openai.com](https://platform.openai.com) | Pay-as-you-go |
| **Anthropic Console** | LLM API | Claude 3.5, MCP, prompt playground | [console.anthropic.com](https://console.anthropic.com) | Pay-as-you-go |
| **Google AI Studio** | LLM API | Gemini, 2M context, free tier | [aistudio.google.com](https://aistudio.google.com) | Free + Paid |
| **AWS Bedrock** | Enterprise LLM | Multi-model, VPC, security | [aws.amazon.com/bedrock](https://aws.amazon.com/bedrock) | Enterprise |
| **Azure OpenAI** | Enterprise LLM | MS-hosted OpenAI, SLAs | [azure.microsoft.com](https://azure.microsoft.com/products/ai-services) | Enterprise |
| **LangSmith** | LLM Observability | Tracing, evals, datasets | [smith.langchain.com](https://smith.langchain.com) | Free tier + Paid |
| **Weights & Biases** | ML Platform | Experiment tracking, prompts | [wandb.ai](https://wandb.ai) | Free + Enterprise |
| **Pinecone** | Vector DB | Serverless vector database | [pinecone.io](https://pinecone.io) | Free tier + Paid |
| **Weaviate Cloud** | Vector DB | Managed, hybrid search | [weaviate.io/cloud](https://weaviate.io/cloud) | Free + Paid |
| **Qdrant Cloud** | Vector DB | Managed vector search | [qdrant.io/cloud](https://qdrant.io/cloud) | Free + Paid |
| **Cursor** | AI IDE | AI-first code editor | [cursor.sh](https://cursor.sh) | Free + Pro $20/mo |
| **GitHub Copilot** | AI Coding | AI pair programmer | [github.com/features/copilot](https://github.com/features/copilot) | Free + $10/mo |
| **Claude Code** | AI Coding (Terminal) | Agentic coding, MCP | [anthropic.com](https://anthropic.com) | Via Claude API |
| **Perplexity Pro** | AI Search | Search-augmented assistant | [perplexity.com](https://perplexity.com) | $20/mo |
| **V0 by Vercel** | AI UI Gen | Generate React UI from prompts | [v0.dev](https://v0.dev) | Free + Paid |
| **Bolt.new** | AI Fullstack | Browser-based app builder | [bolt.new](https://bolt.new) | Free + Paid |
| **Replit Agent** | AI Coding | In-browser AI app builder | [replit.com](https://replit.com) | Free + Paid |

---

# SECTION 009: AI AGENT FRAMEWORKS (Detailed)

## 🏆 Top Tier

| Framework | Creator | Lang | Key Innovation | GitHub | Stars | Best For |
|---|---|---|---|---|---|---|
| **LangGraph** | LangChain | Python, JS | Stateful graph-based agent orchestration, cycles, persistence | [↗](https://github.com/langchain-ai/langgraph) | ⭐12K | Complex multi-step agents |
| **CrewAI** | CrewAI | Python | Role-based agents, task delegation, crew concept | [↗](https://github.com/crewAIInc/crewAI) | ⭐25K | Team of agents working together |
| **AutoGen** | Microsoft | Python, .NET | Multi-agent conversation, code execution | [↗](https://github.com/microsoft/autogen) | ⭐37K | Research, enterprise agents |
| **Semantic Kernel** | Microsoft | Python, .NET, Java | Planners, plugins, memory, enterprise-ready | [↗](https://github.com/microsoft/semantic-kernel) | ⭐23K | Enterprise .NET apps |
| **OpenAI Agents SDK** | OpenAI | Python | Handoffs, guardrails, tracing, official | [↗](https://github.com/openai/openai-agents-python) | ⭐15K+ | OpenAI-native agents |
| **Agno (Phidata)** | Agno | Python | Multimodal agents, knowledge, tools | [↗](https://github.com/agno-org/agno) | ⭐18K+ | Full-stack agent apps |
| **Dify** | LangGenius | Python/TS | Visual agent builder, RAG, workflow | [↗](https://github.com/langgenius/dify) | ⭐55K | No-code/low-code agents |
| **Flowise** | Flowise | TypeScript | Drag-drop AI agent builder | [↗](https://github.com/FlowiseAI/Flowise) | ⭐32K | Visual AI workflow builder |

## 🛠️ Specialist / Niche

| Framework | Creator | Lang | Key Innovation | GitHub | Stars |
|---|---|---|---|---|---|
| **Haystack** | deepset | Python | Modular pipelines with agent capabilities | [↗](https://github.com/deepset-ai/haystack) | ⭐18K |
| **Rasa** | Rasa | Python | NLU, dialogue management, custom actions | [↗](https://github.com/RasaHQ/rasa) | ⭐19K |
| **SuperAgent** | Homanp | Python/JS | Open-source agent platform with RAG + tools | [↗](https://github.com/homanp/superagent) | ⭐5K+ |
| **AutoGPT** | Significant-Gravitas | Python | Autonomous GPT-4 agents, internet access | [↗](https://github.com/Significant-Gravitas/AutoGPT) | ⭐170K+ |
| **MetaGPT** | Geekan | Python | Multi-agent simulating software company | [↗](https://github.com/geekan/MetaGPT) | ⭐45K+ |
| **ChatDev** | OpenBMB | Python | Collaborative software dev agents | [↗](https://github.com/OpenBMB/ChatDev) | ⭐26K+ |
| **BabyAGI** | Yohei Nakajima | Python | Task-driven autonomous agent (original) | [↗](https://github.com/yoheinakajima/babyagi) | ⭐20K+ |
| **AgentGPT** | Reworkd | TypeScript | Browser-based autonomous agent deployment | [↗](https://agentgpt.reworkd.ai) | ⭐32K+ |
| **n8n** | n8n | TypeScript | Workflow automation with AI agent nodes | [↗](https://github.com/n8n-io/n8n) | ⭐55K+ |

---

# SECTION 010: RAG TOOLS & FRAMEWORKS

## 🏆 Core RAG Frameworks

| Framework | Language | Description | URL | Stars | Specialty |
|---|---|---|---|---|---|
| **LangChain** | Python, JS | Most popular LLM-RAG framework | [↗](https://github.com/langchain-ai/langchain) | ⭐100K+ | Document loaders, retrievers, chains |
| **LlamaIndex** | Python | Data framework for LLM apps | [↗](https://github.com/run-llama/llama_index) | ⭐38K+ | Index structures, advanced retrieval |
| **Haystack** | Python | NLP pipeline framework | [↗](https://github.com/deepset-ai/haystack) | ⭐18K+ | Modular RAG pipelines |
| **RAGatouille** | Python | RAG training & inference | [↗](https://github.com/AnswerDotAI/RAGatouille) | ⭐3K+ | ColBERT re-ranker |

## 🏗️ RAG Platforms

| Platform | Description | URL | Key Feature |
|---|---|---|---|
| **Dify** | Open-source LLM + RAG platform | [↗](https://github.com/langgenius/dify) | Visual RAG pipeline, document ingestion |
| **R2R** | Production-ready RAG API server | [↗](https://github.com/SciPhi-AI/R2R) | REST API, multi-model, user management |
| **QAnything** | Enterprise RAG system | [↗](https://github.com/netease-youdao/QAnything) | Multi-file, cross-lingual |
| **MaxKB** | Knowledge base RAG system | [↗](https://github.com/1Panel-dev/MaxKB) | RAG-based Q&A, easy deploy |
| **Verba** | Weaviate RAG UI | [↗](https://github.com/weaviate/Verba) | Golden query, RAG with Weaviate |
| **AnythingLLM** | All-in-one RAG desktop | [↗](https://github.com/Mintplex-Labs/anything-llm) | Desktop RAG, multi-model |

## 🗄️ Vector Databases for RAG

| Name | Type | Scalability | URL | Best For |
|---|---|---|---|---|
| **Pinecone** | ☁️ Managed SaaS | 🏆 Excellent | [pinecone.io](https://pinecone.io) | Production, serverless |
| **Weaviate** | ☁️/🐳 Self-hosted | Excellent | [weaviate.io](https://weaviate.io) | Hybrid search, GraphQL |
| **Qdrant** | ☁️/🐳 Self-hosted | Excellent | [qdrant.io](https://qdrant.io) | High perf filtering, Rust |
| **ChromaDB** | 📦 Embedded | Lightweight | [trychroma.com](https://www.trychroma.com) | Dev, small apps, easy |
| **Milvus** | ☁️/🐳 Distributed | 🏆 Massive scale | [milvus.io](https://milvus.io) | Billion-scale, GPU indexing |
| **FAISS** | 📦 Library | CPU/GPU | [github](https://github.com/facebookresearch/faiss) | Fast prototyping, research |
| **pgvector** | 📦 Postgres Ext | Good | [github](https://github.com/pgvector/pgvector) | PostgreSQL users, ACID |
| **Redis Stack** | ☁️/🐳 In-memory | Fast | [redis.io/stack](https://redis.io/stack) | Caching + vector, low latency |
| **Elasticsearch** | ☁️/🐳 Distributed | Excellent | [elastic.co](https://elastic.co/search-labs) | Full-text + vector hybrid |
| **LanceDB** | 📦 Embedded | Serverless | [lancedb.github.io](https://lancedb.github.io/lancedb) | Multi-modal, Python-native |

## 🚀 RAG API Providers

| Provider | Features | URL | Pricing |
|---|---|---|---|
| **Cohere RAG** | Command R+, tool use, citations | [cohere.com/rag](https://cohere.com/rag) | Free tier + Paid |
| **Azure AI Search** | Hybrid + semantic reranking | [azure.microsoft.com](https://azure.microsoft.com/products/ai-search) | Enterprise |
| **Canopy (Pinecone)** | Pinecone-native RAG | [github](https://github.com/pinecone-io/canopy) | Free (Open Source) |
| **Jina AI** | Embeddings, Reranker, Reader | [jina.ai](https://jina.ai) | Free tier + Paid |

---

# SECTION 011: MCP — MODEL CONTEXT PROTOCOL (By Anthropic)

## 🔷 Core Protocol

| Component | Description | URL |
|---|---|---|
| **MCP Specification** | Standard protocol for LLM-tool integration | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **MCP Python SDK** | Build MCP servers/clients in Python | [github](https://github.com/modelcontextprotocol/python-sdk) |
| **MCP TypeScript SDK** | Build MCP servers/clients in TypeScript | [github](https://github.com/modelcontextprotocol/typescript-sdk) |
| **MCP Java SDK** | Build MCP servers/clients in Java | [github](https://github.com/modelcontextprotocol/java-sdk) |
| **MCP Kotlin SDK** | Build MCP servers/clients in Kotlin | [github](https://github.com/modelcontextprotocol/kotlin-sdk) |

## 🔷 Official MCP Servers

| Server | What It Does | Language |
|---|---|---|
| **Filesystem** | Read/write files, directory operations | TypeScript |
| **GitHub** | Repos, issues, PRs, code search | TypeScript |
| **Slack** | Messages, channels, search | TypeScript |
| **PostgreSQL** | SQL queries, schema exploration | TypeScript |
| **SQLite** | SQL queries, database tools | TypeScript |
| **Browser (Puppeteer)** | Web scraping, navigation, screenshots | TypeScript |
| **Memory** | Knowledge graph, persistent memory | TypeScript |
| **Brave Search** | Web + local search via Brave | TypeScript |
| **EverArt** | AI image generation | TypeScript |
| **Sequential Thinking** | Structured step-by-step reasoning | TypeScript |

## 🔷 MCP Tools

| Tool | Purpose | URL |
|---|---|---|
| **MCP Inspector** | Debug MCP servers and clients | [github](https://github.com/modelcontextprotocol/inspector) |
| **Claude Desktop MCP** | Connect MCP servers to Claude Desktop | [claude.ai](https://claude.ai) |
| **MCP Client Template** | Quick start for MCP clients | [github](https://github.com/modelcontextprotocol/client-template) |

---

# SECTION 012: LANGCHAIN & LANGGRAPH ECOSYSTEM

| Component | Type | Description | URL | Key Feature |
|---|---|---|---|---|
| **LangChain Core** | Foundation | Core abstractions: chains, tools, agents | [github](https://github.com/langchain-ai/langchain) | LLM wrapper, tool integration |
| **LangChain Community** | Extensions | Third-party model providers, vector stores | [PyPI](https://pypi.org/project/langchain-community/) | 100+ integrations |
| **LangChain Partners** | Extensions | Official partner integrations | [docs](https://python.langchain.com/docs/integrations/providers/) | Anthropic, OpenAI, Cohere |
| **LangGraph** | 🏆 Agents | Stateful agent orchestration | [github](https://github.com/langchain-ai/langgraph) | Graph-based, cycles, persistence |
| **LangGraph Studio** | Visual IDE | Desktop visual LangGraph editor | [github](https://github.com/langchain-ai/langgraph-studio) | Visual graph debugging |
| **LangServe** | API Server | Deploy LangChain as REST API | [github](https://github.com/langchain-ai/langserve) | Auto REST API from chains |
| **LangSmith** | 🔍 Observability | Debug, test, monitor LLM apps | [smith.langchain.com](https://smith.langchain.com) | Tracing, evals, datasets |
| **LangGraph Platform** | ☁️ Cloud | Hosted LangGraph agent deployment | [langchain.ai](https://langchain.ai) | Serverless agent hosting |
| **LangChain Templates** | Starter | Ready-made project templates | [github](https://github.com/langchain-ai/langchain/tree/master/templates) | Chat, RAG, agents starters |

---

# SECTION 013: PROMPT ENGINEERING & MONITORING

## 🎯 Prompt Management & Testing

| Tool | Type | Key Feature | URL | Pricing |
|---|---|---|---|---|
| **LangSmith** | 🔍 Platform | Traces, evals, playground, datasets | [smith.langchain.com](https://smith.langchain.com) | Free + Paid |
| **PromptLayer** | 📊 Tracking | Prompt logging, version control | [promptlayer.com](https://promptlayer.com) | Free tier + Paid |
| **PromptPerfect** | 🧪 Optimization | Auto-optimize prompts, A/B test | [promptperfect.jina.ai](https://promptperfect.jina.ai) | Free + Paid |
| **PromptHub** | 👥 Collab | Team prompt collaboration | [prompthub.us](https://prompthub.us) | Free tier + Paid |
| **Agenta** | 🏗️ Open-source | Prompt versioning, eval, LLM apps | [github](https://github.com/Agenta-AI/agenta) | Free (Open Source) |
| **promptfoo** | 🧪 CLI Eval | Red teaming, regression, eval CLI | [github](https://github.com/promptfoo/promptfoo) | Free (Open Source) |
| **OpenAI Evals** | 📏 Evaluation | Official evaluation framework | [github](https://github.com/openai/evals) | Free (Open Source) |

## 👁️ LLM Observability & Monitoring

| Tool | Type | Key Feature | URL | Pricing |
|---|---|---|---|---|
| **LangFuse** | 🏆 Open-source | Tracing, evals, prompt mgmt, cost tracking | [github](https://github.com/langfuse/langfuse) | Free + Cloud ($) |
| **Arize Phoenix** | 🔍 Platform | LLM tracing, embeddings, eval | [github](https://github.com/Arize-AI/phoenix) | Free + Cloud ($) |
| **Weights & Biases** | 📊 Platform | Experiment tracking, prompt management | [wandb.ai](https://wandb.ai) | Free tier + Enterprise |
| **Helicone** | 🔧 Proxy | LLM request/response logging + caching | [github](https://github.com/Helicone/helicone) | Free + Paid |
| **Portkey** | 🚦 Gateway | LLM API gateway, fallback, cache | [portkey.ai](https://portkey.ai) | Free + Paid |
| **TruLens** | 📏 Eval | Feedback functions, RAG evaluation | [github](https://github.com/truera/trulens) | Free (Open Source) |

## 🛡️ Guardrails & Safety

| Tool | Type | Key Feature | URL | Pricing |
|---|---|---|---|---|
| **Guardrails AI** | 🏆 Open | Structured output, validation, corrections | [github](https://github.com/guardrails-ai/guardrails) | Free (Open Source) |
| **NeMo Guardrails** | 🔒 NVIDIA | Dialogue guardrails, safety alignment | [github](https://github.com/NVIDIA/NeMo-Guardrails) | Free (Open Source) |
| **Giskard** | 🧪 Testing | LLM/ML vulnerability scanning | [github](https://github.com/Giskard-AI/giskard) | Free (Open Source) |

---

# SECTION 014: VECTOR DATABASES (Comparison)

| Name | Type | Deployment | Query Type | Scalability | Speed | Price |
|---|---|---|---|---|---|---|
| **Pinecone** | ☁️ SaaS | Fully managed | Dense vector, hybrid | 🏆 Excellent | 🏆 Fast | Free + Paid |
| **Weaviate** | 🐳 Open/☁️ | Self-hosted + cloud | Dense, sparse, hybrid | Excellent | Fast | Free + Cloud |
| **Qdrant** | 🐳 Open/☁️ | Self-hosted + cloud | Dense + sparse, filters | Excellent | 🏆 Very Fast | Free + Cloud |
| **ChromaDB** | 📦 Embedded | Python lib | Dense vector | Lightweight | Moderate | Free (Open) |
| **Milvus** | 🐳 Open/☁️ | Self-hosted + Zilliz | Dense, hybrid, GPU | 🏆 Massive | 🏆 Very Fast | Free + Cloud |
| **FAISS** | 📦 Library | Embedded | Dense vector | Library | 🏆 Very Fast | Free (Open) |
| **pgvector** | 📦 PG Ext | PostgreSQL | Dense vector | Good | Moderate | Free (Open) |
| **Elasticsearch** | 🐳 Open/☁️ | Self-hosted + cloud | Full-text + dense | Excellent | Fast | Free + Cloud |
| **Redis Stack** | 🐳 Open/☁️ | Self-hosted + cloud | Dense + full-text | Good | 🏆 Very Fast | Free + Cloud |
| **LanceDB** | 📦 Embedded | Python/JS | Dense, multi-modal | Serverless | Fast | Free (Open) |
| **Vespa** | 🐳 Open | Self-hosted (K8s) | Hybrid, ML inference | Excellent | Fast | Free (Open) |
| **Vald** | 🐳 Open | Kubernetes | Dense, auto-indexing | Excellent | Fast | Free (Open) |

---

# SECTION 015: PYTHON AI/ML ECOSYSTEM

## 🏆 Core Libraries

| Library | Purpose | URL | Stars | Install |
|---|---|---|---|---|
| **PyTorch** | Deep learning framework (Meta) | [pytorch.org](https://pytorch.org) | ⭐85K+ | `pip install torch` |
| **TensorFlow** | Deep learning framework (Google) | [tensorflow.org](https://tensorflow.org) | ⭐188K+ | `pip install tensorflow` |
| **Transformers (HF)** | SOTA model zoo (300K+ models) | [github](https://github.com/huggingface/transformers) | ⭐140K+ | `pip install transformers` |
| **JAX** | Accelerated array computing | [jax.readthedocs.io](https://jax.readthedocs.io) | ⭐31K+ | `pip install jax` |
| **Diffusers (HF)** | Image/video generation models | [github](https://github.com/huggingface/diffusers) | ⭐27K+ | `pip install diffusers` |

## ⚡ Inference & Optimization

| Library | Purpose | URL | Key Feature |
|---|---|---|---|
| **vLLM** | High-throughput LLM serving | [github](https://github.com/vllm-project/vllm) | PagedAttention, continuous batching |
| **TGI (HF)** | Text Generation Inference server | [github](https://github.com/huggingface/text-generation-inference) | Production HF model serving |
| **DeepSpeed (MS)** | Deep learning optimization | [github](https://github.com/microsoft/DeepSpeed) | ZeRO, MoE, offloading |
| **Flash Attention** | Fast & memory-efficient attention | [github](https://github.com/Dao-AILab/flash-attention) | 2x+ speedup for transformer training |
| **xFormers (Meta)** | Transformer optimization | [github](https://github.com/facebookresearch/xformers) | Memory-efficient, flexible attention |
| **bitsandbytes** | 4-bit/8-bit model quantization | [github](https://github.com/bitsandbytes-foundation/bitsandbytes) | QLoRA support, NF4 |
| **AWQ** | Activation-aware weight quantization | [github](https://github.com/mit-han-lab/awq) | Hardware-efficient 4-bit |
| **AutoGPTQ** | GPTQ quantization | [github](https://github.com/AutoGPTQ/AutoGPTQ) | Efficient 4-bit inference |

## 🎓 Fine-tuning & Training

| Library | Purpose | URL | Key Feature |
|---|---|---|---|
| **PeFT (HF)** | Parameter-efficient fine-tuning | [github](https://github.com/huggingface/peft) | LoRA, QLoRA, AdaLoRA, Prompt Tuning |
| **TRL (HF)** | RL for transformers | [github](https://github.com/huggingface/trl) | PPO, DPO, SFT, reward modeling |
| **Accelerate (HF)** | Multi-GPU/TPU training | [github](https://github.com/huggingface/accelerate) | CPU/GPU/TPU, ZeRO, mixed precision |
| **LLaMA-Factory** | Easy LLM fine-tuning | [github](https://github.com/hiyouga/LLaMA-Factory) | Web UI, LoRA/QLoRA |

## 📊 Data & ML

| Library | Purpose | URL | Core Feature |
|---|---|---|---|
| **NumPy** | Numerical computing | [numpy.org](https://numpy.org) | N-dimensional arrays |
| **Pandas** | Data manipulation | [pandas.pydata.org](https://pandas.pydata.org) | DataFrames, I/O |
| **Scikit-learn** | Classic ML algorithms | [scikit-learn.org](https://scikit-learn.org) | Classify, regress, cluster |
| **Datasets (HF)** | Dataset loading/processing | [github](https://github.com/huggingface/datasets) | Streaming, arrow backend |
| **Tokenizers (HF)** | Fast Rust-based tokenizer | [github](https://github.com/huggingface/tokenizers) | BPE/WordPiece/Unigram |

## 🌐 Model Hub & Distribution

| Service | Purpose | URL |
|---|---|---|
| **HuggingFace Hub** | Model/dataset repository, Spaces | [huggingface.co](https://huggingface.co) |
| **ONNX Runtime** | Cross-platform ML inference | [onnxruntime.ai](https://onnxruntime.ai) |
| **OpenAI Compatible API** | Standard local/cloud API format | — |

---

# SECTION 016: PYTHON UI FRAMEWORKS FOR AI APPS

| Framework | 🏆 Best For | Description | URL | Stars | Install |
|---|---|---|---|---|---|
| **Gradio** | 🥇 ML Demos | Quick ML web interfaces, built-in chat | [gradio.app](https://gradio.app) | ⭐35K+ | `pip install gradio` |
| **Streamlit** | 🥇 Data Apps | Data app framework, widgets, caching | [streamlit.io](https://streamlit.io) | ⭐38K+ | `pip install streamlit` |
| **Chainlit** | 🥇 LLM Chat UIs | Chat UI for LLM apps, auth, steps | [chainlit.io](https://chainlit.io) | ⭐8K+ | `pip install chainlit` |
| **NiceGUI** | 🥈 Web Apps | Reactive, Tailwind, no JS needed | [nicegui.io](https://nicegui.io) | ⭐10K+ | `pip install nicegui` |
| **Reflex** | 🥈 Pure Python Web Apps | React-like, state mgmt, hosting | [reflex.dev](https://reflex.dev) | ⭐22K+ | `pip install reflex` |
| **Solara** | 🥈 Dashboards | React-like, Jupyter-friendly | [solara.dev](https://solara.dev) | ⭐2K+ | `pip install solara` |
| **Taipy** | 🥈 Data Pipelines | Scenario mgmt, visualization | [taipy.io](https://taipy.io) | ⭐12K+ | `pip install taipy` |
| **Mesop (Google)** | 🥉 Rapid Web Apps | Angular-like, fast startup | [github](https://github.com/google/mesop) | ⭐3K+ | `pip install mesop` |
| **Flet** | 🥉 Multi-platform | Flutter UI from Python | [flet.dev](https://flet.dev) | ⭐12K+ | `pip install flet` |
| **Dash (Plotly)** | 🥉 Dashboards | Analytical web apps, Plotly | [dash.plotly.com](https://dash.plotly.com) | ⭐22K+ | `pip install dash` |
| **Panel** | 🥉 Exploration | Jupyter dashboards, streaming | [panel.holoviz.org](https://panel.holoviz.org) | ⭐5K+ | `pip install panel` |

---

# SECTION 017: FASTAPI + AI ECOSYSTEM

| Tool | Type | Key Feature | URL | Use Case |
|---|---|---|---|---|
| **FastAPI** | 🏆 Web Framework | Async, Pydantic v2, OpenAPI docs, WebSocket | [fastapi.tiangolo.com](https://fastapi.tiangolo.com) | All AI API backends |
| **Pydantic v2** | Data Validation | Strict validation, serialization, JSON Schema | [docs.pydantic.dev](https://docs.pydantic.dev) | Request/response models |
| **Pydantic AI** | Agent Framework | Type-safe agents, tools, **MCP** support | [ai.pydantic.dev](https://ai.pydantic.dev) | Type-safe AI agents |
| **LangServe** | API Server | Auto deploy LangChain/LangGraph as REST API | [github](https://github.com/langchain-ai/langserve) | Deploy LangChain apps |
| **LlamaIndex Server** | API Server | LlamaIndex as FastAPI endpoints | [docs.llamaindex.ai](https://docs.llamaindex.ai) | Deploy RAG pipelines |
| **vLLM Server** | LLM API | High-throughput OpenAI-compatible API | [github](https://github.com/vllm-project/vllm) | Production LLM serving |
| **TGI Server** | LLM API | HuggingFace TGI with OpenAI API | [github](https://github.com/huggingface/text-generation-inference) | HF model serving |
| **Nitro (Jan)** | Local LLM API | C++ native, OpenAI-compatible | [github](https://github.com/janhq/nitro) | Local LLM endpoint |
| **Ollama API** | Local LLM API | Built-in REST + streaming API | [ollama.com](https://ollama.com) | Local LLM API |
| **Modal + FastAPI** | GPU Serverless | Serverless GPU + FastAPI | [modal.com](https://modal.com) | GPU AI APIs |
| **Replicate + FastAPI** | Model API | Open model APIs for Python | [replicate.com](https://replicate.com) | Image/text gen APIs |
| **FastAPI + RAG** | RAG API Pattern | Vector search + LLM generation | — | Document Q&A systems |
| **FastAPI + WebSocket** | Real-time AI | Streaming responses | — | Chat applications |
| **FastAPI + Celery** | Async Tasks | Background GPU/AI processing | [docs.celeryq.dev](https://docs.celeryq.dev) | Heavy AI processing |
| **Uvicorn** | ASGI Server | Production FastAPI deployment | [uvicorn.org](https://www.uvicorn.org) | Serve FastAPI apps |

---

# SECTION 018: PYTHON AI AGENT TOOLS

| Library | Type | Description | URL | Key Feature |
|---|---|---|---|---|
| **Pydantic AI** | 🏆 Agent Framework | Type-safe agents w/ MCP support | [ai.pydantic.dev](https://ai.pydantic.dev) | Pydantic-validated agent outputs |
| **OpenAI Agents SDK** | 🏆 Agent Framework | Official SDK: handoffs, guardrails | [github](https://github.com/openai/openai-agents-python) | OpenAI-native agents |
| **LangGraph** | 🏆 Agent Framework | Stateful graph agent orchestration | [github](https://github.com/langchain-ai/langgraph) | Persistence, cycles |
| **smolagents (HF)** | Agent Framework | Minimal agent framework by HF | [github](https://github.com/huggingface/smolagents) | Code agents, HF Hub |
| **Instructor** | 🏆 Structured Outputs | Pydantic + LLM extraction, retries | [github](https://github.com/jxnl/instructor) | Type-safe structured extraction |
| **Outlines** | Structured Generation | Regex-guided LLM generation | [github](https://github.com/dottxt-ai/outlines) | JSON mode, constrained gen |
| **Guidance (MS)** | Structured Gen | Microsoft constrained generation | [github](https://github.com/guidance-ai/guidance) | Templates, token healing |
| **Marvin (Prefect)** | AI Functions | AI-powered Python decorators | [github](https://github.com/PrefectHQ/marvin) | Classification, extraction |
| **httpx** | HTTP Client | Async HTTP for agent tools | [python-httpx.org](https://www.python-httpx.org) | Async agent tool calls |
| **Playwright** | Browser Automation | Headless browser for agents | [playwright.dev/python](https://playwright.dev/python) | Web browsing agent |
| **SQLAlchemy + asyncpg** | Database | Async database tools | [sqlalchemy.org](https://sqlalchemy.org) | Agent DB access |
| **Redis (Python)** | Cache / State | Agent state, pub/sub, caching | [redis-py.readthedocs.io](https://redis-py.readthedocs.io) | Agent session state |
| **LlamaParse** | Document Parsing | Parse PDFs/docs for RAG agents | [llamaindex.ai](https://llamaindex.ai/llamaparse) | Complex doc parsing |
| **Markdown + Jinja2** | Template Engine | Generate agent prompts/emails | [jinja.palletsprojects.com](https://jinja.palletsprojects.com) | Template-based gen |

---

# SECTION 019: PROMOTING TECHNIQUES (25 Methods)

| # | Technique | Category | What It Does | Best For |
|---|---|---|---|---|
| 1 | **Zero-shot** | Basic | Ask directly with no examples | Simple tasks |
| 2 | **Few-shot** | Basic | Provide 2–5 examples before asking | Pattern learning |
| 3 | **Chain-of-Thought (CoT)** | 🧠 Reasoning | "Let's think step by step" | 🏆 Math, logic, reasoning |
| 4 | **Tree-of-Thought** | 🧠 Reasoning | Explore multiple reasoning paths | Creative problem solving |
| 5 | **ReAct** | 🤖 Agent | Interleave reasoning and actions | 🏆 Agent tool use (standard) |
| 6 | **Self-Consistency** | 🧠 Reasoning | Multiple CoT paths → majority vote | Reliable answers |
| 7 | **Reflexion** | 🤖 Agent | Self-critique and refine output | Agent self-improvement |
| 8 | **System Persona** | 🎭 Structure | Assign role/persona to model | Consistent tone, expert mode |
| 9 | **Structured Output** | 📐 Formatting | Request JSON/XML/Markdown output | 🏆 Programmatic use |
| 10 | **Step-back** | 🧠 Reasoning | High-level view first → details | Complex analysis |
| 11 | **Generated Knowledge** | 📚 Knowledge | Model generates knowledge first | Improve factual accuracy |
| 12 | **Chain-of-Verification** | ✅ Factual | Generate → verify claims | Reduce hallucination |
| 13 | **EmotionPrompt** | 🔥 Engagement | "This is important for my career" | Better quality responses |
| 14 | **RAG** | 📚 Knowledge | Provide retrieved context before answer | 🏆 Knowledge-grounded Q&A |
| 15 | **Constrained Gen** | 📐 Structure | Regex or schema-guided output | Predictable formats |
| 16 | **Tool Use Format** | 🤖 Agent | Define tools in system prompt | Agent function calling |
| 17 | **Meta Prompting** | 🔄 Meta | Prompt about prompting itself | Prompt optimization |
| 18 | **Few-shot CoT** | Combined | Examples + reasoning chain | Math word problems |
| 19 | **Contrastive** | 🧠 Reasoning | Show what NOT to do | Avoiding mistakes |
| 20 | **Skeleton-of-Thought** | ⚡ Speed | Outline first → expand sections | Faster long-form gen |
| 21 | **Prompt Chaining** | 🔗 Pipeline | Chain multiple prompts together | Complex workflows |
| 22 | **Decomposition** | 📐 Structure | Break question into sub-questions | Complex multi-step |
| 23 | **Chain-of-Density** | 📝 Summary | Increasingly dense summaries | Hierarchical summarization |
| 24 | **Summary of Summary** | 📝 Summary | Recursive summarization | Very long documents |
| 25 | **Multimodal Prompting** | 🖼️ Multimodal | Combine text + image + audio | Vision/language tasks |

---

# SECTION 020: AI LEARNING RESOURCES

| Resource | Type | Level | Focus | URL |
|---|---|---|---|---|
| **HuggingFace NLP Course** | 📖 Course | Beginner-Intermediate | Transformers, NLP | [huggingface.co/learn/nlp-course](https://huggingface.co/learn/nlp-course) |
| **Fast.ai** | 📖 Course | Beginner-Intermediate | Practical deep learning | [course.fast.ai](https://course.fast.ai) |
| **DeepLearning.AI (Coursera)** | 📖 Course | All Levels | AI/ML by Andrew Ng | [deeplearning.ai](https://deeplearning.ai) |
| **LangChain Academy** | 📖 Course | Intermediate | LangChain, LangGraph | [python.langchain.com/academy](https://python.langchain.com/academy) |
| **Prompt Engineering Guide** | 📖 Guide | All Levels | Prompting techniques | [promptingguide.ai](https://www.promptingguide.ai) |
| **Anthropic Prompt Docs** | 📖 Guide | All Levels | Claude best practices | [docs.anthropic.com/prompt-engineering](https://docs.anthropic.com/prompt-engineering) |
| **OpenAI Cookbook** | 📋 Recipes | Intermediate | GPT application recipes | [cookbook.openai.com](https://cookbook.openai.com) |
| **MIT Deep Learning** | 📖 Course | Advanced | Deep learning theory | [deeplearning.mit.edu](https://deeplearning.mit.edu) |
| **Stanford CS224n** | 📖 Course | Advanced | NLP with deep learning | [web.stanford.edu/class/cs224n](https://web.stanford.edu/class/cs224n) |
| **Weights & Biases Course** | 📖 Course | Intermediate | ML experiment tracking | [wandb.ai/course](https://wandb.ai/course) |
| **Google ML Crash Course** | 📖 Course | Beginner | ML fundamentals | [developers.google.com/machine-learning/crash-course](https://developers.google.com/machine-learning/crash-course) |
| **Andrej Karpathy's YouTube** | 🎥 Videos | Inter-Adv | Deep neural nets from scratch | [youtube.com/@AndrejKarpathy](https://youtube.com/@AndrejKarpathy) |
| **RAG from Scratch** | 📋 Tutorial | Intermediate | Build RAG step-by-step | [github.com/langchain-ai/rag-from-scratch](https://github.com/langchain-ai/rag-from-scratch) |
| **Cohere LLM University** | 📖 Course | Beginner | LLM + RAG fundamentals | [cohere.com/llmu](https://cohere.com/llmu) |
| **FastAPI Official Docs** | 📖 Docs | All Levels | FastAPI tutorial | [fastapi.tiangolo.com/tutorial](https://fastapi.tiangolo.com/tutorial) |
| **HuggingFace Deep RL** | 📖 Course | Intermediate | Reinforcement learning | [huggingface.co/learn/deep-rl-course](https://huggingface.co/learn/deep-rl-course) |

---

# SECTION 021: GLOSSARY OF KEY TERMS

| Term | Definition |
|---|---|
| **LLM** | Large Language Model — neural network trained on massive text for text generation |
| **RAG** | Retrieval Augmented Generation — retrieve relevant context before generating |
| **Agent** | LLM that uses tools, makes decisions, takes actions autonomously |
| **MCP** | Model Context Protocol — Anthropic standard for LLM ↔ tool integration |
| **LangGraph** | Graph framework for stateful, multi-agent LLM applications |
| **LangChain** | Framework for LLM-powered apps (RAG, agents, chains) |
| **Vector Database** | DB optimized for similarity search on embedding vectors |
| **Embedding** | Numerical representation of text for similarity comparison |
| **Fine-tuning** | Further training a pre-trained model on specific data |
| **CoT** | Chain of Thought — step-by-step reasoning prompt technique |
| **MoE** | Mixture of Experts — multiple specialized sub-models in one architecture |
| **Quantization** | Reduce model precision (32→4/8 bit) for smaller size & faster inference |
| **LoRA** | Low-Rank Adaptation — efficient fine-tuning (tiny adapter weights) |
| **QLoRA** | Quantized LoRA — LoRA on quantized base model for memory efficiency |
| **Vibe Coding** | AI-assisted coding: describe intent in natural language, AI writes code |
| **Hermes** | AI agent platform mentioned in SG Reddit builder thread |
| **Pydantic AI** | Type-safe AI agent framework built on Pydantic v2 |
| **Semantic Kernel** | Microsoft AI orchestration SDK for building AI agents |
| **AutoGen** | Microsoft multi-agent conversation framework |
| **CrewAI** | Multi-agent orchestration with role-based agent teams |
| **SWE-agent** | Agent specialized in software engineering tasks |
| **Attribution** | Source citations in LLM outputs for transparency |
| **Hallucination** | LLM generating false or fabricated information |
| **Grounding** | Connecting LLM outputs to verifiable sources or data |
| **Guardrails** | Input/output validation & safety rules for LLM apps |
| **Tool Calling** | LLM requesting to call external functions/APIs |
| **Orchestrator** | Main agent that delegates tasks to sub-agents or tools |
| **PagedAttention** | vLLM's memory-efficient attention mechanism |
| **Continous Batching** | Dynamically add/remove sequences for max GPU utilization |
| **Speculative Decoding** | Use draft model to speed up target model inference |
| **RAG Pipeline** | End-to-end: query → retrieve relevant docs → generate with context |
| **Graph RAG** | RAG over knowledge graphs for structured retrieval |
| **Agentic RAG** | Agent that decides when/how to retrieve for optimal context |

---

# APPENDIX: QUICK REFERENCE

## 🔥 Top 10 Most-Used Tools (2025-26)

| Rank | Tool | Category | Why Popular |
|---|---|---|---|
| 1 | **Ollama** | Local LLM | Easiest way to run LLMs locally |
| 2 | **Claude Code** | AI Coding | Best terminal coding agent w/ MCP |
| 3 | **Cursor** | AI IDE | Best AI code editor experience |
| 4 | **LangChain** | Framework | Largest ecosystem for LLM apps |
| 5 | **LangGraph** | Agent Framework | Gold standard for complex agents |
| 6 | **MCP** | Protocol | Anthropic's LLM-tool integration standard |
| 7 | **CrewAI** | Multi-Agent | Simplest multi-agent orchestration |
| 8 | **Dify** | AI Platform | Best open-source no-code AI platform |
| 9 | **FastAPI** | Python API | Gold standard for Python AI backends |
| 10 | **vLLM** | LLM Serving | Production standard for LLM serving |

## 📦 Essential pip installs for AI/Agent Dev

```bash
pip install fastapi uvicorn pydantic pydantic-ai           # API + type-safe agents
pip install langchain langgraph langserve                  # LangChain ecosystem
pip install openai anthropic litellm                        # LLM API clients
pip install crewai autogen                                 # Multi-agent frameworks
pip install chromadb qdrant-client faiss-cpu                # Vector databases
pip install gradio streamlit chainlit                       # UI frameworks
pip install httpx playwright sqlalchemy asyncpg             # Agent tools
pip install instructor outlines                            # Structured LLM outputs
pip install transformers accelerate peft trl               # HF ecosystem
pip install ollama                                         # Local LLM client
```

---

*End of Guide — 21 Sections | June 2026*
