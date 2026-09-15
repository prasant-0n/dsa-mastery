# 07.17 — Bloom Filters & Probabilistic Hashing

## 1. Concept Definition

A **Bloom filter** is a space-efficient probabilistic data structure for approximate membership testing.

It answers:

```text
definitely NOT present
possibly present
```

It can produce false positives, but a standard Bloom filter does not produce false negatives when implemented correctly and queried consistently.

## 2. Why It Exists

Exact membership structures such as `Set` or `Map` may require substantial memory when the number of keys is enormous.

A Bloom filter trades exactness for compactness:

```text
less memory
   ↓
small probability of false positive
   ↓
very fast membership screening
```

Typical backend use:

```text
Bloom filter
     ↓
probably exists?
     ↓ yes
expensive database/cache/storage lookup
```

A negative result can safely avoid the expensive lookup.

## 3. Mental Model

A Bloom filter contains:

```text
bit array
[0][1][0][1][0][0][1]...
```

and `k` hash functions or equivalent independent hash-derived positions.

To insert `x`:

```text
h1(x) → bit
h2(x) → bit
...
hk(x) → bit
```

Set all selected bits to `1`.

To query `x`, inspect the same positions.

```text
any selected bit = 0 → definitely absent
all selected bits = 1 → possibly present
```

## 4. Why False Positives Occur

Different inserted items can set overlapping bits.

Example:

```text
A → bits 1, 4, 7
B → bits 2, 4, 9
```

A non-inserted value may map to:

```text
1, 4, 9
```

If all are already set, the filter reports **possibly present** even though the value was never inserted.

This is a probabilistic collision effect.

## 5. Why Standard Bloom Filters Have No False Negatives

An inserted key sets all of its required bits.

A later query checks those same bits.

If no deletion operation clears them, all required bits remain set.

Therefore:

```text
inserted → all required bits = 1 → query says possibly present
```

This invariant depends on using the same hashing and filter state correctly.

## 6. Mathematical Model

Let:

```text
m = number of bits
n = number of inserted elements
k = number of hash functions
```

After inserting `n` items, the approximate probability that a particular bit remains zero is:

```text
(1 - 1/m)^(kn)
```

which is commonly approximated by:

```text
e^(-kn/m)
```

The approximate false-positive probability is:

```text
a = (1 - e^(-kn/m))^k
```

This model assumes suitable hashing behavior.

## 7. Optimal Number of Hash Functions

For a fixed `m` and `n`, the approximate optimal number of hash functions is:

```text
k ≈ (m/n) ln(2)
```

More bits per expected element generally allow a lower false-positive probability.

The implementation should choose `k` based on a declared capacity/error target rather than arbitrarily selecting many hashes.

## 8. Bits Per Element

Define:

```text
b = m / n
```

bits per expected element.

Increasing `b` generally reduces the false-positive rate at the cost of memory.

This is one of the most useful engineering parameters because it connects:

```text
memory budget ↔ error probability
```

## 9. Double Hashing

Computing many completely independent hash functions can be expensive.

A common practical approach derives multiple positions from two base hashes:

```text
hi(x) = h1(x) + i * h2(x)
```

with appropriate modular reduction.

This can approximate the behavior needed for multiple probes while reducing hashing work.

The exact construction must ensure suitable distribution for the workload.

## 10. Bloom Filter Construction

A constructor should define:

```text
capacity n
bits per element or m
number of hashes k
hash strategy
```

Then allocate:

```text
bit array of m bits
```

Important engineering questions:

- What happens when expected capacity is exceeded?
- Is the filter rebuildable?
- Is the error target still valid after overfilling?
- Is the filter serialized?
- Is it shared across processes?

## 11. Capacity Matters

A Bloom filter's false-positive probability depends on occupancy.

If the design expects:

```text
n = 1 million items
```

but actually receives:

```text
n = 20 million
```

the observed false-positive rate can become much higher than the original target.

Therefore capacity is a correctness-of-performance assumption that should be monitored.

## 12. Saturation

As more bits become `1`, the filter becomes saturated.

Eventually:

```text
almost every bit = 1
```

and most queries become:

```text
possibly present
```

The filter then loses its usefulness as a screening layer.

## 13. Standard Bloom Filter Deletion Limitation

A standard Bloom filter cannot safely delete an arbitrary element.

Why?

