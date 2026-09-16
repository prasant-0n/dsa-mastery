# 13.11 — Trie Deletion, Compression & Mutation Engineering

## 1. Concept Definition

Trie mutation engineering is the disciplined design of **insertion, deletion, update, pruning, compression, and structural repair** while preserving trie semantics and invariants.

Insertion is often taught first because it mostly adds structure. Deletion is harder: it must remove what is no longer needed without destroying prefixes, sibling branches, terminal keys, cached metadata, or shared state.

## 2. Why Deletion Is Hard

Consider keys:

```text
car
card
care
cat
```

Deleting `car` must not remove the shared `car` path because `card` and `care` still depend on it.

Deleting `card` may remove only its terminal marker. Deleting both `card` and `care` can eventually make some nodes redundant.

The key idea is:

> Remove semantic state first; reclaim structural state only when it is provably unnecessary.

## 3. Mental Model

Separate a trie into two layers:

1. **Semantic state** — terminal/key/value/frequency metadata.
2. **Structural state** — nodes, edges, child containers, cached summaries.

Deletion first changes semantic state. Structural pruning is a consequence of that change.

This separation makes correctness reasoning much easier.

## 4. Core Trie Invariants

A mutation-safe trie should define invariants such as:

1. Every stored key corresponds to exactly one terminal state.
2. Every root-to-terminal path reconstructs the stored key.
3. Non-terminal nodes may exist only when required by descendants or metadata policy.
4. Child relationships remain valid after mutation.
5. Cached subtree metadata agrees with descendants.
6. A deleted key cannot remain reachable as a terminal key.
7. Other keys remain unchanged.

For compressed tries, add edge-label invariants from Chapter 13.09.

## 5. Deletion Strategies

### Strategy A — Lazy Deletion

Keep the node but clear its terminal/value state.

Advantages:

- simple
- avoids immediate structural mutation
- useful for write-heavy workloads

Disadvantages:

- memory can accumulate
- traversal may encounter dead structure
- compaction becomes a separate operation

### Strategy B — Eager Pruning

After clearing terminal state, walk backward and remove nodes that have no children and no required metadata.

Advantages:

- compact structure
- immediate reclamation

Disadvantages:

- more mutation work
- more pointer/container operations

## 6. Post-Order Cleanup

A clean deletion algorithm often behaves like post-order reasoning:

1. descend to the target
2. remove terminal state
3. return upward
4. inspect whether the child is now removable
5. prune only if safe

The parent needs enough information to decide whether its child remains necessary.

## 7. Terminal Node With Children

A common error is deleting a terminal node simply because it has children.

Example:

```text
car   ← terminal
 ├── d
 └── e
```

The node represents `car` and is also a prefix for `card` and `care`.

Deleting `car` should clear only its terminal state. The children remain.

## 8. Empty Key

If the API permits the empty string, the root itself can be terminal.

Therefore deletion must support:

```text
key = ""
```

without removing the root.

This is a small edge case with major consequences for root semantics.

## 9. Mutation Contracts

Every mutating operation should define:

- accepted input
- duplicate-key behavior
- missing-key behavior
- return value
- mutation atomicity
- metadata update rules
- error semantics

For example, `delete(key)` might return a boolean indicating whether a key existed, while `remove(key)` might return the stored value.

Do not leave these semantics implicit in production APIs.

## 10. Compressed-Trie Deletion

In a radix tree, deletion can require **node collapse**.

Suppose:

```text
root
 └── "car"
      ├── "d" → terminal
      └── "e" → terminal
```

After deleting both descendants, if `car` is non-terminal, the remaining structure can be removed.

If an internal non-terminal node has exactly one child, its edge can often be merged with the child's edge.

## 11. Safe Compression Rule

A non-terminal unary node is usually compressible.

A terminal unary node is not automatically compressible if the representation stores terminal semantics at that node.

General rule:

> Structural compression must preserve the location and meaning of every semantic boundary.

## 12. Merge Operation

For adjacent radix edges:

```text
"pre" → node → "fix" → child
```

where the middle node has no terminal state and only one child, compression can produce:

```text
"prefix" → child
```

The merged label must equal the exact concatenation of the original labels.

## 13. Split and Merge Are Dual Operations

Insertion may split one edge into multiple edges.

