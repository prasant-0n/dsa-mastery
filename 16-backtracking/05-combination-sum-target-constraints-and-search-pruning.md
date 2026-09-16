# 16.05 — Combination Sum, Target Constraints & Search Pruning

## 1. Concept Definition

Combination Sum problems ask us to choose candidates whose aggregate value satisfies a target or constraint. Unlike ordinary `k`-selection, the number of selected elements may be variable, and some variants allow candidate reuse.

The central challenge is not recursion itself. It is defining **state, reuse semantics, safe bounds, and pruning conditions** correctly.

## 2. Canonical State

A typical state contains:

```text
startIndex
path
remainingTarget
```

Optional state:

```text
currentCost
remainingSlots
bestSolution
remainingSum
```

## 3. Core Search Model

For sorted positive candidates:

```text
search(start, remaining):
    if remaining === 0:
        record solution
        return

    for i from start:
        if candidate[i] > remaining:
            break

        choose candidate[i]
        search(i, remaining - candidate[i])
        undo choice
```

The recursive index `i` permits reuse.

## 4. No-Reuse Variant

If every candidate occurrence may be used at most once:

```text
search(i + 1, remaining - candidate[i])
```

The distinction between `i` and `i + 1` defines the problem's selection semantics.

## 5. Exact Target

A solution is complete when:

```text
remainingTarget === 0
```

Do not accept merely because the current sum crosses the target unless the problem explicitly asks for threshold coverage.

## 6. Positive Candidates

With strictly positive candidates, the remaining target decreases monotonically.

Therefore:

```text
remainingTarget < 0
```

is a safe failure condition.

## 7. Sorted-Candidate Pruning

When candidates are sorted ascending and positive:

```text
candidate[i] > remainingTarget
```

means every later candidate is also too large.

The loop can safely `break`.

## 8. Zero Candidates

Zero creates a special case for reusable combination search.

Repeatedly selecting zero does not reduce the target and can create infinite recursion.

Handle zero explicitly or disallow unlimited zero reuse according to the problem contract.

## 9. Negative Candidates

Negative values destroy monotonicity.

A positive remaining target may later be increased or decreased through negative selections.

Therefore positive-only pruning rules cannot be reused blindly.

## 10. Mixed-Sign Search

For mixed values, derive explicit lower and upper reachable bounds or impose a finite selection constraint.

Without a bound on repetitions or depth, some reusable mixed-sign formulations can have an infinite search space.

## 11. Duplicate Candidates

If duplicate values represent equivalent choices, sort first and skip equal candidates at the same recursion depth.

```text
if i > start && candidates[i] === candidates[i-1]:
    continue
```

This avoids duplicate value-level solutions.

## 12. Duplicate Occurrences

If duplicate occurrences are semantically distinct, same-depth skipping may be incorrect.

Always define solution identity before adding deduplication.

## 13. Combination Sum II Pattern

A common no-reuse formulation uses:

```text
sorted candidates
+ start index
+ i + 1 transition
+ same-depth duplicate skipping
+ target pruning
```

This combination of techniques is highly reusable.

## 14. Combination Sum III Pattern

If exactly `k` numbers must be selected, track both:

```text
remainingSlots
remainingTarget
```

Now pruning can use both cardinality and numeric bounds.

## 15. Minimum Completion Bound

If `need` values remain and candidates are sorted nonnegative values, the smallest possible completion can be computed from the smallest available candidates.

If even this minimum exceeds the target, prune.

## 16. Maximum Completion Bound

Similarly, compute the largest possible sum from the remaining candidates.

If the target exceeds this maximum, the branch cannot succeed.

## 17. Bound Safety

A pruning bound is correct only if it is a proven bound on all possible completions under the current state.

A fast but incorrect bound is worse than no bound because it silently deletes valid solutions.

## 18. Prefix/Suffix Precomputation

Sorted candidates can use prefix or suffix sums to obtain aggregate bounds efficiently.

For fixed-cardinality selection, additional range-sum structures can reduce repeated work.

## 19. Cardinality-Aware Bounds

Suppose exactly `k` selections remain.

Calculate:

```text
minimum achievable sum with k remaining choices
maximum achievable sum with k remaining choices
```

Then prune if the target lies outside that interval.

## 20. Budget Constraints

Replace target sum with a cost budget:

```text
currentCost <= budget
```

For positive costs, exceeding the budget is immediately fatal.

