from collections import deque
import numpy as np, hashlib

DIM = 128
def emb(text):
    v = np.zeros(DIM); [v.__setitem__(int(hashlib.md5(t.encode()).hexdigest(),16)%DIM,
        v[int(hashlib.md5(t.encode()).hexdigest(),16)%DIM]+1) for t in text.lower().split()]
    n = np.linalg.norm(v); return v/n if n else v

class ShortTerm:                                  # sliding window
    def __init__(self, k=6): self.buf = deque(maxlen=k)
    def add(self, role, text): self.buf.append((role, text))
    def render(self): return "\n".join(f"{r}: {t}" for r, t in self.buf)

class SummaryMemory:                              # rolling compression
    def __init__(self, trigger=6): self.st = ShortTerm(trigger); self.digest = "(none)"
    def add(self, role, text):
        self.st.add(role, text)
        if len(self.st.buf) == self.st.buf.maxlen:
            old = "\n".join(t for _, t in list(self.st.buf)[:3])
            self.digest = (self.digest + " | " +
                " ".join(old.split()[:25]))[-400:]     # truncate-summarize heuristic
            for _ in range(3): self.st.buf.popleft()
    def render(self): return f"EARLIER: {self.digest}\nRECENT:\n{self.st.render()}"

class LongTerm:                                   # episodic vector store
    def __init__(self): self.V, self.docs = None, []
    def remember(self, text):
        self.docs.append(text)
        e = emb(text)[None, :]
        self.V = e if self.V is None else np.vstack([self.V, e])
    def recall(self, q, k=2):
        if self.V is None: return []
        sims = self.V @ emb(q); idx = np.argsort(-sims)[:k]
        return [(self.docs[i], float(sims[i])) for i in idx]

class MemoryManager:
    def __init__(self): self.work = SummaryMemory(); self.lt = LongTerm()
    def turn(self, user_text):
        hits = self.lt.recall(user_text)
        ctx = self.work.render() + ("\nRELEVANT PAST:\n" +
              "\n".join(d for d, _ in hits) if hits else "")
        self.work.add("user", user_text); self.lt.remember(user_text)
        reply = f"(echo) {user_text}"               # replace with your LLM
        self.work.add("assistant", reply)
        return ctx, reply

if __name__ == "__main__":
    m = MemoryManager()
    for u in ["I prefer dark mode.", "My project codename is BLUEFIN.",
              "What was my project codename?", "Remind me my UI preference?"]:
        ctx, reply = m.turn(u)
        print("=" * 60); print(ctx[:400]); print("--> ", reply)