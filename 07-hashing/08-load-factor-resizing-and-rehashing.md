# 07.08 — Load Factor, Resizing & Rehashing

> **Phase 07 — Hashing**  
> **Focus:** capacity management, performance stability, and structural rebuilds

## 1. Concept Definition

A hash table does not have a fixed performance cost independent of how full it becomes. **Load factor** measures how much of the table's capacity is currently occupied.

For `N` live entries and `M` buckets/slots:

```text
α = N / M
```

As the table becomes more heavily loaded, collisions, chain lengths, or probe lengths generally increase. **Resizing** changes the table capacity. **Rehashing** redistributes existing entries into the new table according to the new capacity and hashing rules.

These are related but distinct concepts:

- **Resize:** change capacity.
- **Rehash:** recompute placement and rebuild the table.
- A resize of a hash table normally requires rehashing.

---

## 2. Why Load Factor Exists

Without a capacity metric, a hash-table implementation cannot reason about when performance is approaching an unacceptable region.

Load factor connects logical size to physical capacity:

```text
entries ↑
capacity fixed
   ↓
α ↑
   ↓
more collisions / probes
   ↓
lookup cost ↑
```

For chaining, `α` is closely related to expected chain length. For open addressing, `α` directly controls how many empty slots remain and therefore has an even stronger effect on probe cost.

---

## 3. Mental Model

Think of a hash table as a parking system.

```text
small occupancy → many free spaces → easy placement
large occupancy → fewer free spaces → more searching
```

When occupancy crosses a policy threshold:

```text
current table
     ↓
allocate larger table
     ↓
recompute placement
     ↓
insert live entries
     ↓
replace old table
```

The goal is not merely to "make the array bigger." The goal is to restore a healthy distribution and capacity-to-entry ratio.

---

## 4. Load Factor by Collision Strategy

### Separate chaining

```text
α = N / M
```

`α` can exceed `1` because multiple entries can occupy one bucket through chains.

A higher `α` generally means longer expected chains.

### Open addressing

```text
N ≤ M
```

Every live entry requires a slot. In practice, the table should resize well before it becomes completely full because probe lengths rise rapidly at high occupancy.

This is one of the most important differences between the two collision strategies.

---

## 5. Capacity Policy

A table needs a capacity policy, not just a capacity value.

Typical policy questions:

- What is the initial capacity?
- What is the maximum load factor?
- How much should capacity grow?
- When should capacity shrink?
- What happens after many deletions?
- Should tombstone accumulation trigger cleanup?
- Should minimum capacity be enforced?
- Are capacity values restricted to primes or powers of two?

These are engineering decisions determined by workload and implementation details.

---

## 6. Growth Threshold

A common trigger is:

```text
if (size / capacity) > maxLoadFactor:
    resize
```

Equivalent threshold reasoning:

```text
size > capacity × maxLoadFactor
```

The threshold should be chosen with the collision strategy and workload in mind.

Do not blindly copy a threshold from another implementation. The right value depends on:

- probe strategy
- chain representation
- hash quality
- key size
- operation mix
- memory constraints
- latency requirements

---

## 7. Geometric Growth

Suppose capacity grows by a constant factor `g > 1`:

```text
M
→ gM
→ g²M
→ g³M
→ ...
```

This avoids resizing on every insertion.

Although an individual resize costs `O(N)`, geometric growth allows the total cost of many insertions to be amortized.

Under the usual assumptions, resizing contributes **amortized O(1)** additional insertion cost.

The exact constant depends on the growth policy and workload.

---

## 8. Why Rehashing Is Necessary

Suppose:

```text
old capacity = 5
new capacity = 11
```

and bucket index is computed as:

```text
hash % capacity
```

The same hash can produce different bucket indices:

```text
hash = 17
17 % 5  = 2
17 % 11 = 6
```

Therefore entries cannot simply be copied to the same numeric slot/bucket.

They must be reinserted according to the new capacity.

---

## 9. Rehashing Algorithm

High-level process:

```text
old table
   ↓
create new empty table
   ↓
for each live entry:
    recompute hash/index
    locate new bucket/slot
    insert entry
   ↓
replace old table
```

Time complexity:

```text
O(N)
```

Auxiliary space during a full rebuild is typically:

```text
O(M' + N)
```

where `M'` is the new capacity, although implementation techniques can alter the exact allocation behavior.

---

## 10. Rehashing vs Recomputing the Hash

"Rehashing" does not necessarily mean recomputing an expensive key hash from scratch if the hash code can safely be cached.

Separate the concepts:

```text
key → hash code → bucket index
```

If the hash code depends only on immutable key state, caching it can reduce repeated key-processing work.

However, cached hashes require careful memory and mutation semantics.

Never cache a hash for an object whose equality-relevant state can mutate unless the data structure explicitly prevents or handles that mutation.

