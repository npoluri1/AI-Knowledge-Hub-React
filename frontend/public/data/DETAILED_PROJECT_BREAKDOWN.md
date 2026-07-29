# 🛠️ AI INTEGRATION ENGINEER - DETAILED PROJECT BREAKDOWN

## PROJECT TEMPLATE (Use This For Each Project)

```
PROJECT NAME: [Month X] [Project Title]
├─ Duration: XX hours
├─ Skills Gained: [List 5-7 key skills]
├─ Difficulty: Beginner/Intermediate/Advanced
├─ GitHub Repo: [project-name]
└─ Blog Post: [Title]

OVERVIEW
├─ What: One sentence description
├─ Why: Why is this important?
├─ How: High-level architecture
└─ Outcome: What you'll have built

TECHNICAL REQUIREMENTS
├─ Libraries: [List]
├─ Database: [PostgreSQL, MongoDB, etc.]
├─ APIs: [External services]
└─ Hosting: [Local, Railway, etc.]

WEEK-BY-WEEK BREAKDOWN
├─ Week 1: [Focus area]
│   ├─ Core: [What to understand]
│   ├─ Code: [What to write]
│   ├─ Time: XX hours
│   └─ Deliverable: [What you'll have]
└─ ... (repeat for each week)

SUCCESS CRITERIA
├─ Functional: [Does it work?]
├─ Testable: [Is it tested?]
├─ Documented: [Is it explained?]
└─ Deployed: [Is it live?]
```

---

## MONTH 1: LLM FUNDAMENTALS

### Project 1.1: Token Counter & Cost Calculator

```
PROJECT NAME: Token Counter & Cost Calculator
├─ Duration: 8 hours
├─ Skills: API integration, token counting, cost calculation
├─ Difficulty: Beginner
└─ GitHub: token-counter

OVERVIEW
├─ What: Tool that counts tokens for different models (GPT-4, Claude, Llama)
├─ Why: Token counting is critical for cost prediction
├─ How: Accept text input → pass to different APIs → count tokens → calculate cost
└─ Outcome: Interactive dashboard + Python module

STRUCTURE
```
token-counter/
├── src/
│   ├── __init__.py
│   ├── counters/
│   │   ├── __init__.py
│   │   ├── openai_counter.py      # GPT-4, GPT-3.5
│   │   ├── anthropic_counter.py   # Claude models
│   │   └── ollama_counter.py      # Local models
│   ├── cost_calculator.py         # $ per 1K tokens
│   └── models.py                  # Pydantic models
├── tests/
│   ├── __init__.py
│   ├── test_openai_counter.py
│   ├── test_anthropic_counter.py
│   └── test_cost_calculator.py
├── app.py                         # Streamlit or FastAPI
├── requirements.txt
├── README.md
└── .gitignore
```

WEEK 1 IMPLEMENTATION
```python
# src/counters/openai_counter.py
import tiktoken

class OpenAICounter:
    def __init__(self, model_name: str = "gpt-4"):
        self.model_name = model_name
        self.encoding = tiktoken.encoding_for_model(model_name)
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text using OpenAI's tokenizer"""
        return len(self.encoding.encode(text))

# src/cost_calculator.py
COSTS_PER_1K_TOKENS = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
    "claude-3-5-sonnet": {"input": 0.003, "output": 0.015},
}

class CostCalculator:
    @staticmethod
    def calculate(model: str, input_tokens: int, output_tokens: int) -> dict:
        rates = COSTS_PER_1K_TOKENS.get(model, {})
        input_cost = (input_tokens / 1000) * rates["input"]
        output_cost = (output_tokens / 1000) * rates["output"]
        return {
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "input_cost": round(input_cost, 4),
            "output_cost": round(output_cost, 4),
            "total_cost": round(input_cost + output_cost, 4),
        }

# app.py (FastAPI)
from fastapi import FastAPI
from src.counters.openai_counter import OpenAICounter
from src.cost_calculator import CostCalculator

