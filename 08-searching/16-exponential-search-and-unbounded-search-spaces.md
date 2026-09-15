# 08.16 — Exponential Search & Unbounded Search Spaces

## 1. Concept Definition

Exponential search is a strategy for locating a useful bounded interval before applying binary search.

For an ascending sequence, probe positions that grow exponentially:

```text
1, 2, 4, 8, 16, 32, ...
```

Once the target is bracketed, binary search operates inside the discovered interval.

## 2. Why It Matters

Ordinary binary search assumes a known finite boundary:

```text
[0, n)
```

Exponential search is useful when the upper boundary is unknown or when the target may occur very near the beginning of a very large ordered sequence.

The core pattern is:

```text
discover boundary → narrow interval → binary search
```

## 3. Mental Model

Imagine walking outward from the beginning while doubling the distance:

```text
1 → 2 → 4 → 8 → 16 → ...
```

The first probe that passes the target gives a bracket containing the answer.

## 4. Basic Preconditions

The classic form assumes:

- ordered data;
- random or indexed access to probes;
- a stable ordering relation;
- a meaningful starting position.

If access itself is sequential, jumping to index `2^k` may not be cheap. The access model must therefore be part of the complexity analysis.

## 5. Bracketing Phase

For target `x`, repeatedly inspect exponentially increasing positions until:

```text
A[index] >= x
```

or the sequence boundary is reached.

The previous probe and current probe define a candidate interval.

## 6. Binary-Search Phase

After bracketing:

```text
low = previousProbe
high = currentProbe
```

perform ordinary binary search or lower-bound search within that interval.

## 7. Complexity

If the target is at position `p`, the bracketing phase takes:

```text
O(log p)
```

probes.

The binary-search phase also takes:

```text
O(log p)
```

Therefore total time is:

```text
O(log p)
```

assuming `O(1)` random access and comparison.

## 8. Why Position Matters

If `p << n`, exponential search can avoid depending directly on the full known array size.

For example, searching near the beginning of a conceptually huge ordered sequence may require only a small number of probes.

## 9. Known Finite Arrays

For a normal in-memory array where `n` is already known, ordinary binary search usually provides the same asymptotic worst-case complexity:

```text
O(log n)
```

Exponential search becomes interesting primarily because of the boundary-discovery property and target-position-sensitive behavior.

## 10. Unbounded Search Space

An unbounded or implicit ordered space may provide values through an accessor:

```js
valueAt(index)
```

without exposing a conventional `length`.

The search algorithm must therefore discover a sufficiently large upper bound before binary searching.

## 11. Infinite Sequence Model

Conceptually:

```text
A[0], A[1], A[2], ...
```

If the sequence is monotone and the target is guaranteed to be within some finite position, exponential probing can eventually bracket it.

## 12. Sentinel-Based Sequences

Some APIs expose a sentinel or end condition rather than `length`.

The exponential phase must distinguish:

```text
valid value
```

from:

```text
end of sequence
```

This contract should be explicit.

## 13. Missing Targets

If the target does not exist, the algorithm must define what happens when the search reaches the sequence boundary.

Possible result contracts include:

- `-1` for exact search;
- insertion position for lower bound;
- `{found, index}`;
- explicit `end` result.

## 14. Lower Bound in an Unbounded Sequence

Exponential search is particularly useful for:

```text
find first index where A[i] >= target
```

The exponential phase discovers an interval containing that first satisfying index, after which lower-bound binary search finishes the task.

## 15. Upper Bound

Similarly, search for:

```text
first index where A[i] > target
```

by changing the bracketing predicate and the final boundary search.

## 16. Overflow-Safe Index Growth

Naively computing:

```text
index *= 2
```

can overflow fixed-width integer types.

A robust implementation should define safe index arithmetic and an explicit maximum representable index.

JavaScript's `Number` also has a safe-integer boundary, so large conceptual index spaces may require `BigInt` or another representation.

