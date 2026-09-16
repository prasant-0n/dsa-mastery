# 16.10 — Permutations, Duplicate Handling & State-Space Enumeration

## 1. Concept Definition

A permutation is an ordering of selected elements. Backtracking is a natural way to enumerate permutations because each level chooses the next unused element.

The central challenge is distinguishing **positions**, **element identities**, and **value equality**.

## 2. State Model

For `n` distinct elements:

```text
path
used[]
```

At depth `k`, exactly `k` elements have been selected.

## 3. Core Recurrence

```text
if path.length === n:
    emit path
else:
    for each unused element:
        choose
        recurse
        undo
```

This explores the permutation state space systematically.

## 4. Number of Permutations

For `n` distinct elements:

```text
n!
```

permutations exist.

Enumeration therefore requires at least output-size work: `Ω(n!)` outputs.

## 5. Partial Permutations

Choosing `k` elements from `n` without repetition produces:

```text
P(n,k) = n! / (n-k)!
```

The recursion depth is `k` rather than `n`.

## 6. Swap-Based Permutation

An array can be permuted in place by fixing one position and swapping each candidate into it.

Pattern:

```text
swap(i, j)
recurse(i + 1)
swap(i, j)
```

This reduces auxiliary state but requires exact restoration.

## 7. Used-Array Representation

A `used[]` array makes membership explicit.

It is easy to reason about and useful when the input should remain unchanged.

## 8. In-Place Swap Representation

Swap-based recursion keeps the current permutation inside the input array.

The invariant is that positions before the current index are fixed for the current branch.

## 9. Duplicate Values

If values repeat, naive index-based recursion generates duplicate value sequences.

For example:

```text
[A, A, B]
```

contains fewer unique permutations than `3!`.

## 10. Frequency-Map Method

For duplicate-aware enumeration, maintain counts:

```text
A → 2
B → 1
```

At each level, choose a value whose remaining count is positive, decrement, recurse, then restore.

This naturally avoids duplicate branches.

## 11. Sorted + Same-Level Deduplication

Another standard method sorts the input and skips an equal value when the previous equal value has not been used at the current depth.

The important distinction is:

```text
same recursion level
vs
same path at deeper level
```

Skipping both would incorrectly remove valid permutations.

## 12. Multiset Permutation Count

If value frequencies are `f1, f2, ..., fm`, the number of unique permutations is:

```text
n! / (f1! * f2! * ... * fm!)
```

This provides an independent expected-count oracle.

## 13. Identity vs Value

If two objects have equal fields but are distinct entities, value-based deduplication may be wrong.

Define whether the problem is about:

- element identity
- serialized value
- semantic equality

before selecting a deduplication strategy.

## 14. JavaScript Equality Boundary

Objects are compared by reference with `===`.

Two structurally equal objects are not automatically duplicates.

A canonical key or comparator is required when semantic equality is desired.

## 15. Lexicographic Enumeration

Sorting values and exploring candidates in ascending order can produce permutations in lexicographic order.

For duplicate-aware generation, the same ordering enables local duplicate skipping.

## 16. Next Permutation

An iterative alternative generates the next lexicographic permutation without recursion.

The algorithm finds a pivot, swaps with the next larger suffix value, then reverses the suffix.

It is useful when all permutations must be generated in sorted order with low auxiliary memory.

## 17. Ranking and Unranking

A permutation can be mapped to a rank among all permutations using factorial-number-system ideas.

Unranking performs the reverse mapping.

This enables random access to a permutation without enumerating all earlier permutations.

## 18. Lehmer Code

The Lehmer code records how many remaining elements are smaller than each selected element.

It provides a compact permutation representation and connects enumeration to combinatorial ranking.

## 19. Factoradic Representation

Factorial-number-system digits naturally represent permutation ranks.

For distinct elements, the digit at position `i` is bounded by the number of remaining elements minus one.

## 20. Sampling Random Permutations

If one random permutation is required, use Fisher–Yates rather than backtracking all permutations.

