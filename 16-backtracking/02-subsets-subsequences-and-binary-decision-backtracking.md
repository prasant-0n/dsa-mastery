# 16.02 — Subsets, Subsequences & Binary Decision Backtracking

## 1. Concept Definition

Many backtracking problems begin with a binary decision for each element:

```text
include it
or
exclude it
```

This creates a binary search tree and naturally generates subsets and subsequences.

## 2. Core Mental Model

For an array `a` of length `n`, at index `i`:

```text
                    state(i)
                   /        \
              exclude       include
                 /              \
             state(i+1)      state(i+1)
```

Every root-to-leaf path corresponds to one subset decision vector.

## 3. Why Binary Decisions Matter

The include/exclude model is the simplest reusable backtracking pattern.

It appears in:

- subsets
- subsequences
- subset sum
- target selection
- feature selection
- configuration search
- combinatorial optimization

## 4. Decision Vector

Each element receives a binary variable:

```text
x[i] ∈ {0, 1}
```

The complete solution is a binary vector of length `n`.

Therefore there are exactly:

```text
2^n
```

possible subsets of `n` distinct elements.

## 5. Recursive State

A typical state contains:

```text
index
path
```

For optimization problems it may additionally contain:

```text
currentSum
currentValue
remainingCapacity
bestSolution
```

## 6. Basic Subset Template

```text
search(i):
    if i === n:
        record path
        return

    search(i + 1)          // exclude

    path.push(a[i])
    search(i + 1)          // include
    path.pop()
```

The final `pop()` restores the state for sibling branches.

## 7. Order of Branches

You may explore exclude-first or include-first.

For complete enumeration, both eventually produce the same set of solutions.

For first-solution or optimization search, ordering can affect runtime.

## 8. Empty Subset

The empty subset is always part of the power set.

A correct enumeration must therefore record the state where no element has been selected.

## 9. Power Set

The power set is the set of all subsets.

For `n` distinct elements:

```text
number of subsets = 2^n
```

Any algorithm that explicitly returns every subset requires at least `Ω(n · 2^n)` output work if each subset is materialized.

## 10. Subsequences

A subsequence preserves relative order but does not require contiguous elements.

For:

```text
[1, 2, 3]
```

examples include:

```text
[]
[1]
[2]
[1,3]
[1,2,3]
```

The include/exclude recursion naturally preserves order.

## 11. Subarray vs Subsequence

A subarray must be contiguous.

A subsequence may skip elements while preserving order.

Confusing these definitions leads to incorrect search spaces.

## 12. Subset vs Subsequence

For an array of unique values, subset and subsequence may contain the same combinations of values but have different semantic meaning.

A subset ignores order.

A subsequence preserves original order.

## 13. Duplicate Elements

If the input contains duplicates, binary include/exclude recursion can produce duplicate value sequences.

Example:

```text
[1, 2, 2]
```

requires additional duplicate handling when unique value combinations are required.

## 14. Duplicate-Aware Strategy

A common technique is:

```text
sort input
→ at a recursion depth, skip equal values after the first choice
```

This prevents equivalent branches from generating duplicate solutions.

## 15. Reuse vs Non-Reuse

Always define whether an element can be selected more than once.

```text
0/1 selection → each input occurrence used at most once
unbounded selection → candidate may be reused
```

The recursion transition changes accordingly.

## 16. Combination Sum Pattern

For reusable candidates:

```text
choose i
→ recurse from i
```

For non-reusable candidates:

```text
choose i
→ recurse from i + 1
```

This tiny index difference encodes a major semantic distinction.

## 17. Subset Sum

Given numbers and a target, search for a subset whose sum equals the target.

State can include:

```text
index
currentSum
path
```

## 18. Early Termination

If all numbers are nonnegative and:

```text
currentSum > target
```

the branch may be pruned.

This pruning is invalid when negative numbers can later reduce the sum.

## 19. Remaining-Sum Bound

For nonnegative inputs, calculate the sum of all remaining candidates.

If:

```text
currentSum + remainingSum < target
```

the target cannot be reached.

