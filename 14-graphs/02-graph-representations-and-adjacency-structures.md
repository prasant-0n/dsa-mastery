# 14.02 — Graph Representations & Adjacency Structures

## 1. Concept Definition

A graph can be represented in multiple ways. The representation determines how efficiently the program can answer operations such as:

- add/remove edge
- test whether an edge exists
- enumerate neighbors
- iterate all edges
- store edge weights
- update graph structure

The algorithm and the representation are separate design decisions.

## 2. Representation Decision

The main choices are:

1. edge list
2. adjacency list
3. adjacency matrix
4. compressed/specialized adjacency structures

Choose based on graph size, density, query pattern, mutability, and memory limits.

## 3. Edge List

An edge list stores each edge as a record:

```js
[
  [0, 1],
  [1, 2],
  [2, 3]
]
```

Weighted form:

```js
[
  [0, 1, 5],
  [1, 2, 3]
]
```

### Strengths

- simple
- compact
- natural input format
- efficient for iterating every edge

### Weaknesses

- neighbor enumeration requires scanning edges unless indexed
- direct edge existence is typically `O(E)`

## 4. Adjacency List

Each vertex stores its outgoing or incident edges:

```text
0 → [1, 2]
1 → [2]
2 → [3]
3 → []
```

For a sparse graph this is usually the natural representation for BFS, DFS, shortest-path algorithms, and dependency traversal.

## 5. Weighted Adjacency List

Store destination and weight together:

```js
[
  { to: 1, weight: 5 },
  { to: 2, weight: 8 }
]
```

This makes weighted traversal explicit and prevents accidentally treating weights as vertex identifiers.

## 6. Directed Adjacency List

For a directed edge `A → B`, store `B` in A's outgoing list.

Do not automatically add A to B unless the graph is explicitly undirected.

## 7. Undirected Adjacency List

For `{A, B}`, store both directions:

```text
A → B
B → A
```

This symmetry is a correctness invariant.

## 8. Adjacency Matrix

An adjacency matrix uses a `V × V` table:

```text
    A B C
A   0 1 0
B   1 0 1
C   0 1 0
```

For an unweighted graph, entries commonly represent presence or absence.

For weighted graphs, entries can store weights with an explicit sentinel for “no edge.”

## 9. Matrix Trade-Off

### Advantages

- direct edge lookup: `O(1)`
- simple implementation
- predictable memory layout
- useful for dense graphs and matrix algorithms

### Disadvantages

- `O(V²)` space
- enumerating neighbors costs `O(V)` per vertex
- unsuitable for very large sparse graphs

## 10. Sparse vs Dense

A useful conceptual comparison:

```text
Sparse: E is much smaller than V²
Dense:  E approaches V²
```

Sparse graphs generally favor adjacency lists.

Dense graphs can make matrix representations more reasonable.

## 11. Degree Queries

With adjacency lists, outdegree is typically the length of the outgoing list.

With matrices, degree requires scanning a row unless additional metadata is maintained.

For undirected matrices, degree is derived from the number of present incident entries.

## 12. Reverse Adjacency

Some algorithms require incoming neighbors.

For directed graph `A → B`, reverse adjacency stores:

```text
B → A
```

Maintaining both forward and reverse lists can make predecessor queries efficient at the cost of additional memory and update work.

## 13. Edge Metadata

Production graphs may store:

```js
{
  to,
  weight,
  capacity,
  latency,
  id,
  type,
  metadata
}
```

Separate large metadata from hot traversal structures when memory locality matters.

## 14. Parallel Edges

If multiple edges connect the same vertices, an adjacency list can preserve them as separate records.

A matrix cannot naturally preserve arbitrary parallel edges in a single scalar cell without an additional representation.

This is an important representation limitation.

## 15. Self-Loops

A self-loop from `A` to `A` appears at `A → A` in a matrix and in A's adjacency list.

Whether it contributes one or two to an undirected degree depends on the mathematical convention being used; define the convention explicitly.

## 16. Set-Based Adjacency

A neighbor `Set` can simplify edge-existence checks:

```js
adj[u].has(v)
```

Expected lookup is often `O(1)`, but this introduces hash-table overhead and may use more memory than a compact array.

## 17. Sorted Adjacency Lists

Keeping neighbors sorted can enable:

- deterministic traversal
- binary search for membership
- merge-based graph operations
- reproducible tests

But maintaining sorted order increases update cost.

## 18. Array vs Set Neighbors

| Representation | Neighbor iteration | Membership | Typical memory |
|---|---:|---:|---:|
| Array | excellent | `O(degree)` | lower |
| Sorted array | excellent | `O(log degree)` | lower |
| Set | excellent | expected `O(1)` | higher |

The correct choice depends on workload.

## 19. Typed Arrays & Packed Graphs

Large static graphs can benefit from compact numeric storage using typed arrays or CSR-like layouts.

The objective is to reduce object overhead and improve locality.

## 20. Compressed Sparse Row

CSR represents adjacency information using contiguous arrays, conceptually:

```text
offsets → where each vertex's neighbors begin/end
neighbors → packed destination IDs
```

For static sparse graphs this can greatly reduce per-edge object overhead.

## 21. CSR Mental Model

For vertex `u`:

```text
start = offsets[u]
end   = offsets[u + 1]

neighbors[start ... end)
```

Its key invariant is that offsets partition the neighbor array correctly.

## 22. Dynamic vs Static Graphs

