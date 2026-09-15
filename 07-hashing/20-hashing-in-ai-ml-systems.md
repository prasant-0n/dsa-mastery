# 07.20 — Hashing in AI / ML Systems

## 1. Concept Definition

Hashing appears throughout AI/ML systems for identity, caching, deduplication, partitioning, approximate membership, feature processing, and reproducibility.

The central distinction is:

```text
exact identity
    ≠
semantic similarity
    ≠
probabilistic membership
    ≠
cryptographic integrity
```

A hash-based technique is useful only when its guarantees match the AI workload.

## 2. Why It Exists

AI systems repeatedly process large objects:

- documents;
- chunks;
- datasets;
- prompts;
- model artifacts;
- feature records;
- inference requests;
- retrieval candidates.

Repeated work can be expensive. Hashing provides compact deterministic identities that can enable reuse:

```text
input + configuration
        ↓
canonical representation
        ↓
hash/fingerprint
        ↓
cache / dedup / routing
```

## 3. Exact Content Fingerprints

For byte-identical content:

```text
content → digest → identity
```

Useful for:

- dataset deduplication;
- file identity;
- artifact integrity;
- immutable object storage;
- preprocessing caches.

The canonical representation must be defined first.

## 4. Canonicalization

Two logically equivalent objects may have different raw representations.

For example, structured data can differ in:

- field ordering;
- whitespace;
- encoding;
- numeric representation;
- optional fields.

If logical equivalence matters, canonicalization must happen before hashing.

```text
logical object
      ↓
canonical serialization
      ↓
digest
```

## 5. Dataset Deduplication

Large datasets often contain repeated files, records, or chunks.

A fingerprint index can identify exact duplicates:

```text
sample/chunk
    ↓
fingerprint
    ↓
known?
```

For correctness-critical systems, a digest match may be followed by exact content verification if the collision consequences are significant.

## 6. Chunk-Level Deduplication

Hashing whole files detects only whole-object equality.

Chunk-level hashing can identify repeated regions:

```text
large document
   ↓
chunks
   ↓
hash each chunk
   ↓
reuse identical chunks
```

Chunk boundaries matter. Fixed-size chunking and content-defined chunking produce different deduplication behavior.

## 7. Content-Defined Chunking

Content-defined chunking uses content-derived boundaries so small insertions do not necessarily shift every later chunk.

Conceptually:

```text
rolling/content hash
       ↓
boundary condition
       ↓
chunk boundary
```

Each resulting chunk can then receive a stable content digest.

This can improve deduplication across modified large objects.

## 8. Prompt / Inference Caching

AI services often repeat identical or near-identical requests.

An exact request cache can use:

```text
model identity
+ model version
+ prompt
+ system instructions
+ tool/configuration state
+ relevant input data
        ↓
canonical cache key
        ↓
hash
```

The key must include every input that can change the result under the intended cache semantics.

## 9. Cache Correctness

A dangerous cache key omits a result-affecting parameter:

```text
same hash key
    ↓
different effective request
```

Possible consequences include incorrect responses, stale model outputs, or cross-tenant data exposure.

Cache-key design is therefore a correctness and security problem, not merely a performance optimization.

## 10. Model Artifact Identity

Model files and derived artifacts can be content-addressed:

```text
weights/config/tokenizer
          ↓
canonical artifact
          ↓
digest
```

A complete artifact identity may need to include:

- weights;
- configuration;
- tokenizer/version;
- preprocessing metadata;
- dependency/runtime assumptions.

## 11. Reproducible ML Pipelines

A pipeline can identify inputs and transformations:

```text
dataset fingerprint
        +
code/version
        +
configuration
        +
model/base artifact
        ↓
run identity
```

This can help detect whether two runs used equivalent inputs and configurations.

A hash does not prove semantic equivalence of arbitrary software behavior; it only identifies the represented inputs according to the chosen representation.

## 12. Feature Engineering Caches

Feature computation can be expensive.

A feature cache key can incorporate:

