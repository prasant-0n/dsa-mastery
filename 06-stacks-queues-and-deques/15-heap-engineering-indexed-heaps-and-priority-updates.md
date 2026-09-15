# 06.15 — Heap Engineering: Indexed Heaps, Priority Updates & Production Scheduling

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter goes beyond basic heap operations. The goal is to engineer priority queues that support identity, priority mutation, cancellation, deterministic ordering, lazy deletion, indexed lookup, bounded capacity, and production scheduling semantics.

## 1. Learning Objectives

You will learn to:

- distinguish heap position from item identity;
- understand why arbitrary priority updates are difficult in a plain heap;
- build indexed heaps with an item-to-index map;
- implement decrease-key/increase-key safely;
- design arbitrary deletion;
- understand lazy deletion and stale entries;
- reason about composite priorities and deterministic ties;
- build bounded priority queues;
- compare eager and lazy maintenance;
- design deadline/retry schedulers;
- analyze memory and operational behavior;
- connect heaps to Dijkstra, A*, backend scheduling, and AI serving.

---

## 2. The Core Problem: Heap Position Is Not Identity

A heap array might contain:

```text
index 0 → job-A
index 1 → job-C
index 2 → job-B
```

After swaps, the same job can move to another index.

Therefore:

```text
item identity ≠ heap index
```

If the application needs to update or cancel a specific item efficiently, it needs an additional identity-to-position mechanism.

---

## 3. Plain Heap Capabilities

A normal binary heap efficiently supports:

```text
peek extremum → O(1)
insert        → O(log N)
extract       → O(log N)
```

But:

```text
find arbitrary item → O(N)
remove arbitrary item → O(N) search + O(log N)
```

For a scheduler with frequent cancellation, that may be unacceptable.

---

## 4. Indexed Heap

An indexed heap adds:

```text
heap array
position map
```

Conceptually:

```text
heap[index] = item
position[item.id] = index
```

When two heap elements swap, update both positions.

This changes arbitrary lookup from O(N) to expected O(1), making targeted updates/removal O(log N).

---

## 5. Identity Contract

Indexed structures require stable identity.

Good identities are:

```text
unique job ID
request ID
node ID
record ID
```

Do not use mutable object contents as identity unless their mutation semantics are tightly controlled.

The position map should remain consistent with the heap after every mutation.

---

## 6. Indexed Heap Invariant

For every heap index `i`:

```text
position[heap[i].id] === i
```

And for every non-root node:

```text
better(heap[parent(i)], heap[i]) === true
```

A correct indexed heap must maintain **both** invariants.

---

## 7. Swap Is a Critical Primitive

A heap swap is no longer simply:

```text
swap(heap[i], heap[j])
```

It must also update:

```text
position[heap[i].id]
position[heap[j].id]
```

Centralizing swaps prevents synchronization bugs.

---

## 8. Decrease-Key

For a min-heap, decreasing an item's priority may make it better than its parent.

Therefore:

```text
update priority
sift up
```

Complexity:

```text
O(log N)
```

The position map lets us locate the item first.

---

## 9. Increase-Key

For a min-heap, increasing priority may make an item worse than one or both children.

Therefore:

```text
update priority
sift down
```

Again:

```text
O(log N)
```

The direction of repair follows the direction of invariant violation.

---

## 10. Generic Priority Update

If the new priority is unknown relative to the old priority, compare them:

```text
new better than old → sift up
new worse than old  → sift down
```

If priority equality changes only tie-breaking fields, the repair direction must follow the complete comparator, not just the primary priority field.

---

## 11. Arbitrary Removal

To remove item at index `i`:

```text
swap with last
remove last
repair heap
remove identity from position map
```

After replacement, the new item may need:

```text
sift up
```

or:

```text
sift down
```

depending on its relationship to its parent and children.

---

## 12. Why Repair Direction Matters

Suppose replacement item violates the parent relation.

Sift down alone may not fix it.

Suppose it violates child relations.

Sift up alone may not fix it.

A safe generic deletion algorithm checks the local relationships and selects the necessary repair direction.

---

## 13. Lazy Deletion

An alternative is to avoid arbitrary physical removal.

Mark an item cancelled or outdated:

```text
active[id] = false
```

Leave the heap entry in place.

When it reaches the root:

```text
while root is stale
    extract root
```

This is called lazy deletion.

---

## 14. Eager vs Lazy Removal

### Eager

Immediately repair the heap.

Advantages:

```text
memory remains bounded more tightly
heap contains only active entries
```

