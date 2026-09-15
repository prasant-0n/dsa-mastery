# 06.09 — Queue Patterns: BFS, Level-Order Traversal & Multi-Source Search

> **Phase 06 — Stacks, Queues & Deques**
>
> Breadth-first search (BFS) is the canonical algorithmic pattern built around a FIFO queue. This chapter develops BFS from first principles, proves why it explores by distance, explains level-order and multi-source variants, and connects the pattern to backend and AI search systems.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- derive BFS from the FIFO contract;
- distinguish BFS from DFS and choose between them;
- implement graph and tree BFS correctly;
- track visited state and prevent duplicate work;
- perform level-order traversal;
- compute shortest unweighted path distance;
- reconstruct shortest paths with parent information;
- perform multi-source BFS;
- use BFS on grids and implicit state spaces;
- reason about complexity and memory;
- identify when BFS is inappropriate;
- apply queue-based search to backend and AI problems.

---

# 2. What BFS Means

Breadth-first search explores a state space in increasing number of edges from a starting state.

Conceptually:

```text
          S
        / | \
       A  B  C
      / \    |
     D   E   F
```

BFS visits:

```text
S
A B C
D E F
```

The queue maintains the frontier between discovered and processed states.

---

# 3. Why a Queue Produces Breadth

Suppose S discovers A, B, and C.

The queue becomes:

```text
[A, B, C]
```

Process A and discover D, E:

```text
[B, C, D, E]
```

Process B:

```text
[C, D, E, ...]
```

Newly discovered deeper nodes are appended behind already-discovered nodes at the current depth.

Therefore FIFO ordering naturally produces level-by-level exploration.

---

# 4. BFS Invariant

A useful invariant is:

> Before processing the next queue item, every undiscovered queued state is at a depth no smaller than the state being processed, and queued states preserve nondecreasing distance order.

For unweighted graphs, this implies the first discovered distance for a node is its shortest distance from the source.

---

# 5. Basic Graph BFS

For adjacency-list graph `G` and source `s`:

```text
queue ← [s]
visited[s] ← true

while queue is not empty
    u ← dequeue()
    for each v adjacent to u
        if v is not visited
            visited[v] ← true
            enqueue(v)
```

The critical detail is marking `v` visited **when enqueuing**, not when dequeuing.

---

# 6. Why Mark on Enqueue

Consider:

```text
A → C
B → C
```

If C is marked only when dequeued, both A and B may enqueue C.

That creates duplicate queue entries.

Marking on discovery:

```text
visited.add(C)
enqueue(C)
```

ensures each vertex enters the BFS frontier once.

This is both a correctness and performance property.

---

# 7. Complexity

For adjacency-list BFS:

```text
Time:  O(V + E)
Space: O(V)
```

Why?

Each vertex is discovered at most once.

Each adjacency edge is examined when its source is processed.

The queue and visited structure can together hold O(V) information.

For a grid with R rows and C columns:

```text
Time:  O(R × C)
Space: O(R × C)
```

in the worst case.

---

# 8. BFS on Trees

Trees do not require a general visited set when the representation is a proper tree and edges are directed from parent to children.

Example:

```text
       1
      / \
     2   3
    / \   \
   4   5   6
```

Level-order traversal:

```text
1
2 3
4 5 6
```

The queue contains the current frontier and upcoming levels.

---

# 9. Level-Order Traversal

There are two common approaches.

### Approach A — Process by queue size

At the beginning of a level:

```text
levelSize = queue.size
```

Process exactly `levelSize` nodes.

Children discovered during this loop belong to the next level.

### Approach B — Store explicit depth

Queue entries can contain:

```text
{ node, depth }
```

The first approach often uses less metadata; the second is useful when each state naturally carries a distance.

---

# 10. Queue-Size Level Boundary

Example:

```text
queue = [A, B, C]
levelSize = 3
```

Process A, B, C only.

Their children are appended:

```text
queue = [D, E, F]
```

The next iteration processes exactly that new level.

This pattern is useful for:

```text
level-order output
distance layers
minimum number of transformations
wave simulation
```

---

# 11. Shortest Path in an Unweighted Graph

If every edge has equal cost, BFS finds the shortest path measured in number of edges.

Maintain:

```text
distance[source] = 0
```

When discovering `v` from `u`:

```text
distance[v] = distance[u] + 1
```

Because BFS processes states in nondecreasing distance, the first assigned distance is optimal.

---

# 12. Why BFS Gives the Shortest Unweighted Path

Suppose BFS discovers a node v through u.

Then:

```text
distance[v] = distance[u] + 1
```

All nodes at distance smaller than `distance[u]` have already been processed.

Any alternative path to v with fewer edges would therefore have caused v to be discovered earlier.

Contradiction.

Hence the first discovery gives the minimum number of edges.

---

# 13. Path Reconstruction

Distance alone gives the length, not the actual route.

Store:

```text
parent[v] = u
```

