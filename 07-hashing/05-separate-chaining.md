# 07.05 — Separate Chaining

> **Phase 07 — Hashing**  
> **Focus:** collision resolution through bucket-local chains

## 1. Concept Definition

**Separate chaining** is a hash-table collision-resolution strategy in which each bucket stores a collection of entries that hash to that bucket. Multiple keys may therefore occupy the same bucket without requiring the table to find another empty slot.

A conceptual table looks like:

```text
bucket 0 → [A → D]
bucket 1 → [B]
bucket 2 → []
bucket 3 → [C → E → F]
```

The hash function chooses the bucket. The chain then resolves collisions by searching only the entries stored in that bucket.

---

## 2. Why Separate Chaining Exists

A hash function maps a potentially huge key space into a finite number of buckets. Collisions are mathematically unavoidable when the number of possible keys exceeds the number of buckets.

Chaining separates two responsibilities:

1. **Hashing:** identify the likely bucket.
2. **Bucket structure:** resolve collisions among keys assigned to that bucket.

Unlike open addressing, a chained table does not require every entry to live inside the primary bucket array.

---

## 3. Mental Model

Think of the table as a set of drawers:

```text
hash(key) → drawer
                 ↓
             bucket chain
                 ↓
        compare actual keys
```

The hash is a routing hint, **not proof of equality**. Two different keys can have the same hash and must still be compared using the table's equality rule.

---

## 4. Mathematical Model

Let:

- `N` = number of stored entries
- `M` = number of buckets
- `α = N / M` = load factor
- `L_i` = length of bucket `i`

Then:

```text
Σ L_i = N
average chain length = N / M = α
```

Under a simple uniform-hashing assumption, entries are distributed approximately evenly across buckets. Expected lookup work is therefore proportional to `1 + α` rather than directly to `N`.

Typical expected bounds:

- successful lookup: `O(1 + α)`
- unsuccessful lookup: `O(1 + α)`
- insertion: `O(1 + α)` if duplicate detection is required
- deletion: `O(1 + α)`
- iteration: `O(N + M)` when traversing all buckets

Worst case, every key lands in one bucket:

```text
bucket 0 → N entries
bucket 1 → []
bucket 2 → []
...
```

Then lookup, insertion with duplicate checking, and deletion can become `O(N)`.

---

## 5. Memory Model

A conventional chained table contains:

```text
Table
├── bucket array of size M
└── N entry records
    ├── key
    ├── value
    └── next/reference or bucket-container metadata
```

Space is generally `O(M + N)`.

Compared with open addressing, chaining may have greater per-entry allocation/reference overhead, but it avoids probe sequences and keeps collision handling local to a bucket.

In JavaScript, object allocation and pointer/reference chasing can affect real performance even when asymptotic complexity is unchanged.

---

## 6. Core Operations

### 6.1 Insert

1. Hash the key.
2. Convert the hash to a bucket index.
3. Search the bucket for an equal key.
4. Update the existing entry or create a new entry according to the table semantics.

### 6.2 Get

1. Compute the bucket.
2. Traverse only that bucket.
3. Compare keys.
4. Return the matching value or an absent result.

### 6.3 Has

Same routing and search process as `get`, but only the existence result matters.

### 6.4 Update

Locate the key and replace its value while preserving the table's structural invariants.

### 6.5 Delete

Find the entry and unlink/remove it from its bucket. Deletion is simpler conceptually than open addressing because no tombstone is required to preserve a probe sequence.

### 6.6 Iterate

Visit each bucket and every entry inside that bucket. Ordering is an API/design decision, not a fundamental property of hashing.

---

## 7. Chain Representation Variants

### 7.1 Linked-list chains

```text
bucket → node → node → node
```

**Advantages:** simple insertion/removal and no need for contiguous bucket storage.

**Costs:** allocation overhead and poorer cache locality.

### 7.2 Dynamic-array buckets

```text
bucket → [entry, entry, entry]
```

**Advantages:** compact storage and often better locality.

**Costs:** insertion/deletion may require shifting elements unless carefully engineered.

