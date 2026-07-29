"""Agent service with tool use and reasoning."""
from typing import Optional
from app.services.llm_service import LLMService
from app.services.vectorstore_service import VectorStoreService
from app.services.embedding_service import EmbeddingService
import json
import structlog

logger = structlog.get_logger()

AGENT_SYSTEM_PROMPT = """You are an intelligent agent that can use tools to answer questions.
You have access to the following tools:

{tools}

To use a tool, respond with a JSON action in this format:
{{"action": "tool_name", "action_input": "input"}}

When you have the final answer, respond with:
{{"action": "final_answer", "action_input": "your answer"}}

Always think step by step. Use tools when needed."""


class AgentService:
    """ReAct agent with tool use."""

    def __init__(self, llm: LLMService, vectorstore: VectorStoreService):
        self.llm = llm
        self.vectorstore = vectorstore
        self.embedding_service = EmbeddingService()
        self.tools = self._init_tools()

    def _init_tools(self) -> dict:
        """Initialize available tools."""
        return {
            "search": self._tool_search,
            "calculate": self._tool_calculate,
            "web_search": self._tool_web_search,
            "summarize": self._tool_summarize,
        }

    async def run(
        self,
        query: str,
        tools: list[str] = None,
        max_iterations: int = 10,
    ) -> dict:
        """Run the agent loop."""
        tools = tools or list(self.tools.keys())
        tool_descriptions = self._get_tool_descriptions(tools)
        system_prompt = AGENT_SYSTEM_PROMPT.format(tools=tool_descriptions)

        steps = []
        tools_used = set()

        for i in range(max_iterations):
            # Get LLM response
            full_prompt = f"Question: {query}\n\nPrevious steps:\n" + "\n".join(
                f"Step {s['step']}: {s['action']} -> {s['result'][:100]}"
                for s in steps
            )

            response = await self.llm.generate(
                prompt=full_prompt,
                system_prompt=system_prompt,
            )

            # Parse action
            action = self._parse_action(response["response"])

            if action["action"] == "final_answer":
                return {
                    "response": action["action_input"],
                    "steps": steps,
                    "tools_used": list(tools_used),
                    "iterations": i + 1,
                }

            # Execute tool
            if action["action"] in self.tools:
                tools_used.add(action["action"])
                try:
                    result = await self.tools[action["action"]](action["action_input"])
                except Exception as e:
                    result = f"Error: {str(e)}"

                steps.append({
                    "step": i + 1,
                    "action": action["action"],
                    "input": action["action_input"],
                    "result": str(result),
                })
            else:
                steps.append({
                    "step": i + 1,
                    "action": "unknown",
                    "input": action["action"],
                    "result": f"Unknown tool: {action['action']}",
                })

        # Max iterations reached
        return {
            "response": "I've reached the maximum number of iterations. Here's what I found so far: " +
                        (steps[-1]["result"] if steps else "No results."),
            "steps": steps,
            "tools_used": list(tools_used),
            "iterations": max_iterations,
        }

    def _parse_action(self, response: str) -> dict:
        """Parse action from LLM response."""
        try:
            # Try to find JSON in the response
            import re
            json_match = re.search(r'\{[^{}]*\}', response)
            if json_match:
                action = json.loads(json_match.group())
                return {
                    "action": action.get("action", "final_answer"),
                    "action_input": action.get("action_input", response),
                }
        except (json.JSONDecodeError, AttributeError):
            pass

        # Default to final answer
        return {"action": "final_answer", "action_input": response}

    def _get_tool_descriptions(self, tools: list[str]) -> str:
        """Get formatted tool descriptions."""
        descriptions = {
            "search": "search(query) - Search the document database for relevant information",
            "calculate": "calculate(expression) - Evaluate a mathematical expression (e.g., '2 + 2', 'sqrt(16)')",
            "web_search": "web_search(query) - Search the web for information (placeholder - not implemented)",
            "summarize": "summarize(text) - Summarize a given text",
        }
        return "\n".join(descriptions.get(t, f"{t} - Unknown tool") for t in tools)

    # --- Tool implementations ---
    async def _tool_search(self, query: str) -> str:
        """Search documents."""
        results = await self.embedding_service.search(query, top_k=3)
        if not results:
            return "No relevant documents found."
        return "\n\n".join(
            f"[Score: {r.get('score', 0):.2f}] {r['text'][:300]}"
            for r in results
        )

    async def _tool_calculate(self, expression: str) -> str:
        """Calculate mathematical expression."""
        try:
            import math
            allowed_names = {
                "abs": abs, "round": round,
                "sqrt": math.sqrt, "pow": pow,
                "sin": math.sin, "cos": math.cos,
                "pi": math.pi, "e": math.e,
            }
            result = eval(expression, {"__builtins__": {}}, allowed_names)
            return str(result)
        except Exception as e:
            return f"Calculation error: {str(e)}"

    async def _tool_web_search(self, query: str) -> str:
        """Web search placeholder."""
        return f"Web search for '{query}' is not implemented yet. Please use document search instead."

    async def _tool_summarize(self, text: str) -> str:
        """Summarize text using LLM."""
        response = await self.llm.generate(
            prompt=f"Summarize the following text concisely:\n\n{text[:2000]}",
            system_prompt="You are a summarizer. Provide a concise summary.",
        )
        return response["response"]
