# 02.14 — Recursive Complexity

## Learning Objective

Learn to derive the time and space complexity of recursive algorithms by modeling:

- number of recursive calls
- size of each subproblem
- non-recursive work per call
- recursion depth
- branching factor
- repeated subproblems
- base cases
- recurrence relations

The central rule is:

> **Do not analyze recursion by counting the number of lines in the function. Analyze the recursive call tree and the work performed at each node.**

---

# 1. Why Recursive Complexity Is Different

Consider:

```js
function countdown(n) {
  if (n <= 0) return;
  countdown(n - 1);
}
```

The function calls itself `n` times.

Therefore:

```text
Time  = Θ(n)
Space = Θ(n)
```

But recursion can branch:

```js
function branch(n) {
  if (n <= 1) return;
  branch(n - 1);
  branch(n - 1);
}
```

Now the number of calls grows exponentially.

The shape of the recursion tree matters.

---

# 2. Recurrence Relations

A recurrence describes the cost of a recursive algorithm in terms of smaller inputs.

For:

```js
function f(n) {
  if (n <= 1) return;
  f(n - 1);
  work();
}
```

we can write:

```text
T(n) = T(n - 1) + Θ(1)
```

which solves to:

```text
Θ(n)
```

The recurrence is the mathematical model of the recursive code.

---

# 3. One Recursive Call: Decreasing by One

```js
function f(n) {
  if (n <= 0) return;
  f(n - 1);
}
```

Recurrence:

```text
T(n) = T(n - 1) + Θ(1)
```

Expansion:

```text
T(n)
= T(n-1) + 1
= T(n-2) + 2
= ...
= T(0) + n
```

Therefore:

```text
T(n) = Θ(n)
```

---

# 4. One Recursive Call With Constant Work

```js
function f(n) {
  if (n <= 1) return 1;

  const x = expensiveConstantWork();
  return f(n - 1) + x;
}
```

If `expensiveConstantWork()` is `Θ(1)`:

```text
T(n) = T(n-1) + Θ(1)
      = Θ(n)
```

The recursive depth is also:

```text
Θ(n)
```

so auxiliary stack space is:

```text
Θ(n)
```

---

# 5. One Recursive Call: Divide by Two

```js
function f(n) {
  if (n <= 1) return;
  f(Math.floor(n / 2));
}
```

Recurrence:

```text
T(n) = T(n/2) + Θ(1)
```

After `k` calls:

```text
n / 2ᵏ ≈ 1
```

Therefore:

```text
k = Θ(log n)
```

Hence:

```text
Time  = Θ(log n)
Space = Θ(log n)
```

This pattern appears in binary-search-style algorithms.

---

# 6. Binary Search Recursion

```js
function binarySearch(items, target, left, right) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (items[mid] === target) return mid;
  if (items[mid] < target) {
    return binarySearch(items, target, mid + 1, right);
  }

  return binarySearch(items, target, left, mid - 1);
}
```

Only one half remains after each comparison.

Recurrence:

```text
T(n) = T(n/2) + Θ(1)
```

Therefore:

```text
Θ(log n)
```

---

# 7. Two Recursive Calls on Half-Sized Problems

Consider:

```js
function f(n) {
  if (n <= 1) return;

  f(n / 2);
  f(n / 2);
  work(n);
}
```

If `work(n)` is `Θ(n)`:

```text
T(n) = 2T(n/2) + Θ(n)
```

This is the classic divide-and-conquer recurrence.

By the Master Theorem:

```text
T(n) = Θ(n log n)
```

---

# 8. Merge Sort

Merge sort follows:

```text
T(n) = 2T(n/2) + Θ(n)
```

because:

- two recursive halves are processed
- merging takes linear work

Therefore:

```text
Time = Θ(n log n)
```

Typical auxiliary space for a straightforward merge-sort implementation is:

```text
Θ(n)
```

plus recursion stack `Θ(log n)`.

---

# 9. Divide-and-Conquer With Constant Combine Work

Suppose:

```text
T(n) = 2T(n/2) + Θ(1)
```

At each level, the number of subproblems doubles while their sizes halve.

There are:

```text
log n
```

levels and the leaves number approximately:

```text
n
```

Therefore:

```text
T(n) = Θ(n)
```

This is an important distinction from merge sort, where each level also performs `Θ(n)` combine work.

---

# 10. Recursion Tree Method

For:

```text
T(n) = 2T(n/2) + n
```

Level 0:

```text
n
```

Level 1:

```text
2 × n/2 = n
```

Level 2:

```text
4 × n/4 = n
```

Every level costs:

```text
Θ(n)
```

There are:

```text
Θ(log n)
```

levels.

Therefore:

```text
Θ(n log n)
```

---

# 11. Branching Factor

