export const AI_AGENTS_DATA = {
  "id": "ai-agents",
  "title": "AI Agents",
  "icon": "🤖",
  "description": "124 in-depth articles on building, deploying, and scaling production AI agents.",
  "categories": [
    {
      "name": "Foundations",
      "icon": "🧱",
      "concepts": [
        {
          "title": "Agent Loop Design",
          "slug": "agent-loop",
          "tldr": "The agent loop is the core execution cycle: Observe → Think → Act → Observe. Getting the loop design right determines whether your agent is reliable or chaotic.",
          "whyItMatters": [
            { "num": "1", "title": "Autonomous Coding", "text": "Cursor and Copilot Workspace use agent loops: read file → plan change → write code → run tests → fix errors → repeat." },
            { "num": "2", "title": "Research Assistants", "text": "An agent searches the web, reads papers, synthesizes findings, and asks follow-up questions in a structured loop." },
            { "num": "3", "title": "Customer Support", "text": "The loop: understand query → search knowledge base → generate response → check quality → deliver or escalate." }
          ],
          "howItWorks": "The agent loop is a while-loop that alternates between LLM inference and tool execution. At each step, the LLM receives the current context (conversation + tool results) and decides: (1) Call a tool, (2) Generate a final response, or (3) Ask for clarification. The loop terminates when the agent produces a final answer or hits a max-step limit. Critical design decisions include: max iterations, timeout handling, error recovery, and human-in-the-loop checkpoints.",
          "pitfalls": [
            { "text": "No max iteration limit causes infinite loops when the agent gets stuck." },
            { "text": "Without timeout handling, a slow tool call blocks the entire agent." },
            { "text": "Not logging each step makes debugging impossible in production." },
            { "text": "The agent can hallucinate tool calls that don't exist." },
            { "text": "Without guardrails, the agent may execute dangerous actions autonomously." }
          ],
          "keyTerms": [
            { "term": "Agent Loop", definition: "The iterative cycle of observe-think-act that drives agent behavior." },
            { "term": "Tool Calling", definition: "The mechanism for agents to invoke external functions or APIs." },
            { "term": "Max Steps", definition: "A safety limit on how many iterations the loop can execute." },
            { "term": "Observation", definition: "The result returned from a tool call that feeds back into the LLM." },
            { "term": "Final Answer", definition: "The terminal state where the agent produces its output." }
          ],
          "codeExample": "from langchain.agents import create_react_agent\nfrom langchain.tools import Tool\n\ndef search(query: str) -> str:\n    return f'Results for: {query}'\n\ntools = [Tool(name='Search', func=search, description='Search the web')]\nagent = create_react_agent(llm, tools, prompt)\n\nresult = agent.invoke({'input': 'What is RAG?'})\nprint(result['output'])",
          "relatedConcepts": ["Tool Calling Patterns", "ReAct Pattern", "Agent Memory"]
        },
        {
          "title": "Token Economics for Agents",
          "slug": "token-economics",
          "tldr": "Every agent action costs tokens. Understanding token economics is essential for building cost-effective agent systems.",
          "whyItMatters": [
            { "num": "1", "title": "Cost Control", "text": "A coding agent that reads 50 files per task can cost $5-50 per task depending on file sizes and model pricing." },
            { "num": "2", "title": "Latency", "text": "Token generation is the bottleneck; fewer tokens per step means faster agent responses." },
            { "num": "3", "title": "Context Limits", "text": "Every observation consumes context window space; unbounded accumulation causes the agent to hit limits." }
          ],
          "howItWorks": "Token economics covers the financial and practical costs of LLM usage in agent systems. Input tokens (prompt + context + tool results) are typically cheaper than output tokens (agent reasoning + tool calls). A well-designed agent: (1) Summarizes observations to reduce token count, (2) Uses smaller/cheaper models for simple sub-tasks, (3) Caches repeated tool results, (4) Truncates old conversation history, (5) Uses structured output to minimize verbose reasoning.",
          "pitfalls": [
            { "text": "Dumping entire file contents as tool results blows up token costs." },
            { "text": "Using GPT-4 for every sub-task when GPT-3.5 would suffice." },
            { "text": "Not tracking per-task costs makes it impossible to optimize." },
            { "text": "Verbose chain-of-thought reasoning consumes output tokens rapidly." }
          ],
          "keyTerms": [
            { "term": "Input Tokens", definition: "Tokens consumed by the prompt, context, and tool results." },
            { "term": "Output Tokens", definition: "Tokens generated by the LLM for reasoning and tool calls." },
            { "term": "Token Budget", definition: "A maximum token limit per task or per agent step." },
            { "term": "Cost per 1K Tokens", definition: "The pricing unit for LLM API calls (varies by model)." }
          ],
          "codeExample": "import tiktoken\n\ndef count_tokens(text: str, model: str = 'gpt-4') -> int:\n    encoding = tiktoken.encoding_for_model(model)\n    return len(encoding.encode(text))\n\ndef fit_in_context(messages, max_tokens=8000):\n    total = sum(count_tokens(m['content']) for m in messages)\n    while total > max_tokens and len(messages) > 2:\n        removed = messages.pop(1)  # Remove oldest non-system message\n        total -= count_tokens(removed['content'])\n    return messages",
          "relatedConcepts": ["Context Window Management", "Agent Loop Design", "Cost Optimization"]
        }
      ]
    },
    {
      "name": "Architecture & Patterns",
      "icon": "🏛️",
      "concepts": [
        {
          "title": "ReAct Pattern",
          "slug": "react-pattern",
          "tldr": "ReAct (Reasoning + Acting) is the most common agent pattern: the LLM alternates between thinking about what to do and taking actions via tools.",
          "whyItMatters": [
            { "num": "1", "title": "General Purpose Agents", "text": "Most production agents use ReAct: reason about the problem, call a tool, observe the result, reason again." },
            { "num": "2", "title": "Debugging", "text": "ReAct's explicit thought steps make it easy to understand why an agent made a particular decision." },
            { "num": "3", "title": "Error Recovery", "text": "When a tool call fails, the reasoning step can analyze the error and try a different approach." }
          ],
          "howItWorks": "ReAct follows a strict loop: Thought (LLM reasons about what to do next) → Action (LLM selects and calls a tool) → Observation (tool returns a result) → repeat until Final Answer. The key insight is that explicit reasoning before each action produces more reliable and debuggable behavior compared to direct action. The thought step is visible in logs, making it easy to trace the agent's decision-making process.",
          "pitfalls": [
            { "text": "The agent may get stuck in reasoning loops without taking action." },
            { "text": "Verbose reasoning consumes output tokens and increases latency." },
            { "text": "The agent can hallucinate tool names or parameters." },
            { "text": "Long observation results can push important context out of the window." }
          ],
          "keyTerms": [
            { "term": "Thought", definition: "The LLM's reasoning about what action to take next." },
            { "term": "Action", definition: "The tool call selected by the LLM based on its reasoning." },
            { "term": "Observation", definition: "The result returned from the tool call." },
            { "term": "Final Answer", definition: "The terminal state where the agent produces its output." }
          ],
          "codeExample": "REACT_PROMPT = '''Answer step by step.\n\nYou have access to these tools:\n{tools}\n\nUse this format:\nThought: what to do next\nAction: tool_name\nAction Input: input for the tool\nObservation: result from the tool\n... (repeat as needed)\nThought: I now know the final answer\nFinal Answer: the answer'''\n\n# The agent alternates:\n# 1. Thought: 'I need to search for X'\n# 2. Action: search\n# 3. Action Input: 'machine learning basics'\n# 4. Observation: 'ML is a subset of AI...'\n# 5. Thought: 'I now know the answer'\n# 6. Final Answer: 'ML is...'",
          "relatedConcepts": ["Agent Loop Design", "Tool Calling", "Plan-and-Execute"]
        },
        {
          "title": "Plan-and-Execute Pattern",
          "slug": "plan-and-execute",
          "tldr": "Plan-and-Execute separates planning from execution: one LLM creates a multi-step plan, then a different (often cheaper) model executes each step.",
          "whyItMatters": [
            { "num": "1", "title": "Complex Tasks", "text": "For tasks requiring 5+ steps, planning upfront prevents the agent from losing track of the overall goal." },
            { "num": "2", "title": "Cost Optimization", "text": "Use GPT-4 for planning (fewer tokens) and GPT-3.5 for execution (more tokens, lower cost)." },
            { "num": "3", "title": "Reliability", "text": "Plans can be reviewed by humans before execution, adding a safety checkpoint." }
          ],
          "howItWorks": "Phase 1 (Plan): The planner LLM receives the task and produces a numbered list of steps. Phase 2 (Execute): An executor processes each step sequentially, using tools as needed. After each step, the result is added to the execution context. The planner can optionally re-plan if execution reveals the original plan was flawed. This separation allows different models for different roles and enables plan-level review and optimization.",
          "pitfalls": [
            { "text": "Plans can be too rigid; the agent should be able to re-plan when execution diverges." },
            { "text": "The planner may produce unrealistic steps that the executor cannot complete." },
            { "text": "Error recovery in execution requires careful handling to avoid cascading failures." },
            { "text": "Plan quality depends heavily on the planner LLM's capability." }
          ],
          "keyTerms": [
            { "term": "Planner", definition: "The LLM responsible for creating the high-level plan." },
            { "term": "Executor", definition: "The component that carries out each step of the plan." },
            { "term": "Re-planning", definition: "Updating the plan when execution reveals original assumptions were wrong." },
            { "term": "Step Dependency", definition: "Steps that must complete before the next can begin." }
          ],
          "codeExample": "from langchain.chat_models import ChatOpenAI\n\nplanner_llm = ChatOpenAI(model='gpt-4')  # Smart planner\nexecutor_llm = ChatOpenAI(model='gpt-3.5-turbo')  # Cheap executor\n\ndef plan(task: str) -> list:\n    response = planner_llm.predict(\n        f'Break this into numbered steps:\\n{task}'\n    )\n    return parse_steps(response)\n\ndef execute(steps: list):\n    context = []\n    for step in steps:\n        result = executor_llm.predict(\n            f'Step: {step}\\nContext: {context}'\n        )\n        context.append(result)\n    return context[-1]",
          "relatedConcepts": ["ReAct Pattern", "Multi-Agent Systems", "Agent Loop Design"]
        }
      ]
    },
    {
      "name": "Protocols",
      "icon": "📡",
      "concepts": [
        {
          "title": "Model Context Protocol (MCP)",
          "slug": "mcp",
          "tldr": "MCP is an open standard for connecting AI models to external data sources via a unified JSON-RPC 2.0 interface, eliminating the N-to-M integration problem.",
          "whyItMatters": [
            { "num": "1", "title": "Tool Reusability", "text": "A single Database MCP Server can serve a developer's IDE, a customer support bot, and a data analysis agent simultaneously." },
            { "num": "2", "title": "Enterprise Security", "text": "MCP centralizes tool definitions into discoverable servers for security auditing and version control." },
            { "num": "3", "title": "Framework Independence", "text": "Tools built for LangChain can be reused in Semantic Kernel or any MCP-compliant host." }
          ],
          "howItWorks": "MCP follows a client-server architecture. The Host (client) manages the LLM and user session. The Server exposes capabilities (Tools, Resources, Prompts). Communication uses JSON-RPC 2.0 over stdio (local) or Streamable HTTP (remote). The lifecycle: Transport Establishment → Initialize (handshake with version/capability negotiation) → Discovery (tools/list, resources/list) → Request-Response Loop (tools/call) → Notifications. The 2025 spec moved to stateless HTTP for cloud-native scaling.",
          "pitfalls": [
            { "text": "Network serialization overhead adds latency to tool calls." },
            { "text": "JSON Schema definitions must be precise for LLM accuracy." },
            { "text": "Error handling must distinguish protocol errors from tool execution errors." },
            { "text": "Caching via ttlMs is essential for reducing latency in production." }
          ],
          "keyTerms": [
            { "term": "Host", definition: "The application integrating an LLM and managing the user session." },
            { "term": "Server", definition: "A process exposing tools, resources, and prompts via MCP." },
            { "term": "Transport", definition: "The communication mechanism: stdio, SSE, or Streamable HTTP." },
            { "term": "Capability Negotiation", definition: "The handshake where host and server agree on supported features." },
            { "term": "JSON-RPC 2.0", definition: "The message format used for all MCP communications." }
          ],
          "codeExample": "from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP('MyService')\n\n@mcp.tool()\ndef search_docs(query: str) -> str:\n    \"\"\"Search internal documentation.\"\"\"\n    results = db.search(query)\n    return str(results)\n\n@mcp.resource('docs://{topic}')\ndef get_doc(topic: str) -> str:\n    \"\"\"Read a specific document.\"\"\"\n    return docs.get(topic, 'Not found')\n\nif __name__ == '__main__':\n    mcp.run()",
          "relatedConcepts": ["Agent Loop Design", "Tool Calling", "A2A Protocol"]
        }
      ]
    },
    {
      "name": "Security & Governance",
      "icon": "🛡️",
      "concepts": [
        {
          "title": "Prompt Injection Defense",
          "slug": "prompt-injection",
          "tldr": "Prompt injection is when adversarial user input overrides system instructions. Defending against it requires layered security: input sanitization, output validation, and instruction hierarchy.",
          "whyItMatters": [
            { "num": "1", "title": "Chatbots", "text": "Users trying to trick customer support bots into giving unauthorized discounts or revealing internal prompts." },
            { "num": "2", "title": "Code Assistants", "text": "Malicious code in repos could instruct the AI agent to exfiltrate secrets when processing the file." },
            { "num": "3", "title": "Content Moderation", "text": "Adversarial inputs designed to bypass content filters and generate harmful content." }
          ],
          "howItWorks": "Prompt injection exploits the fact that LLMs process all input as instructions. Defense layers: (1) Input sanitization — detect and strip known injection patterns, (2) Instruction hierarchy — clearly separate system instructions from user input in the prompt, (3) Output validation — check agent outputs before execution, (4) Capability restriction — limit what tools the agent can access based on user permissions, (5) Sandboxing — execute tool calls in isolated environments.",
          "pitfalls": [
            { "text": "No defense is 100% effective; assume injection will succeed and limit blast radius." },
            { "text": "Embedding user input in XML tags helps but is not sufficient alone." },
            { "text": "Over-restricting the agent makes it less useful for legitimate tasks." },
            { "text": "New injection techniques emerge constantly; defense must be updated regularly." }
          ],
          "keyTerms": [
            { "term": "Prompt Injection", definition: "Adversarial input designed to override system instructions." },
            { "term": "Jailbreak", definition: "A specific injection that bypasses safety restrictions." },
            { "term": "Instruction Hierarchy", definition: "Structuring prompts so system instructions override user input." },
            { "term": "Output Validation", definition: "Checking agent outputs before executing them as actions." },
            { "term": "Blast Radius", definition: "The maximum damage possible if an injection succeeds." }
          ],
          "codeExample": "def sanitize_input(user_input: str) -> str:\n    # Remove potential injection patterns\n    dangerous_patterns = [\n        'ignore previous instructions',\n        'you are now',\n        'system:', '<|im_start|>',\n    ]\n    sanitized = user_input\n    for pattern in dangerous_patterns:\n        sanitized = sanitized.replace(pattern, '[BLOCKED]')\n    return sanitized\n\ndef build_safe_prompt(system_instructions: str, user_input: str) -> str:\n    safe_input = sanitize_input(user_input)\n    return f'''\n    <system>{system_instructions}</system>\n    <user_input>{safe_input}</user_input>\n    Always follow the system instructions above.\n    '''",
          "relatedConcepts": ["OWASP Top 10 for AI", "RBAC for Agents", "Guardrails"]
        }
      ]
    }
  ]
};
