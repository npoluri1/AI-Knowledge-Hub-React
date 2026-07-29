# Edureka Generative AI Masters Program - Course 3: Machine Learning with Python

## Modules 17-20: Enhanced Content with Use Cases, Diagrams, and Projects

---

# Table of Contents

- [Module 17: Advanced Classification Algorithms](#module-17)
- [Module 18: Time Series Analysis & Forecasting](#module-18)
- [Module 19: Natural Language Processing with Python](#module-19)
- [Module 20: ML Model Deployment](#module-20)
- [Capstone Project: Credit Risk Assessment Pipeline](#capstone)

---

# Module 17: Advanced Classification Algorithms

## Ensemble Methods

### Random Forest Classifier

`python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, confusion_matrix, classification_report, roc_auc_score)
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(42)
n_samples = 2000
X = np.random.randn(n_samples, 10)
y = (X[:, 0] * 2 + X[:, 1] * 1.5 + np.random.randn(n_samples) * 0.5 > 0).astype(int)

feature_names = [f'feature_{i}' for i in range(10)]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

rf = RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=5,
                            min_samples_leaf=2, max_features='sqrt', random_state=42,
                            n_jobs=-1, oob_score=True)
rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)
y_prob = rf.predict_proba(X_test)[:, 1]

print('Random Forest Results')
print(f'Accuracy:  {accuracy_score(y_test, y_pred):.4f}')
print(f'Precision: {precision_score(y_test, y_pred):.4f}')
print(f'Recall:    {recall_score(y_test, y_pred):.4f}')
print(f'F1 Score:  {f1_score(y_test, y_pred):.4f}')
print(f'ROC AUC:   {roc_auc_score(y_test, y_prob):.4f}')
print(f'OOB Score: {rf.oob_score_:.4f}')

importance = pd.DataFrame({'feature': feature_names, 'importance': rf.feature_importances_
                           }).sort_values('importance', ascending=False)
print('Feature Importance:')
print(importance.to_string(index=False))

cv_scores = cross_val_score(rf, X, y, cv=5, scoring='accuracy')
print(f'CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})')

cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Random Forest Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
plt.savefig('rf_confusion_matrix.png', dpi=150)
plt.show()
`

### Gradient Boosting Classifier

`python
from sklearn.ensemble import GradientBoostingClassifier
import time

start_time = time.time()
gb = GradientBoostingClassifier(n_estimators=200, learning_rate=0.1, max_depth=5,
                                 min_samples_split=5, min_samples_leaf=2,
                                 subsample=0.8, max_features='sqrt', random_state=42)
gb.fit(X_train, y_train)
gb_time = time.time() - start_time

y_pred_gb = gb.predict(X_test)
y_prob_gb = gb.predict_proba(X_test)[:, 1]

print('Gradient Boosting Results')
print(f'Training Time: {gb_time:.4f}s')
print(f'Accuracy:  {accuracy_score(y_test, y_pred_gb):.4f}')
print(f'Precision: {precision_score(y_test, y_pred_gb):.4f}')
print(f'Recall:    {recall_score(y_test, y_pred_gb):.4f}')
print(f'F1 Score:  {f1_score(y_test, y_pred_gb):.4f}')
print(f'ROC AUC:   {roc_auc_score(y_test, y_prob_gb):.4f}')

train_scores, test_scores = [], []
for y_ps in gb.staged_predict(X_test):
    test_scores.append(accuracy_score(y_test, y_ps))
for y_ps in gb.staged_predict(X_train):
    train_scores.append(accuracy_score(y_train, y_ps))

plt.figure(figsize=(10, 6))
plt.plot(range(1, len(train_scores) + 1), train_scores, label='Train Accuracy')
plt.plot(range(1, len(test_scores) + 1), test_scores, label='Test Accuracy')
plt.xlabel('Number of Trees')
plt.ylabel('Accuracy')
plt.title('Gradient Boosting Learning Curve')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig('gb_learning_curve.png', dpi=150)
plt.show()
`

### AdaBoost Classifier

`python
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

ada = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1),
                          n_estimators=100, learning_rate=0.5,
                          algorithm='SAMME', random_state=42)
ada.fit(X_train, y_train)

y_pred_ada = ada.predict(X_test)
y_prob_ada = ada.predict_proba(X_test)[:, 1]

print('AdaBoost Results')
print(f'Accuracy:  {accuracy_score(y_test, y_pred_ada):.4f}')
print(f'Precision: {precision_score(y_test, y_pred_ada):.4f}')
print(f'Recall:    {recall_score(y_test, y_pred_ada):.4f}')
print(f'F1 Score:  {f1_score(y_test, y_pred_ada):.4f}')
print(f'ROC AUC:   {roc_auc_score(y_test, y_prob_ada):.4f}')

print('\nEnsemble Methods Comparison')
print('=' * 50)
results = {
    'Random Forest':  {'Accuracy': accuracy_score(y_test, y_pred),  'F1': f1_score(y_test, y_pred),  'AUC': roc_auc_score(y_test, y_prob)},
    'Gradient Boost': {'Accuracy': accuracy_score(y_test, y_pred_gb), 'F1': f1_score(y_test, y_pred_gb), 'AUC': roc_auc_score(y_test, y_prob_gb)},
    'AdaBoost':       {'Accuracy': accuracy_score(y_test, y_pred_ada), 'F1': f1_score(y_test, y_pred_ada), 'AUC': roc_auc_score(y_test, y_prob_ada)}
}
print(pd.DataFrame(results).T.to_string())
`

## Stacking and Voting Classifiers

`python
from sklearn.ensemble import StackingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
import xgboost as xgb
import lightgbm as lgb

base_estimators = [
    ('rf',  RandomForestClassifier(n_estimators=100, random_state=42)),
    ('gb',  GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ('svm', SVC(kernel='rbf', probability=True, random_state=42)),
    ('knn', KNeighborsClassifier(n_neighbors=5)),
    ('mlp', MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=300, random_state=42))
]

stacking_clf = StackingClassifier(
    estimators=base_estimators,
    final_estimator=LogisticRegression(random_state=42),
    cv=5, stack_method='predict_proba', n_jobs=-1, passthrough=True
)

start_time = time.time()
stacking_clf.fit(X_train, y_train)
stacking_time = time.time() - start_time

y_pred_stack = stacking_clf.predict(X_test)
y_prob_stack = stacking_clf.predict_proba(X_test)[:, 1]

print('Stacking Classifier Results')
print(f'Training Time: {stacking_time:.4f}s')
print(f'Accuracy:  {accuracy_score(y_test, y_pred_stack):.4f}')
print(f'F1 Score:  {f1_score(y_test, y_pred_stack):.4f}')
print(f'ROC AUC:   {roc_auc_score(y_test, y_prob_stack):.4f}')

# Voting Classifier
voting_clf = VotingClassifier(
    estimators=[
        ('rf',  RandomForestClassifier(n_estimators=100, random_state=42)),
        ('gb',  GradientBoostingClassifier(n_estimators=100, random_state=42)),
        ('xgb', xgb.XGBClassifier(n_estimators=100, use_label_encoder=False,
                                    eval_metric='logloss', random_state=42)),
        ('lgb', lgb.LGBMClassifier(n_estimators=100, random_state=42, verbose=-1)),
    ],
    voting='soft', weights=[1, 1, 1.5, 1.5]
)

voting_clf.fit(X_train, y_train)
y_pred_vote = voting_clf.predict(X_test)
y_prob_vote = voting_clf.predict_proba(X_test)[:, 1]

print('\nVoting Classifier Results')
print(f'Accuracy:  {accuracy_score(y_test, y_pred_vote):.4f}')
print(f'F1 Score:  {f1_score(y_test, y_pred_vote):.4f}')
print(f'ROC AUC:   {roc_auc_score(y_test, y_prob_vote):.4f}')
`

## Hyperparameter Optimization

`python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from scipy.stats import randint, uniform
import optuna
from optuna.samplers import TPESampler

# GridSearchCV
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(RandomForestClassifier(random_state=42), param_grid,
                            cv=5, scoring='accuracy', n_jobs=-1, verbose=1,
                            return_train_score=True)
grid_search.fit(X_train, y_train)

print('Grid Search Results')
print(f'Best Parameters: {grid_search.best_params_}')
print(f'Best CV Score: {grid_search.best_score_:.4f}')
print(f'Test Score: {grid_search.score(X_test, y_test):.4f}')

# RandomizedSearchCV
param_distributions = {
    'n_estimators': randint(50, 300),
    'max_depth': [5, 10, 15, 20, None],
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10),
    'max_features': ['sqrt', 'log2', None]
}

random_search = RandomizedSearchCV(RandomForestClassifier(random_state=42),
                                    param_distributions, n_iter=50, cv=5,
                                    scoring='accuracy', n_jobs=-1, random_state=42)
random_search.fit(X_train, y_train)

print('\nRandomized Search Results')
print(f'Best Parameters: {random_search.best_params_}')
print(f'Best CV Score: {random_search.best_score_:.4f}')

# Optuna Optimization
def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 20),
        'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
        'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
        'max_features': trial.suggest_categorical('max_features', ['sqrt', 'log2', None])
    }
    clf = RandomForestClassifier(**params, random_state=42, n_jobs=-1)
    score = cross_val_score(clf, X_train, y_train, cv=5, scoring='accuracy')
    return score.mean()

study = optuna.create_study(direction='maximize', sampler=TPESampler(seed=42))
study.optimize(objective, n_trials=50, show_progress_bar=True)

print('\nOptuna Results')
print(f'Best Value: {study.best_trial.value:.4f}')
print(f'Best Params: {study.best_trial.params}')

best_rf = RandomForestClassifier(**study.best_trial.params, random_state=42)
best_rf.fit(X_train, y_train)
print(f'Test Score: {best_rf.score(X_test, y_test):.4f}')
`

## Module 17 Design Diagrams

### ML Ensemble Pipeline Architecture

`
+------------------------------------------------------------------+
|                    ENSEMBLE ML PIPELINE                           |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-------------+    +---------------------+    |
|  |   Raw Data  |--> |   Feature   |--> |  Train/Val/Test     |    |
|  |   (CSV/DB)  |    | Engineering |    |  Split              |    |
|  +-------------+    +-------------+    +---------------------+    |
|                                                |                  |
|                           +--------------------+----------------+ |
|                           |                    |                | |
|                           v                    v                v |
|                  +----------------+  +----------------+  +---------+
|                  | Random Forest  |  | Gradient Boost |  |   SVM   |
|                  | (100 trees)    |  | (200 trees)    |  | (RBF)   |
|                  +----------------+  +----------------+  +---------+
|                           |                    |                | |
|                           v                    v                v |
|                  +----------------+  +----------------+  +---------+
|                  |    XGBoost     |  |   LightGBM     |  |  KNN    |
|                  | (n_est=200)    |  | (n_est=200)    |  | (k=5)   |
|                  +----------------+  +----------------+  +---------+
|                           |                    |                | |
|                           +--------+-----------+--------+------+ |
|                                    |                        |      |
|                           +--------v--------+    +---------v----+ |
|                           |   STACKING      |    |   VOTING     | |
|                           | (Meta-learner:  |    | (Soft Vote:  | |
|                           |  Logistic Reg)  |    |  Weighted)   | |
|                           +-----------------+    +--------------+ |
|                                    |                        |      |
|                                    v                        v      |
|                           +----------------------------------+    |
|                           |      FINAL PREDICTION           |    |
|                           +----------------------------------+    |
|                                    |                               |
|                                    v                               |
|                           +------------------+                     |
|                           |  Evaluation &    |                     |
|                           |  Metrics         |                     |
|                           +------------------+                     |
+------------------------------------------------------------------+
`

### Hyperparameter Optimization Flowchart

`
                    +-------------------+
                    |  Start            |
                    +-------------------+
                               |
                    +-------------------+
                    | Define Search     |
                    | Space (Params)    |
                    +-------------------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
     +----------------+ +------------+ +--------------+
     |   GridSearch   | |  Random    | |   Optuna     |
     |   (Exhaustive) | |  Search    | |   (TPE)      |
     +----------------+ +------------+ +--------------+
              |                |                |
              v                v                v
     +----------------+ +------------+ +--------------+
     | All Combinations| | Random N   | | Bayesian     |
     | Evaluated       | | Samples    | | Optimization |
     | (Slow)          | | (Faster)   | | (Smartest)   |
     +----------------+ +------------+ +--------------+
              |                |                |
              +----------------+----------------+
                               |
                    +-------------------+
                    | Cross Validation  |
                    | (k-fold)          |
                    +-------------------+
                               |
                    +-------------------+
                    | Select Best       |
                    | Parameters        |
                    +-------------------+
                               |
                    +-------------------+
                    | Retrain on Full   |
                    | Training Set      |
                    +-------------------+
                               |
                    +-------------------+
                    | Evaluate on       |
                    | Test Set          |
                    +-------------------+
`

## Module 17 Design Principles & Patterns

### Feature Store Pattern

```python
import joblib
from datetime import datetime
import hashlib

class FeatureStore:
    def __init__(self, store_path='./feature_store'):
        self.store_path = store_path
        self.metadata = {}

    def compute_features(self, df):
        features = pd.DataFrame()
        features['mean_val'] = df.mean(axis=1)
        features['std_val'] = df.std(axis=1)
        features['max_val'] = df.max(axis=1)
        features['min_val'] = df.min(axis=1)
        features['range_val'] = features['max_val'] - features['min_val']
        features['sq_feature_0'] = df.iloc[:, 0] ** 2
        features['interaction_01'] = df.iloc[:, 0] * df.iloc[:, 1]
        features['log_feature_0'] = np.log1p(np.abs(df.iloc[:, 0]))
        return features

    def save_features(self, features, feature_set_name):
        feature_hash = hashlib.md5(
            pd.util.hash_pandas_object(features).values.tobytes()
        ).hexdigest()[:8]
        version = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{feature_hash}"
        filepath = f"{self.store_path}/{feature_set_name}_v{version}.joblib"
        joblib.dump(features, filepath)
        self.metadata[feature_set_name] = {
            'version': version, 'filepath': filepath,
            'n_features': features.shape[1], 'n_samples': features.shape[0]
        }
        return filepath

    def load_features(self, feature_set_name, version=None):
        if version:
            filepath = f"{self.store_path}/{feature_set_name}_v{version}.joblib"
        else:
            filepath = self.metadata[feature_set_name]['filepath']
        return joblib.load(filepath)
```

### Model Registry Pattern

```python
class ModelRegistry:
    def __init__(self, registry_path='./model_registry'):
        self.registry_path = registry_path
        self.models = {}

    def register_model(self, model, model_name, metrics, params, tags=None):
        version = len([k for k in self.models if k.startswith(model_name)]) + 1
        model_id = f"{model_name}_v{version}"
        self.models[model_id] = {
            'model': model, 'metrics': metrics, 'params': params,
            'tags': tags or {}, 'created_at': datetime.now().isoformat(),
            'status': 'staging'
        }
        filepath = f"{self.registry_path}/{model_id}.joblib"
        joblib.dump(model, filepath)
        return model_id

    def promote_model(self, model_id, stage='production'):
        if model_id in self.models:
            self.models[model_id]['status'] = stage

    def get_production_model(self, model_name):
        for mid, info in self.models.items():
            if mid.startswith(model_name) and info['status'] == 'production':
                return self.models[mid]['model']
        return None

    def compare_models(self, model_name):
        versions = {k: v for k, v in self.models.items() if k.startswith(model_name)}
        comparison = []
        for mid, info in versions.items():
            comparison.append({'model_id': mid, 'status': info['status'], **info['metrics']})
        return pd.DataFrame(comparison)
```

### SOLID Principles for ML Pipelines

```python
# S - Single Responsibility
class DataIngestion:
    def load(self, filepath):
        return pd.read_csv(filepath)

class FeatureEngineer:
    def transform(self, df):
        features = df.copy()
        features['new_feature'] = features.iloc[:, 0] * features.iloc[:, 1]
        return features

class ModelTrainer:
    def __init__(self, model):
        self.model = model
    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)
        return self.model

class ModelEvaluator:
    def evaluate(self, model, X_test, y_test):
        return {
            'accuracy': accuracy_score(y_test, model.predict(X_test)),
            'f1': f1_score(y_test, model.predict(X_test))
        }

# D - Dependency Inversion
class IDataLoader:
    def load(self, path): raise NotImplementedError

class CSVLoader(IDataLoader):
    def load(self, path):
        return pd.read_csv(path)

class MLPipeline:
    def __init__(self, loader, engineer, trainer, evaluator):
        self.loader = loader
        self.engineer = engineer
        self.trainer = trainer
        self.evaluator = evaluator

    def run(self, data_path):
        data = self.loader.load(data_path)
        features = self.engineer.transform(data)
        return features
```

## Module 17 Use Cases

### Use Case 1: Credit Card Fraud Detection

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score, precision_recall_curve
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_samples = 10000
n_fraud = 200

normal_amounts = np.random.lognormal(mean=3.5, sigma=1.2, size=n_samples - n_fraud)
normal_features = np.random.randn(n_samples - n_fraud, 8)
fraud_amounts = np.random.lognormal(mean=5.5, sigma=1.5, size=n_fraud)
fraud_features = np.random.randn(n_fraud, 8) * 2 + 1

amounts = np.concatenate([normal_amounts, fraud_amounts])
features = np.vstack([normal_features, fraud_features])
labels = np.concatenate([np.zeros(n_samples - n_fraud), np.ones(n_fraud)])

df = pd.DataFrame(features, columns=[f'V{i}' for i in range(1, 9)])
df['Amount'] = amounts
df['Hour'] = np.random.randint(0, 24, n_samples)
df['DayOfWeek'] = np.random.randint(0, 7, n_samples)
df['IsWeekend'] = (df['DayOfWeek'] >= 5).astype(int)
df['AmountLog'] = np.log1p(df['Amount'])
df['AmountDeviation'] = np.abs(df['Amount'] - df['Amount'].mean()) / df['Amount'].std()
df['Target'] = labels.astype(int)

X = df.drop('Target', axis=1)
y = df['Target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

pipeline = ImbPipeline([
    ('scaler', StandardScaler()),
    ('smote', SMOTE(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=10,
                                           class_weight='balanced', random_state=42, n_jobs=-1))
])
pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]

print("CREDIT CARD FRAUD DETECTION")
print(f"ROC AUC: {roc_auc_score(y_test, y_prob):.4f}")
print(f"Average Precision: {average_precision_score(y_test, y_prob):.4f}")
print(classification_report(y_test, y_pred, target_names=['Normal', 'Fraud']))

precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
f1_scores = 2 * (precision * recall) / (precision + recall + 1e-8)
optimal_idx = np.argmax(f1_scores)
print(f"Optimal Threshold: {thresholds[optimal_idx]:.4f}")
print(f"F1 at Optimal: {f1_scores[optimal_idx]:.4f}")
```

**Alternative Approach (XGBoost with scale_pos_weight)**

```python
import xgboost as xgb

xgb_model = xgb.XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1,
                                scale_pos_weight=(n_samples - n_fraud) / n_fraud,
                                random_state=42, eval_metric='logloss')
xgb_model.fit(X_train, y_train)
y_pred_xgb = xgb_model.predict(X_test)
y_prob_xgb = xgb_model.predict_proba(X_test)[:, 1]

print("XGBoost Fraud Detection")
print(f"ROC AUC: {roc_auc_score(y_test, y_prob_xgb):.4f}")
print(classification_report(y_test, y_pred_xgb, target_names=['Normal', 'Fraud']))
```

### Use Case 2: Customer Churn Prediction

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import lightgbm as lgb

np.random.seed(42)
n_customers = 5000

data = {
    'tenure_months': np.random.randint(1, 72, n_customers),
    'monthly_charges': np.random.uniform(20, 100, n_customers),
    'total_charges': np.random.uniform(100, 7000, n_customers),
    'num_support_tickets': np.random.randint(0, 10, n_customers),
    'num_products': np.random.randint(1, 6, n_customers),
    'contract_type': np.random.choice(['Month-to-month', 'One year', 'Two year'],
                                       n_customers, p=[0.5, 0.3, 0.2]),
    'payment_method': np.random.choice(['Credit card', 'Bank transfer', 'Electronic check'],
                                        n_customers),
    'online_security': np.random.choice([0, 1], n_customers, p=[0.6, 0.4]),
    'tech_support': np.random.choice([0, 1], n_customers, p=[0.5, 0.5]),
    'paperless_billing': np.random.choice([0, 1], n_customers, p=[0.4, 0.6])
}
df = pd.DataFrame(data)

churn_prob = (
    0.3 * (df['contract_type'] == 'Month-to-month').astype(float) +
    0.2 * (df['num_support_tickets'] > 5).astype(float) +
    0.15 * (df['tenure_months'] < 12).astype(float) +
    0.1 * (df['monthly_charges'] > 70).astype(float) +
    0.1 * (df['online_security'] == 0).astype(float) +
    np.random.uniform(0, 0.15, n_customers)
)
df['churn'] = (churn_prob > 0.5).astype(int)

for col in ['contract_type', 'payment_method']:
    df[col] = LabelEncoder().fit_transform(df[col])

X = df.drop('churn', axis=1)
y = df['churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
    'XGBoost': xgb.XGBClassifier(n_estimators=100, use_label_encoder=False,
                                  eval_metric='logloss', random_state=42),
    'LightGBM': lgb.LGBMClassifier(n_estimators=100, random_state=42, verbose=-1)
}

print("CUSTOMER CHURN PREDICTION")
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    print(f"{name}: ROC AUC={roc_auc_score(y_test, y_prob):.4f}, Acc={accuracy_score(y_test, y_pred):.4f}")

importance = pd.DataFrame({
    'feature': X.columns,
    'importance': models['XGBoost'].feature_importances_
}).sort_values('importance', ascending=False)
print("
Top Features:")
print(importance.head(10).to_string(index=False))
```

### Use Case 3: Medical Diagnosis Classification

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

np.random.seed(42)
n_patients = 3000

X = np.column_stack([
    np.random.normal(55, 15, n_patients),    # age
    np.random.normal(27, 5, n_patients),     # BMI
    np.random.normal(130, 20, n_patients),   # systolic BP
    np.random.normal(200, 40, n_patients),   # cholesterol
    np.random.normal(100, 30, n_patients),   # glucose
    np.random.normal(75, 12, n_patients),    # heart rate
    np.random.normal(50, 15, n_patients),    # resting ECG
    np.random.normal(15, 5, n_patients),     # exercise hours/week
    np.random.choice([0, 1], n_patients, p=[0.6, 0.4]),  # smoker
    np.random.choice([0, 1], n_patients, p=[0.7, 0.3])   # diabetes family
])

risk_score = (
    0.02 * (X[:, 0] - 40) + 0.05 * (X[:, 1] - 25) + 0.03 * (X[:, 2] - 120) +
    0.01 * (X[:, 3] - 180) + 0.02 * (X[:, 4] - 90) + 0.8 * X[:, 8] +
    0.5 * X[:, 9] + np.random.normal(0, 1, n_patients)
)
y = (risk_score > np.percentile(risk_score, 70)).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

stacking_clf = StackingClassifier(
    estimators=[
        ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
        ('svc', SVC(kernel='rbf', probability=True, random_state=42)),
        ('lr', LogisticRegression(max_iter=1000, random_state=42))
    ],
    final_estimator=LogisticRegression(max_iter=1000), cv=5,
    stack_method='predict_proba'
)

pipeline = Pipeline([('scaler', StandardScaler()), ('classifier', stacking_clf)])
pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]

print("MEDICAL DIAGNOSIS - STACKING CLASSIFIER")
print(f"ROC AUC: {roc_auc_score(y_test, y_prob):.4f}")
print(classification_report(y_test, y_pred, target_names=['Healthy', 'At Risk']))

cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring='roc_auc')
print(f"CV ROC AUC: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
```

### Use Case 4: Email Spam Detection

```python
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline

emails = [
    ("Win a free iPhone now! Click here!", 1),
    ("Congratulations! You've won $1,000,000", 1),
    ("URGENT: Your account has been compromised", 1),
    ("Buy cheap medications online", 1),
    ("Free trial offer - limited time only", 1),
    ("Meeting tomorrow at 10am in conference room B", 0),
    ("Please review the quarterly report attached", 0),
    ("Can we reschedule our lunch to Thursday?", 0),
    ("The project deadline has been extended to Friday", 0),
    ("Your flight confirmation for next Monday", 0),
    ("Make money fast! Work from home!", 1),
    ("You have been selected for a special prize", 1),
    ("Discount on luxury watches - 90% off", 1),
    ("Claim your lottery winnings now", 1),
    ("Team building event next week - RSVP", 0),
    ("Budget review meeting notes attached", 0),
    ("New policy update - please read carefully", 0),
    ("Customer feedback survey results", 0),
    ("IT maintenance scheduled for Saturday", 0),
    ("Congratulations on your promotion!", 0),
] * 100

texts, labels = zip(*emails)
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
    ('classifier', VotingClassifier(
        estimators=[
            ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
            ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
        ],
        voting='soft'
    ))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("EMAIL SPAM DETECTION")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=['Ham', 'Spam']))
```

### Use Case 5: Image Classification with Ensemble

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler

X, y = make_classification(n_samples=2000, n_features=64, n_informative=40,
                            n_redundant=10, n_classes=5, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

ensemble = VotingClassifier(
    estimators=[
        ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
        ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
        ('svm', SVC(kernel='rbf', probability=True, random_state=42)),
    ],
    voting='soft', weights=[1, 1.5, 1.2]
)
ensemble.fit(X_train_scaled, y_train)
y_pred = ensemble.predict(X_test_scaled)

print("IMAGE CLASSIFICATION - ENSEMBLE")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))
```

### Use Case 6: Wine Quality Classification with Optuna

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import optuna

np.random.seed(42)
n_wines = 2000
data = {
    'fixed_acidity': np.random.uniform(4, 15, n_wines),
    'volatile_acidity': np.random.uniform(0.1, 1.5, n_wines),
    'citric_acid': np.random.uniform(0, 1.5, n_wines),
    'residual_sugar': np.random.uniform(0.5, 15, n_wines),
    'chlorides': np.random.uniform(0.01, 0.3, n_wines),
    'free_sulfur_dioxide': np.random.uniform(1, 70, n_wines),
    'total_sulfur_dioxide': np.random.uniform(10, 300, n_wines),
    'density': np.random.uniform(0.99, 1.04, n_wines),
    'pH': np.random.uniform(2.5, 4.5, n_wines),
    'sulphates': np.random.uniform(0.3, 2, n_wines),
    'alcohol': np.random.uniform(8, 15, n_wines)
}
df = pd.DataFrame(data)

quality_score = (
    0.3 * (df['alcohol'] - 8) / 7 + 0.2 * (df['sulphates'] - 0.3) / 1.7 +
    0.15 * (df['citric_acid'] / 1.5) - 0.15 * (df['volatile_acidity'] - 0.1) / 1.4 -
    0.1 * (df['chlorides'] - 0.01) / 0.29 + np.random.uniform(0, 0.2, n_wines)
)
df['quality'] = pd.cut(quality_score, bins=[-np.inf, 0.25, 0.5, 0.75, np.inf],
                         labels=['Poor', 'Average', 'Good', 'Excellent'])

X = df.drop('quality', axis=1)
le = LabelEncoder()
y = le.fit_transform(df['quality'])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 15),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
    }
    clf = GradientBoostingClassifier(**params, random_state=42)
    return cross_val_score(clf, X_train, y_train, cv=5, scoring='accuracy').mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=30, show_progress_bar=False)

