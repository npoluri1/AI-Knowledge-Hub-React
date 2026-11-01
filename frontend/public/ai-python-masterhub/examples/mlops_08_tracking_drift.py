import json, time, pathlib, numpy as np

RUNS = pathlib.Path("runs.jsonl")
def log_run(params: dict, metrics: dict):
    rec = {"ts": time.time(), "params": params, "metrics": metrics}
    with RUNS.open("a") as f: f.write(json.dumps(rec) + "\n")
    return rec

def best_run(metric="f1"):
    if not RUNS.exists(): return None
    rows = [json.loads(l) for l in RUNS.read_text().splitlines()]
    return max(rows, key=lambda r: r["metrics"].get(metric, -1))

def psi(expected, actual, bins=10):
    edges = np.percentile(expected, np.linspace(0, 100, bins + 1)); edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual, edges)[0] / max(len(actual), 1)
    e, a = np.clip(e, 1e-6, None), np.clip(a, 1e-6, None)
    return float(((a - e) * np.log(a / e)).sum())

def drift_verdict(score):                           # industry rules-of-thumb
    return "STABLE" if score < 0.1 else "WATCH" if score < 0.25 else "DRIFTED — retrain?"

def model_card(name, owner, data, metrics, limits):
    return f"""MODEL CARD
name: {name}
owner: {owner}
data: {data}
metrics: {json.dumps(metrics)}
known limitations: {limits}"""

if __name__ == "__main__":
    RUNS.unlink(missing_ok=True)
    log_run({"model": "logreg", "C": 0.1}, {"f1": 0.81})
    log_run({"model": "gbm", "depth": 4}, {"f1": 0.87})
    print("best:", best_run()["params"])

    tr = np.random.normal(50, 10, 5000)             # training distribution
    live_same = np.random.normal(51, 11, 2000)
    live_shift = np.random.normal(70, 15, 2000)
    for nm, live in [("week-1", live_same), ("week-6", live_shift)]:
        s = psi(tr, live)
        print(f"{nm}: PSI={s:.3f} -> {drift_verdict(s)}")

    print(model_card("churn-gbm-v3", "data-science@corp",
                     "crm_events 2024-2025 (PII masked)", {"f1": 0.87},
                     "not validated outside EU region; monthly drift review"))