app = FastAPI()

@app.post("/count-tokens")
def count_tokens(text: str, model: str = "gpt-4"):
    counter = OpenAICounter(model)
    tokens = counter.count_tokens(text)
    # Assume output is 2x input for estimation
    cost = CostCalculator.calculate(model, tokens, tokens * 2)
    return cost
```

DELIVERABLES
- ✅ GitHub repo with clean structure
- ✅ Test file with 10+ test cases
- ✅ README with usage examples
- ✅ Comparison table (tokens per model)
```

---

### Project 1.2: Model Comparison Framework

```
PROJECT NAME: Model Comparison Framework
├─ Duration: 12 hours
├─ Skills: API integration, benchmarking, evaluation
├─ Difficulty: Intermediate
└─ GitHub: model-comparison

OVERVIEW
├─ What: Same prompt tested on 3 models, measure quality/cost/speed
├─ Why: Critical for model selection decision-making
├─ How:
│   1. Define test prompts (simple, complex, edge cases)
│   2. Send to OpenAI, Anthropic, Ollama
│   3. Measure: latency, cost, hallucination, answer quality
│   4. Generate comparison report
└─ Outcome: Framework + data-driven recommendations

STRUCTURE
```
model-comparison/
├── src/
│   ├── models.py                 # Pydantic data models
│   ├── comparators/
│   │   ├── openai_comparator.py
│   │   ├── anthropic_comparator.py
│   │   └── ollama_comparator.py
│   ├── evaluators/
│   │   ├── quality_evaluator.py  # Human scoring
│   │   └── hallucination_detector.py
│   └── reporter.py               # Generate reports
├── tests/
│   └── test_comparison.py
├── data/
│   ├── test_prompts.json         # 20 prompts to test
│   └── results/                  # Comparison results
├── notebooks/
│   └── analysis.ipynb            # Visualize results
├── requirements.txt
├── README.md
└── .gitignore
```

WEEK 2-3 IMPLEMENTATION
```python
# src/comparators/base_comparator.py
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
import time

@dataclass
class ComparisonResult:
    model_name: str
    prompt: str
    response: str
    tokens_input: int
    tokens_output: int
    cost: float
    latency_ms: float
    timestamp: datetime
    quality_score: int  # 1-5 (human rated)
    hallucination_detected: bool

class BaseComparator(ABC):
    @abstractmethod
    async def call_model(self, prompt: str) -> str:
        pass
    
    async def compare(self, prompt: str) -> ComparisonResult:
        start = time.time()
        response = await self.call_model(prompt)
        latency = (time.time() - start) * 1000
        
        # Count tokens
        tokens_input = self.count_tokens(prompt)
        tokens_output = self.count_tokens(response)
        
        # Calculate cost
        cost = self.calculate_cost(tokens_input, tokens_output)
        
        return ComparisonResult(
            model_name=self.model_name,
            prompt=prompt,
            response=response,
            tokens_input=tokens_input,
            tokens_output=tokens_output,
            cost=cost,
            latency_ms=latency,
            timestamp=datetime.now(),
            quality_score=None,  # Human to fill
            hallucination_detected=None,  # Evaluator to fill
        )

# src/evaluators/quality_evaluator.py
class QualityEvaluator:
    """
    Rubric-based evaluation:
    1 = Wrong answer, bad grammar
    2 = Partially correct, issues
    3 = Correct answer, adequate
    4 = Correct, well-explained
    5 = Correct, excellent explanation
    """
    
    def evaluate(self, prompt: str, response: str, ground_truth: str) -> int:
        # TODO: Implement rubric-based scoring
        # For now: simple heuristic
        if ground_truth.lower() in response.lower():
            return 4
        elif len(response) > 100 and "I don't know" not in response:
            return 3
        else:
            return 2

# main.py - Run comparison
import asyncio
import json