best_clf = GradientBoostingClassifier(**study.best_params, random_state=42)
best_clf.fit(X_train, y_train)
print(f"Wine Quality Accuracy: {accuracy_score(y_test, best_clf.predict(X_test)):.4f}")
```

### Use Case 7: Sensor Fault Detection

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

np.random.seed(42)
n_readings = 5000

temperature = np.random.normal(25, 2, n_readings)
humidity = np.random.normal(50, 5, n_readings)
pressure = np.random.normal(1013, 5, n_readings)
vibration = np.random.normal(0.5, 0.1, n_readings)

n_faults = 500
fault_indices = np.random.choice(n_readings, n_faults, replace=False)
temperature[fault_indices] += np.random.normal(15, 5, n_faults)
humidity[fault_indices] = np.random.uniform(90, 100, n_faults)
pressure[fault_indices] = np.random.uniform(950, 980, n_faults)
vibration[fault_indices] *= np.random.uniform(3, 10, n_faults)

labels = np.zeros(n_readings)
labels[fault_indices] = 1

df = pd.DataFrame({
    'temperature': temperature, 'humidity': humidity,
    'pressure': pressure, 'vibration': vibration,
    'temp_rate': np.gradient(temperature), 'humid_rate': np.gradient(humidity),
    'pressure_rate': np.gradient(pressure), 'vibration_rate': np.gradient(vibration),
    'is_fault': labels.astype(int)
})

X = df.drop('is_fault', axis=1)
y = df['is_fault']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

iso_forest = IsolationForest(n_estimators=200, contamination=0.1, random_state=42)
iso_forest.fit(X_train)
iso_pred = (iso_forest.predict(X_test) == -1).astype(int)
print("Isolation Forest:")
print(classification_report(y_test, iso_pred, target_names=['Normal', 'Fault']))

rf_clf = RandomForestClassifier(n_estimators=200, max_depth=10, class_weight='balanced', random_state=42)
rf_clf.fit(X_train, y_train)
print("Random Forest:")
print(classification_report(y_test, rf_clf.predict(X_test), target_names=['Normal', 'Fault']))
```

### Use Case 8: Customer Segmentation Classification

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

np.random.seed(42)
n_customers = 4000
data = {
    'annual_income': np.random.lognormal(10.5, 0.8, n_customers),
    'spending_score': np.random.uniform(1, 100, n_customers),
    'age': np.random.randint(18, 70, n_customers),
    'frequency_visits': np.random.poisson(12, n_customers),
    'avg_transaction': np.random.lognormal(4, 0.5, n_customers),
    'membership_years': np.random.exponential(3, n_customers).clip(0, 20)
}
df = pd.DataFrame(data)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['segment'] = kmeans.fit_predict(X_scaled)

X = df.drop('segment', axis=1)
y = df['segment']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

ensemble = GradientBoostingClassifier(n_estimators=150, max_depth=5, learning_rate=0.1, random_state=42)
ensemble.fit(X_train, y_train)
y_pred = ensemble.predict(X_test)

print("CUSTOMER SEGMENTATION CLASSIFICATION")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=['Budget', 'Regular', 'Premium', 'VIP']))
```

## Module 17 Project Ideas

### Project 1: Multi-Model Employee Attrition Predictor

```python
# Project: Employee Attrition Prediction System
# Multi-model comparison with ensemble stacking

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, average_precision_score
import joblib

class DataProcessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = None

    def generate_data(self, n_samples=5000):
        np.random.seed(42)
        data = {
            'age': np.random.randint(22, 60, n_samples),
            'department': np.random.choice(['Engineering', 'Sales', 'HR', 'Marketing', 'Finance'], n_samples),
            'salary': np.random.lognormal(10.5, 0.5, n_samples),
            'years_at_company': np.random.exponential(4, n_samples).clip(0, 30),
            'satisfaction_score': np.random.uniform(1, 10, n_samples),
            'last_evaluation': np.random.uniform(0.3, 1.0, n_samples),
            'num_projects': np.random.randint(2, 8, n_samples),
            'avg_monthly_hours': np.random.normal(180, 40, n_samples).clip(80, 300),
            'work_accident': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'promotion_last_5years': np.random.choice([0, 1], n_samples, p=[0.97, 0.03]),
            'tenure': np.random.exponential(3, n_samples).clip(1, 20)
        }
        df = pd.DataFrame(data)
        attrition_prob = (
            0.3 * (df['satisfaction_score'] < 4).astype(float) +
            0.2 * (df['last_evaluation'] < 0.5).astype(float) +
            0.15 * (df['avg_monthly_hours'] > 250).astype(float) +
            0.1 * (df['num_projects'] > 5).astype(float) +
            0.1 * (df['years_at_company'] > 5).astype(float) +
            np.random.uniform(0, 0.15, n_samples)
        )
        df['attrition'] = (attrition_prob > 0.5).astype(int)
        return df

    def preprocess(self, df, fit=True):
        df_processed = df.copy()
        categorical_cols = df_processed.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if fit:
                le = LabelEncoder()
                df_processed[col] = le.fit_transform(df_processed[col])
                self.label_encoders[col] = le
            else:
                df_processed[col] = self.label_encoders[col].transform(df_processed[col])
        self.feature_names = df_processed.drop('attrition', axis=1).columns.tolist()
        X = df_processed.drop('attrition', axis=1).values
        y = df_processed['attrition'].values
        X = self.scaler.fit_transform(X) if fit else self.scaler.transform(X)
        return X, y

    def save(self, path='data_processor.joblib'):
        joblib.dump({'scaler': self.scaler, 'label_encoders': self.label_encoders,
                      'feature_names': self.feature_names}, path)

class AttritionPredictor:
    def __init__(self):
        self.models = {}
        self.results = {}

    def define_models(self):
        self.models = {
            'Random Forest': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42),
            'Stacking': StackingClassifier(
                estimators=[('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
                           ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
                           ('lr', LogisticRegression(max_iter=1000, random_state=42))],
                final_estimator=LogisticRegression(max_iter=1000), cv=5
            ),
            'Voting': VotingClassifier(
                estimators=[('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
                           ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42))],
                voting='soft'
            )
        }

    def train_and_evaluate(self, X_train, X_test, y_train, y_test):
        self.define_models()
        for name, model in self.models.items():
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)[:, 1]
            self.results[name] = {
                'accuracy': (y_pred == y_test).mean(),
                'roc_auc': roc_auc_score(y_test, y_prob),
                'avg_precision': average_precision_score(y_test, y_prob)
            }
            print(f"{name}: Acc={self.results[name]['accuracy']:.4f}, AUC={self.results[name]['roc_auc']:.4f}")

    def get_best_model(self):
        best_name = max(self.results, key=lambda x: self.results[x]['roc_auc'])
        return best_name, self.models[best_name]

    def save_best_model(self, path='best_attrition_model.joblib'):
        best_name, best_model = self.get_best_model()
        joblib.dump(best_model, path)
        return best_name

