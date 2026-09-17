# 18 — Bitmask DP: State Compression & Subset Transitions

> **Phase 17 — Dynamic Programming**
>
> Bitmask DP represents a small finite set as bits inside an integer. It becomes powerful when the DP state is not a numeric index alone, but a **subset of objects**: visited cities, assigned workers, selected items, used features, or completed tasks.

---

## 1. Core Mental Model

For `n` binary decisions, a subset can be represented by `n` bits.

```text
bit i = 1 → element i is present/used
bit i = 0 → element i is absent/unused
```

There are `2^n` possible subsets.

Bitmask DP is therefore a form of state compression:

```text
large structured set state
        ↓
compact integer mask
        ↓
DP over 2^n states
```

It is usually practical only for relatively small `n`, because the state count is exponential.

---

## 2. JavaScript Bitwise Reality

JavaScript's ordinary bitwise operators operate on signed 32-bit integers.

Therefore expressions such as:

```js
mask | (1 << i)
mask & (1 << i)
mask ^ (1 << i)
```

have a 32-bit limitation and signedness considerations.

For larger masks, consider `BigInt`:

```js
1n << BigInt(i)
```

But `Number` bitwise operators and `BigInt` operators cannot be mixed.

Choose the representation deliberately.

---

## 3. Essential Operations

For a bit index `i`:

```text
set:      mask | (1 << i)
clear:    mask & ~(1 << i)
toggle:   mask ^ (1 << i)
contains: (mask & (1 << i)) !== 0
```

With BigInt, use `1n << BigInt(i)` and BigInt-compatible operators.

The important skill is not memorizing operators, but translating the domain state into a precise bit invariant.

---

## 4. Subset Enumeration

Enumerate all masks:

```text
0 ... (1 << n) - 1
```

Enumerate set bits of one mask by repeatedly extracting a bit:

```text
while (mask !== 0) {
  bit = mask & -mask
  mask ^= bit
}
```

The number of iterations is proportional to the number of set bits, not `n`.

---

## 5. Popcount

`popcount(mask)` is the number of selected elements.

Useful meanings include:

- number of visited vertices;
- number of assigned jobs;
- number of selected features;
- subset cardinality.

DP transitions often use:

```text
position = popcount(mask)
```

when the number of selected elements determines the next decision index.

---

## 6. The Basic `dp[mask]` Pattern

A common state is:

```text
dp[mask] = best answer after processing exactly the elements in mask
```

Transition by adding one unused element `j`:

```text
nextMask = mask | (1 << j)
dp[nextMask] = optimize(dp[nextMask], transition(dp[mask], j))
```

This pattern appears in assignment, ordering, subset construction, scheduling, and route planning.

---

## 7. `dp[mask][last]` Pattern

When the future depends on the last selected object, use:

```text
dp[mask][last]
```

Meaning:

> The best value after visiting exactly `mask`, with `last` as the final element.

The transition commonly adds an unused `next`:

```text
dp[mask | (1 << next)][next]
    = min/max(
        dp[mask][last] + cost(last, next)
      )
```

This is the central state for Hamiltonian-path and TSP-style DP.

---

## 8. Why `last` Matters

Suppose two routes visit the same subset but end at different vertices.

The future cost may differ because the next edge depends on the current endpoint.

Therefore:

```text
mask alone          ❌ insufficient
(mask, last)        ✅ sufficient
```

This is a direct application of the state-sufficiency principle from earlier DP lessons.

---

## 9. Assignment DP

For `n` workers and `n` jobs:

```text
dp[mask] = minimum cost after assigning the first popcount(mask)
           workers to exactly the jobs in mask
```

If worker `i = popcount(mask)` is next:

```text
dp[mask | (1 << job)]
    = min(dp[next], dp[mask] + cost[i][job])
```

This reduces a factorial assignment search to roughly:

```text
O(n × 2^n)
```

assuming each mask tries up to `n` jobs.

---

## 10. TSP / Hamiltonian Path DP

For a complete weighted graph:

```text
dp[mask][last]
```

stores the minimum path cost visiting exactly `mask` and ending at `last`.

Transition:

```text
dp[newMask][next]
    = min(
        dp[mask][last] + dist[last][next]
    )
```

A final edge back to the start converts a Hamiltonian tour into TSP.