## 21. At-Least Target

For a threshold problem:

```text
sum >= target
```

crossing the threshold can terminate successfully.

This is fundamentally different from exact target matching.

## 22. Closest Target

For minimizing:

```text
|sum - target|
```

maintain the best distance found so far.

Safe pruning requires a bound on the closest possible completion, not merely whether the current sum exceeds the target.

## 23. Minimum Number of Elements

To minimize the number of selected candidates while reaching a target, maintain:

```text
depth
bestDepth
```

and derive lower bounds on the number of additional elements required.

## 24. Maximum Value Under Target

For optimization under a capacity/target constraint, maintain:

```text
currentValue
bestValue
```

and compute an admissible upper bound on future value.

This is branch and bound.

## 25. Branch Ordering

When optimization is involved, exploring promising candidates first can find a strong incumbent earlier.

A stronger incumbent can cause more branches to be pruned.

Search order affects runtime but not correctness when pruning remains safe.

## 26. Density Heuristics

For value/cost problems, a useful ordering heuristic is:

```text
value / cost
```

This is a heuristic for search order unless a separate proof establishes optimality.

Do not confuse a useful ordering heuristic with a greedy correctness theorem.

## 27. Branch and Bound

Maintain:

```text
bestSolution
bestObjective
upperBound(state)
```

For maximization:

```text
if upperBound(state) <= bestObjective:
    prune
```

For minimization, use a valid lower bound instead.

## 28. Fractional Relaxation Bound

A powerful optimization bound can relax discrete choices into fractional choices.

For example, fractional knapsack can provide an upper bound for a 0/1 value-maximization branch.

Because the relaxed problem is at least as permissive, its optimum can safely upper-bound the discrete branch.

## 29. Memoization

If only existence/counting/optimization value is required, many states may repeat.

A reusable state such as:

```text
(index, remainingTarget)
```

can be memoized.

Full path enumeration generally requires more information and does not always benefit from simple memoization.

## 30. Counting Combination Sums

Instead of storing paths:

```text
count(state) = sum(count(child))
```

A memoized count can transform repeated recursive subproblems into a DP-style solution.

## 31. Existence Search

For a yes/no question:

```text
return child1 || child2 || ...
```

Stop immediately after finding one valid completion.

## 32. Enumeration vs Counting

Enumeration has output-size cost.

Counting can use compact state and memoization.

Choosing the wrong output model can dominate memory usage even when the recursive logic is correct.

## 33. Iterative Deepening

If minimizing number of selections, iterative deepening can search depth limits:

```text
1 choice
2 choices
3 choices
...
```

until a solution is found.

This is useful when the objective is minimum depth and the branching structure is manageable.

## 34. Meet-in-the-Middle Boundary

For 0/1 subset-target problems with moderate `n`, split candidates into two halves, enumerate their sums, and combine them.

This can outperform direct backtracking when pruning is weak.

## 35. Dynamic Programming Boundary

When values and target are bounded integers, subset-sum/knapsack DP may compress the exponential selection space into a pseudo-polynomial state space.

The correct method depends on whether the problem asks for enumeration, existence, counting, or optimization.

## 36. Bitset DP Connection

For integer target problems, bitsets can represent reachable sums compactly.

This is especially useful when the target range is moderate and only reachability is required.

## 37. Backend Applications

Combination-sum reasoning appears in:

- capacity-aware service selection
- selecting infrastructure components under cost limits
- dependency-compatible feature bundles
- test suites reaching a required coverage target
- log/metric selection under cardinality budgets
- cache or storage allocation

## 38. AI Applications

Applications include:

- selecting retrieval sources under token budget
- choosing tool combinations under cost/latency constraints
- selecting evaluation examples reaching coverage targets
- prompt-component selection
- model ensemble selection
- candidate evidence combinations

## 39. Constraint Propagation

Before descending, update constraints that future choices must satisfy.

Examples:

```text
remaining slots
remaining budget
remaining required coverage
remaining category quotas
```

Early detection of impossible states reduces search substantially.

## 40. Forward Feasibility

A strong generic question at every node is:

> Can any legal completion still satisfy all constraints?

This is more powerful than checking only whether the current state is valid.

## 41. Correctness Invariant

At every recursive call:

> `path` represents a legal selection of candidates from the allowed index range, and `remainingTarget` equals the original target minus the exact contribution of `path`.

Apply/undo operations must preserve this invariant.

