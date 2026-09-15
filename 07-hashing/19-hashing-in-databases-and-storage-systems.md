# 07.19 — Hashing in Databases & Storage Systems

## 1. Concept Definition

Hashing appears throughout database and storage systems for equality lookup, partitioning, indexing, deduplication, checksums, caching, and data placement.

The important engineering distinction is:

```text
hash function
    ≠
hash index
    ≠
partition hash
    ≠
cryptographic digest
    ≠
checksum
```

Each serves a different purpose and has different correctness requirements.

## 2. Why It Exists

Storage systems operate on datasets far larger than memory. Scanning every record for every equality lookup is expensive.

Hash-based organization can reduce the amount of data examined:

```text
query key
   ↓
hash / index
   ↓
candidate location
   ↓
exact verification
```

The hash is commonly a routing or candidate-generation mechanism; equality semantics still need to be preserved.

## 3. Hash Index Mental Model

A hash index conceptually maps a search key to a bucket:

```text
key
 ↓
H(key)
 ↓
bucket
 ↓
record pointer(s)
```

Collisions mean multiple keys can map to the same bucket.

Therefore a lookup must distinguish:

```text
same bucket
     ≠
same key
```

## 4. Equality Lookup

Hash-oriented indexes are naturally suited to equality predicates:

```sql
WHERE user_id = 42
```

They are not inherently designed for ordered traversal such as:

```sql
WHERE user_id BETWEEN 100 AND 200
ORDER BY user_id
```

Ordered index structures have different strengths.

Index selection is a workload decision, not a rule that hashing is universally faster.

## 5. Hash Buckets

A storage hash table divides entries among buckets.

The effective lookup cost depends on:

- bucket distribution;
- collision handling;
- load factor;
- bucket representation;
- disk/page layout;
- cache behavior;
- resizing strategy.

A theoretically good hash can still perform poorly if the storage layout causes excessive I/O.

## 6. Disk and Page Locality

Database systems work with pages/blocks rather than treating storage as an infinite array of RAM cells.

A hash lookup may require:

```text
hash computation
     ↓
bucket/page identification
     ↓
page read
     ↓
record verification
```

Thus algorithmic `O(1)` does not mean one CPU operation or one fixed-latency disk access.

## 7. Static vs Dynamic Hashing

Static hashing uses a fixed bucket organization.

Dynamic hashing adapts as data grows.

Two classic families are:

- extendible hashing;
- linear hashing.

They address growth without rebuilding the entire structure in the same way as a simple fixed hash table.

## 8. Extendible Hashing

Extendible hashing maintains a directory of bucket references and uses hash-prefix bits.

Conceptually:

```text
hash bits
   ↓
directory prefix
   ↓
bucket
```

When a bucket overflows, the system can split it and increase directory depth when necessary.

The directory may contain multiple references to the same bucket before a split.

## 9. Linear Hashing

Linear hashing expands buckets incrementally rather than requiring a full directory doubling operation.

A split pointer advances through buckets:

```text
bucket split → next bucket → next bucket → ...
```

This supports gradual growth and can reduce large resize pauses.

## 10. Dynamic Hashing Trade-Offs

Dynamic hashing trades structural complexity for incremental growth.

Important dimensions include:

```text
growth rate
split frequency
bucket occupancy
lookup cost
metadata overhead
I/O behavior
concurrency
recovery
```

The best structure depends on the storage workload and implementation environment.

## 11. Hash Index vs B-Tree

| Property | Hash-Oriented Index | B-Tree Family |
|---|---|---|
| Equality lookup | Strong fit | Strong fit |
| Range lookup | Poor fit | Strong fit |
| Ordered scan | Poor fit | Strong fit |
| Prefix/range ordering | Poor fit | Often useful |
| Distribution | Hash-dependent | Tree-dependent |
| Growth | Hashing strategy dependent | Tree balancing |

This comparison describes workload characteristics rather than a universal winner.

## 12. Hash Partitioning

Distributed databases may use:

```text
partition = H(partitionKey) mod N
```

