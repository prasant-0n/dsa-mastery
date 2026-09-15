# 03.11 — Sorting + Array Patterns

## Definition

Sorting is both an algorithmic operation and a **representation transformation**. By putting data into a useful order, many array problems become easier to solve with scanning, binary search, two pointers, grouping, intervals, and greedy reasoning.

The central idea is:

> **Sort when ordering exposes structure that is worth the sorting cost.**

Sorting is not automatically an optimization. Its cost and its effect on original order must be part of the decision.

---

# 1. Why Sorting Matters

Sorting can transform an unstructured array into one where:

- equal values become adjacent;
- smaller/larger values can be eliminated quickly;
- binary search becomes possible;
- two pointers become possible;
- intervals become orderable;
- duplicates can be grouped;
- greedy choices become easier to justify;
- ranking and Top-K workflows can be simplified.

A problem that appears unrelated to sorting may become straightforward after the right ordering transformation.

---

# 2. Sorting Cost

For comparison-based sorting, a common target is:

```text
O(N log N)
```

If the input is already sorted, you may not need to sort at all.

If the input is unsorted and your algorithm becomes linear after sorting:

```text
O(N log N) + O(N) = O(N log N)
```

Do not report only the post-sort scan complexity.

---

# 3. JavaScript Sorting

JavaScript provides:

```js
arr.sort((a, b) => a - b);
```

For numeric data, the comparator is essential because default sorting compares values as strings.

Also remember that `sort()` mutates the array.

If mutation is forbidden:

```js
const sorted = [...arr].sort((a, b) => a - b);
```

but copying introduces `O(N)` additional storage.

---

# 4. Stable Sorting

A stable sort preserves the relative order of records with equal keys.

Example:

```text
(A, 5), (B, 5), (C, 3)
```

Sorting by score stably gives:

```text
(C, 3), (A, 5), (B, 5)
```

Stability matters when sorting records through multiple criteria or preserving an earlier ordering.

Do not assume every language/runtime/version has the same implementation details. Reason from the required contract, not implementation trivia.

---

# 5. Sorting as a Representation Transform

Before sorting:

```text
[7, 2, 9, 2, 4]
```

After sorting:

```text
[2, 2, 4, 7, 9]
```

Now:

- duplicates are adjacent;
- pair sums have monotonic behavior;
- binary search is available;
- range boundaries are easier to identify.

This is why sorting often appears as the first phase of a larger algorithm.

---

# 6. Sort + Scan

A powerful pattern is:

```text
sort → one linear scan
```

Applications:

- duplicate detection;
- frequency runs;
- interval merging;
- gap detection;
- closest differences;
- grouping equal values.

Typical complexity:

```text
O(N log N)
```

The scan does not change the dominant sorting term.

---

# 7. Duplicate Detection

For an unsorted array, you can:

### Hash-based

Expected `O(N)` time and `O(N)` memory.

### Sort + scan

`O(N log N)` time and sorting-dependent auxiliary memory.

After sorting, duplicates are adjacent, so a single scan detects them.

Choice depends on:

- memory budget;
- mutation allowance;
- deterministic behavior;
- whether sorted order is useful later.

---

# 8. Pair Problems

Sorting can enable two pointers.

For target pair sum:

```text
sort
↓
left/right pointers
```

The sort costs `O(N log N)`, while the two-pointer scan costs `O(N)`.

This is often preferable when:

- output needs sorted structure;
- memory is constrained;
- many pair relationships are queried.

Hashing may still be better for a single unsorted pair-sum query if original order and `O(N)` expected time matter more.

---

# 9. Three Sum

The standard strategy:

1. sort;
2. fix index `i`;
3. use two pointers for the remaining range;
4. skip duplicates.

Complexity:

```text
O(N²)
```

after accounting for `O(N log N)` sorting.

The important pattern is composition:

```text
sorting + two pointers + duplicate control
```

---

# 10. Closest Pair / Closest Difference

Sorting makes neighboring values meaningful.

For the minimum absolute difference between any pair:

```text
sort
scan adjacent differences
```

Why is this sufficient?

For sorted values, any non-adjacent pair has at least one adjacent pair between them whose difference is no larger.

Therefore the global minimum occurs among adjacent values.

Complexity:

- sorting: `O(N log N)`;
- scan: `O(N)`;
- total: `O(N log N)`.

---

# 11. Interval Problems

Sorting by interval start is one of the most important transformations for interval algorithms.

Example:

```text
[5,7]
[1,4]
[3,6]
```

Sort by start:

```text
[1,4]
[3,6]
[5,7]
```

Now overlapping intervals can be processed sequentially.

This leads directly to merging intervals and scheduling problems.

---

# 12. Merge Intervals

After sorting by start:

1. keep the current merged interval;
2. compare the next interval's start with the current end;
3. overlap → extend end;
4. no overlap → emit current and start a new interval.

Typical complexity:

```text
O(N log N)
```

