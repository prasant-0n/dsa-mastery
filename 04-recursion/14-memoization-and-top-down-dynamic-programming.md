# 04.14 — Memoization & Top-Down Dynamic Programming

## Purpose

Memoization is the technique of caching the result of a recursive subproblem so that the same logical state is solved only once.

The central transformation is:

```text
naive recursion
→ repeated subproblems
→ cache by state
→ top-down dynamic programming
```

The key question is not “Where can I add a Map?” It is:

> What information completely determines the remaining computation?

That information becomes the memoization state.

---

# 1. Overlapping Subproblems

A recursive algorithm has overlapping subproblems when different execution paths request the same logical state.

Classic example:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)   ← repeated
```

Without caching, `fib(3)` is solved multiple times.

---

# 2. Optimal Substructure

Dynamic programming typically relies on optimal substructure:

> An optimal solution can be constructed from appropriate optimal solutions to smaller subproblems.

Memoization is useful when recursive states repeat; optimal-substructure reasoning is especially important when solving optimization problems.

Do not treat these as the same property.

---

# 3. Memoization Mental Model

```text
solve(state)
    ↓
cache has state?
 ↙           ↘
yes           no
return cache  compute
                 ↓
              cache
                 ↓
              return
```

The cache converts repeated computation into lookup.

---

# 4. Minimal State

A memoization key must contain everything needed to determine the future result, but nothing irrelevant.

Bad state:

```text
entire execution history
```

Better:

```text
remaining index + remaining capacity
```

State design is the heart of dynamic programming.

---

# 5. Canonical State

Equivalent states must map to the same key.

For example:

```text
solve(index = 5, remaining = 10)
```

must use the same key regardless of how the algorithm arrived there if their future possibilities are identical.

---

# 6. Memoization vs Caching Arbitrary Results

A cache is only correct when the result is a pure function of the cache key and relevant immutable context.

If hidden mutable state affects the result, the key is incomplete.

Therefore:

```text
correct memoization = correct state model + cache
```

---

# 7. Fibonacci Transformation

Naive:

```js
fib(n) = fib(n - 1) + fib(n - 2)
```

with repeated work.

Memoized:

```js
if (memo.has(n)) return memo.get(n);
```

Each `n` is solved once.

For states `0...N`, the time becomes `O(N)` and memo storage is `O(N)`.

---

# 8. Top-Down DP

Top-down dynamic programming is:

```text
recursive formulation
+ memoization
```

It computes only states that are actually reached.

This can be advantageous when the full state space is large but reachable states are sparse.

---

# 9. Bottom-Up DP

Bottom-up dynamic programming computes states in dependency order:

```text
smallest states
→ larger states
→ final state
```

Top-down and bottom-up can represent the same recurrence while having different execution behavior.

---

# 10. Top-Down vs Bottom-Up

Top-down:

```text
natural recursive formulation
computes reachable states
uses call stack
```

Bottom-up:

```text
explicit evaluation order
usually avoids recursion depth
can simplify memory optimization
```

Neither is universally superior.

---

# 11. Memoization and Backtracking

Backtracking explores choices.

Memoization merges equivalent future states.

Conceptually:

```text
search history A ─┐
                  ├→ same state S → solve once