def main():
    processor = DataProcessor()
    predictor = AttritionPredictor()
    df = processor.generate_data(n_samples=5000)
    X, y = processor.preprocess(df, fit=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    predictor.train_and_evaluate(X_train, X_test, y_train, y_test)
    best_name = predictor.save_best_model()
    processor.save()
    print(f"Best Model: {best_name}")
    print(pd.DataFrame(predictor.results).T.to_string())

if __name__ == "__main__":
    main()
```

### Project 2: A/B Test Champion-Challenger System

```python
# Project: ML Model A/B Testing Framework

import numpy as np
import pandas as pd
from scipy import stats
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from datetime import datetime

class ABTestMLModels:
    def __init__(self, champion_model, challenger_model, confidence_level=0.95):
        self.champion = champion_model
        self.challenger = challenger_model
        self.confidence_level = confidence_level
        self.results = {'champion': [], 'challenger': []}

    def route_request(self, user_id):
        hash_val = hash(str(user_id)) % 100
        return 'champion' if hash_val < 50 else 'challenger'

    def predict(self, X, user_ids):
        predictions = []
        for i, uid in enumerate(user_ids):
            variant = self.route_request(uid)
            model = self.champion if variant == 'champion' else self.challenger
            pred = model.predict(X[i:i+1])[0]
            prob = model.predict_proba(X[i:i+1])[0][1]
            self.results[variant].append({'user_id': uid, 'prediction': pred, 'probability': prob})
            predictions.append(pred)
        return predictions

    def analyze_results(self):
        champion_probs = pd.DataFrame(self.results['champion'])['probability'].values
        challenger_probs = pd.DataFrame(self.results['challenger'])['probability'].values
        if len(champion_probs) < 30 or len(challenger_probs) < 30:
            return {"status": "insufficient_data"}
        t_stat, p_value = stats.ttest_ind(champion_probs, challenger_probs)
        diff_mean = challenger_probs.mean() - champion_probs.mean()
        se = np.sqrt(champion_probs.var()/len(champion_probs) + challenger_probs.var()/len(challenger_probs))
        significant = p_value < (1 - self.confidence_level)
        return {
            'champion_mean': champion_probs.mean(), 'challenger_mean': challenger_probs.mean(),
            'difference': diff_mean, 'p_value': p_value, 'significant': significant,
            'recommendation': 'promote_challenger' if significant and diff_mean > 0 else 'keep_champion'
        }

np.random.seed(42)
X = np.random.randn(2000, 10)
y = (X[:, 0] + X[:, 1] > 0).astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

champion = RandomForestClassifier(n_estimators=100, random_state=42)
challenger = GradientBoostingClassifier(n_estimators=150, random_state=42)
champion.fit(X_train, y_train)
challenger.fit(X_train, y_train)

ab_test = ABTestMLModels(champion, challenger)
user_ids = range(1000)
predictions = ab_test.predict(X_test[:len(user_ids)], user_ids)
analysis = ab_test.analyze_results()
print("A/B Test Results:")
for k, v in analysis.items():
    print(f"  {k}: {v}")
```

### Project 3: Real-Time Fraud Alert System

```python
# Project: Real-Time Fraud Detection & Alert System

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from collections import deque
from datetime import datetime
import time

class FraudAlertSystem:
    def __init__(self, model, scaler, alert_threshold=0.7):
        self.model = model
        self.scaler = scaler
        self.alert_threshold = alert_threshold
        self.transaction_buffer = deque(maxlen=10000)
        self.alerts = []
        self.metrics = {'total_transactions': 0, 'fraud_detected': 0, 'processing_times': deque(maxlen=1000)}

    def process_transaction(self, transaction):
        start_time = time.time()
        features = self.scaler.transform(transaction.reshape(1, -1))
        fraud_prob = self.model.predict_proba(features)[0][1]
        is_fraud = fraud_prob >= self.alert_threshold
        processing_time = time.time() - start_time
        result = {'timestamp': datetime.now().isoformat(), 'fraud_probability': fraud_prob, 'is_fraud': is_fraud, 'processing_time_ms': processing_time * 1000}
        self.transaction_buffer.append(result)
        self.metrics['total_transactions'] += 1
        self.metrics['processing_times'].append(processing_time * 1000)
        if is_fraud:
            self.metrics['fraud_detected'] += 1
            self.alerts.append({'severity': 'HIGH' if fraud_prob > 0.9 else 'MEDIUM', 'fraud_probability': fraud_prob, 'status': 'PENDING_REVIEW'})
        return result

    def get_dashboard_metrics(self):
        pt = list(self.metrics['processing_times'])
        return {
            'total_transactions': self.metrics['total_transactions'],
            'fraud_detected': self.metrics['fraud_detected'],
            'fraud_rate': self.metrics['fraud_detected'] / max(self.metrics['total_transactions'], 1),
            'avg_processing_time_ms': np.mean(pt) if pt else 0,
            'active_alerts': len([a for a in self.alerts if a['status'] == 'PENDING_REVIEW'])
        }

    def simulate_stream(self, n_transactions=500):
        np.random.seed(42)
        for i in range(n_transactions):
            transaction = np.random.randn(10)
            result = self.process_transaction(transaction)
            if (i + 1) % 100 == 0:
                m = self.get_dashboard_metrics()
                print(f"Metrics at {i+1}: Rate={m['fraud_rate']:.2%}, Alerts={m['active_alerts']}")
        return self.get_dashboard_metrics()

np.random.seed(42)
X = np.random.randn(3000, 10)
y = (X[:, 0] * 2 + X[:, 1] * 1.5 + np.random.randn(3000) * 0.3 > 2).astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

fraud_system = FraudAlertSystem(model, scaler, alert_threshold=0.6)
final_metrics = fraud_system.simulate_stream(n_transactions=500)
print("FINAL METRICS:", final_metrics)
```

---

# Module 18: Time Series Analysis & Forecasting

## ARIMA

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from sklearn.metrics import mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_points = 500
dates = pd.date_range(start='2020-01-01', periods=n_points, freq='D')
trend = np.linspace(100, 200, n_points)
seasonal = 20 * np.sin(2 * np.pi * np.arange(n_points) / 365.25)
noise = np.random.normal(0, 5, n_points)
values = trend + seasonal + noise
ts = pd.Series(values, index=dates)

def test_stationarity(series):
    result = adfuller(series.dropna())
    print("ADF TEST FOR STATIONARITY")
    print(f"ADF Statistic: {result[0]:.4f}")
    print(f"P-Value: {result[1]:.4f}")
    print(f"Lags Used: {result[2]}")
    print(f"Observations: {result[3]}")
    for key, value in result[4].items():
        print(f"  {key}: {value:.4f}")
    if result[1] < 0.05:
        print("=> Series is STATIONARY")
    else:
        print("=> Series is NON-STATIONARY")
    return result[1] < 0.05

is_stationary = test_stationarity(ts)
ts_diff = ts.diff().dropna()
test_stationarity(ts_diff)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
axes[0, 0].plot(ts)
axes[0, 0].set_title('Original Time Series')
axes[0, 1].plot(ts_diff)
axes[0, 1].set_title('Differenced Time Series')
plot_acf(ts_diff, ax=axes[1, 0], lags=40, title='ACF Plot')
plot_pacf(ts_diff, ax=axes[1, 1], lags=40, title='PACF Plot')
plt.tight_layout()
plt.savefig('arima_diagnostics.png', dpi=150)
plt.show()

train_size = int(len(ts) * 0.8)
train, test = ts[:train_size], ts[train_size:]

model = ARIMA(train, order=(5, 1, 2))
fitted_model = model.fit()

forecast_result = fitted_model.get_forecast(steps=len(test))
forecast = forecast_result.predicted_mean
conf_int = forecast_result.conf_int()

rmse = np.sqrt(mean_squared_error(test, forecast))
mae = mean_absolute_error(test, forecast)
mape = np.mean(np.abs((test - forecast) / test)) * 100

print(f"RMSE: {rmse:.4f}")
print(f"MAE:  {mae:.4f}")
print(f"MAPE: {mape:.2f}%")

plt.figure(figsize=(14, 7))
plt.plot(train.index, train, label='Training Data', color='blue')
plt.plot(test.index, test, label='Actual', color='green')
plt.plot(test.index, forecast, label='Forecast', color='red', linestyle='--')
plt.fill_between(test.index, conf_int.iloc[:, 0], conf_int.iloc[:, 1], alpha=0.2, color='red')
plt.title('ARIMA(5,1,2) Forecast')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('arima_forecast.png', dpi=150)
plt.show()

# Auto ARIMA
from pmdarima import auto_arima
auto_model = auto_arima(train, start_p=0, start_q=0, max_p=5, max_q=5,
                         m=12, d=None, seasonal=True, start_P=0, start_Q=0,
                         max_P=2, max_Q=2, trace=True, error_action='ignore',
                         suppress_warnings=True, stepwise=True)
print(f"Auto ARIMA Order: {auto_model.order}")
print(f"Auto ARIMA Seasonal: {auto_model.seasonal_order}")
auto_forecast = auto_model.predict(n_periods=len(test))
auto_rmse = np.sqrt(mean_squared_error(test, auto_forecast))
print(f"Auto ARIMA RMSE: {auto_rmse:.4f}")
```

## Prophet

```python
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics

df_prophet = pd.DataFrame({'ds': dates, 'y': values})
train_prophet = df_prophet[:train_size]
test_prophet = df_prophet[train_size:]

model_prophet = Prophet(
    growth='linear', seasonality_mode='multiplicative',
    yearly_seasonality=True, weekly_seasonality=True,
    daily_seasonality=False, changepoint_prior_scale=0.05,
    seasonality_prior_scale=10, interval_width=0.95
)
model_prophet.fit(train_prophet)

future = model_prophet.make_future_dataframe(periods=len(test), freq='D')
forecast_prophet = model_prophet.predict(future)
forecast_test = forecast_prophet.iloc[-len(test):]

rmse_prophet = np.sqrt(mean_squared_error(test, forecast_test['yhat']))
mae_prophet = mean_absolute_error(test, forecast_test['yhat'])
mape_prophet = np.mean(np.abs((test - forecast_test['yhat']) / test)) * 100

print(f"Prophet RMSE: {rmse_prophet:.4f}")
print(f"Prophet MAE:  {mae_prophet:.4f}")
print(f"Prophet MAPE: {mape_prophet:.2f}%")

fig = model_prophet.plot(forecast_prophet)
plt.title('Prophet Forecast')
plt.savefig('prophet_forecast.png', dpi=150, bbox_inches='tight')

fig_components = model_prophet.plot_components(forecast_prophet)
plt.savefig('prophet_components.png', dpi=150, bbox_inches='tight')

df_cv = cross_validation(model_prophet, initial='180 days', period='30 days', horizon='60 days')
df_p = performance_metrics(df_cv)
print("\nCross-Validation Metrics:")
print(df_p[['horizon', 'rmse', 'mae', 'mape']].to_string())

# Prophet with Additional Regressors
train_with_features = train_prophet.copy()
train_with_features['temperature'] = np.random.normal(25, 5, len(train_prophet))
train_with_features['holiday'] = np.random.choice([0, 1], len(train_prophet), p=[0.95, 0.05])

model_r = Prophet(changepoint_prior_scale=0.05, seasonality_prior_scale=10)
model_r.add_regressor('temperature')
model_r.add_regressor('holiday')
model_r.fit(train_with_features)

future_r = model_r.make_future_dataframe(periods=60, freq='D')
future_r['temperature'] = np.random.normal(25, 5, len(future_r))
future_r['holiday'] = np.random.choice([0, 1], len(future_r), p=[0.95, 0.05])
forecast_r = model_r.predict(future_r)
print("\nProphet with Regressors - Last 10 rows:")
print(forecast_r[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(10).to_string())
```

## LSTM for Time Series

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

np.random.seed(42)
tf.random.set_seed(42)

n_points = 1000
dates = pd.date_range(start='2020-01-01', periods=n_points, freq='D')
trend = np.linspace(100, 250, n_points)
seasonal = 30 * np.sin(2 * np.pi * np.arange(n_points) / 365.25)
weekly = 10 * np.sin(2 * np.pi * np.arange(n_points) / 7)
noise = np.random.normal(0, 5, n_points)
values = trend + seasonal + weekly + noise

data = pd.DataFrame({'date': dates, 'value': values})
data.set_index('date', inplace=True)

scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data[['value']])

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

SEQ_LENGTH = 30
X, y = create_sequences(scaled_data, SEQ_LENGTH)

train_size = int(0.8 * len(X))
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

print(f"Training: X={X_train.shape}, y={y_train.shape}")
print(f"Test: X={X_test.shape}, y={y_test.shape}")

model_lstm = Sequential([
    LSTM(64, return_sequences=True, input_shape=(SEQ_LENGTH, 1)),
    Dropout(0.2),
    LSTM(32, return_sequences=False),
    Dropout(0.2),
    Dense(16, activation='relu'),
    Dense(1)
])
model_lstm.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
model_lstm.summary()

early_stop = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6)

history = model_lstm.fit(X_train, y_train, epochs=100, batch_size=32,
                          validation_split=0.1, callbacks=[early_stop, reduce_lr], verbose=1)

y_pred_scaled = model_lstm.predict(X_test)
y_pred = scaler.inverse_transform(y_pred_scaled)
y_actual = scaler.inverse_transform(y_test)

rmse = np.sqrt(mean_squared_error(y_actual, y_pred))
mae = mean_absolute_error(y_actual, y_pred)
mape = np.mean(np.abs((y_actual - y_pred) / y_actual)) * 100

print(f"LSTM RMSE: {rmse:.4f}")
print(f"LSTM MAE:  {mae:.4f}")
print(f"LSTM MAPE: {mape:.2f}%")

fig, axes = plt.subplots(2, 1, figsize=(14, 10))
axes[0].plot(history.history['loss'], label='Training Loss')
axes[0].plot(history.history['val_loss'], label='Validation Loss')
axes[0].set_title('Training History')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

test_dates = data.index[train_size + SEQ_LENGTH:]
axes[1].plot(test_dates[:len(y_actual)], y_actual, label='Actual', color='green')
axes[1].plot(test_dates[:len(y_pred)], y_pred, label='Predicted', color='red', linestyle='--')
axes[1].set_title('LSTM Forecast vs Actual')
axes[1].legend()
axes[1].grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('lstm_results.png', dpi=150)
plt.show()

# Bidirectional LSTM
model_bilstm = Sequential([
    Bidirectional(LSTM(64, return_sequences=True), input_shape=(SEQ_LENGTH, 1)),
    Dropout(0.2),
    Bidirectional(LSTM(32, return_sequences=False)),
    Dropout(0.2),
    Dense(16, activation='relu'),
    Dense(1)
])
model_bilstm.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
model_bilstm.fit(X_train, y_train, epochs=100, batch_size=32,
                  validation_split=0.1, callbacks=[early_stop, reduce_lr], verbose=0)
y_pred_bilstm = scaler.inverse_transform(model_bilstm.predict(X_test))
rmse_bilstm = np.sqrt(mean_squared_error(y_actual, y_pred_bilstm))
print(f"\nBidirectional LSTM RMSE: {rmse_bilstm:.4f}")

# Multi-Step Forecasting
def forecast_future(model, last_sequence, n_steps, scaler):
    forecasts = []
    current_seq = last_sequence.copy()
    for _ in range(n_steps):
        pred = model.predict(current_seq.reshape(1, SEQ_LENGTH, 1), verbose=0)
        forecasts.append(pred[0, 0])
        current_seq = np.append(current_seq[1:], pred, axis=0)
    return scaler.inverse_transform(np.array(forecasts).reshape(-1, 1))

last_seq = scaled_data[-SEQ_LENGTH:]
future_forecast = forecast_future(model_lstm, last_seq, 30, scaler)
print("\n30-Day Future Forecast:")
for i, val in enumerate(future_forecast):
    print(f"  Day {i+1}: {val[0]:.2f}")
```

## Anomaly Detection

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, LSTM, RepeatVector, TimeDistributed

np.random.seed(42)
n_points = 1000
dates = pd.date_range(start='2020-01-01', periods=n_points, freq='H')

normal = 100 + 20 * np.sin(2 * np.pi * np.arange(n_points) / 24) +          5 * np.sin(2 * np.pi * np.arange(n_points) / (24 * 7))

n_anomalies = 30
anomaly_indices = np.random.choice(n_points, n_anomalies, replace=False)
values = normal.copy()
values[anomaly_indices] += np.random.choice([-1, 1], n_anomalies) * np.random.uniform(30, 60, n_anomalies)

data = pd.DataFrame({'datetime': dates, 'value': values})
data.set_index('datetime', inplace=True)

scaler = StandardScaler()
values_scaled = scaler.fit_transform(data[['value']])

# Isolation Forest
iso_forest = IsolationForest(n_estimators=200, contamination=0.03, random_state=42)
data['iso_anomaly'] = iso_forest.fit_predict(values_scaled)
data['iso_anomaly'] = data['iso_anomaly'].map({1: 0, -1: 1})
print(f"Isolation Forest anomalies: {data['iso_anomaly'].sum()}")

# DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
data['dbscan_anomaly'] = dbscan.fit_predict(values_scaled)
data['dbscan_anomaly'] = (data['dbscan_anomaly'] == -1).astype(int)
print(f"DBSCAN anomalies: {data['dbscan_anomaly'].sum()}")

# LSTM Autoencoder
SEQ_LENGTH = 30
def create_autoencoder_data(data, seq_length):
    sequences = []
    for i in range(len(data) - seq_length):
        sequences.append(data[i:i+seq_length])
    return np.array(sequences)

sequences = create_autoencoder_data(values_scaled, SEQ_LENGTH)
split = int(0.8 * len(sequences))
train_seq = sequences[:split]

input_layer = Input(shape=(SEQ_LENGTH, 1))
encoded = LSTM(16, activation='relu')(input_layer)
encoded = Dense(8, activation='relu')(encoded)
decoded = RepeatVector(SEQ_LENGTH)(encoded)
decoded = LSTM(16, activation='relu', return_sequences=True)(decoded)
decoded = TimeDistributed(Dense(1))(decoded)

autoencoder = Model(input_layer, decoded)
autoencoder.compile(optimizer='adam', loss='mse')
autoencoder.fit(train_seq, train_seq, epochs=50, batch_size=32, validation_split=0.1, verbose=0)

test_seq = sequences[split:]
reconstructions = autoencoder.predict(test_seq)
mse = np.mean(np.power(test_seq - reconstructions, 2), axis=(1, 2))
threshold = np.percentile(mse, 97)
anomalies = mse > threshold
print(f"LSTM Autoencoder anomalies: {anomalies.sum()}")

fig, axes = plt.subplots(3, 1, figsize=(14, 12))
axes[0].plot(data.index, data['value'], 'b-', linewidth=0.5)
axes[0].scatter(data.index[data['iso_anomaly'] == 1], data['value'][data['iso_anomaly'] == 1],
                color='red', s=20, label='Anomaly', zorder=5)
axes[0].set_title('Isolation Forest')
axes[0].legend()

axes[1].plot(data.index, data['value'], 'b-', linewidth=0.5)
axes[1].scatter(data.index[data['dbscan_anomaly'] == 1], data['value'][data['dbscan_anomaly'] == 1],
                color='red', s=20, label='Anomaly', zorder=5)
axes[1].set_title('DBSCAN')
axes[1].legend()

axes[2].plot(range(len(mse)), mse, 'b-', linewidth=0.5)
axes[2].axhline(y=threshold, color='r', linestyle='--', label='Threshold')
axes[2].set_title('LSTM Autoencoder Reconstruction Error')
axes[2].legend()
plt.tight_layout()
plt.savefig('anomaly_detection.png', dpi=150)
plt.show()
```

## Module 18 Design Diagrams

### Time Series Forecasting Pipeline

```
+------------------------------------------------------------------+
|              TIME SERIES FORECASTING PIPELINE                      |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-----------------+    +-------------------+   |
|  |  Raw Time   |--> |  Data Quality   |--> |  Missing Value    |   |
|  |  Series     |    |  Check          |    |  Imputation       |   |
|  +-------------+    +-----------------+    +-------------------+   |
|                                                |                  |
|                                                v                  |
|                                     +-------------------+         |
|                                     |  Stationarity     |         |
|                                     |  Test (ADF)       |         |
|                                     +-------------------+         |
|                                                |                  |
|                           +--------------------+----------------+ |
|                           |                    |                | |
|                           v                    v                v |
|                  +----------------+  +----------------+  +---------+
|                  |    ARIMA/      |  |    Prophet     |  |  LSTM   |
|                  |  SARIMA        |  |   (Facebook)   |  | (Keras) |
|                  +----------------+  +----------------+  +---------+
|                           |                    |                | |
|                           v                    v                v |
|                  +----------------+  +----------------+  +---------+
|                  | Auto ARIMA     |  | Prophet with   |  | Bi-LSTM |
|                  | (pmdarima)     |  | Regressors     |  | + Attn  |
|                  +----------------+  +----------------+  +---------+
|                           |                    |                | |
|                           +--------+-----------+--------+------+ |
|                                    |                        |      |
|                           +--------v--------+    +---------v----+ |
|                           |   ENSEMBLE       |    |  HYBRID      | |
|                           | (Weighted Avg)   |    |  (Stat+DL)   | |
|                           +-----------------+    +--------------+ |
|                                    |                        |      |
|                           +--------v------------------------v--+  |
|                           |       FORECAST OUTPUT              |  |
|                           +------------------------------------+  |
|                                    |                               |
|                                    v                               |
|                           +------------------+                     |
|                           |  Evaluation       |                     |
|                           |  RMSE/MAE/MAPE   |                     |
|                           +------------------+                     |
+------------------------------------------------------------------+
```