If each recursive call creates approximately `b` children and recursion depth is `d`, a broad upper-bound intuition is:

```text
O(b^d)
```

This is especially useful for:

- backtracking
- game search
- state-space exploration
- brute-force combinatorial algorithms

But exact complexity depends on whether branches overlap and whether the depth varies.

---

# 12. Binary Branching by One

Consider:

```js
function f(n) {
  if (n <= 1) return;

  f(n - 1);
  f(n - 1);
}
```

Recurrence:

```text
T(n) = 2T(n - 1) + Θ(1)
```

The recursion tree approximately doubles at every level.

Therefore:

```text
T(n) = Θ(2ⁿ)
```

The stack depth is only:

```text
Θ(n)
```

This demonstrates:

```text
exponential time ≠ exponential stack space
```

when only depth determines simultaneous stack frames.

---

# 13. Naive Fibonacci

```js
function fib(n) {
  if (n <= 1) return n;

  return fib(n - 1) + fib(n - 2);
}
```

Recurrence:

```text
T(n) = T(n-1) + T(n-2) + Θ(1)
```

This grows exponentially.

A commonly used upper-bound description is:

```text
O(2ⁿ)
```

and a tighter characterization is exponential in `n` with growth related to the golden ratio.

The key problem is repeated computation of the same Fibonacci states.

---

# 14. Memoized Fibonacci

With memoization, each state `fib(k)` is computed once.

There are:

```text
n + 1
```

possible states.

Each state requires constant additional work.

Therefore:

```text
Time  = Θ(n)
Space = Θ(n)
```

The optimization does not merely “make recursion faster.”

It changes the computational model from a recursion tree with repeated work into a state graph with shared results.

---

# 15. Recursion Tree vs State Graph

This distinction is fundamental.

### Recursion tree

The same logical state may appear repeatedly:

```text
f(5)
├── f(4)
│   └── f(3)
└── f(3)
```

### State graph

Memoization merges repeated states:

```text
f(5)
├── f(4)
└── f(3) ← shared result
```

This is the conceptual bridge from recursion to dynamic programming.

---

# 16. Recursion Depth vs Total Calls

Do not confuse:

```text
recursion depth
```

with:

```text
total number of calls
```

For:

```text
T(n) = 2T(n-1) + O(1)
```

we can have:

```text
Total calls = Θ(2ⁿ)
Depth       = Θ(n)
```

Therefore:

```text
Time ≠ stack space
```

in general.

---

# 17. Tail Recursion

Consider:

```js
function sum(n, acc = 0) {
  if (n === 0) return acc;
  return sum(n - 1, acc + n);
}
```

The recurrence is:

```text
T(n) = T(n-1) + Θ(1)
```

so time is:

```text
Θ(n)
```

The recursive depth is also `Θ(n)`.

Some languages optimize tail calls, but JavaScript execution environments should not be assumed to provide general tail-call optimization. Therefore ordinary recursive JS code should be analyzed with its actual stack behavior in mind.

---

# 18. Multiple Recursive Calls of Different Sizes

Consider:

```text
T(n) = T(n/2) + T(n/3) + Θ(n)
```

The subproblems have different sizes.

Do not force this into the simple `2T(n/2)` template.

Use:

- recursion trees
- substitution
- Akra–Bazzi-style reasoning when appropriate
- bounding arguments

The important skill is recognizing that recurrence structure follows the actual recursive calls.

---

# 19. Uneven Divide-and-Conquer

Suppose:

```text
T(n) = T(n/2) + T(n/4) + Θ(n)
```

The total work per level decreases geometrically enough that the root-level linear work dominates.

Therefore:

```text
T(n) = Θ(n)
```

The exact proof depends on the recurrence, but the intuition is that the recursive subproblem sizes do not preserve a full `n` worth of work at every level.

---

# 20. Master Theorem

For recurrences of the form:

```text
T(n) = aT(n/b) + f(n)
```

compare:

```text
a
```

with:

```text
n^(log_b a)
```

The three major cases are:

### Case 1

If:

```text
f(n) = O(n^(log_b a - ε))
```

then:

```text
T(n) = Θ(n^(log_b a))
```

### Case 2

If:

```text
f(n) = Θ(n^(log_b a) log^k n)
```

then:

```text
T(n) = Θ(n^(log_b a) log^(k+1) n)
```

### Case 3

If `f(n)` grows polynomially faster than the critical term and the regularity condition holds:

```text
T(n) = Θ(f(n))
```

The theorem is a tool, not a substitute for understanding the recursion tree.

---

# 21. Master Theorem Example

```text
T(n) = 2T(n/2) + n
```

Here:

```text
a = 2
b = 2
n^(log₂2) = n
```

and:

```text
f(n) = n
```

They match.

Therefore:

```text
T(n) = Θ(n log n)
```

---

# 22. Another Master Theorem Example

