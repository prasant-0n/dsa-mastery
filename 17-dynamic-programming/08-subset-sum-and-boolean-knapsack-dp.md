# 08 — Subset Sum & Boolean Knapsack DP

> **Phase 17 — Dynamic Programming**
>
> Subset Sum is the canonical bridge from recursive include/exclude search to DP. The key idea is to treat each `(item, target)` pair as a reachability state: can this target be formed using exactly the items considered so far?

---

## 1. The Core Mental Model

Given values `a[0..n-1]` and target `T`, ask:

> Is there a subset whose sum is exactly `T`?

The brute-force search makes two decisions for every item:

```text
exclude item i
include item i
```

This creates up to `2^n` subsets.

DP observes that many branches reach the same `(index, remainingTarget)` state.

That repeated state is the opportunity for memoization or tabulation.

---

## 2. Boolean DP Means Reachability

Define:

```text
dp[s] = true
```

if sum `s` is achievable using the processed items.

Initially:

```text
dp[0] = true
```

because the empty subset produces sum zero.

For an item `x`, every previously reachable sum `s` can produce:

```text
s + x
```

if the item is selected.

The transition is therefore:

```text
dpNew[s + x] |= dpOld[s]
```

This is a reachability problem over an implicit state graph.

---

## 3. Two-Dimensional State

The direct formulation is:

```text
dp[i][s] = whether sum s is achievable using the first i items
```

Transition:

```text
dp[i][s] = dp[i - 1][s]
           OR
           dp[i - 1][s - a[i - 1]]
```

when `s >= a[i - 1]`.

The two alternatives correspond exactly to exclude/include.

---

## 4. Base Cases

For the 2D formulation:

```text
dp[0][0] = true
```

and:

```text
dp[0][s] = false   for s > 0
```

This says that with zero items, only sum zero is reachable.

Base cases should be derived from the state meaning, not memorized.

---

## 5. One-Dimensional Compression

The previous row is sufficient, so we can compress:

```text
dp[s]
```

But compression introduces a critical semantic issue: an item must not be used more than once.

For a 0/1 subset problem, iterate sums **descending**:

```text
for (let s = target; s >= x; s--) {
  dp[s] = dp[s] || dp[s - x];
}
```

Why descending?

Because `dp[s - x]` must still represent the state **before the current item was processed**.

---

## 6. Why Ascending Order Changes the Problem

Consider:

```text
values = [3]
target = 6
```

If you iterate upward:

```text
s = 3  → dp[3] becomes true
s = 6  → dp[6] sees dp[3] from the same item
```

The algorithm has effectively selected `3` twice.

So:

```text
ascending loop → unbounded/reusable-item semantics
 descending loop → 0/1 semantics
```

Loop direction is not an implementation detail. It is part of the mathematical model.

---

## 7. 0/1 vs Unbounded Knapsack

This distinction appears everywhere in DP.

### 0/1

Each item may be used at most once.

Typical loop:

```text
capacity: descending
```

### Unbounded

An item may be reused.

Typical loop:

```text
capacity: ascending
```

The same recurrence can therefore represent different problems depending on evaluation order when the table is compressed.

---

## 8. Subset Sum as Boolean Knapsack

The classic knapsack family can be viewed as a generalized state transition:

```text
state = current capacity/sum
choice = take or skip item
aggregation = OR / MAX / MIN / COUNT
```

For feasibility:

```text
OR
```

For maximum value:

```text
MAX
```

For minimum cost:

```text
MIN
```

For number of ways:

```text
SUM
```

The state graph remains similar while the value algebra changes.

---

## 9. Partition Equal Subset Sum

Given an array with total sum `S`, splitting it into two equal-sum subsets requires:

```text
S must be even
```

and then:

```text
find subset sum S / 2
```

So a seemingly different partition problem reduces directly to Boolean Subset Sum.

The important interview skill is recognizing the transformation rather than memorizing a separate solution.

---

## 10. Target Sum Transformation

