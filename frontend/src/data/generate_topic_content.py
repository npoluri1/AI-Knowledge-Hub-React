#!/usr/bin/env python3
"""Generate topicContent.js with enhanced content for every topic."""

import json, re, os

# All topics with their why + code content
TOPICS = {}

def add(why, code):
    """Register a topic."""
    pass  # Placeholder - we build the dict below

# ============================================================
# SETUP & RUNTIME
# ============================================================
TOPICS["Installing Python & PATH"] = {
    "why": "Without Python installed and PATH configured, every development command fails with 'command not found'. PATH tells your OS where to find the python executable, pip, and virtual environment scripts. This is the absolute first step before writing any Python code.",
    "code": """# Check Python installation
python --version          # Python 3.12.3
pip --version             # pip 24.0

# Verify PATH includes Python
where python              # Windows
which python3             # macOS/Linux

# Install packages globally (avoid in production)
pip install requests

# Create and run your first script
# hello.py
print("Hello, World!")

python hello.py
# Hello, World!

# Check which Python you're actually running
import sys
print(sys.executable)
print(sys.version_info)"""
}

TOPICS["REPL vs scripts vs notebooks"] = {
    "why": "Choosing the wrong execution environment wastes hours. The REPL is fastest for testing one-liners and exploring APIs. Scripts are essential for repeatable automation. Notebooks excel at data analysis with visual output. Professionals use all three daily.",
    "code": """# REPL: Interactive exploration (type python in terminal)
>>> 2 + 2
4
>>> [x**2 for x in range(5)]
[0, 1, 4, 9, 16]

# Script: Save as .py file for repeatable execution
# app.py
import json
from pathlib import Path

data = {"users": [{"name": "Alice", "role": "admin"}]}
Path("output.json").write_text(json.dumps(data, indent=2))
print("Saved output.json")

# Jupyter Notebook: Mixed code + markdown + visuals
# %pip install matplotlib
# import matplotlib.pyplot as plt
# plt.plot([1, 4, 9, 16]); plt.show()

# Run script from command line
# python app.py"""
}

TOPICS["venv virtual environments"] = {
    "why": "Without virtual environments, installing packages globally causes version conflicts between projects. Project A needs requests==2.28 while Project B needs 2.31. venvs isolate each project's dependencies so they never clash.",
    "code": """# Create a virtual environment
python -m venv .venv

# Activate it (Windows)
.venv\\Scripts\\activate

# Activate it (macOS/Linux)
source .venv/bin/activate

# Verify isolation — pip is local to .venv
which pip    # points to .venv/bin/pip
pip list     # only shows base packages

# Install packages inside the venv
pip install requests flask

# Freeze dependencies for reproducibility
pip freeze > requirements.txt

# Deactivate when done
deactivate

# Recreate environment on another machine
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt"""
}

TOPICS["pip + requirements.txt"] = {
    "why": "Unpinned dependencies in requirements.txt mean your app breaks randomly when a dependency releases a breaking change. Pinning versions and using hashes ensures every developer and deployment runs identical code.",
    "code": """# Generate pinned requirements
pip freeze > requirements.txt

# Pin with hashes for supply-chain safety
pip install pip-tools
pip-compile requirements.in --generate-hashes -o requirements.txt

# Install with hash verification
pip install -r requirements.txt --require-hashes

# requirements.in (your loose deps)
# requests>=2.28
# flask>=3.0

# requirements.txt (compiled, pinned)
# requests==2.31.0 --hash=sha256:abc123...
# flask==3.0.2    --hash=sha256:def456...

# Upgrade one package
pip-compile --upgrade-package requests requirements.in"""
}

TOPICS["pyproject.toml modern packaging"] = {
    "why": "setup.py is legacy and verbose. pyproject.toml is the PEP 621 standard. One file for metadata, dependencies, build config, and tool settings. Every new Python project should use it.",
    "code": """# pyproject.toml - single source of truth
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "myapp"
version = "1.0.0"
description = "My awesome tool"
requires-python = ">=3.10"
dependencies = [
    "requests>=2.28",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy"]

[project.scripts]
myapp = "myapp.cli:main"

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.mypy]
strict = true

# Build and install
# pip install -e .           (editable/development install)
# pip install -e ".[dev]"    (with dev dependencies)
# python -m build            (create sdist + wheel)"""
}

