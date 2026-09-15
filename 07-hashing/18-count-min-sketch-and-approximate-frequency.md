# 07.18 — Count-Min Sketch & Approximate Frequency

## 1. Concept Definition

A **Count-Min Sketch (CMS)** is a probabilistic data structure for estimating the frequency of items in a stream using sublinear memory.

Instead of storing an exact counter for every distinct key, it maintains a two-dimensional array of counters:

```text
          columns
       0   1   2   3   4
h1     0   3   0   1   0
h2     1   0   4   0   0
h3     0   2   0   0   5
```

Each item is mapped to one counter in every row. Its estimated count is the **minimum** of those counters.

## 2. Why It Exists

An exact frequency map requires storage proportional to the number of distinct keys:

```text
key → exact count
```

For enormous streams, this can be expensive.

CMS trades exactness for compactness:

```text
fixed memory
     ↓
stream updates
     ↓
approximate frequency queries
```

It is useful when approximate counts are acceptable and the system needs bounded memory.

## 3. Mental Model

Choose:

```text
width  = w
rows   = d
```

Each row has a different hash function.

For item `x`:

```text
row 1 → h1(x)
row 2 → h2(x)
...
row d → hd(x)
```

Increment the selected counter in every row.

To estimate `count(x)`:

```text
min(counter[row][hi(x)])
```

## 4. Why the Minimum Is Used

Every occurrence of `x` increments every counter selected for `x`.

Other keys can collide with those counters and add extra increments.

Therefore each relevant counter is generally:

```text
true count + collision noise
```

Taking the minimum across independent rows reduces the chance that collision noise is large in every row.

## 5. Fundamental Error Property

Under the standard non-negative-update CMS model:

```text
estimatedCount(x) >= trueCount(x)
```

The sketch can overestimate because collisions add counts.

It does not normally underestimate under the basic insertion-only/non-negative increment model.

## 6. Mathematical Error Bound

For width `w` and depth `d`, a standard parameterization uses:

```text
w ≈ e / ε
 d ≈ ln(1 / δ)
```

where:

- `ε` controls additive error;
- `δ` controls the probability that the error bound is exceeded.

A common bound is:

```text
estimatedCount(x) ≤ trueCount(x) + εN
```

with probability at least:

```text
1 - δ
```

where `N` is the total number of updates under the standard model.

## 7. Space Complexity

CMS uses:

```text
O(w × d)
```

counters.

If `w` and `d` are selected from error requirements, memory is independent of the number of distinct keys.

This is the major scalability advantage.

## 8. Update Complexity

Each update touches one counter per row:

```text
update → O(d)
```

Querying an estimate also requires `d` counters:

```text
query → O(d)
```

With fixed configured depth, both are effectively `O(1)`.

## 9. Counter Width

Counters require a finite representation.

Possible choices include:

- 32-bit integers;
- 64-bit integers;
- bounded counters.

Production design must consider overflow:

```text
very long stream
      ↓
large total count
      ↓
counter capacity
```

Overflow policy must be explicit.

## 10. Hash Functions

Hash quality strongly affects collision distribution.

The implementation should provide sufficiently independent-looking row mappings.

Double hashing can reduce the cost of generating multiple positions, but the resulting distribution should be validated empirically.

## 11. CMS vs Exact Map

| Property | Count-Min Sketch | Exact Map |
|---|---|---|
| Frequency | Approximate | Exact |
| Memory | Fixed/sublinear | Distinct-key dependent |
| Overestimation | Possible | No |
| Underestimation | Not in basic non-negative model | No |
| Enumerating keys | Not supported by itself | Supported |
| Arbitrary deletion | Requires special handling | Supported |
| Stream scale | Excellent | Can become memory-heavy |

CMS is appropriate when frequency estimation matters more than exact per-key storage.

## 12. CMS vs Bloom Filter

Bloom filter answers:

```text
Could this key exist?
```

CMS answers:

```text
How many times has this key approximately occurred?
```

They can be composed:

```text
Bloom filter → existence screen
CMS          → approximate frequency
```

## 13. CMS vs HyperLogLog

These solve different problems:

```text
CMS → approximate frequency of individual keys
HLL → approximate number of distinct keys
```

For example:

```text
CMS: "How many requests did user X make?"
HLL: "Approximately how many unique users appeared?"
```

## 14. Frequency Queries