for sorting plus `O(N)` merging.

The invariant is:

> The output contains correctly merged intervals for all processed input intervals, and the active interval represents all overlapping processed intervals that have not yet been finalized.

---

# 13. Interval Overlap Semantics

Be precise about whether endpoints touching count as overlap.

For closed intervals:

```text
[a,b] and [b,c]
```

may be considered overlapping.

For half-open intervals:

```text
[a,b) and [b,c)
```

are adjacent but not overlapping.

Boundary semantics change conditions and must be part of the contract.

---

# 14. Meeting / Scheduling Patterns

Sort intervals by start time to detect conflicts.

For a simple overlap check:

```text
current.start < previous.end
```

or `<=`, depending on endpoint semantics.

For minimum resources/rooms, sorting start/end events or using a heap can be appropriate.

The correct solution depends on whether the question asks for:

- existence of conflict;
- merged ranges;
- maximum concurrent intervals;
- assignment to resources.

---

# 15. Sort + Frequency

Sorting groups equal values into contiguous runs.

A run can be processed with two indices:

```text
start of run → end of run
```

This supports:

- frequency counting;
- compression;
- duplicate removal;
- run-length encoding;
- grouping.

If the value domain is small and bounded, a frequency array may beat sorting.

---

# 16. Sort + Binary Search

Sorting once can turn repeated searches into efficient queries.

For static data:

```text
sort: O(N log N)
Q binary searches: O(Q log N)
```

Total:

```text
O(N log N + Q log N)
```

Compared with `Q` linear scans:

```text
O(NQ)
```

Sorting becomes more attractive as query volume grows.

---

# 17. Sort + Prefix / Range Queries

Sorting can make value-range queries easier.

For example, after sorting, binary search can find:

- first value `>= L`;
- first value `> R`.

The number of values in `[L,R]` is then:

```text
upperBound(R) - lowerBound(L)
```

This combines:

```text
sorting + binary search + boundary reasoning
```

---

# 18. Top-K: Sorting vs Heap

If you need all values sorted:

```text
sort → O(N log N)
```

If you need only the largest/smallest `K`, a heap may achieve:

```text
O(N log K)
```

when `K << N`.

This is an important selection principle:

> Do not fully sort data when the output only requires a small extreme subset.

However, if sorted output is required, full sorting may still be necessary.

---

# 19. Partial Sorting / Selection

If only the `K`th smallest/largest element is needed, selection algorithms such as Quickselect can avoid fully sorting.

Typical expected complexity:

```text
O(N)
```

with worst-case behavior depending on pivot strategy.

This is another example of matching computation to the required output.

---

# 20. Counting Sort Connection

If keys are integers in a manageable range, comparison sorting is not always necessary.

Counting can achieve:

```text
O(N + K)
```

where `K` is the key range.

Therefore algorithm selection depends on:

- `N`;
- key range `K`;
- memory budget;
- stability requirements;
- output ordering.

---

# 21. Sorting and Original Order

Sorting destroys original positional order unless you preserve indices.

A common strategy is to store records such as:

```js
{ value, originalIndex }
```

Then sort by `value` while retaining the original location.

This costs additional memory but preserves information needed for reconstruction.

Always ask whether the problem's answer depends on original indices.

---

# 22. Sorting and Mutation

Three distinct choices:

### Mutate

```js
arr.sort(...)
```

Low additional memory but changes caller-visible state.

### Copy

```js
const sorted = [...arr].sort(...)
```

Preserves input but costs `O(N)` memory.

### Index / record representation

Sort references or records when original positions are needed.

The correct choice depends on the contract and workload.

---

# 23. Common Array Patterns Unlocked by Sorting

Sorting can enable:

- two pointers;
- binary search;
- interval merging;
- duplicate grouping;
- nearest-neighbor scans in one dimension;
- greedy selection;
- range counting;
- run compression;
- coordinate compression.

Recognize sorting as a **preprocessing transformation** rather than merely a standalone operation.

---

# 24. Pattern Composition

Many strong solutions combine multiple techniques.

Examples:

```text
Sort + two pointers
Sort + binary search
Sort + scan
Sort + frequency
Sort + intervals
Sort + greedy
Sort + coordinate compression
Sort + heap / selection
```

The final complexity must include every phase.

---

# 25. When Sorting Is a Bad Choice

Avoid sorting when:

- original order is essential and cannot be reconstructed;
- a hash solution gives expected `O(N)` with acceptable memory;
- the input is already ordered;
- only a small Top-K result is needed and a heap is cheaper;
- the numeric domain allows counting/radix techniques;
- sorting cost dominates and provides no useful structure.

Sorting is a tool, not a default.

---

# Backend Applications

### Event Reconciliation

Sort records by timestamp or ID, then scan to merge or compare streams.

### Log Processing

Sort events to expose temporal relationships and detect gaps/conflicts.

### Batch Deduplication

Sort IDs and compact adjacent duplicates before bulk processing.

