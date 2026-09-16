# 12.16 — Advanced Heap Patterns: K-Way Merge, Streaming & Multi-Heap Techniques

## Objective

This chapter combines heap fundamentals into reusable patterns for merging ordered sources, maintaining streaming boundaries, coordinating multiple priority classes, and designing bounded-memory selection systems.

## 1. K-Way Merge

Given `K` individually sorted sequences, a min-heap can merge them into one sorted sequence.

Instead of placing every element in the heap, store only the current head from each source.

## 2. K-Way Merge Algorithm

For each non-empty source:

```text
insert its first element
→ extract smallest
→ advance that source
→ insert its next element
→ repeat
```

## 3. Complexity

If there are `K` sources and `N` total elements:

```text
Time:  O(N log K)
Space: O(K)
```

excluding the storage of the input sources and output representation.

## 4. Why O(K) Heap Space

At most one active candidate per source is maintained. The heap therefore represents the frontier between consumed and unconsumed elements.

## 5. K-Way Merge Invariant

At every step, the heap contains the smallest not-yet-output element from each non-exhausted source.

Therefore the heap root is globally the smallest remaining element.

## 6. Merge Sorted Files / Streams

The same pattern applies to multiple ordered streams, log partitions, database cursors, and external-memory files.

Only the current record from each source needs to be resident in the priority structure.

## 7. Stable K-Way Merge

If equal keys require source-order stability, store metadata such as:

```text
sourceId
sequenceWithinSource
```

and include deterministic tie-breaking in the comparator.

## 8. Object Records

For records, separate:

```text
record
sortKey
sourceId
sequence
```

Avoid recomputing expensive sort keys during every comparison.

## 9. Streaming Top-K

The bounded heap pattern from selection can process an unbounded stream while retaining only K candidates.

The heap represents the current boundary of the best K elements seen so far.

## 10. Two Fundamental Heap Roles

A heap can represent either:

```text
frontier → next item to process
boundary → worst retained item among selected candidates
```

Recognizing which role is needed is a powerful problem-solving skill.

## 11. Heap of Sources vs Heap of Candidates

K-way merge uses one candidate per source.

Top-K uses one candidate per retained position.

Both are bounded representations of a much larger logical dataset.

## 12. Multi-Heap Architecture

Complex schedulers can maintain multiple heaps for different priorities or policies:

```text
urgent heap
normal heap
background heap
```

A dispatcher chooses which heap to inspect according to a scheduling policy.

## 13. Fairness

Priority alone can starve lower-priority work. Production systems may combine priority with aging, quotas, weighted scheduling, or deadlines.

The heap is then only one component of the scheduling policy.

## 14. Deadline + Priority

A robust scheduler may order by:

```text
deadline
→ priority
→ sequence
```

This turns the heap comparator into an explicit business policy.

## 15. Multi-Level Queues

A multi-level scheduler may use independent queues and a global policy instead of one universal comparator.

This can make operational behavior easier to reason about, but policy correctness must be tested separately from heap correctness.

## 16. Hierarchical Heaps

Large systems can maintain local heaps and periodically merge their candidate sets. This is useful when work is partitioned across workers or shards.

## 17. Distributed K-Way Merge

Each worker can produce an ordered stream. A coordinator maintains a heap containing one head per worker.

Network latency becomes part of the effective cost model.

## 18. Backpressure

If the consumer cannot keep up, unbounded buffering is dangerous. Heap-backed pipelines should define capacity and backpressure semantics explicitly.

## 19. Lazy vs Eager Source Advancement

After extracting a source head, the next element can be fetched immediately or asynchronously. In distributed systems, asynchronous fetching changes the algorithm into a coordination problem rather than a purely local heap operation.

## 20. Asynchronous K-Way Merge

A production design may maintain:

```text
ready candidates → heap
pending fetches → async state
exhausted sources → terminal state
```

The heap contains only candidates that are currently available.

## 21. Failure Handling

A source can fail, timeout, return malformed records, or terminate early. Define whether the merge:

- fails globally;
- skips the source;
- retries;
- substitutes another source;
- records an error and continues.

## 22. Duplicate Sources

If the same logical source appears more than once, the output may contain duplicates. Source identity and deduplication are separate concerns from ordering.

## 23. K-Way Merge with Duplicates

Equal values should normally be emitted according to the comparator's tie policy. Do not deduplicate unless the API explicitly requires unique output.

## 24. External-Memory Merge

External sorting commonly creates sorted runs and then merges them with a bounded heap. The heap size is proportional to the number of active runs rather than total records.

## 25. Replacement Selection

