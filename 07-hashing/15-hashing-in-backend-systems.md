# 07.15 — Hashing in Backend Systems

## 1. Concept Definition

Hashing is a foundational backend engineering technique for turning application identities into efficiently searchable, partitionable, cacheable, and deduplicatable state.

Common backend uses include:

- hash tables and indexes;
- caches;
- idempotency keys;
- request deduplication;
- session lookup;
- authorization lookup;
- routing and partitioning;
- content fingerprints;
- rate-limit buckets;
- distributed coordination;
- sharding.

The key distinction is that **algorithmic hashing**, **data-integrity hashing**, and **cryptographic hashing** solve different problems.

## 2. Why It Exists

Backend systems repeatedly ask questions such as:

```text
Have I seen this request?
Where should this key be stored?
Can I retrieve this value quickly?
Which worker should process this item?
Is this content unchanged?
Can I reject this duplicate operation?
```

Hashing converts these questions into efficient keyed operations.

## 3. Backend Mental Model

A useful pipeline is:

```text
business identity
      ↓
canonical representation
      ↓
hash / digest / partition key
      ↓
index, cache, shard, or coordination state
      ↓
lookup / route / validate / deduplicate
```

The most important design step is usually defining the identity and consistency contract before selecting the hash algorithm.

## 4. Hash Table Lookup

An in-process Node.js service commonly uses `Map` or `Set` for local keyed state.

Expected operations are approximately `O(1)` under normal hash-table assumptions.

Examples:

```text
userId → user metadata
requestId → request state
sessionId → session state
featureKey → configuration
```

The process-local scope matters: a Map in one Node.js process is not automatically shared with another process.

## 5. Request Deduplication

Suppose a service receives repeated requests:

```text
requestId = abc123
```

A Set/Map can record processed identities.

But production systems must define:

- how the request ID is generated;
- how long it remains valid;
- whether state survives restart;
- whether multiple instances share the state;
- what happens during concurrent requests;
- whether different payloads may reuse the same ID.

Hashing provides lookup; it does not by itself provide idempotency correctness.

## 6. Idempotency Keys

For a non-idempotent operation such as creating a payment/order, an idempotency registry can conceptually store:

```text
key → PROCESSING / COMPLETED / FAILED / EXPIRED
```

The critical property is atomic coordination.

Two simultaneous requests with the same key must not both pass an existence check before either inserts state.

Therefore a distributed implementation generally needs an atomic conditional-write mechanism or transactionally enforced uniqueness.

## 7. Database Uniqueness

A database unique constraint can provide a stronger correctness boundary than an application-only Set.

Conceptually:

```text
INSERT unique key
        ↓
constraint enforces uniqueness
```

The application can then interpret duplicate-key failure as an already-seen identity.

This is often preferable when the deduplication invariant must survive process crashes and multiple service instances.

## 8. Hash Indexes vs Database Indexes

Databases use indexes to avoid scanning every row.

A hash-oriented index is useful for equality lookups:

```text
WHERE user_id = ?
```

B-tree-style indexes are more broadly useful for ordered/range queries.

The choice depends on the workload:

```text
equality-heavy → hash-oriented structure can fit
range/order     → ordered index structures are usually required
```

Do not assume “hash” automatically means faster for every query.

## 9. Cache Keys

Backend caches often use deterministic keys:

```text
user:42:profile:v3
```

A robust cache key should encode every input that can change the result.

Typical components include:

- tenant ID;
- resource ID;
- query parameters;
- locale;
- permissions/context;
- algorithm version;
- schema version;
- model version.

An incomplete key is a correctness defect because unrelated requests can share cached results.

## 10. Hashing and Serialization

A structured request can be converted to a canonical representation before hashing.

Bad pattern:

```text
concatenate arbitrary fields without boundaries
```

Better:

```text
version + length-delimited / canonical fields
```

JSON serialization is not automatically a canonical serialization for every domain because property ordering, omitted fields, numeric representation, and normalization semantics may matter.

## 11. Content Fingerprinting

Services may fingerprint content to detect duplicates:

```text
content → digest → lookup
```

For security-sensitive integrity checks, use an appropriate cryptographic digest.

For internal non-adversarial candidate filtering, a faster algorithmic fingerprint may be sufficient if collisions are safely handled.

## 12. Passwords Are Different

Passwords should not be treated like ordinary cache or lookup keys.

A password-storage design requires a password-hashing/KDF scheme appropriate to credential security, with salts and parameters selected for the security requirements.

