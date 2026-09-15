# 06.07 — Queue Fundamentals & FIFO Architecture

> **Phase 06 — Stacks, Queues & Deques**
>
> A queue is a linear data structure organized around **FIFO — First In, First Out**. This chapter builds the queue from its abstract contract to implementation, invariants, complexity, memory behavior, and production/backend/AI applications.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- define the Queue ADT precisely;
- explain FIFO ordering and why it exists;
- distinguish logical front/rear from physical storage positions;
- implement queues with arrays and linked nodes;
- understand why `Array.shift()` can be a poor queue primitive;
- design head-index queues and circular buffers;
- reason about enqueue/dequeue complexity;
- define underflow and bounded-capacity semantics;
- prove queue invariants;
- compare queue representations;
- recognize queues in backend systems and AI workloads;
- choose an implementation from workload constraints rather than habit.

---

# 2. Why Queues Exist

A queue models a system where earlier arrivals should normally be served before later arrivals.

Examples:

```text
customers waiting for service
HTTP work waiting for workers
print jobs
messages waiting for consumers
BFS frontier
```

The key rule is:

```text
first inserted → first removed
```

This gives predictable ordering and prevents newer work from automatically bypassing older work.

---

# 3. Queue ADT

The abstract queue does not prescribe a particular memory representation.

Core operations:

```text
enqueue(x)   add x at the rear
dequeue()    remove the oldest element from the front
peek()       inspect the oldest element
isEmpty()    determine whether the queue contains elements
size()       return number of elements
```

Optional production operations include:

```text
clear()
capacity()
isFull()
tryDequeue()
tryEnqueue()
```

The ADT defines behavior; the implementation defines how that behavior is achieved.

---

# 4. Mental Model

Imagine a physical line:

```text
FRONT                         REAR
  ↓                             ↓
[A] [B] [C] [D]
```

`A` is served first.

After `dequeue()`:

```text
[B] [C] [D]
```

After `enqueue(E)`:

```text
[B] [C] [D] [E]
```

A correct queue must preserve this logical order regardless of its physical representation.

---

# 5. Queue Invariants

A queue implementation should maintain at least these invariants:

### Empty invariant

If the queue contains zero elements:

```text
size = 0
```

and its front/rear representation must be consistent with emptiness.

### Ordering invariant

If elements were enqueued as:

```text
A, B, C
```

then successive dequeues must return:

```text
A, B, C
```

### Size invariant

For every successful enqueue:

```text
size' = size + 1
```

For every successful dequeue:

```text
size' = size - 1
```

These invariants are more important than any particular implementation.

---

# 6. Naive JavaScript Array Queue

A simple implementation is:

```js
const queue = [];

queue.push(value);
const item = queue.shift();
```

The API looks ideal.

The problem is the physical cost of removing index `0` from a contiguous array. Elements after the removed position may need to be shifted or the runtime may need to maintain more complex internal bookkeeping.

Therefore, repeatedly calling `shift()` should not automatically be treated as an O(1) queue implementation.

---

# 7. Head-Index Queue

A common alternative is:

```js
const queue = [];
let head = 0;

queue.push(value);
const item = queue[head++];
```

Logical contents are:

```text
queue[head ... queue.length - 1]
```

Dequeue can therefore avoid physically shifting every remaining element.

But a new issue appears: consumed elements remain referenced by the backing array until they are released or storage is compacted.

---

# 8. Memory Retention

Suppose a queue processes millions of objects:

```text
enqueue A
enqueue B
...
dequeue A
```

If the backing array still contains a reference to A, the object may remain reachable longer than necessary.

A production head-index implementation can clear consumed slots:

```js
const item = queue[head];
queue[head] = undefined;
head++;
```

This separates two concerns:

```text
logical removal
memory reference release
```

They are related but not identical.

---

# 9. Compaction

A head-index queue eventually creates a large consumed prefix:

```text
[X] [X] [X] [X] [A] [B] [C]
 ↑ consumed        ↑ live
```

The queue may periodically compact live elements toward the beginning.

If compaction happens too frequently, it can reintroduce O(N) costs repeatedly.

A good implementation chooses a threshold so the total cost remains efficient.

This is an example of amortized engineering.

---

# 10. Circular Buffer

A bounded queue can use a fixed array as a ring:

```text
      +---+---+---+---+
      | A | B |   |   |
      +---+---+---+---+
        ↑       ↑
      front    rear
```

When the rear reaches the physical end, it wraps around:

```text
nextIndex = (index + 1) % capacity
```

This lets the queue reuse storage without shifting elements.

---

# 11. Circular Buffer State

A robust circular queue can track:

```text
buffer
head
size
capacity
```

The next insertion position is:

```text
(head + size) % capacity
```

The next removal position is:

```text
head
```

Using `size` explicitly removes ambiguity between full and empty states.

---

# 12. Full vs Empty