When target is reached:

```text
target → parent[target] → ... → source
```

Reverse that sequence to obtain:

```text
source → ... → target
```

This adds O(V) potential parent memory but makes route reconstruction straightforward.

---

# 14. Early Exit

If searching for a specific target, BFS can terminate when the target is discovered or dequeued, depending on the exact correctness/metadata contract.

Early exit avoids exploring irrelevant parts of the graph.

However, for problems requiring complete distance maps, connected-component discovery, or all shortest paths, early exit is not sufficient.

---

# 15. Disconnected Graphs

BFS from one source visits only the source's connected component.

To traverse the entire graph:

```text
for each vertex v
    if not visited[v]
        BFS(v)
```

This becomes a connected-components pattern for undirected graphs.

---

# 16. Multi-Source BFS

Instead of one source, initialize the queue with many sources:

```text
queue = [S1, S2, S3]
```

Set:

```text
distance[S1] = distance[S2] = distance[S3] = 0
```

Then run ordinary BFS.

Every state receives its distance from the **nearest source** under the unweighted metric.

---

# 17. Why Multi-Source BFS Works

All sources start in the same distance layer:

```text
layer 0 = all sources
```

Their neighbors become layer 1, and so on.

Because all sources expand simultaneously through one FIFO frontier, the first source to reach a state determines its minimum distance.

This is equivalent to adding a conceptual super-source connected to every initial source with zero-cost edges.

---

# 18. Grid BFS

A grid can be treated as an implicit graph.

For four-direction movement:

```text
up
right
down
left
```

Each cell is a vertex and valid moves are edges.

You do not need to construct an explicit adjacency list.

Generate neighbors on demand.

This is usually both simpler and more memory-efficient.

---

# 19. Grid Boundary Validation

For cell `(r, c)` in an `R × C` grid:

```text
0 ≤ r < R
0 ≤ c < C
```

A neighbor is valid only if it satisfies these bounds and any domain constraints:

```text
not blocked
not visited
allowed terrain
```

Boundary checking is a major source of grid-BFS bugs.

---

# 20. Multi-Source Grid Problems

Classic patterns include:

```text
nearest facility
nearest infected cell
fire spreading
distance from multiple exits
nearest zero/one transformations
simultaneous wave propagation
```

Initialize all relevant cells at distance zero, then expand outward.

Do not run a separate BFS from every source unless constraints justify it; that can multiply the work unnecessarily.

---

# 21. BFS on Implicit State Spaces

A state does not need to be a graph node object.

It can be:

```text
string configuration
integer
bitmask
tuple
board position
workflow state
machine configuration
```

Define:

```text
state identity
legal transitions
visited representation
```

Then BFS can operate without materializing the complete graph.

---

# 22. State Identity

Visited tracking requires a stable identity function.

For a coordinate:

```text
(r, c)
```

For a tuple:

```text
(a, b, c)
```

For a structured state, serialize or encode only when the representation is correct and efficient.

Bad identity design can cause either:

```text
false duplicates
```

or:

```text
missed duplicates → explosive search
```

---

# 23. BFS vs DFS

| Requirement | BFS | DFS |
|---|---|---|
| shortest unweighted path | strong | not guaranteed |
| level-order | natural | awkward |
| memory | can be high | often lower on narrow trees |
| deep exploration | less natural | natural |
| backtracking | not primary | natural |
| nearest-state search | strong | depends |

The choice should follow the property you need, not personal preference.

---

# 24. BFS vs Dijkstra

BFS assumes every edge has equal cost.

If edge weights differ:

```text
1 → 10
```

BFS can produce the wrong minimum-cost path.

Use Dijkstra or another weighted shortest-path algorithm when costs differ and the algorithm's assumptions require it.

A good interview answer explicitly states the equal-edge-cost assumption.

---

# 25. BFS vs 0-1 BFS

When edge weights are only:

```text
0 or 1
```

a deque-based 0-1 BFS can often solve shortest paths in:

```text
O(V + E)
```

The reason a deque works is that zero-cost transitions can be processed at the front while cost-one transitions go to the back.

This is an important bridge from queues to deques.

---

# 26. Backend Applications

Queue-based breadth-first processing appears in:

- dependency exploration;
- service topology traversal;
- permission graph expansion;
- nearest-resource search;
- workflow state exploration;
- crawl frontiers;
- graph-based recommendation preprocessing;
- distributed job dependency analysis.

For large production graphs, the in-memory queue is only part of the architecture. Persistence, deduplication, rate limiting, and failure recovery may be required.

---

# 27. AI Applications

BFS-like exploration can support:

- symbolic search;
- state-space planning;
- constrained transformations;
- shortest-action plans;
- puzzle solving;
- candidate generation;
- tool-sequence exploration.

However, real AI systems often need scoring, heuristics, beam widths, priorities, or learned policies. Those requirements may lead beyond plain FIFO BFS.

