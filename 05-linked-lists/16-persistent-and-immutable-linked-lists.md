# 05.16 — Persistent & Immutable Linked Lists

## Purpose

A **persistent linked list** preserves previous versions when a new version is created. An **immutable linked list** does not mutate existing nodes after construction.

The central technique is **structural sharing**: reuse unchanged nodes instead of copying the entire structure.

---

## 1. Mutable vs Immutable

Mutable list:

```text
A → B → C
```

An operation may change `B.next` or other links.

Immutable list:

```text
A → B → C
```

Existing nodes are never modified.

A new version must be constructed from new nodes plus safely shared old nodes.

---

## 2. Persistence

Suppose:

```text
L1 = A → B → C
```

Prepending `X` can produce:

```text
L2 = X → A → B → C
```

`L1` remains valid and shares `A → B → C` with `L2`.

Only the new prefix node was allocated.

---

## 3. Structural Sharing

Structural sharing means two versions reference the same immutable suffix:

```text
L1 ─────→ A → B → C
          ↑
L2 → X ───┘
```

This can dramatically reduce copying when updates affect only a small portion of a structure.

---

## 4. Why Mutation Breaks Sharing

If `L1` and `L2` share nodes and code later mutates a shared node:

```text
L1 ─→ A → B → C
L2 ─→ X → A → B → C
```

changing `B.next` affects both versions.

Therefore structural sharing requires shared nodes to obey immutability.

---

## 5. Persistent Prepend

Prepending is naturally persistent:

```js
function prepend(head, value) {
    return { value, next: head };
}
```

Time:

```text
O(1)
```

New allocation:

```text
1 node
```

The old list remains untouched.

---

## 6. Persistent Tail Operations

Removing the head is also naturally persistent:

```text
L1 = A → B → C
L2 = B → C
```

No nodes need to be copied.

The new version simply points at the old suffix.

---

## 7. Why Append Is Different

Appending to a singly linked immutable list generally requires copying the path from the head to the changed position:

```text
A → B → C
```

Append `D`:

```text
A' → B' → C' → D
```

The original nodes cannot be modified, so the prefix must be rebuilt.

Cost:

```text
O(N) time
O(N) new nodes
```

---

## 8. Persistent Update at Index

Updating index `i` generally copies the path from the root to `i` and shares the suffix after the changed node.

For:

```text
A → B → C → D
```

updating `C` gives:

```text
A' → B' → C' → D
```

where `D` can be shared.

Cost is proportional to the depth of the changed position.

---

## 9. Full Copy vs Structural Sharing

| Strategy | Time | New Nodes | Old Version Preserved |
|---|---:|---:|---|
| Mutable update | O(1) | 0 | No |
| Full copy | O(N) | O(N) | Yes |
| Persistent local update | O(depth) | O(depth) | Yes |

Structural sharing is useful when versions overlap heavily.

---

## 10. Referential Identity

Persistence changes how identity should be interpreted.

Two versions may intentionally share the same node objects.

Therefore:

```text
same node identity ≠ same list version
```

A node can belong to multiple immutable versions safely because its links are never mutated.

---

## 11. Aliasing Becomes Safe Under Immutability

Aliasing is normally dangerous in mutable structures.

With immutable nodes, sharing becomes an intentional feature:

```text
Version A ─┐
           ├→ shared suffix
Version B ─┘
```

The shared suffix cannot be corrupted by either version.

---

## 12. Garbage Collection

Persistent versions keep shared nodes reachable.

If an old version remains referenced, its reachable suffix remains live.

Therefore persistence trades mutation complexity for potentially longer object lifetimes.

Discarding an obsolete root allows unreachable portions to become collectible according to the runtime's garbage-collection rules.

---

## 13. Version Graph

Persistent structures are better modeled as a graph of versions than as independent lists:

```text
       L1
       ↓
A → B → C
     ↑
L2 → D
```

Multiple roots can reference overlapping structure.

This is one reason ownership and reachability analysis remain important.

---

## 14. Persistent Stack

A singly linked immutable list is an excellent persistent stack.

Operations:

```text
push: O(1)
pop:  O(1)
peek: O(1)
```

Every version remains available as a root.

Example:

```text
S0 = []
S1 = A
S2 = B → A
S3 = C → B → A
```

`S1` and `S2` remain valid after creating `S3`.

---

## 15. Why Persistent Queues Are Harder

A singly linked persistent queue wants efficient operations at both ends.

Naive append can cost O(N).

Persistent queues therefore often use more sophisticated representations, such as two lists:

```text
front + reversed-back
```

with amortized reasoning.

This connects persistence to amortized analysis and functional data structures.

