/* ─── JavaScript Learning Curriculum ─────────────────────────────────── */

export type TopicType = "basics" | "logic" | "async" | "oop" | "browser";

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
  validationScript: string; // JavaScript validation assertion code
}

export interface TopicExample {
  title: string;
  description: string;
  code: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  rubric: string[];
}

export interface CurriculumTopic {
  id: string;
  title: string;
  phase: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: TopicType;
  objectives: string[];
  examples: TopicExample[];
  theory: string;
  templateCode: string;
  chaosExercise: ChaosExercise;
  quizzes: QuizQuestion[];
  interviews: InterviewQuestion[];
}

const RAW_JAVASCRIPT_CURRICULUM: CurriculumTopic[] = [
  {
    id: "js_hoisting",
    title: "Variables & Hoisting",
    phase: "Phase 1: JS Foundations",
    duration: "15 mins",
    difficulty: "Beginner",
    type: "basics",
    objectives: [
      "Understand var, let, and const declarations",
      "Learn how JavaScript hoists variables and functions",
      "Understand the Temporal Dead Zone (TDZ)"
    ],
    examples: [
      {
        title: "Hoisting with var",
        description: "Variables declared with var are hoisted and initialized to undefined.",
        code: "console.log(greeting);\nvar greeting = 'Hello World';\nconsole.log(greeting);"
      },
      {
        title: "Let & Const in Temporal Dead Zone",
        description: "Variables declared with let or const are hoisted but remain uninitialized, resulting in a ReferenceError if accessed early.",
        code: "try {\n  console.log(username);\n} catch (e) {\n  console.log('Error caught:', e.message);\n}\nlet username = 'niksai';"
      }
    ],
    theory: `### 🚀 Variable Declarations & Hoisting

JavaScript variables can be declared using \`var\`, \`let\`, or \`const\`.

#### Hoisting
Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during compilation.

- **var**: Hoisted and initialized to \`undefined\`.
- **let / const**: Hoisted but NOT initialized. Accessing them before declaration throws a \`ReferenceError\`. This period is called the **Temporal Dead Zone (TDZ)**.
- **Function Declarations**: Fully hoisted, meaning you can invoke the function before defining it in the source.

\`\`\`javascript
console.log(x); // undefined (var is hoisted)
var x = 5;

console.log(y); // ReferenceError (let is in TDZ)
let y = 10;
\`\`\`
`,
    templateCode: `// Function declaration is fully hoisted
sayHello();

function sayHello() {
  console.log("Hello from a hoisted function!");
}

// Variables behave differently
var hoistedVar = "I am hoisted to undefined";
console.log("hoistedVar:", hoistedVar);

try {
  console.log(tdzVar);
} catch (e) {
  console.log("tdzVar error:", e.message); // ReferenceError
}
let tdzVar = "I am in TDZ until this line";
`,
    chaosExercise: {
      id: "chaos_hoist",
      title: "The Undefined Price",
      description: "A checkout system prints prices, but because `price` was declared with `var` below its usage, it shows `NaN` (undefined * multiplier). Fix it by switching to `let` and declaring it before calculation.",
      brokenCode: `function calculateTotal() {
  var total = price * 1.15;
  var price = 100;
  return total;
}
console.log(calculateTotal());`,
      correctCode: `function calculateTotal() {
  let price = 100;
  let total = price * 1.15;
  return total;
}
console.log(calculateTotal());`,
      validationScript: `
try {
  const res = calculateTotal();
  if (res === 115) {
    console.log("SUCCESS");
  } else {
    console.log("FAILED: Total calculated to " + res + " instead of 115");
  }
} catch (e) {
  console.log("FAILED: " + e.message);
}
`
    },
    quizzes: [
      {
        id: "q_hoist_1",
        type: "mcq",
        question: "What is the Temporal Dead Zone (TDZ) in JavaScript?",
        options: [
          "The time a script takes to download",
          "The state of a resolved promise callback",
          "The period between variable hoisting and its actual declaration line for let/const",
          "The scope inside an iframe"
        ],
        correctAnswer: "2",
        explanation: "The TDZ is the region of the block scope from the start of the block until the variable is declared with let or const. Accessing it during this time throws a ReferenceError."
      }
    ],
    interviews: [
      {
        question: "What is the difference between function declarations and function expressions regarding hoisting?",
        answer: "Function declarations are fully hoisted (both the definition and the implementation are moved to the top), allowing them to be called before definition. Function expressions (e.g. const fn = function() {}) are treated as variables; only the variable declaration is hoisted, meaning calling it beforehand will result in a TypeError (or ReferenceError).",
        rubric: [
          "Function declarations are fully hoisted",
          "Function expressions are hoisted as variables only",
          "Invoking function expressions before declaration throws a TypeError or ReferenceError"
        ]
      }
    ]
  },
  {
    id: "js_closures",
    title: "Lexical Scope & Closures",
    phase: "Phase 1: JS Foundations",
    duration: "20 mins",
    difficulty: "Intermediate",
    type: "basics",
    objectives: [
      "Understand lexical scopes and scope chains",
      "Learn what closures are and how they retain outer variables",
      "Create private variables using function closures"
    ],
    examples: [
      {
        title: "Private Counter State",
        description: "Using a closure to encapsulate state and expose a public interface.",
        code: "function createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getValue: () => count\n  };\n}\nconst counter = createCounter();\nconsole.log(counter.increment());\nconsole.log(counter.getValue());"
      },
      {
        title: "Function Factory Pattern",
        description: "Creating customizable functions by pre-configuring arguments in closures.",
        code: "function makeAdder(x) {\n  return function(y) {\n    return x + y;\n  };\n}\nconst addFive = makeAdder(5);\nconsole.log(addFive(10)); // 15"
      }
    ],
    theory: `### 🔐 Scopes & Closures

A **closure** is the combination of a function bundled together with references to its surrounding state (the **lexical environment**). 

In other words, a closure gives an inner function access to the outer function's scope even after the outer function has finished executing.

#### Simple Example
\`\`\`javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`
Here, \`inner\` retains a references to \`count\` because of the closure environment.
`,
    templateCode: `function createMultiplier(factor) {
  // Inner function retains 'factor' reference
  return function(num) {
    return num * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("double(5):", double(5)); // 10
console.log("triple(5):", triple(5)); // 15
`,
    chaosExercise: {
      id: "chaos_closure",
      title: "The Timeout Loop Bug",
      description: "This loop was designed to log the indexes 0, 1, 2 sequentially. However, because it uses `var` in the loop header, the closure captures a shared variable reference, printing '3' three times. Fix the code by declaring the loop variable with `let`.",
      brokenCode: `function runLoop() {
  var results = [];
  for (var i = 0; i < 3; i++) {
    setTimeout(function() {
      results.push(i);
    }, 10);
  }
  return results;
}`,
      correctCode: `function runLoop() {
  var results = [];
  for (let i = 0; i < 3; i++) {
    setTimeout(function() {
      results.push(i);
    }, 10);
  }
  return results;
}`,
      validationScript: `
// Helper wait script
runLoop();
setTimeout(function() {
  const results = runLoop();
  setTimeout(function() {
    // Correct loop results must contain separate values
    if (results.length === 3) {
      console.log("SUCCESS");
    } else {
      console.log("FAILED: Expected results to register values in timeout stack");
    }
  }, 25);
}, 25);
`
    },
    quizzes: [
      {
        id: "q_closure_1",
        type: "mcq",
        question: "Why do functions returned from other functions remember outer variable values?",
        options: [
          "Because JavaScript variables are global by default",
          "Due to closures storing references to the lexical environment",
          "They are saved inside cookies",
          "They compile to global window variables"
        ],
        correctAnswer: "1",
        explanation: "Closures preserve references to variables in their surrounding lexical scope, allowing outer parameters to persist in memory."
      }
    ],
    interviews: [
      {
        question: "How do closures facilitate encapsulation or private scope in JavaScript?",
        answer: "By defining variables inside an outer function and exposing only inner functions (getters/setters) that reference those variables, external code cannot access or modify the variables directly. This acts as a private class variable.",
        rubric: [
          "Variables defined in outer function scope",
          "Inner functions act as interfaces",
          "No direct external access to closed-over variables"
        ]
      }
    ]
  },
  {
    id: "js_promises",
    title: "Promises & Async/Await",
    phase: "Phase 2: Async Architecture",
    duration: "25 mins",
    difficulty: "Intermediate",
    type: "async",
    objectives: [
      "Understand synchronous vs. asynchronous execution",
      "Learn Promise states: pending, fulfilled, and rejected",
      "Refactor chained .then() blocks into async/await expressions"
    ],
    examples: [
      {
        title: "Creating a Promise Wrapper",
        description: "Wrapping a standard asynchronous setTimeout callback inside a modern Promise container.",
        code: "const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\ndelay(1000).then(() => console.log('Resolved after 1 second'));"
      },
      {
        title: "Async / Await Flow Control",
        description: "Using try-catch blocks with await statements for synchronous-looking asynchronous execution.",
        code: "const fetchUser = () => Promise.resolve({ id: 42, name: 'Nik' });\n\nasync function displayUser() {\n  try {\n    const user = await fetchUser();\n    console.log('User Name:', user.name);\n  } catch (err) {\n    console.error('Error fetching:', err);\n  }\n}\ndisplayUser();"
      }
    ],
    theory: `### ⏳ Promises & Async/Await

JavaScript is single-threaded, but can handle asynchronous operations (like HTTP requests or timers) without blocking execution via **Promises**.

#### Promise States
- **Pending**: Initial state, neither fulfilled nor rejected.
- **Fulfilled**: Operation completed successfully. Calls \`.then()\`.
- **Rejected**: Operation failed. Calls \`.catch()\`.

#### Async / Await
The \`async\` and \`await\` keywords are syntactic sugar built on top of Promises, making async code write and look like synchronous code.

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch("https://api.com/user");
    const user = await response.json();
    return user;
  } catch (err) {
    console.error("Failed to load user:", err);
  }
}
\`\`\`
`,
    templateCode: `// Simulating an API Fetch promise
const fetchUserData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: "usr_nik", name: "Nikhil Kotte" });
    }, 50);
  });
};

async function loadProfile() {
  console.log("Loading profile...");
  const user = await fetchUserData();
  console.log("Loaded profile for:", user.name);
}

loadProfile();
`,
    chaosExercise: {
      id: "chaos_promise",
      title: "The Forgotten Await",
      description: "Our API client tries to extract user names, but because it calls `fetchUser()` without the `await` keyword, it receives a raw `Promise` object rather than the user profile data. Fix the client function to await the promise.",
      brokenCode: `const fetchUser = () => Promise.resolve({ name: "Sarah" });

async function getUserName() {
  const user = fetchUser();
  return user.name;
}`,
      correctCode: `const fetchUser = () => Promise.resolve({ name: "Sarah" });

async function getUserName() {
  const user = await fetchUser();
  return user.name;
}`,
      validationScript: `
try {
  getUserName().then(name => {
    if (name === "Sarah") {
      console.log("SUCCESS");
    } else {
      console.log("FAILED: Returned name was " + name);
    }
  });
} catch(e) {
  console.log("FAILED: " + e.message);
}
`
    },
    quizzes: [
      {
        id: "q_promise_1",
        type: "mcq",
        question: "What is returned when you invoke a function declared with the async keyword?",
        options: ["The return value directly", "A Promise", "Undefined", "A Generator Object"],
        correctAnswer: "1",
        explanation: "Async functions always return a Promise. If the function returns a value directly, it is implicitly wrapped in a resolved Promise."
      }
    ],
    interviews: [
      {
        question: "Explain what Promise.all() does and how it differs from Promise.race().",
        answer: "Promise.all() accepts an array of promises and resolves when all of them have resolved, or rejects immediately if any of them fail. Promise.race() resolves or rejects as soon as the first promise in the array completes (resolves or rejects).",
        rubric: [
          "Promise.all waits for all promises to resolve",
          "Promise.all rejects immediately on first error",
          "Promise.race resolves/rejects as soon as the first promise resolves/rejects"
        ]
      }
    ]
  },
  {
    id: "js_eventloop",
    title: "The Event Loop & Queues",
    phase: "Phase 2: Async Architecture",
    duration: "30 mins",
    difficulty: "Advanced",
    type: "async",
    objectives: [
      "Understand the Call Stack, Web APIs, and Queue system",
      "Distinguish between Microtasks (Promises) and Macrotasks (setTimeout)",
      "Analyze the execution priority order of async operations"
    ],
    examples: [
      {
        title: "Microtasks vs. Macrotasks Sequence",
        description: "Demonstrating execution priority where Promise microtasks execute before Timeout macrotasks.",
        code: "console.log('Script Start');\n\nsetTimeout(() => console.log('setTimeout (macrotask)'), 0);\n\nPromise.resolve().then(() => console.log('Promise.then (microtask)'));\n\nconsole.log('Script End');"
      },
      {
        title: "Heavy Synchronous Blocking",
        description: "Synchronous loops block the main thread, delaying microtasks and rendering/timers.",
        code: "setTimeout(() => console.log('Timer triggered'), 0);\n\nconsole.log('Start loop...');\nconst start = Date.now();\nwhile (Date.now() - start < 100) {\n  // Block main thread synchronously for 100ms\n}\nconsole.log('Loop finished');"
      }
    ],
    theory: `### 🔄 The JavaScript Event Loop

JavaScript is single-threaded: it can do only one thing at a time. The **Event Loop** is the mechanism that orchestrates this single-threaded model, managing asynchronous tasks.

#### The Ecosystem
1. **Call Stack**: LIFO structure. Where synchronous functions execute.
2. **Web APIs**: Background processes (timers, fetch requests, DOM events) handled by the browser.
3. **Microtask Queue**: High priority queue (e.g. Promises, MutationObservers, \`queueMicrotask\`).
4. **Macrotask Queue**: Standard priority queue (e.g. \`setTimeout\`, \`setInterval\`, \`setImmediate\`).

#### Order of Execution
1. Execute all synchronous code in the **Call Stack** until empty.
2. Check the **Microtask Queue** and execute **ALL** microtasks.
3. Check the **Macrotask Queue**, execute **ONE** macrotask, then go back to step 2!
`,
    templateCode: `console.log("1: Synchronous start");

setTimeout(() => {
  console.log("2: Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Microtask (Promise)");
});

console.log("4: Synchronous end");

// Predicted output: 1 -> 4 -> 3 -> 2
// Microtask runs before Macrotask!
`,
    chaosExercise: {
      id: "chaos_loop",
      title: "Predictable Ordering Bug",
      description: "Our log sequence prints items in a disorganized order. Correct the execution priority so that the outputs print exactly: 'Step 1', 'Step 2', then 'Step 3' by coordinating synchronous flow, Promises, and setTimeouts.",
      brokenCode: `function runSequence() {
  setTimeout(() => console.log("Step 3"), 10);
  Promise.resolve().then(() => console.log("Step 1"));
  console.log("Step 2");
}`,
      correctCode: `function runSequence() {
  console.log("Step 1");
  Promise.resolve().then(() => console.log("Step 2"));
  setTimeout(() => console.log("Step 3"), 10);
}`,
      validationScript: `
let logs = [];
const originalLog = console.log;
console.log = (msg) => {
  logs.push(msg);
  originalLog(msg);
};

runSequence();

setTimeout(() => {
  console.log = originalLog; // Restore
  if (logs[0] === "Step 1" && logs[1] === "Step 2" && logs[2] === "Step 3") {
    console.log("SUCCESS");
  } else {
    console.log("FAILED: Logs ordered incorrectly: " + JSON.stringify(logs));
  }
}, 50);
`
    },
    quizzes: [
      {
        id: "q_loop_1",
        type: "mcq",
        question: "Which of the following queue types holds a resolved Promise callback?",
        options: ["Macrotask Queue", "Microtask Queue", "Call Stack", "Web API Timer Hub"],
        correctAnswer: "1",
        explanation: "Promise resolve callbacks (.then/await returns) are queued in the Microtask Queue, which has higher priority than the Macrotask Queue."
      }
    ],
    interviews: [
      {
        question: "What happens if a microtask recursively schedules another microtask?",
        answer: "Since the Event Loop executes ALL tasks in the Microtask Queue before moving to render or executing macrotasks, recursively scheduling microtasks will starve the Event Loop, blocking UI renders and freeze/crash the tab.",
        rubric: [
          "Microtask queue runs until completely empty",
          "Infinite microtasks block macrotask queues",
          "Causes browser UI thread starvation/freezes"
        ]
      }
    ]
  }
];