---

# 28. Memory Engineering

BFS can have a large frontier.

If branching factor is `b` and depth is `d`, the frontier can grow on the order of:

```text
O(b^d)
```

in tree-like spaces.

Therefore BFS can run out of memory even when the theoretical time is acceptable.

Possible mitigations include:

```text
visited compression
state encoding
bidirectional search
frontier partitioning
external storage
bounded search
beam search
```

These change the engineering trade-offs and sometimes the completeness/optimality guarantees.

---

# 29. Bidirectional BFS

For a known source and target, search from both ends:

```text
source → → →
           ← ← ← target
```

If the frontiers meet, a path has been found.

For roughly uniform branching factor `b`, ordinary BFS may explore about:

```text
b^d
```

states to depth d, while bidirectional search can approach:

```text
b^(d/2)
```

from each side under favorable conditions.

This can be a major reduction.

---

# 30. Correctness Requirements for Bidirectional Search

Bidirectional BFS is not simply “run two BFS loops.”

You must define:

```text
what counts as a meeting
which distances are stored
how the path is reconstructed
when termination is safe
```

The implementation must preserve the shortest-path guarantee.

---

# 31. Frontier Management

A BFS iteration can be viewed as:

```text
discovered frontier
        ↓
process frontier
        ↓
generate next frontier
```

This abstraction is useful for parallel and distributed systems.

Instead of thinking only about individual queue operations, think about **frontier expansion**.

---

# 32. Queue Duplicates

Duplicate states are dangerous.

Without visited tracking, a cyclic graph such as:

```text
A → B → C → A
```

can cause endless re-enqueueing.

Even acyclic graphs can generate duplicate states through converging paths.

Visited tracking is therefore not merely an optimization; in cyclic search it is often necessary for termination.

---

# 33. Correctness Proof Template

For BFS shortest path:

### Invariant

Every dequeued vertex has minimum possible distance from the source.

### Discovery

Every newly discovered vertex receives distance one greater than its predecessor.

### No premature discovery

A shorter path would require an earlier frontier layer, which BFS would have processed first.

### Termination

Each reachable vertex is discovered at most once.

Therefore the algorithm terminates and returns shortest unweighted distances.

---

# 34. Testing Strategy

Test:

```text
empty graph
single vertex
linear graph
star graph
cycle
duplicate edges
disconnected graph
source = target
unreachable target
multiple shortest paths
large branching factor
grid boundaries
blocked cells
multiple sources
```

For shortest-path problems, compare against a simple reference implementation on small random graphs.

---

# 35. Production Failure Modes

- marking visited too late;
- forgetting cycles;
- incorrect grid bounds;
- treating weighted edges as unweighted;
- mixing level counters incorrectly;
- storing enormous state objects in every queue entry;
- failing to deduplicate implicit states;
- assuming BFS is memory-cheap;
- incorrect bidirectional termination;
- using FIFO where priority or heuristic ordering is required.

---

# 36. Interview Framework

When given a BFS problem:

```text
1. Define the state.
2. Define legal transitions.
3. State why FIFO is appropriate.
4. Define visited identity.
5. Decide when to mark visited.
6. Define distance/parent metadata if needed.
7. Explain level boundaries if relevant.
8. State complexity.
9. Check whether edge costs are uniform.
10. Discuss memory and possible optimizations.
```

For a grid, explicitly state the movement directions and boundary conditions.

---

# 37. Revision Checklist

- [ ] I can derive BFS from FIFO ordering.
- [ ] I understand the BFS frontier invariant.
- [ ] I can implement graph BFS.
- [ ] I know why visited should normally be marked on enqueue.
- [ ] I can implement tree level-order traversal.
- [ ] I can calculate shortest unweighted distances.
- [ ] I can reconstruct a shortest path.
- [ ] I can implement multi-source BFS.
- [ ] I can apply BFS to grids.
- [ ] I can search implicit state spaces.
- [ ] I understand BFS vs DFS.
- [ ] I understand BFS vs Dijkstra.
- [ ] I understand the bridge to 0-1 BFS.
- [ ] I understand BFS memory pressure.
- [ ] I can explain bidirectional BFS.
- [ ] I can connect BFS to backend and AI systems.

---

# 38. Key Takeaways

1. BFS is FIFO-driven exploration by increasing distance.
2. The queue represents the active frontier.
3. Marking states when discovered prevents duplicate frontier entries.
4. BFS gives shortest paths only under the appropriate unweighted/equal-cost assumptions.
5. Level-order traversal is BFS with explicit level boundaries.
6. Multi-source BFS computes nearest-source distances efficiently.
7. Grids and other implicit state spaces are graphs without requiring explicit graph construction.
8. Visited-state identity is part of algorithm correctness.
9. BFS can be memory-intensive because its frontier may grow rapidly.
10. Backend and AI search often extend BFS with priorities, heuristics, batching, persistence, or distributed frontier management.