async def run_comparison():
    prompts = [
        "What is the capital of France?",
        "Explain quantum entanglement in simple terms",
        "What is 2+2?",
        # ... 17 more
    ]
    
    comparators = [
        OpenAIComparator("gpt-4"),
        AnthropicComparator("claude-3.5-sonnet"),
        OllamaComparator("llama2"),
    ]
    
    results = []
    for prompt in prompts:
        for comparator in comparators:
            result = await comparator.compare(prompt)
            results.append(result)
            print(f"✓ {comparator.model_name}: {result.latency_ms:.0f}ms, ${result.cost:.4f}")
    
    # Save results
    with open("data/results/comparison_results.json", "w") as f:
        json.dump([r.__dict__ for r in results], f, default=str)
    
    # Generate report
    reporter = ComparisonReporter(results)
    reporter.generate_html_report("comparison_report.html")

asyncio.run(run_comparison())
```

DELIVERABLES
- ✅ Framework that compares 3+ models
- ✅ Test results on 20 prompts
- ✅ HTML report with visualizations
- ✅ Recommendation: which model for which task
```

---

### Project 1.3: Prompt Testing Suite

```
PROJECT NAME: Prompt Testing Suite
├─ Duration: 10 hours
├─ Skills: Prompt engineering, A/B testing, evaluation
├─ Difficulty: Intermediate
└─ GitHub: prompt-testing-suite

OVERVIEW
├─ What: Framework to test 5 prompt variations, pick best
├─ Why: 70% of quality comes from prompt engineering
├─ How:
│   1. Define task (e.g., classify sentiment)
│   2. Write 5 prompt variations
│   3. Test each on 20 examples
│   4. Measure accuracy, cost, response time
│   5. Statistical significance test
│   6. Pick winner with confidence
└─ Outcome: Data-driven prompt selection

STRUCTURE
```
prompt-testing/
├── src/
│   ├── prompt_tester.py          # Core testing logic
│   ├── evaluators.py             # Evaluation metrics
│   └── reporter.py               # Generate reports
├── data/
│   ├── test_cases.json           # 20 test cases
│   ├── prompts/
│   │   ├── prompt_v1.txt
│   │   ├── prompt_v2.txt
│   │   └── ...
│   └── results/
├── requirements.txt
├── README.md
└── .gitignore
```

WEEK 4 IMPLEMENTATION
```python
# src/prompt_tester.py
from dataclasses import dataclass
import statistics

@dataclass
class PromptTestResult:
    prompt_version: str
    test_cases_passed: int
    total_test_cases: int
    accuracy: float
    avg_latency_ms: float
    total_cost: float
    cost_per_call: float

class PromptTester:
    def __init__(self, model: str = "gpt-4"):
        self.model = model
        self.client = get_llm_client()
    
    async def test_prompt(self, prompt: str, test_cases: list) -> PromptTestResult:
        """
        Test a prompt on all test cases
        
        test_cases = [
            {"input": "I love this!", "expected_output": "positive"},
            {"input": "This is terrible", "expected_output": "negative"},
            ...
        ]
        """
        results = []
        latencies = []
        costs = []
        
        for test in test_cases:
            # Substitute test input into prompt
            full_prompt = prompt.format(text=test["input"])
            
            # Call model
            start = time.time()
            response = await self.client.call(self.model, full_prompt)
            latency = (time.time() - start) * 1000
            latencies.append(latency)
            
            # Evaluate
            passed = self.evaluate(response, test["expected_output"])
            results.append(passed)
            
            # Track cost
            input_tokens = count_tokens(full_prompt)
            output_tokens = count_tokens(response)
            cost = calculate_cost(self.model, input_tokens, output_tokens)
            costs.append(cost)
        
        accuracy = sum(results) / len(results)
        
        return PromptTestResult(
            prompt_version=prompt[:50],
            test_cases_passed=sum(results),
            total_test_cases=len(results),
            accuracy=accuracy,
            avg_latency_ms=statistics.mean(latencies),
            total_cost=sum(costs),
            cost_per_call=statistics.mean(costs),
        )
    
    def evaluate(self, response: str, expected: str) -> bool:
        """Simple exact match. In production, use fuzzy matching or semantic similarity"""
        return expected.lower() in response.lower()

