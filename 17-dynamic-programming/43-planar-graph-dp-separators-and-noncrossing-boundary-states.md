# 43 — Planar Graph DP: Separators, Embeddings & Noncrossing Boundary States

## 0. Learning Objective

Planar graphs expose a powerful form of structure that is different from ordinary tree or cactus decomposition: **topology constrains how partial solutions can cross a separator**.

This lesson develops the reusable pattern:

> **Choose a planar embedding and a small separator, summarize everything on each side by the information exposed on the separator, and exploit noncrossing structure to keep the boundary state manageable.**

The goal is not to memorize one planar-graph problem. The goal is to recognize when planar geometry turns a large graph problem into a bounded-boundary dynamic program.

This chapter focuses on exact DP ideas for small-boundary planar regions, separator-based recursion, outerplanar special cases, and noncrossing connectivity states. It deliberately distinguishes these methods from generic treewidth DP: the planar embedding gives additional order and topology that can dramatically constrain legal boundary configurations.

---

## 1. Why Planarity Creates DP Structure

A planar graph can be drawn in the plane so that edges intersect only at common endpoints.

A separator can split the graph into regions while exposing only a relatively small boundary.

Conceptually:

```text
whole planar graph
       |
       v
separator / cycle / boundary
       |
  +----+----+
  |         |
region A  region B
  |         |
  +----+----+
       |
 boundary-state summary
```

The separator becomes the DP interface.

The central question is therefore:

> What information about the solution can cross the separator without needing the entire interior?

For many connectivity problems, the answer is not merely a bit per boundary vertex. Instead, it is a **partition of boundary terminals**. Planarity then adds an important restriction: many such partitions must be noncrossing.

---

## 2. Planar Embedding Is Algorithmic Data

For a general graph, an adjacency list describes connectivity.

For planar DP, the cyclic order of edges around each vertex can matter.

A combinatorial embedding records, for each vertex:

```text
incident edges in clockwise/counterclockwise order
```

This order lets us reason about:

- faces;
- boundary walks;
- separator cycles;
- inside versus outside;
- whether two boundary connections cross.

Do not discard embedding information when the DP relies on topology.

A graph being planar is a property; a specific embedding is an algorithmic representation.

---

## 3. Faces and Boundary Walks

Given a planar embedding, walking along an oriented edge and repeatedly taking the next edge in cyclic order lets us enumerate face boundaries.

The resulting boundaries may repeat vertices or edges in non-2-connected graphs, so implementation must not assume every face is a simple cycle.

A face-walk representation can be used to build:

- dual adjacency;
- outer-face order;
- separator candidates;
- region boundaries.

This is foundational for planar DP because the separator state is often indexed in boundary order.

---

## 4. Outerplanar Graphs as the Warm-Up

Outerplanar graphs admit an embedding where all vertices lie on the outer face.

This creates an especially clean boundary order:

```text
v0 v1 v2 v3 ... vk-1
\_________________/
```

Many interval and polygon-style DPs can be understood as outerplanar DP.

Examples include:

- triangulation;
- maximum independent set on special outerplanar structures;
- noncrossing matching;
- bounded-width chord selection.

This is a useful bridge from interval DP to general planar boundary-state DP.

---

## 5. Separator DP Mental Model

Suppose a separator `S` divides a graph into interior pieces.

For each region define:

```text
DP(region, boundary configuration)
```

A boundary configuration records exactly the information needed to merge that region with neighboring regions.

The merge pattern is:

```text
solve child region A
solve child region B
       |
       v
combine compatible boundary states
       |
       v
parent-region summary
```

The challenge is state explosion.

If `|S| = b`, a naive subset state can already cost `2^b` states, while arbitrary set partitions can grow super-exponentially. Planarity gives us a smaller family for many connectivity states.

---

## 6. Local Selection States Versus Connectivity States

There are two broad categories of boundary information.

### Local states

Examples:

```text
selected / not selected
color
capacity residue
degree class
```

These often give something like:

```text
S^b
```

states for `S` local possibilities per boundary vertex.

### Connectivity states

A partial solution may connect boundary vertices into components.

Example:

```text
1---2       3---4
```

might expose partition:

```text
{{1,2}, {3,4}}
```

For general graph boundaries, every partition may be possible.

For planar regions, legal connections cannot cross in the embedding. This leads to noncrossing partitions.

---

## 7. Noncrossing Partitions

Place boundary vertices around a circle in their embedding order:

```text
1   2   3   4   5   6
 \                 /
  -----------------
```

Suppose a partial planar solution connects pairs of boundary vertices.

