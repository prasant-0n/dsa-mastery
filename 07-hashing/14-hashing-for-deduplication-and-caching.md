# 07.14 — Hashing for Deduplication & Caching

## 1. Concept Definition

Hashing is a natural fit for **deduplication** and **caching** because both problems require fast decisions based on identity.

Deduplication asks:

> Have I already seen an equivalent item?

Caching asks:

> Have I already computed or stored the result for this exact key?

The common model is:

```text
input / record
      ↓
identity or canonicalization
      ↓
hashable key
      ↓
Set / Map
      ↓
fast membership or retrieval
```

## 2. Why It Exists

Without an index, deduplicating `n` records may repeatedly compare each item with previously processed records, leading toward `O(n²)` behavior.

Without a cache, repeated expensive computations are performed again.

Hashing changes the repeated operation into keyed lookup:

```text
deduplication → Set.has(key)
caching       → Map.get(key)
```

Expected lookup is typically `O(1)`, subject to hash-table assumptions.

## 3. Mental Model: Identity First

The hardest part is usually not the Set or Map.

It is defining **what makes two inputs the same**.

Examples:

```text
user.id
order.id
request idempotency key
normalized URL
content fingerprint
serialized query + parameters
```

A wrong identity function produces a wrong system even if the hash table itself is perfect.

## 4. Exact Deduplication

For exact identity:

```text
key = canonicalIdentity(item)
seen = Set()
```

For each item:

```text
if seen.has(key):
    duplicate
else:
    seen.add(key)
```

Expected complexity:

```text
Time:  O(n)
Space: O(u)
```

where `u` is the number of unique keys.

## 5. Record Deduplication

For records:

```js
{ id: 42, email: "a@example.com" }
```

you must choose the identity rule.

Possible policies:

```text
id-based identity
email-based identity
composite identity
full-record identity
```

These are different business definitions.

## 6. Winner Policy

When duplicates occur, define which record survives:

- first occurrence;
- last occurrence;
- highest version;
- newest timestamp;
- highest priority;
- merge all fields;
- reject the batch.

A deduplication algorithm without a deterministic winner policy may produce inconsistent output.

## 7. Canonicalization

Before hashing, equivalent representations may need normalization:

```text
raw value
   ↓
canonical representation
   ↓
key
```

Examples:

- lowercasing an email when the domain policy requires it;
- normalizing URLs according to application rules;
- trimming permitted whitespace;
- normalizing Unicode when the domain explicitly defines that equivalence;
- sorting unordered components in a composite identity.

Never canonicalize blindly. A transformation is correct only if the domain defines the transformed values as equivalent.

## 8. Content Deduplication

For large content, storing the complete content in a Set may be expensive.

Instead, compute a fingerprint:

```text
content → fingerprint
```

Then index the fingerprint.

There is an important distinction:

```text
algorithmic fingerprint → fast candidate identity
cryptographic digest     → stronger collision resistance
```

If a collision could cause data loss, use a suitable cryptographic digest and/or exact verification according to the threat model.

## 9. Hash Collision vs Duplicate

These are not the same:

```text
same key → duplicate
same hash but different key → collision
```

A correct hash table resolves collisions through key equality.

A deduplication system that stores only a weak fingerprint without verification can accidentally treat two different objects as duplicates.

## 10. Cache Fundamentals

A cache maps a key to a previously computed value:

```text
Map<cacheKey, result>
```

Basic flow:

```text
request
  ↓
construct exact cache key
  ↓
cache hit? ── yes → return cached result
  │
  no
  ↓
compute result
  ↓
store result
```

The key must encode every input that affects the result.

## 11. Cache-Key Correctness

Suppose a result depends on:

```text
userId
page
pageSize
sortOrder
filter
```

The key must distinguish every relevant combination.

An incomplete key causes **false cache hits**:

```text
request A
request B
   ↓
incorrectly same key
   ↓
B receives A's result
```

This is a correctness bug, not merely a performance issue.

## 12. Canonical Cache Keys

A structured key should avoid accidental ambiguity.

Prefer a deterministic representation such as:

```text
version|userId|page|pageSize|sort|filter
```

or a canonical structured serialization.

Avoid naive concatenation when values can contain delimiters or have ambiguous representations.

## 13. Cache Hit and Miss

Define:

```text
hit  = valid entry exists for exact key
miss = no valid entry exists
```

Metrics:

```text
hitRate = hits / (hits + misses)
```

A high hit rate is not automatically good. A cache can have high hit rate while returning stale or incorrect data if invalidation is wrong.

## 14. TTL

Time-to-live gives an entry an expiration boundary:

```text
entry = { value, expiresAt }
```

A lookup must determine whether:

```text
now < expiresAt
```

If expired:

```text
miss
```

