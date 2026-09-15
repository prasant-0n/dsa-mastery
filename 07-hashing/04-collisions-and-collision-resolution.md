# 07.04 — Collisions & Collision Resolution

> **Phase 07 — Hashing**
>
> A collision occurs when distinct keys map to the same bucket or initial table position. Collisions are inevitable; a production-quality hash table is defined partly by how correctly and efficiently it resolves them.

## 1. Learning Objectives

By the end of this chapter you should be able to:

- define a collision precisely;
- explain why collisions cannot be eliminated for an unrestricted key space;
- distinguish hash collision from key equality;
- understand the two major resolution families;
- reason about separate chaining and open addressing;
- trace collision resolution step by step;
- understand why deletion differs between strategies;
- analyze clustering and probe behavior;
- choose a strategy from workload requirements;
- connect collision handling to backend and AI systems.

---

## 2. Collision Definition

For distinct keys `A` and `B`:

```text
A != B
h(A) = h(B)
```

This is a hash collision.

At table level, after bucket reduction:

```text
index(A) = index(B)
```

also creates a collision at the storage location.

---

## 3. Why Collisions Are Inevitable

If there are more possible keys than available positions, the pigeonhole principle guarantees that at least two keys share a position.

Therefore the goal is not:

```text
never collide
```

but:

```text
collide infrequently
resolve cheaply
preserve correctness
```

---

## 4. Collision Does Not Mean Duplicate Key

These are different:

```text
same key
→ update existing entry
```

versus:

```text
different keys
→ same bucket
→ collision
```

A correct implementation must compare actual keys after collision detection.

---

## 5. Collision-Resolution Families

Two fundamental families are:

```text
Separate chaining
Open addressing
```

### Chaining

Multiple entries can occupy one bucket through a secondary structure.

### Open addressing

Every entry remains inside the table array; collisions are resolved by probing alternative positions.

---

## 6. Separate Chaining Mental Model

Imagine:

```text
bucket[0] → []
bucket[1] → [(A,1)]
bucket[2] → [(B,2),(C,3)]
bucket[3] → []
```

If `B` and `C` map to bucket 2, both remain reachable through that bucket.

Lookup scans candidates until the actual key matches.

---

## 7. Chaining Lookup

Conceptually:

```text
get(K)
 ↓
hash(K)
 ↓
bucket index
 ↓
walk bucket chain
 ↓
compare keys
 ↓
return match / not found
```

Expected work depends on the load factor and distribution.

---

## 8. Chaining Insert

Insertion normally means:

```text
find bucket
 ↓
scan for equal key
 ↓
update if found
 ↓
otherwise append/create entry
```

Whether entries are linked nodes, arrays, trees, or another structure is an implementation decision.

---

## 9. Chaining Delete

Deletion is comparatively straightforward:

```text
find bucket
 ↓
find matching key
 ↓
remove candidate
 ↓
repair secondary structure
```

There is no need to preserve an empty-slot probe path as in open addressing.

---

## 10. Open Addressing Mental Model

Open addressing stores entries directly in the table:

```text
index: 0  1  2  3  4  5
       A  _  B  C  _  _
```

If the desired position is occupied, the algorithm probes another position according to a defined sequence.

---

## 11. Probe Sequence

Conceptually:

```text
p0 = initial position
p1 = next position
p2 = next position
...
```

The sequence must be deterministic for a given key and table state, subject to the chosen hashing policy.

Later chapters study specific probing strategies.

---

## 12. Linear Probing

A simple sequence is:

```text
h(K)
h(K)+1
h(K)+2
h(K)+3
...
```

with indices wrapped around the table.

It is simple and cache-friendly but vulnerable to primary clustering.

---

## 13. Primary Clustering

Linear probing can create contiguous occupied runs:

```text
[X][X][X][X][ ][ ]
```

A new collision entering anywhere in that region can extend the cluster.

As clusters grow, probe lengths increase.

---

## 14. Quadratic Probing

A conceptual sequence is:

```text
h(K) + c1*i + c2*i²
```

for probe number `i`.

It spreads probes more than simple linear probing and can reduce primary clustering, but its parameter choices and coverage properties require careful analysis.

---

## 15. Double Hashing

A second hash function determines the probe step:

