# 02.15 — Recurrence Relations

## Learning Objective

Learn to translate recursive algorithms into mathematical recurrence relations, solve those recurrences, and use them to reason about time and space complexity.

The central idea:

> **A recursive algorithm's complexity is a mathematical description of how work is distributed across recursive calls.**

---

# 1. What Is a Recurrence Relation?

A recurrence defines a function in terms of smaller instances of itself.

A typical algorithmic recurrence looks like:

```text
T(n) = T(n - 1) + f(n)
```

or:

```text
T(n) = aT(n/b) + f(n)
```

A recurrence normally has three components:

1. Recursive subproblem(s)
2. Work performed outside the recursive calls
3. Base case

Example:

```js
function countDown(n) {
  if (n <= 0) return;
  work();
  countDown(n - 1);
}
```

Recurrence:

```text
T(n) = T(n - 1) + Θ(1)
T(0) = Θ(1)
```

Therefore:

```text
T(n) = Θ(n)
```

---

# 2. Why Recurrence Relations Matter

Recursion can hide complexity.

A short function may generate:

- one recursive call
- several recursive calls
- logarithmically smaller inputs
- overlapping subproblems
- exponential search trees
- divide-and-conquer trees

A recurrence exposes this structure explicitly.

For backend and AI engineering, this matters when analyzing:

- recursive tree processing
- graph traversal
- hierarchical data
- divide-and-conquer processing
- search trees
- recursive parsers
- recursive partitioning
- memoized state spaces

---

# 3. Translating Code Into a Recurrence

Use this procedure:

```text
1. Identify input size n.
2. Identify the base case.
3. Count recursive calls.
4. Determine each recursive input size.
5. Count non-recursive work.
6. Write the recurrence.
7. Solve it.
8. Analyze recursion depth for space.
```

Example:

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
T(n) = T(n - 1) + Θ(n)
```

Expanding:

```text
= Θ(n) + Θ(n-1) + ... + Θ(1)
= Θ(n²)
```

---

# 4. Base Cases Are Part of the Recurrence

Consider:

```js
function f(n) {
  if (n <= 1) return 1;
  return f(n - 1) + 1;
}
```

The recurrence is incomplete without the base condition:

```text
T(n) = T(n - 1) + Θ(1)
T(1) = Θ(1)
```

Base cases terminate the recurrence and define the recursion depth.

---

# 5. One Recursive Call: n − 1

```text
T(n) = T(n - 1) + c
```

Expand:

```text
T(n)
= T(n-1) + c
= T(n-2) + 2c
= T(n-3) + 3c
...
= T(1) + (n-1)c
```

Therefore:

```text
Θ(n)
```

This is the canonical linear recursion.

---

# 6. One Recursive Call: n − k

```text
T(n) = T(n-k) + Θ(1)
```

where `k` is a positive constant.

The recursion performs approximately:

```text
n/k
```

calls.

Therefore:

```text
Θ(n)
```

Changing `n - 1` to `n - 10` changes constants, not asymptotic complexity.

---

# 7. One Recursive Call: n/2

```text
T(n) = T(n/2) + Θ(1)
```

Expand:

```text
T(n)
= T(n/2) + c
= T(n/4) + 2c
= T(n/8) + 3c
...
```

After `k` levels:

```text
n / 2ᵏ = 1
```

so:

```text
k = log₂ n
```

Therefore:

```text
T(n) = Θ(log n)
```

---

# 8. One Recursive Call: n/3

```text
T(n) = T(n/3) + Θ(1)
```

The recursion depth is:

```text
Θ(log₃ n)
```

Therefore:

```text
Θ(log n)
```

The constant logarithm base does not matter asymptotically.

---

# 9. Linear Work + Halved Input

```text
T(n) = T(n/2) + Θ(n)
```

Expand:

```text
Θ(n)
+ Θ(n/2)
+ Θ(n/4)
+ ...
```

The geometric series sums to:

```text
Θ(n)
```

Therefore:

```text
T(n) = Θ(n)
```

This pattern appears in algorithms that repeatedly process the current input before reducing it.

---

# 10. Two Halves

```text
T(n) = 2T(n/2) + Θ(1)
```

At each level:

```text
number of subproblems doubles
problem size halves
```

The recursion tree has:

```text
Θ(n)
```

leaves.

Therefore:

```text
T(n) = Θ(n)
```

---

# 11. Two Halves + Linear Merge Work

Classic divide-and-conquer form:

```text
T(n) = 2T(n/2) + Θ(n)
```

At every level, total non-recursive work is:

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
T(n) = Θ(n log n)
```

