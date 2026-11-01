// AI Core + Agents topics content — "why you need this" + runnable code for every topic.
// Auto-generated from pythonMasterHubData.js topic listings.

export const AI_CORE_TOPICS_CONTENT = {

  // ──────────────────────────────────────────────
  //  MATH & STATS FOR AI
  // ──────────────────────────────────────────────

  "Vectors & matrices": {
    why: "Every ML model is fundamentally matrix math. Without understanding vectors and shapes, you cannot debug tensor dimension errors, optimize model performance, or read ML papers. A single shape mismatch crashes training silently.",
    code: `import numpy as np

embedding = np.random.randn(768)
print(f"Shape: {embedding.shape}")

W = np.random.randn(768, 256)
output = embedding @ W
print(f"Output: {output.shape}")

batch = np.random.randn(32, 768)
batch_out = batch @ W
print(f"Batch: {batch_out.shape}")

bias = np.zeros(256)
print(f"With bias: {(batch_out + bias).shape}")`
  },

  "Matrix multiply rules": {
    why: "Matrix multiplication shape rules (m,n)@(n,p)->(m,p) are the single most common source of runtime errors in deep learning. If inner dimensions don't match, your model crashes. Understanding this lets you trace errors through any architecture.",
    code: `import numpy as np

A = np.random.randn(32, 768)
B = np.random.randn(768, 256)
C = A @ B
print(f"A{A.shape} @ B{B.shape} = C{C.shape}")

A_t = A.T
gram = A_t @ A
print(f"Gram: {gram.shape}")

batch_A = np.random.randn(8, 32, 768)
batch_B = np.random.randn(8, 768, 256)
batch_C = batch_A @ batch_B
print(f"Batched: {batch_C.shape}")`
  },

  "Transpose & identity": {
    why: "Transpose and identity matrices appear everywhere: A·Aᵀ creates the Gram matrix used in attention, covariance estimation, and PCA. Without grasping these, attention mechanisms and kernel methods remain black boxes.",
    code: `import numpy as np

A = np.random.randn(3, 5)
print(f"A.shape={A.shape}, A.T.shape={A.T.shape}")
gram = A @ A.T
print(f"Gram (symmetric): {gram.shape}")
print(f"Is symmetric? {np.allclose(gram, gram.T)}")

I = np.eye(4)
x = np.random.randn(4)
print(f"I @ x == x? {np.allclose(I @ x, x)}")

B = np.random.randn(4, 3)
print(f"B @ I == B? {np.allclose(B @ np.eye(4), B)}")`
  },

  "Inverse vs pseudo-inverse": {
    why: "Matrix inverses solve linear systems but many ML matrices are singular (non-invertible). The pseudo-inverse (pinv) handles rank-deficient cases like underdetermined least squares — essential for regression and recommendation systems.",
    code: `import numpy as np

A = np.random.randn(3, 3)
A_inv = np.linalg.inv(A)
print(f"A @ A_inv ≈ I? {np.allclose(A @ A_inv, np.eye(3))}")

S = np.array([[1, 2], [2, 4]])
try:
    np.linalg.inv(S)
except np.linalg.LinAlgError as e:
    print(f"Inverse fails: {e}")

S_pinv = np.linalg.pinv(S)
print(f"Pseudo-inverse shape: {S_pinv.shape}")
print(f"S @ S_pinv @ S ≈ S? {np.allclose(S @ S_pinv @ S, S)}")

X = np.random.randn(10, 5)
b = np.random.randn(10)
x_pinv = np.linalg.pinv(X) @ b
print(f"Solution shape: {x_pinv.shape}")`
  },

  "Eigenvalues/eigenvectors": {
    why: "Eigen decomposition is the foundation of PCA, spectral clustering, and understanding matrix behavior. Without it, you can't do dimensionality reduction, understand model stability, or implement many recommendation algorithms.",
    code: `import numpy as np

A = np.array([[4, 2], [1, 3]])
eigenvalues, eigenvectors = np.linalg.eig(A)
print(f"Eigenvalues: {eigenvalues}")

for i in range(len(eigenvalues)):
    lam, v = eigenvalues[i], eigenvectors[:, i]
    lhs = A @ v
    rhs = lam * v
    print(f"λ={lam:.2f}: A@v ≈ λv? {np.allclose(lhs, rhs)}")

X = np.random.randn(100, 5)
cov = np.cov(X.T)
eigvals, eigvecs = np.linalg.eigh(cov)
print(f"Explained variance ratios: {eigvals / eigvals.sum()}")

top2 = eigvecs[:, -2:]
X_proj = X @ top2
print(f"Projected: {X_proj.shape}")`
  },

  "SVD decomposition": {
    why: "SVD (X=UΣVᵀ) is the Swiss army knife of ML: PCA, dimensionality reduction, recommendation systems, image compression, and matrix factorization all rely on it. It decomposes ANY matrix, even non-square or singular.",
    code: `import numpy as np

X = np.random.randn(50, 10)
U, S, Vt = np.linalg.svd(X, full_matrices=False)
print(f"U: {U.shape}, S: {S.shape}, Vt: {Vt.shape}")

X_full = U @ np.diag(S) @ Vt
print(f"Full reconstruction: {np.allclose(X, X_full)}")

k = 3
X_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
variance_kept = np.var(X_approx) / np.var(X)
print(f"Rank-{k} approximation: {variance_kept:.2%} variance kept")

R = np.random.randint(0, 5, (20, 10)).astype(float)
U_r, S_r, Vt_r = np.linalg.svd(R, full_matrices=False)
k = 3
predicted = U_r[:, :k] @ np.diag(S_r[:k]) @ Vt_r[:k, :]
print(f"Predicted ratings: {predicted.shape}")`
  },

  "Norms L1/L2/L∞": {
    why: "Norms measure vector magnitude and drive regularization in ML. L1 promotes sparsity (feature selection), L2 prevents large weights (weight decay), and L∞ measures worst-case perturbation (adversarial robustness). Wrong norm choice means wrong inductive bias.",
    code: `import numpy as np

v = np.array([3.0, -4.0, 0.0, 1.0])

l1 = np.linalg.norm(v, ord=1)
print(f"L1 norm: {l1} (sum of abs)")

l2 = np.linalg.norm(v, ord=2)
print(f"L2 norm: {l2} (Euclidean)")

linf = np.linalg.norm(v, ord=np.inf)
print(f"L∞ norm: {linf} (max absolute)")

weights = np.random.randn(100)
l1_reg = weights.copy()
l1_reg[np.abs(l1_reg) < 0.3] = 0
print(f"L1 zeroed {np.sum(l1_reg == 0)}/{len(l1_reg)} weights")

l2_scaled = weights / (1 + 0.01 * np.linalg.norm(weights))
print(f"L2 shrunk max |w|: {np.max(np.abs(weights)):.3f} -> {np.max(np.abs(l2_scaled)):.3f}")`
  },

  "Cosine similarity": {
    why: "Cosine similarity is the default distance metric for embeddings, semantic search, and RAG retrieval. It measures direction (meaning) not magnitude (length). Without it, your vector search returns garbage results.",
    code: `import numpy as np

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

king = np.array([0.8, 0.1, 0.9, 0.2])
queen = np.array([0.7, 0.3, 0.85, 0.25])
car = np.array([0.1, 0.9, 0.05, 0.95])

print(f"king-queen:  {cosine_sim(king, queen):.3f}")
print(f"king-car:    {cosine_sim(king, car):.3f}")

corpus = np.random.randn(1000, 128)
corpus = corpus / np.linalg.norm(corpus, axis=1, keepdims=True)
query = np.random.randn(128)
query = query / np.linalg.norm(query)

scores = corpus @ query
top_k = np.argsort(-scores)[:5]
print(f"Top 5 scores: {scores[top_k].round(3)}")`
  },

  "Rank & conditioning": {
    why: "Rank deficiency causes numerical instability — gradients explode or vanish, inverses fail, and solutions are non-unique. The condition number tells you how fragile your matrix operations are. Ignoring this leads to silent NaN training failures.",
    code: `import numpy as np

A = np.random.randn(5, 5)
print(f"Random matrix: rank={np.linalg.matrix_rank(A)}, cond={np.linalg.cond(A):.2f}")

B = np.random.randn(5, 3)
B_rankdef = np.column_stack([B, B[:, 0]])
print(f"Rank-deficient: rank={np.linalg.matrix_rank(B_rankdef)}")

C = np.array([[1, 1], [1, 1.0001]])
print(f"Ill-conditioned: cond={np.linalg.cond(C):.0f}")

b = np.array([1.0, 2.0])
x_exact = np.linalg.solve(C, b)
b_perturbed = b + 1e-10
x_perturbed = np.linalg.solve(C, b_perturbed)
print(f"Perturbed b by 1e-10 -> x changed by {np.max(np.abs(x_perturbed - x_exact)):.6f}")`
  },

  "Derivative as sensitivity": {
    why: "Derivatives tell you how much the loss changes when you nudge a weight. Without understanding this, backpropagation is magic. With it, you understand why learning rates matter, why gradients vanish, and why some architectures train faster.",
    code: `import numpy as np

def f(x):
    return x**3 - 2*x**2 + 1

def numerical_derivative(f, x, eps=1e-7):
    return (f(x + eps) - f(x - eps)) / (2 * eps)

def analytical_derivative(x):
    return 3*x**2 - 4*x

for x in [-1.0, 0.0, 1.0, 2.0]:
    num = numerical_derivative(f, x)
    ana = analytical_derivative(x)
    print(f"x={x}: numerical={num:.6f}, analytical={ana:.6f}")

def mse_loss(w, X, y):
    return np.mean((X @ w - y)**2)

X = np.random.randn(50, 3)
y = X @ np.array([1.5, -0.5, 0.8]) + 0.1 * np.random.randn(50)
w = np.array([1.0, -1.0, 0.5])

grad = numerical_derivative(lambda wi: mse_loss(
    np.array([wi, w[1], w[2]]), X, y), w[0])
print(f"Loss gradient w.r.t. w[0]: {grad:.4f}")`
  },

  "Partial derivatives ∂L/∂w": {
    why: "Partial derivatives are the engine of backpropagation: each weight gets its own gradient telling it how to change to reduce loss. Without them, neural networks cannot learn. Understanding partials lets you debug vanishing gradients and design better architectures.",
    code: `import numpy as np

def loss_fn(w1, w2, x=2.0, y=3.0, target=10.0):
    pred = w1 * x + w2 * y
    return (pred - target) ** 2

def grad_w1(w1, w2, x=2.0, y=3.0, target=10.0):
    return 2 * (w1 * x + w2 * y - target) * x

def grad_w2(w1, w2, x=2.0, y=3.0, target=10.0):
    return 2 * (w1 * x + w2 * y - target) * y

w1, w2 = 0.0, 0.0
lr = 0.01
for step in range(20):
    g1, g2 = grad_w1(w1, w2), grad_w2(w1, w2)
    w1 -= lr * g1
    w2 -= lr * g2
    if step % 5 == 0:
        print(f"step {step}: w=({w1:.3f},{w2:.3f}) loss={loss_fn(w1,w2):.4f}")

print(f"Final: w=({w1:.3f},{w2:.3f}), optimal ~ (2.22, 1.78)")`
  },

  "Chain rule backprop": {
    why: "Backpropagation IS the chain rule applied recursively through a computation graph. Without understanding it, you cannot debug training failures, understand why deep networks are hard to train, or implement custom loss functions.",
    code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def sigmoid_grad(z):
    s = sigmoid(z)
    return s * (1 - s)

x, w, b, y_true = 2.0, 0.5, 0.1, 1.0

z = w * x + b
a = sigmoid(z)
L = (a - y_true) ** 2

dL_da = 2 * (a - y_true)
da_dz = sigmoid_grad(z)
dz_dw = x
dz_db = 1.0

dL_dz = dL_da * da_dz
dL_dw = dL_dz * dz_dw
dL_db = dL_dz * dz_db

print(f"Forward: z={z:.4f}, a={a:.4f}, L={L:.4f}")
print(f"Gradients: dL/dw={dL_dw:.4f}, dL/db={dL_db:.4f}")

eps = 1e-6
def full_forward(ww):
    return (sigmoid(ww*x+b) - y_true)**2
num_dL_dw = (full_forward(w+eps) - full_forward(w-eps)) / (2*eps)
print(f"Numerical dL/dw: {num_dL_dw:.4f} (matches: {abs(num_dL_dw-dL_dw)<1e-5})")`
  },

  "Gradient vector direction of steepest ascent": {
    why: "The gradient points in the direction of steepest increase in loss. Optimizers move OPPOSITE to it (steepest descent). Understanding gradient direction explains why learning rate and momentum matter — wrong direction means diverging training.",
    code: `import numpy as np

def f(x, y):
    return x**2 + 4*y**2

def grad_f(x, y):
    return np.array([2*x, 8*y])

pos = np.array([3.0, 2.0])
lr = 0.1
for step in range(15):
    g = grad_f(pos[0], pos[1])
    pos = pos - lr * g
    if step % 3 == 0:
        print(f"step {step}: pos=({pos[0]:.3f},{pos[1]:.3f}) "
              f"grad=({g[0]:.3f},{g[1]:.3f}) loss={f(pos[0],pos[1]):.4f}")

print(f"Minimum near (0,0): {pos}")

px, py = 2.0, 1.0
g = grad_f(px, py)
print(f"At ({px},{py}): gradient direction = ({g[0]:.3f},{g[1]:.3f})")`
  },

  "Jacobian/Hessian": {
    why: "The Jacobian captures first-order sensitivity for vector functions; the Hessian captures curvature. Second-order optimizers use the Hessian for faster convergence. Understanding these explains why some loss landscapes are sharp (fragile) vs flat (generalizable).",
    code: `import numpy as np

def f(x):
    return np.array([x[0]**2 + x[1], np.sin(x[0]) * x[1]])

def numerical_jacobian(f, x, eps=1e-5):
    n, m = len(f(x)), len(x)
    J = np.zeros((n, m))
    for j in range(m):
        ej = np.zeros(m)
        ej[j] = eps
        J[:, j] = (f(x + ej) - f(x - ej)) / (2 * eps)
    return J

x0 = np.array([1.0, 2.0])
J = numerical_jacobian(f, x0)
print(f"Jacobian at {x0}:\n{J}")

def loss(w):
    return w[0]**2 + 3*w[0]*w[1] + w[1]**2

def numerical_hessian(f, x, eps=1e-5):
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            ei, ej = np.zeros(n), np.zeros(n)
            ei[i], ej[j] = eps, eps
            H[i,j] = (f(x+ei+ej) - f(x+ei-ej) - f(x-ei+ej) + f(x-ei-ej)) / (4*eps**2)
    return H

w0 = np.array([1.0, 1.0])
H = numerical_hessian(loss, w0)
print(f"Hessian at {w0}:\n{H}")
eigvals = np.linalg.eigvalsh(H)
print(f"Eigenvalues: {eigvals} ({'convex' if all(e>0 for e in eigvals) else 'not convex'})")`
  },

  "Numerical gradient check": {
    why: "Numerical gradient checking verifies your backprop implementation is correct. A mismatch between analytical and numerical gradients means your model has a bug that will silently produce wrong results. This is the first debug step when training fails.",
    code: `import numpy as np

def forward(X, W1, b1, W2, b2):
    z1 = X @ W1 + b1
    a1 = np.maximum(0, z1)
    out = a1 @ W2 + b2
    return out

def loss(X, y, W1, b1, W2, b2):
    pred = forward(X, W1, b1, W2, b2)
    return np.mean((pred - y) ** 2)

np.random.seed(42)
X = np.random.randn(8, 4)
y = np.random.randn(8, 1)
W1 = np.random.randn(4, 3) * 0.1
b1 = np.zeros((1, 3))
W2 = np.random.randn(3, 1) * 0.1
b2 = np.zeros((1, 1))

eps = 1e-5
num_grad_W1 = np.zeros_like(W1)
for i in range(W1.shape[0]):
    for j in range(W1.shape[1]):
        W1[i,j] += eps
        loss_plus = loss(X, y, W1, b1, W2, b2)
        W1[i,j] -= 2*eps
        loss_minus = loss(X, y, W1, b1, W2, b2)
        W1[i,j] += eps
        num_grad_W1[i,j] = (loss_plus - loss_minus) / (2*eps)

print(f"Numerical grad W1:\n{num_grad_W1.round(4)}")`
  },

  "Convexity local vs global minima": {
    why: "Neural network loss surfaces are non-convex with many local minima, saddle points, and flat regions. Understanding this explains why Adam beats SGD on some tasks, why learning rate schedules matter, and why batch size affects generalization.",
    code: `import numpy as np

def convex_loss(w):
    return (w - 3.0) ** 2

def nonconvex_loss(w):
    return np.sin(3*w) + 0.1*w**2 + np.cos(5*w)

def gd(f, w_start, lr=0.01, steps=500):
    w = w_start
    eps = 1e-6
    for _ in range(steps):
        grad = (f(w+eps) - f(w-eps)) / (2*eps)
        w -= lr * grad
    return w

for start in [-5, 0, 7]:
    print(f"Convex from {start}: min at {gd(convex_loss, start):.4f}")

print()
for start in [-5, -2, 0, 2, 5]:
    result = gd(nonconvex_loss, start, lr=0.005)
    print(f"Non-convex from {start:2d}: min={result:.3f}, loss={nonconvex_loss(result):.4f}")

print("This is why random init + multiple runs matter in deep learning!")`
  },

  "KL divergence & entropy": {
    why: "KL divergence measures how one probability distribution differs from another. It is the core loss in variational autoencoders, the objective in distillation, and the foundation for understanding why models hallucinate — they sample from a shifted distribution.",
    code: `import numpy as np

def kl_divergence(p, q):
    p = np.clip(p, 1e-10, 1.0)
    q = np.clip(q, 1e-10, 1.0)
    return np.sum(p * np.log(p / q))

def entropy(p):
    p = np.clip(p, 1e-10, 1.0)
    return -np.sum(p * np.log(p))

p = np.array([0.5, 0.3, 0.1, 0.1])
q = np.array([0.25, 0.25, 0.25, 0.25])

print(f"Entropy of p: {entropy(p):.4f}")
print(f"Entropy of q (uniform): {entropy(q):.4f}")
print(f"KL(p||q): {kl_divergence(p, q):.4f}")
print(f"KL(q||p): {kl_divergence(q, p):.4f}")

true = np.array([1, 0, 0, 0])
pred_good = np.array([0.9, 0.05, 0.03, 0.02])
pred_bad = np.array([0.3, 0.3, 0.2, 0.2])
print(f"Cross-entropy (good): {entropy(true) + kl_divergence(true, pred_good):.4f}")
print(f"Cross-entropy (bad):  {entropy(true) + kl_divergence(true, pred_bad):.4f}")`
  },

  // ──────────────────────────────────────────────
  //  PROBABILITY & STATISTICS
  // ──────────────────────────────────────────────

  "Random variables distributions normal/uniform/bernoulli": {
    why: "ML models assume data follows distributions. Knowing which distribution your data resembles guides preprocessing, loss selection, and evaluation. Normal for features, Bernoulli for binary labels, uniform for random initialization — wrong assumptions break models.",
    code: `import numpy as np

rng = np.random.default_rng(42)
normal = rng.normal(loc=0, scale=1, size=10000)
print(f"Normal: mean={normal.mean():.3f}, std={normal.std():.3f}")

uniform = rng.uniform(low=-1, high=1, size=10000)
print(f"Uniform: mean={uniform.mean():.3f}, range=[{uniform.min():.3f}, {uniform.max():.3f}]")

labels = rng.binomial(n=1, p=0.3, size=10000)
print(f"Bernoulli(p=0.3): mean={labels.mean():.3f}")

probs = [0.1, 0.2, 0.3, 0.4]
classes = rng.multinomial(n=1, pvals=probs, size=100).argmax(axis=1)
print(f"Multinomial: distribution = {np.bincount(classes)/len(classes)}")

fan_in, fan_out = 256, 128
xavier = rng.normal(0, np.sqrt(2.0 / (fan_in + fan_out)), size=(fan_in, fan_out))
print(f"Xavier init: mean={xavier.mean():.4f}, std={xavier.std():.4f}")`
  },

  "MLE maximum likelihood": {
    why: "Maximum Likelihood Estimation is why we minimize negative log-likelihood (cross-entropy) as a loss function. Understanding MLE connects probability theory to practical training: every classification loss IS an MLE under some distributional assumption.",
    code: `import numpy as np

rng = np.random.default_rng(42)
data = rng.normal(loc=5.0, scale=2.0, size=1000)

mu_mle = data.mean()
sigma2_mle = np.var(data)
print(f"True: mu=5.0, sigma^2=4.0")
print(f"MLE:  mu={mu_mle:.3f}, sigma^2={sigma2_mle:.3f}")

coins = rng.binomial(1, 0.7, 200)
p_mle = coins.mean()
print(f"Bernoulli MLE: p={p_mle:.3f} (true=0.7)")

def nll_binary(y_true, y_pred_prob):
    eps = 1e-7
    return -np.mean(y_true * np.log(y_pred_prob + eps) +
                    (1 - y_true) * np.log(1 - y_pred_prob + eps))

y_true = rng.binomial(1, 0.8, 100)
y_good = np.clip(rng.normal(0.8, 0.1, 100), 0.01, 0.99)
y_bad = np.clip(rng.normal(0.3, 0.2, 100), 0.01, 0.99)
print(f"NLL (good predictions): {nll_binary(y_true, y_good):.4f}")
print(f"NLL (bad predictions):  {nll_binary(y_true, y_bad):.4f}")`
  },

  "Bayes theorem priors posterior": {
    why: "Bayes theorem is the theoretical foundation of Naive Bayes classifiers, Bayesian optimization, and uncertainty estimation. It explains why prior beliefs plus evidence yield updated beliefs — the mathematical basis for how models should handle new data.",
    code: `import numpy as np

P_spam = 0.3
P_ham = 0.7
P_free_given_spam = 0.8
P_free_given_ham = 0.1

P_free = P_free_given_spam * P_spam + P_free_given_ham * P_ham
P_spam_given_free = (P_free_given_spam * P_spam) / P_free
print(f"P(spam|free) = {P_spam_given_free:.3f}")
print(f"P(ham|free)  = {1-P_spam_given_free:.3f}")

prior_odds = P_spam / P_ham
words = ["free", "winner", "click"]
likelihoods = [0.8/0.1, 0.9/0.05, 0.7/0.15]

odds = prior_odds
for word, lr in zip(words, likelihoods):
    odds *= lr
    prob = odds / (1 + odds)
    print(f"After '{word}': P(spam)={prob:.3f}")

print(f"Final P(spam): {prob:.3f}")`
  },

  "Conditional independence naive bayes assumption": {
    why: "Naive Bayes assumes features are conditionally independent given the class — a simplification that is usually wrong but works surprisingly well for text classification. Understanding when this assumption holds vs fails prevents misapplication.",
    code: `import numpy as np

vocab = {"free": 0, "money": 1, "meeting": 2, "report": 3}
P_word_given_spam = np.array([0.8, 0.7, 0.05, 0.02])
P_word_given_ham  = np.array([0.1, 0.05, 0.6, 0.7])
P_spam, P_ham = 0.3, 0.7

def predict_naive_bayes(email_words):
    log_spam = np.log(P_spam)
    log_ham = np.log(P_ham)
    for word in email_words:
        idx = vocab[word]
        log_spam += np.log(P_word_given_spam[idx])
        log_ham += np.log(P_word_given_ham[idx])
    return 1 / (1 + np.exp(log_ham - log_spam))

print(f"'free money': P(spam)={predict_naive_bayes(['free','money']):.3f}")
print(f"'meeting report': P(spam)={predict_naive_bayes(['meeting','report']):.3f}")
print(f"'free meeting': P(spam)={predict_naive_bayes(['free','meeting']):.3f}")`
  },

  "Expectation variance covariance": {
    why: "Expectation measures average behavior, variance measures spread, and covariance measures how features move together. Covariance matrices are the input to PCA, Mahalanobis distance, and Gaussian distributions — the backbone of many ML algorithms.",
    code: `import numpy as np

rng = np.random.default_rng(42)
height = rng.normal(170, 10, 1000)
weight = 0.8 * height + rng.normal(0, 5, 1000)

print(f"E[height]={height.mean():.1f}, Var[height]={height.var():.1f}")
print(f"E[weight]={weight.mean():.1f}, Var[weight]={weight.var():.1f}")

cov = np.cov(height, weight)
print(f"Covariance matrix:\n{cov.round(1)}")
print(f"Correlation: {cov[0,1] / (np.std(height)*np.std(weight)):.3f}")

X = np.column_stack([height, weight, rng.normal(50, 5, 1000)])
cov_full = np.cov(X.T)
eigvals, eigvecs = np.linalg.eigh(cov_full)
X_white = (X - X.mean(axis=0)) @ eigvecs @ np.diag(1/np.sqrt(eigvals))
print(f"Whitened covariance diag: {np.diag(np.cov(X_white.T)).round(2)}")`
  },

  "Central limit theorem": {
    why: "The CLT explains why means of samples follow a normal distribution regardless of the original distribution. This justifies confidence intervals, A/B test statistics, and why batch normalization works — understanding it prevents misinterpreting statistical tests.",
    code: `import numpy as np

rng = np.random.default_rng(42)
data = rng.exponential(scale=2.0, size=100000)
print(f"Original: mean={data.mean():.3f}")

for n in [1, 5, 30, 100]:
    means = [rng.exponential(2.0, n).mean() for _ in range(5000)]
    mean_of_means = np.mean(means)
    std_of_means = np.std(means)
    theoretical = 2.0 / np.sqrt(n)
    print(f"n={n:3d}: mean={mean_of_means:.3f}, std={std_of_means:.3f}, "
          f"theoretical sigma/sqrt(n)={theoretical:.3f}")

print("Sample means approach normal even though original is exponential!")`
  },

  "Confidence intervals vs p-values": {
    why: "Confidence intervals quantify estimation uncertainty; p-values measure evidence against null hypotheses. Misinterpreting these leads to wrong business decisions — p<0.05 does not mean important, and wide confidence intervals mean not enough data.",
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(42)
data = rng.normal(loc=50, scale=10, size=100)
n = len(data)
mean = data.mean()
se = data.std(ddof=1) / np.sqrt(n)
ci_95 = (mean - 1.96*se, mean + 1.96*se)
print(f"Mean: {mean:.2f}, 95% CI: ({ci_95[0]:.2f}, {ci_95[1]:.2f})")

control = rng.normal(100, 15, 200)
treatment = rng.normal(103, 15, 200)
diff = treatment.mean() - control.mean()
pooled_se = np.sqrt(control.var(ddof=1)/len(control) + treatment.var(ddof=1)/len(treatment))
t_stat = diff / pooled_se
p_value = 2 * (1 - stats.norm.cdf(abs(t_stat)))
print(f"Diff: {diff:.2f}, t-stat: {t_stat:.3f}, p-value: {p_value:.4f}")
print(f"95% CI for difference: ({diff-1.96*pooled_se:.2f}, {diff+1.96*pooled_se:.2f})")`
  },

  "Hypothesis testing type I/II errors": {
    why: "Type I error (false positive) wastes resources on non-existent effects. Type II error (false negative) misses real opportunities. Understanding the tradeoff — via power analysis — determines how much data your A/B test or model evaluation needs.",
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(42)

def simulate_errors(true_effect=0, n=100, alpha=0.05, n_trials=10000):
    type_I = 0
    for _ in range(n_trials):
        control = rng.normal(100, 15, n)
        treatment = rng.normal(100 + true_effect, 15, n)
        _, p = stats.ttest_ind(control, treatment)
        if p < alpha:
            type_I += 1
    return type_I / n_trials

false_pos_rate = simulate_errors(true_effect=0)
print(f"False positive rate (should be ~0.05): {false_pos_rate:.4f}")

for effect in [0, 2, 5, 10]:
    for n in [30, 100, 300]:
        power = simulate_errors(true_effect=effect, n=n)
        print(f"  effect={effect:2d}, n={n:3d}: power={power:.3f}")

z_025, z_020 = stats.norm.ppf(0.975), stats.norm.ppf(0.8)
n_needed = ((z_025 + z_020) * 2 * 15**2 / 3**2)
print(f"\nNeed ~{int(n_needed)} per group to detect effect=3 with 80% power")`
  },

  // ──────────────────────────────────────────────
  //  CLASSICAL MACHINE LEARNING
  // ──────────────────────────────────────────────

  "Train/val/test split stratification": {
    why: "A bad split leaks information between train and test, making your evaluation meaningless. Stratification preserves class distribution in each split.",
    code: `import numpy as np
from collections import Counter

rng = np.random.default_rng(42)
y = np.array([0]*90 + [1]*10)
X = rng.randn(len(y), 5)

indices = rng.permutation(len(y))
split = int(0.8 * len(y))
y_test_random = y[indices[split:]]
print(f"Random split test distribution: {Counter(y_test_random)}")

def stratified_split(X, y, test_ratio=0.2):
    classes = np.unique(y)
    train_idx, test_idx = [], []
    for c in classes:
        idx = np.where(y == c)[0]
        rng.shuffle(idx)
        n_test = max(1, int(len(idx) * test_ratio))
        test_idx.extend(idx[:n_test])
        train_idx.extend(idx[n_test:])
    return np.array(train_idx), np.array(test_idx)

train_idx, test_idx = stratified_split(X, y)
print(f"Stratified train: {Counter(y[train_idx])}")
print(f"Stratified test:  {Counter(y[test_idx])}")`
  },

  "K-fold cross-validation": {
    why: "A single train/test split gives a noisy estimate of model performance. K-fold CV gives robust estimates by training on K-1 folds and testing on 1, rotating K times.",
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

X, y = make_classification(n_samples=200, n_features=10, n_informative=5, random_state=42)
model = LogisticRegression(max_iter=1000)
kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kfold, scoring='accuracy')
print(f"5-Fold CV scores: {scores.round(3)}")
print(f"Mean: {scores.mean():.3f} +/- {scores.std():.3f}")`
  },

  "Data leakage": {
    why: "Data leakage occurs when test information contaminates training. The most common form: fitting scalers on the full dataset instead of training data only.",
    code: `import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
X = rng.randn(200, 5)
y = (X[:, 0] + X[:, 1] > 0).astype(int)
X_train, X_test, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

scaler_leak = StandardScaler()
X_all_scaled = scaler_leak.fit_transform(X)
model_leak = LogisticRegression(max_iter=1000).fit(X_all_scaled[:len(X_train)], y_tr)
acc_leak = model_leak.score(X_all_scaled[len(X_train):], y_te)

scaler_safe = StandardScaler()
X_train_scaled = scaler_safe.fit_transform(X_train)
X_test_scaled = scaler_safe.transform(X_test)
model_safe = LogisticRegression(max_iter=1000).fit(X_train_scaled, y_tr)
acc_safe = model_safe.score(X_test_scaled, y_te)

print(f"Leaked scaler accuracy:    {acc_leak:.3f} (inflated!)")
print(f"Correct scaler accuracy:   {acc_safe:.3f} (honest)")`
  },

  "Feature scaling standard/minmax": {
    why: "Distance-based algorithms are destroyed by unscaled features. A feature with range [0, 10000] dominates one with range [0, 1]. Scaling puts features on equal footing.",
    code: `import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

rng = np.random.default_rng(42)
salary = rng.normal(50000, 15000, 100)
age = rng.normal(35, 10, 100)
score = rng.uniform(0, 1, 100)
X = np.column_stack([salary, age, score])

print("Raw ranges:")
for i, name in enumerate(["salary", "age", "score"]):
    print(f"  {name:8s}: [{X[:,i].min():.1f}, {X[:,i].max():.1f}]")

std = StandardScaler()
X_std = std.fit_transform(X)
print("StandardScaler (z-score):")
for i, name in enumerate(["salary", "age", "score"]):
    print(f"  {name:8s}: mean={X_std[:,i].mean():.3f}, std={X_std[:,i].std():.3f}")`
  },

  "Encoding categorical one-hot/target/frequency": {
    why: "ML models require numeric input, but categorical features are strings. Wrong encoding inflates cardinality, introduces false ordinality, or causes data leakage.",
    code: `import pandas as pd

df = pd.DataFrame({
    'color': ['red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'red'],
    'size': ['S', 'M', 'L', 'XL', 'M', 'S', 'L', 'M'],
    'price': [10, 20, 30, 15, 25, 12, 28, 22]
})

one_hot = pd.get_dummies(df['color'], prefix='color')
print("One-hot encoding:")
print(one_hot)

freq = df['color'].value_counts(normalize=True)
print(f"\nFrequency encoding: {dict(freq.round(3))}")

ordinal = {'S': 0, 'M': 1, 'L': 2, 'XL': 3}
df['size_ordinal'] = df['size'].map(ordinal)
print(f"Ordinal encoding: {dict(df[['size','size_ordinal']].drop_duplicates().set_index('size')['size_ordinal'])}")`
  },

  "Missing values imputation mean/median/KNN/MICE": {
    why: "Most ML algorithms cannot handle missing values. Choosing the right imputation strategy preserves signal instead of destroying it.",
    code: `import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer

rng = np.random.default_rng(42)
X = rng.normal(50, 10, (100, 4))
mask = rng.random(X.shape) < 0.1
X_missing = np.where(mask, np.nan, X)
print(f"Missing values: {np.isnan(X_missing).sum()} / {X_missing.size}")

imp_mean = SimpleImputer(strategy='mean')
X_mean = imp_mean.fit_transform(X_missing)

imp_median = SimpleImputer(strategy='median')
X_median = imp_median.fit_transform(X_missing)

imp_knn = KNNImputer(n_neighbors=5)
X_knn = imp_knn.fit_transform(X_missing)

for name, X_imp in [("mean", X_mean), ("median", X_median), ("KNN", X_knn)]:
    mse = np.mean((X_imp[mask] - X[mask])**2)
    print(f"{name:8s} imputation MSE: {mse:.4f}")`
  },

  "Outliers IQR/z-score/isolation forest": {
    why: "Outliers distort model training: they inflate variance, shift means, and confuse distance-based algorithms. Detection method choice depends on whether outliers are errors or signal.",
    code: `import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(42)
data = np.concatenate([rng.normal(50, 5, 200), [100, 110, -20]])

Q1, Q3 = np.percentile(data, [25, 75])
IQR = Q3 - Q1
lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR
iqr_outliers = data[(data < lower) | (data > upper)]
print(f"IQR outliers ({len(iqr_outliers)}): {iqr_outliers.round(1)}")

z_scores = np.abs((data - data.mean()) / data.std())
z_outliers = data[z_scores > 3]
print(f"Z-score outliers ({len(z_outliers)}): {z_outliers.round(1)}")

X = rng.normal(0, 1, (200, 3))
X = np.vstack([X, [[10, 10, 10], [-10, -10, -10]]])
iso = IsolationForest(contamination=0.05, random_state=42)
labels = iso.fit_predict(X)
print(f"Isolation Forest found {np.sum(labels == -1)} anomalies")`
  },

  "Feature engineering interactions/polynomials/date parts": {
    why: "Raw features often miss important patterns. Interaction features capture relationships, polynomial features capture non-linearity, and date parts capture seasonality.",
    code: `import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures

rng = np.random.default_rng(42)
price = rng.uniform(10, 100, 50)
quantity = rng.randint(1, 10, 50)

X = np.column_stack([price, quantity])
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
X_interact = poly.fit_transform(X)
print(f"Original: {X.shape[1]}, With interactions: {X_interact.shape[1]}")
print(f"Feature names: {poly.get_feature_names_out()}")

dates = pd.date_range('2024-01-01', periods=7, freq='D')
df = pd.DataFrame({'date': dates})
df['dayofweek'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
print(df[['date','dayofweek','month','is_weekend']].to_string(index=False))`
  },

  "Curse of dimensionality": {
    why: "As dimensions increase, data becomes exponentially sparse and all points appear equidistant. This destroys distance-based methods and makes generalization nearly impossible.",
    code: `import numpy as np
from scipy.special import gamma

rng = np.random.default_rng(42)
for d in [2, 10, 50, 200, 1000]:
    points = rng.random((1000, d))
    dists = np.sqrt(((points[:, None] - points[None, :]) ** 2).sum(axis=2))
    upper = dists[np.triu_indices(1000, k=1)]
    ratio = upper.max() / upper.min()
    print(f"d={d:4d}: max/min distance ratio = {ratio:.3f}")

def hypersphere_volume(d, r=1.0):
    return (np.pi ** (d/2) / gamma(d/2 + 1)) * r**d

print("\nVolume of unit hypersphere:")
for d in [2, 10, 50, 100]:
    print(f"  d={d:3d}: {hypersphere_volume(d):.2e}")`
  },

  "Linear regression closed form OLS": {
    why: "Linear regression is the foundation of all ML. Its closed-form solution reveals why features must be non-collinear and why regularization is needed.",
    code: `import numpy as np
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(42)
X = rng.randn(100, 2)
y = 3*X[:, 0] - 2*X[:, 1] + 5 + rng.randn(100) * 0.5

X_aug = np.column_stack([np.ones(100), X])
w_ols = np.linalg.inv(X_aug.T @ X_aug) @ X_aug.T @ y
print(f"True coefficients: [5.0, 3.0, -2.0]")
print(f"OLS coefficients:  {w_ols.round(4)}")

model = LinearRegression().fit(X, y)
print(f"sklearn:            [{model.intercept_:.4f}, {model.coef_[0]:.4f}, {model.coef_[1]:.4f}]")`
  },

  "Ridge L2 / Lasso L1": {
    why: "Ridge shrinks weights toward zero but keeps all features; Lasso drives some to exactly zero (feature selection). Without regularization, linear models overfit noise.",
    code: `import numpy as np
from sklearn.linear_model import Ridge, Lasso, LinearRegression

rng = np.random.default_rng(42)
X = rng.randn(100, 20)
true_coefs = np.zeros(20)
true_coefs[:3] = [5, -3, 2]
y = X @ true_coefs + rng.randn(100) * 0.5

ols = LinearRegression().fit(X, y)
ridge = Ridge(alpha=1.0).fit(X, y)
lasso = Lasso(alpha=0.1).fit(X, y)

print(f"True top 3: {true_coefs[:3]}")
print(f"OLS top 3:  {ols.coef_[:3].round(2)}")
print(f"Ridge top 3: {ridge.coef_[:3].round(2)}")
print(f"Lasso top 3: {lasso.coef_[:3].round(2)}")`
  },

  "Logistic regression sigmoid": {
    why: "Logistic regression maps any real number to a probability via the sigmoid function. Understanding it reveals why log-loss works and why it is the baseline for every classification task.",
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=500, n_features=5, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

print(f"sigmoid(0)={sigmoid(0):.3f}, sigmoid(2)={sigmoid(2):.3f}")

model = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
print(f"Accuracy: {accuracy_score(y_te, model.predict(X_te)):.3f}")
print(f"Confident correct (0.99, label=1): -log(0.99)={-np.log(0.99):.4f}")
print(f"Confident wrong  (0.99, label=0): -log(0.01)={-np.log(0.01):.4f}")`
  },

  "k-NN lazy learner": {
    why: "k-Nearest Neighbors stores all training data and classifies by majority vote. It is simple, requires no training, and works as a baseline — but degrades without scaling.",
    code: `import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=300, n_features=2, n_redundant=0, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

scaler = StandardScaler()
X_tr_s = scaler.fit_transform(X_tr)
X_te_s = scaler.transform(X_te)

for k in [1, 3, 5, 15, 50]:
    knn = KNeighborsClassifier(n_neighbors=k).fit(X_tr_s, y_tr)
    print(f"k={k:2d}: accuracy={accuracy_score(y_te, knn.predict(X_te_s)):.3f}")`
  },

  "Decision trees Gini/entropy splits": {
    why: "Decision trees are the foundation of Random Forests and Gradient Boosting. Understanding split criteria and tree depth explains why ensembles work.",
    code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=500, n_features=10, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

tree_shallow = DecisionTreeClassifier(max_depth=3, random_state=42).fit(X_tr, y_tr)
tree_deep = DecisionTreeClassifier(max_depth=None, random_state=42).fit(X_tr, y_tr)

print(f"Shallow (depth=3): test={accuracy_score(y_te, tree_shallow.predict(X_te)):.3f}")
print(f"Deep: train={accuracy_score(y_tr, tree_deep.predict(X_tr)):.3f}, "
      f"test={accuracy_score(y_te, tree_deep.predict(X_te)):.3f} <- overfitting")`
  },

  "Random Forest bagging+feature subspace": {
    why: "Random Forests combine bagging with random feature subspaces to create diverse trees. They rarely overfit and provide feature importance — the go-to baseline for tabular data.",
    code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier, DecisionTreeClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=500, n_features=20, n_informative=10, random_state=42)

tree = DecisionTreeClassifier(random_state=42)
print(f"Single tree:   {cross_val_score(tree, X, y, cv=5).mean():.3f}")

rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42)
print(f"Random Forest: {cross_val_score(rf, X, y, cv=5).mean():.3f}")`
  },

  "Gradient Boosting XGBoost/LightGBM/CatBoost": {
    why: "Gradient Boosting is the state-of-the-art for tabular data — it builds trees sequentially, each correcting the previous one's errors.",
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=2000, n_features=20, n_informative=10, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb.fit(X_tr, y_tr)
print(f"Accuracy: {accuracy_score(y_te, gb.predict(X_te)):.3f}")

train_scores = [accuracy_score(y_te, yp) for yp in gb.staged_predict(X_te)]
print(f"After 10 trees: {train_scores[9]:.3f}")
print(f"After 50 trees: {train_scores[49]:.3f}")
print(f"After 100: {train_scores[99]:.3f}")`
  },

  "SVM margins kernels RBF": {
    why: "SVMs find the maximum-margin hyperplane. The kernel trick maps data to higher dimensions where linear separation becomes possible.",
    code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_moons(n_samples=200, noise=0.2, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)
scaler = StandardScaler()
X_tr_s, X_te_s = scaler.fit_transform(X_tr), scaler.transform(X_te)

print(f"Linear: {accuracy_score(y_te, SVC(kernel='linear').fit(X_tr_s, y_tr).predict(X_te_s)):.3f}")
print(f"RBF:    {accuracy_score(y_te, SVC(kernel='rbf', gamma='scale').fit(X_tr_s, y_tr).predict(X_te_s)):.3f}")

for gamma in [0.1, 1.0, 10.0]:
    svm = SVC(kernel='rbf', gamma=gamma).fit(X_tr_s, y_tr)
    print(f"gamma={gamma:4.1f}: train={accuracy_score(y_tr, svm.predict(X_tr_s)):.3f}, "
          f"test={accuracy_score(y_te, svm.predict(X_te_s)):.3f}")`
  },

  "Naive Bayes multinomial": {
    why: "Multinomial Naive Bayes is the fastest text classification baseline. Despite the independence assumption being wrong, it works surprisingly well for spam filtering and document categorization.",
    code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

texts = ["buy cheap viagra now", "claim your free prize", "meeting agenda monday",
         "quarterly report attached", "win lottery click here", "team lunch tomorrow"]
labels = np.array([1,1,0,0,1,0])

pipe = Pipeline([('vec', CountVectorizer()), ('nb', MultinomialNB(alpha=1.0))])
pipe.fit(texts, labels)
test = ["free money claim now", "project meeting tomorrow"]
probs = pipe.predict_proba(test)
for t, p in zip(test, probs):
    print(f"'{t}' -> P(spam)={p[1]:.3f}")`
  },

  "MLP on tabular": {
    why: "Multi-Layer Perceptrons on tabular data can capture non-linear interactions. While tree models usually win, MLPs with embedding layers for categoricals are gaining ground.",
    code: `import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=1000, n_features=20, n_informative=10, n_classes=3, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
X_tr_s = StandardScaler().fit_transform(X_tr)
X_te_s = StandardScaler().fit_transform(X_te)

for layers in [(32,), (64, 32), (128, 64, 32)]:
    mlp = MLPClassifier(hidden_layer_sizes=layers, max_iter=500, random_state=42, early_stopping=True).fit(X_tr_s, y_tr)
    print(f"Layers {str(layers):20s}: {accuracy_score(y_te, mlp.predict(X_te_s)):.3f}")`
  },

  "k-means Lloyd inertia elbow/silhouette k choice": {
    why: "k-Means assigns points to the nearest centroid, but choosing k is critical. The elbow method and silhouette score provide data-driven k selection.",
    code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)
