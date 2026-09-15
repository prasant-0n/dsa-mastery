# 06.16 — Advanced Heap Patterns: Top-K, K-Way Merge, Scheduling & Streaming

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter develops reusable heap patterns rather than isolated problems. The goal is to recognize when a problem asks for a continuously maintained boundary, a merge of sorted sources, a dynamically changing extremum, or a streaming ranking decision.

## 1. Learning Objectives

You will learn to:

- recognize top-K and K-th-element patterns;
- choose min-heap vs max-heap correctly;
- derive O(N log K) bounded-heap solutions;
- merge K sorted streams efficiently;
- solve running median with two heaps;
- design online ranking and scheduling structures;
- combine heaps with hash maps and deques;
- reason about lazy deletion in streaming structures;
- compare full sorting with incremental selection;
- apply heap patterns to backend and AI workloads.

---

## 2. The Boundary Principle

Many heap problems do not require the entire dataset to be ordered.

They require only a boundary such as:

```text
K largest
K smallest
K-th largest
next scheduled job
median boundary
best candidate
```

A heap maintains that boundary without fully sorting everything.

---

## 3. Top-K Largest

To keep the K largest values, use a **min-heap of size K**.

Why?

The root is the smallest value currently retained:

```text
root = current cutoff
```

For each incoming value `x`:

```text
if heap.size < K
    insert x
else if x > root
    replace root
```

The heap stores exactly the candidates capable of belonging to the final answer.

---

## 4. Top-K Smallest

Reverse the structure.

Use a **max-heap of size K**.

The root becomes:

```text
largest among retained K smallest
```

It is the cutoff for admission.

This “heap of the opposite direction” rule is worth memorizing only after understanding why it works.

---

## 5. Complexity

For N values and K retained candidates:

```text
Time  → O(N log K)
Space → O(K)
```

If `K ≈ N`, full sorting may be competitive or simpler.

If `K << N`, the bounded heap can substantially reduce work and memory.

---

## 6. Top-K With Objects

Real systems rank objects rather than numbers:

```text
{ id, score, timestamp }
```

The comparator should define:

```text
primary score
secondary tie-breaker
identity
```

Never compare only one field when the business contract requires deterministic ordering.

---

## 7. Top-K Frequencies

Given values and their frequencies:

```text
count[value] = frequency
```

Then maintain a heap of K candidates by frequency.

This combines:

```text
hash map → aggregation
heap     → selection
```

The broader pattern is:

> Use one structure to compute the metric and another to maintain the required ordering.

---

## 8. K-th Element

The K-th largest element can be found by maintaining K largest candidates in a min-heap.

At completion:

```text
root = K-th largest
```

This is not the only solution; selection algorithms can achieve different complexity characteristics.

The correct choice depends on whether you need:

```text
one selection
many selections
streaming input
sorted output
```

---

## 9. Full Sort vs Heap

| Requirement | Typical Strategy |
|---|---|
| Need complete ordering | Sort |
| Need top K | Bounded heap |
| Streaming top K | Bounded heap |
| One K-th selection | Selection algorithm / heap |
| Repeated dynamic top K | Heap-based structure |

Do not automatically use a heap simply because the problem mentions “largest.”

---

## 10. K-Way Merge

Suppose there are K sorted sequences.

A naive merge repeatedly scans all K current heads:

```text
O(TK)
```

A heap improves this.

Store one candidate from each sequence:

```text
heap = current smallest from each source
```

Extract the minimum, then insert the next element from that same source.

---

## 11. K-Way Merge Complexity

For T total elements:

```text
initial heap → O(K)
T extractions/inserts → O(T log K)
```

Space:

```text
O(K)
```

This pattern generalizes to files, database result streams, logs, and distributed partitions.

---

## 12. Merge K Linked Lists

Each list contributes at most one active head.

The heap stores:

```text
node
source identity
```

After extracting a node:

```text
advance source
insert next node
```

This is the same K-way merge pattern independent of representation.

---

## 13. External Sorting

When data does not fit memory:

```text
sorted chunk 1
sorted chunk 2
sorted chunk 3
...
```

can be merged with a K-way heap.

The heap contains only one active record per input stream.

This is a fundamental external-memory algorithmic pattern.

---

## 14. Multi-Source Streaming Merge

Suppose multiple services emit already ordered events.

A heap can maintain:

```text
next event from each source
```

and emit the globally smallest timestamp.

Production complications include:

```text
late events
source failure
backpressure
watermarks
clock skew
```

The heap solves ordering among currently available heads, not distributed event-time correctness by itself.

