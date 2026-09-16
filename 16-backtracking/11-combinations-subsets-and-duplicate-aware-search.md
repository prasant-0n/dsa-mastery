# 16.11 — Combinations, Subsets & Duplicate-Aware Search

## 1. Concept Definition

A combination selects elements where order does not matter. A subset is a set of selected elements from a larger set. Backtracking can enumerate both by making an include/exclude or start-index decision at each state.

## 2. Combination vs Permutation

```text
Permutation: [A,B] and [B,A] differ
Combination: [A,B] and [B,A] are the same selection
```

This single distinction changes the recursion tree dramatically.

## 3. Subset State Model

A standard subset state is:

```text
startIndex + currentPath
```

At each index, choose whether to include the current element and continue from the next index.

## 4. Include/Exclude Model

For each element:

```text
include → recurse
exclude → recurse
```

This produces `2^n` subsets for `n` distinct elements.

## 5. Start-Index Combination Model

For combinations of size `k`, choose candidates only from indices after the current one:

```text
for i = start ... n-1:
    choose i
    recurse(i + 1)
    undo
```

Because indices never move backward, the same combination cannot be generated in another order.

## 6. Combination Count

The number of `k`-element combinations from `n` distinct elements is:

```text
C(n,k) = n! / (k!(n-k)!)
```

This is also written as `n choose k`.

## 7. Empty Subset

The power set includes the empty subset.

Therefore the total number of subsets of `n` distinct elements is `2^n`, including the empty selection.

## 8. Fixed-Size Combinations

If exactly `k` elements are required, stop only when the path reaches `k`.

A branch can be pruned when fewer than the required number of candidates remain.

## 9. Remaining-Capacity Pruning

At index `i`, if `n-i < k-path.length`, the branch cannot reach size `k`.

This is a simple but important safe pruning rule.

## 10. Duplicate Values

If input values repeat, naive subset generation treats equal values at different indices as different choices and may emit duplicate value subsets.

Example:

```text
[1,2,2]
```

contains fewer unique value-subsets than `2^3`.

## 11. Sorted Duplicate Skipping

Sort the input first. At one recursion depth, skip a value when it equals the previous candidate.

The previous equal value must be skipped at the **same depth**, not globally.

## 12. Why Same-Level Skipping Works

The first occurrence already represents the branch that chooses that value at the current position.

Starting another sibling branch with the same value would create an equivalent value selection.

Deeper recursion remains allowed because choosing another copy later can produce a different multiplicity.

## 13. Frequency-Map Subsets

A frequency representation can generate each multiplicity from zero through the available count.

For a value with frequency `f`, choose:

```text
0, 1, 2, ..., f
```

copies.

This produces unique multiset subsets directly.

## 14. Multiset Subset Count

If there are `m` distinct values with frequencies `f1...fm`, the number of unique value-subsets is:

```text
(f1 + 1)(f2 + 1)...(fm + 1)
```

This gives an independent oracle for duplicate-aware subset enumeration.

## 15. Combination with Repetition

When choosing `k` items from `n` value types with unlimited repetition, the count is:

```text
C(n + k - 1, k)
```

The recursion allows the same candidate index again rather than advancing to `i + 1`.

## 16. Combination with Limited Repetition

If each value has a finite count, the state must track remaining frequency.

This connects naturally to frequency-map multiset generation.

## 17. Sum-Constrained Subsets

For target-sum problems, maintain:

```text
remainingTarget
```

Prune when the remaining target cannot be reached under known bounds.

The correctness of such pruning depends on the value domain; do not assume positivity unless guaranteed.

## 18. Positive-Number Sum Pruning

If all remaining values are positive and their sorted order is known, exceeding the target can safely terminate a branch.

This optimization is not generally valid when negative values are allowed.

## 19. Meet-in-the-Middle Boundary

For larger subset-sum instances, enumerating all `2^n` subsets may be too expensive.

