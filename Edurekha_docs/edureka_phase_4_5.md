# Phase 4-5: LangChain, LangGraph, MCP & Multi-Agent Systems

---

## Phase 4: LangChain & LangGraph & Agents

### 4.1 LangChain Core Concepts
```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

llm = ChatOpenAI(model="gpt-4o", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant specialized in {domain}."),
    ("human", "{question}")
])
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"domain": "machine learning", "question": "What is overfitting?"})
```

### 4.2 LangChain Chains
```python
from langchain.chains import SequentialChain, LLMChain
from langchain_core.prompts import ChatPromptTemplate

# Simple chain
title_prompt = ChatPromptTemplate.from_template("Write a title about {topic}")
title_chain = title_prompt | llm | StrOutputParser()

# Sequential chain
summary_prompt = ChatPromptTemplate.from_template("Summarize this title: {title}")
summary_chain = summary_prompt | llm | StrOutputParser()

full_chain = title_prompt | llm | StrOutputParser() | (lambda x: {"title": x}) | summary_prompt | llm | StrOutputParser()
result = full_chain.invoke({"topic": "AI in healthcare"})
```

### 4.3 LangChain Agents
```python
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

@tool
def search_web(query: str) -> str:
    """Search the web for information"""
    return f"Results for: {query}"

@tool
def calculate(expression: str) -> str:
    """Calculate a mathematical expression"""
    return str(eval(expression))

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city"""
    return f"Weather in {city}: 25°C, sunny"

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when needed."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

tools = [search_web, calculate, get_weather]
agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True, max_iterations=5)
result = executor.invoke({"input": "What's the weather in Singapore and what's 15% of 2500?"})
```

### 4.4 Custom Tool Creation
```python
from langchain_core.tools import tool
from typing import Annotated
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="The search query")
    max_results: int = Field(default=5, description="Maximum results to return")

@tool(args_schema=SearchInput)
def advanced_search(query: str, max_results: int = 5) -> str:
    """Advanced search with configurable parameters"""
    return f"Found {max_results} results for: {query}"

# Async tool
@tool
async def async_api_call(endpoint: str) -> str:
    """Make an async API call"""
    import httpx
    async with httpx.AsyncClient() as client:
        response = await client.get(endpoint)
        return response.text
```

### 4.5 LangGraph Fundamentals
```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode
from typing import Literal

def should_continue(state: MessagesState) -> Literal["tools", END]:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

def call_model(state: MessagesState):
    response = llm.bind_tools(tools).invoke(state["messages"])
    return {"messages": [response]}

# Build graph
graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(tools))
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")
app = graph.compile()

result = app.invoke({"messages": [HumanMessage(content="What is the weather in London?")]})
```

### 4.6 LangGraph Advanced — Human-in-the-Loop
```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

def human_approval(state: MessagesState):
    """Request human approval before proceeding"""
    result = interrupt("Please approve this action before continuing")
    return {"approved": result}

def execute_action(state: MessagesState):
    return {"messages": [AIMessage(content="Action executed after approval")]}

graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_node("approval", human_approval)
graph.add_node("action", execute_action)
graph.add_edge(START, "agent")
graph.add_edge("agent", "approval")
graph.add_edge("approval", "action")
graph.add_edge("action", END)

memory = MemorySaver()
app = graph.compile(checkpointer=memory)
config = {"configurable": {"thread_id": "1"}}
result = app.invoke({"messages": [HumanMessage(content="Delete user 123")]}, config)
# Pauses at interrupt — call app.invoke(Command(resume=True), config) after approval
```