Deletion may merge multiple edges back together.

Therefore, a powerful testing principle is **round-trip structural normalization**:

```text
insert → split → delete → merge
```

The final semantic key set should equal the original key set.

## 14. Mutation and Cached Metadata

Modern tries often store metadata at nodes:

- subtree key count
- frequency sum
- maximum score
- Top-K suggestions
- minimum/maximum value
- authorization flags

Deletion must update all affected metadata.

A structurally correct trie with stale cached metadata is still incorrect at the API level.

## 15. Metadata Update Strategies

### Recompute
Walk the subtree after mutation.

Simple but potentially expensive.

### Incremental Update
Propagate a delta toward the root.

Usually efficient but requires precise invariants.

### Lazy Recompute
Mark affected nodes dirty and refresh when queried.

Useful when writes are frequent and reads can tolerate bounded recomputation.

The right strategy depends on workload and consistency requirements.

## 16. Frequency and Ranking Tries

If each terminal key has a frequency and each ancestor caches aggregate ranking information, deleting a key requires both:

1. removing its terminal frequency
2. repairing every affected aggregate

For Top-K metadata, simply subtracting one value may be insufficient if the removed key was the cached maximum.

The implementation may need a bounded candidate structure or recomputation.

## 17. Batch Mutation

Instead of mutating a trie once per operation, a system can process a batch:

```text
insert A
insert B
remove C
update D
```

Batching can reduce repeated traversals, allocations, and metadata propagation.

A batch design should define conflict semantics, ordering, atomicity, and failure behavior.

## 18. Mutation Ordering

When multiple updates affect the same key, order matters unless operations are explicitly designed to commute.

For example:

```text
delete("x")
insert("x", 10)
```

is not equivalent to:

```text
insert("x", 10)
delete("x")
```

A production mutation engine should therefore preserve a deterministic ordering or use explicit transaction semantics.

## 19. Transactional Mutation

For complex updates, consider a transactional model:

```text
read snapshot
→ validate update
→ construct new state
→ validate invariants
→ publish
```

This can avoid exposing partially mutated structures to readers.

For mutable in-place structures, rollback or exception-safety requirements become more important.

## 20. Exception Safety

A mutation should not leave the trie corrupted if an operation fails midway.

Potential failure points include:

- allocation failure
- comparator/tokenizer errors
- metadata update errors
- serialization errors
- user callbacks

Useful guarantees include:

- basic guarantee: structure remains valid
- strong guarantee: operation appears atomic
- no-throw operations where practical

## 21. Persistent Mutation

Immutable tries handle mutation by creating a new root and sharing untouched nodes.

Deletion then copies only the affected path and rebuilds or collapses nodes along that path.

This provides stable snapshots at the cost of allocations and shared-memory management.

## 22. Copy-on-Write Engineering

A copy-on-write mutation should avoid modifying shared nodes.

Before writing a node:

```text
is node owned by this version?
    yes → mutate safely
    no  → copy node first
```

A single accidental mutation of a shared node can corrupt multiple historical snapshots.

## 23. Concurrent Read-Mostly Mutation

For read-heavy systems, a useful architecture is:

```text
Readers → immutable root
Writer  → private mutable copy
Publish → new immutable root
```

Readers never observe intermediate mutation states.

The cost is version construction and eventual reclamation of old snapshots.

## 24. Memory Reclamation

Deleting trie nodes does not necessarily mean memory is immediately reusable in every architecture.

Relevant strategies include:

- garbage collection
- reference counting
- epoch-based reclamation
- hazard pointers
- ownership-based destruction

JavaScript applications generally rely on garbage collection, but object retention can still occur through caches, closures, listeners, and stale snapshots.

## 25. JavaScript Mutation Concerns

JavaScript trie implementations should watch for:

- accidental shared object references
- mutation through aliases
- `Map` lifecycle
- retained subtree references
- large object overhead
- string allocation
- recursion depth during cleanup

For very deep tries, iterative cleanup can avoid call-stack growth.

## 26. Iterative Deletion

A stack can record the path during descent:

```text
root → child → child → target
```

After deleting the terminal state, walk the saved path backward.

This makes pruning explicit and avoids recursive call-stack limitations.

## 27. Structural Validation

After mutation, validation can check:

- key reconstruction
- terminal counts
- child references
- edge labels
- no forbidden unary nodes after compression
- cached metadata
- root invariants

Validation can be enabled aggressively in tests and selectively in development builds.

## 28. Differential Testing

Maintain a simple reference model:

```js
const reference = new Map();
```

Apply the same operations to the trie and reference model.

Then compare:

- membership
- values
- key enumeration
- prefix results
- counts
- metadata

This catches subtle mutation bugs without requiring a second complex trie implementation.

## 29. Property-Based Mutation Testing

Generate random sequences such as:

```text
insert(a)
insert(ab)
delete(a)
insert(abc)
delete(ab)
insert(a)
```

After every operation, compare the trie against the reference model.

Useful properties include:

- deleting a missing key changes nothing
- inserting the same key twice obeys the documented update rule
- delete then insert restores the requested value
- key enumeration equals the reference set
- compression preserves semantics

## 30. Adversarial Mutation Workloads

Test workloads with:

- one extremely long key
- thousands of keys sharing one prefix
- repeated insert/delete of the same key
- alternating split/collapse operations
- nested prefixes
- empty keys
- Unicode keys
- large metadata payloads
- high-frequency updates to one hot prefix

These reveal allocation, latency, and fragmentation behavior that random tests may miss.

## 31. Complexity

Let `L` be the key length.

For an ordinary trie:

- lookup: `O(L)` symbol steps
- insertion: `O(L)` structural work
- deletion: `O(L)` traversal plus pruning

For a radix tree, complexity depends on:

- compressed edges visited
- characters compared
- split/merge work
- metadata propagation

A deletion that triggers a long cleanup path can still be proportional to the relevant path length.

## 32. Backend Applications

Mutation-safe tries can support:

- route configuration updates
- hierarchical authorization rules
- namespace indexes
- autocomplete dictionaries
- URL routing
- feature/configuration hierarchies
- cache-key prefix indexes

Production systems should separate the in-memory data structure from persistence, replication, authorization, and API transaction boundaries.

## 33. AI Applications

Trie mutation appears in:

- vocabulary updates
- constrained-generation dictionaries
- dynamic entity catalogs
- tool-name namespaces
- retrieval lexicons
- ranked suggestion indexes

For AI serving, immutable snapshots can be particularly useful when readers are extremely frequent and dictionary updates are comparatively rare.

## 34. Production Mutation Checklist

Before shipping a trie mutation engine, define:

1. duplicate-key semantics
2. missing-key semantics
3. empty-key semantics
4. metadata consistency rules
5. compression policy
6. atomicity guarantees
7. concurrency model
8. memory ownership
9. persistence/versioning behavior
10. observability and corruption detection

## 35. Interview Framework

For a trie deletion problem:

1. Draw the shared-prefix example.
2. Separate semantic deletion from structural pruning.
3. Define terminal-node behavior.
4. Choose recursive or iterative traversal.
5. Explain post-order cleanup.
6. Add compressed-edge collapse if needed.
7. Update cached metadata.
8. State invariants.
9. Derive complexity.
10. Test nested prefixes and delete/reinsert sequences.

## 36. Revision Checklist

- [ ] Explain why trie deletion is harder than insertion.
- [ ] Implement lazy deletion.
- [ ] Implement eager pruning.
- [ ] Handle terminal nodes with children.
- [ ] Handle the empty key.
- [ ] Implement radix edge collapse.
- [ ] Explain split/merge duality.
- [ ] Maintain cached metadata.
- [ ] Design batch mutation semantics.
- [ ] Explain transactional and persistent mutation.
- [ ] Implement iterative cleanup.
- [ ] Build a `Map` differential oracle.
- [ ] Run property-based mutation sequences.
- [ ] Benchmark adversarial workloads.

## Key Takeaways

1. Deletion should remove semantic state before reclaiming structure.
2. A terminal node may be structurally necessary even when it has children.
3. Compressed tries require safe split/merge operations.
4. Cached metadata is part of correctness, not merely an optimization.
5. Persistent snapshots provide a strong option for read-mostly workloads.
6. Differential and property-based testing are essential for mutation-heavy structures.
7. Production trie engineering is about correctness, ownership, failure safety, memory, and workload-aware performance—not just pointer manipulation.
