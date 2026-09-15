# 06.12 — Advanced Deque Patterns

> **Phase 06 — Stacks, Queues & Deques**

This chapter develops the two most important advanced deque patterns: **0-1 BFS** and **monotonic deque frontier management**. The focus is not memorization; it is deriving the ordering invariant, proving why the deque operations are safe, and understanding when a deque can replace a more general structure.

## 1. Learning Objectives

By the end, you should be able to:

- recognize when an algorithm needs two-ended frontier control;
- derive 0-1 BFS from shortest-path relaxation;
- prove why 0-1 BFS works for edge weights 0 and 1;
- distinguish 0-1 BFS from BFS and Dijkstra;
- derive monotonic deque invariants;
- reason about dominance-based state compression;
- separate expiration from dominance pruning;
- handle duplicates and stale states;
- analyze amortized deque operations;
- design bounded frontiers for backend and AI systems.

---

## 2. The Core Ordering Principle

A data structure becomes algorithmically powerful when its ordering matches the required invariant.

```text
FIFO queue → discovery-layer order
Deque      → controlled front/back order
Heap       → arbitrary global priority order
```

The correct question is not “Which structure do I know?” but:

> **What ordering must the algorithm maintain?**

---

## 3. Ordinary BFS Baseline

For equal edge costs:

```text
pushBack(v)
popFront()
```

New states are one edge farther away, so FIFO is sufficient.

If transitions can have cost zero, however, a newly discovered state may belong at the current distance layer rather than behind all pending states. A deque solves that restricted case.

---

## 4. 0-1 BFS Problem Model

Every edge has weight:

```text
0 or 1
```

We want shortest distances from a source.

Dijkstra is general enough to solve this, but its priority queue is more general than necessary. The restricted weight domain lets us encode the required priority with two deque ends.

---

## 5. Relaxation

For:

```text
u --w--> v
```

where `w` is 0 or 1:

```text
dist[v] > dist[u] + w
```

means the distance can improve.

Then:

```text
w === 0 → pushFront(v)
w === 1 → pushBack(v)
```

The deque therefore approximates the priority ordering required by shortest-path relaxation without a heap.

---

## 6. Why Weight 0 Goes to the Front

If the current state has distance 5:

```text
weight 0 → distance 5
weight 1 → distance 6
```

The zero-cost successor belongs with the current distance layer. It must be processed before states whose tentative distance is larger.

Therefore:

```text
0-cost transition → front
1-cost transition → back
```

This is the central rule of 0-1 BFS.

---

## 7. 0-1 BFS Invariant

A useful invariant is:

> The deque processes states in nondecreasing relevant tentative distance, subject to relaxation and stale-entry handling.

An implementation may contain multiple entries for one vertex. Therefore correctness depends on the distance check as well as deque placement.

---

## 8. Stale Entries

A vertex can first be discovered with distance 7 and later improved to 5.

An old queue entry may remain.

A robust implementation can store the queued distance and ignore an entry when:

```text
queuedDistance !== dist[vertex]
```

This pattern is common in shortest-path engineering: stale work is tolerated and discarded safely.

---

## 9. 0-1 BFS vs Dijkstra

```text
BFS       → equal edge costs
0-1 BFS   → edge costs only 0 or 1
Dijkstra  → general nonnegative edge costs
```

The deeper lesson is **specialization**:

> If the input constraints give you a simpler priority domain, exploit them instead of automatically reaching for the most general data structure.

---

## 10. 0-1 BFS Complexity

Under the standard adjacency-list implementation:

```text
Time  = O(V + E)
Space = O(V)
```

The edge scans contribute O(E), distance state contributes O(V), and the specialized deque ordering avoids a logarithmic heap factor.

The exact implementation should still account for duplicate/stale entries and the chosen relaxation policy.

---

## 11. Monotonic Deque

A monotonic deque maintains candidates in sorted order according to a comparison invariant.

For a maximum query:

```text
front → largest ... smallest ← back
```

For a minimum query:

```text
front → smallest ... largest ← back
```

It is usually storing **indices**, because indices provide expiration information.

---

## 12. Sliding-Window Maximum

For every incoming index `i`:

```text
1. remove expired indices from front
2. remove dominated indices from back
3. append i
4. read front as maximum when window is complete
```

For a maximum:

```text
while backValue <= currentValue
    popBack()
```

Then append the current index.

---

## 13. Why Dominated Candidates Can Be Removed

Suppose candidate A is older and candidate B is newer:

```text
B.value >= A.value
```

For a fixed-size window, B will expire no earlier than A.

Therefore A cannot become the maximum while B remains valid.

A can be permanently discarded.

This is **state compression through dominance**.

---

## 14. Monotonic Minimum

Reverse the comparison:

```text
while backValue >= currentValue
    popBack()
```

The deque becomes increasing from front to back.

The same reasoning applies: a newer candidate that is at least as good dominates an older candidate for the minimum query.

---

## 15. Expiration vs Dominance

These are fundamentally different.

### Expiration

A candidate is no longer inside the active window.

### Dominance

A candidate is still valid, but another candidate makes it permanently irrelevant.

The implementation may use the same `pop` operations, but the correctness proofs are different.

---

## 16. Strict vs Non-Strict Comparisons

With duplicates, choose deliberately between:

```text
pop while <
pop while <=
```

or their minimum equivalents.

The correct choice depends on whether the problem cares about:

- candidate identity;
- oldest vs newest equal value;
- stable tie-breaking;
- expiration behavior.