### 4.7 LangGraph Subgraphs & Multi-Agent
```python
from langgraph.graph import StateGraph, MessagesState, START, END
from typing import TypedDict, Annotated
from operator import add

class AgentState(TypedDict):
    messages: Annotated[list, add]
    current_agent: str
    results: dict

# Research agent subgraph
def research_agent(state: AgentState):
    response = llm.invoke([("system", "You are a research agent."), ("human", state["messages"][-1].content)])
    return {"results": {"research": response.content}}

# Coding agent subgraph
def coding_agent(state: AgentState):
    response = llm.invoke([("system", "You are a coding agent."), ("human", state["messages"][-1].content)])
    return {"results": {"code": response.content}}

# Supervisor
def supervisor(state: AgentState):
    response = llm.invoke([("system", "Route to 'research' or 'coding'."), ("human", str(state["messages"][-1]))])
    return {"current_agent": "research" if "research" in response.content.lower() else "coding"}

# Main graph
graph = StateGraph(AgentState)
graph.add_node("supervisor", supervisor)
graph.add_node("research", research_agent)
graph.add_node("coding", coding_agent)
graph.add_edge(START, "supervisor")
graph.add_conditional_edges("supervisor", lambda s: s["current_agent"], {"research": "research", "coding": "coding"})
graph.add_edge("research", END)
graph.add_edge("coding", END)
app = graph.compile()
```

### 4.8 LangGraph Checkpointing & Time Travel
```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, MessagesState, START, END

memory = MemorySaver()
app = graph.compile(checkpointer=memory)
config = {"configurable": {"thread_id": "conversation-1"}}

# Run conversation
app.invoke({"messages": [HumanMessage(content="Hello")]}, config)
app.invoke({"messages": [HumanMessage(content="What did I just say?")]}, config)

# List states (time travel)
states = list(app.get_state_history(config))
for state in states:
    print(f"Step {state.metadata.get('step', 0)}: {state.values['messages'][-1].content[:50]}")

# Replay from specific state
target_state = states[2]
app.invoke(None, {"configurable": {"thread_id": "conversation-1"}, "checkpoint_id": target_state.config["configurable"]["checkpoint_id"]})
```

---

## Phase 5: MCP & Multi-Agent Systems

### 5.1 MCP Protocol Architecture
```
Host (AI Application)
  |
  +-- MCP Client 1 <--stdio--> MCP Server A (Database)
  |
  +-- MCP Client 2 <--SSE---> MCP Server B (APIs)
  |
  +-- MCP Client 3 <--HTTP--> MCP Server C (Files)
```

### 5.2 Building MCP Servers
```python
# pip install mcp
from mcp.server import Server
from mcp.types import Tool, TextContent
import mcp.server.stdio
import asyncio

server = Server("my-tools")

@server.list_tools()
async def list_tools():
    return [
        Tool(name="search_database", description="Search the database", inputSchema={
            "type": "object", "properties": {"query": {"type": "string"}, "limit": {"type": "integer", "default": 10}},
            "required": ["query"]
        }),
        Tool(name="send_email", description="Send an email", inputSchema={
            "type": "object", "properties": {"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}},
            "required": ["to", "subject", "body"]
        })
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "search_database":
        results = [{"id": 1, "title": "Result 1"}, {"id": 2, "title": "Result 2"}]
        return [TextContent(type="text", text=str(results))]
    elif name == "send_email":
        return [TextContent(type="text", text=f"Email sent to {arguments['to']}")]

async def main():
    async with mcp.server.stdio.stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

# asyncio.run(main())
```

### 5.3 MCP Client
```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class MCPClient:
    def __init__(self):
        self.sessions = {}
    
    async def connect(self, name: str, command: str, args: list = None):
        params = StdioServerParameters(command=command, args=args or [])
        read, write = await stdio_client(params).__aenter__()
        session = ClientSession(read, write)
        await session.__aenter__()
        await session.initialize()
        self.sessions[name] = session
        tools = await session.list_tools()
        print(f"Connected to {name}: {len(tools.tools)} tools available")
        return tools
    
    async def call_tool(self, server: str, tool_name: str, arguments: dict):
        session = self.sessions[server]
        result = await session.call_tool(tool_name, arguments)
        return result
    
    async def list_all_tools(self):
        all_tools = {}
        for name, session in self.sessions.items():
            tools = await session.list_tools()
            all_tools[name] = [(t.name, t.description) for t in tools.tools]
        return all_tools
```

### 5.4 Multi-Agent Patterns

