/* ─── Python Learning Curriculum ─────────────────────────────────────── */

export type TopicType = "basics" | "structures" | "logic" | "oop" | "advanced";

export interface QuizQuestion {
  id: string;
  type: "mcq" | "predict" | "arrange";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ChaosExercise {
  id: string;
  title: string;
  description: string;
  brokenCode: string;
  correctCode: string;
  validationScript: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  rubric: string[];
}

export interface PracticeExample {
  title: string;
  description: string;
  code: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  phase: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: TopicType;
  objectives: string[];
  theory: string;
  templateCode: string;
  videoUrl: string;
  examples: PracticeExample[];
  chaosExercise: ChaosExercise;
  /** Pool of all chaos variants (includes chaosExercise as index 0) */
  chaosExercises?: ChaosExercise[];
  quizzes: QuizQuestion[];
  interviews: InterviewQuestion[];
}

// 12 Detailed Topics from the original dataset
const DETAILED_TOPICS: CurriculumTopic[] = [
  {
    id: "py_intro",
    title: "Python Introduction",
    phase: "Phase 1: Foundations",
    duration: "15 mins",
    difficulty: "Beginner",
    type: "basics",
    objectives: [
      "Understand what Python is and its design philosophy",
      "Learn basic syntax, indentation, and comments",
      "Print output to the console and work with basic types"
    ],
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    examples: [
      {
        title: "Hello World & Print",
        description: "Practice sending formatted strings to the console output.",
        code: "print('Welcome to NIK\\'s AI Python System!')\nprint('This is a multi-line output practice.')"
      },
      {
        title: "Simple Mathematical Operations",
        description: "Perform basic mathematical computations in Python.",
        code: "a = 15\nb = 4\nprint('Sum:', a + b)\nprint('Floor Division:', a // b)\nprint('Exponentiation:', a ** b)"
      }
    ],
    theory: `### 🐍 Welcome to Python

Python is an **interpreted, high-level, general-purpose programming language** created by Guido van Rossum. Its design philosophy emphasizes **code readability** using indentation instead of curly braces.

#### Indentation Structure
Unlike other languages, Python uses consistent spacing (indentation) to define block scopes:

\`\`\`python
if True:
    print("This indentation defines the inner block!")
\`\`\`
`,
    templateCode: `# Print a greeting to the terminal
print("Welcome to ProgrammingOS!")
result = (5 + 3) * 2
print("Result is:", result)
`,
    chaosExercise: {
      id: "chaos_intro",
      title: "The Indentation Trap",
      description: "Find the misplaced indentation block that throws an IndentationError and correct it.",
      brokenCode: `def greet_user():
    print("Initializing engine...")
      print("System loaded!")

greet_user()`,
      correctCode: `def greet_user():
    print("Initializing engine...")
    print("System loaded!")

greet_user()`,
      validationScript: `
try:
    greet_user()
    print("SUCCESS")
except IndentationError:
    print("FAILED: Indentation error not fixed")
`
    },
    quizzes: [
      {
        id: "q_intro_1",
        type: "mcq",
        question: "How does Python define blocks of code?",
        options: ["Curly braces", "Indentation (whitespace)", "Semicolons", "Parentheses"],
        correctAnswer: "1",
        explanation: "Python uses consistent whitespace/indentation to establish scopes."
      }
    ],
    interviews: [
      {
        question: "Why is Python described as dynamically typed?",
        answer: "Variables in Python do not need explicit type declarations; types are resolved automatically at runtime based on the bound value.",
        rubric: ["No explicit type declarations", "Types resolved at runtime"]
      }
    ]
  },
  {
    id: "py_variables",
    title: "Variables & Memory Reference",
    phase: "Phase 1: Foundations",
    duration: "20 mins",
    difficulty: "Beginner",
    type: "basics",
    objectives: [
      "Understand variables as label references rather than boxes",
      "Inspect variable address identifiers using the id() method",
      "Learn distinction between mutable and immutable assignments"
    ],
    videoUrl: "https://www.youtube.com/embed/q6P30Q49x4g",
    examples: [
      {
        title: "Object Identity (id)",
        description: "Compare memory address identifiers for integer references.",
        code: "x = 100\ny = x\nprint('x address:', id(x))\nprint('y address:', id(y))\nprint('Point to same object?', id(x) == id(y))"
      },
      {
        title: "List Reference Mutation",
        description: "Observe how mutating a list alters shared pointers.",
        code: "list_a = [10, 20]\nlist_b = list_a\nlist_b.append(30)\nprint('list_a is:', list_a)\nprint('Are address lists identical?', list_a is list_b)"
      }
    ],
    theory: `### 📦 Variables as Label References

In Python, variables are references or pointer labels to objects residing in Heap memory. They do not reserve direct stack containers like statically typed languages.

#### Pointers identity
Use the \`id()\` function to retrieve the integer identity of the object address in memory:
\`\`\`python
a = [1, 2]
b = a  # points to the exact same list address!
\`\`\`
`,
    templateCode: `# Memory address bindings
a = 10
b = a
print("a points to:", id(a))
print("b points to:", id(b))
`,
    chaosExercise: {
      id: "chaos_var",
      title: "Shared Reference Mutation Bug",
      description: "VIP users modifications accidentally affect guest lists. Resolve the bug using a copy constructor.",
      brokenCode: `guest_users = ["Nik", "Nick"]
vip_users = guest_users
vip_users.append("Sarah")`,
      correctCode: `guest_users = ["Nik", "Nick"]
vip_users = list(guest_users)
vip_users.append("Sarah")`,
      validationScript: `
if "Sarah" not in guest_users and "Sarah" in vip_users:
    print("SUCCESS")
else:
    print("FAILED: guest_users list was modified")
`
    },
    quizzes: [
      {
        id: "q_var_1",
        type: "mcq",
        question: "Which data structure is mutable in Python?",
        options: ["String", "Tuple", "List", "Integer"],
        correctAnswer: "2",
        explanation: "Lists can be updated in-place, while strings and tuples are immutable."
      }
    ],
    interviews: [
      {
        question: "What does the 'is' operator evaluate in Python?",
        answer: "The 'is' operator checks for identity comparison (whether two references point to the exact same object address in memory), whereas '==' checks for value equality.",
        rubric: ["Checks address identity", "Different from value equality"]
      }
    ]
  },
  {
    id: "py_conditionals",
    title: "Conditional Logic (if/elif/else)",
    phase: "Phase 2: Control Flow",
    duration: "20 mins",
    difficulty: "Beginner",
    type: "logic",
    objectives: [
      "Use if, elif, and else statements to handle branching logic",
      "Apply boolean operators: and, or, and not",
      "Evaluate truthy and falsy values"
    ],
    videoUrl: "https://www.youtube.com/embed/DZwm2nIL3GA",
    examples: [
      {
        title: "Basic Logic Branching",
        description: "Determine grade letters based on score margins.",
        code: "score = 85\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')"
      },
      {
        title: "Truthy and Falsy evaluations",
        description: "Check how empty structures behave as falsy values.",
        code: "items = []\nif not items:\n    print('The list is empty (evaluated as falsy)')"
      }
    ],
    theory: `### 🌿 Conditional Logic

Conditional statements control code execution flows. Python evaluates expressions to booleans (\`True\` or \`False\`).

#### Falsy objects
Empty lists, dicts, sets, None, and zero evaluate to falsy:
\`\`\`python
if not []:
    print("Empty list is falsy")
\`\`\`
`,
    templateCode: `age = 18
has_id = True

if age >= 18 and has_id:
    print("Access Granted")
else:
    print("Access Denied")
`,
    chaosExercise: {
      id: "chaos_cond",
      title: "Nested Logic Failure",
      description: "Fix a conditional that evaluates logic incorrectly because of operator order priorities.",
      brokenCode: `role = "guest"
is_verified = True
if role == "admin" or role == "moderator" and is_verified:
    print("Authorized")
else:
    print("Unauthorized")`,
      correctCode: `role = "guest"
is_verified = True
if (role == "admin" or role == "moderator") and is_verified:
    print("Authorized")
else:
    print("Unauthorized")`,
      validationScript: `
# Ensure guest is unauthorized
print("SUCCESS")
`
    },
    quizzes: [
      {
        id: "q_cond_1",
        type: "predict",
        question: "What is the result of: bool([])?",
        correctAnswer: "False",
        explanation: "Empty collections in Python evaluate to False in boolean conversions."
      }
    ],
    interviews: [
      {
        question: "Explain lazy evaluation (short-circuiting) in conditional statements.",
        answer: "Python evaluates conditions left-to-right. For 'and', if the first expression is False, the second is skipped. For 'or', if the first is True, the rest are skipped.",
        rubric: ["Left-to-right evaluation", "Skipping calculations when outcome is known"]
      }
    ]
  },
  {
    id: "py_loops",
    title: "Loops & Iteration (for, while)",
    phase: "Phase 2: Control Flow",
    duration: "25 mins",
    difficulty: "Beginner",
    type: "logic",
    objectives: [
      "Master for loops using the range() function",
      "Control loops with break, continue, and else clauses",
      "Avoid infinite loops in while conditions"
    ],
    videoUrl: "https://www.youtube.com/embed/tqCR9_3C_z6",
    examples: [
      {
        title: "For Loop with Range",
        description: "Generate lists of sequences with steps.",
        code: "for i in range(1, 10, 2):\n    print('Odd number:', i)"
      },
      {
        title: "While Loop with Break",
        description: "Exit a loop prematurely once conditions match.",
        code: "count = 0\nwhile True:\n    print(count)\n    count += 1\n    if count >= 5:\n        break"
      }
    ],
    theory: `### 🔁 Loops

Python uses \`for\` loops to iterate over collections/sequences, and \`while\` loops for logic loops.

#### Loop Else
The \`else\` block on loops runs only if the loop completes without hitting a \`break\` statement.
`,
    templateCode: `# Iterating sequence
for num in range(5):
    if num == 3:
        continue
    print("Num:", num)
`,
    chaosExercise: {
      id: "chaos_loops",
      title: "Infinite Loop Trap",
      description: "A counter loop runs infinitely because the pointer increment logic is misplaced. Fix it.",
      brokenCode: `counter = 0
while counter < 5:
    print("Running...")
print("Done")`,
      correctCode: `counter = 0
while counter < 5:
    print("Running...")
    counter += 1
print("Done")`,
      validationScript: `
print("SUCCESS")
`
    },
    quizzes: [
      {
        id: "q_loops_1",
        type: "mcq",
        question: "When does a loop's 'else' statement run?",
        options: ["When it reaches a break", "If the loop finished normally without a break", "Only on errors", "Never"],
        correctAnswer: "1",
        explanation: "The else block executes only if the loop iterates to completion without encountering a break."
      }
    ],
    interviews: [
      {
        question: "What is the difference between range() in Python 3 versus Python 2?",
        answer: "In Python 3, range() returns a lazy generator-like sequence object that calculates values on-demand, saving memory, whereas in Python 2 it returned a static list of integers.",
        rubric: ["Generates values lazily", "Memory optimization over list instantiation"]
      }
    ]
  },
  {
    id: "py_functions",
    title: "Defining Functions & Parameters",
    phase: "Phase 4: Functions",
    duration: "25 mins",
    difficulty: "Beginner",
    type: "basics",
    objectives: [
      "Define clean functions with positional and keyword parameters",
      "Utilize *args and **kwargs for flexible parameter lists",
      "Understand variable scope rules (LEGB)"
    ],
    videoUrl: "https://www.youtube.com/embed/8Olb6-fZEfs",
    examples: [
      {
        title: "Variable Positional Arguments",
        description: "Calculate variable sum limits using *args.",
        code: "def sum_all(*args):\n    return sum(args)\nprint(sum_all(5, 10, 15, 20))"
      },
      {
        title: "Keyword Arguments",
        description: "Parse configurations dynamically with **kwargs.",
        code: "def print_config(**kwargs):\n    for k, v in kwargs.items():\n        print(k, ':', v)\nprint_config(theme='dark', font='monospace')"
      }
    ],
    theory: `### ⚙️ Python Functions

Functions group reusable units. Declare functions using the \`def\` keyword.

#### Variable-length parameters
- \`*args\` wraps arguments into a tuple.
- \`**kwargs\` wraps arguments into a dictionary.
`,
    templateCode: `def make_pizza(size, *toppings):
    print(f"Making a {size} pizza with:")
    for topping in toppings:
        print(f"- {topping}")

make_pizza("large", "pepperoni", "mushrooms", "olives")
`,
    chaosExercise: {
      id: "chaos_func",
      title: "The Mutable Default Parameter Trap",
      description: "Mutating default parameter lists leaks values between calls. Change default parameter to None.",
      brokenCode: `def add_user(name, users=[]):
    users.append(name)
    return users

print(add_user("Nick"))
print(add_user("Nik"))`,
      correctCode: `def add_user(name, users=None):
    if users is None:
        users = []
    users.append(name)
    return users

print(add_user("Nick"))
print(add_user("Nik"))`,
      validationScript: `
# Validate lists are independent
list1 = add_user("A")
list2 = add_user("B")
if len(list1) == 1 and len(list2) == 1:
    print("SUCCESS")
else:
    print("FAILED: Values leaked due to mutable default arguments")
`
    },
    quizzes: [
      {
        id: "q_func_1",
        type: "mcq",
        question: "Why should you avoid using mutable defaults like [] as function arguments?",
        options: ["Throws syntax errors", "Instantiated only once on definition, sharing reference on all calls", "Runs slower", "Deprecated"],
        correctAnswer: "1",
        explanation: "Python instantiates default values once when defining the function. Mutable values like lists are shared across all calls."
      }
    ],
    interviews: [
      {
        question: "What does LEGB stand for in variable scoping?",
        answer: "LEGB defines the lookup order for variables: Local, Enclosing (nonlocal), Global, and Built-in.",
        rubric: ["Local scope", "Enclosing functions scope", "Global namespace", "Built-ins module"]
      }
    ]
  },
  {
    id: "py_lists",
    title: "Lists & Indexing",
    phase: "Phase 3: Data Structures",
    duration: "25 mins",
    difficulty: "Beginner",
    type: "structures",
    objectives: [
      "Master slicing indices [start:stop:step]",
      "Modify lists using append, extend, insert, and pop",
      "Construct lists dynamically using list comprehensions"
    ],
    videoUrl: "https://www.youtube.com/embed/z0_8LxpDDWZ",
    examples: [
      {
        title: "Advanced List Slicing",
        description: "Slice lists forwards, backwards, and with custom step limits.",
        code: "items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\nprint('Reverse list:', items[::-1])\nprint('Every second element:', items[::2])\nprint('Middle portion:', items[3:7])"
      },
      {
        title: "List Comprehension Basics",
        description: "Create computed collections using inline loops.",
        code: "squares = [x**2 for x in range(10) if x % 2 == 0]\nprint('Squares of evens:', squares)"
      }
    ],
    theory: `### 📑 Lists & Sequence Slicing

Lists are mutable sequences. Access elements using zero-indexed notation.

#### Slicing parameters
Syntax: \`list[start:stop:step]\`. If step is negative, iteration runs backwards.
`,
    templateCode: `nums = [10, 20, 30, 40, 50]
# Reverse array
reversed_nums = nums[::-1]
print("Reversed:", reversed_nums)
`,
    chaosExercise: {
      id: "chaos_lists",
      title: "Index Error Slicing Confusion",
      description: "Correct indexing constraints to capture the correct middle items.",
      brokenCode: `items = [1, 2, 3, 4, 5]
# Try to extract [2, 3, 4]
sub = items[2:4]
print(sub)`,
      correctCode: `items = [1, 2, 3, 4, 5]
# Try to extract [2, 3, 4]
sub = items[1:4]
print(sub)`,
      validationScript: `
if sub == [2, 3, 4]:
    print("SUCCESS")
else:
    print("FAILED: list slice was", sub)
`
    },
    quizzes: [
      {
        id: "q_list_1",
        type: "predict",
        question: "What is output of: ['a', 'b', 'c'][::-1]?",
        correctAnswer: "['c', 'b', 'a']",
        explanation: "The negative step slices the list in reverse order."
      }
    ],
    interviews: [
      {
        question: "What is the time complexity of appending versus inserting an item at the beginning of a list?",
        answer: "Appending is O(1) amortized because elements go at the end. Inserting at index 0 is O(N) because all subsequent elements must shift right.",
        rubric: ["Appending O(1)", "Inserting O(N) due to shift"]
      }
    ]
  },
  {
    id: "py_dicts",
    title: "Dictionaries & Key-Values",
    phase: "Phase 3: Data Structures",
    duration: "30 mins",
    difficulty: "Beginner",
    type: "structures",
    objectives: [
      "Access dictionary properties using get() with defaults",
      "Manipulate dictionary items, keys, and values",
      "Construct nested objects"
    ],
    videoUrl: "https://www.youtube.com/embed/SOEASKONW3O",
    examples: [
      {
        title: "Safe Key Retrieval",
        description: "Avoid KeyError using get() method with fallback values.",
        code: "user = {'name': 'Nik', 'role': 'CTO'}\nprint(user.get('streak', 0))\nprint(user.get('name'))"
      },
      {
        title: "Dictionary Comprehension",
        description: "Generate key-value pairings from lists.",
        code: "names = ['Nik', 'Sarah', 'Alex']\nlengths = {name: len(name) for name in names}\nprint(lengths)"
      }
    ],
    theory: `### 🔑 Dictionaries

Dictionaries store mapping values. Keys must be **hashable** (immutable objects like strings, integers, or tuples).
`,
    templateCode: `config = {"debug": True, "port": 8000}
print("Debug mode:", config.get("debug"))
`,
    chaosExercise: {
      id: "chaos_dicts",
      title: "Unhashable Dictionary Key Crash",
      description: "Correct a dictionary assignment that crashes because a mutable list was used as a key.",
      brokenCode: `db = {}
key = [1, 2] # list is unhashable
db[key] = "values"`,
      correctCode: `db = {}
key = (1, 2) # tuple is hashable
db[key] = "values"`,
      validationScript: `
if type(key) is tuple:
    print("SUCCESS")
else:
    print("FAILED: Key is still unhashable list type")
`
    },
    quizzes: [
      {
        id: "q_dicts_1",
        type: "mcq",
        question: "Why cannot a list be used as a dictionary key?",
        options: ["Lists are too slow", "Lists are mutable and unhashable", "Forbidden by PEP8", "Dictionaries only support strings"],
        correctAnswer: "1",
        explanation: "Dictionary keys must be hashable so their hash values never change. Since lists are mutable, they are unhashable."
      }
    ],
    interviews: [
      {
        question: "How are dictionaries optimized internally in modern Python?",
        answer: "Dictionaries are implemented as open-addressed hash tables, providing average O(1) time complexity for insertions and lookups.",
        rubric: ["Hash table implementation", "O(1) average lookup/insert complexity"]
      }
    ]
  },
  {
    id: "py_files",
    title: "File I/O Operations",
    phase: "Phase 5: Modules & Files",
    duration: "25 mins",
    difficulty: "Intermediate",
    type: "basics",
    objectives: [
      "Read and write files safely in disk directories",
      "Manage file stream buffers using with contexts",
      "Handle path validations and text encodings"
    ],
    videoUrl: "https://www.youtube.com/embed/Uh2ebFW8OYM",
    examples: [
      {
        title: "Safe File Writing",
        description: "Write content into disk files using with block scopes.",
        code: "with open('output.txt', 'w') as f:\n    f.write('Hello, this file was generated inside the WASM IDE!\\n')\nwith open('output.txt', 'r') as f:\n    print(f.read())"
      }
    ],
    theory: `### 💾 File Operations

Handle reading and writing files safely. Always use context managers (\`with open\`) to ensure buffers close automatically.
`,
    templateCode: `# Create a workspace text file
with open("workspace_log.txt", "w") as f:
    f.write("Line 1: Log entry initialized")

with open("workspace_log.txt", "r") as f:
    print(f.read())
`,
    chaosExercise: {
      id: "chaos_files",
      title: "The Resource Leak Bug",
      description: "Refactor file operations to use the safety context manager so file descriptors never leak.",
      brokenCode: `f = open("data.txt", "w")
f.write("System Log")
# missing f.close()`,
      correctCode: `with open("data.txt", "w") as f:
    f.write("System Log")`,
      validationScript: `
print("SUCCESS")
`
    },
    quizzes: [
      {
        id: "q_files_1",
        type: "mcq",
        question: "Why should you use the 'with' statement when opening files?",
        options: ["Makes execution faster", "Automatically closes the file, preventing resource leaks", "Permitted only on Unix", "Saves syntax lines"],
        correctAnswer: "1",
        explanation: "The with statement creates a context manager that guarantees the file descriptor closes even if exceptions occur."
      }
    ],
    interviews: [
      {
        question: "What is difference between 'w', 'a', and 'r+' modes when calling open()?",
        answer: "'w' opens a file for writing, truncating it first. 'a' opens for writing, appending new data to the end. 'r+' opens for both reading and writing without truncation.",
        rubric: ["w truncates file", "a appends data", "r+ reads and writes"]
      }
    ]
  },
  {
    id: "py_oop_concepts",
    title: "Object-Oriented Programming Concepts",
    phase: "Phase 6: OOP Structures",
    duration: "35 mins",
    difficulty: "Intermediate",
    type: "oop",
    objectives: [
      "Understand classes, objects, and constructor methods (__init__)",
      "Learn about encapsulation and private attributes",
      "Implement inheritance and polymorphism"
    ],
    videoUrl: "https://www.youtube.com/embed/ZDa-Z5JzLYM",
    examples: [
      {
        title: "Constructing Instance attributes",
        description: "Create object instances with attributes and methods.",
        code: "class User:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f'Hello, {self.name}'\n\nu = User('Nik')\nprint(u.greet())"
      },
      {
        title: "Polymorphic Methods",
        description: "Override parent class methods in child components.",
        code: "class Shape:\n    def area(self): return 0\nclass Square(Shape):\n    def __init__(self, w): self.w = w\n    def area(self): return self.w ** 2\n\ns = Square(10)\nprint('Area:', s.area())"
      }
    ],
    theory: `### 🏛️ Object-Oriented Python

OOP maps structures to classes and instances. Encapsulation manages data visibility using double underscores (\`__\`).
`,
    templateCode: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "Generic sound"

class Dog(Animal):
    def speak(self):
        return "Woof!"

d = Dog("Rex")
print(d.name, "says:", d.speak())
`,
    chaosExercise: {
      id: "chaos_oop",
      title: "Broken Private Balance Access",
      description: "Implement a getter method to safely query internal private account balances.",
      brokenCode: `class BankAccount:
    def __init__(self, balance):
        self.__balance = balance

acc = BankAccount(500)
print(acc.__balance)`,
      correctCode: `class BankAccount:
    def __init__(self, balance):
        self.__balance = balance
    def get_balance(self):
        return self.__balance

acc = BankAccount(500)
print(acc.get_balance())`,
      validationScript: `
try:
    if acc.get_balance() == 500:
        print("SUCCESS")
except AttributeError:
    print("FAILED: Getter method get_balance missing")
`
    },
    quizzes: [
      {
        id: "q_oop_1",
        type: "mcq",
        question: "How does Python restrict accessing class properties starting with double underscores?",
        options: ["Throws compile errors", "Uses double underscores which invokes name mangling", "Uses private keyword before variables", "By declaring them in global scope"],
        correctAnswer: "1",
        explanation: "Python enforces private fields via name mangling, prefixing the variable with the class name internally."
      }
    ],
    interviews: [
      {
        question: "What is name mangling in Python OOP?",
        answer: "When an attribute is prefixed with two leading underscores, Python renames it internally to '_ClassName__attributeName' to avoid namespace collisions.",
        rubric: ["Double underscore prefix", "Renaming with _ClassName prefix"]
      }
    ]
  },
  {
    id: "py_exceptions",
    title: "Exception Handling (try/except)",
    phase: "Phase 2: Control Flow",
    duration: "25 mins",
    difficulty: "Intermediate",
    type: "logic",
    objectives: [
      "Handle runtime issues with try/except blocks",
      "Utilize finally blocks to guarantee resource releases",
      "Raise custom exceptions under application constraints"
    ],
    videoUrl: "https://www.youtube.com/embed/6SPDvP45P3U",
    examples: [
      {
        title: "Catching Specific Exceptions",
        description: "Trap ZeroDivisionError and TypeError boundaries cleanly.",
        code: "try:\n    res = 10 / 0\nexcept ZeroDivisionError:\n    print('Safe backup value returned: 0')"
      },
      {
        title: "Custom Exception raising",
        description: "Assert restrictions using custom exception types.",
        code: "class LimitError(Exception): pass\ntry:\n    raise LimitError('Limit exceeded')\nexcept LimitError as e:\n    print('Custom Exception trapped:', e)"
      }
    ],
    theory: `### ⚠️ Exception Handling

Avoid program termination using structured exception blocks (\`try\`, \`except\`, \`else\`, \`finally\`).
`,
    templateCode: `try:
    num = int("not_a_number")
except ValueError as e:
    print("Caught Exception:", e)
finally:
    print("Guaranteed cleanup step runs here!")
`,
    chaosExercise: {
      id: "chaos_exc",
      title: "The Loose Exception Catch",
      description: "Refactor code catching all exceptions loosely to target specifically ZeroDivisionError and ValueError.",
      brokenCode: `try:
    res = 100 / value
except:
    print("Error occurred")`,
      correctCode: `try:
    res = 100 / value
except (ZeroDivisionError, NameError) as e:
    print("Handled specifically:", e)`,
      validationScript: `
print("SUCCESS")
`
    },
    quizzes: [
      {
        id: "q_exc_1",
        type: "mcq",
        question: "Which block always executes in exception structures?",
        options: ["except", "else", "finally", "try"],
        correctAnswer: "2",
        explanation: "The finally block is guaranteed to execute, regardless of whether exceptions were thrown or successfully caught."
      }
    ],
    interviews: [
      {
        question: "Why is catching a raw Exception base class generally discouraged?",
        answer: "Catching a raw Exception masks unexpected bugs or system errors (like KeyboardInterrupt or NameError), making debugging extremely difficult.",
        rubric: ["Masks hidden program logic errors", "Hinders clean traceback diagnosis"]
      }
    ]
  },
  {
    id: "py_decorators",
    title: "Decorators & Wrappers",
    phase: "Phase 4: Functions",
    duration: "35 mins",
    difficulty: "Advanced",
    type: "advanced",
    objectives: [
      "Understand first-class functions and closures",
      "Learn decorator syntax and wrapped functions",
      "Build custom execution timers and loggers using decorators"
    ],
    videoUrl: "https://www.youtube.com/embed/FsAPt_9Bf3U",
    examples: [
      {
        title: "Simple Logger Decorator",
        description: "Print statement markers before executing scripts.",
        code: "def log(f):\n    def wrapper():\n        print('Executing...')\n        f()\n    return wrapper\n@log\ndef run(): print('Core logic')\nrun()"
      }
    ],
    theory: `### 🎭 Python Decorators

Decorators allow you to wrap functions to modify their behavior without permanently modifying their original definitions.
`,
    templateCode: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        res = func(*args, **kwargs)
        print(f"Elapsed: {time.time() - start:.6f}s")
        return res
    return wrapper

@timer
def task():
    sum(range(100000))

task()
`,
    chaosExercise: {
      id: "chaos_dec",
      title: "Broken Wrapper Signature",
      description: "Fix a wrapper logger that crashes when decorating functions that accept arguments.",
      brokenCode: `def log(f):
    def wrapper():
        print("Calling")
        return f()
    return wrapper

@log
def multiply(x, y):
    return x * y

multiply(5, 5)`,
      correctCode: `def log(f):
    def wrapper(*args, **kwargs):
        print("Calling")
        return f(*args, **kwargs)
    return wrapper

@log
def multiply(x, y):
    return x * y

multiply(5, 5)`,
      validationScript: `
try:
    if multiply(4, 5) == 20:
        print("SUCCESS")
    else:
        print("FAILED: Wrapper still does not accept parameters")
except TypeError:
    print("FAILED: Wrapper still does not accept parameters")
`
    },
    quizzes: [
      {
        id: "q_dec_1",
        type: "mcq",
        question: "How do you preserve function metadata under decorator wrapping?",
        options: ["Use functools.wraps decorator", "It happens automatically", "Define global references", "Wrappers cannot save metadata"],
        correctAnswer: "0",
        explanation: "Applying @functools.wraps on the wrapper function copies the original function's name and docstring."
      }
    ],
    interviews: [
      {
        question: "What is a closure in Python?",
        answer: "A closure is a nested function object that retains bindings to free variables in its enclosing lexical scope even after the enclosing scope has finished executing.",
        rubric: ["Inner function references outer scope variable", "Variables persist after outer function exits"]
      }
    ]
  },
  {
    id: "py_generators",
    title: "Generators & yield",
    phase: "Phase 4: Functions",
    duration: "30 mins",
    difficulty: "Advanced",
    type: "advanced",
    objectives: [
      "Understand the memory differences between lists and generators",
      "Construct lazy sequences using the yield statement",
      "Utilize generator expressions for high-performance memory mapping"
    ],
    videoUrl: "https://www.youtube.com/embed/bD05uGo_sVI",
    examples: [
      {
        title: "Lazy Fibonacci Sequence",
        description: "Produce Fibonacci sequences lazily without storing them in memory.",
        code: "def fibonacci(limit):\n    a, b = 0, 1\n    for _ in range(limit):\n        yield a\n        a, b = b, a + b\n\nprint(list(fibonacci(10)))"
      },
      {
        title: "Large File stream parsing",
        description: "Demonstrate line-by-line file reading via generators.",
        code: "def read_lines(filename):\n    with open(filename, 'r') as f:\n        for line in f:\n            yield line.strip()\n# Read data.txt lazily"
      }
    ],
    theory: `### ⚡ Generators & Yield

Generators are functions that return an iterator lazily on-demand. Instead of returning a list of computed items all at once, they yield one item at a time, conserving system memory.

#### Yield keyword
The \`yield\` statement suspends a function's execution state, returning a value to the caller. When \`next()\` is called on the generator, it resumes exactly where it left off.
`,
    templateCode: `def infinite_counter():
    n = 1
    while True:
        yield n
        n += 1

gen = infinite_counter()
print(next(gen))
print(next(gen))
print(next(gen))
`,
    chaosExercise: {
      id: "chaos_gen",
      title: "Broken Generator Iteration State",
      description: "A generator function crashes because it uses a return statement prematurely instead of yield. Fix it.",
      brokenCode: `def count_up(max_val):
    count = 1
    while count <= max_val:
        return count
        count += 1`,
      correctCode: `def count_up(max_val):
    count = 1
    while count <= max_val:
        yield count
        count += 1`,
      validationScript: `
try:
    g = count_up(3)
    if next(g) == 1 and next(g) == 2:
        print("SUCCESS")
    else:
        print("FAILED: yields incorrect values")
except TypeError:
    print("FAILED: return was not replaced with yield statement")
`
    },
    quizzes: [
      {
        id: "q_gen_1",
        type: "mcq",
        question: "What happens when a generator function hits a yield statement?",
        options: ["Terminates function scope", "Suspends execution, saving local state, and yields value", "Throws StopIteration exception", "Creates a static list"],
        correctAnswer: "1",
        explanation: "Yield pauses the generator execution and returns a value. The function status remains saved for subsequent requests."
      }
    ],
    interviews: [
      {
        question: "When should you use generators over list comprehensions?",
        answer: "Generators should be used when handling huge or infinite data streams where storing all values in memory simultaneously is unnecessary or impossible.",
        rubric: ["Massive or infinite datasets", "Converts O(N) memory allocation to O(1) memory space footprint"]
      }
    ]
  }
];

// ─── Dynamic Chaos Pool ───────────────────────────────────────────────────
// Extra chaos exercise variants per detailed topic (on top of the base one).
// Each topic ID maps to an array of ADDITIONAL ChaosExercise variants.
// The base `chaosExercise` is always index-0; these become indices 1, 2, …
const EXTRA_CHAOS_VARIANTS: Record<string, ChaosExercise[]> = {

  py_intro: [
    {
      id: "chaos_intro_v2",
      title: "Missing Colon Catastrophe",
      description: "A function definition is missing its colon, causing a SyntaxError. Fix the declaration.",
      brokenCode: `def launch_rocket()
    print("3... 2... 1... Ignition!")
    print("Liftoff!")

launch_rocket()`,
      correctCode: `def launch_rocket():
    print("3... 2... 1... Ignition!")
    print("Liftoff!")

launch_rocket()`,
      validationScript: `
try:
    launch_rocket()
    print("SUCCESS")
except SyntaxError:
    print("FAILED: Missing colon not fixed")
`
    },
    {
      id: "chaos_intro_v3",
      title: "The Mixed-Quote Crash",
      description: "A print statement mixes single and double quotes incorrectly, crashing the script. Fix the string literals.",
      brokenCode: `name = 'ProgrammingOS"
print("Welcome to " + name + '!')`,
      correctCode: `name = 'ProgrammingOS'
print("Welcome to " + name + "!")`,
      validationScript: `
try:
    result = "Welcome to " + name + "!"
    print("SUCCESS")
except:
    print("FAILED: String quote mismatch")
`
    },
    {
      id: "chaos_intro_v4",
      title: "The Unreachable Print Bug",
      description: "Code after a return statement inside a function never executes. Move the print inside the function body.",
      brokenCode: `def status():
    return "System Online"
    print("All checks passed")

status()`,
      correctCode: `def status():
    print("All checks passed")
    return "System Online"

status()`,
      validationScript: `
try:
    val = status()
    print("SUCCESS")
except:
    print("FAILED")
`
    }
  ],

  py_variables: [
    {
      id: "chaos_var_v2",
      title: "Accidental Alias Mutation",
      description: "Two variable names point to the same dict. Changes through one name affect both. Fix using dict() copy.",
      brokenCode: `config = {"debug": True, "port": 8080}
test_config = config
test_config["debug"] = False
print(config["debug"])  # Should still be True`,
      correctCode: `config = {"debug": True, "port": 8080}
test_config = dict(config)
test_config["debug"] = False
print(config["debug"])  # True`,
      validationScript: `
if config["debug"] == True:
    print("SUCCESS")
else:
    print("FAILED: Original dict was mutated")
`
    },
    {
      id: "chaos_var_v3",
      title: "Reassignment Identity Trap",
      description: "An integer variable is incremented incorrectly using string concatenation. Fix it to use arithmetic.",
      brokenCode: `score = 0
score = score + "10"
print(score)`,
      correctCode: `score = 0
score = score + 10
print(score)`,
      validationScript: `
if score == 10:
    print("SUCCESS")
else:
    print("FAILED: score is wrong type or value")
`
    }
  ],

  py_conditionals: [
    {
      id: "chaos_cond_v2",
      title: "Assignment in Condition Bug",
      description: "A single = (assignment) is used inside an if-condition instead of == (comparison). Fix it.",
      brokenCode: `access_level = 3
if access_level = 3:
    print("Admin access granted")
else:
    print("Access denied")`,
      correctCode: `access_level = 3
if access_level == 3:
    print("Admin access granted")
else:
    print("Access denied")`,
      validationScript: `
try:
    if access_level == 3:
        print("SUCCESS")
except:
    print("FAILED")
`
    },
    {
      id: "chaos_cond_v3",
      title: "Inverted Boolean Logic",
      description: "The condition logic is flipped — it denies valid users and accepts invalid ones. Fix the boolean operator.",
      brokenCode: `is_premium = True
if not is_premium:
    print("Welcome, premium user!")
else:
    print("Access denied.")`,
      correctCode: `is_premium = True
if is_premium:
    print("Welcome, premium user!")
else:
    print("Access denied.")`,
      validationScript: `print("SUCCESS")`
    }
  ],

  py_loops: [
    {
      id: "chaos_loops_v2",
      title: "Off-By-One Fence Error",
      description: "A range call stops one item too early because the stop argument is exclusive. Fix the range to include 10.",
      brokenCode: `total = 0
for i in range(1, 10):
    total += i
print(total)  # Should be 55`,
      correctCode: `total = 0
for i in range(1, 11):
    total += i
print(total)  # 55`,
      validationScript: `
if total == 55:
    print("SUCCESS")
else:
    print("FAILED: total is", total)
`
    },
    {
      id: "chaos_loops_v3",
      title: "Missing Iterator in While Loop",
      description: "The while loop uses a flag but never sets it to False, running infinitely. Add the break condition.",
      brokenCode: `found = False
items = [1, 2, 3, 7, 9]
for item in items:
    if item == 7:
        found == True  # Oops: comparison, not assignment
print(found)`,
      correctCode: `found = False
items = [1, 2, 3, 7, 9]
for item in items:
    if item == 7:
        found = True
print(found)`,
      validationScript: `
if found == True:
    print("SUCCESS")
else:
    print("FAILED: found still False")
`
    }
  ],

  py_functions: [
    {
      id: "chaos_func_v2",
      title: "Return Outside Function",
      description: "A return statement sits at module level outside any function, causing a SyntaxError. Move it inside the function.",
      brokenCode: `def compute(x, y):
    result = x * y

return result`,
      correctCode: `def compute(x, y):
    result = x * y
    return result`,
      validationScript: `
if compute(4, 5) == 20:
    print("SUCCESS")
else:
    print("FAILED")
`
    },
    {
      id: "chaos_func_v3",
      title: "Shadowed Builtin Name",
      description: "A parameter named 'list' shadows the built-in list() function. Rename it to avoid the collision.",
      brokenCode: `def process(list):
    return [x * 2 for x in list]

new_list = list(range(5))  # Crashes: list is now the local parameter
print(new_list)`,
      correctCode: `def process(items):
    return [x * 2 for x in items]

new_list = list(range(5))
print(new_list)`,
      validationScript: `
if new_list == [0, 1, 2, 3, 4]:
    print("SUCCESS")
else:
    print("FAILED")
`
    }
  ],

  py_lists: [
    {
      id: "chaos_lists_v2",
      title: "Pop from Empty List",
      description: "Code tries to pop from a list without checking it's non-empty, raising IndexError. Add a guard.",
      brokenCode: `queue = []
queue.pop()  # IndexError: pop from empty list
print("Popped")`,
      correctCode: `queue = []
if queue:
    queue.pop()
    print("Popped")
else:
    print("Queue is empty")`,
      validationScript: `
try:
    print("SUCCESS")
except IndexError:
    print("FAILED: Guard not added")
`
    },
    {
      id: "chaos_lists_v3",
      title: "List Append in Comprehension Bug",
      description: "A loop uses list.append() inside a list comprehension, producing a list of None values. Fix the comprehension.",
      brokenCode: `nums = [1, 2, 3, 4, 5]
doubled = [nums.append(x * 2) for x in nums]
print(doubled)`,
      correctCode: `nums = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in nums]
print(doubled)`,
      validationScript: `
if doubled == [2, 4, 6, 8, 10]:
    print("SUCCESS")
else:
    print("FAILED: doubled is", doubled)
`
    }
  ],

  py_dicts: [
    {
      id: "chaos_dicts_v2",
      title: "KeyError on Missing Key",
      description: "Direct bracket access raises KeyError when key is absent. Replace with .get() and a sensible default.",
      brokenCode: `user = {"name": "Nik", "role": "admin"}
print(user["streak"])  # KeyError`,
      correctCode: `user = {"name": "Nik", "role": "admin"}
print(user.get("streak", 0))`,
      validationScript: `
try:
    val = user.get("streak", 0)
    print("SUCCESS")
except KeyError:
    print("FAILED: KeyError not handled")
`
    },
    {
      id: "chaos_dicts_v3",
      title: "Iterating and Modifying Dict",
      description: "The code modifies a dictionary while iterating over it, causing a RuntimeError. Fix by iterating over a copy of the keys.",
      brokenCode: `data = {"a": 1, "b": 2, "c": 3}
for key in data:
    if data[key] == 2:
        del data[key]`,
      correctCode: `data = {"a": 1, "b": 2, "c": 3}
for key in list(data.keys()):
    if data[key] == 2:
        del data[key]`,
      validationScript: `
if "b" not in data:
    print("SUCCESS")
else:
    print("FAILED: key 'b' still exists")
`
    }
  ],

  py_files: [
    {
      id: "chaos_files_v2",
      title: "Wrong File Mode Overwrite",
      description: "The code opens a log file with 'w' mode on every call, erasing previous logs. Change it to 'a' (append) mode.",
      brokenCode: `def log_event(message):
    with open("events.log", "w") as f:
        f.write(message + "\n")

log_event("Boot")
log_event("Login")  # overwrites Boot!`,
      correctCode: `def log_event(message):
    with open("events.log", "a") as f:
        f.write(message + "\n")

log_event("Boot")
log_event("Login")`,
      validationScript: `print("SUCCESS")`
    },
    {
      id: "chaos_files_v3",
      title: "Missing Encoding Declaration",
      description: "Reading a UTF-8 file without specifying encoding causes UnicodeDecodeError on some systems. Add encoding='utf-8'.",
      brokenCode: `with open("readme.txt", "r") as f:
    content = f.read()
print(content)`,
      correctCode: `with open("readme.txt", "r", encoding="utf-8") as f:
    content = f.read()
print(content)`,
      validationScript: `print("SUCCESS")`
    }
  ],

  py_oop_concepts: [
    {
      id: "chaos_oop_v2",
      title: "Missing self in Method",
      description: "An instance method omits 'self' as its first parameter, causing a TypeError on invocation. Add 'self'.",
      brokenCode: `class Engine:
    def __init__(self):
        self.power = 500

    def get_power():
        return self.power

e = Engine()
print(e.get_power())`,
      correctCode: `class Engine:
    def __init__(self):
        self.power = 500

    def get_power(self):
        return self.power

e = Engine()
print(e.get_power())`,
      validationScript: `
try:
    if e.get_power() == 500:
        print("SUCCESS")
except TypeError:
    print("FAILED: self missing in method")
`
    },
    {
      id: "chaos_oop_v3",
      title: "Super() Init Not Called",
      description: "A subclass overrides __init__ but forgets to call super().__init__(), so inherited attributes are missing.",
      brokenCode: `class Vehicle:
    def __init__(self, speed):
        self.speed = speed

class Car(Vehicle):
    def __init__(self, speed, brand):
        self.brand = brand  # forgot super().__init__(speed)

c = Car(120, "Tesla")
print(c.speed)  # AttributeError`,
      correctCode: `class Vehicle:
    def __init__(self, speed):
        self.speed = speed

class Car(Vehicle):
    def __init__(self, speed, brand):
        super().__init__(speed)
        self.brand = brand

c = Car(120, "Tesla")
print(c.speed)`,
      validationScript: `
try:
    if c.speed == 120:
        print("SUCCESS")
except AttributeError:
    print("FAILED: super().__init__ not called")
`
    }
  ],

  py_exceptions: [
    {
      id: "chaos_exc_v2",
      title: "Silent Swallowed Exception",
      description: "An except block catches everything and does nothing (pass), hiding real errors. Add a specific handler and log the error.",
      brokenCode: `def parse_int(val):
    try:
        return int(val)
    except:
        pass  # hides all errors silently

result = parse_int("abc")
print(result)  # None — error silently swallowed`,
      correctCode: `def parse_int(val):
    try:
        return int(val)
    except ValueError as e:
        print("Parse error:", e)
        return 0

result = parse_int("abc")
print(result)`,
      validationScript: `
if result == 0:
    print("SUCCESS")
else:
    print("FAILED")
`
    },
    {
      id: "chaos_exc_v3",
      title: "Exception in Finally Block",
      description: "Code in the finally block itself raises an error, masking the original exception. Fix the finally block.",
      brokenCode: `def risky():
    try:
        return 1 / 0
    finally:
        undefined_cleanup()  # NameError in finally

risky()`,
      correctCode: `def risky():
    try:
        return 1 / 0
    except ZeroDivisionError:
        print("Caught division error")
    finally:
        print("Cleanup done")

risky()`,
      validationScript: `print("SUCCESS")`
    }
  ],

  py_decorators: [
    {
      id: "chaos_dec_v2",
      title: "Lost Function Metadata",
      description: "A decorator overwrites __name__ and __doc__ of the wrapped function. Apply @functools.wraps to preserve metadata.",
      brokenCode: `def my_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet():
    """Says hello."""
    print("Hello!")

print(greet.__name__)  # prints 'wrapper', not 'greet'`,
      correctCode: `import functools

def my_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet():
    """Says hello."""
    print("Hello!")

print(greet.__name__)`,
      validationScript: `
if greet.__name__ == "greet":
    print("SUCCESS")
else:
    print("FAILED: __name__ not preserved")
`
    },
    {
      id: "chaos_dec_v3",
      title: "Decorator Applied with Call",
      description: "A decorator is mistakenly applied with parentheses (@my_dec()) instead of the reference (@my_dec). Fix the application.",
      brokenCode: `def shout(func):
    def wrapper():
        return func().upper()
    return wrapper

@shout()  # Wrong: shout() returns None, not a decorator
def message():
    return "hello"

message()`,
      correctCode: `def shout(func):
    def wrapper():
        return func().upper()
    return wrapper

@shout
def message():
    return "hello"

print(message())`,
      validationScript: `
try:
    if message() == "HELLO":
        print("SUCCESS")
except:
    print("FAILED")
`
    }
  ],

  py_generators: [
    {
      id: "chaos_gen_v2",
      title: "Generator Exhaustion Bug",
      description: "A generator is iterated twice, but the second loop produces nothing. Fix by recreating the generator inside the second loop.",
      brokenCode: `def evens(n):
    for i in range(0, n, 2):
        yield i

g = evens(10)
first_pass = list(g)
second_pass = list(g)  # Empty — generator exhausted!
print(second_pass)`,
      correctCode: `def evens(n):
    for i in range(0, n, 2):
        yield i

first_pass = list(evens(10))
second_pass = list(evens(10))
print(second_pass)`,
      validationScript: `
if second_pass == [0, 2, 4, 6, 8]:
    print("SUCCESS")
else:
    print("FAILED: second_pass is", second_pass)
`
    },
    {
      id: "chaos_gen_v3",
      title: "Yield vs Return Type Confusion",
      description: "Code tries to use next() on a regular function's return value, raising TypeError. Convert the function to a generator.",
      brokenCode: `def countdown(n):
    while n > 0:
        return n  # Should be yield
        n -= 1

gen = countdown(3)
print(next(gen))
print(next(gen))`,
      correctCode: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(3)
print(next(gen))
print(next(gen))`,
      validationScript: `
try:
    g = countdown(3)
    if next(g) == 3 and next(g) == 2:
        print("SUCCESS")
except TypeError:
    print("FAILED: return not replaced with yield")
`
    }
  ]
};

// Complete 68-topic curriculum metadata
export const METADATA_ROADMAP = [
  // Phase 1: Foundations
  { id: "py_intro", title: "Python Introduction", phase: "Phase 1: Foundations", duration: "15 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_variables", title: "Variables & Memory References", phase: "Phase 1: Foundations", duration: "20 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_datatypes", title: "Data Types (int, float, str, bool)", phase: "Phase 1: Foundations", duration: "20 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_typecasting", title: "Type Conversion & Casting", phase: "Phase 1: Foundations", duration: "15 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_operators", title: "Operators & Expressions", phase: "Phase 1: Foundations", duration: "20 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_stringmethods", title: "String Methods & Formatting", phase: "Phase 1: Foundations", duration: "25 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_inputoutput", title: "Input & Output Functions", phase: "Phase 1: Foundations", duration: "15 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_pep8", title: "Comments & Code Style (PEP 8)", phase: "Phase 1: Foundations", duration: "15 mins", difficulty: "Beginner", type: "basics" },

  // Phase 2: Control Flow
  { id: "py_conditionals", title: "Conditional Logic (if/elif/else)", phase: "Phase 2: Control Flow", duration: "20 mins", difficulty: "Beginner", type: "logic" },
  { id: "py_logicalops", title: "Comparison & Logical Operators", phase: "Phase 2: Control Flow", duration: "15 mins", difficulty: "Beginner", type: "logic" },
  { id: "py_loops", title: "Loops & Iteration (for, while)", phase: "Phase 2: Control Flow", duration: "25 mins", difficulty: "Beginner", type: "logic" },
  { id: "py_loopcontrol", title: "break, continue & pass", phase: "Phase 2: Control Flow", duration: "15 mins", difficulty: "Beginner", type: "logic" },
  { id: "py_nestedloops", title: "Nested Loops & Patterns", phase: "Phase 2: Control Flow", duration: "25 mins", difficulty: "Beginner", type: "logic" },
  { id: "py_listcomps", title: "List Comprehensions", phase: "Phase 2: Control Flow", duration: "20 mins", difficulty: "Intermediate", type: "logic" },
  { id: "py_exceptions", title: "Exception Handling (try/except)", phase: "Phase 2: Control Flow", duration: "25 mins", difficulty: "Intermediate", type: "logic" },
  { id: "py_customexceptions", title: "Raising Custom Exceptions", phase: "Phase 2: Control Flow", duration: "20 mins", difficulty: "Intermediate", type: "logic" },

  // Phase 3: Data Structures
  { id: "py_lists", title: "Lists & Indexing", phase: "Phase 3: Data Structures", duration: "25 mins", difficulty: "Beginner", type: "structures" },
  { id: "py_tuples", title: "Tuples & Immutability", phase: "Phase 3: Data Structures", duration: "20 mins", difficulty: "Beginner", type: "structures" },
  { id: "py_dicts", title: "Dictionaries & Key-Values", phase: "Phase 3: Data Structures", duration: "30 mins", difficulty: "Beginner", type: "structures" },
  { id: "py_sets", title: "Sets & Set Operations", phase: "Phase 3: Data Structures", duration: "20 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_nestedds", title: "Nested Data Structures", phase: "Phase 3: Data Structures", duration: "25 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_sortingfilter", title: "Sorting, Filtering & Mapping", phase: "Phase 3: Data Structures", duration: "25 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_stacksqueues", title: "Stacks, Queues & Deques", phase: "Phase 3: Data Structures", duration: "30 mins", difficulty: "Intermediate", type: "structures" },

  // Phase 4: Functions
  { id: "py_functions", title: "Defining Functions & Parameters", phase: "Phase 4: Functions", duration: "25 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_argskwargs", title: "*args & **kwargs", phase: "Phase 4: Functions", duration: "20 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_lambdas", title: "Lambda Functions", phase: "Phase 4: Functions", duration: "20 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_closures", title: "Closures & Scope (LEGB)", phase: "Phase 4: Functions", duration: "25 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_higherorder", title: "Higher-Order Functions", phase: "Phase 4: Functions", duration: "25 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_recursion", title: "Recursion & Base Cases", phase: "Phase 4: Functions", duration: "30 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_decorators", title: "Decorators & Wrappers", phase: "Phase 4: Functions", duration: "35 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_generators", title: "Generators & yield", phase: "Phase 4: Functions", duration: "30 mins", difficulty: "Advanced", type: "advanced" },

  // Phase 5: Modules & Files
  { id: "py_importing", title: "Importing Modules & Packages", phase: "Phase 5: Modules & Files", duration: "20 mins", difficulty: "Beginner", type: "basics" },
  { id: "py_custommodules", title: "Creating Your Own Modules", phase: "Phase 5: Modules & Files", duration: "20 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_files", title: "File I/O Operations", phase: "Phase 5: Modules & Files", duration: "25 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_jsoncsv", title: "JSON & CSV Handling", phase: "Phase 5: Modules & Files", duration: "25 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_ossys", title: "os & sys Modules", phase: "Phase 5: Modules & Files", duration: "20 mins", difficulty: "Intermediate", type: "basics" },
  { id: "py_regex", title: "Regular Expressions (re)", phase: "Phase 5: Modules & Files", duration: "30 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_venv", title: "Virtual Environments & pip", phase: "Phase 5: Modules & Files", duration: "20 mins", difficulty: "Intermediate", type: "basics" },

  // Phase 6: OOP Structures
  { id: "py_oop_concepts", title: "Object-Oriented Programming Concepts", phase: "Phase 6: OOP Structures", duration: "35 mins", difficulty: "Intermediate", type: "oop" },
  { id: "py_classesmethods", title: "Classes & Instance Methods", phase: "Phase 6: OOP Structures", duration: "30 mins", difficulty: "Intermediate", type: "oop" },
  { id: "py_constructors", title: "Constructors (__init__)", phase: "Phase 6: OOP Structures", duration: "20 mins", difficulty: "Intermediate", type: "oop" },
  { id: "py_inheritance", title: "Inheritance & Polymorphism", phase: "Phase 6: OOP Structures", duration: "30 mins", difficulty: "Intermediate", type: "oop" },
  { id: "py_encapsulation", title: "Encapsulation & Properties", phase: "Phase 6: OOP Structures", duration: "25 mins", difficulty: "Intermediate", type: "oop" },
  { id: "py_dunder", title: "Dunder / Magic Methods", phase: "Phase 6: OOP Structures", duration: "25 mins", difficulty: "Advanced", type: "oop" },
  { id: "py_abstractclasses", title: "Abstract Classes & Interfaces", phase: "Phase 6: OOP Structures", duration: "25 mins", difficulty: "Advanced", type: "oop" },
  { id: "py_dataclasses", title: "Dataclasses & NamedTuples", phase: "Phase 6: OOP Structures", duration: "20 mins", difficulty: "Advanced", type: "oop" },

  // Phase 7: Advanced Python
  { id: "py_iterators", title: "Iterators & Iterables", phase: "Phase 7: Advanced Python", duration: "25 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_contextmanagers", title: "Context Managers (with statement)", phase: "Phase 7: Advanced Python", duration: "20 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_concurrency", title: "Concurrency: Threading & multiprocessing", phase: "Phase 7: Advanced Python", duration: "35 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_asyncio", title: "Async/Await & asyncio", phase: "Phase 7: Advanced Python", duration: "40 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_metaclasses", title: "Metaclasses & Class Factories", phase: "Phase 7: Advanced Python", duration: "35 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_memorymgmt", title: "Memory Management & Garbage Collection", phase: "Phase 7: Advanced Python", duration: "30 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_typehints", title: "Type Hints & mypy", phase: "Phase 7: Advanced Python", duration: "25 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_pytest", title: "Testing with pytest", phase: "Phase 7: Advanced Python", duration: "30 mins", difficulty: "Advanced", type: "advanced" },

  // Phase 8: Standard Library
  { id: "py_collections", title: "collections Module", phase: "Phase 8: Standard Library", duration: "25 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_itertools", title: "itertools & functools", phase: "Phase 8: Standard Library", duration: "25 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_datetime", title: "datetime & time", phase: "Phase 8: Standard Library", duration: "20 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_mathstats", title: "math & statistics", phase: "Phase 8: Standard Library", duration: "20 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_pathlib", title: "pathlib & shutil", phase: "Phase 8: Standard Library", duration: "20 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_logging", title: "logging & debugging tools", phase: "Phase 8: Standard Library", duration: "25 mins", difficulty: "Intermediate", type: "structures" },
  { id: "py_argparse", title: "argparse & CLI tools", phase: "Phase 8: Standard Library", duration: "25 mins", difficulty: "Advanced", type: "advanced" },

  // Phase 9: Real-World Projects
  { id: "py_webscraping", title: "Web Scraping with requests & BeautifulSoup", phase: "Phase 9: Real-World Projects", duration: "40 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_flask", title: "REST APIs with Flask", phase: "Phase 9: Real-World Projects", duration: "45 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_pandas", title: "Data Analysis with pandas", phase: "Phase 9: Real-World Projects", duration: "45 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_automation", title: "Automation Scripts", phase: "Phase 9: Real-World Projects", duration: "35 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_cliproject", title: "CLI Application Project", phase: "Phase 9: Real-World Projects", duration: "40 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_oopgame", title: "OOP Game (Text Adventure)", phase: "Phase 9: Real-World Projects", duration: "50 mins", difficulty: "Advanced", type: "advanced" },
  { id: "py_capstone", title: "Final Capstone Project", phase: "Phase 9: Real-World Projects", duration: "60 mins", difficulty: "Advanced", type: "advanced" }
] as const;

// Generated topics use a topic-specific YouTube search embed so every lesson
// surfaces a related tutorial instead of repeating one generic phase video.
function getTopicVideoUrl(title: string): string {
  const searchQuery = encodeURIComponent(`Python ${title} tutorial for beginners`);
  return `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;
}

// Generates high-fidelity fallback curriculum templates dynamically for a given metadata
function generateFallbackTopic(meta: typeof METADATA_ROADMAP[number]): CurriculumTopic {
  const lowercaseTitle = meta.title.toLowerCase();
  
  // Customization variables based on topic name
  let theory = "";
  let templateCode = "";
  let brokenCode = "";
  let correctCode = "";
  let validationScript = "";
  let objectives: string[] = [];
  let examples: PracticeExample[] = [];
  let quizzes: QuizQuestion[] = [];
  let interviews: InterviewQuestion[] = [];

  // Generate generic details based on topic identity
  objectives = [
    `Understand the fundamental design behind ${meta.title}`,
    `Learn syntax declarations and execution rules for ${meta.title} statements`,
    `Debug and test real-world cases containing ${meta.title} in the local environment`
  ];

  // Specific content mapping groups
  if (lowercaseTitle.includes("data type") || lowercaseTitle.includes("casting")) {
    theory = `### 📊 ${meta.title}\n\nPython variables are dynamically typed, which means you don't need to specify their types. However, knowing your types (\`int\`, \`float\`, \`str\`, \`bool\`) is essential for writing error-free calculations.\n\n#### Explicit Casting\nYou can force-convert variables to specific categories using core methods:\n\`\`\`python\nx = int("45")\ny = float("3.1415")\n\`\`\``;
    templateCode = `# Checking dynamic types\na = 100\nb = "ProgrammingOS"\nprint("a type:", type(a))\nprint("b type:", type(b))\n\n# Convert types\nc = float(a)\nprint("c value:", c)\n`;
    brokenCode = `number_str = "250"\n# Try performing calculations on string\nresult = number_str + 10\nprint(result)`;
    correctCode = `number_str = "250"\n# Convert to integer first\nresult = int(number_str) + 10\nprint(result)`;
    validationScript = `if result == 260:\n    print("SUCCESS")\nelse:\n    print("FAILED")`;
    examples = [
      { title: "Primitive Type Analysis", description: "Query type signatures of variables at runtime.", code: "print(type(True))\nprint(type(10.5))" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: "Which of the following functions is used to identify the data type of an object in Python?",
      options: ["typeof()", "type()", "dataType()", "isinstance()"],
      correctAnswer: "1",
      explanation: "The type() function retrieves the type metadata of any Python object at runtime."
    }];
    interviews = [{
      question: "What is the difference between static typing and dynamic typing?",
      answer: "In static typing, variable types are checked at compile-time and cannot change. In dynamic typing, variable bindings are checked at runtime, allowing variables to change type dynamically.",
      rubric: ["Compile-time vs Runtime checking", "Variable type flexibility"]
    }];

  } else if (lowercaseTitle.includes("operator") || lowercaseTitle.includes("expression")) {
    theory = `### 🧮 ${meta.title}\n\nOperators are special symbols that perform arithmetic or logical computation. Python includes math operators (\`+\`, \`-\`, \`*\`, \`/\`, \`//\`, \`%\`, \`**\`) as well as logical and comparison flags.\n\n#### Floor Division vs Normal Division\n- \`/\` returns float representations.\n- \`//\` yields floor integers.`;
    templateCode = `# Arithmetic calculations\nsum_val = 15 + 23\nfloor_div = 10 // 3\nremainder = 10 % 3\nprint("Floor Div:", floor_div, "Remainder:", remainder)\n`;
    brokenCode = `# We want to verify check is True\nage = 20\nhas_permit = False\n# Incorrect condition combination\ncan_drive = age >= 18 and has_permit\nprint(can_drive)`;
    correctCode = `# We want to verify check is True\nage = 20\nhas_permit = True\ncan_drive = age >= 18 and has_permit\nprint(can_drive)`;
    validationScript = `if can_drive == True:\n    print("SUCCESS")\nelse:\n    print("FAILED")`;
    examples = [
      { title: "Modulo Remainder", description: "Use the modulo operator to test even/odd values.", code: "print(17 % 2 == 0)" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: "What does the floor division operator '//' evaluate to?",
      options: ["Rounds division value up", "Returns the division remainder", "Divides values and truncates decimals to return integer", "Raises exponents"],
      correctAnswer: "2",
      explanation: "Floor division divides variables and truncates anything past the decimal to return a clean integer."
    }];
    interviews = [{
      question: "Explain the difference between == and is in Python.",
      answer: "'==' checks for value equality (if the values are equal), while 'is' checks for identity comparison (if they point to the exact same object in memory).",
      rubric: ["Value equality vs memory identity", "Usage of id() internally"]
    }];

  } else if (lowercaseTitle.includes("string") || lowercaseTitle.includes("text") || lowercaseTitle.includes("regex")) {
    theory = `### 📝 ${meta.title}\n\nText manipulation lies at the heart of daily scripting tasks. Python strings are immutable sequences of Unicode characters, supported by rich built-in utility libraries (\`re\` modules, formatting methods).\n\n#### Formatting Options\nUse f-strings (\`f"..."\`) to interpolate values directly.`;
    templateCode = `# String modifications\ntext = "  python learning platform  "\nprint(text.strip().capitalize())\n\n# Interpolation\nname = "Nik"\nprint(f"Author: {name}")\n`;
    brokenCode = `# Try inserting values into format bracket but missing 'f' prefix\nuser = "Sarah"\nwelcome = "Welcome, {user}!"\nprint(welcome)`;
    correctCode = `# Try inserting values into format bracket\nuser = "Sarah"\nwelcome = f"Welcome, {user}!"\nprint(welcome)`;
    validationScript = `if welcome == "Welcome, Sarah!":\n    print("SUCCESS")\nelse:\n    print("FAILED")`;
    examples = [
      { title: "Slicing strings", description: "Extract substrings safely.", code: "msg = 'ProgrammingOS'\nprint(msg[:11])" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: "Which string method removes both leading and trailing whitespaces?",
      options: [".clean()", ".trim()", ".strip()", ".truncate()"],
      correctAnswer: "2",
      explanation: "The .strip() method removes all leading and trailing whitespace spacing characters."
    }];
    interviews = [{
      question: "What does it mean that Python strings are immutable?",
      answer: "Immutable means that once a string is created, its contents cannot be altered in-place. Modifying operations actually instantiate new string objects in memory.",
      rubric: ["Cannot change in-place", "Creates a new object on modifications"]
    }];

  } else if (lowercaseTitle.includes("oop") || lowercaseTitle.includes("class") || lowercaseTitle.includes("inheritance") || lowercaseTitle.includes("method")) {
    theory = `### 🏛️ ${meta.title}\n\nObject-Oriented Programming (OOP) allows grouping data and behaviors. Classes form blueprints, while object instances represent the active state inside memory scopes.\n\n#### Subclass overrides\nYou can inherit characteristics from base parent classes and alter logic behaviors dynamically.`;
    templateCode = `class BaseRobot:\n    def act(self):\n        return "Idle"\n\nclass CleanBot(BaseRobot):\n    def act(self):\n        return "Sweeping"\n\nbot = CleanBot()\nprint(bot.act())\n`;
    brokenCode = `class User:\n    def __init__(name):\n        name = name # Missing self bindings\n\nu = User("Alice")`;
    correctCode = `class User:\n    def __init__(self, name):\n        self.name = name\n\nu = User("Alice")`;
    validationScript = `if u.name == "Alice":\n    print("SUCCESS")\nelse:\n    print("FAILED")`;
    examples = [
      { title: "Method Binding", description: "Understand how self binds object scopes.", code: "class Card:\n    def show(self): return id(self)" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: "What does 'self' represent in Python class methods?",
      options: ["The global runtime interpreter", "The specific class definition", "The current active object instance being invoked", "A parent interface pointer"],
      correctAnswer: "2",
      explanation: "The 'self' variable points directly to the active object instance calling the method."
    }];
    interviews = [{
      question: "Explain polymorphism in Python.",
      answer: "Polymorphism allows different class types to define methods with the same name, executing specific behaviors depending on the calling object's type.",
      rubric: ["Same interface, multiple behaviors", "Duck typing patterns"]
    }];

  } else if (lowercaseTitle.includes("async") || lowercaseTitle.includes("concur") || lowercaseTitle.includes("thread")) {
    theory = `### ⚡ ${meta.title}\n\nConcurrency speeds up execution by performing multiple tasks concurrently. Python uses \`asyncio\` for asynchronous routines, and \`threading\` or \`multiprocessing\` for parallel OS execution lines.\n\n#### Async event loops\nUse \`async def\` and \`await\` to delegate I/O waits.`;
    templateCode = `import asyncio\n\nasync def fetch():\n    print("Fetching data...")\n    await asyncio.sleep(0.5)\n    return "Loaded"\n\nasync def main():\n    res = await fetch()\n    print(res)\n\n# Run the loop\nasyncio.run(main())\n`;
    brokenCode = `import asyncio\n# Missing async definition on block\ndef fetch_val():\n    await asyncio.sleep(0.1)\n    return 5\n\nasyncio.run(fetch_val())`;
    correctCode = `import asyncio\nasync def fetch_val():\n    await asyncio.sleep(0.1)\n    return 5\n\nasyncio.run(fetch_val())`;
    validationScript = `print("SUCCESS")`;
    examples = [
      { title: "Concurrent Sleep Tasks", description: "Demonstrate parallel waiting.", code: "import asyncio\n# Async tasks print sequentially" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: "Which keyword is required to execute a coroutine inside another coroutine?",
      options: ["yield", "async", "await", "defer"],
      correctAnswer: "2",
      explanation: "The 'await' keyword pauses execution of the wrapper coroutine until the sub-coroutine completes its task."
    }];
    interviews = [{
      question: "What is the Global Interpreter Lock (GIL) in Python?",
      answer: "The GIL is a mutex lock that prevents multiple native threads from executing Python bytecodes at once, restricting pure multi-threaded CPU parallel tasks.",
      rubric: ["One thread bytecode limit", "Impacts multi-threaded CPU performance"]
    }];

  } else if (lowercaseTitle.includes("project") || lowercaseTitle.includes("scrap") || lowercaseTitle.includes("api") || lowercaseTitle.includes("game")) {
    theory = `### 🚀 ${meta.title}\n\nApplying core logic to real-world code builds confidence. We apply package integration, custom APIs, object architectures, and exception filters to construct unified systems.\n\n#### Building Interactive Terminals\nRead inputs, execute logic parameters, and render outputs.`;
    templateCode = `# CLI Engine Simulator\ndef launch_project():\n    print("Starting module engine...")\n    print("System active! Process completed.")\n\nlaunch_project()\n`;
    brokenCode = `def load_config():\n    # Key lookup crashes because of missing config fields\n    conf = {"host": "localhost"}\n    return conf["port"]\n\nport = load_config()`;
    correctCode = `def load_config():\n    conf = {"host": "localhost", "port": 8080}\n    return conf["port"]\n\nport = load_config()`;
    validationScript = `if port == 8080:\n    print("SUCCESS")\nelse:\n    print("FAILED")`;
    examples = [
      { title: "Execution Loop", description: "Iterative menu loops.", code: "print('Engine online')" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: "Which module is commonly used to send HTTP API requests in Python?",
      options: ["urllib2", "requests", "http.client", "flask"],
      correctAnswer: "1",
      explanation: "The external 'requests' package is the industry standard for performing REST API transactions."
    }];
    interviews = [{
      question: "How do you organize structure layouts for Python projects?",
      answer: "Standard layouts separate app logic into modules under a src/ directory, include a requirements.txt or pyproject.toml, and group unit tests in tests/.",
      rubric: ["Dependency declaration", "Directory structures separation"]
    }];

  } else {
    // Standard General Fallback
    theory = `### 📘 ${meta.title}\n\nIn this section, we study ${meta.title} syntax rules, use cases, and structural properties. Maintaining code structure is important as projects scale.\n\n#### Core Concept\nReview the template code to see how to implement this module in your projects.`;
    templateCode = `# Let's explore ${meta.title} structures\nprint("Evaluating ${meta.title} workflow...")\n# Add your calculations here!\n`;
    brokenCode = `def evaluate():\n    val = 10\n    # Wrong syntax variable usage\n    return val + unknown_variable\n\nevaluate()`;
    correctCode = `def evaluate():\n    val = 10\n    unknown_variable = 20\n    return val + unknown_variable\n\nevaluate()`;
    validationScript = `print("SUCCESS")`;
    examples = [
      { title: "Basic Usage", description: "Initialize variables.", code: "print('Module execution completed')" }
    ];
    quizzes = [{
      id: `q_${meta.id}_1`,
      type: "mcq",
      question: `What is the main advantage of learning ${meta.title}?`,
      options: ["Saves file lines", "Improves code architecture and execution speed", "Required by compilers", "None of the above"],
      correctAnswer: "1",
      explanation: "Mastering core language segments enables developers to write clean, maintainable, and high-performance apps."
    }];
    interviews = [{
      question: `Why is ${meta.title} important in software engineering?`,
      answer: `It establishes core modular architectures, allowing developers to manage state and logic execution lines cleanly.`,
      rubric: ["Code reusability", "Architecture separation"]
    }];
  }

  return {
    id: meta.id,
    title: meta.title,
    phase: meta.phase,
    duration: meta.duration,
    difficulty: meta.difficulty,
    type: meta.type as TopicType,
    objectives,
    theory,
    templateCode,
    videoUrl: getTopicVideoUrl(meta.title),
    examples,
    chaosExercise: {
      id: `chaos_${meta.id}`,
      title: `Chaos Mode: ${meta.title} Debugger`,
      description: `Locate the logical or syntax error in this ${meta.title} exercise and fix it.`,
      brokenCode,
      correctCode,
      validationScript
    },
    quizzes,
    interviews
  };
}

// Templates for dynamic quizzes and interviews based on topic type
const PYTHON_QUIZ_TEMPLATES: Record<TopicType, Array<{
  type: "mcq";
  question: (title: string) => string;
  options: string[];
  correctAnswer: string;
  explanation: (title: string) => string;
}>> = {
  basics: [
    {
      type: "mcq",
      question: (t) => `Which of the following describes the core behavior of ${t} in Python?`,
      options: ["Executed line-by-line at runtime", "Compiled into a static binary", "Requires declaration of types beforehand", "Unsupported in Python 3"],
      correctAnswer: "0",
      explanation: (t) => `Python is an interpreted language; ${t} elements are evaluated sequentially at runtime.`
    },
    {
      type: "mcq",
      question: (t) => `When declaring or configuring variables for ${t}, what is the standard naming convention (PEP 8)?`,
      options: ["camelCase", "snake_case", "PascalCase", "UPPERCASE"],
      correctAnswer: "1",
      explanation: (t) => `PEP 8 recommends using snake_case for functions and variables related to ${t}.`
    },
    {
      type: "mcq",
      question: (t) => `What happens if we reference a variable or component of ${t} before defining it?`,
      options: ["It is automatically initialized to None", "It throws a NameError", "It defaults to 0", "It is ignored silently"],
      correctAnswer: "1",
      explanation: (t) => `Referencing an undefined identifier of ${t} raises a NameError.`
    },
    {
      type: "mcq",
      question: (t) => `Which built-in function helps inspect the memory address of ${t} objects?`,
      options: ["address()", "hex()", "id()", "loc()"],
      correctAnswer: "2",
      explanation: (t) => `The id() function returns the unique identity/memory address of an object.`
    },
    {
      type: "mcq",
      question: (t) => `What is the return type of the type() function when called on ${t} constructs?`,
      options: ["A string descriptor", "A class object representation", "A boolean flag", "A dictionary of attributes"],
      correctAnswer: "1",
      explanation: (t) => `The type() function returns a type object representing the class of the passed object.`
    },
    {
      type: "mcq",
      question: (t) => `How does the scope of variables created inside ${t} behave?`,
      options: ["They are global by default", "They are local to the enclosing block/function", "They persist across restarts", "They cannot be accessed inside loops"],
      correctAnswer: "1",
      explanation: (t) => `Variables declared inside functions or scopes are local to that context.`
    },
    {
      type: "mcq",
      question: (t) => `Which type of comments are recommended for documenting ${t} functions?`,
      options: ["Single-line comments starting with #", "Docstrings enclosed in triple quotes", "HTML-style comments <!-- -->", "Inline comments at the end of lines"],
      correctAnswer: "1",
      explanation: (t) => `Docstrings (triple quotes) are the standard way to document functions and classes.`
    },
    {
      type: "mcq",
      question: (t) => `What does it mean that Python features dynamic typing for ${t}?`,
      options: ["Types are checked at compile-time", "Variables can be reassigned to values of different types", "Types cannot change once set", "Variables must always hold numeric types"],
      correctAnswer: "1",
      explanation: (t) => `Dynamic typing allows a variable name to bind to different types of values during execution.`
    },
    {
      type: "mcq",
      question: (t) => `Which keyword is used to import helper modules related to ${t}?`,
      options: ["include", "import", "require", "using"],
      correctAnswer: "1",
      explanation: (t) => `The import keyword loads modules and packages into the namespace.`
    },
    {
      type: "mcq",
      question: (t) => `Which built-in function returns a list of all attributes and methods of ${t}?`,
      options: ["help()", "dir()", "show()", "list()"],
      correctAnswer: "1",
      explanation: (t) => `The dir() function lists the attributes and methods of any object.`
    },
    {
      type: "mcq",
      question: (t) => `How do you check if an object is an instance of a specific type in ${t}?`,
      options: ["isinstance()", "typeof()", "type() == class", "checkInstance()"],
      correctAnswer: "0",
      explanation: (t) => `isinstance() is the standard and recommended way to check object types, supporting inheritance.`
    },
    {
      type: "mcq",
      question: (t) => `What represents the lack of a value or null state in ${t} variables?`,
      options: ["null", "void", "None", "undefined"],
      correctAnswer: "2",
      explanation: (t) => `None is the built-in constant in Python used to represent the absence of a value.`
    },
    {
      type: "mcq",
      question: (t) => `What happens to objects of ${t} that are no longer referenced in memory?`,
      options: ["They remain in memory until the program exits", "They are automatically cleaned up by the Garbage Collector", "They raise a MemoryError", "They are written to disk"],
      correctAnswer: "1",
      explanation: (t) => `Python uses reference counting and garbage collection to automatically free unused memory.`
    },
    {
      type: "mcq",
      question: (t) => `Which of the following is an immutable data type often used in ${t}?`,
      options: ["list", "dict", "set", "tuple"],
      correctAnswer: "3",
      explanation: (t) => `Tuples are immutable sequences, whereas lists, dicts, and sets are mutable.`
    },
    {
      type: "mcq",
      question: (t) => `How is a block structure defined for ${t} in Python?`,
      options: ["Using curly braces {}", "Using indentation (spaces/tabs)", "Using begin/end keywords", "Using parentheses ()"],
      correctAnswer: "1",
      explanation: (t) => `Python uses consistent indentation to define code blocks.`
    }
  ],
  structures: [
    {
      type: "mcq",
      question: (t) => `Which method is used to add an item to the end of a list container in ${t}?`,
      options: ["insert()", "add()", "append()", "push()"],
      correctAnswer: "2",
      explanation: (t) => `The append() method adds a single element to the end of a list.`
    },
    {
      type: "mcq",
      question: (t) => `How do you look up a value in a dictionary safely without raising a KeyError for ${t}?`,
      options: ["dict[key]", "dict.get(key, default)", "dict.find(key)", "dict.fetch(key)"],
      correctAnswer: "1",
      explanation: (t) => `The .get() method retrieves a key's value, returning a default if the key is missing.`
    },
    {
      type: "mcq",
      question: (t) => `What is the time complexity of checking if an item exists in a set for ${t}?`,
      options: ["O(1) on average", "O(N)", "O(log N)", "O(N log N)"],
      correctAnswer: "0",
      explanation: (t) => `Sets use hash tables, allowing O(1) average time complexity for lookups.`
    },
    {
      type: "mcq",
      question: (t) => `Which of the following represents an empty set in ${t}?`,
      options: ["{}", "set()", "[]", "set([])"],
      correctAnswer: "1",
      explanation: (t) => `{} creates an empty dictionary. set() must be used to initialize an empty set.`
    },
    {
      type: "mcq",
      question: (t) => `What is the main difference between a list and a tuple in ${t}?`,
      options: ["Lists are immutable, tuples are mutable", "Lists are mutable, tuples are immutable", "Lists can only hold strings", "Tuples are faster for writing"],
      correctAnswer: "1",
      explanation: (t) => `Lists are mutable and can be modified; tuples are immutable once created.`
    },
    {
      type: "mcq",
      question: (t) => `How can you remove duplicate items from a list of elements in ${t}?`,
      options: ["list.remove_duplicates()", "set(my_list)", "list.unique()", "filter(my_list)"],
      correctAnswer: "1",
      explanation: (t) => `Converting a list to a set automatically filters out duplicate items.`
    },
    {
      type: "mcq",
      question: (t) => `What method clears all elements from a dictionary or list in ${t}?`,
      options: ["clear()", "delete()", "reset()", "remove()"],
      correctAnswer: "0",
      explanation: (t) => `The .clear() method removes all items from a mutable container.`
    },
    {
      type: "mcq",
      question: (t) => `What does a negative index like my_list[-1] represent in ${t}?`,
      options: ["The first element", "An invalid index error", "The last element of the list", "The second element"],
      correctAnswer: "2",
      explanation: (t) => `Negative indexing in Python counts backward from the end of the sequence.`
    },
    {
      type: "mcq",
      question: (t) => `Which method allows merging another list or iterable into an existing list in ${t}?`,
      options: ["extend()", "append()", "merge()", "concat()"],
      correctAnswer: "0",
      explanation: (t) => `extend() appends all elements from another iterable to the list.`
    },
    {
      type: "mcq",
      question: (t) => `What is the key restriction for dictionary keys in ${t}?`,
      options: ["They must be integers", "They must be hashable and immutable", "They must be uppercase strings", "They cannot contain spaces"],
      correctAnswer: "1",
      explanation: (t) => `Only hashable (generally immutable) objects like strings, numbers, or tuples can be dictionary keys.`
    },
    {
      type: "mcq",
      question: (t) => `Which function returns the number of items in a container for ${t}?`,
      options: ["count()", "size()", "len()", "length()"],
      correctAnswer: "2",
      explanation: (t) => `The len() function returns the number of elements in a list, tuple, dictionary, or set.`
    },
    {
      type: "mcq",
      question: (t) => `What happens if you try to modify a tuple in ${t}?`,
      options: ["It creates a new tuple silently", "It raises a TypeError", "It raises an AttributeError", "Nothing, it works fine"],
      correctAnswer: "1",
      explanation: (t) => `Modifying a tuple raises a TypeError because tuples are immutable.`
    },
    {
      type: "mcq",
      question: (t) => `How can you extract a sub-segment (slice) from index 1 up to (but excluding) index 4 in ${t}?`,
      options: ["list[1:4]", "list[1:3]", "list[1,4]", "list.slice(1, 4)"],
      correctAnswer: "0",
      explanation: (t) => `Slicing syntax [start:stop] is inclusive of start and exclusive of stop.`
    },
    {
      type: "mcq",
      question: (t) => `Which collections module class provides a dictionary with default values for missing keys in ${t}?`,
      options: ["OrderedDict", "defaultdict", "Counter", "deque"],
      correctAnswer: "1",
      explanation: (t) => `defaultdict automatically initializes missing keys using a provided factory function.`
    },
    {
      type: "mcq",
      question: (t) => `Which method removes and returns an item at a specific index from a list in ${t}?`,
      options: ["remove()", "discard()", "pop()", "delete()"],
      correctAnswer: "2",
      explanation: (t) => `The pop(index) method removes the item at the given index and returns it.`
    }
  ],
  logic: [
    {
      type: "mcq",
      question: (t) => `Which keyword is used to check multiple alternative conditions in ${t}?`,
      options: ["else if", "elif", "elseif", "case"],
      correctAnswer: "1",
      explanation: (t) => `Python uses 'elif' for alternative conditional paths.`
    },
    {
      type: "mcq",
      question: (t) => `What does the expression 'not False and True' evaluate to in ${t}?`,
      options: ["True", "False", "None", "raises SyntaxError"],
      correctAnswer: "0",
      explanation: (t) => `'not False' is True; 'True and True' evaluates to True.`
    },
    {
      type: "mcq",
      question: (t) => `What happens when a break statement is executed inside a nested loop for ${t}?`,
      options: ["It terminates all loops", "It terminates only the innermost loop containing it", "It skips the current iteration", "It raises a StopIteration exception"],
      correctAnswer: "1",
      explanation: (t) => `A break statement only exits the closest enclosing loop scope.`
    },
    {
      type: "mcq",
      question: (t) => `Which block of a try-except structure is guaranteed to execute regardless of whether an exception occurs in ${t}?`,
      options: ["except", "else", "finally", "catch"],
      correctAnswer: "2",
      explanation: (t) => `The finally block always runs, making it ideal for cleanup tasks.`
    },
    {
      type: "mcq",
      question: (t) => `What is the purpose of the 'pass' keyword in ${t} blocks?`,
      options: ["To exit a loop early", "To act as a placeholder for future code without raising SyntaxError", "To raise an exception", "To skip the next iteration"],
      correctAnswer: "1",
      explanation: (t) => `The pass statement is a null operation used where syntax requires a statement but no action is needed.`
    },
    {
      type: "mcq",
      question: (t) => `How can you catch all exceptions in a try block for ${t}?`,
      options: ["except All:", "except Exception:", "catch (e):", "except:"],
      correctAnswer: "1",
      explanation: (t) => `Catching 'Exception' catches all standard built-in exceptions while allowing system exit signals to pass.`
    },
    {
      type: "mcq",
      question: (t) => `What loop structure is best suited when the number of iterations is NOT known beforehand in ${t}?`,
      options: ["for loop", "while loop", "nested loop", "infinite recursion"],
      correctAnswer: "1",
      explanation: (t) => `A while loop runs as long as its condition remains True, which is ideal for indefinite iteration.`
    },
    {
      type: "mcq",
      question: (t) => `What does the 'continue' keyword do in a loop block for ${t}?`,
      options: ["Exits the loop entirely", "Skips the rest of the current iteration and jumps to the next loop cycle", "Pauses execution", "Restarts the loop from index 0"],
      correctAnswer: "1",
      explanation: (t) => `continue immediately starts the next iteration of the loop.`
    },
    {
      type: "mcq",
      question: (t) => `Which exception is raised when dividing a number by zero in ${t}?`,
      options: ["ValueError", "ArithmeticError", "ZeroDivisionError", "DivisionError"],
      correctAnswer: "2",
      explanation: (t) => `Python raises ZeroDivisionError when the denominator in a division operation is zero.`
    },
    {
      type: "mcq",
      question: (t) => `What is evaluated in a conditional block if the condition evaluates to the integer 0?`,
      options: ["It is evaluated as True", "It is evaluated as False", "It raises a TypeError", "It raises a ValueError"],
      correctAnswer: "1",
      explanation: (t) => `In Python, 0 is considered falsy, so it evaluates as False.`
    },
    {
      type: "mcq",
      question: (t) => `How do you raise a custom exception manually in ${t}?`,
      options: ["throw Exception()", "raise Exception()", "trigger Exception()", "new Exception()"],
      correctAnswer: "1",
      explanation: (t) => `The raise keyword is used to trigger exceptions manually.`
    },
    {
      type: "mcq",
      question: (t) => `What is the output of 'bool([])' when testing logical truthiness in ${t}?`,
      options: ["True", "False", "None", "raises TypeError"],
      correctAnswer: "1",
      explanation: (t) => `Empty sequences (like lists, strings, or tuples) evaluate to False in truthiness checks.`
    },
    {
      type: "mcq",
      question: (t) => `Which operator has higher precedence in logical evaluations for ${t}?`,
      options: ["and", "or", "They have equal precedence", "It depends on parentheses"],
      correctAnswer: "0",
      explanation: (t) => `The 'and' operator has higher precedence than 'or' in logic evaluations.`
    },
    {
      type: "mcq",
      question: (t) => `What block runs in a try-except statement if NO exceptions are raised in ${t}?`,
      options: ["except", "finally", "else", "then"],
      correctAnswer: "2",
      explanation: (t) => `The else block in a try-except structure executes only if the try block succeeds without raising errors.`
    },
    {
      type: "mcq",
      question: (t) => `Which operator checks if two variables refer to the exact same object in memory in ${t}?`,
      options: ["==", "is", "in", "==="],
      correctAnswer: "1",
      explanation: (t) => `The 'is' operator checks for identity comparison (memory location), whereas '==' checks value equality.`
    }
  ],
  oop: [
    {
      type: "mcq",
      question: (t) => `Which magic method acts as the constructor in Python classes for ${t}?`,
      options: ["__new__", "__init__", "__create__", "__construct__"],
      correctAnswer: "1",
      explanation: (t) => `The __init__ method is invoked immediately after an object is instantiated to configure its initial state.`
    },
    {
      type: "mcq",
      question: (t) => `What does the super() function do in class method overrides for ${t}?`,
      options: ["Returns the class object", "Delegates method calls to a parent/ancestor class", "Instantiates a subclass", "Destroys the instance"],
      correctAnswer: "1",
      explanation: (t) => `super() returns a proxy object that delegates method calls to a parent or sibling class.`
    },
    {
      type: "mcq",
      question: (t) => `How does Python handle private attributes within class scopes for ${t}?`,
      options: ["Using the private keyword", "Prefixing names with double underscores (name mangling)", "Using block tags", "All variables are public only"],
      correctAnswer: "1",
      explanation: (t) => `Double leading underscores (e.g. __attribute) trigger name mangling, transforming the name to _ClassName__attribute to avoid collisions.`
    },
    {
      type: "mcq",
      question: (t) => `Which decorator is used to define a method that operates on the class itself rather than instances in ${t}?`,
      options: ["@staticmethod", "@classmethod", "@property", "@instancemethod"],
      correctAnswer: "1",
      explanation: (t) => `@classmethod receives the class reference (cls) as its first argument.`
    },
    {
      type: "mcq",
      question: (t) => `What is polymorphism in the context of ${t}?`,
      options: ["Defining classes in multiple files", "The ability of different objects to respond to the same method call in their own way", "Converting data structures", "Restricting access to class variables"],
      correctAnswer: "1",
      explanation: (t) => `Polymorphism allows different classes to share interface names while defining distinct behaviors.`
    },
    {
      type: "mcq",
      question: (t) => `How do you specify inheritance in Python class declarations for ${t}?`,
      options: ["class SubClass extends ParentClass", "class SubClass(ParentClass):", "class SubClass: ParentClass", "class SubClass implements ParentClass"],
      correctAnswer: "1",
      explanation: (t) => `Inheritance is defined by passing the parent class name in parentheses after the class name.`
    },
    {
      type: "mcq",
      question: (t) => `What decorator converts a class method into a read-only getter attribute for ${t}?`,
      options: ["@getter", "@property", "@attribute", "@readonly"],
      correctAnswer: "1",
      explanation: (t) => `The @property decorator allows calling a method like a normal attribute without parentheses.`
    },
    {
      type: "mcq",
      question: (t) => `What magic method controls the string representation of an object for developers (debugging) in ${t}?`,
      options: ["__str__", "__repr__", "__doc__", "__format__"],
      correctAnswer: "1",
      explanation: (t) => `__repr__ returns an unambiguous string representation of the object, usually for debug logs.`
    },
    {
      type: "mcq",
      question: (t) => `Which module provides support for defining Abstract Base Classes in ${t}?`,
      options: ["abc", "abstract", "oop", "sys"],
      correctAnswer: "0",
      explanation: (t) => `The 'abc' module is the standard library module used to define abstract classes and methods.`
    },
    {
      type: "mcq",
      question: (t) => `What is duck typing in Python's OOP paradigm for ${t}?`,
      options: ["A typing check that runs on compile-time only", "Determining suitability by the presence of methods/properties rather than inheritance", "Enforcing strict subclass inheritance", "Defining functions inside other functions"],
      correctAnswer: "1",
      explanation: (t) => `If it walks like a duck and quacks like a duck, it's a duck. Duck typing prioritizes interface capability over class hierarchy.`
    },
    {
      type: "mcq",
      question: (t) => `What is the first parameter of any instance method in Python classes for ${t}?`,
      options: ["cls", "this", "self", "instance"],
      correctAnswer: "2",
      explanation: (t) => `Instance methods must receive 'self' as the first parameter to bind to the calling object instance.`
    },
    {
      type: "mcq",
      question: (t) => `Which method checks if a class is a subclass of another class in ${t}?`,
      options: ["isinstance()", "issubclass()", "hasattr()", "type()"],
      correctAnswer: "1",
      explanation: (t) => `issubclass() checks if a class inherits from a specified parent class.`
    },
    {
      type: "mcq",
      question: (t) => `What does the @dataclass decorator automatically generate for a class in ${t}?`,
      options: ["Database connections", "Standard methods like __init__, __repr__, and __eq__", "HTML rendering templates", "Execution threads"],
      correctAnswer: "1",
      explanation: (t) => `The @dataclass decorator (from dataclasses module) reduces boilerplate by auto-generating standard methods.`
    },
    {
      type: "mcq",
      question: (t) => `What magic method is called when using the '+' operator on custom objects in ${t}?`,
      options: ["__add__", "__plus__", "__sum__", "__concat__"],
      correctAnswer: "0",
      explanation: (t) => `__add__ defines the operator overload behavior for addition (+).`
    },
    {
      type: "mcq",
      question: (t) => `What is method overriding in ${t}?`,
      options: ["Creating multiple methods with different parameters in the same class", "A subclass providing a specific implementation of a method already defined in its parent class", "Deleting a method at runtime", "Calling a method from another module"],
      correctAnswer: "1",
      explanation: (t) => `Method overriding allows a child class to change the behavior of an inherited method.`
    }
  ],
  advanced: [
    {
      type: "mcq",
      question: (t) => `Which keyword or module is used to write asynchronous coroutines in ${t}?`,
      options: ["thread", "asyncio", "multiprocessing", "select"],
      correctAnswer: "1",
      explanation: (t) => `The asyncio module is the standard way to write single-threaded concurrent applications using async/await.`
    },
    {
      type: "mcq",
      question: (t) => `What object is returned by a generator function containing the 'yield' keyword in ${t}?`,
      options: ["A list of all yielded elements", "A generator iterator object", "None", "A coroutine promise"],
      correctAnswer: "1",
      explanation: (t) => `Generator functions return a generator iterator, which yields values lazily on demand.`
    },
    {
      type: "mcq",
      question: (t) => `What decorator preserves the original metadata (__name__, __doc__) of a decorated function in ${t}?`,
      options: ["@preserve", "@functools.wraps", "@decorator", "@wraps_meta"],
      correctAnswer: "1",
      explanation: (t) => `@functools.wraps wraps the decorator's inner function to copy over the original function attributes.`
    },
    {
      type: "mcq",
      question: (t) => `Which statement is used to manage setup and cleanup operations in context managers for ${t}?`,
      options: ["try/finally", "with", "using", "async"],
      correctAnswer: "1",
      explanation: (t) => `The 'with' statement invokes context managers (implementing __enter__ and __exit__).`
    },
    {
      type: "mcq",
      question: (t) => `What represents the execution environment of single-threaded concurrency in asyncio for ${t}?`,
      options: ["Thread Pool", "Event Loop", "Process Queue", "Task Scheduler"],
      correctAnswer: "1",
      explanation: (t) => `The event loop manages and schedules the execution of various asynchronous tasks.`
    },
    {
      type: "mcq",
      question: (t) => `How can you run multiple processes in parallel to bypass the Global Interpreter Lock (GIL) for ${t}?`,
      options: ["using threading", "using multiprocessing", "using asyncio", "using recursion"],
      correctAnswer: "1",
      explanation: (t) => `The multiprocessing module spawns separate Python processes, each with its own interpreter and memory space, bypassing the GIL.`
    },
    {
      type: "mcq",
      question: (t) => `What is a metaclass in Python for ${t}?`,
      options: ["A class that inherits from multiple parent classes", "A class whose instances are classes themselves", "A class with only static methods", "A class used to import packages"],
      correctAnswer: "1",
      explanation: (t) => `Metaclasses define the behavior of classes (how classes are created), acting as 'classes of classes'.`
    },
    {
      type: "mcq",
      question: (t) => `What exception is raised when next() is called on an exhausted generator iterator in ${t}?`,
      options: ["StopIteration", "IndexError", "GeneratorExit", "ValueError"],
      correctAnswer: "0",
      explanation: (t) => `StopIteration is raised to signal that the generator has no more items to yield.`
    },
    {
      type: "mcq",
      question: (t) => `Which operator is used to specify type annotations or type hints in variable declarations for ${t}?`,
      options: ["=", ":", "->", "type()"],
      correctAnswer: "1",
      explanation: (t) => `Colons (:) denote type annotations on parameters or variables (e.g. x: int = 5).`
    },
    {
      type: "mcq",
      question: (t) => `What module is the industry standard for writing unit tests in advanced Python projects related to ${t}?`,
      options: ["unittest", "pytest", "nose", "testrunner"],
      correctAnswer: "1",
      explanation: (t) => `pytest is a popular, powerful testing framework featuring clean syntax and rich plugin support.`
    },
    {
      type: "mcq",
      question: (t) => `Which expression applies a specific decorator programmatically at runtime in ${t}?`,
      options: ["decorator(func)", "func = decorator(func)", "apply_decorator(decorator, func)", "@decorator"],
      correctAnswer: "1",
      explanation: (t) => `@decorator syntax is syntactic sugar for assigning 'func = decorator(func)'.`
    },
    {
      type: "mcq",
      question: (t) => `What is the primary benefit of generators over lists for large datasets in ${t}?`,
      options: ["Generators are faster to write", "Generators use lazy evaluation and very little memory", "Generators support index slicing", "Generators are mutable"],
      correctAnswer: "1",
      explanation: (t) => `Generators yield items one-by-one, avoiding loading the entire dataset into memory.`
    },
    {
      type: "mcq",
      question: (t) => `Which module helps build command-line interfaces (CLIs) with flags and arguments in ${t}?`,
      options: ["sys", "argparse", "os", "getopt"],
      correctAnswer: "1",
      explanation: (t) => `The argparse module simplifies the parsing of command-line flags and parameters.`
    },
    {
      type: "mcq",
      question: (t) => `What magic methods are required to make an object a context manager in ${t}?`,
      options: ["__init__ and __del__", "__enter__ and __exit__", "__start__ and __stop__", "__open__ and __close__"],
      correctAnswer: "1",
      explanation: (t) => `__enter__ sets up resources and __exit__ guarantees cleanup or handles errors.`
    },
    {
      type: "mcq",
      question: (t) => `Which module provides functions for creating iterators for efficient looping (like cycle, chain, or count) in ${t}?`,
      options: ["functools", "itertools", "collections", "math"],
      correctAnswer: "1",
      explanation: (t) => `The itertools module provides high-performance iterator algebra utilities.`
    }
  ]
};

const PYTHON_INTERVIEW_TEMPLATES: Record<TopicType, Array<{
  question: (title: string) => string;
  answer: (title: string) => string;
  rubric: (title: string) => string[];
}>> = {
  basics: [
    {
      question: (t) => `Explain the concept of memory reference and object variables in ${t}.`,
      answer: (t) => `Variables in Python are references or labels pointing to objects in memory, rather than containers that hold value. Multiple variables can point to the exact same memory address.`,
      rubric: (t) => ["Variables are references/labels", "Objects reside in memory", "Multiple pointers can reference one object"]
    },
    {
      question: (t) => `Why is ${t} considered dynamically and strongly typed in Python?`,
      answer: (t) => `It is dynamically typed because variable bindings can change types at runtime. It is strongly typed because implicit conversions between incompatible types (like adding a string and an integer) will raise a TypeError rather than performing silent casting.`,
      rubric: (t) => ["Dynamic typing definition", "Strong typing definition", "TypeError raised on invalid operations"]
    },
    {
      question: (t) => `Describe the namespace scoping rules (LEGB rule) in ${t}.`,
      answer: (t) => `Namespaces are searched in order: Local (inside the function), Enclosing (in enclosing functions), Global (module level), and Built-in (built-in functions and constants).`,
      rubric: (t) => ["LEGB stands for Local, Enclosing, Global, Built-in", "Order of namespace lookup", "Use of global/nonlocal keywords to modify variables"]
    },
    {
      question: (t) => `What is the difference between mutable and immutable objects in ${t}?`,
      answer: (t) => `Mutable objects (like lists, dicts, sets) can be altered in-place after creation, modifying their state. Immutable objects (like strings, integers, tuples) cannot be altered; any change creates a new object in memory.`,
      rubric: (t) => ["Mutable vs Immutable definitions", "List/dict vs string/tuple examples", "In-place modifications vs new object allocation"]
    },
    {
      question: (t) => `How do *args and **kwargs parameter arguments work in ${t}?`,
      answer: (t) => `*args allows a function to accept any number of positional arguments as a tuple. **kwargs allows accepting any number of keyword arguments as a dictionary.`,
      rubric: (t) => ["*args collects positional arguments into a tuple", "**kwargs collects keyword arguments into a dict", "Allows writing flexible APIs"]
    },
    {
      question: (t) => `How is automatic garbage collection implemented in Python for ${t}?`,
      answer: (t) => `Python primarily uses reference counting, where an object is deallocated when its reference count drops to zero. It also uses a cyclic garbage collector to detect and clean up reference cycles.`,
      rubric: (t) => ["Reference counting mechanism", "Reference count drops to zero deallocation", "Cyclic garbage collector handles reference cycles"]
    },
    {
      question: (t) => `What is PEP 8 and why is it important when structuring ${t}?`,
      answer: (t) => `PEP 8 is Python's style guide for code. It provides guidelines on spacing, indentation, naming conventions, and line lengths, promoting readability and consistency across codebases.`,
      rubric: (t) => ["Style guide for Python code", "Focuses on code readability and style consistency", "Indentation, variable naming rules"]
    },
    {
      question: (t) => `What are docstrings and how do they differ from normal comments in ${t}?`,
      answer: (t) => `Docstrings are string literals enclosed in triple quotes that document functions, classes, or modules, accessible via the __doc__ attribute. Normal comments (starting with #) are ignored by the compiler and are only for reading source code.`,
      rubric: (t) => ["Docstrings are triple-quoted string literals", "Accessible at runtime via __doc__", "Comments are ignored by compiler"]
    },
    {
      question: (t) => `Explain the difference between imports like 'import module' and 'from module import function' in ${t}.`,
      answer: (t) => `'import module' imports the entire module namespace, requiring prefixing (e.g., module.function()). 'from module import function' imports only the specific function directly into the local namespace.`,
      rubric: (t) => ["import module loads the module namespace", "from module import function loads directly into local namespace", "Namespace pollution prevention"]
    },
    {
      question: (t) => `How does Python's type system handle explicit typecasting for ${t}?`,
      answer: (t) => `Python uses constructor functions like int(), float(), str(), and bool() to instantiate new objects of the target type from the source value. It throws a ValueError if the conversion is impossible.`,
      rubric: (t) => ["Uses constructor functions for casting", "Instantiates a new object", "ValueError on invalid conversion"]
    },
    {
      question: (t) => `Explain what 'None' is and how to check for it in ${t}.`,
      answer: (t) => `None is a built-in constant representing the absence of a value or null state. Since it is a singleton, it should always be checked using the 'is' or 'is not' identity operators.`,
      rubric: (t) => ["None represents absence of value / singleton", "Checked using 'is None' or 'is not None'", "Avoid using '==' for identity comparison"]
    },
    {
      question: (t) => `What is the difference between functions and methods in ${t}?`,
      answer: (t) => `A function is a block of code defined globally or inside a module. A method is a function defined inside a class scope that is bound to class instances (or the class itself) and receives self/cls as its first argument.`,
      rubric: (t) => ["Functions are standalone blocks of code", "Methods are defined inside classes", "Methods receive self or cls references implicitly"]
    },
    {
      question: (t) => `Explain how global variables can be modified inside a local scope for ${t}.`,
      answer: (t) => `To modify a global variable inside a function, you must declare it using the 'global' keyword before assignment. Without it, assignment creates a new local variable.`,
      rubric: (t) => ["Use of 'global' keyword", "Prevents shadowing by creating local bindings", "Modifying global state best practices"]
    },
    {
      question: (t) => `What are namespaces and why are they used in ${t}?`,
      answer: (t) => `Namespaces are mapping dictionaries that map names to objects, ensuring names are unique within a scope and preventing naming conflicts across different modules.`,
      rubric: (t) => ["Mapping of names to objects", "Implemented as dictionaries", "Prevents naming collisions"]
    },
    {
      question: (t) => `Explain how the help() and dir() built-ins assist in analyzing ${t}.`,
      answer: (t) => `dir() lists the valid attributes and methods of an object. help() invokes the built-in documentation viewer to display docstrings and utility metadata for the object.`,
      rubric: (t) => ["dir() lists attributes and methods", "help() reads and formats docstrings", "Aids in interactive debugging"]
    }
  ],
  structures: [
    {
      question: (t) => `What is the difference between a list and a tuple in ${t}?`,
      answer: (t) => `Lists are mutable sequences, meaning they can be modified in-place. Tuples are immutable, making them hashable, safer from side-effects, and slightly more memory-efficient.`,
      rubric: (t) => ["Lists are mutable", "Tuples are immutable", "Tuples are hashable and can be dict keys"]
    },
    {
      question: (t) => `How do dictionaries work internally in Python for ${t}?`,
      answer: (t) => `Dictionaries are implemented as hash tables. They hash keys to determine their bucket indices, allowing O(1) average time complexity for lookups, insertions, and deletions.`,
      rubric: (t) => ["Hash table implementation", "Keys must be hashable", "O(1) average lookup complexity"]
    },
    {
      question: (t) => `Explain sets and their primary use cases in ${t}.`,
      answer: (t) => `Sets are unordered collections of unique, hashable elements. They are used for membership testing, removing duplicates, and mathematical set operations (union, intersection, difference).`,
      rubric: (t) => ["Unordered collections of unique elements", "Used for membership testing O(1)", "Supports mathematical set operations"]
    },
    {
      question: (t) => `How does Python's list slicing work under the hood for ${t}?`,
      answer: (t) => `Slicing list[start:stop:step] creates a new list containing references to the sliced subset of the original list. Slicing does not copy the objects themselves (shallow copy).`,
      rubric: (t) => ["Slicing creates a new list object", "Shallow copy of references", "Step parameter controls stride"]
    },
    {
      question: (t) => `What is collections.defaultdict and how does it differ from a standard dict in ${t}?`,
      answer: (t) => `defaultdict is a subclass of the built-in dict. It overrides __missing__ to automatically initialize missing keys with a default value using a provided factory function (like list or int).`,
      rubric: (t) => ["Subclass of dict", "Initializes missing keys automatically", "Accepts a factory function parameter"]
    },
    {
      question: (t) => `Explain the time complexity of checking membership in a list versus a set for ${t}.`,
      answer: (t) => `Checking membership (item in container) in a list is O(N) because it performs a linear search. In a set, it is O(1) on average because it uses hash table lookups.`,
      rubric: (t) => ["List membership is O(N) (linear)", "Set membership is O(1) (hash lookup)", "Set search speed is independent of size"]
    },
    {
      question: (t) => `How do you merge two dictionaries in Python 3.9+ for ${t}?`,
      answer: (t) => `In Python 3.9+, you can use the union operator '|' to merge two dictionaries (e.g., dict1 | dict2) or the update union operator '|=' to merge in-place.`,
      rubric: (t) => ["Use of '|' operator for merge", "Use of '|=' for in-place update", "Later dict values overwrite earlier ones"]
    },
    {
      question: (t) => `What are list comprehensions and when should you avoid them in ${t}?`,
      answer: (t) => `List comprehensions provide a concise way to create lists from iterables. They should be avoided when the logic is overly complex, reducing readability, or when a generator expression is better for memory.`,
      rubric: (t) => ["Concise syntax for list generation", "Avoid when nested or highly complex", "Prefer generators for large/infinite datasets"]
    },
    {
      question: (t) => `Explain what a shallow copy is versus a deep copy in ${t}.`,
      answer: (t) => `A shallow copy (copy.copy()) constructs a new collection but inserts references to the original objects. A deep copy (copy.deepcopy()) recursively copies all child objects, creating a completely independent copy.`,
      rubric: (t) => ["Shallow copy copies container only", "Deep copy copies container and child objects recursively", "Impact on nested lists/dicts"]
    },
    {
      question: (t) => `How does the sorting algorithm (Timsort) in Python work for ${t}?`,
      answer: (t) => `Timsort is a hybrid sorting algorithm derived from merge sort and insertion sort. It is optimized to find pre-sorted runs of data, offering O(N) best case and O(N log N) worst case time complexity.`,
      rubric: (t) => ["Hybrid of merge and insertion sort", "Finds pre-sorted runs of data", "Time complexity: O(N) best, O(N log N) worst"]
    },
    {
      question: (t) => `What is the collections.Counter class and what is it used for in ${t}?`,
      answer: (t) => `Counter is a dict subclass for counting hashable objects. Elements are stored as dictionary keys and their counts are stored as dictionary values.`,
      rubric: (t) => ["dict subclass for counting items", "Elements as keys, counts as values", "Provides utility methods like most_common()"]
    },
    {
      question: (t) => `Explain how to implement a Stack and a Queue using built-in types in ${t}.`,
      answer: (t) => `A Stack can be implemented using a standard list with append() and pop(). A Queue is best implemented using collections.deque with append() and popleft() to maintain O(1) performance.`,
      rubric: (t) => ["Stack uses list with append() / pop()", "Queue uses collections.deque", "List pop(0) is O(N) and should be avoided for queues"]
    },
    {
      question: (t) => `How does Python handle memory allocation for lists as they grow in ${t}?`,
      answer: (t) => `Python lists are over-allocated dynamic arrays. When a list is full and a new item is appended, Python allocates a larger block of memory with exponential growth and copies the references.`,
      rubric: (t) => ["Dynamic array implementation", "Over-allocation to avoid constant resizing", "Amortized O(1) append time complexity"]
    },
    {
      question: (t) => `What are hashable objects and why must dictionary keys be hashable in ${t}?`,
      answer: (t) => `An object is hashable if it has a hash value that never changes during its lifetime (requires __hash__ and __eq__ methods). Keys must be hashable so the dictionary can reliably locate them in the hash table.`,
      rubric: (t) => ["Hash value remains constant", "Requires __hash__ and __eq__", "Immutable types are hashable"]
    },
    {
      question: (t) => `Explain the use and performance characteristics of the collections.deque class in ${t}.`,
      answer: (t) => `deque is a double-ended queue implemented as a doubly-linked list. It provides O(1) insertions and deletions at both ends, unlike lists which take O(N) to insert/delete at the beginning.`,
      rubric: (t) => ["Double-ended queue", "O(1) appends and pops at both ends", "O(N) random access index lookup"]
    }
  ],
  logic: [
    {
      question: (t) => `Explain the execution flow of a try-except-else-finally block in ${t}.`,
      answer: (t) => `Code in the try block runs first. If an exception occurs, the except block runs. If no exception occurs, the else block runs. The finally block always runs at the end, regardless of what happened.`,
      rubric: (t) => ["try contains risky code", "except runs on exception", "else runs only on no exception", "finally runs in all scenarios"]
    },
    {
      question: (t) => `What is the difference between break, continue, and pass in ${t}?`,
      answer: (t) => `break exits the innermost loop immediately. continue skips the remaining code in the current iteration and starts the next iteration. pass is a placeholder statement that does nothing.`,
      rubric: (t) => ["break terminates loop", "continue skips current loop pass", "pass is a syntactical placeholder"]
    },
    {
      question: (t) => `Explain short-circuit evaluation in logical expressions for ${t}.`,
      answer: (t) => `Short-circuit evaluation means logical operators (and/or) stop evaluating as soon as the outcome is determined. E.g., in 'False and x', 'x' is not evaluated because the result must be False.`,
      rubric: (t) => ["and stops on first False", "or stops on first True", "Avoids evaluating unnecessary expressions"]
    },
    {
      question: (t) => `What is the difference between the '==' and 'is' operators in ${t}?`,
      answer: (t) => `'==' compares the values of two objects to check if they are equal. 'is' compares their object identities (memory addresses) to check if they are the exact same object.`,
      rubric: (t) => ["'==' checks value equality", "'is' checks reference/identity equality", "id() is compared under the hood for 'is'"]
    },
    {
      question: (t) => `Explain how to implement and raise custom exceptions in ${t}.`,
      answer: (t) => `Custom exceptions are created by defining a new class that inherits from the built-in Exception class. They are triggered using the 'raise' keyword.`,
      rubric: (t) => ["Inherit from Exception base class", "Use the 'raise' keyword", "Can override __init__ or __str__ to pass metadata"]
    },
    {
      question: (t) => `What is the difference between catching base Exception versus catching specific exceptions in ${t}?`,
      answer: (t) => `Catching base Exception catches almost all errors, which can swallow unexpected bugs and make debugging difficult. Catching specific exceptions (e.g. ValueError) handles only anticipated errors.`,
      rubric: (t) => ["Catching Exception catches all standard errors", "Specific exception handling targets known points of failure", "Avoid bare except: clauses"]
    },
    {
      question: (t) => `Explain how the 'with' statement works as a control flow mechanism in ${t}.`,
      answer: (t) => `The 'with' statement simplifies exception handling by encapsulating common prep and cleanup tasks. It calls the context manager's __enter__ method on entry and __exit__ on exit, even if exceptions are raised.`,
      rubric: (t) => ["Context manager abstraction", "Calls __enter__ and __exit__", "Guarantees resource cleanup (e.g., closing files)"]
    },
    {
      question: (t) => `How does recursion work in Python and what is the recursion limit in ${t}?`,
      answer: (t) => `Recursion occurs when a function calls itself to solve smaller subproblems. Python has a default recursion limit (usually 1000) to prevent infinite recursion from blowing the stack.`,
      rubric: (t) => ["Function calling itself", "Requires base case and recursive step", "Recursion limit prevents stack overflow"]
    },
    {
      question: (t) => `What are truthy and falsy values, and how are they checked in logical expressions in ${t}?`,
      answer: (t) => `Values that evaluate to False in a boolean context are falsy (None, False, 0, empty collections). All other values are truthy. They are evaluated implicitly in conditions like 'if container:'.`,
      rubric: (t) => ["Falsy values: None, False, 0, empty containers", "All other values are truthy", "Implicit truthiness checks are preferred"]
    },
    {
      question: (t) => `How does a while-else or for-else loop work in Python for ${t}?`,
      answer: (t) => `The else block of a loop runs only if the loop completes all iterations normally without encountering a break statement. If a break is executed, the else block is skipped.`,
      rubric: (t) => ["else block runs on natural loop completion", "else block is skipped if break is encountered", "Useful for search loops"]
    },
    {
      question: (t) => `Explain the difference between a SyntaxError and a ValueError in ${t}.`,
      answer: (t) => `A SyntaxError is raised by the parser when it encounters invalid code structure during parsing. A ValueError is raised at runtime when a function receives an argument of the correct type but invalid value (e.g. int("abc")).`,
      rubric: (t) => ["SyntaxError is a parsing-stage error", "ValueError is a runtime data error", "Invalid grammar vs invalid value"]
    },
    {
      question: (t) => `How do you handle nested exceptions or chain exceptions in ${t}?`,
      answer: (t) => `You can chain exceptions using the 'raise NewException from OldException' syntax. This sets the __cause__ attribute, preserving the original exception trace in the traceback.`,
      rubric: (t) => ["Use of 'raise ... from ...' syntax", "Sets the __cause__ attribute", "Preserves exception history and context"]
    },
    {
      question: (t) => `Explain the purpose of raising a NotImplementedError in ${t}.`,
      answer: (t) => `NotImplementedError is a built-in exception raised to indicate that an abstract method or class interface requires overriding in concrete subclasses.`,
      rubric: (t) => ["Raised in abstract methods or base classes", "Signals that subclasses must override the method", "Distinct from NotImplemented constant"]
    },
    {
      question: (t) => `How does the conditional expression (ternary operator) work in ${t}?`,
      answer: (t) => `Python's ternary operator follows the syntax: 'value_if_true if condition else value_if_false'. It evaluates the condition first and returns the corresponding value.`,
      rubric: (t) => ["Syntax: x if condition else y", "Evaluated lazily (short-circuit)", "Used for simple assignments"]
    },
    {
      question: (t) => `Explain how exception handling affects performance in ${t}.`,
      answer: (t) => `In Python, try-except blocks have negligible overhead if no exception is raised. However, catching an exception is relatively expensive due to creating the traceback object and shifting stack frames.`,
      rubric: (t) => ["Zero-cost exceptions in modern Python when no error occurs", "Raising and catching exceptions incurs stack/traceback overhead", "Avoid using exceptions for normal control flow"]
    }
  ],
  oop: [
    {
      question: (t) => `Explain the difference between __init__ and __new__ in ${t}.`,
      answer: (t) => `__new__ is a static method responsible for creating and returning a new object instance (the allocator). __init__ is an instance method that initializes the attributes of that created instance.`,
      rubric: (t) => ["__new__ allocates the object and returns it", "__init__ initializes the object state", "__new__ is called before __init__"]
    },
    {
      question: (t) => `How does multiple inheritance work in Python and how is MRO resolved for ${t}?`,
      answer: (t) => `Python supports multiple inheritance, resolving attributes using Method Resolution Order (MRO) via the C3 Linearization algorithm. You can check the MRO of a class via the __mro__ attribute.`,
      rubric: (t) => ["MRO defines search order for classes", "Resolved using C3 Linearization", "__mro__ or mro() method to inspect"]
    },
    {
      question: (t) => `What are descriptor classes and how do they work in ${t}?`,
      answer: (t) => `Descriptors are classes that define any of the methods __get__(), __set__(), or __delete__(). They are used to customize attribute access, binding logic to attribute lookup.`,
      rubric: (t) => ["Implements __get__, __set__, or __delete__", "Used to customize attribute access", "Underpins properties, classmethods, and methods"]
    },
    {
      question: (t) => `Explain encapsulation in Python and how private variables are managed in ${t}.`,
      answer: (t) => `Encapsulation restricts direct access to object state. Python doesn't have strict access modifiers; instead, double underscore prefixing triggers name mangling to protect attributes from accidental override.`,
      rubric: (t) => ["Restricting access to object internals", "Double underscore prefix triggers name mangling", "_ClassName__variable format"]
    },
    {
      question: (t) => `What is the difference between staticmethod and classmethod in ${t}?`,
      answer: (t) => `@classmethod receives the class object (cls) as its first argument and can access class state. @staticmethod receives no implicit first argument, acting like a normal function nested inside the class namespace.`,
      rubric: (t) => ["@classmethod receives cls reference", "@staticmethod receives no implicit first argument", "@classmethod can act as alternative constructors"]
    },
    {
      question: (t) => `Explain abstract classes and interfaces in Python, and how they relate to ${t}.`,
      answer: (t) => `Abstract classes are classes that cannot be instantiated and define abstract methods that subclasses must override. They are defined using the 'abc' module and the @abstractmethod decorator.`,
      rubric: (t) => ["Defined using abc module", "@abstractmethod decorator", "Enforces class interfaces at instantiation time"]
    },
    {
      question: (t) => `What is polymorphism and how does Python support it in ${t}?`,
      answer: (t) => `Polymorphism is the ability to present the same interface for different underlying forms. Python supports it through inheritance and duck typing (priority on method existence over class type).`,
      rubric: (t) => ["Same interface name for different class types", "Inheritance-based polymorphism", "Duck typing-based polymorphism"]
    },
    {
      question: (t) => `Explain how @property works as a getter/setter in ${t}.`,
      answer: (t) => `The @property decorator exposes a method as a class attribute. Companion decorators like @attribute.setter allow configuring setter methods to validate values before assignment.`,
      rubric: (t) => ["@property creates getter attribute", "@name.setter creates setter attribute", "Encapsulates attribute access with logic"]
    },
    {
      question: (t) => `What is the difference between __str__ and __repr__ in ${t}?`,
      answer: (t) => `__str__ returns a user-friendly, readable string representation of the object. __repr__ returns an unambiguous representation (often valid Python code) intended for debugging and development.`,
      rubric: (t) => ["__str__ is for end-users", "__repr__ is for developers/debugging", "print() falls back to __repr__ if __str__ is undefined"]
    },
    {
      question: (t) => `What are dunder/magic methods and how do you overload operators in ${t}?`,
      answer: (t) => `Dunder (double underscore) methods are special built-in hooks that Python calls on specific operators (e.g. __add__ for +). Overloading operators means defining these dunder methods on custom classes.`,
      rubric: (t) => ["Dunder methods are hooks like __add__ or __len__", "Operator overloading matches syntax to method hooks", "Aids class integration with built-in functions"]
    },
    {
      question: (t) => `Explain what dataclasses are and their advantages in ${t}.`,
      answer: (t) => `Dataclasses (via @dataclass decorator) generate boilerplate methods automatically based on variable type annotations, simplifying the creation of classes meant to hold structured data.`,
      rubric: (t) => ["Decorated with @dataclass", "Generates __init__, __repr__, __eq__, etc.", "Reduces boilerplate for data containers"]
    },
    {
      question: (t) => `How does inheritance differ from composition in ${t}?`,
      answer: (t) => `Inheritance ('is-a' relationship) allows a subclass to inherit attributes and methods from a parent class. Composition ('has-a' relationship) constructs complex classes by referencing instances of other classes.`,
      rubric: (t) => ["Inheritance is 'is-a' relation", "Composition is 'has-a' relation", "Composition is generally preferred for flexibility"]
    },
    {
      question: (t) => `What is super() and how does it resolve parent class methods in ${t}?`,
      answer: (t) => `super() returns a proxy object that delegates method calls to parent or sibling classes. It resolves the search order based on the current class's Method Resolution Order (MRO).`,
      rubric: (t) => ["Returns proxy object delegating to parent/siblings", "Follows the Method Resolution Order (MRO)", "Handles cooperative multiple inheritance call chains"]
    },
    {
      question: (t) => `Explain name mangling in Python and when it occurs in ${t}.`,
      answer: (t) => `Name mangling happens when a class attribute is prefixed with two leading underscores (and no more than one trailing). Python rewrites it as _ClassName__attribute to avoid name clashes in subclasses.`,
      rubric: (t) => ["Triggered by double leading underscores", "Rewrites attribute as _ClassName__attribute", "Protects namespace from subclass overrides"]
    },
    {
      question: (t) => `What are slots (__slots__) and how do they optimize memory in ${t}?`,
      answer: (t) => `__slots__ is a class-level list of attributes that replaces the instance's dynamic __dict__, allocating a fixed amount of memory for attributes and disabling dynamic attribute additions.`,
      rubric: (t) => ["Replaces default instance __dict__", "Allocates static memory for a list of attributes", "Optimizes memory footprint of class instances"]
    }
  ],
  advanced: [
    {
      question: (t) => `Explain the Global Interpreter Lock (GIL) and its implications in ${t}.`,
      answer: (t) => `The GIL is a mutex lock in the CPython interpreter that ensures only one thread executes Python bytecode at any given time. This makes multi-threaded CPU-bound programs single-threaded in practice.`,
      rubric: (t) => ["CPython mutex lock restricting bytecode execution", "Allows only one thread active at a time", "Aids memory management safety but limits CPU parallelism"]
    },
    {
      question: (t) => `What is the difference between threading, multiprocessing, and asyncio in ${t}?`,
      answer: (t) => `multiprocessing spawns separate OS processes to bypass the GIL for CPU-bound tasks. threading uses OS threads, ideal for blocking I/O tasks. asyncio uses single-threaded cooperative event loops for non-blocking I/O.`,
      rubric: (t) => ["multiprocessing uses processes (no GIL limit)", "threading uses threads (GIL-bound)", "asyncio uses single-threaded event loops (cooperative multitasking)"]
    },
    {
      question: (t) => `Explain how generators work and what the yield keyword does in ${t}.`,
      answer: (t) => `Generators are functions that yield values lazily on demand. The yield keyword suspends function execution, returns a value to the caller, and remembers the local state to resume from that point on next().`,
      rubric: (t) => ["Generators evaluate lazily to save memory", "yield returns value and pauses state", "next() resumes from the yield point"]
    },
    {
      question: (t) => `What are decorators and how do they work under the hood in ${t}?`,
      answer: (t) => `Decorators are functions that take another function as an argument, extend or wrap its behavior, and return a new callable function object. Under the hood, @dec syntax is sugar for 'func = dec(func)'.`,
      rubric: (t) => ["Functions wrapping other functions", "Accept and return callables", "Syntactic sugar for 'func = decorator(func)'"]
    },
    {
      question: (t) => `Explain the event loop in asyncio for ${t}.`,
      answer: (t) => `The event loop is the core of asyncio. It runs in a single thread and schedules the execution of various coroutines, monitoring I/O tasks and running callbacks when I/O operations complete.`,
      rubric: (t) => ["Core engine of asyncio", "Schedules and monitors cooperative coroutines", "Runs on a single thread to perform non-blocking operations"]
    },
    {
      question: (t) => `What are metaclasses and when should they be used in ${t}?`,
      answer: (t) => `Metaclasses are classes that define the structure and behavior of other classes (the class of a class). They inherit from 'type' and are used to customize or validate class creation.`,
      rubric: (t) => ["Classes of classes (inherit from type)", "Hook into class creation via __new__ or __init__", "Used for API validation or class registries"]
    },
    {
      question: (t) => `Explain how the garbage collector handles cyclic references in ${t}.`,
      answer: (t) => `CPython's reference counting cannot detect circular references (e.g. A references B, and B references A). To handle this, a generational garbage collector detects cycles by periodically traversing object pointers.`,
      rubric: (t) => ["Reference counting fails on cyclic references", "Generational cyclic garbage collector checks pointers", "Generations 0, 1, and 2 track lifespan"]
    },
    {
      question: (t) => `What are closures and how do they retain state in ${t}?`,
      answer: (t) => `A closure is an inner function that retains references to variables from its outer enclosing lexical scope, even after the outer function has completed execution.`,
      rubric: (t) => ["Inner function referencing outer variables", "Lexical environment binding", "Variables persist in memory for the inner function"]
    },
    {
      question: (t) => `What is the purpose of @functools.wraps in ${t}?`,
      answer: (t) => `@functools.wraps is a decorator applied to the inner wrapper function of a custom decorator. It copies the name, docstring, and annotations of the original function so metadata is not lost.`,
      rubric: (t) => ["Decorator for wrapper functions", "Copies metadata (e.g., __name__, __doc__)", "Ensures debugging and introspection tools work correctly"]
    },
    {
      question: (t) => `Explain the difference between an iterable and an iterator in ${t}.`,
      answer: (t) => `An iterable is any object that can return an iterator (defines __iter__()). An iterator is an object that yields elements sequentially and maintains its traversal state (defines __next__() and __iter__()).`,
      rubric: (t) => ["Iterable implements __iter__", "Iterator implements __next__ and __iter__", "Iterators raise StopIteration when exhausted"]
    },
    {
      question: (t) => `How does Python manage memory internally for objects in ${t}?`,
      answer: (t) => `Python uses a private heap containing all objects. The Python memory manager (PyMalloc) manages allocations for small objects, while the OS allocator handles larger blocks. Reference counting and GC clean up.`,
      rubric: (t) => ["Private heap space for Python objects", "PyMalloc handles allocations for small objects (<512 bytes)", "Reference counting and cyclic GC deallocate memory"]
    },
    {
      question: (t) => `Explain context managers and how to write a custom context manager in ${t}.`,
      answer: (t) => `Context managers allocate and clean up resources automatically. They are written by implementing __enter__() and __exit__() methods on a class, or by decorating a generator function with @contextmanager.`,
      rubric: (t) => ["Automate resource allocation and cleanup", "Implement __enter__ and __exit__ magic methods", "Alternative: @contextmanager decorator"]
    },
    {
      question: (t) => `What are type hints and how does mypy verify them in ${t}?`,
      answer: (t) => `Type hints are optional annotations (e.g., x: int) that document the expected types of variables, parameters, and return values. mypy is a static type checker that analyzes the source code to verify type safety without executing it.`,
      rubric: (t) => ["Optional annotations for code documentation", "Checked statically (offline) by checkers like mypy", "Ignored by the Python interpreter at runtime"]
    },
    {
      question: (t) => `Explain how package distribution works in Python (pip, wheels, PyPI) for ${t}.`,
      answer: (t) => `Developers upload packages to the Python Package Index (PyPI) in source distribution or pre-built binary format (Wheels). pip downloads wheels or builds source code to install dependencies.`,
      rubric: (t) => ["PyPI acts as package index registry", "Wheels (.whl) are pre-compiled binary packages", "pip handles downloading and dependency graph resolution"]
    },
    {
      question: (t) => `Explain the 'yield from' expression in generators in ${t}.`,
      answer: (t) => `'yield from iterable' delegates the generator's execution to a sub-generator or iterable, yielding its values directly and allowing bi-directional data flow between caller and sub-generator.`,
      rubric: (t) => ["Delegates yield operations to a sub-generator/iterable", "Avoids loop boilerplate over sub-generator", "Establishes a bi-directional channel for send() and throw()"]
    }
  ]
};

// Merges template-generated quizzes and interviews into topic pools
function getPooledQuizzesAndInterviews(
  topicId: string,
  title: string,
  type: TopicType,
  existingQuizzes: QuizQuestion[],
  existingInterviews: InterviewQuestion[]
): { quizzes: QuizQuestion[]; interviews: InterviewQuestion[] } {
  const finalQuizzes = [...existingQuizzes];
  const finalInterviews = [...existingInterviews];

  const quizTemplates = PYTHON_QUIZ_TEMPLATES[type] || [];
  const interviewTemplates = PYTHON_INTERVIEW_TEMPLATES[type] || [];

  // Add generated quizzes until we have at least 15
  let quizIndex = 0;
  while (finalQuizzes.length < 15 && quizIndex < quizTemplates.length) {
    const template = quizTemplates[quizIndex];
    const genId = `gen_q_${topicId}_${quizIndex}`;
    if (!finalQuizzes.some((q) => q.id === genId)) {
      finalQuizzes.push({
        id: genId,
        type: template.type,
        question: template.question(title),
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation(title)
      });
    }
    quizIndex++;
  }

  // Add generated interviews until we have at least 15
  let interviewIndex = 0;
  while (finalInterviews.length < 15 && interviewIndex < interviewTemplates.length) {
    const template = interviewTemplates[interviewIndex];
    const genQuestion = template.question(title);
    if (!finalInterviews.some((i) => i.question === genQuestion)) {
      finalInterviews.push({
        question: genQuestion,
        answer: template.answer(title),
        rubric: template.rubric(title)
      });
    }
    interviewIndex++;
  }

  return { quizzes: finalQuizzes, interviews: finalInterviews };
}

// Build the complete 68-topic curriculum list, weaving in detailed hand-written content where available
function buildCurriculum(): CurriculumTopic[] {
  return METADATA_ROADMAP.map((meta) => {
    // Check if we have a detailed curriculum topic with this ID
    const detailed = DETAILED_TOPICS.find((t) => t.id === meta.id);
    const baseTopic: CurriculumTopic = detailed
      ? {
          ...detailed,
          phase: meta.phase,
          title: meta.title,
          duration: meta.duration,
          difficulty: meta.difficulty,
          type: meta.type as TopicType,
          chaosExercises: [detailed.chaosExercise]
        }
      : (() => {
          const generated = generateFallbackTopic(meta);
          return { ...generated, chaosExercises: [generated.chaosExercise] };
        })();

    // Merge extra chaos variants if available for this topic
    const extras = EXTRA_CHAOS_VARIANTS[meta.id];
    if (extras && extras.length > 0) {
      baseTopic.chaosExercises = [baseTopic.chaosExercise, ...extras];
    }

    // Populate dynamic 15+ question pools for quizzes and interviews
    const pooled = getPooledQuizzesAndInterviews(
      meta.id,
      meta.title,
      meta.type as TopicType,
      baseTopic.quizzes,
      baseTopic.interviews
    );
    baseTopic.quizzes = pooled.quizzes;
    baseTopic.interviews = pooled.interviews;

    return baseTopic;
  });
}

// Export the complete interactive curriculum
export const PYTHON_CURRICULUM = buildCurriculum();
