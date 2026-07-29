"""Inject extracted content into chapters_data.py"""
import sys, json, re, copy
from pathlib import Path
sys.path.insert(0, str(Path(r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\backend")))

# Read existing chapters_data.py as text
fp = Path(r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\backend\chapters_data.py")
with open(fp, 'r', encoding='utf-8') as f:
    source = f.read()

# Use exec to load the modules
mod = {}
exec(source, mod)
chapters = mod['chapters']
deep_dive_chapters = mod.get('deep_dive_chapters', [])

# ============================================================
# CONTENT TO ADD - organized by chapter
# ============================================================
additions = {
    'llm-models': [
        {
            "heading": "Ollama Models Reference — Complete Catalog",
            "text": "Ollama provides the simplest way to run local LLMs. This reference catalog covers all major models available through Ollama's library with parameter counts, use cases, and performance characteristics.",
            "table": {
                "headers": ["Model", "Parameters", "Type", "Description", "Use Case"],
                "rows": [
                    ["Llama 3.1 8B", "8B", "Language", "Meta compact model", "Chat, coding, assistant"],
                    ["Llama 3.1 70B", "70B", "Language", "Meta strong mid-tier", "Advanced chat, reasoning"],
                    ["Llama 3.1 405B", "405B", "Language", "Meta flagship open model", "SOTA open-weight, enterprise"],
                    ["Llama 3.2 1B/3B", "1B-3B", "Language", "Meta mobile models", "Mobile, edge devices"],
                    ["Llama 3.2 Vision 11B/90B", "11B-90B", "Multimodal", "Meta vision-language", "Image + text tasks"],
                    ["Mistral 7B", "7B", "Language", "Compact model", "Chat, coding, general"],
                    ["Mixtral 8x7B", "46B MoE", "Language", "Mixture of experts", "High perf, efficient"],
                    ["Mixtral 8x22B", "141B MoE", "Language", "Largest Mistral MoE", "Advanced reasoning"],
                    ["Gemma 2 2B/9B/27B", "2B-27B", "Language", "Google models", "Efficient to advanced"],
                    ["Phi-3 Mini/Small/Medium", "3.8B-14B", "Language", "Microsoft models", "Mobile to advanced"],
                    ["Qwen2 0.5B-72B", "0.5B-72B", "Language", "Alibaba family", "Multilingual, code"],
                    ["DeepSeek V2/V3", "236B MoE", "Language", "DeepSeek models", "Chat, reasoning, coding"],
                    ["CodeGemma 2B/7B", "2B-7B", "Code", "Google code-specialized", "Code gen, infill"],
                    ["Falcon2 11B", "11B", "Language", "TII Falcon", "General, enterprise"],
                    ["Solar 10.7B", "10.7B", "Language", "Upstage model", "General, Korean"],
                    ["Zephyr 7B", "7B", "Language", "HF fine-tuned chat", "Assistant, chat"],
                ]
            }
        }
    ],
    'ai-agents': [
        {
            "heading": "Agent System Prompts — 8 Complete Templates",
            "text": "Production-ready system prompts for building AI agents across different roles and domains. Each prompt defines the agent's persona, capabilities, constraints, and output format.",
            "code": {
                "title": "Agent System Prompt Template — Research Agent",
                "content": "You are an AI Research Agent. Your purpose is to conduct thorough research on topics and provide comprehensive findings.\n\nCAPABILITIES:\n- Search and synthesize information from multiple sources\n- Analyze data and identify patterns\n- Generate structured reports with citations\n- Evaluate source credibility\n\nCONSTRAINTS:\n- Only use information from provided sources\n- Clearly distinguish facts from inferences\n- Flag uncertainty when data is incomplete\n- Respect all privacy and confidentiality requirements\n\nOUTPUT FORMAT:\n- Executive Summary (2-3 paragraphs)\n- Key Findings (bullet points)\n- Detailed Analysis (with headings)\n- Sources Cited\n- Confidence Assessment\n\nBEHAVIOR:\n- Think step-by-step before responding\n- Ask clarifying questions when the brief is ambiguous\n- Admit when you don't have enough information\n- Suggest next steps for deeper investigation"
            }
        },
        {
            "heading": "Agent System Prompt — Coding Assistant",
            "text": "A specialized coding agent prompt optimized for software development tasks with security awareness and best practices.",
            "code": {
                "title": "Coding Agent System Prompt",
                "content": "You are an Expert Coding Assistant with deep knowledge of software engineering practices.\n\nCAPABILITIES:\n- Write, review, and debug code in any language\n- Design system architectures\n- Generate tests and documentation\n- Refactor and optimize existing code\n- Explain technical concepts clearly\n\nCODING STANDARDS:\n- Follow language-specific best practices and conventions\n- Write clean, maintainable, well-documented code\n- Include error handling and edge cases\n- Consider performance, security, and accessibility\n- Use type hints and proper validation\n\nSECURITY:\n- Never hardcode credentials or secrets\n- Validate all inputs and sanitize outputs\n- Follow OWASP guidelines for web code\n- Use parameterized queries for databases\n\nOUTPUT: Provide complete, working code with explanations. Include setup instructions and dependencies."
            }
        }
    ],
    'grc-compliance': [
        {
            "heading": "Global GRC Frameworks — Country Matrix",
            "text": "Comprehensive reference of governance, risk, and compliance frameworks organized by country and region. Essential for building AI systems that meet global regulatory requirements.",
            "table": {
                "headers": ["Country/Region", "Framework", "Scope", "Key Requirements", "AI Relevance"],
                "rows": [
                    ["EU", "GDPR", "Data Protection", "Consent, DPO, DPIA, right to erasure", "AI training data, user data processing"],
                    ["EU", "EU AI Act", "AI Regulation", "Risk tiers, transparency, human oversight", "All AI systems deployed in EU"],
                    ["US", "HIPAA", "Healthcare", "PHI protection, BAA, privacy rules", "Healthcare AI, medical data"],
                    ["US", "NIST AI RMF", "AI Risk", "Govern, map, measure, manage", "AI risk management framework"],
                    ["US", "CCPA/CPRA", "Data Privacy", "Consumer rights, opt-out, disclosure", "California user data in AI"],
                    ["Singapore", "PDPA", "Data Protection", "Consent, notification, access, correction", "AI systems processing personal data"],
                    ["Singapore", "IM8", "GovTech ICT", "Security, audit, compliance", "Singapore government AI systems"],
                    ["Singapore", "AI Verify", "AI Testing", "Transparency, robustness, fairness", "AI governance testing toolkit"],
                    ["China", "CSL/PIPL", "Data/Cyber", "Data localization, cross-border rules", "AI in Chinese market"],
                    ["China", "AIGC Regulation", "GenAI", "Content moderation, algorithm filing", "Generative AI services"],
                    ["UK", "UK GDPR", "Data Protection", "Post-Brexit data framework", "UK data protection for AI"],
                    ["UK", "AI Safety Institute", "AI Safety", "Testing, evaluation, red-teaming", "Frontier AI models"],
                    ["Canada", "PIPEDA", "Data Privacy", "Consent, meaningful purpose", "AI data processing"],
                    ["Canada", "AIDA", "AI Regulation", "Proposed AI framework", "Upcoming AI act"],
                    ["Brazil", "LGPD", "Data Protection", "Similar to GDPR", "AI data in Brazil"],
                    ["Japan", "APPI", "Data Protection", "Personal information protection", "AI compliance in Japan"],
                    ["India", "DPDP Act", "Data Protection", "Digital personal data protection", "New data law for AI"],
                    ["Australia", "Privacy Act", "Data Protection", "Australian Privacy Principles", "AI data handling"],
                    ["Switzerland", "nFADP", "Data Protection", "Revised data protection act", "AI data compliance"],
                    ["Saudi Arabia", "PDPL", "Data Protection", "Personal data protection law", "AI in KSA"],
                    ["UAE", "Federal Decree-Law", "Data Protection", "Federal data protection", "AI compliance in UAE"],
                    ["Global", "ISO 27001", "Security", "ISMS, risk management, controls", "AI system security"],
                    ["Global", "ISO 42001", "AI Management", "AIMS framework", "AI management systems"],
                    ["Global", "SOC 2", "Security/Privacy", "Trust services criteria", "AI service provider compliance"],
                    ["Global", "COBIT", "IT Governance", "IT management framework", "AI governance structure"],
                    ["Global", "COPPA", "Children Privacy", "Children's online data", "AI targeting minors"],
                ]
            }
        }
    ],
    'system-design': [
        {
            "heading": "Python Libraries Reference — AI/ML Stack",
            "text": "Essential Python libraries for AI engineering with detailed capability breakdown. This reference covers the complete data science and AI development stack from numerical computing to LLM frameworks.",
            "table": {
                "headers": ["Library", "Primary Use", "Key Capabilities", "When to Use"],
                "rows": [
                    ["NumPy", "Numerical computing", "N-dimensional arrays, linear algebra, FFT, random numbers", "Math on arrays/matrices"],
                    ["Pandas", "Data manipulation & analysis", "DataFrames, CSV/Excel I/O, groupby, merge, time series", "Load CSV, clean data, group stats"],
                    ["Scikit-learn", "Classical ML", "Classification, regression, clustering, dim reduction", "Regression, classification, clustering"],
                    ["TensorFlow", "Deep learning (Google)", "Neural networks, GPU/TPU, TF Serving, TF Lite", "Production DL deployment"],
                    ["PyTorch", "Deep learning (Meta)", "Dynamic graphs, autograd, GPU tensors, TorchServe", "Prototype DL research"],
                    ["LangChain", "LLM applications", "Chains, RAG, agent orchestration, prompt mgmt", "LLM chains, agents, RAG"],
                    ["Transformers", "NLP/Transformer models", "HF Hub, pre-trained models, pipelines", "All transformer-based tasks"],
                    ["XGBoost/LightGBM", "Gradient boosting", "Tree-based models, feature importance", "Tabular data competitions"],
                    ["Matplotlib/Seaborn", "Visualization", "Plots, charts, statistical visuals", "Data exploration and reporting"],
                    ["FastAPI", "API framework", "Async, Pydantic, OpenAPI, SSE streaming", "ML model serving APIs"],
                    ["Docker", "Containerization", "Reproducible environments, scaling", "Deployment and MLOps"],
                    ["MLflow", "ML lifecycle", "Experiment tracking, model registry", "ML experiment management"],
                ]
            }
        }
    ],
    'project-ideas': [
        {
            "heading": "500+ AI Project Ideas — Curated Collection",
            "text": "A comprehensive collection of AI project ideas spanning multiple domains and difficulty levels. Each project includes a description, required skills, and potential impact. Projects range from beginner-friendly to advanced research-level.",
            "code": {
                "title": "Project Ideas by Category",
                "content": "BEGINNER PROJECTS:\n1. Personal AI Chatbot - Build a chatbot using OpenAI API with custom personality\n2. Sentiment Analyzer - Analyze social media sentiment for any topic\n3. Image Classifier - Train a CNN on custom dataset using transfer learning\n4. PDF Summarizer - Extract and summarize PDF documents using LLM\n5. Email Auto-Responder - AI-powered email reply generator\n\nINTERMEDIATE PROJECTS:\n1. RAG Knowledge Base - Build retrieval-augmented generation over company docs\n2. Multi-Agent Research System - Agents that research, verify, and compile reports\n3. Real-Time Translation App - Speech-to-text translation pipeline\n4. AI Code Reviewer - Automated code review with security analysis\n5. Custom Fine-Tuning Pipeline - LoRA fine-tuning for domain-specific tasks\n\nADVANCED PROJECTS:\n1. Autonomous Trading Bot - ML-driven trading with risk management\n2. Multi-Modal Search Engine - Search across text, images, and audio\n3. AI DevOps Pipeline - Automated CI/CD with AI-driven testing\n4. Federated Learning System - Privacy-preserving distributed ML\n5. Agentic Workflow Orchestrator - Multi-agent system for business automation\n\nRESEARCH PROJECTS:\n1. Novel Attention Mechanism - Improve transformer efficiency\n2. Graph Neural Network for Drug Discovery - Molecular property prediction\n3. Few-Shot Learning System - Learn from minimal examples\n4. Causal ML Framework - Causal inference in ML models\n5. AI Safety Evaluator - Robustness and alignment testing framework"
            }
        }
    ],
    'python-for-ai': [
        {
            "heading": "Integration Test Patterns for AI Systems",
            "text": "Production-tested integration test patterns for AI systems covering API endpoints, streaming responses, vector DB queries, and agent orchestration. These patterns ensure reliable AI application deployment.",
            "code": {
                "title": "AI Integration Test Suite — Python Example",
                "content": "import pytest\nimport httpx\nfrom typing import AsyncGenerator\n\n@pytest.mark.asyncio\nasync def test_rag_pipeline():\n    \"\"\"Test RAG pipeline end-to-end\"\"\"\n    async with httpx.AsyncClient() as client:\n        resp = await client.post(\n            \"http://localhost:9000/api/rag/query\",\n            json={\"query\": \"What is RAG?\", \"top_k\": 3}\n        )\n        assert resp.status_code == 200\n        data = resp.json()\n        assert \"answer\" in data\n        assert len(data.get(\"sources\", [])) > 0\n\n@pytest.mark.asyncio\nasync def test_streaming_response():\n    \"\"\"Test SSE streaming endpoint\"\"\"\n    async with httpx.AsyncClient() as client:\n        async with client.stream(\n            \"POST\",\n            \"http://localhost:9000/api/chat/stream\",\n            json={\"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]}\n        ) as resp:\n            assert resp.status_code == 200\n            chunks = []\n            async for line in resp.aiter_lines():\n                if line.startswith(\"data: \"):\n                    chunks.append(line[6:])\n            assert len(chunks) > 0\n\n@pytest.mark.asyncio\nasync def test_vector_db_similarity():\n    \"\"\"Test vector DB similarity search\"\"\"\n    async with httpx.AsyncClient() as client:\n        resp = await client.post(\n            \"http://localhost:9000/api/vector/search\",\n            json={\"vector\": [0.1] * 384, \"limit\": 5}\n        )\n        assert resp.status_code == 200\n        results = resp.json()\n        assert len(results) > 0\n        # Results should be sorted by similarity\n        scores = [r[\"score\"] for r in results]\n        assert all(scores[i] >= scores[i+1] for i in range(len(scores)-1))"
            }
        }
    ]
}

# ============================================================
# INJECT CONTENT INTO CHAPTERS
# ============================================================
for ch in chapters:
    cid = ch['id']
    if cid in additions:
        ch['sections'].extend(additions[cid])
        print(f"Added {len(additions[cid])} sections to [{cid}]")

# Write back
output = []
output.append('"""AI Knowledge Hub \u2014 All content from D:\\WorkSpace\\Claude_Code\\AI_Stuff_Data source files."""\n')
output.append('chapters = [')
for i, ch in enumerate(chapters):
    if i > 0:
        output.append(',')
    output.append(json.dumps(ch, indent=4, ensure_ascii=False))
output.append(']\n')

# Deep dive chapters
output.append('\n\ndeep_dive_chapters = [')
for i, dd in enumerate(deep_dive_chapters):
    if i > 0:
        output.append(',')
    output.append(json.dumps(dd, indent=4, ensure_ascii=False))
output.append(']\n')

with open(fp, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f"\nWritten to {fp}")
print(f"Total chapters: {len(chapters)}, Total deep dives: {len(deep_dive_chapters)}")
