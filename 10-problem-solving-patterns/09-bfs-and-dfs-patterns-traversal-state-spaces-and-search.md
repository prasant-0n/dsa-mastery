# 10.09 — BFS & DFS Patterns: Traversal, State Spaces & Search

## 1. Objective

BFS and DFS are systematic ways to explore connected or state-based spaces.

```text
BFS → frontier by distance/layers
DFS → depth-first exploration/backtracking structure
```

## 2. Graph Mental Model

A graph contains vertices and edges. Traversal requires defining:

- starting state;
- neighbors;
- visited semantics;
- stopping condition;
- output or state transition.

## 3. BFS

BFS uses a queue and explores nodes in increasing number of edges from the source.

For an unweighted graph, the first discovered shortest-path distance is minimal under standard traversal assumptions.

## 4. BFS Invariant

A typical invariant is:

> The queue contains discovered but not fully processed states, ordered by nondecreasing distance from the source.

## 5. DFS

DFS follows one branch as deeply as possible before returning.

It can be implemented recursively or with an explicit stack.

## 6. DFS Invariant

The exact invariant depends on the task, but the active recursion/stack represents the current exploration frontier and the visited structure prevents unintended repeated traversal.

## 7. Visited State

A visited set prevents repeated exploration when the state graph contains cycles or converging paths.

But in state-space search, the state identity must include every variable that affects future transitions.

## 8. Tree vs Graph

Trees have a unique simple path between connected nodes, while general graphs may contain cycles and multiple paths.

Do not automatically omit visited tracking in a graph.

## 9. Adjacency Representations

Common representations:

- adjacency list;
- adjacency matrix;
- implicit neighbors;
- edge list.

The representation affects memory and traversal cost.

## 10. BFS Shortest Path

For an unweighted graph:

```text
BFS from source
→ first distance to target is shortest edge count
```

To reconstruct the path, store a predecessor/parent for each discovered state.

## 11. Multi-Source BFS

Initialize the queue with every source at distance zero.

The resulting distance represents the nearest source under unweighted graph distance.

Applications include grids, infection/spread models, and nearest-resource problems.

## 12. Level-Order Processing

Process the queue in layers when the problem depends on distance or number of steps.

Possible techniques:

- capture current queue length;
- store explicit distance;
- store `(state, distance)` pairs.

## 13. 0-1 BFS

When edge weights are only `0` or `1`, a deque can replace a general priority queue.

Zero-cost transitions go to the front; unit-cost transitions go to the back.

This preserves nondecreasing distance processing under the restricted weight model.

## 14. DFS Components

Run DFS/BFS from every unvisited vertex to identify connected components.

The outer loop handles disconnected graphs; traversal handles one component at a time.

## 15. Cycle Detection

Undirected graphs can use parent-aware DFS or other traversal logic.

Directed graphs require distinguishing states such as:

```text
unvisited / active / finished
```

A back edge to an active node indicates a directed cycle under standard DFS semantics.

## 16. Topological Reasoning

DFS can produce finishing-order information for directed acyclic graphs.

Kahn's algorithm uses indegrees and a queue instead.

Both approaches rely on acyclicity for a valid topological ordering.

## 17. Backtracking as DFS

Many combinatorial searches are DFS over an implicit state tree:

```text
choose
→ recurse
→ undo
→ choose another option
```

The state must be restored correctly after each branch.

## 18. State-Space Search

For puzzles or planning problems, a node may be a complete configuration rather than a graph vertex explicitly stored in memory.

The transition function generates neighboring configurations.

## 19. State Identity

Two states should share a visited key only when they have equivalent future behavior for the problem.

If a state contains multiple dimensions, encode all relevant dimensions.

## 20. Bidirectional BFS

For suitable unweighted problems with known source and target, search from both ends.

The two frontiers can meet after exploring substantially smaller depth regions when the branching factor is favorable.

The method requires reversible or otherwise constructible reverse transitions.

## 21. DFS Iterative Conversion

Recursive DFS can be transformed into an explicit stack.

To preserve exact traversal behavior, the order in which neighbors are pushed may need to be reversed relative to the recursive implementation.

## 22. Recursion Limits

Deep DFS can exceed JavaScript's call-stack capacity.

Use an explicit stack when depth may be large or input is adversarial.

## 23. Grid Traversal

A matrix can be treated as an implicit graph.

Typical neighbors:

```text
up, down, left, right
```

Diagonal movement or weighted transitions require an explicit rule.

## 24. Flood Fill

BFS or DFS can replace a connected region's value while tracking visited or using the replacement itself as a marker when safe.

Boundary checks are part of correctness.

## 25. Word/Transformation Search

A word-ladder-like problem can model each valid word as a state and legal transformations as edges.

BFS finds the minimum number of transformations under equal edge costs.

## 26. Backend Applications

Traversal patterns appear in:

- dependency graphs;
- service topology;
- workflow states;
- permission graphs;
- network relationships;
- job dependencies;
- nearest-resource discovery.

## 27. AI Applications

Applications include:

- state-space planning;
- candidate exploration;
- beam/frontier search foundations;
- symbolic reasoning;
- graph-based retrieval;
- constraint-state exploration.

## 28. Complexity

For adjacency-list traversal of a graph with `V` vertices and `E` edges:

```text
Time: O(V + E)
Space: O(V)
```

This assumes neighbor enumeration is proportional to the represented edges.

For grids, use the number of cells and transitions actually processed.

## 29. Common Mistakes

1. Marking visited too late and enqueuing duplicates unnecessarily.
2. Using an incomplete state key.
3. Forgetting disconnected components.
4. Treating weighted graphs as unweighted.
5. Using recursive DFS on extremely deep input.
6. Mutating shared backtracking state incorrectly.
7. Losing parent information needed for path reconstruction.
8. Confusing graph cycles with repeated values.

## 30. Edge Cases

Test:

- empty graph;
- single vertex;
- disconnected graph;
- self-loop;
- parallel edges;
- cycle;
- no path;
- source equals target;
- deep chain;
- grid boundary cells;
- repeated equivalent states.

## 31. Correctness Proof

A traversal proof should establish:

1. every generated valid neighbor is considered;
2. invalid states are never processed as valid states;
3. visited semantics do not discard a state that could produce a different required result;
4. BFS ordering supports any shortest-distance claim;
5. DFS/backtracking restores state correctly after each branch.

## 32. Interview Framework

When a search-space problem appears:

```text
1. What is the state?
2. What are the transitions?
3. Is the space explicit or implicit?
4. Do edge costs matter?
5. Do I need shortest distance or any solution?
6. What is the correct visited identity?
7. Is recursion depth safe?
8. Do I need path reconstruction?
9. Can multiple sources be initialized together?
10. What are V, E, branching factor, and depth?
```

## 33. Revision Checklist

- [ ] I can implement BFS with a queue.
- [ ] I can implement DFS recursively and iteratively.
- [ ] I understand visited-state design.
- [ ] I can reconstruct shortest paths.
- [ ] I understand multi-source BFS.
- [ ] I understand 0-1 BFS.
- [ ] I can reason about cycles.
- [ ] I can model grids as implicit graphs.
- [ ] I can model backtracking as DFS over states.
- [ ] I can explain backend and AI applications.

## 34. Key Takeaways

1. **BFS organizes exploration by distance layers; DFS organizes exploration by depth.**
2. **The most important design decision is often the state representation and visited identity.**
3. **BFS gives shortest edge-count paths in unweighted graphs under its standard assumptions.**
4. **Backtracking is DFS over a state tree with explicit state restoration.**
5. **Traversal complexity must be expressed in terms of the actual state and transition space, not merely input syntax.**