Typical operations are:

```text
add(key)
estimate(key)
```

The sketch does not inherently retain the original keys.

Therefore a query for a key can be performed if the caller has the key, but the sketch alone cannot enumerate every key that has appeared.

## 15. Heavy Hitters

CMS is useful for identifying frequently occurring items when combined with a candidate-management strategy.

A common architecture is:

```text
stream
  ↓
CMS frequency estimate
  ↓
candidate tracker
  ↓
heavy-hitter set
```

CMS provides approximate counts; it does not automatically return the top keys because it does not store the complete key universe.

## 16. Backend Application: API Traffic

A backend can estimate request frequencies:

```text
route + tenant + identity
          ↓
CMS
          ↓
approximate request count
```

Useful for:

- traffic analytics;
- anomaly detection;
- adaptive throttling signals;
- hot-key detection;
- operational dashboards.

If enforcement must be exact, an authoritative counter or rate-limit mechanism may still be required.

## 17. Backend Application: Abuse Detection

A stream of events can be counted approximately:

```text
identity → approximate event frequency
```

The system can flag unusually frequent identities while keeping bounded memory.

Because counts can be overestimated, threshold policies should account for the error bound.

## 18. Backend Application: Observability

High-cardinality telemetry can be expensive to store exactly.

A CMS can estimate frequencies of:

- endpoint IDs;
- error signatures;
- event types;
- user-agent categories;
- cache keys;
- request fingerprints.

This can support approximate dashboards without retaining a full exact counter map.

## 19. Backend Application: Distributed Streams

A CMS can be maintained per stream partition:

```text
partition 1 → CMS
partition 2 → CMS
partition 3 → CMS
```

To obtain a global estimate, compatible sketches can be merged by adding corresponding counters.

This mergeability is one of the useful properties of CMS.

## 20. Mergeability

If two sketches have compatible dimensions and hash configuration:

```text
CMS_A + CMS_B = CMS_merged
```

corresponding counters are added.

This enables distributed aggregation:

```text
workers
  ↓
local sketches
  ↓
merge
  ↓
global approximate counts
```

The error budget must be interpreted over the combined stream.

## 21. Sliding Windows

A basic CMS accumulates counts indefinitely.

For time-bounded analytics, use techniques such as:

```text
window 1
window 2
window 3
```

and expire old sketches.

The exact architecture depends on whether the requirement is tumbling, sliding, or exponentially decayed frequency.

## 22. Time-Decayed Frequency

For real-time systems, recent events may matter more than old events.

A system can maintain time-bucketed sketches and apply decay or replace expired buckets.

This changes the meaning of the estimate from:

```text
all-time count
```

to something like:

```text
recent weighted frequency
```

The semantics must be explicitly documented.

## 23. Negative Updates

The basic CMS guarantee is easiest to reason about with non-negative increments.

If arbitrary negative updates are introduced:

```text
estimatedCount >= trueCount
```

is no longer generally guaranteed in the same way.

Production designs involving decrements require a separate error analysis.

## 24. Conservative Update

A variation called **conservative update** can reduce overestimation.

Instead of incrementing every selected counter blindly:

1. estimate the current minimum;
2. increment only counters at that minimum toward the new estimate.

This can reduce collision noise in some workloads while changing update semantics and implementation complexity.

## 25. Conservative Update Trade-Off

Standard update:

```text
increment all d counters
```

Conservative update:

```text
find minimum
increment selected minimum counters
```

The second approach can improve estimates empirically but requires additional reads and a carefully defined invariant.

## 26. Count-Min Sketch for AI Systems

AI pipelines can produce massive event streams such as:

- token frequencies;
- feature occurrences;
- candidate generation counts;
- retrieval frequency;
- document access frequency;
- label frequencies;
- feature-store access patterns.

CMS can provide approximate frequency signals without storing every distinct key exactly.

## 27. Token Frequency Example

For a very large text stream:

```text
token → CMS
```

The system can estimate frequent tokens while bounding memory.

However, if the exact vocabulary must be recovered, CMS alone is insufficient because it does not store the keys.

A separate dictionary/candidate structure is needed.

## 28. Retrieval Systems

A retrieval service can estimate how frequently documents/chunks are requested:

```text
chunkId → CMS
```

These estimates can support:

- cache warming;
- popularity signals;
- sampling;
- approximate analytics.

