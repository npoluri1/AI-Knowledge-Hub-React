# AGENTIC AI ENGINEER — LEARNING PATH

## Phase 1: Python Fundamentals for AI Engineering

### 1.1 Python Environment Setup

```
project-root/
├── pyproject.toml
├── Makefile
├── src/
│   └── my_ai_project/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── llm/
│       │   ├── __init__.py
│       │   ├── router.py
│       │   └── providers.py
│       ├── rag/
│       │   ├── __init__.py
│       │   ├── embeddings.py
│       │   └── vectorstore.py
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── test_config.py
│   ├── test_llm.py
│   └── test_rag.py
├── docs/
├── .env
├── .gitignore
└── README.md
```

```toml
# pyproject.toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-ai-project"
version = "0.1.0"
description = "Agentic AI Engineer learning path project"
readme = "README.md"
requires-python = ">=3.11"
license = "MIT"
dependencies = [
    "pydantic>=2.0",
    "httpx>=0.27",
    "tiktoken>=0.7",
    "sentence-transformers>=3.0",
    "chromadb>=0.5",
    "langchain>=0.3",
    "langchain-community>=0.3",
    "langchain-openai>=0.2",
    "openai>=1.50",
    "tiktoken>=0.7",
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
    "ruff>=0.6",
    "mypy>=1.11",
]

[project.optional-dependencies]
dev = [
    "pytest-cov>=5.0",
    "pre-commit>=3.8",
]

[tool.hatch.build.targets.wheel]
packages = ["src/my_ai_project"]

[tool.ruff]
target-version = "py311"
line-length = 120

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "A", "SIM", "TCH"]

[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

```makefile
# Makefile
.PHONY: install dev test lint format typecheck clean

install:
	pip install -e .

dev:
	pip install -e ".[dev]"
	pre-commit install

test:
	pytest tests/ -v --tb=short

test-cov:
	pytest tests/ -v --cov=src/my_ai_project --cov-report=term-missing

lint:
	ruff check src/ tests/

format:
	ruff format src/ tests/

typecheck:
	mypy src/

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .mypy_cache .pytest_cache .ruff_cache dist build *.egg-info
```

```bash
# Bootstrap script (run once)
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
pip install hatch
hatch new my-ai-project
make dev
```

### 1.2 Core Python for AI Engineers

```python
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import asyncio
import time
from functools import wraps
from contextlib import asynccontextmanager

class AIConfig(BaseModel):
    model: str = "gpt-4o"
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=4096, gt=0)
    system_prompt: Optional[str] = None

    @field_validator("model")
    @classmethod
    def validate_model(cls, v: str) -> str:
        allowed = {"gpt-4o", "gpt-4o-mini", "claude-sonnet-4-20250514", "claude-haiku", "llama-3.1-70b-versatile"}
        if v not in allowed:
            raise ValueError(f"Model must be one of {allowed}")
        return v

# --- Decorators ---

def timer(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = await func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exc = e
                    if attempt < max_attempts - 1:
                        await asyncio.sleep(delay * (2 ** attempt))
            raise last_exc
        return wrapper
    return decorator

def cache(ttl: float = 60.0):
    def decorator(func):
        cache_store: dict = {}
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            now = time.time()
            if key in cache_store:
                result, ts = cache_store[key]
                if now - ts < ttl:
                    return result
            result = await func(*args, **kwargs)
            cache_store[key] = (result, now)
            return result
        return wrapper
    return decorator

# --- Context Manager for Resource Management ---

@asynccontextmanager
async def llm_session(config: AIConfig):
    print(f"Opening session with {config.model}")
    session = {"config": config, "token_count": 0, "requests": 0}
    try:
        yield session
    finally:
        print(f"Session closed. Total requests: {session['requests']}, tokens: {session['token_count']}")

# --- Putting It Together ---

@timer
@retry(max_attempts=3, delay=0.5)
@cache(ttl=30.0)
async def call_llm(prompt: str, config: AIConfig) -> str:
    await asyncio.sleep(0.1)  # Simulated API call
    return f"Response to: {prompt}"

async def main():
    config = AIConfig(model="gpt-4o", temperature=0.7)

    async with llm_session(config) as session:
        tasks = [call_llm(f"Query {i}", config) for i in range(5)]
        results = await asyncio.gather(*tasks)
        for r in results:
            print(r)

asyncio.run(main())
```

### 1.3 Data Structures for AI

```python
from collections import deque, defaultdict
import heapq
from typing import Any, Optional

class ConversationBuffer:
    def __init__(self, max_size: int = 10):
        self.buffer: deque = deque(maxlen=max_size)
        self.token_counts: deque = deque(maxlen=max_size)

    def add(self, message: str, role: str = "user", tokens: int = 0) -> None:
        self.buffer.append({"role": role, "content": message})
        self.token_counts.append(tokens)

    def get_context(self, k: int = 5) -> list[dict]:
        return list(self.buffer)[-k:]

    def total_tokens(self) -> int:
        return sum(self.token_counts)

    def clear(self) -> None:
        self.buffer.clear()
        self.token_counts.clear()

    def __len__(self) -> int:
        return len(self.buffer)

class PriorityQueue:
    def __init__(self):
        self.heap: list[tuple[float, str, Any]] = []
        self.entry_count: int = 0

    def push(self, priority: float, item: Any, id: str = "") -> None:
        entry_id = id or str(self.entry_count)
        self.entry_count += 1
        heapq.heappush(self.heap, (priority, entry_id, item))

    def pop(self) -> Optional[Any]:
        if not self.heap:
            return None
        _, _, item = heapq.heappop(self.heap)
        return item

    def peek(self) -> Optional[Any]:
        if not self.heap:
            return None
        return self.heap[0][2]

    def __len__(self) -> int:
        return len(self.heap)

class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False
        self.value: Any = None

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str, value: Any = None) -> None:
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.value = value

    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_end

    def autocomplete(self, prefix: str, max_results: int = 10) -> list[str]:
        node = self._find_node(prefix)
        if not node:
            return []
        results: list[str] = []
        self._collect_words(node, prefix.lower(), results, max_results)
        return results

    def _find_node(self, prefix: str) -> Optional[TrieNode]:
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return None
            node = node.children[char]
        return node

    def _collect_words(self, node: TrieNode, prefix: str, results: list, limit: int) -> None:
        if len(results) >= limit:
            return
        if node.is_end:
            results.append(prefix)
        for char, child in sorted(node.children.items()):
            self._collect_words(child, prefix + char, results, limit)

class Graph:
    def __init__(self, directed: bool = False):
        self.adjacency: dict[str, list[tuple[str, float]]] = defaultdict(list)
        self.directed = directed

    def add_edge(self, from_node: str, to_node: str, weight: float = 1.0) -> None:
        self.adjacency[from_node].append((to_node, weight))
        if not self.directed:
            self.adjacency[to_node].append((from_node, weight))

    def bfs(self, start: str) -> list[str]:
        visited: set[str] = set()
        queue = deque([start])
        order: list[str] = []
        while queue:
            node = queue.popleft()
            if node in visited:
                continue
            visited.add(node)
            order.append(node)
            for neighbor, _ in self.adjacency[node]:
                if neighbor not in visited:
                    queue.append(neighbor)
        return order

    def shortest_path(self, start: str, end: str) -> Optional[list[str]]:
        pq = PriorityQueue()
        pq.push(0, [start], start)
        visited: set[str] = set()

        while len(pq) > 0:
            cost, path = pq.pop(), pq.pop() if False else None  # fix below
        # Dijkstra implementation
        import heapq
        heap = [(0, start, [start])]
        seen: set[str] = set()
        while heap:
            cost, node, path = heapq.heappop(heap)
            if node == end:
                return path
            if node in seen:
                continue
            seen.add(node)
            for neighbor, weight in self.adjacency[node]:
                if neighbor not in seen:
                    heapq.heappush(heap, (cost + weight, neighbor, path + [neighbor]))
        return None
```

### 1.4 Testing with pytest

```python
import pytest
from pydantic import ValidationError
from my_ai_project.config import AIConfig
from unittest.mock import AsyncMock, patch

# --- Model Validation Tests ---

def test_ai_config_valid():
    config = AIConfig(model="gpt-4o", temperature=0.5)
    assert config.model == "gpt-4o"
    assert config.temperature == 0.5

def test_ai_config_invalid_temperature():
    with pytest.raises(ValidationError):
        AIConfig(temperature=2.0)

def test_ai_config_invalid_model():
    with pytest.raises(ValidationError):
        AIConfig(model="nonexistent-model")

@pytest.mark.parametrize("temp,expected", [
    (0.0, 0.0),
    (0.5, 0.5),
    (0.7, 0.7),
    (1.0, 1.0),
    (2.0, 2.0),
])
def test_temperature_values(temp, expected):
    config = AIConfig(temperature=temp)
    assert config.temperature == expected

# --- Mock LLM for Testing ---

class MockLLM:
    def __init__(self, response: str = "mock response"):
        self.response = response
        self.call_count = 0
        self.last_prompt: str = ""

    async def generate(self, prompt: str) -> str:
        self.call_count += 1
        self.last_prompt = prompt
        return self.response

    async def fail_generate(self, prompt: str) -> str:
        raise ConnectionError("API unavailable")

@pytest.fixture
def mock_llm():
    return MockLLM()

@pytest.fixture
def failing_llm():
    return MockLLM()

