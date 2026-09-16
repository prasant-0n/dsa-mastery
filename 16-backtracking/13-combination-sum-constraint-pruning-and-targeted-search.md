# 16.13 — Combination Sum, Constraint Pruning & Targeted Search

## 1. Concept Definition

Combination Sum is a family of backtracking problems where candidates are selected to satisfy a target aggregate, usually a sum. Order normally does not matter, so the search must avoid permutation duplicates.

The important engineering lesson is not the particular target-sum problem; it is how to combine **state modeling, monotonicity, duplicate handling, bounds, and safe pruning**.

## 2. Core State

A typical state contains:

```text
startIndex
currentPath
currentSum
```

For richer variants it may also contain:

```text
remainingBudget
remainingCardinality
frequency state
objective value
```

## 3. Combination Search

For reusable candidates:

```text
choose candidate i
recurse from i
undo
```

For single-use candidates:

```text
choose candidate i
recurse from i + 1
undo
```

This distinction controls whether an item can appear repeatedly.

## 4. Why Start Index Matters

If `[2,3]` and `[3,2]` are considered the same combination, recursion must impose a canonical order on selected indices.

A nondecreasing index sequence eliminates permutation duplicates by construction.

## 5. Target State

The search can track either:

```text
currentSum
```

or:

```text
remainingTarget = target - currentSum
```

The second form often makes pruning conditions easier to express.

## 6. Exact Target Base Case

When `remainingTarget === 0`, a valid combination has been found.

If negative or zero-valued candidates are allowed, reaching the target does not necessarily mean recursion should stop unless the problem explicitly forbids further additions.

## 7. Positive-Candidate Monotonicity

When all reusable candidates are strictly positive and sorted, if:

```text
candidate > remainingTarget
```

then every later candidate is also too large, so the loop can terminate.

This is a safe pruning rule only under the required ordering and positivity assumptions.

## 8. Zero Values

Zero-valued candidates break some termination assumptions for unlimited reuse.

An unrestricted positive-depth recursion could repeatedly select zero without changing the target.

Therefore define a cardinality limit or disallow such inputs when unlimited reuse is modeled.

## 9. Negative Values

Negative candidates destroy simple `currentSum > target` pruning because later choices may reduce the sum.

Bounds must account for both positive and negative contributions.

## 10. Duplicate Candidates

Single-use candidate arrays may contain equal values.

After sorting, skip an equal candidate at the same recursion depth to avoid duplicate value combinations.

Do not skip equal values across deeper levels because different multiplicities can be valid.

## 11. Reusable Duplicates

When repetition is explicitly allowed, identical candidate values should generally be represented once rather than treated as separate reusable identities.

Otherwise the search can produce equivalent branches indefinitely or multiply duplicates unnecessarily.

## 12. Frequency Representation

For bounded multiplicities, convert candidates into `(value, count)` groups.

At each group, choose a multiplicity from `0` through the available count, subject to target and cardinality constraints.

## 13. Cardinality-Constrained Search

For exactly `k` items, track:

```text
chosenCount
```

and prune when the remaining candidate capacity cannot fill the required count.

This is an application of the same remaining-capacity reasoning used in subset generation.

## 14. Sum Bounds

For sorted positive candidates, precompute lower and upper achievable sums for a fixed number of remaining selections.

If the target lies outside these bounds, the state is infeasible.

Bounds must match the reuse model and remaining candidate capacity.

## 15. Minimum Possible Sum

For a single-use sorted candidate list, the minimum sum for `k` additional selections is the sum of the smallest `k` available candidates.

If that minimum already exceeds the remaining target, the branch is impossible under positive candidates.

## 16. Maximum Possible Sum

Likewise, if even the largest possible `k` additional values cannot reach the remaining target, the branch can be pruned.

This is particularly useful for exact-cardinality variants.

## 17. Meet-in-the-Middle Boundary

