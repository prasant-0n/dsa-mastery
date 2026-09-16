# 10.14 — Prefix Sum & Difference Array Patterns: Range Queries, Updates & State Transformation

## 1. Objective

Prefix sums transform repeated range aggregation into constant-time queries after linear preprocessing.

Difference arrays apply the inverse idea to make repeated range updates cheap and defer reconstruction until needed.

```text
Prefix sum:
values → cumulative state → fast range query

Difference array:
range updates → boundary changes → reconstruct final state
```

## 2. Why It Exists

If a range query scans every element, repeated queries can become expensive. Prefix state stores enough historical information to recover a range aggregate without rescanning it.

Likewise, directly updating every element in many ranges can cost `O(NQ)`. A difference representation can reduce each range update to constant work before one final reconstruction pass.

## 3. One-Dimensional Prefix Sum

For values `A` define:

```text
P[0] = 0
P[i + 1] = P[i] + A[i]
```

Then the sum of `[L, R)` is:

```text
P[R] - P[L]
```

The half-open convention removes many off-by-one errors.

## 4. Prefix Invariant

After processing the first `i` elements:

> `P[i]` equals the aggregate of exactly the original elements in `[0, i)`.

Every later range-query formula should follow from this invariant.

## 5. Inclusive Ranges

For `[L, R]`:

```text
P[R + 1] - P[L]
```

Choose one indexing convention and document it.

## 6. Multiple Queries

For `Q` static range-sum queries:

```text
preprocessing: O(N)
query: O(1)
total: O(N + Q)
```

This is useful when query volume is high relative to updates.

## 7. Prefix XOR

XOR has an inverse-like cancellation property:

```text
x ^ x = 0
x ^ 0 = x
```

Therefore prefix XOR can answer XOR ranges using the same conceptual state-difference pattern.

## 8. Prefix Min/Max Caveat

Subtraction does not generally recover a range minimum or maximum.

This illustrates an important principle:

> A prefix representation works for a query operation only when the stored summary supports the required range composition/inversion.

## 9. Prefix Frequency State

Instead of a numeric sum, prefix state can track cumulative counts of categories.

This can support range-frequency queries, though memory may become `O(N × categories)` without compression or alternative indexing.

## 10. Prefix Balance

Transform categories into signed contributions.

For example:

```text
0 → -1
1 → +1
```

Equal prefix balances imply a zero-sum interval between them.

This connects prefix sums with hash maps for counting or maximizing matching states.

## 11. Prefix Sum + Hash Map

For target-sum subarray counting:

```text
currentPrefix - previousPrefix = target
```

Therefore store frequencies of previous prefix states.

This converts an apparent quadratic enumeration into expected linear hashing time under normal hash-table assumptions.

## 12. Longest Target-Sum Subarray

Store the earliest occurrence of each prefix sum.

When the required earlier state is found again, using its earliest position maximizes interval length.

The stored state differs depending on whether the objective is counting or maximizing length.

## 13. Modular Prefix State

For sums divisible by `K`, equal prefix remainders imply the difference is divisible by `K`.

Normalize negative remainders carefully.

## 14. Difference Array

For range additions over an array, define a difference representation where an update to `[L, R]` changes only its boundaries:

```text
D[L] += delta
D[R + 1] -= delta
```

A prefix reconstruction then recovers the resulting values.

## 15. Difference Invariant

After reconstruction:

> The cumulative sum of difference entries through position `i` equals the final value at `i` relative to the initial baseline.

## 16. Range Updates

With `Q` range-add operations:

```text
update: O(1)
all updates: O(Q)
reconstruct: O(N)
total: O(N + Q)
```

This is substantially cheaper than applying every update to every covered element when ranges are large.

## 17. Initial Values + Difference Updates

For an existing array, initialize its difference representation from adjacent values, then apply range updates to the difference boundaries and reconstruct.

Be precise about whether the first difference includes the original first value.

## 18. Difference Arrays and Event Sweeps

A range can be represented as:

```text
start event: +delta
end event: -delta
```

Scanning events reconstructs active contribution.

This connects difference arrays with sweep-line algorithms and interval overlap counting.

## 19. 2D Prefix Sum

For a matrix, build a summed-area table:

```text
P[r + 1][c + 1]
```

Then a rectangle sum is recovered using four prefix regions through inclusion-exclusion.

## 20. 2D Difference Array

Rectangle updates can similarly be represented by four corner changes in a 2D difference matrix, followed by two-dimensional prefix reconstruction.

The corner signs must be derived from inclusion-exclusion rather than memorized blindly.

## 21. Inclusion-Exclusion

For a rectangle `[r1, r2) × [c1, c2)`:

```text
P[r2][c2]
- P[r1][c2]
- P[r2][c1]
+ P[r1][c1]
```

The same principle generalizes to higher dimensions.

## 22. Prefix State Transformation

The stored state does not have to equal the answer itself.

A useful transformation often turns a relationship between two ranges into equality between prefix states.

Examples:

- balance;
- parity;
- remainder;
- XOR state;
- cumulative frequency signature.

## 23. Prefix + Sliding Window

Prefix sums can provide constant-time range sums inside a window algorithm, but do not automatically replace the window data structure.

Choose the representation based on the operation being optimized.

## 24. Prefix + Binary Search

If prefix values are monotonic, binary search can locate the first position meeting a cumulative threshold.

Negative values can destroy monotonicity, so the prerequisite must be verified.

## 25. Prefix + Greedy

Cumulative quantities can support feasibility checks for greedy algorithms, particularly when decisions depend on accumulated load, capacity, or balance.

## 26. Prefix + DP

Prefix aggregates can reduce transition costs when a DP recurrence depends on range sums.

An `O(N)` transition can sometimes become `O(1)` or `O(log N)` per state after suitable preprocessing.

## 27. Coordinate Compression

When updates or queries use huge sparse coordinates, compress the relevant boundaries before building arrays.

Preserve the mapping between compressed positions and original coordinates.

## 28. Overflow and Numeric Semantics

Prefix sums can exceed individual element magnitude because values accumulate.

In JavaScript, use `Number` only within safe integer requirements or use `BigInt` when exact large-integer arithmetic is required and compatible with the API.

## 29. Backend Applications

Prefix/difference patterns appear in:

- time-series aggregation;
- usage counters;
- billing intervals;
- capacity windows;
- reservation overlap calculations;
- batch updates;
- event-sourced range changes.

## 30. AI Applications

Applications include:

- cumulative feature computation;
- sequence statistics;
- token/category balance state;
- temporal aggregation;
- efficient candidate-window scoring;
- batched region statistics.

## 31. Correctness Proof

For prefix sums, prove the prefix invariant by induction.

For difference arrays, prove that each range update contributes `delta` exactly between its start and end boundaries after reconstruction.

For transformed prefix-state algorithms, prove that equal states are equivalent to the target interval property.

## 32. Complexity

Typical patterns:

```text
1D prefix preprocessing: O(N)
1D range query: O(1)
1D difference update: O(1)
1D reconstruction: O(N)
2D prefix preprocessing: O(RC)
2D rectangle query: O(1)
```

Include memory costs and query/update counts in the full workload analysis.

## 33. Common Mistakes

1. Mixing inclusive and half-open ranges.
2. Off-by-one errors at `R + 1` in difference arrays.
3. Assuming prefix min/max can be inverted like sums.
4. Forgetting to initialize prefix state at zero.
5. Mishandling negative modular remainders.
6. Using binary search when prefix values are not monotone.
7. Ignoring overflow or numeric precision.
8. Building an unnecessarily large frequency-prefix matrix.

## 34. Edge Cases

Test:

- empty array;
- singleton;
- full-range query;
- single-element range;
- range at boundaries;
- negative values;
- zero target;
- negative modulo values;
- update ending at the last index;
- overlapping updates;
- no updates;
- large accumulated totals.

## 35. Interview Framework

When repeated range operations appear:

```text
1. Are values static or updated?
2. Is the query operation invertible/composable?
3. Can I store cumulative state?
4. Is the range convention explicit?
5. For updates, can I encode only boundary changes?
6. Is the prefix state monotone?
7. Can hashing exploit equal prefix states?
8. Would 2D inclusion-exclusion apply?
9. What are N, Q, and dimensionality?
10. What preprocessing/memory trade-off is acceptable?
```

## 36. Revision Checklist

- [ ] I can derive 1D prefix sums.
- [ ] I can answer range sums in O(1).
- [ ] I understand prefix XOR.
- [ ] I can combine prefix state with hashing.
- [ ] I can derive target-sum subarray counting.
- [ ] I understand modular prefix states.
- [ ] I can derive difference-array range updates.
- [ ] I understand sweep-line interpretation.
- [ ] I can derive 2D prefix/difference formulas.
- [ ] I can explain backend and AI applications.

## 37. Key Takeaways

1. **Prefix structures trade preprocessing and memory for fast repeated range queries.**
2. **Difference arrays trade deferred reconstruction for cheap repeated range updates.**
3. **The deeper pattern is cumulative state: transform a range relationship into a relationship between prefix states.**
4. **Hash maps, binary search, greedy methods, and DP frequently compose with prefix representations.**
5. **Boundary conventions and algebraic properties must be explicit; not every aggregate supports prefix subtraction.**
