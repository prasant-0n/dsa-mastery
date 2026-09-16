# 14.03 — Graph Traversal Fundamentals: BFS & DFS

## 1. Concept Definition

Graph traversal is the systematic process of visiting vertices and edges according to a defined exploration rule. The two foundational traversals are Breadth-First Search (BFS) and Depth-First Search (DFS).

BFS explores by increasing distance in an unweighted graph. DFS explores one branch as deeply as possible before backtracking.

## 2. Why Traversal Exists

Most graph algorithms need a controlled way to discover structure:

- reachability
- connected components
- shortest paths in unweighted graphs
- cycle detection
- dependency exploration
- topological reasoning
- state-space search

Traversal is therefore a foundation rather than an isolated problem pattern.

## 3. Graph Model

Let `G = (V, E)`.

A traversal maintains state describing which vertices have been discovered or processed.

For adjacency-list graphs, visiting all reachable vertices takes `O(V + E)` because each relevant vertex and edge is processed a bounded number of times.

## 4. The Visited Set

The fundamental invariant is:

> A vertex marked visited will not be scheduled for first-time discovery again.

Without visited tracking, cyclic graphs can cause infinite traversal or repeated work.

## 5. BFS Mental Model

BFS uses a queue:

```text
start
 ↓
queue
 ↓
remove oldest vertex
 ↓
inspect neighbors
 ↓
append undiscovered neighbors
```

This produces layers by shortest number of edges from the source in an unweighted graph.

## 6. BFS Algorithm

```text
mark source visited
enqueue source

while queue is not empty:
    u = dequeue()
    for each neighbor v of u:
        if v is unvisited:
            mark v visited
            enqueue v
```

Marking a vertex when it is enqueued is usually the cleanest approach because it prevents duplicate queue entries.

## 7. BFS Distance

For an unweighted graph, define:

```text
distance[source] = 0
```

When discovering `v` from `u`:

```text
distance[v] = distance[u] + 1
```

The first discovery gives the shortest edge-count distance because BFS explores vertices in nondecreasing distance order.

## 8. BFS Parent Tree

Store:

```text
parent[v] = u
```

when `v` is first discovered.

The parent relation forms a BFS tree over reachable vertices and allows path reconstruction.

## 9. BFS Correctness Invariant

At the point a vertex is first dequeued, its stored distance equals its shortest-path distance from the source in an unweighted graph.

The proof follows from layer-by-layer queue ordering.

## 10. DFS Mental Model

DFS uses a stack conceptually:

```text
start
 ↓
choose neighbor
 ↓
continue deeply
 ↓
backtrack
```

DFS can be implemented recursively or iteratively with an explicit stack.

## 11. Recursive DFS

Conceptually:

```text
DFS(u):
    mark u visited
    for each neighbor v:
        if v is unvisited:
            DFS(v)
```

The call stack stores the current exploration path.

## 12. Iterative DFS

Use an explicit stack:

```text
push source
while stack not empty:
    u = pop()
    if u already visited: continue
    mark u visited
    push relevant neighbors
```

If exact recursive visitation order matters, neighbor push order must be chosen deliberately because stacks are LIFO.

## 13. Discovery vs Processing

Distinguish:

- discovered: scheduled/known
- entered: traversal begins processing the vertex
- exited: all relevant outgoing neighbors have been processed

This distinction becomes essential for DFS timestamps, cycle detection, and topological algorithms.

## 14. DFS Colors / States

A common model is:

```text
WHITE = undiscovered
GRAY  = discovered but active
BLACK = fully processed
```

This enables reasoning about edges to active ancestors and supports directed cycle detection.

## 15. DFS Timestamps

Assign:

```text
discovery[u]
finish[u]
```

when entering and leaving a vertex.

For a standard recursive DFS, a descendant's interval is nested inside its ancestor's interval.

## 16. Connected Reachability

A traversal from source `s` visits exactly the vertices reachable from `s` in the graph under the traversal's edge semantics.

For an undirected graph, this means the entire connected component containing `s`.

## 17. Disconnected Graphs

