# 14 — Longest Increasing Subsequence & Sequence DP

> **Phase 17 — Dynamic Programming**
>
> LIS is a canonical sequence-DP problem. The deeper lesson is how to model a subsequence by its last decision, prove the recurrence, reconstruct an actual optimal sequence, and then recognize when the naive `O(n²)` DP can be transformed into an `O(n log n)` algorithm.

---

## 1. Subsequence vs Subarray

A **subsequence** preserves relative order but may skip elements.

```text
[3, 1, 5, 2, 6]
```

`[1, 5, 6]` is a subsequence.

A subarray must be contiguous.

This distinction changes the state space completely.

---

## 2. LIS Definition

Given an array `a`, the Longest Increasing Subsequence asks for the maximum length of a subsequence satisfying:

```text
a[i1] < a[i2] < ... < a[ik]
```

The strictness matters.

For non-decreasing subsequences, replace `<` with `<=`.

Always clarify this before coding.

---

## 3. The First Natural State

Define:

```text
dp[i] = length of the longest increasing subsequence ending at i
```

The phrase **ending at `i`** is critical.

It tells us that `a[i]` must be the final element of the subsequence represented by the state.

---

## 4. Deriving the Recurrence

To place `a[i]` after an earlier element `a[j]`, we need:

```text
a[j] < a[i]
```

Therefore:

```text
dp[i] = 1 + max(dp[j])
```

for every:

```text
j < i
and
 a[j] < a[i]
```

If no predecessor exists:

```text
dp[i] = 1
```

The final answer is:

```text
max(dp[i])
```

---

## 5. Why the State Is Sufficient

Once the last selected value is fixed as `a[i]`, the future only needs to know that endpoint and the best subsequence length achievable there.

Every valid predecessor must occur before `i` and have a smaller value.

This is another example of **future equivalence**:

> Different histories that end at the same index can be merged by keeping only the best history.

---

## 6. Dependency Graph Interpretation

Create a directed edge:

```text
a[j] → a[i]
```

when:

```text
j < i && a[j] < a[i]
```

The graph is acyclic because every edge moves forward in index.

LIS is therefore a longest-path problem on this implicit DAG.

The `O(n²)` DP is simply DAG relaxation without explicitly materializing all edges.

---

## 7. Complexity

For every `i`, inspect every earlier `j`.

```text
Time:  O(n²)
Space: O(n)
```

This formulation is often the best starting point because it exposes the recurrence directly.

Do not jump to `O(n log n)` before understanding this state.

---

## 8. Reconstruction

Lengths alone do not produce the subsequence.

Maintain:

```text
parent[i] = predecessor index used to obtain dp[i]
```

When:

```text
dp[j] + 1 > dp[i]
```

update:

```text
parent[i] = j
```

After finding the index with maximum `dp`, follow parents backward and reverse the result.

---

## 9. Tie-Breaking

Multiple LIS answers may exist.

Examples of policies include:

- any valid LIS;
- lexicographically smallest value sequence;
- lexicographically largest value sequence;
- earliest-index LIS;
- latest-index LIS.

A parent update policy must match the requested output semantics.

Never assume that an arbitrary tie is acceptable when the problem specifies one.

---

## 10. Strict vs Non-Decreasing LIS

Strictly increasing:

```text
a[j] < a[i]
```

Non-decreasing:

```text
a[j] <= a[i]
```

The `O(n²)` recurrence changes only in the comparison, but the optimized algorithm changes its binary-search policy as well.

This is a common interview trap.

---

## 11. Example

For:

```text
[10, 9, 2, 5, 3, 7, 101, 18]
```

one LIS is:

```text
[2, 3, 7, 101]
```

with length:

```text
4
```

The important point is not memorizing this result. Derive each `dp[i]` from its valid predecessors.

---

## 12. The `O(n log n)` Transformation

The quadratic DP repeatedly asks:

> Among all valid previous subsequences, what is the best one that can accept this value?

Instead of storing every endpoint state explicitly, maintain a structure called `tails`.

For each subsequence length `k`, store the smallest possible ending value of a subsequence of length `k` found so far.

Smaller tails are better because they leave more room for future values.

---

## 13. What `tails[k]` Means

Using zero-based indexing, a useful invariant is:

```text
tails[k] = minimum possible tail value of an increasing subsequence of length k + 1
```

The array is sorted.

Importantly:

> `tails` is not necessarily itself a subsequence of the input.

It is a compressed summary of possibilities.

This distinction is fundamental.

---

## 14. Processing a Value

For each value `x`, find the first position `p` where:

```text
tails[p] >= x
```

using binary search.

Then replace:

```text
tails[p] = x
```

If no such position exists, append `x`.

The final length of `tails` is the LIS length.

---

## 15. Why Replacement Is Safe

Suppose two increasing subsequences have the same length but tails:

```text
5
```

and:

```text
8
```

The subsequence ending in `5` dominates the one ending in `8` for future extension because every value that can extend `8` can also extend `5`.