With only `head` and `tail`, a circular buffer can have ambiguity:

```text
head === tail
```

may mean either:

```text
empty
```

or:

```text
full
```

Possible solutions include:

- store `size`;
- reserve one slot;
- maintain an explicit full flag.

This is a classic representation-design decision.

---

# 13. Linked Queue

A linked queue typically maintains:

```text
front → first node
rear  → last node
```

For example:

```text
front                         rear
 ↓                              ↓
[A] → [B] → [C] → [D] → null
```

Enqueue at the rear and dequeue at the front can both be O(1), provided both pointers are maintained correctly.

---

# 14. Empty Linked Queue

When the final node is removed:

```text
front = null
rear = null
```

A common bug is:

```text
front = null
```

while accidentally leaving `rear` pointing at the removed node.

That violates the empty-state invariant and can corrupt future operations.

---

# 15. Enqueue Correctness

For a linked queue:

### Empty case

```text
front = newNode
rear = newNode
```

### Non-empty case

```text
rear.next = newNode
rear = newNode
```

The old rear must point to the new rear.

The operation must preserve:

```text
front reachable from queue
rear is final node
rear.next === null
```

---

# 16. Dequeue Correctness

For a linked queue:

```text
removed = front
front = front.next
```

If the queue becomes empty:

```text
rear = null
```

The removed node should no longer belong to the queue's reachable structure.

Detaching it explicitly can improve ownership clarity:

```text
removed.next = null
```

when the node is no longer needed elsewhere.

---

# 17. Complexity

For a well-designed linked queue:

| Operation | Complexity |
|---|---:|
| enqueue | O(1) |
| dequeue | O(1) |
| peek | O(1) |
| isEmpty | O(1) |
| size | O(1) if stored |
| search | O(N) |

For a circular buffer:

| Operation | Complexity |
|---|---:|
| enqueue | O(1) |
| dequeue | O(1) |
| peek | O(1) |
| isEmpty | O(1) |
| size | O(1) |

Dynamic resizing can make individual operations occasionally O(N), while preserving amortized O(1) insertion depending on the growth strategy.

---

# 18. Auxiliary Space vs Total Space

If a queue stores N live elements:

```text
space = O(N)
```

But implementation details matter.

A head-index array may temporarily retain a larger backing array than the number of live elements.

A linked queue allocates one node per element but adds per-node object/reference overhead.

Therefore:

> Big-O space is necessary but not sufficient for production memory reasoning.

---

# 19. Underflow Semantics

What happens when `dequeue()` is called on an empty queue?

Possible contracts:

```text
throw an error
return undefined
return null
return { ok: false }
```

For production APIs, the contract should be explicit.

A silent failure can hide bugs; exceptions can be appropriate for programmer errors; result objects can be useful for expected empty conditions.

---

# 20. Bounded Queue Semantics

If capacity is K, enqueueing when full requires a policy.

Options:

```text
reject
throw
block/wait
overwrite oldest
expand dynamically
```

These are not interchangeable.

For a backend work queue, rejecting or applying backpressure may be safer than silently overwriting work.

For a telemetry ring buffer, overwriting old data may be intentional.

The data structure must encode the domain policy.

---

# 21. FIFO Does Not Mean Fairness Automatically

FIFO is a local ordering rule.

A production scheduler may also need to account for:

- priorities;
- retries;
- starvation;
- deadlines;
- cancellation;
- tenant fairness;
- rate limits.

Once priorities are introduced, a priority queue may be more appropriate than a plain FIFO queue.

---

# 22. Queue vs Stack

| Property | Stack | Queue |
|---|---|---|
| Rule | LIFO | FIFO |
| Insert | top | rear |
| Remove | top | front |
| Typical search | DFS | BFS |
| Common use | undo | work processing |
| Ordering | newest first | oldest first |

Do not choose based on the word “processing.” Choose based on the required ordering semantics.

---

# 23. Queue vs Array

An array is a general-purpose sequence representation.

A queue is an abstract ordering contract.

An array can implement a queue, but the implementation must provide efficient front/rear operations.

This distinction is fundamental:

```text
ADT ≠ representation
```

---

# 24. Backend Applications

Queues are foundational in backend engineering:

```text
HTTP work dispatch
background jobs
email delivery
image processing
payment workflows
retry scheduling
rate limiting
batch processing
connection pools
message consumers
```

A typical worker system is:

```text
Producer
   ↓
Queue
   ↓
Workers
   ↓
Result / retry / dead-letter path
```

The queue decouples production speed from processing speed.

---

# 25. Backpressure

Suppose producers generate:

```text
10,000 jobs/sec
```

while workers process:

```text
2,000 jobs/sec
```

The queue grows.

Without a bound, memory may eventually become the bottleneck.

A bounded queue introduces backpressure:

```text
producer → queue full → slow/reject producer
```

