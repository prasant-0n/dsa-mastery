# 01.19 — Online, Offline, Streaming & External-Memory Algorithmic Models

> The same algorithm can have completely different engineering value depending on how data arrives, whether the future is known, whether input fits in memory, and whether CPU or I/O dominates the workload.

## Learning Objectives

By the end of this chapter, you should be able to:

- Distinguish online, offline, batch, and streaming algorithms.
- Understand why future knowledge changes algorithm design.
- Reason about one-pass, multi-pass, and bounded-memory algorithms.
- Model append-only and unbounded streams.
- Understand external-memory / I/O-aware algorithmic thinking.
- Compare random access with sequential access.
- Recognize sorting, indexing, batching, and merge strategies for large data.
- Reason about latency, throughput, backpressure, and state retention.
- Apply these models to backend data pipelines and AI workloads.

---

## 1. The Computational Model Matters

Before choosing an algorithm, ask:

```text
Where is the data?
How does it arrive?
Do I know the future?
Can I revisit old data?
Does everything fit in memory?
What resource is expensive?
```

The traditional RAM model assumes memory access is relatively uniform.

Real systems often have multiple costs:

```text
CPU
RAM
cache
SSD
network
remote storage
```

Therefore algorithm selection must sometimes be I/O-aware rather than CPU-only.

---

## 2. Offline Algorithms

An offline algorithm can inspect the complete input before producing the required output.

Example:

```text
load all records
↓
sort
↓
process
```

Knowing the entire dataset enables:

- sorting,
- global preprocessing,
- coordinate compression,
- offline query reordering,
- batch optimization.

Offline access can make problems significantly easier.

---

## 3. Online Algorithms

An online algorithm must make decisions as data arrives without knowing future input.

Conceptually:

```text
item arrives
↓
make decision
↓
next item
↓
make decision
```

Past decisions may be difficult or impossible to undo.

Examples:

- request routing,
- streaming analytics,
- cache eviction,
- online scheduling,
- live rate limiting.

---

## 4. Online vs Offline

Consider a sequence of requests.

An offline algorithm sees:

```text
R1 R2 R3 ... Rn
```

before making decisions.

An online algorithm sees:

```text
R1 → decision
R2 → decision
R3 → decision
```

The offline algorithm has more information.

Therefore an online algorithm is often compared against an offline optimum using competitive analysis.

---

## 5. Competitive Analysis

For an online algorithm, one useful question is:

> How much worse can this algorithm be than an optimal offline algorithm that knows the future?

A competitive ratio conceptually compares:

```text
online cost
----------------
offline optimal cost
```

This is especially important for:

- caching,
- scheduling,
- resource allocation,
- paging.

The goal is not necessarily to match the offline optimum exactly.

---

## 6. Streaming Algorithms

A streaming algorithm processes data incrementally rather than materializing the entire dataset.

Typical constraints:

```text
input may be huge
input may be unbounded
memory is limited
multiple passes may be impossible
```

Streaming algorithms emphasize:

- one-pass processing,
- bounded state,
- incremental updates,
- approximate summaries.

---

## 7. One-Pass Algorithms

A one-pass algorithm reads each input item once.

Examples:

```text
sum
minimum
maximum
count
running average
reservoir sampling
```

For example:

```js
let sum = 0;
let count = 0;

for (const x of stream) {
  sum += x;
  count += 1;
}
```

The complete input need not be stored.

---

## 8. One-Pass Does Not Mean O(1) Memory

This distinction is important.

An algorithm may read input only once while storing O(n) state.

Example:

```text
one pass
+
Set of every previously seen value
```

is still O(n) memory.

Streaming means incremental access; bounded-memory streaming is a stronger constraint.

---

## 9. Exact vs Approximate Streaming

Some statistics require large memory for exact answers.

Examples:

```text
exact distinct count
exact frequency table
exact Top-K
```

Approximate algorithms may use compact summaries.

Examples:

- Bloom filters,
- Count-Min Sketch,
- HyperLogLog,
- reservoir sampling.

The trade-off is:

