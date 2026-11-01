import sys, time, json, uuid, contextlib
sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # Windows cp1252-safe

class Tracer:
    def __init__(self): self.spans, self.stack = [], []
    @contextlib.contextmanager
    def span(self, name, **attrs):
        sid, parent = uuid.uuid4().hex[:8], (self.stack[-1] if self.stack else None)
        rec = {"id": sid, "parent": parent, "name": name, "attrs": attrs,
               "t0": time.time(), "children": []}
        self.spans.append(rec)
        if parent:
            next(s for s in self.spans if s["id"] == parent)["children"].append(sid)
        self.stack.append(sid)
        try:
            yield rec
        except Exception as e:
            rec["attrs"]["error"] = f"{type(e).__name__}: {e}"; raise
        finally:
            rec["dt_ms"] = round((time.time() - rec["t0"]) * 1000, 2)
            self.stack.pop()

    def render(self, sid=None, depth=0):
        roots = [s for s in self.spans if s["parent"] == (sid if sid else None)]
        for s in roots:
            err = " !!ERROR" if "error" in s["attrs"] else ""
            print("  " * depth + f"└─ {s['name']} ({s['dt_ms']}ms){err} {dict(list(s['attrs'].items())[:2])}")
            self.render(s["id"], depth + 1)

tracer = Tracer()

def llm_call(prompt):
    with tracer.span("llm.call", model="demo-1", prompt_chars=len(prompt)):
        time.sleep(0.02); return "ok-" + prompt[:5]

def retrieve(q):
    with tracer.span("retriever.search", top_k=3):
        time.sleep(0.01); return [f"doc{i}" for i in range(3)]

def rag_pipeline(question):
    with tracer.span("rag.pipeline", question=question):
        docs = retrieve(question)
        with tracer.span("rerank"):
            time.sleep(0.005)
        return llm_call(question + " ".join(docs))

def broken_call():
    with tracer.span("flaky.tool"):
        raise RuntimeError("timeout")

if __name__ == "__main__":
    rag_pipeline("explain LoRA")
    try: broken_call()
    except RuntimeError: pass
    tracer.render()
    (open("trace.jsonl", "w")).write("\n".join(json.dumps(s) for s in tracer.spans))
    print("exported trace.jsonl (ship to Langfuse/OTel collector)")