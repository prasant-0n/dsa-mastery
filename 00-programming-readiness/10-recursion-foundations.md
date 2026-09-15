# 00.10 — Recursion Foundations

## 1. Why Recursion Matters for DSA

Recursion is a way to define a computation in terms of a smaller version of the same computation.

It is not merely a programming trick. Recursion gives us a way to reason about problems with naturally recursive structure:

```text
folder
 └── folder
      └── folder

linked list
 └── next node
      └── next node

 tree
 ├── left subtree
 └── right subtree
```

Recursion becomes foundational for:

- tree traversal
- divide and conquer
- backtracking
- DFS
- merge sort
- quicksort
- dynamic programming
- recursive data structures
- parsing and nested data processing

---

## 2. The Core Mental Model

A recursive function has two essential parts:

```text
BASE CASE
    ↓
stop recursion

RECURSIVE CASE
    ↓
solve a smaller version
```

Example:

```js
function countdown(n) {
    if (n === 0) {
        return;
    }

    console.log(n);
    countdown(n - 1);
}
```

For `countdown(3)`:

```text
countdown(3)
    ↓
countdown(2)
    ↓
countdown(1)
    ↓
countdown(0)
    ↓
return
```

---

## 3. Base Case

The base case is the condition under which recursion stops.

Without a valid base case, recursion can continue until the runtime throws an error because the call stack is exhausted.

```js
function countDown(n) {
    if (n <= 0) {
        return;
    }

    countDown(n - 1);
}
```

The base case should be:

- reachable
- correct
- simple
- sufficient to terminate the recursive process

---

## 4. Recursive Case

The recursive case must make progress toward the base case.

Good:

```js
countDown(n - 1);
```

Potentially invalid:

```js
countDown(n);
```

The second version does not reduce the problem.

A recursive algorithm should make its progress obvious.

---

## 5. Call Stack

Every function call creates an execution frame.

Recursive calls create multiple frames before returning.

For:

```js
function factorial(n) {
    if (n <= 1) {
        return 1;
    }

    return n * factorial(n - 1);
}
```

`factorial(4)` conceptually creates:

```text
factorial(4)
  → 4 * factorial(3)
        → 3 * factorial(2)
              → 2 * factorial(1)
                    → 1
```

Then the calls return in reverse order:

```text
1
2 * 1
3 * 2
4 * 6
```

Result:

```text
24
```

---

## 6. Recursion Has Two Directions

It is useful to distinguish:

### Work Before Recursive Call

```js
function print(n) {
    if (n === 0) return;

    console.log(n);
    print(n - 1);
}
```

Output:

```text
3
2
1
```

### Work After Recursive Call

```js
function print(n) {
    if (n === 0) return;

    print(n - 1);
    console.log(n);
}
```

Output:

```text
1
2
3
```

The second form is important for understanding tree traversal and recursive return behavior.

---

## 7. Recursion Is Not Automatically Efficient

A recursive solution can be elegant but computationally expensive.

Consider naive Fibonacci:

```js
function fib(n) {
    if (n <= 1) {
        return n;
    }

    return fib(n - 1) + fib(n - 2);
}
```

The same subproblems are repeatedly recomputed.

Its time complexity is exponential in the straightforward implementation.

This is an early example of why algorithm analysis matters.

---

## 8. Recursion vs Iteration

Many recursive algorithms can be written iteratively.

Example:

```js
function sumTo(n) {
    if (n === 0) return 0;
    return n + sumTo(n - 1);
}
```

Iterative version:

```js
function sumTo(n) {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}
```

Both can be `O(n)` time.

But recursive execution additionally consumes call-stack space.

Do not choose recursion merely because it produces shorter code.

Choose it when recursive structure makes the algorithm easier to derive, verify, or maintain.

---

## 9. Recursion Complexity

For recursive algorithms, analyze at least:

```text
1. Number of calls
2. Work performed per call
3. Maximum recursion depth
4. Additional data structures
```

For a single recursive call reducing `n` by one:

```text
calls: O(n)
depth: O(n)
```

For a problem repeatedly halving its input:

```text
n
n/2
n/4
n/8
...
1
```

Depth is:

```text
O(log n)
```

---

## 10. Recursive State

Every recursive call needs enough state to continue the computation.

Example:

```js
function sum(arr, index) {
    if (index === arr.length) {
        return 0;
    }

    return arr[index] + sum(arr, index + 1);
}
```

The recursive state is:

```text
arr
index
```

The important question is:

> What is the smallest state needed to describe the remaining problem?

This question becomes extremely important in dynamic programming.

---

## 11. Recursion on Arrays

An array can be processed recursively by shrinking the active region.

Two common models are:

```text
index-based
→ process arr[index], recurse to index + 1
```

and:

```text
boundary-based
→ process a range such as [left, right]
```

The boundary model becomes important for:

- binary search
- quicksort
- merge sort
- partitioning
- recursive two-pointer algorithms

---

## 12. Recursion on Linked Structures

A linked list is naturally recursive because every node can point to another list segment.

Conceptually:

```text
Node
 ├── value
 └── next → Node → Node → null
```

A recursive list traversal can be described as:

```text
process current node
solve remaining list
```

The `null` pointer becomes a natural base case.

---

## 13. Recursion on Trees

Trees are one of the most important applications of recursion.

A binary tree is naturally defined as:

```text
Tree
├── value
├── left subtree
└── right subtree
```

A recursive traversal therefore follows the structure directly.

```text
visit node
    ↓
solve left subtree
    ↓
solve right subtree
```

This will become central in Phase 11.

---

## 14. Divide and Conquer Preview

Divide-and-conquer algorithms recursively break a problem into smaller problems.

General pattern:

```text
problem
   ↓
divide
   ↓
smaller problems
   ↓
solve recursively
   ↓
combine
```

Examples:

- merge sort
- quicksort
- binary search

Not every recursive algorithm is divide-and-conquer, but divide-and-conquer is one of the most important uses of recursion.

---

## 15. Backtracking Preview

Backtracking explores a decision tree recursively.

Conceptually:

```text
choose
  ↓
explore
  ↓
undo
  ↓
choose another option
```

This introduces a critical relationship between recursion and mutation:

```text
recursive call
     ↓
mutate state
     ↓
explore
     ↓
restore state
```

We will study this deeply in Phase 16.

---

## 16. Recursive Thinking Process

When given a recursive problem, ask:

```text
1. What is the smallest valid input?
2. What should happen there?
3. How can I reduce the problem?
4. What information must be carried forward?
5. What does the recursive call return?
6. How do I combine that result with current work?
7. How deep can recursion become?
```

Do not begin by writing recursive syntax.

First define the smaller problem.

---

## 17. Mathematical Recurrence

A recursive algorithm can often be described using a recurrence.

For:

```js
function sumTo(n) {
    if (n === 0) return 0;
    return n + sumTo(n - 1);
}
```

The work can be represented as:

```text
T(n) = T(n - 1) + O(1)
```

which gives:

```text
T(n) = O(n)
```

For divide-and-conquer algorithms, recurrence analysis becomes a major skill.

---

## 18. Tail Recursion

A call is tail-recursive when the recursive call is the final operation of the function.

Example:

```js
function countDown(n) {
    if (n === 0) return;
    countDown(n - 1);
}
```

However, do not assume that JavaScript automatically optimizes tail recursion in normal Node.js execution.

For practical Node.js algorithm engineering, recursion depth still matters.

---

## 19. Stack Overflow Risk

JavaScript recursion consumes the runtime call stack.

A sufficiently deep recursive algorithm can fail with a stack overflow.

For very large linear-depth problems, an iterative solution may be safer.

The engineering decision is therefore:

```text
Recursive clarity
      vs
Stack-depth constraints
```

Both matter.

---

## 20. Recursion and Mutation

Recursive algorithms often interact with mutable state.

Example categories:

```text
backtracking
DFS
tree modification
partitioning
in-place divide and conquer
```

Before recursive calls, identify:

```text
what state changes?
who owns it?
what must be restored?
what is shared?
```

This connects directly to the previous chapter on references and mutation.

---

## 21. Backend Applications

Recursion appears in backend engineering when processing hierarchical data:

- nested configuration
- filesystem-like structures
- category trees
- organizational hierarchies
- AST processing
- dependency graphs/trees
- recursive data transformation
- parsing nested payloads

For production systems, depth limits and iterative alternatives should be considered when input can be externally controlled.

---

## 22. AI Applications

Recursive reasoning appears in:

- tree search
- search-space exploration
- recursive parsing
- hierarchical clustering concepts
- decision trees
- search algorithms
- symbolic reasoning structures

Later AI algorithm work will replace simple recursion with specialized graph/search/indexing structures where scale requires it.

---

## 23. Common Mistakes

- Forgetting the base case.
- Writing a base case that cannot be reached.
- Recursive calls that do not reduce the problem.
- Losing required state between calls.
- Misunderstanding what a recursive call returns.
- Confusing recursion depth with total number of calls.
- Ignoring stack-space complexity.
- Using recursion for a problem that is clearer and safer iteratively.
- Mutating shared state without restoring it.
- Assuming tail recursion eliminates stack usage in Node.js.

---

## 24. DSA Mental Model

A recursive function should be explainable in one sentence:

> "Solve the current problem by handling the current piece and asking the same function to solve a smaller remaining problem."

For every recursive algorithm, identify:

```text
Base case
Recursive case
State
Progress
Return value
Recursion depth
Time complexity
Space complexity
```

If any of these are unclear, the recursion is not yet understood.

---

## 25. Exercises

1. Write a recursive countdown from `n` to `1`.
2. Write a recursive count-up from `1` to `n`.
3. Calculate the sum from `1` to `n` recursively.
4. Calculate `n!` recursively.
5. Implement recursive power calculation for non-negative integer exponents.
6. Recursively find the maximum value in an array.
7. Recursively find the first index of a target in an array.
8. Recursively count occurrences of a target in an array.
9. Recursively reverse a string without using `reverse()`.
10. Recursively determine whether a string is a palindrome.
11. Recursively sum an array using an index parameter instead of slicing the array.
12. Implement recursive binary search using `left` and `right` boundaries.
13. Draw the complete call tree for naive `fib(5)` and count the calls.
14. Rewrite naive recursive Fibonacci iteratively and compare complexity.
15. Implement recursive traversal of a nested object/array structure and count all numeric values.
16. Write one recursive and one iterative solution for the same problem and compare time, auxiliary space, readability, and stack risk.
17. Given a recursive function, identify its base case, recursive case, state, progress, and maximum depth before running it.
18. Create a deliberately broken recursive function with no progress toward its base case. Explain why it fails, then fix it.

---

## 26. Self-Check

- [ ] I can identify the base case.
- [ ] I can identify the recursive case.
- [ ] I can prove that each call makes progress.
- [ ] I understand the call stack.
- [ ] I can trace recursive execution by hand.
- [ ] I can determine recursion depth.
- [ ] I can calculate basic recursive complexity.
- [ ] I understand recursion vs iteration trade-offs.
- [ ] I can write index-based recursive array algorithms.
- [ ] I understand why trees naturally fit recursion.
- [ ] I understand the connection between recursion and backtracking.
- [ ] I know when recursion can create stack-overflow risk.
