# 13.13 — Concurrent Tries & Read-Mostly Indexes

## 1. Concept Definition

A concurrent trie is a trie designed for overlapping readers and writers while preserving structural correctness and defined visibility semantics. A **read-mostly index** optimizes for workloads where lookups vastly outnumber updates.

The central engineering problem is not merely making pointer operations concurrent. It is defining ownership, visibility, atomicity, synchronization, memory reclamation, and failure behavior.

## 2. Why Concurrency Changes Trie Design

A mutable trie can be correct in a single-threaded program and incorrect when readers observe an update halfway through.

Potential failures include:

- partially inserted paths
- stale or inconsistent metadata
- child-container races
- lost updates
- use-after-free in manually managed memory
- readers seeing mixed versions

A concurrency design must therefore specify what a reader is allowed to observe.

## 3. Read-Mostly Workload Model

Suppose a service performs:

```text
99,000 lookups
1,000 updates
```

per time interval.

Optimizing every lookup around writer synchronization may be wasteful. A common alternative is to make reads extremely cheap and move complexity into update construction and publication.

## 4. Mental Model: Immutable Snapshot

For read-mostly workloads, a powerful architecture is:

```text
Readers ───────────────→ immutable root N
                              ↑
Writer → build N+1 privately ─┘
                              │
                         publish root
```

Readers never mutate trie nodes. Writers construct a new version and publish it as a single logical state transition.

This builds directly on persistent tries from Chapter 13.12.

## 5. Concurrency Dimensions

A complete design should answer:

1. How are readers synchronized?
2. How are writers synchronized?
3. When does an update become visible?
4. Can readers observe intermediate state?
5. How are old versions reclaimed?
6. What happens when an update fails?
7. What consistency level is required?

Without these answers, “thread-safe trie” is underspecified.

## 6. Synchronization Strategies

Common approaches include:

- global mutex
- read/write lock
- fine-grained node locks
- optimistic validation
- copy-on-write
- immutable snapshots
- single-writer ownership
- sharding
- lock-free or wait-free algorithms in specialized environments

Each changes throughput, latency, complexity, and failure behavior.

## 7. Coarse-Grained Locking

A single lock protects the entire trie.

Advantages:

- simple correctness model
- easy mutation semantics
- straightforward testing

Disadvantages:

- readers may block each other depending on lock type
- writers serialize all operations
- poor scalability for highly concurrent workloads

It can still be appropriate for low-contention systems.

## 8. Read/Write Locks

A read/write lock permits multiple readers while excluding writers or restricting incompatible operations.

Conceptually:

```text
many readers
     ↓
 shared read lock

writer
  ↓
exclusive lock
```

Fairness policy matters. Writer starvation and reader starvation are both possible if scheduling is poorly designed.

## 9. Fine-Grained Locking

Different trie regions can have different locks.

This may increase concurrency but introduces:

- lock ordering requirements
- deadlock risk
- more synchronization overhead
- complex deletion semantics
- difficult debugging

Fine-grained locking should be justified by measured contention rather than assumed to be faster.

## 10. Copy-on-Write

Copy-on-write avoids mutating shared structures.

A writer copies the affected path, changes the copies, and publishes the new root.

Readers continue using the old structure until they finish.

This provides strong isolation with potentially higher write allocation costs.

## 11. Root Publication Boundary

The root is a natural atomic publication boundary:

```text
old root → complete old version
new root → complete new version
```

A writer should never publish a root pointing to partially initialized nodes.

The publication protocol must also guarantee the required visibility ordering for the execution environment.

## 12. JavaScript Concurrency Context

JavaScript environments differ.

In typical Node.js code, asynchronous callbacks share one JavaScript thread, but applications can still have concurrency through interleaved operations and external resources. `worker_threads` introduce separate execution contexts and shared memory can introduce additional synchronization concerns.

Therefore, do not automatically import native lock-free assumptions into ordinary JavaScript object mutation.

## 13. Worker-Based Ownership

A practical architecture can assign one worker as the trie owner:

```text
requests → queue → trie owner
                         ↓
                    serialized writes
```

Readers can use immutable snapshots or request the owner for lookups.

Single ownership dramatically simplifies mutation correctness at the cost of coordination and potentially bounded write throughput.

## 14. Sharded Tries

Partition the key space across multiple trie instances.

For example:

```text
hash(namespace) % S → shard
```

Each shard can have independent ownership or locking.

