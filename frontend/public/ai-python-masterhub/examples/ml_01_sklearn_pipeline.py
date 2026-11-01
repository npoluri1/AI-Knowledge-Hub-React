"""pip install scikit-learn"""
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

pipe = Pipeline([("scaler", StandardScaler()),
                 ("clf", LogisticRegression(max_iter=5000))])   # leakage-safe: scaler fits in CV

param_grid = [
    {"clf": [LogisticRegression(max_iter=5000)],
     "clf__C": [0.01, 0.1, 1, 10]},
    {"clf": [RandomForestClassifier(random_state=42)],
     "clf__n_estimators": [200, 400],
     "clf__max_depth": [None, 8]},
]
gs = GridSearchCV(pipe, param_grid, cv=StratifiedKFold(5, shuffle=True, random_state=42),
                  scoring="roc_auc", n_jobs=-1)
gs.fit(X_tr, y_tr)

best = gs.best_estimator_
proba = best.predict_proba(X_te)[:, 1]
print("best:", gs.best_params_, "cv_auc=%.4f" % gs.best_score_)
print("test_auc=%.4f" % roc_auc_score(y_te, proba))
print(confusion_matrix(y_te, best.predict(X_te)))
print(classification_report(y_te, best.predict(X_te), digits=3))