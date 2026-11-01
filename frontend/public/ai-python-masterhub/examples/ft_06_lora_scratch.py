"""Understand LoRA mechanics without any framework: W' x = W0 x + (alpha/r) B(A x)."""
import torch, torch.nn as nn, copy

torch.manual_seed(0)
d_in, d_out, rank, alpha = 32, 16, 4, 8.0

base = nn.Linear(d_in, d_out, bias=False)          # pretend this is a frozen LLM layer
base.weight.requires_grad_(False)                  # FREEZE backbone

class LoRALinear(nn.Module):                       # wrap frozen layer
    def __init__(self, wrapped: nn.Linear, r=4, alpha=8.0):
        super().__init__()
        self.wrapped = wrapped
        self.A = nn.Parameter(torch.randn(r, wrapped.in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(wrapped.out_features, r))   # B=0 start ⇒ ΔW=0
        self.scale = alpha / r
    def forward(self, x):
        return self.wrapped(x) + self.scale * (x @ self.A.T @ self.B.T)

model = LoRALinear(base, rank, alpha)
print("trainable:", sum(p.numel() for p in model.parameters() if p.requires_grad),
      "| frozen:", base.weight.numel())

# synthetic 'fine-tune': teach output = x[:4].sum() * 2
X = torch.randn(512, d_in)
Y = (X[:, :4].sum(1, keepdim=True) * 2).repeat(1, d_out)
opt = torch.optim.AdamW([p for p in model.parameters() if p.requires_grad], lr=1e-2)
for step in range(300):
    idx = torch.randint(0, len(X), (64,))
    loss = ((model(X[idx]) - Y[idx]) ** 2).mean()
    opt.zero_grad(); loss.backward(); opt.step()
print(f"adapted loss={loss.item():.4f}")

with torch.no_grad():                               # MERGE adapter into base (deploy path)
    merged = copy.deepcopy(base)
    merged.weight += (alpha / rank) * (model.B @ model.A)
xm = torch.randn(8, d_in)
print("merge parity:", torch.allclose(merged(xm), model(xm), atol=1e-4))