For subset-style target sums with larger `n`, split candidates into two halves and enumerate each half.

Sort or hash one side, then search for complementary sums.

This reduces the exponent from approximately `n` to `n/2` while requiring additional memory.

## 18. Dynamic Programming Boundary

If the target is moderate and candidates satisfy appropriate assumptions, dynamic programming can compute reachability or counts without enumerating every combination.

Backtracking is preferable when actual combinations must be reconstructed and the search space is sufficiently constrained.

## 19. Counting Instead of Enumeration

If only the number of valid combinations is needed, accumulate counts instead of copying paths.

Use `BigInt` when exact counts may exceed JavaScript's safe integer range.

## 20. Streaming Solutions

A generator or callback can emit combinations one at a time.

This avoids retaining all solutions and is useful when the caller can process results incrementally.

## 21. Objective Optimization

The same framework can optimize:

- minimum number of items
- minimum cost
- maximum utility under a target
- closest sum
- lexicographically smallest valid combination

Use branch-and-bound only when an admissible optimistic bound is available.

## 22. Branch-and-Bound

Maintain an incumbent objective.

At each state calculate an optimistic best possible outcome for the remaining choices.

If that bound cannot improve the incumbent, prune the branch.

## 23. Closest-Sum Search

For closest-sum objectives, a branch should be pruned only when a proven lower bound on achievable error cannot beat the current best error.

A simple target overshoot rule is unsafe when negative values or later corrections are possible.

## 24. Lexicographic Requirements

If the output must be lexicographically smallest, candidate ordering plus early termination can be useful.

But early termination is valid only after proving the traversal order visits feasible solutions in the required ordering.

## 25. Constraint Propagation

Additional constraints can be applied before descending:

```text
budget
cardinality
category quota
compatibility
required items
forbidden pairs
```

The state should carry only the information needed to evaluate future feasibility.

## 26. Forbidden Pairs

If selecting item `A` prohibits item `B`, maintain selected membership and reject `B` immediately after `A` is selected.

For larger compatibility graphs, use adjacency structures for fast conflict checks.

## 27. Dependency Constraints

If selecting an item requires another item, the search must ensure the dependency can still be selected.

Alternatively, model the closure of dependencies before search when that transformation is safe.

## 28. Category Quotas

Maintain per-category counts and remaining capacity.

Prune when a minimum required quota cannot be reached with the candidates remaining.

## 29. Backend Applications

Combination-sum reasoning appears in:

- selecting infrastructure components under a budget
- choosing service bundles
- test-suite subset selection
- resource allocation
- deployment capability bundles
- feature combinations

The production system may use ILP, greedy, DP, or approximation algorithms when the instance is too large for exponential search.

## 30. AI Applications

Applications include:

- retrieval-source selection under token budget
- tool subsets under execution cost
- evaluation-set construction
- prompt-component selection
- experiment-factor selection
- candidate evidence bundles

AI can estimate utility while deterministic search enforces exact budget and compatibility constraints.

## 31. Hybrid AI + Search

```text
AI scores candidates
→ search applies hard constraints
→ branch-and-bound evaluates feasible choices
→ validator checks the final combination
```

Scores should guide ordering or objective values, not silently replace exact constraints.

## 32. Correctness Invariant

At every recursion depth:

> `path` is a valid canonical combination, `currentSum` equals the sum of `path`, and all candidates eligible for future choices begin at or after `startIndex` under the chosen reuse model.

## 33. Duplicate-Suppression Correctness

Same-level duplicate skipping is safe when equal values produce equivalent future states at that level.

It is unsafe to globally remove all duplicate values when multiplicity matters.

## 34. Pruning Correctness

Every pruning rule must answer:

> Can any descendant of this state still produce a valid required solution?

If the answer is definitely no under explicit assumptions, pruning is safe.

If the answer is merely unlikely, it is a heuristic and cannot be used for exact search pruning.

## 35. Complexity