This is a safe upper-bound pruning rule under the stated assumptions.

## 20. Negative Numbers

Negative values invalidate many monotonic sum assumptions.

For example:

```text
currentSum > target
```

does not necessarily imply failure.

Pruning rules must be derived from the actual input domain.

## 21. Exact Target vs At-Least Target

These are different objectives.

```text
sum === target
```

is exact matching.

```text
sum >= target
```

is threshold matching.

The stopping and pruning rules must reflect the objective.

## 22. Counting Instead of Enumerating

If only the number of valid subsets is required, do not materialize every subset.

A recursion can return counts:

```text
count(i) = count(exclude) + count(include)
```

This reduces output memory but may still have exponential time without memoization.

## 23. Boolean Existence Search

If only existence matters:

```text
exists(i) = exists(exclude) || exists(include)
```

Short-circuiting can stop as soon as one valid solution is found.

## 24. Optimization Search

For maximum/minimum subset objectives, carry the current score and best known solution.

Safe upper or lower bounds can prune branches that cannot improve the incumbent.

## 25. Memoization Boundary

If many branches reach the same state, memoization can avoid recomputation.

For subset-sum-style problems, a state may be:

```text
(index, remainingTarget)
```

This creates the bridge between backtracking and dynamic programming.

## 26. Bitmask Representation

A subset can be represented by an integer mask:

```text
bit i = 1 → include item i
bit i = 0 → exclude item i
```

For `n` items, masks range from:

```text
0 ... 2^n - 1
```

## 27. JavaScript Bitmask Limits

JavaScript bitwise operators operate on signed 32-bit integers.

Therefore ordinary bitwise masks are convenient only for relatively small `n`.

`BigInt` can represent larger integer masks, but mixing `Number` and `BigInt` requires care.

## 28. Recursive vs Bitmask Enumeration

Recursive generation emphasizes the decision process.

Bitmask enumeration emphasizes compact representation.

Both enumerate the same power set under appropriate conditions.

## 29. Lexicographic Enumeration

If a predictable ordering is required, candidate order and recursion order must be controlled explicitly.

Do not assume JavaScript object or hash iteration semantics provide the desired mathematical ordering.

## 30. Gray-Code Connection

Gray-code enumeration changes only one bit between consecutive subset masks.

This can be useful when incremental updates are possible:

```text
newSubset = oldSubset ± one element
```

It is an important bridge between combinatorial enumeration and incremental computation.

## 31. Incremental Aggregates

Instead of recomputing a subset's sum from scratch, maintain:

```text
currentSum
```

and update it on include/undo.

This reduces per-node work.

## 32. Path Mutation Cost

Using:

```text
path.push(x)
...
path.pop()
```

avoids allocating a new array at every node.

However, storing every final solution still requires output memory proportional to the returned data.

## 33. Structural Sharing

Persistent data structures can avoid destructive mutation but may introduce allocation and garbage-collection overhead.

Choose based on correctness, workload size, and runtime characteristics.

## 34. Backend Configuration Search

Suppose a service has optional features:

```text
cache
compression
replica
logging
tracing
```

Each feature can initially be modeled as include/exclude.

Constraints can reject incompatible combinations.

This is a direct Backend application of binary backtracking.

## 35. Backend Test Selection

A test suite can be modeled as a subset of candidate tests.

The search can optimize:

```text
maximum coverage
under time budget
```

For large instances, greedy or optimization techniques may replace exact backtracking.

## 36. AI Feature/Source Selection

Candidate data sources, tools, or evaluation cases can be selected through binary decisions.

Constraints may include:

- token budget
- latency
- cost
- source compatibility
- required coverage

## 37. AI Retrieval Selection

For small candidate pools, exact subset search can find a combination satisfying a target relevance/diversity objective.

For production-scale retrieval, exhaustive search is generally too expensive, so approximate methods are often needed.

## 38. Complexity

A complete binary decision tree has:

```text
2^n leaves
```

and:

```text
2^(n+1) - 1
```

nodes in a full binary tree of depth `n`.

Additional work per node determines the final runtime.

## 39. Output Complexity