Suppose each number receives either `+` or `-` and the final expression must equal `target`.

Let:

```text
P = sum of numbers assigned +
N = sum of numbers assigned -
```

Then:

```text
P - N = target
P + N = total
```

Therefore:

```text
2P = total + target
P = (total + target) / 2
```

When the value is integral and valid, the problem becomes a subset-sum counting problem.

This transformation demonstrates a broader DP technique:

> Convert a signed-choice problem into a constrained subset state when the algebra permits it.

---

## 11. Feasibility vs Counting

Do not confuse:

```text
Can target be formed?
```

with:

```text
How many subsets form target?
```

Boolean DP stores:

```text
true / false
```

Counting DP stores an integer or `BigInt` count.

The transition changes from:

```text
dp[s] |= dp[s - x]
```

to:

```text
dp[s] += dp[s - x]
```

But duplicate values and item identity determine what constitutes a distinct subset.

---

## 12. Distinct Items vs Distinct Values

For:

```text
[2, 2]
```

the two `2`s are normally different items.

Selecting the first `2` and selecting the second `2` can represent different subsets even though their values are equal.

Therefore, counting DP must define its counting unit explicitly.

Possible semantics include:

- subsets of item indices
- distinct value multisets
- ordered selections
- combinations with unlimited reuse

A correct recurrence under the wrong semantics is still the wrong algorithm.

---

## 13. Reconstruction

Boolean DP can answer feasibility, but an interviewer may ask:

> Which subset achieves the target?

One approach is to retain parent information:

```text
parentSum[s] = previous sum
parentItem[s] = selected item
```

Then reconstruct from `target` back to `0`.

Another approach is to retain the full 2D table and walk backward through the decisions.

Value computation and reconstruction are separate requirements.

---

## 14. Negative Numbers Change the State Space

The simple array formulation assumes non-negative values and a bounded target range.

If values can be negative:

```text
s + x
```

may move in either direction.

A direct array indexed by sum no longer starts naturally at zero.

Options include:

- offset-indexed arrays
- `Map<sum, boolean>`
- coordinate compression of reachable sums
- meet-in-the-middle for small `n`
- alternative mathematical transformations

The right representation depends on the reachable sum range, not merely `n`.

---

## 15. Offset DP for Signed Values

If the minimum possible sum is `MIN_SUM` and maximum is `MAX_SUM`, define:

```text
offset = -MIN_SUM
index = sum + offset
```

Then every reachable sum maps into:

```text
[0, MAX_SUM - MIN_SUM]
```

This preserves array-based performance when the total signed range is manageable.

The memory cost is proportional to the **sum range**, which may be much larger than `n`.

---

## 16. Sparse Sum-State DP

When the reachable sums are sparse, use a `Set` or `Map`:

```text
reachable = {0}

for each x:
    next = reachable ∪ {s + x | s ∈ reachable}
```

This can be much smaller than allocating every sum in a huge interval.

However, naïvely mutating the same set while iterating can accidentally reuse an item multiple times.

Use a snapshot or otherwise enforce 0/1 semantics.

---

## 17. Bitset Acceleration

Boolean subset-sum states can be represented as bits:

```text
bit s = 1  ⇔  sum s is reachable
```

Processing item `x` conceptually becomes:

```text
bits = bits OR (bits << x)
```

This packs many Boolean transitions into machine-level operations.

JavaScript does not provide a general arbitrary-length integer bitset with the same ergonomics as languages that expose native bitset types, but `BigInt` can represent arbitrary-size bit patterns and is useful for educational implementations when the target range is practical.

The complexity model must account for the number of machine words/big-integer limbs involved; do not blindly claim every bitset operation is `O(1)`.

---

## 18. Early Exit

For pure feasibility:

```text
if dp[target] becomes true:
    return true
```

This is safe when no additional information is required.

Do not early-exit if the task also requires:

- number of ways
- all solutions
- a particular tie-break
- a proof artifact
- a different objective

Optimization requires the termination condition to match the requested output.