**Supervisor Pattern:**
```python
from langgraph.graph import StateGraph, MessagesState, START, END

class SupervisorState(TypedDict):
    messages: list
    next_agent: str

def supervisor_node(state):
    response = llm.invoke([("system", "Route to: researcher, coder, or reviewer. Return ONLY the agent name."), ("human", str(state["messages"][-1]))])
    return {"next_agent": response.content.strip().lower()}

def researcher_node(state):
    response = llm.invoke([("system", "You are a researcher."), *state["messages"]])
    return {"messages": [response]}

def coder_node(state):
    response = llm.invoke([("system", "You are a coder."), *state["messages"]])
    return {"messages": [response]}

graph = StateGraph(SupervisorState)
graph.add_node("supervisor", supervisor_node)
graph.add_node("researcher", researcher_node)
graph.add_node("coder", coder_node)
graph.add_edge(START, "supervisor")
graph.add_conditional_edges("supervisor", lambda s: s["next_agent"], {"researcher": "researcher", "coder": "coder"})
graph.add_edge("researcher", END)
graph.add_edge("coder", END)
```

**Debate Pattern:**
```python
def agent_a(state):
    response = llm.invoke([("system", "Argue FOR the topic."), *state["messages"]])
    return {"messages": [HumanMessage(content=f"Agent A argues: {response.content}")]}

def agent_b(state):
    response = llm.invoke([("system", "Argue AGAINST the topic."), *state["messages"]])
    return {"messages": [HumanMessage(content=f"Agent B argues: {response.content}")]}

def judge(state):
    response = llm.invoke([("system", "Evaluate both arguments and give a verdict."), *state["messages"]])
    return {"messages": [response]}

graph = StateGraph(MessagesState)
graph.add_node("agent_a", agent_a)
graph.add_node("agent_b", agent_b)
graph.add_node("judge", judge)
graph.add_edge(START, "agent_a")
graph.add_edge("agent_a", "agent_b")
graph.add_edge("agent_b", "judge")
graph.add_edge("judge", END)
```

### 5.5 Memory Architecture
```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from typing import List, Dict
import json
from datetime import datetime

class AgentMemory:
    def __init__(self):
        self.short_term: List[Dict] = []  # Conversation buffer
        self.long_term = Chroma.from_texts([""], HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2"))  # Vector store
        self.episodic: List[Dict] = []  # Experience log
        self.entity_memory: Dict[str, Dict] = {}  # Entity tracker
    
    def add_conversation(self, role: str, content: str):
        self.short_term.append({"role": role, "content": content, "timestamp": datetime.now().isoformat()})
        if len(self.short_term) > 20:
            summary = " ".join([m["content"][:50] for m in self.short_term[-5:]])
            self.long_term.add_texts([summary])
            self.short_term = self.short_term[-10:]
    
    def search_long_term(self, query: str, k: int = 3) -> List[str]:
        return self.long_term.similarity_search(query, k=k)
    
    def get_context(self, query: str) -> str:
        recent = "\n".join([f"{m['role']}: {m['content']}" for m in self.short_term[-5:]])
        relevant = self.search_long_term(query)
        relevant_text = "\n".join([d.page_content for d in relevant])
        return f"Recent conversation:\n{recent}\n\nRelevant memories:\n{relevant_text}"
    
    def log_episode(self, task: str, result: str, reflection: str):
        self.episodic.append({"task": task, "result": result, "reflection": reflection, "timestamp": datetime.now().isoformat()})
    
    def update_entity(self, entity: str, attributes: Dict):
        self.entity_memory[entity] = {**self.entity_memory.get(entity, {}), **attributes}
```

