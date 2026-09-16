# 13.04 — Delete & Structural Cleanup

## Objective

Master trie deletion without damaging keys that share prefixes. The central engineering problem is deciding which nodes are logically unnecessary after removing a key and safely reclaiming only those nodes.

## 1. Why Deletion Is Harder Than Insert

Insertion creates or reuses a path. Deletion must determine whether each node on that path is still required by another key.

Consider:

```text
car
card
care
```

Deleting `card` must preserve `car` and `care`.

## 2. Logical Deletion vs Physical Cleanup

Deletion has two distinct operations:

```text
logical deletion → remove terminal status
physical cleanup → remove unnecessary nodes
```

Separating these ideas makes correctness easier to reason about.

## 3. Basic Delete Algorithm

For key `cat`:

```text
find path root → c → a → t
unmark t as terminal
walk backward
remove a node only if:
  - it is not terminal
  - it has no children
stop otherwise
```

## 4. Why Terminal State Matters

If `app` and `apple` exist, deleting `app` must only clear terminal state at `app`. Its nodes remain because `apple` still uses them.

## 5. Deleting a Leaf Key

If the deleted key has no descendants and is not a prefix of another key, its final nodes can be removed until reaching a node that remains needed.

## 6. Deleting a Prefix Key

For:

```text
app
apple
```

deleting `app` must preserve the entire path for `apple`.

## 7. Deleting a Longer Key

For:

```text
app
apple
```

deleting `apple` can remove `e`, `l`, `p` nodes as long as those nodes have no other children and are not terminal.

The `app` node must remain terminal.

## 8. Deleting a Missing Key

Deleting a key that does not exist should follow the documented contract. Usually it is a no-op or returns a boolean indicating whether anything was removed.

It must not modify unrelated structure.

## 9. Backward Cleanup

Cleanup naturally works from the final symbol toward the root because necessity depends on descendants.

## 10. Path Recording

An iterative implementation can record:

```text
(parent node, symbol, child node)
```

for each transition. This makes backward cleanup explicit.

## 11. Recursive Deletion

A recursive implementation can return whether the current node became unnecessary. This can make the dependency between child cleanup and parent cleanup explicit.

## 12. Deletion Complexity

For key length `L` and child lookup cost `C(B)`:

```text
search path = O(L · C(B))
cleanup     = O(L · C(B))
```

Therefore total deletion is generally `O(L · C(B))`.

With constant-time child access, this is `O(L)`.

## 13. Space Complexity

Iterative deletion may use `O(L)` auxiliary space if the path is stored. Recursive deletion also uses `O(L)` call-stack space in the worst case.

A carefully designed iterative algorithm can avoid recursion-related stack limits.

## 14. Cleanup Predicate

A node is normally removable when:

```text
!node.isTerminal
AND node has zero children
```

This is the fundamental cleanup predicate for a mutable standard trie.

## 15. Root Exception

The root normally remains allocated even when the trie becomes empty. It represents the empty prefix and is the stable entry point for all operations.

## 16. Empty Key Deletion

If empty keys are supported, deleting the empty key clears root terminal state. The root itself must not be removed.

## 17. Duplicate Inserts and Delete Semantics

If duplicate insertion increments a frequency, deletion must define whether it:

```text
removes one occurrence
or
removes the complete logical key
```

The data model determines the algorithm.

## 18. Value Deletion

If terminal nodes store values, deleting a key must define whether the payload is cleared together with terminal state and whether external references remain valid.

## 19. Metadata Cleanup

Prefix metadata may require additional maintenance. For example, if a node stores the number of descendant keys, deletion must update that metadata along the entire path.

## 20. Cached Ranking Metadata

Autocomplete tries may cache top suggestions at prefix nodes. Deletion can require recomputation or invalidation of those cached rankings.

## 21. Lazy Deletion

Some systems only clear terminal state and defer physical cleanup. This can simplify mutation but may increase memory usage.

A background compaction process can reclaim dead branches.

## 22. Immediate vs Lazy Cleanup

| Strategy | Benefit | Cost |
|---|---|---|
| Immediate | memory reclaimed quickly | deletion does more work |
| Lazy | cheap mutation | stale structure consumes memory |
| Periodic | balanced | requires maintenance process |

## 23. Correctness Invariant

After deleting key `K`:

1. `K` is no longer represented as a complete key;
2. every other key remains represented;
3. every remaining node is reachable from the root;
4. no removable dead branch remains if immediate cleanup is the contract.

