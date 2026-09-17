# 30 — DP on Trees & Graphs with Small State Boundaries

> **Phase 17 — Dynamic Programming**

## 1. Core Idea

Many difficult graph DPs become manageable when the interaction between a processed region and the unprocessed region is described by a small boundary state.

The mental model is:

> **DP becomes scalable when the information crossing a decomposition boundary is small, sufficient, and composable.**

This chapter unifies tree DP, treewidth/profile DP, separator-based reasoning, frontier states, and graph decomposition as one state-compression principle.

---

## 2. Boundary State

Suppose a graph is processed piece by piece. Internal vertices may no longer matter individually, but boundary vertices can still interact with future decisions.

A DP state should summarize exactly the information that future processing can observe.

```text
processed region
      ↓
  boundary state
      ↓
unprocessed region
```

If the boundary has size `b` and each boundary position has `S` possible states, a naive state space may be `S^b`.

The goal is to keep `b` small or exploit additional structure.

---

## 3. Trees as the Simplest Boundary Decomposition

Rooting a tree gives each subtree a boundary consisting of its parent connection.

That tiny boundary is why tree DP is so powerful.

Typical states include:

- node selected/not selected;
- distance to nearest selected node;
- matching status;
- resource remaining;
- color assignment;
- accumulated aggregate.

The postorder recurrence summarizes the subtree before combining it with the parent.

---

## 4. Frontier DP

In a path-like or grid-like processing order, the boundary is called a frontier/profile.

The DP processes vertices or cells while storing only frontier information.

This is the generalization behind profile DP:

```text
processed cells
████████████
────────────  ← frontier
future cells
░░░░░░░░░░░░
```

The frontier width, not the total number of cells, controls the exponential component of the state space.

---

## 5. Separator Thinking

A separator is a small vertex set whose removal disconnects regions.

If all interactions between two regions pass through a small separator, a DP can summarize one side by the separator configuration.

This creates a general divide-and-compose pattern:

1. choose a separator;
2. enumerate feasible boundary states;
3. solve each region conditionally;
4. combine compatible summaries.

---

## 6. Tree Decomposition Connection

A tree decomposition organizes graph vertices into bags satisfying:

1. every vertex appears in at least one bag;
2. every edge has both endpoints in some bag;
3. bags containing a vertex form a connected subtree.

The largest bag size determines the treewidth parameter.

DP over a valid decomposition transfers information through bag boundaries.

This is the formal generalization of frontier and tree DP.

---

## 7. Nice Decomposition Operations

A convenient decomposition uses operations such as:

- leaf;
- introduce vertex;
- forget vertex;
- introduce edge;
- join.

Each operation has a local DP transition.

The power of this representation is that a complex graph problem becomes a sequence of small semantic transformations.

---

## 8. Independent Set Example

For each bag, store whether each boundary vertex is selected.

When an edge is introduced, reject states selecting both endpoints.

When a vertex is forgotten, its contribution can be finalized because all relevant incident edges have already been processed.

The recurrence demonstrates a general principle:

> **Forget information only when the future can no longer observe it.**

---

## 9. Coloring Example

For `q`-coloring, a bag state assigns one of `q` colors to every boundary vertex.

An introduced edge requires different endpoint colors.

The raw state count is roughly `q^b`, where `b` is the boundary size.

Symmetry or canonicalization can sometimes reduce equivalent colorings when the problem permits it.

---

## 10. Connectivity States

Connectivity problems require more than independent per-vertex labels.

The DP may need to remember which boundary vertices belong to the same connected component.

This naturally creates a **partition state**.

For boundary vertices `[a,b,c,d]`, examples include:

```text
{a,b} | {c} | {d}
{a,c} | {b,d}
{a,b,c,d}
```

The number of partitions grows quickly, which explains why connectivity DP is substantially harder than binary-label DP.

---

## 11. Canonicalizing Partition States

Two partition states that differ only by component labels are equivalent.

Use a canonical representation such as restricted-growth labels:

```text
[0, 0, 1, 2]
```

instead of arbitrary IDs like:

```text
[17, 17, 42, 91]
```

Canonicalization makes hashing, equality checks, and memoization reliable.

---

## 12. Forget Transitions

When a boundary vertex disappears from the frontier, ask what information must be retained.

For connectivity problems, forgetting a vertex can also require detecting whether a component has become permanently closed.

For example, if the final solution requires one connected component, prematurely closing a component may invalidate the state.

Forget transitions therefore often contain the most subtle correctness conditions.

---

## 13. Join Transitions

A join combines two independently processed subgraphs sharing the same boundary.

The two child summaries must be compatible.

For additive objectives, values may combine by addition while shared boundary contributions may need correction to avoid double counting.

For connectivity, the two child partitions must be merged consistently.

Join transitions are a common source of state and counting bugs.

---

## 14. Sparse Boundary DP

The theoretical state space may be huge while the reachable state set is small.

A `Map` keyed by canonical state can therefore outperform a dense table.

A useful engineering pattern is:

```text
frontier state → best/count/value
```

After each processing step:

1. generate transitions;
2. merge equivalent states;
3. optionally prune dominated states;
4. continue with the next frontier.

---

## 15. Dominance Pruning

Sometimes one boundary state is never better than another under every future continuation.

If a formal dominance relation exists, dominated states can be removed.

Example pattern:

```text
same structural boundary
+ state A has no worse resource/value than state B
→ B may be removable
```

This requires a proof. Heuristic pruning can silently destroy optimal solutions.

---

## 16. Choosing a Processing Order

The same graph can produce radically different boundary sizes under different elimination orders.

Good ordering tries to minimize the maximum active frontier.

This connects directly to:

