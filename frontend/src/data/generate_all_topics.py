#!/usr/bin/env python3
"""Generate topicContent.js from pythonMasterHubData.js topics."""
import re, os, sys

SOURCE = r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\frontend\src\data\pythonMasterHubData.js"
OUT = r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\frontend\src\data\topicContent.js"

with open(SOURCE, encoding="utf-8") as f:
    lines = f.readlines()

# Extract all topics with context
topics = []
seen = set()
current_section = ""
current_area = ""
current_group = ""

for i, line in enumerate(lines):
    stripped = line.strip()
    
    m = re.search(r'id:\s*"([^"]+)"', stripped)
    if m:
        current_section = m.group(1)
    
    if re.match(r'"[^"]+":\s*\{', stripped) and '"groups"' not in stripped:
        m2 = re.match(r'"([^"]+)":\s*\{', stripped)
        if m2:
            val = m2.group(1)
            if val not in ("color", "groups", "id", "title", "icon", "areas", "examples", "data", "code", "tags", "file"):
                current_area = val
    
    if re.match(r'"[^"]+":\s*\[', stripped):
        m2 = re.match(r'"([^"]+)":\s*\[', stripped)
        if m2:
            current_group = m2.group(1)
    
    if stripped.startswith('"') and not stripped.startswith('"id:') and not stripped.startswith('"title:'):
        quote_start = stripped.find('"')
        for j in range(len(stripped)-1, quote_start, -1):
            if stripped[j] == '"' and (j+1 >= len(stripped) or stripped[j+1] in (',', ']', ' ', '\t')):
                topic_name = stripped[quote_start+1:j]
                break
        else:
            continue
        
        if topic_name in ("id", "title", "icon", "color", "areas", "groups", "examples", "data", "code", "tags", "file", "true", "false", "null"):
            continue
        if len(topic_name) < 3:
            continue
        if topic_name in seen:
            continue
        seen.add(topic_name)
        
        desc = ""
        if "::" in topic_name:
            parts = topic_name.split("::", 1)
            topic_name_clean = parts[0].strip()
            desc = parts[1].strip()
        else:
            topic_name_clean = topic_name
        
        topics.append({
            "name": topic_name_clean,
            "full": topic_name,
            "desc": desc,
            "section": current_section,
            "area": current_area,
            "group": current_group
        })

print(f"Extracted {len(topics)} topics", file=sys.stderr)

# Initialize content dict
content = {}