---

## 11. Shrinking

Growth is usually straightforward. Shrinking is more subtle.

A shrink policy may trigger when:

```text
size / capacity < minLoadFactor
```

But aggressive shrinking can cause **resize thrashing**:

```text
insert → grow
remove → shrink
insert → grow
remove → shrink
```

A robust policy may use hysteresis:

```text
grow threshold = high
shrink threshold = significantly lower
```

This creates a buffer between the two transitions.

---

## 12. Hysteresis

Hysteresis prevents frequent structural changes near a boundary.

Example:

```text
Grow when α > 0.75
Shrink when α < 0.20
```

The exact thresholds are illustrative, not universal.

The principle is:

> **Do not use nearly identical thresholds for growth and shrink unless repeated resizing is acceptable.**

---

## 13. Tombstone Pressure

Open addressing introduces another capacity-management signal: tombstones.

You can have:

```text
live entries = low
physical occupied/history slots = high
```

because deleted entries remain as tombstones.

Therefore monitor both:

```text
live load factor
and
physical/tombstone pressure
```

A clean rehash can remove tombstones without necessarily changing the logical set of entries.

---

## 14. Chaining Resize

For separate chaining:

```text
bucket count M
      ↓
new bucket count M'
      ↓
recompute bucket for every entry
      ↓
rebuild chains
```

The entries remain separate objects/nodes, but their bucket assignment changes.

A resize may therefore alter:

- chain lengths
- collision distribution
- iteration order
- memory locality
- cache behavior

depending on the implementation.

---

## 15. Open Addressing Resize

For open addressing:

```text
old slots
   ↓
new slots
   ↓
reinsert live entries
```

Tombstones should generally not be copied into the new table.

For double hashing, the new capacity may also change the validity and behavior of the second-hash step, so the probe sequence must be recomputed correctly.

---

## 16. Amortized Analysis

Consider inserting `N` items into a geometrically growing table.

Most insertions cost approximately constant time.

Occasionally one insertion triggers a rebuild costing `O(N)`.

Across a long sequence:

```text
many cheap operations
+
occasional expensive rebuilds
=
small average structural cost per operation
```

This is the classic setting for amortized analysis.

The important distinction is:

- **worst-case individual insertion:** can be `O(N)` because of resize
- **amortized insertion:** expected/aggregate `O(1)` under the normal geometric-growth model

Do not call the individual operation worst-case `O(1)` simply because the amortized cost is `O(1)`.

---

## 17. Complexity Summary

| Operation | Typical expected | Resize case |
|---|---:|---:|
| Insert | `O(1)` | `O(N)` |
| Get | `O(1)` | N/A |
| Delete | `O(1)` | implementation-dependent cleanup |
| Rehash | — | `O(N)` |
| Iteration | `O(N + M)` | — |

These are high-level bounds. Collision behavior, key-hash cost, and representation can change practical performance.

---

## 18. Memory During Resize

A resize can temporarily require memory for both tables:

```text
old table + new table
```

For large in-memory systems this can cause significant memory spikes.

Production systems should consider:

- peak allocation
- garbage collection
- allocation latency
- copy cost
- cache disruption
- concurrent readers/writers
- incremental or staged migration where appropriate

The theoretical `O(N)` rebuild cost does not describe these operational effects by itself.

---

## 19. Incremental Rehashing

For latency-sensitive systems, rebuilding an entire table in one operation can create a long pause.

An alternative is **incremental rehashing**:

```text
old table + new table
       ↓
move a bounded number of entries per operation
       ↓
continue serving requests
       ↓
finish migration
       ↓
discard old table
```

This spreads structural work over time.

Trade-offs include:

- more implementation complexity
- dual-table lookup logic during migration
- additional memory
- more complicated correctness invariants

---

## 20. Concurrent Resize Considerations

In concurrent systems, resizing is substantially harder.

Questions include:

- Can readers access the old table during migration?
- Can writers insert into both tables?
- How is an entry moved atomically?
- When is the old table safe to reclaim?
- How are duplicate entries prevented?
- How is memory reclamation handled?

Possible approaches include locks, stop-the-world rebuilds, striped synchronization, copy-on-write structures, or specialized concurrent hash-table algorithms.

Do not treat ordinary single-threaded rehashing as automatically thread-safe.

---

## 21. Capacity Arithmetic

Capacity choices interact with hashing.

Examples include:

- prime capacities
- power-of-two capacities
- carefully designed bit masking
- modulo reduction

For power-of-two capacities:

```text
index = hash & (capacity - 1)
```

can replace modulo when the required conditions hold.

But fast index calculation does not compensate for a weak hash function. The lower bits must be sufficiently distributed when masking is used.

---

## 22. Production Observability

A production hash table should expose useful signals where practical:

