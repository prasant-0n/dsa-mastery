# 05 — DP Space Optimization & Rolling Arrays

> **Phase 17 — Dynamic Programming**
>
> Space optimization is not a trick to memorize. It follows from the dependency structure of a recurrence: if a state only needs a bounded portion of earlier states, the full table may be unnecessary.

---

## 1. Why Space Optimization Works

Suppose:

```text
dp[i] depends only on dp[i - 1]
```

Storing every previous row is unnecessary. The algorithm only needs the information required by future transitions.

The key question is:

> **Which previously computed states can still influence an uncomputed state?**

Space optimization is therefore a dependency-analysis problem.

---

## 2. Full Table First

Start with the clearest correct formulation:

```js
const dp = Array(n + 1).fill(0);

for (let i = 1; i <= n; i++) {
  dp[i] = transition(dp[i - 1], i);
}
```

Only after the recurrence is understood should storage be compressed.

A reliable workflow is:

```text
correct recurrence
      ↓
full DP table
      ↓
inspect dependencies
      ↓
identify live states
      ↓
compress storage
      ↓
prove equivalence
```

---

## 3. Rolling Arrays

For a two-dimensional recurrence such as:

```text
DP[i][j] depends on DP[i - 1][j] and DP[i - 1][j - 1]
```

a full `n × m` table may be reduced to two rows:

```text
previous row
current row
```

After completing a row:

```text
previous ← current
```

This changes space from `O(nm)` to `O(m)` when the row width is the retained dimension.

---

## 4. Two-Row Template

Conceptually:

```js
let prev = Array(cols).fill(baseValue);
let curr = Array(cols).fill(baseValue);

for (let i = 1; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    curr[j] = transition(prev, curr, i, j);
  }

  [prev, curr] = [curr, prev];
}
```

The second row can be reused after its old contents are overwritten correctly.

---

## 5. One-Row Compression

Sometimes the recurrence can be reduced further:

```text
DP[i][j] depends on:
- previous-row j
- previous-row j - 1
- current-row j - 1
```

A single array can represent the current row while the old `dp[j]` remains available as the previous-row value until it is overwritten.

Conceptually:

```js
for (let i = 1; i < rows; i++) {
  let diagonal = dp[0];

  for (let j = 1; j < cols; j++) {
    const up = dp[j];
    const left = dp[j - 1];

    dp[j] = transition(up, left, diagonal);
    diagonal = up;
  }
}
```

The variable `diagonal` is not arbitrary bookkeeping. It preserves a state that would otherwise be destroyed by the in-place update.

---

## 6. Update Order Is Part of the Algorithm

Once a DP table is compressed, loop direction becomes semantically important.

Consider 0/1 knapsack:

```text
dp[w] = best value for capacity w
```

When processing an item, capacity usually moves downward:

```js
for (let w = capacity; w >= weight; w--) {
  dp[w] = Math.max(dp[w], dp[w - weight] + value);
}
```

Why?

Because downward iteration ensures `dp[w - weight]` still refers to the previous item layer.

If capacity moves upward, the current item can be reused within the same iteration, changing the problem into an unbounded-choice variant.

---

## 7. In-Place DP Means Layer Encoding

A compressed array often simultaneously represents two logical layers:

```text
before update → previous layer
after update  → current layer
```

Therefore every assignment must preserve the values that future transitions still need.

Think of in-place DP as a controlled overwrite schedule.

---

## 8. Dependency Frontier

A useful mental model is the **dependency frontier**.

Imagine all DP states as nodes in a graph. At any moment, ask:

```text
Which computed states still have outgoing dependencies to uncomputed states?
```

Those states form the live frontier.

Space optimization stores the frontier instead of the entire history.

This generalizes beyond simple rows to:

- rolling arrays
- sliding windows
- bounded-history recurrences
- streaming DP
- frontier DP
- compressed graph DP

---

## 9. When Compression Is Safe

A compression is safe when discarded states can no longer affect any future computation or can be reconstructed from retained state.

Formally, if two histories produce the same retained representation and every future transition sees them identically, the histories are equivalent for the remaining computation.

This is another form of **state sufficiency**.

---

## 10. Space Optimization Is Not Always Appropriate

Do not optimize space blindly.

A full table may be preferable when:

- solution reconstruction needs historical states
- debugging requires the table
- the table is already small
- compressed code is significantly harder to verify
- the recurrence has nonlocal dependencies
- future extensions require arbitrary earlier states

The objective is not minimum memory at any cost.

The objective is:

> **minimum sufficient state with preserved correctness and maintainability.**

---

## 11. Reconstruction Problem

Suppose the DP computes:

```text
maximum value
```

but the final answer must include the chosen items.

