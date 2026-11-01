"""Pluggable think_fn: offline scripted demo OR real LLM if OPENAI_API_KEY set."""
import os, ast, json, operator

TOOLS = {}
def tool(name):
    def deco(fn): TOOLS[name] = fn; return fn
    return deco

@tool("calc")
def calc(expr: str):
    """Evaluate a math expression like 12*(3+4). Whitelisted evaluator."""
    import re
    assert re.fullmatch(r"[\d\s+\-*/().]+", expr), "bad expr"
    return eval(expr, {"__builtins__": {}}, {})

@tool("kb_search")
def kb_search(query: str):
    """Search internal knowledge base."""
    KB = {"vacation": "Full-time staff get 21 days annual leave.",
          "vpn":     "VPN portal: vpn.corp.example, MFA required."}
    for k, v in KB.items():
        if k in query.lower(): return v
    return "NO_MATCH"

SYSTEM = """You are an agent. Tools: calc[expr], kb_search[query]
Format EVERY step exactly:
Thought: <reasoning>
Action: <tool>[<arg>]
After each Action you get an Observation. When done:
Final Answer: <answer>
"""

# ---- offline brain: scripted trajectory (swap with real LLM below) ----
SCRIPT = ["Thought: I need company vacation policy. Action: kb_search[vacation days]",
          "Thought: got it. Final Answer: 21 days"]

def think_offline(history): return SCRIPT.pop(0) if SCRIPT else "Final Answer: 21 days"

def think_openai(system, history):          # real path
    from openai import OpenAI
    rsp = OpenAI().chat.completions.create(
        model="gpt-4o-mini", temperature=0,
        messages=[{"role": "system", "content": system}] + history)
    return rsp.choices[0].message.content

def think_with_fallback(history):
    """Try the real LLM; any failure (quota/network/key) -> deterministic demo."""
    try:
        return think_openai(SYSTEM, history)
    except Exception as e:
        print(f"[live LLM unavailable: {type(e).__name__} -> offline demo mode]")
        globals()["think"] = think_offline
        return think_offline(history)

think = think_with_fallback

import re
PAT = re.compile(r"Action:\s*(\w+)\[(.*)\]\s*$")
history, steps = [], []
for step in range(6):                        # MAX ITERATIONS guard
    msg = think(history)
    print(f"STEP {step}: {msg}")
    history.append({"role": "assistant", "content": msg})
    m = PAT.search(msg)
    if not m:
        if "Final Answer:" in msg:
            print("\nDONE:", msg.split("Final Answer:")[1].strip()); break
        continue
    name, arg = m.group(1), m.group(2)
    try:
        obs = TOOLS[name](arg)               # dispatch + error-as-observation
    except Exception as e:
        obs = f"ERROR: {e}"
    print(f"OBS: {obs}\n")
    history.append({"role": "user", "content": f"Observation: {obs}"})