### ARIMA Decision Flowchart

```
                    +-------------------+
                    | Time Series Data  |
                    +-------------------+
                               |
                    +-------------------+
                    | ADF Stationarity  |
                    | Test              |
                    +-------------------+
                               |
                    +-------------------+
                    | P-value < 0.05?   |
                    +-------------------+
                               |
                   +-----------+-----------+
                   |                       |
                  YES                      NO
                   |                       |
                   v                       v
          +----------------+     +-------------------+
          | d = 0          |     | Apply Differencing|
          | (Stationary)   |     | d = 1, 2, ...     |
          +----------------+     +-------------------+
                   |                       |
                   |            +----------+----------+
                   |            |                     |
                   |           YES                    NO
                   |            |                     |
                   |            v                     v
                   |   +----------------+   +-------------------+
                   |   | Check ADF      |   | Increase d        |
                   |   | again          |   | until stationary  |
                   |   +----------------+   +-------------------+
                   |            |
                   +------+-----+
                          |
                   +-------------------+
                   | Examine ACF/PACF  |
                   | Plots             |
                   +-------------------+
                          |
            +-------------+-------------+
            |             |             |
            v             v             v
     +----------+  +-----------+  +-----------+
     | ACF cuts |  | PACF cuts |  | Both      |
     | at lag q |  | at lag p  |  | gradual   |
     | => MA(q) |  | => AR(p)  |  | => ARIMA  |
     +----------+  +-----------+  +-----------+
                          |
                   +-------------------+
                   | Fit ARIMA(p,d,q)  |
                   +-------------------+
                          |
                   +-------------------+
                   | Check Residuals   |
                   | (Ljung-Box Test)  |
                   +-------------------+
                          |
                   +-------------------+
                   | Residuals White   |
                   | Noise?            |
                   +-------------------+
                          |
               +----------+----------+
               |                     |
              YES                    NO
               |                     |
               v                     v
        +------------+      +------------------+
        | Model OK   |      | Tune Parameters  |
        | Forecast   |      | (p,d,q)          |
        +------------+      +------------------+
```

### LSTM Time Series Architecture

```
+------------------------------------------------------------------+
|                LSTM TIME SERIES ARCHITECTURE                       |
+------------------------------------------------------------------+
|                                                                    |
|  Input Sequence (t-n ... t-1, t)                                  |
|  +------+ +------+ +------+ +------+ +------+                     |
|  | t-30 | | t-29 | | ...  | | t-2  | | t-1  |                     |
|  +------+ +------+ +------+ +------+ +------+                     |
|       |        |        |        |        |                        |
|       v        v        v        v        v                        |
|  +-----------------------------------------------------------+   |
|  |              LSTM Layer (64 units)                         |   |
|  |  +--------+ +--------+ +--------+ +--------+ +--------+  |   |
|  |  |  Gate  | |  Gate  | |  Gate  | |  Cell  | | Output |  |   |
|  |  |  (f)   | |  (i)   | |  (o)   | | State  | |  (h)   |  |   |
|  |  +--------+ +--------+ +--------+ +--------+ +--------+  |   |
|  +-----------------------------------------------------------+   |
|                            |                                       |
|                     +--------------+                               |
|                     | Dropout 0.2  |                               |
|                     +--------------+                               |
|                            |                                       |
|  +-----------------------------------------------------------+   |
|  |              LSTM Layer (32 units)                         |   |
|  +-----------------------------------------------------------+   |
|                            |                                       |
|                     +--------------+                               |
|                     | Dropout 0.2  |                               |
|                     +--------------+                               |
|                            |                                       |
|                     +--------------+                               |
|                     | Dense (16)   |                               |
|                     | ReLU         |                               |
|                     +--------------+                               |
|                            |                                       |
|                     +--------------+                               |
|                     | Dense (1)    |                               |
|                     | Output       |                               |
|                     +--------------+                               |
|                            |                                       |
|                            v                                       |
|                     +--------------+                               |
|                     | Forecast     |                               |
|                     | (t+1)        |                               |
|                     +--------------+                               |
+------------------------------------------------------------------+
```

## Module 18 Use Cases

### Use Case 1: Stock Price Prediction

```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from sklearn.metrics import mean_squared_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_days = 1000
dates = pd.date_range(start='2020-01-01', periods=n_days, freq='B')

price = 100
prices = [price]
for _ in range(n_days - 1):
    price *= (1 + np.random.normal(0.0005, 0.02))
    prices.append(price)

stock_data = pd.DataFrame({
    'Date': dates, 'Close': prices,
    'Volume': np.random.randint(1000000, 10000000, n_days),
    'High': np.array(prices) * (1 + np.random.uniform(0, 0.02, n_days)),
    'Low': np.array(prices) * (1 - np.random.uniform(0, 0.02, n_days)),
})
stock_data.set_index('Date', inplace=True)

# LSTM
scaler = MinMaxScaler()
scaled_close = scaler.fit_transform(stock_data[['Close']])

SEQ_LEN = 60
X, y = [], []
for i in range(len(scaled_close) - SEQ_LEN):
    X.append(scaled_close[i:i+SEQ_LEN])
    y.append(scaled_close[i+SEQ_LEN])
X, y = np.array(X), np.array(y)

split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(SEQ_LEN, 1)),
    Dropout(0.2),
    LSTM(50, return_sequences=False),
    Dropout(0.2),
    Dense(25),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1, verbose=0)

y_pred_lstm = scaler.inverse_transform(model.predict(X_test))
y_actual = scaler.inverse_transform(y_test)
rmse_lstm = np.sqrt(mean_squared_error(y_actual, y_pred_lstm))

# ARIMA
train_close = stock_data['Close'][:int(0.8 * len(stock_data))]
test_close = stock_data['Close'][int(0.8 * len(stock_data)):]
arima_model = ARIMA(train_close, order=(5, 1, 2)).fit()
arima_forecast = arima_model.forecast(steps=len(test_close))
rmse_arima = np.sqrt(mean_squared_error(test_close, arima_forecast))

# Prophet
prophet_data = stock_data.reset_index()[['Date', 'Close']].rename(columns={'Date': 'ds', 'Close': 'y'})
train_p = prophet_data[:int(0.8 * len(prophet_data))]
test_p = prophet_data[int(0.8 * len(prophet_data)):]
prophet_model = Prophet(daily_seasonality=False, yearly_seasonality=True)
prophet_model.fit(train_p)
future = prophet_model.make_future_dataframe(periods=len(test_p), freq='B')
prophet_forecast = prophet_model.predict(future)
prophet_pred = prophet_forecast.iloc[-len(test_p):]['yhat'].values
rmse_prophet = np.sqrt(mean_squared_error(test_p['y'].values, prophet_pred))

print(f"LSTM RMSE:    {rmse_lstm:.4f}")
print(f"ARIMA RMSE:   {rmse_arima:.4f}")
print(f"Prophet RMSE: {rmse_prophet:.4f}")
```

### Use Case 2: Energy Demand Forecasting

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_hours = 365 * 24
dates = pd.date_range(start='2022-01-01', periods=n_hours, freq='H')
hour = np.tile(np.arange(24), 365)
day_of_week = np.tile(np.repeat(np.arange(7), 24), 365)

demand = (
    500 + 200 * np.sin(2 * np.pi * hour / 24 - np.pi/2) +
    100 * np.sin(2 * np.pi * day_of_week / 7) +
    np.random.normal(0, 30, n_hours)
)
temperature = 20 + 10 * np.sin(2 * np.pi * np.arange(n_hours) / (24 * 365)) + np.random.normal(0, 5, n_hours)

energy_df = pd.DataFrame({
    'datetime': dates, 'demand': demand, 'temperature': temperature,
    'hour': hour, 'day_of_week': day_of_week,
    'is_weekend': (day_of_week >= 5).astype(int)
})
energy_df.set_index('datetime', inplace=True)

features = ['hour', 'day_of_week', 'is_weekend', 'temperature']
X = energy_df[features]
y = energy_df['demand']
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

gb_model = GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)
gb_model.fit(X_train, y_train)
y_pred_gb = gb_model.predict(X_test)

rmse_gb = np.sqrt(mean_squared_error(y_test, y_pred_gb))
mae_gb = mean_absolute_error(y_test, y_pred_gb)
print(f"Energy Demand Forecasting - RMSE: {rmse_gb:.2f}, MAE: {mae_gb:.2f}")

importance = pd.DataFrame({'feature': features, 'importance': gb_model.feature_importances_
                           }).sort_values('importance', ascending=False)
print(importance.to_string(index=False))
```

### Use Case 3: Website Traffic Forecasting

```python
import numpy as np
import pandas as pd
from prophet import Prophet
from sklearn.metrics import mean_squared_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_days = 365
dates = pd.date_range(start='2023-01-01', periods=n_days, freq='D')

traffic = (
    10000 + 2000 * np.sin(2 * np.pi * np.arange(n_days) / 7) +
    500 * np.sin(2 * np.pi * np.arange(n_days) / 30) +
    1000 * np.linspace(0, 1, n_days) + np.random.normal(0, 500, n_days)
)
traffic[90:120] *= 1.5

traffic_df = pd.DataFrame({'ds': dates, 'y': traffic})
train = traffic_df[:int(0.8 * len(traffic_df))]
test = traffic_df[int(0.8 * len(traffic_df)):]

holidays = pd.DataFrame({
    'holiday': 'special_day', 'ds': dates[[1, 15, 45, 100, 200, 300, 355]],
    'lower_window': 0, 'upper_window': 2,
})

model = Prophet(holidays=holidays, changepoint_prior_scale=0.05,
                seasonality_mode='multiplicative')
model.fit(train)
future = model.make_future_dataframe(periods=len(test), freq='D')
forecast = model.predict(future)
forecast_test = forecast.iloc[-len(test):]

rmse = np.sqrt(mean_squared_error(test['y'], forecast_test['yhat']))
print(f"Website Traffic Forecasting RMSE: {rmse:.2f}")
print(f"RMSE/Mean: {rmse / test['y'].mean() * 100:.2f}%")
```

### Use Case 4: IoT Sensor Anomaly Detection

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_readings = 5000
dates = pd.date_range(start='2023-01-01', periods=n_readings, freq='5min')

temperature = 25 + 5 * np.sin(2 * np.pi * np.arange(n_readings) / 288) + np.random.normal(0, 1, n_readings)
anomaly_indices = np.random.choice(n_readings, 50, replace=False)
temperature[anomaly_indices] += np.random.choice([-1, 1], 50) * np.random.uniform(10, 20, 50)

sensor_df = pd.DataFrame({
    'datetime': dates, 'temperature': temperature,
    'rate_of_change': np.gradient(temperature),
    'rolling_mean': pd.Series(temperature).rolling(12).mean(),
    'rolling_std': pd.Series(temperature).rolling(12).std()
}).dropna()

scaler = StandardScaler()
features = ['temperature', 'rate_of_change', 'rolling_mean', 'rolling_std']
X_scaled = scaler.fit_transform(sensor_df[features])

iso_forest = IsolationForest(contamination=0.01, random_state=42)
sensor_df['is_anomaly'] = (iso_forest.fit_predict(X_scaled) == -1).astype(int)

print(f"IoT Anomalies detected: {sensor_df['is_anomaly'].sum()}")
print(f"Anomaly rate: {sensor_df['is_anomaly'].mean():.2%}")
```

### Use Case 5: Retail Sales Forecasting

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_weeks = 156
dates = pd.date_range(start='2021-01-01', periods=n_weeks, freq='W')

sales = 50000 + 10000 * np.sin(2 * np.pi * np.arange(n_weeks) / 52) +         5000 * np.linspace(0, 1, n_weeks) + np.random.normal(0, 3000, n_weeks)

sales_df = pd.DataFrame({
    'date': dates, 'sales': sales, 'week': np.arange(n_weeks),
    'month': dates.month, 'quarter': dates.quarter,
    'is_holiday_season': dates.month.isin([11, 12]).astype(int)
})

for lag in [1, 2, 4, 13]:
    sales_df[f'lag_{lag}'] = sales_df['sales'].shift(lag)
sales_df.dropna(inplace=True)

features = ['week', 'month', 'quarter', 'is_holiday_season', 'lag_1', 'lag_2', 'lag_4', 'lag_13']
X = sales_df[features]
y = sales_df['sales']
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

model = GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
print(f"Retail Sales - RMSE: {rmse:.2f}, MAE: {mae:.2f}, MAPE: {mape:.2f}%")
```

### Use Case 6: Weather Prediction

```python
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_days = 730
dates = pd.date_range(start='2022-01-01', periods=n_days, freq='D')

temperature = 15 + 10 * np.sin(2 * np.pi * np.arange(n_days) / 365.25) + np.random.normal(0, 3, n_days)

scaler = MinMaxScaler()
scaled_temp = scaler.fit_transform(temperature.reshape(-1, 1))

SEQ_LEN, PRED_LEN = 14, 7
X, y = [], []
for i in range(len(scaled_temp) - SEQ_LEN - PRED_LEN):
    X.append(scaled_temp[i:i+SEQ_LEN])
    y.append(scaled_temp[i+SEQ_LEN:i+SEQ_LEN+PRED_LEN].flatten())
X, y = np.array(X), np.array(y)

split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(SEQ_LEN, 1)),
    Dropout(0.2),
    LSTM(32, return_sequences=False),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(PRED_LEN)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1, verbose=0)

y_pred = scaler.inverse_transform(model.predict(X_test))
y_test_actual = scaler.inverse_transform(y_test)
rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred))
print(f"Weather Prediction RMSE: {rmse:.4f}C")
```

### Use Case 7: Supply Chain Demand Prediction

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_days = 365
dates = pd.date_range(start='2023-01-01', periods=n_days, freq='D')

demand = 1000 + 200 * np.sin(2 * np.pi * np.arange(n_days) / 7) +          100 * np.sin(2 * np.pi * np.arange(n_days) / 30) + np.random.poisson(50, n_days)

supply_df = pd.DataFrame({
    'date': dates, 'demand': demand,
    'price': 10 + np.random.normal(0, 2, n_days),
    'competitor_price': 10 + np.random.normal(0, 2, n_days),
    'is_promotion': np.random.choice([0, 1], n_days, p=[0.9, 0.1]),
    'day_of_week': dates.dayofweek, 'month': dates.month
})

for lag in [1, 7, 14]:
    supply_df[f'lag_{lag}'] = supply_df['demand'].shift(lag)
supply_df.dropna(inplace=True)

features = ['price', 'competitor_price', 'is_promotion', 'day_of_week', 'month', 'lag_1', 'lag_7', 'lag_14']
X = supply_df[features]
y = supply_df['demand']
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

for name, model in [('RF', RandomForestRegressor(n_estimators=100, random_state=42)),
                     ('GB', GradientBoostingRegressor(n_estimators=100, random_state=42))]:
    model.fit(X_train, y_train)
    rmse = np.sqrt(mean_squared_error(y_test, model.predict(X_test)))
    print(f"{name} RMSE: {rmse:.2f}")
```

### Use Case 8: Financial Ratio Time Series

```python
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n_quarters = 40
dates = pd.date_range(start='2014-01-01', periods=n_quarters, freq='Q')

roe = 12 + 3 * np.sin(2 * np.pi * np.arange(n_quarters) / 4) + np.random.normal(0, 1, n_quarters)

train = roe[:int(0.8 * len(roe))]
test = roe[int(0.8 * len(roe)):]

model = ARIMA(train, order=(2, 1, 1)).fit()
forecast = model.forecast(steps=len(test))
rmse = np.sqrt(mean_squared_error(test, forecast))
print(f"Financial Ratio (ROE) Forecasting RMSE: {rmse:.4f}%")
```

## Module 18 Project Ideas

### Project 1: Energy Consumption Forecaster

```python
# Project: Smart Energy Consumption Forecaster
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib

class EnergyForecaster:
    def __init__(self):
        self.models = {}
        self.scalers = {}

    def generate_data(self, n_days=730):
        np.random.seed(42)
        dates = pd.date_range(start='2022-01-01', periods=n_days * 24, freq='H')
        hour = np.tile(np.arange(24), n_days)
        day_of_week = np.tile(np.repeat(np.arange(7), 24), n_days)
        demand = (500 + 200 * np.sin(2 * np.pi * hour / 24 - np.pi/2) +
                  100 * np.sin(2 * np.pi * day_of_week / 7) +
                  np.random.normal(0, 30, len(dates)))
        temperature = 20 + 10 * np.sin(2 * np.pi * np.arange(len(dates)) / (24 * 365)) + np.random.normal(0, 5, len(dates))
        return pd.DataFrame({
            'datetime': dates[:len(demand)], 'demand': demand,
            'temperature': temperature, 'hour': hour[:len(demand)],
            'day_of_week': day_of_week[:len(demand)],
            'is_weekend': (day_of_week[:len(demand)] >= 5).astype(int)
        })

    def engineer_features(self, df):
        df = df.copy()
        for lag in [1, 24, 168]:
            df[f'lag_{lag}'] = df['demand'].shift(lag)
        for window in [24, 168]:
            df[f'rolling_mean_{window}'] = df['demand'].rolling(window).mean()
            df[f'rolling_std_{window}'] = df['demand'].rolling(window).std()
        df['temp_hour'] = df['temperature'] * df['hour']
        df['is_peak_hour'] = ((df['hour'] >= 8) & (df['hour'] <= 18)).astype(int)
        df.dropna(inplace=True)
        return df

    def train_gradient_boosting(self, X_train, X_test, y_train, y_test):
        model = GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        self.models['gradient_boosting'] = model
        return {'rmse': rmse, 'mae': mae}

    def run(self):
        df = self.generate_data()
        df = self.engineer_features(df)
        feature_cols = [c for c in df.columns if c not in ['datetime', 'demand']]
        X = df[feature_cols]
        y = df['demand']
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]
        gb_metrics = self.train_gradient_boosting(X_train, X_test, y_train, y_test)
        print(f"Gradient Boosting - RMSE: {gb_metrics['rmse']:.2f}, MAE: {gb_metrics['mae']:.2f}")
        return self.models

forecaster = EnergyForecaster()
forecaster.run()
```

### Project 2: Anomaly Detection Dashboard

