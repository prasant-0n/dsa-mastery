# 05.24 — Phase 05 Linked Lists Mastery & Capstone

## Purpose

This capstone closes the Linked Lists phase. The goal is to demonstrate that you can move from an unfamiliar requirement to a correct, efficient, production-aware linked-data-structure solution.

You are not finished with linked lists when you can reverse a list. You are finished when you can **choose, derive, implement, prove, test, optimize, and defend** the structure.

---

# 1. Phase 05 Mastery Model

The complete linked-list reasoning loop is:

```text
Requirement
    ↓
Workload
    ↓
Representation
    ↓
Invariants
    ↓
Operations
    ↓
Algorithm
    ↓
Correctness
    ↓
Complexity
    ↓
Runtime behavior
    ↓
Testing
    ↓
Production trade-offs
```

Every capstone solution should make this chain explicit.

---

# 2. What You Must Now Know

## Fundamental

- singly linked lists;
- doubly linked lists;
- circular lists;
- sentinel nodes;
- node identity;
- traversal;
- insertion;
- deletion;
- searching;
- mutation.

## Algorithmic

- reversal;
- fast/slow pointers;
- fixed-gap pointers;
- cycle detection;
- cycle entry;
- intersection;
- merging;
- partitioning;
- sorting;
- segment reversal;
- group reversal;
- recursive processing.

## Advanced

- skip lists;
- intrusive lists;
- persistent lists;
- structural sharing;
- memory/cache behavior;
- ownership;
- aliasing;
- concurrency hazards;
- ABA reasoning;
- reference-model testing.

## Systems

- LRU caches;
- bounded queues;
- cancellation;
- scheduling;
- retry queues;
- free lists;
- resource pools;
- backend workloads;
- AI search and inference workloads.

---

# 3. Capstone Rule — Do Not Start With Code

For every problem, first write:

```text
Input:
Output:
Mutation allowed?
Identity important?
Ordering required?
Maximum N?
Concurrency?
Memory limit?
Persistence required?
Cancellation required?
```

Then select the representation.

---

# 4. Capstone A — Production LRU Cache

Design an LRU cache with:

```text
get(key)
set(key, value)
delete(key)
size()
```

Requirements:

- average O(1) lookup;
- average O(1) update;
- O(1) eviction;
- stable node identity;
- explicit capacity policy;
- correct head/tail maintenance;
- no accidental cycles.

Expected architecture:

```text
Map<key, node>
        +
Doubly Linked List
```

### Required reasoning

Explain why a list alone is insufficient and why a map alone cannot efficiently maintain recency order.

---

# 5. Capstone B — Cancellable Bounded Work Queue

Design a FIFO queue supporting:

```text
enqueue(request)
dequeue()
cancel(requestId)
size()
```

Requirements:

- FIFO ordering;
- bounded capacity;
- cancellation by ID;
- O(1) cancellation after indexing;
- explicit ownership;
- observable queue state.

Expected architecture:

```text
Map<id, node>
        +
Doubly Linked Queue
```

Discuss whether an array/ring buffer would be better if cancellation were not required.

---

# 6. Capstone C — K-Way Merge Engine

Given `K` sorted linked lists, produce one sorted list.

Compare:

1. sequential merging;
2. divide-and-conquer merging;
3. min-heap merging.

For total nodes `T`:

```text
sequential:          potentially O(TK)
divide-and-conquer:  O(T log K)
heap:                O(T log K)
```

Explain memory behavior and when each strategy is appropriate.

---

# 7. Capstone D — Persistent Versioned List

Create a list where old versions remain valid after updates.

Example:

```text
V1: A → B → C

update V1 at index 1

V1: A → B → C
V2: A → X → C
```

The untouched structure should be shared where safe.

Requirements:

- no mutation of shared nodes;
- structural sharing;
- clear ownership rules;
- version correctness;
- predictable update complexity.

---

# 8. Capstone E — AI Search Frontier

Design a linked-structure component for an AI search system.

Support:

```text
enqueue state
remove state
rank candidate
cancel state
track identity
```

Then decide whether linked lists are actually appropriate.

Compare against:

- arrays;
- dequeues;
- heaps;
- maps;
- indexed priority queues.

The correct answer may be a hybrid rather than a linked list.

---

# 9. Capstone F — Memory-Sensitive Free List

Design a free-list abstraction for reusable objects.

Operations:

```text
acquire()
release(object)
size()
```

Requirements:

- ownership validation;
- double-release detection;
- capacity policy;
- lifecycle tracking;
- predictable mutation.

Discuss why object pooling can improve allocation behavior in some workloads but can also increase complexity and retain memory unnecessarily.

---

# 10. Correctness Framework

For every capstone, establish invariants.

Example for a doubly linked list:

```text
head.prev === null
 tail.next === null
node.next.prev === node
node.prev.next === node
```

For an indexed queue:

```text
Map contains exactly the live queued IDs
```

For a persistent list:

```text
old versions never observe mutation from newer versions
```

For an LRU cache:

```text
Map size === list node count
Every mapped node belongs to the list
List order represents recency
```

---

# 11. Testing Strategy

Use four layers.

## Layer 1 — Example Tests

Test known scenarios.

## Layer 2 — Edge Cases

Test:

```text
empty
single node
head
middle
tail
missing
duplicates
capacity 0
capacity 1
large input
```

## Layer 3 — Invariant Tests

After every mutation, validate structural invariants.

## Layer 4 — Differential Testing

Compare the optimized structure against a simple reference model.

```text
operations
    ↓
reference model
    ↓
optimized implementation
    ↓
observable-state comparison
```

---

# 12. Failure Injection

Deliberately test:

- invalid IDs;
- duplicate insertion;
- double deletion;
- deletion of an absent node;
- capacity overflow;
- cancellation after dequeue;
- malformed pointers;
- corrupted ownership metadata;
- unexpected nulls.

Production-quality structures should fail predictably rather than silently corrupting state.

---

# 13. Complexity Review

For every operation record:

| Operation | Time | Auxiliary Space | Notes |
|---|---:|---:|---|
| Traversal | O(N) | O(1) | sequential |
| Search | O(N) | O(1) | without index |
| Head insertion | O(1) | O(1) | known head |
| Known-node deletion | O(1) | O(1) | doubly linked |
| Indexed lookup | O(1) avg. | O(N) | Map companion |
| LRU get/set | O(1) avg. | O(N) | Map + list |
| K-way merge | O(T log K) | O(K) | heap approach |

Do not confuse theoretical operation cost with the cost of discovering the node.

---

# 14. Runtime Engineering

In JavaScript, evaluate:

- object allocation;
- garbage collection;
- pointer chasing;
- cache locality;
- hidden runtime overhead;
- recursion depth;
- memory retention;
- Map lookup behavior.

A theoretically efficient linked structure can still lose to a dense array in real workloads.

Benchmark representative workloads instead of assuming the asymptotic winner is the practical winner.

---

# 15. Concurrency Review

If multiple workers mutate the same structure, define:

```text
ownership
synchronization
atomicity
visibility
failure recovery
```

Do not assume ordinary JavaScript object mutation is automatically safe merely because JavaScript execution has a single main thread. Worker threads, shared memory, asynchronous coordination, and distributed processes introduce additional boundaries.

For lock-free designs, understand:

- compare-and-swap;
- ABA problems;
- reclamation;
- hazard pointers;
- epoch-based reclamation.

---

# 16. Backend Decision Framework

When choosing a structure, ask:

```text
Need random access?
→ array

Need ordered priority?
→ heap / priority queue

Need key lookup?
→ hash map

Need FIFO?
→ queue / deque / ring buffer

Need O(1) arbitrary node removal?
→ doubly linked list + node reference

Need LRU?
→ map + doubly linked list

Need persistent versions?
→ immutable structure / structural sharing
```

The data structure follows the workload.

---

# 17. AI Decision Framework

For AI systems, ask:

```text
Need sequential frontier?
→ deque/list may work

Need top-K?
→ heap or bounded priority structure

Need deduplication?
→ Set/Map

Need beam ranking?
→ bounded ranked structure

Need versioned search states?
→ persistent/immutable structure

Need fast nearest-neighbor retrieval?
→ specialized index, not linked list
```

Do not force DSA knowledge into inappropriate architectures.

---

# 18. Interview Capstone

You should now be able to answer these without memorized code:

### Level 1

- Reverse a list.
- Find the middle.
- Find kth from the end.
- Delete a node.
- Merge two lists.

### Level 2

- Detect a cycle.
- Find cycle entry.
- Find intersection.
- Check palindrome.
- Reorder a list.
- Reverse in K groups.

### Level 3

- Merge K lists.
- Sort a linked list.
- Design LRU.
- Design a cancellable queue.
- Build a persistent list.

### Level 4

- Select between linked list, array, deque, heap, and map for a workload.
- Prove invariants.
- Differential-test an implementation.
- Reason about ownership and aliasing.
- Explain runtime performance.
- Discuss concurrency and production failure modes.

---

# 19. Final Mastery Rubric

Score yourself from 0–3 for each category:

```text
0 = cannot explain
1 = can follow a solution
2 = can implement independently
3 = can derive and defend independently
```

Categories:

- representation;
- traversal;
- mutation;
- pointer patterns;
- reversal;
- cycles;
- intersection;
- merging;
- sorting;
- recursion;
- persistent structures;
- advanced structures;
- backend applications;
- AI applications;
- correctness proofs;
- complexity analysis;
- testing;
- runtime engineering;
- concurrency reasoning;
- interview communication.

Target: **3 in every category** before calling the phase mastered.

---

# 20. Final Synthesis

Linked lists are not primarily about nodes.

They teach a broader engineering discipline:

```text
references
→ ownership
→ invariants
→ local mutation
→ global structure
→ algorithmic trade-offs
→ memory behavior
→ correctness
→ system design
```

Those ideas transfer directly into caches, queues, schedulers, resource pools, search systems, persistent state, and production infrastructure.

---

# Phase 05 Completion Checklist

- [ ] Fundamentals mastered
- [ ] Singly linked lists mastered
- [ ] Doubly linked lists mastered
- [ ] Circular lists mastered
- [ ] Traversal mastered
- [ ] Mutation mastered
- [ ] Reversal mastered
- [ ] Fast/slow pointers mastered
- [ ] Cycle detection mastered
- [ ] Intersection mastered
- [ ] Merge/sort mastered
- [ ] Advanced pointer patterns mastered
- [ ] Skip lists understood
- [ ] Intrusive lists understood
- [ ] Persistent structures understood
- [ ] Memory/cache trade-offs understood
- [ ] Concurrency hazards understood
- [ ] Backend applications understood
- [ ] AI applications understood
- [ ] Production engineering understood
- [ ] Interview patterns mastered
- [ ] Capstone implementations completed
- [ ] Reference-model tests completed
- [ ] Complexity explanations completed

# Final Gate

Do not mark Phase 05 complete because you read the chapters.

Mark it complete when you can take an unseen linked-list problem and independently produce:

```text
model
→ representation
→ invariant
→ algorithm
→ implementation
→ proof
→ complexity
→ tests
→ trade-off defense
```

**Phase 05 — Linked Lists: COMPLETE only after the capstone exercises are solved and reviewed.**