```text
accuracy/error guarantee
vs
memory
vs
speed
```

---

## 10. Stateful Streaming

A streaming algorithm maintains state between records.

Example:

```text
state = current count
item arrives
↓
update state
↓
next item
```

The state should be:

- sufficient for future computation,
- bounded where required,
- serializable if recovery is needed,
- safe under concurrency.

State design is algorithm design.

---

## 11. Windowed Streaming

Often we care only about recent data.

Examples:

```text
last 5 minutes
last 1000 events
last 24 hours
```

This creates a sliding-window state.

Useful data structures include:

- deque,
- queue,
- ring buffer,
- timestamp index,
- monotonic queue.

The algorithm must efficiently expire old state.

---

## 12. Tumbling vs Sliding Windows

### Tumbling window

Non-overlapping intervals:

```text
[0, 10)
[10, 20)
[20, 30)
```

### Sliding window

Overlapping recent intervals:

```text
[0, 10)
[1, 11)
[2, 12)
```

Sliding windows usually require more careful state expiration.

---

## 13. Event Time vs Processing Time

In streaming systems, an event may arrive later than when it occurred.

Two concepts matter:

```text
event time
processing/arrival time
```

If an algorithm uses only arrival order, late events can produce incorrect windowed results.

Algorithm design must explicitly define the ordering semantics.

---

## 14. Late Data

Suppose an event occurred at 10:05 but arrives at 10:08.

A streaming aggregation must decide whether to:

- ignore it,
- update historical results,
- wait for a watermark/allowed lateness period,
- send it to correction processing.

This is an algorithmic contract, not just infrastructure configuration.

---

## 15. Online Aggregation

Many aggregates can be maintained incrementally.

Examples:

```text
count
sum
min/max
mean
frequency map
Top-K
```

The key question is:

> Can the new result be computed from the old state plus the new item?

If yes, the computation may be online.

---

## 16. Incremental Average

Do not store all values merely to calculate a mean.

Maintain:

```text
count
sum
```

Then:

```text
mean = sum / count
```

A numerically careful implementation may require attention to numeric range and precision.

The broader principle is:

```text
full history
↓
minimal sufficient summary
```

---

## 17. Online Top-K

For a stream of values, maintain a heap of size K.

For each incoming item:

```text
if heap size < K:
    insert
else if item better than heap root:
    replace root
```

Complexity:

```text
O(n log K)
```

Memory:

```text
O(K)
```

This is a foundational streaming pattern.

---

## 18. Online Deduplication

To detect duplicates in a stream exactly, maintain a set of previously observed identifiers.

Memory can grow with the number of unique identifiers.

If bounded memory is required, probabilistic structures such as Bloom filters can trade false positives for memory efficiency.

The algorithmic contract must define whether false positives are acceptable.

---

## 19. Batch Processing

Batch algorithms process a finite collection together.

Batching can improve:

- throughput,
- vectorization,
- database efficiency,
- network efficiency,
- model inference utilization.

But larger batches can increase:

- latency,
- memory usage,
- failure blast radius.

Algorithmic design must balance these costs.

---

## 20. Micro-Batching

Micro-batching combines a small number of streaming items into batches.

Conceptually:

```text
events
↓
small buffer
↓
batch threshold/time threshold
↓
process batch
```

This creates a trade-off between:

```text
per-item overhead
vs
waiting latency
```

It is common in data processing and AI inference systems.

---

## 21. Backpressure

If producers generate work faster than consumers process it:

```text
arrival rate > processing rate
```

the queue grows.

Without a control mechanism, memory may eventually be exhausted.

Backpressure makes the production rate respond to downstream capacity.

This is algorithmically related to bounded queues and resource constraints.

---

## 22. Queue Stability

A simplified intuition:

```text
long-term arrival rate < sustainable service rate
```

is necessary for stable queues under ordinary assumptions.

If:

```text
arrival rate > service rate
```

indefinite backlog growth is unavoidable unless the system drops, delays, samples, or otherwise limits work.

This is a computational-capacity constraint, not merely a networking issue.

---

## 23. External Memory