A crossing pattern such as:

```text
1 connected to 3
2 connected to 4
```

cannot be realized by internally disjoint connections inside the disk without a crossing.

Therefore connectivity blocks must obey a noncrossing condition.

For boundary order `1,2,3,4`, the partition

```text
{{1,3}, {2,4}}
```

is crossing, while

```text
{{1,2}, {3,4}}
```

is noncrossing.

This topological restriction is one of the most valuable compression mechanisms in planar DP.

---

## 8. Why the Embedding Order Changes the State Space

Without an order, a partition is just an abstract equivalence relation.

With a circular or path order, we can ask whether two blocks interleave.

For blocks `A` and `B`, a crossing witness exists if their boundary occurrences appear in an alternating pattern such as:

```text
A ... B ... A ... B
```

A planar partial solution cannot realize such a crossing connectivity pattern when the boundary encloses a disk-like region.

Therefore the state representation should include:

```text
boundary order + canonical noncrossing partition
```

not an arbitrary hash of sets.

---

## 9. Canonical Encoding of a Boundary Partition

A practical encoding assigns each boundary position a component label and canonicalizes labels by first appearance.

Example:

```text
raw labels:       [7,7,3,9,3,9]
canonical labels: [0,0,1,2,1,2]
```

A canonical state must satisfy:

```text
first component seen -> 0
next unseen component -> 1
...
```

This ensures equivalent partitions share the same key.

For planar states, add validation that the partition is noncrossing.

Canonicalization is not just an implementation detail. It is part of the mathematical state definition.

---

## 10. Detecting Crossing Partitions

For a small boundary, a direct validation method is enough.

Given component labels around the boundary, two components `A` and `B` cross if there exist indices:

```text
i < j < k < l
```

with:

```text
label[i] = label[k] = A
label[j] = label[l] = B
```

An `O(b^2)` or `O(b^3)` checker may be perfectly adequate for development and tests.

For production implementations, derive the exact boundary restrictions first and optimize only after profiling.

---

## 11. Small-Separator DP

Let a region have boundary vertices:

```text
B = [b0, b1, ..., b(m-1)]
```

A generic DP shape is:

```text
DP[t][state]
```

where `t` describes how much of the region has been processed.

For each local transition:

```text
oldState + localChoice -> newState + contribution
```

The state stores the partial solution's interaction with the active boundary.

When a vertex leaves the active boundary, the algorithm must **forget** it only after all constraints involving that vertex have been enforced.

This is the same lifecycle idea used in frontier DP, but planarity adds stronger canonicalization opportunities.

---

## 12. Frontier DP on a Planar Embedding

Instead of recursively cutting the graph, one can process vertices/edges in a chosen order while maintaining the current frontier.

Conceptually:

```text
processed region | frontier | unprocessed region
```

The frontier vertices separate past from future.

The state records:

- local attributes on frontier vertices;
- connectivity among frontier vertices;
- any resource/constraint information needed for future transitions.

For planar graphs, the frontier is often arranged along a geometric boundary, making noncrossing partition compression possible.

---

## 13. Connectivity DP With Pairings

Many problems need only pairwise connectivity rather than arbitrary components.

For example:

- Hamiltonian cycle variants;
- noncrossing matchings;
- path systems;
- terminal pair connections.

A pairing state can be represented by parentheses:

```text
( ( ) )
```

or by matching partners.

Planarity implies that pairings are noncrossing, so balanced-parenthesis-like encodings become possible.

This can turn a difficult arbitrary-partition state into a compact combinatorial object.

---

## 14. Connectivity Partitions and the Forget Operation

Suppose the active boundary contains vertex `v`.

Before forgetting `v`, determine its component's remaining boundary vertices.

Cases include:

```text
component has other boundary vertices
    -> remove v, preserve the component

v is the only boundary vertex of its component
    -> component becomes internal
```

Whether the second case is allowed depends on the problem.

For a global connectedness objective, closing a component too early may be invalid.

Therefore every forget rule needs an explicit semantic invariant.

---

## 15. Introduce and Edge Transitions

A frontier DP can use transitions analogous to a nice decomposition:

```text
introduce vertex
introduce edge
forget vertex
```

For an introduced vertex:

```text
state += local vertex choice
```

For an introduced edge:

```text
check compatibility
possibly merge connectivity components
```

For a forgotten vertex:

```text
remove it from boundary state
```

The difference from generic treewidth DP is that planar geometry can constrain which connectivity merges are legal and how states are encoded.

---

## 16. Planar Connectivity Merge

Suppose two boundary vertices are connected by adding an edge.