The partition function must be stable, balanced, and compatible with query semantics.

## 15. Prefix Sharding

Hash-based sharding is not always appropriate for prefix queries.

A prefix-oriented workload may instead partition by leading symbols or namespaces.

Trade-offs include:

- hot prefixes
- uneven shard sizes
- cross-shard prefix queries
- migration complexity
- balancing cost

The query pattern should drive the partition strategy.

## 16. Snapshot Readers

A snapshot reader can capture a root once:

```text
root = currentRoot
```

and use that root for the entire operation.

This prevents one lookup from accidentally combining state from two versions.

For multi-step operations, explicit snapshot lifetime is important.

## 17. Version Consistency

Suppose a prefix query requires several traversals. If the root can change during the query and the operation reads different roots, it may observe an impossible state.

Therefore:

> A logical read should operate against one well-defined version unless the API explicitly allows moving visibility.

## 18. Atomic Multi-Key Updates

If an update changes multiple keys:

```text
insert A
insert B
remove C
```

publishing each mutation separately exposes intermediate states.

For atomic visibility, construct the complete next version and publish once.

This is one reason immutable snapshots are attractive for configuration and dictionary indexes.

## 19. Metadata Consistency

Concurrent metadata is often harder than concurrent structure.

A node may cache:

- subtree count
- maximum score
- frequency sum
- Top-K results

If structure and metadata are updated separately, readers can observe mismatched state.

Immutable version construction solves this by making the entire published graph internally consistent.

## 20. Lazy Deletion Under Concurrency

Lazy deletion can reduce structural mutation but introduces dead entries.

Readers need a clear semantic rule:

- ignore tombstoned keys
- expose deletion timestamps
- use generation numbers
- rebuild periodically

If cached metadata counts deleted entries, queries may return incorrect results.

## 21. Tombstones and Reclamation

For long-lived mutable indexes, tombstones can accumulate.

A background compaction process can construct a clean snapshot:

```text
mutable state
    ↓
compaction
    ↓
clean immutable trie
    ↓
publish
```

The old structure can then be reclaimed once no readers need it.

## 22. Memory Reclamation

With immutable snapshots, old nodes remain reachable while readers or retained versions reference them.

Possible models include:

- garbage collection
- reference counting
- epochs
- hazard pointers
- explicit ownership

JavaScript generally uses garbage collection, but application references can accidentally retain old snapshots.

## 23. Epoch-Style Reasoning

An epoch model can conceptually track the oldest reader that may still access an old version.

Once no reader can reference a version, unique nodes can be reclaimed.

This is especially important in unmanaged-memory implementations where garbage collection is unavailable.

## 24. Lock-Free Boundary

“Lock-free” is a precise progress property, not a synonym for “fast.”

A lock-free trie may require atomic compare-and-swap operations, carefully immutable node transitions, and safe memory reclamation.

Correctness requires linearization points and a formal memory model.

Do not implement lock-free pointer structures without understanding the target runtime's atomic and memory-order guarantees.

## 25. Linearizability

For a concurrent operation, identify the point at which it logically takes effect.

For example:

```text
insert(key)
        ↓
root publication / atomic pointer update
        ↑
linearization point
```

Every completed operation should appear to occur at one valid point in the concurrent history if linearizability is the selected contract.

## 26. Weaker Consistency Models

A system may intentionally provide weaker semantics:

- eventual consistency
- snapshot consistency
- read-your-writes
- monotonic reads
- session consistency

A distributed trie index may not need full linearizability if stale reads are acceptable.

The consistency contract should be driven by product requirements.

## 27. Backend Applications

Concurrent/read-mostly tries can support:

- high-QPS routing lookup
- configuration indexes
- authorization prefix policies
- autocomplete services
- namespace routing
- feature/configuration snapshots
- read-heavy cache indexes

A typical design is:

```text
update stream → builder → validate → immutable root → readers
```

## 28. AI Applications

Read-mostly trie indexes are useful for:

- constrained decoding lexicons
- tool and function namespaces
- entity catalogs
- prompt policy dictionaries
- vocabulary metadata
- inference-time prefix filtering

AI serving often has many concurrent reads and comparatively infrequent vocabulary/configuration changes, making snapshot publication a useful architectural pattern.

## 29. Hot Prefixes

A prefix such as `user:` or `tool:` may receive disproportionate traffic.

Optimization options include:

- cached prefix nodes
- immutable snapshots
- per-prefix metadata
- workload-aware sharding
- specialized hot-path representations