A single source traversal does not necessarily visit every vertex.

To traverse an entire graph:

```text
for every vertex u:
    if unvisited:
        start BFS/DFS at u
```

This pattern leads directly to connected-components algorithms.

## 18. BFS vs DFS

| Property | BFS | DFS |
|---|---|---|
| Core structure | queue | stack/call stack |
| Exploration | layer-by-layer | depth-first |
| Unweighted shortest path | yes | no guarantee |
| Path reconstruction | parent tree | parent tree possible |
| Recursive implementation | uncommon | natural |
| Typical memory | frontier can be wide | depth can be deep |

## 19. Time Complexity

With adjacency lists:

```text
BFS: O(V + E)
DFS: O(V + E)
```

The bound assumes each vertex and adjacency entry can be processed in constant time.

With an adjacency matrix, neighbor scanning can require `O(V)` per processed vertex, leading to `O(V²)` traversal work in the standard representation.

## 20. Space Complexity

Auxiliary traversal space includes:

- visited state: `O(V)`
- queue/stack: up to `O(V)`
- parent/distance arrays if used: `O(V)`

Recursive DFS also consumes call-stack space proportional to traversal depth.

## 21. JavaScript Recursion Risk

Deep DFS recursion can exceed the JavaScript call stack.

For potentially deep or adversarial graphs, an explicit stack is safer and gives direct control over memory.

## 22. Neighbor Ordering

Traversal order depends on adjacency ordering.

If deterministic output is required, define and preserve an ordering policy such as:

- insertion order
- ascending vertex ID
- sorted edge labels

Do not assume two valid graph representations produce identical traversal sequences.

## 23. Duplicate Edges

Parallel edges may cause the same destination to appear multiple times.

Visited-state semantics prevent repeated first discovery, but the implementation may still inspect each adjacency entry.

If duplicate elimination is required, encode that requirement explicitly.

## 24. Self-Loops

A self-loop `u → u` does not cause a second discovery when `u` is already visited.

It may still matter for cycle detection or graph semantics.

## 25. Directed vs Undirected Traversal

BFS/DFS follow the edges stored by the representation.

For directed graphs, traversal respects edge direction.

For undirected graphs, both incident directions must be represented or otherwise supplied by the graph abstraction.

## 26. Early Termination

Traversal need not visit the entire reachable graph if the goal is already satisfied.

Examples:

- find a target
- determine whether a path exists
- find a node at a distance limit
- stop after reaching a required count

Early termination changes practical work but does not change the full-traversal worst-case bound.

## 27. Multi-Source BFS

Initialize the queue with multiple sources at distance zero.

Then perform ordinary BFS.

The resulting distance for each vertex is the minimum distance to any source in an unweighted graph.

This pattern is important for contagion/spread models, nearest-source queries, and grid problems.

## 28. Level-Order Processing

BFS naturally exposes layers.

A common implementation records the current queue length and processes exactly that many vertices before advancing to the next level.

This is useful for:

- level counts
- minimum-hop expansion
- time-step simulations
- layered search

## 29. Bidirectional BFS

For a known source and target in an unweighted graph, search from both ends.

If the frontiers meet, a path exists.

The method can reduce explored states dramatically on suitable graphs, but requires compatible reverse traversal semantics.

## 30. BFS as State-Space Search

A graph vertex can represent any state:

```text
state = configuration
edge = legal transition
```

BFS then finds the minimum number of transitions in an unweighted state space.

This connects graph traversal to AI planning and puzzle search.

## 31. DFS as Structural Exploration

DFS is especially useful when the goal is structural rather than shortest-path distance:

- component discovery
- cycle reasoning
- dependency analysis
- topological algorithms
- articulation/bridge foundations
- backtracking-style state exploration

## 32. Traversal Tree

A traversal creates a parent relation.

For each newly discovered vertex `v`:

```text
parent[v] = u
```

The resulting tree/forest captures how the traversal discovered reachable vertices.

## 33. Cycle Detection Preview

Undirected graphs can use parent-aware DFS/BFS logic to detect an edge connecting to an already visited vertex that is not simply the parent edge.

