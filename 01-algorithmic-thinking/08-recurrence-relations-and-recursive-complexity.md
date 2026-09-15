# 01.8 — Recurrence Relations & Recursive Complexity

> Recursive code has two costs to reason about: the work done by each call and the shape of the call tree.

## Learning Objectives

By the end of this chapter, you should be able to:

- Translate recursive code into recurrence relations.
- Identify base-case and recursive work.
- Draw recursion trees for small inputs.
- Distinguish linear, logarithmic, polynomial, and exponential recursion.
- Analyze divide-and-conquer algorithms.
- Understand why repeated subproblems create exponential behavior.
- Use substitution, recursion-tree reasoning, and the Master Theorem appropriately.
- Analyze recursion depth separately from total runtime.
- Recognize when recursion adds stack-space cost.
- Connect recursive complexity to backend and AI workloads.

---

## 1. Why Recurrence Relations Matter

For an iterative algorithm, complexity often follows directly from loop counts.

Recursive algorithms are different because one function call may create more function calls.

For example:

```js
function f(n) {
  if (n <= 1) return;
  f(n - 1);
}
```

The work is related to the work of a smaller problem:

```text
T(n) = T(n - 1) + O(1)
```

That equation is a **recurrence relation**.

It describes how the cost of a problem depends on the cost of its smaller subproblems.

---

## 2. Anatomy of a Recursive Complexity Equation

A common form is:

```text
T(n) = aT(n / b) + f(n)
```

where:

- `a` = number of recursive subproblems,
- `n / b` = size of each subproblem,
- `f(n)` = work performed outside recursive calls.

Example:

```text
T(n) = 2T(n/2) + O(n)
```

This is the classic shape of merge sort.

Do not memorize the equation without connecting each term to actual code.

---

## 3. Step 1 — Identify the Base Case

Every recurrence needs a terminal condition.

For:

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

The base case is:

```text
T(1) = O(1)
```

Without a base case, the recursion does not terminate.

---

## 4. Step 2 — Count Recursive Calls

Look at how many recursive calls are created.

### One call

```js
f(n - 1);
```

Possible recurrence:

```text
T(n) = T(n - 1) + f(n)
```

### Two half-size calls

```js
f(n / 2);
f(n / 2);
```

Possible recurrence:

```text
T(n) = 2T(n/2) + f(n)
```

### Two slightly smaller calls

```js
f(n - 1);
f(n - 2);
```

Possible recurrence:

```text
T(n) = T(n-1) + T(n-2) + f(n)
```

This distinction is fundamental.

---

## 5. Step 3 — Determine Non-Recursive Work

Suppose:

```js
function f(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    doWork();
  }

  f(Math.floor(n / 2));
}
```

The recursive call costs:

```text
T(n/2)
```

The loop costs:

```text
O(n)
```

Therefore:

```text
T(n) = T(n/2) + O(n)
```

---

## 6. Recurrence: T(n) = T(n - 1) + O(1)

Example:

```js
function countdown(n) {
  if (n <= 0) return;
  countdown(n - 1);
}
```

Recurrence:

```text
T(n) = T(n - 1) + O(1)
```

Expanding:

```text
T(n)
= T(n-1) + 1
= T(n-2) + 2
= T(n-3) + 3
...
= T(1) + (n-1)
```

Therefore:

```text
T(n) = O(n)
```

Recursion depth is also:

```text
O(n)
```

---

## 7. Recurrence: T(n) = T(n - 1) + O(n)

Suppose each recursive call performs a linear scan.

```text
T(n) = T(n-1) + O(n)
```

Expansion:

```text
n + (n-1) + (n-2) + ... + 1
```

The sum is:

```text
O(n²)
```

This demonstrates an important lesson:

> A recursive function can have linear recursion depth but quadratic total work.

Depth and runtime are different measurements.

---

## 8. Recurrence: T(n) = T(n / 2) + O(1)

Example:

```js
function halve(n) {
  if (n <= 1) return;
  halve(Math.floor(n / 2));
}
```

Each call halves the input.

After `k` calls:

```text
n / 2^k ≈ 1
```

Therefore:

```text
2^k ≈ n
k ≈ log₂ n
```

So:

```text
Time:  O(log n)
Space: O(log n) call stack
```

---

## 9. Recursion Depth vs Total Runtime

Never confuse these.

Example:

```text
T(n) = 2T(n/2) + O(n)
```

The recursion depth is:

```text
O(log n)
```

But the total runtime is:

```text
O(n log n)
```

Why?

Because each level contains a total of O(n) work, and there are O(log n) levels.

```text
Level 0 → O(n)
Level 1 → O(n)
Level 2 → O(n)
...
Level log n → O(n)
```

---

## 10. Recursion Trees

