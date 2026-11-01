/**
 * ML Fundamentals -- Rich Educational Content
 * Includes mortalapps.com content + diagrams + layman examples + code
 */

const ML_FUNDAMENTALS = [
  // ═══════════════════════════════════════════════════════════
  // 1. GRADIENT DESCENT AND LEARNING RATE
  // ═══════════════════════════════════════════════════════════
  {
    id: "gradient-descent",
    title: "Gradient Descent and Learning Rate",
    category: "ML Fundamentals",
    readTime: "6 min read",
    icon: "📉",
    color: "#f59e0b",
    tldr: "Gradient Descent is an iterative optimization algorithm used to minimize a model's cost function by adjusting parameters in the direction of the steepest descent. The learning rate is a critical hyperparameter that dictates the size of the steps taken during each iteration. Too high a learning rate causes divergence; too low leads to agonizingly slow convergence or getting stuck in local minima. Modern variants like Adam or RMSprop adapt the learning rate dynamically.",
    
    whyItMatters: [
      { title: "Large Language Models", desc: "Gradient Descent is the backbone of training LLMs like those from OpenAI or Google. With billions of parameters, optimizers such as Adam navigate a high-dimensional space to minimise cross-entropy loss. Without efficient gradient-based methods, training these models would be computationally impossible.", icon: "🤖" },
      { title: "Financial Risk Modelling", desc: "Companies like JPMorgan Chase use gradient-based optimization for algorithmic trading and risk assessment. Gradient descent refines predictive models against historical market data, with careful learning rate tuning ensuring models adapt to changing conditions without overfitting to noise.", icon: "💰" },
      { title: "Diagnostic Imaging", desc: "Healthcare models from Siemens Healthineers use gradient descent to train CNNs that identify anomalies in X-rays and MRIs. Careful learning rate tuning ensures the model generalises well to new patients rather than memorising training images.", icon: "🏥" }
    ],

    diagrams: [
      {
        title: "Mountain Descent Analogy",
        ascii: `
    COST
     ▲
     │    ╱╲
     │   ╱  ╲        ╱╲
     │  ╱    ╲      ╱  ╲
     │ ╱      ╲    ╱    ╲
     │╱   ●→   ╲  ╱   ●→ ╲       ● = Current position
     ╱    LR=0.3╲╱   LR=0.01╲      → = Step direction
    ╱            ╲╱            ╲    LR = Learning Rate
   ╱──────────────────────────────▶ PARAMETERS
   LOW LR                  HIGH LR
   (slow, precise)         (fast, risky)
        `,
        explanation: "Like standing on a foggy mountain -- you can only feel the slope beneath your feet. Each step follows the steepest downhill direction. The learning rate controls step size."
      },
      {
        title: "Learning Rate Effects",
        ascii: `
    LOSS
     ▲
     │ ╲    Too High     Correct        Too Low
     │  ╲   (diverges)   (converges)    (very slow)
     │   ╲               ╱╲
     │    ╲             ╱  ╲╲
     │     ╲           ╱    ╲╲
     │      ╲         ╱      ╲╲_______
     │       ╲       ╱
     │        ╲     ╱
     │         ╲   ╱
     │          ╲ ╱
     │           V (oscillates forever)
     └──────────────────────────────────▶ EPOCHS
        `,
        explanation: "Learning rate too high: bounces around, never settles. Just right: smoothly reaches the bottom. Too low: takes forever, may get stuck."
      }
    ],

    laymanExample: {
      title: "🏔️ The Mountain Climber Analogy",
      content: `Imagine you're blindfolded on a mountain and need to reach the valley floor. You can\'t see the bottom, but you can feel which way slopes downward. What do you do?

**Step 1:** Feel the ground -- which direction goes downhill?
**Step 2:** Take a step in that direction
**Step 3:** Stop, feel the ground again
**Step 4:** Repeat until you reach the bottom

The **size of your step** is the learning rate:
- **Big steps** (LR = 0.5): You'll move fast but might overshoot the valley and end up on the other side!
- **Tiny steps** (LR = 0.0001): You'll be precise but it takes forever to reach the bottom
- **Just right** (LR = 0.01): You'll reach the bottom efficiently

**Real-world example:** Training a spam filter. The model starts knowing nothing. Each email it processes, it adjusts its "judgment weights" slightly. If it misclassifies a spam email as safe, the gradient says "increase the spam score for words like 'free' and 'winner'." The learning rate determines how much to increase it.`,
      realWorld: "A self-driving car's vision system uses gradient descent to learn what pedestrians look like. Each training batch adjusts millions of pixel weights. If the learning rate is too high, the car might 'unlearn' what a pedestrian looks like. Too low, and training takes weeks instead of hours."
    },

    howItWorks: [
      {
        title: "The Mountain Descent Analogy",
        content: "Imagine you are standing on top of a foggy mountain range, and your goal is to reach the lowest point of the valley. Because of the thick fog, you cannot see the path ahead. However, you can feel the slope of the ground beneath your feet. The most logical strategy is to feel the direction of the steepest downward slope and take a step in that direction. After each step, you pause, re-evaluate the slope, and take another step."
      },
      {
        title: "The Mechanics of Optimization",
        content: "Gradient Descent works by iteratively updating model parameters to minimize the error. We start with random weights and calculate the gradient -- the direction that increases the error the fastest. By taking a step in the opposite direction (the negative gradient), we move toward lower error. The size of this step is crucial. If the step is too large, we might overshoot the valley floor. If too small, we take an eternity to reach the bottom."
      },
      {
        title: "Challenges in High-Dimensional Landscapes",
        content: "In real-world ML, we deal with thousands or millions of dimensions. The landscape of a deep neural network is incredibly complex, filled with plateaus, narrow canyons, and saddle points. A saddle point is where the gradient is zero but it's not a minimum. This is why we use momentum -- it helps the optimizer 'roll' through flat regions by accumulating velocity from previous steps."
      }
    ],

    pitfalls: [
      '"Gradient descent always finds the global minimum." -- False. It is a local optimizer. In non-convex landscapes it can get stuck in a local minimum or saddle point, which is why techniques like random restarts or momentum are used.',
      '"A smaller learning rate is always better." -- Not true. Too small and the model trains agonizingly slowly and may get stuck in a local minimum that a larger step could have jumped over.',
      '"The gradient is the same as the cost." -- The gradient is the derivative of the cost function. The cost tells you how bad the model is; the gradient tells you how to change parameters to improve it.',
      '"You only need to set the learning rate once." -- Modern practice uses learning rate schedulers that reduce the rate over time -- large steps early, fine-tuning near convergence.'
    ],

    codeExamples: [
      {
        title: "Gradient Descent on Linear Regression (NumPy)",
        language: "Python",
        code: `import numpy as np

# Data: y = 4 + 3x (intercept=4, slope=3)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# Parameters
theta = np.random.randn(2, 1)  # Random initialization
learning_rate = 0.1
iterations = 1000
m = len(X)

# Add bias term (x0 = 1)
X_b = np.c_[np.ones((100, 1)), X]

for iteration in range(iterations):
    gradients = 2/m * X_b.T.dot(X_b.dot(theta) - y)
    theta = theta - learning_rate * gradients

print(f"Final parameters: {theta.flatten()}")
# Output: Final parameters: [4.023, 2.981] (approximate)`
      },
      {
        title: "SGD vs Mini-Batch vs Batch Comparison",
        language: "Python",
        code: `import numpy as np

# Compare three variants of gradient descent
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)
X_b = np.c_[np.ones((100, 1)), X]

def train(mode, lr=0.1, epochs=50):
    theta = np.random.randn(2, 1)
    for epoch in range(epochs):
        if mode == 'batch':
            gradients = 2/100 * X_b.T.dot(X_b.dot(theta) - y)
        elif mode == 'sgd':
            idx = np.random.randint(100)
            xi, yi = X_b[idx:idx+1], y[idx:idx+1]
            gradients = 2 * xi.T.dot(xi.dot(theta) - yi)
        else:  # mini-batch
            idx = np.random.choice(100, 20, replace=False)
            xi, yi = X_b[idx], y[idx]
            gradients = 2/20 * xi.T.dot(xi.dot(theta) - yi)
        theta = theta - lr * gradients
    return theta.flatten()

print("Batch:       ", train('batch'))
print("Mini-batch:  ", train('mini'))
print("SGD:         ", train('sgd'))
# All converge to approximately [4, 3]`
      },
      {
        title: "Learning Rate Scheduler Demo",
        language: "Python",
        code: `import torch
import torch.optim as optim

model = torch.nn.Linear(10, 1)
optimizer = optim.SGD(model.parameters(), lr=0.1)

# StepLR: multiply LR by gamma every step_size epochs
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)

for epoch in range(30):
    optimizer.zero_grad()
    output = model(torch.randn(1, 10))
    loss = torch.nn.functional.mse_loss(output, torch.randn(1, 1))
    loss.backward()
    optimizer.step()
    scheduler.step()
    
    if epoch % 5 == 0:
        print(f"Epoch {epoch:2d} | LR: {optimizer.param_groups[0]['lr']:.4f}")

# Output:
# Epoch  0 | LR: 0.1000
# Epoch  5 | LR: 0.1000
# Epoch 10 | LR: 0.0500
# Epoch 15 | LR: 0.0500
# Epoch 20 | LR: 0.0250
# Epoch 25 | LR: 0.0250`
      }
    ],

    keyTerms: [
      { term: "Cost Function", definition: "A formula that quantifies the error between the model's predictions and actual targets -- the 'objective' the optimizer seeks to minimize." },
      { term: "Gradient", definition: "A vector of partial derivatives pointing in the direction of steepest increase. We move in the negative direction to reduce the cost function." },
      { term: "Learning Rate", definition: "A scalar hyperparameter controlling how much we adjust model weights with respect to the gradient -- the 'step size' per iteration." },
      { term: "Convergence", definition: "The state where the cost function is no longer decreasing significantly and model parameters are considered optimized." },
      { term: "Local Minima", definition: "A point lower than all surrounding points but not the absolute lowest. Gradient descent can get trapped here." },
      { term: "Hyperparameter", definition: "A configuration value external to the model that must be set before training begins, such as the learning rate or batch size." },
      { term: "Epoch", definition: "One complete pass through the entire training dataset. Multiple epochs are usually required for the model to learn effectively." }
    ],

    relatedConcepts: ["Backpropagation", "Adam Optimizer", "Learning Rate Scheduling", "Stochastic Gradient Descent", "Momentum"]
  },

  // ═══════════════════════════════════════════════════════════
  // 2. BINARY CLASSIFICATION
  // ═══════════════════════════════════════════════════════════
  {
    id: "binary-classification",
    title: "Binary Classification Task Fundamentals",
    category: "ML Fundamentals",
    readTime: "9 min read",
    icon: "🎯",
    color: "#3b82f6",
    tldr: "Binary classification is the process of categorizing data points into one of two mutually exclusive classes. The core objective is to learn a decision boundary that separates the feature space into two distinct regions. Evaluation relies on metrics like precision, recall, and the F1-score rather than simple accuracy, especially in imbalanced datasets.",

    whyItMatters: [
      { title: "Finance -- Fraud Detection", desc: "Banks use binary classification to detect credit card fraud. A model analyzes transaction features--such as location, amount, and time--and classifies each transaction as 'legitimate' or 'fraudulent.' Because the cost of a false negative (missing real fraud) is high, banks often set thresholds to prioritize recall.", icon: "🏦" },
      { title: "Healthcare -- Diagnostic Imaging", desc: "Models trained on chest X-rays can classify images as 'pneumonia' or 'healthy.' This acts as a triage tool, allowing radiologists to prioritize urgent cases in a queue, significantly improving the speed of care for critical patients.", icon: "🩺" },
      { title: "Marketing -- Churn Prediction", desc: "Companies analyze user behavior data (login frequency, subscription usage) to classify users as 'likely to churn' or 'likely to stay.' This allows proactive offering of discounts or personalized support before users cancel.", icon: "📊" }
    ],

    diagrams: [
      {
        title: "Decision Boundary Visualization",
        ascii: `
    Feature 2
     ▲
     │  ○ ○    ╱  ● ●
     │ ○   ○  ╱  ●   ●
     │○  ○  ○╱  ●  ●  ●        ○ = Class 0 (Negative)
     │ ○  ○ ╱   ● ●  ●        ● = Class 1 (Positive)
     │  ○  ╱    ●  ●          ╱ = Decision Boundary
     │   ○╱     ●
     │   ╱   ●
     │  ╱  ●
     │ ╱
     └────────────────────▶ Feature 1
        `,
        explanation: "The goal of binary classification is to find the line (or curve) that best separates the two classes. Points above the line are predicted as Class 0, points below as Class 1."
      },
      {
        title: "Confusion Matrix",
        ascii: `
              PREDICTED
              Positive  Negative
           ┌──────────┬──────────┐
    ACTUAL │          │          │
  Positive │  TP (18) │  FN (2)  │
           ├──────────┼──────────┤
  Negative │  FP (2)  │  TN (18) │
           └──────────┴──────────┘

  Accuracy  = (TP + TN) / Total = 36/40 = 90%
  Precision = TP / (TP + FP) = 18/20 = 90%
  Recall    = TP / (TP + FN) = 18/20 = 90%
  F1-Score  = 2 × (P × R) / (P + R) = 90%
        `,
        explanation: "The confusion matrix breaks down predictions into 4 categories. High accuracy can be misleading in imbalanced datasets -- always check precision and recall!"
      }
    ],

    laymanExample: {
      title: "📧 The Email Spam Filter Analogy",
      content: `Think of binary classification like an email spam filter. Every email that arrives must be classified as either "Spam" (positive) or "Not Spam" (negative).

**The Decision Process:**
1. The filter looks at features: words like "free", "winner", sender reputation, link count
2. It draws an imaginary line: "If spam-score > 0.5 → mark as spam"
3. It classifies: every email gets a label

**The Cost of Mistakes:**
- **False Positive (FP):** Important work email goes to spam → BAD! You miss a deadline
- **False Negative (FN):** Spam reaches your inbox → Annoying but survivable

**Why accuracy alone fails:**
If 99% of emails are legitimate and 1% are spam, a model that marks EVERYTHING as legitimate gets 99% accuracy but catches ZERO spam! That's why we use precision and recall.`,
      realWorld: "A medical test for cancer: a False Negative (missing cancer) could be fatal, so we prioritize Recall (catch every possible case). A spam filter: a False Positive (losing important email) is terrible, so we prioritize Precision (only flag definite spam)."
    },

    howItWorks: [
      {
        title: "The Intuition of Binary Choices",
        content: "At its heart, binary classification is the digital equivalent of a 'Yes or No' question. Whether you are determining if an email is spam, if a credit card transaction is fraudulent, or if a patient has a specific condition, you are mapping an input vector x to a label y ∈ {0, 1}. Unlike regression, which predicts a continuous value, classification seeks to partition the feature space."
      },
      {
        title: "Probabilistic vs. Deterministic Outputs",
        content: "Most modern binary classifiers do not just output a 0 or 1. They output a probability p = P(y=1|x). If the model outputs 0.51, it is barely sure. If it outputs 0.99, it is highly confident. This allows practitioners to apply 'thresholding' -- if the cost of a false negative is extremely high (e.g., missing cancer), you might lower your threshold to 0.3 to catch every potential case."
      },
      {
        title: "Handling Data Complexity and Noise",
        content: "In practice, classes often overlap. There is no perfect line that separates all red dots from all blue dots because of noise or inherent ambiguity. Advanced models handle this by optimizing a loss function that penalizes misclassifications but allows for some 'slack.' For example, in Soft-Margin SVMs, we allow some points to be on the wrong side of the boundary for more robust generalization."
      }
    ],

    pitfalls: [
      '"Accuracy is the best metric" -- Many learners assume high accuracy is the goal, but in imbalanced datasets (e.g., 99% negative cases), a model predicting "negative" for everything gets 99% accuracy but zero utility. Always use precision, recall, or F1-score.',
      '"The decision boundary is fixed" -- Beginners think the boundary is an inherent property of the data, but it is a property of the model. Changing the architecture or training data shifts the boundary.',
      '"Probabilities are the same as confidence" -- A model outputting 0.9 doesn\'t mean 90% "confidence" in a human sense. It means the internal statistical mapping suggests 90% likelihood based on the training distribution.',
      '"Scaling features doesn\'t matter" -- Some learners skip feature scaling for logistic regression. However, features with large ranges can dominate the gradient, leading to slow convergence or poor performance.'
    ],

    codeExamples: [
      {
        title: "Complete Binary Classification Pipeline",
        language: "Python",
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Generate 200-sample binary dataset
X, y = make_classification(n_samples=200, n_features=2, n_informative=2,
                           n_redundant=0, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = LogisticRegression()
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)

print(f"Accuracy:  {accuracy_score(y_test, y_pred):.2f}")
print(f"Confusion matrix:\\n{confusion_matrix(y_test, y_pred)}")
print(f"\\nFull Report:\\n{classification_report(y_test, y_pred)}")

# Output:
# Accuracy:  0.90
# Confusion matrix:
# [[18  2]
#  [ 2 18]]
# P(class=1) for first test sample: 0.124`
      },
      {
        title: "Threshold Tuning for Real-World Tradeoffs",
        language: "Python",
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Simulate cancer detection: 95% healthy, 5% cancer (imbalanced)
X, y = make_classification(n_samples=1000, n_features=20, weights=[0.95, 0.05], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LogisticRegression().fit(X_train, y_train)
y_probs = model.predict_proba(X_test)[:, 1]

# Try different thresholds
for threshold in [0.3, 0.5, 0.7, 0.9]:
    preds = (y_probs >= threshold).astype(int)
    tp = ((preds == 1) & (y_test == 1)).sum()
    fp = ((preds == 1) & (y_test == 0)).sum()
    fn = ((preds == 0) & (y_test == 1)).sum()
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    print(f"Threshold {threshold}: Precision={precision:.2f}, Recall={recall:.2f}, "
          f"Caught {tp}/{tp+fn} cancers, {fp} false alarms")

# Output:
# Threshold 0.3: Precision=0.15, Recall=0.80, Caught 12/15 cancers, 68 false alarms
# Threshold 0.5: Precision=0.25, Recall=0.47, Caught 7/15 cancers, 21 false alarms
# Threshold 0.7: Precision=0.33, Recall=0.20, Caught 3/15 cancers, 6 false alarms
# Threshold 0.9: Precision=0.50, Recall=0.07, Caught 1/15 cancers, 1 false alarms`
      }
    ],

    keyTerms: [
      { term: "Decision Boundary", definition: "The surface or line in the feature space that separates instances belonging to the positive class from those belonging to the negative class." },
      { term: "Class Imbalance", definition: "A scenario where one class significantly outnumbers the other, often leading to biased models that favor the majority class." },
      { term: "Confusion Matrix", definition: "A table that describes performance by comparing predicted labels against actual ground truth labels, breaking down into TP, TN, FP, FN." },
      { term: "Precision", definition: "The ratio of correctly predicted positives to total predicted positives. Critical when false positives are costly (e.g., spam detection)." },
      { term: "Recall", definition: "The ratio of correctly predicted positives to all actual positives. Essential when missing a positive case is dangerous (e.g., cancer detection)." },
      { term: "Thresholding", definition: "Converting continuous probability output into discrete class labels by comparing against a predefined value." },
      { term: "Logistic Regression", definition: "A fundamental classification algorithm that estimates the probability of an instance belonging to a class using the logistic (sigmoid) function." }
    ],

    relatedConcepts: ["Precision-Recall Tradeoff", "ROC-AUC Curve", "Logistic Regression", "F1-Score", "Class Imbalance Techniques"]
  },

  // ═══════════════════════════════════════════════════════════
  // 3. SVM KERNEL TRICK
  // ═══════════════════════════════════════════════════════════
  {
    id: "svm-kernel-trick",
    title: "Support Vector Machine Kernel Trick",
    category: "ML Fundamentals",
    readTime: "10 min read",
    icon: "🎯",
    color: "#8b5cf6",
    tldr: "The Kernel Trick allows SVMs to perform linear classification in high-dimensional spaces without explicitly calculating the coordinates of the data in that space. It utilizes a kernel function to compute the inner product of two vectors in a transformed feature space, effectively measuring similarity without the computational overhead of mapping.",

    whyItMatters: [
      { title: "Bioinformatics", desc: "SVMs with the kernel trick are extensively used for protein classification and gene expression analysis. The RBF kernel allows researchers to identify patterns that distinguish between healthy and diseased tissue samples in high-dimensional biological data.", icon: "🧬" },
      { title: "Image Recognition", desc: "For smaller datasets where deep learning might overfit, SVMs with polynomial kernels have been used for object detection and character recognition. By mapping pixel intensity patterns into a high-dimensional space, the SVM can identify subtle structural differences.", icon: "🖼️" },
      { title: "Financial Fraud Detection", desc: "Banks use kernel-based SVMs to create non-linear boundaries that separate legitimate spending behavior from anomalous, potentially fraudulent activity, even when the fraud is sophisticated and mimics normal patterns.", icon: "💳" }
    ],

    diagrams: [
      {
        title: "The Marbles Analogy -- Why Kernels Exist",
        ascii: `
    2D INPUT SPACE              3D FEATURE SPACE
    (can't separate)            (can separate!)

    ● ● ● ● ● ● ●              ● ● ● ●
    ● ● ○ ○ ○ ● ●              ● ● ● ●
    ● ○ ○ ○ ○ ○ ●              ─────────── ← flat paper!
    ● ● ○ ○ ○ ● ●              ○ ○ ○ ○
    ● ● ● ● ● ● ●              ○ ○ ○ ○

    Red in center              Red stays low
    Blue in ring               Blue floats up high
        `,
        explanation: "Like marbles on a table -- you can't separate red (center) from blue (ring) with a straight line. But if you throw them into the air (map to higher dimensions), a flat sheet of paper can separate them perfectly!"
      },
      {
        title: "Kernel Types Comparison",
        ascii: `
    LINEAR KERNEL         POLYNOMIAL KERNEL     RBF KERNEL
    ─────────────         ──────────────────     ──────────
    ○ ○ ╱ ● ●             ○ ○ ○ ╱● ● ●          ○ ● ● ● ●
    ○ ○╱ ● ●              ○ ○ ╱● ● ● ●          ● ○○○○ ●
    ○ ╱● ● ●              ○ ╱ ● ● ● ●           ● ○○○○ ●
    ╱ ● ● ●               ╱● ● ● ● ●            ● ●●●● ●
    ╱● ● ● ●             ╱ ● ● ● ● ●            ● ● ● ● ●

    Straight line         Curved boundary        Circular boundary
    Best for linear       Handles moderate       Best for complex
    data only             non-linearity          non-linear data
        `,
        explanation: "Different kernels create different types of decision boundaries. Linear is simplest but limited; RBF is most flexible but can overfit."
      }
    ],

    laymanExample: {
      title: " throwing marbles into the air",
      content: `Imagine two types of marbles on a flat table -- red in the center, blue in a ring around them. You want to separate them with a straight line. **Impossible!** No matter how you draw it, some marbles are on the wrong side.

**The Trick:** Pick up the marbles and throw them into the air. The red ones (in the center) fly lower, the blue ones (on the edge) fly higher. Now hold a flat sheet of paper between them -- **perfect separation!**

**That's the Kernel Trick!** Instead of actually computing where each marble is in 3D space (expensive!), the kernel function calculates "how similar are these two marbles?" without ever moving them. It's a mathematical shortcut.

**Real-world example:** A bank wants to detect fraud. Legitimate transactions cluster together, but fraudsters mimic normal behavior. A linear line can't separate them. The kernel trick "lifts" the data into higher dimensions where a clear boundary emerges -- catching fraud without computing millions of features.`,
      realWorld: "SVM with RBF kernel detecting breast cancer: the kernel maps 30 medical features (tumor size, cell radius, texture, etc.) into an infinite-dimensional space where healthy vs malignant cells become linearly separable -- without ever computing those infinite dimensions."
    },

    howItWorks: [
      {
        title: "The Intuition: Seeing Beyond the Surface",
        content: "Imagine you are looking at a scatter plot of two different colored marbles mixed together on a flat table. The red marbles are in the center, and the blue marbles form a ring. No matter how you draw a straight line, you cannot separate them. To solve this, you could pick up the marbles and throw them into the air. The 'Kernel Trick' is the mathematical shortcut that finds this separating sheet without actually computing the high-dimensional coordinates."
      },
      {
        title: "The Mechanism: Avoiding the Curse of Dimensionality",
        content: "In machine learning, we often map input features into higher-dimensional space to make them linearly separable. As dimensions increase, computational cost grows exponentially -- the 'curse of dimensionality.' The kernel trick bypasses this by observing that SVM only requires the dot product of input vectors. By replacing the standard dot product with a kernel function K(xi, xj), we compute the result in the high-dimensional space using original low-dimensional vectors."
      },
      {
        title: "Edge Cases and Limitations",
        content: "If the kernel is too flexible (e.g., RBF with very small gamma), the model wraps around every training point, causing severe overfitting. If too rigid, underfitting. The dual formulation involves an N×N kernel matrix, where N is the number of training points. For very large datasets, storing this becomes memory-intensive."
      }
    ],

    pitfalls: [
      '"The kernel trick calculates the new coordinates of the data." -- False. The kernel trick specifically avoids this by computing the inner product directly, which is why it is computationally efficient.',
      '"Any function can be used as a kernel." -- To be valid, the function must satisfy Mercer\'s condition (positive semi-definite); otherwise, the SVM optimization may not converge to a global minimum.',
      '"The kernel trick is only for SVMs." -- It can be applied to any algorithm expressible in terms of dot products, such as Kernel PCA or Kernel Ridge Regression.',
      '"Increasing the kernel degree always improves accuracy." -- Higher complexity often leads to overfitting, where the model loses its ability to generalize to new data.'
    ],

    codeExamples: [
      {
        title: "SVM with Different Kernels -- Visual Comparison",
        language: "Python",
        code: `import numpy as np
from sklearn import svm
from sklearn.datasets import make_circles, make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt

# Non-linear data (concentric circles)
X, y = make_circles(n_samples=200, factor=0.3, noise=0.1, random_state=42)

kernels = ['linear', 'poly', 'rbf']
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for ax, kernel in zip(axes, kernels):
    clf = Pipeline([
        ('scaler', StandardScaler()),
        ('svm', svm.SVC(kernel=kernel, C=1.0, gamma='scale'))
    ])
    clf.fit(X, y)
    
    # Plot decision boundary
    xx, yy = np.meshgrid(np.linspace(-1.5, 1.5, 100), np.linspace(-1.5, 1.5, 100))
    Z = clf.decision_function(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=0.3, cmap='RdBu')
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', edgecolors='k', s=20)
    ax.set_title(f'{kernel.upper()} Kernel\\nAccuracy: {clf.score(X, y):.3f}')

plt.tight_layout()
plt.savefig('svm_kernels.png')`
      },
      {
        title: "RBF Kernel for Fraud Detection",
        language: "Python",
        code: `import numpy as np
from sklearn import svm
from sklearn.datasets import make_circles
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Simulate fraud data: legitimate (0) vs fraudulent (1)
X, y = make_circles(n_samples=1000, factor=0.3, noise=0.1, random_state=42)
# Make it imbalanced: 5% fraud
mask = y == 1
X_fraud = X[mask][:50]
y_fraud = y[mask][:50]
X_legit = X[~mask][:950]
y_legit = y[~mask][:950]
X = np.vstack([X_legit, X_fraud])
y = np.concatenate([y_legit, y_fraud])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, stratify=y)

# RBF kernel SVM
clf = svm.SVC(kernel='rbf', C=10, gamma='scale', probability=True)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# Predict probability for a new transaction
new_transaction = np.array([[0.5, -0.3]])
prob = clf.predict_proba(new_transaction)
print(f"Fraud probability: {prob[0][1]:.1%}")
print(f"Support vectors: {len(clf.support_vectors_)}")`
      }
    ],

    keyTerms: [
      { term: "Support Vector Machine (SVM)", definition: "A supervised model that constructs hyperplanes in high-dimensional space to separate data points into classes, maximizing the margin between closest points." },
      { term: "Feature Space", definition: "The multidimensional space where input data is represented after transformation. The kernel trick maps data from low to high dimensions." },
      { term: "Kernel Function", definition: "A function that calculates the inner product of two vectors in high-dimensional space without explicitly transforming them." },
      { term: "Mercer's Theorem", definition: "A mathematical condition determining whether a function can be used as a valid kernel -- must be symmetric and positive semi-definite." },
      { term: "Linear Separability", definition: "A property where two classes can be perfectly divided by a hyperplane. When not linearly separable, the kernel trick is essential." },
      { term: "Dual Formulation", definition: "An alternative SVM formulation depending only on dot products, making the kernel trick possible." },
      { term: "Overfitting", definition: "When a model captures noise rather than patterns. Using a kernel that is too complex or poorly tuned causes overfitting." }
    ],

    relatedConcepts: ["Support Vector Machines", "Feature Engineering", "Radial Basis Function", "Logistic Regression", "Feature Scaling"]
  },

  // ═══════════════════════════════════════════════════════════
  // 4. DECISION TREE PRUNING
  // ═══════════════════════════════════════════════════════════
  {
    id: "decision-tree-pruning",
    title: "Decision Tree Pruning and Structure",
    category: "ML Fundamentals",
    readTime: "9 min read",
    icon: "🌳",
    color: "#10b981",
    tldr: "Decision trees are prone to overfitting by creating overly complex structures that capture noise rather than patterns. Pruning removes branches that provide little predictive power to improve generalization. Pre-pruning halts tree growth during construction, while post-pruning removes nodes after the tree is fully grown.",

    whyItMatters: [
      { title: "Healthcare -- Patient Triage", desc: "By pruning diagnostic trees, hospitals ensure criteria remain general enough for diverse patients rather than being overly sensitive to small pilot study groups. This avoids 'over-diagnosing' based on rare, non-representative profiles.", icon: "🏥" },
      { title: "Financial -- Credit Scoring", desc: "Pruning ensures that credit scoring models don't inadvertently create discriminatory rules based on noise in historical data. A pruned tree ensures transparent, explainable decision-making based on robust financial indicators.", icon: "🏦" },
      { title: "Retail -- Churn Prediction", desc: "By pruning, analysts identify the most impactful behavioral triggers (e.g., specific login frequency drops) without getting lost in thousands of statistically insignificant patterns.", icon: "🛒" }
    ],

    diagrams: [
      {
        title: "Overfitting vs Pruned Tree",
        ascii: `
    OVERFIT TREE (too deep)         PRUNED TREE (just right)
    
         Age > 30?                      Age > 30?
        ╱         ╲                   ╱         ╲
    Yes            No              Yes            No
    ╱  ╲          ╱  ╲             ╱              ╲
  Income>50K?  ◐  ◐  ◐  Income>50K?  ◐          ◐
  ╱     ╲              ╱     ╲    
◐  ◐   ◐  ◐         ◐      ◐    
(16 leaves)          (4 leaves)
 95% train acc        88% train acc
 72% test acc         85% test acc
        `,
        explanation: "The overfit tree memorizes training data with 16 decision nodes but performs poorly on new data (72%). The pruned tree with just 4 nodes generalizes better (85% test accuracy)!"
      }
    ],

    laymanExample: {
      title: "🌳 The Overly Detailed GPS Analogy",
      content: `Imagine giving someone directions to your house. You could say:

**Overfit directions (too detailed):**
"Walk 127 steps, turn left at the crack in the sidewalk, pass the house with the red door and exactly 3 garden gnomes, then walk 84 more steps..."

**Pruned directions (just right):**
"Turn left at Main Street, walk 2 blocks, turn right at the park, house is the blue one on the corner."

The overfit directions only work for ONE specific person walking from ONE specific starting point. The pruned directions work for everyone, every time. That's the whole point of pruning -- removing the "noise" (specific details) to keep the "signal" (general rules).`,
      realWorld: "A credit approval tree might have a branch: 'If age=23 AND zip=10001 AND shoe_size=9 → approve.' This only works for that exact person! Pruning removes this branch, keeping only 'If income > $50K AND debt_ratio < 0.3 → approve.'"
    },

    howItWorks: [
      {
        title: "The Intuition of Tree Complexity",
        content: "A decision tree will continue to split nodes until every training data point is perfectly classified, resulting in a deep tree that essentially memorizes the training set. This is like memorizing every sentence in a dictionary instead of learning grammar rules."
      },
      {
        title: "Pre-Pruning vs Post-Pruning",
        content: "Pre-pruning stops tree growth early using criteria like max_depth or min_samples_split. Post-pruning grows the full tree first, then removes branches that don't improve validation performance. Cost-complexity pruning is the standard approach, using a penalty parameter α to find the optimal subtree."
      },
      {
        title: "The Bias-Variance Tradeoff",
        content: "A deep tree has low bias (fits training data well) but high variance (sensitive to small data changes). Pruning increases bias slightly but dramatically reduces variance, often improving overall generalization."
      }
    ],

    pitfalls: [
      '"Deeper trees are always more accurate." -- While training accuracy increases with depth, test accuracy peaks and then drops as the tree memorizes noise instead of learning patterns.',
      '"Pre-pruning is always better than post-pruning." -- Pre-pruning can cause "horizon effects" where the tree stops growing before discovering useful splits that only appear deeper.',
      '"Pruning always improves performance." -- If the data is truly complex, aggressive pruning can underfit, losing important patterns that the tree could have captured.',
      '"The default scikit-learn tree is optimal." -- DecisionTreeClassifier() grows until pure leaves. You almost always need to tune max_depth, min_samples_leaf, or apply pruning.'
    ],

    codeExamples: [
      {
        title: "Cost-Complexity Pruning with Visual CCP Path",
        language: "Python",
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Create imbalanced dataset
X, y = make_classification(n_samples=1000, n_features=10, n_informative=5, 
                           weights=[0.7, 0.3], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train full tree (overfit)
full_tree = DecisionTreeClassifier(random_state=42)
full_tree.fit(X_train, y_train)
print(f"Full tree:  depth={full_tree.get_depth()}, leaves={full_tree.get_n_leaves()}")
print(f"  Train acc: {full_tree.score(X_train, y_train):.3f}")
print(f"  Test acc:  {full_tree.score(X_test, y_test):.3f}")

# Cost-complexity pruning
path = full_tree.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.ccp_alphas

# Find best alpha via cross-validation
from sklearn.model_selection import cross_val_score
scores = [cross_val_score(DecisionTreeClassifier(random_state=42, ccp_alpha=a), 
                          X_train, y_train, cv=5).mean() for a in ccp_alphas]
best_alpha = ccp_alphas[np.argmax(scores)]

pruned_tree = DecisionTreeClassifier(random_state=42, ccp_alpha=best_alpha)
pruned_tree.fit(X_train, y_train)
print(f"\\nPruned tree: depth={pruned_tree.get_depth()}, leaves={pruned_tree.get_n_leaves()}")
print(f"  Train acc: {pruned_tree.score(X_train, y_train):.3f}")
print(f"  Test acc:  {pruned_tree.score(X_test, y_test):.3f}")`
      }
    ],

    keyTerms: [
      { term: "Overfitting", definition: "When a model learns training data too well, including noise, leading to poor generalization on unseen data." },
      { term: "Pruning", definition: "Removing branches from a decision tree that provide little predictive power to reduce overfitting." },
      { term: "Cost-Complexity Pruning", definition: "Standard pruning approach using a penalty parameter α to trade off tree complexity vs accuracy." },
      { term: "Bias-Variance Tradeoff", definition: "The balance between model simplicity (high bias) and flexibility (high variance)." },
      { term: "Leaf Node", definition: "A terminal node in the tree that makes the final prediction." },
      { term: "Max Depth", definition: "A hyperparameter limiting the maximum depth of the tree to prevent overfitting." }
    ],

    relatedConcepts: ["Random Forest", "Gradient Boosting", "Bias-Variance Tradeoff", "Cross-Validation", "Gini Impurity"]
  },

  // ═══════════════════════════════════════════════════════════
  // 5. RANDOM FOREST ENSEMBLE
  // ═══════════════════════════════════════════════════════════
  {
    id: "random-forest",
    title: "Random Forest Ensemble Mechanics",
    category: "ML Fundamentals",
    readTime: "9 min read",
    icon: "🌲",
    color: "#059669",
    tldr: "Random Forests combine multiple decision trees trained on random subsets of data and features, using bagging and random feature selection to produce a model more robust than any individual tree.",

    whyItMatters: [
      { title: "E-commerce Recommendations", desc: "Amazon uses ensemble methods to power recommendation engines. Random forests handle mixed data types (categorical user preferences, numerical ratings) and provide feature importance scores that help product teams understand what drives purchases.", icon: "🛒" },
      { title: "Healthcare Diagnostics", desc: "Hospitals use random forests to predict patient readmission risk by combining hundreds of weak decision trees, each seeing different aspects of patient data. The ensemble approach reduces the risk of relying on any single pattern.", icon: "🏥" },
      { title: "Financial Risk Assessment", desc: "Banks use random forests for credit scoring because they handle missing data well, resist overfitting, and provide interpretable feature importance rankings that regulators require.", icon: "🏦" }
    ],

    diagrams: [
      {
        title: "How Random Forest Works",
        ascii: `
    TRAINING DATA (1000 rows)
         │
    ┌────┴────┐
    ▼    ▼    ▼   ← Bootstrap samples (random with replacement)
   ┌─┐  ┌─┐  ┌─┐
   │T│  │T│  │T│  ← Each tree sees random subset of FEATURES
   │1│  │2│  │3│     (e.g., 3 out of 10 features)
   └─┘  └─┘  └─┘
    │    │    │
    ▼    ▼    ▼
   Yes   No  Yes   ← Individual predictions
    │    │    │
    └────┬────┘
         ▼
    VOTE / AVERAGE
         │
         ▼
      Final Prediction (Yes)
    
    ✓ Bagging: each tree trains on random data subset
    ✓ Feature randomness: each tree uses random features
    ✓ Averaging: reduces variance, prevents overfitting
        `,
        explanation: "Like asking 100 friends for stock advice instead of just one. Each friend sees slightly different information (different data, different analysis angles). The collective wisdom is better than any individual."
      }
    ],

    laymanExample: {
      title: "🌲 The Committee of Experts Analogy",
      content: `Imagine you need to decide whether to invest in a company. Instead of asking one analyst, you ask 100 analysts:

- **Analyst 1** sees the company's revenue, debt, and management quality
- **Analyst 2** sees revenue, market position, and employee satisfaction
- **Analyst 3** sees debt, market position, and product reviews
- ... and so on

Each analyst only sees 3 out of 10 available factors (feature randomness). Each analyst also reviews slightly different historical data (bootstrap sampling).

Now you take a vote: 73 say "invest," 27 say "don't." The majority wins.

**Why this works better than one analyst:**
- One analyst might be biased by their specific data
- The committee averages out individual biases
- You get a more stable, reliable prediction

**That's exactly what a Random Forest does!** Each tree is an analyst. The forest is the committee.`,
      realWorld: "Random Forest predicting whether a patient has diabetes: Tree 1 (using age, BMI, blood pressure) says 'yes.' Tree 2 (using glucose, insulin, BMI) says 'no.' Tree 3 (using age, glucose, family history) says 'yes.' Final: majority says 'yes' -- and the ensemble is more accurate than any single tree."
    },

    howItWorks: [
      {
        title: "Bagging: Bootstrap Aggregation",
        content: "Each tree is trained on a random sample of the original data, drawn with replacement. This means some data points appear multiple times in a single tree's training set, while others are left out. Each tree is then trained independently on its bootstrap sample."
      },
      {
        title: "Feature Randomness",
        content: "At each split in each tree, only a random subset of features is considered. For classification, typically √n features; for regression, n/3. This prevents all trees from splitting on the same dominant feature, forcing diversity."
      },
      {
        title: "Aggregation",
        content: "For classification, each tree votes and the majority class wins. For regression, trees' predictions are averaged. This reduces variance without increasing bias, leading to more robust predictions."
      }
    ],

    pitfalls: [
      '"Random Forests are always better than single trees." -- True for most cases, but on very small datasets, a single well-tuned tree might outperform due to less variance.',
      '"More trees always improve performance." -- Performance plateaus after a certain number of trees. Adding more trees beyond ~200-300 provides diminishing returns while increasing computation.',
      '"Random Forests are interpretable." -- While feature importance is available, individual tree decisions are hard to interpret. For interpretability, a single pruned tree is better.',
      '"Feature randomness means losing information." -- Random feature subsets deliberately sacrifice information for diversity. This is a feature, not a bug -- it prevents all trees from being correlated.'
    ],

    codeExamples: [
      {
        title: "Random Forest with Feature Importance",
        language: "Python",
        code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Create dataset with 10 features
X, y = make_classification(n_samples=1000, n_features=10, n_informative=5, 
                           random_state=42)
feature_names = [f"Feature_{i}" for i in range(10)]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train Random Forest with 100 trees
rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42)
rf.fit(X_train, y_train)

print(f"Train accuracy: {rf.score(X_train, y_train):.3f}")
print(f"Test accuracy:  {rf.score(X_test, y_test):.3f}")

# Feature importance
importances = rf.feature_importances_
indices = np.argsort(importances)[::-1]
print("\\nFeature Importance Ranking:")
for i in range(5):
    print(f"  {i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.3f}")`
      }
    ],

    keyTerms: [
      { term: "Ensemble Learning", definition: "Combining multiple models to produce better predictions than any single model." },
      { term: "Bagging", definition: "Bootstrap Aggregation -- training multiple models on random subsets of data with replacement." },
      { term: "Bootstrap Sample", definition: "A random sample drawn with replacement from the original dataset, same size as original." },
      { term: "Feature Importance", definition: "A measure of how much each feature contributes to the model's predictions across all trees." },
      { term: "Variance Reduction", definition: "The ensemble's ability to reduce prediction variability by averaging multiple diverse models." }
    ],

    relatedConcepts: ["Decision Trees", "Gradient Boosting", "XGBoost", "Bias-Variance Tradeoff", "Feature Selection"]
  },

  // ═══════════════════════════════════════════════════════════
  // 6. REGRESSION METRICS
  // ═══════════════════════════════════════════════════════════
  {
    id: "regression-metrics",
    title: "Regression Model Performance Metrics",
    category: "ML Fundamentals",
    readTime: "9 min read",
    icon: "📏",
    color: "#06b6d4",
    tldr: "Regression metrics quantify the distance between predicted continuous values and actual ground truth targets. Choosing the right metric depends on the distribution of your data and the business cost of specific types of errors.",

    whyItMatters: [
      { title: "Insurance -- Premium Estimation", desc: "Companies like GEICO use regression metrics to estimate expected loss for policyholders. By minimizing RMSE, they ensure pricing models don't consistently underestimate risk, which could lead to financial insolvency.", icon: "🏦" },
      { title: "Retail -- Demand Forecasting", desc: "Companies like Walmart utilize Mean Absolute Percentage Error (MAPE) to understand error as a percentage of total sales volume, helping optimize supply chain logistics and inventory levels.", icon: "🛒" },
      { title: "Energy -- Grid Load Prediction", desc: "Grid operators predict electricity load based on weather patterns. Because under-prediction can lead to blackouts, they use MSE to heavily penalize large deviations for grid stability.", icon: "⚡" }
    ],

    diagrams: [
      {
        title: "MAE vs MSE vs RMSE",
        ascii: `
    Actual values:    [100, 200, 300, 400, 500]
    Predicted values: [110, 180, 330, 380, 520]
    Errors:           [ 10,  20,  30,  20,  20]

    MAE  = mean(|errors|) = (10+20+30+20+20)/5 = 20
    MSE  = mean(errors²) = (100+400+900+400+400)/5 = 440
    RMSE = √MSE = √440 = 20.98

    R²   = 1 - (SS_res / SS_tot)
         = 1 - (10²+20²+30²+20²+20²) / (SS_tot)
         = High value (model explains most variance)
    
    ┌──────────────────────────────────────────┐
    │ Metric  │ Value │ When to Use            │
    ├─────────┼───────┼────────────────────────┤
    │ MAE     │  20   │ Robust to outliers     │
    │ MSE     │ 440   │ Penalize large errors  │
    │ RMSE    │ 21.0  │ Same units as target   │
    │ R²      │ 0.97  │ Compare across models  │
    └──────────────────────────────────────────┘
        `,
        explanation: "MAE treats all errors equally. MSE/RMSE punish large errors more (squaring amplifies them). R² tells you what percentage of variance the model explains."
      }
    ],

    laymanExample: {
      title: "🏠 Predicting House Prices",
      content: `You're building a model to predict house prices. Your model predicts $450,000 for a house actually worth $500,000.

**The error is $50,000.** But how do you measure errors across 1000 houses?

**MAE (Mean Absolute Error):** "On average, our predictions are off by $X." 
→ Easy to understand: "Our model is typically off by $20,000"

**MSE (Mean Squared Error):** Squares errors, so a $100K miss is 25× worse than a $20K miss.
→ Use when large errors are especially dangerous (e.g., grid blackouts)

**RMSE:** Square root of MSE -- same units as the target.
→ "Our model is typically off by $21,000" (but penalizes big misses)

**R² Score:** "What % of price variation does our model explain?"
→ R² = 0.95 means "We explain 95% of why houses differ in price"

**Key insight:** A model with MAE of $15K might be better than one with MAE of $10K if the second one occasionally predicts $500K off (which MSE would heavily penalize).`,
      realWorld: "Stock price prediction: RMSE might be $5/share. But if one prediction is $50 off (flash crash), MSE explodes. That's why traders often use MAPE (Mean Absolute Percentage Error) -- a $5 error on a $10 stock is worse than on a $200 stock."
    },

    howItWorks: [
      {
        title: "The Intuition of Error",
        content: "Regression metrics aggregate the gaps between predictions and truth across an entire dataset. MAE treats all errors linearly. MSE squaring makes large errors massive. Choosing a metric is a business decision: 'Is it worse to be off by $100 ten times, or off by $1,000 once?'"
      },
      {
        title: "Why One Metric Isn't Enough",
        content: "Different metrics prioritize different types of errors. MSE is terrified of large errors because squaring amplifies them. MAE treats errors linearly. R² provides scale-independent comparison. Always use multiple metrics."
      },
      {
        title: "Impact of Data Distribution",
        content: "For heavy-tailed distributions, standard MSE can become misleadingly high due to outliers. Use robust metrics like Median Absolute Error or Huber Loss. When target spans orders of magnitude, use log-transformed metrics."
      }
    ],

    pitfalls: [
      '"Lower MSE is always better" -- MSE is highly sensitive to outliers. A model with slightly higher MSE might actually be more robust for general use.',
      '"R² of 0.8 is good" -- Always compare against a baseline. If a simple linear model gets 0.75, your complex model\'s 0.8 provides minimal added value.',
      '"Correlation means accuracy" -- High correlation doesn\'t mean accurate. A model could be perfectly correlated but consistently off by a fixed amount (bias).',
      '"Compare MAE across datasets" -- MAE is scale-dependent. Use MAPE or R² when comparing across different domains or target variables.'
    ],

    codeExamples: [
      {
        title: "Complete Regression Metrics Comparison",
        language: "Python",
        code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Generate regression dataset
X, y = make_regression(n_samples=100, n_features=5, noise=15, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression().fit(X_train, y_train)
y_pred = model.predict(X_test)

mae  = mean_absolute_error(y_test, y_pred)
mse  = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2   = r2_score(y_test, y_pred)

print(f"MAE:  {mae:.2f}")   # Average error in original units
print(f"MSE:  {mse:.2f}")   # Penalizes large errors
print(f"RMSE: {rmse:.2f}")  # Error in same units as target
print(f"R²:   {r2:.4f}")    # % of variance explained`
      }
    ],

    keyTerms: [
      { term: "Ground Truth", definition: "The actual observed value that the model attempts to predict." },
      { term: "Residual", definition: "The difference between predicted and actual values (y - ŷ)." },
      { term: "MAE", definition: "Mean Absolute Error -- average of absolute differences, robust to outliers." },
      { term: "MSE", definition: "Mean Squared Error -- average of squared differences, penalizes large errors." },
      { term: "RMSE", definition: "Root Mean Squared Error -- in same units as target variable." },
      { term: "R² (Coefficient of Determination)", definition: "Proportion of variance in the dependent variable explained by the model." },
      { term: "MAPE", definition: "Mean Absolute Percentage Error -- error as percentage, scale-invariant." }
    ],

    relatedConcepts: ["Linear Regression", "Overfitting", "Cross-Validation", "Feature Engineering", "Regularization"]
  },

  // ═══════════════════════════════════════════════════════════
  // 7. PRECISION, RECALL AND ROC-AUC
  // ═══════════════════════════════════════════════════════════
  {
    id: "precision-recall-roc",
    title: "Classification Metrics: Precision, Recall and ROC-AUC",
    category: "ML Fundamentals",
    readTime: "9 min read",
    icon: "🎯",
    color: "#ec4899",
    tldr: "Precision measures the accuracy of positive predictions. Recall measures the ability to find all positive instances. ROC-AUC provides a single-number summary across all classification thresholds. Choosing between them requires understanding the cost of false positives vs false negatives.",

    whyItMatters: [
      { title: "Financial -- Fraud Detection", desc: "Credit card fraud detection systems rely heavily on recall. Banks prioritize catching as many fraudulent transactions as possible, even if it means occasionally flagging legitimate purchases for verification.", icon: "💳" },
      { title: "Healthcare -- Rare Disease Screening", desc: "Diagnostic tools for rare diseases prioritize high recall to ensure no patient is left undiagnosed. An AI model screening for early-stage tumors must capture every possible positive case.", icon: "🏥" },
      { title: "E-commerce -- Spam Filtering", desc: "When Amazon filters out fake reviews, they prioritize precision -- they want to be extremely confident before removing a review, as deleting legitimate reviews harms seller trust.", icon: "🛒" }
    ],

    diagrams: [
      {
        title: "Precision vs Recall Tradeoff",
        ascii: `
    PRECISION                                    RECALL
    "Of all predicted positives,                "Of all actual positives,
     how many are actually positive?"            how many did we catch?"
    
    Predicted: [P P P P P]                       Actual: [P P P P P _ _ _]
    Actual:    [P P N N N]                        Found:  [P P _ _ _ _ _ _]
    
    Precision = 2/5 = 40%                        Recall = 2/5 = 40%
    
    ═══════════════════════════════════════════
    
    HIGH PRECISION                          HIGH RECALL
    Few false alarms                        Few missed cases
    ● → likely truly positive               P → we found most of them
    Good for: spam filtering                Good for: cancer screening
    (don't lose important email)             (don't miss any patients)
        `,
        explanation: "Precision and recall are inversely related. Increasing one often decreases the other. The F1-score is the harmonic mean that balances both."
      },
      {
        title: "ROC Curve Explained",
        ascii: `
    TRUE POSITIVE RATE (Recall)
    1.0 │          ╱─────── Perfect classifier
        │        ╱
    0.8 │      ╱    ★ Good classifier
        │    ╱    ╱
    0.6 │  ╱    ╱
        │╱    ╱
    0.4 │   ╱
        │ ╱     Random classifier (AUC = 0.5)
    0.2 │╱   ╱
        │  ╱
    0.0 │╱────────────────────
        0.0  0.2  0.4  0.6  0.8  1.0
              FALSE POSITIVE RATE
    
    AUC = Area Under the Curve
    AUC = 1.0 → Perfect
    AUC = 0.5 → Random guessing
    AUC < 0.5 → Worse than random
        `,
        explanation: "ROC curve plots True Positive Rate vs False Positive Rate at every threshold. AUC summarizes it into one number -- higher is better regardless of the threshold chosen."
      }
    ],

    laymanExample: {
      title: "🔍 The Airport Security Analogy",
      content: `Think of binary classification like airport security screening:

**Precision (quality of alerts):**
- Security beeps at 10 people. Only 2 actually have weapons.
- Precision = 2/10 = 20%. 80% were false alarms!
- Low precision = annoying, wastes everyone's time

**Recall (catching threats):**
- There are 5 people with weapons. Security catches 3.
- Recall = 3/5 = 60%. 2 threats slipped through!
- Low recall = dangerous, people could get hurt

**The Tradeoff:**
- If security beeps at EVERYONE → Recall = 100% (catches all threats) but Precision = 5% (massive false alarms)
- If security only beeps when 100% certain → Precision = 100% but Recall = 10% (misses most threats)

**ROC-AUC is like testing security at every sensitivity level** -- from "beep at everyone" to "only beep at absolute certainty" -- and measuring overall performance.`,
      realWorld: "A cancer screening AI: at threshold 0.3, it catches 95% of cancers (high recall) but flags 30% of healthy patients for follow-up (low precision). At threshold 0.8, it only flags definite cancers (high precision) but misses 40% of cases (low recall). ROC-AUC tells you the model's overall ability to distinguish healthy from sick across ALL these thresholds."
    },

    howItWorks: [
      {
        title: "Precision vs. Recall: The Balancing Act",
        content: "Precision focuses on the quality of positive predictions. 'Of all the times the model said Yes, how often was it right?' High precision is essential when false positives are costly. Recall focuses on quantity of positives captured. 'Of all actual Yes instances, how many did we find?' High recall is essential when false negatives are dangerous."
      },
      {
        title: "ROC-AUC: Evaluating Performance Across Thresholds",
        content: "A model outputs a probability between 0 and 1. By default, threshold is 0.5. Changing it changes metrics. ROC curve plots True Positive Rate (Recall) against False Positive Rate at every possible threshold. AUC summarizes this into a single threshold-invariant value."
      }
    ],

    pitfalls: [
      '"High accuracy is always good" -- Accuracy is misleading when classes are imbalanced. A model predicting majority class every time gets 99% accuracy but zero utility for the minority class.',
      '"Precision and Recall are independent" -- They are inversely related; increasing one often decreases the other. There is no perfect model, only one tuned for a specific requirement.',
      '"ROC-AUC equals accuracy" -- ROC-AUC measures ranking ability, not accuracy at a specific threshold. A model can have high AUC but perform poorly if the threshold is wrong.',
      '"Default 0.5 threshold is always best" -- The threshold should be adjusted based on the relative costs of False Positives and False Negatives in your specific domain.'
    ],

    codeExamples: [
      {
        title: "Precision, Recall, and ROC-AUC Metrics",
        language: "Python",
        code: `import numpy as np
from sklearn.metrics import precision_score, recall_score, roc_auc_score, f1_score
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Generate imbalanced dataset
X, y = make_classification(n_samples=1000, n_features=20, weights=[0.9, 0.1], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

model = LogisticRegression().fit(X_train, y_train)
y_pred = model.predict(X_test)
y_probs = model.predict_proba(X_test)[:, 1]

precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_probs)

print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1-Score:  {f1:.4f}")
print(f"ROC-AUC:   {auc:.4f}")`
      }
    ],

    keyTerms: [
      { term: "True Positive (TP)", definition: "Model correctly predicts the positive class." },
      { term: "False Positive (FP)", definition: "Model incorrectly predicts positive when actually negative (Type I error)." },
      { term: "True Negative (TN)", definition: "Model correctly predicts the negative class." },
      { term: "False Negative (FN)", definition: "Model incorrectly predicts negative when actually positive (Type II error)." },
      { term: "Threshold", definition: "Numerical value converting probability to class label." },
      { term: "ROC Curve", definition: "Plot of TPR vs FPR at various thresholds." },
      { term: "AUC", definition: "Area Under the ROC Curve -- single number measuring classifier quality." }
    ],

    relatedConcepts: ["Confusion Matrix", "F1-Score", "Class Imbalance", "Logistic Regression", "Threshold Tuning"]
  },

  // ═══════════════════════════════════════════════════════════
  // 8. BIAS-VARIANCE TRADEOFF
  // ═══════════════════════════════════════════════════════════
  {
    id: "bias-variance",
    title: "Bias-Variance Tradeoff and Overfitting",
    category: "ML Fundamentals",
    readTime: "8 min read",
    icon: "⚖️",
    color: "#f97316",
    tldr: "The bias-variance tradeoff is the fundamental tension between model simplicity and flexibility. High bias means underfitting (too simple), high variance means overfitting (too complex). The goal is finding the sweet spot that minimizes total error.",

    whyItMatters: [
      { title: "Model Selection", desc: "Understanding bias-variance helps choose between a simple linear model (high bias, low variance) and a complex neural network (low bias, high variance) for your specific problem.", icon: "🔬" },
      { title: "Production ML", desc: "In production, overfit models perform great in testing but fail on real data. Understanding this tradeoff prevents deploying models that break when data distribution shifts.", icon: "🏭" },
      { title: "Resource Allocation", desc: "Knowing when your model is underfitting vs overfitting tells you whether to collect more data, add features, or add regularization -- saving time and money.", icon: "💰" }
    ],

    diagrams: [
      {
        title: "Bias-Variance Visual",
        ascii: `
    LOW BIAS, LOW VARIANCE        HIGH BIAS, LOW VARIANCE
    ★ ★ ★  ★ ★ ★                  ● ● ●  ● ● ●
    ★ ★ ★  ★ ★ ★                  ● ● ●  ● ● ●
    ★ = actual, ● = predicted      ● = predicted everywhere
    
    ✓ Ideal! (Goldilocks)          ✗ Underfitting (too simple)
    
    
    LOW BIAS, HIGH VARIANCE       HIGH BIAS, HIGH VARIANCE
    ★  ●  ★ ●  ★                  ● ★  ●  ★ ●  ★
     ● ★  ● ★ ●                    ★ ●  ●  ● ★  ●
    ● ★ ●  ★ ● ★                  ● ●  ★  ★ ●  ●
    
    ✗ Overfitting (too complex)    ✗ Worst of both worlds
        `,
        explanation: "The bullseye analogy: Low bias = centered on target. Low variance = tightly clustered. You want both centered AND tight."
      }
    ],

    laymanExample: {
      title: "🎯 The Archer Analogy",
      content: `Imagine an archer shooting arrows at a target:

**Low Bias, Low Variance (Perfect!):** Arrows cluster tightly around the bullseye
→ The model is accurate AND consistent

**High Bias, Low Variance (Underfitting):** Arrows cluster tightly but far from bullseye
→ Model is consistent but consistently wrong (like predicting the average for everything)

**Low Bias, High Variance (Overfitting):** Arrows scatter around bullseye, averaging to center
→ Model gets the right answer on average but wildly fluctuates for individual cases

**High Bias, High Variance (Terrible):** Arrows scatter AND miss the bullseye
→ Model is both wrong and inconsistent

**The sweet spot:** Slightly sacrifice bullseye accuracy (a tiny bit of bias) to get much tighter clustering (less variance).`,
      realWorld: "A student who memorizes every practice exam answer (low bias, high variance) gets 100% on practice exams but 60% on the real exam. A student who only knows general concepts (high bias, low variance) gets 70% consistently. A student who understands concepts AND practices specific problems (balanced) gets 90% consistently."
    },

    howItWorks: [
      {
        title: "Bias: The Underfitting Problem",
        content: "High bias occurs when the model is too simple to capture the underlying pattern. A linear model trying to fit a quadratic relationship will systematically miss the curve. The training error is high, and the test error is also high."
      },
      {
        title: "Variance: The Overfitting Problem",
        content: "High variance occurs when the model is too sensitive to the specific training data. A deep decision tree that memorizes the training set will have near-zero training error but terrible test error. Different training samples would produce very different models."
      },
      {
        title: "The Tradeoff",
        content: "As model complexity increases, bias decreases (fits training data better) but variance increases (more sensitive to training data). The optimal model is at the minimum of the total error curve -- where bias² + variance + irreducible noise is minimized."
      }
    ],

    pitfalls: [
      '"More complex models are always better" -- Increasing complexity reduces bias but increases variance. Past the sweet spot, more complexity hurts performance.',
      '"Training error tells the whole story" -- Low training error with high test error is the classic sign of overfitting. Always compare train vs test performance.',
      '"More data always helps overfitting" -- More data helps reduce variance, but if the model has fundamental bias (too simple), more data won\'t help.',
      '"Regularization only reduces variance" -- L1/L2 regularization increases bias while reducing variance. The goal is finding the regularization strength that minimizes total error.'
    ],

    codeExamples: [
      {
        title: "Demonstrating Bias-Variance with Polynomial Fits",
        language: "Python",
        code: `import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Generate non-linear data
np.random.seed(42)
X = np.sort(np.random.rand(100, 1) * 10, axis=0)
y = np.sin(X).ravel() + np.random.randn(100) * 0.3

for degree in [1, 3, 10]:
    poly = PolynomialFeatures(degree=degree)
    X_poly = poly.fit_transform(X)
    model = LinearRegression().fit(X_poly, y)
    
    train_pred = model.predict(X_poly)
    train_mse = mean_squared_error(y, train_pred)
    
    print(f"Degree {degree:2d}: Train MSE = {train_mse:.4f} ", end="")
    if degree == 1:
        print("← HIGH BIAS (underfitting)")
    elif degree == 3:
        print("← Good balance!")
    else:
        print("← HIGH VARIANCE (overfitting)")`
      }
    ],

    keyTerms: [
      { term: "Bias", definition: "Error from overly simplistic assumptions. High bias = underfitting." },
      { term: "Variance", definition: "Error from sensitivity to training data fluctuations. High variance = overfitting." },
      { term: "Overfitting", definition: "Model memorizes training data including noise. Low train error, high test error." },
      { term: "Underfitting", definition: "Model too simple to capture patterns. High train and test error." },
      { term: "Regularization", definition: "Techniques (L1, L2) that penalize complexity to reduce variance at the cost of some bias." },
      { term: "Cross-Validation", definition: "Technique to estimate test performance by splitting data into multiple train/validation sets." }
    ],

    relatedConcepts: ["Regularization", "Cross-Validation", "Model Selection", "Overfitting", "Learning Curves"]
  },

  // ═══════════════════════════════════════════════════════════
  // 9. K-MEANS CLUSTERING
  // ═══════════════════════════════════════════════════════════
  {
    id: "k-means-clustering",
    title: "K-Means Clustering and Initialization",
    category: "ML Fundamentals",
    readTime: "8 min read",
    icon: "🎯",
    color: "#a855f7",
    tldr: "K-Means partitions data into K clusters by iteratively assigning points to the nearest centroid and recomputing centroids. Initialization matters -- K-Means++ provides better starting points to avoid poor local minima.",

    whyItMatters: [
      { title: "Customer Segmentation", desc: "Retailers like Target use K-Means to segment customers into groups based on purchasing behavior, enabling personalized marketing campaigns for each segment.", icon: "🛒" },
      { title: "Image Compression", desc: "K-Means reduces image colors by clustering pixel values. An image with millions of colors can be represented with just K=16 colors, dramatically reducing file size while maintaining visual quality.", icon: "🖼️" },
      { title: "Anomaly Detection", desc: "Points far from any cluster center are flagged as anomalies. Banks use this to detect unusual transaction patterns that don't fit any known customer segment.", icon: "🔍" }
    ],

    diagrams: [
      {
        title: "K-Means Iteration Process",
        ascii: `
    Step 1: Initialize      Step 2: Assign           Step 3: Update
    (random centroids)      (nearest centroid)       (new centroids)
    
    ● ● ○ ○ ○               ● ● | ○ ○ ○              ● ●  |  ○ ○ ○
    ● ○ ○ ○ ○               ● ○ | ○ ○ ○              ● ●  |  ○ ○ ○
    ○ ○ ○ ● ●               ○ ○ | ○ ● ●     →        ○ ○  |  ● ● ●
    ○ ○ ● ● ●               ○ ○ | ● ● ●              ○ ○  |  ● ● ●
    ○ ● ● ● ●               ○ ○ | ● ● ●              ○ ○  |  ● ● ●
    
    ★ = centroid            | = decision boundary     New centroids computed
    
    Repeat Steps 2-3 until centroids stop moving!
        `,
        explanation: "K-Means is like repeatedly asking 'Who's closest to each center?' then moving the centers to the middle of their group, until everyone's happy."
      }
    ],

    laymanExample: {
      title: "🍕 The Pizza Topping Sorter",
      content: `Imagine you have a huge pile of mixed pizza toppings and you want to sort them into 3 bowls (K=3):

**Round 1:** Put 3 bowls randomly on the table
**Round 2:** Put each topping in the nearest bowl
**Round 3:** Move each bowl to the center of its toppings
**Repeat** until bowls stop moving

You end up with: Bowl 1 = pepperoni, Bowl 2 = mushrooms, Bowl 3 = peppers

**Why initialization matters:**
If you start with all 3 bowls on the pepperoni side, you might end up with one bowl of pepperoni, one bowl of mixed mushrooms+peppers, and one empty bowl. K-Means++ solves this by spreading the initial bowls out evenly.`,
      realWorld: "Netflix uses K-Means clustering (and similar algorithms) to group viewers with similar watching patterns. Cluster 1: sci-fi binge-watchers. Cluster 2: documentary lovers. Cluster 3: reality TV fans. Each cluster gets different recommendations."
    },

    howItWorks: [
      {
        title: "The Algorithm",
        content: "1. Choose K (number of clusters). 2. Initialize K centroids (randomly or via K-Means++). 3. Assign each data point to the nearest centroid. 4. Recompute centroids as the mean of assigned points. 5. Repeat 3-4 until convergence."
      },
      {
        title: "Why K-Means++ Initialization?",
        content: "Random initialization can place all centroids in one region, leading to poor clustering. K-Means++ selects centroids that are far apart from each other, ensuring better coverage of the data space."
      },
      {
        title: "Choosing K: The Elbow Method",
        content: "Plot within-cluster sum of squares (WCSS) for K=1,2,3,... The 'elbow' -- where the rate of decrease sharply changes -- suggests the optimal K. Too few clusters underfit; too many overfit."
      }
    ],

    pitfalls: [
      '"K-Means always finds the best clustering" -- It can get stuck in local minima. Running multiple times with different initializations helps.',
      '"K-Means works for any shape" -- It only finds spherical clusters. For elongated or irregular shapes, use DBSCAN or Gaussian Mixture Models.',
      '"More clusters are always better" -- Too many clusters overfit and create meaningless groups. Use the elbow method or silhouette score.',
      '"K-Means handles outliers well" -- Outliers heavily influence centroid positions. Pre-process with outlier detection or use K-Medoids instead.'
    ],

    codeExamples: [
      {
        title: "K-Means with Elbow Method",
        language: "Python",
        code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt

# Generate 3 natural clusters
X, y = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=42)

# Elbow method: try K=1 to 8
wcss = []
for k in range(1, 9):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X)
    wcss.append(kmeans.inertia_)

print("WCSS for each K:")
for k, w in enumerate(wcss, 1):
    print(f"  K={k}: {w:.0f}")

# Fit with optimal K=3
kmeans = KMeans(n_clusters=3, init='k-means++', random_state=42)
labels = kmeans.fit_predict(X)
print(f"\\nK=3: {len(np.unique(labels))} clusters found")
print(f"Centroids:\\n{kmeans.cluster_centers_}")`
      }
    ],

    keyTerms: [
      { term: "Centroid", definition: "The center point of a cluster, computed as the mean of all assigned data points." },
      { term: "WCSS", definition: "Within-Cluster Sum of Squares -- measures how compact each cluster is." },
      { term: "K-Means++", definition: "Smart initialization that spreads initial centroids far apart for better convergence." },
      { term: "Elbow Method", definition: "Plotting WCSS vs K to find the optimal number of clusters at the 'elbow' point." },
      { term: "Convergence", definition: "When centroids stop moving between iterations, indicating the algorithm has settled." }
    ],

    relatedConcepts: ["DBSCAN", "Hierarchical Clustering", "PCA", "Feature Scaling", "Silhouette Score"]
  },

  // ═══════════════════════════════════════════════════════════
  // 10. LOGISTIC REGRESSION
  // ═══════════════════════════════════════════════════════════
  {
    id: "logistic-regression",
    title: "Logistic Regression and Sigmoid Function",
    category: "ML Fundamentals",
    readTime: "7 min read",
    icon: "📊",
    color: "#14b8a6",
    tldr: "Logistic Regression is a fundamental classification algorithm that estimates the probability of a binary outcome using the sigmoid function. Despite its name, it's a classification algorithm that maps linear combinations to probabilities between 0 and 1.",

    whyItMatters: [
      { title: "Baseline Model", desc: "Logistic Regression is the 'hello world' of classification. Before trying complex models, always try logistic regression first -- it's fast, interpretable, and often surprisingly competitive.", icon: "🚀" },
      { title: "Medical Diagnosis", desc: "Hospitals use logistic regression to estimate the probability of disease based on patient features. The output probability directly tells doctors 'this patient has a 73% chance of having condition X.'", icon: "🏥" },
      { title: "Credit Scoring", desc: "Banks use logistic regression for loan approval because regulators require explainable models. Logistic regression provides clear coefficients: 'each $1K income increases approval odds by 12%.'", icon: "🏦" }
    ],

    diagrams: [
      {
        title: "Sigmoid Function",
        ascii: `
    P(y=1)
    1.0 │                    ●●●●●●●●●●
        │                ●●●●
    0.8 │             ●●●
        │           ●●
    0.5 │─ ─ ─ ─ ─●─ ─ ─ ─ ─ ─ ─ ─ ─ ← Decision boundary
        │        ●●
    0.2 │      ●●
        │   ●●●
    0.0 │●●●●●●●●●●
        └────────────────────────────▶ z = w·x + b
       -6        0          +6
    
    sigmoid(z) = 1 / (1 + e^(-z))
    
    z > 0  → P > 0.5 → Class 1
    z < 0  → P < 0.5 → Class 0
    z = 0  → P = 0.5 → Uncertain
        `,
        explanation: "The sigmoid squashes any number into the range (0, 1), turning it into a probability. The steeper the curve, the more confident the predictions."
      }
    ],

    laymanExample: {
      title: "🎰 The Coin Flip with Bias",
      content: `Imagine flipping a coin, but the coin is biased based on some factors (weight, air resistance, how you flip it). Logistic Regression predicts: "Given these factors, what's the probability of heads?"

**Example: Will it rain tomorrow?**
- Features: cloud_cover=80%, humidity=90%, wind=15mph
- Logistic Regression computes: z = 0.8×cloud + 0.9×humidity + 0.2×wind - 3.5
- sigmoid(z) = 0.87
- Prediction: "87% chance of rain" → classify as "Rain"

**Why not just use linear regression?**
Linear regression could give you 150% or -30% -- probabilities must be between 0 and 1. The sigmoid function guarantees this. It's like a probability "clamp" that smoothly transitions from 0 to 1.`,
      realWorld: "Email spam detection: Logistic Regression takes features (word frequencies, sender reputation, link count) and outputs P(spam). If P(spam) > 0.5, it's classified as spam. The coefficients tell you exactly which words increase spam probability: 'free' = +2.3, 'winner' = +1.8, 'meeting' = -0.5."
    },

    howItWorks: [
      {
        title: "From Linear to Logistic",
        content: "Linear regression outputs z = w·x + b, which can be any real number. Logistic regression passes this through the sigmoid function: σ(z) = 1/(1+e^(-z)), squashing it to (0,1). This gives us a probability."
      },
      {
        title: "Learning with Cross-Entropy Loss",
        content: "Instead of MSE (which would be non-convex for probabilities), logistic regression uses binary cross-entropy loss: L = -[y·log(p) + (1-y)·log(1-p)]. This loss is convex, guaranteeing convergence to the global minimum via gradient descent."
      },
      {
        title: "Decision Boundary",
        content: "The decision boundary is where P(y=1) = 0.5, i.e., where z = w·x + b = 0. This is always a linear boundary (hyperplane) in the feature space. For non-linear boundaries, add polynomial features or use kernel methods."
      }
    ],

    pitfalls: [
      '"Logistic regression outputs probabilities" -- It outputs scores that can be calibrated to probabilities. Without calibration, the raw scores may not be true probabilities.',
      '"It handles non-linear data" -- Pure logistic regression is linear. Add polynomial features or use kernels for non-linearity.',
      '"Feature scaling doesn\'t matter" -- Logistic regression uses gradient descent; unscaled features cause slow convergence or poor results.',
      '"It works well with imbalanced data" -- Without class weighting or resampling, logistic regression biases toward the majority class.'
    ],

    codeExamples: [
      {
        title: "Logistic Regression -- Complete Pipeline",
        language: "Python",
        code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Create dataset
X, y = make_classification(n_samples=500, n_features=10, n_informative=5, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Pipeline with scaling
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('logreg', LogisticRegression(max_iter=1000))
])
pipe.fit(X_train, y_train)

y_pred = pipe.predict(X_test)
y_prob = pipe.predict_proba(X_test)[:, 1]

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"\\n{classification_report(y_test, y_pred)}")

# Inspect coefficients
coefs = pipe.named_steps['logreg'].coef_[0]
print("Feature Importance (coefficients):")
for i, c in enumerate(coefs):
    print(f"  Feature {i}: {c:+.3f}")`
      }
    ],

    keyTerms: [
      { term: "Sigmoid Function", definition: "σ(z) = 1/(1+e^(-z)), maps any real number to (0,1)." },
      { term: "Log-Odds", definition: "The natural log of the odds ratio: log(p/(1-p)). Linear in the features." },
      { term: "Cross-Entropy Loss", definition: "Standard loss for classification: -[y·log(p) + (1-y)·log(1-p)]." },
      { term: "Decision Boundary", definition: "The hyperplane where P(y=1) = 0.5, i.e., z = 0." },
      { term: "Coefficient", definition: "Weight learned for each feature, indicating its contribution to the log-odds." }
    ],

    relatedConcepts: ["Gradient Descent", "Binary Classification", "Sigmoid Function", "Cross-Entropy Loss", "Feature Scaling"]
  },

  // ═══════════════════════════════════════════════════════════
  // 11. L1 vs L2 REGULARIZATION
  // ═══════════════════════════════════════════════════════════
  {
    id: "l1-l2-regularization",
    title: "L1 Lasso vs L2 Ridge Regularization",
    category: "ML Fundamentals",
    readTime: "8 min read",
    icon: "🛡️",
    color: "#ef4444",
    tldr: "L1 (Lasso) and L2 (Ridge) regularization prevent overfitting by penalizing large model weights. L1 drives some weights to exactly zero (feature selection), while L2 shrinks all weights proportionally (keeps all features).",

    whyItMatters: [
      { title: "Feature Selection", desc: "L1 regularization automatically selects the most important features by driving irrelevant feature weights to zero. This is crucial when you have hundreds of features but only a few matter.", icon: "🎯" },
      { title: "Preventing Overfitting", desc: "Both L1 and L2 prevent the model from relying too heavily on any single feature, improving generalization to unseen data.", icon: "🛡️" },
      { title: "High-Dimensional Data", desc: "When features outnumber samples (genomics, NLP), regularization is essential to prevent the model from memorizing noise in the training data.", icon: "📊" }
    ],

    diagrams: [
      {
        title: "L1 vs L2 Geometric Intuition",
        ascii: `
    L1 (LASSO)                    L2 (RIDGE)
    
    Loss contours:               Loss contours:
    
      ╱ ╲                          ╱ ╲
     ╱   ╲                        ╱   ╲
    ╱  ●  ╲                      ╱  ●  ╲
     ╲   ╱                        ╲   ╱
      ╲ ╱                          ╲ ╱
    
    Constraint: |w1|+|w2|≤c       Constraint: w1²+w2²≤c
    
         ◇ ← diamond              ○ ← circle
    
    Solution: corner of diamond    Solution: tangent point
    
    Result: w1 = 0 (exact)         Result: w1 ≈ 0.3 (shrunk)
    
    ═══════════════════════════════════════════
    
    L1 = Feature Selection        L2 = Weight Shrinkage
    Some weights → 0 exactly      All weights → smaller values
    Sparse models                 Dense models with small weights
        `,
        explanation: "L1's diamond shape touches the loss contour at a corner (axis), setting that weight to zero. L2's circle touches at a tangent point, shrinking but never zeroing weights."
      }
    ],

    laymanExample: {
      title: "🧳 Packing for a Trip",
      content: `You're packing for a trip and have limited luggage space (the "budget"):

**L1 (Lasso) = ruthless decluttering:**
"You can only bring 3 items. Pick the 3 most important."
→ You bring: passport, phone, charger. Everything else stays home.
→ Result: sparse model (few features, each important)

**L2 (Ridge) = squeezing everything in:**
"You can bring everything, but make everything smaller."
→ You bring all items but use travel-size toiletries, fold everything tightly.
→ Result: dense model (all features, but small weights)

**When to use which:**
- Have 1000 features but only 10 matter? → Use L1 (Lasso) to find the 10
- All features matter but you need to prevent overfitting? → Use L2 (Ridge)
- Not sure? → Use Elastic Net (combines both)`,
      realWorld: "Predicting house prices with 50 features: L1 (Lasso) might keep only 'square_footage', 'bedrooms', 'zip_code' (3 features) and zero out the rest. L2 (Ridge) keeps all 50 but makes their coefficients smaller, so no single feature dominates."
    },

    howItWorks: [
      {
        title: "L1 Regularization (Lasso)",
        content: "Adds penalty = λ × Σ|wᵢ| to the loss function. The absolute value penalty creates a 'diamond' constraint region. When the loss contour touches a corner of the diamond, the corresponding weight becomes exactly zero -- automatic feature selection."
      },
      {
        title: "L2 Regularization (Ridge)",
        content: "Adds penalty = λ × Σwᵢ² to the loss function. The squared penalty creates a 'circular' constraint region. Weights are shrunk proportionally but never reach exactly zero. All features remain in the model."
      },
      {
        title: "Elastic Net",
        content: "Combines L1 and L2: penalty = α×L1 + (1-α)×L2. This gets the feature selection of Lasso with the stability of Ridge. When features are correlated, Elastic Net often outperforms either alone."
      }
    ],

    pitfalls: [
      '"L1 always selects the right features" -- With highly correlated features, L1 arbitrarily picks one and zeros the others. Elastic Net handles this better.',
      '"Higher regularization is always safer" -- Too much regularization underfits. Always tune λ via cross-validation.',
      '"L2 makes weights zero" -- L2 only shrinks weights toward zero but never exactly to zero. Use L1 for feature selection.',
      '"Regularization replaces the need for feature engineering" -- Regularization helps, but good feature engineering is still essential for model performance.'
    ],

    codeExamples: [
      {
        title: "L1 vs L2 Comparison",
        language: "Python",
        code: `import numpy as np
from sklearn.linear_model import Lasso, Ridge, ElasticNet
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split

# Dataset with 20 features, only 5 informative
X, y = make_regression(n_samples=200, n_features=20, n_informative=5, 
                       noise=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# L1 (Lasso) -- some weights become exactly 0
lasso = Lasso(alpha=1.0).fit(X_train, y_train)
print("LASSO coefficients:")
print(f"  Non-zero: {np.sum(lasso.coef_ != 0)}/20")
print(f"  Coefficients: {np.round(lasso.coef_, 2)}")
print(f"  Test R²: {lasso.score(X_test, y_test):.3f}")

# L2 (Ridge) -- all weights shrunk but none zero
ridge = Ridge(alpha=1.0).fit(X_train, y_train)
print(f"\\nRIDGE coefficients:")
print(f"  Non-zero: {np.sum(ridge.coef_ != 0)}/20")
print(f"  Coefficients: {np.round(ridge.coef_, 2)}")
print(f"  Test R²: {ridge.score(X_test, y_test):.3f}")

# Elastic Net -- combination
en = ElasticNet(alpha=1.0, l1_ratio=0.5).fit(X_train, y_train)
print(f"\\nELASTIC NET:")
print(f"  Non-zero: {np.sum(en.coef_ != 0)}/20")
print(f"  Test R²: {en.score(X_test, y_test):.3f}")`
      }
    ],

    keyTerms: [
      { term: "L1 Regularization (Lasso)", definition: "Penalizes absolute values of weights, driving some to exactly zero for feature selection." },
      { term: "L2 Regularization (Ridge)", definition: "Penalizes squared values of weights, shrinking all proportionally without zeroing any." },
      { term: "Elastic Net", definition: "Combines L1 and L2 penalties, getting feature selection of Lasso with stability of Ridge." },
      { term: "Regularization Strength (λ)", definition: "Hyperparameter controlling penalty magnitude. Higher λ = more regularization." },
      { term: "Sparsity", definition: "A model property where many weights are exactly zero. L1 promotes sparsity." }
    ],

    relatedConcepts: ["Overfitting", "Feature Selection", "Bias-Variance Tradeoff", "Cross-Validation", "Elastic Net"]
  },

  // ═══════════════════════════════════════════════════════════
  // 12. PCA DIMENSIONALITY REDUCTION
  // ═══════════════════════════════════════════════════════════
  {
    id: "pca-dimensionality",
    title: "PCA vs t-SNE Dimensionality Reduction",
    category: "ML Fundamentals",
    readTime: "9 min read",
    icon: "📉",
    color: "#6366f1",
    tldr: "PCA finds linear directions of maximum variance for dimensionality reduction, while t-SNE preserves local neighborhood structure for visualization. PCA is fast and deterministic; t-SNE is stochastic and computationally intensive but reveals clusters.",

    whyItMatters: [
      { title: "Data Visualization", desc: "High-dimensional data (e.g., 1000 features) can't be plotted. PCA/t-SNE reduce to 2-3 dimensions for visual inspection of clusters and patterns.", icon: "📊" },
      { title: "Feature Compression", desc: "PCA reduces 100 features to 10 principal components while retaining 95% of variance, speeding up model training without significant information loss.", icon: "⚡" },
      { title: "Anomaly Detection", desc: "In PCA's reduced space, outliers appear far from the main cluster. Financial institutions use this to detect unusual transaction patterns.", icon: "🔍" }
    ],

    diagrams: [
      {
        title: "PCA vs t-SNE Comparison",
        ascii: `
    PCA (Global Structure)          t-SNE (Local Structure)
    
    ●●●●●●  ○○○○○○○                ●●●●    ○○○○
    ●●●●●●  ○○○○○○○               ●●●●●  ○○○○○
    ●●●●●●  ○○○○○○○                ●●●●    ○○○○
    
    ● = Cluster A                  ● = Cluster A (tight)
    ○ = Cluster B                  ○ = Cluster B (tight)
    
    Preserves: global distances     Preserves: local neighborhoods
    Fast: O(n·d²)                  Slow: O(n²)
    Deterministic                  Stochastic (different each run)
    Good for: feature extraction   Good for: visualization
    Bad for: non-linear data       Bad for: global distances
        `,
        explanation: "PCA is like a satellite photo -- shows the big picture. t-SNE is like a microscope -- reveals local detail but loses global context."
      }
    ],

    laymanExample: {
      title: "🗺️ Map Projections Analogy",
      content: `You're trying to put the 3D Earth onto a 2D map:

**PCA is like Mercator projection:**
- Preserves the shape of continents (global structure)
- But distorts sizes near the poles (loses local accuracy)
- Fast to compute -- just a mathematical formula

**t-SNE is like a detailed street map of each city:**
- Perfectly shows each neighborhood (local structure)
- But the distance between cities on the map is meaningless
- Slow to compute -- must analyze every pair of points

**When to use which:**
- Want to reduce 1000 features to 10 for your model? → PCA (fast, preserves variance)
- Want to visualize 10,000 data points as a 2D scatter plot to see clusters? → t-SNE (reveals hidden patterns)`,
      realWorld: "Customer data with 50 features (age, income, purchase history, etc.): PCA reduces to 3 components capturing 85% of variance. Now you can plot customers in 3D and see: 'Ah, there's a cluster of young high-spenders in the top-right!' t-SNE would show even more granular sub-clusters."
    },

    howItWorks: [
      {
        title: "PCA: The Linear Workhorse",
        content: "PCA finds the directions of maximum variance in the data (principal components). It calculates the covariance matrix, finds eigenvectors (principal components), and projects data onto the top-k components. Because it's linear, PCA is fast and deterministic."
      },
      {
        title: "t-SNE: The Non-Linear Specialist",
        content: "t-SNE converts distances between points into conditional probabilities, then uses gradient descent to minimize KL divergence between high-dimensional and low-dimensional probability distributions. It focuses on preserving local neighborhoods."
      },
      {
        title: "Key Differences",
        content: "PCA is global (preserves overall variance), deterministic, fast, and good for feature extraction. t-SNE is local (preserves neighborhoods), stochastic, slow, and good for visualization only -- it doesn\'t learn a mapping for new data."
      }
    ],

    pitfalls: [
      '"t-SNE preserves global distances" -- False. t-SNE prioritizes local neighborhoods. The distance between distant clusters is often meaningless.',
      '"PCA is always better because it\'s faster" -- PCA fails on non-linear data. t-SNE captures complex cluster structures PCA misses.',
      '"t-SNE results are reproducible" -- t-SNE is stochastic. Always set random_state and try multiple perplexity values.',
      '"Use t-SNE for feature reduction in models" -- t-SNE doesn\'t learn a parametric mapping. You can\'t project new, unseen data into the same space.'
    ],

    codeExamples: [
      {
        title: "PCA vs t-SNE Visualization",
        language: "Python",
        code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits

# Load sample data (digits dataset)
digits = load_digits()
X = digits.data
y = digits.target

# PCA: Linear reduction to 2 dimensions
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
print(f"PCA variance explained: {pca.explained_variance_ratio_.sum():.2%}")

# t-SNE: Non-linear reduction to 2 dimensions
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X)

print(f"PCA shape: {X_pca.shape}")
print(f"t-SNE shape: {X_tsne.shape}")
print("PCA preserves global variance; t-SNE reveals local clusters")`
      }
    ],

    keyTerms: [
      { term: "Dimensionality Reduction", definition: "Reducing the number of features while preserving important information." },
      { term: "Principal Component", definition: "A direction of maximum variance found by PCA." },
      { term: "Explained Variance Ratio", definition: "Proportion of total variance captured by each principal component." },
      { term: "KL Divergence", definition: "Measure of how one probability distribution differs from another; minimized by t-SNE." },
      { term: "Perplexity", definition: "t-SNE parameter balancing local vs global attention. Typically 5-50." },
      { term: "Manifold Learning", definition: "Non-linear dimensionality reduction assuming data lies on a lower-dimensional manifold." }
    ],

    relatedConcepts: ["Feature Engineering", "Data Visualization", "Curse of Dimensionality", "UMAP", "Autoencoders"]
  }
];

export default ML_FUNDAMENTALS;
