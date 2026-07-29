# Phase 6: Agentic AI — Full Stack Production

---

## Phase 6: Agentic AI — Full Stack Production

### 6.1 Agent Design Patterns

**ReAct Pattern:**
```python
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from typing import Literal

llm = ChatOpenAI(model="gpt-4o")

@tool
def search(query: str) -> str:
    """Search for information"""
    return f"Search results for: {query}"

@tool
def calculate(expression: str) -> str:
    """Calculate math"""
    return str(eval(expression))

class ReActAgent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = {t.name: t for t in tools}
        self.max_iterations = 10
    
    def run(self, query: str) -> str:
        messages = [("system", f"""You are a ReAct agent. Use this format:
Thought: [reasoning]
Action: [tool_name]
Action Input: [input]
Observation: [result]
...repeat until you have the answer
Final Answer: [answer]

Tools: {', '.join(self.tools.keys())}"""), ("human", query)]
        
        for i in range(self.max_iterations):
            response = self.llm.invoke(messages)
            content = response.content
            
            if "Final Answer:" in content:
                return content.split("Final Answer:")[-1].strip()
            
            # Parse action
            for line in content.split("\n"):
                if line.startswith("Action:"):
                    tool_name = line.split("Action:")[-1].strip()
                    tool_input = content.split("Action Input:")[-1].split("\n")[0].strip()
                    if tool_name in self.tools:
                        observation = self.tools[tool_name].invoke(tool_input)
                        messages.append(("ai", content))
                        messages.append(("human", f"Observation: {observation}"))
                        break
        
        return "Max iterations reached"

agent = ReActAgent(llm, [search, calculate])
print(agent.run("What is the population of Singapore multiplied by 3.14?"))
```

**Plan-and-Execute Pattern:**
```python
class PlanAndExecuteAgent:
    def __init__(self, llm):
        self.llm = llm
    
    def plan(self, task: str) -> list:
        response = self.llm.invoke([("system", "Create a numbered plan. Return ONLY numbered steps."), ("human", task)])
        steps = [s.strip().split(".", 1)[-1].strip() for s in response.content.split("\n") if s.strip() and s.strip()[0].isdigit()]
        return steps
    
    def execute_step(self, step: str, context: str = "") -> str:
        response = self.llm.invoke([("system", "Execute this step precisely. Be concrete."), ("human", f"Step: {step}\nContext: {context}")])
        return response.content
    
    def run(self, task: str) -> dict:
        steps = self.plan(task)
        results = []
        context = ""
        for i, step in enumerate(steps):
            print(f"Step {i+1}/{len(steps)}: {step}")
            result = self.execute_step(step, context)
            results.append({"step": step, "result": result})
            context += f"\nStep {i+1} result: {result[:200]}"
        
        # Synthesize
        summary = self.llm.invoke([("system", "Synthesize all steps into a final answer."), ("human", str(results))])
        return {"steps": steps, "results": results, "final": summary.content}

agent = PlanAndExecuteAgent(llm)
result = agent.run("Research LangGraph, build a simple agent, write tests, and deploy")
```

**Reflexion Pattern:**
```python
class ReflexionAgent:
    def __init__(self, llm, max_reflections: int = 3):
        self.llm = llm
        self.max_reflections = max_reflections
    
    def attempt(self, task: str, reflection: str = "") -> str:
        prompt = f"Task: {task}"
        if reflection: prompt += f"\nPrevious reflection: {reflection}"
        response = self.llm.invoke([("system", "Complete the task. Show your work."), ("human", prompt)])
        return response.content
    
    def reflect(self, task: str, attempt: str) -> str:
        response = self.llm.invoke([("system", "Reflect on this attempt. What went wrong? How to improve?"), ("human", f"Task: {task}\nAttempt: {attempt}")])
        return response.content
    
    def evaluate(self, task: str, attempt: str) -> bool:
        response = self.llm.invoke([("system", "Is this answer correct and complete? Answer YES or NO with explanation."), ("human", f"Task: {task}\nAnswer: {attempt}")])
        return "YES" in response.content.upper()
    
    def run(self, task: str) -> dict:
        reflection = ""
        for i in range(self.max_reflections):
            attempt = self.attempt(task, reflection)
            if self.evaluate(task, attempt):
                return {"success": True, "attempt": attempt, "reflections": i, "final_reflection": reflection}
            reflection = self.reflect(task, attempt)
        return {"success": False, "attempt": attempt, "reflections": self.max_reflections, "final_reflection": reflection}
```

### 6.2 Tool Use & Function Calling (Deep Dive)
```python
from openai import OpenAI
import json

client = OpenAI()

tools = [
    {"type": "function", "function": {"name": "get_weather", "description": "Get weather for a city", "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]}}},
    {"type": "function", "function": {"name": "search_docs", "description": "Search documentation", "parameters": {"type": "object", "properties": {"query": {"type": "string"}, "limit": {"type": "integer"}}, "required": ["query"]}}},
    {"type": "function", "function": {"name": "execute_code", "description": "Execute Python code safely", "parameters": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}}}
]

def execute_tool(name: str, args: dict) -> str:
    if name == "get_weather": return f"Weather in {args['city']}: 25°C"
    elif name == "search_docs": return f"Found {args.get('limit', 5)} results for: {args['query']}"
    elif name == "execute_code":
        try: return str(eval(args["code"]))
        except Exception as e: return f"Error: {e}"
    return "Unknown tool"

def run_agent_with_tools(query: str, max_turns: int = 5) -> str:
    messages = [{"role": "user", "content": query}]
    for _ in range(max_turns):
        response = client.chat.completions.create(model="gpt-4o", messages=messages, tools=tools, tool_choice="auto")
        msg = response.choices[0].message
        if msg.tool_calls:
            messages.append(msg)
            for tc in msg.tool_calls:
                result = execute_tool(tc.function.name, json.loads(tc.function.arguments))
                messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})
        else:
            return msg.content
    return "Max turns reached"
```

### 6.3 Planning & Reasoning Loops
```python
from typing import List, Dict
from enum import Enum

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class TaskPlanner:
    def __init__(self, llm):
        self.llm = llm
    
    def decompose(self, goal: str) -> List[Dict]:
        response = self.llm.invoke([("system", """Decompose into tasks with dependencies. JSON format:
[{"id": 1, "description": "...", "depends_on": [], "priority": "high/medium/low"}]"""), ("human", goal)])
        try:
            import json
            return json.loads(response.content)
        except:
            return [{"id": 1, "description": goal, "depends_on": [], "priority": "high"}]
    
    def replan(self, goal: str, completed: List[Dict], failed: List[Dict]) -> List[Dict]:
        context = f"Goal: {goal}\nCompleted: {[t['description'] for t in completed]}\nFailed: {[t['description'] for t in failed]}"
        return self.decompose(context + "\n\nReplan remaining work:")

class ReasoningLoop:
    def __init__(self, llm, max_iterations: int = 5):
        self.llm = llm
        self.max_iterations = max_iterations
    
    def solve(self, problem: str) -> Dict:
        thoughts = []
        for i in range(self.max_iterations):
            prompt = f"Problem: {problem}\n\nPrevious thoughts:\n" + "\n".join(thoughts) + "\n\nNext thought (or 'DONE' if solved):"
            response = self.llm.invoke([("human", prompt)])
            thought = response.content
            thoughts.append(f"Thought {i+1}: {thought}")
            if "DONE" in thought.upper() or i == self.max_iterations - 1:
                summary = self.llm.invoke([("system", "Summarize the solution."), ("human", "\n".join(thoughts))])
                return {"solution": summary.content, "thoughts": thoughts, "iterations": i + 1}
        return {"solution": "", "thoughts": thoughts, "iterations": self.max_iterations}
```