Costs:

```text
requires indexed identity or search
more mutation bookkeeping
```

### Lazy

Mark stale and clean later.

Advantages:

```text
simple updates
simple cancellation
```

Costs:

```text
stale memory
extra root cleanup
possible heap growth
```

Choose based on workload and resource constraints.

---

## 15. Versioned Entries

A powerful lazy strategy is:

```text
job A version 1
job A version 2
```

Only the newest version is valid.

Store:

```text
id
version
priority
```

When extracted, compare the entry version with the current job version.

This is useful for repeated priority updates and scheduling.

---

## 16. Stale-State Correctness

Lazy deletion is correct only if stale entries can never be interpreted as active work.

The root-processing contract should be:

```text
while heap not empty
    entry = peek
    if stale(entry)
        extract
        continue
    process entry
```

The stale predicate is part of the correctness proof.

---

## 17. Composite Priority

Real systems rarely have one scalar priority.

A scheduler may need:

```text
priority
↓
deadline
↓
arrival sequence
```

Represent this as a lexicographic comparator.

Example:

```text
higher priority first
then earlier deadline
then earlier sequence
```

This gives deterministic ordering.

---

## 18. Deterministic Tie-Breaking

Without explicit tie-breaking, equal-priority jobs may be returned in implementation-dependent order.

If reproducibility matters, assign:

```text
sequence = monotonically increasing counter
```

Then compare:

```text
priority → deadline → sequence
```

This is valuable for debugging, testing, and fair scheduling.

---

## 19. Bounded Priority Queue

A bounded heap has:

```text
maximum size K
```

When full, define an admission policy.

Examples:

```text
reject lowest-value work
replace current worst item
reject all new work
```

The correct policy depends on whether the queue represents work, cache candidates, search states, or user requests.

---

## 20. Top-K as a Bounded Heap

For top-K largest values:

```text
use a min-heap of size K
```

If the new value exceeds the root:

```text
extract root
insert new value
```

The root represents the current cutoff.

This gives O(N log K) time and O(K) auxiliary space.

---

## 21. K-th Element Insight

The root of a size-K bounded heap can represent a boundary.

For K largest values using a min-heap:

```text
root = smallest among retained K
```

This is often more useful than fully sorting the dataset.

---

## 22. Scheduler Cancellation

Suppose a user cancels job `J42`.

A production scheduler can use:

```text
indexed heap → remove J42 in O(log N)
```

or:

```text
lazy cancellation → mark J42 cancelled
```

The right choice depends on cancellation frequency and memory limits.

---

## 23. Delayed Retry Scheduling

Represent a retry with:

```text
nextRunAt
attempt
jobId
sequence
```

Use a min-heap ordered by:

```text
nextRunAt
```

The root is the next candidate to inspect.

This provides efficient selection of the next scheduled item.

---

## 24. Retry Backoff

A common model is exponential backoff:

```text
delay = base * 2^attempt
```

with a maximum cap and usually jitter.

The heap stores the resulting absolute time:

```text
nextRunAt = now + delay
```

The heap itself does not implement backoff; it stores the scheduling result.

---

## 25. Deadline Scheduling

For earliest-deadline-first:

```text
smaller deadline → higher priority
```

But production systems may combine deadline with:

```text
priority
age
tenant fairness
estimated cost
```

A heap implements the chosen comparator, not fairness automatically.

---

## 26. Starvation

Strict priority can starve low-priority work.

Possible mitigation:

```text
aging
weighted scheduling
priority ceilings
separate quotas
maximum wait time
```

Aging can dynamically increase effective priority as waiting time grows.

This is a policy problem built on top of the heap.

---

## 27. Multi-Tenant Scheduling

A single global heap may favor a noisy tenant if tenant jobs continuously receive high priority.

Possible architecture:

```text
tenant queues
      ↓
fair scheduler
      ↓
worker pool
```

The scheduler may itself use a heap to select among eligible tenant queues.

This demonstrates hierarchical scheduling.

---

## 28. Dijkstra with Lazy Heap Entries

A common shortest-path implementation pushes a new `(distance, vertex)` entry whenever a shorter path is found.

The heap may contain old distances.

When extracted:

```text
if entry.distance !== dist[vertex]
    skip
```

This avoids requiring a decrease-key operation and is often simpler in practice.

---

## 29. Indexed Heap vs Lazy Heap in Graph Algorithms

### Indexed

Supports explicit decrease-key.

### Lazy

Push improved distance and ignore stale entries later.

Both can be correct.