If they are already in the same component, the operation may:

- be harmless;
- create a cycle;
- violate a problem-specific degree rule.

If they are in different components, merge them.

After merging, canonicalize labels.

Then validate the noncrossing invariant.

A robust implementation should never assume that a locally plausible merge remains globally planar. The state validator should enforce the invariant.

---

## 17. Hamiltonian-Style Degree States

For a planar Hamiltonian-cycle or path DP on a narrow frontier, a boundary vertex may need a degree state such as:

```text
0 = no selected incident edge yet
1 = one selected incident edge
2 = degree complete
```

Connectivity information is tracked simultaneously.

A transition adding an edge updates:

```text
endpoint degree
connectivity partition
objective contribution
```

A premature cycle can be invalid if vertices remain unvisited.

This is a classic example where **local degree state + global connectivity state** must coexist.

---

## 18. Preventing Premature Cycles

Consider building a single Hamiltonian cycle.

If adding an edge joins two vertices already in the same partial component, a cycle is formed.

That cycle is legal only when it completes the entire required structure.

Otherwise:

```text
partial cycle + remaining vertices
```

would create a disconnected final solution.

Thus the DP transition needs a condition like:

```text
if endpoints already connected:
    allow only if this transition closes the final object
```

The exact criterion depends on the problem's invariant.

---

## 19. Separator Recursion

Instead of processing one vertex at a time, recursively divide the planar graph into smaller regions.

At each recursion node:

```text
region
  ↓
separator
  ↓
subregions
```

For each separator configuration:

1. solve child regions;
2. combine compatible boundary states;
3. produce the region summary.

The recursion depth depends on the separator construction.

The engineering challenge is preserving a consistent embedding and boundary orientation across recursive calls.

---

## 20. Cycle Separators

In many planar decompositions, a separator can be represented by a simple closed curve or a small collection of cycles.

A cycle separator divides the embedding into inside and outside regions.

This is particularly convenient because the separator naturally provides a cyclic boundary order.

Then the DP state can be represented as:

```text
configuration on cycle boundary
```

with local states, labels, and connectivity partitions.

The topology of the cycle is part of the state semantics.

---

## 21. Boundary Orientation

When composing two planar regions, the same separator may be traversed in opposite directions.

For example:

```text
region A boundary: 1 -> 2 -> 3 -> 4
region B boundary: 4 -> 3 -> 2 -> 1
```

A merge routine must normalize orientations before comparing states.

Otherwise two mathematically identical boundary configurations may receive different keys.

Store boundary metadata explicitly:

```text
vertex IDs
cyclic order
orientation
inside/outside convention
```

---

## 22. Dual Graph Perspective

The planar dual replaces each face by a vertex and each primal edge by a dual edge crossing it.

This can convert certain cut/face questions into dual connectivity questions.

For planar DP, the dual perspective is useful for recognizing relationships between:

- cuts and cycles;
- primal paths and dual separators;
- face constraints;
- planar minimum-cut structures.

The important engineering rule is to maintain a precise primal-dual correspondence rather than using an informal drawing.

---

## 23. Independent Set on Outerplanar/Small-Width Planar Graphs

A local selection problem may not need connectivity partitions at all.

If the chosen decomposition gives a boundary of size `b`, a state such as:

```text
mask of selected boundary vertices
```

may suffice.

Transitions only need to verify edges crossing the current frontier.

This produces a progression:

```text
ordinary tree DP
    ↓
frontier DP
    ↓
small-boundary planar DP
    ↓
connectivity-aware planar DP
```

Choose the simplest state that proves sufficient.

---

## 24. Coloring on a Planar Boundary

For `k`-coloring, a boundary-local state can be represented as:

```text
color[b0], ..., color[b(m-1)]
```

Equivalent colors under symmetry may sometimes be canonicalized by restricted-growth labeling, but only when color identities are interchangeable under the problem definition.

For fixed small `k` and boundary size `b`, the local state space is at most roughly:

```text
k^b
```

The embedding mainly helps with decomposition and boundary management here; noncrossing connectivity is not automatically relevant.

---

## 25. State Explosion and Boundary Width

The primary complexity parameter is often not the total number of vertices `n`, but the boundary width `b`.

A generic frontier algorithm can look like:

```text
O(n * f(b))
```

where `f(b)` may be:

```text
2^b
k^b
Bell(b)
Catalan(b)
```

depending on the state.

Planar topology can replace an arbitrary partition family with noncrossing partitions, whose growth is Catalan-like rather than Bell-like in common settings.

This is why state design dominates performance.

---