TOPICS["uv / poetry / pipenv"] = {
    "why": "pip is slow and doesn't resolve dependency conflicts well. uv (Rust-based) is 10-100x faster, Poetry handles lockfiles and publishing, Pipenv combines venv+pip. Choosing the right tool saves minutes per install cycle.",
    "code": """# uv - fastest (Rust-based, drop-in pip replacement)
uv pip install requests
uv pip compile requirements.in -o requirements.txt
uv venv && uv pip install -r requirements.txt

# Poetry - full project management + lockfile
poetry new myproject
cd myproject
poetry add requests
poetry add --group dev pytest ruff
poetry install
poetry run python -m pytest

# Pipenv - combines venv + pip + Pipfile
pip install pipenv
pipenv install requests
pipenv install --dev pytest
pipenv run python app.py

# Lockfile comparison:
# uv:    requirements.txt (compiled)
# poetry: poetry.lock
# pipenv: Pipfile.lock"""
}

TOPICS["python -m module"] = {
    "why": "Running 'python -m module' ensures you use the correct Python interpreter's version of a module. Running 'python script.py' might use a different interpreter. This prevents 'module not found' bugs in multi-Python setups.",
    "code": """# Run stdlib modules directly
python -m json.tool data.json       # pretty-print JSON
python -m http.server 8000          # serve current directory
python -m venv .venv                # create virtual env
python -m pip install requests      # explicit pip invocation

# Run packages with __main__.py
python -m zipfile -c archive.zip file1.py file2.py

# Run your own packages
# mypackage/
#   __init__.py
#   __main__.py    <- python -m mypackage runs this

def main():
    print("Package executed as script")

if __name__ == "__main__":
    main()

# python -m mypackage -> "Package executed as script\""""
}

TOPICS["__name__ == '__main__'"] = {
    "why": "Without this guard, importing a module runs all top-level code including test data and print statements. This idiom makes modules both importable libraries AND runnable scripts.",
    "code": """# calculator.py
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

# This code runs ONLY when executed directly
if __name__ == "__main__":
    print(add(2, 3))           # 5
    print(multiply(4, 5))      # 20

# When imported: from calculator import add
# -> prints 3, NO test code runs

# When executed: python calculator.py
# -> prints 5 and 20

# Common pattern for CLI tools
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python tool.py <filename>")
        sys.exit(1)
    process(sys.argv[1])

if __name__ == "__main__":
    main()"""
}

TOPICS["sys.path & import resolution order"] = {
    "why": "Python searches sys.path in order and runs the FIRST match. If your local file shadows a stdlib module (e.g. naming a file 'random.py'), your code imports the wrong module. Understanding import order prevents hours of debugging.",
    "code": """import sys

# Import resolution order:
# 1. sys.modules cache (already imported)
# 2. Built-in modules (sys, os, etc.)
# 3. sys.path[0] - script directory or CWD
# 4. sys.path[1:] - site-packages, PYTHONPATH, etc.

print("Import search order:")
for i, p in enumerate(sys.path[:5]):
    print(f"  [{i}] {p}")

# Danger: local file shadows stdlib
# If you create 'email.py' in your project:
# import email  <- imports YOUR file, not stdlib!

# Fix: use absolute imports explicitly
import email.mime.text  # stdlib email

# Manipulate path at runtime
sys.path.insert(0, "/custom/lib")
import mymodule  # now finds mymodule in /custom/lib"""
}

