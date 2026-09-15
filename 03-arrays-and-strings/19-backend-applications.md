# 03.19 — Backend Applications of Arrays & Strings

## Purpose

This chapter translates the array/string patterns from Phase 03 into **real backend engineering problems**.

The objective is not to force DSA into production code. It is to recognize where data representation, traversal, indexing, windows, hashing, sorting, intervals, and string processing directly determine backend correctness and performance.

Core model:

```text
business requirement
→ workload + constraints
→ data representation
→ algorithmic pattern
→ invariant
→ complexity
→ operational behavior
```

---

# 1. Why Backend Engineers Need Array/String DSA

Backend systems constantly process sequences:

- request batches;
- database rows;
- event streams;
- logs;
- tokens;
- IDs;
- time-series data;
- pagination results;
- sorted feeds;
- intervals;
- configuration lists.

A slow loop over one request may be harmless.
The same loop inside a high-QPS endpoint can become an infrastructure problem.

---

# 2. Request Batch Processing

Suppose an API receives `N` records.

Common operations include:

```text
validate
normalize
filter
transform
deduplicate
aggregate
sort
paginate
```

If each operation is independently `O(N)`, a pipeline with several passes may still be perfectly reasonable:

```text
O(cN) = O(N)
```

But nested scans can change the problem dramatically.

Always inspect whether one record scans another collection.

---

# 3. Deduplication

Naive duplicate detection:

```text
for every item:
    scan all previous items
```

can become:

```text
O(N²)
```

A `Set` changes the representation:

```text
seen.has(id)
seen.add(id)
```

giving expected `O(N)` time under normal hash-table assumptions and `O(U)` auxiliary space.

The algorithmic improvement comes from changing the representation, not from writing a cleverer loop.

---

# 4. Deduplication by Canonicalization

Real backend records may have multiple textual forms:

```text
" USER@example.com "
"user@example.com"
```

If the business contract considers them equivalent, normalize first.

```text
raw value
→ canonical value
→ Set
```

Canonicalization must be explicit.

Do not silently trim, lowercase, or normalize identifiers unless the domain defines those operations as equivalent.

---

# 5. Idempotency Keys

Idempotent APIs frequently need to detect whether an operation has already been processed.

A simplified algorithmic model is:

```text
request idempotency key
→ lookup
→ accept/reject/replay
```

For a batch of keys, hashing provides fast membership checks.

At the system level, however, the data structure must also account for concurrency, persistence, expiration, and distributed consistency.

DSA gives the local operation; system design determines correctness across processes.

---

# 6. Pagination

Offset pagination can require the database to skip many rows.

Keyset/cursor pagination instead uses an ordered boundary:

```text
WHERE (created_at, id) < (:cursor)
ORDER BY created_at DESC, id DESC
LIMIT :pageSize
```

Algorithmically, this is boundary-based traversal over ordered data.

The cursor must encode enough state to preserve a strict ordering.

Tie-breaking with a unique ID is essential when timestamps are not unique.

---

# 7. Merge Ordered Results

Backend systems often combine sorted data sources:

- database partitions;
- service responses;
- event streams;
- cached pages;
- ranked search results.

Two-pointer merging costs:

```text
O(N + M)
```

for two sorted sequences.

For many streams, the pattern generalizes to a heap-based k-way merge.

---

# 8. Top-K Results

Suppose an endpoint needs only the highest-scoring `K` records from `N` candidates.

Full sorting:

```text
O(N log N)
```

A min-heap of size `K` can provide approximately:

```text
O(N log K)
```

when only Top-K membership is needed.

This is a classic backend example of choosing an algorithm according to output requirements.

---

# 9. Rate Limiting Windows

A sliding-window model can represent request activity:

```text
[currentTime - windowSize, currentTime]
```

Possible implementations include:

- timestamp arrays;
- queues/deques;
- counters;
- bucketed windows;
- sorted sets in external stores.

The correct choice depends on precision, memory, distributed operation, and throughput requirements.

---

