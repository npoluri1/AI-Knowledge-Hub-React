"""Works fully offline via hashing embedder; swap in sentence-transformers if installed."""
import json, math, pathlib, hashlib
import numpy as np

DIM = 256
def embed_offline(text: str) -> np.ndarray:
    v = np.zeros(DIM, dtype=np.float32)
    for tok in text.lower().split():
        v[int(hashlib.md5(tok.encode()).hexdigest(), 16) % DIM] += 1.0
    n = np.linalg.norm(v)
    return v / n if n else v

try:                                                   # upgrade path
    from sentence_transformers import SentenceTransformer
    _st = SentenceTransformer("all-MiniLM-L6-v2")
    def embed(text): return _st.encode(text, normalize_embeddings=True)
except Exception:
    embed = embed_offline

class MiniVectorStore:
    def __init__(self): self.ids, self.docs, self.M = [], [], None
    def add(self, ids, docs):
        V = np.stack([embed(d) for d in docs]).astype(np.float32)
        self.ids += ids; self.docs += docs
        self.M = V if self.M is None else np.vstack([self.M, V])
    def search(self, q, k=3):
        sims = self.M @ embed(q)                        # normalized => dot == cosine
        top = np.argsort(-sims)[:k]
        return [(self.ids[i], float(sims[i]), self.docs[i]) for i in top]
    def save(self, p): pathlib.Path(p).write_text(json.dumps(
        {"ids": self.ids, "docs": self.docs, "M": self.M.tolist()}))

if __name__ == "__main__":
    docs = ["How do I reset my password?",
            "VPN setup guide for remote work",
            "Expense reimbursement policy and limits",
            "Resetting a forgotten password via email link"]
    s = MiniVectorStore(); s.add([f"d{i}" for i in range(len(docs))], docs)
    for q in ["forgot password help", "claim travel costs"]:
        print("\nQ:", q)
        for id_, score, doc in s.search(q):
            print(f"  {score:.3f}  {id_}  {doc}")