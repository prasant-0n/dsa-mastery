# 09.16 — External Sorting & K-Way Merge

## 1. Definition

External Sorting is used when the dataset is too large to fit comfortably in available memory. The data is divided into manageable chunks, each chunk is sorted independently, persisted, and then merged into one globally sorted result.

```text
large dataset
→ memory-sized chunks
→ sort each chunk
→ persist sorted runs
→ k-way merge
→ final ordered stream
```

## 2. Why It Matters

This chapter connects classical sorting with real backend and data-engineering systems where storage, memory, I/O, and throughput matter as much as CPU complexity.

It teaches:

- external-memory models;
- sorted runs;
- multiway merging;
- priority queues;
- sequential I/O;
- buffering;
- spill-to-disk strategies;
- memory budgeting;
- backpressure;
- failure and recovery concerns.

## 3. Internal vs External Sorting

**Internal sorting** assumes the working dataset fits in memory.

**External sorting** assumes the dataset exceeds available memory and therefore uses persistent storage as part of the algorithm.

The dominant cost model changes from primarily CPU operations to a combination of:

```text
CPU + memory + storage I/O
```

## 4. External-Memory Mental Model

The key abstraction is a block/page transfer between storage and memory.

Instead of counting only individual element operations, reason about:

```text
number of blocks transferred
+ sequential vs random access
+ buffer size
```

This often explains practical performance better than ordinary RAM-only Big-O.

## 5. Phase 1 — Run Generation

Read a memory-sized chunk:

```text
read chunk
→ sort in memory
→ write sorted run
```

Repeat until the input is exhausted.

Each resulting file/segment is individually sorted.

## 6. Run Invariant

Every generated run must satisfy:

```text
run is sorted
run contains exactly the elements assigned to it
```

The collection of runs must collectively preserve the complete input multiset.

## 7. Phase 2 — Merge

If there are multiple sorted runs, merge them into a single sorted sequence.

A two-way merge repeatedly compares the heads of two runs.

A k-way merge generalizes this to `k` runs.

## 8. K-Way Merge Mental Model

Suppose:

```text
R1: 1  7  12
R2: 2  5  13
R3: 3  8  10
```

Maintain the smallest current element from each run.

```text
heap:
R1 → 1
R2 → 2
R3 → 3
```

Extract the smallest, emit it, then replace it with the next element from that same run.

## 9. Why a Heap Is Useful

With `k` active runs, a min-heap provides:

```text
extract minimum: O(log k)
insert replacement: O(log k)
```

Thus merging `N` total elements is commonly modeled as:

```text
O(N log k)
```

plus the cost of reading and writing the runs.

## 10. K-Way Merge Correctness

At every step:

```text
heap contains the smallest un-emitted element from each non-exhausted run
```

Therefore the heap root is the smallest remaining global element.

Emitting it and inserting the next value from that run preserves the invariant.

## 11. Stability

For records with equal keys, stable external sorting requires a deterministic tie policy.

A common strategy is to attach metadata such as:

```text
(runId, sequenceNumber)
```

and use it as a secondary ordering key.

The required semantics should be specified before implementation.

## 12. Memory Budget

External sorting still requires careful memory management.

Budget memory for:

- input buffers;
- output buffers;
- sort workspace;
- heap entries;
- per-run metadata;
- serialization/deserialization overhead.

Do not allocate the entire dataset merely because storage contains it.

## 13. Buffering

Sequential buffered I/O reduces the number of storage operations.

Instead of reading one record at a time:

```text
read block → process many records → refill
```

The optimal buffer size depends on the storage system and workload.

## 14. Sequential vs Random I/O

External algorithms should generally favor sequential access when possible.

Random storage access can be significantly more expensive than sequential streaming, depending on the storage medium and system.

This is why sorted runs and buffered merges are so important.

## 15. Multi-Pass Merge

If the number of runs exceeds the number that can be merged simultaneously, use multiple merge passes:

```text
many runs
→ merge groups
→ intermediate runs
→ merge again
→ final run
```

The fan-in determines the number of passes and memory required for buffers.

## 16. Merge Fan-In

Larger fan-in can reduce the number of merge passes but requires more active buffers and heap entries.

Therefore:

```text
higher fan-in
→ fewer passes
→ more memory per merge
```

Choose fan-in based on available memory, I/O characteristics, and implementation overhead.

## 17. External Complexity

Let:

```text
N = total records
B = records per memory block
M = records fitting in memory
K = merge fan-in
```

An external-memory analysis focuses on block transfers rather than only CPU comparisons.

A high-level model is:

```text
run generation I/O
+ multi-pass merge I/O
+ CPU work for sorting and heap management
```

Exact I/O complexity depends on block size, fan-in, and number of merge passes.

## 18. Replacement Selection

A more advanced run-generation technique is replacement selection.

Instead of sorting exactly one memory-sized chunk at a time, maintain a heap while reading new records and emit values that remain eligible for the current run.

Under favorable distributions, generated runs can be substantially larger than the available memory.

## 19. Replacement-Selection Invariant

Maintain a distinction between:

```text
active records eligible for current run
vs
records deferred to a future run
```

The next emitted record must preserve current-run sortedness.

This turns run generation into a streaming heap problem.

## 20. Spill-to-Disk Systems

A backend may accumulate data in memory until a threshold is reached:

```text
buffer
→ threshold reached
→ sort
→ spill sorted segment
→ continue
```

At the end, merge all spilled segments.

This pattern is widely useful in data-processing systems.

## 21. Streaming Output