A recursion tree visualizes recursive calls.

For:

```text
T(n) = 2T(n/2) + O(n)
```

we get:

```text
                 n
              /     \
            n/2     n/2
           /  \     /  \
        n/4  n/4  n/4  n/4
```

At each level:

```text
number of nodes × work per node
```

For merge-sort-like recursion:

```text
2^level × O(n / 2^level)
= O(n)
```

With O(log n) levels:

```text
O(n log n)
```

---

## 11. Recursion Tree for Naive Fibonacci

Naive Fibonacci:

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

Its recurrence is approximately:

```text
T(n) = T(n-1) + T(n-2) + O(1)
```

The recursion tree branches repeatedly.

Many states are recomputed:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)
    ├── fib(2)
    └── fib(1)
```

The number of calls grows exponentially.

A common bound is:

```text
O(φ^n)
```

where `φ` is the golden ratio, often simplified to exponential growth such as O(2^n) for high-level analysis.

---

## 12. Memoization Changes the Recurrence

With memoization, each Fibonacci state is computed once.

There are only O(n) distinct states:

```text
fib(0), fib(1), ..., fib(n)
```

Therefore:

```text
Time:  O(n)
Space: O(n)
```

The key transformation is:

```text
Repeated computation
        ↓
Remember state
        ↓
Each state solved once
```

This is the bridge from recursion to dynamic programming.

---

## 13. Divide and Conquer Recurrence

The classic form is:

```text
T(n) = aT(n/b) + f(n)
```

Examples:

### Binary search

```text
T(n) = T(n/2) + O(1)
```

Result:

```text
O(log n)
```

### Merge sort

```text
T(n) = 2T(n/2) + O(n)
```

Result:

```text
O(n log n)
```

### Recursive array processing

If a function makes one half-size call and performs linear work:

```text
T(n) = T(n/2) + O(n)
```

Result:

```text
O(n)
```

The recursive structure and non-recursive work must both be considered.

---

## 14. Master Theorem

For recurrences of the form:

```text
T(n) = aT(n/b) + f(n)
```

compare `f(n)` against:

```text
g(n) = n^(log_b a)
```

The classic Master Theorem gives three broad cases.

### Case 1 — Recursive work dominates

If:

```text
f(n) = O(n^(log_b(a) - ε))
```

for some `ε > 0`, then:

```text
T(n) = Θ(n^(log_b a))
```

### Case 2 — Same order

If:

```text
f(n) = Θ(n^(log_b a) log^k n)
```

then:

```text
T(n) = Θ(n^(log_b a) log^(k+1) n)
```

### Case 3 — Outside work dominates

If:

```text
f(n) = Ω(n^(log_b(a) + ε))
```

and the regularity condition holds, then:

```text
T(n) = Θ(f(n))
```

Do not force the Master Theorem onto recurrences that do not match its required form.

---

## 15. Applying the Master Theorem — Merge Sort

Merge sort:

```text
T(n) = 2T(n/2) + O(n)
```

Here:

```text
a = 2
b = 2
f(n) = O(n)
```

Calculate:

```text
n^(log₂ 2) = n
```

The non-recursive work is the same order as the recursion-tree work.

Therefore:

```text
T(n) = O(n log n)
```

---

## 16. Applying the Master Theorem — Binary Search

```text
T(n) = T(n/2) + O(1)
```

Here:

```text
a = 1
b = 2
```

So:

```text
n^(log₂ 1) = n^0 = 1
```

The non-recursive work is O(1), matching the recursive baseline.

Therefore:

```text
T(n) = O(log n)
```

---

## 17. When Master Theorem Does Not Apply Directly

Examples include:

```text
T(n) = T(n - 1) + n
T(n) = T(n - 2) + T(n - 1)
T(n) = T(n/2) + T(n/3) + n
```

The basic Master Theorem does not directly solve all of these.

Use other techniques:

- expansion,
- substitution,
- recursion tree,
- induction,
- advanced recurrence methods.

Recognizing when a theorem does **not** apply is part of expertise.

---

## 18. Substitution / Expansion Method

For:

```text
T(n) = T(n - 1) + n
```

expand:

```text
T(n)
= T(n-2) + (n-1) + n
= T(n-3) + (n-2) + (n-1) + n
...
```

Eventually:

```text
T(n) = T(1) + 1 + 2 + ... + n
```

And:

```text
1 + 2 + ... + n = Θ(n²)
```

Therefore:

```text
T(n) = Θ(n²)
```

---

## 19. Recurrence by Recursion Depth

Another useful technique is to determine how many times the problem can shrink.

If:

```text
n → n/2 → n/4 → n/8 → ... → 1
```

then:

```text
number of levels = Θ(log n)
```

If:

```text
n → n - 1 → n - 2 → ... → 1
```

then:

```text
number of levels = Θ(n)
```

This gives the recursion depth, which is often the auxiliary stack-space complexity.

---

## 20. Work Per Level

For divide-and-conquer algorithms, analyze:

```text
work at each level
×
number of levels
```

Example:

```text
2T(n/2) + O(n)
```

Level 0:

```text
O(n)
```

Level 1:

```text
2 × O(n/2) = O(n)
```

Level 2:

```text
4 × O(n/4) = O(n)
```

Therefore:

```text
O(n) per level × O(log n) levels
= O(n log n)
```

This reasoning is often more intuitive than memorizing theorem cases.

---

## 21. Recursion Space

Runtime and stack space must be analyzed separately.

Example:

```text
T(n) = 2T(n/2) + O(n)
```

Even though there are many total calls, only one root-to-leaf path is active at a time for a standard depth-first recursive implementation.

Depth:

```text
O(log n)
```

Therefore call-stack space is typically:

```text
O(log n)
```

If recursive calls are sequential rather than simultaneously active, total calls do not automatically equal simultaneous stack depth.

---

## 22. A Common Space-Complexity Mistake

Incorrect reasoning:

> “There are O(n) recursive calls, so stack space is O(n).”

Not necessarily.

You need to ask:

> “How many stack frames can exist simultaneously?”

For:

```js
f(n - 1);
f(n - 1);
```

the calls are sequential. The second call begins after the first returns.

For a balanced recursive tree, simultaneous depth may be only O(log n).

Space complexity depends on the active call path and any stored auxiliary data.

---

## 23. Tail Recursion

A tail-recursive function makes its recursive call as the final operation.

Example:

```js
function countDown(n) {
  if (n <= 0) return;
  return countDown(n - 1);
}
```

In some languages/runtimes, tail calls can be optimized away.

Do not assume JavaScript will eliminate arbitrary recursive stack frames in ordinary Node.js execution. Design for the actual runtime rather than relying on theoretical tail-call optimization.

---

## 24. Recurrence and Backend Systems

Recursive algorithms appear in backend systems when data is hierarchical or dependency-shaped.

Examples:

### Tree traversal

Directory trees, organizational structures, nested documents.

### Dependency graphs

Build systems, workflow dependencies, service graphs.

### Recursive parsing

Nested expressions or structured documents.

### Divide-and-conquer processing

Partitioning large datasets into independent chunks.

The same recurrence reasoning helps determine whether recursion is operationally safe.

---

## 25. Recurrence and AI Systems

AI systems contain recursive and branching computations too.

Examples:

### Search trees

Each state can produce multiple candidate states.

### Beam search

Branching is controlled by retaining only a bounded number of candidates.

### Recursive hierarchical processing

Trees and hierarchical representations naturally produce recursive algorithms.

### Divide-and-conquer retrieval/index construction

Data may be partitioned recursively into smaller regions.

The important question is always:

```text
How many states are generated?
How quickly does each state shrink?
How much work happens per state?
How many states remain simultaneously in memory?
```

---

## 26. Recursion Tree vs State Graph

A recursion tree shows **calls**.

A state graph shows **distinct computational states and their relationships**.

This distinction explains why memoization can dramatically reduce work.

```text
Recursion tree
many repeated states
        ↓