The engineering choice depends on:

```text
implementation complexity
number of updates
memory overhead
runtime behavior
```

Do not assume one strategy is universally superior.

---

## 30. AI Search

Best-first and A* maintain a priority frontier.

States may receive improved scores after discovery.

Lazy versioning is often convenient:

```text
state S version 1
state S version 2
```

Only the current version is expanded.

This prevents expensive arbitrary heap deletion.

---

## 31. Beam Search with Bounded Heaps

A beam has fixed width:

```text
beamWidth = K
```

A bounded heap can maintain the best K candidates.

The challenge is not merely maintaining K items; it is defining the score, tie-breaking, diversity policy, and whether pruning can remove a globally useful path.

---

## 32. Heap Memory Engineering

Heap memory includes:

```text
array storage
object payloads
identity map
version metadata
stale entries
```

Lazy strategies can consume significantly more memory than the logical active workload.

Measure both:

```text
active items
physical heap entries
```

---

## 33. Capacity as a Correctness Boundary

For production schedulers, capacity is not merely optimization.

When full, the system must define what happens.

Possible policies:

```text
reject
shed
spill
replace
block producer
```

Each policy changes observable behavior and therefore belongs in the system contract.

---

## 34. Observability

Track:

```text
heap size
active item count
stale item count
maximum depth
wait time
execution latency
rejections
cancellations
priority distribution
```

A growing stale-entry ratio is an operational signal that lazy maintenance may need tuning.

---

## 35. Correctness Testing

For indexed heaps, test after every mutation:

```text
heap order invariant
position-map invariant
identity uniqueness
size consistency
```

For lazy heaps, additionally verify:

```text
stale entries are never executed
```

---

## 36. Differential Testing

Build a simple reference scheduler using a sorted array for small inputs.

Then generate random operations:

```text
insert
extract
update
cancel
peek
```

Compare the production heap against the reference after each operation.

This catches mutation bugs that hand-written examples often miss.

---

## 37. Benchmarking

Benchmark separate workloads:

```text
insert-heavy
extract-heavy
mixed
update-heavy
cancel-heavy
stale-heavy
bounded top-K
```

Do not compare indexed and lazy heaps only by raw operation speed. Include:

```text
memory
GC pressure
stale cleanup
implementation complexity
```

---

## 38. Production Design Checklist

Before shipping a priority scheduler, define:

```text
priority semantics
identity
capacity
ordering ties
cancellation
priority updates
stale entries
retry policy
fairness
starvation policy
durability
shutdown
observability
```

Only then choose indexed or lazy heap maintenance.

---

## 39. Interview Framework

Explain advanced heap design in this order:

```text
1. State the priority contract.
2. State the heap invariant.
3. Explain identity vs position.
4. Explain indexed lookup if needed.
5. Explain priority update direction.
6. Explain arbitrary removal.
7. Compare eager vs lazy deletion.
8. Explain stale-state correctness.
9. Analyze complexity.
10. Analyze memory.
11. Discuss fairness and cancellation.
12. Connect to production workloads.
```

---

## 40. Revision Checklist

- [ ] I understand item identity vs heap position.
- [ ] I can design an indexed heap.
- [ ] I can maintain a position map during swaps.
- [ ] I can implement decrease-key and increase-key.
- [ ] I can remove an arbitrary indexed item.
- [ ] I understand lazy deletion.
- [ ] I understand versioned stale entries.
- [ ] I can design composite priority comparators.
- [ ] I understand deterministic tie-breaking.
- [ ] I can build bounded top-K heaps.
- [ ] I understand retry/deadline scheduling.
- [ ] I can compare indexed and lazy heap strategies.
- [ ] I understand starvation and fairness concerns.
- [ ] I can validate heap and index invariants.
- [ ] I can design a production priority scheduler.

---

## 41. Key Takeaways

1. A heap index is not stable identity.
2. Indexed heaps add an identity-to-position map for efficient targeted updates and deletion.
3. Priority updates require repair in the direction of invariant violation.
4. Lazy deletion trades immediate cleanup for simpler updates.
5. Versioning makes stale-entry handling explicit and testable.
6. Composite comparators turn business scheduling rules into deterministic ordering.
7. Bounded heaps are fundamental for top-K and beam-style workloads.
8. Dijkstra and AI search often benefit from lazy heap entries rather than explicit decrease-key.
9. Priority queues do not automatically provide fairness, starvation prevention, or durability.
10. Production heap engineering is the combination of ordering semantics, invariants, complexity, memory, and operational policy.
