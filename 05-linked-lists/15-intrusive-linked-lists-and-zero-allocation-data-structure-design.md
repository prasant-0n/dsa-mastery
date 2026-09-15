# 05.15 — Intrusive Linked Lists & Zero-Allocation Data-Structure Design

## Purpose

An **intrusive linked list** stores linkage fields inside the object being linked instead of allocating a separate wrapper node.

The key idea is:

> The object is the payload and the node at the same time.

This chapter develops the trade-offs between wrapper-based lists, intrusive lists, allocation behavior, ownership, and high-performance systems design.

---

## 1. Normal Linked List vs Intrusive List

A normal design often looks like:

```text
ListNode { value, next }
```

The payload is wrapped by a node.

An intrusive design embeds linkage into the payload:

```text
Task {
    id
    priority
    next
}
```

The `Task` itself participates in the list.

---

## 2. Why Intrusive Structures Exist

Intrusive structures can reduce:

- wrapper allocations;
- indirection;
- object count;
- bookkeeping overhead.

They can also provide stable object identity because the object already exists independently of the list.

The trade-off is tighter coupling between the payload type and the data structure.

---

## 3. Basic Intrusive Node

Conceptually:

```js
const task = {
    id: 1,
    next: null
};
```

The list stores references to tasks directly.

```text
HEAD → task1 → task2 → task3
```

There is no separate wrapper node for each task.

---

## 4. Ownership Contract

An intrusive node must define who controls its linkage fields.

Questions include:

- Can an object belong to multiple lists?
- Can callers modify `next` directly?
- Is the object allowed to be detached while still referenced elsewhere?
- Who clears linkage after removal?

Without a clear contract, intrusive lists become easy to corrupt.

---

## 5. One Membership Field Means One List

If an object has only:

```text
next
prev
```

those fields can represent membership in only one linked structure at a time.

Trying to place the same object into two lists with the same linkage fields overwrites the first membership relationship.

This is a fundamental limitation.

---

## 6. Multiple Intrusive Links

An object can participate in multiple structures by having separate link fields:

```js
{
    nextReady,
    prevReady,
    nextPriority,
    prevPriority
}
```

Each pair represents an independent membership relationship.

This technique is common in specialized systems programming.

---

## 7. Container Metadata

A list should usually maintain:

```text
head
tail
size
```

when the API needs those operations efficiently.

The payload's embedded pointers describe local relationships; container metadata describes global structure.

---

## 8. O(1) Known-Node Removal

With a doubly intrusive list and a known node:

```text
previous ⇄ node ⇄ next
```

removal can be O(1):

```text
previous.next = next
next.prev = previous
```

No wrapper lookup is necessary.

---

## 9. Location Still Matters

Intrusive does not magically make search O(1).

Finding a node by value can still require:

```text
O(N)
```

The O(1) benefit applies after the required node/reference is already known.

---

## 10. Zero-Allocation Operation

A **zero-allocation operation** means the operation does not allocate new objects during its critical path.

For example, moving an existing intrusive node within a doubly linked list can require only pointer updates.

But zero allocation does not mean zero cost.

The operation can still consume CPU time, memory bandwidth, and synchronization resources.

---

## 11. Zero Allocation Is Contextual

An operation may be allocation-free in one implementation and allocating in another.

For example:

```text
pointer mutation → no new node
array conversion → allocates array
iterator creation → may allocate depending on implementation
```

Therefore always define what exactly is included in the measured operation.

---

## 12. Allocation-Free Does Not Mean Garbage-Free

If an operation uses existing nodes but temporarily creates other objects, it is not allocation-free overall.

Examples include:

- temporary arrays;
- closures;
- iterator objects;
- wrapper results;
- copied strings.

Performance claims should specify the allocation boundary.

---

## 13. Intrusive LRU

An LRU cache can combine:

```text
Map<key, entry>
+
intrusive doubly linked list
```

Each entry contains its own `prev` and `next` fields.

The map finds entries in expected O(1), while the list maintains recency in O(1).

This avoids a separate list-node wrapper.

---

## 14. Multiple Ordered Views

An object may need several simultaneous orderings:

```text
Task
 ├── ready-list links
 ├── timeout-list links
 └── priority-list links
```

This is a powerful but complex design.

Each linkage set must have its own invariants and membership state.

---

## 15. Membership Flags

A robust intrusive structure may track membership explicitly:

```text
inReadyQueue
inTimeoutList
```

or use sentinel/link-state conventions.

This can prevent accidental double insertion or removal from the wrong list.

---

## 16. Sentinel-Based Intrusive List

A circular sentinel list can eliminate null boundary cases:

```text
S ⇄ A ⇄ B ⇄ C ⇄ S
```

Insertion and removal can use the same local pointer operations for head, middle, and tail positions.

This is particularly attractive for low-level intrusive implementations.

---

## 17. Detach Operation

A safe detach should define the postcondition.

Possible contract:

```text
node.prev = null
node.next = null
```

This clearly marks the node as detached.

Another design may preserve links for specialized operations.

The important point is that the behavior is intentional and documented.

---

## 18. Double Insertion Hazard

If a node already belongs to a list and is inserted again without detaching it first, the structure may develop:

- cycles;
- lost nodes;
- inconsistent size;
- broken head/tail references.

Therefore insertion should either reject already-linked nodes or explicitly support move semantics.

---

## 19. Move vs Insert

These are different operations.