When data does not fit in RAM, the algorithm must operate across slower storage.

The cost model changes.

Instead of counting only CPU operations, we care about:

```text
number of block transfers / I/O operations
```

A CPU-efficient algorithm can still be terrible if it causes excessive random I/O.

---

## 24. Sequential vs Random I/O

Sequential access generally has very different performance characteristics from random access.

Conceptually:

```text
sequential:
block 1 → block 2 → block 3 → ...
```

vs:

```text
random:
block 917 → block 12 → block 800 → ...
```

Large-data algorithms often prefer sequential scans and batching.

---

## 25. External-Memory Sorting

If the dataset is larger than memory:

```text
read chunk
↓
sort chunk in memory
↓
write sorted run
↓
repeat
↓
merge sorted runs
```

This is the core idea of external merge sort.

The algorithm transforms a memory problem into sequential I/O plus merging.

---

## 26. External Merge

Suppose we have sorted runs:

```text
A: 1 5 9
B: 2 4 8
C: 3 6 7
```

Use a min-heap containing the current head of each run:

```text
heap → smallest current item
↓
output
↓
advance that run
↓
insert next item
```

This gives a natural connection between:

```text
external sorting
+
heap
+
streaming
```

---

## 27. External-Memory Complexity

In an I/O-aware model, let:

```text
N = number of records
B = records per block
M = memory capacity in records
```

The number of blocks is roughly:

```text
N / B
```

The algorithm should minimize expensive block transfers.

External merge sort has a complexity commonly expressed in terms of:

```text
O((N/B) log_{M/B}(N/B))
```

I/O operations under the external-memory model.

The exact model assumptions matter.

---

## 28. Why B-Trees Exist

A binary search tree may have many levels.

When nodes live on disk, each level can imply an I/O operation.

B-trees increase branching factor so one node can contain many keys.

Conceptually:

```text
small branching
→ many levels
→ many I/Os
```

versus:

```text
large branching
→ fewer levels
→ fewer I/Os
```

This is a direct example of adapting a data structure to the hardware cost model.

---

## 29. Indexing as Precomputation

An index trades build/storage cost for query speed.

```text
build index
↓
store useful representation
↓
answer queries faster
```

This is the same algorithmic trade-off seen earlier:

```text
preprocessing
vs
query cost
```

Database indexes are algorithmic data structures optimized for persistent storage workloads.

---

## 30. Offline Query Processing

Suppose many queries arrive with the complete dataset known in advance.

You may reorder queries or preprocess data.

Examples:

- sort queries by endpoint,
- coordinate compression,
- offline range processing,
- sweep-line algorithms.

The important insight:

> Knowing the future can unlock algorithms that are impossible or unnecessary online.

---

## 31. Online Query Processing

If queries arrive unpredictably and answers are required immediately:

```text
query arrives
↓
answer now
```

You may need:

- indexes,
- caches,
- balanced trees,
- hash tables,
- precomputed summaries.

The workload is now dominated by query latency rather than total batch throughput.

---

## 32. Online vs Offline Trade-Off

| Model | Strength | Cost |
|---|---|---|
| Offline | Can optimize globally | Must wait/hold input |
| Online | Immediate decisions | Limited information |
| Streaming | Bounded/incremental processing | Limited history |
| Batch | Efficient bulk work | Higher latency |
| External-memory | Handles huge datasets | I/O complexity |

The correct model depends on the system contract.

---

## 33. Backend: Log Processing

A log pipeline may receive:

```text
millions of events/hour
```

A production algorithm should avoid:

```text
load everything into one array
```

Instead use:

```text
stream
→ parse
→ filter
→ aggregate
→ batch
→ persist
```

This reduces peak memory and supports continuous processing.

---

## 34. Backend: Pagination

Offset pagination:

```text
OFFSET 100000 LIMIT 50
```

can become expensive for deep pages because the system may scan/skip many rows.

Keyset/cursor pagination uses an ordered key:

```text
WHERE id > lastSeenId
ORDER BY id
LIMIT 50
```

This is an algorithmic representation choice driven by workload and index structure.