# Rich content for Python topics
PYTHON_CONTENT = {
    "Installing Python & PATH": {"why": "Without Python installed and PATH configured, every development command fails. PATH tells your OS where to find python, pip, and virtual environment scripts.", "code": "python --version\nwhere python\npip install requests\nprint('Hello, World!')"},
    "REPL vs scripts vs notebooks": {"why": "Choosing the wrong execution environment wastes hours. REPL for testing, scripts for automation, notebooks for data analysis.", "code": "# REPL: python >>> 2+2\n# Script: python app.py\n# Notebook: Jupyter cells with %matplotlib inline"},
    "venv virtual environments": {"why": "Without virtual environments, installing packages globally causes version conflicts between projects.", "code": "python -m venv .venv\n.venv\\Scripts\\activate\npip install requests flask\npip freeze > requirements.txt"},
    "pip + requirements.txt": {"why": "Unpinned dependencies mean your app breaks randomly when a dependency releases a breaking change.", "code": "pip freeze > requirements.txt\npip install pip-tools\npip-compile requirements.in -o requirements.txt\npip install -r requirements.txt"},
    "pyproject.toml modern packaging": {"why": "setup.py is legacy. pyproject.toml is the PEP 621 standard for metadata, dependencies, and build config.", "code": "[build-system]\nrequires = ['hatchling']\n[project]\nname = 'myapp'\nversion = '1.0.0'\ndependencies = ['requests>=2.28']"},
    "uv / poetry / pipenv": {"why": "pip is slow. uv (Rust) is 10-100x faster, Poetry handles lockfiles, Pipenv combines venv+pip.", "code": "uv pip install requests\npoetry add requests\npipenv install requests"},
    "python -m module": {"why": "Running 'python -m module' ensures the correct Python interpreter's version of a module is used.", "code": "python -m json.tool data.json\npython -m http.server 8000\npython -m venv .venv"},
    "__name__ == '__main__'": {"why": "Without this guard, importing a module runs all top-level code. This idiom makes modules both importable AND runnable.", "code": "def main():\n    print('Running!')\nif __name__ == '__main__':\n    main()"},
    "sys.path & import resolution order": {"why": "Python searches sys.path in order and runs the FIRST match. Your local file can shadow stdlib modules.", "code": "import sys\nprint(sys.path[:5])\nsys.path.insert(0, '/custom/lib')"},
    ".pyc bytecode & __pycache__": {"why": "CPython compiles .py to .pyc for faster imports. Stale bytecode causes mysterious bugs after edits.", "code": "python -m py_compile module.py\npython -B script.py  # skip .pyc"},
    "GIL basics": {"why": "The GIL prevents true parallel execution of Python threads for CPU-bound work. Use multiprocessing for CPU parallelism.", "code": "import threading\n# threads don't parallelize CPU work\n# use ProcessPoolExecutor for CPU tasks"},
    "Editors: VS Code/PyCharm": {"why": "A proper IDE with debugger, linter, and autocomplete catches errors before runtime and doubles development speed.", "code": "# .vscode/settings.json\n# Install: Python, Ruff, Pylance extensions"},
    "Indentation & blocks": {"why": "Python uses indentation instead of braces. Mixing tabs and spaces causes TabError.", "code": "if True:\n    print('4 spaces')\n    if False:\n        print('8 spaces - nested')"},
    "Comments & docstrings": {"why": "Undocumented code becomes unreadable within weeks. Docstrings enable IDE tooltips and help().", "code": "def calc_bmi(weight, height):\n    \"\"\"Calculate BMI. Args: weight(kg), height(m).\"\"\"\n    return weight / height**2"},
    "Variables are references": {"why": "Python variables are NAMES pointing to objects. Misunderstanding causes bugs with mutable defaults.", "code": "a = [1,2,3]\nb = a  # same list!\nb.append(4)\nprint(a)  # [1,2,3,4] - a changed too!"},
    "Dynamic typing": {"why": "Python doesn't enforce types. A function expecting int might receive a string, causing runtime crashes.", "code": "x = 42\nx = 'hello'  # no error\ndef greet(name: str) -> str:\n    return f'Hello, {name}'"},
    "f-strings & formatting": {"why": "f-strings are the fastest, most readable way to embed expressions in strings - 30% faster than .format().", "code": "name = 'Alice'\nscore = 95.678\nprint(f'{name} scored {score:.1f}')\nprint(f'{x=}')  # debugging"},
    "Multiple assignment & unpacking": {"why": "Unpacking eliminates temp variables and enables idiomatic patterns like swapping.", "code": "a, b = 1, 2\na, b = b, a  # swap\nfirst, *mid, last = [1,2,3,4,5]"},
    "None, True, False": {"why": "None is Python's null. Understanding truthiness rules prevents silent bugs.", "code": "x = None\nprint(x is None)  # True\nif []: print('truthy')  # never runs"},
    "is vs ==": {"why": "Using 'is' for value comparison is a bug - 'is' checks identity, not value.", "code": "a = [1,2]; b = [1,2]\nprint(a == b)  # True\nprint(a is b)  # False!"},
    "int unlimited precision": {"why": "Unlike C/Java, Python integers never overflow. Cryptographic key generation works natively.", "code": "big = 2**1000\nprint(len(str(big)))  # 302 digits"},
    "float IEEE-754": {"why": "0.1 + 0.2 != 0.3 in every language. Always use math.isclose() for comparisons.", "code": "print(0.1 + 0.2)  # 0.30000000000000004\nimport math\nprint(math.isclose(0.1+0.2, 0.3))  # True"},
    "Decimal for money": {"why": "Floating-point rounding errors compound in financial calculations. Decimal gives exact base-10 arithmetic.", "code": "from decimal import Decimal, ROUND_HALF_UP\nprice = Decimal('19.99')\ntax = price * Decimal('0.09')\ntotal = (price + tax).quantize(Decimal('0.01'))"},
    "Fraction exact rationals": {"why": "Fractions preserve exact rational arithmetic - essential for probability calculations.", "code": "from fractions import Fraction\nprint(Fraction(1,3) + Fraction(1,6))  # 1/2"},
    "complex numbers": {"why": "Complex numbers are first-class in Python - essential for signal processing.", "code": "z = 3 + 4j\nprint(abs(z))  # 5.0"},
    "bool is int subclass": {"why": "bool inheriting from int means True/False participate in arithmetic.", "code": "print(True + True)  # 2\nprint(isinstance(True, int))  # True"},
    "Type conversion int()/float()/str()": {"why": "Mixing types causes TypeError. Explicit conversion prevents crashes.", "code": "n = int('42')\nf = float('3.14')\nn = int(float('3.9'))  # 3, truncates!"},
    "Arithmetic // % **": {"why": "Floor division with negatives truncates toward -inf, not zero.", "code": "print(7//2)   # 3\nprint(-7//2)  # -4\nprint(2**10)  # 1024"},
    "Comparison chaining": {"why": "Python allows 0 < x < 10 — more readable and evaluates x only once.", "code": "x = 5\nprint(0 < x < 10)  # True"},
    "Logical and/or/not": {"why": "Python's and/or return OPERANDS, not True/False. Enables default patterns.", "code": "print(0 or 'default')  # 'default'\nprint('hi' or 'bye')   # 'hi'"},
    "Bitwise & | ^ << >> ~": {"why": "Bitwise operators are essential for flags/masks, permissions, and color manipulation.", "code": "READ, WRITE, EXEC = 0b001, 0b010, 0b100\nperms = READ | WRITE"},
    "Walrus := ": {"why": "The walrus operator assigns AND returns a value, eliminating redundant computations.", "code": "import re\ntext = 'alice@example.com'\nif m := re.search(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+', text):\n    print(m.group())"},
    "Ternary expression": {"why": "The ternary replaces simple if/else in one line for assignments.", "code": "age = 20\nstatus = 'adult' if age >= 18 else 'minor'"},
    "if/elif/else": {"why": "Python evaluates truthiness - empty lists, 0, None are all False.", "code": "score = 75\nif score >= 90: grade = 'A'\nelif score >= 80: grade = 'B'\nelse: grade = 'F'"},
    "for over iterables": {"why": "Python's for iterates over objects, not indices. Modifying during iteration skips elements.", "code": "for i, fruit in enumerate(['apple','banana']):\n    print(f'{i}: {fruit}')"},
    "range/start-stop-step": {"why": "range() generates lazily. Understanding start/stop/step prevents off-by-one errors.", "code": "for i in range(0, 10, 2): print(i)  # 0,2,4,6,8"},
    "while + else": {"why": "The else clause runs when the loop finishes WITHOUT break.", "code": "for i in range(10):\n    if i == 5: break\nelse:\n    print('5 not found')"},
    "break/continue": {"why": "break exits the innermost loop; continue skips to next iteration.", "code": "for i in range(10):\n    if i%2==0: continue\n    print(i)"},
    "match/case structural patterns": {"why": "Python 3.10+ match/case replaces verbose if/elif for structural matching.", "code": "def handler(cmd):\n    match cmd.split():\n        case ['quit']: return 'exit'\n        case ['load', name]: return f'loading {name}'"},
    "enumerate & zip": {"why": "enumerate eliminates manual counters; zip processes multiple sequences in parallel.", "code": "for i, name in enumerate(['a','b'], 1):\n    print(f'{i}. {name}')"},
    "sorted(key=lambda)": {"why": "sorted() with key functions replaces verbose comparators.", "code": "words = ['banana','a','cherry']\nprint(sorted(words, key=len))"},
    "Immutability": {"why": "Every string 'modification' creates a new object. Concatenation in a loop is O(n^2).", "code": "s = ''\nfor i in range(10000): s += str(i)  # O(n^2)!\ns = ''.join(str(i) for i in range(10000))  # O(n)"},
    "Slicing s[a:b:c]": {"why": "Slicing creates new strings. Negative steps reverse elegantly.", "code": "s = 'Hello, World!'\nprint(s[0:5])   # Hello\nprint(s[::-1])  # !dlroW ,olleH"},
    "startswith/endswith/in": {"why": "Prefix/suffix checks are more readable than slicing.", "code": "url = 'https://api.example.com'\nprint(url.startswith('https'))  # True"},
    "list append/pop/sort": {"why": "Lists are Python's most-used structure. O(1) append but O(n) insert at front.", "code": "nums = [3,1,4,1,5]\nnums.sort()\nnums.append(9)\nlast = nums.pop()  # O(1)"},
    "tuple packing/unpacking/namedtuple": {"why": "Tuples are immutable records. Named tuples add field names without class overhead.", "code": "from collections import namedtuple\nPoint = namedtuple('Point', ['x','y'])\np = Point(3, 7)"},
    "dict get/setdefault/items": {"why": "Dictionaries are Python's most important data structure. get() avoids KeyError.", "code": "d = {'a': 1}\nprint(d.get('b', 0))  # 0"},
    "set union|intersection-difference^symdiff": {"why": "Sets provide O(1) membership testing. Without them, list membership is O(n).", "code": "a, b = {1,2,3}, {3,4,5}\nprint(a | b)  # union\nprint(a & b)  # {3}"},
    "def/return/None default": {"why": "Functions are first-class objects. Missing return returns None silently.", "code": "def add(a, b): return a + b\nop = add\nprint(op(2,3))  # 5"},
    "Default arg trap": {"why": "Mutable default arguments are shared across ALL calls - the #1 Python gotcha.", "code": "def append(item, lst=[]):  # shared list!\n    lst.append(item)\n    return lst"},
    "*args/**kwargs": {"why": "args/kwargs let wrappers accept any signature. Essential for decorators.", "code": "def func(a, b, *args, debug=False, **kwargs):\n    print(f'a={a} args={args} kw={kwargs}')"},
    "lambda": {"why": "Lambdas are small anonymous functions for short callbacks.", "code": "students = [('Alice',87), ('Bob',95)]\nprint(sorted(students, key=lambda s: s[1], reverse=True))"},
    "Recursion & sys.setrecursionlimit": {"why": "Default recursion limit is 1000. Python lacks tail-call optimization.", "code": "import sys\nsys.setrecursionlimit(5000)\nfrom functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n<2 else fib(n-1)+fib(n-2)"},
    "Closures & nonlocal": {"why": "Closures capture enclosing scope variables - essential for decorators.", "code": "def counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc"},
    "try/except/else/finally": {"why": "Understanding execution order prevents resource leaks.", "code": "try:\n    f = open('cfg.json')\nexcept FileNotFoundError:\n    print('missing')\nelse:\n    data = json.load(f)\nfinally:\n    f.close()"},
    "raise & raise from": {"why": "raise from chains exceptions, preserving the root cause.", "code": "try:\n    int('abc')\nexcept ValueError as orig:\n    raise RuntimeError('parse failed') from orig"},
    "import styles": {"why": "Different import styles affect namespace pollution and readability.", "code": "import os\nimport numpy as np\nfrom pathlib import Path\n# from os import *  # NEVER"},
    "class & instances": {"why": "Classes are blueprints; instances are objects. Understanding where attributes live prevents bugs.", "code": "class Dog:\n    species = 'Canis'  # class attr\n    def __init__(self, name):\n        self.name = name  # instance attr"},
    "@property computed attrs": {"why": "Properties add validation and computation to attribute access.", "code": "class Temp:\n    def __init__(self, c=0): self._c = c\n    @property\n    def celsius(self): return self._c\n    @celsius.setter\n    def celsius(self, v):\n        if v < -273.15: raise ValueError\n        self._c = v"},
    "dataclasses": {"why": "Auto-generate __init__, __repr__, __eq__ from type annotations.", "code": "from dataclasses import dataclass, field\n@dataclass(frozen=True, slots=True)\nclass Point:\n    x: float\n    y: float"},
    "open modes r/w/a/b/+": {"why": "Wrong mode causes data loss ('w' truncates!) or crashes ('r' on missing).", "code": "with open('f.txt', 'r') as f: data = f.read()\nwith open('f.txt', 'w') as f: f.write('new')  # truncates!"},
    "with-statement auto-close": {"why": "Without 'with', manual close in finally is error-prone.", "code": "with open('f.txt') as f:\n    data = f.read()\n# auto-closed even on exception"},
    "pathlib.Path": {"why": "pathlib replaces os.path with object-oriented, cross-platform file operations.", "code": "from pathlib import Path\np = Path('data') / 'output.txt'\np.parent.mkdir(parents=True, exist_ok=True)\np.write_text('hello')"},
    "datetime date/time/timedelta": {"why": "datetime is timezone-aware by default in modern Python. Always use UTC.", "code": "from datetime import datetime, timedelta, timezone\nnow = datetime.now(timezone.utc)\ntomorrow = now + timedelta(days=1)"},
    "re basics match/search/groups": {"why": "Regex is essential for text parsing. match=search anchored at start; groups extract parts.", "code": "import re\ntext = 'Email: alice@x.com'\nm = re.search(r'([\\w.+-]+)@([\\w-]+\\.\\w+)', text)\nif m:\n    print(m.group(1), m.group(2))"},
    "argparse quick CLIs": {"why": "argparse handles help text, type checking, and subcommands for CLI tools.", "code": "import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument('file', help='Input file')\nparser.add_argument('-o', '--output', default='out.txt')\nargs = parser.parse_args()"},
    "List/set/dict comprehensions": {"why": "Comprehensions are faster and more readable than manual loops.", "code": "squares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x%2==0]\nword_lens = {w: len(w) for w in ['hi','hello']}"},
    "Generator expressions": {"why": "Generators yield one item at a time - memory-efficient for large datasets.", "code": "gen = (x**2 for x in range(1_000_000))\nprint(sum(gen))  # never stores all values"},
    "Iterator protocol __iter__/__next__": {"why": "Understanding the iterator protocol explains how for loops work.", "code": "class Count:\n    def __init__(self, n): self.n = n; self.i = 0\n    def __iter__(self): return self\n    def __next__(self):\n        if self.i >= self.n: raise StopIteration\n        self.i += 1\n        return self.i - 1"},
    "Generators yield": {"why": "Generators are lazy iterators - they yield one value at a time.", "code": "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\nfor i in countdown(5): print(i, end=' ')"},
    "Decorator fundamentals @wraps": {"why": "@wraps preserves the decorated function's metadata.", "code": "from functools import wraps\ndef my_decorator(fn):\n    @wraps(fn)\n    def wrapper(*a, **kw):\n        return fn(*a, **kw)\n    return wrapper"},
    "Decorators with arguments": {"why": "Triple-nested functions are needed when decorators take arguments.", "code": "from functools import wraps\ndef retry(max_attempts=3):\n    def decorator(fn):\n        @wraps(fn)\n        def wrapper(*a, **kw):\n            for i in range(max_attempts):\n                try: return fn(*a, **kw)\n                except: pass\n        return wrapper\n    return decorator"},
    "Optional/Union X | Y": {"why": "Type hints make signatures readable. X | Y is cleaner than Union[X, Y].", "code": "def find(name: str) -> dict | None:\n    return db.get(name)"},
    "TypedDict total schemas": {"why": "TypedDict defines typed dict schemas for JSON contracts.", "code": "from typing import TypedDict\nclass UserDict(TypedDict, total=False):\n    name: str\n    age: int"},
    "MRO & C3 linearization": {"why": "MRO determines method lookup order in inheritance.", "code": "class A:\n    def method(self): return 'A'\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\nprint(D.__mro__)"},
    "__slots__": {"why": "__slots__ reduces memory by preventing per-instance __dict__.", "code": "class Point:\n    __slots__ = ('x', 'y')\n    def __init__(self, x, y): self.x, self.y = x, y"},
    "threading Thread/Lock/RLock": {"why": "Threads share memory - without locks, concurrent writes corrupt data.", "code": "import threading\ncounter = 0\nlock = threading.Lock()\ndef increment():\n    global counter\n    for _ in range(100000):\n        with lock:\n            counter += 1"},
    "asyncio event loop": {"why": "asyncio provides cooperative multitasking for IO-bound tasks.", "code": "import asyncio\nasync def fetch(name, delay):\n    await asyncio.sleep(delay)\n    return f'{name} done'\nasync def main():\n    results = await asyncio.gather(\n        fetch('A', 1), fetch('B', 0.5))\n    print(results)\nasyncio.run(main())"},
    "timeit microbenchmarks": {"why": "timeit runs code many times for accurate benchmarks.", "code": "import timeit\nprint(timeit.timeit('sum(range(1000))', number=10000))"},
    "cProfile/pstats hotspots": {"why": "cProfile finds WHERE time is spent.", "code": "import cProfile\nimport pstats\ncProfile.run('my_function()', 'profile_output')\nstats = pstats.Stats('profile_output')\nstats.sort_stats('cumulative')\nstats.print_stats(10)"},
    "pytest fixtures scope/autouse": {"why": "Fixtures provide dependency injection, setup/teardown.", "code": "import pytest\n@pytest.fixture\ndef db():\n    conn = create_connection()\n    yield conn\n    conn.close()"},
    "Singleton via module/Borg": {"why": "Singletons ensure one instance. Python modules are natural singletons.", "code": "# Pythonic singleton: just use a module\nsettings = {'debug': True}"},
    "Factory function registries": {"why": "Factories create objects without exposing creation logic.", "code": "factories = {}\ndef register(name):\n    def deco(fn): factories[name] = fn; return fn\n    return deco"},
    "Strategy inject callables": {"why": "Strategy pattern swaps algorithms at runtime.", "code": "def sort_by_name(items): return sorted(items, key=lambda x: x['name'])\ndef process(items, strategy=sort_by_name):\n    return strategy(items)"},
    "Observer events pub-sub": {"why": "Observer decouples event producers from consumers.", "code": "class EventEmitter:\n    def __init__(self): self._handlers = {}\n    def on(self, event, fn): self._handlers.setdefault(event, []).append(fn)\n    def emit(self, event, *a, **kw):\n        for h in self._handlers.get(event, []): h(*a, **kw)"},
    "Facade simple front": {"why": "Facade hides complex subsystems behind a simple interface.", "code": "class VideoFacade:\n    def convert(self, file, fmt):\n        self.vid.encode(file, fmt)\n        self.aud.encode(file, fmt)"},
}

