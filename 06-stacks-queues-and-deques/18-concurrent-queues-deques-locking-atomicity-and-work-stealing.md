# 06.18 — Concurrent Queues & Deques: Locking, Atomicity, Work Stealing & Parallel Systems

> **Phase 06 — Stacks, Queues & Deques**
>
> Sequential data structures assume one logical actor mutates state at a time. Concurrent systems break that assumption. This chapter develops the mental model needed to reason about shared queues/deques under concurrency, including atomicity, locking, contention, ownership, lock-free ideas, work stealing, and JavaScript-specific execution models.

## 1. Learning Objectives

You will learn to:

- distinguish sequential correctness from concurrent correctness;
- identify race conditions and lost updates;
- reason about atomic operations and critical sections;
- understand mutexes, semaphores, condition variables, and bounded buffers;
- analyze contention and convoying;
- understand blocking vs non-blocking queues;
- learn the conceptual model of lock-free structures and CAS;
- understand the ABA problem at a conceptual level;
- design work-stealing deques;
- reason about ownership and task distribution;
- connect concurrency to backend and AI worker systems.

---

## 2. Sequential vs Concurrent Queue

Sequential queue:

```text
enqueue → mutate state → return
dequeue → mutate state → return
```

Concurrent queue:

```text
producer A ─┐
producer B ─┼→ shared queue → consumer A
producer C ─┘                 consumer B
```

Multiple actors may observe and mutate the same logical state.

Correctness now depends on interleavings, not merely individual operations.

---

## 3. Race Condition

A race occurs when the result depends on an uncontrolled ordering of concurrent operations.

Example:

```text
size = 1

consumer A reads size = 1
consumer B reads size = 1
A removes item
B removes item
```

Without coordination, both consumers may believe the same item is available.

The problem is not speed. It is an invalid state transition.

---

## 4. Atomicity

An operation is atomic when concurrent observers cannot observe a partially completed logical transition.

For a queue, “check non-empty + remove item” often needs to behave as one atomic operation.

This is different from saying every machine instruction is atomic.

Atomicity is a correctness property of a logical operation.

---

## 5. Critical Section

A critical section is the region that accesses shared mutable state and must be coordinated.

Example:

```text
lock
  inspect head
  modify head
  modify size
unlock
```

Keep critical sections small enough to reduce contention, but large enough to preserve invariants.

---

## 6. Mutex

A mutex provides mutual exclusion:

```text
at most one owner
```

A queue protected by one mutex is conceptually simple:

```text
lock → operation → unlock
```

The trade-off is contention when many workers compete for the same lock.

---

## 7. Lock Contention

With many workers:

```text
worker A ─┐
worker B ─┼→ same lock
worker C ─┘
```

Most workers may spend time waiting rather than doing useful work.

The data structure can be O(1) while the system still has poor throughput because synchronization dominates.

---

## 8. Lock Convoying

A slow lock holder can delay many waiting operations.

For example:

```text
lock holder → pauses
      ↓
workers accumulate
      ↓
burst after release
```

This creates latency spikes and poor utilization.

---

## 9. Bounded Blocking Queue

A classic producer-consumer buffer has:

```text
capacity = K
```

Producer behavior:

```text
if full → wait
else → enqueue
```

Consumer behavior:

```text
if empty → wait
else → dequeue
```

The queue must coordinate both conditions safely.

---

## 10. Condition Variables

Conceptually, producers wait for:

```text
notFull
```

Consumers wait for:

```text
notEmpty
```

After mutation, the relevant waiting parties are notified.

The important rule is that a wake-up does not itself prove the condition is true; the condition must be rechecked.

---

## 11. Semaphores

A semaphore represents a count of available permits.

For a bounded queue:

```text
empty slots → producer permits
items       → consumer permits
```

A semaphore can separate resource availability from mutual exclusion.

---

## 12. Blocking vs Non-Blocking

Blocking:

```text
operation waits for capacity/data
```

Non-blocking:

```text
operation returns immediately
```

Non-blocking APIs often return a result such as:

```text
success
empty
full
retry
```

The right choice depends on latency and backpressure requirements.

---

## 13. Ownership

A powerful way to reduce synchronization is to assign ownership.

If one worker exclusively owns a queue, it can mutate it without a shared lock.

Other workers communicate through controlled handoff mechanisms.

This principle becomes central to work-stealing designs.

---

## 14. Work Sharing

A shared global queue can distribute tasks:

```text
all workers → one queue
```

Advantages:

```text
simple load distribution
central visibility
```

Disadvantages:

```text
central contention
single synchronization hotspot
```

---

## 15. Work Stealing

Each worker owns a local deque:

```text
worker A → deque A
worker B → deque B
worker C → deque C
```