This is the core recurrence of merge sort.

---

# 12. Two Halves + Quadratic Work

```text
T(n) = 2T(n/2) + Θ(n²)
```

The root performs `Θ(n²)` work.

The next level performs:

```text
2 × (n/2)² = n²/2
```

The next:

```text
4 × (n/4)² = n²/4
```

The levels form a decreasing geometric series.

Therefore:

```text
T(n) = Θ(n²)
```

---

# 13. Four Equal Subproblems

```text
T(n) = 4T(n/2) + Θ(n)
```

At level `k`:

```text
4ᵏ subproblems
size = n/2ᵏ
```

Work per level:

```text
4ᵏ × n/2ᵏ
= n2ᵏ
```

The deepest level dominates.

At depth `log₂ n`:

```text
4^(log₂ n) = n²
```

Therefore:

```text
T(n) = Θ(n²)
```

---

# 14. Binary Recursive Explosion

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

Each level doubles the number of calls.

Therefore:

```text
Θ(2ⁿ)
```

This is the classic exponential recursion shape.

---

# 15. Fibonacci Recursion

Naive Fibonacci:

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

The number of calls grows exponentially.

A simple upper bound is:

```text
O(2ⁿ)
```

A tighter characterization is exponential in `n`, approximately:

```text
Θ(φⁿ)
```

where:

```text
φ ≈ 1.618
```

The important engineering lesson is overlapping recursive work.

---

# 16. Memoization Changes the Recurrence

With memoization, each Fibonacci state is computed once.

There are only:

```text
n + 1
```

states.

Each state performs constant work after its dependencies are available.

Therefore:

```text
Time = Θ(n)
Space = Θ(n)
```

The transformation is not merely “recursion became faster.”

It changed the computation from a recursive **call tree** into a **state graph with shared results**.

---

# 17. Recursion Tree