# --- Async Tests ---

@pytest.mark.asyncio
async def test_llm_call(mock_llm):
    result = await mock_llm.generate("test prompt")
    assert result == "mock response"
    assert mock_llm.call_count == 1

@pytest.mark.asyncio
async def test_llm_call_tracks_prompt(mock_llm):
    await mock_llm.generate("hello world")
    assert mock_llm.last_prompt == "hello world"

@pytest.mark.asyncio
async def test_llm_failure(failing_llm):
    with pytest.raises(ConnectionError):
        await failing_llm.fail_generate("test")

# --- Conversation Buffer Tests ---

from collections import deque

class TestConversationBuffer:
    def test_add_and_get(self):
        buf = deque(maxlen=10)
        buf.append({"role": "user", "content": "hello"})
        assert len(buf) == 1
        assert buf[0]["content"] == "hello"

    def test_max_size(self):
        buf = deque(maxlen=3)
        for i in range(5):
            buf.append(i)
        assert list(buf) == [2, 3, 4]

# --- Parametrized Edge Cases ---

@pytest.mark.parametrize("input,expected", [
    ("", False),
    ("hello", True),
    ("a" * 1000, True),
])
def test_trie_insert_and_search(input, expected):
    from my_ai_project.utils.helpers import Trie
    trie = Trie()
    if input:
        trie.insert(input)
        assert trie.search(input) == expected
    else:
        assert trie.search(input) == False

# --- Integration Test with Fixture ---

@pytest.fixture
def sample_config():
    return AIConfig(model="gpt-4o-mini", temperature=0.3, max_tokens=1024)

@pytest.mark.asyncio
async def test_full_pipeline(mock_llm, sample_config):
    assert sample_config.model == "gpt-4o-mini"
    result = await mock_llm.generate("summarize this document")
    assert isinstance(result, str)
    assert len(result) > 0
```

### 1.5 HTTP Clients & Data Handling

```python
import httpx
import asyncio
from typing import List, Dict, Optional
from pydantic import BaseModel
from dataclasses import dataclass
import time

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatResponse(BaseModel):
    content: str
    model: str
    tokens_used: int
    latency: float

@dataclass
class RateLimiter:
    max_requests: int = 60
    window_seconds: float = 60.0
    _timestamps: list[float] | None = None

    def __post_init__(self):
        self._timestamps = []

    async def acquire(self) -> None:
        now = time.time()
        self._timestamps = [t for t in self._timestamps if now - t < self.window_seconds]
        if len(self._timestamps) >= self.max_requests:
            sleep_time = self.window_seconds - (now - self._timestamps[0])
            await asyncio.sleep(sleep_time)
        self._timestamps.append(time.time())