---

## 19. Target Bounds

With non-negative values:

```text
sum > target
```

cannot help form a target using only additions.

This enables bounded DP up to `target` rather than the full total sum.

But if values can be negative, this monotonic bound is no longer valid.

Every pruning rule must be justified by the problem's mathematical constraints.

---

## 20. Alternative State: Remaining Target

Top-down DP can define:

```text
solve(i, remaining)
```

with transitions:

```text
solve(i + 1, remaining)
solve(i + 1, remaining - a[i])
```

The state means:

> Can the suffix beginning at `i` form exactly `remaining`?

This connects directly to Lesson 02's state-design framework and Lesson 03's memoization model.

---

## 21. DP as a State DAG

For non-negative 0/1 subset sum, each decision advances the item index:

```text
(i, s)
   ├── exclude → (i+1, s)
   └── include → (i+1, s+x)
```

The index dimension guarantees forward progress.

Memoization computes only reachable states.

Tabulation computes states in dependency order.

The conceptual model is the same; only the evaluation strategy changes.

---

## 22. Complexity

For `n` non-negative items and target `T`:

```text
Time:  O(nT)
Space: O(nT)   full table
Space: O(T)    compressed table
```

This is **pseudo-polynomial**, not polynomial in the bit-length of `T`.

If `T` is represented in binary, its input encoding requires only `O(log T)` bits, while the DP may require `O(T)` states.

Recognizing pseudo-polynomial complexity is an important interview and systems-design distinction.

---

## 23. When DP Is the Wrong Tool

If:

```text
n is small
```

but:

```text
target is enormous
```

`O(nT)` may be impractical.

Alternatives can include:

- meet-in-the-middle
- branch-and-bound
- bitset methods
- mathematical reductions
- sparse reachable-sum tracking

Algorithm choice depends on the relationship between `n`, target magnitude, value distribution, and output requirements.

---

## 24. Correctness Invariant

For compressed 0/1 Boolean DP, after processing the first `i` items:

> `dp[s]` is true exactly when some subset of those `i` items has sum `s`.

During processing item `x`, descending iteration ensures every transition reads `dp[s-x]` from the pre-item logical state.

That is the key invariant behind the one-dimensional optimization.

---

## 25. Differential Testing

For small arrays, build an exhaustive oracle:

```text
enumerate every subset
compute its sum
compare target feasibility
```

Then compare:

```text
brute force
vs
2D DP
vs
1D DP
vs
sparse DP
```

Useful test dimensions:

- empty array
- target zero
- target negative
- one item
- duplicate values
- zeros
- values larger than target
- impossible targets
- multiple solutions
- negative values where supported

---

## 26. Metamorphic Testing

Potential properties for non-negative feasibility include:

- target `0` is always reachable through the empty subset
- adding an item larger than the target cannot change feasibility for positive-only values
- if a target is reachable, removing an item not used by a particular witness preserves that witness
- two implementations with different memory strategies must agree
- permutation of input items must not change the final feasibility result

Be careful: properties must respect the exact semantics. For example, a transformation that preserves feasibility may not preserve the number of distinct subsets.

---

## 27. Adversarial Cases

Explicitly test:

```text
[1, 1, 1, ...]
[0, 0, 0, ...]
large repeated values
one extremely large value
many values near target
negative/positive mixtures
very large target
```

Repeated zeros are particularly useful for exposing counting mistakes because they create many index-distinct subsets without changing the sum.

---

## 28. JavaScript Engineering

For boolean DP:

```js
const dp = new Uint8Array(target + 1);
dp[0] = 1;
```

A typed array can reduce memory overhead compared with an array of boxed Boolean values.

For counts that may exceed `Number.MAX_SAFE_INTEGER`, use `BigInt` consistently:

```js
const dp = Array(target + 1).fill(0n);
```

Never mix `Number` and `BigInt` in arithmetic.

Always validate input bounds before allocating:

```text
untrusted target
→ allocation risk
→ memory exhaustion
```

