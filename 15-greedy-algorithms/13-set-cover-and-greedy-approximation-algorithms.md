# 15.13 — Set Cover & Greedy Approximation Algorithms

## 1. Concept Definition

Set Cover asks for a collection of sets whose union covers every required element while minimizing the number of selected sets, or minimizing total cost in the weighted version.

The optimization problem is NP-hard in its general form, so a greedy algorithm is important because it provides a practical approximation with a provable guarantee.

## 2. Problem Model

Given:

- universe `U`
- collection of subsets `S1, S2, ..., Sm`
- optionally, a non-negative cost for each set

Find a collection whose union covers `U`.

Unweighted objective:

```text
minimize number of selected sets
```

Weighted objective:

```text
minimize total selected-set cost
```

## 3. Why Greedy Approximation Exists

Exact optimization can become computationally expensive as the instance grows.

A greedy approximation trades exact optimality for a predictable bound and practical runtime.

This is a central algorithm-engineering pattern:

```text
exact optimum -> expensive
approximate solution -> efficient + bounded quality
```

## 4. Greedy Set Cover Rule

At each iteration, choose the set that covers the largest number of currently uncovered elements.

For weighted Set Cover, choose the set with the best cost efficiency:

```text
newlyCovered / cost
```

or equivalently minimize:

```text
cost / newlyCovered
```

among sets that add new coverage.

## 5. Why “Newly Covered” Matters

A set that covers 100 elements is not necessarily useful if 99 are already covered.

The marginal contribution is:

```text
|S - Covered|
```

Greedy decisions must use marginal gain, not total set size.

## 6. Algorithm

Unweighted version:

1. start with no elements covered
2. choose the set covering the most uncovered elements
3. add it to the solution
4. mark its elements covered
5. repeat until all required elements are covered

## 7. Weighted Version

For a set `S` with cost `c`:

```text
score(S) = newlyCovered(S) / c
```

Choose the largest score among sets that contribute new coverage.

This is the standard ratio-based greedy rule.

## 8. Approximation Ratio

For unweighted Set Cover with universe size `n`, the greedy algorithm achieves the classical logarithmic approximation guarantee:

```text
H_n <= 1 + ln(n)
```

where `H_n` is the `n`th harmonic number.

Thus the solution uses at most a logarithmic factor more sets than an optimal solution under the standard formulation.

## 9. Harmonic Numbers

The `n`th harmonic number is:

```text
H_n = 1 + 1/2 + 1/3 + ... + 1/n
```

and approximately:

```text
H_n = ln(n) + gamma + o(1)
```

where `gamma` is the Euler-Mascheroni constant.

## 10. Approximation Is Not Exactness

Greedy Set Cover can return a solution that is larger or more expensive than the true optimum.

The guarantee bounds how far it can be from optimum; it does not mean greedy always finds the optimal cover.

## 11. Proof Intuition

Suppose `r` elements remain uncovered and an optimal solution uses `k` sets to cover them.

At least one of those `k` sets covers at least `r/k` remaining elements.

Greedy chooses a set covering at least that many.

Therefore the number of uncovered elements decreases at a controlled logarithmic rate.

## 12. Charging Argument

A standard proof assigns a charge to each element when it becomes covered.

The charge reflects the marginal cost of the greedy set that covers it.

Summing these charges yields the logarithmic approximation bound.

## 13. Exact Small-Instance Verification

For tiny universes, enumerate subsets of available sets and find the optimal cover.

This creates a reference solver for differential testing of the greedy approximation.

## 14. Bitmask Representation

For small universes, represent a set as a bitmask.

Coverage becomes bitwise OR:

```text
covered |= setMask
```

New coverage can be measured with:

```text
setMask & ~covered
```

This is useful for brute-force verification and high-performance small-state experiments.

## 15. Large-Instance Representation

For large sparse universes, use:

- arrays of element IDs
- hash sets
- inverted indexes
- compressed representations

The right structure depends on universe size and set density.

## 16. Lazy Greedy

Recomputing marginal coverage for every set after every selection can be expensive.

A lazy strategy stores an upper bound on each set's previous marginal gain and recomputes only when a candidate reaches the top of the priority queue.

This can significantly reduce redundant work.

## 17. Priority Queue Engineering

A max-heap can prioritize sets by estimated marginal gain.

For weighted Set Cover, the key can be marginal gain divided by cost.

Because marginal gains change as coverage grows, heap entries may become stale and require validation.

## 18. Tie-Breaking

Multiple sets may have identical marginal gain or ratio.

Deterministic tie-breaking improves reproducibility.

Possible rules include:

- lower cost
- stable set ID
- higher total coverage
- input order

Tie-breaking does not necessarily preserve the exact same selected set sequence across implementations.

## 19. Weighted Set Cover Edge Cases

Handle:

- zero-cost sets
- negative costs as invalid for the standard model
- empty sets
- duplicate sets
- sets covering no remaining elements
- elements that no set can cover

## 20. Zero-Cost Sets

A non-empty zero-cost set has infinite cost efficiency under the ratio formulation.

Production code should handle this explicitly rather than dividing by zero.

## 21. Infeasible Instances

If some required element belongs to no available set, complete coverage is impossible.

Return an explicit infeasible result rather than pretending the approximation is complete.

## 22. Maximum Coverage

Maximum Coverage changes the objective.

Given a limit `k` on the number of sets, select at most `k` sets maximizing the number of covered elements.

The greedy rule repeatedly chooses the set with the largest marginal coverage.

## 23. Maximum Coverage Guarantee

For the standard monotone coverage formulation, greedy achieves the classical:

```text
1 - 1/e
```

approximation guarantee for the cardinality-constrained problem.

## 24. Submodularity

Coverage is a monotone submodular function.

Informally, this means diminishing returns:

```text
marginal gain becomes smaller as the selected collection grows
```

This property explains why greedy marginal-gain algorithms are powerful for coverage problems.

## 25. Diminishing Returns

For sets `A ⊆ B` and candidate set `S`:

```text
gain(S | A) >= gain(S | B)
```

Adding `S` provides at least as much new coverage to the smaller selected collection.

## 26. General Greedy Submodular Maximization

Many problems can be written as:

```text
maximize f(A)
subject to |A| <= k
```

When `f` is monotone submodular, greedy marginal-gain selection has strong approximation guarantees.

## 27. Facility-Style Selection

Coverage ideas appear in facility selection, where opening a facility serves nearby demand.

A more realistic objective may combine coverage benefit, opening cost, latency, capacity, and fairness.

That may no longer reduce directly to basic Set Cover.

## 28. Feature Selection

A feature can be treated as a set of capabilities, signals, or examples it covers.

Greedy selection can produce compact feature subsets when the objective has suitable diminishing-return structure.

## 29. Backend Applications

Set Cover and coverage greedy can model:

- selecting services to cover API capabilities
- selecting indexes to cover query patterns
- selecting caches to cover hot data groups
- selecting monitoring rules to cover failure classes
- selecting test suites to cover requirements

The model must explicitly define what “coverage” means.

## 30. AI Applications

Coverage optimization can appear in:

- retrieval candidate selection
- document/source selection
- sensor placement
- prompt/example selection
- feature selection
- representative dataset selection

The practical objective may be weighted or submodular rather than pure Set Cover.

## 31. Retrieval Example

Suppose each document covers a collection of query concepts.

Selecting a limited number of documents to maximize concept coverage is a Maximum Coverage formulation.

Marginal gain changes after each selected document, making greedy recomputation essential.

## 32. Approximation Engineering

A production approximation algorithm should report:

- objective value
- feasibility
- number of selected items
- estimated or known bound
- runtime
- memory
- stopping reason

Do not present an approximate result as an exact optimum.

## 33. Quality vs Runtime

Possible engineering knobs include:

- lazy greedy
- candidate filtering
- early stopping
- parallel marginal evaluation
- approximate marginal computation
- exact refinement on the selected candidate pool

Each changes runtime and potentially solution quality.

## 34. Parallelism

Marginal gains for independent candidate sets can often be computed in parallel for a given greedy round.

The selection step still introduces synchronization because selecting one set changes all remaining marginal gains.

## 35. Streaming Variants

When the entire set collection cannot fit comfortably in memory, streaming coverage algorithms can process candidates incrementally.

The trade-off is between memory, passes, approximation quality, and implementation complexity.

## 36. Dynamic Coverage

If sets or universe elements change over time, cached marginal gains can become stale.

Production systems must invalidate or recompute affected state.

## 37. Correctness Invariant

At every greedy iteration:

```text
Covered = union of selected sets
```

The selected collection is always feasible for the elements it has already covered.

The next choice is made using the current marginal contribution.

## 38. Approximation Proof Boundary

The classical guarantees require the standard problem formulation and assumptions.

Changing constraints, costs, negative values, feasibility rules, or objectives can invalidate the guarantee.

Always state the exact optimization model before quoting a ratio.

## 39. Complexity

A naive implementation can repeatedly scan every set and every element, producing work proportional to the total input size per greedy round.

Priority queues, inverted indexes, bitsets, and lazy evaluation can reduce practical work.

The correct complexity should be derived from the chosen representation and number of recomputations.

## 40. Common Mistakes

- maximizing total set size instead of uncovered gain
- using `cost / totalCoverage` instead of marginal coverage
- claiming greedy is always optimal
- ignoring infeasible elements
- dividing by zero for zero-cost sets
- quoting an approximation guarantee under the wrong constraints
- comparing approximate edge sets rather than objective quality
- forgetting that marginal gains change after every selection

## 41. Interview Framework

For Set Cover:

1. define universe and sets
2. state exact objective
3. determine whether weighted
4. define marginal coverage
5. apply greedy selection
6. prove or state the approximation guarantee
7. analyze complexity
8. handle infeasibility
9. discuss exact brute force for tiny cases
10. discuss production representation and scaling

## 42. Revision Checklist

- [ ] Define Set Cover formally.
- [ ] Implement unweighted greedy Set Cover.
- [ ] Implement weighted ratio greedy.
- [ ] Explain why marginal gain matters.
- [ ] Explain the logarithmic approximation guarantee.
- [ ] Understand harmonic numbers.
- [ ] Implement brute-force optimal Set Cover for tiny inputs.
- [ ] Understand Maximum Coverage.
- [ ] Explain monotone submodularity and diminishing returns.
- [ ] Understand lazy greedy.
- [ ] Handle infeasible and zero-cost cases.
- [ ] Apply coverage optimization to backend and AI systems.

## Key Takeaways

1. Set Cover is a canonical NP-hard optimization problem where greedy approximation is highly useful.
2. Greedy must evaluate marginal uncovered coverage, not total set size.
3. The classical unweighted Set Cover greedy algorithm has a logarithmic approximation guarantee.
4. Maximum Coverage is a related but distinct cardinality-constrained problem with a `1 - 1/e` greedy guarantee under its standard assumptions.
5. Submodularity provides the mathematical foundation for many marginal-gain greedy algorithms.
6. Approximation engineering requires explicit objective definitions, feasibility checks, quality reporting, and measured performance.