TTL is a freshness policy, not a memory-management guarantee. Expired entries may still occupy memory until cleanup occurs.

## 15. Eviction

A bounded cache needs an eviction strategy.

Common policies:

- LRU — least recently used;
- LFU — least frequently used;
- FIFO;
- random;
- size/cost-aware policies.

The policy should match workload behavior.

## 16. LRU + Hashing

A classic LRU cache combines:

```text
Map<key, node>
+
doubly linked list
```

The Map provides expected `O(1)` lookup.

The linked list provides expected `O(1)` recency updates and eviction.

This is an important example of multiple data structures cooperating to satisfy an API contract.

## 17. Cache Stampede

If an expensive key expires and many requests arrive simultaneously:

```text
request 1 → miss → compute
request 2 → miss → compute
request 3 → miss → compute
...
```

the backend may perform the same expensive work many times.

A production cache can coordinate in-flight computation:

```text
key → pending promise / computation state
```

This pattern is sometimes called request coalescing or single-flight behavior.

## 18. Negative Caching

A cache may store the result that something does **not** exist:

```text
user lookup → NOT_FOUND
```

This can prevent repeated expensive misses.

Negative entries require their own TTL and invalidation policy because a resource that does not exist now may be created later.

## 19. Cache Invalidation

Caching introduces a second copy of state.

Therefore every cache design must answer:

```text
When does cached data become invalid?
Who invalidates it?
What happens after an update?
Can stale data be served?
```

Common strategies:

- TTL-based expiration;
- explicit invalidation;
- versioned keys;
- write-through;
- write-back;
- cache-aside.

## 20. Cache-Aside Pattern

A common backend pattern:

```text
read
 ↓
cache lookup
 ↓
miss → database
          ↓
       cache result
```

Writes generally update the source of truth and then invalidate or update the cache according to the consistency policy.

The important distinction is:

> The cache is an optimization unless the architecture explicitly makes it part of the authoritative state.

## 21. Local vs Distributed Cache

### Local cache

Lives inside one process:

```text
Node process → Map
```

Advantages:

- very low latency;
- simple;
- no network hop.

Limitations:

- each process has separate state;
- memory is bounded by the process;
- restart loses data unless reconstructed.

### Distributed cache

Shared across application instances.

Advantages:

- shared state;
- centralized capacity;
- cross-instance coordination.

Costs:

- network latency;
- serialization;
- availability concerns;
- distributed consistency.

## 22. Deduplication in Event Processing

A consumer can maintain:

```text
processedEventIds → Set/Map
```

Before processing:

```text
if already processed:
    skip
else:
    process + record identity
```

For durable systems, the identity state should generally live in durable/shared storage when correctness must survive process restarts and multiple consumers.

## 23. Idempotency Keys

For HTTP/API operations:

```text
idempotencyKey → request/result state
```

A useful state model is:

```text
ABSENT
PROCESSING
COMPLETED
FAILED / EXPIRED
```

The important production property is atomicity: two concurrent requests with the same key must not accidentally execute the non-idempotent operation twice.

## 24. Cache Versioning

A version can become part of the key:

```text
v3:user:42:profile
```

Changing the version makes old entries unreachable without requiring immediate deletion.

This is useful for:

- schema changes;
- model version changes;
- algorithm changes;
- configuration changes.

Versioned keys can simplify invalidation but may temporarily increase memory usage.

## 25. Memoization vs Caching

They share the same core structure but differ in scope.

### Memoization

Usually stores deterministic computation results within a computation/runtime context.

### Cache

Usually serves repeated application requests and requires lifecycle policies such as TTL, eviction, invalidation, and observability.

The distinction is architectural rather than purely algorithmic.

## 26. Backend Applications

Hash-based deduplication/caching is useful for:

- API response caching;
- database lookup caching;
- session metadata;
- event deduplication;
- idempotency;
- duplicate imports;
- webhook processing;
- content deduplication;
- request coalescing;
- expensive computation caching.

Production design should include:

```text
identity
TTL
capacity
eviction
invalidation
concurrency
persistence
observability
failure behavior
```

## 27. AI Applications

Caching and deduplication are particularly valuable for expensive AI workloads:

- deterministic embedding generation;
- tokenization results;
- retrieval results;
- prompt preprocessing;
- model metadata;
- repeated document chunks;
- candidate deduplication;
- deterministic tool results.

AI cache keys often need to include model/version/configuration because changing the model can change the result.

Example conceptual key:

```text
modelVersion + preprocessingVersion + inputFingerprint + parameters
```

## 28. Semantic vs Exact Deduplication

Exact hashing answers:

```text
Are these canonical inputs exactly the same?
```

Semantic deduplication asks:

```text
Are these meanings sufficiently similar?
```