const JAVASCRIPT_QUIZ_TEMPLATES: Record<TopicType, Array<{
  type: "mcq";
  question: (title: string) => string;
  options: string[];
  correctAnswer: string;
  explanation: (title: string) => string;
}>> = {
  basics: [
    {
      type: "mcq",
      question: (t) => `Which declaration keyword has block scope and does NOT allow re-declaration in the same block for ${t}?`,
      options: ["var", "let", "const", "both let and const"],
      correctAnswer: "3",
      explanation: (t) => `Both let and const are block-scoped declarations and throw SyntaxError on redeclarations in the same block.`
    },
    {
      type: "mcq",
      question: (t) => `What value is assigned to a hoisted var declaration before initialization in ${t}?`,
      options: ["null", "undefined", "ReferenceError", "0"],
      correctAnswer: "1",
      explanation: (t) => `Variables declared with var are hoisted and initialized to undefined.`
    },
    {
      type: "mcq",
      question: (t) => `What happens if you reference a let variable inside its Temporal Dead Zone (TDZ) in ${t}?`,
      options: ["Returns undefined", "Returns null", "Throws a ReferenceError", "Evaluates to 0"],
      correctAnswer: "2",
      explanation: (t) => `Accessing a let or const variable before its definition line in its scope raises a ReferenceError due to the TDZ.`
    },
    {
      type: "mcq",
      question: (t) => `Which of the following is NOT a primitive data type in JavaScript for ${t}?`,
      options: ["String", "Number", "Array", "Symbol"],
      correctAnswer: "2",
      explanation: (t) => `Arrays are object subtypes, whereas String, Number, and Symbol are primitives.`
    },
    {
      type: "mcq",
      question: (t) => `What is the return type of 'typeof null' in JavaScript for ${t}?`,
      options: ["'null'", "'undefined'", "'object'", "'string'"],
      correctAnswer: "2",
      explanation: (t) => `'typeof null' returning 'object' is a historical quirk in JavaScript's type representation.`
    },
    {
      type: "mcq",
      question: (t) => `How can you check if a value is NaN safely in ${t}?`,
      options: ["value === NaN", "Number.isNaN(value)", "typeof value === 'NaN'", "isNaN(value) only"],
      correctAnswer: "1",
      explanation: (t) => `Number.isNaN() is the safest check since NaN is never equal to itself, not even via ===.`
    },
    {
      type: "mcq",
      question: (t) => `What is the return type of typeof when checking a function in ${t}?`,
      options: ["'object'", "'function'", "'callable'", "'undefined'"],
      correctAnswer: "1",
      explanation: (t) => `typeof returns 'function' for callables, although they are technically object subtypes.`
    },
    {
      type: "mcq",
      question: (t) => `Which method creates a shallow copy of an array object in ${t}?`,
      options: ["Array.prototype.slice()", "Array.prototype.concat()", "Spread operator (...)", "All of the above"],
      correctAnswer: "3",
      explanation: (t) => `slice(), concat(), and the spread operator all generate a new array with shallow copies of references.`
    },
    {
      type: "mcq",
      question: (t) => `Which operator checks for value equality but ignores type coercion in ${t}?`,
      options: ["==", "===", "Object.is()", "!="],
      correctAnswer: "1",
      explanation: (t) => `The strict equality operator (===) checks both value and type without coercion.`
    },
    {
      type: "mcq",
      question: (t) => `What represents a unique, immutable primitive value often used as object keys in ${t}?`,
      options: ["Symbol", "String", "Number", "Object"],
      correctAnswer: "0",
      explanation: (t) => `Symbols are unique, immutable primitives used to define private/unique properties on objects.`
    },
    {
      type: "mcq",
      question: (t) => `How do you define a function that accepts variable positional arguments as an array in ${t}?`,
      options: ["Rest parameter (...args)", "Arguments object only", "Spread operator", "Array parameter"],
      correctAnswer: "0",
      explanation: (t) => `The rest parameter syntax (...) collects remaining arguments into a true array.`
    },
    {
      type: "mcq",
      question: (t) => `What represents the absolute global object namespace in any environment for ${t}?`,
      options: ["window", "global", "globalThis", "self"],
      correctAnswer: "2",
      explanation: (t) => `globalThis provides a standardized way to access the global object across browsers and Node.js.`
    },
    {
      type: "mcq",
      question: (t) => `Which array method checks if at least one element passes a test in ${t}?`,
      options: ["every()", "some()", "find()", "filter()"],
      correctAnswer: "1",
      explanation: (t) => `some() returns true if any element satisfies the callback test.`
    },
    {
      type: "mcq",
      question: (t) => `What happens if a variable is assigned a value without being declared in non-strict mode in ${t}?`,
      options: ["Throws ReferenceError", "Creates a global variable", "Initialized to local variable", "Ignored silently"],
      correctAnswer: "1",
      explanation: (t) => `Assigning to an undeclared identifier creates a property on the global object in non-strict mode.`
    },
    {
      type: "mcq",
      question: (t) => `Which string method extracts a portion of a string and returns a new string in ${t}?`,
      options: ["slice()", "substring()", "substr()", "All of the above"],
      correctAnswer: "3",
      explanation: (t) => `slice, substring, and substr can all extract segments of string variables.`
    }
  ],
  logic: [
    {
      type: "mcq",
      question: (t) => `What is evaluated in a conditional check when passed the empty string '' in ${t}?`,
      options: ["True", "False", "TypeError", "undefined"],
      correctAnswer: "1",
      explanation: (t) => `An empty string is a falsy value in JavaScript.`
    },
    {
      type: "mcq",
      question: (t) => `What is the return value of the expression '5' + 3 in ${t}?`,
      options: ["8", "'53'", "TypeError", "NaN"],
      correctAnswer: "1",
      explanation: (t) => `The '+' operator triggers string concatenation if one operand is a string, converting 3 to '3'.`
    },
    {
      type: "mcq",
      question: (t) => `What value is returned by the logical OR operator expression: 'hello' || 'world' in ${t}?`,
      options: ["'hello'", "'world'", "true", "false"],
      correctAnswer: "0",
      explanation: (t) => `The OR operator evaluates from left to right, returning the first truthy value it finds.`
    },
    {
      type: "mcq",
      question: (t) => `What operator checks for null or undefined specifically before applying default values in ${t}?`,
      options: ["||", "&&", "?? (Nullish Coalescing)", "?."],
      correctAnswer: "2",
      explanation: (t) => `The Nullish Coalescing operator (??) only falls back if the left operand is null or undefined.`
    },
    {
      type: "mcq",
      question: (t) => `What error is thrown when executing code inside a try block that references an un-imported class in ${t}?`,
      options: ["ReferenceError", "TypeError", "SyntaxError", "RangeError"],
      correctAnswer: "0",
      explanation: (t) => `Accessing an undeclared identifier raises a ReferenceError.`
    },
    {
      type: "mcq",
      question: (t) => `Which keyword exits the current iteration and jumps to the next loop cycle in ${t}?`,
      options: ["break", "continue", "return", "throw"],
      correctAnswer: "1",
      explanation: (t) => `continue skips the remaining statements of the current iteration, going directly to the next condition step.`
    },
    {
      type: "mcq",
      question: (t) => `What is the output of 'Boolean([])' when testing logical truthiness in ${t}?`,
      options: ["true", "false", "undefined", "TypeError"],
      correctAnswer: "0",
      explanation: (t) => `Objects (including empty arrays and objects) are always truthy in JavaScript.`
    },
    {
      type: "mcq",
      question: (t) => `Which of the following values is NOT considered falsy in ${t}?`,
      options: ["0", "NaN", "'false'", "undefined"],
      correctAnswer: "2",
      explanation: (t) => `The string 'false' is non-empty, so it evaluates to truthy.`
    },
    {
      type: "mcq",
      question: (t) => `What evaluates as the output of 'typeof NaN' in ${t}?`,
      options: ["'number'", "'NaN'", "'undefined'", "'object'"],
      correctAnswer: "0",
      explanation: (t) => `NaN stands for Not-a-Number, but its type representation is 'number'.`
    },
    {
      type: "mcq",
      question: (t) => `Which block of a try-catch-finally statement executes even if an error is thrown and caught in ${t}?`,
      options: ["catch", "try", "finally", "then"],
      correctAnswer: "2",
      explanation: (t) => `The finally block always runs, making it perfect for resource cleanup.`
    },
    {
      type: "mcq",
      question: (t) => `Which operator is used to chain optional properties safely without raising type errors in ${t}?`,
      options: ["?.", "??", "?", "||"],
      correctAnswer: "0",
      explanation: (t) => `The optional chaining operator (?.) short-circuits and returns undefined if the left object is nullish.`
    },
    {
      type: "mcq",
      question: (t) => `What is the output of the logical AND expression: null && 'javascript' in ${t}?`,
      options: ["null", "'javascript'", "false", "undefined"],
      correctAnswer: "0",
      explanation: (t) => `The AND operator evaluates from left to right, returning the first falsy operand.`
    },
    {
      type: "mcq",
      question: (t) => `Which loops iterate over the values of an iterable object (like an array) in ${t}?`,
      options: ["for...in", "for...of", "while", "for loop only"],
      correctAnswer: "1",
      explanation: (t) => `for...of iterates over iterable values. for...in iterates over enumerable property keys.`
    },
    {
      type: "mcq",
      question: (t) => `What error occurs when a function calls itself indefinitely in ${t}?`,
      options: ["RangeError: Maximum call stack size exceeded", "TypeError", "StackOverflowError", "ReferenceError"],
      correctAnswer: "0",
      explanation: (t) => `Infinite recursion exceeds the Call Stack size limit, throwing a RangeError.`
    },
    {
      type: "mcq",
      question: (t) => `What does the expression '!NaN' evaluate to in ${t}?`,
      options: ["true", "false", "NaN", "TypeError"],
      correctAnswer: "0",
      explanation: (t) => `NaN is falsy, so logical NOT (!) converts it to true.`
    }
  ],
  async: [
    {
      type: "mcq",
      question: (t) => `Which queues are checked by the Event Loop first before macrotasks in ${t}?`,
      options: ["Timer queue", "Microtask queue", "Callback queue", "Render queue"],
      correctAnswer: "1",
      explanation: (t) => `The Microtask queue has strict priority over the Macrotask queue.`
    },
    {
      type: "mcq",
      question: (t) => `Where does the callback function of Promise.then execute in ${t}?`,
      options: ["In Web APIs", "In the Macrotask Queue", "In the Microtask Queue", "Directly in Call Stack"],
      correctAnswer: "2",
      explanation: (t) => `Resolved Promise callbacks run as microtasks.`
    },
    {
      type: "mcq",
      question: (t) => `What happens if a microtask recursively schedules another microtask in ${t}?`,
      options: ["The browser handles them asynchronously", "It blocks the Event Loop and starves the UI thread", "It throws a StackOverflow error", "It is converted to a setTimeout"],
      correctAnswer: "1",
      explanation: (t) => `Since all microtasks must finish before any other work, recursive microtasks starve the thread.`
    },
    {
      type: "mcq",
      question: (t) => `What is the status of a newly initialized Promise object in ${t}?`,
      options: ["fulfilled", "rejected", "pending", "resolved"],
      correctAnswer: "2",
      explanation: (t) => `Promises start in the pending state before transitioning to fulfilled or rejected.`
    },
    {
      type: "mcq",
      question: (t) => `What keyword allows awaiting a Promise inside an asynchronous function in ${t}?`,
      options: ["await", "wait", "async", "then"],
      correctAnswer: "0",
      explanation: (t) => `The await keyword pauses the execution of an async function until the Promise resolves.`
    },
    {
      type: "mcq",
      question: (t) => `Which API is used to execute a callback function in the next loop cycle as a macrotask in ${t}?`,
      options: ["setTimeout()", "Promise.resolve()", "queueMicrotask()", "requestAnimationFrame()"],
      correctAnswer: "0",
      explanation: (t) => `setTimeout(callback, 0) schedules a macrotask callback.`
    },
    {
      type: "mcq",
      question: (t) => `Which method returns a Promise that resolves when all input Promises resolve in ${t}?`,
      options: ["Promise.race()", "Promise.all()", "Promise.any()", "Promise.allSettled()"],
      correctAnswer: "1",
      explanation: (t) => `Promise.all() waits for all promises to resolve, or rejects immediately if any reject.`
    },
    {
      type: "mcq",
      question: (t) => `What does Promise.race() accomplish in ${t}?`,
      options: ["Resolves when the first promise resolves", "Resolves or rejects when the first promise settles", "Rejects when all promise calls fail", "Executes promises concurrently"],
      correctAnswer: "1",
      explanation: (t) => `Promise.race() returns a promise that settles as soon as one of the input promises settles.`
    },
    {
      type: "mcq",
      question: (t) => `Which API is used to schedule a callback to run after the current call stack but as a microtask in ${t}?`,
      options: ["setTimeout()", "queueMicrotask()", "requestAnimationFrame()", "setImmediate()"],
      correctAnswer: "1",
      explanation: (t) => `queueMicrotask() explicitly posts a callback to the high-priority microtask queue.`
    },
    {
      type: "mcq",
      question: (t) => `What type of function always returns a Promise implicitly in ${t}?`,
      options: ["Arrow function", "Generator function", "Async function", "Callback function"],
      correctAnswer: "2",
      explanation: (t) => `Async functions wrap any returned value in a resolved Promise automatically.`
    },
    {
      type: "mcq",
      question: (t) => `What happens if a Promise reject callback is not handled in ${t}?`,
      options: ["Throws a compile error", "Triggers unhandledrejection event", "Ignored silently", "Crashes the browser tab immediately"],
      correctAnswer: "1",
      explanation: (t) => `Uncaught promise rejections emit an 'unhandledrejection' event on the global object.`
    },
    {
      type: "mcq",
      question: (t) => `Which method settles when all input Promises settle, regardless of outcome in ${t}?`,
      options: ["Promise.all()", "Promise.allSettled()", "Promise.any()", "Promise.race()"],
      correctAnswer: "1",
      explanation: (t) => `Promise.allSettled() returns status and value/reason for every input promise.`
    },
    {
      type: "mcq",
      question: (t) => `What is a major advantage of async/await over raw .then() chains in ${t}?`,
      options: ["Runs faster in JS engines", "Allows using standard try-catch blocks for error handling", "Prevents memory leaks", "Allows synchronous execution"],
      correctAnswer: "1",
      explanation: (t) => `async/await allows cleaner, flat code structures and handles errors using standard try-catch.`
    },
    {
      type: "mcq",
      question: (t) => `What happens to execution when await is encountered on a Promise in ${t}?`,
      options: ["It blocks the single main thread completely", "It yields control back to the Event Loop, resuming when settled", "It runs synchronously", "It starts a new worker thread"],
      correctAnswer: "1",
      explanation: (t) => `await yields control back to the event loop; it does not block the browser main thread.`
    },
    {
      type: "mcq",
      question: (t) => `Which API is used to cancel a fetch request in progress in ${t}?`,
      options: ["AbortController", "FetchCancel", "clearTimeout()", "Promise.abort()"],
      correctAnswer: "0",
      explanation: (t) => `AbortController allows generating a signal to cancel ongoing web requests/fetches.`
    }
  ],
  oop: [
    {
      type: "mcq",
      question: (t) => `Which property links an object to its parent prototype in JavaScript for ${t}?`,
      options: ["__proto__", "prototype", "parent", "constructor"],
      correctAnswer: "0",
      explanation: (t) => `The internal [[Prototype]] link is exposed via __proto__.`
    },
    {
      type: "mcq",
      question: (t) => `What keyword sets up class inheritance in ES6 syntax for ${t}?`,
      options: ["implements", "extends", "inherits", "subclass"],
      correctAnswer: "1",
      explanation: (t) => `The extends keyword declares that a class inherits from a parent constructor.`
    },
    {
      type: "mcq",
      question: (t) => `Which keyword inside a constructor invokes the parent class constructor in ${t}?`,
      options: ["super", "this", "parent", "base"],
      correctAnswer: "0",
      explanation: (t) => `super() must be called in derived class constructors before accessing 'this'.`
    },
    {
      type: "mcq",
      question: (t) => `How do arrow functions behave regarding the 'this' context in ${t}?`,
      options: ["They bind 'this' to the caller object", "They inherit 'this' lexically from their enclosing scope", "They have their own unique 'this' dynamic binding", "They cannot access 'this' at all"],
      correctAnswer: "1",
      explanation: (t) => `Arrow functions do not bind their own 'this'; they inherit it lexically.`
    },
    {
      type: "mcq",
      question: (t) => `What is the first parameter of the Object.create() method in ${t}?`,
      options: ["The target object attributes", "The prototype object to inherit from", "The constructor function", "A boolean flag"],
      correctAnswer: "1",
      explanation: (t) => `Object.create(proto) creates a new object with the specified prototype link.`
    },
    {
      type: "mcq",
      question: (t) => `Which method permanently binds a function to a specific 'this' context, returning a new function for ${t}?`,
      options: ["call()", "apply()", "bind()", "set()"],
      correctAnswer: "2",
      explanation: (t) => `bind() returns a bound copy of the function, whereas call() and apply() invoke the function immediately.`
    },
    {
      type: "mcq",
      question: (t) => `How does 'this' behave in a standard function called in strict mode without an object owner in ${t}?`,
      options: ["window / global object", "undefined", "empty object", "throws Error"],
      correctAnswer: "1",
      explanation: (t) => `In strict mode, the default binding of 'this' is undefined, rather than the global object.`
    },
    {
      type: "mcq",
      question: (t) => `Which method checks if an object is in another object's prototype chain for ${t}?`,
      options: ["isPrototypeOf()", "hasOwnProperty()", "instanceof", "Both isPrototypeOf and instanceof"],
      correctAnswer: "3",
      explanation: (t) => `Both instanceof operator and isPrototypeOf() check the prototype chain.`
    },
    {
      type: "mcq",
      question: (t) => `How do you declare a private field in ES6 classes for ${t}?`,
      options: ["Prefix field name with #", "Use the private keyword", "Prefix field name with underscore _", "Wrap in closures only"],
      correctAnswer: "0",
      explanation: (t) => `JavaScript uses a hash # prefix to define private class properties and methods.`
    },
    {
      type: "mcq",
      question: (t) => `What is the difference between class fields and prototype methods in ${t}?`,
      options: ["Class fields are on the prototype", "Prototype methods are shared, class fields are on the instance", "They are identical", "Prototype methods are private"],
      correctAnswer: "1",
      explanation: (t) => `Methods are defined on the prototype to share memory; class fields are assigned to individual instances.`
    },
    {
      type: "mcq",
      question: (t) => `Which Object static method prevents any modifications (adding, deleting, or writing attributes) in ${t}?`,
      options: ["Object.seal()", "Object.freeze()", "Object.preventExtensions()", "Object.lock()"],
      correctAnswer: "1",
      explanation: (t) => `Object.freeze() makes an object completely immutable.`
    },
    {
      type: "mcq",
      question: (t) => `What does the constructor property of an instance point to in ${t}?`,
      options: ["The parent class prototype", "The function/class that created the instance", "The global object", "undefined"],
      correctAnswer: "1",
      explanation: (t) => `instance.constructor points back to the constructor function/class.`
    },
    {
      type: "mcq",
      question: (t) => `Which operator evaluates to true if a property exists on an object or its prototype chain in ${t}?`,
      options: ["in", "hasOwnProperty", "exists", "instanceof"],
      correctAnswer: "0",
      explanation: (t) => `The 'in' operator checks the entire prototype chain, whereas hasOwnProperty() only checks the instance itself.`
    },
    {
      type: "mcq",
      question: (t) => `What method is used to get all enumerable keys of an object as an array in ${t}?`,
      options: ["Object.keys()", "Object.values()", "Object.entries()", "Object.getOwnPropertyNames()"],
      correctAnswer: "0",
      explanation: (t) => `Object.keys() returns an array of the object's own enumerable string-keyed property names.`
    },
    {
      type: "mcq",
      question: (t) => `Which static method copies all enumerable own properties from one or more source objects to a target in ${t}?`,
      options: ["Object.assign()", "Object.create()", "Object.merge()", "Object.copy()"],
      correctAnswer: "0",
      explanation: (t) => `Object.assign() merges source objects into a target object.`
    }
  ],
  browser: [
    {
      type: "mcq",
      question: (t) => `Which object represents the root of the document object model hierarchy in ${t}?`,
      options: ["window", "document", "html", "body"],
      correctAnswer: "1",
      explanation: (t) => `The document object represents the web page loaded in the browser.`
    },
    {
      type: "mcq",
      question: (t) => `What event triggers when the HTML document is fully parsed and DOM is ready, without waiting for images/stylesheets in ${t}?`,
      options: ["load", "DOMContentLoaded", "ready", "pageshow"],
      correctAnswer: "1",
      explanation: (t) => `DOMContentLoaded fires when the DOM tree is complete; load waits for all assets (images, frames) to finish loading.`
    },
    {
      type: "mcq",
      question: (t) => `Which method registers an event listener callback function in ${t}?`,
      options: ["addEventListener()", "attachEvent()", "on()", "listen()"],
      correctAnswer: "0",
      explanation: (t) => `addEventListener() is the standard DOM Level 2 way to listen to events.`
    },
    {
      type: "mcq",
      question: (t) => `What event phase captures events from the root down to the target node in ${t}?`,
      options: ["Target phase", "Bubbling phase", "Capturing phase", "Propagation phase"],
      correctAnswer: "2",
      explanation: (t) => `Capturing goes from window down to target. Bubbling goes from target back up to window.`
    },
    {
      type: "mcq",
      question: (t) => `How do you stop an event from propagating further up or down the DOM tree in ${t}?`,
      options: ["event.preventDefault()", "event.stopPropagation()", "event.stop()", "return false"],
      correctAnswer: "1",
      explanation: (t) => `event.stopPropagation() prevents the event from traversing further during bubbling/capturing.`
    },
    {
      type: "mcq",
      question: (t) => `Which storage mechanism holds data that persists even after the browser window is closed for ${t}?`,
      options: ["sessionStorage", "localStorage", "Cookies", "IndexedDB"],
      correctAnswer: "1",
      explanation: (t) => `localStorage holds data with no expiration date; sessionStorage is cleared when the tab closes.`
    },
    {
      type: "mcq",
      question: (t) => `Which method fetches a resource asynchronously from the network returning a Promise in ${t}?`,
      options: ["XMLHttpRequest", "fetch()", "axios()", "ajax()"],
      correctAnswer: "1",
      explanation: (t) => `fetch() is the modern web API for performing asynchronous HTTP requests.`
    },
    {
      type: "mcq",
      question: (t) => `How do you select the first element matching a CSS selector in the document for ${t}?`,
      options: ["document.getElementById()", "document.querySelector()", "document.querySelectorAll()", "document.getElementsByClassName()"],
      correctAnswer: "1",
      explanation: (t) => `document.querySelector() returns the first matching Element node.`
    },
    {
      type: "mcq",
      question: (t) => `Which API is used to update the URL path in the address bar without reloading the page in ${t}?`,
      options: ["History.pushState()", "Location.replace()", "Navigator.goTo()", "window.reload()"],
      correctAnswer: "0",
      explanation: (t) => `pushState() changes the URL path programmatically without reloading.`
    },
    {
      type: "mcq",
      question: (t) => `What is the primary vulnerability when inserting raw user input directly into element.innerHTML in ${t}?`,
      options: ["Cross-Site Scripting (XSS)", "SQL Injection", "CSRF", "Memory leak"],
      correctAnswer: "0",
      explanation: (t) => `Using innerHTML with raw user input allows executing malicious scripts (XSS).`
    },
    {
      type: "mcq",
      question: (t) => `Which method creates a new Element node in memory for ${t}?`,
      options: ["document.createElement()", "document.newElement()", "Element.create()", "document.append()"],
      correctAnswer: "0",
      explanation: (t) => `document.createElement(tagName) creates a new Element node ready to insert into the DOM.`
    },
    {
      type: "mcq",
      question: (t) => `What does event.preventDefault() do in ${t}?`,
      options: ["Stops event bubbling", "Prevents the default browser action for the event", "Cancels the event listeners", "Resets the form"],
      correctAnswer: "1",
      explanation: (t) => `preventDefault() cancels the default behavior (e.g., following a link or submitting a form).`
    },
    {
      type: "mcq",
      question: (t) => `Which web API is designed for smooth, browser-synced animations in ${t}?`,
      options: ["setTimeout()", "requestAnimationFrame()", "setInterval()", "Web Workers"],
      correctAnswer: "1",
      explanation: (t) => `requestAnimationFrame() runs callbacks at the browser's refresh rate (usually 60Hz/120Hz) for fluid animations.`
    },
    {
      type: "mcq",
      question: (t) => `What mechanism allows secure cross-origin HTTP requests in the browser for ${t}?`,
      options: ["CORS", "JSONP", "XSS", "HTTPS"],
      correctAnswer: "0",
      explanation: (t) => `CORS (Cross-Origin Resource Sharing) defines headers allowing servers to authorize cross-domain requests.`
    },
    {
      type: "mcq",
      question: (t) => `Which observer class monitors elements entering or leaving the browser viewport in ${t}?`,
      options: ["MutationObserver", "IntersectionObserver", "ResizeObserver", "ViewportObserver"],
      correctAnswer: "1",
      explanation: (t) => `IntersectionObserver detects when target elements intersect with parent containers or the viewport.`
    }
  ]
};

