# 09.11 — Counting Sort

## 1. Definition

Counting Sort is a non-comparison sorting algorithm for values drawn from a manageable discrete integer range. Instead of comparing elements, it counts how many times each value occurs and reconstructs the sorted sequence from those counts.

```text
values → frequency counts → ordered reconstruction
```

## 2. Why It Matters

Counting Sort teaches an important algorithmic principle: sorting does not always require pairwise comparisons.

It connects:

- frequency arrays;
- direct addressing;
- range-dependent complexity;
- stable distribution;
- prefix sums;
- radix sorting;
- memory/time trade-offs.

## 3. Core Assumption

For the simplest form, keys are integers from a bounded range:

```text
min ... max
```

The algorithm is attractive when the key range is not disproportionately larger than the number of elements.

## 4. Mental Model

Given:

```text
[4, 2, 2, 8, 3, 3, 1]
```

count occurrences:

```text
1 → 1
2 → 2
3 → 2
4 → 1
8 → 1
```

Then emit each value according to its frequency.

## 5. Range and Offset

If values can be negative, use an offset based on the minimum key.

For:

```text
[-3, -1, -3, 2]
```

an index can be derived from:

```text
index = value - min
```

This maps the smallest key to index `0`.

## 6. Basic Algorithm

1. find `min` and `max`;
2. allocate a count array of size `max - min + 1`;
3. count each value;
4. traverse counts in key order;
5. reconstruct the sorted output.

## 7. Complexity

Let:

```text
n = number of elements
k = key range size = max - min + 1
```

A straightforward implementation costs approximately:

```text
Time:  O(n + k)
Space: O(k)
```

A stable output-building version can require additional `O(n)` output storage.

The key point is that complexity depends on both `n` and the key range.

## 8. Why Range Matters

Suppose:

```text
n = 100
min = 0
max = 1,000,000,000
```

Allocating one counter per possible key is impractical.

Therefore `O(n + k)` is not automatically better than `O(n log n)`; the value of `k` matters.

## 9. Comparison-Free Sorting

Counting Sort does not compare pairs of input values to determine their relative order.

It uses key-to-index mapping.

This is why the usual comparison-sorting lower bound does not directly constrain Counting Sort.

## 10. Stable Counting Sort

A stable Counting Sort is useful when each item contains a key plus associated data.

The standard stable construction uses:

1. frequency counts;
2. prefix sums to determine positions;
3. a left-to-right traversal of the input;
4. placement into an output array.

The traversal direction and position update rule are essential to preserving relative order.

## 11. Prefix Sums

Given counts:

```text
count = [2, 3, 1]
```

prefix positions can determine where each key's block begins or ends.

For stable placement, the cumulative count for each key represents the next available position for that key.

## 12. Correctness

For basic Counting Sort:

- every input value increments exactly one counter;
- reconstruction emits exactly the counted number of occurrences for every key;
- keys are emitted in nondecreasing order.

Therefore the result is a sorted permutation of the input.

For stable Counting Sort, additionally prove that equivalent-key records are emitted according to their original relative order.

## 13. Stable Placement Invariant

During stable reconstruction, maintain:

```text
all already placed records occupy their correct key range
and
within each key, placed records preserve input order.
```

The next input record is placed at the next available position for its key.

## 14. In-Place Reconstruction

If only keys matter, counts can be expanded directly back into the input array.

This avoids a separate `O(n)` output array but does not make the count-array storage disappear.

Stable record sorting generally requires an output buffer or another mechanism for preserving associated records.

## 15. Sparse Ranges

When the key range is huge but only a few keys occur, a dense count array wastes memory.

Possible alternatives include:

- a hash map of frequencies;
- coordinate compression;
- sparse counting structures.

But these change the algorithm and its complexity characteristics.

## 16. Coordinate Compression

If the actual distinct keys are manageable:

```text
collect keys
→ sort unique keys
→ map keys to compact ranks
→ count ranks
```

This can make counting feasible for sparse domains, but the key-ranking stage itself introduces sorting or indexing work.

## 17. Negative Values

Negative integers are supported naturally by offsetting from `min`.

Always validate the offset arithmetic and range size before allocating the count array.

## 18. Large Numeric Ranges

Do not allocate an array based on an unchecked `max - min`.

Production code should consider:

- maximum allowed range;
- integer safety;
- memory limits;
- sparse distribution;
- fallback sorting strategy.

## 19. Comparator Limitation

Counting Sort is fundamentally key-domain driven rather than arbitrary-comparator driven.

It works naturally for ordered discrete keys where direct indexing is meaningful.

For arbitrary objects, first extract an appropriate integer key or use another sorting strategy.

## 20. Counting Sort vs Comparison Sorts

