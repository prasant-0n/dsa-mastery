# 16.04 — Combinations, K-Selection & Constraint-Based Search

## 1. Concept Definition

A combination selects elements where **order does not matter**.

For `n` distinct elements choosing exactly `k`:

```text
C(n, k) = n! / (k! (n-k)!)
```

Backtracking generates combinations by maintaining a monotonic `start` index.

## 2. Mental Model

```text
choose i
→ recurse from i + 1
```

Unlike permutations, after choosing an element we never return to an earlier index.

## 3. Core State

Typical state:

```text
start
path
```

Optional state includes:

```text
remaining
currentSum
currentCost
best
```

## 4. Core Template

```text
search(start):
    if path.length === k:
        record path
        return

    for i from start to n - 1:
        path.push(a[i])
        search(i + 1)
        path.pop()
```

The `i + 1` transition prevents reusing an occurrence and guarantees increasing index order.

## 5. Why Order Is Eliminated

The combination `[A,B,C]` has one canonical representation:

```text
A → B → C
```

Permutations such as `[B,A,C]` are not generated because they represent the same selected set.

## 6. Combination Search Tree

The branching factor decreases as the `start` index increases.

At depth `d`, only elements after the last selected index remain eligible.

## 7. Exact K Selection

For exactly `k` elements:

```text
path.length === k
```

is the successful base case.

If fewer than `k` elements remain, the branch is impossible and can be pruned.

## 8. Remaining-Capacity Pruning

At index `start`, if:

```text
n - start < k - path.length
```

there are insufficient elements to complete the combination.

This is always safe for ordinary non-reuse combinations.

## 9. Loop-Bound Optimization

If `need = k - path.length`, the loop only needs indices through:

```text
n - need
```

This avoids entering branches that cannot possibly collect enough elements.

## 10. Combinations vs Permutations

| Property | Combination | Permutation |
|---|---|---|
| Order matters | No | Yes |
| State transition | `i + 1` | choose unused |
| Count | `C(n,k)` | `P(n,k)` |
| Typical state | start/path | path/used |

## 11. Combinations vs Subsets

A subset can have any size.

A `k`-combination has exactly `k` elements.

Therefore all `k`-combinations form one level of the subset search space.

## 12. Combination With Repetition

If values can be reused, the recursion transition changes:

```text
search(i)
```

instead of:

```text
search(i + 1)
```

This models unlimited reuse of the current candidate.

## 13. Bounded Multiplicity

If each value has a limited count, track remaining frequency.

At each step choose a value only while its remaining count is positive.

This generalizes binary selection to bounded integer decisions.

## 14. Duplicate Values

When input values contain duplicates, naive combination generation may emit identical value combinations.

Sorting plus same-depth duplicate skipping is a standard solution.

## 15. Duplicate-Skip Rule

For a sorted array:

```text
if i > start && a[i] === a[i-1]:
    continue
```

This skips equivalent choices at the same recursion depth while still allowing duplicates at deeper levels when the problem permits them.

## 16. Distinct Occurrences vs Distinct Values

Always define whether `[1,2]` and another occurrence of the same values represent different solutions.

Most interview problems asking for unique combinations operate at the value level.

## 17. Target-Sum Combinations

A common variant requires:

```text
sum(path) === target
```

State includes the remaining target or current sum.

## 18. Positive-Number Pruning

For positive candidates:

```text
remainingTarget < 0
```

can safely terminate a branch.

This assumption must be stated explicitly.

## 19. Zero and Negative Values

With zero or negative values, monotonic target pruning may become invalid.

For negative candidates, a sum above the target may later decrease.

Correct pruning requires bounds derived from the actual candidate domain.

## 20. Remaining-Sum Bounds

For sorted nonnegative candidates, precomputed suffix sums can establish whether enough total value remains to reach a target.

Bounds can improve performance but must never remove a feasible completion.

## 21. Minimum/Maximum Completion Bounds

If candidate values are ordered and the number of remaining selections is known, compute safe lower and upper possible sums.

If the target lies outside that interval, prune.

This is a general constraint-propagation pattern.

## 22. K-Selection Under a Budget

Suppose exactly `k` services must be selected under cost budget `B`.

State may include:

```text
start
selectedCount
currentCost
```