Complexity is typically:

```text
Time:  O(n^2 × 2^n)
Space: O(n × 2^n)
```

---

## 11. Hamiltonian Path Feasibility

For an unweighted graph, replace numeric cost with boolean reachability:

```text
dp[mask][v] = true
```

if there exists a path visiting exactly `mask` and ending at `v`.

For every neighbor `u` of `v`, transition from:

```text
prevMask = mask without v
```

This demonstrates that bitmask DP is not tied to minimization.

---

## 12. Subset Partitioning

Some problems ask you to partition a set into groups.

A generic form is:

```text
dp[mask] = best result after covering mask
```

Choose a submask `sub ⊆ remaining`:

```text
dp[mask | sub] = optimize(...)
```

Naively enumerating all submasks of all masks costs approximately:

```text
O(3^n)
```

because the number of `(mask, submask)` pairs with `sub ⊆ mask` is `3^n`.

---

## 13. Submask Enumeration

A standard technique is:

```text
sub = mask
while (sub > 0) {
  // use sub
  sub = (sub - 1) & mask
}
```

It visits every non-empty submask exactly once.

Include `sub = 0` separately when required.

This idiom is fundamental for subset-partition DP.

---

## 14. SOS DP / Subset Aggregation

Sometimes we need:

```text
F[mask] = sum over sub ⊆ mask of A[sub]
```

Enumerating every submask costs `O(3^n)`.

The Sum Over Subsets (SOS) transform can compute all such values in approximately:

```text
O(n × 2^n)
```

by progressively incorporating one bit at a time.

The same idea extends beyond sums to operations with suitable algebraic structure.

---

## 15. Superset DP

The dual query is:

```text
F[mask] = sum over super ⊇ mask of A[super]
```

The update direction changes from subset aggregation to superset aggregation.

Always define the exact relation first:

```text
sub ⊆ mask
```

versus:

```text
super ⊇ mask
```

A reversed loop can produce a completely plausible but incorrect result.

---

## 16. Bitmask DP as a DAG

If every transition adds one previously unused element:

```text
popcount(nextMask) = popcount(mask) + 1
```

there is a natural topological order by subset size.

Therefore many bitmask DPs can be interpreted as DAG DP over the subset lattice.

This gives a clean correctness argument and explains why forward iteration works.

---

## 17. Layering by Cardinality

Instead of iterating arbitrary masks, process:

```text
size 0
size 1
size 2
...
size n
```

This is useful when:

- transitions always increase subset size;
- memory can be processed layer by layer;
- the problem requires cardinality-based reasoning.

However, compressing away earlier layers is safe only if no future transition needs them.

---

## 18. Reconstruction

Store a predecessor:

```text
parent[nextMask] = { previousMask, chosenElement }
```

or for TSP:

```text
parent[mask][last] = previousLast
```

Then reconstruct the optimal subset/order by walking backward.

Do not assume the first optimal predecessor encountered is the desired one unless tie-breaking is part of the contract.

---

## 19. Meet-in-the-Middle Connection

Bitmask DP and meet-in-the-middle solve different bottlenecks but can interact.

When `n` is too large for `2^n`, splitting into two halves can reduce enumeration to approximately:

```text
2^(n/2)
```

and combine partial results.

Do not automatically replace exponential DP with meet-in-the-middle; identify whether the transition structure supports efficient combination.

---

## 20. Symmetry Reduction

If several elements are interchangeable, treating their identities as distinct may create redundant states.

Possible approaches:

- canonical labels;
- grouped counts;
- fixing one representative;
- quotienting equivalent states.

The optimization is valid only when the symmetry preserves both transitions and objective value.

---

## 21. Memory Engineering

A conceptual state count of `n × 2^n` can become the real bottleneck.

In JavaScript, ordinary nested arrays and objects carry significant overhead.

For dense numeric DP, consider:

```text
Float64Array
Int32Array
BigInt64Array (when appropriate)
```

But typed arrays require careful sentinel and numeric-range choices.

Sparse `Map` storage may win when only a small fraction of masks is reachable.

---

## 22. Numeric Safety

Bitmask representation and DP values are separate concerns.

A mask may fit in a 32-bit representation while the DP cost exceeds `Number.MAX_SAFE_INTEGER`.

