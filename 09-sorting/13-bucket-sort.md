# 09.13 — Bucket Sort

## 1. Definition

Bucket Sort distributes elements into a collection of buckets, sorts each bucket, and concatenates the buckets in bucket order.

```text
classify → distribute → sort buckets → concatenate
```

It is especially useful when the input distribution allows values to be mapped into a manageable number of ordered ranges.

## 2. Why It Matters

Bucket Sort teaches:

- distribution-based sorting;
- domain partitioning;
- expected versus worst-case complexity;
- local sorting inside partitions;
- histogram-like bucketing;
- distribution assumptions;
- hybrid algorithm design.

## 3. Mental Model

Imagine sorting exam scores into ranges:

```text
0–9   → bucket 0
10–19 → bucket 1
20–29 → bucket 2
...
```

Sort each bucket, then read buckets from lowest to highest.

## 4. Core Algorithm

A generic Bucket Sort pipeline is:

1. determine bucket policy;
2. create buckets;
3. map every element to a bucket;
4. sort each bucket using a local algorithm;
5. concatenate buckets in order.

## 5. Bucket Mapping

For normalized values in `[0, 1)`, a common mapping is:

```text
bucketIndex = floor(value × bucketCount)
```

For arbitrary numeric domains, first define:

```text
normalized position
→ bucket index
```

The mapping must cover the intended domain without accidental overlap or gaps.

## 6. Correctness Invariant

After distribution:

```text
every input element appears in exactly one bucket
```

and bucket order establishes that every element in an earlier bucket is no greater than every element in a later bucket, according to the bucket-domain contract.

After sorting each bucket, concatenation produces global sortedness.

## 7. Complexity Model

Let:

```text
n = number of elements
k = number of buckets
```

Distribution costs `O(n)`.

Total sorting cost depends on bucket sizes and the local sorting algorithm.

If data is reasonably distributed across buckets and each bucket is small, expected performance can approach linear time for suitable local sorting strategies.

Worst-case behavior can degrade to the complexity of sorting nearly all `n` elements in one bucket.

## 8. Expected vs Worst Case

Bucket Sort's performance depends on a distribution assumption.

If all values fall into one bucket:

```text
one large local sort
```

can dominate the runtime.

Therefore always distinguish:

```text
expected/distribution-dependent behavior
vs
worst-case behavior
```

## 9. Local Sorting Algorithm

Buckets can be sorted with:

- Insertion Sort;
- Merge Sort;
- Quicksort;
- another appropriate local algorithm.

Insertion Sort is historically common for small buckets because small local arrays can make its low overhead attractive.

## 10. Bucket Count

Too few buckets:

```text
large buckets
→ expensive local sorting
```

Too many buckets:

```text
many buckets
→ allocation and management overhead
```

The bucket count is therefore an engineering parameter tied to `n`, distribution, memory, and local-sort cost.

## 11. Uniform Distribution Example

For approximately uniform values in `[0,1)` and `k ≈ n` buckets, the expected bucket size can remain small.

The exact expected runtime depends on the local sorting strategy and distribution assumptions.

Uniformity is an assumption, not a guarantee.

## 12. Non-Uniform Data

Skewed distributions can create overloaded buckets.

Examples:

```text
most values near 0
→ bucket 0 becomes large
```

A production design should measure or understand distribution rather than blindly assuming uniformity.

## 13. Adaptive Bucket Policies

Possible strategies include:

- sampling the input before choosing bucket boundaries;
- quantile-based boundaries;
- dynamically splitting overloaded buckets;
- using a fallback sort for large buckets.

These approaches turn Bucket Sort into a more sophisticated distribution-aware sorting system.

## 14. Range-Based Buckets

For known numeric ranges, bucket boundaries can be explicit:

```text
[-100,-50)
[-50,0)
[0,50)
[50,100)
```

Boundary semantics must be unambiguous, especially around exact endpoints.

## 15. Histogram Connection

Bucketization resembles histogram construction:

```text
value → interval → count
```

Bucket Sort goes one step further by retaining the elements and sorting within each interval.

This makes it conceptually useful for data-processing pipelines.

## 16. Stability

Basic Bucket Sort is not automatically stable.

Stability depends on:

1. whether distribution preserves insertion order within each bucket;
2. whether the local sorting algorithm is stable;
3. whether concatenation preserves bucket order.

A stable implementation must make all three properties explicit.

## 17. In-Place Behavior

A typical Bucket Sort uses multiple bucket containers, so it is not naturally `O(1)` auxiliary space.

Space commonly includes:

```text
bucket structures + references/elements + local-sort storage
```

The exact bound depends on the representation.

## 18. Sparse Buckets

Creating `k` empty arrays can be wasteful when `k` is much larger than the number of populated buckets.

Alternatives include:

- lazy bucket creation;
- maps keyed by bucket index;
- compact bucket metadata followed by one storage area.

Memory layout should match the domain and workload.

## 19. Objects and Key Selectors

For records, define:

```js
keySelector(record)
```

The key selector should produce an ordered value that the bucket mapping understands.

Do not mix object identity with ordering semantics.

## 20. Strings and Non-Numeric Keys

Bucket Sort can be generalized when keys can be mapped into ordered ranges or categories.

For strings, this may mean prefixes or alphabet ranges, but locale-aware ordering requires explicit collation semantics.

Do not assume lexical code-unit order is equivalent to human-language collation.

## 21. Bucket Boundaries

A boundary policy should specify whether intervals are:

```text
[left, right)
```

