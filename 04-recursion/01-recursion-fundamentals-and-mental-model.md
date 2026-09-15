# 04.1 — Recursion Fundamentals & Mental Model

## Purpose

Recursion is a way to solve a problem by defining a solution in terms of **smaller instances of the same problem**.

For DSA, recursion is more than a coding technique. It is a foundation for:

- trees;
- graphs;
- divide and conquer;
- backtracking;
- dynamic programming;
- search spaces;
- recursive data structures;
- state-space exploration.

The goal of this chapter is to build a precise mental model before moving into advanced recursive algorithms.

---

# 1. The Core Definition

A recursive algorithm has two essential parts:

```text
Base case
Recursive case
```

Example:

```js
function countdown(n) {
  if (n === 0) return;
  countdown(n - 1);
}
```

The base case stops recursion.

The recursive case reduces the problem toward the base case.

A useful rule:

> Every recursive call must move the problem toward termination.

---

# 2. The Recursive Mental Model

Do not think:

> “The function calls itself, so somehow it repeats.”

Think:

```text
current problem
→ smaller problem
→ smaller problem
→ base case
→ return
→ reconstruct previous result
→ return
→ reconstruct previous result
```

Recursion has two conceptual directions:

```text
CALLING DOWN
RETURNING UP
```

Understanding both is essential.

---

# 3. Base Case

The base case is the smallest problem whose answer is immediately known.

Example:

```js
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}
```

Here:

```text
factorial(0) = 1
```

is the base case.

Without it, recursion does not know when to stop.

---

# 4. Recursive Case

The recursive case must transform the current problem into a smaller or simpler problem.

```js
return n * factorial(n - 1);
```

The problem changes from:

```text
factorial(n)
```

to:

```text
factorial(n - 1)
```

This creates progress.

---

# 5. Progress Measure

A powerful way to reason about termination is to identify a quantity that moves toward a boundary.

Examples:

```text
n decreases toward 0
index increases toward length
remaining items decreases toward 0
remaining search space shrinks
```

Call this a **progress measure**.

A recursive algorithm without a clear progress measure deserves suspicion.

---

# 6. Call Stack

Every active recursive call has its own execution context.

Conceptually:

```text
factorial(4)
  factorial(3)
    factorial(2)
      factorial(1)
        factorial(0)
```

The runtime stack stores the information needed to resume each caller.

When the base case returns:

```text
factorial(0)
→ factorial(1)
→ factorial(2)
→ factorial(3)
→ factorial(4)
```

This is why recursive execution has both depth and return behavior.

---

# 7. Stack Frame Mental Model

A recursive call conceptually contains:

```text
parameters
local variables
return location
intermediate state
```

For example:

```js
function sumTo(n) {
  if (n === 0) return 0;
  const partial = sumTo(n - 1);
  return n + partial;
}
```

The caller must remember `n` and what to do after the recursive call returns.

---

# 8. Trace Recursion Manually

For:

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

Trace:

```text
sumTo(3)
= 3 + sumTo(2)
= 3 + (2 + sumTo(1))
= 3 + (2 + (1 + sumTo(0)))
= 3 + (2 + (1 + 0))
= 6
```

This is one of the most important beginner exercises.

Do not skip manual traces.

---

# 9. Recursion Tree vs Call Stack

These are different concepts.

### Call stack

Represents currently active calls.

Usually associated with **depth**.

### Recursion tree

Represents all recursive calls created during execution.

Useful for understanding **total work**.

Example:

```text
f(n)
├── f(n-1)
└── f(n-1)
```

The stack may have depth `O(n)` while the total call tree can contain exponentially many calls.

---

# 10. Linear Recursion

A function makes one recursive call per activation.

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

Typical recurrence:

```text
T(n) = T(n - 1) + O(1)
```

Therefore:

```text
Time:  O(n)
Space: O(n) stack depth
```

---

# 11. Multiple Recursive Calls

Consider:

```js
function f(n) {
  if (n <= 1) return 1;
  return f(n - 1) + f(n - 2);
}
```

This creates branching.

The total number of calls can grow exponentially.

The key lesson:

> One recursive call and multiple recursive calls can have radically different complexity.

---

# 12. Recursion Is Not Automatically Slow

Recursion itself does not imply exponential complexity.