```text
entity ID
feature definition version
source snapshot
parameters
```

Hashing the canonical key provides a compact storage/routing identifier.

Versioning is essential because feature definitions change.

## 13. Hashing Categorical Features

A **feature hashing** technique maps potentially large categorical vocabularies into a fixed number of dimensions:

```text
category
   ↓
hash
   ↓
feature bucket
```

This avoids storing a full vocabulary-to-index dictionary for some workflows.

## 14. Feature Hashing Trade-Off

If many categories map to the same bucket:

```text
category A ─┐
            ├→ bucket 42
category B ─┘
```

features collide.

This can introduce representation interference.

The number of buckets is therefore a model/design parameter.

## 15. Signed Feature Hashing

Some feature-hashing variants use a second hash to assign a sign:

```text
bucket = h1(x)
sign   = ±1 from h2(x)
```

Signed accumulation can reduce systematic bias from collisions in certain linear-model settings.

The exact suitability depends on the model and workload.

## 16. Hashing vs Vocabulary Tables

| Property | Feature Hashing | Explicit Vocabulary |
|---|---|---|
| Memory | Fixed dimensionality | Vocabulary-dependent |
| Unknown categories | Naturally mapped | Need OOV policy |
| Collision | Possible | Avoidable with unique IDs |
| Interpretability | Lower | Higher |
| Dynamic vocabulary | Easy | Requires updates |
| Reversible mapping | Not generally | Yes |

The choice depends on model behavior, memory, and interpretability requirements.

## 17. Token / Text Processing

Hash maps and sets are foundational in text processing for:

- token frequencies;
- vocabulary membership;
- duplicate detection;
- n-gram counts;
- document indexing.

Probabilistic structures such as Bloom filters and Count-Min Sketch can reduce memory for large-scale approximate workloads.

## 18. Retrieval Candidate Deduplication

A retrieval system may produce duplicate candidate IDs:

```text
retriever A ─┐
retriever B ─┼→ candidate IDs
retriever C ─┘
```

A `Set` provides exact deduplication.

A Bloom filter can act as a memory-efficient screening layer when the workload tolerates its false-positive behavior.

## 19. Semantic Similarity Is Different

A cryptographic/content hash answers approximately:

```text
Are these representations exactly the same?
```

A vector similarity system asks:

```text
Are these representations semantically close?
```

For example:

```text
"car" vs "automobile"
```

can be semantically similar while their exact content hashes differ.

Do not replace semantic retrieval with exact hashing.

## 20. Approximate Membership in AI Pipelines

Bloom filters can screen large AI processing pipelines:

```text
candidate ID
     ↓
Bloom filter
     ↓
definitely unseen → process
possibly seen → exact check
```

This is useful when exact membership state is too large for a single in-memory structure.

## 21. Approximate Frequency in AI Pipelines

Count-Min Sketch can estimate:

- token frequency;
- document popularity;
- retrieval frequency;
- feature occurrence;
- event frequency.

It provides bounded-memory approximate counts under its configured error model.

## 22. Hashing for Data Sharding

Large AI datasets can be partitioned using a hash of an identity key:

```text
sample/document ID
       ↓
hash
       ↓
worker/shard
```

This can distribute work across workers.

The partition key should avoid systematic skew and should reflect the workload's cost characteristics.

## 23. Distributed Training Data

A deterministic partition function can assign samples to workers:

```text
worker = H(sampleId) mod W
```

This can help maintain stable assignment across repeated processing.

However, distributed training may require additional requirements such as:

- balanced sample counts;
- balanced token counts;
- locality;
- epoch reshuffling;
- fault tolerance.

A simple hash modulo may not satisfy all of them.

## 24. Data Leakage Considerations

Stable hashes can reveal relationships between repeated records.

For example, if the same identifier always produces the same public hash, an observer may correlate appearances across datasets.

Privacy-sensitive systems should consider:

- keyed hashing;
- access control;
- salting where appropriate;
- data minimization;
- threat model.