or another consistent convention.

Every value should map to exactly one bucket.

This is a correctness requirement, not merely an implementation detail.

## 22. Backend Applications

Bucket-based ordering can appear in:

- score/range partitioning;
- histogram-driven preprocessing;
- log/event bucketing;
- time-window partitioning;
- distributed data partitioning;
- approximate workload segmentation.

For large database result sets, database indexes and sort operators may be preferable to application-side bucket sorting.

## 23. AI Applications

Bucketization is common in AI/data systems for:

- score ranges;
- feature discretization;
- quantile buckets;
- candidate partitioning;
- histogram preprocessing;
- workload sharding.

Bucket Sort provides an algorithmic foundation for understanding these distribution-based pipelines.

## 24. Bucket Sort vs Counting Sort

| Property | Bucket Sort | Counting Sort |
|---|---|---|
| Main idea | Distribute into ordered ranges | Count exact discrete keys |
| Domain | Ordered ranges/distributions | Compact discrete keys |
| Distribution sensitivity | High | Lower, but range-sensitive |
| Local sorting | Usually required | Reconstruction from counts |
| Typical space | Bucket-dependent | Key-range-dependent |

The two techniques can also be combined in hybrid designs.

## 25. Bucket Sort vs Radix Sort

Radix Sort decomposes keys into digit positions.

Bucket Sort partitions the key domain into ranges.

A useful distinction is:

```text
Radix → representation-driven decomposition
Bucket → value/distribution-driven partitioning
```

## 26. Bucket Sort vs Comparison Sort

Comparison sorts are broadly applicable to arbitrary ordered values.

Bucket Sort can exploit known domain structure to reduce local sorting work, but its efficiency depends on a useful bucket mapping and distribution.

## 27. Complexity Accounting

For bucket sizes:

```text
n₁, n₂, ..., nₖ
```

and local sorting cost `S`, total work can be reasoned about as:

```text
O(n) + Σ S(nᵢ)
```

This is more informative than assigning a single complexity without considering bucket occupancy.

## 28. Adversarial Distribution

An adversarial or highly skewed input can intentionally overload one bucket.

A robust implementation can:

- detect oversized buckets;
- repartition them;
- switch local sorting strategy;
- impose memory limits.

## 29. Benchmarking

Benchmark while varying:

- number of buckets;
- distribution uniformity;
- skew;
- duplicate rate;
- local sorting algorithm;
- `n`;
- key range.

Measure bucket occupancy statistics in addition to elapsed time.

## 30. Bucket Occupancy Metrics

Useful metrics include:

```text
max bucket size
mean bucket size
variance
number of empty buckets
number of populated buckets
```

These metrics explain why a configuration performs well or poorly.

## 31. Common Mistakes

1. Assuming uniform distribution without justification.
2. Mapping boundary values into the wrong bucket.
3. Creating an excessive number of buckets.
4. Ignoring overloaded buckets.
5. Assuming Bucket Sort is automatically stable.
6. Forgetting local-sort complexity.
7. Claiming a universal `O(n)` bound.
8. Mixing numeric normalization with arbitrary comparator semantics.
9. Ignoring memory overhead from bucket containers.
10. Benchmarking only one distribution.

## 32. Edge Cases

Test:

- empty;
- singleton;
- all equal;
- all values in one bucket;
- one value per bucket;
- values exactly on boundaries;
- negative ranges;
- skewed distributions;
- duplicate-heavy data;
- sparse populated buckets;
- object records with tied keys.

## 33. Testing Strategy

Verify:

```text
every element assigned exactly once
bucket boundaries are correct
bucket ordering is correct
local buckets are sorted
final result is sorted
permutation is preserved
stability if promised
```

Property-based tests are particularly useful for bucket-boundary bugs.

## 34. Interview Questions

1. What is Bucket Sort?
2. What assumptions does it make about the input distribution?
3. Why can its expected behavior approach linear time?
4. What causes worst-case degradation?
5. How should bucket count be chosen?
6. What role does the local sorting algorithm play?
7. Is Bucket Sort stable?
8. How does Bucket Sort differ from Counting Sort?
9. How does it differ from Radix Sort?
10. How would you make a bucket-based sorter robust to skewed data?

## 35. Revision Checklist

- [ ] I can explain distribution-based sorting.
- [ ] I can design a bucket mapping.
- [ ] I can prove every value maps to exactly one bucket.
- [ ] I understand expected versus worst-case behavior.
- [ ] I can account for local bucket sorting cost.
- [ ] I understand stability requirements.
- [ ] I can reason about bucket count and memory.
- [ ] I can detect skewed bucket occupancy.
- [ ] I can compare Bucket, Counting, and Radix Sort.
- [ ] I can design tests for boundary and distribution failures.

## 36. Key Takeaways

1. **Bucket Sort distributes values into ordered ranges and sorts each range locally.**
2. **Its performance depends strongly on bucket occupancy and the input distribution.**
3. **A useful complexity model is `O(n) + Σ S(nᵢ)`.**
4. **Uniform or well-behaved distributions can make local buckets small, while skew can create a costly overloaded bucket.**
5. **Bucket count is an explicit engineering trade-off between local sorting work and bucket overhead.**
6. **Stability is a property of the complete distribution, local sort, and concatenation design.**
7. **Bucketization is widely useful beyond sorting, including backend data partitioning and AI preprocessing.**
8. **The deeper lesson is to exploit domain and distribution structure while continuously validating the assumptions that make the optimization effective.**
