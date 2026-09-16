# 13.12 — Persistent & Immutable Tries

## 1. Concept Definition

A **persistent trie** preserves previous versions when an update creates a new version. An **immutable trie** does not modify existing nodes after publication. New versions are built by copying the affected path and sharing unchanged subtrees.

```text
Version 0                 Version 1
    root                      root'
     |                         |
   shared ──────────────── shared
     |                         |
   old path                 copied path
```

Persistence is a data-structure property; snapshotting, version publication, and garbage collection are system-level concerns built around it.

## 2. Why Immutability Exists

Mutable tries require synchronization when readers and writers overlap. Immutable versions provide stable read state without requiring readers to lock every node.

Useful properties include:

- stable snapshots
- rollback
- historical queries
- reproducible reads
- safe sharing between readers
- easier concurrent reasoning

The cost is additional allocation and retained shared structure.

## 3. Mental Model

Treat each trie version as a root pointer into an immutable graph of nodes.

An update does not rewrite the old graph. It constructs a new root and copies only nodes whose contents or child references change.

This is **path copying**.

## 4. Structural Sharing

Suppose a trie contains keys:

```text
cat
car
map
```

Updating `car` should copy only the nodes needed along the `car` path. The `map` subtree can remain shared.

The central invariant is:

> A node reachable from an older published version must never be mutated by a newer version.

## 5. Immutable Node Design

A simple node may contain:

```js
{
  terminal: true,
  value: 42,
  children: new Map()
}
```

After publication, all fields that can affect semantics should be treated as immutable.

A persistent implementation can create a fresh `Map` only when the child set changes.

## 6. Path Copying

For an update at depth `d`:

1. read the old root
2. copy the root
3. copy the next affected node
4. continue until the target
5. modify only copied nodes
6. reuse untouched children
7. publish the new root

If the structural depth is `d`, update allocation is generally related to `O(d)` copied nodes, plus label/value/metadata work.

## 7. Persistent Insertion

Insertion must preserve the old version.

```text
oldRoot ── A ── B ── C
newRoot ── A' ─ B' ─ C'
                    └── new value
```

Unchanged siblings of `A`, `B`, and `C` can be shared.

The old root remains a valid entry point to the old key set.

## 8. Persistent Deletion

Deletion follows the same principle:

- copy the affected path
- clear terminal state in the copied target
- prune copied nodes when safe
- share untouched subtrees

Never prune an old node in place because another version may still reference it.

## 9. Persistent Updates Are Not Deep Clones

A deep clone copies the entire trie.

Path copying copies only affected structure.

If the trie has `N` nodes and the update path touches `d` nodes:

- deep clone: approximately `O(N)` new nodes
- path copying: approximately `O(d)` new nodes

The exact cost depends on child-container copying, metadata, and compressed-edge representation.

## 10. Child Container Strategies

A persistent node may store children using:

- immutable maps
- copied `Map` instances
- persistent maps
- sorted immutable arrays
- compact specialized structures

Copying a large child container can dominate the nominal `O(d)` path-copying cost.

Therefore, analyze both **path depth** and **child-container update cost**.

## 11. Persistent Radix Trees

In a radix tree, path copying operates on compressed nodes rather than individual characters.

An insertion can still require edge splitting. The split nodes must be newly allocated, while unrelated subtrees remain shared.

Deletion may additionally collapse copied unary nodes.

## 12. Version Semantics

A version can be represented simply by:

```js
{
  root,
  versionId
}
```

A version should have clearly defined semantics:

- which keys exist
- which values are visible
- whether metadata is consistent
- whether the version is immutable
- how it relates to previous versions

## 13. Snapshot Publication

A read-mostly service can use:

```text
currentRoot → immutable version N

writer:
  build version N+1 privately
  validate N+1
  publish root N+1
```

Readers that already hold `N` continue safely while new readers receive `N+1`.

## 14. Atomic Root Publication

The root pointer is the natural publication boundary.