The second requires different techniques such as embeddings/vector similarity or domain-specific similarity measures.

Do not use an exact content hash as a semantic similarity algorithm.

## 29. Correctness Invariants

### Deduplication

> No two output records share the same canonical identity key.

### Cache

> A returned cached value corresponds to the exact key and validity policy used to compute/store it.

### TTL

> An expired entry is never treated as a valid hit.

### Versioning

> Entries from incompatible versions cannot satisfy a current-version lookup.

### In-flight coordination

> At most the intended number of computations for a key may be active under the chosen concurrency policy.

## 30. Complexity

For `n` items and `u` unique identities:

```text
Deduplication: expected O(n) time, O(u) auxiliary space
```

For a Map-based cache:

```text
Lookup: expected O(1)
Insert: expected O(1), excluding eviction/resize details
Delete: expected O(1)
```

For LRU:

```text
Map lookup + linked-list update → expected O(1)
Eviction → expected O(1)
```

Always include the cost of canonicalization, hashing, serialization, network access, and output materialization when those dominate the real workload.

## 31. Common Mistakes

1. Using the wrong identity key.
2. Hashing non-canonical representations.
3. Assuming hash equality means exact equality.
4. Ignoring collision risk.
5. Building incomplete cache keys.
6. Forgetting model/configuration versions in AI caches.
7. Treating TTL as guaranteed cleanup.
8. Ignoring memory bounds.
9. Forgetting cache invalidation.
10. Assuming local cache state is shared across Node processes.
11. Ignoring concurrent cache misses.
12. Persisting deduplication state only in memory when restart safety is required.
13. Confusing exact deduplication with semantic similarity.
14. Using a non-cryptographic fingerprint for a security-sensitive requirement.

## 32. Testing Strategy

Test:

- repeated identical items;
- equivalent canonical representations;
- different items with same weak fingerprint;
- first/last winner policies;
- cache hit/miss;
- expiration;
- invalidation;
- eviction;
- concurrent misses;
- stale data;
- process restart;
- multiple application instances;
- version changes;
- serialization changes.

A strong approach compares optimized behavior with a simple reference model.

## 33. Benchmarking

Measure separately:

```text
canonicalization
hash computation
Set/Map operations
serialization
cache lookup
backend/database latency
cache hit ratio
memory usage
GC impact
```

Do not benchmark only raw Map operations and conclude that the complete caching system is `O(1)` in practical latency.

## 34. Problem-Solving Framework

When designing a deduplication or cache solution:

```text
1. Define equivalence/identity.
2. Define canonicalization.
3. Choose Set or Map.
4. Define collision/correctness policy.
5. Define lifecycle.
6. Define capacity and eviction.
7. Define TTL/invalidation.
8. Define concurrency behavior.
9. Define local vs distributed scope.
10. Define persistence requirements.
11. State invariants.
12. Measure hit rate, memory, and latency.
```

## 35. Interview Preparation

Be able to explain:

1. How hashing supports deduplication.
2. How to define a correct identity key.
3. Why canonicalization matters.
4. Hash collision vs duplicate identity.
5. Cache-aside.
6. TTL vs eviction.
7. LRU and why it combines Map + linked list.
8. Cache stampede/request coalescing.
9. Negative caching.
10. Local vs distributed cache.
11. Idempotency keys.
12. Versioned cache keys.
13. Exact vs semantic deduplication.
14. AI caching and model-version-aware keys.

## 36. Revision Checklist

- [ ] I can define exact record identity.
- [ ] I can design canonical keys.
- [ ] I can implement Set-based deduplication.
- [ ] I can design Map-based caches.
- [ ] I understand TTL and eviction.
- [ ] I understand cache invalidation.
- [ ] I can explain LRU architecture.
- [ ] I can reason about cache stampede.
- [ ] I can design idempotency-key state.
- [ ] I understand local vs distributed scope.
- [ ] I can design version-aware AI cache keys.
- [ ] I can distinguish exact from semantic deduplication.
- [ ] I can state cache/deduplication invariants.
- [ ] I can measure real system costs.

## 37. Key Takeaways

1. **Deduplication and caching are identity problems before they are hashing problems.**
2. **Set answers whether an identity was seen; Map associates identity with information.**
3. **Canonicalization determines whether representations should be treated as equivalent.**
4. **Hash collisions must not silently become false deduplication.**
5. **A correct cache key must include every input that can change the result.**
6. **TTL, eviction, and invalidation solve different lifecycle problems.**
7. **Production caches must account for concurrency, memory, process scope, and consistency.**
8. **AI caches must account for model and preprocessing versions.**
9. **Exact hashing cannot replace semantic similarity.**
10. **Measure the whole system, not only the theoretical Map/Set operation.**