### 6.4 Agent Testing Framework
```python
import pytest
from unittest.mock import Mock, patch, AsyncMock
from dataclasses import dataclass
from typing import List

@dataclass
class TestCase:
    name: str
    input_query: str
    expected_tool_calls: List[str]
    expected_contains: str

class AgentTestSuite:
    def __init__(self, agent):
        self.agent = agent
        self.test_cases: List[TestCase] = []
    
    def add_test(self, name: str, input_query: str, expected_tools: List[str] = None, expected_contains: str = ""):
        self.test_cases.append(TestCase(name, input_query, expected_tools or [], expected_contains))
    
    def run_all(self) -> dict:
        results = []
        for tc in self.test_cases:
            try:
                result = self.agent.run(tc.input_query)
                passed = True
                if tc.expected_contains and tc.expected_contains not in result:
                    passed = False
                results.append({"test": tc.name, "passed": passed, "result": result[:100]})
            except Exception as e:
                results.append({"test": tc.name, "passed": False, "error": str(e)})
        return {"total": len(results), "passed": sum(1 for r in results if r["passed"]), "results": results}

# Usage
# suite = AgentTestSuite(my_agent)
# suite.add_test("weather query", "What's the weather in Singapore?", ["get_weather"], "Singapore")
# suite.add_test("math query", "Calculate 15% of 2000", ["calculate"], "300")
# results = suite.run_all()
```

### 6.5 Production Observability
```python
import time
import json
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class TraceSpan:
    name: str
    start_time: float
    end_time: float = 0
    attributes: Dict = field(default_factory=dict)
    events: List[Dict] = field(default_factory=list)
    status: str = "OK"
    
    def finish(self):
        self.end_time = time.time()
    
    def add_event(self, name: str, attributes: Dict = None):
        self.events.append({"name": name, "timestamp": time.time(), "attributes": attributes or {}})

class AgentTracer:
    def __init__(self):
        self.traces: List[Dict] = []
    
    def start_trace(self, name: str, attributes: Dict = None) -> str:
        trace_id = f"trace_{int(time.time()*1000)}"
        self.traces.append({"id": trace_id, "name": name, "start": time.time(), "spans": [], "attributes": attributes or {}, "status": "OK"})
        return trace_id
    
    def add_span(self, trace_id: str, span_name: str) -> TraceSpan:
        span = TraceSpan(name=span_name, start_time=time.time())
        for trace in self.traces:
            if trace["id"] == trace_id:
                trace["spans"].append(span)
                break
        return span
    
    def end_trace(self, trace_id: str, status: str = "OK"):
        for trace in self.traces:
            if trace["id"] == trace_id:
                trace["end"] = time.time()
                trace["status"] = status
                trace["duration_ms"] = (trace["end"] - trace["start"]) * 1000
                break
    
    def get_trace(self, trace_id: str) -> Optional[Dict]:
        for trace in self.traces:
            if trace["id"] == trace_id:
                return trace
        return None
    
    def export_json(self) -> str:
        serializable = []
        for trace in self.traces:
            t = {**trace}
            t["spans"] = [{"name": s.name, "start": s.start_time, "end": s.end_time, "status": s.status} for s in trace["spans"]]
            serializable.append(t)
        return json.dumps(serializable, indent=2)

# Usage with decorator
tracer = AgentTracer()

def traced(name: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            trace_id = tracer.start_trace(name)
            span = tracer.add_span(trace_id, f"{name}_execute")
            try:
                result = func(*args, **kwargs)
                span.add_event("completed")
                tracer.end_trace(trace_id, "OK")
                return result
            except Exception as e:
                span.add_event("error", {"message": str(e)})
                tracer.end_trace(trace_id, "ERROR")
                raise
        return wrapper
    return decorator
```

---

## SPECIALIZED COURSE: AI Evaluation Systems

### S1.1 Building Eval Harnesses
```python
from dataclasses import dataclass, field
from typing import List, Callable, Dict, Any
import json
import time

@dataclass
class EvalCase:
    input: str
    expected: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class EvalResult:
    case: EvalCase
    output: str
    scores: Dict[str, float]
    latency: float
    passed: bool

class EvalHarness:
    def __init__(self, predict_fn: Callable, scorers: Dict[str, Callable] = None):
        self.predict_fn = predict_fn
        self.scorers = scorers or {"contains_expected": lambda out, exp: 1.0 if exp.lower() in out.lower() else 0.0}
        self.results: List[EvalResult] = []
    
    def run(self, cases: List[EvalCase], threshold: float = 0.5) -> Dict:
        self.results = []
        for case in cases:
            start = time.time()
            output = self.predict_fn(case.input)
            latency = time.time() - start
            
            scores = {}
            for name, scorer in self.scorers.items():
                scores[name] = scorer(output, case.expected)
            
            avg_score = sum(scores.values()) / len(scores) if scores else 0
            self.results.append(EvalResult(case, output, scores, latency, avg_score >= threshold))
        
        passed = sum(1 for r in self.results if r.passed)
        return {
            "total": len(self.results),
            "passed": passed,
            "failed": len(self.results) - passed,
            "pass_rate": passed / len(self.results) if self.results else 0,
            "avg_latency": sum(r.latency for r in self.results) / len(self.results) if self.results else 0,
            "results": self.results
        }
    
    def report(self) -> str:
        summary = self.run(self.results.__class__())  # This would use stored cases
        return json.dumps({"pass_rate": summary.get("pass_rate", 0), "details": [{"input": r.case.input[:50], "passed": r.passed, "scores": r.scores} for r in self.results]}, indent=2)
```

