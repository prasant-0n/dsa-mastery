# 16.03 — Permutations & Ordering-Based Backtracking

## 1. Concept Definition

Permutation backtracking constructs arrangements where **order matters**.

For `n` distinct elements, the number of permutations is:

```text
n! = n × (n-1) × ... × 1
```

Unlike subset generation, each level chooses one currently unused element.

## 2. Mental Model

```text
                 []
          /       |       \
        [A]      [B]      [C]
       /   \     / \     /   \
    [A,B] [A,C] ... ... ...
```

At depth `k`, exactly `k` positions have been assigned.

## 3. State Model

Typical state:

```text
path
used
```

where `used[i]` indicates whether the input element at index `i` is already in the current permutation.

## 4. Core Template

```text
search():
    if path.length === n:
        record path
        return

    for each unused element:
        mark used
        path.push(element)
        search()
        path.pop()
        unmark used
```

## 5. Why `used` Is Required

A permutation contains every selected occurrence at most once.

Without tracking usage, the same input occurrence could be selected repeatedly.

## 6. Complexity

There are `n!` complete permutations.

If every permutation is materialized, output work is at least:

```text
Ω(n · n!)
```

because every result contains `n` elements.

## 7. Recursion Tree Size

The number of nodes is:

```text
1 + n + n(n-1) + ... + n!
```

which is `O(n!)` for growing `n`.

## 8. In-Place Swap Technique

Instead of maintaining `used[]`, another technique fixes one position by swapping candidates into it:

```text
swap(i, j)
→ recurse(i + 1)
→ swap(i, j) // undo
```

This reduces auxiliary state.

## 9. Used Array vs Swapping

`used[]` is often easier to reason about.

In-place swapping can reduce auxiliary memory and is useful when the input itself may be mutated temporarily.

The swap must always be undone.

## 10. Permutation Invariant

At recursion depth `k`:

> `path` contains exactly `k` distinct input occurrences and preserves the choices made on the current root-to-node path.

## 11. Base Case

When:

```text
path.length === n
```

the arrangement is complete and can be emitted or evaluated.

## 12. First Valid Permutation

If only one valid arrangement is needed, return immediately after finding it.

Candidate ordering can influence practical runtime.

## 13. All Permutations

For enumeration, continue after every completed permutation.

The search must visit every valid ordering unless symmetry or duplicate rules intentionally eliminate equivalent results.

## 14. Duplicate Values

If the input contains equal values, ordinary permutation generation can produce duplicate value sequences.

Example:

```text
[A, A, B]
```

has fewer unique value permutations than `3!`.

## 15. Duplicate-Aware Permutations

A common strategy is:

```text
sort input
→ at each depth skip an equal value if its equivalent occurrence has not been selected earlier at that depth
```

This avoids generating identical value-level permutations.

## 16. Occurrence vs Value Identity

Two equal values can still represent different input occurrences.

The implementation must explicitly decide whether the output distinguishes occurrences or only values.

## 17. Frequency-Map Technique

For unique value permutations with duplicates, store counts:

```text
value → remaining count
```

At each level, choose a value whose remaining count is positive, decrement, recurse, then restore.

This avoids duplicate branches naturally.

## 18. Lexicographic Permutations

If input is sorted and candidates are explored in ascending order, duplicate-aware generation can produce permutations in lexicographic order.

Ordering must be explicit if it is part of the required output contract.

## 19. Next Permutation

Not every permutation problem requires backtracking.

If the requirement is to generate permutations in lexicographic sequence iteratively, the next-permutation algorithm can generate the next arrangement in `O(n)` time per step and `O(1)` auxiliary space.

## 20. Backtracking vs Next Permutation

Use backtracking when:

- constraints prune branches
- only selected permutations are needed
- arbitrary construction logic is required

Use next permutation when:

- permutations are needed in lexicographic order
- every permutation is required
- the sequence can be generated iteratively

## 21. Constraint-Aware Permutations

Many real problems do not require every permutation.

At each position, reject candidates that violate constraints.

Examples:

- adjacent elements cannot be equal
- two tasks cannot be consecutive
- forbidden pairs
- position-specific restrictions

## 22. Adjacent Constraint Example

