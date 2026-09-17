# 36 — Bounded Knapsack Optimization: Monotone Queue, Binary Splitting & Residue Classes

## 1. Why bounded knapsack deserves its own pattern

Bounded knapsack sits between 0/1 and unbounded knapsack:

```text
item i may be chosen 0..count[i] times
```

The straightforward recurrence is correct but can cost `O(n * W * count[i])`. When multiplicities are large, the transition itself becomes the bottleneck.

This lesson develops three complementary techniques:

- binary splitting;
- residue-class decomposition;
- monotone-queue optimization.

The important skill is deriving the optimization from the recurrence rather than memorizing an implementation.

---

## 2. Baseline bounded-knapsack DP

For maximum value with item weight `w`, value `v`, and multiplicity `c`:

```text
dp_new[x] = max_{0 <= k <= c, k*w <= x} (dp_old[x-k*w] + k*v)
```

The direct transition scans every feasible `k`.

If capacity is `W`, this can become expensive when `c` is large.

First implement the baseline. Every optimized version should be compared against it on small inputs.

---

## 3. Why in-place updates are dangerous

A bounded item must not accidentally become reusable beyond its multiplicity.

Naive ascending updates can turn a bounded transition into an unbounded one. Descending updates avoid some reuse in the 0/1 case, but bounded multiplicity requires more careful handling.

A clean baseline uses separate `old` and `next` arrays or another representation that makes the item-layer semantics explicit.

---

## 4. Binary splitting

A quantity `c` can be decomposed into groups whose sizes cover every integer from `0` to `c`.

For example, a multiplicity can be represented using powers of two plus a remainder. Each group becomes a 0/1 item:

```text
(weight * groupSize, value * groupSize)
```

The number of generated groups is `O(log c)`.

This converts bounded knapsack into a larger 0/1 instance and often changes the transition complexity to roughly

```text
O(W * log c)
```

per item.

---

## 5. Correctness of binary splitting

The decomposition must represent every integer quantity from `0` through `c` exactly once as a subset of groups.

This is a coverage-and-uniqueness argument:

- every legal quantity is representable;
- no subset corresponds to an illegal quantity.

For the common power-of-two construction, carefully handle the final remainder rather than assuming the groups are all powers of two.

---

## 6. When binary splitting is appropriate

Binary splitting is attractive when:

- the problem is naturally 0/1 after decomposition;
- implementation simplicity matters;
- values and weights scale linearly with quantity;
- reconstruction through chosen groups is acceptable.

It may not be ideal when the multiplicity is enormous but capacity is moderate, because a residue-class optimization can exploit the structure more directly.

---

## 7. Residue classes

For a fixed weight `w`, states with different

```text
x mod w
```

are independent under the bounded transition.

Write

```text
x = r + q*w
```

for residue `r`.

The transition becomes a one-dimensional sliding-window optimization over `q`.

This is the structural step that makes the monotone queue possible.

---

## 8. Max-value transformation

For

```text
dp_new[r + q*w]
 = max_{0 <= k <= c} (dp_old[r + (q-k)w] + k*v)
```

let

```text
j = q-k
```

Then

```text
dp_new[r + q*w]
 = q*v + max_{q-c <= j <= q} (dp_old[r+j*w] - j*v)
```

The `q*v` term is common to the entire window.

The remaining task is a sliding-window maximum.

---

## 9. Monotone deque

A monotone deque maintains candidates in decreasing order of their transformed values.

For each new `q`:

1. remove indices outside the window;
2. remove dominated candidates from the back;
3. insert the current transformed value;
4. read the maximum from the front.

Each index enters once and leaves once, giving amortized `O(1)` work per state.

Therefore one bounded item can be processed in `O(W)` time after residue decomposition.

---

## 10. Deque invariant

The deque should maintain:

```text
indices increasing from front to back
transformed values decreasing from front to back
```

The front is always the best candidate among currently valid indices.

When a new candidate has a value at least as good as a candidate behind it, the older candidate can be discarded because the new candidate expires later and is no worse.

This is the core dominance proof.

---

## 11. Minimum-cost version

The same derivation works for minimization by changing the aggregation and deque ordering.

For

```text
dp_new[x] = min(dp_old[x-k*w] + k*c)
```

transform the expression so the sliding-window component becomes a minimum query.

A monotone increasing deque then maintains the best candidate.

The data structure follows the algebra of the recurrence.

---

## 12. Feasibility/counting variants

Monotone-queue optimization is most natural for max/min affine transitions.

Boolean reachability and counting transitions require different techniques because the aggregation is not an ordered maximum/minimum.

Do not force a deque onto every bounded-knapsack variant. First classify the transition algebra.

For counting, prefix sums or recurrence transformations may sometimes remove an inner multiplicity loop, but the details depend on the exact recurrence.

---

## 13. Bounded counting with prefix sums

For counting ways to form capacity `x`, a bounded item contributes

```text
new[x] = Σ_{k=0..c} old[x-k*w]
```

Within one residue class, this is a sliding window sum.

Maintain a running sum as `q` increases:

```text
windowSum(q) = windowSum(q-1)
               + old[q]
               - old[q-c-1]
```

This reduces a multiplicity scan to `O(1)` amortized work per state.

---

## 14. Bounded feasibility with window counts

For boolean reachability, a direct numeric window sum is not sufficient when duplicate contributions have different semantics, but a standard technique can track how many reachable predecessors are currently in the window.