### S1.2 LLM-as-Judge Pipeline
```python
class LLMJudge:
    def __init__(self, llm):
        self.llm = llm
        self.rubrics = {
            "correctness": "Rate the factual correctness (1-5):",
            "completeness": "Rate how complete the answer is (1-5):",
            "clarity": "Rate the clarity of explanation (1-5):",
            "safety": "Does the response contain harmful content? (1=safe, 5=harmful):"
        }
    
    def judge(self, question: str, answer: str, rubric: str = "correctness") -> Dict:
        prompt = f"""Rate this answer on {rubric} (1-5 scale).

Question: {question}
Answer: {answer}

Provide:
Score: [1-5]
Reasoning: [explanation]"""
        
        response = self.llm.invoke([("human", prompt)])
        content = response.content
        
        score = 3  # default
        for line in content.split("\n"):
            if "Score:" in line:
                try: score = int(line.split(":")[-1].strip())
                except: pass
        
        return {"rubric": rubric, "score": score, "reasoning": content, "max_score": 5}
    
    def judge_pair(self, question: str, answer_a: str, answer_b: str) -> Dict:
        prompt = f"""Compare these two answers to the question.

Question: {question}
Answer A: {answer_a}
Answer B: {answer_b}

Which is better? Respond with:
Winner: [A/B/Tie]
Reasoning: [explanation]"""
        
        response = self.llm.invoke([("human", prompt)])
        content = response.content
        winner = "Tie"
        for line in content.split("\n"):
            if "Winner:" in line:
                winner = line.split(":")[-1].strip()
        return {"winner": winner, "reasoning": content}
    
    def batch_judge(self, cases: List[Dict]) -> List[Dict]:
        results = []
        for case in cases:
            scores = {}
            for rubric in self.rubrics:
                scores[rubric] = self.judge(case["question"], case["answer"], rubric)
            results.append({"case": case, "scores": scores, "avg_score": sum(s["score"] for s in scores.values()) / len(scores)})
        return results
```

### S1.3 Regression Testing for Prompts
```python
import hashlib
import json
from typing import List, Dict
from datetime import datetime

class PromptRegressionTester:
    def __init__(self):
        self.baselines: Dict[str, Dict] = {}
        self.results_history: List[Dict] = []
    
    def create_baseline(self, prompt_id: str, test_cases: List[Dict], llm_func):
        baseline_results = []
        for case in test_cases:
            output = llm_func(case["prompt"])
            baseline_results.append({"input": case["prompt"], "output": output, "hash": hashlib.md5(output.encode()).hexdigest()})
        
        self.baselines[prompt_id] = {
            "results": baseline_results,
            "created_at": datetime.now().isoformat(),
            "test_count": len(test_cases)
        }
    
    def run_regression(self, prompt_id: str, test_cases: List[Dict], llm_func, similarity_threshold: float = 0.8) -> Dict:
        baseline = self.baselines.get(prompt_id, {})
        baseline_outputs = {r["input"]: r["output"] for r in baseline.get("results", [])}
        
        regressions = []
        improvements = []
        unchanged = 0
        
        for case in test_cases:
            new_output = llm_func(case["prompt"])
            old_output = baseline_outputs.get(case["prompt"], "")
            
            if old_output:
                similarity = self._similarity(new_output, old_output)
                if similarity < similarity_threshold:
                    regressions.append({"input": case["prompt"], "old": old_output[:100], "new": new_output[:100], "similarity": similarity})
                elif similarity > 0.95:
                    unchanged += 1
                else:
                    improvements.append({"input": case["prompt"], "similarity": similarity})
        
        return {
            "prompt_id": prompt_id,
            "total": len(test_cases),
            "regressions": len(regressions),
            "improvements": len(improvements),
            "unchanged": unchanged,
            "regression_details": regressions,
            "passed": len(regressions) == 0
        }
    
    def _similarity(self, a: str, b: str) -> float:
        words_a = set(a.lower().split())
        words_b = set(b.lower().split())
        if not words_a or not words_b: return 0.0
        return len(words_a & words_b) / len(words_a | words_b)
```

### S1.4 Online Evaluation with User Feedback
```python
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class UserFeedback:
    query: str
    response: str
    rating: int  # 1-5
    comment: str = ""
    timestamp: str = ""
    session_id: str = ""
    
    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()

class OnlineEvaluator:
    def __init__(self):
        self.feedback: List[UserFeedback] = []
    
    def record_feedback(self, query: str, response: str, rating: int, comment: str = "", session_id: str = ""):
        self.feedback.append(UserFeedback(query, response, rating, comment, session_id=session_id))
    
    def get_metrics(self, last_n: int = 100) -> Dict:
        recent = self.feedback[-last_n:] if last_n else self.feedback
        if not recent: return {"count": 0, "avg_rating": 0}
        
        ratings = [f.rating for f in recent]
        return {
            "count": len(recent),
            "avg_rating": sum(ratings) / len(ratings),
            "rating_distribution": {i: ratings.count(i) for i in range(1, 6)},
            "negative_feedback": [f for f in recent if f.rating <= 2],
        }
    
    def detect_drift(self, window_size: int = 50) -> Dict:
        if len(self.feedback) < window_size * 2: return {"drift_detected": False}
        
        old_ratings = [f.rating for f in self.feedback[:-window_size]][-window_size:]
        new_ratings = [f.rating for f in self.feedback[-window_size:]]
        
        old_avg = sum(old_ratings) / len(old_ratings)
        new_avg = sum(new_ratings) / len(new_ratings)
        
        return {
            "drift_detected": abs(new_avg - old_avg) > 0.5,
            "old_avg": old_avg,
            "new_avg": new_avg,
            "delta": new_avg - old_avg
        }
```

---

## SPECIALIZED COURSE: System Design for AI Engineers

### S2.1 Caching for LLM Applications
```python
import hashlib
import json
import time
from typing import Optional, Dict

class SemanticCache:
    def __init__(self, ttl: int = 3600, similarity_threshold: float = 0.95):
        self.cache: Dict[str, Dict] = {}
        self.ttl = ttl
        self.threshold = similarity_threshold
    
    def _key(self, query: str, model: str) -> str:
        return hashlib.md5(f"{model}:{query}".encode()).hexdigest()
    
    def get(self, query: str, model: str = "gpt-4o") -> Optional[str]:
        key = self._key(query, model)
        entry = self.cache.get(key)
        if entry and (time.time() - entry["timestamp"]) < self.ttl:
            return entry["response"]
        elif entry:
            del self.cache[key]
        return None
    
    def set(self, query: str, response: str, model: str = "gpt-4o"):
        self.cache[self._key(query, model)] = {"response": response, "timestamp": time.time()}
    
    def stats(self) -> Dict:
        return {"size": len(self.cache), "ttl": self.ttl}

class LRUCache:
    def __init__(self, capacity: int = 1000):
        from collections import OrderedDict
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key: str) -> Optional[str]:
        if key in self.cache:
            self.cache.move_to_end(key)
            return self.cache[key]
        return None
    
    def put(self, key: str, value: str):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

### S2.2 Message Queue Patterns
```python
import asyncio
from typing import Callable, Dict, List
from collections import deque
import json

class SimpleMessageQueue:
    def __init__(self):
        self.queues: Dict[str, deque] = {}
        self.consumers: Dict[str, List[Callable]] = {}
    
    def create_queue(self, name: str):
        self.queues[name] = deque()
        self.consumers[name] = []
    
    def publish(self, queue: str, message: dict):
        self.queues[queue].append(message)
    
    def subscribe(self, queue: str, callback: Callable):
        self.consumers[queue].append(callback)
    
    async def process(self, queue: str):
        while self.queues[queue]:
            message = self.queues[queue].popleft()
            for consumer in self.consumers[queue]:
                if asyncio.iscoroutinefunction(consumer):
                    await consumer(message)
                else:
                    consumer(message)