Memoization
        ↓
State graph / DAG-like computation
        ↓
Each state solved once
```

This conceptual transition is central to dynamic programming.

---

## 27. Recurrence and Search Explosion

Backtracking can generate an enormous number of states.

If each decision has roughly `b` choices and depth is `d`:

```text
number of leaves ≈ b^d
```

That is exponential in depth.

Pruning reduces the number of actually explored states.

Therefore:

```text
raw branching factor
        ↓
constraints / pruning
        ↓
actual search tree
```

Complexity analysis should distinguish theoretical worst-case branching from realistic pruned workloads when appropriate.

---

## 28. Recurrence and Pruning

Suppose:

```text
T(n) = 2T(n-1) + O(1)
```

and a pruning rule eliminates one branch for many states.

The recurrence may change substantially.

This illustrates an important point:

> A pruning optimization is not merely a constant-factor improvement when it changes the number or size of recursive subproblems.

Always analyze the resulting computational structure.

---

## 29. How to Derive a Recurrence from Code

Use this checklist:

1. Find the base case.
2. Determine the input size represented by the current call.
3. Count recursive calls.
4. Determine each recursive input size.
5. Analyze work outside recursion.
6. Write the recurrence.
7. Determine recursion depth.
8. Solve or bound the recurrence.
9. Analyze auxiliary storage.
10. Validate the result against the code's actual behavior.

Example:

```js
function solve(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    work();
  }

  solve(Math.floor(n / 2));
  solve(Math.floor(n / 2));
}
```

Translate mechanically:

```text
2 recursive calls
size n/2
outside work O(n)

