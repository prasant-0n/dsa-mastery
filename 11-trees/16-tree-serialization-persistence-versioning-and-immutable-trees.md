# 11.16 — Tree Serialization, Persistence, Versioning & Immutable Trees

## 1. Objective

Tree serialization converts a tree into a portable representation and deserialization reconstructs it. Persistence and immutable trees extend this idea to durable storage, historical versions, safe sharing, and structural reuse.

## 2. Serialization Contract

A serialization format must define:

- node values;
- child relationships;
- empty-child representation;
- ordering assumptions;
- version/schema information when required.

The contract should be deterministic when reproducibility matters.

## 3. Why Serialization Exists

Serialization enables:

- persistence;
- network transfer;
- caching;
- snapshots;
- testing fixtures;
- process restart recovery.

## 4. Preorder Serialization

A binary tree can be serialized with preorder traversal plus explicit null markers:

```text
node → left → right
```

Without null structure markers, a generic binary tree cannot always be uniquely reconstructed from preorder alone.

## 5. Inorder Serialization

Inorder records keys in sorted order for a BST, but inorder alone does not preserve arbitrary tree shape.

For a BST, additional structural information or a constrained reconstruction convention is required.

## 6. Postorder Serialization

Postorder can serialize trees similarly using explicit null markers:

```text
left → right → node
```

The important requirement is preserving enough structural information for unambiguous reconstruction.

## 7. Level-Order Serialization

Breadth-first serialization records nodes by levels. Null markers are needed when sparse child positions must be preserved.

It is often convenient for debugging and human inspection.

## 8. Compact BST Serialization

A BST can sometimes be serialized more compactly by storing traversal values without every null marker and reconstructing using ordering constraints and bounds.

This is only valid when the BST invariant and duplicate policy are part of the contract.

## 9. Deserialize Correctness

A serializer/deserializer pair should satisfy a round-trip property:

```text
deserialize(serialize(T)) ≡ T
```

where equivalence must be defined precisely, such as structural equality or value/ordering equivalence.

## 10. Canonical Serialization

A canonical representation maps equivalent trees to the same serialized form when the application requires stable hashes, cache keys, or deterministic snapshots.

Canonicalization must not accidentally erase meaningful metadata.

## 11. Schema Versioning

Persistent tree formats should carry enough information to distinguish schema versions when the representation can evolve.

A version-aware reader can migrate old representations to the current internal model.

## 12. Backward Compatibility

A production reader should define whether it supports:

- current format only;
- a compatibility window;
- migration on read;
- explicit offline migration.

## 13. Validation Before Deserialization

Untrusted serialized trees should be validated for:

- size limits;
- depth limits;
- malformed references;
- duplicate identifiers;
- invalid ordering;
- invalid metadata;
- cyclic references in reference-based formats.

## 14. Persistent Data Structures

A persistent tree preserves previous versions after updates.

Instead of mutating shared nodes, an update creates replacement nodes along the modified path and reuses unaffected subtrees.

## 15. Path Copying

For a balanced tree, a point update generally copies only nodes on one root-to-leaf path:

```text
old version
   ↓
copy modified path
   ↓
share untouched subtrees
```

This provides structural sharing.

## 16. Structural Sharing

Shared subtrees must be treated as immutable. Mutating a shared node would corrupt multiple logical versions.

Ownership and mutability rules are therefore part of correctness.

## 17. Immutable Tree Model

An immutable tree update returns a new root rather than changing the old root.

Readers holding the previous root can continue traversing their version safely.

## 18. Version Roots

A version table can map:

```text
versionId → root
```

Each root identifies a complete logical snapshot.

## 19. Version DAG

If versions can branch from earlier versions, the history becomes a directed acyclic graph rather than a simple linear sequence.

This is conceptually similar to branching histories in version-control systems.

## 20. Memory Complexity

For a point update on a balanced persistent tree, path copying creates `O(log N)` new nodes while retaining shared nodes from the previous version.

Total storage depends on the number and shape of updates.

## 21. Garbage Collection

When no version references a subtree, it can eventually be reclaimed by the runtime or explicit reference counting/storage GC system.

Retention policies matter when old versions are intentionally kept.

## 22. Persistent Search Trees

Persistent BSTs, AVL trees, and Red-Black Trees can preserve historical ordered sets. Balancing logic must remain compatible with immutable node replacement.

## 23. Persistent Segment Trees

Persistent segment trees reuse untouched segments after point updates and are useful for versioned range queries.

Each update usually creates `O(log N)` new nodes.

## 24. Snapshot Isolation Concept

Immutable roots naturally provide stable snapshots: a reader can retain a root while writers construct newer versions without mutating that reader's structure.

