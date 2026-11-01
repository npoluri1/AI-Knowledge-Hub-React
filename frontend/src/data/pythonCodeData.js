export const PYTHON_CODE_DATA = {
  "id": "python-code",
  "title": "Python Code Lab",
  "icon": "🐍",
  "description": "110 interactive Python concept pages. Predict the output, reveal what actually happens, then see the fix.",
  "categories": [
    {
      "name": "Setup & Execution",
      "icon": "🔧",
      "concepts": [
        {
          "title": "Virtual Environments",
          "slug": "virtual-environments",
          "tldr": "Virtual environments isolate Python dependencies per-project, preventing version conflicts between projects that need different package versions.",
          "whyItMatters": [
            { "num": "1", "title": "Dependency Conflicts", "text": "Project A needs requests==2.28 but Project B needs requests==2.31. Without venvs, pip installs globally and breaks one of them." },
            { "num": "2", "title": "Reproducibility", "text": "Virtual environments combined with requirements.txt ensure every developer and deployment runs identical package versions." },
            { "num": "3", "title": "Production Safety", "text": "Installing packages globally can corrupt your system Python, making OS tools that depend on it break." }
          ],
          "howItWorks": "A virtual environment creates an isolated directory containing a copy of the Python interpreter and a separate site-packages folder. When activated, your shell's PATH is modified so that 'python' and 'pip' commands point to the venv's copies instead of the system installation. This means any packages you install go into the isolated directory, completely separate from other projects.",
          "pitfalls": [
            { "text": "Forgetting to activate the venv before installing packages installs them globally." },
            { "text": "Using virtualenv when venv (built-in since Python 3.3) is sufficient adds unnecessary dependency." },
            { "text": "Committing the venv directory to git wastes space; add it to .gitignore." },
            { "text": "Using different Python versions across venvs can cause subtle compatibility issues." }
          ],
          "keyTerms": [
            { "term": "venv", definition: "Python's built-in module for creating lightweight virtual environments." },
            { "term": "site-packages", definition: "The directory where pip installs packages, isolated per venv." },
            { "term": "requirements.txt", definition: "A file listing all packages and versions needed by a project." },
            { "term": "pyproject.toml", definition: "Modern Python project configuration file replacing setup.py." }
          ],
          "codeExample": "# Create a virtual environment\npython -m venv myenv\n\n# Activate it (Linux/Mac)\nsource myenv/bin/activate\n\n# Activate it (Windows)\nmyenv\\Scripts\\activate\n\n# Install packages\npip install requests flask\n\n# Save dependencies\npip freeze > requirements.txt\n\n# Deactivate\ndeactivate",
          "relatedConcepts": ["Package Management", "Dependency Injection", "Docker Containers"]
        },
        {
          "title": "Module Resolution and __init__.py",
          "slug": "module-resolution",
          "tldr": "Python's import system searches multiple locations in a specific order. Understanding this prevents 'ModuleNotFoundError' headaches.",
          "whyItMatters": [
            { "num": "1", "title": "Package Design", "text": "Proper __init__.py files control what gets exported when someone imports your package, creating clean public APIs." },
            { "num": "2", "title": "Debugging Imports", "text": "When you see ModuleNotFoundError, understanding sys.path and import order helps you fix it in seconds." },
            { "num": "3", "title": "Monorepo Structure", "text": "In large codebases, understanding how Python resolves imports across packages prevents circular dependencies." }
          ],
          "howItWorks": "When you write 'import foo', Python searches: (1) sys.modules cache, (2) built-in modules, (3) sys.path (current directory, PYTHONPATH, site-packages). For packages, __init__.py marks a directory as a Python package. Without it (Python 3.3+), directories can be implicit namespace packages, but this can cause unexpected behavior.",
          "pitfalls": [
            { "text": "Circular imports happen when module A imports B and B imports A." },
            { "text": "Running scripts from different directories changes which modules Python finds." },
            { "text": "Implicit namespace packages don't execute __init__.py, breaking initialization code." },
            { "text": "sys.path manipulation is fragile; prefer proper package installation with pip." }
          ],
          "keyTerms": [
            { "term": "__init__.py", definition: "File that marks a directory as a Python package and can initialize package state." },
            { "term": "sys.path", definition: "List of directories Python searches when importing modules." },
            { "term": "Relative Import", definition: "Import using dots: from .module import something." },
            { "term": "Absolute Import", definition: "Import using full package path: from package.module import something." }
          ],
          "codeExample": "# Project structure\n# mypackage/\n#   __init__.py\n#   core.py\n#   utils.py\n\n# __init__.py controls public API\nfrom .core import MyClass\nfrom .utils import helper_function\n\n# Users can do:\n# from mypackage import MyClass\n# Instead of:\n# from mypackage.core import MyClass",
          "relatedConcepts": ["Virtual Environments", "Package Management", "Testing"]
        }
      ]
    },
    {
      "name": "Async Python",
      "icon": "⚡",
      "concepts": [
        {
          "title": "asyncio.gather and Concurrency",
          "slug": "asyncio-gather",
          "tldr": "asyncio.gather runs multiple coroutines concurrently but does NOT cancel remaining tasks on failure, leading to orphaned tasks and resource leaks.",
          "whyItMatters": [
            { "num": "1", "title": "Cloud Engineering", "text": "A cloud engineer uploads to multiple storage buckets concurrently. If one fails, the others continue unmanaged, consuming resources silently." },
            { "num": "2", "title": "Notification Systems", "text": "A notification engine sends push, SMS, and email concurrently. An API failure in push causes the DB status to never update, creating infinite resend loops." },
            { "num": "3", "title": "API Aggregation", "text": "Aggregating data from 5 microservices: if one times out, you need to handle the timeout without losing the other 4 responses." }
          ],
          "howItWorks": "asyncio.gather() wraps coroutines as Task objects on the event loop. When one task errors, gather() catches it and raises immediately, but does NOT cancel the other tasks. They continue running in the background, potentially consuming resources. Use return_exceptions=True to collect all results (including exceptions) without early propagation, or use asyncio.TaskGroup (Python 3.11+) for structured concurrency that auto-cancels siblings on failure.",
          "pitfalls": [
            { "text": "asyncio.gather does not cancel sibling tasks on failure — they become orphaned." },
            { "text": "Using gather without return_exceptions=True lets the first error propagate immediately." },
            { "text": "Synchronous blocking calls inside async functions freeze the entire event loop." },
            { "text": "TaskGroup (3.11+) is the modern replacement for structured concurrency." }
          ],
          "keyTerms": [
            { "term": "Coroutine", definition: "An async function defined with 'async def' that can be paused and resumed." },
            { "term": "Event Loop", definition: "The core of asyncio that schedules and runs coroutines." },
            { "term": "Task", definition: "A wrapper around a coroutine scheduled on the event loop." },
            { "term": "Structured Concurrency", definition: "A pattern where child tasks are bound to the lifetime of their parent scope." },
            { "term": "TaskGroup", definition: "Python 3.11+ API that auto-cancels sibling tasks on any failure." }
          ],
          "codeExample": "import asyncio\n\nasync def fetch(url, delay, fail=False):\n    print(f'Starting {url}')\n    await asyncio.sleep(delay)\n    if fail:\n        raise IOError(f'Failed {url}')\n    print(f'Done {url}')\n    return f'Result {url}'\n\nasync def main():\n    # return_exceptions=True prevents early propagation\n    results = await asyncio.gather(\n        fetch('api-a', 1.5),\n        fetch('api-b', 0.5, fail=True),\n        fetch('api-c', 1.0),\n        return_exceptions=True\n    )\n    for res in results:\n        if isinstance(res, Exception):\n            print(f'Error: {res}')\n        else:\n            print(f'OK: {res}')\n\nasyncio.run(main())",
          "relatedConcepts": ["asyncio.Queue", "Threading vs Asyncio", "TaskGroup"]
        },
        {
          "title": "Threading vs Asyncio vs Multiprocessing",
          "slug": "threading-vs-asyncio",
          "tldr": "Use asyncio for I/O-bound tasks, multiprocessing for CPU-bound tasks, and threading only when you must interface with blocking libraries.",
          "whyItMatters": [
            { "num": "1", "title": "Web Scraping", "text": "Scraping 1000 pages: asyncio for concurrent HTTP requests (I/O-bound), not multiprocessing (no CPU work)." },
            { "num": "2", "title": "Image Processing", "text": "Resizing 10,000 images: multiprocessing to use all CPU cores (CPU-bound), not asyncio (GIL blocks CPU work)." },
            { "num": "3", "title": "Legacy Integration", "text": "Calling a blocking database library: wrap it in threading to avoid blocking the event loop." }
          ],
          "howItWorks": "Python's GIL (Global Interpreter Lock) prevents true parallel execution of Python code in a single process. asyncio works around this for I/O-bound tasks by switching between coroutines during wait times. Multiprocessing bypasses the GIL entirely by spawning separate processes, each with its own Python interpreter. Threading runs OS-level threads but is limited by the GIL for CPU work — useful only for I/O-bound tasks that call blocking C extensions.",
          "pitfalls": [
            { "text": "Using multiprocessing for I/O-bound tasks wastes memory on process overhead." },
            { "text": "Using asyncio for CPU-bound tasks provides no speedup due to the GIL." },
            { "text": "Mixing sync and async code incorrectly freezes the event loop." },
            { "text": "Thread safety: shared mutable state between threads requires locks." }
          ],
          "keyTerms": [
            { "term": "GIL", definition: "Global Interpreter Lock — prevents multiple threads from executing Python bytecode simultaneously." },
            { "term": "I/O-bound", definition: "Tasks spending most time waiting for network, disk, or database responses." },
            { "term": "CPU-bound", definition: "Tasks spending most time on computation (math, image processing, encoding)." },
            { "term": "Coroutine", definition: "An async function that yields control during I/O waits." },
            { "term": "Process Pool", definition: "A pool of worker processes for parallelizing CPU-bound work." }
          ],
          "codeExample": "import asyncio\nimport multiprocessing\nimport threading\n\n# I/O-bound: use asyncio\ndef io_task():\n    asyncio.run(fetch_all_urls())\n\n# CPU-bound: use multiprocessing\ndef cpu_task():\n    with multiprocessing.Pool(4) as pool:\n        results = pool.map(process_image, image_files)\n\n# Blocking library: use threading\ndef blocking_task():\n    thread = threading.Thread(target=call_blocking_db)\n    thread.start()\n    thread.join()",
          "relatedConcepts": ["asyncio.gather", "GIL", "Process Pools"]
        }
      ]
    },
    {
      "name": "Modern OOP",
      "icon": "🏗️",
      "concepts": [
        {
          "title": "Dataclasses and Type Hints",
          "slug": "dataclasses",
          "tldr": "Dataclasses auto-generate __init__, __repr__, and __eq__ from type annotations, eliminating boilerplate while adding IDE support.",
          "whyItMatters": [
            { "num": "1", "title": "API Models", "text": "FastAPI uses Pydantic (built on dataclasses) to auto-validate request bodies and generate OpenAPI docs." },
            { "num": "2", "title": "Configuration", "text": "Dataclasses with frozen=True create immutable config objects that prevent accidental modification." },
            { "num": "3", "title": "Testing", "text": "Auto-generated __eq__ makes asserting on complex objects trivial: assert result == expected." }
          ],
          "howItWorks": "The @dataclass decorator inspects type annotations and auto-generates __init__ (assigning fields), __repr__ (string representation), and __eq__ (field-by-field comparison). You can customize with field() — set defaults, mark as frozen, exclude from repr, etc. For validation, Pydantic's BaseModel extends this with runtime type checking and coercion.",
          "pitfalls": [
            { "text": "Mutable default values in dataclasses cause shared-state bugs across instances." },
            { "text": "Dataclass inheritance can produce unexpected __init__ signatures." },
            { "text": "frozen=True prevents post-init modification but complicates ORM integration." },
            { "text": "Type hints are not enforced at runtime without Pydantic or beartype." }
          ],
          "keyTerms": [
            { "term": "@dataclass", definition: "Decorator that auto-generates __init__, __repr__, __eq__ from type annotations." },
            { "term": "field()", definition: "Function to customize individual fields (defaults, metadata, repr)." },
            { "term": "frozen", definition: "When True, instances are immutable after creation (hashable)." },
            { "term": "Type Hints", definition: "Annotations like 'name: str' that describe expected types." },
            { "term": "Pydantic BaseModel", definition: "Dataclass-like with runtime validation and JSON serialization." }
          ],
          "codeExample": "from dataclasses import dataclass, field\nfrom typing import List\n\n@dataclass(frozen=True)\nclass User:\n    name: str\n    age: int\n    email: str\n    tags: List[str] = field(default_factory=list)\n\n@dataclass\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n    debug: bool = False\n\ndef create_user() -> User:\n    return User(name='Alice', age=30, email='alice@example.com')\n\nuser = create_user()\nprint(user)  # User(name='Alice', age=30, email='alice@example.com', tags=[])\nprint(user == User(name='Alice', age=30, email='alice@example.com'))  # True",
          "relatedConcepts": ["Pydantic Models", "Type Hints", "Configuration Management"]
        }
      ]
    },
    {
      "name": "Python's Hidden Traps",
      "icon": "🪤",
      "concepts": [
        {
          "title": "Mutable Default Arguments",
          "slug": "mutable-defaults",
          "tldr": "Using mutable objects (lists, dicts) as default function arguments causes them to be shared across ALL calls, leading to surprising state leakage.",
          "whyItMatters": [
            { "num": "1", "title": "Accumulating State", "text": "def add_item(item, items=[]): items.append(item); return items — each call appends to the SAME list!" },
            { "num": "2", "title": "Class Initialization", "text": "Using a dict as a default argument in __init__ means all instances share the same dict." },
            { "num": "3", "title": "Testing Pitfalls", "text": "Tests that call a function with mutable defaults can interfere with each other." }
          ],
          "howItWorks": "Python evaluates default arguments ONCE at function definition time, not each time the function is called. So if you write def f(x=[]), the empty list is created once and reused for every call that doesn't provide x. This is a design choice for efficiency, but it catches many developers off guard. The fix: use None as the default and create the mutable object inside the function.",
          "pitfalls": [
            { "text": "def f(items=[]): items.append(1); return items — returns [1], then [1,1], then [1,1,1]!" },
            { "text": "The shared mutable default persists for the lifetime of the function object." },
            { "text": "This affects lists, dicts, sets, and any mutable object — not strings or ints." },
            { "text": "Copy-pasting from online examples often perpetuates this bug." }
          ],
          "keyTerms": [
            { "term": "Mutable Default", definition: "A default argument value that is a mutable object (list, dict, set)." },
            { "term": "Function Object", definition: "The function definition itself, created once at module load time." },
            { "term": "Closure", definition: "A function that captures variables from its enclosing scope." },
            { "term": "None Sentinel", definition: "Using None as a default to indicate 'no value provided'." }
          ],
          "codeExample": "# BAD: Shared mutable default\ndef add_item(item, items=[]):\n    items.append(item)\n    return items\n\nprint(add_item('a'))  # ['a']\nprint(add_item('b'))  # ['a', 'b'] — SURPRISE!\n\n# GOOD: Create new list each call\ndef add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items\n\nprint(add_item('a'))  # ['a']\nprint(add_item('b'))  # ['b'] — Correct!",
          "relatedConcepts": ["Closures", "Function Scope", "Default Arguments"]
        }
      ]
    }
  ]
};