or another partition function.

The partition key should be selected based on:

- cardinality;
- access patterns;
- skew;
- tenant boundaries;
- locality;
- rebalancing requirements.

Hashing can spread evenly distributed keys but cannot magically fix a single hot key.

## 13. Hash Partitioning and Rebalancing

Changing the partition count under simple modulo hashing can move many records.

Alternatives such as consistent hashing or range-based partitioning have different movement and locality properties.

A production system must separate:

```text
placement decision
        ↓
rebalancing protocol
        ↓
data migration
        ↓
consistency/recovery
```

## 14. Composite Keys

A database may logically identify data using multiple fields:

```text
tenantId + userId
```

A hash key must encode components unambiguously.

Bad:

```text
concat("ab", "c")
concat("a", "bc")
```

Both can produce the same string.

Prefer a canonical, length-delimited, typed, or otherwise unambiguous representation.

## 15. Hashing and Uniqueness

A digest is not automatically a uniqueness constraint.

Even a strong hash has a finite output space.

For correctness-critical uniqueness:

```text
logical key
   ↓
unique database constraint
```

is the authoritative invariant.

A hash can be used as an auxiliary fingerprint or lookup accelerator.

## 16. Content-Addressed Storage

Content-addressed systems identify objects using a digest of their content:

```text
content
   ↓
digest
   ↓
object identity
```

This supports deduplication and immutable object addressing.

A production implementation must define the digest algorithm, canonical content representation, collision policy, and migration strategy if the algorithm changes.

## 17. Deduplication

Storage deduplication can compare content fingerprints before storing another copy:

```text
new object
    ↓
fingerprint
    ↓
existing fingerprint?
    ↓ yes
candidate duplicate
```

For correctness, systems may verify content after a fingerprint match when the consequences of a collision are unacceptable.

## 18. Checksums vs Cryptographic Hashes

A checksum is commonly optimized for accidental corruption detection.

A cryptographic digest additionally provides security properties against adversarial manipulation under its security assumptions.

Do not choose a primitive solely because it is called a “hash.”

The requirement determines the primitive.

## 19. Page / Block Checksums

Storage systems can attach checksums to pages:

```text
page data → checksum
```

On read:

```text
page data
   ↓
recompute checksum
   ↓
compare stored value
```

A mismatch indicates possible corruption, but recovery depends on replication, backups, parity, or another recovery mechanism.

## 20. Merkle Trees

A Merkle tree uses hashes hierarchically:

```text
        root hash
        /       \
    hash        hash
   /   \       /   \
 data data   data data
```

A parent hash summarizes child hashes.

Changing one leaf changes hashes along its path toward the root.

This supports efficient integrity comparison and proof structures.

## 21. Storage Replication Verification

Hash summaries can help compare replicas:

```text
replica A → subtree hash
replica B → subtree hash
```

If hashes differ, the corresponding region requires deeper inspection.

This can reduce the amount of data that must be compared directly.

## 22. Merkle Trees and Distributed Systems

Merkle structures are useful for:

- replica synchronization;
- anti-entropy;
- integrity verification;
- content-addressed systems;
- authenticated data structures.

The exact guarantees depend on the digest and protocol used.

## 23. Bloom Filters in Storage

Storage engines may use Bloom filters to avoid unnecessary reads:

```text
lookup key
   ↓
Bloom filter
   ↓
definitely absent → skip table/file
possibly present → inspect index/data
```

This is particularly useful in read-heavy storage formats where false positives cost extra reads but false negatives would break correctness.

## 24. LSM-Tree Ecosystem

Log-structured storage systems commonly maintain multiple immutable structures over time.

A read may check multiple levels/files.

A Bloom filter can quickly determine whether a key could be present in each component:

```text
SSTable A → Bloom
SSTable B → Bloom
SSTable C → Bloom
```

This can substantially reduce unnecessary disk reads.

## 25. Hashing and LSM Compaction

Compaction rewrites storage structures and changes physical placement.

Hash-based metadata can help identify content or route lookups, but compaction still requires careful handling of:

- tombstones;
- versions;
- ordering;
- atomic publication;
- checksums;
- crash recovery.

Hashing does not replace storage-engine correctness protocols.

## 26. Write-Ahead Logging

WAL primarily provides durability/recovery through ordered log records.

Hashes may be used for:

- record/page integrity;
- log verification;
- deduplication metadata;
- content fingerprints.

Do not confuse a hash with the ordering/durability guarantee supplied by the log protocol.

## 27. Hash Tables in Buffer/Metadata Caches

Database engines often maintain in-memory lookup structures for pages, transactions, metadata, or prepared statements.

The same hash-table principles apply:

```text
key → bucket → metadata
```

But cache eviction, synchronization, memory pressure, and lifecycle management become part of the design.

## 28. Hashing and Transactions

A hash lookup can locate a record quickly, but transactional correctness depends on additional mechanisms:

- locking;
- MVCC;
- isolation levels;
- write ordering;
- constraints;
- recovery.

Hashing is a data-access technique, not a transaction-isolation mechanism.

## 29. Concurrency

Concurrent hash-based storage requires coordination around:

- bucket splits;
- updates;
- page ownership;
- metadata changes;
- index publication;
- crash recovery.

Possible techniques include latches, locks, optimistic validation, atomic operations, and copy-on-write structures depending on the engine.

## 30. Crash Recovery

Structural changes must survive crashes consistently.

A dynamic hash index may need to ensure:

```text
metadata update
bucket split
record movement
publication
```

are recoverable according to the storage engine's durability protocol.

An in-memory algorithm that is correct before a crash is not automatically a correct database index.

## 31. Hashing and Query Planning

A database optimizer considers estimated cost, selectivity, available indexes, and query shape.

The existence of a hash index does not imply it will be selected for every equality query.

Actual plan selection depends on the optimizer and current statistics.

## 32. Selectivity and Distribution

Hash indexes assume useful distribution across buckets.

Highly skewed values can produce uneven access patterns.

A workload analysis should examine:

```text
frequency distribution
cardinality
null behavior
hot values
correlation with other predicates
```

## 33. Null and Special-Value Semantics

Database hashing must follow database equality semantics.

Questions include:

- How are `NULL` values treated?
- Are collations involved?
- Are strings normalized?
- How are composite values encoded?
- Are types preserved?

Application-level hashing that ignores database equality semantics can produce incorrect identity assumptions.

## 34. Hashing and Collations

For textual data, database equality can depend on collation and locale rules.

A byte-level digest of two strings may differ even when a particular database collation treats them as equal.

Therefore:

```text
binary identity
    ≠
database equality identity
```

unless the representation and collation semantics explicitly make them equivalent.

## 35. Security Considerations

Storage systems exposed to untrusted keys should consider:

- collision attacks;
- hash-flooding/resource exhaustion;
- oversized keys;
- malicious partition keys;
- predictable routing;
- digest downgrade/version problems.

Security-sensitive digest selection and secret-keyed hashing may be appropriate in some architectures.

## 36. Backend Engineering Applications

For a Node.js backend using PostgreSQL/Redis/object storage, hashing can support:

```text
request identity
cache keys
partition routing
content fingerprints
deduplication
ETags
Bloom-filter screening
```

But the source of truth should remain explicit:

```text
Map/Set → process-local state
Redis   → shared ephemeral state
DB      → durable transactional state
object storage → durable content
```

## 37. AI / ML Storage Applications

Hashing is useful for:

- dataset deduplication;
- document/chunk fingerprints;
- feature-cache keys;
- model artifact identity;
- content-addressed datasets;
- embedding-cache keys;
- approximate retrieval metadata.

For semantic similarity, exact content hashing is not sufficient; vector similarity structures solve a different problem.

## 38. Complexity

For a hash-oriented in-memory lookup:

```text
expected lookup → O(1)
```

For disk-backed storage, end-to-end cost depends on:

```text
hashing
index traversal
page/cache hits
I/O
concurrency
serialization
verification
```