class TaskQueue:
    def __init__(self, max_workers: int = 3):
        self.queue = deque()
        self.max_workers = max_workers
        self.workers = []
    
    def enqueue(self, task: Callable, *args, **kwargs):
        self.queue.append((task, args, kwargs))
    
    async def process_all(self):
        sem = asyncio.Semaphore(self.max_workers)
        
        async def worker(task, args, kwargs):
            async with sem:
                if asyncio.iscoroutinefunction(task):
                    await task(*args, **kwargs)
                else:
                    task(*args, **kwargs)
        
        tasks = [worker(t, a, k) for t, a, k in self.queue]
        await asyncio.gather(*tasks)
        self.queue.clear()
```

### S2.3 Rate Limiting & Circuit Breaker
```python
import time
from collections import defaultdict
from enum import Enum

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class RateLimiter:
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
    
    def allow(self, key: str = "default") -> bool:
        now = time.time()
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window]
        if len(self.requests[key]) < self.max_requests:
            self.requests[key].append(now)
            return True
        return False

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = CircuitState.CLOSED
        self.failures = 0
        self.last_failure_time = 0
    
    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.CLOSED
                self.failures = 0
            return result
        except Exception as e:
            self.failures += 1
            self.last_failure_time = time.time()
            if self.failures >= self.failure_threshold:
                self.state = CircuitState.OPEN
            raise
```

---

## SPECIALIZED COURSE: AI for Engineering Leaders

### S3.1 Build vs Buy Decision Framework
```python
from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class BuildVsBuyCriteria:
    name: str
    build_score: float  # 1-10
    buy_score: float  # 1-10
    weight: float = 1.0

class BuildVsBuyAnalyzer:
    def __init__(self):
        self.criteria: List[BuildVsBuyCriteria] = []
    
    def add_criteria(self, name: str, build: float, buy: float, weight: float = 1.0):
        self.criteria.append(BuildVsBuyCriteria(name, build, buy, weight))
    
    def analyze(self) -> Dict:
        build_total = sum(c.build_score * c.weight for c in self.criteria)
        buy_total = sum(c.buy_score * c.weight for c in self.criteria)
        total_weight = sum(c.weight for c in self.criteria)
        
        build_pct = (build_total / (total_weight * 10)) * 100
        buy_pct = (buy_total / (total_weight * 10)) * 100
        
        return {
            "recommendation": "BUILD" if build_pct > buy_pct else "BUY",
            "build_score": round(build_pct, 1),
            "buy_score": round(buy_pct, 1),
            "details": [{"name": c.name, "build": c.build_score, "buy": c.buy_score, "weight": c.weight} for c in self.criteria]
        }

# Usage
analyzer = BuildVsBuyAnalyzer()
analyzer.add_criteria("Core competency alignment", build=8, buy=4, weight=2.0)
analyzer.add_criteria("Time to market", build=4, buy=9, weight=1.5)
analyzer.add_criteria("Cost (3-year TCO)", build=7, buy=6, weight=1.5)
analyzer.add_criteria("Customization needs", build=9, buy=3, weight=2.0)
analyzer.add_criteria("Team expertise", build=6, buy=7, weight=1.0)
analyzer.add_criteria("Vendor lock-in risk", build=8, buy=3, weight=1.5)
result = analyzer.analyze()
print(f"Recommendation: {result['recommendation']} (Build: {result['build_score']}%, Buy: {result['buy_score']}%)")
```

### S3.2 AI Project ROI Calculator
```python
@dataclass
class AIProject:
    name: str
    development_cost: float
    annual_operating_cost: float
    annual_revenue_impact: float  # revenue increase or cost savings
    time_to_value_months: int
    risk_factor: float  # 0-1

class ROICalculator:
    def calculate(self, project: AIProject, years: int = 3) -> Dict:
        total_cost = project.development_cost + (project.annual_operating_cost * years)
        total_benefit = project.annual_revenue_impact * years
        risk_adjusted_benefit = total_benefit * project.risk_factor
        
        roi = ((risk_adjusted_benefit - total_cost) / total_cost) * 100 if total_cost > 0 else 0
        npv = risk_adjusted_benefit - total_cost
        payback_months = project.development_cost / (project.annual_revenue_impact / 12) if project.annual_revenue_impact > 0 else float('inf')
        
        return {
            "project": project.name,
            "total_cost": total_cost,
            "total_benefit": total_benefit,
            "risk_adjusted_benefit": risk_adjusted_benefit,
            "roi_pct": round(roi, 1),
            "npv": round(npv, 2),
            "payback_months": round(payback_months, 1),
            "years_analyzed": years
        }
```

### S3.3 AI Team Structure & Hiring
```python
AI_TEAM_PLAYBOOK = {
    "startup_1_3": {
        "roles": ["Full-Stack AI Engineer (Lead)", "ML Engineer", "Data Engineer"],
        "focus": "MVP, fast iteration, prove value",
        "stack": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"]
    },
    "growth_5_10": {
        "roles": ["AI Tech Lead", "ML Engineers (2-3)", "Data Engineers (2)", "MLOps Engineer", "AI Product Manager"],
        "focus": "Scale, reliability, production systems",
        "stack": ["Kubernetes", "Kafka", "MLflow", "Airflow", "Terraform"]
    },
    "enterprise_20_plus": {
        "roles": ["VP of AI", "AI Architects", "ML Platform Team", "AI Research Team", "MLOps/SRE Team", "AI Governance", "Data Engineering"],
        "focus": "Platform, governance, innovation",
        "stack": ["Kubeflow", "SageMaker", "Feature Store", "Model Registry", "AI Gateway"]
    }
}
```

---

## SPECIALIZED COURSE: AI Agents Deep Dive

### S4.1 Multi-Agent Orchestration
```python
from dataclasses import dataclass, field
from typing import List, Dict, Callable, Optional
from enum import Enum
import asyncio
import uuid

class AgentRole(Enum):
    COORDINATOR = "coordinator"
    RESEARCHER = "researcher"
    CODER = "coder"
    REVIEWER = "reviewer"
    PLANNER = "planner"

@dataclass
class AgentMessage:
    sender: str
    receiver: str
    content: str
    msg_type: str = "request"  # request, response, broadcast
    metadata: Dict = field(default_factory=dict)

class Agent:
    def __init__(self, agent_id: str, role: AgentRole, capabilities: List[str], llm=None):
        self.agent_id = agent_id
        self.role = role
        self.capabilities = capabilities
        self.llm = llm
        self.inbox: List[AgentMessage] = []
        self.outbox: List[AgentMessage] = []
    
    def send(self, receiver: str, content: str, msg_type: str = "request") -> AgentMessage:
        msg = AgentMessage(sender=self.agent_id, receiver=receiver, content=content, msg_type=msg_type)
        self.outbox.append(msg)
        return msg
    
    def receive(self, message: AgentMessage):
        self.inbox.append(message)
    
    def process_messages(self) -> List[AgentMessage]:
        responses = []
        while self.inbox:
            msg = self.inbox.pop(0)
            response_content = self._handle(msg)
            if response_content:
                response = self.send(msg.sender, response_content, "response")
                responses.append(response)
        return responses
    
    def _handle(self, message: AgentMessage) -> Optional[str]:
        return f"[{self.agent_id}] Processed: {message.content[:100]}"