## 26. Dominance and State Pruning

Suppose two states expose the same boundary topology but have different objective/resource values.

If one state is never better under any continuation, it may be discarded.

Example for maximization:

```text
same structural state
A: value=20, resource=5
B: value=17, resource=5
```

A dominates B.

But if resource differs:

```text
A: value=20, resource=5
B: value=17, resource=2
```

neither may dominate the other.

Pruning must be proved from future continuation semantics.

---

## 27. Algebraic DP Over Planar States

Once the boundary transition system is known, the local objective can be generalized.

Optimization:

```text
combine = max
extend = +
```

Counting:

```text
combine = +
extend = *
```

Boolean feasibility:

```text
combine = OR
extend = AND
```

Probability or weighted partition functions may use sum-product or log-space variants.

The topology defines the allowed state transitions; the algebra defines how values combine.

---

## 28. Reconstruction

For a value-only DP, one stores only the optimal value per state.

For reconstruction, store a predecessor such as:

```text
previousState
chosenLocalTransition
childState IDs
```

In recursive separator DP, reconstruction can proceed from the root region downward.

For connectivity problems, every reconstructed local transition must preserve:

- degree constraints;
- component semantics;
- separator compatibility;
- planarity assumptions.

A reconstruction checker should independently validate the final graph object.

---

## 29. Testing Planar DP

Planar DP is especially suitable for aggressive differential testing.

For tiny graphs:

1. enumerate all candidate solutions;
2. compare against the optimized DP;
3. randomly relabel vertices;
4. reverse embedding orientation;
5. serialize and deserialize the embedding;
6. compare equivalent state encodings.

Metamorphic properties may include:

- adding an isolated vertex when the objective is additive;
- duplicating a symmetric representation;
- reversing clockwise order with a corresponding orientation transform;
- relabeling all vertices consistently.

Never use the same algorithmic machinery for both the oracle and optimized solver.

---

## 30. Adversarial Cases

Important cases include:

- articulation vertices;
- repeated vertices in face walks;
- very small separators;
- boundary size one or two;
- disconnected graphs;
- multiple embeddings of the same abstract graph;
- long thin planar grids;
- many equal-value DP states;
- maximum-width frontiers;
- states that differ only by component-label naming;
- illegal crossing partitions;
- premature closed components.

These cases expose incorrect state canonicalization more reliably than random tests alone.

---

## 31. Planar DP Versus Generic Treewidth DP

Both methods exploit small separators.

Generic treewidth DP asks:

```text
Can I find bags of bounded size?
```

Planar DP can additionally exploit:

```text
boundary order
planar embedding
noncrossing connectivity
inside/outside topology
```

For a planar problem, this extra structure can yield a much smaller or more specialized state space than a generic partition over an unordered bag.

The tradeoff is implementation complexity: planar embeddings and boundary topology must be handled correctly.

---

## 32. Planar DP Versus Profile DP

Profile DP processes a geometric frontier, commonly in grids.

Planar separator DP is more general:

```text
profile DP -> regularly shaped frontier
planar separator DP -> irregular graph regions with a small boundary
```

Both use the same deep idea:

> Only the interface between processed and unprocessed regions must be remembered.

The difference is how that interface is generated and what topology it carries.

---

## 33. Backend Engineering Applications

Planar DP is useful when a backend models a genuinely planar or near-planar dependency structure, such as:

- grid routing;
- 2D layout constraints;
- geographic region optimization;
- board/grid resource allocation;
- planar network reliability subproblems;
- PCB/layout-like local optimization abstractions.

A service architecture might be:

```text
input graph + embedding
        ↓
validation
        ↓
separator/frontier builder
        ↓
state encoder
        ↓
DP engine
        ↓
reconstruction + verifier
        ↓
metrics / trace
```

Do not claim arbitrary real-world graphs are planar merely because they can be drawn approximately. The structural assumption must be explicit.

---

## 34. AI Engineering Applications

Planar DP can model exact structured inference when the dependency graph is planar and the separator is small.

Examples:

- grid-structured labeling;
- spatial segmentation constraints;
- exact local consistency on board-like state spaces;
- structured energy minimization under restricted interactions;
- constrained path/selection inference.

A useful abstraction is:

```text
model score
   +
hard planar constraints
   ↓
exact boundary-state DP
   ↓
optimal / counting / probabilistic inference
```

The model can provide local scores while the DP enforces combinatorial validity exactly.

---

## 35. Integrated Recognition Framework

When you see a graph problem, ask:

```text
1. Is the graph planar?
2. Do I have or can I construct an embedding?
3. Is there a small separator/frontier?
4. What information crosses that separator?
5. Is it local state, connectivity, or both?
6. Does planarity forbid crossing boundary states?
7. Can states be canonicalized?
8. Can dominated states be removed safely?
9. What algebra is being computed?
10. How will I reconstruct and independently verify the witness?
```

If the answers line up, you may have a planar separator/frontier DP rather than an ordinary graph algorithm.

---

## 36. Master Pattern

The reusable pattern is:

```text
planar embedding
      ↓
choose boundary / separator
      ↓
define exact interface state
      ↓
exploit boundary order
      ↓
forbid crossing connectivity states
      ↓
canonicalize states
      ↓
process / recurse on region
      ↓
merge compatible summaries
      ↓
prune only by proven dominance
      ↓
reconstruct + independently verify
```

The deepest lesson is not a particular separator theorem. It is this:

> **Topology can be converted into state-space compression.**

Once you learn to see a separator as an interface and the embedding order as information, many difficult planar problems become structured dynamic programs.

---

## 37. Correctness Proof Template

For a planar boundary-state DP, prove four layers.

### Layer A — Structural correctness

Show the decomposition really separates the processed and unprocessed regions as claimed.

### Layer B — State sufficiency

Show that two partial solutions with the same boundary state have identical legal continuation behavior, except for the stored DP value/algebraic summary.

### Layer C — Transition completeness and soundness

Every legal local extension must appear in the recurrence, and every generated transition must preserve all problem constraints.

### Layer D — Composition

Show that combining child/region summaries produces exactly the valid global solutions and counts/optimizes them with no double counting.

For connectivity states, explicitly include the noncrossing invariant in the proof.

---

## 38. Complexity Audit

Write complexity in terms of the actual boundary width `b`, not only `n`.

A useful generic form is:

```text
O(number_of_processed_regions × number_of_states × transition_cost)
```

where:

```text
number_of_states = f(b, localStateCount, connectivityFamily)
```

For example:

```text
local binary states:      ~2^b
k-color states:           ~k^b
noncrossing pairings:     Catalan-like
arbitrary partitions:     Bell-like
```

Then separately account for:

- state canonicalization;
- crossing validation;
- merge cost;
- hash/map overhead;
- reconstruction storage.

Theoretical state count and actual reachable-state count can differ substantially.

---

## 39. Common Failure Modes

1. **Ignoring embedding order.** A graph structure alone may not determine which boundary states are geometrically realizable.
2. **Using arbitrary partitions.** This can destroy the main planar compression opportunity.
3. **Incorrectly canonicalizing labels.** Equal partitions then receive different keys.
4. **Accepting crossing states.** The DP silently explores impossible configurations.
5. **Forgetting orientation.** Two equivalent boundaries may fail to match during merges.
6. **Closing components too early.** A locally valid component can make the final solution disconnected.
7. **Mixing topology and objective logic.** Keep structural transitions separate from algebraic accumulation.
8. **Overengineering the separator.** Start with a small controlled boundary and a clear invariant.
9. **Assuming planar without validation.** Reject or explicitly handle invalid input.
10. **Benchmarking only average cases.** Maximum frontier width often controls runtime.

---

## 40. Interview / Problem-Solving Framework

When given an advanced planar DP problem, explain it in this order:

```text
1. Structural property:
   Why is planarity useful?

2. Decomposition:
   What region/frontier/separator do I process?

3. Boundary:
   Which vertices form the interface?

4. State:
   What exact information crosses it?

5. Topological invariant:
   Why are crossing states impossible?

6. Transition:
   How does a local edge/vertex/region change the state?

7. Canonicalization:
   How do equivalent states share one representation?

8. Complexity:
   What controls f(b)?

9. Correctness:
   Why is the state sufficient and every transition sound/complete?

10. Validation:
    What brute-force and adversarial tests prove the implementation?
```

This makes the reasoning legible instead of presenting the DP as a mysterious collection of maps and bitmasks.

---

## 41. Final Master Takeaways

A strong planar-DP implementation should be able to answer all of these:

- What is the embedding?
- What is the active boundary?
- Why is the boundary small enough?
- What exactly does a state mean?
- Why can crossing connectivity states be rejected?
- How are partitions canonicalized?
- When may a boundary vertex be forgotten?
- How are child region summaries merged?
- What algebra is being computed?
- How is reconstruction performed?
- How is the final solution independently verified?
- What happens when the boundary width reaches the worst case?

The master pattern is:

> **Embedding → separator/frontier → boundary state → noncrossing invariant → canonical DP → verified reconstruction.**