print("k | Inertia | Silhouette")
for k in range(2, 10):
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X)
    print(f"{k} | {km.inertia_:8.1f} | {silhouette_score(X, labels):.3f}")`
  },

  "DBSCAN density clusters noise handling": {
    why: "DBSCAN finds arbitrarily-shaped clusters and identifies noise points, unlike k-means which forces spherical clusters.",
    code: `import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons

X_moons, _ = make_moons(n_samples=300, noise=0.1, random_state=42)
db = DBSCAN(eps=0.2, min_samples=5)
labels = db.fit_predict(X_moons)
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
print(f"Moons: {n_clusters} clusters, {(labels == -1).sum()} noise points")

for eps in [0.3, 0.5, 0.8]:
    db = DBSCAN(eps=eps, min_samples=5).fit(X_moons)
    nc = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
    print(f"  eps={eps}: {nc} clusters, {(db.labels_ == -1).sum()} noise")`
  },

  "Hierarchical agglomerative dendrogram cuts": {
    why: "Agglomerative hierarchical clustering builds a tree of nested clusters. Cutting at different heights yields different cluster counts.",
    code: `import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs
from scipy.cluster.hierarchy import linkage

X, _ = make_blobs(n_samples=150, centers=4, random_state=42)
Z = linkage(X, method='ward')
print(f"Linkage matrix shape: {Z.shape}")