## 24. Proof Idea

Only nodes on the deleted key's path can become unnecessary. A node outside that path cannot lose a dependency because deletion changes no other path.

For each path node, remove it only after proving it is non-terminal and childless. Therefore no remaining key can depend on a removed node.

## 25. Structural Sharing

A node can represent a shared prefix. Never infer ownership from the fact that a node lies on the deleted key's path. The child/terminal state must determine whether other keys still depend on it.

## 26. Persistent Tries

Deletion in an immutable trie is different: nodes are not physically removed from an existing version. Instead, construct a new version that omits the key while structurally sharing unaffected nodes.

This is covered in greater depth later.

## 27. Concurrency

Concurrent readers and writers require a defined visibility model. Immediate mutation can expose intermediate states unless synchronization or immutable snapshots are used.

## 28. Exception Safety

If deletion updates metadata along the path, define what happens if a callback, allocator, or external operation fails. Prefer internal mutations that either complete consistently or preserve a valid invariant.

## 29. Common Mistakes

- deleting the entire path unconditionally;
- forgetting terminal state;
- deleting a shared prefix;
- removing the root;
- failing to clean metadata;
- confusing logical deletion with physical reclamation;
- recursively deleting extremely long keys without considering call-stack depth.

## 30. Edge Cases

Test:

- empty trie;
- missing key;
- single key;
- deleting a leaf;
- deleting a prefix key;
- deleting a longer key;
- deleting one of many siblings;
- deleting all keys;
- empty key;
- duplicate/frequency semantics;
- long keys.

## 31. Differential Testing

Use a reference `Set` or map of keys. Apply random insert/delete sequences to both systems and compare exact membership after every operation.

## 32. Property Testing

Useful properties include:

```text
insert(k); delete(k) → k absent
insert(a); delete(b) → a remains when a ≠ b
search(k) before delete == true
search(k) after delete == false
```

provided the chosen duplicate/value contract permits these statements.

## 33. Backend Applications

Deletion matters in:

- route registries;
- autocomplete dictionaries;
- permission namespaces;
- feature/configuration prefixes;
- command indexes.

## 34. AI Applications

Deletion or invalidation can remove:

- obsolete vocabulary entries;
- disabled entities;
- stale dictionary terms;
- expired constrained-decoding candidates.

## 35. Production Memory Management

Track:

```text
logical keys
physical nodes
dead nodes
cleanup work
memory reclaimed
```

This distinguishes logical deletion success from actual memory reclamation.

## 36. Benchmarking

Measure deletion under:

- leaf-heavy workloads;
- shared-prefix workloads;
- random deletion;
- delete/reinsert churn;
- lazy vs immediate cleanup.

## 37. Interview Pattern

When asked to delete from a trie, state the key invariant first:

> Remove only nodes that are neither terminal nor needed by any child.

Then explain the backward cleanup process.

## 38. Complexity Ledger

Let `L` be key length and `C(B)` child lookup cost:

```text
path traversal = O(L · C(B))
cleanup         = O(L · C(B))
auxiliary path  = O(L)
```

Do not claim `O(1)` deletion merely because the trie is tree-based.

## 39. Production Design Exercise

Design two deletion policies for a high-volume autocomplete service:

1. immediate cleanup;
2. lazy cleanup plus periodic compaction.

Specify memory, latency, consistency, and operational trade-offs.

## Revision Checklist

- [ ] I can explain why trie deletion is harder than insertion.
- [ ] I can separate logical deletion from physical cleanup.
- [ ] I can delete a leaf safely.
- [ ] I can delete a key that is a prefix of another key.
- [ ] I can delete a longer key without damaging its prefix.
- [ ] I understand the cleanup predicate.
- [ ] I can prove that shared prefixes remain safe.
- [ ] I can reason about metadata and cached rankings.
- [ ] I can compare immediate and lazy cleanup.
- [ ] I can test deletion against a reference model.

## Key Takeaways

1. **Deletion must remove a key without removing structure still required by other keys.**
2. **A node is removable only when it is non-terminal and childless under the standard mutable-trie contract.**
3. **Cleanup proceeds backward because parent necessity depends on child state.**
4. **Logical deletion, physical cleanup, metadata maintenance, and memory reclamation are separate concerns.**
5. **The strongest deletion implementations are derived from invariants and validated with differential testing.**