Backtracking is appropriate for enumeration or constrained permutation search, not merely for producing one random ordering.

## 21. Constrained Permutations

Backtracking becomes more valuable when permutations must satisfy constraints such as:

- adjacency restrictions
- forbidden positions
- precedence rules
- distance constraints
- fixed positions
- resource compatibility

Prune as soon as a partial permutation cannot be completed.

## 22. Precedence Constraints

If `A` must appear before `B`, do not allow `B` to be placed until the required predecessor condition is satisfied.

For general precedence graphs, maintain the set of currently available tasks with zero unsatisfied prerequisites.

## 23. Adjacency Constraints

For rules such as “A cannot be adjacent to B,” check the previous selected element before appending a candidate.

This local check can eliminate branches immediately.

## 24. Position Constraints

If a value is allowed only at specific positions, encode that domain before recursion.

This turns permutation generation into a CSP with position variables.

## 25. Branch Ordering

Candidate ordering affects discovery order and runtime but not completeness when every legal candidate remains searchable.

Useful orders include:

- lexicographic
- most constrained value
- rarest value
- highest future impact

## 26. MRV for Permutation CSPs

When the formulation uses position variables with different domains, choose the position with the smallest remaining domain.

This is a generalized CSP strategy rather than a requirement for ordinary permutation generation.

## 27. Forward Checking

After assigning a value to a position, remove it from incompatible future positions.

If a future position has no remaining values, backtrack immediately.

## 28. Symmetry Breaking

If constraints make multiple permutations equivalent under symmetry, impose a canonical condition to avoid duplicate equivalent searches.

For example, a rotationally symmetric circular arrangement can fix one distinguished element at a reference position.

## 29. Circular Permutations

For `n` distinct elements arranged around a circle, rotations are equivalent under the usual circular-permutation definition.

Fixing one element removes rotational symmetry, leaving:

```text
(n - 1)!
```

arrangements before considering additional symmetries.

## 30. Derangements

A derangement is a permutation where no element remains in its original position.

Backtracking can generate them by rejecting candidate `x` at position `i` when `x` originally occupied `i`.

For counting, the classic recurrence connects derangements to inclusion-exclusion.

## 31. Permutation with Repetition

If repetition is allowed and there are `m` choices for each of `k` positions, the unrestricted state space contains:

```text
m^k
```

sequences.

This is not the same problem as permuting `n` distinct items.

## 32. Combination vs Permutation

Order matters for permutations:

```text
[A,B] ≠ [B,A]
```

Order does not matter for combinations.

Recognizing this distinction prevents incorrect recursion trees.

## 33. Enumeration vs Counting

If only the number of valid permutations is required, do not materialize every result.

Return a count and keep the current path mutable.

For large counts, consider `BigInt`.

## 34. Streaming Enumeration

For huge output spaces, a generator or callback can stream results instead of retaining an `O(n!)` result array.

This changes memory behavior without changing the underlying search space.

## 35. Correctness Invariant

At recursion depth `k`:

> `path` contains exactly `k` distinct currently selected elements, every selected element is allowed by the constraints, and the remaining state exactly represents the unselected choices.

The apply/undo operations preserve this invariant.

## 36. Completeness

Every valid candidate at every depth is considered unless a mathematically safe constraint proves the branch impossible.

Duplicate suppression is complete only when it removes equivalent branches rather than distinct valid value sequences.

## 37. Complexity

Distinct full permutation enumeration requires:

```text
Θ(n · n!)
```

work if each output of length `n` is materialized/copied.

The recursion state itself uses `O(n)` auxiliary depth/state for a standard implementation, excluding stored outputs.

## 38. Output-Sensitive Analysis

When returning all permutations, output memory can dominate:

```text
Θ(n · n!)
```

for materialized arrays.

Streaming reduces output storage to approximately the working-state size.

## 39. Backend Applications

Permutation backtracking can model:

- dependency-valid execution orders
- small task scheduling spaces
- API workflow ordering
- deployment-step sequencing
- test-case ordering
- request pipeline permutations