class MultiAgentOrchestrator:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.message_log: List[AgentMessage] = []
    
    def register_agent(self, agent: Agent):
        self.agents[agent.agent_id] = agent
    
    def route_message(self, message: AgentMessage):
        self.message_log.append(message)
        if message.receiver in self.agents:
            self.agents[message.receiver].receive(message)
    
    def broadcast(self, sender: str, content: str):
        for agent_id, agent in self.agents.items():
            if agent_id != sender:
                msg = AgentMessage(sender=sender, receiver=agent_id, content=content, msg_type="broadcast")
                self.route_message(msg)
    
    def run_round(self):
        all_responses = []
        for agent in self.agents.values():
            responses = agent.process_messages()
            all_responses.extend(responses)
        for response in all_responses:
            self.route_message(response)
        return all_responses

# Usage
orchestrator = MultiAgentOrchestrator()
orchestrator.register_agent(Agent("planner", AgentRole.PLANNER, ["planning"]))
orchestrator.register_agent(Agent("researcher", AgentRole.RESEARCHER, ["search", "analysis"]))
orchestrator.register_agent(Agent("coder", AgentRole.CODER, ["python", "javascript"]))

orchestrator.agents["planner"].send("researcher", "Research latest LangGraph features")
orchestrator.run_round()
```

### S4.2 Agent Memory Systems
```python
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime
import json

@dataclass
class MemoryEntry:
    content: str
    memory_type: str  # episodic, semantic, procedural
    importance: float  # 0-1
    timestamp: str = ""
    access_count: int = 0
    tags: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()

class AgentMemory:
    def __init__(self, max_capacity: int = 1000):
        self.episodic: List[MemoryEntry] = []  # past experiences
        self.semantic: List[MemoryEntry] = []  # facts and knowledge
        self.procedural: List[MemoryEntry] = []  # how-to knowledge
        self.max_capacity = max_capacity
    
    def store(self, content: str, memory_type: str, importance: float = 0.5, tags: List[str] = None):
        entry = MemoryEntry(content=content, memory_type=memory_type, importance=importance, tags=tags or [])
        if memory_type == "episodic":
            self.episodic.append(entry)
        elif memory_type == "semantic":
            self.semantic.append(entry)
        elif memory_type == "procedural":
            self.procedural.append(entry)
        self._consolidate()
    
    def recall(self, query: str, memory_type: str = None, top_k: int = 5) -> List[MemoryEntry]:
        candidates = []
        if memory_type == "episodic" or memory_type is None:
            candidates.extend(self.episodic)
        if memory_type == "semantic" or memory_type is None:
            candidates.extend(self.semantic)
        if memory_type == "procedural" or memory_type is None:
            candidates.extend(self.procedural)
        
        query_words = set(query.lower().split())
        scored = []
        for entry in candidates:
            entry_words = set(entry.content.lower().split())
            relevance = len(query_words & entry_words) / max(len(query_words), 1)
            score = relevance * 0.6 + entry.importance * 0.3 + (1 / (1 + entry.access_count)) * 0.1
            scored.append((score, entry))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [entry for _, entry in scored[:top_k]]
        for entry in results:
            entry.access_count += 1
        return results
    
    def forget(self, threshold: float = 0.1):
        for store in [self.episodic, self.semantic, self.procedural]:
            store[:] = [e for e in store if e.importance >= threshold or e.access_count > 2]
    
    def _consolidate(self):
        total = len(self.episodic) + len(self.semantic) + len(self.procedural)
        if total > self.max_capacity:
            self.forget(threshold=0.2)
            all_entries = self.episodic + self.semantic + self.procedural
            all_entries.sort(key=lambda e: e.importance * (1 + e.access_count))
            remove_count = len(all_entries) - self.max_capacity
            for _ in range(remove_count):
                entry = all_entries.pop(0)
                for store in [self.episodic, self.semantic, self.procedural]:
                    if entry in store:
                        store.remove(entry)
                        break
    
    def stats(self) -> Dict:
        return {
            "episodic_count": len(self.episodic),
            "semantic_count": len(self.semantic),
            "procedural_count": len(self.procedural),
            "total": len(self.episodic) + len(self.semantic) + len(self.procedural)
        }
```

### S4.3 Tool Integration & MCP
```python
from dataclasses import dataclass, field
from typing import List, Dict, Callable, Any, Optional
import json
import inspect

@dataclass
class ToolDefinition:
    name: str
    description: str
    parameters: Dict[str, Dict]
    handler: Callable
    tags: List[str] = field(default_factory=list)

class MCPToolRegistry:
    def __init__(self):
        self.tools: Dict[str, ToolDefinition] = {}
    
    def register(self, name: str, description: str, parameters: Dict[str, Dict], handler: Callable, tags: List[str] = None):
        self.tools[name] = ToolDefinition(name=name, description=description, parameters=parameters, handler=handler, tags=tags or [])
    
    def register_from_function(self, func: Callable, name: str = None, description: str = None):
        sig = inspect.signature(func)
        parameters = {}
        for param_name, param in sig.parameters.items():
            parameters[param_name] = {
                "type": param.annotation.__name__ if param.annotation != inspect.Parameter.empty else "string",
                "required": param.default == inspect.Parameter.empty
            }
        self.register(
            name=name or func.__name__,
            description=description or func.__doc__ or "",
            parameters=parameters,
            handler=func
        )
    
    def to_openai_tools(self) -> List[Dict]:
        tools = []
        for tool in self.tools.values():
            tools.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": {
                        "type": "object",
                        "properties": tool.parameters,
                        "required": [k for k, v in tool.parameters.items() if v.get("required", False)]
                    }
                }
            })
        return tools
    
    def execute(self, name: str, arguments: Dict[str, Any]) -> Any:
        if name not in self.tools:
            raise ValueError(f"Tool '{name}' not found")
        return self.tools[name].handler(**arguments)
    
    def search(self, query: str) -> List[ToolDefinition]:
        query_lower = query.lower()
        results = []
        for tool in self.tools.values():
            if query_lower in tool.name.lower() or query_lower in tool.description.lower():
                results.append(tool)
        return results

# Usage
registry = MCPToolRegistry()
registry.register_from_function(lambda city: f"Weather in {city}: 25°C", "get_weather", "Get weather for a city")
registry.register_from_function(lambda query: f"Results for {query}", "search", "Search the web")
print(json.dumps(registry.to_openai_tools(), indent=2))
```

### S4.4 Agent-to-Agent Communication Protocol
```python
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
from enum import Enum
import uuid
import time

