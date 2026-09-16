# 12.19 — Heap Engineering: Memory Layout, Cache Locality, Allocation, Comparators & Performance Optimization

## Objective

Asymptotically correct heap code can still perform poorly in production. This chapter studies the engineering factors behind real heap performance: representation, locality, allocation, comparator cost, mutation, garbage collection, and benchmarking.

## 1. Algorithm vs Implementation

Two implementations can both be `O(log N)` while having very different latency and throughput.

Performance depends on:

- comparisons;
- memory accesses;
- allocations;
- cache behavior;
- branch behavior;
- garbage collection;
- synchronization;
- data representation.

## 2. Array-Backed Heap

A binary heap is naturally compact when represented in an array.

For zero-based indexing:

```text
parent(i) = floor((i - 1) / 2)
left(i)   = 2i + 1
right(i)  = 2i + 2
```

No explicit child pointers are required.

## 3. Memory Locality

Array storage places nearby heap nodes in nearby memory locations more often than pointer-heavy representations. This can improve cache utilization during traversal.

## 4. Why Locality Matters

A heap operation performs a path of comparisons and swaps. The theoretical path length is logarithmic, but actual cost depends on how cheaply those memory accesses and comparisons execute.

## 5. Object Representation

A heap may store:

```text
primitive value
```

or:

```text
{ value, priority, id, metadata }
```

Rich objects improve expressiveness but can increase memory footprint and indirection.

## 6. Parallel Arrays

For performance-sensitive workloads, related fields may be stored separately:

```text
priorities[]
ids[]
payloads[]
```

This can change memory-access behavior and may allow operations to inspect only the fields required for comparison.

## 7. Structure of Arrays vs Array of Structures

Array-of-structures is convenient:

```text
entries[i] = { priority, id, payload }
```

Structure-of-arrays can reduce unnecessary data movement when only one field is hot.

The right choice depends on workload measurements.

## 8. Comparator Cost

Heap complexity is often stated in comparisons, but comparisons themselves can be expensive.

If comparator cost is `C`, an operation may be better modeled as:

```text
O(log N × C)
```

## 9. Expensive Comparators

Avoid repeatedly computing expensive keys:

```text
compare(a, b)
→ parse date
→ normalize string
→ compute score
```

Prefer precomputed keys when correctness permits.

## 10. Decorate-Compare-Undecorate

A common optimization is:

```text
input
→ compute key once
→ store { key, value }
→ compare keys
→ return value
```

This trades memory for lower repeated computation.

## 11. Comparator Purity

A comparator should be deterministic with respect to the values being compared. External mutable state can invalidate heap ordering assumptions.

## 12. Comparator Tie-Breaking

Deterministic ties can use:

```text
priority
→ sequence number
```

This makes behavior reproducible and easier to debug.

## 13. Stable Priority Queues

If equal priorities must preserve insertion order, store an explicit monotonic sequence number. Do not rely on incidental object or runtime ordering.

## 14. Swapping Cost

A heap sift operation may swap complete objects. Large payloads increase movement cost.

A better design can store compact heap entries containing an ID/index into separate payload storage.

## 15. Indirection Trade-Off

Indirect storage can reduce heap-entry movement but adds an extra lookup. Whether it helps depends on payload size and access pattern.

## 16. Allocation Behavior

Repeatedly creating temporary wrapper objects can increase allocation pressure and garbage-collection work.

Prefer stable representations and reuse where the complexity is justified.

## 17. Mutation vs Persistence

In-place heaps usually minimize allocation and are appropriate for mutable scheduling systems.

Persistent heaps can support snapshots and immutable workflows but generally require additional structural sharing and allocation.

## 18. Garbage Collection

In garbage-collected runtimes, high allocation rates can increase GC frequency and tail latency. Benchmark heap operations under realistic allocation behavior.

## 19. JavaScript Arrays

JavaScript engines optimize arrays based on their element representations. Mixing incompatible element kinds or creating sparse arrays can affect optimization behavior.

Keep heap storage dense and structurally predictable.

## 20. Avoiding Sparse Heaps

A heap array should normally remain contiguous from index `0` through `size - 1`.

Do not use array holes to represent removed entries.

## 21. Array Length Discipline

After extraction, shrink logical size immediately. Physical capacity and logical length are separate engineering concerns in lower-level implementations; JavaScript implementations should keep the representation consistent with the intended access pattern.

## 22. Capacity Growth

Dynamic arrays may periodically allocate larger backing storage and copy elements. Such operations can be expensive individually but may have amortized linear behavior over many appends.

## 23. Preallocation

If maximum heap size is known, preallocation can reduce repeated capacity growth. The trade-off is reserved memory.

## 24. Branch Behavior

Sift-down often needs to choose between two children. A predictable, minimal comparison structure can reduce unnecessary work.

Correctness always comes before micro-optimization.

## 25. Child Selection

For a min-heap, select the smaller child before comparing it with the parent.

Choosing the wrong child can preserve one local relation while violating the heap invariant below it.

## 26. Iterative vs Recursive Sifting

Iterative sift-up/down avoids recursive call overhead and stack growth. Heap paths are logarithmic, but iterative loops are generally the natural implementation for production heaps.

## 27. Build-Heap Optimization