A recurrence can be visualized as a tree.

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
n/2 + n/2 = n
```

Level 2:

```text
n/4 + n/4 + n/4 + n/4 = n
```

Every level costs `n`.

There are `log n` levels.

Therefore:

```text
Θ(n log n)
```

---

# 18. Recursion Tree: Leaf Count

For:

```text
T(n) = aT(n/b) + f(n)
```

after `k` levels:

```text
aᵏ
```

subproblems exist.

The size at that level is:

```text
n/bᵏ
```

At the bottom:

```text
n/bᵏ = 1
```

so:

```text
k = log_b n
```

and leaf count becomes:

```text
a^(log_b n)
= n^(log_b a)
```

This identity is central to divide-and-conquer analysis.

---

# 19. Master Theorem Form

For recurrences of the form:

```text
T(n) = aT(n/b) + f(n)
```

compare:

```text
f(n)
```

against:

```text
n^(log_b a)
```

This gives the classic Master Theorem cases.

---

# 20. Master Theorem — Case 1

If:

```text
f(n) = O(n^(log_b a - ε))
```

for some `ε > 0`, then recursive work dominates:

```text
T(n) = Θ(n^(log_b a))
```

Example:

```text
T(n) = 8T(n/2) + Θ(n²)
```

Here:

```text
log₂8 = 3
```

and:

```text
n² < n³
```

Therefore:

```text
Θ(n³)
```

---

# 21. Master Theorem — Case 2

If:

```text
f(n) = Θ(n^(log_b a) logᵏ n)
```

then:

```text
T(n) = Θ(n^(log_b a) log^(k+1) n)
```

The most common example:

```text
T(n) = 2T(n/2) + Θ(n)
```

Since:

```text
log₂2 = 1
```

we get:

```text
Θ(n log n)
```

---

# 22. Master Theorem — Case 3

If:

```text
f(n) = Ω(n^(log_b a + ε))
```

and the regularity condition is satisfied, then:

```text
T(n) = Θ(f(n))
```

Example:

```text
T(n) = 2T(n/2) + Θ(n²)
```

Since:

```text
n²
```

dominates:

```text
n^(log₂2) = n
```

we obtain:

```text
Θ(n²)
```

---

# 23. When Master Theorem Does Not Directly Apply

The classic theorem does not directly solve every recurrence.

Examples include:

```text
T(n) = T(n-1) + n
T(n) = T(n/2) + T(n/3) + n
T(n) = T(√n) + 1
T(n) = T(n - log n) + 1
```

For these, use:

- expansion
- substitution
- recursion trees
- change of variables
- recursion-depth reasoning
- other recurrence-solving techniques

Do not force an incompatible recurrence into the Master Theorem template.

---

# 24. Substitution / Expansion Method

Suppose:

```text
T(n) = T(n-1) + n
```

Expand:

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

Therefore:

```text
Θ(n²)
```

Expansion is especially useful for decrement recurrences.

---

# 25. Recurrence With Unequal Splits

Consider:

```text
T(n) = T(n/2) + T(n/4) + Θ(n)
```

The recursive subproblems are not equal.

The Master Theorem does not directly apply.

However, the total recursive input size is:

```text
n/2 + n/4 = 3n/4
```

which is smaller than `n`.

The linear work at the root dominates the recursively reduced total across levels.

This recurrence is:

```text
Θ(n)
```

A recursion-tree or level-sum argument makes the result intuitive.

---

# 26. Recurrence With Three Unequal Splits

Consider:

```text
T(n) = T(n/2) + T(n/3) + T(n/6) + Θ(n)
```

The recursive input sizes sum to:

```text
n/2 + n/3 + n/6 = n
```

Therefore each level can contribute approximately linear total work.

The depth is logarithmic under balanced shrinkage.

This produces a more subtle recurrence and should be analyzed with a recursion-tree or generalized divide-and-conquer argument rather than blindly applying the basic Master Theorem.

---

# 27. Recursion Depth vs Total Time

These are different measurements.

Example:

```text
T(n) = 2T(n/2) + n
```

Depth:

```text
Θ(log n)
```

Total time:

```text
Θ(n log n)
```

Another example:

```text
T(n) = 2T(n-1) + 1
```

Depth:

```text
Θ(n)
```

Total time:

```text
Θ(2ⁿ)
```

Never equate recursion depth with runtime.

---

# 28. Recursive Space Complexity

For a single recursive chain:

```text
T(n) = T(n-1) + ...
```

recursion depth can be:

```text
Θ(n)
```

Therefore stack space is:

```text
Θ(n)
```

For divide-and-conquer:

```text
T(n) = 2T(n/2) + ...
```

the depth is:

```text
Θ(log n)
```

so the active recursion stack is often:

```text
Θ(log n)
```

The number of total recursive calls does not equal simultaneous stack depth.

---

# 29. Branching Recursion and Stack Space

Consider:

```js
function f(n) {
  if (n <= 0) return;
  f(n - 1);
  f(n - 1);
}
```

Total calls are exponential.

But calls are not all active simultaneously.

The maximum call-stack depth is:

```text
Θ(n)
```

Therefore:

```text
Time = Θ(2ⁿ)
Stack = Θ(n)
```

This distinction is essential.

---

# 30. Tail Recursion Caveat in JavaScript

A function such as:

```js
function f(n, acc = 0) {
  if (n === 0) return acc;
  return f(n - 1, acc + n);
}
```

is tail-recursive in structure.

However, JavaScript environments should not be assumed to provide general proper tail-call optimization in production.

Therefore algorithmic stack analysis should conservatively account for recursive depth unless the runtime guarantee is explicitly known.

---

# 31. Recursive Calls Inside Loops

Consider:

```js
function f(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    work();
  }

  f(n / 2);
}
```

Recurrence:

```text
T(n) = T(n/2) + Θ(n)
```

Therefore:

```text
Θ(n)
```

The loop's cost must be included at every recursive level.

---

# 32. Recursive Calls Inside Nested Loops

```js
function f(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      work();
    }
  }

  f(n / 2);
}
```

Recurrence:

```text
T(n) = T(n/2) + Θ(n²)
```

Therefore:

```text
Θ(n²)
```

Again, do not ignore non-recursive work.

---

# 33. Multiple Recursive Calls With Different Costs

```text
T(n) = T(n/2) + T(n/2) + n
```

Combine identical recursive terms:

```text
T(n) = 2T(n/2) + n
```

Then solve:

```text
Θ(n log n)
```

This normalization makes recurrence analysis easier.

---

# 34. Recursive Search Tree

A recursive backtracking algorithm may have:

```text
b branches
```

at each state and depth:

```text
d
```

A rough upper bound is:

```text
O(bᵈ)
```

If each node performs `f(n)` work:

```text
O(bᵈ · f(n))
```

Pruning reduces the number of reachable states and therefore changes the practical and sometimes worst-case complexity.

---

# 35. Memoization and State Graphs

Suppose recursion reaches the same state multiple times.

Without memoization:

```text
same state → recompute
```

With memoization:

```text
same state → reuse result
```

If there are `S` unique states and each state has `b` transitions:

```text
Time ≈ O(Sb)
```

plus state-storage overhead.

This is the bridge from recursion analysis to dynamic programming.

---

# 36. Backend Example — Recursive Hierarchy

Suppose an organization hierarchy is recursively traversed.

A DFS that visits each node once gives:

```text
T(n) = T(child₁) + ... + T(childₖ) + O(1)
```

Across the entire tree:

```text
Θ(n)
```

assuming each node and edge is processed once.

The recursive tree structure does not automatically imply exponential complexity.

---

# 37. Backend Example — Recursive Dependency Expansion

Suppose a job recursively expands dependencies.

If the dependency graph is a tree with `N` unique nodes:

```text
Θ(N)
```

If shared dependencies are recomputed without a visited set:

```text
same dependency may be expanded repeatedly
```

The call tree can become much larger than the underlying state graph.

Memoization/visited-state tracking converts repeated work into unique-state processing.

---

# 38. AI Example — Search Tree

Suppose an AI search algorithm explores:

```text
b choices per state
```

for:

```text
d levels
```

Then naive tree search is approximately:

```text
O(bᵈ)
```

Beam search limits the number of retained states per level and can dramatically reduce practical work, at the cost of potentially losing the optimal path.

This is a direct application of recurrence/state-space reasoning.

---

# 39. AI Example — Recursive Partitioning

Suppose data is recursively partitioned into two roughly equal parts and each level processes all data:

```text
T(n) = 2T(n/2) + Θ(n)
```

Therefore:

```text
Θ(n log n)
```

This pattern appears in divide-and-conquer data processing and indexing workflows.

---

# 40. Common Recurrence Patterns

| Recurrence | Typical Complexity |
|---|---|
| `T(n)=T(n-1)+1` | `Θ(n)` |
| `T(n)=T(n-1)+n` | `Θ(n²)` |
| `T(n)=T(n/2)+1` | `Θ(log n)` |
| `T(n)=T(n/2)+n` | `Θ(n)` |
| `T(n)=2T(n/2)+1` | `Θ(n)` |
| `T(n)=2T(n/2)+n` | `Θ(n log n)` |
| `T(n)=2T(n/2)+n²` | `Θ(n²)` |
| `T(n)=2T(n-1)+1` | `Θ(2ⁿ)` |
| Fibonacci naive | exponential |
| Fibonacci memoized | `Θ(n)` |

Use the table for recognition, but derive unfamiliar recurrences rather than memorizing them.

---

# 41. Common Mistakes

## Mistake 1 — Counting recursive calls incorrectly

One function call does not necessarily mean one recursive call.

## Mistake 2 — Ignoring non-recursive work

A loop around recursion changes the recurrence.

## Mistake 3 — Confusing depth with total calls

`Θ(log n)` depth can still contain `Θ(n)` or more total calls.

## Mistake 4 — Assuming recursion means exponential

Linear recursion and divide-and-conquer recursion are often polynomial or linearithmic.

## Mistake 5 — Applying Master Theorem blindly

Its basic form requires a specific recurrence structure.

## Mistake 6 — Ignoring overlapping states

Repeated recursive states can create exponential work.

## Mistake 7 — Ignoring memoization storage

Memoization reduces time but consumes memory.

## Mistake 8 — Assuming tail recursion removes stack space in JavaScript

Do not assume runtime optimization without a guarantee.

---

# 42. Expert Recurrence Workflow

```text
STEP 1
Define input size.