# main.py
async def run_prompt_tests():
    prompts = {
        "v1": """Classify the sentiment of the following text as positive, negative, or neutral.
Text: {text}
Sentiment:""",
        
        "v2": """You are a sentiment analysis expert. Analyze the following text and respond with ONLY the sentiment (positive/negative/neutral).
Text: {text}
Response:""",
        
        "v3": """Sentiment analysis task.
Input: {text}
Output sentiment (positive/negative/neutral):""",
        
        "v4": """Classify: {text}
Answer with one word: positive, negative, or neutral""",
        
        "v5": """Analyze this text for sentiment. Give confidence score 0-100.
Text: {text}
Sentiment: [positive/negative/neutral], confidence: [0-100]""",
    }
    
    test_cases = [
        {"input": "I love this product!", "expected_output": "positive"},
        {"input": "This is awful", "expected_output": "negative"},
        # ... 18 more test cases
    ]
    
    tester = PromptTester("gpt-4")
    results_dict = {}
    
    for version, prompt in prompts.items():
        result = await tester.test_prompt(prompt, test_cases)
        results_dict[version] = result
        print(f"Prompt {version}: {result.accuracy:.1%} accuracy, ${result.total_cost:.2f}")
    
    # Pick winner
    winner = max(results_dict.items(), key=lambda x: x[1].accuracy)
    print(f"\n🏆 Winner: {winner[0]} ({winner[1].accuracy:.1%} accuracy)")
    
    # Save report
    generate_comparison_report(results_dict)
```

DELIVERABLES
- ✅ Framework for testing prompt variations
- ✅ Test results on 5 prompts × 20 test cases
- ✅ Statistical analysis (confidence, significance)
- ✅ Clear recommendation + reasoning
```

---

## MONTH 2: RAG SYSTEM

### Project 2.1: Complete RAG Pipeline

```
PROJECT NAME: PDF Question-Answering RAG System
├─ Duration: 40 hours
├─ Skills: RAG, embeddings, vector DB, FastAPI, evaluation
├─ Difficulty: Intermediate
└─ GitHub: pdf-rag-system

OVERVIEW
├─ What: Feed any PDF, ask questions, get answers with sources
├─ Why: RAG is the #1 production pattern for LLM integration
├─ How:
│   1. Upload PDF
│   2. Smart chunking (semantic units)
│   3. Generate embeddings (OpenAI API)
│   4. Store in PostgreSQL + pgvector
│   5. User asks question
│   6. Hybrid search (BM25 + semantic)
│   7. Rerank results (Cohere)
│   8. Feed to Claude/GPT-4
│   9. Return answer + sources
│   10. Cache for repeated questions
└─ Outcome: Production RAG system deployed on cloud

ARCHITECTURE
```
        User
         ↓
    [FastAPI Backend]
         ↓
    ┌────┴──────────────────┐
    ↓                        ↓
[Retriever]             [Generator]
    ├─ Embedding Cache    └─ Claude/GPT-4
    ├─ Vector Search         (with prompt cache)
    ├─ BM25 Search
    └─ Cohere Reranker
         ↓
    [PostgreSQL + pgvector]