---

## 16. Lazy Evaluation Considerations

In lazy systems, persistent lists may represent potentially unbounded sequences.

This introduces additional concerns:

- delayed computation;
- memoization;
- retained closures;
- accidental retention of prefixes;
- non-obvious memory growth.

The data-structure model must therefore include evaluation strategy.

---

## 17. JavaScript Implementation Style

A simple immutable node can use a frozen object:

```js
function node(value, next) {
    return Object.freeze({ value, next });
}
```

However, `Object.freeze` has runtime implications and is not automatically the best production strategy.

The important semantic rule is that application code must not mutate shared nodes.

---

## 18. Persistent API Design

Prefer operations that return a new root:

```text
insert(head, value) → newHead
remove(head, index) → newHead
update(head, index, value) → newHead
```

Avoid APIs whose semantics imply in-place mutation.

Clear naming reduces accidental misuse.

---

## 19. Correctness Invariants

For immutable lists:

1. Existing nodes are never modified.
2. Every new node points only to a valid immutable node or null.
3. Every old root remains traversable.
4. Shared suffixes remain unchanged.
5. Each version has a stable root reference.

---

## 20. Backend Applications

Persistence can be useful for:

- configuration snapshots;
- immutable request-processing states;
- audit/version histories;
- rollback-friendly workflows;
- rule evaluation;
- authorization policy versions;
- concurrent read-heavy structures.

It is usually inappropriate to force a persistent list into a workload that fundamentally needs high-frequency in-place mutation.

---

## 21. AI Applications

Persistent structures can represent branching state spaces:

```text
initial state
├── action A → state A
├── action B → state B
└── action C → state C
```

Each branch can share the unchanged history.

This is useful conceptually for:

- search trees;
- planning states;
- beam candidates;
- program transformations;
- versioned reasoning states.

---

## 22. Persistence vs Copy-on-Write

These ideas overlap but are not identical.

**Persistence** means previous versions remain accessible.

**Copy-on-write** means shared data is copied only when mutation would otherwise affect another owner.

A copy-on-write system can provide version-like behavior while still exposing mutable interfaces.

---

## 23. Partial Persistence

A structure is **partially persistent** when old versions can be read but updates are applied only to the newest version.

Full persistence allows updates to multiple historical versions.

These are different capability models.

---

## 24. Complexity Must Include Allocation

For persistent structures, report more than traversal complexity.

Include:

```text
operation time
new nodes allocated
shared nodes
retained versions
GC implications
```

An O(N) algorithm with tiny constant allocation can behave differently from an O(log N) algorithm with substantial object churn.

---

## 25. Common Mistakes

1. Mutating a node that is shared between versions.
2. Confusing a new root with a deep copy.
3. Assuming append is O(1) in a singly persistent list.
4. Ignoring retained historical roots.
5. Treating node identity as version identity.
6. Reporting only Big-O and ignoring allocations.
7. Using persistence where mutable state is clearly superior.
8. Accidentally capturing large structures through closures.

---

## 26. Design Framework

```text
1. Identify which versions must remain accessible.
2. Identify which operations are frequent.
3. Determine which paths can be structurally shared.
4. Make shared nodes immutable.
5. Define root/version ownership.
6. Calculate new-node allocation per operation.
7. Analyze retained memory.
8. Test structural sharing explicitly.
9. Compare against mutable and copy-based alternatives.
10. Benchmark the real workload.
```

---

## Revision Checklist

- [ ] Explain immutability.
- [ ] Explain persistence.
- [ ] Explain structural sharing.
- [ ] Implement persistent prepend.
- [ ] Explain why append costs O(N).
- [ ] Analyze persistent indexed update.
- [ ] Explain aliasing under immutability.
- [ ] Explain version roots and reachability.
- [ ] Analyze GC implications.
- [ ] Design a persistent stack.
- [ ] Explain persistent queue challenges.
- [ ] Distinguish persistence and copy-on-write.
- [ ] Distinguish partial and full persistence.
- [ ] Apply persistent structures to backend and AI state management.

# Key Takeaways

1. Persistence preserves previous versions instead of overwriting them.
2. Structural sharing avoids copying unchanged nodes.
3. Immutable shared nodes make aliasing safe.
4. Prepend and head removal are naturally O(1).
5. Append and indexed updates require path copying in a simple singly linked representation.
6. Historical roots can keep shared memory alive.
7. Persistent stacks are a classic and efficient application.
8. Versioned and branching AI states can benefit from structural sharing.
9. Allocation and retention are first-class parts of persistent-structure complexity.
10. Choose persistence because its semantic and workload benefits justify its allocation and API costs.
