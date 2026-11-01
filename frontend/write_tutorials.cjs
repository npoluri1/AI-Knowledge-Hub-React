const fs = require('fs');
const tutorials = [
// ===== BATCH 1: Basics (1-5) =====
{
  id:'python', name:'Python', icon:'🐍', category:'basics', difficulty:'beginner',
  description:'Core Python: syntax, data types, control flow, functions, OOP & exceptions',
  tags:['Python','Basics','Programming'], prerequisites:['No prior experience'],
  theory:[
    {type:'heading',text:'What is Python?'},
    {type:'paragraph',text:'Python is a high-level, interpreted, general-purpose programming language created by Guido van Rossum in 1991. It emphasizes readability through significant indentation and is one of the most popular languages for web development, data science, AI, automation, and scripting. Python 3 is the current standard.'},
    {type:'heading',text:'Core Features'},
    {type:'list',items:['Interpreted & dynamically typed','Object-oriented with classes and inheritance','Rich standard library (200+ modules)','Automatic memory management (garbage collection)','Cross-platform (Windows, macOS, Linux)','Vibrant ecosystem with 500,000+ packages on PyPI']},
    {type:'paragraph',text:'Python excels across domains: web (Django, Flask), data science (pandas, NumPy), ML (scikit-learn, TensorFlow), automation, and DevOps. pip installs packages, venv isolates dependencies.'}
  ],
  concepts:[
    {name:'Dynamic Typing',description:'Variables infer types at runtime, enabling rapid prototyping.'},
    {name:'Indentation Blocks',description:'Code blocks delimited by 4-space indentation, not braces.'},
    {name:'Everything is an Object',description:'Functions, classes, and types are first-class objects.'},
    {name:'Mutable vs Immutable',description:'Lists/dicts/sets are mutable; strings/tuples are immutable.'},
    {name:'Exception Handling',description:'try/except/finally catches runtime errors gracefully.'},
    {name:'Garbage Collection',description:'Reference counting plus cyclic collector for memory management.'}
  ],
  codeExamples:[
    {title:'Variables & Types',description:'Dynamic typing and basic operations',language:'python',code:`# Variables and basic types\nname = \"Ada Lovelace\"       # str\nage = 36                    # int\npi = 3.14159                # float\nis_programmer = True        # bool\n\nprint(f\"{name} is {age} years old\")\nprint(type(pi))             # <class 'float'>\n\n# Arithmetic\nprint(7 / 2)   # 3.5\nprint(7 // 2)  # 3\nprint(2 ** 10) # 1024`},
    {title:'Control Flow',description:'Conditionals and loops',language:'python',code:`# Conditionals\nscore = 85\nif score >= 90: grade = \"A\"\nelif score >= 80: grade = \"B\"\nelse: grade = \"C\"\nprint(f\"Grade: {grade}\")\n\n# for loop\nfor i in range(1, 6):\n    print(i, end=\" \")\nprint()\n\n# List comprehension\nsquares = [n*n for n in range(10) if n % 2 == 0]\nprint(squares)  # [0, 4, 16, 36, 64]`},
    {title:'Functions',description:'Defining functions with default args',language:'python',code:`def calculate_bmi(weight_kg, height_m):\n    \"\"\"Return Body Mass Index.\"\"\"\n    if height_m <= 0:\n        raise ValueError(\"Height must be positive\")\n    return weight_kg / (height_m ** 2)\n\ndef greet(name, greeting=\"Hello\", punctuation=\"!\"):\n    return f\"{greeting}, {name}{punctuation}\"\n\nprint(greet(\"Sam\"))\nprint(greet(\"Sam\", greeting=\"Hi\", punctuation=\".\"))\n\n# f-strings\nbmi = calculate_bmi(70, 1.75)\nprint(f\"BMI is {bmi:.2f}\")`},
    {title:'OOP Basics',description:'Classes and objects',language:'python',code:`class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        self._balance += amount\n        return self._balance\n\n    def __str__(self):\n        return f\"BankAccount({self.owner}: {self._balance})\"\n\nacc = BankAccount(\"Alice\", 1000)\nacc.deposit(500)\nprint(acc)`},
    {title:'File I/O & Exceptions',description:'Reading files with error handling',language:'python',code:`# Writing\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"Line 1: Hello world\\\\n\")\n    f.write(\"Line 2: Python is fun\\\\n\")\n\n# Reading\nwith open(\"notes.txt\", \"r\") as f:\n    for line in f:\n        print(line.strip())\n\n# Exception handling\ntry:\n    number = int(\"not-a-number\")\nexcept ValueError as e:\n    print(f\"Caught error: {e}\")\nfinally:\n    print(\"Always executes\")`}
  ],
  useCases:[
    {title:'Web Development',description:'Django and Flask power high-traffic sites like Instagram.'},
    {title:'Data Science & Analytics',description:'pandas, NumPy, and Jupyter are the industry standard for EDA.'},
    {title:'Automation & Scripting',description:'Automate backups, file processing, and deployment pipelines.'},
    {title:'AI & Machine Learning',description:'scikit-learn, TensorFlow, and PyTorch make Python the de facto ML language.'}
  ],
  bestPractices:['Follow PEP 8 and use 4-space indentation','Use venv for isolated environments','Prefer f-strings for readability','Write docstrings for public functions','Use context managers for resources'],
  commonErrors:[
    {error:'IndentationError: unexpected indent',fix:'Configure editor to use spaces consistently; never mix tabs/spaces.'},
    {error:'NameError: name x is not defined',fix:'Check variable scope and spelling before using it.'},
    {error:'TypeError: unsupported operand type(s)',fix:'Cast explicitly with str() / int() when combining types.'}
  ]
},
{
  id:'oop-python', name:'OOP Python', icon:'🏗️', category:'basics', difficulty:'beginner',
  description:'Object-oriented programming: classes, inheritance, polymorphism, and Python idioms',
  tags:['OOP','Classes','Inheritance','Polymorphism'], prerequisites:['Python basics'],
  theory:[
    {type:'heading',text:'The Object-Oriented Paradigm'},
    {type:'paragraph',text:'OOP organizes code around objects that bundle data (attributes) with procedures (methods). This mirrors real-world entities directly, making large codebases more maintainable. The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.'},
    {type:'heading',text:'Python OOP Idioms'},
    {type:'list',items:['Properties for attribute control','Magic/dunder methods for operator overloading','Abstract base classes for interfaces','Multiple inheritance with C3 MRO','dataclasses for clean domain objects']},
    {type:'paragraph',text:'Python follows a \"consenting adults\" philosophy: underscores signal privacy but do not enforce it. Composition is often preferred over deep inheritance hierarchies.'}
  ],
  concepts:[
    {name:'Class vs Instance',description:'A class is a blueprint; instances hold per-object state.'},
    {name:'__init__',description:'Constructor method that runs on instantiation.'},
    {name:'self',description:'First argument of instance methods, referencing the object.'},
    {name:'@property',description:'Exposes methods as attribute-style access.'},
    {name:'Dunder Methods',description:'__str__, __eq__, __len__ customize built-in behavior.'},
    {name:'ABC',description:'abc.ABC defines interfaces subclasses must implement.'}
  ],
  codeExamples:[
    {title:'Properties with Validation',description:'Computed attributes and setters',language:'python',code:`class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"Below absolute zero\")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9/5 + 32\n\nt = Temperature(25)\nprint(t.fahrenheit)  # 77.0\nt.celsius = 30`},
    {title:'Inheritance & Override',description:'Extending base classes',language:'python',code:`class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    def describe(self):\n        return f\"A generic Vehicle\"\n\nclass Car(Vehicle):\n    def __init__(self, brand, doors=4):\n        super().__init__(brand)\n        self.doors = doors\n    def describe(self):\n        return f\"A {self.doors}-door {self.brand}\"\n\nvehicles = [Car(\"Toyota\"), Vehicle(\"Generic\")]\nfor v in vehicles:\n    print(v.describe())`},
    {title:'Magic Methods',description:'Operator overloading',language:'python',code:`class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __add__(self, other):\n        return Vector(self.x+other.x, self.y+other.y)\n    def __eq__(self, other):\n        return self.x==other.x and self.y==other.y\n    def __str__(self):\n        return f\"({self.x}, {self.y})\"\n\nprint(Vector(1,2) + Vector(3,4))  # (4, 6)\nprint(Vector(1,2) == Vector(1,2))   # True`},
    {title:'Abstract Classes',description:'Enforcing contracts',language:'python',code:`from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\n\nclass Rectangle(Shape):\n    def __init__(self, w, h):\n        self.w, self.h = w, h\n    def area(self):\n        return self.w * self.h\n\n# Shape() -> TypeError: can't instantiate abstract class\nprint(Rectangle(4, 5).area())  # 20`}
  ],
  useCases:[
    {title:'Domain Modeling',description:'Model business entities (users, orders) with classes.'},
    {title:'Framework Design',description:'Django models and UI toolkits rely on inheritance and metaclasses.'},
    {title:'Plugin Architecture',description:'ABC defines contracts; plugins implement them.'}
  ],
  bestPractices:['Prefer composition over inheritance','Keep hierarchies shallow (2-3 levels)','Use @property instead of get_/set_ methods','Use dataclasses for simple domain objects'],
  commonErrors:[
    {error:'TypeError: __init__() missing argument',fix:'Forgot required arg or self in method signature.'},
    {error:'AttributeError: no attribute',fix:'Check spelling and ensure attribute is set in __init__.'},
    {error:'RecursionError in __str__',fix:'Avoid self-referencing within dunder methods.'}
  ]
},
{
  id:'python-data-structure', name:'Python Data Structure', icon:'📦', category:'basics', difficulty:'beginner',
  description:'Built-in data structures, time complexity, and choosing the right one',
  tags:['Data Structures','Lists','Dicts','Sets'], prerequisites:['Python basics'],
  theory:[
    {type:'heading',text:'Built-in Data Structures'},
    {type:'paragraph',text:'Python provides four fundamental structures: lists (mutable, ordered), tuples (immutable, ordered), dicts (key-value mapping, O(1) lookup), and sets (unique items, O(1) membership). Mastering time complexity of each operation is essential for efficient code.'},
    {type:'heading',text:'Complexity Guide'},
    {type:'list',items:['List append/pop O(1), lookup O(n), index O(1)','Dict/Set lookup O(1) average via hashing','Tuple is immutable, memory-efficient','deque supports O(1) on both ends','collections module: Counter, defaultdict, namedtuple']},
    {type:'paragraph',text:'Use a list for ordered sequences with duplicates, tuple for immutable records, set for deduplication/membership, dict for key-value mapping.'}
  ],
  concepts:[
    {name:'List',description:'Mutable sequence with sort, slicing, comprehensions.'},
    {name:'Tuple',description:'Immutable, hashable, safe as dict keys.'},
    {name:'Dict',description:'O(1) key-value lookup, insertion-ordered.'},
    {name:'Set',description:'Unordered unique items, fast membership.'},
    {name:'deque',description:'O(1) append/pop on both ends.'},
    {name:'Counter',description:'Purpose-built counting from iterables.'}
  ],
  codeExamples:[
    {title:'Lists & Comprehensions',description:'Core operations',language:'python',code:`nums = [3, 1, 4, 1, 5, 9]\nnums.sort()\nprint(nums)  # [1, 1, 3, 4, 5, 9]\nprint(nums[2:5])   # [3, 4, 5]\nevens = [n for n in range(20) if n%2==0]\nsquares = {x: x**2 for x in range(5)}`},
    {title:'Dictionaries',description:'Key-value operations',language:'python',code:`from collections import Counter, defaultdict\n\nwords = \"the cat sat on the mat the cat\".split()\ncounts = Counter(words)\nprint(counts.most_common(2))  # [('the', 3), ('cat', 2)]\n\ngroups = defaultdict(list)\nfor i in range(10): groups[i%3].append(i)\nprint(groups[0])  # [0, 3, 6, 9]`},
    {title:'Sets',description:'Deduplication and operations',language:'python',code:`a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a | b)   # union {1,2,3,4,5,6}\nprint(a & b)   # intersection {3, 4}\nprint(a - b)   # difference {1, 2}\n\n# deduplicate\nnums = [1, 2, 2, 3, 3, 3]\nunique = list(set(nums))\nprint(unique)  # [1, 2, 3]`},
    {title:'deque & namedtuple',description:'Specialized containers',language:'python',code:`from collections import deque, namedtuple\n\nq = deque(maxlen=3)\nq.append(1); q.append(2); q.append(3)\nq.append(4)\nprint(q)  # deque([2, 3, 4])\n\nPoint = namedtuple(\"Point\", \"x y\")\np = Point(3, 4)\nprint(p.x, p.y, p[0])  # 3 4 3`}
  ],
  useCases:[
    {title:'Data Pipelines',description:'Lists and generators stream large analytics datasets.'},
    {title:'In-Memory Caching',description:'Dicts provide O(1) lookup for memoization.'},
    {title:'Deduplication',description:'Sets remove duplicates from imports/APIs.'}
  ],
  bestPractices:['Dict lookup beats linear list search','Use tuples for immutable records','Use .get() and defaultdict to avoid KeyError','Copy lists with list.copy() to avoid aliasing'],
  commonErrors:[
    {error:'TypeError: unhashable type: list',fix:'Cannot put a list in a set/dict key — use a tuple.'},
    {error:'RuntimeError: dict changed size during iteration',fix:'Iterate over a copy: for k in list(d.keys()).'},
    {error:'Shallow copy surprises',fix:'list.copy() is shallow; use copy.deepcopy() for nested.'}
  ]
},
{
  id:'python-design-patterns', name:'Python Design Patterns', icon:'🏗️', category:'basics', difficulty:'intermediate',
  description:'Gang of Four patterns in idiomatic Python: Singleton, Factory, Observer, Strategy',
  tags:['Design Patterns','Architecture','SOLID'], prerequisites:['Python OOP'],
  theory:[
    {type:'heading',text:'Why Design Patterns?'},
    {type:'paragraph',text:'Design patterns are proven solutions to recurring software design problems. They provide a shared vocabulary and help avoid reinventing the wheel. Python\'s dynamic nature makes some patterns implicit — first-class functions make Strategy trivial.'},
    {type:'heading',text:'Pattern Categories'},
    {type:'list',items:['Creational: Singleton, Factory, Builder','Structural: Adapter, Decorator, Facade','Behavioral: Observer, Strategy, Command, State']}
  ],
  concepts:[
    {name:'Singleton',description:'Ensures exactly one instance exists globally.'},
    {name:'Factory Method',description:'Defines interface for creating objects, letting subclasses decide.'},
    {name:'Adapter',description:'Converts one interface to another.'},
    {name:'Decorator',description:'Wraps behavior without modifying the original.'},
    {name:'Observer',description:'One-to-many dependency, notifications on change.'},
    {name:'Strategy',description:'Encapsulates interchangeable algorithms behind a common interface.'}
  ],
  codeExamples:[
    {title:'Singleton via Metaclass',description:'Thread-safe single instance',language:'python',code:`import threading\n\nclass SingletonMeta(type):\n    _instances = {}\n    _lock = threading.Lock()\n    def __call__(cls, *args, **kwargs):\n        with cls._lock:\n            if cls not in cls._instances:\n                cls._instances[cls] = super().__call__(*args, **kwargs)\n        return cls._instances[cls]\n\nclass Config(metaclass=SingletonMeta):\n    def __init__(self): self.theme = \"dark\"\n\nprint(Config() is Config())  # True`},
    {title:'Observer Pattern',description:'Publish-subscribe events',language:'python',code:`class Subject:\n    def __init__(self): self._observers = []\n    def attach(self, obs): self._observers.append(obs)\n    def notify(self, data):\n        for obs in self._observers: obs.update(data)\n\nclass Logger:\n    def update(self, data): print(f\"[LOG] {data}\")\n\nclass Alert:\n    def update(self, data):\n        if data.get(\"priority\")==\"high\":\n            print(f\"[ALERT] {data['message']}\")\n\ns = Subject()\ns.attach(Logger()); s.attach(Alert())\ns.notify({\"priority\":\"high\", \"message\":\"Server down\"})`},
    {title:'Strategy as Functions',description:'Pythonic strategy pattern',language:'python',code:`def bubble_sort(data): return sorted(data)\ndef radix_sort(data): return sorted(data)  # simplified\n\nclass Sorter:\n    def __init__(self, strategy=bubble_sort):\n        self._strategy = strategy\n    def sort_data(self, data):\n        return self._strategy(data)\n\ns = Sorter(radix_sort)\nprint(s.sort_data([3, 1, 2]))  # [1, 2, 3]`}
  ],
  useCases:[
    {title:'Config Management',description:'Singleton for shared settings.'},
    {title:'Plugin Systems',description:'Factory loads plugins dynamically.'},
    {title:'Event-driven Architecture',description:'Observer powers event buses and UI events.'}
  ],
  bestPractices:['Prefer idiomatic Python over rigid boilerplate','Only use patterns that simplify code','Favor composition and interfaces over deep inheritance'],
  commonErrors:[
    {error:'Pattern over-engineering',fix:'Apply patterns only where they remove complexity.'},
    {error:'Singleton hiding global state',fix:'Consider dependency injection instead.'}
  ]
},
{
  id:'concurrency-python', name:'Concurrency with Python', icon:'⚡', category:'basics', difficulty:'advanced',
  description:'Threading, multiprocessing, asyncio, and the GIL',
  tags:['Concurrency','Threading','Multiprocessing','asyncio'], prerequisites:['Strong Python'],
  theory:[
    {type:'heading',text:'The GIL'},
    {type:'paragraph',text:'CPython\'s Global Interpreter Lock serializes bytecode execution, making true parallel Python threads impossible. Threads release the GIL during I/O, so thread pools are ideal for I/O-bound work. CPU-bound tasks need multiprocessing.'},
    {type:'heading',text:'Three Models'},
    {type:'list',items:['Threads (ThreadPoolExecutor): I/O-bound tasks','Processes (ProcessPoolExecutor): CPU-bound tasks','Asyncio: cooperative concurrency for high-connection I/O']},
    {type:'paragraph',text:'Profile first to determine I/O vs CPU bound. Always guard shared state with locks.'}
  ],
  concepts:[
    {name:'GIL',description:'Serializes Python bytecode execution across threads.'},
    {name:'Race Condition',description:'Unpredictable outcome from unsynchronized shared state.'},
    {name:'Lock',description:'Mutex for mutually exclusive access.'},
    {name:'ThreadPoolExecutor',description:'Manages thread pool for I/O-bound work.'},
    {name:'ProcessPoolExecutor',description:'Parallelism across CPU cores.'},
    {name:'async/await',description:'Cooperative multitasking on a single thread.'}
  ],
  codeExamples:[
    {title:'ThreadPoolExecutor',description:'Concurrent I/O',language:'python',code:`from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef fetch(url):\n    time.sleep(1)\n    return f\"Fetched {url}\"\n\nurls = [f\"http://site.com/{i}\" for i in range(10)]\nt0 = time.time()\nwith ThreadPoolExecutor(max_workers=5) as pool:\n    results = list(pool.map(fetch, urls))\nprint(f\"Threads took {time.time()-t0:.2f}s\")  # ~2s not 10s`},
    {title:'ProcessPoolExecutor',description:'CPU parallelism',language:'python',code:`from concurrent.futures import ProcessPoolExecutor\nimport math\n\ndef heavy(n): return sum(math.sqrt(i) for i in range(n))\n\nnums = [1_000_000 + i*500_000 for i in range(6)]\nwith ProcessPoolExecutor(max_workers=4) as pool:\n    results = list(pool.map(heavy, nums))\nprint(f\"Computed {len(results)} results in parallel\")`},
    {title:'Asyncio',description:'Cooperative concurrency',language:'python',code:`import asyncio\n\nasync def fetch(sid, url):\n    await asyncio.sleep(1)\n    return f\"session {sid} got {url}\"\n\nasync def main():\n    tasks = [fetch(i, \"http://ex.com\") for i in range(20)]\n    return await asyncio.gather(*tasks)\n\nresults = asyncio.run(main())\nprint(f\"{len(results)} requests concurrently\")`},
    {title:'Thread Safety with Locks',description:'Protecting shared state',language:'python',code:`import threading\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    for _ in range(1000):\n        with lock: counter += 1\n\nthreads = [threading.Thread(target=increment) for _ in range(10)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(counter)  # 10000`}
  ],
  useCases:[
    {title:'Web Scraping at Scale',description:'Crawl hundreds of URLs concurrently.'},
    {title:'API Fan-out',description:'Call multiple services in parallel.'},
    {title:'ML Data Prep',description:'Process data chunks with ProcessPoolExecutor.'}
  ],
  bestPractices:['Profile first to determine I/O vs CPU bound','Prefer concurrent.futures over raw threading','Always use locks for shared mutable state','Keep critical sections short in asyncio'],
  commonErrors:[
    {error:'Deadlock',fix:'Two threads wait on each other\'s locks. Use with lock: and consistent ordering.'},
    {error:'Data corruption',fix:'Multiple threads mutating shared state. Add a lock.'},
    {error:'RuntimeError on Windows multiprocessing',fix:'Guard with if __name__ == "__main__".'}
  ]
},
// ===== END BATCH 1 =====
];
fs.writeFileSync('src/data/pythonTutorialsData.js', 'export const PYTHON_TUTORIALS = ' + JSON.stringify(tutorials, null, 2) + '\\n');
console.log('Batch 1 written: ' + tutorials.length + ' tutorials');