Dynamic hashing adds split/resize costs that must be analyzed over the workload.

## 39. Correctness Invariants

A production hash-based storage structure should preserve:

1. equal keys resolve according to database equality semantics;
2. collisions never imply equality;
3. every live record remains reachable;
4. bucket/page metadata remains consistent;
5. uniqueness constraints remain authoritative;
6. index changes are recoverable after crashes;
7. partition ownership is deterministic under a given configuration;
8. checksums/digests are interpreted according to their intended guarantees.

## 40. Common Mistakes

1. Assuming hash indexes are universally faster than B-trees.
2. Confusing hash collisions with duplicate records.
3. Using a digest as a database uniqueness guarantee.
4. Ignoring page/I/O costs.
5. Ignoring dynamic growth.
6. Forgetting database collation/equality semantics.
7. Treating Bloom filters as authoritative storage state.
8. Confusing checksum and cryptographic security properties.
9. Ignoring crash recovery.
10. Assuming hashing solves hot partitions.
11. Ignoring skew.
12. Treating transaction correctness as a hashing property.

## 41. Edge Cases & Failure Modes

Test:

- empty table;
- one bucket;
- high collision workload;
- highly skewed keys;
- bucket overflow;
- dynamic split;
- concurrent split/update;
- crash during split;
- duplicate unique key;
- `NULL`/special values;
- collation differences;
- corrupted page checksum;
- incompatible digest version;
- partition-count changes.

## 42. Benchmarking Lab

Compare:

```text
hash lookup
B-tree lookup
full scan
```

under realistic workloads.

Measure:

- equality lookup latency;
- range-query behavior;
- cache hit ratio;
- page reads;
- bucket occupancy;
- collision rate;
- skew;
- insert/update cost;
- split/compaction cost.

## 43. Interview Preparation

Be able to explain:

1. How a hash index works.
2. Hash index vs B-tree.
3. Static vs dynamic hashing.
4. Extendible hashing.
5. Linear hashing.
6. Hash partitioning.
7. Why changing modulo partition count causes movement.
8. Content-addressed storage.
9. Checksums vs cryptographic digests.
10. Merkle trees.
11. Bloom filters in storage engines.
12. Hashing and LSM trees.
13. Hashing vs transactions/concurrency.
14. Database equality/collation semantics.
15. Crash recovery requirements.

## 44. Revision Checklist

- [ ] I can explain a hash index.
- [ ] I can compare hash indexes and B-trees by workload.
- [ ] I understand static and dynamic hashing.
- [ ] I can explain extendible hashing.
- [ ] I can explain linear hashing.
- [ ] I understand hash partitioning.
- [ ] I can reason about skew and hot partitions.
- [ ] I understand content-addressed storage.
- [ ] I can distinguish checksum from cryptographic digest.
- [ ] I can explain Merkle-tree usage.
- [ ] I understand Bloom filters in storage systems.
- [ ] I understand hashing around LSM storage.
- [ ] I can reason about concurrency and crash recovery.
- [ ] I understand database equality/collation implications.

## 45. Key Takeaways

1. **Hashing is a placement/candidate-generation technique; it is not synonymous with a database index.**
2. **Hash indexes are naturally suited to equality access, while ordered indexes support range and ordering workloads.**
3. **Dynamic hashing techniques manage growth incrementally but introduce structural and recovery complexity.**
4. **A hash collision never means two database keys are equal.**
5. **A digest is not a substitute for a durable uniqueness constraint when exact uniqueness is required.**
6. **Disk/page locality, cache behavior, and I/O dominate many storage-system costs beyond hash computation.**
7. **Bloom filters can reduce unnecessary storage reads but must not become the authoritative source of truth.**
8. **Merkle trees use hashes hierarchically for efficient integrity comparison and synchronization.**
9. **Database equality, collation, null semantics, concurrency, and crash recovery must be included in production reasoning.**
10. **The correct hashing design follows the storage workload, correctness contract, and operational constraints—not the hash function alone.**