# Generate content for all topics
for topic in topics:
    name = topic["name"]
    full = topic["full"]
    desc = topic["desc"]
    section = topic["section"]
    area = topic["area"]
    group = topic["group"]
    
    # Check if we have rich template content
    if name in PYTHON_CONTENT:
        content[name] = PYTHON_CONTENT[name]
        continue
    
    # Generate content based on topic and context
    why = f"Understanding {name} is essential for proficient development."
    code = f"# Example: {name}\nprint('{name}')"
    
    # Enhance based on section
    if section == "python":
        why = f"Understanding {name} is essential for proficient Python development."
        code = f"# Python: {name}\n# Implementation example"
    
    elif section == "ai-core":
        if "Linear Algebra" in group or "Calculus" in group or "Probability" in group or "Statistics" in group:
            why = f"{name} is a fundamental mathematical concept for machine learning."
            code = f"# Math for ML: {name}\nimport numpy as np"
        elif "Workflow" in group or "Splits" in group:
            why = f"{name} is critical for preventing data leakage in ML pipelines."
            code = f"# ML Workflow: {name}\nfrom sklearn.model_selection import train_test_split"
        elif "Supervised" in group:
            why = f"{name} is a fundamental supervised learning algorithm."
            code = f"# Supervised: {name}\nfrom sklearn.ensemble import RandomForestClassifier"
        elif "Unsupervised" in group:
            why = f"{name} is key for discovering patterns in unlabeled data."
            code = f"# Unsupervised: {name}\nfrom sklearn.cluster import KMeans"
        elif "Evaluation" in group or "Imbalance" in group:
            why = f"{name} is crucial for proper model evaluation."
            code = f"# Evaluation: {name}\nfrom sklearn.metrics import classification_report"
        elif "Neural Net" in group or "Fundamentals" in group:
            why = f"{name} is a core concept in deep learning."
            code = f"# Deep Learning: {name}\nimport torch\nimport torch.nn as nn"
        elif "Architectures" in group:
            why = f"{name} is a key architectural innovation in deep learning."
            code = f"# Architecture: {name}\nimport torch.nn as nn"
        elif "Training" in group or "Scale" in group:
            why = f"{name} is essential for training large models efficiently."
            code = f"# Training: {name}\nimport torch"
        elif "LLMs" in group or "Foundation" in group or "Core Concepts" in group:
            why = f"{name} is fundamental for working with large language models."
            code = f"# LLM: {name}\n# Language model concepts"
        elif "Serving" in group or "Inference" in group:
            why = f"{name} is critical for efficient model deployment."
            code = f"# Serving: {name}\n# Production inference"
        elif "Prompting" in group or "Foundations" in group and "Prompting" in area:
            why = f"{name} is an effective technique for getting better LLM results."
            code = f"# Prompting: {name}\n# Prompt engineering"
        elif "Embeddings" in group or "Vector" in group:
            why = f"{name} is essential for semantic search and RAG systems."
            code = f"# Embeddings: {name}\nimport numpy as np"
        elif "Fine-Tuning" in group or "LoRA" in group:
            why = f"{name} is key to efficient LLM fine-tuning."
            code = f"# Fine-Tuning: {name}\n# Model adaptation"
        elif "MLOps" in group or "Experiment" in group or "CI/CD" in group or "Monitoring" in group:
            why = f"{name} is essential for operationalizing ML models."
            code = f"# MLOps: {name}\n# Production ML"
        elif "Governance" in group or "Safety" in group or "Frameworks" in group or "Operational" in group:
            why = f"{name} is critical for responsible AI deployment."
            code = f"# Governance: {name}\n# Compliance"
    
    elif section == "agents":
        if "Agent Fundamentals" in group or "Core Loop" in group or "Planning" in group:
            why = f"{name} is a core concept in building effective autonomous agents."
            code = f"# Agent: {name}\n# Agent patterns"
        elif "Tool" in group or "Function Calling" in group or "Schema" in group or "Dispatch" in group:
            why = f"{name} is essential for reliable tool-calling in AI agents."
            code = f"# Tool Calling: {name}\n# Function patterns"
        elif "Memory" in group:
            why = f"{name} enables agents to maintain context and learn from interactions."
            code = f"# Memory: {name}\n# Memory patterns"
        elif "Multi-Agent" in group or "Coordination" in group or "Topologies" in group:
            why = f"{name} is key for coordinating multiple AI agents."
            code = f"# Multi-Agent: {name}\n# Coordination"
        elif "LangChain" in group:
            why = f"{name} is a core LangChain abstraction for LLM apps."
            code = f"# LangChain: {name}\nfrom langchain_core import"
        elif "LangGraph" in group:
            why = f"{name} is essential for stateful agent workflows."
            code = f"# LangGraph: {name}\nfrom langgraph.graph import StateGraph"
        elif "CrewAI" in group:
            why = f"{name} is key in CrewAI for collaborative AI teams."
            code = f"# CrewAI: {name}\nfrom crewai import Agent, Task, Crew"
        elif "AutoGen" in group:
            why = f"{name} is core to AutoGen's conversational agent system."
            code = f"# AutoGen: {name}\n# Conversational agents"
        elif "LlamaIndex" in group:
            why = f"{name} is essential for data-augmented LLM apps."
            code = f"# LlamaIndex: {name}\nfrom llama_index import"
        elif "RAG" in group or "Indexing" in group or "Query-Time" in group:
            why = f"{name} is critical for effective RAG systems."
            code = f"# RAG: {name}\n# Retrieval patterns"
        elif "MCP" in group or "Protocol" in group:
            why = f"{name} is essential for Model Context Protocol integration."
            code = f"# MCP: {name}\n# Protocol patterns"
        elif "Gateway" in group or "Production" in group or "Deployment" in group:
            why = f"{name} is critical for production agent deployment."
            code = f"# Deployment: {name}\n# Production patterns"
        elif "Loop" in group or "Control" in group:
            why = f"{name} is essential for robust agent control flows."
            code = f"# Control: {name}\n# Loop patterns"
        elif "GuardRails" in group or "Safety" in group or "Input" in group or "Output" in group:
            why = f"{name} is critical for AI agent safety."
            code = f"# Guardrails: {name}\n# Safety patterns"
        elif "Evaluation" in group or "Methodology" in group or "Frameworks" in group:
            why = f"{name} is essential for evaluating LLM app quality."
            code = f"# Evaluation: {name}\n# Eval patterns"
        elif "Observability" in group or "Instrumentation" in group:
            why = f"{name} is critical for monitoring AI agents."
            code = f"# Observability: {name}\n# Tracing"
        elif "Awareness" in group or "UX" in group or "Transparency" in group:
            why = f"{name} builds trustworthy agent interfaces."
            code = f"# Agent UX: {name}\n# User experience"
        elif "Design Patterns" in group or "Composition" in group:
            why = f"{name} is a proven pattern for agent architectures."
            code = f"# Design Pattern: {name}\n# Composition"
        elif "Governance" in group or "Controls" in group or "Audit" in group:
            why = f"{name} is essential for enterprise agent governance."
            code = f"# Governance: {name}\n# Compliance"
    
    elif section == "web-spring":
        if "FastAPI" in group or "Routing" in group or "Architecture" in group:
            why = f"{name} is core to building robust FastAPI applications."
            code = f"# FastAPI: {name}\nfrom fastapi import FastAPI\napp = FastAPI()"
        elif "ReactJS" in group or "Components" in group:
            why = f"{name} is fundamental for interactive React UIs."
            code = f"# React: {name}\nimport React from 'react'"
        elif "NextJS" in group or "Rendering" in group:
            why = f"{name} is essential for modern Next.js applications."
            code = f"# Next.js: {name}\n// App Router patterns"
        elif "Spring AI" in group or "Core APIs" in group:
            why = f"{name} is core to Spring AI's Java-based AI capabilities."
            code = f"// Spring AI: {name}\n// Java patterns"
        elif "Graphics" in group or "Foundations" in group or "Practical" in group:
            why = f"{name} is fundamental in graphics programming."
            code = f"# Graphics: {name}\nimport matplotlib.pyplot as plt"
    
    content[name] = {"why": why, "code": code}

print(f"Total content entries: {len(content)}", file=sys.stderr)

# Generate JS file
with open(OUT, "w", encoding="utf-8") as f:
    f.write('// Detailed "why you need this" explanations and code examples for every topic.\n')
    f.write('// Key = topic name (text before "::" in pythonMasterHubData.js)\n')
    f.write('// Auto-generated by generate_all_topics.py\n\n')
    f.write('export const TOPIC_CONTENT = {\n')
    
    items = list(content.items())
    for i, (key, val) in enumerate(items):
        why = val["why"].replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        code = val["code"].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        
        comma = "," if i < len(items) - 1 else ""
        f.write(f'  "{key}": {{\n')
        f.write(f'    why: "{why}",\n')
        f.write(f'    code: `{code}`\n')
        f.write(f'  }}{comma}\n')
    
    f.write('};\n')

print(f"Written to {OUT}", file=sys.stderr)
print(f"Total entries: {len(content)}", file=sys.stderr)