for n_clusters in [2, 3, 4, 5]:
    agg = AgglomerativeClustering(n_clusters=n_clusters)
    labels = agg.fit_predict(X)
    print(f"  k={n_clusters}: sizes={np.bincount(labels)}")`
  },

  "GMM EM soft assignments": {
    why: "Gaussian Mixture Models assign soft probabilities — a point can be 70% cluster A, 30% cluster B. Essential for density estimation and probabilistic clustering.",
    code: `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=300, centers=3, cluster_std=[1.0, 1.5, 0.5], random_state=42)
gmm = GaussianMixture(n_components=3, covariance_type='full', random_state=42).fit(X)
probs = gmm.predict_proba(X[:5])
print("Soft assignments (first 5):")
for i, p in enumerate(probs):
    print(f"  Point {i}: {p.round(3)}  -> hard={np.argmax(p)}")

for k in range(1, 7):
    g = GaussianMixture(n_components=k, random_state=42).fit(X)
    print(f"k={k}: BIC={g.bic(X):.1f}")`
  },

  "PCA variance directions explained_ratio_": {
    why: "PCA finds directions of maximum variance, enabling dimensionality reduction that preserves the most information.",
    code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

data = load_iris()
X = data.data
pca = PCA().fit(X)
print(f"Explained variance ratio: {pca.explained_variance_ratio_.round(3)}")
print(f"Cumulative:              {np.cumsum(pca.explained_variance_ratio_).round(3)}")

pca_95 = PCA(n_components=0.95).fit(X)
X_reduced = pca_95.transform(X)
print(f"\n95% variance -> {X_reduced.shape[1]} components")`
  },

  "t-SNE/UMAP visualization": {
    why: "t-SNE and UMAP project high-dimensional data to 2D/3D for visualization, revealing cluster structure invisible in raw feature space.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score

digits = load_digits()
X, y = digits.data, digits.target
X_pca = PCA(n_components=50, random_state=42).fit_transform(X)
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_pca)
print(f"t-SNE silhouette score: {silhouette_score(X_tsne, y):.3f}")`
  },

  "Anomaly detection LOF/autoencoders": {
    why: "Anomaly detection identifies rare observations that deviate from normal patterns — fraud, defects, intrusions.",
    code: `import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor

rng = np.random.default_rng(42)
normal = rng.normal(0, 1, (500, 2))
anomalies = rng.uniform(-8, 8, (20, 2))
X = np.vstack([normal, anomalies])
y_true = np.array([0]*500 + [1]*20)

lof = LocalOutlierFactor(n_neighbors=20, contamination=0.04)
y_lof = np.where(lof.fit_predict(X) == -1, 1, 0)
tp = ((y_lof == 1) & (y_true == 1)).sum()
print(f"LOF: precision={tp/max(y_lof.sum(),1):.2f}, recall={tp/y_true.sum():.2f}")

iso = IsolationForest(contamination=0.04, random_state=42)
y_iso = np.where(iso.fit_predict(X) == -1, 1, 0)
tp = ((y_iso == 1) & (y_true == 1)).sum()
print(f"IsoForest: precision={tp/max(y_iso.sum(),1):.2f}, recall={tp/y_true.sum():.2f}")`
  },

  "Classification report precision/recall/F1 meaning": {
    why: "Accuracy alone is misleading on imbalanced data. Precision tells you of predicted positives how many are real. Recall tells you of real positives how many were caught.",
    code: `import numpy as np
from sklearn.metrics import classification_report, confusion_matrix

y_true = np.array([0]*90 + [1]*10)
y_pred = np.array([0]*88 + [1]*2 + [0]*2 + [1]*8)
print(confusion_matrix(y_true, y_pred))
print(classification_report(y_true, y_pred, target_names=['Normal','Fraud']))`
  },

  "ROC-AUC vs PR-AUC": {
    why: "ROC-AUC is misleading on imbalanced data. PR-AUC focuses on the minority class and reveals true performance.",
    code: `import numpy as np