```text
T(n) = 4T(n/2) + n
```

Critical term:

```text
n^(log₂4) = n²
```

Since:

```text
n = O(n^(2-ε))
```

for suitable ε:

```text
T(n) = Θ(n²)
```

The recursive tree dominates the linear combine work.

---

# 23. Another Example

```text
T(n) = 2T(n/2) + n²
```

Critical term:

```text
n
```

The non-recursive work is polynomially larger:

```text
n²
```

so, under the regularity condition:

```text
T(n) = Θ(n²)
```

The root and upper levels dominate.

---

# 24. Recursion With a Loop

Consider:

```js
function f(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    work();
  }

  f(n - 1);
}
```

Recurrence:

```text
T(n) = T(n-1) + Θ(n)
```

Expansion:

```text
n + (n-1) + ... + 1
```

Therefore:

```text
Θ(n²)
```

A recursive function can therefore be polynomial even with only one recursive call.

---

# 25. Recursion With Two Loops

If each call performs `Θ(n²)` work before making one `n-1` recursive call:

```text
T(n) = T(n-1) + Θ(n²)
```

Then:

```text
Σ i² = Θ(n³)
```

Therefore:

```text
T(n) = Θ(n³)
```

The non-recursive work at every level must be included.

---

# 26. Recursive Divide and Conquer With Linear Scan

Consider:

```js
function solve(items) {
  if (items.length <= 1) return;

  const mid = Math.floor(items.length / 2);

  solve(items.slice(0, mid));
  solve(items.slice(mid));

  scan(items);
}
```

If the two recursive calls process halves and `scan()` costs `Θ(n)`:

```text
T(n) = 2T(n/2) + Θ(n)
```

Therefore:

```text
Θ(n log n)
```

Note that `slice()` itself may also allocate/copy data, which can affect both time and space in a real JavaScript implementation.

---

# 27. Recursive Space Complexity

For recursion, auxiliary stack space is primarily determined by:

```text
maximum simultaneous recursion depth
```

not total calls.

Examples:

```text
T(n) = T(n-1) + O(1)
Depth = Θ(n)
Space = Θ(n)
```

while:

```text
T(n) = 2T(n-1) + O(1)
Depth = Θ(n)
Space = Θ(n)
```

Despite exponential total calls, the depth remains linear.

---

# 28. Divide-and-Conquer Stack Space

For balanced recursion:

```text
T(n) = 2T(n/2) + ...
```

the depth is:

```text
Θ(log n)
```

Therefore stack space is often:

```text
Θ(log n)
```

unless each level retains additional data or multiple branches are simultaneously materialized.

---

# 29. Recursion and Copying

Consider:

```js
function f(items) {
  if (items.length <= 1) return;

  const left = items.slice(0, items.length / 2);
  const right = items.slice(items.length / 2);

  f(left);
  f(right);
}
```

Even though the recursive structure is balanced, `slice()` creates copied arrays.

A complete analysis must consider:

- recursive calls
- copying cost
- total allocated memory
- peak live memory

The abstract recurrence alone may not capture the entire implementation cost.

---

# 30. Backtracking Recursion

A backtracking algorithm may have:

```text
b branches
```

at each state and depth:

```text
d
```

giving a rough search-tree bound:

```text
O(b^d)
```

If each state also performs `Θ(f)` work:

```text
O(f · b^d)
```

Pruning reduces the actual number of explored states but must be analyzed against the worst-case search tree.

---

# 31. Memoization Changes the Recurrence

Suppose recursion can reach the same state many times.

Without memoization:

```text
many recursive paths → repeated computation
```

With memoization:

```text
one computation per unique state
```

If there are `S` unique states and each state has `b` transitions:

```text
Time ≈ O(Sb)
```

assuming constant-time state lookup.

This is the core idea behind dynamic programming.

---

# 32. Recursive Graph Traversal

A DFS implementation may recursively visit graph vertices:

```js
function dfs(node) {
  if (visited.has(node)) return;

  visited.add(node);

  for (const next of node.neighbors) {
    dfs(next);
  }
}
```

With a visited set:

```text
Time = Θ(V + E)
Space = Θ(V)
```

The recursion stack can reach `Θ(V)` in a path-shaped graph.

Without visited tracking on a cyclic graph, recursion may not terminate.

---

# 33. Backend Example — Recursive Tree Processing

Suppose a backend recursively processes a hierarchy of `N` nodes.

If each node is visited once:

```text
Time = Θ(N)
```

If the recursion depth can equal the hierarchy depth `D`:

```text
Stack = Θ(D)
```

A balanced hierarchy may have much smaller depth than a degenerate chain.

The data shape affects recursion depth and operational safety.

---

# 34. Backend Example — Recursive Job Dependencies

Suppose a job recursively expands dependencies.