A writer should construct the complete new structure before publishing it. Publishing an incomplete root can expose partially initialized state.

In JavaScript, application-level atomicity still requires a clear ownership and scheduling model; immutability prevents structural races but does not automatically solve every shared-state problem.

## 15. Historical Queries

Persistence enables:

```text
lookup(version42, "user:123")
lookup(version41, "user:123")
```

without reconstructing the entire historical trie.

This is useful for configuration history, dictionaries, routing snapshots, and reproducible AI inference environments.

## 16. Rollback

Rollback can be as simple as selecting an older root:

```text
current = version42
rollback → version41
```

No inverse mutation is required if the old version remains reachable.

This is one of the strongest practical benefits of persistent structures.

## 17. Version Retention

Persistence becomes expensive if every historical version is retained indefinitely.

A production policy should define:

- maximum retained versions
- time-based retention
- reference ownership
- snapshot consumers
- compaction policy
- garbage-collection expectations

Memory usage is determined by both the trie and the version graph.

## 18. Garbage Collection and Sharing

When no root references an old version, its uniquely owned nodes become reclaimable.

Shared nodes remain alive as long as at least one reachable version uses them.

In garbage-collected languages, this is naturally expressed through object reachability, but stale references can keep entire historical structures alive.

## 19. Memory Accounting

Track at least:

- total live nodes
- nodes copied per update
- shared nodes
- retained versions
- edge-label bytes
- metadata bytes
- child-container overhead

A persistent trie can have excellent update asymptotics while still exceeding a memory budget because of high update frequency.

## 20. Metadata in Persistent Tries

Cached metadata must also be persistent.

If a node stores subtree count, frequency, or maximum score, updating a descendant requires new metadata values on the copied path.

Never mutate shared metadata in place.

## 21. Persistent Top-K Metadata

For cached Top-K suggestions, an update may cause several copied ancestors to receive new ranking metadata.

This can make metadata maintenance more expensive than structural path copying.

Therefore, separate:

- structural update cost
- metadata update cost
- ranking recomputation cost

## 22. Immutability and Concurrency

Immutable structures simplify concurrent reads because readers never need to coordinate with mutations of the same nodes.

However, concurrency still exists around:

- root publication
- version registry
- reference management
- persistence storage
- metrics
- update scheduling

Immutability removes one class of races; it does not make the whole system automatically thread-safe.

## 23. MVCC Connection

Persistent data structures and **multi-version concurrency control** share an important idea: readers can observe stable historical state while newer state is constructed separately.

A persistent trie can therefore be a useful in-memory building block for versioned indexes, although a database MVCC system additionally manages transactions, durability, visibility rules, and recovery.

## 24. Serialization

Persistent tries can be serialized as snapshots.

Important choices include:

- node IDs vs recursive nesting
- deduplication of shared nodes
- edge-label representation
- version metadata
- checksums
- schema version

A naive recursive serialization can duplicate shared subtrees and destroy the memory advantage of structural sharing.

## 25. Merkle-Style Hashing

A trie node can store a hash derived from its semantic content and child hashes.

Conceptually:

```text
nodeHash = H(terminal, value, childHashes)
```

This can support:

- change detection
- snapshot comparison
- content-addressed storage
- integrity validation
- efficient subtree equality checks

Hash design must define canonical serialization and collision assumptions.

## 26. Diffing Versions

Two persistent versions can be compared recursively.

If corresponding subtree references or content hashes are identical, that subtree can be skipped.

Otherwise, recurse into changed children.

This can make version diffing substantially cheaper than enumerating every key when changes are localized.

## 27. Merging Versions

Merging two persistent tries requires conflict semantics.

For a key present in both versions, define a resolver such as:

```text
left wins
right wins
latest timestamp wins
custom merge
conflict
```

Structural sharing can make merge efficient for identical subtrees, but conflicting updates still require explicit work.

## 28. Backend Applications

Persistent tries can support:

- configuration snapshots
- routing-table versions
- authorization policy versions
- namespace indexes
- autocomplete dictionary releases
- feature-flag snapshots
- rollbackable caches