class MessageType(Enum):
    REQUEST = "request"
    RESPONSE = "response"
    DELEGATE = "delegate"
    BROADCAST = "broadcast"
    HEARTBEAT = "heartbeat"

@dataclass
class A2AMessage:
    message_id: str
    sender: str
    receiver: str
    message_type: MessageType
    content: Any
    protocol_version: str = "1.0"
    timestamp: float = field(default_factory=time.time)
    reply_to: Optional[str] = None
    metadata: Dict = field(default_factory=dict)

class AgentCard:
    def __init__(self, agent_id: str, name: str, capabilities: List[str], description: str = ""):
        self.agent_id = agent_id
        self.name = name
        self.capabilities = capabilities
        self.description = description
        self.status = "available"
        self.last_heartbeat = time.time()
    
    def to_dict(self) -> Dict:
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "capabilities": self.capabilities,
            "description": self.description,
            "status": self.status
        }

class A2AProtocol:
    def __init__(self):
        self.agents: Dict[str, AgentCard] = {}
        self.message_queue: List[A2AMessage] = []
        self.message_history: List[A2AMessage] = []
    
    def register_agent(self, card: AgentCard):
        self.agents[card.agent_id] = card
    
    def discover_agents(self, capability: str = None) -> List[AgentCard]:
        if capability:
            return [a for a in self.agents.values() if capability in a.capabilities and a.status == "available"]
        return [a for a in self.agents.values() if a.status == "available"]
    
    def send_message(self, sender: str, receiver: str, content: Any, msg_type: MessageType = MessageType.REQUEST) -> A2AMessage:
        msg = A2AMessage(
            message_id=str(uuid.uuid4()),
            sender=sender,
            receiver=receiver,
            message_type=msg_type,
            content=content
        )
        self.message_queue.append(msg)
        self.message_history.append(msg)
        return msg
    
    def process_queue(self) -> List[A2AMessage]:
        processed = []
        remaining = []
        while self.message_queue:
            msg = self.message_queue.pop(0)
            if msg.receiver in self.agents:
                processed.append(msg)
            else:
                remaining.append(msg)
        self.message_queue = remaining
        return processed
    
    def get_conversation_history(self, agent1: str, agent2: str) -> List[A2AMessage]:
        return [m for m in self.message_history if {m.sender, m.receiver} == {agent1, agent2}]
```

### S4.5 Agent Evaluation & Benchmarking
```python
from dataclasses import dataclass, field
from typing import List, Dict, Callable, Any
import time

@dataclass
class BenchmarkTask:
    task_id: str
    description: str
    input_data: Any
    expected_output: Any = None
    eval_fn: Callable = None
    max_time_seconds: float = 30.0
    tags: List[str] = field(default_factory=list)

@dataclass
class BenchmarkResult:
    task_id: str
    agent_id: str
    output: Any
    score: float
    latency: float
    tokens_used: int = 0
    passed: bool = False
    error: str = ""

class AgentBenchmark:
    def __init__(self):
        self.tasks: List[BenchmarkTask] = []
        self.results: List[BenchmarkResult] = []
    
    def add_task(self, task: BenchmarkTask):
        self.tasks.append(task)
    
    def evaluate_agent(self, agent_id: str, agent_fn: Callable) -> Dict:
        agent_results = []
        for task in self.tasks:
            start = time.time()
            try:
                output = agent_fn(task.input_data)
                latency = time.time() - start
                
                if task.eval_fn:
                    score = task.eval_fn(output, task.expected_output)
                elif task.expected_output:
                    score = 1.0 if output == task.expected_output else 0.0
                else:
                    score = 1.0 if output else 0.0
                
                result = BenchmarkResult(
                    task_id=task.task_id, agent_id=agent_id, output=output,
                    score=score, latency=latency, passed=score >= 0.7
                )
            except Exception as e:
                result = BenchmarkResult(
                    task_id=task.task_id, agent_id=agent_id, output=None,
                    score=0, latency=time.time() - start, error=str(e)
                )
            agent_results.append(result)
            self.results.append(result)
        
        scores = [r.score for r in agent_results]
        latencies = [r.latency for r in agent_results]
        return {
            "agent_id": agent_id,
            "total_tasks": len(agent_results),
            "passed": sum(1 for r in agent_results if r.passed),
            "avg_score": sum(scores) / len(scores) if scores else 0,
            "avg_latency": sum(latencies) / len(latencies) if latencies else 0,
            "pass_rate": sum(1 for r in agent_results if r.passed) / len(agent_results) if agent_results else 0
        }
    
    def compare_agents(self, agent_results: List[Dict]) -> str:
        sorted_results = sorted(agent_results, key=lambda x: x["avg_score"], reverse=True)
        lines = ["=== Agent Benchmark Comparison ==="]
        for i, r in enumerate(sorted_results, 1):
            lines.append(f"#{i} {r['agent_id']}: score={r['avg_score']:.2f}, pass_rate={r['pass_rate']:.0%}, avg_latency={r['avg_latency']:.2f}s")
        return "\n".join(lines)
```

---

## SPECIALIZED COURSE: AI Safety & Security

### S5.1 Prompt Injection Defense
```python
import re
from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class InjectionCheckResult:
    safe: bool
    threats: List[str]
    severity: str  # low, medium, high, critical
    action: str  # allow, modify, block

class PromptInjectionDefense:
    def __init__(self):
        self.injection_patterns = [
            (r"ignore\s+(previous|all|above)\s+instructions", "instruction_override", "critical"),
            (r"you\s+are\s+now\s+\w+", "role_hijack", "high"),
            (r"(act|pretend)\s+as\s+(DAN|GPT|a\s+different)", "role_play_attack", "high"),
            (r"(reveal|show|display)\s+(your|the)\s+(system\s+)?prompt", "prompt_extraction", "high"),
            (r"(jailbreak|bypass|override|circumvent)", "safety_bypass", "critical"),
            (r"(base64|hex|rot13|encode)\s*(this|the|input)", "encoded_injection", "high"),
            (r"<\|im_start\|>|<\|im_end\|>", "token_injection", "critical"),
            (r"###\s*(system|instruction|hidden)", "markdown_injection", "medium"),
        ]
        self.sanitization_patterns = [
            (r"<\|.*?\|>", ""),  # Special tokens
            (r"\[INST\].*?\[/INST\]", ""),  # Llama format
            (r"###\s*(System|Assistant):", "### Output:"),  # Role prefix
        ]
    
    def check(self, text: str) -> InjectionCheckResult:
        threats = []
        max_severity = "low"
        severity_order = {"low": 0, "medium": 1, "high": 2, "critical": 3}
        
        for pattern, threat_type, severity in self.injection_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                threats.append(threat_type)
                if severity_order.get(severity, 0) > severity_order.get(max_severity, 0):
                    max_severity = severity
        
        action = "allow"
        if max_severity == "critical": action = "block"
        elif max_severity == "high": action = "modify"
        elif max_severity == "medium": action = "modify"
        
        return InjectionCheckResult(safe=len(threats) == 0, threats=threats, severity=max_severity, action=action)
    
    def sanitize(self, text: str) -> str:
        cleaned = text
        for pattern, replacement in self.sanitization_patterns:
            cleaned = re.sub(pattern, replacement, cleaned)
        return cleaned
    
    def validate_and_process(self, text: str) -> Tuple[str, InjectionCheckResult]:
        check = self.check(text)
        if check.action == "block":
            return "[BLOCKED] Input flagged for policy violation.", check
        elif check.action == "modify":
            return self.sanitize(text), check
        return text, check