Bottom-up heap construction is `O(N)`, while inserting N values one at a time is `O(N log N)` in the straightforward approach.

Use bottom-up construction when all input values are available.

## 28. Heapify Locality

Bottom-up heapify processes internal nodes from the last parent toward the root. Most nodes are near the leaves and therefore move only a small distance.

## 29. Heap Sort Engineering

Heap sort provides `O(N log N)` worst-case time and in-place array sorting, but its memory-access behavior may differ from algorithms with more cache-friendly sequential access.

Algorithm choice should consider workload requirements rather than asymptotics alone.

## 30. Indexed Heaps

Indexed heaps add an ID-to-position mapping. This enables efficient priority updates but adds metadata maintenance during every swap.

## 31. Swap Metadata Correctly

For indexed heaps, every swap must update:

```text
heap position
↔
ID → position map
```

A stale mapping is a correctness bug, not merely a performance issue.

## 32. Lazy Deletion

Lazy deletion avoids immediate structural removal but retains stale entries. This reduces mutation complexity at the cost of extra memory and cleanup work.

## 33. Memory Bounds

If stale entries accumulate without a bound, a logically small queue can consume large physical memory.

Define cleanup or rebuild policies when using lazy deletion.

## 34. Rebuild Strategies

A heap can occasionally rebuild from live entries when stale-entry density crosses a threshold. Rebuild cost should be modeled as part of the amortized or operational policy.

## 35. Backend Performance

Backend heap workloads include:

- job scheduling;
- retry queues;
- delayed events;
- top-K analytics;
- priority-based rate limiting.

Measure throughput, memory, and tail latency under realistic concurrency.

## 36. AI Performance

AI workloads may involve:

- A* frontiers;
- beam candidates;
- retrieval ranking;
- top-K inference;
- GPU scheduling.

Comparator cost can dominate when scores require expensive feature computation.

## 37. Score Precomputation

If an AI candidate score is stable for the queue lifetime, compute it once and store the scalar score in the heap entry rather than recomputing it during every comparison.

## 38. Heap Size Control

AI search frontiers can grow rapidly. Bounding the frontier or using beam/top-K pruning can trade completeness for memory and latency.

Such a trade-off must be explicit.

## 39. Benchmark Design

Benchmark separate dimensions:

```text
heap size
operation mix
entry size
comparator cost
allocation rate
stale-entry rate
```

Do not benchmark only one synthetic workload.

## 40. Warmup

JIT-compiled runtimes may optimize code after repeated execution. Benchmarks should account for warmup and avoid comparing cold startup with steady-state throughput unintentionally.

## 41. Measurement Noise

Run repeated trials and report distributions. Single timing samples can be misleading because of scheduling, GC, thermal effects, and other system activity.

## 42. Tail Latency

For backend systems, p95/p99 operation latency may matter more than mean latency. GC pauses and contention can disproportionately affect tails.

## 43. Differential Benchmarking

Compare implementations under identical input streams and operation sequences. Keep the workload deterministic when possible.

## 44. Correctness Before Speed

An optimized heap must preserve:

```text
shape invariant
+ heap-order invariant
+ metadata invariant
```

A faster incorrect heap is not an optimization.

## 45. Profiling

Profile before changing implementation details. Identify whether the dominant cost is:

- comparison;
- array access;
- allocation;
- GC;
- synchronization;
- serialization;
- external I/O.

## 46. Complexity Ledger

Track both theoretical and practical costs:

```text
asymptotic operations
+ comparator cost
+ memory traffic
+ allocation
+ synchronization
+ external work
```

## 47. Common Mistakes

1. Assuming all `O(log N)` implementations are equally fast.
2. Recomputing expensive keys during comparisons.
3. Moving huge payload objects unnecessarily.
4. Ignoring garbage collection.
5. Using sparse arrays for heap storage.
6. Forgetting indexed-map updates after swaps.
7. Ignoring stale-entry memory growth.
8. Optimizing before profiling.
9. Reporting only average latency.

## 48. Interview Framework

```text
Need a fast heap
→ choose representation
→ define comparator cost
→ minimize allocation
→ preserve dense storage
→ optimize sift operations
→ precompute expensive keys
→ benchmark realistic workloads
→ measure tail latency
→ verify invariants
```

## Revision Checklist

- [ ] I can explain why array-backed heaps have useful locality.
- [ ] I understand array-of-structures vs structure-of-arrays trade-offs.
- [ ] I can model comparator cost separately from heap complexity.
- [ ] I know when to precompute comparison keys.
- [ ] I understand allocation and GC effects.
- [ ] I can engineer indexed heaps without stale mappings.
- [ ] I can reason about lazy deletion memory growth.
- [ ] I can design realistic heap benchmarks.
- [ ] I can connect heap performance to backend and AI workloads.

## Key Takeaways

1. **Heap Big-O describes algorithmic growth, not complete machine-level performance.**
2. **Representation, locality, comparator cost, allocation, and GC can materially change observed latency.**
3. **Precomputed keys and compact heap entries are powerful optimizations when measurement justifies them.**
4. **Indexed and lazy heaps introduce metadata and memory-management costs that must be explicitly bounded.**
5. **Profile first, optimize second, and verify invariants after every optimization.**