Therefore retaining the smaller tail preserves all future possibilities relevant to length.

This is the core dominance argument behind patience sorting.

---

## 16. Binary Search Policy

For strict LIS, use the first index satisfying:

```text
tails[p] >= x
```

This is commonly called **lower_bound**.

For non-decreasing LIS, use the first index satisfying:

```text
tails[p] > x
```

This is commonly called **upper_bound**.

The comparison determines whether duplicates extend the sequence.

---

## 17. Complexity of the Optimized Method

Each input value performs one binary search.

Therefore:

```text
Time:  O(n log n)
Space: O(n)
```

The improvement comes from replacing a scan over all predecessors with a logarithmic search over the ordered dominance summary.

---

## 18. Why `tails.length` Is Correct

The invariant guarantees:

```text
for every k < tails.length
```

there exists an increasing subsequence of length `k + 1`.

And there cannot be a valid increasing subsequence longer than `tails.length`, because such a subsequence would require a further tail position.

Therefore:

```text
answer = tails.length
```

---

## 19. `tails` Does Not Reconstruct Automatically

The optimized length algorithm alone loses the identity of predecessor elements.

For reconstruction, maintain additional arrays such as:

```text
prev[i]
positionForLength[k]
```

When an element occupies position `p`, connect it to the element previously representing length `p`.

This produces an actual LIS while preserving `O(n log n)` asymptotic complexity.

---

## 20. Patience Sorting Connection

The `tails` algorithm is closely related to patience sorting.

Conceptually, place each value onto the leftmost pile whose top is compatible with it.

The number of piles corresponds to the LIS length under the appropriate ordering rule.

The sorting analogy is useful, but the DP interpretation is more important:

```text
compress dominated endpoint states
→ maintain only the best tail per length
→ binary-search the compressed state
```

---

## 21. Sequence Reconstruction as a Separate Layer

Separate:

```text
optimization value
```

from:

```text
witness reconstruction
```

This pattern appears throughout DP.

A production implementation should make clear whether it returns:

```text
length only
```

or:

```text
{ length, sequence, indices }
```

Returning indices is often safer when duplicate values exist.

---

## 22. Counting LIS

Finding the LIS length is not the same as counting how many LIS exist.

A quadratic DP can maintain:

```text
length[i]
count[i]
```

where `count[i]` is the number of maximum-length increasing subsequences ending at `i`.

For a valid predecessor `j`:

- if `length[j] + 1 > length[i]`, replace the best length and copy the count;
- if equal, add the count.

Finally sum counts for endpoints having global maximum length.

Carefully define whether sequences are distinguished by indices or values.

---

## 23. Avoiding Double Counting

When counting LIS, duplicate values can create different index sequences.

For example, repeated values at different indices may produce distinct subsequences under index-based semantics.

A correct solution must specify:

```text
Are two equal value sequences with different indices distinct?
```

This is a combinatorial-definition issue, not merely an implementation detail.

---

## 24. Variants

LIS ideas generalize to:

- longest decreasing subsequence;
- longest non-decreasing subsequence;
- longest non-increasing subsequence;
- maximum-sum increasing subsequence;
- longest bitonic subsequence;
- constrained increasing subsequences;
- LIS on pairs after careful sorting;
- multidimensional dominance chains.

The reusable abstraction is:

> Select an ordered chain under a compatibility relation.

---

## 25. Maximum-Sum Increasing Subsequence

Replace the objective `length` with accumulated value.

Define:

```text
dp[i] = maximum sum of an increasing subsequence ending at i
```

Then:

```text
dp[i] = a[i] + max(dp[j])
```

for valid predecessors.

The optimized LIS `tails` trick does **not** automatically solve every weighted variant.

This is an important warning:

> An optimization for one DP objective is not automatically valid for another objective.

---

## 26. LIS on Pairs

For pairs `(x, y)`, a common pattern is:

1. sort by `x`;
2. choose a tie policy on `x`;
3. run LIS on `y`.

For strict two-dimensional chains, sorting equal `x` values in descending `y` can prevent multiple points with the same `x` from being incorrectly chained.

The exact sort order depends on whether each dimension is strict or non-strict.

---

## 27. Multidimensional Dominance

LIS on pairs is a gateway to a broader pattern:

```text
find the longest chain under coordinate-wise ordering
```

In higher dimensions, simple LIS is no longer sufficient.

Possible tools include:

- Fenwick trees;
- segment trees;
- coordinate compression;
- CDQ divide and conquer;
- offline dominance processing.

The DP principle remains: aggregate the best compatible predecessor state.

---

## 28. Correctness Invariant for Quadratic DP

For every index `i`:

> `dp[i]` equals the maximum length of an increasing subsequence whose final element is exactly `a[i]`.

Induction:

- Base: every singleton `[a[i]]` has length `1`.
- Step: every longer valid sequence ending at `i` has some predecessor `j < i` with `a[j] < a[i]`; by induction, `dp[j]` captures the best sequence ending at `j`.
- Taking the maximum over all valid predecessors therefore gives exactly the optimal value for `i`.