## 17. BigInt Considerations in JavaScript

`BigInt` supports integers beyond `Number.MAX_SAFE_INTEGER`, but array indices and many APIs still use ordinary numeric indexing.

Therefore an unbounded-search abstraction may use `BigInt` for the mathematical index while converting to a supported access representation only when valid.

The API contract determines the appropriate design.

## 18. Access Cost Model

Exponential search's usual `O(log p)` result assumes each indexed access is approximately constant cost.

If:

```text
cost(valueAt(i)) = C(i)
```

then total performance depends on the access-cost function as well as the number of probes.

## 19. Remote / Database Access

If `valueAt(index)` causes a network or database request, the number of round trips can dominate CPU complexity.

Production designs should consider:

- batching probes;
- server-side indexes;
- pagination metadata;
- cached boundaries;
- approximate size information.

The best algorithmic abstraction is constrained by the actual access layer.

## 20. Exponential Search vs Binary Search

Binary search:

```text
requires known finite bounds
```

Exponential search:

```text
discovers a useful upper bound first
```

Both use binary elimination after an appropriate interval exists.

## 21. Exponential Search vs Linear Search

Linear search examines positions sequentially:

```text
0, 1, 2, 3, ...
```

Exponential search skips large regions:

```text
1, 2, 4, 8, ...
```

for ordered data where indexed access is available.

## 22. Exponential Search vs Interpolation Search

Interpolation search estimates a likely position from the values themselves.

Exponential search does not require a distribution assumption. It relies on ordering and rapidly expanding bounds.

Therefore their assumptions are fundamentally different.

## 23. Duplicates

Duplicates do not invalidate exponential bracketing.

They do affect whether the final result means:

- any occurrence;
- first occurrence;
- last occurrence.

For first/last semantics, use lower/upper-bound logic after bracketing.

## 24. Custom Comparators

The same pattern works for objects:

```text
compare(valueAt(index), target)
```

The comparator must be compatible with the sequence's ordering.

## 25. Descending Sequences

For descending data, the comparison directions reverse.

Do not copy ascending conditions mechanically. Define the monotone predicate first, then derive the bracketing and binary-search rules.

## 26. Sparse Ordered Data

An implicit ordered sequence may contain gaps in its logical key space.

For example:

```text
10, 20, 40, 100, ...
```

Exponential search operates on positions, not necessarily values, so it remains valid as long as the sequence is ordered.

## 27. Search by Predicate

The most general formulation is:

```text
P(i) = whether position i satisfies the boundary condition
```

If `P(i)` transitions monotonically, exponential probing can find a bracket containing the transition.

Then binary boundary search identifies the exact boundary.

## 28. Exponential Bracketing + Answer Search

The pattern can be applied to an unknown numeric answer domain:

```text
test 1
→ test 2
→ test 4
→ test 8
→ ...
```

until feasibility becomes true, then binary-search the bracket.

This is useful when the answer has no convenient tight upper bound.

## 29. Correctness Invariant: Bracketing

A useful invariant is:

> If a valid boundary exists, it remains within the interval represented by the previous and current exponential probes once the stopping condition is reached.

The exact invariant depends on whether the goal is exact search, lower bound, upper bound, or feasibility.

## 30. Correctness Invariant: Final Binary Search

After bracketing, ordinary binary-search correctness applies because the active interval satisfies the required monotonicity contract.

Thus correctness can be decomposed:

```text
prove bracket contains answer
+
prove binary search preserves answer
```

## 31. Termination

Termination requires one of:

- target found;
- boundary/end reached;
- maximum representable index reached;
- monotone predicate becomes true.

An unbounded loop without a reachable stopping condition is an algorithmic failure mode.

## 32. Backend Applications

Potential backend uses include:

- ordered event logs with unknown length;
- version lookup in append-only sequences;
- time-series boundary discovery;
- pagination over ordered records;
- threshold lookup in large ordered indexes.