A general-purpose fast hash designed for hash tables is not an appropriate password-storage primitive.

The distinction is fundamental:

```text
fast lookup hash → performance
password KDF      → resistance to offline guessing
```

## 13. Hashing and Rate Limiting

Rate limiters frequently need keyed state:

```text
identity → counter/window state
```

Identity may be:

- user ID;
- API key;
- tenant;
- endpoint + identity;
- network address.

A hash map can provide local keyed state, while distributed rate limiting may require a shared store.

The hash structure is only one part; clock semantics, atomicity, expiration, and distributed consistency are equally important.

## 14. Authorization Lookups

Authorization systems repeatedly map identities to permissions:

```text
subject → roles/permissions
```

A Map/Set can make membership checks efficient.

For example:

```text
permissions.has("invoice:read")
```

For production authorization, however, identity scope, tenant isolation, revocation, freshness, and cache invalidation must be defined explicitly.

## 15. Tenant-Aware Hashing

Multi-tenant applications must avoid accidental cross-tenant key collisions.

Instead of:

```text
user:42
```

an application may require a scoped identity:

```text
tenantA:user:42
tenantB:user:42
```

The tenant boundary must be part of the logical identity wherever IDs are only unique within a tenant.

## 16. Distributed Hashing

With multiple workers/services:

```text
key → hash → worker/shard
```

A naive modulo partition:

```text
hash(key) % N
```

has a major operational property: changing `N` can remap a large fraction of keys.

Consistent hashing addresses this problem and is covered in the next phase of this hashing track.

## 17. Partition Keys

A distributed data system needs a partition key that determines placement.

A good partition key should consider:

- cardinality;
- distribution;
- access patterns;
- hot-key risk;
- tenant isolation;
- query locality;
- rebalancing behavior.

A mathematically valid hash can still produce an operationally poor system if the logical key distribution is highly skewed.

## 18. Hot Keys

Suppose one key receives a disproportionate share of traffic:

```text
99% of requests → tenant A
```

Hashing that key does not remove the concentration because identical keys intentionally map to the same logical state.

Possible mitigations include:

- key salting/sharding where semantics permit;
- replication;
- local caching;
- request coalescing;
- workload-aware partitioning.

The correct approach depends on whether the operation requires strict single-key ordering or shared mutable state.

## 19. Webhook Deduplication

Webhook providers may retry deliveries.

A consumer can use a provider event ID as a deduplication key:

```text
eventId → processing state
```

A durable uniqueness boundary is important when duplicate processing could cause side effects.

The complete design must account for:

```text
receive
validate
claim identity
process
record completion
retry/failure
retention
```

## 20. Job Queue Deduplication

A job system may prevent duplicate work with a deterministic job key:

```text
job identity → state
```

For example, a daily aggregation job may use:

```text
aggregation:v2:tenant:42:2026-09-16
```

The key should represent the logical job identity, not merely the generated message ID.

## 21. Hashing in API Design

API systems can use hashes/fingerprints for:

- ETags;
- conditional requests;
- request deduplication;
- cache keys;
- payload fingerprints;
- artifact identity.

An ETag is an HTTP cache-validation mechanism; its exact semantics depend on the server's representation and chosen validator strategy.

## 22. ETags and Representation Identity

A content fingerprint can represent a particular representation version:

```text
representation → validator
```

When a client sends a conditional request, the server can determine whether the representation has changed without transferring the complete representation again.

Do not use a weak application fingerprint as a security guarantee unless the protocol/security requirements explicitly permit it.

## 23. Distributed Cache Considerations

A distributed cache introduces additional dimensions:

```text
network
serialization
expiration
eviction
failure
replication
consistency
```

Hashing may identify the key, but the system still needs to define what happens when the cache is unavailable.

A cache outage should not automatically become a database overload event; fallback behavior and load protection matter.

## 24. Cache Stampede

If a popular key expires:

```text
many requests
    ↓
cache miss
    ↓
all query backend
```

Possible mitigations include:

- single-flight/request coalescing;
- jittered expiration;
- stale-while-revalidate;
- background refresh;
- bounded concurrency.

Each introduces consistency and complexity trade-offs.

## 25. Bloom Filters in Backend Systems

A Bloom filter can answer:

```text
definitely not present
possibly present
```

It is useful when memory is limited and false positives are acceptable.

A Bloom filter cannot normally prove membership because false positives exist.

Backend uses can include:

- avoiding unnecessary database lookups;
- cache penetration protection;
- duplicate candidate filtering;
- existence checks in storage systems.

## 26. Observability

Hash-based backend systems should expose operational metrics such as:

- lookup latency;
- hit/miss rate;
- collision/probe metrics where measurable;
- cache size;
- eviction rate;
- expiration rate;
- duplicate rate;
- hot-key distribution;
- partition load;
- error rate.

For distributed systems, monitor distribution rather than only aggregate averages.

## 27. Security Considerations

Hashing can be abused or attacked through collision-heavy inputs if a system exposes a hash-table workload to untrusted users.

Security-sensitive design should consider:

- adversarial input;
- hash-flooding attacks;
- predictable hash functions;
- resource exhaustion;
- oversized keys;
- tenant isolation;
- secret material handling.

Use security-specific primitives where security is the actual requirement.

## 28. Failure Modes

Important failures include:

```text
incorrect key identity
collision treated as equality
cross-tenant collision
cache stale data
lost idempotency state
process restart
cache outage
hot key
partition skew
memory exhaustion
hash-flooding/resource exhaustion
```

A backend engineer should reason about these explicitly rather than stopping at `O(1)` lookup.

## 29. Correctness Invariants

### Identity

Equivalent business entities map to the same logical identity.

### Isolation

Keys cannot accidentally cross tenant/security boundaries.

### Idempotency

The same logical operation cannot produce unintended duplicate side effects under the defined concurrency/retry model.

### Cache

A returned cached value corresponds to the requested key and freshness/version policy.

### Partitioning

Every key is routed according to the declared partition function.

## 30. Complexity

For local hash-based state:

```text
lookup/insert/delete → expected O(1)
```

But practical backend latency includes:

```text
hash computation
key construction
serialization
memory access
GC
network latency
remote-store latency
contention
```

For distributed systems, asymptotic local lookup complexity does not describe end-to-end request latency.

## 31. Backend Design Framework

When hashing appears in a backend design:

```text
1. Define logical identity.
2. Define canonical representation.
3. Select hash/digest primitive.
4. Define collision/security requirements.
5. Choose local vs durable/shared state.
6. Define TTL/retention.
7. Define concurrency/atomicity.
8. Define partitioning/hot-key behavior.
9. Define failure recovery.
10. Define observability.
11. State correctness invariants.
12. Benchmark realistic workload distribution.
```

## 32. Interview Preparation

Be able to explain:

1. Why hashing is useful in backend systems.
2. Idempotency keys and atomicity.
3. Application Set vs database uniqueness.
4. Cache-key correctness.
5. Local vs distributed cache.
6. Hot keys and skew.
7. Partition keys.
8. Hash modulo vs consistent hashing.
9. Webhook deduplication.
10. Job deduplication.
11. ETags and content identity.
12. Bloom filters.
13. Hash-flooding/resource-exhaustion concerns.
14. Why password hashing is a different problem.
15. Why `O(1)` does not equal constant end-to-end backend latency.

## 33. Revision Checklist

- [ ] I can identify backend use cases for hashing.
- [ ] I can design a correct idempotency key.
- [ ] I understand durable uniqueness vs in-memory deduplication.
- [ ] I can design cache keys.
- [ ] I understand tenant-scoped identities.
- [ ] I can reason about hot keys.
- [ ] I understand partition keys.
- [ ] I can explain modulo partitioning limitations.
- [ ] I understand webhook/job deduplication.
- [ ] I can explain content fingerprints and ETags.
- [ ] I understand Bloom-filter semantics.
- [ ] I can identify security boundaries.
- [ ] I can state backend correctness invariants.
- [ ] I can distinguish algorithmic complexity from end-to-end latency.

## 34. Key Takeaways

1. **Backend hashing starts with business identity, not with the hash function.**
2. **Idempotency requires atomic state transitions; hashing alone cannot provide them.**
3. **Durable uniqueness constraints can provide stronger correctness than process-local Sets.**
4. **Cache keys must encode every result-affecting input and relevant version.**
5. **Tenant scope must be part of identity when IDs are not globally unique.**
6. **Hashing a hot key does not remove hot-key concentration.**
7. **Partitioning requires reasoning about distribution, locality, and rebalancing.**
8. **Algorithmic, cryptographic, and password hashing have different goals.**
9. **Production systems must account for concurrency, failures, memory, observability, and security.**
10. **Expected `O(1)` hash operations describe a local data-structure property, not the whole backend request.**
