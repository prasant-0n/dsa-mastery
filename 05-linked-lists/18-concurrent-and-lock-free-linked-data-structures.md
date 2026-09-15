# 05.18 — Concurrent & Lock-Free Linked Data Structures

## Purpose

Linked structures become substantially harder when multiple execution contexts can access them concurrently.

This chapter introduces the reasoning needed to understand concurrent linked structures, atomicity, lock-based synchronization, non-blocking algorithms, and the classic ABA and memory-reclamation problems.

> The goal is conceptual mastery and correct reasoning—not pretending that ordinary JavaScript objects are automatically lock-free.

---

## 1. Sequential Assumption

Most linked-list algorithms assume one execution flow:

```text
read → modify → write
```

Concurrency invalidates this assumption because another actor may change the structure between those operations.

---

## 2. Race Condition

Consider:

```text
A → B → C
```

Two actors attempt to remove `B` concurrently.

Both may observe:

```text
A.next === B
```

Then both modify the same relationship.

The final structure depends on the interleaving unless synchronization establishes a safe ordering.

---

## 3. Atomicity

An operation is atomic with respect to a chosen concurrency model when other actors cannot observe an invalid intermediate state or interleave conflicting updates within the atomic boundary.

Pointer assignments that look like one source-code statement do not automatically make a multi-step algorithm atomic.

---

## 4. Critical Section

A critical section is code that must be protected from conflicting concurrent access.

For a mutable linked list, it may include:

```text
read neighbors
rewire pointers
update head/tail
update size
```

All related invariants must be protected as one logical transaction.

---

## 5. Lock-Based Design

A mutex can protect the entire list:

```text
lock
  mutate structure
unlock
```

Advantages:

- easier reasoning;
- straightforward correctness model;
- simpler recovery from errors.

Costs:

- contention;
- blocking;
- scheduling overhead;
- possible deadlocks when multiple locks interact.

---

## 6. Fine-Grained Locking

Instead of one global lock, different regions may have separate locks.

This can increase concurrency but dramatically increases correctness complexity.

A linked structure with local locks still needs a safe protocol for traversing and modifying neighboring nodes.

---

## 7. Lock Ordering

When multiple locks can be acquired, a consistent ordering can prevent circular wait.

Example:

```text
always acquire lower-address/ordered identity lock first
```

The exact ordering mechanism depends on the implementation.

The principle is more important than a particular key.

---

## 8. Deadlock

A deadlock can occur when:

```text
Thread A holds Lock 1 → waits for Lock 2
Thread B holds Lock 2 → waits for Lock 1
```

The program makes no progress.

Lock-based linked structures should document lock ownership and ordering.

---

## 9. Progress Guarantees

Concurrent algorithms are often classified by progress guarantees.

### Blocking

A thread may wait for another thread to release a lock.

### Lock-free

The system as a whole makes progress: some operation completes after a finite number of steps, even if individual threads may repeatedly fail.

### Wait-free

Every operation completes within a bounded number of its own steps.

These are stronger guarantees, not synonyms for “fast.”

---

## 10. Compare-and-Swap

A common primitive is compare-and-swap (CAS):

```text
if memory == expected:
    memory = desired
    succeed
else:
    fail
```

CAS enables algorithms that attempt updates optimistically and retry if another actor changed the state.

---

## 11. Lock-Free Stack

A classic conceptual stack uses a shared head:

```text
oldHead = head
newNode.next = oldHead
CAS(head, oldHead, newNode)
```

If CAS fails, another actor changed `head`; reload and retry.

This is a foundational lock-free pattern.

---

## 12. Why CAS Alone Is Not Enough

A successful pointer CAS does not automatically make the entire data structure correct.

You must reason about:

- node lifetime;
- stale references;
- memory ordering;
- ABA;
- retries;
- compound invariants.

Concurrency correctness is a system-level property.

---

## 13. ABA Problem

Suppose a thread reads:

```text
A
```

Another thread changes:

```text
A → B → A
```

The original thread sees `A` again and may incorrectly conclude that nothing changed.

The value is the same, but the history and structure are different.

This is the **ABA problem**.

---

## 14. Tagged References

One conceptual solution is to associate a version/tag with the reference:

```text
(pointer, version)
```

A change increments the version, so returning to the same pointer does not produce the same logical state.

Actual implementations require an appropriate atomic representation.

---

## 15. Memory Reclamation

Removing a node from a concurrent structure does not necessarily mean it can immediately be destroyed or reused.

Another thread may still hold a reference to it.

Therefore concurrent algorithms need a safe memory-reclamation strategy.

---

## 16. Hazard Pointers

A hazard-pointer scheme lets a thread announce:

> I may dereference this node; do not reclaim it yet.

A removed node is reclaimed only when no active hazard pointer protects it.

This prevents use-after-reclamation in suitable designs.

---

## 17. Epoch-Based Reclamation

Epoch-based approaches associate readers with epochs or generations.

A removed node is reclaimed after all relevant readers have moved beyond the epoch in which the node could have been accessed.

This trades implementation complexity for efficient reclamation in appropriate workloads.

---

## 18. Garbage-Collected Languages

Managed runtimes can remove one class of manual reclamation problem because objects remain alive while reachable.

But this does **not** make concurrent algorithms automatically safe.

You still need to reason about:

- atomic updates;
- race conditions;
- visibility;
- logical consistency;
- stale observations;
- progress guarantees.