TOPICS[".pyc bytecode & __pycache__"] = {
    "why": "CPython compiles .py files to .pyc bytecode in __pycache__ for faster imports. Understanding this explains mysterious stale-code bugs after edits and why deleting __pycache__ fixes them.",
    "code": """# CPython automatically compiles .py -> .pyc
# __pycache__/
#   module.cpython-312.pyc   (Python 3.12 bytecode)

# Force bytecode compilation without execution
python -m py_compile module.py

# Compile entire package
python -m compileall mypackage/ -q

# Bytecode version is Python-specific
# .cpython-312.pyc won't work on Python 3.11

# Stale bytecode causes bugs:
# 1. Edit module.py
# 2. __pycache__/module.cpython-312.pyc is stale
# 3. Sometimes Python uses stale .pyc
# Fix: delete __pycache__ or use -B flag
python -B script.py              # skip .pyc generation
PYTHONDONTWRITEBYTECODE=1 python script.py  # env var"""
}

TOPICS["GIL basics"] = {
    "why": "The Global Interpreter Lock prevents true parallel execution of Python threads for CPU-bound work. If you write multi-threaded code for CPU tasks without knowing about GIL, your code runs SLOWER than single-threaded due to lock contention.",
    "code": """import threading, time

# GIL prevents true CPU parallelism in threads
def cpu_bound(n):
    total = 0
    for i in range(n):
        total += i * i
    return total

# Sequential
t0 = time.perf_counter()
r1 = cpu_bound(50_000_000)
r2 = cpu_bound(50_000_000)
seq = time.perf_counter() - t0
print(f"Sequential: {seq:.2f}s")

# Threaded - NOT faster due to GIL!
t0 = time.perf_counter()
t1 = threading.Thread(target=cpu_bound, args=(50_000_000,))
t2 = threading.Thread(target=cpu_bound, args=(50_000_000,))
t1.start(); t2.start()
t1.join(); t2.join()
thr = time.perf_counter() - t0
print(f"Threaded:   {thr:.2f}s  # often SLOWER!")

# Use multiprocessing for CPU parallelism
from concurrent.futures import ProcessPoolExecutor
t0 = time.perf_counter()
with ProcessPoolExecutor(2) as ex:
    f1 = ex.submit(cpu_bound, 50_000_000)
    f2 = ex.submit(cpu_bound, 50_000_000)
    f1.result() + f2.result()
mp = time.perf_counter() - t0
print(f"Multiprocess: {mp:.2f}s  # ~2x faster!")"""
}

TOPICS["Editors: VS Code/PyCharm"] = {
    "why": "A proper IDE with debugger, linter, and autocomplete catches errors before runtime. Switching from notepad to a configured IDE typically doubles development speed within a week.",
    "code": """# VS Code settings.json (project/.vscode/settings.json)
{
  "python.defaultInterpreterPath": ".venv/Scripts/python.exe",
  "python.analysis.typeCheckingMode": "basic",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true
  }
}

# launch.json - debug configuration
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "debugpy",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    }
  ]
}

# Install extensions:
# - Python (ms-python)
# - Ruff (charliermarsh.ruff)
# - Pylance (ms-python.vscode-pylance)"""
}

print(f"Setup: {len(TOPICS)} topics registered")
print("Now generating the JS file...")

# Write the JavaScript file
out_path = os.path.join(os.path.dirname(__file__), "topicContent.js")

with open(out_path, "w", encoding="utf-8") as f:
    f.write('// Detailed "why you need this" explanations and code examples for every topic.\n')
    f.write('// Key = topic name (text before "::" in pythonMasterHubData.js)\n\n')
    f.write('export const TOPIC_CONTENT = {\n')
    
    items = list(TOPICS.items())
    for i, (key, val) in enumerate(items):
        # Escape backticks in code
        code_escaped = val["code"].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        why_escaped = val["why"].replace("\\", "\\\\").replace('"', '\\"')
        
        f.write(f'  "{key}": {{\n')
        f.write(f'    why: "{why_escaped}",\n')
        f.write(f'    code: `{code_escaped}`\n')
        f.write(f'  }}')
        if i < len(items) - 1:
            f.write(',')
        f.write('\n')
    
    f.write('};\n')

print(f"Written {len(TOPICS)} topics to {out_path}")