class LLMClient:
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.openai.com/v1",
        timeout: float = 30.0,
        max_retries: int = 3,
    ):
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=timeout,
        )
        self.rate_limiter = RateLimiter()
        self.max_retries = max_retries

    async def chat(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> ChatResponse:
        await self.rate_limiter.acquire()
        start = time.perf_counter()

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        for attempt in range(self.max_retries):
            try:
                r = await self.client.post("/chat/completions", json=payload)
                r.raise_for_status()
                data = r.json()
                latency = time.perf_counter() - start
                return ChatResponse(
                    content=data["choices"][0]["message"]["content"],
                    model=data.get("model", model),
                    tokens_used=data.get("usage", {}).get("total_tokens", 0),
                    latency=latency,
                )
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise

        raise RuntimeError(f"Failed after {self.max_retries} retries")

    async def batch_chat(
        self,
        prompts: List[str],
        model: str = "gpt-4o",
        concurrency: int = 5,
    ) -> List[ChatResponse]:
        semaphore = asyncio.Semaphore(concurrency)

        async def limited_chat(prompt: str) -> ChatResponse:
            async with semaphore:
                return await self.chat([{"role": "user", "content": prompt}], model=model)

        return await asyncio.gather(*[limited_chat(p) for p in prompts])

    async def close(self) -> None:
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()

# Usage
async def demo():
    async with LLMClient(api_key="sk-...") as client:
        # Single call
        response = await client.chat([{"role": "user", "content": "Hello!"}])
        print(f"Response: {response.content} ({response.tokens_used} tokens, {response.latency:.2f}s)")

        # Batch call with concurrency control
        prompts = [f"Explain topic {i}" for i in range(5)]
        responses = await client.batch_chat(prompts, model="gpt-4o-mini")
        for r in responses:
            print(f"  {r.content[:50]}... | {r.tokens_used} tokens")

asyncio.run(demo())
```

---

## Phase 2: LLM Fundamentals

### 2.1 How LLMs Work

```
                        THE TRANSFORMER ARCHITECTURE
                        
    ┌──────────────────────────────────────────────────────────────┐
    │                        INPUT TOKENS                          │
    │                  [The] [cat] [sat] [on] [mat]                │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    TOKEN EMBEDDING                           │
    │              Each token → dense vector (d=768)              │
    │                 "The" → [0.2, -0.5, 0.1, ...]               │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                  + POSITIONAL ENCODING                       │
    │           Add position info: sin(pos/10000^(2i/d))          │
    │               "The"(pos=0) + "cat"(pos=1) + ...             │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │              SELF-ATTENTION HEAD (x N layers)               │
    │                                                              │
    │   Q = X × Wq    K = X × Wk    V = X × Wv                  │
    │                                                              │
    │              Q × Kᵀ                                         │
    │   Attention = ───────── × V                                  │
    │               √dₖ                                            │
    │                                                              │
    │   "cat" attends strongly to "sat" (subject-verb)            │
    │   "The" attends strongly to "cat" (determiner-noun)         │
    │                                                              │
    │   Multi-Head: run h heads in parallel, concat, project      │
    │   Head 1: syntactic    Head 2: semantic    Head 3: coref    │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                 ADD & LAYER NORM (residual)                  │
    │              output = LayerNorm(x + Attention(x))            │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │              FEED-FORWARD NETWORK (x N layers)              │
    │                                                              │
    │   FFN(x) = GELU(x × W₁ + b₁) × W₂ + b₂                   │
    │                                                              │
    │   Hidden dim = 4 × model dim (e.g., 3072 for d=768)        │
    │   Each position processed independently                     │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                  ADD & LAYER NORM (residual)                 │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   REPEAT N LAYERS      │
              │   (e.g., 96 for GPT-4) │
              └────────────┬───────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                  OUTPUT PROJECTION                           │
    │          hidden → vocab_size logits via W_out               │
    │          "mat" has highest probability → next token         │
    └──────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │               SOFTMAX → NEXT TOKEN PROBABILITY              │
    │                                                              │
    │   P("mat")  = 0.45  ← selected (highest)                   │
    │   P("floor")= 0.22                                          │
    │   P("bed")  = 0.18                                          │
    │   P("rug")  = 0.08                                          │
    │   P("...)   = 0.07                                          │
    └──────────────────────────────────────────────────────────────┘
```

```python
# Byte-Pair Encoding (BPE) Tokenizer from Scratch

from collections import Counter, defaultdict
from typing import List, Tuple

class BPETokenizer:
    def __init__(self, vocab_size: int = 300):
        self.vocab_size = vocab_size
        self.merges: list[tuple[str, str]] = []
        self.vocab: dict[str, int] = {}

    def _get_pairs(self, word_freqs: dict[tuple[str, ...], int]) -> Counter:
        pairs = Counter()
        for symbols, freq in word_freqs.items():
            for i in range(len(symbols) - 1):
                pairs[(symbols[i], symbols[i + 1])] += freq
        return pairs

    def _merge_pair(self, pair: tuple[str, str], word_freqs: dict) -> dict:
        new_word_freqs = {}
        bigram = pair
        replacement = "".join(pair)
        for symbols, freq in word_freqs.items():
            new_symbols = []
            i = 0
            while i < len(symbols):
                if i < len(symbols) - 1 and symbols[i] == bigram[0] and symbols[i + 1] == bigram[1]:
                    new_symbols.append(replacement)
                    i += 2
                else:
                    new_symbols.append(symbols[i])
                    i += 1
            new_word_freqs[tuple(new_symbols)] = freq
        return new_word_freqs

    def train(self, texts: List[str]) -> None:
        word_freq: Counter = Counter()
        for text in texts:
            for word in text.split():
                chars = tuple(word) + ("</w>",)
                word_freq[chars] += 1

        word_freqs = dict(word_freq)
        num_merges = self.vocab_size - 256

        for i in range(num_merges):
            pairs = self._get_pairs(word_freqs)
            if not pairs:
                break
            best_pair = pairs.most_common(1)[0][0]
            self.merges.append(best_pair)
            word_freqs = self._merge_pair(best_pair, word_freqs)

        # Build vocab from remaining symbols
        symbols = set()
        for symbols_tuple in word_freqs:
            for s in symbols_tuple:
                symbols.add(s)

        self.vocab = {chr(i): i for i in range(256)}
        idx = 256
        for s in sorted(symbols):
            if s not in self.vocab:
                self.vocab[s] = idx
                idx += 1

    def encode(self, text: str) -> List[int]:
        tokens = []
        for word in text.split():
            symbols = list(word) + ["</w>"]
            while len(symbols) > 1:
                pairs = [(symbols[i], symbols[i + 1]) for i in range(len(symbols) - 1)]
                mergeable = [p for p in pairs if p in self.merges]
                if not mergeable:
                    break
                best = min(mergeable, key=lambda p: self.merges.index(p))
                new_symbols = []
                i = 0
                while i < len(symbols):
                    if i < len(symbols) - 1 and (symbols[i], symbols[i + 1]) == best:
                        new_symbols.append(symbols[i] + symbols[i + 1])
                        i += 2
                    else:
                        new_symbols.append(symbols[i])
                        i += 1
                symbols = new_symbols
            for s in symbols:
                tokens.append(self.vocab.get(s, 0))
        return tokens

    def decode(self, ids: List[int]) -> str:
        inv_vocab = {v: k for k, v in self.vocab.items()}
        return " ".join(inv_vocab.get(i, "?") for i in ids)


# Usage
tokenizer = BPETokenizer(vocab_size=300)
tokenizer.train(["the cat sat on the mat the cat ate the rat"])
encoded = tokenizer.encode("the cat sat")
print(f"Encoded: {encoded}")
print(f"Decoded: {tokenizer.decode(encoded)}")
```

### 2.2 Multi-Provider LLM Router

```python
from abc import ABC, abstractmethod
from typing import Dict, List, Optional
import httpx
import os
import asyncio
import time

class LLMProvider(ABC):
    @abstractmethod
    async def complete(
        self,
        messages: List[Dict],
        model: str = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        **kwargs,
    ) -> str:
        pass

    @abstractmethod
    def available_models(self) -> List[str]:
        pass

class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.client = httpx.AsyncClient(
            base_url="https://api.openai.com/v1",
            headers={"Authorization": f"Bearer {self.api_key}"},
            timeout=60.0,
        )

    async def complete(self, messages, model="gpt-4o", temperature=0.7, max_tokens=4096, **kwargs):
        r = await self.client.post(
            "/chat/completions",
            json={"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens, **kwargs},
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]

    def available_models(self) -> List[str]:
        return ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview"]

class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.client = httpx.AsyncClient(
            base_url="https://api.anthropic.com/v1",
            headers={
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            timeout=60.0,
        )

    async def complete(self, messages, model="claude-sonnet-4-20250514", temperature=0.7, max_tokens=4096, **kwargs):
        system = next((m["content"] for m in messages if m["role"] == "system"), "")
        user_msgs = [m for m in messages if m["role"] != "system"]
        r = await self.client.post(
            "/messages",
            json={
                "model": model,
                "system": system,
                "messages": user_msgs,
                "temperature": temperature,
                "max_tokens": max_tokens,
                **kwargs,
            },
        )
        r.raise_for_status()
        return r.json()["content"][0]["text"]

    def available_models(self) -> List[str]:
        return ["claude-sonnet-4-20250514", "claude-haiku-4-20250514", "claude-3-opus"]

class GroqProvider(LLMProvider):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.client = httpx.AsyncClient(
            base_url="https://api.groq.com/openai/v1",
            headers={"Authorization": f"Bearer {self.api_key}"},
            timeout=30.0,
        )

    async def complete(self, messages, model="llama-3.1-70b-versatile", temperature=0.7, max_tokens=4096, **kwargs):
        r = await self.client.post(
            "/chat/completions",
            json={"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens, **kwargs},
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]

    def available_models(self) -> List[str]:
        return ["llama-3.1-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"]

class OllamaProvider(LLMProvider):
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.client = httpx.AsyncClient(base_url=base_url, timeout=120.0)

    async def complete(self, messages, model="llama3.1", temperature=0.7, max_tokens=4096, **kwargs):
        r = await self.client.post(
            "/api/chat",
            json={"model": model, "messages": messages, "options": {"temperature": temperature, "num_predict": max_tokens}, "stream": False},
        )
        r.raise_for_status()
        return r.json()["message"]["content"]

    def available_models(self) -> List[str]:
        return ["llama3.1", "mistral", "codellama", "phi3"]

class LLMRouter:
    def __init__(self, strategy: str = "round-robin"):
        self.providers: Dict[str, LLMProvider] = {}
        self.strategy = strategy
        self._rr_index = 0
        self._cost_map: Dict[str, float] = {
            "gpt-4o": 0.0025,
            "gpt-4o-mini": 0.00015,
            "claude-sonnet-4-20250514": 0.003,
            "llama-3.1-70b-versatile": 0.00059,
            "llama3.1": 0.0,
        }

    def register(self, name: str, provider: LLMProvider) -> None:
        self.providers[name] = provider

    def list_providers(self) -> Dict[str, List[str]]:
        return {name: p.available_models() for name, p in self.providers.items()}

    def _select_provider(self, preferred: List[str] = None) -> str:
        if self.strategy == "round-robin":
            names = list(self.providers.keys())
            name = names[self._rr_index % len(names)]
            self._rr_index += 1
            return name
        elif self.strategy == "cheapest":
            return min(self.providers.keys(), key=lambda n: self._cost_map.get(n, 999))
        elif preferred:
            for p in preferred:
                if p in self.providers:
                    return p
        return list(self.providers.keys())[0]

    async def route(
        self,
        messages: List[Dict],
        model: str = None,
        provider: str = None,
        **kwargs,
    ) -> tuple[str, str]:
        if provider and provider in self.providers:
            name = provider
        else:
            name = self._select_provider()

        target_model = model or list(self.providers[name].available_models())[0]
        start = time.perf_counter()
        result = await self.providers[name].complete(messages, model=target_model, **kwargs)
        latency = time.perf_counter() - start
        return result, f"{name}/{target_model} ({latency:.2f}s)"

    async def fallback(
        self,
        messages: List[Dict],
        provider_order: List[str] = None,
        **kwargs,
    ) -> tuple[str, str]:
        order = provider_order or list(self.providers.keys())
        errors = []
        for name in order:
            if name not in self.providers:
                continue
            try:
                model = list(self.providers[name].available_models())[0]
                start = time.perf_counter()
                result = await self.providers[name].complete(messages, model=model, **kwargs)
                latency = time.perf_counter() - start
                return result, f"{name}/{model} ({latency:.2f}s)"
            except Exception as e:
                errors.append(f"{name}: {e}")
                continue
        raise RuntimeError(f"All providers failed:\n" + "\n".join(errors))


# Usage
router = LLMRouter(strategy="round-robin")
router.register("openai", OpenAIProvider())
router.register("anthropic", AnthropicProvider())
router.register("groq", GroqProvider())
router.register("ollama", OllamaProvider())

messages = [{"role": "user", "content": "Explain transformers in 3 sentences"}]
response, source = await router.route(messages)
print(f"[{source}] {response}")
```

### 2.3 Prompt Engineering Toolkit

```python
from typing import List, Dict, Any

class PromptEngineer:
    @staticmethod
    def few_shot(examples: List[Dict[str, str]], query: str, task: str = "") -> str:
        prompt = ""
        if task:
            prompt += f"Task: {task}\n\n"
        prompt += "Here are some examples:\n\n"
        for i, ex in enumerate(examples, 1):
            prompt += f"Example {i}:\n"
            prompt += f"Input: {ex['input']}\n"
            prompt += f"Output: {ex['output']}\n\n"
        prompt += f"Now, given the following input, provide the output:\nInput: {query}\nOutput:"
        return prompt

    @staticmethod
    def chain_of_thought(query: str) -> str:
        return f"""{query}

Let me work through this step by step:

**Step 1: Understand the problem**
I need to identify what's being asked and what information is available.

**Step 2: Break down the components**
I'll decompose this into smaller, manageable parts.

**Step 3: Analyze each component**
For each part, I'll apply relevant reasoning and evidence.

**Step 4: Consider alternatives**
Let me check if there are other valid interpretations or approaches.

**Step 5: Synthesize and conclude**
Combining all the analysis above, here is my answer:

Step-by-step reasoning:"""

    @staticmethod
    def tree_of_thought(query: str) -> str:
        return f"""{query}

Let me explore multiple reasoning paths before concluding:

━━━ Thought Path A: Analytical Reasoning ━━━
Starting point: First principles approach
- Break down into axioms and derive from there
- Pros: Rigorous, verifiable
- Cons: May miss creative solutions
Evaluation: [Rate 1-10]

━━━ Thought Path B: Analogical Reasoning ━━━
Starting point: What similar problems have been solved?
- Find analogous situations in other domains
- Pros: Often reveals unexpected solutions
- Cons: Analogies can be misleading
Evaluation: [Rate 1-10]

━━━ Thought Path C: Empirical Reasoning ━━━
Starting point: What does the data show?
- Look at observed patterns and statistics
- Pros: Grounded in reality
- Cons: May not generalize
Evaluation: [Rate 1-10]

━━━ Thought Path D: Adversarial Reasoning ━━━
Starting point: What could go wrong?
- Challenge each assumption, seek contradictions
- Pros: Stress-tests the conclusion
- Cons: Can be overly skeptical
Evaluation: [Rate 1-10]

Best path after evaluation:"""

    @staticmethod
    def react_prompt(query: str, tools: List[Dict[str, str]]) -> str:
        tool_desc = "\n".join([
            f"  {t['name']}: {t['description']} (args: {t.get('args', 'none')})"
            for t in tools
        ])
        return f"""You are a reasoning agent. You have access to these tools:

{tool_desc}

To answer the query, use this exact format:

Thought: <your reasoning about what to do next>
Action: <tool_name>
Action Input: <JSON or plain input for the tool>
Observation: <result will be filled in by the system>

... (repeat Thought/Action/Action Input/Observation as needed) ...

Thought: I now have enough information to answer.
Final Answer: <your complete, final answer>

---

Query: {query}

Let me start thinking..."""

    @staticmethod
    def self_consistency(query: str, n_paths: int = 3) -> str:
        paths = "\n\n".join([
            f"**Path {i+1}:**\nReasoning path {i+1} analysis..."
            for i in range(n_paths)
        ])
        return f"""{query}

Generate {n_paths} independent reasoning paths:

{paths}

After generating all paths, identify the most common answer and output it as the final answer.
The majority answer across all paths is the most likely correct answer.

Final Answer (majority vote):"""

    @staticmethod
    def meta_prompt(query: str) -> str:
        return f"""Before answering the query, first generate the best possible prompt to answer it yourself.

Original query: {query}

Step 1: Generate an improved prompt that would elicit a better response.
Step 2: Answer the improved prompt.
Step 3: Review your answer against the original query for completeness.

Now execute these steps:"""

    @staticmethod
    def structured_output(query: str, schema: Dict[str, str]) -> str:
        schema_str = "\n".join([f'  "{k}": <{v}>' for k, v in schema.items()])
        return f"""{query}

Respond in the following JSON format ONLY:

{{
{schema_str}
}}

Ensure all fields are present. Do not include any text outside the JSON.
Response:"""

# Usage
pe = PromptEngineer()

# Few-shot
print(pe.few_shot(
    examples=[
        {"input": "The movie was great", "output": "positive"},
        {"input": "Terrible waste of time", "output": "negative"},
    ],
    query="I loved every minute of it",
    task="Sentiment analysis"
))

# Chain of thought
print(pe.chain_of_thought("If a train travels at 60mph for 2.5 hours, how far does it go?"))

# ReAct with tools
print(pe.react_prompt(
    query="What's the weather in Singapore right now?",
    tools=[
        {"name": "search", "description": "Search the web", "args": "query: string"},
        {"name": "calculator", "description": "Do math", "args": "expression: string"},
    ]
))
```

### 2.4 Token Management & Cost Optimization

```python
import tiktoken
from typing import Dict, Optional
from dataclasses import dataclass, field
from collections import defaultdict
import hashlib
import json
import time

@dataclass
class TokenBudget:
    total_budget: int = 100_000
    used: int = 0
    model_costs: Dict[str, Dict[str, float]] = field(default_factory=lambda: {
        "gpt-4o":        {"input": 2.50,  "output": 10.00},
        "gpt-4o-mini":   {"input": 0.15,  "output": 0.60},
        "claude-sonnet-4-20250514": {"input": 3.00,  "output": 15.00},
        "llama-3.1-70b-versatile":  {"input": 0.59,  "output": 0.79},
    })
    usage_log: list = field(default_factory=list)

    def count_tokens(self, text: str, model: str = "gpt-4o") -> int:
        try:
            enc = tiktoken.encoding_for_model(model)
        except KeyError:
            enc = tiktoken.get_encoding("cl100k_base")
        return len(enc.encode(text))

    def estimate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        costs = self.model_costs.get(model, {"input": 3.0, "output": 15.0})
        return (input_tokens * costs["input"] + output_tokens * costs["output"]) / 1_000_000

    def can_afford(self, text: str, model: str = "gpt-4o", is_output: bool = False) -> bool:
        tokens = self.count_tokens(text, model)
        return (self.used + tokens) <= self.total_budget

    def consume(self, text: str, model: str = "gpt-4o", is_output: bool = False) -> Dict:
        tokens = self.count_tokens(text, model)
        cost = self.estimate_cost(tokens, 0 if not is_output else tokens, model)
        self.used += tokens
        record = {"tokens": tokens, "cost": cost, "model": model, "remaining": self.total_budget - self.used}
        self.usage_log.append(record)
        return record

    def summary(self) -> Dict:
        total_cost = sum(r["cost"] for r in self.usage_log)
        by_model = defaultdict(lambda: {"tokens": 0, "cost": 0.0})
        for r in self.usage_log:
            by_model[r["model"]]["tokens"] += r["tokens"]
            by_model[r["model"]]["cost"] += r["cost"]
        return {
            "total_tokens": self.used,
            "total_cost": round(total_cost, 6),
            "remaining": self.total_budget - self.used,
            "by_model": dict(by_model),
        }

class SemanticCache:
    def __init__(self, similarity_threshold: float = 0.95):
        self.cache: Dict[str, Dict] = {}
        self.threshold = similarity_threshold
        self._embedding_cache: Dict[str, list] = {}
        self.hits = 0
        self.misses = 0

    def _hash_query(self, query: str) -> str:
        return hashlib.sha256(query.lower().strip().encode()).hexdigest()[:16]

    def get(self, query: str) -> Optional[str]:
        key = self._hash_query(query)
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["timestamp"] < entry.get("ttl", 3600):
                self.hits += 1
                return entry["response"]
            else:
                del self.cache[key]
        self.misses += 1
        return None

    def set(self, query: str, response: str, ttl: float = 3600) -> None:
        key = self._hash_query(query)
        self.cache[key] = {
            "response": response,
            "timestamp": time.time(),
            "ttl": ttl,
            "query": query,
        }

    def stats(self) -> Dict:
        total = self.hits + self.misses
        return {
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": self.hits / total if total > 0 else 0.0,
            "cache_size": len(self.cache),
        }

# Usage
budget = TokenBudget(total_budget=50_000)
result = budget.consume("Explain quantum computing in simple terms", model="gpt-4o")
print(f"Cost: ${result['cost']:.6f}, Remaining: {result['remaining']} tokens")
print(budget.summary())

cache = SemanticCache()
cache.set("What is AI?", "AI is artificial intelligence...")
print(cache.get("What is AI?"))  # Cache hit
print(cache.stats())
```

### 2.5 Streaming & Structured Output

```python
from pydantic import BaseModel, Field
from typing import List, Optional, AsyncIterator
import json
import asyncio
import httpx

class ResearchOutput(BaseModel):
    topic: str
    summary: str = Field(description="2-3 sentence summary")
    key_findings: List[str] = Field(description="List of 3-5 key findings")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score 0-1")
    sources: List[str] = Field(description="List of source references")
    implications: Optional[List[str]] = None

class CodeReviewOutput(BaseModel):
    file_path: str
    issues: List[dict] = Field(description="List of issues with line, severity, description")
    overall_quality: str = Field(description="excellent/good/needs_improvement/poor")
    suggestions: List[str]
    score: int = Field(ge=0, le=100)

class StreamingClient:
    def __init__(self, api_key: str, base_url: str = "https://api.openai.com/v1"):
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=60.0,
        )

    async def stream_chat(
        self,
        messages: list[dict],
        model: str = "gpt-4o",
        **kwargs,
    ) -> AsyncIterator[str]:
        async with self.client.stream(
            "POST",
            "/chat/completions",
            json={"model": model, "messages": messages, "stream": True, **kwargs},
        ) as response:
            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:]
                if data.strip() == "[DONE]":
                    break
                chunk = json.loads(data)
                delta = chunk["choices"][0].get("delta", {})
                if "content" in delta:
                    yield delta["content"]

    async def structured_chat(
        self,
        messages: list[dict],
        response_format: type[BaseModel],
        model: str = "gpt-4o",
        **kwargs,
    ) -> BaseModel:
        schema = response_format.model_json_schema()
        json_prompt = f"""Respond in valid JSON matching this schema:
{json.dumps(schema, indent=2)}

Only output the JSON, nothing else."""
        messages_with_format = messages + [{"role": "system", "content": json_prompt}]
        r = await self.client.post(
            "/chat/completions",
            json={"model": model, "messages": messages_with_format, **kwargs},
        )
        r.raise_for_status()
        content = r.json()["choices"][0]["message"]["content"]
        # Strip markdown code fences if present
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3]
        return response_format.model_validate_json(content.strip())

# Usage
async def demo():
    client = StreamingClient(api_key="sk-...")

    # Streaming
    print("Streaming response:")
    async for token in client.stream_chat([{"role": "user", "content": "Tell a short story"}]):
        print(token, end="", flush=True)
    print()

    # Structured output
    result = await client.structured_chat(
        [{"role": "user", "content": "Analyze the impact of quantum computing on cryptography in 2026"}],
        response_format=ResearchOutput,
    )
    print(f"\nTopic: {result.topic}")
    print(f"Confidence: {result.confidence}")
    print(f"Key findings: {result.key_findings}")
```

### 2.6 Local LLMs with Ollama

```python
import httpx
import json
import asyncio
from typing import List, Dict, AsyncIterator, Optional

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.client = httpx.AsyncClient(base_url=base_url, timeout=120.0)

    async def generate(
        self,
        model: str,
        prompt: str,
        system: str = "",
        temperature: float = 0.7,
        top_p: float = 0.9,
        seed: Optional[int] = None,
    ) -> str:
        payload = {
            "model": model,
            "prompt": prompt,
            "system": system,
            "stream": False,
            "options": {"temperature": temperature, "top_p": top_p},
        }
        if seed is not None:
            payload["options"]["seed"] = seed
        r = await self.client.post("/api/generate", json=payload)
        r.raise_for_status()
        return r.json()["response"]

    async def generate_stream(
        self,
        model: str,
        prompt: str,
        system: str = "",
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        async with self.client.stream(
            "POST",
            "/api/generate",
            json={"model": model, "prompt": prompt, "system": system, "stream": True, "options": {"temperature": temperature}},
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    data = json.loads(line)
                    if "response" in data:
                        yield data["response"]

    async def chat(self, model: str, messages: List[Dict], **kwargs) -> str:
        r = await self.client.post(
            "/api/chat",
            json={"model": model, "messages": messages, "stream": False, **kwargs},
        )
        r.raise_for_status()
        return r.json()["message"]["content"]

    async def embed(self, model: str, text: str) -> List[float]:
        r = await self.client.post("/api/embeddings", json={"model": model, "prompt": text})
        r.raise_for_status()
        return r.json()["embedding"]

    async def list_models(self) -> List[Dict]:
        r = await self.client.get("/api/tags")
        r.raise_for_status()
        return r.json()["models"]

    async def pull_model(self, model: str) -> bool:
        try:
            r = await self.client.post("/api/pull", json={"name": model})
            r.raise_for_status()
            return True
        except Exception:
            return False

    async def health_check(self) -> bool:
        try:
            r = await self.client.get("/api/tags")
            return r.status_code == 200
        except Exception:
            return False

# Usage
async def demo():
    ollama = OllamaClient()

    # Check if Ollama is running
    if not await ollama.health_check():
        print("Ollama is not running. Start it with: ollama serve")
        return

    # List available models
    models = await ollama.list_models()
    print(f"Available models: {[m['name'] for m in models]}")

    # Generate
    response = await ollama.generate(
        "qwen2.5:7b",
        "Explain the difference between a stack and a queue",
        system="You are a helpful CS tutor. Be concise.",
    )
    print(response)

    # Streaming
    print("\nStreaming:")
    async for token in ollama.generate_stream("qwen2.5:7b", "Write a haiku about coding"):
        print(token, end="", flush=True)
    print()

    # Embeddings
    embedding = await ollama.embed("nomic-embed-text", "Hello world")
    print(f"Embedding dim: {len(embedding)}")

asyncio.run(demo())
```

### 2.7 Free LLM APIs

```python
import httpx
import os
from typing import List, Dict, Optional

class FreeLLMRoutes:
    """Route to free/cheap LLM providers with their API schemas"""

    PROVIDERS = {
        "groq": {
            "base_url": "https://api.groq.com/openai/v1",
            "env_key": "GROQ_API_KEY",
            "format": "openai",
            "models": {
                "llama-3.1-70b-versatile": {"context": 128000, "speed": "fast"},
                "llama-3.1-8b-instant":    {"context": 128000, "speed": "very_fast"},
                "mixtral-8x7b-32768":      {"context": 32768,  "speed": "fast"},
                "gemma2-9b-it":            {"context": 8192,   "speed": "fast"},
            },
        },
        "deepseek": {
            "base_url": "https://api.deepseek.com",
            "env_key": "DEEPSEEK_API_KEY",
            "format": "openai",
            "models": {
                "deepseek-chat":    {"context": 64000, "speed": "medium"},
                "deepseek-reasoner":{"context": 64000, "speed": "slow"},
            },
        },
        "openrouter": {
            "base_url": "https://openrouter.ai/api/v1",
            "env_key": "OPENROUTER_API_KEY",
            "format": "openai",
            "models": {
                "meta-llama/llama-3.1-70b-instruct":   {"context": 128000, "speed": "fast"},
                "mistralai/mixtral-8x7b-instruct":     {"context": 32768,  "speed": "fast"},
                "google/gemma-2-9b-it:free":            {"context": 8192,   "speed": "fast"},
            },
        },
        "gemini": {
            "base_url": "https://generativelanguage.googleapis.com/v1beta",
            "env_key": "GEMINI_API_KEY",
            "format": "gemini",
            "models": {
                "gemini-2.0-flash":  {"context": 1048576, "speed": "very_fast"},
                "gemini-1.5-flash":  {"context": 1048576, "speed": "very_fast"},
                "gemini-1.5-pro":    {"context": 2097152, "speed": "medium"},
            },
        },
    }

    @classmethod
    def get_available_providers(cls) -> List[str]:
        available = []
        for name, config in cls.PROVIDERS.items():
            key = os.getenv(config["env_key"], "")
            if key:
                available.append(name)
        return available

    @classmethod
    def route(cls, query: str, provider: str = "auto", model: str = None) -> Dict:
        if provider == "auto":
            providers = cls.get_available_providers()
            provider = providers[0] if providers else None
        if not provider or provider not in cls.PROVIDERS:
            raise ValueError(f"Provider '{provider}' not available. Available: {cls.get_available_providers()}")
        return {"provider": provider, "model": model, "query": query}

class UnifiedFreeLLM:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=60.0)

    async def complete(
        self,
        messages: List[Dict],
        provider: str = "groq",
        model: str = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> str:
        config = FreeLLMRoutes.PROVIDERS[provider]
        api_key = os.getenv(config["env_key"])
        if not api_key:
            raise ValueError(f"Missing {config['env_key']} environment variable")

        if config["format"] == "openai":
            return await self._openai_format(config, api_key, messages, model, temperature, max_tokens)
        elif config["format"] == "gemini":
            return await self._gemini_format(config, api_key, messages, model, temperature, max_tokens)

    async def _openai_format(self, config, api_key, messages, model, temperature, max_tokens):
        if not model:
            model = list(config["models"].keys())[0]
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        r = await self.client.post(
            f"{config['base_url']}/chat/completions",
            headers=headers,
            json={"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens},
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]

    async def _gemini_format(self, config, api_key, messages, model, temperature, max_tokens):
        if not model:
            model = list(config["models"].keys())[0]
        contents = [{"role": m["role"], "parts": [{"text": m["content"]}]} for m in messages]
        r = await self.client.post(
            f"{config['base_url']}/models/{model}:generateContent?key={api_key}",
            json={"contents": contents, "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens}},
        )
        r.raise_for_status()
        return r.json()["candidates"][0]["content"]["parts"][0]["text"]

# Usage
async def demo():
    llm = UnifiedFreeLLM()
    providers = FreeLLMRoutes.get_available_providers()
    print(f"Available providers: {providers}")

    messages = [{"role": "user", "content": "What are the 3 laws of thermodynamics?"}]
    response = await llm.complete(messages, provider="groq", model="llama-3.1-70b-versatile")
    print(response)

asyncio.run(demo())
```

### 2.8 LLM Evaluation Pipeline

```python
from dataclasses import dataclass, field
from typing import List, Dict, Callable, Optional
import time
import json
import statistics

@dataclass
class EvalResult:
    prompt: str
    response: str
    latency: float
    tokens: int
    score: float
    model: str
    metadata: Dict = field(default_factory=dict)

@dataclass
class EvalSuite:
    name: str
    results: List[EvalResult] = field(default_factory=list)

class LLMEvaluator:
    def __init__(self, llm_func: Callable[[str], str]):
        self.llm = llm_func
        self.suites: Dict[str, EvalSuite] = {}

    def evaluate(
        self,
        test_cases: List[Dict],
        suite_name: str = "default",
        scoring: str = "overlap",
    ) -> EvalSuite:
        suite = EvalSuite(name=suite_name)
        for case in test_cases:
            prompt = case["prompt"]
            expected = case.get("expected", "")
            start = time.perf_counter()
            try:
                response = self.llm(prompt)
            except Exception as e:
                response = f"ERROR: {e}"
            latency = time.perf_counter() - start
            tokens = len(response.split())
            score = self._score(response, expected, scoring)
            suite.results.append(EvalResult(
                prompt=prompt,
                response=response[:200],
                latency=latency,
                tokens=tokens,
                score=score,
                model=case.get("model", "unknown"),
                metadata={"expected": expected, "scoring": scoring},
            ))
        self.suites[suite_name] = suite
        return suite

    def _score(self, response: str, expected: str, method: str) -> float:
        if not expected:
            return 1.0
        if method == "overlap":
            resp_words = set(response.lower().split())
            exp_words = set(expected.lower().split())
            if not exp_words:
                return 1.0
            return len(resp_words & exp_words) / len(exp_words)
        elif method == "contains":
            return 1.0 if expected.lower() in response.lower() else 0.0
        elif method == "exact":
            return 1.0 if response.strip().lower() == expected.strip().lower() else 0.0
        return 0.5

    def compare_models(self, test_cases: List[Dict], models: Dict[str, Callable]) -> Dict:
        comparisons = {}
        for model_name, model_func in models.items():
            evaluator = LLMEvaluator(model_func)
            suite = evaluator.evaluate(test_cases, suite_name=model_name)
            comparisons[model_name] = self._suite_summary(suite)
        return comparisons

    def _suite_summary(self, suite: EvalSuite) -> Dict:
        if not suite.results:
            return {}
        latencies = [r.latency for r in suite.results]
        scores = [r.score for r in suite.results]
        tokens = [r.tokens for r in suite.results]
        return {
            "avg_latency": statistics.mean(latencies),
            "p50_latency": statistics.median(latencies),
            "p95_latency": sorted(latencies)[int(len(latencies) * 0.95)] if len(latencies) > 1 else latencies[0],
            "avg_score": statistics.mean(scores),
            "min_score": min(scores),
            "max_score": max(scores),
            "total_tokens": sum(tokens),
            "num_cases": len(suite.results),
        }

    def summary(self, suite_name: str = "default") -> Dict:
        suite = self.suites.get(suite_name)
        if not suite:
            return {"error": f"Suite '{suite_name}' not found"}
        return self._suite_summary(suite)

    def export(self, filepath: str, suite_name: str = "default") -> None:
        suite = self.suites.get(suite_name)
        if not suite:
            return
        data = {
            "suite": suite.name,
            "results": [
                {
                    "prompt": r.prompt,
                    "response": r.response,
                    "latency": r.latency,
                    "tokens": r.tokens,
                    "score": r.score,
                    "model": r.model,
                }
                for r in suite.results
            ],
            "summary": self._suite_summary(suite),
        }
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)

# Usage
def mock_llm(prompt: str) -> str:
    return "Quantum computing uses qubits instead of classical bits"

evaluator = LLMEvaluator(mock_llm)
test_cases = [
    {"prompt": "What is quantum computing?", "expected": "quantum computing qubits bits"},
    {"prompt": "Explain machine learning", "expected": "machine learning data patterns"},
    {"prompt": "What is deep learning?", "expected": "deep learning neural networks"},
]
suite = evaluator.evaluate(test_cases, suite_name="quantum_test")
print(evaluator.summary("quantum_test"))
evaluator.export("eval_results.json", "quantum_test")
```

---

## Phase 3: RAG & Vector Databases

### 3.1 Embedding Models Comparison

```
┌──────────────────────────────┬───────┬─────────┬─────────┬──────────────┐
│ Model                        │ Dims  │ Speed   │ Quality │ Cost/1M tok  │
├──────────────────────────────┼───────┼─────────┼─────────┼──────────────┤
│ all-MiniLM-L6-v2             │ 384   │ Fast    │ Good    │ Free (local) │
│ all-mpnet-base-v2            │ 768   │ Medium  │ Great   │ Free (local) │
│ BGE-large-en-v1.5            │ 1024  │ Medium  │ Great   │ Free (local) │
│ BGE-m3                       │ 1024  │ Medium  │ Best    │ Free (local) │
│ text-embedding-3-small       │ 1536  │ Medium  │ Great   │ $0.02        │
│ text-embedding-3-large       │ 3072  │ Slow    │ Best    │ $0.13        │
│ Cohere embed-v3              │ 1024  │ Medium  │ Great   │ $0.10        │
│ Jina-embeddings-v3           │ 1024  │ Medium  │ Great   │ $0.02        │
└──────────────────────────────┴───────┴─────────┴─────────┴──────────────┘

Recommended picks:
  Budget/Local  → all-MiniLM-L6-v2 (384d) or BGE-large-en-v1.5 (1024d)
  Production    → text-embedding-3-small (1536d) or BGE-m3 (1024d)
  Max quality   → text-embedding-3-large (3072d)
```

```python
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Optional
import time

class EmbeddingPipeline:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2", device: str = "cpu"):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name, device=device)
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed(self, texts: List[str], batch_size: int = 32, show_progress: bool = False) -> np.ndarray:
        return self.model.encode(texts, batch_size=batch_size, show_progress_bar=show_progress, normalize_embeddings=True)

    def embed_single(self, text: str) -> np.ndarray:
        return self.model.encode([text], normalize_embeddings=True)[0]

    def similarity(self, text1: str, text2: str) -> float:
        emb1 = self.embed_single(text1)
        emb2 = self.embed_single(text2)
        return float(np.dot(emb1, emb2))

    def batch_similarity(self, query: str, documents: List[str]) -> List[float]:
        query_emb = self.embed_single(query)
        doc_embs = self.embed(documents)
        similarities = np.dot(doc_embs, query_emb)
        return similarities.tolist()

    def rank_documents(self, query: str, documents: List[str], top_k: int = 5) -> List[dict]:
        sims = self.batch_similarity(query, documents)
        ranked = sorted(zip(documents, sims), key=lambda x: x[1], reverse=True)
        return [{"document": doc, "score": score} for doc, score in ranked[:top_k]]

class EmbeddingBenchmark:
    def __init__(self):
        self.models: List[str] = []

    def benchmark(self, model_name: str, texts: List[str], n_runs: int = 3) -> dict:
        model = SentenceTransformer(model_name)
        # Warmup
        model.encode(texts[:2])
        # Benchmark
        times = []
        for _ in range(n_runs):
            start = time.perf_counter()
            embeddings = model.encode(texts)
            times.append(time.perf_counter() - start)
        return {
            "model": model_name,
            "dimension": model.get_sentence_embedding_dimension(),
            "num_texts": len(texts),
            "avg_time": statistics.mean(times),
            "min_time": min(times),
            "max_time": max(times),
            "embeddings_shape": embeddings.shape,
        }

# Usage
pipeline = EmbeddingPipeline("all-MiniLM-L6-v2")
query = "What is machine learning?"
docs = [
    "Machine learning is a subset of artificial intelligence.",
    "Python is a programming language.",
    "ML algorithms learn patterns from data.",
    "Deep learning uses neural networks.",
]
ranked = pipeline.rank_documents(query, docs, top_k=3)
for r in ranked:
    print(f"  {r['score']:.4f} | {r['document']}")
```

### 3.2 Vector Database Comparison & Setup

```python
# ===== ChromaDB - Local, lightweight =====
import chromadb

def setup_chromadb():
    client = chromadb.Client()
    # Or persistent: client = chromadb.PersistentClient(path="./chroma_db")

    collection = client.create_collection(
        name="documents",
        metadata={"hnsw:space": "cosine"},  # cosine, l2, ip
    )

    collection.add(
        documents=[
            "AI is transforming healthcare with diagnostic imaging",
            "Python is the most popular language for ML",
            "Transformers revolutionized natural language processing",
            "Vector databases enable semantic search at scale",
            "RAG combines retrieval with generation for accurate answers",
        ],
        ids=["doc1", "doc2", "doc3", "doc4", "doc5"],
        metadatas=[
            {"source": "healthcare_paper", "year": 2024},
            {"source": "survey_2024", "year": 2024},
            {"source": "nlp_review", "year": 2023},
            {"source": "tech_blog", "year": 2024},
            {"source": "rag_paper", "year": 2024},
        ],
    )

    results = collection.query(
        query_texts=["machine learning in medicine"],
        n_results=3,
        include=["documents", "distances", "metadatas"],
    )
    return results

# ===== FAISS - Meta, high performance =====
import faiss
import numpy as np

def setup_faiss():
    dimension = 384
    n_vectors = 10_000

    # IndexFlatIP = exact inner product search
    index = faiss.IndexFlatIP(dimension)

    # Generate random vectors (replace with real embeddings)
    vectors = np.random.random((n_vectors, dimension)).astype("float32")
    faiss.normalize_L2(vectors)  # Normalize for cosine similarity
    index.add(vectors)

    # Search
    query = np.random.random((1, dimension)).astype("float32")
    faiss.normalize_L2(query)
    distances, indices = index.search(query, k=5)
    return distances, indices

    # For large datasets, use IVF index
    # nlist = 100  # number of clusters
    # quantizer = faiss.IndexFlatIP(dimension)
    # index = faiss.IndexIVFFlat(quantizer, dimension, nlist, faiss.METRIC_INNER_PRODUCT)
    # index.train(vectors)
    # index.add(vectors)
    # index.nprobe = 10  # search 10 clusters

# ===== Qdrant =====
def setup_qdrant():
    from qdrant_client import QdrantClient
    from qdrant_client.models import VectorParams, Distance, PointStruct

    client = QdrantClient(":memory:")  # Or host="localhost", port=6333

    client.create_collection(
        collection_name="documents",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )

    client.upsert(
        collection_name="documents",
        points=[
            PointStruct(id=1, vector=[0.1]*384, payload={"text": "AI is transforming industries", "source": "paper1"}),
            PointStruct(id=2, vector=[0.2]*384, payload={"text": "Deep learning needs lots of data", "source": "paper2"}),
            PointStruct(id=3, vector=[0.3]*384, payload={"text": "NLP uses transformers architecture", "source": "paper3"}),
        ],
    )

    results = client.search(
        collection_name="documents",
        query_vector=[0.1]*384,
        limit=3,
    )
    return results

# ===== Pinecone =====
def setup_pinecone():
    from pinecone import Pinecone

    pc = Pinecone(api_key="YOUR_API_KEY")
    index = pc.Index("documents")

    index.upsert(vectors=[
        ("1", [0.1]*384, {"text": "AI transforming healthcare"}),
        ("2", [0.2]*384, {"text": "Python for machine learning"}),
        ("3", [0.3]*384, {"text": "NLP with transformers"}),
    ])

    results = index.query(vector=[0.1]*384, top_k=5, include_metadata=True)
    return results
```

### 3.3 Chunking Strategies

```python
from typing import List, Callable, Optional
import re

class ChunkingStrategies:
    @staticmethod
    def fixed_size(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        chunks = []
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size]
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    @staticmethod
    def recursive(
        text: str,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        separators: List[str] = None,
    ) -> List[str]:
        if separators is None:
            separators = ["\n\n", "\n", ". ", " ", ""]
        return _recursive_split(text, separators, chunk_size, chunk_overlap)

    @staticmethod
    def markdown_headers(text: str) -> List[str]:
        chunks = []
        current_header = ""
        current_content = []
        lines = text.split("\n")

        for line in lines:
            if re.match(r"^#{1,6}\s", line):
                if current_content:
                    chunks.append(f"{current_header}\n{''.join(current_content)}")
                current_header = line
                current_content = []
            else:
                current_content.append(line + "\n")

        if current_content:
            chunks.append(f"{current_header}\n{''.join(current_content)}")
        return [c.strip() for c in chunks if c.strip()]

    @staticmethod
    def sentence_based(text: str, max_sentences: int = 5) -> List[str]:
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        for i in range(0, len(sentences), max_sentences):
            chunk = " ".join(sentences[i:i + max_sentences])
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    @staticmethod
    def semantic(
        text: str,
        embeddings_func: Callable[[str, str], float],
        threshold: float = 0.5,
        min_chunk_sentences: int = 2,
    ) -> List[str]:
        sentences = re.split(r'(?<=[.!?])\s+', text)
        if not sentences:
            return []

        chunks: List[str] = []
        current_group: List[str] = [sentences[0]]

        for i in range(1, len(sentences)):
            sim = embeddings_func(" ".join(current_group), sentences[i])
            if sim < threshold or len(current_group) >= 10:
                chunks.append(" ".join(current_group))
                current_group = [sentences[i]]
            else:
                current_group.append(sentences[i])

        if current_group:
            chunks.append(" ".join(current_group))
        return chunks

    @staticmethod
    def document_aware(
        text: str,
        metadata_extractor: Callable[[str], dict] = None,
        section_markers: List[str] = None,
    ) -> List[dict]:
        if section_markers is None:
            section_markers = ["\n\n", "\n---\n", "\n## "]

        chunks = [text]
        for marker in section_markers:
            new_chunks = []
            for chunk in chunks:
                new_chunks.extend(chunk.split(marker))
            chunks = new_chunks

        results = []
        for i, chunk in enumerate(chunks):
            if not chunk.strip():
                continue
            entry = {"content": chunk.strip(), "chunk_index": i}
            if metadata_extractor:
                entry["metadata"] = metadata_extractor(chunk)
            results.append(entry)
        return results

def _recursive_split(text, separators, chunk_size, overlap):
    if len(text) <= chunk_size:
        return [text] if text.strip() else []
    sep = separators[0] if separators else ""
    remaining_seps = separators[1:] if len(separators) > 1 else [""]

    if sep == "":
        return ChunkingStrategies.fixed_size(text, chunk_size, overlap)

    parts = text.split(sep)
    chunks = []
    current = ""
    for part in parts:
        candidate = current + sep + part if current else part
        if len(candidate) <= chunk_size:
            current = candidate
        else:
            if current.strip():
                if len(current) > chunk_size:
                    chunks.extend(_recursive_split(current, remaining_seps, chunk_size, overlap))
                else:
                    chunks.append(current)
            current = part
    if current.strip():
        if len(current) > chunk_size:
            chunks.extend(_recursive_split(current, remaining_seps, chunk_size, overlap))
        else:
            chunks.append(current)
    return chunks

# Usage
text = """## Introduction
Machine learning is a branch of artificial intelligence.

## Fundamentals
ML algorithms learn from data. Supervised learning uses labeled examples.
Unsupervised learning finds patterns without labels.

## Deep Learning
Neural networks with many layers are called deep learning.
Transformers are the dominant architecture in NLP.

## Applications
Computer vision, NLP, and robotics are major application areas."""

print("=== Fixed Size ===")
for c in ChunkingStrategies.fixed_size(text, chunk_size=100, overlap=20):
    print(f"  [{len(c)}] {c[:60]}...")

print("\n=== Sentence Based ===")
for c in ChunkingStrategies.sentence_based(text, max_sentences=2):
    print(f"  [{len(c)}] {c[:60]}...")

print("\n=== Document Aware ===")
for c in ChunkingStrategies.document_aware(text):
    print(f"  [chunk {c['chunk_index']}] {c['content'][:60]}...")
```

### 3.4 Complete RAG Pipeline

```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader, CSVLoader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from typing import List, Dict, Optional
from dataclasses import dataclass, field
import os
import time

@dataclass
class RAGResponse:
    answer: str
    sources: List[str]
    num_chunks: int
    latency: float
    confidence: float = 0.0

class ProductionRAG:
    def __init__(
        self,
        embedding_model: str = "all-MiniLM-L6-v2",
        llm_model: str = "gpt-4o-mini",
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        persist_directory: Optional[str] = None,
    ):
        self.embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " "],
        )
        self.llm = ChatOpenAI(model=llm_model, temperature=0)
        self.persist_directory = persist_directory
        self.vector_store: Optional[Chroma] = None

    def ingest_directory(self, dir_path: str, glob: str = "**/*.pdf") -> int:
        if glob.endswith("pdf"):
            loader = DirectoryLoader(dir_path, glob=glob, loader_cls=PyPDFLoader)
        elif glob.endswith("txt"):
            loader = DirectoryLoader(dir_path, glob=glob, loader_cls=TextLoader)
        elif glob.endswith("csv"):
            loader = DirectoryLoader(dir_path, glob=glob, loader_cls=CSVLoader)
        else:
            loader = DirectoryLoader(dir_path, glob=glob, loader_cls=TextLoader)

        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        self.vector_store = Chroma.from_documents(
            chunks,
            self.embeddings,
            persist_directory=self.persist_directory,
        )
        return len(chunks)

    def ingest_files(self, file_paths: List[str]) -> int:
        docs = []
        for path in file_paths:
            if path.endswith(".pdf"):
                docs.extend(PyPDFLoader(path).load())
            elif path.endswith(".csv"):
                docs.extend(CSVLoader(path).load())
            else:
                docs.extend(TextLoader(path).load())
        chunks = self.text_splitter.split_documents(docs)
        self.vector_store = Chroma.from_documents(chunks, self.embeddings)
        return len(chunks)

    def ingest_texts(self, texts: List[str], metadatas: List[Dict] = None) -> int:
        docs = [
            Document(page_content=t, metadata=metadatas[i] if metadatas else {})
            for i, t in enumerate(texts)
        ]
        chunks = self.text_splitter.split_documents(docs)
        self.vector_store = Chroma.from_documents(chunks, self.embeddings)
        return len(chunks)

    def query(
        self,
        question: str,
        k: int = 4,
        search_type: str = "mmr",
        score_threshold: Optional[float] = None,
    ) -> RAGResponse:
        start = time.perf_counter()

        search_kwargs = {"k": k, "fetch_k": k * 3}
        if search_type == "similarity_score_threshold" and score_threshold:
            search_kwargs["score_threshold"] = score_threshold

        retriever = self.vector_store.as_retriever(
            search_type=search_type,
            search_kwargs=search_kwargs,
        )
        docs = retriever.invoke(question)
        context = "\n\n---\n\n".join([d.page_content for d in docs])

        prompt = ChatPromptTemplate.from_template("""Use the following context to answer the question.
If you cannot answer based on the context, say "I don't have enough information to answer this question."

Context:
{context}

Question: {question}

Answer:""")

        chain = prompt | self.llm
        response = chain.invoke({"context": context, "question": question})
        latency = time.perf_counter() - start

        return RAGResponse(
            answer=response.content,
            sources=[d.metadata.get("source", "unknown") for d in docs],
            num_chunks=len(docs),
            latency=latency,
        )

    def query_with_sources(self, question: str, k: int = 4) -> Dict:
        response = self.query(question, k)
        return {
            "answer": response.answer,
            "sources": response.sources,
            "num_chunks": response.num_chunks,
            "latency": response.latency,
        }

    def evaluate(self, test_cases: List[Dict]) -> List[Dict]:
        results = []
        for case in test_cases:
            output = self.query(case["question"])
            results.append({
                "question": case["question"],
                "expected": case.get("expected", ""),
                "got": output.answer,
                "sources": output.sources,
                "latency": output.latency,
            })
        return results

# Usage
rag = ProductionRAG(
    embedding_model="all-MiniLM-L6-v2",
    llm_model="gpt-4o-mini",
    chunk_size=500,
    chunk_overlap=50,
)

# Ingest documents
# num_chunks = rag.ingest_directory("./docs", glob="**/*.pdf")
# num_chunks = rag.ingest_files(["./report.pdf", "./notes.txt"])
# num_chunks = rag.ingest_texts([
#     "RAG combines retrieval with generation.",
#     "Vector databases enable semantic search.",
# ])

# Query
result = rag.query("What is RAG?")
print(f"Answer: {result.answer}")
print(f"Sources: {result.sources}")
print(f"Chunks used: {result.num_chunks}")
print(f"Latency: {result.latency:.2f}s")
```

### 3.5 Advanced RAG with Hybrid Search & Re-ranking

```python
from sentence_transformers import CrossEncoder
import numpy as np
from typing import List, Tuple, Optional
from dataclasses import dataclass
import time

@dataclass
class RankedDocument:
    content: str
    metadata: dict
    initial_score: float
    rerank_score: float
    rank: int

class AdvancedRAG:
    def __init__(
        self,
        base_rag: ProductionRAG,
        reranker_model: str = "cross-encoder/ms-marco-MiniLM-L-6-v2",
    ):
        self.rag = base_rag
        self.reranker = CrossEncoder(reranker_model)

    def hybrid_search(
        self,
        query: str,
        k: int = 4,
        alpha: float = 0.7,
    ) -> List[Tuple]:
        """Combine semantic search with keyword matching using RRF"""
        # Semantic search
        semantic_results = self.rag.vector_store.similarity_search_with_score(query, k=k * 3)

        # Keyword search (simple TF-based)
        keyword_results = self._keyword_search(query, k=k * 3)

        # Reciprocal Rank Fusion
        rrf_scores: dict[str, dict] = {}
        rrf_k = 60

        for rank, (doc, score) in enumerate(semantic_results):
            doc_id = doc.page_content[:100]
            if doc_id not in rrf_scores:
                rrf_scores[doc_id] = {"doc": doc, "score": 0.0}
            rrf_scores[doc_id]["score"] += alpha * (1.0 / (rrf_k + rank + 1))

        for rank, (doc, score) in enumerate(keyword_results):
            doc_id = doc.page_content[:100]
            if doc_id not in rrf_scores:
                rrf_scores[doc_id] = {"doc": doc, "score": 0.0}
            rrf_scores[doc_id]["score"] += (1 - alpha) * (1.0 / (rrf_k + rank + 1))

        ranked = sorted(rrf_scores.values(), key=lambda x: x["score"], reverse=True)
        return [(item["doc"], item["score"]) for item in ranked[:k]]

    def _keyword_search(self, query: str, k: int) -> List[Tuple]:
        """Simple keyword search fallback"""
        return self.rag.vector_store.similarity_search_with_score(query, k=k)

    def rerank(
        self,
        query: str,
        documents: List,
        top_k: int = 3,
    ) -> List[RankedDocument]:
        """Re-rank documents using a cross-encoder"""
        if not documents:
            return []

        pairs = [(query, doc.page_content if hasattr(doc, "page_content") else str(doc)) for doc in documents]
        scores = self.reranker.predict(pairs)

        ranked = sorted(zip(scores, documents), key=lambda x: x[0], reverse=True)
        results = []
        for rank, (score, doc) in enumerate(ranked[:top_k]):
            content = doc.page_content if hasattr(doc, "page_content") else str(doc)
            metadata = doc.metadata if hasattr(doc, "metadata") else {}
            results.append(RankedDocument(
                content=content,
                metadata=metadata,
                initial_score=0.0,
                rerank_score=float(score),
                rank=rank + 1,
            ))
        return results

    def query_with_rerank(
        self,
        question: str,
        k: int = 4,
        rerank_top: int = 3,
        use_hybrid: bool = True,
        alpha: float = 0.7,
    ) -> dict:
        """Complete advanced RAG query pipeline"""
        start = time.perf_counter()

        # Step 1: Retrieval
        if use_hybrid:
            retrieved = self.hybrid_search(question, k=k * 2, alpha=alpha)
            docs = [doc for doc, _ in retrieved]
        else:
            docs = self.rag.vector_store.similarity_search(question, k=k * 2)

        # Step 2: Re-rank
        reranked = self.rerank(question, docs, top_k=rerank_top)

        # Step 3: Generation
        context = "\n\n---\n\n".join([r.content for r in reranked])
        from langchain_core.prompts import ChatPromptTemplate
        prompt = ChatPromptTemplate.from_template("""Based on the following context, answer the question.
If the context doesn't contain enough information, say so.

Context:
{context}

Question: {question}

Answer:""")
        chain = prompt | self.rag.llm
        response = chain.invoke({"context": context, "question": question})

        latency = time.perf_counter() - start

        return {
            "answer": response.content,
            "sources": [{"content": r.content[:200], "score": r.rerank_score, "rank": r.rank, **r.metadata} for r in reranked],
            "num_chunks_retrieved": len(docs),
            "num_chunks_used": len(reranked),
            "latency": latency,
        }

# Usage
base_rag = ProductionRAG()
advanced = AdvancedRAG(base_rag)

# Ingest first
# base_rag.ingest_directory("./docs")

result = advanced.query_with_rerank(
    "What are the best practices for RAG?",
    k=6,
    rerank_top=3,
    use_hybrid=True,
)
print(f"Answer: {result['answer']}")
print(f"Sources: {result['num_chunks_used']}/{result['num_chunks_retrieved']} chunks used")
```

### 3.6 RAG Evaluation with RAGAS

```python
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from langchain_openai import ChatOpenAI
import time

@dataclass
class RAGMetrics:
    context_relevance: float
    faithfulness: float
    answer_relevance: float
    overall: float = 0.0

    def __post_init__(self):
        self.overall = (self.context_relevance + self.faithfulness + self.answer_relevance) / 3

    def summary(self) -> str:
        return (
            f"Context Relevance: {self.context_relevance:.3f} | "
            f"Faithfulness: {self.faithfulness:.3f} | "
            f"Answer Relevance: {self.answer_relevance:.3f} | "
            f"Overall: {self.overall:.3f}"
        )

@dataclass
class EvalCase:
    question: str
    answer: str
    contexts: List[str]
    ground_truth: Optional[str] = None

class RAGEvaluator:
    def __init__(self, llm: ChatOpenAI = None):
        self.llm = llm or ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def _llm_score(self, prompt: str) -> float:
        response = self.llm.invoke(prompt)
        try:
            text = response.content.strip()
            # Extract numeric score
            import re
            match = re.search(r'(\d+\.?\d*)', text)
            if match:
                score = float(match.group(1))
                return min(max(score, 0.0), 1.0)
        except Exception:
            pass
        return 0.5

    def evaluate_context_relevance(self, question: str, contexts: List[str]) -> float:
        if not contexts:
            return 0.0
        scores = []
        for ctx in contexts:
            prompt = f"""Rate how relevant this context is to answering the question.
Return ONLY a number between 0 and 1, where:
  0 = completely irrelevant
  0.5 = somewhat relevant
  1.0 = directly relevant

Question: {question}
Context: {ctx[:500]}

Score:"""
            scores.append(self._llm_score(prompt))
        return sum(scores) / len(scores)

    def evaluate_faithfulness(self, answer: str, contexts: List[str]) -> float:
        if not contexts:
            return 0.0
        prompt = f"""Rate how faithful this answer is to the given contexts.
The answer should only contain information found in the contexts.
Return ONLY a number between 0 and 1, where:
  0 = completely fabricated (not in contexts)
  0.5 = partially supported by contexts
  1.0 = fully supported by contexts

Answer: {answer}
Contexts: {" | ".join([c[:300] for c in contexts])}

Score:"""
        return self._llm_score(prompt)

    def evaluate_answer_relevance(self, question: str, answer: str) -> float:
        prompt = f"""Rate how relevant and helpful this answer is to the question.
Return ONLY a number between 0 and 1, where:
  0 = completely irrelevant
  0.5 = partially relevant
  1.0 = perfectly relevant and helpful

Question: {question}
Answer: {answer[:500]}

Score:"""
        return self._llm_score(prompt)

    def evaluate_answer_correctness(self, answer: str, ground_truth: str) -> float:
        prompt = f"""Compare the answer to the ground truth.
Rate how correct the answer is compared to the ground truth.
Return ONLY a number between 0 and 1.

Answer: {answer}
Ground Truth: {ground_truth}

Score:"""
        return self._llm_score(prompt)

    def full_evaluation(self, eval_case: EvalCase) -> RAGMetrics:
        metrics = RAGMetrics(
            context_relevance=self.evaluate_context_relevance(eval_case.question, eval_case.contexts),
            faithfulness=self.evaluate_faithfulness(eval_case.answer, eval_case.contexts),
            answer_relevance=self.evaluate_answer_relevance(eval_case.question, eval_case.answer),
        )
        return metrics

    def batch_evaluate(self, eval_cases: List[EvalCase]) -> Dict:
        results = []
        for case in eval_cases:
            metrics = self.full_evaluation(case)
            results.append({
                "question": case.question,
                "metrics": metrics,
            })

        avg_context = sum(r["metrics"].context_relevance for r in results) / len(results)
        avg_faith = sum(r["metrics"].faithfulness for r in results) / len(results)
        avg_answer = sum(r["metrics"].answer_relevance for r in results) / len(results)

        return {
            "num_cases": len(results),
            "avg_context_relevance": avg_context,
            "avg_faithfulness": avg_faith,
            "avg_answer_relevance": avg_answer,
            "avg_overall": (avg_context + avg_faith + avg_answer) / 3,
            "details": results,
        }

# Usage
evaluator = RAGEvaluator()

# Evaluate a single RAG response
eval_case = EvalCase(
    question="What is RAG?",
    answer="RAG combines retrieval and generation to provide accurate answers.",
    contexts=[
        "Retrieval-Augmented Generation (RAG) combines information retrieval with text generation.",
        "RAG systems retrieve relevant documents and use them to augment LLM prompts.",
    ],
    ground_truth="RAG is a technique that combines retrieval of relevant documents with LLM generation.",
)
metrics = evaluator.full_evaluation(eval_case)
print(metrics.summary())

# Batch evaluation
eval_cases = [
    eval_case,
    EvalCase(
        question="How does vector search work?",
        answer="Vector search uses embeddings to find similar documents.",
        contexts=["Vector search converts text to embeddings and finds nearest neighbors."],
        ground_truth="Vector search uses embedding similarity to find relevant documents.",
    ),
]
results = evaluator.batch_evaluate(eval_cases)
print(f"\nOverall Score: {results['avg_overall']:.3f}")
print(f"Context Relevance: {results['avg_context_relevance']:.3f}")
print(f"Faithfulness: {results['avg_faithfulness']:.3f}")
```
