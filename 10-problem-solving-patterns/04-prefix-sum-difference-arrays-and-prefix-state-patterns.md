# 10.04 — Prefix Sum, Difference Arrays & Prefix-State Patterns

## 1. Objective

Prefix techniques convert repeated range computation into incremental state.

The core transformation is:

```text
repeated range work
→ precompute cumulative state
→ answer or update ranges using boundary information
```

## 2. Prefix Sum

For values `a[0..n-1]`, define:

```text
P[0] = 0
P[i + 1] = P[i] + a[i]
```

Then:

```text
sum(l..r) = P[r + 1] - P[l]
```

This turns a range-sum query into constant-time arithmetic after linear preprocessing.

## 3. Why It Exists

Brute-force range sums repeatedly scan the same elements.

Prefix sums store cumulative information once so later queries reuse it.

## 4. Prefix vs Sliding Window

Prefix sums are useful when:

- arbitrary ranges are queried;
- values may be negative;
- the dataset is static or changes infrequently.

Sliding windows are useful when a contiguous active range moves incrementally and the validity condition is monotonic.

## 5. Prefix Minimum / Maximum

Not every prefix state is additive.

Examples:

```text
prefixMin[i] = min(values[0..i])
prefixMax[i] = max(values[0..i])
```

These support queries whose semantics depend on historical extrema.

## 6. Suffix State

Suffix arrays process information from the opposite direction:

```text
suffix[i] = aggregate(values[i..n-1])
```

Common uses include:

- right-side maximum;
- right-side minimum;
- future feasibility;
- split-point problems.

## 7. Prefix and Suffix Combination

Some problems require both sides of a position.

Examples:

- product except self;
- split-point optimization;
- left/right maximum calculations;
- boundary contribution problems.

The important skill is identifying what information each direction must provide.

## 8. Prefix Frequency State

Instead of numeric sums, prefix state can represent counts.

For a category `x`:

```text
count(l..r) = prefixCount[r + 1] - prefixCount[l]
```

This is useful when the category domain is manageable or represented by a map.

## 9. Prefix XOR

XOR has a cancellation property:

```text
x ^ x = 0
x ^ 0 = x
```

Therefore:

```text
xor(l..r) = PX[r + 1] ^ PX[l]
```

This supports constant-time range XOR queries after linear preprocessing.

## 10. Difference Arrays

Prefix sums answer many range queries efficiently.

Difference arrays perform many range updates efficiently.

For an inclusive update `[l, r] += delta`:

```text
D[l] += delta
D[r + 1] -= delta
```

A prefix sum of `D` reconstructs the final values.

## 11. Why Difference Arrays Work

The update marks where the effect starts and where it stops.

Prefix accumulation propagates that effect across the intended interval.

This is a discrete form of boundary encoding.

## 12. Multiple Range Updates

For `Q` range additions:

```text
O(Q)
```

updates can be recorded in a difference array, followed by:

```text
O(N)
```

reconstruction.

Total:

```text
O(N + Q)
```

instead of potentially `O(NQ)` direct updates.

## 13. Half-Open Intervals

A clean alternative is to use:

```text
[l, r)
```

Then:

```text
D[l] += delta
D[r] -= delta
```

Half-open conventions often simplify boundaries.

## 14. 2D Prefix Sums

For a matrix, define a cumulative rectangle state.

A rectangle sum can then be obtained using inclusion-exclusion:

```text
P(bottom,right)
- P(top,right)
- P(bottom,left)
+ P(top,left)
```

The exact indices depend on the chosen padded representation.

## 15. 2D Difference Arrays

Rectangle updates can similarly be represented by four corner changes.

After all updates, perform cumulative reconstruction across both dimensions.

This generalizes the one-dimensional difference-array idea.

## 16. Prefix Hashing

A prefix representation can combine with hashing to detect repeated states.

A classic pattern is:

```text
same prefix state at i and j
→ the region between them has the required neutral property
```

The exact state depends on the problem.

## 17. Prefix Sum + Hash Map

For a target subarray sum:

If:

```text
prefix[j] - prefix[i] = target
```

then:

```text
prefix[i] = prefix[j] - target
```

A hash map can store previously seen prefix sums and turn repeated range search into expected linear time.

## 18. Counting Subarrays

For counting subarrays with sum `K`:

```text
currentPrefix
needed = currentPrefix - K
```

The frequency of `needed` among previous prefixes contributes to the answer.

This is a foundational pattern:

```text
prefix state + frequency map
```

## 19. Zero-Sum Subarrays

Equal prefix sums imply a zero-sum region between their positions.

This follows directly from subtraction:

```text
P[j] = P[i]
→ P[j] - P[i] = 0
```

## 20. Longest Range from Repeated State

Instead of counting repeated states, store the earliest occurrence.

When the same state appears again, the distance between positions gives the longest candidate range.

