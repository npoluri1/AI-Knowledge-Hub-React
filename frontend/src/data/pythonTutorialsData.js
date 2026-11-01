export const PYTHON_TUTORIALS = [
  {
    "id": "python",
    "name": "Python",
    "icon": "🐍",
    "category": "basics",
    "difficulty": "beginner",
    "description": "Core Python: syntax, data types, control flow, functions, OOP & exceptions",
    "tags": [
      "Python",
      "Basics",
      "Programming"
    ],
    "prerequisites": [
      "No prior experience"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "What is Python?"
      },
      {
        "type": "paragraph",
        "text": "Python is a high-level, interpreted, general-purpose programming language created by Guido van Rossum in 1991. It emphasizes readability through significant indentation and is one of the most popular languages for web development, data science, AI, automation, and scripting. Python 3 is the current standard."
      },
      {
        "type": "heading",
        "text": "Core Features"
      },
      {
        "type": "list",
        "items": [
          "Interpreted & dynamically typed",
          "Object-oriented with classes and inheritance",
          "Rich standard library (200+ modules)",
          "Automatic memory management (garbage collection)",
          "Cross-platform (Windows, macOS, Linux)",
          "Vibrant ecosystem with 500,000+ packages on PyPI"
        ]
      },
      {
        "type": "paragraph",
        "text": "Python excels across domains: web (Django, Flask), data science (pandas, NumPy), ML (scikit-learn, TensorFlow), automation, and DevOps. pip installs packages, venv isolates dependencies."
      }
    ],
    "concepts": [
      {
        "name": "Dynamic Typing",
        "description": "Variables infer types at runtime, enabling rapid prototyping."
      },
      {
        "name": "Indentation Blocks",
        "description": "Code blocks delimited by 4-space indentation, not braces."
      },
      {
        "name": "Everything is an Object",
        "description": "Functions, classes, and types are first-class objects."
      },
      {
        "name": "Mutable vs Immutable",
        "description": "Lists/dicts/sets are mutable; strings/tuples are immutable."
      },
      {
        "name": "Exception Handling",
        "description": "try/except/finally catches runtime errors gracefully."
      },
      {
        "name": "Garbage Collection",
        "description": "Reference counting plus cyclic collector for memory management."
      }
    ],
    "codeExamples": [
      {
        "title": "Variables & Types",
        "description": "Dynamic typing and basic operations",
        "language": "python",
        "code": "# Variables and basic types\nname = \"Ada Lovelace\"       # str\nage = 36                    # int\npi = 3.14159                # float\nis_programmer = True        # bool\n\nprint(f\"{name} is {age} years old\")\nprint(type(pi))             # <class 'float'>\n\n# Arithmetic\nprint(7 / 2)   # 3.5\nprint(7 // 2)  # 3\nprint(2 ** 10) # 1024"
      },
      {
        "title": "Control Flow",
        "description": "Conditionals and loops",
        "language": "python",
        "code": "# Conditionals\nscore = 85\nif score >= 90: grade = \"A\"\nelif score >= 80: grade = \"B\"\nelse: grade = \"C\"\nprint(f\"Grade: {grade}\")\n\n# for loop\nfor i in range(1, 6):\n    print(i, end=\" \")\nprint()\n\n# List comprehension\nsquares = [n*n for n in range(10) if n % 2 == 0]\nprint(squares)  # [0, 4, 16, 36, 64]"
      },
      {
        "title": "Functions",
        "description": "Defining functions with default args",
        "language": "python",
        "code": "def calculate_bmi(weight_kg, height_m):\n    \"\"\"Return Body Mass Index.\"\"\"\n    if height_m <= 0:\n        raise ValueError(\"Height must be positive\")\n    return weight_kg / (height_m ** 2)\n\ndef greet(name, greeting=\"Hello\", punctuation=\"!\"):\n    return f\"{greeting}, {name}{punctuation}\"\n\nprint(greet(\"Sam\"))\nprint(greet(\"Sam\", greeting=\"Hi\", punctuation=\".\"))\n\n# f-strings\nbmi = calculate_bmi(70, 1.75)\nprint(f\"BMI is {bmi:.2f}\")"
      },
      {
        "title": "OOP Basics",
        "description": "Classes and objects",
        "language": "python",
        "code": "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        self._balance += amount\n        return self._balance\n\n    def __str__(self):\n        return f\"BankAccount({self.owner}: {self._balance})\"\n\nacc = BankAccount(\"Alice\", 1000)\nacc.deposit(500)\nprint(acc)"
      },
      {
        "title": "File I/O & Exceptions",
        "description": "Reading files with error handling",
        "language": "python",
        "code": "# Writing\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"Line 1: Hello world\\\\n\")\n    f.write(\"Line 2: Python is fun\\\\n\")\n\n# Reading\nwith open(\"notes.txt\", \"r\") as f:\n    for line in f:\n        print(line.strip())\n\n# Exception handling\ntry:\n    number = int(\"not-a-number\")\nexcept ValueError as e:\n    print(f\"Caught error: {e}\")\nfinally:\n    print(\"Always executes\")"
      },
      {
        "title": "List Comprehensions & Generators",
        "description": "Functional programming patterns",
        "language": "python",
        "code": "# Nested list comprehension\nmatrix = [[1,2,3],[4,5,6],[7,8,9]]\nflat = [x for row in matrix for x in row]\nprint(flat)  # [1,2,3,4,5,6,7,8,9]\n\n# Dict comprehension\nwords = [\"hello\", \"world\", \"python\"]\nlengths = {w: len(w) for w in words}\nprint(lengths)  # {'hello': 5, 'world': 5, 'python': 6}\n\n# Generator expression (lazy evaluation)\ngen = (x**2 for x in range(10))\nprint(next(gen))  # 0\nprint(next(gen))  # 1\nprint(sum(gen))   # sum of 2^2..9^2 = 285"
      },
      {
        "title": "Decorators & Context Managers",
        "description": "Advanced function patterns",
        "language": "python",
        "code": "import time\nfrom functools import wraps\n\n# Timing decorator\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f\"{func.__name__} took {elapsed:.4f}s\")\n        return result\n    return wrapper\n\n@timer\ndef slow_sum(n):\n    return sum(range(n))\n\nslow_sum(1_000_000)\n\n# Context manager\nclass ManagedFile:\n    def __init__(self, path, mode='r'):\n        self.path = path\n        self.mode = mode\n    def __enter__(self):\n        self.file = open(self.path, self.mode)\n        return self.file\n    def __exit__(self, *args):\n        self.file.close()\n\nwith ManagedFile('test.txt', 'w') as f:\n    f.write('Hello, context managers!')"
      },
      {
        "title": "Lambda, Map, Filter, Reduce",
        "description": "Functional programming with lambdas",
        "language": "python",
        "code": "from functools import reduce\n\n# Lambda: anonymous single-expression functions\ndouble = lambda x: x * 2\nprint(double(5))  # 10\n\n# Map: apply function to every element\nnums = [1, 2, 3, 4]\nsquared = list(map(lambda x: x**2, nums))\nprint(squared)  # [1, 4, 9, 16]\n\n# Filter: keep elements where function returns True\nevens = list(filter(lambda x: x % 2 == 0, range(20)))\nprint(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n\n# Reduce: accumulate elements\ntotal = reduce(lambda a, b: a + b, nums)\nprint(total)  # 10\n\n# Sorting with custom key\nstudents = [(\"Alice\", 85), (\"Bob\", 92), (\"Charlie\", 78)]\nby_grade = sorted(students, key=lambda s: s[1], reverse=True)\nprint(by_grade)  # [('Bob', 92), ('Alice', 85), ('Charlie', 78)]"
      }
    ],
    "useCases": [
      {
        "title": "Web Development",
        "description": "Django and Flask power high-traffic sites like Instagram."
      },
      {
        "title": "Data Science & Analytics",
        "description": "pandas, NumPy, and Jupyter are the industry standard for EDA."
      },
      {
        "title": "Automation & Scripting",
        "description": "Automate backups, file processing, and deployment pipelines."
      },
      {
        "title": "AI & Machine Learning",
        "description": "scikit-learn, TensorFlow, and PyTorch make Python the de facto ML language."
      }
    ],
    "bestPractices": [
      "Follow PEP 8 and use 4-space indentation",
      "Use venv for isolated environments",
      "Prefer f-strings for readability",
      "Write docstrings for public functions",
      "Use context managers for resources"
    ],
    "commonErrors": [
      {
        "error": "IndentationError: unexpected indent",
        "fix": "Configure editor to use spaces consistently; never mix tabs/spaces."
      },
      {
        "error": "NameError: name x is not defined",
        "fix": "Check variable scope and spelling before using it."
      },
      {
        "error": "TypeError: unsupported operand type(s)",
        "fix": "Cast explicitly with str() / int() when combining types."
      }
    ]
  },
  {
    "id": "oop-python",
    "name": "OOP Python",
    "icon": "🏗️",
    "category": "basics",
    "difficulty": "beginner",
    "description": "Object-oriented programming: classes, inheritance, polymorphism, and Python idioms",
    "tags": [
      "OOP",
      "Classes",
      "Inheritance",
      "Polymorphism"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "The Object-Oriented Paradigm"
      },
      {
        "type": "paragraph",
        "text": "OOP organizes code around objects that bundle data (attributes) with procedures (methods). This mirrors real-world entities directly, making large codebases more maintainable. The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction."
      },
      {
        "type": "heading",
        "text": "Python OOP Idioms"
      },
      {
        "type": "list",
        "items": [
          "Properties for attribute control",
          "Magic/dunder methods for operator overloading",
          "Abstract base classes for interfaces",
          "Multiple inheritance with C3 MRO",
          "dataclasses for clean domain objects"
        ]
      },
      {
        "type": "paragraph",
        "text": "Python follows a \"consenting adults\" philosophy: underscores signal privacy but do not enforce it. Composition is often preferred over deep inheritance hierarchies."
      }
    ],
    "concepts": [
      {
        "name": "Class vs Instance",
        "description": "A class is a blueprint; instances hold per-object state."
      },
      {
        "name": "__init__",
        "description": "Constructor method that runs on instantiation."
      },
      {
        "name": "self",
        "description": "First argument of instance methods, referencing the object."
      },
      {
        "name": "@property",
        "description": "Exposes methods as attribute-style access."
      },
      {
        "name": "Dunder Methods",
        "description": "__str__, __eq__, __len__ customize built-in behavior."
      },
      {
        "name": "ABC",
        "description": "abc.ABC defines interfaces subclasses must implement."
      }
    ],
    "codeExamples": [
      {
        "title": "Properties with Validation",
        "description": "Computed attributes and setters",
        "language": "python",
        "code": "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"Below absolute zero\")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9/5 + 32\n\nt = Temperature(25)\nprint(t.fahrenheit)  # 77.0\nt.celsius = 30"
      },
      {
        "title": "Inheritance & Override",
        "description": "Extending base classes",
        "language": "python",
        "code": "class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    def describe(self):\n        return f\"A generic Vehicle\"\n\nclass Car(Vehicle):\n    def __init__(self, brand, doors=4):\n        super().__init__(brand)\n        self.doors = doors\n    def describe(self):\n        return f\"A {self.doors}-door {self.brand}\"\n\nvehicles = [Car(\"Toyota\"), Vehicle(\"Generic\")]\nfor v in vehicles:\n    print(v.describe())"
      },
      {
        "title": "Magic Methods",
        "description": "Operator overloading",
        "language": "python",
        "code": "class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __add__(self, other):\n        return Vector(self.x+other.x, self.y+other.y)\n    def __eq__(self, other):\n        return self.x==other.x and self.y==other.y\n    def __str__(self):\n        return f\"({self.x}, {self.y})\"\n\nprint(Vector(1,2) + Vector(3,4))  # (4, 6)\nprint(Vector(1,2) == Vector(1,2))   # True"
      },
      {
        "title": "Abstract Classes",
        "description": "Enforcing contracts",
        "language": "python",
        "code": "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\n\nclass Rectangle(Shape):\n    def __init__(self, w, h):\n        self.w, self.h = w, h\n    def area(self):\n        return self.w * self.h\n\n# Shape() -> TypeError: can't instantiate abstract class\nprint(Rectangle(4, 5).area())  # 20"
      },
      {
        "title": "Polymorphism & Duck Typing",
        "description": "Interface-based polymorphism",
        "language": "python",
        "code": "class Dog:\n    def speak(self): return \"Woof!\"\n    def __repr__(self): return \"Dog()\"\n\nclass Cat:\n    def speak(self): return \"Meow!\"\n    def __repr__(self): return \"Cat()\"\n\nclass Duck:\n    def speak(self): return \"Quack!\"\n    def __repr__(self): return \"Duck()\"\n\n# Duck typing: any object with .speak() works\ndef make_speak(animal):\n    print(f\"{animal} says {animal.speak()}\")\n\nfor animal in [Dog(), Cat(), Duck()]:\n    make_speak(animal)\n\n# isinstance check\ndef describe(obj):\n    if isinstance(obj, Dog):\n        print(\"It's a dog\")\n    elif hasattr(obj, 'speak'):\n        print(f\"Something that speaks: {obj.speak()}\")"
      },
      {
        "title": "Abstract Base Classes",
        "description": "Enforcing interfaces",
        "language": "python",
        "code": "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float:\n        \"\"\"Calculate area.\"\"\"\n        pass\n    \n    @abstractmethod\n    def perimeter(self) -> float:\n        \"\"\"Calculate perimeter.\"\"\"\n        pass\n    \n    def describe(self):\n        return f\"Area={self.area():.2f}, Perimeter={self.perimeter():.2f}\"\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    def area(self):\n        return 3.14159 * self.radius ** 2\n    def perimeter(self):\n        return 2 * 3.14159 * self.radius\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\n# Shape()  # TypeError: Can't instantiate abstract class\nc = Circle(5)\nprint(c.describe())  # Area=78.54, Perimeter=31.42"
      },
      {
        "title": "Dataclasses & Slots",
        "description": "Modern Python class patterns",
        "language": "python",
        "code": "from dataclasses import dataclass, field\nfrom typing import ClassVar\n\n@dataclass\nclass User:\n    name: str\n    email: str\n    age: int\n    tags: list[str] = field(default_factory=list)\n    _id: ClassVar[int] = 0\n    \n    def __post_init__(self):\n        User._id += 1\n        self.id = User._id\n    \n    def is_adult(self) -> bool:\n        return self.age >= 18\n\n@dataclass(slots=True)  # __slots__ for memory efficiency\nclass Point:\n    x: float\n    y: float\n    \n    def distance_to(self, other: 'Point') -> float:\n        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5\n\nalice = User(\"Alice\", \"alice@example.com\", 30, [\"admin\"])\nbob = User(\"Bob\", \"bob@example.com\", 25)\nprint(alice)  # User(name='Alice', email='alice@example.com', age=30, tags=['admin'])\nprint(f\"Adult: {alice.is_adult()}\")  # True\n\np1 = Point(0, 0)\np2 = Point(3, 4)\nprint(p1.distance_to(p2))  # 5.0"
      }
    ],
    "useCases": [
      {
        "title": "Domain Modeling",
        "description": "Model business entities (users, orders) with classes."
      },
      {
        "title": "Framework Design",
        "description": "Django models and UI toolkits rely on inheritance and metaclasses."
      },
      {
        "title": "Plugin Architecture",
        "description": "ABC defines contracts; plugins implement them."
      }
    ],
    "bestPractices": [
      "Prefer composition over inheritance",
      "Keep hierarchies shallow (2-3 levels)",
      "Use @property instead of get_/set_ methods",
      "Use dataclasses for simple domain objects"
    ],
    "commonErrors": [
      {
        "error": "TypeError: __init__() missing argument",
        "fix": "Forgot required arg or self in method signature."
      },
      {
        "error": "AttributeError: no attribute",
        "fix": "Check spelling and ensure attribute is set in __init__."
      },
      {
        "error": "RecursionError in __str__",
        "fix": "Avoid self-referencing within dunder methods."
      }
    ]
  },
  {
    "id": "python-data-structure",
    "name": "Python Data Structure",
    "icon": "📦",
    "category": "basics",
    "difficulty": "beginner",
    "description": "Built-in data structures, time complexity, and choosing the right one",
    "tags": [
      "Data Structures",
      "Lists",
      "Dicts",
      "Sets"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Built-in Data Structures"
      },
      {
        "type": "paragraph",
        "text": "Python provides four fundamental structures: lists (mutable, ordered), tuples (immutable, ordered), dicts (key-value mapping, O(1) lookup), and sets (unique items, O(1) membership). Mastering time complexity of each operation is essential for efficient code."
      },
      {
        "type": "heading",
        "text": "Complexity Guide"
      },
      {
        "type": "list",
        "items": [
          "List append/pop O(1), lookup O(n), index O(1)",
          "Dict/Set lookup O(1) average via hashing",
          "Tuple is immutable, memory-efficient",
          "deque supports O(1) on both ends",
          "collections module: Counter, defaultdict, namedtuple"
        ]
      },
      {
        "type": "paragraph",
        "text": "Use a list for ordered sequences with duplicates, tuple for immutable records, set for deduplication/membership, dict for key-value mapping."
      }
    ],
    "concepts": [
      {
        "name": "List",
        "description": "Mutable sequence with sort, slicing, comprehensions."
      },
      {
        "name": "Tuple",
        "description": "Immutable, hashable, safe as dict keys."
      },
      {
        "name": "Dict",
        "description": "O(1) key-value lookup, insertion-ordered."
      },
      {
        "name": "Set",
        "description": "Unordered unique items, fast membership."
      },
      {
        "name": "deque",
        "description": "O(1) append/pop on both ends."
      },
      {
        "name": "Counter",
        "description": "Purpose-built counting from iterables."
      }
    ],
    "codeExamples": [
      {
        "title": "Lists & Comprehensions",
        "description": "Core operations",
        "language": "python",
        "code": "nums = [3, 1, 4, 1, 5, 9]\nnums.sort()\nprint(nums)  # [1, 1, 3, 4, 5, 9]\nprint(nums[2:5])   # [3, 4, 5]\nevens = [n for n in range(20) if n%2==0]\nsquares = {x: x**2 for x in range(5)}"
      },
      {
        "title": "Dictionaries",
        "description": "Key-value operations",
        "language": "python",
        "code": "from collections import Counter, defaultdict\n\nwords = \"the cat sat on the mat the cat\".split()\ncounts = Counter(words)\nprint(counts.most_common(2))  # [('the', 3), ('cat', 2)]\n\ngroups = defaultdict(list)\nfor i in range(10): groups[i%3].append(i)\nprint(groups[0])  # [0, 3, 6, 9]"
      },
      {
        "title": "Sets",
        "description": "Deduplication and operations",
        "language": "python",
        "code": "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a | b)   # union {1,2,3,4,5,6}\nprint(a & b)   # intersection {3, 4}\nprint(a - b)   # difference {1, 2}\n\n# deduplicate\nnums = [1, 2, 2, 3, 3, 3]\nunique = list(set(nums))\nprint(unique)  # [1, 2, 3]"
      },
      {
        "title": "deque & namedtuple",
        "description": "Specialized containers",
        "language": "python",
        "code": "from collections import deque, namedtuple\n\nq = deque(maxlen=3)\nq.append(1); q.append(2); q.append(3)\nq.append(4)\nprint(q)  # deque([2, 3, 4])\n\nPoint = namedtuple(\"Point\", \"x y\")\np = Point(3, 4)\nprint(p.x, p.y, p[0])  # 3 4 3"
      },
      {
        "title": "Advanced Collection Patterns",
        "description": "Counter, defaultdict, deque, namedtuple",
        "language": "python",
        "code": "from collections import Counter, defaultdict, deque, namedtuple\n\n# Counter: count occurrences\nwords = \"the cat sat on the mat the cat\".split()\ncounts = Counter(words)\nprint(counts.most_common(2))  # [('the', 3), ('cat', 2)]\nprint(counts['dog'])  # 0 (no KeyError)\n\n# defaultdict: auto-initialize missing keys\ngraph = defaultdict(list)\ngraph[\"A\"].append(\"B\")\ngraph[\"A\"].append(\"C\")\ngraph[\"B\"].append(\"D\")\nprint(dict(graph))  # {'A': ['B', 'C'], 'B': ['D']}\n\n# deque: efficient两端append/popleft\ndaq = deque(maxlen=3)\nfor i in range(5):\n    daq.append(i)\n    print(list(daq))\n# [0] -> [0,1] -> [0,1,2] -> [1,2,3] -> [2,3,4]\n\n# namedtuple: lightweight immutable class\nPoint = namedtuple(\"Point\", [\"x\", \"y\"])\np = Point(3, 4)\nprint(f\"{p.x}, {p.y} dist={abs(p):.1f}\")"
      },
      {
        "title": "Set Operations",
        "description": "Set theory operations for data analysis",
        "language": "python",
        "code": "# Set operations: union, intersection, difference\npython_devs = {\"Alice\", \"Bob\", \"Charlie\", \"Diana\"}\njs_devs = {\"Bob\", \"Diana\", \"Eve\", \"Frank\"}\nrust_devs = {\"Charlie\", \"Eve\", \"Grace\"}\n\n# Union: everyone who does at least one language\nall_devs = python_devs | js_devs | rust_devs\nprint(f\"All devs: {len(all_devs)}\")\n\n# Intersection: polyglots\npolyglot = python_devs & js_devs  # Bob, Diana\nprint(f\"Python+JS: {polyglot}\")\n\n# Python-only developers\npython_only = python_devs - js_devs - rust_devs\nprint(f\"Python only: {python_only}\")\n\n# Set comprehension\nascii_codes = {chr(i) for i in range(97, 123)}  # a-z\nprint(f\"Lowercase letters: {len(ascii_codes)}\")\n\n# Frozen set for hashable sets\nconfig = frozenset([\"debug\", \"verbose\"])\n# config.add(\"x\")  # AttributeError: can't add to frozenset"
      }
    ],
    "useCases": [
      {
        "title": "Data Pipelines",
        "description": "Lists and generators stream large analytics datasets."
      },
      {
        "title": "In-Memory Caching",
        "description": "Dicts provide O(1) lookup for memoization."
      },
      {
        "title": "Deduplication",
        "description": "Sets remove duplicates from imports/APIs."
      }
    ],
    "bestPractices": [
      "Dict lookup beats linear list search",
      "Use tuples for immutable records",
      "Use .get() and defaultdict to avoid KeyError",
      "Copy lists with list.copy() to avoid aliasing"
    ],
    "commonErrors": [
      {
        "error": "TypeError: unhashable type: list",
        "fix": "Cannot put a list in a set/dict key — use a tuple."
      },
      {
        "error": "RuntimeError: dict changed size during iteration",
        "fix": "Iterate over a copy: for k in list(d.keys())."
      },
      {
        "error": "Shallow copy surprises",
        "fix": "list.copy() is shallow; use copy.deepcopy() for nested."
      }
    ]
  },
  {
    "id": "python-design-patterns",
    "name": "Python Design Patterns",
    "icon": "🏗️",
    "category": "basics",
    "difficulty": "intermediate",
    "description": "Gang of Four patterns in idiomatic Python: Singleton, Factory, Observer, Strategy",
    "tags": [
      "Design Patterns",
      "Architecture",
      "SOLID"
    ],
    "prerequisites": [
      "Python OOP"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Why Design Patterns?"
      },
      {
        "type": "paragraph",
        "text": "Design patterns are proven solutions to recurring software design problems. They provide a shared vocabulary and help avoid reinventing the wheel. Python's dynamic nature makes some patterns implicit — first-class functions make Strategy trivial."
      },
      {
        "type": "heading",
        "text": "Pattern Categories"
      },
      {
        "type": "list",
        "items": [
          "Creational: Singleton, Factory, Builder",
          "Structural: Adapter, Decorator, Facade",
          "Behavioral: Observer, Strategy, Command, State"
        ]
      }
    ],
    "concepts": [
      {
        "name": "Singleton",
        "description": "Ensures exactly one instance exists globally."
      },
      {
        "name": "Factory Method",
        "description": "Defines interface for creating objects, letting subclasses decide."
      },
      {
        "name": "Adapter",
        "description": "Converts one interface to another."
      },
      {
        "name": "Decorator",
        "description": "Wraps behavior without modifying the original."
      },
      {
        "name": "Observer",
        "description": "One-to-many dependency, notifications on change."
      },
      {
        "name": "Strategy",
        "description": "Encapsulates interchangeable algorithms behind a common interface."
      }
    ],
    "codeExamples": [
      {
        "title": "Singleton via Metaclass",
        "description": "Thread-safe single instance",
        "language": "python",
        "code": "import threading\n\nclass SingletonMeta(type):\n    _instances = {}\n    _lock = threading.Lock()\n    def __call__(cls, *args, **kwargs):\n        with cls._lock:\n            if cls not in cls._instances:\n                cls._instances[cls] = super().__call__(*args, **kwargs)\n        return cls._instances[cls]\n\nclass Config(metaclass=SingletonMeta):\n    def __init__(self): self.theme = \"dark\"\n\nprint(Config() is Config())  # True"
      },
      {
        "title": "Observer Pattern",
        "description": "Publish-subscribe events",
        "language": "python",
        "code": "class Subject:\n    def __init__(self): self._observers = []\n    def attach(self, obs): self._observers.append(obs)\n    def notify(self, data):\n        for obs in self._observers: obs.update(data)\n\nclass Logger:\n    def update(self, data): print(f\"[LOG] {data}\")\n\nclass Alert:\n    def update(self, data):\n        if data.get(\"priority\")==\"high\":\n            print(f\"[ALERT] {data['message']}\")\n\ns = Subject()\ns.attach(Logger()); s.attach(Alert())\ns.notify({\"priority\":\"high\", \"message\":\"Server down\"})"
      },
      {
        "title": "Strategy as Functions",
        "description": "Pythonic strategy pattern",
        "language": "python",
        "code": "def bubble_sort(data): return sorted(data)\ndef radix_sort(data): return sorted(data)  # simplified\n\nclass Sorter:\n    def __init__(self, strategy=bubble_sort):\n        self._strategy = strategy\n    def sort_data(self, data):\n        return self._strategy(data)\n\ns = Sorter(radix_sort)\nprint(s.sort_data([3, 1, 2]))  # [1, 2, 3]"
      },
      {
        "title": "Strategy & Observer Patterns",
        "description": "Behavioral design patterns",
        "language": "python",
        "code": "# Strategy Pattern: swap algorithms at runtime\nclass SortStrategy:\n    def sort(self, data): raise NotImplementedError\n\nclass BubbleSort(SortStrategy):\n    def sort(self, data):\n        arr = data[:]\n        for i in range(len(arr)):\n            for j in range(len(arr)-1):\n                if arr[j] > arr[j+1]:\n                    arr[j], arr[j+1] = arr[j+1], arr[j]\n        return arr\n\nclass QuickSort(SortStrategy):\n    def sort(self, data):\n        if len(data) <= 1: return data\n        pivot = data[len(data)//2]\n        left = [x for x in data if x < pivot]\n        mid = [x for x in data if x == pivot]\n        right = [x for x in data if x > pivot]\n        return self.sort(left) + mid + self.sort(right)\n\nclass Sorter:\n    def __init__(self, strategy: SortStrategy):\n        self._strategy = strategy\n    def set_strategy(self, strategy: SortStrategy):\n        self._strategy = strategy\n    def sort(self, data):\n        return self._strategy.sort(data)\n\nsorter = Sorter(BubbleSort())\nprint(sorter.sort([3,1,4,1,5,9]))\nsorter.set_strategy(QuickSort())\nprint(sorter.sort([3,1,4,1,5,9]))"
      },
      {
        "title": "Factory & Singleton Patterns",
        "description": "Creational design patterns",
        "language": "python",
        "code": "# Factory Pattern\nclass Dog:\n    def speak(self): return \"Woof!\"\n\nclass Cat:\n    def speak(self): return \"Meow!\"\n\nclass AnimalFactory:\n    _registry = {\"dog\": Dog, \"cat\": Cat}\n    \n    @classmethod\n    def create(cls, animal_type):\n        if animal_type not in cls._registry:\n            raise ValueError(f\"Unknown animal: {animal_type}\")\n        return cls._registry[animal_type]()\n    \n    @classmethod\n    def register(cls, name, klass):\n        cls._registry[name] = klass\n\nanimal = AnimalFactory.create(\"dog\")\nprint(animal.speak())  # Woof!\n\n# Singleton Pattern\nclass Database:\n    _instance = None\n    \n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n            cls._instance.connected = True\n            print(\"Database connection created\")\n        return cls._instance\n\ndb1 = Database()  # Database connection created\ndb2 = Database()  # (nothing printed)\nprint(db1 is db2)  # True"
      }
    ],
    "useCases": [
      {
        "title": "Config Management",
        "description": "Singleton for shared settings."
      },
      {
        "title": "Plugin Systems",
        "description": "Factory loads plugins dynamically."
      },
      {
        "title": "Event-driven Architecture",
        "description": "Observer powers event buses and UI events."
      }
    ],
    "bestPractices": [
      "Prefer idiomatic Python over rigid boilerplate",
      "Only use patterns that simplify code",
      "Favor composition and interfaces over deep inheritance"
    ],
    "commonErrors": [
      {
        "error": "Pattern over-engineering",
        "fix": "Apply patterns only where they remove complexity."
      },
      {
        "error": "Singleton hiding global state",
        "fix": "Consider dependency injection instead."
      }
    ]
  },
  {
    "id": "concurrency-python",
    "name": "Concurrency with Python",
    "icon": "⚡",
    "category": "basics",
    "difficulty": "advanced",
    "description": "Threading, multiprocessing, asyncio, and the GIL",
    "tags": [
      "Concurrency",
      "Threading",
      "Multiprocessing",
      "asyncio"
    ],
    "prerequisites": [
      "Strong Python"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "The GIL"
      },
      {
        "type": "paragraph",
        "text": "CPython's Global Interpreter Lock serializes bytecode execution, making true parallel Python threads impossible. Threads release the GIL during I/O, so thread pools are ideal for I/O-bound work. CPU-bound tasks need multiprocessing."
      },
      {
        "type": "heading",
        "text": "Three Models"
      },
      {
        "type": "list",
        "items": [
          "Threads (ThreadPoolExecutor): I/O-bound tasks",
          "Processes (ProcessPoolExecutor): CPU-bound tasks",
          "Asyncio: cooperative concurrency for high-connection I/O"
        ]
      },
      {
        "type": "paragraph",
        "text": "Profile first to determine I/O vs CPU bound. Always guard shared state with locks."
      }
    ],
    "concepts": [
      {
        "name": "GIL",
        "description": "Serializes Python bytecode execution across threads."
      },
      {
        "name": "Race Condition",
        "description": "Unpredictable outcome from unsynchronized shared state."
      },
      {
        "name": "Lock",
        "description": "Mutex for mutually exclusive access."
      },
      {
        "name": "ThreadPoolExecutor",
        "description": "Manages thread pool for I/O-bound work."
      },
      {
        "name": "ProcessPoolExecutor",
        "description": "Parallelism across CPU cores."
      },
      {
        "name": "async/await",
        "description": "Cooperative multitasking on a single thread."
      }
    ],
    "codeExamples": [
      {
        "title": "ThreadPoolExecutor",
        "description": "Concurrent I/O",
        "language": "python",
        "code": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef fetch(url):\n    time.sleep(1)\n    return f\"Fetched {url}\"\n\nurls = [f\"http://site.com/{i}\" for i in range(10)]\nt0 = time.time()\nwith ThreadPoolExecutor(max_workers=5) as pool:\n    results = list(pool.map(fetch, urls))\nprint(f\"Threads took {time.time()-t0:.2f}s\")  # ~2s not 10s"
      },
      {
        "title": "ProcessPoolExecutor",
        "description": "CPU parallelism",
        "language": "python",
        "code": "from concurrent.futures import ProcessPoolExecutor\nimport math\n\ndef heavy(n): return sum(math.sqrt(i) for i in range(n))\n\nnums = [1_000_000 + i*500_000 for i in range(6)]\nwith ProcessPoolExecutor(max_workers=4) as pool:\n    results = list(pool.map(heavy, nums))\nprint(f\"Computed {len(results)} results in parallel\")"
      },
      {
        "title": "Asyncio",
        "description": "Cooperative concurrency",
        "language": "python",
        "code": "import asyncio\n\nasync def fetch(sid, url):\n    await asyncio.sleep(1)\n    return f\"session {sid} got {url}\"\n\nasync def main():\n    tasks = [fetch(i, \"http://ex.com\") for i in range(20)]\n    return await asyncio.gather(*tasks)\n\nresults = asyncio.run(main())\nprint(f\"{len(results)} requests concurrently\")"
      },
      {
        "title": "Thread Safety with Locks",
        "description": "Protecting shared state",
        "language": "python",
        "code": "import threading\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    for _ in range(1000):\n        with lock: counter += 1\n\nthreads = [threading.Thread(target=increment) for _ in range(10)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(counter)  # 10000"
      },
      {
        "title": "asyncio Event Loop",
        "description": "Async/await patterns",
        "language": "python",
        "code": "import asyncio\nimport time\n\nasync def fetch_data(url, delay):\n    print(f\"Fetching {url}...\")\n    await asyncio.sleep(delay)  # simulates network I/O\n    return {\"url\": url, \"data\": f\"response from {url}\"}\n\nasync def main():\n    start = time.time()\n    \n    # Concurrent execution: all 3 run in parallel\n    results = await asyncio.gather(\n        fetch_data(\"api/users\", 1.0),\n        fetch_data(\"api/posts\", 1.5),\n        fetch_data(\"api/comments\", 0.5),\n    )\n    \n    elapsed = time.time() - start\n    for r in results:\n        print(f\"  Got: {r}\")\n    print(f\"Total time: {elapsed:.1f}s (not {1+1.5+0.5}s)\")\n    \n    # Semaphore: limit concurrent requests\n    sem = asyncio.Semaphore(2)\n    async def limited_fetch(url):\n        async with sem:\n            return await fetch_data(url, 1)\n    \n    tasks = [limited_fetch(f\"api/item/{i}\") for i in range(6)]\n    await asyncio.gather(*tasks)\n\nasyncio.run(main())"
      },
      {
        "title": "Threading vs Multiprocessing",
        "description": "When to use each",
        "language": "python",
        "code": "import threading\nimport multiprocessing\nimport time\n\ndef cpu_bound(n):\n    \"\"\"CPU-intensive work.\"\"\"\n    return sum(i*i for i in range(n))\n\ndef io_bound(url):\n    \"\"\"IO-intensive work (simulated).\"\"\"\n    time.sleep(1)  # simulates network wait\n    return f\"Done: {url}\"\n\n# Threading: good for IO-bound tasks\ndef threaded_io():\n    start = time.time()\n    threads = []\n    for url in [\"a.com\", \"b.com\", \"c.com\"]:\n        t = threading.Thread(target=io_bound, args=(url,))\n        threads.append(t)\n        t.start()\n    for t in threads:\n        t.join()\n    print(f\"Threaded IO: {time.time()-start:.1f}s\")  # ~1s not 3s\n\n# Multiprocessing: good for CPU-bound tasks\ndef multiprocess_cpu():\n    start = time.time()\n    with multiprocessing.Pool(4) as pool:\n        results = pool.map(cpu_bound, [10**7]*4)\n    print(f\"Parallel CPU: {time.time()-start:.1f}s\")\n    print(f\"Results: {results[:2]}...\")\n\nthreaded_io()\nmultiprocess_cpu()"
      }
    ],
    "useCases": [
      {
        "title": "Web Scraping at Scale",
        "description": "Crawl hundreds of URLs concurrently."
      },
      {
        "title": "API Fan-out",
        "description": "Call multiple services in parallel."
      },
      {
        "title": "ML Data Prep",
        "description": "Process data chunks with ProcessPoolExecutor."
      }
    ],
    "bestPractices": [
      "Profile first to determine I/O vs CPU bound",
      "Prefer concurrent.futures over raw threading",
      "Always use locks for shared mutable state",
      "Keep critical sections short in asyncio"
    ],
    "commonErrors": [
      {
        "error": "Deadlock",
        "fix": "Two threads wait on each other's locks. Use with lock: and consistent ordering."
      },
      {
        "error": "Data corruption",
        "fix": "Multiple threads mutating shared state. Add a lock."
      },
      {
        "error": "RuntimeError on Windows multiprocessing",
        "fix": "Guard with if __name__ == \"__main__\"."
      }
    ]
  },
  {
    "id": "numpy",
    "name": "NumPy",
    "icon": "🧮",
    "category": "data",
    "difficulty": "beginner",
    "description": "Fundamental package for scientific computing with n-dimensional arrays",
    "tags": [
      "NumPy",
      "Arrays",
      "Scientific Computing",
      "Linear Algebra"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "What is NumPy?"
      },
      {
        "type": "paragraph",
        "text": "NumPy (Numerical Python) is the foundational library for scientific computing. Its core object is the ndarray: a homogeneous n-dimensional array enabling fast vectorized operations. NumPy arrays store data in contiguous memory, making operations 10-100x faster than Python lists because they run in optimized C loops."
      },
      {
        "type": "heading",
        "text": "Vectorization & Broadcasting"
      },
      {
        "type": "paragraph",
        "text": "Vectorization removes explicit loops � apply a function to an entire array at once. Broadcasting allows operating on arrays of different shapes by aligning and repeating dimensions. NumPy also provides linear algebra (np.linalg), random number generation (np.random), Fourier transforms (np.fft), and statistics."
      }
    ],
    "concepts": [
      {
        "name": "ndarray",
        "description": "Fast homogeneous n-dimensional array � the core data structure."
      },
      {
        "name": "dtype",
        "description": "Element type (int64, float32, bool) fixing memory footprint."
      },
      {
        "name": "Broadcasting",
        "description": "Operating on arrays of different shapes."
      },
      {
        "name": "Vectorization",
        "description": "Array operations in C loops instead of Python loops."
      },
      {
        "name": "Views vs Copies",
        "description": "Slicing returns views; .copy() creates independent copies."
      },
      {
        "name": "Random Module",
        "description": "np.random for distributions and shuffling."
      }
    ],
    "codeExamples": [
      {
        "title": "Creating Arrays",
        "description": "Ways to build ndarrays",
        "language": "python",
        "code": "import numpy as np\n\na = np.array([1, 2, 3, 4])\nprint(a, a.shape, a.dtype)\n\nz = np.zeros((2, 3))\nr = np.arange(0, 10, 2)\nl = np.linspace(0, 1, 5)\nrnd = np.random.rand(3, 3)\nprint(z, r, l, sep=\"\\n\")"
      },
      {
        "title": "Vectorized Operations",
        "description": "Fast element-wise math",
        "language": "python",
        "code": "x = np.array([1, 2, 3])\ny = np.array([4, 5, 6])\nprint(x + y)     # [5 7 9]\nprint(x * 2)     # [2 4 6]\nprint(np.sqrt(x))\nprint(x.dot(y))  # 32\nprint(np.mean(x), np.std(x))"
      },
      {
        "title": "Reshaping & Broadcasting",
        "description": "Shape manipulation",
        "language": "python",
        "code": "a = np.arange(12)\nm = a.reshape(3, 4)\nprint(m)\nprint(m.T.shape)  # (4, 3)\n\ncol = np.array([1,2,3]).reshape(3,1)\nrow = np.array([10,20,30,40])\nresult = col + row  # broadcasting (3,4)\nprint(result)"
      },
      {
        "title": "Linear Algebra",
        "description": "Matrix operations",
        "language": "python",
        "code": "A = np.array([[2,1],[1,3]])\nb = np.array([1,2])\n\nx = np.linalg.solve(A, b)\nprint(x)           # [-0.2  1.4]\n\nvals, vecs = np.linalg.eig(A)\nprint(vals)\nprint(A @ np.linalg.inv(A))  # identity"
      },
      {
        "title": "Boolean Indexing & Fancy Indexing",
        "description": "Advanced array selection",
        "language": "python",
        "code": "import numpy as np\n\n# Boolean indexing\narr = np.array([10, 25, 3, 47, 8, 33, 2])\nmask = arr > 20\nprint(arr[mask])  # [25 47 33]\nprint(arr[arr > 20].mean())  # 35.0\n\n# Fancy indexing: select arbitrary elements\nindices = [0, 3, 5]\nprint(arr[indices])  # [10 47 33]\n\n# 2D fancy indexing\nmatrix = np.arange(12).reshape(3, 4)\nrows = np.array([0, 2, 1])\ncols = np.array([1, 3, 0])\nprint(matrix[rows, cols])  # [ 1 11  4]\n\n# Conditional assignment\narr = np.array([1, -2, 3, -4, 5])\narr[arr < 0] = 0  # replace negatives\nprint(arr)  # [1 0 3 0 5]\n\n# np.where: vectorized ternary\nresult = np.where(arr > 2, \"high\", \"low\")\nprint(result)  # ['low' 'low' 'high' 'low' 'high']"
      },
      {
        "title": "Structured Arrays & Records",
        "description": "Typed arrays with named fields",
        "language": "python",
        "code": "import numpy as np\n\n# Structured array: like a table in memory\ndtype = [('name', 'U10'), ('age', 'i4'), ('salary', 'f8')]\nemployees = np.array([\n    ('Alice', 30, 75000.0),\n    ('Bob', 25, 65000.0),\n    ('Charlie', 35, 90000.0),\n], dtype=dtype)\n\n# Access by field name\nprint(employees['name'])  # ['Alice' 'Bob' 'Charlie']\nprint(employees['salary'].mean())  # 76666.67\n\n# Sort by field\nsorted_emps = np.sort(employees, order='salary')\nfor e in sorted_emps:\n    print(f\"  {e['name']}: ${e['salary']:,.0f}\")\n\n# Boolean mask on fields\nsenior = employees[employees['age'] > 28]\nprint(f\"Senior employees: {len(senior)}\")\n\n# Record array (attribute access)\nrecs = np.rec.fromrecords([\n    ('Product A', 29.99, 150),\n    ('Product B', 49.99, 80),\n], names=['product', 'price', 'quantity'])\nprint(recs.product)  # ['Product A' 'Product B']\nprint((recs.price * recs.quantity).sum())  # Total revenue"
      }
    ],
    "useCases": [
      {
        "title": "Data Preprocessing",
        "description": "Every pandas DataFrame stores NumPy arrays underneath."
      },
      {
        "title": "Image Processing",
        "description": "Images are 3D arrays; NumPy does crops, flips, filtering."
      },
      {
        "title": "Signal Processing",
        "description": "np.fft performs Fourier transforms for audio analysis."
      },
      {
        "title": "Simulation",
        "description": "np.random generates millions of samples for Monte Carlo."
      }
    ],
    "bestPractices": [
      "Always vectorize over Python loops",
      "Understand views vs copies for memory safety",
      "Set random seeds for reproducibility",
      "Use appropriate dtypes for memory control"
    ],
    "commonErrors": [
      {
        "error": "ValueError: operands could not broadcast",
        "fix": "Check shapes with .shape and reshape before combining."
      },
      {
        "error": "MemoryError with huge arrays",
        "fix": "Use float32 or int32 instead of 64-bit defaults."
      },
      {
        "error": "Setting array element with sequence",
        "fix": "Ensure all rows have equal length or use dtype=object."
      }
    ]
  },
  {
    "id": "python-pandas",
    "name": "Python Pandas",
    "icon": "🐼",
    "category": "data",
    "difficulty": "beginner",
    "description": "DataFrames and Series for data manipulation, analysis, and time series",
    "tags": [
      "Pandas",
      "DataFrame",
      "Data Analysis",
      "CSV"
    ],
    "prerequisites": [
      "Python basics",
      "NumPy basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "What is Pandas?"
      },
      {
        "type": "paragraph",
        "text": "Pandas is the Python library for data manipulation built on NumPy. Its core structures are Series (1D labeled array) and DataFrame (2D table). Typical workflows: import (read_csv), inspect (head, info, describe), clean (dropna, fillna), select (loc, iloc, masks), transform (apply, map), aggregate (groupby, pivot_table), and merge (merge, concat)."
      },
      {
        "type": "heading",
        "text": "Performance"
      },
      {
        "type": "paragraph",
        "text": "Prefer vectorized pandas methods over row-wise apply. Always check dtypes after reading CSVs. Use .copy() before chained assignment. Chain operations with .pipe for readability."
      }
    ],
    "concepts": [
      {
        "name": "Series",
        "description": "1D labeled array with index."
      },
      {
        "name": "DataFrame",
        "description": "2D tabular structure with labeled rows and columns."
      },
      {
        "name": "loc / iloc",
        "description": "Label-based vs integer-position selection."
      },
      {
        "name": "groupby",
        "description": "Split-apply-combine aggregation."
      },
      {
        "name": "Merge/Concat",
        "description": "Combine DataFrames via joins or stacking."
      },
      {
        "name": "Pivot Tables",
        "description": "Reshape and aggregate like a spreadsheet."
      }
    ],
    "codeExamples": [
      {
        "title": "Reading & Inspecting",
        "description": "Load and explore data",
        "language": "python",
        "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"product\": [\"A\",\"B\",\"C\",\"A\",\"B\"],\n    \"region\": [\"East\",\"East\",\"West\",\"West\",\"East\"],\n    \"amount\": [120,85,300,90,110]\n})\nprint(df.head())\nprint(df.info())\nprint(df.describe())"
      },
      {
        "title": "Filtering",
        "description": "Boolean masks",
        "language": "python",
        "code": "# filter\nbig = df[df[\"amount\"] > 100]\n\n# multiple conditions\nhigh_west = df[(df[\"amount\"]>100) & (df[\"region\"]==\"West\")]\n\n# query\nprint(df.query(\"amount > 100 and region == 'East'\"))"
      },
      {
        "title": "GroupBy & Aggregation",
        "description": "Split-apply-combine",
        "language": "python",
        "code": "total = df.groupby(\"product\")[\"amount\"].sum()\nprint(total)\n\nstats = df.groupby(\"region\").agg(\n    total=(\"amount\",\"sum\"),\n    avg=(\"amount\",\"mean\")\n)\nprint(stats)\n\npv = df.pivot_table(values=\"amount\", index=\"region\",\n                    columns=\"product\", aggfunc=\"sum\", fill_value=0)\nprint(pv)"
      },
      {
        "title": "Cleaning",
        "description": "Handle missing values",
        "language": "python",
        "code": "df2 = df.copy()\ndf2.loc[2, \"amount\"] = None\n\nprint(df2[\"amount\"].fillna(df2[\"amount\"].mean()))\n\ndf[\"amount_doubled\"] = df[\"amount\"] * 2\ndf[\"product_lower\"] = df[\"product\"].str.lower()\ndf[\"tier\"] = pd.cut(df[\"amount\"], bins=[0,100,200,500],\n                    labels=[\"low\",\"mid\",\"high\"])"
      },
      {
        "title": "Time Series & Resampling",
        "description": "Working with datetime indexes",
        "language": "python",
        "code": "import pandas as pd\nimport numpy as np\n\n# Create time series\ndates = pd.date_range('2024-01-01', periods=365, freq='D')\nnp.random.seed(42)\nts = pd.Series(np.random.randn(365).cumsum() + 100, index=dates)\n\n# Resample: daily -> monthly\nmonthly = ts.resample('M').agg(['mean', 'std', 'min', 'max'])\nprint(monthly.head())\n\n# Rolling window\nrolling_7d = ts.rolling(7).mean()\nrolling_30d = ts.rolling(30).mean()\nprint(f\"7-day avg: {rolling_7d.iloc[-1]:.2f}\")\n\n# Time-based indexing\njanuary = ts['2024-01']\nq1 = ts['2024-01':'2024-03']\nprint(f\"Jan mean: {january.mean():.2f}\")\nprint(f\"Q1 observations: {len(q1)}\")\n\n# Period conversion\nmonthly_returns = ts.resample('M').last().pct_change()\nprint(f\"Best month return: {monthly_returns.max():.2%}\")"
      },
      {
        "title": "Method Chaining & .pipe()",
        "description": "Readable data transformations",
        "language": "python",
        "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    'department': ['Sales','Sales','Eng','Eng','HR','HR'],\n    'employee': ['A','B','C','D','E','F'],\n    'salary': [70000, 80000, 95000, 110000, 60000, 65000],\n    'bonus': [5000, 8000, 10000, 15000, 3000, 4000],\n    'years': [2, 4, 3, 7, 5, 2]\n})\n\n# Method chaining: read -> clean -> transform -> aggregate\nresult = (\n    df\n    .assign(total_comp=lambda d: d['salary'] + d['bonus'])\n    .assign(comp_per_year=lambda d: d['total_comp'] / d['years'])\n    .query('years >= 3')\n    .groupby('department')\n    .agg(\n        avg_total=('total_comp', 'mean'),\n        avg_per_year=('comp_per_year', 'mean'),\n        headcount=('employee', 'count')\n    )\n    .round(0)\n)\nprint(result)\n\n# Custom pipe\ndef add_ranking(df, column):\n    return df.assign(**{f'{column}_rank': df[column].rank(ascending=False).astype(int)})\n\ndf_ranked = df.pipe(add_ranking, 'salary')\nprint(df_ranked[['employee', 'salary', 'salary_rank']])"
      }
    ],
    "useCases": [
      {
        "title": "Business Reporting",
        "description": "Aggregate sales/CRM into dashboards with groupby/pivot."
      },
      {
        "title": "ETL Pipelines",
        "description": "Read CSVs/APIs, clean, transform, write to database."
      },
      {
        "title": "EDA",
        "description": "Quickly profile distributions and correlations before modeling."
      },
      {
        "title": "Financial Analysis",
        "description": "Resample stock prices and compute rolling volatility."
      }
    ],
    "bestPractices": [
      "Prefer vectorized methods over apply",
      "Use .copy() before chained assignment",
      "Check dtypes after CSV reads",
      "Use category dtype for low-cardinality strings"
    ],
    "commonErrors": [
      {
        "error": "SettingWithCopyWarning",
        "fix": "Use df.loc[:, \"col\"] = ... or add .copy() explicitly."
      },
      {
        "error": "KeyError: \"column\"",
        "fix": "Check df.columns for exact name; use df.reindex for safe selection."
      },
      {
        "error": "Mixed types in aggregation",
        "fix": "Downcast with .astype() before grouping."
      }
    ]
  },
  {
    "id": "matplotlib",
    "name": "Matplotlib",
    "icon": "📊",
    "category": "data",
    "difficulty": "beginner",
    "description": "Publication-quality plotting: figures, axes, charts, and styling",
    "tags": [
      "Matplotlib",
      "Visualization",
      "Plots"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Matplotlib Fundamentals"
      },
      {
        "type": "paragraph",
        "text": "Matplotlib is Python's most established plotting library. The two interfaces are pyplot (stateful, MATLAB-like) and object-oriented (explicit Figure/Axes). The OO interface is recommended � it makes intent explicit. The Figure is the canvas; Axes are the coordinate regions; Artists are drawable elements."
      },
      {
        "type": "paragraph",
        "text": "Matplotlib pairs with NumPy, integrates with pandas via DataFrame.plot(), and renders to PNG, SVG, PDF at arbitrary DPI. For interactive web dashboards, pair with mplcursors or serve via Flask."
      }
    ],
    "concepts": [
      {
        "name": "Figure",
        "description": "Top-level canvas containing all axes."
      },
      {
        "name": "Axes",
        "description": "Coordinate region with ticks, labels, and plots."
      },
      {
        "name": "Subplots",
        "description": "Rectangular grids of multiple axes."
      },
      {
        "name": "rcParams",
        "description": "Global defaults for consistent styling."
      },
      {
        "name": "Artists",
        "description": "Every drawable element with configurable properties."
      }
    ],
    "codeExamples": [
      {
        "title": "Line & Scatter",
        "description": "Basic plotting",
        "language": "python",
        "code": "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\n\nplt.figure(figsize=(8, 4))\nplt.plot(x, y, marker=\"o\", linestyle=\"--\", label=\"Linear\")\nplt.xlabel(\"X axis\")\nplt.ylabel(\"Y axis\")\nplt.title(\"Example Plot\")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.savefig(\"plot.png\", dpi=150)"
      },
      {
        "title": "Subplots OO",
        "description": "Object-oriented multi-plot",
        "language": "python",
        "code": "import numpy as np\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\nx = np.linspace(0, 10, 100)\n\naxes[0,0].plot(x, np.sin(x))\naxes[0,0].set_title(\"Sine\")\n\naxes[0,1].bar([\"A\",\"B\",\"C\"], [12,5,7])\naxes[0,1].set_title(\"Bar chart\")\n\naxes[1,0].hist(np.random.randn(500), bins=30)\naxes[1,0].set_title(\"Histogram\")\n\naxes[1,1].pie([40,30,20], labels=[\"X\",\"Y\",\"Z\"], autopct=\"%1.1f%%\")\naxes[1,1].set_title(\"Pie\")\n\nfig.tight_layout()"
      },
      {
        "title": "Annotations",
        "description": "Text and arrows",
        "language": "python",
        "code": "fig, ax = plt.subplots(figsize=(8, 5))\nx = [0,1,2,3,4]\ny = [10,45,23,78,90]\nax.plot(x, y, linewidth=2.5, marker=\"D\")\nax.set_xticks(x)\nax.set_xticklabels([\"Jan\",\"Feb\",\"Mar\",\"Apr\",\"May\"], rotation=45)\nax.annotate(\"Peak\", xy=(4,90), xytext=(3,75),\n            arrowprops=dict(arrowstyle=\"->\", color=\"red\"))\nplt.tight_layout()"
      },
      {
        "title": "3D Plotting & Animation",
        "description": "Advanced visualization",
        "language": "python",
        "code": "import matplotlib.pyplot as plt\nimport numpy as np\nfrom mpl_toolkits.mplot3d import Axes3D\n\n# 3D Surface plot\nfig = plt.figure(figsize=(10, 4))\n\nax1 = fig.add_subplot(121, projection='3d')\nx = np.linspace(-5, 5, 50)\ny = np.linspace(-5, 5, 50)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\nax1.plot_surface(X, Y, Z, cmap='viridis', alpha=0.8)\nax1.set_title('3D Surface')\n\n# Polar plot\nax2 = fig.add_subplot(122, projection='polar')\ntheta = np.linspace(0, 2*np.pi, 100)\nr = 1 + 0.5*np.cos(5*theta)\nax2.plot(theta, r, linewidth=2)\nax2.fill(theta, r, alpha=0.3)\nax2.set_title('Polar: Limacon')\n\nplt.tight_layout()\nplt.savefig('advanced_plots.png', dpi=150)\nprint(\"Saved advanced_plots.png\")"
      }
    ],
    "useCases": [
      {
        "title": "Data Exploration",
        "description": "Quick histograms reveal distributions during analysis."
      },
      {
        "title": "Business Dashboards",
        "description": "KPI trends rendered from pandas into management reports."
      },
      {
        "title": "Scientific Publishing",
        "description": "Publication-grade figures with LaTeX math and vector output."
      },
      {
        "title": "ML Explainability",
        "description": "Plot training curves, confusion matrices, feature importances."
      }
    ],
    "bestPractices": [
      "Use OO interface (fig, ax = plt.subplots)",
      "Call tight_layout() before saving",
      "Use consistent style sheets",
      "Save vector formats for documentation, PNG at 300 DPI for slides"
    ],
    "commonErrors": [
      {
        "error": "Figures not showing in Jupyter",
        "fix": "Add %matplotlib inline magic or call plt.show()."
      },
      {
        "error": "Labels cut off",
        "fix": "Call plt.tight_layout() or use constrained_layout=True."
      },
      {
        "error": "Memory leaks",
        "fix": "Close figures with plt.close() after saving in batch jobs."
      }
    ]
  },
  {
    "id": "seaborn",
    "name": "Seaborn",
    "icon": "🎨",
    "category": "data",
    "difficulty": "beginner",
    "description": "Statistical data visualization built on Matplotlib",
    "tags": [
      "Seaborn",
      "Statistics",
      "Visualization",
      "Heatmaps"
    ],
    "prerequisites": [
      "Matplotlib basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Seaborn Overview"
      },
      {
        "type": "paragraph",
        "text": "Seaborn specializes in statistical charts with attractive defaults. It takes DataFrames directly, manages color palettes, and bundles statistical estimation (confidence intervals, KDEs, regressions) out of the box. The key abstractions are figure-level (relplot, catplot, displot) and axes-level (scatterplot, boxplot, histplot) functions."
      },
      {
        "type": "paragraph",
        "text": "Seaborn computes and displays confidence bands automatically via bootstrapping, merging statistical inference with visualization."
      }
    ],
    "concepts": [
      {
        "name": "hue parameter",
        "description": "Colors points by a categorical column automatically."
      },
      {
        "name": "Confidence Intervals",
        "description": "Seaborn plots bootstrapped CIs on aggregates."
      },
      {
        "name": "Palettes",
        "description": "Color choices: hls, husl, \"colorblind\", \"rocket\"."
      },
      {
        "name": "KDE",
        "description": "Kernel density estimation for smooth distributions."
      },
      {
        "name": "Heatmap",
        "description": "Visualizes correlation matrices and 2D grids."
      },
      {
        "name": "Pairplot",
        "description": "All bivariate relationships at once."
      }
    ],
    "codeExamples": [
      {
        "title": "Scatter with Hue",
        "description": "Categorized scatter",
        "language": "python",
        "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\n\ndf = sns.load_dataset(\"penguins\")\nsns.scatterplot(data=df, x=\"bill_length_mm\",\n                y=\"flipper_length_mm\", hue=\"species\")\nplt.title(\"Penguin dimensions\")\nplt.show()"
      },
      {
        "title": "Box & Violin",
        "description": "Distribution by category",
        "language": "python",
        "code": "fig, axes = plt.subplots(1, 2, figsize=(12, 5))\nsns.boxplot(data=df, x=\"species\", y=\"body_mass_g\", ax=axes[0])\nsns.violinplot(data=df, x=\"species\", y=\"bill_depth_mm\", ax=axes[1])\nplt.suptitle(\"Distributions by species\")\nplt.show()"
      },
      {
        "title": "Heatmap",
        "description": "Correlation matrix",
        "language": "python",
        "code": "corr = df[[\"bill_length_mm\",\"bill_depth_mm\",\"flipper_length_mm\",\"body_mass_g\"]].corr()\nplt.figure(figsize=(7,6))\nsns.heatmap(corr, annot=True, cmap=\"coolwarm\", fmt=\".2f\")\nplt.title(\"Correlation Matrix\")\nplt.show()"
      },
      {
        "title": "FacetGrid & PairGrid",
        "description": "Multi-panel visualizations",
        "language": "python",
        "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\nimport numpy as np\n\n# Generate sample data\nnp.random.seed(42)\ndf = pd.DataFrame({\n    'x': np.random.randn(200),\n    'y': np.random.randn(200),\n    'category': np.random.choice(['A', 'B', 'C'], 200),\n    'size': np.random.choice(['small', 'large'], 200)\n})\n\n# FacetGrid: separate panels per category\ng = sns.FacetGrid(df, col='category', hue='size', height=3.5)\ng.map(sns.scatterplot, 'x', 'y', alpha=0.7)\ng.add_legend()\ng.set_titles('{col_name}')\nplt.savefig('facetgrid.png', dpi=150)\n\n# PairGrid: all variable combinations\ng2 = sns.PairGrid(df[['x', 'y', 'category']], hue='category')\ng2.map_upper(sns.scatterplot, alpha=0.5)\ng2.map_lower(sns.kdeplot, fill=True)\ng2.map_diag(sns.histplot, kde=True)\ng2.add_legend()\nplt.savefig('pairgrid.png', dpi=150)\nprint(\"Saved facetgrid.png and pairgrid.png\")"
      }
    ],
    "useCases": [
      {
        "title": "EDA",
        "description": "Pairplots and heatmaps reveal relationships quickly."
      },
      {
        "title": "Statistical Reporting",
        "description": "Barplots with error bars communicate estimates."
      },
      {
        "title": "Feature Review",
        "description": "Distribution plots check normality before ML transforms."
      }
    ],
    "bestPractices": [
      "Pass DataFrames and column names directly",
      "Combine seaborn with Matplotlib for final styling",
      "Use modest palette sizes (<=8)",
      "Downsample before scatterplot on large data"
    ],
    "commonErrors": [
      {
        "error": "TypeError: hue must be categorical",
        "fix": "Ensure hue values are strings/categorical, not continuous floats."
      },
      {
        "error": "Slow plots on large data",
        "fix": "Sample or drop KDE estimation where not needed."
      },
      {
        "error": "Overlapping labels",
        "fix": "Use sns.set_theme(rc={\"figure.autolayout\":True})."
      }
    ]
  },
  {
    "id": "scipy",
    "name": "SciPy",
    "icon": "🔬",
    "category": "data",
    "difficulty": "intermediate",
    "description": "Scientific computing: optimization, integration, interpolation, statistics",
    "tags": [
      "SciPy",
      "Optimization",
      "Numerical",
      "Science"
    ],
    "prerequisites": [
      "NumPy",
      "Calculus basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "What is SciPy?"
      },
      {
        "type": "paragraph",
        "text": "SciPy layers scientific algorithms on NumPy: optimization (scipy.optimize), integration (scipy.integrate), interpolation, linear algebra (scipy.linalg � LAPACK-powered), statistics (scipy.stats), signal processing (scipy.signal), and sparse matrices (scipy.sparse). Its algorithms are battle-tested C/Fortran implementations."
      },
      {
        "type": "paragraph",
        "text": "Use SciPy when problems move beyond array math: minimizing cost functions, solving ODEs, integrating without closed forms, fitting splines, or testing statistical hypotheses."
      }
    ],
    "concepts": [
      {
        "name": "Optimization",
        "description": "scipy.optimize.minimize for parameter estimation."
      },
      {
        "name": "Integration",
        "description": "quad for integrals; solve_ivp for ODEs."
      },
      {
        "name": "Interpolation",
        "description": "interp1d, griddata, RBFInterpolator."
      },
      {
        "name": "Statistics",
        "description": "scipy.stats: distributions, ttest, ANOVA."
      },
      {
        "name": "Sparse Matrices",
        "description": "Efficient storage for large mostly-zero matrices."
      }
    ],
    "codeExamples": [
      {
        "title": "Optimization",
        "description": "Minimize Rosenbrock",
        "language": "python",
        "code": "from scipy.optimize import minimize\nimport numpy as np\n\ndef rosen(x): return (1-x[0])**2 + 100*(x[1]-x[0]**2)**2\n\nres = minimize(rosen, [0, 0])\nprint(f\"min={res.fun:.6f} at {res.x}\")  # ~0 at [1,1]"
      },
      {
        "title": "Curve Fitting",
        "description": "Nonlinear regression",
        "language": "python",
        "code": "from scipy.optimize import curve_fit\n\ndef model(x, a, b): return a * np.exp(-b * x)\n\nx = np.linspace(0, 4, 50)\ny = 3 * np.exp(-0.5*x) + 0.1*np.random.randn(50)\nparams, cov = curve_fit(model, x, y)\nprint(f\"a={params[0]:.2f}, b={params[1]:.2f}\")  # ~3, ~0.5"
      },
      {
        "title": "Integrals & ODEs",
        "description": "Mathematical operations",
        "language": "python",
        "code": "from scipy.integrate import quad, solve_ivp\n\nresult, err = quad(lambda x: x**2, 0, 1)\nprint(f\"integral={result:.4f}\")  # 0.3333\n\nsol = solve_ivp(lambda t, y: y, (0,1), [1], t_eval=[0,0.5,1])\nprint(sol.y)  # ~[[1.0, 1.648, 2.718]]"
      },
      {
        "title": "Statistics Tests",
        "description": "Hypothesis testing",
        "language": "python",
        "code": "import scipy.stats as stats\n\ng1 = stats.norm.rvs(5, size=30, random_state=1)\ng2 = stats.norm.rvs(5.5, size=30, random_state=2)\nt, p = stats.ttest_ind(g1, g2)\nprint(f\"t={t:.3f}, p={p:.3f}\")\n\nq90 = stats.norm.ppf(0.90)\nprint(f\"90th percentile: {q90:.2f}\")"
      }
    ],
    "useCases": [
      {
        "title": "Portfolio Optimization",
        "description": "Minimize risk given expected returns."
      },
      {
        "title": "Sensor Calibration",
        "description": "curve_fit calibrates response curves."
      },
      {
        "title": "Clinical Statistics",
        "description": "t-tests and ANOVA for medical research."
      },
      {
        "title": "Physics Simulation",
        "description": "solve_ivp integrates equations of motion."
      }
    ],
    "bestPractices": [
      "Pass analytical gradients to minimize for speed",
      "Provide bounds to avoid nonsensical regions",
      "Use sparse solvers for large sparse matrices",
      "Set random_state for reproducible results"
    ],
    "commonErrors": [
      {
        "error": "Optimization did not converge",
        "fix": "Scale variables, pass better initial guesses, or try different method."
      },
      {
        "error": "LinAlgError: matrix singular",
        "fix": "Matrix non-invertible; add regularization or check for dependent rows."
      }
    ]
  },
  {
    "id": "sympy",
    "name": "SymPy",
    "icon": "📐",
    "category": "data",
    "difficulty": "intermediate",
    "description": "Symbolic mathematics: algebra, calculus, equation solving, and LaTeX rendering",
    "tags": [
      "SymPy",
      "Symbolic Math",
      "Calculus",
      "Algebra"
    ],
    "prerequisites": [
      "Python basics",
      "Math"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Symbolic Computing"
      },
      {
        "type": "paragraph",
        "text": "SymPy performs exact symbolic mathematics: simplifying expressions, solving equations symbolically, computing derivatives/integrals as expressions, manipulating matrices exactly, and rendering LaTeX. It is a complete computer algebra system in pure Python."
      },
      {
        "type": "paragraph",
        "text": "Key operations: symbols (variables with assumptions), simplify/expand/factor, calculus (diff/integrate/limit/series), solving (solve/linsolve/dsolve), and printing (latex/pretty)."
      }
    ],
    "concepts": [
      {
        "name": "Symbol",
        "description": "A variable representing a mathematical unknown."
      },
      {
        "name": "simplify",
        "description": "Find the simplest equivalent form."
      },
      {
        "name": "subs",
        "description": "Substitute symbol values for numeric evaluation."
      },
      {
        "name": "dsolve",
        "description": "Solve ordinary differential equations symbolically."
      },
      {
        "name": "latex()",
        "description": "Render expressions as LaTeX source."
      }
    ],
    "codeExamples": [
      {
        "title": "Algebra",
        "description": "Exact arithmetic and simplification",
        "language": "python",
        "code": "import sympy as sp\nx, y = sp.symbols(\"x y\")\n\nexpr = sp.expand((x+1)**3)\nprint(expr)       # x**3 + 3*x**2 + 3*x + 1\nprint(sp.factor(expr))  # (x + 1)**3\n\nsimplified = sp.simplify(sp.sin(x)**2 + sp.cos(x)**2)\nprint(simplified)  # 1"
      },
      {
        "title": "Calculus",
        "description": "Derivatives, integrals, limits",
        "language": "python",
        "code": "import sympy as sp\nx, t = sp.symbols(\"x t\")\n\nprint(sp.diff(sp.sin(x)*sp.exp(x), x))\nprint(sp.integrate(x**2, x))   # x**3/3\nprint(sp.limit(sp.sin(x)/x, x, 0))  # 1\n\nseries = sp.series(sp.exp(x), x, 0, 5)\nprint(series)"
      },
      {
        "title": "Solving Equations",
        "description": "Symbolic solvers",
        "language": "python",
        "code": "import sympy as sp\nx, y = sp.symbols(\"x y\")\n\nprint(sp.solve(x**2 - 5*x + 6, x))  # [2, 3]\n\nsol = sp.linsolve([x+y-5, 2*x-y-1], x, y)\nprint(sol)  # {(2, 3)}"
      },
      {
        "title": "Matrices & LaTeX",
        "description": "Exact linear algebra",
        "language": "python",
        "code": "import sympy as sp\n\nA = sp.Matrix([[1,2],[3,4]])\nprint(A.inv())\nprint(A.det())   # -2\nprint(A.eigenvals())\n\nexpr = sp.integrate(sp.exp(-x**2), x)\nprint(sp.latex(expr))"
      }
    ],
    "useCases": [
      {
        "title": "Formula Derivation",
        "description": "Verify hand derivations automatically."
      },
      {
        "title": "Physics & Engineering",
        "description": "Solve kinematics and circuit ODEs symbolically."
      },
      {
        "title": "Math Education",
        "description": "Generate step-by-step algebra and calculus examples."
      }
    ],
    "bestPractices": [
      "Declare symbol assumptions (real/positive) for stronger simplification",
      "Use .subs() for numeric evaluation at the end",
      "Prefer exact rationals where precision matters"
    ],
    "commonErrors": [
      {
        "error": "Infinite recursion in simplify",
        "fix": "Try targeted transforms (expand, factor) instead."
      },
      {
        "error": "AttributeError: not sympy object",
        "fix": "Wrap floats with sp.symbols or sp.Rational."
      }
    ]
  },
  {
    "id": "bokeh",
    "name": "Bokeh",
    "icon": "📈",
    "category": "data",
    "difficulty": "intermediate",
    "description": "Interactive browser visualizations with glyphs, widgets, and server apps",
    "tags": [
      "Bokeh",
      "Interactive",
      "Dashboards",
      "JavaScript"
    ],
    "prerequisites": [
      "Matplotlib basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Bokeh for Interactive Visualization"
      },
      {
        "type": "paragraph",
        "text": "Bokeh creates interactive plots rendered in the browser via HTML/JS. Charts support zooming, panning, hovering, linked brushing, and live widgets without writing JavaScript. It targets dashboards and data apps where users explore data themselves."
      },
      {
        "type": "list",
        "items": [
          "Glyphs: circles, lines, bars on figure objects",
          "DataSource: ColumnDataSource shared between glyphs",
          "Tools: hover, zoom, pan, box_select",
          "Widgets: sliders, dropdowns, buttons with Python callbacks",
          "Server mode: Python/JS state in sync for live apps"
        ]
      }
    ],
    "concepts": [
      {
        "name": "Figure",
        "description": "Plot canvas with glyphs and tools."
      },
      {
        "name": "Glyph",
        "description": "Visual marks drawn from data."
      },
      {
        "name": "ColumnDataSource",
        "description": "Shared data table powering interactions."
      },
      {
        "name": "Hover Tool",
        "description": "Tooltips at cursor position."
      },
      {
        "name": "Layout",
        "description": "gridplot, row, column for composition."
      }
    ],
    "codeExamples": [
      {
        "title": "Interactive Scatter",
        "description": "Scatter with hover tooltips",
        "language": "python",
        "code": "from bokeh.plotting import figure, show\nfrom bokeh.models import HoverTool, ColumnDataSource\n\nsource = ColumnDataSource(data=dict(\n    x=[1,2,3,4,5], y=[6,7,2,4,5],\n    label=[\"A\",\"B\",\"C\",\"D\",\"E\"]))\n\np = figure(tools=\"pan,wheel_zoom,reset\")\np.circle(\"x\",\"y\", size=18, source=source, fill_color=\"navy\", alpha=0.8)\np.add_tools(HoverTool(tooltips=[(\"label\",\"@label\"),(\"x\",\"@x\"),(\"y\",\"@y\")]))\nshow(p)"
      },
      {
        "title": "Bar Charts",
        "description": "Categorical data",
        "language": "python",
        "code": "from bokeh.plotting import figure, show\nfrom bokeh.transform import factor_cmap\nfrom bokeh.palettes import Category10\n\ncats = [\"Q1\",\"Q2\",\"Q3\",\"Q4\"]\nsrc = dict(categories=cats, amounts=[10,25,33,48])\np = figure(x_range=cats, height=350, title=\"Revenue\")\np.vbar(x=\"categories\", top=\"amounts\", width=0.6, source=src,\n       fill_color=factor_cmap(\"categories\",palette=Category10[4],factors=cats))\nshow(p)"
      },
      {
        "title": "Interactive Widgets & Server",
        "description": "Live data apps",
        "language": "python",
        "code": "from bokeh.plotting import figure, show\nfrom bokeh.models import Slider, ColumnDataSource\nfrom bokeh.layouts import row\nfrom bokeh.io import curdoc\nimport numpy as np\n\n# Create initial plot\nx = np.linspace(0, 4*np.pi, 200)\nsource = ColumnDataSource(data=dict(x=x, y=np.sin(x)))\n\np = figure(height=350, width=700, title=\"Sine Wave\")\np.line('x', 'y', source=source, line_width=2)\n\n# Note: For interactive widgets, use Bokeh server:\n# bokeh serve --show app.py\n# from bokeh.models import CustomJS\n# slider = Slider(start=0.1, end=5.0, value=1.0, step=0.1)\n# callback = CustomJS(args=dict(source=source, slider=slider), \"\"\"\n#     const data = source.data;\n#     const freq = slider.value;\n#     for (let i = 0; i < data['x'].length; i++) {\n#         data['y'][i] = Math.sin(freq * data['x'][i]);\n#     }\n#     source.change.emit();\n# \"\"\")\n# slider.js_on_change('value', callback)\nshow(p)"
      },
      {
        "title": "Data Tables & Linked Selections",
        "description": "Interactive data exploration",
        "language": "python",
        "code": "from bokeh.plotting import figure, show\nfrom bokeh.models import ColumnDataSource\nfrom bokeh.transform import factor_cmap\nfrom bokeh.palettes import Spectral6\nfrom bokeh.layouts import column\n\n# Sales data\nproducts = ['Widget', 'Gadget', 'Doohickey', 'Thingamajig', 'Whatchamacallit']\nquartals = ['Q1', 'Q2', 'Q3', 'Q4']\ndata = dict(\n    product=products,\n    sales=[120, 200, 150, 180, 90],\n    cost=[80, 120, 100, 110, 60]\n)\nsource = ColumnDataSource(data=data)\n\n# Bar chart with profit coloring\np = figure(x_range=products, height=350, title='Product Sales')\np.vbar(x='product', top='sales', width=0.5, source=source,\n       fill_color=factor_cmap('product', palette=Spectral6, factors=products))\np.vbar(x='product', top='cost', width=0.3, source=source, alpha=0.6)\np.y_range.start = 0\np.xgrid.grid_line_color = None\nshow(p)"
      }
    ],
    "useCases": [
      {
        "title": "Analytics Dashboards",
        "description": "Self-hosted dashboards with linked filters."
      },
      {
        "title": "Exploratory Apps",
        "description": "Adjust controls and see updated plots immediately."
      },
      {
        "title": "Live Monitoring",
        "description": "Streams update charts for server health."
      }
    ],
    "bestPractices": [
      "Use ColumnDataSource everywhere for uniformity",
      "Keep tooltip fields to a handful",
      "Use gridplot for aligned axes",
      "Cap data with CDSView for large datasets"
    ],
    "commonErrors": [
      {
        "error": "Blank plot (BokehJS not loaded)",
        "fix": "Include generated script+div correctly; run output_notebook() for Jupyter."
      },
      {
        "error": "Widgets not updating",
        "fix": "Widget callbacks only run with bokeh serve, not static embed."
      }
    ]
  },
  {
    "id": "biopython",
    "name": "BioPython",
    "icon": "🧬",
    "category": "data",
    "difficulty": "intermediate",
    "description": "Bioinformatics: sequences, FASTA/GenBank parsing, BLAST, and phylogenetics",
    "tags": [
      "Bioinformatics",
      "DNA",
      "Sequences"
    ],
    "prerequisites": [
      "Python basics",
      "Basic biology"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Bioinformatics with Biopython"
      },
      {
        "type": "paragraph",
        "text": "Biopython is the standard Python toolkit for computational biology. It provides SeqRecord/Seq objects, parsers for FASTA/GenBank/PDB, NCBI BLAST and Entrez interfaces, alignment tools, and phylogenetic tree handling. Researchers use it for genomics, transcriptomics, and protein annotation."
      }
    ],
    "concepts": [
      {
        "name": "Seq",
        "description": "Biological string with complement, reverse_complement methods."
      },
      {
        "name": "SeqRecord",
        "description": "Sequence plus metadata and annotations."
      },
      {
        "name": "SeqIO",
        "description": "Format-agnostic reader/writer for ~20 formats."
      },
      {
        "name": "NCBI Entrez",
        "description": "REST interface for NCBI searches and record fetching."
      },
      {
        "name": "Phylogeny",
        "description": "Read and manipulate evolutionary trees."
      }
    ],
    "codeExamples": [
      {
        "title": "DNA Operations",
        "description": "Sequence manipulation",
        "language": "python",
        "code": "from Bio.Seq import Seq\n\ndna = Seq(\"ATGCTAGATCGTACG\")\nprint(dna.complement())       # TACGATCTAGCATGC\nprint(dna.reverse_complement())  # CGTACGATCTAGCAT\nprint(dna.transcribe())       # AUGCUAGAUGCAUG\nprint(dna.translate())        # MLDSTY"
      },
      {
        "title": "Parse FASTA",
        "description": "Read sequences",
        "language": "python",
        "code": "from Bio import SeqIO\n\ndef gc_content(seq):\n    g, c = seq.count(\"G\"), seq.count(\"C\")\n    return (g+c) / len(seq) * 100\n\nfor record in SeqIO.parse(\"seqs.fasta\", \"fasta\"):\n    print(f\"{record.id}: {len(record.seq)}bp GC={gc_content(record.seq):.1f}%\")"
      },
      {
        "title": "BLAST Search",
        "description": "Remote homology search",
        "language": "python",
        "code": "from Bio.Blast import NCBIWWW, NCBIXML\n\nresult = NCBIWWW.qblast(\"blastn\", \"nt\", \"ATGCTAGATCGTACG\")\nrecords = NCBIXML.parse(result)\nfor rec in records:\n    for aln in rec.alignments[:3]:\n        print(aln.title, aln.hsps[0].expect)"
      },
      {
        "title": "Sequence Alignment",
        "description": "Pairwise and multiple alignment",
        "language": "python",
        "code": "from Bio import pairwise2\nfrom Bio.Seq import Seq\nfrom Bio.pairwise2 import format_alignment\n\n# Pairwise alignment\nseq1 = Seq(\"ACGTACGT\")\nseq2 = Seq(\"ACGACGT\")\n\nalignments = pairwise2.align.globalxx(seq1, seq2)\nfor a in alignments:\n    print(format_alignment(*a))\n\n# Local alignment\nlocal_alignments = pairwise2.align.localms(\n    Seq(\"GGATCGAATCACGTACGT\"),\n    Seq(\"ACGTACGT\"),\n    2, -1, -0.5, -0.1  # match, mismatch, open_gap, extend_gap\n)\nprint(f\"\\nBest local score: {local_alignments[0][2]}\")"
      }
    ],
    "useCases": [
      {
        "title": "Genome QC",
        "description": "Parse FASTQ to compute N50 and GC content."
      },
      {
        "title": "Variant Calling",
        "description": "Filter annotated VCF for candidate mutations."
      },
      {
        "title": "Protein Annotation",
        "description": "BLAST against databases for function assignment."
      },
      {
        "title": "Phylogenetics",
        "description": "Build gene trees to study evolution."
      }
    ],
    "bestPractices": [
      "Use streaming SeqIO.parse for huge files",
      "Cache NCBI queries to disk",
      "Normalize sequence case before comparing",
      "Validate alphabet against expectations"
    ],
    "commonErrors": [
      {
        "error": "IncorrectAlphabetError",
        "fix": "Characters don't match declared alphabet; use IUPAC.ambiguous_dna."
      },
      {
        "error": "Network fetch timeouts",
        "fix": "Add retries, respect NCBI limits, include email parameter."
      }
    ]
  },
  {
    "id": "python-mongodb",
    "name": "Python MongoDB",
    "icon": "🍃",
    "category": "data",
    "difficulty": "beginner",
    "description": "PyMongo: CRUD, aggregation, indexing, and GridFS with MongoDB",
    "tags": [
      "MongoDB",
      "PyMongo",
      "NoSQL",
      "Database"
    ],
    "prerequisites": [
      "Python basics",
      "Basic DB concepts"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "MongoDB and PyMongo"
      },
      {
        "type": "paragraph",
        "text": "MongoDB stores JSON-like BSON documents in collections. PyMongo is the official Python driver supporting CRUD, aggregation pipelines, indexes, transactions, and GridFS for large files. Documents map naturally to Python dicts."
      }
    ],
    "concepts": [
      {
        "name": "Collection",
        "description": "Group of documents (analogous to SQL table)."
      },
      {
        "name": "BSON",
        "description": "Binary JSON with ObjectId, datetime, Decimal128."
      },
      {
        "name": "Query Operators",
        "description": "$gt, $in, $regex, $elemMatch for flexible filters."
      },
      {
        "name": "Aggregation Pipeline",
        "description": "Chained stages for analytics."
      },
      {
        "name": "Indexes",
        "description": "Speed up queries; unique indexes enforce constraints."
      },
      {
        "name": "GridFS",
        "description": "File storage splitting large objects across chunks."
      }
    ],
    "codeExamples": [
      {
        "title": "Connect & Insert",
        "description": "Basic writes",
        "language": "python",
        "code": "from pymongo import MongoClient\n\nclient = MongoClient(\"mongodb://localhost:27017/\")\ndb = client[\"shop\"]\nproducts = db[\"products\"]\n\nproducts.insert_one({\"name\":\"Mouse\",\"price\":29.99,\"stock\":150})\nproducts.insert_many([{\"name\":\"Keyboard\",\"price\":49.99},{\"name\":\"Monitor\",\"price\":199.99}])"
      },
      {
        "title": "Querying",
        "description": "Finding documents",
        "language": "python",
        "code": "mice = products.find_one({\"name\":\"Mouse\"})\ncheap = products.find({\"price\":{\"$lt\":100}})\nfor p in cheap: print(p[\"name\"], p[\"price\"])\n\nnames = products.find({},{\"name\":1,\"_id\":0})\nprint([d[\"name\"] for d in names])"
      },
      {
        "title": "Updates & Aggregation",
        "description": "Modify and analyze",
        "language": "python",
        "code": "products.update_one({\"name\":\"Mouse\"},{\"$set\":{\"price\":24.99},\"$inc\":{\"stock\":-5}})\n\npipeline = [\n    {\"$match\":{\"status\":\"completed\"}},\n    {\"$group\":{\"_id\":\"$category\",\"total\":{\"$sum\":\"$amount\"},\"count\":{\"$sum\":1}}},\n    {\"$sort\":{\"total\":-1}}\n]\nfor row in db.sales.aggregate(pipeline): print(row)"
      },
      {
        "title": "Change Streams & Transactions",
        "description": "Real-time data and ACID operations",
        "language": "python",
        "code": "from pymongo import MongoClient\nfrom pymongo.errors import OperationFailure\n\nclient = MongoClient(\"mongodb://localhost:27017/\")\ndb = client[\"shop\"]\n\n# Transaction: transfer money between accounts\ntry:\n    with client.start_session() as session:\n        with session.start_transaction():\n            db.accounts.update_one(\n                {\"user\": \"alice\"},\n                {\"$inc\": {\"balance\": -100}},\n                session=session\n            )\n            db.accounts.update_one(\n                {\"user\": \"bob\"},\n                {\"$inc\": {\"balance\": 100}},\n                session=session\n            )\n    print(\"Transaction completed\")\nexcept OperationFailure as e:\n    print(f\"Transaction aborted: {e}\")\n\n# Aggregation pipeline: sales analytics\npipeline = [\n    {\"$match\": {\"status\": \"completed\"}},\n    {\"$group\": {\n        \"_id\": \"$category\",\n        \"total_revenue\": {\"$sum\": \"$amount\"},\n        \"avg_order\": {\"$avg\": \"$amount\"},\n        \"order_count\": {\"$sum\": 1}\n    }},\n    {\"$sort\": {\"total_revenue\": -1}},\n    {\"$limit\": 5}\n]\n\nfor doc in db.orders.aggregate(pipeline):\n    print(f\"{doc['_id']}: ${doc['total_revenue']:.0f} ({doc['order_count']} orders)\")"
      }
    ],
    "useCases": [
      {
        "title": "Content Management",
        "description": "Store heterogeneous CMS structures."
      },
      {
        "title": "Real-time Analytics",
        "description": "Aggregation dashboards over event streams."
      },
      {
        "title": "IoT Storage",
        "description": "Time-stamped sensor documents."
      }
    ],
    "bestPractices": [
      "Create indexes on queried fields",
      "Use projections to limit fields",
      "Enable SSL in production",
      "Never hardcode credentials"
    ],
    "commonErrors": [
      {
        "error": "ServerSelectionTimeoutError",
        "fix": "Check host/port and connection string."
      },
      {
        "error": "KeyError accessing field",
        "fix": "Use .get(\"field\", default) or check document schema."
      }
    ]
  },
  {
    "id": "python-mysql",
    "name": "Python MySQL",
    "icon": "🐬",
    "category": "data",
    "difficulty": "beginner",
    "description": "MySQL connector: CRUD with parameterized queries and transactions",
    "tags": [
      "MySQL",
      "SQL",
      "Database"
    ],
    "prerequisites": [
      "Python basics",
      "Basic SQL"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Python + MySQL"
      },
      {
        "type": "paragraph",
        "text": "Python connects to MySQL via mysql-connector-python. Use parameterized queries (%s placeholders) to prevent injection. The workflow: connect, cursor, execute, commit/rollback, close."
      },
      {
        "type": "heading",
        "text": "Connection Pooling"
      },
      {
        "type": "list",
        "items": [
          "MySQLConnectionPool reuses connections",
          "Use context managers for auto-close",
          "parameterized queries for safety"
        ]
      }
    ],
    "concepts": [
      {
        "name": "Connection",
        "description": "Network session to MySQL server."
      },
      {
        "name": "Cursor",
        "description": "Executes statements, fetches results."
      },
      {
        "name": "Parameterized Queries",
        "description": "%s placeholders + tuple args, safe and fast."
      },
      {
        "name": "Transactions",
        "description": "commit() persists; rollback() discards."
      },
      {
        "name": "lastrowid",
        "description": "Retrieves auto-generated IDs after INSERT."
      },
      {
        "name": "Pooling",
        "description": "Reuses connections for performance."
      }
    ],
    "codeExamples": [
      {
        "title": "Connect and CREATE TABLE",
        "description": "Setup",
        "language": "python",
        "code": "import mysql.connector\n\nconn = mysql.connector.connect(host=\"localhost\",user=\"root\",password=\"pwd\",database=\"shop\")\ncur = conn.cursor()\ncur.execute(\"\"\"CREATE TABLE IF NOT EXISTS customers (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100), email VARCHAR(200) UNIQUE)\"\"\")\nconn.commit()\ncur.close(); conn.close()"
      },
      {
        "title": "Insert and Query",
        "description": "Parameterized operations",
        "language": "python",
        "code": "cur = conn.cursor(dictionary=True)\ncur.execute(\"INSERT INTO customers (name,email) VALUES (%s,%s)\", (\"Alice\",\"alice@example.com\"))\nconn.commit()\nprint(f\"ID: {cur.lastrowid}\")\n\ncur.execute(\"SELECT id,name,email FROM customers WHERE email=%s\", (\"alice@example.com\",))\nprint(cur.fetchone())"
      },
      {
        "title": "Transactions",
        "description": "Atomic multi-step writes",
        "language": "python",
        "code": "try:\n    conn.start_transaction()\n    cur.execute(\"UPDATE customers SET name=%s WHERE id=%s\",(\"A.\",1))\n    cur.execute(\"DELETE FROM customers WHERE id=%s\",(3,))\n    conn.commit()\nexcept Exception:\n    conn.rollback()"
      },
      {
        "title": "Prepared Statements & Connection Pooling",
        "description": "Performance and security patterns",
        "language": "python",
        "code": "import mysql.connector\nfrom mysql.connector import pooling\n\n# Connection pool: reuse connections\npool = pooling.MySQLConnectionPool(\n    pool_name=\"mypool\",\n    pool_size=5,\n    host=\"localhost\",\n    user=\"root\",\n    password=\"password\",\n    database=\"shop\"\n)\n\n# Get connection from pool\nconn = pool.get_connection()\ncursor = conn.cursor(dictionary=True)\n\n# Parameterized query (SQL injection safe)\nproduct = \"Widget\"\ncursor.execute(\n    \"SELECT name, price FROM products WHERE name = %s\",\n    (product,)  # tuple, not string!\n)\nrow = cursor.fetchone()\nprint(row)\n\n# Bulk insert with executemany\norders = [\n    (\"Widget\", 29.99, \"alice\"),\n    (\"Gadget\", 49.99, \"bob\"),\n    (\"Doohickey\", 19.99, \"charlie\"),\n]\ncursor.executemany(\n    \"INSERT INTO orders (product, price, customer) VALUES (%s, %s, %s)\",\n    orders\n)\nconn.commit()\nprint(f\"Inserted {cursor.rowcount} rows\")\n\ncursor.close()\nconn.close()  # returns to pool, not actually closed"
      }
    ],
    "useCases": [
      {
        "title": "Web Backend",
        "description": "Django/Flask stores data in MySQL."
      },
      {
        "title": "Reporting",
        "description": "SQL aggregations feed dashboards."
      }
    ],
    "bestPractices": [
      "Always parameterize queries",
      "Use dictionary=True for readable access",
      "Commit explicitly after writes",
      "Close connections or use pools"
    ],
    "commonErrors": [
      {
        "error": "Table doesn't exist",
        "fix": "Run CREATE TABLE or check database name."
      },
      {
        "error": "Access denied",
        "fix": "Grant privileges with GRANT on the database."
      }
    ]
  },
  {
    "id": "python-postgresql",
    "name": "Python PostgreSQL",
    "icon": "🐘",
    "category": "data",
    "difficulty": "beginner",
    "description": "psycopg2, connection pooling, JSONB, and advanced PostgreSQL features",
    "tags": [
      "PostgreSQL",
      "psycopg2",
      "Database"
    ],
    "prerequisites": [
      "Python basics",
      "SQL basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PostgreSQL + psycopg2"
      },
      {
        "type": "paragraph",
        "text": "PostgreSQL is a full-featured ACID database with JSONB, PostGIS, and native arrays. psycopg2 is the canonical driver providing connection management, transactions, and COPY for bulk loading."
      },
      {
        "type": "heading",
        "text": "Key Features"
      },
      {
        "type": "list",
        "items": [
          "JSONB with GIN indexes for fast queries",
          "COPY for bulk loading",
          "CTEs and window functions for analytics",
          "Connection pooling with ThreadedConnectionPool"
        ]
      }
    ],
    "concepts": [
      {
        "name": "psycopg2.connect",
        "description": "Creates database session."
      },
      {
        "name": "JSONB",
        "description": "Binary JSON column with indexable queries."
      },
      {
        "name": "COPY",
        "description": "Fastest bulk load path."
      },
      {
        "name": "Pooling",
        "description": "ThreadedConnectionPool shares sessions."
      },
      {
        "name": "Transactions",
        "description": "with conn: commits on exit."
      }
    ],
    "codeExamples": [
      {
        "title": "Connect and JSONB",
        "description": "Working with PostgreSQL features",
        "language": "python",
        "code": "import psycopg2\nfrom psycopg2.extras import RealDictCursor\n\nconn = psycopg2.connect(dbname=\"shop\",user=\"app\",password=\"secret\",host=\"localhost\",cursor_factory=RealDictCursor)\ncur = conn.cursor()\ncur.execute(\"\"\"CREATE TABLE IF NOT EXISTS products (\n    id SERIAL PRIMARY KEY, name TEXT, price NUMERIC(10,2),\n    meta JSONB DEFAULT '{}'::jsonb, tags TEXT[])\"\"\")\ncur.execute(\"INSERT INTO products (name,price,meta) VALUES (%s,%s,%s)\",\n    (\"Mouse\",29.99,'{\"brand\":\"Logi\"}'))\nconn.commit()"
      },
      {
        "title": "JSONB Queries",
        "description": "Querying JSONB",
        "language": "python",
        "code": "cur.execute(\"\"\"SELECT name, meta->>'brand' AS brand\n    FROM products WHERE meta @> '{\"wireless\":true}'\"\"\")\nfor row in cur.fetchall(): print(row[\"name\"], row[\"brand\"])"
      },
      {
        "title": "Bulk COPY",
        "description": "High-throughput insert",
        "language": "python",
        "code": "from io import StringIO\nbuf = StringIO()\nfor i in range(1000): buf.write(f\"product_{i}\\t{10+i*0.5}\\n\")\nbuf.seek(0)\ncur.copy_from(buf, \"products\", columns=(\"name\",\"price\"), sep=\"\\t\")\nconn.commit()"
      },
      {
        "title": "JSONB Queries & CTEs",
        "description": "Advanced PostgreSQL features",
        "language": "python",
        "code": "import psycopg2\nfrom psycopg2.extras import RealDictCursor\n\nconn = psycopg2.connect(\"dbname=shop user=postgres\")\ncur = conn.cursor(cursor_factory=RealDictCursor)\n\n# JSONB queries\ncur.execute(\"\"\"\n    SELECT name, metadata->>'color' as color,\n           metadata->>'size' as size,\n           (metadata->>'price')::numeric as price\n    FROM products\n    WHERE metadata @> '{\"color\": \"red\"}'::jsonb\n\"\"\")\n\nfor row in cur.fetchall():\n    print(f\"{row['name']}: {row['color']} ${row['price']}\")\n\n# CTE: recursive category tree\ncur.execute(\"\"\"\n    WITH RECURSIVE category_tree AS (\n        SELECT id, name, parent_id, 0 as depth\n        FROM categories WHERE parent_id IS NULL\n        UNION ALL\n        SELECT c.id, c.name, c.parent_id, ct.depth + 1\n        FROM categories c\n        JOIN category_tree ct ON c.parent_id = ct.id\n    )\n    SELECT repeat('  ', depth) || name as tree_name\n    FROM category_tree ORDER BY tree_name\n\"\"\")\n\nfor row in cur.fetchall():\n    print(row['tree_name'])\n\ncur.close()\nconn.close()"
      }
    ],
    "useCases": [
      {
        "title": "Enterprise OLTP",
        "description": "ACID-guaranteed transaction systems."
      },
      {
        "title": "Geospatial",
        "description": "PostGIS powers location queries."
      },
      {
        "title": "Full-Text Search",
        "description": "tsvector gives high-performance search."
      }
    ],
    "bestPractices": [
      "Use RealDictCursor for readable access",
      "Reuse connections via pools",
      "Commit after batches, not every insert",
      "Store credentials in env vars"
    ],
    "commonErrors": [
      {
        "error": "Connection refused",
        "fix": "Check pg_isready and service status."
      },
      {
        "error": "UndefinedTable",
        "fix": "Check schema/search_path; table in wrong database."
      }
    ]
  },
  {
    "id": "python-sqlite",
    "name": "Python SQLite",
    "icon": "💾",
    "category": "data",
    "difficulty": "beginner",
    "description": "Serverless embedded database using Python's built-in sqlite3",
    "tags": [
      "SQLite",
      "SQL",
      "Embedded DB"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "SQLite the Embedded Database"
      },
      {
        "type": "paragraph",
        "text": "SQLite is a serverless SQL database stored in a single file. Python ships with sqlite3 in the standard library. Use WAL journal mode for concurrency, create indexes, and always parameterize queries."
      }
    ],
    "concepts": [
      {
        "name": "Connection",
        "description": "sqlite3.connect('file.db')."
      },
      {
        "name": "Row Factory",
        "description": "sqlite3.Row gives attribute-style access."
      },
      {
        "name": "PRAGMAs",
        "description": "journal_mode=WAL, foreign_keys=ON."
      },
      {
        "name": "Context Manager",
        "description": "with conn: auto-commits."
      }
    ],
    "codeExamples": [
      {
        "title": "Create and Query",
        "description": "Basic operations",
        "language": "python",
        "code": "import sqlite3\n\nconn = sqlite3.connect(\"app.db\")\nconn.row_factory = sqlite3.Row\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)\")\ncur.execute(\"INSERT INTO users (name,email) VALUES (?,?)\", (\"Sam\",\"sam@example.com\"))\nconn.commit()\nrow = cur.execute(\"SELECT * FROM users WHERE email=?\",(\"sam@example.com\",)).fetchone()\nprint(row[\"name\"], row[\"email\"])\nconn.close()"
      },
      {
        "title": "WAL and Indexes",
        "description": "Performance tuning",
        "language": "python",
        "code": "conn = sqlite3.connect(\"app.db\")\nconn.execute(\"PRAGMA journal_mode = WAL\")\nconn.execute(\"CREATE INDEX IF NOT EXISTS idx_email ON users(email)\")\nwith conn:\n    conn.execute(\"INSERT INTO users (name,email) VALUES (?,?)\",(\"B\",\"b@example.com\"))\nconn.close()"
      },
      {
        "title": "Row Factory & In-Memory DB",
        "description": "Advanced SQLite patterns",
        "language": "python",
        "code": "import sqlite3\nfrom dataclasses import dataclass\n\n# In-memory database for testing\nconn = sqlite3.connect(\":memory:\")\nconn.row_factory = sqlite3.Row  # dict-like access\n\n# Create table\nconn.execute(\"\"\"\n    CREATE TABLE users (\n        id INTEGER PRIMARY KEY,\n        name TEXT NOT NULL,\n        email TEXT UNIQUE,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n    )\n\"\"\")\n\n# Insert with parameterized query\nconn.execute(\n    \"INSERT INTO users (name, email) VALUES (?, ?)\",\n    (\"Alice\", \"alice@example.com\")\n)\nconn.executemany(\n    \"INSERT INTO users (name, email) VALUES (?, ?)\",\n    [(\"Bob\", \"bob@example.com\"), (\"Charlie\", \"charlie@example.com\")]\n)\nconn.commit()\n\n# Query with Row factory\nfor row in conn.execute(\"SELECT * FROM users WHERE name LIKE ?\", (\"%A%\",)):\n    print(f\"  {row['name']}: {row['email']}\")\n\n# Window function\nconn.execute(\"\"\"\n    SELECT name,\n           ROW_NUMBER() OVER (ORDER BY created_at) as rn\n    FROM users\n\"\"\")\n\nconn.close()"
      }
    ],
    "useCases": [
      {
        "title": "Client Storage",
        "description": "Desktop apps persist local data."
      },
      {
        "title": "Prototyping",
        "description": "Zero-install relational store."
      },
      {
        "title": "Testing",
        "description": "In-memory databases for fast tests."
      }
    ],
    "bestPractices": [
      "Enable WAL for concurrency",
      "Use ? parameters",
      "Close connections quickly",
      "Set foreign_keys per connection"
    ],
    "commonErrors": [
      {
        "error": "Database is locked",
        "fix": "Enable WAL, shorten transactions, or add busy timeout."
      },
      {
        "error": "Not all arguments converted",
        "fix": "Match parameter count to placeholders."
      }
    ]
  },
  {
    "id": "python-data-access",
    "name": "Python Data Access",
    "icon": "💾",
    "category": "data",
    "difficulty": "beginner",
    "description": "Databases, ORMs, CSV, JSON, and pickle for data access",
    "tags": [
      "Data Access",
      "ORM",
      "CSV"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Data Access Layers"
      },
      {
        "type": "paragraph",
        "text": "Python reads/writes data through file formats (CSV, JSON, pickle), database drivers (sqlite3, psycopg2), and ORMs (SQLAlchemy, Django ORM). Choose based on your needs: raw SQL for control, ORMs for convenience."
      }
    ],
    "concepts": [
      {
        "name": "CSV Module",
        "description": "Reading/writing tabular text."
      },
      {
        "name": "JSON",
        "description": "Interchange format for structured data."
      },
      {
        "name": "Pickle",
        "description": "Serializes arbitrary Python objects."
      },
      {
        "name": "SQLAlchemy",
        "description": "Full-featured SQL toolkit + ORM."
      },
      {
        "name": "Context Managers",
        "description": "with blocks guarantee resource cleanup."
      }
    ],
    "codeExamples": [
      {
        "title": "CSV and JSON",
        "description": "File format operations",
        "language": "python",
        "code": "import csv, json\n\n# CSV\nwith open(\"data.csv\",\"w\",newline=\"\") as f:\n    writer = csv.writer(f)\n    writer.writerows([[\"name\",\"score\"],[\"Alice\",95],[\"Bob\",87]])\n\nwith open(\"data.csv\") as f:\n    for row in csv.DictReader(f): print(row)\n\n# JSON\nwith open(\"config.json\",\"w\") as f:\n    json.dump({\"theme\":\"dark\",\"port\":8000}, f, indent=2)"
      },
      {
        "title": "SQLAlchemy ORM",
        "description": "Declarative models",
        "language": "python",
        "code": "from sqlalchemy import create_engine, Column, Integer, String\nfrom sqlalchemy.orm import declarative_base, sessionmaker\n\nBase = declarative_base()\nclass User(Base):\n    __tablename__ = \"users\"\n    id = Column(Integer, primary_key=True)\n    name = Column(String)\n\nengine = create_engine(\"sqlite:///app.db\")\nBase.metadata.create_all(engine)\nSession = sessionmaker(bind=engine)\ns = Session()\ns.add(User(name=\"Alice\"))\ns.commit()\nprint(s.query(User).all()[0].name)"
      }
    ],
    "useCases": [
      {
        "title": "ETL Pipelines",
        "description": "Read CSVs, clean with pandas, write via SQLAlchemy."
      },
      {
        "title": "Config Management",
        "description": "JSON/YAML configs committed to repos."
      }
    ],
    "bestPractices": [
      "Prefer JSON/CSV for cross-language data",
      "Use with-blocks and generators for large data",
      "Never construct SQL by string concatenation"
    ],
    "commonErrors": [
      {
        "error": "UnicodeDecodeError",
        "fix": "Specify encoding: open(f, encoding='utf-8')."
      },
      {
        "error": "DetachedInstanceError",
        "fix": "Access attributes within session scope or refresh."
      }
    ]
  },
  {
    "id": "python-data-persistence",
    "name": "Python Data Persistence",
    "icon": "🗄️",
    "category": "data",
    "difficulty": "beginner",
    "description": "Pickle, shelve, JSON, YAML, and HDF5 for durable data",
    "tags": [
      "Persistence",
      "Pickle",
      "Serialization"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Persistence Formats"
      },
      {
        "type": "paragraph",
        "text": "Pickle stores arbitrary objects; shelve adds a dict interface; JSON/YAML are human-readable and cross-language; HDF5 stores numeric arrays efficiently. Pick the format by your consumers."
      }
    ],
    "concepts": [
      {
        "name": "Pickle",
        "description": "Python-native, fast, insecure for untrusted data."
      },
      {
        "name": "Shelve",
        "description": "Persistent dict with pickle storage."
      },
      {
        "name": "JSON",
        "description": "Portable text; only basic types."
      },
      {
        "name": "YAML",
        "description": "Readable config with comments (PyYAML)."
      },
      {
        "name": "HDF5",
        "description": "Binary container for arrays with metadata."
      }
    ],
    "codeExamples": [
      {
        "title": "Pickle and Shelve",
        "description": "Object persistence",
        "language": "python",
        "code": "import pickle, shelve\n\ndata = {\"user\":\"Alice\",\"scores\":[1,2,3]}\nwith open(\"state.pkl\",\"wb\") as f: pickle.dump(data, f)\nwith open(\"state.pkl\",\"rb\") as f: loaded = pickle.load(f)\n\nwith shelve.open(\"cache.db\") as db:\n    db[\"users\"] = [data]\n    print(db[\"users\"])"
      },
      {
        "title": "JSON with Defaults",
        "description": "Custom serialization",
        "language": "python",
        "code": "import json\nfrom datetime import datetime\n\ndef default(obj):\n    if isinstance(obj, datetime): return obj.isoformat()\n    raise TypeError(f\"Not serializable: {obj}\")\n\njson.dump({\"created\": datetime.now()}, open(\"r.json\",\"w\"), default=default)"
      },
      {
        "title": "YAML Config",
        "description": "Human-readable settings",
        "language": "python",
        "code": "import yaml\n\nconfig = {\"server\":{\"host\":\"0.0.0.0\",\"port\":8000}}\nwith open(\"config.yaml\",\"w\") as f: yaml.safe_dump(config, f)\nwith open(\"config.yaml\") as f: loaded = yaml.safe_load(f)\nprint(loaded[\"server\"][\"port\"])"
      },
      {
        "title": "HDF5",
        "description": "Numeric data at scale",
        "language": "python",
        "code": "import h5py, numpy as np\n\nwith h5py.File(\"data.h5\",\"w\") as f:\n    ds = f.create_dataset(\"temp\", data=np.random.rand(1000,10), compression=\"gzip\")\n    ds.attrs[\"units\"] = \"celsius\"\n\nwith h5py.File(\"data.h5\",\"r\") as f:\n    print(f[\"temp\"].shape, f[\"temp\"].attrs[\"units\"])"
      }
    ],
    "useCases": [
      {
        "title": "Session Cache",
        "description": "shelve/pickle store computed results."
      },
      {
        "title": "Config Files",
        "description": "YAML/JSON committed to repos."
      },
      {
        "title": "Scientific Storage",
        "description": "HDF5 stores large experiment arrays."
      }
    ],
    "bestPractices": [
      "Never unpickle untrusted data",
      "Add schema version keys",
      "Store times as UTC ISO8601",
      "Test round-trips in CI"
    ],
    "commonErrors": [
      {
        "error": "datetime not JSON serializable",
        "fix": "Convert with default function (see example)."
      },
      {
        "error": "Pickle pickling error",
        "fix": "Lambdas can't pickle, store by reference."
      }
    ]
  },
  {
    "id": "python-pillow",
    "name": "Python Pillow",
    "icon": "🖼️",
    "category": "data",
    "difficulty": "beginner",
    "description": "Image processing: open, resize, crop, filter, draw, convert",
    "tags": [
      "Pillow",
      "Images",
      "Image Processing"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Pillow Image Processing"
      },
      {
        "type": "paragraph",
        "text": "Pillow (PIL fork) loads images in a dozen formats, supports cropping, resizing, rotating, filtering, drawing, and format conversion. Modes: RGB, RGBA, L (grayscale), P (palette), CMYK."
      }
    ],
    "concepts": [
      {
        "name": "Image.open()",
        "description": "Loads lazily; call convert() to force read."
      },
      {
        "name": "Modes",
        "description": "Color layout: L, RGB, RGBA, CMYK."
      },
      {
        "name": "thumbnail()",
        "description": "Maintains aspect ratio while resizing."
      },
      {
        "name": "ImageFilter",
        "description": "GaussianBlur, SHARPEN, FIND_EDGES."
      },
      {
        "name": "ImageDraw",
        "description": "Draw text, shapes, overlays."
      }
    ],
    "codeExamples": [
      {
        "title": "Open and Transform",
        "description": "Basic image ops",
        "language": "python",
        "code": "from PIL import Image, ImageFilter\n\nim = Image.open(\"photo.jpg\")\nim.thumbnail((300, 300))\nim.save(\"thumb.jpg\", quality=85)\n\ncrop = im.crop((50, 50, 250, 250))\ncrop.save(\"crop.png\")\n\ngray = im.convert(\"L\")\ngray.save(\"gray.png\")"
      },
      {
        "title": "Filters",
        "description": "Apply effects",
        "language": "python",
        "code": "from PIL import ImageFilter\n\nblurred = im.filter(ImageFilter.GaussianBlur(radius=5))\nedges = im.filter(ImageFilter.FIND_EDGES)\nblurred.save(\"blur.jpg\")"
      },
      {
        "title": "Draw Text and Shapes",
        "description": "Overlays",
        "language": "python",
        "code": "from PIL import Image, ImageDraw, ImageFont\n\nim = Image.new(\"RGB\", (400,300), \"white\")\ndraw = ImageDraw.Draw(im)\ndraw.rectangle([20,20,380,280], outline=\"black\", width=3)\ndraw.ellipse([80,60,200,180], fill=\"blue\")\ndraw.text((220,120), \"Hello!\", fill=\"black\")\nim.save(\"drawing.png\")"
      }
    ],
    "useCases": [
      {
        "title": "Thumbnails",
        "description": "User uploads become responsive thumbnails."
      },
      {
        "title": "Watermarking",
        "description": "Ownership marks on images."
      },
      {
        "title": "Batch Processing",
        "description": "Resize folder of images at once."
      }
    ],
    "bestPractices": [
      "Use thumbnail() for aspect-preserving downscale",
      "Specify format=JPEG and quality",
      "Open in try/finally for cleanup",
      "Call im.load() when source file should close"
    ],
    "commonErrors": [
      {
        "error": "DecompressionBombWarning",
        "fix": "Raise Image.MAX_IMAGE_PIXELS threshold deliberately."
      },
      {
        "error": "RGBA to JPEG",
        "fix": "Convert to RGB first, JPEG has no alpha."
      }
    ]
  },
  {
    "id": "python-deep-learning",
    "name": "Python Deep Learning",
    "icon": "🧠",
    "category": "ml",
    "difficulty": "advanced",
    "description": "Neural networks with Keras/TensorFlow: CNN, RNN, LSTM, transfer learning",
    "tags": [
      "Deep Learning",
      "Keras",
      "TensorFlow",
      "CNN"
    ],
    "prerequisites": [
      "Python",
      "NumPy",
      "ML basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Deep Learning Essentials"
      },
      {
        "type": "paragraph",
        "text": "Deep learning trains multi-layer neural networks via backpropagation. Keras provides high-level API: Dense, Conv2D, LSTM, Dropout, BatchNormalization. Common architectures: CNN for images, RNN/LSTM for sequences, Transformers for NLP."
      },
      {
        "type": "heading",
        "text": "Training Workflow"
      },
      {
        "type": "list",
        "items": [
          "Normalize inputs to range 0-1",
          "Define model architecture",
          "Pick optimizer (Adam) and loss",
          "Train with validation",
          "Use early stopping to prevent overfitting"
        ]
      }
    ],
    "concepts": [
      {
        "name": "Dense Layer",
        "description": "Fully-connected neurons with activations."
      },
      {
        "name": "Conv2D",
        "description": "Learnable spatial filters."
      },
      {
        "name": "Dropout",
        "description": "Randomly zeroes neurons during training."
      },
      {
        "name": "Loss and Optimizer",
        "description": "categorical_crossentropy + Adam."
      },
      {
        "name": "Transfer Learning",
        "description": "Fine-tune pretrained networks."
      },
      {
        "name": "Early Stopping",
        "description": "Stop when validation stops improving."
      }
    ],
    "codeExamples": [
      {
        "title": "Dense Classifier (MNIST)",
        "description": "First neural net",
        "language": "python",
        "code": "import tensorflow as tf\nfrom tensorflow import keras\n\n(x_train,y_train),(x_test,y_test) = keras.datasets.mnist.load_data()\nx_train = x_train.reshape(-1,784).astype(\"float32\")/255.0\nx_test = x_test.reshape(-1,784).astype(\"float32\")/255.0\n\nmodel = keras.Sequential([\n    keras.layers.Dense(128, activation=\"relu\"),\n    keras.layers.Dropout(0.3),\n    keras.layers.Dense(10, activation=\"softmax\")\n])\nmodel.compile(optimizer=\"adam\", loss=\"sparse_categorical_crossentropy\", metrics=[\"accuracy\"])\nmodel.fit(x_train, y_train, epochs=5, batch_size=128, validation_split=0.1)"
      },
      {
        "title": "CNN for Images",
        "description": "Convolutional network",
        "language": "python",
        "code": "(x_train,y_train),(x_test,y_test) = keras.datasets.cifar10.load_data()\nx_train = x_train.astype(\"float32\")/255.0\n\nmodel = keras.Sequential([\n    keras.Input(shape=(32,32,3)),\n    keras.layers.Conv2D(32,(3,3),activation=\"relu\",padding=\"same\"),\n    keras.layers.MaxPooling2D((2,2)),\n    keras.layers.Conv2D(64,(3,3),activation=\"relu\",padding=\"same\"),\n    keras.layers.MaxPooling2D((2,2)),\n    keras.layers.Flatten(),\n    keras.layers.Dense(128,activation=\"relu\"),\n    keras.layers.Dropout(0.5),\n    keras.layers.Dense(10,activation=\"softmax\")\n])\nmodel.compile(optimizer=\"adam\",loss=\"sparse_categorical_crossentropy\",metrics=[\"accuracy\"])"
      },
      {
        "title": "Transfer Learning",
        "description": "Reuse pretrained backbone",
        "language": "python",
        "code": "base = keras.applications.ResNet50V2(include_top=False,weights=\"imagenet\",input_shape=(96,96,3),pooling=\"avg\")\nbase.trainable = False\n\nmodel = keras.Sequential([base, keras.layers.Dense(256,activation=\"relu\"), keras.layers.Dense(5,activation=\"softmax\")])\nmodel.compile(optimizer=keras.optimizers.Adam(1e-3),loss=\"categorical_crossentropy\",metrics=[\"accuracy\"])"
      }
    ],
    "useCases": [
      {
        "title": "Image Classification",
        "description": "X-ray screening, defect detection."
      },
      {
        "title": "NLP",
        "description": "Sentiment, translation, chatbots."
      },
      {
        "title": "Time Series",
        "description": "LSTM for demand forecasting."
      },
      {
        "title": "Anomaly Detection",
        "description": "Autoencoder reconstruction errors."
      }
    ],
    "bestPractices": [
      "Normalize inputs",
      "Hold out truly separate test set",
      "Use dropout + early stopping",
      "Freeze pretrained layers first",
      "Start simple, add complexity later"
    ],
    "commonErrors": [
      {
        "error": "Shape mismatch",
        "fix": "Input shape must match first layer dimensions."
      },
      {
        "error": "GPU OOM",
        "fix": "Reduce batch size or enable memory growth."
      },
      {
        "error": "NaN loss",
        "fix": "Lower learning rate, add normalization."
      }
    ]
  },
  {
    "id": "ml-python",
    "name": "ML with Python",
    "icon": "🧠",
    "category": "ml",
    "difficulty": "intermediate",
    "description": "scikit-learn pipelines: preprocessing, models, cross-validation",
    "tags": [
      "scikit-learn",
      "ML",
      "Pipeline"
    ],
    "prerequisites": [
      "Python",
      "NumPy/pandas"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "ML Workflow"
      },
      {
        "type": "paragraph",
        "text": "Sound ML pipeline: load/clean, split, preprocess, train, tune, evaluate, deploy. scikit-learn provides fit/predict/transform interface with Pipelines preventing data leakage."
      }
    ],
    "concepts": [
      {
        "name": "Pipeline",
        "description": "Chains preprocessing + model, preventing leakage."
      },
      {
        "name": "Cross-Validation",
        "description": "K-fold evaluation for robustness."
      },
      {
        "name": "GridSearchCV",
        "description": "Hyperparameter tuning."
      },
      {
        "name": "Metrics",
        "description": "accuracy, F1, ROC-AUC, RMSE."
      }
    ],
    "codeExamples": [
      {
        "title": "Full Pipeline",
        "description": "End-to-end with leakage prevention",
        "language": "python",
        "code": "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.metrics import classification_report\n\nX,y = load_iris(return_X_y=True)\nXtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.2,stratify=y,random_state=42)\n\npipe = Pipeline([(\"scaler\",StandardScaler()),(\"svc\",SVC(kernel=\"rbf\"))])\npipe.fit(Xtr,ytr)\nprint(classification_report(yte,pipe.predict(Xte)))"
      },
      {
        "title": "Grid Search",
        "description": "Tuning hyperparameters",
        "language": "python",
        "code": "from sklearn.model_selection import GridSearchCV\nfrom sklearn.ensemble import RandomForestClassifier\n\nparam_grid = {\"n_estimators\":[50,100],\"max_depth\":[None,10,20]}\nsearch = GridSearchCV(RandomForestClassifier(random_state=0),param_grid,cv=5,scoring=\"accuracy\",n_jobs=-1)\nsearch.fit(Xtr,ytr)\nprint(search.best_params_, search.best_score_)"
      }
    ],
    "useCases": [
      {
        "title": "Churn Prediction",
        "description": "Classify customers likely to cancel."
      },
      {
        "title": "Fraud Detection",
        "description": "Evaluate with PR-AUC on imbalanced data."
      },
      {
        "title": "Demand Forecasting",
        "description": "Trained regressors improve planning."
      }
    ],
    "bestPractices": [
      "Put preprocessing INTO a Pipeline",
      "Stratify splits for imbalance",
      "Tune with cross-validation, never on test set",
      "Report business-relevant metrics"
    ],
    "commonErrors": [
      {
        "error": "Data leakage",
        "fix": "Use Pipeline and never fit on entire dataset first."
      },
      {
        "error": "Input contains NaN",
        "fix": "Impute before modeling with SimpleImputer."
      }
    ]
  },
  {
    "id": "logistic-regression",
    "name": "Logistic Regression",
    "icon": "📈",
    "category": "ml",
    "difficulty": "beginner",
    "description": "Binary and multiclass classification via sigmoid and gradient descent",
    "tags": [
      "Classification",
      "Stats",
      "ML"
    ],
    "prerequisites": [
      "Python",
      "Linear regression"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Logistic Regression"
      },
      {
        "type": "paragraph",
        "text": "Despite its name, logistic regression is a classification algorithm. It passes linear combinations through the sigmoid function to output probabilities. Simple, interpretable, and a strong baseline for many classification tasks."
      }
    ],
    "concepts": [
      {
        "name": "Sigmoid",
        "description": "Squashes real values into 0-1 range."
      },
      {
        "name": "Decision Boundary",
        "description": "Hyperplane at p=0.5."
      },
      {
        "name": "Cross-Entropy",
        "description": "Loss function for classification."
      },
      {
        "name": "Regularization",
        "description": "C controls penalty strength."
      }
    ],
    "codeExamples": [
      {
        "title": "Binary Classification",
        "description": "Train and evaluate",
        "language": "python",
        "code": "from sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.datasets import make_classification\nfrom sklearn.metrics import accuracy_score, confusion_matrix\n\nX,y = make_classification(n_samples=1000,n_features=5,n_informative=3,random_state=42)\nXtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.25)\n\nmodel = LogisticRegression(C=1.0)\nmodel.fit(Xtr,ytr)\nprint(f\"Accuracy: {accuracy_score(yte,model.predict(Xte)):.3f}\")\nprint(confusion_matrix(yte,model.predict(Xte)))"
      },
      {
        "title": "Probabilities and AUC",
        "description": "Custom thresholds and ROC",
        "language": "python",
        "code": "from sklearn.metrics import roc_auc_score\nprobs = model.predict_proba(Xte)[:,1]\nauc = roc_auc_score(yte, probs)\nprint(f\"AUC: {auc:.3f}\")\n\npred_hp = (probs >= 0.8).astype(int)\nprint(f\"Coverage: {pred_hp.mean():.1%}\")"
      }
    ],
    "useCases": [
      {
        "title": "Churn",
        "description": "Interpretable coefficients explain drivers."
      },
      {
        "title": "Credit Approval",
        "description": "Regulators need explainability."
      },
      {
        "title": "Spam Filtering",
        "description": "Fast baseline with TF-IDF."
      }
    ],
    "bestPractices": [
      "Scale features before fitting",
      "Check for multicollinearity",
      "Use class_weight=balanced for imbalance",
      "Report AUC and F1, not just accuracy"
    ],
    "commonErrors": [
      {
        "error": "ConvergenceWarning",
        "fix": "Increase max_iter, scale features, or reduce C."
      },
      {
        "error": "Poor accuracy on imbalance",
        "fix": "Switch to balanced weights and PR-AUC metrics."
      }
    ]
  },
  {
    "id": "ai-with-python",
    "name": "AI with Python",
    "icon": "🤖",
    "category": "ml",
    "difficulty": "intermediate",
    "description": "AI fundamentals: search, agents, neural nets, and reinforcement learning",
    "tags": [
      "AI",
      "Agents",
      "Search",
      "RL"
    ],
    "prerequisites": [
      "Python",
      "Probability basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "What is AI?"
      },
      {
        "type": "paragraph",
        "text": "AI builds systems that perceive, reason, learn, and act. Classical AI: search (A*), logic, minimax. Modern AI: statistical ML and deep learning. Python blends both: search for structured problems, learned models for perception/prediction."
      }
    ],
    "concepts": [
      {
        "name": "A* Search",
        "description": "Heuristic pathfinding."
      },
      {
        "name": "Minimax",
        "description": "Adversarial game tree search."
      },
      {
        "name": "Neural Network",
        "description": "Universal approximator."
      },
      {
        "name": "Reinforcement Learning",
        "description": "Learn policy from reward signals."
      }
    ],
    "codeExamples": [
      {
        "title": "A* Pathfinding",
        "description": "Graph search",
        "language": "python",
        "code": "import heapq\n\ndef a_star(start, goal, neighbors, heuristic):\n    heap = [(heuristic(start,goal), 0, start)]\n    g = {start: 0}\n    parent = {}\n    while heap:\n        _, cost, cur = heapq.heappop(heap)\n        if cur == goal:\n            path = [cur]\n            while cur in parent: cur = parent[cur]; path.append(cur)\n            return path[::-1]\n        for nxt, step in neighbors(cur):\n            nc = cost + step\n            if nc < g.get(nxt, float(\"inf\")):\n                g[nxt] = nc; parent[nxt] = cur\n                heapq.heappush(heap, (nc+heuristic(nxt,goal), nc, nxt))\n    return None"
      },
      {
        "title": "Simple Neural Net",
        "description": "From scratch with numpy",
        "language": "python",
        "code": "import numpy as np\n\nX = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)\ny = np.array([0,1,1,1], dtype=float)\nnp.random.seed(42)\nW = np.random.randn(2,1) * 0.5\n\nfor _ in range(1000):\n    pred = 1/(1+np.exp(-(X@W)))\n    W -= 0.5 * (X.T @ (pred-y) / len(y))\n\nprint((1/(1+np.exp(-(X@W)))).round(3))"
      }
    ],
    "useCases": [
      {
        "title": "Robotics",
        "description": "A* plans robot paths."
      },
      {
        "title": "Game AI",
        "description": "Minimax drives chess bots."
      },
      {
        "title": "Agents",
        "description": "LLM-driven task automation."
      }
    ],
    "bestPractices": [
      "Start simple, measure, then add complexity",
      "Maintain rigorous evaluation splits",
      "Prefer official frameworks",
      "Track reproducibility"
    ],
    "commonErrors": [
      {
        "error": "Overestimating heuristic",
        "fix": "Ensure heuristic is admissible (never overestimates)."
      },
      {
        "error": "Data leakage",
        "fix": "Split before any preprocessing touches test data."
      }
    ]
  },
  {
    "id": "python-falcon",
    "name": "Python Falcon",
    "icon": "🦅",
    "category": "web",
    "difficulty": "intermediate",
    "description": "High-performance REST API framework with WSGI/ASGI",
    "tags": [
      "Falcon",
      "REST",
      "Web"
    ],
    "prerequisites": [
      "Python",
      "HTTP basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Falcon Framework"
      },
      {
        "type": "paragraph",
        "text": "Falcon is a minimal, fast REST framework. Resources are classes with on_get/on_post methods. It provides transparent HTTP control and performs well under high throughput."
      }
    ],
    "concepts": [
      {
        "name": "Resource",
        "description": "Class mapping URL+verb to handlers."
      },
      {
        "name": "req.media",
        "description": "Parses JSON payloads."
      },
      {
        "name": "resp.media",
        "description": "Serialize responses."
      },
      {
        "name": "Middleware",
        "description": "process_request/response for side-effects."
      }
    ],
    "codeExamples": [
      {
        "title": "CRUD API",
        "description": "Minimal API",
        "language": "python",
        "code": "import falcon\n\nclass TaskResource:\n    def __init__(self): self.tasks = {}\n    def on_get(self, resp, task_id=None):\n        if task_id:\n            task = self.tasks.get(int(task_id))\n            if not task: raise falcon.HTTPNotFound()\n            resp.media = task\n        else: resp.media = list(self.tasks.values())\n    def on_post(self, req, resp):\n        data = req.media\n        if not data or \"title\" not in data:\n            raise falcon.HTTPBadRequest(title=\"Missing title\")\n        new_id = len(self.tasks)+1\n        self.tasks[new_id] = {\"id\":new_id, **data}\n        resp.status = falcon.HTTP_201\n        resp.media = self.tasks[new_id]\n\napp = falcon.App()\napp.add_route(\"/tasks\", TaskResource())\napp.add_route(\"/tasks/{task_id:int}\", TaskResource())"
      },
      {
        "title": "Middleware",
        "description": "Logging and CORS",
        "language": "python",
        "code": "import time\n\nclass LoggingMiddleware:\n    def process_request(self, req, resp): req.context.start = time.perf_counter()\n    def process_response(self, req, resp, resource, req_succeeded):\n        ms = (time.perf_counter()-req.context.start)*1000\n        print(f\"{req.method} {req.path} -> {ms:.1f}ms\")\n\nclass CORSMiddleware:\n    def process_response(self, req, resp, resource, req_succeeded):\n        resp.set_header(\"Access-Control-Allow-Origin\",\"*\")\n\napp = falcon.App(middleware=[LoggingMiddleware(),CORSMiddleware()])"
      }
    ],
    "useCases": [
      {
        "title": "High-Traffic APIs",
        "description": "100k+ requests with low latency."
      },
      {
        "title": "Microservices",
        "description": "Lean services over message queues."
      },
      {
        "title": "High-Performance API",
        "description": "Microservice handling 10K+ requests/sec with minimal overhead"
      },
      {
        "title": "IoT Gateway",
        "description": "Lightweight API for device telemetry ingestion"
      }
    ],
    "bestPractices": [
      "Use req.media/resp.media for content negotiation",
      "Put shared logic in middleware",
      "Validate inputs early"
    ],
    "commonErrors": [
      {
        "error": "HTTPMissingParam",
        "fix": "Use req.get_param with defaults."
      },
      {
        "error": "Setting media after response started",
        "fix": "Build resp.media within handler before return."
      }
    ]
  },
  {
    "id": "beautiful-soup",
    "name": "Beautiful Soup",
    "icon": "🍜",
    "category": "web",
    "difficulty": "beginner",
    "description": "HTML parsing and web scraping",
    "tags": [
      "BeautifulSoup",
      "Scraping",
      "HTML"
    ],
    "prerequisites": [
      "Python basics",
      "HTTP basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Beautiful Soup"
      },
      {
        "type": "paragraph",
        "text": "BeautifulSoup parses HTML/XML and navigates the parse tree. Paired with requests, it is the classic scraping stack: fetch HTML, parse, find elements via tags/CSS selectors. Handles messy HTML gracefully."
      }
    ],
    "concepts": [
      {
        "name": "Tag",
        "description": "Element with attrs, text, children."
      },
      {
        "name": "CSS Selectors",
        "description": "soup.select('.class #id a[href]')."
      },
      {
        "name": "Parsers",
        "description": "html.parser (stdlib), lxml (faster), html5lib (lenient)."
      },
      {
        "name": "NavigableString",
        "description": "Text content inside tags."
      }
    ],
    "codeExamples": [
      {
        "title": "Parse and Navigate",
        "description": "Extract structured data",
        "language": "python",
        "code": "from bs4 import BeautifulSoup\n\nhtml = '<html><body><h1 class=\"title\">Products</h1><div class=\"product\"><span class=\"name\">Keyboard</span><span class=\"price\">$49.99</span></div></body></html>'\n\nsoup = BeautifulSoup(html, \"html.parser\")\nprint(soup.h1.text)\n\nfor prod in soup.find_all(\"div\", class_=\"product\"):\n    name = prod.find(\"span\", class_=\"name\").text\n    price = prod.select_one(\".price\").text\n    print(name, price)"
      },
      {
        "title": "Fetch Live Page",
        "description": "requests + BS pipeline",
        "language": "python",
        "code": "import requests\nfrom bs4 import BeautifulSoup\nimport time\n\nheaders = {\"User-Agent\": \"ResearchBot/1.0\"}\nresp = requests.get(\"https://example.com\", headers=headers, timeout=10)\nresp.raise_for_status()\nsoup = BeautifulSoup(resp.text, \"lxml\")\n\nresults = []\nfor item in soup.select(\".product-item\"):\n    results.append({\n        \"title\": item.select_one(\".title\").text.strip(),\n        \"price\": item.select_one(\".price\").get_text(strip=True)\n    })\ntime.sleep(1)"
      },
      {
        "title": "CSS Selectors & Complex Extraction",
        "description": "Advanced HTML parsing",
        "language": "python",
        "code": "from bs4 import BeautifulSoup\n\nhtml = \"\"\"\n<html>\n<body>\n<div class=\"product-grid\">\n  <div class=\"product\" data-id=\"1\">\n    <h2 class=\"name\">Widget</h2>\n    <span class=\"price\">$29.99</span>\n    <ul class=\"features\">\n      <li>Lightweight</li>\n      <li>Durable</li>\n    </ul>\n  </div>\n  <div class=\"product\" data-id=\"2\">\n    <h2 class=\"name\">Gadget</h2>\n    <span class=\"price\">$49.99</span>\n  </div>\n</div>\n</body>\n</html>\n\"\"\"\n\nsoup = BeautifulSoup(html, 'html.parser')\n\n# CSS selectors\nproducts = soup.select('div.product')\nfor p in products:\n    name = p.select_one('.name').text\n    price = p.select_one('.price').text\n    features = [li.text for li in p.select('.features li')]\n    print(f\"{name} {price} - {features}\")\n\n# Navigate up: find parent\nfirst_price = soup.select_one('.price')\nparent_div = first_price.find_parent('div', class_='product')\nprint(f\"Parent ID: {parent_div['data-id']}\")\n\n# Find siblings\nfor li in soup.select('.features li'):\n    next_li = li.find_next_sibling('li')\n    if next_li:\n        print(f\"After '{li.text}': '{next_li.text}'\")"
      }
    ],
    "useCases": [
      {
        "title": "Price Monitoring",
        "description": "Track retail prices periodically."
      },
      {
        "title": "News Aggregation",
        "description": "Collect headlines and metadata."
      },
      {
        "title": "Research Data",
        "description": "Harvest data from static pages."
      }
    ],
    "bestPractices": [
      "Check robots.txt",
      "Set custom User-Agent",
      "Handle empty results",
      "Cache HTML during development",
      "Use lxml for speed"
    ],
    "commonErrors": [
      {
        "error": "AttributeError on NoneType",
        "fix": "Guard: if el is not None before accessing."
      },
      {
        "error": "403 Forbidden",
        "fix": "Add headers and throttle requests."
      }
    ]
  },
  {
    "id": "python-web-scraping",
    "name": "Python Web Scraping",
    "icon": "🕸️",
    "category": "web",
    "difficulty": "intermediate",
    "description": "Scraping static and JS-heavy sites with requests, Selenium, Scrapy",
    "tags": [
      "Scraping",
      "Selenium",
      "Scrapy"
    ],
    "prerequisites": [
      "Python",
      "BeautifulSoup"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Modern Web Scraping"
      },
      {
        "type": "paragraph",
        "text": "Not all sites are static HTML. For SPAs, call the underlying JSON API directly. For JS-rendered pages, use Selenium/Playwright. For large crawls, Scrapy provides pipelines, throttling, and item loaders."
      }
    ],
    "concepts": [
      {
        "name": "requests",
        "description": "HTTP client for static pages."
      },
      {
        "name": "Selenium",
        "description": "Headless browser for JS-rendered content."
      },
      {
        "name": "Scrapy",
        "description": "Full crawl framework with pipelines."
      },
      {
        "name": "Rate Limiting",
        "description": "Throttle to be polite and avoid bans."
      },
      {
        "name": "Headers",
        "description": "Set User-Agent to identify your bot."
      }
    ],
    "codeExamples": [
      {
        "title": "Selenium for JS Pages",
        "description": "Browser automation",
        "language": "python",
        "code": "from selenium import webdriver\nfrom selenium.webdriver.common.by import By\nimport time\n\ndriver = webdriver.Chrome()\ndriver.get(\"https://example.com\")\ntime.sleep(2)\n\nelements = driver.find_elements(By.CSS_SELECTOR, \".dynamic-item\")\nfor el in elements:\n    print(el.text)\ndriver.quit()"
      },
      {
        "title": "Scrapy Spider",
        "description": "Structured crawl",
        "language": "python",
        "code": "import scrapy\n\nclass ProductSpider(scrapy.Spider):\n    name = \"products\"\n    start_urls = [\"https://example.com/products\"]\n\n    def parse(self, response):\n        for item in response.css(\".product-item\"):\n            yield {\n                \"title\": item.css(\".title::text\").get(),\n                \"price\": item.css(\".price::text\").get(),\n            }\n        next_page = response.css(\"a.next::attr(href)\").get()\n        if next_page:\n            yield response.follow(next_page, self.parse)"
      },
      {
        "title": "Selenium Dynamic Page Loading",
        "description": "Scraping JavaScript-rendered content",
        "language": "python",
        "code": "from selenium import webdriver\nfrom selenium.webdriver.common.by import By\nfrom selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\nfrom selenium.webdriver.chrome.options import Options\n\n# Setup headless Chrome\noptions = Options()\noptions.add_argument('--headless')\noptions.add_argument('--disable-gpu')\n\ndriver = webdriver.Chrome(options=options)\n\ntry:\n    driver.get('https://example.com')\n    \n    # Wait for element to load\n    element = WebDriverWait(driver, 10).until(\n        EC.presence_of_element_located((By.CSS_SELECTOR, 'h1'))\n    )\n    print(f\"Page title: {element.text}\")\n    \n    # Scroll to load lazy content\n    driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')\n    \n    # Extract all links\n    links = driver.find_elements(By.TAG_NAME, 'a')\n    for link in links[:5]:\n        href = link.get_attribute('href')\n        text = link.text.strip()\n        if text:\n            print(f\"  Link: {text} -> {href}\")\n\nfinally:\n    driver.quit()"
      }
    ],
    "useCases": [
      {
        "title": "Lead Generation",
        "description": "Collect business info from directories."
      },
      {
        "title": "Content Aggregation",
        "description": "Build content feeds from multiple sources."
      }
    ],
    "bestPractices": [
      "Respect rate limits (1-2 sec delay)",
      "Rotate User-Agent strings",
      "Handle HTTP errors gracefully",
      "Cache responses during development"
    ],
    "commonErrors": [
      {
        "error": "ElementNotInteractableException",
        "fix": "Wait for element visibility with WebDriverWait."
      },
      {
        "error": "TimeoutException",
        "fix": "Increase explicit wait time or check selectors."
      }
    ]
  },
  {
    "id": "pytest-python",
    "name": "PyTest",
    "icon": "🧪",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Fixtures, parametrize, markers, and plugins for Python testing",
    "tags": [
      "PyTest",
      "Testing",
      "TDD"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PyTest Testing Framework"
      },
      {
        "type": "paragraph",
        "text": "PyTest is Python's most popular testing framework. It discovers tests by naming convention (test_ prefix), uses plain assert statements, and provides powerful fixtures for setup/teardown, parametrize for data-driven tests, and markers for categorization."
      }
    ],
    "concepts": [
      {
        "name": "Fixtures",
        "description": "Setup/teardown via @pytest.fixture."
      },
      {
        "name": "Parametrize",
        "description": "Run same test with different inputs."
      },
      {
        "name": "Markers",
        "description": "@pytest.mark.slow, skip, xfail."
      },
      {
        "name": "Conftest",
        "description": "Shared fixtures across test modules."
      },
      {
        "name": "Plugins",
        "description": "pytest-cov, pytest-xdist, pytest-mock."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic Test",
        "description": "Simple test function",
        "language": "python",
        "code": "def test_addition():\n    assert 1 + 1 == 2\n\ndef test_division():\n    assert 10 / 2 == 5.0\n\ndef test_raises():\n    import pytest\n    with pytest.raises(ZeroDivisionError):\n        1 / 0"
      },
      {
        "title": "Fixtures",
        "description": "Shared setup",
        "language": "python",
        "code": "import pytest\n\n@pytest.fixture\ndef sample_data():\n    return {\"users\": [{\"name\":\"Alice\",\"age\":30}], \"count\": 1}\n\ndef test_user_count(sample_data):\n    assert sample_data[\"count\"] == 1"
      },
      {
        "title": "Parametrize",
        "description": "Data-driven tests",
        "language": "python",
        "code": "@pytest.mark.parametrize(\"input,expected\", [\n    (1, 2),\n    (2, 4),\n    (3, 6),\n    (-1, -2),\n])\ndef test_double(input, expected):\n    assert input * 2 == expected\n\n@pytest.mark.slow\ndef test_heavy_computation():\n    assert 1 == 1"
      },
      {
        "title": "Fixtures & Parameterization",
        "description": "Advanced testing patterns",
        "language": "python",
        "code": "import pytest\n\n# Fixtures: setup/teardown\n@pytest.fixture\ndef sample_data():\n    \"\"\"Provide clean test data.\"\"\"\n    data = {\"users\": [{\"name\": \"Alice\", \"age\": 30}]}\n    yield data\n    # Teardown runs after test\n    data[\"users\"].clear()\n\n@pytest.fixture\ndef db_connection():\n    \"\"\"Database fixture with cleanup.\"\"\"\n    conn = create_connection()\n    yield conn\n    conn.close()\n\ndef test_user_count(sample_data):\n    assert len(sample_data[\"users\"]) == 1\n\ndef test_user_name(sample_data):\n    assert sample_data[\"users\"][0][\"name\"] == \"Alice\"\n\n# Parameterization: run same test with different inputs\n@pytest.mark.parametrize(\"input,expected\", [\n    (1, 2),\n    (2, 4),\n    (5, 10),\n    (-3, -6),\n    (0, 0),\n])\ndef test_double(input, expected):\n    assert input * 2 == expected\n\n# Markers\n@pytest.mark.slow\ndef test_heavy_computation():\n    assert sum(range(1_000_000)) == 499999500000\n\n# Run: pytest -v -m \"not slow\""
      }
    ],
    "useCases": [
      {
        "title": "Unit Testing",
        "description": "Test individual functions in isolation."
      },
      {
        "title": "Integration Testing",
        "description": "Test component interactions with fixtures."
      },
      {
        "title": "Regression Testing",
        "description": "Ensure changes don't break existing functionality."
      }
    ],
    "bestPractices": [
      "Name test files test_*.py",
      "Use fixtures for shared setup",
      "Parametrize repetitive test patterns",
      "Run with -v for detailed output",
      "Add pytest-cov for coverage reports"
    ],
    "commonErrors": [
      {
        "error": "No tests collected",
        "fix": "Check naming: test functions must start with test_."
      },
      {
        "error": "Fixture not found",
        "fix": "Place conftest.py in the correct directory."
      },
      {
        "error": "AssertionError details",
        "fix": "Use assert x == y, not assert(x == y), the latter always passes."
      }
    ]
  },
  {
    "id": "behave",
    "name": "Behave",
    "icon": "🧪",
    "category": "testing",
    "difficulty": "intermediate",
    "description": "BDD with Gherkin: feature files, step definitions, and scenarios",
    "tags": [
      "BDD",
      "Gherkin",
      "Acceptance Testing"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Behavior-Driven Development"
      },
      {
        "type": "paragraph",
        "text": "Behave implements BDD using Gherkin syntax (Given/When/Then) in .feature files with Python step definitions. It bridges business stakeholders and developers with executable specifications."
      }
    ],
    "concepts": [
      {
        "name": "Feature",
        "description": "File describing a feature with scenarios."
      },
      {
        "name": "Scenario",
        "description": "A single test case in Given/When/Then."
      },
      {
        "name": "Steps",
        "description": "Python functions matching Gherkin steps."
      },
      {
        "name": "Step Tables",
        "description": "Data tables passed to step functions."
      },
      {
        "name": "Environment",
        "description": "setup/teardown hooks for scenarios."
      }
    ],
    "codeExamples": [
      {
        "title": "Feature File",
        "description": "Gherkin syntax",
        "language": "gherkin",
        "code": "Feature: Login functionality\n  As a user\n  I want to log in\n  So I can access my account\n\n  Scenario: Successful login\n    Given I am on the login page\n    When I enter valid credentials\n    Then I should see the dashboard\n\n  Scenario: Invalid password\n    Given I am on the login page\n    When I enter wrong password\n    Then I should see an error message"
      },
      {
        "title": "Step Definitions",
        "description": "Python implementations",
        "language": "python",
        "code": "from behave import given, when, then\n\n@given('I am on the login page')\ndef step_login_page(context):\n    context.page = LoginPage()\n\n@when('I enter valid credentials')\ndef step_valid_creds(context):\n    context.page.login(\"user@test.com\", \"password123\")\n\n@then('I should see the dashboard')\ndef step_dashboard(context):\n    assert context.page.is_dashboard_visible()"
      }
    ],
    "useCases": [
      {
        "title": "Acceptance Testing",
        "description": "Executable specs for product requirements."
      },
      {
        "title": "API Testing",
        "description": "Test endpoints with Given/When/Then."
      },
      {
        "title": "UI Testing",
        "description": "Step definitions wrap Selenium calls."
      }
    ],
    "bestPractices": [
      "Write features collaboratively with stakeholders",
      "Keep steps reusable across features",
      "Use tags for selective execution",
      "Run with behave --tags=@smoke for subsets"
    ],
    "commonErrors": [
      {
        "error": "Ambiguous step definitions",
        "fix": "Make step text more specific or use regex patterns."
      },
      {
        "error": "Undefined step",
        "fix": "Implement the missing step function or use behave --dry-run."
      }
    ]
  },
  {
    "id": "cryptography-python",
    "name": "Cryptography with Python",
    "icon": "🔐",
    "category": "networking",
    "difficulty": "advanced",
    "description": "Encryption, hashing, digital signatures, and key management",
    "tags": [
      "Cryptography",
      "Security",
      "Encryption"
    ],
    "prerequisites": [
      "Python",
      "Security basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Cryptography with Python"
      },
      {
        "type": "paragraph",
        "text": "The cryptography library provides Fernet (symmetric), AES, RSA (asymmetric), and hashing primitives. Never roll your own crypto, use established libraries. Key management is critical: rotate keys, use secure storage."
      }
    ],
    "concepts": [
      {
        "name": "Fernet",
        "description": "Simple symmetric encryption with tokens."
      },
      {
        "name": "AES",
        "description": "Block cipher for bulk data encryption."
      },
      {
        "name": "RSA",
        "description": "Asymmetric encryption for key exchange and signatures."
      },
      {
        "name": "Hashing",
        "description": "SHA-256 for integrity verification."
      },
      {
        "name": "HMAC",
        "description": "Hash-based message authentication."
      }
    ],
    "codeExamples": [
      {
        "title": "Fernet Encryption",
        "description": "Symmetric encrypt/decrypt",
        "language": "python",
        "code": "from cryptography.fernet import Fernet\n\nkey = Fernet.generate_key()\nfernet = Fernet(key)\n\nmessage = b\"Secret data\"\nencrypted = fernet.encrypt(message)\nprint(encrypted)\n\ndecrypted = fernet.decrypt(encrypted)\nprint(decrypted.decode())"
      },
      {
        "title": "Hashing",
        "description": "Password hashing",
        "language": "python",
        "code": "from cryptography.hazmat.primitives import hashes\n\nh = hashes.Hash(hashes.SHA256())\nh.update(b\"password123\")\ndigest = h.finalize()\nprint(digest.hex())\n\nfrom cryptography.hazmat.primitives import hmac as crypto_hmac\nmac = crypto_hmac.HMAC(key, b\"message\", hashes.SHA256())\nmac.verify(b\"expected-mac\")"
      },
      {
        "title": "Hashing & HMAC",
        "description": "Password hashing and message authentication",
        "language": "python",
        "code": "import hashlib\nimport hmac\nimport secrets\n\n# Password hashing with salt\npassword = \"my_secret_password\"\nsalt = secrets.token_bytes(16)\n\ndef hash_password(password: str, salt: bytes) -> bytes:\n    \"\"\"PBKDF2 password hashing.\"\"\"\n    return hashlib.pbkdf2_hmac(\n        'sha256',\n        password.encode(),\n        salt,\n        iterations=100_000\n    )\n\nhashed = hash_password(password, salt)\nprint(f\"Hash: {hashed.hex()}\")\nprint(f\"Salt: {salt.hex()}\")\n\n# Verify password\ndef verify(password: str, salt: bytes, stored_hash: bytes) -> bool:\n    return hmac.compare_digest(\n        hash_password(password, salt),\n        stored_hash\n    )\n\nprint(f\"Correct: {verify('my_secret_password', salt, hashed)}\")\nprint(f\"Wrong:   {verify('wrong_password', salt, hashed)}\")\n\n# File integrity with SHA-256\ndef file_hash(path: str) -> str:\n    h = hashlib.sha256()\n    with open(path, 'rb') as f:\n        for chunk in iter(lambda: f.read(8192), b''):\n            h.update(chunk)\n    return h.hexdigest()"
      }
    ],
    "useCases": [
      {
        "title": "Secure Comms",
        "description": "Encrypt messages in transit."
      },
      {
        "title": "Password Storage",
        "description": "Hash with salt before storing."
      },
      {
        "title": "Data Protection",
        "description": "Encrypt files at rest."
      }
    ],
    "bestPractices": [
      "Use proven libraries, never roll your own crypto",
      "Rotate keys regularly",
      "Store keys in a vault, never in code",
      "Use HTTPS everywhere"
    ],
    "commonErrors": [
      {
        "error": "Invalid padding",
        "fix": "Wrong key or corrupted ciphertext."
      },
      {
        "error": "Key length issues",
        "fix": "AES needs 16/32 bytes; RSA needs 2048+ bits."
      }
    ]
  },
  {
    "id": "python-blockchain",
    "name": "Python Blockchain",
    "icon": "🔗",
    "category": "networking",
    "difficulty": "advanced",
    "description": "Blockchain fundamentals: hashing, proof of work, and chain validation",
    "tags": [
      "Blockchain",
      "Hashing",
      "Distributed"
    ],
    "prerequisites": [
      "Python",
      "Cryptography basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Blockchain in Python"
      },
      {
        "type": "paragraph",
        "text": "A blockchain is a chain of blocks where each block contains a hash of the previous block, creating an immutable ledger. Proof of Work requires computational effort to add blocks, preventing spam. Validation ensures the chain hasn't been tampered with."
      }
    ],
    "concepts": [
      {
        "name": "Block",
        "description": "Container with data, timestamp, nonce, and hash."
      },
      {
        "name": "Chain",
        "description": "Sequential linked blocks via previous hash."
      },
      {
        "name": "Hash",
        "description": "SHA-256 fingerprint of block contents."
      },
      {
        "name": "Proof of Work",
        "description": "Find nonce that produces hash with leading zeros."
      },
      {
        "name": "Consensus",
        "description": "Agreement on valid chain across nodes."
      }
    ],
    "codeExamples": [
      {
        "title": "Simple Blockchain",
        "description": "Core implementation",
        "language": "python",
        "code": "import hashlib, json, time\n\nclass Block:\n    def __init__(self, index, data, previous_hash):\n        self.index = index\n        self.timestamp = time.time()\n        self.data = data\n        self.previous_hash = previous_hash\n        self.nonce = 0\n        self.hash = self.compute_hash()\n\n    def compute_hash(self):\n        block_string = json.dumps({\n            \"index\": self.index, \"timestamp\": self.timestamp,\n            \"data\": self.data, \"previous_hash\": self.previous_hash,\n            \"nonce\": self.nonce\n        }, sort_keys=True)\n        return hashlib.sha256(block_string.encode()).hexdigest()\n\n    def mine(self, difficulty=2):\n        target = \"0\" * difficulty\n        while self.hash[:difficulty] != target:\n            self.nonce += 1\n            self.hash = self.compute_hash()\n\nblock = Block(0, \"Genesis\", \"0\")\nblock.mine(2)\nprint(f\"Mined: {block.hash}\")"
      },
      {
        "title": "Chain Validation",
        "description": "Verify integrity",
        "language": "python",
        "code": "class Blockchain:\n    def __init__(self): self.chain = []\n    def add_block(self, data):\n        prev = self.chain[-1].hash if self.chain else \"0\"\n        block = Block(len(self.chain), data, prev)\n        block.mine()\n        self.chain.append(block)\n\n    def is_valid(self):\n        for i in range(1, len(self.chain)):\n            curr, prev = self.chain[i], self.chain[i-1]\n            if curr.hash != curr.compute_hash(): return False\n            if curr.previous_hash != prev.hash: return False\n        return True\n\nbc = Blockchain()\nbc.add_block(\"Transaction 1\")\nbc.add_block(\"Transaction 2\")\nprint(bc.is_valid())"
      }
    ],
    "useCases": [
      {
        "title": "Supply Chain",
        "description": "Immutable product tracking."
      },
      {
        "title": "Voting",
        "description": "Tamper-proof ballot records."
      },
      {
        "title": "Identity",
        "description": "Decentralized credential verification."
      }
    ],
    "bestPractices": [
      "Use proper hashing (SHA-256)",
      "Validate all blocks",
      "Store chain in a database for persistence",
      "Handle forks and consensus"
    ],
    "commonErrors": [
      {
        "error": "Hash mismatch",
        "fix": "Block was tampered with; recalculate and verify."
      },
      {
        "error": "Nonce not found",
        "fix": "Difficulty too high for your hardware; lower difficulty."
      }
    ]
  },
  {
    "id": "python-network-prog",
    "name": "Python Network Programming",
    "icon": "🌐",
    "category": "networking",
    "difficulty": "intermediate",
    "description": "Sockets, TCP/UDP, HTTP clients, and async networking",
    "tags": [
      "Networking",
      "Sockets",
      "TCP",
      "HTTP"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Network Programming"
      },
      {
        "type": "paragraph",
        "text": "Python provides socket for low-level TCP/UDP, http.client for HTTP, and requests for high-level HTTP. asyncio enables non-blocking network I/O. For production networking, always handle timeouts, encoding, and connection cleanup."
      }
    ],
    "concepts": [
      {
        "name": "socket",
        "description": "Low-level network communication endpoint."
      },
      {
        "name": "TCP",
        "description": "Reliable, ordered byte stream protocol."
      },
      {
        "name": "UDP",
        "description": "Fast, connectionless datagrams."
      },
      {
        "name": "requests",
        "description": "High-level HTTP client library."
      },
      {
        "name": "asyncio",
        "description": "Non-blocking I/O for concurrent connections."
      }
    ],
    "codeExamples": [
      {
        "title": "TCP Client/Server",
        "description": "Basic socket programming",
        "language": "python",
        "code": "import socket\n\nwith socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:\n    s.bind((\"localhost\", 9999))\n    s.listen(1)\n    conn, addr = s.accept()\n    with conn:\n        data = conn.recv(1024)\n        conn.send(b\"Echo: \" + data)\n\nimport socket\nwith socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:\n    s.connect((\"localhost\", 9999))\n    s.send(b\"Hello, server!\")\n    print(s.recv(1024))"
      },
      {
        "title": "HTTP with requests",
        "description": "REST API client",
        "language": "python",
        "code": "import requests\n\nresponse = requests.get(\"https://httpbin.org/get\", timeout=10)\nprint(response.status_code)\nprint(response.json())\n\nresp = requests.post(\"https://httpbin.org/post\",\n    json={\"key\": \"value\"},\n    headers={\"Authorization\": \"Bearer token123\"}\n)\nprint(resp.json())"
      }
    ],
    "useCases": [
      {
        "title": "API Clients",
        "description": "Build HTTP clients for third-party services."
      },
      {
        "title": "Chat Applications",
        "description": "TCP socket servers for real-time messaging."
      },
      {
        "title": "Network Monitoring",
        "description": "Ping and probe services continuously."
      }
    ],
    "bestPractices": [
      "Always set timeouts",
      "Handle ConnectionRefusedError gracefully",
      "Close sockets explicitly or use context managers",
      "Prefer requests over raw sockets for HTTP"
    ],
    "commonErrors": [
      {
        "error": "Connection refused",
        "fix": "Server not running or wrong port."
      },
      {
        "error": "TimeoutError",
        "fix": "Set appropriate timeout values."
      },
      {
        "error": "UnicodeDecodeError",
        "fix": "Specify encoding when receiving data."
      }
    ]
  },
  {
    "id": "python-digital-forensics",
    "name": "Python Digital Forensics",
    "icon": "🔍",
    "category": "networking",
    "difficulty": "advanced",
    "description": "File carving, metadata extraction, disk imaging, and evidence analysis",
    "tags": [
      "Forensics",
      "Security",
      "Analysis"
    ],
    "prerequisites": [
      "Python",
      "Linux basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Digital Forensics with Python"
      },
      {
        "type": "paragraph",
        "text": "Digital forensics involves collecting, preserving, and analyzing electronic evidence. Python provides tools for metadata extraction, file carving, log analysis, and chain of custody documentation. Always maintain evidence integrity, never modify original files."
      }
    ],
    "concepts": [
      {
        "name": "File Carving",
        "description": "Recover deleted files from disk images."
      },
      {
        "name": "Metadata",
        "description": "EXIF, file system timestamps, document properties."
      },
      {
        "name": "Hashing",
        "description": "SHA-256 for evidence integrity verification."
      },
      {
        "name": "Chain of Custody",
        "description": "Document who handled evidence when."
      },
      {
        "name": "Timeline Analysis",
        "description": "Reconstruct events from timestamps."
      }
    ],
    "codeExamples": [
      {
        "title": "Metadata Extraction",
        "description": "EXIF from images",
        "language": "python",
        "code": "from PIL import Image\nfrom PIL.ExifTags import TAGS\n\nimg = Image.open(\"photo.jpg\")\nexif = img._getexif()\nif exif:\n    for tag_id, value in exif.items():\n        tag = TAGS.get(tag_id, tag_id)\n        print(f\"{tag}: {value}\")"
      },
      {
        "title": "File Hashing",
        "description": "Evidence integrity",
        "language": "python",
        "code": "import hashlib\n\ndef hash_file(path):\n    h = hashlib.sha256()\n    with open(path, \"rb\") as f:\n        while chunk := f.read(8192):\n            h.update(chunk)\n    return h.hexdigest()\n\noriginal_hash = hash_file(\"evidence.bin\")\nprint(f\"SHA-256: {original_hash}\")"
      },
      {
        "title": "Log Analysis",
        "description": "Parse and analyze logs",
        "language": "python",
        "code": "import re\nfrom collections import Counter\n\nwith open(\"access.log\") as f:\n    lines = f.readlines()\n\nips = re.findall(r\"(\\d+\\.\\d+\\.\\d+\\.\\d+)\", \"\".join(lines))\ntop_ips = Counter(ips).most_common(10)\nfor ip, count in top_ips:\n    print(f\"{ip}: {count} requests\")"
      }
    ],
    "useCases": [
      {
        "title": "Incident Response",
        "description": "Analyze compromised systems."
      },
      {
        "title": "Law Enforcement",
        "description": "Extract evidence from seized devices."
      },
      {
        "title": "Compliance Auditing",
        "description": "Verify data handling policies."
      }
    ],
    "bestPractices": [
      "Never modify original evidence",
      "Work on forensic copies",
      "Document everything with timestamps",
      "Use write-blockers for disk acquisition"
    ],
    "commonErrors": [
      {
        "error": "Modified evidence",
        "fix": "Always hash and work on copies, never originals."
      },
      {
        "error": "Timezone issues",
        "fix": "Normalize all timestamps to UTC for consistency."
      }
    ]
  },
  {
    "id": "python-text-processing",
    "name": "Python Text Processing",
    "icon": "📝",
    "category": "basics",
    "difficulty": "beginner",
    "description": "String operations, regex, NLP basics, and text manipulation",
    "tags": [
      "Text",
      "Regex",
      "NLP",
      "Strings"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Text Processing in Python"
      },
      {
        "type": "paragraph",
        "text": "Python excels at text processing with built-in string methods, the re module for regex, and libraries like NLTK and spaCy for NLP. Common tasks: tokenization, cleaning, pattern matching, and text classification."
      }
    ],
    "concepts": [
      {
        "name": "String Methods",
        "description": "split, join, strip, replace, upper/lower."
      },
      {
        "name": "Regex",
        "description": "re module for pattern matching and extraction."
      },
      {
        "name": "Tokenization",
        "description": "Splitting text into words/sentences."
      },
      {
        "name": "NLTK",
        "description": "Natural Language Toolkit for NLP tasks."
      },
      {
        "name": "spaCy",
        "description": "Industrial-strength NLP pipeline."
      }
    ],
    "codeExamples": [
      {
        "title": "String Methods",
        "description": "Built-in operations",
        "language": "python",
        "code": "text = \"  Hello, World!  \"\nprint(text.strip())\nprint(text.strip().split(\", \"))\nprint(\" \".join([\"a\",\"b\",\"c\"]))\nprint(text.strip().replace(\"World\", \"Python\"))"
      },
      {
        "title": "Regular Expressions",
        "description": "Pattern matching",
        "language": "python",
        "code": "import re\n\ntext = \"Contact us at info@example.com or support@company.org\"\nemails = re.findall(r\"[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}\", text)\nprint(emails)\n\nphones = re.findall(r\"\\d{3}-\\d{3}-\\d{4}\", \"Call 555-123-4567 or 555-987-6543\")\nprint(phones)"
      },
      {
        "title": "Text Cleaning",
        "description": "Preprocessing pipeline",
        "language": "python",
        "code": "import re\n\ndef clean_text(text):\n    text = text.lower()\n    text = re.sub(r\"[^a-zA-Z0-9\\s]\", \"\", text)\n    text = re.sub(r\"\\s+\", \" \", text).strip()\n    return text\n\nraw = \"Hello!!! This is   a test... with  SPECIAL chars @#$\"\nprint(clean_text(raw))"
      },
      {
        "title": "Regex Patterns for Data Extraction",
        "description": "Practical regex patterns",
        "language": "python",
        "code": "import re\nfrom datetime import datetime\n\n# Email extraction\nemail_text = \"\"\"Contact us at support@example.com or\nsales@company.org for more info.\"\"\"\nemails = re.findall(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+', email_text)\nprint(f\"Emails: {emails}\")\n\n# Date parsing with named groups\ndef parse_date(date_str: str) -> datetime:\n    patterns = [\n        r'(?P<Y>\\d{4})-(?P<m>\\d{2})-(?P<d>\\d{2})',\n        r'(?P<m>\\d{2})/(?P<d>\\d{2})/(?P<Y>\\d{4})',\n    ]\n    for p in patterns:\n        m = re.match(p, date_str)\n        if m:\n            return datetime(int(m['Y']), int(m['m']), int(m['d']))\n    raise ValueError(f\"Cannot parse: {date_str}\")\n\nprint(parse_date(\"2024-03-15\"))\nprint(parse_date(\"03/15/2024\"))\n\n# Clean text: normalize whitespace, remove HTML\ndef clean_html(html: str) -> str:\n    text = re.sub(r'<[^>]+>', '', html)  # remove tags\n    text = re.sub(r'\\s+', ' ', text).strip()  # normalize spaces\n    return text\n\nprint(clean_html(\"<p>Hello   <b>world</b>!</p>\"))  # \"Hello world!\"\n\n# Log parsing\nlog = '2024-03-15 10:23:45 ERROR [auth] Failed login for user admin'\nmatch = re.match(\n    r'(?P<time>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}) '\n    r'(?P<level>\\w+) \\[(?P<module>\\w+)\\] (?P<message>.*)',\n    log\n)\nif match:\n    print(f\"Time: {match['time']}, Level: {match['level']}\")"
      }
    ],
    "useCases": [
      {
        "title": "Data Cleaning",
        "description": "Normalize text from messy sources."
      },
      {
        "title": "Search and Replace",
        "description": "Bulk text transformations with regex."
      },
      {
        "title": "NLP Pipelines",
        "description": "Tokenize and clean for ML models."
      }
    ],
    "bestPractices": [
      "Precompile regex patterns for repeated use",
      "Handle Unicode properly with .encode()/.decode()",
      "Use re.sub over str.replace for complex patterns",
      "Normalize text (lowercase, strip) before analysis"
    ],
    "commonErrors": [
      {
        "error": "re.error: bad escape",
        "fix": "Use raw strings r'...' for regex patterns."
      },
      {
        "error": "UnicodeDecodeError",
        "fix": "Specify encoding: open(f, encoding='utf-8')."
      }
    ]
  },
  {
    "id": "python-xlsx-writer",
    "name": "Python XLSX Writer",
    "icon": "📊",
    "category": "data",
    "difficulty": "beginner",
    "description": "Create and format Excel files with charts, formulas, and styling",
    "tags": [
      "Excel",
      "XLSX",
      "Spreadsheets"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Writing Excel Files"
      },
      {
        "type": "paragraph",
        "text": "openpyxl reads/writes Excel .xlsx files; xlsxwriter creates them with rich formatting. Both support formulas, charts, conditional formatting, and images. Choose xlsxwriter for new files with extensive formatting, openpyxl for modifying existing files."
      }
    ],
    "concepts": [
      {
        "name": "Workbook",
        "description": "The Excel file container."
      },
      {
        "name": "Worksheet",
        "description": "Individual sheet within workbook."
      },
      {
        "name": "Cell Formats",
        "description": "Font, color, borders, number formats."
      },
      {
        "name": "Charts",
        "description": "Bar, line, pie, scatter charts."
      },
      {
        "name": "Formulas",
        "description": "SUM, VLOOKUP, IF and custom formulas."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic Excel",
        "description": "Write data with formatting",
        "language": "python",
        "code": "import openpyxl\nfrom openpyxl.styles import Font, PatternFill\n\nwb = openpyxl.Workbook()\nws = wb.active\nws.title = \"Sales\"\n\nheaders = [\"Product\", \"Q1\", \"Q2\", \"Q3\"]\nfor col, h in enumerate(headers, 1):\n    cell = ws.cell(row=1, column=col, value=h)\n    cell.font = Font(bold=True, color=\"FFFFFF\")\n    cell.fill = PatternFill(\"solid\", fgColor=\"4472C4\")\n\nws.append([\"Keyboard\", 120, 135, 150])\nws.append([\"Mouse\", 200, 180, 220])\nws.append([\"Monitor\", 50, 65, 70])\n\nws.cell(row=5, column=1, value=\"Total\")\nws.cell(row=5, column=2, value=\"=SUM(B2:B4)\")\nwb.save(\"report.xlsx\")"
      },
      {
        "title": "XlsxWriter Charts",
        "description": "Charts and formatting",
        "language": "python",
        "code": "import xlsxwriter\n\nwb = xlsxwriter.Workbook(\"charts.xlsx\")\nws = wb.add_worksheet()\n\nws.write(\"A1\", \"Month\")\nws.write(\"B1\", \"Revenue\")\nmonths = [\"Jan\",\"Feb\",\"Mar\",\"Apr\"]\nfor i, m in enumerate(months):\n    ws.write(i+1, 0, m)\n    ws.write(i+1, 1, [100, 150, 130, 180][i])\n\nchart = wb.add_chart({\"type\": \"bar\"})\nchart.add_series({\"values\": \"=Sheet1!$B$1:$B$4\", \"name\": \"Revenue\"})\nchart.set_title({\"name\": \"Monthly Revenue\"})\nws.insert_chart(\"D1\", chart)\n\nwb.close()"
      }
    ],
    "useCases": [
      {
        "title": "Financial Reports",
        "description": "Generate formatted monthly reports."
      },
      {
        "title": "Data Export",
        "description": "Export pandas dataframes to Excel."
      },
      {
        "title": "Template Generation",
        "description": "Create templated spreadsheets."
      }
    ],
    "bestPractices": [
      "Use openpyxl for modifying existing files",
      "Apply formatting to entire ranges, not cell-by-cell",
      "Use named ranges for formulas",
      "Set column widths for readability"
    ],
    "commonErrors": [
      {
        "error": "File is already open",
        "fix": "Close Excel before writing to the same file."
      },
      {
        "error": "Formula not showing",
        "fix": "Check formula syntax and cell references."
      }
    ]
  },
  {
    "id": "fastapi",
    "name": "FastAPI",
    "icon": "⚡",
    "category": "web",
    "difficulty": "intermediate",
    "description": "Modern high-performance async web framework with automatic OpenAPI docs",
    "tags": [
      "FastAPI",
      "REST",
      "Async",
      "API"
    ],
    "prerequisites": [
      "Python",
      "HTTP basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "FastAPI"
      },
      {
        "type": "paragraph",
        "text": "FastAPI is a modern async-first Python web framework. It uses Python type hints to provide automatic request validation, serialization, and interactive Swagger (OpenAPI) docs at /docs. Built on Starlette and Pydantic, it is one of the fastest Python frameworks available."
      }
    ],
    "concepts": [
      {
        "name": "Path Parameters",
        "description": "Type-validated values in URL paths."
      },
      {
        "name": "Query Parameters",
        "description": "Optional params after ? with validation."
      },
      {
        "name": "Pydantic Models",
        "description": "Type-validated request/response bodies."
      },
      {
        "name": "Dependency Injection",
        "description": "Depends() for auth, DB, and reusable logic."
      },
      {
        "name": "Async/Await",
        "description": "Non-blocking I/O for high concurrency."
      },
      {
        "name": "OpenAPI Docs",
        "description": "Auto-generated Swagger UI at /docs."
      }
    ],
    "codeExamples": [
      {
        "title": "Hello World",
        "description": "Minimal app",
        "language": "python",
        "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"message\": \"Hello World\"}\n\n@app.get(\"/items/{item_id}\")\ndef read_item(item_id: int, q: str | None = None):\n    return {\"item_id\": item_id, \"q\": q}\n# Run: uvicorn main:app --reload, docs at /docs"
      },
      {
        "title": "Pydantic Models",
        "description": "Validated request/response",
        "language": "python",
        "code": "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    is_offer: bool = False\n\n@app.post(\"/items/\")\ndef create_item(item: Item):\n    if item.price < 0:\n        raise HTTPException(status_code=400, detail=\"Price can't be negative\")\n    return {\"name\": item.name, \"price\": item.price}"
      },
      {
        "title": "Dependencies",
        "description": "Reusable auth and DB",
        "language": "python",
        "code": "from fastapi import FastAPI, Depends, Header\n\napp = FastAPI()\n\ndef verify_token(authorization: str = Header()):\n    if not authorization.startswith(\"Bearer \"):\n        raise HTTPException(status_code=401, detail=\"Invalid token\")\n    return authorization[7:]\n\n@app.get(\"/protected\")\ndef protected(user: str = Depends(verify_token)):\n    return {\"user\": user, \"message\": \"Access granted\"}"
      },
      {
        "title": "Background Tasks & Middleware",
        "description": "Async background processing",
        "language": "python",
        "code": "from fastapi import FastAPI, BackgroundTasks\nfrom fastapi.middleware.cors import CORSMiddleware\nimport time\n\napp = FastAPI()\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"*\"],\n    allow_methods=[\"*\"],\n    allow_headers=[\"*\"],\n)\n\nasync def send_email(email: str, message: str):\n    \"\"\"Simulate sending email in background.\"\"\"\n    await asyncio.sleep(2)  # simulate SMTP\n    print(f\"Email sent to {email}: {message}\")\n\n@app.post(\"/subscribe\")\nasync def subscribe(email: str, background_tasks: BackgroundTasks):\n    background_tasks.add_task(send_email, email, \"Welcome!\")\n    return {\"status\": \"subscribed\"}\n\n@app.get(\"/slow\")\nasync def slow_endpoint():\n    \"\"\"Endpoint that takes time.\"\"\"\n    await asyncio.sleep(1)\n    return {\"result\": \"done\"}\n\n# Run: uvicorn main:app --reload"
      }
    ],
    "useCases": [
      {
        "title": "REST APIs",
        "description": "Typed, documented backends."
      },
      {
        "title": "Microservices",
        "description": "Lightweight async services."
      },
      {
        "title": "ML Serving",
        "description": "Expose models as endpoints."
      }
    ],
    "bestPractices": [
      "Use Pydantic models for all inputs/outputs",
      "Leverage Depends for auth and DB sessions",
      "Write async handlers for I/O heavy work",
      "Enable CORS middleware for frontend apps"
    ],
    "commonErrors": [
      {
        "error": "422 Validation Error",
        "fix": "Check request body/types match Pydantic model."
      },
      {
        "error": "ImportError uvicorn",
        "fix": "Install: pip install fastapi uvicorn[standard]."
      }
    ]
  },
  {
    "id": "python-pyramid",
    "name": "Python Pyramid",
    "icon": "🗼",
    "category": "web",
    "difficulty": "intermediate",
    "description": "Scalable WSGI framework from single-file apps to large applications",
    "tags": [
      "Pyramid",
      "WSGI",
      "Web"
    ],
    "prerequisites": [
      "Python",
      "HTTP basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Pyramid"
      },
      {
        "type": "paragraph",
        "text": "Pyramid is a minimalist but scalable WSGI framework. It grows from a single-file app to a large modular application using the same core. Key concepts: routes map URLs to views; views return HTTPResponse; configuration can be imperative or declarative."
      }
    ],
    "concepts": [
      {
        "name": "Configurator",
        "description": "Entry point registering routes and views."
      },
      {
        "name": "View Callable",
        "description": "Function returning a response for a route."
      },
      {
        "name": "Routes",
        "description": "Map URL patterns to view callables."
      },
      {
        "name": "Request/Response",
        "description": "request object and returned responses."
      },
      {
        "name": "Templating",
        "description": "Jinja2 or Chameleon renderers."
      }
    ],
    "codeExamples": [
      {
        "title": "Hello World",
        "description": "Single-file app",
        "language": "python",
        "code": "from pyramid.config import Configurator\nfrom pyramid.response import Response\nfrom paste.httpserver import serve\n\ndef hello(request):\n    return Response(\"Hello World\")\n\nconfig = Configurator()\nconfig.add_route(\"home\", \"/\")\nconfig.add_view(hello, route_name=\"home\")\napp = config.make_wsgi_app()\nserve(app, host=\"0.0.0.0\", port=6543)"
      }
    ],
    "useCases": [
      {
        "title": "Content Sites",
        "description": "Server-rendered templates and SEO pages."
      },
      {
        "title": "APIs",
        "description": "REST endpoints via Traversal/URL dispatch."
      },
      {
        "title": "Enterprise CMS",
        "description": "Scalable content management with traversal-based routing"
      },
      {
        "title": "REST API",
        "description": "From single-file to large application with URL dispatch"
      }
    ],
    "bestPractices": [
      "Prefer declarative config for nested apps",
      "Use view predicates to split URLs cleanly",
      "Leverage Pyramid security policies"
    ],
    "commonErrors": [
      {
        "error": "Route not found",
        "description": ".",
        "fix": "Register the view with matching route_name."
      },
      {
        "error": "Missing view",
        "description": ".",
        "fix": "Ensure add_view called for each route."
      }
    ]
  },
  {
    "id": "python-web-dev-libs",
    "name": "Python Web Dev Libraries",
    "icon": "🧰",
    "category": "web",
    "difficulty": "beginner",
    "description": "Essential libraries: requests, httpx, beautifulsoup, flask, django, lxml",
    "tags": [
      "Web",
      "Libraries",
      "HTTP"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Python Web Development Libraries"
      },
      {
        "type": "paragraph",
        "text": "Python offers a rich web ecosystem. HTTP clients like requests and httpx handle API calls; frameworks like Flask, Django, and FastAPI build servers; parsing libraries like BeautifulSoup and lxml handle HTML; Jinja2 renders templates."
      }
    ],
    "concepts": [
      {
        "name": "requests",
        "description": "Synchronous HTTP client."
      },
      {
        "name": "httpx",
        "description": "HTTP client with async support."
      },
      {
        "name": "Flask",
        "description": "Lightweight WSGI micro-framework."
      },
      {
        "name": "Django",
        "description": "Batteries-included full framework."
      },
      {
        "name": "Jinja2",
        "description": "HTML template engine."
      }
    ],
    "codeExamples": [
      {
        "title": "HTTP Clients",
        "description": "requests and httpx",
        "language": "python",
        "code": "import requests\nimport httpx\n\nr = requests.get(\"https://api.github.com\", timeout=10)\nprint(r.status_code, r.json().get(\"current_user_url\"))\n\nasync def fetch():\n    async with httpx.AsyncClient() as client:\n        resp = await client.get(\"https://api.github.com\")\n        print(resp.status_code)\n# import asyncio; asyncio.run(fetch())"
      },
      {
        "title": "Flask App",
        "description": "Minimal web server",
        "language": "python",
        "code": "from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route(\"/api/health\")\ndef health():\n    return jsonify({\"status\": \"ok\", \"service\": \"demo\"})\n\nif __name__ == \"__main__\":\n    app.run()"
      }
    ],
    "useCases": [
      {
        "title": "API Integration",
        "description": "Consume third-party REST APIs."
      },
      {
        "title": "Web Apps",
        "description": "Build Flask/Django servers."
      },
      {
        "title": "Scraping Stack",
        "description": "requests + BeautifulSoup + lxml."
      }
    ],
    "bestPractices": [
      "Choose async (httpx) for concurrency-heavy I/O",
      "Use Flask for small apps, Django for full features",
      "Always set timeouts on HTTP calls"
    ],
    "commonErrors": [
      {
        "error": "ConnectionError",
        "fix": "Check network, URLs, and add timeout/path."
      }
    ]
  },
  {
    "id": "pyqt",
    "name": "PyQt",
    "icon": "🖥️",
    "category": "gui",
    "difficulty": "intermediate",
    "description": "Cross-platform GUI toolkit, the Python binding for Qt",
    "tags": [
      "PyQt",
      "Qt",
      "GUI"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PyQt"
      },
      {
        "type": "paragraph",
        "text": "PyQt is a binding of the C++ Qt framework to Python. It provides signals/slots for event handling, widgets for UI, and layouts for arrangement. PyQt6 and PyQt5 are the common versions. Create QApplication, build the UI with widgets, connect signals, and run the event loop."
      }
    ],
    "concepts": [
      {
        "name": "QApplication",
        "description": "Root of every GUI program."
      },
      {
        "name": "QWidget",
        "description": "Base class for all UI elements."
      },
      {
        "name": "Signals/Slots",
        "description": "Event-driven connection mechanism."
      },
      {
        "name": "Layouts",
        "description": "Automatically arrange widgets."
      },
      {
        "name": "QMainWindow",
        "description": "Main window with menu/toolbar/statusbar."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic Window",
        "description": "Hello with button",
        "language": "python",
        "code": "from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton\nimport sys\n\napp = QApplication(sys.argv)\nwindow = QMainWindow()\nwindow.setWindowTitle(\"Hello PyQt\")\n\nbutton = QPushButton(\"Click me\", window)\nbutton.setGeometry(100, 100, 100, 40)\nbutton.clicked.connect(lambda: button.setText(\"Clicked!\"))\n\nwindow.show()\nsys.exit(app.exec_())"
      }
    ],
    "useCases": [
      {
        "title": "Desktop Apps",
        "description": "Native-feeling tools and editors."
      },
      {
        "title": "Data Viz Apps",
        "description": "Interactive scientific viewers."
      },
      {
        "title": "Data Dashboard",
        "description": "Real-time monitoring dashboard with charts and tables"
      },
      {
        "title": "Scientific GUI",
        "description": "Parameter tuning interface for ML models"
      }
    ],
    "bestPractices": [
      "Connect signals before showing window",
      "Use layouts over fixed geometry",
      "Keep long tasks off the UI thread (QThread)"
    ],
    "commonErrors": [
      {
        "error": "QPixmap: QApplication must exist first",
        "fix": "Create QApplication before widgets."
      },
      {
        "error": "Signal connects to wrong receiver",
        "fix": "Check signal/slot signatures match."
      }
    ]
  },
  {
    "id": "pyqt5",
    "name": "PyQt5",
    "icon": "🖥️",
    "category": "gui",
    "difficulty": "beginner",
    "description": "PyQt5 GUI: widgets, layouts, dialogs, and event handling",
    "tags": [
      "PyQt5",
      "Qt",
      "GUI"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PyQt5 GUI Development"
      },
      {
        "type": "paragraph",
        "text": "PyQt5 is the Qt5 binding (PyQt6 is available but PyQt5 remains widely used). It offers a complete widget toolkit: buttons, text inputs, tables, trees, tabs, and dialogs, plus Qt Designer for visual layout."
      }
    ],
    "concepts": [
      {
        "name": "QListWidget",
        "description": "Scrollable list of items."
      },
      {
        "name": "QTableView",
        "description": "Model/view table."
      },
      {
        "name": "QDialog",
        "description": "Modal or non-modal popups."
      },
      {
        "name": "QTabWidget",
        "description": "Tabbed panels."
      }
    ],
    "codeExamples": [
      {
        "title": "List with Items",
        "description": "Simple interactive list",
        "language": "python",
        "code": "from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QListWidget, QTextEdit\nfrom PyQt5.QtCore import Qt\nimport sys\n\napp = QApplication(sys.argv)\nw = QWidget()\nlayout = QVBoxLayout()\n\nlst = QListWidget()\nfor name in [\"Python\", \"PyQt5\", \"PyQt\", \"Kivy\"]:\n    lst.addItem(name)\n\nout = QTextEdit()\nlst.itemClicked.connect(lambda item: out.setPlainText(f\"Selected: {item.text()}\"))\n\nlayout.addWidget(lst)\nlayout.addWidget(out)\nw.setLayout(layout)\nw.resize(420, 300)\nw.show()\nsys.exit(app.exec_())"
      }
    ],
    "useCases": [
      {
        "title": "Form Tools",
        "description": "Data entry and configuration UIs."
      },
      {
        "title": "Viewers",
        "description": "List/detail browsing interfaces."
      },
      {
        "title": "Form Builder",
        "description": "Drag-and-drop form designer with validation"
      },
      {
        "title": "Media Player",
        "description": "Cross-platform video player with custom controls"
      }
    ],
    "bestPractices": [
      "Use model/view for large datasets",
      "Freeze UI threads with QThread for compute",
      "Localize strings through Qt translation"
    ],
    "commonErrors": [
      {
        "error": "ImportError PyQt5",
        "fix": "pip install PyQt5."
      },
      {
        "error": "Segmentation fault",
        "fix": "Keep references to windows/widgets alive."
      }
    ]
  },
  {
    "id": "pygtk",
    "name": "PyGTK",
    "icon": "🧩",
    "category": "gui",
    "difficulty": "beginner",
    "description": "GTK binding for Python, using the GObject library",
    "tags": [
      "GTK",
      "GNOME",
      "GUI"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PyGTK / PyGObject"
      },
      {
        "type": "paragraph",
        "text": "PyGTK (legacy) and PyGObject (current) are Python bindings for the GTK toolkit used in GNOME. GTK uses a C object model (GObject). UIs are built with widgets like Gtk.Window, Gtk.Button, and Gtk.Box. It is a solid choice for Linux-native apps."
      }
    ],
    "concepts": [
      {
        "name": "Gtk.Window",
        "description": "Top-level application window."
      },
      {
        "name": "Gtk.Button",
        "description": "Clickable control with signal handler."
      },
      {
        "name": "Gtk.Box",
        "description": "Layout container arranging children."
      },
      {
        "name": "GObject Signals",
        "description": "connect('clicked', handler)."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic GTK App",
        "description": "Window with button",
        "language": "python",
        "code": "import gi\ngi.require_version(\"Gtk\", \"3.0\")\nfrom gi.repository import Gtk\n\nclass App(Gtk.Window):\n    def __init__(self):\n        super().__init__(title=\"Hello GTK\")\n        self.set_default_size(320, 200)\n        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10)\n        button = Gtk.Button(label=\"Click me\")\n        button.connect(\"clicked\", self.on_click)\n        box.pack_start(button, True, True, 0)\n        self.add(box)\n\n    def on_click(self, widget):\n        widget.set_label(\"Clicked!\")\n\nwin = App()\nwin.connect(\"destroy\", Gtk.main_quit)\nwin.show_all()\nGtk.main()"
      }
    ],
    "useCases": [
      {
        "title": "Linux Desktop",
        "description": "Native GNOME-integrated apps."
      },
      {
        "title": "System Tools",
        "description": "Utility and admin interfaces."
      },
      {
        "title": "Linux Desktop App",
        "description": "Native GNOME file manager or system monitor"
      }
    ],
    "bestPractices": [
      "Use Gtk.Builder with .ui files for larger apps",
      "Follow GObject naming conventions",
      "Run main_quit on window destroy"
    ],
    "commonErrors": [
      {
        "error": "gi.require_version error",
        "fix": "Ensure PyGObject installed and GTK available."
      }
    ]
  },
  {
    "id": "kivy",
    "name": "Kivy",
    "icon": "🎮",
    "category": "gui",
    "difficulty": "intermediate",
    "description": "Open-source Python framework for multi-touch and mobile apps",
    "tags": [
      "Kivy",
      "Mobile",
      "GUI",
      "Touch"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Kivy"
      },
      {
        "type": "paragraph",
        "text": "Kivy is an open-source Python library for developing multi-touch applications. It is GPU-accelerated and portable across Windows, macOS, Linux, Android, and iOS. Uses a declarative language (KV) to define UIs and an event-driven App class."
      }
    ],
    "concepts": [
      {
        "name": "App",
        "description": "Application root managing lifecycle."
      },
      {
        "name": "KV Language",
        "description": "Declarative UI definition in .kv files."
      },
      {
        "name": "Widgets",
        "description": "UI elements with layouts and inputs."
      },
      {
        "name": "Events",
        "description": "on_press, on_touch_down handlers."
      },
      {
        "name": "Canvas",
        "description": "Vector drawing on widgets."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic App",
        "description": "KV-driven UI",
        "language": "python",
        "code": "from kivy.app import App\nfrom kivy.uix.boxlayout import BoxLayout\nfrom kivy.uix.button import Button\nfrom kivy.uix.label import Label\n\nclass TouchApp(App):\n    def build(self):\n        box = BoxLayout(orientation=\"vertical\")\n        self.label = Label(text=\"Hello Kivy\")\n        btn = Button(text=\"Press\")\n        btn.bind(on_press=self.change)\n        box.add_widget(self.label)\n        box.add_widget(btn)\n        return box\n\n    def change(self, instance):\n        self.label.text = \"Pressed!\"\n\nTouchApp().run()"
      }
    ],
    "useCases": [
      {
        "title": "Mobile Apps",
        "description": "Cross-platform touch UIs."
      },
      {
        "title": "Prototypes",
        "description": "Rapid interactive demos."
      },
      {
        "title": "Kiosks",
        "description": "Touchscreen interfaces."
      },
      {
        "title": "Mobile Game",
        "description": "Multi-touch game for Android/iOS"
      },
      {
        "title": "Kiosk App",
        "description": "Touch-screen kiosk for retail or museum"
      }
    ],
    "bestPractices": [
      "Use KV files to separate UI from logic",
      "Handle touch events for multi-platform support",
      "Test on target device early"
    ],
    "commonErrors": [
      {
        "error": "ModuleNotFoundError kivy",
        "fix": "pip install kivy."
      },
      {
        "error": "Screen resolution issues",
        "fix": "Use relative sizing/pos_hint."
      }
    ]
  },
  {
    "id": "pysimplegui",
    "name": "PySimpleGUI",
    "icon": "📦",
    "category": "gui",
    "difficulty": "beginner",
    "description": "Simple GUI framework wrapping tkinter, Qt, and web backends",
    "tags": [
      "GUI",
      "Tkinter",
      "Simplicity"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PySimpleGUI"
      },
      {
        "type": "paragraph",
        "text": "PySimpleGUI simplifies GUI creation by wrapping tkinter and other backends. Define a layout of rows of elements, create a Window, and read events in an event loop. It is ideal for internal tools, scripts, and small apps."
      }
    ],
    "concepts": [
      {
        "name": "Layout",
        "description": "List of rows of Elements."
      },
      {
        "name": "Window",
        "description": "Hosts the layout."
      },
      {
        "name": "Event Loop",
        "description": "window.read() returns (event, values)."
      },
      {
        "name": "Elements",
        "description": "Text, Input, Button, Table, Graph."
      }
    ],
    "codeExamples": [
      {
        "title": "Login Form",
        "description": "Simple input form",
        "language": "python",
        "code": "import PySimpleGUI as sg\n\nlayout = [\n    [sg.Text(\"Username\"), sg.Input(key=\"-USER-\")],\n    [sg.Text(\"Password\"), sg.Input(key=\"-PASS-\", password_char=\"*\")],\n    [sg.Button(\"Login\"), sg.Button(\"Exit\")],\n]\n\nwindow = sg.Window(\"Login\", layout)\nwhile True:\n    event, values = window.read()\n    if event in (sg.WIN_CLOSED, \"Exit\"):\n        break\n    if event == \"Login\":\n        sg.popup(f\"Logged in as {values['-USER-']}\")\nwindow.close()"
      }
    ],
    "useCases": [
      {
        "title": "Scripts with UI",
        "description": "Wrap CLI tools in a form."
      },
      {
        "title": "Internal Admin Tools",
        "description": "Quick data entry or dashboard."
      },
      {
        "title": "Quick GUI Script",
        "description": "File converter, calculator, or system monitor in 20 lines"
      }
    ],
    "bestPractices": [
      "Use keys for reliable value access",
      "Wrap loops in try/finally to close windows",
      "Match backend (e.g., sg.use_tk()) clearly"
    ],
    "commonErrors": [
      {
        "error": "KeyError on missing key",
        "fix": "Define keys on all desired Inputs/Text."
      }
    ]
  },
  {
    "id": "pygame",
    "name": "Pygame",
    "icon": "👾",
    "category": "gui",
    "difficulty": "intermediate",
    "description": "Cross-platform set of modules for 2D games",
    "tags": [
      "Games",
      "2D",
      "Graphics"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Pygame"
      },
      {
        "type": "paragraph",
        "text": "Pygame provides modules for game development: graphics (surfaces, sprites), sound, fonts, and input. The core loop initializes pygame, loads assets, handles events, updates game state, and draws to the screen each frame."
      }
    ],
    "concepts": [
      {
        "name": "Surface",
        "description": "Rectangular drawable region."
      },
      {
        "name": "Rect",
        "description": "Position and collision region."
      },
      {
        "name": "Sprite",
        "description": "Drawable object managing position/image."
      },
      {
        "name": "Event Loop",
        "description": "pygame.event.get() input handling."
      },
      {
        "name": "Game Loop",
        "description": "Update + draw per frame."
      }
    ],
    "codeExamples": [
      {
        "title": "Moving Square",
        "description": "Basic game loop",
        "language": "python",
        "code": "import pygame, sys\n\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\nclock = pygame.time.Clock()\ncolor = (100, 100, 250)\npos = [320, 240]\nspeed = 5\n\nwhile True:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            pygame.quit(); sys.exit()\n\n    keys = pygame.key.get_pressed()\n    if keys[pygame.K_LEFT]: pos[0] -= speed\n    if keys[pygame.K_RIGHT]: pos[0] += speed\n    if keys[pygame.K_UP]: pos[1] -= speed\n    if keys[pygame.K_DOWN]: pos[1] += speed\n\n    screen.fill((0, 0, 0))\n    pygame.draw.rect(screen, color, (pos[0], pos[1], 40, 40))\n    pygame.display.flip()\n    clock.tick(60)"
      }
    ],
    "useCases": [
      {
        "title": "2D Games",
        "description": "Platformers, arcade, puzzle games."
      },
      {
        "title": "Simulations",
        "description": "Visual physics and agents."
      },
      {
        "title": "Learning",
        "description": "Intro to game loops and graphics."
      },
      {
        "title": "2D Platformer",
        "description": "Side-scrolling game with physics and collision"
      },
      {
        "title": "Puzzle Game",
        "description": "Match-3 or sokoban with sprite animations"
      }
    ],
    "bestPractices": [
      "Use clock.tick to cap framerate",
      "Load assets once outside the loop",
      "Group sprites with pygame.sprite.Group"
    ],
    "commonErrors": [
      {
        "error": "pygame.error: video system not initialized",
        "fix": "Call pygame.init() first."
      },
      {
        "error": "Slow framerate",
        "fix": "Limit surface sizes and pre-render images."
      }
    ]
  },
  {
    "id": "wxpython",
    "name": "wxPython",
    "icon": "🪟",
    "category": "gui",
    "difficulty": "beginner",
    "description": "GUI toolkit producing native-looking interfaces across platforms",
    "tags": [
      "wxPython",
      "wxWidgets",
      "GUI"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "wxPython"
      },
      {
        "type": "paragraph",
        "text": "wxPython is a wrapper around the wxWidgets C++ library. It creates native-feeling controls on each platform. Central concepts: wx.App, wx.Frame, wx.Panel, sizers for layout, and event binding with wx.EVT_* handlers."
      }
    ],
    "concepts": [
      {
        "name": "wx.App",
        "description": "Application object."
      },
      {
        "name": "wx.Frame",
        "description": "Top-level window."
      },
      {
        "name": "Sizers",
        "description": "Layout managers (BoxSizer, GridSizer)."
      },
      {
        "name": "Events",
        "description": "Bind handlers with wx.EVT_BUTTON etc."
      }
    ],
    "codeExamples": [
      {
        "title": "Simple Frame",
        "description": "Window with a button",
        "language": "python",
        "code": "import wx\n\nclass MyFrame(wx.Frame):\n    def __init__(self):\n        super().__init__(None, title=\"Hello wxPython\", size=(400, 300))\n        panel = wx.Panel(self)\n        sizer = wx.BoxSizer(wx.VERTICAL)\n        self.label = wx.StaticText(panel, label=\"Hello\")\n        btn = wx.Button(panel, label=\"Click\")\n        btn.Bind(wx.EVT_BUTTON, self.on_click)\n        sizer.Add(self.label, 0, wx.ALL, 20)\n        sizer.Add(btn, 0, wx.ALL, 20)\n        panel.SetSizer(sizer)\n\n    def on_click(self, event):\n        self.label.SetLabel(\"Clicked!\")\n\napp = wx.App()\nframe = MyFrame()\nframe.Show()\napp.MainLoop()"
      }
    ],
    "useCases": [
      {
        "title": "Desktop Tools",
        "description": "Native-feel cross-platform utilities."
      },
      {
        "title": "Business App Frontends",
        "description": "Forms, tables, and dialogs."
      },
      {
        "title": "File Manager",
        "description": "Cross-platform file explorer with native look"
      }
    ],
    "bestPractices": [
      "Use sizers rather than fixed positions",
      "Bind events via Bind() with wx.EVT_*",
      "Put drawing in wx.PaintDC / Refresh"
    ],
    "commonErrors": [
      {
        "error": "wx.InitAllImageHandlers needed",
        "fix": "Call for JPEG/PNG loading."
      }
    ]
  },
  {
    "id": "jupyter",
    "name": "Jupyter",
    "icon": "📓",
    "category": "tools",
    "difficulty": "beginner",
    "description": "Interactive notebooks for data science and reproducible research",
    "tags": [
      "Jupyter",
      "Notebook",
      "Data Science"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Jupyter Notebooks"
      },
      {
        "type": "paragraph",
        "text": "Jupyter Notebooks blend code, markdown, and rich output in a single document. Cells run in order, sharing an interactive kernel. Ideal for exploration, visualization, and teaching. JupyterLab is the modern interface. Notebooks store as .ipynb (JSON)."
      }
    ],
    "concepts": [
      {
        "name": "Kernel",
        "description": "Execution engine for a language."
      },
      {
        "name": "Cell",
        "description": "Unit of code or markdown."
      },
      {
        "name": "Magic Commands",
        "description": "%timeit, %matplotlib inline."
      },
      {
        "name": "Rich Output",
        "description": "Plots, tables, and HTML."
      },
      {
        "name": "ipynb",
        "description": "JSON notebook format."
      }
    ],
    "codeExamples": [
      {
        "title": "Magic Commands",
        "description": "Notebook conveniences",
        "language": "python",
        "code": "# In a notebook cell\n%matplotlib inline\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n%timeit sum(range(1000))\n\nx = np.linspace(0, 10, 100)\nplt.plot(x, np.sin(x))\nplt.title(\"Sine wave\")\nplt.show()"
      }
    ],
    "useCases": [
      {
        "title": "Exploration",
        "description": "Iterative data analysis."
      },
      {
        "title": "Reporting",
        "description": "Narrative with visuals (nbconvert to HTML/PDF)."
      },
      {
        "title": "Teaching",
        "description": "Interactive lessons in any kernel."
      },
      {
        "title": "Data Pipeline",
        "description": "ETL notebook: extract, transform, load with visualizations"
      }
    ],
    "bestPractices": [
      "Keep cells small and ordered",
      "Use Version Control with jupytext/nbdiff",
      "Clear outputs before committing",
      "Use pandas plotting and %timeit for profiling"
    ],
    "commonErrors": [
      {
        "error": "Kernel not starting",
        "fix": "Restart kernel or reinstall ipykernel."
      },
      {
        "error": "Variable not defined",
        "fix": "Run cells in order, not out of order."
      }
    ]
  },
  {
    "id": "pycharm",
    "name": "PyCharm",
    "icon": "🚀",
    "category": "tools",
    "difficulty": "beginner",
    "description": "JetBrains IDE for Python with debugging, refactoring, and testing",
    "tags": [
      "IDE",
      "PyCharm",
      "Dev Tools"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PyCharm"
      },
      {
        "type": "paragraph",
        "text": "PyCharm is JetBrains' Python IDE. It offers a first-class debugger, smart code completion, refactoring, and integrated testing. Features: interpreter/venv management, Jupyter support, database tools, and version control. Free Community edition covers core Python; Professional adds web frameworks and remote dev."
      }
    ],
    "concepts": [
      {
        "name": "Virtualenv",
        "description": "Isolated project interpreter."
      },
      {
        "name": "Debugger",
        "description": "Breakpoints, stepping, watches."
      },
      {
        "name": "Run Configuration",
        "description": "Defines how to run a script."
      },
      {
        "name": "Refactoring",
        "description": "Rename, extract, inline safely."
      }
    ],
    "codeExamples": [
      {
        "title": "Debugging Workflow",
        "description": "Concepts",
        "language": "python",
        "code": "def factorial(n):\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    result = 1\n    for i in range(2, n + 1):   # set breakpoint here\n        result *= i\n    return result\n\n# In PyCharm: set breakpoint, Run -> Debug,\n# inspect variables in Debug tool window,\n# step over/into, add Watches."
      }
    ],
    "useCases": [
      {
        "title": "Python Development",
        "description": "Scripts, packages, and tests."
      },
      {
        "title": "Data Science",
        "description": "Notebook and plotting support."
      },
      {
        "title": "Web Apps",
        "description": "Django/Flask/FastAPI dev (Pro)."
      },
      {
        "title": "Django Development",
        "description": "Full-stack Django with debugging, testing, and deployment"
      }
    ],
    "bestPractices": [
      "Create a venv per project",
      "Use Run Configurations for different entry points",
      "Enable type hint inspection",
      "Leverage the integrated terminal and VCS."
    ],
    "commonErrors": [
      {
        "error": "No interpreter configured",
        "fix": "Set project interpreter in Settings -> Project."
      }
    ]
  },
  {
    "id": "pyttsx-python",
    "name": "pyttsx (Text-to-Speech)",
    "icon": "🗣️",
    "category": "basics",
    "difficulty": "beginner",
    "description": "Offline text-to-speech engine for cross-platform voice output",
    "tags": [
      "TTS",
      "Speech",
      "Voice"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "pyttsx3 Text-to-Speech"
      },
      {
        "type": "paragraph",
        "text": "pyttsx3 is a text-to-speech library that works offline on Windows (SAPI5), macOS (NSSpeechSynthesizer), and Linux (espeak). It supports multiple voices, speech rate, and volume. Initialization: engine = pyttsx3.init(); then engine.say(text) and engine.runAndWait()."
      }
    ],
    "concepts": [
      {
        "name": "Engine",
        "description": "Manages voices and speech."
      },
      {
        "name": "Voices",
        "description": "Different voice profiles."
      },
      {
        "name": "Properties",
        "description": "rate, volume, voice."
      },
      {
        "name": "Say",
        "description": "Queue text, runAndWait to speak."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic Speech",
        "description": "Speak a sentence",
        "language": "python",
        "code": "import pyttsx3\n\nengine = pyttsx3.init()\nengine.setProperty(\"rate\", 150)      # words per minute\nengine.setProperty(\"volume\", 0.9)   # 0.0 to 1.0\n\nvoices = engine.getProperty(\"voices\")\nengine.setProperty(\"voice\", voices[0].id)\n\nengine.say(\"Hello, this is a text to speech example.\")\nengine.runAndWait()"
      }
    ],
    "useCases": [
      {
        "title": "Accessibility",
        "description": "Read text aloud for users."
      },
      {
        "title": "Voice Assistants",
        "description": "Local offline voice output."
      },
      {
        "title": "Audio Books",
        "description": "Convert documents to speech."
      },
      {
        "title": "Accessibility Tool",
        "description": "Screen reader for visually impaired users"
      }
    ],
    "bestPractices": [
      "Set voice/rate once, not per call",
      "Run speech in a separate thread to avoid blocking UI",
      "Check engine availability per platform"
    ],
    "commonErrors": [
      {
        "error": "No module named pyttsx3",
        "fix": "pip install pyttsx3."
      },
      {
        "error": "No voices found",
        "fix": "Install platform TTS (e.g., espeak on Linux)."
      }
    ]
  },
  {
    "id": "pyspark-python",
    "name": "PySpark",
    "icon": "⚡",
    "category": "ml",
    "difficulty": "advanced",
    "description": "Python API for Apache Spark big data processing",
    "tags": [
      "Spark",
      "Big Data",
      "Distributed",
      "DataFrame"
    ],
    "prerequisites": [
      "Python",
      "SQL concepts"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "PySpark"
      },
      {
        "type": "paragraph",
        "text": "PySpark is the Python API for Apache Spark, a distributed computing engine. It processes large datasets across clusters using DataFrames (like SQL tables) and resilient execution. Lazy evaluation means transformations are deferred until an action triggers computation."
      }
    ],
    "concepts": [
      {
        "name": "SparkSession",
        "description": "Entry point for DataFrame APIs."
      },
      {
        "name": "DataFrame",
        "description": "Distributed table with schema."
      },
      {
        "name": "Transformations",
        "description": "Lazy: select, filter, groupBy."
      },
      {
        "name": "Actions",
        "description": "Eager: collect, count, show."
      },
      {
        "name": "Export",
        "description": "Write to Parquet/CSV/Delta."
      }
    ],
    "codeExamples": [
      {
        "title": "DataFrame Workflow",
        "description": "Read, transform, aggregate",
        "language": "python",
        "code": "from pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\n\nspark = SparkSession.builder.appName(\"demo\").getOrCreate()\n\ndf = spark.createDataFrame([\n    (\"Alice\", \"Sales\", 5000.0),\n    (\"Bob\", \"Eng\", 6000.0),\n    (\"Carol\", \"Sales\", 4500.0),\n], [\"name\", \"dept\", \"salary\"])\n\nresult = (df\n    .filter(F.col(\"salary\") > 4000)\n    .groupBy(\"dept\")\n    .agg(F.avg(\"salary\").alias(\"avg_salary\")))\nresult.show()"
      }
    ],
    "useCases": [
      {
        "title": "ETL at Scale",
        "description": "Transform terabytes across clusters."
      },
      {
        "title": "ML Pipelines",
        "description": "Scale with MLlib."
      },
      {
        "title": "Streaming",
        "description": "Structured streaming on live data."
      },
      {
        "title": "Log Analysis",
        "description": "Process TB-scale server logs for error patterns"
      },
      {
        "title": "Feature Engineering",
        "description": "Distributed feature extraction for ML pipelines"
      }
    ],
    "bestPractices": [
      "Use DataFrames over RDD where possible",
      "Partition for balanced workloads",
      "Avoid collect() on huge results",
      "Use broadcast variables for small lookup tables"
    ],
    "commonErrors": [
      {
        "error": "OutOfMemory Driver",
        "fix": "Avoid collect(), use .write or sampling."
      },
      {
        "error": "Py4J JavaGatewayError",
        "fix": "Ensure JAVA_HOME set and Java installed."
      }
    ]
  },
  {
    "id": "rxpy-python",
    "name": "RxPY",
    "icon": "🔁",
    "category": "basics",
    "difficulty": "intermediate",
    "description": "Reactive extensions for Python: observable streams and operators",
    "tags": [
      "Reactive",
      "Rx",
      "Observables",
      "Async"
    ],
    "prerequisites": [
      "Python",
      "Async basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "RxPY Reactive Programming"
      },
      {
        "type": "paragraph",
        "text": "RxPY implements the Reactive Extensions for Python. It models data as observable streams with operators (map, filter, debounce, merge). Publish-subscribe with on_next/on_error/on_completed callbacks. Works with both synchronous and async (asyncio) execution."
      }
    ],
    "concepts": [
      {
        "name": "Observable",
        "description": "Stream of events."
      },
      {
        "name": "Observer",
        "description": "on_next/on_error/on_completed callbacks."
      },
      {
        "name": "Operators",
        "description": "Pipeable functions transforming streams."
      },
      {
        "name": "Scheduler",
        "description": "Controls execution timing/thread."
      },
      {
        "name": "Subscription",
        "description": "Return value of subscribe to dispose."
      }
    ],
    "codeExamples": [
      {
        "title": "Observable Pipeline",
        "description": "Map and filter",
        "language": "python",
        "code": "import rx\nfrom rx import operators as ops\n\nsource = rx.of(1, 2, 3, 4, 5, 6)\n\nresult = source.pipe(\n    ops.filter(lambda x: x % 2 == 0),\n    ops.map(lambda x: x * 10),\n)\n\nresult.subscribe(\n    on_next=lambda x: print(f\"Next: {x}\"),\n    on_completed=lambda: print(\"Done\"),\n)"
      }
    ],
    "useCases": [
      {
        "title": "Event Streams",
        "description": "Reactive UI and telemetry."
      },
      {
        "title": "Data Pipelines",
        "description": "Declarative transformation chains."
      },
      {
        "title": "Async Composition",
        "description": "Merge multiple async sources."
      },
      {
        "title": "Event Processing",
        "description": "Real-time stock price filtering and aggregation"
      }
    ],
    "bestPractices": [
      "Prefer operators over manual loops",
      "Dispose subscriptions to prevent leaks",
      "Remember lazy evaluation with cold observables"
    ],
    "commonErrors": [
      {
        "error": "Nothing printed",
        "fix": "Call .subscribe() to trigger execution."
      }
    ]
  },
  {
    "id": "python-mongoengine",
    "name": "MongoEngine",
    "icon": "🍃",
    "category": "data",
    "difficulty": "intermediate",
    "description": "ODM for MongoDB: document models, embedded docs, and queries",
    "tags": [
      "MongoDB",
      "ODM",
      "NoSQL"
    ],
    "prerequisites": [
      "Python",
      "MongoDB basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "MongoEngine ODM"
      },
      {
        "type": "paragraph",
        "text": "MongoEngine is an Object-Document Mapper for MongoDB, similar to SQLAlchemy for SQL. Define Document subclasses with fields (StringField, IntField, ListField, ReferenceField). Queries chain filters like User.objects(email='x').first(). EmbeddedDocument allows nested structures."
      }
    ],
    "concepts": [
      {
        "name": "Document",
        "description": "Maps to a MongoDB collection."
      },
      {
        "name": "Field Types",
        "description": "String, Int, List, Dict, Reference."
      },
      {
        "name": "QuerySet",
        "description": "Chainable query results."
      },
      {
        "name": "EmbeddedDocument",
        "description": "Nested sub-documents."
      },
      {
        "name": "ReferenceField",
        "description": "Link to other documents."
      }
    ],
    "codeExamples": [
      {
        "title": "Define Documents",
        "description": "Models and query",
        "language": "python",
        "code": "from mongoengine import connect, Document, StringField, IntField, ListField, ReferenceField\n\nconnect(\"shop\")\n\nclass Item(Document):\n    name = StringField(required=True, max_length=100)\n    price = IntField(min_value=0)\n    tags = ListField(StringField())\n\nclass Order(Document):\n    customer = StringField()\n    items = ListField(ReferenceField(Item))\n\nitem = Item(name=\"Keyboard\", price=100, tags=[\"peripheral\"]).save()\norder = Order(customer=\"Alice\", items=[item]).save()\n\ncheap = Item.objects(price__lt=150)\nprint([i.name for i in cheap])"
      }
    ],
    "useCases": [
      {
        "title": "Document Stores",
        "description": "Flexible schemas for evolving data."
      },
      {
        "title": "Rapid Prototyping",
        "description": "No migrations needed."
      },
      {
        "title": "Content Models",
        "description": "Nested embedded structures."
      },
      {
        "title": "Blog Platform",
        "description": "Document models for posts, comments, and user profiles"
      }
    ],
    "bestPractices": [
      "Define required and validation constraints",
      "Use embedded docs for one-to-one inline data",
      "Index frequently queried fields",
      "Use .first() vs .get() appropriately"
    ],
    "commonErrors": [
      {
        "error": "DoesNotExist",
        "fix": "Use .first() to return None instead."
      },
      {
        "error": "Field type mismatch",
        "fix": "Validate data types before save."
      }
    ]
  },
  {
    "id": "jython",
    "name": "Jython",
    "icon": "☕",
    "category": "basics",
    "difficulty": "advanced",
    "description": "Python implementation that runs on the Java Virtual Machine (JVM)",
    "tags": [
      "Jython",
      "JVM",
      "Java",
      "Interop"
    ],
    "prerequisites": [
      "Python",
      "Java basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Jython"
      },
      {
        "type": "paragraph",
        "text": "Jython is a Python implementation that compiles to Java bytecode and runs on the JVM. It allows Python to import Java classes and use them seamlessly, and lets Java applications embed Python scripting. It implements CPython 2.7 (limited support for Python 3)."
      }
    ],
    "concepts": [
      {
        "name": "JVM",
        "description": "Runs Jython-compiled bytecode."
      },
      {
        "name": "Java Interop",
        "description": "Import java.* packages in Python."
      },
      {
        "name": "Embedding",
        "description": "Call Python from Java via PythonInterpreter."
      },
      {
        "name": "Limitations",
        "description": "No CPython C extensions."
      }
    ],
    "codeExamples": [
      {
        "title": "Use Java from Python",
        "description": "JVM interop",
        "language": "python",
        "code": "import java.util as util\n\narr = util.ArrayList()\narr.add(\"Hello\")\narr.add(\"Jython\")\nprint(arr.get(0), arr.size())\n\nimport java.lang as lang\nprint(lang.System.currentTimeMillis())"
      }
    ],
    "useCases": [
      {
        "title": "Java-Python Bridge",
        "description": "Script legacy Java systems in Python."
      },
      {
        "title": "JVM Scripting",
        "description": "Domain automation inside JVM apps."
      },
      {
        "title": "Legacy Maintenance",
        "description": "Maintain Python 2 codebases."
      },
      {
        "title": "Java Integration",
        "description": "Access Java libraries from Python scripts"
      }
    ],
    "bestPractices": [
      "Confirm your target Python version support",
      "Prefer Python 3 alternatives for new features",
      "Test JVM interop behaviour per JDK"
    ],
    "commonErrors": [
      {
        "error": "No C extensions",
        "fix": "C libraries like numpy are unavailable on Jython."
      }
    ]
  },
  {
    "id": "python-decorators",
    "name": "Python Decorators",
    "icon": "🎀",
    "category": "basics",
    "difficulty": "intermediate",
    "description": "Function and class decorators: closures, @wraps, parameterized, class-based",
    "tags": [
      "Decorators",
      "Functions",
      "Python"
    ],
    "prerequisites": [
      "Python basics",
      "Functions"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Python Decorators"
      },
      {
        "type": "paragraph",
        "text": "A decorator is a callable that takes a function (or class) and returns a modified version. It lets you add behavior (logging, timing, auth, caching) without changing the function's implementation. Decorators use closures under the hood."
      },
      {
        "type": "heading",
        "text": "Key Ideas"
      },
      {
        "type": "list",
        "items": [
          "Functions are first-class objects",
          "A decorator returns a wrapper function",
          "@decorator syntax is syntactic sugar for f = decorator(f)",
          "functools.wraps preserves metadata"
        ]
      }
    ],
    "concepts": [
      {
        "name": "Closure",
        "description": "Inner function capturing outer variables."
      },
      {
        "name": "Wrapper",
        "description": "Function that adds behavior then calls original."
      },
      {
        "name": "@syntax",
        "description": "Sugar for re-binding the decorated name."
      },
      {
        "name": "functools.wraps",
        "description": "Preserves __name__/__doc__ of the original."
      },
      {
        "name": "Parameterized Decorator",
        "description": "Outer factory returning a decorator."
      },
      {
        "name": "Class Decorators",
        "description": "__call__-based decorators or @classmethod alternatives."
      }
    ],
    "codeExamples": [
      {
        "title": "Basic Decorator",
        "description": "Timing a function",
        "language": "python",
        "code": "import functools, time\n\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        print(f\"{func.__name__} took {time.perf_counter()-start:.4f}s\")\n        return result\n    return wrapper\n\n@timer\ndef slow(n):\n    sum(range(n))\n\nslow(10_000_000)"
      },
      {
        "title": "Parameterized Decorator",
        "description": "Decorator with arguments",
        "language": "python",
        "code": "def repeat(times):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for _ in range(times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef say_hi():\n    print(\"Hi\")\n\nsay_hi()"
      },
      {
        "title": "Auth / with arguments",
        "description": "Real-world use",
        "language": "python",
        "code": "def require_auth(func):\n    @functools.wraps(func)\n    def wrapper(user, *args, **kwargs):\n        if not user.get(\"authenticated\"):\n            raise PermissionError(\"Login required\")\n        return func(user, *args, **kwargs)\n    return wrapper\n\n@require_auth\ndef view_profile(user):\n    return {\"profile\": user[\"name\"]}\n\nprint(view_profile({\"authenticated\": True, \"name\": \"Alice\"}))"
      },
      {
        "title": "Class Decorators & Property Decorators",
        "description": "Decorating classes and managing state",
        "language": "python",
        "code": "import functools\n\n# Class decorator: add __repr__ automatically\ndef add_repr(cls):\n    fields = [k for k in cls.__init__.__code__.co_varnames\n              if k != 'self']\n    @functools.wraps(cls)\n    def wrapper(*args, **kwargs):\n        instance = cls(*args, **kwargs)\n        values = [getattr(instance, f) for f in fields]\n        instance.__repr__ = lambda: f\"{cls.__name__}({', '.join(repr(v) for v in values)})\"\n        return instance\n    return wrapper\n\n@add_repr\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\nprint(Point(3, 4))  # Point(3, 4)\n\n# Property decorator: managed attributes\nclass Temperature:\n    def __init__(self, celsius=0):\n        self._celsius = celsius\n    \n    @property\n    def celsius(self):\n        return self._celsius\n    \n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"Below absolute zero!\")\n        self._celsius = value\n    \n    @property\n    def fahrenheit(self):\n        return self._celsius * 9/5 + 32\n    \n    @fahrenheit.setter\n    def fahrenheit(self, value):\n        self.celsius = (value - 32) * 5/9\n\nt = Temperature(100)\nprint(f\"{t.celsius}C = {t.fahrenheit}F\")\nt.fahrenheit = 32\nprint(f\"Now: {t.celsius}C = {t.fahrenheit}F\")"
      }
    ],
    "useCases": [
      {
        "title": "Logging",
        "description": "Wrap functions to log calls and arguments."
      },
      {
        "title": "Caching",
        "description": "functools.lru_cache memoizes results."
      },
      {
        "title": "Authorization",
        "description": "Guard endpoints and methods."
      },
      {
        "title": "Validation",
        "description": "Check and coerce inputs."
      }
    ],
    "bestPractices": [
      "Always use functools.wraps",
      "Keep wrappers transparent (return values, signatures)",
      "Stack decorators top-down (bottom applies first)",
      "Avoid overusing; keep decorators simple and documented"
    ],
    "commonErrors": [
      {
        "error": "Lost function metadata",
        "fix": "Add @functools.wraps(func) to the wrapper."
      },
      {
        "error": "Wrong argument passing",
        "fix": "Use (*args, **kwargs) in the wrapper for generality."
      },
      {
        "error": "Decorator order confusion",
        "fix": "Remember bottom decorator runs first."
      }
    ]
  },
  {
    "id": "python-generators",
    "name": "Python Generators",
    "icon": "⚙️",
    "category": "basics",
    "difficulty": "intermediate",
    "description": "Lazy iteration with yield, generator expressions, and coroutines",
    "tags": [
      "Generators",
      "Iterators",
      "Lazy",
      "Coroutines"
    ],
    "prerequisites": [
      "Python basics",
      "Functions"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Generators"
      },
      {
        "type": "paragraph",
        "text": "A generator function contains the yield keyword. Calling it returns a generator object that produces values lazily on demand instead of building a list in memory. This is ideal for large or infinite sequences and streaming pipelines."
      },
      {
        "type": "heading",
        "text": "How They Work"
      },
      {
        "type": "list",
        "items": [
          "Execution pauses at yield and resumes on next()",
          "State is preserved between yields",
          "Generators are single-use iterators",
          "Generator expressions use () instead of []"
        ]
      }
    ],
    "concepts": [
      {
        "name": "yield",
        "description": "Pauses function, emits a value."
      },
      {
        "name": "next()",
        "description": "Advances the generator to the next yield."
      },
      {
        "name": "Lazy Evaluation",
        "description": "Values computed only when requested."
      },
      {
        "name": "Generator Expression",
        "description": "(x for x in it if cond)."
      },
      {
        "name": "yield from",
        "description": "Delegates to a sub-generator."
      },
      {
        "name": "StopIteration",
        "description": "Raised when the generator is exhausted."
      }
    ],
    "codeExamples": [
      {
        "title": "Lazy Ranges",
        "description": "Memory-efficient sequence",
        "language": "python",
        "code": "def lazy_range(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\n\nfor x in lazy_range(5):\n    print(x)\n\n# generator expression\nsquares = (x*x for x in range(10))\nprint(sum(squares))  # 285"
      },
      {
        "title": "Infinite Sequence",
        "description": "Never-completing generator",
        "language": "python",
        "code": "def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nf = fib()\nfirst_ten = [next(f) for _ in range(10)]\nprint(first_ten)  # [0,1,1,2,3,5,8,13,21,34]"
      },
      {
        "title": "File Streaming",
        "description": "Read huge files line by line",
        "language": "python",
        "code": "def read_lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.strip()\n\n# process without loading whole file\ntotal = 0\nfor line in read_lines(\"data.csv\"):\n    total += len(line)\nprint(f\"Total chars: {total}\")"
      },
      {
        "title": "Coroutines & Pipeline Patterns",
        "description": "Advanced generator patterns",
        "language": "python",
        "code": "# Coroutine: generator that receives data\ndef averager():\n    \"\"\"Running average calculator.\"\"\"\n    total = 0.0\n    count = 0\n    average = None\n    while True:\n        value = yield average\n        total += value\n        count += 1\n        average = total / count\n\ncoro = averager()\nnext(coro)  # prime the coroutine\nprint(coro.send(10))   # 10.0\nprint(coro.send(20))   # 15.0\nprint(coro.send(30))   # 20.0\n\ndef fibonacci():\n    \"\"\"Infinite Fibonacci generator.\"\"\"\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\n# Take first 10 Fibonacci numbers\ndef take(n, iterable):\n    for i, item in enumerate(iterable):\n        if i >= n: break\n        yield item\n\nfib = fibonacci()\nprint(list(take(15, fib)))\n# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]\n\n# Pipeline: data flows through generator chain\ndef read_rows(source):\n    for row in source:\n        yield row.strip().split(',')\n\ndef filter_rows(rows, column, value):\n    for row in rows:\n        if row[column] == value:\n            yield row\n\ncsv_data = \"name,age\\nAlice,30\\nBob,25\\nCharlie,30\".split('\\n')\npipeline = filter_rows(read_rows(csv_data), 2, '30')\nprint(list(pipeline))  # [['Alice', '30'], ['Charlie', '30']]"
      }
    ],
    "useCases": [
      {
        "title": "Big Data Pipelines",
        "description": "Process streams without memory blow-up."
      },
      {
        "title": "Lazy Processing",
        "description": "Chained transformations evaluate on demand."
      },
      {
        "title": "Coroutines",
        "description": "yield for send/receive coordination."
      },
      {
        "title": "Custom Iterators",
        "description": "Iterate over non-container data."
      }
    ],
    "bestPractices": [
      "Prefer generators for large collections",
      "Use itertools for composition",
      "Stop generators with return or let StopIteration fire",
      "Don't reuse an exhausted generator"
    ],
    "commonErrors": [
      {
        "error": "ValueError: generator already executing",
        "fix": "Wrap in a generator factory function."
      },
      {
        "error": "List built unintentionally",
        "fix": "Use generator expressions, not comprehensions, for streams."
      }
    ]
  },
  {
    "id": "python-virtual-environment",
    "name": "Python Virtual Environments",
    "icon": "📦",
    "category": "tools",
    "difficulty": "beginner",
    "description": "Isolate dependencies with venv, pip, and requirements/poetry",
    "tags": [
      "venv",
      "pip",
      "Dependencies",
      "Env"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Virtual Environments"
      },
      {
        "type": "paragraph",
        "text": "A virtual environment is an isolated directory containing its own Python and packages, so each project has its own dependencies. Modules: venv (built-in) and virtualenv (older). Tools: pip for installs, requirements.txt or Poetry/Pipenv for lockfiles."
      },
      {
        "type": "heading",
        "text": "Why"
      },
      {
        "type": "list",
        "items": [
          "Avoid dependency conflicts across projects",
          "Reproduce environments exactly",
          "Test multiple package versions",
          "Keep global install clean"
        ]
      }
    ],
    "concepts": [
      {
        "name": "venv",
        "description": "Built-in environment manager."
      },
      {
        "name": "pip",
        "description": "Python package installer."
      },
      {
        "name": "requirements.txt",
        "description": "List of dependencies to install."
      },
      {
        "name": "Lockfiles",
        "description": "Pinned transitive versions for reproducibility."
      },
      {
        "name": "Activation",
        "description": "Switch the shell to use the env's Python."
      }
    ],
    "codeExamples": [
      {
        "title": "Create & Use",
        "description": "venv workflow",
        "language": "python",
        "code": "# Windows (PowerShell)\npython -m venv .venv\n.venv\\Scripts\\Activate.ps1\n\n# macOS/Linux\npython3 -m venv .venv\nsource .venv/bin/activate\n\n# Install packages\npip install requests numpy\npip freeze > requirements.txt\n\n# From requirements\npip install -r requirements.txt\n\n# Exit\n# deactivate"
      },
      {
        "title": "Freeze & File",
        "description": "Reproducible deps",
        "language": "python",
        "code": "# Tested with Python 3.11.9 in a clean venv\npip install numpy==1.26.4 pandas==2.2.1\npip freeze > requirements.txt\n\n# requirements.txt now pins transitive deps too\n# Then reproduce anywhere:\npython -m venv .venv\npip install -r requirements.txt"
      }
    ],
    "useCases": [
      {
        "title": "Multi-project isolation",
        "description": "Different packages per project."
      },
      {
        "title": "CI/CD",
        "description": "Clean reproducible builds."
      },
      {
        "title": "Deployments",
        "description": "Same-same installs in prod."
      },
      {
        "title": "Project Isolation",
        "description": "Separate dependencies per project to avoid conflicts"
      }
    ],
    "bestPractices": [
      "Create a venv per project",
      "Commit requirements.txt / lockfiles",
      "Never commit the .venv folder (add to .gitignore)",
      "Use python -m pip to keep pip in sync"
    ],
    "commonErrors": [
      {
        "error": "pip not found",
        "fix": "Activate the environment or use python -m pip."
      },
      {
        "error": "Wrong Python used",
        "fix": "Check which python and which pip paths."
      },
      {
        "error": "duplicate EnvironmentError",
        "fix": "Delete and recreate the venv."
      }
    ]
  },
  {
    "id": "python-lambda",
    "name": "Python Lambda Functions",
    "icon": "λ",
    "category": "basics",
    "difficulty": "beginner",
    "description": "Anonymous functions with lambda: map, filter, reduce, and sorting",
    "tags": [
      "Lambda",
      "Functional",
      "map",
      "filter"
    ],
    "prerequisites": [
      "Python basics"
    ],
    "theory": [
      {
        "type": "heading",
        "text": "Lambda Functions"
      },
      {
        "type": "paragraph",
        "text": "A lambda is an anonymous one-expression function: lambda args: expression. It is useful where a small function is needed in one place (sorting keys, map/filter). Avoid using lambdas for complex logic that deserves a def."
      }
    ],
    "concepts": [
      {
        "name": "Lambda Syntax",
        "description": "lambda x: expression"
      },
      {
        "name": "map()",
        "description": "Apply function to each item."
      },
      {
        "name": "filter()",
        "description": "Keep items where predicate is True."
      },
      {
        "name": "reduce()",
        "description": "Accumulate items (functools)."
      },
      {
        "name": "key= in sort",
        "description": "Sort using a computed key."
      }
    ],
    "codeExamples": [
      {
        "title": "sort with key",
        "description": "Sorting with lambda",
        "language": "python",
        "code": "people = [(\"Alice\", 30), (\"Bob\", 25), (\"Carol\", 35)]\npeoples_sorted = sorted(people, key=lambda p: p[1])\nprint(peoples_sorted)  # by age\n\nwords = [\"apple\", \"kiwi\", \"strawberry\"]\nshortest_first = sorted(words, key=lambda w: len(w))\nprint(shortest_first)"
      },
      {
        "title": "map and filter",
        "description": "Functional style",
        "language": "python",
        "code": "nums = [1, 2, 3, 4, 5, 6]\n\ndoubled = list(map(lambda x: x * 2, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(doubled)  # [2,4,6,8,10,12]\nprint(evens)    # [2,4,6]\n\n# compare to comprehension\nnested = [x * 2 for x in nums if x % 2 == 0]"
      },
      {
        "title": "reduce",
        "description": "Accumulation with functools.reduce",
        "language": "python",
        "code": "from functools import reduce\n\nfactorial = lambda n: reduce(lambda a, b: a * b, range(1, n + 1), 1)\nprint(factorial(5))  # 120\n\ntotal = reduce(lambda acc, x: acc + x, [1, 2, 3, 4])\nprint(total)  # 10"
      },
      {
        "title": "Higher-Order Functions",
        "description": "Functions as first-class citizens",
        "language": "python",
        "code": "from functools import reduce, partial\n\n# Functions as arguments\noperations = {\n    'sum': lambda a, b: a + b,\n    'mul': lambda a, b: a * b,\n    'pow': lambda a, b: a ** b,\n}\n\nprint(operations['sum'](3, 4))   # 7\nprint(operations['pow'](2, 10))  # 1024\n\n# Partial application: fix some arguments\npower_of_2 = partial(operations['pow'], b=2)\nprint(power_of_2(10))  # 1024\n\n# Decorate with lambda\ndef memoize(func):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = func(*args)\n        return cache[args]\n    return wrapper\n\nfactorial = memoize(lambda n: 1 if n <= 1 else n * factorial(n-1))\nprint(factorial(20))  # 2432902008176640000\n\n# Chaining with reduce\npipeline = [\n    lambda x: x * 2,\n    lambda x: x + 10,\n    lambda x: x ** 2,\n]\nresult = reduce(lambda val, fn: fn(val), pipeline, 5)\nprint(f\"((5*2)+10)^2 = {result}\")  # 400"
      }
    ],
    "useCases": [
      {
        "title": "Sorting keys",
        "description": "sort by attribute or computed value."
      },
      {
        "title": "Simple transforms",
        "description": "Small mapping/filtering callbacks."
      },
      {
        "title": "Event handlers",
        "description": "Tiny callback functions."
      }
    ],
    "bestPractices": [
      "Use lambda for simple one-liners only",
      "Prefer list comprehensions for readability",
      "Use operator module functions instead of ad-hoc lambdas",
      "Name complex logic with def"
    ],
    "commonErrors": [
      {
        "error": "lambda can't contain statements",
        "fix": "Use a def for statements or complex expression."
      },
      {
        "error": "Wrong scope capture",
        "fix": "Bind loop variables with default args (x=x)."
      }
    ]
  }
]