| Property | Counting Sort | Comparison Sort |
|---|---|---|
| Pairwise comparisons | No | Yes |
| Typical time | O(n + k) | Often O(n log n) |
| Key-domain dependency | Strong | Lower |
| Extra memory | Range-dependent | Algorithm-dependent |
| Stable variants | Yes | Some are stable |
| Best use | Compact discrete key range | General-purpose ordering |

Neither complexity expression dominates universally because `k` can vary dramatically.

## 21. Counting Sort vs Hash Frequency Counting

Both can count frequencies, but their goals differ.

A hash map handles arbitrary keys and stores only observed keys, while a dense count array directly indexes the key domain.

Dense counting can have excellent constant factors when the range is compact.

## 22. Backend Applications

Potential uses include:

- bounded status codes;
- small integer priorities;
- categorical IDs after controlled compression;
- histogram generation;
- frequency aggregation;
- bounded event attributes.

For large arbitrary IDs, a database index, hash map, or comparison-based ordering may be more appropriate.

## 23. AI Applications

Counting-style techniques can support:

- token frequency metadata for bounded IDs;
- label histograms;
- discretized feature distributions;
- bucketed scores;
- compact categorical preprocessing.

For large token vocabularies or sparse IDs, specialized sparse structures are often preferable.

## 24. Relationship to Radix Sort

Counting Sort is a fundamental component of many Radix Sort implementations.

Radix Sort repeatedly sorts by digit/group using a stable counting procedure.

Understanding stable Counting Sort therefore prepares you for digit-wise non-comparison sorting.

## 25. Overflow and Safety

JavaScript implementations must consider numeric safety when computing:

```text
max - min + 1
```

and when indexing arrays.

Do not assume arbitrary integer inputs automatically produce safe array sizes.

## 26. Memory Engineering

The main memory decision is the count structure:

```text
O(k)
```

If `k` is large, memory can dominate runtime.

A production implementation should validate range size before allocation and choose an alternative when the domain is unsuitable.

## 27. Benchmarking

Benchmark against comparison sorting while varying:

- `n`;
- `k`;
- number of distinct keys;
- negative/positive distribution;
- duplicate frequency;
- sparse versus dense ranges.

Measure both elapsed time and memory allocation.

## 28. Common Mistakes

1. Ignoring the key-range size.
2. Allocating an enormous count array.
3. Mishandling negative values.
4. Forgetting to offset keys.
5. Claiming stable behavior without preserving input order.
6. Confusing frequency counting with stable sorting.
7. Using Counting Sort for arbitrary non-discrete keys.
8. Ignoring JavaScript numeric/index safety.
9. Forgetting permutation preservation.
10. Assuming `O(n + k)` always beats `O(n log n)`.

## 29. Edge Cases

Test:

- empty;
- singleton;
- all equal;
- duplicates;
- negative values;
- zero;
- narrow range with huge `n`;
- huge range with small `n`;
- sparse keys;
- dense keys;
- records with equal keys for stability.

## 30. Testing Strategy

Verify:

```text
sortedness
permutation preservation
frequency preservation
range validation
stability when promised
```

For stable records, attach original indices and verify that equal-key records retain their original order.

## 31. Interview Questions

1. What makes Counting Sort different from comparison sorting?
2. What are `n` and `k` in its complexity?
3. Why can `O(n + k)` be impractical?
4. How do you support negative integers?
5. How do you make Counting Sort stable?
6. Why are prefix sums useful?
7. Can Counting Sort sort arbitrary objects?
8. What happens when the key range is sparse?
9. How is Counting Sort related to Radix Sort?
10. When should you fall back to another sorting algorithm?

## 32. Revision Checklist

- [ ] I can implement basic Counting Sort.
- [ ] I can derive `O(n + k)` time.
- [ ] I can explain `O(k)` count storage.
- [ ] I understand why key range matters.
- [ ] I can handle negative values with an offset.
- [ ] I can implement stable placement using prefix counts.
- [ ] I can explain sparse-range alternatives.
- [ ] I understand the relationship with Radix Sort.
- [ ] I can validate memory/range constraints before allocation.
- [ ] I can compare Counting Sort with comparison-based sorting based on workload.

## 33. Key Takeaways

1. **Counting Sort uses key frequencies instead of pairwise comparisons.**
2. **Its core complexity is `O(n + k)`, where `k` is the key-range size.**
3. **A compact key domain is essential for the dense-array approach.**
4. **Negative keys can be handled with an offset.**
5. **Stable Counting Sort uses cumulative counts to place records while preserving equal-key order.**
6. **Huge or sparse ranges can make dense counting impractical.**
7. **Counting Sort is a foundational building block for Radix Sort.**
8. **The deeper lesson is to exploit structure in the key domain rather than automatically applying comparison-based algorithms.**