```text
index_i = h1(K) + i × h2(K)
```

This can produce better probe dispersion than linear probing and is an important open-addressing technique.

---

## 16. Secondary Clustering

Some probing schemes cause keys with the same initial position to follow related probe paths.

This is called secondary clustering.

A key engineering question is therefore not merely “Does it probe?” but:

> How independent are probe sequences for different keys?

---

## 17. Deletion in Open Addressing

Naively doing:

```text
occupied → empty
```

can break future searches.

Example:

```text
A → slot 2
B → slot 3 after collision
```

If slot 2 is emptied and lookup for `B` stops at the first empty slot, `B` becomes unreachable.

---

## 18. Tombstones

A common solution is a special marker:

```text
EMPTY
OCCUPIED
DELETED
```

A deleted slot remains part of the probe path but is available for future insertion under the appropriate policy.

Tombstones can accumulate and increase probe lengths.

---

## 19. Rehashing After Deletion

Another strategy is to rebuild part of the table or the entire table after deletion.

This can eliminate tombstones but adds rebuilding cost.

The choice depends on workload and implementation complexity.

---

## 20. Chaining vs Open Addressing

| Property | Chaining | Open addressing |
|---|---|---|
| Storage | bucket + secondary entries | table array |
| Load factor | can exceed 1 | must remain below capacity |
| Delete | simpler | more subtle |
| Allocation | often more | potentially less |
| Locality | weaker with pointer chains | often strong |
| Clustering | chain concentration | probe clustering |
| Implementation | conceptually simple | more state-sensitive |

Neither strategy is universally superior.

---

## 21. Load Factor and Collisions

For chaining:

```text
α = N / M
```

approximates average chain length.

For open addressing, high `α` means fewer empty slots and generally longer probe sequences.

Therefore open addressing usually requires stricter load-factor control.

---

## 22. Expected Search Cost

Under suitable hashing assumptions, chaining can have expected search work related to:

```text
O(1 + α)
```

Open addressing has expected probe counts that depend strongly on `α` and the probing scheme.

Exact formulas require assumptions about uniform hashing and probe behavior.

---

## 23. Worst-Case Collision Scenario

If every key maps to one location under chaining:

```text
bucket[0] → N entries
```

A lookup can become:

```text
O(N)
```

For open addressing, a pathological probe sequence can similarly inspect O(N) slots.

Collision resolution preserves correctness; it cannot magically remove worst-case work.

---

## 24. Hash Function and Collision Resolution Are Coupled

Performance depends on:

```text
hash quality
×
load factor
×
resolution strategy
×
workload
```

Evaluating a hash function separately from its table design can produce misleading conclusions.

---

## 25. Bucket Overflow Is Not Automatically an Error

In chaining, a bucket holding several entries is normal.

The real question is:

```text
Is occupancy sufficiently distributed?
Is lookup still within the expected performance envelope?
```

A collision itself is not a correctness failure.

---

## 26. Equality Checks After Collision

Suppose:

```text
h(A) = h(B)
```

A lookup for `A` cannot return `B` merely because the hashes match.

It must perform the table's equality comparison:

```text
candidate.key equals queryKey?
```

This distinction is essential for correctness.

---

## 27. Hash Collisions vs Storage Collisions

There are two useful concepts:

### Hash collision

Two keys produce the same hash code.

### Bucket collision

Two hashes reduce to the same table index.

A large hash space can still produce bucket collisions because the table has far fewer buckets.

---

## 28. Collision Metrics

Useful measurements include:

```text
collision count
collision rate
maximum bucket load
average chain length
average probe count
95th/99th percentile probes
```

Tail latency matters in backend systems because a small fraction of long collision paths can affect request latency.

---

## 29. Correctness Invariants

A collision-resolution implementation should maintain:

1. Every inserted key remains reachable.
2. Distinct colliding keys remain distinct.
3. Equal keys update the intended entry.
4. Lookup stops only when correctness permits it.
5. Delete does not make unrelated entries unreachable.
6. Resize preserves all logical entries.
7. Probe sequences remain valid after mutations.

---

## 30. Backend Application: Cache Keys

Suppose:

```text
cacheKey → response
```

Multiple keys may collide internally.

The cache must still return the response for the exact requested key.