search history B ─┘
```

This turns a search tree into a state graph.

---

# 12. Search Tree vs State Graph

Without memoization:

```text
computation tree
```

With memoization:

```text
unique states + transitions
```

This is one of the deepest conceptual bridges between recursion and dynamic programming.

---

# 13. Example: Climbing Stairs

Define:

```text
ways(n) = ways(n-1) + ways(n-2)
```

The same smaller values repeat.

Memoization stores:

```text
ways(0), ways(1), ..., ways(n)
```

The state space is linear.

---

# 14. Example: Grid Paths

A grid state may be:

```text
(row, column)
```

If movement is deterministic from the current cell, the number of paths from a cell depends only on that cell and relevant constraints.

Memoizing `(row, column)` can reduce repeated subtrees to one result per reachable cell.

---

# 15. Grid State with Obstacles

If cells are blocked:

```text
ways(r,c) = ways(r+1,c) + ways(r,c+1)
```

with obstacle and boundary base cases.

If additional state such as remaining energy exists, the key becomes:

```text
(r, c, energy)
```

Do not omit dimensions that affect future choices.

---

# 16. Knapsack State

A common 0/1 knapsack state is:

```text
(index, remainingCapacity)
```

The recurrence branches:

```text
skip item
or
include item
```

Memoization merges repeated `(index, capacity)` states.

---

# 17. Subset Sum State

A typical state is:

```text
(index, remainingTarget)
```

or an equivalent representation.

If values can be negative or state transitions differ, ensure the chosen key still fully describes the remaining problem.

---

# 18. String DP State

String problems may use:

```text
index
left/right indices
indices in two strings
```

Examples:

```text
longest common subsequence → (i, j)
edit distance → (i, j)
palindrome partitioning → index or interval
```

State dimensionality directly affects memory and runtime.

---

# 19. Multiple Parameters

For a state:

```text
(i, j, k)
```

if each dimension has `N` possible values, a dense state space can approach:

```text
O(N³)
```

This is why state compression matters.

---

# 20. State Explosion

Adding one state dimension can multiply the number of states.

Example:

```text
O(N²)
→ add another N-sized parameter
→ O(N³)
```

Before memoizing, ask whether every state dimension is genuinely necessary.

---

# 21. Memo Key Design in JavaScript

For primitive state components:

```js
const key = `${i}|${j}`;
```

For small bounded integer states, arrays or nested Maps can be alternatives.

For object states, identity-based `Map` keys and canonical structural representations have different semantics.

Never assume two separately created but structurally equal objects are the same `Map` key.

---

# 22. Nested Maps

Instead of serializing:

```text
Map(i → Map(j → result))
```

can represent multidimensional state without constructing strings.

Trade-offs include code complexity, memory overhead, and lookup characteristics.

---

# 23. Arrays as Memo Tables

If every state dimension is a small bounded integer, an array can be efficient:

```js
memo[i]
```

or:

```js
memo[i][j]
```

Use arrays when the state domain is dense enough to justify allocated storage.

---

# 24. Sparse vs Dense State Spaces

Dense:

```text
most possible states are reached
```

Sparse:

```text
only a small fraction are reached
```

Top-down memoization naturally avoids computing unreachable states.

Bottom-up may still be preferable when predictable memory layout or sequential computation matters.

---

# 25. Memoization and Side Effects

A memoized function should behave like a deterministic function of its state.

Avoid hidden dependencies such as:

```text
current time
random values
mutable global state
external database state
network responses
```

unless those dependencies are represented in the state or deliberately excluded from caching semantics.

---

# 26. Mutable Return Values

Caching an object or array returns the same reference unless explicitly cloned.

This can create aliasing bugs:

```text
memoized result
→ caller mutates it
→ future callers observe mutation
```

Define ownership of cached values.

Immutable results are often safer.

---

# 27. Memoizing Boolean Results

Boolean feasibility problems are often simple:

```text
true / false
```

A boolean cache can dramatically reduce repeated search.

However, if the caller needs the actual solution path, caching only feasibility may be insufficient.

---

# 28. Memoizing Counts

Counting problems naturally cache integers:

```text
count(state)
```

Then repeated states return their stored count.

Be careful about integer overflow when counts grow beyond JavaScript's safe integer range; `BigInt` may be required.

---

# 29. Memoizing Optimization

For optimization:

```text
best(state)
```

stores the best achievable result from that state.

The recurrence must correctly combine child optima.

A common mistake is caching a locally best-looking decision rather than the optimal result for the complete state.

---

# 30. Memoization vs Greedy

Memoization does not make a greedy algorithm correct.

It only prevents repeated evaluation of the recursive states that the recurrence defines.

Correctness still comes from the recurrence and state semantics.

---

# 31. Memoization vs Tabulation

Both can implement the same recurrence.

```text
memoization → demand-driven
 tabulation → dependency-order-driven
