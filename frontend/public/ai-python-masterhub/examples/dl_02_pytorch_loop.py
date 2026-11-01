"""pip install torch --index-url https://download.pytorch.org/whl/cpu"""
import torch, torch.nn as nn

torch.manual_seed(0)
dev = "cuda" if torch.cuda.is_available() else "cpu"

def make_blobs(n=4096, k=3, d=16):
    centers = torch.randn(k, d) * 4
    y = torch.randint(0, k, (n,))
    X = centers[y] + 0.9 * torch.randn(n, d)
    return X.to(dev), y.to(dev)

class MLP(nn.Sequential):
    def __init__(self, d_in, h, classes):
        super().__init__(
            nn.Linear(d_in, h), nn.ReLU(), nn.BatchNorm1d(h), nn.Dropout(0.1),
            nn.Linear(h, h), nn.GELU(), nn.LayerNorm(h),
            nn.Linear(h, classes))

X, y = make_blobs()
n_tr = int(0.8 * len(X))
Xtr, Xva, ytr, yva = X[:n_tr], X[n_tr:], y[:n_tr], y[n_tr:]

model = MLP(X.shape[1], 64, 3).to(dev)
opt = torch.optim.AdamW(model.parameters(), lr=3e-3, weight_decay=1e-2)
sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=30)
lossf = nn.CrossEntropyLoss()

best_acc, patience, bad = 0.0, 5, 0
for epoch in range(30):
    model.train(); perm = torch.randperm(n_tr)
    for i in range(0, n_tr, 128):
        idx = perm[i:i+128]
        opt.zero_grad(set_to_none=True)
        loss = lossf(model(Xtr[idx]), ytr[idx])
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
    sched.step()

    model.eval()
    with torch.no_grad():
        acc = (model(Xva).argmax(1) == yva).float().mean().item()
    print(f"epoch {epoch:02d} loss={loss.item():.4f} val_acc={acc:.4f}")
    if acc > best_acc:
        best_acc, bad = acc, 0
        torch.save(model.state_dict(), "best.pt")           # checkpoint
    else:
        bad += 1
        if bad >= patience:
            print("early stop"); break

model.load_state_dict(torch.load("best.pt"))
print("restored best val_acc=%.4f" % best_acc)