# 10. Fixed-Window vs Sliding-Window Rate Limits

### Fixed window

Simple counters per time bucket.

### Sliding window

Tracks activity over the exact moving interval or an approximation of it.

Sliding windows provide more precise semantics but usually require more state or computation.

This is a direct time-space-accuracy trade-off.

---

# 11. Log Processing

Logs are sequences of structured events.

Typical operations:

```text
filter by service
filter by time
count event types
find repeated errors
aggregate status codes
find Top-K endpoints
```

Frequency maps, windows, prefix aggregation, sorting, and streaming state all appear naturally.

For large logs, avoid materializing the entire dataset when a streaming pass is sufficient.

---

# 12. Streaming Aggregation

If the answer requires only a compact state, process records incrementally:

```text
record
→ update state
→ discard record
```

Examples:

- count events;
- maintain minimum/maximum;
- maintain Top-K;
- maintain frequency state;
- rolling metrics.

Memory can become:

```text
O(state)
```

instead of `O(N)`.

---

# 13. Prefix Aggregation for Metrics

Suppose a service stores a static time series and needs many range-sum queries.

Build:

```text
prefix[i] = total through i
```

Then each range query is constant time after preprocessing.

Trade-off:

```text
build: O(N)
query: O(1)
space: O(N)
```

For frequently updated data, a different data structure may be required.

---

# 14. Difference Arrays for Batch Updates

Imagine applying thousands of range-based adjustments to a static batch.

Instead of updating every affected element:

```text
mark boundary changes
→ prefix accumulation
```

This is useful conceptually for bulk scheduling, capacity changes, and interval coverage.

For dynamic online updates, use a data structure designed for updates rather than forcing a difference-array solution.

---

# 15. Intervals in Scheduling APIs

Backend scheduling commonly represents:

```text
booking start/end
maintenance windows
employee shifts
resource reservations
service outages
```

Core operations:

- overlap detection;
- merge intervals;
- insert booking;
- maximum concurrent bookings;
- available capacity.

Sorting by start time is often the first transformation.

---

# 16. Overlap Semantics Matter

These are different:

```text
[10, 11]
[11, 12]
```

if endpoints are closed.

They are non-overlapping under half-open semantics:

```text
[10, 11)
[11, 12)
```

Production APIs must define interval semantics explicitly.

An algorithm can be asymptotically optimal and still be wrong because endpoint semantics were unspecified.

---

# 17. Search Filtering

Suppose an endpoint receives a large set of candidate IDs and must filter against an allowlist.

Repeated linear membership checks can become expensive.

Transform the allowlist:

```text
array → Set
```

then process candidates in one pass.

This is a recurring backend pattern:

> Preprocess the structure that is queried repeatedly.

---

# 18. Batch Validation

Suppose each incoming record contains several fields.

A careless implementation might scan a reference list for every record and every field.

Analyze the dimensions:

```text
N = records
M = reference values
F = fields
```

A naive approach may approach:

```text
O(NMF)
```

while pre-indexing reference values can reduce membership checks dramatically.

Always name all independent parameters.

---

# 19. String Validation

Backend systems frequently validate:

- identifiers;
- slugs;
- URLs;
- tokens;
- usernames;
- search terms;
- headers.

Most validation should be linear in input length.

Avoid accidentally creating quadratic behavior through repeated concatenation, substring scans, or nested pattern checks.

---

# 20. String Normalization Pipelines

A production text pipeline may be:

```text
input
→ Unicode normalization
→ case policy
→ whitespace policy
→ punctuation policy
→ tokenization
→ canonical form
→ indexing
```

Each transformation has CPU and allocation costs.

If a normalized representation is reused repeatedly, caching may be worthwhile.

If it is used once, streaming normalization may reduce peak memory.

---

# 21. Log Token Frequency

Frequency maps can answer questions such as:

```text
most common endpoint
most common error code
most common event type
```

If the category domain is small and known, fixed counters can be more efficient.

If the domain is dynamic, `Map` provides flexibility.