A collision must never become a cache correctness bug.

---

## 31. Backend Application: Rate Limiting

A service may track:

```text
userId → request state
```

or:

```text
IP → request state
```

Hash-based lookup gives fast expected access, while collision handling ensures independent clients remain independent entries.

---

## 32. Backend Application: Idempotency

For:

```text
idempotencyKey → operation state
```

collision handling is especially important because incorrectly treating two keys as equal could cause one client's operation to be mistaken for another's.

Hashing accelerates lookup; equality enforces identity.

---

## 33. AI Application: Candidate Sets

A retrieval or ranking pipeline may maintain:

```text
candidateId → candidate metadata
```

Collisions are an internal storage concern and must not merge distinct candidate IDs.

Hash sets are also useful for deduplicating candidate identifiers.

---

## 34. AI Application: Exact Cache

An inference cache can use a canonical request key:

```text
requestKey → model output
```

Hash collisions must remain transparent to the application because exact key equality determines whether a cached result is reusable.

---

## 35. Memory and Cache Locality

Open addressing can have strong locality because entries live inside a contiguous table.

Chaining may involve pointer/reference traversal and separately allocated nodes.

Asymptotically similar operations can therefore have different real-world performance.

---

## 36. Allocation Behavior

Chaining may require allocations for new nodes or entry containers.

Open addressing can reduce per-entry allocation but may require larger contiguous storage and periodic rebuilding.

This matters in garbage-collected runtimes such as JavaScript.

---

## 37. Adversarial Collision Attacks

If an attacker can force many keys into the same bucket, lookup cost can degrade substantially.

Defenses can include:

```text
stronger/keyed hashing
randomized seeds
input restrictions
load-factor controls
timeouts/resource limits
```

The right defense depends on the threat model.

---

## 38. Choosing a Resolution Strategy

Ask:

1. Is memory locality important?
2. How high can load factor become?
3. How frequent are deletions?
4. Are allocations expensive?
5. Are keys adversarial?
6. Are predictable latency tails important?
7. Is implementation simplicity important?
8. Is the workload read-heavy, write-heavy, or mixed?

The data structure should follow the workload.

---

## 39. Interview Questions

1. What is a collision?
2. Why are collisions unavoidable?
3. How does separate chaining work?
4. How does open addressing work?
5. Why does linear probing cluster?
6. What is quadratic probing?
7. What is double hashing?
8. Why is deletion difficult in open addressing?
9. What is a tombstone?
10. How does load factor affect collisions?
11. Can two different keys have the same hash?
12. Why must keys still be compared after a hash match?
13. Chaining vs open addressing?
14. How would you measure collision quality?
15. How could adversarial collisions affect a backend service?

---

## 40. Implementation Lab

Implement the same dictionary twice:

### Version A

Separate chaining.

### Version B

Open addressing with linear probing and tombstones.

Instrument both for:

```text
collision count
lookup comparisons
probe count
maximum chain length
load factor
resize count
memory/allocation behavior
```

Then compare them under identical workloads.

---

## 41. Revision Checklist

- [ ] I can define collision precisely.
- [ ] I understand why collisions are inevitable.
- [ ] I can explain chaining.
- [ ] I can explain open addressing.
- [ ] I understand linear probing.
- [ ] I understand primary clustering.
- [ ] I understand quadratic probing and double hashing.
- [ ] I understand tombstones.
- [ ] I understand why deletion can break open-addressed lookup.
- [ ] I can compare chaining and open addressing.
- [ ] I can analyze collision-related complexity.
- [ ] I can identify collision invariants.
- [ ] I can connect collision behavior to backend and AI workloads.
- [ ] I can implement and benchmark both major strategies.

---

## 42. Key Takeaways

1. Collisions are mathematically unavoidable.
2. A collision is not the same thing as key equality.
3. Separate chaining stores multiple candidates per bucket.
4. Open addressing probes alternative table positions.
5. Linear probing is simple but vulnerable to clustering.
6. Deletion is especially subtle in open addressing.
7. Load factor strongly influences collision and probe behavior.
8. Hash quality and collision-resolution strategy must be evaluated together.
9. Correct equality checks protect application semantics.
10. Backend and AI systems care about both average performance and latency tails.
