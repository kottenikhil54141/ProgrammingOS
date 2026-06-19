/**
 * Python Curriculum Classes
 * Represents the structured learning path for Python programming
 */

export interface PythonTopic {
  id: string;
  title: string;
  phase: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objectives: string[];
  theory: string;
  examples: PythonExample[];
  templateCode: string;
  videoUrl: string;
  chaosExercise: ChaosBugExercise;
  quizzes: QuizItem[];
  interviews: InterviewQuestion[];
}

export interface PythonExample {
  title: string;
  description: string;
  code: string;
}

export interface ChaosBugExercise {
  id: string;
  title: string;
  description: string;
  brokenCode: string;
  correctCode: string;
  validationScript: string;
}

export interface QuizItem {
  id: string;
  type: "mcq" | "predict" | "arrange";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  rubric: string[];
}

/**
 * Python Curriculum Classes for structured learning
 */

export class PythonCurriculum {
  static readonly PHASES = [
    "Phase 1: Foundations",
    "Phase 2: Control Flow",
    "Phase 3: Data Structures",
    "Phase 4: Functions",
    "Phase 5: Modules & Files",
    "Phase 6: OOP Structures",
    "Phase 7: Advanced Python",
    "Phase 8: Standard Library",
  ];

  static readonly TOPICS: PythonTopic[] = [
    {
      id: "py_intro",
      title: "Python Introduction",
      phase: "Phase 1: Foundations",
      duration: "15 mins",
      difficulty: "Beginner",
      objectives: [
        "Understand what Python is and its design philosophy",
        "Learn basic syntax, indentation, and comments",
        "Print output to the console and work with basic types",
      ],
      theory: `### 🐍 Welcome to Python

Python is an **interpreted, high-level, general-purpose programming language** created by Guido van Rossum. Its design philosophy emphasizes **code readability** using indentation instead of curly braces.

#### Key Features:
- **Easy to learn**: Clear syntax that resembles natural English
- **Expressive**: Do more with fewer lines of code
- **Versatile**: Used in web development, data science, AI/ML, automation, and more
- **Interpreted**: No compilation needed; run code directly

#### Indentation Structure
Unlike other languages, Python uses consistent spacing (indentation) to define block scopes:

\`\`\`python
if True:
    print("This indentation defines the inner block!")
    if True:
        print("Nested blocks also use indentation")
\`\`\`

#### Comments in Python
Comments help explain your code:
\`\`\`python
# This is a single-line comment
\"\"\"
This is a multi-line comment or docstring.
It can span multiple lines.
\"\"\"
\`\`\``,
      examples: [
        {
          title: "Hello World & Print",
          description: "Practice sending formatted strings to the console output.",
          code:
            "print('Welcome to NIK\\'s AI Python System!')\nprint('This is a multi-line output practice.')\nprint('Python rocks!')",
        },
        {
          title: "Simple Mathematical Operations",
          description: "Perform basic mathematical computations in Python.",
          code:
            "a = 15\nb = 4\nprint('Sum:', a + b)\nprint('Floor Division:', a // b)\nprint('Exponentiation:', a ** b)\nprint('Modulo:', a % b)",
        },
        {
          title: "String Operations",
          description: "Learn how to work with text strings.",
          code:
            "name = 'Python'\nprint('Hello ' + name)\nprint(name.upper())\nprint(name.lower())\nprint(len(name))",
        },
      ],
      templateCode: `# Welcome to Python!
# Print a greeting to the terminal
print("Welcome to ProgrammingOS!")

# Simple calculations
result = (5 + 3) * 2
print("Result is:", result)

# String manipulation
greeting = "Hello, World!"
print(greeting)
`,
      videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
      chaosExercise: {
        id: "chaos_intro",
        title: "The Indentation Trap",
        description:
          "Find the misplaced indentation block that throws an IndentationError and correct it.",
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
`,
      },
      quizzes: [
        {
          id: "q_intro_1",
          type: "mcq",
          question: "How does Python define blocks of code?",
          options: ["Curly braces {}", "Indentation (whitespace)", "Semicolons ;", "Parentheses ()"],
          correctAnswer: "1",
          explanation: "Python uses consistent whitespace/indentation to establish scopes, not braces.",
        },
        {
          id: "q_intro_2",
          type: "predict",
          question: "What will be printed? print('Hello' + ' ' + 'World')",
          correctAnswer: "Hello World",
          explanation: "String concatenation combines strings together with the + operator.",
        },
      ],
      interviews: [
        {
          question: "Why is Python described as an interpreted language?",
          answer:
            "Python code is executed line-by-line by the Python interpreter at runtime, rather than being compiled into machine code before execution.",
          rubric: ["Mentions line-by-line execution", "References runtime vs compile-time"],
        },
        {
          question: "Explain the importance of indentation in Python.",
          answer:
            "Indentation is not just for readability in Python—it is syntactically significant and defines code blocks. Functions, loops, and conditionals are structured entirely through indentation.",
          rubric: ["Mentions syntactic significance", "Discusses code blocks"],
        },
      ],
    },

    {
      id: "py_variables",
      title: "Variables & Memory Reference",
      phase: "Phase 1: Foundations",
      duration: "20 mins",
      difficulty: "Beginner",
      objectives: [
        "Understand variables as label references rather than boxes",
        "Inspect variable address identifiers using the id() method",
        "Learn distinction between mutable and immutable assignments",
      ],
      theory: `### 📦 Variables as Label References

In Python, variables are references or pointer labels to objects residing in Heap memory. They do not reserve direct stack containers like statically typed languages.

#### How Variables Work
A variable name is simply a label pointing to an object in memory:
\`\`\`python
x = 42  # x points to the integer object 42
y = x   # y points to the SAME integer object
print(x is y)  # True - same object in memory
\`\`\`

#### Object Identity with id()
Use the \`id()\` function to retrieve the integer identity of the object address in memory:
\`\`\`python
a = [1, 2, 3]
b = a  # points to the exact same list address!
print(id(a) == id(b))  # True - same memory address

c = [1, 2, 3]  # Different list with same contents
print(id(a) == id(c))  # False - different addresses
\`\`\`

#### Mutable vs Immutable
- **Immutable**: int, str, tuple (can't change in-place)
- **Mutable**: list, dict, set (can change in-place)
\`\`\`python
x = 10
x = 20  # Creates new object, x now points to different address

numbers = [1, 2]
numbers.append(3)  # Modifies existing object in-place
\`\`\``,
      examples: [
        {
          title: "Object Identity (id)",
          description: "Compare memory address identifiers for integer references.",
          code:
            "x = 100\ny = x\nprint('x address:', id(x))\nprint('y address:', id(y))\nprint('Point to same object?', id(x) == id(y))",
        },
        {
          title: "List Reference Mutation",
          description: "Observe how mutating a list alters shared pointers.",
          code:
            "list_a = [10, 20]\nlist_b = list_a\nlist_b.append(30)\nprint('list_a is:', list_a)\nprint('list_b is:', list_b)\nprint('Same address?', id(list_a) == id(list_b))",
        },
        {
          title: "String Immutability",
          description: "Strings cannot be modified; new strings are created instead.",
          code:
            'text = "Hello"\nprint("Original id:", id(text))\ntext = text + " World"\nprint("New id:", id(text))\nprint("IDs are different?", True)',
        },
      ],
      templateCode: `# Memory address bindings
a = 10
b = a
print("a points to:", id(a))
print("b points to:", id(b))
print("Same address:", id(a) == id(b))

# Lists (mutable)
list1 = [1, 2]
list2 = list1
list2.append(3)
print("list1:", list1)  # Also modified!
print("list2:", list2)
`,
      videoUrl: "https://www.youtube.com/embed/mKOrixR6Lp4",
      chaosExercise: {
        id: "chaos_var",
        title: "Shared Reference Mutation Bug",
        description:
          "VIP users modifications accidentally affect guest lists. Resolve the bug using a copy constructor.",
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
`,
      },
      quizzes: [
        {
          id: "q_var_1",
          type: "mcq",
          question: "Which data structure is mutable in Python?",
          options: ["String", "Tuple", "List", "Integer"],
          correctAnswer: "2",
          explanation: "Lists can be updated in-place, while strings and tuples are immutable.",
        },
      ],
      interviews: [
        {
          question: "What does the 'is' operator evaluate in Python?",
          answer:
            "The 'is' operator checks for identity comparison (whether two references point to the exact same object address in memory), whereas '==' checks for value equality.",
          rubric: ["Checks address identity", "Different from value equality"],
        },
      ],
    },

    {
      id: "py_data_types",
      title: "Data Types & Type Conversion",
      phase: "Phase 1: Foundations",
      duration: "25 mins",
      difficulty: "Beginner",
      objectives: [
        "Understand Python's built-in data types",
        "Learn type conversion and casting",
        "Work with numbers, strings, and booleans",
      ],
      theory: `### 🏷️ Python Data Types

Python has several built-in data types:

#### Numbers
- **int**: Integers (whole numbers)
- **float**: Floating-point (decimals)
- **complex**: Complex numbers

\`\`\`python
x = 10  # int
y = 3.14  # float
z = 2 + 3j  # complex
\`\`\`

#### Strings
- Immutable sequences of characters
- Can use single, double, or triple quotes

\`\`\`python
s1 = 'Hello'
s2 = "World"
s3 = '''Multi
line
string'''
\`\`\`

#### Booleans
- True or False values
- Result of comparisons

\`\`\`python
x = True
y = 5 > 3  # True
z = 5 < 3  # False
\`\`\`

#### Type Conversion
Convert between types using type functions:
\`\`\`python
int("42")  # "42" -> 42
str(42)    # 42 -> "42"
float("3.14")  # "3.14" -> 3.14
bool(1)    # 1 -> True
\`\`\``,
      examples: [
        {
          title: "Working with Numbers",
          description: "Perform calculations with different numeric types.",
          code:
            "x = 10\ny = 3.5\nprint(x + y)\nprint(x * y)\nprint(x / y)\nprint(x // y)\nprint(x ** 2)",
        },
        {
          title: "String Operations",
          description: "Manipulate and analyze strings.",
          code:
            'text = "Python"\nprint(text.upper())\nprint(text.lower())\nprint(len(text))\nprint(text[0])\nprint(text[:2])',
        },
        {
          title: "Type Conversion",
          description: "Convert between different data types.",
          code:
            'num_str = "42"\nnum = int(num_str)\nprint(num, type(num))\nback_to_str = str(num)\nprint(back_to_str, type(back_to_str))',
        },
      ],
      templateCode: `# Explore Python data types
age = 25
height = 5.9
name = "Alex"
is_student = True

print("Age:", age, type(age))
print("Height:", height, type(height))
print("Name:", name, type(name))
print("Is Student:", is_student, type(is_student))

# Type conversion
age_string = str(age)
print("Age as string:", age_string, type(age_string))
`,
      videoUrl: "https://www.youtube.com/embed/DZwm2nIL3GA",
      chaosExercise: {
        id: "chaos_types",
        title: "Type Mismatch Error",
        description: "Fix the type conversion error that prevents string and number combination.",
        brokenCode: `price = 19.99
quantity = "5"
total = price * quantity
print(total)`,
        correctCode: `price = 19.99
quantity = "5"
total = price * int(quantity)
print(total)`,
        validationScript: `
try:
    if total == 99.95:
        print("SUCCESS")
    else:
        print("FAILED: Calculation incorrect")
except:
    print("FAILED: Error in calculation")
`,
      },
      quizzes: [
        {
          id: "q_types_1",
          type: "mcq",
          question: 'What does int("42") return?',
          options: ["42 (integer)", '"42" (string)', "NaN", "Error"],
          correctAnswer: "0",
          explanation: "int() converts a string to an integer value.",
        },
      ],
      interviews: [
        {
          question: "Explain the difference between int() and float() conversion.",
          answer:
            "int() converts values to integers (whole numbers), truncating decimals. float() converts values to floating-point numbers (decimals), which can represent fractional values.",
          rubric: ["Mentions whole numbers vs decimals", "Discusses truncation"],
        },
      ],
    },
  ];

  /**
   * Get all topics
   */
  static getAllTopics(): PythonTopic[] {
    return this.TOPICS;
  }

  /**
   * Get topics by phase
   */
  static getTopicsByPhase(phase: string): PythonTopic[] {
    return this.TOPICS.filter((t) => t.phase === phase);
  }

  /**
   * Get a specific topic by ID
   */
  static getTopicById(id: string): PythonTopic | undefined {
    return this.TOPICS.find((t) => t.id === id);
  }

  /**
   * Get all phases
   */
  static getPhases(): string[] {
    return this.PHASES;
  }

  /**
   * Get topics count
   */
  static getTotalTopicsCount(): number {
    return this.TOPICS.length;
  }

  /**
   * Get topics by difficulty
   */
  static getTopicsByDifficulty(difficulty: "Beginner" | "Intermediate" | "Advanced"): PythonTopic[] {
    return this.TOPICS.filter((t) => t.difficulty === difficulty);
  }
}

// Export the curriculum as a singleton
export const PYTHON_CURRICULUM = PythonCurriculum.getAllTopics();