### 5.6 CrewAI Multi-Agent
```python
# pip install crewai crewai-tools
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

researcher = Agent(
    role="Research Analyst",
    goal="Find comprehensive information about the given topic",
    backstory="Expert researcher with attention to detail",
    tools=[search_tool],
    llm="gpt-4o-mini",
    verbose=True
)

writer = Agent(
    role="Content Writer",
    goal="Write engaging, accurate content based on research",
    backstory="Experienced writer who makes complex topics accessible",
    llm="gpt-4o",
    verbose=True
)

reviewer = Agent(
    role="Quality Reviewer",
    goal="Ensure accuracy and quality of content",
    backstory="Detail-oriented editor with domain expertise",
    llm="gpt-4o",
    verbose=True
)

research_task = Task(description="Research the latest developments in {topic}", agent=researcher, expected_output="Comprehensive research summary")
writing_task = Task(description="Write an article based on the research", agent=writer, expected_output="Well-structured article")
review_task = Task(description="Review and polish the article", agent=reviewer, expected_output="Final polished article")

crew = Crew(agents=[researcher, writer, reviewer], tasks=[research_task, writing_task, review_task], verbose=True)
result = crew.kickoff(inputs={"topic": "Agentic AI in 2026"})
```

### 5.7 OpenAI Agents SDK
```python
from agents import Agent, Runner, function_tool

@function_tool
def get_weather(city: str) -> str:
    """Get current weather for a city"""
    return f"Weather in {city}: 28°C, partly cloudy"

@function_tool
def search_knowledge(query: str) -> str:
    """Search the knowledge base"""
    return f"Found results for: {query}"

agent = Agent(
    name="AI Assistant",
    instructions="You are a helpful assistant. Use tools when needed.",
    model="gpt-4o",
    tools=[get_weather, search_knowledge]
)

result = Runner.run_sync(agent, "What's the weather in Tokyo and search for best practices in AI")
print(result.final_output)
```

### 5.8 Complete Production Multi-Agent System
```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
from operator import add
import asyncio

class MultiAgentState(TypedDict):
    messages: Annotated[list, add]
    task: str
    plan: list
    results: dict
    current_step: int

def planner(state):
    response = llm.invoke([("system", "Create a step-by-step plan. Return numbered steps."), ("human", state["task"])])
    steps = [s.strip() for s in response.content.split("\n") if s.strip() and s.strip()[0].isdigit()]
    return {"plan": steps, "current_step": 0}

def researcher(state):
    step = state["plan"][state["current_step"]]
    response = llm.invoke([("system", "Research this topic thoroughly."), ("human", step)])
    return {"results": {**state["results"], f"step_{state['current_step']}_research": response.content}, "current_step": state["current_step"] + 1}

def coder(state):
    step = state["plan"][state["current_step"]]
    response = llm.invoke([("system", "Write code for this task. Include error handling."), ("human", step)])
    return {"results": {**state["results"], f"step_{state['current_step']}_code": response.content}, "current_step": state["current_step"] + 1}

def reviewer(state):
    all_results = "\n".join([f"{k}: {v[:200]}" for k, v in state["results"].items()])
    response = llm.invoke([("system", "Review all work. Identify issues and suggest improvements."), ("human", all_results)])
    return {"messages": [response]}

def should_continue(state):
    if state["current_step"] >= len(state["plan"]):
        return "reviewer"
    step = state["plan"][state["current_step"]]
    return "coder" if "code" in step.lower() or "implement" in step.lower() else "researcher"

graph = StateGraph(MultiAgentState)
graph.add_node("planner", planner)
graph.add_node("researcher", researcher)
graph.add_node("coder", coder)
graph.add_node("reviewer", reviewer)
graph.add_edge(START, "planner")
graph.add_conditional_edges("planner", lambda s: "researcher", {"researcher": "researcher"})
graph.add_conditional_edges("researcher", should_continue, {"coder": "coder", "researcher": "researcher", "reviewer": "reviewer"})
graph.add_conditional_edges("coder", should_continue, {"coder": "coder", "researcher": "researcher", "reviewer": "reviewer"})
graph.add_edge("reviewer", END)

memory = MemorySaver()
app = graph.compile(checkpointer=memory)
result = app.invoke({"messages": [], "task": "Build a REST API for user management with auth", "plan": [], "results": {}, "current_step": 0}, {"configurable": {"thread_id": "task-1"}})
```