Without strong pruning, combination-sum search can be exponential or infinite for unrestricted reusable non-positive candidates.

For positive candidates and a finite target, depth is bounded by the target divided by the smallest positive candidate.

Actual complexity depends on candidate count, target magnitude, reuse policy, and pruning strength.

## 36. Testing Strategy

Use:

- exhaustive tiny instances
- independent dynamic-programming reachability/count oracles where applicable
- brute-force subset enumeration
- duplicate-heavy cases
- positive/zero/negative boundary cases
- constrained random instances

## 37. Metamorphic Testing

Useful properties:

- reordering input candidates does not change the set of value-combinations
- adding a restrictive constraint cannot increase the number of feasible combinations
- adding an unusable candidate cannot create a solution
- scaling all values and the target by the same positive factor preserves feasibility

The last property applies only when the arithmetic and constraint semantics are scaled consistently.

## 38. Adversarial Cases

Test:

- target `0`
- empty candidates
- duplicate candidates
- all candidates larger than target
- one candidate equal to target
- zero candidate
- negative candidates
- very large target
- impossible cardinality
- tight budget
- deep late failures

## 39. Benchmark Metrics

Track:

- recursion nodes
- candidate attempts
- duplicate branches skipped
- branches pruned
- solutions emitted
- maximum depth
- runtime
- memory

Compare baseline, sorted-pruning, frequency, bounded-search, and branch-and-bound variants.

## 40. Implementation Lab

Implement:

1. reusable positive-candidate Combination Sum
2. single-use Combination Sum
3. duplicate-aware single-use search
4. frequency-map bounded multiplicity
5. exact-cardinality target search
6. target-sum counting
7. streaming enumeration
8. positive-candidate bound pruning
9. min/max achievable-sum pruning
10. negative-value-safe variant
11. forbidden-pair constraints
12. category-quota constraints
13. branch-and-bound optimization
14. meet-in-the-middle target sum
15. DP reachability oracle
16. brute-force differential harness
17. Backend budgeted bundle selector
18. AI retrieval/tool budget selector

## 41. Interview Framework

Explain:

```text
State:
start + path + remainingTarget

Choice:
candidate i

Order:
i or i+1 depending on reuse

Pruning:
monotonicity / bounds / constraints

Duplicate rule:
same-level skip after sorting

Transition:
choose → recurse → undo

Base:
remainingTarget === 0
```

Then explicitly state the assumptions behind each pruning rule.

## 42. Revision Checklist

- [ ] Distinguish reusable and single-use candidates.
- [ ] Use start indices to avoid permutation duplicates.
- [ ] Track `remainingTarget` cleanly.
- [ ] Understand positive-value monotonicity.
- [ ] Handle zero and negative candidates safely.
- [ ] Implement same-level duplicate skipping.
- [ ] Understand frequency-map multiplicities.
- [ ] Add exact-cardinality bounds.
- [ ] Derive min/max achievable-sum pruning.
- [ ] Distinguish exact pruning from heuristic ordering.
- [ ] Understand branch-and-bound for optimization.
- [ ] Know when DP or meet-in-the-middle is a better boundary.
- [ ] Separate enumeration, counting, and streaming.
- [ ] Use independent brute-force/DP oracles.
- [ ] Apply target-constrained selection to Backend and AI systems.

## Key Takeaways

1. Combination Sum is a laboratory for safe constraint pruning.
2. Start-index state prevents permutation duplicates when order is irrelevant.
3. Positive-value monotonicity enables powerful pruning, but zero and negative values change the problem fundamentally.
4. Duplicate handling must preserve valid multiplicities.
5. Bounds should be derived from explicit assumptions and proved safe before being used for exact pruning.
6. Counting, streaming, DP, meet-in-the-middle, and branch-and-bound solve different versions of the same search problem.
7. Backend budget selection and AI retrieval/tool selection are practical constrained-combination applications.