If each job can produce `b` dependencies and the maximum dependency depth is `d`:

```text
O(b^d)
```

in the naive tree model.

If the same dependency can be reached through multiple paths, memoization/visited tracking can reduce repeated work to the number of unique jobs and edges.

This is a direct state-space reasoning problem.

---

# 35. AI Example — Recursive Search

AI systems may use recursive or tree-based search for:

- planning
- game search
- candidate expansion
- reasoning trees
- beam/tree search

If branching factor is `b` and depth is `d`:

```text
O(b^d)
```

can become infeasible quickly.

Practical systems therefore use techniques such as:

- beam width limits
- pruning
- memoization
- heuristic ordering
- depth limits
- iterative deepening
- approximate search

---

# 36. Recursion Depth Is an Operational Constraint

An algorithm may have acceptable time complexity but unsafe recursion depth.

For example:

```text
Time = Θ(n)
Stack = Θ(n)
```

If `n` is large, stack overflow can occur before CPU time becomes the primary problem.

In JavaScript backend systems, iterative implementations can sometimes be safer for very deep traversals.

---

# 37. Common Mistakes

## Mistake 1 — Counting recursive lines

The number of source lines does not determine recursive complexity.

## Mistake 2 — Ignoring branching

Two recursive calls can radically change total work.

## Mistake 3 — Confusing depth with total calls

Exponential call count can coexist with linear stack depth.

## Mistake 4 — Ignoring non-recursive work

Loops and processing inside each call contribute to the recurrence.

## Mistake 5 — Ignoring repeated states

Memoization can fundamentally change complexity.

## Mistake 6 — Applying the Master Theorem blindly

It applies to specific recurrence forms and assumptions.

## Mistake 7 — Ignoring copying

Array/string/object slicing can add hidden work and memory.

## Mistake 8 — Ignoring recursion limits

Theoretical stack complexity has practical runtime consequences.

---

# 38. Recursive Complexity Analysis Procedure

Use this workflow:

```text
1. Identify the base case.
2. Identify every recursive call.
3. Determine the size of each subproblem.
4. Count how many recursive calls occur.
5. Determine non-recursive work per call.
6. Write the recurrence.
7. Solve using expansion, recursion tree, substitution, or a theorem.
8. Determine maximum recursion depth.
9. Analyze auxiliary stack space.
10. Include copying/allocation costs.
11. Check for repeated states.
12. State assumptions.
```

---

# 39. Interview Framework

When asked for recursive complexity, say:

> “I’ll first identify the recursive structure, write the recurrence, solve it, and then analyze the maximum recursion depth for stack space.”

Example:

```text
T(n) = 2T(n/2) + Θ(n)
```

Answer:

> “There are two half-sized subproblems and linear combine work. The recursion tree has `Θ(log n)` levels, with `Θ(n)` work per level, giving `Θ(n log n)` time. The recursion depth is `Θ(log n)`, so the stack is `Θ(log n)` assuming constant local state per call.”

---

# 40. Mastery Checklist

- [ ] Translate recursive code into a recurrence.
- [ ] Identify base cases.
- [ ] Count recursive branches.
- [ ] Determine subproblem sizes.
- [ ] Count non-recursive work.
- [ ] Solve `T(n)=T(n-1)+O(1)`.
- [ ] Solve `T(n)=T(n/2)+O(1)`.
- [ ] Analyze `2T(n/2)+O(n)`.
- [ ] Analyze exponential branching.
- [ ] Analyze naive Fibonacci.
- [ ] Explain memoization as state sharing.
- [ ] Distinguish total calls from recursion depth.
- [ ] Analyze recursive stack space.
- [ ] Use recursion trees.
- [ ] Apply the Master Theorem correctly.
- [ ] Recognize when Master Theorem does not directly apply.
- [ ] Include copying/allocation costs.
- [ ] Analyze recursive graph traversal.
- [ ] Apply recursion complexity to backend workloads.
- [ ] Apply recursion/search-tree reasoning to AI systems.

---

# Key Takeaways

1. **Recursive complexity is derived from the recursive call structure, not source-code size.**
2. **A recurrence is the mathematical model of recursive execution.**
3. **One `n-1` recursive call commonly gives linear time; one `n/2` call commonly gives logarithmic time.**
4. **Multiple recursive branches can create exponential call trees.**
5. **Recursion depth determines stack space, not total recursive calls.**
6. **Memoization converts repeated recursive computation into shared-state computation.**
7. **Divide-and-conquer complexity depends on both subproblem sizes and non-recursive work.**
8. **The Master Theorem is powerful but applies only to appropriate recurrence forms.**
9. **Real JavaScript analysis must include copying, allocation, and stack limitations.**
10. **Backend dependency expansion and AI search trees are practical applications of recursive complexity reasoning.**
