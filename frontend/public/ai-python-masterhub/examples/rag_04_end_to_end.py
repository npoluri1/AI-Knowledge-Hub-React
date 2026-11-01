"""Minimal but complete RAG skeleton; plug any LLM into generate(). Stdlib+numpy only."""
import numpy as np
from emb_03_vector_search import MiniVectorStore, embed   # reuse lab 3 store

DOCS = {
 "policy.txt": "Employees may expense up to $150/month for home internet. Receipts are required. "
               "Claims must be submitted within 60 days through the finance portal.",
 "security.txt": "Report suspected phishing to security@corp within 1 hour. Do not click links. "
                 "Detach the device from the network if malware is confirmed.",
}
def chunk(text, size=180, overlap=40):
    out, i = [], 0
    while i < len(text):
        out.append(text[i:i+size]); i += size - overlap
    return out

store = MiniVectorStore()
for name, body in DOCS.items():
    chunks = chunk(body)
    store.add([f"{name}#{i}" for i in range(len(chunks))], chunks)

SYSTEM = ("You are a support assistant. Answer ONLY from the provided context. "
          "If the context lacks the answer, reply exactly: NOT_IN_CONTEXT. Always cite [source].")

PROMPT = """### Context
{context}

### Question
{question}

### Answer (cite sources like [doc#chunk])"""

def build_context(q, k=3):
    hits = store.search(q, k=k)
    ctx = "\n".join(f"[{cid}] {doc}" for cid, _, doc in hits)
    return ctx, hits

def generate(prompt: str, question: str) -> str:
    # Replace with your LLM call (OpenAI/Anthropic/Ollama). Heuristic demo below.
    # Match intent on the QUESTION only -- never on retrieved context text!
    q = question.lower()
    if "expense" in q or "internet" in q:
        return "$150/month with receipts, submit within 60 days via the finance portal. [policy.txt#0]"
    if "phishing" in q:
        return "Report to security@corp within 1 hour and don't click links. [security.txt#0]"
    return "NOT_IN_CONTEXT"

def rag_answer(question: str):
    ctx, hits = build_context(question)
    ans = generate(SYSTEM + "\n\n" + PROMPT.format(context=ctx, question=question),
                   question)
    cited = sorted({h[0].split("#")[0] for h in hits if h[0].split("#")[0] in ans})
    grounded = ("NOT_IN_CONTEXT" in ans) or bool(cited)
    print("Q:", question); print("A:", ans)
    print("sources used:", cited, "| grounded:", grounded)
    return ans, cited, grounded

for q in ["What is the home internet reimbursement limit?",
          "Someone sent me a weird login link"]:
    rag_answer(q)
rag_answer("Who won the 1998 World Cup?")   # expect abstain → NOT_IN_CONTEXT