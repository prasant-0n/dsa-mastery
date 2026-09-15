# 06.11 — Deque Fundamentals, Implementations & Double-Ended Operations

> **Phase 06 — Stacks, Queues & Deques**
>
> A deque (double-ended queue) generalizes both stacks and queues by allowing efficient operations at both ends. This chapter builds the Deque ADT from first principles, develops array, circular-buffer, and doubly linked implementations, and explains when double-ended access changes the algorithmic design.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- define the Deque ADT precisely;
- explain how a deque generalizes stacks and queues;
- design efficient front and rear operations;
- implement a deque using a circular array;
- implement a deque using a doubly linked list;
- reason about head, tail, size, and capacity invariants;
- distinguish bounded and unbounded deques;
- understand why arbitrary middle operations are different from end operations;
- use deques for BFS variants, sliding windows, scheduling, and 0-1 BFS;
- analyze complexity, memory, locality, and allocation behavior;
- choose an implementation from workload requirements.

---

# 2. What Is a Deque?

A deque is a sequence supporting insertion and removal at both ends.

Conceptually:

```text
FRONT                         REAR
  ↓                             ↓
[A] [B] [C] [D]
```

Core operations:

```text
pushFront(x)
pushBack(x)
popFront()
popBack()
peekFront()
peekBack()
```

A deque does **not** require efficient arbitrary middle insertion or deletion.

---

# 3. Why Deques Exist

A stack gives one-ended access:

```text
push/pop → same end
```

A queue gives directional access:

```text
enqueue → rear
dequeue → front
```

A deque combines both:

```text
front ↔ rear
```

This becomes valuable when an algorithm needs to choose whether new state belongs at the front or back.

---

# 4. Deque as a Generalized Structure

A deque can behave as a stack:

```text
pushBack
popBack
```

or as a queue:

```text
pushBack
popFront
```

Therefore the same representation can support multiple access policies.

This is useful, but the abstraction should still expose semantics clearly rather than forcing callers to understand implementation details.

---

# 5. Core ADT Contract

Typical operations:

```text
pushFront
pushBack
popFront
popBack
peekFront
peekBack
isEmpty
size
```

Optional operations:

```text
clear
capacity
isFull
tryPopFront
tryPopBack
```

The ADT defines behavior; the implementation determines the storage mechanism.

---

# 6. Fundamental Invariants

For a deque containing N elements:

```text
size = N
```

If non-empty:

```text
front = first logical element
rear = last logical element
```

For a bounded representation:

```text
0 ≤ size ≤ capacity
```

Every successful insertion increases size by one.

Every successful removal decreases size by one.

The logical sequence must remain unchanged except for the requested end operation.

---

# 7. Circular Array Representation

A fixed-capacity deque can use:

```text
buffer
head
size
capacity
```

Logical element at offset `i` is:

```text
(head + i) % capacity
```

The next back insertion occurs at:

```text
(head + size) % capacity
```

The next front insertion occurs at:

```text
(head - 1 + capacity) % capacity
```

This gives O(1) end operations.

---

# 8. pushBack

For a non-full circular deque:

```text
index = (head + size) % capacity
buffer[index] = value
size++
```

The logical sequence becomes:

```text
old sequence + [value]
```

No existing element needs to move.

---

# 9. pushFront

Compute:

```text
head = (head - 1 + capacity) % capacity
buffer[head] = value
size++
```

The logical sequence becomes:

```text
[value] + old sequence
```

The modulo operation handles wrap-around.

---

# 10. popFront

Read:

```text
index = head
value = buffer[index]
```

Then:

```text
buffer[index] = undefined
head = (head + 1) % capacity
size--
```

The new head identifies the next logical front.

---

# 11. popBack

The back index is:

```text
(head + size - 1) % capacity
```

Then:

```text
value = buffer[index]
buffer[index] = undefined
size--
```

`head` does not need to change.

---

# 12. Full and Empty States

With explicit size:

```text
empty ⇔ size === 0
full  ⇔ size === capacity
```

This avoids relying on head/tail equality to distinguish two states.

For a zero-capacity deque, the implementation should define whether construction is invalid or whether all insertion operations fail.

---

# 13. Bounded vs Dynamic Deque

A bounded deque has fixed capacity.

A dynamic deque can grow when full.

For dynamic circular storage, resizing requires copying elements in **logical order**:

```text
old logical sequence
→ new contiguous buffer
```

After copying:

```text
head = 0
```

The logical sequence must be preserved exactly.

---

# 14. Resizing Cost

A resize copies N live elements:

```text
O(N)
```