---

## 29. Correctness Invariant for `tails`

For each length `k + 1`, `tails[k]` is the smallest tail value among all increasing subsequences of that length seen so far.

Replacing a tail with a smaller value cannot destroy an existing feasible length because the new tail is at least as extendable as the old one.

Binary search locates the first length whose tail cannot remain strictly below `x`.

This preserves the invariant after every input value.

---

## 30. Testing Strategy

Use multiple independent implementations:

```text
brute force
O(n²) DP
O(n log n) length algorithm
O(n log n) reconstruction
```

For small arrays, compare all results.

Test:

- empty arrays;
- one element;
- strictly increasing;
- strictly decreasing;
- all equal;
- repeated values;
- negative values;
- large values;
- alternating high/low values;
- duplicate-heavy arrays;
- random arrays.

---

## 31. Differential Testing

The quadratic DP is an excellent oracle for the optimized algorithm.

For many small random arrays:

```text
O(n²) LIS length
        ===
O(n log n) LIS length
```

For reconstruction, additionally verify:

```text
isSubsequence(result, input)
result is increasing
result.length === optimalLength
```

This is much stronger than checking a few hand-written examples.

---

## 32. Adversarial Cases

Include cases designed to expose binary-search mistakes:

```text
[2, 2, 2, 2]
[1, 2, 2, 3]
[3, 1, 2, 1, 2, 3]
```

Also test values around replacement boundaries and cases where the optimal subsequence changes endpoint many times.

Most `lower_bound` / `upper_bound` bugs appear on duplicates.

---

## 33. Backend Engineering Applications

LIS-style chain optimization appears in systems problems such as:

- version compatibility chains;
- ordered event progression;
- dependency sequences;
- monotonic metric trend extraction;
- scheduling chains under ordered constraints;
- longest compatible deployment progression.

The production lesson is not “use LIS everywhere.”

It is to identify when records form an ordered compatibility relation and the objective is the longest valid chain.

---

## 34. AI Engineering Applications

Sequence-chain reasoning appears in:

- monotonic feature selection;
- temporal event analysis;
- ordered token constraints;
- ranking consistency analysis;
- trajectory segmentation;
- longest compatible action sequences.

For large pipelines, the same distinction matters:

```text
exact optimal chain
vs
approximate heuristic chain
```

Do not replace an exact DP with a heuristic without measuring the semantic cost.

---

## 35. Interview Derivation Framework

When given an LIS-style problem, ask:

1. Is it a subsequence or contiguous segment?
2. Is the ordering strict or non-strict?
3. What is the endpoint state?
4. What makes a predecessor compatible?
5. What is the objective: length, sum, count, or reconstruction?
6. Does `O(n²)` fit the constraints?
7. If not, can endpoint states be dominated and compressed?
8. Does binary search apply to the resulting invariant?
9. What tie-breaking is required?
10. How will the optimized implementation be verified?

---

## 36. Common Failure Modes

### Failure 1 — Treating LIS as a subarray
Losing valid subsequences by requiring contiguity.

### Failure 2 — Wrong comparison
Using `<=` when strict increase is required.

### Failure 3 — Misreading `tails`
Assuming `tails` itself is always an input subsequence.

### Failure 4 — Incorrect binary search
Using upper bound for strict LIS or lower bound for non-decreasing LIS.

### Failure 5 — Reconstruction bugs
Returning values that are not actually connected by predecessor indices.

### Failure 6 — Applying `tails` to weighted objectives
The standard compressed invariant is designed for length, not arbitrary weighted scores.

---

## 37. Master Pattern

The evolution is:

```text
Brute force
    ↓
Enumerate predecessor choices
    ↓
Endpoint DP: dp[i]
    ↓
Recognize dominance between equal-length endpoints
    ↓
Compress states into tails
    ↓
Maintain ordered invariant
    ↓
Binary search
    ↓
O(n log n)
```

This is a major DP mastery pattern:

> Start with the explicit recurrence, then ask whether states with the same future potential can be dominated and compressed.

---

## 38. Revision Checklist

You should be able to derive without memorizing:

- LIS `O(n²)` recurrence;
- endpoint-state invariant;
- parent reconstruction;
- strict vs non-strict semantics;
- `tails` invariant;
- lower bound vs upper bound;
- `O(n log n)` proof intuition;
- reconstruction with `prev` and positions;
- counting LIS;
- maximum-sum increasing subsequence;
- pair/dominance transformation;
- why standard `tails` does not solve arbitrary weighted LIS;
- brute-force differential testing;
- adversarial duplicate testing.

---

## 39. Final Principle

LIS is valuable because it demonstrates a progression that appears repeatedly in advanced algorithms:

```text
obvious DP
→ identify state meaning
→ identify dominance
→ compress equivalent states
→ maintain a stronger invariant
→ accelerate transitions
```

The real skill is not memorizing the patience-sorting template.

The real skill is recognizing **why the compressed state preserves the answer**.