The choice between storing counts and earliest positions depends on the required output.

## 21. Modular Prefix State

For divisibility problems, maintain prefix sums modulo `K`.

If two prefix sums have the same remainder modulo `K`, their difference is divisible by `K`.

Handle negative remainders consistently in JavaScript.

## 22. Prefix State Beyond Sums

A prefix state can encode:

- parity;
- balance of two categories;
- bitmask state;
- modular state;
- frequency signature;
- custom algebraic aggregates.

The central requirement is that the relationship between two prefix states can reveal the desired subrange property.

## 23. Balance Transformation

For problems involving equal counts of two categories, map one category to `+1` and the other to `-1`.

Then equal prefix sums indicate equal counts over the intervening range.

This is an important example of changing the representation to expose a prefix-state invariant.

## 24. Difference Arrays + Coordinate Compression

When update coordinates are sparse or huge, direct allocation may be impossible.

Coordinate compression can reduce the representation to relevant boundaries, provided interval semantics and reconstruction logic remain correct.

## 25. Dynamic Updates

Ordinary prefix sums are poor for frequent arbitrary updates because changing one value can invalidate many prefixes.

For dynamic workloads, consider:

- Fenwick trees;
- segment trees;
- other indexed aggregate structures.

This establishes the bridge from static prefix techniques to dynamic range-query data structures.

## 26. Memory Trade-Off

Prefix arrays use additional memory to reduce query time.

Alternatives include:

- storing only necessary state;
- block decomposition;
- on-demand computation;
- database/materialized aggregates.

The right choice depends on query volume and memory constraints.

## 27. Backend Applications

Prefix and difference techniques appear in:

- cumulative metrics;
- time-series analytics;
- batch range updates;
- log aggregation;
- quota calculations;
- offline event processing;
- billing intervals.

## 28. AI Applications

Applications include:

- cumulative token statistics;
- sequence feature aggregation;
- interval annotations;
- temporal feature engineering;
- batched range updates;
- prefix-state sequence algorithms.

## 29. Correctness Invariants

For prefix sums:

> `P[i]` represents exactly the aggregate of the first `i` elements.

For difference arrays:

> The reconstructed prefix state includes exactly the net effect of every update whose start boundary has been crossed and whose end boundary has not been crossed.

For prefix + hash map:

> The stored prefix states correspond exactly to valid earlier boundaries under the chosen indexing convention.

## 30. Complexity

Typical static prefix sum:

```text
Build: O(N)
Query: O(1)
Space: O(N)
```

Difference array:

```text
Updates: O(Q)
Reconstruction: O(N)
Total: O(N + Q)
```

Prefix + hash map:

```text
Time: expected O(N)
Space: O(N)
```

State the assumptions behind hash performance.

## 31. Common Mistakes

1. Off-by-one errors.
2. Mixing inclusive and half-open intervals.
3. Forgetting the zero prefix.
4. Updating `r + 1` outside valid bounds without guarding.
5. Mishandling negative modulo values.
6. Using prefix sums when frequent updates make them stale.
7. Confusing prefix state equality with value equality.
8. Forgetting 2D inclusion-exclusion signs.
9. Storing the wrong occurrence when finding longest ranges.
10. Ignoring memory costs.

## 32. Edge Cases

Test:

- empty array;
- one element;
- zero values;
- negative values;
- target zero;
- updates touching index zero;
- updates touching the final index;
- overlapping updates;
- duplicate prefix states;
- negative modulo values;
- single-cell matrices.

## 33. Interview Framework

When repeated range work appears:

```text
1. Is the data static?
2. Is the operation additive/invertible?
3. Are there many queries?
4. Can cumulative state answer a range from two boundaries?
5. Are there many range updates instead?
6. Can boundary markers represent updates?
7. Do negative values matter?
8. Would hashing repeated prefix states help?
9. Are dynamic updates required?
```

## 34. Revision Checklist

- [ ] I can derive 1D prefix sums.
- [ ] I can answer arbitrary range sums.
- [ ] I understand prefix/suffix state.
- [ ] I can use prefix frequencies.
- [ ] I understand prefix XOR.
- [ ] I can derive difference arrays.
- [ ] I can handle multiple range updates.
- [ ] I understand 2D prefix sums.
- [ ] I can combine prefix state with hashing.
- [ ] I know when Fenwick/segment trees are needed instead.

## 35. Key Takeaways

1. **Prefix techniques store cumulative state so repeated range work can be reused.**
2. **Difference arrays encode range updates through boundary changes and reconstruct the final state with a prefix pass.**
3. **Prefix state can represent much more than sums: XOR, parity, balance, modulo, masks, and custom states.**
4. **Hashing repeated prefix states is a powerful way to detect or count subarrays with specific properties.**
5. **Static prefix techniques are not a universal answer; dynamic updates may require Fenwick trees, segment trees, or other structures.**
