# 12.14 — Heap-Based Selection: Top-K, Kth Element & Streaming Selection

## Objective

Selection asks for only part of an ordering rather than the complete sorted sequence. Heaps are especially useful when `K` is small relative to `N`, when data arrives as a stream, or when a full sort would perform unnecessary work.

## 1. Selection vs Sorting

Sorting produces a complete order.

Selection asks questions such as:

- What is the largest element?
- What is the smallest element?
- What is the kth smallest/largest element?
- What are the top `K` values?

If only a small portion is required, full sorting can be unnecessary.

## 2. Top-K Largest

Maintain a **min-heap of size K**.

For each value:

```text
if heap has fewer than K → insert
else if value > heap root → replace root
```

The root represents the smallest member of the current top-K set.

## 3. Complexity

For `N` inputs and heap capacity `K`:

```text
Time:  O(N log K)
Space: O(K)
```

If `K` is constant, this is effectively linear in `N`.

## 4. Top-K Smallest

Use a **max-heap of size K**. The root is the largest element currently retained in the smallest-K set.

The logic is symmetric.

## 5. Why the Heap Is Bounded

The heap does not need to store all `N` values. Once it contains the best `K` candidates seen so far, a new candidate only needs to compete with the current boundary element.

## 6. Full Sort Comparison

Full sorting costs approximately:

```text
O(N log N)
```

while bounded-heap selection costs:

```text
O(N log K)
```

This difference matters when `K << N`.

## 7. Kth Largest

A min-heap of size `K` can find the kth largest element. After processing all values, the heap root is the kth largest.

## 8. Kth Smallest

A max-heap of size `K` can find the kth smallest element.

## 9. Heap Size Is the Key Parameter

Always distinguish:

```text
N = total input size
K = requested selection size
```

The algorithm's complexity depends on both.

## 10. Streaming Selection

For an unbounded or unknown stream, a bounded heap is attractive because memory does not grow with the total number of observed values.

For top-K largest:

```text
memory = O(K)
```

regardless of stream length.

## 11. Online Invariant

After processing any prefix of the stream, the heap contains the top-K elements of that prefix, subject to the chosen tie-breaking rule.

This invariant is the foundation of correctness.

## 12. Proof of Top-K Correctness

Assume the heap contains the top-K elements of the processed prefix.

For a new value `x`:

- if fewer than K elements are stored, `x` belongs in the retained set;
- otherwise the root is the smallest retained candidate;
- if `x` is not greater than that boundary, it cannot belong in the top-K set;
- if `x` is greater, replacing the root restores the top-K set.

Thus the invariant is preserved.

## 13. Duplicates and Ties

Define whether equal values may be selected arbitrarily or whether stable source order matters. If stable ranking is required, include a sequence number in the comparator.

## 14. Objects

For objects, separate:

```text
payload
ranking key
stable tie-breaker
```

This prevents business data from being confused with priority metadata.

## 15. Composite Ranking

A ranking comparator may use multiple fields:

```text
score descending
→ timestamp ascending
→ id ascending
```

The comparator must define a consistent total ordering for deterministic selection.

## 16. Streaming Input

A streaming selector can process each record once and retain only K candidates. This is useful for logs, telemetry, large datasets, and continuously generated AI candidates.

## 17. Unknown N

Heap-based top-K does not require knowing the total number of stream elements in advance. This is a major advantage over strategies that depend on precomputing an input size.

## 18. K = 0

A production API must define behavior for `K = 0`. Usually the result is empty and no heap entries are retained.

## 19. K > N

For finite input, either return all available elements or reject the request according to the API contract. Do not silently assume `K <= N` unless the constraints guarantee it.

## 20. K = N

When `K` equals the entire input size, bounded heap selection offers little memory advantage over storing everything and can approach full-ordering work. Algorithm selection should consider the actual workload.

## 21. Partial Ordering

A top-K heap does not automatically return its K elements sorted. If sorted output is required, extract or sort the retained K elements after selection.

This adds roughly:

```text
O(K log K)
```

for final ordering.

## 22. Alternative: Quickselect

Quickselect can find a kth element in expected linear time and can be performed in-place. It is useful when the entire finite dataset is available and only a rank statistic is needed.

Its standard randomized form has expected `O(N)` time but `O(N²)` worst-case behavior unless a stronger selection strategy is used.

## 23. Heap Selection vs Quickselect

| Property | Bounded Heap | Quickselect |
|---|---|---|
| Streaming | Excellent | Not naturally streaming |
| Space | O(K) | Often O(1) auxiliary |
| Top-K set | Direct | Requires partition handling |
| kth element | O(N log K) | Expected O(N) |
| Worst-case | O(N log K) | O(N²) for ordinary randomized/naive variants |