```

DETAILED STRUCTURE
```
pdf-rag-system/
├── src/
│   ├── __init__.py
│   ├── config.py                 # API keys, settings
│   ├── models.py                 # Pydantic models
│   │
│   ├── document_processing/
│   │   ├── __init__.py
│   │   ├── pdf_loader.py        # Extract text from PDF
│   │   └── chunker.py           # Smart chunking strategies
│   │
│   ├── embeddings/
│   │   ├── __init__.py
│   │   ├── openai_embedder.py   # OpenAI embeddings
│   │   └── embedding_cache.py   # Cache embeddings (Redis)
│   │
│   ├── vector_store/
│   │   ├── __init__.py
│   │   ├── postgres_client.py   # PostgreSQL + pgvector
│   │   ├── utils.py             # Similarity search
│   │   └── migrations/
│   │       └── init_db.sql
│   │
│   ├── retrieval/
│   │   ├── __init__.py
│   │   ├── bm25_retriever.py    # Lexical search
│   │   ├── semantic_retriever.py # Vector search
│   │   ├── hybrid_retriever.py  # Combine both
│   │   └── reranker.py          # Cohere reranking
│   │
│   ├── generation/
│   │   ├── __init__.py
│   │   ├── llm_client.py        # Claude/GPT-4
│   │   ├── prompt_builder.py    # Assemble context + query
│   │   └── response_processor.py # Parse + validate
│   │
│   ├── evaluation/
│   │   ├── __init__.py
│   │   ├── metrics.py           # Precision@k, Recall, NDCG
│   │   └── test_suite.py        # Evaluation framework
│   │
│   └── api/
│       ├── __init__.py
│       ├── main.py              # FastAPI app
│       ├── endpoints.py         # /upload, /query
│       └── dependencies.py      # Dependency injection
│
├── tests/
│   ├── __init__.py
│   ├── test_chunking.py
│   ├── test_embeddings.py
│   ├── test_retrieval.py
│   ├── test_generation.py
│   └── test_e2e.py
│
├── data/
│   ├── test_pdfs/
│   │   └── sample.pdf
│   ├── test_cases.json          # Q&A pairs for evaluation
│   └── results/
│       └── evaluation_results.json
│
├── notebooks/
│   ├── exploration.ipynb        # Development notebook
│   └── evaluation.ipynb         # Analysis + metrics
│
├── Dockerfile
├── docker-compose.yml           # PostgreSQL + Redis
├── requirements.txt
├── README.md
└── .gitignore
```

WEEK-BY-WEEK IMPLEMENTATION

**Week 5: PDF Loading & Chunking (12 hours)**
```python
# src/document_processing/pdf_loader.py
import pdfplumber
from typing import List

class PDFLoader:
    @staticmethod
    def load_pdf(file_path: str) -> str:
        """Extract all text from PDF"""
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text

# src/document_processing/chunker.py
from typing import List
from dataclasses import dataclass

@dataclass
class Chunk:
    content: str
    page: int
    position: int  # position in document

class SmartChunker:
    def __init__(self, chunk_size: int = 512, overlap: int = 128):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def chunk_by_tokens(self, text: str) -> List[Chunk]:
        """
        Strategy 1: Chunk by token count (512 tokens per chunk)
        Overlap: 128 tokens (prevents losing context at boundaries)
        """
        import tiktoken
        enc = tiktoken.encoding_for_model("gpt-4")
        tokens = enc.encode(text)
        
        chunks = []
        position = 0
        for i in range(0, len(tokens), self.chunk_size - self.overlap):
            chunk_tokens = tokens[i:i + self.chunk_size]
            chunk_text = enc.decode(chunk_tokens)
            chunks.append(Chunk(content=chunk_text, page=0, position=position))
            position += 1
        
        return chunks
    
    def chunk_by_sentences(self, text: str) -> List[Chunk]:
        """
        Strategy 2: Chunk by logical units (sentences)
        Better for semantic coherence
        """
        import re
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        chunks = []
        current_chunk = ""
        for sentence in sentences:
            if len(current_chunk) + len(sentence) < 2000:  # ~500 tokens
                current_chunk += " " + sentence
            else:
                if current_chunk:
                    chunks.append(Chunk(content=current_chunk.strip(), page=0, position=len(chunks)))
                current_chunk = sentence
        
        if current_chunk:
            chunks.append(Chunk(content=current_chunk.strip(), page=0, position=len(chunks)))
        
        return chunks
    
    def chunk_by_paragraphs(self, text: str) -> List[Chunk]:
        """
        Strategy 3: Chunk by paragraphs
        Preserves document structure
        """
        paragraphs = text.split("\n\n")
        chunks = []
        for i, para in enumerate(paragraphs):
            if para.strip():
                chunks.append(Chunk(content=para.strip(), page=0, position=i))
        return chunks