This converts uncontrolled memory growth into an explicit capacity policy.

---

# 26. Queue Latency

For backend systems, queue length is often a useful operational signal.

As queue depth grows:

```text
waiting time ↑
latency ↑
resource pressure ↑
```

Therefore production queues should often expose metrics such as:

```text
queue depth
oldest item age
enqueue rate
dequeue rate
rejection count
processing latency
```

---

# 27. AI Applications

Queues appear in AI systems for:

- inference requests;
- embedding generation;
- document ingestion;
- retrieval jobs;
- tool calls;
- batch inference;
- agent tasks;
- asynchronous evaluation.

FIFO can be appropriate when request order matters, but AI workloads frequently require priorities or deadlines.

That is where a priority queue, deque, or scheduler may replace a plain FIFO queue.

---

# 28. BFS Connection

Breadth-first search uses a queue because it explores states by distance from the source.

Conceptually:

```text
level 0
  ↓
level 1
  ↓
level 2
```

FIFO ordering ensures that states discovered earlier at the current frontier are processed before deeper states.

This makes the queue more than a data structure: it encodes the algorithm's exploration policy.

---

# 29. Correctness Proof Template

For a queue implementation, prove:

### Representation invariant

The data structure represents exactly the logical sequence of queued elements.

### Enqueue preservation

Adding x places x after every existing element.

### Dequeue preservation

Removing returns the oldest logical element and leaves the remaining sequence unchanged.

### Empty correctness

An empty queue reports no element available for removal.

### Size correctness

`size` equals the number of logical elements.

This proof works regardless of whether the representation is linked, array-backed, or circular.

---

# 30. Common Mistakes

- using `shift()` blindly for high-throughput queues;
- forgetting to update rear when the final linked node is removed;
- confusing physical index with logical position;
- failing to clear consumed references;
- incorrectly detecting full vs empty circular buffers;
- storing size inconsistently;
- silently dropping work from a full queue;
- assuming FIFO automatically provides fairness;
- ignoring memory growth under producer/consumer imbalance;
- mixing queue policy with low-level storage logic.

---

# 31. Production Decision Framework

Choose a representation using:

```text
1. Is capacity bounded?
2. Do we need dynamic growth?
3. Is memory locality important?
4. Is allocation overhead important?
5. Do we need stable O(1) operations?
6. Can oldest items be discarded?
7. Do we need priorities?
8. Is cancellation required?
9. Is backpressure required?
10. What are latency and throughput targets?
```

Typical choices:

```text
small/simple → array abstraction
high-throughput bounded → circular buffer
linked ownership/work units → linked queue
priority scheduling → priority queue
both-end operations → deque
```

---

# 32. Testing Strategy

Test at minimum:

```text
empty dequeue
a single element
multiple FIFO elements
enqueue after emptying
capacity = 1
full queue
wrap-around
many enqueue/dequeue cycles
large queue
reference release
size consistency
random operation sequences
```

A useful reference model is a simple array representing the logical sequence.

Compare the production queue's outputs and size against the reference after every operation.

---

# 33. Interview Framework

When asked to implement a queue:

```text
1. State FIFO contract.
2. Define front and rear semantics.
3. Choose representation.
4. State invariants.
5. Implement enqueue.
6. Implement dequeue.
7. Define empty/full behavior.
8. Analyze time complexity.
9. Analyze memory behavior.
10. Discuss workload-specific alternatives.
```

A strong answer explains **why** the representation satisfies the required complexity.

---

# 34. Revision Checklist

- [ ] I can define FIFO precisely.
- [ ] I understand the Queue ADT.
- [ ] I can state queue invariants.
- [ ] I understand why `shift()` may be unsuitable for high-throughput queues.
- [ ] I can implement a head-index queue.
- [ ] I understand consumed-reference retention.
- [ ] I understand circular buffers.
- [ ] I can explain full vs empty ambiguity.
- [ ] I can implement a linked queue.
- [ ] I can derive enqueue/dequeue complexity.
- [ ] I understand bounded queue policies.
- [ ] I understand backpressure.
- [ ] I can connect queues to BFS.
- [ ] I can explain backend and AI applications.
- [ ] I can choose a queue representation from workload requirements.

---

# 35. Key Takeaways

1. A queue is an ADT defined by FIFO behavior.
2. Front/rear are logical concepts; storage can vary.
3. `Array.shift()` should not be assumed to provide efficient high-throughput dequeue semantics.
4. Head-index arrays, circular buffers, and linked queues solve different engineering problems.
5. Empty/full semantics must be explicitly designed.
6. Memory retention can matter even when asymptotic complexity is O(1).
7. Bounded queues are a fundamental backpressure mechanism.
8. FIFO ordering does not automatically solve priority or fairness requirements.
9. BFS works because queue ordering encodes level-order exploration.
10. Production queue design is about both data structure and workload policy.