For cache eviction or billing where exact accounting is required, an exact source may still be necessary.

## 29. Correctness Invariants

For a standard non-negative CMS:

1. every update increments exactly one counter per row;
2. query reads exactly one corresponding counter per row;
3. estimate is the minimum selected counter;
4. counts never decrease under insertion-only updates;
5. estimate should not be below the true count under the standard model.

## 30. Error Reasoning

CMS has two dimensions of uncertainty:

```text
width  → collision probability / additive error
 depth → probability confidence
```

Increasing width generally reduces collision error.

Increasing depth generally increases confidence that the bound holds.

Both increase memory and update/query work.

## 31. Common Mistakes

1. Thinking CMS stores keys.
2. Treating estimates as exact counts.
3. Assuming it cannot overestimate.
4. Assuming it cannot underestimate after arbitrary negative updates.
5. Confusing CMS with Bloom filters.
6. Confusing CMS with HyperLogLog.
7. Forgetting total-stream size `N` in error bounds.
8. Ignoring counter overflow.
9. Ignoring hash distribution.
10. Claiming CMS can directly enumerate top-K keys.
11. Merging incompatible sketches.
12. Ignoring window semantics.

## 32. Edge Cases & Failure Modes

Test:

- empty stream;
- one key repeated heavily;
- all unique keys;
- extreme skew;
- width too small;
- depth too small;
- counter overflow;
- incompatible sketch merge;
- serialized/deserialized state;
- window expiration;
- negative updates;
- adversarial keys.

## 33. Benchmarking

Measure:

- update throughput;
- query throughput;
- memory usage;
- observed overestimation;
- error distribution;
- heavy-hitter accuracy;
- merge cost;
- serialization cost;
- performance under skew.

Compare against an exact `Map` reference on representative workloads.

## 34. Production Design Framework

Before deploying CMS:

```text
1. What frequency question are we answering?
2. Is overestimation acceptable?
3. What additive error is acceptable?
4. What confidence is required?
5. What is expected stream volume N?
6. What memory budget exists?
7. Are negative updates required?
8. Are time windows required?
9. Must sketches be merged?
10. How will candidate keys/heavy hitters be tracked?
11. What happens on overflow or corruption?
12. What is the authoritative fallback?
```

## 35. Interview Preparation

Be able to explain:

1. What a Count-Min Sketch is.
2. Why it uses multiple rows.
3. Why the query takes the minimum.
4. Why the estimate can overestimate.
5. The `ε`/`δ` error model.
6. Width vs depth.
7. CMS vs Set/Map.
8. CMS vs Bloom filter.
9. CMS vs HyperLogLog.
10. Heavy-hitter architectures.
11. Mergeability.
12. Sliding-window approaches.
13. Conservative update.
14. Why arbitrary negative updates change the error model.
15. How CMS applies to backend and AI workloads.

## 36. Revision Checklist

- [ ] I can explain the CMS mental model.
- [ ] I can derive update/query operations.
- [ ] I understand why minimum is used.
- [ ] I can explain overestimation.
- [ ] I understand width and depth.
- [ ] I can derive the approximate error bound.
- [ ] I understand fixed-memory scaling.
- [ ] I can compare CMS with Bloom filters and HLL.
- [ ] I understand heavy-hitter limitations.
- [ ] I can merge compatible sketches.
- [ ] I understand windowed frequency.
- [ ] I understand conservative updates.
- [ ] I can identify counter-overflow risks.
- [ ] I can design a backend/AI frequency pipeline.

## 37. Key Takeaways

1. **Count-Min Sketch estimates frequencies using fixed memory.**
2. **A standard non-negative CMS overestimates rather than underestimates because collisions add noise.**
3. **Width controls additive error; depth controls confidence.**
4. **CMS does not store the key universe and cannot enumerate top keys by itself.**
5. **CMS is different from Bloom filters and HyperLogLog because it estimates per-key frequency.**
6. **Compatible sketches can be merged by adding corresponding counters.**
7. **Time windows and negative updates require additional reasoning beyond the basic model.**
8. **CMS is valuable for high-cardinality backend telemetry and large AI streams where exact counters are too expensive.**
9. **Approximate estimates must be interpreted with their error budget rather than treated as exact facts.**
10. **A production design should define the frequency semantics, error tolerance, lifecycle, and authoritative fallback before choosing CMS.**