---

## 35. Backend: Rate Limiting as Streaming State

Requests arrive as a stream.

A limiter maintains compact state:

```text
request stream
↓
rate-limit state
↓
allow/reject
```

Window choice changes the algorithm:

- fixed window,
- sliding window,
- token bucket,
- leaky bucket.

Each has different memory, burst, and fairness behavior.

---

## 36. Backend: Event Deduplication

A service consuming at-least-once delivery may see the same event repeatedly.

An online deduplication algorithm maintains identifiers already processed.

If exact history is too large, bounded/probabilistic methods may be considered, but correctness requirements determine whether approximation is acceptable.

---

## 37. Backend: Distributed Streaming

Once state is distributed, algorithm design must additionally consider:

- partitioning,
- ordering,
- duplicate delivery,
- state ownership,
- checkpoints,
- recovery,
- skew.

A local streaming algorithm may not remain correct when events are partitioned arbitrarily.

The distributed state model becomes part of the algorithm.

---

## 38. AI: Embedding Pipelines

An embedding pipeline often looks like:

```text
documents
↓
stream/batch
↓
chunk
↓
embed
↓
write vectors
↓
index
```

Batch size affects:

- GPU utilization,
- memory,
- throughput,
- latency,
- retry granularity.

The algorithmic problem is not just “compute embeddings”; it is processing a potentially huge dataset under resource constraints.

---

## 39. AI: Vector Index Construction

Large vector datasets may not fit comfortably into memory during index construction.

Construction may therefore use:

```text
partition
→ build local structures
→ merge/index
```

or other staged approaches.

The core idea is external/streaming algorithm design applied to vector search infrastructure.

---

## 40. AI: Streaming Inference

For online inference:

```text
request arrives
↓
prepare input
↓
model inference
↓
return result
```

Batching requests can improve throughput but increase waiting latency.

A scheduler may use micro-batching:

```text
wait up to T ms
or
until batch size B
```

This is an online-vs-batch trade-off.

---

## 41. AI: RAG Data Refresh

A continuously changing corpus may require incremental indexing.

Instead of rebuilding everything:

```text
new/changed documents
↓
re-embed affected chunks
↓
update index
```

This is an incremental/offline hybrid algorithm.

The key design question is:

> What is the smallest changed state that must be recomputed?

---

## 42. AI: Large-Scale Evaluation

Evaluating millions of examples can be treated as a streaming pipeline:

```text
read example
→ inference
→ metric update
→ discard/example checkpoint
```

Exact metrics may require sufficient aggregate state; some analyses can use sampling.

The evaluation algorithm should explicitly define whether metrics are:

```text
exact
sampled
approximate
incremental
```

---

## 43. Memory-Bounded Algorithm Design

When memory is limited, ask:

```text
What information is truly necessary?
Can state be summarized?
Can data be streamed?
Can processing be batched?
Can intermediate results be spilled?
Can a probabilistic structure replace exact state?
```

This often turns an impossible design into a feasible one.

---

## 44. Multi-Pass vs One-Pass

Some algorithms need multiple scans.

Example:

```text
pass 1 → determine statistics
pass 2 → produce output
```

If the input is a live stream, this may be impossible.

Therefore the algorithm must distinguish:

```text
random-access static data
vs
single-pass stream
```

A theoretically simple multi-pass solution may be operationally invalid.

---

## 45. External State and Checkpointing

A long-running stream processor may need recovery.

Persisting state periodically gives:

```text
checkpoint
↓
failure
↓
restore
↓
resume
```

Checkpoint frequency trades:

```text
recovery work
vs
checkpoint I/O
```

This is another algorithmic time-space-durability trade-off.

---

## 46. Common Mistakes

### Mistake 1 — Assuming all input is available

Online systems often cannot know the future.

### Mistake 2 — Calling one-pass equivalent to constant memory

A one-pass algorithm can still store O(n) state.

### Mistake 3 — Ignoring data arrival semantics

Event time and processing time may differ.

### Mistake 4 — Using CPU complexity for an I/O-bound workload

Disk/network operations can dominate.