Maintain a count of reachable states in the residue-class window. A target is reachable iff the count is positive.

Again, the optimization is derived from the exact transition semantics.

---

## 15. Monotone queues vs binary splitting

Both can improve bounded knapsack, but they optimize different representations.

| Technique | Main idea | Typical time/item | Reconstruction |
|---|---|---:|---|
| Direct | scan multiplicity | `O(W*c)` | straightforward |
| Binary splitting | convert to 0/1 groups | `O(W log c)` | group-based |
| Monotone deque | residue + sliding optimum | `O(W)` | requires bookkeeping |

The `O(W)` result applies to the affine max/min transition under the stated bounded-knapsack model.

---

## 16. Multiple dimensions

With two resource dimensions, such as weight and volume, the transition becomes multidimensional.

A one-dimensional residue decomposition no longer automatically solves the problem. You may need:

- nested decomposition;
- specialized monotone structures;
- data structures over one dimension;
- alternative formulations.

Optimization techniques are highly sensitive to state dimensionality.

---

## 17. Value-based DP

If capacity is huge but total value is small, switch axes:

```text
dp[value] = minimum weight
```

Then bounded multiplicities can be optimized in value space instead.

The correct DP axis is determined by the smaller effective pseudo-polynomial dimension, not by the wording of the problem.

---

## 18. Negative values and sentinel states

Maximum-value DP often uses a sentinel such as negative infinity for unreachable states.

Never add a finite value to an unreachable sentinel without checking it. Numeric overflow or accidental conversion can create fake reachable states.

In JavaScript, choose sentinels that remain safe under the expected value range or use explicit reachability flags.

---

## 19. Reconstruction

The optimized value computation does not automatically preserve the selected quantity `k`.

Possible approaches:

- store the chosen deque candidate;
- store parent metadata per state;
- recompute a local transition during backtracking;
- checkpoint intermediate layers.

Reconstruction can increase memory substantially. Separate the requirements for **optimal value** and **optimal witness**.

---

## 20. Tie-breaking

If multiple quantities produce the same optimum, define deterministic semantics such as:

- minimum number of items;
- maximum number of items;
- lexicographically smallest selection vector.

The deque comparison must include the tie-breaking metadata. An optimization is incorrect if it changes the specified witness policy.

---

## 21. Multiple bounded item types

Process item types sequentially, exactly as in ordinary knapsack DP. For each item:

```text
old → optimized bounded transition → new
```

The monotone queue optimizes one item layer; it does not eliminate the outer loop over item types.

For `n` item types and capacity `W`, the standard optimized complexity is `O(nW)` for the one-dimensional affine bounded transition.

---

## 22. Circular / modular capacity pitfalls

Residue-class decomposition is based on ordinary integer capacity and fixed weight increments. Do not confuse it with a modulo-capacity state where transitions wrap around.

If the problem itself has cyclic resources, define the state semantics independently before applying the technique.

---

## 23. Testing methodology

For every optimized solver, maintain a slow reference implementation.

Test:

- random small capacities;
- multiplicity `0`, `1`, and very large relative to capacity;
- weight `1`;
- weight greater than capacity;
- duplicate item types;
- unreachable capacities;
- zero values;
- negative values if supported;
- exact vs modular counting;
- reconstruction and tie-breaking.

Differential testing is especially valuable for deque implementations because indexing mistakes are easy to make.

---

## 24. Complexity engineering

Track both asymptotic and practical cost:

```text
Direct bounded: O(n W c_max)
Binary splitting: O(W Σ log c_i)
Monotone queue: O(nW)
```

Space is usually `O(W)` for value-only one-dimensional DP, with larger memory if reconstruction is required.

Do not report only the optimized bound. Explain the assumptions under which it holds.

---

## 25. Backend applications

Bounded resource allocation appears in:

- inventory allocation;
- quota assignment;
- batch capacity planning;
- pricing bundles;
- scheduling with limited repetitions;
- resource-budget optimization.

The backend concern is not just runtime. Validate multiplicities, cap resource dimensions, and prevent requests that intentionally create pathological pseudo-polynomial workloads.

---

## 26. AI engineering applications

Bounded knapsack variants appear in:

- constrained decoding budgets;
- token/resource allocation;
- candidate selection under quotas;
- feature-budget optimization;
- batch construction;
- inference-time resource planning.

When used inside an AI pipeline, keep the optimization deterministic and expose the selected witness so downstream components can audit why a configuration was chosen.

---

## 27. Recognition checklist

When you see:

```text
choose 0..c copies
fixed weight/value
capacity W
max/min objective
```

ask:

1. Is the direct transition scanning multiplicity?
2. Can multiplicity be binary-split?
3. Is the transition affine in the quantity chosen?
4. Can states be separated by `x mod w`?
5. Does the resulting transition become a sliding-window max/min/sum?
6. Can a monotone deque or running window remove the inner loop?
7. What witness/tie-breaking information must survive?

---

## 28. Master pattern

```text
Write baseline bounded recurrence
          ↓
Identify expensive multiplicity loop
          ↓
Choose representation
   ↙          ↓          ↘
binary     residue      value-axis
split      classes       redesign
             ↓
       sliding window
             ↓
       monotone deque
             ↓
       O(W) per item
             ↓
compare with slow oracle
```

The central lesson is that bounded-knapsack optimization is not a bag of tricks. It is **algebraic transformation + state reindexing + a data structure that exploits the resulting local structure**.