from sklearn.metrics import roc_auc_score, average_precision_score

np.random.seed(42)
y_true = np.array([0]*950 + [1]*50)
y_good = np.where(y_true==1, 0.8+np.random.randn(50)*0.15, 0.3+np.random.randn(950)*0.2)
y_bad = np.full(1000, 0.05+np.random.randn(1000)*0.01)

print(f"Good: ROC-AUC={roc_auc_score(y_true, y_good):.3f}, PR-AUC={average_precision_score(y_true, y_good):.3f}")
print(f"Bad:  ROC-AUC={roc_auc_score(y_true, y_bad):.3f}, PR-AUC={average_precision_score(y_true, y_bad):.3f}")`
  },

  "Confusion matrix FP/FN cost asymmetry": {
    why: "A confusion matrix reveals exactly where your model makes mistakes. Different domains have wildly different cost structures for FP vs FN.",
    code: `import numpy as np
from sklearn.metrics import confusion_matrix

y_true = np.array([0]*180 + [1]*20)
y_pred = np.array([0]*170 + [1]*10 + [0]*5 + [1]*15)
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

costs = {'TN': 0, 'FP': 100, 'FN': 50000, 'TP': 5000}
total = sum({'TN': tn, 'FP': fp, 'FN': fn, 'TP': tp}[k] * v for k, v in costs.items())
print(f"TN={tn}, FP={fp}, FN={fn}, TP={tp}")
print(f"Total cost: \${total:,}")`
  },

  "Threshold tuning": {
    why: "The default 0.5 decision threshold is rarely optimal. Threshold tuning directly impacts business outcomes.",
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=500, weights=[0.9, 0.1], random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)
model = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
probs = model.predict_proba(X_te)[:, 1]

for t in [0.1, 0.2, 0.3, 0.5, 0.7, 0.9]:
    preds = (probs >= t).astype(int)
    tp = ((preds==1)&(y_te==1)).sum()
    fp = ((preds==1)&(y_te==0)).sum()
    fn = ((preds==0)&(y_te==1)).sum()
    p = tp/max(tp+fp,1); r = tp/max(tp+fn,1)
    f1 = 2*p*r/(p+r+1e-10)
    print(f"t={t:.1f}: P={p:.3f} R={r:.3f} F1={f1:.3f}")`
  },

  "SMOTE/class weights/focal loss": {
    why: "Class imbalance causes models to ignore the minority class. SMOTE synthesizes samples, class weights penalize minority misclassification, focal loss down-weights easy examples.",
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

X, y = make_classification(n_samples=1000, weights=[0.95, 0.05], n_informative=10, random_state=42)

model_default = LogisticRegression(max_iter=1000).fit(X, y)
y_pred = model_default.predict(X)
print(f"Default:   F1={f1_score(y, y_pred):.3f}")

model_weighted = LogisticRegression(class_weight='balanced', max_iter=1000).fit(X, y)
y_pred = model_weighted.predict(X)
print(f"Balanced:  F1={f1_score(y, y_pred):.3f}")`
  },

  "Regression metrics MAE/RMSE/R²/MAPE": {
    why: "Regression evaluation requires understanding error metrics. MAE is robust to outliers, RMSE penalizes large errors, R² measures variance explained.",
    code: `import numpy as np

y_true = np.array([100, 200, 150, 300, 250, 180])
y_pred = np.array([105, 195, 170, 280, 260, 175])

mae = np.mean(np.abs(y_true - y_pred))
rmse = np.sqrt(np.mean((y_true - y_pred)**2))
r2 = 1 - np.sum((y_true-y_pred)**2) / np.sum((y_true-y_true.mean())**2)
mape = np.mean(np.abs((y_true-y_pred)/y_true))*100

print(f"MAE:  {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R^2:  {r2:.3f}")print(f"MAPE: {mape:.1f}%")`
  },