Representation should follow the domain constraints.

---

# 22. Autocomplete and Prefixes

String prefixes appear in:

- autocomplete;
- command routing;
- feature flags;
- hierarchical keys;
- URL routing.

A simple scan can be sufficient for small datasets.

For large repeated prefix queries, indexing structures such as tries or sorted indexes can reduce repeated scanning.

The important decision is workload-aware:

```text
few queries → scan may be enough
many queries → preprocessing/indexing may pay off
```

---

# 23. Search Result Ranking

A search backend often has:

```text
candidate generation
→ scoring
→ Top-K selection
→ stable tie-breaking
```

The candidate list may be large while `K` is small.

Heap/selection algorithms can avoid sorting every candidate.

If candidates arrive from multiple sorted sources, k-way merge may be more appropriate.

---

# 24. Caching

Cache policies frequently use sequence/data-structure concepts.

Examples:

- LRU → map + linked ordering;
- LFU → frequency state;
- TTL expiration → time ordering;
- request coalescing → key-based state.

The array/string phase contributes the foundation: efficient traversal, hashing, ordering, and state maintenance.

---

# 25. LRU Cache Mental Model

At a high level:

```text
key → node lookup
recency → ordered structure
```

The key lesson is that one structure usually cannot provide all required operations efficiently.

Data-structure composition is often the real solution.

---

# 26. Event Deduplication

Event streams may contain repeated IDs.

A basic algorithm:

```text
seen = Set()
for event:
    if seen.has(event.id): skip
    else process and add
```

For unbounded streams, an unlimited `Set` is not operationally safe.

Production designs need retention/expiration or probabilistic structures when appropriate.

Algorithmic correctness must be reconciled with memory growth.

---

# 27. Bloom Filter Preview

A Bloom filter can answer:

```text
definitely not present
or
possibly present
```

with compact memory.

False positives are possible; false negatives are not under the standard model.

This is useful when exact storage is expensive and a probabilistic prefilter is acceptable.

It illustrates a broader backend principle:

> Relax exactness deliberately when the system contract allows a cheaper representation.

---

# 28. Distributed Systems Caveat

A local `Set`, `Map`, or array does not automatically provide global correctness.

With multiple instances:

```text
request → instance A
request → instance B
```

local state can diverge.

Distributed rate limits, deduplication, locks, and idempotency require shared state or a coordination strategy.

DSA handles local operations; distributed algorithms handle coordination.

---

# 29. Concurrency and Mutation

Shared arrays and maps can create race conditions at the system level.

Even if a sequence of operations is individually `O(1)`, concurrent execution may violate the intended invariant.

Backend reasoning must therefore include:

```text
algorithmic invariant
+
atomicity
+
consistency
+
concurrency model
```

---

# 30. Memory and Allocation

JavaScript backend performance is affected by:

- temporary arrays;
- object allocation;
- string concatenation;
- copying;
- retained references;
- garbage collection.

A theoretically optimal algorithm can still create unacceptable allocation pressure.

Measure peak live memory, not just the number of variables in source code.

---

# 31. Array Mutation and API Contracts

In-place processing can reduce allocations, but mutation can violate caller expectations.

For a backend utility, document whether it:

```text
mutates input
returns a copy
returns a view/reference
```

Algorithm choice and API contract must agree.

---

# 32. Stable Ordering

Backend APIs often require deterministic results.

If two records have equal scores, define a secondary key:

```text
score DESC
id ASC
```

This creates a total ordering suitable for pagination and reproducible results.

Unstable or implicit tie-breaking can cause records to move between pages.

---

# 33. Cursor Pagination and Composite Keys

For ordered fields `(A, B)`, a cursor must preserve lexicographic ordering:

```text
A < cursorA
OR
(A === cursorA AND B < cursorB)
```

This is fundamentally a two-dimensional ordering problem.

Understanding lexicographic comparison from array/string DSA makes these database pagination rules easier to reason about.

---

# 34. Backend Algorithm Review Checklist

For any sequence-processing code, ask:

1. What is the input size?
2. Are there multiple independent dimensions?
3. Is membership queried repeatedly?
4. Is the data sorted?
5. Is only a range/window relevant?
6. Is only Top-K required?
7. Can preprocessing be amortized?
8. Can the operation be streamed?
9. What is the auxiliary memory?
10. What allocations occur?
11. Is the input mutated?
12. Is ordering deterministic?
13. Does the state remain bounded?
14. Does local correctness survive concurrency/distribution?
15. What happens under adversarial input?

---

# 35. Complexity Patterns to Recognize

| Backend operation | Common pattern |
|---|---|
| Deduplication | hashing / Set |
| Batch membership | Set preprocessing |
| Range aggregation | prefix state |
| Range updates | difference array |
| Ordered merge | two pointers |
| Top-K | heap / selection |
| Rate limiting | sliding window / queue |
| Scheduling | intervals / sweep line |
| Prefix lookup | trie / sorted index |
| String equality | normalization + canonicalization |
| Log frequencies | Map / fixed counters |
| Large sparse domains | coordinate compression |
| Repeated substring checks | prefix metadata / hashing |
| Static range queries | preprocessing / offline processing |

---

# 36. Production Trade-Offs

Do not optimize only Big-O.

Backend systems care about:

```text
latency
throughput
memory
allocation
GC
I/O
network calls
contention
tail latency
operational complexity
correctness
```

A more complex `O(N log K)` solution is not automatically better than a simple `O(N log N)` solution when `N` is small and maintainability dominates.

Conversely, at very large scale, an asymptotically inferior choice can become an infrastructure problem.

---

# 37. Interview Translation

When asked about a backend algorithm, explain:

```text
1. workload
2. constraints
3. representation
4. algorithm
5. invariant
6. complexity
7. memory/allocation
8. concurrency/distribution caveats
9. operational trade-offs
```

This demonstrates engineering judgment rather than puzzle memorization.

---

# 38. Backend Capstone Scenarios

You should be able to reason through these without immediately coding:

### Scenario A — Duplicate Batch Import

Millions of records, duplicate IDs, bounded memory, deterministic output.

Identify hashing, memory strategy, chunking, and persistence concerns.

### Scenario B — Top 100 Search Results

Ten sorted result sources, millions of candidates.

Compare k-way merge with global sorting and heap-based selection.

### Scenario C — API Rate Limiter

100 requests per minute per user across many service instances.

Separate local window algorithms from distributed state/atomicity.

### Scenario D — Booking Conflict Detection

Millions of reservations with overlap queries.

Compare sorting/sweep-line preprocessing with online structures.

### Scenario E — Log Analytics

Continuous event stream with Top-K errors and rolling five-minute metrics.

Reason about streaming state, bounded memory, windows, and expiration.

---

# 39. Final Mental Model

Backend DSA is not about forcing interview algorithms into every function.

It is about seeing computational structure inside production requirements.

```text
"deduplicate these records"
→ hashing

"give me the top 20"
→ heap / selection

"merge these sorted feeds"
→ two pointers / k-way merge

"requests in the last minute"
→ sliding window

"sum this historical range"
→ prefix/indexing

"apply thousands of range changes"
→ difference representation

"find conflicting bookings"
→ intervals / sweep line

"compare normalized identifiers"
→ canonicalization + hashing
```

## Key Takeaways

1. Backend performance often improves when you change the **representation**, not merely the loop.
2. Hashing, windows, prefixes, ordering, intervals, and selection are practical production tools.
3. Always model independent input dimensions explicitly.
4. Preprocessing is valuable when query volume justifies its build and memory cost.
5. Streaming prevents unnecessary `O(N)` materialization when only compact state is required.
6. Bounded memory is a production requirement, not just a complexity footnote.
7. Deterministic ordering matters for pagination and reproducibility.
8. Local DSA correctness is not sufficient for distributed systems.
9. Backend algorithm engineering combines complexity with allocation, latency, concurrency, persistence, and operational constraints.