A common architecture is:

```text
storage/update stream
        ↓
private trie build
        ↓
validation
        ↓
immutable snapshot
        ↓
atomic publication
        ↓
readers
```

## 29. AI Applications

Useful AI scenarios include:

- versioned vocabulary lexicons
- constrained-decoding dictionaries
- tool/agent namespace snapshots
- entity catalogs
- reproducible retrieval metadata
- model-serving configuration indexes

Immutable snapshots can help ensure that one inference request observes a consistent dictionary even while a newer catalog is being prepared.

## 30. Correctness Proof Strategy

For persistent insertion, prove:

1. old version remains unchanged
2. new key exists in the new version
3. all unaffected keys preserve their values
4. copied nodes contain correct child references
5. shared nodes are never mutated

For persistent deletion, additionally prove that pruning affects only the new version.

## 31. Testing Strategy

Maintain a reference `Map` per version.

For every update:

1. create a new version
2. update the reference model
3. verify the new version
4. verify all older versions
5. compare enumeration and values

Test sequences such as:

```text
V0
 ├─ insert A → V1
 ├─ insert B → V2
 └─ delete A → V3
```

Every version should remain independently correct.

## 32. Property-Based Testing

Useful properties:

- old versions never change
- inserting then deleting restores the prior semantic set
- version branching is independent
- shared subtrees are observationally identical
- serialization round-trips preserve semantics
- diff(V, V) is empty
- publishing a version does not change it afterward

## 33. Complexity

For a persistent trie update affecting depth `d`:

- traversal: typically `O(d)` symbol/edge work
- copied nodes: typically `O(d)`
- additional child-container copying: representation-dependent
- memory per version: approximately copied-path cost

For a persistent radix tree, include edge-character comparison and split/merge costs.

## 34. Common Mistakes

- deep-cloning every update
- mutating a shared child map
- forgetting metadata copy-on-write
- publishing before validation
- retaining unlimited versions
- serializing shared nodes repeatedly
- confusing immutable nodes with immutable external values
- assuming persistence automatically provides durability
- ignoring child-container copy cost

## 35. Production Design Checklist

Before using a persistent trie in production, define:

1. version identity
2. root publication mechanism
3. update ownership
4. child-container strategy
5. metadata policy
6. memory budget
7. retention policy
8. serialization format
9. integrity/hash strategy
10. rollback semantics
11. concurrency model
12. observability

## 36. Interview Framework

When asked to design a persistent trie:

1. Start with immutable nodes.
2. Explain structural sharing.
3. Derive path copying.
4. Show insertion and deletion versions.
5. Prove old-version isolation.
6. Analyze copied nodes and container costs.
7. Discuss metadata.
8. Explain root publication.
9. Compare deep copy vs path copying.
10. Discuss memory retention and testing.

## 37. Revision Checklist

- [ ] Explain persistence vs immutability.
- [ ] Draw structural sharing.
- [ ] Implement path copying.
- [ ] Implement persistent insertion.
- [ ] Implement persistent deletion.
- [ ] Preserve old versions.
- [ ] Handle immutable metadata.
- [ ] Design atomic snapshot publication.
- [ ] Measure retained memory.
- [ ] Implement version diffing.
- [ ] Explain Merkle-style subtree hashing.
- [ ] Design rollback.
- [ ] Build a differential test suite.
- [ ] Compare persistent trie with deep-copy and mutable designs.

## Key Takeaways

1. Persistence preserves previous versions through immutable nodes and structural sharing.
2. Path copying usually changes only the affected structural path.
3. Shared nodes must never be mutated after publication.
4. Child-container and metadata costs can dominate the simple path-copying model.
5. Immutable roots are powerful for read-mostly snapshot-based systems.
6. Historical versions enable rollback and reproducible reads.
7. Persistence is not the same as durability or full concurrency control.
8. Correctness depends on version isolation, structural sharing, and rigorous memory accounting.