const JAVASCRIPT_INTERVIEW_TEMPLATES: Record<TopicType, Array<{
  question: (title: string) => string;
  answer: (title: string) => string;
  rubric: (title: string) => string[];
}>> = {
  basics: [
    {
      question: (t) => `Explain var, let, and const and their scopes in JavaScript related to ${t}.`,
      answer: (t) => `var is function-scoped, hoisted to undefined, and allows redeclarations. let and const are block-scoped, hoisted but uninitialized (in TDZ), and do not allow redeclarations. const also prevents variable re-assignment.`,
      rubric: (t) => ["Function scope vs Block scope", "Temporal Dead Zone (TDZ) for let/const", "Reassignment rules for const"]
    },
    {
      question: (t) => `What is hoisting and the Temporal Dead Zone (TDZ) in JavaScript related to ${t}?`,
      answer: (t) => `Hoisting is the compilation phase behavior where variable and function declarations are moved to the top of their scope. The TDZ is the region from the start of the block scope until the initialization line where accessing let/const variables throws a ReferenceError.`,
      rubric: (t) => ["Declaration hoisting behavior", "Temporal Dead Zone (TDZ) definition", "Throws ReferenceError in TDZ"]
    },
    {
      question: (t) => `Describe how 'this' is resolved in different execution contexts for ${t}.`,
      answer: (t) => `'this' is determined dynamically by how a function is called: default binding (global/undefined in strict), implicit binding (on an object owner), explicit binding (call/apply/bind), or new binding (constructor functions). Arrow functions inherit 'this' lexically.`,
      rubric: (t) => ["Implicit vs Explicit vs New bindings", "Lexical 'this' in arrow functions", "Strict mode defaults to undefined"]
    },
    {
      question: (t) => `What's the difference between double equals (==) and triple equals (===) in ${t}?`,
      answer: (t) => `Double equals (==) performs type coercion to convert operands to a common type before comparison. Triple equals (===) performs strict comparison, checking both value and type without coercion.`,
      rubric: (t) => ["Implicit type coercion", "Strict equality checks type and value", "Examples of quirks like [] == false"]
    },
    {
      question: (t) => `What is closure and how does it work in JavaScript for ${t}?`,
      answer: (t) => `A closure is a combination of a function bundled together with references to its surrounding state (the lexical environment), allowing the inner function to access variables from an outer function scope even after the outer function has returned.`,
      rubric: (t) => ["Lexical environment references", "Inner function accessing outer variables", "Persists outer variables in memory"]
    },
    {
      question: (t) => `Explain primitive types vs objects in JavaScript related to ${t}.`,
      answer: (t) => `Primitives (string, number, boolean, null, undefined, symbol, bigint) are immutable and stored by value. Objects (arrays, functions, objects) are mutable and stored/copied by reference in memory.`,
      rubric: (t) => ["Primitives are immutable and compared by value", "Objects are mutable and compared by reference", "Stored on the Stack vs Heap"]
    },
    {
      question: (t) => `What is the difference between rest and spread operators in JavaScript related to ${t}?`,
      answer: (t) => `Spread (...) expands an iterable array or object into individual elements. Rest (...) gathers multiple arguments or remaining properties into a single array or object during destructuring or function declaration.`,
      rubric: (t) => ["Spread expands / unpacks iterables", "Rest compiles / packs elements", "Usage in array/object clones vs functions"]
    },
    {
      question: (t) => `Explain how strict mode changes JavaScript execution behavior for ${t}.`,
      answer: (t) => `Strict mode ('use strict') catches common coding mistakes, prevents setting properties on global objects, disables quiet failures, disables duplicate parameter names, and sets default 'this' to undefined.`,
      rubric: (t) => ["Enabled via 'use strict'", "Eliminates silent errors by throwing", "Default 'this' is undefined"]
    },
    {
      question: (t) => `What is the role of globalThis in modern JavaScript related to ${t}?`,
      answer: (t) => `globalThis is a standardized global property that returns the environment-specific global object (window in browsers, global in Node.js, self in web workers), offering cross-platform consistency.`,
      rubric: (t) => ["Standardized global object accessor", "Consistent across Node.js, browser, and workers", "Replaces window/global environments detection"]
    },
    {
      question: (t) => `What is 'typeof null' and why does it return 'object' in ${t}?`,
      answer: (t) => `'typeof null' returns 'object' because of an early bug in JavaScript, where types were stored with tags. The object tag was 000, and null represented the null pointer (also 000), making typeof treat it as an object.`,
      rubric: (t) => ["Returns 'object'", "Historical tag representation bug", "How to check for null correctly (value === null)"]
    },
    {
      question: (t) => `Explain NaN and how to check for it in ${t}.`,
      answer: (t) => `NaN stands for 'Not-a-Number' and is a value representing a failed mathematical operation. Since NaN is the only value in JavaScript not equal to itself, you must use Number.isNaN() to check it safely.`,
      rubric: (t) => ["NaN represents arithmetic failures", "NaN is not equal to itself (NaN !== NaN)", "Number.isNaN() vs global isNaN() difference"]
    },
    {
      question: (t) => `What are arrow functions and how do they differ from regular functions in ${t}?`,
      answer: (t) => `Arrow functions are concise functions that do not have their own binding for 'this', 'arguments', or 'super', inheriting them lexically. They also cannot be used as constructor functions (no 'new').`,
      rubric: (t) => ["Lexical 'this' binding", "No constructor capability (cannot be called with 'new')", "Lack of 'arguments' object"]
    },
    {
      question: (t) => `What is the difference between a shallow copy and a deep copy of an object in ${t}?`,
      answer: (t) => `A shallow copy copies top-level properties but retains references to nested objects. A deep copy recursively duplicates all levels, ensuring no shared object references exist.`,
      rubric: (t) => ["Shallow copies nested references", "Deep copies all objects recursively", "Object.assign/spread vs JSON/structuredClone"]
    },
    {
      question: (t) => `What are Symbols and why are they used in ${t}?`,
      answer: (t) => `Symbols are unique, immutable primitive values. They are primarily used to define unique object properties that will not conflict with other keys, making them ideal for library hooks or metadata.`,
      rubric: (t) => ["Unique, immutable primitives", "Used as collision-free object property keys", "Invisible to standard for...in loops"]
    },
    {
      question: (t) => `Explain function scope vs block scope in JavaScript for ${t}.`,
      answer: (t) => `Function scope restricts variable access to within the declaring function (var). Block scope restricts variable access to within any curly brace block (let, const, e.g. loops/conditionals).`,
      rubric: (t) => ["Function scope is bounded by functions (var)", "Block scope is bounded by curly braces (let/const)", "Block scoping prevents loop variable leaks"]
    }
  ],
  logic: [
    {
      question: (t) => `Explain falsy values in JavaScript in relation to ${t}.`,
      answer: (t) => `Falsy values are values that evaluate to false in boolean contexts: false, 0, -0, 0n, '', null, undefined, and NaN. All other values are truthy.`,
      rubric: (t) => ["List of falsy values", "Boolean coercion behavior", "Everything else (including [], {}) is truthy"]
    },
    {
      question: (t) => `What is the nullish coalescing operator (??) and how does it differ from logical OR (||) in ${t}?`,
      answer: (t) => `?? returns the right-hand operand only if the left-hand is null or undefined. || returns the right-hand if the left is any falsy value, which can trigger on empty strings or 0.`,
      rubric: (t) => ["?? checks for null / undefined only", "|| checks for any falsy values", "Use ?? to preserve 0 or empty string values"]
    },
    {
      question: (t) => `Explain short-circuit evaluation in logical operators for ${t}.`,
      answer: (t) => `Short-circuiting means the evaluation of an expression stops as soon as the result is determined. E.g. in 'expr1 && expr2', if expr1 is falsy, expr2 is never evaluated.`,
      rubric: (t) => ["&& stops at first falsy value", "|| stops at first truthy value", "Can be used for guard conditions or inline defaults"]
    },
    {
      question: (t) => `What is the ternary operator and when should it be used in ${t}?`,
      answer: (t) => `The ternary operator is an inline conditional: 'condition ? exprIfTrue : exprIfFalse'. It should be used for simple, concise binary expressions and avoided for complex nested logic.`,
      rubric: (t) => ["Syntax: cond ? trueExpr : falseExpr", "Returns an expression value", "Avoid nesting to maintain readability"]
    },
    {
      question: (t) => `How does try-catch-finally control flow work in JavaScript for ${t}?`,
      answer: (t) => `try runs first. If an error is thrown, execution jumps to catch. The finally block always runs after try/catch, even if they return values.`,
      rubric: (t) => ["try holds risk operations", "catch intercepts Error objects", "finally executes regardless of results or return statements"]
    },
    {
      question: (t) => `What is the difference between a RangeError and a ReferenceError in ${t}?`,
      answer: (t) => `ReferenceError is thrown when accessing an undeclared identifier. RangeError is thrown when a numeric value or function call stack exceeds its allowable limit/range.`,
      rubric: (t) => ["ReferenceError: undeclared variables", "RangeError: invalid ranges / stack size limit", "Usage and examples"]
    },
    {
      question: (t) => `Explain how exception propagation works in JavaScript for ${t}.`,
      answer: (t) => `When an error is thrown, the call stack is unwound frame-by-frame searching for the nearest enclosing try-catch block. If none is found, the script exits and logs an uncaught error.`,
      rubric: (t) => ["Unwinding of the call stack", "Propagation up to parent callers", "Unhandled exceptions crash execution thread"]
    },
    {
      question: (t) => `What are the different types of loops in JavaScript and when are they used in ${t}?`,
      answer: (t) => `Loops include: for (index counts), while (indefinite loops), do-while (runs at least once), for...in (object property keys), and for...of (iterable values).`,
      rubric: (t) => ["Standard for/while loops", "for...of for iterable array values", "for...in for enumerable object keys"]
    },
    {
      question: (t) => `What is the difference between for...in and for...of loops in ${t}?`,
      answer: (t) => `for...in iterates over the enumerable string property keys of an object (including prototype). for...of iterates over the values of an iterable container (arrays, maps, sets).`,
      rubric: (t) => ["for...in visits enumerable property keys", "for...of visits iterable values", "for...in lists indexes for arrays, for...of lists elements"]
    },
    {
      question: (t) => `Explain dynamic typing and type coercion in JavaScript for ${t}.`,
      answer: (t) => `Dynamic typing allows variables to change types at runtime. Type coercion is JavaScript's implicit conversion of values between types during operations (like '5' + 2).`,
      rubric: (t) => ["Dynamic type assignment", "Implicit type coercion vs explicit casting", "Examples of coercion in arithmetic/logic"]
    },
    {
      question: (t) => `How do you throw and catch custom errors in ${t}?`,
      answer: (t) => `You throw custom errors using the 'throw' keyword with an instance of Error or a class extending the built-in Error class, override the name/message attributes.`,
      rubric: (t) => ["Use 'throw new Error()'", "Custom class inherits from Error", "Handles specific errors using 'instanceof' in catch"]
    },
    {
      question: (t) => `What is recursion and what happens if a base case is missing in ${t}?`,
      answer: (t) => `Recursion is when a function calls itself. If a base case is missing, the function calls itself infinitely, exhausting call stack memory and throwing a RangeError.`,
      rubric: (t) => ["Recursive calls call itself", "Base case is the stop condition", "Missing base case causes Call Stack overflow"]
    },
    {
      question: (t) => `Explain how logical operators return operand values rather than booleans in ${t}.`,
      answer: (t) => `In JavaScript, && and || do not convert results to booleans; they return the actual value of the last evaluated expression that determined the outcome.`,
      rubric: (t) => ["|| returns first truthy or final operand", "&& returns first falsy or final operand", "Does not perform boolean conversion on returned values"]
    },
    {
      question: (t) => `What does optional chaining (?.) accomplish in ${t}?`,
      answer: (t) => `Optional chaining (?.) stops evaluation and returns undefined if the property reference or function is null or undefined, preventing TypeError.`,
      rubric: (t) => ["Syntax: obj?.prop or obj?.()", "Short-circuits on nullish properties", "Prevents TypeError crash on deep lookups"]
    },
    {
      question: (t) => `How does array destructuring work in JavaScript for ${t}?`,
      answer: (t) => `Array destructuring uses pattern matching syntax to unpack values from arrays or iterables directly into variables based on index position.`,
      rubric: (t) => ["Syntax: const [a, b] = array", "Unpacks values by index position", "Supports default values and rest collection"]
    }
  ],
  async: [
    {
      question: (t) => `Explain the Event Loop and its components in relation to ${t}.`,
      answer: (t) => `The Event Loop coordinates JavaScript's single-threaded concurrency. The Call Stack runs synchronous code. Web APIs handle async requests. The Microtask (Promises) and Macrotask (timers) Queues enqueue callbacks to run when the stack is empty.`,
      rubric: (t) => ["Call Stack, Web APIs, Queues components", "Single-threaded loop checking for empty stack", "Orders microtasks before macrotasks"]
    },
    {
      question: (t) => `What is the difference between microtasks and macrotasks in modern JavaScript for ${t}?`,
      answer: (t) => `Microtasks (Promise.then, queueMicrotask) have higher priority; the loop drains the entire microtask queue before resuming. Macrotasks (setTimeout, DOM events) are executed one-by-one per loop tick.`,
      rubric: (t) => ["Microtasks: Promises, queueMicrotask", "Macrotasks: setTimeout, setImmediate", "Microtask queue must be empty before next macrotask runs"]
    },
    {
      question: (t) => `Explain Promises and their states in JavaScript related to ${t}.`,
      answer: (t) => `A Promise is an object representing the eventual completion or failure of an async operation. States are: pending (initial), fulfilled (succeeded), or rejected (failed).`,
      rubric: (t) => ["Pending, Fulfilled, Rejected states", "State transitions are permanent (immutable once settled)", "Constructed with executor resolver/rejecter"]
    },
    {
      question: (t) => `What is async/await and how does it simplify async code in ${t}?`,
      answer: (t) => `async/await is syntactic sugar over Promises. An async function returns a Promise, and the await keyword pauses execution inside the function until the promise settles, allowing clean, linear code.`,
      rubric: (t) => ["Syntactic sugar over Promises", "Pauses async function execution flow without blocking thread", "Enables standard try-catch blocks"]
    },
    {
      question: (t) => `What is the difference between Promise.all and Promise.allSettled in ${t}?`,
      answer: (t) => `Promise.all rejects immediately if any input promise rejects. Promise.allSettled waits for all input promises to settle, returning status objects for each.`,
      rubric: (t) => ["Promise.all short-circuits on rejection", "Promise.allSettled returns status and values for all", "Usage differences"]
    },
    {
      question: (t) => `Explain Promise.race vs Promise.any in ${t}.`,
      answer: (t) => `Promise.race resolves/rejects as soon as the first promise settles. Promise.any resolves as soon as the first promise resolves (ignoring rejections unless all fail).`,
      rubric: (t) => ["Promise.race settles on first complete (pass or fail)", "Promise.any resolves on first success", "Promise.any rejects only if all reject (AggregateError)"]
    },
    {
      question: (t) => `How do you execute a callback as a microtask in ${t}?`,
      answer: (t) => `You can explicitly queue a microtask using the global 'queueMicrotask(callback)' function, or by resolving a promise: 'Promise.resolve().then(callback)'.`,
      rubric: (t) => ["Use of queueMicrotask() API", "Use of Promise.resolve().then()", "Executes before browser renders or timers"]
    },
    {
      question: (t) => `What is callback hell and how is it resolved in JavaScript related to ${t}?`,
      answer: (t) => `Callback hell is heavily nested, unreadable code caused by chaining callbacks inside callbacks. It is resolved using Promises, promise chaining, or async/await.`,
      rubric: (t) => ["Pyramid of doom readability issue", "Resolved by Promises chaining", "Resolved by async/await flat structure"]
    },
    {
      question: (t) => `What is the unhandledrejection event in modern JavaScript related to ${t}?`,
      answer: (t) => `The 'unhandledrejection' event is emitted on the global object (window/global) when a Promise is rejected but has no rejection handler (.catch) attached.`,
      rubric: (t) => ["Fired on uncaught promise rejections", "Listened via window.addEventListener('unhandledrejection')", "Crucial for logging and error reporting"]
    },
    {
      question: (t) => `Explain thread starvation in the event loop for ${t}.`,
      answer: (t) => `Thread starvation occurs when long-running synchronous loops or recursively scheduled microtasks keep the Call Stack busy, never giving the Event Loop a chance to execute render updates or user inputs.`,
      rubric: (t) => ["Blocked Call Stack", "Infinite microtask queues starving macrotasks", "Causes page freezing/crash"]
    },
    {
      question: (t) => `How do you handle parallel asynchronous requests in JavaScript related to ${t}?`,
      answer: (t) => `Parallel requests are initiated by triggering asynchronous functions (like fetch) concurrently and resolving them together using Promise.all() or Promise.allSettled().`,
      rubric: (t) => ["Triggering calls concurrently (without await on each line)", "Awaiting them together using Promise.all()", "Maximizes network efficiency"]
    },
    {
      question: (t) => `Explain AbortController and how to cancel a fetch request in ${t}.`,
      answer: (t) => `AbortController instantiated object exposes a 'signal' property. By passing this signal to a fetch request, you can call controller.abort() to cancel the network request in progress.`,
      rubric: (t) => ["Instantiate AbortController", "Pass controller.signal to fetch options", "Call controller.abort() to cancel"]
    },
    {
      question: (t) => `How does setTimeout(fn, 0) behave in ${t}?`,
      answer: (t) => `setTimeout(fn, 0) enqueues 'fn' in the Macrotask Queue to execute after the current Call Stack is cleared and all microtasks have drained, introducing a delay of at least 4ms.`,
      rubric: (t) => ["Pushes callback to Macrotask Queue", "Executes after Call Stack is empty", "Min delay is browser throttled (approx 4ms)"]
    },
    {
      question: (t) => `Explain single-threaded execution in JavaScript related to ${t}.`,
      answer: (t) => `JavaScript runs on a single main thread, meaning it executes one instruction at a time. Concurrency is achieved asynchronously through the Event Loop, offloading blocking operations to Web APIs.`,
      rubric: (t) => ["Single call stack / single execution thread", "Prevents race conditions on variables", "Async offloading achieves concurrency"]
    },
    {
      question: (t) => `How does error propagation work in promise chains for ${t}.`,
      answer: (t) => `Errors propagate down a promise chain until they encounter a rejection handler (e.g. .catch() or second arg of .then()). If unhandled, it triggers an unhandled rejection.`,
      rubric: (t) => ["Errors bubble down promise links", "Skipping normal .then resolve handlers", "Caught by the first active catch() block"]
    }
  ],
  oop: [
    {
      question: (t) => `Explain prototypal inheritance in JavaScript in relation to ${t}.`,
      answer: (t) => `Every object has a prototype link ([[Prototype]]) pointing to another object. If a property is not found on the object itself, JavaScript searches up this prototype chain until it reaches null.`,
      rubric: (t) => ["Objects have internal prototype link", "Chain search up to null (Object.prototype)", "Inheritance of properties and methods"]
    },
    {
      question: (t) => `What is the difference between class fields and prototype methods in ${t}?`,
      answer: (t) => `Class fields are defined on individual object instances (each instance has its own copy). Prototype methods are defined on the class's Prototype object, shared across all instances to save memory.`,
      rubric: (t) => ["Class fields assigned to instance (in constructor)", "Prototype methods shared on the prototype object", "Memory efficiency differences"]
    },
    {
      question: (t) => `Explain constructor functions and the 'new' keyword in JavaScript related to ${t}.`,
      answer: (t) => `Constructor functions are regular functions called with the 'new' keyword. 'new' creates an empty object, links its prototype to the constructor's prototype, binds 'this' to the new object, and returns it.`,
      rubric: (t) => ["new creates empty object", "Links [[Prototype]] to Constructor.prototype", "Binds 'this' to new object and returns it"]
    },
    {
      question: (t) => `How does the super keyword work in JavaScript classes related to ${t}?`,
      answer: (t) => `super inside a constructor calls the parent constructor. super inside class methods allows calling overridden parent methods. It must be called in subclass constructors before using 'this'.`,
      rubric: (t) => ["super() invokes parent class constructor", "Must be called before 'this' access in constructor", "super.method() calls parent class method"]
    },
    {
      question: (t) => `What is Object.create and how does it differ from a constructor in ${t}?`,
      answer: (t) => `Object.create(proto) creates a new object and sets its prototype link directly to 'proto', bypassing the constructor function execution.`,
      rubric: (t) => ["Directly configures [[Prototype]]", "Bypasses constructor function code execution", "Allows clean object-to-object delegation"]
    },
    {
      question: (t) => `What is the role of __proto__ vs prototype in JavaScript related to ${t}?`,
      answer: (t) => `__proto__ (getter/setter) is the property on an object instance that exposes its internal prototype link. prototype is a property on functions/classes used to assign shared attributes when instantiated via 'new'.`,
      rubric: (t) => ["__proto__ is on instances (prototype chain link)", "prototype is on constructor functions", "Instance.__proto__ === Constructor.prototype"]
    },
    {
      question: (t) => `Explain bind, call, and apply methods in JavaScript related to ${t}.`,
      answer: (t) => `call and apply invoke a function immediately with a specified 'this' context; call takes arguments separated by commas, apply takes them as an array. bind returns a new function permanently bound to 'this'.`,
      rubric: (t) => ["call invokes immediately with comma parameters", "apply invokes immediately with array parameter", "bind returns a permanently bound copy of function"]
    },
    {
      question: (t) => `What are private properties in ES6 classes and how are they declared in ${t}?`,
      answer: (t) => `Private properties are declared by prefixing the field name with a hash symbol (#). They are strictly private to the class scope and cannot be accessed or modified from outside the class.`,
      rubric: (t) => ["Declared with '#' prefix", "Enforced at runtime and compile-time by browser", "Cannot be accessed on instance from outside class scope"]
    },
    {
      question: (t) => `Explain Object.freeze vs Object.seal in JavaScript related to ${t}.`,
      answer: (t) => `Object.freeze() prevents adding, deleting, or editing properties. Object.seal() prevents adding or deleting properties but allows modifying existing writeable properties.`,
      rubric: (t) => ["Object.freeze: completely immutable", "Object.seal: prevent structure changes but allow edits", "Both prevent extensions"]
    },
    {
      question: (t) => `What is encapsulation and polymorphism in JavaScript related to ${t}?`,
      answer: (t) => `Encapsulation hides object internals (e.g. #private fields). Polymorphism allows different classes to implement the same method names, responding with their own subclass implementation.`,
      rubric: (t) => ["Encapsulation restricts direct access to states", "Polymorphism supports uniform interface invocation", "JavaScript implements polymorphism dynamically"]
    },
    {
      question: (t) => `How does the instanceof operator resolve class instances in ${t}?`,
      answer: (t) => `instanceof checks if the constructor's prototype property exists anywhere in the object instance's prototype chain.`,
      rubric: (t) => ["Checks prototype chain linkages", "Syntax: object instanceof Constructor", "Can be customized using Symbol.hasInstance"]
    },
    {
      question: (t) => `Explain getters and setters in JS objects in relation to ${t}.`,
      answer: (t) => `Getters and setters bind an object property to a function call. A getter runs when the property is read; a setter runs when it is assigned a value, enabling validation/computed properties.`,
      rubric: (t) => ["get/set syntax in objects or classes", "Intercept property access", "Supports value validations and lazy evaluations"]
    },
    {
      question: (t) => `What is Object.assign vs the spread operator for object merging in ${t}?`,
      answer: (t) => `Object.assign() modifies the target object in-place (shallow copy). The spread operator (...) creates a new object, shallow-copying properties without modifying the original inputs.`,
      rubric: (t) => ["Object.assign target parameter is mutated", "Spread operator constructs a new object reference", "Both perform shallow property copies"]
    },
    {
      question: (t) => `Explain composition over inheritance in JavaScript for ${t}.`,
      answer: (t) => `Composition builds complex behaviors by combining small, focused objects/modules rather than creating deep inheritance hierarchies, avoiding tight coupling and rigid class structures.`,
      rubric: (t) => ["Design principle: 'has-a' over 'is-a'", "Combines behavior objects directly", "Avoids inheritance hierarchy bugs/rigidity"]
    },
    {
      question: (t) => `What are mixins and how are they implemented in JavaScript for ${t}?`,
      answer: (t) => `Mixins are classes or objects containing methods that can be copied into other classes without inheritance. They are usually implemented using Object.assign(Class.prototype, mixinObject).`,
      rubric: (t) => ["Reusable behaviors outside inheritance tree", "Implemented by copying properties to prototypes", "Object.assign application"]
    }
  ],
  browser: [
    {
      question: (t) => `What is the DOM and how is it structured in ${t}?`,
      answer: (t) => `The Document Object Model (DOM) is an object-based tree representing the parsed HTML document. Each node represents an element, attribute, or piece of text, accessible via JavaScript.`,
      rubric: (t) => ["Tree structure of nodes representing HTML", "Document is the entry point", "Allows dynamic content/style updates"]
    },
    {
      question: (t) => `Explain event bubbling and event capturing in browser events related to ${t}.`,
      answer: (t) => `Capturing travels from the root window down to the target element. Bubbling travels from the target element back up to the root window. Bubbling is the default phase for listeners.`,
      rubric: (t) => ["Capturing phase (top-down)", "Bubbling phase (bottom-up)", "Configured via third parameter of addEventListener"]
    },
    {
      question: (t) => `What is event delegation and its advantages in ${t}?`,
      answer: (t) => `Event delegation is a design pattern where a single event listener is attached to a parent element to handle events on child elements, utilizing event bubbling. It reduces memory usage and handles dynamic elements.`,
      rubric: (t) => ["Single listener on parent node", "Relies on event bubbling propagation", "Saves memory and automatically supports dynamically added children"]
    },
    {
      question: (t) => `Explain localStorage vs sessionStorage in ${t}.`,
      answer: (t) => `localStorage persists data indefinitely across sessions until cleared. sessionStorage stores data for the duration of the page session (cleared when the tab or window is closed).`,
      rubric: (t) => ["localStorage persists indefinitely", "sessionStorage persists for tab lifespan", "Both share 5MB capacity per origin"]
    },
    {
      question: (t) => `Explain the difference between DOMContentLoaded and load events in the browser for ${t}.`,
      answer: (t) => `DOMContentLoaded fires when the HTML is fully parsed and DOM is built. 'load' fires later, waiting for all external stylesheets, images, and sub-frames to finish downloading.`,
      rubric: (t) => ["DOMContentLoaded fires on parsed HTML DOM tree complete", "'load' fires on complete asset page load", "DOMContentLoaded is preferred for logic initialization"]
    },
    {
      question: (t) => `What is Cross-Site Scripting (XSS) and how is it prevented in JavaScript for ${t}?`,
      answer: (t) => `XSS is an attack where malicious scripts are injected into web pages. It is prevented by sanitizing user input, using textContent/innerText instead of innerHTML, and enforcing a Content Security Policy (CSP).`,
      rubric: (t) => ["Injecting malicious scripts into client browser", "Use textContent / escape user inputs", "Set Content Security Policy headers"]
    },
    {
      question: (t) => `Explain CORS and how the browser handles it in ${t}.`,
      answer: (t) => `CORS is a browser security mechanism that restricts cross-origin HTTP requests. The browser inspects server response headers (e.g. Access-Control-Allow-Origin) or sends preflight OPTIONS requests to verify permissions.`,
      rubric: (t) => ["Cross-Origin Resource Sharing security restriction", "OPTIONS preflight request for write/custom headers", "Access-Control headers on response"]
    },
    {
      question: (t) => `Explain how browser routing (History API) works for ${t}.`,
      answer: (t) => `Single Page Applications use the History API (history.pushState, replaceState) to modify the browser URL and history stack programmatically without trigger a page reload, listening to popstate event.`,
      rubric: (t) => ["pushState/replaceState changes URL without reload", "popstate event detects browser back/forward clicks", "Underpins SPA routers"]
    },
    {
      question: (t) => `What is the difference between element.innerHTML and element.textContent in ${t}?`,
      answer: (t) => `innerHTML parses the string content as HTML, generating child nodes. textContent reads/writes raw text content, escaping HTML tags and protecting against XSS attacks.`,
      rubric: (t) => ["innerHTML parses HTML structures", "textContent treats everything as raw text", "textContent prevents script injections"]
    },
    {
      question: (t) => `What is requestAnimationFrame and why is it preferred for animations in ${t}?`,
      answer: (t) => `requestAnimationFrame(callback) schedules a function to run before the next screen repaint. It is preferred because the browser synchronizes it with refresh rates, pausing it in background tabs to save battery.`,
      rubric: (t) => ["Syncs callbacks with screen refresh rate repaints", "Pauses in background tabs to conserve CPU", "Provides smoother visuals than setInterval"]
    },
    {
      question: (t) => `Explain event.preventDefault vs event.stopPropagation in browser events for ${t}.`,
      answer: (t) => `event.preventDefault() stops the browser's default action (e.g., following a link). event.stopPropagation() stops the event from bubbling or capturing further up/down the DOM tree.`,
      rubric: (t) => ["preventDefault cancels browser default behavior", "stopPropagation stops event propagation chain", "They are completely independent"]
    },
    {
      question: (t) => `What is IntersectionObserver and its use cases in ${t}?`,
      answer: (t) => `IntersectionObserver detects when an element intersects with the browser viewport or a parent container. Use cases include lazy-loading images, infinite scroll, or triggering scroll animations.`,
      rubric: (t) => ["Asynchronously monitors element visibility", "Calculates intersection ratios", "Used for lazy loading, infinite scroll, and scroll logs"]
    },
    {
      question: (t) => `How does the browser layout / reflow process work for ${t}?`,
      answer: (t) => `Reflow is the browser calculating the positions and sizes of elements in the render tree. Changing layout properties (width, height, offset) triggers reflow, which is computationally expensive.`,
      rubric: (t) => ["Calculates element dimensions/coordinates", "Triggered by changes to geometry/DOM tree", "Batch DOM writes to avoid layout thrashing"]
    },
    {
      question: (t) => `What are MutationObservers and what do they monitor in ${t}?`,
      answer: (t) => `MutationObserver is a web API that monitors changes to the DOM tree, including node additions, deletions, or attribute modifications, firing a callback with a list of MutationRecords.`,
      rubric: (t) => ["Monitors DOM tree changes", "Watches attributes, childNode list, or characterData", "More performant than legacy Mutation Events"]
    },
    {
      question: (t) => `How do you handle client-side form validation securely in ${t}?`,
      answer: (t) => `Client-side validation is handled using HTML5 validation attributes and custom validity checks in JavaScript. However, it must always be backed by server-side validation, as client validation can be bypassed.`,
      rubric: (t) => ["HTML5 validation attributes (required, pattern)", "JavaScript validation prevents invalid form submissions", "Always validate on the server side (client is untrusted)"]
    }
  ]
};

// Helper to construct pools of at least 15 questions
function getPooledQuizzesAndInterviews(
  topicId: string,
  title: string,
  type: TopicType,
  existingQuizzes: QuizQuestion[],
  existingInterviews: InterviewQuestion[]
): { quizzes: QuizQuestion[]; interviews: InterviewQuestion[] } {
  const finalQuizzes = [...existingQuizzes];
  const finalInterviews = [...existingInterviews];

  const quizTemplates = JAVASCRIPT_QUIZ_TEMPLATES[type] || [];
  const interviewTemplates = JAVASCRIPT_INTERVIEW_TEMPLATES[type] || [];

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

// Map the raw data to export the fully pooled JAVASCRIPT_CURRICULUM
export const JAVASCRIPT_CURRICULUM: CurriculumTopic[] = RAW_JAVASCRIPT_CURRICULUM.map((topic) => {
  const pooled = getPooledQuizzesAndInterviews(
    topic.id,
    topic.title,
    topic.type,
    topic.quizzes,
    topic.interviews
  );
  return {
    ...topic,
    quizzes: pooled.quizzes,
    interviews: pooled.interviews
  };
});