If adjacent values must differ:

```text
if path.length > 0 && candidate === path[path.length - 1]:
    skip
```

This is safe because the constraint is already violated by the new local edge.

## 23. Position Constraints

A candidate may be valid only at certain positions.

Represent the constraint explicitly:

```text
isAllowed(position, candidate)
```

and filter before recursion.

## 24. Pairwise Constraints

If candidate `x` cannot follow candidate `y`, a compatibility relation can be used:

```text
compatible(previous, candidate)
```

This supports Hamiltonian-path-style search and scheduling arrangements.

## 25. Graph Interpretation

Permutation search can be viewed as finding paths through a state graph where each state records the used elements.

This perspective helps connect permutation backtracking with graph search.

## 26. Hamiltonian Path Connection

Hamiltonian path search chooses an unused vertex at each step while requiring an edge from the current vertex.

It is permutation-like backtracking plus graph feasibility constraints.

## 27. TSP Connection

Traveling Salesperson search similarly constructs an ordering of vertices while accumulating route cost.

Exact backtracking can be strengthened with lower bounds, becoming branch and bound.

## 28. Branch and Bound for Permutations

Maintain:

```text
currentCost
bestCost
lowerBound
```

If:

```text
currentCost + lowerBound >= bestCost
```

for a minimization problem, the branch cannot improve the incumbent.

The bound must never underestimate the true remaining cost in a way that causes incorrect pruning.

## 29. Ordering Heuristics

For first-solution and optimization search, try promising candidates first.

Examples:

- smallest incremental cost
- strongest constraint first
- nearest feasible neighbor
- most restrictive candidate

Heuristics affect search order, not exactness, if no valid candidate is permanently discarded without proof.

## 30. Fail-First Principle

A useful CSP principle is to make the most constrained decision first.

For permutation problems with position-specific domains, choose the next position with the fewest feasible candidates when the representation allows flexible position ordering.

## 31. Forward Checking

After placing an element, update future candidate availability.

If some future position has no legal candidate, backtrack immediately.

## 32. Symmetry Breaking

If rotations, reflections, or equivalent arrangements represent the same solution, impose a canonical rule.

For example, fix one distinguished element at a canonical position when the problem's symmetry permits it.

## 33. Circular Permutations

For `n` distinct elements arranged around a circle, rotations are equivalent in many formulations.

Fixing one element removes rotational symmetry and leaves:

```text
(n - 1)!
```

arrangements.

Additional reflection symmetry depends on whether clockwise and counterclockwise arrangements are considered equivalent.

## 34. Derangements

A derangement is a permutation in which no element remains in its original position.

Backtracking can enforce:

```text
candidateIndex !== position
```

at each level.

## 35. Permutations with Repetition

If positions can independently choose from a set of `k` values with repetition allowed, the search space is:

```text
k^n
```

not `n!`.

This is a different decision model.

## 36. Partial Permutations

Selecting and ordering `k` elements from `n` distinct elements produces:

```text
P(n, k) = n! / (n-k)!
```

Backtracking stops at depth `k` instead of `n`.

## 37. Ranking and Unranking

A permutation can be mapped to a rank among lexicographically ordered permutations using factorial-number-system ideas.

Unranking maps a rank back to a permutation.

These techniques can avoid enumerating every earlier permutation.

## 38. Factoradic Connection

The factorial number system represents a permutation through digits with bounds:

```text
0 ≤ d_i ≤ i
```

It provides a mathematical foundation for permutation ranking/unranking.

## 39. JavaScript Numeric Boundary

Factorials grow rapidly.

For large `n`, `Number` cannot exactly represent all factorial values.

Use `BigInt` when exact integer arithmetic is required and design APIs consistently around one numeric type.

## 40. Memory Considerations

Avoid storing all permutations when the output is huge.

Prefer:

- streaming callbacks
- generators
- early termination
- aggregation

when the API permits it.

## 41. Generator-Based Enumeration

JavaScript generators can yield one permutation at a time:

```text
yield path
```

This can reduce application-level output buffering, although the recursive state still consumes stack/path memory.

## 42. Backend Applications

Permutation-style search appears in:

- deployment ordering
- migration ordering
- task sequencing
- dependency-aware execution
- request processing policies
- test execution order
- configuration ordering

For large spaces, exact permutation search is usually replaced or assisted by constraints, heuristics, DP, or optimization methods.

## 43. AI Applications

Permutation search can model:

- tool invocation ordering
- workflow planning
- prompt component ordering
- small scheduling spaces
- feature ordering
- constrained generation
- symbolic planning

Modern AI systems may use learned heuristics to prioritize branches while retaining exact search for small constrained spaces.

## 44. Correctness Proof

For distinct elements, at each depth every unused element is considered exactly once.

Therefore every possible ordering appears as exactly one root-to-leaf path.

The `used` or swap invariant prevents repeated occurrences within one path.

## 45. Duplicate Correctness

For duplicate-aware generation, correctness requires proving two properties:

1. Every unique value-level permutation remains reachable.
2. Equivalent branches are not explored repeatedly.

Sorting/frequency-count representations make this reasoning explicit.

## 46. Common Mistakes

- forgetting to unmark `used`
- forgetting to undo swaps
- confusing permutations with combinations
- mishandling duplicates
- accidentally reusing an element
- pruning without a valid constraint proof
- assuming all permutations fit in memory
- using unsafe factorial arithmetic

## 47. Testing Strategy

For small distinct arrays verify:

```text
count === n!
```

For duplicates, compare against a set of normalized permutations.

For constrained search, validate every result and compare small instances against a brute-force oracle.

## 48. Differential Testing

Compare multiple implementations:

```text
used[] backtracking
vs
in-place swap
vs
next permutation
```

on small inputs.

Normalize result order before comparison when ordering is not part of the contract.

## 49. Complexity Derivation

Record separately:

```text
candidate generation
constraint checking
recursive node count
solution materialization
output storage
```

For constrained permutations, pruning can dramatically reduce practical nodes but does not generally improve the worst-case factorial bound.

## 50. Implementation Lab

Implement:

1. all permutations with `used[]`
2. in-place swap permutations
3. duplicate-aware permutations
4. frequency-map permutations
5. lexicographic next permutation
6. partial permutations
7. derangements
8. circular permutations
9. constrained permutations
10. Hamiltonian-path search
11. TSP-style branch and bound
12. permutation ranking
13. permutation unranking
14. generator-based streaming
15. differential test harness

## 51. Interview Framework

Explain:

```text
State:
path + used

Choice:
choose one unused element

Constraint:
reject invalid candidate

Transition:
mark → push → recurse → pop → unmark

Base:
path.length === targetLength

Complexity:
O(n!) for complete permutation enumeration
```

Then explain duplicate handling or pruning if required.

## 52. Revision Checklist

- [ ] Explain why permutations have `n!` possibilities.
- [ ] Implement `used[]` backtracking.
- [ ] Implement in-place swap backtracking.
- [ ] Prove the apply/undo invariant.
- [ ] Handle duplicate values.
- [ ] Use frequency maps for duplicate-aware generation.
- [ ] Distinguish permutations, combinations, and repeated selections.
- [ ] Implement partial permutations.
- [ ] Understand derangements.
- [ ] Understand circular symmetry.
- [ ] Understand constraint-aware permutation search.
- [ ] Connect permutations to Hamiltonian Path and TSP.
- [ ] Understand branch and bound.
- [ ] Understand next permutation.
- [ ] Understand ranking/unranking and factorial representation.
- [ ] Handle JavaScript numeric limits.
- [ ] Use generators for streaming output when appropriate.
- [ ] Apply permutation search to Backend and AI workflows.

## Key Takeaways

1. Permutation backtracking assigns one unused element at every depth.
2. The natural search space for `n` distinct elements is `n!`.
3. `used[]` and in-place swapping are two fundamental implementation patterns.
4. Duplicate-aware generation requires distinguishing occurrence identity from value identity.
5. Constraints can prune permutation trees dramatically in practice.
6. Branch and bound adds safe objective bounds for optimization problems such as TSP.
7. Some permutation tasks are better solved iteratively with next permutation or mathematically with ranking/unranking.
8. Exact permutation search is a foundational model for ordering problems in Backend systems and AI planning.