```python
# Project: Real-Time Anomaly Detection System
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from collections import deque
from datetime import datetime

class AnomalyDetectionDashboard:
    def __init__(self, contamination=0.03):
        self.contamination = contamination
        self.buffer = deque(maxlen=10000)
        self.anomalies = []
        self.scaler = StandardScaler()
        self.model = None

    def generate_stream(self, n_points=200):
        np.random.seed(42)
        base = 100 + 10 * np.sin(2 * np.pi * np.arange(n_points) / 24)
        values = base + np.random.normal(0, 2, n_points)
        anomaly_idx = np.random.choice(n_points, max(1, n_points // 30), replace=False)
        values[anomaly_idx] += np.random.choice([-1, 1], len(anomaly_idx)) * 20
        return pd.DataFrame({
            'timestamp': pd.date_range(start=datetime.now(), periods=n_points, freq='5min'),
            'value': values, 'rate_of_change': np.gradient(values),
            'rolling_mean': pd.Series(values).rolling(5).mean(),
            'rolling_std': pd.Series(values).rolling(5).std()
        }).dropna()

    def fit(self, data):
        features = ['value', 'rate_of_change', 'rolling_mean', 'rolling_std']
        X = self.scaler.fit_transform(data[features])
        self.model = IsolationForest(contamination=self.contamination, random_state=42)
        self.model.fit(X)

    def detect(self, data):
        features = ['value', 'rate_of_change', 'rolling_mean', 'rolling_std']
        X = self.scaler.transform(data[features])
        predictions = self.model.predict(X)
        data = data.copy()
        data['is_anomaly'] = (predictions == -1).astype(int)
        for _, row in data.iterrows():
            self.buffer.append(row.to_dict())
            if row['is_anomaly']:
                self.anomalies.append({'timestamp': row['timestamp'], 'value': row['value']})
        return data

    def get_metrics(self):
        return {
            'total_points': len(self.buffer),
            'total_anomalies': len(self.anomalies),
            'anomaly_rate': len(self.anomalies) / max(len(self.buffer), 1)
        }

dashboard = AnomalyDetectionDashboard(contamination=0.03)
data = dashboard.generate_stream(200)
dashboard.fit(data)
results = dashboard.detect(data)
metrics = dashboard.get_metrics()
print("Anomaly Detection Dashboard")
print(f"  Total Points: {metrics['total_points']}")
print(f"  Anomalies: {metrics['total_anomalies']}")
print(f"  Anomaly Rate: {metrics['anomaly_rate']:.2%}")
```

### Project 3: Multi-Horizon Forecasting System

```python
# Project: Multi-Horizon Time Series Forecasting
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
import joblib

class MultiHorizonForecaster:
    def __init__(self):
        self.models = {}

    def generate_data(self, n_days=365):
        np.random.seed(42)
        dates = pd.date_range(start='2023-01-01', periods=n_days * 24, freq='H')
        hour = np.tile(np.arange(24), n_days)
        values = 500 + 200 * np.sin(2 * np.pi * hour / 24) + np.random.normal(0, 30, len(dates))
        return pd.DataFrame({'datetime': dates, 'value': values})

    def create_targets(self, df, horizons=[1, 24, 168]):
        for h in horizons:
            df[f'target_{h}h'] = df['value'].shift(-h)
        return df

    def run(self):
        df = self.generate_data()
        df = self.create_targets(df)
        dt = df['datetime']
        df['hour'] = dt.dt.hour
        df['day_of_week'] = dt.dt.dayofweek
        df['is_weekend'] = (dt.dt.dayofweek >= 5).astype(int)
        df.dropna(inplace=True)
        feature_cols = ['value', 'hour', 'day_of_week', 'is_weekend']
        X = df[feature_cols]
        split = int(0.8 * len(X))

        for horizon in [1, 24, 168]:
            y = df[f'target_{horizon}h']
            X_train, X_test = X[:split], X[split:]
            y_train, y_test = y[:split], y[split:]
            gb = GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42)
            gb.fit(X_train, y_train)
            y_pred_gb = gb.predict(X_test)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred_gb))
            self.models[f'{horizon}h'] = gb
            print(f"Horizon {horizon}h - GB RMSE: {rmse:.2f}")

        joblib.dump(self.models, 'multi_horizon_models.joblib')
        return self.models

forecaster = MultiHorizonForecaster()
forecaster.run()
```

---

# Module 19: Natural Language Processing with Python

## Text Preprocessing

```python
import numpy as np
import pandas as pd
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from collections import Counter

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

class TextPreprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        self.stemmer = PorterStemmer()

    def clean_text(self, text):
        text = text.lower()
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'@\w+', '', text)
        text = re.sub(r'#\w+', '', text)
        text = re.sub(r'<.*?>', '', text)
        text = re.sub(r'\d+', '', text)
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def tokenize(self, text):
        return word_tokenize(text)

    def remove_stopwords(self, tokens):
        return [t for t in tokens if t not in self.stop_words]

    def lemmatize(self, tokens):
        return [self.lemmatizer.lemmatize(t) for t in tokens]

    def stem(self, tokens):
        return [self.stemmer.stem(t) for t in tokens]

    def preprocess(self, text, use_lemmatization=True):
        text = self.clean_text(text)
        tokens = self.tokenize(text)
        tokens = self.remove_stopwords(tokens)
        if use_lemmatization:
            tokens = self.lemmatize(tokens)
        else:
            tokens = self.stem(tokens)
        return ' '.join(tokens)

preprocessor = TextPreprocessor()

sample_texts = [
    "The quick brown foxes are jumping over the lazy dogs! Visit https://example.com",
    "I can't believe how amazing this product is!!! It's absolutely wonderful #great #awesome",
    "The algorithms were running at 100% efficiency before the system crashed @admin",
    "Machine learning models need large datasets for training (at least 10000 samples)"
]

print("Text Preprocessing Examples")
print("=" * 60)
for text in sample_texts:
    cleaned = preprocessor.preprocess(text)
    print(f"Original:  {text}")
    print(f"Processed: {cleaned}")
    print()
```

## TF-IDF

```python
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

documents = [
    "Machine learning is a subset of artificial intelligence",
    "Deep learning uses neural networks with many layers",
    "Natural language processing deals with text and speech",
    "Computer vision enables machines to interpret images",
    "Reinforcement learning trains agents through rewards",
    "Supervised learning uses labeled data for training",
    "Unsupervised learning finds patterns in unlabeled data",
    "Transfer learning leverages pre-trained models",
    "Neural networks are inspired by biological neurons",
    "Support vector machines find optimal decision boundaries",
    "Random forests combine multiple decision trees",
    "Gradient boosting improves model accuracy iteratively",
    "The cat sat on the mat and looked out the window",
    "Dogs are loyal companions and love to play fetch",
    "The weather today is sunny with clear blue skies",
    "Python is a popular programming language for data science",
    "TensorFlow and PyTorch are leading deep learning frameworks",
    "Data preprocessing is essential for building good models",
    "Cross-validation helps prevent overfitting in machine learning",
    "Feature engineering improves model performance significantly",
]

labels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2]

tfidf = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words='english')
X_tfidf = tfidf.fit_transform(documents)

feature_names = tfidf.get_feature_names_out()
mean_tfidf = np.array(X_tfidf.mean(axis=0)).flatten()
top_indices = mean_tfidf.argsort()[-10:][::-1]

print("TF-IDF Analysis")
print("=" * 60)
print(f"Vocabulary size: {len(feature_names)}")
print(f"Document-term matrix shape: {X_tfidf.shape}")
print("\nTop 10 TF-IDF Terms:")
for idx in top_indices:
    print(f"  {feature_names[idx]}: {mean_tfidf[idx]:.4f}")

X_train, X_test, y_train, y_test = train_test_split(X_tfidf, labels, test_size=0.3, random_state=42)

classifiers = {
    'Naive Bayes': MultinomialNB(),
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
}

for name, clf in classifiers.items():
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    print(f"\n{name}: Accuracy={accuracy_score(y_test, y_pred):.4f}")
```

## Word Embeddings

```python
import numpy as np
from collections import Counter

class SimpleWord2Vec:
    def __init__(self, vector_size=100, window=5, min_count=1):
        self.vector_size = vector_size
        self.window = window
        self.min_count = min_count
        self.vocab = {}
        self.vectors = None

    def build_vocab(self, sentences):
        word_counts = Counter()
        for sentence in sentences:
            word_counts.update(sentence)
        self.vocab = {word: i for i, (word, count) in enumerate(word_counts.items())
                      if count >= self.min_count}
        self.vectors = np.random.randn(len(self.vocab), self.vector_size) * 0.01

    def train(self, sentences, epochs=100, learning_rate=0.01):
        self.build_vocab(sentences)
        for epoch in range(epochs):
            total_loss = 0
            for sentence in sentences:
                words = [w for w in sentence if w in self.vocab]
                for i, word in enumerate(words):
                    context_start = max(0, i - self.window)
                    context_end = min(len(words), i + self.window + 1)
                    for j in range(context_start, context_end):
                        if i != j:
                            context_word = words[j]
                            word_idx = self.vocab[word]
                            context_idx = self.vocab[context_word]
                            dot = np.dot(self.vectors[word_idx], self.vectors[context_idx])
                            sigmoid = 1 / (1 + np.exp(-dot))
                            error = sigmoid - 1
                            self.vectors[word_idx] -= learning_rate * error * self.vectors[context_idx]
                            self.vectors[context_idx] -= learning_rate * error * self.vectors[word_idx]
                            total_loss += -np.log(sigmoid + 1e-8)
            if (epoch + 1) % 20 == 0:
                print(f"  Epoch {epoch+1}, Loss: {total_loss:.4f}")

    def get_vector(self, word):
        if word in self.vocab:
            return self.vectors[self.vocab[word]]
        return None

    def most_similar(self, word, top_k=5):
        if word not in self.vocab:
            return []
        word_vec = self.vectors[self.vocab[word]]
        similarities = {}
        for other_word, idx in self.vocab.items():
            if other_word != word:
                sim = np.dot(word_vec, self.vectors[idx]) / (
                    np.linalg.norm(word_vec) * np.linalg.norm(self.vectors[idx])
                )
                similarities[other_word] = sim
        return sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:top_k]

corpus = [
    ['machine', 'learning', 'is', 'a', 'subset', 'of', 'artificial', 'intelligence'],
    ['deep', 'learning', 'uses', 'neural', 'networks'],
    ['natural', 'language', 'processing', 'deals', 'with', 'text'],
    ['computer', 'vision', 'enables', 'machines', 'to', 'interpret', 'images'],
    ['neural', 'networks', 'are', 'inspired', 'by', 'biological', 'neurons'],
    ['supervised', 'learning', 'uses', 'labeled', 'data'],
    ['unsupervised', 'learning', 'finds', 'patterns'],
    ['reinforcement', 'learning', 'trains', 'agents', 'through', 'rewards'],
    ['python', 'is', 'a', 'programming', 'language'],
    ['data', 'science', 'uses', 'machine', 'learning'],
]

w2v = SimpleWord2Vec(vector_size=50, window=3)
w2v.train(corpus, epochs=100)

print("\nWord Similarities:")
for word in ['learning', 'neural', 'machine']:
    if word in w2v.vocab:
        similar = w2v.most_similar(word, top_k=3)
        print(f"  Most similar to '{word}':")
        for sim_word, score in similar:
            print(f"    {sim_word}: {score:.4f}")
```

## Sentiment Analysis

```python
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline

positive_texts = [
    "This product is amazing! Best purchase ever!",
    "Excellent quality and fast shipping. Highly recommend!",
    "Love this! Exactly what I needed. Five stars!",
    "Outstanding service and great value for money",
    "Perfect! Works exactly as described. Very happy!",
    "Incredible results! This exceeded my expectations",
    "The quality is superb and the price is right",
    "Fantastic customer support, very helpful and responsive",
    "I'm thrilled with this purchase, absolutely love it",
    "Great product, would definitely buy again",
    "Wonderful experience from start to finish",
    "This is exactly what I was looking for, thank you!",
    "Super happy with my order, arrived quickly too",
    "Best thing I've bought in a long time, highly recommend",
    "Five stars all the way, no complaints whatsoever",
]

negative_texts = [
    "Terrible product, broke after one day of use",
    "Worst purchase ever, complete waste of money",
    "Very disappointed with the quality, not as described",
    "Horrible customer service, never buying again",
    "Defective item, took forever to get a refund",
    "Poor quality materials, fell apart immediately",
    "Not worth the price at all, very misleading",
    "Arrived damaged and customer support was unhelpful",
    "Regret buying this, total garbage product",
    "Completely dissatisfied, will be returning this",
    "Awful experience, would give zero stars if I could",
    "The product looks nothing like the pictures shown",
    "Broke within a week, terrible build quality",
    "Save your money, this product is absolutely useless",
    "Very frustrating experience, nothing works as expected",
]

neutral_texts = [
    "The product arrived on time. It's okay.",
    "Average quality, does what it's supposed to do",
    "It's a decent product for the price point",
    "Nothing special but nothing terrible either",
    "Meets basic expectations, nothing more nothing less",
    "Standard product, works as described",
    "Fairly average experience overall",
    "The product is functional but nothing impressive",
    "It's fine for everyday use, not premium quality",
    "Moderate quality, suitable for casual use",
]

texts = positive_texts + negative_texts + neutral_texts
labels = [2] * len(positive_texts) + [0] * len(negative_texts) + [1] * len(neutral_texts)

X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')),
    ('classifier', LogisticRegression(max_iter=1000, random_state=42))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("SENTIMENT ANALYSIS")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=['Negative', 'Neutral', 'Positive']))

new_texts = [
    "I absolutely love this product, it's wonderful!",
    "This is the worst thing I've ever bought",
    "It's an okay product, nothing special",
    "Amazing quality and great customer service!",
    "Completely broken on arrival, very disappointed"
]

predictions = pipeline.predict(new_texts)
probabilities = pipeline.predict_proba(new_texts)
label_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
for text, pred, probs in zip(new_texts, predictions, probabilities):
    print(f"\nText: {text}")
    print(f"  Prediction: {label_map[pred]}")
    print(f"  Confidence: {max(probs):.4f}")
```

## Module 19 Design Diagrams

### NLP Processing Pipeline

```
+------------------------------------------------------------------+
|                  NLP PROCESSING PIPELINE                           |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-----------------+    +-------------------+   |
|  |  Raw Text   |--> |  Text Cleaning  |--> |  Tokenization     |   |
|  |  (Documents)|    |  (HTML, URLs,   |    |  (Word/Sentence)  |   |
|  +-------------+    |   Special Chars)|    +-------------------+   |
|                     +-----------------+              |             |
|                                                +----v--------+    |
|                                                | Stopword    |    |
|                                                | Removal     |    |
|                                                +-------------+    |
|                                                      |           |
|                              +------------------------+--------+  |
|                              |                         |        |  |
|                              v                         v        v  |
|                     +----------------+    +---------+  +---------+ |
|                     |  Lemmatization |    | Stemming|  | POS     | |
|                     |  (WordNet)     |    | (Porter)|  | Tagging | |
|                     +----------------+    +---------+  +---------+ |
|                              |                         |        |  |
|                              +-----------+-------------+--------+  |
|                                          |                         |
|                         +----------------+-------------------+    |
|                         |                |                   |    |
|                         v                v                   v    |
|                +--------------+  +--------------+  +--------------+
|                |   TF-IDF     |  | Word2Vec/    |  | BERT         |
|                |   Features   |  | GloVe        |  | Embeddings   |
|                +--------------+  +--------------+  +--------------+
|                         |                |                   |    |
|                         +--------+-------+--------+---------+    |
|                                  |                        |       |
|                         +--------v--------+    +---------v----+  |
|                         |  Classification  |    |  Clustering  |  |
|                         |  (Sentiment,     |    |  (Topic      |  |
|                         |   Category)      |    |   Modeling)  |  |
|                         +-----------------+    +--------------+  |
|                                  |                        |       |
|                         +--------v------------------------v--+   |
|                         |         OUTPUT                     |   |
|                         |  (Labels, Topics, Insights)        |   |
|                         +------------------------------------+   |
+------------------------------------------------------------------+
```

### Sentiment Analysis Flowchart

```
                    +-------------------+
                    |   Input Text      |
                    +-------------------+
                               |
                    +-------------------+
                    | Preprocessing     |
                    | - Clean           |
                    | - Tokenize        |
                    | - Remove SW       |
                    +-------------------+
                               |
                    +-------------------+
                    | Feature           |
                    | Extraction        |
                    | (TF-IDF/Emb)      |
                    +-------------------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
     +----------------+ +------------+ +--------------+
     |  Lexicon-Based | | ML Model   | | Deep Learning|
     |  (VADER,       | | (LogReg,   | | (BERT,       |
     |   TextBlob)    | |  SVM)      | |  LSTM)       |
     +----------------+ +------------+ +--------------+
              |                |                |
              +--------+-------+--------+------+
                       |                        |
              +--------v--------+    +---------v----+
              | Sentiment Score |    |  Confidence  |
              | (-1 to +1)      |    |  Score       |
              +-----------------+    +--------------+
                       |                        |
              +--------v------------------------v--+
              |  +---------------------------+    |
              |  | Positive | Neutral | Neg  |    |
              |  |  >0.5    | -0.5-0.5| <-0.5|    |
              |  +---------------------------+    |
              +-----------------------------------+
```

## Module 19 Use Cases

### Use Case 1: Customer Support Ticket Classification

```python
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline

tickets = [
    ("My order hasn't arrived yet, it's been 2 weeks", "shipping"),
    ("I need to return this item, it's damaged", "returns"),
    ("How do I reset my password?", "account"),
    ("The product stopped working after 2 days", "technical"),
    ("I want to cancel my subscription", "billing"),
    ("Can I change my delivery address?", "shipping"),
    ("Where is my refund?", "returns"),
    ("I can't log into my account", "account"),
    ("The app keeps crashing on my phone", "technical"),
    ("I was charged twice for the same order", "billing"),
    ("My package was delivered to the wrong address", "shipping"),
    ("I need a replacement, the item is defective", "returns"),
    ("How do I update my credit card info?", "account"),
    ("The feature isn't working as described", "technical"),
    ("I want a refund for the unused portion", "billing"),
    ("When will my order ship?", "shipping"),
    ("The item doesn't match the description", "returns"),
    ("I forgot my username and password", "account"),
    ("The software has a bug in the latest update", "technical"),
    ("I need help with my invoice", "billing"),
] * 50

texts, labels = zip(*tickets)
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=3000, ngram_range=(1, 2))),
    ('classifier', LogisticRegression(max_iter=1000, random_state=42))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("CUSTOMER SUPPORT TICKET CLASSIFICATION")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))

new_tickets = [
    "My order still hasn't arrived",
    "I need to update my payment method",
    "The app crashes when I open settings",
    "I want my money back"
]
for ticket, pred in zip(new_tickets, pipeline.predict(new_tickets)):
    print(f"  [{pred}] {ticket}")
```

### Use Case 2: News Article Categorization

