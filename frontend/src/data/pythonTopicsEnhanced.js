export const PYTHON_TOPICS_ENHANCED = {
  // ============================================================
  // FOUNDATIONS (TIER 1) — Setup & Runtime
  // ============================================================
  "Installing Python & PATH": {
    why: "You need Python installed and accessible from any terminal to run scripts, install packages with pip, and use virtual environments. Without PATH configured, your OS won't find the python executable, causing 'command not found' errors in every development workflow.",
    code: `# Verify Python installation
python --version
# Python 3.12.3

# Check where Python is installed
import sys
print(sys.executable)
# C:\\Python312\\python.exe

# Install and verify pip
pip install --upgrade pip
pip --version

# Quick test: create and run a script
echo "print('Hello from Python!')" > test.py
python test.py
# Hello from Python!`
  },

  "REPL vs scripts vs notebooks": {
    why: "Choosing the right execution environment saves time. The REPL is fastest for testing one-liners and exploring APIs. Scripts are essential for repeatable automation. Notebooks excel at data analysis with visual output. Mixing them up wastes hours.",
    code: `# REPL: Interactive exploration (run python in terminal)
>>> import json
>>> json.dumps({"key": "value"})
'{"key": "value"}'

# Script: Repeatable automation (save as .py file)
import json
import pathlib

data = {"users": [{"name": "Alice", "role": "admin"}]}
pathlib.Path("output.json").write_text(json.dumps(data, indent=2))
print("Saved output.json")

# Notebook cell magic (in Jupyter):
# %timeit sum(range(1000))  # Benchmark inline
# !pip install requests    # Shell commands
# plt.plot([1,2,3])        # Inline visualization`
  },

  "venv virtual environments": {
    why: "Without virtual environments, all packages install globally and different projects fight over conflicting versions. A single pip install in the wrong place can break every other project on your machine. venvs give each project its own isolated Python packages.",
    code: `# Create a virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# Activate (macOS/Linux)
# source .venv/bin/activate

# Confirm isolation
which python   # .venv/bin/python
pip list       # only pip and setuptools

# Install project dependencies
pip install requests flask

# Save exact versions
pip freeze > requirements.txt

# Recreate environment on another machine
python -m venv .venv && .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt`
  },

  "pip + requirements.txt": {
    why: "Without pinning exact package versions, your code works on your machine but breaks on someone else's because they installed a different version. Unpinned dependencies cause non-reproducible builds and mysterious production bugs.",
    code: `# Generate pinned requirements (NEVER just export unpinned)
pip freeze > requirements.txt

# Good: pinned with hashes for supply-chain safety
pip install pip-tools
pip-compile requirements.in --generate-hashes

# Install from pinned file
pip install -r requirements.txt

# Upgrade one package with constraints
pip install --upgrade "requests>=2.31,<3"

# Audit for known vulnerabilities
pip install pip-audit
pip-audit

# requirements.in (your loose specs)
# requests>=2.31
# flask~=3.0
# sqlalchemy>2.0,<2.1`
  },

  "pyproject.toml modern packaging": {
    why: "pyproject.toml is the single config file for modern Python packaging, replacing setup.py, setup.cfg, and MANIFEST.in. Without it, your package cannot be installed with pip install . or published to PyPI, and your project looks outdated.",
    code: `# pyproject.toml — the modern single config file
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-app"
version = "1.4.2"
requires-python = ">=3.10"
dependencies = [
    "requests>=2.31",
    "click~=8.1",
]

[project.optional-dependencies]
dev = ["pytest>=7", "ruff", "mypy"]

[tool.ruff]
line-length = 100

[tool.mypy]
strict = true

# Build and install
# pip install .              (install project)
# pip install -e ".[dev]"    (editable with dev deps)
# hatch build                (create dist packages)`
  },

  "uv / poetry / pipenv": {
    why: "pip is slow and lacks lockfiles, so your teammate might get different dependency versions. Modern tools like uv, poetry, and pipenv solve this with deterministic lockfiles and faster installs. uv is 10-100x faster than pip, saving real minutes every install.",
    code: `# uv — the fastest option (Rust-based, 10-100x pip)
uv venv
uv pip install requests flask
uv pip compile requirements.in -o requirements.txt

# poetry — all-in-one packaging + dependencies
poetry init
poetry add requests flask
poetry add --group dev pytest ruff
poetry install
poetry run python main.py

# pipenv — original lockfile tool
pipenv install requests flask
pipenv install --dev pytest
pipenv run python main.py
pipenv lock   # generates Pipfile.lock

# Key difference: all three produce lockfiles
# pip + requirements.txt does NOT lock transitives`
  },

  "python -m module": {
    why: "Running python -m module instead of calling the script directly ensures you use the current interpreter's module, not a globally installed script. This prevents version mismatches where pip calls a different Python than expected.",
    code: `# Run modules as scripts — uses current interpreter
python -m pip install requests        # safe: uses THIS python's pip
python -m venv .venv                   # creates venv with this python
python -m http.server 8000             # one-line file server
python -m json.tool < data.json        # pretty-print JSON

# Compare with direct invocation (may find wrong install)
# pip install requests  -> might use /usr/bin/pip not your venv

# Run your own package modules
python -m mypackage.cli --help         # runs mypackage/cli.py

# Common stdlib modules usable as scripts
python -m zipfile -c archive.zip *.py  # create zip
python -m py_compile script.py         # syntax check
python -m timeit -n 1000 "sum(range(100))"
python -m pdb script.py                # debugger`
  },

  "__name__ == '__main__'": {
    why: "Without the if __name__ == '__main__' guard, code runs on import, not just on execution. When module A imports module B for its functions, module B's top-level test code crashes. This guard makes modules both importable and executable.",
    code: `# calculator.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# Without this guard, importing calculator.py
# would execute the test code below every time
if __name__ == '__main__':
    # This only runs when: python calculator.py
    # NOT when: from calculator import add
    print("Running self-tests...")
    assert add(2, 3) == 5
    assert subtract(10, 4) == 6
    print("All tests passed!")

# now others can safely import
# from calculator import add, subtract`
  },

  "sys.path & import resolution order": {
    why: "Python searches directories in sys.path order: script directory first, then PYTHONPATH, then site-packages. If you have a local file named json.py or email.py, it shadows the stdlib module, causing baffling import errors.",
    code: `import sys

# See the exact search order
for i, p in enumerate(sys.path):
    print(f"{i}: {p}")

# sys.path resolution order:
# 1. Script's directory (or '' for CWD in REPL)
# 2. PYTHONPATH directories
# 3. Standard library
# 4. site-packages (third-party)

# DANGER: local file shadows stdlib
# If you create "email.py" in your project:
#   import email  -> imports YOUR file, not stdlib!

# FIX: use absolute imports (Python 3 default)
from . import mymodule      # relative import within package
import mypackage.mymodule   # absolute import

# Debug import issues
import importlib
spec = importlib.util.find_spec("requests")
print(spec.origin)  # where it actually loads from`
  },

  ".pyc bytecode & __pycache__": {
    why: "CPython compiles .py files to .pyc bytecode in __pycache__ for faster startup. Stale .pyc files after code changes cause mysterious bugs where your changes seem ignored. Understanding this explains why deleting __pycache__ is a common fix.",
    code: `import py_compile
import importlib
import dis

# Compile a .py file to .pyc manually
py_compile.compile("main.py", cfile="__pycache__/main.cpython-312.pyc")

# Force recompile of all modules
import compileall
compileall.compile_dir("mypackage", force=True)

# See bytecode instructions for a function
def example(x):
    return x * 2 + 1

dis.dis(example)
#  LOAD_FAST    0 (x)
#  LOAD_CONST   2
#  BINARY_MULTIPLY
#  LOAD_CONST   1
#  BINARY_ADD
#  RETURN_VALUE

# Check if .pyc is stale
import os
py_mtime = os.path.getmtime("main.py")
pyc_mtime = os.path.getmtime("__pycache__/main.cpython-312.pyc")
print("Stale!" if pyc_mtime < py_mtime else "Fresh")`
  },

  "GIL basics": {
    why: "The Global Interpreter Lock prevents true parallel execution of Python threads for CPU-bound work. Developers waste days trying to speed up CPU-heavy code with threading, only to see no improvement or even slower performance. Understanding GIL tells you when to use multiprocessing instead.",
    code: `import threading
import multiprocessing
import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def cpu_bound(n):
    """CPU-heavy work — GIL blocks true parallelism here."""
    return sum(i * i for i in range(n))

# WRONG: Threading does NOT speed up CPU work (GIL)
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(cpu_bound, [10**7] * 4))
print(f"Threads: {time.perf_counter() - start:.2f}s")

# CORRECT: Multiprocessing bypasses the GIL
start = time.perf_counter()
with ProcessPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(cpu_bound, [10**7] * 4))
print(f"Processes: {time.perf_counter() - start:.2f}s")

# Threading IS good for I/O-bound work (network, files)
import urllib.request
def fetch(url):
    return urllib.request.urlopen(url).read()

urls = ["https://example.com"] * 20
with ThreadPoolExecutor(max_workers=20) as ex:
    pages = list(ex.map(fetch, urls))  # parallel I/O is fine`
  },

  "Editors: VS Code/PyCharm": {
    why: "Without a proper editor with debugger, linter, and type checker configured, you are debugging with print statements and reading error tracebacks in plain text. A configured IDE catches bugs before you run the code and lets you step through execution.",
    code: `# VS Code settings.json for Python
{
  "python.defaultInterpreterPath": ".venv/Scripts/python.exe",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.mypyEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "python.analysis.typeCheckingMode": "strict",
  "files.exclude": { "**/__pycache__": true }
}

# launch.json — debug config
{
  "version": "0.2.0",
  "configurations": [{
    "name": "Python: Current File",
    "type": "debugpy",
    "request": "launch",
    "program": "\${file}",
    "console": "integratedTerminal",
    "justMyCode": false
  }]
}

# Install essential extensions:
# ms-python.python, ms-python.pylint,
# ms-python.mypy-type-checker, ms-python.black-formatter`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Syntax Essentials
  // ============================================================
  "Indentation & blocks": {
    why: "Python uses indentation instead of braces to define code blocks. Mixing tabs and spaces causes TabError or, worse, subtle logic bugs where blocks don't execute as expected. PEP 8 mandates 4 spaces — follow it everywhere.",
    code: `# Correct: consistent 4-space indentation
def classify(score):
    if score >= 90:
        grade = "A"
    elif score >= 80:       # same level as if
        grade = "B"
    else:
        grade = "C"
    return grade             # outside the if/elif/else

# WRONG: mixing tabs and spaces -> TabError
# def bad():
# \tif True:    # tab
#     print("hi")  # spaces

# Multi-line with explicit continuation
result = (1 +
          2 +
          3)

# Or use backslash
total = 1 + \\
        2 + \\
        3`
  },

  "Comments & docstrings": {
    why: "Without docstrings, no one knows what your function expects or returns — including your future self. IDEs and tools like help() pull docstrings to show inline documentation. Comments explain WHY, docstrings explain WHAT.",
    code: `def calculate_discount(price: float, tier: str) -> float:
    """Apply loyalty discount based on customer tier.

    Args:
        price: Original price before discount.
        tier: Customer tier — "bronze", "silver", or "gold".

    Returns:
        Discounted price rounded to 2 decimal places.

    Raises:
        ValueError: If tier is not recognized.

    >>> calculate_discount(100.0, "gold")
    80.0
    """
    discounts = {"bronze": 0.05, "silver": 0.10, "gold": 0.20}
    if tier not in discounts:
        raise ValueError(f"Unknown tier: {tier}")
    return round(price * (1 - discounts[tier]), 2)

# Access docstrings programmatically
print(calculate_discount.__doc__)
help(calculate_discount)

# Module-level docstring (first string in file)
"""Billing module for invoice generation.

Handles PDF creation, tax calculation, and email delivery.
Part of the acme-corp billing system (v2.3+).
"""`
  },

  "Variables are references": {
    why: "Python variables are labels pointing to objects, not boxes holding values. Reassigning a variable doesn't change the original object — it moves the label. This causes bugs when developers assume a = b makes a copy.",
    code: `# Variables are names bound to objects
a = [1, 2, 3]
b = a           # b points to the SAME list object
b.append(4)
print(a)        # [1, 2, 3, 4] — a is affected!

# To actually copy, use .copy() or slicing
a = [1, 2, 3]
b = a.copy()    # new list object
b.append(4)
print(a)        # [1, 2, 3] — a is unchanged

# Immutable types "appear" to copy (but still reference)
x = 5
y = x
y += 1
print(x, y)    # 5 6 — ints are immutable, so y = y + 1 made a new int

# Verify identity with id()
a = [1, 2]
b = [1, 2]
print(id(a) == id(b))  # False — different objects
c = a
print(id(a) == id(c))  # True — same object

# Reassignment moves the name, doesn't change the object
x = [1, 2]
x = [3, 4]     # original [1,2] is now garbage-collected`
  },

  "Dynamic typing": {
    why: "Python doesn't enforce types at runtime, so a function expecting an int will silently accept a string until it crashes deep in execution. Type hints don't enforce at runtime but enable IDE autocompletion and mypy static analysis to catch bugs before running code.",
    code: `# Python is dynamically typed — no declaration needed
name = "Alice"     # str
name = 42          # now int — perfectly legal

# Type hints (PEP 485) — documentation, not enforcement
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

greet("Bob", 3)      # works
greet(42)            # no error at runtime! (but mypy catches it)

# Type hints are accessible at runtime
import typing
hints = typing.get_type_hints(greet)
print(hints)  # {'name': <class 'str'>, 'times': <class 'int'>, 'return': <class 'str'>}

# Use mypy for static checking (CI gate)
# $ mypy --strict mymodule.py
# error: Argument 1 to "greet" has incompatible type "int"; expected "str"`

  },

  "f-strings & formatting": {
    why: "Poorly formatted output makes debugging a nightmare and user-facing output unprofessional. f-strings are the fastest and most readable formatting method in Python. They also support debugging with the = suffix.",
    code: `import math

# Basic f-strings (Python 3.6+)
name = "Alice"
balance = 1234.567
print(f"Hello, {name}! Balance: ${balance:.2f}")
# Hello, Alice! Balance: $1234.57

# Debugging with = (Python 3.8+)
x = 42
print(f"{x = }")           # x = 42
print(f"{x * 2 = }")       # x * 2 = 84

# Alignment and padding
for label, val in [("Total", 99999), ("Tax", 1234), ("Net", 98765)]:
    print(f"{label:>10}: {val:>10,}")
#      Total:     99,999
#        Tax:      1,234
#        Net:     98,765

# Format spec mini-language
pi = math.pi
print(f"{pi:.4f}")         # 3.1416
print(f"{pi:>12.2e}")      #     3.14e+00
print(f"{255:#010x}")      # 0x000000ff`
  },

  "Multiple assignment & unpacking": {
    why: "Without unpacking, swapping variables requires a temp variable, and extracting dict/list values requires multiple lines. Unpacking makes code shorter, more readable, and avoids temporary variable mistakes.",
    code: `# Swap without temp variable
a, b = 10, 20
a, b = b, a
print(a, b)  # 20 10

# Unpack sequences
first, *middle, last = [1, 2, 3, 4, 5]
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5

# Dict unpacking
user = {"name": "Alice", "role": "admin", "id": 42}
{**user, "role": "superadmin"}  # {'name': 'Alice', 'role': 'superadmin', 'id': 42}

# Function return unpacking
def get_user():
    return {"name": "Bob", "age": 30}, True

user, success = get_user()

# Nested unpacking
(point_a, point_b), color = [(0, 0), (1, 1)], "red"
print(point_a, point_b, color)  # (0, 0) (1, 1) red`
  },

  "None, True, False": {
    why: "Using == None instead of is None can be fooled by objects with custom __eq__. Truthiness rules in Python mean empty collections, 0, and empty strings are falsy — forgetting this causes logic bugs in conditionals.",
    code: `# None is a singleton — always use 'is'
x = None
print(x == None)  # True (works by coincidence)
print(x is None)  # True (correct way — identity check)

# NEVER use == for None comparison
class Sneaky:
    def __eq__(self, other):
        return True  # lies about equality
print(Sneaky() == None)  # True! == is unreliable

# Truthiness rules (what Python considers falsy)
falsy_values = [None, False, 0, 0.0, 0j, "", [], {}, set(), (), frozenset()]
for val in falsy_values:
    assert not val, f"{val!r} is falsy"

# Everything else is truthy
truthy_values = [True, 1, -1, 3.14, "hello", [0], {"a": 1}]
for val in truthy_values:
    assert val, f"{val!r} is truthy"

# Practical: falsy check with short-circuit
items = []
result = items or [42]     # fallback to [42] if empty
print(result)              # [42]

# bool is int subclass
print(True + True)   # 2
print(False * 10)    # 0`
  },

  "is vs ==": {
    why: "Using is to compare values works by accident with small integers due to CPython interning but breaks unpredictably with larger values. is checks if two names point to the same object; == checks if values are equal.",
    code: `# == checks value equality
# is checks object identity (same memory address)

a = 256
b = 256
print(a is b)   # True — CPython interns small ints (-5 to 256)
print(a == b)   # True

a = 257
b = 257
print(a is b)   # False! CPython does NOT intern 257
print(a == b)   # True

# Same with strings
s1 = "hello"
s2 = "hello"
print(s1 is s2)  # True — CPython interns short strings

s1 = "hello world!"
s2 = "hello world!"
print(s1 is s2)  # False! longer strings may not be interned

# RULE: Always use 'is' for None, True, False (singletons)
# RULE: Always use '==' for value comparison
x = None
    if x is None: pass     # correct
# if x == None: pass   # works but wrong practice`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Numbers & Types
  // ============================================================
  "int unlimited precision": {
    why: "Unlike C/Java, Python ints have no maximum size. This means you can do cryptographic math, big-number computations, and counting beyond 2^63 without overflow. Forgetting this leads developers to use unnecessary third-party libraries.",
    code: `# Python ints have unlimited precision
big = 10 ** 100
print(big)
# 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

# Exact arithmetic (no rounding errors)
result = big + 1
print(result)
# 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001

# Bit operations on huge numbers
n = 2 ** 2048   # 2048-bit number (RSA-scale)
print(n.bit_length())  # 2049

# Binary/octal/hex literals
print(0b1111)    # 15
print(0o17)      # 15
print(0xff)      # 255

# Integer factorials work without overflow
import math
print(math.factorial(100))  # exact 158-digit number

# Conversions
print(int("42"))           # from string
print(int("ff", 16))      # from hex -> 255
print(int(3.9))            # truncates -> 3 (not 4!)`
  },

  "float IEEE-754": {
    why: "Floating-point numbers cannot represent 0.1 exactly in binary, causing 0.1 + 0.2 != 0.3. This causes bugs in financial calculations and equality checks. Developers must know to use math.isclose() for comparisons and Decimal for money.",
    code: `# The classic IEEE-754 gotcha
print(0.1 + 0.2)           # 0.30000000000000004
print(0.1 + 0.2 == 0.3)    # False!

# CORRECT: use math.isclose for float comparison
import math
print(math.isclose(0.1 + 0.2, 0.3))  # True
print(math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9))  # True

# Precision limits
print(f"{1.0 / 3:.20f}")   # 0.33333333333333331483...
print(2.2250738585072014e-308)  # smallest subnormal

# Overflow and underflow
import sys
print(sys.float_info.max)   # 1.7976931348623157e+308
print(sys.float_info.min)   # 2.2250738585072014e-308

# Never use == for float comparison in production
# WRONG: assert x == 3.14
# RIGHT: assert math.isclose(x, 3.14, abs_tol=0.01)

# For exact money, use Decimal (see next topic)`
  },

  "Decimal for money": {
    why: "Floating-point rounding errors compound in financial calculations, causing pennies to vanish or appear from nowhere. Banks and accounting systems use Decimal for exact decimal arithmetic with configurable rounding modes.",
    code: `from decimal import Decimal, getcontext, ROUND_HALF_UP

# Decimal: exact decimal arithmetic
price = Decimal("19.99")
tax_rate = Decimal("0.08")
tax = price * tax_rate
print(tax)            # 1.5992 (exact, not 1.5991999...)
print(price + tax)    # 21.5892

# NEVER pass floats to Decimal (inherits the error)
bad = Decimal(0.1)     # Decimal('0.1000000000000000055511151231257827021181583404541015625')
good = Decimal("0.1")  # Decimal('0.1') — exact

# Set precision and rounding
getcontext().prec = 28
getcontext().rounding = ROUND_HALF_UP

total = Decimal("100.00")
shares = Decimal("3")
per_share = total / shares
print(per_share)                # 33.33333333333333333333333333
print(per_share.quantize(Decimal("0.01")))  # 33.33 (banker's)

# Financial rounding for invoice line items
def round_money(amount: Decimal) -> Decimal:
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

print(round_money(Decimal("19.999")))  # 20.00`
  },

  "Fraction exact rationals": {
    why: "When you need exact fractional arithmetic (like 1/3 + 1/6 = 1/2), floats give 0.4999... and Decimals add complexity. Fractions give mathematically exact results with zero precision loss.",
    code: `from fractions import Fraction

# Exact rational arithmetic
a = Fraction(1, 3)
b = Fraction(1, 6)
print(a + b)         # 1/2 (exact!)
print(float(a + b))  # 0.5

# Convert from float (keeps exact value)
f = Fraction(0.1)
print(f)              # 3602879701896397/36028797018963968
# shows why floats are imprecise

# Fraction from string (exact)
f = Fraction("0.1")
print(f)              # 1/10 (exact)

# Algebra demos
x = Fraction(3, 4)
print(x ** 2)         # 9/16
print(1 / x)          # 4/3
print(x.denominator)  # 4
print(x.numerator)    # 3

# Reduce automatically
print(Fraction(6, 8))  # 3/4 — auto-simplified

# Useful for probability calculations
prob_a = Fraction(1, 3)
prob_b = Fraction(1, 4)
print(f"P(A or B) = {prob_a + prob_b - prob_a * prob_b}")
# P(A or B) = 13/36`
  },

  "complex numbers": {
    why: "Complex numbers are native in Python and essential for signal processing, electrical engineering, and scientific computing. The cmath module provides complex-aware math functions that return correct results where math would error.",
    code: `# Complex number literals use j (not i)
z = 3 + 4j
print(z.real)    # 3.0
print(z.imag)    # 4.0

# Operations
z1 = 1 + 2j
z2 = 3 - 4j
print(z1 + z2)       # (4-2j)
print(z1 * z2)       # (11-2j)
print(abs(z1))       # 2.23606797749979  (magnitude)
print(z1.conjugate())  # (1-2j)

# cmath for complex-aware math (math.sqrt fails on negatives!)
import cmath
print(cmath.sqrt(-1))     # 1j
print(cmath.phase(z1))    # 1.1071487177940904  (angle in radians)
print(cmath.polar(z1))    # (2.236..., 1.107...)

# Practical: AC circuit impedance
impedance = 100 + 50j  # resistor + inductor
current = (230 + 0j) / impedance
print(f"Current: {abs(current):.3f}A at {cmath.phase(current):.2f} rad")`
  },

  "bool is int subclass": {
    why: "Because bool is a subclass of int, True + True equals 2 and False * 100 equals 0. This can cause subtle bugs where booleans are used in arithmetic, but it's also useful for summing boolean lists to count truthy values.",
    code: `# bool is a subclass of int
print(isinstance(True, int))   # True
print(True + True)             # 2
print(False * 100)             # 0
print(True + 41)               # 42

# Useful: sum booleans to count
results = [True, False, True, True, False]
count = sum(results)
print(f"{count}/{len(results)} passed")  # 3/5 passed

# But be careful with operator overloading
print(True | False)   # 1 (bitwise OR, works because int)
print(True & False)   # 0 (bitwise AND)

# Avoid using booleans in math — it's confusing
# BAD: return True + 1   # returns 2, unclear intent
# GOOD: return 1         # just use int directly

# Bool conversion rules
print(bool(0))        # False
print(bool(""))       # False
print(bool([]))       # False
print(bool("0"))      # True (non-empty string!)
print(bool([None]))   # True (non-empty list!)`
  },

  "Type conversion int()/float()/str()": {
    why: "Implicit type conversions fail silently or raise confusing errors. Converting 'abc' to int raises ValueError with no context. Explicit conversion with error handling prevents crashes in data processing pipelines.",
    code: `# Explicit conversions (casting)
print(int("42"))        # 42
print(int(3.9))         # 3 (truncates, doesn't round!)
print(float("3.14"))    # 3.14
print(str(42))          # "42"

# DANGER: int() truncates, doesn't round
print(int(2.9))    # 2, not 3!
print(round(2.9))  # 3 — use this to round

# ValueError handling
try:
    val = int("not_a_number")
except ValueError as e:
    print(f"Bad conversion: {e}")

# Base conversion
print(int("ff", 16))     # 255 (hex)
print(int("77", 8))      # 63 (octal)
print(int("1010", 2))    # 10 (binary)

# str() customization
print(str(3.14159))             # "3.14159"
print(f"{3.14159:.2f}")         # "3.14"
print(repr("hello\\nworld"))    # "'hello\\nworld'"`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Operators
  // ============================================================
  "Arithmetic // % **": {
    why: "Floor division // rounds toward negative infinity, not toward zero, causing -7//2 == -4 not -3. This surprises developers coming from other languages and causes off-by-one errors in indexing, pagination, and time calculations.",
    code: `# Floor division rounds toward negative infinity
print(7 // 2)     # 3
print(-7 // 2)    # -4 (NOT -3!)
print(7 // -2)    # -4

# Truncation (toward zero) — use int()
print(int(-7 / 2))   # -3

# Modulo follows floor division
print(7 % 2)     # 1
print(-7 % 2)    # 1 (not -1! because -7 = (-4)*2 + 1)
print(7 % -2)    # -1

# Practical: wrap-around indexing
def wrap_index(i, length):
    return i % length

items = ["a", "b", "c"]
print(items[wrap_index(5, 3)])   # "b" (5 % 3 = 2)
print(items[wrap_index(-1, 3)])  # "c" (-1 % 3 = 2)

# Exponentiation
print(2 ** 10)     # 1024
print(9 ** 0.5)    # 3.0 (square root)
print(2 ** -1)     # 0.5 (reciprocal)

# ** has higher precedence than unary minus
print(-2 ** 2)     # -4 (not 4!)
print((-2) ** 2)   # 4`
  },

  "Comparison chaining": {
    why: "Python allows chaining comparisons like 0 < x < 10, which is more readable than x > 0 and x < 10. It also evaluates each sub-expression only once, preventing bugs when x is a function call with side effects.",
    code: `# Chained comparisons — Pythonic and efficient
x = 5
print(0 < x < 10)       # True
print(1 <= x <= 5)      # True
print(x != 0 < x < 10)  # True — all four comparisons chained

# Equivalent WITHOUT chaining (less readable)
print(0 < x and x < 10)

# Each expression evaluated only ONCE (important!)
# BAD: potential double evaluation
# if f() > 0 and f() < 10: ...  # f() called twice!

# GOOD: chained, f() called once
# if 0 < f() < 10: ...

# Practical: range validation
def validate_age(age):
    return 0 <= age <= 150

def validate_score(score):
    return 0.0 <= score <= 100.0`
  },

  "Logical and/or/not": {
    why: "Python's and/or don't return True/False — they return one of the actual operands. This short-circuit behavior enables default-value patterns but confuses developers expecting boolean results.",
    code: `# and/or return OPERANDS, not booleans
print(0 or "default")    # "default" (0 is falsy)
print(42 and "yes")      # "yes" (42 is truthy)
print("" or None or 0 or [])  # [] (last falsy value)

# Practical: default value pattern
def get_config(key, default=None):
    return config.get(key) or default

# not returns a bool (the only one that does)
print(not 0)    # True
print(not "")   # True
print(not 42)   # False

# Short-circuit evaluation
def expensive_check():
    print("called!")
    return True

# expensive_check NOT called (False short-circuits)
result = False and expensive_check()

# Practical: conditional assignment (prefer ternary)
is_admin = False
role = "admin" if is_admin else "user"  # better than: is_admin and "admin" or "user"`
  },

  "Bitwise & | ^ << >> ~": {
    why: "Bitwise operators are essential for permissions flags, hash algorithms, network protocols, and hardware-level operations. Misunderstanding them causes bugs in permission checking and binary data manipulation.",
    code: `# Permission flags — classic use case
READ    = 0b0001  # 1
WRITE   = 0b0010  # 2
EXECUTE = 0b0100  # 4

# Set permissions with OR
perms = READ | WRITE        # 0b0011 = 3
print(f"Perms: {perms:04b}")  # 0011

# Check permission with AND
has_read = bool(perms & READ)     # True
has_exec = bool(perms & EXECUTE)  # False

# Add permission
perms |= EXECUTE              # 0b0111 = 7

# Remove permission
perms &= ~WRITE               # 0b0101 = 5

# Toggle permission
perms ^= EXECUTE              # 0b0001 = 1 (toggled off)

# Shift operations
print(1 << 3)    # 8  (shift left: multiply by 2^n)
print(16 >> 2)   # 4  (shift right: divide by 2^n)

# XOR for swap without temp
a, b = 5, 3
a ^= b; b ^= a; a ^= b
print(a, b)  # 3 5`
  },

  "Walrus :=": {
    why: "Without walrus operator, you either compute a value twice or use awkward temp variables before loops. Walrus lets you assign and test in one expression, reducing redundant calls and improving readability in while loops and comprehensions.",
    code: `# Walrus operator := (Python 3.8+)
# Assign AND use in an expression

# WITHOUT walrus: compute twice or use temp
data = {"a": 1, "b": 2}
if "a" in data:
    val = data["a"]
    print(f"Found: {val}")

# WITH walrus: assign and test in one line
if (val := data.get("a")) is not None:
    print(f"Found: {val}")

# Practical: read lines until empty
while (line := input("Enter: ")) != "":
    print(f"You said: {line}")

# In comprehensions — filter with computed value
import re
texts = ["abc123", "hello", "xyz456"]
nums = [m.group() for t in texts if (m := re.search(r"\\d+", t))]
print(nums)  # ['123', '456']

# Avoid repeated function calls
import random
results = [y for _ in range(100) if (y := random.randint(1, 10)) > 7]
print(results)  # 100 tries, keep only > 7`
  },

  "Ternary expression": {
    why: "Without ternary, simple if/else assignments take 3 lines instead of 1. Ternary expressions make conditional assignment concise and readable for simple cases.",
    code: `# Ternary: value_if_true if condition else value_if_false
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # adult

# Equivalent without ternary (verbose)
if age >= 18:
    status = "adult"
else:
    status = "minor"

# Nested ternary (use sparingly)
score = 85
grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F"
print(grade)  # B

# Practical: inline default
user_input = ""
cleaned = user_input.strip() if user_input else "anonymous"

# Ternary with function results
def expensive_check():
    print("checking...")
    return True

result = "yes" if expensive_check() else "no"`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Control Flow
  // ============================================================
  "if/elif/else": {
    why: "Python's truthiness rules mean 0, '', [], {}, None, and False are all falsy. Developers from JavaScript get bitten by unexpected falsy values. Understanding Python-specific truthiness prevents logic bugs.",
    code: `# Python truthiness rules
values = [0, "", [], {}, None, False, "0", [0]]
for v in values:
    status = "TRUTHY" if v else "FALSY"
    print(f"{str(v):>8} -> {status}")

# Practical: guard clauses (early returns)
def process_order(order):
    if not order:
        return None
    if not order.get("items"):
        raise ValueError("Empty order")
    if order.get("total", 0) <= 0:
        raise ValueError("Invalid total")
    # main logic here — no deep nesting!
    return {"status": "processed", **order}

# Chained conditionals
def classify(score):
    if score >= 90:
        return "A"
    elif score >= 80:     # only checked if first condition fails
        return "B"
    elif score >= 70:
        return "C"
    else:                  # no conditions matched
        return "F"

# Truthy objects with custom __bool__
class Password:
    def __init__(self, value):
        self.value = value
    def __bool__(self):
        return len(self.value) >= 8  # strong = truthy

print(bool(Password("abc")))    # Falsy (too short)
print(bool(Password("abcdefgh")))  # Truthy (strong enough)`
  },

  "for over iterables": {
    why: "Python has no C-style for(int i=0; i<n; i++). You iterate over values directly using for x in iterable. This eliminates off-by-one errors and makes code more readable but requires understanding iterables vs iterators.",
    code: `# Iterate over values directly (no index management)
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# range for numeric sequences
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 3): # 2, 5, 8
    print(i)

# Iterate over any iterable: files, dicts, sets, strings
with open("data.txt") as f:
    for line in f:          # lazy — memory efficient
        process(line)

for char in "hello":        # strings are iterable
    print(char)

# Iterate with enumerate for index
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Common mistake: modifying list while iterating
# BAD:
# for x in items:
#     if bad(x): items.remove(x)  # skips elements!

# GOOD:
items = [x for x in items if not bad(x)]  # new list`
  },

  "range/start-stop-step": {
    why: "range() is lazy (generates numbers on demand), so range(1_000_000) uses almost no memory. Understanding start/stop/step prevents off-by-one errors that are the #1 bug in loop-based code.",
    code: `# range(stop) — starts at 0
for i in range(5):
    print(i, end=" ")  # 0 1 2 3 4

# range(start, stop)
for i in range(3, 8):
    print(i, end=" ")  # 3 4 5 6 7

# range(start, stop, step)
for i in range(0, 20, 3):
    print(i, end=" ")  # 0 3 6 9 12 15 18

# Reverse
for i in range(10, 0, -1):
    print(i, end=" ")  # 10 9 8 7 6 5 4 3 2 1

# Lazy — doesn't create a list in memory
big_range = range(10_000_000)
print(type(big_range))  # <class 'range'>

# Common: enumerate with start index
for i, val in enumerate(["a", "b", "c"], start=1):
    print(f"{i}: {val}")`
  },

  "while + else": {
    why: "The else clause after a while loop runs only when the loop completes without hitting break. This is counterintuitive but useful for search patterns — the else handles 'not found' without a flag variable.",
    code: `# while/else: else runs when loop exits normally (no break)
def find_item(items, target):
    i = 0
    while i < len(items):
        if items[i] == target:
            print(f"Found at index {i}")
            break
        i += 1
    else:
        # Only runs if loop completed without break
        print(f"{target} not found")

find_item([1, 3, 5, 7], 5)  # Found at index 2
find_item([1, 3, 5, 7], 4)  # 4 not found

# Practical: retry with timeout
import time
def poll_until_ready(url, timeout=5):
    start = time.time()
    while time.time() - start < timeout:
        if check_health(url):
            return True
        time.sleep(0.5)
    else:
        # Loop timed out without finding healthy state
        raise TimeoutError(f"{url} not ready after {timeout}s")`
  },

  "break/continue": {
    why: "Without break, loops run to completion even after finding what they need, wasting cycles. Without continue, you end up with deeply nested if/else inside loops. Both keep loop bodies clean and efficient.",
    code: `# break: exit loop immediately
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid          # found — break out
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # not found

# continue: skip to next iteration
def clean_log(lines):
    cleaned = []
    for line in lines:
        line = line.strip()
        if not line:           # skip empty lines
            continue
        if line.startswith("#"):  # skip comments
            continue
        cleaned.append(line)
    return cleaned

# Nested loops with break (only breaks inner loop)
for i in range(3):
    for j in range(3):
        if j == 2:
            break  # breaks inner loop only
        print(f"({i},{j})", end=" ")
    print()`
  },

  "match/case structural patterns": {
    why: "match/case (Python 3.10+) replaces long if/elif chains for destructuring and pattern matching. Without it, extracting data from nested dicts/lists requires verbose manual unpacking that's error-prone and hard to read.",
    code: `# Structural pattern matching (Python 3.10+)
def handle_command(cmd):
    match cmd.split():
        case ["quit"]:
            return "Goodbye!"
        case ["hello", name]:
            return f"Hello, {name}!"
        case ["add", *numbers]:
            total = sum(int(n) for n in numbers)
            return f"Sum: {total}"
        case _:
            return "Unknown command"

print(handle_command("hello Alice"))  # Hello, Alice!
print(handle_command("add 1 2 3"))   # Sum: 6

# Match on types
def describe(value):
    match value:
        case int() as n if n > 0:
            return f"Positive integer: {n}"
        case str() as s if len(s) > 10:
            return f"Long string: {s[:10]}..."
        case list() as l:
            return f"List with {len(l)} items"
        case _:
            return f"Other: {type(value).__name__}"

# Match on dict structure
def process_api_response(resp):
    match resp:
        case {"status": 200, "data": data}:
            return data
        case {"status": 404}:
            raise FileNotFoundError("Not found")
        case {"status": code} if code >= 500:
            raise ConnectionError(f"Server error: {code}")`
  },

  "enumerate & zip": {
    why: "Without enumerate, you use range(len()) which is un-Pythonic and error-prone. Without zip, you manually index parallel lists with bugs when lengths differ. Both eliminate entire classes of index-related bugs.",
    code: `# enumerate: index + value without range(len())
fruits = ["apple", "banana", "cherry"]

# BAD: manual indexing
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")

# GOOD: enumerate
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# enumerate with custom start
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# zip: parallel iteration
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]
grades = ["A", "B+", "A-"]

for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score} ({grade})")

# zip stops at shortest — use zip_longest for padding
from itertools import zip_longest
a = [1, 2, 3]
b = [10, 20]
print(list(zip_longest(a, b, fillvalue=0)))
# [(1, 10), (2, 20), (3, 0)]

# Dict from parallel lists
keys = ["name", "age", "city"]
values = ["Alice", 30, "NYC"]
user = dict(zip(keys, values))
print(user)  # {'name': 'Alice', 'age': 30, 'city': 'NYC'}`
  },

  "sorted(key=lambda)": {
    why: "Using sorted() with a key function eliminates the need for custom __cmp__ methods or complex list manipulations. The key parameter accepts any callable, making custom sorts simple. stable sort preserves order of equal elements.",
    code: `# Basic sorting
nums = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(nums))           # [1, 1, 2, 3, 4, 5, 6, 9]
print(sorted(nums, reverse=True))  # [9, 6, 5, 4, 3, 2, 1, 1]

# Custom sort with key function
words = ["banana", "Apple", "cherry"]
print(sorted(words, key=str.lower))  # ['Apple', 'banana', 'cherry']

# Sort by computed value
students = [("Alice", 92), ("Bob", 85), ("Charlie", 92)]
by_grade = sorted(students, key=lambda s: -s[1])  # descending
print(by_grade)  # [('Alice', 92), ('Charlie', 92), ('Bob', 85)]

# Multi-key sort (tuple comparison)
students = [("Alice", "B"), ("Bob", "A"), ("Charlie", "A")]
result = sorted(students, key=lambda s: (s[1], s[0]))
print(result)  # [('Bob', 'A'), ('Charlie', 'A'), ('Alice', 'B')]

# Sort with operator module (faster than lambda)
from operator import itemgetter
students = [{"name": "Alice", "gpa": 3.9}, {"name": "Bob", "gpa": 3.7}]
print(sorted(students, key=itemgetter("gpa")))

# In-place sort (modifies list, returns None)
    nums.sort(key=abs)  # sort by absolute value`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Strings Deep Dive
  // ============================================================
  "Immutability": {
    why: "Strings are immutable in Python — every 'modification' creates a new string object. Building strings in a loop with += creates O(n²) memory allocations. This causes performance bugs in text processing that are hard to diagnose.",
    code: `# Strings are immutable — every operation creates a new string
s = "hello"
print(id(s))
s = s + " world"     # creates NEW string, old "hello" is garbage
print(id(s))         # different id

# DANGER: building strings in a loop is O(n^2)
# BAD:
result = ""
for word in words:
    result += word + " "  # new string allocated each time

# GOOD: O(n) with join
result = " ".join(words)  # single allocation

# Check immutability
s = "hello"
try:
    s[0] = "H"  # TypeError: 'str' does not support item assignment
except TypeError as e:
    print(e)

# Workaround: create new string
s = "h" + s[1:]  # "Hello"

# Memory implications
s1 = "hello"
s2 = "hello"
print(s1 is s2)  # True — Python may intern same strings
# But don't rely on this for correctness`
  },

  "Slicing s[a:b:c]": {
    why: "Slicing creates new strings with start, stop, and step parameters. Negative indices count from the end. Negative steps reverse the direction. Off-by-one errors in slice bounds are the most common bug — remember: stop is EXCLUSIVE.",
    code: `s = "Hello, World!"

# Basic slicing s[start:stop] — stop is EXCLUSIVE
print(s[0:5])     # "Hello"
print(s[7:])      # "World!"
print(s[:5])      # "Hello"
print(s[:])       # full copy

# Negative indices
print(s[-6:])     # "orld!"
print(s[-6:-1])   # "orld"

# Step: s[start:stop:step]
print(s[::2])     # "Hlo ol!" (every 2nd char)
print(s[1::2])    # "el ol!" (skip first, then every 2nd)

# Reverse a string
print(s[::-1])    # "!dlroW ,olleH"

# Practical: filename splitting
path = "/home/user/project/main.py"
print(path.split("/")[-1])     # "main.py"
print(path.rsplit("/", 1)[0])  # "/home/user/project"

# Common gotcha: slicing never raises IndexError
print("hi"[100:])  # "" (empty string, no error)`
  },

  "Common methods split/join/strip/replace/find": {
    why: "These string methods handle 90% of text processing tasks. Not knowing them leads to writing regex for simple splits or manual loops for stripping whitespace. They're also faster than regex for simple operations.",
    code: `s = "  Hello, World!  "

# strip/lstrip/rstrip: remove whitespace (or chars)
print(s.strip())       # "Hello, World!"
print(s.strip("! "))   # "Hello, World" — strip specific chars

# split/join: split and merge
csv_line = "Alice,30,NYC"
parts = csv_line.split(",")    # ['Alice', '30', 'NYC']
reassembled = " | ".join(parts)  # "Alice | 30 | NYC"

# split with limit
print("a,b,c".split(",", 1))  # ['a', 'b,c']

# replace
text = "Hello World"
print(text.replace("World", "Python"))  # "Hello Python"
print(text.replace("l", "L", 1))       # "HeLlo World" (count=1)

# find/index: locate substrings
print(text.find("World"))   # 6 (or -1 if not found)
print(text.index("World"))  # 6 (raises ValueError if not found)

# startswith/endswith with tuples
filename = "report.pdf"
print(filename.endswith((".pdf", ".doc")))  # True

# center/zfill/rjust/ljust
print("42".zfill(5))        # "00042"
print("hi".center(20, "-")) # "--------hi----------"`
  },

  "startswith/endswith/in": {
    why: "String membership tests with in are clearer and faster than regex or manual slicing for prefix/suffix checks. startswith/endswith accept tuples for multiple patterns, eliminating if/elif chains for file type checking.",
    code: `# 'in' for substring check
text = "Hello, World!"
print("World" in text)   # True
print("Python" in text)  # False

# startswith/endswith with single pattern
filename = "report_2024.pdf"
print(filename.startswith("report_"))  # True
print(filename.endswith(".pdf"))        # True

# Multiple patterns with tuples
image_exts = (".jpg", ".jpeg", ".png", ".gif", ".webp")
files = ["photo.jpg", "doc.pdf", "icon.png", "data.csv"]
images = [f for f in files if f.lower().endswith(image_exts)]
print(images)  # ['photo.jpg', 'icon.png']

# Practical: URL routing
def get_handler(path):
    if path.startswith("/api/"):
        return api_handler
    elif path.startswith("/static/"):
        return static_handler
    elif path.endswith(".json"):
        return json_handler
    return default_handler

# 'in' for membership
valid_statuses = {"active", "pending", "archived"}
user_status = "active"
if user_status not in valid_statuses:
    raise ValueError(f"Invalid status: {user_status}")`
  },

  "str.format vs f-strings": {
    why: "f-strings (Python 3.6+) are faster and more readable than str.format() or %-formatting. str.format is still needed for dynamic format strings and translation/i18n where the format template comes from a config file.",
    code: `# f-strings: fast, readable (preferred)
name = "Alice"
balance = 1234.5
print(f"{name} has ${balance:,.2f}")  # "Alice has $1,234.50"

# str.format: when template is dynamic
template = "{name} has ${balance:,.2f}"
print(template.format(name="Bob", balance=999.9))

# Alignment and padding
print(f"{'left':<10}|")    # "left      |"
print(f"{'right':>10}|")   # "     right|"
print(f"{'center':^10}|")  # "  center  |"
print(f"{'*':*^10}|")      # "**center**|"

# Format spec mini-language
import math
print(f"{math.pi:.4f}")       # "3.1416"
print(f"{1000000:,}")         # "1,000,000"
print(f"{255:#x}")            # "0xff"
print(f"{0.25:.0%}")          # "25%"

# Debugging with = (f-string only, 3.8+)
x = 42
print(f"{x = }")              # "x = 42"

# Named references (avoid repetition)
data = {"first": "Alice", "last": "Smith"}
print(f"{data['first']} {data['last']}")
# Better with format_map:
print("{first} {last}".format_map(data))`
  },

  "Raw strings r''": {
    why: "Without raw strings, Windows paths and regex patterns require double-backslash escaping that makes them unreadable. r'C:\\Users' is clearer than 'C:\\\\\\\\Users' and less error-prone.",
    code: `# Raw strings: backslashes are literal
# Normal string: backslash is escape character
print("C:\\\\Users\\\\file.txt")   # C:\\Users\\file.txt
# print("C:\\Users\\file.txt")  # Error! \\U is Unicode escape

# Raw string: backslash is just backslash
print(r"C:\\Users\\file.txt")    # C:\\Users\\file.txt
print(r"C:\\new\\folder")        # C:\\new\\folder

# Essential for regex patterns
import re
# Without raw string (hard to read)
email_pattern = "\\\\w+@\\\\w+\\\\.com"
# With raw string (clean)
email_pattern = r"\\w+@\\w+\\.com"
print(re.findall(email_pattern, "Contact: alice@gmail.com"))
# ['alice@gmail.com']

# Note: raw strings still can't end with single backslash
# r"\\"  -> SyntaxError
# r"\\"  " -> this works (backslash + quote)

# Practical: file paths
import pathlib
path = pathlib.Path(r"C:\\Program Files\\My App\\config.toml")
print(path.exists())`
  },

  "Bytes vs str": {
    why: "Mixing bytes and str causes TypeError. Files, network data, and binary formats (images, PDFs) are bytes; text processing is str. Forgetting to encode/decode at boundaries crashes programs at runtime, often in production.",
    code: `# str: Unicode text (humans)
text = "Hello, 世界!"
print(type(text))    # <class 'str'>

# bytes: raw bytes (machines)
data = text.encode("utf-8")
print(type(data))    # <class 'bytes'>
print(data)          # b'Hello \\xe4\\xb8\\x96\\xe7\\x95\\x8c!'

# Decode bytes back to str
decoded = data.decode("utf-8")
print(decoded == text)  # True

# Reading files in correct mode
with open("data.txt", "r", encoding="utf-8") as f:
    text_content = f.read()     # str

with open("image.png", "rb") as f:
    binary_content = f.read()   # bytes

# Error handling for bad encoding
bad_bytes = b"Hello \\xff\\xfe"
text = bad_bytes.decode("utf-8", errors="replace")  # "Hello ����"
text = bad_bytes.decode("utf-8", errors="ignore")   # "Hello "

# Common error: mixing bytes and str
# b"hello" + "world"  -> TypeError
# b"hello".decode() + "world"  -> works

# Working with binary protocols
import struct
packed = struct.pack("!I", 42)    # int -> 4 bytes
unpacked = struct.unpack("!I", packed)[0]  # 4 bytes -> int
print(unpacked)  # 42`
  },

  "String interning": {
    why: "String interning saves memory by reusing identical string objects. Python automatically interns short strings and identifiers, but for millions of repeated strings in data processing, explicit interning can reduce memory usage by 50%+.",
    code: `import sys

# Python automatically interns small strings and identifiers
a = "hello"
b = "hello"
print(a is b)  # True — same object (interned)

# Longer strings may NOT be interned
a = "hello world!"
b = "hello world!"
print(a is b)  # False (might be different objects)

# Explicit interning for repeated strings
import sys
a = sys.intern("hello world!")
b = sys.intern("hello world!")
print(a is b)  # True — now same object

# Practical: millions of repeated category strings
categories = ["electronics", "clothing", "electronics"]
# Without interning: each string is a separate object
# With interning: all "electronics" reference the same object
interned = [sys.intern(cat) for cat in categories]

# Dict key optimization: interned strings make dict lookup faster
# because is comparison is faster than == (no character comparison)

    # NOT useful for unique strings (hashes, UUIDs)
    # Only beneficial when same string appears many times`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Collections Core
  // ============================================================
  "list append/pop/sort": {
    why: "Lists are Python's most-used data structure. Understanding amortized O(1) append, O(1) pop, and O(n log n) sort prevents performance surprises. Using pop(0) instead of deque.popleft() degrades from O(1) to O(n).",
    code: `# List fundamentals
items = [1, 2, 3]

# append: amortized O(1)
items.append(4)        # [1, 2, 3, 4]

# pop: O(1) from end (O(n) from front!)
last = items.pop()     # 4, items = [1, 2, 3]
first = items.pop(0)   # 1, items = [2, 3]  — O(n) shift!

# insert: O(n) — avoid in hot loops
items.insert(0, "x")   # ["x", 2, 3] — shifts all elements

# sort: Timsort O(n log n), stable
scores = [3, 1, 4, 1, 5, 9]
scores.sort()               # in-place, returns None
sorted_scores = sorted(scores)  # new list

# Sort with key
words = ["banana", "Apple", "cherry"]
words.sort(key=str.lower)   # ['Apple', 'banana', 'cherry']

# List comprehension (fastest way to create lists)
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Performance tip: preallocate if size is known
arr = [None] * 1000  # faster than appending 1000 times`
  },

  "tuple packing/unpacking/namedtuple": {
    why: "Tuples are immutable sequences used for fixed-structure data. Named tuples add field names without the overhead of dataclasses, making code self-documenting while keeping tuple performance.",
    code: `# Tuple packing
point = (3, 4)            # parentheses optional
point = 3, 4              # same thing

# Tuple unpacking
x, y = point
print(x, y)               # 3 4

# Swap with unpacking
a, b = 10, 20
a, b = b, a               # a=20, b=10

# Named tuples: self-documenting tuples
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y)          # 3 4
print(p[0], p[1])        # 3 4 (index access still works)

# namedtuple with defaults
User = namedtuple("User", "name role active", defaults=[True])
user = User("Alice", "admin")
print(user)               # User(name='Alice', role='admin', active=True)

# Practical: function returning multiple values
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

lo, hi, avg = get_stats([1, 2, 3, 4, 5])

# Unpacking in function calls
def greet(name, greeting):
    return f"{greeting}, {name}!"

args = ["Alice", "Hello"]
print(greet(*args))  # Hello, Alice!`
  },

  "dict get/setdefault/items": {
    why: "Dicts are the Swiss Army knife of Python. get() avoids KeyError, setdefault() enables one-line grouping patterns, and .items() enables clean iteration. Without these, you write verbose if/else blocks for simple lookups.",
    code: `# get: safe access with default
config = {"host": "localhost", "port": 8080}
port = config.get("port", 8080)        # 8080
timeout = config.get("timeout", 30)    # 30 (default, key missing)

# setdefault: get-or-set in one operation
word_count = {}
words = ["hello", "world", "hello", "python", "hello"]
for word in words:
    word_count.setdefault(word, []).append(word)
# {'hello': ['hello', 'hello', 'hello'], 'world': ['world'], ...}

# Better: use collections.defaultdict
from collections import defaultdict
word_groups = defaultdict(list)
for word in words:
    word_groups[word].append(word)

# items() for key-value iteration
user = {"name": "Alice", "age": 30, "role": "admin"}
for key, value in user.items():
    print(f"{key}: {value}")

# Dict comprehension
squares = {x: x**2 for x in range(6)}
evens = {k: v for k, v in squares.items() if v % 2 == 0}

# Merge dicts (Python 3.9+)
defaults = {"color": "blue", "size": 10}
overrides = {"size": 20, "weight": 5}
config = defaults | overrides  # {'color': 'blue', 'size': 20, 'weight': 5}`
  },

  "set union|intersection-difference^symdiff": {
    why: "Sets provide O(1) membership testing vs O(n) for lists, and set operations replace nested loops for finding common/different elements. Without sets, deduplication requires manual dictionary tricks.",
    code: `# Sets: unordered collection of unique elements
users_a = {"alice", "bob", "charlie"}
users_b = {"bob", "diana", "alice"}

# Union: all elements from both
print(users_a | users_b)  # {'alice', 'bob', 'charlie', 'diana'}

# Intersection: common elements
print(users_a & users_b)  # {'alice', 'bob'}

# Difference: in A but not B
print(users_a - users_b)  # {'charlie'}

# Symmetric difference: in either but not both
print(users_a ^ users_b)  # {'charlie', 'diana'}

# Practical: deduplicate while preserving order
ids = [1, 3, 2, 3, 1, 4, 2, 5]
unique = list(dict.fromkeys(ids))  # [1, 3, 2, 4, 5]

# Fast membership testing
big_list = set(range(1_000_000))
print(999_999 in big_list)  # True — O(1) vs O(n) for list

# Set operations for data analysis
active_users = {"alice", "bob", "charlie"}
premium_users = {"alice", "charlie"}

# Users who are active AND premium
print(active_users & premium_users)  # {'alice', 'charlie'}

# Users who are active but NOT premium
print(active_users - premium_users)  # {'bob'}`
  },

  "collections.deque": {
    why: "Lists are O(n) for appendleft/popleft because they shift all elements. deques are O(1) at both ends, making them essential for queues, sliding windows, and BFS algorithms. Using list for queue operations causes quadratic time complexity.",
    code: `from collections import deque

# deque: double-ended queue, O(1) at both ends
q = deque()

# O(1) operations at both ends
q.append("right")        # add to right
q.appendleft("left")     # add to left
print(q)                 # deque(['left', 'right'])

last = q.pop()           # O(1) from right
first = q.popleft()      # O(1) from left

# Sliding window
def sliding_window(iterable, size):
    it = iter(iterable)
    window = deque(maxlen=size)
    for item in it:
        window.append(item)
        if len(window) == size:
            yield tuple(window)

print(list(sliding_window(range(7), 3)))
# [(0,1,2), (1,2,3), (2,3,4), (3,4,5), (4,5,6)]

# Rotate and reverse
d = deque([1, 2, 3, 4, 5])
d.rotate(2)    # deque([4, 5, 1, 2, 3])
d.rotate(-2)   # deque([1, 2, 3, 4, 5])

# Practical: BFS
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`
  },

  "collections.Counter": {
    why: "Manually counting with dicts requires 5+ lines. Counter does it in one, plus provides most_common(), arithmetic operations, and element() for reconstruction. Essential for frequency analysis, log parsing, and data profiling.",
    code: `from collections import Counter

# One-line frequency counting
words = "the cat sat on the mat the cat".split()
counts = Counter(words)
print(counts.most_common(3))
# [('the', 3), ('cat', 2), ('sat', 1)]

# From any iterable
log_levels = ["INFO", "ERROR", "WARNING", "INFO", "ERROR", "INFO"]
level_counts = Counter(log_levels)
print(level_counts)
# Counter({'INFO': 3, 'ERROR': 2, 'WARNING': 1})

# Arithmetic: combine counters
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
print(c1 + c2)    # Counter({'a': 4, 'b': 3})
print(c1 - c2)    # Counter({'a': 2})  # no negatives
print(c1 & c2)    # Counter({'a': 1, 'b': 1})  # min

# Practical: find most common errors
errors = [
    "TimeoutError", "TimeoutError", "ValueError",
    "TimeoutError", "KeyError", "ValueError"
]
top_errors = Counter(errors).most_common(2)
print(f"Top issues: {top_errors}")
# [('TimeoutError', 3), ('ValueError', 2)]

# Reconstruct elements
c = Counter(a=2, b=3)
print(list(c.elements()))  # ['a', 'a', 'b', 'b', 'b']`
  },

  "collections.defaultdict": {
    why: "Without defaultdict, grouping items requires setdefault() or checking if keys exist before appending. defaultdict eliminates boilerplate and prevents KeyError, making grouping and aggregation code cleaner and less error-prone.",
    code: `from collections import defaultdict

# Group items by category (without defaultdict)
# BAD: verbose boilerplate
groups = {}
for item in items:
    key = item["category"]
    if key not in groups:
        groups[key] = []
    groups[key].append(item)

# GOOD: defaultdict
groups = defaultdict(list)
for item in items:
    groups[item["category"]].append(item)

# Defaultdict with different defaults
word_lengths = defaultdict(int)    # default: 0
for word in ["hello", "hi", "hey"]:
    word_lengths[len(word)] += 1
print(dict(word_lengths))  # {5: 1, 2: 2}

# Nested dict automatically
nested = defaultdict(dict)
nested["users"]["alice"] = {"role": "admin"}
# No need to check if "users" key exists first

# Set for unique items per key
tags = defaultdict(set)
for post, post_tags in [("a", ["python", "code"]), ("b", ["python", "data"])]:
    for tag in post_tags:
        tags[tag].add(post)
print(dict(tags))  # {'python': {'a', 'b'}, 'code': {'a'}, 'data': {'b'}}`
  },

  "heapq priority queues": {
    why: "Finding the top-K largest/smallest items from a dataset requires sorting the entire list O(n log n). heapq gives you O(n log k) with a fixed-size heap, and O(log n) for dynamic insertion/extraction. Essential for scheduling and priority processing.",
    code: `import heapq

# Smallest N elements (min-heap)
nums = [5, 3, 8, 1, 9, 2, 7]
print(heapq.nsmallest(3, nums))  # [1, 2, 3]

# Largest N elements (max-heap via negation)
print(heapq.nlargest(3, nums))   # [9, 8, 7]

# Priority queue operations
heap = []
heapq.heappush(heap, (2, "low priority"))
heapq.heappush(heap, (1, "high priority"))
heapq.heappush(heap, (3, "critical"))

# Pop in priority order (smallest first)
while heap:
    priority, task = heapq.heappop(heap)
    print(f"Processing: {task}")

# Top-K with custom key
tasks = [{"name": "A", "priority": 3}, {"name": "B", "priority": 1}]
top_urgent = heapq.nsmallest(2, tasks, key=lambda t: t["priority"])

# Practical: merge sorted files efficiently
import heapq
def merge_sorted(*iterables):
    return heapq.merge(*iterables)

a = [1, 3, 5, 7]
b = [2, 4, 6, 8]
print(list(merge_sorted(a, b)))  # [1, 2, 3, 4, 5, 6, 7, 8]`
  },

  "bisect sorted-list insert": {
    why: "Inserting into a sorted list with list.insert() is O(n). bisect finds the insertion point in O(log n), keeping a list sorted without the overhead of a full balanced tree. Essential for maintaining ranked leaderboards and sorted buffers.",
    code: `import bisect

# Keep a list sorted as you insert items
sorted_list = [1, 3, 5, 7, 9]

# Find insertion point (O(log n))
pos = bisect.bisect_left(sorted_list, 5)  # 2 (index of 5)
pos = bisect.bisect_right(sorted_list, 5)  # 3 (after 5)

# Insert and maintain sort order
bisect.insort(sorted_list, 4)
print(sorted_list)  # [1, 3, 4, 5, 7, 9]

bisect.insort(sorted_list, 0)
print(sorted_list)  # [0, 1, 3, 4, 5, 7, 9]

# Practical: percentile calculation
def percentile(sorted_data, p):
    k = (len(sorted_data) - 1) * p / 100
    f = int(k)
    c = f + 1
    if c >= len(sorted_data):
        return sorted_data[f]
    return sorted_data[f] + (k - f) * (sorted_data[c] - sorted_data[f])

data = sorted([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])
print(f"90th percentile: {percentile(data, 90)}")

# Maintaining a leaderboard
leaders = []
scores = [100, 85, 92, 78, 95, 88]
for score in scores:
    bisect.insort(leaders, score)
    print(f"Top 3: {leaders[-3:]}")`
  },

  "frozenset hashable set": {
    why: "Regular sets are mutable and can't be used as dict keys or set elements. frozenset is the immutable, hashable version — essential for nested sets, dict keys representing combinations, and caching set-valued results.",
    code: `# Regular set is mutable — can't be dict key
s = {1, 2, 3}
try:
    d = {s: "value"}  # TypeError: unhashable type: 'set'
except TypeError as e:
    print(e)

# frozenset is hashable — can be dict key
fs = frozenset([1, 2, 3])
d = {fs: "value"}
print(d[frozenset([1, 2, 3])])  # "value"

# Use frozenset for permissions/roles
ROLE_PERMISSIONS = {
    frozenset(["read", "write"]): "editor",
    frozenset(["read"]): "viewer",
    frozenset(["read", "write", "admin"]): "admin",
}

user_perms = frozenset(["read", "write"])
role = ROLE_PERMISSIONS.get(user_perms, "unknown")
print(role)  # "editor"

# Nested sets
set_of_sets = {frozenset([1, 2]), frozenset([3, 4])}
print(set_of_sets)
# {frozenset({1, 2}), frozenset({3, 4})}`
  },

  "ChainMap layered configs": {
    why: "Without ChainMap, merging config layers requires dict unpacking that evaluates all values eagerly. ChainMap provides lazy lookup with precedence — CLI args override env vars override defaults — without copying data.",
    code: `from collections import ChainMap

# Layered configuration with precedence
defaults = {"color": "blue", "timeout": 30, "retries": 3}
env_config = {"timeout": 60, "color": "green"}  # env overrides defaults
cli_args = {"retries": 5}                         # CLI overrides all

# ChainMap: first match wins (CLI > env > defaults)
config = ChainMap(cli_args, env_config, defaults)
print(config["color"])    # "green" (from env)
print(config["timeout"])  # 60 (from env)
print(config["retries"])  # 5 (from CLI)

# New maps override (doesn't modify originals)
override = config.new_child({"debug": True})
print(override["debug"])  # True
print(config["debug"])    # KeyError (original unchanged)

# Practical: layered settings
import os
def get_config():
    defaults = {"host": "localhost", "port": 8080, "debug": False}
    env = {k.lower(): v for k, v in os.environ.items()
           if k.startswith("APP_")}
    return ChainMap(env, defaults)`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Functions
  // ============================================================
  "def/return/None default": {
    why: "Functions that forget to explicit return explicitly return None, causing bugs when callers expect a value. Understanding that functions are first-class objects (can be assigned, passed, returned) unlocks functional patterns and callbacks.",
    code: `# Functions are objects — can be assigned, passed, returned
def greet(name):
    return f"Hello, {name}!"

# Assign function to variable
say_hello = greet
print(say_hello("Alice"))  # Hello, Alice!

# Functions without explicit return -> None
def side_effect(x):
    result = x * 2
    print(result)  # prints 4, but returns None!
    # MISSING: return result

value = side_effect(2)
print(value)  # None — surprise bug!

# Pass functions as arguments
def apply(func, value):
    return func(value)

print(apply(str.upper, "hello"))  # HELLO

# Return functions (closures)
def multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = multiplier(2)
print(double(5))  # 10

# Functions are first-class
operations = {
    "add": lambda a, b: a + b,
    "mul": lambda a, b: a * b,
}
print(operations["add"](3, 4))  # 7`
  },

  "Default arg trap": {
    why: "Mutable default arguments (like [] or {}) are shared across ALL calls to the function. This means a list default that's modified in one call persists into the next, causing data leakage between calls — one of Python's most famous bugs.",
    code: `# THE TRAP: mutable default arguments are shared across calls
def append_to(item, target=[]):
    target.append(item)
    return target

print(append_to(1))  # [1]
print(append_to(2))  # [1, 2] — NOT [2]! The default list persists

# CORRECT: use None sentinel
def append_to(item, target=None):
    if target is None:
        target = []    # new list each call
    target.append(item)
    return target

print(append_to(1))  # [1]
print(append_to(2))  # [2] — correct!

# Why this happens:
# The default value is evaluated ONCE at function definition time
# The same list object is reused for every call without an argument`
  },

  "*args/**kwargs": {
    why: "Without *args/**kwargs, wrapper functions must list every parameter of the wrapped function. When wrapping libraries that update their API, your wrapper breaks. *args/**kwargs forward any signature transparently.",
    code: `# *args: variable positional arguments (tuple)
def sum_all(*args):
    print(f"args = {args}")  # tuple
    return sum(args)

print(sum_all(1, 2, 3, 4))  # 10

# **kwargs: variable keyword arguments (dict)
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=30)
# name: Alice
# age: 30

# Combining: regular args first, then *args, then **kwargs
def function(a, b, *args, key1=None, **kwargs):
    print(f"a={a}, b={b}, args={args}, key1={key1}, kwargs={kwargs}")

function(1, 2, 3, 4, key1="hello", extra="world")
# a=1, b=2, args=(3, 4), key1=hello, kwargs={'extra': 'world'}

# Practical: logging decorator that wraps any function
import functools
def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}{args} {kwargs}")
        result = func(*args, **kwargs)
        print(f"  -> {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

add(3, 4)  # Calling add(3, 4) {}
            #   -> 7`
  },

  "Keyword-only & positional-only": {
    why: "Without / and * markers, users can pass arguments in any order, making API calls confusing and error-prone. Positional-only prevents API misuse; keyword-only prevents accidental argument order bugs.",
    code: `# Positional-only parameters (Python 3.8+) — /
def connect(host, port, /, timeout=30):
    # host and port MUST be positional
    print(f"Connecting to {host}:{port} with timeout={timeout}")

connect("localhost", 8080)           # OK
connect("localhost", 8080, timeout=60)  # OK
# connect(host="localhost", port=8080)  # TypeError! positional-only

# Keyword-only parameters — *
def create_user(name, *, email, role="user"):
    # email and role MUST be keyword arguments
    return {"name": name, "email": email, "role": role}

create_user("Alice", email="a@b.com")            # OK
# create_user("Alice", "a@b.com")                # TypeError! keyword-only

# Combining both
def api_call(url, /, method="GET", *, headers=None, timeout=30):
    # url: positional only
    # method: positional or keyword
    # headers, timeout: keyword only
    print(f"{method} {url}")

api_call("https://api.example.com", headers={"Auth": "token"})
api_call("https://api.example.com", "POST", timeout=60)`
  },

  "lambda": {
    why: "lambda provides one-line anonymous functions for short callbacks. Without it, defining a named function for every sort key or filter adds unnecessary boilerplate. But lambdas are limited to single expressions — complex logic needs def.",
    code: `# Lambda: tiny anonymous callable
add = lambda a, b: a + b
print(add(3, 4))  # 7

# Most common: sort keys
students = [("Alice", 92), ("Bob", 85), ("Charlie", 95)]
by_grade = sorted(students, key=lambda s: -s[1])
print(by_grade)  # [('Charlie', 95), ('Alice', 92), ('Bob', 85)]

# Filter with lambda
numbers = [1, -2, 3, -4, 5]
positives = list(filter(lambda x: x > 0, numbers))
print(positives)  # [1, 3, 5]

# Map with lambda
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, -4, 6, -8, 10]

# WHEN NOT to use lambda:
# BAD: lambda that's immediately assigned (use def instead)
# square = lambda x: x ** 2  # PEP 8 discourages this
# GOOD:
def square(x):
    return x ** 2

# Lambda for short callbacks, not complex logic
sorted(words, key=lambda w: len(w))  # GOOD`
  },

  "Docstrings & annotations": {
    why: "Without docstrings, no one (including future you) knows what a function does without reading the code. Annotations enable IDE autocompletion and mypy static analysis. Together they make code self-documenting.",
    code: `from typing import Optional

def calculate_discount(
    price: float,
    discount_pct: float,
    max_discount: Optional[float] = None
) -> float:
    """Calculate discounted price with optional cap.

    Args:
        price: Original price (must be non-negative).
        discount_pct: Discount percentage (0-100).
        max_discount: Maximum discount amount. None for no cap.

    Returns:
        Discounted price rounded to 2 decimal places.

    Raises:
        ValueError: If price is negative or discount_pct out of range.

    Examples:
        >>> calculate_discount(100.0, 20)
        80.0
    """
    if price < 0:
        raise ValueError(f"Price cannot be negative: {price}")
    if not 0 <= discount_pct <= 100:
        raise ValueError(f"Discount must be 0-100: {discount_pct}")

    discount = price * discount_pct / 100
    if max_discount is not None:
        discount = min(discount, max_discount)
    return round(price - discount, 2)

# Access docstring at runtime
print(calculate_discount.__doc__)
help(calculate_discount)

# Get type hints
import typing
hints = typing.get_type_hints(calculate_discount)
print(hints)`
  },

  "Recursion & sys.setrecursionlimit": {
    why: "Python's default recursion limit is 1000. Deep recursion without tail-call optimization causes RecursionError. Understanding base cases and the limit prevents stack overflow crashes in tree traversal and graph algorithms.",
    code: `import sys

# Default recursion limit
print(sys.getrecursionlimit())  # 1000

# Increase if needed (careful: can cause segfault)
sys.setrecursionlimit(5000)

# Fibonacci — classic recursion example
def fib(n):
    if n <= 1:          # base case
        return n
    return fib(n - 1) + fib(n - 2)  # recursive case

print(fib(30))  # 832040

# BETTER: memoized recursion (avoid recomputation)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)

print(fib_memo(100))  # 354224848179261915075 (instant!)

# Iterative alternative for deep structures
def dfs_iterative(start):
    stack = [start]
    visited = set()
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            stack.extend(node.children)`
  },

  "Closures & nonlocal": {
    why: "Closures capture variables from enclosing scope, enabling factory functions and stateful callbacks. Without understanding nonlocal, modifying captured variables causes UnboundLocalError because Python treats them as local.",
    code: `# Closure: function that captures variables from enclosing scope
def make_counter():
    count = 0
    def increment():
        nonlocal count   # must declare nonlocal to modify
        count += 1
        return count
    return increment

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3

# Factory functions using closures
def make_multiplier(factor):
    def multiply(x):
        return x * factor  # 'factor' captured from enclosing scope
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))   # 10
print(triple(5))   # 15

# Without nonlocal: common error
def broken():
    count = 0
    def increment():
        count += 1  # UnboundLocalError! count is local here
        return count
    return increment`
  },

  "First-class functions": {
    why: "Because functions are first-class objects in Python, you can pass them as arguments, store them in data structures, and return them. This enables powerful patterns like callbacks, decorators, and strategy patterns that replace verbose OOP designs.",
    code: `# Functions as first-class objects

# Store functions in data structures
operations = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
}

def calculate(a, op, b):
    return operations[op](a, b)

print(calculate(10, "+", 5))  # 15
print(calculate(10, "*", 3))  # 30

# map/filter/sorted with function keys
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map: apply function to each item
squares = list(map(lambda x: x**2, numbers))

# filter: keep items where function returns True
evens = list(filter(lambda x: x % 2 == 0, numbers))

# sorted with key function
words = ["banana", "apple", "cherry"]
by_length = sorted(words, key=len)

# Practical: validation pipeline
validators = [
    lambda x: x > 0,          # must be positive
    lambda x: x < 1000,       # must be under 1000
    lambda x: x != 42,        # not the forbidden number
]

def validate(value, rules):
    return all(rule(value) for rule in rules)

print(validate(50, validators))   # True
print(validate(-1, validators))   # False`
  },

  "Partial application functools.partial": {
    why: "When the same arguments appear repeatedly across function calls, partial eliminates the repetition. It's cleaner than lambdas for creating specialized versions of general functions, especially with callbacks and API wrappers.",
    code: `from functools import partial

# Create specialized function from general one
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5))  # 25
print(cube(5))    # 125

# Practical: API request helper
import urllib.request

def api_request(url, method="GET", timeout=30, headers=None):
    print(f"{method} {url} (timeout={timeout})")

# Create specialized versions
get_request = partial(api_request, method="GET", timeout=10)
post_request = partial(api_request, method="POST", timeout=30)

get_request("https://api.example.com/users")
post_request("https://api.example.com/users", timeout=60)

# Practical: sorted with fixed key
from operator import itemgetter
students = [{"name": "Alice", "gpa": 3.9}, {"name": "Bob", "gpa": 3.7}]
by_name = sorted(students, key=itemgetter("name"))

# Partial with method of an object
print_int = partial(print, end="")
print_int("Hello ")
print_int("World")
print()  # Hello World`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Errors & Exceptions
  // ============================================================
  "try/except/else/finally": {
    why: "Without understanding the execution order (try -> except -> else -> finally), developers put success logic inside try blocks where it can be caught by except. The else clause separates the happy path from error handling.",
    code: `# try/except/else/finally execution order
def read_config(path):
    try:
        f = open(path)
    except FileNotFoundError:
        print("Config file not found, using defaults")
        return {"debug": False}
    except PermissionError as e:
        print(f"Permission denied: {e}")
        raise
    else:
        # Runs ONLY if no exception in try
        config = parse_config(f.read())
        return config
    finally:
        # ALWAYS runs, even if exception was raised
        print("Cleanup: closing file")
        try:
            f.close()
        except NameError:
            pass  # f was never assigned

# Better: use with-statement (auto-close)
def read_config_v2(path):
    try:
        with open(path) as f:
            return parse_config(f.read())
    except FileNotFoundError:
        return {"debug": False}`
  },

  "except SpecificError as e": {
    why: "Bare except: catches everything including KeyboardInterrupt and SystemExit, making it impossible to stop a misbehaving script. Always catch specific exceptions so that system signals and programming errors propagate correctly.",
    code: `# NEVER use bare except (catches KeyboardInterrupt etc.)
# BAD:
# try:
#     do_something()
# except:
#     pass  # silently swallows ALL errors, even Ctrl+C!

# GOOD: catch specific exceptions
try:
    value = int(input("Enter a number: "))
    result = 100 / value
except ValueError as e:
    print(f"Not a number: {e}")
except ZeroDivisionError as e:
    print(f"Cannot divide by zero: {e}")

# Catch multiple exceptions in one handler
try:
    data = load_data()
except (FileNotFoundError, PermissionError) as e:
    print(f"File access error: {e}")

# Exception chaining with 'raise from'
try:
    config = parse_toml(raw)
except Exception as e:
    raise ConfigError("Invalid config") from e

# Practical: robust file processing
def safe_process(path):
    try:
        with open(path, encoding="utf-8") as f:
            return process(f.read())
    except UnicodeDecodeError:
        with open(path, encoding="latin-1") as f:
            return process(f.read())
    except OSError as e:
        logger.error("Failed to read %s: %s", path, e)
        return None`
  },

  "raise & raise from": {
    why: "Without raise from, exception chaining loses the original traceback, making debugging much harder. Explicitly raising with context preserves the full chain of causation for diagnosing production issues.",
    code: `# Raising exceptions
def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# Exception chaining: raise from (preserves original traceback)
try:
    value = int("not_a_number")
except ValueError as original:
    raise RuntimeError("Failed to parse config") from original
# Output shows both RuntimeError AND the original ValueError

# Re-raising (preserves traceback)
def process_file(path):
    try:
        return parse(read(path))
    except ParseError:
        raise  # re-raise with original traceback
        # vs: raise ParseError("bad") — loses traceback!

# Custom exceptions with context
class ValidationError(Exception):
    def __init__(self, field, message, value=None):
        self.field = field
        self.value = value
        super().__init__(f"{field}: {message}")

def validate_age(age):
    if not isinstance(age, int):
        raise ValidationError("age", "must be integer", age)
    if age < 0:
        raise ValidationError("age", "cannot be negative", age)

try:
    validate_age(-5)
except ValidationError as e:
    print(f"Error on field '{e.field}': {e}")`
  },

  "Custom exception hierarchies": {
    why: "Raising generic Exception for domain errors makes it impossible to catch specific failure modes. Custom hierarchies let callers handle business logic errors differently from infrastructure errors, enabling targeted retry and recovery.",
    code: `# Custom exception hierarchy for a payment system
class PaymentError(Exception):
    """Base for all payment errors."""
    pass

class InsufficientFundsError(PaymentError):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(
            f"Insufficient funds: have ${balance:.2f}, need ${amount:.2f}"
        )

class CardDeclinedError(PaymentError):
    def __init__(self, reason="unknown"):
        self.reason = reason
        super().__init__(f"Card declined: {reason}")

class FraudSuspectedError(PaymentError):
    pass

# Usage with specific handling
def process_payment(card, amount):
    try:
        result = charge_card(card, amount)
    except InsufficientFundsError as e:
        print(f"Add ${e.amount - e.balance:.2f} to your account")
        return False
    except CardDeclinedError as e:
        print(f"Try another card: {e.reason}")
        return False
    except FraudSuspectedError:
        alert_fraud_team()
        return False
    except PaymentError:
        log.error("Unexpected payment error")
        return False`
  },

  "EAFP vs LBYL": {
    why: "LBYL (Look Before You Leap) adds defensive checks everywhere, cluttering code. EAFP (Easier to Ask Forgiveness) is the Pythonic way: try the operation and handle exceptions. EAFP is faster in the happy path and more readable.",
    code: `# LBYL: Look Before You Leap (verbose, un-Pythonic)
# BAD:
if "key" in some_dict:
    value = some_dict["key"]
    if value is not None:
        result = value.strip()

# EAFP: Easier to Ask Forgiveness (Pythonic)
# GOOD:
try:
    result = some_dict["key"].strip()
except (KeyError, AttributeError):
    result = ""

# EAFP is faster when the happy path is common
import os
# LBYL
if os.path.exists(path):
    with open(path) as f:
        content = f.read()

# EAFP (better — handles race conditions too)
try:
    with open(path) as f:
        content = f.read()
except FileNotFoundError:
    content = ""

# Practical: JSON parsing with fallback
import json
def safe_parse(raw):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None`
  },

  "assert": {
    why: "assert is for programmer errors (invariants) — never for user input validation because python -O strips all asserts. Use assert to document and verify assumptions; use if/raise for runtime validation.",
    code: `# Assert: debugging checks (STRIPPED with python -O!)
def calculate_average(numbers):
    assert len(numbers) > 0, "Cannot average empty list"
    assert all(isinstance(n, (int, float)) for n in numbers), \
        "All items must be numbers"
    return sum(numbers) / len(numbers)

print(calculate_average([1, 2, 3]))  # 2.0

# Assertions are STRIPPED in optimized mode
# python -O script.py  ->  all assert statements removed!
# NEVER use assert for:
# - Input validation (users can bypass with -O)
# - Authentication checks
# - Business logic validation

# Assert vs if/raise
def divide(a, b):
    # BAD: assert can be disabled
    # assert b != 0, "Division by zero"
    # GOOD: always enforced
    if b == 0:
        raise ZeroDivisionError("Division by zero")
    return a / b`
  },

  "Exception groups & except*": {
    why: "Before Python 3.11, you could only raise one exception at a time. When processing multiple items in a batch, you had to choose between failing on the first error or collecting errors awkwardly. Exception groups let you raise and catch multiple errors.",
    code: `# Exception groups (Python 3.11+)
# Raise multiple errors at once
def validate_batch(users):
    errors = []
    for user in users:
        if not user.get("email"):
            errors.append(ValidationError("email", "required", user))
        if not user.get("age"):
            errors.append(ValidationError("age", "required", user))
    if errors:
        raise ExceptionGroup("Validation failed", errors)

# Catch with except* (handles matching exceptions)
try:
    validate_batch([{"name": "Alice"}, {"name": "Bob"}])
except* ValidationError as eg:
    for error in eg.exceptions:
        print(f"Field '{error.field}': {error}")

# except* can catch partial matches
try:
    raise ExceptionGroup("mixed", [
        ValueError("bad value"),
        TypeError("wrong type"),
        ValueError("another bad value"),
    ])
except* ValueError as eg:
    print(f"ValueErrors: {eg.exceptions}")  # 2 errors
except* TypeError as eg:
    print(f"TypeErrors: {eg.exceptions}")   # 1 error`
  },

  "traceback module": {
    why: "When logging errors, the default traceback.format_exc() gives a string. The traceback module lets you programmatically inspect frames, filter irrelevant frames, and format custom error reports for better debugging.",
    code: `import traceback
import sys

# Format exception with full traceback
try:
    1 / 0
except Exception:
    tb = traceback.format_exc()
    print(tb)

# Capture traceback object for later inspection
try:
    risky_operation()
except Exception:
    exc_type, exc_value, exc_tb = sys.exc_info()
    for frame_summary in traceback.extract_tb(exc_tb):
        print(f"  {frame_summary.filename}:{frame_summary.lineno} "
              f"in {frame_summary.name}: {frame_summary.line}")

# Logger integration
import logging
logger = logging.getLogger(__name__)

try:
    process_data()
except Exception:
    logger.exception("Processing failed")  # includes full traceback`
  },

  "contextlib.suppress": {
    why: "Without suppress, ignoring specific exceptions requires 4-line try/except/pass blocks. suppress does it in one readable line, making it clear which exceptions are intentionally ignored.",
    code: `from contextlib import suppress
import os

# Without suppress (verbose)
try:
    os.remove("temp_file.txt")
except FileNotFoundError:
    pass

# With suppress (clean)
with suppress(FileNotFoundError):
    os.remove("temp_file.txt")

# Practical: idempotent operations
with suppress(FileExistsError):
    os.mkdir("output_dir")

# Suppress multiple exceptions
with suppress(ValueError, TypeError, KeyError):
    result = parse_and_process(raw_data)

# NOTE: don't suppress too broadly in production
# Prefer: with suppress(FileNotFoundError): over with suppress(Exception):`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Modules & Packages
  // ============================================================
  "import styles": {
    why: "Using from x import * pollutes the namespace and makes it impossible to know where names come from. import x is verbose but explicit. Knowing when to use each prevents name collisions and debugging confusion.",
    code: `# Style 1: import module (explicit, recommended)
import json
data = json.loads('{"key": "value"}')

# Style 2: import with alias (common for abbreviations)
import numpy as np
import pandas as pd
arr = np.array([1, 2, 3])

# Style 3: from import specific names
from pathlib import Path
from collections import defaultdict
p = Path(".")

# Style 4: from import with alias
from datetime import datetime as dt
now = dt.now()

# AVOID: star import (pollutes namespace)
# from json import *  # BAD: dumps, loads, etc. all in scope

# Import conditional (feature flags)
try:
    import ujson as json  # faster JSON library
except ImportError:
    import json           # fallback to stdlib`
  },

  "Package layout src-layout": {
    why: "Without src-layout, you can accidentally import the local package directory instead of the installed version, causing tests to pass locally but fail in CI. src-layout prevents this by requiring explicit installation.",
    code: `# src-layout (recommended for packages)
# myproject/
# ├── src/
# │   └── mypackage/
# │       ├── __init__.py
# │       ├── core.py
# │       └── utils.py
# ├── tests/
# ├── pyproject.toml
# └── README.md

# pyproject.toml for src-layout
# [tool.hatch.build.targets.wheel]
# packages = ["src/mypackage"]

# Why src-layout matters:
# Flat: import mypackage works even without pip install
#       -> tests pass locally, fail in CI where it's not installed
# Src: import mypackage fails until pip install -e .
#       -> forces you to declare all dependencies

# Testing with src-layout
# pip install -e ".[dev]"  (editable install with dev deps)
# pytest  (now imports correctly)`
  },

  "__init__.py roles": {
    why: "__init__.py controls what gets exported when users do from package import X. Without explicit __all__, users can import internal modules. Clean public API prevents coupling to internals.",
    code: `# __init__.py controls the package's public API

# mypackage/__init__.py

# Option 1: Explicit re-exports (recommended)
from .core import Processor, Config
from .utils import helper_function
from .exceptions import PackageError

__all__ = ["Processor", "Config", "helper_function", "PackageError"]

# Option 2: Lazy imports (faster startup)
def __getattr__(name):
    if name == "heavy_module":
        from . import heavy_module
        return heavy_module
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

# Option 3: Version
__version__ = "2.1.0"

# Without __all__:
# from mypackage import *  -> imports EVERYTHING including internal stuff

# With __all__:
# from mypackage import *  -> only Processor, Config, etc.`
  },

  "Relative imports": {
    why: "Relative imports (from . import module) only work within packages and prevent naming collisions. Absolute imports (from mypackage import module) work everywhere but can be verbose. Mixing them incorrectly causes ImportError.",
    code: `# Relative imports (within package only)
# In core.py:
from .utils import helper_function     # from same directory
from .exceptions import PackageError   # from same package

# In utils.py (import from sibling):
from .core import Processor

# Absolute imports (always work)
from mypackage.utils import helper_function
from mypackage.core import Processor

# DON'T use relative imports outside packages
# In standalone script: from . import utils  -> ImportError!

# Practical: package structure
# mypackage/
#   __init__.py    -> from .core import Processor
#   core.py        -> from .utils import helper
#   utils.py       -> from .exceptions import Error
#   exceptions.py  -> (no relative imports needed)`
  },

  "if __name__ guard": {
    why: "Without the guard, code in a module runs when imported, not just when executed directly. This causes side effects when other modules import functions from your file for testing.",
    code: `# calculator.py
def add(a, b):
    return a + b

# This runs on import AND on direct execution
print("calculator imported!")  # BAD: side effect on import

# GOOD: guard with __name__
if __name__ == "__main__":
    # Only runs when: python calculator.py
    # NOT when: from calculator import add
    print("Running self-tests...")
    assert add(2, 3) == 5
    print("All tests passed!")

# Practical: dual-purpose modules
# mymodule.py can be:
# 1. Imported: from mymodule import helper
# 2. Executed: python mymodule.py --verbose

import argparse
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()
    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)`
  },

  "dir()/help()/inspect": {
    why: "When working with unfamiliar objects or libraries, dir() shows available attributes, help() displays documentation, and inspect() reveals source code. These are essential for interactive exploration and debugging.",
    code: `# dir(): list attributes of an object
import os
print(dir(os))              # all os module attributes
print(dir(os.path))         # all os.path attributes

# Filter dir output
print([x for x in dir(str) if not x.startswith("_")])

# help(): interactive documentation
# help(str.split)  # shows docstring in pager

# inspect: deep introspection
import inspect

# Get source code of a function
def example():
    return 42

print(inspect.getsource(example))

# Get function signature
from typing import Callable
def greet(name: str, times: int = 1) -> str:
    return f"Hello {name}! " * times

sig = inspect.signature(greet)
print(sig)  # (name: str, times: int = 1) -> str

# Get calling convention
for name, param in sig.parameters.items():
    print(f"  {name}: {param.annotation}, default={param.default}")

# Practical: auto-documentation
def document_module(module):
    for name, obj in inspect.getmembers(module):
        if not name.startswith("_"):
            if callable(obj):
                print(f"{name}{inspect.signature(obj)}")`
  },

  "Namespace packages": {
    why: "Traditional packages require __init__.py in every directory. Namespace packages (PEP 420) allow splitting a package across multiple directories without __init__.py, enabling plugin systems and distributed packages.",
    code: `# Namespace packages: no __init__.py needed

# myproject/
#   src_a/
#     mypackage/
#       module_a.py    # from mypackage import module_a
#   src_b/
#     mypackage/
#       module_b.py    # from mypackage import module_b

# Both directories contribute to the 'mypackage' namespace
# No __init__.py in either mypackage/ directory

# This is useful for:
# 1. Plugin systems (plugins add submodules to main package)
# 2. Distributed packages (split across repos)
# 3. Prototyping (no package setup needed)

# Traditional vs namespace:
# Traditional: requires __init__.py, one location
# Namespace: no __init__.py, multiple locations

# Find namespace packages
import pkgutil
import mypackage
for importer, modname, ispkg in pkgutil.iter_modules(mypackage.__path__):
    print(f"{'package' if ispkg else 'module'}: {modname}")`
  },

  "Import cycles": {
    why: "Circular imports (A imports B which imports A) cause ImportError or AttributeError at runtime. They're a design smell indicating tight coupling. Breaking cycles requires restructuring code, not postponing imports.",
    code: `# CIRCULAR IMPORT (breaks at runtime!)
# a.py
# from b import B
# class A: pass
#
# b.py
# from a import A
# class B: pass

# Solution 1: Restructure (move shared code to third module)
# shared.py
# class A: pass
# class B: pass
# a.py: from shared import A
# b.py: from shared import B

# Solution 2: Import inside function (deferred)
# a.py
# class A:
#     def create_b(self):
#         from b import B  # import inside method
#         return B()

# Solution 3: Use TYPE_CHECKING for type hints only
from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from b import B  # only imported for type checkers

class A:
    def create_b(self) -> B:  # works at runtime (annotation is string)
        from b import B       # actual import deferred
        return B()

    # Rule of thumb: if you need deferred imports, your modules are too coupled`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Basic OOP
  // ============================================================
  "class & instances": {
    why: "Classes define blueprints; instances are actual objects. Confusing class attributes (shared) with instance attributes (per-object) causes bugs where one instance's changes affect all others.",
    code: `class Dog:
    # Class attribute (shared by ALL instances)
    species = "Canis familiaris"

    def __init__(self, name, age):
        # Instance attributes (unique to each instance)
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"

buddy = Dog("Buddy", 3)
charlie = Dog("Charlie", 5)

print(buddy.species)    # "Canis familiaris" (from class)
print(buddy.bark())     # "Buddy says Woof!"
print(charlie.bark())   # "Charlie says Woof!"

# Class attribute shared across instances
print(buddy.species == charlie.species)  # True

# Instance attributes unique per object
print(buddy.name != charlie.name)  # True

# Check what an instance has
print(buddy.__dict__)  # {'name': 'Buddy', 'age': 3}
print(Dog.__dict__.keys())  # dict_keys(['species', '__init__', 'bark', ...])`
  },

  "__init__ constructor": {
    why: "__init__ is called when creating an instance. Forgetting that self is explicit (not implicit like in Java/JavaScript) causes NameError. Every instance method must have self as the first parameter.",
    code: `class Point:
    def __init__(self, x: float, y: float):
        self.x = x  # self.x is the instance attribute
        self.y = y  # x is just the parameter

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p1 = Point(0, 0)
p2 = Point(3, 4)
print(p1.distance_to(p2))  # 5.0
print(repr(p1))             # Point(0, 0)

# __init__ does NOT return a value (returning non-None raises TypeError)
class Bad:
    def __init__(self):
        return "oops"  # TypeError!

# Init with validation
class PositiveNumber:
    def __init__(self, value: float):
        if value < 0:
            raise ValueError(f"Must be positive: {value}")
        self.value = value`
  },

  "Instance vs class attributes": {
    why: "Class attributes are shared across all instances. If a class attribute is mutable (like a list), all instances share the same object, causing cross-contamination bugs. Instance attributes shadow class attributes of the same name.",
    code: `class Student:
    # Class attribute (shared)
    school = "Python Academy"
    all_students = []  # DANGER: shared mutable!

    def __init__(self, name):
        self.name = name  # Instance attribute (unique)
        Student.all_students.append(self)  # shared list

s1 = Student("Alice")
s2 = Student("Bob")

# Class attribute shared
print(s1.school == s2.school)  # True — same string

# DANGER: mutable class attribute
print(len(Student.all_students))  # 2 — shared across instances

# Instance attribute shadows class attribute
s1.school = "New Academy"  # creates instance attribute
print(s1.school)           # "New Academy" (instance)
print(s2.school)           # "Python Academy" (class)
print(Student.school)      # "Python Academy" (class)

# BETTER: use instance attribute for mutable state
class BetterStudent:
    def __init__(self, name):
        self.name = name
        self.grades = []  # per-instance list`
  },

  "Methods: instance/classmethod/staticmethod": {
    why: "Using instance methods when you don't need self wastes clarity. Using class methods when you need factory patterns avoids __init__ complications. Static methods group utility functions logically within a class namespace.",
    code: `class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    # Instance method: operates on instance (has self)
    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

    # Class method: operates on class (has cls), factory pattern
    @classmethod
    def from_string(cls, date_str):
        year, month, day = map(int, date_str.split("-"))
        return cls(year, month, day)  # cls() creates instance

    # Static method: no self or cls, utility function
    @staticmethod
    def is_valid(year, month, day):
        return 1 <= month <= 12 and 1 <= day <= 31

# Usage
d1 = Date(2024, 1, 15)
d2 = Date.from_string("2024-01-15")  # class method as factory
print(d1 == d2)  # depends on __eq__

print(Date.is_valid(2024, 13, 1))  # False (month 13)

# Common pattern: alternative constructors
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    @classmethod
    def from_dict(cls, data):
        return cls(data["name"], data["email"])

    @classmethod
    def from_json(cls, json_str):
        import json
        return cls.from_dict(json.loads(json_str))`
  },

  "__repr__ vs __str__": {
    why: "__repr__ is for developers (unambiguous debug representation); __str__ is for users (readable display). Without __repr__, printing objects shows memory addresses like <__main__.Point object at 0x...>, making debugging miserable.",
    code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        """Unambiguous representation for developers."""
        return f"Point({self.x!r}, {self.y!r})"

    def __str__(self):
        """Readable representation for users."""
        return f"({self.x}, {self.y})"

p = Point(3, 4)
print(repr(p))  # Point(3, 4) — can recreate the object
print(str(p))   # (3, 4) — human-readable

# In collections, __repr__ is used
print([p, Point(1, 2)])  # [Point(3, 4), Point(1, 2)]

# f-strings use __format__, falls back to __str__
print(f"{p}")          # (3, 4)
print(f"{p!r}")        # Point(3, 4) — uses __repr__

# Practical: never leave __repr__ undefined
class Bad:
    pass
print(Bad())  # <__main__.Bad object at 0x...> — useless!

class Good:
    def __repr__(self):
        return f"Good()"
print(Good())  # Good() — at least you know the class`
  },

  "Inheritance & super()": {
    why: "Without understanding MRO (Method Resolution Order), super() calls in diamond inheritance patterns cause methods to be called multiple times or not at all. super() doesn't always call the parent — it follows MRO.",
    code: `class Animal:
    def __init__(self, name):
        self.name = name
        print(f"Animal.__init__: {name}")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # calls Animal.__init__
        self.breed = breed
        print(f"Dog.__init__: {breed}")

class Puppy(Dog):
    def __init__(self, name, breed, owner):
        super().__init__(name, breed)  # calls Dog.__init__
        self.owner = owner

p = Puppy("Rex", "Labrador", "Alice")
# Animal.__init__: Rex
# Dog.__init__: Labrador

# MRO: Method Resolution Order
print(Puppy.__mro__)
# Puppy -> Dog -> Animal -> object

# super() follows MRO, NOT direct parent
class A:
    def method(self): print("A")

class B(A):
    def method(self):
        super().method()  # calls next in MRO
        print("B")

class C(A):
    def method(self):
        super().method()  # calls next in MRO
        print("C")

class D(B, C):  # MRO: D -> B -> C -> A -> object
    def method(self):
        super().method()  # calls B (first in MRO)
        print("D")

D().method()  # A B C D — each called exactly once!`
  },

  "Encapsulation convention _private": {
    why: "Python has no true access modifiers. _private is a convention; __name triggers name mangling. Understanding this prevents confusion about why __x becomes _ClassName__x and why external code can still access 'private' attributes.",
    code: `class BankAccount:
    def __init__(self, balance):
        self._balance = balance     # convention: 'internal'
        self.__secret = "key123"    # name-mangled: _BankAccount__secret

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount     # internal use OK

    def get_balance(self):
        return self._balance

account = BankAccount(1000)
print(account.get_balance())       # 1000
print(account._balance)            # 1000 — works but discouraged!

# Name mangling for __attr
try:
    print(account.__secret)        # AttributeError
except AttributeError:
    print(account._BankAccount__secret)  # "key123" — accessible but mangled

# Practical: use properties for validation
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

t = Temperature(100)
print(t.fahrenheit)  # 212.0
t.celsius = 0
print(t.fahrenheit)  # 32.0`
  },

  "@property computed attrs": {
    why: "Without @property, computed attributes require calling methods like get_x(). Properties make computed attributes look like regular attributes, enabling lazy evaluation and validation on assignment without changing the API.",
    code: `class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        """Get or set the radius."""
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        """Computed property — no setter (read-only)."""
        import math
        return math.pi * self._radius ** 2

    @property
    def diameter(self):
        return self._radius * 2

c = Circle(5)
print(c.area)          # 78.539...
print(c.diameter)      # 10
c.radius = 10          # setter works
print(c.area)          # 314.159...

try:
    c.radius = -1      # raises ValueError
except ValueError as e:
    print(e)           # Radius cannot be negative

# Lazy property (compute once, cache result)
class ExpensiveData:
    @property
    def data(self):
        if not hasattr(self, '_data'):
            print("Computing... (slow)")
            self._data = expensive_computation()
        return self._data`
  },

  "dataclasses": {
    why: "Without dataclasses, every class needs a repetitive __init__, __repr__, __eq__, and more. dataclasses auto-generate these methods, reducing 30+ lines of boilerplate to 5 lines while remaining fully customizable.",
    code: `from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    email: str
    age: int = 0
    tags: list = field(default_factory=list)  # mutable default

    def __post_init__(self):
        """Runs after __init__ — for validation."""
        if self.age < 0:
            raise ValueError("Age cannot be negative")
        self.email = self.email.lower()

# Auto-generated: __init__, __repr__, __eq__
user = User("Alice", "ALICE@test.com", 30)
print(user)  # User(name='Alice', email='alice@test.com', age=30, tags=[])

# Frozen (immutable) dataclass
@dataclass(frozen=True, slots=True)
class Point:
    x: float
    y: float

p1 = Point(3, 4)
p2 = Point(3, 4)
print(p1 == p2)       # True (auto __eq__)
print(hash(p1))       # works (frozen + slots = hashable)

# Sorting with order=True
@dataclass(order=True)
class Task:
    priority: int
    title: str

tasks = [Task(3, "low"), Task(1, "urgent"), Task(2, "medium")]
print(sorted(tasks))  # [Task(1, 'urgent'), Task(2, 'medium'), Task(3, 'low')]`
  },

  "Enums Enum/auto/StrEnum": {
    why: "Without Enums, developers use magic strings and integers that have no meaning and can't be validated at import time. Enums prevent invalid values, enable IDE autocompletion, and make switch/match patterns safe.",
    code: `from enum import Enum, auto, StrEnum

# Basic Enum
class Color(Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"

print(Color.RED)           # Color.RED
print(Color.RED.value)     # "red"
print(Color.RED.name)      # "RED"

# auto() for sequential values
class Status(Enum):
    PENDING = auto()    # 1
    ACTIVE = auto()     # 2
    ARCHIVED = auto()   # 3

# StrEnum: string-based (Python 3.11+)
class HttpMethod(StrEnum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"

# Practical: replace magic strings
def handle_request(method: HttpMethod):
    match method:
        case HttpMethod.GET:
            return "fetching"
        case HttpMethod.POST:
            return "creating"

# Validation at import time
try:
    Color("invalid")  # ValueError: 'invalid' is not a valid Color
except ValueError as e:
    print(e)

# Iteration
    for color in Color:
        print(color)  # Color.RED, Color.GREEN, Color.BLUE`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — File & I/O Basics
  // ============================================================
  "open modes r/w/a/b/+": {
    why: "Using the wrong file mode (text vs binary, read vs write) causes data corruption or crashes. 'w' truncates the file, losing existing data. 'b' is required for images, PDFs, and network protocols.",
    code: `# Read modes
f = open("data.txt", "r")         # text read (default)
f = open("data.txt", "r", encoding="utf-8")  # explicit encoding

# Write modes (DANGER: truncates existing content!)
f = open("output.txt", "w")       # write (creates or truncates)
f = open("output.txt", "a")       # append (creates if missing)

# Binary modes (for non-text data)
f = open("image.png", "rb")       # read binary
f = open("output.bin", "wb")      # write binary

# Read+write modes
f = open("data.txt", "r+")        # read+write, cursor at start
f = open("data.txt", "w+")        # write+read, truncates!
f = open("data.txt", "a+")        # append+read

# ALWAYS use with-statement for auto-close
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# file automatically closed here, even on exception

# Practical: copy file with encoding conversion
with open("input_latin1.txt", "r", encoding="latin-1") as src:
    with open("output_utf8.txt", "w", encoding="utf-8") as dst:
        dst.write(src.read())`
  },

  "with-statement auto-close": {
    why: "Without with-statement, you must manually call close() in a finally block. If an exception occurs before close(), the file handle leaks. with guarantees cleanup, even when exceptions propagate.",
    code: `# WITHOUT with (error-prone)
f = open("data.txt")
try:
    data = f.read()
finally:
    f.close()  # easy to forget!

# WITH (guaranteed cleanup)
with open("data.txt") as f:
    data = f.read()
# automatically closed, even on exception

# Multiple files at once
with open("input.txt") as fin, open("output.txt", "w") as fout:
    fout.write(fin.read())

# Practical: context manager for any resource
from contextlib import contextmanager

@contextmanager
def managed_connection(host, port):
    conn = None
    try:
        conn = connect(host, port)
        yield conn
    finally:
        if conn:
            conn.close()

with managed_connection("localhost", 8080) as conn:
    conn.send("hello")
# connection closed automatically`
  },

  "Reading lines lazily": {
    why: "Reading an entire large file into memory with f.read() can cause MemoryError on files larger than RAM. Line-by-line iteration is lazy — it reads one line at a time, using constant memory regardless of file size.",
    code: `# DANGER: loads entire file into memory
with open("huge_file.log") as f:
    content = f.read()  # 10GB file = 10GB RAM!

# SAFE: lazy line-by-line iteration
with open("huge_file.log") as f:
    for line in f:  # reads one line at a time
        process(line)  # constant memory usage

# Practical: count lines in huge file
def count_lines(filepath):
    count = 0
    with open(filepath) as f:
        for line in f:
            count += 1
    return count

# Practical: filter large log file
def filter_errors(input_path, output_path):
    with open(input_path) as fin, open(output_path, "w") as fout:
        for line in fin:
            if "ERROR" in line:
                fout.write(line)

# Read in chunks for binary files
def sha256_file(filepath):
    import hashlib
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):  # 8KB chunks
            h.update(chunk)
    return h.hexdigest()`
  },

  "pathlib.Path": {
    why: "os.path string manipulation is error-prone with forward/backslash confusion across OSes. pathlib gives you OS-agnostic path operations with methods for glob, mkdir, read/write, and stem/suffix splitting.",
    code: `from pathlib import Path

# Create path objects
p = Path("data") / "output" / "results.csv"  # data/output/results.csv
p = Path.home() / "projects" / "myapp"

# Properties
p = Path("/home/user/report.tar.gz")
print(p.name)      # "report.tar.gz"
print(p.stem)      # "report.tar" (without last suffix)
print(p.suffix)    # ".gz" (last suffix)
print(p.suffixes)  # ['.tar', '.gz']
print(p.parent)    # Path('/home/user')

# Read/write in one line
path = Path("config.json")
path.write_text('{"key": "value"}', encoding="utf-8")
content = path.read_text(encoding="utf-8")

# Binary read/write
Path("image.png").write_bytes(image_data)
data = Path("image.png").read_bytes()

# Directory operations
Path("output").mkdir(parents=True, exist_ok=True)

# Glob for file discovery
py_files = list(Path(".").glob("**/*.py"))  # recursive
config_files = list(Path("config").glob("*.yaml"))

# Check existence
if Path("data.csv").exists():
    print(f"Size: {Path('data.csv').stat().st_size} bytes")

# Rename/move
Path("old.txt").rename("new.txt")`
  },

  "os & shutil ops": {
    why: "os handles system-level operations (env vars, file permissions, directory traversal). shutil handles high-level file operations (copy, move, remove trees). Without shutil, recursive directory operations require manual os.walk loops.",
    code: `import os
import shutil

# os: system operations
os.makedirs("output/data", exist_ok=True)  # recursive mkdir
print(os.listdir("."))                       # list directory
print(os.getcwd())                          # current directory
os.chdir("/tmp")                             # change directory

# Environment variables
api_key = os.environ.get("API_KEY")
if not api_key:
    raise RuntimeError("Set API_KEY environment variable")

# File operations
os.rename("old.txt", "new.txt")
os.remove("temp.txt")
os.path.getsize("data.csv")

# shutil: high-level file operations
shutil.copy("source.txt", "dest.txt")       # copy file
shutil.copy2("source.txt", "dest.txt")      # copy with metadata
shutil.move("file.txt", "archive/")          # move/rename
shutil.rmtree("temp_dir")                    # recursive delete
shutil.make_archive("backup", "zip", "data") # create zip

# Practical: clean and rebuild output directory
def clean_output(path):
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path)

# Disk usage
total, used, free = shutil.disk_usage("/")
print(f"Free: {free // (2**30)} GB")`
  },

  "CSV reading/writing": {
    why: "Manually parsing CSV with split(',') breaks on quoted fields containing commas. The csv module handles edge cases like quotes, escaped delimiters, and different line endings correctly.",
    code: `import csv

# Reading CSV
with open("employees.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']} - {row['dept']} (${row['salary']})")

# Reading without header
with open("data.csv") as f:
    reader = csv.reader(f)
    header = next(reader)  # skip header
    for row in reader:
        process(row[0], row[1])

# Writing CSV
employees = [
    {"name": "Alice", "dept": "eng", "salary": 120000},
    {"name": "Bob", "dept": "sales", "salary": 95000},
]
with open("output.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "dept", "salary"])
    writer.writeheader()
    writer.writerows(employees)

# Practical: handle different delimiters
with open("data.tsv") as f:
    reader = csv.DictReader(f, delimiter="\\t")
    for row in reader:
        print(row)`
  },

  "JSON load/dump": {
    why: "Manually formatting JSON strings is error-prone with escaping. json.dumps() handles encoding correctly, but forgetting ensure_ascii=False prevents Unicode characters from being preserved, and omitting indent makes output unreadable.",
    code: `import json

# Load (parse) JSON
data = json.loads('{"name": "Alice", "age": 30}')
print(data["name"])  # Alice

# Dump (serialize) JSON
output = json.dumps(data, indent=2, ensure_ascii=False)
print(output)

# Read/write JSON files
with open("config.json") as f:
    config = json.load(f)

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Practical: pretty-print nested data
response = {
    "users": [
        {"name": "Alice", "scores": [95, 87, 92]},
        {"name": "Bob", "scores": [78, 85, 90]},
    ]
}
print(json.dumps(response, indent=2, sort_keys=True))

# Handle non-serializable types
import datetime
def default_serializer(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

json.dumps({"date": datetime.now()}, default=default_serializer, indent=2)

# Parse JSONL (newline-delimited JSON for logs)
records = []
for line in open("events.jsonl"):
    records.append(json.loads(line))`
  },

  "Environment variables os.environ": {
    why: "Hardcoding secrets, ports, and config values in code means changing them requires a code change and redeployment. Environment variables separate configuration from code, following the Twelve-Factor App methodology.",
    code: `import os

# Read environment variables
api_key = os.environ.get("API_KEY")
if not api_key:
    raise RuntimeError("Set API_KEY environment variable")

# With default value
debug = os.environ.get("DEBUG", "false").lower() == "true"
port = int(os.environ.get("PORT", "8000"))

# Practical: configuration pattern
import os

class Config:
    DATABASE_URL = os.environ["DATABASE_URL"]  # required
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key-change-in-prod")
    DEBUG = os.environ.get("DEBUG", "false").lower() == "true"
    MAX_CONNECTIONS = int(os.environ.get("MAX_CONNECTIONS", "10"))

# Set variables (in current process only)
os.environ["MY_VAR"] = "value"

# .env file pattern (with python-dotenv)
# pip install python-dotenv
from dotenv import load_dotenv
load_dotenv()  # loads from .env file

# .env file:
# DATABASE_URL=postgresql://localhost/mydb
# API_KEY=secret123
# DEBUG=true`
  },

  "stdin/stdout/stderr": {
    why: "Using print() for all output mixes data with debug messages. Separating stdout (data/results) from stderr (errors/debug) lets you pipe output cleanly and redirect errors separately.",
    code: `import sys

# stdout: normal output
print("Hello")  # prints to stdout

# stderr: error/debug output
print("Warning: slow query", file=sys.stderr)

# Redirect in shell:
# python script.py > output.txt 2> errors.txt
# python script.py > /dev/null 2>&1  # suppress all output

# Read from stdin (for piping)
# echo "hello" | python script.py
for line in sys.stdin:
    print(line.strip().upper())

# Input vs sys.stdin
name = input("Enter name: ")  # prompt + readline

# Practical: logging instead of print
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    stream=sys.stderr  # logs go to stderr
)
logger = logging.getLogger(__name__)
logger.info("Processing started")  # stderr, not stdout

# sys.exit for clean termination
import sys
def main():
    if not validate_args():
        sys.exit(1)  # exit code 1 = error
    process()
    sys.exit(0)  # exit code 0 = success`
  },

  // ============================================================
  // FOUNDATIONS (TIER 1) — Stdlib Power Tools
  // ============================================================
  "datetime date/time/timedelta": {
    why: "Using time.time() for dates loses timezone info and causes DST bugs. datetime handles timezones, arithmetic, and formatting correctly. Always use timezone-aware datetimes to avoid ambiguous times during clock changes.",
    code: `from datetime import datetime, timedelta, timezone
import pytz  # pip install pytz (or use zoneinfo in 3.9+)

# Current time (UTC-aware)
now = datetime.now(timezone.utc)
print(now.isoformat())  # 2024-01-15T10:30:00+00:00

# Create specific datetime
dt = datetime(2024, 6, 15, 14, 30, 0, tzinfo=timezone.utc)

# Time arithmetic
one_week = timedelta(weeks=7)
future = now + one_week
past = now - timedelta(days=30)

# Format and parse
formatted = now.strftime("%Y-%m-%d %H:%M:%S")
parsed = datetime.strptime("2024-01-15", "%Y-%m-%d")

# Timezone conversion
sg_tz = timezone(timedelta(hours=8))
sg_time = now.astimezone(sg_tz)
print(sg_time.strftime("%Y-%m-%d %H:%M:%S SGT"))

# Practical: relative timestamps
def time_ago(dt):
    diff = datetime.now(timezone.utc) - dt
    if diff.days > 365:
        return f"{diff.days // 365} years ago"
    if diff.days > 0:
        return f"{diff.days} days ago"
    hours = diff.seconds // 3600
    return f"{hours} hours ago"`
  },

  "time sleep/perf_counter": {
    why: "time.time() has resolution issues on some OSes. time.perf_counter() is the correct way to measure elapsed time for benchmarking. time.sleep() is for adding delays, not measuring time.",
    code: `import time

# Benchmarking: use perf_counter (monotonic, high resolution)
start = time.perf_counter()
# ... do work ...
elapsed = time.perf_counter() - start
print(f"Elapsed: {elapsed:.4f}s")

# Compare with time.time() (has issues with NTP adjustments)
start_bad = time.time()  # DON'T use for benchmarks

# time.sleep for delays
time.sleep(0.5)  # sleep 500ms

# Practical: rate limiting
def rate_limited(func, calls_per_second=10):
    min_interval = 1.0 / calls_per_second
    last_call = 0

    def wrapper(*args, **kwargs):
        nonlocal last_call
        elapsed = time.perf_counter() - last_call
        if elapsed < min_interval:
            time.sleep(min_interval - elapsed)
        last_call = time.perf_counter()
        return func(*args, **kwargs)
    return wrapper

# Practical: simple timeout decorator
def timeout(seconds):
    def decorator(func):
        def wrapper(*args, **kwargs):
            import threading
            result = [None]
            def target():
                result[0] = func(*args, **kwargs)
            t = threading.Thread(target=target)
            t.start()
            t.join(timeout=seconds)
            if t.is_alive():
                raise TimeoutError(f"Function timed out after {seconds}s")
            return result[0]
        return wrapper
    return decorator`
  },

  "random seed/choice/shuffle": {
    why: "Without setting a seed, random operations produce different results each run, making debugging non-reproducible. For testing and data science, reproducibility requires fixed seeds.",
    code: `import random

# Reproducible results with seed
random.seed(42)  # same sequence every time
print(random.randint(1, 100))  # always same number

# Random selection
options = ["A", "B", "C", "D"]
print(random.choice(options))          # one random item
print(random.choices(options, k=3))    # 3 random items (with replacement)
print(random.sample(options, k=2))     # 2 random items (without replacement)

# Random shuffle (in-place)
deck = list(range(1, 53))
random.shuffle(deck)
print(deck[:5])  # first 5 cards

# Random float in range
print(random.uniform(0.0, 1.0))  # 0.0 to 1.0
print(random.random())           # same as uniform(0, 1)

# Practical: random test data generator
def random_user():
    names = ["Alice", "Bob", "Charlie", "Diana"]
    return {
        "name": random.choice(names),
        "age": random.randint(18, 65),
        "score": round(random.uniform(0, 100), 2),
    }

# Reproducible sampling for data science
random.seed(123)
train = random.sample(population, k=int(len(population) * 0.8))
test = [x for x in population if x not in train]`
  },

  "math ceil/floor/log/sqrt": {
    why: "The math module provides optimized numeric functions that are faster than manual implementations. Using int(x) truncates instead of flooring; math.floor() is correct for negative numbers.",
    code: `import math

# Rounding (correct for negative numbers)
print(math.ceil(3.2))     # 4 (round up)
print(math.floor(3.8))    # 3 (round down)
print(math.ceil(-3.2))    # -3 (ceiling = toward positive)
print(math.floor(-3.8))   # -4 (floor = toward negative)

# int() truncates toward zero (WRONG for negative!)
print(int(-3.8))          # -3 (truncates, not floor!)
print(math.floor(-3.8))   # -4 (correct floor)

# Logarithms and roots
print(math.sqrt(16))      # 4.0
print(math.log(100, 10))  # 2.0 (log base 10)
print(math.log(8, 2))     # 3.0 (log base 2)
print(math.log(100))      # 4.605... (natural log)
print(math.log2(1024))    # 10.0
print(math.log10(1000))   # 3.0

# Constants
print(math.pi)            # 3.141592653589793
print(math.e)             # 2.718281828459045
print(math.inf)           # inf

# GCD (greatest common divisor)
print(math.gcd(12, 8))    # 4

# Factorial
print(math.factorial(10))  # 3628800

# Practical: calculate percentiles
def percentile_rank(score, all_scores):
    count_below = sum(1 for s in all_scores if s < score)
    return math.floor(count_below / len(all_scores) * 100)`
  },

  "itertools intro count/cycle/combinations": {
    why: "itertools provides memory-efficient iterators for common patterns. Without it, you write manual loops for combinations, permutations, and infinite sequences that consume memory unnecessarily.",
    code: `import itertools

# count: infinite counter
for i in itertools.count(10, 2):  # 10, 12, 14, ...
    if i > 20:
        break
    print(i, end=" ")

# cycle: infinite循环
colors = itertools.cycle(["red", "green", "blue"])
for _ in range(6):
    print(next(colors), end=" ")  # red green blue red green blue

# chain: concatenate iterables
a = [1, 2, 3]
b = [4, 5, 6]
combined = list(itertools.chain(a, b))  # [1, 2, 3, 4, 5, 6]

# combinations: choose k items (order doesn't matter)
cards = ["A", "K", "Q", "J"]
hands = list(itertools.combinations(cards, 2))
print(hands)  # [('A','K'), ('A','Q'), ('A','J'), ...]

# permutations: ordered arrangements
perms = list(itertools.permutations([1, 2, 3], 2))
print(perms)  # [(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)]

# product: Cartesian product
suits = ["H", "D", "C", "S"]
ranks = ["A", "2", "3"]
deck = list(itertools.product(suits, ranks))

# groupby: group consecutive elements
data = [("A", 1), ("A", 2), ("B", 3), ("B", 4)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(f"{key}: {list(group)}")`
  },

  "functools lru_cache": {
    why: "Without caching, recursive functions like Fibonacci recompute the same subproblems exponentially. lru_cache adds memoization in one line, turning O(2^n) into O(n) for recursive functions.",
    code: `from functools import lru_cache, cache

# Basic memoization
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(100))  # 354224848179261915075 (instant!)

# Unlimited cache (Python 3.9+)
@cache
def expensive(x):
    print(f"Computing {x}...")
    return x ** 2

expensive(5)  # Computing 5...
expensive(5)  # (uses cache, no print)

# Cache info
print(fibonacci.cache_info())
# CacheInfo(hits=98, misses=101, maxsize=128, currsize=101)

# Clear cache
fibonacci.cache_clear()

# Practical: memoize API calls
@lru_cache(maxsize=100)
def fetch_user(user_id):
    """Cache user lookups for 100 unique IDs."""
    return api.get(f"/users/{user_id}")

# Warning: don't cache mutable arguments
# @lru_cache  # TypeError: unhashable type: 'list'
# def process(items): ...

# Use tuple instead of list for cacheable args
@lru_cache
def process(items: tuple):
    return sum(items)`
  },

  "re basics match/search/groups": {
    why: "Without regex, text parsing requires fragile string slicing that breaks on edge cases. Regex handles patterns like emails, dates, and structured text robustly. But over-complicated regex is worse than no regex.",
    code: `import re

# match: check if string starts with pattern
text = "Contact: alice@example.com"
m = re.match(r"Contact: (\\w+)", text)
if m:
    print(m.group(1))  # "alice"

# search: find first match anywhere in string
m = re.search(r"(\\w+@\\w+\\.\\w+)", text)
print(m.group(1))  # "alice@example.com"

# findall: find all matches
text = "Call 555-1234 or 555-5678"
numbers = re.findall(r"\\d{3}-\\d{4}", text)
print(numbers)  # ['555-1234', '555-5678']

# Groups: extract parts of a match
pattern = r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})"
m = re.search(pattern, "2024-01-15")
print(m.group("year"))   # "2024"
print(m.groupdict())     # {'year': '2024', 'month': '01', 'day': '15'}

# Practical: validate email
def is_valid_email(email):
    pattern = r"^[\\w.-]+@[\\w.-]+\\.\\w+$"
    return bool(re.match(pattern, email))

# Practical: extract data from logs
log = "2024-01-15 10:30:00 ERROR Connection failed"
pattern = r"(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2}) (\\w+) (.*)"
m = re.match(pattern, log)
if m:
    date, time, level, message = m.groups()`
  },

  "typing basics List/Dict/Optional": {
    why: "Without type hints, function signatures are opaque — you can't tell if a parameter expects a string or a list. Type hints make APIs self-documenting and enable mypy static checking to catch type bugs before runtime.",
    code: `from typing import List, Dict, Optional, Tuple, Union

# Basic annotations
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

# Collections (Python 3.9+: use built-in types)
def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# Optional: value can be None
def find_user(user_id: int) -> Optional[dict]:
    # Returns dict or None
    return db.get(user_id)  # None if not found

# Union: multiple types
def stringify(value: Union[int, float, str]) -> str:
    return str(value)

# Python 3.10+: use | instead of Union
def stringify(value: int | float | str) -> str:
    return str(value)

# Tuple with fixed structure
def get_stats(numbers: list[float]) -> tuple[float, float, float]:
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

# Callable: function types
def apply(func: callable[[int], int], value: int) -> int:
    return func(value)

# Type aliases for readability
Vector = list[float]
Matrix = list[Vector]

def dot_product(a: Vector, b: Vector) -> float:
    return sum(x * y for x, y in zip(a, b))`
  },

  "argparse quick CLIs": {
    why: "Without argparse, you parse sys.argv manually with error-prone string splitting. argparse provides help messages, type validation, default values, and subcommands automatically.",
    code: `import argparse

# Basic CLI
parser = argparse.ArgumentParser(description="Process files")
parser.add_argument("input", help="Input file path")
parser.add_argument("-o", "--output", default="out.txt", help="Output file")
parser.add_argument("-v", "--verbose", action="store_true")
parser.add_argument("-n", "--count", type=int, default=1, help="Repetitions")

args = parser.parse_args()
# python script.py data.txt -o result.txt -v -n 3

# Subcommands (like git)
parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command")

# git-like: init, add, commit
init_parser = subparsers.add_parser("init", help="Initialize repo")
add_parser = subparsers.add_parser("add", help="Add files")
add_parser.add_argument("files", nargs="+")
commit_parser = subparsers.add_parser("commit", help="Commit changes")
commit_parser.add_argument("-m", "--message", required=True)

args = parser.parse_args()
if args.command == "init":
    init_repo()
elif args.command == "add":
    add_files(args.files)

# Practical: script with required and optional args
parser = argparse.ArgumentParser(description="Data processor")
parser.add_argument("source", help="Source database URL")
parser.add_argument("--batch-size", type=int, default=1000)
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--log-level", choices=["DEBUG", "INFO", "WARNING"], default="INFO")`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Comprehensions & Functional
  // ============================================================
  "List/set/dict comprehensions": {
    why: "Comprehensions are faster than map/filter loops and more readable. They express intent in one line instead of five, and the CPython bytecode optimizer makes them faster than equivalent for-loops.",
    code: `# List comprehension with conditionals
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Nested with conditionals
flat = [x for row in matrix for x in row if x > 0]

# Dict comprehension
word_lengths = {w: len(w) for w in ["hello", "world", "python"]}
inverted = {v: k for k, v in {"a": 1, "b": 2}.items()}

# Set comprehension (auto-deduplicates)
unique_lengths = {len(w) for w in words}  # {5, 6, 6} -> {5, 6}

# Practical: filter and transform in one pass
clean_data = [
    record["name"].strip().title()
    for record in raw_data
    if record.get("name") and record.get("active")
]

# Practical: build lookup dict
users_by_id = {u["id"]: u for u in users if u.get("id")}

# Practical: matrix transpose
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
transposed = [[row[i] for row in matrix] for i in range(3)]`
  },

  "Generator expressions": {
    why: "List comprehensions create entire lists in memory. Generator expressions process items one at a time with zero memory overhead. For large datasets, generators prevent MemoryError and enable lazy pipelines.",
    code: `# Generator expression: parentheses instead of brackets
sum_of_squares = sum(x**2 for x in range(1_000_000))  # no list created!

# Generator function with yield
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Take first 10 fibonacci numbers
from itertools import islice
first_10 = list(islice(fibonacci(), 10))
print(first_10)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# any/all with generators (short-circuit)
has_negative = any(x < 0 for x in numbers)  # stops at first True
all_positive = all(x > 0 for x in numbers)  # stops at first False

# Practical: memory-efficient file processing
def process_large_file(path):
    with open(path) as f:
        return sum(1 for line in f)  # counts without loading file

# Practical: lazy data pipeline
def read_records(path):
    for line in open(path):
        yield json.loads(line)

def filter_active(records):
    for r in records:
        if r.get("active"):
            yield r

def extract_names(records):
    for r in records:
        yield r["name"]

# Pipeline: nothing materialized until consumed
names = extract_names(filter_active(read_records("users.jsonl")))`
  },

  "Nested comprehension flattening": {
    why: "Manually flattening nested lists with for-loops requires temporary variables and multiple lines. Comprehensions flatten in one expression, but deeply nested comprehensions hurt readability.",
    code: `# Simple flatten
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for row in matrix for x in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Equivalent for-loop (verbose)
flat = []
for row in matrix:
    for x in row:
        flat.append(x)

# Flatten with condition
positive_flat = [x for row in matrix for x in row if x > 0]

# Deep flatten (arbitrary depth)
def deep_flatten(lst):
    for item in lst:
        if isinstance(item, list):
            yield from deep_flatten(item)  # yield from delegation
        else:
            yield item

print(list(deep_flatten([1, [2, [3, 4], 5], [6, 7]])))
# [1, 2, 3, 4, 5, 6, 7]

# Practical: cross-product
colors = ["red", "blue"]
sizes = ["S", "M", "L"]
combinations = [(c, s) for c in colors for s in sizes]
# [('red','S'), ('red','M'), ('red','L'), ('blue','S'), ...]`
  },

  "map/filter vs comprehension": {
    why: "Comprehensions are generally preferred for readability, but map/filter can be faster for simple transformations with existing functions. The choice depends on whether you need a callable or an expression.",
    code: `# map: apply function to each item
words = ["hello", "world", "python"]
upper = list(map(str.upper, words))  # ['HELLO', 'WORLD', 'PYTHON']
# Equivalent comprehension:
upper = [w.upper() for w in words]

# filter: keep items where function returns True
numbers = [1, -2, 3, -4, 5]
positive = list(filter(lambda x: x > 0, numbers))
# Equivalent comprehension:
positive = [x for x in numbers if x > 0]

# When map is cleaner: existing function
ascii_values = list(map(ord, "hello"))  # [104, 101, 108, 108, 111]

# When comprehension is cleaner: complex expressions
result = [x**2 for x in range(10) if x % 2 == 0]

# Practical: map with multiple iterables
sums = list(map(lambda a, b: a + b, list1, list2))

# Reduce for aggregation
from functools import reduce
total = reduce(lambda acc, x: acc + x, numbers, 0)`
  },

  "reduce/fold": {
    why: "reduce accumulates a single result from a sequence, replacing manual accumulator loops. Without it, sum/product/min/max with custom logic require verbose for-loops with temporary variables.",
    code: `from functools import reduce

# Basic reduce: accumulator + current item
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda acc, x: acc + x, numbers, 0)
print(total)  # 15

# With initializer (important for empty sequences)
empty_sum = reduce(lambda acc, x: acc + x, [], 0)  # 0

# Practical: find common elements
lists = [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
common = reduce(lambda a, b: set(a) & set(b), lists)
print(common)  # {3}

# Practical: build nested dict
from operator import itemgetter
users = [{"dept": "eng", "name": "Alice"}, {"dept": "sales", "name": "Bob"}]
grouped = reduce(
    lambda acc, u: acc.setdefault(u["dept"], []).append(u["name"]) or acc,
    users,
    {}
)
print(grouped)  # {'eng': ['Alice'], 'sales': ['Bob']}

# Practical: flatten deeply
deep = [[1, [2]], [[3, 4], 5]]
flat = reduce(lambda a, b: a + (b if isinstance(b, list) else [b]), deep, [])
# Prefer itertools.chain or generator for flattening`
  },

  "Currying with partial": {
    why: "Without partial, creating specialized functions from general ones requires verbose lambda wrappers or full def statements. partial is cleaner for API wrappers and callback preparation.",
    code: `from functools import partial

# Basic partial: preset some arguments
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5))  # 25

# Practical: logging with preset level
import logging
debug_log = partial(logging.debug, extra={"component": "auth"})
debug_log("User %s logged in", username)

# Practical: validation pipeline
def validate_range(value, min_val, max_val):
    return min_val <= value <= max_val

validate_age = partial(validate_range, min_val=0, max_val=150)
validate_score = partial(validate_range, min_val=0, max_val=100)

# Practical: API client with preset auth
import requests

class APIClient:
    def __init__(self, base_url, api_key):
        self._get = partial(
            requests.get,
            base_url,
            headers={"Authorization": f"Bearer {api_key}"}
        )

    def get_users(self):
        return self._get("/users").json()

# Partial with operator module (faster than lambda)
from operator import itemgetter, attrgetter
get_name = itemgetter("name")
get_email = attrgetter("email")

names = list(map(get_name, users))  # faster than map(lambda u: u["name"], users)`
  },

  "Pure functions & immutability": {
    why: "Pure functions (same input -> same output, no side effects) are easier to test, debug, and parallelize. Impure functions that mutate arguments cause bugs in concurrent code and make testing unreliable.",
    code: `# IMPURE: modifies input (dangerous!)
def add_to_list(lst, item):
    lst.append(item)  # mutates original!
    return lst

# PURE: creates new list
def add_to_list_pure(lst, item):
    return lst + [item]  # new list, original unchanged

# IMPURE: depends on external state
counter = 0
def increment():
    global counter
    counter += 1  # side effect!
    return counter

# PURE: no external state
def increment_pure(n):
    return n + 1  # same input, same output

# Practical: functional data pipeline
def transform_data(records):
    return list(
        filter(
            lambda r: r.get("active"),
            map(
                lambda r: {**r, "name": r["name"].title()},
                records
            )
        )
    )

# Immutable data patterns
from dataclasses import replace
Point = namedtuple("Point", ["x", "y"])

p1 = Point(3, 4)
p2 = replace(p1, x=10)  # new Point(10, 4), p1 unchanged

# Use tuples instead of lists for immutable sequences
config = ("localhost", 8080)  # can't accidentally modify`
  },

  "operator module itemgetter/attrgetter": {
    why: "Lambda functions for simple attribute/item access are slower than operator module functions because lambdas have Python call overhead. operator functions are implemented in C and are 2-5x faster.",
    code: `from operator import itemgetter, attrgetter, methodcaller

# itemgetter: faster than lambda for dict/list access
users = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]

# SLOW:
sorted_slow = sorted(users, key=lambda u: u["name"])
# FAST:
sorted_fast = sorted(users, key=itemgetter("name"))

# Multiple keys
sorted_by = sorted(users, key=itemgetter("age", "name"))

# attrgetter: faster than lambda for attribute access
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

users = [User("Alice", "a@test.com"), User("Bob", "b@test.com")]
sorted_users = sorted(users, key=attrgetter("name"))

# methodcaller: call method on each item
upper = list(map(methodcaller("upper"), ["hello", "world"]))
print(upper)  # ['HELLO', 'WORLD']

# Practical: fast groupby
from itertools import groupby
data = [{"type": "A", "val": 1}, {"type": "B", "val": 2}, {"type": "A", "val": 3}]
for key, group in groupby(data, key=itemgetter("type")):
    print(f"{key}: {[g['val'] for g in group]}")`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Iterators & Generators
  // ============================================================
  "Iterator protocol __iter__/__next__": {
    why: "Understanding the iterator protocol explains why for-loops work on lists, dicts, files, and generators identically. Custom iterators enable lazy evaluation of infinite or very large sequences.",
    code: `# Every iterable has __iter__ that returns an iterator
# Every iterator has __next__ that raises StopIteration

# Built-in: range is an iterator
r = iter(range(5))
print(next(r))  # 0
print(next(r))  # 1

# Custom iterator: countdown
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

# Use in for-loop
for n in Countdown(5):
    print(n, end=" ")  # 5 4 3 2 1

# Infinite iterator: auto-incrementing IDs
class IDGenerator:
    def __init__(self, start=1):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        value = self.current
        self.current += 1
        return value

ids = IDGenerator(1000)
print(next(ids), next(ids), next(ids))  # 1000 1001 1002

# Practical: paginate API responses
class PaginatedFetcher:
    def __init__(self, url):
        self.url = url
        self.page = 1

    def __iter__(self):
        return self

    def __next__(self):
        data = requests.get(f"{self.url}?page={self.page}").json()
        if not data:
            raise StopIteration
        self.page += 1
        return data`
  },

  "Generators yield": {
    why: "Generators are functions that pause execution with yield, producing values lazily. They replace custom iterator classes with simpler code and enable memory-efficient processing of large datasets.",
    code: `# Generator function: yield pauses execution
def count_up_to(n):
    i = 0
    while i < n:
        yield i  # pauses here, sends value to caller
        i += 1

for num in count_up_to(5):
    print(num, end=" ")  # 0 1 2 3 4

# Generator for reading large files
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield line.strip()

# Nothing loaded into memory until you iterate
for line in read_large_file("huge.log"):
    if "ERROR" in line:
        print(line)

# Send values into generator
def accumulator():
    total = 0
    while True:
        value = yield total
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)           # prime the generator
print(acc.send(10)) # 10
print(acc.send(20)) # 30
print(acc.send(5))  # 35

# Practical: state machine with generators
def finite_state_machine():
    state = "IDLE"
    while True:
        event = yield state
        if state == "IDLE" and event == "start":
            state = "RUNNING"
        elif state == "RUNNING" and event == "stop":
            state = "IDLE"
        elif state == "RUNNING" and event == "error":
            state = "ERROR"

fsm = finite_state_machine()
next(fsm)
print(fsm.send("start"))   # RUNNING
print(fsm.send("stop"))    # IDLE`
  },

  "yield from delegation": {
    why: "Without yield from, flattening nested generators requires manual iteration loops. yield from delegates iteration to a sub-generator, making code cleaner and more efficient for tree traversal and pipeline composition.",
    code: `# yield from: delegate to sub-generator
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)  # delegate!
        else:
            yield item

print(list(flatten([1, [2, [3, 4], 5], [6, 7]])))
# [1, 2, 3, 4, 5, 6, 7]

# Without yield from (verbose)
def flatten_verbose(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten_verbose(item)
        else:
            yield item

# Practical: tree traversal
class TreeNode:
    def __init__(self, value, children=None):
        self.value = value
        self.children = children or []

def traverse_tree(node):
    yield node.value
    for child in node.children:
        yield from traverse_tree(child)  # recursive delegation

tree = TreeNode(1, [TreeNode(2), TreeNode(3, [TreeNode(4)])])
print(list(traverse_tree(tree)))  # [1, 2, 3, 4]

# Practical: chain multiple data sources
def read_all_sources(*paths):
    for path in paths:
        yield from open(path)  # delegate file iteration

# yield from with return values
def sub_generator():
    yield 1
    yield 2
    return "done"  # becomes StopIteration.value

def main_generator():
    result = yield from sub_generator()
    print(f"Sub-generator returned: {result}")

list(main_generator())  # prints: Sub-generator returned: done`
  },

  "generator.send/close/throw": {
    why: "Generators can receive values via .send() and handle exceptions via .throw(), enabling coroutine-style control flow. This is the foundation of async/await and event-driven architectures.",
    code: `# .send(): pass values INTO the generator
def echo():
    while True:
        received = yield
        print(f"Got: {received}")

gen = echo()
next(gen)       # prime (must call next before first send)
gen.send("hi")  # prints: Got: hi
gen.send(42)    # prints: Got: 42

# .close(): generator receives GeneratorExit
def resource_generator():
    try:
        while True:
            yield "data"
    except GeneratorExit:
        print("Cleaning up!")  # cleanup code

gen = resource_generator()
next(gen)
gen.close()  # prints: Cleaning up!

# .throw(): inject exception into generator
def safe_generator():
    while True:
        try:
            received = yield
            print(f"Processing: {received}")
        except ValueError as e:
            print(f"Caught: {e}")

gen = safe_generator()
next(gen)
gen.send("hello")       # Processing: hello
gen.throw(ValueError, "bad input")  # Caught: bad input

# Practical: coroutine for pipeline with error handling
def pipeline_stage(name):
    errors = []
    while True:
        try:
            data = yield
            result = process(data)
            print(f"{name}: {result}")
        except Exception as e:
            errors.append(e)
            print(f"{name} error: {e}")`
  },

  "Infinite generators": {
    why: "Infinite generators produce unbounded sequences without memory allocation. itertools.count/islice/takewhile combine to create windows, sequences, and sampling patterns that would be complex with lists.",
    code: `import itertools

# Infinite counter
def naturals(start=1):
    n = start
    while True:
        yield n
        n += 1

# Take first N with itertools.islice
first_100 = list(itertools.islice(naturals(), 100))

# Sliding window over infinite sequence
def window(iterable, size):
    it = iter(iterable)
    win = list(itertools.islice(it, size))
    if len(win) < size:
        return
    yield tuple(win)
    for item in it:
        win = win[1:] + [item]
        yield tuple(win)

# Practical: fibonacci with infinite generator
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Find first fibonacci > 1000
from itertools import dropwhile, takewhile
first_large = next(dropwhile(lambda x: x <= 1000, fibonacci()))
print(first_large)  # 1597

# Practical: generate test IDs
def auto_increment(prefix="ID"):
    for i in itertools.count(1):
        yield f"{prefix}-{i:06d}"

# Practical: round-robin
def round_robin(*iterables):
    pending = len(iterables)
    nexts = itertools.cycle(iter(it).__next__ for it in iterables)
    while pending:
        try:
            for next_func in nexts:
                yield next_func()
        except StopIteration:
            pending -= 1
            nexts = itertools.cycle(itertools.islice(nexts, pending))`
  },

  "Chained lazy pipelines": {
    why: "Chaining generators creates memory-efficient data pipelines where data flows through transforms without intermediate storage. For ETL processing of large datasets, this prevents memory exhaustion.",
    code: `# Lazy pipeline: nothing computed until consumed
def read_records(path):
    for line in open(path):
        yield json.loads(line)

def filter_active(records):
    for r in records:
        if r.get("active"):
            yield r

def extract_fields(records):
    for r in records:
        yield {"name": r["name"], "email": r["email"]}

def format_output(records):
    for r in records:
        yield f"{r['name']} <{r['email']}>"

# Chain: memory usage = one record at a time
pipeline = format_output(
    extract_fields(
        filter_active(
            read_records("users.jsonl")
        )
    )
)

# Consume: write to file
with open("active_users.txt", "w") as f:
    for line in pipeline:
        f.write(line + "\\n")

# itertools.chain for flat pipelines
import itertools
def merge_sources(*paths):
    return itertools.chain.from_iterable(open(p) for p in paths)

# Practical: ETL with checkpointing
def etl_pipeline(source):
    records = read_records(source)
    cleaned = (clean_record(r) for r in records)
    valid = (r for r in cleaned if r is not None)
    transformed = (transform(r) for r in valid)
    return transformed  # lazy — nothing executed yet`
  },

  "tee/peekable lookahead": {
    why: "tee creates multiple independent iterators from one source, useful for comparing adjacent items. peekable allows looking ahead without consuming items, enabling single-pass algorithms that need lookahead.",
    code: `from itertools import tee, peekable

# tee: create multiple iterators from one source
def pairwise(iterable):
    """s -> (s0, s1), (s1, s2), (s2, s3), ..."""
    a, b = tee(iterable)
    next(b, None)  # advance b by one
    return zip(a, b)

numbers = [1, 2, 3, 4, 5]
for a, b in pairwise(numbers):
    print(f"{a} -> {b}", end="  ")
# 1 -> 2  2 -> 3  3 -> 4  4 -> 5

# peekable: look ahead without consuming
def detect_peaks(sequence):
    p = peekable(sequence)
    prev = next(p)
    for item in p:
        if item > prev:
            yield prev  # local minimum
        prev = item

peaks = list(detect_peaks([1, 3, 2, 5, 4, 6]))
print(peaks)  # [1, 2, 4]

# Practical: merge sorted sequences efficiently
def merge_sorted(*iterables):
    """Merge multiple sorted iterables into one sorted stream."""
    import heapq
    return heapq.merge(*iterables)

a = iter([1, 4, 7])
b = iter([2, 5, 8])
c = iter([3, 6, 9])
merged = merge_sorted(a, b, c)
print(list(merged))  # [1, 2, 3, 4, 5, 6, 7, 8, 9]`
  },

  "File line streaming": {
    why: "For log files that are gigabytes in size, loading the entire file crashes the process. Streaming lines one at a time uses constant memory regardless of file size, enabling processing of arbitrarily large files.",
    code: `# Constant-memory processing of large files
def count_errors(log_path):
    error_count = 0
    with open(log_path) as f:
        for line in f:  # lazy line iteration
            if "ERROR" in line:
                error_count += 1
    return error_count

# Practical: streaming word count
def word_count(path):
    from collections import Counter
    counts = Counter()
    with open(path) as f:
        for line in f:
            counts.update(line.split())
    return counts  # dict-like with counts

# Practical: streaming deduplication (Bloom filter pattern)
def unique_lines(input_path, output_path):
    seen = set()  # warning: uses memory for unique lines
    with open(input_path) as fin, open(output_path, "w") as fout:
        for line in fin:
            if line not in seen:
                seen.add(line)
                fout.write(line)

# Practical: streaming statistics (Welford's algorithm)
def streaming_stats(path):
    n = 0
    mean = 0.0
    M2 = 0.0

    with open(path) as f:
        for line in f:
            value = float(line.strip())
            n += 1
            delta = value - mean
            mean += delta / n
            delta2 = value - mean
            M2 += delta * delta2

    variance = M2 / n if n > 0 else 0
    return {"count": n, "mean": mean, "variance": variance}

# Practical: process lines in chunks for progress
from itertools import islice

def process_in_chunks(path, chunk_size=1000):
    with open(path) as f:
        while True:
            chunk = list(islice(f, chunk_size))
            if not chunk:
                break
            process_chunk(chunk)`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Decorators & Context Managers
  // ============================================================
  "Decorator fundamentals @wraps": {
    why: "Without functools.wraps, decorated functions lose their name, docstring, and module info. This breaks introspection, debugging, and documentation tools that rely on function metadata.",
    code: `import functools

# Basic decorator with @wraps (preserves metadata)
def my_decorator(func):
    @functools.wraps(func)  # preserves __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        """Wrapper docstring (NOT the function's)."""
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"Done with {func.__name__}")
        return result
    return wrapper

@my_decorator
def add(a, b):
    """Add two numbers."""
    return a + b

# Without @wraps:
# print(add.__name__)  # "wrapper" — wrong!
# print(add.__doc__)   # "Wrapper docstring..." — wrong!

# With @wraps:
print(add.__name__)  # "add" — correct!
print(add.__doc__)   # "Add two numbers." — correct!

# Decorator that preserves type hints
import typing
def typed_decorator(func: callable) -> callable:
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    # Preserve type hints
    wrapper.__annotations__ = func.__annotations__
    return wrapper

# Practical: retry decorator
def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay * (2 ** attempt))  # exponential backoff
        return wrapper
    return decorator`
  },

  "Decorators with arguments": {
    why: "Decorators that take arguments require an extra level of nesting (triple-nested functions). Forgetting this pattern leads to calling the decorator incorrectly or getting confusing errors.",
    code: `# Decorator with arguments: triple nesting
def rate_limit(calls_per_minute):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # rate limiting logic
            wrapper._call_count += 1
            if wrapper._call_count > calls_per_minute:
                raise RuntimeError("Rate limit exceeded")
            return func(*args, **kwargs)
        wrapper._call_count = 0
        wrapper._limit = calls_per_minute
        return wrapper
    return decorator

@rate_limit(100)  # 100 calls per minute
def api_call(endpoint):
    return requests.get(endpoint)

# Practical: caching decorator with TTL
import time
def ttl_cache(seconds=300):
    def decorator(func):
        cache = {}
        @functools.wraps(func)
        def wrapper(*args):
            if args in cache:
                result, timestamp = cache[args]
                if time.time() - timestamp < seconds:
                    return result
            result = func(*args)
            cache[args] = (result, time.time())
            return result
        wrapper.cache_clear = cache.clear
        return wrapper
    return decorator

@ttl_cache(seconds=60)
def get_user(user_id):
    return db.query(f"SELECT * FROM users WHERE id = {user_id}")

# Practical: logging decorator
def log_execution(level="INFO"):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger.log(level, f"Starting {func.__name__}")
            start = time.perf_counter()
            result = func(*args, **kwargs)
            elapsed = time.perf_counter() - start
            logger.log(level, f"Finished {func.__name__} in {elapsed:.3f}s")
            return result
        return wrapper
    return decorator`
  },

  "Class-based decorators": {
    why: "Class-based decorators are needed when you need stateful wrapping (counting calls, maintaining history) or when the decorator logic is too complex for nested functions.",
    code: `# Class-based decorator with state
class CallCounter:
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func
        self.call_count = 0

    def __call__(self, *args, **kwargs):
        self.call_count += 1
        print(f"Call #{self.call_count} to {self.func.__name__}")
        return self.func(*args, **kwargs)

    def reset(self):
        self.call_count = 0

@CallCounter
def process(data):
    return data.upper()

process("hello")  # Call #1 to process
process("world")  # Call #2 to process
print(process.call_count)  # 2

# Practical: caching decorator class
class LRUCache:
    def __init__(self, maxsize=128):
        self.maxsize = maxsize
        self.cache = {}
        self.hits = 0
        self.misses = 0

    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args):
            if args in self.cache:
                self.hits += 1
                return self.cache[args]
            self.misses += 1
            result = func(*args)
            if len(self.cache) >= self.maxsize:
                # Evict oldest
                oldest = next(iter(self.cache))
                del self.cache[oldest]
            self.cache[args] = result
            return result
        wrapper.cache = self.cache
        wrapper.stats = lambda: {"hits": self.hits, "misses": self.misses}
        return wrapper

@LRUCache(maxsize=100)
def expensive_computation(x):
    return x ** 2

# Practical: single dispatch by type
class TypeDispatcher:
    def __init__(self):
        self.handlers = {}

    def register(self, type_):
        def decorator(func):
            self.handlers[type_] = func
            return func
        return decorator

    def __call__(self, value):
        handler = self.handlers.get(type(value))
        if handler:
            return handler(value)
        raise TypeError(f"No handler for {type(value)}")`
  },

  "Timing/retry/cache/ratelimit decorators": {
    why: "Cross-cutting concerns like timing, retrying, and caching appear in many functions. Decorators encapsulate these patterns, keeping business logic clean and avoiding code duplication.",
    code: `import functools, time, random

# Timing decorator
def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

# Retry decorator with exponential backoff
def retry(max_attempts=3, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    delay = 2 ** attempt
                    print(f"Retry {attempt + 1}/{max_attempts} after {delay}s: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

# Cache decorator (manual implementation for understanding)
def cache(func):
    cached = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cached:
            cached[args] = func(*args)
        return cached[args]
    wrapper.cache_clear = cached.clear
    return wrapper

# Rate limit decorator
def rate_limit(max_calls, period=1.0):
    def decorator(func):
        calls = []
        @functools.wraps(func)
        def wrapper(*args):
            now = time.time()
            calls[:] = [t for t in calls if now - t < period]
            if len(calls) >= max_calls:
                raise RuntimeError(f"Rate limit: {max_calls}/{period}s")
            calls.append(now)
            return func(*args)
        return wrapper
    return decorator

# Combine decorators
@timed
@retry(max_attempts=3, exceptions=(ConnectionError,))
@rate_limit(10, period=1.0)
def fetch_data(url):
    return requests.get(url).json()`
  },

  "with & __enter__/__exit__": {
    why: "Context managers guarantee cleanup code runs even when exceptions occur. Without them, resource leaks (open files, database connections, locks) accumulate and eventually crash the system.",
    code: `# Custom context manager with class
class DatabaseConnection:
    def __init__(self, url):
        self.url = url
        self.conn = None

    def __enter__(self):
        self.conn = connect(self.url)
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            self.conn.close()
        if exc_type is not None:
            print(f"Error occurred: {exc_val}")
        return False  # don't suppress exception

# Usage
with DatabaseConnection("postgresql://localhost/mydb") as conn:
    conn.execute("SELECT * FROM users")
# connection guaranteed to close

# Practical: file processing with cleanup
class TempFile:
    def __init__(self, content):
        self.path = Path(tempfile.mktemp(suffix=".txt"))
        self.content = content

    def __enter__(self):
        self.path.write_text(self.content)
        return self.path

    def __exit__(self, *args):
        self.path.unlink(missing_ok=True)

with TempFile("temp data") as path:
    process(path)
# temp file deleted automatically

# Practical: lock management
import threading
class ReadWriteLock:
    def __init__(self):
        self._read_ready = threading.Condition(threading.Lock())
        self._readers = 0

    def __enter__(self):
        self._read_ready.acquire()
        self._readers += 1
        self._read_ready.release()

    def __exit__(self, *args):
        self._read_ready.acquire()
        self._readers -= 1
        if self._readers == 0:
            self._read_ready.notify_all()
        self._read_ready.release()`
  },

  "@contextmanager generator form": {
    why: "Writing __enter__/__exit__ classes requires boilerplate for simple cases. @contextmanager lets you define context managers as generator functions, splitting setup from cleanup with yield.",
    code: `from contextlib import contextmanager
import time

# Generator-based context manager
@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield  # value passed to 'as' clause
    except Exception as e:
        print(f"{label} failed: {e}")
        raise
    else:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")

# Usage
with timer("Data processing"):
    process_large_dataset()
# Data processing: 1.2345s

# With as value
@contextmanager
def managed_file(path, mode):
    f = open(path, mode)
    try:
        yield f  # f is the 'as' value
    finally:
        f.close()

with managed_file("data.txt", "r") as f:
    content = f.read()

# Practical: database transaction
@contextmanager
def transaction(connection):
    conn = connection
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise

with transaction(db) as conn:
    conn.execute("INSERT INTO users ...")

# Practical: temporary directory
@contextmanager
def temp_directory():
    import tempfile
    import shutil
    path = tempfile.mkdtemp()
    try:
        yield path
    finally:
        shutil.rmtree(path)

with temp_directory() as tmpdir:
    # work with tmpdir
    pass
# directory cleaned up automatically`
  },

  "Async context managers async with": {
    why: "Regular context managers block during setup/cleanup. Async context managers (async with) enable non-blocking resource management for database connections, HTTP sessions, and file I/O in async code.",
    code: `import asyncio
from contextlib import asynccontextmanager

# Async context manager with @asynccontextmanager
@asynccontextmanager
async def async_database(url):
    conn = await async_connect(url)
    try:
        yield conn
    finally:
        await conn.close()

# Usage
async def main():
    async with async_database("postgresql://localhost/db") as conn:
        result = await conn.fetch("SELECT * FROM users")

# Class-based async context manager
class AsyncLock:
    def __init__(self):
        self._lock = asyncio.Lock()

    async def __aenter__(self):
        await self._lock.acquire()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self._lock.release()
        return False

# Practical: connection pool
@asynccontextmanager
async def get_connection(pool):
    conn = await pool.acquire()
    try:
        yield conn
    finally:
        await pool.release(conn)

# Practical: rate limiter
@asynccontextmanager
async def rate_limiter(semaphore):
    async with semaphore:
        yield  # limits concurrent access

sem = asyncio.Semaphore(10)  # max 10 concurrent
async with rate_limiter(sem):
    await fetch_data()`
  },

  "ExitStack multiple resources": {
    why: "When you need to manage a dynamic number of context managers (opened in a loop or conditionally), ExitStack handles all of them cleanly. Without it, you end up with deeply nested with-statements.",
    code: `from contextlib import ExitStack

# Dynamic number of context managers
def process_files(paths):
    with ExitStack() as stack:
        files = [
            stack.enter_context(open(p))
            for p in paths
        ]
        # all files open, will all be closed on exit
        for f in files:
            process(f.read())

# Practical: database connections with rollback
def transfer_funds(conn_a, conn_b, amount):
    with ExitStack() as stack:
        # Both connections get transactions
        tx_a = stack.enter_context(conn_a.transaction())
        tx_b = stack.enter_context(conn_b.transaction())
        # If ANY exception occurs, both roll back
        tx_a.execute("UPDATE accounts SET balance = balance - ?", amount)
        tx_b.execute("UPDATE accounts SET balance = balance + ?", amount)

# Practical: cleanup with callback
def complex_operation():
    with ExitStack() as stack:
        resources = []
        for config in configs:
            resource = acquire_resource(config)
            resources.append(resource)
            stack.callback(release_resource, resource)  # cleanup callback

        # Do work with all resources
        for r in resources:
            r.process()
# All resources released even on exception

# Practical: conditional context managers
def maybe_compress(path, compress=False):
    with ExitStack() as stack:
        if compress:
            f = stack.enter_context(compressed_file(path))
        else:
            f = stack.enter_context(open(path))
        return f.read()`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Typing Mastery
  // ============================================================
  "Optional/Union X | Y": {
    why: "Without Optional/Union, you can't express that a function might return None or multiple types. This leads to runtime AttributeError crashes when callers assume a non-None return value.",
    code: `from typing import Optional, Union

# Optional[X] is shorthand for Union[X, None]
def find_user(user_id: int) -> Optional[dict]:
    """Returns user dict or None if not found."""
    return db.get(user_id)

# PEP 604 syntax (Python 3.10+): X | Y instead of Union
def process(value: int | str | float) -> str:
    return str(value)

# Type narrowing with isinstance
def handle_value(value: int | str):
    if isinstance(value, int):
        return value * 2    # type checker knows value is int here
    return value.upper()    # type checker knows value is str here

# Union with callable signatures
def serialize(data: dict | list | str | int) -> str:
    return json.dumps(data)

# Practical: API response typing
from typing import TypeAlias
APIResponse: TypeAlias = dict[str, str | int | float | None]

def fetch_user(user_id: int) -> APIResponse:
    return {"name": "Alice", "age": 30, "email": None}

# Never forget: Optional[X] means X OR None
# WRONG: def find() -> dict:  # crashes on None
# RIGHT: def find() -> Optional[dict]:`
  },

  "TypedDict total schemas": {
    why: "Without TypedDict, JSON data is typed as dict[str, Any], losing all type safety. TypedDict defines the exact shape of dicts, catching missing keys and wrong types at check time.",
    code: `from typing import TypedDict

# Define the shape of a dictionary
class UserDict(TypedDict):
    name: str
    age: int
    email: str | None
    tags: list[str]

# Create typed dict
user: UserDict = {
    "name": "Alice",
    "age": 30,
    "email": "alice@test.com",
    "tags": ["admin", "user"],
}

# Type checker catches errors:
# user["name"] = 123        # Error: expected str
# user["missing"] = "x"     # Error: key not in UserDict

# Partial TypedDict (all fields optional)
class PartialUser(TypedDict, total=False):
    name: str
    age: int

# Practical: API contract
class APISuccess(TypedDict):
    status: int
    data: dict
    message: str

class APIError(TypedDict):
    status: int
    error: str
    details: dict | None

# Practical: config schema
class DatabaseConfig(TypedDict):
    host: str
    port: int
    username: str
    password: str
    pool_size: int
    ssl: bool`
  },

  "Literal & Final": {
    why: "Literal restricts a type to exact values (like 'GET' not just str). Final prevents reassignment of variables. Without them, you can't express constraints like 'this parameter must be exactly one of these values'.",
    code: `from typing import Literal, Final

# Literal: restrict to exact values
HTTPMethod = Literal["GET", "POST", "PUT", "DELETE"]

def request(url: str, method: HTTPMethod = "GET"):
    pass

request("http://api.com", "GET")     # OK
request("http://api.com", "PATCH")   # type error!

# Final: constant (cannot be reassigned)
MAX_RETRIES: Final = 3
PI: Final = 3.14159

# MAX_RETRIES = 5  # type error: cannot assign to Final

# Literal with complex types
Status = Literal["active", "pending", "archived"]
Priority = Literal[1, 2, 3]

# Practical: strict configuration
class LogLevel(Final):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"

def configure_logging(level: Literal["DEBUG", "INFO", "WARNING", "ERROR"]):
    logging.basicConfig(level=level)

# Final for class attributes
class Config:
    MAX_CONNECTIONS: Final = 100
    VERSION: Final = "2.1.0"
    # These cannot be reassigned in subclasses or instances`
  },

  "Protocol static duck typing": {
    why: "Without Protocol, you need inheritance or ABCs to define interfaces. Protocol enables structural subtyping — any class with the right methods satisfies the type, even without explicit inheritance.",
    code: `from typing import Protocol, runtime_checkable

# Define interface with Protocol (no inheritance needed)
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> str: ...

@runtime_checkable
class AreaCalc(Protocol):
    def area(self) -> float: ...

# These classes satisfy the Protocol WITHOUT inheriting from it
class Circle:
    def __init__(self, r: float):
        self.r = r
    def draw(self) -> str:
        return f"Drawing circle r={self.r}"
    def area(self) -> float:
        return 3.14159 * self.r ** 2

class Square:
    def __init__(self, s: float):
        self.s = s
    def draw(self) -> str:
        return f"Drawing square s={self.s}"
    def area(self) -> float:
        return self.s ** 2

# Function accepts ANY object with .draw() — no inheritance required
def render(obj: Drawable):
    print(obj.draw())

render(Circle(5))  # works
render(Square(3))  # works

# Practical: comparable objects
class Comparable(Protocol):
    def __lt__(self, other: "Comparable") -> bool: ...

def find_min(items: list[Comparable]) -> Comparable:
    return min(items)

# Runtime check
print(isinstance(Circle(1), Drawable))  # True
print(isinstance("hello", Drawable))     # False`
  },

  "Generic[T] & TypeVar": {
    why: "Without generics, container types lose their element type information. list can hold anything, but list[str] guarantees strings. TypeVar enables writing functions that work with any type while preserving type safety.",
    code: `from typing import TypeVar, Generic

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")

# Generic container
class Stack(Generic[T]):
    def __init__(self):
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

# Type is preserved
int_stack: Stack[int] = Stack()
int_stack.push(42)
value: int = int_stack.pop()  # type checker knows this is int

# TypeVar with bounds
from typing import Comparable
Number = TypeVar("Number", int, float)

def largest(a: Number, b: Number) -> Number:
    return a if a > b else b

# Generic function
T2 = TypeVar("T2")

def first(items: list[T2]) -> T2 | None:
    return items[0] if items else None

result: str | None = first(["a", "b", "c"])  # preserves str type

# Practical: repository pattern
class Repository(Generic[T]):
    def __init__(self, db):
        self.db = db

    def get(self, id: int) -> T | None:
        return self.db.query(T).get(id)

    def save(self, entity: T) -> T:
        self.db.add(entity)
        return entity`
  },

  "Callable[[Arg], Ret]": {
    why: "Without Callable type hints, function parameters that accept callbacks are typed as Any, losing all type safety. Callable specifies exact argument and return types for callback parameters.",
    code: `from typing import Callable

# Simple callable type
def apply(func: Callable[[int], int], value: int) -> int:
    return func(value)

apply(lambda x: x * 2, 5)  # OK
# apply(lambda x: x * 2, "hello")  # type error: expected int

# Multiple arguments
def combine(
    a: int,
    b: int,
    operation: Callable[[int, int], int]
) -> int:
    return operation(a, b)

# Callable with no arguments
def repeat(func: Callable[[], None], times: int) -> None:
    for _ in range(times):
        func()

# Callable that returns nothing
def on_event(event: str, handlers: list[Callable[[str], None]]) -> None:
    for handler in handlers:
        handler(event)

# Practical: middleware pattern
Middleware = Callable[[Callable[..., None]], Callable[..., None]]

def timing_middleware(func: Callable) -> Callable:
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter() - start:.3f}s")
        return result
    return wrapper

# Practical: event system
EventHandler = Callable[[dict], None]

class EventBus:
    def __init__(self):
        self.handlers: dict[str, list[EventHandler]] = {}

    def on(self, event: str, handler: EventHandler) -> None:
        self.handlers.setdefault(event, []).append(handler)

    def emit(self, event: str, data: dict) -> None:
        for handler in self.handlers.get(event, []):
            handler(data)`
  },

  "Annotated metadata": {
    why: "Without Annotated, adding validation constraints to types requires separate documentation or runtime inspection. Annotated embeds metadata directly in type hints for frameworks like FastAPI and Pydantic.",
    code: `from typing import Annotated, get_type_hints
from pydantic import BaseModel, Field

# Annotated: attach metadata to types
UserId = Annotated[int, Field(gt=0, description="Unique user identifier")]
UserName = Annotated[str, Field(min_length=1, max_length=100)]

# FastAPI usage (Pydantic handles validation)
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(
    user_id: Annotated[int, Query(gt=0, description="User ID")],
    search: Annotated[str | None, Query(max_length=200)] = None
):
    return {"user_id": user_id}

# Pydantic models with Annotated
class CreateUserRequest(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    age: Annotated[int, Field(ge=0, le=150)]
    email: Annotated[str, Field(pattern=r"^\\S+@\\S+\\.\\S+$")]

# Custom annotations
import logging
LogLevel = Annotated[str, "Must be DEBUG, INFO, WARNING, or ERROR"]

# Extract metadata at runtime
hints = get_type_hints(CreateUserRequest, include_extras=True)
# Annotated metadata accessible via typing.get_type_hints`
  },

  "cast/NewType": {
    why: "When you know more about a type than the type checker (after isinstance check or API contract), cast tells the checker the correct type. NewType creates distinct types that prevent mixing unrelated values.",
    code: `from typing import cast, NewType

# NewType: create distinct types from base types
UserId = NewType("UserId", int)
OrderId = NewType("OrderId", int)

# These are different types to the type checker
user_id: UserId = UserId(42)
order_id: OrderId = OrderId(42)

# Wrong type: type error!
def get_user(id: UserId): pass
get_user(order_id)  # type error: expected UserId, got OrderId

# cast: tell type checker about runtime type
def process(data: Any) -> str:
    result = json.loads(data)  # type: Any
    # We know this returns a dict, but checker doesn't
    typed_result = cast(dict[str, str], result)
    return typed_result["name"]  # type checker accepts this

# Practical: API response narrowing
def fetch_user(user_id: int) -> dict:
    response = requests.get(f"/users/{user_id}")
    return cast(dict, response.json())  # we know it's a dict

# Practical: distinct ID types prevent mixing
UserId = NewType("UserId", int)
ProductId = NewType("ProductId", int)

def get_user(id: UserId): ...
def get_product(id: ProductId): ...

user_id = UserId(1)
product_id = ProductId(1)
get_user(user_id)      # OK
get_user(product_id)   # type error — prevents bugs!`
  },

  "mypy/pyright strict mode": {
    why: "Without strict type checking in CI, type annotations are just documentation that drifts from reality. Strict mode catches Optional misses, missing return statements, and unsafe type operations.",
    code: `# pyproject.toml
[tool.mypy]
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.pyright]
typeCheckingMode = "strict"

# Common strict mode errors and fixes:

# Error: Missing return statement
def process(x: int) -> int:
    if x > 0:
        return x * 2
    # Missing return for x <= 0!
    # Fix: add else return

# Error: Incompatible return type
def get_name() -> str:
    return None  # type error: expected str, got None
    # Fix: -> str | None

# Error: Missing type annotation
def add(a, b):  # missing annotations
    return a + b
    # Fix: def add(a: int, b: int) -> int:

# CI gate with mypy
# .github/workflows/ci.yml:
# - name: Type check
#   run: mypy --strict src/

# Practical: incremental strictness
# Start with: mypy --ignore-missing-imports
# Then: mypy --disallow-untyped-defs
# Finally: mypy --strict`
  },

  "Overloads precise stubs": {
    why: "When a function returns different types based on input (like json.loads returning str|dict|list), overload tells the type checker exactly what type to expect for each input pattern.",
    code: `from typing import overload

# Overload: multiple signatures for one function
@overload
def fetch(url: str) -> str: ...
@overload
def fetch(url: str, as_json: Literal[True]) -> dict: ...
@overload
def fetch(url: str, as_json: Literal[False]) -> str: ...

def fetch(url: str, as_json: bool = False) -> str | dict:
    response = requests.get(url)
    if as_json:
        return response.json()
    return response.text

# Type checker knows exact return type
result = fetch("http://api.com")           # str
result = fetch("http://api.com", True)     # dict

# Practical: type-safe factory
@overload
def create_user(name: str) -> User: ...
@overload
def create_user(name: str, role: str) -> AdminUser: ...

def create_user(name: str, role: str | None = None) -> User | AdminUser:
    if role:
        return AdminUser(name, role)
    return User(name)

# Overload with class methods
class DataProcessor:
    @overload
    def process(self, data: str) -> str: ...
    @overload
    def process(self, data: bytes) -> bytes: ...
    @overload
    def process(self, data: list) -> list: ...

    def process(self, data):
        if isinstance(data, str):
            return data.upper()
        elif isinstance(data, bytes):
            return data.upper()
        return [self.process(x) for x in data]`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — OOP Deep Dive
  // ============================================================
  "MRO & C3 linearization": {
    why: "When a class inherits from multiple parents with shared ancestors, MRO determines the method lookup order. Without understanding MRO, diamond inheritance causes methods to be called multiple times or wrong methods to execute.",
    code: `class A:
    def method(self): print("A")

class B(A):
    def method(self): print("B")

class C(A):
    def method(self): print("C")

class D(B, C):
    pass

# MRO: D -> B -> C -> A -> object
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

D().method()  # B — follows MRO

# Practical: Django-style mixin resolution
class SerializerMixin:
    def to_dict(self):
        return {k: v for k, v in self.__dict__.items()}

class ValidatorMixin:
    def validate(self):
        return all(v is not None for v in self.__dict__.values())

class User(SerializerMixin, ValidatorMixin):
    def __init__(self, name, email):
        self.name = name
        self.email = email

user = User("Alice", "a@test.com")
print(user.to_dict())    # from SerializerMixin
print(user.validate())   # from ValidatorMixin

# C3 linearization ensures consistent ordering
# Python raises TypeError if MRO is impossible
# class X(A, B, A): ...  # TypeError: inconsistent MRO`
  },

  "Abstract base classes abc.ABC/abstractmethod": {
    why: "Without ABCs, you can't prevent instantiation of incomplete classes or enforce method implementation. ABCs catch missing methods at instantiation time instead of at runtime when the method is called.",
    code: `from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float) -> bool:
        """Charge the given amount. Returns True if successful."""
        ...

    @abstractmethod
    def refund(self, transaction_id: str) -> bool:
        """Refund a transaction."""
        ...

    def process_payment(self, amount: float) -> bool:
        """Template method: uses abstract methods."""
        if not self.validate(amount):
            return False
        return self.charge(amount)

    def validate(self, amount: float) -> bool:
        return amount > 0

# Cannot instantiate abstract class
# processor = PaymentProcessor()  # TypeError!

# Must implement ALL abstract methods
class StripeProcessor(PaymentProcessor):
    def charge(self, amount: float) -> bool:
        print(f"Charging ${amount:.2f} via Stripe")
        return True

    # Missing refund() -> still abstract!
    # stripe = StripeProcessor()  # TypeError!

class FullStripeProcessor(PaymentProcessor):
    def charge(self, amount: float) -> bool:
        return True
    def refund(self, transaction_id: str) -> bool:
        return True

processor = FullStripeProcessor()  # OK
processor.process_payment(100.0)    # works`
  },

  "Dunder suite __eq__/__hash__/__lt__": {
    why: "Without __eq__ and __hash__, objects use identity comparison (is) and can't be used in sets or as dict keys. Defining __eq__ without __hash__ makes objects unhashable, breaking set operations.",
    code: `from dataclasses import dataclass

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

    def __lt__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) < (other.x, other.y)

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p1 = Point(3, 4)
p2 = Point(3, 4)
print(p1 == p2)         # True
print(hash(p1) == hash(p2))  # True
print({p1, p2})          # {Point(3, 4)} — deduplicates

# Practical: dataclass handles this automatically
@dataclass(frozen=True)
class AutoPoint:
    x: float
    y: float

# dataclass auto-generates __eq__, __hash__, __repr__, __lt__ (with order=True)

# sortable model
@dataclass(order=True)
class Task:
    priority: int
    title: str

tasks = [Task(3, "low"), Task(1, "high")]
print(sorted(tasks))  # [Task(1, 'high'), Task(3, 'low')]`
  },

  "@total_ordering": {
    why: "Implementing all 6 comparison methods (__lt__, __le__, __gt__, __ge__, __eq__, __ne__) is tedious. @total_ordering generates the missing ones from just __eq__ and one ordering method.",
    code: `from functools import total_ordering

@total_ordering
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __eq__(self, other):
        if not isinstance(other, Temperature):
            return NotImplemented
        return self.celsius == other.celsius

    def __lt__(self, other):
        if not isinstance(other, Temperature):
            return NotImplemented
        return self.celsius < other.celsius

    def __repr__(self):
        return f"Temperature({self.celsius}°C)"

# @total_ordering generates: __le__, __gt__, __ne__
t1 = Temperature(100)
t2 = Temperature(50)

print(t1 > t2)    # True — auto-generated
print(t1 >= t2)   # True — auto-generated
print(t1 != t2)   # True — auto-generated
print(t1 <= t1)   # True — auto-generated

# Sorting works
temps = [Temperature(100), Temperature(0), Temperature(37)]
print(sorted(temps))  # [Temperature(0°C), Temperature(37°C), Temperature(100°C)]

# Practical: version comparison
@total_ordering
class Version:
    def __init__(self, major, minor, patch):
        self.major = major
        self.minor = minor
        self.patch = patch

    def __eq__(self, other):
        return (self.major, self.minor, self.patch) == (other.major, other.minor, other.patch)

    def __lt__(self, other):
        return (self.major, self.minor, self.patch) < (other.major, other.minor, other.patch)

print(Version(1, 0, 0) < Version(1, 1, 0))  # True`
  },

  "__slots__": {
    why: "Without __slots__, every instance stores attributes in a __dict__ (a dict), consuming 50+ bytes per attribute. __slots__ eliminates this overhead, cutting memory by 40-60% for millions of objects.",
    code: `import sys

# Without __slots__: uses __dict__ (wasteful)
class RegularPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = RegularPoint(3, 4)
print(sys.getsizeof(p))          # 48 bytes (object overhead)
print(sys.getsizeof(p.__dict__)) # 64 bytes (attribute storage)
# Total: ~112 bytes per instance

# With __slots__: no __dict__ (memory efficient)
class SlotPoint:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = SlotPoint(3, 4)
print(sys.getsizeof(p))  # 48 bytes (just the object, no dict)
# Total: ~48 bytes per instance — 57% less!

# Cannot add arbitrary attributes
try:
    p.z = 5  # AttributeError: 'SlotPoint' object has no attribute 'z'
except AttributeError as e:
    print(e)

# Practical: millions of objects
class DataPoint:
    __slots__ = ("timestamp", "value", "label")
    def __init__(self, ts, val, lbl):
        self.timestamp = ts
        self.value = val
        self.label = lbl

# 1 million objects: ~48MB with slots vs ~112MB without
# Warning: __slots__ + inheritance requires careful planning
# Slots classes can't add new slots in subclasses easily`
  },

  "Descriptors protocol": {
    why: "Descriptors underpin properties, classmethods, and staticmethods. Understanding them lets you create custom attribute access patterns like lazy evaluation, validation, and database column mapping.",
    code: `# Descriptor: any class with __get__, __set__, or __delete__

class Validated:
    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value

    def __set_name__(self, owner, name):
        self.name = name  # attribute name is set at class creation

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, f"_{self.name}", None)

    def __set__(self, obj, value):
        if self.min_value is not None and value < self.min_value:
            raise ValueError(f"{self.name} must be >= {self.min_value}")
        if self.max_value is not None and value > self.max_value:
            raise ValueError(f"{self.name} must be <= {self.max_value}")
        setattr(obj, f"_{self.name}", value)

class Product:
    name = Validated()
    price = Validated(min_value=0.01)
    quantity = Validated(min_value=0)

    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity

p = Product("Widget", 9.99, 100)
p.price = -5  # ValueError: price must be >= 0.01

# Practical: lazy property with descriptors
class LazyProperty:
    def __init__(self, func):
        self.func = func
        self.attrname = None

    def __set_name__(self, owner, name):
        self.attrname = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = self.func(obj)
        setattr(obj, self.attrname, value)  # cache on instance
        return value

class DataProcessor:
    @LazyProperty
    def expensive_result(self):
        print("Computing...")
        return heavy_computation()`
  },

  "__init_subclass__ hook": {
    why: "Without __init_subclass__, plugin registration requires metaclasses or decorator hacks. __init_subclass__ runs when a subclass is created, enabling automatic registration without metaclass complexity.",
    code: `# __init_subclass__: hook when subclass is created
class Plugin:
    _registry = {}

    def __init_subclass__(cls, plugin_name=None, **kwargs):
        super().__init_subclass__(**kwargs)
        name = plugin_name or cls.__name__.lower()
        Plugin._registry[name] = cls
        print(f"Registered plugin: {name}")

class CSVPlugin(Plugin, plugin_name="csv"):
    def process(self, data):
        return "csv processing"

class JSONPlugin(Plugin, plugin_name="json"):
    def process(self, data):
        return "json processing"

print(Plugin._registry)  # {'csv': <class 'CSVPlugin'>, 'json': <class 'JSONPlugin'>}

# Practical: auto-register validators
class Validator:
    _validators = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if hasattr(cls, 'field_type'):
            Validator._validators[cls.field_type] = cls

class EmailValidator(Validator):
    field_type = "email"
    def validate(self, value):
        return "@" in value

class PhoneValidator(Validator):
    field_type = "phone"
    def validate(self, value):
        return value.isdigit()

# Auto-discovered validators
print(Validator._validators)  # {'email': EmailValidator, 'phone': PhoneValidator}`
  },

  "Mixins composition": {
    why: "Deep inheritance trees are fragile — changing a base class breaks all descendants. Mixins provide reusable behavior through composition instead of inheritance, keeping hierarchies flat and flexible.",
    code: `# Mixins: small, focused behavior classes
class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__, indent=2, default=str)

    @classmethod
    def from_json(cls, data):
        import json
        return cls(**json.loads(data))

class LogMixin:
    def log(self, message):
        print(f"[{type(self).__name__}] {message}")

class ValidationMixin:
    def validate(self):
        errors = []
        for field, value in self.__dict__.items():
            if value is None:
                errors.append(f"{field} is required")
        return errors

# Compose behaviors without deep inheritance
class User(JsonMixin, LogMixin, ValidationMixin):
    def __init__(self, name, email):
        self.name = name
        self.email = email

user = User("Alice", "alice@test.com")
print(user.to_json())       # from JsonMixin
user.log("created")          # from LogMixin
print(user.validate())       # from ValidationMixin

# Practical: multiple behavior injection
class Serializable:
    def serialize(self):
        return {k: str(v) for k, v in self.__dict__.items()}

class Cacheable:
    def cache_key(self):
        return f"{type(self).__name__}:{hash(str(self.__dict__))}"

class Product(Serializable, Cacheable):
    def __init__(self, name, price):
        self.name = name
        self.price = price`
  },

  "Dataclass vs attrs vs pydantic": {
    why: "Different data classes serve different needs: dataclasses for simple structs, attrs for validation and slots, pydantic for runtime validation and serialization. Choosing wrong adds unnecessary complexity.",
    code: `from dataclasses import dataclass, field

# Dataclass: stdlib, simple, no validation
@dataclass
class UserDC:
    name: str
    email: str
    age: int = 0

user = UserDC("Alice", "alice@test.com")

# attrs: more features (slots, validation, converters)
# import attr
# @attr.s(slots=True, auto_attribs=True)
# class UserAttrs:
#     name: str = attr.ib(validator=attr.validators.instance_of(str))
#     email: str = attr.ib()
#     age: int = attr.ib(default=0, validator=attr.validators.ge(0))

# Pydantic: runtime validation, serialization, JSON Schema
# from pydantic import BaseModel, Field, EmailStr
# class UserPydantic(BaseModel):
#     name: str = Field(min_length=1)
#     email: EmailStr
#     age: int = Field(ge=0, le=150)
#
# user = UserPydantic(name="Alice", email="alice@test.com")  # validated!

# When to use which:
# dataclass: simple value objects, no validation needed
# attrs: need slots, converters, validators, frozen
# pydantic: API models, config, deserialization, JSON Schema
# NamedTuple: immutable records, need tuple behavior
# TypedDict: typed dicts for API responses`
  },

  "Weakrefs observer pattern": {
    why: "Strong references prevent garbage collection. In observer patterns, subject-to-observer references prevent observers from being collected when no other references exist, causing memory leaks.",
    code: `import weakref

# Observer pattern without memory leaks
class EventManager:
    def __init__(self):
        self._listeners = weakref.WeakSet()

    def subscribe(self, listener):
        self._listeners.add(listener)

    def notify(self, event):
        for listener in self._listeners:
            listener.on_event(event)

class Observer:
    def __init__(self, name):
        self.name = name

    def on_event(self, event):
        print(f"{self.name} received: {event}")

# Subject
manager = EventManager()

# Subscribe observers
obs1 = Observer("Alice")
obs2 = Observer("Bob")
manager.subscribe(obs1)
manager.subscribe(obs2)

manager.notify("update")  # Both receive

# Delete observer — automatically removed from WeakSet
del obs1
manager.notify("change")  # Only Bob receives

# Practical: cache without preventing GC
_cache = weakref.WeakValueDictionary()

class ExpensiveObject:
    def __init__(self, data):
        self.data = data

# Cache object
obj = ExpensiveObject("large dataset")
_cache["key"] = obj  # weak reference

# When obj is deleted, cache entry disappears
del obj
print("key" in _cache)  # False`

  },

  "copy deepcopy & pickling pitfalls": {
    why: "Shallow copy doesn't copy nested objects, causing shared state bugs. Deep copy is expensive and can fail on objects with C extensions. Pickling can't handle lambdas, generators, or database connections.",
    code: `import copy

# Shallow copy: copies outer object, references inner objects
original = [[1, 2], [3, 4]]
shallow = original.copy()
shallow[0][0] = 99
print(original[0][0])  # 99 — shared nested list!

# Deep copy: recursively copies everything
deep = copy.deepcopy(original)
deep[0][0] = 0
print(original[0][0])  # 99 — independent

# Pickling: serialization (can't handle everything!)
import pickle

class Cached:
    def __init__(self, func):
        self.func = func
        self.cache = {}
    def __call__(self, *args):
        if args not in self.cache:
            self.cache[args] = self.func(*args)
        return self.cache[args]

# This will FAIL:
# cached_func = Cached(lambda x: x * 2)
# pickle.dumps(cached_func)  # PicklingError: Can't pickle lambda

# Pickling can't handle:
# - lambdas, generators, coroutines
# - file handles, sockets, database connections
# - C extension objects (usually)
# - Objects with __slots__ that don't define __getstate__/__setstate__

# Custom pickling
class CustomPicklable:
    def __init__(self, data, connection):
        self.data = data
        self.connection = connection  # can't pickle!

    def __getstate__(self):
        state = self.__dict__.copy()
        del state["connection"]  # exclude unpicklable
        return state

    def __setstate__(self, state):
        self.__dict__.update(state)
        self.connection = reconnect()  # restore connection`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Concurrency
  // ============================================================
  "threading Thread/Lock/RLock": {
    why: "Threads share memory, so concurrent writes to shared data cause race conditions. Without Lock, two threads can read-modify-write simultaneously, corrupting data. GIL protects Python internals but not your code.",
    code: `import threading

# Race condition WITHOUT lock
counter = 0

def unsafe_increment():
    global counter
    for _ in range(100000):
        counter += 1  # NOT atomic! read-modify-write

threads = [threading.Thread(target=unsafe_increment) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)  # Less than 500000! Race condition!

# Safe WITH lock
counter = 0
lock = threading.Lock()

def safe_increment():
    global counter
    for _ in range(100000):
        with lock:  # only one thread at a time
            counter += 1

threads = [threading.Thread(target=safe_increment) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)  # Exactly 500000!

# RLock: reentrant (same thread can acquire multiple times)
rlock = threading.RLock()
def nested():
    with rlock:
        with rlock:  # OK with RLock, deadlock with Lock!
            print("nested")

# Practical: thread-safe counter
class ThreadSafeCounter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self._value += 1

    @property
    def value(self):
        with self._lock:
            return self._value`
  },

  "Condition/Event/Semaphore": {
    why: "Lock only prevents concurrent access. Condition enables waiting for a state change. Event signals one-time occurrences. Semaphore limits concurrent access to N threads. Without these, threads busy-wait wasting CPU.",
    code: `import threading

# Condition: wait for a state change
class BoundedBuffer:
    def __init__(self, capacity):
        self.buffer = []
        self.capacity = capacity
        self.condition = threading.Condition()

    def produce(self, item):
        with self.condition:
            while len(self.buffer) >= self.capacity:
                self.condition.wait()  # wait until space available
            self.buffer.append(item)
            self.condition.notify()  # notify consumer

    def consume(self):
        with self.condition:
            while not self.buffer:
                self.condition.wait()  # wait until item available
            item = self.buffer.pop(0)
            self.condition.notify()  # notify producer
            return item

# Event: signal between threads
event = threading.Event()
def waiter():
    print("Waiting for signal...")
    event.wait()  # blocks until event.set()
    print("Got signal!")

def sender():
    import time
    time.sleep(1)
    event.set()  # wake up all waiters

# Semaphore: limit concurrent access
sem = threading.Semaphore(3)  # max 3 concurrent

def limited_worker(worker_id):
    with sem:
        print(f"Worker {worker_id} running (max 3 at a time)")
        import time
        time.sleep(1)

threads = [threading.Thread(target=limited_worker, args=(i,)) for i in range(10)]`
  },

  "concurrent.futures ThreadPoolExecutor": {
    why: "Manual thread management with Thread() is error-prone. ThreadPoolExecutor provides a clean API for I/O-bound parallelism with automatic cleanup and result collection.",
    code: `from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

# Basic usage
def fetch_url(url):
    return requests.get(url, timeout=10).status_code

urls = ["https://example.com"] * 10

# Simple: map
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(fetch_url, urls))
print(results)  # [200, 200, ...]

# Advanced: as_completed (results in finish order)
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(fetch_url, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        try:
            status = future.result()
            print(f"{url}: {status}")
        except Exception as e:
            print(f"{url} failed: {e}")

# Practical: parallel file processing
def process_file(path):
    with open(path) as f:
        return len(f.readlines())

import glob
py_files = glob.glob("**/*.py", recursive=True)

with ThreadPoolExecutor(max_workers=8) as executor:
    sizes = list(executor.map(process_file, py_files))

print(f"Total lines: {sum(sizes)}")
print(f"Processed {len(py_files)} files with {8} threads")`
  },

  "ProcessPoolExecutor": {
    why: "Threads can't bypass the GIL for CPU-bound work. ProcessPoolExecutor spawns separate Python processes, each with its own GIL, enabling true parallelism for CPU-intensive tasks.",
    code: `from concurrent.futures import ProcessPoolExecutor
import multiprocessing

def cpu_bound_task(n):
    """CPU-heavy computation."""
    return sum(i * i for i in range(n))

# CPU-bound: use processes, not threads
numbers = [10**7] * 4

# WRONG: threads (GIL prevents parallelism)
# with ThreadPoolExecutor(4) as ex:
#     results = list(ex.map(cpu_bound_task, numbers))  # serial!

# CORRECT: processes (bypass GIL)
with ProcessPoolExecutor(max_workers=multiprocessing.cpu_count()) as executor:
    results = list(executor.map(cpu_bound_task, numbers))

print(results)

# Practical: parallel data processing
def process_chunk(chunk):
    return [transform(record) for record in chunk]

# Split data into chunks
chunk_size = len(data) // multiprocessing.cpu_count()
chunks = [data[i:i+chunk_size] for i in range(0, len(data), chunk_size)]

with ProcessPoolExecutor() as executor:
    processed = list(executor.map(process_chunk, chunks))

# Flatten results
all_results = [item for chunk in processed for item in chunk]

# Note: arguments must be picklable for cross-process transfer`
  },

  "asyncio event loop": {
    why: "asyncio uses cooperative scheduling — tasks must yield control with await for others to run. Without understanding the event loop, developers block the loop with sync code, defeating the purpose of async.",
    code: `import asyncio

# Event loop: the core of asyncio
async def main():
    print("Starting")

    # Concurrent tasks (run on same thread, cooperative)
    async def fetch(url):
        await asyncio.sleep(1)  # yields control
        return f"Data from {url}"

    # Run concurrently (not sequentially!)
    results = await asyncio.gather(
        fetch("url1"),
        fetch("url2"),
        fetch("url3"),
    )
    print(results)  # All complete in ~1 second, not 3

    # Create task (runs concurrently)
    task = asyncio.create_task(slow_operation())
    # Do other work while task runs...
    result = await task

# Run the event loop
asyncio.run(main())

# NEVER block the event loop!
async def bad_example():
    import time
    time.sleep(5)  # BLOCKS entire loop! Other tasks wait!

async def good_example():
    await asyncio.sleep(5)  # Yields control, others can run

# Practical: timeout
async def fetch_with_timeout(url, timeout=5):
    try:
        return await asyncio.wait_for(fetch(url), timeout=timeout)
    except asyncio.TimeoutError:
        print(f"Timeout fetching {url}")`
  },

  "async/await syntax": {
    why: "async/await defines coroutines that can pause execution. Without understanding that await yields control, developers write sequential-looking async code that actually blocks the event loop.",
    code: `import asyncio

# async def creates a coroutine function
async def greet(name):
    print(f"Hello {name}")
    await asyncio.sleep(1)  # yields control to event loop
    print(f"Goodbye {name}")

# Calling creates a coroutine object (doesn't run it!)
coro = greet("Alice")  # coroutine object

# Must await or run it
asyncio.run(coro)  # actually executes

# Practical: concurrent API calls
async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks)

async def fetch_one(session, url):
    async with session.get(url) as response:
        return await response.json()

# Practical: producer/consumer with async queue
async def producer(queue):
    for i in range(10):
        await asyncio.sleep(0.1)
        await queue.put({"job": i})
    await queue.put(None)  # poison pill

async def consumer(queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"Processing {item}")
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=5)
    prod_task = asyncio.create_task(producer(queue))
    cons_task = asyncio.create_task(consumer(queue))
    await prod_task
    await cons_task`
  },

  "asyncio.gather/wait/as_completed": {
    why: "Running async tasks one-by-one wastes time. gather/wait/as_completed enable concurrent execution, but choosing the wrong one causes either waiting for slowest or losing results from failed tasks.",
    code: `import asyncio

async def fetch(url, delay):
    await asyncio.sleep(delay)
    return f"Data from {url}"

async def main():
    urls = ["url1", "url2", "url3"]
    delays = [1, 2, 0.5]

    # gather: wait for ALL, return in order
    results = await asyncio.gather(*[
        fetch(url, d) for url, d in zip(urls, delays)
    ])
    print(results)  # ['Data from url1', 'Data from url2', 'Data from url3']

    # gather with return_exceptions=True (don't raise)
    results = await asyncio.gather(
        fetch("ok", 1),
        fetch("fail", 0),  # simulates failure
        return_exceptions=True
    )
    # results = ['Data from ok', Exception(...)]

    # wait: first to complete, or ALL, or timeout
    tasks = [asyncio.create_task(fetch(u, d)) for u, d in zip(urls, delays)]

    # FIRST_COMPLETED
    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    for task in done:
        print(f"First result: {task.result()}")

    # as_completed: iterate results as they finish
    tasks = [asyncio.create_task(fetch(u, d)) for u, d in zip(urls, delays)]
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(f"Got: {result}")  # in finish order, not input order

asyncio.run(main())`
  },

  "async generators & streams": {
    why: "Async generators enable lazy production of data in async contexts. Without them, you'd need to preload entire datasets into memory before async processing.",
    code: `import asyncio

# Async generator
async def async_range(n):
    for i in range(n):
        await asyncio.sleep(0.1)  # simulate async I/O
        yield i

async def main():
    # Consume async generator
    async for value in async_range(10):
        print(value)

    # Async comprehension
    results = [x async for x in async_range(10) if x % 2 == 0]
    print(results)  # [0, 2, 4, 6, 8]

# Async streams: read/write without loading everything
async def process_stream(reader, writer):
    while True:
        data = await reader.read(1024)
        if not data:
            break
        writer.write(data.upper())
        await writer.drain()
    writer.close()

# Practical: async file processing
async def async_read_lines(path):
    import aiofiles
    async with aiofiles.open(path) as f:
        async for line in f:
            yield line.strip()

# Practical: pipeline with backpressure
async def pipeline(source, transform, sink):
    async for item in source:
        result = await transform(item)
        await sink(result)`

  },

  "run_in_executor": {
    why: "Many libraries (requests, psycopg2, etc.) are synchronous. run_in_executor offloads blocking calls to a thread/process pool, preventing them from blocking the async event loop.",
    code: `import asyncio
from concurrent.futures import ThreadPoolExecutor

# Blocking library in async code
import requests  # blocking!

async def fetch_async(url):
    loop = asyncio.get_event_loop()
    # Offload blocking call to thread pool
    response = await loop.run_in_executor(
        None,  # None = default ThreadPoolExecutor
        requests.get,
        url
    )
    return response.json()

async def main():
    # Concurrent non-blocking requests
    results = await asyncio.gather(
        fetch_async("https://api1.com/data"),
        fetch_async("https://api2.com/data"),
    )

# Practical: sync database in async code
async def query_db(sql):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, db.execute, sql
    )

# Practical: CPU-bound in async
async def process_data(data):
    loop = asyncio.get_event_loop()
    with ProcessPoolExecutor() as pool:
        return await loop.run_in_executor(pool, heavy_computation, data)

asyncio.run(main())`
  },

  "TaskGroups 3.11": {
    why: "Without TaskGroups, managing multiple async tasks requires manual error handling and cleanup. TaskGroups provide structured concurrency — all tasks complete or all are cancelled, preventing orphaned tasks.",
    code: `import asyncio

# TaskGroup: structured concurrency (Python 3.11+)
async def main():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch("url1"))
        task2 = tg.create_task(fetch("url2"))
        task3 = tg.create_task(fetch("url3"))
    # All tasks guaranteed complete (or cancelled on error)

    print(task1.result(), task2.result(), task3.result())

# If ANY task raises, ALL tasks are cancelled
async def risky():
    await asyncio.sleep(1)
    raise ValueError("Something went wrong")

async def safe():
    await asyncio.sleep(1)
    return "done"

try:
    async with asyncio.TaskGroup() as tg:
        tg.create_task(risky())
        tg.create_task(safe())
except* ValueError as eg:
    print(f"Task failed: {eg.exceptions}")

# Practical: parallel HTTP with error handling
async def fetch_all(urls):
    results = {}
    async with asyncio.TaskGroup() as tg:
        tasks = {
            url: tg.create_task(fetch_with_retry(url))
            for url in urls
        }
    return {url: task.result() for url, task in tasks.items()}`
  },

  "Choosing threads vs processes vs asyncio": {
    why: "Using threads for CPU-bound work wastes time (GIL). Using processes for I/O-bound work wastes resources (process startup). Using asyncio for CPU-bound work blocks the loop. The right choice depends on the workload type.",
    code: `# Decision table:
# ┌─────────────────────┬───────────┬─────────────┬──────────────┐
# │ Workload Type       │ Best Tool │ Why         │ Example      │
# ├─────────────────────┼───────────┼─────────────┼──────────────┤
# │ I/O-bound, few      │ asyncio   │ Low overhead│ API calls    │
# │ I/O-bound, many     │ threads   │ More parallel│ File I/O    │
# │ CPU-bound           │ processes │ Bypasses GIL│ Math/ML      │
# │ Mixed               │ processes │ Best overall│ Data pipeline│
# └─────────────────────┴───────────┴─────────────┴──────────────┘

# I/O-bound (network, files): asyncio
async def io_bound():
    async with aiohttp.ClientSession() as session:
        await asyncio.gather(*[fetch(session, url) for url in urls])

# I/O-bound (blocking libs): threads
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=20) as ex:
    results = list(ex.map(requests.get, urls))

# CPU-bound: processes
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor() as ex:
    results = list(ex.map(cpu_heavy, data_chunks))

# Mixed: processes for CPU, threads for I/O within each
async def mixed():
    with ProcessPoolExecutor() as pool:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(pool, cpu_heavy, data)`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Performance & Memory
  // ============================================================
  "timeit microbenchmarks": {
    why: "Measuring performance with time.time() is unreliable due to system overhead. timeit disables garbage collection and runs multiple iterations for accurate microbenchmarks.",
    code: `import timeit

# Basic timeit
time = timeit.timeit('sum(range(1000))', number=10000)
print(f"Total: {time:.3f}s")

# timeit with setup
time = timeit.timeit(
    'append(item)',
    setup='items = []; item = 42',
    number=100000
)

# Compare approaches
list_comp = timeit.timeit('[x**2 for x in range(100)]', number=10000)
map_func = timeit.timeit('list(map(lambda x: x**2, range(100)))', number=10000)
print(f"List comp: {list_comp:.3f}s, map: {map_func:.3f}s")

# From command line
# python -m timeit "sum(range(1000))"

# Practical: benchmark function
def benchmark(func, *args, iterations=1000, repeats=5):
    times = []
    for _ in range(repeats):
        t = timeit.timeit(lambda: func(*args), number=iterations)
        times.append(t / iterations)
    return {
        "mean": sum(times) / len(times),
        "min": min(times),
        "max": max(times),
    }

result = benchmark(my_function, arg1, arg2)
print(f"Avg: {result['mean']*1000:.2f}ms per call")`
  },

  "cProfile/pstats hotspots": {
    why: "Guessing where bottlenecks are wastes time. cProfile shows exactly which functions consume the most time, revealing unexpected hotspots in code you assumed was fast.",
    code: `import cProfile
import pstats
from io import StringIO

# Profile a function
cProfile.run('process_data()', 'profile_output')

# Analyze results
stats = pstats.Stats('profile_output')
stats.sort_stats('cumulative')  # or 'tottime'
stats.print_stats(20)  # top 20 functions

# Practical: context manager profiling
import contextlib

@contextlib.contextmanager
def profiled(sort='cumulative', top_n=20):
    profiler = cProfile.Profile()
    profiler.enable()
    yield profiler
    profiler.disable()

    stream = StringIO()
    stats = pstats.Stats(profiler, stream=stream)
    stats.sort_stats(sort)
    stats.print_stats(top_n)
    print(stream.getvalue())

# Usage
with profiled() as profiler:
    result = expensive_operation()

# Practical: compare two implementations
def benchmark(func1, func2, *args, n=1000):
    t1 = timeit.timeit(lambda: func1(*args), number=n)
    t2 = timeit.timeit(lambda: func2(*args), number=n)
    print(f"func1: {t1/n*1000:.2f}ms, func2: {t2/n*1000:.2f}ms")
    print(f"func2 is {t1/t2:.1f}x {'faster' if t1 > t2 else 'slower'}")

benchmark(old_approach, new_approach, test_data)`
  },

  "memory_profiler & tracemalloc": {
    why: "Memory leaks accumulate silently until the process crashes. tracemalloc tracks memory allocations line-by-line, revealing which code allocates the most memory.",
    code: `import tracemalloc

# Start tracking
tracemalloc.start()

# ... code that might leak memory ...
data = [list(range(1000)) for _ in range(1000)]

# Take snapshot
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

print("[ Top 10 memory consumers ]")
for stat in top_stats[:10]:
    print(stat)

# Compare two snapshots
tracemalloc.start()
before = tracemalloc.take_snapshot()

# ... do work ...
process_large_dataset()

after = tracemalloc.take_snapshot()
top_stats = after.compare_to(before, 'lineno')

print("[ Top 10 memory increases ]")
for stat in top_stats[:10]:
    print(stat)

# Practical: memory limit check
def check_memory(limit_mb=100):
    current, peak = tracemalloc.get_traced_memory()
    if current / 1024 / 1024 > limit_mb:
        raise MemoryError(f"Exceeded {limit_mb}MB limit")
    print(f"Current: {current/1024/1024:.1f}MB, Peak: {peak/1024/1024:.1f}MB")

# Usage with memory_profiler (pip install memory_profiler)
# @profile
# def my_func():
#     a = [1] * (10 ** 6)
#     b = [2] * (2 * 10 ** 7)
#     del b
#     return a`
  },

  "__slots__ & tuple records": {
    why: "Every dict-based object wastes memory on attribute lookup overhead. __slots__ and tuples reduce memory by 40-60%, critical when processing millions of objects in data pipelines.",
    code: `import sys
from collections import namedtuple

# Regular class: uses __dict__ (wasteful)
class PointDict:
    def __init__(self, x, y):
        self.x = x
        self.y = y

# __slots__: no __dict__ (efficient)
class PointSlots:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y

# namedtuple: immutable, memory efficient
PointTuple = namedtuple("Point", ["x", "y"])

# Memory comparison
pd = PointDict(1, 2)
ps = PointSlots(1, 2)
pt = PointTuple(1, 2)

print(f"dict:     {sys.getsizeof(pd) + sys.getsizeof(pd.__dict__)} bytes")
print(f"slots:    {sys.getsizeof(ps)} bytes")
print(f"namedtuple: {sys.getsizeof(pt)} bytes")

# For millions of objects, savings add up
# 1M objects: dict=~112MB, slots=~48MB, namedtuple=~48MB

# Practical: data class optimization
class OptimizedRecord:
    __slots__ = ("id", "name", "value", "timestamp")
    def __init__(self, id, name, value, timestamp):
        self.id = id
        self.name = name
        self.value = value
        self.timestamp = timestamp`
  },

  "Interning & string joins": {
    why: "String concatenation with += in a loop creates O(n^2) allocations because each += creates a new string. join() is O(n) because it pre-calculates the total size.",
    code: `# DANGER: string concatenation is O(n^2)
result = ""
for word in words:
    result += word + " "  # new string allocated each time!

# GOOD: join is O(n)
result = " ".join(words)  # single allocation

# Benchmark
import timeit
words = [f"word{i}" for i in range(10000)]

t_concat = timeit.timeit(
    'result = ""; [result := result + w + " " for w in words]',
    globals={'words': words}, number=100
)
t_join = timeit.timeit(
    '" ".join(words)',
    globals={'words': words}, number=100
)
print(f"concat: {t_concat:.3f}s, join: {t_join:.3f}s")
# join is typically 10-100x faster

# String interning for repeated strings
import sys
s1 = sys.intern("frequently_used_string")
s2 = sys.intern("frequently_used_string")
print(s1 is s2)  # True — same object, faster dict lookup

# Practical: build large strings efficiently
def build_html(tags):
    parts = []
    for tag, content in tags:
        parts.append(f"<{tag}>{content}</{tag}>")
    return "".join(parts)  # join at the end`
  },

  "Local variable caching": {
    why: "Accessing local variables (LOAD_FAST) is much faster than attribute lookup (LOAD_ATTR) or global lookup (LOAD_GLOBAL). Caching frequently accessed attributes as locals speeds up tight loops.",
    code: `# SLOW: repeated attribute lookup
def process_slow(data):
    result = []
    for item in data:
        result.append(item.name.upper())  # .name lookup each iteration
    return result

# FAST: cache attribute in local variable
def process_fast(data):
    result = []
    append = result.append  # cache method
    for item in data:
        name = item.name    # cache attribute
        append(name.upper())
    return result

# Practical: math module caching
import math
sqrt = math.sqrt  # cache function reference

def distance(points):
    return [sqrt(p.x**2 + p.y**2) for p in points]

# Practical: builtins caching
_range = range
_list = list
_int = int

def fast_convert(items):
    return [_int(x) for x in items]`

  },

  "Bisect/dict lookups": {
    why: "Linear search is O(n) while dict/set lookup is O(1). For large datasets, replacing list scans with dict lookups or bisect operations can provide 100x+ speedup.",
    code: `import bisect

# O(n) list scan
def find_in_list(lst, target):
    for item in lst:
        if item == target:
            return True
    return False  # O(n) per lookup

# O(1) dict/set lookup
def find_in_set(s, target):
    return target in s  # O(1) per lookup

# O(log n) bisect for sorted lists
def find_in_sorted(lst, target):
    i = bisect.bisect_left(lst, target)
    return i < len(lst) and lst[i] == target

# Benchmark
data = list(range(1_000_000))
data_set = set(data)

# list: ~50ms per 1M lookups
# set:  ~0.05ms per 1M lookups (1000x faster!)

# Practical: replace nested loops with set lookup
# SLOW: O(n*m)
common = [x for x in list_a if x in list_b]

# FAST: O(n+m)
common = set(list_a) & set(list_b)

# Practical: dict for O(1) mapping
# SLOW: O(n) lookup per item
for item in items:
    match = next((u for u in users if u["id"] == item["user_id"]), None)

# FAST: O(1) lookup
users_by_id = {u["id"]: u for u in users}
for item in items:
    match = users_by_id.get(item["user_id"])`
  },

  "lru_cache/cached_property": {
    why: "Recalculating expensive results wastes CPU. lru_cache memoizes function results; cached_property computes once and stores on the instance. Both eliminate redundant computation.",
    code: `from functools import lru_cache, cached_property

# lru_cache: memoize function results
@lru_cache(maxsize=256)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(100))  # instant vs minutes without cache
print(fibonacci.cache_info())  # hits, misses, size

# cached_property: compute once, store on instance
class DataAnalyzer:
    def __init__(self, data):
        self._data = data

    @cached_property
    def statistics(self):
        """Computed once, then cached on instance."""
        import statistics
        return {
            "mean": statistics.mean(self._data),
            "stdev": statistics.stdev(self._data),
            "median": statistics.median(self._data),
        }

analyzer = DataAnalyzer(range(1000))
print(analyzer.statistics["mean"])  # computed
print(analyzer.statistics["mean"])  # cached (instant)

# Warning: cached_property not thread-safe in Python < 3.12
# Use threading.Lock for thread safety if needed`
  },

  "PyPy/Numba/Cython escape hatches": {
    why: "Pure Python can't match C speed. PyPy JIT-compiles Python automatically. Numba JIT-compiles numeric functions. Cython compiles to C extensions. Use these when profiling shows CPU-bound bottlenecks.",
    code: `# Numba: JIT compile numeric functions
from numba import njit

@njit  # compiles to machine code on first call
def monte_carlo_pi(n_samples):
    count = 0
    for _ in range(n_samples):
        x = random.random()
        y = random.random()
        if x**2 + y**2 <= 1.0:
            count += 1
    return 4.0 * count / n_samples

# First call compiles (slow), subsequent calls are fast
pi = monte_carlo_pi(10_000_000)  # ~100x faster than pure Python

# Cython: compile Python to C extensions
# setup.py:
# from setuptools import setup
# from Cython.Build import cythonize
# setup(ext_modules=cythonize("fast_module.pyx"))

# PyPy: drop-in replacement (just run with pypy3)
# pypy3 my_script.py  # JIT compiled automatically

# When to use which:
# Numba: numeric loops, math-heavy code
# Cython: C extensions, wrapping C libraries
# PyPy: pure Python with heavy loops
# Always profile FIRST — often not needed!`
  },

  // ============================================================
  // ADVANCED PYTHON (TIER 2) — Testing & Quality
  // ============================================================
  "pytest fixtures scope/autouse": {
    why: "Without fixtures, test setup/teardown is duplicated across every test. Fixtures provide dependency injection, automatic cleanup, and scoped setup (per-test, per-module, per-session) that keeps tests DRY.",
    code: `import pytest

# Basic fixture
@pytest.fixture
def sample_data():
    return {"users": [{"name": "Alice", "age": 30}]}

def test_user_name(sample_data):
    assert sample_data["users"][0]["name"] == "Alice"

# Scoped fixtures (per-test, per-class, per-module, per-session)
@pytest.fixture(scope="session")
def database():
    """One connection for entire test session."""
    conn = create_db_connection()
    yield conn
    conn.close()

@pytest.fixture(scope="function")
def clean_table(database):
    """Clean table before each test."""
    database.execute("TRUNCATE users")
    yield database

# autouse: applies to all tests in scope
@pytest.fixture(autouse=True)
def setup_logging(caplog):
    caplog.set_level("DEBUG")

# Parameterized fixtures
@pytest.fixture(params=["sqlite", "postgres"])
def db_engine(request):
    return create_engine(request.param)

def test_query(db_engine):
    # Runs with both sqlite and postgres
    pass

# Practical: temp file fixture
@pytest.fixture
def temp_file(tmp_path):
    path = tmp_path / "test.txt"
    path.write_text("test data")
    return path`
  },

  "parametrize matrix cases": {
    why: "Writing separate test functions for each input/output pair wastes code and makes it hard to add new cases. @pytest.mark.parametrize runs the same test with different data, making edge cases explicit.",
    code: `import pytest

# Basic parametrize
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
    ("123", "123"),
])
def test_upper(input, expected):
    assert input.upper() == expected

# Multiple parameters
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
    (100, -100, 0),
])
def test_add(a, b, expected):
    assert a + b == expected

# Parametrize with IDs for readable output
@pytest.mark.parametrize("age,expected", [
    (17, "minor"),
    pytest.param(18, "adult", id="boundary-adult"),
    (65, "senior"),
    pytest.param(-1, "error", id="negative-age"),
])
def test_classify_age(age, expected):
    result = classify_age(age)
    assert result == expected

# Cross-product parametrize
@pytest.mark.parametrize("x", [1, 2, 3])
@pytest.mark.parametrize("y", [10, 20])
def test_multiply(x, y):
    assert x * y == x * y  # 6 combinations

# Practical: edge case matrix
@pytest.mark.parametrize("email,valid", [
    ("user@example.com", True),
    ("user.name+tag@domain.co", True),
    ("", False),
    ("no-at-sign", False),
    ("@no-local.com", False),
])
def test_email_validation(email, valid):
    assert is_valid_email(email) == valid`
  },

  "monkeypatch/mocking": {
    why: "Without mocking, tests depend on external services, databases, and APIs. This makes tests slow, flaky, and impossible to run offline. monkeypatch replaces dependencies with controlled fakes.",
    code: `import pytest

# monkeypatch: replace attributes for testing
def test_production_code(monkeypatch):
    # Replace environment variable
    monkeypatch.setenv("API_KEY", "test-key-123")

    # Replace function
    monkeypatch.setattr("myapp.api.fetch_data", lambda x: {"mocked": True})

    # Replace class method
    monkeypatch.setattr(MyClass, "expensive_method", lambda self: 42)

    # Delete attribute
    monkeypatch.delattr("module.unwanted_function")

# Practical: mock file system
def test_file_processing(monkeypatch, tmp_path):
    # Create test file
    test_file = tmp_path / "data.txt"
    test_file.write_text("line1\\nline2\\n")

    # Mock Path to use our test file
    monkeypatch.setattr("myapp.processor.INPUT_PATH", test_file)
    result = process_file()
    assert result == 2

# Practical: mock time
def test_timeout(monkeypatch):
    import time
    call_count = [0]
    def mock_time():
        call_count[0] += 1
        return call_count[0] * 0.1

    monkeypatch.setattr(time, "time", mock_time)
    assert timeout_check() == True

# Practical: mock network
def test_api_call(monkeypatch):
    def mock_get(url, timeout=30):
        class MockResponse:
            status_code = 200
            def json(self):
                return {"users": []}
        return MockResponse()

    monkeypatch.setattr("requests.get", mock_get)
    result = fetch_users()
    assert result == {"users": []}`
  },

  "Coverage & branch coverage": {
    why: "Measuring test coverage reveals untested code paths. Branch coverage catches missing else/except branches that line coverage misses. But 100% coverage doesn't mean bug-free — focus on critical paths.",
    code: `# pytest-cov
# pip install pytest-cov

# Run with coverage
# pytest --cov=myapp --cov-report=html

# Branch coverage (catches missing else)
# pytest --cov=myapp --cov-branch

# pyproject.toml configuration
# [tool.coverage.run]
# source = ["myapp"]
# branch = true
#
# [tool.coverage.report]
# exclude_lines = [
#     "pragma: no cover",
#     "if TYPE_CHECKING:",
#     "if __name__ == .__main__.",
# ]
# fail_under = 80

# Coverage pragmas (exclude lines)
def complex_function(x):
    if x > 0:
        return x * 2
    else:  # pragma: no cover
        raise ValueError("negative")

# Practical: coverage report
# pytest --cov=myapp --cov-report=term-missing
# Name                    Stmts   Miss  Cover   Missing
# myapp/api.py              45      3    93%   78-80
# myapp/processor.py        30      0   100%

# GitHub Actions integration
# - name: Test with coverage
#   run: pytest --cov=myapp --cov-report=xml
# - name: Upload coverage
#   uses: codecov/codecov-action@v3`
  },

  "Hypothesis property-based tests": {
    why: "Unit tests check specific examples. Property-based tests generate hundreds of random inputs, finding edge cases you'd never think to test. Hypothesis shrinks failing cases to minimal reproductions.",
    code: `from hypothesis import given, strategies as st, assume, settings

# Basic property-based test
@given(st.lists(st.integers()))
def test_sort_is_idempotent(xs):
    """Sorting twice gives same result as sorting once."""
    assert sorted(sorted(xs)) == sorted(xs)

@given(st.integers(min_value=1, max_value=1000))
def test_square_is_positive(n):
    """Square of any positive integer is positive."""
    assert n ** 2 > 0

# Custom strategy
@given(st.text(min_size=1, max_size=100))
def test_encode_decode_roundtrip(s):
    """Encoding then decoding returns original."""
    assert decode(encode(s)) == s

# Assume: filter invalid inputs
@given(st.lists(st.integers(), min_size=1))
def test_average_is_in_range(xs):
    """Average is between min and max."""
    avg = sum(xs) / len(xs)
    assert min(xs) <= avg <= max(xs)

# Shrink: Hypothesis minimizes failing cases
@given(st.integers())
def test_division(x):
    """Division by 3 never gives remainder 2."""
    result = x / 3
    # Hypothesis will find smallest x that fails

# Settings: control test behavior
@settings(max_examples=500, deadline=None)
@given(st.binary())
def test_hash_is_deterministic(data):
    import hashlib
    h1 = hashlib.sha256(data).hexdigest()
    h2 = hashlib.sha256(data).hexdigest()
    assert h1 == h2`
  },

  "ruff/black/isort formatting": {
    why: "Consistent formatting eliminates debates about style and makes code reviews focus on logic. ruff replaces flake8, isort, and pyflakes in one tool. black eliminates all formatting choices.",
    code: `# ruff: ultra-fast linter (replaces flake8, isort, pyflakes)
# pip install ruff

# pyproject.toml
# [tool.ruff]
# line-length = 100
# select = ["E", "F", "I", "UP", "B", "SIM"]
# ignore = ["E501"]
#
# [tool.ruff.isort]
# known-first-party = ["myapp"]

# black: opinionated formatter
# pip install black

# pyproject.toml
# [tool.black]
# line-length = 100
# target-version = ["py312"]

# Format files
# black myapp/ --check  # check only
# black myapp/          # format in place
# ruff check myapp/     # lint
# ruff format myapp/    # format (black-compatible)

# CI integration
# - name: Lint
#   run: |
#     ruff check .
#     ruff format --check .
#
# - name: Format
#   run: |
#     black --check .
#     isort --check-only .

# Pre-commit hook
# repos:
#   - repo: https://github.com/astral-sh/ruff-pre-commit
#     rev: v0.1.0
#     hooks:
#       - id: ruff
#       - id: ruff-format`
  },

  "Test pyramid unit/integration/e2e": {
    why: "Writing all tests as end-to-end tests makes the suite slow and brittle. Writing only unit tests misses integration bugs. The test pyramid balances fast unit tests with selective integration and E2E tests.",
    code: `# Test pyramid:
#           /\\
#          / E2E \\        <- Few: slow, expensive, fragile
#         /--------\\
#        /Integration\\   <- Some: test component interactions
#       /--------------\\
#      /    Unit Tests   \\  <- Many: fast, isolated, reliable
#     /--------------------\\

# Unit test (fast, isolated)
def test_calculate_tax():
    assert calculate_tax(100, 0.1) == 10.0

# Integration test (tests component interaction)
@pytest.mark.integration
def test_database_save():
    user = User(name="Alice")
    db.save(user)
    loaded = db.query(User, user.id)
    assert loaded.name == "Alice"

# E2E test (full stack, slow)
@pytest.mark.e2e
def test_user_signup_flow():
    response = client.post("/signup", json={
        "email": "alice@test.com",
        "password": "secure123"
    })
    assert response.status_code == 201
    # Verify email sent, user created, etc.

# Practical: mark tests for selective running
# pytest -m "not e2e"  # skip E2E tests
# pytest -m integration  # only integration tests`
  }
};