Choose based on workload and output requirements.

## 24. Alternative: Full Sort

Full sorting remains simple and can be appropriate when:

- `K` is close to `N`;
- sorted output is required;
- the runtime's sort is highly optimized;
- implementation simplicity dominates.

## 25. Database Connection

Database systems frequently perform top-N queries using indexes, ordered scans, sorting, or bounded priority structures. The algorithm should account for whether data can already be produced in order by an index.

## 26. Backend Applications

Heap-based selection is useful for:

- top customers;
- highest-priority jobs;
- largest events;
- latency percentiles' supporting structures in some contexts;
- bounded log analysis;
- API ranking endpoints.

## 27. AI Applications

Common uses include:

- top-K model candidates;
- beam-search candidates;
- retrieval result selection;
- recommendation ranking;
- nearest/farthest candidate maintenance.

## 28. Top-K Retrieval Pipeline

A scalable pipeline can be:

```text
generate candidates
→ score candidates
→ maintain bounded heap
→ retain K
→ optionally sort K
→ return results
```

This avoids sorting every candidate.

## 29. Distributed Top-K

For distributed systems:

```text
local top-K per worker
→ merge local candidate sets
→ global top-K
```

Each worker can discard candidates that cannot affect its local top-K result.

The final merge operates on at most `W × K` candidates for `W` workers before reducing to K.

## 30. External-Memory Selection

When data exceeds RAM, process chunks and retain local top-K results. Merge the bounded candidate sets rather than loading the entire dataset into memory.

## 31. Memory Pressure

A heap of size K provides predictable bounded storage, but each retained object may still be large. Store references or compact ranking records when possible.

## 32. Comparator Cost

If scoring/comparison is expensive, avoid recomputing ranking keys. Decorate entries with computed keys when appropriate:

```text
compute key once
→ compare cached key
```

This trades memory for reduced repeated computation.

## 33. NaN and Invalid Scores

AI and telemetry pipelines can produce invalid numeric values. Define a policy for `NaN`, missing scores, infinities, and malformed records before ranking.

## 34. Correctness Invariants

For top-K largest using a min-heap:

```text
heap size <= K
all discarded values <= heap root boundary
heap contains the K largest values seen so far when size = K
```

The exact inequality depends on tie-breaking.

## 35. Testing

Test:

- empty input;
- `K = 0`;
- `K = 1`;
- `K = N`;
- `K > N`;
- duplicates;
- all equal values;
- negative values;
- already sorted input;
- reverse sorted input;
- streaming chunks;
- object ranking;
- custom tie-breaking.

## 36. Differential Testing

Compare heap selection with a trusted full-sort reference for random datasets. Verify both the selected set and, when required, the final sorted order.

## 37. Benchmarking

Measure:

- total processing time;
- comparisons;
- heap replacements;
- memory usage;
- allocations;
- final K-ordering cost;
- throughput for streaming input.

Benchmark multiple `N/K` ratios rather than one dataset.

## 38. Common Mistakes

1. Using a max-heap for top-K largest when a min-heap boundary is needed.
2. Sorting all N elements unnecessarily.
3. Forgetting the heap-size limit.
4. Returning an unsorted top-K set when sorted output was required.
5. Ignoring ties.
6. Assuming K is always small.
7. Recomputing expensive ranking keys repeatedly.

## 39. Interview Framework

```text
Need top K from N
→ ask whether streaming
→ if K << N, use bounded heap
→ top-K largest → min-heap
→ top-K smallest → max-heap
→ keep heap size ≤ K
→ O(N log K), O(K)
→ optionally sort K results
→ compare with quickselect/full sort
```

## Revision Checklist

- [ ] I can derive top-K largest using a min-heap.
- [ ] I can derive top-K smallest using a max-heap.
- [ ] I understand why memory is O(K).
- [ ] I can prove the streaming invariant.
- [ ] I can handle ties and composite ranking.
- [ ] I can compare heap selection with quickselect and sorting.
- [ ] I can design distributed top-K selection.
- [ ] I can apply it to backend and AI ranking systems.

## Key Takeaways

1. **Selection often avoids the work of producing a complete sorted order.**
2. **A bounded heap gives `O(N log K)` time and `O(K)` space for top-K selection.**
3. **The heap root acts as the boundary between retained and discarded candidates.**
4. **The bounded-memory property makes heap selection naturally suited to streams.**
5. **For production systems, compare heap selection with indexes, full sorting, quickselect, and distributed strategies based on workload.**