The final merge can be exposed as an iterator or stream:

```text
next()
→ heap root
→ emit record
→ refill source
→ restore heap
```

This avoids materializing the complete sorted result in memory.

## 22. Backpressure

If the output consumer is slower than the merge producer, the merge system should not continue buffering unbounded output.

Use bounded buffers and explicit backpressure semantics.

This is especially important in Node.js streaming systems.

## 23. Node.js Considerations

A Node.js implementation should reason about:

- `Readable` streams;
- async iteration;
- file descriptors;
- buffer sizes;
- stream backpressure;
- temporary-file lifecycle;
- asynchronous I/O errors.

The algorithm should not block the event loop with enormous synchronous CPU phases when the workload is large.

## 24. Temporary File Management

Production external sorting needs lifecycle management:

```text
create
→ write
→ flush
→ merge
→ delete
```

Failures must not leave unbounded temporary files.

Use deterministic naming, cleanup policies, and resource limits.

## 25. Failure Handling

Potential failures include:

- disk-full errors;
- read/write failures;
- corrupted run files;
- process interruption;
- invalid records;
- exhausted file descriptors;
- partial merge output.

A robust system should define whether runs are restartable, checksummed, or regenerated.

## 26. Checksums and Integrity

For durable pipelines, run metadata can include:

```text
record count
byte length
checksum
schema/version
```

This can detect corruption before or during merge.

## 27. Partitioning and Distributed Sorting

Distributed systems extend external sorting across machines:

```text
partition
→ local sort
→ shuffle/range partition
→ merge
```

Correct global ordering requires compatible partition boundaries and comparator semantics.

## 28. Range Partitioning

If records are partitioned by ordered key ranges:

```text
worker 1 → [A, F)
worker 2 → [F, M)
worker 3 → [M, Z]
```

then each worker can independently sort its range.

Global concatenation is correct only if partition boundaries are themselves correctly ordered and non-overlapping under the chosen semantics.

## 29. Backend Applications

External sorting is useful for:

- large exports;
- log processing;
- batch ETL;
- report generation;
- data migration;
- large event streams;
- spillable query operators.

Database engines often implement related external merge-sort operators internally.

## 30. AI Applications

Large AI/data pipelines may use external sorting for:

- dataset preprocessing;
- deduplication preparation;
- grouped records;
- feature pipelines;
- large-scale ranking preparation;
- vocabulary or identifier processing.

Distributed frameworks usually provide optimized implementations rather than requiring application-level sorting logic.

## 31. K-Way Merge vs Two-Way Merge

Two-way merge uses simpler logic but may require more passes when many runs exist.

K-way merge reduces merge levels but increases active state:

```text
heap size = K
buffers ≈ K
```

The best fan-in depends on the external-memory environment.

## 32. Testing Strategy

Test:

- empty input;
- one run;
- many runs;
- uneven run sizes;
- duplicate keys;
- already sorted input;
- reverse-sorted input;
- corrupted run;
- truncated run;
- disk-full simulation;
- backpressure;
- interrupted merge.

Verify both sortedness and complete record preservation.

## 33. Benchmarking

Measure separately:

- run-generation CPU time;
- run-generation I/O;
- merge CPU time;
- merge I/O;
- heap operations;
- buffer refill count;
- number of merge passes;
- peak memory;
- temporary storage consumed.

Do not report only total elapsed time.

## 34. Common Mistakes

1. Loading the complete dataset into memory.
2. Using one-record-at-a-time storage I/O.
3. Ignoring merge fan-in.
4. Forgetting stable tie semantics.
5. Losing records during run generation.
6. Failing to handle exhausted runs.
7. Creating too many simultaneous file descriptors.
8. Ignoring temporary-file cleanup.
9. Treating CPU complexity as the complete performance model.
10. Ignoring backpressure in streaming implementations.

## 35. Interview Questions

1. What is external sorting?
2. Why can't ordinary in-memory sorting always be used?
3. What is a sorted run?
4. How does k-way merge work?
5. Why is a min-heap useful during k-way merge?
6. What is the CPU complexity of merging `N` values from `K` runs?
7. What is merge fan-in?
8. What is replacement selection?
9. How would you implement external sorting with Node.js streams?
10. How do you handle failures during a multi-pass merge?

## 36. Revision Checklist

- [ ] I can explain internal vs external sorting.
- [ ] I can generate sorted runs under a memory budget.
- [ ] I can implement a two-way merge.
- [ ] I can derive k-way merge using a min-heap.
- [ ] I understand `O(N log K)` CPU merge cost.
- [ ] I understand fan-in and multi-pass merging.
- [ ] I can reason about block I/O.
- [ ] I understand spill-to-disk and backpressure.
- [ ] I can design failure and cleanup handling.
- [ ] I can connect external sorting to backend and AI data pipelines.

## 37. Key Takeaways

1. **External Sorting moves part of the algorithm from memory into persistent storage.**
2. **The fundamental workflow is sorted-run generation followed by merging.**
3. **K-way merge commonly uses a min-heap to select the smallest active record in `O(log K)` time.**
4. **Total performance depends on I/O, buffering, merge passes, fan-in, and CPU work.**
5. **Streaming and backpressure prevent the final merge from requiring the entire result in memory.**
6. **Production systems must treat temporary files, resource limits, corruption, and failure recovery as algorithmic concerns.**
7. **The same principles extend naturally into distributed sorting and large AI/data-processing pipelines.**
8. **The deeper lesson is that an algorithm's cost model must match the machine that executes it.**
