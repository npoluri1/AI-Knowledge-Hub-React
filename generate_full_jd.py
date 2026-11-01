"""Generate full JD cards with design patterns for top AI jobs - Part 1: Pattern definitions"""
import json

# Design pattern templates
PATTERNS = {
    'LLM': {'name': 'LLM Inference Pattern', 'cat': 'Model Patterns', 'techs': 'vLLM, TensorRT-LLM, TGI', 'desc': 'Production LLM serving with optimized inference pipelines, batching, KV-cache, and speculative decoding.', 'flow': 'Prompt > Tokenize > KV Cache > Parallel Decode > Detokenize'},
    'RAG': {'name': 'Retrieval-Augmented Generation', 'cat': 'Architecture Patterns', 'techs': 'Vector DB, Embeddings, Cross-Encoders', 'desc': 'Combining LLM generation with document retrieval for grounded, accurate responses with citations.', 'flow': 'Query > Embed > Retrieve > Rerank > Context > Generate'},
    'LangChain': {'name': 'Chain Orchestration Pattern', 'cat': 'Application Patterns', 'techs': 'LangChain, LangGraph, LlamaIndex', 'desc': 'Composable chains for complex LLM workflows with memory, tools, and conditional routing.', 'flow': 'Input > Router > Chain > Tool Use > Memory > Output'},
    'Agentic': {'name': 'Agentic AI Pattern', 'cat': 'Agent Patterns', 'techs': 'LangGraph, CrewAI, AutoGen, MCP', 'desc': 'Autonomous agents with planning, tool use, self-reflection, and multi-step reasoning.', 'flow': 'Goal > Plan > Act > Observe > Reflect > Iterate'},
    'Fine-tuning': {'name': 'Fine-Tuning Pattern', 'cat': 'Model Patterns', 'techs': 'LoRA, PEFT, DeepSpeed, FSDP', 'desc': 'Customizing foundation models for domain-specific tasks with parameter-efficient training.', 'flow': 'Data > Preprocess > LoRA/PEFT > Train > Evaluate > Deploy'},
    'MLOps': {'name': 'MLOps Pattern', 'cat': 'Platform Patterns', 'techs': 'MLflow, Kubeflow, Airflow, CI/CD', 'desc': 'End-to-end ML lifecycle management with automated pipelines, monitoring, and governance.', 'flow': 'Data > Feature Eng > Train > Validate > Deploy > Monitor'},
    'Multi-Agent': {'name': 'Multi-Agent Orchestration', 'cat': 'Agent Patterns', 'techs': 'LangGraph, CrewAI, AutoGen', 'desc': 'Coordinating multiple specialized agents for complex task decomposition and synthesis.', 'flow': 'Task > Router > Agent A + B + C > Synthesize > Output'},
    'Guardrails': {'name': 'AI Safety Guardrails', 'cat': 'Safety Patterns', 'techs': 'NeMo Guardrails, Content Moderation, Filtering', 'desc': 'Content filtering, bias detection, toxicity prevention, and safety mechanisms.', 'flow': 'Input > Input Rails > Generate > Output Rails > Safe Output'},
    'Embeddings': {'name': 'Embedding & Vector Pattern', 'cat': 'Data Patterns', 'techs': 'Sentence Transformers, Pinecone, pgvector', 'desc': 'Vector embeddings for semantic search, clustering, and similarity matching at scale.', 'flow': 'Text > Encode > Vector Store > Index > ANN Search > Results'},
    'Prompt Eng': {'name': 'Prompt Engineering Pattern', 'cat': 'Application Patterns', 'techs': 'Templates, Few-shot, Chain-of-Thought', 'desc': 'Systematic prompt design for optimal LLM performance, consistency, and reliability.', 'flow': 'Task Analysis > Template Design > Few-shot Examples > Test > Deploy'},
    'Conversational': {'name': 'Conversational AI Pattern', 'cat': 'Application Patterns', 'techs': 'LLM, Memory, State Management', 'desc': 'Multi-turn dialogue systems with context window management and personalization.', 'flow': 'Input > Context Assembly > Memory Lookup > Generate > Respond > Store'},
    'Feature Store': {'name': 'Feature Store Pattern', 'cat': 'Platform Patterns', 'techs': 'Feast, Tecton, Featureform', 'desc': 'Centralized feature repository for consistent training and real-time serving.', 'flow': 'Source > Compute > Store > Version > Serve > Monitor'},
    'Model Registry': {'name': 'Model Registry Pattern', 'cat': 'Platform Patterns', 'techs': 'MLflow, SageMaker, Vertex AI', 'desc': 'Versioned model catalog with lineage, metadata, and approval workflows.', 'flow': 'Train > Register > Review > Approve > Deploy > Track'},
    'Shadow Deploy': {'name': 'Shadow Deployment Pattern', 'cat': 'Deployment Patterns', 'techs': 'Canary, A/B Testing, Monitoring', 'desc': 'Run new models alongside production without affecting users for safe validation.', 'flow': 'Traffic > Split > Shadow Mode > Compare Metrics > Promote'},
    'Drift Detection': {'name': 'Data Drift Detection', 'cat': 'Monitoring Patterns', 'techs': 'Evidently, WhyLabs, custom monitors', 'desc': 'Detect input distribution changes that degrade model performance over time.', 'flow': 'Baseline Data > Monitor > Statistical Test > Alert > Retrain'},
    'Streaming ML': {'name': 'Real-Time ML Pattern', 'cat': 'Infrastructure Patterns', 'techs': 'Kafka, Flink, Spark Streaming', 'desc': 'Low-latency ML inference on streaming data with feature computation.', 'flow': 'Stream > Feature Compute > Model Score > Decision > Action'},
    'Computer Vision': {'name': 'Computer Vision Pattern', 'cat': 'Model Patterns', 'techs': 'PyTorch, OpenCV, YOLO', 'desc': 'Deep learning for image/video understanding, detection, and generation.', 'flow': 'Image > Preprocess > Backbone > Head > Post-process > Output'},
    'NLP': {'name': 'NLP Pattern', 'cat': 'Model Patterns', 'techs': 'Transformers, spaCy, Hugging Face', 'desc': 'Natural language processing for classification, NER, summarization, and translation.', 'flow': 'Text > Tokenize > Transformer > Pool/Decode > Classification/Generation'},
    'Recommendation': {'name': 'Recommendation Pattern', 'cat': 'Application Patterns', 'techs': 'Embeddings, ANN, Ranking Models', 'desc': 'Personalized recommendations using collaborative filtering and semantic similarity.', 'flow': 'User Signal > Candidate Gen > Feature Aug > Ranking > Re-rank > Serve'},
    'Fraud Detection': {'name': 'Real-Time Fraud Detection', 'cat': 'Application Patterns', 'techs': 'Streaming ML, Rules Engine, Graph ML', 'desc': 'ML-based fraud detection with real-time scoring, graph analysis, and case management.', 'flow': 'Transaction > Feature Compute > Model Score > Rules > Alert > Investigate'},
    'Evaluations': {'name': 'Model Evaluation Framework', 'cat': 'Quality Patterns', 'techs': 'BLEU, ROUGE, LLM-as-Judge, Human Eval', 'desc': 'Multi-dimensional evaluation: automated metrics, human evaluation, fairness scoring.', 'flow': 'Test Set > Auto Metrics > LLM Judge > Human Review > Fairness Score'},
    'Data Pipeline': {'name': 'Data Pipeline Pattern', 'cat': 'Infrastructure Patterns', 'techs': 'Airflow, dbt, Spark', 'desc': 'Scalable data ingestion, transformation, and quality checks for ML workloads.', 'flow': 'Extract > Validate > Transform > Quality Check > Load > Catalog'},
    'Tool Use': {'name': 'Tool Use / Function Calling', 'cat': 'Agent Patterns', 'techs': 'OpenAI Functions, Anthropic Tools, MCP', 'desc': 'LLM-driven tool invocation for interacting with external systems and APIs.', 'flow': 'User Request > LLM Decision > Function Call > API Execute > Result > Response'},
    'Graph ML': {'name': 'Graph Neural Network Pattern', 'cat': 'Model Patterns', 'techs': 'PyG, DGL, Neo4j', 'desc': 'Graph-based ML for network analysis, fraud detection, and knowledge graphs.', 'flow': 'Graph > Node/Edge Features > GNN Layers > Embedding > Task Head'},
}