If all subsets are materialized, output size dominates.

There are `2^n` subsets and each can contain up to `n` elements.

Thus the explicit output itself can require `O(n · 2^n)` element storage in the worst case.

## 40. Space Complexity

For recursive enumeration without storing results:

```text
O(n)
```

for recursion/path state, excluding the input.

If all results are stored:

```text
O(n · 2^n)
```

worst-case output space.

## 41. Correctness Invariant

At recursion depth `i`:

> `path` contains exactly the selected elements among indices `[0, i)` according to the decisions made on the current root-to-node path.

The invariant must be restored after every recursive return.

## 42. Completeness Proof

Every item has exactly two choices:

```text
exclude
include
```

Therefore every binary selection vector is represented by exactly one root-to-leaf path when inputs are distinct and branches are not incorrectly pruned.

## 43. Duplicate Completeness

When duplicates are present, duplicate-aware skipping removes equivalent branches rather than unique value combinations.

The proof must distinguish occurrences from value-level solutions.

## 44. Common Mistakes

- forgetting the empty subset
- missing `pop()` after include
- using `i` instead of `i + 1` when reuse is forbidden
- incorrectly pruning negative values
- generating duplicate solutions
- confusing subsequence with substring/subarray
- storing enormous output without considering memory
- mixing `Number` and `BigInt`

## 45. Testing Strategy

Test:

- empty input
- one element
- duplicate values
- negative values
- zero values
- target zero
- unreachable target
- very large output
- reuse vs non-reuse
- first-solution vs all-solutions behavior

For small inputs, compare recursive enumeration with bitmask enumeration.

## 46. Differential Testing

For `n` small enough:

```text
recursive subsets
vs
bitmask subsets
```

Normalize representations and compare the resulting sets.

This is a strong correctness check.

## 47. Property Tests

Useful properties include:

```text
number of unique subsets = 2^n   // distinct input values
empty subset exists
no subset contains an invalid element
subsequence preserves input order
```

Additional properties depend on the problem objective.

## 48. Implementation Lab

Implement from scratch:

1. all subsets
2. all subsequences
3. subset sum existence
4. subset sum enumeration
5. subset sum counting
6. combination sum without reuse
7. combination sum with reuse
8. duplicate-aware subset generation
9. maximum subset value under a constraint
10. bitmask enumeration
11. Gray-code subset enumeration
12. exact configuration search
13. differential test harness

## 49. Interview Framework

Explain binary backtracking as:

```text
At each index:
→ exclude
→ include
→ recurse
→ undo include
```

Then state:

```text
state
base case
pruning
invariant
complexity
```

## 50. Revision Checklist

- [ ] Explain the binary decision tree.
- [ ] Derive `2^n` subset count.
- [ ] Implement include/exclude recursion.
- [ ] Explain why `pop()` is required.
- [ ] Generate subsets and subsequences.
- [ ] Distinguish subsets, subarrays, substrings, and subsequences.
- [ ] Handle duplicate values.
- [ ] Handle reuse vs non-reuse.
- [ ] Implement subset-sum search.
- [ ] Derive safe pruning conditions.
- [ ] Understand negative-number boundaries.
- [ ] Count/existence/optimization variants.
- [ ] Understand memoization boundaries.
- [ ] Implement bitmask enumeration.
- [ ] Understand JavaScript bitwise and BigInt limits.
- [ ] Understand output-space complexity.
- [ ] Prove completeness and restoration invariants.
- [ ] Apply binary search-space reasoning to Backend and AI systems.

## Key Takeaways

1. Include/exclude recursion is the foundational binary backtracking pattern.
2. Every distinct binary decision vector corresponds to one subset.
3. `2^n` is the natural search-space size for `n` independent binary choices.
4. Correct apply/undo behavior preserves the search invariant.
5. Pruning is valid only when its assumptions are mathematically justified.
6. Counting or existence problems can avoid materializing the full power set.
7. Repeated states create an opportunity for memoization and DP.
8. Bitmasks provide a compact alternative representation for small candidate sets.
9. The same binary decision model appears in Backend configuration and AI selection problems.