```python
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline

articles = [
    ("Stock market reaches new all-time high amid economic recovery", "business"),
    ("Scientists discover new exoplanet using advanced telescope", "science"),
    ("Championship game goes to overtime in dramatic fashion", "sports"),
    ("New smartphone features revolutionary AI capabilities", "technology"),
    ("Federal Reserve announces interest rate decision", "business"),
    ("Researchers develop breakthrough cancer treatment", "science"),
    ("Olympic athletes prepare for upcoming summer games", "sports"),
    ("Major tech company releases new AI language model", "technology"),
    ("Quarterly earnings exceed analyst expectations", "business"),
    ("Study reveals new findings about climate change", "science"),
    ("Football team signs record-breaking deal with star player", "sports"),
    ("Startup raises $500 million in latest funding round", "technology"),
    ("Global supply chain issues continue to affect businesses", "business"),
    ("New vaccine shows promising results in clinical trials", "science"),
    ("Tennis player wins grand slam title after comeback", "sports"),
    ("Cybersecurity breach affects millions of users", "technology"),
] * 50

texts, labels = zip(*articles)
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("NEWS ARTICLE CATEGORIZATION")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))
```

### Use Case 3: Fake News Detection

```python
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import VotingClassifier
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline

news = [
    ("Scientists confirm Earth is flat, new study reveals", "fake"),
    ("Local hospital expands emergency services", "real"),
    ("Celebrity secretly owns controlling share of major bank", "fake"),
    ("City council approves new public park project", "real"),
    ("Government plans to ban all internet usage", "fake"),
    ("School district announces new STEM program", "real"),
    ("Aliens contact Earth, demand surrender", "fake"),
    ("New study links coffee to improved health", "real"),
    ("Banks secretly printing money to crash economy", "fake"),
    ("Local business wins community service award", "real"),
    ("Famous actor found to be AI-generated hologram", "fake"),
    ("Research team publishes new AI ethics guidelines", "real"),
    ("Government plans to implant chips in all citizens", "fake"),
    ("Annual charity gala raises record donations", "real"),
    ("Scientists create life in laboratory", "fake"),
    ("University opens new research center for clean energy", "real"),
] * 50

texts, labels = zip(*news)
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 3))),
    ('classifier', VotingClassifier(
        estimators=[
            ('lr', LogisticRegression(max_iter=1000, random_state=42)),
            ('svm', LinearSVC(max_iter=1000, random_state=42)),
        ],
        voting='hard'
    ))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("FAKE NEWS DETECTION")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))
```

### Use Case 4: Product Review Summarization

```python
import numpy as np
import pandas as pd
from collections import Counter
import re

class TextSummarizer:
    def __init__(self):
        self.stop_words = set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
                               'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                               'would', 'could', 'should', 'may', 'might', 'can', 'shall',
                               'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
                               'as', 'into', 'through', 'during', 'before', 'after', 'and',
                               'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
                               'neither', 'each', 'every', 'all', 'any', 'few', 'more',
                               'most', 'other', 'some', 'such', 'no', 'only', 'own',
                               'same', 'than', 'too', 'very', 'just', 'because', 'if',
                               'when', 'where', 'how', 'what', 'which', 'who', 'whom',
                               'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we',
                               'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
                               'it', 'its', 'they', 'them', 'their', 'this', 'that'])

    def preprocess(self, text):
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = re.findall(r'\w+', text.lower())
        words = [w for w in words if w not in self.stop_words and len(w) > 2]
        return sentences, words

    def score_sentences(self, sentences, words):
        word_freq = Counter(words)
        max_freq = max(word_freq.values()) if word_freq else 1
        word_freq = {w: f/max_freq for w, f in word_freq.items()}

        scores = {}
        for i, sentence in enumerate(sentences):
            sentence_words = re.findall(r'\w+', sentence.lower())
            score = sum(word_freq.get(w, 0) for w in sentence_words)
            scores[i] = score / max(len(sentence_words), 1)
        return scores

    def summarize(self, text, num_sentences=3):
        sentences, words = self.preprocess(text)
        if len(sentences) <= num_sentences:
            return text

        scores = self.score_sentences(sentences, words)
        top_indices = sorted(scores, key=scores.get, reverse=True)[:num_sentences]
        summary = '. '.join(sentences[i] for i in sorted(top_indices))
        return summary + '.'

review = """This product exceeded all my expectations. The build quality is outstanding and the design is sleek and modern. 
Setup was incredibly easy, took less than 5 minutes. Performance is excellent, handling everything I throw at it with ease. 
Battery life is impressive, lasting well over 12 hours of continuous use. The customer support team was also very helpful 
when I had questions about advanced features. The only minor downside is the price, which is a bit high compared to competitors. 
However, the quality justifies the premium. Overall, I'm extremely satisfied with this purchase and would highly recommend it 
to anyone looking for a reliable and powerful device."""

summarizer = TextSummarizer()
summary = summarizer.summarize(review, num_sentences=3)

print("PRODUCT REVIEW SUMMARIZATION")
print(f"\nOriginal ({len(review.split())} words):")
print(review)
print(f"\nSummary ({len(summary.split())} words):")
print(summary)
```

### Use Case 5: Named Entity Recognition

```python
import re
import pandas as pd

class SimpleNER:
    def __init__(self):
        self.patterns = {
            'PERSON': r'\b[A-Z][a-z]+ (?:[A-Z][a-z]+ )*[A-Z][a-z]+\b',
            'ORG': r'\b(?:Google|Microsoft|Apple|Amazon|Facebook|Tesla|Netflix|IBM|Oracle|SAP)\b',
            'DATE': r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2},? \d{4}\b',
            'MONEY': r'\$[\d,]+(?:\.\d{2})?\b',
            'LOCATION': r'\b(?:New York|San Francisco|Los Angeles|Chicago|Houston|Seattle|Boston|London|Paris|Tokyo)\b',
        }

    def extract(self, text):
        entities = []
        for entity_type, pattern in self.patterns.items():
            matches = re.finditer(pattern, text)
            for match in matches:
                entities.append({
                    'text': match.group(),
                    'type': entity_type,
                    'start': match.start(),
                    'end': match.end()
                })
        return sorted(entities, key=lambda x: x['start'])

ner = SimpleNER()
text = """On January 15, 2024, Google announced a $10 billion investment in San Francisco. 
CEO Sundar Pichai said the company will expand operations in New York and London.
Microsoft also revealed plans for a $5 billion facility in Seattle."""

entities = ner.extract(text)
print("NAMED ENTITY RECOGNITION")
print("=" * 60)
for entity in entities:
    print(f"  [{entity['type']}] {entity['text']}")
```

## Module 19 Project Ideas

### Project 1: Multi-Class Document Classifier

```python
# Project: Multi-Class Document Classification System
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline
import joblib

class DocumentClassifier:
    def __init__(self):
        self.pipeline = None
        self.results = {}

    def generate_data(self, n_samples=2000):
        np.random.seed(42)
        categories = {
            'technology': [
                "AI and machine learning are transforming industries",
                "New programming language gains popularity",
                "Cloud computing adoption accelerates",
                "Cybersecurity threats increase worldwide",
                "Quantum computing breakthrough announced",
            ],
            'business': [
                "Stock market reaches new highs",
                "Company reports record quarterly earnings",
                "Merger and acquisition activity increases",
                "Startup raises significant funding round",
                "Global trade tensions affect markets",
            ],
            'science': [
                "New species discovered in deep ocean",
                "Climate research reveals new findings",
                "Medical breakthrough in cancer treatment",
                "Space exploration mission launches successfully",
                "Renewable energy technology improves efficiency",
            ],
            'sports': [
                "Championship game goes to overtime",
                "Olympic committee announces new host city",
                "Star athlete signs record contract",
                "Team wins championship after long drought",
                "International tournament draws record viewers",
            ],
        }

        texts, labels = [], []
        for category, templates in categories.items():
            for _ in range(n_samples // len(categories)):
                template = np.random.choice(templates)
                # Add variation
                variations = [" recently", " today", " this week", " announced", " reported"]
                text = template + np.random.choice(variations)
                texts.append(text)
                labels.append(category)

        return texts, labels

    def train(self, texts, labels):
        X_train, X_test, y_train, y_test = train_test_split(
            texts, labels, test_size=0.2, random_state=42, stratify=labels
        )

        models = {
            'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        }

        best_score = 0
        best_model = None

        for name, model in models.items():
            pipeline = Pipeline([
                ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
                ('classifier', model)
            ])
            pipeline.fit(X_train, y_train)
            y_pred = pipeline.predict(X_test)
            score = accuracy_score(y_test, y_pred)
            self.results[name] = score
            print(f"{name}: Accuracy={score:.4f}")

            if score > best_score:
                best_score = score
                best_model = pipeline

        self.pipeline = best_model
        print(f"\nBest Model: Accuracy={best_score:.4f}")
        return best_model

    def predict(self, texts):
        return self.pipeline.predict(texts)

    def save(self, path='document_classifier.joblib'):
        joblib.dump(self.pipeline, path)

classifier = DocumentClassifier()
texts, labels = classifier.generate_data(n_samples=2000)
classifier.train(texts, labels)

new_docs = [
    "AI startup raises $100 million in Series B funding",
    "Scientists discover new planet in habitable zone",
    "Team wins championship in dramatic fashion",
    "Company reports record-breaking quarterly revenue"
]
predictions = classifier.predict(new_docs)
for doc, pred in zip(new_docs, predictions):
    print(f"  [{pred}] {doc}")
```

### Project 2: Text Similarity Engine

```python
# Project: Document Similarity and Recommendation System
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

class TextSimilarityEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        self.documents = []
        self.tfidf_matrix = None

    def add_documents(self, documents):
        self.documents.extend(documents)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)

    def find_similar(self, query, top_k=5):
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = similarities.argsort()[-top_k:][::-1]

        results = []
        for idx in top_indices:
            results.append({
                'document': self.documents[idx],
                'similarity': similarities[idx],
                'index': idx
            })
        return results

    def get_similarity_matrix(self):
        return cosine_similarity(self.tfidf_matrix)

engine = TextSimilarityEngine()

documents = [
    "Machine learning algorithms can predict customer behavior",
    "Deep learning neural networks process complex data patterns",
    "Natural language processing extracts meaning from text",
    "Computer vision systems analyze and interpret images",
    "Data science combines statistics and programming",
    "Artificial intelligence automates complex decision making",
    "Big data analytics reveal hidden patterns in large datasets",
    "Cloud computing provides scalable infrastructure",
    "Cybersecurity protects systems from digital threats",
    "Blockchain technology ensures secure transactions",
]

engine.add_documents(documents)

query = "How do neural networks process data?"
similar = engine.find_similar(query, top_k=3)

print("TEXT SIMILARITY ENGINE")
print(f"Query: {query}")
print("\nTop 3 Similar Documents:")
for i, result in enumerate(similar):
    print(f"  {i+1}. (Score: {result['similarity']:.4f}) {result['document']}")
```

### Project 3: Sentiment Dashboard with Monitoring

```python
# Project: Sentiment Analysis Dashboard
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from collections import deque
from datetime import datetime, timedelta

class SentimentDashboard:
    def __init__(self):
        self.pipeline = None
        self.history = deque(maxlen=10000)
        self.metrics_history = []

    def train(self):
        positive = [
            "Great product, love it!", "Excellent service, highly recommend",
            "Amazing quality, worth every penny", "Best purchase I've made",
            "Fantastic experience, will buy again", "Outstanding customer support",
            "Perfect product, exceeded expectations", "Very satisfied with my order",
        ] * 20
        negative = [
            "Terrible product, waste of money", "Very disappointed with quality",
            "Worst experience ever, never again", "Product broke immediately",
            "Horrible customer service", "Not worth the price at all",
            "Completely unsatisfied, returning item", "Awful product, do not buy",
        ] * 20
        neutral = [
            "Product is okay, nothing special", "Average quality for the price",
            "It works as described, nothing more", "Decent product, meets basic needs",
            "Standard quality, acceptable", "Fair product for everyday use",
        ] * 20

        texts = positive + negative + neutral
        labels = [2] * len(positive) + [0] * len(negative) + [1] * len(neutral)

        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=3000, ngram_range=(1, 2))),
            ('classifier', LogisticRegression(max_iter=1000))
        ])
        self.pipeline.fit(texts, labels)

    def analyze(self, text):
        pred = self.pipeline.predict([text])[0]
        prob = self.pipeline.predict_proba([text])[0]
        label_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}

        result = {
            'text': text,
            'sentiment': label_map[pred],
            'confidence': max(prob),
            'probabilities': {label_map[i]: p for i, p in enumerate(prob)},
            'timestamp': datetime.now().isoformat()
        }
        self.history.append(result)
        return result

    def get_metrics(self):
        if not self.history:
            return {}
        sentiments = [r['sentiment'] for r in self.history]
        return {
            'total_analyzed': len(self.history),
            'positive_pct': sentiments.count('Positive') / len(sentiments),
            'neutral_pct': sentiments.count('Neutral') / len(sentiments),
            'negative_pct': sentiments.count('Negative') / len(sentiments),
            'avg_confidence': np.mean([r['confidence'] for r in self.history])
        }

dashboard = SentimentDashboard()
dashboard.train()

test_reviews = [
    "This product is absolutely amazing!",
    "Terrible experience, would not recommend",
    "It's okay, nothing special",
    "Best purchase I've ever made!",
    "Complete waste of money",
]

print("SENTIMENT DASHBOARD")
print("=" * 60)
for review in test_reviews:
    result = dashboard.analyze(review)
    print(f"Text: {result['text']}")
    print(f"  Sentiment: {result['sentiment']} (Confidence: {result['confidence']:.4f})")
    print()

metrics = dashboard.get_metrics()
print("Dashboard Metrics:")
for k, v in metrics.items():
    if isinstance(v, float):
        print(f"  {k}: {v:.4f}")
    else:
        print(f"  {k}: {v}")
```

---

# Module 20: ML Model Deployment

## Flask Model Serving

```python
from flask import Flask, request, jsonify
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import json

# Train and save model
np.random.seed(42)
X = np.random.randn(1000, 10)
y = (X[:, 0] + X[:, 1] > 0).astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

joblib.dump(model, 'model.joblib')
joblib.dump(scaler, 'scaler.joblib')

# Flask API
app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': True})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0].tolist()
        return jsonify({
            'prediction': int(prediction),
            'probability': probability,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    try:
        data = request.get_json()
        features = np.array(data['features'])
        features_scaled = scaler.transform(features)
        predictions = model.predict(features_scaled).tolist()
        probabilities = model.predict_proba(features_scaled).tolist()
        return jsonify({
            'predictions': predictions,
            'probabilities': probabilities,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

## FastAPI Model Serving

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
from datetime import datetime
import uvicorn

app = FastAPI(title="ML Model API", version="1.0.0")

model = joblib.load('model.joblib')
scaler = joblib.load('scaler.joblib')

class PredictionRequest(BaseModel):
    features: List[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: List[float]
    model_version: str
    timestamp: str

class BatchPredictionRequest(BaseModel):
    features: List[List[float]]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str

@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="healthy", model_loaded=True, version="1.0.0")

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        features = np.array(request.features).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0].tolist()
        return PredictionResponse(
            prediction=int(prediction),
            probability=probability,
            model_version="1.0.0",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/batch_predict")
def batch_predict(request: BatchPredictionRequest):
    try:
        features = np.array(request.features)
        features_scaled = scaler.transform(features)
        predictions = model.predict(features_scaled).tolist()
        probabilities = model.predict_proba(features_scaled).tolist()
        return {
            'predictions': predictions,
            'probabilities': probabilities,
            'count': len(predictions)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/model/info")
def model_info():
    return {
        'model_type': type(model).__name__,
        'n_features': model.n_features_in_,
        'n_estimators': model.n_estimators,
        'version': '1.0.0'
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY .. .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  ml-service:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/model.joblib
      - SCALER_PATH=/app/scaler.joblib
    volumes:
      - ./models:/app/models
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - ml-service
```

## CI/CD for ML

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: pytest tests/ -v --cov=src --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install linters
        run: pip install flake8 black isort
      - name: Run linters
        run: |
          flake8 src/
          black --check src/
          isort --check-only src/

  build:
    needs: [test, lint]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t ml-service:${{ github.sha }} .
      - name: Test Docker image
        run: |
          docker run -d -p 8000:8000 --name test-container ml-service:${{ github.sha }}
          sleep 10
          curl -f http://localhost:8000/health
          docker stop test-container

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment steps here
```

## Model Monitoring

```python
import numpy as np
import pandas as pd
from collections import deque
from datetime import datetime, timedelta
import json

class ModelMonitor:
    def __init__(self, window_size=1000):
        self.window_size = window_size
        self.predictions = deque(maxlen=window_size)
        self.features = deque(maxlen=window_size)
        self.latencies = deque(maxlen=window_size)
        self.errors = deque(maxlen=window_size)
        self.baseline_distribution = None

    def set_baseline(self, training_data):
        self.baseline_distribution = {
            'mean': np.mean(training_data, axis=0).tolist(),
            'std': np.std(training_data, axis=0).tolist(),
            'min': np.min(training_data, axis=0).tolist(),
            'max': np.max(training_data, axis=0).tolist()
        }

    def log_prediction(self, features, prediction, latency, error=None):
        self.predictions.append({
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        })
        self.features.append(features)
        self.latencies.append(latency)
        if error:
            self.errors.append({
                'error': str(error),
                'timestamp': datetime.now().isoformat()
            })

    def detect_data_drift(self, new_data, threshold=0.1):
        if self.baseline_distribution is None:
            return False

        new_mean = np.mean(new_data, axis=0)
        baseline_mean = np.array(self.baseline_distribution['mean'])
        baseline_std = np.array(self.baseline_distribution['std'])

        drift_score = np.mean(np.abs(new_mean - baseline_mean) / (baseline_std + 1e-8))
        return drift_score > threshold

    def detect_prediction_drift(self, window_hours=24):
        if len(self.predictions) < 2:
            return False

        cutoff = (datetime.now() - timedelta(hours=window_hours)).isoformat()
        recent = [p['prediction'] for p in self.predictions if p['timestamp'] > cutoff]
        older = [p['prediction'] for p in self.predictions if p['timestamp'] <= cutoff]

        if not recent or not older:
            return False

        recent_mean = np.mean(recent)
        older_mean = np.mean(older)
        return abs(recent_mean - older_mean) > 0.1

    def get_metrics(self):
        return {
            'total_predictions': len(self.predictions),
            'avg_latency_ms': np.mean(self.latencies) if self.latencies else 0,
            'p99_latency_ms': np.percentile(self.latencies, 99) if self.latencies else 0,
            'error_rate': len(self.errors) / max(len(self.predictions), 1),
            'unique_predictions': len(set(p['prediction'] for p in self.predictions)),
            'data_drift': self.detect_data_drift(np.array(self.features)) if self.features else False,
            'prediction_drift': self.detect_prediction_drift()
        }

    def get_alerts(self):
        alerts = []
        metrics = self.get_metrics()

        if metrics['error_rate'] > 0.05:
            alerts.append({'type': 'HIGH_ERROR_RATE', 'value': metrics['error_rate']})
        if metrics['p99_latency_ms'] > 1000:
            alerts.append({'type': 'HIGH_LATENCY', 'value': metrics['p99_latency_ms']})
        if metrics['data_drift']:
            alerts.append({'type': 'DATA_DRIFT', 'value': 'Detected'})
        if metrics['prediction_drift']:
            alerts.append({'type': 'PREDICTION_DRIFT', 'value': 'Detected'})

        return alerts