STEP 2
Find the base case.

STEP 3
Count recursive calls.

STEP 4
Determine each subproblem size.

STEP 5
Calculate non-recursive work.

STEP 6
Write T(n).

STEP 7
Normalize the recurrence.

STEP 8
Choose a solution method:
  - expansion
  - substitution
  - recursion tree
  - Master Theorem
  - other recurrence techniques

STEP 9
Analyze recursion depth.

STEP 10
Analyze auxiliary space.
```

---

# 43. Interview Explanation Template

When asked for recursive complexity:

> “Let `T(n)` represent the running time on input size `n`. The function makes `a` recursive calls on subproblems of size approximately `n/b`, while doing `f(n)` work outside those calls. Therefore `T(n) = aT(n/b) + f(n)`. Solving that recurrence gives the final time complexity. The recursion depth determines the stack-space requirement.”

This is much stronger than saying:

> “It is recursive, so it is O(log n).”

---

# 44. Mastery Checklist

- [ ] Translate recursive code into a recurrence.
- [ ] Include base cases.
- [ ] Count recursive calls accurately.
- [ ] Identify recursive subproblem sizes.
- [ ] Include loop/body work.
- [ ] Solve `n-1` recurrences.
- [ ] Solve `n/k` recurrences.
- [ ] Solve divide-and-conquer recurrences.
- [ ] Build recursion trees.
- [ ] Understand geometric level sums.
- [ ] Apply the Master Theorem correctly.
- [ ] Know when Master Theorem does not apply.
- [ ] Distinguish recursion depth from total work.
- [ ] Analyze recursive stack space.
- [ ] Understand exponential branching.
- [ ] Understand memoization as state sharing.
- [ ] Analyze recursive tree/graph traversal.
- [ ] Analyze backend recursive workloads.
- [ ] Analyze AI search-tree workloads.
- [ ] Explain recurrences clearly in interviews.

---

# Key Takeaways

1. **A recurrence is the mathematical model of recursive work.**
2. **Always count recursive calls, subproblem sizes, and non-recursive work separately.**
3. **`n-1` recursion usually produces linear-depth behavior; `n/2` recursion usually produces logarithmic depth.**
4. **Multiple recursive branches can create exponential call trees.**
5. **Divide-and-conquer complexity comes from both branching and work per level.**
6. **Recursion depth and total runtime are different quantities.**
7. **Memoization changes repeated recursive computation into unique-state computation.**
8. **Master Theorem is powerful but only applies directly to suitable recurrence forms.**
9. **Backend hierarchy traversal, dependency expansion, and AI search all benefit from recurrence/state-space reasoning.**
10. **Expert analysis means deriving the recurrence first and solving it second.**