A fully compressed DP may discard information needed to reconstruct the decisions.

Possible solutions:

1. retain parent/choice information
2. keep a separate reconstruction structure
3. recompute selected decisions backward
4. use a divide-and-conquer reconstruction method
5. use the full table when reconstruction simplicity matters

Space optimization and reconstruction must be designed together.

---

## 12. Hirschberg-Style Reconstruction

Some sequence problems can achieve both:

```text
O(nm) time
O(min(n, m)) auxiliary space
```

while still reconstructing an optimal alignment.

The general strategy is:

1. compute forward scores using linear space
2. compute reverse scores using linear space
3. identify a midpoint split
4. recursively reconstruct both halves

The important idea is that reconstruction can sometimes recover discarded history through additional computation rather than storing the entire table.

---

## 13. Rolling Array Dimension Choice

If a DP table has dimensions:

```text
n × m
```

and only two rows are required, choose the smaller dimension for the retained array when the recurrence permits it.

Then auxiliary space becomes:

```text
O(min(n, m))
```

This matters for highly rectangular tables.

Always verify that swapping dimensions preserves the recurrence and iteration semantics.

---

## 14. Boundary Conditions

Compressed DP is particularly vulnerable to boundary bugs.

Explicitly define:

- first row
- first column
- empty input
- zero capacity
- invalid transitions
- unreachable states

Do not let array defaults accidentally become mathematical base cases.

For example, `0` may mean:

```text
valid zero score
```

or it may incorrectly mean:

```text
unreachable
```

Use explicit sentinels where the value domain requires them.

---

## 15. Infinity and Unreachable States

For minimization DP, an unreachable state is often represented conceptually by:

```text
+∞
```

For maximization:

```text
-∞
```

In JavaScript, `Infinity` and `-Infinity` can be useful when the arithmetic remains safe.

But avoid operations where an invalid sentinel can accidentally become a valid value.

Example:

```js
if (prev !== Infinity) {
  candidate = prev + cost;
}
```

The sentinel semantics must be part of the recurrence contract.

---

## 16. Typed Arrays

For dense numeric DP, JavaScript typed arrays can reduce overhead and improve locality.

Examples:

```js
const dp = new Int32Array(n + 1);
```

or:

```js
const dp = new Float64Array(n + 1);
```

Choose the numeric type according to the value range.

Be careful with:

- overflow
- negative values
- floating-point precision
- `BigInt` incompatibility with ordinary typed numeric arrays

Typed arrays are an engineering optimization, not a substitute for correct state design.

---

## 17. BigInt and Space Optimization

Exact counting may require `BigInt`:

```js
const dp = Array(n + 1).fill(0n);
```

A rolling array still works:

```text
previous BigInt layer
current BigInt layer
```

Do not mix `Number` and `BigInt` in arithmetic.

If the state count is huge, memory savings from rolling arrays can be significant.

---

## 18. Sliding-Window DP

Some recurrences depend only on a fixed-width history:

```text
dp[i] depends on dp[i-1], dp[i-2], ..., dp[i-k]
```

Instead of storing all `n` states, retain only the last `k` states.

For example:

```text
F(i) = F(i-1) + F(i-2)
```

requires only two previous values.

The general principle is:

```text
history length = dependency width
```

not:

```text
history length = input size
```

---

## 19. Ring Buffers

For larger fixed-width histories, a circular buffer can reuse storage:

```js
const buffer = new Array(k);

for (let i = 0; i < n; i++) {
  const slot = i % k;
  buffer[slot] = computeFromHistory(buffer, i);
}
```

The indexing must respect which logical states each slot currently represents.

A ring buffer is essentially a rolling array generalized to a larger dependency window.

---

## 20. DAG DP and Topological Memory

For DP on a DAG, a full table is often unnecessary if each node's result is consumed by only a bounded future frontier.

However, arbitrary DAG structure may require many values to remain live.

Therefore the theoretical question becomes:

> What is the maximum number of simultaneously live states under the chosen evaluation order?

This connects DP memory optimization to graph evaluation and scheduling.

---

## 21. Dependency Analysis Before Coding

For every recurrence, write dependencies explicitly.

Example:

```text
DP[i][j]
    ↓
DP[i-1][j]
DP[i][j-1]
DP[i-1][j-1]
```

Then ask:

```text
Which values are overwritten?
Which values are still needed?
Which iteration order preserves them?
```

This is much safer than memorizing “iterate backward for knapsack.”

The loop direction is a consequence of dependencies.

---

## 22. Correctness Proof for Compression

A good proof has two layers.

### Layer 1 — Recurrence correctness

Prove that the original full-table recurrence computes the correct answer.

### Layer 2 — Representation equivalence