This is a useful building block, not a complete database transaction protocol.

## 25. Serialization vs Persistence

Serialization is a representation mechanism. Persistence is a lifecycle/property of retaining state across time or process boundaries.

A tree may be persistent in memory without being serialized, and a serialized tree does not automatically provide multi-version persistence.

## 26. Storage Formats

Possible representations include:

- JSON for interoperability/debugging;
- compact binary formats for efficiency;
- flat arrays for compact trees;
- object graphs for general references.

The format should match the required performance, portability, and trust model.

## 27. Object Graph Serialization

Reference-based trees require an explicit node identity model if shared subtrees or arbitrary references are possible.

Naïve recursive value serialization can duplicate shared objects or fail on cycles.

## 28. Security

Never assume serialized input is trustworthy. Resource exhaustion can occur through enormous node counts, extreme depth, malicious references, or pathological metadata.

Deserialization should enforce budgets.

## 29. Deep Trees and Stack Safety

Recursive serialization/deserialization can overflow the JavaScript call stack on deep trees.

Iterative traversal with an explicit stack/queue provides controlled memory behavior.

## 30. Streaming Serialization

Large trees can be serialized incrementally instead of constructing one enormous intermediate string or object.

Streaming requires a format that can represent boundaries and errors safely.

## 31. Checksums and Integrity

Persistent snapshots may include checksums or content hashes so corruption can be detected before a tree is trusted.

Integrity verification is distinct from authenticity.

## 32. Content-Addressed Trees

Nodes can be identified by hashes of their content. Equal immutable subtrees can then share identities naturally, enabling deduplication and efficient snapshot storage.

Hash collisions and canonical encoding must be handled according to the integrity requirements.

## 33. Merkle Trees

A Merkle tree stores a hash derived from child hashes and node content. A root hash commits to the represented structure.

This enables efficient verification of whether a subtree belongs to a particular snapshot.

## 34. Backend Applications

These concepts support:

- cache snapshots;
- configuration versions;
- audit histories;
- persistent indexes;
- immutable event projections;
- rollbackable application state.

## 35. AI Applications

They can support:

- versioned search indexes;
- immutable retrieval snapshots;
- experiment/configuration lineage;
- cached inference structures;
- Merkle-verified datasets and model metadata.

## 36. Correctness Properties

Test:

1. serialization/deserialization round trips;
2. structural equivalence;
3. ordering invariants;
4. metadata invariants;
5. old-version immutability;
6. structural sharing correctness;
7. version isolation.

## 37. Common Mistakes

1. Omitting null structure markers for generic trees.
2. Assuming inorder uniquely identifies a binary tree.
3. Mutating a shared persistent node.
4. Forgetting schema/version compatibility.
5. Recursively processing attacker-controlled deep trees.
6. Confusing integrity hashes with authentication.
7. Retaining every version without a lifecycle policy.

## 38. Complexity

For a tree with `N` nodes:

```text
Full serialization: O(N)
Full deserialization: O(N)
Persistent balanced point update: O(log N) new nodes
Persistent search: O(log N) on balanced trees
```

Space for a snapshot is `O(N)`; incremental persistent updates can require substantially less new allocation through sharing.

## 39. Interview Framework

```text
1. What information is required for an unambiguous round trip?
2. Is the tree generic or a constrained BST?
3. Are nodes mutable or immutable?
4. How are versions represented?
5. How much structural sharing occurs?
6. What is the allocation cost of an update?
7. How do you handle deep trees safely?
8. How does schema evolution work?
9. How do you validate untrusted serialized data?
10. How would you verify snapshot integrity?
```

## 40. Revision Checklist

- [ ] I can serialize a generic binary tree with null markers.
- [ ] I understand why inorder alone is insufficient.
- [ ] I can prove a serializer round trip.
- [ ] I understand immutable updates.
- [ ] I can explain path copying.
- [ ] I understand structural sharing.
- [ ] I can model version roots.
- [ ] I understand persistent segment/tree structures.
- [ ] I understand schema evolution and validation.
- [ ] I can explain Merkle/content-addressed tree concepts.

## 41. Key Takeaways

1. **Serialization must preserve exactly the information required by its reconstruction contract.**
2. **Immutable trees enable safe structural sharing and historical versions through path copying.**
3. **Persistence is a data-structure property; serialization is a representation mechanism, and they solve related but different problems.**
4. **Production serialization must account for schema evolution, resource limits, deep-tree stack safety, and integrity.**
5. **Content-addressed and Merkle-style trees extend immutable structure sharing into verifiable snapshots and storage systems.**