# Usage
monitor = ModelMonitor(window_size=5000)

# Simulate predictions
np.random.seed(42)
for i in range(100):
    features = np.random.randn(10).tolist()
    prediction = int(np.random.choice([0, 1]))
    latency = np.random.uniform(10, 100)
    monitor.log_prediction(features, prediction, latency)

print("MODEL MONITORING")
print("=" * 60)
metrics = monitor.get_metrics()
for k, v in metrics.items():
    if isinstance(v, float):
        print(f"  {k}: {v:.4f}")
    else:
        print(f"  {k}: {v}")

alerts = monitor.get_alerts()
if alerts:
    print("\nAlerts:")
    for alert in alerts:
        print(f"  [{alert['type']}] {alert['value']}")
```

## A/B Testing for ML Models

```python
import numpy as np
from scipy import stats
from collections import defaultdict
from datetime import datetime

class ABTestML:
    def __init__(self, model_a, model_b, traffic_split=0.5):
        self.model_a = model_a
        self.model_b = model_b
        self.traffic_split = traffic_split
        self.results = defaultdict(list)

    def route(self, request_id):
        return 'A' if hash(str(request_id)) % 100 < self.traffic_split * 100 else 'B'

    def predict(self, X, request_ids):
        predictions = []
        for i, rid in enumerate(request_ids):
            variant = self.route(rid)
            model = self.model_a if variant == 'A' else self.model_b
            pred = model.predict(X[i:i+1])[0]
            prob = model.predict_proba(X[i:i+1])[0][1]
            self.results[variant].append({
                'request_id': rid,
                'prediction': pred,
                'probability': prob,
                'timestamp': datetime.now().isoformat()
            })
            predictions.append(pred)
        return predictions

    def analyze(self, significance_level=0.05):
        a_probs = [r['probability'] for r in self.results['A']]
        b_probs = [r['probability'] for r in self.results['B']]

        if len(a_probs) < 30 or len(b_probs) < 30:
            return {'status': 'insufficient_data'}

        t_stat, p_value = stats.ttest_ind(a_probs, b_probs)
        significant = p_value < significance_level

        a_mean = np.mean(a_probs)
        b_mean = np.mean(b_probs)
        lift = (b_mean - a_mean) / a_mean if a_mean > 0 else 0

        return {
            'model_a_mean': a_mean,
            'model_b_mean': b_mean,
            'lift': lift,
            'p_value': p_value,
            'significant': significant,
            'recommendation': 'deploy_b' if significant and lift > 0 else 'keep_a',
            'sample_size_a': len(a_probs),
            'sample_size_b': len(b_probs)
        }

# Usage
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split

np.random.seed(42)
X = np.random.randn(2000, 10)
y = (X[:, 0] + X[:, 1] > 0).astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_a = RandomForestClassifier(n_estimators=100, random_state=42)
model_b = GradientBoostingClassifier(n_estimators=150, random_state=42)
model_a.fit(X_train, y_train)
model_b.fit(X_train, y_train)

ab_test = ABTestML(model_a, model_b)
user_ids = range(500)
predictions = ab_test.predict(X_test[:len(user_ids)], user_ids)
analysis = ab_test.analyze()

print("A/B TEST RESULTS")
print("=" * 60)
for k, v in analysis.items():
    if isinstance(v, float):
        print(f"  {k}: {v:.4f}")
    else:
        print(f"  {k}: {v}")
```

## Module 20 Design Diagrams

### ML Deployment Architecture

```
+------------------------------------------------------------------+
|                ML MODEL DEPLOYMENT ARCHITECTURE                    |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-------------+    +---------------------+    |
|  |  Training   |--> |  Model      |--> |  Model Registry     |    |
|  |  Pipeline   |    |  Artifact   |    |  (Version Control)  |    |
|  +-------------+    +-------------+    +---------------------+    |
|                                                |                  |
|                                                v                  |
|                                     +-------------------+         |
|                                     |  CI/CD Pipeline   |         |
|                                     |  (GitHub Actions) |         |
|                                     +-------------------+         |
|                                                |                  |
|                           +--------------------+----------------+ |
|                           |                    |                | |
|                           v                    v                v |
|                  +----------------+  +----------------+  +---------+
|                  |   Staging      |  |   Canary       |  |  A/B    |
|                  |   Environment  |  |   Deployment   |  |  Test   |
|                  +----------------+  +----------------+  +---------+
|                           |                    |                | |
|                           +--------+-----------+--------+------+ |
|                                    |                        |      |
|                           +--------v--------+    +---------v----+ |
|                           |  Load Balancer  |    |  API Gateway  | |
|                           |  (Nginx)        |    |  (Rate Limit) | |
|                           +-----------------+    +--------------+ |
|                                    |                        |      |
|                           +--------v------------------------v--+  |
|                           |       PRODUCTION ENVIRONMENT        |  |
|                           |  +--------+  +--------+  +--------+|  |
|                           |  |Worker 1|  |Worker 2|  |Worker 3||  |
|                           |  +--------+  +--------+  +--------+|  |
|                           +------------------------------------+  |
|                                    |                               |
|                                    v                               |
|                           +------------------+                     |
|                           |  Monitoring      |                     |
|                           |  (Prometheus +   |                     |
|                           |   Grafana)       |                     |
|                           +------------------+                     |
+------------------------------------------------------------------+
```

### CI/CD Pipeline Flow

```
+------------------------------------------------------------------+
|                    CI/CD PIPELINE FLOW                             |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-------------+    +---------------------+    |
|  |  Code       |--> |  Lint &     |--> |  Unit Tests         |    |
|  |  Commit     |    |  Format     |    |  (pytest)           |    |
|  +-------------+    +-------------+    +---------------------+    |
|                                                |                  |
|                                    +-----------+-----------+      |
|                                    |                       |      |
|                                   PASS                    FAIL     |
|                                    |                       |      |
|                                    v                       v      |
|                           +----------------+     +--------------+ |
|                           |  Integration   |     |  Notify      | |
|                           |  Tests         |     |  Developer   | |
|                           +----------------+     +--------------+ |
|                                    |                               |
|                           +--------v--------+                     |
|                           |  Build Docker   |                     |
|                           |  Image          |                     |
|                           +-----------------+                     |
|                                    |                               |
|                           +--------v--------+                     |
|                           |  Push to        |                     |
|                           |  Registry       |                     |
|                           +-----------------+                     |
|                                    |                               |
|                           +--------v--------+                     |
|                           |  Deploy to      |                     |
|                           |  Staging        |                     |
|                           +-----------------+                     |
|                                    |                               |
|                           +--------v--------+                     |
|                           |  Performance    |                     |
|                           |  Tests          |                     |
|                           +-----------------+                     |
|                                    |                               |
|                           +--------v--------+                     |
|                           |  Deploy to      |                     |
|                           |  Production     |                     |
|                           +-----------------+                     |
+------------------------------------------------------------------+
```

## Module 20 Use Cases

### Use Case 1: REST API for ML Predictions

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import joblib
from datetime import datetime

app = FastAPI(title="ML Prediction API")

model = joblib.load('model.joblib')
scaler = joblib.load('scaler.joblib')

class PredictionRequest(BaseModel):
    features: List[float]

@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        features = np.array(request.features).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0].tolist()
        return {
            'prediction': int(prediction),
            'probability': probability,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Use Case 2: Batch Prediction Service

```python
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List
import numpy as np
import pandas as pd
import joblib
import io

app = FastAPI(title="Batch Prediction Service")

model = joblib.load('model.joblib')
scaler = joblib.load('scaler.joblib')

@app.post("/batch_predict")
async def batch_predict(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    features = df.values
    features_scaled = scaler.transform(features)
    predictions = model.predict(features_scaled).tolist()
    probabilities = model.predict_proba(features_scaled).tolist()
    return {
        'predictions': predictions,
        'probabilities': probabilities,
        'count': len(predictions)
    }
```

### Use Case 3: Model Versioning API

```python
from fastapi import FastAPI
from typing import Dict
import joblib
from datetime import datetime

app = FastAPI(title="Model Versioning API")

models = {}
versions = {}

@app.post("/models/{version}/upload")
def upload_model(version: str):
    model = joblib.load(f'model_{version}.joblib')
    models[version] = model
    versions[version] = {
        'uploaded_at': datetime.now().isoformat(),
        'status': 'active'
    }
    return {'version': version, 'status': 'uploaded'}

@app.get("/models/{version}/info")
def model_info(version: str):
    if version not in versions:
        return {'error': 'Version not found'}
    return versions[version]

@app.post("/models/{version}/promote")
def promote_model(version: str):
    if version not in versions:
        return {'error': 'Version not found'}
    versions[version]['status'] = 'production'
    return {'version': version, 'status': 'promoted to production'}
```

## Module 20 Project Ideas

### Project 1: End-to-End ML Service

```python
# Project: Complete ML Service with FastAPI + Docker + Monitoring
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
from datetime import datetime
from collections import deque
import time

app = FastAPI(title="Production ML Service")

class ModelService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.predictions_log = deque(maxlen=10000)
        self.start_time = datetime.now()

    def load_model(self, model_path, scaler_path):
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)

    def predict(self, features):
        start = time.time()
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        prediction = self.model.predict(features_scaled)[0]
        probability = self.model.predict_proba(features_scaled)[0]
        latency = (time.time() - start) * 1000

        self.predictions_log.append({
            'timestamp': datetime.now().isoformat(),
            'prediction': int(prediction),
            'latency_ms': latency
        })
        return prediction, probability.tolist(), latency

service = ModelService()

class PredictionRequest(BaseModel):
    features: List[float]

@app.on_event("startup")
async def startup():
    np.random.seed(42)
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler

    X = np.random.randn(1000, 10)
    y = (X[:, 0] + X[:, 1] > 0).astype(int)
    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)

    service.scaler = StandardScaler()
    X_train_scaled = service.scaler.fit_transform(X_train)
    service.model = RandomForestClassifier(n_estimators=100, random_state=42)
    service.model.fit(X_train_scaled, y_train)

@app.get("/health")
def health():
    return {
        'status': 'healthy',
        'model_loaded': service.model is not None,
        'uptime_seconds': (datetime.now() - service.start_time).total_seconds()
    }