But geometric growth can make insertion amortized O(1), just as with dynamic arrays and queues.

The same aggregate reasoning applies:

```text
N ordinary writes + O(N) total resize copies
= O(N)
```

Therefore average insertion cost remains O(1) under an appropriate growth policy.

---

# 15. Doubly Linked Deque

A linked implementation naturally supports both ends:

```text
head ↔ A ↔ B ↔ C ↔ D ↔ tail
```

Each node stores:

```text
value
prev
next
```

With head and tail pointers:

```text
pushFront = O(1)
pushBack  = O(1)
popFront  = O(1)
popBack   = O(1)
```

---

# 16. Linked Deque Empty Transition

If the last node is removed:

```text
head = null
tail = null
```

Both endpoints must agree about emptiness.

A common structural bug is leaving one pointer attached to a removed node.

---

# 17. Linked Deque Invariants

For a non-empty deque:

```text
head.prev === null
tail.next === null
```

And for every adjacent pair:

```text
node.next.prev === node
node.prev.next === node
```

These bidirectional invariants make pointer corruption detectable.

---

# 18. Array vs Linked Deque

| Property | Circular Array | Doubly Linked |
|---|---|---|
| End operations | O(1) | O(1) |
| Allocation | contiguous | per node |
| Locality | generally strong | pointer-based |
| Dynamic growth | resize required | natural |
| Capacity | explicit | memory-limited |
| Per-element overhead | low | higher |
| Cache behavior | generally favorable | generally weaker |

As always, actual runtime behavior depends on workload and language runtime.

---

# 19. Memory Ownership

For linked nodes, ownership must be clear.

When removing a node:

```text
remove from deque
→ detach links
→ return/destroy ownership as appropriate
```

Do not accidentally keep references from external indexes if the goal is complete reclamation.

For arrays, clear consumed slots when references should no longer remain reachable through the backing storage.

---

# 20. Error Semantics

What should happen on an empty pop?

Possible policies:

```text
throw
return undefined
return null
return result object
```

For bounded insertion when full:

```text
reject
throw
return failure
overwrite opposite end
expand
```

These are API-contract decisions, not merely implementation details.

---

# 21. Deque Complexity Table

For a properly designed circular or doubly linked deque:

| Operation | Complexity |
|---|---:|
| pushFront | O(1) amortized for dynamic array / O(1) linked |
| pushBack | O(1) amortized for dynamic array / O(1) linked |
| popFront | O(1) |
| popBack | O(1) |
| peekFront | O(1) |
| peekBack | O(1) |
| search | O(N) |
| arbitrary middle access | O(N) generally |

A deque is optimized for ends, not random access.

---

# 22. Deque Is Not a Random-Access Sequence

Even if an array-backed deque internally uses an array, logical positions may wrap:

```text
physical: [C, D, _, _, A, B]
logical:  [A, B, C, D]
```

Accessing logical index `i` requires modular mapping.

If an abstraction promises random access, it should explicitly define its complexity and implementation strategy.

---

# 23. 0-1 BFS

Deque is particularly important in shortest-path problems where edge weights are only:

```text
0 or 1
```

For an edge of weight 0:

```text
pushFront(neighbor)
```

For weight 1:

```text
pushBack(neighbor)
```

The deque maintains states in nondecreasing tentative distance under the appropriate algorithmic invariant.

This can achieve:

```text
O(V + E)
```

for the 0-1 BFS setting.

---

# 24. Sliding-Window Connection

A monotonic deque uses both ends for a different reason:

```text
front → expiration
back  → dominance removal
```

The deque therefore becomes a candidate-management structure, not merely a general sequence.

This connects the current chapter directly to the previous sliding-window chapter.

---

# 25. Work Scheduling

A deque can model systems where urgent work is added to the front while ordinary work goes to the back.

Example:

```text
urgent → pushFront
normal → pushBack
worker → popFront
```

But this is not equivalent to a full priority queue.

If arbitrary priorities exist, a heap or specialized scheduler may be more appropriate.

---

# 26. Work-Stealing Connection

In work-stealing schedulers, a worker may operate primarily from one end of a deque while another worker steals work from the opposite end.

This is a major systems-level example of why double-ended access matters.

Correct concurrent work-stealing deques require substantially more than a basic single-threaded deque:

```text
atomicity
memory ordering
ownership
race handling
ABA considerations
```

Do not confuse the abstract deque with a production concurrent implementation.

---

# 27. BFS Variants

A standard BFS uses:

```text
pushBack
popFront
```

A deque can extend this model when different transition costs or priorities exist.