The correct technique depends on whether the hash needs to be publicly reproducible.

## 25. Cryptographic Hashing in ML Artifacts

Cryptographic digests can support integrity checks:

```text
artifact downloaded
       ↓
compute digest
       ↓
compare expected digest
```

This detects unexpected content changes under the digest's security assumptions.

For authenticity, integrity alone is not sufficient; signatures or authenticated distribution mechanisms may be required.

## 26. Model Cache Namespacing

A robust AI cache should separate tenants and model versions:

```text
tenant
+ model
+ version
+ request configuration
+ input identity
```

Then derive a canonical key.

This prevents unrelated requests from accidentally sharing cache entries.

## 27. Idempotency in AI Jobs

Long-running AI jobs may be retried.

An idempotency key can be derived from stable job inputs:

```text
job specification
      ↓
canonical form
      ↓
hash identity
```

The durable job store must still enforce uniqueness atomically.

The hash is an identity mechanism; it is not itself the transaction protocol.

## 28. Hash-Based Routing for Model Serving

A serving system can route requests by a stable key:

```text
user/session/model key
        ↓
hash
        ↓
serving instance
```

This can provide affinity for stateful caches or session-local state.

For stateless services, conventional load balancing may be more appropriate depending on the workload.

## 29. Hot Keys in AI Systems

A popular prompt, document, or feature can create a hot key:

```text
one key
  ↓
many requests
  ↓
one owner/cache shard overloaded
```

Hashing distributes keys, not necessarily request volume.

Possible mitigations include:

- replicated cache entries;
- request coalescing;
- local caching;
- controlled key splitting.

## 30. Hashing and Vector Systems

Vector databases use hashes for metadata, IDs, caches, routing, and filtering, but approximate nearest-neighbor search relies on specialized structures and similarity functions.

Examples of separate concepts:

```text
hash ID              → exact identity
Bloom filter         → approximate membership
HNSW/ANN structure   → vector-neighbor search
```

These should not be conflated.

## 31. Distributed Cache Architecture

A scalable AI cache may combine:

```text
canonical request
      ↓
request hash
      ↓
consistent-hash routing
      ↓
cache node
      ↓
value / miss
```

Additional layers may include:

- local cache;
- distributed cache;
- Bloom filter;
- TTL;
- stampede protection;
- observability.

Each layer has a separate correctness contract.

## 32. Hashing and Experimentation

Experiment assignments can use deterministic hashing:

```text
H(userId, experimentId) → bucket
```

This can provide stable assignment without storing an explicit assignment for every user.

Production experimentation still requires careful handling of:

- tenant isolation;
- eligibility;
- rollout changes;
- bucket stability;
- exposure logging.

## 33. Reproducibility

Deterministic hashing can help make data-processing assignments repeatable.

For reproducibility, document:

- hash algorithm;
- seed/key;
- canonical input representation;
- version;
- partition count;
- normalization rules.

Changing any of these can change assignments.

## 34. Security: Hash vs Secret-Keyed Hash

If an attacker can choose inputs and observe outputs, a public deterministic hash may expose predictable relationships.

A secret-keyed construction such as a MAC can provide different security properties.

The selection depends on whether the requirement is:

```text
content fingerprinting
or
adversarial integrity/authentication
```

These are different problems.

## 35. Correctness Invariants

AI hashing systems should preserve:

1. canonical equivalent inputs produce the intended identity;
2. result-affecting parameters are included in cache identity;
3. tenant boundaries cannot collide semantically;
4. hash collisions never silently imply content equality when exact equality matters;
5. partition routing is deterministic for a given version;
6. probabilistic structures preserve their documented error semantics;
7. artifact digests are verified against the intended algorithm/version.

## 36. Complexity

For exact hash-map operations:

```text
expected lookup/update → O(1)
```

For Bloom filters:

```text
insert/query → O(k)
space        → O(m)
```

For Count-Min Sketch:

```text
update/query → O(d)
space        → O(wd)
```