Heaps can also help create long sorted runs from data larger than memory by maintaining a working heap and separating elements that cannot belong to the current run.

This connects heap operations to external sorting.

## 26. Sliding-Window Extremes

For a moving window, heaps can track candidate extrema, but stale entries must be identified and removed. Indexed heaps or lazy deletion are common approaches.

## 27. Lazy Deletion

Instead of immediately removing an expired entry:

```text
mark stale
→ leave in heap
→ discard when it reaches root
```

This simplifies some implementations but can increase memory and cleanup work.

## 28. Dual Heaps

Some problems require both lower and upper partitions. Two heaps can maintain:

```text
max-heap → lower half
min-heap → upper half
```

This is the classic running-median pattern.

## 29. Running Median

Maintain approximately half the values in each heap and keep the sizes balanced.

The median is then available from one or both roots depending on parity.

## 30. Median Correctness Invariant

For two heaps:

```text
all lower-half values <= all upper-half values
size difference <= 1
```

These invariants, not the heaps alone, define correctness.

## 31. Heap-Based Interval Processing

Priority queues can order interval endpoints, deadlines, or active events. This supports sweep-line algorithms and event simulation.

## 32. Event Simulation

A discrete-event simulator can store future events in a min-heap ordered by timestamp and deterministic sequence number.

Extracting the root advances simulation time to the next event.

## 33. Backend Applications

Advanced heap patterns appear in:

- distributed log merging;
- scheduled jobs;
- event queues;
- deadline processing;
- top-K analytics;
- streaming ranking;
- external data processing;
- multi-tenant scheduling.

## 34. AI Applications

Useful patterns include:

- multi-source retrieval merging;
- beam candidate management;
- top-K generation;
- best-first search;
- streaming recommendation ranking;
- distributed candidate aggregation.

## 35. AI Retrieval Merge

A retrieval service may receive ranked results from multiple indexes:

```text
index A → sorted candidates
index B → sorted candidates
index C → sorted candidates
        ↓
      min/max heap
        ↓
 global ranked stream
```

This avoids materializing every candidate before producing the first result.

## 36. Candidate Deduplication

Ordering and deduplication can be combined carefully:

```text
heap → next ranked candidate
seen set → identity deduplication
```

The heap answers **what comes next**; the set answers **whether it was already emitted**.

## 37. Correctness Composition

When combining multiple structures, prove each invariant independently and then prove their interaction.

Example:

```text
heap invariant
+ source cursor invariant
+ dedup invariant
= correct ranked merge
```

## 38. Complexity Model

For K-way merge, track at least:

```text
N = total records
K = active sources
C = comparator cost
F = source-fetch cost
```

A realistic model is approximately:

```text
O(N log K × C) + source-fetch/network cost
```

## 39. Benchmarking

Benchmark different `N/K` ratios, source lengths, duplicate rates, comparator costs, and source latency distributions.

For streaming systems also measure:

- first-result latency;
- throughput;
- memory;
- queue depth;
- backpressure;
- tail latency.

## 40. Common Mistakes

1. Storing every element instead of one head per source.
2. Forgetting to advance the source after extraction.
3. Ignoring empty sources.
4. Assuming equal values imply duplicates.
5. Mixing ordering and deduplication semantics.
6. Ignoring stale entries in sliding-window heaps.
7. Treating a heap as the entire scheduling policy.
8. Ignoring asynchronous source failures.

## 41. Interview Framework

```text
Multiple sorted sources
→ keep one head per source
→ heap by head value
→ extract minimum
→ advance that source
→ insert next head
→ O(N log K), O(K)
```

For top-K:

```text
stream + small K
→ bounded opposite heap
→ retain only competitive candidates
→ O(N log K), O(K)
```

## Revision Checklist

- [ ] I can derive K-way merge from a heap.
- [ ] I can prove the one-head-per-source invariant.
- [ ] I can derive O(N log K).
- [ ] I understand stable multi-source ordering.
- [ ] I can design streaming and external-memory merges.
- [ ] I understand lazy deletion and stale entries.
- [ ] I can use dual heaps for running median.
- [ ] I can combine heaps with sets and maps safely.
- [ ] I can apply these patterns to backend and AI systems.

## Key Takeaways

1. **K-way merge uses a heap as a frontier containing one candidate per active source.**
2. **Bounded heaps turn large or unbounded datasets into manageable streaming algorithms.**
3. **Multi-heap systems require policy invariants in addition to heap invariants.**
4. **K-way merge naturally extends to distributed and external-memory processing.**
5. **Advanced heap engineering is primarily about choosing what the heap represents and proving that representation remains correct.**
