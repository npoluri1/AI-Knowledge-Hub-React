"""Offline eval skeleton: score any RAG pipeline against a golden CSV of Q/A."""
GOLDEN = [
  {"q": "Home internet reimbursement?", "expect_keywords": ["$150", "60 days"],
   "must_cite": "policy.txt"},
  {"q": "Phishing reporting mailbox?", "expect_keywords": ["security@corp", "1 hour"],
   "must_cite": "security.txt"},
  {"q": "Company founder biography?", "expect_keywords": [], "must_cite": None},
]

DOCS = {"policy.txt": "$150/month home internet. Submit within 60 days with receipts.",
        "security.txt": "Report phishing to security@corp within 1 hour. Do not click."}

def retrieve(q, k=2):
    toks = set(q.lower().split())
    scored = sorted(((sum(t in d.lower().split() for t in toks), n, d)
                     for n, d in DOCS.items()), reverse=True)
    hits = [n for sc, n, d in scored if sc > 0][:k]   # score-0 => admit "no evidence"
    return hits

def answer(q, docs):                                        # stub generator
    joined = " ".join(DOCS.get(n, "") for n in docs)
    return joined if joined else "NOT_IN_CONTEXT"

def evaluate(case):
    docs = retrieve(case["q"])
    ans = answer(case["q"], docs)
    cited_ok = case["must_cite"] in docs if case["must_cite"] else True
    kw_hits = sum(kw.lower() in ans.lower() for kw in case["expect_keywords"])
    rel = kw_hits / max(len(case["expect_keywords"]), 1)
    abstained = "NOT_IN_CONTEXT" in ans
    correct = (abstained and not case["expect_keywords"]) or \
              (rel == 1.0 and cited_ok and not abstained)
    return {"q": case["q"], "retrieval_hit": cited_ok, "answer_recall": round(rel, 2),
            "grounded_or_abstained": bool(cited_ok or abstained), "correct": correct}

if __name__ == "__main__":
    rows = [evaluate(c) for c in GOLDEN]
    for r in rows: print(r)
    acc = sum(r["correct"] for r in rows) / len(rows)
    print(f"\nTASK SUCCESS RATE: {acc:.0%}  -> {'PASS' if acc >= 0.8 else 'FAIL'} (threshold 80%)")
    assert acc >= 0.8, "regression! block the deploy"       # CI gate example