Prune when the minimum possible additional cost already exceeds the budget.

## 23. K-Selection Optimization

If exactly `k` items must maximize value, maintain:

```text
currentValue
bestValue
```

and derive an upper bound from the best remaining candidates.

This turns combination enumeration into branch and bound.

## 24. Constraint-Based Combination Search

A combination can be subject to constraints such as:

- incompatibility pairs
- dependency requirements
- capacity
- category limits
- minimum/maximum totals
- coverage requirements

Each candidate is accepted only when the partial state remains extendable.

## 25. Compatibility Constraints

Maintain a compatibility structure:

```text
compatible(selected, candidate)
```

A candidate that conflicts with any selected element can be rejected immediately.

## 26. Dependency Constraints

If selecting `A` requires `B`, the state must account for dependency closure.

Possible approaches include:

- validate dependencies at completion
- propagate required selections immediately
- canonicalize dependency closure

The safest efficient approach depends on the dependency model.

## 27. Category Constraints

Suppose a selection requires:

```text
at most 2 databases
at least 1 cache
exactly 3 services
```

Track category counts in the recursive state.

Prune when a maximum is exceeded or a minimum becomes impossible to satisfy.

## 28. Forward Checking

After each selection, inspect future feasibility.

Example:

```text
remaining slots = 2
required category = database
available databases = 0
```

The branch is immediately impossible.

## 29. Most-Constrained Choice

Ordinary combinations choose the next element by index.

More general constraint systems can choose the next variable with the smallest legal domain.

This MRV idea connects combination search to CSP solving.

## 30. Canonical Search

For unordered selections, enforce a canonical index order.

This prevents exploring equivalent orderings:

```text
A,B,C
B,A,C
C,A,B
```

only the canonical increasing-index path is needed.

## 31. Combination Sum: Reuse Semantics

The difference between:

```text
search(i)
```

and:

```text
search(i + 1)
```

is fundamental.

The first permits reusing the current candidate; the second does not.

## 32. Counting Combinations

If only the count is required, return the number of valid completions instead of storing paths.

This can substantially reduce memory.

Memoization may further reduce repeated states.

## 33. Boolean Existence

For existence:

```text
return exists(include) || exists(exclude)
```

or its combination-search equivalent.

Short-circuit after finding a valid solution.

## 34. Ranking Combinations

Combinations can also be ranked lexicographically or in combinatorial order.

Ranking/unranking can directly address a requested combination without enumerating every earlier combination.

## 35. Mathematical Count

For distinct `n` items and exactly `k` selections:

```text
C(n,k)
```

The identity:

```text
C(n,k) = C(n,n-k)
```

is useful both mathematically and computationally.

## 36. Safe Binomial Arithmetic

Direct factorial computation can overflow ordinary JavaScript `Number` values.

For exact large integer results, use multiplicative formulas with `BigInt`.

Avoid mixing `Number` and `BigInt` in arithmetic without explicit conversion.

## 37. Output Complexity

If every `k`-combination is materialized:

```text
number of results = C(n,k)
```

and explicit element output can require:

```text
O(k · C(n,k))
```

space.

## 38. Time Complexity

Enumeration has at least output-sensitive complexity.

The recursive search itself visits additional internal nodes, while constraint checks add per-node work.

A practical complexity analysis should separate:

```text
nodes visited
constraint cost
output materialization
```

## 39. Backend Applications

K-selection maps naturally to:

- selecting `k` replicas
- choosing a fixed set of services
- selecting deployment targets
- choosing test suites under capacity
- selecting database indexes
- selecting observability signals

Constraints can encode compatibility, cost, availability, and coverage.

## 40. AI Applications

Combination search can model:

- selecting `k` retrieval sources
- choosing evaluation examples
- selecting tools under a token budget
- choosing model ensembles
- feature subset selection
- selecting prompt components

For large candidate pools, greedy, DP, ILP, or approximate methods may replace exhaustive search.

## 41. Exact Search vs Greedy

Combination search preserves alternatives and can find an exact optimum.

Greedy commits to local choices.

When no safe greedy proof exists, constrained backtracking is a useful exact baseline for small instances.

## 42. Exact Search vs Dynamic Programming

If many combinations share the same compressed state, memoization can turn exponential enumeration into a smaller state-space computation.