# Test different strategies
if __name__ == "__main__":
    from src.document_processing.pdf_loader import PDFLoader
    
    pdf_text = PDFLoader.load_pdf("data/test_pdfs/sample.pdf")
    chunker = SmartChunker()
    
    strategy1 = chunker.chunk_by_tokens(pdf_text)
    strategy2 = chunker.chunk_by_sentences(pdf_text)
    strategy3 = chunker.chunk_by_paragraphs(pdf_text)
    
    print(f"Strategy 1 (tokens): {len(strategy1)} chunks")
    print(f"Strategy 2 (sentences): {len(strategy2)} chunks")
    print(f"Strategy 3 (paragraphs): {len(strategy3)} chunks")
    print("\nChunk size distribution (tokens):")
    for i, chunk in enumerate(strategy1[:3]):
        tokens = len(chunk.content.split())
        print(f"  Chunk {i}: ~{tokens} words (~{tokens//4} tokens)")
```

**Week 6: Embeddings & Vector Database (12 hours)**
```python
# src/embeddings/openai_embedder.py
from openai import AsyncOpenAI
from typing import List, Tuple

class OpenAIEmbedder:
    def __init__(self, model: str = "text-embedding-3-small"):
        self.client = AsyncOpenAI()
        self.model = model
    
    async def embed(self, text: str) -> List[float]:
        """Get embedding for single text"""
        response = await self.client.embeddings.create(
            input=text,
            model=self.model
        )
        return response.data[0].embedding
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings for multiple texts (efficient batch)"""
        response = await self.client.embeddings.create(
            input=texts,
            model=self.model
        )
        return [item.embedding for item in response.data]

# src/vector_store/postgres_client.py
import asyncpg
from typing import List, Tuple
import json

class PostgresVectorStore:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.pool = None
    
    async def connect(self):
        """Initialize connection pool"""
        self.pool = await asyncpg.create_pool(self.db_url)
        await self._init_schema()
    
    async def _init_schema(self):
        """Create pgvector extension and table"""
        async with self.pool.acquire() as conn:
            await conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id SERIAL PRIMARY KEY,
                    content TEXT NOT NULL,
                    embedding vector(1536),
                    document_id VARCHAR(255),
                    chunk_index INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS documents_embedding_idx 
                ON documents USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);
            """)
    
    async def add_documents(self, documents: List[dict]):
        """
        documents = [
            {"content": "text here", "embedding": [1.2, 3.4, ...], 
             "document_id": "pdf1", "chunk_index": 0},
            ...
        ]
        """
        async with self.pool.acquire() as conn:
            await conn.executemany("""
                INSERT INTO documents (content, embedding, document_id, chunk_index)
                VALUES ($1, $2, $3, $4)
            """, [
                (doc["content"], json.dumps(doc["embedding"]), 
                 doc["document_id"], doc["chunk_index"])
                for doc in documents
            ])
    
    async def search_semantic(self, query_embedding: List[float], 
                            limit: int = 10) -> List[Tuple[str, float]]:
        """
        Vector search: find most similar documents
        Returns: [(content, similarity_score), ...]
        """
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT content, 1 - (embedding <=> $1::vector) as similarity
                FROM documents
                ORDER BY embedding <=> $1::vector
                LIMIT $2
            """, json.dumps(query_embedding), limit)
            return [(row['content'], row['similarity']) for row in results]
    
    async def close(self):
        """Close connection pool"""
        if self.pool:
            await self.pool.close()

# Setup PostgreSQL + pgvector locally
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: rag_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Week 7: Hybrid Retrieval & Reranking (12 hours)**
```python
# src/retrieval/bm25_retriever.py
from rank_bm25 import BM25Okapi
from typing import List, Tuple

class BM25Retriever:
    def __init__(self, documents: List[str]):
        self.documents = documents
        # Tokenize documents
        tokenized_docs = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized_docs)
    
    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[str, float]]:
        """BM25 lexical search"""
        query_tokens = query.lower().split()
        scores = self.bm25.get_scores(query_tokens)
        
        # Get top k results
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
        
        return [
            (self.documents[i], scores[i]) 
            for i in top_indices
        ]

# src/retrieval/hybrid_retriever.py
class HybridRetriever:
    def __init__(self, semantic_retriever, bm25_retriever):
        self.semantic = semantic_retriever
        self.bm25 = bm25_retriever
    
    async def retrieve(self, query: str, top_k: int = 10) -> List[str]:
        """
        Combine semantic + BM25:
        1. Get top 20 from each
        2. Normalize scores
        3. Combine with weights (0.7 semantic + 0.3 BM25)
        4. Rerank with Cohere
        5. Return top 10
        """
        
        # Get results from both retrievers
        semantic_results = await self.semantic.retrieve(query, top_k=20)
        bm25_results = self.bm25.retrieve(query, top_k=20)
        
        # Normalize scores to 0-1
        semantic_scores = {doc: score for doc, score in semantic_results}
        bm25_scores = {doc: score / max([s for _, s in bm25_results]) 
                      for doc, score in bm25_results}
        
        # Combine
        combined = {}
        for doc, score in semantic_scores.items():
            combined[doc] = 0.7 * score + 0.3 * bm25_scores.get(doc, 0)
        
        # Add BM25-only results
        for doc, score in bm25_scores.items():
            if doc not in combined:
                combined[doc] = 0.3 * score
        
        # Sort and rerank
        sorted_docs = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:20]
        
        # Rerank with Cohere
        reranked = await self.rerank_with_cohere(query, [doc for doc, _ in sorted_docs])
        
        return reranked[:top_k]

# src/retrieval/reranker.py
from cohere import AsyncClient

class CohereReranker:
    def __init__(self, api_key: str):
        self.client = AsyncClient(api_key)
    
    async def rerank(self, query: str, documents: List[str], top_k: int = 5):
        """Use Cohere to rerank documents"""
        response = await self.client.rerank(
            query=query,
            documents=documents,
            model="rerank-english-v2.0",
            top_k=top_k
        )
        
        return [doc for doc in response.results]
```

**Week 8: Integration & Deployment (12 hours)**
```python
# src/api/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import asyncio

app = FastAPI(title="RAG System")

# Initialize components (on startup)
@app.on_event("startup")
async def startup_event():
    # Initialize vector store
    app.vector_store = PostgresVectorStore("postgresql://...")
    await app.vector_store.connect()
    
    # Initialize embedder
    app.embedder = OpenAIEmbedder()
    
    # Initialize retrievers
    app.retriever = HybridRetriever(...)
    
    # Initialize LLM
    app.llm_client = AnthropicClient()

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process PDF"""
    try:
        # Save file
        content = await file.read()
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Extract text
        pdf_text = PDFLoader.load_pdf(file_path)
        
        # Chunk
        chunker = SmartChunker(chunk_size=512)
        chunks = chunker.chunk_by_tokens(pdf_text)
        
        # Embed
        chunk_texts = [c.content for c in chunks]
        embeddings = await app.embedder.embed_batch(chunk_texts)
        
        # Store in vector DB
        documents = [
            {
                "content": chunk.content,
                "embedding": emb,
                "document_id": file.filename,
                "chunk_index": i
            }
            for i, (chunk, emb) in enumerate(zip(chunks, embeddings))
        ]
        await app.vector_store.add_documents(documents)
        
        return {
            "status": "success",
            "file": file.filename,
            "chunks": len(chunks),
            "embeddings_created": len(embeddings)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/query")
async def query_documents(query: str):
    """Ask question about uploaded documents"""
    try:
        # Embed query
        query_embedding = await app.embedder.embed(query)
        
        # Retrieve documents
        retrieved_docs = await app.retriever.retrieve(query, top_k=10)
        
        # Build context
        context = "\n\n".join([f"Source {i}:\n{doc}" 
                               for i, doc in enumerate(retrieved_docs)])
        
        # Generate answer
        prompt = f"""Answer the question based on the provided context.

Context:
{context}

Question: {query}

Answer:"""
        
        response = await app.llm_client.call(prompt)
        
        return {
            "question": query,
            "answer": response,
            "sources_used": len(retrieved_docs),
            "confidence": 0.85  # TODO: Calculate real confidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

DELIVERABLES
- ✅ GitHub repo with complete RAG system
- ✅ Tested on 100 Q&A pairs
- ✅ Deployed on Railway/Render
- ✅ Evaluation metrics (Precision@k, Recall, NDCG)
- ✅ Blog post: "Building Production RAG Systems"
- ✅ Docker container ready to deploy
```

---

## MONTH 3-6: TOOL INTEGRATION, AGENTIC WORKFLOWS, PRODUCTION, DEPLOYMENT

[Similar detailed breakdowns for Months 3-6 projects...]

---

## KEY FILES TO STUDY

For each project, these are essential reads:

1. **LLM Docs**
   - Anthropic: https://docs.anthropic.com/en/docs/build-with-claude
   - OpenAI: https://platform.openai.com/docs/guides/function-calling

2. **Frameworks**
   - LangChain: https://python.langchain.com/
   - LangGraph: https://langchain-ai.github.io/langgraph/

3. **Best Practices**
   - RAG: "Retrieval-Augmented Generation for Large Language Models" (Lewis et al.)
   - Production: "Machine Learning Systems Design" (Huyen)

---

## TESTING TEMPLATE (Use for Every Project)

```python
# tests/test_rag_system.py
import pytest
from src.document_processing.pdf_loader import PDFLoader
from src.document_processing.chunker import SmartChunker

@pytest.fixture
def sample_pdf_path():
    return "data/test_pdfs/sample.pdf"

@pytest.fixture
async def vector_store():
    store = PostgresVectorStore("postgresql://test...")
    await store.connect()
    yield store
    await store.close()

def test_pdf_loading(sample_pdf_path):
    text = PDFLoader.load_pdf(sample_pdf_path)
    assert len(text) > 0
    assert "Chapter" in text or "Section" in text

def test_chunking():
    text = "This is sentence one. This is sentence two. More content here."
    chunker = SmartChunker(chunk_size=50)
    chunks = chunker.chunk_by_sentences(text)
    
    assert len(chunks) >= 2
    assert all(len(c.content) > 0 for c in chunks)

@pytest.mark.asyncio
async def test_vector_store_operations(vector_store):
    # Add documents
    await vector_store.add_documents([
        {"content": "Python is great", "embedding": [0.1] * 1536, "document_id": "test", "chunk_index": 0}
    ])
    
    # Search
    results = await vector_store.search_semantic([0.1] * 1536, limit=5)
    assert len(results) > 0

# Run: pytest tests/
```

---

## Success = Consistency + Shipping

The projects above are designed to be **built in public**. For each:

1. Create GitHub repo (make it public)
2. Document in README
3. Push weekly updates
4. Write 1 blog post per project
5. Share on Twitter/LinkedIn

This visibility = opportunities.

Good luck! 🚀