---

## 19. JavaScript Concurrency Reality

JavaScript's common execution model uses an event loop, and ordinary application code does not perform arbitrary shared-memory multithreading simply by using objects.

Node.js can also use worker threads and shared memory primitives such as `SharedArrayBuffer`/`Atomics`.

Therefore concurrent linked-list design in JavaScript depends strongly on whether state is:

```text
isolated per worker
shared through messages
shared through SharedArrayBuffer/Atomics
```

Do not import native lock-free assumptions blindly into ordinary Node.js code.

---

## 20. Message Passing Alternative

Often the best concurrent design is to avoid shared mutable linked structures.

Instead:

```text
worker A → message → worker B
```

Each owner mutates its own data.

This can eliminate an entire class of races.

---

## 21. Single-Producer / Single-Consumer Queues

A queue with one producer and one consumer has simpler synchronization requirements than a multi-producer/multi-consumer queue.

This is why workload topology matters when selecting a concurrent data structure.

---

## 22. Linearizability

An operation is **linearizable** if it appears to take effect atomically at some point between invocation and response, consistent with real-time ordering constraints.

For a concurrent queue, you should be able to reason about a single logical point at which enqueue/dequeue takes effect.

---

## 23. Sequential Consistency

Sequential consistency requires that operations appear in some global sequential order consistent with each thread's program order.

Modern memory models can permit weaker observations, so concurrent algorithms need explicit memory-order reasoning where applicable.

---

## 24. Lock-Free Queue Reasoning

A queue often has separate enqueue and dequeue concerns:

```text
head → ... → tail
```

A correct non-blocking implementation must coordinate updates to shared endpoints and intermediate links while handling concurrent observation and failure/retry paths.

The Michael-Scott queue is a classic conceptual example of a lock-free linked queue.

---

## 25. Backend Applications

Concurrency-aware linked structures appear conceptually in:

- work queues;
- schedulers;
- connection pools;
- cache eviction structures;
- memory reclamation systems;
- high-throughput pipelines.

In many backend applications, a battle-tested queue or broker is safer than implementing a custom lock-free list.

---

## 26. AI Applications

AI infrastructure can have concurrent workloads such as:

- inference request queues;
- candidate-state pipelines;
- asynchronous preprocessing;
- worker scheduling;
- bounded task queues.

Again, workload ownership and message-passing architecture often matter more than choosing a theoretically sophisticated linked structure.

---

## 27. Correctness Before Throughput

A lock-free algorithm that occasionally corrupts a queue is not an optimization.

The engineering order is:

```text
model → invariants → correctness proof → stress test → benchmark
```

Not:

```text
benchmark → add atomics → hope
```

---

## 28. Stress Testing

Concurrent structures require adversarial tests:

- many producers;
- many consumers;
- random operation sequences;
- forced contention;
- repeated retries;
- empty/non-empty transitions;
- singleton transitions;
- shutdown during activity.

Validate that every completed operation preserves the abstract data-structure contract.

---

## 29. Common Mistakes

1. Assuming pointer assignment is a complete atomic algorithm.
2. Confusing lock-free with wait-free.
3. Ignoring ABA.
4. Ignoring memory reclamation.
5. Using fine-grained locks without a lock-order protocol.
6. Assuming GC solves races.
7. Implementing custom lock-free structures without a compelling reason.
8. Benchmarking without contention.
9. Testing only happy paths.
10. Ignoring the language/runtime memory model.

---

## 30. Decision Framework

Before building a concurrent linked structure:

```text
1. Can shared mutable state be eliminated?
2. Can ownership be assigned to one worker?
3. Can message passing solve the problem?
4. Is a standard queue sufficient?
5. What progress guarantee is actually required?
6. What atomic primitives are available?
7. How will node lifetime be handled?
8. How will correctness be tested?
9. What contention exists in production?
10. Is the performance gain measurable?
```

---

## Revision Checklist

- [ ] Explain race conditions.
- [ ] Explain atomicity and critical sections.
- [ ] Compare coarse and fine-grained locking.
- [ ] Explain deadlock and lock ordering.
- [ ] Define blocking, lock-free, and wait-free.
- [ ] Explain CAS.
- [ ] Trace a lock-free stack attempt.
- [ ] Explain ABA.
- [ ] Explain hazard pointers.
- [ ] Explain epoch-based reclamation.
- [ ] Explain why GC does not eliminate concurrency correctness.
- [ ] Explain JavaScript worker/shared-memory considerations.
- [ ] Explain linearizability.
- [ ] Design a stress-testing strategy.
- [ ] Decide when message passing is preferable.

# Key Takeaways

1. Concurrency changes linked-list reasoning from local pointer manipulation to synchronization and memory-model reasoning.
2. Locks simplify correctness but can introduce contention and blocking.
3. Lock-free and wait-free are formal progress guarantees.
4. CAS is a building block, not a complete correctness proof.
5. ABA and memory reclamation are fundamental non-blocking concerns.
6. Garbage collection removes some manual reclamation concerns but not races or logical inconsistency.
7. JavaScript concurrency must be analyzed according to its actual worker/shared-memory model.
8. Message passing can often eliminate the need for shared mutable linked structures.
9. Correctness, invariants, and stress testing come before performance optimization.
10. Prefer battle-tested concurrent primitives over custom lock-free structures unless the requirement genuinely justifies the complexity.