### Mistake 5 — Materializing huge streams

This creates unnecessary peak memory.

### Mistake 6 — Ignoring backpressure

Unbounded queues can exhaust memory.

### Mistake 7 — Using approximate structures without checking correctness requirements

False positives/approximation may be unacceptable.

### Mistake 8 — Assuming offline optimization is possible online

Future knowledge changes the available algorithmic choices.

### Mistake 9 — Ignoring late events

Streaming windows need explicit lateness semantics.

### Mistake 10 — Ignoring storage layout

A theoretically good tree can cause excessive random I/O on disk.

---

## 47. Algorithm Selection Framework

Before implementation:

```text
1. Is input static or changing?
2. Is the entire input available?
3. Is future knowledge available?
4. Must decisions be immediate?
5. Is one pass required?
6. Can data be revisited?
7. Does data fit in RAM?
8. Is CPU, memory, I/O, or network dominant?
9. Is exactness required?
10. Can state be summarized?
11. Can batching improve throughput?
12. What latency is acceptable?
13. Is backpressure required?
14. How is state recovered after failure?
15. What ordering semantics apply?
16. Can preprocessing/indexing reduce query cost?
```

---

## 48. Interview Template

When asked to design an algorithm for large or streaming data:

```text
1. Define the data-arrival model.
2. Define whether future knowledge exists.
3. Define memory constraints.
4. Identify dominant resource.
5. Decide one-pass vs multi-pass.
6. Determine exact vs approximate requirements.
7. Define persistent/in-memory state.
8. Choose data structures.
9. Analyze time and memory.
10. Analyze I/O if relevant.
11. Discuss batching and backpressure.
12. Discuss failure/recovery behavior.
13. Explain correctness under ordering/late-data assumptions.
```

---

## 49. Key Takeaways

1. Algorithmic complexity depends on the computational model.
2. Offline algorithms can exploit complete future knowledge.
3. Online algorithms must act without seeing future input.
4. Streaming algorithms process data incrementally.
5. One-pass does not imply O(1) memory.
6. Bounded-memory streaming often requires compact state or approximation.
7. Sliding and tumbling windows have different state semantics.
8. Event time and processing time must be distinguished in streaming systems.
9. Backpressure is a resource-stability constraint.
10. External-memory algorithms optimize expensive I/O rather than only CPU operations.
11. Sequential access can be dramatically preferable to random access for large data.
12. External merge sort combines in-memory sorting with sequential merging.
13. B-trees adapt tree structure to storage I/O costs.
14. Indexing is preprocessing traded for faster queries.
15. Offline query processing can exploit global knowledge.
16. Online Top-K is a core heap-based streaming pattern.
17. Backend log processing, pagination, rate limiting, and deduplication are algorithmic streaming problems.
18. AI embedding, vector-index, inference, and evaluation pipelines depend heavily on batching and memory-aware processing.
19. Incremental recomputation is often preferable to rebuilding everything.
20. Expert algorithm engineering starts by selecting the right computational model before selecting the data structure.

---

## Revision Checklist

- [ ] I can distinguish online and offline algorithms.
- [ ] I understand competitive-analysis intuition.
- [ ] I can define a streaming algorithm.
- [ ] I know why one-pass does not imply O(1) memory.
- [ ] I can design bounded-memory stream processing.
- [ ] I understand exact vs approximate streaming.
- [ ] I understand sliding vs tumbling windows.
- [ ] I understand event time vs processing time.
- [ ] I can reason about late data.
- [ ] I understand online Top-K.
- [ ] I can reason about backpressure and queue stability.
- [ ] I understand external-memory algorithmic thinking.
- [ ] I can explain sequential vs random I/O.
- [ ] I understand external merge sort.
- [ ] I understand why B-trees use high branching factors.
- [ ] I understand indexing as preprocessing.
- [ ] I can distinguish one-pass and multi-pass constraints.
- [ ] I can apply streaming models to backend systems.
- [ ] I can apply memory/I/O-aware processing to AI pipelines.
- [ ] I can choose a computational model before choosing an algorithm.