# Map tech keywords to pattern keys
TECH_MAP = {
    'llm': ['LLM', 'Prompt Eng'], 'large language model': ['LLM'],
    'rag': ['RAG'], 'retrieval': ['RAG'], 'langchain': ['LangChain'],
    'langgraph': ['LangChain', 'Multi-Agent'], 'llamaindex': ['RAG', 'LangChain'],
    'agentic': ['Agentic'], 'agent': ['Agentic'], 'multi-agent': ['Multi-Agent'],
    'fine-tun': ['Fine-tuning'], 'finetun': ['Fine-tuning'], 'lora': ['Fine-tuning'],
    'peft': ['Fine-tuning'], 'rlhf': ['Fine-tuning'], 'sft': ['Fine-tuning'],
    'mlops': ['MLOps'], 'mlflow': ['MLOps', 'Model Registry'],
    'kubeflow': ['MLOps'], 'airflow': ['MLOps', 'Data Pipeline'],
    'pinecone': ['Embeddings'], 'weaviate': ['Embeddings'], 'pgvector': ['Embeddings'],
    'qdrant': ['Embeddings'], 'chroma': ['Embeddings'], 'milvus': ['Embeddings'],
    'embedding': ['Embeddings'], 'vector': ['Embeddings'],
    'prompt engineer': ['Prompt Eng'], 'few-shot': ['Prompt Eng'],
    'conversational': ['Conversational'], 'chatbot': ['Conversational'],
    'dialogue': ['Conversational'], 'nlp': ['NLP'], 'natural language': ['NLP'],
    'computer vision': ['Computer Vision'], 'image': ['Computer Vision'],
    'object detection': ['Computer Vision'], 'yolo': ['Computer Vision'],
    'recommendation': ['Recommendation'], 'ranking': ['Recommendation'],
    'fraud': ['Fraud Detection'], 'anomaly': ['Fraud Detection'],
    'feature store': ['Feature Store'], 'model registry': ['Model Registry'],
    'shadow deploy': ['Shadow Deploy'], 'canary': ['Shadow Deploy'],
    'a/b testing': ['Shadow Deploy'], 'drift': ['Drift Detection'],
    'kafka': ['Streaming ML'], 'flink': ['Streaming ML'],
    'streaming': ['Streaming ML'], 'real-time': ['Streaming ML'],
    'guardrail': ['Guardrails'], 'safety': ['Guardrails'],
    'content moderation': ['Guardrails'], 'bias': ['Guardrails'],
    'evaluation': ['Evaluations'], 'bleu': ['Evaluations'],
    'tool use': ['Tool Use'], 'function call': ['Tool Use'], 'mcp': ['Tool Use'],
    'graph': ['Graph ML'], 'neo4j': ['Graph ML'],
    'pytorch': [], 'tensorflow': [], 'python': [], 'java': [],
    'kubernetes': ['MLOps'], 'docker': ['MLOps'], 'aws': ['MLOps'],
    'azure': ['MLOps'], 'gcp': ['MLOps'], 'terraform': ['MLOps'],
    'react': [], 'typescript': [], 'node.js': [], 'fastapi': [],
    'spark': ['Data Pipeline', 'MLOps'], 'dbt': ['Data Pipeline'],
    'hugging face': ['NLP', 'Computer Vision'], 'transformers': ['NLP'],
    'vllm': ['LLM'], 'tensorrt': ['LLM'], 'cuda': [], 'gpu': [],
    'openai': ['LLM'], 'anthropic': ['LLM'], 'claude': ['LLM'],
    'gpt': ['LLM'], 'gemini': ['LLM'], 'crewai': ['Multi-Agent'],
    'autogen': ['Multi-Agent'], 'gen ai': ['LLM', 'Prompt Eng'],
    'genai': ['LLM', 'Prompt Eng'], 'gen ai': ['LLM', 'Prompt Eng'],
    'machine learning': ['MLOps'], 'deep learning': ['NLP', 'Computer Vision'],
    'neural network': ['NLP', 'Computer Vision'],
    'data scien': ['Feature Store', 'MLOps'],
    'distributed system': ['MLOps'], 'microservice': ['MLOps'],
    'api': [], 'sql': [], 'nosql': [], 'redis': [],
}