- treewidth;
- pathwidth;
- induced width;
- variable elimination;
- sparse matrix ordering.

The algorithm may be identical while the state-space size changes dramatically.

---

## 17. Variable Elimination Connection

A graphical model can be viewed as a factorized computation over variables.

Eliminating one variable combines factors and creates a new factor over its remaining neighbors.

The current boundary is the remaining dependency interface.

This is mathematically close to tree-decomposition DP:

```text
variable elimination
        ↕
treewidth DP
        ↕
frontier DP
```

The shared concept is controlling intermediate state scope.

---

## 18. Parameterized Complexity

Algorithms exponential in treewidth can still be efficient when treewidth is small.

Typical form:

`O(f(w) * poly(n))`

where `w` is a width parameter.

This is different from pretending the algorithm is polynomial in all inputs.

Always state which parameter controls the exponential term.

---

## 19. State Compression Beyond Width

Width is not the only compression opportunity.

Also look for:

- symmetry;
- equivalent states;
- bitmasks;
- canonical partitions;
- monotonicity;
- dominance;
- sparse reachability;
- algebraic transforms;
- repeated transition operators.

Advanced DP often combines several of these simultaneously.

---

## 20. Reconstruction

To recover a solution, store parent references between boundary states or record enough local decisions to recompute them later.

For very large state tables, checkpointing can reduce memory.

For optimization problems, reconstruction must preserve the same tie-breaking semantics as the value DP.

A value-only DP and a witness-producing DP are distinct engineering requirements.

---

## 21. Correctness Invariant

At every frontier, define exactly what a state means.

A strong invariant is:

> For each boundary configuration, the stored value equals the optimal/count/feasible summary over all processed subgraphs producing exactly that boundary behavior.

Every transition must preserve this invariant.

This is the cleanest proof framework for frontier DP.

---

## 22. Complexity Analysis

A generic boundary DP may have complexity of the form:

`O(n * T(b) * transitionsPerState)`.

Here `T(b)` is the number of reachable boundary states.

For a simple binary boundary, `T(b) ≤ 2^b`.

For coloring, `T(b) ≤ q^b`.

For connectivity partitions, the state count can grow according to Bell-number behavior.

These are parameterized bounds, not merely implementation details.

---

## 23. Backend Engineering Applications

Boundary-state reasoning appears in:

- dependency graphs with small interfaces;
- workflow partitioning;
- configuration compatibility;
- network segmentation;
- resource-constrained deployment planning;
- small-width service dependency graphs.

When a large problem can be decomposed into regions connected by a small interface, exact DP may become practical.

---

## 24. AI Engineering Applications

The same idea applies to structured search with small interfaces:

- factor-graph inference;
- constrained sequence structures;
- finite-width graphical models;
- structured planning;
- exact inference on bounded-treewidth graphs.

The relevant lesson is not “use DP for AI,” but:

> **Exploit bounded interaction width when exact structured computation is required.**

---

## 25. Testing Strategy

For tiny graphs, compare boundary DP against brute force.

Also test:

- different processing orders;
- equivalent canonical states;
- empty boundaries;
- single-vertex boundaries;
- disconnected regions;
- join operations;
- forget operations;
- duplicate edges;
- symmetry transformations;
- dominated-state removal.

If two valid decompositions produce different answers, the implementation or state invariant is wrong.

---

## 26. Recognition Framework

When a graph problem feels exponential, ask:

1. Can I decompose the graph?
2. What information crosses the decomposition boundary?
3. How large is that boundary?
4. Can the boundary state be canonicalized?
5. Are some states dominated?
6. Can I choose a better elimination order?
7. Is the graph's treewidth/pathwidth small?
8. Can sparse state storage help?
9. Can repeated local transitions be accelerated?
10. What exact invariant proves the summary is sufficient?

---

## 27. Common Failure Modes

- forgetting a boundary interaction;
- forgetting a vertex too early;
- double-counting shared boundary contributions at joins;
- using non-canonical component labels;
- pruning without a dominance proof;
- choosing a poor processing order;
- hiding exponential dependence on width;
- confusing treewidth with number of vertices;
- storing the entire processed subgraph instead of its interface summary;
- reconstructing a witness inconsistent with the value DP.

---

## 28. Master Pattern

```text
choose decomposition / processing order
        ↓
identify boundary
        ↓
define minimum sufficient boundary state
        ↓
canonicalize / compress
        ↓
process local structure
        ↓
merge equivalent states
        ↓
prune only with proven dominance
        ↓
forget information when future cannot observe it
        ↓
continue across the decomposition
        ↓
reconstruct / verify witness
        ↓
prove boundary-summary invariant
```

The deepest lesson is:

> **The real complexity of decomposition DP is often determined by the information crossing the boundary, not by the total size of the graph.**

---

## 29. Mastery Checklist

- [ ] Explain boundary-state DP from first principles.
- [ ] Re-derive tree DP as a one-boundary special case.
- [ ] Implement frontier/profile DP.
- [ ] Work with separator-based decomposition.
- [ ] Understand nice tree decompositions.
- [ ] Implement introduce/forget/edge/join transitions.
- [ ] Implement coloring DP over a bag.
- [ ] Implement connectivity partition states.
- [ ] Canonicalize partition states.
- [ ] Detect invalid component closure on forget.
- [ ] Handle join transitions without double counting.
- [ ] Use sparse boundary-state storage.
- [ ] Prove dominance before pruning.
- [ ] Compare elimination orders.
- [ ] Understand treewidth/pathwidth/induced width.
- [ ] Connect DP to variable elimination.
- [ ] Analyze parameterized complexity.
- [ ] Implement reconstruction.
- [ ] Differential-test against brute force.
- [ ] Complete backend and AI labs.