### 7.3 Treeified/hybrid buckets

A bucket that becomes unusually large can be represented by a balanced search structure. This can improve worst-case lookup behavior, at the cost of more complex implementation and memory overhead.

The important engineering principle is that **the bucket representation can change without changing the outer hash-table model**.

---

## 8. Correctness Invariants

A production-quality chained table should preserve at least these invariants:

1. Every stored entry belongs to exactly one bucket.
2. Each entry is located in the bucket determined by the table's current hash/index rules.
3. Equal keys cannot accidentally coexist when the API defines unique keys.
4. Deleting an entry cannot disconnect unrelated entries.
5. Resizing reassigns every existing entry using the new bucket count.
6. `get(k)` and `has(k)` agree on whether `k` exists.
7. `size` equals the number of stored entries.
8. Bucket and chain metadata remain internally consistent.

A useful validation technique is to iterate every bucket, recompute each entry's expected bucket, and compare the observed count with `size`.

---

## 9. Head vs Tail Insertion

For a linked chain, inserting at the head is usually `O(1)`:

```text
before: A → B → C
insert X

after:  X → A → B → C
```

Appending at the tail is `O(1)` only if the chain maintains a tail pointer; otherwise it can require `O(L)` traversal.

This becomes an API question when iteration order matters. A hash table should explicitly define whether insertion order is meaningful or incidental.

---

## 10. Load Factor and Chain Distribution

The average chain length is `α = N/M`, but averages do not tell the whole story.

Measure:

- number of empty buckets
- number of non-empty buckets
- average non-empty chain length
- maximum chain length
- collision count
- bucket occupancy histogram
- variance of bucket occupancy

Two tables can have the same load factor but radically different distributions:

```text
Healthy-ish:
2 1 0 3 1 2 1 2

Pathological:
0 0 0 0 0 10 0 0
```

Distribution quality therefore matters independently of the average load factor.

---

## 11. Resizing and Rehashing

Suppose a table grows from `M` buckets to `M'` buckets. Existing entries generally cannot simply remain in their old buckets because the bucket index usually depends on the new bucket count.

For every entry:

```text
old key
  ↓
recompute bucket using new M'
  ↓
insert into new bucket
```

A resize therefore costs `O(N)` for the rehash operation.

With geometric resizing, that cost can be amortized across many inserts, giving expected amortized `O(1)` insertion when other assumptions hold.

---

## 12. Collision Attacks and Hardening

If an attacker can intentionally construct many keys that map to the same bucket, a chained table can degrade toward linear lookup.

For untrusted keys, consider:

- stronger/keyed hash functions where appropriate
- randomized hashing strategies
- conservative load-factor limits
- maximum-chain monitoring
- request/input limits
- rate limiting
- defensive benchmarking against adversarial distributions

A cryptographic hash is **not automatically required** for every hash table. Choose the hash according to the threat model and performance requirements.

---

## 13. JavaScript Implementation Lab

Build a custom chained hash table without using `Map` or `Set` internally.

Recommended internal model:

```js
{
  buckets: Array(bucketCount),
  size: 0,
  bucketCount
}
```

Each bucket may contain linked entries such as:

```js
{
  key,
  value,
  next
}
```

Implement hashing, bucket selection, equality checking, insertion, lookup, deletion, iteration, resizing, and invariant validation.

Keep the following concerns separate:

```text
key → hash code → bucket index → chain search → key equality
```

Do not confuse a hash collision with key equality.

---

## 14. Backend Engineering Applications

Separate chaining appears naturally in systems that maintain key-to-state relationships:

### Caches

Map cache keys to values while handling collisions internally.

### Session and authentication state

Map session identifiers to server-side session records.

### Idempotency

Map idempotency keys to previously processed request results.

### Rate limiting

Map client identifiers to counters, windows, or token-bucket state.

### Routing/configuration

Map tenant, branch, service, or resource identifiers to configuration/state.

The production question is not simply "is lookup O(1)?". Also consider key size, hashing cost, distribution, memory overhead, concurrency, eviction, persistence, and adversarial inputs.