---

## 29. Backend Engineering Applications

Subset-style DP appears in backend systems when selecting combinations under bounded resources:

- feature/package selection
- resource allocation
- deployment capacity planning
- workload batching
- pricing bundles
- permission/capability combinations
- quota allocation

Production considerations include:

- input-size limits
- CPU budgets
- memory budgets
- request cancellation
- deterministic results
- observability
- fallback strategies when the DP state space is too large

A mathematically valid algorithm still needs an operational safety boundary.

---

## 30. AI Engineering Applications

Subset-style DP can act as an exact constraint engine beneath AI-generated candidates.

Example architecture:

```text
AI proposes candidate items
        ↓
formal constraints
        ↓
subset/knapsack DP
        ↓
validated feasible selection
```

This is useful when a generative model proposes combinations but the final selection must obey exact capacity or target constraints.

The deterministic DP layer provides a verifiable boundary around probabilistic generation.

---

## 31. Interview Derivation Framework

When you see a subset-selection problem:

1. Identify whether each item is 0/1 or reusable.
2. Ask whether the objective is feasibility, count, min, or max.
3. Define the state precisely.
4. Derive include/exclude transitions.
5. Derive base cases.
6. Determine whether the target range is bounded.
7. Start with a 2D reference formulation.
8. Compress only after proving dependency safety.
9. Check loop direction.
10. Analyze pseudo-polynomial complexity.
11. Discuss reconstruction if requested.
12. Test against brute force on small inputs.

The interviewer should hear the reasoning, not only the final code.

---

## 32. Common Failure Modes

### Failure 1 — Using ascending iteration for 0/1 DP

This can reuse the current item multiple times.

### Failure 2 — Treating feasibility as counting

`true` and `number of ways` have different transitions.

### Failure 3 — Ignoring duplicate-item semantics

Equal values do not necessarily mean identical items.

### Failure 4 — Assuming target DP is always efficient

`O(nT)` can be infeasible for large `T`.

### Failure 5 — Using a zero sentinel for unreachable optimization states

Zero may be a legitimate score.

### Failure 6 — Applying non-negative pruning to signed inputs

Negative values invalidate monotonic sum assumptions.

### Failure 7 — Reconstructing from an insufficient compressed state

The value can be correct while the witness is unrecoverable.

---

## 33. Master Pattern

The complete reasoning chain is:

```text
include/exclude recursion
        ↓
repeated (index, sum) states
        ↓
state definition
        ↓
boolean recurrence
        ↓
2D DP reference
        ↓
dependency analysis
        ↓
1D compression
        ↓
descending loop for 0/1 semantics
        ↓
reconstruction / counting when required
        ↓
testing against exhaustive search
```

The central lesson is:

> **DP is not the table. DP is the model of equivalent future states.**

The table is only one implementation of that model.

---

## 34. Revision Checklist

Before leaving this lesson, you should be able to explain without notes:

- Why Subset Sum has overlapping subproblems.
- What `dp[i][s]` means.
- Why `dp[0][0] = true`.
- Why 0/1 compressed DP iterates downward.
- Why ascending order produces reusable-item behavior.
- How Partition Equal Subset Sum reduces to Subset Sum.
- How Target Sum can reduce to subset counting.
- Difference between feasibility and counting.
- How negative values change the state representation.
- Why `O(nT)` is pseudo-polynomial.
- How to reconstruct a witness.
- When sparse DP or meet-in-the-middle is preferable.
- How to prove the compressed transition correct.
- How to test a DP implementation against brute force.

---

## 35. Phase 17 Connection

This lesson builds directly on:

```text
01 — DP fundamentals
02 — State design & recurrence derivation
03 — Memoization
04 — Tabulation
05 — Space optimization
06 — 1D linear DP patterns
07 — 2D grid DP
08 — Subset Sum & Boolean Knapsack
```

The next problems should increasingly force you to recognize the same DP machinery under different problem statements rather than memorize isolated solutions.