T(n) = 2T(n/2) + O(n)
```

Then solve it.

---

## 30. Complexity Classification Table

| Recurrence shape | Typical result |
|---|---:|
| `T(n)=T(n-1)+O(1)` | O(n) |
| `T(n)=T(n-1)+O(n)` | O(n²) |
| `T(n)=T(n/2)+O(1)` | O(log n) |
| `T(n)=T(n/2)+O(n)` | O(n) |
| `T(n)=2T(n/2)+O(n)` | O(n log n) |
| `T(n)=2T(n/2)+O(1)` | O(n) |
| `T(n)=2T(n-1)+O(1)` | exponential |
| `T(n)=T(n-1)+T(n-2)+O(1)` | exponential |

These are patterns for reasoning, not equations to memorize without context.

---

## 31. Common Mistakes

### Mistake 1 — Counting recursive calls instead of solving the recurrence

Two recursive calls do not automatically mean O(2^n).

Their input sizes matter.

### Mistake 2 — Ignoring work outside recursion

A single recursive call plus an O(n) loop can still be O(n) or worse depending on the recurrence.

### Mistake 3 — Confusing depth with total calls

O(log n) depth does not imply O(log n) total runtime.

### Mistake 4 — Applying Master Theorem to the wrong recurrence

It has specific structural requirements.

### Mistake 5 — Forgetting stack space

Recursive depth contributes to auxiliary space.

### Mistake 6 — Assuming memoization is free

It trades memory for reduced repeated computation.

### Mistake 7 — Assuming JavaScript optimizes all tail recursion

Do not rely on that operationally.

### Mistake 8 — Ignoring uneven subproblem sizes

`T(n/2) + T(n/3)` requires reasoning beyond the simplest balanced recurrence template.

---

## 32. DSA Mental Model

When you see recursion:

```text
What is the input size?
        ↓
What is the base case?
        ↓
How many recursive calls?
        ↓
What size is each call?
        ↓
What work happens outside recursion?
        ↓
What is the recurrence?
        ↓
How many levels exist?
        ↓
How much work per level?
        ↓
How many stack frames coexist?
        ↓
Can repeated states be memoized?
```

This turns recursive complexity from guesswork into a mechanical analysis process.

---

## 33. Interview Explanation Template

When asked for the complexity of recursive code:

1. Identify the base case.
2. State the number and size of recursive calls.
3. State non-recursive work.
4. Write the recurrence.
5. Explain how it resolves.
6. State recursion depth.
7. State auxiliary space.

Example:

> “Each call splits the input into two halves and does O(n) merge work. Therefore T(n) = 2T(n/2) + O(n). There are O(log n) levels, with O(n) total work at each level, giving O(n log n) time. The maximum active recursion depth is O(log n), so the call stack is O(log n), excluding the merge buffer.”

---

## 34. Key Takeaways

1. Recursive complexity is naturally expressed using recurrence relations.
2. The number of recursive calls and their input sizes both matter.
3. Work outside recursive calls must be included.
4. Recursion depth is different from total runtime.
5. `T(n)=T(n-1)+O(1)` gives linear time.
6. `T(n)=T(n/2)+O(1)` gives logarithmic time.
7. `2T(n/2)+O(n)` gives O(n log n).
8. Naive Fibonacci is exponential because it repeatedly computes the same states.
9. Memoization changes the computational structure by solving each state once.
10. Recursion trees reveal work per level and total work.
11. The Master Theorem applies only to recurrences with the appropriate form.
12. Recursion depth determines stack-space usage, not total call count alone.
13. Pruning can change the recursive search structure substantially.
14. Backend and AI systems can contain recursive, branching, and divide-and-conquer workloads.
15. Expert analysis translates code → recurrence → depth → space → operational consequence.

---

## Self-Check

1. What is a recurrence relation?
2. How do you derive a recurrence from recursive code?
3. What does each term in `T(n)=aT(n/b)+f(n)` represent?
4. What is the difference between recursion depth and total runtime?
5. Solve `T(n)=T(n-1)+O(1)`.
6. Solve `T(n)=T(n/2)+O(1)`.
7. Solve `T(n)=2T(n/2)+O(n)`.
8. Why is naive Fibonacci exponential?
9. How does memoization change Fibonacci complexity?
10. When can you use the Master Theorem?
11. Why can two recursive calls still produce O(n) rather than O(2^n)?
12. How do you calculate stack-space complexity?
13. What happens to recursive search complexity when pruning removes branches?
14. Why should you not assume tail-call optimization in ordinary JavaScript execution?
15. Can you translate an unfamiliar recursive function into a recurrence without looking up the answer?