### Insert

Assumes the node is detached.

### Move

Removes the node from its current position and attaches it elsewhere.

A move operation can be O(1) when the node and destination are known.

---

## 20. Intrusive vs Non-Intrusive Trade-Off

| Property | Intrusive | Wrapper-based |
|---|---|---|
| Wrapper allocation | none | typically one per element |
| Coupling | high | lower |
| Multiple memberships | extra link fields required | naturally easier |
| Stable payload identity | strong | payload and wrapper differ |
| Generic containers | less convenient | easier |
| Allocation pressure | potentially lower | potentially higher |
| API safety | harder | easier to encapsulate |

---

## 21. JavaScript Considerations

JavaScript does not expose raw memory addresses in ordinary application code.

Therefore “intrusive” in JavaScript means embedding linkage properties into application objects, not manually placing fields at fixed memory addresses.

Also, object allocation and garbage collection are runtime-managed.

Do not assume an intrusive object automatically receives C/C++-style memory-layout benefits.

---

## 22. Hidden Runtime Costs

JavaScript engines may optimize object layouts and property access, but implementation details can change.

A production claim such as:

> “Intrusive lists are always faster.”

is unjustified.

Benchmark the actual workload and runtime.

---

## 23. Stable Identity

Intrusive structures are attractive when the payload object already has identity:

```text
Task object
Connection object
Cache entry
Job object
```

The list changes the object's membership without replacing the object.

This can simplify coordination between indexes and ordering structures.

---

## 24. Backend Applications

Intrusive-list concepts are useful for:

- LRU/MRU caches;
- task schedulers;
- connection registries;
- timeout lists;
- eviction queues;
- resource tracking;
- event-loop-adjacent structures;
- high-throughput in-memory pipelines.

In distributed systems, external brokers still handle durability and cross-process coordination; an intrusive list is an in-process structure.

---

## 25. AI Applications

Intrusive structures can be useful when an AI service maintains objects that need multiple local orderings, such as:

- candidate states;
- inference jobs;
- timeout tracking;
- eviction candidates;
- bounded work queues.

The technique is most relevant to control-plane metadata, not large tensor storage.

---

## 26. Testing Intrusive Structures

Tests should validate both:

### Payload correctness

```text
value/id unchanged
```

### Structural correctness

```text
prev.next === node
next.prev === node
head/tail correct
size correct
```

Also test:

- double insertion;
- removing unknown nodes;
- removing the only node;
- moving head/tail;
- repeated detach/attach;
- multiple membership fields.

---

## 27. Invariant Set

For a non-sentinel doubly linked intrusive list:

```text
head.prev === null
tail.next === null
```

For every node:

```text
node.next === null || node.next.prev === node
node.prev === null || node.prev.next === node
```

And:

```text
reachable node count === size
```

These invariants are more important than implementation style.

---

## 28. Performance Model

A useful comparison includes:

```text
allocation count
pointer dereferences
search cost
mutation cost
memory overhead
cache behavior
GC pressure
API complexity
```

This is a better engineering model than simply comparing Big-O labels.

---

## 29. Common Mistakes

1. Thinking intrusive means automatically faster.
2. Inserting the same node into multiple lists with one link set.
3. Forgetting to detach before moving.
4. Corrupting prev/next symmetry.
5. Updating links but forgetting container metadata.
6. Confusing known-node O(1) removal with value-search complexity.
7. Assuming zero allocation means zero runtime cost.
8. Ignoring API coupling.
9. Treating JavaScript intrusive structures as manually controlled raw memory.
10. Optimizing before measuring.

---

## 30. Design Procedure

```text
1. Identify whether wrapper allocation is a real bottleneck.
2. Determine whether payload objects already have stable identity.
3. Define ownership and membership rules.
4. Decide whether one or multiple list memberships are required.
5. Choose singly/doubly and sentinel/non-sentinel representation.
6. Define insert, remove, detach, and move contracts.
7. Define invariants.
8. Add defensive membership checks.
9. Benchmark allocation and traversal behavior.
10. Keep the design only if its complexity is justified.
```

---

## 31. Revision Checklist

- [ ] Explain intrusive vs wrapper-based lists.
- [ ] Explain why intrusive structures can reduce wrapper allocations.
- [ ] Explain the ownership trade-off.
- [ ] Explain why one link set cannot represent two memberships safely.
- [ ] Design multiple intrusive link sets.
- [ ] Implement O(1) known-node removal.
- [ ] Distinguish insertion from move.
- [ ] Explain zero-allocation vs zero-cost.
- [ ] Explain sentinel-based intrusive lists.
- [ ] Design an intrusive LRU.
- [ ] Define structural invariants.
- [ ] Explain JavaScript-specific limitations.
- [ ] Compare allocation, locality, and API complexity.

# Key Takeaways

1. Intrusive lists embed linkage into the payload object.
2. They can reduce wrapper allocations and preserve payload identity.
3. The price is stronger coupling and more complex ownership rules.
4. A single link set generally gives one list membership at a time.
5. Multiple memberships require separate link fields.
6. Known-node removal can be O(1), but searching for the node is still O(N) when no index exists.
7. Zero allocation does not mean zero CPU or memory cost.
8. JavaScript intrusive structures are logical object-level designs, not manual raw-memory layouts.
9. Intrusive structures are especially useful for specialized in-memory backend data structures.
10. Measure before adopting a more complex performance-oriented design.
