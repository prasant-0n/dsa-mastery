# 10.06 — Binary Search Patterns: Boundaries, Monotonic Predicates & Search on Answer

## 1. Objective

Binary search is fundamentally a technique for shrinking an ordered search space by proving that one half cannot contain the required answer.

The broader pattern is:

```text
ordered search space
→ monotone decision
→ eliminate half
→ repeat
```

## 2. Classic Binary Search

For sorted values, maintain a search interval and compare the midpoint with the target.

The key invariant is that the answer, if present, remains inside the active interval.

## 3. Boundary Search

Many problems are not asking whether a value exists. They ask for a boundary:

- first occurrence;
- last occurrence;
- first value ≥ target;
- first value > target;
- last value ≤ target.

These are lower/upper-bound problems.

## 4. Lower Bound

For sorted values, lower bound is the first position satisfying:

```text
value >= target
```

Represent the predicate as:

```text
false false false true true
```

Binary search locates the first `true`.

## 5. Upper Bound

Upper bound is the first position satisfying:

```text
value > target
```

It provides the insertion boundary after all values equal to the target.

## 6. Half-Open Intervals

A robust implementation often uses:

```text
[low, high)
```

where `high` is exclusive.

The exact convention is less important than maintaining it consistently.

## 7. Loop Invariant

For first-true search:

> Every position before `low` is known to be false, and every position at or after `high` is outside the unresolved region or known to satisfy the required boundary condition.

Define the invariant precisely for your implementation.

## 8. Termination

Each iteration must strictly reduce the unresolved search interval.

With a half-open interval:

```text
mid = low + floor((high - low) / 2)
```

and at least one boundary must move past `mid`.

## 9. Duplicates

Ordinary binary search may return any matching occurrence unless the contract says otherwise.

Boundary searches explicitly encode which occurrence is required.

## 10. Rotated Sorted Arrays

A rotated sorted array contains an ordered region on at least one side of the midpoint under standard assumptions.

Use that structure to determine which side can contain the target.

Duplicate-heavy inputs can weaken the ability to distinguish the ordered side and may require additional handling.

## 11. Nearly Sorted Arrays

If each element is displaced by at most `K` positions, a binary-search-like strategy can inspect a bounded neighborhood around the midpoint.

The exact complexity depends on the displacement and implementation.

## 12. Binary Search on a Monotone Predicate

The search domain does not need to be an array.

Suppose a function answers:

```text
feasible(x)
```

and the result changes only once:

```text
false false false true true true
```

Then binary search can locate the transition.

## 13. Search on Answer

Many optimization problems can be transformed:

```text
minimize X
```

into:

```text
Is X feasible?
```

If feasibility is monotone, binary search finds the smallest feasible value.

## 14. Example: Capacity Problems

Suppose items must be processed within `D` days and `C` is a candidate capacity.

Define:

```text
feasible(C) = can the workload finish within D days?
```

If a capacity works, larger capacities also work.

Therefore feasibility is monotone.

## 15. Example: Minimum Speed

For a candidate speed `S`, compute whether all work can finish within the time limit.

The binary search is over possible speeds, not array indices.

## 16. Search-Space Bounds

Before searching, derive valid lower and upper bounds.

Good bounds reduce iterations and simplify correctness.

The bounds must contain at least one feasible answer when the problem guarantees one.

## 17. Integer Overflow

In languages with fixed-width integers, use an overflow-safe midpoint.

JavaScript `Number` has different numeric semantics, but very large integer workloads may require `BigInt` or careful range assumptions.

## 18. Continuous Binary Search

Binary search can also approximate real-valued solutions when a predicate is monotone.

Termination can be based on:

- fixed iterations;
- interval width;
- required precision.

The numerical error contract must be explicit.

## 19. Binary Search + Greedy

A common composition is:

```text
binary search candidate answer
+
greedy feasibility check
```

The greedy checker must itself be correct and efficient.

Total complexity is approximately:

```text
O(log R × feasibilityCost)
```

where `R` is the answer-space range under the chosen representation.

## 20. Binary Search + Prefix State

Prefix sums can make each feasibility check faster when the predicate depends on ranges.

The composition should be justified by the workload.

## 21. Binary Search + Hashing

Hashing can support feasibility checks or exact membership inside each search step, but avoid rebuilding state unnecessarily.

## 22. First/Last Occurrence

A first occurrence can be derived as lower bound.