A worker normally takes work from its own end.

An idle worker steals work from another worker's opposite end.

This reduces central contention.

---

## 16. Why a Deque?

The owner and thief need different ends:

```text
owner  → one end
thief  → opposite end
```

This reduces interference and preserves locality for the owner.

The deque therefore encodes an ownership policy, not just double-ended access.

---

## 17. Locality

A worker processing its own recent tasks may benefit from:

```text
CPU cache locality
warm data
related subtasks
```

Work stealing tries to preserve local execution while providing load balancing when a worker becomes idle.

---

## 18. Work-Stealing Trade-Off

Work stealing is not free.

It introduces:

```text
steal synchronization
remote access
coordination overhead
load imbalance during bursts
```

A scheduler should steal only when local work is insufficient.

---

## 19. Chase-Lev Deque Concept

A well-known work-stealing design uses separate owner and thief ends with carefully coordinated index operations.

Conceptually:

```text
owner → bottom
thief → top
```

The owner has stronger control over its end; thieves compete for the opposite end.

The exact memory-ordering implementation is language/runtime dependent.

---

## 20. JavaScript Concurrency Model

JavaScript on Node.js commonly uses an event loop with asynchronous I/O rather than shared-memory threads for ordinary application code.

However, shared memory can exist with mechanisms such as:

```text
Worker Threads
SharedArrayBuffer
Atomics
```

Therefore backend engineers still need concurrency reasoning when using workers and shared state.

---

## 21. Atomics and Compare-and-Swap

A compare-and-swap style operation conceptually says:

```text
if memory == expected
    replace with new value
else
    fail
```

This enables optimistic coordination without a traditional mutex.

It does not make an entire data structure automatically thread-safe.

All related invariants must still be reasoned about.

---

## 22. Lock-Free vs Wait-Free

### Lock-free

The system as a whole continues making progress even if individual operations retry.

### Wait-free

Every operation completes within a bounded number of its own steps.

Wait-free guarantees are stronger.

These terms describe progress guarantees, not simply “fast code.”

---

## 23. CAS Retry Loops

A conceptual lock-free update may look like:

```text
read old state
compute new state
CAS(old, new)
if failed → retry
```

Under contention, retries can increase.

Therefore lock-free does not mean contention-free.

---

## 24. ABA Problem

Suppose a location changes:

```text
A → B → A
```

A thread that only compares the current value may incorrectly believe nothing changed.

This is the ABA problem.

Solutions can include version/tag counters or safer ownership schemes, depending on the environment.

---

## 25. Memory Reclamation

Concurrent pointer structures have a second problem: when is an old node safe to reclaim?

A thread may still hold a reference after another thread removes the node.

Advanced systems use techniques such as:

```text
hazard pointers
epoch-based reclamation
reference counting
managed runtime GC
```

Memory reclamation is part of concurrent data-structure correctness.

---

## 26. False Sharing

Two independent counters can still interfere if they occupy the same cache line.

Example:

```text
worker A counter
worker B counter
```

Frequent writes can cause cache-coherence traffic.

Concurrency performance therefore depends on memory layout as well as algorithmic complexity.

---

## 27. Backpressure Under Concurrency

Multiple producers can overwhelm a bounded queue simultaneously.

The queue must guarantee:

```text
size ≤ capacity
```

under every interleaving.

A check followed by a separate mutation is unsafe unless the entire logical transition is coordinated atomically.

---

## 28. Fairness and Locks

A lock may not guarantee FIFO acquisition order.

Therefore:

```text
mutual exclusion ≠ fairness
```

A system requiring fairness needs an explicit policy.

Possible techniques include ticket locks or queue-based synchronization, depending on the environment.

---

## 29. Deadlock

Deadlock occurs when operations wait forever for resources held by each other.

Classic pattern:

```text
A holds lock 1 → waits lock 2
B holds lock 2 → waits lock 1
```

Avoidance techniques include consistent lock ordering, reduced lock scope, and ownership-based designs.

---

## 30. Livelock

In livelock, actors keep changing state but make little useful progress.

Example:

```text
worker A backs off
worker B backs off
A retries
B retries
...
```

Randomized backoff can sometimes reduce synchronized contention.

---

## 31. Starvation Under Concurrency

A worker can repeatedly lose races for shared resources.

This is different from deadlock because the system continues making progress while one participant does not.

Measure maximum waiting time if starvation matters.

---

## 32. Concurrent Priority Queues

A concurrent priority queue adds synchronization to heap operations.

But the heap invariant and synchronization invariant are separate:

```text
heap order
+
atomic mutation
```

Optimizing heap operations without considering contention can produce little system-level benefit.

---

## 33. Concurrent BFS