Conversely, BigInt masks do not make floating-point DP values exact.

Choose independently:

```text
state representation
value representation
```

---

## 23. Complexity Reality

The central scale is exponential:

```text
number of subsets = 2^n
```

Typical patterns:

| Pattern | Approximate complexity |
|---|---:|
| `dp[mask]`, O(n) transitions | `O(n 2^n)` |
| `dp[mask][last]` | `O(n² 2^n)` |
| all submasks | `O(3^n)` |
| SOS transform | `O(n 2^n)` |

These are often excellent for small `n`, but unsuitable for large `n`.

---

## 24. Common Failure Modes

### Wrong state
Forgetting `last`, current worker, or another future-relevant dimension.

### Wrong mask mutation
Mutating the current mask and accidentally losing the original state.

### Wrong bit width
Using JS bitwise operators beyond their safe intended range.

### Wrong submask loop
Skipping zero or creating an infinite loop.

### Wrong transition direction
Using an already-selected item when the problem requires each item exactly once.

### Hidden factorial work
Generating permutations despite an available `2^n` state representation.

### Memory explosion
Allocating `n × 2^n` dense tables without checking actual limits.

---

## 25. Correctness Invariant

For every reachable mask state, explicitly state:

> `dp[mask]` represents the optimum over exactly the configurations encoded by `mask`.

For `dp[mask][last]`:

> The state represents the optimum among all valid histories that visit exactly `mask` and finish at `last`.

Then prove:

1. base states are correct;
2. every legal transition considers every valid next choice;
3. no invalid transition is admitted;
4. the aggregation operator preserves the optimum;
5. the target state represents the requested answer.

---

## 26. Testing Strategy

Use:

- brute force for `n <= 10` where feasible;
- random cost matrices;
- random graphs;
- exhaustive masks for small `n`;
- permutation invariance where labels are irrelevant;
- symmetry transformations;
- duplicate/equal-cost cases;
- negative weights when supported;
- unreachable states;
- maximum-mask boundary cases;
- `Number` vs `BigInt` cross-checks for safe ranges.

For subset transforms, independently verify every mask against direct submask enumeration on tiny inputs.

---

## 27. Backend Engineering Applications

Bitmask DP is useful when a backend problem has a genuinely small finite universe:

- feature selection for a small fixed set;
- permission-policy combinations;
- workflow completion states;
- dependency subsets;
- small-resource scheduling;
- route planning over a small number of services;
- configuration optimization.

Do not use bitmask DP merely because a system contains Boolean flags. The exponential state space must be bounded.

---

## 28. AI Engineering Applications

Applications include:

- planning over a small set of tasks;
- feature/subset selection;
- constrained experiment selection;
- combinatorial search;
- small assignment problems;
- exact inference over small discrete variable sets;
- route and ordering optimization.

The key AI engineering question is whether the discrete state space is small enough for exact enumeration or whether approximation, search, relaxation, or learned heuristics are required.

---

## 29. Interview Framework

When you see a subset problem, ask:

1. Is `n` small enough for `2^n`?
2. Does the state represent a subset?
3. What information beyond the subset is needed?
4. Is `dp[mask]` sufficient?
5. Do I need `dp[mask][last]` or another dimension?
6. Does each transition add/remove one element?
7. Can I enumerate only set bits?
8. Do I need all submasks?
9. Would SOS/subset transform avoid `3^n` work?
10. Can symmetry reduce states?
11. Can I reconstruct the solution?
12. What are JavaScript's integer and memory constraints?

---

## 30. Master Pattern

```text
Identify small universe of n elements
          ↓
Encode subset as mask
          ↓
Define exact state invariant
          ↓
Add/remove/choose bits through legal transitions
          ↓
Process subset DAG
          ↓
Optimize / count / decide / aggregate
          ↓
Compress memory when dependency-safe
          ↓
Use submask enumeration or SOS when required
          ↓
Reconstruct if needed
          ↓
Validate against brute force
          ↓
Audit 2^n / 3^n complexity + JS limits
```

Bitmask DP is best understood as **dynamic programming over the subset lattice**. The bit tricks are merely the representation layer; the real algorithmic skill is designing a sufficient state and exploiting repeated subset states without accidentally changing the problem's semantics.