---

## 15. Running Median

Maintain two heaps:

```text
max-heap → lower half
min-heap → upper half
```

Invariant:

```text
size difference ≤ 1
max(lower) ≤ min(upper)
```

Then the median is available from one or both roots.

This is a classic example of representing a global statistic through two local boundaries.

---

## 16. Running Median Insertion

For new value x:

```text
if lower empty or x <= lower.peek
    lower.insert(x)
else
    upper.insert(x)
```

Then rebalance if one heap exceeds the other by more than one element.

Each insertion costs O(log N).

---

## 17. Why Two Heaps Work

The median separates the ordered dataset into two halves.

We do not need every value globally sorted.

We need only:

```text
largest of lower half
smallest of upper half
```

The two heap roots expose exactly those boundaries.

---

## 18. Sliding-Window Median

A fixed-size moving median adds deletion to the running-median problem.

Heaps alone do not efficiently locate arbitrary expired values.

Possible strategies:

```text
indexed heaps
lazy deletion + frequency map
balanced ordered structure
```

This is an important example where a simple pattern becomes harder when elements leave the active set.

---

## 19. Lazy Deletion for Windows

Maintain a map of values that should be removed.

When a stale value reaches the relevant heap root:

```text
remove stale root
continue cleanup
```

The heap may contain values that are logically outside the window.

The validity predicate becomes part of the data structure's invariant.

---

## 20. Heap + Hash Map

Many production structures combine:

```text
heap → ordering
map  → identity/state
```

Examples:

```text
scheduler
sliding median
cancellable jobs
Dijkstra
versioned search frontier
```

This is a recurring engineering pattern.

---

## 21. Dynamic Scheduling

A scheduler may receive jobs continuously.

Each job has:

```text
priority
deadline
sequence
nextRunAt
```

The heap maintains the next candidate.

When a job changes priority, choose between:

```text
indexed update
lazy replacement
```

based on update frequency and memory requirements.

---

## 22. Deadline + Priority Ordering

A robust comparator may be lexicographic:

```text
1. urgent priority first
2. earliest deadline
3. oldest arrival
```

This prevents equal-priority nondeterminism and makes behavior testable.

But if fairness across tenants is required, a single global comparator may still be insufficient.

---

## 23. Aging and Fairness

A strict priority scheduler can starve lower-priority work.

One mitigation is aging:

```text
effectivePriority = basePriority + waitingFactor
```

This makes priority time-dependent.

A heap can still maintain the ordering, but updating effective priorities introduces additional engineering requirements.

---

## 24. Event-Driven Timers

A min-heap ordered by `expiresAt` can maintain timers:

```text
root = earliest expiration
```

The event loop checks the root to determine the next wake-up deadline.

This is conceptually similar to delayed-job scheduling.

---

## 25. Streaming Top-K

For an unbounded stream, a fixed-size heap prevents memory from growing with total history.

```text
stream → bounded heap(K)
```

Memory remains:

```text
O(K)
```

This is especially useful for telemetry, ranking, and anomaly candidate selection.

---

## 26. Approximate Top-K

For extremely high-volume streams, exact top-K may still be expensive.

Approximate algorithms may use sketches or sampling.

The engineering decision becomes:

```text
exactness
memory
latency
throughput
error tolerance
```

This is a bridge from classical DSA to large-scale data systems.

---

## 27. AI Candidate Ranking

AI systems frequently produce many candidate states:

```text
retrieval results
beam candidates
tool actions
search states
recommendations
```

A bounded heap can retain the strongest candidates without sorting every generated state.

The score must be explicit and deterministic where reproducibility matters.

---

## 28. Retrieval Top-K

A retrieval pipeline may produce similarity scores:

```text
candidate → score
```

If only K results are required, a bounded heap can maintain the cutoff.

For distributed retrieval, local top-K results can be merged into a global top-K using another heap.

This creates a hierarchical selection pattern.

---

## 29. Hierarchical Top-K

Suppose there are M shards.

Each shard returns K candidates.

The coordinator merges them and maintains global K.

Instead of processing every document centrally:

```text
shard-local selection
        ↓
global selection
```

This reduces network transfer and central processing.

Correctness depends on each shard returning a sufficient local candidate set under the scoring contract.

---

## 30. Heap as a Frontier Scheduler

A search frontier can be interpreted as a continuously changing scheduling problem:

```text
candidate state → score → next expansion
```

The heap selects which state to expand.

This unifies:

```text
Dijkstra
A*
best-first search
beam search
priority work queues
```

The difference lies in the score, pruning rule, and termination condition.

