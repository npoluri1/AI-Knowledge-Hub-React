import numpy as np

rng = np.random.default_rng(0)
W = rng.normal(size=(64, 32)).astype(np.float32) * np.linspace(0.2, 1.0, 32)

def quant_per_tensor(W, bits=8):
    qmax = 2 ** (bits - 1) - 1
    s = np.abs(W).max() / qmax                       # one scale for whole tensor
    Q = np.clip(np.round(W / s), -qmax - 1, qmax).astype(np.int8)
    return Q, s

def quant_per_channel(W, axis=1, bits=8):            # one scale per output channel
    qmax = 2 ** (bits - 1) - 1
    s = np.abs(W).max(axis=axis, keepdims=True) / qmax
    Q = np.clip(np.round(W / s), -qmax - 1, qmax).astype(np.int8)
    return Q, s

def dequant(Q, s): return Q.astype(np.float32) * s

def mse(a, b): return ((a - b) ** 2).mean()

Qt, st = quant_per_tensor(W)
Qc, sc = quant_per_channel(W)
print(f"fp32 bytes      : {W.nbytes}")
print(f"int8 bytes      : {Qt.nbytes}  ({W.nbytes/Qt.nbytes:.1f}x smaller)")
print(f"MSE per-tensor  : {mse(W, dequant(Qt, st)):.6f}")
print(f"MSE per-channel : {mse(W, dequant(Qc, sc)):.6f}   <- usually better")
print("memory saved    : %.1f%%" % (100 * (1 - Qt.nbytes / W.nbytes)))