### Scheduling

Sort jobs by deadline, start time, duration, or another decision key before applying a greedy strategy.

### Pagination / Querying

Ordered data enables binary-search boundaries and efficient range selection when the underlying storage/index supports the ordering.

Production concerns include database-side sorting cost, indexes, memory, disk spills, and whether sorting should occur in the application or data store.

---

# AI Applications

### Candidate Ranking

Sort candidates by score when a complete ranking is required.

### Top-K Retrieval

Prefer heap/selection when only a small `K` is required rather than fully sorting every candidate.

### Multi-Source Merge

Sort/merge candidate streams from multiple retrieval systems.

### Dataset Preparation

Ordering data can support batching, grouping, deduplication, and deterministic evaluation.

### Token / Sequence Processing

Sorting can be useful for offline grouping by length, but it can destroy semantic order if applied directly to token sequences. Preserve sequence order whenever it is part of the model semantics.

---

# Correctness Framework

For **sort + scan**, the key proof is:

> Sorting establishes the ordering property; the scan processes each adjacent/grouped relationship exactly once.

For **sort + two pointers**:

> Sorted order makes pointer movement monotonic and allows rejected regions to be proven impossible.

For **merge intervals**:

> After processing the sorted prefix, every emitted interval is final, while the active interval contains all overlapping processed intervals that can still merge.

For **range counting**:

> `lowerBound` identifies the first allowed value and `upperBound` identifies the first excluded value, so their difference equals the number of values in the requested range.

---

# Complexity Summary

| Pattern | Typical Time | Extra Space |
|---|---:|---:|
| Sort + scan | `O(N log N)` | sorting-dependent |
| Sort + two pointers | `O(N log N)` | sorting-dependent |
| Sort + binary searches | `O(N log N + Q log N)` | preprocessing-dependent |
| Merge intervals | `O(N log N)` | output/sort-dependent |
| Min adjacent difference | `O(N log N)` | sort-dependent |
| Three Sum | `O(N²)` | output/sort-dependent |
| Top-K via full sort | `O(N log N)` | sorting-dependent |
| Top-K via heap | `O(N log K)` | `O(K)` |
| Counting sort | `O(N + K)` | `O(K)` |
| Quickselect expected | `O(N)` | recursion-dependent |

---

# Common Mistakes

1. Forgetting numeric comparator in JavaScript.
2. Forgetting that `sort()` mutates the array.
3. Claiming `O(N)` after sorting without including sorting.
4. Sorting when original order matters.
5. Ignoring stability requirements.
6. Using full sorting for a small Top-K task.
7. Applying interval conditions with incorrect endpoint semantics.
8. Forgetting duplicate handling in Three Sum.
9. Ignoring key-range opportunities for counting sort.
10. Losing original indices after sorting.
11. Assuming sorting is always better than hashing.
12. Ignoring database/storage-level sorting costs in backend systems.

---

# Interview Framework

1. What structure does sorting create?
2. Is the input already sorted?
3. Can mutation be allowed?
4. Must original indices/order survive?
5. What is the sorting cost?
6. What pattern becomes possible after sorting?
7. Could hashing, heap, counting, or selection be better?
8. What invariant does the post-sort scan maintain?
9. What are the duplicate and boundary semantics?
10. What is the complete time/space complexity?

---

# Revision Checklist

- [ ] I understand sorting as representation transformation.
- [ ] I can calculate sort + scan complexity.
- [ ] I know JavaScript numeric sorting requirements.
- [ ] I understand stable sorting.
- [ ] I can detect duplicates after sorting.
- [ ] I can combine sorting with two pointers.
- [ ] I understand Three Sum.
- [ ] I can solve closest-difference problems after sorting.
- [ ] I understand interval sorting and merging.
- [ ] I can combine sorting with binary search.
- [ ] I understand Top-K sorting vs heap selection.
- [ ] I understand Quickselect at a conceptual level.
- [ ] I know when counting sort can beat comparison sorting.
- [ ] I understand original-order/index preservation.
- [ ] I can reason about mutation vs copying.
- [ ] I can compose multiple array patterns.
- [ ] I can prove the key invariants.
- [ ] I can connect sorting to backend systems.
- [ ] I can connect sorting to AI retrieval/ranking.

## Key Takeaways

1. Sorting is often valuable because it **creates structure** for another algorithm.
2. Always include sorting cost in the total complexity.
3. Sort + scan, sort + two pointers, sort + binary search, and sort + intervals are foundational compositions.
4. Full sorting is wasteful when only a small Top-K or single order statistic is required.
5. Key-domain constraints can make counting/radix methods preferable to comparison sorting.
6. Sorting may destroy original order, so preserve indices or copy only when required.
7. Stability, mutation, endpoint semantics, and duplicate handling are part of correctness.
8. The expert question is not “Should I sort?” but **“What useful structure does sorting create, and is that structure worth its cost?”**