Prove that before every compressed update, the retained variables contain exactly the full-table values required by the next transition.

Then show that every overwritten value is no longer needed.

This establishes that compressed execution produces the same answer as the full DP.

---

## 23. Differential Testing

Keep a simple full-table implementation as a reference.

Then compare it against the optimized version:

```text
full DP
   vs
rolling DP
```

Generate many small random inputs and assert identical outputs.

This is especially effective for catching:

- wrong loop direction
- stale values
- incorrect swap order
- boundary errors
- accidental item reuse
- overwritten diagonal values

---

## 24. Metamorphic Tests

Useful properties depend on the problem, but examples include:

- changing storage representation must not change the result
- swapping equivalent dimensions should preserve the answer when the recurrence is symmetric
- adding unreachable states should not affect the result
- full-table and compressed implementations must agree for all valid small inputs

The most powerful property here is often **implementation equivalence** rather than a domain-specific transformation.

---

## 25. Benchmarking Memory

Do not claim a space optimization only because the code has fewer arrays.

Measure:

```text
input size
peak heap usage where practical
allocation count
runtime
GC pressure
cache locality effects
```

For JavaScript, benchmark sufficiently large inputs and repeat measurements because runtime and garbage collection can vary.

Also distinguish:

```text
auxiliary algorithmic space
```

from:

```text
runtime/system overhead
```

---

## 26. Backend Engineering Applications

Space-optimized DP is useful when backend workloads contain large bounded dynamic programs:

- pricing optimization
- resource allocation
- scheduling
- sequence comparison
- reconciliation
- batch planning
- capacity optimization

In a service, memory limits can matter as much as asymptotic time.

A DP that is theoretically `O(nm)` space may become operationally expensive when processing many requests concurrently.

Rolling-state designs can reduce per-request memory and therefore improve concurrency headroom.

---

## 27. AI Engineering Applications

Many AI and structured-search workloads contain dynamic-programming layers where only a bounded frontier is required.

Examples include:

- sequence alignment
- structured decoding
- constrained generation
- dynamic programming over lattices
- finite-state decoding
- planning subproblems

A useful architecture separates:

```text
mathematical recurrence
        ↓
reference implementation
        ↓
compressed production implementation
        ↓
differential validation
```

This preserves correctness while allowing memory optimization.

---

## 28. Common Failure Modes

### Failure 1 — Compressing before understanding the recurrence

You lose the easiest correctness model.

### Failure 2 — Wrong iteration direction

The current layer accidentally consumes values already updated in the same iteration.

### Failure 3 — Losing a diagonal value

An in-place update overwrites a value still needed by the next cell.

### Failure 4 — Incorrect row swap

`curr` and `prev` no longer represent the intended layers.

### Failure 5 — Breaking reconstruction

The optimized table computes the score but cannot recover the decisions.

### Failure 6 — Sentinel contamination

An unreachable state participates in arithmetic as though it were valid.

### Failure 7 — Optimizing asymptotically but hurting engineering quality

The memory reduction is real, but the implementation becomes fragile and difficult to verify.

---

## 29. Interview Framework

When asked to optimize DP space, answer in this order:

1. **Define the full DP state.**
2. **Write the recurrence.**
3. **Identify exact dependencies.**
4. **Determine which historical layers remain live.**
5. **Choose rolling/two-row/one-row storage.**
6. **Derive loop direction from dependencies.**
7. **Address reconstruction requirements.**
8. **State time and space complexity.**
9. **Explain why overwritten values are no longer needed.**
10. **Test optimized code against the full-table version.**

This demonstrates reasoning rather than memorization.

---

## 30. Master Pattern

The complete reasoning chain is:

```text
problem
  ↓
state
  ↓
recurrence
  ↓
full DP table
  ↓
dependency graph
  ↓
live dependency frontier
  ↓
compressed representation
  ↓
correct update order
  ↓
proof of representation equivalence
  ↓
differential testing
  ↓
production optimization
```

The deepest lesson is:

> **Space optimization is state-liveness analysis. Store exactly the information that future transitions still need—and no more.**

---

## Revision Checklist

Before considering this topic mastered, you should be able to:

- derive when a DP can use rolling arrays
- explain why 0/1 knapsack iterates capacity backward
- derive loop direction instead of memorizing it
- compress a 2D DP into two rows
- compress a two-row DP into one row when safe
- preserve diagonal dependencies
- distinguish valid zero from unreachable state
- design reconstruction with compressed DP
- explain sliding-window and ring-buffer DP
- reason about live state frontiers
- prove compressed/full-table equivalence
- build a differential oracle
- benchmark memory and runtime
- recognize when not to optimize space
- explain the technique in a backend or AI engineering context