```

### S5.2 Jailbreak Detection
```python
class JailbreakDetector:
    def __init__(self):
        self.jailbreak_signatures = [
            "DAN", "Do Anything Now", "jailbreak", "unrestricted",
            "no rules", "no restrictions", "ignore all filters",
            "act as if you have no", "bypass content policy",
            "developer mode", "enable debugging",
            "pretend you're", "imagine you are",
            "in a hypothetical world", "for educational purposes only",
            "what would you say if", "hypothetically speaking",
        ]
    
    def detect(self, text: str) -> Dict:
        detected = []
        text_lower = text.lower()
        
        for sig in self.jailbreak_signatures:
            if sig.lower() in text_lower:
                detected.append(sig)
        
        score = min(len(detected) / 3.0, 1.0)
        
        return {
            "is_jailbreak": len(detected) >= 2,
            "confidence": score,
            "signatures_detected": detected,
            "recommendation": "block" if score > 0.6 else "flag" if score > 0.3 else "allow"
        }
```

### S5.3 PII Detection & Masking
```python
import re
from typing import Dict, List, Tuple

class PIIDetector:
    def __init__(self):
        self.patterns = {
            "email": (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', "[REDACTED_EMAIL]"),
            "phone_sg": (r'\+65\s?\d{4}\s?\d{4}', "[REDACTED_PHONE]"),
            "phone_us": (r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', "[REDACTED_PHONE]"),
            "nric_sg": (r'\b[STFG]\d{7}[A-Z]\b', "[REDACTED_NRIC]"),
            "fin_sg": (r'\b[STFG]\d{7}[A-Z]\b', "[REDACTED_FIN]"),
            "credit_card": (r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', "[REDACTED_CC]"),
            "ip_address": (r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', "[REDACTED_IP]"),
            "api_key": (r'\b(sk-|pk-|ak-)[A-Za-z0-9]{20,}\b', "[REDACTED_API_KEY]"),
            "password_field": (r'(password|passwd|pwd)\s*[:=]\s*\S+', "[REDACTED_PASSWORD]"),
            "ssn_us": (r'\b\d{3}-\d{2}-\d{4}\b', "[REDACTED_SSN]"),
            "bank_account": (r'\b\d{8,12}\b', "[REDACTED_BANK]"),
        }
    
    def detect(self, text: str) -> List[Dict]:
        findings = []
        for pii_type, (pattern, _) in self.patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                findings.append({"type": pii_type, "value": match.group(), "start": match.start(), "end": match.end()})
        return findings
    
    def mask(self, text: str) -> Tuple[str, List[Dict]]:
        findings = self.detect(text)
        masked = text
        for finding in sorted(findings, key=lambda x: x["start"], reverse=True):
            replacement = self.patterns[finding["type"]][1]
            masked = masked[:finding["start"]] + replacement + masked[finding["end"]:]
        return masked, findings
    
    def scan_and_report(self, text: str) -> Dict:
        findings = self.detect(text)
        masked, _ = self.mask(text)
        return {
            "original_length": len(text),
            "masked_text": masked,
            "pii_found": len(findings),
            "pii_types": list(set(f["type"] for f in findings)),
            "findings": findings
        }
```

### S5.4 Output Guardrails & Content Filtering
```python
import re
from dataclasses import dataclass, field
from typing import List, Dict, Callable, Optional
from enum import Enum

class ContentCategory(Enum):
    HATE_SPEECH = "hate_speech"
    VIOLENCE = "violence"
    SEXUAL_CONTENT = "sexual_content"
    PII_EXPOSURE = "pii_exposure"
    MEDICAL_ADVICE = "medical_advice"
    LEGAL_ADVICE = "legal_advice"
    FINANCIAL_ADVICE = "financial_advice"
    DANGEROUS_CONTENT = "dangerous_content"

@dataclass
class ContentFilterResult:
    safe: bool
    flagged_categories: List[str]
    confidence_scores: Dict[str, float]
    action: str  # allow, warn, block
    modified_text: Optional[str] = None

class OutputGuardrails:
    def __init__(self):
        self.dangerous_patterns = {
            ContentCategory.VIOLENCE.value: [
                r'\b(kill|murder|assassinate|harm)\b.*\b(someone|person|people)\b',
                r'\b(build|make|create)\b.*\b(bomb|weapon|explosive)\b',
            ],
            ContentCategory.HATE_SPEECH.value: [
                r'\b(all|every)\b.*\b(are|should)\b.*\b(inferior|superior|eliminate)\b',
            ],
            ContentCategory.MEDICAL_ADVICE.value: [
                r'\b(you should take| dosage is|prescribe)\b.*\b(medication|drug|pill)\b',
            ],
            ContentCategory.DANGEROUS_CONTENT.value: [
                r'\b(how to|steps to)\b.*\b(hack|exploit|bypass security)\b',
                r'\b(illegal|unlawful)\b.*\b(method|way|technique)\b',
            ],
        }
        self.pii_detector = PIIDetector()
    
    def check_output(self, text: str) -> ContentFilterResult:
        flagged = []
        scores = {}
        
        for category, patterns in self.dangerous_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    if category not in flagged:
                        flagged.append(category)
                    scores[category] = max(scores.get(category, 0), 0.8)
        
        pii_findings = self.pii_detector.detect(text)
        if pii_findings:
            flagged.append(ContentCategory.PII_EXPOSURE.value)
            scores[ContentCategory.PII_EXPOSURE.value] = 1.0
        
        action = "allow"
        if any(c in [ContentCategory.VIOLENCE.value, ContentCategory.HATE_SPEECH.value, ContentCategory.DANGEROUS_CONTENT.value] for c in flagged):
            action = "block"
        elif flagged:
            action = "warn"
        
        modified = text
        if action == "warn" and ContentCategory.PII_EXPOSURE.value in flagged:
            modified, _ = self.pii_detector.mask(text)
        
        return ContentFilterResult(
            safe=len(flagged) == 0,
            flagged_categories=flagged,
            confidence_scores=scores,
            action=action,
            modified_text=modified if modified != text else None
        )
    
    def filter_response(self, text: str) -> str:
        result = self.check_output(text)
        if result.action == "block":
            return "I'm sorry, but I cannot provide that response as it may contain harmful or inappropriate content."
        elif result.action == "warn" and result.modified_text:
            return result.modified_text
        return text
```

### S5.5 Complete Guardrails System
```python
from dataclasses import dataclass, field
from typing import List, Dict, Callable, Optional, Tuple
from enum import Enum

class Severity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class GuardrailResult:
    passed: bool
    rule: str
    severity: Severity
    message: str
    action: str  # allow, modify, block

class GuardrailSystem:
    def __init__(self):
        self.input_rules: List[Callable] = []
        self.output_rules: List[Callable] = []
        self.pii_detector = PIIDetector()
        self.injection_defense = PromptInjectionDefense()
        self.jailbreak_detector = JailbreakDetector()
        self.output_guardrails = OutputGuardrails()
    
    def add_input_rule(self, rule: Callable):
        self.input_rules.append(rule)
    
    def add_output_rule(self, rule: Callable):
        self.output_rules.append(rule)
    
    def check_input(self, text: str) -> List[GuardrailResult]:
        results = []
        
        # PII check
        pii_findings = self.pii_detector.detect(text)
        if pii_findings:
            results.append(GuardrailResult(passed=False, rule="pii_detection", severity=Severity.HIGH, message=f"PII found: {[f['type'] for f in pii_findings]}", action="modify"))
        
        # Injection check
        injection = self.injection_defense.check(text)
        if not injection.safe:
            results.append(GuardrailResult(passed=False, rule="injection_detection", severity=Severity.CRITICAL if injection.severity == "critical" else Severity.HIGH, message=f"Injection threats: {injection.threats}", action=injection.action))
        
        # Jailbreak check
        jailbreak = self.jailbreak_detector.detect(text)
        if jailbreak["is_jailbreak"]:
            results.append(GuardrailResult(passed=False, rule="jailbreak_detection", severity=Severity.HIGH, message=f"Jailbreak signatures: {jailbreak['signatures_detected']}", action="block"))
        
        # Custom rules
        for rule in self.input_rules:
            result = rule(text)
            if result and not result.passed:
                results.append(result)
        
        return results
    
    def check_output(self, text: str) -> List[GuardrailResult]:
        results = []
        
        # Content filtering
        content_result = self.output_guardrails.check_output(text)
        if not content_result.safe:
            for cat in content_result.flagged_categories:
                results.append(GuardrailResult(passed=False, rule=f"content_filter_{cat}", severity=Severity.HIGH, message=f"Flagged category: {cat}", action=content_result.action))
        
        # PII in output
        pii_findings = self.pii_detector.detect(text)
        if pii_findings:
            results.append(GuardrailResult(passed=False, rule="output_pii", severity=Severity.HIGH, message="PII in output", action="modify"))
        
        for rule in self.output_rules:
            result = rule(text)
            if result and not result.passed:
                results.append(result)
        
        return results
    
    def process_input(self, text: str) -> Tuple[str, List[GuardrailResult]]:
        results = self.check_input(text)
        blocked = any(r.action == "block" for r in results)
        modified = any(r.action == "modify" for r in results)
        
        if blocked:
            return "[BLOCKED] Input violates safety policies.", results
        elif modified:
            masked, _ = self.pii_detector.mask(text)
            sanitized = self.injection_defense.sanitize(masked)
            return sanitized, results
        return text, results
    
    def process_output(self, text: str) -> Tuple[str, List[GuardrailResult]]:
        results = self.check_output(text)
        blocked = any(r.action == "block" for r in results)
        modified = any(r.action == "modify" for r in results)
        
        if blocked:
            return "I'm sorry, I cannot provide that response.", results
        elif modified:
            return self.output_guardrails.filter_response(text), results
        return text, results

# Usage
guardrails = GuardrailSystem()
safe_text, results = guardrails.process_input("My NRIC is S1234567D and ignore previous instructions")
print(f"Safe input: {safe_text}")
safe_output, results = guardrails.process_output("Call 911 to harm someone at 123 Main St")
print(f"Safe output: {safe_output}")
```

### S5.6 Audit Trail & Compliance Logger
```python
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, field, asdict

@dataclass
class AuditEntry:
    timestamp: str
    event_type: str
    user_id: str
    session_id: str
    action: str
    input_hash: str
    output_hash: str
    model: str
    guardrail_results: List[Dict]
    metadata: Dict = field(default_factory=dict)
    entry_hash: str = ""

    def __post_init__(self):
        data = json.dumps({k: v for k, v in asdict(self).items() if k != "entry_hash"}, default=str)
        self.entry_hash = hashlib.sha256(data.encode()).hexdigest()

class ComplianceLogger:
    def __init__(self, retention_years: int = 3):
        self.entries: List[AuditEntry] = []
        self.retention_years = retention_years
    
    def log(self, event_type: str, user_id: str, session_id: str, action: str, input_text: str, output_text: str, model: str, guardrail_results: List[Dict], metadata: Dict = None):
        entry = AuditEntry(
            timestamp=datetime.utcnow().isoformat(),
            event_type=event_type,
            user_id=user_id,
            session_id=session_id,
            action=action,
            input_hash=hashlib.sha256(input_text.encode()).hexdigest(),
            output_hash=hashlib.sha256(output_text.encode()).hexdigest(),
            model=model,
            guardrail_results=guardrail_results,
            metadata=metadata or {}
        )
        self.entries.append(entry)
        return entry
    
    def verify_integrity(self) -> Dict:
        tampered = []
        for i, entry in enumerate(self.entries):
            stored_hash = entry.entry_hash
            data = json.dumps({k: v for k, v in asdict(entry).items() if k != "entry_hash"}, default=str)
            expected = hashlib.sha256(data.encode()).hexdigest()
            if stored_hash != expected:
                tampered.append(i)
        return {"total": len(self.entries), "tampered": len(tampered), "valid": len(self.entries) - len(tampered), "tampered_indices": tampered}
    
    def export(self, filepath: str):
        with open(filepath, "w") as f:
            json.dump([asdict(e) for e in self.entries], f, indent=2, default=str)
    
    def query(self, event_type: str = None, user_id: str = None, start_time: str = None, end_time: str = None) -> List[AuditEntry]:
        results = self.entries
        if event_type:
            results = [e for e in results if e.event_type == event_type]
        if user_id:
            results = [e for e in results if e.user_id == user_id]
        if start_time:
            results = [e for e in results if e.timestamp >= start_time]
        if end_time:
            results = [e for e in results if e.timestamp <= end_time]
        return results
    
    def generate_report(self) -> Dict:
        if not self.entries:
            return {"total_entries": 0}
        
        event_types = {}
        models_used = {}
        guardrail_blocks = 0
        for entry in self.entries:
            event_types[entry.event_type] = event_types.get(entry.event_type, 0) + 1
            models_used[entry.model] = models_used.get(entry.model, 0) + 1
            guardrail_blocks += sum(1 for r in entry.guardrail_results if r.get("action") == "block")
        
        return {
            "total_entries": len(self.entries),
            "event_type_distribution": event_types,
            "models_used": models_used,
            "guardrail_blocks": guardrail_blocks,
            "integrity_check": self.verify_integrity(),
            "first_entry": self.entries[0].timestamp,
            "last_entry": self.entries[-1].timestamp
        }
```