- current size
- capacity
- load factor
- tombstone count
- maximum chain length / probe length
- resize count
- resize duration
- entries moved per resize
- allocation/peak-memory impact
- operation latency

These metrics help distinguish:

```text
hash-quality problem
vs
capacity-policy problem
vs
workload-growth problem
```

---

## 23. Backend Engineering Applications

Capacity management matters in backend systems that maintain large in-memory maps:

- session stores
- local caches
- idempotency-key registries
- rate-limit state
- request deduplication
- routing metadata
- connection metadata

For example, if a local cache repeatedly grows and resizes during traffic spikes, the average lookup complexity may remain theoretically constant while p99 latency increases because of rebuild pauses.

Engineering therefore considers both:

```text
amortized algorithmic cost
+
operational latency cost
```

---

## 24. AI Engineering Applications

Hash-table capacity management appears in:

- exact inference caches
- memoization tables
- visited-state sets
- candidate deduplication
- vocabulary/ID maps
- retrieval-result caches
- agent state registries

AI workloads can produce sudden bursts of unique keys. A good policy must handle growth without allowing uncontrolled memory expansion or pathological rebuild behavior.

---

## 25. Problem-Solving Framework

When analyzing a resizing problem:

```text
1. Determine N and M
2. Compute α
3. Identify collision strategy
4. Identify growth/shrink thresholds
5. Determine new capacity
6. Recompute placement
7. Count moved entries
8. Analyze one resize cost
9. Analyze amortized cost
10. Analyze memory peak
11. Check operational latency
```

This framework prevents the common mistake of discussing only the resize formula while ignoring rehash cost and runtime behavior.

---

## 26. Interview Preparation

### Core questions

1. What is load factor?
2. Why does load factor affect performance?
3. Why can chaining exceed load factor `1`?
4. Why must open addressing remain below capacity?
5. Why is rehashing required after resizing?
6. What is amortized resizing cost?
7. Why can one insertion still be `O(N)`?
8. What are tombstones?
9. Why can shrinking cause thrashing?
10. What is hysteresis?

### Advanced questions

- Design a growth/shrink policy for a cache with bursty traffic.
- Explain incremental rehashing.
- How would you avoid a resize pause in a latency-sensitive service?
- What metrics would reveal poor hash distribution?
- How does power-of-two capacity interact with hash quality?
- How would concurrent readers behave during migration?

---

## 27. Implementation Lab

Build capacity management in stages.

### Stage 1 — Fixed capacity

Implement load-factor measurement and threshold detection.

### Stage 2 — Geometric growth

Implement:

- growth factor
- threshold
- new allocation
- rehash
- metadata updates

### Stage 3 — Shrinking

Implement:

- minimum capacity
- low threshold
- hysteresis
- anti-thrashing tests

### Stage 4 — Tombstone cleanup

Implement cleanup triggered by deletion pressure.

### Stage 5 — Production analysis

Measure:

- resize duration
- entries moved
- memory peak
- operation latency before/during/after resize
- p95/p99 behavior

---

## 28. Practice Problems

The companion exercise file contains unsolved problems covering:

- load-factor calculation
- growth/shrink thresholds
- geometric capacity growth
- amortized analysis
- rehashing
- tombstone pressure
- capacity arithmetic
- hysteresis
- resize thrashing
- memory spikes
- incremental rehashing
- observability
- backend and AI capacity design

**Rule:** whenever you see a resize, analyze both the one-time `O(N)` cost and the aggregate amortized cost.

---

## 29. Revision Checklist

- [ ] I can derive `α = N/M`.
- [ ] I can explain the difference between resize and rehash.
- [ ] I know why entries must be rehashed.
- [ ] I can calculate a resize threshold.
- [ ] I understand geometric growth.
- [ ] I can explain amortized `O(1)` insertion.
- [ ] I can distinguish worst-case and amortized complexity.
- [ ] I understand shrink hysteresis.
- [ ] I understand tombstone pressure.
- [ ] I can explain incremental rehashing.
- [ ] I can reason about memory spikes during rebuilds.
- [ ] I can design production observability for capacity management.

## Key Takeaways

1. Load factor connects logical entries to physical capacity.
2. High occupancy generally increases collision or probe cost.
3. Resizing changes capacity; rehashing redistributes entries under the new geometry.
4. A resize normally costs `O(N)` but geometric growth makes the structural cost amortized.
5. Individual resize-triggering operations can still have `O(N)` worst-case cost.
6. Shrinking needs hysteresis to avoid resize thrashing.
7. Open addressing must account for tombstones in addition to live load factor.
8. Large production tables may need incremental or carefully coordinated rebuilding.
9. Memory spikes and tail latency are part of the real cost of resizing.
10. Capacity policy should be designed from workload, collision strategy, latency, and memory requirements.