A last occurrence can be derived from upper bound minus one when the target exists.

This is more robust than adding ad hoc duplicate branches.

## 23. Count Occurrences

For sorted data:

```text
count(target) = upperBound(target) - lowerBound(target)
```

This illustrates how boundary primitives compose into higher-level queries.

## 24. Range Queries

A sorted index can answer value-range boundaries with two binary searches.

For a range `[L, R]`:

```text
start = lowerBound(L)
end = upperBound(R)
```

The resulting interval is directly usable for ordered data.

## 25. Custom Comparators

Binary search should not assume numeric values.

Define a comparator contract and ensure the data is sorted under the same ordering.

Comparator consistency is a correctness precondition.

## 26. Searching Objects

Use a key selector when records are objects:

```text
record → key → comparator
```

The key extraction semantics must remain consistent throughout the search.

## 27. Expensive Predicates

In search-on-answer, each predicate evaluation may itself be expensive.

Optimize the feasibility check before optimizing the binary-search loop.

Cache reusable preprocessing when it is valid across candidates.

## 28. Repeated Queries

For repeated queries over static data:

```text
sort/index once
→ binary search repeatedly
```

Compare preprocessing cost against query volume.

## 29. Binary Search vs Hashing

Use binary search when ordering or boundary information matters.

Use hashing when exact membership dominates and ordering is unnecessary.

The data structure should match the required operation.

## 30. Correctness Proof

A complete proof should establish:

1. the search interval contains every possible answer;
2. the chosen half can safely be discarded;
3. the invariant remains true;
4. the interval eventually terminates;
5. the returned boundary satisfies the postcondition.

## 31. Complexity

Classic binary search:

```text
Time: O(log N)
Space: O(1) iterative
```

Search on answer:

```text
O(log R × C)
```

where `C` is the feasibility-check cost.

For repeated queries, include preprocessing separately.

## 32. Common Mistakes

1. Mixing inclusive and exclusive boundaries.
2. Using `low = mid` or `high = mid` incorrectly and causing infinite loops.
3. Returning the first match when a boundary is required.
4. Applying binary search without a monotone property.
5. Forgetting to prove the discarded half is impossible.
6. Using an inconsistent comparator.
7. Recomputing expensive feasibility state unnecessarily.
8. Ignoring duplicate-heavy rotated arrays.
9. Using floating-point search without an error contract.

## 33. Edge Cases

Test:

- empty array;
- singleton;
- target below all values;
- target above all values;
- target absent;
- all duplicates;
- target at first/last position;
- rotated arrays;
- extreme numeric bounds;
- impossible feasibility;
- always-feasible predicate.

## 34. Backend Applications

Binary search patterns appear in:

- ordered indexes;
- range queries;
- capacity planning;
- threshold selection;
- timestamp boundaries;
- cursor pagination;
- rate-limit threshold calculations.

## 35. AI Applications

Applications include:

- threshold selection;
- score cutoffs;
- retrieval boundaries;
- tuning monotone resource constraints;
- batch-size/capacity feasibility;
- approximate numerical search.

## 36. Interview Framework

When binary search seems relevant:

```text
1. What is the search space?
2. What ordering or monotonic property exists?
3. What exactly is the predicate?
4. What boundary is required?
5. What are valid low/high bounds?
6. What can be discarded after midpoint evaluation?
7. What invariant is maintained?
8. Why does the loop terminate?
9. What is predicate cost?
10. What is total complexity?
```

## 37. Revision Checklist

- [ ] I can implement classic binary search.
- [ ] I can derive lower and upper bounds.
- [ ] I can handle duplicates.
- [ ] I understand rotated-array search.
- [ ] I can recognize monotone predicates.
- [ ] I can derive search-on-answer solutions.
- [ ] I can combine binary search with greedy checks.
- [ ] I can search object records with comparators.
- [ ] I can prove termination and correctness.
- [ ] I can analyze predicate cost separately.

## 38. Key Takeaways

1. **Binary search is fundamentally about eliminating an ordered portion of the search space safely.**
2. **Boundary search and search-on-answer are more general and important than simple exact lookup.**
3. **Monotonicity is the essential property that makes binary search applicable outside sorted arrays.**
4. **The feasibility predicate can dominate the total runtime, so it must be analyzed independently.**
5. **A correct binary search requires explicit boundaries, invariants, termination reasoning, and a consistent ordering/predicate contract.**