def get_patterns(techs):
    """Get relevant patterns for a job's tech stack"""
    found = set()
    techs_str = ' '.join(techs).lower()
    for kw, patterns in TECH_MAP.items():
        if kw.lower() in techs_str:
            for p in patterns:
                found.add(p)
    if not found:
        found = {'LLM', 'MLOps'}  # defaults
    return [PATTERNS[p] for p in found if p in PATTERNS]

def gen_jd_card(job, idx):
    """Generate a full JD card HTML for a job"""
    title = job.get('title', '').replace('<', '&lt;').replace('>', '&gt;')
    company = job.get('company', '').replace('<', '&lt;').replace('>', '&gt;')
    techs = job.get('techs', [])
    salary = job.get('salary', '')
    desc = job.get('desc', '')[:200] if job.get('desc') else ''
    url = job.get('url', '')
    country = job.get('country', '')
    
    patterns = get_patterns(techs)
    
    # Tech tags HTML
    colors = ['', 'green', 'blue', 'orange', 'red']
    tech_html = ''.join(f'<span class="tech-item ai">{t}</span>' for t in techs[:8])
    
    # Design patterns HTML
    dp_cards = ''
    for p in patterns[:5]:
        dp_cards += f'''<div class="dp-card current"><div class="dp-name">{p['name']}</div>
<div class="dp-tech">{p['techs']}</div>
<div class="dp-usecase">{p['desc']}</div></div>'''
    
    # Flow diagram
    flow_items = patterns[0]['flow'].split(' > ') if patterns else ['Input', 'Process', 'Output']
    flow_html = ' > '.join(f'<div class="dp-flow-item">{f.strip()}</div>' for f in flow_items)
    flow_html = flow_html.replace(' &gt; ', ' <div class="dp-flow-arrow">&gt;</div> ')
    
    # Generate proper flow with arrows
    flow_parts = patterns[0]['flow'].split(' > ') if patterns else ['Input', 'Process', 'Output']
    flow_html = ''
    for i, f in enumerate(flow_parts):
        if i > 0:
            flow_html += '<div class="dp-flow-arrow">&rarr;</div>'
        flow_html += f'<div class="dp-flow-item">{f.strip()}</div>'
    
    card = f'''<div class="jd-card">
  <div class="jd-header">
    <div class="jd-title">{title}</div>
    <div class="jd-company">{company}</div>
    <div class="jd-meta">
      <div class="jd-meta-item"><div class="label">Salary</div><div class="value" style="color:#00ff88;">{salary}</div></div>
      <div class="jd-meta-item"><div class="label">Location</div><div class="value">{country}</div></div>
      <div class="jd-meta-item"><div class="label">Source</div><div class="value">Knowledge Hub</div></div>
    </div>
  </div>
  <div class="jd-block"><p style="color:#ccc; line-height:1.6;">{desc or 'AI/ML engineering role focusing on production AI systems, LLM applications, and intelligent automation.'}</p></div>
  <div class="jd-block"><h4>&#128736; Full Tech Stack</h4>
    <div class="tech-full">{tech_html}</div>
  </div>
  <div class="design-patterns-section">
    <h4>&#128736; Design Patterns &amp; Architecture ({company})</h4>
    <div class="dp-grid">{dp_cards}</div>
    <div class="dp-category"><div class="dp-category-title">&#128640; Architecture Flow</div>
      <div class="dp-flow">{flow_html}</div>
    </div>
  </div>
</div>'''
    return card

# Load jobs
with open('merged_ai_jobs.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Sort by salary (highest first)
def salary_sort(j):
    import re
    s = j.get('salary', '')
    nums = re.findall(r'[\d.]+', s.replace(',', ''))
    if not nums: return 0
    return max(float(n) for n in nums)

jobs.sort(key=salary_sort, reverse=True)

# Generate JD cards for ALL jobs
html_cards = []
for i, job in enumerate(jobs):
    html_cards.append(gen_jd_card(job, i))

output = '\n\n'.join(html_cards)
with open('generated_jd_cards.html', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Generated {len(html_cards)} JD cards with design patterns")