Meet-in-the-middle splits the input into two halves, enumerates each half, and combines results. This reduces the exponential exponent from `n` to roughly `n/2` at the cost of additional storage.

## 20. Bitmask Subsets

For `n` small enough for a practical bitmask, each subset can be represented by bits:

```text
bit i = 1 → include element i
bit i = 0 → exclude element i
```

Iterating masks from `0` to `2^n - 1` is an iterative alternative to recursion.

## 21. BigInt Bitmasks

JavaScript bitwise operators use 32-bit integer semantics, so ordinary bitwise masks are unsuitable for arbitrarily large `n`.

`BigInt` can represent larger masks, but mixing `Number` and `BigInt` in arithmetic requires explicit conversion.

## 22. Gray-Code Enumeration

Gray-code ordering changes one membership bit at a time between consecutive subsets.

This can reduce incremental-update work when maintaining a subset aggregate.

## 23. Combination Ranking

A combination can be mapped to a rank among all combinations of a fixed size using combinatorial-number-system ideas.

Unranking maps a rank back to a combination.

## 24. Lexicographic Combination Generation

Sorted candidate traversal naturally produces combinations in lexicographic order under the chosen comparator.

An iterative next-combination method can generate the same order without recursive call frames.

## 25. Constraint-Based Combination Search

Combinations become more useful when every candidate has constraints such as:

- maximum total cost
- minimum coverage
- compatibility
- dependency rules
- category quotas
- cardinality limits

The recursive state should contain only information required to test and propagate these constraints.

## 26. Branch-and-Bound

If an objective is being optimized, maintain the best known solution and calculate an optimistic bound for the current branch.

Prune only when the branch cannot beat the incumbent.

This turns basic combination enumeration into optimization search.

## 27. Monotonicity and Safe Pruning

Suppose adding an item can only increase cost. If the current cost already exceeds the budget, no descendant can become feasible.

This monotonicity justifies immediate pruning.

The same reasoning does not apply to arbitrary objectives that can decrease after adding elements.

## 28. Cardinality Constraints

For exactly `k`, at most `k`, or at least `k` selections, track the current cardinality and remaining capacity.

These bounds often provide cheap pruning before expensive constraint evaluation.

## 29. Quotas and Group Constraints

If selections must contain a specified number from each category, maintain group counts in the search state.

Remaining-capacity checks can detect impossible quota satisfaction early.

## 30. Subset Generation for Dynamic Programming

Subset enumeration often appears inside exponential algorithms for:

- partitioning
- subset sum
- knapsack variants
- scheduling subsets
- feature selection

The critical engineering question is whether `2^n` is acceptable for the actual input size.

## 31. Enumeration vs Counting

If only the number of subsets satisfying a property is required, avoid storing every subset.

Return counts or aggregate statistics directly from recursion.

## 32. Streaming

A generator or callback can stream combinations and subsets one at a time.

This keeps working memory near the recursion state instead of `Θ(number of outputs)`.

## 33. Correctness Invariant

For start-index recursion:

> `path` is a valid selection of previously chosen indices in strictly increasing order, and every unconsidered candidate has an index at least `start`.

This prevents permutation duplicates automatically.

## 34. Completeness

Every legal include choice is explored exactly once in the distinct-element model.

For duplicate-aware generation, same-level duplicate suppression removes only branches that represent the same value selection.

## 35. Complexity

Power-set enumeration has `Θ(2^n)` outputs. If each subset is copied and has average size proportional to `n`, total output work can reach `Θ(n2^n)`.

Fixed-size combination enumeration has `C(n,k)` outputs and therefore output-sensitive cost at least proportional to that count.

## 36. Backend Applications

Subset/combination search can support small constrained optimization spaces such as:

- selecting services for a deployment bundle
- feature/capability bundles
- test-suite selection
- failover component combinations
- permission-policy combinations
- cache or replica placement candidates

For large production optimization problems, use scalable optimization, greedy, DP, ILP, or specialized solvers when appropriate.

## 37. AI Applications

