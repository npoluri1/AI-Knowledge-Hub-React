"""pip install -U langgraph langchain-openai"""
import os
if not os.getenv("OPENAI_API_KEY"):
    print("Set OPENAI_API_KEY (or swap ChatOpenAI for a fake node)."); raise SystemExit

from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

class St(TypedDict):
    question: str
    route: str
    answer: str

def classify(s: St) -> St:
    label = llm.invoke("Answer with MATH or CHAT only: " + s["question"]).content
    return {"route": label.strip()[:4].upper()}

def math_node(s: St) -> St:
    a = llm.invoke("Compute step by step, then FINAL: " + s["question"]).content
    return {"answer": a}

def chat_node(s: St) -> St:
    return {"answer": llm.invoke(s["question"]).content}

def router(s: St) -> Literal["math_node", "chat_node"]:      # conditional edge
    return "math_node" if s.get("route") == "MATH" else "chat_node"

g = StateGraph(St)
g.add_node(classify); g.add_node(math_node); g.add_node(chat_node)
g.add_edge(START, "classify")
g.add_conditional_edges("classify", router)
g.add_edge("math_node", END); g.add_edge("chat_node", END)

app = g.compile(checkpointer=MemorySaver())      # persistence => resume/time-travel
cfg = {"configurable": {"thread_id": "user-42"}} # session isolation
print(app.invoke({"question": "What is 17*23?"}, cfg)["answer"][:120])
print(app.invoke({"question": "Say hi to Sam"}, cfg)["answer"][:120])