## 42. Completeness

For non-reuse combinations, every valid solution has a unique increasing index sequence.

For reuse-enabled search, every valid multiset selection corresponds to a nondecreasing sequence of candidate indices.

The recursion must preserve the appropriate canonical order.

## 43. Proof of Positive-Target Pruning

With positive candidates, every future addition is nonnegative.

Therefore once:

```text
remainingTarget < 0
```

an exact target can never be recovered.

If candidates are sorted, once `candidate[i] > remainingTarget`, all later candidates are also too large.

## 44. Testing Strategy

Test:

- empty candidates
- target zero
- target unreachable
- duplicate values
- zero candidate
- negative candidate
- reusable candidates
- non-reusable candidates
- exact target
- at-least target
- fixed `k`
- large target
- highly prunable input
- almost-no-pruning input

## 45. Brute-Force Oracle

For small instances, enumerate every legal selection without pruning.

Use it as an oracle to compare optimized search results.

This catches incorrect pruning much more effectively than testing only expected examples.

## 46. Adversarial Cases

Construct inputs where:

- the first valid solution is deep
- many branches nearly reach the target
- duplicates are frequent
- bounds are weak
- bounds are extremely strong
- the target is impossible by one unit

These expose pruning and state-restoration bugs.

## 47. Differential Testing

Compare:

```text
naive backtracking
vs
pruned backtracking
vs
DP / bitset oracle where applicable
```

Normalize solution ordering before comparison.

## 48. Complexity

Without strong pruning, reusable positive combination search can have exponential growth in the target/candidate dimensions.

For no-reuse candidates, the raw search is bounded by the subset search space.

Always state the actual input assumptions before giving a simplified Big-O expression.

## 49. Memory Complexity

Recursive auxiliary state is usually proportional to maximum depth.

Enumeration adds output storage.

Memoization adds state-table memory.

Therefore distinguish:

```text
auxiliary recursion space
memoization space
output space
```

## 50. Implementation Lab

Implement:

1. combination sum with reuse
2. combination sum without reuse
3. unique combination sum with duplicates
4. fixed-k target sum
5. target sum with positive candidates
6. target sum with zero handling
7. bounded-multiplicity target sum
8. mixed-sign target search with finite depth
9. minimum-element target search
10. closest-target search
11. maximum-value-under-budget search
12. branch-and-bound with admissible bounds
13. memoized existence
14. memoized counting
15. bitset/DP comparison
16. brute-force differential oracle
17. adversarial pruning test suite

## 51. Interview Framework

Answer in this order:

```text
1. Is reuse allowed?
2. Are duplicates meaningful?
3. Is the target exact, at-least, or optimization?
4. What is the state?
5. What is the canonical next index?
6. What pruning assumptions are valid?
7. What is the base case?
8. What is the invariant?
9. What is the complexity under the stated constraints?
```

## 52. Revision Checklist

- [ ] Explain combination-sum state.
- [ ] Distinguish reuse and non-reuse.
- [ ] Handle duplicate candidates.
- [ ] Handle zero safely.
- [ ] Explain why negative values change pruning.
- [ ] Implement target pruning for positive values.
- [ ] Derive cardinality-aware bounds.
- [ ] Implement budget/capacity pruning.
- [ ] Understand branch and bound.
- [ ] Use fractional relaxation as an optimization bound where valid.
- [ ] Distinguish enumeration, counting, existence, and optimization.
- [ ] Understand memoization boundaries.
- [ ] Compare backtracking with DP and meet-in-the-middle.
- [ ] Build a brute-force oracle.
- [ ] Test adversarial pruning cases.
- [ ] Apply the pattern to Backend and AI resource selection.

## Key Takeaways

1. Combination Sum is a family of problems, not one algorithm.
2. Reuse semantics are encoded directly by the recursive index transition.
3. Sorting enables powerful pruning only when candidate-domain assumptions justify it.
4. Zero and negative values require special reasoning.
5. Every pruning rule needs a proof of safety.
6. Cardinality, cost, value, and target bounds can be combined into constraint propagation.
7. Branch and bound turns exact search into optimization search by comparing admissible bounds with the incumbent.
8. Memoization and DP become attractive when the same compressed state repeats.
9. Brute-force differential testing is essential for validating aggressive pruning.
10. The same reasoning applies to Backend capacity/configuration selection and AI source/tool/evidence selection.