Examples:

```text
linear recursion → O(n)
divide-and-conquer → often O(n log n)
binary search recursion → O(log n)
naive Fibonacci → exponential
```

Complexity depends on:

- number of recursive calls;
- size reduction;
- non-recursive work;
- repeated subproblems.

---

# 13. Recursion and Divide-and-Conquer

A divide-and-conquer algorithm often follows:

```text
divide
→ recursively solve parts
→ combine
```

Example structure:

```js
function solve(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = solve(arr.slice(0, mid));
  const right = solve(arr.slice(mid));

  return combine(left, right);
}
```

Later phases will formalize recurrence analysis.

---

# 14. Recursion and Backtracking

Backtracking uses recursion to explore choices.

Conceptually:

```text
choose
→ recurse
→ undo choice
→ choose another option
```

Example:

```text
[]
├── choose A
│   ├── choose B
│   └── choose C
└── choose B
    ├── choose A
    └── choose C
```

This is fundamentally state-space exploration.

---

# 15. Recursion and Trees

Trees are naturally recursive.

A tree node can be viewed as:

```text
node
├── left subtree
└── right subtree
```

A recursive traversal naturally mirrors this structure:

```js
function traverse(node) {
  if (node === null) return;

  traverse(node.left);
  // process node
  traverse(node.right);
}
```

Trees will later become a major Phase 11 topic.

---

# 16. Recursion and State

A recursive call can be understood as:

```text
state
→ transition
→ smaller/new state
→ recursive solve
```

State may contain:

- index;
- remaining capacity;
- accumulated result;
- selected elements;
- current node;
- current substring;
- remaining choices.

This connects recursion directly to algorithmic state modeling from Phase 01.

---

# 17. Parameter Design

Recursive parameters should represent exactly the information required by the recursive subproblem.

Bad design:

```text
pass entire global state unnecessarily
```

Better:

```text
pass the minimum sufficient state
```

This improves:

- correctness;
- reasoning;
- memory usage;
- testability.

---

# 18. Accumulator Pattern

Some recursive algorithms carry a partial result.

Example:

```js
function sum(arr, index = 0, total = 0) {
  if (index === arr.length) return total;
  return sum(arr, index + 1, total + arr[index]);
}
```

The state is:

```text
index
running total
```

This can make the recursive transition explicit.

Note: JavaScript does not generally provide a reliable guarantee that recursive calls will be optimized into constant stack space, so do not assume an accumulator automatically makes recursion `O(1)` space.

---

# 19. Structural Recursion

Structural recursion follows the structure of the input.

Examples:

```text
array → process current item + remainder
linked list → node + next
binary tree → node + subtrees
nested object → object + nested values
```

This is particularly useful for recursive data structures.

---

# 20. Index-Based vs Slice-Based Recursion

Compare:

```js
function solve(arr, index) {
  // recurse with index + 1
}
```

with:

```js
function solve(arr) {
  const rest = arr.slice(1);
  return solve(rest);
}
```

The second version may allocate new arrays repeatedly.

Therefore, logically equivalent recursive algorithms can have different practical and asymptotic memory behavior.

Prefer explicit indices when they avoid unnecessary copying.

---

# 21. Mutation in Recursion

Recursive functions can mutate shared state:

```js
function visit(arr, index) {
  arr[index] = ...;
  visit(arr, index + 1);
}
```

Be precise about:

- ownership;
- aliases;
- restoration;
- whether mutation is part of the contract.

This becomes critical in backtracking.

---

# 22. Recursive Correctness

A recursive correctness proof usually follows:

### Base case
Show the answer is correct for the smallest input.

### Inductive/recursive assumption
Assume the recursive solution correctly solves the smaller problem.

### Transition
Show that combining the smaller solution with the current step produces the correct solution for the current problem.

This is the algorithmic form of induction.

---

# 23. Recursive Invariant

Example:

```text
solve(index, state)
```

Invariant:

> `state` correctly represents all decisions/results accumulated before `index`.

Each recursive transition must preserve this statement.

This is especially useful in backtracking and recursive sequence processing.

---

# 24. Termination Proof

A recursive algorithm needs more than a base case.

You should be able to prove that every path eventually reaches it.

Use a decreasing measure such as:

```text
n
remaining elements
remaining choices
search interval size
```

If the measure does not consistently progress, infinite recursion may occur.

---

# 25. Common Recursion Bugs

### Missing base case

```js
function f(n) {
  return f(n - 1);
}
```

### Base case unreachable

The recursive transition moves away from it.

### Wrong return propagation

The recursive result is calculated but discarded.

### State mutation leak

A recursive branch changes state that another branch expects to be unchanged.

### Duplicate work

The same subproblem is solved repeatedly.

### Excessive stack depth

The recursion depth exceeds practical runtime limits.

---

# 26. Recursion vs Iteration

A recursive solution is not automatically superior.

Iteration may provide:

- lower stack overhead;
- explicit memory control;
- easier handling of very large depths;
- sometimes better production behavior.

Recursion may provide:

- cleaner structural reasoning;
- natural tree traversal;
- natural divide-and-conquer expression;
- simpler state-space exploration.

Choose based on the problem, not ideology.

---

# 27. Recursion in JavaScript

JavaScript recursion is constrained by call-stack depth.

Therefore:

```text
O(n) recursive depth
```

can become a practical problem for large `n`, even when the algorithm is theoretically correct.

For production code, evaluate whether an iterative implementation is safer.

---

# 28. Backend Applications

Recursion appears conceptually in:

- nested configuration processing;
- directory/tree traversal;
- JSON transformation;
- dependency traversal;
- workflow graphs;
- hierarchical permissions;
- recursive query structures;
- divide-and-conquer processing.

But backend production systems often convert deep recursion to explicit stacks or iterative traversal when depth is unbounded.

---

# 29. AI Applications

Recursion underlies concepts such as:

- search trees;
- beam-search-style exploration;
- recursive parsing;
- hierarchical document processing;
- tree-structured representations;
- recursive problem decomposition;
- backtracking search;
- divide-and-conquer preprocessing.

Later AI-oriented phases will connect these ideas to state-space search and inference pipelines.

---

# 30. The Fundamental Recursive Template

Use this mental template:

```js
function solve(state) {
  if (isBaseCase(state)) {
    return baseAnswer(state);
  }

  const smallerState = makeProgress(state);
  const smallerAnswer = solve(smallerState);

  return combine(state, smallerAnswer);
}
```

Ask four questions:

```text
What is the state?
What is the base case?
How does the state become smaller?
How is the returned answer used?
```

---

# 31. Recursive Design Checklist

Before implementing:

- [ ] Define the problem state.
- [ ] Define the smallest solvable state.
- [ ] Define the recursive transition.
- [ ] Identify the progress measure.
- [ ] Determine what must be remembered after the call returns.
- [ ] Determine whether state is copied or shared.
- [ ] Determine whether work is repeated.
- [ ] Estimate recursion depth.
- [ ] Estimate total recursive calls.
- [ ] Define the correctness argument.
- [ ] Consider an iterative alternative.

---

# 32. Key Takeaways

1. Recursion solves a problem through smaller instances of the same problem.
2. Every correct recursive algorithm needs a reachable base case and progress toward it.
3. The call stack explains active recursive depth.
4. The recursion tree explains total recursive work.
5. One recursive call can be linear; branching recursion can be exponential.
6. Recursive parameters should represent sufficient state, not arbitrary context.
7. Index-based recursion can avoid repeated array allocations.
8. Recursive correctness naturally follows an inductive structure.
9. Recursion is foundational for trees, divide-and-conquer, backtracking, and dynamic programming.
10. In JavaScript, recursion depth is a practical engineering constraint.
11. Recursion is a tool—not a requirement. Iteration may be better when depth is large.

---

# Revision Checklist

- [ ] Can I explain recursion without saying “a function calls itself”?
- [ ] Can I identify the base case?
- [ ] Can I prove progress toward termination?
- [ ] Can I trace the call stack manually?
- [ ] Can I distinguish call stack from recursion tree?
- [ ] Can I calculate recursion depth?
- [ ] Can I identify repeated subproblems?
- [ ] Can I explain recursive correctness using induction?
- [ ] Can I convert a simple recursive algorithm to iteration?
- [ ] Can I identify unnecessary allocations in recursive JavaScript code?
- [ ] Can I explain where recursion will appear in backend and AI systems?