```

Choose based on reachability, recursion depth, memory layout, implementation clarity, and performance requirements.

---

# 32. Space Complexity

Memoized DP uses:

```text
cache space + recursion stack + temporary state
```

If there are `S` states and recursion depth `D`:

```text
space ≈ O(S + D)
```

plus any output or auxiliary structures.

---

# 33. Time Complexity

If each unique state is solved once and each state performs `T` work:

```text
O(S × T)
```

This is often far better than the size of the un-memoized recursion tree.

Always count transition work per state.

---

# 34. Memoization Correctness

To prove memoization safe:

1. Define the state.
2. Prove equal states have identical future possibilities/results.
3. Prove the recurrence computes the correct result for a state.
4. Store that result under the canonical key.
5. Reusing it is therefore equivalent to recomputation.

---

# 35. Memoization and Recursion Depth

Memoization reduces repeated work, not necessarily recursion depth.

A problem can have:

```text
O(N) unique states
O(N) recursion depth
```

and still overflow the JavaScript call stack.

Memoization is not a substitute for iterative execution when depth is unsafe.

---

# 36. Cycle Detection

Ordinary dynamic programming assumes a well-defined dependency direction.

If recursive states can cycle:

```text
A → B → C → A
```

simple memoization may not terminate.

Use explicit visitation states or solve the problem as a graph/cyclic-state problem.

---

# 37. Three-State Memoization

For dependency graphs, a useful model is:

```text
unvisited
visiting
completed
```

Encountering `visiting` can reveal a cycle.

This is distinct from ordinary completed-result caching.

---

# 38. Backend Applications

Memoization is useful for:

- dependency resolution;
- configuration search;
- recursive validation;
- route/state exploration;
- hierarchical computation;
- repeated permission calculations;
- query-planning subproblems.

Cache invalidation becomes a real concern when underlying data changes.

---

# 39. AI Applications

Top-down DP and memoized search appear in:

- planning state spaces;
- game search subproblems;
- structured decoding;
- symbolic reasoning;
- program synthesis;
- dynamic sequence alignment;
- combinatorial optimization.

AI workloads often make state canonicalization and cache size especially important.

---

# 40. Production Engineering

For production caches consider:

```text
maximum cache size
entry lifetime
memory pressure
key cardinality
serialization cost
cache hit rate
invalidation strategy
concurrency semantics
```

A mathematically useful cache can become a memory leak if state cardinality is unbounded.

---

# 41. Design Procedure

```text
1. Write the naive recursive recurrence.
2. Trace calls and identify repeated states.
3. Define the minimal future-relevant state.
4. Define a canonical key.
5. Add cache lookup before computation.
6. Compute the recurrence on cache miss.
7. Store the result.
8. Prove equal keys represent equal states.
9. Count unique states.
10. Count work per state.
11. Analyze cache + stack space.
12. Check recursion depth.
13. Decide top-down vs bottom-up.
14. Add bounded caching when state cardinality can grow.
```

---

# 42. Interview Explanation Template

> “The naive recursion has overlapping subproblems because different paths reach the same logical state. I first define the minimal state that completely determines the remaining computation, then memoize the result for that canonical state. Each unique state is solved once, so if there are S reachable states and T transition work per state, the time is O(S·T), with O(S) memo space plus recursion depth.”

---

# 43. Revision Checklist

- [ ] Can I identify overlapping subproblems?
- [ ] Can I distinguish overlapping subproblems from optimal substructure?
- [ ] Can I design minimal recursive state?
- [ ] Can I construct canonical memo keys?
- [ ] Can I convert recursion into top-down DP?
- [ ] Can I explain tree → state-graph transformation?
- [ ] Can I analyze state dimensionality?
- [ ] Can I choose Map vs nested Map vs array?
- [ ] Can I reason about sparse vs dense state spaces?
- [ ] Can I memoize feasibility, counts, and optimization results?
- [ ] Can I identify mutable cached-result hazards?
- [ ] Can I distinguish memoization from greedy reasoning?
- [ ] Can I compare top-down and bottom-up DP?
- [ ] Can I prove memoization correctness?
- [ ] Can I analyze cache and recursion-stack space separately?
- [ ] Can I detect cyclic-state problems?
- [ ] Can I apply memoized search to backend and AI problems?

# Key Takeaways

1. Memoization eliminates repeated computation by caching results for logical states.
2. The hardest part is designing the correct minimal state, not writing `Map.get()`.
3. Top-down DP is recursive problem solving plus memoization.
4. Memoization turns repeated search-tree branches into a shared state graph.
5. Unique-state count determines the main DP time/space bound.
6. State dimensionality can cause state explosion.
7. Cache keys must represent future-relevant state canonically.
8. Memoization reduces repeated work but does not automatically reduce recursion depth.
9. Mutable cached results require explicit ownership semantics.
10. Production caches need memory and cardinality controls.