---

## 15. AI Engineering Applications

Hash-based exact lookup is useful throughout AI infrastructure:

- exact embedding/result caches keyed by canonical request IDs
- candidate deduplication
- visited-state tracking during search
- memoization of deterministic subproblems
- feature/state lookup
- token or vocabulary metadata maps
- retrieval-result deduplication
- agent task/state registries

For AI workloads, distinguish **exact hashing** from approximate/probabilistic structures such as Bloom filters and Count-Min Sketches, which are covered later in this phase.

---

## 16. Problem-Solving Patterns

Recognize separate chaining when a problem says or implies:

- many keys map to a finite set of buckets
- collisions must be handled explicitly
- expected constant-time dictionary operations are desired
- duplicate detection is needed
- you need a custom hash table
- you need to reason about bucket occupancy

Common reasoning sequence:

```text
Key
 ↓
Hash
 ↓
Bucket
 ↓
Collision?
 ├── no → direct entry
 └── yes → search chain
```

---

## 17. Interview Preparation

### Core questions

1. What is separate chaining?
2. Why are collisions unavoidable?
3. What is the difference between a hash collision and equal keys?
4. What is the expected lookup complexity under uniform hashing?
5. What is the worst-case complexity?
6. How does load factor affect chain length?
7. Why is deletion easier in chaining than in open addressing?
8. Why must entries be rehashed after resizing?
9. Compare linked-list buckets with array buckets.
10. When might treeified buckets be useful?

### Senior-level questions

- How would you detect a pathological distribution?
- How would you harden a table against adversarial collisions?
- What metrics would you expose in production?
- How does cache locality influence the choice of bucket representation?
- How would you choose a load-factor threshold?
- How would you benchmark chaining fairly against open addressing?

---

## 18. Implementation Lab

Build a production-oriented chained hash table in stages:

### Stage 1 — Correctness

- fixed bucket count
- insert/get/has/delete
- key equality
- size tracking

### Stage 2 — Measurement

- chain lengths
- occupancy histogram
- collision count
- maximum chain length

### Stage 3 — Resizing

- configurable thresholds
- geometric growth
- rehashing
- invariant validation

### Stage 4 — Engineering

- alternate bucket representations
- deterministic iteration policy
- benchmark workloads
- adversarial distributions
- memory/performance comparison

---

## 19. Practice Problems

The companion exercise file contains unsolved tasks covering:

- table creation
- CRUD operations
- chain manipulation
- collision metrics
- occupancy analysis
- expected search comparisons
- resizing and rehashing
- invariant validation
- insertion-order behavior
- linked-chain vs array-bucket trade-offs
- long-chain detection
- benchmarking
- production design

**Rule:** derive the bucket model and invariants before writing code.

---

## 20. Revision Checklist

- [ ] I can explain separate chaining from first principles.
- [ ] I can derive `α = N/M`.
- [ ] I understand expected `O(1 + α)` lookup reasoning.
- [ ] I can explain the `O(N)` worst case.
- [ ] I can implement a chained table without `Map`/`Set`.
- [ ] I can correctly delete from a chain.
- [ ] I can resize and rehash every entry.
- [ ] I can measure chain distribution rather than relying only on average load factor.
- [ ] I can compare linked-list and array buckets.
- [ ] I can explain collision attacks and practical defenses.
- [ ] I can connect chaining to backend caches, idempotency, rate limiting, and AI exact lookup.
- [ ] I can defend the design in an interview.

## Key Takeaways

1. A hash chooses a bucket; it does not prove key equality.
2. Separate chaining stores collisions inside bucket-local collections.
3. Expected lookup depends on distribution and load factor, not merely the phrase "hash table".
4. Worst-case chaining can degrade to `O(N)`.
5. Resizing requires rehashing because bucket assignment changes.
6. Real performance depends on allocation, cache locality, key hashing cost, and distribution quality.
7. Chaining is a foundational collision-resolution strategy for both algorithmic problems and production systems.