Suppose:

```text
A → bits 1, 4, 7
B → bits 4, 7, 9
```

If A is removed, clearing bits `4` and `7` would also affect B.

Therefore standard Bloom filters are naturally suited to insertion + membership testing, not arbitrary deletion.

## 14. Counting Bloom Filters

A **counting Bloom filter** replaces bits with small counters.

Insertion increments counters.

Deletion decrements counters.

This enables approximate deletion but introduces:

- more memory;
- counter overflow concerns;
- more implementation complexity.

It does not turn probabilistic membership into exact membership.

## 15. Scalable Bloom Filters

When capacity is not known in advance, a single fixed filter can become saturated.

A scalable design can add additional filters:

```text
filter 1
filter 2
filter 3
...
```

A query checks each relevant filter.

The design must manage cumulative false-positive probability across layers.

## 16. Stable Bloom Filters

A stable Bloom filter is a probabilistic structure designed for a continuously changing stream with approximate aging/forgetting behavior.

It can be useful when the system does not need permanent membership history.

The trade-off is that old entries can eventually disappear, so false negatives become possible relative to the original historical set.

This distinction is essential:

```text
standard Bloom → no deletion, no false negatives
stable Bloom   → approximate aging, possible historical false negatives
```

## 17. Bloom Filters vs Hash Sets

| Property | Bloom Filter | Hash Set |
|---|---|---|
| Membership | Approximate | Exact |
| False positives | Possible | No |
| False negatives | No, standard form | No |
| Arbitrary deletion | Not supported | Supported |
| Memory | Very compact | Higher |
| Stored values | No | Yes |
| Typical role | Screening | Authoritative membership |

A Bloom filter is often a **front door**, not the final source of truth.

## 18. Bloom Filters vs Caches

A cache answers:

```text
What value is associated with this key?
```

A Bloom filter answers:

```text
Could this key exist?
```

They solve different problems and can be composed:

```text
Bloom filter → cache/database
```

## 19. Backend Application: Cache Penetration

Imagine an attacker repeatedly requests IDs that do not exist.

Without protection:

```text
request → cache miss → database miss
```

A Bloom filter containing known existing IDs can reject many impossible requests before the database query.

Because false positives are allowed:

```text
Bloom says absent → reject safely
Bloom says present → continue to authoritative lookup
```

## 20. Backend Application: Storage Systems

Large storage systems can use Bloom filters to avoid unnecessary disk reads.

Conceptually:

```text
query key
   ↓
Bloom filter
   ↓
absent → skip storage lookup
present → inspect index/data
```

This is especially valuable when an unnecessary storage access is expensive.

## 21. Backend Application: Distributed Databases

A database node can maintain probabilistic membership information about keys it may contain.

The filter can reduce unnecessary remote/storage work.

It must never be treated as the authoritative source of truth when false positives exist.

## 22. Backend Application: Event Deduplication

A Bloom filter can act as a memory-efficient first-stage filter:

```text
event ID
   ↓
Bloom filter
   ↓
possibly seen → exact durable store
   ↓
definitely unseen → candidate for processing
```

For correctness-critical deduplication, the exact store remains necessary if false positives would otherwise incorrectly suppress valid events.

## 23. AI Application: Candidate Deduplication

AI pipelines can generate huge candidate sets.

A Bloom filter can cheaply eliminate candidates that are probably already known.

Examples:

- document IDs;
- chunk fingerprints;
- generated candidates;
- retrieval candidates;
- previously processed samples.

For semantic duplicate detection, a Bloom filter is insufficient because it tests exact hash-based identity rather than semantic similarity.

## 24. AI Application: Dataset Processing

Large preprocessing pipelines can use probabilistic membership structures to reduce repeated work:

```text
sample fingerprint
       ↓
Bloom filter
       ↓
probably processed?
       ↓
exact metadata store if required
```

The key is to define whether a false positive causes unacceptable data loss or merely avoids redundant work.

## 25. Probabilistic Guarantees

Probabilistic data structures should specify:

```text
what can be wrong?
how often can it be wrong?
what remains guaranteed?
```

For a standard Bloom filter:

```text
false positive → allowed
false negative → not expected under correct insertion/query semantics
```

This is a much stronger engineering statement than simply saying “it's approximate.”

## 26. Correctness Invariants

A standard Bloom filter should maintain:

1. every inserted item's selected bits are set;
2. query uses the same hash-position scheme;
3. a zero selected bit implies definite absence;
4. an all-one selected set means only possible presence;
5. no bit is cleared by ordinary insertion.

## 27. Complexity

For `k` hash probes:

```text
insert: O(k)
query:  O(k)
space:  O(m) bits
```

If `k` is treated as a configured constant, operations are effectively `O(1)`.

The actual cost includes hash computation and memory access.

## 28. Common Mistakes

1. Treating “possibly present” as “definitely present.”
2. Claiming Bloom filters have zero false positives.
3. Expecting standard Bloom filters to support deletion.
4. Clearing bits during deletion.
5. Ignoring capacity overrun.
6. Using poor hash functions.
7. Forgetting cumulative error in scalable designs.
8. Treating a Bloom filter as authoritative state.
9. Confusing exact identity with semantic similarity.
10. Ignoring serialization/version compatibility.
11. Using an undersized filter for a huge dataset.
12. Ignoring adversarial inputs in exposed systems.

## 29. Edge Cases & Failure Modes

Test:

- empty filter;
- one inserted item;
- repeated insertion;
- capacity boundary;
- over-capacity workload;
- highly correlated hashes;
- saturated filter;
- serialized/deserialized filter;
- incompatible hash configuration;
- counting-filter counter overflow;
- scalable-filter layer growth;
- stable-filter aging.

## 30. Benchmarking

Measure:

- bits per element;
- actual false-positive rate;
- insertion throughput;
- query throughput;
- hash computation cost;
- memory usage;
- cache behavior;
- saturation over time.

Do not rely only on the theoretical false-positive equation. Validate the implementation against representative workloads.

## 31. Production Design Framework

When considering a Bloom filter:

```text
1. What membership question are we answering?
2. Can false positives be tolerated?
3. Can false negatives be tolerated?
4. What is expected n?
5. What false-positive target is acceptable?
6. What memory budget is available?
7. Is deletion required?
8. Is the dataset growing?
9. Is the filter authoritative or only a pre-filter?
10. How is it versioned/serialized?
11. What happens after corruption or saturation?
12. How will actual error rate be measured?
```

## 32. Interview Preparation

Be able to explain:

1. What a Bloom filter is.
2. Why false positives occur.
3. Why standard Bloom filters have no false negatives.
4. The meaning of `m`, `n`, and `k`.
5. The false-positive equation.
6. The approximate optimal `k`.
7. Why standard deletion is unsafe.
8. Counting Bloom filters.
9. Scalable/stable Bloom filters.
10. Bloom filter vs Set.
11. Cache-penetration protection.
12. Storage/database applications.
13. AI candidate/dataset deduplication.
14. Why the filter should usually not be the source of truth.

## 33. Revision Checklist

- [ ] I can explain Bloom-filter membership semantics.
- [ ] I can derive why false positives occur.
- [ ] I can explain the no-false-negative invariant.
- [ ] I understand `m`, `n`, and `k`.
- [ ] I can estimate false-positive probability.
- [ ] I understand optimal hash-count reasoning.
- [ ] I understand why deletion is unsafe.
- [ ] I can explain counting Bloom filters.
- [ ] I understand scalable/stable variants.
- [ ] I can choose between Bloom filter and Set.
- [ ] I can design cache-penetration protection.
- [ ] I can apply Bloom filters to AI pipelines.
- [ ] I can define acceptable error semantics.
- [ ] I can benchmark actual false-positive behavior.

## 34. Key Takeaways

1. **A Bloom filter is an approximate membership structure, not an exact Set.**
2. **Standard Bloom filters allow false positives but preserve no-false-negative membership semantics under correct use.**
3. **Memory, expected item count, hash count, and false-positive probability are mathematically connected.**
4. **Standard Bloom filters do not support arbitrary deletion.**
5. **Counting and scalable variants address different lifecycle requirements with additional trade-offs.**
6. **Bloom filters are most useful as a cheap screening layer before expensive authoritative storage.**
7. **A Bloom filter cannot perform semantic similarity detection.**
8. **Capacity assumptions must be monitored because saturation degrades usefulness.**
9. **Probabilistic systems should explicitly state which errors are possible and which guarantees remain.**
10. **Production correctness comes from combining the filter with an authoritative system when exact state is required.**