Subset sum is a classic example.

## 43. Exact Search vs Meet-in-the-Middle

For subset-selection problems with around a few dozen elements, splitting the input into two halves can reduce exhaustive work compared with direct `2^n` enumeration.

Backtracking remains useful as a baseline and as a component of hybrid methods.

## 44. Correctness Invariant

At recursion depth `d`:

> `path` contains exactly `d` selected input occurrences, in strictly increasing index order, and satisfies every constraint enforced so far.

The `start` index ensures no earlier occurrence can be selected later.

## 45. Completeness Proof

Every valid combination has a unique increasing sequence of indices:

```text
i1 < i2 < ... < ik
```

The recursion can select `i1`, then recurse from `i1 + 1`, eventually selecting every subsequent index.

Therefore every valid combination remains reachable unless an invalid pruning rule removes it.

## 46. Common Mistakes

- using permutations when order does not matter
- recursing from `i` when reuse is forbidden
- recursing from `i + 1` when reuse is required
- skipping duplicates at the wrong recursion level
- pruning negative values using positive-only assumptions
- forgetting remaining-capacity bounds
- confusing exactly `k` with at-most `k`
- materializing enormous result sets unnecessarily

## 47. Testing Strategy

For small distinct arrays verify:

```text
count === C(n,k)
```

For duplicates, compare normalized unique combinations.

For constrained search, validate every returned combination and compare small instances against brute force.

## 48. Differential Testing

Compare:

```text
backtracking
vs
bitmask subset filtering
vs
brute-force combinations
```

on small inputs.

Normalize ordering before comparison when result ordering is not part of the contract.

## 49. Property Tests

Useful properties:

- every result has size `k`
- every result respects input multiplicity
- every result is sorted by canonical index/value order when required
- no duplicate value-level result exists when uniqueness is required
- every result satisfies all constraints
- no valid result is missing from small exact instances

## 50. Implementation Lab

Implement:

1. `n choose k`
2. all k-combinations
3. combinations with repetition
4. duplicate-aware combinations
5. combination sum without reuse
6. combination sum with reuse
7. exact target combinations
8. count-only combinations
9. existence-only search
10. k-selection under budget
11. compatibility-constrained selection
12. category-constrained selection
13. dependency-aware selection
14. branch-and-bound k-selection
15. combination ranking/unranking
16. differential test harness

## 51. Interview Framework

Explain:

```text
State:
start + path

Choice:
choose i from start onward

Transition:
recurse(i + 1)

Base:
path.length === k

Pruning:
insufficient remaining capacity / violated constraint

Complexity:
O(C(n,k)) output leaves, plus internal-node and constraint costs
```

Then explicitly explain duplicate and reuse semantics if present.

## 52. Revision Checklist

- [ ] Define combinations mathematically.
- [ ] Explain why order does not matter.
- [ ] Implement `start`-index backtracking.
- [ ] Derive `C(n,k)`.
- [ ] Implement remaining-capacity pruning.
- [ ] Handle duplicate values correctly.
- [ ] Distinguish reuse from non-reuse.
- [ ] Solve target-sum combinations.
- [ ] Handle negative/zero-value boundaries.
- [ ] Add compatibility and category constraints.
- [ ] Understand forward checking and MRV.
- [ ] Build branch-and-bound k-selection.
- [ ] Understand count-only and existence-only variants.
- [ ] Understand ranking/unranking.
- [ ] Use `BigInt` for exact large combinatorial counts.
- [ ] Compare exhaustive search with DP and meet-in-the-middle.
- [ ] Apply k-selection reasoning to Backend and AI systems.

## Key Takeaways

1. Combinations are unordered selections; canonical index ordering eliminates duplicate orderings.
2. `start` is the central state variable for ordinary non-reuse combination search.
3. `i + 1` means no reuse; `i` means the current candidate may be reused.
4. Duplicate handling depends on whether occurrences or values define solution identity.
5. Remaining-capacity and mathematically justified bounds provide safe pruning.
6. Constraints transform simple k-selection into a general constrained search problem.
7. Memoization, meet-in-the-middle, greedy, and DP become alternatives when exhaustive search grows too large.
8. K-selection is directly useful for Backend resource/configuration selection and AI source/tool/evaluation selection.