Measure before optimizing; hot-prefix caching can increase invalidation and memory costs.

## 30. Backpressure and Update Queues

If writers arrive faster than the builder can publish versions, an update queue grows.

A production design should define:

- queue capacity
- batching
- coalescing
- cancellation
- retry behavior
- durability boundary
- lag metrics

The trie is only one component of the update pipeline.

## 31. Batch Publication

Instead of publishing every update:

```text
update 1 → publish
update 2 → publish
update 3 → publish
```

batch:

```text
updates 1..N → build → validate → publish once
```

Batching can reduce publication overhead and write amplification while increasing reader staleness.

## 32. Failure Handling

A failed build must not corrupt the currently published version.

Preferred pattern:

```text
current version
      ↓
private build
      ↓
failure? ──→ discard
      ↓
validate
      ↓
publish
```

The old root remains a valid fallback.

## 33. Observability

Monitor:

- lookup latency
- update latency
- publication latency
- snapshot age
- update queue depth
- nodes copied per update
- memory retained by snapshots
- prefix hit rates
- rebuild frequency
- failed updates

Tail latency matters especially for high-QPS services.

## 34. Testing Concurrent Designs

Test:

- concurrent reads
- overlapping writes
- read during publication
- failed update construction
- version retention
- deletion/reinsertion
- hot prefixes
- long-running readers
- snapshot isolation

For deterministic testing, use controlled schedulers or explicit interleavings where possible.

## 35. Differential Testing

Compare every published version against a simple reference model.

For concurrent workloads:

1. record logical operations
2. reproduce them sequentially
3. compute the reference state
4. compare each visible snapshot
5. verify consistency guarantees

This separates algorithmic errors from scheduling complexity.

## 36. Complexity

For snapshot-based persistent updates:

- read: generally similar to immutable trie lookup
- update: path-copying plus metadata/container costs
- publication: approximately constant logical root swap
- memory: copied structure plus retained versions

For lock-based designs, add synchronization wait time and contention to practical performance analysis.

## 37. Common Mistakes

- declaring a trie “thread-safe” without a consistency contract
- mutating shared nodes in a supposedly immutable snapshot
- publishing before validation
- mixing roots during one logical read
- ignoring metadata consistency
- using fine-grained locks without deadlock analysis
- forgetting memory reclamation
- assuming lock-free means wait-free
- ignoring hot-prefix contention
- measuring only average latency

## 38. Design Decision Framework

Choose based on workload:

```text
Mostly reads + infrequent updates
    → immutable snapshots / persistence

Moderate reads + writes + low contention
    → coarse or read/write locking

High write concurrency
    → sharding / ownership / specialized concurrent structure

Prefix-heavy distributed workload
    → prefix-aware partitioning + snapshots
```

These are starting points, not universal rules.

## 39. Interview Framework

For a concurrent trie problem:

1. Define the consistency requirement.
2. Define reader and writer workloads.
3. Choose ownership.
4. Choose mutable vs immutable state.
5. Define publication/linearization point.
6. Define metadata consistency.
7. Define memory reclamation.
8. Handle failures.
9. Analyze contention and tail latency.
10. Explain testing and observability.

## 40. Revision Checklist

- [ ] Explain why mutable tries need synchronization.
- [ ] Compare coarse and fine-grained locking.
- [ ] Explain copy-on-write.
- [ ] Design immutable snapshot readers.
- [ ] Define a publication boundary.
- [ ] Explain single-writer ownership.
- [ ] Compare hash and prefix sharding.
- [ ] Handle metadata consistency.
- [ ] Explain tombstones and compaction.
- [ ] Explain memory reclamation.
- [ ] Define linearizability.
- [ ] Distinguish lock-free from wait-free.
- [ ] Design update batching/backpressure.
- [ ] Build a concurrent differential-testing strategy.

## Key Takeaways

1. Concurrent trie engineering begins with a consistency contract.
2. Read-mostly workloads often benefit from immutable snapshot publication.
3. The root can serve as a clean logical visibility boundary.
4. Metadata must be published consistently with structure.
5. Single-writer ownership and sharding can simplify concurrency substantially.
6. Immutable versions shift complexity from reader synchronization to update allocation and memory retention.
7. Lock-free designs require formal progress, atomicity, memory-order, and reclamation reasoning.
8. Production performance must include contention, tail latency, snapshot age, memory, and update lag.
