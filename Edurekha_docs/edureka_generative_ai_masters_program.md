# Edureka Generative AI Masters Program
# Course 1: Data Science Foundations with Python
## Modules 1â€“6

---

# Module 1: Introduction to Python for Data Science

## 1.1 Python Scripting â€” First Script, Variables, Data Types, I/O

Python is the lingua franca of data science. Its readable syntax, massive ecosystem, and interpreted nature make it ideal for rapid prototyping, data exploration, and production deployment alike.

### Your First Python Script

```python
# first_script.py
print("Welcome to the Edureka Generative AI Masters Program!")
print("This is your first Python script for data science.")

# Variables and basic data types
name = "Data Scientist"          # str
experience_years = 5             # int
accuracy = 0.973                 # float
isemployed = True                # bool

print(f"Role: {name}")
print(f"Experience: {experience_years} years")
print(f"Model Accuracy: {accuracy}")
print(f"Employed: {isemployed}")
```

### Core Data Types

```python
# Numeric types
age: int = 30
salary: float = 85000.50
complex_num: complex = 3 + 4j

# String type
dataset_name = "customer_churn_2026"
description = """This dataset contains
customer behavior records for
telecom churn prediction."""

# Boolean
has_missing_values = True

# Type checking
print(type(age))          # <class 'int'>
print(type(salary))       # <class 'float'>
print(type(dataset_name)) # <class 'str'>
print(type(has_missing_values))  # <class 'bool'>
```

### User Input and Output

```python
# Reading user input
project_name = input("Enter the project name: ")
num_features = int(input("How many features? "))
learning_rate = float(input("Enter learning rate: "))

# Formatted output
print(f"Project: {project_name}")
print(f"Features: {num_features}")
print(f"Learning Rate: {learning_rate}")

# String formatting methods
template = "The model '{}' achieved {:.2%} accuracy"
print(template.format("RandomForest", 0.9567))
# Output: The model 'RandomForest' achieved 95.67% accuracy
```

### Type Conversion (Casting)

```python
# Implicit conversion
result = 10 + 3.14   # int + float -> float
print(result)         # 13.14

# Explicit conversion
text_number = "42"
converted = int(text_number)
print(converted + 8)  # 50

float_val = float("3.14159")
print(float_val)      # 3.14159

# Common pitfalls
# int("3.14")  -> ValueError!
# Use float() first, then int() if needed
```

---

## 1.2 Python Data Structures â€” Lists, Tuples, Dictionaries, Sets

Data structures are the backbone of any data manipulation task. Choosing the right structure impacts performance, readability, and correctness.

### Lists

```python
# Creating lists
feature_names = ["age", "income", "credit_score", "loan_amount"]
mixed = [1, "hello", 3.14, True, None]

# List operations
feature_names.append("employment_length")
feature_names.insert(1, "education_level")
feature_names.remove("credit_score")

# Slicing
first_three = feature_names[:3]
last_two = feature_names[-2:]

# List comprehension â€” essential for data science
squared_values = [x**2 for x in range(10)]
even_numbers = [x for x in range(100) if x % 2 == 0]

print(f"Squared: {squared_values}")
print(f"Even count: {len(even_numbers)}")
```

### Tuples

```python
# Tuples are immutable â€” useful for fixed records
patient_record = ("P10042", "John Doe", 45, "Diabetes Type 2")
patient_id, name, age, diagnosis = patient_record  # unpacking

print(f"Patient: {name}, Age: {age}")

# Named tuples for readability
from collections import namedtuple

DatasetInfo = namedtuple("DatasetInfo", ["name", "rows", "columns", "source"])
housing_data = DatasetInfo("california_housing", 20640, 8, "sklearn")
print(f"{housing_data.name}: {housing_data.rows} rows from {housing_data.source}")

# Tuple as dictionary key (lists cannot be keys)
coordinates = {(35.6762, 139.6503): "Tokyo", (40.7128, -74.0060): "New York"}
```

### Dictionaries

```python
# Model performance tracking
model_scores = {
    "Random Forest": {"accuracy": 0.94, "f1": 0.91, "train_time": 12.3},
    "XGBoost": {"accuracy": 0.96, "f1": 0.93, "train_time": 8.7},
    "Neural Network": {"accuracy": 0.97, "f1": 0.95, "train_time": 45.2}
}

# Accessing nested values
print(model_scores["XGBoost"]["accuracy"])  # 0.96

# Dictionary comprehension
best_models = {
    name: scores["accuracy"]
    for name, scores in model_scores.items()
    if scores["accuracy"] > 0.95
}

# Merging dictionaries
new_results = {"SVM": {"accuracy": 0.92, "f1": 0.89, "train_time": 22.1}}
model_scores.update(new_results)

# Safe access with get()
nn_precision = model_scores.get("Neural Network", {}).get("precision", "N/A")
print(f"NN Precision: {nn_precision}")
```

### Sets

```python
# Sets â€” unique, unordered, O(1) lookup
training_features = {"age", "income", "score", "amount", "employment"}
selected_features = {"income", "score", "employment", "education", "region"}

# Set operations for feature analysis
common = training_features & selected_features     # intersection
only_training = training_features - selected_features  # difference
all_features = training_features | selected_features   # union

print(f"Common features: {common}")
print(f"In training only: {only_training}")
print(f"All features: {all_features}")

# Deduplication
raw_labels = ["spam", "ham", "spam", "ham", "spam", "spam", "ham"]
unique_labels = list(set(raw_labels))
print(f"Unique labels: {unique_labels}")
```

---

## 1.3 Control Flow and Functions

### Conditional Logic

```python
# Model selection based on dataset characteristics
num_samples = 15000
num_features = 42
has_gpu = True

if num_samples < 1000:
    model = "Logistic Regression"
elif num_features > 100 and num_samples > 10000:
    model = "XGBoost"
elif has_gpu and num_samples > 50000:
    model = "Deep Neural Network"
else:
    model = "Random Forest"

print(f"Recommended model: {model}")

# Ternary / conditional expression
status = "deploy" if num_samples > 10000 else "prototype"
```

### Loops

```python
# Iterate through datasets
datasets = [
    {"name": "iris", "samples": 150, "classes": 3},
    {"name": "mnist", "samples": 70000, "classes": 10},
    {"name": "cifar10", "samples": 60000, "classes": 10}
]

for dataset in datasets:
    print(f"{dataset['name'].upper()}: {dataset['samples']} samples, "
          f"{dataset['classes']} classes")

# Enumerate for index tracking
for idx, dataset in enumerate(datasets):
    print(f"Dataset {idx + 1}: {dataset['name']}")

# While loop â€” training simulation
epoch = 0
loss = 10.0
learning_rate = 0.9

while loss > 0.01:
    loss *= learning_rate
    epoch += 1
    if epoch % 10 == 0:
        print(f"Epoch {epoch}: Loss = {loss:.4f}")

print(f"Converged at epoch {epoch} with loss {loss:.6f}")
```

### Functions

```python
# Basic function
def calculate_metrics(y_true, y_pred):
    """Calculate classification metrics."""
    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
    accuracy = correct / len(y_true)
    return accuracy

# Function with default parameters
def load_dataset(name="iris", test_size=0.2, random_state=42):
    """Simulate loading a dataset with parameters."""
    config = {
        "name": name,
        "test_size": test_size,
        "random_state": random_state
    }
    print(f"Loading {name} with test_size={test_size}")
    return config

# *args and **kwargs
def log_experiment(model_name, *metrics, **hyperparams):
    """Log experiment results with flexible arguments."""
    print(f"\n{'='*50}")
    print(f"Model: {model_name}")
    print(f"Metrics: {metrics}")
    print(f"Hyperparameters:")
    for key, value in hyperparams.items():
        print(f"  {key}: {value}")

log_experiment("XGBoost", 0.96, 0.93, 0.91,
               n_estimators=200, max_depth=6, learning_rate=0.1)

# Lambda functions
normalize = lambda x: (x - min(x)) / (max(x) - min(x)) if max(x) != min(x) else x
data = [10, 20, 30, 40, 50]
print(f"Normalized: {normalize(data)}")
```

---

## 1.4 Object-Oriented Programming Basics

OOP is essential for building reusable ML pipelines, custom transformers, and managing complex data science projects.

```python
# Base class for ML models
class BaseModel:
    """Base class for machine learning models."""

    def __init__(self, name, hyperparameters=None):
        self.name = name
        self.hyperparameters = hyperparameters or {}
        self.is_trained = False
        self.training_history = []

    def train(self, X, y):
        """Simulate training."""
        self.is_trained = True
        self.training_history.append({"status": "trained", "samples": len(X)})
        print(f"{self.name} trained on {len(X)} samples")
        return self

    def predict(self, X):
        """Base predict method."""
        if not self.is_trained:
            raise ValueError(f"{self.name} must be trained before prediction")
        return [0] * len(X)

    def __repr__(self):
        return f"{self.name}(trained={self.is_trained})"


# Inheritance
class ClassifierModel(BaseModel):
    """Classification model with metrics."""

    def __init__(self, name, num_classes, **kwargs):
        super().__init__(name, **kwargs)
        self.num_classes = num_classes
        self.metrics = {}

    def evaluate(self, y_true, y_pred):
        """Calculate and store evaluation metrics."""
        accuracy = sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true)
        self.metrics["accuracy"] = accuracy
        print(f"{self.name} Accuracy: {accuracy:.4f}")
        return self.metrics

    def predict(self, X):
        """Override with classification-specific prediction."""
        super().predict(X)
        import random
        return [random.randint(0, self.num_classes - 1) for _ in X]


# Usage
rf_model = ClassifierModel("RandomForest", num_classes=3, n_estimators=200)
rf_model.train(["sample1", "sample2", "sample3"], [0, 1, 2])
predictions = rf_model.predict(["new_sample1", "new_sample2"])
rf_model.evaluate([0, 1], predictions)
print(rf_model)
```

---

## 1.5 File Handling and Exception Handling

### File Operations

```python
import json
import csv

# Writing data to a JSON file
experiment_results = {
    "experiment_id": "EXP_001",
    "model": "XGBoost",
    "accuracy": 0.96,
    "features_used": ["age", "income", "score"],
    "hyperparameters": {"n_estimators": 200, "max_depth": 6}
}

with open("experiment_results.json", "w") as f:
    json.dump(experiment_results, f, indent=2)

# Reading JSON
with open("experiment_results.json", "r") as f:
    loaded_results = json.load(f)

print(f"Experiment {loaded_results['experiment_id']}: "
      f"Accuracy = {loaded_results['accuracy']}")

# Reading CSV files
with open("data.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)

# Writing CSV
headers = ["model", "accuracy", "f1_score", "training_time"]
data_rows = [
    ["Random Forest", 0.94, 0.91, 12.3],
    ["XGBoost", 0.96, 0.93, 8.7],
    ["SVM", 0.92, 0.89, 22.1]
]

with open("model_comparison.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(data_rows)
```

### Exception Handling

```python
def safe_model_prediction(model, input_data):
    """Robust prediction with comprehensive error handling."""
    try:
        if model is None:
            raise ValueError("Model is None â€” cannot make predictions")

        if not hasattr(model, 'predict'):
            raise AttributeError(f"Object {type(model)} has no predict method")

        if len(input_data) == 0:
            raise ValueError("Input data is empty")

        prediction = model.predict(input_data)
        return {"success": True, "predictions": prediction}

    except ValueError as e:
        print(f"Value Error: {e}")
        return {"success": False, "error": str(e), "type": "ValueError"}

    except AttributeError as e:
        print(f"Attribute Error: {e}")
        return {"success": False, "error": str(e), "type": "AttributeError"}

    except Exception as e:
        print(f"Unexpected error: {type(e).__name__}: {e}")
        return {"success": False, "error": str(e), "type": type(e).__name__}

    finally:
        print("Prediction attempt completed")


# Custom exception
class DataQualityError(Exception):
    """Raised when data quality checks fail."""
    def __init__(self, message, severity="warning", affected_rows=0):
        super().__init__(message)
        self.severity = severity
        self.affected_rows = affected_rows

def validate_data(df, min_rows=100, max_null_pct=0.3):
    """Validate dataset quality."""
    if len(df) < min_rows:
        raise DataQualityError(
            f"Only {len(df)} rows, minimum is {min_rows}",
            severity="critical",
            affected_rows=min_rows - len(df)
        )
    return True
```

---

## 1.6 Python Libraries for Data Science Overview

| Library | Purpose | Key Functions |
|---------|---------|---------------|
| NumPy | Numerical computing | Arrays, linear algebra, broadcasting |
| Pandas | Data manipulation | DataFrames, groupby, merge |
| Matplotlib | Basic visualization | Plots, histograms, scatter |
| Seaborn | Statistical visualization | Heatmaps, pair plots, box plots |
| Scikit-learn | Machine learning | Classification, regression, clustering |
| TensorFlow/Keras | Deep learning | Neural networks, GPU acceleration |
| PyTorch | Deep learning | Dynamic computation graphs |
| Plotly | Interactive visualization | Dashboards, 3D plots |
| Statsmodels | Statistical modeling | Regression, hypothesis testing |
| SciPy | Scientific computing | Optimization, signal processing |

```python
# Quick demo of the core stack
import numpy as np
import pandas as pd

# NumPy for numerical operations
array_2d = np.random.randn(5, 4)
print(f"Array shape: {array_2d.shape}")
print(f"Mean: {array_2d.mean():.4f}")
print(f"Std: {array_2d.std():.4f}")

# Pandas for structured data
df = pd.DataFrame(
    array_2d,
    columns=["feature_1", "feature_2", "feature_3", "feature_4"],
    sample_id=[f"S{i:03d}" for i in range(5)]
)
print(df.describe())
```

---

## Use Case Table â€” Module 1

| Industry | Application | Python Concepts Used | Impact |
|----------|-------------|---------------------|--------|
| Healthcare | Patient data records and analysis | Data types, dictionaries, file I/O | Structured patient records for faster diagnosis |
| Finance | Transaction logging and categorization | Lists, loops, functions | Automated transaction classification |
| E-commerce | Customer behavior tracking | Dictionaries, JSON handling | Personalized recommendation engine |
| Manufacturing | Quality control data collection | OOP, file handling, exceptions | Defect rate reduction by 30% |
| Telecommunications | Network log parsing | String operations, regex, CSV | Anomaly detection in network traffic |

## Project Ideas â€” Module 1

**Project 1: Student Grade Tracker**
Build a CLI application that stores student grades (name, subject, score) using dictionaries, supports add/search/update/delete operations, and exports results to CSV and JSON.

**Project 2: Simple Data Profiling Tool**
Create a function that accepts any list of dictionaries and computes: column types, missing values, unique counts, min/max for numeric fields. Print a formatted report.

**Project 3: Personal Expense Logger**
Develop a command-line expense tracker with classes for Expense, Category, and Budget. Support file persistence, exception handling for invalid inputs, and monthly summaries.

---

# Module 2: Working with Python Programming

## 2.1 NumPy Arrays and Operations

NumPy provides the fundamental n-dimensional array object that underpins all numerical computing in Python.

### Array Creation and Properties

```python
import numpy as np

# Array creation methods
a1 = np.array([1, 2, 3, 4, 5])
a2 = np.zeros((3, 4))
a3 = np.ones((2, 3, 4))
a4 = np.arange(0, 100, 5)
a5 = np.linspace(0, 1, 100)
a6 = np.random.randn(4, 4)

# Properties
print(f"Shape: {a6.shape}")
print(f"Dtype: {a6.dtype}")
print(f"Ndim: {a6.ndim}")
print(f"Size: {a6.size}")
print(f"Itemsize: {a6.itemsize} bytes")
print(f"Total bytes: {a6.nbytes}")
```

### Array Indexing and Slicing

```python
data = np.random.randint(0, 100, size=(10, 5))

# 2D slicing
subset = data[:5, :3]         # first 5 rows, first 3 cols
diagonal = np.diag(data[:5, :5])

# Boolean indexing
mask = data > 50
filtered = data[mask]

# Fancy indexing
row_indices = [0, 2, 4, 6, 8]
col_indices = [1, 3]
selected = data[row_indices][:, col_indices]

# Where function
labels = np.where(data > 50, 1, 0)  # binary classification
print(f"Positive samples: {labels.sum()}")
```

### Universal Functions (Ufuncs)

```python
# Element-wise operations â€” vectorized, fast
x = np.random.randn(1000000)

# These are ALL vectorized â€” no Python loops needed
squared = np.square(x)
log_vals = np.log(np.abs(x) + 1)
exp_vals = np.exp(x / 2)
sin_vals = np.sin(x)

# Aggregation functions
print(f"Mean: {np.mean(x):.4f}")
print(f"Median: {np.median(x):.4f}")
print(f"Std: {np.std(x):.4f}")
print(f"Percentile (95): {np.percentile(x, 95):.4f}")

# Axis operations for 2D arrays
matrix = np.random.randn(100, 10)
row_means = np.mean(matrix, axis=1)  # mean across columns
col_stds = np.std(matrix, axis=0)    # std across rows
print(f"Row means shape: {row_means.shape}")   # (100,)
print(f"Col stds shape: {col_stds.shape}")     # (10,)
```

---

## 2.2 Pandas DataFrames Basics

Pandas is the workhorse library for data manipulation, providing labeled, heterogeneous data structures.

```python
import pandas as pd
import numpy as np

# Creating DataFrames
data = {
    "customer_id": [f"C{str(i).zfill(5)}" for i in range(1, 1001)],
    "age": np.random.randint(18, 70, 1000),
    "income": np.random.normal(55000, 15000, 1000).round(2),
    "credit_score": np.random.randint(300, 850, 1000),
    "loan_approved": np.random.choice([True, False], 1000, p=[0.6, 0.4]),
    "employment_years": np.random.randint(0, 40, 1000)
}
df = pd.DataFrame(data)

# Basic exploration
print(df.head(10))
print(df.info())
print(df.describe())
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print(f"Dtypes:\n{df.dtypes}")

# Selection
age_income = df[["age", "income"]]
high_income = df[df["income"] > 70000]
specific_cols = df.loc[:, "age":"credit_score"]
row_slice = df.iloc[0:10, 0:4]

# Adding derived columns
df["income_bracket"] = pd.cut(
    df["income"],
    bins=[0, 30000, 50000, 70000, 100000, float("inf")],
    labels=["<30K", "30-50K", "50-70K", "70-100K", "100K+"]
)
df["age_group"] = pd.cut(df["age"], bins=[0, 25, 35, 50, 65, 100],
                          labels=["18-25", "26-35", "36-50", "51-65", "65+"])
print(df.groupby("income_bracket")["loan_approved"].mean())
```

---

## 2.3 Data Cleaning with Pandas

```python
import pandas as pd
import numpy as np

# Simulate a messy dataset
np.random.seed(42)
messy = pd.DataFrame({
    "ID": [1, 2, 2, 3, None, 5, 6, 7, 8, 9],
    "Name": ["Alice", "Bob", "Bob", "Charlie", "Diana",
             "Eve", None, "Grace", "Heidi", "Ivan"],
    "Age": [25, 30, 30, 35, 28, 40, 22, None, 45, 999],
    "Salary": [50000, None, 60000, 75000, 55000,
               80000, 45000, 62000, None, 58000],
    "Department": ["IT", "HR", "hr", "IT", "Finance",
                   "IT", "HR", None, "FINANCE", "It"],
    "JoinDate": ["2020-01-15", "2019-06-20", "2019-06-20",
                 "2021-03-10", None, "2018-11-01",
                 "2022-07-25", "2020-09-30", "2017-04-12", "invalid-date"]
})

print("=== Missing Values ===")
print(messy.isnull().sum())
print(f"\nTotal missing: {messy.isnull().sum().sum()}")

# Remove duplicates
messy = messy.drop_duplicates()
print(f"\nAfter dedup: {messy.shape}")

# Fix data types
messy["JoinDate"] = pd.to_datetime(messy["JoinDate"], errors="coerce")
messy["Age"] = pd.to_numeric(messy["Age"], errors="coerce")

# Handle outliers using IQR
Q1 = messy["Age"].quantile(0.25)
Q3 = messy["Age"].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
messy.loc[(messy["Age"] < lower) | (messy["Age"] > upper), "Age"] = np.nan

# Fill missing values
messy["Name"] = messy["Name"].fillna("Unknown")
messy["Age"] = messy["Age"].fillna(messy["Age"].median())
messy["Salary"] = messy["Salary"].fillna(messy["Salary"].mean())
messy["Department"] = messy["Department"].str.upper().str.strip()
messy["Department"] = messy["Department"].fillna("UNKNOWN")

print("\n=== Cleaned Data ===")
print(messy.info())
print(messy.head(10))
```

---

## 2.4 Data Import/Export (CSV, JSON, SQL, Excel)

```python
import pandas as pd
import numpy as np
import json
import sqlite3

# Create sample data
df = pd.DataFrame({
    "product": ["Widget A", "Widget B", "Gadget X", "Gadget Y", "Tool Z"],
    "price": [29.99, 49.99, 149.99, 199.99, 89.99],
    "quantity_sold": np.random.randint(100, 5000, 5),
    "category": ["tools", "tools", "gadgets", "gadgets", "tools"]
})

# CSV
df.to_csv("products.csv", index=False)
csv_df = pd.read_csv("products.csv")

# JSON
records = df.to_dict(orient="records")
with open("products.json", "w") as f:
    json.dump(records, f, indent=2)

json_df = pd.read_json("products.json")

# Excel (requires openpyxl)
df.to_excel("products.xlsx", index=False, sheet_name="Sales")
excel_df = pd.read_excel("products.xlsx", sheet_name="Sales")

# SQLite
conn = sqlite3.connect(":memory:")
df.to_sql("products", conn, index=False, if_exists="replace")

# Query SQL
result = pd.read_sql(
    "SELECT category, AVG(price) as avg_price, SUM(quantity_sold) as total_sold "
    "FROM products GROUP BY category",
    conn
)
print(result)
conn.close()
```

---

## 2.5 String Operations and Regular Expressions

```python
import pandas as pd
import re

# String vectorized operations on Series
names = pd.Series(["alice smith", "bob jones", "charlie brown", "diana prince"])

# Accessor methods
print(names.str.title())                     # "Alice Smith"
print(names.str.upper())
print(names.str.split(" "))                  # Two-word names
print(names.str.len())
print(names.str.contains("o"))               # Boolean mask

# Extract patterns
emails = pd.Series([
    "alice@gmail.com", "bob@company.org", "charlie@university.edu"
])
domains = emails.str.extract(r"@(\w+\.\w+)")
print(domains)

# Regular expressions for data cleaning
raw_logs = pd.Series([
    "2026-01-15 ERROR: Database connection failed",
    "2026-01-16 WARNING: High memory usage (89%)",
    "2026-01-17 INFO: Model training complete. Accuracy: 0.96",
    "2026-01-18 ERROR: Timeout after 30 seconds"
])

# Extract components
parsed = raw_logs.str.extract(
    r"(\d{4}-\d{2}-\d{2})\s+(ERROR|WARNING|INFO):\s+(.+)"
)
parsed.columns = ["date", "level", "message"]
print(parsed)

# Find and extract numerical values from logs
accuracies = raw_logs.str.extract(r"(\d\.\d+)").dropna()
print(f"Extracted accuracy: {accuracies.values}")

# Named groups
log_pattern = re.compile(
    r"(?P<date>\d{4}-\d{2}-\d{2})\s+(?P<level>ERROR|WARNING|INFO):\s+(?P<message>.+)"
)
for match in log_pattern.finditer(raw_logs.iloc[2]):
    print(f"Date: {match.group('date')}, Level: {match.group('level')}")
```

---

## 2.6 List Comprehensions and Generators

```python
# Nested list comprehension
matrix = [[i * j for j in range(1, 6)] for i in range(1, 6)]
flat = [val for row in matrix for val in row]
print(f"Flat: {flat}")

# Conditional filtering
data = list(range(1, 101))
multiples_of_3_and_5 = [x for x in data if x % 3 == 0 and x % 5 == 0]
print(f"Multiples of 3 and 5: {multiples_of_3_and_5}")

# Dictionary comprehension â€” feature importance
importances = {"age": 0.35, "income": 0.28, "score": 0.22,
               "region": 0.10, "other": 0.05}
top_features = {k: round(v, 3) for k, v in sorted(
    importances.items(), key=lambda x: x[1], reverse=True
) if v > 0.10}
print(f"Top features: {top_features}")

# Generator â€” memory efficient for large datasets
def large_data_generator(n):
    """Yields synthetic data points without storing all in memory."""
    for i in range(n):
        yield {
            "id": i,
            "value": (i * 1.5 + 0.3) % 100,
            "label": i % 3
        }

# Process in chunks
total = 0
count = 0
for point in large_data_generator(1_000_000):
    total += point["value"]
    count += 1
    if count >= 10000:
        break

print(f"Average of first 10K points: {total / count:.4f}")

# Generator expression (like list comprehension but lazy)
squares_gen = (x**2 for x in range(1_000_000))
first_5 = [next(squares_gen) for _ in range(5)]
print(f"First 5 squares: {first_5}")
```

---

## Use Case Table â€” Module 2

| Industry | Application | NumPy/Pandas Technique | Impact |
|----------|-------------|----------------------|--------|
| Retail | Sales forecasting data prep | GroupBy, time series indexing | 20% improvement in forecast accuracy |
| Banking | Transaction categorization | String ops, regex, CSV handling | Automated categorization of 95% of transactions |
| Healthcare | EHR data extraction | SQL reading, DataFrame ops | Reduced data prep time by 60% |
| Media | User engagement analytics | Aggregation, pivot tables | Real-time dashboard for content performance |
| Logistics | Route optimization data | NumPy arrays, matrix operations | 15% reduction in delivery time |

## Project Ideas â€” Module 2

**Project 1: ETL Pipeline Builder**
Build a complete ETL pipeline that reads from CSV/JSON/SQL, cleans data (handles duplicates, missing values, type errors), transforms (normalization, encoding), and exports to multiple formats.

**Project 2: Web Log Analyzer**
Parse Apache/Nginx access logs using regex, load into a Pandas DataFrame, compute: top pages, peak hours, unique visitors, error rates, and geographic distribution of requests.

**Project 3: Multi-Source Data Reconciler**
Create a tool that loads the same entity data from 3+ different sources (CSV, JSON, API mock), identifies discrepancies, and produces a merged, cleaned master dataset with conflict resolution rules.

---

# Module 3: Advanced Python Programming for Data Science

## 3.1 Decorators and Context Managers

### Decorators

```python
import time
import functools

# Timing decorator for benchmarking ML operations
def timer(func):
    """Measure and print execution time."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f} seconds")
        return result
    return wrapper

# Retry decorator for unreliable APIs
def retry(max_attempts=3, delay=1):
    """Retry failed function calls."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt < max_attempts - 1:
                        print(f"Attempt {attempt + 1} failed: {e}. Retrying...")
                        time.sleep(delay)
                    else:
                        raise
        return wrapper
    return decorator

# Cache decorator for expensive computations
def memoize(func):
    """Cache results of expensive function calls."""
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@timer
def train_model(data_size):
    """Simulate model training."""
    import numpy as np
    X = np.random.randn(data_size, 10)
    y = np.random.randint(0, 2, data_size)
    # Simulate training time
    time.sleep(0.1)
    return f"Model trained on {data_size} samples"

@memoize
def expensive_calculation(n):
    """Simulate expensive computation."""
    time.sleep(0.05)
    return sum(i ** 2 for i in range(n))

result = train_model(10000)
result = expensive_calculation(1000)
result = expensive_calculation(1000)  # cached, instant
```

### Context Managers

```python
from contextlib import contextmanager
import time

# Class-based context manager
class ExperimentLogger:
    """Track experiment metadata and timing."""

    def __init__(self, experiment_name):
        self.experiment_name = experiment_name
        self.metadata = {}

    def __enter__(self):
        self.start_time = time.time()
        print(f"Starting experiment: {self.experiment_name}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.time() - self.start_time
        self.metadata["duration"] = f"{duration:.2f}s"
        if exc_type:
            self.metadata["status"] = "FAILED"
            self.metadata["error"] = str(exc_val)
        else:
            self.metadata["status"] = "SUCCESS"
        print(f"Experiment complete: {self.metadata}")
        return False  # Don't suppress exceptions

# Usage
with ExperimentLogger("XGBoost Training") as exp:
    import numpy as np
    X = np.random.randn(1000, 5)
    y = np.random.randint(0, 2, 1000)
    exp.metadata["samples"] = len(X)
    exp.metadata["features"] = X.shape[1]

# Function-based context manager
@contextmanager
def temporary_seed(seed):
    """Temporarily set random seed for reproducibility."""
    import random
    import numpy as np
    old_state = random.getstate()
    old_np_state = np.random.get_state()
    random.seed(seed)
    np.random.seed(seed)
    try:
        yield
    finally:
        random.setstate(old_state)
        np.random.set_state(old_np_state)

# Reproducible data generation
with temporary_seed(42):
    data1 = np.random.randn(5)
with temporary_seed(42):
    data2 = np.random.randn(5)
print(f"Reproducible: {np.array_equal(data1, data2)}")  # True
```

---

## 3.2 Iterators and Generators Deep Dive

```python
# Custom iterator for batch processing
class BatchIterator:
    """Iterate over data in mini-batches."""

    def __init__(self, data, batch_size=32):
        self.data = data
        self.batch_size = batch_size
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration
        batch = self.data[self.index:self.index + self.batch_size]
        self.index += self.batch_size
        return batch

# Usage
import numpy as np
X = np.random.randn(1000, 10)
y = np.random.randint(0, 2, 1000)

for i, (batch_X, batch_y) in enumerate(
    zip(BatchIterator(X, 32), BatchIterator(y, 32))
):
    if i < 3:
        print(f"Batch {i}: X={batch_X.shape}, y={batch_y.shape}")

# Generator for streaming data
def data_streamer(file_pattern, max_files=10):
    """Simulate streaming data from files."""
    for i in range(max_files):
        filename = file_pattern.format(i)
        # Simulate loading data
        chunk = np.random.randn(500, 5)
        yield filename, chunk

# Process data lazily â€” memory efficient
total_samples = 0
for fname, chunk in data_streamer("data_part_{}.csv", max_files=5):
    total_samples += chunk.shape[0]
    print(f"Processed {fname}: {chunk.shape[0]} samples")

print(f"Total samples processed: {total_samples}")

# Generator pipeline
def filter_fn(data, threshold=0):
    """Filter generator."""
    for item in data:
        if item > threshold:
            yield item

def transform_fn(data, factor=2):
    """Transform generator."""
    for item in data:
        yield item * factor

# Pipeline
raw = (x * 0.1 for x in range(100))  # Source generator
filtered = filter_fn(raw, threshold=0.5)
transformed = transform_fn(filtered, factor=10)

results = list(transformed)
print(f"Pipeline results: {results[:10]}")
```

---

## 3.3 Multithreading and Multiprocessing

```python
import concurrent.futures
import time
import multiprocessing

# I/O-bound tasks: use threading
def download_simulation(url):
    """Simulate downloading a dataset."""
    time.sleep(0.5)  # Simulate network I/O
    return f"Downloaded: {url}"

urls = [f"https://example.com/dataset_{i}.csv" for i in range(10)]

# Sequential
start = time.time()
sequential_results = [download_simulation(url) for url in urls]
seq_time = time.time() - start

# Threaded
start = time.time()
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    threaded_results = list(executor.map(download_simulation, urls))
thread_time = time.time() - start

print(f"Sequential: {seq_time:.2f}s")
print(f"Threaded: {thread_time:.2f}s")

# CPU-bound tasks: use multiprocessing
def compute_heavy(n):
    """CPU-intensive computation."""
    return sum(i ** 2 for i in range(n))

numbers = [10**7] * 4

start = time.time()
sequential = [compute_heavy(n) for n in numbers]
seq_time = time.time() - start

start = time.time()
with concurrent.futures.ProcessPoolExecutor(max_workers=4) as executor:
    parallel = list(executor.map(compute_heavy, numbers))
par_time = time.time() - start

print(f"Sequential: {seq_time:.2f}s")
print(f"Parallel: {par_time:.2f}s")
```

---

## 3.4 Lambda Functions and Functional Programming

```python
from functools import reduce, partial
from operator import itemgetter

# Lambda with map, filter, reduce
data = [{"name": "Alice", "score": 85}, {"name": "Bob", "score": 92},
        {"name": "Charlie", "score": 78}, {"name": "Diana", "score": 95}]

# Sort by score descending
sorted_data = sorted(data, key=lambda x: x["score"], reverse=True)
print(sorted_data)

# Map: extract names
names = list(map(lambda x: x["name"].upper(), data))
print(names)

# Filter: high scores
high_scores = list(filter(lambda x: x["score"] >= 90, data))
print(high_scores)

# Reduce: average score
average = reduce(lambda acc, x: acc + x["score"], data, 0) / len(data)
print(f"Average score: {average:.1f}")

# Partial functions â€” lock in parameters
from operator import mul
double = partial(mul, 2)
triple = partial(mul, 3)

values = [1, 2, 3, 4, 5]
print(f"Doubled: {list(map(double, values))}")
print(f"Tripled: {list(map(triple, values))}")

# Functional composition
def compose(*functions):
    """Compose multiple functions into one."""
    def composed(x):
        result = x
        for f in reversed(functions):
            result = f(result)
        return result
    return composed

clean_and_validate = compose(
    float,
    str.strip,
    lambda x: x if x.replace(".", "").isdigit() else "0"
)
```

---

## 3.5 Error Handling Best Practices

```python
import logging
from typing import Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("DataPipeline")

# Custom exception hierarchy
class DataPipelineError(Exception):
    """Base exception for data pipeline."""
    pass

class DataLoadError(DataPipelineError):
    """Failed to load data."""
    def __init__(self, source: str, reason: str):
        self.source = source
        self.reason = reason
        super().__init__(f"Failed to load from {source}: {reason}")

class DataValidationError(DataPipelineError):
    """Data validation failed."""
    def __init__(self, errors: list):
        self.errors = errors
        super().__init__(f"Validation failed: {len(errors)} errors found")

class ModelTrainingError(DataPipelineError):
    """Model training failed."""
    pass

# Robust pipeline
class SafeDataPipeline:
    def __init__(self):
        self.errors = []

    def load(self, source: str) -> Any:
        try:
            # Simulate loading
            if not source:
                raise DataLoadError(source, "Empty source path")
            logger.info(f"Loading from {source}")
            return {"data": "loaded"}
        except DataLoadError:
            raise
        except Exception as e:
            logger.error(f"Unexpected error loading {source}: {e}")
            raise DataLoadError(source, str(e))

    def validate(self, data: Any) -> bool:
        errors = []
        if data is None:
            errors.append("Data is None")
        if errors:
            self.errors.extend(errors)
            raise DataValidationError(errors)
        return True

# Usage with proper exception handling
pipeline = SafeDataPipeline()
try:
    data = pipeline.load("dataset.csv")
    pipeline.validate(data)
except DataLoadError as e:
    logger.error(f"Load failed: {e}")
except DataValidationError as e:
    logger.error(f"Validation failed: {e.errors}")
except DataPipelineError as e:
    logger.error(f"Pipeline error: {e}")
finally:
    logger.info("Pipeline execution completed")
```

---

## 3.6 Writing Clean, Testable Python Code

```python
# SOLID principles applied to data science code

# Single Responsibility: Separate data loading, transformation, and modeling
import numpy as np
from typing import List, Dict, Optional

class DataLoader:
    """Handles only data loading concerns."""

    def load_from_dict(self, data: Dict) -> np.ndarray:
        return np.array(list(data.values()))

class DataTransformer:
    """Handles only data transformation."""

    def standardize(self, X: np.ndarray) -> np.ndarray:
        mean = X.mean(axis=0)
        std = X.std(axis=0)
        return (X - mean) / std

    def add_bias(self, X: np.ndarray) -> np.ndarray:
        return np.column_stack([np.ones(X.shape[0]), X])

class ModelEvaluator:
    """Handles only evaluation metrics."""

    @staticmethod
    def accuracy(y_true: np.ndarray, y_pred: np.ndarray) -> float:
        return np.mean(y_true == y_pred)

    @staticmethod
    def mse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
        return np.mean((y_true - y_pred) ** 2)

# Dependency injection
class MLPipeline:
    def __init__(self, loader: DataLoader, transformer: DataTransformer,
                 evaluator: ModelEvaluator):
        self.loader = loader
        self.transformer = transformer
        self.evaluator = evaluator

    def run(self, data: Dict, y: np.ndarray) -> Dict:
        X = self.loader.load_from_dict(data)
        X_std = self.transformer.standardize(X)
        X_bias = self.transformer.add_bias(X_std)

        # Simple linear regression via normal equation
        weights = np.linalg.lstsq(X_bias, y, rcond=None)[0]
        y_pred = X_bias @ weights

        return {
            "weights": weights,
            "mse": self.evaluator.mse(y, y_pred),
            "predictions": y_pred
        }

# Clean usage
loader = DataLoader()
transformer = DataTransformer()
evaluator = ModelEvaluator()
pipeline = MLPipeline(loader, transformer, evaluator)

data = {"feature_1": np.random.randn(100), "feature_2": np.random.randn(100)}
y = np.random.randn(100)
result = pipeline.run(data, y)
print(f"MSE: {result['mse']:.4f}")
```

---

## Use Case Table â€” Module 3

| Industry | Application | Advanced Python Concept | Impact |
|----------|-------------|------------------------|--------|
| Finance | Real-time fraud detection pipeline | Generators, multiprocessing | Sub-second fraud detection |
| Healthcare | Multi-threaded image preprocessing | Threading, context managers | 4x faster image processing |
| Tech | API data collection at scale | Decorators, retry logic | 99.5% data collection success |
| Retail | Recommendation engine pipeline | Functional programming, partial | Modular, testable recommendation system |
| Media | Content moderation pipeline | Error handling hierarchy, logging | Graceful degradation under load |

## Project Ideas â€” Module 3

**Project 1: Decorated Data Pipeline**
Build a complete data pipeline with decorators for: timing, logging, retry, caching, and validation. Each stage (load, transform, train, evaluate) should be independently testable.

**Project 2: Parallel Data Processor**
Create a multiprocessing pipeline that processes large CSV files in chunks, applies transformations in parallel, and merges results. Benchmark sequential vs. parallel performance.

**Project 3: Custom Iterator for Streaming Data**
Build a custom iterator class that simulates reading data from a stream (e.g., Kafka topic), supports batching, windowing, and provides a clean Python interface for downstream consumers.

---

# Module 4: Data Analysis with NumPy and Pandas

## 4.1 Advanced NumPy â€” Broadcasting, Vectorization, Linear Algebra

```python
import numpy as np

# Broadcasting â€” operations on arrays of different shapes
a = np.array([[1], [2], [3]])    # (3, 1)
b = np.array([10, 20, 30])       # (3,)

# Broadcasting expands dimensions automatically
result = a + b  # (3, 3) result
print(result)
# [[11, 21, 31],
#  [12, 22, 32],
#  [13, 23, 33]]

# Real-world: distance matrix computation
def compute_distance_matrix(points):
    """Compute pairwise Euclidean distances using broadcasting."""
    # points: (n_samples, n_features)
    # Expand dims for broadcasting
    diff = points[:, np.newaxis, :] - points[np.newaxis, :, :]
    distances = np.sqrt(np.sum(diff ** 2, axis=2))
    return distances

points = np.random.randn(100, 5)
dist_matrix = compute_distance_matrix(points)
print(f"Distance matrix shape: {dist_matrix.shape}")  # (100, 100)

# Linear algebra
X = np.random.randn(100, 10)
y = np.random.randn(100)

# Ordinary least squares: y = Xw
# w = (X^T X)^(-1) X^T y
w = np.linalg.inv(X.T @ X) @ X.T @ y
y_pred = X @ w
ss_res = np.sum((y - y_pred) ** 2)
ss_tot = np.sum((y - y.mean()) ** 2)
r_squared = 1 - ss_res / ss_tot
print(f"R-squared: {r_squared:.4f}")

# SVD for dimensionality reduction
U, S, Vt = np.linalg.svd(X, full_matrices=False)
# Keep top k components
k = 3
X_reduced = U[:, :k] * S[:k]
print(f"Reduced shape: {X_reduced.shape}")  # (100, 3)
```

---

## 4.2 Advanced Pandas â€” GroupBy, Merge, Pivot, Melt

```python
import pandas as pd
import numpy as np

# Create realistic multi-table dataset
np.random.seed(42)
n_orders = 500

orders = pd.DataFrame({
    "order_id": range(1, n_orders + 1),
    "customer_id": np.random.randint(1, 51, n_orders),
    "product_id": np.random.randint(1, 21, n_orders),
    "quantity": np.random.randint(1, 10, n_orders),
    "order_date": pd.date_range("2025-01-01", periods=n_orders, freq="D")
})

products = pd.DataFrame({
    "product_id": range(1, 21),
    "product_name": [f"Product_{i}" for i in range(1, 21)],
    "category": np.random.choice(["Electronics", "Clothing", "Food", "Books"], 20),
    "price": np.random.uniform(5, 500, 20).round(2)
})

customers = pd.DataFrame({
    "customer_id": range(1, 51),
    "name": [f"Customer_{i}" for i in range(1, 51)],
    "segment": np.random.choice(["Premium", "Standard", "Basic"], 50),
    "region": np.random.choice(["North", "South", "East", "West"], 50)
})

# Merge tables
order_details = orders.merge(products, on="product_id").merge(customers, on="customer_id")
order_details["revenue"] = order_details["quantity"] * order_details["price"]

# GroupBy operations
category_revenue = order_details.groupby("category").agg(
    total_revenue=("revenue", "sum"),
    avg_order_value=("revenue", "mean"),
    num_orders=("order_id", "count"),
    unique_customers=("customer_id", "nunique")
).round(2).sort_values("total_revenue", ascending=False)

print("=== Revenue by Category ===")
print(category_revenue)

# Multi-level groupby
region_segment = order_details.groupby(["region", "segment"]).agg(
    revenue=("revenue", "sum"),
    avg_quantity=("quantity", "mean")
).round(2)
print("\n=== Region x Segment ===")
print(region_segment)

# Pivot table
pivot = order_details.pivot_table(
    values="revenue",
    index="region",
    columns="category",
    aggfunc="sum",
    fill_value=0,
    margins=True,
    margins_name="Total"
).round(2)
print("\n=== Revenue Pivot Table ===")
print(pivot)

# Melt: unpivot for visualization
pivot_melted = pivot.reset_index().melt(
    id_vars=["region"],
    var_name="category",
    value_name="revenue"
)
print("\n=== Melted Data ===")
print(pivot_melted.head(10))
```

---

## 4.3 Data Aggregation and Transformation

```python
import pandas as pd
import numpy as np

# Create employee data
np.random.seed(42)
employees = pd.DataFrame({
    "employee_id": range(1, 201),
    "department": np.random.choice(["Engineering", "Marketing", "Sales", "HR", "Finance"], 200),
    "salary": np.random.normal(75000, 20000, 200).clip(30000, 200000).round(0),
    "performance": np.random.choice(["Excellent", "Good", "Average", "Needs Improvement"], 200,
                                     p=[0.15, 0.40, 0.35, 0.10]),
    "years_experience": np.random.randint(0, 30, 200),
    "education": np.random.choice(["PhD", "Masters", "Bachelors", "Diploma"], 200)
})

# Transform operations
employees["salary_zscore"] = employees.groupby("department")["salary"].transform(
    lambda x: (x - x.mean()) / x.std()
)

employees["dept_rank"] = employees.groupby("department")["salary"].rank(
    ascending=False, method="dense"
).astype(int)

employees["exp_category"] = pd.cut(
    employees["years_experience"],
    bins=[0, 3, 7, 15, 30],
    labels=["Junior", "Mid", "Senior", "Executive"]
)

# Aggregation with multiple functions
dept_summary = employees.groupby("department").agg(
    headcount=("employee_id", "count"),
    avg_salary=("salary", "mean"),
    median_salary=("salary", "median"),
    salary_std=("salary", "std"),
    avg_experience=("years_experience", "mean"),
    excellent_pct=("performance", lambda x: (x == "Excellent").mean() * 100)
).round(2)

print(dept_summary)

# Window functions
employees["rolling_avg_salary"] = employees.sort_values("years_experience").groupby(
    "department"
)["salary"].transform(lambda x: x.rolling(5, min_periods=1).mean()).round(0)

# Cross-tabulation
ct = pd.crosstab(
    employees["department"],
    employees["performance"],
    normalize="index"
).round(3) * 100
print("\n=== Performance Distribution by Department (%) ===")
print(ct)
```

---

## 4.4 Handling Missing Data

```python
import pandas as pd
import numpy as np

# Create dataset with various missing patterns
np.random.seed(42)
n = 500

data = pd.DataFrame({
    "age": np.where(np.random.random(n) > 0.1, np.random.randint(18, 70, n), np.nan),
    "income": np.where(np.random.random(n) > 0.15, np.random.normal(60000, 15000, n), np.nan),
    "education": np.where(np.random.random(n) > 0.05,
                          np.random.choice(["HS", "BS", "MS", "PhD"], n), np.nan),
    "credit_score": np.where(np.random.random(n) > 0.08,
                             np.random.randint(300, 850, n), np.nan),
    "loan_amount": np.where(np.random.random(n) > 0.12,
                            np.random.uniform(1000, 100000, n), np.nan)
})

# Diagnose missingness
print("=== Missing Data Summary ===")
missing = data.isnull().sum()
missing_pct = (data.isnull().sum() / len(data) * 100).round(2)
missing_df = pd.DataFrame({"count": missing, "percent": missing_pct})
print(missing_df[missing_df["count"] > 0])

# MCAR, MAR, MNAR simulation analysis
# Simple imputation
data_filled = data.copy()
data_filled["age"].fillna(data_filled["age"].median(), inplace=True)
data_filled["income"].fillna(data_filled["income"].mean(), inplace=True)
data_filled["credit_score"].fillna(data_filled["credit_score"].median(), inplace=True)
data_filled["loan_amount"].fillna(data_filled["loan_amount"].median(), inplace=True)
data_filled["education"].fillna(data_filled["education"].mode()[0], inplace=True)

# Advanced: KNN-style imputation (manual)
def knn_impute(df, column, k=5):
    """Simple KNN imputation for a single column."""
    complete_mask = df[column].notna()
    missing_mask = df[column].isna()

    if missing_mask.sum() == 0:
        return df

    complete_data = df.loc[complete_mask].dropna()
    missing_data = df.loc[missing_mask].dropna(axis=1)

    # Use numeric columns for distance
    numeric_cols = complete_data.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) == 0 or column in numeric_cols:
        df.loc[missing_mask, column] = df.loc[complete_mask, column].median()
        return df

    X_complete = complete_data[numeric_cols].values
    X_missing = missing_data[numeric_cols].values

    from scipy.spatial.distance import cdist
    distances = cdist(X_missing, X_complete)

    for i, dist_row in enumerate(distances):
        nearest_indices = np.argsort(dist_row)[:k]
        imputed_value = complete_data.iloc[nearest_indices][column].mean()
        df.loc[missing_data.index[i], column] = imputed_value

    return df

# Multiple imputation concept
def multiple_imputation(data, n_imputations=5):
    """Perform simple multiple imputation."""
    imputed_datasets = []
    for i in range(n_imputations):
        imputed = data.copy()
        for col in data.select_dtypes(include=[np.number]).columns:
            missing_mask = imputed[col].isna()
            if missing_mask.any():
                col_mean = imputed[col].mean()
                col_std = imputed[col].std()
                imputed.loc[missing_mask, col] = np.random.normal(
                    col_mean, col_std * 0.5, missing_mask.sum()
                )
        imputed_datasets.append(imputed)
    return imputed_datasets

datasets = multiple_imputation(data, n_imputations=3)
print(f"\nGenerated {len(datasets)} imputed datasets")
print(f"Age mean across imputations: "
      f"{[d['age'].mean().round(2) for d in datasets]}")
```

---

## 4.5 Working with Time Series Data

```python
import pandas as pd
import numpy as np

# Create time series data
dates = pd.date_range(start="2024-01-01", end="2026-01-01", freq="D")
np.random.seed(42)

# Simulate daily sales with trend, seasonality, and noise
trend = np.linspace(1000, 1500, len(dates))
seasonal = 200 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)
weekly = 100 * np.sin(2 * np.pi * np.arange(len(dates)) / 7)
noise = np.random.normal(0, 50, len(dates))
sales = trend + seasonal + weekly + noise

ts = pd.DataFrame({
    "date": dates,
    "sales": sales.round(2),
    "visitors": (trend * 10 + noise * 20).astype(int)
}, index=dates)

# Time-based indexing and slicing
print(ts.loc["2025-06"])           # All June 2025
print(ts.loc["2025-01":"2025-06"]) # First half of 2025

# Resampling
daily_avg = ts["sales"].resample("D").mean()
weekly_sum = ts["sales"].resample("W").sum()
monthly_avg = ts["sales"].resample("ME").mean()
quarterly = ts["sales"].resample("QE").agg(["mean", "std", "min", "max"])

# Rolling windows
ts["sales_ma_7"] = ts["sales"].rolling(window=7, min_periods=1).mean()
ts["sales_ma_30"] = ts["sales"].rolling(window=30, min_periods=1).mean()
ts["sales_std_30"] = ts["sales"].rolling(window=30, min_periods=1).std()

# Exponential moving average
ts["sales_ema_12"] = ts["sales"].ewm(span=12, adjust=False).mean()

# Time-based features
ts["day_of_week"] = ts.index.dayofweek
ts["month"] = ts.index.month
ts["quarter"] = ts.index.quarter
ts["is_weekend"] = ts["day_of_week"].isin([5, 6]).astype(int)
ts["day_of_year"] = ts.index.dayofyear

# Lag features
for lag in [1, 7, 14, 30]:
    ts[f"sales_lag_{lag}"] = ts["sales"].shift(lag)

# Difference
ts["sales_diff_1"] = ts["sales"].diff(1)
ts["sales_diff_7"] = ts["sales"].diff(7)

# Percentage change
ts["sales_pct_change"] = ts["sales"].pct_change(7) * 100

print(ts.tail(10))
```

---

## 4.6 Performance Optimization

```python
import numpy as np
import pandas as pd
import time

# Vectorized operations vs. loops
n = 1_000_000
data = np.random.randn(n)

# Slow: Python loop
start = time.time()
result_loop = [x ** 2 + 2 * x + 1 for x in data]
loop_time = time.time() - start

# Fast: Vectorized
start = time.time()
result_vector = data ** 2 + 2 * data + 1
vector_time = time.time() - start

print(f"Loop: {loop_time:.4f}s | Vectorized: {vector_time:.4f}s | "
      f"Speedup: {loop_time/vector_time:.0f}x")

# Pandas eval() and query() for large DataFrames
df = pd.DataFrame({
    "a": np.random.randn(1_000_000),
    "b": np.random.randn(1_000_000),
    "c": np.random.randn(1_000_000)
})

# eval() for element-wise operations
start = time.time()
df["result_std"] = df["a"] ** 2 + df["b"] ** 2 + df["c"] ** 2
std_time = time.time() - start

start = time.time()
df["result_eval"] = df.eval("a**2 + b**2 + c**2")
eval_time = time.time() - start

print(f"Standard: {std_time:.4f}s | eval(): {eval_time:.4f}s")

# query() for filtering
start = time.time()
filtered_std = df[(df["a"] > 0) & (df["b"] > 0) & (df["c"] > 0)]
std_filter_time = time.time() - start

start = time.time()
filtered_query = df.query("a > 0 and b > 0 and c > 0")
query_filter_time = time.time() - start

print(f"Standard filter: {std_filter_time:.4f}s | query(): {query_filter_time:.4f}s")

# Optimize dtypes
def optimize_dtypes(df):
    """Reduce memory by downcasting types."""
    for col in df.select_dtypes(include=["int64"]).columns:
        if df[col].min() >= 0:
            if df[col].max() < 255:
                df[col] = df[col].astype(np.uint8)
            elif df[col].max() < 65535:
                df[col] = df[col].astype(np.uint16)
            else:
                df[col] = df[col].astype(np.int32)
        else:
            df[col] = df[col].astype(np.int32)
    for col in df.select_dtypes(include=["float64"]).columns:
        df[col] = df[col].astype(np.float32)
    return df

df_optimized = optimize_dtypes(df.copy())
mem_original = df.memory_usage(deep=True).sum() / 1024**2
mem_optimized = df_optimized.memory_usage(deep=True).sum() / 1024**2
print(f"Memory: {mem_original:.2f}MB -> {mem_optimized:.2f}MB "
      f"({(1 - mem_optimized/mem_original)*100:.1f}% reduction)")
```

---

## Use Case Table â€” Module 4

| Industry | Application | Analysis Technique | Impact |
|----------|-------------|-------------------|--------|
| Finance | Portfolio optimization | Linear algebra, correlation | Optimized risk-adjusted returns |
| Healthcare | Patient cohort analysis | GroupBy, merge, aggregation | Identified 3 key patient segments |
| E-commerce | Customer lifetime value | Time series, window functions | Improved CLV prediction by 25% |
| Manufacturing | Quality control analysis | Statistical process control | Reduced defect rate by 18% |
| Transportation | Route optimization data | Broadcasting, vectorized ops | 22% faster route computation |

## Project Ideas â€” Module 4

**Project 1: Financial Data Analyzer**
Download stock price data, compute technical indicators (moving averages, RSI, MACD) using advanced Pandas window operations, and create a comprehensive analysis report.

**Project 2: Missing Data Strategy Evaluator**
Create a benchmark comparing different imputation strategies (mean, median, KNN, multiple imputation) on synthetic datasets with controlled missingness patterns. Measure impact on downstream model performance.

**Project 3: Time Series Feature Engineering Pipeline**
Build a pipeline that takes raw time series data and automatically generates: lag features, rolling statistics, seasonal decomposition, Fourier features, and date-based features. Output a ML-ready feature matrix.

---

# Module 5: Data Visualization and Preprocessing Techniques

## 5.1 Matplotlib Fundamentals

```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Basic line plot
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(x, y1, label="sin(x)", color="#2196F3", linewidth=2)
ax.plot(x, y2, label="cos(x)", color="#FF5722", linewidth=2, linestyle="--")
ax.set_xlabel("X", fontsize=12)
ax.set_ylabel("Y", fontsize=12)
ax.set_title("Trigonometric Functions", fontsize=14, fontweight="bold")
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("trig_functions.png", dpi=150)
plt.show()

# Histogram
np.random.seed(42)
data = np.random.normal(100, 15, 1000)

fig, ax = plt.subplots(figsize=(8, 5))
ax.hist(data, bins=40, color="#4CAF50", edgecolor="white", alpha=0.8)
ax.axvline(data.mean(), color="red", linestyle="--", label=f"Mean: {data.mean():.1f}")
ax.axvline(np.median(data), color="orange", linestyle="--",
           label=f"Median: {np.median(data):.1f}")
ax.set_xlabel("Value")
ax.set_ylabel("Frequency")
ax.set_title("Distribution of Feature Values")
ax.legend()
plt.tight_layout()
plt.show()

# Scatter plot with color coding
np.random.seed(42)
n = 200
df = pd.DataFrame({
    "x": np.random.randn(n),
    "y": np.random.randn(n),
    "category": np.random.choice(["A", "B", "C"], n),
    "size": np.random.uniform(20, 200, n)
})

fig, ax = plt.subplots(figsize=(8, 6))
colors = {"A": "#E91E63", "B": "#2196F3", "C": "#4CAF50"}
for cat in df["category"].unique():
    subset = df[df["category"] == cat]
    ax.scatter(subset["x"], subset["y"], c=colors[cat],
              s=subset["size"], alpha=0.6, label=f"Category {cat}")
ax.set_xlabel("Feature X")
ax.set_ylabel("Feature Y")
ax.set_title("Feature Space Visualization")
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

---

## 5.2 Advanced Matplotlib â€” Subplots, Animations

```python
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.gridspec import GridSpec

# Multi-panel figure with GridSpec
fig = plt.figure(figsize=(14, 10))
gs = GridSpec(3, 3, figure=fig, hspace=0.4, wspace=0.3)

# Main large plot
ax_main = fig.add_subplot(gs[0, :])
x = np.linspace(0, 10, 200)
ax_main.fill_between(x, np.sin(x) - 0.2, np.sin(x) + 0.2, alpha=0.3, color="blue")
ax_main.plot(x, np.sin(x), color="blue", linewidth=2)
ax_main.set_title("Main Trend with Confidence Band")

# Smaller diagnostic plots
for i in range(2):
    for j in range(3):
        ax = fig.add_subplot(gs[i + 1, j])
        data = np.random.randn(50)
        ax.hist(data, bins=15, color=f"C{i*3+j}", alpha=0.7, edgecolor="white")
        ax.set_title(f"Distribution {i*3+j+1}", fontsize=9)

# Side panel
ax_side = fig.add_subplot(gs[2, :])
categories = ["Model A", "Model B", "Model C", "Model D"]
accuracies = [0.89, 0.94, 0.91, 0.96]
colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
bars = ax_side.barh(categories, accuracies, color=colors, edgecolor="white")
ax_side.set_xlim(0.8, 1.0)
ax_side.set_title("Model Comparison")
for bar, acc in zip(bars, accuracies):
    ax_side.text(bar.get_width() + 0.005, bar.get_y() + bar.get_height()/2,
                f"{acc:.2%}", va="center", fontweight="bold")

plt.suptitle("Comprehensive Analysis Dashboard", fontsize=16, fontweight="bold")
plt.savefig("dashboard.png", dpi=150, bbox_inches="tight")
plt.show()

# Animation concept (frame-based)
fig, ax = plt.subplots(figsize=(8, 5))
x = np.linspace(0, 2 * np.pi, 100)
line, = ax.plot([], [], "r-", linewidth=2)
ax.set_xlim(0, 2 * np.pi)
ax.set_ylim(-1.5, 1.5)
ax.set_title("Sine Wave Animation")
ax.grid(True, alpha=0.3)

def update(frame):
    y = np.sin(x + frame * 0.1)
    line.set_data(x, y)
    return line,

from matplotlib.animation import FuncAnimation
anim = FuncAnimation(fig, update, frames=100, interval=50, blit=True)
# anim.save("sine_wave.gif", writer="pillow", fps=20)
plt.show()
```

---

## 5.3 Seaborn Statistical Plots

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Set theme
sns.set_theme(style="whitegrid", palette="muted")

# Create sample dataset
np.random.seed(42)
n = 500
tips = pd.DataFrame({
    "total_bill": np.random.uniform(10, 60, n),
    "tip": np.random.uniform(1, 12, n),
    "sex": np.random.choice(["Male", "Female"], n),
    "smoker": np.random.choice(["Yes", "No"], n, p=[0.3, 0.7]),
    "day": np.random.choice(["Thur", "Fri", "Sat", "Sun"], n,
                            p=[0.2, 0.1, 0.35, 0.35]),
    "time": np.random.choice(["Lunch", "Dinner"], n, p=[0.35, 0.65]),
    "size": np.random.choice([1, 2, 3, 4, 5, 6], n)
})
tips["tip_pct"] = (tips["tip"] / tips["total_bill"] * 100).round(1)

# Distribution plot
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
sns.histplot(data=tips, x="total_bill", hue="time", kde=True, ax=axes[0])
axes[0].set_title("Total Bill Distribution")

sns.kdeplot(data=tips, x="total_bill", y="tip", hue="time", ax=axes[1])
axes[1].set_title("Bill vs Tip Density")

sns.ecdfplot(data=tips, x="total_bill", hue="day", ax=axes[2])
axes[2].set_title("ECDF of Total Bill")
plt.tight_layout()
plt.show()

# Categorical plots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

sns.boxplot(data=tips, x="day", y="total_bill", hue="time", ax=axes[0, 0])
axes[0, 0].set_title("Box Plot: Bill by Day and Time")

sns.violinplot(data=tips, x="day", y="tip_pct", hue="sex",
               split=True, ax=axes[0, 1])
axes[0, 1].set_title("Violin Plot: Tip % by Day and Gender")

sns.barplot(data=tips, x="day", y="total_bill", hue="smoker",
           errorbar="sd", ax=axes[1, 0])
axes[1, 0].set_title("Bar Plot: Bill by Day and Smoking")

sns.swarmplot(data=tips.sample(100), x="day", y="tip", hue="time",
             size=3, ax=axes[1, 1])
axes[1, 1].set_title("Swarm Plot: Tips")

plt.tight_layout()
plt.show()

# Pair plot and heatmap
# Correlation heatmap
corr = tips.select_dtypes(include=[np.number]).corr()
plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap="RdBu_r", center=0, fmt=".2f",
           square=True, linewidths=0.5)
plt.title("Feature Correlation Matrix")
plt.show()
```

---

## 5.4 Plotly Interactive Charts

```python
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

# Interactive scatter
np.random.seed(42)
df = px.data.gapminder().query("year == 2007")
fig = px.scatter(
    df, x="gdpPercap", y="lifeExp",
    size="pop", color="continent",
    hover_name="country",
    log_x=True,
    size_max=60,
    title="Global Development Indicators (2007)",
    labels={"gdpPercap": "GDP per Capita (log)", "lifeExp": "Life Expectancy"}
)
fig.update_layout(height=600)
fig.show()

# Interactive line chart with range slider
np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=365)
stocks = pd.DataFrame({
    "Date": dates,
    "AAPL": np.cumsum(np.random.randn(365) * 2) + 150,
    "GOOGL": np.cumsum(np.random.randn(365) * 3) + 140,
    "MSFT": np.cumsum(np.random.randn(365) * 2.5) + 380
})

fig = go.Figure()
for col in ["AAPL", "GOOGL", "MSFT"]:
    fig.add_trace(go.Scatter(
        x=stocks["Date"], y=stocks[col],
        name=col, mode="lines"
    ))

fig.update_layout(
    title="Stock Price Simulation",
    xaxis_title="Date", yaxis_title="Price ($)",
    xaxis=dict(rangeslider=dict(visible=True)),
    template="plotly_white",
    height=500
)
fig.show()

# Subplots
fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=("Revenue Trend", "Customer Segments",
                    "Top Products", "Regional Performance"),
    specs=[[{"type": "scatter"}, {"type": "pie"}],
           [{"type": "bar"}, {"type": "bar"}]]
)

# Revenue trend
months = pd.date_range("2025-01-01", periods=12, freq="ME")
revenue = np.random.uniform(50000, 80000, 12).cumsum()
fig.add_trace(go.Scatter(x=months, y=revenue, mode="lines+markers",
                         name="Revenue"), row=1, col=1)

# Pie chart
fig.add_trace(go.Pie(
    labels=["Enterprise", "SMB", "Consumer"],
    values=[45, 35, 20]
), row=1, col=2)

# Bar charts
products = ["Product A", "Product B", "Product C", "Product D"]
fig.add_trace(go.Bar(x=products, y=[120, 95, 110, 80],
                     name="Units Sold"), row=2, col=1)

regions = ["North", "South", "East", "West"]
fig.add_trace(go.Bar(x=regions, y=[300000, 250000, 350000, 280000],
                     name="Revenue"), row=2, col=2)

fig.update_layout(height=700, title_text="Business Dashboard")
fig.show()
```

---

## 5.5 Data Preprocessing â€” Scaling, Encoding, Transformation

```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import (
    StandardScaler, MinMaxScaler, RobustScaler,
    LabelEncoder, OneHotEncoder, OrdinalEncoder,
    PowerTransformer, PolynomialFeatures
)
from sklearn.model_selection import train_test_split

# Create sample data
np.random.seed(42)
n = 1000
df = pd.DataFrame({
    "age": np.random.randint(18, 70, n),
    "income": np.random.lognormal(10.8, 0.5, n),
    "credit_score": np.random.normal(680, 80, n).clip(300, 850),
    "education": np.random.choice(["HS", "BS", "MS", "PhD"], n,
                                   p=[0.3, 0.4, 0.2, 0.1]),
    "city_size": np.random.choice(["small", "medium", "large"], n),
    "target": np.random.choice([0, 1], n, p=[0.7, 0.3])
})

# Train-test split FIRST (prevent data leakage)
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42,
                                      stratify=df["target"])

# StandardScaler
std_scaler = StandardScaler()
numeric_cols = ["age", "income", "credit_score"]
train_df[numeric_cols] = std_scaler.fit_transform(train_df[numeric_cols])
test_df[numeric_cols] = std_scaler.transform(test_df[numeric_cols])

print("After StandardScaling:")
print(train_df[numeric_cols].describe().round(3))

# Ordinal Encoding
ordinal_enc = OrdinalEncoder(categories=[["HS", "BS", "MS", "PhD"]])
train_df["education_encoded"] = ordinal_enc.fit_transform(
    train_df[["education"]]
)
test_df["education_encoded"] = ordinal_enc.transform(
    test_df[["education"]]
)

# One-Hot Encoding
ohe = OneHotEncoder(sparse_output=False, drop="first")
city_encoded = ohe.fit_transform(train_df[["city_size"]])
city_cols = [f"city_{cat}" for cat in ohe.get_feature_names_out()]
train_df[city_cols] = city_encoded

# Power transformation for skewed data
pt = PowerTransformer(method="yeo-johnson")
train_df["income_transformed"] = pt.fit_transform(train_df[["income"]])

# Polynomial features
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
# Only use numeric features for polynomial
interaction_features = poly.fit_transform(
    train_df[["age", "income"]].iloc[:5]
)
print(f"\nOriginal features: 2")
print(f"With interactions: {interaction_features.shape[1]}")
```

---

## 5.6 Feature Engineering Basics

```python
import pandas as pd
import numpy as np
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.decomposition import PCA

np.random.seed(42)
n = 1000

# Create a realistic customer dataset
df = pd.DataFrame({
    "customer_id": range(1, n + 1),
    "age": np.random.randint(18, 70, n),
    "total_purchases": np.random.poisson(15, n),
    "avg_order_value": np.random.lognormal(3.5, 0.6, n).round(2),
    "days_since_last_visit": np.random.exponential(30, n).astype(int),
    "support_tickets": np.random.poisson(2, n),
    "membership_years": np.random.randint(0, 10, n),
    "satisfaction_score": np.random.uniform(1, 5, n).round(1)
})

# Feature engineering
df["total_spend"] = df["total_purchases"] * df["avg_order_value"]
df["purchase_frequency"] = df["total_purchases"] / (df["membership_years"] + 1)
df["spend_per_year"] = df["total_spend"] / (df["membership_years"] + 1)
df["tickets_per_year"] = df["support_tickets"] / (df["membership_years"] + 1)

# Recency-Frequency-Monetary (RFM) features
df["rfm_recency"] = pd.qcut(df["days_since_last_visit"], q=5,
                             labels=[5, 4, 3, 2, 1]).astype(int)
df["rfm_frequency"] = pd.qcut(df["total_purchases"].clip(upper=df["total_purchases"].quantile(0.95)),
                               q=5, labels=[1, 2, 3, 4, 5], duplicates="drop").astype(int)
df["rfm_monetary"] = pd.qcut(df["total_spend"].clip(upper=df["total_spend"].quantile(0.95)),
                              q=5, labels=[1, 2, 3, 4, 5], duplicates="drop").astype(int)
df["rfm_score"] = df["rfm_recency"] + df["rfm_frequency"] + df["rfm_monetary"]

# Create target
df["churn"] = (
    (df["days_since_last_visit"] > 60) &
    (df["satisfaction_score"] < 3) &
    (df["support_tickets"] > 3)
).astype(int)

print(f"Churn rate: {df['churn'].mean():.2%}")

# Feature selection
feature_cols = ["age", "total_purchases", "avg_order_value",
                "days_since_last_visit", "support_tickets",
                "membership_years", "satisfaction_score",
                "total_spend", "purchase_frequency",
                "spend_per_year", "tickets_per_year", "rfm_score"]

X = df[feature_cols].values
y = df["churn"].values

selector = SelectKBest(mutual_info_classif, k=8)
X_selected = selector.fit_transform(X, y)

selected_features = [feature_cols[i] for i in selector.get_support(indices=True)]
print(f"\nTop 8 features: {selected_features}")
print(f"Feature scores: {selector.scores_[selector.get_support()].round(4)}")

# PCA for dimensionality reduction
pca = PCA(n_components=0.95)  # Keep 95% variance
X_pca = pca.fit_transform(X)
print(f"\nPCA: {X.shape[1]} features -> {X_pca.shape[1]} components "
      f"(retaining {sum(pca.explained_variance_ratio_):.1%} variance)")
```

---

## Use Case Table â€” Module 5

| Industry | Application | Visualization/Preprocessing | Impact |
|----------|-------------|---------------------------|--------|
| Marketing | Customer segmentation dashboard | Seaborn cluster plots, Plotly interactive | 3x faster stakeholder decision-making |
| Finance | Risk scoring model prep | StandardScaler, feature engineering | 15% improvement in model accuracy |
| Healthcare | Patient outcome visualization | Matplotlib multi-panel dashboards | Better clinical decision support |
| E-commerce | A/B test results dashboard | Plotly interactive charts | Real-time experiment monitoring |
| Manufacturing | Defect pattern visualization | Heatmaps, PCA for dimensionality | Reduced analysis time by 40% |

## Project Ideas â€” Module 5

**Project 1: Interactive Data Exploration Dashboard**
Build a multi-page Plotly Dash or Streamlit app that loads a dataset, provides interactive visualizations (scatter, distribution, correlation), and allows users to filter, group, and explore data in real-time.

**Project 2: End-to-End Preprocessing Pipeline**
Create a reusable preprocessing pipeline class that handles: missing values, scaling, encoding (ordinal + one-hot), feature engineering, and feature selection. Include fit/transform interface compatible with scikit-learn.

**Project 3: Data Storytelling Report Generator**
Build a tool that takes a dataset and automatically generates a matplotlib/seaborn report: distributions, correlations, outlier detection, temporal patterns, and key insights â€” formatted as a PDF.

---

# Module 6: Statistical Methods for Data Science

## 6.1 Descriptive Statistics

```python
import numpy as np
import pandas as pd
from scipy import stats

np.random.seed(42)

# Generate realistic dataset
data = pd.DataFrame({
    "age": np.random.normal(42, 12, 1000).clip(18, 80).astype(int),
    "income": np.random.lognormal(10.8, 0.5, 1000).round(2),
    "satisfaction": np.random.choice([1, 2, 3, 4, 5], 1000,
                                     p=[0.05, 0.15, 0.35, 0.30, 0.15]),
    "years_employed": np.random.exponential(5, 1000).clip(0, 40).round(1)
})

# Comprehensive descriptive statistics
print("=== Measures of Central Tendency ===")
print(f"Age - Mean: {data['age'].mean():.2f}, "
      f"Median: {data['age'].median():.1f}, "
      f"Mode: {data['age'].mode()[0]}")

print(f"\nIncome - Mean: ${data['income'].mean():,.2f}, "
      f"Median: ${data['income'].median():,.2f}")

print(f"\n=== Measures of Dispersion ===")
print(f"Age - Std: {data['age'].std():.2f}, "
      f"Variance: {data['age'].var():.2f}, "
      f"Range: {data['age'].max() - data['age'].min()}")

print(f"Income - IQR: ${data['income'].quantile(0.75) - data['income'].quantile(0.25):,.2f}")

# Skewness and Kurtosis
print(f"\n=== Shape Statistics ===")
print(f"Income Skewness: {data['income'].skew():.3f} "
      f"({'right-skewed' if data['income'].skew() > 0 else 'left-skewed'})")
print(f"Income Kurtosis: {data['income'].kurtosis():.3f} "
      f"({'heavy-tailed' if data['income'].kurtosis() > 0 else 'light-tailed'})")

# Percentiles and quantiles
print(f"\n=== Income Percentiles ===")
for p in [5, 10, 25, 50, 75, 90, 95]:
    print(f"  P{p}: ${data['income'].quantile(p/100):>12,.2f}")

# Five-number summary
print(f"\n=== Five-Number Summary (Age) ===")
print(data["age"].describe())

# Coefficient of variation
cv_age = data["age"].std() / data["age"].mean() * 100
cv_income = data["income"].std() / data["income"].mean() * 100
print(f"\nCoefficient of Variation: Age={cv_age:.1f}%, Income={cv_income:.1f}%")
```

---

## 6.2 Probability Distributions

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Discrete distributions
# Binomial: number of successful conversions in n trials
n_trials = 1000
p_conversion = 0.12
binom_dist = stats.binom(n=n_trials, p=p_conversion)

print("=== Binomial Distribution (Conversion Rate) ===")
print(f"Mean conversions: {binom_dist.mean():.1f}")
print(f"Std of conversions: {binom_dist.std():.1f}")
print(f"P(100-140 conversions): "
      f"{binom_dist.cdf(140) - binom_dist.cdf(99):.4f}")

# Poisson: count events per interval
lambda_rate = 5  # 5 support tickets per hour
poisson_dist = stats.poisson(mu=lambda_rate)

print(f"\n=== Poisson Distribution (Support Tickets) ===")
print(f"P(0 tickets): {poisson_dist.pmf(0):.4f}")
print(f"P(exactly 5 tickets): {poisson_dist.pmf(5):.4f}")
print(f"P(8+ tickets): {1 - poisson_dist.cdf(7):.4f}")

# Continuous distributions
# Normal distribution
mu, sigma = 170, 8  # height in cm
normal_dist = stats.norm(loc=mu, scale=sigma)

print(f"\n=== Normal Distribution (Height) ===")
print(f"P(height > 185cm): {1 - normal_dist.cdf(185):.4f}")
print(f"P(160 < height < 180): {normal_dist.cdf(180) - normal_dist.cdf(160):.4f}")

# Exponential: time between events
rate = 0.5  # average 2 units of time between events
exp_dist = stats.expon(scale=1/rate)
print(f"\n=== Exponential Distribution ===")
print(f"Mean time between events: {exp_dist.mean():.2f}")
print(f"P(event within 1 time unit): {exp_dist.cdf(1):.4f}")

# Visualization
fig, axes = plt.subplots(2, 3, figsize=(15, 8))

# Binomial
x_binom = np.arange(80, 160)
axes[0, 0].bar(x_binom, binom_dist.pmf(x_binom), color="#2196F3", alpha=0.7)
axes[0, 0].set_title("Binomial(1000, 0.12)")

# Poisson
x_poisson = np.arange(0, 16)
axes[0, 1].bar(x_poisson, poisson_dist.pmf(x_poisson), color="#4CAF50", alpha=0.7)
axes[0, 1].set_title("Poisson(Î»=5)")

# Normal
x_normal = np.linspace(mu - 4*sigma, mu + 4*sigma, 200)
axes[0, 2].plot(x_normal, normal_dist.pdf(x_normal), color="#FF5722", linewidth=2)
axes[0, 2].fill_between(x_normal, normal_dist.pdf(x_normal), alpha=0.2, color="#FF5722")
axes[0, 2].set_title("Normal(170, 8)")

# Exponential
x_exp = np.linspace(0, 8, 200)
axes[1, 0].plot(x_exp, exp_dist.pdf(x_exp), color="#9C27B0", linewidth=2)
axes[1, 0].set_title("Exponential(Î»=0.5)")

# Log-normal (income distribution)
shape, loc, scale = 0.5, 0, np.exp(10.8)
lognorm_dist = stats.lognorm(s=shape, loc=loc, scale=scale)
x_ln = np.linspace(0, 200000, 200)
axes[1, 1].plot(x_ln, lognorm_dist.pdf(x_ln), color="#FF9800", linewidth=2)
axes[1, 1].set_title("Log-Normal (Income)")

# Chi-squared
df_chi = 4
chi2_dist = stats.chi2(df=df_chi)
x_chi = np.linspace(0, 15, 200)
axes[1, 2].plot(x_chi, chi2_dist.pdf(x_chi), color="#607D8B", linewidth=2)
axes[1, 2].set_title(f"Chi-squared(df={df_chi})")

plt.tight_layout()
plt.show()
```

---

## 6.3 Hypothesis Testing

```python
import numpy as np
from scipy import stats
import pandas as pd

np.random.seed(42)

# Scenario 1: One-sample t-test
# Question: Is the average customer age different from 35?
ages = np.random.normal(37, 10, 50)
t_stat, p_value = stats.ttest_1samp(ages, popmean=35)
print("=== One-Sample t-test ===")
print(f"Sample mean: {ages.mean():.2f}")
print(f"Hypothesized mean: 35")
print(f"t-statistic: {t_stat:.4f}")
print(f"p-value: {p_value:.4f}")
print(f"Reject H0? {'Yes' if p_value < 0.05 else 'No'} (Î±=0.05)")

# Scenario 2: Two-sample t-test (independent)
# Question: Do two marketing channels have different conversion rates?
channel_a = np.random.binomial(1, 0.12, 500)
channel_b = np.random.binomial(1, 0.15, 500)
t_stat, p_value = stats.ttest_ind(channel_a, channel_b)
print("\n=== Two-Sample t-test ===")
print(f"Channel A conversion: {channel_a.mean():.4f}")
print(f"Channel B conversion: {channel_b.mean():.4f}")
print(f"t-statistic: {t_stat:.4f}, p-value: {p_value:.4f}")

# Scenario 3: Paired t-test
# Question: Does a training program improve scores?
before = np.random.normal(65, 10, 30)
after = before + np.random.normal(5, 8, 30)  # improvement + noise
t_stat, p_value = stats.ttest_rel(before, after)
print("\n=== Paired t-test ===")
print(f"Before mean: {before.mean():.2f}")
print(f"After mean: {after.mean():.2f}")
print(f"Mean improvement: {(after - before).mean():.2f}")
print(f"t-statistic: {t_stat:.4f}, p-value: {p_value:.4f}")

# Scenario 4: Chi-squared test of independence
# Question: Is there an association between customer segment and product preference?
observed = pd.DataFrame({
    "Premium": [45, 30, 25],
    "Standard": [60, 40, 50],
    "Basic": [40, 55, 65]
}, index=["Electronics", "Clothing", "Food"])

chi2, p_value, dof, expected = stats.chi2_contingency(observed)
print("\n=== Chi-squared Test ===")
print(f"Chi-squared: {chi2:.4f}")
print(f"p-value: {p_value:.4f}")
print(f"Degrees of freedom: {dof}")
print("Observed:")
print(observed)
print("Expected:")
print(pd.DataFrame(expected.round(1), index=observed.index, columns=observed.columns))

# Scenario 5: ANOVA
# Question: Do three different pricing strategies yield different sales?
strategy_a = np.random.normal(500, 100, 30)
strategy_b = np.random.normal(550, 100, 30)
strategy_c = np.random.normal(480, 100, 30)
f_stat, p_value = stats.f_oneway(strategy_a, strategy_b, strategy_c)
print("\n=== One-Way ANOVA ===")
print(f"Strategy A mean: {strategy_a.mean():.1f}")
print(f"Strategy B mean: {strategy_b.mean():.1f}")
print(f"Strategy C mean: {strategy_c.mean():.1f}")
print(f"F-statistic: {f_stat:.4f}, p-value: {p_value:.4f}")
```

---

## 6.4 Confidence Intervals

```python
import numpy as np
from scipy import stats

np.random.seed(42)

# Scenario 1: CI for population mean
sample = np.random.normal(50000, 15000, 200)  # customer spending
n = len(sample)
x_bar = sample.mean()
s = sample.std(ddof=1)
se = s / np.sqrt(n)

# 95% CI using t-distribution
t_critical = stats.t.ppf(0.975, df=n-1)
ci_lower = x_bar - t_critical * se
ci_upper = x_bar + t_critical * se

print("=== Confidence Interval for Mean Spending ===")
print(f"Sample mean: ${x_bar:,.2f}")
print(f"Sample std: ${s:,.2f}")
print(f"Sample size: {n}")
print(f"Standard error: ${se:,.2f}")
print(f"95% CI: [${ci_lower:,.2f}, ${ci_upper:,.2f}]")

# Using scipy
ci = stats.t.interval(0.95, df=n-1, loc=x_bar, scale=se)
print(f"Scipy CI: [{ci[0]:,.2f}, {ci[1]:,.2f}]")

# Scenario 2: CI for proportion (conversion rate)
conversions = 120
total_visitors = 1000
p_hat = conversions / total_visitors
se_prop = np.sqrt(p_hat * (1 - p_hat) / total_visitors)

z_critical = stats.norm.ppf(0.975)
ci_prop_lower = p_hat - z_critical * se_prop
ci_prop_upper = p_hat + z_critical * se_prop

print(f"\n=== Confidence Interval for Conversion Rate ===")
print(f"Sample proportion: {p_hat:.4f} ({p_hat:.2%})")
print(f"95% CI: [{ci_prop_lower:.4f}, {ci_prop_upper:.4f}]")
print(f"95% CI: [{ci_prop_lower:.2%}, {ci_prop_upper:.2%}]")

# Scenario 3: Bootstrap CI
def bootstrap_ci(data, n_bootstrap=10000, ci_level=0.95):
    """Compute bootstrap confidence interval."""
    bootstrap_means = np.array([
        np.mean(np.random.choice(data, size=len(data), replace=True))
        for _ in range(n_bootstrap)
    ])
    alpha = 1 - ci_level
    lower = np.percentile(bootstrap_means, 100 * alpha / 2)
    upper = np.percentile(bootstrap_means, 100 * (1 - alpha / 2))
    return lower, upper, bootstrap_means

lower, upper, boot_means = bootstrap_ci(sample)
print(f"\n=== Bootstrap 95% CI ===")
print(f"Bootstrap mean: ${np.mean(boot_means):,.2f}")
print(f"Bootstrap CI: [${lower:,.2f}, ${upper:,.2f}]")

# Effect of sample size on CI width
print(f"\n=== Sample Size vs CI Width ===")
for n_size in [30, 100, 500, 1000, 5000]:
    sub_sample = np.random.choice(sample, n_size, replace=False)
    se_n = sub_sample.std() / np.sqrt(n_size)
    t_crit = stats.t.ppf(0.975, df=n_size-1)
    width = 2 * t_crit * se_n
    print(f"n={n_size:>5}: CI width = ${width:>,.2f}")
```

---

## 6.5 Correlation and Causation

```python
import numpy as np
import pandas as pd
from scipy import stats
import matplotlib.pyplot as plt

np.random.seed(42)
n = 500

# Create dataset with known causal relationships
temperature = np.random.normal(25, 8, n)  # causes ice cream sales & drowning
ice_cream_sales = 50 * temperature + np.random.normal(0, 100, n)  # correlated, no causation
drowning_incidents = 2 * temperature + np.random.normal(0, 5, n)  # correlated, no causation
advertising_spend = np.random.uniform(1000, 10000, n)  # causes sales
actual_sales = 0.5 * advertising_spend + 30 * temperature + np.random.normal(0, 200, n)

data = pd.DataFrame({
    "temperature": temperature,
    "ice_cream_sales": ice_cream_sales,
    "drowning_incidents": drowning_incidents,
    "advertising_spend": advertising_spend,
    "actual_sales": actual_sales
})

# Pearson correlation
print("=== Pearson Correlation Matrix ===")
pearson_corr = data.corr(method="pearson")
print(pearson_corr.round(3))

# Spearman correlation (rank-based, robust to outliers)
print("\n=== Spearman Correlation ===")
spearman_corr = data.corr(method="spearman")
print(spearman_corr.round(3))

# Significance testing for correlation
print("\n=== Correlation Significance Tests ===")
pairs = [
    ("temperature", "ice_cream_sales"),
    ("temperature", "drowning_incidents"),
    ("advertising_spend", "actual_sales"),
    ("ice_cream_sales", "drowning_incidents")  # spurious!
]

for var1, var2 in pairs:
    r, p = stats.pearsonr(data[var1], data[var2])
    sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
    print(f"{var1:25s} x {var2:25s}: r={r:.3f}, p={p:.4f} {sig}")

# Partial correlation concept
def partial_correlation(df, x, y, confounders):
    """Compute partial correlation controlling for confounders."""
    from numpy.linalg import lstsq

    # Residualize x on confounders
    Z = df[confounders].values
    X = df[x].values.reshape(-1, 1)
    Y = df[y].values.reshape(-1, 1)

    Z_with_const = np.column_stack([np.ones(len(Z)), Z])
    beta_x = lstsq(Z_with_const, X, rcond=None)[0]
    residuals_x = X - Z_with_const @ beta_x

    beta_y = lstsq(Z_with_const, Y, rcond=None)[0]
    residuals_y = Y - Z_with_const @ beta_y

    r_partial, p_partial = stats.pearsonr(residuals_x.flatten(), residuals_y.flatten())
    return r_partial, p_partial

# Control for temperature when examining ice cream vs drowning
r_partial, p_partial = partial_correlation(
    data, "ice_cream_sales", "drowning_incidents", ["temperature"]
)
print(f"\n=== Partial Correlation (controlling for temperature) ===")
r_raw, _ = stats.pearsonr(data["ice_cream_sales"], data["drowning_incidents"])
print(f"Raw correlation: {r_raw:.3f}")
print(f"Partial correlation: {r_partial:.3f}")
print("After controlling for temperature, correlation drops significantly!")
```

---

## 6.6 Bayesian Statistics Basics

```python
import numpy as np
from scipy import stats

# Bayesian inference: updating beliefs with data

# Scenario 1: Beta-Binomial model for conversion rate
# Prior: Beta(2, 5) â€” we believe conversion rate is low
prior_alpha, prior_beta = 2, 5

# Observed data: 120 conversions out of 1000 visitors
conversions = 120
trials = 1000

# Posterior: Beta(prior_alpha + conversions, prior_beta + failures)
posterior_alpha = prior_alpha + conversions
posterior_beta = prior_beta + (trials - conversions)

prior = stats.beta(prior_alpha, prior_beta)
posterior = stats.beta(posterior_alpha, posterior_beta)

print("=== Bayesian Conversion Rate Estimation ===")
print(f"Prior: Beta({prior_alpha}, {prior_beta})")
print(f"Data: {conversions}/{trials} conversions")
print(f"Posterior: Beta({posterior_alpha}, {posterior_beta})")
print(f"Prior mean: {prior.mean():.4f}")
print(f"Posterior mean: {posterior.mean():.4f}")
print(f"Posterior 95% HDI: [{posterior.ppf(0.025):.4f}, {posterior.ppf(0.975):.4f}]")

# Probability that conversion rate > 10%
prob_above_10 = 1 - posterior.cdf(0.10)
print(f"P(conversion rate > 10%): {prob_above_10:.4f}")

# Scenario 2: Bayesian A/B testing
# Model A: prior Beta(2, 8)
# Model B: prior Beta(3, 7)
# Data A: 80/1000, Data B: 120/1000
prior_a = stats.beta(2, 8)
posterior_a = stats.beta(2 + 80, 8 + 920)

prior_b = stats.beta(3, 7)
posterior_b = stats.beta(3 + 120, 7 + 880)

print(f"\n=== Bayesian A/B Testing ===")
print(f"Model A posterior mean: {posterior_a.mean():.4f}")
print(f"Model B posterior mean: {posterior_b.mean():.4f}")

# Monte Carlo simulation for P(B > A)
n_samples = 100000
samples_a = posterior_a.rvs(n_samples)
samples_b = posterior_b.rvs(n_samples)
prob_b_better = np.mean(samples_b > samples_a)
print(f"P(B > A): {prob_b_better:.4f}")

# Expected lift
lift = (samples_b - samples_a) / samples_a * 100
print(f"Expected lift: {lift.mean():.1f}% (95% CI: [{np.percentile(lift, 2.5):.1f}%, "
      f"{np.percentile(lift, 97.5):.1f}%])")

# Scenario 3: Bayesian linear regression concept
# Prior on weights: N(0, ÏƒÂ²)
# Likelihood: y = Xw + Îµ, Îµ ~ N(0, ÏƒÂ²)
# Posterior: proportional to prior Ã— likelihood

# Simple demonstration with known results
X = np.column_stack([np.ones(100), np.random.randn(100)])
y_true = 3 + 2 * X[:, 1] + np.random.randn(100) * 0.5

# MAP estimate (equivalent to ridge regression with Gaussian prior)
sigma_prior = 1.0
sigma_likelihood = 0.5

# Posterior covariance
A = (X.T @ X) / sigma_likelihood**2 + np.eye(2) / sigma_prior**2
posterior_cov = np.linalg.inv(A)
posterior_mean = posterior_cov @ (X.T @ y_true) / sigma_likelihood**2

print(f"\n=== Bayesian Linear Regression ===")
print(f"True coefficients: [3.0, 2.0]")
print(f"Posterior mean: {posterior_mean.round(4)}")
print(f"Posterior std: {np.sqrt(np.diag(posterior_cov)).round(4)}")
```

---

## Use Case Table â€” Module 6

| Industry | Application | Statistical Method | Impact |
|----------|-------------|-------------------|--------|
| Healthcare | Clinical trial analysis | Hypothesis testing, confidence intervals | Evidence-based treatment decisions |
| Finance | Portfolio risk assessment | Probability distributions, Bayesian estimation | More accurate risk quantification |
| Marketing | A/B testing optimization | Bayesian A/B testing, correlation analysis | 30% faster experiment decisions |
| E-commerce | Customer behavior modeling | Descriptive stats, feature correlation | Improved recommendation accuracy |
| Manufacturing | Quality control | Control charts, hypothesis testing | 25% reduction in defect rate |
| Technology | Model performance evaluation | Bootstrap CIs, significance testing | Rigorous model comparison |

## Project Ideas â€” Module 6

**Project 1: Bayesian A/B Testing Framework**
Build a reusable Bayesian A/B testing tool that: takes conversion data from two variants, computes posterior distributions, calculates P(B > A), expected lift with credible intervals, and determines when enough data has been collected (stopping rules).

**Project 2: Statistical Analysis Report Generator**
Create a tool that takes a dataset and automatically performs: descriptive statistics, normality tests, correlation analysis (with significance), group comparisons (t-tests/ANOVA), and generates a formatted report with visualizations and interpretations.

**Project 3: Simulation Study â€” Central Limit Theorem**
Design a simulation that demonstrates the CLT: generate data from various non-normal distributions (exponential, uniform, bimodal), compute sample means for increasing sample sizes, and visualize how the sampling distribution approaches normality. Include interactive controls.

---

## Course 1 Summary

| Module | Focus Area | Key Libraries | Key Skills |
|--------|-----------|---------------|------------|
| 1 | Python Fundamentals | Core Python | Variables, OOP, file handling |
| 2 | Python for Data Science | NumPy, Pandas | Arrays, DataFrames, data cleaning |
| 3 | Advanced Python | Standard Library | Decorators, generators, concurrency |
| 4 | Data Analysis | NumPy, Pandas | GroupBy, time series, optimization |
| 5 | Visualization & Preprocessing | Matplotlib, Seaborn, Plotly | Charts, scaling, feature engineering |
| 6 | Statistical Methods | SciPy, NumPy | Distributions, hypothesis testing, Bayesian |

**Prerequisites for Course 2:** Students should be comfortable with all concepts in these 6 modules, particularly Pandas DataFrames, NumPy array operations, basic visualization, and statistical inference.

---

*Edureka Generative AI Masters Program â€” Course 1 Complete*



---


# Edureka Generative AI Masters Program
# Course 1: Data Science Fundamentals â€“ Part 2
## Modules 7-12: Machine Learning & AutoML

---

# Module 7: Fundamentals of Machine Learning

## 7.1 What is Machine Learning?

Machine Learning is a subset of artificial intelligence that enables systems to automatically learn and improve from experience without being explicitly programmed. It focuses on the development of algorithms that can access data, learn from it, and make informed decisions.

### Types of Machine Learning

#### 1. Supervised Learning
Supervised learning uses labeled training data to learn a mapping function from inputs to outputs. The algorithm learns from labeled examples and makes predictions on unseen data.

```python
# Example: Supervised Learning - Predicting House Prices
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np

# Sample data: Square footage (features) vs Price (labels)
X = np.array([[1500], [1800], [2400], [3000], [3500], [4000]])
y = np.array([300000, 350000, 450000, 550000, 650000, 750000])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
print(f"Predictions: {predictions}")
print(f"Actual values: {y_test}")
print(f"Model coefficient: {model.coef_[0]:.2f}")
print(f"Model intercept: {model.intercept_:.2f}")
```

#### 2. Unsupervised Learning
Unsupervised learning finds hidden patterns in unlabeled data. It identifies structures, groupings, and relationships without predefined outputs.

```python
# Example: Unsupervised Learning - Customer Segmentation
from sklearn.cluster import KMeans
import numpy as np

# Sample customer data: [annual_spending, visit_frequency]
customer_data = np.array([
    [500, 12], [600, 15], [550, 10],
    [2000, 5], [2200, 8], [1800, 6],
    [100, 2], [150, 3], [120, 2]
])

# Apply K-Means clustering
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(customer_data)

# Get cluster labels
labels = kmeans.labels_
centers = kmeans.cluster_centers_

print(f"Cluster assignments: {labels}")
print(f"Cluster centers:\n{centers}")
print(f"Cluster 0 (Low spenders): Customers {[i for i, l in enumerate(labels) if l == 0]}")
print(f"Cluster 1 (Medium spenders): Customers {[i for i, l in enumerate(labels) if l == 1]}")
print(f"Cluster 2 (High spenders): Customers {[i for i, l in enumerate(labels) if l == 2]}")
```

#### 3. Reinforcement Learning
Reinforcement learning learns optimal actions through trial and error, maximizing cumulative rewards. An agent learns to make decisions by interacting with an environment.

```python
# Example: Simple Reinforcement Learning Concept
import random

class SimpleQLearning:
    def __init__(self, n_states, n_actions, learning_rate=0.1, discount_factor=0.9, epsilon=0.1):
        self.q_table = {}  # (state, action) -> value
        self.lr = learning_rate
        self.gamma = discount_factor
        self.epsilon = epsilon
        self.n_actions = n_actions
    
    def get_q_value(self, state, action):
        return self.q_table.get((state, action), 0.0)
    
    def choose_action(self, state):
        if random.random() < self.epsilon:
            return random.randint(0, self.n_actions - 1)
        else:
            q_values = [self.get_q_value(state, a) for a in range(self.n_actions)]
            return q_values.index(max(q_values))
    
    def update(self, state, action, reward, next_state):
        current_q = self.get_q_value(state, action)
        max_next_q = max([self.get_q_value(next_state, a) for a in range(self.n_actions)])
        
        # Q-learning update formula
        new_q = current_q + self.lr * (reward + self.gamma * max_next_q - current_q)
        self.q_table[(state, action)] = new_q

# Example: Simple grid world
agent = SimpleQLearning(n_states=4, n_actions=2)
state = 0
action = agent.choose_action(state)
print(f"State: {state}, Chosen Action: {action}")
agent.update(state, action, reward=10, next_state=1)
print(f"Updated Q-value: {agent.get_q_value(state, action):.2f}")
```

## 7.2 The ML Pipeline

The ML Pipeline is a systematic workflow that transforms raw data into deployed machine learning models.

```
Data Collection â†’ Data Preprocessing â†’ Feature Engineering â†’ 
Model Selection â†’ Training â†’ Evaluation â†’ Hyperparameter Tuning â†’ 
Deployment â†’ Monitoring
```

```python
# Complete ML Pipeline Example
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer

# Step 1: Data Collection (simulated)
np.random.seed(42)
data = pd.DataFrame({
    'age': np.random.randint(18, 70, 100),
    'income': np.random.randint(30000, 150000, 100),
    'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], 100),
    'experience': np.random.randint(0, 40, 100),
    'purchased': np.random.choice([0, 1], 100)
})

# Step 2: Data Preprocessing
# Handle missing values
data['age'].fillna(data['age'].median(), inplace=True)

# Step 3: Feature Engineering
data['income_per_age'] = data['income'] / data['age']
data['experience_ratio'] = data['experience'] / data['age']

# Step 4: Prepare features and target
X = data[['age', 'income', 'education', 'experience', 'income_per_age', 'experience_ratio']]
y = data['purchased']

# Step 5: Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 6: Build preprocessing and model pipeline
numeric_features = ['age', 'income', 'experience', 'income_per_age', 'experience_ratio']
categorical_features = ['education']

numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Full pipeline with model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Step 7: Train the model
pipeline.fit(X_train, y_train)

# Step 8: Evaluate
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Step 9: Make predictions on new data
new_customer = pd.DataFrame({
    'age': [35],
    'income': [75000],
    'education': ['Master'],
    'experience': [10],
    'income_per_age': [75000/35],
    'experience_ratio': [10/35]
})
prediction = pipeline.predict(new_customer)
print(f"\nPrediction for new customer: {'Will purchase' if prediction[0] == 1 else 'Will not purchase'}")
```

## 7.3 Train/Test Split and Cross-Validation

### Train/Test Split
Separating data into training and testing sets prevents overfitting and provides an unbiased evaluation.

```python
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)

# Different split ratios
splits = [0.2, 0.25, 0.3, 0.4]

for test_size in splits:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Test size: {test_size:.0%}")
    print(f"  Train samples: {len(X_train)}, Test samples: {len(X_test)}")
    print(f"  Accuracy: {accuracy:.4f}\n")
```

### Cross-Validation
Cross-validation provides a more robust evaluation by using multiple train/test splits.

```python
from sklearn.model_selection import cross_val_score, KFold, StratifiedKFold
from sklearn.datasets import load_iris
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Load dataset
X, y = load_iris(return_X_y=True)

# Define models
models = {
    'SVM': SVC(kernel='rbf', random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
}

# 5-Fold Cross Validation
print("=== 5-Fold Cross Validation ===")
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
    print(f"{name}:")
    print(f"  Scores: {scores}")
    print(f"  Mean: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})\n")

# Stratified K-Fold (maintains class distribution)
print("=== Stratified 5-Fold Cross Validation ===")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for name, model in models.items():
    scores = []
    for train_idx, test_idx in skf.split(X, y):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]
        
        model.fit(X_train, y_train)
        score = model.score(X_test, y_test)
        scores.append(score)
    
    print(f"{name}:")
    print(f"  Scores: {np.array(scores)}")
    print(f"  Mean: {np.mean(scores):.4f} (+/- {np.std(scores) * 2:.4f})\n")
```

## 7.4 Bias-Variance Tradeoff

The bias-variance tradeoff is a fundamental concept in ML that describes the balance between two sources of error.

```python
import numpy as np
import matplotlib.pyplot as true_plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

# Generate synthetic data with noise
np.random.seed(42)
n_samples = 100
X = np.sort(np.random.uniform(0, 10, n_samples)).reshape(-1, 1)
y_true = 2 * X.ravel() + 3 * np.sin(X.ravel()) + np.random.normal(0, 2, n_samples)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y_true, test_size=0.2, random_state=42)

# Test different polynomial degrees
degrees = [1, 3, 10, 20]
train_errors = []
test_errors = []

print("=== Bias-Variance Tradeoff Demonstration ===\n")

for degree in degrees:
    # Create polynomial features
    poly = PolynomialFeatures(degree=degree)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)
    
    # Fit model
    model = LinearRegression()
    model.fit(X_train_poly, y_train)
    
    # Calculate errors
    train_pred = model.predict(X_train_poly)
    test_pred = model.predict(X_test_poly)
    
    train_mse = mean_squared_error(y_train, train_pred)
    test_mse = mean_squared_error(y_test, test_pred)
    
    train_errors.append(train_mse)
    test_errors.append(test_mse)
    
    print(f"Degree {degree}:")
    print(f"  Train MSE: {train_mse:.4f}")
    print(f"  Test MSE: {test_mse:.4f}")
    if degree == 1:
        print(f"  Bias: HIGH, Variance: LOW (Underfitting)")
    elif degree == 3:
        print(f"  Bias: BALANCED, Variance: BALANCED (Good fit)")
    else:
        print(f"  Bias: LOW, Variance: HIGH (Overfitting)")
    print()

# Visualization
print("Key Insights:")
print("1. Low-degree models (degree=1): High bias, low variance â†’ Underfitting")
print("2. Medium-degree models (degree=3): Balanced bias-variance â†’ Optimal")
print("3. High-degree models (degree=10+): Low bias, high variance â†’ Overfitting")
```

## 7.5 Evaluation Metrics

### Classification Metrics

```python
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                            f1_score, roc_auc_score, confusion_matrix,
                            classification_report, roc_curve
)
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Generate binary classification data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2,
                           weights=[0.7, 0.3], random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Get predictions
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

# Calculate metrics
print("=== Classification Metrics ===")
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")
print(f"ROC AUC:   {roc_auc_score(y_test, y_proba):.4f}")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Detailed metric explanations
print("\n=== Metric Interpretation ===")
print("â€¢ Accuracy: Overall correctness (use when classes are balanced)")
print("â€¢ Precision: Of all positive predictions, how many were actually positive")
print("â€¢ Recall: Of all actual positives, how many were correctly identified")
print("â€¢ F1 Score: Harmonic mean of precision and recall (balances both)")
print("â€¢ ROC AUC: Area under ROC curve (measures discrimination ability)")
```

## 7.6 Scikit-learn Workflow

```python
# Complete Scikit-learn Workflow
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

# 1. Load Data
data = load_breast_cancer()
X, y = data.data, data.target
print(f"Dataset shape: {X.shape}")
print(f"Classes: {data.target_names}")
print(f"Features: {data.feature_names[:5]}... (showing first 5)")

# 2. Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# 3. Create Pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(random_state=42))
])

# 4. Define Hyperparameter Grid
param_grid = {
    'classifier__n_estimators': [50, 100, 200],
    'classifier__max_depth': [None, 10, 20],
    'classifier__min_samples_split': [2, 5, 10]
}

# 5. Grid Search with Cross-Validation
grid_search = GridSearchCV(
    pipeline, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
)
grid_search.fit(X_train, y_train)

print(f"\nBest Parameters: {grid_search.best_params_}")
print(f"Best CV Score: {grid_search.best_score_:.4f}")

# 6. Evaluate on Test Set
y_pred = grid_search.predict(X_test)
test_accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {test_accuracy:.4f}")

# 7. Classification Report
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=data.target_names))

# 8. Feature Importance
best_model = grid_search.best_estimator_.named_steps['classifier']
importances = best_model.feature_importances_
top_features_idx = np.argsort(importances)[::-1][:5]
print("\nTop 5 Important Features:")
for idx in top_features_idx:
    print(f"  {data.feature_names[idx]}: {importances[idx]:.4f}")
```

## Use Case Table: Machine Learning

| Industry | Use Case | ML Type | Algorithm | Benefits |
|----------|----------|---------|-----------|----------|
| Healthcare | Disease Diagnosis | Supervised | Random Forest, SVM | Early detection, accurate diagnosis |
| Finance | Fraud Detection | Supervised | Gradient Boosting | Real-time detection, reduced losses |
| Retail | Customer Segmentation | Unsupervised | K-Means, DBSCAN | Targeted marketing, better inventory |
| Manufacturing | Predictive Maintenance | Supervised | LSTM, XGBoost | Reduced downtime, cost savings |
| Transportation | Route Optimization | Reinforcement | Q-Learning, DQN | Fuel efficiency, faster delivery |
| Marketing | Churn Prediction | Supervised | Logistic Regression | Customer retention, revenue protection |
| E-commerce | Recommendation Systems | Hybrid | Collaborative Filtering | Increased sales, customer satisfaction |

## Project Ideas

### Project 1: End-to-End ML Pipeline for Customer Churn Prediction
Build a complete pipeline from data preprocessing to model deployment for predicting customer churn in a telecom dataset.

### Project 2: Multi-Class Classification with Cross-Validation
Develop a robust classification system using multiple algorithms and comprehensive cross-validation strategies.

### Project 3: Model Interpretability Dashboard
Create a model interpretability tool using SHAP values to explain predictions in a credit scoring application.

---

# Module 8: Supervised Learning â€“ Regression Analysis

## 8.1 Simple Linear Regression

Simple linear regression models the relationship between two variables by fitting a linear equation to observed data.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# Sample data: Years of experience vs Salary
np.random.seed(42)
X = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
y = 25000 + 5000 * X.ravel() + np.random.normal(0, 3000, 10)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Get parameters
print("=== Simple Linear Regression Results ===")
print(f"Coefficient (slope): {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"Equation: Salary = {model.intercept_:.2f} + {model.coef_[0]:.2f} Ã— Experience")

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print(f"\nModel Performance:")
print(f"RÂ² Score: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")

# Predict for new value
new_experience = np.array([[6.5]])
predicted_salary = model.predict(new_experience)
print(f"\nPredicted salary for 6.5 years experience: ${predicted_salary[0]:,.2f}")

# Visualization
plt.figure(figsize=(10, 6))
plt.scatter(X, y, color='blue', label='Actual data')
plt.plot(X, model.predict(X), color='red', linewidth=2, label='Regression line')
plt.xlabel('Years of Experience')
plt.ylabel('Salary')
plt.title('Simple Linear Regression: Experience vs Salary')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

## 8.2 Multiple Linear Regression

Multiple linear regression extends simple linear regression by using multiple predictor variables.

```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

# Generate sample house price data
np.random.seed(42)
n_samples = 200

data = pd.DataFrame({
    'square_feet': np.random.randint(800, 4000, n_samples),
    'bedrooms': np.random.randint(1, 6, n_samples),
    'bathrooms': np.random.randint(1, 4, n_samples),
    'age': np.random.randint(0, 50, n_samples),
    'garage': np.random.choice([0, 1, 2], n_samples)
})

# Create price based on features with some noise
data['price'] = (
    50000 +
    150 * data['square_feet'] +
    20000 * data['bedrooms'] +
    15000 * data['bathrooms'] -
    1000 * data['age'] +
    30000 * data['garage'] +
    np.random.normal(0, 25000, n_samples)
)

# Prepare features and target
X = data[['square_feet', 'bedrooms', 'bathrooms', 'age', 'garage']]
y = data['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Results
print("=== Multiple Linear Regression Results ===")
print("\nFeature Coefficients:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"  {feature}: ${coef:,.2f}")
print(f"\nIntercept: ${model.intercept_:,.2f}")

# Predictions
y_pred = model.predict(X_test_scaled)

# Evaluation
print(f"\nModel Performance:")
print(f"RÂ² Score: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: ${np.sqrt(mean_squared_error(y_test, y_pred)):,.2f}")
print(f"MAE: ${np.mean(np.abs(y_test - y_pred)):,.2f}")

# Predict new house
new_house = pd.DataFrame({
    'square_feet': [2000],
    'bedrooms': [3],
    'bathrooms': [2],
    'age': [10],
    'garage': [1]
})
new_house_scaled = scaler.transform(new_house)
predicted_price = model.predict(new_house_scaled)
print(f"\nPredicted price for new house: ${predicted_price[0]:,.2f}")
```

## 8.3 Polynomial Regression

Polynomial regression fits a nonlinear relationship by adding polynomial terms.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.model_selection import train_test_split

# Generate nonlinear data
np.random.seed(42)
X = np.sort(np.random.uniform(0, 10, 100)).reshape(-1, 1)
y = 0.5 * X.ravel()**2 - 3 * X.ravel() + 10 + np.random.normal(0, 2, 100)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Compare different polynomial degrees
degrees = [1, 2, 3, 5]
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.ravel()

results = []

for i, degree in enumerate(degrees):
    # Create polynomial features
    poly = PolynomialFeatures(degree=degree)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train_poly, y_train)
    
    # Predictions
    y_train_pred = model.predict(X_train_poly)
    y_test_pred = model.predict(X_test_poly)
    
    # Evaluation
    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)
    test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
    
    results.append({
        'degree': degree,
        'train_r2': train_r2,
        'test_r2': test_r2,
        'test_rmse': test_rmse,
        'n_features': X_train_poly.shape[1]
    })
    
    # Plot
    X_plot = np.linspace(X.min(), X.max(), 300).reshape(-1, 1)
    X_plot_poly = poly.transform(X_plot)
    y_plot = model.predict(X_plot_poly)
    
    axes[i].scatter(X_train, y_train, alpha=0.5, label='Train', s=20)
    axes[i].scatter(X_test, y_test, alpha=0.5, label='Test', s=20)
    axes[i].plot(X_plot, y_plot, 'r-', linewidth=2, label=f'Degree {degree}')
    axes[i].set_title(f'Degree {degree}\nTrain RÂ²: {train_r2:.3f}, Test RÂ²: {test_r2:.3f}')
    axes[i].set_xlabel('X')
    axes[i].set_ylabel('y')
    axes[i].legend()
    axes[i].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# Summary table
print("=== Polynomial Regression Comparison ===")
print(f"{'Degree':<10} {'Features':<12} {'Train RÂ²':<12} {'Test RÂ²':<12} {'Test RMSE':<12}")
print("-" * 58)
for r in results:
    print(f"{r['degree']:<10} {r['n_features']:<12} {r['train_r2']:<12.4f} {r['test_r2']:<12.4f} {r['test_rmse']:<12.4f}")
```

## 8.4 Regularization (Ridge, Lasso, ElasticNet)

Regularization techniques prevent overfitting by adding penalty terms to the loss function.

```python
import numpy as np
from sklearn.linear_model import Ridge, Lasso, ElasticNet, LinearRegression
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score

# Generate high-dimensional data with multicollinearity
np.random.seed(42)
n_samples, n_features = 100, 20

X = np.random.randn(n_samples, n_features)
# Only first 5 features are truly relevant
true_coef = np.zeros(n_features)
true_coef[:5] = [3, -2, 1.5, -1, 0.5]
y = X @ true_coef + np.random.normal(0, 1, n_samples)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Compare regularization methods
models = {
    'Linear Regression': LinearRegression(),
    'Ridge (L2)': Ridge(alpha=1.0),
    'Lasso (L1)': Lasso(alpha=0.1),
    'ElasticNet': ElasticNet(alpha=0.1, l1_ratio=0.5)
}

print("=== Regularization Comparison ===\n")

results = []
for name, model in models.items():
    # Train
    model.fit(X_train_scaled, y_train)
    
    # Predict
    y_pred = model.predict(X_test_scaled)
    
    # Evaluate
    test_r2 = r2_score(y_test, y_pred)
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
    
    # Number of non-zero coefficients
    if hasattr(model, 'coef_'):
        n_nonzero = np.sum(np.abs(model.coef_) > 1e-5)
    else:
        n_nonzero = n_features
    
    results.append({
        'name': name,
        'test_r2': test_r2,
        'test_rmse': test_rmse,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'n_nonzero': n_nonzero
    })
    
    print(f"{name}:")
    print(f"  Test RÂ²: {test_r2:.4f}")
    print(f"  Test RMSE: {test_rmse:.4f}")
    print(f"  CV RÂ² (meanÂ±std): {cv_scores.mean():.4f} Â± {cv_scores.std():.4f}")
    print(f"  Non-zero coefficients: {n_nonzero}")
    print()

# Lasso feature selection
print("\n=== Lasso Feature Selection ===")
lasso = Lasso(alpha=0.1)
lasso.fit(X_train_scaled, y_train)
selected_features = np.where(np.abs(lasso.coef_) > 1e-5)[0]
print(f"Selected features: {selected_features}")
print(f"True important features: [0, 1, 2, 3, 4]")
print(f"Correctly identified: {len(set(selected_features) & set([0, 1, 2, 3, 4]))}/5")
```

## 8.5 Regression Evaluation Metrics

```python
import numpy as np
from sklearn.metrics import (mean_squared_error, mean_absolute_error,
                            r2_score, mean_absolute_percentage_error)
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor

# Generate regression data
np.random.seed(42)
X, y = make_regression(n_samples=200, n_features=10, noise=10, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = GradientBoostingRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Calculate all metrics
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
mape = mean_absolute_percentage_error(y_test, y_pred)

print("=== Regression Evaluation Metrics ===\n")
print(f"Mean Squared Error (MSE):     {mse:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
print(f"Mean Absolute Error (MAE):    {mae:.4f}")
print(f"RÂ² Score:                     {r2:.4f}")
print(f"Mean Absolute % Error (MAPE): {mape:.4f}")

print("\n=== Metric Interpretation ===")
print("â€¢ MSE: Average squared difference (penalizes large errors more)")
print("â€¢ RMSE: Same units as target (easier to interpret)")
print("â€¢ MAE: Average absolute difference (robust to outliers)")
print("â€¢ RÂ²: Proportion of variance explained (1.0 = perfect)")
print("â€¢ MAPE: Percentage error (scale-independent)")

# Residual analysis
residuals = y_test - y_pred
print("\n=== Residual Analysis ===")
print(f"Mean of residuals: {np.mean(residuals):.4f} (should be ~0)")
print(f"Std of residuals:  {np.std(residuals):.4f}")
print(f"Max residual:      {np.max(np.abs(residuals)):.4f}")
```

## 8.6 Assumptions of Linear Regression

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from scipy import stats

# Generate data violating assumptions
np.random.seed(42)
n = 100

X = np.random.uniform(0, 10, n)
# Non-linear relationship
y = 2 * X + 0.5 * X**2 + np.random.normal(0, 2 + 0.5 * X, n)  # Heteroscedasticity

X = X.reshape(-1, 1)
model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)
residuals = y - y_pred

# Assumption tests
print("=== Linear Regression Assumptions ===\n")

# 1. Linearity
print("1. LINEARITY")
print("   - Check: Residuals vs Fitted plot")
print("   - Violation: Pattern in residuals indicates non-linearity")

# 2. Independence
print("\n2. INDEPENDENCE")
print("   - Check: Durbin-Watson test")
print("   - Violation: Autocorrelation in residuals")

# 3. Homoscedasticity
print("\n3. HOMOSCEDASTICITY (Constant Variance)")
print("   - Check: Residuals vs Fitted plot")
print("   - Violation: Funnel shape indicates heteroscedasticity")

# Breusch-Pagan test (simplified)
print("\n   Breusch-Pagan Test (simplified):")
_, p_value = stats.pearsonr(X.ravel(), residuals**2)
print(f"   Correlation between X and squared residuals: {p_value:.4f}")

# 4. Normality of residuals
print("\n4. NORMALITY OF RESIDUALS")
print("   - Check: Q-Q plot, Shapiro-Wilk test")
stat, p_value = stats.shapiro(residuals)
print(f"   Shapiro-Wilk test: statistic={stat:.4f}, p-value={p_value:.4f}")

# Create diagnostic plots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Plot 1: Residuals vs Fitted
axes[0, 0].scatter(y_pred, residuals, alpha=0.6)
axes[0, 0].axhline(y=0, color='r', linestyle='--')
axes[0, 0].set_xlabel('Fitted Values')
axes[0, 0].set_ylabel('Residuals')
axes[0, 0].set_title('Residuals vs Fitted')
axes[0, 0].grid(True, alpha=0.3)

# Plot 2: Q-Q Plot
stats.probplot(residuals, dist="norm", plot=axes[0, 1])
axes[0, 1].set_title('Normal Q-Q Plot')
axes[0, 1].grid(True, alpha=0.3)

# Plot 3: Scale-Location
axes[1, 0].scatter(y_pred, np.sqrt(np.abs(residuals)), alpha=0.6)
axes[1, 0].set_xlabel('Fitted Values')
axes[1, 0].set_ylabel('âˆš|Residuals|')
axes[1, 0].set_title('Scale-Location')
axes[1, 0].grid(True, alpha=0.3)

# Plot 4: Residuals vs Order
axes[1, 1].plot(range(len(residuals)), residuals, marker='o', markersize=3)
axes[1, 1].axhline(y=0, color='r', linestyle='--')
axes[1, 1].set_xlabel('Observation Order')
axes[1, 1].set_ylabel('Residuals')
axes[1, 1].set_title('Residuals vs Order')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
```

## 8.7 When to Use Regression vs Other Methods

```python
# Decision Guide for Regression vs Other Methods
import pandas as pd
from sklearn.datasets import make_classification, make_regression
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import accuracy_score, r2_score

# Example 1: When to use Regression
print("=== When to Use Regression ===")
print("\nUse Regression when:")
print("1. Target variable is continuous (e.g., price, temperature, salary)")
print("2. You need interpretable coefficients")
print("3. Relationship between features and target is roughly linear")
print("4. You want to quantify the effect of each feature")

# Example 2: When NOT to use Regression
print("\nAvoid Regression when:")
print("1. Target is categorical (use Classification instead)")
print("2. Non-linear relationships dominate")
print("3. Data has complex interactions (use tree-based methods)")
print("4. Heavy outliers present (use robust methods)")

# Decision Framework
decision_guide = pd.DataFrame({
    'Scenario': [
        'Predict house price',
        'Predict customer churn',
        'Predict stock returns',
        'Predict disease presence',
        'Predict customer lifetime value'
    ],
    'Target_Type': ['Continuous', 'Binary', 'Continuous', 'Binary', 'Continuous'],
    'Recommended_Method': ['Linear Regression', 'Logistic Regression', 
                          'LSTM/XGBoost', 'Random Forest', 'Gradient Boosting'],
    'Reason': [
        'Interpretable, linear relationship',
        'Binary outcome',
        'Time series, non-linear',
        'Complex interactions',
        'Non-linear, feature interactions'
    ]
})

print("\n=== Decision Framework ===")
print(decision_guide.to_string(index=False))
```

## Use Case Table: Regression Analysis

| Industry | Use Case | Regression Type | Key Metrics | Application |
|----------|----------|-----------------|-------------|-------------|
| Real Estate | House Price Prediction | Multiple Linear | RÂ², RMSE | Valuation, investment |
| Finance | Stock Price Forecasting | Polynomial/LSTM | MAPE, RMSE | Trading, portfolio |
| Healthcare | Patient Length of Stay | Poisson Regression | AIC, Deviance | Resource planning |
| Marketing | Customer Lifetime Value | Gradient Boosting | MAE, RÂ² | Budget allocation |
| Energy | Electricity Demand | Time Series | MAPE, RMSE | Grid management |
| Manufacturing | Quality Control | Polynomial | RÂ², MSE | Process optimization |

## Project Ideas

### Project 1: Real Estate Price Prediction
Build a comprehensive house price prediction system using multiple regression techniques, feature engineering, and regularization methods.

### Project 2: Energy Consumption Forecasting
Develop a time-series regression model to predict electricity consumption based on weather, time, and historical patterns.

### Project 3: Salary Prediction Based on Skills and Experience
Create a regression model to predict software engineer salaries based on skills, experience, location, and company size.

---

# Module 9: Supervised Learning â€“ Classification Fundamentals

## 9.1 Logistic Regression

Logapression is used for binary classification problems, predicting the probability of an outcome.

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=10, n_classes=2,
                           weights=[0.6, 0.4], random_state=42)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train logistic regression
model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_train_scaled, y_train)

# Predictions
y_pred = model.predict(X_test_scaled)
y_proba = model.predict_proba(X_test_scaled)

# Results
print("=== Logistic Regression Results ===")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred))

# Coefficients interpretation
print("\nFeature Coefficients:")
for i, coef in enumerate(model.coef_[0]):
    print(f"  Feature {i+1}: {coef:.4f}")
print(f"\nIntercept: {model.intercept_[0]:.4f}")

# Probability thresholds
print("\n=== Probability Threshold Analysis ===")
thresholds = [0.3, 0.4, 0.5, 0.6, 0.7]
for threshold in thresholds:
    y_pred_threshold = (y_proba[:, 1] >= threshold).astype(int)
    acc = accuracy_score(y_test, y_pred_threshold)
    print(f"Threshold {threshold}: Accuracy = {acc:.4f}")
```

## 9.2 K-Nearest Neighbors (KNN)

KNN classifies data points based on the majority class of their k nearest neighbors.

```python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# Load iris dataset
X, y = load_iris(return_X_y=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features (important for KNN)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Find optimal k
k_range = range(1, 31)
k_scores = []

for k in k_range:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X_train_scaled, y_train, cv=5, scoring='accuracy')
    k_scores.append(scores.mean())

optimal_k = k_range[np.argmax(k_scores)]
print(f"Optimal k: {optimal_k}")
print(f"Best CV Accuracy: {max(k_scores):.4f}")

# Train with optimal k
knn = KNeighborsClassifier(n_neighbors=optimal_k)
knn.fit(X_train_scaled, y_train)
y_pred = knn.predict(X_test_scaled)

print(f"\n=== KNN Results (k={optimal_k}) ===")
print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")

# Visualization
plt.figure(figsize=(10, 6))
plt.plot(k_range, k_scores, marker='o')
plt.xlabel('Number of Neighbors (k)')
plt.ylabel('Cross-Validation Accuracy')
plt.title('KNN: Accuracy vs k')
plt.axvline(x=optimal_k, color='r', linestyle='--', label=f'Optimal k={optimal_k}')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Distance metrics comparison
print("\n=== Distance Metrics Comparison ===")
metrics = ['euclidean', 'manhattan', 'chebyshev', 'minkowski']
for metric in metrics:
    knn = KNeighborsClassifier(n_neighbors=optimal_k, metric=metric)
    scores = cross_val_score(knn, X_train_scaled, y_train, cv=5)
    print(f"{metric}: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")
```

## 9.3 Decision Trees

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.datasets import load_wine
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load wine dataset
X, y = load_wine(return_X_y=True)
feature_names = load_wine().feature_names
target_names = load_wine().target_names

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train decision tree
dt = DecisionTreeClassifier(max_depth=3, random_state=42)
dt.fit(X_train, y_train)

# Predictions
y_pred = dt.predict(X_test)

print("=== Decision Tree Results ===")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=target_names))

# Feature importance
print("\nFeature Importance:")
importances = dt.feature_importances_
for name, importance in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
    print(f"  {name}: {importance:.4f}")

# Tree depth analysis
print("\n=== Tree Complexity Analysis ===")
for depth in [2, 3, 5, 10, None]:
    dt_temp = DecisionTreeClassifier(max_depth=depth, random_state=42)
    scores = cross_val_score(dt_temp, X_train, y_train, cv=5)
    dt_temp.fit(X_train, y_train)
    train_acc = dt_temp.score(X_train, y_train)
    test_acc = dt_temp.score(X_test, y_test)
    n_nodes = dt_temp.tree_.node_count
    print(f"Depth {depth}: Train={train_acc:.4f}, Test={test_acc:.4f}, Nodes={n_nodes}")

# Visualize tree
plt.figure(figsize=(15, 8))
plot_tree(dt, feature_names=feature_names, class_names=target_names,
          filled=True, rounded=True, fontsize=10)
plt.title("Decision Tree Visualization")
plt.tight_layout()
plt.show()
```

## 9.4 Naive Bayes Classifier

```python
import numpy as np
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.datasets import make_classification, fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report

# Example 1: Gaussian Naive Bayes (continuous features)
print("=== Gaussian Naive Bayes (Continuous Data) ===")
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

gnb = GaussianNB()
gnb.fit(X_train, y_train)
y_pred = gnb.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Example 2: Text Classification with Multinomial NB
print("\n=== Multinomial Naive Bayes (Text Classification) ===")

# Sample text data
texts = [
    "I love this movie, it's fantastic",
    "Great film, highly recommend",
    "Amazing acting and story",
    "This movie is terrible, waste of time",
    "Awful plot, bad acting",
    "Worst movie I've ever seen",
    "Beautiful cinematography and score",
    "Boring and predictable storyline",
    "Outstanding performances by the cast",
    "Poor script and direction"
]
labels = [1, 1, 1, 0, 0, 0, 1, 0, 1, 0]  # 1=positive, 0=negative

# Convert text to features
vectorizer = TfidfVectorizer(max_features=100)
X_text = vectorizer.fit_transform(texts)

# Train Multinomial NB
mnb = MultinomialNB()
mnb.fit(X_text, labels)

# Predict new text
new_texts = ["This film is wonderful and exciting"]
new_X = vectorizer.transform(new_texts)
prediction = mnb.predict(new_X)
print(f"Text: '{new_texts[0]}'")
print(f"Prediction: {'Positive' if prediction[0] == 1 else 'Negative'}")

# Compare different Naive Bayes variants
print("\n=== Naive Bayes Variants Comparison ===")
# Create binary features for Bernoulli NB
X_binary = (X > 0).astype(int)

variants = {
    'GaussianNB': GaussianNB(),
    'BernoulliNB': BernoulliNB()
}

for name, model in variants.items():
    if name == 'BernoulliNB':
        scores = cross_val_score(model, X_binary, y, cv=5)
    else:
        scores = cross_val_score(model, X, y, cv=5)
    print(f"{name}: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")
```

## 9.5 Confusion Matrix and Classification Metrics

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import (confusion_matrix, ConfusionMatrixDisplay,
                            accuracy_score, precision_score, recall_score,
                            f1_score, classification_report)
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Generate imbalanced dataset
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2,
                           weights=[0.7, 0.3], random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("=== Confusion Matrix ===")
print(f"                 Predicted")
print(f"                 Neg    Pos")
print(f"Actual Neg    | {cm[0,0]:4d} | {cm[0,1]:4d} |")
print(f"Actual Pos    | {cm[1,0]:4d} | {cm[1,1]:4d} |")

tn, fp, fn, tp = cm.ravel()
print(f"\nTrue Negatives:  {tn}")
print(f"False Positives: {fp}")
print(f"False Negatives: {fn}")
print(f"True Positives:  {tp}")

# Metrics
print("\n=== Classification Metrics ===")
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")

# Detailed interpretation
print("\n=== Metric Interpretation ===")
print(f"â€¢ Accuracy: {(tp+tn)/(tp+tn+fp+fn):.4f} - Overall correct predictions")
print(f"â€¢ Precision: {tp/(tp+fp):.4f} - Of predicted positives, {tp/(tp+fp)*100:.1f}% are actual positives")
print(f"â€¢ Recall: {tp/(tp+fn):.4f} - Of actual positives, {tp/(tp+fn)*100:.1f}% were correctly identified")
print(f"â€¢ F1 Score: {2*(tp/(tp+fp)*tp/(tp+fn))/(tp/(tp+fp)+tp/(tp+fn)):.4f} - Harmonic mean of precision and recall")

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Confusion Matrix Plot
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Negative', 'Positive'])
disp.plot(ax=axes[0], cmap='Blues')
axes[0].set_title('Confusion Matrix')

# Metrics Bar Plot
metrics = {
    'Accuracy': accuracy_score(y_test, y_pred),
    'Precision': precision_score(y_test, y_pred),
    'Recall': recall_score(y_test, y_pred),
    'F1 Score': f1_score(y_test, y_pred)
}
axes[1].bar(metrics.keys(), metrics.values(), color=['blue', 'green', 'orange', 'red'])
axes[1].set_ylim(0, 1)
axes[1].set_ylabel('Score')
axes[1].set_title('Classification Metrics')
axes[1].grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.show()
```

## 9.6 ROC Curves and AUC

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc, roc_auc_score
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# Generate data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2,
                           weights=[0.6, 0.4], random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train multiple models
models = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'SVM (probability)': SVC(kernel='rbf', probability=True, random_state=42)
}

plt.figure(figsize=(10, 8))

for name, model in models.items():
    model.fit(X_train, y_train)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    # Calculate ROC curve
    fpr, tpr, thresholds = roc_curve(y_test, y_proba)
    roc_auc = auc(fpr, tpr)
    
    # Plot
    plt.plot(fpr, tpr, label=f'{name} (AUC = {roc_auc:.3f})', linewidth=2)

# Plot random classifier
plt.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Random (AUC = 0.5)')

plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves - Model Comparison')
plt.legend(loc='lower right')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Optimal threshold analysis
print("=== Optimal Threshold Analysis ===")
model = LogisticRegression(random_state=42)
model.fit(X_train, y_train)
y_proba = model.predict_proba(X_test)[:, 1]

fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

# Find optimal threshold (Youden's J statistic)
j_scores = tpr - fpr
optimal_idx = np.argmax(j_scores)
optimal_threshold = thresholds[optimal_idx]

print(f"AUC-ROC Score: {roc_auc:.4f}")
print(f"Optimal Threshold: {optimal_threshold:.4f}")
print(f"At optimal threshold:")
print(f"  TPR (Recall): {tpr[optimal_idx]:.4f}")
print(f"  FPR: {fpr[optimal_idx]:.4f}")

# Apply optimal threshold
y_pred_optimal = (y_proba >= optimal_threshold).astype(int)
from sklearn.metrics import accuracy_score, f1_score
print(f"  Accuracy: {accuracy_score(y_test, y_pred_optimal):.4f}")
print(f"  F1 Score: {f1_score(y_test, y_pred_optimal):.4f}")
```

## Use Case Table: Classification

| Industry | Use Case | Algorithm | Key Metric | Application |
|----------|----------|-----------|------------|-------------|
| Healthcare | Disease Detection | Random Forest | Recall | Early diagnosis |
| Finance | Credit Scoring | Logistic Regression | AUC-ROC | Loan approval |
| Email | Spam Detection | Naive Bayes | F1 Score | Email filtering |
| Security | Fraud Detection | Gradient Boosting | Precision | Transaction monitoring |
| Marketing | Customer Churn | SVM | Accuracy | Retention campaigns |
| Manufacturing | Defect Detection | CNN/Random Forest | Recall | Quality control |
| Retail | Purchase Prediction | XGBoost | AUC-ROC | Targeted marketing |

## Project Ideas

### Project 1: Medical Diagnosis Classification
Build a classification system to predict diabetes presence using patient health metrics, comparing multiple algorithms.

### Project 2: Email Spam Detection System
Develop a text classification pipeline using Naive Bayes and other classifiers for real-time spam detection.

### Project 3: Customer Churn Prediction
Create a churn prediction model with probability calibration and threshold optimization for a subscription service.

---

# Module 10: Supervised Learning â€“ Advanced Classification

## 10.1 Random Forest

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load data
X, y = load_breast_cancer(return_X_y=True)
feature_names = load_breast_cancer().feature_names

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

# Predictions
y_pred = rf.predict(X_test)

print("=== Random Forest Results ===")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred))

# Feature importance
importances = rf.feature_importances_
indices = np.argsort(importances)[::-1]

print("\nTop 10 Feature Importances:")
for i in range(10):
    print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")

# Visualization
plt.figure(figsize=(12, 6))
plt.bar(range(10), importances[indices[:10]])
plt.xticks(range(10), feature_names[indices[:10]], rotation=45, ha='right')
plt.xlabel('Features')
plt.ylabel('Importance')
plt.title('Top 10 Feature Importances')
plt.tight_layout()
plt.show()

# Number of trees analysis
print("\n=== Number of Trees Analysis ===")
n_trees_range = [10, 25, 50, 100, 200, 300]
train_scores = []
test_scores = []

for n_trees in n_trees_range:
    rf_temp = RandomForestClassifier(n_estimators=n_trees, random_state=42)
    rf_temp.fit(X_train, y_train)
    train_scores.append(rf_temp.score(X_train, y_train))
    test_scores.append(rf_temp.score(X_test, y_test))
    print(f"Trees: {n_trees:3d}, Train: {train_scores[-1]:.4f}, Test: {test_scores[-1]:.4f}")
```

## 10.2 Gradient Boosting (XGBoost, LightGBM, CatBoost)

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
import time

# Generate data
X, y = make_classification(n_samples=5000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# XGBoost
try:
    import xgboost as xgb
    print("=== XGBoost ===")
    start = time.time()
    xgb_model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    xgb_model.fit(X_train, y_train)
    xgb_time = time.time() - start
    
    y_pred_xgb = xgb_model.predict(X_test)
    y_proba_xgb = xgb_model.predict_proba(X_test)[:, 1]
    
    print(f"Training Time: {xgb_time:.2f}s")
    print(f"Accuracy: {accuracy_score(y_test, y_pred_xgb):.4f}")
    print(f"AUC-ROC: {roc_auc_score(y_test, y_proba_xgb):.4f}")
except ImportError:
    print("XGBoost not installed")

# LightGBM
try:
    import lightgbm as lgb
    print("\n=== LightGBM ===")
    start = time.time()
    lgb_model = lgb.LGBMClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbose=-1
    )
    lgb_model.fit(X_train, y_train)
    lgb_time = time.time() - start
    
    y_pred_lgb = lgb_model.predict(X_test)
    y_proba_lgb = lgb_model.predict_proba(X_test)[:, 1]
    
    print(f"Training Time: {lgb_time:.2f}s")
    print(f"Accuracy: {accuracy_score(y_test, y_pred_lgb):.4f}")
    print(f"AUC-ROC: {roc_auc_score(y_test, y_proba_lgb):.4f}")
except ImportError:
    print("LightGBM not installed")

# CatBoost
try:
    from catboost import CatBoostClassifier
    print("\n=== CatBoost ===")
    start = time.time()
    cat_model = CatBoostClassifier(
        iterations=100,
        depth=6,
        learning_rate=0.1,
        random_seed=42,
        verbose=0
    )
    cat_model.fit(X_train, y_train)
    cat_time = time.time() - start
    
    y_pred_cat = cat_model.predict(X_test)
    y_proba_cat = cat_model.predict_proba(X_test)[:, 1]
    
    print(f"Training Time: {cat_time:.2f}s")
    print(f"Accuracy: {accuracy_score(y_test, y_pred_cat):.4f}")
    print(f"AUC-ROC: {roc_auc_score(y_test, y_proba_cat):.4f}")
except ImportError:
    print("CatBoost not installed")
```

## 10.3 Support Vector Machines (SVM)

```python
import numpy as np
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load data
X, y = load_iris(return_X_y=True)

# Use only first two features for visualization
X = X[:, :2]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train SVM with different kernels
kernels = ['linear', 'rbf', 'poly']
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

for i, kernel in enumerate(kernels):
    svm = SVC(kernel=kernel, random_state=42)
    svm.fit(X_train_scaled, y_train)
    
    y_pred = svm.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n=== SVM with {kernel} kernel ===")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Number of support vectors: {svm.n_support_}")
    
    # Plot decision boundary
    h = 0.02
    x_min, x_max = X_train_scaled[:, 0].min() - 1, X_train_scaled[:, 0].max() + 1
    y_min, y_max = X_train_scaled[:, 1].min() - 1, X_train_scaled[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
    
    Z = svm.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    
    axes[i].contourf(xx, yy, Z, alpha=0.8, cmap=plt.cm.RdYlBu)
    axes[i].scatter(X_train_scaled[:, 0], X_train_scaled[:, 1], c=y_train, 
                    cmap=plt.cm.RdYlBu, edgecolors='black')
    axes[i].set_title(f'{kernel} kernel (Acc: {accuracy:.3f})')
    axes[i].set_xlabel('Feature 1')
    axes[i].set_ylabel('Feature 2')

plt.tight_layout()
plt.show()

# Hyperparameter tuning for RBF SVM
print("\n=== Hyperparameter Tuning (RBF SVM) ===")
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.1, 1],
    'kernel': ['rbf']
}

grid_search = GridSearchCV(SVC(), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV accuracy: {grid_search.best_score_:.4f}")

y_pred_best = grid_search.predict(X_test_scaled)
print(f"Test accuracy: {accuracy_score(y_test, y_pred_best):.4f}")
```

## 10.4 Hyperparameter Tuning

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (GridSearchCV, RandomizedSearchCV,
                                    cross_val_score)
from sklearn.datasets import make_classification
from sklearn.metrics import accuracy_score
from scipy.stats import randint, uniform
import time

# Generate data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)

# Define parameter space
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 20, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

param_distributions = {
    'n_estimators': randint(50, 300),
    'max_depth': [5, 10, 20, 30, None],
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10)
}

# Grid Search
print("=== Grid Search CV ===")
start = time.time()
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)
grid_search.fit(X, y)
grid_time = time.time() - start

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.4f}")
print(f"Time taken: {grid_time:.2f}s")

# Random Search
print("\n=== Random Search CV ===")
start = time.time()
random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions,
    n_iter=50,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42,
    verbose=1
)
random_search.fit(X, y)
random_time = time.time() - start

print(f"Best parameters: {random_search.best_params_}")
print(f"Best CV score: {random_search.best_score_:.4f}")
print(f"Time taken: {random_time:.2f}s")

# Comparison
print("\n=== Comparison ===")
print(f"Grid Search: {grid_search.best_score_:.4f} ({grid_time:.2f}s)")
print(f"Random Search: {random_search.best_score_:.4f} ({random_time:.2f}s)")
print(f"Speedup: {grid_time/random_time:.2f}x faster with Random Search")

# BayesSearchCV (if scikit-optimize is available)
try:
    from skopt import BayesSearchCV
    from skopt.space import Integer, Real, Categorical
    
    print("\n=== Bayesian Optimization ===")
    bayes_space = {
        'n_estimators': Integer(50, 300),
        'max_depth': Integer(5, 30),
        'min_samples_split': Integer(2, 20),
        'min_samples_leaf': Integer(1, 10)
    }
    
    start = time.time()
    bayes_search = BayesSearchCV(
        RandomForestClassifier(random_state=42),
        bayes_space,
        n_iter=30,
        cv=5,
        scoring='accuracy',
        n_jobs=-1,
        random_state=42
    )
    bayes_search.fit(X, y)
    bayes_time = time.time() - start
    
    print(f"Best parameters: {bayes_search.best_params_}")
    print(f"Best CV score: {bayes_search.best_score_:.4f}")
    print(f"Time taken: {bayes_time:.2f}s")
except ImportError:
    print("\nBayesian optimization requires scikit-optimize: pip install scikit-optimize")
```

## 10.5 Feature Importance and Selection

```python
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import (SelectKBest, f_classif, RFE,
                                       mutual_info_classif)
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# Generate data with informative and noisy features
X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=5,
    n_redundant=5, n_classes=2, random_state=42
)

feature_names = [f'Feature_{i}' for i in range(20)]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Method 1: Tree-based feature importance
print("=== Method 1: Random Forest Feature Importance ===")
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

importances = rf.feature_importances_
indices = np.argsort(importances)[::-1]

print("\nTop 10 features:")
for i in range(10):
    print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")

# Method 2: SelectKBest with f_classif
print("\n=== Method 2: SelectKBest (ANOVA F-value) ===")
selector = SelectKBest(score_func=f_classif, k=10)
X_train_selected = selector.fit_transform(X_train, y_train)
X_test_selected = selector.transform(X_test)

selected_mask = selector.get_support()
selected_features = [f for f, s in zip(feature_names, selected_mask) if s]
print(f"Selected features: {selected_features}")

rf_selected = RandomForestClassifier(n_estimators=100, random_state=42)
rf_selected.fit(X_train_selected, y_train)
y_pred_selected = rf_selected.predict(X_test_selected)
print(f"Accuracy with selected features: {accuracy_score(y_test, y_pred_selected):.4f}")

# Method 3: Recursive Feature Elimination (RFE)
print("\n=== Method 3: Recursive Feature Elimination (RFE) ===")
rfe = RFE(estimator=rf, n_features_to_select=10, step=1)
rfe.fit(X_train, y_train)

rfe_selected = [f for f, s in zip(feature_names, rfe.support_) if s]
print(f"Selected features: {rfe_selected}")
print(f"Feature ranking: {rfe.ranking_}")

X_train_rfe = rfe.transform(X_train)
X_test_rfe = rfe.transform(X_test)

rf_rfe = RandomForestClassifier(n_estimators=100, random_state=42)
rf_rfe.fit(X_train_rfe, y_train)
y_pred_rfe = rf_rfe.predict(X_test_rfe)
print(f"Accuracy with RFE features: {accuracy_score(y_test, y_pred_rfe):.4f}")

# Method 4: Mutual Information
print("\n=== Method 4: Mutual Information ===")
mi_scores = mutual_info_classif(X_train, y_train, random_state=42)
mi_indices = np.argsort(mi_scores)[::-1]

print("\nTop 10 features by mutual information:")
for i in range(10):
    print(f"{i+1}. {feature_names[mi_indices[i]]}: {mi_scores[mi_indices[i]]:.4f}")

# Visualization
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Plot 1: Random Forest Importance
axes[0, 0].barh(range(10), importances[indices[:10]])
axes[0, 0].set_yticks(range(10))
axes[0, 0].set_yticklabels([feature_names[i] for i in indices[:10]])
axes[0, 0].set_xlabel('Importance')
axes[0, 0].set_title('Random Forest Feature Importance')

# Plot 2: F-classif scores
f_scores = selector.scores_
axes[0, 1].barh(range(10), f_scores[indices[:10]])
axes[0, 1].set_yticks(range(10))
axes[0, 1].set_yticklabels([feature_names[i] for i in indices[:10]])
axes[0, 1].set_xlabel('F-score')
axes[0, 1].set_title('ANOVA F-value Scores')

# Plot 3: RFE rankings
axes[1, 0].barh(range(20), rfe.ranking_)
axes[1, 0].set_yticks(range(20))
axes[1, 0].set_yticklabels(feature_names)
axes[1, 0].set_xlabel('Ranking (1 = selected)')
axes[1, 0].set_title('RFE Feature Rankings')

# Plot 4: Mutual Information
axes[1, 1].barh(range(10), mi_scores[mi_indices[:10]])
axes[1, 1].set_yticks(range(10))
axes[1, 1].set_yticklabels([feature_names[i] for i in mi_indices[:10]])
axes[1, 1].set_xlabel('MI Score')
axes[1, 1].set_title('Mutual Information Scores')

plt.tight_layout()
plt.show()
```

## 10.6 Ensemble Methods (Voting, Stacking, Blending)

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import (VotingClassifier, StackingClassifier,
                             RandomForestClassifier, GradientBoostingClassifier)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
import time

# Generate data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Base models
base_models = [
    ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
    ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ('svm', SVC(kernel='rbf', probability=True, random_state=42)),
    ('knn', KNeighborsClassifier(n_neighbors=5))
]

# Individual model performance
print("=== Individual Model Performance ===")
for name, model in base_models:
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    model.fit(X_train, y_train)
    test_acc = accuracy_score(y_test, model.predict(X_test))
    print(f"{name:5s}: CV={scores.mean():.4f} (+/- {scores.std()*2:.4f}), Test={test_acc:.4f}")

# Voting Classifier
print("\n=== Voting Classifier ===")
start = time.time()
voting = VotingClassifier(estimators=base_models, voting='soft', n_jobs=-1)
voting.fit(X_train, y_train)
y_pred_voting = voting.predict(X_test)
voting_time = time.time() - start

print(f"Accuracy: {accuracy_score(y_test, y_pred_voting):.4f}")
print(f"Training time: {voting_time:.2f}s")

# Stacking Classifier
print("\n=== Stacking Classifier ===")
start = time.time()
stacking = StackingClassifier(
    estimators=base_models,
    final_estimator=LogisticRegression(),
    cv=5,
    n_jobs=-1
)
stacking.fit(X_train, y_train)
y_pred_stacking = stacking.predict(X_test)
stacking_time = time.time() - start

print(f"Accuracy: {accuracy_score(y_test, y_pred_stacking):.4f}")
print(f"Training time: {stacking_time:.2f}s")

# Custom Blending (manual implementation)
print("\n=== Custom Blending ===")
from sklearn.model_selection import KFold

def blending_ensemble(models, X_train, y_train, X_test, n_folds=5):
    kf = KFold(n_splits=n_folds, shuffle=True, random_state=42)
    
    # Out-of-fold predictions for training set
    blend_train = np.zeros((X_train.shape[0], len(models)))
    
    # Predictions for test set
    blend_test = np.zeros((X_test.shape[0], len(models)))
    
    for i, (name, model) in enumerate(models):
        print(f"Training {name}...")
        blend_test_i = np.zeros((X_test.shape[0], n_folds))
        
        for j, (train_idx, val_idx) in enumerate(kf.split(X_train)):
            X_tr, X_val = X_train[train_idx], X_train[val_idx]
            y_tr, y_val = y_train[train_idx], y_train[val_idx]
            
            model.fit(X_tr, y_tr)
            blend_train[val_idx, i] = model.predict_proba(X_val)[:, 1]
            blend_test_i[:, j] = model.predict_proba(X_test)[:, 1]
        
        blend_test[:, i] = blend_test_i.mean(axis=1)
    
    return blend_train, blend_test

blend_train, blend_test = blending_ensemble(base_models, X_train, y_train, X_test)

# Train meta-learner
meta_learner = LogisticRegression()
meta_learner.fit(blend_train, y_train)
y_pred_blend = meta_learner.predict(blend_test)

print(f"Blending Accuracy: {accuracy_score(y_test, y_pred_blend):.4f}")

# Summary
print("\n=== Ensemble Methods Comparison ===")
print(f"{'Method':<20} {'Accuracy':<12} {'Training Time':<15}")
print("-" * 47)
print(f"{'Voting':<20} {accuracy_score(y_test, y_pred_voting):<12.4f} {voting_time:<15.2f}s")
print(f"{'Stacking':<20} {accuracy_score(y_test, y_pred_stacking):<12.4f} {stacking_time:<15.2f}s")
print(f"{'Blending':<20} {accuracy_score(y_test, y_pred_blend):<12.4f} {'N/A':<15}")
```

## Use Case Table: Advanced Classification

| Industry | Use Case | Algorithm | Key Benefit | Complexity |
|----------|----------|-----------|-------------|------------|
| Finance | Fraud Detection | XGBoost + Stacking | High accuracy, handles imbalance | High |
| Healthcare | Medical Imaging | Random Forest + SVM Ensemble | Robust predictions | High |
| E-commerce | Product Recommendation | Gradient Boosting + KNN | Personalization at scale | Medium |
| Cybersecurity | Intrusion Detection | Random Forest + Voting | Real-time detection | Medium |
| Manufacturing | Defect Detection | XGBoost + Feature Selection | Precision manufacturing | Medium |
| Marketing | Customer Segmentation | Ensemble Clustering | Targeted campaigns | Low |

## Project Ideas

### Project 1: Ensemble Model for Credit Default Prediction
Build a stacking ensemble combining XGBoost, Random Forest, and SVM to predict credit defaults with high precision.

### Project 2: Multi-Model Comparison with AutoML Pipeline
Create an automated comparison of 10+ models with hyperparameter tuning and feature selection.

### Project 3: Real-Time Fraud Detection System
Develop a streaming fraud detection system using gradient boosting with online learning capabilities.

---

# Module 11: Unsupervised Learning and Clustering Techniques

## 11.1 K-Means Clustering

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs, make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, adjusted_rand_score

# Generate sample data
np.random.seed(42)
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=42)

# Apply K-Means
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
kmeans.fit(X)
y_kmeans = kmeans.labels_
centers = kmeans.cluster_centers_

print("=== K-Means Clustering Results ===")
print(f"Number of clusters: {len(np.unique(y_kmeans))}")
print(f"Cluster sizes: {[np.sum(y_kmeans == i) for i in range(4)]}")
print(f"Inertia (within-cluster sum of squares): {kmeans.inertia_:.2f}")
print(f"Silhouette Score: {silhouette_score(X, y_kmeans):.4f}")
print(f"Adjusted Rand Index: {adjusted_rand_score(y_true, y_kmeans):.4f}")

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Plot 1: Cluster assignments
scatter = axes[0].scatter(X[:, 0], X[:, 1], c=y_kmeans, cmap='viridis', alpha=0.6, s=50)
axes[0].scatter(centers[:, 0], centers[:, 1], c='red', marker='X', s=200, label='Centroids')
axes[0].set_xlabel('Feature 1')
axes[0].set_ylabel('Feature 2')
axes[0].set_title('K-Means Clustering Results')
axes[0].legend()
plt.colorbar(scatter, ax=axes[0])

# Plot 2: Elbow Method
inertias = []
K_range = range(1, 11)
for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

axes[1].plot(K_range, inertias, 'bo-', linewidth=2, markersize=8)
axes[1].set_xlabel('Number of Clusters (k)')
axes[1].set_ylabel('Inertia')
axes[1].set_title('Elbow Method for Optimal k')
axes[1].axvline(x=4, color='r', linestyle='--', label='Optimal k=4')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# K-Means limitations
print("\n=== K-Means Limitations ===")
print("1. Assumes spherical clusters of similar size")
print("2. Sensitive to initialization (use n_init > 1)")
print("3. Requires specifying k beforehand")
print("4. Sensitive to outliers")

# Example: K-Means failure case
X_moons, y_moons = make_moons(n_samples=300, noise=0.1, random_state=42)
kmeans_moons = KMeans(n_clusters=2, random_state=42, n_init=10)
y_moons_kmeans = kmeans_moons.fit_predict(X_moons)

plt.figure(figsize=(8, 5))
plt.scatter(X_moons[:, 0], X_moons[:, 1], c=y_moons_kmeans, cmap='viridis', alpha=0.6)
plt.title('K-Means on Non-Spherical Data (Failure Case)')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.show()
```

## 11.2 Hierarchical Clustering

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from sklearn.metrics import silhouette_score

# Generate data
np.random.seed(42)
X, y_true = make_blobs(n_samples=100, centers=3, cluster_std=0.8, random_state=42)

# Hierarchical Clustering with different linkages
linkages = ['ward', 'complete', 'average', 'single']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
axes = axes.ravel()

for i, link in enumerate(linkages):
    if link == 'ward':
        agg = AgglomerativeClustering(n_clusters=3, linkage=link)
    else:
        agg = AgglomerativeClustering(n_clusters=3, linkage=link)
    
    y_agg = agg.fit_predict(X)
    sil_score = silhouette_score(X, y_agg)
    
    axes[i].scatter(X[:, 0], X[:, 1], c=y_agg, cmap='viridis', alpha=0.6)
    axes[i].set_title(f'{link.capitalize()} Linkage\nSilhouette: {sil_score:.3f}')
    axes[i].set_xlabel('Feature 1')
    axes[i].set_ylabel('Feature 2')

plt.tight_layout()
plt.show()

# Dendrogram
print("=== Dendrogram Analysis ===")
Z = linkage(X, method='ward')

plt.figure(figsize=(12, 6))
dendrogram(Z, truncate_mode='lastp', p=30, leaf_rotation=90, leaf_font_size=10)
plt.title('Hierarchical Clustering Dendrogram (Ward Linkage)')
plt.xlabel('Sample Index or Cluster Size')
plt.ylabel('Distance')
plt.axhline(y=7, color='r', linestyle='--', label='Cut threshold')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Different numbers of clusters
print("\n=== Different Numbers of Clusters ===")
for n_clusters in [2, 3, 4, 5]:
    agg = AgglomerativeClustering(n_clusters=n_clusters)
    y_agg = agg.fit_predict(X)
    sil = silhouette_score(X, y_agg)
    print(f"Clusters: {n_clusters}, Silhouette Score: {sil:.4f}")

# Comparison with K-Means
from sklearn.cluster import KMeans

print("\n=== Hierarchical vs K-Means ===")
agg_final = AgglomerativeClustering(n_clusters=3)
y_agg = agg_final.fit_predict(X)

km = KMeans(n_clusters=3, random_state=42, n_init=10)
y_km = km.fit_predict(X)

print(f"Hierarchical Silhouette: {silhouette_score(X, y_agg):.4f}")
print(f"K-Means Silhouette: {silhouette_score(X, y_km):.4f}")
```

## 11.3 DBSCAN

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons, make_circles
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# Generate different data shapes
np.random.seed(42)

# Moons data
X_moons, y_moons = make_moons(n_samples=300, noise=0.1, random_state=42)

# Circles data
X_circles, y_circles = make_circles(n_samples=300, noise=0.05, factor=0.5, random_state=42)

# Apply DBSCAN
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Row 1: Moons
for i, (eps, min_samples) in enumerate([(0.2, 5), (0.3, 5), (0.5, 5)]):
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    y_dbscan = dbscan.fit_predict(X_moons)
    
    n_clusters = len(set(y_dbscan)) - (1 if -1 in y_dbscan else 0)
    n_noise = list(y_dbscan).count(-1)
    
    axes[0, i].scatter(X_moons[:, 0], X_moons[:, 1], c=y_dbscan, cmap='viridis', alpha=0.6)
    axes[0, i].set_title(f'Moons - eps={eps}, min_samples={min_samples}\n'
                         f'Clusters: {n_clusters}, Noise: {n_noise}')
    axes[0, i].set_xlabel('Feature 1')
    axes[0, i].set_ylabel('Feature 2')

# Row 2: Circles
for i, (eps, min_samples) in enumerate([(0.1, 5), (0.2, 5), (0.3, 5)]):
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    y_dbscan = dbscan.fit_predict(X_circles)
    
    n_clusters = len(set(y_dbscan)) - (1 if -1 in y_dbscan else 0)
    n_noise = list(y_dbscan).count(-1)
    
    axes[1, i].scatter(X_circles[:, 0], X_circles[:, 1], c=y_dbscan, cmap='viridis', alpha=0.6)
    axes[1, i].set_title(f'Circles - eps={eps}, min_samples={min_samples}\n'
                         f'Clusters: {n_clusters}, Noise: {n_noise}')
    axes[1, i].set_xlabel('Feature 1')
    axes[1, i].set_ylabel('Feature 2')

plt.tight_layout()
plt.show()

# DBSCAN for outlier detection
print("=== DBSCAN for Outlier Detection ===")
np.random.seed(42)
X_normal = np.random.randn(200, 2) * 0.5 + np.array([2, 2])
X_outliers = np.random.uniform(-2, 6, (20, 2))
X_combined = np.vstack([X_normal, X_outliers])

dbscan = DBSCAN(eps=0.3, min_samples=5)
labels = dbscan.fit_predict(X_combined)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_outliers = list(labels).count(-1)

print(f"Number of clusters: {n_clusters}")
print(f"Number of outliers detected: {n_outliers}")

plt.figure(figsize=(8, 6))
plt.scatter(X_combined[:, 0], X_combined[:, 1], c=labels, cmap='viridis', alpha=0.6)
plt.scatter(X_outliers[:, 0], X_outliers[:, 1], c='red', marker='x', s=100, label='Outliers')
plt.title(f'DBSCAN Outlier Detection\nClusters: {n_clusters}, Outliers: {n_outliers}')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

## 11.4 Principal Component Analysis (PCA)

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_digits
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Load digits dataset
digits = load_digits()
X, y = digits.data, digits.target

print(f"Original data shape: {X.shape}")
print(f"Number of classes: {len(np.unique(y))}")

# Apply PCA
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Full PCA
pca_full = PCA()
X_pca_full = pca_full.fit_transform(X_scaled)

# Explained variance
cumulative_var = np.cumsum(pca_full.explained_variance_ratio_)

print("\n=== PCA Analysis ===")
print(f"Variance explained by first 10 components: {cumulative_var[10]:.4f}")
print(f"Variance explained by first 50 components: {cumulative_var[50]:.4f}")

# Find number of components for 95% variance
n_components_95 = np.argmax(cumulative_var >= 0.95) + 1
print(f"Components needed for 95% variance: {n_components_95}")

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Plot 1: Explained variance
axes[0].plot(range(1, len(cumulative_var) + 1), cumulative_var, 'b-', linewidth=2)
axes[0].axhline(y=0.95, color='r', linestyle='--', label='95% variance')
axes[0].axvline(x=n_components_95, color='g', linestyle='--', 
                label=f'{n_components_95} components')
axes[0].set_xlabel('Number of Components')
axes[0].set_ylabel('Cumulative Explained Variance')
axes[0].set_title('PCA - Explained Variance')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Plot 2: 2D projection
pca_2d = PCA(n_components=2)
X_2d = pca_2d.fit_transform(X_scaled)

scatter = axes[1].scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
axes[1].set_xlabel(f'PC1 ({pca_2d.explained_variance_ratio_[0]*100:.1f}%)')
axes[1].set_ylabel(f'PC2 ({pca_2d.explained_variance_ratio_[1]*100:.1f}%)')
axes[1].set_title('2D PCA Projection')
plt.colorbar(scatter, ax=axes[1])

plt.tight_layout()
plt.show()

# PCA for dimensionality reduction before clustering
print("\n=== PCA for Clustering ===")
pca_optimal = PCA(n_components=n_components_95)
X_reduced = pca_optimal.fit_transform(X_scaled)

kmeans = KMeans(n_clusters=10, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_reduced)

sil_score = silhouette_score(X_reduced, labels)
print(f"Silhouette Score with PCA: {sil_score:.4f}")

# Without PCA
kmeans_full = KMeans(n_clusters=10, random_state=42, n_init=10)
labels_full = kmeans_full.fit_predict(X_scaled)
sil_score_full = silhouette_score(X_scaled, labels_full)
print(f"Silhouette Score without PCA: {sil_score_full:.4f}")
print(f"Features reduced from {X_scaled.shape[1]} to {n_components_95}")
```

## 11.5 t-SNE and UMAP for Visualization

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import TSNE

# Load data
digits = load_digits()
X, y = digits.data, digits.target

# Standardize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# t-SNE with different perplexity values
perplexities = [5, 30, 50]

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

for i, perplexity in enumerate(perplexities):
    tsne = TSNE(n_components=2, perplexity=perplexity, random_state=42, n_iter=1000)
    X_tsne = tsne.fit_transform(X_scaled)
    
    scatter = axes[i].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
    axes[i].set_title(f't-SNE (perplexity={perplexity})')
    axes[i].set_xlabel('t-SNE 1')
    axes[i].set_ylabel('t-SNE 2')

plt.tight_layout()
plt.show()

# Compare t-SNE vs PCA
print("=== t-SNE vs PCA Comparison ===")

from sklearn.decomposition import PCA

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# t-SNE
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
axes[0].set_title('PCA Projection')
axes[0].set_xlabel('PC1')
axes[0].set_ylabel('PC2')

axes[1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
axes[1].set_title('t-SNE Projection')
axes[1].set_xlabel('t-SNE 1')
axes[1].set_ylabel('t-SNE 2')

plt.tight_layout()
plt.show()

# UMAP (if installed)
try:
    import umap
    
    print("\n=== UMAP Projection ===")
    reducer = umap.UMAP(n_components=2, random_state=42)
    X_umap = reducer.fit_transform(X_scaled)
    
    plt.figure(figsize=(8, 6))
    plt.scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
    plt.title('UMAP Projection')
    plt.xlabel('UMAP 1')
    plt.ylabel('UMAP 2')
    plt.colorbar(label='Digit')
    plt.tight_layout()
    plt.show()
    
    print("UMAP preserves more global structure than t-SNE")
    print("UMAP is faster and scales better to larger datasets")
except ImportError:
    print("\nUMAP not installed. Install with: pip install umap-learn")
```

## 11.6 Cluster Evaluation (Silhouette, Elbow Method)

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, silhouette_samples, calinski_harabasz_score
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler

# Generate data
np.random.seed(42)
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

# 1. Elbow Method
print("=== Elbow Method ===")
inertias = []
sil_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)
    sil_scores.append(silhouette_score(X, kmeans.labels_))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].plot(K_range, inertias, 'bo-', linewidth=2, markersize=8)
axes[0].set_xlabel('Number of Clusters (k)')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')
axes[0].grid(True, alpha=0.3)

# Find elbow using kneed
from scipy.signal import argrelextrema
inertias_array = np.array(inertias)
diff = np.diff(inertias_array)
diff2 = np.diff(diff)
elbow_idx = np.argmax(diff2) + 2
axes[0].axvline(x=elbow_idx, color='r', linestyle='--', 
                label=f'Elbow at k={elbow_idx}')
axes[0].legend()

axes[1].plot(K_range, sil_scores, 'go-', linewidth=2, markersize=8)
axes[1].set_xlabel('Number of Clusters (k)')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Method')
axes[1].grid(True, alpha=0.3)

best_k = K_range[np.argmax(sil_scores)]
axes[1].axvline(x=best_k, color='r', linestyle='--', 
                label=f'Best k={best_k}')
axes[1].legend()

plt.tight_layout()
plt.show()

print(f"Elbow method suggests: k={elbow_idx}")
print(f"Silhouette method suggests: k={best_k}")

# 2. Silhouette Analysis
print("\n=== Silhouette Analysis ===")
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.ravel()

for idx, k in enumerate([3, 4, 5, 6]):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X)
    
    silhouette_avg = silhouette_score(X, labels)
    sample_silhouette_values = silhouette_samples(X, labels)
    
    y_lower = 10
    
    for i in range(k):
        ith_cluster_values = sample_silhouette_values[labels == i]
        ith_cluster_values.sort()
        
        size_cluster_i = ith_cluster_values.shape[0]
        y_upper = y_lower + size_cluster_i
        
        color = plt.cm.nipy_spectral(float(i) / k)
        axes[idx].fill_betweenx(np.arange(y_lower, y_upper),
                               0, ith_cluster_values,
                               facecolor=color, edgecolor=color, alpha=0.7)
        axes[idx].text(-0.05, y_lower + 0.5 * size_cluster_i, str(i))
        
        y_lower = y_upper + 10
    
    axes[idx].axvline(x=silhouette_avg, color="red", linestyle="--",
                     label=f'Avg: {silhouette_avg:.3f}')
    axes[idx].set_title(f'k={k} clusters')
    axes[idx].set_xlabel('Silhouette Coefficient')
    axes[idx].set_ylabel('Cluster')
    axes[idx].legend()

plt.tight_layout()
plt.show()

# 3. Calinski-Harabasz Index
print("\n=== Calinski-Harabasz Index ===")
for k in range(2, 11):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X)
    ch_score = calinski_harabasz_score(X, labels)
    print(f"k={k}: CH Index = {ch_score:.2f}")

best_ch_k = list(range(2, 11))[np.argmax([calinski_harabasz_score(X, KMeans(n_clusters=k, random_state=42, n_init=10).fit_predict(X)) for k in range(2, 11)])]
print(f"\nBest k by Calinski-Harabasz: {best_ch_k}")
```

## Use Case Table: Unsupervised Learning

| Industry | Use Case | Algorithm | Key Metric | Application |
|----------|----------|-----------|------------|-------------|
| Marketing | Customer Segmentation | K-Means | Silhouette Score | Targeted campaigns |
| Healthcare | Patient Stratification | Hierarchical | Dendrogram analysis | Treatment planning |
| Finance | Anomaly Detection | DBSCAN | Outlier count | Fraud detection |
| Image Processing | Image Compression | K-Means | Reconstruction error | Storage optimization |
| Genomics | Gene Expression Analysis | Hierarchical | Correlation distance | Drug discovery |
| Retail | Market Basket Analysis | DBSCAN | Cluster density | Product placement |

## Project Ideas

### Project 1: Customer Segmentation for E-commerce
Apply K-Means and DBSCAN to segment customers based on purchasing behavior and create targeted marketing strategies.

### Project 2: Image Clustering and Topic Discovery
Use hierarchical clustering and t-SNE to explore image datasets and discover visual patterns.

### Project 3: Anomaly Detection in Network Traffic
Implement DBSCAN and Isolation Forest to detect unusual network patterns for cybersecurity monitoring.

---

# Module 12: AutoML and No-Code Data Science Solutions

## 12.1 What is AutoML?

Automated Machine Learning (AutoML) automates the end-to-end process of applying machine learning to real-world problems.

```python
# AutoML Pipeline Overview
import time
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Traditional ML approach (manual)
print("=== Traditional ML Approach ===")
start = time.time()

# Manual preprocessing
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Manual model selection and training
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)
y_pred = model.predict(X_test_scaled)

traditional_time = time.time() - start
print(f"Time taken: {traditional_time:.2f}s")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")

# AutoML concept demonstration
print("\n=== AutoML Concept ===")
auto_ml_steps = [
    "1. Data Preprocessing",
    "   - Handle missing values",
    "   - Encode categorical features",
    "   - Feature scaling",
    "",
    "2. Feature Engineering",
    "   - Feature selection",
    "   - Feature extraction",
    "   - Feature transformation",
    "",
    "3. Model Selection",
    "   - Try multiple algorithms",
    "   - Compare performance",
    "   - Select best model",
    "",
    "4. Hyperparameter Tuning",
    "   - Grid/Random/Bayesian search",
    "   - Cross-validation",
    "",
    "5. Ensemble Methods",
    "   - Model stacking",
    "   - Model averaging",
    "",
    "6. Evaluation and Deployment",
    "   - Final evaluation",
    "   - Model export",
    "   - API creation"
]

for step in auto_ml_steps:
    print(step)

# Simple AutoML-like pipeline
print("\n=== Simple AutoML-like Pipeline ===")

models = {
    'Logistic Regression': Pipeline([
        ('scaler', StandardScaler()),
        ('model', LogisticRegression(random_state=42))
    ]),
    'Random Forest': Pipeline([
        ('scaler', StandardScaler()),
        ('model', RandomForestClassifier(n_estimators=100, random_state=42))
    ]),
    'SVM': Pipeline([
        ('scaler', StandardScaler()),
        ('model', SVC(random_state=42))
    ])
}

results = {}
for name, pipeline in models.items():
    start = time.time()
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    train_time = time.time() - start
    results[name] = {'accuracy': accuracy, 'time': train_time}
    print(f"{name}: Accuracy={accuracy:.4f}, Time={train_time:.2f}s")

best_model = max(results.items(), key=lambda x: x[1]['accuracy'])
print(f"\nBest Model: {best_model[0]} (Accuracy: {best_model[1]['accuracy']:.4f})")
```

## 12.2 Auto-sklearn and FLAML

```python
# Auto-sklearn and FLAML demonstration
# Note: These require installation: pip install auto-sklearn flaml

# Auto-sklearn example
try:
    import autosklearn.classification
    from sklearn.datasets import make_classification
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score
    
    # Generate data
    X, y = make_classification(n_samples=500, n_features=20, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("=== Auto-sklearn ===")
    print("Automated machine learning toolkit")
    print("Features:")
    print("- Automatic algorithm selection")
    print("- Hyperparameter optimization")
    print("- Ensemble construction")
    print("- Feature preprocessing")
    
    # Example configuration (commented out as it requires installation)
    # automl = autosklearn.classification.AutoSklearnClassifier(
    #     time_left_for_this_task=120,  # 2 minutes
    #     per_run_time_limit=30,
    #     n_jobs=-1
    # )
    # automl.fit(X_train, y_train)
    # predictions = automl.predict(X_test)
    # print(f"Accuracy: {accuracy_score(y_test, predictions):.4f}")
    
except ImportError:
    print("Auto-sklearn not installed. Install with: pip install auto-sklearn")

# FLAML example
try:
    from flaml import AutoML
    
    print("\n=== FLAML (Fast and Lightweight AutoML) ===")
    print("Features:")
    print("- Fast tuning with limited resources")
    print("- Low-cost hyperparameter optimization")
    print("- Supports classification and regression")
    
    # Example configuration (commented out as it requires installation)
    # automl = AutoML()
    # settings = {
    #     "time_budget": 60,  # 60 seconds
    #     "metric": 'accuracy',
    #     "task": 'classification',
    #     "log_file_name": 'flaml.log',
    # }
    # automl.fit(X_train, y_train, **settings)
    # predictions = automl.predict(X_test)
    # print(f"Accuracy: {accuracy_score(y_test, predictions):.4f}")
    
except ImportError:
    print("FLAML not installed. Install with: pip install flaml")

# Comparison
print("\n=== AutoML Framework Comparison ===")
comparison = {
    'Framework': ['Auto-sklearn', 'FLAML', 'TPOT', 'H2O AutoML'],
    'Strengths': ['Strong sklearn integration', 'Fast, lightweight', 
                  'Genetic programming', 'Scalable, enterprise'],
    'Weaknesses': ['Longer runtime', 'Limited to certain models',
                   'Complex setup', 'Resource intensive'],
    'Best For': ['Research, competitions', 'Quick prototyping',
                 'Algorithm discovery', 'Production systems']
}

import pandas as pd
df_comparison = pd.DataFrame(comparison)
print(df_comparison.to_string(index=False))
```

## 12.3 H2O AutoML

```python
# H2O AutoML demonstration
# Note: Requires installation: pip install h2o

# H2O AutoML example
try:
    import h2o
    from h2o.automl import H2OAutoML
    
    print("=== H2O AutoML ===")
    print("Enterprise-grade AutoML platform")
    print("Features:")
    print("- Distributed computing")
    print("- Automatic feature engineering")
    print("- Model interpretability")
    print("- Production-ready models")
    
    # Initialize H2O
    # h2o.init()
    
    # Example workflow (commented out as it requires installation)
    # # Import data
    # data = h2o.import_file("https://s3.amazonaws.com/erin-data/higgs/higgs.train.csv")
    # 
    # # Split data
    # train, test = data.split_frame(ratios=[0.8])
    # 
    # # Identify features and target
    # x = train.columns
    # y = "response"
    # x.remove(y)
    # 
    # # Run AutoML
    # aml = H2OAutoML(
    #     max_models=10,
    #     seed=42,
    #     max_runtime_secs=300  # 5 minutes
    # )
    # aml.train(x=x, y=y, training_frame=train)
    # 
    # # Get leaderboard
    # lb = aml.leaderboard
    # print(lb.head())
    # 
    # # Get best model
    # best_model = aml.leader
    # predictions = best_model.predict(test)
    
except ImportError:
    print("H2O not installed. Install with: pip install h2o")

# H2O AutoML concepts
print("\n=== H2O AutoML Key Concepts ===")
h2o_features = {
    'Feature': ['Distributed Computing', 'Automatic Feature Engineering',
                'Model Stacking', 'Leaderboard', 'Model Export'],
    'Description': [
        'Runs on multiple cores/nodes for speed',
        'Creates interaction features automatically',
        'Combines top models for better performance',
        'Ranks models by performance metrics',
        'Export to POJO/MOJO for production'
    ],
    'Benefit': [
        'Handles large datasets efficiently',
        'Discovers complex patterns',
        'Improved generalization',
        'Easy model selection',
        'Production deployment'
    ]
}

import pandas as pd
df_h2o = pd.DataFrame(h2o_features)
print(df_h2o.to_string(index=False))
```

## 12.4 Google AutoML and Azure ML

```python
# Cloud AutoML Services Overview
# Note: These require cloud accounts and specific SDKs

print("=== Cloud AutoML Services ===\n")

# Google Cloud AutoML
print("1. Google Cloud AutoML")
print("-" * 40)
google_automl = {
    'Service': ['AutoML Vision', 'AutoML Natural Language', 
                'AutoML Tables', 'AutoML Video'],
    'Use_Case': ['Image classification', 'Text classification',
                 'Tabular prediction', 'Video analysis'],
    'Key_Feature': ['Transfer learning', 'Custom models',
                    'Automatic feature engineering', 'Video classification']
}
df_google = pd.DataFrame(google_automl)
print(df_google.to_string(index=False))

# Example Google AutoML code concept
print("\nGoogle AutoML Vision Example (conceptual):")
google_code = '''
from google.cloud import automl_v1beta1 as automl

# Initialize client
client = automl.AutoMlClient()
project_id = "your-project-id"
compute_region = "us-central1"

# Create dataset
dataset = client.create_dataset(project_id, compute_region, "my_dataset")

# Import data
client.import_data(project_id, compute_region, dataset.dataset_id, 
                   input_config={"gcs_source": {"input_uris": ["gs://bucket/data.csv"]}})

# Train model
response = client.create_model(project_id, compute_region, 
                               dataset.dataset_id, "my_model")
'''
print(google_code)

print("\n" + "="*60 + "\n")

# Azure Machine Learning
print("2. Azure Machine Learning")
print("-" * 40)
azure_automl = {
    'Service': ['AutoML', 'Designer', 'Notebooks', 'Pipelines'],
    'Use_Case': ['Automated ML experiments', 'Drag-and-drop ML',
                 'Code-first development', 'ML workflow automation'],
    'Key_Feature': ['Auto feature engineering', 'Visual interface',
                    'Jupyter integration', 'CI/CD for ML']
}
df_azure = pd.DataFrame(azure_automl)
print(df_azure.to_string(index=False))

# Example Azure AutoML code concept
print("\nAzure AutoML Example (conceptual):")
azure_code = '''
from azureml.core import Workspace
from azureml.train.automl import AutoMLConfig

# Connect to workspace
ws = Workspace.from_config()

# Configure AutoML
automl_config = AutoMLConfig(
    task="classification",
    primary_metric="accuracy",
    training_data=train_data,
    label_column_name="target",
    n_cross_validations=5,
    iterations=20,
    max_concurrent_iterations=4
)

# Run experiment
from azureml.core.experiment import Experiment
experiment = Experiment(ws, "automl-classification")
run = experiment.submit(automl_config)

# Get best model
best_run, fitted_model = run.get_output()
'''
print(azure_code)
```

## 12.5 No-Code Platforms (DataRobot, Obviously AI)

```python
# No-Code ML Platforms Overview
print("=== No-Code ML Platforms ===\n")

# DataRobot
print("1. DataRobot")
print("-" * 40)
datarobot = {
    'Feature': ['AutoML Pipeline', 'Feature Engineering',
                'Model Deployment', 'Monitoring', 'Explainability'],
    'Description': [
        'Automated algorithm selection and tuning',
        'Automatic feature creation and selection',
        'One-click deployment to various targets',
        'Real-time model performance tracking',
        'SHAP values and feature importance'
    ],
    'Best_For': [
        'Enterprise-scale ML projects',
        'Rapid prototyping',
        'Production deployments',
        'Model governance',
        'Regulated industries'
    ]
}
df_datarobot = pd.DataFrame(datarobot)
print(df_datarobot.to_string(index=False))

print("\nDataRobot Workflow:")
print("1. Upload data (CSV, database, or API)")
print("2. Select target variable")
print("3. Choose prediction type (classification/regression)")
print("4. Run AutoML (10-100+ models compared)")
print("5. Review leaderboard and select best model")
print("6. Deploy with one click")
print("7. Monitor and retrain as needed")

print("\n" + "="*60 + "\n")

# Obviously AI
print("2. Obviously AI")
print("-" * 40)
obviously_ai = {
    'Feature': ['No-Code Interface', 'Instant Predictions',
                'API Generation', 'Integrations', 'Accuracy Reports'],
    'Description': [
        'Point-and-click model building',
        'Real-time predictions via web interface',
        'Automatic REST API creation',
        'Connect to 300+ tools (Zapier, etc.)',
        'Detailed model performance metrics'
    ],
    'Best_For': [
        'Non-technical users',
        'Quick business predictions',
        'Small to medium datasets',
        'Rapid deployment',
        'Business analysts'
    ]
}
df_obviously = pd.DataFrame(obviously_ai)
print(df_obviously.to_string(index=False))

print("\nObviously AI Workflow:")
print("1. Connect data source (CSV, Google Sheets, API)")
print("2. Select what to predict")
print("3. Choose prediction type")
print("4. AI builds model automatically")
print("5. Get predictions instantly")
print("6. Integrate with your apps via API")

# Comparison
print("\n=== No-Code Platform Comparison ===")
comparison = {
    'Aspect': ['Learning Curve', 'Customization', 'Scalability',
               'Cost', 'Best Use Case'],
    'DataRobot': ['Low-Medium', 'High', 'Enterprise',
                  'Enterprise pricing', 'Large-scale production ML'],
    'Obviously AI': ['Very Low', 'Medium', 'SMB',
                     'Freemium model', 'Quick predictions for business']
}
df_comparison = pd.DataFrame(comparison)
print(df_comparison.to_string(index=False))
```

## 12.6 When to Use AutoML vs Custom Models

```python
# Decision Framework: AutoML vs Custom Models
print("=== When to Use AutoML vs Custom Models ===\n")

# Decision matrix
decision_matrix = {
    'Scenario': [
        'Quick prototyping',
        'Production system',
        'Large dataset (100GB+)',
        'Small dataset (<1000 rows)',
        'Complex feature interactions',
        'Interpretability required',
        'Real-time predictions',
        'Research/experimentation',
        'Limited ML expertise',
        'High-stakes decisions'
    ],
    'Recommendation': [
        'AutoML',
        'Custom (with AutoML baseline)',
        'AutoML (distributed)',
        'Custom (avoid overfitting)',
        'AutoML (feature engineering)',
        'Custom (with explainability)',
        'Custom (optimized inference)',
        'AutoML (quick comparison)',
        'AutoML',
        'Custom (with extensive validation)'
    ],
    'Reasoning': [
        'Fast baseline, iterate later',
        'Need full control and optimization',
        'AutoML handles distribution',
        'Manual feature engineering better',
        'AutoML explores combinations',
        'Custom models more interpretable',
        'Need optimized inference pipeline',
        'Compare many algorithms quickly',
        'Reduces learning curve',
        'Need rigorous testing and validation'
    ]
}

import pandas as pd
df_decision = pd.DataFrame(decision_matrix)
print(df_decision.to_string(index=False))

# Implementation guide
print("\n=== Implementation Strategy ===\n")

print("HYBRID APPROACH (Recommended):")
print("-" * 40)
print("1. Start with AutoML")
print("   - Get baseline performance")
print("   - Identify promising algorithms")
print("   - Discover important features")
print()
print("2. Analyze AutoML Results")
print("   - Which algorithms performed best?")
print("   - What features are important?")
print("   - What's the performance ceiling?")
print()
print("3. Build Custom Model")
print("   - Use insights from AutoML")
print("   - Implement best-performing architecture")
print("   - Add domain-specific features")
print("   - Optimize for deployment")
print()
print("4. Compare and Deploy")
print("   - Compare AutoML vs Custom model")
print("   - Choose based on requirements")
print("   - Deploy with monitoring")

# Code example: Hybrid approach
print("\n=== Hybrid Approach Example ===")
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import time

# Generate data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 1: AutoML-like comparison
print("\nStep 1: Quick model comparison (AutoML-like)")
models = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
}

results = {}
for name, model in models.items():
    start = time.time()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    train_time = time.time() - start
    results[name] = {'accuracy': accuracy, 'time': train_time}
    print(f"{name}: Accuracy={accuracy:.4f}, Time={train_time:.3f}s")

best_algorithm = max(results.items(), key=lambda x: x[1]['accuracy'])
print(f"\nBest algorithm: {best_algorithm[0]}")

# Step 2: Custom optimization
print("\nStep 2: Custom optimization of best algorithm")
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [5, 10, None],
    'min_samples_split': [2, 5]
}

custom_model = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid, cv=5, scoring='accuracy', n_jobs=-1
)
custom_model.fit(X_train, y_train)

y_pred_custom = custom_model.predict(X_test)
custom_accuracy = accuracy_score(y_test, y_pred_custom)

print(f"AutoML baseline: {best_algorithm[1]['accuracy']:.4f}")
print(f"Custom optimized: {custom_accuracy:.4f}")
print(f"Improvement: {(custom_accuracy - best_algorithm[1]['accuracy'])*100:.2f}%")
```

## Use Case Table: AutoML

| Scenario | AutoML | Custom Model | Recommended Approach |
|----------|--------|--------------|---------------------|
| Startup MVP | Fast, cheap | Slow, expensive | AutoML first |
| Enterprise Production | Good baseline | Full control | Hybrid |
| Research Paper | Quick comparison | Novel algorithms | Custom |
| Kaggle Competition | Good starting point | Fine-tuned | Hybrid |
| Internal Tool | Quick deployment | Maintenance burden | AutoML |
| High-Stakes (Healthcare) | Risk of errors | Rigorous validation | Custom |

## Project Ideas

### Project 1: AutoML Comparison Study
Compare Auto-sklearn, FLAML, and H2O AutoML on multiple datasets, analyzing performance, speed, and resource usage.

### Project 2: No-Code to Production Pipeline
Build an end-to-end ML solution using a no-code platform, then deploy the model via API to a web application.

### Project 3: Hybrid AutoML-Custom System
Develop a system that uses AutoML for initial exploration, then builds a custom optimized model for production deployment.

---

# Course Summary

## Key Takeaways

### Module 7: ML Fundamentals
- Understanding supervised, unsupervised, and reinforcement learning
- Building complete ML pipelines
- Proper train/test splitting and cross-validation
- Handling bias-variance tradeoff

### Module 8: Regression Analysis
- Linear, polynomial, and regularized regression
- Interpreting regression models
- Handling violations of regression assumptions

### Module 9: Classification Fundamentals
- Logistic regression, KNN, decision trees, Naive Bayes
- Confusion matrices and classification metrics
- ROC curves and threshold optimization

### Module 10: Advanced Classification
- Ensemble methods: Random Forest, Gradient Boosting
- SVMs and kernel methods
- Hyperparameter tuning strategies
- Feature importance and selection

### Module 11: Unsupervised Learning
- Clustering: K-Means, Hierarchical, DBSCAN
- Dimensionality reduction: PCA, t-SNE, UMAP
- Cluster evaluation metrics

### Module 12: AutoML
- Automated ML pipelines
- Cloud AutoML services
- No-code platforms
- When to use AutoML vs custom models

## Next Steps

1. **Practice**: Complete all project ideas
2. **Competition**: Join Kaggle competitions
3. **Portfolio**: Build GitHub repository with projects
4. **Specialization**: Choose domain to deep-dive
5. **Deployment**: Learn model serving (Flask, FastAPI)

---

*This course is part of the Edureka Generative AI Masters Program. Complete all modules for certification.*



---


# COURSE 2: DATA VISUALIZATION WITH PYTHON

## Course Overview
Master the art of data visualization using Python's powerful ecosystem of libraries. From interactive plotly charts to production dashboards with Dash/Streamlit, statistical visualization with Seaborn, and geospatial mapping â€” this course transforms raw data into compelling visual narratives.

**Prerequisites:** Course 1 (Data Science with Python), Python fundamentals, basic pandas/numpy
**Duration:** 8 weeks (40 hours)
**Tools:** Plotly, Dash, Streamlit, Seaborn, Matplotlib, Folium, NetworkX, Plotly Express

---

# MODULE 13: INTERACTIVE VISUALIZATION WITH PLOTLY

## 13.1 Plotly Express Basics

### Introduction to Plotly Express
Plotly Express is a high-level interface to Plotly.js that makes creating interactive visualizations simple and intuitive.

```python
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Basic line chart with Plotly Express
df = pd.DataFrame({
    'Month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'Revenue': [45000, 52000, 48000, 61000, 55000, 67000,
                72000, 69000, 74000, 81000, 78000, 92000],
    'Expenses': [38000, 41000, 39000, 44000, 42000, 48000,
                 51000, 49000, 53000, 56000, 54000, 62000]
})

fig = px.line(df, x='Month', y=['Revenue', 'Expenses'],
              title='Monthly Revenue vs Expenses',
              labels={'value': 'Amount ($)', 'Month': 'Fiscal Month'},
              markers=True)
fig.update_layout(hovermode='x unified')
fig.show()
```

```python
# Bar chart with color encoding
sales_data = pd.DataFrame({
    'Product': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],
    'Quarter': ['Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2', 'Q3', 'Q3', 'Q3'],
    'Sales': [250, 320, 180, 290, 350, 210, 310, 380, 240],
    'Region': ['North', 'North', 'North', 'North', 'North', 'North',
               'North', 'North', 'North']
})

fig = px.bar(sales_data, x='Quarter', y='Sales', color='Product',
             barmode='group', title='Quarterly Product Sales',
             text='Sales', color_discrete_sequence=px.colors.qualitative.Set2)
fig.update_traces(texttemplate='%{text}', textposition='outside')
fig.update_layout(uniformtext_minsize=8, uniformtext_mode='hide')
fig.show()
```

```python
# Pie chart and donut chart
fig = px.pie(df, values='Revenue', names='Month',
             title='Revenue Distribution by Month',
             hole=0.4,
             color_discrete_sequence=px.colors.sequential.RdBu)
fig.update_traces(textposition='inside', textinfo='percent+label')
fig.show()
```

```python
# Area chart with grouping
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=365, freq='D')
area_df = pd.DataFrame({
    'Date': dates,
    'Web Traffic': np.cumsum(np.random.normal(500, 100, 365)) + 10000,
    'Mobile Traffic': np.cumsum(np.random.normal(350, 80, 365)) + 8000,
    'API Calls': np.cumsum(np.random.normal(200, 50, 365)) + 5000
})
area_melted = area_df.melt(id_vars='Date', var_name='Source', value_name='Count')

fig = px.area(area_melted, x='Date', y='Count', color='Source',
              title='Traffic Sources Over Time',
              color_discrete_sequence=px.colors.qualitative.Pastel)
fig.update_layout(hovermode='x unified')
fig.show()
```

## 13.2 Scatter & Bubble Charts

### Creating Dynamic Scatter and Bubble Visualizations

```python
# Scatter plot with size and color dimensions
np.random.seed(42)
n_countries = 50
scatter_df = pd.DataFrame({
    'Country': [f'Country_{i}' for i in range(n_countries)],
    'GDP_per_Capita': np.random.lognormal(9.5, 1.2, n_countries).astype(int),
    'Life_Expectancy': np.random.normal(72, 8, n_countries).clip(55, 85),
    'Population_M': np.random.lognormal(1.5, 1.5, n_countries).round(1),
    'Continent': np.random.choice(['Asia', 'Europe', 'Africa',
                                    'Americas', 'Oceania'], n_countries)
})

fig = px.scatter(scatter_df, x='GDP_per_Capita', y='Life_Expectancy',
                 size='Population_M', color='Continent',
                 hover_name='Country',
                 title='GDP vs Life Expectancy (Bubble Size = Population)',
                 size_max=60,
                 color_discrete_sequence=px.colors.qualitative.Bold,
                 log_x=True)
fig.update_layout(height=600)
fig.show()
```

```python
# Scatter with trendline
tips = px.data.tips()
fig = px.scatter(tips, x='total_bill', y='tip', color='sex',
                 size='size', hover_data=['day', 'time'],
                 trendline='ols',
                 title='Total Bill vs Tip Amount',
                 trendline_color_override='red')
fig.show()

# Retrieve trendline statistics
import statsmodels.api as sm
fig.show()
```

```python
# Animated scatter plot (Gapminder style)
gapminder = px.data.gapminder()
fig = px.scatter(gapminder, x='gdpPercap', y='lifeExp',
                 size='pop', color='continent',
                 hover_name='country', log_x=True,
                 size_max=55, range_x=[100, 100000],
                 range_y=[25, 90],
                 animation_frame='year', animation_group='country',
                 title='World Development Indicators (1952-2007)',
                 color_discrete_sequence=px.colors.qualitative.Vivid)
fig.update_layout(width=1000, height=600)
fig.show()
```

```python
# Matrix scatter plot using scatter_matrix
from plotly.figure_factory import create_dendrogram

iris = px.data.iris()
fig = px.scatter_matrix(iris,
                        dimensions=['sepal_length', 'sepal_width',
                                    'petal_length', 'petal_width'],
                        color='species',
                        title='Iris Feature Matrix',
                        color_discrete_sequence=px.colors.qualitative.Set1)
fig.update_traces(diagonal_visible=True, opacity=0.7)
fig.update_layout(width=900, height=900)
fig.show()
```

## 13.3 3D Visualizations

### Three-Dimensional Charts with Plotly

```python
# 3D Scatter plot
np.random.seed(42)
n = 200
three_d_df = pd.DataFrame({
    'X': np.random.randn(n),
    'Y': np.random.randn(n),
    'Z': np.random.randn(n),
    'Cluster': np.random.choice(['Group A', 'Group B', 'Group C'], n)
})

fig = px.scatter_3d(three_d_df, x='X', y='Y', z='Z',
                    color='Cluster',
                    title='3D Cluster Visualization',
                    color_discrete_sequence=px.colors.qualitative.Vivid,
                    opacity=0.8)
fig.update_traces(marker=dict(size=5, line=dict(width=1, color='DarkSlateGrey')))
fig.update_layout(scene=dict(
    xaxis_title='X Axis',
    yaxis_title='Y Axis',
    zaxis_title='Z Axis'
))
fig.show()
```

```python
# 3D Surface plot
u = np.linspace(-3, 3, 100)
v = np.linspace(-3, 3, 100)
u, v = np.meshgrid(u, v)
z = np.sin(np.sqrt(u**2 + v**2))

fig = go.Figure(data=[go.Surface(z=z, x=u, y=v,
                                  colorscale='Viridis')])
fig.update_layout(title='3D Surface: Sine Function',
                  scene=dict(
                      xaxis_title='U',
                      yaxis_title='V',
                      zaxis_title='Z',
                      camera_eye=dict(x=1.5, y=1.5, z=0.8)
                  ))
fig.show()
```

```python
# 3D line plot (helix trajectory)
t = np.linspace(0, 10, 500)
helix_df = pd.DataFrame({
    'x': np.cos(t),
    'y': np.sin(t),
    'z': t,
    't': t
})

fig = px.line_3d(helix_df, x='x', y='y', z='z',
                 color='t',
                 color_continuous_scale='Plasma',
                 title='3D Helix Trajectory')
fig.show()
```

```python
# 3D Mesh plot
import plotly.graph_objects as go

fig = go.Figure(data=[go.Mesh3d(
    x=np.random.rand(50),
    y=np.random.rand(50),
    z=np.random.rand(50),
    opacity=0.5,
    color='lightblue',
    intensity=np.random.rand(50),
    colorscale='Rainbow'
)])
fig.update_layout(title='3D Mesh Visualization')
fig.show()
```

## 13.4 Animated Charts

### Creating Dynamic Animated Visualizations

```python
# Animated bar chart (race chart)
np.random.seed(42)
countries = ['USA', 'China', 'Japan', 'Germany', 'UK', 'India', 'France']
years = list(range(2000, 2024))

race_data = []
for year in years:
    for country in countries:
        gdp = np.random.uniform(500, 25000)
        race_data.append({'Country': country, 'Year': year, 'GDP': gdp})

race_df = pd.DataFrame(race_data)

fig = px.bar(race_df.sort_values('Year'), x='Country', y='GDP',
             color='Country', animation_frame='Year',
             range_y=[0, 28000],
             title='GDP by Country (Animated Race)',
             color_discrete_sequence=px.colors.qualitative.D3)
fig.update_layout(updatemenus=[dict(type='buttons', showactive=False)])
fig.show()
```

```python
# Animated line chart with play/pause
np.random.seed(42)
quarters = pd.date_range('2020-01-01', periods=20, freq='Q')
companies = ['TechCo', 'RetailPro', 'HealthPlus', 'FinanceHub']
anim_data = []
for comp in companies:
    base = np.random.uniform(10, 50)
    for q in quarters:
        base += np.random.normal(2, 5)
        anim_data.append({'Company': comp, 'Quarter': q, 'Revenue': max(base, 5)})

anim_df = pd.DataFrame(anim_data)
anim_df['Quarter_str'] = anim_df['Quarter'].dt.strftime('%Y-Q%q')

fig = px.line(anim_df, x='Quarter', y='Revenue', color='Company',
              animation_frame=anim_df['Quarter'].dt.year,
              range_y=[0, 150],
              title='Company Revenue Over Time (Animated)')
fig.show()
```

```python
# Animated sunburst
np.random.seed(42)
categories = ['Technology', 'Healthcare', 'Finance', 'Energy']
subcategories = {
    'Technology': ['Software', 'Hardware', 'Cloud', 'AI'],
    'Healthcare': ['Pharma', 'Devices', 'Services', 'Research'],
    'Finance': ['Banking', 'Insurance', 'Investment', 'Fintech'],
    'Energy': ['Oil', 'Renewable', 'Nuclear', 'Utilities']
}
years = [2021, 2022, 2023, 2024]

sunburst_data = []
for year in years:
    for cat in categories:
        for sub in subcategories[cat]:
            sunburst_data.append({
                'Year': year, 'Category': cat, 'Subcategory': sub,
                'Value': np.random.randint(100, 1000)
            })

sb_df = pd.DataFrame(sunburst_data)
fig = px.sunburst(sb_df, path=['Year', 'Category', 'Subcategory'],
                  values='Value', color='Category',
                  animation_frame='Year',
                  title='Industry Investment by Year (Animated)')
fig.show()
```

## 13.5 Subplots & Dashboards

### Building Multi-Chart Dashboards

```python
from plotly.subplots import make_subplots

# Create a 2x2 subplot grid
fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=('Revenue Trend', 'Market Share',
                    'Regional Performance', 'Growth Rate'),
    specs=[[{"type": "scatter"}, {"type": "pie"}],
           [{"type": "bar"}, {"type": "scatter"}]]
)

# Trace 1: Line chart
fig.add_trace(
    go.Scatter(x=range(1, 13), y=np.random.randint(40, 100, 12),
               mode='lines+markers', name='Revenue',
               line=dict(color='#636EFA', width=3)),
    row=1, col=1
)

# Trace 2: Pie chart
fig.add_trace(
    go.Pie(labels=['Product A', 'Product B', 'Product C', 'Product D'],
           values=[35, 25, 22, 18],
           marker=dict(colors=['#EF553B', '#636EFA', '#00CC96', '#AB63FA'])),
    row=1, col=2
)

# Trace 3: Bar chart
fig.add_trace(
    go.Bar(x=['North', 'South', 'East', 'West'],
           y=[45, 52, 38, 61],
           marker_color=['#EF553B', '#636EFA', '#00CC96', '#AB63FA'],
           name='Regions'),
    row=2, col=1
)

# Trace 4: Scatter
fig.add_trace(
    go.Scatter(x=np.random.uniform(1, 100, 50),
               y=np.random.uniform(1, 100, 50),
               mode='markers', name='Growth Points',
               marker=dict(size=10, color=np.random.rand(50),
                          colorscale='Viridis', opacity=0.7)),
    row=2, col=2
)

fig.update_layout(height=700, width=1000,
                  title_text="Executive Dashboard",
                  showlegend=False)
fig.show()
```

```python
# Dashboard with dropdown controls using Plotly
import plotly.graph_objects as go
from plotly.subplots import make_subplots

np.random.seed(42)
months = pd.date_range('2023-01-01', periods=12, freq='M')
metrics = {
    'Revenue': np.random.uniform(50000, 100000, 12),
    'Expenses': np.random.uniform(30000, 70000, 12),
    'Profit': np.random.uniform(10000, 40000, 12)
}

fig = make_subplots(rows=1, cols=2,
                    subplot_titles=('Metric Comparison', 'Cumulative Trend'),
                    column_widths=[0.5, 0.5])

buttons = []
for i, metric in enumerate(metrics.keys()):
    visible = [False] * len(metrics) * 2
    visible[i*2] = True
    visible[i*2+1] = True

    buttons.append(dict(
        label=metric,
        method='update',
        args=[{'visible': visible},
              {'title': f'{metric} Dashboard'}]
    ))

for i, (metric, values) in enumerate(metrics.items()):
    cumulative = np.cumsum(values)
    fig.add_trace(go.Bar(x=months, y=values, name=metric, visible=(i==0)),
                  row=1, col=1)
    fig.add_trace(go.Scatter(x=months, y=cumulative, name=f'Cum {metric}',
                             visible=(i==0), fill='tozeroy'),
                  row=1, col=2)

fig.update_layout(
    updatemenus=[dict(buttons=buttons, direction='down',
                      showactive=True, x=0.1, y=1.15)],
    height=500, title='Interactive Metric Dashboard'
)
fig.show()
```

## 13.6 Sunburst & Treemap Charts

### Hierarchical Data Visualization

```python
# Sunburst chart - organizational hierarchy
org_data = pd.DataFrame({
    'Department': ['Engineering', 'Engineering', 'Engineering',
                   'Marketing', 'Marketing', 'Sales',
                   'Sales', 'HR', 'HR'],
    'Team': ['Backend', 'Frontend', 'DevOps',
             'Content', 'Analytics', 'Enterprise',
             'SMB', 'Recruiting', 'Training'],
    'Headcount': [15, 12, 8, 6, 4, 10, 8, 5, 3],
    'Budget': [500, 400, 300, 200, 250, 350, 280, 150, 100]
})

fig = px.sunburst(org_data,
                  path=['Department', 'Team'],
                  values='Headcount',
                  color='Budget',
                  color_continuous_scale='RdYlBu',
                  title='Organization Structure (Size=Headcount, Color=Budget)')
fig.update_layout(width=800, height=800)
fig.show()
```

```python
# Treemap for market analysis
treemap_data = pd.DataFrame({
    'Sector': ['Tech', 'Tech', 'Tech', 'Health', 'Health', 'Health',
               'Finance', 'Finance', 'Finance', 'Energy', 'Energy'],
    'Company': ['AAPL', 'MSFT', 'GOOG', 'JNJ', 'PFE', 'UNH',
                'JPM', 'BAC', 'GS', 'XOM', 'CVX'],
    'Market_Cap': [2800, 2500, 1800, 450, 280, 500, 480, 320, 150, 450, 310],
    'Revenue': [394, 212, 282, 93, 100, 324, 128, 94, 46, 413, 166]
})

fig = px.treemap(treemap_data,
                 path=['Sector', 'Company'],
                 values='Market_Cap',
                 color='Revenue',
                 color_continuous_scale='Greens',
                 title='Market Capitalization Treemap')
fig.show()
```

```python
# Interactive treemap with drill-down
fig = px.treemap(treemap_data,
                 path=[px.Constant('Global Market'), 'Sector', 'Company'],
                 values='Revenue',
                 color='Market_Cap',
                 color_continuous_scale='Blues',
                 title='Revenue Treemap with Market Cap Color')
fig.update_traces(root_color='lightgrey')
fig.show()
```

## 13.7 Time Series Interactive Charts

### Interactive Time Series Analysis

```python
# Interactive candlestick chart (financial)
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=60, freq='D')
price = 150
ohlc_data = []
for date in dates:
    open_price = price + np.random.normal(0, 2)
    close_price = open_price + np.random.normal(0, 3)
    high = max(open_price, close_price) + abs(np.random.normal(0, 1))
    low = min(open_price, close_price) - abs(np.random.normal(0, 1))
    ohlc_data.append({
        'Date': date, 'Open': open_price, 'High': high,
        'Low': low, 'Close': close_price,
        'Volume': np.random.randint(1000000, 5000000)
    })
    price = close_price

fin_df = pd.DataFrame(ohlc_data)

fig = go.Figure(data=[go.Candlestick(
    x=fin_df['Date'], open=fin_df['Open'], high=fin_df['High'],
    low=fin_df['Low'], close=fin_df['Close'],
    name='OHLC'
)])
fig.update_layout(title='Stock Price Candlestick Chart',
                  xaxis_rangeslider_visible=True,
                  height=500)
fig.show()
```

```python
# Time series with range slider and buttons
fig = go.Figure()
fig.add_trace(go.Scatter(x=fin_df['Date'], y=fin_df['Close'],
                         mode='lines', name='Close Price',
                         line=dict(color='#1f77b4', width=2)))

fig.update_layout(
    title='Interactive Time Series with Range Controls',
    xaxis=dict(
        rangeselector=dict(
            buttons=list([
                dict(count=1, label='1M', step='month', stepmode='backward'),
                dict(count=3, label='3M', step='month', stepmode='backward'),
                dict(count=6, label='6M', step='month', stepmode='backward'),
                dict(step='all', label='All')
            ])
        ),
        rangeslider=dict(visible=True),
        type='date'
    ),
    hovermode='x unified',
    height=500
)
fig.show()
```

```python
# Multi-axis time series
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=365, freq='D')
multi_df = pd.DataFrame({
    'Date': dates,
    'Temperature': 20 + 10 * np.sin(np.linspace(0, 2*np.pi, 365)) + np.random.normal(0, 2, 365),
    'Sales': 500 + 200 * np.sin(np.linspace(0, 2*np.pi, 365) + 0.5) + np.random.normal(0, 50, 365)
})

fig = go.Figure()
fig.add_trace(go.Scatter(x=multi_df['Date'], y=multi_df['Temperature'],
                         name='Temperature (Â°C)',
                         line=dict(color='#FF6B6B', width=2),
                         yaxis='y'))
fig.add_trace(go.Scatter(x=multi_df['Date'], y=multi_df['Sales'],
                         name='Sales ($)',
                         line=dict(color='#4ECDC4', width=2),
                         yaxis='y2'))

fig.update_layout(
    title='Temperature vs Sales (Dual Axis)',
    yaxis=dict(title='Temperature (Â°C)', side='left'),
    yaxis2=dict(title='Sales ($)', overlaying='y', side='right'),
    hovermode='x unified'
)
fig.show()
```

### Real-Time Use Cases for Module 13

| Use Case | Library | Description |
|----------|---------|-------------|
| Financial Dashboard | Plotly + Dash | Real-time stock monitoring with candlestick charts |
| Sales Performance Tracker | Plotly Express | Interactive quarterly sales visualization |
| Climate Data Explorer | Plotly 3D | 3D temperature and weather pattern visualization |
| Market Research Dashboard | Plotly Subplots | Multi-metric executive dashboard |
| Customer Analytics | Plotly Animation | Animated customer segment evolution |
| Investment Portfolio | Plotly Sunburst | Hierarchical portfolio allocation visualization |
| Website Analytics | Plotly Time Series | Traffic and conversion trend analysis |

### Module 13 Project Ideas

| Project | Description | Libraries |
|---------|-------------|-----------|
| **Stock Market Analyzer** | Build interactive financial dashboard with candlestick, volume, and technical indicators | Plotly, yfinance, Dash |
| **Sales Performance Platform** | Multi-view sales dashboard with animated trends, geographic breakdowns, product comparisons | Plotly Express, pandas |
| **Climate Change Visualizer** | 3D visualization of global temperature patterns with animated yearly progression | Plotly 3D, Plotly Animation |
| **Social Media Analytics** | Interactive treemap and sunburst showing engagement metrics by platform, content type, time | Plotly, API integration |
| **Real-Time IoT Dashboard** | Multi-sensor dashboard with live-updating charts and alert thresholds | Plotly, WebSocket, Dash |

---

# MODULE 14: DASHBOARD DEVELOPMENT WITH DASH/STREAMLIT

## 14.1 Streamlit Basics

### Building Your First Streamlit App

```python
# app.py - Basic Streamlit Dashboard
import streamlit as st
import pandas as pd
import numpy as np

st.title("Sales Analytics Dashboard")
st.markdown("### Real-time sales performance monitoring")

# Sidebar configuration
st.sidebar.header("Configuration")
date_range = st.sidebar.date_input("Select Date Range",
                                    value=[pd.Timestamp('2024-01-01'),
                                           pd.Timestamp('2024-12-31')])
metric = st.sidebar.selectbox("Primary Metric",
                               ["Revenue", "Orders", "Customers"])

# Generate sample data
@st.cache_data
def load_data():
    np.random.seed(42)
    dates = pd.date_range('2024-01-01', periods=365, freq='D')
    return pd.DataFrame({
        'Date': dates,
        'Revenue': np.random.uniform(10000, 50000, 365).cumsum(),
        'Orders': np.random.randint(50, 200, 365).cumsum(),
        'Customers': np.random.randint(20, 100, 365).cumsum()
    })

df = load_data()

# Display metrics
col1, col2, col3 = st.columns(3)
col1.metric("Total Revenue", f"${df['Revenue'].iloc[-1]:,.0f}",
            delta=f"+{np.random.uniform(5, 15):.1f}%")
col2.metric("Total Orders", f"{df['Orders'].iloc[-1]:,}",
            delta=f"+{np.random.uniform(3, 10):.1f}%")
col3.metric("Total Customers", f"{df['Customers'].iloc[-1]:,}",
            delta=f"+{np.random.uniform(2, 8):.1f}%")

# Line chart
st.line_chart(df.set_index('Date')[[metric]])

# Data table
with st.expander("View Raw Data"):
    st.dataframe(df.tail(30), use_container_width=True)
```

```python
# Advanced Streamlit components
import streamlit as st
import plotly.express as px
import pandas as pd
import numpy as np

st.set_page_config(page_title="Advanced Dashboard",
                   layout="wide",
                   initial_sidebar_state="expanded")

# Custom CSS
st.markdown("""
<style>
    .main-header {font-size: 2.5rem; font-weight: bold; color: #1f77b4}
    .metric-card {background-color: #f0f2f6; padding: 1rem; border-radius: 0.5rem}
</style>
""", unsafe_allow_html=True)

# Layout with columns
left_col, right_col = st.columns([1, 2])

with left_col:
    st.markdown("## Filters")
    category = st.multiselect("Product Category",
                                ["Electronics", "Clothing", "Food", "Books"],
                                default=["Electronics", "Clothing"])
    min_price = st.slider("Minimum Price", 0, 1000, 100)
    max_price = st.slider("Maximum Price", 0, 5000, 2000)

with right_col:
    # Generate data based on filters
    np.random.seed(42)
    filtered_df = pd.DataFrame({
        'Product': [f'Item_{i}' for i in range(100)],
        'Price': np.random.uniform(min_price, max_price, 100),
        'Category': np.random.choice(category, 100),
        'Sales': np.random.randint(10, 500, 100)
    })

    fig = px.scatter(filtered_df, x='Price', y='Sales',
                     color='Category', size='Sales',
                     title='Product Sales Analysis')
    st.plotly_chart(fig, use_container_width=True)

    # Tabs for different views
    tab1, tab2, tab3 = st.tabs(["Chart", "Table", "Statistics"])

    with tab1:
        st.bar_chart(filtered_df.groupby('Category')['Sales'].sum())
    with tab2:
        st.dataframe(filtered_df, use_container_width=True)
    with tab3:
        st.write(filtered_df.describe())
```

```python
# Streamlit caching and performance
import streamlit as st
import pandas as pd
import time

# Cache data loading
@st.cache_data(ttl=3600)  # Cache expires after 1 hour
def load_expensive_data(query_params):
    # Simulate expensive database query
    time.sleep(2)
    np.random.seed(42)
    return pd.DataFrame({
        'metric': np.random.randn(1000),
        'category': np.random.choice(['A', 'B', 'C'], 1000)
    })

# Cache computation
@st.cache_resource
def load_ml_model():
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.datasets import make_classification
    X, y = make_classification(n_samples=1000, n_features=10)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

# Session state for persistent variables
if 'counter' not in st.session_state:
    st.session_state.counter = 0

st.session_state.counter += 1
st.write(f"Page loads: {st.session_state.counter}")

# Progress bar
progress = st.progress(0)
for i in range(100):
    progress.progress(i + 1)
    time.sleep(0.01)
st.success("Data loaded successfully!")
```

## 14.2 Interactive Widgets

### Building Rich User Interfaces

```python
# Comprehensive widget showcase
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

st.title("Interactive Widget Dashboard")

# Input widgets
with st.form("data_config"):
    col1, col2 = st.columns(2)

    with col1:
        dataset_name = st.selectbox("Dataset",
                                      ["iris", "tips", "gapminder"])
        chart_type = st.radio("Chart Type",
                                ["Scatter", "Bar", "Line", "Area"],
                                horizontal=True)

    with col2:
        color_by = st.selectbox("Color Dimension",
                                  ["species", "total_bill"] if dataset_name == "tips" else None)
        show_trend = st.checkbox("Show Trendline")

    submitted = st.form_submit_button("Generate Chart")

if submitted:
    # Load dataset
    data_map = {
        "iris": px.data.iris(),
        "tips": px.data.tips(),
        "gapminder": px.data.gapminder()
    }
    df = data_map[dataset_name]

    # Dynamic color options
    if dataset_name == "iris":
        color_options = ["species", "petal_length"]
    elif dataset_name == "tips":
        color_options = ["sex", "day", "time", "total_bill"]
    else:
        color_options = ["continent", "lifeExp", "pop"]

    # Create chart
    if chart_type == "Scatter":
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        x_col = st.selectbox("X-axis", numeric_cols, index=0)
        y_col = st.selectbox("Y-axis", numeric_cols, index=min(1, len(numeric_cols)-1))

        fig = px.scatter(df, x=x_col, y=y_col,
                         color=color_by if color_by else None,
                         trendline='ols' if show_trend else None)
        st.plotly_chart(fig, use_container_width=True)

    elif chart_type == "Bar":
        cat_cols = df.select_dtypes(include=['object']).columns.tolist()
        if cat_cols:
            x_col = st.selectbox("Category", cat_cols)
            y_col = st.selectbox("Value", df.select_dtypes(include=[np.number]).columns)
            fig = px.bar(df.groupby(x_col)[y_col].mean().reset_index(),
                         x=x_col, y=y_col)
            st.plotly_chart(fig, use_container_width=True)

# Number input with real-time updates
st.sidebar.header("Real-time Parameters")
window_size = st.sidebar.number_input("Moving Average Window",
                                        min_value=5, max_value=100, value=20)

# Color picker
accent_color = st.sidebar.color_picker("Chart Accent Color", "#1f77b4")

# Text area for notes
notes = st.sidebar.text_area("Dashboard Notes",
                               "Add observations here...")
```

```python
# Advanced widget patterns
import streamlit as st
import pandas as pd
import numpy as np

# Dynamic filter with dependencies
st.sidebar.header("Data Filters")

# First, select the main category
main_category = st.sidebar.selectbox("Main Category",
                                       ["Products", "Services", "Analytics"])

# Dependent dropdown
sub_options = {
    "Products": ["Electronics", "Clothing", "Home"],
    "Services": ["Consulting", "Support", "Training"],
    "Analytics": ["Dashboard", "Reports", "Predictions"]
}
sub_category = st.sidebar.selectbox("Sub Category",
                                      sub_options[main_category])

# Multiselect with search
all_items = [f"{sub_category}_Item_{i}" for i in range(1, 20)]
selected_items = st.sidebar.multiselect("Select Items", all_items,
                                          default=all_items[:5])

# Date range with presets
col1, col2 = st.sidebar.columns(2)
preset = col1.selectbox("Preset", ["Last 7 days", "Last 30 days",
                                     "Last quarter", "Custom"])
if preset == "Custom":
    start_date = col2.date_input("Start")
    end_date = col2.date_input("End")

# Conditional UI elements
show_advanced = st.sidebar.checkbox("Show Advanced Options")
if show_advanced:
    aggregation = st.sidebar.selectbox("Aggregation",
                                         ["Mean", "Median", "Sum", "Count"])
    confidence_level = st.sidebar.slider("Confidence Level",
                                           0.80, 0.99, 0.95)
    max_points = st.sidebar.number_input("Max Data Points",
                                            100, 10000, 1000)
```

## 14.3 Dash Layout & Callbacks

### Building Interactive Dash Applications

```python
# Basic Dash application structure
import dash
from dash import dcc, html, Input, Output, callback
import plotly.express as px
import pandas as pd
import numpy as np

app = dash.Dash(__name__, suppress_callback_exceptions=True)

# Generate sample data
np.random.seed(42)
df = pd.DataFrame({
    'Date': pd.date_range('2024-01-01', periods=365, freq='D'),
    'Revenue': np.cumsum(np.random.normal(500, 100, 365)),
    'Orders': np.random.randint(50, 200, 365).cumsum(),
    'Region': np.random.choice(['North', 'South', 'East', 'West'], 365)
})

app.layout = html.Div([
    html.H1("Sales Dashboard", style={'textAlign': 'center'}),

    html.Div([
        html.Div([
            html.Label("Date Range"),
            dcc.DatePickerRange(
                id='date-range',
                start_date=df['Date'].min(),
                end_date=df['Date'].max()
            )
        ], className='six columns'),

        html.Div([
            html.Label("Region Filter"),
            dcc.Dropdown(
                id='region-filter',
                options=[{'label': r, 'value': r} for r in df['Region'].unique()],
                multi=True,
                value=df['Region'].unique().tolist()
            )
        ], className='six columns')
    ], className='row'),

    html.Div([
        html.Div([dcc.Graph(id='revenue-chart')], className='six columns'),
        html.Div([dcc.Graph(id='orders-chart')], className='six columns')
    ], className='row'),

    dcc.Graph(id='region-chart')
], style={'padding': 20})

@callback(
    [Output('revenue-chart', 'figure'),
     Output('orders-chart', 'figure'),
     Output('region-chart', 'figure')],
    [Input('date-range', 'start_date'),
     Input('date-range', 'end_date'),
     Input('region-filter', 'value')]
)
def update_charts(start_date, end_date, regions):
    filtered = df[
        (df['Date'] >= start_date) &
        (df['Date'] <= end_date) &
        (df['Region'].isin(regions))
    ]

    revenue_fig = px.line(filtered, x='Date', y='Revenue',
                          title='Revenue Trend')
    orders_fig = px.bar(filtered.groupby('Region')['Orders'].sum().reset_index(),
                        x='Region', y='Orders', title='Orders by Region')
    region_fig = px.area(filtered, x='Date', y='Revenue', color='Region',
                         title='Revenue by Region')

    return revenue_fig, orders_fig, region_fig

if __name__ == '__main__':
    app.run(debug=True, port=8050)
```

```python
# Advanced callback patterns with dcc.Store
import dash
from dash import dcc, html, Input, Output, State, callback
import plotly.express as px
import pandas as pd
import numpy as np

app = dash.Dash(__name__)

app.layout = html.Div([
    dcc.Store(id='filtered-data-store', storage_type='memory'),

    html.H1("Advanced Dashboard with State Management"),

    html.Div([
        dcc.Dropdown(id='metric-select',
                     options=['Revenue', 'Profit', 'Growth'],
                     value='Revenue'),
        dcc.Slider(id='threshold-slider',
                   min=0, max=100, value=50, step=5,
                   marks={i: str(i) for i in range(0, 101, 20)}),
        html.Button('Apply Filters', id='apply-btn', n_clicks=0)
    ]),

    html.Div(id='output-div'),
    dcc.Graph(id='main-chart')
])

@callback(
    Output('filtered-data-store', 'data'),
    Input('apply-btn', 'n_clicks'),
    [State('metric-select', 'value'),
     State('threshold-slider', 'value')]
)
def store_filtered_data(n_clicks, metric, threshold):
    np.random.seed(42)
    df = pd.DataFrame({
        'x': np.random.uniform(0, 100, 500),
        'y': np.random.uniform(0, 100, 500),
        'Revenue': np.random.uniform(1000, 10000, 500),
        'Profit': np.random.uniform(-1000, 5000, 500),
        'Growth': np.random.uniform(-20, 50, 500)
    })
    filtered = df[df[metric] > threshold]
    return filtered.to_json(date_format='iso', orient='split')

@callback(
    Output('main-chart', 'figure'),
    Input('filtered-data-store', 'data')
)
def update_chart(json_data):
    if json_data is None:
        return {}
    df = pd.read_json(json_data, orient='split')
    fig = px.scatter(df, x='x', y='y', size='Revenue',
                     color='Profit', title='Filtered Data Visualization')
    return fig

if __name__ == '__main__':
    app.run(debug=True)
```

## 14.4 Multi-Page Dashboards

### Building Scalable Multi-Page Applications

```python
# Multi-page Dash app with pages
# pages/home.py
import dash
from dash import html, dcc
import plotly.express as px
import pandas as pd

dash.register_page(__name__, path='/', name='Home', icon='ðŸ ')

df = px.data.gapminder()

layout = html.Div([
    html.H1("Global Development Dashboard"),

    html.Div([
        html.Div([
            html.H3("Key Metrics"),
            html.Div([
                html.Div([
                    html.H4(f"{len(df['country'].unique())}"),
                    html.P("Countries")
                ], style={'textAlign': 'center', 'flex': 1}),
                html.Div([
                    html.H4(f"{df['year'].max() - df['year'].min()}"),
                    html.P("Years Covered")
                ], style={'textAlign': 'center', 'flex': 1}),
                html.Div([
                    html.H4(f"{len(df['continent'].unique())}"),
                    html.P("Continents")
                ], style={'textAlign': 'center', 'flex': 1})
            ], style={'display': 'flex'})
        ]),

        html.Div([
            dcc.Graph(
                figure=px.scatter(
                    df.query('year==2007'),
                    x='gdpPercap', y='lifeExp',
                    size='pop', color='continent',
                    hover_name='country',
                    title='World Indicators (2007)'
                )
            )
        ])
    ])
])
```

```python
# pages/analysis.py
import dash
from dash import html, dcc, Input, Output
import plotly.express as px
import pandas as pd

dash.register_page(__name__, path='/analysis', name='Analysis', icon='ðŸ“Š')

df = px.data.gapminder()

layout = html.Div([
    html.H1("Country Analysis"),

    html.Div([
        dcc.Dropdown(
            id='continent-dropdown',
            options=[{'label': c, 'value': c}
                     for c in df['continent'].unique()],
            value='Asia',
            placeholder='Select Continent'
        ),
        dcc.Dropdown(
            id='metric-dropdown',
            options=['gdpPercap', 'lifeExp', 'pop'],
            value='gdpPercap',
            placeholder='Select Metric'
        )
    ], style={'width': '50%', 'margin': '0 auto'}),

    dcc.Graph(id='analysis-chart')
])

@callback(
    Output('analysis-chart', 'figure'),
    [Input('continent-dropdown', 'value'),
     Input('metric-dropdown', 'value')]
)
def update_analysis(continent, metric):
    filtered = df[df['continent'] == continent]
    fig = px.line(filtered, x='year', y=metric,
                  color='country', title=f'{metric} by Country in {continent}')
    return fig
```

```python
# pages/compare.py
import dash
from dash import html, dcc, Input, Output
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

dash.register_page(__name__, path='/compare', name='Compare', icon='âš–ï¸')

df = px.data.gapminder()

layout = html.Div([
    html.H1("Country Comparison"),

    html.Div([
        dcc.Dropdown(
            id='country1-dropdown',
            options=[{'label': c, 'value': c}
                     for c in df['country'].unique()],
            value='United States'
        ),
        dcc.Dropdown(
            id='country2-dropdown',
            options=[{'label': c, 'value': c}
                     for c in df['country'].unique()],
            value='China'
        ),
        dcc.Checklist(
            id='metrics-checklist',
            options=['gdpPercap', 'lifeExp', 'pop'],
            value=['gdpPercap', 'lifeExp'],
            inline=True
        )
    ]),

    dcc.Graph(id='comparison-chart')
])

@callback(
    Output('comparison-chart', 'figure'),
    [Input('country1-dropdown', 'value'),
     Input('country2-dropdown', 'value'),
     Input('metrics-checklist', 'value')]
)
def update_comparison(country1, country2, metrics):
    filtered = df[df['country'].isin([country1, country2])]

    fig = go.Figure()
    for metric in metrics:
        for country in [country1, country2]:
            country_data = filtered[filtered['country'] == country]
            fig.add_trace(go.Scatter(
                x=country_data['year'],
                y=country_data[metric],
                name=f'{country} - {metric}'
            ))

    fig.update_layout(title=f'{country1} vs {country2}')
    return fig
```

## 14.5 Real-time Data Dashboards

### Live Data Streaming and Updates

```python
# Streamlit real-time dashboard with auto-refresh
import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
import time

st.set_page_config(page_title="Real-time Dashboard", layout="wide")

# Auto-refresh configuration
refresh_rate = st.sidebar.slider("Refresh Rate (seconds)", 1, 30, 5)

# Placeholder for live data
placeholder = st.empty()

while True:
    with placeholder.container():
        # Simulate real-time data
        current_time = datetime.now()
        data = {
            'timestamp': [current_time],
            'cpu_usage': [np.random.uniform(20, 80)],
            'memory_usage': [np.random.uniform(40, 90)],
            'network_in': [np.random.uniform(100, 1000)],
            'network_out': [np.random.uniform(50, 500)],
            'active_users': [np.random.randint(100, 1000)]
        }
        live_df = pd.DataFrame(data)

        # Display metrics
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("CPU Usage", f"{live_df['cpu_usage'].iloc[0]:.1f}%")
        col2.metric("Memory", f"{live_df['memory_usage'].iloc[0]:.1f}%")
        col3.metric("Network In", f"{live_df['network_in'].iloc[0]:.0f} MB/s")
        col4.metric("Active Users", f"{live_df['active_users'].iloc[0]:,}")

        # Alert on thresholds
        if live_df['cpu_usage'].iloc[0] > 75:
            st.error("âš ï¸ High CPU Usage Alert!")
        if live_df['memory_usage'].iloc[0] > 85:
            st.warning("âš ï¸ Memory Usage Critical!")

        # Live chart
        if 'metrics_history' not in st.session_state:
            st.session_state.metrics_history = pd.DataFrame()

        new_row = pd.DataFrame({
            'time': [current_time],
            'cpu': [live_df['cpu_usage'].iloc[0]],
            'memory': [live_df['memory_usage'].iloc[0]]
        })
        st.session_state.metrics_history = pd.concat(
            [st.session_state.metrics_history, new_row], ignore_index=True
        ).tail(100)

        st.line_chart(st.session_state.metrics_history.set_index('time'))

    time.sleep(refresh_rate)
```

```python
# Dash with real-time updates using dcc.Interval
import dash
from dash import dcc, html, Input, Output
import plotly.graph_objects as go
from collections import deque
import random

app = dash.Dash(__name__)

max_length = 100
times = deque(maxlen=max_length)
cpu_data = deque(maxlen=max_length)
memory_data = deque(maxlen=max_length)

app.layout = html.Div([
    html.H1("Real-time System Monitor"),

    dcc.Graph(id='live-graph', animate=True),
    dcc.Interval(
        id='graph-update',
        interval=2000,  # Update every 2 seconds
        n_intervals=0
    ),

    html.Div([
        html.H3("System Status"),
        html.Div(id='status-display')
    ])
])

@app.callback(
    [Output('live-graph', 'figure'),
     Output('status-display', 'children')],
    [Input('graph-update', 'n_intervals')]
)
def update_graph(n):
    times.append(len(times))
    cpu_data.append(random.uniform(20, 80))
    memory_data.append(random.uniform(40, 90))

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=list(times), y=list(cpu_data),
                             name='CPU', line=dict(color='blue')))
    fig.add_trace(go.Scatter(x=list(times), y=list(memory_data),
                             name='Memory', line=dict(color='red')))

    fig.update_layout(title='Real-time System Metrics',
                      yaxis_range=[0, 100])

    status = html.Div([
        html.P(f"CPU: {cpu_data[-1]:.1f}%"),
        html.P(f"Memory: {memory_data[-1]:.1f}%")
    ])

    return fig, status

if __name__ == '__main__':
    app.run(debug=True, port=8051)
```

## 14.6 Deployment Best Practices

### Production Deployment Guide

```python
# Production-ready Streamlit app with configuration
# config.py
import streamlit as st
import os

# Page configuration
st.set_page_config(
    page_title="Production Dashboard",
    page_icon="ðŸ“Š",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': 'https://example.com/help',
        'Report a bug': "https://example.com/bugs",
        'About': "# Production Dashboard v2.0"
    }
)

# Custom theme
st.markdown("""
<style>
    .stApp {
        background-color: #f5f5f5;
    }
    .sidebar .sidebar-content {
        background-color: #262730;
    }
</style>
""", unsafe_allow_html=True)

# app.py - Production Streamlit application
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from pathlib import Path
import json
import logging

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment-based configuration
class Config:
    ENV = os.getenv('APP_ENV', 'development')
    DATA_DIR = Path(os.getenv('DATA_DIR', './data'))
    CACHE_TTL = 3600 if ENV == 'production' else 300
    MAX_ROWS = 100000

# Data loading with caching
@st.cache_data(ttl=Config.CACHE_TTL)
def load_data(file_path: str) -> pd.DataFrame:
    """Load and validate data from file."""
    try:
        df = pd.read_csv(file_path)
        logger.info(f"Loaded {len(df)} rows from {file_path}")
        return df
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        st.error("Failed to load data. Please check the file.")
        return pd.DataFrame()

# Error handling wrapper
def safe_execute(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except Exception as e:
        logger.error(f"Execution error: {e}")
        st.error("An error occurred. Please try again.")
        return None

# Main application
def main():
    st.title("Production Dashboard")

    # Sidebar with organized sections
    with st.sidebar:
        st.header("Configuration")

        with st.expander("Data Settings", expanded=True):
            data_source = st.selectbox("Data Source",
                                         ["CSV Upload", "Database", "API"])
            max_rows = st.number_input("Max Rows", 1000, 100000, 10000)

        with st.expander("Display Settings"):
            theme = st.selectbox("Theme", ["Light", "Dark"])
            show_raw = st.checkbox("Show Raw Data")
            export_format = st.radio("Export Format", ["CSV", "Excel", "JSON"])

    # Main content
    if data_source == "CSV Upload":
        uploaded_file = st.file_uploader("Upload CSV", type=['csv'])
        if uploaded_file:
            df = load_data(uploaded_file)
            if not df.empty:
                st.dataframe(df.head(100))

                # Visualizations
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) >= 2:
                    fig = px.scatter(df, x=numeric_cols[0], y=numeric_cols[1])
                    st.plotly_chart(fig, use_container_width=True)

                # Export functionality
                if st.button("Export Data"):
                    if export_format == "CSV":
                        csv = df.to_csv(index=False)
                        st.download_button("Download CSV", csv,
                                          "data.csv", "text/csv")

    # Footer
    st.markdown("---")
    st.markdown("Built with Streamlit | v2.0")

if __name__ == "__main__":
    main()
```

```python
# Dockerfile for Streamlit app
# Dockerfile
"""
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health || exit 1

CMD ["streamlit", "run", "app.py", \
     "--server.port=8501", \
     "--server.address=0.0.0.0", \
     "--server.enableCORS=false", \
     "--server.enableXsrfProtection=false"]
"""

# requirements.txt content
requirements = """
streamlit==1.31.0
pandas==2.2.0
numpy==1.26.4
plotly==5.18.0
scikit-learn==1.4.0
python-dotenv==1.0.0
"""
```

### Real-Time Use Cases for Module 14

| Use Case | Platform | Features |
|----------|----------|----------|
| Executive KPI Dashboard | Streamlit | Real-time metrics, drill-down, export |
| Sales Analytics Portal | Dash | Multi-page, callback-driven, live updates |
| Customer Support Monitor | Streamlit | Ticket tracking, SLA alerts, agent metrics |
| Financial Trading Platform | Dash | WebSocket integration, real-time charts |
| Marketing Campaign Tracker | Streamlit | A/B test results, conversion funnels |
| DevOps Monitoring Panel | Dash | System metrics, log analysis, alerts |
| Healthcare Patient Dashboard | Streamlit | Patient vitals, appointment scheduling |

### Module 14 Project Ideas

| Project | Description | Technologies |
|---------|-------------|--------------|
| **Sales Intelligence Platform** | Multi-page dashboard with drill-down analytics, export capabilities, and scheduled reports | Streamlit + Plotly + PostgreSQL |
| **Real-time IoT Monitor** | Live sensor data dashboard with alerting, historical analysis, and predictive maintenance | Dash + WebSocket + Redis |
| **Customer 360 View** | Unified customer profile dashboard combining CRM, support, and transaction data | Dash + Plotly + REST APIs |
| **Marketing Attribution Dashboard** | Multi-touch attribution analysis with interactive funnel visualization | Streamlit + Plotly + BigQuery |
| **Healthcare Analytics Portal** | Patient outcomes dashboard with statistical analysis and treatment comparisons | Dash + Seaborn + Flask |

---

# MODULE 15: ADVANCED SEABORN & STATISTICAL VISUALIZATION

## 15.1 Statistical Plots (violin, swarm, boxen)

### Advanced Distribution Visualizations

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

# Load dataset
tips = sns.load_dataset('tips')
iris = sns.load_dataset('iris')
titanic = sns.load_dataset('titanic')

# Violin plot with multiple features
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Basic violin plot
sns.violinplot(data=tips, x='day', y='total_bill', ax=axes[0, 0],
               palette='Set2', inner='quartile')
axes[0, 0].set_title('Violin Plot with Quartiles')

# Split violin plot
sns.violinplot(data=tips, x='day', y='total_bill', hue='sex',
               split=True, ax=axes[0, 1], palette='muted')
axes[0, 1].set_title('Split Violin Plot')

# Swarm plot overlay
sns.violinplot(data=tips, x='day', y='total_bill', ax=axes[1, 0],
               palette='lightgray', inner=None)
sns.swarmplot(data=tips, x='day', y='total_bill', ax=axes[1, 0],
              color='black', size=4)
axes[1, 0].set_title('Violin + Swarm Plot')

# Violin with box plot inside
sns.violinplot(data=tips, x='day', y='total_bill', ax=axes[1, 1],
               palette='Set3', inner='box')
axes[1, 1].set_title('Violin + Box Plot')

plt.tight_layout()
plt.show()
```

```python
# Boxen plot (letter-value plot) for large datasets
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Boxen plot - shows more quantile information than box plot
sns.boxenplot(data=tips, x='day', y='total_bill', ax=axes[0],
              palette='coolwarm')
axes[0].set_title('Boxen Plot - Extended Box Plot')
axes[0].set_xlabel('Day of Week')
axes[0].set_ylabel('Total Bill ($)')

# Swarm plot
sns.swarmplot(data=tips, x='day', y='total_bill', ax=axes[1],
              size=6, palette='viridis')
axes[1].set_title('Swarm Plot - Individual Data Points')
axes[1].set_xlabel('Day of Week')
axes[1].set_ylabel('Total Bill ($)')

plt.tight_layout()
plt.show()

# Statistical annotations
from scipy.stats import mannwhitneyu

def add_stat_annotation(ax, data, x_col, y_col, groups):
    """Add statistical significance annotations to plots."""
    for i, group1 in enumerate(groups):
        for j, group2 in enumerate(groups):
            if i < j:
                data1 = data[data[x_col] == group1][y_col]
                data2 = data[data[x_col] == group2][y_col]
                stat, p_value = mannwhitneyu(data1, data2)
                if p_value < 0.05:
                    y_max = data[y_col].max()
                    ax.plot([i, j], [y_max + 0.5, y_max + 0.5],
                            linewidth=1, color='black')
                    sig = '***' if p_value < 0.001 else '**' if p_value < 0.01 else '*'
                    ax.text((i + j) / 2, y_max + 1, sig,
                           ha='center', fontsize=10)

fig, ax = plt.subplots(figsize=(10, 6))
sns.boxenplot(data=tips, x='day', y='total_bill', ax=ax)
add_stat_annotation(ax, tips, 'day', 'total_bill', tips['day'].unique())
plt.title('Boxen Plot with Statistical Significance')
plt.tight_layout()
plt.show()
```

```python
# Distribution plots with statistical tests
fig, axes = plt.subplots(2, 3, figsize=(18, 10))

# KDE plot
sns.kdeplot(data=tips, x='total_bill', hue='day', fill=True,
            alpha=0.5, ax=axes[0, 0], palette='Set2')
axes[0, 0].set_title('KDE Distribution by Day')

# ECDF plot
sns.ecdfplot(data=tips, x='total_bill', hue='day',
             ax=axes[0, 1], palette='Set2')
axes[0, 1].set_title('ECDF by Day')

# Rug plot
sns.rugplot(data=tips, x='total_bill', ax=axes[0, 2],
            height=0.1, color='red')
axes[0, 2].set_title('Rug Plot - Data Point Locations')

# Ridgeline-style distribution
for i, day in enumerate(tips['day'].unique()):
    subset = tips[tips['day'] == day]
    sns.kdeplot(data=subset, x='total_bill', ax=axes[1, 0],
                fill=True, alpha=0.3, label=day)
axes[1, 0].set_title('Stacked KDE - Ridgeline Style')
axes[1, 0].legend()

# Histogram with KDE and rug
sns.histplot(data=tips, x='total_bill', kde=True, ax=axes[1, 1],
             color='steelblue', edgecolor='black')
sns.rugplot(data=tips, x='total_bill', ax=axes[1, 1],
            color='red', height=0.05)
axes[1, 1].set_title('Histogram + KDE + Rug')

# Joint distribution
sns.kdeplot(data=tips, x='total_bill', y='tip', ax=axes[1, 2],
            cmap='Blues', fill=True, thresh=0.05)
axes[1, 2].set_title('2D KDE - Bill vs Tip')

plt.tight_layout()
plt.show()
```

## 15.2 Pair Plots & PairGrid

### Multi-Variable Relationship Analysis

```python
# Basic pair plot
sns.pairplot(iris, hue='species', palette='Set2',
             diag_kind='kde', plot_kws={'alpha': 0.6, 's': 40})
plt.suptitle('Iris Dataset - Pair Plot by Species', y=1.02)
plt.show()
```

```python
# Custom PairGrid for more control
g = sns.PairGrid(iris, hue='species', palette='Set1',
                  diag_sharey=False)

# Upper triangle: scatter plots with regression
g.map_upper(sns.scatterplot, alpha=0.5, s=30)

# Diagonal: KDE plots
g.map_diag(sns.kdeplot, fill=True, alpha=0.5)

# Lower triangle: hexbin
def hexbin(x, y, **kwargs):
    plt.hexbin(x, y, gridsize=15, cmap='Blues', **kwargs)

g.map_lower(hexbin)

g.add_legend(title='Species')
g.figure.suptitle('Custom PairGrid - Iris Dataset', y=1.02)
plt.show()
```

```python
# Pair plot with different variables and annotations
# Create pair plot with custom statistics
def corr(x, y, **kwargs):
    """Calculate and display correlation coefficient."""
    r, _ = stats.pearsonr(x, y)
    plt.annotate(f'Ï = {r:.2f}', xy=(0.5, 0.5),
                 xycoords='axes fraction', ha='center',
                 fontsize=12, color='red')

g = sns.PairGrid(iris.drop('species', axis=1), diag_sharey=False)
g.map_upper(corr)
g.map_diag(sns.kdeplot, fill=True, color='blue')
g.map_lower(sns.scatterplot, alpha=0.5)
g.figure.suptitle('Correlation Matrix with PairGrid', y=1.02)
plt.show()
```

```python
# Advanced pair plot with marginal distributions
g = sns.PairGrid(iris, hue='species', palette='dark',
                  height=3, aspect=1.2)

g.map_upper(sns.scatterplot, size=iris['petal_length'] * 2,
            alpha=0.4)
g.map_lower(sns.kdeplot, fill=True, levels=5, alpha=0.3)
g.map_diag(sns.histplot, kde=True, edgecolor='black')

g.add_legend()
g.figure.suptitle('Advanced PairGrid with Size Encoding', y=1.02)
plt.tight_layout()
plt.show()
```

## 15.3 FacetGrid & Categorical Plots

### Multi-Panel Categorical Visualizations

```python
# FacetGrid for multi-variable analysis
g = sns.FacetGrid(tips, col='time', row='smoker',
                  margin_titles=True, height=4, aspect=1.2)
g.map_dataframe(sns.histplot, x='total_bill', bins=15,
                color='steelblue', edgecolor='black')
g.set_axis_labels('Total Bill ($)', 'Count')
g.set_titles(col_template='{col_name} Time', row_template='Smoker: {row_name}')
g.add_legend()
plt.suptitle('FacetGrid - Bill Distribution by Time and Smoking Status',
             y=1.02)
plt.show()
```

```python
# Categorical plots with statistical aggregation
fig, axes = plt.subplots(2, 3, figsize=(18, 10))

# Strip plot
sns.stripplot(data=tips, x='day', y='total_bill', ax=axes[0, 0],
              jitter=True, alpha=0.5, size=6, palette='Set2')
axes[0, 0].set_title('Strip Plot - Individual Points')

# Box plot with jitter
sns.boxplot(data=tips, x='day', y='total_bill', ax=axes[0, 1],
            fliersize=0, palette='Set2')
sns.stripplot(data=tips, x='day', y='total_bill', ax=axes[0, 1],
              color='black', alpha=0.3, size=3)
axes[0, 1].set_title('Box + Strip Plot')

# Point plot with error bars
sns.pointplot(data=tips, x='day', y='total_bill', hue='sex',
              ax=axes[0, 2], palette='Set1', ci=95,
              markers=['o', 's'], linestyles=['-', '--'])
axes[0, 2].set_title('Point Plot with 95% CI')

# Bar plot with individual points
sns.barplot(data=tips, x='day', y='total_bill', hue='sex',
            ax=axes[1, 0], palette='Set2', errorbar='sd')
axes[1, 0].set_title('Bar Plot with SD Error Bars')

# Count plot
sns.countplot(data=titanic, x='class', hue='survived',
              ax=axes[1, 1], palette='RdYlGn')
axes[1, 1].set_title('Count Plot - Survivors by Class')

# Catplot using factorplot
sns.boxenplot(data=tips, x='day', y='total_bill', hue='sex',
              ax=axes[1, 2], palette='Set3')
axes[1, 2].set_title('Boxen Plot by Day and Sex')

plt.tight_layout()
plt.show()
```

```python
# Advanced FacetGrid with custom functions
def mean_and_std(x, **kwargs):
    """Plot mean line with shaded std region."""
    mean = x.mean()
    std = x.std()
    plt.axvline(mean, color='red', linestyle='--', linewidth=2)
    plt.fill_betweenx([0, plt.ylim()[1]],
                      mean - std, mean + std,
                      alpha=0.2, color='red')

g = sns.FacetGrid(tips, col='day', col_wrap=2,
                  height=4, aspect=1.5)
g.map(sns.histplot, 'total_bill', bins=15, kde=True)
g.map(mean_and_std, 'total_bill')
g.set_axis_labels('Total Bill ($)', 'Count')
g.set_titles('{col_name}')
g.add_legend()
plt.suptitle('FacetGrid with Mean Â± Std Overlay', y=1.02)
plt.show()
```

## 15.4 Regression Plots

### Statistical Regression Visualization

```python
# Comprehensive regression analysis
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Simple linear regression
sns.regplot(data=tips, x='total_bill', y='tip', ax=axes[0, 0],
            scatter_kws={'alpha': 0.5},
            line_kws={'color': 'red', 'linewidth': 2})
axes[0, 0].set_title('Simple Linear Regression')

# Regression with confidence interval
sns.regplot(data=tips, x='total_bill', y='tip', ax=axes[0, 1],
            scatter_kws={'alpha': 0.5, 'color': 'green'},
            line_kws={'color': 'darkgreen'},
            ci=95)
axes[0, 1].set_title('Regression with 95% CI')

# Polynomial regression
sns.regplot(data=tips, x='total_bill', y='tip', ax=axes[1, 0],
            order=2, scatter_kws={'alpha': 0.5},
            line_kws={'color': 'orange'})
axes[1, 0].set_title('Polynomial Regression (Order 2)')

# Log-transformed regression
tips['log_bill'] = np.log1p(tips['total_bill'])
sns.regplot(data=tips, x='log_bill', y='tip', ax=axes[1, 1],
            scatter_kws={'alpha': 0.5},
            line_kws={'color': 'purple'})
axes[1, 1].set_title('Log-Transformed Regression')

plt.tight_layout()
plt.show()

# Print regression statistics
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

X = tips['total_bill'].values.reshape(-1, 1)
y = tips['tip'].values

model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)

print(f"Coefficient: {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")
print(f"RÂ² Score: {r2_score(y, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y, y_pred)):.4f}")
```

```python
# Residual analysis plots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Residual plot
residuals = y - y_pred
axes[0, 0].scatter(y_pred, residuals, alpha=0.5, color='steelblue')
axes[0, 0].axhline(y=0, color='red', linestyle='--', linewidth=2)
axes[0, 0].set_xlabel('Predicted Values')
axes[0, 0].set_ylabel('Residuals')
axes[0, 0].set_title('Residual Plot')

# QQ plot
from scipy import stats
stats.probplot(residuals, dist="norm", plot=axes[0, 1])
axes[0, 1].set_title('Q-Q Plot')

# Histogram of residuals
axes[1, 0].hist(residuals, bins=20, edgecolor='black',
                color='steelblue', alpha=0.7)
axes[1, 0].axvline(x=0, color='red', linestyle='--', linewidth=2)
axes[1, 0].set_xlabel('Residuals')
axes[1, 0].set_ylabel('Frequency')
axes[1, 0].set_title('Residual Distribution')

# Scale-Location plot
sqrt_abs_residuals = np.sqrt(np.abs(residuals))
axes[1, 1].scatter(y_pred, sqrt_abs_residuals, alpha=0.5, color='green')
axes[1, 1].set_xlabel('Predicted Values')
axes[1, 1].set_ylabel('âˆš|Residuals|')
axes[1, 1].set_title('Scale-Location Plot')

plt.tight_layout()
plt.show()
```

```python
# Multiple regression with categorical variables
from sklearn.preprocessing import LabelEncoder

# Encode categorical variables
tips_encoded = tips.copy()
le = LabelEncoder()
tips_encoded['sex_encoded'] = le.fit_transform(tips_encoded['sex'])
tips_encoded['day_encoded'] = le.fit_transform(tips_encoded['day'])

# Multiple regression
from sklearn.linear_model import LinearRegression

X_multi = tips_encoded[['total_bill', 'size', 'sex_encoded', 'day_encoded']]
y_multi = tips_encoded['tip']

model_multi = LinearRegression()
model_multi.fit(X_multi, y_multi)

# Visualization
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# Actual vs Predicted
axes[0].scatter(y_multi, model_multi.predict(X_multi), alpha=0.5)
axes[0].plot([y_multi.min(), y_multi.max()],
             [y_multi.min(), y_multi.max()], 'r--', linewidth=2)
axes[0].set_xlabel('Actual Tips')
axes[0].set_ylabel('Predicted Tips')
axes[0].set_title('Actual vs Predicted')

# Feature importance
feature_importance = pd.Series(model_multi.coef_,
                                 index=X_multi.columns).sort_values()
feature_importance.plot(kind='barh', ax=axes[1], color='steelblue')
axes[1].set_title('Feature Coefficients')
axes[1].set_xlabel('Coefficient Value')

# Residual distribution
residuals_multi = y_multi - model_multi.predict(X_multi)
axes[2].hist(residuals_multi, bins=20, edgecolor='black',
             color='lightcoral', alpha=0.7)
axes[2].set_title('Multiple Regression Residuals')

plt.tight_layout()
plt.show()

print(f"RÂ² Score (Multiple): {r2_score(y_multi, model_multi.predict(X_multi)):.4f}")
```

## 15.5 Heatmap Advanced

### Advanced Heatmap Techniques

```python
# Correlation heatmap with hierarchical clustering
from scipy.cluster.hierarchy import linkage, dendrogram
from scipy.spatial.distance import squareform

# Load and prepare data
np.random.seed(42)
data = pd.DataFrame({
    f'Feature_{i}': np.random.randn(100)
    for i in range(8)
})
# Add some correlation
data['Feature_1'] = data['Feature_0'] * 0.8 + np.random.randn(100) * 0.2
data['Feature_3'] = data['Feature_2'] * -0.6 + np.random.randn(100) * 0.4

corr_matrix = data.corr()

fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Standard heatmap
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0,
            ax=axes[0], fmt='.2f', square=True,
            linewidths=0.5, linecolor='white')
axes[0].set_title('Correlation Heatmap')

# Clustered heatmap
sns.clustermap(corr_matrix, annot=True, cmap='coolwarm', center=0,
               fmt='.2f', linewidths=0.5, linecolor='white',
               figsize=(10, 10), method='ward')
plt.suptitle('Clustered Correlation Heatmap', y=1.02)
plt.show()
```

```python
# Time-based heatmap
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=365, freq='D')
hours = range(24)

# Create time-based data
heatmap_data = pd.DataFrame(
    np.random.poisson(lam=20, size=(365, 24)),
    index=dates,
    columns=[f'{h:02d}:00' for h in hours]
)

# Add daily patterns
for h in range(24):
    if 9 <= h <= 17:
        heatmap_data.iloc[:, h] *= 2
    elif h >= 22 or h <= 5:
        heatmap_data.iloc[:, h] *= 0.3

fig, axes = plt.subplots(2, 1, figsize=(16, 10))

# Monthly view
monthly_data = heatmap_data.resample('M').mean()
sns.heatmap(monthly_data.T, cmap='YlOrRd', ax=axes[0],
            xticklabels=[d.strftime('%b %Y') for d in monthly_data.index],
            cbar_kws={'label': 'Average Count'})
axes[0].set_title('Monthly Traffic Pattern (24 Hours)')
axes[0].set_ylabel('Hour of Day')

# Weekly pattern
weekly_data = heatmap_data.groupby(heatmap_data.index.dayofweek).mean()
days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
sns.heatmap(weekly_data.T, cmap='viridis', ax=axes[1],
            xticklabels=days,
            cbar_kws={'label': 'Average Count'})
axes[1].set_title('Weekly Traffic Pattern')
axes[1].set_ylabel('Hour of Day')

plt.tight_layout()
plt.show()
```

```python
# Annotated heatmap with custom formatting
fig, ax = plt.subplots(figsize=(12, 10))

# Sample data
categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys']
quarters = ['Q1', 'Q2', 'Q3', 'Q4']

data = pd.DataFrame(
    np.random.uniform(10, 100, (5, 4)),
    index=categories,
    columns=quarters
)

# Create heatmap with custom annotations
def annotate_heatmap(data, fmt='.1f', annot=True):
    """Create annotated heatmap with custom formatting."""
    sns.heatmap(data, annot=annot, fmt=fmt, cmap='RdYlGn',
                center=data.values.mean(),
                linewidths=2, linecolor='white',
                square=True, ax=ax,
                cbar_kws={'label': 'Revenue ($K)'})
    return ax

annotate_heatmap(data)
ax.set_title('Revenue by Category and Quarter', fontsize=14, pad=20)
ax.set_xlabel('Quarter', fontsize=12)
ax.set_ylabel('Product Category', fontsize=12)

plt.tight_layout()
plt.show()

# Growth rate heatmap
growth = data.pct_change(axis=1) * 100
fig, ax = plt.subplots(figsize=(12, 10))
sns.heatmap(growth, annot=True, fmt='.1f', cmap='RdYlGn',
            center=0, linewidths=2, linecolor='white',
            square=True, ax=ax,
            cbar_kws={'label': 'Growth Rate (%)'})
ax.set_title('Quarter-over-Quarter Growth Rate (%)', fontsize=14, pad=20)
plt.tight_layout()
plt.show()
```

## 15.6 Custom Seaborn Themes

### Creating Publication-Quality Visualizations

```python
# Custom seaborn themes and palettes
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib as mpl

# Custom color palette
custom_palette = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#3B1F2B']
sns.set_palette(custom_palette)

# Custom theme function
def create_custom_theme():
    """Create a custom seaborn theme."""
    theme = {
        'figure.facecolor': '#FAFAFA',
        'axes.facecolor': '#FFFFFF',
        'axes.edgecolor': '#333333',
        'axes.labelcolor': '#333333',
        'text.color': '#333333',
        'xtick.color': '#333333',
        'ytick.color': '#333333',
        'grid.color': '#E0E0E0',
        'grid.linestyle': '--',
        'font.family': 'sans-serif',
        'font.size': 12,
        'axes.titlesize': 14,
        'axes.labelsize': 12,
    }
    return theme

# Apply custom theme
plt.rcParams.update(create_custom_theme())

# Create publication-quality figures
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Styled bar chart
sns.barplot(data=tips, x='day', y='total_bill', palette=custom_palette,
            ax=axes[0], edgecolor='black', linewidth=0.5)
axes[0].set_title('Average Total Bill by Day', fontweight='bold')
axes[0].set_xlabel('Day of Week', fontweight='bold')
axes[0].set_ylabel('Total Bill ($)', fontweight='bold')
axes[0].spines['top'].set_visible(False)
axes[0].spines['right'].set_visible(False)

# Styled distribution plot
sns.kdeplot(data=tips, x='total_bill', fill=True, alpha=0.5,
            color=custom_palette[0], ax=axes[1])
sns.rugplot(data=tips, x='total_bill', color=custom_palette[1],
            ax=axes[1], height=0.05)
axes[1].set_title('Total Bill Distribution', fontweight='bold')
axes[1].spines['top'].set_visible(False)
axes[1].spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig('publication_plot.png', dpi=300, bbox_inches='tight',
            facecolor='white', edgecolor='none')
plt.show()
```

```python
# Advanced theme customization for different contexts
def set_context_theme(context='notebook', style='whitegrid'):
    """Set theme based on publication context."""
    contexts = {
        'paper': {'font_scale': 0.8},
        'notebook': {'font_scale': 1.0},
        'talk': {'font_scale': 1.2},
        'poster': {'font_scale': 1.5}
    }
    sns.set_context(context, **contexts.get(context, {}))
    sns.set_style(style)

# Example: Create poster-quality figure
set_context_theme('poster', 'whitegrid')

fig, ax = plt.subplots(figsize=(12, 8))
sns.boxplot(data=tips, x='day', y='total_bill', palette='Set2',
            width=0.6, linewidth=2, ax=ax)
sns.stripplot(data=tips, x='day', y='total_bill', color='black',
              alpha=0.3, size=8, ax=ax)
ax.set_title('Daily Bill Distribution', fontsize=24, fontweight='bold')
ax.set_xlabel('Day', fontsize=20)
ax.set_ylabel('Total Bill ($)', fontsize=20)
ax.tick_params(axis='both', labelsize=16)
plt.tight_layout()
plt.savefig('poster_plot.png', dpi=150, bbox_inches='tight')
plt.show()

# Reset to notebook defaults
set_context_theme('notebook')
```

```python
# Color palette generators and custom maps
from matplotlib.colors import LinearSegmentedColormap

# Custom diverging colormap
colors = ['#D32F2F', '#FFFFFF', '#388E3C']
n_bins = 256
cmap = LinearSegmentedColormap.from_list('custom_diverging', colors, n_bins)

# Sequential colormap
colors_seq = ['#F7FBFF', '#DEEBF7', '#C6DBEF', '#9ECAE1',
              '#6BAED6', '#4292C6', '#2171B5', '#08519C', '#08306B']
cmap_seq = LinearSegmentedColormap.from_list('custom_sequential', colors_seq)

# Apply custom colormaps
np.random.seed(42)
data = pd.DataFrame(np.random.randn(10, 10),
                     columns=[f'Col_{i}' for i in range(10)],
                     index=[f'Row_{i}' for i in range(10)])

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

sns.heatmap(data, cmap=cmap, center=0, ax=axes[0],
            annot=True, fmt='.1f')
axes[0].set_title('Custom Diverging Colormap')

sns.heatmap(data, cmap=cmap_seq, ax=axes[1],
            annot=True, fmt='.1f')
axes[1].set_title('Custom Sequential Colormap')

plt.tight_layout()
plt.show()
```

### Real-Time Use Cases for Module 15

| Use Case | Plot Type | Application |
|----------|-----------|-------------|
| A/B Test Analysis | Violin + Swarm | Compare conversion rates across variants |
| Customer Segmentation | PairGrid | Visualize feature relationships in clusters |
| Time-of-Day Analysis | Heatmap | Identify peak activity hours for resource allocation |
| Model Diagnostics | Regression Plots | Validate linear regression assumptions |
| Survey Results | FacetGrid | Analyze responses across demographic groups |
| Quality Control | Boxen Plot | Monitor manufacturing process variations |
| Medical Research | Statistical Plots | Compare treatment effects with significance |

### Module 15 Project Ideas

| Project | Description | Libraries |
|---------|-------------|-----------|
| **E-commerce Analytics** | Customer behavior analysis with distribution plots, correlation heatmaps, and statistical tests | Seaborn, SciPy, Pandas |
| **Model Evaluation Dashboard** | Regression diagnostics with residual analysis, Q-Q plots, and feature importance | Seaborn, Scikit-learn |
| **Survey Data Explorer** | Multi-faceted survey analysis with FacetGrid, categorical comparisons, and statistical annotations | Seaborn, Statsmodels |
| **Financial Risk Analysis** | Return distribution analysis, correlation clustering, and volatility heatmaps | Seaborn, NumPy, Pandas |
| **Scientific Publication Plots** | Create publication-quality figures with custom themes, annotations, and export formats | Seaborn, Matplotlib |

---

# MODULE 16: GEOSPATIAL & NETWORK VISUALIZATION

## 16.1 Folium Maps

### Interactive Web Maps with Folium

```python
import folium
from folium import plugins
import pandas as pd
import numpy as np

# Create a basic map
m = folium.Map(location=[1.3521, 103.8198],  # Singapore
               zoom_start=12,
               tiles='OpenStreetMap')

# Add markers for key locations
locations = [
    {"name": "Marina Bay", "lat": 1.2816, "lon": 103.8636,
     "popup": "Marina Bay Sands", "icon": "building"},
    {"name": "Orchard Road", "lat": 1.3048, "lon": 103.8318,
     "popup": "Shopping District", "icon": "shopping-cart"},
    {"name": "Sentosa", "lat": 1.2494, "lon": 103.8303,
     "popup": "Island Resort", "icon": "umbrella-beach"},
    {"name": "Changi Airport", "lat": 1.3644, "lon": 103.9915,
     "popup": "International Airport", "icon": "plane"},
]

icon_map = {
    "building": "building",
    "shopping-cart": "shopping-cart",
    "umbrella-beach": "umbrella-beach",
    "plane": "plane"
}

for loc in locations:
    folium.Marker(
        location=[loc["lat"], loc["lon"]],
        popup=f"<b>{loc['name']}</b><br>{loc['popup']}",
        tooltip=loc["name"],
        icon=folium.Icon(color="red", icon="info-sign",
                        prefix="glyphicon")
    ).add_to(m)

# Add circle markers with size based on importance
np.random.seed(42)
for i in range(50):
    folium.CircleMarker(
        location=[1.35 + np.random.normal(0, 0.05),
                  103.82 + np.random.normal(0, 0.05)],
        radius=np.random.randint(5, 20),
        popup=f"Location {i}",
        color='blue',
        fill=True,
        fill_color='lightblue',
        fill_opacity=0.7
    ).add_to(m)

# Save map
m.save('singapore_map.html')
print("Map saved as singapore_map.html")
m
```

```python
# Folium with heatmaps and plugins
m = folium.Map(location=[1.3521, 103.8198], zoom_start=12)

# Generate sample data for heatmap
np.random.seed(42)
heat_data = [[1.35 + np.random.normal(0, 0.03),
              103.82 + np.random.normal(0, 0.03)]
             for _ in range(1000)]

# Add heatmap
plugins.HeatMap(heat_data, name="Heatmap",
                min_opacity=0.3,
                max_zoom=18,
                radius=15).add_to(m)

# Add marker cluster for dense data
from folium.plugins import MarkerCluster

marker_cluster = MarkerCluster(name="Locations").add_to(m)

for i in range(200):
    folium.Marker(
        location=[1.35 + np.random.normal(0, 0.03),
                  103.82 + np.random.normal(0, 0.03)],
        popup=f"Point {i}",
        icon=None
    ).add_to(marker_cluster)

# Add fullscreen button
plugins.Fullscreen().add_to(m)

# Add minimap
plugins.MiniMap(toggle_display=True).add_to(m)

# Add layer control
folium.LayerControl().add_to(m)

m.save('heatmap_map.html')
m
```

```python
# Folium with GeoJSON and Choropleth
import json

# Sample GeoJSON data (simplified)
geojson_data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": "Region A", "value": 85},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[103.8, 1.3], [103.9, 1.3],
                                 [103.9, 1.4], [103.8, 1.4],
                                 [103.8, 1.3]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Region B", "value": 65},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[103.7, 1.3], [103.8, 1.3],
                                 [103.8, 1.4], [103.7, 1.4],
                                 [103.7, 1.3]]]
            }
        }
    ]
}

m = folium.Map(location=[1.35, 103.85], zoom_start=11)

# Add choropleth layer
folium.Choropleth(
    geo_data=geojson_data,
    data=pd.DataFrame({
        'name': ['Region A', 'Region B'],
        'value': [85, 65]
    }),
    columns=['name', 'value'],
    key_on='feature.properties.name',
    fill_color='YlOrRd',
    fill_opacity=0.7,
    line_opacity=0.3,
    legend_name='Performance Score'
).add_to(m)

m.save('choropleth_map.html')
m
```

## 16.2 Plotly Geo

### Advanced Geospatial Visualizations with Plotly

```python
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Scatter on mapbox
np.random.seed(42)
n_points = 500
map_df = pd.DataFrame({
    'lat': np.random.uniform(1.2, 1.45, n_points),
    'lon': np.random.uniform(103.7, 104.0, n_points),
    'value': np.random.uniform(10, 100, n_points),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n_points),
    'city': np.random.choice(['Central', 'East', 'West', 'North'], n_points)
})

fig = px.scatter_mapbox(map_df, lat='lat', lon='lon',
                        color='category', size='value',
                        hover_name='city',
                        color_discrete_sequence=px.colors.qualitative.Vivid,
                        zoom=10, center={'lat': 1.35, 'lon': 103.85},
                        mapbox_style='carto-positron',
                        title='Singapore Locations - Scatter Map')
fig.update_layout(height=600)
fig.show()
```

```python
# Heatmap on mapbox
fig = px.density_mapbox(map_df, lat='lat', lon='lon', z='value',
                        radius=15,
                        center={'lat': 1.35, 'lon': 103.85},
                        zoom=11,
                        mapbox_style='carto-darkmatter',
                        color_continuous_scale='Viridis',
                        title='Density Heatmap - Singapore')
fig.update_layout(height=600)
fig.show()
```

```python
# Choropleth map with Plotly
# World data
world_data = px.data.gapminder().query('year == 2007')

fig = px.choropleth(world_data, locations='iso_alpha',
                    color='lifeExp',
                    hover_name='country',
                    color_continuous_scale='Plasma',
                    title='Global Life Expectancy (2007)',
                    projection='natural earth')
fig.update_layout(height=600)
fig.show()

# Animated choropleth
gapminder = px.data.gapminder()
fig = px.choropleth(gapminder, locations='iso_alpha',
                    color='gdpPercap',
                    hover_name='country',
                    animation_frame='year',
                    color_continuous_scale='RdYlBu',
                    range_color=[0, 50000],
                    title='Global GDP per Capita Evolution')
fig.update_layout(height=600)
fig.show()
```

```python
# Multiple layers with mapbox
fig = go.Figure()

# Add scatter layer
fig.add_trace(go.Scattermapbox(
    lat=map_df['lat'], lon=map_df['lon'],
    mode='markers',
    marker=dict(size=map_df['value']/5, color=map_df['value'],
                colorscale='Viridis'),
    text=map_df['city'],
    name='Locations'
))

# Add line layer (routes)
fig.add_trace(go.Scattermapbox(
    lat=[1.35, 1.28, 1.32], lon=[103.82, 103.86, 103.80],
    mode='lines+markers',
    line=dict(width=3, color='red'),
    marker=dict(size=12),
    name='Route'
))

fig.update_layout(
    mapbox=dict(
        style='open-street-map',
        center=dict(lat=1.35, lon=103.85),
        zoom=11
    ),
    title='Multi-Layer Map',
    height=600
)
fig.show()
```

## 16.3 NetworkX Graphs

### Network Analysis and Visualization

```python
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

# Create a social network
G = nx.Graph()

# Add nodes with attributes
users = {
    'Alice': {'age': 28, 'dept': 'Engineering', 'influence': 85},
    'Bob': {'age': 35, 'dept': 'Marketing', 'influence': 72},
    'Charlie': {'age': 31, 'dept': 'Engineering', 'influence': 90},
    'Diana': {'age': 29, 'dept': 'Sales', 'influence': 65},
    'Eve': {'age': 33, 'dept': 'Engineering', 'influence': 88},
    'Frank': {'age': 27, 'dept': 'Marketing', 'influence': 70},
    'Grace': {'age': 36, 'dept': 'Sales', 'influence': 78},
    'Hank': {'age': 30, 'dept': 'Engineering', 'influence': 82},
}

for user, attrs in users.items():
    G.add_node(user, **attrs)

# Add edges with weights
connections = [
    ('Alice', 'Bob', 8), ('Alice', 'Charlie', 9),
    ('Alice', 'Eve', 7), ('Bob', 'Frank', 6),
    ('Bob', 'Diana', 5), ('Charlie', 'Eve', 9),
    ('Charlie', 'Hank', 8), ('Diana', 'Grace', 7),
    ('Eve', 'Hank', 8), ('Frank', 'Grace', 6),
    ('Grace', 'Hank', 5), ('Frank', 'Bob', 7),
]

for u, v, w in connections:
    G.add_edge(u, v, weight=w)

# Visualize the network
fig, axes = plt.subplots(1, 2, figsize=(16, 7))

# Spring layout
pos_spring = nx.spring_layout(G, k=2, seed=42)
node_sizes = [G.nodes[n]['influence'] * 30 for n in G.nodes()]
node_colors = [G.nodes[n]['influence'] for n in G.nodes()]
edge_weights = [G[u][v]['weight'] for u, v in G.edges()]

nx.draw_networkx_nodes(G, pos_spring, ax=axes[0],
                       node_size=node_sizes,
                       node_color=node_colors,
                       cmap='viridis',
                       alpha=0.8)
nx.draw_networkx_edges(G, pos_spring, ax=axes[0],
                       width=edge_weights,
                       alpha=0.5,
                       edge_color='gray')
nx.draw_networkx_labels(G, pos_spring, ax=axes[0],
                        font_size=10, font_weight='bold')
axes[0].set_title('Social Network - Spring Layout', fontsize=14)
axes[0].axis('off')

# Circular layout
pos_circular = nx.circular_layout(G)
nx.draw_networkx(G, pos_circular, ax=axes[1],
                 node_size=800,
                 node_color=[G.nodes[n]['age'] for n in G.nodes()],
                 cmap='coolwarm',
                 with_labels=True,
                 font_size=10)
axes[1].set_title('Social Network - Circular Layout', fontsize=14)
axes[1].axis('off')

plt.tight_layout()
plt.show()

# Print network statistics
print("Network Statistics:")
print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print(f"Density: {nx.density(G):.3f}")
print(f"Average Clustering: {nx.average_clustering(G):.3f}")
```

```python
# Advanced network analysis and visualization
# Create directed graph (communication network)
DG = nx.DiGraph()

# Add nodes
for user in users:
    DG.add_node(user, **users[user])

# Add directed edges (communication flow)
communications = [
    ('Alice', 'Bob', 15), ('Alice', 'Charlie', 25),
    ('Bob', 'Alice', 10), ('Bob', 'Frank', 12),
    ('Charlie', 'Eve', 30), ('Charlie', 'Hank', 20),
    ('Diana', 'Grace', 18), ('Eve', 'Alice', 22),
    ('Eve', 'Hank', 28), ('Frank', 'Bob', 14),
    ('Grace', 'Diana', 16), ('Hank', 'Charlie', 24),
]

for u, v, w in communications:
    DG.add_edge(u, v, weight=w)

# Calculate centrality measures
degree_centrality = nx.degree_centrality(DG)
betweenness_centrality = nx.betweenness_centrality(DG)
closeness_centrality = nx.closeness_centrality(DG)
pagerank = nx.pagerank(DG)

fig, axes = plt.subplots(2, 2, figsize=(14, 12))

# Degree centrality
pos = nx.spring_layout(DG, seed=42)
node_sizes = [v * 2000 for v in degree_centrality.values()]
nx.draw(DG, pos, ax=axes[0, 0], node_size=node_sizes,
        node_color=list(degree_centrality.values()),
        cmap='YlOrRd', with_labels=True, font_size=10,
        edge_color='gray', alpha=0.8)
axes[0, 0].set_title('Degree Centrality')
axes[0, 0].axis('off')

# Betweenness centrality
node_sizes = [v * 3000 for v in betweenness_centrality.values()]
nx.draw(DG, pos, ax=axes[0, 1], node_size=node_sizes,
        node_color=list(betweenness_centrality.values()),
        cmap='Blues', with_labels=True, font_size=10,
        edge_color='gray', alpha=0.8)
axes[0, 1].set_title('Betweenness Centrality')
axes[0, 1].axis('off')

# PageRank
node_sizes = [v * 5000 for v in pagerank.values()]
nx.draw(DG, pos, ax=axes[1, 0], node_size=node_sizes,
        node_color=list(pagerank.values()),
        cmap='Greens', with_labels=True, font_size=10,
        edge_color='gray', alpha=0.8)
axes[1, 0].set_title('PageRank')
axes[1, 0].axis('off')

# Weighted edges visualization
edge_widths = [DG[u][v]['weight'] / 5 for u, v in DG.edges()]
nx.draw(DG, pos, ax=axes[1, 1], node_size=800,
        node_color='lightblue',
        width=edge_widths, with_labels=True,
        font_size=10, edge_color='steelblue',
        alpha=0.8, arrows=True, arrowsize=20)
axes[1, 1].set_title('Communication Weight')
axes[1, 1].axis('off')

plt.tight_layout()
plt.show()

# Print centrality metrics
print("Centrality Metrics:")
print("-" * 50)
for node in DG.nodes():
    print(f"{node:10} | Degree: {degree_centrality[node]:.3f} | "
          f"Between: {betweenness_centrality[node]:.3f} | "
          f"PageRank: {pagerank[node]:.3f}")
```

```python
# Community detection and visualization
from networkx.algorithms import community

# Convert to undirected for community detection
G_undirected = G.to_undirected()

# Louvain community detection
communities = community.louvain_communities(G_undirected, seed=42)

# Create community color mapping
community_map = {}
colors = plt.cm.Set3(np.linspace(0, 1, len(communities)))
for i, comm in enumerate(communities):
    for node in comm:
        community_map[node] = colors[i]

fig, ax = plt.subplots(figsize=(12, 10))

# Spring layout with community-based coloring
pos = nx.spring_layout(G_undirected, k=2, seed=42)
node_colors = [community_map[n] for n in G_undirected.nodes()]
node_sizes = [pagerank[n] * 3000 for n in G_undirected.nodes()]

# Draw edges with varying opacity based on weight
edge_weights = [G_undirected[u][v]['weight'] for u, v in G_undirected.edges()]
max_weight = max(edge_weights)
edge_alphas = [w / max_weight for w in edge_weights]

nx.draw_networkx_edges(G_undirected, pos, ax=ax,
                       width=edge_weights,
                       alpha=0.3,
                       edge_color='gray')

# Draw nodes
nx.draw_networkx_nodes(G_undirected, pos, ax=ax,
                       node_size=node_sizes,
                       node_color=node_colors,
                       alpha=0.9)

# Draw labels
nx.draw_networkx_labels(G_undirected, pos, ax=ax,
                        font_size=12, font_weight='bold')

# Add legend for communities
from matplotlib.lines import Line2D
legend_elements = [Line2D([0], [0], marker='o', color='w',
                          markerfacecolor=colors[i],
                          markersize=15, label=f'Community {i+1}')
                   for i in range(len(communities))]
ax.legend(handles=legend_elements, loc='upper left',
          title='Communities', fontsize=10)

ax.set_title('Community Detection (Louvain Method)', fontsize=14)
ax.axis('off')
plt.tight_layout()
plt.show()

print(f"Number of communities: {len(communities)}")
for i, comm in enumerate(communities):
    print(f"Community {i+1}: {', '.join(comm)}")
```

## 16.4 Choropleth Maps

### Advanced Geographic Data Visualization

```python
import plotly.express as px
import pandas as pd
import numpy as np

# State-level choropleth (US example)
np.random.seed(42)
us_states = {
    'CA': 'California', 'TX': 'Texas', 'NY': 'New York',
    'FL': 'Florida', 'IL': 'Illinois', 'PA': 'Pennsylvania',
    'OH': 'Ohio', 'GA': 'Georgia', 'NC': 'North Carolina',
    'MI': 'Michigan', 'NJ': 'New Jersey', 'VA': 'Virginia',
    'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts'
}

state_data = pd.DataFrame({
    'state': list(us_states.keys()),
    'state_name': list(us_states.values()),
    'population': np.random.randint(5000000, 40000000, len(us_states)),
    'gdp': np.random.uniform(200, 500, len(us_states)),
    'unemployment': np.random.uniform(3, 8, len(us_states)),
    'growth': np.random.uniform(-2, 8, len(us_states))
})

fig = px.choropleth(state_data,
                    locations='state',
                    locationmode='USA-states',
                    color='gdp',
                    hover_name='state_name',
                    hover_data=['population', 'unemployment', 'growth'],
                    color_continuous_scale='Viridis',
                    scope='usa',
                    title='US State GDP per Capita ($K)',
                    labels={'gdp': 'GDP ($K)'})
fig.update_layout(height=600)
fig.show()
```

```python
# Multi-layer choropleth with Plotly
fig = go.Figure()

# Add choropleth layer
fig.add_trace(go.Choropleth(
    locations=state_data['state'],
    z=state_data['gdp'],
    locationmode='USA-states',
    colorscale='Reds',
    colorbar_title="GDP ($K)",
    name='GDP',
    hovertemplate='<b>%{hovertext}</b><br>GDP: $%{z}K<extra></extra>',
    hovertext=state_data['state_name']
))

# Add scatter markers for major cities
cities = pd.DataFrame({
    'city': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'lat': [40.71, 34.05, 41.88, 29.76, 33.45],
    'lon': [-74.01, -118.24, -87.63, -95.37, -112.07],
    'population': [8.3, 3.9, 2.7, 2.3, 1.6]
})

fig.add_trace(go.Scattergeo(
    locations=cities['lat'],
    lat=cities['lat'],
    lon=cities['lon'],
    text=cities['city'],
    mode='markers+text',
    marker=dict(size=cities['population'] * 5,
                color='blue', opacity=0.6),
    textposition='top center',
    name='Major Cities'
))

fig.update_layout(
    geo=dict(scope='usa', showlakes=True, lakecolor='rgb(255, 255, 255)'),
    title='US GDP and Major Cities',
    height=600
)
fig.show()
```

```python
# Global choropleth with animation
import plotly.express as px

# World data
world_gdp = px.data.gapminder()

fig = px.choropleth(world_gdp,
                    locations='iso_alpha',
                    color='gdpPercap',
                    hover_name='country',
                    hover_data=['continent', 'lifeExp', 'pop'],
                    animation_frame='year',
                    color_continuous_scale='RdYlBu',
                    range_color=[0, 50000],
                    title='Global GDP per Capita Evolution (1952-2007)',
                    labels={'gdpPercap': 'GDP/Capita ($)'})
fig.update_layout(height=600)
fig.show()
```

## 16.5 Heatmaps on Maps

### Geographic Density Visualizations

```python
import folium
from folium.plugins import HeatMap, HeatMapWithTime
import pandas as pd
import numpy as np

# Create base map
m = folium.Map(location=[1.3521, 103.8198], zoom_start=12)

# Generate realistic data points
np.random.seed(42)
n_points = 500

# Create clustered data
centers = [(1.35, 103.85), (1.30, 103.80), (1.38, 103.90)]
data_points = []
for center in centers:
    for _ in range(n_points // 3):
        lat = center[0] + np.random.normal(0, 0.02)
        lon = center[1] + np.random.normal(0, 0.02)
        data_points.append([lat, lon, np.random.uniform(0.5, 1.0)])

# Add heatmap layer
HeatMap(data_points,
        name="Activity Heatmap",
        min_opacity=0.3,
        max_zoom=18,
        radius=20,
        gradient={0.2: 'blue', 0.4: 'lime', 0.6: 'yellow', 0.8: 'orange', 1: 'red'}
).add_to(m)

# Add time-based heatmap
np.random.seed(42)
hours_data = []
for hour in range(24):
    hour_points = []
    for center in centers:
        # Adjust density based on time of day
        if 9 <= hour <= 17:  # Business hours
            density = 100
        elif 18 <= hour <= 22:  # Evening
            density = 50
        else:  # Night
            density = 10

        for _ in range(density):
            lat = center[0] + np.random.normal(0, 0.03)
            lon = center[1] + np.random.normal(0, 0.03)
            hour_points.append([lat, lon])
    hours_data.append(hour_points)

# Add time heatmap
HeatMapWithTime(hours_data,
                name="Hourly Activity",
                auto_play=True,
                max_opacity=0.8,
                use_local_extrema=True).add_to(m)

# Add layer control
folium.LayerControl().add_to(m)

m.save('heatmaps_on_map.html')
m
```

```python
# Plotly heatmap on mapbox with multiple layers
import plotly.graph_objects as go
import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

# Generate data with different categories
categories = ['Residential', 'Commercial', 'Industrial', 'Recreation']
cat_data = []
for cat in categories:
    center_lat = 1.35 + np.random.uniform(-0.05, 0.05)
    center_lon = 103.85 + np.random.uniform(-0.05, 0.05)
    for _ in range(n // 4):
        cat_data.append({
            'lat': center_lat + np.random.normal(0, 0.02),
            'lon': center_lon + np.random.normal(0, 0.02),
            'category': cat,
            'value': np.random.uniform(10, 100)
        })

df = pd.DataFrame(cat_data)

fig = go.Figure()

# Add density heatmap
fig.add_trace(go.Densitymapbox(
    lat=df['lat'], lon=df['lon'], z=df['value'],
    radius=15,
    colorscale='Viridis',
    showscale=True,
    colorbar=dict(title='Value')
))

# Add scatter markers
for cat in categories:
    cat_df = df[df['category'] == cat]
    fig.add_trace(go.Scattermapbox(
        lat=cat_df['lat'][:20],  # Show subset for clarity
        lon=cat_df['lon'][:20],
        mode='markers',
        marker=dict(size=8),
        text=cat_df['category'][:20],
        name=cat
    ))

fig.update_layout(
    mapbox=dict(
        style='carto-positron',
        center=dict(lat=1.35, lon=103.85),
        zoom=11
    ),
    title='Multi-Layer Geographic Visualization',
    height=600
)
fig.show()
```

## 16.6 Interactive Geospatial Dashboards

### Building Complete Geospatial Applications

```python
# Complete geospatial dashboard with Plotly Dash
import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

app = dash.Dash(__name__)

# Generate sample data
np.random.seed(42)
locations_df = pd.DataFrame({
    'location_id': range(100),
    'lat': np.random.uniform(40.7, 40.8, 100),
    'lon': np.random.uniform(-74.0, -73.9, 100),
    'category': np.random.choice(['Store', 'Warehouse', 'Office', 'Hub'], 100),
    'revenue': np.random.uniform(10000, 500000, 100),
    'employees': np.random.randint(5, 200, 100)
})

app.layout = html.Div([
    html.H1("Geospatial Analytics Dashboard"),

    html.Div([
        html.Div([
            html.Label("Category Filter"),
            dcc.Dropdown(
                id='category-filter',
                options=[{'label': c, 'value': c}
                         for c in locations_df['category'].unique()],
                multi=True,
                value=locations_df['category'].unique().tolist()
            )
        ], style={'width': '30%', 'display': 'inline-block'}),

        html.Div([
            html.Label("Revenue Range"),
            dcc.RangeSlider(
                id='revenue-slider',
                min=locations_df['revenue'].min(),
                max=locations_df['revenue'].max(),
                value=[locations_df['revenue'].min(),
                       locations_df['revenue'].max()],
                marks={int(v): f'${v/1000:.0f}K'
                       for v in np.linspace(
                           locations_df['revenue'].min(),
                           locations_df['revenue'].max(), 5)}
            )
        ], style={'width': '60%', 'display': 'inline-block'})
    ]),

    dcc.Graph(id='main-map', style={'height': '60vh'}),

    html.Div([
        html.Div([dcc.Graph(id='category-chart')], style={'width': '50%'}),
        html.Div([dcc.Graph(id='revenue-chart')], style={'width': '50%'})
    ], style={'display': 'flex'})
])

@app.callback(
    [Output('main-map', 'figure'),
     Output('category-chart', 'figure'),
     Output('revenue-chart', 'figure')],
    [Input('category-filter', 'value'),
     Input('revenue-slider', 'value')]
)
def update_dashboard(categories, revenue_range):
    filtered = locations_df[
        (locations_df['category'].isin(categories)) &
        (locations_df['revenue'] >= revenue_range[0]) &
        (locations_df['revenue'] <= revenue_range[1])
    ]

    # Main map
    map_fig = px.scatter_mapbox(
        filtered, lat='lat', lon='lon',
        color='category', size='revenue',
        hover_name='category',
        hover_data=['revenue', 'employees'],
        zoom=11, center={'lat': 40.75, 'lon': -73.95},
        mapbox_style='carto-positron',
        title='Location Overview'
    )

    # Category chart
    cat_fig = px.bar(
        filtered.groupby('category')['revenue'].sum().reset_index(),
        x='category', y='revenue',
        color='category', title='Revenue by Category'
    )

    # Revenue distribution
    rev_fig = px.histogram(
        filtered, x='revenue', nbins=20,
        color='category', title='Revenue Distribution'
    )

    return map_fig, cat_fig, rev_fig

if __name__ == '__main__':
    app.run(debug=True, port=8052)
```

```python
# Streamlit geospatial dashboard
import streamlit as st
import plotly.express as px
import pandas as pd
import numpy as np
import pydeck as pdk

st.set_page_config(layout="wide")
st.title("Geospatial Analytics Platform")

# Sidebar filters
st.sidebar.header("Filters")
map_style = st.sidebar.selectbox("Map Style",
                                    ["Satellite", "Streets", "Outdoor"])
show_heatmap = st.sidebar.checkbox("Show Heatmap", True)
point_size = st.sidebar.slider("Point Size", 50, 500, 200)

# Generate data
@st.cache_data
def generate_data():
    np.random.seed(42)
    return pd.DataFrame({
        'lat': np.random.uniform(40.7, 40.8, 500),
        'lon': np.random.uniform(-74.0, -73.9, 500),
        'value': np.random.uniform(10, 100, 500),
        'category': np.random.choice(['A', 'B', 'C', 'D'], 500)
    })

df = generate_data()

# Main map
col1, col2 = st.columns([3, 1])

with col1:
    if show_heatmap:
        layer = pdk.Layer(
            "HeatmapLayer",
            data=df,
            get_position='[lon, lat]',
            get_weight='value',
            radiusPixels=60
        )
    else:
        layer = pdk.Layer(
            "ScatterplotLayer",
            data=df,
            get_position='[lon, lat]',
            get_radius=point_size,
            get_fill_color='[255, 100, 100, 160]'
        )

    view_state = pdk.ViewState(
        latitude=df['lat'].mean(),
        longitude=df['lon'].mean(),
        zoom=12
    )

    st.pydeck_chart(pdk.Deck(
        layers=[layer],
        initial_view_state=view_state,
        map_style="mapbox://styles/mapbox/dark-v10"
    ))

with col2:
    st.metric("Total Points", len(df))
    st.metric("Average Value", f"{df['value'].mean():.1f}")
    st.metric("Max Value", f"{df['value'].max():.1f}")

    st.subheader("Category Breakdown")
    st.bar_chart(df['category'].value_counts())

# Detailed view
st.subheader("Data Explorer")
with st.expander("View Raw Data"):
    st.dataframe(df, use_container_width=True)

# Download button
csv = df.to_csv(index=False)
st.download_button("Download Data", csv, "data.csv", "text/csv")
```

### Real-Time Use Cases for Module 16

| Use Case | Library | Description |
|----------|---------|-------------|
| Delivery Route Optimization | Folium + NetworkX | Visualize optimal delivery routes and driver locations |
| Real Estate Market Analysis | Plotly Geo | Property value choropleth with interactive filters |
| Network Infrastructure | NetworkX | Visualize and analyze network topology and bottlenecks |
| Emergency Response Dashboard | Folium + Dash | Real-time incident location tracking and resource deployment |
| Supply Chain Visualization | Plotly + NetworkX | Track shipments and analyze supply chain networks |
| Urban Planning | Plotly Geo | Population density and infrastructure planning maps |
| Social Media Analysis | NetworkX | Visualize user connections and influence networks |

### Module 16 Project Ideas

| Project | Description | Libraries |
|---------|-------------|-----------|
| **Delivery Fleet Tracker** | Real-time driver location visualization with route optimization and ETA calculations | Folium, Dash, NetworkX |
| **Urban Analytics Platform** | City-wide data visualization combining demographics, traffic, and infrastructure | Plotly Geo, Streamlit, Pandas |
| **Social Network Analyzer** | Analyze and visualize social media connections, influence, and community detection | NetworkX, Plotly, Matplotlib |
| **Real Estate Dashboard** | Interactive property search with geographic visualization and market analysis | Plotly Geo, Dash, Pandas |
| **Disaster Response Map** | Emergency coordination dashboard with resource allocation and evacuation routes | Folium, Plotly, NetworkX |
| **Climate Change Visualizer** | Global temperature and emissions data with animated choropleth maps | Plotly Geo, Pandas, NumPy |

---

# COURSE 2 COMPLETION

## Summary of Tools and Libraries

| Category | Tools | Primary Use |
|----------|-------|-------------|
| Interactive Charts | Plotly Express, Plotly Graph Objects | Web-based interactive visualizations |
| Dashboards | Dash, Streamlit | Production dashboard applications |
| Statistical Viz | Seaborn, Matplotlib | Statistical analysis and publication plots |
| Geospatial | Folium, Plotly Geo, PyDeck | Map-based visualizations |
| Networks | NetworkX | Graph and network analysis |

## Key Takeaways

1. **Plotly** excels at interactive, web-ready visualizations with minimal code
2. **Streamlit** is ideal for rapid prototyping; **Dash** for production-grade applications
3. **Seaborn** provides statistical visualization with beautiful defaults
4. **Geospatial libraries** enable location-based insights and spatial analysis
5. **NetworkX** reveals relationships and structures in connected data

## Next Steps
- **Course 3:** Advanced Machine Learning with Python
- Build portfolio projects combining visualization with ML
- Contribute to open-source visualization projects
- Explore specialized libraries (Altair, Bokeh, Vega-Lite)

---
# END OF COURSE 2: DATA VISUALIZATION WITH PYTHON


---


# COURSE 3: MACHINE LEARNING WITH PYTHON

---

## COURSE OVERVIEW

Master the complete machine learning pipeline with Pythonâ€”from advanced classification algorithms to real-world model deployment. This course bridges theoretical foundations with production-grade implementations using scikit-learn, TensorFlow, and modern MLOps practices.

---

# MODULE 17: ADVANCED CLASSIFICATION ALGORITHMS

---

## Learning Objectives
- Understand and implement Support Vector Machines with kernel tricks
- Master Decision Tree pruning and ensemble methods
- Implement XGBoost and LightGBM for high-performance classification
- Apply model calibration and multi-class strategies

---

### Section 17.1: SVM (Support Vector Machines)

Support Vector Machines find the optimal hyperplane that maximizes the margin between classes. They excel in high-dimensional spaces and are effective when the number of dimensions exceeds the number of samples.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVC
from sklearn.datasets import make_moons, make_circles
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, decision_function
from sklearn.pipeline import Pipeline

X, y = make_moons(n_samples=300, noise=0.2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

linear_svm = SVC(kernel='linear', C=1.0, random_state=42)
linear_svm.fit(X_train_scaled, y_train)
print(f"Linear SVM Accuracy: {linear_svm.score(X_test_scaled, y_test):.4f}")

rbf_svm = SVC(kernel='rbf', C=10.0, gamma='scale', random_state=42)
rbf_svm.fit(X_train_scaled, y_train)
print(f"RBF SVM Accuracy: {rbf_svm.score(X_test_scaled, y_test):.4f}")

poly_svm = SVC(kernel='poly', degree=3, C=1.0, random_state=42)
poly_svm.fit(X_train_scaled, y_train)
print(f"Polynomial SVM Accuracy: {poly_svm.score(X_test_scaled, y_test):.4f}")

param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.01, 0.1, 1],
    'kernel': ['rbf', 'poly']
}

grid_search = GridSearchCV(SVC(random_state=42), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)
print(f"\nBest Parameters: {grid_search.best_params_}")
print(f"Best CV Accuracy: {grid_search.best_score_:.4f}")

y_pred = grid_search.best_estimator_.predict(X_test_scaled)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

def plot_svm_decision_boundary(model, X, y, title):
    h = 0.02
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    plt.contourf(xx, yy, Z, alpha=0.8, cmap=plt.cm.RdYlBu)
    plt.scatter(X[:, 0], X[:, 1], c=y, edgecolors='k', cmap=plt.cm.RdYlBu)
    plt.title(title)
    plt.xlabel('Feature 1')
    plt.ylabel('Feature 2')

plt.figure(figsize=(15, 4))
plt.subplot(131)
plot_svm_decision_boundary(linear_svm, X_test_scaled, y_test, 'Linear Kernel')
plt.subplot(132)
plot_svm_decision_boundary(rbf_svm, X_test_scaled, y_test, 'RBF Kernel')
plt.subplot(133)
plot_svm_decision_boundary(poly_svm, X_test_scaled, y_test, 'Polynomial Kernel')
plt.tight_layout()
plt.show()
```

---

### Section 17.2: Decision Trees & Pruning

Decision Trees split data based on feature thresholds to maximize information gain. Pruning prevents overfitting by removing branches that provide little predictive power.

```python
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.datasets import load_breast_cancer
import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

dt_full = DecisionTreeClassifier(random_state=42)
dt_full.fit(X_train, y_train)
print(f"Full Tree Depth: {dt_full.get_depth()}")
print(f"Full Tree Accuracy: {dt_full.score(X_test, y_test):.4f}")

dt_pruned = DecisionTreeClassifier(max_depth=5, min_samples_split=10, 
                                    min_samples_leaf=5, random_state=42)
dt_pruned.fit(X_train, y_train)
print(f"Pruned Tree Depth: {dt_pruned.get_depth()}")
print(f"Pruned Tree Accuracy: {dt_pruned.score(X_test, y_test):.4f}")

ccp_path = dt_full.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = ccp_path.ccp_alphas

pruned_trees = []
for alpha in ccp_alphas:
    tree = DecisionTreeClassifier(ccp_alpha=alpha, random_state=42)
    tree.fit(X_train, y_train)
    pruned_trees.append(tree)

train_scores = [t.score(X_train, y_train) for t in pruned_trees]
test_scores = [t.score(X_test, y_test) for t in pruned_trees]

optimal_idx = np.argmax(test_scores)
optimal_alpha = ccp_alphas[optimal_idx]
print(f"\nOptimal CCP Alpha: {optimal_alpha:.6f}")
print(f"Optimal Pruned Accuracy: {test_scores[optimal_idx]:.4f}")

plt.figure(figsize=(10, 6))
plt.plot(ccp_alphas, train_scores, marker='o', label='Train', drawstyle='steps-post')
plt.plot(ccp_alphas, test_scores, marker='o', label='Test', drawstyle='steps-post')
plt.xlabel('Alpha')
plt.ylabel('Accuracy')
plt.title('Accuracy vs Alpha for Training and Testing Sets')
plt.legend()
plt.grid(True)
plt.show()

print("\nPruned Tree Rules:")
print(export_text(dt_pruned, feature_names=list(data.feature_names[:5])))

plt.figure(figsize=(20, 10))
plot_tree(dt_pruned, feature_names=data.feature_names, class_names=data.target_names,
          filled=True, rounded=True, max_depth=3)
plt.title("Pruned Decision Tree (First 3 Levels)")
plt.show()
```

---

### Section 17.3: XGBoost & LightGBM

Gradient Boosting machines build sequential trees where each new tree corrects errors of the previous ensemble. XGBoost and LightGBM are optimized implementations with regularization and efficient handling of large datasets.

```python
import xgboost as xgb
import lightgbm as lgb
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
from sklearn.metrics import roc_auc_score, roc_curve

data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

xgb_clf = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42,
    eval_metric='logloss'
)
xgb_clf.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

lgb_clf = lgb.LGBMClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42,
    verbose=-1
)
lgb_clf.fit(X_train, y_train)

xgb_pred = xgb_clf.predict(X_test)
xgb_prob = xgb_clf.predict_proba(X_test)[:, 1]
lgb_pred = lgb_clf.predict(X_test)
lgb_prob = lgb_clf.predict_proba(X_test)[:, 1]

print("XGBoost Results:")
print(f"Accuracy: {accuracy_score(y_test, xgb_pred):.4f}")
print(f"AUC-ROC: {roc_auc_score(y_test, xgb_prob):.4f}")

print("\nLightGBM Results:")
print(f"Accuracy: {accuracy_score(y_test, lgb_pred):.4f}")
print(f"AUC-ROC: {roc_auc_score(y_test, lgb_prob):.4f}")

xgb_cv_scores = cross_val_score(xgb_clf, X, y, cv=5, scoring='accuracy')
lgb_cv_scores = cross_val_score(lgb_clf, X, y, cv=5, scoring='accuracy')
print(f"\nXGBoost CV Accuracy: {xgb_cv_scores.mean():.4f} (+/- {xgb_cv_scores.std():.4f})")
print(f"LightGBM CV Accuracy: {lgb_cv_scores.mean():.4f} (+/- {lgb_cv_scores.std():.4f})")

feature_importance = pd.DataFrame({
    'feature': X.columns,
    'xgb_importance': xgb_clf.feature_importances_,
    'lgb_importance': lgb_clf.feature_importances_
}).sort_values('xgb_importance', ascending=False)

print("\nTop 10 Features:")
print(feature_importance.head(10))

xgb_fpr, xgb_tpr, _ = roc_curve(y_test, xgb_prob)
lgb_fpr, lgb_tpr, _ = roc_curve(y_test, lgb_prob)

plt.figure(figsize=(10, 6))
plt.plot(xgb_fpr, xgb_tpr, label=f'XGBoost (AUC = {roc_auc_score(y_test, xgb_prob):.4f})')
plt.plot(lgb_fpr, lgb_tpr, label=f'LightGBM (AUC = {roc_auc_score(y_test, lgb_prob):.4f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves: XGBoost vs LightGBM')
plt.legend()
plt.grid(True)
plt.show()
```

---

### Section 17.4: Naive Bayes Variants

Naive Bayes classifiers apply Bayes' theorem with the assumption of feature independence. Different variants handle various data distributionsâ€”Gaussian for continuous, Multinomial for counts, Bernoulli for binary features.

```python
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB, ComplementNB
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.datasets import fetch_20newsgroups
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')

categories = ['sci.space', 'rec.sport.baseball', 'comp.graphics', 'talk.politics.misc']
train_data = fetch_20newsgroups(subset='train', categories=categories, random_state=42)
test_data = fetch_20newsgroups(subset='test', categories=categories, random_state=42)

models = {
    'MultinomialNB': Pipeline([
        ('vectorizer', CountVectorizer(max_features=5000, stop_words='english')),
        ('classifier', MultinomialNB(alpha=1.0))
    ]),
    'BernoulliNB': Pipeline([
        ('vectorizer', CountVectorizer(max_features=5000, stop_words='english')),
        ('classifier', BernoulliNB(alpha=1.0))
    ]),
    'ComplementNB': Pipeline([
        ('vectorizer', CountVectorizer(max_features=5000, stop_words='english')),
        ('classifier', ComplementNB(alpha=1.0))
    ]),
    'TF-IDF + MultinomialNB': Pipeline([
        ('vectorizer', TfidfVectorizer(max_features=5000, stop_words='english')),
        ('classifier', MultinomialNB(alpha=0.1))
    ])
}

for name, model in models.items():
    model.fit(train_data.data, train_data.target)
    accuracy = model.score(test_data.data, test_data.target)
    cv_scores = cross_val_score(model, train_data.data, train_data.target, cv=5)
    print(f"{name}:")
    print(f"  Test Accuracy: {accuracy:.4f}")
    print(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print()

np.random.seed(42)
X_gaussian = np.vstack([
    np.random.randn(100, 2) + [2, 2],
    np.random.randn(100, 2) + [-2, -2],
    np.random.randn(100, 2) + [2, -2]
])
y_gaussian = np.array([0]*100 + [1]*100 + [2]*100)

gnb = GaussianNB()
gnb.fit(X_gaussian, y_gaussian)

x_min, x_max = X_gaussian[:, 0].min() - 1, X_gaussian[:, 0].max() + 1
y_min, y_max = X_gaussian[:, 1].min() - 1, X_gaussian[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
Z = gnb.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.figure(figsize=(10, 6))
plt.contourf(xx, yy, Z, alpha=0.4, cmap=plt.cm.RdYlBu)
plt.scatter(X_gaussian[:, 0], X_gaussian[:, 1], c=y_gaussian, edgecolors='k', cmap=plt.cm.RdYlBu)
plt.title('Gaussian Naive Bayes Decision Boundaries')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.show()
```

---

### Section 17.5: k-NN Advanced

k-Nearest Neighbors classifies based on majority vote of k closest training samples. Advanced techniques include distance weighting, different distance metrics, and dimensionality reduction for improved performance.

```python
from sklearn.neighbors import KNeighborsClassifier, NearestNeighbors
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.manifold import TSNE
from scipy.spatial.distance import cdist

X, y = make_classification(n_samples=1000, n_features=20, n_informative=15,
                           n_redundant=3, n_classes=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

k_range = range(1, 31)
train_scores = []
test_scores = []

for k in k_range:
    knn = Pipeline([
        ('scaler', StandardScaler()),
        ('knn', KNeighborsClassifier(n_neighbors=k))
    ])
    knn.fit(X_train, y_train)
    train_scores.append(knn.score(X_train, y_train))
    test_scores.append(knn.score(X_test, y_test))

optimal_k = k_range[np.argmax(test_scores)]
print(f"Optimal k: {optimal_k}")
print(f"Best Test Accuracy: {max(test_scores):.4f}")

plt.figure(figsize=(10, 6))
plt.plot(k_range, train_scores, label='Train Accuracy', marker='o')
plt.plot(k_range, test_scores, label='Test Accuracy', marker='o')
plt.xlabel('Number of Neighbors (k)')
plt.ylabel('Accuracy')
plt.title('k-NN: Accuracy vs k')
plt.legend()
plt.grid(True)
plt.axvline(x=optimal_k, color='r', linestyle='--', label=f'Optimal k={optimal_k}')
plt.show()

metrics = ['euclidean', 'manhattan', 'chebyshev', 'minkowski']
weights_options = ['uniform', 'distance']

print("\nDistance Metrics Comparison:")
for metric in metrics:
    for weight in weights_options:
        knn = Pipeline([
            ('scaler', StandardScaler()),
            ('knn', KNeighborsClassifier(
                n_neighbors=optimal_k,
                metric=metric,
                weights=weight,
                p=3 if metric == 'minkowski' else 2
            ))
        ])
        knn.fit(X_train, y_train)
        accuracy = knn.score(X_test, y_test)
        print(f"  {metric} ({weight}): {accuracy:.4f}")

knn_optimal = Pipeline([
    ('scaler', StandardScaler()),
    ('knn', KNeighborsClassifier(n_neighbors=optimal_k, weights='distance', metric='manhattan'))
])
knn_optimal.fit(X_train, y_train)

y_pred = knn_optimal.predict(X_test)
print(f"\nOptimized k-NN Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

X_2d = TSNE(n_components=2, random_state=42).fit_transform(StandardScaler().fit_transform(X_test))

plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y_pred, cmap='Set1', alpha=0.7, edgecolors='k')
plt.colorbar(scatter)
plt.title(f'k-NN Predictions (k={optimal_k}) - t-SNE Visualization')
plt.show()
```

---

### Section 17.6: Model Calibration

Model calibration ensures that predicted probabilities reflect true likelihoods. Well-calibrated models provide reliable confidence estimates, critical for decision-making systems.

```python
from sklearn.calibration import calibration_curve, CalibratedClassifierCV
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.calibration import calibration_curve
import warnings
warnings.filterwarnings('ignore')

X, y = make_classification(n_samples=2000, n_features=20, n_informative=15,
                           n_redundant=3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)

models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
    'SVM (uncalibrated)': SVC(kernel='rbf', probability=False, random_state=42)
}

plt.figure(figsize=(12, 8))
plt.plot([0, 1], [0, 1], 'k--', label='Perfectly Calibrated')

for name, model in models.items():
    if name == 'SVM (uncalibrated)':
        model.fit(X_train, y_train)
        y_scores = model.decision_function(X_test)
        prob_pos = 1 / (1 + np.exp(-y_scores))
    else:
        model.fit(X_train, y_train)
        prob_pos = model.predict_proba(X_test)[:, 1]
    
    fraction_of_positives, mean_predicted_value = calibration_curve(y_test, prob_pos, n_bins=10)
    brier_score = np.mean((prob_pos - y_test) ** 2)
    print(f"{name}: Brier Score = {brier_score:.4f}")
    plt.plot(mean_predicted_value, fraction_of_positives, marker='o', label=name)

plt.xlabel('Mean Predicted Probability')
plt.ylabel('Fraction of Positives')
plt.title('Calibration Curves')
plt.legend()
plt.grid(True)
plt.show()

print("\n--- Platt Scaling Calibration ---")
for name, model in [('Random Forest', RandomForestClassifier(n_estimators=100, random_state=42)),
                     ('Gradient Boosting', GradientBoostingClassifier(n_estimators=100, random_state=42))]:
    calibrated = CalibratedClassifierCV(model, method='sigmoid', cv=5)
    calibrated.fit(X_train, y_train)
    
    prob_before = model.fit(X_train, y_train).predict_proba(X_test)[:, 1]
    prob_after = calibrated.predict_proba(X_test)[:, 1]
    
    brier_before = np.mean((prob_before - y_test) ** 2)
    brier_after = np.mean((prob_after - y_test) ** 2)
    
    print(f"\n{name}:")
    print(f"  Before calibration: Brier = {brier_before:.4f}")
    print(f"  After calibration:  Brier = {brier_after:.4f}")

print("\n--- Isotonic Regression Calibration ---")
for name, model in [('Random Forest', RandomForestClassifier(n_estimators=100, random_state=42)),
                     ('Gradient Boosting', GradientBoostingClassifier(n_estimators=100, random_state=42))]:
    calibrated = CalibratedClassifierCV(model, method='isotonic', cv=5)
    calibrated.fit(X_train, y_train)
    
    prob_before = model.fit(X_train, y_train).predict_proba(X_test)[:, 1]
    prob_after = calibrated.predict_proba(X_test)[:, 1]
    
    brier_before = np.mean((prob_before - y_test) ** 2)
    brier_after = np.mean((prob_after - y_test) ** 2)
    
    print(f"\n{name}:")
    print(f"  Before calibration: Brier = {brier_before:.4f}")
    print(f"  After calibration:  Brier = {brier_after:.4f}")
```

---

### Section 17.7: Multi-class Strategies

Binary classifiers extend to multi-class problems through One-vs-Rest (OvR) or One-vs-One (OvO) strategies. These approaches decompose the problem into multiple binary classification tasks.

```python
from sklearn.multiclass import OneVsRestClassifier, OneVsOneClassifier
from sklearn.datasets import load_iris, make_multilabel_classification
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix
from itertools import combinations
import warnings
warnings.filterwarnings('ignore')

iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

ovr_clf = OneVsRestClassifier(SVC(kernel='rbf', C=10, random_state=42))
ovo_clf = OneVsOneClassifier(SVC(kernel='rbf', C=10, random_state=42))

ovr_clf.fit(X_train, y_train)
ovo_clf.fit(X_train, y_train)

print("One-vs-Rest Results:")
print(f"Accuracy: {ovr_clf.score(X_test, y_test):.4f}")
print(f"Number of estimators: {len(ovr_clf.estimators_)}")
print(classification_report(y_test, ovr_clf.predict(X_test), target_names=iris.target_names))

print("\nOne-vs-One Results:")
print(f"Accuracy: {ovo_clf.score(X_test, y_test):.4f}")
print(f"Number of estimators: {len(ovo_clf.estimators_)}")
print(classification_report(y_test, ovo_clf.predict(X_test), target_names=iris.target_names))

pair_indices = list(combinations(range(3), 2))
print("\nPairwise Class Comparisons:")
for i, (class1, class2) in enumerate(pair_indices):
    mask = np.isin(y, [class1, class2])
    X_pair, y_pair = X[mask], y[mask]
    y_pair_binary = (y_pair == class2).astype(int)
    
    pair_clf = SVC(kernel='rbf', C=10, random_state=42)
    pair_clf.fit(X_pair, y_pair_binary)
    
    X_test_pair = X_test[np.isin(y_test, [class1, class2])]
    y_test_pair = (y_test[np.isin(y_test, [class1, class2])] == class2).astype(int)
    
    if len(X_test_pair) > 0:
        acc = pair_clf.score(X_test_pair, y_test_pair)
        print(f"  {iris.target_names[class1]} vs {iris.target_names[class2]}: Accuracy = {acc:.4f}")

from sklearn.model_selection import cross_val_score

strategies = {
    'OvR': OneVsRestClassifier(SVC(kernel='rbf', C=10, random_state=42)),
    'OvO': OneVsOneClassifier(SVC(kernel='rbf', C=10, random_state=42)),
    'Native Multi-class': SVC(kernel='rbf', C=10, random_state=42, decision_function_shape='ovr')
}

print("\nCross-Validation Comparison:")
for name, clf in strategies.items():
    cv_scores = cross_val_score(clf, X, y, cv=5, scoring='accuracy')
    print(f"{name}: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
```

---

### Module 17: Real-Time Use Cases

| Use Case | Algorithm | Industry | Key Metric |
|----------|-----------|----------|------------|
| Email Spam Detection | SVM (Linear) | Technology | Precision > 98% |
| Credit Card Fraud Detection | XGBoost | Finance | AUC-ROC > 0.99 |
| Medical Diagnosis | Decision Tree | Healthcare | Recall > 95% |
| Customer Churn Prediction | LightGBM | SaaS | F1-Score > 0.85 |
| Document Classification | Naive Bayes | Legal | Accuracy > 90% |
| Image Recognition (Small Dataset) | k-NN | Retail | Top-5 Accuracy |
| Handwritten Digit Recognition | SVM (RBF) | Banking | Accuracy > 98% |
| Disease Outbreak Prediction | Random Forest | Public Health | Sensitivity > 90% |

---

### Module 17: Project Ideas

| Project | Description | Datasets | Skills Practiced |
|---------|-------------|----------|------------------|
| Customer Segmentation Classifier | Predict customer segments using transaction data | UCI ML Bank Marketing | XGBoost, Feature Engineering |
| Real-time Fraud Detection System | Build pipeline for streaming fraud detection | Kaggle Credit Card Fraud | SVM, Model Calibration |
| Multi-class Document Classifier | Classify news articles into categories | 20 Newsgroups | TF-IDF, Naive Bayes, Ensemble |
| Medical Image Classification | Detect diseases from X-ray images | Chest X-ray Dataset | SVM, CNN transfer learning |
| Loan Default Prediction | Predict loan defaults with calibrated probabilities | Lending Club | Decision Trees, Calibration |

---

# MODULE 18: TIME SERIES ANALYSIS & FORECASTING

---

## Learning Objectives
- Decompose time series into trend, seasonal, and residual components
- Implement ARIMA, SARIMA, and Prophet for forecasting
- Apply LSTM neural networks to sequential data
- Detect anomalies and perform rolling window analysis

---

### Section 18.1: Time Series Components

Time series data consists of trend, seasonality, cyclic patterns, and irregular components. Understanding these components is essential for choosing appropriate forecasting models.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose, STL
from statsmodels.tsa.stattools import adfuller, kpss
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
dates = pd.date_range(start='2020-01-01', periods=365*3, freq='D')
trend = np.linspace(100, 150, len(dates))
seasonal = 10 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)
noise = np.random.normal(0, 5, len(dates))
values = trend + seasonal + noise

ts = pd.Series(values, index=dates)

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].plot(ts, label='Original Time Series')
axes[0].set_title('Synthetic Time Series with Trend and Seasonality')
axes[0].set_ylabel('Value')
axes[0].legend()
axes[0].grid(True)

decomposition = seasonal_decompose(ts, model='additive', period=365)
decomposition.plot(ax=axes[1] if len(axes) > 1 else axes)
plt.tight_layout()
plt.show()

def adf_test(series):
    result = adfuller(series.dropna(), autolag='AIC')
    print('ADF Test Results:')
    print(f'ADF Statistic: {result[0]:.4f}')
    print(f'p-value: {result[1]:.4f}')
    print(f'Critical Values:')
    for key, value in result[4].items():
        print(f'  {key}: {value:.4f}')
    print(f'Stationary: {result[1] < 0.05}')

print("--- Original Series ---")
adf_test(ts)

ts_diff = ts.diff().dropna()
print("\n--- First Differencing ---")
adf_test(ts_diff)

stl = STL(ts, period=365, robust=True)
result = stl.fit()

fig, axes = plt.subplots(4, 1, figsize=(12, 10))
axes[0].plot(result.observed)
axes[0].set_title('Observed')
axes[1].plot(result.trend, color='red')
axes[1].set_title('Trend')
axes[2].plot(result.seasonal, color='green')
axes[2].set_title('Seasonal')
axes[3].plot(result.resid, color='purple')
axes[3].set_title('Residual')
plt.tight_layout()
plt.show()

rolling_mean = ts.rolling(window=30).mean()
rolling_std = ts.rolling(window=30).std()

plt.figure(figsize=(12, 6))
plt.plot(ts, label='Original', alpha=0.5)
plt.plot(rolling_mean, label='Rolling Mean (30 days)', color='red')
plt.plot(rolling_std, label='Rolling Std (30 days)', color='green')
plt.title('Rolling Statistics')
plt.legend()
plt.grid(True)
plt.show()
```

---

### Section 18.2: ARIMA & SARIMA

ARIMA (AutoRegressive Integrated Moving Average) models capture temporal dependencies through differencing, autoregressive terms, and moving average components. SARIMA extends this with seasonal components.

```python
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.stats.diagnostic import acorr_ljungbox
import itertools

np.random.seed(42)
dates = pd.date_range(start='2018-01-01', periods=365*4, freq='D')
trend = np.linspace(100, 120, len(dates))
seasonal = 15 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)
noise = np.random.normal(0, 3, len(dates))
values = trend + seasonal + noise

ts = pd.Series(values, index=dates)
train_size = int(len(ts) * 0.8)
train, test = ts[:train_size], ts[train_size:]

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
plot_acf(ts.diff().dropna(), lags=40, ax=axes[0], title='ACF (After Differencing)')
plot_pacf(ts.diff().dropna(), lags=40, ax=axes[1], title='PACF (After Differencing)')
plt.tight_layout()
plt.show()

p_range = range(0, 3)
d_range = range(0, 2)
q_range = range(0, 3)

best_aic = float('inf')
best_order = None

for p, d, q in itertools.product(p_range, d_range, q_range):
    try:
        model = ARIMA(train, order=(p, d, q))
        results = model.fit()
        if results.aic < best_aic:
            best_aic = results.aic
            best_order = (p, d, q)
    except:
        continue

print(f"Best ARIMA Order: {best_order}")
print(f"Best AIC: {best_aic:.2f}")

arima_model = ARIMA(train, order=best_order)
arima_fit = arima_model.fit()
print(arima_fit.summary())

arima_forecast = arima_fit.forecast(steps=len(test))
arima_mse = np.mean((test - arima_forecast) ** 2)
arima_mae = np.mean(np.abs(test - arima_forecast))
print(f"\nARIMA Forecast MSE: {arima_mse:.4f}")
print(f"ARIMA Forecast MAE: {arima_mae:.4f}")

print("\n--- SARIMA Model ---")
sarima_model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 365))
sarima_fit = sarima_model.fit(disp=False)
print(sarima_fit.summary())

sarima_forecast = sarima_fit.forecast(steps=len(test))
sarima_mse = np.mean((test - sarima_forecast) ** 2)
sarima_mae = np.mean(np.abs(test - sarima_forecast))
print(f"\nSARIMA Forecast MSE: {sarima_mse:.4f}")
print(f"SARIMA Forecast MAE: {sarima_mae:.4f}")

plt.figure(figsize=(14, 7))
plt.plot(train.index, train, label='Training Data')
plt.plot(test.index, test, label='Actual Values')
plt.plot(test.index, arima_forecast, label=f'ARIMA{best_order} Forecast', linestyle='--')
plt.plot(test.index, sarima_forecast, label='SARIMA Forecast', linestyle='--')
plt.title('ARIMA vs SARIMA Forecasting')
plt.xlabel('Date')
plt.ylabel('Value')
plt.legend()
plt.grid(True)
plt.show()
```

---

### Section 18.3: Prophet for Forecasting

Prophet is Facebook's time series forecasting library designed for business forecasting with strong seasonal effects and multiple seasonalities. It handles missing data and outliers gracefully.

```python
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
dates = pd.date_range(start='2019-01-01', periods=365*3, freq='D')
trend = np.linspace(100, 130, len(dates))
weekly = 5 * np.sin(2 * np.pi * np.arange(len(dates)) / 7)
yearly = 15 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)
noise = np.random.normal(0, 3, len(dates))
values = trend + weekly + yearly + noise

df = pd.DataFrame({'ds': dates, 'y': values})

train_size = int(len(df) * 0.8)
train_df = df[:train_size].copy()
test_df = df[train_size:].copy()

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05,
    seasonality_prior_scale=10
)

model.add_country_holidays(country_name='US')
model.fit(train_df)

future = model.make_future_dataframe(periods=len(test_df), freq='D')
forecast = model.predict(future)

fig = model.plot(forecast)
plt.title('Prophet Forecast with Uncertainty Intervals')
plt.show()

fig = model.plot_components(forecast)
plt.show()

forecast_test = forecast[forecast['ds'].isin(test_df['ds'])]
merged = test_df.merge(forecast_test[['ds', 'yhat', 'yhat_lower', 'yhat_upper']], on='ds')

prophet_mse = np.mean((merged['y'] - merged['yhat']) ** 2)
prophet_mae = np.mean(np.abs(merged['y'] - merged['yhat']))
print(f"Prophet Forecast MSE: {prophet_mse:.4f}")
print(f"Prophet Forecast MAE: {prophet_mae:.4f}")

cv_results = cross_validation(model, initial='365 days', period='90 days', horizon='180 days')
metrics = performance_metrics(cv_results)
print("\nCross-Validation Metrics:")
print(metrics[['horizon', 'mse', 'mae', 'mape']].mean())

model_with_holidays = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    changepoint_prior_scale=0.05
)
model_with_holidays.add_country_holidays(country_name='US')
model_with_holidays.add_regressor('regressor', mode='additive')

np.random.seed(42)
df['regressor'] = np.random.normal(0, 1, len(df))

plt.figure(figsize=(14, 7))
plt.plot(merged['ds'], merged['y'], label='Actual', alpha=0.8)
plt.plot(merged['ds'], merged['yhat'], label='Prophet Forecast', linestyle='--')
plt.fill_between(merged['ds'], merged['yhat_lower'], merged['yhat_upper'], 
                  alpha=0.3, label='Uncertainty Interval')
plt.title('Prophet Forecast vs Actual')
plt.xlabel('Date')
plt.ylabel('Value')
plt.legend()
plt.grid(True)
plt.show()
```

---

### Section 18.4: Feature Engineering for Time Series

Creating meaningful features from temporal data significantly improves model performance. This includes lag features, rolling statistics, calendar features, and domain-specific transformations.

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
dates = pd.date_range(start='2018-01-01', periods=365*4, freq='D')
n = len(dates)
trend = np.linspace(100, 130, n)
seasonal = 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
weekly = 5 * np.sin(2 * np.pi * np.arange(n) / 7)
noise = np.random.normal(0, 3, n)
values = trend + seasonal + weekly + noise

df = pd.DataFrame({'date': dates, 'value': values})

def create_time_features(df):
    df = df.copy()
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['dayofweek'] = df['date'].dt.dayofweek
    df['dayofyear'] = df['date'].dt.dayofyear
    df['quarter'] = df['date'].dt.quarter
    df['is_weekend'] = (df['date'].dt.dayofweek >= 5).astype(int)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    df['dayofweek_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
    df['dayofweek_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)
    return df

def create_lag_features(df, column, lags):
    df = df.copy()
    for lag in lags:
        df[f'{column}_lag_{lag}'] = df[column].shift(lag)
    return df

def create_rolling_features(df, column, windows):
    df = df.copy()
    for window in windows:
        df[f'{column}_rolling_mean_{window}'] = df[column].rolling(window=window).mean()
        df[f'{column}_rolling_std_{window}'] = df[column].rolling(window=window).std()
        df[f'{column}_rolling_min_{window}'] = df[column].rolling(window=window).min()
        df[f'{column}_rolling_max_{window}'] = df[column].rolling(window=window).max()
    return df

def create_expanding_features(df, column):
    df = df.copy()
    df[f'{column}_expanding_mean'] = df[column].expanding().mean()
    df[f'{column}_expanding_std'] = df[column].expanding().std()
    return df

df_features = create_time_features(df)
df_features = create_lag_features(df_features, 'value', [1, 7, 14, 28, 365])
df_features = create_rolling_features(df_features, 'value', [7, 14, 30, 90, 365])
df_features = create_expanding_features(df_features, 'value')

df_features['value_diff'] = df_features['value'].diff()
df_features['value_pct_change'] = df_features['value'].pct_change()
df_features['value_rolling_corr_7_30'] = (
    df_features['value'].rolling(7).corr(df_features['value'].rolling(30).mean())
)

df_features = df_features.dropna()

feature_cols = [col for col in df_features.columns if col not in ['date', 'value']]
X = df_features[feature_cols]
y = df_features['value']

tscv = TimeSeriesSplit(n_splits=5)
scaler = StandardScaler()

rmse_scores = []
mae_scores = []

for train_idx, test_idx in tscv.split(X):
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
    
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    rmse_scores.append(np.sqrt(mean_squared_error(y_test, y_pred)))
    mae_scores.append(mean_absolute_error(y_test, y_pred))

print(f"Mean RMSE: {np.mean(rmse_scores):.4f} (+/- {np.std(rmse_scores):.4f})")
print(f"Mean MAE: {np.mean(mae_scores):.4f} (+/- {np.std(mae_scores):.4f})")

importances = pd.Series(model.feature_importances_, index=feature_cols)
top_features = importances.sort_values(ascending=False).head(15)

plt.figure(figsize=(10, 8))
top_features.plot(kind='barh')
plt.title('Top 15 Feature Importances')
plt.xlabel('Importance')
plt.ylabel('Feature')
plt.tight_layout()
plt.show()
```

---

### Section 18.5: LSTM for Time Series

Long Short-Term Memory networks learn long-term dependencies in sequential data. They capture complex patterns that linear models cannot, making them ideal for non-linear time series forecasting.

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional
    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("TensorFlow not installed. Install with: pip install tensorflow")

if TF_AVAILABLE:
    np.random.seed(42)
    tf.random.set_seed(42)
    
    dates = pd.date_range(start='2018-01-01', periods=365*3, freq='D')
    n = len(dates)
    trend = np.linspace(100, 130, n)
    seasonal = 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
    weekly = 5 * np.sin(2 * np.pi * np.arange(n) / 7)
    noise = np.random.normal(0, 3, n)
    values = trend + seasonal + weekly + noise
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_values = scaler.fit_transform(values.reshape(-1, 1)).flatten()
    
    def create_sequences(data, seq_length):
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i:i + seq_length])
            y.append(data[i + seq_length])
        return np.array(X), np.array(y)
    
    SEQ_LENGTH = 60
    X, y = create_sequences(scaled_values, SEQ_LENGTH)
    
    X = X.reshape((X.shape[0], X.shape[1], 1))
    
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(SEQ_LENGTH, 1)),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25, activation='relu'),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    model.summary()
    
    early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6)
    
    history = model.fit(
        X_train, y_train,
        epochs=100,
        batch_size=32,
        validation_split=0.1,
        callbacks=[early_stop, reduce_lr],
        verbose=1
    )
    
    y_pred_scaled = model.predict(X_test)
    y_pred = scaler.inverse_transform(y_pred_scaled).flatten()
    y_actual = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()
    
    lstm_rmse = np.sqrt(mean_squared_error(y_actual, y_pred))
    lstm_mae = mean_absolute_error(y_actual, y_pred)
    
    print(f"\nLSTM Results:")
    print(f"RMSE: {lstm_rmse:.4f}")
    print(f"MAE: {lstm_mae:.4f}")
    
    plt.figure(figsize=(14, 7))
    plt.plot(y_actual, label='Actual', alpha=0.8)
    plt.plot(y_pred, label='LSTM Forecast', linestyle='--')
    plt.title('LSTM Time Series Forecast')
    plt.xlabel('Time Steps')
    plt.ylabel('Value')
    plt.legend()
    plt.grid(True)
    plt.show()
    
    plt.figure(figsize=(10, 6))
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Training History')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    plt.show()
    
    bidirectional_model = Sequential([
        Bidirectional(LSTM(50, return_sequences=True), input_shape=(SEQ_LENGTH, 1)),
        Dropout(0.2),
        Bidirectional(LSTM(50, return_sequences=False)),
        Dropout(0.2),
        Dense(25, activation='relu'),
        Dense(1)
    ])
    
    bidirectional_model.compile(optimizer='adam', loss='mse')
    
    bidirectional_history = bidirectional_model.fit(
        X_train, y_train,
        epochs=100,
        batch_size=32,
        validation_split=0.1,
        callbacks=[early_stop],
        verbose=0
    )
    
    y_pred_bi = bidirectional_model.predict(X_test)
    y_pred_bi = scaler.inverse_transform(y_pred_bi).flatten()
    bi_rmse = np.sqrt(mean_squared_error(y_actual, y_pred_bi))
    print(f"\nBidirectional LSTM RMSE: {bi_rmse:.4f}")
```

---

### Section 18.6: Anomaly Detection in Time Series

Identifying unusual patterns in time series data is crucial for monitoring systems, fraud detection, and predictive maintenance. Methods include statistical approaches, Isolation Forest, and LSTM-based detection.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
dates = pd.date_range(start='2020-01-01', periods=1000, freq='D')
normal = np.random.normal(100, 10, len(dates))

anomaly_indices = np.random.choice(len(dates), 30, replace=False)
normal[anomaly_indices] += np.random.choice([-1, 1], 30) * np.random.uniform(30, 50, 30)

df = pd.DataFrame({'date': dates, 'value': normal})

def detect_anomalies_zscore(series, threshold=3):
    z_scores = np.abs(stats.zscore(series.dropna()))
    anomaly_mask = z_scores > threshold
    return anomaly_mask

def detect_anomalies_modified_zscore(series, threshold=3.5):
    median = np.median(series.dropna())
    mad = np.median(np.abs(series.dropna() - median))
    modified_z_scores = 0.6745 * (series - median) / mad
    return np.abs(modified_z_scores) > threshold

def detect_anomalies_iqr(series, multiplier=1.5):
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - multiplier * IQR
    upper = Q3 + multiplier * IQR
    return (series < lower) | (series > upper)

df['zscore_anomaly'] = detect_anomalies_zscore(df['value'])
df['mod_zscore_anomaly'] = detect_anomalies_modified_zscore(df['value'])
df['iqr_anomaly'] = detect_anomalies_iqr(df['value'])

scaler = StandardScaler()
value_scaled = scaler.fit_transform(df[['value']])

iso_forest = IsolationForest(contamination=0.05, random_state=42)
df['isolation_forest_anomaly'] = iso_forest.fit_predict(value_scaled) == -1

oc_svm = OneClassSVM(nu=0.05, kernel='rbf', gamma='auto')
df['ocsvm_anomaly'] = oc_svm.fit_predict(value_scaled) == -1

print("Anomaly Counts:")
print(f"Z-Score: {df['zscore_anomaly'].sum()}")
print(f"Modified Z-Score: {df['mod_zscore_anomaly'].sum()}")
print(f"IQR: {df['iqr_anomaly'].sum()}")
print(f"Isolation Forest: {df['isolation_forest_anomaly'].sum()}")
print(f"One-Class SVM: {df['ocsvm_anomaly'].sum()}")

df['rolling_mean'] = df['value'].rolling(window=30).mean()
df['rolling_std'] = df['value'].rolling(window=30).std()
df['rolling_anomaly'] = (
    (df['value'] > df['rolling_mean'] + 3 * df['rolling_std']) |
    (df['value'] < df['rolling_mean'] - 3 * df['rolling_std'])
)

fig, axes = plt.subplots(2, 1, figsize=(14, 10))

axes[0].plot(df['date'], df['value'], label='Value', alpha=0.7)
axes[0].scatter(df[df['isolation_forest_anomaly']]['date'],
                df[df['isolation_forest_anomaly']]['value'],
                color='red', label='Isolation Forest Anomaly', zorder=5)
axes[0].set_title('Time Series with Anomaly Detection (Isolation Forest)')
axes[0].legend()
axes[0].grid(True)

axes[1].plot(df['date'], df['value'], label='Value', alpha=0.7)
axes[1].plot(df['date'], df['rolling_mean'], label='Rolling Mean', color='orange')
axes[1].fill_between(df['date'],
                      df['rolling_mean'] - 3 * df['rolling_std'],
                      df['rolling_mean'] + 3 * df['rolling_std'],
                      alpha=0.3, color='orange', label='Â±3Ïƒ Band')
axes[1].scatter(df[df['rolling_anomaly']]['date'],
                df[df['rolling_anomaly']]['value'],
                color='red', label='Rolling Anomaly', zorder=5)
axes[1].set_title('Rolling Window Anomaly Detection')
axes[1].legend()
axes[1].grid(True)

plt.tight_layout()
plt.show()

results = pd.DataFrame({
    'Method': ['Z-Score', 'Modified Z-Score', 'IQR', 'Isolation Forest', 'One-Class SVM', 'Rolling Window'],
    'Anomalies Detected': [
        df['zscore_anomaly'].sum(),
        df['mod_zscore_anomaly'].sum(),
        df['iqr_anomaly'].sum(),
        df['isolation_forest_anomaly'].sum(),
        df['ocsvm_anomaly'].sum(),
        df['rolling_anomaly'].sum()
    ]
})
print("\nAnomaly Detection Summary:")
print(results)
```

---

### Section 18.7: Rolling Window Analysis

Rolling window computations smooth data and reveal underlying trends. Different window sizes capture patterns at various time scales, from short-term fluctuations to long-term trends.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
dates = pd.date_range(start='2020-01-01', periods=365*2, freq='D')
n = len(dates)
trend = np.linspace(100, 120, n)
seasonal = 10 * np.sin(2 * np.pi * np.arange(n) / 365.25)
noise = np.random.normal(0, 5, n)
values = trend + seasonal + noise

df = pd.DataFrame({'date': dates, 'value': values})

windows = [7, 14, 30, 90]

plt.figure(figsize=(14, 8))
plt.plot(df['date'], df['value'], label='Original', alpha=0.5)

for window in windows:
    rolling_mean = df['value'].rolling(window=window).mean()
    plt.plot(df['date'], rolling_mean, label=f'{window}-day MA')

plt.title('Rolling Moving Averages')
plt.xlabel('Date')
plt.ylabel('Value')
plt.legend()
plt.grid(True)
plt.show()

df['ewm_7'] = df['value'].ewm(span=7, adjust=False).mean()
df['ewm_30'] = df['value'].ewm(span=30, adjust=False).mean()
df['ewm_90'] = df['value'].ewm(span=90, adjust=False).mean()

plt.figure(figsize=(14, 8))
plt.plot(df['date'], df['value'], label='Original', alpha=0.5)
plt.plot(df['date'], df['ewm_7'], label='EWM (span=7)')
plt.plot(df['date'], df['ewm_30'], label='EWM (span=30)')
plt.plot(df['date'], df['ewm_90'], label='EWM (span=90)')
plt.title('Exponential Weighted Moving Averages')
plt.legend()
plt.grid(True)
plt.show()

df['rolling_mean_30'] = df['value'].rolling(window=30).mean()
df['rolling_std_30'] = df['value'].rolling(window=30).std()
df['upper_band'] = df['rolling_mean_30'] + 2 * df['rolling_std_30']
df['lower_band'] = df['rolling_mean_30'] - 2 * df['rolling_std_30']

plt.figure(figsize=(14, 8))
plt.plot(df['date'], df['value'], label='Original', alpha=0.5)
plt.plot(df['date'], df['rolling_mean_30'], label='30-day Mean', color='red')
plt.fill_between(df['date'], df['lower_band'], df['upper_band'], 
                  alpha=0.3, label='Â±2Ïƒ Band')
plt.title('Bollinger Bands (30-day)')
plt.legend()
plt.grid(True)
plt.show()

df['rolling_kurtosis'] = df['value'].rolling(window=30).apply(
    lambda x: stats.kurtosis(x), raw=True
)
df['rolling_skewness'] = df['value'].rolling(window=30).apply(
    lambda x: stats.skew(x), raw=True
)

fig, axes = plt.subplots(2, 1, figsize=(14, 8))
axes[0].plot(df['date'], df['rolling_kurtosis'], label='Rolling Kurtosis')
axes[0].set_title('Rolling Kurtosis (30-day)')
axes[0].grid(True)
axes[1].plot(df['date'], df['rolling_skewness'], label='Rolling Skewness', color='orange')
axes[1].set_title('Rolling Skewness (30-day)')
axes[1].grid(True)
plt.tight_layout()
plt.show()

def rolling_quantile(series, window, quantile):
    return series.rolling(window=window).quantile(quantile)

df['rolling_q25'] = rolling_quantile(df['value'], 30, 0.25)
df['rolling_q50'] = rolling_quantile(df['value'], 30, 0.50)
df['rolling_q75'] = rolling_quantile(df['value'], 30, 0.75)

plt.figure(figsize=(14, 8))
plt.plot(df['date'], df['value'], label='Original', alpha=0.5)
plt.plot(df['date'], df['rolling_q25'], label='25th Percentile')
plt.plot(df['date'], df['rolling_q50'], label='50th Percentile (Median)')
plt.plot(df['date'], df['rolling_q75'], label='75th Percentile')
plt.fill_between(df['date'], df['rolling_q25'], df['rolling_q75'], alpha=0.3, label='IQR')
plt.title('Rolling Quantiles (30-day)')
plt.legend()
plt.grid(True)
plt.show()
```

---

### Module 18: Real-Time Use Cases

| Use Case | Algorithm | Industry | Forecast Horizon |
|----------|-----------|----------|------------------|
| Stock Price Prediction | LSTM + ARIMA | Finance | 1-30 days |
| Energy Demand Forecasting | Prophet + SARIMA | Utilities | 1-7 days |
| Website Traffic Prediction | XGBoost + Rolling | Technology | 1-30 days |
| Sales Forecasting | Prophet + Holt-Winters | Retail | 1-12 months |
| Weather Prediction | LSTM | Meteorology | 1-14 days |
| Anomaly Detection (IoT) | Isolation Forest + Z-Score | Manufacturing | Real-time |
| Customer Activity Prediction | ARIMA + Prophet | SaaS | 1-90 days |
| Supply Chain Optimization | LSTM + Rolling Windows | Logistics | 1-6 months |

---

### Module 18: Project Ideas

| Project | Description | Datasets | Skills Practiced |
|---------|-------------|----------|------------------|
| Stock Price Forecasting | Predict stock prices with multiple models | Yahoo Finance API | LSTM, ARIMA, Prophet |
| Energy Consumption Predictor | Forecast household energy usage | UCI Energy Dataset | SARIMA, Feature Engineering |
| Anomaly Detection Dashboard | Real-time anomaly detection system | IoT Sensor Data | Rolling Windows, Isolation Forest |
| Sales Forecasting System | Multi-store sales prediction | Kaggle Store Sales | Prophet, XGBoost |
| Weather Forecasting Pipeline | Multi-step weather prediction | NOAA Weather Data | LSTM, Time Series Features |

---

# MODULE 19: NATURAL LANGUAGE PROCESSING WITH PYTHON

---

## Learning Objectives
- Master text preprocessing and tokenization techniques
- Implement TF-IDF, Word2Vec, and GloVe embeddings
- Build topic models and named entity recognition systems
- Create end-to-end text classification and sentiment analysis pipelines

---

### Section 19.1: Text Preprocessing

Text preprocessing transforms raw text into clean, structured formats suitable for ML models. Steps include tokenization, stopword removal, lemmatization, and handling special characters.

```python
import nltk
import re
import string
import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.tokenize import TweetTokenizer
import spacy
import warnings
warnings.filterwarnings('ignore')

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('punkt_tab', quiet=True)

sample_texts = [
    "The quick brown fox jumps over the lazy dog!!! Visit https://example.com for more info.",
    "I can't believe it's already 2024! The #AI revolution is here ðŸš€",
    "Contact us at info@company.com or call +1-555-0123. Price: $29.99 (20% off!)",
    "The results were AMAZING... but we need to verify. @john_doe what do you think?",
    "Natural Language Processing (NLP) is a subfield of AI that deals with text and speech."
]

def basic_cleaning(text):
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\@\w+|\#\w+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def advanced_cleaning(text):
    text = basic_cleaning(text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words and len(t) > 2]
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    return ' '.join(tokens)

print("=== Basic Cleaning ===")
for text in sample_texts:
    cleaned = basic_cleaning(text)
    print(f"Original: {text[:60]}...")
    print(f"Cleaned:  {cleaned}")
    print()

print("\n=== Advanced Cleaning (with Lemmatization) ===")
for text in sample_texts:
    cleaned = advanced_cleaning(text)
    print(f"Original: {text[:60]}...")
    print(f"Cleaned:  {cleaned}")
    print()

nlp = spacy.load('en_core_web_sm')

def spacy_preprocess(text):
    doc = nlp(text)
    tokens = [
        token.lemma_.lower() for token in doc
        if not token.is_stop and not token.is_punct
        and not token.is_space and len(token.text) > 2
    ]
    return ' '.join(tokens)

print("\n=== SpaCy Preprocessing ===")
for text in sample_texts:
    cleaned = spacy_preprocess(text)
    print(f"Original: {text[:60]}...")
    print(f"Cleaned:  {cleaned}")
    print()

def extract_linguistic_features(text):
    doc = nlp(text)
    features = {
        'num_sentences': len(list(doc.sents)),
        'num_tokens': len(doc),
        'num_entities': len(doc.ents),
        'num_nouns': len([t for t in doc if t.pos_ == 'NOUN']),
        'num_verbs': len([t for t in doc if t.pos_ == 'VERB']),
        'num_adjectives': len([t for t in doc if t.pos_ == 'ADJ']),
        'avg_token_length': np.mean([len(t.text) for t in doc]),
        'entities': [(ent.text, ent.label_) for ent in doc.ents]
    }
    return features

print("\n=== Linguistic Feature Extraction ===")
for text in sample_texts[:2]:
    features = extract_linguistic_features(text)
    print(f"Text: {text[:50]}...")
    for key, value in features.items():
        if key != 'entities':
            print(f"  {key}: {value}")
    print(f"  entities: {features['entities']}")
    print()
```

---

### Section 19.2: TF-IDF & Bag of Words

TF-IDF (Term Frequency-Inverse Document Frequency) and Bag of Words represent text as numerical vectors. TF-IDF weights terms by their importance across documents, while BoW uses raw frequency counts.

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

corpus = [
    "Machine learning is a subset of artificial intelligence",
    "Deep learning uses neural networks with many layers",
    "Natural language processing handles text and speech data",
    "Computer vision interprets images and video content",
    "Reinforcement learning trains agents through rewards",
    "Supervised learning uses labeled training data",
    "Unsupervised learning finds patterns in unlabeled data",
    "Transfer learning reuses pre-trained models for new tasks",
    "Neural networks are inspired by biological brain structure",
    "Data preprocessing is essential for effective machine learning",
    "Feature engineering improves model performance significantly",
    "Cross-validation prevents overfitting in model training",
    "The weather today is sunny and warm with clear skies",
    "Stock markets showed strong gains in today's trading session",
    "New smartphone features advanced camera and processing capabilities"
]

labels = [0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3]

count_vectorizer = CountVectorizer(
    max_features=1000,
    stop_words='english',
    ngram_range=(1, 2),
    min_df=1,
    max_df=0.95
)

tfidf_vectorizer = TfidfVectorizer(
    max_features=1000,
    stop_words='english',
    ngram_range=(1, 2),
    min_df=1,
    max_df=0.95,
    sublinear_tf=True
)

bow_matrix = count_vectorizer.fit_transform(corpus)
tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

print(f"Bag of Words Shape: {bow_matrix.shape}")
print(f"TF-IDF Shape: {tfidf_matrix.shape}")

print("\n=== Bag of Words Feature Names (first 10) ===")
print(count_vectorizer.get_feature_names_out()[:10])

print("\n=== TF-IDF Feature Names (first 10) ===")
print(tfidf_vectorizer.get_feature_names_out()[:10])

def get_top_tfidf_terms(tfidf_matrix, vectorizer, doc_idx, top_n=5):
    tfidf_scores = tfidf_matrix[doc_idx].toarray().flatten()
    feature_names = vectorizer.get_feature_names_out()
    top_indices = tfidf_scores.argsort()[-top_n:][::-1]
    return [(feature_names[i], tfidf_scores[i]) for i in top_indices]

print("\n=== Top TF-IDF Terms per Document ===")
for i in range(min(3, len(corpus))):
    terms = get_top_tfidf_terms(tfidf_matrix, tfidf_vectorizer, i)
    print(f"\nDocument {i}: {corpus[i][:50]}...")
    for term, score in terms:
        print(f"  {term}: {score:.4f}")

X_train, X_test, y_train, y_test = train_test_split(
    corpus, labels, test_size=0.3, random_state=42, stratify=labels
)

bow_pipeline = Pipeline([
    ('vectorizer', CountVectorizer(stop_words='english', ngram_range=(1, 2))),
    ('classifier', MultinomialNB())
])

tfidf_pipeline = Pipeline([
    ('vectorizer', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
    ('classifier', MultinomialNB())
])

tfidf_lr_pipeline = Pipeline([
    ('vectorizer', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
    ('classifier', LogisticRegression(max_iter=1000, random_state=42))
])

for name, pipeline in [('BoW + Naive Bayes', bow_pipeline),
                        ('TF-IDF + Naive Bayes', tfidf_pipeline),
                        ('TF-IDF + Logistic Regression', tfidf_lr_pipeline)]:
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n{name}: Accuracy = {accuracy:.4f}")

feature_names = tfidf_vectorizer.get_feature_names_out()
mean_tfidf = np.asarray(tfidf_matrix.mean(axis=0)).flatten()
top_indices = mean_tfidf.argsort()[-20:][::-1]

plt.figure(figsize=(10, 8))
plt.barh(range(20), mean_tfidf[top_indices])
plt.yticks(range(20), [feature_names[i] for i in top_indices])
plt.xlabel('Mean TF-IDF Score')
plt.title('Top 20 Terms by Mean TF-IDF Score')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()
```

---

### Section 19.3: Word Embeddings (Word2Vec, GloVe)

Word embeddings map words to dense vector representations that capture semantic relationships. Word2Vec learns embeddings from context, while GloVe uses global word co-occurrence statistics.

```python
from gensim.models import Word2Vec, KeyedVectors
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

sentences = [
    ["machine", "learning", "is", "a", "subset", "of", "artificial", "intelligence"],
    ["deep", "learning", "uses", "neural", "networks", "with", "many", "layers"],
    ["natural", "language", "processing", "handles", "text", "and", "speech", "data"],
    ["computer", "vision", "interprets", "images", "and", "video", "content"],
    ["reinforcement", "learning", "trains", "agents", "through", "rewards"],
    ["supervised", "learning", "uses", "labeled", "training", "data"],
    ["unsupervised", "learning", "finds", "patterns", "in", "unlabeled", "data"],
    ["neural", "networks", "are", "inspired", "by", "biological", "brain", "structure"],
    ["feature", "engineering", "improves", "model", "performance", "significantly"],
    ["data", "preprocessing", "is", "essential", "for", "effective", "machine", "learning"],
    ["python", "is", "a", "popular", "programming", "language", "for", "data", "science"],
    ["the", "cat", "sat", "on", "the", "mat", "and", "looked", "at", "the", "dog"],
    ["dogs", "and", "cats", "are", "popular", "house", "pets", "around", "the", "world"]
]

w2v_model = Word2Vec(
    sentences=sentences,
    vector_size=100,
    window=5,
    min_count=1,
    workers=4,
    epochs=100,
    sg=1,
    seed=42
)

print(f"Vocabulary Size: {len(w2v_model.wv)}")
print(f"Embedding Dimension: {w2v_model.wv.vector_size}")

print("\n=== Word Vectors ===")
for word in ['learning', 'neural', 'networks']:
    vector = w2v_model.wv[word]
    print(f"\n{word}: {vector[:10]}...")

print("\n=== Most Similar Words ===")
for word in ['learning', 'neural', 'data']:
    similar = w2v_model.wv.most_similar(word, topn=5)
    print(f"\n{word}:")
    for sim_word, score in similar:
        print(f"  {sim_word}: {score:.4f}")

print("\n=== Word Analogies ===")
try:
    analogy = w2v_model.wv.most_similar(
        positive=['learning', 'artificial'],
        negative=['neural'],
        topn=3
    )
    print("learning + artificial - neural:")
    for word, score in analogy:
        print(f"  {word}: {score:.4f}")
except Exception as e:
    print(f"Analogy not available: {e}")

print("\n=== Similarity Scores ===")
pairs = [
    ('learning', 'neural'),
    ('learning', 'programming'),
    ('cat', 'dog'),
    ('data', 'information'),
    ('network', 'internet')
]

for word1, word2 in pairs:
    if word1 in w2v_model.wv and word2 in w2v_model.wv:
        similarity = w2v_model.wv.similarity(word1, word2)
        print(f"{word1} - {word2}: {similarity:.4f}")

words = list(w2v_model.wv.index_to_key)
word_vectors = np.array([w2v_model.wv[word] for word in words])

pca = PCA(n_components=2)
vectors_2d = pca.fit_transform(word_vectors)

plt.figure(figsize=(14, 10))
plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], alpha=0.7)

for i, word in enumerate(words):
    plt.annotate(word, (vectors_2d[i, 0], vectors_2d[i, 1]),
                fontsize=10, ha='center', va='bottom')

plt.title('Word2Vec Embeddings (PCA Projection)')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

tsne = TSNE(n_components=2, random_state=42, perplexity=min(5, len(words)-1))
vectors_tsne = tsne.fit_transform(word_vectors)

plt.figure(figsize=(14, 10))
plt.scatter(vectors_tsne[:, 0], vectors_tsne[:, 1], alpha=0.7)

for i, word in enumerate(words):
    plt.annotate(word, (vectors_tsne[i, 0], vectors_tsne[i, 1]),
                fontsize=10, ha='center', va='bottom')

plt.title('Word2Vec Embeddings (t-SNE Projection)')
plt.xlabel('t-SNE Component 1')
plt.ylabel('t-SNE Component 2')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

---

### Section 19.4: Topic Modeling (LDA)

Latent Dirichlet Allocation discovers hidden topics in document collections. Each document is a mixture of topics, and each topic is a distribution over words, enabling unsupervised exploration of text collections.

```python
from sklearn.decomposition import LatentDirichletAllocation, NMF
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.datasets import fetch_20newsgroups
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

categories = ['sci.space', 'rec.sport.baseball', 'comp.graphics', 'talk.politics.misc']
newsgroups = fetch_20newsgroups(subset='all', categories=categories, random_state=42)

count_vectorizer = CountVectorizer(
    max_df=0.95, min_df=2,
    max_features=2000,
    stop_words='english'
)

tfidf_vectorizer = TfidfVectorizer(
    max_df=0.95, min_df=2,
    max_features=2000,
    stop_words='english'
)

count_matrix = count_vectorizer.fit_transform(newsgroups.data)
tfidf_matrix = tfidf_vectorizer.fit_transform(newsgroups.data)

n_topics = 4

lda_model = LatentDirichletAllocation(
    n_components=n_topics,
    max_iter=20,
    learning_method='online',
    learning_offset=50.,
    random_state=42,
    n_jobs=-1
)

lda_output = lda_model.fit_transform(count_matrix)

nmf_model = NMF(
    n_components=n_topics,
    random_state=42,
    max_iter=500
)

nmf_output = nmf_model.fit_transform(tfidf_matrix)

def display_topics(model, feature_names, n_top_words=10):
    topics = {}
    for topic_idx, topic in enumerate(model.components_):
        top_words = [feature_names[i] for i in topic.argsort()[:-n_top_words - 1:-1]]
        topics[f"Topic {topic_idx + 1}"] = top_words
    return topics

count_features = count_vectorizer.get_feature_names_out()
tfidf_features = tfidf_vectorizer.get_feature_names_out()

print("=== LDA Topics ===")
lda_topics = display_topics(lda_model, count_features)
for topic, words in lda_topics.items():
    print(f"\n{topic}:")
    print(f"  {', '.join(words)}")

print("\n\n=== NMF Topics ===")
nmf_topics = display_topics(nmf_model, tfidf_features)
for topic, words in nmf_topics.items():
    print(f"\n{topic}:")
    print(f"  {', '.join(words)}")

doc_topic_lda = lda_model.transform(count_matrix)
doc_topic_nmf = nmf_model.transform(tfidf_matrix)

dominant_topic_lda = np.argmax(doc_topic_lda, axis=1)
dominant_topic_nmf = np.argmax(doc_topic_nmf, axis=1)

print("\n=== Topic Distribution (LDA) ===")
for i, category in enumerate(categories):
    mask = newsgroups.target == i
    topic_dist = dominant_topic_lda[mask]
    print(f"\n{category}:")
    for t in range(n_topics):
        pct = (topic_dist == t).mean() * 100
        print(f"  Topic {t+1}: {pct:.1f}%")

log_likelihood = lda_model.score(count_matrix)
perplexity = lda_model.perplexity(count_matrix)
print(f"\nLDA Log-Likelihood: {log_likelihood:.2f}")
print(f"LDA Perplexity: {perplexity:.2f}")

n_topics_range = range(2, 10)
log_likelihoods = []
perplexities = []

for n in n_topics_range:
    lda = LatentDirichletAllocation(n_components=n, random_state=42, max_iter=20)
    lda.fit(count_matrix)
    log_likelihoods.append(lda.score(count_matrix))
    perplexities.append(lda.perplexity(count_matrix))

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(n_topics_range, log_likelihoods, marker='o')
axes[0].set_xlabel('Number of Topics')
axes[0].set_ylabel('Log-Likelihood')
axes[0].set_title('LDA: Log-Likelihood vs Number of Topics')
axes[0].grid(True)

axes[1].plot(n_topics_range, perplexities, marker='o', color='orange')
axes[1].set_xlabel('Number of Topics')
axes[1].set_ylabel('Perplexity')
axes[1].set_title('LDA: Perplexity vs Number of Topics')
axes[1].grid(True)

plt.tight_layout()
plt.show()

topic_matrix = doc_topic_lda[:20]
fig, ax = plt.subplots(figsize=(10, 8))
im = ax.imshow(topic_matrix, cmap='YlOrRd', aspect='auto')
ax.set_xlabel('Topics')
ax.set_ylabel('Documents')
ax.set_title('Document-Topic Distribution (First 20 Documents)')
plt.colorbar(im)
plt.tight_layout()
plt.show()
```

---

### Section 19.5: Named Entity Recognition

NER identifies and classifies named entities in textâ€”persons, organizations, locations, dates, and more. SpaCy provides production-ready NER, while custom models can be trained for domain-specific entities.

```python
import spacy
from spacy import displacy
from collections import Counter
import pandas as pd
import re
import warnings
warnings.filterwarnings('ignore')

nlp = spacy.load('en_core_web_sm')

sample_texts = [
    "Apple Inc. was founded by Steve Jobs in Cupertino, California in 1976.",
    "Dr. Sarah Chen from MIT published a paper on AI at NeurIPS 2023 in New Orleans.",
    "The CEO of Tesla, Elon Musk, announced the new factory in Austin, Texas.",
    "Google and Microsoft are competing in the cloud computing market.",
    "The United Nations held a climate summit in Paris last December.",
    "Microsoft acquired Activision Blizzard for $68.7 billion in 2023.",
    "Amazon Web Services launched new data centers in Frankfurt, Germany.",
    "The University of Tokyo and Stanford University signed a research partnership."
]

def extract_entities_spacy(text):
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({
            'text': ent.text,
            'label': ent.label_,
            'description': spacy.explain(ent.label_),
            'start': ent.start_char,
            'end': ent.end_char
        })
    return entities

print("=== Named Entity Recognition ===\n")
all_entities = []
for text in sample_texts:
    print(f"Text: {text}")
    entities = extract_entities_spacy(text)
    for ent in entities:
        print(f"  {ent['text']:25} -> {ent['label']:10} ({ent['description']})")
    all_entities.extend(entities)
    print()

entity_df = pd.DataFrame(all_entities)
print("\n=== Entity Statistics ===")
print(f"\nTotal Entities Found: {len(entity_df)}")
print(f"\nEntity Type Distribution:")
print(entity_df['label'].value_counts())

print(f"\nMost Common Entities:")
entity_counts = entity_df.groupby(['text', 'label']).size().reset_index(name='count')
entity_counts = entity_counts.sort_values('count', ascending=False)
print(entity_counts.head(10))

def extract_structured_info(text):
    doc = nlp(text)
    
    persons = [ent.text for ent in doc.ents if ent.label_ == 'PERSON']
    organizations = [ent.text for ent in doc.ents if ent.label_ in ['ORG', 'NORP']]
    locations = [ent.text for ent in doc.ents if ent.label_ in ['GPE', 'LOC']]
    dates = [ent.text for ent in doc.ents if ent.label_ == 'DATE']
    money = [ent.text for ent in doc.ents if ent.label_ == 'MONEY']
    events = [ent.text for ent in doc.ents if ent.label_ == 'EVENT']
    
    return {
        'persons': persons,
        'organizations': organizations,
        'locations': locations,
        'dates': dates,
        'money': money,
        'events': events
    }

print("\n=== Structured Entity Extraction ===\n")
for text in sample_texts:
    info = extract_structured_info(text)
    print(f"Text: {text[:60]}...")
    for key, values in info.items():
        if values:
            print(f"  {key}: {', '.join(values)}")
    print()

def create_entity_pairs(text):
    doc = nlp(text)
    pairs = []
    for sent in doc.sents:
        ents_in_sent = [(ent.text, ent.label_) for ent in sent.ents]
        for i in range(len(ents_in_sent)):
            for j in range(i + 1, len(ents_in_sent)):
                pairs.append({
                    'entity1': ents_in_sent[i][0],
                    'type1': ents_in_sent[i][1],
                    'entity2': ents_in_sent[j][0],
                    'type2': ents_in_sent[j][1],
                    'sentence': sent.text
                })
    return pairs

print("\n=== Entity Pairs ===\n")
for text in sample_texts[:3]:
    pairs = create_entity_pairs(text)
    if pairs:
        print(f"Text: {text[:60]}...")
        for pair in pairs[:3]:
            print(f"  {pair['entity1']} ({pair['type1']}) <-> {pair['entity2']} ({pair['type2']})")
        print()

custom_pattern = r'\b[A-Z][a-z]+ (?:Inc|Corp|LLC|Ltd|Co)\b'
tech_keywords = ['AI', 'ML', 'NLP', 'IoT', 'API', 'SaaS', 'PaaS']

print("\n=== Custom Pattern Matching ===\n")
for text in sample_texts:
    org_matches = re.findall(custom_pattern, text)
    tech_matches = [kw for kw in tech_keywords if kw in text]
    
    if org_matches or tech_matches:
        print(f"Text: {text[:60]}...")
        if org_matches:
            print(f"  Organization Patterns: {org_matches}")
        if tech_matches:
            print(f"  Tech Keywords: {tech_matches}")
        print()
```

---

### Section 19.6: Text Classification Pipeline

A complete text classification pipeline integrates preprocessing, feature extraction, model training, and evaluation. This section demonstrates production-ready pipelines with multiple algorithm comparison.

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.datasets import fetch_20newsgroups
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

categories = ['sci.space', 'rec.sport.baseball', 'comp.graphics', 'talk.politics.misc']
train_data = fetch_20newsgroups(subset='train', categories=categories, random_state=42)
test_data = fetch_20newsgroups(subset='test', categories=categories, random_state=42)

print(f"Training samples: {len(train_data.data)}")
print(f"Test samples: {len(test_data.data)}")
print(f"Categories: {train_data.target_names}")

models = {
    'Logistic Regression': Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=10000)),
        ('clf', LogisticRegression(max_iter=1000, random_state=42))
    ]),
    'Linear SVM': Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=10000)),
        ('clf', LinearSVC(max_iter=1000, random_state=42))
    ]),
    'Multinomial NB': Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=10000)),
        ('clf', MultinomialNB(alpha=0.1))
    ]),
    'Random Forest': Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1))
    ])
}

print("\n=== Model Comparison (5-Fold CV) ===\n")
cv_results = {}
for name, pipeline in models.items():
    scores = cross_val_score(pipeline, train_data.data, train_data.target, 
                             cv=5, scoring='accuracy', n_jobs=-1)
    cv_results[name] = scores
    print(f"{name:25}: {scores.mean():.4f} (+/- {scores.std():.4f})")

best_model_name = max(cv_results, key=lambda k: cv_results[k].mean())
print(f"\nBest Model: {best_model_name}")

best_pipeline = models[best_model_name]
best_pipeline.fit(train_data.data, train_data.target)
y_pred = best_pipeline.predict(test_data.data)

print(f"\n=== {best_model_name} - Test Set Results ===\n")
print(classification_report(test_data.target, y_pred, 
                           target_names=test_data.target_names))

param_grid = {
    'tfidf__max_features': [5000, 10000, 20000],
    'tfidf__ngram_range': [(1, 1), (1, 2)],
    'tfidf__min_df': [1, 2, 5]
}

grid_search = GridSearchCV(
    models['Logistic Regression'],
    param_grid,
    cv=3,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)

grid_search.fit(train_data.data, train_data.target)
print(f"\nBest Parameters: {grid_search.best_params_}")
print(f"Best CV Accuracy: {grid_search.best_score_:.4f}")

plt.figure(figsize=(10, 6))
plt.boxplot([cv_results[name] for name in cv_results.keys()],
            labels=cv_results.keys())
plt.title('Model Comparison (5-Fold CV Accuracy)')
plt.ylabel('Accuracy')
plt.xticks(rotation=45)
plt.grid(True, axis='y')
plt.tight_layout()
plt.show()

cm = confusion_matrix(test_data.target, y_pred)
plt.figure(figsize=(8, 6))
plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('Confusion Matrix')
plt.colorbar()
tick_marks = np.arange(len(categories))
plt.xticks(tick_marks, categories, rotation=45)
plt.yticks(tick_marks, categories)
plt.xlabel('Predicted Label')
plt.ylabel('True Label')
plt.tight_layout()
plt.show()

def predict_new_text(text, pipeline, target_names):
    prediction = pipeline.predict([text])[0]
    probabilities = pipeline.predict_proba([text])[0] if hasattr(pipeline, 'predict_proba') else None
    return target_names[prediction], probabilities

print("\n=== Custom Predictions ===\n")
new_texts = [
    "NASA launched a new satellite to study Mars atmosphere",
    "The baseball team won the World Series championship",
    "New graphics card released with 4K rendering capabilities",
    "The president signed a new trade agreement with China"
]

for text in new_texts:
    pred_class, probs = predict_new_text(text, best_pipeline, train_data.target_names)
    print(f"Text: {text}")
    print(f"Predicted: {pred_class}")
    if probs is not None:
        for i, cat in enumerate(train_data.target_names):
            print(f"  {cat}: {probs[i]:.4f}")
    print()
```

---

### Section 19.7: Sentiment Analysis

Sentiment analysis determines the emotional tone of text. This section covers lexicon-based approaches, machine learning classifiers, and transformer-based models for robust sentiment detection.

```python
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pandas as pd
import numpy as np
import re
import warnings
warnings.filterwarnings('ignore')

nltk.download('vader_lexicon', quiet=True)

sia = SentimentIntensityAnalyzer()

sample_reviews = [
    ("This product is amazing! Best purchase I've ever made.", "positive"),
    ("Terrible quality, broke after one week. Complete waste of money.", "negative"),
    ("The product works as expected. Nothing special but not bad either.", "neutral"),
    ("Absolutely love it! Exceeded all my expectations.", "positive"),
    ("Worst customer service experience. Never buying again.", "negative"),
    ("It's okay for the price. Does what it's supposed to do.", "neutral"),
    ("Fantastic quality and fast shipping! Highly recommend!", "positive"),
    ("The item arrived damaged and customer support was unhelpful.", "negative"),
    ("Good product overall, but could be improved in some areas.", "neutral"),
    ("Perfect! Exactly what I needed. Five stars!", "positive")
]

def analyze_sentiment_vader(text):
    scores = sia.polarity_scores(text)
    if scores['compound'] >= 0.05:
        sentiment = 'positive'
    elif scores['compound'] <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    return sentiment, scores

print("=== VADER Sentiment Analysis ===\n")
for text, true_sentiment in sample_reviews:
    pred_sentiment, scores = analyze_sentiment_vader(text)
    print(f"Text: {text[:50]}...")
    print(f"True: {true_sentiment:10} | Predicted: {pred_sentiment:10}")
    print(f"Scores: {scores}")
    print()

print("\n=== ML-Based Sentiment Analysis ===\n")

texts = [review[0] for review in sample_reviews]
labels = [review[1] for review in sample_reviews]

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.3, random_state=42, stratify=labels
)

sentiment_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=5000)),
    ('clf', LogisticRegression(max_iter=1000, random_state=42))
])

sentiment_pipeline.fit(X_train, y_train)
y_pred = sentiment_pipeline.predict(X_test)
print(classification_report(y_test, y_pred))

def comprehensive_sentiment_analysis(text):
    vader_sentiment, vader_scores = analyze_sentiment_vader(text)
    
    ml_sentiment = sentiment_pipeline.predict([text])[0]
    ml_proba = sentiment_pipeline.predict_proba([text])[0]
    ml_classes = sentiment_pipeline.classes_
    
    return {
        'text': text,
        'vader': {
            'sentiment': vader_sentiment,
            'scores': vader_scores
        },
        'ml': {
            'sentiment': ml_sentiment,
            'probabilities': dict(zip(ml_classes, ml_proba))
        }
    }

print("\n=== Comprehensive Sentiment Analysis ===\n")
test_texts = [
    "I absolutely love this new feature! It's a game changer!",
    "The update broke everything. Very disappointed.",
    "It's a decent update, nothing groundbreaking but useful."
]

for text in test_texts:
    result = comprehensive_sentiment_analysis(text)
    print(f"Text: {result['text']}")
    print(f"VADER: {result['vader']['sentiment']} (compound: {result['vader']['scores']['compound']:.3f})")
    print(f"ML:    {result['ml']['sentiment']}")
    for sentiment, prob in result['ml']['probabilities'].items():
        print(f"       {sentiment}: {prob:.3f}")
    print()

def aspect_based_sentiment(text, aspects):
    doc = nlp(text)
    sentences = list(doc.sents)
    aspect_sentiments = {}
    
    for aspect in aspects:
        aspect_lower = aspect.lower()
        relevant_sentences = [sent for sent in sentences 
                            if aspect_lower in sent.text.lower()]
        
        if relevant_sentences:
            sentiments = []
            for sent in relevant_sentences:
                _, scores = analyze_sentiment_vader(sent.text)
                sentiments.append(scores['compound'])
            aspect_sentiments[aspect] = np.mean(sentiments)
        else:
            aspect_sentiments[aspect] = 0.0
    
    return aspect_sentiments

print("\n=== Aspect-Based Sentiment Analysis ===\n")
aspects = ['camera', 'battery', 'screen', 'price', 'performance']
product_review = """
The camera quality is absolutely fantastic, takes stunning photos.
Battery life is disappointing, barely lasts a day.
Screen is bright and clear with good resolution.
Price is a bit high but worth it for the features.
Performance is smooth and fast for everyday tasks.
"""

aspect_sentiments = aspect_based_sentiment(product_review, aspects)
print(f"Review: {product_review.strip()}")
print("\nAspect Sentiments:")
for aspect, sentiment in aspect_sentiments.items():
    label = "Positive" if sentiment > 0.05 else ("Negative" if sentiment < -0.05 else "Neutral")
    print(f"  {aspect:15}: {sentiment:+.3f} ({label})")
```

---

### Module 19: Real-Time Use Cases

| Use Case | Technique | Industry | Key Metric |
|----------|-----------|----------|------------|
| Customer Review Analysis | Sentiment Analysis + VADER | E-commerce | Accuracy > 90% |
| Email Classification | TF-IDF + Logistic Regression | Technology | F1-Score > 0.95 |
| Document Categorization | LDA Topic Modeling | Legal | Coherence Score |
| Entity Extraction | SpaCy NER | Finance | Precision > 85% |
| Social Media Monitoring | Word2Vec + LSTM | Marketing | Recall > 80% |
| Chatbot Intent Detection | Text Classification Pipeline | Customer Service | Accuracy > 95% |
| News Article Tagging | Multi-label Classification | Media | Micro-F1 > 0.85 |
| Product Review Summarization | Aspect-Based Sentiment | Retail | User Satisfaction |

---

### Module 19: Project Ideas

| Project | Description | Datasets | Skills Practiced |
|---------|-------------|----------|------------------|
| Multi-language Sentiment Analyzer | Build sentiment system for multiple languages | Multilingual Reviews | SpaCy, Transfer Learning |
| News Topic Classifier | Categorize news articles automatically | 20 Newsgroups, BBC News | LDA, TF-IDF, Classification |
| Named Entity Recognition System | Custom NER for domain-specific entities | CoNLL-2003, Custom | SpaCy, BioNLP |
| Email Spam Filter | Production-ready spam detection | Enron Email Dataset | TF-IDF, Naive Bayes |
| Chatbot Intent Classifier | Intent recognition for customer support | SNIPS, Custom | Text Classification, Embeddings |

---

# MODULE 20: ML MODEL DEPLOYMENT

---

## Learning Objectives
- Serialize models with Pickle and Joblib
- Build REST APIs with FastAPI and Flask
- Containerize ML applications with Docker
- Implement model monitoring, drift detection, and CI/CD pipelines

---

### Section 20.1: Pickle & Joblib Serialization

Model serialization preserves trained models for deployment. Pickle handles general Python objects, while Joblib is optimized for large NumPy arrays commonly found in ML models.

```python
import pickle
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import os
import json
import time

data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

model.fit(X_train, y_train)
baseline_accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Baseline Accuracy: {baseline_accuracy:.4f}")

pickle_filename = 'model.pkl'
with open(pickle_filename, 'wb') as f:
    pickle.dump(model, f)

with open(pickle_filename, 'rb') as f:
    loaded_pickle_model = pickle.load(f)

pickle_accuracy = accuracy_score(y_test, loaded_pickle_model.predict(X_test))
print(f"Pickle Model Accuracy: {pickle_accuracy:.4f}")

joblib_filename = 'model.joblib'
joblib.dump(model, joblib_filename)
loaded_joblib_model = joblib.load(joblib_filename)

joblib_accuracy = accuracy_score(y_test, loaded_joblib_model.predict(X_test))
print(f"Joblib Model Accuracy: {joblib_accuracy:.4f}")

model_metadata = {
    'model_type': 'RandomForestClassifier',
    'n_estimators': 100,
    'features': list(data.feature_names),
    'target_names': list(data.target_names),
    'training_samples': len(X_train),
    'accuracy': float(baseline_accuracy),
    'sklearn_version': '1.2.0',
    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
}

with open('model_metadata.json', 'w') as f:
    json.dump(model_metadata, f, indent=2)

def save_model_complete(model, filepath, metadata=None):
    save_dict = {
        'model': model,
        'metadata': metadata or {}
    }
    with open(filepath, 'wb') as f:
        pickle.dump(save_dict, f)
    print(f"Model saved to {filepath}")
    print(f"File size: {os.path.getsize(filepath) / 1024:.2f} KB")

def load_model_complete(filepath):
    with open(filepath, 'rb') as f:
        save_dict = pickle.load(f)
    print(f"Model loaded from {filepath}")
    if save_dict.get('metadata'):
        print(f"Metadata: {save_dict['metadata']}")
    return save_dict['model']

save_model_complete(model, 'model_complete.pkl', model_metadata)
loaded_complete = load_model_complete('model_complete.pkl')

test_samples = X_test.iloc[:5]
predictions = loaded_complete.predict(test_samples)
probabilities = loaded_complete.predict_proba(test_samples)

print("\n=== Predictions ===")
for i in range(5):
    print(f"Sample {i+1}: Predicted={data.target_names[predictions[i]]}, "
          f"Probabilities={probabilities[i].round(3)}")

class ModelVersionManager:
    def __init__(self, base_path='models'):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)
    
    def save_version(self, model, version, metrics=None):
        version_dir = os.path.join(self.base_path, f'v{version}')
        os.makedirs(version_dir, exist_ok=True)
        
        model_path = os.path.join(version_dir, 'model.joblib')
        joblib.dump(model, model_path)
        
        if metrics:
            metrics_path = os.path.join(version_dir, 'metrics.json')
            with open(metrics_path, 'w') as f:
                json.dump(metrics, f, indent=2)
        
        print(f"Version {version} saved to {version_dir}")
        return version_dir
    
    def load_version(self, version):
        model_path = os.path.join(self.base_path, f'v{version}', 'model.joblib')
        return joblib.load(model_path)
    
    def list_versions(self):
        versions = []
        if os.path.exists(self.base_path):
            for item in os.listdir(self.base_path):
                if item.startswith('v'):
                    versions.append(item[1:])
        return sorted(versions)

vm = ModelVersionManager()
vm.save_version(model, '1.0', {'accuracy': baseline_accuracy, 'timestamp': time.strftime('%Y-%m-%d')})
vm.save_version(model, '1.1', {'accuracy': baseline_accuracy, 'timestamp': time.strftime('%Y-%m-%d')})

print(f"\nAvailable versions: {vm.list_versions()}")
loaded_v1 = vm.load_version('1.0')

for filename in ['model.pkl', 'model.joblib', 'model_complete.pkl', 'model_metadata.json']:
    if os.path.exists(filename):
        os.remove(filename)

import shutil
if os.path.exists('models'):
    shutil.rmtree('models')
```

---

### Section 20.2: FastAPI Model Serving

FastAPI provides high-performance async API serving for ML models. It automatically generates API documentation and supports request validation with Pydantic models.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import joblib
import json
import uvicorn

app = FastAPI(
    title="ML Model API",
    description="Production ML model serving with FastAPI",
    version="1.0.0"
)

class PredictionRequest(BaseModel):
    features: List[float] = Field(..., description="Input features for prediction")
    return_probabilities: bool = Field(False, description="Return class probabilities")
    
    class Config:
        json_schema_extra = {
            "example": {
                "features": [17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871],
                "return_probabilities": True
            }
        }

class PredictionResponse(BaseModel):
    prediction: int
    prediction_label: str
    probabilities: Optional[dict] = None
    confidence: float

class BatchPredictionRequest(BaseModel):
    instances: List[List[float]]
    return_probabilities: bool = False

class BatchPredictionResponse(BaseModel):
    predictions: List[int]
    prediction_labels: List[str]
    count: int

class ModelInfo(BaseModel):
    model_type: str
    n_features: int
    n_classes: int
    feature_names: List[str]
    target_names: List[str]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str

model = None
model_metadata = None

@app.on_event("startup")
async def load_model():
    global model, model_metadata
    try:
        from sklearn.datasets import load_breast_cancer
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import train_test_split
        from sklearn.pipeline import Pipeline
        from sklearn.preprocessing import StandardScaler
        
        data = load_breast_cancer()
        X_train, X_test, y_train, y_test = train_test_split(
            data.data, data.target, test_size=0.2, random_state=42
        )
        
        model = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        model.fit(X_train, y_train)
        
        model_metadata = {
            'model_type': 'RandomForestClassifier',
            'n_features': data.data.shape[1],
            'n_classes': len(data.target_names),
            'feature_names': list(data.feature_names),
            'target_names': list(data.target_names),
            'version': '1.0.0'
        }
        
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy" if model is not None else "unhealthy",
        model_loaded=model is not None,
        version="1.0.0"
    )

@app.get("/model/info", response_model=ModelInfo)
async def get_model_info():
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return ModelInfo(**model_metadata)

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if len(request.features) != model_metadata['n_features']:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {model_metadata['n_features']} features, got {len(request.features)}"
        )
    
    features_array = np.array(request.features).reshape(1, -1)
    prediction = model.predict(features_array)[0]
    probabilities = model.predict_proba(features_array)[0]
    
    response = PredictionResponse(
        prediction=int(prediction),
        prediction_label=model_metadata['target_names'][prediction],
        confidence=float(np.max(probabilities))
    )
    
    if request.return_probabilities:
        response.probabilities = {
            name: float(prob)
            for name, prob in zip(model_metadata['target_names'], probabilities)
        }
    
    return response

@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    instances_array = np.array(request.instances)
    
    if instances_array.shape[1] != model_metadata['n_features']:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {model_metadata['n_features']} features per instance"
        )
    
    predictions = model.predict(instances_array)
    prediction_labels = [model_metadata['target_names'][p] for p in predictions]
    
    return BatchPredictionResponse(
        predictions=predictions.tolist(),
        prediction_labels=prediction_labels,
        count=len(predictions)
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

### Section 20.3: Docker Containerization

Docker packages ML applications with all dependencies into portable containers. This ensures consistent behavior across development, testing, and production environments.

```python
# save this as docker_ml_example.py for reference

dockerfile_content = """
# Dockerfile for ML Model Serving
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

requirements_content = """
fastapi==0.104.1
uvicorn==0.24.0
scikit-learn==1.3.2
numpy==1.24.3
pandas==2.1.3
joblib==1.3.2
pydantic==2.5.0
"""

docker_compose_content = """
version: '3.8'

services:
  ml-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_VERSION=1.0.0
      - LOG_LEVEL=info
    volumes:
      - ./models:/app/models
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
"""

dockerignore_content = """
__pycache__
*.pyc
*.pyo
.git
.gitignore
.env
.venv
venv
*.md
tests/
"""

print("=== Docker Configuration Files ===\n")
print("Dockerfile:")
print(dockerfile_content)
print("\nrequirements.txt:")
print(requirements_content)
print("\ndocker-compose.yml:")
print(docker_compose_content)
print("\n.dockerignore:")
print(dockerignore_content)

build_commands = """
# Build the Docker image
docker build -t ml-model-api:latest .

# Run the container
docker run -d -p 8000:8000 --name ml-api ml-model-api:latest

# Run with GPU support (if needed)
docker run -d -p 8000:8000 --gpus all --name ml-api ml-model-api:latest

# Check running containers
docker ps

# View logs
docker logs ml-api

# Test the API
curl http://localhost:8000/health
curl -X POST http://localhost:8000/predict \\
     -H "Content-Type: application/json" \\
     -d '{"features": [17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871], "return_probabilities": true}'

# Stop and remove container
docker stop ml-api
docker rm ml-api

# Docker Compose
docker-compose up -d
docker-compose down
"""

print("\n=== Docker Commands ===")
print(build_commands)

class DockerMLManager:
    def __init__(self, image_name, container_name):
        self.image_name = image_name
        self.container_name = container_name
    
    def create_dockerfile(self, app_file='main.py', port=8000):
        dockerfile = f"""
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE {port}
CMD ["uvicorn", "{app_file.replace('.py', '')}:app", "--host", "0.0.0.0", "--port", "{port}"]
"""
        with open('Dockerfile', 'w') as f:
            f.write(dockerfile)
        print(f"Dockerfile created for {app_file}")
    
    def create_requirements(self, packages):
        with open('requirements.txt', 'w') as f:
            f.write('\n'.join(packages))
        print(f"requirements.txt created with {len(packages)} packages")

docker_mgr = DockerMLManager('ml-api', 'ml-api-container')
docker_mgr.create_requirements([
    'fastapi==0.104.1',
    'uvicorn==0.24.0',
    'scikit-learn==1.3.2',
    'numpy==1.24.3',
    'joblib==1.3.2'
])
```

---

### Section 20.4: Flask REST API

Flask provides a lightweight alternative to FastAPI for ML model serving. It's simpler to set up and widely used in production environments.

```python
from flask import Flask, request, jsonify
import numpy as np
import joblib
import logging
from functools import wraps
import time

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model = None
model_metadata = None

def init_model():
    global model, model_metadata
    from sklearn.datasets import load_breast_cancer
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler
    
    data = load_breast_cancer()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )
    
    model = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    model.fit(X_train, y_train)
    
    model_metadata = {
        'model_type': 'RandomForestClassifier',
        'n_features': data.data.shape[1],
        'n_classes': len(data.target_names),
        'feature_names': list(data.feature_names),
        'target_names': list(data.target_names),
        'accuracy': float(model.score(X_test, y_test))
    }
    
    logger.info("Model loaded successfully")

def require_model(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 503
        return f(*args, **kwargs)
    return decorated_function

def timer(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        result = f(*args, **kwargs)
        elapsed = time.time() - start_time
        logger.info(f"{f.__name__} executed in {elapsed:.4f}s")
        return result
    return decorated_function

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy' if model else 'unhealthy',
        'model_loaded': model is not None
    })

@app.route('/model/info', methods=['GET'])
@require_model
def model_info():
    return jsonify(model_metadata)

@app.route('/predict', methods=['POST'])
@require_model
@timer
def predict():
    try:
        data = request.get_json()
        
        if 'features' not in data:
            return jsonify({'error': 'Missing "features" field'}), 400
        
        features = np.array(data['features']).reshape(1, -1)
        
        if features.shape[1] != model_metadata['n_features']:
            return jsonify({
                'error': f'Expected {model_metadata["n_features"]} features, '
                         f'got {features.shape[1]}'
            }), 400
        
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        response = {
            'prediction': int(prediction),
            'prediction_label': model_metadata['target_names'][prediction],
            'confidence': float(np.max(probabilities))
        }
        
        if data.get('return_probabilities', False):
            response['probabilities'] = {
                name: float(prob)
                for name, prob in zip(model_metadata['target_names'], probabilities)
            }
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict/batch', methods=['POST'])
@require_model
@timer
def predict_batch():
    try:
        data = request.get_json()
        
        if 'instances' not in data:
            return jsonify({'error': 'Missing "instances" field'}), 400
        
        instances = np.array(data['instances'])
        
        if instances.shape[1] != model_metadata['n_features']:
            return jsonify({
                'error': f'Expected {model_metadata["n_features"]} features per instance'
            }), 400
        
        predictions = model.predict(instances)
        probabilities = model.predict_proba(instances)
        
        response = {
            'predictions': predictions.tolist(),
            'prediction_labels': [model_metadata['target_names'][p] for p in predictions],
            'confidences': np.max(probabilities, axis=1).tolist(),
            'count': len(predictions)
        }
        
        if data.get('return_probabilities', False):
            response['probabilities'] = probabilities.tolist()
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_model()
    app.run(host='0.0.0.0', port=5000, debug=False)
```

---

### Section 20.5: Model Monitoring & Drift Detection

Production ML models degrade over time due to data drift, concept drift, and changing patterns. Monitoring systems detect degradation and trigger retraining when necessary.

```python
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score
from collections import deque
import warnings
warnings.filterwarnings('ignore')

class DataDriftDetector:
    def __init__(self, reference_data, threshold=0.05):
        self.reference_data = reference_data
        self.threshold = threshold
        self.reference_stats = self._compute_stats(reference_data)
    
    def _compute_stats(self, data):
        return {
            'mean': np.mean(data, axis=0),
            'std': np.std(data, axis=0),
            'median': np.median(data, axis=0),
            'q25': np.percentile(data, 25, axis=0),
            'q75': np.percentile(data, 75, axis=0)
        }
    
    def detect_drift(self, new_data):
        drift_results = {}
        
        for i in range(new_data.shape[1]):
            ks_stat, ks_pvalue = stats.ks_2samp(
                self.reference_data[:, i], new_data[:, i]
            )
            
            t_stat, t_pvalue = stats.ttest_ind(
                self.reference_data[:, i], new_data[:, i]
            )
            
            drift_detected = ks_pvalue < self.threshold
            
            drift_results[f'feature_{i}'] = {
                'ks_statistic': ks_stat,
                'ks_pvalue': ks_pvalue,
                'ttest_pvalue': t_pvalue,
                'drift_detected': drift_detected,
                'reference_mean': self.reference_stats['mean'][i],
                'new_mean': np.mean(new_data[:, i]),
                'mean_shift': abs(np.mean(new_data[:, i]) - self.reference_stats['mean'][i])
            }
        
        total_drifted = sum(1 for r in drift_results.values() if r['drift_detected'])
        
        return {
            'features': drift_results,
            'total_features_drifted': total_drifted,
            'drift_percentage': total_drifted / len(drift_results),
            'overall_drift': total_drifted > 0
        }

class ConceptDriftDetector:
    def __init__(self, window_size=100, threshold=0.1):
        self.window_size = window_size
        self.threshold = threshold
        self.predictions = deque(maxlen=window_size)
        self.true_labels = deque(maxlen=window_size)
        self.performance_history = []
    
    def update(self, prediction, true_label):
        self.predictions.append(prediction)
        self.true_labels.append(true_label)
        
        if len(self.predictions) >= self.window_size:
            current_accuracy = accuracy_score(
                list(self.true_labels), list(self.predictions)
            )
            self.performance_history.append(current_accuracy)
            
            if len(self.performance_history) > 1:
                performance_drop = (
                    self.performance_history[-2] - current_accuracy
                )
                return performance_drop > self.threshold
        
        return False
    
    def get_performance_trend(self):
        return {
            'current_accuracy': self.performance_history[-1] if self.performance_history else None,
            'mean_accuracy': np.mean(self.performance_history) if self.performance_history else None,
            'accuracy_trend': np.polyfit(range(len(self.performance_history)),
                                        self.performance_history, 1)[0] if len(self.performance_history) > 1 else None,
            'measurements': len(self.performance_history)
        }

class ModelMonitor:
    def __init__(self, reference_data):
        self.drift_detector = DataDriftDetector(reference_data)
        self.concept_detector = ConceptDriftDetector()
        self.alerts = []
        self.metrics_log = []
    
    def log_prediction(self, features, prediction, true_label=None):
        self.metrics_log.append({
            'features': features,
            'prediction': prediction,
            'true_label': true_label,
            'timestamp': pd.Timestamp.now()
        })
        
        if true_label is not None:
            concept_drift = self.concept_detector.update(prediction, true_label)
            if concept_drift:
                self.alerts.append({
                    'type': 'concept_drift',
                    'timestamp': pd.Timestamp.now(),
                    'message': 'Concept drift detected - model performance degrading'
                })
    
    def check_data_drift(self, new_data):
        drift_results = self.drift_detector.detect_drift(new_data)
        
        if drift_results['overall_drift']:
            self.alerts.append({
                'type': 'data_drift',
                'timestamp': pd.Timestamp.now(),
                'message': f"Data drift detected in {drift_results['total_features_drifted']} features",
                'details': drift_results
            })
        
        return drift_results
    
    def get_health_report(self):
        return {
            'total_predictions': len(self.metrics_log),
            'alerts': self.alerts,
            'performance_trend': self.concept_detector.get_performance_trend(),
            'drift_detector_ready': self.drift_detector is not None
        }

np.random.seed(42)
reference_data = np.random.randn(1000, 10)

monitor = ModelMonitor(reference_data)

drifted_data = np.random.randn(200, 10) + 0.5
drift_results = monitor.check_data_drift(drifted_data)

print("=== Data Drift Detection Results ===")
print(f"Total features drifted: {drift_results['total_features_drifted']}")
print(f"Drift percentage: {drift_results['drift_percentage']:.2%}")

print("\n=== Feature-Level Drift ===")
for feature, result in drift_results['features'].items():
    if result['drift_detected']:
        print(f"\n{feature}: DRIFT DETECTED")
        print(f"  KS p-value: {result['ks_pvalue']:.6f}")
        print(f"  Mean shift: {result['mean_shift']:.4f}")

for _ in range(150):
    correct = np.random.random() > 0.1
    prediction = 1 if correct else 0
    true_label = 1
    monitor.log_prediction(np.random.randn(10), prediction, true_label)

health_report = monitor.get_health_report()
print("\n=== Health Report ===")
print(f"Total predictions logged: {health_report['total_predictions']}")
print(f"Total alerts: {len(health_report['alerts'])}")
print(f"Performance trend: {health_report['performance_trend']}")
```

---

### Section 20.6: CI/CD for ML

CI/CD pipelines for ML automate model training, testing, validation, and deployment. This ensures reproducibility, quality gates, and safe rollouts in production.

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib
import json
import os
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional
import warnings
warnings.filterwarnings('ignore')

@dataclass
class ModelMetrics:
    accuracy: float
    f1_score: float
    precision: float
    recall: float
    cv_mean: float
    cv_std: float
    training_time: float
    timestamp: str
    
    def meets_thresholds(self, thresholds: Dict[str, float]) -> bool:
        for metric, threshold in thresholds.items():
            if getattr(self, metric, 0) < threshold:
                return False
        return True

@dataclass
class ExperimentConfig:
    model_type: str
    hyperparameters: Dict
    features_used: List[str]
    training_samples: int
    test_samples: int

class MLExperimentTracker:
    def __init__(self, experiment_dir='experiments'):
        self.experiment_dir = experiment_dir
        os.makedirs(experiment_dir, exist_ok=True)
        self.experiments = []
    
    def log_experiment(self, config: ExperimentConfig, metrics: ModelMetrics, model):
        experiment_id = f"exp_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        experiment_dir = os.path.join(self.experiment_dir, experiment_id)
        os.makedirs(experiment_dir, exist_ok=True)
        
        with open(os.path.join(experiment_dir, 'config.json'), 'w') as f:
            json.dump(asdict(config), f, indent=2)
        
        with open(os.path.join(experiment_dir, 'metrics.json'), 'w') as f:
            json.dump(asdict(metrics), f, indent=2)
        
        joblib.dump(model, os.path.join(experiment_dir, 'model.joblib'))
        
        self.experiments.append({
            'id': experiment_id,
            'config': asdict(config),
            'metrics': asdict(metrics)
        })
        
        return experiment_id
    
    def compare_experiments(self):
        if not self.experiments:
            return "No experiments logged"
        
        df = pd.DataFrame([
            {
                'id': exp['id'],
                'accuracy': exp['metrics']['accuracy'],
                'f1_score': exp['metrics']['f1_score'],
                'cv_mean': exp['metrics']['cv_mean']
            }
            for exp in self.experiments
        ])
        return df.sort_values('accuracy', ascending=False)

class MLCIPipeline:
    def __init__(self, quality_thresholds=None):
        self.quality_thresholds = quality_thresholds or {
            'accuracy': 0.85,
            'f1_score': 0.80,
            'precision': 0.80,
            'recall': 0.80
        }
        self.tracker = MLExperimentTracker()
        self.stage_results = []
    
    def validate_data(self, X, y):
        checks = {
            'no_nulls': not np.any(np.isnan(X)),
            'sufficient_samples': len(X) >= 100,
            'balanced_classes': len(np.unique(y)) >= 2,
            'feature_count': X.shape[1] > 0
        }
        
        all_passed = all(checks.values())
        self.stage_results.append({
            'stage': 'data_validation',
            'passed': all_passed,
            'checks': checks
        })
        
        return all_passed, checks
    
    def train_and_evaluate(self, X, y, model_params=None):
        import time
        start_time = time.time()
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        params = model_params or {'n_estimators': 100, 'random_state': 42}
        
        model = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier(**params))
        ])
        
        model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        y_pred = model.predict(X_test)
        
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
        
        metrics = ModelMetrics(
            accuracy=accuracy_score(y_test, y_pred),
            f1_score=f1_score(y_test, y_pred, average='weighted'),
            precision=precision_score(y_test, y_pred, average='weighted'),
            recall=recall_score(y_test, y_pred, average='weighted'),
            cv_mean=cv_scores.mean(),
            cv_std=cv_scores.std(),
            training_time=training_time,
            timestamp=datetime.now().isoformat()
        )
        
        config = ExperimentConfig(
            model_type='RandomForestClassifier',
            hyperparameters=params,
            features_used=[f'feature_{i}' for i in range(X.shape[1])],
            training_samples=len(X_train),
            test_samples=len(X_test)
        )
        
        experiment_id = self.tracker.log_experiment(config, metrics, model)
        
        self.stage_results.append({
            'stage': 'training',
            'passed': True,
            'experiment_id': experiment_id
        })
        
        return metrics, experiment_id
    
    def quality_gate(self, metrics: ModelMetrics):
        meets = metrics.meets_thresholds(self.quality_thresholds)
        
        details = {}
        for metric, threshold in self.quality_thresholds.items():
            value = getattr(metrics, metric, 0)
            details[metric] = {
                'value': value,
                'threshold': threshold,
                'passed': value >= threshold
            }
        
        self.stage_results.append({
            'stage': 'quality_gate',
            'passed': meets,
            'details': details
        })
        
        return meets, details
    
    def deploy(self, model_path, version):
        self.stage_results.append({
            'stage': 'deployment',
            'passed': True,
            'version': version
        })
        return True
    
    def run_pipeline(self, X, y, model_params=None, version='1.0.0'):
        print("=== ML CI/CD Pipeline Execution ===\n")
        
        print("Stage 1: Data Validation")
        data_valid, checks = self.validate_data(X, y)
        print(f"  Status: {'PASSED' if data_valid else 'FAILED'}")
        print(f"  Checks: {checks}")
        
        if not data_valid:
            print("\nPipeline stopped: Data validation failed")
            return False
        
        print("\nStage 2: Model Training & Evaluation")
        metrics, exp_id = self.train_and_evaluate(X, y, model_params)
        print(f"  Experiment ID: {exp_id}")
        print(f"  Accuracy: {metrics.accuracy:.4f}")
        print(f"  F1 Score: {metrics.f1_score:.4f}")
        print(f"  CV Score: {metrics.cv_mean:.4f} (+/- {metrics.cv_std:.4f})")
        
        print("\nStage 3: Quality Gate")
        meets_quality, details = self.quality_gate(metrics)
        print(f"  Status: {'PASSED' if meets_quality else 'FAILED'}")
        for metric, info in details.items():
            status = 'âœ“' if info['passed'] else 'âœ—'
            print(f"  {status} {metric}: {info['value']:.4f} (threshold: {info['threshold']:.4f})")
        
        if not meets_quality:
            print("\nPipeline stopped: Quality gate failed")
            return False
        
        print("\nStage 4: Deployment")
        self.deploy(f"experiments/{exp_id}/model.joblib", version)
        print(f"  Status: DEPLOYED")
        print(f"  Version: {version}")
        
        print("\n=== Pipeline Complete ===")
        return True

from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target

pipeline = MLCIPipeline()
pipeline.run_pipeline(X, y, version='1.0.0')

print("\n=== Experiment Comparison ===")
comparison = pipeline.tracker.compare_experiments()
print(comparison)
```

---

### Section 20.7: A/B Testing Framework

A/B testing compares model variants to determine which performs better in production. This framework handles traffic splitting, statistical significance testing, and automated decision making.

```python
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

@dataclass
class ABTestConfig:
    name: str
    model_a_name: str
    model_b_name: str
    traffic_split: float = 0.5
    min_samples_per_variant: int = 1000
    significance_level: float = 0.05
    primary_metric: str = 'accuracy'
    secondary_metrics: List[str] = field(default_factory=lambda: ['precision', 'recall', 'f1'])

@dataclass
class TestResult:
    metric: str
    model_a_value: float
    model_b_value: float
    p_value: float
    significant: bool
    winner: str
    confidence_interval: tuple

class ABTestFramework:
    def __init__(self, config: ABTestConfig):
        self.config = config
        self.results_a = []
        self.results_b = []
        self.labels_a = []
        self.labels_b = []
        self.timestamps = []
    
    def assign_variant(self, user_id: int) -> str:
        hash_val = hash(str(user_id)) % 100
        return 'A' if hash_val < self.config.traffic_split * 100 else 'B'
    
    def log_prediction(self, user_id: int, prediction: int, true_label: int):
        variant = self.assign_variant(user_id)
        
        if variant == 'A':
            self.results_a.append(prediction)
            self.labels_a.append(true_label)
        else:
            self.results_b.append(prediction)
            self.labels_b.append(true_label)
        
        self.timestamps.append(datetime.now())
    
    def get_sample_sizes(self):
        return {
            'model_a': len(self.results_a),
            'model_b': len(self.results_b),
            'total': len(self.results_a) + len(self.results_b)
        }
    
    def calculate_metric(self, y_true, y_pred, metric):
        if metric == 'accuracy':
            return accuracy_score(y_true, y_pred)
        elif metric == 'precision':
            return precision_score(y_true, y_pred, average='weighted', zero_division=0)
        elif metric == 'recall':
            return recall_score(y_true, y_pred, average='weighted', zero_division=0)
        elif metric == 'f1':
            return f1_score(y_true, y_pred, average='weighted', zero_division=0)
        return None
    
    def run_significance_test(self):
        sample_sizes = self.get_sample_sizes()
        
        if (sample_sizes['model_a'] < self.config.min_samples_per_variant or
            sample_sizes['model_b'] < self.config.min_samples_per_variant):
            return {
                'status': 'insufficient_data',
                'message': f"Need at least {self.config.min_samples_per_variant} samples per variant",
                'current_samples': sample_sizes
            }
        
        results = []
        
        for metric in [self.config.primary_metric] + self.config.secondary_metrics:
            scores_a = [self.calculate_metric([l], [p], metric) 
                       for l, p in zip(self.labels_a, self.results_a)]
            scores_b = [self.calculate_metric([l], [p], metric) 
                       for l, p in zip(self.labels_b, self.results_b)]
            
            mean_a = np.mean(scores_a)
            mean_b = np.mean(scores_b)
            
            t_stat, p_value = stats.ttest_ind(scores_a, scores_b)
            
            significant = p_value < self.config.significance_level
            
            if mean_a > mean_b:
                winner = self.config.model_a_name
            elif mean_b > mean_a:
                winner = self.config.model_b_name
            else:
                winner = 'tie'
            
            ci_a = stats.t.interval(0.95, len(scores_a)-1, 
                                    loc=mean_a, 
                                    scale=stats.sem(scores_a))
            ci_b = stats.t.interval(0.95, len(scores_b)-1, 
                                    loc=mean_b, 
                                    scale=stats.sem(scores_b))
            
            results.append(TestResult(
                metric=metric,
                model_a_value=mean_a,
                model_b_value=mean_b,
                p_value=p_value,
                significant=significant,
                winner=winner if significant else 'no_winner',
                confidence_interval=(ci_a, ci_b)
            ))
        
        return {
            'status': 'complete',
            'results': results,
            'sample_sizes': sample_sizes,
            'primary_result': next(r for r in results if r.metric == self.config.primary_metric)
        }
    
    def get_recommendation(self):
        test_results = self.run_significance_test()
        
        if test_results['status'] == 'insufficient_data':
            return {
                'recommendation': 'WAIT',
                'reason': 'Insufficient data for statistical significance',
                'details': test_results['message']
            }
        
        primary = test_results['primary_result']
        
        if primary.significant:
            if primary.winner == self.config.model_a_name:
                return {
                    'recommendation': 'SHIP_MODEL_A',
                    'reason': f"Model A significantly outperforms Model B on {primary.metric}",
                    'lift': primary.model_a_value - primary.model_b_value,
                    'confidence': 1 - primary.p_value
                }
            elif primary.winner == self.config.model_b_name:
                return {
                    'recommendation': 'SHIP_MODEL_B',
                    'reason': f"Model B significantly outperforms Model A on {primary.metric}",
                    'lift': primary.model_b_value - primary.model_a_value,
                    'confidence': 1 - primary.p_value
                }
        else:
            return {
                'recommendation': 'CONTINUE_TEST',
                'reason': f"No significant difference detected (p={primary.p_value:.4f})",
                'current_winner': primary.winner
            }
    
    def generate_report(self):
        test_results = self.run_significance_test()
        recommendation = self.get_recommendation()
        
        report = {
            'test_name': self.config.name,
            'timestamp': datetime.now().isoformat(),
            'configuration': {
                'model_a': self.config.model_a_name,
                'model_b': self.config.model_b_name,
                'traffic_split': self.config.traffic_split,
                'significance_level': self.config.significance_level,
                'primary_metric': self.config.primary_metric
            },
            'sample_sizes': test_results.get('sample_sizes', {}),
            'recommendation': recommendation,
            'detailed_results': []
        }
        
        if test_results['status'] == 'complete':
            for result in test_results['results']:
                report['detailed_results'].append({
                    'metric': result.metric,
                    'model_a': result.model_a_value,
                    'model_b': result.model_b_value,
                    'p_value': result.p_value,
                    'significant': result.significant,
                    'winner': result.winner
                })
        
        return report

np.random.seed(42)

config = ABTestConfig(
    name="Model_v1_vs_v2_Test",
    model_a_name="RandomForest_v1",
    model_b_name="GradientBoosting_v2",
    traffic_split=0.5,
    min_samples_per_variant=100,
    significance_level=0.05,
    primary_metric='accuracy'
)

ab_test = ABTestFramework(config)

from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.3, random_state=42
)

model_a = RandomForestClassifier(n_estimators=100, random_state=42)
model_b = GradientBoostingClassifier(n_estimators=100, random_state=42)

model_a.fit(X_train, y_train)
model_b.fit(X_train, y_train)

for i in range(500):
    idx = np.random.choice(len(X_test))
    features = X_test[idx:idx+1]
    true_label = y_test[idx]
    
    pred_a = model_a.predict(features)[0]
    pred_b = model_b.predict(features)[0]
    
    ab_test.log_prediction



---


# COURSE 4: DEEP LEARNING WITH TENSORFLOW

## Edureka Generative AI Masters Program

### Course Overview

This course provides a comprehensive journey through deep learning, from neural network fundamentals to cutting-edge transformer architectures. Through 5 intensive modules, you'll master TensorFlow/Keras, build computer vision systems, process sequential data, generate creative content with GANs, and harness the power of transformers for state-of-the-art NLP tasks.

**Duration:** 40 Hours
**Prerequisites:** Course 3 (Machine Learning Foundations)
**Tools:** TensorFlow 2.x, Keras, NumPy, Matplotlib, Hugging Face Transformers

---

---

## MODULE 21: NEURAL NETWORKS FUNDAMENTALS

### Learning Objectives
- Understand the mathematical foundations of neural networks
- Build and train deep learning models with TensorFlow/Keras
- Implement regularization techniques to prevent overfitting
- Apply learning rate scheduling for optimal convergence

---

### Section 1: Perceptrons & Multi-Layer Perceptrons (MLPs)

#### Single Perceptron Implementation

A perceptron is the simplest neural network unit â€” a single neuron that computes a weighted sum of inputs, adds a bias, and passes the result through an activation function.

```python
import numpy as np
import matplotlib.pyplot as plt

class SinglePerceptron:
    def __init__(self, n_inputs, learning_rate=0.01):
        self.weights = np.random.randn(n_inputs) * 0.01
        self.bias = 0.0
        self.lr = learning_rate

    def activation(self, z):
        return 1 if z >= 0 else 0

    def predict(self, X):
        z = np.dot(X, self.weights) + self.bias
        return self.activation(z)

    def train(self, X, y, epochs=100):
        errors = []
        for epoch in range(epochs):
            total_error = 0
            for xi, yi in zip(X, y):
                prediction = self.predict(xi)
                error = yi - prediction
                self.weights += self.lr * error * xi
                self.bias += self.lr * error
                total_error += abs(error)
            errors.append(total_error)
            if total_error == 0:
                print(f"Converged at epoch {epoch}")
                break
        return errors

# AND Gate
X_and = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_and = np.array([0, 0, 0, 1])

perc = SinglePerceptron(n_inputs=2, learning_rate=0.1)
errors = perc.train(X_and, y_and, epochs=20)

for xi, yi in zip(X_and, y_and):
    print(f"Input: {xi}, Target: {yi}, Predicted: {perc.predict(xi)}")
```

#### Multi-Layer Perceptron from Scratch

```python
import numpy as np

class MLP:
    def __init__(self, layer_sizes, learning_rate=0.01):
        self.weights = []
        self.biases = []
        self.lr = learning_rate

        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * np.sqrt(2.0 / layer_sizes[i])
            b = np.zeros((1, layer_sizes[i+1]))
            self.weights.append(w)
            self.biases.append(b)

    def relu(self, z):
        return np.maximum(0, z)

    def relu_derivative(self, z):
        return (z > 0).astype(float)

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def forward(self, X):
        self.activations = [X]
        self.z_values = []

        for i in range(len(self.weights) - 1):
            z = self.activations[-1] @ self.weights[i] + self.biases[i]
            self.z_values.append(z)
            a = self.relu(z)
            self.activations.append(a)

        z = self.activations[-1] @ self.weights[-1] + self.biases[-1]
        self.z_values.append(z)
        output = self.softmax(z)
        self.activations.append(output)
        return output

    def compute_loss(self, y_pred, y_true):
        m = y_true.shape[0]
        log_likelihood = -np.sum(y_true * np.log(y_pred + 1e-8)) / m
        return log_likelihood

    def backward(self, y_true):
        m = y_true.shape[0]
        self.dW = []
        self.dB = []

        delta = self.activations[-1] - y_true

        for i in range(len(self.weights) - 1, -1, -1):
            dW = self.activations[i].T @ delta / m
            dB = np.sum(delta, axis=0, keepdims=True) / m
            self.dW.insert(0, dW)
            self.dB.insert(0, dB)

            if i > 0:
                delta = delta @ self.weights[i].T * self.relu_derivative(self.z_values[i-1])

        for i in range(len(self.weights)):
            self.weights[i] -= self.lr * self.dW[i]
            self.biases[i] -= self.lr * self.dB[i]

    def train(self, X, y, epochs=1000, batch_size=32):
        history = []
        for epoch in range(epochs):
            indices = np.random.permutation(X.shape[0])
            epoch_loss = 0
            batches = 0

            for start in range(0, X.shape[0], batch_size):
                end = min(start + batch_size, X.shape[0])
                idx = indices[start:end]
                X_batch, y_batch = X[idx], y[idx]

                output = self.forward(X_batch)
                loss = self.compute_loss(output, y_batch)
                self.backward(y_batch)
                epoch_loss += loss
                batches += 1

            history.append(epoch_loss / batches)
            if epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {history[-1]:.4f}")

        return history

# XOR Problem â€” requires hidden layers
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_onehot = np.array([[1, 0], [0, 1], [0, 1], [1, 0]])

mlp = MLP(layer_sizes=[2, 8, 2], learning_rate=0.1)
history = mlp.train(X, y_onehot, epochs=2000)

predictions = mlp.forward(X)
print("\nXOR Predictions:")
for xi, pred, actual in zip(X, predictions, y_onehot):
    print(f"  {xi} -> {np.argmax(pred)} (target: {np.argmax(actual)})")
```

#### Visualizing Decision Boundaries

```python
import numpy as np
import matplotlib.pyplot as plt

def plot_decision_boundary(model, X, y, title="Decision Boundary"):
    x_min, x_max = X[:, 0].min() - 0.5, X[:, 0].max() + 0.5
    y_min, y_max = X[:, 1].min() - 0.5, X[:, 1].max() + 0.5
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 200),
                          np.linspace(y_min, y_max, 200))
    grid = np.c_[xx.ravel(), yy.ravel()]
    probs = model.forward(grid)
    Z = np.argmax(probs, axis=1).reshape(xx.shape)

    plt.figure(figsize=(8, 6))
    plt.contourf(xx, yy, Z, alpha=0.3, cmap='RdYlBu')
    plt.scatter(X[:, 0], X[:, 1], c=np.argmax(y, axis=1),
                cmap='RdYlBu', edgecolors='black', s=100)
    plt.title(title)
    plt.xlabel('Feature 1')
    plt.ylabel('Feature 2')
    plt.colorbar()
    plt.show()

# Plot for XOR
plot_decision_boundary(mlp, X, y_onehot, "MLP Decision Boundary â€” XOR Problem")
```

---

### Section 2: Activation Functions

#### Comprehensive Activation Functions with Derivatives

```python
import numpy as np
import matplotlib.pyplot as plt

class ActivationFunctions:
    @staticmethod
    def sigmoid(z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    @staticmethod
    def sigmoid_derivative(z):
        s = ActivationFunctions.sigmoid(z)
        return s * (1 - s)

    @staticmethod
    def tanh(z):
        return np.tanh(z)

    @staticmethod
    def tanh_derivative(z):
        return 1 - np.tanh(z) ** 2

    @staticmethod
    def relu(z):
        return np.maximum(0, z)

    @staticmethod
    def relu_derivative(z):
        return (z > 0).astype(float)

    @staticmethod
    def leaky_relu(z, alpha=0.01):
        return np.where(z > 0, z, alpha * z)

    @staticmethod
    def leaky_relu_derivative(z, alpha=0.01):
        return np.where(z > 0, 1.0, alpha)

    @staticmethod
    def elu(z, alpha=1.0):
        return np.where(z > 0, z, alpha * (np.exp(np.clip(z, -500, 500)) - 1))

    @staticmethod
    def gelu(z):
        return 0.5 * z * (1 + np.tanh(np.sqrt(2 / np.pi) * (z + 0.044715 * z**3)))

    @staticmethod
    def swish(z, beta=1.0):
        return z * ActivationFunctions.sigmoid(beta * z)

af = ActivationFunctions()
z = np.linspace(-5, 5, 500)

functions = {
    'Sigmoid': af.sigmoid(z),
    'Tanh': af.tanh(z),
    'ReLU': af.relu(z),
    'Leaky ReLU': af.leaky_relu(z),
    'ELU': af.elu(z),
    'GELU': af.gelu(z),
    'Swish': af.swish(z),
}

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
for ax, (name, values) in zip(axes.ravel(), functions.items()):
    ax.plot(z, values, linewidth=2, color='steelblue')
    ax.set_title(name, fontsize=14)
    ax.grid(True, alpha=0.3)
    ax.axhline(y=0, color='black', linewidth=0.5)
    ax.axvline(x=0, color='black', linewidth=0.5)

axes[1, 3].axis('off')
plt.tight_layout()
plt.suptitle("Activation Functions Comparison", fontsize=16, y=1.02)
plt.show()
```

#### Demonstrating Vanishing Gradient Problem

```python
import numpy as np
import matplotlib.pyplot as plt

z = np.linspace(-5, 5, 500)

derivatives = {
    'Sigmoid': 1 / (1 + np.exp(-z)) * (1 - 1 / (1 + np.exp(-z))),
    'Tanh': 1 - np.tanh(z)**2,
    'ReLU': (z > 0).astype(float),
}

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
for ax, (name, deriv) in zip(axes, derivatives.items()):
    ax.plot(z, deriv, linewidth=2, color='crimson')
    ax.set_title(f"{name} Derivative", fontsize=13)
    ax.grid(True, alpha=0.3)
    ax.set_ylim(-0.1, 1.1)
    ax.axhline(y=0, color='black', linewidth=0.5)

plt.tight_layout()
plt.suptitle("Vanishing Gradient â€” Derivative Magnitudes", fontsize=14, y=1.05)
plt.show()

print("Sigmoid max derivative:", np.max(derivatives['Sigmoid']))
print("Tanh max derivative:   ", np.max(derivatives['Tanh']))
print("ReLU max derivative:   ", np.max(derivatives['ReLU']))
```

---

### Section 3: Loss Functions & Optimizers

#### Loss Functions from Scratch and with Keras

```python
import numpy as np
import tensorflow as tf
from tensorflow import keras

class LossFunctions:
    @staticmethod
    def mse(y_true, y_pred):
        return np.mean((y_true - y_pred) ** 2)

    @staticmethod
    def mse_gradient(y_true, y_pred):
        return 2 * (y_pred - y_true) / y_true.shape[0]

    @staticmethod
    def binary_crossentropy(y_true, y_pred):
        eps = 1e-8
        y_pred = np.clip(y_pred, eps, 1 - eps)
        return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

    @staticmethod
    def categorical_crossentropy(y_true, y_pred):
        eps = 1e-8
        y_pred = np.clip(y_pred, eps, 1 - eps)
        return -np.mean(np.sum(y_true * np.log(y_pred), axis=1))

    @staticmethod
    def huber_loss(y_true, y_pred, delta=1.0):
        error = y_true - y_pred
        is_small = np.abs(error) <= delta
        squared_loss = 0.5 * error**2
        linear_loss = delta * np.abs(error) - 0.5 * delta**2
        return np.mean(np.where(is_small, squared_loss, linear_loss))

# Demonstration
y_true = np.array([1.0, 0.0, 1.0, 0.0])
y_pred = np.array([0.9, 0.1, 0.8, 0.3])

lf = LossFunctions()
print(f"MSE:                  {lf.mse(y_true, y_pred):.4f}")
print(f"Binary Cross-Entropy: {lf.binary_crossentropy(y_true, y_pred):.4f}")
print(f"Huber Loss:           {lf.huber_loss(y_true, y_pred):.4f}")

# Keras losses
y_true_k = tf.constant([1.0, 0.0, 1.0, 0.0])
y_pred_k = tf.constant([0.9, 0.1, 0.8, 0.3])
print(f"\nKeras MSE: {keras.losses.MeanSquaredError()(y_true_k, y_pred_k):.4f}")
print(f"Keras Huber: {keras.losses.Huber()(y_true_k, y_pred_k):.4f}")
```

#### Optimizers Comparison

```python
import numpy as np
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt

def rosenbrock(x, y):
    return (1 - x)**2 + 100 * (y - x**2)**2

def rosenbrock_grad(x, y):
    dx = -2 * (1 - x) + 200 * (y - x**2) * (-2 * x)
    dy = 200 * (y - x**2)
    return np.array([dx, dy])

def optimize_2d(optimizer_class, name, lr=0.001, steps=500):
    start = np.array([-1.5, 1.5], dtype=np.float32)
    var = tf.Variable(start)
    optimizer = optimizer_class(learning_rate=lr)
    path = [start.copy()]

    for _ in range(steps):
        with tf.GradientTape() as tape:
            loss = rosenbrock(var[0], var[1])
        grads = tape.gradient(loss, [var])
        optimizer.apply_gradients(zip(grads, [var]))
        path.append(var.numpy().copy())

    return np.array(path)

optimizers = [
    (keras.optimizers.SGD, "SGD"),
    (keras.optimizers.SGD, "SGD+Momentum"),
    (keras.optimizers.Adam, "Adam"),
    (keras.optimizers.RMSprop, "RMSprop"),
]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
x_range = np.linspace(-2, 2, 200)
y_range = np.linspace(-1, 3, 200)
X, Y = np.meshgrid(x_range, y_range)
Z = rosenbrock(X, Y)

for ax, (opt_class, name) in zip(axes.ravel(), optimizers):
    path = optimize_2d(opt_class, name)

    ax.contour(X, Y, Z, levels=np.logspace(0, 3, 30), cmap='viridis', alpha=0.6)
    ax.plot(path[:, 0], path[:, 1], 'r.-', markersize=2, linewidth=0.8)
    ax.plot(path[0, 0], path[0, 1], 'go', markersize=10, label='Start')
    ax.plot(-1, 1, 'r*', markersize=15, label='Minimum')
    ax.set_title(f"{name} Optimizer", fontsize=13)
    ax.legend()

plt.tight_layout()
plt.show()
```

---

### Section 4: Backpropagation

#### Complete Backpropagation Algorithm

```python
import numpy as np

class NeuralNetworkBackprop:
    def __init__(self, layers):
        self.layers = layers
        self.weights = []
        self.biases = []
        self.batch_norm_params = []

        for i in range(len(layers) - 1):
            w = np.random.randn(layers[i], layers[i+1]) * np.sqrt(2.0 / layers[i])
            b = np.zeros((1, layers[i+1]))
            self.weights.append(w)
            self.biases.append(b)

    def relu(self, z):
        return np.maximum(0, z)

    def relu_grad(self, z):
        return (z > 0).astype(float)

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def forward(self, X):
        self.Z = []
        self.A = [X]
        current = X

        for i in range(len(self.weights) - 1):
            z = current @ self.weights[i] + self.biases[i]
            self.Z.append(z)
            current = self.relu(z)
            self.A.append(current)

        z_final = current @ self.weights[-1] + self.biases[-1]
        self.Z.append(z_final)
        output = self.softmax(z_final)
        self.A.append(output)
        return output

    def compute_loss(self, y_pred, y_true):
        m = y_true.shape[0]
        return -np.sum(y_true * np.log(y_pred + 1e-8)) / m

    def backward(self, y_true):
        m = y_true.shape[0]
        n_layers = len(self.weights)
        self.dW = [None] * n_layers
        self.dB = [None] * n_layers

        # Output layer gradient
        delta = self.A[-1] - y_true

        for i in range(n_layers - 1, -1, -1):
            self.dW[i] = self.A[i].T @ delta / m
            self.dB[i] = np.sum(delta, axis=0, keepdims=True) / m

            if i > 0:
                delta = (delta @ self.weights[i].T) * self.relu_grad(self.Z[i-1])

    def update(self, lr=0.01):
        for i in range(len(self.weights)):
            self.weights[i] -= lr * self.dW[i]
            self.biases[i] -= lr * self.dB[i]

    def fit(self, X, y, epochs=1000, lr=0.01, verbose=True):
        losses = []
        for epoch in range(epochs):
            output = self.forward(X)
            loss = self.compute_loss(output, y)
            self.backward(y)
            self.update(lr)
            losses.append(loss)

            if verbose and epoch % 200 == 0:
                acc = np.mean(np.argmax(output, axis=1) == np.argmax(y, axis=1))
                print(f"Epoch {epoch:4d} | Loss: {loss:.4f} | Accuracy: {acc:.4f}")
        return losses

# Synthetic spiral dataset
def make_spirals(n_points=100, n_classes=3):
    X = np.zeros((n_points * n_classes, 2))
    y = np.zeros((n_points * n_classes, n_classes))
    for c in range(n_classes):
        ix = range(n_points * c, n_points * (c + 1))
        r = np.linspace(0.0, 1, n_points)
        t = np.linspace(c * 4, (c + 1) * 4, n_points) + np.random.randn(n_points) * 0.2
        X[ix] = np.c_[r * np.sin(t * 2.5), r * np.cos(t * 2.5)]
        y[ix, c] = 1
    return X, y

X, y = make_spirals(100, 3)

nn = NeuralNetworkBackprop(layers=[2, 64, 32, 3])
losses = nn.fit(X, y, epochs=2000, lr=0.05)

preds = nn.forward(X)
accuracy = np.mean(np.argmax(preds, axis=1) == np.argmax(y, axis=1))
print(f"\nFinal Accuracy: {accuracy:.4f}")
```

#### Gradient Checking Implementation

```python
import numpy as np

def gradient_check(model, X, y, epsilon=1e-7):
    output = model.forward(X)
    model.backward(y)

    analytic_grads = model.dW[0].copy()
    numerical_grads = np.zeros_like(analytic_grads)

    flat_params = model.weights[0].ravel()
    flat_analytic = analytic_grads.ravel()

    for i in range(min(10, flat_params.size)):  # Check first 10 params
        original = flat_params[i]

        flat_params[i] = original + epsilon
        model.weights[0] = flat_params.reshape(model.weights[0].shape)
        loss_plus = model.compute_loss(model.forward(X), y)

        flat_params[i] = original - epsilon
        model.weights[0] = flat_params.reshape(model.weights[0].shape)
        loss_minus = model.compute_loss(model.forward(X), y)

        flat_params[i] = original
        numerical_grads.ravel()[i] = (loss_plus - loss_minus) / (2 * epsilon)

    model.weights[0] = flat_params.reshape(model.weights[0].shape)

    diff = np.abs(flat_analytic[:10] - numerical_grads.ravel()[:10])
    norm = np.abs(flat_analytic[:10]) + np.abs(numerical_grads.ravel()[:10])
    relative_error = diff / (norm + 1e-8)

    print(f"Max relative error: {np.max(relative_error):.2e}")
    print(f"Mean relative error: {np.mean(relative_error):.2e}")
    print(f"Gradient check {'PASSED' if np.max(relative_error) < 1e-5 else 'FAILED'}")

nn_check = NeuralNetworkBackprop(layers=[2, 16, 3])
gradient_check(nn_check, X[:32], y[:32])
```

---

### Section 5: TensorFlow & Keras Basics

#### Tensor Operations and tf.function

```python
import tensorflow as tf
import numpy as np

# Creating tensors
a = tf.constant([[1, 2], [3, 4]], dtype=tf.float32)
b = tf.random.normal((2, 3), mean=0, stddev=1.0)
c = tf.ones((3, 3))

print("Tensor a:\n", a)
print("Shape:", a.shape)
print("Dtype:", a.dtype)

# Operations
print("\na + b.T:", tf.add(a, tf.transpose(b[:2, :2])))
print("Matrix multiply:", tf.matmul(a, tf.constant([[1, 0], [0, 1]], dtype=tf.float32)))
print("Element-wise:", tf.multiply(a, 2.0))

# Gradient tracking
x = tf.Variable(3.0)
with tf.GradientTape() as tape:
    y = x**3 + 2 * x**2 - 5 * x + 7
dy_dx = tape.gradient(y, x)
print(f"\ny at x=3: {y.numpy()}")
print(f"dy/dx at x=3: {dy_dx.numpy()}")  # Should be 3(9) + 4(3) - 5 = 34

# tf.function for performance
@tf.function
def fast_forward(x, w):
    return tf.matmul(x, w)

x_input = tf.random.normal((1, 784))
w_matrix = tf.random.normal((784, 256))

# First call (traces the function)
result = fast_forward(x_input, w_matrix)
print(f"\nOutput shape: {result.shape}")

# Check if it's a ConcreteFunction (compiled)
print(f"Function type: {type(fast_forward)}")
```

#### Complete Keras API Workflow

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Load and preprocess MNIST
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()
X_train = X_train.reshape(-1, 784).astype('float32') / 255.0
X_test = X_test.reshape(-1, 784).astype('float32') / 255.0
y_train_cat = keras.utils.to_categorical(y_train, 10)
y_test_cat = keras.utils.to_categorical(y_test, 10)

# Build model
model = keras.Sequential([
    layers.Dense(256, activation='relu', input_shape=(784,)),
    layers.Dropout(0.3),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.summary()

# Compile
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks
callbacks = [
    keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=2, min_lr=1e-6),
    keras.callbacks.ModelCheckpoint('best_model.keras', save_best_only=True)
]

# Train
history = model.fit(
    X_train, y_train_cat,
    epochs=50, batch_size=128,
    validation_split=0.15,
    callbacks=callbacks,
    verbose=1
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test_cat, verbose=0)
print(f"\nTest Accuracy: {test_acc:.4f}")
print(f"Test Loss: {test_loss:.4f}")
```

---

### Section 6: Building First Neural Network

#### End-to-End Classification Pipeline

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split

# Generate dataset
X, y = make_moons(n_samples=2000, noise=0.2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model with custom layers
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(2,)),
    layers.BatchNormalization(),
    layers.Dense(32, activation='relu'),
    layers.BatchNormalization(),
    layers.Dense(16, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

# Custom metric
class Precision(keras.metrics.Metric):
    def __init__(self, name='precision', **kwargs):
        super().__init__(name=name, **kwargs)
        self.true_positives = self.add_weight(name='tp', initializer='zeros')
        self.predicted_positives = self.add_weight(name='pp', initializer='zeros')

    def update_state(self, y_true, y_pred, sample_weight=None):
        y_pred_binary = tf.cast(y_pred > 0.5, tf.float32)
        self.true_positives.assign_add(tf.reduce_sum(y_true * y_pred_binary))
        self.predicted_positives.assign_add(tf.reduce_sum(y_pred_binary))

    def result(self):
        return self.true_positives / (self.predicted_positives + 1e-8)

    def reset_state(self):
        self.true_positives.assign(0)
        self.predicted_positives.assign(0)

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy', Precision()]
)

history = model.fit(
    X_train, y_train,
    epochs=100, batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=[
        keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)
    ],
    verbose=0
)

# Evaluate and visualize
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].plot(history.history['loss'], label='Train')
axes[0].plot(history.history['val_loss'], label='Val')
axes[0].set_title('Loss')
axes[0].legend()

axes[1].plot(history.history['accuracy'], label='Train')
axes[1].plot(history.history['val_accuracy'], label='Val')
axes[1].set_title('Accuracy')
axes[1].legend()

# Decision boundary
xx, yy = np.meshgrid(np.linspace(-2, 3, 200), np.linspace(-1.5, 2, 200))
grid = np.c_[xx.ravel(), yy.ravel()]
probs = model.predict(grid, verbose=0).reshape(xx.shape)
axes[2].contourf(xx, yy, probs, levels=50, cmap='RdYlBu', alpha=0.8)
axes[2].scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap='RdYlBu', edgecolors='black', s=20)
axes[2].set_title('Decision Boundary')

plt.tight_layout()
plt.show()

results = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Results â€” Loss: {results[0]:.4f}, Accuracy: {results[1]:.4f}, Precision: {results[2]:.4f}")
```

---

### Section 7: Regularization Techniques

#### Dropout, Batch Normalization, and L2

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, regularizers
import numpy as np
import matplotlib.pyplot as plt

def build_regularized_model(dropout_rate=0.0, l2_lambda=0.0, use_batchnorm=False):
    model = keras.Sequential()
    model.add(layers.Dense(256, activation='relu', input_shape=(20,),
                           kernel_regularizer=regularizers.l2(l2_lambda) if l2_lambda > 0 else None))
    if use_batchnorm:
        model.add(layers.BatchNormalization())
    model.add(layers.Dropout(dropout_rate))

    model.add(layers.Dense(128, activation='relu',
                           kernel_regularizer=regularizers.l2(l2_lambda) if l2_lambda > 0 else None))
    if use_batchnorm:
        model.add(layers.BatchNormalization())
    model.add(layers.Dropout(dropout_rate))

    model.add(layers.Dense(64, activation='relu',
                           kernel_regularizer=regularizers.l2(l2_lambda) if l2_lambda > 0 else None))
    model.add(layers.Dense(1, activation='sigmoid'))
    return model

# Generate noisy data to encourage overfitting
np.random.seed(42)
n_samples = 1000
X = np.random.randn(n_samples, 20)
y = (X[:, 0] * X[:, 1] + X[:, 5]**2 > 0).astype(int).reshape(-1, 1)
X_train, X_val = X[:800], X[800:]
y_train, y_val = y[:800], y[800:]

configs = [
    ("No Regularization", {}),
    ("Dropout (0.3)", {'dropout_rate': 0.3}),
    ("L2 (1e-4)", {'l2_lambda': 1e-4}),
    ("BatchNorm + Dropout", {'dropout_rate': 0.3, 'use_batchnorm': True}),
]

histories = {}
for name, params in configs:
    model = build_regularized_model(**params)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    history = model.fit(X_train, y_train, epochs=100, batch_size=64,
                        validation_data=(X_val, y_val), verbose=0)
    histories[name] = history.history

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for name, h in histories.items():
    axes[0].plot(h['val_loss'], label=name, linewidth=2)
    axes[1].plot(h['val_accuracy'], label=name, linewidth=2)

axes[0].set_title('Validation Loss')
axes[0].set_xlabel('Epoch')
axes[0].legend()
axes[1].set_title('Validation Accuracy')
axes[1].set_xlabel('Epoch')
axes[1].legend()
plt.tight_layout()
plt.show()
```

#### Custom Dropout and Callbacks

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

class MonteCarloDropout(layers.Dropout):
    def call(self, inputs, training=None):
        return super().call(inputs, training=True)  # Always active

# MC Dropout for uncertainty estimation
mc_model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(20,)),
    MonteCarloDropout(0.2),
    layers.Dense(64, activation='relu'),
    MonteCarloDropout(0.2),
    layers.Dense(1, activation='sigmoid')
])

mc_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
mc_model.fit(X_train, y_train, epochs=50, batch_size=64, verbose=0)

# Run multiple forward passes for uncertainty
n_passes = 100
predictions = np.array([mc_model.predict(X_val[:10], verbose=0).flatten()
                        for _ in range(n_passes)])

mean_pred = predictions.mean(axis=0)
uncertainty = predictions.std(axis=0)

print("MC Dropout Uncertainty Estimates:")
for i in range(5):
    print(f"  Sample {i}: mean={mean_pred[i]:.4f}, uncertainty={uncertainty[i]:.4f}")

# Custom learning rate callback
class WarmupCosineDecay(keras.callbacks.Callback):
    def __init__(self, total_epochs, warmup_epochs, initial_lr, min_lr=1e-6):
        super().__init__()
        self.total_epochs = total_epochs
        self.warmup_epochs = warmup_epochs
        self.initial_lr = initial_lr
        self.min_lr = min_lr

    def on_epoch_begin(self, epoch, logs=None):
        if epoch < self.warmup_epochs:
            lr = self.initial_lr * (epoch + 1) / self.warmup_epochs
        else:
            progress = (epoch - self.warmup_epochs) / (self.total_epochs - self.warmup_epochs)
            lr = self.min_lr + 0.5 * (self.initial_lr - self.min_lr) * (1 + np.cos(np.pi * progress))
        self.model.optimizer.learning_rate.assign(lr)
```

---

### Section 8: Learning Rate Schedules

#### Learning Rate Schedule Implementations

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt

# Custom schedule classes
class LinearWarmupSchedule(keras.optimizers.schedules.LearningRateSchedule):
    def __init__(self, initial_lr, warmup_steps, total_steps):
        super().__init__()
        self.initial_lr = initial_lr
        self.warmup_steps = warmup_steps
        self.total_steps = total_steps

    def __call__(self, step):
        step = tf.cast(step, tf.float32)
        warmup = self.initial_lr * (step / self.warmup_steps)
        decay = self.initial_lr * (1 - (step - self.warmup_steps) / (self.total_steps - self.warmup_steps))
        return tf.where(step < self.warmup_steps, warmup, decay)

class CosineDecayWithRestarts(keras.optimizers.schedules.LearningRateSchedule):
    def __init__(self, initial_lr, total_steps, restart_interval, decay_factor=0.9):
        super().__init__()
        self.initial_lr = initial_lr
        self.total_steps = total_steps
        self.restart_interval = restart_interval
        self.decay_factor = decay_factor

    def __call__(self, step):
        step = tf.cast(step, tf.float32)
        cycle_step = tf.math.floormod(step, self.restart_interval)
        cycle_progress = cycle_step / self.restart_interval
        restart_count = tf.cast(step / self.restart_interval, tf.float32)
        current_lr = self.initial_lr * (self.decay_factor ** restart_count)
        return current_lr * 0.5 * (1 + tf.cos(np.pi * cycle_progress))

# Compare schedules
steps = np.arange(0, 10000)

schedules = {
    'Constant': np.full_like(steps, 0.001, dtype=float),
    'Step Decay': np.where(steps < 3000, 0.001, np.where(steps < 6000, 0.0005, 0.0001)),
    'Exponential': 0.001 * np.power(0.95, steps / 1000),
    'Linear Warmup': np.minimum(0.001 * steps / 1000, 0.001),
}

cosine_schedule = CosineDecayWithRestarts(0.001, 10000, 3000)
schedules['Cosine w/ Restarts'] = [cosine_schedule(s).numpy() for s in steps]

fig, ax = plt.subplots(figsize=(12, 6))
for name, lrs in schedules.items():
    ax.plot(steps, lrs, label=name, linewidth=2)
ax.set_xlabel('Training Step')
ax.set_ylabel('Learning Rate')
ax.set_title('Learning Rate Schedules Comparison')
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Apply cosine decay to training
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()
X_train = X_train.reshape(-1, 784) / 255.0
X_test = X_test.reshape(-1, 784) / 255.0

lr_schedule = keras.optimizers.schedules.CosineDecay(
    initial_learning_rate=0.001,
    decay_steps=5000,
    alpha=0.001
)

model = keras.Sequential([
    layers.Dense(256, activation='relu', input_shape=(784,)),
    layers.Dropout(0.2),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=lr_schedule),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(X_train, y_train, epochs=10, batch_size=128,
                    validation_split=0.1, verbose=1)
```

---

### Module 21 â€” Real-Time Use Cases

| Use Case | Neural Network Type | Industry | Description |
|----------|-------------------|----------|-------------|
| Credit Scoring | MLP | Finance | Predict loan default probability from tabular data |
| Fraud Detection | MLP + Autoencoder | Banking | Flag anomalous transactions in real-time |
| Predictive Maintenance | MLP | Manufacturing | Predict equipment failure from sensor data |
| Click-Through Rate | MLP | Advertising | Predict ad click probability for recommendations |
| Customer Churn | MLP | Telecom | Predict which customers will cancel subscriptions |
| Medical Diagnosis | MLP | Healthcare | Classify patient records as positive/negative |
| Energy Load Forecasting | MLP | Utilities | Predict electricity demand for grid management |
| A/B Test Analysis | MLP | Tech | Model conversion probability across variants |

### Module 21 â€” Project Ideas

| Project | Description | Difficulty |
|---------|-------------|------------|
| Handwritten Digit Classifier | Build and train a model on MNIST with custom regularization | Beginner |
| Custom Keras Callbacks | Create a callback library with LR scheduling, model checkpointing, and logging | Intermediate |
| Neural Network Visualizer | Build a tool to visualize activations, gradients, and decision boundaries | Intermediate |
| From-Scratch MLP with Backprop | Implement a fully vectorized MLP with mini-batch SGD, momentum, and weight decay | Advanced |
| Hyperparameter Tuning Pipeline | Use Keras Tuner to search over architectures, optimizers, and regularization | Advanced |

---

---

## MODULE 22: CNNs FOR COMPUTER VISION

### Learning Objectives
- Understand convolution, pooling, and feature map operations
- Implement classic and modern CNN architectures
- Apply transfer learning and data augmentation techniques
- Build object detection and image segmentation pipelines

---

### Section 1: Convolutional Layers

#### Understanding Convolutions from Scratch

```python
import numpy as np

def conv2d(input_matrix, kernel, stride=1, padding=0):
    if padding > 0:
        input_matrix = np.pad(input_matrix, padding, mode='constant')

    h_in, w_in = input_matrix.shape
    k_h, k_w = kernel.shape
    h_out = (h_in - k_h) // stride + 1
    w_out = (w_in - k_w) // stride + 1

    output = np.zeros((h_out, w_out))
    for i in range(h_out):
        for j in range(w_out):
            region = input_matrix[i*stride:i*stride+k_h, j*stride:j*stride+k_w]
            output[i, j] = np.sum(region * kernel)

    return output

# Example: Edge detection kernels
sample_image = np.array([
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
], dtype=float)

kernels = {
    'Sobel X': np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=float),
    'Sobel Y': np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=float),
    'Laplacian': np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=float),
    'Sharpen': np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=float),
}

for name, kernel in kernels.items():
    result = conv2d(sample_image, kernel, padding=1)
    print(f"\n{name}:\n{result.astype(int)}")
```

#### TensorFlow Conv2D Layers

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt

# Load and prepare a sample image
(X_train, y_train), _ = keras.datasets.cifar10.load_data()
sample_img = X_train[0]  # Shape: (32, 32, 3)

# Create model to visualize feature maps
model = keras.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(32, 32, 3)),
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D((2, 2)),
])

model.summary()

# Extract feature maps
feature_model = keras.Model(inputs=model.input, outputs=[layer.output for layer in model.layers[:4]])
img_batch = np.expand_dims(sample_img.astype('float32') / 255.0, axis=0)
feature_maps = feature_model.predict(img_batch, verbose=0)

# Visualize first layer feature maps
fig, axes = plt.subplots(2, 8, figsize=(16, 4))
for i, ax in enumerate(axes.ravel()):
    if i < feature_maps[0].shape[-1]:
        ax.imshow(feature_maps[0][0, :, :, i], cmap='viridis')
    ax.axis('off')
plt.suptitle("Layer 1 Feature Maps (32 filters)", fontsize=14)
plt.tight_layout()
plt.show()

# Visualize deeper feature maps
fig, axes = plt.subplots(4, 8, figsize=(16, 8))
for layer_idx in range(min(4, len(feature_maps))):
    n_filters = min(8, feature_maps[layer_idx].shape[-1])
    for i in range(n_filters):
        ax = axes[layer_idx, i]
        fm = feature_maps[layer_idx][0, :, :, i]
        ax.imshow(fm, cmap='viridis')
        ax.axis('off')
    for i in range(n_filters, 8):
        axes[layer_idx, i].axis('off')
    axes[layer_idx, 0].set_ylabel(f"Layer {layer_idx+1}", fontsize=12)
plt.suptitle("Feature Maps Across Layers", fontsize=14)
plt.tight_layout()
plt.show()
```

---

### Section 2: Pooling Layers

#### Pooling Operations Implementation

```python
import numpy as np

def max_pool2d(input_matrix, pool_size=2, stride=2):
    h, w = input_matrix.shape
    h_out = (h - pool_size) // stride + 1
    w_out = (w - pool_size) // stride + 1
    output = np.zeros((h_out, w_out))

    for i in range(h_out):
        for j in range(w_out):
            region = input_matrix[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]
            output[i, j] = np.max(region)
    return output

def avg_pool2d(input_matrix, pool_size=2, stride=2):
    h, w = input_matrix.shape
    h_out = (h - pool_size) // stride + 1
    w_out = (w - pool_size) // stride + 1
    output = np.zeros((h_out, w_out))

    for i in range(h_out):
        for j in range(w_out):
            region = input_matrix[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]
            output[i, j] = np.mean(region)
    return output

def global_avg_pool(feature_map):
    return np.mean(feature_map, axis=(0, 1))

# Demo
np.random.seed(42)
feature_map = np.random.rand(8, 8)
print("Original (8x8):\n", np.round(feature_map, 2))
print("\nMax Pooling (4x4):\n", np.round(max_pool2d(feature_map), 2))
print("\nAvg Pooling (4x4):\n", np.round(avg_pool2d(feature_map), 2))

# Global Average Pooling
conv_output = np.random.rand(7, 7, 64)
gap = global_avg_pool(conv_output)
print(f"\nGlobal Avg Pool output: {gap.shape} -> {gap.shape[-1]} values per channel")
```

---

### Section 3: Classic CNN Architectures

#### Implementing LeNet, VGG-style, and ResNet Blocks

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def build_lenet(input_shape=(32, 32, 3), num_classes=10):
    model = keras.Sequential([
        layers.Conv2D(6, (5, 5), activation='tanh', input_shape=input_shape),
        layers.AveragePooling2D((2, 2)),
        layers.Conv2D(16, (5, 5), activation='tanh'),
        layers.AveragePooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(120, activation='tanh'),
        layers.Dense(84, activation='tanh'),
        layers.Dense(num_classes, activation='softmax')
    ])
    return model

def build_vgg_block(x, filters, convolutions=2):
    for _ in range(convolutions):
        x = layers.Conv2D(filters, (3, 3), padding='same')(x)
        x = layers.BatchNormalization()(x)
        x = layers.ReLU()(x)
    x = layers.MaxPooling2D((2, 2))(x)
    return x

def build_vgg_mini(input_shape=(32, 32, 3), num_classes=10):
    inputs = layers.Input(shape=input_shape)
    x = build_vgg_block(inputs, 32)
    x = build_vgg_block(x, 64)
    x = build_vgg_block(x, 128)
    x = layers.Flatten()(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    return keras.Model(inputs, outputs, name="VGG_Mini")

def residual_block(x, filters, downsample=False):
    stride = 2 if downsample else 1
    shortcut = x

    x = layers.Conv2D(filters, (3, 3), strides=stride, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.Conv2D(filters, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)

    if downsample or shortcut.shape[-1] != filters:
        shortcut = layers.Conv2D(filters, (1, 1), strides=stride, padding='same')(shortcut)
        shortcut = layers.BatchNormalization()(shortcut)

    x = layers.Add()([x, shortcut])
    x = layers.ReLU()(x)
    return x

def build_resnet_mini(input_shape=(32, 32, 3), num_classes=10):
    inputs = layers.Input(shape=input_shape)
    x = layers.Conv2D(32, (3, 3), padding='same')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)

    x = residual_block(x, 32)
    x = residual_block(x, 64, downsample=True)
    x = residual_block(x, 64)
    x = residual_block(x, 128, downsample=True)

    x = layers.GlobalAveragePooling2D()(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    return keras.Model(inputs, outputs, name="ResNet_Mini")

# Build and compare
lenet = build_lenet()
vgg = build_vgg_mini()
resnet = build_resnet_mini()

for m in [lenet, vgg, resnet]:
    params = m.count_params()
    print(f"{m.name}: {params:,} parameters")
```

---

### Section 4: Transfer Learning

#### Using Pre-trained Models

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Load pre-trained MobileNetV2
base_model = keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model
base_model.trainable = False

# Build classifier head
model = keras.Sequential([
    layers.InputLayer(input_shape=(32, 32, 3)),
    layers.Resizing(224, 224),
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(10, activation='softmax')
])

model.summary()

model.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Phase 1: Train classifier head only
(X_train, y_train), (X_test, y_test) = keras.datasets.cifar10.load_data()
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

print("Phase 1: Training classifier head...")
model.fit(X_train, y_train, epochs=5, batch_size=64, validation_split=0.1, verbose=1)

# Phase 2: Fine-tune top layers of base model
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(1e-5),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print("\nPhase 2: Fine-tuning last 30 layers...")
model.fit(X_train, y_train, epochs=5, batch_size=64, validation_split=0.1, verbose=1)

test_acc = model.evaluate(X_test, y_test, verbose=0)[1]
print(f"\nTest Accuracy with Transfer Learning: {test_acc:.4f}")
```

---

### Section 5: Data Augmentation

#### Comprehensive Data Augmentation Pipeline

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.3),
    layers.RandomZoom(height_factor=(-0.2, 0.2), width_factor=(-0.2, 0.2)),
    layers.RandomTranslation(height_factor=0.1, width_factor=0.1),
    layers.RandomContrast(0.2),
    layers.RandomBrightness(0.2),
], name='data_augmentation')

# Custom augmentation
class RandomCutout(layers.Layer):
    def __init__(self, mask_size=8, **kwargs):
        super().__init__(**kwargs)
        self.mask_size = mask_size

    def call(self, images, training=None):
        if not training:
            return images

        batch_size = tf.shape(images)[0]
        img_height = tf.shape(images)[1]
        img_width = tf.shape(images)[2]

        center_x = tf.random.uniform([batch_size], 0, img_width, dtype=tf.int32)
        center_y = tf.random.uniform([batch_size], 0, img_height, dtype=tf.int32)

        x1 = tf.clip_by_value(center_x - self.mask_size // 2, 0, img_width)
        x2 = tf.clip_by_value(center_x + self.mask_size // 2, 0, img_width)
        y1 = tf.clip_by_value(center_y - self.mask_size // 2, 0, img_height)
        y2 = tf.clip_by_value(center_y + self.mask_size // 2, 0, img_height)

        mask = tf.ones_like(images)
        for i in range(batch_size):
            indices = tf.reshape(tf.stack([
                tf.ones(self.mask_size * self.mask_size, dtype=tf.int32) * i,
                tf.tile(tf.range(y1[i], y2[i]), [x2[i] - x1[i]]),
                tf.repeat(tf.range(x1[i], x2[i]), y2[i] - y1[i])
            ], axis=1), [-1, 3])
            updates = tf.zeros([tf.shape(indices)[0]], dtype=tf.float32)
            mask = tf.tensor_scatter_nd_update(mask, indices, updates)

        return images * mask

# Build augmented model
model = keras.Sequential([
    layers.InputLayer(input_shape=(32, 32, 3)),
    data_augmentation,
    RandomCutout(mask_size=6),
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D(),
    layers.Dropout(0.25),

    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D(),
    layers.Dropout(0.25),

    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.summary()
```

---

### Section 6: Object Detection Basics

#### YOLO-style Detection Pipeline

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

class YOLOBlock(layers.Layer):
    def __init__(self, filters, strides=2, **kwargs):
        super().__init__(**kwargs)
        self.conv1 = layers.Conv2D(filters, 3, strides=strides, padding='same')
        self.bn1 = layers.BatchNormalization()
        self.conv2 = layers.Conv2D(filters * 2, 3, padding='same')
        self.bn2 = layers.BatchNormalization()

    def call(self, x):
        x = tf.nn.relu(self.bn1(self.conv1(x)))
        x = tf.nn.relu(self.bn2(self.conv2(x)))
        return x

def build_detection_model(input_shape=(416, 416, 3), num_classes=20, num_anchors=5):
    inputs = layers.Input(shape=input_shape)

    # Backbone
    x = YOLOBlock(32)(inputs)
    x = YOLOBlock(64)(x)
    skip1 = x
    x = YOLOBlock(128)(x)
    x = YOLOBlock(256)(x)
    skip2 = x
    x = YOLOBlock(512)(x)

    # Detection head
    x = layers.Conv2D(256, 3, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)

    # Output: grid x grid x anchors * (5 + num_classes)
    grid_size = input_shape[0] // 32
    outputs = layers.Conv2D(
        num_anchors * (5 + num_classes), 3, padding='same', activation='sigmoid'
    )(x)

    model = keras.Model(inputs, outputs, name="YOLO_Detector")
    return model

det_model = build_detection_model()
det_model.summary()

# Simulate detection output
dummy_input = tf.random.normal((1, 416, 416, 3))
output = det_model(dummy_input)
print(f"\nDetection output shape: {output.shape}")
print(f"Grid size: {13x13}, Anchors: 5, Per anchor: {5+20} values")
```

---

### Section 7: Image Segmentation

#### U-Net Architecture for Segmentation

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def conv_block(x, filters, kernel_size=3):
    for _ in range(2):
        x = layers.Conv2D(filters, kernel_size, padding='same')(x)
        x = layers.BatchNormalization()(x)
        x = layers.ReLU()(x)
    return x

def encoder_block(x, filters):
    skip = conv_block(x, filters)
    x = layers.MaxPooling2D((2, 2))(skip)
    return x, skip

def decoder_block(x, skip, filters):
    x = layers.Conv2DTranspose(filters, (2, 2), strides=2, padding='same')(x)
    x = layers.Concatenate()([x, skip])
    x = conv_block(x, filters)
    return x

def build_unet(input_shape=(256, 256, 3), num_classes=1):
    inputs = layers.Input(shape=input_shape)

    # Encoder
    x, skip1 = encoder_block(inputs, 64)
    x, skip2 = encoder_block(x, 128)
    x, skip3 = encoder_block(x, 256)
    x, skip4 = encoder_block(x, 512)

    # Bottleneck
    x = conv_block(x, 1024)

    # Decoder
    x = decoder_block(x, skip4, 512)
    x = decoder_block(x, skip3, 256)
    x = decoder_block(x, skip2, 128)
    x = decoder_block(x, skip1, 64)

    outputs = layers.Conv2D(num_classes, (1, 1), activation='sigmoid')(x)
    return keras.Model(inputs, outputs, name="UNet")

unet = build_unet()
unet.summary()

# Dice loss for segmentation
def dice_loss(y_true, y_pred, smooth=1.0):
    y_true_f = tf.reshape(y_true, [-1])
    y_pred_f = tf.reshape(y_pred, [-1])
    intersection = tf.reduce_sum(y_true_f * y_pred_f)
    return 1 - (2. * intersection + smooth) / (tf.reduce_sum(y_true_f) + tf.reduce_sum(y_pred_f) + smooth)

# Combined loss
def bce_dice_loss(y_true, y_pred):
    bce = keras.losses.binary_crossentropy(y_true, y_pred)
    dice = dice_loss(y_true, y_pred)
    return bce + dice

unet.compile(optimizer='adam', loss=bce_dice_loss, metrics=['accuracy'])

# Test with synthetic data
X_dummy = tf.random.normal((2, 256, 256, 3))
y_dummy = tf.random.uniform((2, 256, 256, 1))
unet.fit(X_dummy, y_dummy, epochs=1, verbose=1)
```

---

### Section 8: Real-time Image Classification

#### Production-Ready CNN Pipeline

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# EfficientNet-based classifier
def build_production_classifier(input_shape=(224, 224, 3), num_classes=100):
    base_model = keras.applications.EfficientNetB0(
        include_top=False, weights='imagenet', input_shape=input_shape
    )

    model = keras.Sequential([
        layers.InputLayer(input_shape=input_shape),
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.4),
        layers.Dense(num_classes, activation='softmax')
    ])

    return model

# TFLite conversion for deployment
def convert_to_tflite(model, save_path="model.tflite"):
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.target_spec.supported_types = [tf.float16]
    tflite_model = converter.convert()
    with open(save_path, 'wb') as f:
        f.write(tflite_model)
    print(f"TFLite model saved: {len(tflite_model) / 1024:.1f} KB")
    return tflite_model

# INT8 quantization
def convert_to_quantized(model, representative_data):
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.representative_dataset = representative_data
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.uint8
    converter.inference_output_type = tf.uint8
    return converter.convert()

# Demo
model = build_production_classifier(input_shape=(32, 32, 3), num_classes=10)
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

(X_train, y_train), (X_test, y_test) = keras.datasets.cifar10.load_data()
X_train = tf.image.resize(X_train, (224, 224)) / 255.0
X_test = tf.image.resize(X_test, (224, 224)) / 255.0

# Train for demo (reduce epochs)
model.fit(X_train[:5000], y_train[:5000], epochs=2, batch_size=32, verbose=1)

# Export saved model
model.export('saved_model')

# Convert to TFLite
tflite_model = convert_to_tflite(model, "classifier.tflite")
```

---

### Module 22 â€” Real-Time Use Cases

| Use Case | Architecture | Industry | Description |
|----------|-------------|----------|-------------|
| Face Recognition | ResNet/EfficientNet | Security | Real-time identity verification at access points |
| Medical Image Analysis | U-Net, ResNet | Healthcare | Tumor detection in MRI/CT scans |
| Autonomous Driving | YOLO, SSD | Automotive | Real-time object detection for self-driving cars |
| Quality Control | Custom CNN | Manufacturing | Detect defects on production lines |
| Satellite Imagery | Deep CNN | Geospatial | Land use classification from satellite data |
| Agriculture Monitoring | Transfer Learning | Agriculture | Crop disease detection from leaf images |
| Retail Shelf Analysis | Detection CNN | Retail | Monitor product placement and stock levels |
| OCR Document Processing | CNN + RNN | Enterprise | Extract text from scanned documents |

### Module 22 â€” Project Ideas

| Project | Description | Difficulty |
|---------|-------------|------------|
| CIFAR-10 Classifier | Build a CNN achieving 90%+ accuracy on CIFAR-10 with augmentation | Beginner |
| Style Transfer App | Implement neural style transfer between content and style images | Intermediate |
| Parking Spot Detector | Detect empty vs occupied parking spots using YOLO | Intermediate |
| Medical Segmentation | Train U-Net for skin lesion segmentation from dermatoscopy images | Advanced |
| Real-time Video Classifier | Deploy a CNN for live webcam classification with TFLite | Advanced |

---

---

## MODULE 23: RNNs & SEQUENTIAL DATA

### Learning Objectives
- Understand recurrent neural network architectures
- Implement LSTM, GRU, and bidirectional models
- Build sequence-to-sequence models with attention
- Create text generation and speech recognition pipelines

---

### Section 1: Vanilla RNNs

#### RNN from Scratch

```python
import numpy as np

class VanillaRNN:
    def __init__(self, input_size, hidden_size, output_size, lr=0.001):
        self.hidden_size = hidden_size
        self.lr = lr

        scale = np.sqrt(2.0 / (input_size + hidden_size))
        self.Wxh = np.random.randn(input_size, hidden_size) * scale
        self.Whh = np.random.randn(hidden_size, hidden_size) * scale
        self.Why = np.random.randn(hidden_size, output_size) * scale
        self.bh = np.zeros((1, hidden_size))
        self.by = np.zeros((1, output_size))

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def forward(self, inputs):
        self.inputs = inputs
        seq_len = inputs.shape[0]
        self.hs = np.zeros((seq_len + 1, self.hidden_size))

        self.ys = []
        for t in range(seq_len):
            self.hs[t] = np.tanh(
                inputs[t] @ self.Wxh + self.hs[t-1] @ self.Whh + self.bh
            )
            y = self.hs[t] @ self.Why + self.by
            self.ys.append(y)

        return np.array(self.ys)

    def backward(self, targets):
        seq_len = len(self.ys)
        dWxh = np.zeros_like(self.Wxh)
        dWhh = np.zeros_like(self.Whh)
        dWhy = np.zeros_like(self.Why)
        dbh = np.zeros_like(self.bh)
        dby = np.zeros_like(self.by)
        dh_next = np.zeros((1, self.hidden_size))

        loss = 0
        for t in reversed(range(seq_len)):
            probs = self.softmax(self.ys[t])
            dy = probs.copy()
            dy -= targets[t]
            loss -= np.log(probs[0, targets[t].argmax()] + 1e-8)

            dWhy += np.outer(self.hs[t], dy)
            dby += dy

            dh = dy @ self.Why.T + dh_next
            dh_raw = (1 - self.hs[t]**2) * dh

            dWxh += np.outer(self.inputs[t], dh_raw)
            dWhh += np.outer(self.hs[t-1], dh_raw)
            dbh += dh_raw

            dh_next = dh_raw @ self.Whh.T

        # Clip gradients
        for dparam in [dWxh, dWhh, dWhy, dbh, dby]:
            np.clip(dparam, -5, 5, out=dparam)

        self.Wxh -= self.lr * dWxh
        self.Whh -= self.lr * dWhh
        self.Why -= self.lr * dWhy
        self.bh -= self.lr * dbh
        self.by -= self.lr * dby

        return loss / seq_len

# Character-level RNN for name generation
def prepare_data(names):
    chars = sorted(list(set(''.join(names))))
    char_to_idx = {c: i for i, c in enumerate(chars)}
    idx_to_char = {i: c for c, i in char_to_idx.items()}
    return chars, char_to_idx, idx_to_char

names = ['alice', 'bob', 'charlie', 'diana', 'evan', 'fiona', 'george',
         'hannah', 'ivan', 'julia', 'kevin', 'linda', 'mike', 'nancy']
chars, c2i, i2c = prepare_data(names)

rnn = VanillaRNN(input_size=len(chars), hidden_size=32, output_size=len(chars), lr=0.01)

for epoch in range(500):
    total_loss = 0
    for name in names:
        inputs = np.zeros((len(name) - 1, len(chars)))
        targets = []
        for t in range(len(name) - 1):
            inputs[t, c2i[name[t]]] = 1
            target = np.zeros((1, len(chars)))
            target[0, c2i[name[t+1]]] = 1
            targets.append(target)

        outputs = rnn.forward(inputs)
        loss = rnn.backward(np.array(targets).reshape(-1, len(chars)))
        total_loss += loss

    if epoch % 100 == 0:
        print(f"Epoch {epoch}, Loss: {total_loss / len(names):.4f}")

# Generate names
def generate_name(rnn, seed_char, c2i, i2c, max_len=15):
    x = np.zeros((1, len(chars)))
    x[0, c2i[seed_char]] = 1
    h = np.zeros((1, rnn.hidden_size))

    name = seed_char
    for _ in range(max_len):
        h = np.tanh(x @ rnn.Wxh + h @ rnn.Whh + rnn.bh)
        y = h @ rnn.Why + rnn.by
        probs = rnn.softmax(y)
        idx = np.random.choice(len(chars), p=probs.ravel())
        name += i2c[idx]
        x = np.zeros((1, len(chars)))
        x[0, idx] = 1
    return name

print("\nGenerated names:")
for c in 'abcdefghijk':
    print(f"  {generate_name(rnn, c, c2i, i2c)}")
```

#### TensorFlow RNN

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Simple RNN model
model = keras.Sequential([
    layers.Embedding(input_dim=26, output_dim=32, input_length=10),
    layers.SimpleRNN(64, return_sequences=False),
    layers.Dense(32, activation='relu'),
    layers.Dense(26, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.summary()
```

---

### Section 2: LSTM Networks

#### LSTM Implementation from Scratch

```python
import numpy as np

class LSTMCell:
    def __init__(self, input_size, hidden_size):
        scale = np.sqrt(2.0 / (input_size + hidden_size))

        # Gate weights
        self.Wf = np.random.randn(input_size + hidden_size, hidden_size) * scale
        self.Wi = np.random.randn(input_size + hidden_size, hidden_size) * scale
        self.Wc = np.random.randn(input_size + hidden_size, hidden_size) * scale
        self.Wo = np.random.randn(input_size + hidden_size, hidden_size) * scale

        self.bf = np.zeros((1, hidden_size))
        self.bi = np.zeros((1, hidden_size))
        self.bc = np.zeros((1, hidden_size))
        self.bo = np.zeros((1, hidden_size))

        self.hidden_size = hidden_size

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def forward(self, x, h_prev, c_prev):
        combined = np.hstack([h_prev, x])

        f = self.sigmoid(combined @ self.Wf + self.bf)   # Forget gate
        i = self.sigmoid(combined @ self.Wi + self.bi)    # Input gate
        c_tilde = np.tanh(combined @ self.Wc + self.bc)   # Candidate
        o = self.sigmoid(combined @ self.Wo + self.bo)    # Output gate

        c = f * c_prev + i * c_tilde                      # Cell state update
        h = o * np.tanh(c)                                # Hidden state

        self.cache = (x, h_prev, c_prev, combined, f, i, c_tilde, o, c)
        return h, c

class SimpleLSTM:
    def __init__(self, vocab_size, hidden_size, output_size, lr=0.001):
        self.hidden_size = hidden_size
        self.cell = LSTMCell(vocab_size, hidden_size)
        scale = np.sqrt(2.0 / (hidden_size + output_size))
        self.Wy = np.random.randn(hidden_size, output_size) * scale
        self.by = np.zeros((1, output_size))
        self.lr = lr

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def forward(self, inputs):
        seq_len = inputs.shape[0]
        h = np.zeros((1, self.hidden_size))
        c = np.zeros((1, self.hidden_size))

        self.hs = []
        self.cs = []
        outputs = []

        for t in range(seq_len):
            h, c = self.cell.forward(inputs[t:t+1], h, c)
            y = h @ self.Wy + self.by
            self.hs.append(h)
            self.cs.append(c)
            outputs.append(y)

        return np.array(outputs)

# TensorFlow LSTM
model = keras.Sequential([
    layers.Embedding(10000, 128, input_length=100),
    layers.LSTM(256, return_sequences=False, dropout=0.2, recurrent_dropout=0.2),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.summary()

# Stacked LSTM
stacked_model = keras.Sequential([
    layers.Embedding(10000, 128, input_length=100),
    layers.LSTM(256, return_sequences=True, dropout=0.2),
    layers.LSTM(128, return_sequences=False, dropout=0.2),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

stacked_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
stacked_model.summary()
```

---

### Section 3: GRU Networks

#### GRU Implementation

```python
import numpy as np

class GRUCell:
    def __init__(self, input_size, hidden_size):
        scale = np.sqrt(2.0 / (input_size + hidden_size))
        total = input_size + hidden_size

        self.Wz = np.random.randn(total, hidden_size) * scale
        self.Wr = np.random.randn(total, hidden_size) * scale
        self.Wh = np.random.randn(total, hidden_size) * scale

        self.bz = np.zeros((1, hidden_size))
        self.br = np.zeros((1, hidden_size))
        self.bh = np.zeros((1, hidden_size))

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def forward(self, x, h_prev):
        combined = np.hstack([h_prev, x])

        z = self.sigmoid(combined @ self.Wz + self.bz)    # Update gate
        r = self.sigmoid(combined @ self.Wr + self.br)    # Reset gate

        combined_r = np.hstack([r * h_prev, x])
        h_tilde = np.tanh(combined_r @ self.Wh + self.bh) # Candidate

        h = (1 - z) * h_prev + z * h_tilde               # New hidden state
        return h

class GRUClassifier:
    def __init__(self, vocab_size, embed_dim, hidden_size, num_classes, lr=0.001):
        self.hidden_size = hidden_size
        self.embed = np.random.randn(vocab_size, embed_dim) * 0.01
        self.gru = GRUCell(embed_dim, hidden_size)
        scale = np.sqrt(2.0 / hidden_size)
        self.Wy = np.random.randn(hidden_size, num_classes) * scale
        self.by = np.zeros((1, num_classes))
        self.lr = lr

    def forward(self, sequence):
        h = np.zeros((1, self.hidden_size))
        for idx in sequence:
            x = self.embed[idx].reshape(1, -1)
            h = self.gru.forward(x, h)
        logits = h @ self.Wy + self.by
        exp_logits = np.exp(logits - np.max(logits))
        return exp_logits / np.sum(exp_logits)

# TF GRU model
gru_model = keras.Sequential([
    layers.Embedding(10000, 128, input_length=100),
    layers.GRU(256, return_sequences=True, dropout=0.2),
    layers.GRU(128, return_sequences=False, dropout=0.2),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

gru_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
gru_model.summary()

# Benchmark: GRU vs LSTM
import time

X_dummy = np.random.randint(0, 10000, (1000, 100))
y_dummy = np.random.randint(0, 2, (1000, 1))

lstm_m = keras.Sequential([
    layers.Embedding(10000, 128, input_length=100),
    layers.LSTM(256),
    layers.Dense(1, activation='sigmoid')
])
lstm_m.compile(optimizer='adam', loss='binary_crossentropy')

gru_m = keras.Sequential([
    layers.Embedding(10000, 128, input_length=100),
    layers.GRU(256),
    layers.Dense(1, activation='sigmoid')
])
gru_m.compile(optimizer='adam', loss='binary_crossentropy')

print(f"LSTM params: {lstm_m.count_params():,}")
print(f"GRU params:  {gru_m.count_params():,}")
```

---

### Section 4: Bidirectional RNNs

#### Bidirectional Processing

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Bidirectional LSTM for sentiment analysis
model_bilstm = keras.Sequential([
    layers.Embedding(20000, 128, input_length=200),
    layers.Bidirectional(layers.LSTM(128, return_sequences=True, dropout=0.2)),
    layers.Bidirectional(layers.LSTM(64, return_sequences=False, dropout=0.2)),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.4),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

model_bilstm.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss='binary_crossentropy',
    metrics=['accuracy', keras.metrics.AUC()]
)

model_bilstm.summary()

# Custom Bidirectional from scratch
class BiRNN:
    def __init__(self, input_size, hidden_size):
        self.hidden_size = hidden_size
        scale = np.sqrt(2.0 / (input_size + hidden_size))

        # Forward RNN
        self.Wxh_f = np.random.randn(input_size, hidden_size) * scale
        self.Whh_f = np.random.randn(hidden_size, hidden_size) * scale
        self.bh_f = np.zeros((1, hidden_size))

        # Backward RNN
        self.Wxh_b = np.random.randn(input_size, hidden_size) * scale
        self.Whh_b = np.random.randn(hidden_size, hidden_size) * scale
        self.bh_b = np.zeros((1, hidden_size))

    def forward(self, X):
        seq_len = X.shape[0]

        # Forward pass
        hs_f = [np.zeros((1, self.hidden_size))]
        for t in range(seq_len):
            h = np.tanh(X[t:t+1] @ self.Wxh_f + hs_f[-1] @ self.Whh_f + self.bh_f)
            hs_f.append(h)

        # Backward pass
        hs_b = [np.zeros((1, self.hidden_size))]
        for t in reversed(range(seq_len)):
            h = np.tanh(X[t:t+1] @ self.Wxh_b + hs_b[-1] @ self.Whh_b + self.bh_b)
            hs_b.append(h)
        hs_b.reverse()

        # Concatenate
        outputs = []
        for t in range(seq_len):
            combined = np.hstack([hs_f[t+1], hs_b[t]])
            outputs.append(combined)

        return np.array(outputs).reshape(seq_len, -1)

import numpy as np
birnn = BiRNN(input_size=10, hidden_size=32)
X = np.random.randn(20, 10)
output = birnn.forward(X)
print(f"Bidirectional output shape: {output.shape}")
print(f"Expected: ({20}, {2*32}) = (seq_len, 2*hidden_size)")
```

---

### Section 5: Sequence-to-Sequence Models

#### Encoder-Decoder for Machine Translation

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

class Seq2SeqModel:
    def __init__(self, encoder_vocab, decoder_vocab, embed_dim=256, latent_dim=512):
        self.encoder_vocab = encoder_vocab
        self.decoder_vocab = decoder_vocab
        self.latent_dim = latent_dim

        # Encoder
        encoder_inputs = layers.Input(shape=(None,), name='encoder_input')
        enc_embed = layers.Embedding(encoder_vocab, embed_dim)(encoder_inputs)
        encoder_outputs, state_h, state_c = layers.LSTM(
            latent_dim, return_state=True, name='encoder_lstm'
        )(enc_embed)
        self.encoder_states = [state_h, state_c]

        # Decoder
        decoder_inputs = layers.Input(shape=(None,), name='decoder_input')
        dec_embed = layers.Embedding(decoder_vocab, embed_dim)(decoder_inputs)
        decoder_lstm = layers.LSTM(
            latent_dim, return_sequences=True, return_state=True, name='decoder_lstm'
        )
        decoder_outputs, _, _ = decoder_lstm(dec_embed, initial_state=self.encoder_states)
        decoder_dense = layers.Dense(decoder_vocab, activation='softmax', name='output')
        decoder_outputs = decoder_dense(decoder_outputs)

        self.model = keras.Model([encoder_inputs, decoder_inputs], decoder_outputs)

        # Inference encoder
        self.encoder_model = keras.Model(encoder_inputs, self.encoder_states)

        # Inference decoder
        decoder_state_input_h = layers.Input(shape=(latent_dim,))
        decoder_state_input_c = layers.Input(shape=(latent_dim,))
        decoder_states_inputs = [decoder_state_input_h, decoder_state_input_c]

        dec_inf_outputs, state_h, state_c = decoder_lstm(
            dec_embed, initial_state=decoder_states_inputs
        )
        dec_inf_outputs = decoder_dense(dec_inf_outputs)

        self.decoder_model = keras.Model(
            [decoder_inputs] + decoder_states_inputs,
            [dec_inf_outputs, state_h, state_c]
        )

    def compile(self, lr=0.001):
        self.model.compile(
            optimizer=keras.optimizers.Adam(lr),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )

    def encode(self, input_seq):
        states = self.encoder_model.predict(input_seq, verbose=0)
        return states

    def decode(self, target_seq, states):
        output, h, c = self.decoder_model.predict(
            [target_seq] + states, verbose=0
        )
        return output, [h, c]

# Demo
seq2seq = Seq2SeqModel(encoder_vocab=5000, decoder_vocab=8000, embed_dim=128, latent_dim=256)
seq2seq.compile()

print("Encoder-Decoder Model:")
seq2seq.model.summary()

# Simulate
enc_input = np.random.randint(0, 5000, (1, 20))
dec_input = np.random.randint(0, 8000, (1, 20))
states = seq2seq.encode(enc_input)
output, _ = seq2seq.decode(dec_input, states)
print(f"\nTranslation output shape: {output.shape}")
```

---

### Section 6: Attention Mechanism Basics

#### Bahdanau and Luong Attention

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

class BahdanauAttention(layers.Layer):
    def __init__(self, units, **kwargs):
        super().__init__(**kwargs)
        self.W1 = layers.Dense(units)
        self.W2 = layers.Dense(units)
        self.V = layers.Dense(1)

    def call(self, query, values):
        query_with_time = tf.expand_dims(query, 1)
        score = self.V(tf.nn.tanh(self.W1(values) + self.W2(query_with_time)))
        attention_weights = tf.nn.softmax(score, axis=1)
        context_vector = attention_weights * values
        context_vector = tf.reduce_sum(context_vector, axis=1)
        return context_vector, attention_weights

class LuongAttention(layers.Layer):
    def __init__(self, units, method='dot', **kwargs):
        super().__init__(**kwargs)
        self.method = method
        if method == 'general':
            self.W = layers.Dense(units, use_bias=False)

    def call(self, query, values):
        if self.method == 'dot':
            query = tf.expand_dims(query, 2)
            score = tf.matmul(values, query)
            score = tf.squeeze(score, axis=-1)
        elif self.method == 'general':
            query = self.W(query)
            query = tf.expand_dims(query, 2)
            score = tf.matmul(values, query)
            score = tf.squeeze(score, axis=-1)

        attention_weights = tf.nn.softmax(score, axis=1)
        context_vector = tf.reduce_sum(values * tf.expand_dims(attention_weights, -1), axis=1)
        return context_vector, attention_weights

# Demo
batch_size, seq_len, hidden_size = 2, 10, 64

encoder_output = tf.random.normal((batch_size, seq_len, hidden_size))
decoder_hidden = tf.random.normal((batch_size, hidden_size))

attention = BahdanauAttention(128)
context, weights = attention(decoder_hidden, encoder_output)
print(f"Bahdanau Context shape: {context.shape}")
print(f"Bahdanau Weights shape: {weights.shape}")

luong = LuongAttention(hidden_size, method='dot')
context, weights = luong(decoder_hidden, encoder_output)
print(f"Luong Context shape: {context.shape}")
print(f"Luong Weights shape: {weights.shape}")
```

---

### Section 7: Text Generation with RNNs

#### Character-Level Text Generation

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Prepare Shakespeare dataset
path = tf.keras.utils.get_file('shakespeare.txt',
    'https://storage.googleapis.com/download.tensorflow.org/data/shakespeare.txt')
text = open(path, 'rb').read().decode(encoding='utf-8')
print(f'Corpus length: {len(text)} characters')

# Character mapping
vocab = sorted(set(text))
char2idx = {c: i for i, c in enumerate(vocab)}
idx2char = np.array(vocab)

text_as_int = np.array([char2idx[c] for c in text])

# Create training sequences
seq_length = 100
char_dataset = tf.data.Dataset.from_tensor_slices(text_as_int)
sequences = char_dataset.batch(seq_length + 1, drop_remainder=True)

def split_input_target(chunk):
    input_text = chunk[:-1]
    target_text = chunk[1:]
    return input_text, target_text

dataset = sequences.map(split_input_target).batch(64, drop_remainder=True)

# Build model
vocab_size = len(vocab)
embedding_dim = 256
rnn_units = 512

model = keras.Sequential([
    layers.Embedding(vocab_size, embedding_dim),
    layers.GRU(rnn_units, return_sequences=True, stateful=False,
               dropout=0.2, recurrent_dropout=0.2),
    layers.GRU(rnn_units, return_sequences=True, stateful=False,
               dropout=0.2, recurrent_dropout=0.2),
    layers.Dense(vocab_size, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Train
history = model.fit(dataset, epochs=20, verbose=1)

# Generate text
def generate_text(model, start_string, num_generate=500, temperature=1.0):
    input_eval = [char2idx[s] for s in start_string]
    input_eval = tf.expand_dims(input_eval, 0)

    generated = []
    model.reset_states()

    for _ in range(num_generate):
        predictions = model(input_eval)
        predictions = tf.squeeze(predictions, 0)
        predictions = predictions / temperature
        predicted_id = tf.random.categorical(predictions, num_samples=1)[-1, 0].numpy()

        input_eval = tf.expand_dims([predicted_id], 0)
        generated.append(idx2char[predicted_id])

    return start_string + ''.join(generated)

print("\n--- Temperature 0.5 (Conservative) ---")
print(generate_text(model, "ROMEO: ", num_generate=200, temperature=0.5))

print("\n--- Temperature 1.2 (Creative) ---")
print(generate_text(model, "ROMEO: ", num_generate=200, temperature=1.2))
```

---

### Section 8: Speech Recognition Pipeline

#### Speech Feature Extraction and Classification

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

def extract_mfcc_features(audio_signal, sr=16000, n_mfcc=13, n_fft=512, hop_length=256):
    stft = tf.signal.stft(audio_signal, frame_length=n_fft, frame_step=hop_length, fft_length=n_fft)
    spectrogram = tf.abs(stft)
    log_spectrogram = tf.math.log(spectrogram + 1e-8)

    num_mel_filters = 26
    mel_filters = tf.signal.linear_to_mel_weight_matrix(
        num_mel_bins=num_mel_filters,
        num_spectrogram_bins=tf.shape(spectrogram)[1],
        sample_rate=sr,
        lower_edge_hertz=0,
        upper_edge_hertz=sr / 2
    )
    mel_spectrogram = tf.matmul(spectrogram, mel_filters)
    log_mel = tf.math.log(mel_spectrogram + 1e-8)

    # DCT to get MFCCs
    mfccs = tf.signal.dct(log_mel, type=2)[:, :n_mfcc]
    return mfccs

def build_speech_recognition_model(input_shape=(None, 13), num_classes=30):
    inputs = layers.Input(shape=input_shape)

    x = layers.Conv1D(64, 3, activation='relu', padding='same')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling1D(2)(x)

    x = layers.Conv1D(128, 3, activation='relu', padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling1D(2)(x)

    x = layers.Bidirectional(layers.LSTM(256, return_sequences=True, dropout=0.3))(x)
    x = layers.Bidirectional(layers.LSTM(128, return_sequences=False, dropout=0.3))

    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    return keras.Model(inputs, outputs, name="SpeechRecognition")

speech_model = build_speech_recognition_model()
speech_model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
speech_model.summary()

# Test with synthetic audio
dummy_audio = tf.random.normal((4, 16000))  # 4 samples, 1 second each
dummy_mfcc = tf.stack([extract_mfcc_features(audio) for audio in dummy_audio])
dummy_labels = tf.random.uniform((4,), 0, 30, dtype=tf.int32)

print(f"\nMFCC shape per sample: {dummy_mfcc[0].shape}")
```

---

### Module 23 â€” Real-Time Use Cases

| Use Case | RNN Type | Industry | Description |
|----------|----------|----------|-------------|
| Sentiment Analysis | Bi-LSTM | NLP | Classify product reviews as positive/negative |
| Machine Translation | Seq2Seq + Attention | Tech | Google Translate-style language translation |
| Speech Recognition | LSTM + CTC | Tech | Voice-to-text for virtual assistants |
| Time Series Forecasting | GRU | Finance | Stock price and demand prediction |
| Music Generation | LSTM | Entertainment | Compose melodies and harmonies |
| Handwriting Recognition | Bidirectional RNN | Education | Transcribe handwritten text from images |
| Chatbots | Seq2Seq | Customer Service | Multi-turn conversational AI |
| Anomaly Detection | LSTM Autoencoder | Cybersecurity | Detect unusual patterns in network traffic |

### Module 23 â€” Project Ideas

| Project | Description | Difficulty |
|---------|-------------|------------|
| Name Generator | Character-level LSTM to generate unique names | Beginner |
| Sentiment Classifier | Train Bi-LSTM on IMDB dataset for sentiment analysis | Intermediate |
| Sequence-to-Sequence Translator | Build a simple English-to-French translator with attention | Intermediate |
| Music Composition | Train LSTM on MIDI files to generate new compositions | Advanced |
| Real-time Speech Recognition | Build a keyword spotting system with MFCC features | Advanced |

---

---

## MODULE 24: GANS & AUTOENCODERS

### Learning Objectives
- Understand GAN architecture and training dynamics
- Implement DCGAN, Conditional GAN, and VAE
- Build denoising autoencoders for data reconstruction
- Explore latent space for image generation and style transfer

---

### Section 1: GAN Architecture

#### GAN from Scratch

```python
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt

class GAN:
    def __init__(self, latent_dim=100, img_shape=(28, 28, 1)):
        self.latent_dim = latent_dim
        self.img_shape = img_shape
        self.img_flat = np.prod(img_shape)

        self.generator = self._build_generator()
        self.discriminator = self._build_discriminator()
        self.discriminator.compile(optimizer=keras.optimizers.Adam(0.0002, 0.5),
                                    loss='binary_crossentropy', metrics=['accuracy'])

        # Combined model (generator + frozen discriminator)
        self.discriminator.trainable = False
        z = layers.Input(shape=(latent_dim,))
        img = self.generator(z)
        validity = self.discriminator(img)
        self.combined = keras.Model(z, validity)
        self.combined.compile(optimizer=keras.optimizers.Adam(0.0002, 0.5),
                               loss='binary_crossentropy')

    def _build_generator(self):
        model = keras.Sequential([
            layers.Dense(256, input_dim=self.latent_dim),
            layers.LeakyReLU(0.2),
            layers.BatchNormalization(),

            layers.Dense(512),
            layers.LeakyReLU(0.2),
            layers.BatchNormalization(),

            layers.Dense(1024),
            layers.LeakyReLU(0.2),
            layers.BatchNormalization(),

            layers.Dense(self.img_flat, activation='tanh'),
            layers.Reshape(self.img_shape)
        ], name='Generator')
        model.summary()
        return model

    def _build_discriminator(self):
        model = keras.Sequential([
            layers.Flatten(input_shape=self.img_shape),
            layers.Dense(512),
            layers.LeakyReLU(0.2),
            layers.Dropout(0.3),

            layers.Dense(256),
            layers.LeakyReLU(0.2),
            layers.Dropout(0.3),

            layers.Dense(1, activation='sigmoid')
        ], name='Discriminator')
        model.summary()
        return model

    def train(self, X_train, epochs=10000, batch_size=128, sample_interval=1000):
        valid = np.ones((batch_size, 1))
        fake = np.zeros((batch_size, 1))

        history = {'d_loss': [], 'g_loss': [], 'd_acc': []}

        for epoch in range(epochs):
            # Train Discriminator
            idx = np.random.randint(0, X_train.shape[0], batch_size)
            imgs = X_train[idx]

            noise = np.random.normal(0, 1, (batch_size, self.latent_dim))
            gen_imgs = self.generator.predict(noise, verbose=0)

            d_loss_real = self.discriminator.train_on_batch(imgs, valid)
            d_loss_fake = self.discriminator.train_on_batch(gen_imgs, fake)
            d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)

            # Train Generator
            noise = np.random.normal(0, 1, (batch_size, self.latent_dim))
            g_loss = self.combined.train_on_batch(noise, valid)

            history['d_loss'].append(d_loss[0])
            history['d_acc'].append(d_loss[1])
            history['g_loss'].append(g_loss)

            if epoch % sample_interval == 0:
                print(f"{epoch} [D loss: {d_loss[0]:.4f}, acc: {d_loss[1]:.4f}] [G loss: {g_loss:.4f}]")

        return history

# Train on MNIST
(X_train, _), (_, _) = keras.datasets.mnist.load_data()
X_train = (X_train.astype(np.float32) - 127.5) / 127.5
X_train = np.expand_dims(X_train, axis=-1)

gan = GAN(latent_dim=100, img_shape=(28, 28, 1))
history = gan.train(X_train, epochs=5000, batch_size=64, sample_interval=1000)

# Generate samples
noise = np.random.normal(0, 1, (16, 100))
gen_imgs = gan.generator.predict(noise, verbose=0)

fig, axes = plt.subplots(2, 8, figsize=(12, 3))
for i, ax in enumerate(axes.ravel()):
    ax.imshow(gen_imgs[i, :, :, 0], cmap='gray')
    ax.axis('off')
plt.suptitle("Generated Digits", fontsize=14)
plt.tight_layout()
plt.show()
```

---

### Section 2: DCGAN

#### Deep Convolutional GAN

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

class DCGAN:
    def __init__(self, latent_dim=100, channels=3, img_size=64):
        self.latent_dim = latent_dim
        self.img_size = img_size
        self.channels = channels
        self.img_shape = (img_size, img_size, channels)

        self.generator = self._build_generator()
        self.discriminator = self._build_discriminator()

        self.discriminator.compile(
            optimizer=keras.optimizers.Adam(0.0002, 0.5),
            loss='binary_crossentropy', metrics=['accuracy']
        )

        self.discriminator.trainable = False
        z = layers.Input(shape=(latent_dim,))
        img = self.generator(z)
        validity = self.discriminator(img)
        self.combined = keras.Model(z, validity)
        self.combined.compile(optimizer=keras.optimizers.Adam(0.0002, 0.5), loss='binary_crossentropy')

    def _build_generator(self):
        model = keras.Sequential([
            layers.Dense(128 * (self.img_size // 4) * (self.img_size // 4), input_dim=self.latent_dim),
            layers.Reshape((self.img_size // 4, self.img_size // 4, 128)),
            layers.BatchNormalization(),
            layers.ReLU(),

            layers.Conv2DTranspose(64, (4, 4), strides=2, padding='same'),
            layers.BatchNormalization(),
            layers.ReLU(),

            layers.Conv2DTranspose(32, (4, 4), strides=2, padding='same'),
            layers.BatchNormalization(),
            layers.ReLU(),

            layers.Conv2D(self.channels, (3, 3), padding='same', activation='tanh')
        ], name='DCGAN_Generator')
        model.summary()
        return model

    def _build_discriminator(self):
        model = keras.Sequential([
            layers.Conv2D(32, (4, 4), strides=2, padding='same', input_shape=self.img_shape),
            layers.LeakyReLU(0.2),
            layers.Dropout(0.25),

            layers.Conv2D(64, (4, 4), strides=2, padding='same'),
            layers.LeakyReLU(0.2),
            layers.Dropout(0.25),
            layers.BatchNormalization(),

            layers.Conv2D(128, (4, 4), strides=2, padding='same'),
            layers.LeakyReLU(0.2),
            layers.Dropout(0.25),
            layers.BatchNormalization(),

            layers.Flatten(),
            layers.Dense(1, activation='sigmoid')
        ], name='DCGAN_Discriminator')
        model.summary()
        return model

# DCGAN on CIFAR-10 (class 0 = airplane)
(X_train, y_train), _ = keras.datasets.cifar10.load_data()
X_train = X_train[y_train.flatten() == 0]  # Airplanes only
X_train = tf.image.resize(X_train, (64, 64))
X_train = (X_train.astype(np.float32) - 127.5) / 127.5

dcgan = DCGAN(latent_dim=100, channels=3, img_size=64)

# Training loop with label smoothing
batch_size = 64
epochs = 3000

for epoch in range(epochs):
    idx = np.random.randint(0, X_train.shape[0], batch_size)
    real_imgs = X_train[idx].numpy()

    noise = np.random.normal(0, 1, (batch_size, 100))
    fake_imgs = dcgan.generator.predict(noise, verbose=0)

    real_labels = np.ones((batch_size, 1)) * 0.9  # Label smoothing
    fake_labels = np.zeros((batch_size, 1)) + 0.1

    d_loss_real = dcgan.discriminator.train_on_batch(real_imgs, real_labels)
    d_loss_fake = dcgan.discriminator.train_on_batch(fake_imgs, fake_labels)

    noise = np.random.normal(0, 1, (batch_size, 100))
    g_loss = dcgan.combined.train_on_batch(noise, np.ones((batch_size, 1)))

    if epoch % 500 == 0:
        print(f"Epoch {epoch} [D loss: {0.5*(d_loss_real[0]+d_loss_fake[0]):.4f}] [G loss: {g_loss:.4f}]")
```

---

### Section 3: Conditional GAN

#### Class-Conditional Generation

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt

class ConditionalGAN:
    def __init__(self, latent_dim=100, num_classes=10, img_shape=(28, 28, 1)):
        self.latent_dim = latent_dim
        self.num_classes = num_classes
        self.img_shape = img_shape

        self.generator = self._build_generator()
        self.discriminator = self._build_discriminator()

        self.discriminator.compile(optimizer=keras.optimizers.Adam(0.0002, 0.5),
                                    loss='binary_crossentropy', metrics=['accuracy'])

        z = layers.Input(shape=(latent_dim,))
        label = layers.Input(shape=(1,), dtype='int32')
        img = self.generator([z, label])
        self.discriminator.trainable = False
        validity = self.discriminator([img, label])
        self.combined = keras.Model([z, label], validity)
        self.combined.compile(optimizer=keras.optimizers.Adam(0.0002, 0.5), loss='binary_crossentropy')

    def _build_generator(self):
        z = layers.Input(shape=(self.latent_dim,))
        label = layers.Input(shape=(1,), dtype='int32')
        label_embed = layers.Embedding(self.num_classes, self.latent_dim)(label)
        label_embed = layers.Flatten()(label_embed)
        combined = layers.Multiply()([z, label_embed])

        x = layers.Dense(256)(combined)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.BatchNormalization()(x)

        x = layers.Dense(512)(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.BatchNormalization()(x)

        x = layers.Dense(1024)(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.BatchNormalization()(x)

        img = layers.Dense(np.prod(self.img_shape), activation='tanh')(x)
        img = layers.Reshape(self.img_shape)(img)

        return keras.Model([z, label], img, name='CGAN_Generator')

    def _build_discriminator(self):
        img = layers.Input(shape=self.img_shape)
        label = layers.Input(shape=(1,), dtype='int32')
        label_embed = layers.Embedding(self.num_classes, np.prod(self.img_shape))(label)
        label_embed = layers.Flatten()(label_embed)
        label_embed = layers.Reshape(self.img_shape)(label_embed)

        combined = layers.Multiply()([img, label_embed])
        x = layers.Flatten()(combined)

        x = layers.Dense(512)(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Dropout(0.3)(x)

        x = layers.Dense(256)(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Dropout(0.3)(x)

        validity = layers.Dense(1, activation='sigmoid')(x)
        return keras.Model([img, label], validity, name='CGAN_Discriminator')

    def generate_samples(self, digit, n=16):
        noise = np.random.normal(0, 1, (n, self.latent_dim))
        labels = np.full((n, 1), digit)
        return self.generator.predict([noise, labels], verbose=0)

# Train CGAN on MNIST
(X_train, y_train), _ = keras.datasets.mnist.load_data()
X_train = (X_train.astype(np.float32) - 127.5) / 127.5
X_train = np.expand_dims(X_train, -1)

cgan = ConditionalGAN(latent_dim=100, num_classes=10, img_shape=(28, 28, 1))

batch_size = 128
epochs = 4000
for epoch in range(epochs):
    idx = np.random.randint(0, X_train.shape[0], batch_size)
    real_imgs = X_train[idx]
    labels = y_train[idx]

    noise = np.random.normal(0, 1, (batch_size, 100))
    fake_labels = np.random.randint(0, 10, (batch_size, 1))
    fake_imgs = cgan.generator.predict([noise, fake_labels], verbose=0)

    real = np.ones((batch_size, 1))
    fake = np.zeros((batch_size, 1))

    d_loss_real = cgan.discriminator.train_on_batch([real_imgs, labels], real)
    d_loss_fake = cgan.discriminator.train_on_batch([fake_imgs, fake_labels], fake)

    noise = np.random.normal(0, 1, (batch_size, 100))
    g_labels = np.random.randint(0, 10, (batch_size, 1))
    g_loss = cgan.combined.train_on_batch([noise, g_labels], real)

    if epoch % 500 == 0:
        print(f"Epoch {epoch} [D: {0.5*(d_loss_real[0]+d_loss_fake[0]):.4f}] [G: {g_loss:.4f}]")

# Visualize conditional generation
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for digit, ax in enumerate(axes.ravel()):
    imgs = cgan.generate_samples(digit, 1)
    ax.imshow(imgs[0, :, :, 0], cmap='gray')
    ax.set_title(f"Digit: {digit}")
    ax.axis('off')
plt.suptitle("Conditional Generation â€” Each Digit", fontsize=14)
plt.tight_layout()
plt.show()
```

---

### Section 4: Variational Autoencoders (VAE)

#### VAE Implementation

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

class VAE(keras.Model):
    def __init__(self, input_dim=784, latent_dim=2, hidden_dim=512):
        super().__init__()
        self.latent_dim = latent_dim

        # Encoder
        self.encoder_hidden = layers.Dense(hidden_dim, activation='relu')
        self.z_mean = layers.Dense(latent_dim)
        self.z_log_var = layers.Dense(latent_dim)

        # Decoder
        self.decoder_hidden = layers.Dense(hidden_dim, activation='relu')
        self.decoder_output = layers.Dense(input_dim, activation='sigmoid')

    def encode(self, x):
        h = self.encoder_hidden(x)
        z_mean = self.z_mean(h)
        z_log_var = self.z_log_var(h)
        return z_mean, z_log_var

    def reparameterize(self, z_mean, z_log_var):
        eps = tf.random.normal(shape=tf.shape(z_mean))
        return z_mean + tf.exp(0.5 * z_log_var) * eps

    def decode(self, z):
        h = self.decoder_hidden(z)
        return self.decoder_output(h)

    def call(self, x):
        z_mean, z_log_var = self.encode(x)
        z = self.reparameterize(z_mean, z_log_var)
        reconstructed = self.decode(z)
        return reconstructed, z_mean, z_log_var

    def compute_loss(self, x):
        reconstructed, z_mean, z_log_var = self(x)

        # Reconstruction loss
        recon_loss = tf.reduce_sum(
            keras.losses.binary_crossentropy(x, reconstructed), axis=1
        )

        # KL divergence
        kl_loss = -0.5 * tf.reduce_sum(
            1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var), axis=1
        )

        return tf.reduce_mean(recon_loss + kl_loss)

# Train VAE
(X_train, y_train), (X_test, _) = keras.datasets.mnist.load_data()
X_train = X_train.reshape(-1, 784).astype('float32') / 255.0
X_test = X_test.reshape(-1, 784).astype('float32') / 255.0

vae = VAE(input_dim=784, latent_dim=2, hidden_dim=512)
optimizer = keras.optimizers.Adam(learning_rate=1e-3)

@tf.function
def train_step(x):
    with tf.GradientTape() as tape:
        loss = vae.compute_loss(x)
    grads = tape.gradient(loss, vae.trainable_variables)
    optimizer.apply_gradients(zip(grads, vae.trainable_variables))
    return loss

# Training
batch_size = 128
train_dataset = tf.data.Dataset.from_tensor_slices(X_train).shuffle(60000).batch(batch_size)

for epoch in range(30):
    epoch_loss = 0
    n_batches = 0
    for batch in train_dataset:
        loss = train_step(batch)
        epoch_loss += loss.numpy()
        n_batches += 1
    if epoch % 5 == 0:
        print(f"Epoch {epoch}: Loss = {epoch_loss / n_batches:.4f}")

# Visualize reconstructions
n = 10
reconstructed, _, _ = vae(X_test[:n])
fig, axes = plt.subplots(2, n, figsize=(15, 3))
for i in range(n):
    axes[0, i].imshow(X_test[i].reshape(28, 28), cmap='gray')
    axes[0, i].axis('off')
    axes[1, i].imshow(reconstructed[i].numpy().reshape(28, 28), cmap='gray')
    axes[1, i].axis('off')
axes[0, 0].set_title("Original")
axes[1, 0].set_title("Reconstructed")
plt.suptitle("VAE Reconstructions", fontsize=14)
plt.tight_layout()
plt.show()

# Latent space visualization
z_means = []
for i in range(len(X_test)):
    zm, _ = vae.encode(X_test[i:i+1])
    z_means.append(zm.numpy()[0])
z_means = np.array(z_means)

plt.figure(figsize=(8, 8))
scatter = plt.scatter(z_means[:, 0], z_means[:, 1], c=y_test, cmap='tab10', s=1)
plt.colorbar(scatter)
plt.title("VAE Latent Space (colored by digit)")
plt.xlabel("z[0]")
plt.ylabel("z[1]")
plt.show()
```

---

### Section 5: Denoising Autoencoders

#### Denoising Autoencoder for Image Restoration

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

def add_noise(images, noise_factor=0.5):
    noisy = images + noise_factor * tf.random.normal(shape=tf.shape(images))
    return tf.clip_by_value(noisy, 0.0, 1.0)

class DenoisingAutoencoder(keras.Model):
    def __init__(self, input_shape=(28, 28, 1)):
        super().__init__()

        # Encoder
        self.encoder = keras.Sequential([
            layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=input_shape),
            layers.MaxPooling2D((2, 2), padding='same'),
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.MaxPooling2D((2, 2), padding='same'),
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.MaxPooling2D((2, 2), padding='same'),
        ], name='encoder')

        # Decoder
        self.decoder = keras.Sequential([
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.UpSampling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.UpSampling2D((2, 2)),
            layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            layers.UpSampling2D((2, 2)),
            layers.Conv2D(1, (3, 3), activation='sigmoid', padding='same'),
        ], name='decoder')

    def call(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

# Train
(X_train, _), (X_test, _) = keras.datasets.mnist.load_data()
X_train = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
X_test = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0

denoise_ae = DenoisingAutoencoder()
denoise_ae.compile(optimizer='adam', loss='mse')

train_noisy = add_noise(X_train, noise_factor=0.4)
test_noisy = add_noise(X_test, noise_factor=0.4)

denoise_ae.fit(train_noisy, X_train, epochs=30, batch_size=128,
               validation_data=(test_noisy, X_test), verbose=1)

# Visualize denoising
n = 10
denoised = denoise_ae.predict(test_noisy[:n], verbose=0)

fig, axes = plt.subplots(3, n, figsize=(15, 5))
for i in range(n):
    axes[0, i].imshow(X_test[i, :, :, 0], cmap='gray')
    axes[0, i].axis('off')
    axes[1, i].imshow(test_noisy[i, :, :, 0], cmap='gray')
    axes[1, i].axis('off')
    axes[2, i].imshow(denoised[i, :, :, 0], cmap='gray')
    axes[2, i].axis('off')

axes[0, 0].set_ylabel("Original", fontsize=12)
axes[1, 0].set_ylabel("Noisy", fontsize=12)
axes[2, 0].set_ylabel("Denoised", fontsize=12)
plt.suptitle("Denoising Autoencoder Results", fontsize=14)
plt.tight_layout()
plt.show()

# Measure denoising quality
mse_before = np.mean((X_test - test_noisy.numpy()) ** 2)
mse_after = np.mean((X_test - denoised) ** 2)
print(f"MSE before denoising: {mse_before:.4f}")
print(f"MSE after denoising:  {mse_after:.4f}")
print(f"Noise reduction: {(1 - mse_after/mse_before)*100:.1f}%")
```

---

### Section 6: Image Generation

#### Generating Diverse Samples

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt

# Using trained VAE for generation
def generate_from_vae(model, n_samples=16, latent_dim=2):
    z_random = np.random.normal(0, 1, (n_samples, latent_dim))
    generated = model.decode(z_random).numpy()
    return generated

# Interpolation in latent space
def interpolate(model, z1, z2, n_steps=10):
    alphas = np.linspace(0, 1, n_steps).reshape(-1, 1)
    interpolated = z1 * (1 - alphas) + z2 * alphas
    generated = model.decode(interpolated).numpy()
    return generated

# Get latent vectors for two specific digits
def find_digit_latent(model, X, y, digit, n=100):
    mask = y == digit
    subset = X[mask][:n]
    z_mean, _ = model.encode(subset)
    return tf.reduce_mean(z_mean, axis=0).numpy()

# Visualize grid of generated samples
generated = generate_from_vae(vae, n_samples=25)

fig, axes = plt.subplots(5, 5, figsize=(8, 8))
for i, ax in enumerate(axes.ravel()):
    if i < len(generated):
        ax.imshow(generated[i].reshape(28, 28), cmap='gray')
    ax.axis('off')
plt.suptitle("VAE Generated Samples", fontsize=14)
plt.tight_layout()
plt.show()

# Latent space traversal
n_interpolations = 15
n_pairs = 3

fig, axes = plt.subplots(n_pairs, n_interpolations, figsize=(15, n_pairs * 2))
for pair in range(n_pairs):
    z1 = np.random.normal(0, 1, (1, 2))
    z2 = np.random.normal(0, 1, (1, 2))
    interp = interpolate(vae, z1, z2, n_interpolations)
    for i in range(n_interpolations):
        axes[pair, i].imshow(interp[i].reshape(28, 28), cmap='gray')
        axes[pair, i].axis('off')

plt.suptitle("Latent Space Interpolation", fontsize=14)
plt.tight_layout()
plt.show()
```

---

### Section 7: Style Transfer

#### Neural Style Transfer with TensorFlow

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt

def load_and_preprocess(path, target_size=(512, 512)):
    img = tf.io.read_file(path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.resize(img, target_size)
    img = tf.expand_dims(img, 0)
    return img

def vgg_layers(layer_names):
    vgg = keras.applications.VGG19(include_top=False, weights='imagenet')
    vgg.trainable = False
    outputs = [vgg.get_layer(name).output for name in layer_names]
    return keras.Model([vgg.input], outputs)

def gram_matrix(tensor):
    result = tf.linalg.einsum('bijc,bijd->bcd', tensor, tensor)
    input_shape = tf.shape(tensor)
    num_locations = tf.cast(input_shape[1] * input_shape[2], tf.float32)
    return result / num_locations

class StyleContentModel(keras.Model):
    def __init__(self, style_layers, content_layers):
        super().__init__()
        self.vgg = vgg_layers(style_layers + content_layers)
        self.style_layers = style_layers
        self.content_layers = content_layers
        self.num_style_layers = len(style_layers)

    def call(self, inputs):
        inputs = inputs * 255.0
        preprocessed = keras.applications.vgg19.preprocess_input(inputs)
        outputs = self.vgg(preprocessed)

        style_outputs = [gram_matrix(out) for out in outputs[:self.num_style_layers]]
        content_outputs = outputs[self.num_style_layers:]

        style_dict = dict(zip(self.style_layers, style_outputs))
        content_dict = dict(zip(self.content_layers, content_outputs))
        return {'style': style_dict, 'content': content_dict}

# Configuration
style_layers = ['block1_conv1', 'block2_conv1', 'block3_conv1', 'block4_conv1', 'block5_conv1']
content_layers = ['block5_conv2']
extractor = StyleContentModel(style_layers, content_layers)

style_weight = 1e-2
content_weight = 1e4

@tf.function
def train_step(image, style_targets, content_targets):
    with tf.GradientTape() as tape:
        outputs = extractor(image)
        style_outputs = outputs['style']
        content_outputs = outputs['content']

        style_loss = tf.add_n([tf.reduce_mean((style_outputs[name] - style_targets[name])**2)
                               for name in style_outputs.keys()])
        style_loss *= style_weight

        content_loss = tf.add_n([tf.reduce_mean((content_outputs[name] - content_targets[name])**2)
                                  for name in content_outputs.keys()])
        content_loss *= content_weight

        total_loss = style_loss + content_loss

    grad = tape.gradient(total_loss, image)
    opt.apply_gradients([(grad, image)])
    image.assign(tf.clip_by_value(image, 0.0, 255.0))
    return total_loss

# Run style transfer (with synthetic images for demo)
style_image = tf.random.normal((1, 512, 512, 3)) * 127.5 + 127.5
content_image = tf.random.normal((1, 512, 512, 3)) * 127.5 + 127.5

style_targets = extractor(style_image)['style']
content_targets = extractor(content_image)['content']

image = tf.Variable(content_image)
opt = keras.optimizers.Adam(learning_rate=0.02)

epochs = 3
steps_per_epoch = 100

for n in range(epochs):
    for step in range(steps_per_epoch):
        loss = train_step(image, style_targets, content_targets)
    print(f"Epoch {n+1}, Loss: {loss.numpy():.2f}")

# To use with real images:
# content = load_and_preprocess('content.jpg')
# style = load_and_preprocess('style.jpg')
```

---

### Section 8: Latent Space Exploration

#### Understanding and Navigating Latent Space

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE

# Encode all test data into latent space
z_means_all = []
z_log_vars_all = []
labels_all = []

for i in range(len(X_test)):
    zm, zlv = vae.encode(X_test[i:i+1])
    z_means_all.append(zm.numpy()[0])
    z_log_vars_all.append(zlv.numpy()[0])

z_means_all = np.array(z_means_all)
z_log_vars_all = np.array(z_log_vars_all)

# 1. Latent Space Clustering (2D latent dim)
plt.figure(figsize=(10, 10))
scatter = plt.scatter(z_means_all[:, 0], z_means_all[:, 1],
                      c=y_test, cmap='tab10', s=2, alpha=0.5)
plt.colorbar(scatter, label='Digit')
plt.title("VAE 2D Latent Space â€” Digit Clustering")
plt.xlabel("zâ‚")
plt.ylabel("zâ‚‚")
plt.grid(True, alpha=0.3)
plt.show()

# 2. Latent space walk (single dimension)
fig, axes = plt.subplots(1, 10, figsize=(20, 2))
for i, z_val in enumerate(np.linspace(-3, 3, 10)):
    z = np.zeros((1, 2))
    z[0, 0] = z_val
    generated = vae.decode(z).numpy()
    axes[i].imshow(generated.reshape(28, 28), cmap='gray')
    axes[i].set_title(f"zâ‚={z_val:.1f}")
    axes[i].axis('off')
plt.suptitle("Latent Dimension Walk â€” zâ‚", fontsize=14)
plt.tight_layout()
plt.show()

# 3. Random sampling and decoding
n_samples = 64
z_samples = np.random.normal(0, 1, (n_samples, 2))
generated = vae.decode(z_samples).numpy()

fig, axes = plt.subplots(8, 8, figsize=(10, 10))
for i, ax in enumerate(axes.ravel()):
    ax.imshow(generated[i].reshape(28, 28), cmap='gray')
    ax.axis('off')
plt.suptitle("Randomly Sampled from Latent Space", fontsize=14)
plt.tight_layout()
plt.show()

# 4. Traversing multiple latent dimensions (for higher-dim VAE)
def create_manifold(model, dim1=0, dim2=1, range_val=3, n=20, latent_dim=20):
    """Create a 2D manifold by varying two latent dimensions."""
    linear_space = np.linspace(-range_val, range_val, n)
    manifold = np.zeros((n, n, 28, 28))

    for i, v1 in enumerate(linear_space):
        for j, v2 in enumerate(linear_space):
            z = np.zeros((1, latent_dim))
            z[0, dim1] = v1
            z[0, dim2] = v2
            img = model.decode(z).numpy()
            manifold[i, j] = img.reshape(28, 28)

    return manifold

# For 2D latent VAE (use the one we trained)
fig, axes = plt.subplots(10, 10, figsize=(10, 10))
manifold = create_manifold(vae, dim1=0, dim2=1, range_val=3, n=10, latent_dim=2)
for i in range(10):
    for j in range(10):
        axes[i, j].imshow(manifold[i, j], cmap='gray')
        axes[i, j].axis('off')
plt.suptitle("2D Latent Manifold", fontsize=14)
plt.tight_layout()
plt.show()
```

---

### Module 24 â€” Real-Time Use Cases

| Use Case | Architecture | Industry | Description |
|----------|-------------|----------|-------------|
| Face Generation | DCGAN/StyleGAN | Entertainment | Generate photorealistic human faces |
| Image Super-Resolution | GAN (SRGAN) | Media | Enhance low-resolution images to high quality |
| Data Augmentation | Conditional GAN | Healthcare | Generate synthetic medical images for rare conditions |
| Anomaly Detection | VAE | Manufacturing | Detect defective products via reconstruction error |
| Image Denoising | Denoising Autoencoder | Photography | Remove noise from low-light photographs |
| Style Transfer | Neural Style Transfer | Design | Apply artistic styles to photographs |
| Drug Discovery | VAE | Pharma | Generate novel molecular structures |
| Face Aging | Conditional GAN | Apps | Simulate aging progression on portraits |

### Module 24 â€” Project Ideas

| Project | Description | Difficulty |
|---------|-------------|------------|
| MNIST Digit Generator | Train a DCGAN to generate realistic handwritten digits | Beginner |
| Face Autoencoder | Build a VAE for face generation and latent space interpolation | Intermediate |
| Image Colorization | Use a conditional GAN to colorize grayscale images | Intermediate |
| Art Style Transfer | Build a real-time style transfer system for video streams | Advanced |
| Medical Image Augmentation | Train a conditional GAN to generate synthetic X-ray images | Advanced |

---

---

## MODULE 25: TRANSFORMERS & ATTENTION MECHANISMS

### Learning Objectives
- Understand self-attention and multi-head attention mechanisms
- Implement positional encoding and transformer architecture
- Fine-tune BERT and GPT models for NLP tasks
- Master the Hugging Face Transformers ecosystem

---

### Section 1: Self-Attention

#### Self-Attention from Scratch

```python
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
import matplotlib.pyplot as plt

class SelfAttention:
    def __init__(self, d_model):
        self.d_model = d_model
        self.Wq = np.random.randn(d_model, d_model) * np.sqrt(2.0 / d_model)
        self.Wk = np.random.randn(d_model, d_model) * np.sqrt(2.0 / d_model)
        self.Wv = np.random.randn(d_model, d_model) * np.sqrt(2.0 / d_model)

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=-1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=-1, keepdims=True)

    def forward(self, X):
        Q = X @ self.Wq
        K = X @ self.Wk
        V = X @ self.Wv

        scores = Q @ K.T / np.sqrt(self.d_model)
        attention_weights = self.softmax(scores)
        output = attention_weights @ V

        return output, attention_weights

# Demo
np.random.seed(42)
seq_len, d_model = 4, 8
X = np.random.randn(seq_len, d_model)

sa = SelfAttention(d_model)
output, weights = sa.forward(X)

print(f"Input shape:  {X.shape}")
print(f"Output shape: {output.shape}")
print(f"Weights shape: {weights.shape}")
print(f"\nAttention Weights (each row sums to 1):")
print(np.round(weights, 3))

# Visualize attention
fig, ax = plt.subplots(figsize=(6, 5))
im = ax.imshow(weights, cmap='Blues')
ax.set_xticks(range(4))
ax.set_yticks(range(4))
ax.set_xticklabels(['Word 1', 'Word 2', 'Word 3', 'Word 4'])
ax.set_yticklabels(['Word 1', 'Word 2', 'Word 3', 'Word 4'])
ax.set_title("Self-Attention Weights")
plt.colorbar(im)
plt.tight_layout()
plt.show()

# TensorFlow Self-Attention
tf_attention = layers.MultiHeadAttention(num_heads=4, key_dim=d_model)
X_tf = tf.random.normal((1, seq_len, d_model))
output_tf, weights_tf = tf_attention(X_tf, X_tf, return_attention_scores=True)

print(f"\nTF MultiHead Attention output: {output_tf.shape}")
print(f"TF Attention scores: {weights_tf.shape}")
```

---

### Section 2: Multi-Head Attention

#### Complete Multi-Head Attention Implementation

```python
import tensorflow as tf
from tensorflow.keras import layers
import numpy as np

class MultiHeadAttention(layers.Layer):
    def __init__(self, d_model, num_heads, **kwargs):
        super().__init__(**kwargs)
        assert d_model % num_heads == 0

        self.d_model = d_model
        self.num_heads = num_heads
        self.depth = d_model // num_heads

        self.Wq = layers.Dense(d_model)
        self.Wk = layers.Dense(d_model)
        self.Wv = layers.Dense(d_model)
        self.dense = layers.Dense(d_model)

    def split_heads(self, x, batch_size):
        x = tf.reshape(x, (batch_size, -1, self.num_heads, self.depth))
        return tf.transpose(x, perm=[0, 2, 1, 3])

    def scaled_dot_product_attention(self, q, k, v, mask=None):
        matmul_qk = tf.matmul(q, k, transpose_b=True)
        dk = tf.cast(tf.shape(k)[-1], tf.float32)
        scaled = matmul_qk / tf.math.sqrt(dk)

        if mask is not None:
            scaled += mask * -1e9

        weights = tf.nn.softmax(scaled, axis=-1)
        output = tf.matmul(weights, v)
        return output, weights

    def call(self, query, key, value, mask=None):
        batch_size = tf.shape(query)[0]

        q = self.split_heads(self.Wq(query), batch_size)
        k = self.split_heads(self.Wk(key), batch_size)
        v = self.split_heads(self.Wv(value), batch_size)

        attention_output, attention_weights = self.scaled_dot_product_attention(q, k, v, mask)

        attention_output = tf.transpose(attention_output, perm=[0, 2, 1, 3])
        concat = tf.reshape(attention_output, (batch_size, -1, self.d_model))
        output = self.dense(concat)

        return output, attention_weights

# Demo
mha = MultiHeadAttention(d_model=512, num_heads=8)
q = tf.random.normal((2, 10, 512))  # (batch, seq_len, d_model)
output, attn_weights = mha(q, q, q)

print(f"Input shape:    {q.shape}")
print(f"Output shape:   {output.shape}")
print(f"Attention shape: {attn_weights.shape}")
print(f"  -> ({batch=2}, {heads=8}, {query_len=10}, {key_len=10})")

# Visualization of multi-head attention patterns
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
for i, ax in enumerate(axes.ravel()):
    if i < 8:
        im = ax.imshow(attn_weights[0, i].numpy(), cmap='viridis')
        ax.set_title(f"Head {i+1}")
        ax.set_xlabel("Key Position")
        ax.set_ylabel("Query Position")
plt.colorbar(im, ax=axes)
plt.suptitle("Multi-Head Attention Patterns", fontsize=14)
plt.tight_layout()
plt.show()
```

---

### Section 3: Positional Encoding

#### Sinusoidal and Learnable Positional Encoding

```python
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

class PositionalEncoding(layers.Layer):
    def __init__(self, d_model, max_len=5000, **kwargs):
        super().__init__(**kwargs)
        self.d_model = d_model

        pe = np.zeros((max_len, d_model))
        position = np.arange(0, max_len).reshape(-1, 1)
        div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))

        pe[:, 0::2] = np.sin(position * div_term)
        pe[:, 1::2] = np.cos(position * div_term)

        self.pe = tf.constant(pe[np.newaxis, :, :], dtype=tf.float32)

    def call(self, x):
        seq_len = tf.shape(x)[1]
        return x + self.pe[:, :seq_len, :]

# Visualize positional encoding
max_len = 100
d_model = 64

pe = PositionalEncoding(d_model=d_model, max_len=max_len)
pe_values = pe.pe.numpy()[0]

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Heatmap
axes[0].imshow(pe_values[:50, :32], cmap='RdBu', aspect='auto')
axes[0].set_xlabel("Embedding Dimension")
axes[0].set_ylabel("Position")
axes[0].set_title("Positional Encoding Heatmap (first 32 dims)")

# Individual dimension patterns
for dim in [0, 1, 2, 3, 4, 5]:
    axes[1].plot(pe_values[:100, dim], label=f'dim={dim}')
axes[1].set_xlabel("Position")
axes[1].set_ylabel("Encoding Value")
axes[1].set_title("Positional Encoding Patterns")
axes[1].legend()

plt.tight_layout()
plt.show()

# Learnable positional encoding
class LearnablePositionalEncoding(layers.Layer):
    def __init__(self, max_len, d_model, **kwargs):
        super().__init__(**kwargs)
        self.pos_embedding = layers.Embedding(input_dim=max_len, output_dim=d_model)

    def call(self, x):
        seq_len = tf.shape(x)[1]
        positions = tf.range(start=0, limit=seq_len, delta=1)
        return x + self.pos_embedding(positions)

learnable_pe = LearnablePositionalEncoding(max_len=5000, d_model=512)
test_input = tf.random.normal((1, 100, 512))
output = learnable_pe(test_input)
print(f"Input:  {test_input.shape}")
print(f"Output: {output.shape}")
```

---

### Section 4: Transformer Architecture

#### Complete Transformer Implementation

```python
import tensorflow as tf
from tensorflow.keras import layers
import numpy as np

class TransformerBlock(layers.Layer):
    def __init__(self, d_model, num_heads, dff, dropout_rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.att = MultiHeadAttention(d_model, num_heads)
        self.ffn = keras.Sequential([
            layers.Dense(dff, activation='gelu'),
            layers.Dense(d_model)
        ])
        self.layernorm1 = layers.LayerNormalization(epsilon=1e-6)
        self.layernorm2 = layers.LayerNormalization(epsilon=1e-6)
        self.dropout1 = layers.Dropout(dropout_rate)
        self.dropout2 = layers.Dropout(dropout_rate)

    def call(self, x, mask=None, training=False):
        attn_output, _ = self.att(x, x, x, mask)
        attn_output = self.dropout1(attn_output, training=training)
        x = self.layernorm1(x + attn_output)
        ffn_output = self.ffn(x)
        ffn_output = self.dropout2(ffn_output, training=training)
        x = self.layernorm2(x + ffn_output)
        return x
```

The `call` method implements two key sub-layers:
1. **Multi-Head Self-Attention** with residual connection and layer normalization.
2. **Position-wise Feed-Forward Network** with residual connection and layer normalization.

Residual connections (`x + attn_output`) allow gradients to flow directly through the network, mitigating vanishing gradients in deep stacks.

---

### 4.5 Putting It All Together â€” Full Transformer Encoder

```python
class TransformerEncoder(layers.Layer):
    def __init__(self, num_layers, d_model, num_heads, dff, vocab_size,
                 max_seq_length, dropout_rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.embedding = layers.Embedding(vocab_size, d_model)
        self.pos_encoding = PositionalEncoding(max_seq_length, d_model)
        self.transformer_blocks = [
            TransformerBlock(d_model, num_heads, dff, dropout_rate)
            for _ in range(num_layers)
        ]
        self.dropout = layers.Dropout(dropout_rate)

    def call(self, x, mask=None, training=False):
        x = self.embedding(x)
        x *= tf.math.sqrt(tf.cast(tf.shape(x)[-1], tf.float32))
        x = self.pos_encoding(x)
        x = self.dropout(x, training=training)
        for block in self.transformer_blocks:
            x = block(x, mask=mask, training=training)
        return x

encoder = TransformerEncoder(
    num_layers=4, d_model=128, num_heads=8, dff=512,
    vocab_size=10000, max_seq_length=512
)

sample_input = tf.random.uniform((2, 50), maxval=10000, dtype=tf.int32)
output = encoder(sample_input)
print(f"Input shape:  {sample_input.shape}")
print(f"Output shape: {output.shape}")
```

---

## 5. BERT and Bidirectional Understanding

### 5.1 Architecture Overview

BERT (Bidirectional Encoder Representations from Transformers) uses only the **encoder** stack of the Transformer. Unlike GPT, BERT reads the entire sequence in both directions simultaneously, making it ideal for understanding tasks.

| Model | Parameters | Hidden Size | Layers | Heads |
|-------|-----------|-------------|--------|-------|
| BERT-Base | 110M | 768 | 12 | 12 |
| BERT-Large | 340M | 1024 | 24 | 16 |

### 5.2 Pre-training Objectives

**Masked Language Model (MLM):** Randomly mask 15% of tokens and predict them from context.
```
Input:  The cat [MASK] on the mat
Target: The cat sat on the mat
```

**Next Sentence Prediction (NSP):** Binary classification to predict whether sentence B follows sentence A.
```
Sentence A: "The cat sat on the mat."
Sentence B: "It was a fluffy cat."  â†’ IsNext
Sentence B: "The stock market rose." â†’ NotNext
```

### 5.3 Fine-tuning BERT

After pre-training, BERT is fine-tuned by adding a task-specific output layer:

- **Classification:** Add a `[CLS]` token classifier on top.
- **Named Entity Recognition (NER):** Classify each token.
- **Question Answering:** Predict start and end span positions.

### 5.4 Code Example â€” Fine-tuning BERT

```python
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset
import torch

dataset = load_dataset("imdb")
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        padding="max_length",
        truncation=True,
        max_length=256
    )

tokenized_datasets = dataset.map(tokenize_function, batched=True)
tokenized_datasets = tokenized_datasets.rename_column("label", "labels")
tokenized_datasets.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

small_train = tokenized_datasets["train"].shuffle(seed=42).select(range(2000))
small_eval = tokenized_datasets["test"].shuffle(seed=42).select(range(500))

model = BertForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=2
)

training_args = TrainingArguments(
    output_dir="./bert_sentiment",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=100,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=small_train,
    eval_dataset=small_eval,
)

trainer.train()
results = trainer.evaluate()
print(f"Validation Accuracy: {results['eval_accuracy']:.4f}")
```

---

## 6. GPT and Autoregressive Language Models

### 6.1 Architecture Overview

GPT (Generative Pre-trained Transformer) uses only the **decoder** stack with **causal (masked) self-attention**, ensuring each token can only attend to previous tokens.

| Model | Parameters | Layers | Hidden Size |
|-------|-----------|--------|-------------|
| GPT-2 Small | 117M | 12 | 768 |
| GPT-2 Medium | 345M | 24 | 1024 |
| GPT-2 Large | 774M | 36 | 1280 |
| GPT-3 | 175B | 96 | 12288 |

### 6.2 Autoregressive Generation

GPT generates text token by token:

```
Step 1: "The" â†’ predict "cat"
Step 2: "The cat" â†’ predict "sat"
Step 3: "The cat sat" â†’ predict "on"
Step 4: "The cat sat on" â†’ predict "the"
```

### 6.3 Sampling Strategies

| Strategy | Description | Effect |
|----------|-------------|--------|
| **Greedy** | Always pick highest probability token | Repetitive, deterministic |
| **Temperature** | Scale logits by `1/T` (T < 1 = sharper, T > 1 = flatter) | Controls randomness |
| **Top-k** | Sample from top-k most likely tokens | Limits vocabulary |
| **Top-p (Nucleus)** | Sample from smallest set with cumulative prob â‰¥ p | Dynamic vocabulary |

### 6.4 Code Example â€” Text Generation with GPT-2

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
model.eval()

def generate_text(prompt, max_tokens=100, temperature=0.7, top_k=50, top_p=0.9):
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    with torch.no_grad():
        output = model.generate(
            input_ids,
            max_new_tokens=max_tokens,
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
            do_sample=True,
            no_repeat_ngram_size=2,
            pad_token_id=tokenizer.eos_token_id
        )

    generated = tokenizer.decode(output[0], skip_special_tokens=True)
    return generated

prompts = [
    "The future of artificial intelligence is",
    "In a galaxy far far away, there was",
    "The key to successful machine learning is",
]

for prompt in prompts:
    print(f"\n{'='*60}")
    print(f"Prompt: {prompt}")
    print(f"Generated: {generate_text(prompt, temperature=0.8)}")

    print(f"\n--- Lower temperature (0.3) ---")
    print(generate_text(prompt, temperature=0.3, max_tokens=80))
```

### 6.5 GPT vs BERT Comparison

| Feature | BERT | GPT |
|---------|------|-----|
| Architecture | Encoder-only | Decoder-only |
| Attention | Bidirectional | Unidirectional (causal) |
| Pre-training | MLM + NSP | Next token prediction |
| Best for | Understanding (NLU) | Generation (NLG) |
| Tasks | Classification, NER, Q&A | Text generation, summarization |

---

## 7. Hugging Face Transformers Library

### 7.1 Pipeline API

The `pipeline` API provides a high-level interface for common NLP tasks:

```python
from transformers import pipeline

# Sentiment Analysis
classifier = pipeline("sentiment-analysis")
result = classifier("I absolutely loved this movie! It was fantastic.")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Named Entity Recognition
ner = pipeline("ner", grouped_entities=True)
entities = ner("Elon Musk founded SpaceX in Hawthorne, California in 2002.")
for ent in entities:
    print(f"  {ent['word']:20s} â†’ {ent['entity_group']:8s} ({ent['score']:.3f})")

# Text Generation
generator = pipeline("text-generation", model="gpt2")
output = generator("Machine learning is", max_length=50, num_return_sequences=2)
for i, seq in enumerate(output):
    print(f"\n[Sequence {i+1}]")
    print(seq["generated_text"])

# Question Answering
qa = pipeline("question-answering")
result = qa(
    question="Who founded SpaceX?",
    context="Elon Musk founded SpaceX in 2002. It is headquartered in Hawthorne."
)
print(f"Answer: {result['answer']} (confidence: {result['score']:.3f})")

# Summarization
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
text = """
Artificial intelligence has made remarkable progress in recent years.
From language models that can write essays to systems that diagnose
diseases, AI is transforming industries across the globe. However,
concerns about bias, privacy, and job displacement continue to grow.
"""
summary = summarizer(text, max_length=50, min_length=20)
print(f"Summary: {summary[0]['summary_text']}")
```

### 7.2 Tokenizers

Different models require different tokenization strategies:

```python
from transformers import AutoTokenizer

# BERT Tokenizer (WordPiece)
bert_tok = AutoTokenizer.from_pretrained("bert-base-uncased")
tokens = bert_tok.tokenize("Transformers changed NLP forever!")
print(f"BERT tokens: {tokens}")
# ['transformers', 'changed', 'nl', '##p', 'forever', '!']

# GPT-2 Tokenizer (BPE)
gpt_tok = AutoTokenizer.from_pretrained("gpt2")
tokens = gpt_tok.tokenize("Transformers changed NLP forever!")
print(f"GPT-2 tokens: {tokens}")
# ['Trans', 'form', 'ers', 'Ä changed', 'Ä N', 'LP', 'Ä forever', '!']

# Batch encoding
texts = ["Hello world", "Transformers are great"]
encoded = bert_tok(texts, padding=True, truncation=True, return_tensors="pt")
print(f"Input IDs shape: {encoded['input_ids'].shape}")
print(f"Attention mask:   {encoded['attention_mask']}")
```

### 7.3 Model Hub and Loading Models

```python
from transformers import AutoModel, AutoModelForSequenceClassification

# Load any model from the Hub
model = AutoModel.from_pretrained("bert-base-uncased")
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")

# Load for specific task
classifier = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased-finetuned-sst-2-english"
)

# Search the Hub
from huggingface_hub import list_models
models = list(list_models(search="sentiment-analysis", sort="downloads", limit=5))
for m in models:
    print(f"  {m.id} â€” {m.downloads} downloads")
```

---

## 8. Advanced Transformer Topics

### 8.1 Vision Transformers (ViT)

ViT applies the Transformer architecture to images by splitting images into fixed-size patches:

```
Image (224x224) â†’ 16x16 patches â†’ 196 patches â†’ Linear embedding â†’ [CLS] + positional encoding â†’ Transformer Encoder
```

| ViT Variant | Parameters | ImageNet Accuracy |
|-------------|-----------|-------------------|
| ViT-B/16 | 86M | 84.2% |
| ViT-L/16 | 304M | 85.2% |
| ViT-H/14 | 632M | 88.6% |

### 8.2 Multimodal Models

**CLIP (Contrastive Language-Image Pre-training):** Learns to connect images and text by training on 400M image-text pairs. Enables zero-shot image classification.

**DALL-E:** Generates images from text descriptions using a dVAE + autoregressive transformer.

**GPT-4V / Gemini:** Unified models that process text, images, and audio in a single architecture.

### 8.3 Efficient Transformers

| Model | Approach | Complexity Reduction |
|-------|----------|---------------------|
| **Linformer** | Low-rank approximation of attention matrix | O(n) vs O(nÂ²) |
| **Performer** | Random feature map approximation (FAVOR+) | O(n) |
| **Longformer** | Local + global attention pattern | O(n) |
| **Reformer** | LSH attention (hashing similar queries) | O(n log n) |
| **Flash Attention** | IO-aware exact attention (tiling) | Same accuracy, 2-4x speedup |

### 8.4 Code Example â€” ViT for Image Classification

```python
import torch
from torchvision import transforms
from PIL import Image
from transformers import ViTForImageClassification, ViTImageProcessor

model_name = "google/vit-base-patch16-224"
processor = ViTImageProcessor.from_pretrained(model_name)
model = ViTForImageClassification.from_pretrained(model_name)

def classify_image(image_path):
    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = logits.argmax(-1).item()

    probs = torch.nn.functional.softmax(logits, dim=-1)
    top5 = torch.topk(probs, 5)

    print(f"Predicted: {model.config.id2label[predicted_class]}")
    print("Top 5 predictions:")
    for prob, idx in zip(top5.values[0], top5.indices[0]):
        label = model.config.id2label[idx.item()]
        print(f"  {label:30s} {prob.item():.4f}")

    return model.config.id2label[predicted_class]

# Zero-shot with CLIP
from transformers import CLIPProcessor, CLIPModel

clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

image = Image.open("example.jpg")
texts = ["a photo of a cat", "a photo of a dog", "a painting of a sunset"]

inputs = clip_processor(text=texts, images=image, return_tensors="pt", padding=True)
outputs = clip_model(**inputs)

logits = outputs.logits_per_image
probs = logits.softmax(dim=-1)
for text, prob in zip(texts, probs[0]):
    print(f"  {text:35s} â†’ {prob.item():.4f}")
```

---

## Module 25: Transformers and Attention Mechanisms â€” Use Cases

| Industry | Application | Model/Technique | Impact |
|----------|-------------|-----------------|--------|
| Technology | Machine Translation | Transformer (seq2seq) | Google Translate uses Transformer-based models for 100+ languages |
| Healthcare | Clinical NLP & Diagnosis | BioBERT / ClinicalBERT | Extracts medical entities from clinical notes with 90%+ F1 score |
| Finance | Sentiment Analysis for Trading | FinBERT / BERT fine-tuned | Analyzes earnings calls and news for market signal generation |
| Legal | Contract Review & Extraction | Longformer / Legal-BERT | Processes 10K+ page legal documents for clause identification |
| Autonomous Vehicles | Scene Understanding | ViT + DETR | Real-time object detection and tracking with transformer architectures |
| Entertainment | Text-to-Image Generation | DALL-E / Stable Diffusion | Generates photorealistic images from text descriptions |
| Education | Intelligent Tutoring | GPT-based fine-tuned | Provides personalized explanations and adaptive feedback |

---

## Module 25: Project Ideas

### Project 1: Multi-Language Sentiment Analyzer

| Aspect | Details |
|--------|---------|
| **Description** | Build a multilingual sentiment analysis system using XLM-RoBERTa that classifies product reviews across 5+ languages without language detection preprocessing |
| **Datasets** | Amazon Multilingual Reviews, MLQA, XCOPA |
| **Tools** | Hugging Face Transformers, Datasets, Gradio (UI) |
| **Steps** | 1) Load XLM-RoBERTa base model. 2) Fine-tune on multilingual review dataset. 3) Evaluate cross-lingual zero-shot transfer. 4) Build Gradio interface for live inference. 5) Benchmark against language-specific models |

### Project 2: Document Q&A System

| Aspect | Details |
|--------|---------|
| **Description** | Create a retrieval-augmented generation (RAG) system that answers questions about PDF documents by combining BERT-based passage retrieval with GPT-based answer generation |
| **Datasets** | SQuAD 2.0, Natural Questions, custom PDF corpus |
| **Tools** | FAISS (vector store), LangChain, Sentence-Transformers, GPT-2/3.5 |
| **Steps** | 1) Build document chunking pipeline. 2) Generate embeddings with Sentence-BERT. 3) Index chunks in FAISS. 4) Retrieve top-k relevant passages. 5) Generate answers with GPT model. 6) Evaluate with Exact Match and F1 metrics |

### Project 3: Image Captioning with Vision Transformers

| Aspect | Details |
|--------|---------|
| **Description** | Implement an image captioning system that combines ViT for visual encoding with GPT-2 for text decoding, trained on image-description pairs |
| **Datasets** | COCO Captions, Flickr30k |
| **Tools** | PyTorch, Hugging Face Transformers, torchvision, Wandb |
| **Steps** | 1) Extract image features using pre-trained ViT. 2) Fine-tune GPT-2 as caption decoder with cross-attention. 3) Train with teacher forcing and scheduled sampling. 4) Evaluate with BLEU, METEOR, CIDEr scores. 5) Build inference pipeline with beam search decoding |


---


# COURSE 5: NATURAL LANGUAGE PROCESSING & GENERATIVE AI

## Edureka Generative AI Masters Program

---

## Course Overview

Dive deep into the world of Natural Language Processing and Generative AI. From advanced text processing techniques to building production-ready GenAI applications using LLMs, RAG pipelines, and vector databases. This course bridges traditional NLP with cutting-edge generative AI technologies.

**Prerequisites:** Python programming, basic ML/DL concepts, familiarity with PyTorch or TensorFlow
**Duration:** 80+ Hours | **Modules:** 5 | **Projects:** 15+

---

# MODULE 26: Advanced Text Processing & Analysis

## Learning Objectives
- Master advanced tokenization with spaCy and Hugging Face
- Implement text chunking, parsing, and coreference resolution
- Build extractive and abstractive summarization systems
- Apply document similarity, clustering, and keyword extraction
- Evaluate text quality using BLEU, ROUGE, and other metrics

---

## Section 1: Advanced Tokenization (spaCy, Hugging Face)

### 1.1 spaCy Tokenization Pipeline

```python
import spacy
from spacy.lang.en import English
from spacy.tokens import Doc

# Load different spaCy models
nlp_small = spacy.load("en_core_web_sm")
nlp_large = spacy.load("en_core_web_lg")

# Basic tokenization with linguistic features
text = """Natural language processing (NLP) is a subfield of linguistics, 
computer science, and artificial intelligence concerned with the interactions 
between computers and human language. Dr. Smith's research lab at MIT published 
findings on GPT-4's performance."""

doc = nlp_large(text)

# Extract tokens with rich linguistic annotations
print("Token Analysis:")
print(f"{'Token':<15} {'Lemma':<15} {'POS':<8} {'Tag':<8} {'Dep':<10} {'Shape':<10}")
print("-" * 75)
for token in doc:
    print(f"{token.text:<15} {token.lemma_:<15} {token.pos_:<8} {token.tag_:<8} {token.dep_:<10} {token.shape_:<10}")
```

### 1.2 Custom Tokenizer with Rules

```python
import spacy
from spacy.tokenizer import Tokenizer
from spacy.util import compile_prefix_regex, compile_suffix_regex
import re

class CustomNLPProcessor:
    def __init__(self, nlp):
        self.nlp = nlp
        self.setup_custom_tokenizer()
        self.setup_custom_patterns()
    
    def setup_custom_tokenizer(self):
        """Create custom tokenizer with domain-specific rules"""
        prefix_re = compile_prefix_regex(self.nlp.Defaults.prefixes + [r"(?<!\w)@", r"#"])
        suffix_re = compile_suffix_regex(self.nlp.Defaults.suffixes + [r"(?<!\w)@[\w\.]+"])
        infix_re = compile_infix_regex(self.nlp.Defaults.infixes + [r'--', r'\.{2,}'])
        
        self.nlp.tokenizer = Tokenizer(
            self.nlp.vocab,
            rules=self.nlp.Defaults.tokenizer_rules,
            prefix_search=prefix_re.search,
            suffix_search=suffix_re.search,
            infix_finditer=infix_re.finditer
        )
    
    def setup_custom_patterns(self):
        """Add custom entity ruler patterns"""
        ruler = self.nlp.add_pipe("entity_ruler", before="ner")
        patterns = [
            {"label": "TECH", "pattern": "GPT-4"},
            {"label": "TECH", "pattern": "GPT-3.5"},
            {"label": "TECH", "pattern": "LLaMA"},
            {"label": "TECH", "pattern": "BERT"},
            {"label": "ORG", "pattern": [{"LOWER": "openai"}]},
            {"label": "PRODUCT", "pattern": "Stable Diffusion"},
        ]
        ruler.add_patterns(patterns)
    
    def tokenize_with_bpe(self, text):
        """Simulate BPE-like tokenization"""
        doc = self.nlp(text)
        tokens = []
        for token in doc:
            tokens.append({
                "text": token.text,
                "start": token.idx,
                "end": token.idx + len(token.text),
                "is_alpha": token.is_alpha,
                "is_stop": token.is_stop,
                "is_punct": token.is_punct
            })
        return tokens

# Usage
nlp = spacy.load("en_core_web_sm")
processor = CustomNLPProcessor(nlp)
text = "GPT-4 by OpenAI outperforms BERT on many NLP tasks @mentions #hashtags"
tokens = processor.tokenize_with_bpe(text)
for t in tokens:
    print(f"Token: {t['text']:<20} Alpha: {t['is_alpha']:<8} Stop: {t['is_stop']}")
```

### 1.3 Hugging Face Tokenizers

```python
from transformers import AutoTokenizer
from tokenizers import Tokenizer, models, pre_tokenizers, trainers
from tokenizers.processors import TemplateProcessing

# Pre-trained tokenizer loading and comparison
class TokenizerComparison:
    MODELS = {
        "gpt2": "gpt2",
        "bert": "bert-base-uncased",
        "roberta": "roberta-base",
        "llama": "meta-llama/Llama-2-7b-hf",
        "mistral": "mistralai/Mistral-7B-v0.1",
    }
    
    def __init__(self):
        self.tokenizers = {}
    
    def load_tokenizers(self, model_keys=None):
        """Load multiple tokenizers for comparison"""
        if model_keys is None:
            model_keys = ["gpt2", "bert", "roberta"]
        
        for key in model_keys:
            if key in self.MODELS:
                self.tokenizers[key] = AutoTokenizer.from_pretrained(self.MODELS[key])
                print(f"Loaded {key} tokenizer | Vocab size: {self.tokenizers[key].vocab_size}")
    
    def compare_tokenization(self, text):
        """Compare tokenization across different models"""
        results = {}
        for name, tokenizer in self.tokenizers.items():
            tokens = tokenizer.tokenize(text)
            token_ids = tokenizer.encode(text)
            results[name] = {
                "tokens": tokens,
                "token_count": len(tokens),
                "token_ids": token_ids,
                "byte_fallback": getattr(tokenizer, "byte_fallback", False)
            }
        return results
    
    def demonstrate_special_tokens(self, model_key):
        """Show special tokens for a specific tokenizer"""
        tokenizer = self.tokenizers[model_key]
        print(f"\n=== {model_key.upper()} Special Tokens ===")
        print(f"CLS token: {tokenizer.cls_token} ({tokenizer.cls_token_id})")
        print(f"SEP token: {tokenizer.sep_token} ({tokenizer.sep_token_id})")
        print(f"PAD token: {tokenizer.pad_token} ({tokenizer.pad_token_id})")
        print(f"UNK token: {tokenizer.unk_token} ({tokenizer.unk_token_id})")
        print(f"MASK token: {getattr(tokenizer, 'mask_token', 'N/A')}")
        
        # Show encoding with special tokens
        text = "Hello, this is a tokenization test."
        encoded = tokenizer(text, return_tensors="pt")
        print(f"\nInput IDs: {encoded['input_ids'].tolist()}")
        print(f"Decoded: {tokenizer.decode(encoded['input_ids'][0])}")

# Train a custom BPE tokenizer
def train_custom_bpe():
    """Train a BPE tokenizer from scratch"""
    tokenizer = Tokenizer(models.BPE(unk_token="[UNK]"))
    tokenizer.pre_tokenizer = pre_tokenizers.ByteLevel(add_prefix_space=False)
    
    trainer = trainers.BpeTrainer(
        vocab_size=30000,
        special_tokens=["[UNK]", "[CLS]", "[SEP]", "[PAD]", "[MASK]", "[EOS]"],
        min_frequency=2
    )
    
    # Training would use corpus files:
    # tokenizer.train(files=["corpus.txt"], trainer=trainer)
    
    tokenizer.post_processor = TemplateProcessing(
        single="[CLS] $A [SEP]",
        pair="[CLS] $A [SEP] $B:1 [SEP]:1",
        special_tokens=[("[CLS]", 1), ("[SEP]", 2)]
    )
    
    return tokenizer

# Usage
comparison = TokenizerComparison()
comparison.load_tokenizers(["gpt2", "bert", "roberta"])

text = "Generative AI is transforming how we process natural language."
results = comparison.compare_tokenization(text)

for model, data in results.items():
    print(f"\n{model.upper()}: {data['token_count']} tokens")
    print(f"  Tokens: {data['tokens'][:10]}...")
```

### 1.4 SentencePiece Tokenization

```python
import sentencepiece as spm
import tempfile
import os

class SentencePieceManager:
    def __init__(self):
        self.sp = None
    
    def train(self, corpus_path, model_prefix="sp_model", vocab_size=8000):
        """Train a SentencePiece model"""
        spm.SentencePieceTrainer.train(
            input=corpus_path,
            model_prefix=model_prefix,
            vocab_size=vocab_size,
            model_type="bpe",
            character_coverage=0.9995,
            num_threads=4,
            max_sentence_length=4096,
            pad_id=3,
            unk_id=0,
            bos_id=1,
            eos_id=2,
            user_defined_symbols=["<|pad|>", "<|unk|>"]
        )
        self.sp = spm.SentencePieceProcessor()
        self.sp.load(f"{model_prefix}.model")
        return self
    
    def load(self, model_path):
        """Load pre-trained model"""
        self.sp = spm.SentencePieceProcessor()
        self.sp.load(model_path)
        return self
    
    def encode(self, text, add_bos=True, add_eos=True):
        """Encode text to token IDs"""
        return self.sp.encode(
            text, 
            out_type=int, 
            add_bos=add_bos, 
            add_eos=add_eos
        )
    
    def decode(self, token_ids):
        """Decode token IDs back to text"""
        return self.sp.decode(token_ids)
    
    def get_vocab_info(self):
        """Get vocabulary information"""
        return {
            "vocab_size": self.sp.get_piece_size(),
            "bos_id": self.sp.bos_id(),
            "eos_id": self.sp.eos_id(),
            "unk_id": self.sp.unk_id(),
            "pad_id": self.sp.pad_id(),
        }

# Usage with sample corpus
corpus = """
Natural language processing is a branch of artificial intelligence.
Machine learning enables computers to learn from data.
Deep learning uses neural networks with many layers.
Transformer architecture revolutionized NLP.
Attention mechanisms are key to modern NLP models.
"""

with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
    f.write(corpus)
    corpus_path = f.name

sp_manager = SentencePieceManager()
sp_manager.train(corpus_path, vocab_size=2000)

text = "Transformer models use attention mechanisms"
encoded = sp_manager.encode(text)
decoded = sp_manager.decode(encoded)
print(f"Original:  {text}")
print(f"Encoded:   {encoded}")
print(f"Decoded:   {decoded}")
print(f"Vocab Info: {sp_manager.get_vocab_info()}")

os.unlink(corpus_path)
```

---

## Section 2: Text Chunking & Parsing

### 2.1 Syntactic Chunking with spaCy

```python
import spacy
from collections import defaultdict, Counter

nlp = spacy.load("en_core_web_lg")

class TextChunker:
    def __init__(self, nlp_model):
        self.nlp = nlp_model
    
    def get_noun_chunks(self, text):
        """Extract noun phrases with detailed analysis"""
        doc = self.nlp(text)
        chunks = []
        for chunk in doc.noun_chunks:
            chunks.append({
                "text": chunk.text,
                "root": chunk.root.text,
                "root_dep": chunk.root.dep_,
                "root_head": chunk.root.head.text,
                "children": [(c.text, c.dep_) for c in chunk.root.children]
            })
        return chunks
    
    def get_verb_phrases(self, text):
        """Extract verb phrases"""
        doc = self.nlp(text)
        verb_phrases = []
        for token in doc:
            if token.pos_ == "VERB":
                subtree = list(token.subtree)
                vp_text = " ".join([t.text for t in subtree])
                verb_phrases.append({
                    "verb": token.text,
                    "phrase": vp_text,
                    "tense": token.morph.get("Tense"),
                    "voice": token.morph.get("Voice")
                })
        return verb_phrases
    
    def constituency_style_chunks(self, text):
        """Simulate constituency-style parsing"""
        doc = self.nlp(text)
        tree = {"S": []}
        
        for sent in doc.sents:
            sent_data = {"NP": [], "VP": [], "PP": [], "ADVP": [], "other": []}
            for token in sent:
                if token.dep_ in ("nsubj", "nsubjpass", "dobj", "attr"):
                    sent_data["NP"].append(token.text)
                elif token.pos_ == "VERB":
                    sent_data["VP"].append(token.text)
                elif token.dep_ == "prep":
                    pp = " ".join([c.text for c in token.subtree])
                    sent_data["PP"].append(pp)
                elif token.pos_ == "ADV":
                    sent_data["ADVP"].append(token.text)
            tree["S"].append(sent_data)
        
        return tree
    
    def dependency_parse_tree(self, text):
        """Visualize dependency parse as tree"""
        doc = self.nlp(text)
        tree_lines = []
        
        def build_tree(token, indent=0):
            prefix = "  " * indent + ("â”œâ”€â”€ " if indent > 0 else "")
            tree_lines.append(f"{prefix}{token.text} [{token.pos_}] [{token.dep_}]")
            for child in token.children:
                build_tree(child, indent + 1)
        
        for sent in doc.sents:
            root = [t for t in sent if t.dep_ == "ROOT"][0]
            build_tree(root)
        
        return "\n".join(tree_lines)

# Usage
chunker = TextChunker(nlp)
text = """The advanced neural network model achieved state-of-the-art performance 
on the natural language understanding benchmark. Researchers at Stanford University 
published their findings in a prestigious journal."""

print("=== Noun Chunks ===")
for chunk in chunker.get_noun_chunks(text):
    print(f"  {chunk['text']:<40} root={chunk['root']:<15} dep={chunk['root_dep']}")

print("\n=== Dependency Parse Tree ===")
print(chunker.dependency_parse_tree(text))
```

### 2.2 Semantic Chunking

```python
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re

class SemanticChunker:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
    
    def chunk_by_similarity(self, text, threshold=0.5):
        """Chunk text based on semantic similarity"""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        embeddings = self.model.encode(sentences)
        
        chunks = []
        current_chunk = [sentences[0]]
        
        for i in range(1, len(sentences)):
            similarity = cosine_similarity(
                embeddings[i-1:i], 
                embeddings[i:i+1]
            )[0][0]
            
            if similarity >= threshold:
                current_chunk.append(sentences[i])
            else:
                chunks.append(" ".join(current_chunk))
                current_chunk = [sentences[i]]
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def chunk_by_topic(self, text, window_size=3, threshold=0.3):
        """Chunk text by topic shifts using sliding window"""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        if len(sentences) < window_size:
            return [text]
        
        embeddings = self.model.encode(sentences)
        
        # Calculate topic shift scores
        shifts = []
        for i in range(window_size, len(sentences)):
            before = np.mean(embeddings[i-window_size:i], axis=0)
            after = np.mean(embeddings[i:min(i+window_size, len(sentences))], axis=0)
            similarity = cosine_similarity([before], [after])[0][0]
            shifts.append((i, similarity))
        
        # Find split points
        split_points = [0]
        for idx, sim in shifts:
            if sim < threshold:
                split_points.append(idx)
        split_points.append(len(sentences))
        
        # Create chunks
        chunks = []
        for i in range(len(split_points) - 1):
            chunk_text = " ".join(sentences[split_points[i]:split_points[i+1]])
            chunks.append(chunk_text)
        
        return chunks
    
    def fixed_size_semantic_chunks(self, text, max_tokens=512):
        """Create semantically-aware fixed-size chunks"""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        embeddings = self.model.encode(sentences)
        
        chunks = []
        current_chunk = []
        current_tokens = 0
        
        for i, sent in enumerate(sentences):
            est_tokens = len(sent.split()) * 1.3  # rough estimate
            
            if current_tokens + est_tokens > max_tokens and current_chunk:
                chunks.append(" ".join(current_chunk))
                # Keep last sentence for context overlap
                current_chunk = current_chunk[-1:] if current_chunk else []
                current_tokens = sum(len(s.split()) * 1.3 for s in current_chunk)
            
            current_chunk.append(sent)
            current_tokens += est_tokens
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks

# Usage
chunker = SemanticChunker()
long_text = """Python is a versatile programming language used in web development. 
Machine learning has transformed many industries. Data science combines statistics 
and programming. Deep learning uses neural networks for complex tasks. 
Web frameworks like Django simplify development. Natural language processing 
enables computers to understand text. Computer vision allows machines to see.
The internet connects billions of devices worldwide."""

print("=== Semantic Similarity Chunking ===")
chunks = chunker.chunk_by_similarity(long_text, threshold=0.3)
for i, chunk in enumerate(chunks):
    print(f"\nChunk {i+1}: {chunk[:100]}...")
```

---

## Section 3: Coreference Resolution

### 3.1 Neural Coreference Resolution

```python
import spacy
from allennlp.predictors.predictor import Predictor

class CoreferenceResolver:
    def __init__(self, method="allen"):
        self.method = method
        if method == "allen":
            self.predictor = Predictor.from_path(
                "https://storage.googleapis.com/allennlp-public-models/"
                "coref-spanbert-large-2021.03.10.tar.gz"
            )
        elif method == "spacy":
            self.nlp = spacy.load("en_core_web_lg")
    
    def resolve_allen(self, text):
        """Resolve using AllenNLP coreference model"""
        result = self.predictor.predict(document=text)
        
        resolved = text
        # Sort clusters by mention span length (longest first to avoid offset issues)
        for cluster in result["clusters"]:
            mentions = sorted(cluster, key=lambda x: x[1] - x[0], reverse=True)
            for mention_start, mention_end in mentions:
                mention_text = " ".join(result["document"][mention_start:mention_end+1])
                # Find the representative mention (first in cluster)
                rep_start, rep_end = cluster[0]
                rep_text = " ".join(result["document"][rep_start:rep_end+1])
                
                if mention_text != rep_text:
                    resolved = resolved.replace(mention_text, f"[{rep_text}]")
        
        return {
            "original": text,
            "resolved": resolved,
            "clusters": [
                {
                    "mentions": [
                        " ".join(result["document"][s:e+1]) for s, e in cluster
                    ],
                    "representative": " ".join(
                        result["document"][cluster[0][0]:cluster[0][1]+1]
                    )
                }
                for cluster in result["clusters"]
            ]
        }
    
    def resolve_simple(self, text):
        """Simple rule-based coreference resolution"""
        doc = self.nlp(text)
        pronouns = {"he": None, "she": None, "it": None, "they": None}
        resolutions = {}
        
        for ent in doc.ents:
            if ent.label_ in ("PERSON", "ORG", "GPE"):
                if ent.text.lower() not in pronouns:
                    pronouns["he"] = ent.text if ent.label_ == "PERSON" else pronouns["he"]
                    pronouns["she"] = ent.text if ent.label_ == "PERSON" else pronouns["she"]
                    pronouns["it"] = ent.text
        
        for token in doc:
            if token.text.lower() in pronouns and pronouns.get(token.text.lower()):
                resolutions[token.text] = pronouns[token.text.lower()]
        
        return resolutions

# Usage
resolver = CoreferenceResolver(method="spacy")
# For production, use AllenNLP:
# resolver = CoreferenceResolver(method="allen")

text = """John went to the store. He bought some groceries. 
When he arrived home, his wife Mary was cooking. She asked him about his day."""

print("Original text:")
print(text)
# Note: For full coreference, the Allen model would be used in production
```

---

## Section 4: Text Summarization (Extractive & Abstractive)

### 4.1 Extractive Summarization

```python
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import spacy

nlp = spacy.load("en_core_web_sm")

class ExtractiveSummarizer:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
    
    def textrank_summary(self, text, num_sentences=3):
        """TextRank algorithm for extractive summarization"""
        doc = self.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        if len(sentences) <= num_sentences:
            return text
        
        # Create TF-IDF matrix
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(sentences)
        
        # Build similarity graph
        similarity_matrix = cosine_similarity(tfidf_matrix)
        graph = nx.from_numpy_array(similarity_matrix)
        
        # Apply PageRank
        scores = nx.pagerank(graph, max_iter=200)
        
        # Rank sentences
        ranked = sorted(
            ((scores[i], i, s) for i, s in enumerate(sentences)),
            reverse=True
        )
        
        # Select top sentences in order
        top_indices = sorted([idx for _, idx, _ in ranked[:num_sentences]])
        summary = " ".join([sentences[i] for i in top_indices])
        
        return summary
    
    def tfidf_summary(self, text, num_sentences=3):
        """TF-IDF based extractive summarization"""
        doc = self.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(sentences)
        
        # Score each sentence by sum of TF-IDF scores
        sentence_scores = tfidf_matrix.sum(axis=1).A1
        
        ranked_indices = np.argsort(sentence_scores)[-num_sentences:][::-1]
        summary = " ".join([sentences[i] for i in sorted(ranked_indices)])
        
        return summary
    
    def frequency_summary(self, text, num_sentences=3, top_n_words=10):
        """Word frequency based summarization"""
        doc = self.nlp(text)
        
        # Count word frequencies (excluding stop words)
        word_freq = {}
        for token in doc:
            if not token.is_stop and not token.is_punct and token.is_alpha:
                lemma = token.lemma_.lower()
                word_freq[lemma] = word_freq.get(lemma, 0) + 1
        
        # Get top words
        top_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:top_n_words]
        top_word_set = set(w for w, _ in top_words)
        
        # Score sentences
        sentences = list(doc.sents)
        sentence_scores = []
        for sent in sentences:
            score = sum(1 for token in sent if token.lemma_.lower() in top_word_set)
            sentence_scores.append(score)
        
        ranked = sorted(enumerate(sentence_scores), key=lambda x: x[1], reverse=True)
        top_indices = sorted([idx for idx, _ in ranked[:num_sentences]])
        
        summary = " ".join([sentences[i].text for i in top_indices])
        return summary
    
    def lsa_summary(self, text, num_sentences=3):
        """LSA-based summarization using SVD"""
        from sklearn.decomposition import TruncatedSVD
        
        doc = self.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(sentences)
        
        # Apply SVD
        n_components = min(num_sentences, len(sentences) - 1, tfidf_matrix.shape[0])
        svd = TruncatedSVD(n_components=n_components)
        svd_matrix = svd.fit_transform(tfidf_matrix)
        
        # Score sentences based on first component
        sentence_scores = np.abs(svd_matrix[:, 0])
        
        ranked_indices = np.argsort(sentence_scores)[-num_sentences:][::-1]
        summary = " ".join([sentences[i] for i in sorted(ranked_indices)])
        
        return summary

# Usage
text = """Natural language processing has evolved significantly over the past decade. 
Early approaches relied on rule-based systems that were limited in their ability to 
handle the complexity of human language. Statistical methods brought improvements but 
still struggled with understanding context. The introduction of deep learning, 
particularly recurrent neural networks, marked a turning point. LSTMs and GRUs could 
capture long-range dependencies in text. However, the transformer architecture truly 
revolutionized the field. Self-attention mechanisms allowed for parallel processing 
and better capture of contextual relationships. Pre-trained models like BERT and GPT 
demonstrated the power of transfer learning in NLP. Fine-tuning these models on 
specific tasks achieved state-of-the-art results with relatively little task-specific data."""

summarizer = ExtractiveSummarizer()

print("=== TextRank Summary ===")
print(summarizer.textrank_summary(text, num_sentences=2))

print("\n=== TF-IDF Summary ===")
print(summarizer.tfidf_summary(text, num_sentences=2))

print("\n=== Frequency Summary ===")
print(summarizer.frequency_summary(text, num_sentences=2))
```

### 4.2 Abstractive Summarization with Transformers

```python
from transformers import (
    AutoTokenizer, 
    AutoModelForSeq2SeqLM,
    pipeline,
    BartForConditionalGeneration,
    BartTokenizer
)
import torch

class AbstractiveSummarizer:
    def __init__(self, model_name="facebook/bart-large-cnn"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(self.device)
        self.model_name = model_name
    
    def summarize(self, text, max_length=150, min_length=50, num_beams=4):
        """Generate abstractive summary"""
        inputs = self.tokenizer(
            text, 
            return_tensors="pt", 
            max_length=1024, 
            truncation=True
        ).to(self.device)
        
        summary_ids = self.model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=max_length,
            min_length=min_length,
            num_beams=num_beams,
            length_penalty=2.0,
            no_repeat_ngram_size=3,
            early_stopping=True
        )
        
        summary = self.tokenizer.decode(
            summary_ids[0], 
            skip_special_tokens=True
        )
        return summary
    
    def summarize_with_pipeline(self, text, max_length=150):
        """Using Hugging Face pipeline"""
        summarizer = pipeline(
            "summarization", 
            model=self.model_name, 
            device=0 if self.device == "cuda" else -1
        )
        result = summarizer(
            text, 
            max_length=max_length, 
            min_length=30, 
            do_sample=False
        )
        return result[0]["summary_text"]
    
    def iterative_summarization(self, text, chunk_size=1024, iterations=2):
        """Iterative summarization for very long documents"""
        current_text = text
        
        for i in range(iterations):
            inputs = self.tokenizer(
                current_text,
                return_tensors="pt",
                max_length=chunk_size,
                truncation=True
            ).to(self.device)
            
            summary_ids = self.model.generate(
                inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_length=512,
                min_length=100,
                num_beams=4
            )
            
            current_text = self.tokenizer.decode(
                summary_ids[0], 
                skip_special_tokens=True
            )
            print(f"Iteration {i+1}: {len(current_text)} chars")
        
        return current_text

# Usage
summarizer = AbstractiveSummarizer("facebook/bart-large-cnn")

long_article = """
The transformer architecture, introduced in the seminal paper "Attention Is All You Need" 
by Vaswani et al., has fundamentally changed the landscape of natural language processing. 
Unlike recurrent neural networks that process sequences step by step, transformers process 
entire sequences in parallel through self-attention mechanisms. This parallelization enables 
much more efficient training on modern hardware. The key innovation is the self-attention 
mechanism, which allows each position in the input sequence to attend to all other positions. 
This captures long-range dependencies more effectively than RNNs. Transformers have been 
successfully applied to machine translation, text generation, question answering, and many 
other NLP tasks. BERT, GPT, T5, and their variants represent the current state of the art 
in NLP, all built upon the transformer architecture.
"""

print("=== Abstractive Summary ===")
print(summarizer.summarize(long_article, max_length=100))
```

---

## Section 5: Document Similarity & Clustering

```python
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.manifold import TSNE
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
from collections import Counter

class DocumentSimilarityEngine:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.embeddings_cache = {}
    
    def compute_embeddings(self, documents):
        """Compute embeddings for a list of documents"""
        embeddings = self.model.encode(documents, show_progress_bar=True)
        for doc, emb in zip(documents, embeddings):
            self.embeddings_cache[doc] = emb
        return embeddings
    
    def similarity_matrix(self, documents):
        """Compute pairwise similarity matrix"""
        embeddings = self.compute_embeddings(documents)
        sim_matrix = cosine_similarity(embeddings)
        return sim_matrix
    
    def find_similar(self, query, documents, top_k=5):
        """Find most similar documents to a query"""
        query_emb = self.model.encode([query])
        doc_embs = self.compute_embeddings(documents)
        
        similarities = cosine_similarity(query_emb, doc_embs)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                "document": documents[idx],
                "score": float(similarities[idx])
            })
        return results
    
    def cluster_documents(self, documents, n_clusters=3, method="kmeans"):
        """Cluster documents using specified method"""
        embeddings = self.compute_embeddings(documents)
        
        if method == "kmeans":
            clusterer = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        elif method == "dbscan":
            clusterer = DBSCAN(eps=0.5, min_samples=2, metric="cosine")
        elif method == "agglomerative":
            clusterer = AgglomerativeClustering(
                n_clusters=n_clusters, 
                metric="cosine", 
                linkage="average"
            )
        else:
            raise ValueError(f"Unknown method: {method}")
        
        labels = clusterer.fit_predict(embeddings)
        
        # Organize results by cluster
        clusters = {}
        for doc, label in zip(documents, labels):
            label = int(label)
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(doc)
        
        return clusters, labels, embeddings
    
    def deduce_topic(self, documents_per_cluster):
        """Extract representative keywords for each cluster"""
        vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
        
        topics = {}
        for cluster_id, docs in documents_per_cluster.items():
            combined = " ".join(docs)
            tfidf = vectorizer.fit_transform([combined])
            feature_names = vectorizer.get_feature_names_out()
            scores = tfidf.toarray()[0]
            top_indices = scores.argsort()[-5:][::-1]
            topics[cluster_id] = [feature_names[i] for i in top_indices]
        
        return topics

# Usage
docs = [
    "Machine learning algorithms learn patterns from data to make predictions.",
    "Deep neural networks can learn complex representations from raw data.",
    "Natural language processing enables computers to understand human language.",
    "Computer vision allows machines to interpret visual information from images.",
    "Reinforcement learning trains agents through reward-based feedback.",
    "Convolutional neural networks excel at image recognition tasks.",
    "Transformers use self-attention for sequence processing.",
    "Transfer learning leverages pre-trained models for new tasks.",
    "Generative adversarial networks create realistic synthetic data.",
    "Recurrent neural networks process sequential data like text."
]

engine = DocumentSimilarityEngine()

# Clustering
clusters, labels, embeddings = engine.cluster_documents(docs, n_clusters=3)

print("=== Document Clusters ===")
for cluster_id, cluster_docs in clusters.items():
    print(f"\nCluster {cluster_id}:")
    for doc in cluster_docs:
        print(f"  - {doc[:70]}...")

# Topic extraction
topics = engine.deduce_topic(clusters)
print("\n=== Cluster Topics ===")
for cluster_id, topic_words in topics.items():
    print(f"Cluster {cluster_id}: {', '.join(topic_words)}")
```

---

## Section 6: Keyword Extraction (RAKE, YAKE)

```python
import yake
from rake_nltk import Rake
from collections import Counter
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

class KeywordExtractor:
    def __init__(self):
        self.rake = Rake(
            min_length=1,
            max_length=4,
            include_repeated_phrases=False
        )
        self.yake_extractor = yake.KeywordExtractor(
            lan="en",
            n=3,
            dedupLim=0.9,
            top=20,
            features=None
        )
    
    def extract_rake(self, text, top_n=10):
        """Extract keywords using RAKE algorithm"""
        self.rake.extract_keywords_from_text(text)
        ranked = self.rake.get_ranked_phrases_with_scores()
        return [{"keyword": kw, "score": score} 
                for score, kw in ranked[:top_n]]
    
    def extract_yake(self, text, top_n=10):
        """Extract keywords using YAKE algorithm"""
        keywords = self.yake_extractor.extract_keywords(text)
        return [{"keyword": kw, "score": score} 
                for kw, score in keywords[:top_n]]
    
    def extract_tfidf(self, documents, top_n=10):
        """Extract keywords using TF-IDF"""
        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=1000,
            ngram_range=(1, 3)
        )
        tfidf_matrix = vectorizer.fit_transform(documents)
        feature_names = vectorizer.get_feature_names_out()
        
        # Average TF-IDF across documents
        avg_tfidf = tfidf_matrix.mean(axis=0).A1
        top_indices = avg_tfidf.argsort()[-top_n:][::-1]
        
        return [{"keyword": feature_names[i], "score": float(avg_tfidf[i])} 
                for i in top_indices]
    
    def extract_statistical(self, text, top_n=10):
        """Statistical keyword extraction"""
        doc = nlp(text)
        
        # Filter for content words
        words = [token.lemma_.lower() for token in doc 
                if token.is_alpha and not token.is_stop and len(token.text) > 2]
        
        word_freq = Counter(words)
        
        # Context importance: words surrounded by stop words
        context_scores = {}
        for i, token in enumerate(doc):
            if token.text.lower() in word_freq:
                left_stop = doc[i-1].is_stop if i > 0 else True
                right_stop = doc[i+1].is_stop if i < len(doc)-1 else True
                context_scores[token.text.lower()] = (left_stop + right_stop) / 2
        
        # Combine frequency and context
        combined = {}
        for word in word_freq:
            freq_score = word_freq[word] / max(word_freq.values())
            context_score = context_scores.get(word, 0)
            combined[word] = freq_score * 0.6 + context_score * 0.4
        
        ranked = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:top_n]
        return [{"keyword": kw, "score": score} for kw, score in ranked]
    
    def extract_topic_modeling(self, documents, n_topics=5):
        """LDA-based topic keyword extraction"""
        from sklearn.decomposition import LatentDirichletAllocation
        
        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(documents)
        feature_names = vectorizer.get_feature_names_out()
        
        lda = LatentDirichletAllocation(
            n_components=n_topics, 
            random_state=42, 
            max_iter=20
        )
        lda.fit(tfidf_matrix)
        
        topics = {}
        for topic_idx, topic in enumerate(lda.components_):
            top_indices = topic.argsort()[-10:][::-1]
            topics[f"topic_{topic_idx}"] = [
                {"keyword": feature_names[i], "weight": float(topic[i])}
                for i in top_indices
            ]
        
        return topics

# Usage
text = """Natural language processing (NLP) is a subfield of linguistics, computer science, 
and artificial intelligence. NLP is concerned with the interactions between computers and 
human language. It focuses on how to program computers to process and analyze large amounts 
of natural language data. Challenges in natural language processing frequently involve speech 
recognition, natural language understanding, and natural language generation."""

extractor = KeywordExtractor()

print("=== RAKE Keywords ===")
for kw in extractor.extract_rake(text, top_n=5):
    print(f"  {kw['keyword']:<30} score: {kw['score']:.4f}")

print("\n=== YAKE Keywords ===")
for kw in extractor.extract_yake(text, top_n=5):
    print(f"  {kw['keyword']:<30} score: {kw['score']:.4f}")

print("\n=== Statistical Keywords ===")
for kw in extractor.extract_statistical(text, top_n=5):
    print(f"  {kw['keyword']:<30} score: {kw['score']:.4f}")
```

---

## Section 7: Text Quality Metrics (BLEU, ROUGE)

```python
import numpy as np
from collections import Counter
import math
import re

class TextQualityMetrics:
    """Custom implementation of text quality metrics"""
    
    @staticmethod
    def tokenize(text):
        return re.findall(r'\b\w+\b', text.lower())
    
    @staticmethod
    def bleu_score(reference, candidate, max_n=4):
        """Compute BLEU score with smoothing"""
        ref_tokens = TextQualityMetrics.tokenize(reference)
        cand_tokens = TextQualityMetrics.tokenize(candidate)
        
        precisions = []
        for n in range(1, max_n + 1):
            ref_ngrams = Counter(
                tuple(ref_tokens[i:i+n]) 
                for i in range(len(ref_tokens) - n + 1)
            )
            cand_ngrams = Counter(
                tuple(cand_tokens[i:i+n]) 
                for i in range(len(cand_tokens) - n + 1)
            )
            
            matches = sum(
                min(count, ref_ngrams.get(ng, 0)) 
                for ng, count in cand_ngrams.items()
            )
            total = max(sum(cand_ngrams.values()), 1e-10)
            
            precision = matches / total
            
            # Smoothing (add-1)
            if precision == 0:
                precision = 1e-10
            
            precisions.append(precision)
        
        # Geometric mean
        log_avg = sum(math.log(p) for p in precisions) / len(precisions)
        
        # Brevity penalty
        bp = min(1.0, math.exp(1 - len(ref_tokens) / max(len(cand_tokens), 1e-10)))
        
        bleu = bp * math.exp(log_avg)
        
        # Individual n-gram scores
        individual = {}
        for n, p in enumerate(precisions, 1):
            individual[f"bleu_{n}"] = bp * p
        
        return {"bleu": bleu, "individual": individual, "bp": bp}
    
    @staticmethod
    def rouge_l(reference, candidate):
        """Compute ROUGE-L score using LCS"""
        ref_tokens = TextQualityMetrics.tokenize(reference)
        cand_tokens = TextQualityMetrics.tokenize(candidate)
        
        m, n = len(ref_tokens), len(cand_tokens)
        
        # LCS dynamic programming
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if ref_tokens[i-1] == cand_tokens[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
        lcs_length = dp[m][n]
        
        precision = lcs_length / max(n, 1e-10)
        recall = lcs_length / max(m, 1e-10)
        f1 = (2 * precision * recall) / max(precision + recall, 1e-10)
        
        return {
            "rouge_l_f1": f1,
            "rouge_l_precision": precision,
            "rouge_l_recall": recall,
            "lcs_length": lcs_length
        }
    
    @staticmethod
    def rouge_n(reference, candidate, n=1):
        """Compute ROUGE-N score"""
        ref_tokens = TextQualityMetrics.tokenize(reference)
        cand_tokens = TextQualityMetrics.tokenize(candidate)
        
        ref_ngrams = Counter(
            tuple(ref_tokens[i:i+n]) 
            for i in range(len(ref_tokens) - n + 1)
        )
        cand_ngrams = Counter(
            tuple(cand_tokens[i:i+n]) 
            for i in range(len(cand_tokens) - n + 1)
        )
        
        overlap = sum(
            min(count, ref_ngrams.get(ng, 0)) 
            for ng, count in cand_ngrams.items()
        )
        
        precision = overlap / max(sum(cand_ngrams.values()), 1e-10)
        recall = overlap / max(sum(ref_ngrams.values()), 1e-10)
        f1 = (2 * precision * recall) / max(precision + recall, 1e-10)
        
        return {"precision": precision, "recall": recall, "f1": f1}
    
    @staticmethod
    def meteor_score(reference, candidate):
        """Simplified METEOR score"""
        ref_tokens = set(TextQualityMetrics.tokenize(reference))
        cand_tokens = set(TextQualityMetrics.tokenize(candidate))
        
        matches = ref_tokens & cand_tokens
        
        precision = len(matches) / max(len(cand_tokens), 1e-10)
        recall = len(matches) / max(len(ref_tokens), 1e-10)
        
        # Penalty for fragmentation
        chunks = []
        matched = list(matches)
        for i, word in enumerate(matched):
            if not chunks or word not in chunks[-1]:
                chunks.append([word])
            else:
                chunks[-1].append(word)
        
        penalty = 0.5 * (len(chunks) / max(len(matches), 1e-10)) ** 3
        
        f_mean = (precision * recall) / (0.9 * precision + 0.1 * recall)
        meteor = f_mean * (1 - penalty)
        
        return {"meteor": meteor, "precision": precision, "recall": recall}
    
    @staticmethod
    def bertscore(candidate, reference, model_name="bert-base-uncased"):
        """BERTScore computation (requires bert_score package)"""
        from bert_score import score as bert_score
        
        P, R, F1 = bert_score(
            [candidate], [reference], 
            lang="en", 
            model_type=model_name,
            verbose=False
        )
        
        return {
            "bertscore_precision": P.item(),
            "bertscore_recall": R.item(),
            "bertscore_f1": F1.item()
        }

# Usage
reference = "The cat sat on the mat and looked out the window at the birds."
candidate = "The cat was sitting on the mat, watching the birds through the window."

metrics = TextQualityMetrics()

print("=== BLEU Score ===")
bleu = metrics.bleu_score(reference, candidate)
print(f"BLEU: {bleu['bleu']:.4f}")
print(f"Individual n-grams: {bleu['individual']}")

print("\n=== ROUGE Scores ===")
for n in [1, 2, 3]:
    rouge_n = metrics.rouge_n(reference, candidate, n=n)
    print(f"ROUGE-{n}: P={rouge_n['precision']:.4f} R={rouge_n['recall']:.4f} F1={rouge_n['f1']:.4f}")

rouge_l = metrics.rouge_l(reference, candidate)
print(f"ROUGE-L: F1={rouge_l['rouge_l_f1']:.4f}")

print("\n=== METEOR Score ===")
meteor = metrics.meteor_score(reference, candidate)
print(f"METEOR: {meteor['meteor']:.4f}")
```

### Real-Time Use Cases - Module 26

| Use Case | Technique | Industry | Impact |
|----------|-----------|----------|--------|
| Legal Document Analysis | Chunking + Coreference | Legal | 60% faster contract review |
| News Summarization | TextRank + BART | Media | 3x content processing speed |
| Patent Prior Art Search | Document Clustering | IP Law | 70% reduction in search time |
| Medical Record Summarization | Abstractive Summarization | Healthcare | 40% faster clinical review |
| Content Deduplication | Similarity + Clustering | Publishing | 25% storage savings |
| Customer Review Analysis | Keyword Extraction | E-commerce | 50% faster insight generation |
| Academic Citation Analysis | Document Similarity | Research | Automated literature mapping |
| Multilingual Content Tagging | Keyword Extraction | Localization | 4x faster content categorization |

### Module 26 Project Ideas

| Project | Difficulty | Skills Required | Dataset |
|---------|-----------|-----------------|---------|
| Research Paper Summarizer | Intermediate | Summarization, NER | arXiv, PubMed |
| Document Clustering Engine | Advanced | Embeddings, Clustering | 20 Newsgroups |
| Automated Keyword Tagging | Beginner | Keyword Extraction | News articles |
| Coreference Resolution System | Advanced | Coreference, NER | OntoNotes |
| Text Quality Scoring Pipeline | Intermediate | Metrics, Evaluation | WMT datasets |

---

# MODULE 27: Sentiment Analysis & Emotion Detection

## Learning Objectives
- Implement rule-based sentiment analysis with VADER and TextBlob
- Build ML and deep learning sentiment classifiers
- Develop aspect-based sentiment analysis systems
- Create emotion detection models
- Deploy real-time sentiment pipelines

---

## Section 1: Rule-Based Sentiment (VADER, TextBlob)

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import numpy as np
from collections import defaultdict

class RuleBasedSentiment:
    def __init__(self):
        self.vader = SentimentIntensityAnalyzer()
        
        # Custom lexicon additions
        custom_lexicon = {
            "amazing": 3.0, "terrible": -3.0, "okay": 0.5,
            "meh": -0.5, "fire": 2.5, "sick": 2.0,
            "lit": 2.5, "cap": -1.0, "slay": 3.0,
            "ghosting": -2.5, "catfish": -3.0,
        }
        self.vader.lexicon.update(custom_lexicon)
    
    def analyze_vader(self, text):
        """Full VADER sentiment analysis"""
        scores = self.vader.polarity_scores(text)
        
        # Determine label
        if scores['compound'] >= 0.05:
            label = 'POSITIVE'
        elif scores['compound'] <= -0.05:
            label = 'NEGATIVE'
        else:
            label = 'NEUTRAL'
        
        return {
            "text": text,
            "label": label,
            "scores": scores,
            "confidence": abs(scores['compound'])
        }
    
    def analyze_textblob(self, text):
        """TextBlob sentiment analysis"""
        blob = TextBlob(text)
        
        # Sentence-level analysis
        sentence_sentiments = []
        for sentence in blob.sentences:
            sentence_sentiments.append({
                "sentence": str(sentence),
                "polarity": sentence.sentiment.polarity,
                "subjectivity": sentence.sentiment.subjectivity
            })
        
        # Overall
        return {
            "polarity": blob.sentiment.polarity,
            "subjectivity": blob.sentiment.subjectivity,
            "sentences": sentence_sentiments
        }
    
    def ensemble_sentiment(self, text):
        """Combine VADER and TextBlob for robust sentiment"""
        vader_result = self.analyze_vader(text)
        textblob_result = self.analyze_textblob(text)
        
        # Normalize scores to [-1, 1]
        vader_compound = vader_result['scores']['compound']
        textblob_polarity = textblob_result['polarity']
        
        # Weighted ensemble
        ensemble_score = 0.6 * vader_compound + 0.4 * textblob_polarity
        
        if ensemble_score >= 0.05:
            label = 'POSITIVE'
        elif ensemble_score <= -0.05:
            label = 'NEGATIVE'
        else:
            label = 'NEUTRAL'
        
        return {
            "text": text,
            "ensemble_score": ensemble_score,
            "label": label,
            "vader_score": vader_compound,
            "textblob_score": textblob_polarity,
            "subjectivity": textblob_result['subjectivity']
        }
    
    def analyze_aspects_rulebased(self, text, aspects):
        """Rule-based aspect sentiment extraction"""
        doc = nlp(text)
        results = {}
        
        for aspect in aspects:
            aspect_sentences = []
            for sent in doc.sents:
                if aspect.lower() in sent.text.lower():
                    aspect_sentences.append(sent.text)
            
            if aspect_sentences:
                combined = " ".join(aspect_sentences)
                sentiment = self.analyze_vader(combined)
                results[aspect] = {
                    "sentences": aspect_sentences,
                    "sentiment": sentiment['label'],
                    "score": sentiment['scores']['compound']
                }
            else:
                results[aspect] = {
                    "sentences": [],
                    "sentiment": "NOT_FOUND",
                    "score": 0.0
                }
        
        return results

# Usage
analyzer = RuleBasedSentiment()

texts = [
    "This product is absolutely amazing! Best purchase ever!",
    "The service was okay, nothing special but not terrible either.",
    "Terrible experience. The app keeps crashing and support is useless.",
    "The new update has some good features but the UI is confusing.",
    "I'm not sure how I feel about this change. It could go either way."
]

print("=== Ensemble Sentiment Analysis ===")
for text in texts:
    result = analyzer.ensemble_sentiment(text)
    print(f"\nText: {text[:60]}...")
    print(f"  Label: {result['label']} | Score: {result['ensemble_score']:.3f} | "
          f"Subjectivity: {result['subjectivity']:.3f}")
```

---

## Section 2: Machine Learning Sentiment

```python
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

class MLSentimentClassifier:
    def __init__(self):
        self.models = {}
        self.vectorizers = {}
        self.best_model = None
    
    def build_tfidf_pipeline(self, model_name="logistic"):
        """Build TF-IDF + classifier pipeline"""
        vectorizer = TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 3),
            min_df=2,
            max_df=0.95,
            sublinear_tf=True
        )
        
        classifiers = {
            "logistic": LogisticRegression(
                C=1.0, max_iter=1000, class_weight="balanced"
            ),
            "svm": LinearSVC(
                C=1.0, class_weight="balanced", max_iter=2000
            ),
            "naive_bayes": MultinomialNB(alpha=0.1),
            "sgd": SGDClassifier(
                loss="modified_huber", class_weight="balanced"
            ),
            "random_forest": RandomForestClassifier(
                n_estimators=100, class_weight="balanced", n_jobs=-1
            )
        }
        
        pipeline = Pipeline([
            ("tfidf", vectorizer),
            ("classifier", classifiers[model_name])
        ])
        
        return pipeline
    
    def build_char_ngram_pipeline(self, model_name="logistic"):
        """Character n-gram based pipeline for robust tokenization"""
        vectorizer = TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3, 5),
            max_features=50000,
            sublinear_tf=True
        )
        
        classifier = LogisticRegression(C=1.0, max_iter=1000)
        
        return Pipeline([
            ("char_tfidf", vectorizer),
            ("classifier", classifier)
        ])
    
    def train_and_evaluate(self, X_train, X_test, y_train, y_test):
        """Train multiple models and compare"""
        model_names = ["logistic", "svm", "naive_bayes", "sgd"]
        results = {}
        
        for name in model_names:
            pipeline = self.build_tfidf_pipeline(name)
            
            # Cross-validation
            cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring="f1_macro")
            
            # Train and predict
            pipeline.fit(X_train, y_train)
            y_pred = pipeline.predict(X_test)
            
            results[name] = {
                "cv_mean": cv_scores.mean(),
                "cv_std": cv_scores.std(),
                "report": classification_report(y_test, y_pred, output_dict=True),
                "pipeline": pipeline
            }
            
            print(f"\n{name.upper()}:")
            print(f"  CV F1: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
            print(classification_report(y_test, y_pred))
        
        # Select best model
        best_name = max(results, key=lambda k: results[k]["cv_mean"])
        self.best_model = results[best_name]["pipeline"]
        
        return results
    
    def hyperparameter_tuning(self, X_train, y_train):
        """Grid search for optimal parameters"""
        pipeline = self.build_tfidf_pipeline("logistic")
        
        param_grid = {
            "tfidf__max_features": [5000, 10000, 20000],
            "tfidf__ngram_range": [(1, 1), (1, 2), (1, 3)],
            "tfidf__min_df": [1, 2, 5],
            "classifier__C": [0.1, 1.0, 10.0]
        }
        
        grid_search = GridSearchCV(
            pipeline,
            param_grid,
            cv=5,
            scoring="f1_macro",
            n_jobs=-1,
            verbose=1
        )
        
        grid_search.fit(X_train, y_train)
        
        print(f"Best params: {grid_search.best_params_}")
        print(f"Best score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def predict_with_confidence(self, texts):
        """Predict with confidence scores"""
        if self.best_model is None:
            raise ValueError("Model not trained yet")
        
        predictions = self.best_model.predict(texts)
        
        # Get probability scores if available
        if hasattr(self.best_model.named_steps['classifier'], 'predict_proba'):
            probabilities = self.best_model.predict_proba(texts)
            classes = self.best_model.classes_
            
            results = []
            for pred, probs in zip(predictions, probabilities):
                results.append({
                    "prediction": pred,
                    "confidence": float(max(probs)),
                    "probabilities": {cls: float(p) for cls, p in zip(classes, probs)}
                })
        else:
            results = [{"prediction": p, "confidence": None} for p in predictions]
        
        return results

# Usage
from sklearn.model_selection import train_test_split

# Sample data (in production, use real datasets like SST-2, IMDB)
texts = [
    "This movie was fantastic! Great acting and storyline.",
    "Absolutely terrible. Waste of two hours.",
    "It was okay, not great but not bad either.",
    "I loved every minute of this film!",
    "Boring and predictable. Would not recommend.",
]
labels = ["positive", "negative", "neutral", "positive", "negative"]

# Add synthetic data for demonstration
np.random.seed(42)
positive_templates = ["I love this {item}! {adjective}!", "Great {item}, {adjective} experience!"]
negative_templates = ["This {item} is terrible. {adjective}.", "Worst {item} ever. {adjective}."]
neutral_templates = ["The {item} is {adjective}. It works as expected."]

items = ["product", "service", "app", "movie", "restaurant"]
adjs_pos = ["amazing", "fantastic", "excellent", "wonderful"]
adjs_neg = ["awful", "terrible", "horrible", "disappointing"]
adjs_neu = ["okay", "decent", "average", "standard"]

synthetic_texts = []
synthetic_labels = []

for _ in range(50):
    synthetic_texts.append(np.random.choice(positive_templates).format(
        item=np.random.choice(items), adjective=np.random.choice(adjs_pos)))
    synthetic_labels.append("positive")
    synthetic_texts.append(np.random.choice(negative_templates).format(
        item=np.random.choice(items), adjective=np.random.choice(adjs_neg)))
    synthetic_labels.append("negative")
    synthetic_texts.append(np.random.choice(neutral_templates).format(
        item=np.random.choice(items), adjective=np.random.choice(adjs_neu)))
    synthetic_labels.append("neutral")

all_texts = texts + synthetic_texts
all_labels = labels + synthetic_labels

X_train, X_test, y_train, y_test = train_test_split(
    all_texts, all_labels, test_size=0.2, random_state=42, stratify=all_labels
)

classifier = MLSentimentClassifier()
results = classifier.train_and_evaluate(X_train, X_test, y_train, y_test)
```

---

## Section 3: Deep Learning Sentiment

```python
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    EarlyStoppingCallback
)
from datasets import Dataset as HFDataset
import numpy as np

class SentimentLSTM(nn.Module):
    """LSTM-based sentiment classifier"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim, 
                 n_layers, bidirectional, dropout, pad_idx):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=pad_idx)
        self.lstm = nn.LSTM(
            embed_dim, hidden_dim, num_layers=n_layers,
            bidirectional=bidirectional, dropout=dropout, batch_first=True
        )
        self.fc = nn.Linear(hidden_dim * 2 if bidirectional else hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, text, text_lengths):
        embedded = self.dropout(self.embedding(text))
        
        packed = nn.utils.rnn.pack_padded_sequence(
            embedded, text_lengths.cpu(), batch_first=True, enforce_sorted=False
        )
        packed_output, (hidden, cell) = self.lstm(packed)
        
        if self.lstm.bidirectional:
            hidden = torch.cat((hidden[-2,:,:], hidden[-1,:,:]), dim=1)
        else:
            hidden = hidden[-1,:,:]
        
        return self.fc(self.dropout(hidden))


class SentimentCNN(nn.Module):
    """TextCNN for sentiment classification"""
    def __init__(self, vocab_size, embed_dim, num_classes, 
                 num_filters=100, filter_sizes=[3, 4, 5], dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.convs = nn.ModuleList([
            nn.Conv1d(embed_dim, num_filters, fs) for fs in filter_sizes
        ])
        self.fc = nn.Linear(num_filters * len(filter_sizes), num_classes)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, text):
        embedded = self.embedding(text).permute(0, 2, 1)
        
        conved = [torch.relu(conv(embedded)) for conv in self.convs]
        pooled = [torch.max(c, dim=2)[0] for c in conved]
        
        cat = torch.cat(pooled, dim=1)
        return self.fc(self.dropout(cat))


class TransformerSentiment:
    """Fine-tune transformer for sentiment"""
    def __init__(self, model_name="distilbert-base-uncased", num_labels=3):
        self.model_name = model_name
        self.num_labels = num_labels
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name, num_labels=num_labels
        )
    
    def prepare_dataset(self, texts, labels):
        """Tokenize and create HF dataset"""
        encodings = self.tokenizer(
            texts, truncation=True, padding=True, max_length=512
        )
        
        dataset = HFDataset.from_dict({
            "input_ids": encodings["input_ids"],
            "attention_mask": encodings["attention_mask"],
            "labels": labels
        })
        
        return dataset
    
    def compute_metrics(self, eval_pred):
        """Compute accuracy and F1"""
        from sklearn.metrics import accuracy_score, f1_score
        
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        
        acc = accuracy_score(labels, predictions)
        f1 = f1_score(labels, predictions, average="macro")
        
        return {"accuracy": acc, "f1": f1}
    
    def train(self, train_texts, train_labels, val_texts, val_labels, 
              output_dir="./sentiment_model", epochs=3, batch_size=16):
        """Fine-tune the transformer"""
        train_dataset = self.prepare_dataset(train_texts, train_labels)
        val_dataset = self.prepare_dataset(val_texts, val_labels)
        
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir=f"{output_dir}/logs",
            logging_steps=100,
            eval_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="f1",
            fp16=torch.cuda.is_available(),
        )
        
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            compute_metrics=self.compute_metrics,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
        )
        
        trainer.train()
        return trainer
    
    def predict(self, texts):
        """Predict sentiment"""
        self.model.eval()
        encodings = self.tokenizer(
            texts, truncation=True, padding=True, 
            max_length=512, return_tensors="pt"
        )
        
        with torch.no_grad():
            outputs = self.model(**encodings)
            probs = torch.softmax(outputs.logits, dim=-1)
            predictions = torch.argmax(probs, dim=-1)
        
        labels_map = {0: "negative", 1: "neutral", 2: "positive"}
        results = []
        for pred, prob in zip(predictions, probs):
            results.append({
                "label": labels_map[pred.item()],
                "confidence": float(prob[pred]),
                "probabilities": {labels_map[i]: float(p) for i, p in enumerate(prob)}
            })
        
        return results

# Usage
transformer_sentiment = TransformerSentiment("distilbert-base-uncased", num_labels=3)

# Sample data
train_texts = [
    "I absolutely loved this movie!", "Terrible waste of time.",
    "It was an okay experience overall.", "Best purchase I've ever made!",
    "The product broke after one day.", "Nothing special, pretty average."
]
train_labels = [2, 0, 1, 2, 0, 1]  # 0=neg, 1=neutral, 2=pos

# In production, use larger datasets and train for more epochs
# trainer = transformer_sentiment.train(train_texts, train_labels, val_texts, val_labels)
```

---

## Section 4: Aspect-Based Sentiment Analysis (ABSA)

```python
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import numpy as np

class AspectSentimentExtractor:
    def __init__(self, model_name="nlptown/bert-base-multilingual-uncased-sentiment"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
    
    def extract_aspect_sentiment(self, text, aspects):
        """Extract sentiment for each aspect in the text"""
        results = {}
        
        for aspect in aspects:
            # Create aspect-aware input
            input_text = f"[CLS] {text} [SEP] {aspect} [SEP]"
            inputs = self.tokenizer(
                input_text, return_tensors="pt", 
                truncation=True, max_length=512
            )
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                hidden_states = outputs.last_hidden_state
                
                # Pool tokens near the aspect
                aspect_tokens = self.tokenizer.encode(aspect, add_special_tokens=False)
                aspect_len = len(aspect_tokens)
                
                # Find aspect position in input
                input_ids = inputs["input_ids"][0].tolist()
                for i in range(len(input_ids) - aspect_len + 1):
                    if input_ids[i:i+aspect_len] == aspect_tokens:
                        # Pool around aspect
                        start = max(0, i - 2)
                        end = min(hidden_states.shape[1], i + aspect_len + 2)
                        aspect_repr = hidden_states[0, start:end].mean(dim=0)
                        break
                else:
                    aspect_repr = hidden_states[0].mean(dim=0)
            
            results[aspect] = {
                "embedding": aspect_repr.numpy(),
                "dimension": aspect_repr.shape[0]
            }
        
        return results
    
    def rule_based_absa(self, text, aspects):
        """Rule-based aspect extraction with sentiment"""
        import spacy
        nlp = spacy.load("en_core_web_sm")
        
        doc = nlp(text)
        sentences = list(doc.sents)
        
        results = {}
        for aspect in aspects:
            aspect_sentiments = []
            for sent in sentences:
                if aspect.lower() in sent.text.lower():
                    # Find sentiment words near aspect
                    sentiment_words = []
                    for token in sent:
                        if token.pos_ in ("ADJ", "ADV"):
                            sentiment_words.append(token.text)
                    
                    # Simple polarity
                    from textblob import TextBlob
                    polarity = TextBlob(sent.text).sentiment.polarity
                    
                    aspect_sentiments.append({
                        "sentence": sent.text,
                        "sentiment_words": sentiment_words,
                        "polarity": polarity,
                        "label": "positive" if polarity > 0.1 else 
                                "negative" if polarity < -0.1 else "neutral"
                    })
            
            results[aspect] = aspect_sentiments
        
        return results

# Usage
# Example: Restaurant review ABSA
review = """The food was absolutely delicious, especially the pasta. 
However, the service was terrible and we waited 45 minutes for our meal. 
The ambiance was nice and the prices were reasonable."""

aspects = ["food", "service", "ambiance", "prices"]
extractor = AspectSentimentExtractor()

absa_results = extractor.rule_based_absa(review, aspects)

print("=== Aspect-Based Sentiment Analysis ===")
for aspect, sentiments in absa_results.items():
    if sentiments:
        avg_polarity = np.mean([s["polarity"] for s in sentiments])
        label = "positive" if avg_polarity > 0.1 else "negative" if avg_polarity < -0.1 else "neutral"
        print(f"\n{aspect.upper()}: {label} (polarity: {avg_polarity:.3f})")
        for s in sentiments:
            print(f"  - {s['sentence'][:60]}... â†’ {s['label']}")
    else:
        print(f"\n{aspect.upper()}: NOT MENTIONED")
```

---

## Section 5: Emotion Detection

```python
from transformers import pipeline
import torch
import torch.nn as nn
from typing import List, Dict

class EmotionDetector:
    EMOTIONS = ["joy", "sadness", "anger", "fear", "surprise", "disgust", "neutral"]
    
    def __init__(self, model_name="j-hartmann/emotion-english-distilroberta-base"):
        self.classifier = pipeline(
            "text-classification", 
            model=model_name,
            top_k=None,
            device=0 if torch.cuda.is_available() else -1
        )
    
    def detect_emotions(self, text: str) -> Dict:
        """Detect emotions in text"""
        results = self.classifier(text)[0]
        
        emotion_scores = {r["label"]: r["score"] for r in results}
        primary_emotion = max(emotion_scores, key=emotion_scores.get)
        
        return {
            "text": text,
            "primary_emotion": primary_emotion,
            "emotions": emotion_scores,
            "intensity": emotion_scores[primary_emotion]
        }
    
    def detect_emotions_batch(self, texts: List[str]) -> List[Dict]:
        """Batch emotion detection"""
        results = self.classifier(texts)
        
        output = []
        for text, result in zip(texts, results):
            emotion_scores = {r["label"]: r["score"] for r in result}
            primary = max(emotion_scores, key=emotion_scores.get)
            output.append({
                "text": text,
                "primary_emotion": primary,
                "emotions": emotion_scores,
                "intensity": emotion_scores[primary]
            })
        
        return output
    
    def emotion_timeline(self, text_segments: List[str]) -> List[Dict]:
        """Track emotions across text segments"""
        timeline = []
        for i, segment in enumerate(text_segments):
            result = self.detect_emotions(segment)
            result["segment_index"] = i
            timeline.append(result)
        
        # Detect emotion shifts
        shifts = []
        for i in range(1, len(timeline)):
            if timeline[i]["primary_emotion"] != timeline[i-1]["primary_emotion"]:
                shifts.append({
                    "from_segment": i-1,
                    "to_segment": i,
                    "from_emotion": timeline[i-1]["primary_emotion"],
                    "to_emotion": timeline[i]["primary_emotion"]
                })
        
        return {"timeline": timeline, "shifts": shifts}
    
    def multi_label_emotions(self, text: str, threshold: float = 0.3) -> Dict:
        """Detect multiple simultaneous emotions"""
        results = self.classifier(text)[0]
        
        active_emotions = {
            r["label"]: r["score"] 
            for r in results 
            if r["score"] >= threshold
        }
        
        return {
            "text": text,
            "active_emotions": active_emotions,
            "emotion_count": len(active_emotions),
            "emotion_mix": active_emotions
        }

# Usage
detector = EmotionDetector()

texts = [
    "I just got promoted! This is the best day of my life!",
    "My dog passed away yesterday. I can't stop crying.",
    "The government's decision makes me furious!",
    "I have a bad feeling about this meeting tomorrow.",
    "Wait, you're moving to another country? When did this happen?",
    "The food was... acceptable. Nothing memorable.",
]

print("=== Emotion Detection Results ===")
for text in texts:
    result = detector.detect_emotions(text)
    print(f"\nText: {text[:60]}...")
    print(f"  Primary: {result['primary_emotion']} ({result['intensity']:.3f})")
    top_emotions = sorted(result['emotions'].items(), key=lambda x: x[1], reverse=True)[:3]
    print(f"  Top 3: {', '.join(f'{e}: {s:.3f}' for e, s in top_emotions)}")
```

---

## Section 6: Multi-lingual Sentiment

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class MultilingualSentiment:
    SUPPORTED_LANGUAGES = {
        "en": "English", "zh": "Chinese", "de": "German",
        "es": "Spanish", "fr": "French", "ja": "Japanese",
        "ar": "Arabic", "hi": "Hindi", "pt": "Portuguese",
        "ru": "Russian"
    }
    
    def __init__(self, model_name="nlptown/bert-base-multilingual-uncased-sentiment"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.model.eval()
    
    def predict(self, text, language="auto"):
        """Predict sentiment for any supported language"""
        inputs = self.tokenizer(
            text, return_tensors="pt", 
            truncation=True, max_length=512
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)
        
        # 1-5 star rating
        stars = torch.arange(1, 6).float()
        weighted_rating = (probs * stars).sum(dim=-1).item()
        
        rating = round(weighted_rating)
        if rating <= 2:
            label = "negative"
        elif rating == 3:
            label = "neutral"
        else:
            label = "positive"
        
        return {
            "text": text,
            "rating": rating,
            "weighted_rating": weighted_rating,
            "label": label,
            "probabilities": {
                f"{i+1}_star": float(probs[0][i]) for i in range(5)
            }
        }
    
    def cross_lingual_comparison(self, texts_by_language: dict):
        """Compare sentiment across languages"""
        results = {}
        for lang, text in texts_by_language.items():
            results[lang] = self.predict(text)
        
        # Normalize and compare
        scores = {lang: r["weighted_rating"] for lang, r in results.items()}
        most_positive = max(scores, key=scores.get)
        most_negative = min(scores, key=scores.get)
        
        return {
            "results": results,
            "comparison": {
                "most_positive": most_positive,
                "most_negative": most_negative,
                "average": sum(scores.values()) / len(scores)
            }
        }

# Usage
multilingual = MultilingualSentiment()

texts = {
    "en": "This product is absolutely wonderful! I love it!",
    "es": "Este producto es absolutamente maravilloso. Â¡Me encanta!",
    "fr": "Ce produit est absolument merveilleux! Je l'adore!",
    "de": "Dieses Produkt ist absolut wunderbar! Ich liebe es!",
    "ja": "ã“ã®è£½å“ã¯çµ¶å¯¾ã«ç´ æ™´ã‚‰ã—ã„ã§ã™ï¼å¤§å¥½ãã§ã™ï¼",
}

print("=== Multilingual Sentiment ===")
results = multilingual.cross_lingual_comparison(texts)
for lang, result in results["results"].items():
    print(f"{lang}: {result['label']} (rating: {result['weighted_rating']:.2f})")
```

---

## Section 7: Real-time Sentiment Pipeline

```python
import asyncio
import json
from datetime import datetime
from collections import deque, defaultdict
import threading
import time

class RealtimeSentimentPipeline:
    def __init__(self, window_size=100):
        self.window_size = window_size
        self.buffer = deque(maxlen=window_size)
        self.history = []
        self.detector = EmotionDetector()
        self.vader_analyzer = SentimentIntensityAnalyzer()
        self.callbacks = []
        self.running = False
        
        # Metrics
        self.metrics = {
            "total_processed": 0,
            "avg_sentiment": 0.0,
            "sentiment_distribution": defaultdict(int),
            "emotion_distribution": defaultdict(int),
            "alerts": []
        }
    
    def add_callback(self, callback):
        """Add callback for real-time results"""
        self.callbacks.append(callback)
    
    def process_text(self, text, metadata=None):
        """Process a single text input"""
        start_time = time.time()
        
        # Sentiment analysis
        vader_scores = self.vader_analyzer.polarity_scores(text)
        
        # Emotion detection
        emotion_result = self.detector.detect_emotions(text)
        
        # Compile result
        result = {
            "text": text,
            "timestamp": datetime.now().isoformat(),
            "sentiment": {
                "vader": vader_scores,
                "label": ("positive" if vader_scores['compound'] >= 0.05 else
                         "negative" if vader_scores['compound'] <= -0.05 else "neutral"),
                "score": vader_scores['compound']
            },
            "emotion": emotion_result,
            "processing_time_ms": (time.time() - start_time) * 1000,
            "metadata": metadata or {}
        }
        
        # Update metrics
        self.buffer.append(result)
        self.history.append(result)
        self._update_metrics(result)
        
        # Check for alerts
        self._check_alerts(result)
        
        # Trigger callbacks
        for callback in self.callbacks:
            try:
                callback(result)
            except Exception as e:
                print(f"Callback error: {e}")
        
        return result
    
    def _update_metrics(self, result):
        """Update running metrics"""
        self.metrics["total_processed"] += 1
        
        label = result["sentiment"]["label"]
        emotion = result["emotion"]["primary_emotion"]
        
        self.metrics["sentiment_distribution"][label] += 1
        self.metrics["emotion_distribution"][emotion] += 1
        
        # Rolling average sentiment
        n = self.metrics["total_processed"]
        self.metrics["avg_sentiment"] = (
            (self.metrics["avg_sentiment"] * (n-1) + result["sentiment"]["score"]) / n
        )
    
    def _check_alerts(self, result):
        """Generate alerts for extreme sentiments"""
        if result["sentiment"]["score"] < -0.8:
            alert = {
                "type": "strong_negative",
                "text": result["text"][:100],
                "score": result["sentiment"]["score"],
                "timestamp": result["timestamp"]
            }
            self.metrics["alerts"].append(alert)
    
    def get_dashboard(self):
        """Get current metrics for dashboard"""
        if not self.buffer:
            return {"status": "no_data"}
        
        recent_sentiments = [r["sentiment"]["score"] for r in self.buffer]
        
        return {
            "total_processed": self.metrics["total_processed"],
            "buffer_size": len(self.buffer),
            "avg_sentiment": self.metrics["avg_sentiment"],
            "recent_avg": sum(recent_sentiments) / len(recent_sentiments),
            "sentiment_dist": dict(self.metrics["sentiment_distribution"]),
            "emotion_dist": dict(self.metrics["emotion_distribution"]),
            "alerts_count": len(self.metrics["alerts"]),
            "recent_alerts": self.metrics["alerts"][-5:]
        }

# Usage
pipeline = RealtimeSentimentPipeline(window_size=50)

# Add a callback for real-time monitoring
def alert_handler(result):
    if result["sentiment"]["score"] < -0.5:
        print(f"ALERT: Strong negative sentiment detected: {result['text'][:50]}...")

pipeline.add_callback(alert_handler)

# Simulate real-time text processing
sample_texts = [
    "Just had the best customer service experience ever!",
    "The product arrived broken. Very disappointed.",
    "It works as described. Nothing special.",
    "Absolutely love this! Will definitely buy again!",
    "Terrible quality. Want my money back.",
    "Average product, does what it's supposed to do.",
]

print("=== Real-time Sentiment Pipeline ===")
for text in sample_texts:
    result = pipeline.process_text(text)
    print(f"\nText: {text[:50]}...")
    print(f"  Sentiment: {result['sentiment']['label']} ({result['sentiment']['score']:.3f})")
    print(f"  Emotion: {result['emotion']['primary_emotion']} ({result['emotion']['intensity']:.3f})")

dashboard = pipeline.get_dashboard()
print(f"\n=== Dashboard ===")
print(f"Processed: {dashboard['total_processed']}")
print(f"Avg Sentiment: {dashboard['avg_sentiment']:.3f}")
```

---

## Section 8: A/B Testing for NLP

```python
import numpy as np
from scipy import stats
from dataclasses import dataclass
from typing import List, Dict, Callable

@dataclass
class NLPExperiment:
    name: str
    model_a: Callable
    model_b: Callable
    metric: str = "accuracy"

class NLPA/BTest:
    def __init__(self):
        self.experiments = {}
    
    def create_experiment(self, name, model_a, model_b, metric="accuracy"):
        """Create a new A/B test"""
        self.experiments[name] = NLPExperiment(
            name=name, model_a=model_a, model_b=model_b, metric=metric
        )
    
    def run_experiment(self, name, test_data, test_labels, n_bootstrap=1000):
        """Run A/B test with bootstrap resampling"""
        experiment = self.experiments[name]
        
        # Get predictions from both models
        preds_a = experiment.model_a(test_data)
        preds_b = experiment.model_b(test_data)
        
        # Calculate metrics
        if experiment.metric == "accuracy":
            scores_a = [1 if p == l else 0 for p, l in zip(preds_a, test_labels)]
            scores_b = [1 if p == l else 0 for p, l in zip(preds_b, test_labels)]
        
        mean_a = np.mean(scores_a)
        mean_b = np.mean(scores_b)
        
        # Bootstrap confidence intervals
        boot_a = []
        boot_b = []
        for _ in range(n_bootstrap):
            idx = np.random.choice(len(scores_a), len(scores_a), replace=True)
            boot_a.append(np.mean([scores_a[i] for i in idx]))
            boot_b.append(np.mean([scores_b[i] for i in idx]))
        
        ci_a = np.percentile(boot_a, [2.5, 97.5])
        ci_b = np.percentile(boot_b, [2.5, 97.5])
        
        # Statistical test
        t_stat, p_value = stats.ttest_rel(scores_a, scores_b)
        
        # Effect size (Cohen's d)
        diff = np.array(scores_a) - np.array(scores_b)
        cohens_d = np.mean(diff) / (np.std(diff) + 1e-10)
        
        return {
            "experiment": name,
            "model_a_mean": mean_a,
            "model_b_mean": mean_b,
            "model_a_ci": ci_a.tolist(),
            "model_b_ci": ci_b.tolist(),
            "t_statistic": t_stat,
            "p_value": p_value,
            "cohens_d": cohens_d,
            "significant": p_value < 0.05,
            "winner": "A" if mean_a > mean_b else "B" if mean_b > mean_a else "Tie",
            "sample_size": len(test_data)
        }
    
    def sample_size_calculation(self, effect_size, alpha=0.05, power=0.8):
        """Calculate required sample size for A/B test"""
        from scipy.stats import norm
        
        z_alpha = norm.ppf(1 - alpha/2)
        z_beta = norm.ppf(power)
        
        n = 2 * ((z_alpha + z_beta) / effect_size) ** 2
        
        return int(np.ceil(n))

# Usage
ab_test = NLPA/BTest()

# Simulate two models
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC

sample_texts = ["great product", "terrible service", "okay experience", 
                "love it", "hate this", "not bad", "amazing!", "awful"]
sample_labels = [1, 0, 1, 1, 0, 1, 1, 0]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(sample_texts)

model_a = LogisticRegression().fit(X, sample_labels)
model_b = LinearSVC().fit(X, sample_labels)

ab_test.create_experiment(
    "LogisticRegression_vs_SVM",
    lambda texts: model_a.predict(vectorizer.transform(texts)),
    lambda texts: model_b.predict(vectorizer.transform(texts))
)

result = ab_test.run_experiment(
    "LogisticRegression_vs_SVM",
    sample_texts, sample_labels
)

print("=== A/B Test Results ===")
print(f"Experiment: {result['experiment']}")
print(f"Model A: {result['model_a_mean']:.4f} (CI: {result['model_a_ci']})")
print(f"Model B: {result['model_b_mean']:.4f} (CI: {result['model_b_ci']})")
print(f"P-value: {result['p_value']:.4f}")
print(f"Significant: {result['significant']}")
print(f"Winner: {result['winner']}")
print(f"Cohen's d: {result['cohens_d']:.4f}")

n_required = ab_test.sample_size_calculation(effect_size=0.3)
print(f"\nRequired sample size for d=0.3: {n_required}")
```

### Real-Time Use Cases - Module 27

| Use Case | Technique | Industry | Impact |
|----------|-----------|----------|--------|
| Social Media Monitoring | Real-time Sentiment | Marketing | Brand reputation management |
| Customer Review Analysis | ABSA | E-commerce | Product improvement insights |
| Crisis Detection | Emotion + Sentiment | PR | Early warning system |
| Product Feedback Mining | Multi-model Ensemble | Product Mgmt | Feature prioritization |
| Multilingual Brand Monitoring | Cross-lingual Sentiment | Global Corp | 10+ language coverage |
| Employee Pulse Analysis | Emotion Detection | HR | Workplace sentiment tracking |
| News Sentiment Trading | Pipeline + Alerting | Finance | Market signal generation |
| Chatbot Quality Monitoring | Real-time Pipeline | Support | CSAT improvement |

### Module 27 Project Ideas

| Project | Difficulty | Skills Required | Dataset |
|---------|-----------|-----------------|---------|
| Real-time Social Sentiment Dashboard | Advanced | Streaming, Pipeline | Twitter API |
| Multi-label Emotion Classifier | Advanced | Transformers, Multi-label | GoEmotions |
| ABSA for Product Reviews | Intermediate | NER, Sentiment | Amazon Reviews |
| Multilingual Sentiment Analyzer | Advanced | Cross-lingual, BERT | XLM-R datasets |
| A/B Testing NLP Models | Intermediate | Statistics, ML | Custom datasets |

---

# MODULE 28: LLMs & Prompt Engineering

## Learning Objectives
- Understand LLM architectures (GPT, LLaMA, Mistral)
- Master prompt engineering techniques
- Implement few-shot and chain-of-thought prompting
- Integrate with OpenAI API and LangChain
- Build RAG systems and evaluate LLM outputs

---

## Section 1: Understanding LLMs (GPT, LLaMA, Mistral)

```python
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM,
    pipeline,
    BitsAndBytesConfig
)
import torch
import json

class LLMExplorer:
    """Explore and compare different LLM architectures"""
    
    MODEL_CONFIGS = {
        "gpt2": {
            "name": "GPT-2 Small",
            "params": "124M",
            "type": "decoder-only",
            "context": 1024,
            "tokenizer_class": "GPT2Tokenizer"
        },
        "gpt2-medium": {
            "name": "GPT-2 Medium",
            "params": "355M",
            "type": "decoder-only",
            "context": 1024,
            "tokenizer_class": "GPT2Tokenizer"
        },
        "meta-llama/Llama-2-7b-hf": {
            "name": "LLaMA 2 7B",
            "params": "7B",
            "type": "decoder-only",
            "context": 4096,
            "tokenizer_class": "LlamaTokenizer"
        },
        "mistralai/Mistral-7B-v0.1": {
            "name": "Mistral 7B",
            "params": "7B",
            "type": "decoder-only",
            "context": 8192,
            "tokenizer_class": "LlamaTokenizer"
        }
    }
    
    def __init__(self):
        self.loaded_models = {}
    
    def load_model(self, model_key, device_map="auto", 
                   use_4bit=False, max_memory=None):
        """Load a model with optional quantization"""
        if model_key not in self.MODEL_CONFIGS:
            raise ValueError(f"Unknown model: {model_key}")
        
        config = self.MODEL_CONFIGS[model_key]
        
        tokenizer = AutoTokenizer.from_pretrained(model_key)
        
        load_kwargs = {"device_map": device_map}
        
        if use_4bit:
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True
            )
            load_kwargs["quantization_config"] = bnb_config
        
        if max_memory:
            load_kwargs["max_memory"] = max_memory
        
        model = AutoModelForCausalLM.from_pretrained(model_key, **load_kwargs)
        
        self.loaded_models[model_key] = {
            "model": model,
            "tokenizer": tokenizer,
            "config": config
        }
        
        print(f"Loaded {config['name']} ({config['params']} params)")
        return model, tokenizer
    
    def compare_tokenizers(self, texts):
        """Compare tokenization across models"""
        results = {}
        for key, data in self.loaded_models.items():
            tokenizer = data["tokenizer"]
            encodings = []
            for text in texts:
                tokens = tokenizer.tokenize(text)
                ids = tokenizer.encode(text)
                encodings.append({
                    "text": text[:50],
                    "tokens": tokens[:10],
                    "token_count": len(tokens),
                    "ids": ids[:10]
                })
            results[key] = encodings
        return results
    
    def generate_text(self, model_key, prompt, max_new_tokens=100, 
                      temperature=0.7, top_p=0.9):
        """Generate text with a specific model"""
        if model_key not in self.loaded_models:
            raise ValueError(f"Model {model_key} not loaded")
        
        data = self.loaded_models[model_key]
        model = data["model"]
        tokenizer = data["tokenizer"]
        
        inputs = tokenizer(prompt, return_tensors="pt")
        
        if torch.cuda.is_available():
            inputs = {k: v.to(model.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        generated = tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[1]:],
            skip_special_tokens=True
        )
        
        return {
            "prompt": prompt,
            "generated": generated,
            "tokens_generated": outputs.shape[1] - inputs["input_ids"].shape[1]
        }
    
    def analyze_architecture(self, model_key):
        """Analyze model architecture details"""
        if model_key not in self.loaded_models:
            raise ValueError(f"Model {model_key} not loaded")
        
        model = self.loaded_models[model_key]["model"]
        config = model.config
        
        arch_info = {
            "model_type": getattr(config, "model_type", "unknown"),
            "hidden_size": getattr(config, "n_embd", getattr(config, "hidden_size", None)),
            "num_layers": getattr(config, "n_layer", getattr(config, "num_hidden_layers", None)),
            "num_heads": getattr(config, "n_head", getattr(config, "num_attention_heads", None)),
            "vocab_size": getattr(config, "vocab_size", None),
            "max_position": getattr(config, "n_positions", getattr(config, "max_position_embeddings", None)),
            "intermediate_size": getattr(config, "n_inner", getattr(config, "intermediate_size", None)),
            "activation": getattr(config, "activation_function", getattr(config, "hidden_act", None)),
        }
        
        # Count parameters
        total_params = sum(p.numel() for p in model.parameters())
        trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
        
        arch_info["total_parameters"] = f"{total_params:,}"
        arch_info["trainable_parameters"] = f"{trainable_params:,}"
        
        return arch_info

# Usage
explorer = LLMExplorer()

# Compare architectures without loading full models
print("=== LLM Architecture Comparison ===")
for key, config in explorer.MODEL_CONFIGS.items():
    print(f"\n{config['name']}:")
    print(f"  Parameters: {config['params']}")
    print(f"  Architecture: {config['type']}")
    print(f"  Context Window: {config['context']}")

# Load a small model for demonstration
model, tokenizer = explorer.load_model("gpt2")

architecture = explorer.analyze_architecture("gpt2")
print("\n=== GPT-2 Architecture ===")
for key, value in architecture.items():
    print(f"  {key}: {value}")
```

---

## Section 2: Prompt Engineering Techniques

```python
from typing import List, Dict, Optional
import json
import re

class PromptEngineer:
    """Comprehensive prompt engineering toolkit"""
    
    def __init__(self):
        self.templates = {}
        self.history = []
    
    def zero_shot(self, task: str, input_text: str, 
                  context: str = None) -> str:
        """Zero-shot prompt construction"""
        parts = []
        if context:
            parts.append(f"Context: {context}")
        parts.append(f"Task: {task}")
        parts.append(f"Input: {input_text}")
        parts.append("Output:")
        return "\n\n".join(parts)
    
    def few_shot(self, task: str, examples: List[Dict], 
                 input_text: str) -> str:
        """Few-shot prompt with examples"""
        parts = [f"Task: {task}\n"]
        
        for i, example in enumerate(examples, 1):
            parts.append(f"Example {i}:")
            parts.append(f"Input: {example['input']}")
            parts.append(f"Output: {example['output']}")
            parts.append("")
        
        parts.append(f"Now, process this input:")
        parts.append(f"Input: {input_text}")
        parts.append("Output:")
        
        return "\n".join(parts)
    
    def chain_of_thought(self, question: str, 
                         reasoning_steps: List[str] = None) -> str:
        """Chain-of-thought prompting"""
        prompt = f"""Question: {question}

Let's think step by step:
"""
        if reasoning_steps:
            for i, step in enumerate(reasoning_steps, 1):
                prompt += f"Step {i}: {step}\n"
        
        prompt += "\nTherefore, the answer is:"
        return prompt
    
    def tree_of_thought(self, problem: str, 
                        num_branches: int = 3) -> str:
        """Tree-of-thought prompting"""
        prompt = f"""Problem: {problem}

Consider {num_branches} different approaches:

Approach 1 (Conservative):
"""
        prompt += "Let me think carefully about the safest, most proven approach...\n\n"
        prompt += f"Approach 2 (Aggressive):\n"
        prompt += "Let me consider a more innovative, high-risk approach...\n\n"
        prompt += f"Approach 3 (Balanced):\n"
        prompt += "Let me find a middle ground...\n\n"
        prompt += """Evaluation:
Now I'll evaluate each approach on feasibility, risk, and potential impact.

Best approach with justification:"""
        
        return prompt
    
    def structured_output(self, task: str, input_text: str, 
                          output_format: str = "json") -> str:
        """Prompt for structured output"""
        if output_format == "json":
            return f"""Task: {task}
Input: {input_text}

Provide your response as valid JSON with the following structure:
{{
    "analysis": "Your detailed analysis",
    "key_points": ["point1", "point2", "point3"],
    "confidence": 0.0-1.0,
    "recommendation": "Your recommendation"
}}

Response (JSON only):"""
        
        elif output_format == "table":
            return f"""Task: {task}
Input: {input_text}

Provide your response as a markdown table with headers:
| Category | Details | Priority | Impact |
|----------|---------|----------|--------|

Response:"""
        
        return f"Task: {task}\nInput: {input_text}\nResponse:"
    
    def self_consistency(self, question: str, 
                         num_samples: int = 5) -> str:
        """Self-consistency prompt for reliable answers"""
        return f"""Question: {question}

I'll approach this problem {num_samples} different ways and then 
select the most consistent answer.

Reasoning Path 1:
Let me analyze this from the perspective of...

Reasoning Path 2:
Now let me consider this differently...

Reasoning Path 3:
Another way to think about this is...

Reasoning Path 4:
From a third angle...

Reasoning Path 5:
Finally, considering...

After comparing all {num_samples} reasoning paths, the most consistent answer is:"""
    
    def role_playing(self, role: str, task: str, 
                     constraints: List[str] = None) -> str:
        """Role-playing prompt"""
        prompt = f"""You are {role}.

Your task: {task}

"""
        if constraints:
            prompt += "Constraints:\n"
            for c in constraints:
                prompt += f"- {c}\n"
            prompt += "\n"
        
        prompt += "Please proceed with your response:"
        return prompt
    
    def prompt_chaining(self, steps: List[Dict]) -> str:
        """Multi-step prompt chain"""
        chain = []
        for i, step in enumerate(steps, 1):
            chain.append(f"=== Step {i}: {step['name']} ===")
            chain.append(f"Instructions: {step['instructions']}")
            if "input_from" in step:
                chain.append(f"Use output from Step {step['input_from']}")
            chain.append("")
        
        return "\n".join(chain)
    
    def meta_prompt(self, task_description: str) -> str:
        """Meta-prompting: ask LLM to create a prompt"""
        return f"""I need to accomplish the following task:

{task_description}

Please design an optimal prompt that I could use to get an AI to complete 
this task effectively. The prompt should:
1. Be clear and specific
2. Include necessary context
3. Specify the desired output format
4. Include examples if helpful

Here is the optimized prompt:"""

# Usage
engineer = PromptEngineer()

print("=== Zero-Shot ===")
print(engineer.zero_shot(
    task="Classify the sentiment",
    input_text="This product exceeded my expectations!",
    context="Product review classification"
))

print("\n=== Chain of Thought ===")
print(engineer.chain_of_thought(
    question="If a train travels at 60 mph for 2.5 hours, then at 80 mph for 1.5 hours, what is the total distance?"
))

print("\n=== Structured Output ===")
print(engineer.structured_output(
    task="Analyze customer feedback",
    input_text="The app is slow but the features are great",
    output_format="json"
))
```

---

## Section 3: Few-Shot & Chain-of-Thought

```python
class AdvancedPrompting:
    """Advanced prompting strategies"""
    
    @staticmethod
    def few_shot_classification(examples: List[Dict], 
                                 test_input: str,
                                 task_description: str) -> str:
        """Few-shot classification prompt"""
        prompt = f"""{task_description}

"""
        for i, ex in enumerate(examples, 1):
            prompt += f"Text: {ex['text']}\n"
            prompt += f"Category: {ex['label']}\n"
            prompt += f"Reasoning: {ex.get('reasoning', 'N/A')}\n\n"
        
        prompt += f"Text: {test_input}\n"
        prompt += "Category: "
        
        return prompt
    
    @staticmethod
    def self_ask( question: str) -> str:
        """Self-ask prompting for complex questions"""
        return f"""Question: {question}

Is the question above compositional? No.

What are the sub-questions?
Sub-question 1: """

    @staticmethod
    def least_to_most(problem: str) -> str:
        """Least-to-most prompting"""
        return f"""Problem: {problem}

The problem can be decomposed into the following sub-problems, 
from simplest to most complex:

Sub-problem 1 (simplest):"""

    @staticmethod
    def react_prompt(question: str) -> str:
        """ReAct (Reason + Act) prompting"""
        return f"""Answer the following question step by step. You can use 
Thought, Action, and Observation.

Question: {question}

Thought 1: I need to analyze this problem step by step.
Action 1: search[keyword]
Observation 1: [Search results would appear here]
Thought 2: Based on the search results...
Action 2: finish[answer]

Let me work through this:"""
    
    @staticmethod
    def automatic_prompt_engineer(task: str, 
                                   eval_data: List[Dict]) -> str:
        """APE-style prompt generation"""
        return f"""I need to create a prompt for the following task:

Task: {task}

Here are some example inputs and desired outputs:
"""
        for i, item in enumerate(eval_data[:3], 1):
            prompt += f"Input {i}: {item['input']}\n"
            prompt += f"Output {i}: {item['output']}\n\n"
        
        prompt += """Please generate 5 candidate prompts that would best 
accomplish this task, considering clarity, specificity, and effectiveness.

Candidate prompts:"""
        
        return prompt

# Usage
advanced = AdvancedPrompting()

# Complex few-shot example
examples = [
    {
        "text": "The movie had stunning visuals but a weak plot.",
        "label": "Mixed",
        "reasoning": "Positive on visuals, negative on plot = mixed"
    },
    {
        "text": "Absolutely loved every minute of it!",
        "label": "Positive",
        "reasoning": "Strong positive language throughout"
    },
    {
        "text": "Complete waste of time and money.",
        "label": "Negative", 
        "reasoning": "Strong negative language, no positives"
    }
]

prompt = AdvancedPrompting.few_shot_classification(
    examples=examples,
    test_input="The acting was great but the script needed work.",
    task_description="Classify movie review sentiment as Positive, Negative, or Mixed."
)

print("=== Few-Shot Classification Prompt ===")
print(prompt)
```

---

## Section 4: Prompt Templates & Chains

```python
from string import Template
from typing import Callable, Any
import re

class PromptTemplate:
    """Custom prompt template system"""
    
    def __init__(self, template: str, input_variables: List[str]):
        self.template = template
        self.input_variables = input_variables
    
    def format(self, **kwargs) -> str:
        """Format template with variables"""
        missing = set(self.input_variables) - set(kwargs.keys())
        if missing:
            raise ValueError(f"Missing variables: {missing}")
        
        result = self.template
        for key, value in kwargs.items():
            result = result.replace(f"{{{key}}}", str(value))
        
        return result
    
    def partial(self, **kwargs) -> 'PromptTemplate':
        """Create a new template with some variables filled"""
        new_template = self.template
        new_variables = list(self.input_variables)
        
        for key, value in kwargs.items():
            new_template = new_template.replace(f"{{{key}}}", str(value))
            if key in new_variables:
                new_variables.remove(key)
        
        return PromptTemplate(new_template, new_variables)


class PromptChain:
    """Chain multiple prompts together"""
    
    def __init__(self):
        self.steps = []
    
    def add_step(self, name: str, template: PromptTemplate, 
                 extractor: Callable = None):
        """Add a step to the chain"""
        self.steps.append({
            "name": name,
            "template": template,
            "extractor": extractor or (lambda x: x)
        })
        return self
    
    def execute(self, initial_input: Dict, 
                llm_call: Callable) -> List[Dict]:
        """Execute the chain"""
        results = []
        context = dict(initial_input)
        
        for step in self.steps:
            # Format prompt
            prompt = step["template"].format(**context)
            
            # Call LLM (or mock)
            output = llm_call(prompt)
            
            # Extract relevant info
            extracted = step["extractor"](output)
            
            results.append({
                "step": step["name"],
                "prompt": prompt,
                "output": output,
                "extracted": extracted
            })
            
            # Update context for next step
            context[f"{step['name']}_output"] = extracted
        
        return results


class PromptLibrary:
    """Reusable prompt templates library"""
    
    TEMPLATES = {
        "summarize": PromptTemplate(
            template="""Summarize the following text in {length} sentences:

Text: {text}

Summary:""",
            input_variables=["text", "length"]
        ),
        
        "classify": PromptTemplate(
            template="""Classify the following text into one of these categories: {categories}

Text: {text}

Category:""",
            input_variables=["text", "categories"]
        ),
        
        "extract_entities": PromptTemplate(
            template="""Extract all {entity_types} from the following text:

Text: {text}

Format your response as a JSON array:
[{{"entity": "...", "type": "...", "context": "..."}}]""",
            input_variables=["text", "entity_types"]
        ),
        
        "translate": PromptTemplate(
            template="""Translate the following text from {source_lang} to {target_lang}:
Preserve the tone and style of the original.

Original: {text}

Translation:""",
            input_variables=["text", "source_lang", "target_lang"]
        ),
        
        "reason": PromptTemplate(
            template="""Given the following information, reason step by step.

Information: {context}
Question: {question}

Let's think step by step:
Step 1:""",
            input_variables=["context", "question"]
        ),
        
        "refine": PromptTemplate(
            template="""Here is a draft response:
{draft}

Please refine this response by:
1. Improving clarity and conciseness
2. Adding missing important details
3. Removing redundancy

Refined response:""",
            input_variables=["draft"]
        ),
    }
    
    @classmethod
    def get(cls, name: str) -> PromptTemplate:
        return cls.TEMPLATES[name]
    
    @classmethod
    def list_templates(cls) -> List[str]:
        return list(cls.TEMPLATES.keys())

# Usage
template = PromptLibrary.get("classify")
prompt = template.format(
    text="The new iPhone has amazing camera quality but battery life is disappointing.",
    categories="Positive, Negative, Mixed"
)
print("=== Templated Prompt ===")
print(prompt)

# Chain example
chain = PromptChain()
chain.add_step(
    "extract_facts",
    PromptTemplate("Extract key facts from: {text}", ["text"]),
    lambda x: [line.strip() for line in x.split('\n') if line.strip()]
)
chain.add_step(
    "summarize_facts",
    PromptTemplate("Summarize these facts concisely: {extract_facts_output}", ["extract_facts_output"])
)

print("\n=== Prompt Chain ===")
print("Chain created with 2 steps: extract_facts â†’ summarize_facts")
```

---

## Section 5: OpenAI API Integration

```python
from openai import OpenAI
import json
import time
from typing import Generator

class OpenAIIntegration:
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key)
        self.default_model = "gpt-3.5-turbo"
    
    def chat_completion(self, messages, model=None, **kwargs):
        """Basic chat completion"""
        model = model or self.default_model
        
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 1000),
            top_p=kwargs.get("top_p", 1.0),
            frequency_penalty=kwargs.get("frequency_penalty", 0.0),
            presence_penalty=kwargs.get("presence_penalty", 0.0),
        )
        
        return {
            "content": response.choices[0].message.content,
            "model": response.model,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            },
            "finish_reason": response.choices[0].finish_reason
        }
    
    def stream_completion(self, messages, model=None, **kwargs):
        """Streaming chat completion"""
        model = model or self.default_model
        
        stream = self.client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 1000)
        )
        
        collected = []
        for chunk in stream:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                collected.append(content)
                yield content
        
        return "".join(collected)
    
    def function_calling(self, messages, functions, model=None):
        """Function calling with OpenAI"""
        model = model or self.default_model
        
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            functions=functions,
            function_call="auto"
        )
        
        message = response.choices[0].message
        
        if message.function_call:
            return {
                "type": "function_call",
                "function_name": message.function_call.name,
                "arguments": json.loads(message.function_call.arguments),
                "content": message.content
            }
        else:
            return {
                "type": "text",
                "content": message.content
            }
    
    def structured_output(self, prompt, schema, model=None):
        """Get structured JSON output"""
        model = model or self.default_model
        
        messages = [
            {"role": "system", "content": "You must respond in valid JSON format."},
            {"role": "user", "content": f"{prompt}\n\nJSON Schema:\n{json.dumps(schema, indent=2)}"}
        ]
        
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        return json.loads(response.choices[0].message.content)
    
    def multi_turn_conversation(self, system_prompt: str, user_messages: List[str]):
        """Multi-turn conversation"""
        messages = [{"role": "system", "content": system_prompt}]
        
        for user_msg in user_messages:
            messages.append({"role": "user", "content": user_msg})
            
            response = self.chat_completion(messages)
            assistant_msg = response["content"]
            messages.append({"role": "assistant", "content": assistant_msg})
            
            yield {
                "turn": len(messages) // 2,
                "user": user_msg,
                "assistant": assistant_msg,
                "tokens": response["usage"]["total_tokens"]
            }
    
    def retry_with_backoff(self, messages, max_retries=3, **kwargs):
        """API call with exponential backoff"""
        for attempt in range(max_retries):
            try:
                return self.chat_completion(messages, **kwargs)
            except Exception as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = 2 ** attempt
                print(f"Retry {attempt + 1} after {wait_time}s: {e}")
                time.sleep(wait_time)

# Usage
integration = OpenAIIntegration()

# Define functions for function calling
functions = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "search_products",
        "description": "Search for products in a catalog",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "category": {"type": "string", "description": "Product category"},
                "max_price": {"type": "number", "description": "Maximum price"}
            },
            "required": ["query"]
        }
    }
]

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What's the weather in Singapore?"}
]

# Function calling result
result = integration.function_calling(messages, functions)
print("=== Function Calling ===")
print(json.dumps(result, indent=2))
```

---

## Section 6: LangChain Basics

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

class LangChainBasics:
    """Core LangChain concepts and patterns"""
    
    def __init__(self, model_name="gpt-3.5-turbo"):
        self.llm = ChatOpenAI(model=model_name, temperature=0.7)
        self.embeddings = OpenAIEmbeddings()
    
    def basic_chain(self, topic: str) -> str:
        """Simple LLM chain"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert educator. Explain concepts clearly."),
            ("user", "Explain {topic} in simple terms with an example.")
        ])
        
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke({"topic": topic})
    
    def sequential_chain(self, product: str) -> dict:
        """Multiple chains in sequence"""
        # Step 1: Generate product description
        desc_prompt = ChatPromptTemplate.from_template(
            "Write a compelling product description for: {product}"
        )
        
        # Step 2: Generate marketing tagline
        tagline_prompt = ChatPromptTemplate.from_template(
            "Based on this product description, create a catchy tagline:\n{description}"
        )
        
        # Step 3: Generate social media post
        social_prompt = ChatPromptTemplate.from_template(
            "Create a social media post with this tagline:\nTagline: {tagline}\nProduct: {product}"
        )
        
        desc_chain = desc_prompt | self.llm | StrOutputParser()
        tagline_chain = tagline_prompt | self.llm | StrOutputParser()
        social_chain = social_prompt | self.llm | StrOutputParser()
        
        description = desc_chain.invoke({"product": product})
        tagline = tagline_chain.invoke({"description": description})
        social_post = social_chain.invoke({"tagline": tagline, "product": product})
        
        return {
            "description": description,
            "tagline": tagline,
            "social_post": social_post
        }
    
    def parallel_chains(self, text: str) -> dict:
        """Run multiple chains in parallel"""
        from langchain_core.runnables import RunnableParallel
        
        summary_prompt = ChatPromptTemplate.from_template(
            "Summarize in 2 sentences: {text}"
        )
        
        sentiment_prompt = ChatPromptTemplate.from_template(
            "What is the sentiment (positive/negative/neutral)? Text: {text}"
        )
        
        keywords_prompt = ChatPromptTemplate.from_template(
            "Extract 5 key terms from: {text}"
        )
        
        parallel = RunnableParallel(
            summary=summary_prompt | self.llm | StrOutputParser(),
            sentiment=sentiment_prompt | self.llm | StrOutputParser(),
            keywords=keywords_prompt | self.llm | StrOutputParser()
        )
        
        return parallel.invoke({"text": text})
    
    def custom_chain_with_passthrough(self, topic: str) -> str:
        """Chain with data passthrough"""
        prompt = ChatPromptTemplate.from_template(
            "Topic: {topic}\nResearch angle: {angle}\n\nProvide insights:"
        )
        
        chain = (
            {"topic": RunnablePassthrough(), "angle": RunnableLambda(
                lambda x: f"Impact of AI on {x['topic']}"
            )}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        return chain.invoke({"topic": topic})

# Usage
basics = LangChainBasics()

# Note: In production, set OPENAI_API_KEY environment variable
# response = basics.basic_chain("neural networks")
# print(response)
print("LangChain integration ready. Set OPENAI_API_KEY to use.")
```

---

## Section 7: RAG (Retrieval-Augmented Generation)

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain.schema import Document
import numpy as np
from typing import List

class RAGPipeline:
    """Complete RAG pipeline implementation"""
    
    def __init__(self, chunk_size=500, chunk_overlap=50):
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.3)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""],
            length_function=len
        )
        self.vector_store = None
        self.retriever = None
        self.chain = None
    
    def load_documents(self, source: str, glob: str = "**/*.txt"):
        """Load documents from a source"""
        if source.endswith('.txt'):
            loader = TextLoader(source)
            documents = loader.load()
        else:
            loader = DirectoryLoader(source, glob=glob, loader_cls=TextLoader)
            documents = loader.load()
        
        return documents
    
    def split_documents(self, documents: List[Document]) -> List[Document]:
        """Split documents into chunks"""
        chunks = self.text_splitter.split_documents(documents)
        print(f"Split {len(documents)} documents into {len(chunks)} chunks")
        return chunks
    
    def create_vector_store(self, chunks: List[Document]):
        """Create FAISS vector store from chunks"""
        self.vector_store = FAISS.from_documents(chunks, self.embeddings)
        self.retriever = self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4}
        )
        print(f"Created vector store with {len(chunks)} chunks")
    
    def build_rag_chain(self):
        """Build the RAG chain"""
        prompt = ChatPromptTemplate.from_template("""
Context from retrieved documents:
{context}

Question: {question}

Using only the context provided above, answer the question accurately.
If the context doesn't contain enough information, say so.

Answer:""")
        
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)
        
        self.chain = (
            {"context": self.retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        return self.chain
    
    def query(self, question: str) -> dict:
        """Query the RAG system"""
        if self.chain is None:
            raise ValueError("Chain not built. Call build_rag_chain first.")
        
        # Get relevant documents
        relevant_docs = self.retriever.invoke(question)
        
        # Get answer
        answer = self.chain.invoke(question)
        
        return {
            "question": question,
            "answer": answer,
            "sources": [
                {
                    "content": doc.page_content[:200],
                    "metadata": doc.metadata
                }
                for doc in relevant_docs
            ]
        }
    
    def similarity_search(self, query: str, k: int = 5):
        """Direct similarity search"""
        if self.vector_store is None:
            raise ValueError("Vector store not created")
        
        results = self.vector_store.similarity_search_with_score(query, k=k)
        
        return [
            {
                "content": doc.page_content,
                "score": float(score),
                "metadata": doc.metadata
            }
            for doc, score in results
        ]

# Usage
rag = RAGPipeline(chunk_size=500, chunk_overlap=50)

# In production:
# documents = rag.load_documents("./knowledge_base")
# chunks = rag.split_documents(documents)
# rag.create_vector_store(chunks)
# rag.build_rag_chain()
# result = rag.query("What is the main topic?")

print("RAG Pipeline initialized. Ready for document loading and querying.")
```

---

## Section 8: LLM Evaluation

```python
import numpy as np
from collections import defaultdict
from typing import List, Dict

class LLMEvaluator:
    """Comprehensive LLM evaluation framework"""
    
    def __init__(self):
        self.results = {}
    
    def evaluate_generation_quality(self, generated: str, reference: str) -> Dict:
        """Evaluate generation quality metrics"""
        # Length metrics
        gen_words = len(generated.split())
        ref_words = len(reference.split())
        
        # Lexical overlap (simplified BLEU-like)
        gen_tokens = set(generated.lower().split())
        ref_tokens = set(reference.lower().split())
        
        precision = len(gen_tokens & ref_tokens) / max(len(gen_tokens), 1)
        recall = len(gen_tokens & ref_tokens) / max(len(ref_tokens), 1)
        f1 = 2 * precision * recall / max(precision + recall, 1e-10)
        
        # Lexical diversity
        unique_words = len(set(generated.lower().split()))
        diversity = unique_words / max(gen_words, 1)
        
        return {
            "f1": f1,
            "precision": precision,
            "recall": recall,
            "gen_length": gen_words,
            "ref_length": ref_words,
            "lexical_diversity": diversity
        }
    
    def evaluate_faithfulness(self, answer: str, context: str) -> Dict:
        """Evaluate if answer is faithful to context"""
        answer_sentences = answer.split('.')
        context_lower = context.lower()
        
        supported = 0
        unsupported = 0
        
        for sentence in answer_sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # Check if key content words appear in context
            words = [w.lower() for w in sentence.split() 
                    if len(w) > 3 and w.lower() not in {'this', 'that', 'with', 'from'}]
            
            context_matches = sum(1 for w in words if w in context_lower)
            if context_matches >= len(words) * 0.3:
                supported += 1
            else:
                unsupported += 1
        
        total = supported + unsupported
        faithfulness = supported / max(total, 1)
        
        return {
            "faithfulness_score": faithfulness,
            "supported_claims": supported,
            "unsupported_claims": unsupported,
            "total_claims": total
        }
    
    def evaluate_relevance(self, answer: str, question: str) -> Dict:
        """Evaluate answer relevance to question"""
        q_words = set(question.lower().split())
        a_words = set(answer.lower().split())
        
        overlap = len(q_words & a_words)
        relevance = overlap / max(len(q_words), 1)
        
        return {
            "relevance_score": relevance,
            "question_coverage": relevance
        }
    
    def evaluate_completeness(self, answer: str, 
                             required_elements: List[str]) -> Dict:
        """Evaluate if answer covers required elements"""
        answer_lower = answer.lower()
        
        covered = []
        missing = []
        
        for element in required_elements:
            if element.lower() in answer_lower:
                covered.append(element)
            else:
                missing.append(element)
        
        completeness = len(covered) / max(len(required_elements), 1)
        
        return {
            "completeness_score": completeness,
            "covered": covered,
            "missing": missing
        }
    
    def hallucination_detection(self, answer: str, 
                                context: str) -> Dict:
        """Basic hallucination detection"""
        answer_facts = self._extract_simple_facts(answer)
        context_facts = self._extract_simple_facts(context)
        
        grounded = 0
        hallucinated = 0
        
        for fact in answer_facts:
            fact_words = set(fact.lower().split())
            if any(len(fact_words & set(cf.lower().split())) >= len(fact_words) * 0.5 
                   for cf in context_facts):
                grounded += 1
            else:
                hallucinated += 1
        
        total = grounded + hallucinated
        hallucination_rate = hallucinated / max(total, 1)
        
        return {
            "hallucination_rate": hallucination_rate,
            "grounded_statements": grounded,
            "potentially_hallucinated": hallucinated,
            "total_statements": total
        }
    
    def _extract_simple_facts(self, text: str) -> List[str]:
        """Simple fact extraction (sentences as facts)"""
        return [s.strip() for s in text.split('.') if s.strip() and len(s.strip()) > 10]
    
    def comprehensive_evaluation(self, question: str, answer: str, 
                                 context: str, reference: str = None,
                                 required_elements: List[str] = None) -> Dict:
        """Run all evaluations"""
        results = {
            "relevance": self.evaluate_relevance(answer, question),
            "faithfulness": self.evaluate_faithfulness(answer, context),
            "hallucination": self.hallucination_detection(answer, context)
        }
        
        if reference:
            results["quality"] = self.evaluate_generation_quality(answer, reference)
        
        if required_elements:
            results["completeness"] = self.evaluate_completeness(answer, required_elements)
        
        # Overall score
        scores = [
            results["relevance"]["relevance_score"],
            results["faithfulness"]["faithfulness_score"],
            1 - results["hallucination"]["hallucination_rate"]
        ]
        
        results["overall_score"] = np.mean(scores)
        
        return results

# Usage
evaluator = LLMEvaluator()

question = "What are the benefits of using RAG for LLM applications?"
context = """RAG (Retrieval-Augmented Generation) combines retrieval and generation. 
Key benefits include: reduced hallucination, up-to-date information, 
domain-specific knowledge, and cost-effective fine-tuning alternatives."""

answer = """RAG offers several key benefits:
1. Reduced hallucination by grounding responses in retrieved documents.
2. Access to up-to-date information without retraining.
3. Domain-specific knowledge from curated document collections.
4. Cost-effective alternative to fine-tuning large models."""

results = evaluator.comprehensive_evaluation(
    question=question,
    answer=answer,
    context=context,
    required_elements=["hallucination", "up-to-date", "domain-specific", "cost-effective"]
)

print("=== LLM Evaluation Results ===")
for metric, scores in results.items():
    if isinstance(scores, dict):
        print(f"\n{metric.upper()}:")
        for key, value in scores.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.4f}")
            else:
                print(f"  {key}: {value}")

print(f"\nOverall Score: {results['overall_score']:.4f}")
```

### Real-Time Use Cases - Module 28

| Use Case | Technique | Industry | Impact |
|----------|-----------|----------|--------|
| Customer Support Bot | RAG + Function Calling | Support | 60% ticket deflection |
| Code Documentation | Few-shot + CoT | Engineering | 4x faster doc generation |
| Legal Contract Analysis | Structured Output | Legal | 70% faster review |
| Multi-language Support | OpenAI API + Translation | Global | 20+ language coverage |
| Knowledge Base Q&A | RAG + Semantic Search | Enterprise | Self-service support |
| Content Generation | Prompt Engineering | Marketing | 3x content output |
| Data Analysis Assistant | Function Calling + CoT | Analytics | Natural language queries |
| Research Paper Analysis | Chain-of-Thought | Academia | 50% faster literature review |

### Module 28 Project Ideas

| Project | Difficulty | Skills Required | Dataset |
|---------|-----------|-----------------|---------|
| Custom Chatbot with Memory | Intermediate | LangChain, OpenAI | Custom knowledge base |
| Document Q&A System | Advanced | RAG, Vector Store | PDF collection |
| Prompt Engineering Playground | Beginner | OpenAI API | Test prompts |
| Multi-tool AI Assistant | Advanced | Function Calling, LangChain | APIs |
| LLM Evaluation Pipeline | Advanced | Metrics, Evaluation | OpenAI cookbook |

---

# MODULE 29: RAG & Vector Databases

## Learning Objectives
- Understand embeddings and vector search fundamentals
- Master FAISS, ChromaDB, and managed vector databases
- Implement advanced document chunking strategies
- Build hybrid search systems
- Design and evaluate production RAG pipelines

---

## Section 1: Embeddings & Vector Search

```python
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Tuple

class EmbeddingEngine:
    """Generate and compare embeddings"""
    
    MODELS = {
        "small": "all-MiniLM-L6-v2",
        "medium": "all-mpnet-base-v2",
        "multilingual": "paraphrase-multilingual-MiniLM-L12-v2",
        "code": "all-MiniLM-L6-v2",  # use CodeBERT for code
    }
    
    def __init__(self, model_name="small"):
        model_id = self.MODELS.get(model_name, model_name)
        self.model = SentenceTransformer(model_id)
        self.dimension = self.model.get_sentence_embedding_dimension()
    
    def encode(self, texts: List[str], batch_size=32, 
               normalize=True) -> np.ndarray:
        """Encode texts to embeddings"""
        embeddings = self.model.encode(
            texts, 
            batch_size=batch_size,
            show_progress_bar=len(texts) > 100,
            normalize_embeddings=normalize
        )
        return np.array(embeddings)
    
    def encode_query(self, query: str) -> np.ndarray:
        """Encode a single query"""
        return self.model.encode([query], normalize_embeddings=True)[0]
    
    def cosine_similarity(self, emb1: np.ndarray, emb2: np.ndarray) -> float:
        """Compute cosine similarity between two embeddings"""
        return float(np.dot(emb1, emb2) / (
            np.linalg.norm(emb1) * np.linalg.norm(emb2) + 1e-10
        ))
    
    def batch_similarity(self, query_emb: np.ndarray, 
                        doc_embs: np.ndarray) -> np.ndarray:
        """Compute similarities for a batch of documents"""
        return np.dot(doc_embs, query_emb)
    
    def find_nearest(self, query_emb: np.ndarray, 
                     doc_embs: np.ndarray, 
                     doc_texts: List[str],
                     top_k: int = 5) -> List[Tuple[str, float]]:
        """Find nearest documents"""
        similarities = self.batch_similarity(query_emb, doc_embs)
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        return [
            (doc_texts[idx], float(similarities[idx]))
            for idx in top_indices
        ]

# Usage
engine = EmbeddingEngine("small")

documents = [
    "Machine learning is a subset of artificial intelligence.",
    "Deep learning uses neural networks with many layers.",
    "Natural language processing deals with text and speech.",
    "Computer vision enables machines to interpret images.",
    "Reinforcement learning trains agents through rewards.",
]

query = "What is deep learning?"

doc_embeddings = engine.encode(documents)
query_embedding = engine.encode_query(query)

results = engine.find_nearest(query_embedding, doc_embeddings, documents)

print("=== Embedding Search Results ===")
print(f"Query: {query}\n")
for text, score in results:
    print(f"  [{score:.4f}] {text}")
```

---

## Section 2: FAISS

```python
import faiss
import numpy as np
from typing import List, Tuple, Optional

class FAISSVectorStore:
    """FAISS-based vector store implementation"""
    
    def __init__(self, dimension: int = 384, metric: str = "cosine"):
        self.dimension = dimension
        self.metric = metric
        self.index = None
        self.documents = []
        self.metadatas = []
        
        self._create_index(metric)
    
    def _create_index(self, metric: str):
        """Create FAISS index based on metric"""
        if metric == "l2":
            self.index = faiss.IndexFlatL2(self.dimension)
        elif metric == "cosine":
            self.index = faiss.IndexFlatIP(self.dimension)
        elif metric == "ivf":
            quantizer = faiss.IndexFlatL2(self.dimension)
            self.index = faiss.IndexIVFFlat(
                quantizer, self.dimension, 
                min(100, max(1, len(self.documents) // 10))
            )
        elif metric == "hnsw":
            self.index = faiss.IndexHNSWFlat(self.dimension, 32)
        else:
            raise ValueError(f"Unknown metric: {metric}")
    
    def add_documents(self, embeddings: np.ndarray, 
                      documents: List[str],
                      metadatas: Optional[List[dict]] = None):
        """Add documents to the index"""
        if embeddings.shape[1] != self.dimension:
            raise ValueError(f"Embedding dimension mismatch: {embeddings.shape[1]} != {self.dimension}")
        
        if self.metric == "cosine":
            faiss.normalize_L2(embeddings)
        
        self.index.add(embeddings.astype(np.float32))
        self.documents.extend(documents)
        
        if metadatas:
            self.metadatas.extend(metadatas)
        else:
            self.metadatas.extend([{} for _ in documents])
    
    def search(self, query_embedding: np.ndarray, 
               top_k: int = 5) -> List[Tuple[str, float, dict]]:
        """Search for similar documents"""
        if self.metric == "cosine":
            query_embedding = query_embedding.reshape(1, -1).astype(np.float32)
            faiss.normalize_L2(query_embedding)
        else:
            query_embedding = query_embedding.reshape(1, -1).astype(np.float32)
        
        scores, indices = self.index.search(query_embedding, top_k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx >= 0:
                results.append((
                    self.documents[idx],
                    float(score),
                    self.metadatas[idx]
                ))
        
        return results
    
    def save(self, path: str):
        """Save index to disk"""
        faiss.write_index(self.index, f"{path}.faiss")
        
        import pickle
        with open(f"{path}.meta", "wb") as f:
            pickle.dump({
                "documents": self.documents,
                "metadatas": self.metadatas,
                "dimension": self.dimension,
                "metric": self.metric
            }, f)
    
    def load(self, path: str):
        """Load index from disk"""
        self.index = faiss.read_index(f"{path}.faiss")
        
        import pickle
        with open(f"{path}.meta", "rb") as f:
            data = pickle.load(f)
            self.documents = data["documents"]
            self.metadatas = data["metadatas"]
            self.dimension = data["dimension"]
            self.metric = data["metric"]
    
    @property
    def size(self):
        return self.index.ntotal

# Usage
dimension = 384  # MiniLM dimension
store = FAISSVectorStore(dimension=dimension, metric="cosine")

# Generate dummy embeddings
np.random.seed(42)
docs = [
    "Python is great for data science",
    "JavaScript is used for web development",
    "Machine learning requires lots of data",
    "Deep learning uses neural networks",
    "Natural language processing handles text",
    "Computer vision processes images",
    "Cloud computing provides scalable resources",
    "DevOps automates software deployment"
]

embeddings = np.random.randn(len(docs), dimension).astype(np.float32)
store.add_documents(embeddings, docs, [{"source": "tech"} for _ in docs])

query_emb = np.random.randn(dimension).astype(np.float32)
results = store.search(query_emb, top_k=3)

print("=== FAISS Search Results ===")
for text, score, meta in results:
    print(f"  [{score:.4f}] {text} {meta}")

print(f"\nIndex size: {store.size}")
```

---

## Section 3: ChromaDB

```python
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Optional
import hashlib

class ChromaVectorStore:
    """ChromaDB-based vector store"""
    
    def __init__(self, collection_name: str = "default",
                 persist_directory: str = None):
        if persist_directory:
            self.client = chromadb.PersistentClient(path=persist_directory)
        else:
            self.client = chromadb.Client()
        
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        self.collection_name = collection_name
    
    def add_documents(self, documents: List[str],
                      metadatas: Optional[List[dict]] = None,
                      ids: Optional[List[str]] = None,
                      embeddings: Optional[List] = None):
        """Add documents to the collection"""
        if ids is None:
            ids = [
                hashlib.md5(doc.encode()).hexdigest() 
                for doc in documents
            ]
        
        if metadatas is None:
            metadatas = [{} for _ in documents]
        
        add_kwargs = {
            "documents": documents,
            "ids": ids,
            "metadatas": metadatas
        }
        
        if embeddings is not None:
            add_kwargs["embeddings"] = embeddings
        
        self.collection.add(**add_kwargs)
    
    def query(self, query_text: str = None, 
              query_embeddings: List = None,
              n_results: int = 5,
              where: Optional[dict] = None,
              where_document: Optional[dict] = None) -> Dict:
        """Query the collection"""
        query_kwargs = {"n_results": n_results}
        
        if query_text:
            query_kwargs["query_texts"] = [query_text]
        if query_embeddings:
            query_kwargs["query_embeddings"] = [query_embeddings]
        if where:
            query_kwargs["where"] = where
        if where_document:
            query_kwargs["where_document"] = where_document
        
        return self.collection.query(**query_kwargs)
    
    def update(self, ids: List[str], 
               documents: Optional[List[str]] = None,
               metadatas: Optional[List[dict]] = None,
               embeddings: Optional[List] = None):
        """Update documents"""
        update_kwargs = {"ids": ids}
        if documents:
            update_kwargs["documents"] = documents
        if metadatas:
            update_kwargs["metadatas"] = metadatas
        if embeddings:
            update_kwargs["embeddings"] = embeddings
        
        self.collection.update(**update_kwargs)
    
    def delete(self, ids: List[str]):
        """Delete documents"""
        self.collection.delete(ids=ids)
    
    def get_all(self) -> Dict:
        """Get all documents"""
        return self.collection.get()
    
    def count(self) -> int:
        """Get collection count"""
        return self.collection.count()
    
    def peek(self, n: int = 5) -> Dict:
        """Peek at documents"""
        return self.collection.peek(n=n)
    
    def search_with_filters(self, query_text: str, 
                           metadata_filter: dict = None,
                           text_filter: dict = None,
                           n_results: int = 5) -> Dict:
        """Search with metadata and text filters"""
        query_kwargs = {
            "query_texts": [query_text],
            "n_results": n_results
        }
        
        if metadata_filter:
            query_kwargs["where"] = metadata_filter
        if text_filter:
            query_kwargs["where_document"] = text_filter
        
        return self.collection.query(**query_kwargs)

    def search_with_hybrid(self, query_text: str, 
                           n_results: int = 5,
                           keyword_weight: float = 0.3,
                           semantic_weight: float = 0.7) -> Dict:
        """Hybrid search combining keyword and semantic matching"""
        import numpy as np
        
        keyword_results = self.search_with_filters(
            query_text,
            text_filter={"$contains": query_text.lower()},
            n_results=n_results * 2
        )
        
        semantic_results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results * 2
        )
        
        combined_scores = {}
        
        if keyword_results and keyword_results["distances"]:
            for i, doc_id in enumerate(keyword_results["ids"][0]):
                combined_scores[doc_id] = keyword_weight * (1 / (1 + keyword_results["distances"][0][i]))
        
        if semantic_results and semantic_results["distances"]:
            for i, doc_id in enumerate(semantic_results["ids"][0]):
                if doc_id in combined_scores:
                    combined_scores[doc_id] += semantic_weight * (1 / (1 + semantic_results["distances"][0][i]))
                else:
                    combined_scores[doc_id] = semantic_weight * (1 / (1 + semantic_results["distances"][0][i]))
        
        sorted_ids = sorted(combined_scores.keys(), key=lambda x: combined_scores[x], reverse=True)[:n_results]
        
        final_docs = []
        final_distances = []
        final_metadatas = []
        final_ids = []
        
        all_docs = {}
        if semantic_results and semantic_results["documents"]:
            for i, doc_id in enumerate(semantic_results["ids"][0]):
                all_docs[doc_id] = {
                    "document": semantic_results["documents"][0][i],
                    "metadata": semantic_results["metadatas"][0][i] if semantic_results["metadatas"] else None
                }
        
        for doc_id in sorted_ids:
            final_ids.append(doc_id)
            final_distances.append(combined_scores[doc_id])
            if doc_id in all_docs:
                final_docs.append(all_docs[doc_id]["document"])
                final_metadatas.append(all_docs[doc_id]["metadata"])
            else:
                final_docs.append(None)
                final_metadatas.append(None)
        
        return {
            "ids": [final_ids],
            "documents": [final_docs],
            "distances": [final_distances],
            "metadatas": [final_metadatas]
        }
```

### Section 4: Hybrid Search and Production RAG

Production RAG systems rarely rely on a single search method. Combining semantic search with keyword-based approaches and re-ranking results dramatically improves retrieval quality.

**Key concepts:**
- **BM25 for keyword matching**: Captures exact term matches and rare vocabulary
- **Semantic embeddings for meaning**: Captures conceptual similarity
- **Re-ranking**: A cross-encoder or LLM refines initial retrieval
- **Ensemble retrieval**: Weighted combination of multiple search signals

**BM25 + Embeddings Hybrid Search Example:**

```python
from rank_bm25 import BM25Okapi
from sentence_transformers import CrossEncoder
import numpy as np
from typing import List, Dict, Tuple
import chromadb
from chromadb.config import Settings


class HybridProductionRAG:
    """Production-grade hybrid search combining BM25 + dense embeddings + re-ranking."""
    
    def __init__(self, embedding_model, cross_encoder_model="cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.embedding_model = embedding_model
        self.cross_encoder = CrossEncoder(cross_encoder_model)
        self.client = chromadb.Client(Settings(anonymized_telemetry=False))
        self.collection = self.client.create_collection("production_rag")
        self.documents = []
        self.doc_ids = []
        self.tokenized_corpus = []
        self.bm25 = None
    
    def _tokenize(self, text: str) -> List[str]:
        return text.lower().split()
    
    def index_documents(self, documents: List[str], 
                        metadatas: List[dict] = None,
                        batch_size: int = 100):
        """Index documents with both sparse (BM25) and dense (embedding) representations."""
        self.documents.extend(documents)
        self.doc_ids.extend([f"doc_{i}" for i in range(len(self.doc_ids), len(self.doc_ids) + len(documents))])
        
        self.tokenized_corpus.extend([self._tokenize(doc) for doc in documents])
        self.bm25 = BM25Okapi(self.tokenized_corpus)
        
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            batch_ids = self.doc_ids[i:i + batch_size]
            batch_metas = metadatas[i:i + batch_size] if metadatas else [{}] * len(batch)
            embeddings = self.embedding_model.encode(batch).tolist()
            self.collection.add(
                documents=batch,
                embeddings=embeddings,
                ids=batch_ids,
                metadatas=batch_metas
            )
    
    def bm25_search(self, query: str, top_k: int = 20) -> List[Tuple[str, float]]:
        """Retrieve top-k documents using BM25 scoring."""
        tokenized_query = self._tokenize(query)
        scores = self.bm25.get_scores(tokenized_query)
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(self.doc_ids[i], scores[i]) for i in top_indices]
    
    def dense_search(self, query: str, top_k: int = 20) -> List[Tuple[str, float]]:
        """Retrieve top-k documents using dense embeddings."""
        query_embedding = self.embedding_model.encode([query]).tolist()
        results = self.collection.query(query_embeddings=query_embedding, n_results=top_k)
        return [
            (results["ids"][0][i], 1.0 / (1.0 + results["distances"][0][i]))
            for i in range(len(results["ids"][0]))
        ]
    
    def reciprocal_rank_fusion(self, 
                               ranked_lists: List[List[Tuple[str, float]]],
                               k: int = 60) -> Dict[str, float]:
        """Combine multiple ranked lists using Reciprocal Rank Fusion (RRF)."""
        fused_scores = {}
        for ranked_list in ranked_lists:
            for rank, (doc_id, _) in enumerate(ranked_list, start=1):
                if doc_id not in fused_scores:
                    fused_scores[doc_id] = 0.0
                fused_scores[doc_id] += 1.0 / (k + rank)
        return dict(sorted(fused_scores.items(), key=lambda x: x[1], reverse=True))
    
    def rerank(self, query: str, candidates: List[str], top_k: int = 5) -> List[Tuple[str, float]]:
        """Re-rank candidates using a cross-encoder model."""
        pairs = [(query, doc) for doc in candidates]
        scores = self.cross_encoder.predict(pairs)
        ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
        return ranked[:top_k]
    
    def hybrid_search(self, query: str, top_k: int = 5, 
                      bm25_top_k: int = 20, dense_top_k: int = 20) -> Dict:
        """Full hybrid pipeline: BM25 + Dense retrieval → RRF fusion → Cross-encoder re-ranking."""
        bm25_results = self.bm25_search(query, top_k=bm25_top_k)
        dense_results = self.dense_search(query, top_k=dense_top_k)
        
        fused = self.reciprocal_rank_fusion([bm25_results, dense_results])
        
        top_candidate_ids = list(fused.keys())[:bm25_top_k]
        top_candidates = [self.documents[self.doc_ids.index(did)] for did in top_candidate_ids]
        
        reranked = self.rerank(query, top_candidates, top_k=top_k)
        
        return {
            "documents": [doc for doc, score in reranked],
            "scores": [float(score) for doc, score in reranked],
            "ids": [top_candidate_ids[i] for i, (doc, _) in enumerate(reranked)]
        }


reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
```

### Section 5: Advanced RAG Techniques

As RAG systems mature, advanced techniques address common failure modes: irrelevant retrieval, multi-hop reasoning, and hallucination.

**Query Decomposition:** Breaking complex queries into sub-queries for better retrieval.

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import json

class QueryDecomposer:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
    
    def decompose(self, query: str) -> list:
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Break complex questions into 2-4 sub-questions. Return JSON list of strings."),
            ("human", "{query}")
        ])
        chain = prompt | self.llm
        response = chain.invoke({"query": query})
        return json.loads(response.content)


class SelfRAG:
    """Self-RAG: Adaptive retrieval with relevance and sufficiency checks."""
    
    def __init__(self, retrieval_system, llm):
        self.retriever = retrieval_system
        self.llm = llm
    
    def retrieve_if_needed(self, query: str) -> dict:
        relevance_prompt = f"""Given this query, should we retrieve documents? 
        Answer YES or NO with explanation.
        Query: {query}"""
        relevance_check = self.llm.invoke(relevance_prompt)
        should_retrieve = "YES" in relevance_check.content.upper()
        
        if not should_retrieve:
            return {"retrieved": False, "documents": [], "query": query}
        
        documents = self.retriever.hybrid_search(query, top_k=5)["documents"]
        
        sufficiency_prompt = f"""Given these documents, can they answer the query sufficiently?
        Query: {query}
        Documents: {documents[:3]}
        Answer: SUFFICIENT or INSUFFICIENT"""
        sufficiency_check = self.llm.invoke(sufficiency_prompt)
        
        return {
            "retrieved": True,
            "sufficient": "SUFFICIENT" in sufficiency_check.content.upper(),
            "documents": documents,
            "query": query
        }
    
    def generate(self, query: str) -> str:
        state = self.retrieve_if_needed(query)
        
        if not state["retrieved"]:
            prompt = f"Answer this question from your knowledge: {query}"
        elif state["sufficient"]:
            context = "\n".join(state["documents"][:3])
            prompt = f"Context: {context}\n\nAnswer based on context: {query}"
        else:
            return self.retrieve_if_needed(query)["documents"]
        
        return self.llm.invoke(prompt).content


class MultiStepRAG:
    """Orchestrate multi-step RAG with query decomposition and re-retrieval."""
    
    def __init__(self, rag_system, decomposer, llm):
        self.rag = rag_system
        self.decomposer = decomposer
        self.llm = llm
    
    def answer(self, query: str) -> str:
        sub_queries = self.decomposer.decompose(query)
        all_evidence = []
        
        for sq in sub_queries:
            result = self.rag.hybrid_search(sq, top_k=3)
            all_evidence.extend(result["documents"])
        
        evidence_text = "\n---\n".join(all_evidence)
        synthesis_prompt = f"""Synthesize evidence into a comprehensive answer.
        Question: {query}
        Evidence: {evidence_text}
        Answer:"""
        
        return self.llm.invoke(synthesis_prompt).content
```

### Module 29 Use Cases

| Use Case | Technique | Industry | Benefit |
|----------|-----------|----------|---------|
| **Legal Document Search** | BM25 + Semantic Hybrid | Legal | Precise clause retrieval with exact keyword + meaning |
| **Customer Support Bots** | Query Decomposition + RAG | SaaS / CX | Handles complex multi-part questions accurately |
| **Medical Knowledge Base** | Self-RAG with fact-checking | Healthcare | Reduces hallucination on critical health queries |
| **E-Commerce Product Search** | RRF Fusion + Cross-Encoder Re-ranking | Retail | Relevant product discovery across specs and reviews |
| **Research Paper Aggregator** | Graph RAG over citations | Academia | Multi-hop reasoning across paper references |
| **Internal Wiki Search** | Chunking strategies + Metadata filters | Enterprise | Finds answers across thousands of internal docs |
| **Compliance Q&A** | Self-RAG with audit logging | Finance / Gov | Traceable, grounded answers for regulatory queries |

### Module 29 Project Ideas

1. **Build a Production RAG Pipeline** — Create a document Q&A system using ChromaDB, BM25, and a cross-encoder re-ranker. Support PDF/Markdown ingestion, query decomposition, and a FastAPI endpoint.
2. **Self-RAG Chatbot** — Implement a chatbot that decides when to retrieve, evaluates sufficiency of retrieved context, and falls back gracefully. Include a confidence score with each response.
3. **Multi-Document Research Agent** — Build a system that decomposes a complex research question into sub-queries, retrieves evidence from multiple sources, and synthesizes a structured report with citations.

---

## Module 30: AI Ethics, Safety, and Deployment

As AI systems move from labs to production, responsible deployment becomes critical. This module covers the principles, tools, and frameworks needed to build AI systems that are fair, safe, private, and governable.

### 30.1 Responsible AI Principles

Fairness, accountability, and transparency (FAT) are the pillars of responsible AI. Models can perpetuate or amplify biases present in training data, leading to discriminatory outcomes.

**Key principles:**
- **Fairness**: Equal treatment across demographic groups
- **Accountability**: Clear ownership and traceability of decisions
- **Transparency**: Explainable model behavior and decision rationale
- **Non-maleficence**: Preventing harm through design and monitoring

**Fairness Metrics with Fairlearn:**

```python
import numpy as np
import pandas as pd
from fairlearn.metrics import (
    MetricFrame,
    demographic_parity_difference,
    demographic_parity_ratio,
    equalized_odds_difference
)
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import fetch_openml
import warnings
warnings.filterwarnings("ignore")


class FairnessAuditor:
    """Audit model predictions for fairness across protected groups."""
    
    def __init__(self, model, sensitive_features: pd.Series):
        self.model = model
        self.sensitive_features = sensitive_features
    
    def evaluate(self, X_test, y_test, y_pred) -> dict:
        metric_frame = MetricFrame(
            metrics={
                "accuracy": lambda y_t, y_p: np.mean(y_t == y_p),
                "selection_rate": lambda y_t, y_p: np.mean(y_p),
                "true_positive_rate": lambda y_t, y_p: np.sum((y_p == 1) & (y_t == 1)) / max(np.sum(y_t == 1), 1),
            },
            y_true=y_test,
            y_pred=y_pred,
            sensitive_features=self.sensitive_features
        )
        
        dp_diff = demographic_parity_difference(y_test, y_pred, sensitive_features=self.sensitive_features)
        dp_ratio = demographic_parity_ratio(y_test, y_pred, sensitive_features=self.sensitive_features)
        eo_diff = equalized_odds_difference(y_test, y_pred, sensitive_features=self.sensitive_features)
        
        return {
            "demographic_parity_difference": round(dp_diff, 4),
            "demographic_parity_ratio": round(dp_ratio, 4),
            "equalized_odds_difference": round(eo_diff, 4),
            "per_group_metrics": metric_frame.by_group.to_dict(),
            "overall_metrics": metric_frame.overall.to_dict(),
            "is_fair": abs(dp_diff) < 0.1 and eo_diff < 0.1
        }


class BiasMitigator:
    """Apply bias mitigation strategies: reweighting, threshold adjustment, and adversarial debiasing."""
    
    def __init__(self):
        self.results = {}
    
    def reweight_training(self, X_train, y_train, sensitive_features):
        from fairlearn.reductions import ExponentiatedGradient, DemographicParity
        
        estimator = GradientBoostingClassifier(n_estimators=50, max_depth=3)
        mitigator = ExponentiatedGradient(estimator, DemographicParity())
        mitigator.fit(X_train, y_train, sensitive_features=sensitive_features)
        return mitigator
    
    def threshold_adjustment(self, y_true, y_proba, sensitive_features, target_ratio=0.8):
        groups = sensitive_features.unique()
        thresholds = {}
        for group in groups:
            mask = sensitive_features == group
            group_scores = y_proba[mask]
            sorted_scores = np.sort(group_scores)[::-1]
            optimal_threshold = sorted_scores[int(len(sorted_scores) * 0.3)]
            thresholds[group] = optimal_threshold
        return thresholds
    
    def predict_with_thresholds(self, y_proba, sensitive_features, thresholds):
        predictions = np.zeros_like(y_proba, dtype=int)
        for group, threshold in thresholds.items():
            mask = sensitive_features == group
            predictions[mask] = (y_proba[mask] >= threshold).astype(int)
        return predictions


data = fetch_openml(data_id=1590, as_frame=True, parser="auto")
X = data.data.select_dtypes(include=[np.number]).fillna(0)
y = (data.target.astype(int) == 1).astype(int)
sensitive = data.data["race"].fillna("Unknown")

X_train, X_test, y_train, y_test, s_train, s_test = train_test_split(X, y, sensitive, test_size=0.3, random_state=42)

model = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

auditor = FairnessAuditor(model, s_test)
audit_results = auditor.evaluate(X_test, y_test, y_pred)
print("Bias audit:", audit_results["demographic_parity_difference"], "Fair:", audit_results["is_fair"])

mitigator = BiasMitigator()
y_proba = model.predict_proba(X_test)[:, 1]
thresholds = mitigator.threshold_adjustment(y_test.values, y_proba, s_test)
y_fair = mitigator.predict_with_thresholds(y_proba, s_test, thresholds)
fair_audit = FairnessAuditor(model, s_test).evaluate(X_test, y_test, y_fair)
print("After mitigation:", fair_audit["demographic_parity_difference"])
```

### 30.2 AI Safety and Alignment

LLMs are vulnerable to adversarial attacks that can manipulate outputs or extract sensitive information. Guardrails are essential for safe deployment.

**Key threats:**
- **Prompt injection**: Malicious instructions embedded in input to override system prompts
- **Jailbreaking**: Techniques that bypass safety training
- **Data extraction**: Prompting models to reveal training data or private information
- **Hallucination**: Generating plausible but false information

```python
import re
from typing import List, Optional, Tuple
from dataclasses import dataclass


@dataclass
class SafetyVerdict:
    safe: bool
    risk_level: str
    violations: List[str]
    filtered_output: str


class ContentFilter:
    """Multi-layered content filtering for LLM inputs and outputs."""
    
    INJECTION_PATTERNS = [
        r"ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)",
        r"you\s+are\s+now\s+(DAN|a\s+different|an\s+unrestricted)",
        r"pretend\s+(you\s+are|to\s+be)\s+(?:an?\s+)?(evil|unfiltered|unrestricted)",
        r"bypass\s+(all\s+)?(filters|restrictions|safety|guardrails)",
        r"system\s*:\s*you\s+are",
        r"<\|im_start\|>system",
        r"\[INST\]\s*<<SYS>>",
        r"disregard\s+(all|any|your)\s+(previous|prior|instructions)",
    ]
    
    PII_PATTERNS = {
        "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "phone": r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
        "ssn": r"\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b",
        "credit_card": r"\b(?:\d[ -]*?){13,16}\b",
    }
    
    BLOCKED_TOPICS = [
        r"(how\s+to\s+)?make\s+(a\s+)?(bomb|explosive|weapon)",
        r"(instructions?\s+for?\s+)?(hacking|exploit)\s+(a\s+)?(system|network)",
    ]
    
    def __init__(self):
        self.injection_re = [re.compile(p, re.IGNORECASE) for p in self.INJECTION_PATTERNS]
        self.pii_re = {k: re.compile(v, re.IGNORECASE) for k, v in self.PII_PATTERNS.items()}
        self.topic_re = [re.compile(p, re.IGNORECASE) for p in self.BLOCKED_TOPICS]
    
    def scan_input(self, text: str) -> Tuple[bool, List[str]]:
        violations = []
        for i, pattern in enumerate(self.injection_re):
            if pattern.search(text):
                violations.append(f"injection_pattern_{i}")
        for pii_type, pattern in self.pii_re.items():
            if pattern.search(text):
                violations.append(f"pii_{pii_type}")
        for i, pattern in enumerate(self.topic_re):
            if pattern.search(text):
                violations.append(f"blocked_topic_{i}")
        return len(violations) == 0, violations
    
    def mask_pii(self, text: str) -> str:
        masked = text
        for pii_type, pattern in self.pii_re.items():
            masked = pattern.sub(f"[REDACTED_{pii_type.upper()}]", masked)
        return masked
    
    def filter_output(self, text: str, max_length: int = 2000) -> SafetyVerdict:
        is_clean, input_violations = self.scan_input(text)
        output_violations = []
        filtered = self.mask_pii(text)
        
        if len(filtered) > max_length:
            filtered = filtered[:max_length] + "... [TRUNCATED]"
            output_violations.append("length_exceeded")
        
        all_violations = input_violations + output_violations
        
        if not all_violations:
            risk = "low"
        elif any("injection" in v for v in all_violations):
            risk = "critical"
        elif any("blocked" in v for v in all_violations):
            risk = "high"
        else:
            risk = "medium"
        
        return SafetyVerdict(
            safe=len(all_violations) == 0,
            risk_level=risk,
            violations=all_violations,
            filtered_output=filtered
        )


class InputValidator:
    """Validate and sanitize LLM inputs before processing."""
    
    def __init__(self, max_length: int = 4000, content_filter: ContentFilter = None):
        self.max_length = max_length
        self.filter = content_filter or ContentFilter()
    
    def validate(self, prompt: str) -> Tuple[bool, str, List[str]]:
        warnings = []
        cleaned = prompt.strip()
        
        if len(cleaned) ==  return False, "", ["empty_input"]
        if len(cleaned) > self.max_length:
            cleaned = cleaned[:self.max_length]
            warnings.append("truncated")
        
        is_clean, violations = self.filter.scan_input(cleaned)
        if not is_clean:
            warnings.extend(violations)
            return False, "", warnings
        
        cleaned = self.filter.mask_pii(cleaned)
        return True, cleaned, warnings
    
    def safe_generate(self, prompt: str, llm_call) -> str:
        valid, cleaned, warnings = self.validate(prompt)
        if not valid:
            if any("injection" in w for w in warnings):
                return "I cannot process this request. Please provide a legitimate query."
            return "Invalid input detected. Please try again."
        
        raw_response = llm_call(cleaned)
        verdict = self.filter.filter_output(raw_response)
        return verdict.filtered_output
```

### 30.3 Data Privacy and Governance

AI systems process vast amounts of data, much of which may contain personally identifiable information (PII). Compliance with GDPR, PDPA, and other privacy regulations is non-negotiable.

**Key regulations:**
- **GDPR** (EU): Right to erasure, data minimization, consent
- **PDPA** (Singapore): Consent, purpose limitation, access correction
- **CCPA** (California): Right to know, delete, opt-out

```python
import re
import hashlib
from typing import List, Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class PIIDetection:
    entity_type: str
    start: int
    end: int
    value: str
    confidence: float


class PIIDetector:
    """Rule-based PII detection with contextual validation."""
    
    PATTERNS = {
        "NRIC": r"[STFG]\d{7}[A-Z]",
        "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "PHONE_SG": r"(?:\+65\s?)?\d{4}\s?\d{4}",
        "PHONE_INTL": r"\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}",
        "SINGPASS_ID": r"\b\d{4}\s?\d{7}\b",
        "ADDRESS_SG": r"\d{1,5}\s[A-Za-z\s]{2,30}(?:Street|Road|Avenue|Lane|Drive|Place|Court|Crescent)\b",
        "FIN": r"[A-Z]\d{8}[A-Z]",
        "UEN": r"\d{10}",
    }
    
    SENSITIVE_KEYWORDS = [
        "password", "secret", "token", "api_key", "private_key", "credential"
    ]
    
    def __init__(self):
        self.compiled = {k: re.compile(v, re.IGNORECASE) for k, v in self.PATTERNS.items()}
    
    def detect(self, text: str) -> List[PIIDetection]:
        detections = []
        for pii_type, pattern in self.compiled.items():
            for match in pattern.finditer(text):
                confidence = self._contextual_confidence(text, match, pii_type)
                detections.append(PIIDetection(
                    entity_type=pii_type, start=match.start(),
                    end=match.end(), value=match.group(), confidence=confidence
                ))
        for kw in self.SENSITIVE_KEYWORDS:
            idx = text.lower().find(kw)
            if idx != -1:
                detections.append(PIIDetection(
                    entity_type="SENSITIVE_KEYWORD", start=idx, end=idx + len(kw),
                    value=kw, confidence=0.95
                ))
        return sorted(detections, key=lambda x: x.start)
    
    def _contextual_confidence(self, text: str, match, pii_type: str) -> float:
        start = max(0, match.start() - 30)
        context = text[start:match.start()].lower()
        if pii_type == "NRIC" and any(c in context for c in ["nric", "fin", "ic number"]):
            return 0.95
        if pii_type == "EMAIL" and any(k in context for k in ["email", "mail", "contact"]):
            return 0.90
        return 0.80
    
    def mask(self, text: str, detections: List[PIIDetection] = None) -> str:
        if detections is None:
            detections = self.detect(text)
        masked = text
        offset = 0
        for det in detections:
            placeholder = f"[REDACTED_{det.entity_type}]"
            masked = masked[:det.start + offset] + placeholder + masked[det.end + offset:]
            offset += len(placeholder) - (det.end - det.start)
        return masked


class DataAnonymizer:
    """Anonymize data while preserving utility for ML training."""
    
    def __init__(self):
        self.salt = "lta-ai-hub-2024"
        self.entity_map: Dict[str, str] = {}
        self.reverse_map: Dict[str, str] = {}
    
    def _pseudonymize(self, value: str) -> str:
        if value in self.entity_map:
            return self.entity_map[value]
        hash_val = hashlib.sha256((self.salt + value).encode()).hexdigest()[:10]
        anonymized = f"ANON_{hash_val}"
        self.entity_map[value] = anonymized
        self.reverse_map[anonymized] = value
        return anonymized
    
    def anonymize_text(self, text: str, detector: PIIDetector = None) -> str:
        if detector is None:
            detector = PIIDetector()
        detections = detector.detect(text)
        anonymized = text
        offset = 0
        for det in detections:
            replacement = self._pseudonymize(det.value)
            anonymized = (
                anonymized[:det.start + offset] + replacement + anonymized[det.end + offset:]
            )
            offset += len(replacement) - (det.end - det.start)
        return anonymized
    
    def re_identify(self, anonymized_text: str) -> str:
        result = anonymized_text
        for anon_id, original in self.reverse_map.items():
            result = result.replace(anon_id, original)
        return result


class PrivacyManager:
    """Complete privacy management pipeline."""
    
    def __init__(self):
        self.detector = PIIDetector()
        self.anonymizer = DataAnonymizer()
        self.audit_log: List[dict] = []
    
    def process_data(self, text: str, purpose: str, user_consent: bool = False) -> Dict:
        if not user_consent:
            self.audit_log.append({"action": "denied", "purpose": purpose, "timestamp": datetime.now().isoformat()})
            return {"processed": False, "reason": "no_consent"}
        
        detections = self.detector.detect(text)
        masked = self.detector.mask(text, detections)
        anonymized = self.anonymizer.anonymize_text(text, self.detector)
        
        self.audit_log.append({
            "action": "processed", "purpose": purpose,
            "pii_found": len(detections), "timestamp": datetime.now().isoformat()
        })
        
        return {
            "original_length": len(text),
            "detections": [{"type": d.entity_type, "confidence": d.confidence} for d in detections],
            "masked": masked,
            "anonymized": anonymized,
            "compliant": True
        }
```

### 30.4 Model Deployment Strategies

Deploying ML models to production requires careful rollout strategies to minimize risk and ensure reliability.

```python
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, List
import time
import random
import hashlib
from datetime import datetime
import uvicorn

app = FastAPI(title="Model Serving API", version="1.0.0")


class PredictionRequest(BaseModel):
    features: List[float]
    request_id: Optional[str] = None


class PredictionResponse(BaseModel):
    prediction: float
    model_version: str
    latency_ms: float
    request_id: str
    timestamp: str


class ModelRegistry:
    def __init__(self):
        self.models: Dict[str, object] = {}
        self.active_models: Dict[str, float] = {}
    
    def register(self, version: str, model: object, weight: float = 1.0):
        self.models[version] = model
        self.active_models[version] = weight
    
    def get_model(self, request_id: str = None) -> tuple:
        if request_id:
            hash_val = int(hashlib.md5(request_id.encode()).hexdigest()[:8], 16)
            idx = hash_val % 100
        else:
            idx = random.randint(0, 99)
        
        cumulative = 0.0
        for version, weight in self.active_models.items():
            cumulative += weight * 100
            if idx < cumulative:
                return version, self.models[version]
        return list(self.models.items())[-1]


class ABTestRouter:
    """Route traffic between model versions for A/B testing."""
    
    def __init__(self):
        self.registry = ModelRegistry()
        self.metrics: Dict[str, List[dict]] = {}
    
    def setup_ab_test(self, control_version: str, treatment_version: str, 
                      traffic_split: float = 0.5):
        self.registry.register(control_version, None, 1.0 - traffic_split)
        self.registry.register(treatment_version, None, traffic_split)
    
    def predict(self, request: PredictionRequest) -> PredictionResponse:
        start = time.time()
        version, _ = self.registry.get_model(request.request_id)
        time.sleep(random.uniform(0.001, 0.01))
        prediction = random.uniform(0.0, 1.0)
        latency = (time.time() - start) * 1000
        
        req_id = request.request_id or hashlib.md5(str(time.time()).encode()).hexdigest()[:8]
        
        if version not in self.metrics:
            self.metrics[version] = []
        self.metrics[version].append({
            "latency": latency, "prediction": prediction, "timestamp": datetime.now().isoformat()
        })
        
        return PredictionResponse(
            prediction=prediction, model_version=version,
            latency_ms=round(latency, 2), request_id=req_id,
            timestamp=datetime.now().isoformat()
        )


class CanaryDeployer:
    """Gradual canary deployment with automatic rollback."""
    
    def __init__(self, ab_tester: ABTestRouter):
        self.ab_tester = ab_tester
        self.canary_steps = [1, 5, 10, 25, 50, 100]
        self.current_step = 0
        self.health_checks: Dict[str, List[dict]] = {}
    
    def promote(self, version: str, control_version: str):
        if self.current_step < len(self.canary_steps):
            traffic = self.canary_steps[self.current_step] / 100.0
            self.ab_tester.registry.models[version] = None
            self.ab_tester.registry.models[control_version] = None
            self.ab_tester.registry.active_models = {
                control_version: 1.0 - traffic, version: traffic
            }
            print(f"Canary promoted: {version} now receiving {self.current_step + 1}% traffic")
            self.current_step += 1
            return True
        return False
    
    def check_health(self, version: str, error_rate: float, p99_latency: float) -> bool:
        if version not in self.health_checks:
            self.health_checks[version] = []
        
        healthy = error_rate < 0.05 and p99_latency < 500
        self.health_checks[version].append({
            "healthy": healthy, "error_rate": error_rate,
            "p99_latency": p99_latency, "timestamp": datetime.now().isoformat()
        })
        
        recent = self.health_checks[version][-5:]
        unhealthy_count = sum(1 for h in recent if not h["healthy"])
        
        if unhealthy_count >= 3:
            self.rollback(version)
            return False
        return True
    
    def rollback(self, version: str):
        print(f"ROLLBACK triggered for {version} — reverting to previous stable version")
        self.current_step = max(0, self.current_step - 2)


class ShadowDeployer:
    """Shadow mode: run new model alongside production without affecting users."""
    
    def __init__(self):
        self.results: List[dict] = []
    
    def shadow_predict(self, production_pred: float, shadow_pred: float, 
                       features: List[float], request_id: str):
        self.results.append({
            "request_id": request_id, "production": production_pred,
            "shadow": shadow_pred, "diff": abs(production_pred - shadow_pred),
            "features": features[:5], "timestamp": datetime.now().isoformat()
        })
    
    def get_comparison_report(self) -> dict:
        if not self.results:
            return {"message": "No shadow data collected"}
        
        diffs = [r["diff"] for r in self.results]
        return {
            "total_requests": len(self.results),
            "mean_absolute_diff": round(sum(diffs) / len(diffs), 4),
            "max_diff": round(max(diffs), 4),
            "p95_diff": round(sorted(diffs)[int(len(diffs) * 0.95)], 4),
            "recommendation": "Deploy to production" if sum(diffs) / len(diffs) < 0.05 else "Investigate discrepancies"
        }


router = ABTestRouter()
canary = CanaryDeployer(router)
shadow = ShadowDeployer()
```

### 30.5 Monitoring and Observability

Production ML systems require continuous monitoring for model drift, performance degradation, and data quality issues.

```python
import time
import json
from collections import deque
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime
import statistics


@dataclass
class Alert:
    severity: str
    message: str
    timestamp: str
    metric_name: str
    metric_value: float
    threshold: float


class ModelDriftDetector:
    """Detect data drift and concept drift using statistical tests."""
    
    def __init__(self, window_size: int = 1000):
        self.window_size = window_size
        self.reference_distribution: Optional[List[float]] = None
        self.current_window: deque = deque(maxlen=window_size)
    
    def set_reference(self, data: List[float]):
        self.reference_distribution = data
    
    def _ks_statistic(self, sample: List[float], reference: List[float]) -> float:
        all_values = sorted(set(sample + reference))
        max_diff = 0.0
        n_s, n_r = len(sample), len(reference)
        for val in all_values:
            f_sample = sum(1 for x in sample if x <= val) / n_s
            f_ref = sum(1 for x in reference if x <= val) / n_r
            max_diff = max(max_diff, abs(f_sample - f_ref))
        return max_diff
    
    def _psi(self, expected: List[float], actual: List[float], bins: int = 10) -> float:
        min_val = min(min(expected), min(actual))
        max_val = max(max(expected), max(actual))
        bin_edges = [min_val + i * (max_val - min_val) / bins for i in range(bins + 1)]
        expected_counts = [0] * bins
        actual_counts = [0] * bins
        for v in expected:
            idx = min(int((v - min_val) / (max_val - min_val) * (bins - 1)), bins - 1)
            expected_counts[idx] += 1
        for v in actual:
            idx = min(int((v - min_val) / (max_val - min_val) * (bins - 1)), bins - 1)
            actual_counts[idx] += 1
        psi = 0.0
        for e, a in zip(expected_counts, actual_counts):
            e_pct = max(e / len(expected), 0.001)
            a_pct = max(a / len(actual), 0.001)
            psi += (a_pct - e_pct) * (a_pct / e_pct)
        return psi
    
    def check_drift(self, new_value: float) -> dict:
        self.current_window.append(new_value)
        
        if self.reference_distribution is None or len(self.current_window) < 100:
            return {"drift_detected": False, "status": "collecting_baseline"}
        
        ks = self._ks_statistic(list(self.current_window), self.reference_distribution)
        psi = self._psi(self.reference_distribution, list(self.current_window))
        
        return {
            "drift_detected": psi > 0.2 or ks > 0.1,
            "ks_statistic": round(ks, 4),
            "psi": round(psi, 4),
            "psi_level": "significant" if psi > 0.2 else "moderate" if psi > 0.1 else "stable"
        }


class PerformanceMonitor:
    """Track model performance metrics over time with alerting."""
    
    def __init__(self, alert_callback: Callable = None):
        self.metrics: Dict[str, deque] = {
            "accuracy": deque(maxlen=10000),
            "latency": deque(maxlen=10000),
            "throughput": deque(maxlen=10000),
            "error_rate": deque(maxlen=10000),
        }
        self.alerts: List[Alert] = []
        self.alert_callback = alert_callback
        self.thresholds = {
            "accuracy_min": 0.85, "latency_max_ms": 500,
            "error_rate_max": 0.05, "throughput_min": 100,
        }
    
    def record_prediction(self, latency_ms: float, correct: bool = None, error: bool = False):
        self.metrics["latency"].append({"value": latency_ms, "ts": time.time()})
        if correct is not None:
            self.metrics["accuracy"].append({"value": 1.0 if correct else 0.0, "ts": time.time()})
        self.metrics["error_rate"].append({"value": 1.0 if error else 0.0, "ts": time.time()})
        self._check_thresholds()
    
    def _check_thresholds(self):
        recent_latency = [m["value"] for m in list(self.metrics["latency"])[-100:]]
        if recent_latency:
            p99 = sorted(recent_latency)[int(len(recent_latency) * 0.99)]
            if p99 > self.thresholds["latency_max_ms"]:
                self._fire_alert("high", "latency_p99_exceeded", p99, self.thresholds["latency_max_ms"])
        
        recent_errors = [m["value"] for m in list(self.metrics["error_rate"])[-100:]]
        if recent_errors:
            err_rate = sum(recent_errors) / len(recent_errors)
            if err_rate > self.thresholds["error_rate_max"]:
                self._fire_alert("critical", "error_rate_exceeded", err_rate, self.thresholds["error_rate_max"])
    
    def _fire_alert(self, severity: str, metric_name: str, value: float, threshold: float):
        alert = Alert(severity=severity, metric_name=metric_name,
                      metric_value=round(value, 4), threshold=threshold,
                      message=f"{metric_name}: {value:.4f} exceeds threshold {threshold}",
                      timestamp=datetime.now().isoformat())
        self.alerts.append(alert)
        if self.alert_callback:
            self.alert_callback(alert)
    
    def get_dashboard(self) -> dict:
        def stats(values):
            if not values:
                return {"mean": 0, "p50": 0, "p95": 0, "p99": 0, "min": 0, "max": 0}
            return {
                "mean": round(statistics.mean(values), 4),
                "p50": round(statistics.median(values), 4),
                "p95": round(sorted(values)[int(len(values) * 0.95)], 4),
                "p99": round(sorted(values)[int(len(values) * 0.99)], 4),
                "min": round(min(values), 4), "max": round(max(values), 4),
            }
        
        return {
            "latency": stats([m["value"] for m in self.metrics["latency"]]),
            "accuracy": stats([m["value"] for m in self.metrics["accuracy"]]),
            "error_rate": stats([m["value"] for m in self.metrics["error_rate"]]),
            "total_predictions": len(self.metrics["latency"]),
            "active_alerts": len([a for a in self.alerts if a.severity in ["high", "critical"]]),
            "timestamp": datetime.now().isoformat()
        }


class DataQualityMonitor:
    """Monitor input data quality for anomalies."""
    
    def __init__(self, expected_schema: Dict[str, type]):
        self.expected_schema = expected_schema
        self.stats: Dict[str, Dict] = {}
    
    def check_batch(self, batch: List[dict]) -> dict:
        issues = []
        for i, record in enumerate(batch):
            for field_name, field_type in self.expected_schema.items():
                if field_name not in record:
                    issues.append({"row": i, "field": field_name, "issue": "missing_field"})
                elif not isinstance(record[field_name], field_type):
                    issues.append({"row": i, "field": field_name, "issue": "wrong_type"})
        
        return {
            "total_records": len(batch),
            "issues_found": len(issues),
            "issues": issues[:20],
            "quality_score": round(1.0 - (len(issues) / (len(batch) * len(self.expected_schema))), 4)
        }
```

### 30.6 AI Governance Framework

Governance ensures AI systems are documented, auditable, and subject to human oversight throughout their lifecycle.

```python
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime
import json
import hashlib


@dataclass
class ModelCard:
    model_name: str
    version: str
    description: str
    intended_use: str
    training_data_description: str
    evaluation_metrics: Dict[str, float]
    limitations: List[str]
    ethical_considerations: List[str]
    fairness_assessment: Dict[str, float] = field(default_factory=dict)
    owner: str = ""
    last_updated: str = ""
    status: str = "draft"
    
    def to_markdown(self) -> str:
        limitations = "\n".join(f"- {l}" for l in self.limitations)
        ethical = "\n".join(f"- {e}" for e in self.ethical_considerations)
        metrics = "\n".join(f"| {k} | {v} |" for k, v in self.evaluation_metrics.items())
        fairness = "\n".join(f"| {k} | {v} |" for k, v in self.fairness_assessment.items())
        
        return f"""# Model Card: {self.model_name}

**Version:** {self.version}  
**Status:** {self.status}  
**Owner:** {self.owner}  
**Last Updated:** {self.last_updated}

## Description
{self.description}

## Intended Use
{self.intended_use}

## Training Data
{self.training_data_description}

## Evaluation Metrics
| Metric | Value |
|--------|-------|
{metrics}

## Fairness Assessment
| Metric | Value |
|--------|-------|
{fairness}

## Limitations
{limitations}

## Ethical Considerations
{ethical}

## Contact
{self.owner} — {self.last_updated}
"""


class AuditTrail:
    """Immutable audit log for model decisions and governance actions."""
    
    def __init__(self):
        self.entries: List[dict] = []
    
    def log(self, action: str, actor: str, details: dict, previous_hash: str = "0" * 64):
        entry = {
            "action": action, "actor": actor, "details": details,
            "timestamp": datetime.now().isoformat(),
            "previous_hash": previous_hash
        }
        entry_str = json.dumps(entry, sort_keys=True)
        entry["hash"] = hashlib.sha256(entry_str.encode()).hexdigest()
        self.entries.append(entry)
        return entry["hash"]
    
    def verify_integrity(self) -> bool:
        for i in range(1, len(self.entries)):
            if self.entries[i]["previous_hash"] != self.entries[i-1]["hash"]:
                return False
        return True
    
    def query(self, action_filter: str = None, actor_filter: str = None) -> List[dict]:
        results = self.entries
        if action_filter:
            results = [e for e in results if e["action"] == action_filter]
        if actor_filter:
            results = [e for e in results if e["actor"] == actor_filter]
        return results


class HumanInTheLoop:
    """Manage human review and approval workflows for AI decisions."""
    
    def __init__(self, audit: AuditTrail):
        self.audit = audit
        self.pending_reviews: Dict[str, dict] = {}
        self.approved_by: Dict[str, str] = {}
    
    def submit_for_review(self, decision_id: str, prediction: dict, 
                          confidence: float, context: str = "") -> str:
        if confidence < 0.7:
            review_entry = {
                "decision_id": decision_id, "prediction": prediction,
                "confidence": confidence, "context": context,
                "status": "pending", "submitted_at": datetime.now().isoformat()
            }
            self.pending_reviews[decision_id] = review_entry
            self.audit.log("review_requested", "system", {"decision_id": decision_id, "confidence": confidence})
            return decision_id
        return "auto_approved"
    
    def approve(self, decision_id: str, reviewer: str, notes: str = "") -> bool:
        if decision_id in self.pending_reviews:
            self.pending_reviews[decision_id]["status"] = "approved"
            self.pending_reviews[decision_id]["reviewer"] = reviewer
            self.approved_by[decision_id] = reviewer
            self.audit.log("decision_approved", reviewer, {"decision_id": decision_id, "notes": notes})
            return True
        return False
    
    def reject(self, decision_id: str, reviewer: str, reason: str) -> bool:
        if decision_id in self.pending_reviews:
            self.pending_reviews[decision_id]["status"] = "rejected"
            self.pending_reviews[decision_id]["rejection_reason"] = reason
            self.audit.log("decision_rejected", reviewer, {"decision_id": decision_id, "reason": reason})
            return True
        return False
    
    def get_pending(self) -> List[dict]:
        return [r for r in self.pending_reviews.values() if r["status"] == "pending"]


class GovernanceFramework:
    """Complete AI governance orchestrator."""
    
    def __init__(self, model_name: str, version: str, owner: str):
        self.audit = AuditTrail()
        self.human_review = HumanInTheLoop(self.audit)
        self.model_card = ModelCard(
            model_name=model_name, version=version, owner=owner,
            description="", intended_use="", training_data_description="",
            evaluation_metrics={}, limitations=[], ethical_considerations=[],
            last_updated=datetime.now().isoformat()
        )
        self.audit.log("model_registered", "system", {"model": model_name, "version": version})
    
    def update_model_card(self, updates: dict):
        for key, value in updates.items():
            if hasattr(self.model_card, key):
                setattr(self.model_card, key, value)
        self.model_card.last_updated = datetime.now().isoformat()
        self.audit.log("model_card_updated", "system", {"updated_fields": list(updates.keys())})
    
    def get_model_card_markdown(self) -> str:
        return self.model_card.to_markdown()
    
    def request_approval(self, decision_id: str, prediction: dict, confidence: float) -> str:
        return self.human_review.submit_for_review(decision_id, prediction, confidence)
    
    def approve_decision(self, decision_id: str, reviewer: str) -> bool:
        return self.human_review.approve(decision_id, reviewer)
    
    def audit_report(self) -> dict:
        return {
            "total_events": len(self.audit.entries),
            "integrity_valid": self.audit.verify_integrity(),
            "pending_reviews": len(self.human_review.get_pending()),
            "recent_actions": [e["action"] for e in self.audit.entries[-10:]],
            "model_card_status": self.model_card.status
        }


gov = GovernanceFramework("customer-churn-predictor", "2.1.0", "ML Engineering Team")
gov.update_model_card({
    "description": "Predicts customer churn probability based on usage patterns and support history.",
    "intended_use": "Internal retention team — not for automated account closure.",
    "training_data_description": "12 months of anonymized customer data, 500K records.",
    "evaluation_metrics": {"auc_roc": 0.92, "precision": 0.88, "recall": 0.85, "f1": 0.86},
    "limitations": [
        "Performance degrades for customers with < 30 days of history",
        "Not validated for enterprise accounts",
        "Seasonal patterns not fully captured"
    ],
    "ethical_considerations": [
        "Must not be used to auto-suspend accounts",
        "Human review required for high-value accounts",
        "Bias audit conducted quarterly"
    ],
    "fairness_assessment": {"demographic_parity_diff": 0.03, "equalized_odds_diff": 0.05},
    "status": "approved"
})

print(gov.get_model_card_markdown()[:500])
print("Governance report:", gov.audit_report())
```

### Module 30 Use Cases

| Use Case | Principle | Industry | Benefit |
|----------|-----------|----------|---------|
| **Hiring Model Audit** | Fairness + Bias Mitigation | HR / Recruitment | Detect and correct gender/racial bias in resume screening |
| **Chatbot Guardrails** | Safety + Content Filtering | Customer Service | Block prompt injection and harmful content generation |
| **Patient Data Processing** | Privacy + GDPR Compliance | Healthcare | Anonymize patient records before ML training |
| **Model Rollout Control** | Deployment + Canary | Fintech | Gradual release with automatic rollback on errors |
| **Drift Detection Pipeline** | Monitoring + Observability | E-commerce | Detect when recommendation model accuracy degrades |
| **AI Decision Audit** | Governance + Human Review | Government | Track and approve all AI-driven policy decisions |
| **Bias Monitoring Dashboard** | Responsible AI + Accountability | Banking | Continuous fairness monitoring for credit scoring models |

### Module 30 Project Ideas

1. **AI Fairness Audit Toolkit** — Build a pipeline that takes a trained model and dataset, runs fairness metrics across protected groups, applies mitigation strategies (reweighting, threshold adjustment), and generates a compliance report with before/after comparisons.

2. **LLM Safety Proxy** — Create a middleware layer that sits between users and an LLM API, performing input validation (prompt injection detection, PII masking), output filtering (toxicity, hallucination flagging), and logging all interactions to an immutable audit trail.

3. **ML Monitoring Dashboard** — Deploy a real-time monitoring system that tracks model latency, error rates, data drift (PSI/KS tests), and prediction distributions. Include configurable alerting and a human-in-the-loop review queue for low-confidence predictions.

---

*Course Complete — All 30 Modules* 🎓



---



# COMPLETE PROGRAM SUMMARY

| Course | Modules | Key Topics | Hours |
|--------|---------|-----------|-------|
| Course 1 | 1-12 | Data Science with Python, ML Fundamentals | 80+ |
| Course 2 | 13-16 | Data Visualization, Plotly, Dash, Streamlit | 40+ |
| Course 3 | 17-20 | Advanced ML, NLP, Time Series, Deployment | 60+ |
| Course 4 | 21-25 | Deep Learning, CNNs, RNNs, GANs, Transformers | 80+ |
| Course 5 | 26-30 | NLP, GenAI, LLMs, RAG, Prompt Engineering | 80+ |

**Total Program Duration:** 340+ Hours

---

*This content is part of the Edureka Generative AI Masters Program.*
*For more information, visit edureka.co*