Never treat duplicate handling as a cosmetic detail.

---

## 17. Amortized O(N) Monotonic Deque

The inner loop may look dangerous:

```text
while dominated
    popBack()
```

But every index can be:

```text
pushed once
popped from the back at most once
popped from the front at most once
```

Therefore across N input elements:

```text
pushes + front pops + back pops = O(N)
```

So the entire algorithm is O(N), not O(N²).

---

## 18. Frontier Management

A search frontier contains states that may be processed later.

Advanced frontier management can combine:

```text
FIFO ordering
front/back priority
expiration
identity deduplication
dominance pruning
capacity limits
```

The pruning rule must be proven before it is implemented.

---

## 19. Dominance Proof Template

To discard A because of B, prove:

1. both are valid candidates;
2. B is no worse for the objective;
3. B remains usable whenever A would remain usable;
4. removing A cannot remove the only optimal solution.

If any condition fails, the optimization may be incorrect.

---

## 20. Deque vs Heap

Use a deque when ordering can be expressed through endpoint rules.

Use a heap when candidates have arbitrary priorities.

Examples:

```text
0/1 transition cost       → deque
arbitrary positive costs  → heap
window maximum            → monotonic deque
best-first search         → heap
```

Choosing the structure is part of algorithm design.

---

## 21. Bounded Frontier

Large search systems can exhaust memory.

Possible controls include:

```text
maximum frontier size
TTL
beam width
pruning
sampling
backpressure
external storage
```

But dropping states can change completeness or optimality guarantees.

The engineering contract must state what is being sacrificed, if anything.

---

## 22. AI Search

Different AI search strategies map naturally to different frontier structures:

```text
BFS        → queue
DFS        → stack
0-1 BFS    → deque
best-first → priority queue
beam search → bounded ranked frontier
```

The frontier is the physical representation of the search policy.

---

## 23. Backend Streaming

A timestamp deque can maintain recent events:

```text
oldest → newest
```

For every new event:

```text
remove expired events
inspect active state
append event
```

Applications include:

- rate limiting;
- rolling metrics;
- recent-event processing;
- anomaly detection windows;
- active-session tracking.

A distributed rate limiter may require shared state, partitioning, clocks, and replication; a local deque alone does not provide global correctness.

---

## 24. Out-of-Order Events

A simple timestamp deque assumes an ordering guarantee.

If events arrive:

```text
10, 11, 9, 12
```

appending blindly breaks chronological ordering.

Production stream processing may therefore require:

```text
watermarks
allowed lateness
reordering buffers
late-event policies
ordered indexes
```

This is an important boundary between a DSA model and a distributed production system.

---

## 25. Memory Engineering

An exact but unbounded frontier can become a reliability problem.

Bound memory with:

```text
window duration
maximum candidates
maximum states
TTL
pruning
backpressure
```

For AI workloads, state compression can dramatically reduce memory, but aggressive pruning may reduce search quality or completeness.

---

## 26. Correctness Testing

### 0-1 BFS

Compare against Dijkstra on small random graphs.

Test:

```text
all-zero edges
all-one edges
mixed weights
cycles
parallel edges
unreachable nodes
multiple shortest paths
```

### Monotonic deque

Compare against brute-force window scans.

Test:

```text
increasing
 decreasing
all equal
duplicates
negative values
K = 1
K = N
```

---

## 27. Failure Modes

Common bugs include:

- putting weight-0 transitions at the back;
- processing stale shortest-path entries as current;
- using an invalid dominance rule;
- forgetting expiration;
- incorrect duplicate handling;
- unbounded frontier growth;
- assuming ordered event streams when they are not;
- using a deque where arbitrary priority is required;
- claiming O(N) without an amortized argument.

---

## 28. Interview Framework

When you identify a deque pattern:

```text
1. State the required ordering.
2. Explain why a normal queue is insufficient.
3. Define front/back semantics.
4. State the invariant.
5. Explain when removal is permanent.
6. Prove the removal is safe.
7. Derive amortized complexity.
8. Analyze memory.
9. Compare against heap/queue alternatives.
10. State edge cases.
```

This framework works for both 0-1 BFS and monotonic-deque problems.

---

## 29. Revision Checklist

- [ ] I can derive 0-1 BFS from relaxation.
- [ ] I know why zero-cost transitions go to the front.
- [ ] I understand stale entries.
- [ ] I can explain O(V + E).
- [ ] I can derive monotonic-deque invariants.
- [ ] I can prove dominance-based removal.
- [ ] I distinguish expiration from dominance.
- [ ] I understand duplicate semantics.
- [ ] I can compare deque and heap frontier management.
- [ ] I can design bounded frontiers.
- [ ] I understand ordered vs out-of-order streams.
- [ ] I can connect the patterns to backend and AI systems.

---

## 30. Key Takeaways

1. Deque algorithms are fundamentally about maintaining the right ordering invariant.
2. 0-1 BFS exploits the restricted 0/1 edge-weight domain.
3. Zero-cost transitions go to the front; unit-cost transitions go to the back.
4. Monotonic deques remove candidates through a proven dominance relation.
5. Expiration and dominance are different correctness mechanisms.
6. Amortized analysis explains why repeated deque pops still produce O(N) total work.
7. A deque should replace a heap only when the priority structure truly permits it.
8. Frontier limits introduce explicit quality/completeness trade-offs.
9. Streaming systems must define event-order and lateness semantics.
10. Expert DSA means deriving the invariant first and selecting the data structure second.