Examples:

```text
BFS → queue
0-1 BFS → deque
priority search → heap
```

Choosing the structure follows the ordering invariant required by the algorithm.

---

# 28. Backend Applications

Deques can support:

- bounded recent-event buffers;
- retry scheduling;
- task dispatch;
- sliding-window processing;
- connection activity tracking;
- producer/consumer buffering;
- work-stealing architectures;
- request prioritization with limited policy.

For distributed systems, a local deque is not automatically durable or globally ordered.

---

# 29. AI Applications

AI systems can use deques for:

- search frontiers;
- 0-1 cost state transitions;
- candidate windows;
- beam/frontier management;
- streaming inference buffers;
- bounded recent context/state;
- agent task queues.

When candidates have arbitrary scores, a heap is often more appropriate than a deque.

---

# 30. Correctness Proof Template

For a circular deque, prove:

### Representation

Logical offset `i` maps to the correct physical slot.

### Front insertion

New element becomes logical position zero.

### Back insertion

New element becomes logical position `size`.

### Front removal

Old logical position zero is returned.

### Back removal

Old logical position `size - 1` is returned.

### Size

Every successful operation updates size exactly once.

For linked implementations, additionally prove bidirectional pointer consistency.

---

# 31. Testing Strategy

Test:

```text
empty deque
single element
pushFront only
pushBack only
alternating front/back insertion
alternating front/back removal
fill to capacity
wrap-around
resize while wrapped
drain to empty
reinsert after emptying
duplicate values
large sequences
random operation sequences
```

After every operation, compare the candidate implementation against a simple reference array.

---

# 32. Differential Testing

A reference model can use:

```text
pushFront → unshift
pushBack  → push
popFront  → shift
popBack   → pop
```

The reference need not be efficient because it is used only for correctness on small/random tests.

Compare:

```text
return values
size
front
back
logical sequence
```

This catches subtle wrap-around and endpoint bugs.

---

# 33. Common Mistakes

- incorrect modulo for negative front movement;
- confusing physical tail with logical back;
- failing to update size;
- incorrect full/empty detection;
- losing elements during resize;
- forgetting to clear removed references;
- breaking `prev/next` symmetry in linked implementations;
- leaving stale head/tail after emptying;
- assuming arbitrary access is O(1);
- using a deque where a priority queue is required.

---

# 34. Production Engineering

A production deque design should document:

```text
ordering semantics
capacity policy
overflow policy
underflow policy
memory behavior
thread/concurrency model
cancellation semantics
observability
failure behavior
```

For high-throughput systems, benchmark:

```text
allocation rate
throughput
latency
cache behavior
GC pressure
resize frequency
```

---

# 35. Interview Framework

When asked about a deque:

```text
1. Define double-ended operations.
2. State the required complexities.
3. Choose circular array or doubly linked representation.
4. Define head/tail/size invariants.
5. Derive each end operation.
6. Explain full/empty behavior.
7. Analyze resizing if dynamic.
8. Discuss memory behavior.
9. Give an algorithmic application such as 0-1 BFS.
10. Explain when a heap or queue is better.
```

---

# 36. Revision Checklist

- [ ] I can define the Deque ADT.
- [ ] I understand how a deque generalizes stack and queue behavior.
- [ ] I can implement push/pop at both ends with a circular array.
- [ ] I can derive the modular index formulas.
- [ ] I can implement a doubly linked deque.
- [ ] I can state endpoint and size invariants.
- [ ] I understand bounded and dynamic deques.
- [ ] I can explain resize correctness.
- [ ] I understand memory ownership and reference release.
- [ ] I can derive operation complexity.
- [ ] I understand 0-1 BFS.
- [ ] I understand monotonic-deque connections.
- [ ] I can compare deque, queue, and heap choices.
- [ ] I can differential-test a deque.
- [ ] I can discuss backend and AI applications.

---

# 37. Key Takeaways

1. A deque supports efficient operations at both ends.
2. A circular array provides compact O(1) end operations with excellent storage locality.
3. A doubly linked deque provides natural dynamic growth with per-node allocation overhead.
4. Logical indexing and physical indexing must remain separate in circular representations.
5. Explicit size simplifies full/empty reasoning.
6. Dynamic growth can provide amortized O(1) insertion.
7. A deque is optimized for endpoints, not arbitrary middle operations.
8. 0-1 BFS demonstrates how deque ordering can encode algorithmic cost.
9. Monotonic deques use the same structure for expiration and dominance-based candidate elimination.
10. Production deque design requires explicit capacity, ownership, failure, and concurrency policies.
