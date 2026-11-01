export const REFERENCE_DOCUMENTS = [
  {
    id: "roadmap",
    title: "AI Integration Engineer Complete Roadmap",
    icon: "🗺️",
    category: "Roadmaps",
    description: "A comprehensive 6-month learning path covering foundations, LLM integration, AI agents, enterprise systems, advanced topics, and a capstone project.",
    sections: [
      {
        heading: "Overview",
        content: `This roadmap takes you from zero to AI Integration Engineer in 6 months. Each phase builds on the previous, with hands-on projects and real-world applications. The path covers Python foundations, LLM integration, agent frameworks, enterprise systems, advanced topics, and a capstone project.`
      },
      {
        heading: "Foundations & Setup",
        items: [
          { label: "Python 3.10+ Installed", detail: "Download from python.org. Learn virtual environments (venv/conda), pip/poetry for package management." },
          { label: "Git + GitHub Account", detail: "Version control basics, branching strategies, pull requests." },
          { label: "VS Code + Extensions", detail: "Python, Jupyter, GitHub Copilot, Pylance." },
          { label: "API Testing Tool", detail: "Postman, Insomnia, or httpie for testing API endpoints." },
          { label: "Terminal/CLI Comfort", detail: "Basic commands, navigating directories, running scripts." }
        ]
      },
      {
        heading: "Month 1: Python Foundations",
        content: `Week 1-2: Python Core — Variables & Data Types, Control Flow, Functions, List Comprehensions, File I/O. Week 3-4: Python for AI — Virtual Environments, pip & Package Management, JSON Handling, HTTP Requests, Environment Variables.`
      },
      {
        heading: "Month 2: LLM Foundations",
        content: `Week 5-6: Understanding LLMs — What Are LLMs?, API Key Management, Your First API Call, Prompt Engineering Basics, Token Economics. Week 7-8: Working with Multiple Providers — OpenAI API, Anthropic API, Google AI Studio, Local Models (Ollama), Provider Comparison.`
      },
      {
        heading: "Month 3: API Integration & RAG",
        content: `Week 9-10: Building LLM Applications — REST API Design, Streaming Responses, Conversation Management, Error Handling & Retries, Response Parsing. Week 11-12: RAG (Retrieval-Augmented Generation) — Vector Databases, Embeddings, Chunking Strategies, Retrieval Patterns, RAG Pipeline.`
      },
      {
        heading: "Month 4: AI Agents & Tools",
        content: `Week 13-14: Agent Frameworks — LangChain Basics, LangGraph, CrewAI, OpenAI Assistants API, Agent Patterns. Week 15-16: Tool Use & Function Calling — Function Calling, Custom Tools, Code Execution, Web Browsing, Database Access.`
      },
      {
        heading: "Month 5: Enterprise & Production",
        content: `Week 17-18: Production Systems — Authentication & Authorization, Rate Limiting & Quotas, Caching Strategies, Monitoring & Observability, Cost Management. Week 19-20: Security & Safety — Prompt Injection, Content Safety, Data Privacy, Model Guardrails, Red Teaming.`
      },
      {
        heading: "Month 6: Advanced Topics & Capstone",
        content: `Week 21-22: Advanced Patterns — Fine-Tuning, Multi-Modal AI, AI Coding Assistants, Workflow Automation, Performance Optimization. Week 23-24: Capstone Project — Project Selection, Architecture Design, Implementation, Testing & Evaluation, Deployment.`
      },
      {
        heading: "Key Projects by Month",
        content: `Month 1: CLI tool, web scraper, file organizer, API wrapper. Month 2: Multi-provider chatbot, prompt template library, token counter. Month 3: Document Q&A system, RAG pipeline, embedding explorer. Month 4: AI agent with tools, multi-agent system, automation workflow. Month 5: Production chatbot, monitoring dashboard, security audit tool. Month 6: Capstone project of your choice.`
      },
      {
        heading: "Learning Resources",
        content: `Courses: fast.ai Practical Deep Learning, DeepLearning.AI Specializations, LangChain Academy. Documentation: OpenAI Cookbook, Anthropic Docs, LangChain Docs, LlamaIndex Docs. Practice: Kaggle, Papers With Code, Hugging Face, GitHub trending AI repos. Community: r/LocalLLaMA, Hugging Face Discord, LangChain Discord, AI Twitter/X.`
      },
      {
        heading: "Essential Concepts Cheat Sheet",
        content: `LLM = Large Language Model | RAG = Retrieval-Augmented Generation | Fine-tuning = Training on custom data | Prompt Engineering = Crafting inputs for better outputs | Embeddings = Numerical representations of text | Vector DB = Database for similarity search | Agent = LLM + Tools + Memory + Planning | Function Calling = LLM invoking external functions | Streaming = Real-time token delivery | Context Window = Max tokens model can process | Temperature = Randomness control (0=deterministic, 1=creative) | Top-p = Nucleus sampling | Token = ~4 characters English | Completion = Model's response | System Prompt = Instructions for model behavior | Few-shot = Examples in prompt | Chain-of-Thought = Step-by-step reasoning | Grounding = Connecting to real data | Guardrails = Safety filters and rules | Observability = Monitoring and tracing | Evaluation = Measuring AI output quality`
      }
    ]
  },
  {
    id: "tools-catalog",
    title: "AI Tools & Agents Catalog",
    icon: "🔧",
    category: "Tools & Catalogs",
    description: "A comprehensive catalog of 119+ AI tools and agents organized by category including coding, design, writing, productivity, and more.",
    sections: [
      {
        heading: "Overview",
        content: `This catalog covers 119+ AI tools and agents organized by category. Each tool includes a brief description and primary use case. Tools span coding, design, writing, productivity, video, audio, research, and more.`
      },
      {
        heading: "Coding & Development",
        content: `GitHub Copilot — AI pair programmer, code suggestions/completions/chat, VS Code/JetBrains/Neovim, Free tier + $10/mo Pro. Cursor — AI-first code editor, tab completions/cmd+k edits/chat/multi-file context, Based on VS Code, Free + $20/mo Pro. Aider — Terminal-based AI coding, Git-aware/multi-model support, Open source, Free. Continue — VS Code/JetBrains AI assistant, custom models/autocomplete/chat, Open source, Free. Cline — VS Code AI agent, autonomous coding/browser control/file editing, Open source, Free. Roo Code — VS Code AI coding assistant, multi-model/custom modes, Open source, Free. Cody (Sourcegraph) — AI code assistant, context-aware/codebase search, Free tier + $9/mo Pro. Codeium (Windsurf) — AI code completion, multi-language/IDE support, Free tier + $10/mo Pro. Tabnine — AI code completion, privacy-focused/can run locally, Free + $12/mo Pro. Amazon Q Developer — AWS AI coding assistant, code generation/transformation/security scans, Free + Pro tier. Replit AI — AI in browser IDE, code generation/debugging/explanation, Free + $25/mo Pro. Bolt.new — Browser AI app builder, full-stack apps from prompts, Free tier + paid. v0 (Vercel) — AI UI generator, React/Next.js components from prompts, Free + $20/mo. Lovable — AI full-stack app builder, from idea to deployed app, Free + paid plans. Devin (Cognition) — Autonomous AI engineer, handles complex coding tasks, Enterprise pricing. SWE-agent — AI software engineer agent, GitHub issue to PR, Open source, Free. OpenHands (OpenDevin) — Open source AI developer agent, code/shell/browser, Free. Sweep AI — AI junior dev, GitHub issues to pull requests, Free for open source. CodeRabbit — AI code review, automated PR reviews, Free tier + $12/mo. Ellipsis — AI code review and fix, handles lint errors/tests, Free tier + paid. CodiumAI (Qodo) — AI test generation, tests from code, Free + paid plans. Codacy — AI code quality, automated reviews/security, Free + from $15/mo. Bugsnag — AI error monitoring, smart alerts/stability scores, Free + paid. Raycast AI — AI in launcher, text commands/code snippets, $8/mo with Raycast. Pieces — AI code snippet manager, context-aware, Free + Pro. Blackbox AI — Code generation/search, VS Code extension, Free + paid. Codecomplete — AI code completion, JetBrains/VS Code, Free beta.`
      },
      {
        heading: "Design & Creative",
        content: `Midjourney — AI image generation, high quality/artistic, Discord-based, From $10/mo. DALL-E 3 (OpenAI) — Image generation, ChatGPT integration, Included in ChatGPT Plus. Stable Diffusion — Open source image generation, local or cloud, Free. Leonardo AI — AI image generation, game assets/concept art, Free + paid. Ideogram — AI text-to-image, good typography, Free + paid. Flux (Black Forest Labs) — High-quality open source image generation, Free. Playground AI — AI image creation/editing, social features, Free + $15/mo. Canva AI — Design tools with AI features, Magic Write/Remove BG, Included in Canva Pro. Adobe Firefly — Generative AI for creatives, commercially safe, Included in Creative Cloud. Figma AI — AI features in Figma, auto-layout/suggestions, Included in Figma. Looka — AI logo maker, brand kits, From $20. Brandmark — AI logo design, custom branding, From $25. Uizard — AI app design, sketch to prototype, Free + $12/mo. Galileo AI — AI UI design, Figma integration, Waitlist/beta. Diagram — AI design tools, Figma plugins, Various tools. Clipdrop — AI image editing, remove BG/upscale/relight, Free + paid. Remove.bg — AI background removal, instant, Free preview + paid full. Upscayl — AI image upscaling, Open source, Free. Topaz Gigapixel — AI upscaling, desktop app, $99 one-time. Luminar Neo — AI photo editing, sky replacement/portrait tools, From $14/mo.`
      },
      {
        heading: "Writing & Content",
        content: `ChatGPT — General AI assistant, writing/analysis/code, Free + $20/mo Plus. Claude — Anthropic AI, long context/nuanced writing, Free + $20/mo Pro. Jasper — Marketing AI, templates/brand voice/campaigns, From $39/mo. Copy.ai — AI copywriting, GTM workflows, Free + $49/mo. Writesonic — AI content creation, blog posts/ads, Free + from $16/mo. Rytr — AI writing assistant, 40+ use cases, Free + $9/mo. Grammarly — AI writing assistant, grammar/style/tone, Free + $12/mo Premium. Hemingway Editor — Readability improvement, desktop app, Free web/$19.99 desktop. Notion AI — AI in Notion, summarize/write/brainstorm, $10/mo add-on. Obsidian Copilot — AI for Obsidian, local models supported, Free + paid. Surfer SEO — AI content optimization, SERP analysis, From $89/mo. MarketMuse — AI content planning, topic modeling, Free + from $99/mo. Clearscope — AI content optimization, keyword grading, From $189/mo. Originality.ai — AI detection + plagiarism, $0.01 per 100 words. Quillbot — AI paraphrasing/grammar, Free + $9.95/mo. Sudowrite — AI novel writing, creative fiction, From $10/mo. NovelAI — AI story writing, anime-style images, From $10/mo. DeepL Write — AI writing improvement, grammar/style, Free + $8.74/mo. Perplexity — AI research engine, cited answers, Free + $20/mo Pro.`
      },
      {
        heading: "Video & Animation",
        content: `Runway ML — AI video generation/editing, Gen-3 Alpha, Free + from $12/mo. Pika Labs — AI video generation, text/image to video, Free + paid. Synthesia — AI avatar videos, 150+ avatars, From $22/mo. HeyGen — AI video with avatars, lip sync, Free + from $24/mo. D-ID — AI face animation, talking heads, Free + from $5.9/mo. Colossyan — AI video for training, avatars/translations, From $21/mo. InVideo AI — AI video creation, templates, Free + $25/mo. Pictory — Script to video, blog to video, From $19/mo. Kapwing AI — AI video editing, auto cut/captions, Free + $16/mo. Descript — AI video/podcast editing, text-based editing, Free + $24/mo. Opus Clip — AI viral clips, long to short video, Free + $9/mo. Vizard AI — AI video repurposing, clips from long videos, Free + paid. Topaz Video AI — AI video enhancement, upscaling/interpolation, $299. Domo AI — AI video style transfer, anime/cartoon styles, Free + paid. Haiper AI — AI video generation, 2-second clips, Free. Stable Video Diffusion — Open source video generation, Free. Kling AI — AI video generation by Kuaishou, up to 2 minutes, Free + paid. Luma Dream Machine — AI video generation, image to video, Free + paid. Minimax (Hailuo AI) — AI video generation, quality output, Free + paid. ElevenLabs Dubbing — AI video dubbing, 29 languages, Included in ElevenLabs.`
      },
      {
        heading: "Audio & Music",
        content: `ElevenLabs — AI voice synthesis, cloning/dubbing, Free + from $5/mo. Murf AI — AI voiceovers, 120+ voices, From $19/mo. Play.ht — AI voice generation, ultra-realistic, Free + from $31/mo. Bark (Suno) — Text-to-audio, Open source, Free. Whisper (OpenAI) — Speech-to-text, Open source, Free. AssemblyAI — Speech-to-text API, high accuracy, From $0.006/min. Deepgram — Speech-to-text API, real-time, From $0.0043/min. Suno AI — AI music generation, full songs with vocals, Free + $10/mo. Udio — AI music creation, high quality, Free + $10/mo. AIVA — AI music composition, classical/cinematic, Free + from €11/mo. Stable Audio — AI audio generation, music/SFX, Free + paid. Adobe Podcast — AI audio enhancement, noise removal, Free web tool. Krisp — AI noise cancellation, real-time, Free + $8/mo. Podcastle — AI podcast creation, voice cloning, Free + from $12/mo. Wondercraft — AI podcast generator, scripts/voices, Free + paid. LALAL.AI — AI vocal/instrument separation, From $15. Moises — AI music stem separation, From $3.99/mo. Boomy — AI music creation, quick songs, Free to create. Soundraw — AI music generation, royalty-free, From $16.99/mo. Mubert — AI background music, royalty-free, From $14/mo.`
      },
      {
        heading: "Productivity & Business",
        content: `Microsoft Copilot — AI across Microsoft 365, Word/Excel/PowerPoint/Teams, From $30/mo. Google Gemini (Workspace) — AI in Google Docs/Sheets/Gmail, From $20/mo. Otter.ai — AI meeting transcription, real-time, Free + $16.99/mo. Fireflies.ai — AI meeting notes, transcription/summaries, Free + $18/mo. Lindy AI — AI personal assistant, calendar/email/tasks, From $49.99/mo. Reclaim AI — AI scheduling, smart calendar, Free + $10/mo. Motion — AI task/project management, auto-scheduling, From $19/mo. Clockwise — AI calendar optimization, focus time, Free + $6.75/mo. Superhuman — AI email client, fast/AI features, $30/mo. Tome — AI presentations, from text to slides, Free + $16/mo. Gamma — AI presentations, no-code, Free + $10/mo. Beautiful.ai — AI slide design, smart templates, From $12/mo. Claude Projects — Custom AI workspaces, documents/instructions, $20/mo Pro. Custom GPTs (OpenAI) — Custom ChatGPT versions, knowledge upload, Free + $20/mo. Fabric — AI prompt framework, augment humans, Open source, Free.`
      },
      {
        heading: "Research & Analysis",
        content: `Perplexity AI — AI search engine, real-time/cited answers, Free + $20/mo. Consensus — AI academic search, research papers, Free + $8.99/mo. Semantic Scholar — AI research tool, 200M+ papers, Free. Elicit — AI research assistant, paper analysis, Free + $10/mo. Scholarcy — AI research summarizer, flashcards, Free + paid. Scite.ai — AI citation analysis, smart citations, From $20/mo. Research Rabbit — AI literature discovery, visual exploration, Free. Connected Papers — AI paper graphs, related research, Free + $3/mo. Galactica — AI scientific knowledge, papers/math/code, Free. You.com — AI search + writing, modeled results, Free + $15/mo. Phind — AI search for developers, code-focused, Free + $15/mo. Kagi — AI-powered search, no ads, From $10/mo. DuckDuckGo AI — AI chat, anonymous, Free. Grok (xAI) — AI with real-time X/Twitter data, Free with limits. Deep Research (OpenAI) — AI deep research, multi-step, Included in Pro. Gemini Deep Research — AI research reports, comprehensive, Free + paid. NotebookLM (Google) — AI notebook, upload sources/chat, Free.`
      },
      {
        heading: "Data & Analytics",
        content: `Julius AI — AI data analyst, upload data/ask questions, Free + $20/mo. Obviously AI — No-code ML, predict from data, From $75/mo. Akkio — No-code AI, predictions/forecasts, Free + from $49/mo. MonkeyLearn — AI text analysis, sentiment/classification, Free + paid. Rows AI — AI in spreadsheets, formula generation, Free + paid. ChartGPT — AI data visualization, upload CSV/get charts, Free.`
      },
      {
        heading: "AI Agents & Frameworks",
        content: `AutoGPT — Autonomous AI agent, self-directed tasks, Open source, Free. AgentGPT — Browser-based AI agent, no-code setup, Free + paid. BabyAGI — Task-driven AI agent, task management, Open source, Free. LangChain — LLM application framework, chains/prompts/tools, Open source, Free. LangGraph — Stateful agent orchestration, complex workflows, Open source, Free. CrewAI — Multi-agent collaboration, role-based agents, Open source, Free. AutoGen (Microsoft) — Multi-agent conversation, group chats, Open source, Free. Semantic Kernel (Microsoft) — Enterprise AI orchestration, .NET/Python, Open source, Free. Haystack (deepset) — LLM framework, pipelines/retrieval, Open source, Free. LlamaIndex — Data framework for LLMs, RAG/connectors, Open source, Free. Dify — Open source LLM app development, visual workflow, Free + paid. Flowise — Drag & drop LLM flow builder, open source, Free. n8n — Workflow automation with AI nodes, self-hostable, Free + paid. Langflow — Visual LLM flow builder, open source, Free. PromptFlow — LLM workflow tool, Azure integrated, Open source, Free.`
      },
      {
        heading: "Image Generation & Editing",
        content: `Midjourney — Best overall quality, Discord-based, From $10/mo. DALL-E 3 — Best with ChatGPT, OpenAI, Included in Plus. Stable Diffusion — Best open source, local/cloud, Free. Flux — Best open source quality, Black Forest Labs, Free. Leonardo AI — Best for game assets, web app, Free + paid. Ideogram — Best typography, web app, Free + paid. Playground AI — Best free tier, social features, Free + $15/mo. Firefly — Best for commercial use, Adobe, Included in CC. Canva AI — Best for non-designers, integrated, Included in Pro.`
      },
      {
        heading: "Voice & Speech",
        content: `ElevenLabs — Best overall voice synthesis, cloning/dubbing, Free + from $5/mo. Murf AI — Best for voiceovers, 120+ voices, From $19/mo. Play.ht — Best realism, ultra-realistic, Free + from $31/mo. Whisper — Best open source STT, OpenAI, Free. AssemblyAI — Best API accuracy, enterprise, From $0.006/min. Deepgram — Best real-time, low latency, From $0.0043/min. Bark — Best open source TTS, multi-language, Free.`
      },
      {
        heading: "Music Generation",
        content: `Suno AI — Best overall, full songs with vocals, Free + $10/mo. Udio — Best quality alternative, high quality, Free + $10/mo. AIVA — Best classical/cinematic, professional, Free + from €11/mo. Stable Audio — Best open source, music/SFX, Free + paid. Soundraw — Best for creators, royalty-free, From $16.99/mo. Boomy — Best for beginners, quick creation, Free to create. Mubert — Best background music, streaming API, From $14/mo.`
      },
      {
        heading: "Productivity Suites",
        content: `Microsoft Copilot — Best for Office users, full M365 integration, From $30/mo. Google Gemini — Best for Google users, Workspace integration, From $20/mo. Notion AI — Best for notes, integrated workspace, $10/mo add-on. Claude Projects — Best for research, custom workspaces, $20/mo Pro. Custom GPTs — Best for customization, knowledge upload, Free + $20/mo.`
      }
    ]
  },
  {
    id: "agents-quantum-robotics",
    title: "AI Agents, Quantum Computing & Robotics 2026",
    icon: "🤖",
    category: "Tech News Sources",
    description: "Rankings of AI agent frameworks, quantum computing breakthroughs, and robotics industry updates from 2026.",
    sections: [
      {
        heading: "Overview",
        content: `This document covers the latest developments in three cutting-edge technology areas as of 2026: AI agent frameworks and their rankings, quantum computing processors and breakthroughs, and the state of robotics including humanoid robots and industrial automation.`
      },
      {
        heading: "AI Agent Framework Rankings",
        content: `Top frameworks by GitHub stars and community adoption: LangChain — Most popular LLM application framework with chains, prompts, and tools. LangGraph — Stateful agent orchestration for complex workflows. CrewAI — Multi-agent collaboration with role-based agents. AutoGen (Microsoft) — Multi-agent conversation framework with group chats. Semantic Kernel (Microsoft) — Enterprise AI orchestration for .NET and Python. Haystack (deepset) — LLM framework with pipelines and retrieval. LlamaIndex — Data framework for LLMs focused on RAG and connectors.`
      },
      {
        heading: "Open Source Agent Platforms",
        content: `AutoGPT — Autonomous AI agent for self-directed tasks. AgentGPT — Browser-based AI agent with no-code setup. BabyAGI — Task-driven AI agent with task management. OpenHands (OpenDevin) — Open source AI developer agent. SWE-agent — AI software engineer agent from GitHub issue to PR.`
      },
      {
        heading: "Low-Code/No-Code Agent Builders",
        content: `Dify — Open source LLM app development with visual workflow. Flowise — Drag and drop LLM flow builder. n8n — Workflow automation with AI nodes, self-hostable. Langflow — Visual LLM flow builder. PromptFlow — LLM workflow tool with Azure integration.`
      },
      {
        heading: "Agent Orchestration Platforms",
        content: `LangSmith (LangChain) — Tracing, evaluation, and monitoring for LLM apps. Langfuse — Open source LLM observability. Braintrust — AI product development platform. Anthropic Console — Claude API management and prompt workbench. OpenAI Platform — GPT models, Assistants API, fine-tuning. Google AI Studio — Gemini models and prompt design. Hugging Face Inference — Model hosting and inference API. Together AI — Open source model inference API. Replicate — Model hosting and inference. Anyscale — Distributed AI inference platform.`
      },
      {
        heading: "Quantum Computing Processors 2026",
        content: `IBM — 1,121 qubit Condor processor. 4,158 qubit Flamingo processor announced. Quantum System Two with modular architecture. Heron processors for error mitigation. Google — 105 qubit Willow processor. Demonstrated below-threshold error correction. Significant advances in error correction and scaling. QuantWare — 64 qubit Contralto QPU. 128 qubit Soprano QPU for specialized applications. Affordable commercial quantum processors. IonQ — Trapped ion technology with high fidelity. ~32 algorithmic qubits. Partnership with major cloud providers. Microsoft — Majorana 1 topological qubit chip. 8 qubit topological processor. Azure Quantum integration. Intel — Tunnel Falls 12-qubit silicon spin qubit chip. Manufacturing-focused approach to quantum. Rigetti Computing — 84 qubit Ankaa-3 processor. Modular architecture for scaling. QuEra Computing — 256 qubit neutral atom processor. Up to 10,000 qubit roadmap. Error correction advances. PsiQuantum — Photonic quantum computing approach. Working with GlobalFoundries on manufacturing. Partnership with Australia for facility. D-Wave — 5,000+ qubit Advantage2 quantum annealer. Specialized for optimization problems. 1,200+ qubit Advantage system. Pasqal — 1,000+ qubit neutral atom processor. French company with European focus. Partnerships with energy and finance sectors. Atom Computing — 1,225 qubit neutral atom processor. 1,000+ qubit system demonstrated. Strong error correction progress.`
      },
      {
        heading: "Quantum Error Correction Milestones",
        content: `Google demonstrated below-threshold error correction with Willow processor. Microsoft Majorana chip represents new qubit modality with topological protection. IBM showed error mitigation can improve real-world circuit performance. Logical qubit fidelity improving faster than physical qubit error rates. Multiple companies on track for 100+ logical qubit systems by 2028.`
      },
      {
        heading: "Quantum-ML Hybrid Algorithms",
        content: `Variational Quantum Eigensolver (VQE) — For chemistry simulation. Quantum Approximate Optimization Algorithm (QAOA) — For combinatorial problems. Quantum kernel methods — Using quantum circuits as feature maps. Quantum neural networks — Parameterized quantum circuits for ML. Hybrid classical-quantum training — Combining classical optimizers with quantum circuits.`
      },
      {
        heading: "Robotics Industry Overview",
        content: `Boston Dynamics — Atlas (electric), Spot, Stretch. Commercial deployments in warehousing and logistics. Tesla Optimus — Gen 2 humanoid robot. Target price $20-25K. Manufacturing and household tasks. Figure AI — Figure 02 humanoid robot. BMW partnership. $2.6B valuation. Agility Robotics — Digit bipedal robot. Amazon warehouse trials. Commercial deployments. UBTECH Robotics — Walker S humanoid robot. Manufacturing deployment in China. OpenAI collaboration for AI capabilities. 1X Technologies — NEO Beta humanoid robot. Consumer-focused design. Home assistance applications. Sanctuary AI — Phoenix humanoid robot. General-purpose design. Carbon Corporation — Humanoid robot development. Deutsche Telekom partnership. Apptronik — Apollo humanoid robot. NASA partnership. Commercial and space applications.`
      },
      {
        heading: "Industrial & Collaborative Robots",
        content: `Universal Robots — Market leader in cobots. UR3e, UR5e, UR10e, UR16e. 100,000+ units deployed globally. Fanuc — CR series cobots. Industrial automation leader. High-precision manufacturing. ABB Robotics — YuMi dual-arm cobot. IRB series industrial robots. Global manufacturing presence. KUKA — LBR iiwa lightweight robot. Automotive industry leader. Siemens integration. Yaskawa — Motoman series. High-speed manufacturing. 500,000+ robots installed.`
      },
      {
        heading: "Humanoid Robot Companies",
        content: `Boston Dynamics — Most recognizable. Spot for inspection, Atlas for general purpose. Electric Atlas announced 2024. Tesla Optimus — Mass production target. AI training from Tesla Autopilot data. Optimistic timeline but significant resources. Figure AI — Fastest growing. BMW factory deployment. Backed by Microsoft, NVIDIA, OpenAI. Agility Robotics — First humanoid in Amazon warehouses. Digit designed for logistics. Commercial availability. UBTECH — Chinese market leader. Manufacturing deployment. International expansion planned. 1X Technologies — Consumer-focused. Home robot ambitions. NEO for household tasks.`
      },
      {
        heading: "Space Robotics & Exploration",
        content: `NASA Mars Rovers — Perseverance and Ingenuity. Autonomous science operations. Sample caching for future return. Space Station Robots — Astrobee free-flyer robots. Canadarm2 and Canadarm3. Robotic maintenance and assembly. Lunar Robots — Intuitive Machines landers. Astrobotic Peregrine. Ispace Hakuto-R. SpaceX Starship — Fully reusable rocket system. Lunar and Mars missions planned. Starbase construction in Texas. Commercial Space — Blue Origin New Glenn rocket. Rocket Lab Electron and Neutron. Relativity Space 3D-printed rockets.`
      },
      {
        heading: "Key Trends & Predictions",
        content: `AI Agents: Multi-agent systems becoming mainstream. Agent-to-agent communication protocols emerging. Enterprise adoption accelerating. Memory and planning capabilities improving rapidly. Quantum Computing: Error correction reaching practical levels. Hybrid classical-quantum workflows becoming standard. Industry-specific applications in chemistry, finance, and logistics. 1000+ logical qubit systems expected by 2030. Robotics: Humanoid robots entering commercial workforce 2026-2027. Cost reduction enabling wider adoption. AI integration making robots more capable and adaptable. Human-robot collaboration becoming standard in manufacturing.`
      }
    ]
  },
  {
    id: "news-master-directory",
    title: "AI Tech News Master Directory",
    icon: "📰",
    category: "Tech News Sources",
    description: "A comprehensive directory of 20 AI tech news categories with curated sources, newsletters, podcasts, and research platforms.",
    sections: [
      {
        heading: "Overview",
        content: `This master directory covers 20 major categories of AI tech news sources. Each section includes curated news websites, newsletters, YouTube channels, and podcasts. All URLs verified as of May 2026.`
      },
      {
        heading: "AI Industry News",
        content: `Top Sources: TechCrunch AI — techcrunch.com/category/artificial-intelligence. The Verge AI — theverge.com/ai-artificial-intelligence. MIT Technology Review AI — technologyreview.com/topic/artificial-intelligence. VentureBeat AI — venturebeat.com/ai. Reuters AI — reuters.com/technology/artificial-intelligence. Bloomberg AI — bloomberg.com/technology. CNBC AI — cnbc.com/artificial-intelligence. Wired AI — wired.com/tag/artificial-intelligence.`
      },
      {
        heading: "AI Research & Papers",
        content: `Top Sources: arXiv.org — arxiv.org (cs.AI, cs.CL, cs.LG sections). Papers With Code — paperswithcode.com. Google AI Blog — ai.googleblog.com. OpenAI Blog — openai.com/blog. Anthropic Research — anthropic.com/research. DeepMind Blog — deepmind.google/blog. Meta AI Blog — ai.meta.com/blog. Hugging Face Blog — huggingface.co/blog.`
      },
      {
        heading: "AI Startups & Funding",
        content: `Top Sources: Crunchbase AI — crunchbase.com/discover/organization.companies/field/organizations/categories/artificial-intelligence. PitchBook AI — pitchbook.com. CB Insights AI — cbinsights.com. AI News — artificialintelligence-news.com. AI Business — aibusiness.com. Smart Company AI — smartcompany.com.au. TechSpora AI — techspora.com.`
      },
      {
        heading: "LLMs & Foundation Models",
        content: `Top Sources: Hugging Face — huggingface.co. The Gradient —thegradient.pub. Lilian Weng's Blog — lilianweng.github.io. Sebastian Raschka — sebastianraschka.com. Andrej Karpathy — karpathy.github.io. Chip Huyen — huyenchip.com. Simon Willison — simonwillison.net. Hamel Husain — hamel.dev.`
      },
      {
        heading: "AI Coding & Development",
        content: `Top Sources: GitHub Blog — github.blog. Stack Overflow Blog — stackoverflow.blog. Dev.to AI — dev.to/t/artificialintelligence. Hacker News — news.ycombinator.com. Lobste.rs — lobste.rs. InfoQ AI — infoq.com/artificial-intelligence. DZone AI — dzone.com/artificial-intelligence. FreeCodeCamp AI — freecodecamp.org/news/tag/artificial-intelligence.`
      },
      {
        heading: "Computer Vision & Multimodal",
        content: `Top Sources: Papers With Code CV — paperswithcode.com/area/computer-vision. CVF Open Access — openaccess.thecvf.com. IEEE CVPR — cvpr.thecvf.com. ImageNet — image-net.org. 2D/3D Vision Blog — learnopencv.com. PyImageSearch — pyimagesearch.com. Computer Vision Foundation — cv-foundation.org.`
      },
      {
        heading: "NLP & Conversational AI",
        content: `Top Sources: Papers With Code NLP — paperswithcode.com/area/natural-language-processing. ACL Anthology — aclanthology.org. EMNLP — 2024.emnlp.org. NAACL — naacl.org. Hugging Face NLP — huggingface.co/docs/nlp. spaCy Blog — explosion.ai/blog. NLTK — nltk.org. Stanza — stanfordnlp.github.io/stanza.`
      },
      {
        heading: "Reinforcement Learning",
        content: `Top Sources: OpenAI Spinning Up — spinningup.openai.com. DeepMind Research — deepmind.google/research. Stable Baselines3 — github.com/DLR-RM/stable-baselines3. CleanRL — github.com/vwxyzjn/cleanrl. RL Course by David Silver — deepmind.com/learning/courses. Spinning Up in Deep RL — spinningup.openai.com.`
      },
      {
        heading: "AI Ethics & Policy",
        content: `Top Sources: AI Now Institute — ainowinstitute.org. Center for AI Ethics — centerforaiethics.org. Partnership on AI — partnershiponai.org. Algorithm Watch — algorithmwatch.org. AI Ethics Guidelines — aiethicsguidelines.org. OECD AI Policy — oecd.ai. UNESCO AI — en.unesco.org/artificial-intelligence.`
      },
      {
        heading: "AI Hardware & Chips",
        content: `Top Sources: NVIDIA Blog — blogs.nvidia.com. AMD AI — amd.com/en/ai. Intel AI — intel.com/ai. TSMC — tsmc.com. Qualcomm AI — qualcomm.com/artificial-intelligence. Cerebras — cerebras.ai. Graphcore — graphcore.ai. SambaNova — sambanova.ai.`
      },
      {
        heading: "Robotics & Embodied AI",
        content: `Top Sources: IEEE Spectrum Robotics — spectrum.ieee.org/robotics. The Robot Report — therobotreport.com. Robotics Business Review — roboticsbusinessreview.com. Boston Dynamics Blog — bostondynamics.com/blog. ROS.org — ros.org. Open Robotics — openrobotics.org. Robot Operating System — docs.ros.org.`
      },
      {
        heading: "AI in Healthcare",
        content: `Top Sources: Nature Medicine AI — nature.com/nm. The Lancet Digital Health — thelancet.com/journals/landig. JMIR AI — ai.jmir.org. FDA AI/ML — fda.gov/artificial-intelligence-and-machine-learning-aiml. Health AI — healthai.com. Google Health Blog — health.google/blog. Microsoft Health Blog — microsoft.com/en-us/health/blog.`
      },
      {
        heading: "AI in Finance",
        content: `Top Sources: AI Finance — aifinance.org. Finextra AI — finextra.com. Financial Times AI — ft.com/artificial-intelligence. Waters Technology — waterstechnology.com. QuantConnect — quantconnect.com. Alpha Vantage — alphavantage.co. Kensho — kensho.com. DataRobot AI — datarobot.com.`
      },
      {
        heading: "AI in Education",
        content: `Top Sources: EdSurge AI — edsurge.com. Stanford HAI — hai.stanford.edu. ISTE — iste.org. EdTech Magazine — edtechmagazine.com. Google for Education AI — edu.google.com. Microsoft Education AI — education.microsoft.com. Khan Academy Khanmigo — khanacademy.org.`
      },
      {
        heading: "AI Newsletters",
        content: `Top Newsletters: The Batch (Andrew Ng) — deeplearning.ai/the-batch. TLDR AI — tldr.tech/ai. The Neuron — theneuronhai.com. Ben's Bites — bensbites.com. AI Supremacy — aisupremacy.substack.com. The Algorithm — algorithmic.azurewebsites.net. Last Week in AI — lastweekin.ai. Import AI — importai.substack.com.`
      },
      {
        heading: "AI Podcasts",
        content: `Top Podcasts: Lex Fridman Podcast — lexfridman.com/podcast. TWIML AI — twimlai.com. Practical AI — changelog.com/practical-ai. AI Alignment Podcast — alignmentforum.org. The AI Podcast (NVIDIA) — nvidia.com/en-us/about-nvidia/podcast. Gradient Dissent — wand.ai/gradient-dissent. Data Skeptic — dataskeptic.com. O'Reilly Data Show — oreilly.com/radar/podcast.`
      },
      {
        heading: "AI YouTube Channels",
        content: `Top Channels: Two Minute Papers — youtube.com/@TwoMinutePapers. Sentdex — youtube.com/@sentdex. Yannic Kilcher — youtube.com/@YannicKilcher. AI Jason — youtube.com/@AIJason. Matthew Berman — youtube.com/@MatthewBerman. Fireship — youtube.com/@Fireship. Siraj Raval — youtube.com/@SirajRaval. CodeEmporium — youtube.com/@CodeEmporium.`
      },
      {
        heading: "AI Conferences & Events",
        content: `Major Conferences: NeurIPS — neurips.cc (December). ICML — icml.cc (July). ICLR — iclr.cc (May). AAAI — aaai.org (February). CVPR — cvpr.thecvf.com (June). ACL — aclweb.org (July). EMNLP — 2024.emnlp.org (November). ICRA — icra.org (May). IROS — iros.org (October). Web Summit AI — websummit.com (November). CES AI — ces.tech (January). AI Summit — aisummit.co (Various).`
      },
      {
        heading: "Regional AI News Sources",
        content: `USA: TechCrunch, The Verge, MIT Tech Review, Wired. China: 36Kr, TechNode, Sina Tech, PingWest. Europe: Sifted, TechCrunch UK, The Register, Heise. India: YourStory, Inc42, Analytics India, AIM. Japan: TechCrunch Japan, ITmedia, Nikkei Tech. South Korea: The Korea Times Tech, ZDNet Korea, MK Tech. Singapore: Tech in Asia, e27, The Straits Times Tech. Australia: Startup News, Computerworld AU, ARN.`
      },
      {
        heading: "Quick-Start Prompts for AI Research",
        content: `AI Industry: "Give me the top AI news from the past [week/month] covering [model releases, funding rounds, and regulatory changes]. Focus on developments from [USA/China/EU]." Cybersecurity: "Summarize the most significant cybersecurity news from the past [week/month] including major breaches, zero-day vulnerabilities, ransomware attacks, and new threat intelligence reports." Quantum: "What are the latest breakthroughs in quantum computing? Cover new processor announcements, error correction milestones, qubit count records, and commercial quantum applications." Robotics: "Give me the latest robotics news covering humanoid robots, industrial automation, cobots, and AI-driven robotics."`
      }
    ]
  },
  {
    id: "news-sources-master-list",
    title: "AI Tech News Sources Master List",
    icon: "📋",
    category: "Tech News Sources",
    description: "Master list of AI tech news sources organized into 18 categories with detailed source information, URLs, and descriptions.",
    sections: [
      {
        heading: "Overview",
        content: `This is a comprehensive master list of AI technology news sources organized into 18 distinct categories. Each category includes the most authoritative and up-to-date sources for staying current in the AI landscape.`
      },
      {
        heading: "AI Research Institutions",
        content: `MIT CSAIL — csail.mit.edu. Stanford HAI — hai.stanford.edu. UC Berkeley BAIR — bair.berkeley.edu. Carnegie Mellon ML — ml.cmu.edu. University of Toronto AI — ai.utoronto.ca. ETH Zurich AI — ai.ethz.ch. Max Planck Institutes — mpi.de. Alan Turing Institute — turing.ac.uk. MILA (Montreal) — mila.quebec. Vector Institute (Toronto) — vectorinstitute.ai.`
      },
      {
        heading: "AI Company Research Labs",
        content: `Google DeepMind — deepmind.google. OpenAI Research — openai.com/research. Anthropic Research — anthropic.com/research. Meta AI Research (FAIR) — ai.meta.com/research. Microsoft Research AI — research.microsoft.com. NVIDIA Research — research.nvidia.com. IBM Research AI — research.ibm.com/ai. Amazon Science — amazon.science. Apple ML Research — machinelearning.apple.com. Huawei Noah's Ark Lab — noahlab.com.hk.`
      },
      {
        heading: "AI News & Journalism",
        content: `TechCrunch AI — techcrunch.com/category/artificial-intelligence. The Verge AI — theverge.com/ai-artificial-intelligence. MIT Technology Review — technologyreview.com. Wired AI — wired.com/tag/artificial-intelligence. VentureBeat AI — venturebeat.com/ai. Ars Technica AI — arstechnica.com. ZDNet AI — zdnet.com/topic/artificial-intelligence. CNET AI — cnet.com/tech/services-and-software/artificial-intelligence.`
      },
      {
        heading: "AI Industry Analysis",
        content: `CB Insights — cbinsights.com. PitchBook — pitchbook.com. Gartner AI — gartner.com/en/topics/artificial-intelligence. IDC AI — idc.com/getdoc.jsp?containerId=prUS51442624. Forrester AI — forrester.com/blogs/tag/artificial-intelligence. McKinsey AI — mckinsey.com/capabilities/quantumblack/our-insights. Deloitte AI — deloitte.com/global/en/issues/ai. PwC AI — pwc.com/global/tech-effect/ai-platform.html.`
      },
      {
        heading: "AI Open Source Communities",
        content: `GitHub AI/ML — github.com/topics/artificial-intelligence. Hugging Face — huggingface.co. Papers With Code — paperswithcode.com. PyTorch — pytorch.org. TensorFlow — tensorflow.org. JAX — jax.readthedocs.io. MLflow — mlflow.org. Weights & Biases — wandb.ai.`
      },
      {
        heading: "AI Developer Resources",
        content: `Kaggle — kaggle.com. Fast.ai — course.fast.ai. deeplearning.ai — deeplearning.ai. Full Stack Deep Learning — fullstackdeeplearning.com. Made With ML — madewithml.com. MLcourse.ai — mlcourse.ai. StatQuest — youtube.com/@statquest. 3Blue1Brown — youtube.com/@3blue1brown.`
      },
      {
        heading: "AI Ethics & Policy Sources",
        content: `AI Now Institute — ainowinstitute.org. Center for Humane Technology — humanetech.com. Partnership on AI — partnershiponai.org. AlgorithmWatch — algorithmwatch.org. AI4EU — ai4eu.eu. OECD AI Policy — oecd.ai. UNESCO AI Ethics — en.unesco.org/artificial-intelligence. EU AI Act Portal — artificialintelligenceact.eu.`
      },
      {
        heading: "AI Startup Ecosystem",
        content: `Crunchbase AI Startups — crunchbase.com/discover/organization.companies/field/organizations/categories/artificial-intelligence. PitchBook AI Deals — pitchbook.com. AngelList AI — angelList.com. Product Hunt AI — producthunt.com/topics/artificial-intelligence. Y Combinator AI — ycombinator.com. Techstars AI — techstars.com. a16z AI — a16z.com. Sequoia AI — sequoiacap.com.`
      },
      {
        heading: "AI Hardware & Infrastructure",
        content: `NVIDIA Developer — developer.nvidia.com. AMD Developer — developer.amd.com. Intel AI Developer — intel.com/developer. Google Cloud AI — cloud.google.com/ai. AWS AI — aws.amazon.com/machine-learning. Azure AI — azure.microsoft.com/en-us/products/ai-services. Cerebras — cerebras.ai. Graphcore — graphcore.ai. SambaNova — sambanova.ai. Groq — groq.com.`
      },
      {
        heading: "AI Applications by Industry",
        content: `Healthcare AI — AIMed (aimed.org). Finance AI — AIFinancial (aifinance.org). Manufacturing AI — Manufacturing.ai. Retail AI — RetailAI. Automotive AI — AutomotiveAI. Legal AI — LegalTech AI. Education AI — EdTech AI. Agriculture AI — AgriTech AI.`
      },
      {
        heading: "AI YouTube Channels",
        content: `Two Minute Papers — youtube.com/@TwoMinutePapers. Sentdex — youtube.com/@sentdex. Yannic Kilcher — youtube.com/@YannicKilcher. AI Jason — youtube.com/@AIJason. Matthew Berman — youtube.com/@MatthewBerman. Fireship — youtube.com/@Fireship. 3Blue1Brown — youtube.com/@3blue1brown. Lex Fridman — youtube.com/@lexfridman.`
      },
      {
        heading: "AI Newsletters",
        content: `The Batch (Andrew Ng) — deeplearning.ai/the-batch. TLDR AI — tldr.tech/ai. The Neuron — theneuronhai.com. Ben's Bites — bensbites.com. AI Supremacy — aisupremacy.substack.com. Import AI — importai.substack.com. Last Week in AI — lastweekin.ai. The AI Exchange — theaiexchange.substack.com. Superhuman — superhuman.ai. AI Breakfast — aibreakfast.substack.com.`
      },
      {
        heading: "AI Podcasts",
        content: `Lex Fridman Podcast — lexfridman.com/podcast. TWIML AI — twimlai.com. Practical AI — changelog.com/practical-ai. Data Skeptic — dataskeptic.com. The AI Podcast (NVIDIA) — nvidia.com/en-us/about-nvidia/podcast. Gradient Dissent — wand.ai/gradient-dissent. O'Reilly Data Show — oreilly.com/radar/podcast. Linear Digressions — lineardigressions.com. Not So Standard Deviations — notsostandarddeviations.com. AI Alignment Podcast — alignmentforum.org/podcasts.`
      },
      {
        heading: "AI Twitter/X Accounts",
        content: `@AndrewYNg — Andrew Ng. @ylecun — Yann LeCun. @kaboroevich — Andrej Karpathy. @demaborsh — Demis Hassabis. @sama — Sam Altman. @daborsh — Dario Amodei. @goodfellow_ian — Ian Goodfellow. @hardmaru — David Ha. @swaborsh — Swyx. @emaborsh — Emad Mostaque.`
      },
      {
        heading: "AI Conferences",
        content: `NeurIPS — neurips.cc. ICML — icml.cc. ICLR — iclr.cc. AAAI — aaai.org. CVPR — cvpr.thecvf.com. ACL — aclweb.org. EMNLP — emnlp.org. ICRA — icra.org. IROS — iros.org. Web Summit AI — websummit.com. CES AI — ces.tech. AI Summit — aisummit.co.`
      },
      {
        heading: "AI Subreddits",
        content: `r/artificial — reddit.com/r/artificial. r/MachineLearning — reddit.com/r/MachineLearning. r/deeplearning — reddit.com/r/deeplearning. r/LanguageTechnology — reddit.com/r/LanguageTechnology. r/computervision — reddit.com/r/computervision. r/LocalLLaMA — reddit.com/r/LocalLLaMA. r/ChatGPT — reddit.com/r/ChatGPT. r/StableDiffusion — reddit.com/r/StableDiffusion. r/singularity — reddit.com/r/singularity.`
      },
      {
        heading: "AI Discord Communities",
        content: `Hugging Face Discord — discord.gg/huggingface. LAION Discord — discord.gg/laion. MLOps Community — discord.gg/mlops. EleutherAI Discord — discord.gg/eleutherai. Stability AI Discord — discord.gg/stablediffusion. LangChain Discord — discord.gg/langchain. Weights & Biases Discord — discord.gg/wandb. PyTorch Discord — discord.gg/pytorch.`
      }
    ]
  },
  {
    id: "complete-techstack",
    title: "Complete AI Tech Stack 2026",
    icon: "⚡",
    category: "Tools & Catalogs",
    description: "A complete reference of the AI technology stack including LLM providers, frameworks, databases, deployment tools, and infrastructure.",
    sections: [
      {
        heading: "Overview",
        content: `This document provides a comprehensive overview of the complete AI technology stack as of 2026, covering LLM providers, model options, frameworks, vector databases, deployment platforms, monitoring tools, and infrastructure components needed to build production AI applications.`
      },
      {
        heading: "LLM API Providers",
        content: `OpenAI — GPT-4o, GPT-4-turbo, GPT-4o-mini, GPT-4.1, o1, o3-mini. API: api.openai.com. SDK: openai Python. Anthropic — Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, Claude 4 Opus. API: api.anthropic.com. SDK: anthropic Python. Google — Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash. API: ai.google.dev. SDK: google-genai Python. Meta — Llama 3.1 405B, Llama 3.1 70B, Llama 3.1 8B. Via: Together AI, Groq, Fireworks. Mistral — Mistral Large, Mistral Medium, Mistral Small. API: api.mistral.ai. Cohere — Command R+, Command R. API: api.cohere.ai. AI21 Labs — Jamba, Jurassic. API: api.ai21.com. DeepSeek — DeepSeek-V3, DeepSeek-R1. API: api.deepseek.com. xAI — Grok-2, Grok-2 Mini. API: api.x.ai.`
      },
      {
        heading: "Local LLM Options",
        content: `Ollama — Run any open-source model locally. Install from ollama.ai. Supports Llama, Mistral, Phi, Gemma, Qwen. llama.cpp — C++ inference engine. GGUF format models. CPU and GPU support. vLLM — High-throughput serving engine. PagedAttention. OpenAI-compatible API. Text Generation WebUI — Browser UI for local models. Multiple backend support. LM Studio — Desktop app for local models. GUI-based model management. GPT4All — Desktop chat with local models. Privacy-focused. Jan — Open source desktop AI. Offline capable. Open WebUI — Browser interface for Ollama. ChatGPT-like experience.`
      },
      {
        heading: "LLM Application Frameworks",
        content: `LangChain — Most popular LLM app framework. Chains, agents, retrieval. langchain.com. LangGraph — Stateful agent orchestration by LangChain. Complex workflows. LlamaIndex — Data framework for LLMs. RAG and data connectors. llamaindex.ai. Semantic Kernel — Microsoft's LLM orchestration. .NET and Python. haystack by deepset — NLP framework with pipelines. Production-ready. Instructor — Structured outputs from LLMs. Pydantic integration. Outlines — Structured generation. Regex and grammar-guided. LMQL — Query language for LLMs. Python-like syntax. guidance — Microsoft's prompting framework. Templates and control.`
      },
      {
        heading: "Agent Frameworks",
        content: `AutoGPT — Autonomous agent framework. Self-directed task completion. CrewAI — Multi-agent collaboration. Role-based agents. AutoGen — Microsoft's multi-agent framework. Conversation-based. OpenAI Assistants API — Threads, tools, file search. Code interpreter. Anthropic Tool Use — Native tool calling in Claude. Function definitions. LangChain Agents — ReAct agents with tools. Planning and execution.`
      },
      {
        heading: "Vector Databases",
        content: `Pinecone — Managed vector database. Serverless. pinecone.io. Weaviate — Open source vector database. GraphQL API. weaviate.io. ChromaDB — Lightweight embedded vector database. chroma.ai. Qdrant — High-performance vector database. Rust-based. qdrant.tech. Milvus — Open source vector database. Scalable. milvus.io. pgvector — PostgreSQL extension for vectors. sqlvector. LanceDB — Embedded vector database. Columnar format. lancedb.com. Supabase pgvector — PostgreSQL with vector support. Open source. Redis Vector DB — Redis with vector search. Real-time. Elasticsearch — Full-text search with vector capabilities. Elastic. OpenSearch — Open source search with kNN. AWS-backed.`
      },
      {
        heading: "Embedding Models",
        content: `OpenAI text-embedding-3-small — Cost-effective, 1536 dimensions. OpenAI text-embedding-3-large — High quality, 3072 dimensions. Cohere embed-v3 — Multilingual, 1024 dimensions. sentence-transformers — Open source, multiple sizes. BAAI/bge-large-en-v1.5 — Open source, 1024 dimensions. nomic-embed-text — Open source, 768 dimensions. Google text-embedding-004 — Multilingual, 768 dimensions. Voyage AI — High quality embeddings. Specialized models.`
      },
      {
        heading: "Document Loaders & Processors",
        content: `LangChain Document Loaders — PDF, CSV, HTML, JSON, Markdown. LlamaIndex Readers — 160+ data connectors. Unstructured — Document extraction. PDF, HTML, images. Docling — IBM document processing. Tables and figures. LlamaParse — LlamaIndex document parser. Complex documents. PyMuPDF — Fast PDF parsing. Python library. Apache Tika — Content extraction. 1000+ file types.`
      },
      {
        heading: "Orchestration & Workflow",
        content: `n8n — Open source workflow automation. 400+ integrations. Temporal — Durable execution engine. Complex workflows. Apache Airflow — Workflow orchestration. Data pipelines. Prefect — Modern workflow orchestration. Python-native. Dagster — Data orchestration. Asset-based. AWS Step Functions — Serverless workflow orchestration. Azure Logic Apps — Cloud workflow automation.`
      },
      {
        heading: "Deployment & Serving",
        content: `Docker — Containerization. Standard deployment. Kubernetes — Container orchestration. Scaling and management. AWS ECS/EKS — Managed container services. Google Cloud Run — Serverless containers. Azure Container Apps — Serverless containers. Modal — Serverless GPU computing. Scale to zero. Replicate — Model hosting and inference. GPU cloud. BentoML — Model serving framework. Production-ready. Ray Serve — Scalable model serving. Ray ecosystem. TGI (Hugging Face) — Text generation inference. Optimized serving. vLLM — High-throughput LLM serving. PagedAttention. Ollama — Local model serving. Easy setup.`
      },
      {
        heading: "Monitoring & Observability",
        content: `LangSmith — LangChain's tracing platform. Evaluation and debugging. Langfuse — Open source LLM observability. Tracing and analytics. Helicone — LLM proxy with analytics. Cost tracking. Arize AI — ML observability. Production monitoring. Weights & Biases — Experiment tracking. Model logging. Patronus AI — LLM evaluation. Safety and quality. Azure AI Content Safety — Content filtering. Microsoft. Guardrails AI — Output validation. Guard rails. NeMo Guardrails — NVIDIA guardrails. Safety controls.`
      },
      {
        heading: "Evaluation & Testing",
        content: `DeepEval — Open source LLM evaluation. Metrics library. RAGAS — RAG evaluation metrics. Faithfulness, relevancy. Promptfoo — LLM testing. Prompt evaluation. AI Fairness 360 — Bias detection. IBM toolkit. HELM (Stanford) — Holistic evaluation. Benchmark suite. LMSYS Chatbot Arena — LLM comparison. Human evaluation. MMLU — Multi-task language understanding. Benchmark. HumanEval — Code generation benchmark. Pass@k metric.`
      },
      {
        heading: "Cloud AI Platforms",
        content: `AWS Bedrock — Managed AI service. Multiple models. Amazon SageMaker — ML platform. End-to-end. Google Vertex AI — ML platform. Gemini integration. Azure AI Services — Cognitive services. OpenAI integration. IBM watsonx — Enterprise AI platform. Data and governance. Databricks — Lakehouse platform. ML and AI. Snowflake — Data cloud. ML functions.`
      },
      {
        heading: "AI Development Tools",
        content: `VS Code + Extensions — Python, Jupyter, Copilot. Primary IDE. Cursor — AI-first code editor. Enhanced development. Jupyter Notebooks — Interactive development. Experimentation. Google Colab — Free GPU notebooks. Quick prototyping. Lightning AI — Cloud IDE for ML. GPU access. Replit — Browser IDE. Quick prototyping. GitHub Codespaces — Cloud dev environments. VS Code in browser.`
      },
      {
        heading: "Data Processing",
        content: `Apache Spark — Large-scale data processing. Distributed computing. Pandas — Data manipulation. Python library. Polars — Fast DataFrames. Rust-based. DuckDB — In-process analytics database. SQL interface. Apache Kafka — Stream processing. Real-time data. Apache Flink — Stream processing. Stateful computations. dbt — Data transformation. SQL-based.`
      },
      {
        heading: "Storage & Databases",
        content: `PostgreSQL — Primary database. With pgvector for vectors. Redis — Caching and real-time. Session management. MongoDB — Document store. Flexible schemas. Supabase — Open source Firebase. PostgreSQL-based. PlanetScale — Serverless MySQL. Branching. Neon — Serverless PostgreSQL. Scale to zero. Turso — Edge SQLite. Distributed.`
      }
    ]
  },
  {
    id: "detailed-project-breakdown",
    title: "Detailed Project Breakdown",
    icon: "📊",
    category: "Project References",
    description: "Month-by-month project templates with file structures, step-by-step implementation guides, and learning objectives for AI integration engineering.",
    sections: [
      {
        heading: "Overview",
        content: `This document provides detailed project templates and file structures for each month of the AI Integration Engineer roadmap. Each project includes step-by-step implementation guides, required files, and learning objectives.`
      },
      {
        heading: "Month 1 Projects",
        projects: [
          {
            name: "Project 1: CLI Tool (AI-Powered File Organizer)",
            description: "Build a Python CLI tool that organizes files in a directory by type, date, or custom rules. Uses argparse for CLI, pathlib for file operations, and includes logging.",
            files: ["organizer.py", "config.py", "utils.py", "tests/test_organizer.py", "README.md", "requirements.txt"],
            objectives: "Practice Python fundamentals including file I/O, argument parsing, error handling, and unit testing."
          },
          {
            name: "Project 2: Web Scraper",
            description: "Create a web scraper that extracts articles from news sites. Uses requests for HTTP, BeautifulSoup for parsing, and outputs to JSON/CSV.",
            files: ["scraper.py", "parser.py", "exporter.py", "models.py", "tests/test_scraper.py", "README.md", "requirements.txt"],
            objectives: "Learn HTTP requests, HTML parsing, data extraction, and structured output generation."
          },
          {
            name: "Project 3: File Organizer (Advanced)",
            description: "Enhanced file organizer with duplicate detection, preview mode, and undo functionality. Includes database tracking of organized files.",
            files: ["organizer.py", "database.py", "duplicate_finder.py", "preview.py", "cli.py", "tests/", "README.md"],
            objectives: "Practice SQLite integration, file hashing, CLI design, and building robust command-line tools."
          },
          {
            name: "Project 4: API Wrapper Library",
            description: "Build a Python library that wraps a public API (e.g., OpenWeather, CoinGecko). Includes retry logic, caching, and type hints.",
            files: ["__init__.py", "client.py", "models.py", "cache.py", "exceptions.py", "tests/test_client.py", "README.md", "pyproject.toml"],
            objectives: "Learn API design, type hints, caching strategies, and packaging Python libraries."
          }
        ]
      },
      {
        heading: "Month 2 Projects",
        projects: [
          {
            name: "Project 1: Multi-Provider Chatbot",
            description: "Build a chatbot that can switch between OpenAI, Anthropic, and local Ollama models. Includes conversation history, streaming responses, and cost tracking.",
            files: ["main.py", "providers/openai_provider.py", "providers/anthropic_provider.py", "providers/ollama_provider.py", "conversation.py", "utils/token_counter.py", "config.py", "README.md"],
            objectives: "Learn multi-provider API integration, streaming responses, and conversation management."
          },
          {
            name: "Project 2: Prompt Template Library",
            description: "Create a reusable prompt template system with variables, few-shot examples, and chain-of-thought patterns. Includes a web UI for testing.",
            files: ["templates/", "engine.py", "examples.py", "web_app.py", "tests/test_templates.py", "README.md", "requirements.txt"],
            objectives: "Master prompt engineering patterns, template systems, and structured prompt design."
          },
          {
            name: "Project 3: Token Counter & Cost Calculator",
            description: "Build a tool that counts tokens for multiple providers, estimates costs, and optimizes prompts for token efficiency.",
            files: ["counter.py", "cost_calculator.py", "optimizer.py", "cli.py", "web_ui.py", "tests/", "README.md"],
            objectives: "Understand tokenization, cost optimization, and provider-specific token counting."
          },
          {
            name: "Project 4: Code Review Bot",
            description: "Create a bot that reviews Python code for best practices, security issues, and style. Uses LLM for analysis and GitHub API for PR comments.",
            files: ["reviewer.py", "analyzers/", "github_client.py", "report_generator.py", "main.py", "tests/", "README.md"],
            objectives: "Practice code analysis, API integration, and building automated review systems."
          }
        ]
      },
      {
        heading: "Month 3 Projects",
        projects: [
          {
            name: "Project 1: Document Q&A System",
            description: "Build a RAG system that answers questions from uploaded documents. Supports PDF, TXT, and Markdown. Includes source citations.",
            files: ["app.py", "document_loader.py", "chunker.py", "embedder.py", "vector_store.py", "retriever.py", "generator.py", "templates/index.html", "README.md"],
            objectives: "Implement full RAG pipeline with document processing, embedding, retrieval, and generation."
          },
          {
            name: "Project 2: RAG Pipeline Builder",
            description: "Create a modular RAG pipeline with configurable chunking, embedding, and retrieval strategies. Includes evaluation metrics.",
            files: ["pipeline.py", "chunkers/", "embeddings/", "retrievers/", "evaluation.py", "config.py", "tests/", "README.md"],
            objectives: "Design modular systems, compare chunking strategies, and implement evaluation metrics."
          },
          {
            name: "Project 3: Embedding Explorer",
            description: "Build a visualization tool for embeddings. Shows similarity search results, dimension reduction (t-SNE/UMAP), and clustering.",
            files: ["explorer.py", "visualizer.py", "clustering.py", "similarity.py", "web_app.py", "tests/", "README.md"],
            objectives: "Understand embeddings through visualization, dimensionality reduction, and similarity metrics."
          },
          {
            name: "Project 4: Multi-Modal RAG",
            description: "Extend RAG to handle images and tables alongside text. Uses vision models for image understanding.",
            files: ["app.py", "document_loader.py", "image_processor.py", "table_extractor.py", "multi_modal_store.py", "retriever.py", "README.md"],
            objectives: "Work with multi-modal data, vision APIs, and complex document structures."
          }
        ]
      },
      {
        heading: "Month 4 Projects",
        projects: [
          {
            name: "Project 1: AI Agent with Tools",
            description: "Build an AI agent that can use multiple tools: web search, calculator, file operations, and custom APIs. Implements ReAct pattern.",
            files: ["agent.py", "tools/", "memory.py", "planner.py", "executor.py", "main.py", "tests/", "README.md"],
            objectives: "Implement agent reasoning, tool use, and the ReAct pattern for autonomous task completion."
          },
          {
            name: "Project 2: Multi-Agent System",
            description: "Create a system where multiple AI agents collaborate on complex tasks. Includes a coordinator, researcher, writer, and reviewer.",
            files: ["coordinator.py", "agents/researcher.py", "agents/writer.py", "agents/reviewer.py", "communication.py", "task_manager.py", "README.md"],
            objectives: "Design multi-agent architectures, inter-agent communication, and task decomposition."
          },
          {
            name: "Project 3: Automation Workflow Engine",
            description: "Build a workflow engine that chains LLM calls with conditional logic, loops, and error handling. Visual workflow builder included.",
            files: ["engine.py", "nodes/", "executor.py", "scheduler.py", "web_builder.py", "templates/", "README.md"],
            objectives: "Create complex LLM workflows with control flow, persistence, and visualization."
          },
          {
            name: "Project 4: Code Generation Agent",
            description: "Build an agent that generates, tests, and iterates on code. Includes sandboxed execution and automatic debugging.",
            files: ["agent.py", "code_generator.py", "sandbox.py", "test_runner.py", "debugger.py", "main.py", "README.md"],
            objectives: "Implement code generation with execution, testing, and self-improvement loops."
          }
        ]
      },
      {
        heading: "Month 5 Projects",
        projects: [
          {
            name: "Project 1: Production Chatbot",
            description: "Deploy a production-ready chatbot with authentication, rate limiting, caching, monitoring, and proper error handling.",
            files: ["app.py", "auth.py", "rate_limiter.py", "cache.py", "monitor.py", "models.py", "config.py", "docker-compose.yml", "README.md"],
            objectives: "Build production systems with security, scalability, and observability."
          },
          {
            name: "Project 2: Monitoring Dashboard",
            description: "Create a dashboard for monitoring LLM applications. Tracks costs, latency, errors, and quality metrics in real-time.",
            files: ["dashboard.py", "metrics_collector.py", "alerting.py", "visualizations/", "api.py", "docker-compose.yml", "README.md"],
            objectives: "Implement comprehensive monitoring, alerting, and visualization for AI systems."
          },
          {
            name: "Project 3: Security Audit Tool",
            description: "Build a tool that scans LLM applications for security vulnerabilities: prompt injection, data leakage, and unsafe outputs.",
            files: ["scanner.py", "tests/prompt_injection.py", "tests/data_leakage.py", "tests/unsafe_output.py", "report.py", "cli.py", "README.md"],
            objectives: "Understand and test for common LLM security vulnerabilities and attack vectors."
          },
          {
            name: "Project 4: Cost Optimization Engine",
            description: "Create a system that routes requests to optimal models based on complexity, cost, and latency requirements.",
            files: ["router.py", "complexity_analyzer.py", "cost_tracker.py", "model_registry.py", "cache.py", "api.py", "README.md"],
            objectives: "Implement intelligent routing, cost optimization, and performance monitoring."
          }
        ]
      },
      {
        heading: "Month 6 Projects",
        projects: [
          {
            name: "Capstone Project Options",
            description: "Choose one comprehensive project that demonstrates all skills learned: AI Customer Support System, Code Review & Generation Platform, Enterprise Document Intelligence, AI-Powered Research Assistant, or Multi-Agent Business Automation.",
            objectives: "Apply all skills from the 6-month program in a real-world, production-quality application."
          }
        ]
      }
    ]
  },
  {
    id: "global-tech-news",
    title: "Global Tech News Sources 2026",
    icon: "🌍",
    category: "Tech News Sources",
    description: "A global directory of AI and tech news sources organized by topic and country, covering 15 major technology areas.",
    sections: [
      {
        heading: "Overview",
        content: `This global directory covers AI and tech news sources organized by both topic and country. It includes major technology areas and regional sources from around the world. All sources verified as of 2026.`
      },
      {
        heading: "AI & Machine Learning",
        content: `USA: MIT Technology Review, TechCrunch AI, VentureBeat AI, The Verge AI. Europe: Sifted, The Register, Heise (Germany). Asia: 36Kr (China), TechNode (China), YourStory (India). Research: arXiv.org, Papers With Code, Google AI Blog, OpenAI Blog.`
      },
      {
        heading: "Cybersecurity",
        content: `USA: Krebs on Security (krebsonsecurity.com), The Hacker News (thehackernews.com), Bleeping Computer (bleepingcomputer.com), Dark Reading (darkreading.com). International: SecurityWeek (securityweek.com), SC Magazine (scmagazine.com), InfoSecurity Magazine (infosecurity-magazine.com). Government: CISA (cisa.gov), ENISA (enisa.europa.eu), NCSC (ncsc.gov.uk).`
      },
      {
        heading: "Cloud Computing",
        content: `AWS: AWS Blog (aws.amazon.com/blogs), AWS Compute Blog. Google Cloud: Google Cloud Blog (cloud.google.com/blog), Google Cloud Next. Microsoft Azure: Azure Blog (azure.microsoft.com/en-us/blog), Microsoft Build. Multi-cloud: The New Stack (thenewstack.io), InfoQ Cloud, Cloud Native Computing Foundation.`
      },
      {
        heading: "Software Development",
        content: `General: Hacker News (news.ycombinator.com), Dev.to (dev.to), Medium (medium.com). JavaScript: JavaScript Weekly, Node Weekly, React Status. Python: Python Weekly, PyCoders, Real Python. Mobile: Android Authority, iOS Dev Weekly, Flutter Weekly. DevOps: DevOps.com, DZone, InfoQ DevOps.`
      },
      {
        heading: "Startups & Venture Capital",
        content: `USA: TechCrunch (techcrunch.com), Crunchbase News, PitchBook News. Europe: Sifted (sifted.eu), Tech.eu, EU-Startups. Asia: Tech in Asia, e27, 36Kr. Global: VentureBeat, Forbes Tech, Bloomberg Technology.`
      },
      {
        heading: "Gaming & VR/AR",
        content: `USA: IGN (ign.com), GameSpot (gamespot.com), Kotaku (kotaku.com). VR/AR: Road to VR (roadtovr.com), Upload VR (uploadvr.com), Mixed Reality News. Industry: Gamasutra, GamesIndustry.biz, Game Developer. Meta Quest: Meta Quest Blog, Oculus Developer Blog.`
      },
      {
        heading: "Robotics & Automation",
        content: `IEEE Spectrum Robotics (spectrum.ieee.org/robotics), The Robot Report (therobotreport.com), Robotics Business Review (roboticsbusinessreview.com). Manufacturing: Automation World, Industrial Equipment News. Research: IROS, ICRA, IEEE Robotics.`
      },
      {
        heading: "Quantum Computing",
        content: `USA: Quantum Computing Report (quantumcomputingreport.com), Quantum Economic Development Consortium. Europe: Quantum Industry Coalition, European Quantum Flagship. Companies: IBM Quantum, Google Quantum AI, IonQ. Research: arXiv quant-ph, Quantum Journal.`
      },
      {
        heading: "Blockchain & Web3",
        content: `USA: CoinDesk (coindesk.com), The Block (theblockcrypto.com), Decrypt (decrypt.co). Technical: Ethereum.org, Bitcoin Magazine, Solana News. DeFi: DeFi Pulse, The Defiant. NFT: NFT Now, OpenSea Blog.`
      },
      {
        heading: "Semiconductors & Hardware",
        content: `USA: Semi Engineering (semiengineering.com), AnandTech, Tom's Hardware. Industry: Semiconductor Engineering, EE Times. Companies: NVIDIA Blog, AMD Community, Intel Newsroom. Supply Chain: DigiTimes, TrendForce.`
      },
      {
        heading: "Space Technology",
        content: `USA: SpaceNews (spacenews.com), Space.com, Ars Technica Space. Companies: SpaceX (spacex.com), Blue Origin (blueorigin.com), NASA (nasa.gov). Research: Space Policy, Acta Astronautica. Commercial: Payload, Supercluster.`
      },
      {
        heading: "Healthcare Technology",
        content: `USA: STAT News (statnews.com), Healthcare IT News, Medscape. AI Health: Nature Medicine, The Lancet Digital Health. Digital Health: Digital Health News, Rock Health. FDA: FDA Digital Health, FDA AI/ML.`
      },
      {
        heading: "Climate & Green Tech",
        content: `USA: Canary Media (canarymedia.com), Greentech Media (greentechmedia.com). International: Carbon Brief, Climate Home News. Energy: Utility Dive, Energy Storage News. Research: Nature Climate Change, Environmental Science.`
      },
      {
        heading: "Social Media & Marketing",
        content: `USA: Social Media Examiner, Social Media Today, Mashable Social. Marketing: HubSpot Blog, Neil Patel, Content Marketing Institute. Analytics: Sprout Social Blog, Hootsuite Blog, Buffer Blog. Influencer: Influencer Marketing Hub.`
      },
      {
        heading: "Country-Specific Tech News",
        content: `USA: TechCrunch, The Verge, Wired, Ars Technica. China: 36Kr, TechNode, PingWest, Sina Tech. Japan: TechCrunch Japan, ITmedia, Nikkei Tech. South Korea: The Korea Times Tech, ZDNet Korea. India: YourStory, Inc42, Analytics India. UK: The Register, TechCrunch UK, Wired UK. Germany: Heise, Golem, ComputerBase. France: Journal du Net, Presse-citron, Numerama. Singapore: Tech in Asia, e27, The Straits Times Tech. Australia: Startup News, Computerworld AU, ARN. Canada: BetaKit, IT World Canada, MobileSyrup. Brazil: Startuptecnologia, Canaltech, Olhar Digital. Africa: Disrupt Africa, TechCabal, Digest Africa. Middle East: Wamda, TechWadi, MENAbytes.`
      }
    ]
  },
  {
    id: "quick-reference",
    title: "Quick Reference Console",
    icon: "⚙️",
    category: "Roadmaps",
    description: "A concise quick-reference console with phases, time estimates, essential commands, and key statistics for AI development.",
    sections: [
      {
        heading: "Overview",
        content: "This quick reference console provides a condensed overview of the AI Integration Engineer roadmap with phases, time estimates, essential commands, and key statistics. Use this as a desk reference for quick lookups."
      },
      {
        heading: "Learning Phases",
        content: "Phase 1: Foundations (Month 1-2) — Python basics, environment setup, LLM API calls, prompt engineering. 8 weeks. Phase 2: Integration (Month 3) — Building LLM apps, RAG systems, vector databases, streaming. 4 weeks. Phase 3: Agents (Month 4) — Agent frameworks, tool use, multi-agent systems, function calling. 4 weeks. Phase 4: Production (Month 5) — Security, monitoring, scaling, deployment, cost optimization. 4 weeks. Phase 5: Advanced (Month 6) — Fine-tuning, multi-modal, capstone project, portfolio building. 4 weeks."
      },
      {
        heading: "Time Investment",
        content: "Total Duration: 24 weeks (6 months). Weekly Commitment: 15-20 hours recommended. Daily Practice: 2-3 hours per day. Weekend Projects: 4-6 hours on weekends. Total Hours: 360-480 hours total."
      },
      {
        heading: "Essential Commands",
        content: "Python: python -m venv venv && source venv/bin/activate, pip install -r requirements.txt, python main.py. Ollama: ollama pull llama3.1, ollama run llama3.1, ollama list. Git: git init, git add . && git commit -m message, git push origin main. Docker: docker build -t app ., docker run -p 8000:8000 app, docker-compose up -d."
      },
      {
        heading: "API Quick Reference",
        content: "OpenAI: from openai import OpenAI; client = OpenAI(); response = client.chat.completions.create(model=gpt-4o, messages=[...]). Anthropic: import anthropic; client = anthropic.Anthropic(); response = client.messages.create(model=claude-3-5-sonnet-20241022, messages=[...]). Google: from google import genai; client = genai.Client(); response = client.models.generate_content(model=gemini-2.0-flash, contents=...). Ollama: import ollama; response = ollama.chat(model=llama3.1, messages=[...])."
      },
      {
        heading: "Key Statistics",
        content: "Average LLM API Cost: GPT-4o: .50/ per 1M tokens (input/output). Claude 3.5 Sonnet: / per 1M tokens. Gemini 1.5 Pro: .25/ per 1M tokens. Local Models: Free after hardware investment. Vector DB Pricing: Pinecone: Free tier + from /mo. ChromaDB: Free (self-hosted). Weaviate: Free tier + from /mo. Qdrant: Free tier + from /mo."
      },
      {
        heading: "Project Templates",
        content: "Month 1: CLI tools, web scrapers, API wrappers, file organizers. Month 2: Chatbots, prompt libraries, token counters, code review tools. Month 3: Document Q&A, RAG pipelines, embedding explorers, multi-modal apps. Month 4: AI agents, multi-agent systems, automation workflows, code generators. Month 5: Production chatbots, monitoring dashboards, security tools, cost optimizers. Month 6: Capstone project of your choice."
      },
      {
        heading: "Error Handling Patterns",
        content: "Rate Limits: Implement exponential backoff with retry. Max 3 retries. Initial delay 1s, max delay 30s. API Errors: Catch specific exceptions. Log error details. Return meaningful messages to users. Timeout: Set connection timeout 10s, read timeout 60s. Cache responses for repeated requests. Fallback Models: If primary model fails, try secondary. Ollama as last resort for local inference."
      },
      {
        heading: "Security Checklist",
        content: "Never commit API keys to git. Use environment variables or .env files. Implement input validation on all user inputs. Use parameterized queries for database access. Enable CORS only for trusted origins. Rate limit all public endpoints. Log security events for audit. Use HTTPS everywhere in production."
      },
      {
        heading: "Performance Benchmarks",
        content: "Streaming vs Non-streaming: Streaming reduces perceived latency by 60-80%. Vector Search: ChromaDB <10ms for 100K vectors. Pinecone <50ms for 1M vectors. Embedding Generation: text-embedding-3-small: ~50ms per document. LLM Response: GPT-4o: 1-3s first token. Claude 3.5: 1-2s first token. Cache Hit Rate Target: >40% for repeated queries."
      },
      {
        heading: "Deployment Checklist",
        content: "Environment Variables: All secrets in env vars, not code. Docker: Multi-stage build for smaller images. Health Checks: /health endpoint for monitoring. Logging: Structured JSON logging. Monitoring: Track latency, errors, costs. Rate Limiting: Per-user and global limits. Backup: Database backups before deployment. Rollback: Quick rollback plan ready."
      }
    ]
  },

  {
    id: "social-media-tools",
    title: "Social Media AI Tools 2026",
    icon: "📱",
    category: "Tools & Catalogs",
    description: "AI tools organized by social media platform including TikTok, YouTube, Instagram, Twitter/X, LinkedIn, and more.",
    sections: [
      {
        heading: "Overview",
        content: "This directory covers AI tools organized by social media platform. Each section includes tools for content creation, scheduling, analytics, and engagement specific to that platform. All tools verified as of 2026."
      },
      {
        heading: "TikTok AI Tools",
        content: "CapCut - Free video editor with AI effects, transitions, captions. Official TikTok tool. Predis.ai - AI TikTok content creation, scheduling, analytics. From $29/mo. Opus Clip - AI viral clip generator from long videos. Free + $9/mo. Vizard AI - AI video repurposing for TikTok. Free + paid. TikTok Creative Center - Trending sounds, hashtags, effects. Free. ChatGPT - Script writing, hook generation, caption ideas. Free + $20/mo. Canva AI - TikTok templates, thumbnails, text overlays. Free + Pro."
      },
      {
        heading: "YouTube AI Tools",
        content: "TubeBuddy - YouTube SEO, keyword research, A/B testing. Free + from $7.50/mo. VidIQ - YouTube analytics, keyword research, competitor tracking. Free + from $7.50/mo. Descript - Video/podcast editing with text-based editing. Free + $24/mo. Opus Clip - Extract viral clips from long YouTube videos. Free + $9/mo. Pictory - Blog/article to YouTube video. From $19/mo. InVideo AI - AI YouTube video creation with templates. Free + $25/mo. Synthesia - AI avatar YouTube videos. From $22/mo. ElevenLabs - AI voiceovers for YouTube. Free + from $5/mo."
      },
      {
        heading: "Instagram AI Tools",
        content: "Later - Instagram scheduling, analytics, link in bio. Free + from $16/mo. Buffer - Simple scheduling, AI assistant. Free + from $6/mo. Canva AI - Instagram posts, stories, reels templates. Free + Pro. Midjourney - AI image generation for Instagram content. From $10/mo. ChatGPT - Caption writing, hashtag research, content ideas. Free + $20/mo. Flick - Instagram hashtag research and analytics. From $11/mo. Preview - Instagram feed planning, analytics. Free + from $8/mo."
      },
      {
        heading: "Twitter/X AI Tools",
        content: "Typefully - AI tweet/thread writing, scheduling, analytics. Free + from $12/mo. Hypefury - Tweet scheduling, engagement analytics, growth tools. From $19/mo. Buffer - Tweet scheduling, AI assistant. Free + from $6/mo. ChatGPT - Tweet writing, thread creation, engagement hooks. Free + $20/mo. TweetHunter - AI tweet ideas, scheduling, analytics. From $49/mo. SocialPilot - Twitter management, analytics. From $30/mo."
      },
      {
        heading: "LinkedIn AI Tools",
        content: "Taplio - AI LinkedIn content, post scheduling, analytics. From $49/mo. Shield - LinkedIn analytics, personal dashboard. From $8/mo. AuthoredUp - LinkedIn content creation, hooks, formatting. Free + paid. ChatGPT - LinkedIn post writing, professional content. Free + $20/mo. Supergrow - LinkedIn content ideas, post generation. Free + paid. Sales Navigator - LinkedIn sales intelligence. From $99/mo."
      },
      {
        heading: "Facebook AI Tools",
        content: "Meta Business Suite - Facebook page management, scheduling, insights. Free. Buffer - Facebook post scheduling, AI assistant. Free + from $6/mo. Canva AI - Facebook post templates, cover photos. Free + Pro. ChatGPT - Facebook content writing, ad copy. Free + $20/mo. SocialPilot - Facebook scheduling, analytics. From $30/mo."
      },
      {
        heading: "Pinterest AI Tools",
        content: "Tailwind - Pinterest scheduling, SmartSchedule, analytics. Free + from $14.99/mo. Canva AI - Pin templates, Pinterest graphics. Free + Pro. ChatGPT - Pin descriptions, board names, keyword research. Free + $20/mo. Pinterest Trends - Trending topics and searches. Free. Viraltag - Pinterest scheduling, visual marketing. From $24/mo."
      },
      {
        heading: "Cross-Platform AI Tools",
        content: "Hootsuite - Multi-platform management, AI writing, analytics. From $99/mo. Buffer - Simple multi-platform scheduling. Free + from $6/mo. Sprout Social - Enterprise social management, AI insights. From $249/mo. SocialBee - Content categories, recycling, AI assistant. From $29/mo. MeetEdgar - Content recycling, evergreen posting. From $29/mo. Publer - Multi-platform scheduling, AI assist. Free + from $12/mo. RecurPost - Content recycling, scheduling. From $25/mo."
      },
      {
        heading: "AI Content Generation for Social",
        content: "ChatGPT - General content generation, ideas, captions. Free + $20/mo. Claude - Nuanced writing, long-form content. Free + $20/mo. Jasper - Marketing-focused AI copy. From $39/mo. Copy.ai - Social media copy templates. Free + $49/mo. Writesonic - Blog posts, ads, social copy. Free + from $16/mo. Rytr - Quick social media copy. Free + $9/mo. Lately AI - Social media content from long-form. Enterprise pricing."
      },
      {
        heading: "Social Media Analytics AI",
        content: "Sprinklr - Enterprise social analytics and listening. Enterprise pricing. Brandwatch - Social listening, sentiment analysis. Enterprise pricing. Meltwater - Media intelligence, social monitoring. Enterprise pricing. Talkwalker - Social analytics, visual insights. Enterprise pricing. Quintly - Social media analytics, benchmarking. From $345/mo. Iconosquare - Instagram and Facebook analytics. From $49/mo."
      }
    ]
  },

  {
    id: "chinese-speaking",
    title: "Chinese Speaking Words Reference",
    icon: "🇨🇳",
    category: "Language References",
    description: "Essential Chinese vocabulary and phrases organized by category including greetings, numbers, survival phrases, and more.",
    sections: [
      {
        heading: "Overview",
        content: "This reference covers essential Chinese (Mandarin) vocabulary and phrases organized by category. Includes pinyin pronunciation, Chinese characters, and English translations. Useful for travelers and beginners."
      },
      {
        heading: "Greetings",
        content: "Ni hao - Hello. Zao shang hao - Good morning. Wan shang hao - Good evening. Zai jian - Goodbye. Ming tian jian - See you tomorrow. Xie xie - Thank you. Bu ke qi - You're welcome. Dui bu qi - I'm sorry. Mei guan xi - It's okay. Qing wen - Excuse me."
      },
      {
        heading: "Numbers",
        content: "Yi - One. Er - Two. San - Three. Si - Four. Wu - Five. Liu - Six. Qi - Seven. Ba - Eight. Jiu - Nine. Shi - Ten. Bai - Hundred. Qian - Thousand. Wan - Ten thousand."
      },
      {
        heading: "Common Phrases",
        content: "Wo yao zhe ge - I want this. Duo shao qian? - How much? Tai gui le - Too expensive. Pian yi dian - A little cheaper. Wo bu dong - I don't understand. Ni hui shuo ying wen ma? - Do you speak English? Wo shi mei guo ren - I am American. Wo lai zi zhong guo - I come from China. Zhe ge hen hao - This is very good. Wo xi huan - I like."
      },
      {
        heading: "Food and Dining",
        content: "Wo e le - I'm hungry. Wo ke le - I'm thirsty. Cai dan - Menu. Wo yao dian cai - I want to order. Mian tiao - Noodles. Mi fan - Rice. Shui jiao - Dumplings. Cha - Tea. Pi jiu - Beer. Shui - Water. Mai dan - Bill please. Hao chi - Delicious."
      },
      {
        heading: "Directions and Transportation",
        content: "Zuo bian - Left side. You bian - Right side. Zhi zou - Go straight. Na li - Where? Zhe li - Here. Na li - There. Di tie - Subway. Gong jiao che - Bus. Chu zu che - Taxi. Fei ji - Airport. Huo che - Train. Jiu dian - Hotel. Yi yuan - Hospital."
      },
      {
        heading: "Time and Calendar",
        content: "Jin tian - Today. Ming tian - Tomorrow. Zuo tian - Yesterday. Shang wu - Morning. Xia wu - Afternoon. Wan shang - Evening. Xing qi yi - Monday. Xing qi er - Tuesday. Xing qi san - Wednesday. Xing qi si - Thursday. Xing qi wu - Friday. Xing qi liu - Saturday. Xing qi tian - Sunday."
      },
      {
        heading: "Emergency Phrases",
        content: "Bang mang! - Help! Jing cha - Police. Yi sheng - Doctor. Wo sheng bing le - I'm sick. Wo diu le dong xi - I lost something. Wo de hu zhao - My passport. Wo yao da dian hua - I need to make a call. Zhu yuan - Hospital. Ling shi guan - Embassy."
      },
      {
        heading: "Shopping",
        content: "Wo xiang mai - I want to buy. Zhe ge duo shao qian? - How much is this? Ke yi shi ma? - Can I try? You da zhe ma? - Is there a discount? Tai da le - Too big. Tai xiao le - Too small. Wo yao da hao - I want large size. Wo yao xiao hao - I want small size."
      }
    ]
  },

  {
    id: "snowflake-learning",
    title: "Snowflake Learning Guide",
    icon: "❄️",
    category: "Project References",
    description: "Comprehensive learning resources for Snowflake including YouTube channels, blogs, certification paths, and hands-on practice platforms.",
    sections: [
      {
        heading: "Overview",
        content: "This guide provides a comprehensive list of resources for learning Snowflake, the cloud data platform. Includes YouTube channels, blogs, certification paths, hands-on labs, and community resources."
      },
      {
        heading: "YouTube Channels",
        content: "Snowflake Official - Official Snowflake YouTube channel with tutorials, webinars, and product demos. Learn Snowflake - Independent tutorials and walkthroughs. Snowflake Community - Community-contributed content and tips. Data Engineering with Snowflake - Focused on data engineering patterns. Zack Data - Snowflake tips, tricks, and best practices."
      },
      {
        heading: "Official Documentation",
        content: "Snowflake Documentation - docs.snowflake.com. Comprehensive guides for all features. Snowflake Knowledge Base - knowledge.snowflake.com. Community Q&A. Snowflake Release Notes - Latest feature updates and changes. Snowflake Best Practices Guide - Recommended patterns and anti-patterns."
      },
      {
        heading: "Blogs and Articles",
        content: "Snowflake Blog - blog.snowflake.com. Official updates and use cases. Towards Data Science - Snowflake-related articles on Medium. Snowflake Cookbook - Practical recipes and patterns. Data Engineering Blog - Broader data engineering with Snowflake focus. Analytics Vidhya - Snowflake tutorials and guides."
      },
      {
        heading: "Certification Paths",
        content: "SnowPro Core Certification - Foundational Snowflake knowledge. Prerequisite for advanced certs. SnowPro Advanced: Architect - Architecture design and implementation. SnowPro Advanced: Data Engineer - Data pipeline and ETL design. SnowPro Advanced: Data Analyst - Analytics and reporting. SnowPro Advanced: Database Administrator - Administration and security. Snowflake Administrator - Hands-on admin skills."
      },
      {
        heading: "Hands-On Practice",
        content: "Snowflake Free Trial - trial.snowflake.com.  free credits. Hands-on Labs - labs.snowflake.com. Guided tutorials. Snowflake University - training.snowflake.com. Official courses. Snowflake on AWS/GCP/Azure - Cloud provider sandboxes. Snowflake Workshop - In-person and virtual workshops."
      },
      {
        heading: "Community Resources",
        content: "Snowflake Community - community.snowflake.com. Forums and Q&A. Snowflake Discourse - discourse.snowflake.com. Discussion boards. Snowflake User Groups - Local meetups and groups. Snowflake Partners - Consulting and implementation partners. Snowflake Marketplace - Third-party data and apps."
      },
      {
        heading: "Books and Courses",
        content: "Snowflake: The Definitive Guide - O'Reilly book on Snowflake. Udemy Snowflake Courses - Various instructor-led courses. Coursera Data Engineering - Broader data engineering with Snowflake modules. LinkedIn Learning Snowflake - Professional development courses. Pluralsight Snowflake Paths - Skill-based learning paths."
      },
      {
        heading: "Key Topics to Master",
        content: "Architecture - Virtual warehouses, databases, schemas, stages. SQL - Snowflake SQL dialect, functions, stored procedures. Data Loading - COPY INTO, Snowpipe, external tables. Data Transformation - Tasks, streams, procedures, UDFs. Security - Role-based access, encryption, network policies. Performance - Clustering, materialized views, query optimization. Administration - Account management, resource monitors, billing."
      }
    ]
  }
]



export const REFERENCE_CATEGORIES = [
  { id: "all", label: "All Documents", icon: "📚" },
  { id: "Roadmaps", label: "Roadmaps", icon: "🗺️" },
  { id: "Tools & Catalogs", label: "Tools & Catalogs", icon: "🔧" },
  { id: "Tech News Sources", label: "Tech News Sources", icon: "📰" },
  { id: "Project References", label: "Project References", icon: "📊" },
  { id: "Language References", label: "Language References", icon: "🌍" }
];