For database-backed data, server-side indexes often provide stronger guarantees than application-level probing.

## 33. AI Applications

Applications include:

- locating thresholds in sorted score streams;
- searching implicit candidate sequences;
- finding first feasible model/configuration size;
- monotone evaluation over parameter ranges.

For expensive model evaluations, predicate cost usually dominates probe arithmetic.

## 34. Testing Strategy

Test targets at positions:

```text
0, 1, 2, 3, 4, 7, 8, 15, 16, ...
```

plus:

- absent values;
- values beyond the end;
- duplicate blocks;
- empty sequences;
- singleton sequences;
- very large conceptual bounds.

These cases exercise the exponential boundaries directly.

## 35. Differential Testing

Use a finite materialized sequence as a reference:

```text
exponential search abstraction
vs
linear/binary reference
```

Test both exact and boundary semantics.

## 36. Benchmarking

Measure:

- exponential probes;
- binary-search comparisons;
- accessor calls;
- comparator calls;
- network/database round trips when applicable;
- target position.

Do not benchmark only CPU time when access is externally expensive.

## 37. Common Mistakes

1. Assuming the sequence length is known.
2. Forgetting the index-zero special case.
3. Overflowing exponential indices.
4. Failing to detect sequence end.
5. Applying ascending predicates to descending data.
6. Ignoring accessor cost.
7. Confusing exact search with lower bound.
8. Mishandling duplicates.
9. Claiming `O(log n)` when the relevant parameter is target position `p`.
10. Performing remote probes without accounting for round trips.

## 38. Edge Cases

Test:

- empty sequence;
- one element;
- target at index `0`;
- target at index `1`;
- target exactly on a power-of-two boundary;
- target just after a power-of-two boundary;
- target absent;
- end encountered during bracketing;
- duplicates;
- descending sequence;
- huge conceptual indices.

## 39. Implementation Lab

Implement:

1. exponential exact search on arrays;
2. exponential lower bound;
3. exponential upper bound;
4. unbounded search through `valueAt(index)`;
5. descending variant;
6. comparator-based variant;
7. monotone predicate bracketing;
8. answer-space exponential bracketing;
9. overflow-safe index growth;
10. differential and benchmark harnesses.

## 40. Interview Questions

1. What is exponential search?
2. Why does it help when the upper bound is unknown?
3. What is its complexity in terms of target position `p`?
4. How does it combine with binary search?
5. How do you implement lower bound over an unbounded sequence?
6. What happens when the target is absent?
7. How do duplicates affect the result contract?
8. What changes for descending sequences?
9. How does remote access change the complexity model?
10. How can exponential bracketing be used for binary search on the answer?

## 41. Revision Checklist

- [ ] I can explain exponential bracketing.
- [ ] I can combine it with binary search.
- [ ] I understand `O(log p)` target-position reasoning.
- [ ] I can search an implicit unbounded sequence.
- [ ] I can derive lower and upper bounds.
- [ ] I can handle sequence termination.
- [ ] I understand overflow-safe index growth.
- [ ] I can adapt the method to descending/comparator order.
- [ ] I can model expensive access costs.
- [ ] I can use exponential bracketing for unknown answer ranges.

## 42. Key Takeaways

1. **Exponential search discovers a useful search interval when the upper bound is unknown.**
2. **Its core pattern is exponential bracketing followed by binary search.**
3. **With constant-time indexed access, target-position complexity is `O(log p)`.**
4. **Lower/upper-bound semantics make the technique useful beyond exact membership.**
5. **Unbounded search requires an explicit end/overflow/termination contract.**
6. **Accessor cost can dominate the theoretical number of comparisons.**
7. **Monotone predicates allow exponential bracketing even when the searched domain is an implicit answer space.**
8. **The technique generalizes to comparators, descending order, and complex records.**
9. **The deeper pattern is discover → bracket → eliminate.**