Useful applications include:

- retrieval-source subset selection
- tool subset selection
- evaluation-set construction
- feature/subsystem selection
- prompt-component combinations
- experiment-factor combinations

AI can rank candidates, while deterministic search enforces hard constraints.

## 38. Hybrid AI + Subset Search

```text
AI estimates utility
→ deterministic search applies constraints
→ exact validator checks candidates
→ objective selects feasible solution
```

Ranking should not silently discard candidates when completeness is required.

## 39. Testing Strategy

For small `n`, compare against:

- `2^n` subset count
- `C(n,k)` combination count
- multiset count formula
- iterative bitmask enumeration
- independent brute-force index enumeration

For constrained search, compare against exhaustive tiny-instance oracles.

## 40. Metamorphic Testing

Useful properties:

- adding an element cannot reduce the unconstrained power-set count
- adding a restrictive constraint cannot increase the feasible-solution count
- reordering distinct input elements preserves the number of combinations
- relabeling values preserves structural counts

## 41. Adversarial Cases

Test:

- empty input
- `k=0`
- `k=n`
- `k>n`
- all duplicate values
- all distinct values
- negative numbers
- zero values
- tight budgets
- impossible quotas
- target sums near boundaries

## 42. Benchmark Metrics

Track:

- recursion nodes
- candidate attempts
- branches pruned
- duplicate branches skipped
- solutions emitted
- maximum depth
- runtime
- peak memory

Compare recursive, bitmask, frequency-map, and branch-and-bound implementations.

## 43. Implementation Lab

Implement:

1. power-set generator
2. fixed-size combination generator
3. subset counter
4. duplicate-aware subsets
5. frequency-map multiset subsets
6. combinations with repetition
7. bitmask enumeration
8. Gray-code enumeration
9. lexicographic next-combination
10. combination rank/unrank
11. sum-constrained subset search
12. quota-constrained selection
13. budget-constrained branch-and-bound
14. meet-in-the-middle subset search
15. brute-force oracle
16. differential test harness
17. Backend capability-bundle selector
18. AI retrieval/tool subset selector

## 44. Interview Framework

Explain:

```text
State:
start index + current selection

Choice:
choose candidate i

Transition:
append → recurse(i + 1) → pop

Base:
required size / end of candidates

Duplicate rule:
skip equal siblings after sorting

Complexity:
output-sensitive exponential search
```

## 45. Revision Checklist

- [ ] Distinguish combinations from permutations.
- [ ] Generate all subsets with include/exclude recursion.
- [ ] Generate fixed-size combinations with a start index.
- [ ] Derive `2^n` and `C(n,k)` counts.
- [ ] Implement remaining-capacity pruning.
- [ ] Handle duplicate values with same-level skipping.
- [ ] Understand frequency-map multiset generation.
- [ ] Understand combinations with repetition.
- [ ] Understand sum and budget constraints.
- [ ] Use monotonicity only when its assumptions hold.
- [ ] Understand bitmask and BigInt boundaries.
- [ ] Understand Gray-code enumeration.
- [ ] Understand combination ranking/unranking.
- [ ] Separate enumeration from counting.
- [ ] Build brute-force and differential oracles.
- [ ] Apply subset search to Backend and AI selection problems.

## Key Takeaways

1. Combinations and subsets remove permutation symmetry by enforcing an ordering on choices.
2. `2^n` is the fundamental power-set state-space size for `n` distinct elements.
3. Start-index recursion is the core technique for fixed-size combinations.
4. Duplicate-aware search requires same-level deduplication or frequency-state modeling.
5. Safe pruning depends on explicit mathematical assumptions such as remaining capacity and monotonicity.
6. Bitmasks, Gray codes, ranking, and meet-in-the-middle provide important alternatives to basic recursion.
7. Backtracking becomes substantially more useful when combined with constraints and branch-and-bound.
8. Backend capability selection and AI retrieval/tool selection are practical examples of constrained subset search.