---

## 31. Backpressure in Heap-Based Systems

A priority queue can also become unbounded.

Therefore define:

```text
maximum entries
maximum bytes
per-tenant quota
admission policy
```

When full, possible behavior includes rejecting low-value work or replacing the current cutoff.

A priority queue is still a queue and needs resource governance.

---

## 32. Correctness Invariants

### Top-K

Every discarded candidate is no better than the current retained cutoff under the defined comparator.

### K-way merge

The heap contains the smallest unconsumed item from each active source.

### Running median

```text
all lower ≤ all upper
size(lower) and size(upper) differ by at most one
```

### Scheduler

The root is the highest-priority currently eligible item under the comparator.

---

## 33. Common Mistakes

- using a max-heap instead of min-heap for top-K largest;
- sorting all N items unnecessarily;
- forgetting source identity in K-way merge;
- mishandling duplicate values;
- failing to rebalance two heaps;
- treating stale lazy entries as active;
- assuming heap search is O(log N);
- ignoring memory growth in streaming systems;
- confusing priority ordering with fairness;
- pruning candidates without proving the cutoff invariant.

---

## 34. Testing Strategy

Test top-K with:

```text
K = 0
K = 1
K = N
K > N
duplicates
negative values
already sorted input
reverse sorted input
```

Test K-way merge with:

```text
empty sources
one source
duplicate values
very different source lengths
```

Test running median with:

```text
odd count
even count
duplicates
negative values
monotonic streams
```

---

## 35. Differential Testing

For top-K, compare against:

```text
sort + slice
```

on small random inputs.

For K-way merge, compare against concatenation + sort.

For running median, compare against maintaining a sorted reference array.

For scheduling, compare extraction order against a simple reference comparator.

Reference algorithms may be slower; their purpose is correctness.

---

## 36. Benchmarking

Measure:

```text
N
K
heap operations
allocation rate
memory
latency
throughput
```

Compare:

```text
full sort
bounded heap
selection algorithm
```

under the same workload and output requirements.

---

## 37. Backend Applications

Heap patterns appear in:

```text
job schedulers
delayed retries
timer management
log merging
top-N analytics
priority routing
rate-limit scheduling
resource allocation
```

The data structure handles ordering; the surrounding architecture handles durability, concurrency, failure, and observability.

---

## 38. AI Applications

Heap patterns appear in:

```text
top-K retrieval
beam search
best-first planning
candidate ranking
nearest-candidate selection
streaming anomaly candidates
multi-source result merging
```

At scale, the heap is often one component inside a distributed selection pipeline.

---

## 39. Interview Framework

When you see “top K”:

```text
1. Ask whether complete sorting is required.
2. If not, consider a bounded heap.
3. Decide which heap direction makes the cutoff the root.
4. Define comparator and ties.
5. Maintain size K.
6. Derive O(N log K).
7. Check whether streaming input changes the design.
```

For K-way merge:

```text
one active candidate per source → heap → extract → advance source
```

For running median:

```text
lower max-heap + upper min-heap
```

---

## 40. Revision Checklist

- [ ] I can derive top-K with a bounded heap.
- [ ] I know why top-K largest uses a min-heap.
- [ ] I can handle top-K objects and tie-breaking.
- [ ] I understand K-way merge.
- [ ] I can merge sorted arrays or linked lists with a heap.
- [ ] I understand external merge sorting.
- [ ] I can implement running median with two heaps.
- [ ] I understand sliding-window median challenges.
- [ ] I can combine heaps with hash maps.
- [ ] I understand streaming top-K memory bounds.
- [ ] I can reason about approximate selection trade-offs.
- [ ] I can apply heaps to AI retrieval and candidate ranking.
- [ ] I can design hierarchical top-K.
- [ ] I can prove heap-pattern invariants.
- [ ] I can choose heap vs sorting vs selection algorithms.

---

## 41. Key Takeaways

1. Heap patterns are about maintaining a useful boundary, not fully sorting data.
2. Top-K uses a heap whose root represents the admission cutoff.
3. K-way merge keeps one active candidate per sorted source.
4. Two heaps expose the two boundaries around a running median.
5. Heap + hash map is a recurring production composition.
6. Lazy deletion is useful for dynamic streams but requires explicit validity checks.
7. Streaming algorithms need bounded memory, not merely correct ordering.
8. Distributed top-K can be built from local top-K plus global heap merging.
9. Backend scheduling and AI search are both frontier-selection problems.
10. The right heap pattern emerges from the exact ordering, output, and resource requirements.