Parallel BFS may process a frontier concurrently:

```text
frontier N
   ↓
workers
   ↓
next frontier
```

Challenges include:

```text
duplicate discovery
visited-state races
work distribution
frontier synchronization
```

The algorithm remains correct only if each shared state transition is safely coordinated.

---

## 34. Backend Worker Architecture

A scalable architecture may use:

```text
producer
  ↓
partitioned queues
  ↓
worker-local deques
  ↓
work stealing
  ↓
external side effects
```

The key design question is where shared state ends and ownership begins.

---

## 35. AI Parallel Search

AI search may generate many independent states.

Workers can process local search frontiers and steal work when idle.

This can improve utilization, but shared visited maps, duplicate detection, and global beam limits can become synchronization bottlenecks.

---

## 36. Global vs Local State

Prefer local state when possible:

```text
local frontier
local counters
local temporary buffers
```

Shared state should be minimized:

```text
global visited
shared result
shared budget
shared cancellation
```

This reduces coordination cost.

---

## 37. Cancellation

Concurrent workers may need to stop queued work.

A cancellation token can represent:

```text
cancel requested
```

Workers should check cancellation at safe boundaries.

Cancellation must be designed so that partial work does not corrupt shared invariants.

---

## 38. Graceful Shutdown

A concurrent queue system should distinguish:

```text
stop accepting
finish current work
drain queue
cancel pending work
release resources
exit
```

Shutdown itself is a concurrent state transition and should have explicit invariants.

---

## 39. Testing Concurrent Structures

Ordinary deterministic unit tests are insufficient.

Use:

```text
stress tests
randomized interleavings
race detectors where available
model checking for small state spaces
invariant checks
long-running contention tests
```

A useful strategy is to compare a concurrent implementation against a sequential reference model.

---

## 40. Linearizability

Linearizability asks whether each concurrent operation can be understood as taking effect at a single point between invocation and response.

For a concurrent queue, this gives a powerful correctness model:

```text
concurrent history
      ↓
can it be explained as a valid sequential history?
```

This is stronger than merely checking final size.

---

## 41. Performance Metrics

Measure:

```text
throughput
operation latency
contention
retry count
queue depth
steal rate
worker utilization
cache misses where measurable
```

For work stealing, track:

```text
local executions
successful steals
failed steals
```

---

## 42. Production Checklist

Before deploying concurrent queue infrastructure, define:

```text
ownership
atomicity
memory visibility
capacity
blocking behavior
fairness
cancellation
shutdown
failure recovery
observability
```

If the runtime provides a safer primitive, prefer it over implementing a lock-free structure from scratch.

---

## 43. Interview Framework

Explain a concurrent queue in this order:

```text
1. Sequential invariant.
2. Shared state.
3. Race scenario.
4. Critical section.
5. Synchronization strategy.
6. Progress guarantee.
7. Capacity/backpressure.
8. Failure modes.
9. Complexity under contention.
10. Testing strategy.
```

For work stealing, explain ownership, local execution, stealing direction, synchronization, and load balancing.

---

## 44. Revision Checklist

- [ ] I can distinguish sequential and concurrent correctness.
- [ ] I understand race conditions and atomicity.
- [ ] I understand mutexes and critical sections.
- [ ] I understand bounded blocking queues.
- [ ] I understand semaphores and condition variables conceptually.
- [ ] I understand blocking vs non-blocking APIs.
- [ ] I understand ownership-based concurrency.
- [ ] I can explain work stealing.
- [ ] I understand why deques fit work stealing.
- [ ] I know the conceptual CAS model.
- [ ] I understand lock-free vs wait-free.
- [ ] I understand ABA conceptually.
- [ ] I understand memory reclamation concerns.
- [ ] I can reason about deadlock, livelock, and starvation.
- [ ] I can explain linearizability.
- [ ] I can design a concurrent backend worker architecture.

---

## 45. Key Takeaways

1. Concurrent correctness is about valid behavior across possible interleavings.
2. Atomicity must protect complete logical state transitions, not isolated reads or writes.
3. A simple mutex-protected queue is often preferable to an incorrectly implemented lock-free queue.
4. Ownership reduces shared-state contention.
5. Work-stealing deques combine local execution with distributed load balancing.
6. Lock-free and wait-free are progress guarantees with different strengths.
7. CAS-based structures still require careful invariant and memory-reclamation reasoning.
8. JavaScript backend engineers encounter concurrency through workers, shared memory, asynchronous systems, and external coordination.
9. Concurrent BFS, AI search, and worker pools all require careful duplicate-state and cancellation handling.
10. Production concurrency requires correctness, observability, resource bounds, and a deliberate failure model—not merely faster operations.