@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        features = np.array(request.features)
        prediction, probability, latency = service.predict(features)
        return {
            'prediction': int(prediction),
            'probability': probability,
            'latency_ms': latency
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/metrics")
def metrics():
    if not service.predictions_log:
        return {'total_predictions': 0}
    latencies = [p['latency_ms'] for p in service.predictions_log]
    return {
        'total_predictions': len(service.predictions_log),
        'avg_latency_ms': np.mean(latencies),
        'p99_latency_ms': np.percentile(latencies, 99),
        'predictions_per_minute': len(service.predictions_log) / max((datetime.now() - service.start_time).total_seconds() / 60, 1)
    }
```

### Project 2: Model Registry Service

```python
# Project: ML Model Registry with Versioning
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import joblib
from datetime import datetime
import json

app = FastAPI(title="Model Registry")

class ModelRegistry:
    def __init__(self):
        self.models = {}
        self.metadata = {}

    def register(self, model_id, model_path, metrics, tags=None):
        self.models[model_id] = joblib.load(model_path)
        self.metadata[model_id] = {
            'model_path': model_path,
            'metrics': metrics,
            'tags': tags or {},
            'created_at': datetime.now().isoformat(),
            'status': 'staging'
        }

    def promote(self, model_id, stage='production'):
        if model_id in self.metadata:
            self.metadata[model_id]['status'] = stage
            return True
        return False

    def get_production_model(self):
        for mid, meta in self.metadata.items():
            if meta['status'] == 'production':
                return mid, self.models[mid]
        return None, None

    def list_models(self):
        return {mid: meta for mid, meta in self.metadata.items()}

registry = ModelRegistry()

class RegisterRequest(BaseModel):
    model_id: str
    metrics: Dict
    tags: Optional[Dict] = {}

@app.post("/register")
def register_model(request: RegisterRequest):
    registry.register(request.model_id, f"{request.model_id}.joblib", request.metrics, request.tags)
    return {'status': 'registered', 'model_id': request.model_id}

@app.post("/{model_id}/promote")
def promote_model(model_id: str):
    if registry.promote(model_id):
        return {'status': 'promoted', 'model_id': model_id}
    raise HTTPException(status_code=404, detail="Model not found")

@app.get("/models")
def list_models():
    return registry.list_models()
```

### Project 3: Complete Monitoring Dashboard

```python
# Project: ML Monitoring Dashboard
import numpy as np
from collections import deque
from datetime import datetime
import json

class MonitoringDashboard:
    def __init__(self):
        self.metrics = {
            'predictions': deque(maxlen=10000),
            'latencies': deque(maxlen=10000),
            'errors': deque(maxlen=1000),
            'feature_stats': {}
        }
        self.alerts = []

    def log_prediction(self, features, prediction, latency):
        self.metrics['predictions'].append({
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        })
        self.metrics['latencies'].append(latency)

    def log_error(self, error):
        self.metrics['errors'].append({
            'error': str(error),
            'timestamp': datetime.now().isoformat()
        })

    def get_dashboard_data(self):
        predictions = list(self.metrics['predictions'])
        latencies = list(self.metrics['latencies'])
        errors = list(self.metrics['errors'])

        return {
            'total_predictions': len(predictions),
            'avg_latency': np.mean(latencies) if latencies else 0,
            'p99_latency': np.percentile(latencies, 99) if latencies else 0,
            'error_rate': len(errors) / max(len(predictions), 1),
            'uptime': self._calculate_uptime(),
            'throughput': self._calculate_throughput(predictions),
            'alerts': self.alerts[-10:]
        }

    def _calculate_uptime(self):
        if not self.metrics['predictions']:
            return 1.0
        return 1.0 - (len(self.metrics['errors']) / max(len(self.metrics['predictions']), 1))

    def _calculate_throughput(self, predictions):
        if len(predictions) < 2:
            return 0
        first = datetime.fromisoformat(predictions[0]['timestamp'])
        last = datetime.fromisoformat(predictions[-1]['timestamp'])
        duration = (last - first).total_seconds()
        return len(predictions) / max(duration, 1)

dashboard = MonitoringDashboard()

# Simulate
for i in range(200):
    features = np.random.randn(10).tolist()
    prediction = int(np.random.choice([0, 1]))
    latency = np.random.uniform(5, 50)
    dashboard.log_prediction(features, prediction, latency)

data = dashboard.get_dashboard_data()
print("MONITORING DASHBOARD")
print("=" * 60)
for k, v in data.items():
    if isinstance(v, float):
        print(f"  {k}: {v:.4f}")
    elif isinstance(v, list):
        print(f"  {k}: {len(v)} items")
    else:
        print(f"  {k}: {v}")
```

---

# Capstone Project: ML Pipeline for Credit Risk Assessment

## Complete End-to-End ML Pipeline

### Project Architecture

```
+------------------------------------------------------------------+
|         CREDIT RISK ASSESSMENT ML PIPELINE                        |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-------------+    +---------------------+    |
|  |  Data       |--> |  Feature    |--> |  Model Training     |    |
|  |  Ingestion  |    |  Engineering|    |  (Multiple Models)  |    |
|  +-------------+    +-------------+    +---------------------+    |
|                                                |                  |
|                                                v                  |
|                                     +-------------------+         |
|                                     |  Hyperparameter   |         |
|                                     |  Optimization     |         |
|                                     +-------------------+         |
|                                                |                  |
|                                                v                  |
|                                     +-------------------+         |
|                                     |  Model Evaluation |         |
|                                     |  & Selection      |         |
|                                     +-------------------+         |
|                                                |                  |
|                           +--------------------+----------------+ |
|                           |                    |                | |
|                           v                    v                v |
|                  +----------------+  +----------------+  +---------+
|                  |  Model         |  |  A/B Testing   |  |  Deploy |
|                  |  Registry      |  |  Framework     |  |  (API)  |
|                  +----------------+  +----------------+  +---------+
|                           |                    |                | |
|                           +--------+-----------+--------+------+ |
|                                    |                        |      |
|                           +--------v--------+    +---------v----+ |
|                           |  Monitoring     |    |  Alerting    | |
|                           |  Dashboard      |    |  System      | |
|                           +-----------------+    +--------------+ |
+------------------------------------------------------------------+
```

### Stage 1: Data Ingestion and Exploration

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import warnings
warnings.filterwarnings('ignore')

class CreditDataIngestion:
    def __init__(self):
        self.raw_data = None
        self.processed_data = None

    def generate_credit_data(self, n_samples=10000):
        np.random.seed(42)

        age = np.random.randint(21, 70, n_samples)
        income = np.random.lognormal(10.5, 0.8, n_samples)
        employment_years = np.random.exponential(5, n_samples).clip(0, 40)
        debt_ratio = np.random.uniform(0, 1, n_samples)
        credit_score = np.random.normal(700, 50, n_samples).clip(300, 850).astype(int)
        num_credit_lines = np.random.poisson(3, n_samples)
        num_late_payments = np.random.poisson(1, n_samples)
        total_debt = np.random.lognormal(10, 1, n_samples)
        monthly_income = income / 12
        loan_amount = np.random.lognormal(9, 1.2, n_samples)
        interest_rate = np.random.uniform(3, 25, n_samples)
        employment_type = np.random.choice(['Full-time', 'Part-time', 'Self-employed', 'Unemployed'],
                                            n_samples, p=[0.5, 0.2, 0.2, 0.1])
        home_ownership = np.random.choice(['Own', 'Rent', 'Mortgage', 'Other'],
                                            n_samples, p=[0.3, 0.3, 0.3, 0.1])

        # Default probability based on risk factors
        default_prob = (
            0.3 * (debt_ratio > 0.6).astype(float) +
            0.25 * (credit_score < 600).astype(float) +
            0.2 * (num_late_payments > 3).astype(float) +
            0.15 * (employment_type == 'Unemployed').astype(float) +
            0.1 * (income < 30000).astype(float) +
            np.random.uniform(0, 0.1, n_samples)
        )
        default = (default_prob > 0.5).astype(int)

        data = pd.DataFrame({
            'age': age, 'income': income, 'employment_years': employment_years,
            'debt_ratio': debt_ratio, 'credit_score': credit_score,
            'num_credit_lines': num_credit_lines, 'num_late_payments': num_late_payments,
            'total_debt': total_debt, 'monthly_income': monthly_income,
            'loan_amount': loan_amount, 'interest_rate': interest_rate,
            'employment_type': employment_type, 'home_ownership': home_ownership,
            'default': default
        })

        self.raw_data = data
        return data

    def explore_data(self, data):
        print("DATA EXPLORATION")
        print("=" * 60)
        print(f"Shape: {data.shape}")
        print(f"\nDefault Rate: {data['default'].mean():.2%}")
        print(f"\nNumeric Features Summary:")
        print(data.describe().to_string())
        print(f"\nCategorical Features:")
        for col in data.select_dtypes(include=['object']).columns:
            print(f"\n{col}:")
            print(data[col].value_counts())

        print(f"\nMissing Values:")
        print(data.isnull().sum().to_string())

ingestion = CreditDataIngestion()
data = ingestion.generate_credit_data(n_samples=10000)
ingestion.explore_data(data)
```

### Stage 2: Feature Engineering

```python
class CreditFeatureEngineer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = None

    def create_features(self, df):
        features = df.copy()

        # Debt-to-Income ratio
        features['debt_to_income'] = features['total_debt'] / (features['monthly_income'] + 1)

        # Credit utilization
        features['credit_utilization'] = features['total_debt'] / (features['credit_score'] * 100 + 1)

        # Risk score
        features['risk_score'] = (
            (1000 - features['credit_score']) / 500 +
            features['debt_ratio'] +
            features['num_late_payments'] * 0.2 -
            features['employment_years'] * 0.05
        )

        # Income stability
        features['income_stability'] = features['employment_years'] * features['monthly_income']

        # Loan affordability
        features['loan_affordability'] = features['loan_amount'] / (features['monthly_income'] * 12 + 1)

        # Age groups
        features['age_group'] = pd.cut(features['age'], bins=[0, 30, 45, 60, 100],
                                         labels=['Young', 'Middle', 'Senior', 'Elderly'])

        # Credit score bins
        features['credit_category'] = pd.cut(features['credit_score'],
                                              bins=[0, 580, 670, 740, 850],
                                              labels=['Poor', 'Fair', 'Good', 'Excellent'])

        return features

    def encode_features(self, df, fit=True):
        df_encoded = df.copy()

        categorical_cols = df_encoded.select_dtypes(include=['object', 'category']).columns
        for col in categorical_cols:
            if fit:
                le = LabelEncoder()
                df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
                self.label_encoders[col] = le
            else:
                df_encoded[col] = self.label_encoders[col].transform(df_encoded[col].astype(str))

        return df_encoded

    def scale_features(self, X_train, X_test):
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        return X_train_scaled, X_test_scaled

    def prepare_data(self, data, target_col='default', test_size=0.2):
        features = self.create_features(data)
        features = self.encode_features(features, fit=True)

        X = features.drop(columns=[target_col])
        y = features[target_col]
        self.feature_names = X.columns.tolist()

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )

        X_train_scaled, X_test_scaled = self.scale_features(X_train, X_test)

        return X_train_scaled, X_test_scaled, y_train, y_test

feature_engineer = CreditFeatureEngineer()
X_train, X_test, y_train, y_test = feature_engineer.prepare_data(data)

print("FEATURE ENGINEERING RESULTS")
print("=" * 60)
print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")
print(f"Features: {len(feature_engineer.feature_names)}")
print(f"Feature names: {feature_engineer.feature_names}")
```

### Stage 3: Model Training and Evaluation

```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                              roc_auc_score, confusion_matrix, classification_report,
                              precision_recall_curve, average_precision_score)
import xgboost as xgb
import lightgbm as lgb
import optuna

class CreditModelTrainer:
    def __init__(self):
        self.models = {}
        self.results = {}
        self.best_model = None

    def train_models(self, X_train, X_test, y_train, y_test):
        models = {
            'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
            'Random Forest': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(n_estimators=200, max_depth=5,
                                                             learning_rate=0.1, random_state=42),
            'XGBoost': xgb.XGBClassifier(n_estimators=200, max_depth=5, learning_rate=0.1,
                                          use_label_encoder=False, eval_metric='logloss',
                                          random_state=42),
            'LightGBM': lgb.LGBMClassifier(n_estimators=200, max_depth=5, learning_rate=0.1,
                                            random_state=42, verbose=-1),
        }

        for name, model in models.items():
            print(f"\nTraining {name}...")
            model.fit(X_train, y_train)

            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)[:, 1]

            self.results[name] = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred),
                'recall': recall_score(y_test, y_pred),
                'f1': f1_score(y_test, y_pred),
                'roc_auc': roc_auc_score(y_test, y_prob),
                'avg_precision': average_precision_score(y_test, y_prob)
            }
            self.models[name] = model

            print(f"  Accuracy:  {self.results[name]['accuracy']:.4f}")
            print(f"  Precision: {self.results[name]['precision']:.4f}")
            print(f"  Recall:    {self.results[name]['recall']:.4f}")
            print(f"  F1 Score:  {self.results[name]['f1']:.4f}")
            print(f"  ROC AUC:   {self.results[name]['roc_auc']:.4f}")

        # Select best model by ROC AUC
        best_name = max(self.results, key=lambda x: self.results[x]['roc_auc'])
        self.best_model = self.models[best_name]
        print(f"\nBest Model: {best_name} (ROC AUC: {self.results[best_name]['roc_auc']:.4f})")

    def optimize_with_optuna(self, X_train, y_train):
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
                'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
                'subsample': trial.suggest_float('subsample', 0.5, 1.0),
            }
            clf = xgb.XGBClassifier(**params, use_label_encoder=False,
                                      eval_metric='logloss', random_state=42)
            from sklearn.model_selection import cross_val_score
            score = cross_val_score(clf, X_train, y_train, cv=5, scoring='roc_auc')
            return score.mean()

        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=30, show_progress_bar=False)

        best_xgb = xgb.XGBClassifier(**study.best_params, use_label_encoder=False,
                                       eval_metric='logloss', random_state=42)
        best_xgb.fit(X_train, y_train)
        self.models['XGBoost_Optimized'] = best_xgb
        print(f"\nOptuna Best XGBoost: {study.best_trial.value:.4f}")
        return best_xgb

trainer = CreditModelTrainer()
trainer.train_models(X_train, X_test, y_train, y_test)

print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)
results_df = pd.DataFrame(trainer.results).T
print(results_df.to_string())
```

### Stage 4: Model Evaluation and Visualization

```python
import matplotlib.pyplot as plt
import seaborn as sns

class CreditModelEvaluator:
    def __init__(self, model, X_test, y_test):
        self.model = model
        self.X_test = X_test
        self.y_test = y_test

    def plot_confusion_matrix(self):
        y_pred = self.model.predict(self.X_test)
        cm = confusion_matrix(self.y_test, y_pred)

        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=['No Default', 'Default'],
                    yticklabels=['No Default', 'Default'])
        plt.title('Confusion Matrix - Credit Risk Model')
        plt.ylabel('Actual')
        plt.xlabel('Predicted')
        plt.tight_layout()
        plt.savefig('confusion_matrix.png', dpi=150)
        plt.show()

    def plot_roc_curve(self):
        y_prob = self.model.predict_proba(self.X_test)[:, 1]
        from sklearn.metrics import roc_curve
        fpr, tpr, thresholds = roc_curve(self.y_test, y_prob)

        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, 'b-', linewidth=2, label='ROC Curve')
        plt.plot([0, 1], [0, 1], 'r--', linewidth=1, label='Random')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('ROC Curve - Credit Risk Model')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('roc_curve.png', dpi=150)
        plt.show()

    def plot_feature_importance(self, feature_names):
        if hasattr(self.model, 'feature_importances_'):
            importance = pd.DataFrame({
                'feature': feature_names,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)

            plt.figure(figsize=(10, 8))
            sns.barplot(data=importance.head(15), x='importance', y='feature')
            plt.title('Top 15 Feature Importance - Credit Risk Model')
            plt.tight_layout()
            plt.savefig('feature_importance.png', dpi=150)
            plt.show()

            return importance
        return None

    def plot_precision_recall_curve(self):
        y_prob = self.model.predict_proba(self.X_test)[:, 1]
        precision, recall, thresholds = precision_recall_curve(self.y_test, y_prob)

        plt.figure(figsize=(8, 6))
        plt.plot(recall, precision, 'b-', linewidth=2)
        plt.xlabel('Recall')
        plt.ylabel('Precision')
        plt.title('Precision-Recall Curve - Credit Risk Model')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('pr_curve.png', dpi=150)
        plt.show()

evaluator = CreditModelEvaluator(trainer.best_model, X_test, y_test)
evaluator.plot_confusion_matrix()
evaluator.plot_roc_curve()
evaluator.plot_precision_recall_curve()
importance = evaluator.plot_feature_importance(feature_engineer.feature_names)
if importance is not None:
    print("Top 10 Features:")
    print(importance.head(10).to_string(index=False))
```

### Stage 5: Model Deployment (FastAPI)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
from datetime import datetime

# Save models
joblib.dump(trainer.best_model, 'credit_risk_model.joblib')
joblib.dump(feature_engineer.scaler, 'credit_scaler.joblib')

# FastAPI Application
app = FastAPI(title="Credit Risk Assessment API", version="1.0.0")

class CreditApplication(BaseModel):
    age: int
    income: float
    employment_years: float
    debt_ratio: float
    credit_score: int
    num_credit_lines: int
    num_late_payments: int
    total_debt: float
    loan_amount: float
    interest_rate: float
    employment_type: str
    home_ownership: str

class PredictionResponse(BaseModel):
    risk_probability: float
    risk_category: str
    recommendation: str
    model_version: str
    timestamp: str

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict", response_model=PredictionResponse)
def predict(application: CreditApplication):
    try:
        # Create feature vector
        features = np.array([
            application.age, application.income, application.employment_years,
            application.debt_ratio, application.credit_score,
            application.num_credit_lines, application.num_late_payments,
            application.total_debt, application.total_debt / 12,
            application.loan_amount, application.interest_rate
        ]).reshape(1, -1)

        # Scale features
        scaler = joblib.load('credit_scaler.joblib')
        features_scaled = scaler.transform(features)

        # Predict
        model = joblib.load('credit_risk_model.joblib')
        risk_prob = model.predict_proba(features_scaled)[0][1]

        # Determine risk category
        if risk_prob < 0.3:
            risk_category = "Low Risk"
            recommendation = "Approve loan application"
        elif risk_prob < 0.6:
            risk_category = "Medium Risk"
            recommendation = "Review additional documentation"
        else:
            risk_category = "High Risk"
            recommendation = "Decline loan application"

        return PredictionResponse(
            risk_probability=float(risk_prob),
            risk_category=risk_category,
            recommendation=recommendation,
            model_version="1.0.0",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/model/info")
def model_info():
    model = joblib.load('credit_risk_model.joblib')
    return {
        'model_type': type(model).__name__,
        'n_features': model.n_features_in_,
        'version': '1.0.0'
    }
```

### Stage 6: Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY credit_risk_model.joblib .
COPY credit_scaler.joblib .
COPY app.py .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.2
numpy==1.24.3
pandas==2.1.3
scikit-learn==1.3.2
joblib==1.3.2
xgboost==2.0.2
lightgbm==4.1.0
optuna==3.4.0
matplotlib==3.8.2
seaborn==0.13.0
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  credit-risk-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/credit_risk_model.joblib
      - SCALER_PATH=/app/credit_scaler.joblib
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - credit-risk-api
```

### Stage 7: Monitoring and Alerting

```python
import numpy as np
from collections import deque
from datetime import datetime, timedelta

class CreditRiskMonitor:
    def __init__(self):
        self.predictions = deque(maxlen=10000)
        self.latencies = deque(maxlen=10000)
        self.errors = deque(maxlen=1000)
        self.alerts = []

    def log_prediction(self, features, prediction, risk_prob, latency):
        self.predictions.append({
            'features': features,
            'prediction': prediction,
            'risk_probability': risk_prob,
            'timestamp': datetime.now().isoformat()
        })
        self.latencies.append(latency)

    def check_data_drift(self, new_features, threshold=0.1):
        if len(self.predictions) < 100:
            return False

        recent_features = np.array([p['features'] for p in list(self.predictions)[-100:]])
        recent_mean = np.mean(recent_features, axis=0)
        new_mean = np.mean(new_features, axis=0)

        drift = np.mean(np.abs(recent_mean - new_mean) / (np.abs(recent_mean) + 1e-8))
        return drift > threshold

    def check_prediction_drift(self, threshold=0.1):
        if len(self.predictions) < 100:
            return False

        recent_probs = [p['risk_probability'] for p in list(self.predictions)[-100:]]
        overall_probs = [p['risk_probability'] for p in self.predictions]

        recent_mean = np.mean(recent_probs)
        overall_mean = np.mean(overall_probs)

        return abs(recent_mean - overall_mean) > threshold

    def get_metrics(self):
        if not self.predictions:
            return {}

        latencies = list(self.latencies)
        probs = [p['risk_probability'] for p in self.predictions]

        return {
            'total_predictions': len(self.predictions),
            'avg_latency_ms': np.mean(latencies),
            'p99_latency_ms': np.percentile(latencies, 99),
            'avg_risk_probability': np.mean(probs),
            'high_risk_count': sum(1 for p in probs if p > 0.6),
            'error_rate': len(self.errors) / max(len(self.predictions), 1),
            'data_drift': self.check_data_drift(np.random.randn(1, 11)),
            'prediction_drift': self.check_prediction_drift()
        }

monitor = CreditRiskMonitor()

# Simulate predictions
for i in range(500):
    features = np.random.randn(11).tolist()
    risk_prob = np.random.uniform(0, 1)
    prediction = 1 if risk_prob > 0.5 else 0
    latency = np.random.uniform(5, 50)
    monitor.log_prediction(features, prediction, risk_prob, latency)

metrics = monitor.get_metrics()
print("CREDIT RISK MONITORING DASHBOARD")
print("=" * 60)
for k, v in metrics.items():
    if isinstance(v, float):
        print(f"  {k}: {v:.4f}")
    else:
        print(f"  {k}: {v}")
```

### Stage 8: Complete Pipeline Orchestration

```python
class CreditRiskPipeline:
    def __init__(self):
        self.ingestion = CreditDataIngestion()
        self.feature_engineer = CreditFeatureEngineer()
        self.trainer = CreditModelTrainer()
        self.monitor = CreditRiskMonitor()

    def run_full_pipeline(self, n_samples=10000):
        print("=" * 70)
        print("CREDIT RISK ASSESSMENT - COMPLETE ML PIPELINE")
        print("=" * 70)

        # Stage 1: Data Ingestion
        print("\n[Stage 1] Data Ingestion...")
        data = self.ingestion.generate_credit_data(n_samples)
        print(f"  Generated {len(data)} samples")

        # Stage 2: Feature Engineering
        print("\n[Stage 2] Feature Engineering...")
        X_train, X_test, y_train, y_test = self.feature_engineer.prepare_data(data)
        print(f"  Features: {X_train.shape[1]}")
        print(f"  Training samples: {X_train.shape[0]}")
        print(f"  Test samples: {X_test.shape[0]}")

        # Stage 3: Model Training
        print("\n[Stage 3] Model Training...")
        self.trainer.train_models(X_train, X_test, y_train, y_test)

        # Stage 4: Evaluation
        print("\n[Stage 4] Model Evaluation...")
        evaluator = CreditModelEvaluator(self.trainer.best_model, X_test, y_test)
        importance = evaluator.plot_feature_importance(self.feature_engineer.feature_names)

        # Stage 5: Save Models
        print("\n[Stage 5] Saving Models...")
        joblib.dump(self.trainer.best_model, 'credit_risk_model.joblib')
        joblib.dump(self.feature_engineer.scaler, 'credit_scaler.joblib')
        print("  Models saved successfully")

        # Stage 6: Summary
        print("\n" + "=" * 70)
        print("PIPELINE COMPLETE")
        print("=" * 70)
        results_df = pd.DataFrame(self.trainer.results).T
        print("\nModel Results:")
        print(results_df.to_string())

        best_name = max(self.trainer.results, key=lambda x: self.trainer.results[x]['roc_auc'])
        print(f"\nBest Model: {best_name}")
        print(f"ROC AUC: {self.trainer.results[best_name]['roc_auc']:.4f}")

        return {
            'data': data,
            'models': self.trainer.models,
            'results': self.trainer.results,
            'best_model': self.trainer.best_model,
            'feature_names': self.feature_engineer.feature_names
        }

# Run the complete pipeline
pipeline = CreditRiskPipeline()
results = pipeline.run_full_pipeline(n_samples=10000)

# Test the API
print("\n" + "=" * 70)
print("API TEST")
print("=" * 70)

test_application = {
    'age': 35,
    'income': 75000,
    'employment_years': 8,
    'debt_ratio': 0.3,
    'credit_score': 720,
    'num_credit_lines': 4,
    'num_late_payments': 0,
    'total_debt': 25000,
    'loan_amount': 15000,
    'interest_rate': 6.5,
    'employment_type': 'Full-time',
    'home_ownership': 'Mortgage'
}

print(f"\nTest Application:")
for k, v in test_application.items():
    print(f"  {k}: {v}")

# Make prediction
model = results['best_model']
scaler = results['models']['Logistic Regression']  # Using same scaler
features = np.array([
    test_application['age'], test_application['income'],
    test_application['employment_years'], test_application['debt_ratio'],
    test_application['credit_score'], test_application['num_credit_lines'],
    test_application['num_late_payments'], test_application['total_debt'],
    test_application['total_debt'] / 12, test_application['loan_amount'],
    test_application['interest_rate']
]).reshape(1, -1)

risk_prob = model.predict_proba(features)[0][1]
if risk_prob < 0.3:
    category = "Low Risk"
    recommendation = "Approve"
elif risk_prob < 0.6:
    category = "Medium Risk"
    recommendation = "Review"
else:
    category = "High Risk"
    recommendation = "Decline"

print(f"\nPrediction Results:")
print(f"  Risk Probability: {risk_prob:.4f}")
print(f"  Risk Category: {category}")
print(f"  Recommendation: {recommendation}")
```

---

*Generated for Edureka Generative AI Masters Program - Course 3: Machine Learning with Python*
*Modules 17-20 Enhanced Content with Use Cases, Diagrams, and Projects*
