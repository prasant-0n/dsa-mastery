# 12.07 — Priority Queue Variants: Min-PQ, Max-PQ, Stable & Multi-Criteria Priorities

## Objective

Priority queues differ primarily through their ordering contract. This chapter builds a precise mental model for min-priority queues, max-priority queues, stable queues, and composite multi-criteria priority policies.

## 1. Min-Priority Queue

A min-PQ returns the smallest element according to its comparator.

```text
peek → minimum
extract → minimum
```

Typical uses include earliest-deadline scheduling, shortest-path algorithms, and event simulation.

## 2. Max-Priority Queue

A max-PQ returns the largest element according to its comparator.

```text
peek → maximum
extract → maximum
```

Typical uses include highest-score selection, task urgency, and top-K processing.

## 3. Comparator Defines the Variant

A binary heap does not intrinsically know whether it is a min-heap or max-heap. The comparator defines which entry is preferred.

The data structure and ordering policy should therefore be separated conceptually.

## 4. Invariant

For every parent-child pair, the parent must be at least as preferred as its children according to the queue comparator.

This single rule supports both min and max variants.

## 5. Reversing Priority

A max-PQ can often be derived from a min-PQ by reversing the comparator. This is safer than maintaining two unrelated implementations.

## 6. Stable Priority Queue

A stable priority queue preserves insertion order among entries with equal primary priority.

Use a sequence number:

```text
(priority, sequence)
```

where lower sequence means earlier insertion under a FIFO tie policy.

## 7. Why Heaps Are Not Stable

Heap swaps can move equal-priority entries past one another. The heap invariant only constrains priority ordering, not relative order among equal keys.

## 8. Multi-Criteria Priority

Real scheduling policies often compare several fields:

```text
primary priority
→ deadline
→ fairness key
→ sequence number
```

The comparator should encode this policy explicitly.

## 9. Lexicographic Ordering

A composite comparator commonly behaves lexicographically:

1. compare criterion A;
2. if equal, compare criterion B;
3. continue until a difference exists;
4. if all equal, use a final deterministic tie-breaker.

## 10. Example: Job Scheduling

A job might contain:

```js
{
  priority: 10,
  deadline: 1730000000000,
  tenantWeight: 3,
  sequence: 42,
  id: "job-42"
}
```

The ordering policy decides how these fields interact.

## 11. Priority vs Deadline

Priority and deadline are not automatically interchangeable. A system may choose:

```text
highest priority first
```

or:

```text
earliest deadline first
```

or a composite policy.

The algorithm should implement the documented policy rather than invent one.

## 12. FIFO Among Equal Priorities

For FIFO stability:

```text
compare(priorityA, priorityB)
if equal:
    compare(sequenceA, sequenceB)
```

Sequence numbers must be unique and monotonic within the queue's defined scope.

## 13. LIFO Among Equal Priorities

A LIFO tie policy can reverse the sequence comparison. This can be useful in specialized workloads but should be explicit.

## 14. Deterministic Tie-Breaking

A final stable identifier can provide deterministic results when insertion order is not meaningful:

```text
priority → timestamp → ID
```

Determinism is useful for reproducible tests and debugging.

## 15. Fairness and Aging

A strict priority policy can repeatedly favor high-priority work. Aging can gradually increase the effective priority of waiting entries.

Aging changes the scheduling policy; it is not a property of the heap itself.

## 16. Weighted Fairness

For multi-tenant systems, a comparator may incorporate tenant-specific weights or use separate queues with a fair scheduler.

A single comparator is not always sufficient for strong fairness guarantees.

## 17. Deadline-Aware Scheduling

For deadline-sensitive work, a queue can prioritize the earliest deadline. A secondary priority can break equal deadlines.

## 18. Time-Based Priorities

Delayed work can use:

```text
nextRunAt
```

as the primary ordering key. The root then represents the earliest scheduled item.

## 19. Composite Comparator Cost

Each additional criterion can increase comparison work. If comparing strings, dates, or derived values is expensive, the nominal `O(log N)` queue operation may have a larger constant factor.

## 20. Precomputed Keys

If deriving a comparison key is expensive, compute it once when an entry enters the queue instead of recomputing it during every comparison when the workload allows this.

This is a time-versus-memory trade-off.

## 21. Mutable Priority Fields

Changing a priority field directly while an entry remains in the heap can invalidate ordering. Use an explicit update operation that repairs the heap.

## 22. Min-PQ Use Cases

- Dijkstra-style shortest paths;
- A* open sets;
- earliest event simulation;
- deadline scheduling;
- delayed jobs;
- minimum-cost candidate selection.

## 23. Max-PQ Use Cases

- highest-score candidates;
- urgent jobs;
- maximum-value extraction;
- ranking pipelines;
- top-K selection with appropriate heap orientation.

## 24. Backend Multi-Criteria Scheduling

A production scheduler might model:

```text
effectivePriority
→ deadline
→ tenant fairness
→ sequence
```

The scheduler must separately enforce capacity, retries, cancellation, persistence, and worker concurrency.

## 25. AI Multi-Criteria Search

A search frontier can rank nodes using:

```text
f(n) = g(n) + h(n)
```

and then apply deterministic tie-breaking such as lower depth or insertion sequence.

The priority queue supplies ordering; the search algorithm supplies semantic meaning.

## 26. Correctness of Composite Ordering

A composite comparator should be tested for consistency. If the ordering is not transitive or changes while entries remain in the queue, heap correctness assumptions can fail.

## 27. API Design

Avoid APIs such as:

```text
queue.insert(value, priorityA, priorityB, priorityC, ...)
```

when a structured entry and comparator make the policy clearer.

Prefer an explicit policy boundary.

## 28. Testing Variants

Test:

- minimum extraction;
- maximum extraction;
- equal priorities;
- sequence ordering;
- multiple criteria;
- missing fields;
- duplicate IDs;
- mutable values;
- comparator edge cases.

## 29. Reference Model

For testing, maintain a reference list sorted using the exact same semantic ordering. Compare every extraction from the heap-backed implementation with the reference model.

## 30. Complexity

For a binary-heap implementation, the standard structural costs remain:

```text
peek    O(1)
insert  O(log N)
extract O(log N)
```

Comparator work is multiplied into the practical cost.

## 31. Common Mistakes

1. Assuming min-PQ and max-PQ require separate heap algorithms.
2. Assuming equal priorities are stable.
3. Mixing priority policy with heap mechanics.
4. Mutating priority without repair.
5. Creating inconsistent composite comparators.
6. Ignoring comparator/key computation cost.

## 32. Interview Framework

When asked about priority queue variants:

```text
Define preferred entry
→ define comparator
→ choose heap orientation
→ define ties
→ define composite criteria
→ analyze operation cost
→ discuss updates and fairness
```

## Revision Checklist

- [ ] I can derive min-PQ and max-PQ from the comparator.
- [ ] I understand why heaps are not stable.
- [ ] I can design FIFO equal-priority behavior.
- [ ] I can build lexicographic multi-criteria ordering.
- [ ] I can reason about fairness and aging.
- [ ] I can account for comparator cost.
- [ ] I can apply variants to backend and AI systems.

## Key Takeaways

1. **Min-PQ and max-PQ are ordering policies over the same heap mechanics.**
2. **Stability must be deliberately encoded.**
3. **Multi-criteria priority is best represented by an explicit, consistent comparator.**
4. **Fairness, aging, deadlines, and capacity are scheduling policies layered around the queue.**
5. **Comparator correctness is as important as heap correctness.**