Directed graphs commonly use DFS active-state information or alternative algorithms.

The exact method depends on graph semantics.

## 34. Backend Applications

BFS/DFS appear in:

- service dependency traversal
- workflow execution
- permission inheritance
- package dependency exploration
- network reachability
- topology analysis
- impact analysis

For backend systems, bound traversal by authorization scope and resource limits when graphs are user-controlled.

## 35. AI Applications

Traversal is fundamental to:

- state-space search
- planning
- game trees
- knowledge-graph neighborhood expansion
- hierarchical retrieval
- agent tool graphs

BFS corresponds naturally to minimum-step exploration; DFS can support deep exploration under memory constraints.

## 36. Traversal Invariants

### BFS

- every discovered vertex is marked visited
- queue contains discovered but not yet processed vertices
- distances are nondecreasing through the queue
- parent of each non-source discovered vertex is a predecessor on a shortest path

### DFS

- a vertex is not recursively entered twice
- active recursion/stack state represents an exploration frontier
- descendants are completed before an active vertex finishes

## 37. Defensive Engineering

Validate:

- vertex IDs
- adjacency containers
- missing vertices
- malformed edges
- queue/stack behavior
- traversal limits

For untrusted graph input, prevent uncontrolled memory growth.

## 38. Testing Strategy

Use a reference traversal and randomized graphs.

Check:

- reachable vertex set
- BFS distances
- parent validity
- DFS reachability
- traversal invariants
- disconnected components
- self-loops
- parallel edges
- directed/undirected behavior

## 39. Differential Testing

Run BFS and DFS against an independent reachability oracle such as repeated edge relaxation or a simple reference implementation.

For BFS distance, compare against a brute-force shortest-path calculation on small graphs.

## 40. Complexity Reasoning

Always identify:

```text
V = number of vertices
E = number of edges/adjacency entries
```

Then ask whether each vertex and edge is processed once, multiple times, or requires additional scans.

Representation matters: an adjacency matrix changes the neighbor-discovery cost.

## 41. Common Mistakes

- forgetting the visited set
- marking visited too late in BFS and creating duplicate queue entries
- assuming DFS finds shortest paths
- using recursive DFS on extremely deep graphs in JavaScript
- forgetting disconnected components
- accidentally reversing directed edges
- ignoring neighbor ordering when deterministic output is required
- confusing discovered with fully processed

## 42. Interview Framework

When asked to traverse a graph:

1. clarify directed/undirected semantics
2. identify representation
3. define visited state
4. choose BFS or DFS from the objective
5. state the invariant
6. implement traversal
7. derive `O(V + E)` for adjacency lists
8. discuss auxiliary space
9. cover disconnected graphs and edge cases

## 43. Revision Checklist

- [ ] Implement BFS.
- [ ] Implement iterative DFS.
- [ ] Implement recursive DFS.
- [ ] Track visited state correctly.
- [ ] Track BFS distance.
- [ ] Reconstruct BFS paths.
- [ ] Build traversal parent trees.
- [ ] Traverse disconnected graphs.
- [ ] Implement multi-source BFS.
- [ ] Understand bidirectional BFS.
- [ ] Use DFS timestamps/colors.
- [ ] Explain BFS vs DFS trade-offs.
- [ ] Handle self-loops and parallel edges.
- [ ] Handle directed and undirected graphs.
- [ ] Analyze adjacency-list vs matrix traversal.
- [ ] Test with randomized graphs.
- [ ] Apply traversal to backend and AI systems.

## Key Takeaways

1. BFS explores by layers and gives shortest edge-count paths in unweighted graphs.
2. DFS explores deeply and is a foundation for structural graph algorithms.
3. The visited-state invariant prevents repeated discovery and infinite traversal on cycles.
4. Both traversals are `O(V + E)` with adjacency lists under standard unit-cost assumptions.
5. Representation, neighbor ordering, recursion depth, and output requirements affect practical behavior.
6. Multi-source and bidirectional BFS extend the basic traversal model into powerful search patterns.