Object-based adjacency lists are convenient for mutable graphs.

Packed representations are attractive for large mostly-static graphs.

Dynamic packed structures require more complex update strategies.

## 23. Conversion

A common pipeline is:

```text
edge list
   ↓
adjacency list
   ↓
algorithm
   ↓
packed/static representation
```

Conversions cost time and memory, so avoid repeated conversions in hot paths.

## 24. Representation Complexity

For `V` vertices and `E` edges:

- edge list: `O(E)` space
- adjacency list: `O(V + E)` space
- adjacency matrix: `O(V²)` space
- CSR: `O(V + E)` space

Actual memory depends heavily on language-level object overhead.

## 25. Backend Applications

Representation matters in:

- service dependency graphs
- network topology
- workflow DAGs
- authorization graphs
- recommendation systems
- package dependency systems

A service graph with millions of sparse edges should not automatically become a JavaScript object matrix.

## 26. AI Applications

Graph representations appear in:

- knowledge graphs
- search state spaces
- planning graphs
- agent tool graphs
- recommendation graphs
- graph neural-network inputs

Static AI datasets may benefit from packed representations, while rapidly changing agent state may favor flexible adjacency structures.

## 27. Cache and Locality

Two algorithms with the same Big-O complexity can have very different performance.

Contiguous arrays can improve locality compared with pointer-heavy object graphs.

Measure before making production claims.

## 28. Representation Invariants

### Adjacency list

- every vertex has a valid container
- every referenced destination is valid
- weighted records contain valid weights
- undirected graphs have symmetric edges when required

### Matrix

- dimensions equal `V × V`
- entries follow the chosen absence/presence convention
- undirected matrices are symmetric when parallel-edge semantics permit it

### CSR

- `offsets.length = V + 1`
- offsets are nondecreasing
- `offsets[V] = neighbors.length`
- every destination is valid

## 29. Choosing a Representation

Use this decision sequence:

```text
1. Is the graph static or dynamic?
2. Sparse or dense?
3. Need neighbor enumeration?
4. Need frequent edge existence checks?
5. Need incoming edges?
6. Are parallel edges required?
7. Are weights/metadata required?
8. Is memory tightly constrained?
9. Is locality important?
10. What does the algorithm require?
```

## 30. Common Mistakes

- using an adjacency matrix for a huge sparse graph
- forgetting the reverse edge in an undirected list
- silently collapsing parallel edges
- using `0` as “no edge” when zero-weight edges are valid
- confusing missing vertex with isolated vertex
- rebuilding large representations repeatedly
- ignoring object overhead in JavaScript

## 31. Complexity Comparison

| Operation | Edge List | Adjacency List | Matrix |
|---|---:|---:|---:|
| add edge | `O(1)` append* | expected `O(1)` append* | `O(1)` |
| edge lookup | `O(E)` | `O(degree)` / expected `O(1)` with Set | `O(1)` |
| enumerate neighbors | `O(E)` | `O(degree)` | `O(V)` |
| iterate all edges | `O(E)` | `O(V + E)` | `O(V²)` |
| space | `O(E)` | `O(V + E)` | `O(V²)` |

`*` assumes the chosen representation permits the operation without duplicate checking or ordering maintenance.

## 32. Correctness Reasoning

When converting representations, prove semantic equivalence:

```text
edge exists in source
        ↕
edge exists in destination
```

For weighted graphs, also preserve the intended weight and duplicate-edge semantics.

## 33. Testing Strategy

Use differential tests:

1. generate a graph
2. encode it as edge list
3. convert to adjacency list
4. convert to matrix
5. compare edge existence
6. compare degrees
7. compare neighbor sets
8. compare weights

This catches representation bugs early.

## 34. Benchmarking Strategy

Benchmark separate workloads:

- edge-heavy construction
- random edge lookup
- high-degree neighbor enumeration
- full traversal
- sparse graph memory
- dense graph memory
- static packed graph traversal

Do not use one benchmark to represent every graph workload.

## 35. Interview Framework

When asked “Which graph representation would you use?” answer from requirements:

> The graph has `V` vertices and `E` edges, it is [sparse/dense], and the dominant operation is ____. Therefore I would use ____. It gives __ complexity and __ space. The main trade-off is ____.

## 36. Revision Checklist

- [ ] Implement edge lists.
- [ ] Implement adjacency lists.
- [ ] Implement adjacency matrices.
- [ ] Convert between representations.
- [ ] Handle directed and undirected semantics.
- [ ] Handle weighted edges.
- [ ] Handle parallel edges and self-loops.
- [ ] Explain array vs Set neighbors.
- [ ] Explain reverse adjacency.
- [ ] Explain CSR and packed representations.
- [ ] Compare sparse and dense graphs.
- [ ] Analyze memory and locality.
- [ ] Validate representation invariants.
- [ ] Differential-test conversions.
- [ ] Benchmark workload-specific performance.
- [ ] Apply the choices to backend and AI systems.

## Key Takeaways

1. Graph representation is an engineering decision, not a cosmetic choice.
2. Adjacency lists are generally suited to sparse neighbor traversal.
3. Matrices provide simple `O(1)` edge access at `O(V²)` space.
4. Edge lists are excellent for simple storage and edge-centric processing.
5. Packed structures such as CSR are valuable for large static sparse graphs.
6. The representation must preserve graph semantics such as direction, weights, self-loops, and parallel edges.