The end-to-end AI system may additionally pay for:

- serialization;
- hashing large payloads;
- network transfer;
- cache access;
- vector search;
- model inference.

## 37. Common Mistakes

1. Using exact hashes for semantic similarity.
2. Omitting model/configuration fields from cache keys.
3. Treating a digest as a uniqueness guarantee.
4. Ignoring tenant boundaries.
5. Using unstable canonicalization.
6. Ignoring feature-hashing collisions.
7. Treating Bloom filters as exact membership.
8. Treating CMS counts as exact.
9. Assuming hash partitioning guarantees balanced compute.
10. Ignoring hot keys.
11. Confusing integrity with authenticity.
12. Changing hash/version configuration without migration planning.

## 38. Edge Cases & Failure Modes

Test:

- empty input;
- equivalent structured inputs;
- changed model version;
- changed tokenizer;
- changed prompt configuration;
- tenant boundary changes;
- duplicate content;
- hash collision candidates;
- Bloom saturation;
- CMS overestimation;
- shard skew;
- hot keys;
- hash algorithm migration;
- corrupted artifact;
- privacy-sensitive identifiers.

## 39. Backend + AI Engineering Lab

Build a local pipeline:

```text
request
  ↓
canonicalization
  ↓
request fingerprint
  ↓
Bloom membership screen
  ↓
exact cache/index
  ↓
consistent-hash routing
  ↓
result
  ↓
CMS frequency telemetry
```

Measure:

- cache hit rate;
- false-positive rate;
- request-hash cost;
- shard distribution;
- hot-key concentration;
- approximate frequency error;
- memory usage;
- end-to-end latency.

## 40. Interview Preparation

Be able to explain:

1. Exact hashing vs semantic similarity.
2. AI request-cache key design.
3. Dataset deduplication.
4. Feature hashing and collision trade-offs.
5. Bloom filters in AI pipelines.
6. Count-Min Sketch in AI telemetry.
7. Hash-based data sharding.
8. Consistent hashing for model-serving/cache routing.
9. Hashing for deterministic experiment assignment.
10. Cryptographic integrity vs authentication.
11. Hot-key limitations.
12. Reproducibility requirements.
13. Tenant isolation in hash-based caches.
14. Hash algorithm/version migration.

## 41. Revision Checklist

- [ ] I can design an exact content fingerprint.
- [ ] I understand canonicalization.
- [ ] I can design an AI request cache key.
- [ ] I understand feature hashing collisions.
- [ ] I can distinguish exact identity from semantic similarity.
- [ ] I can use Bloom filters as safe screening layers.
- [ ] I understand CMS frequency estimation.
- [ ] I can design hash-based dataset sharding.
- [ ] I understand consistent-hash routing for AI services.
- [ ] I can reason about hot keys.
- [ ] I understand deterministic experiment assignment.
- [ ] I can distinguish integrity from authenticity.
- [ ] I can design reproducible hash configurations.
- [ ] I can plan hash/version migration.

## 42. Key Takeaways

1. **Hashing is a foundational primitive in AI infrastructure, but its meaning depends on the workload.**
2. **Exact fingerprints identify representations; they do not measure semantic similarity.**
3. **AI cache keys must include every result-affecting input, configuration, model, and version required by the cache contract.**
4. **Feature hashing trades vocabulary memory for bucket collisions.**
5. **Bloom filters provide approximate membership; Count-Min Sketch provides approximate frequency.**
6. **Hash partitioning can distribute keys but does not automatically balance compute cost or hot requests.**
7. **Consistent hashing can stabilize distributed cache/model-serving placement during membership changes.**
8. **Cryptographic digests provide integrity-related properties; authenticity requires additional mechanisms when needed.**
9. **Deterministic hashing supports reproducibility and stable assignments only when algorithm, seed, canonicalization, and version are controlled.**
10. **Production AI hashing systems must treat correctness, security, tenant isolation, error bounds, and migration as first-class design concerns.**