For large scheduling problems, specialized scheduling algorithms or optimization solvers are usually more scalable.

## 40. AI Applications

Useful applications include:

- tool-call ordering under constraints
- prompt/component ordering
- experiment sequence generation
- small search spaces for planning
- evaluation-order exploration
- candidate sequence generation

A learned heuristic can rank candidates while exact backtracking preserves completeness.

## 41. Hybrid AI + Enumeration

A practical architecture is:

```text
AI ranks candidate order
→ backtracking enforces hard constraints
→ validator checks complete sequence
```

The ranking changes speed, not correctness, when no legal candidate is discarded solely because of the ranking.

## 42. Testing Strategy

For small `n`, compare enumeration against:

- expected factorial count
- multiset formula
- independent next-permutation generation
- brute-force index permutations

For constrained variants, use an exhaustive oracle on tiny inputs.

## 43. Metamorphic Testing

Useful properties:

- relabeling all distinct values preserves the number of permutations
- reversing the input maps solutions to reversed solutions when constraints are reversal-invariant
- adding a restriction cannot increase the solution count
- removing a restriction cannot decrease it

These are powerful correctness checks.

## 44. Adversarial Cases

Test:

- all values identical
- all values distinct
- one rare value among duplicates
- highly restrictive adjacency rules
- no valid permutation
- every permutation valid
- fixed-position constraints
- deep failure near the final position

## 45. Benchmark Metrics

Track:

- nodes visited
- candidate attempts
- branches pruned
- duplicate branches skipped
- solutions emitted
- maximum depth
- runtime
- peak memory

Compare used-array, swap-based, frequency-map, and constrained variants.

## 46. Implementation Lab

Implement:

1. distinct permutation generator
2. swap-based generator
3. partial permutation generator
4. duplicate-aware frequency generator
5. sorted same-level deduplication
6. permutation counter
7. streaming generator
8. next-permutation iterator
9. rank/unrank
10. constrained permutation solver
11. derangement generator
12. circular permutation solver
13. precedence-constrained ordering
14. brute-force oracle
15. differential test harness
16. Backend workflow-order solver
17. AI tool-order planner

## 47. Interview Framework

Explain:

```text
State:
current path + unused elements

Choice:
select next candidate

Constraint:
problem-specific legality

Transition:
choose → recurse → undo

Base:
required length reached

Complexity:
output-sensitive factorial search
```

Then discuss duplicate handling and why frequency maps avoid generating equivalent value sequences.

## 48. Revision Checklist

- [ ] Implement distinct permutations.
- [ ] Understand `n!` state-space growth.
- [ ] Implement swap-based permutation generation.
- [ ] Generate partial permutations.
- [ ] Handle duplicate values correctly.
- [ ] Derive the multiset permutation formula.
- [ ] Distinguish identity equality from value equality.
- [ ] Understand lexicographic generation.
- [ ] Understand next permutation.
- [ ] Understand ranking/unranking and Lehmer codes.
- [ ] Recognize when Fisher–Yates is more appropriate.
- [ ] Add positional/adjacency/precedence constraints.
- [ ] Use forward checking for constrained variants.
- [ ] Understand symmetry breaking.
- [ ] Separate counting from enumeration.
- [ ] Build output-sensitive benchmarks.
- [ ] Apply permutation search to Backend and AI sequencing problems.

## Key Takeaways

1. Permutation backtracking systematically enumerates an ordering state space.
2. Distinct permutations have `n!` outputs, so enumeration is inherently output-heavy.
3. Duplicate-aware generation must distinguish equivalent value branches from valid deeper reuse.
4. Frequency maps and sorted same-level deduplication are the two core duplicate-handling patterns.
5. Swap-based, used-array, frequency-map, and iterative next-permutation methods trade simplicity, memory, and ordering properties.
6. Constraints transform permutation generation into a powerful CSP/backtracking framework.
7. Ranking, unranking, and Fisher–Yates solve different problems and should not be confused with exhaustive enumeration.
8. The same exact-search architecture can support constrained Backend workflows and AI planning.
