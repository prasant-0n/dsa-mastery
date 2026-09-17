# 21 — Treewidth DP: Tree Decomposition & Bounded-Width Graph Algorithms

## 1. The Big Idea

Profile DP compresses a grid history through a narrow frontier. **Treewidth DP generalizes the same idea to arbitrary graphs.**

A tree decomposition breaks a graph into overlapping small vertex sets called **bags**. Each bag is a separator: once the relevant boundary information is summarized, distant parts of the graph can be processed independently.

The central question is:

> What is the smallest information that must cross a bag boundary for the remaining computation to be correct?

For treewidth `k`, bags can be kept around size `k + 1`, making many otherwise hard graph problems solvable in time exponential in `k` but polynomial in the number of vertices.

---

## 2. Tree Decomposition

A tree decomposition consists of:

- a tree `T`;
- one bag `B_t` for each tree node `t`;
- every graph vertex appears in at least one bag;
- every graph edge has both endpoints together in some bag;
- for every graph vertex `v`, bags containing `v` form a connected subtree of `T`.

The last condition is the **running-intersection property**.

Width is:

```text
max |B_t| - 1
```

A graph has treewidth `k` if it has a tree decomposition of width `k` and no decomposition of smaller width.

Do not confuse bag size with width: a width-`k` decomposition has bags of size at most `k + 1`.

---

## 3. Why the Running-Intersection Property Matters

Suppose a vertex `v` occurs in two bags.

All bags on the unique tree path between them must also contain `v`.

This guarantees that information about `v` is not silently lost and later resurrected with an inconsistent state.

It is the tree-decomposition analogue of maintaining a correct frontier in profile DP.

A useful mental model is:

```text
graph problem
     ↓
small separators
     ↓
tree-shaped dependency structure
     ↓
DP over separators
```

---

## 4. From Graph to DP

Root the decomposition tree.

For each bag `t`, define a DP table indexed by the information retained on `B_t`.

Examples:

### Independent Set

```text
dp[t][assignment of selected/not-selected bag vertices]
```

### Vertex Coloring

```text
dp[t][color assignment of bag vertices]
```

### Dominating Set

```text
dp[t][local domination status of bag vertices]
```

The state space is often approximately:

```text
q^(k+1)
```

for a `q`-valued bag assignment.

Additional structural states may be required for domination or connectivity problems.

---

## 5. Nice Tree Decompositions

A **nice tree decomposition** transforms a general decomposition into a standardized tree whose nodes are usually one of:

1. Leaf
2. Introduce vertex
3. Forget vertex
4. Join

Some formulations also use explicit introduce-edge nodes.

This normalization makes DP transitions local and reusable.

Conceptually:

```text
leaf
  ↓
introduce
  ↓
introduce
  ↓
forget
  ↓
join
```

The exact convention varies; document your chosen convention before implementing.

---

## 6. Introduce-Vertex Transition

An introduce node adds a vertex `v` to its child bag:

```text
B_parent = B_child ∪ {v}
```

The DP must enumerate legal states for `v` and combine them with the child's state.

For independent set, for example:

- `v` not selected;
- `v` selected if no already-present neighbor is selected.

The important rule is that constraints involving `v` are checked when enough endpoints are simultaneously present in the bag.

---

## 7. Forget-Vertex Transition

A forget node removes `v`:

```text
B_parent = B_child \ {v}
```

At this point, `v` will never appear in an ancestor bag again.

Therefore the DP must aggregate all compatible states of `v` into the smaller parent state.

This is a powerful principle:

> A variable can be forgotten exactly when its future interactions are finished.

This is analogous to eliminating a variable in variable elimination.

---

## 8. Join Transition

A join node has two children with the same bag:

```text
       B
      / \
     X   Y
```

The two subtrees are conditionally independent given the shared bag state.

Therefore compatible child values can be combined.

For counting problems, this often resembles multiplication:

```text
dp[parent][state] += dp[left][state] * dp[right][state]
```

but care is required to avoid counting bag-local contributions twice.

For optimization, use the appropriate combine operator.

---

## 9. Introduce-Edge Nodes

If edge constraints are handled explicitly, an introduce-edge node can represent the moment when edge `(u,v)` becomes active.

For coloring:

```text
color[u] !== color[v]
```

For independent set:

```text
not (selected[u] && selected[v])
```

Explicit edge introduction simplifies correctness because every edge constraint is checked at a well-defined point.

---

## 10. Independent Set on Bounded Treewidth

For each bag assignment:

```text
selected[v] ∈ {0,1}
```

store the best selected-vertex count in the processed subtree.

At introduction:

- reject assignments violating already-visible edges;
- add the contribution of a newly introduced vertex according to the counting convention.

At forgetting:

```text
max over the forgotten vertex's two states
```

At a join:

```text
left + right - duplicated bag contribution
```

The exact subtraction depends on where vertex contributions are charged. A cleaner implementation charges each vertex exactly once, often at introduction.

---

## 11. Vertex Coloring

For `q` colors, each bag state is a color vector:

```text
(c0, c1, ..., ck)
```

Every edge whose endpoints are active must satisfy:

```text
cu !== cv
```

State count is roughly:

```text
O(q^(k+1))
```

per bag.

This demonstrates the parameterized-algorithm pattern:

```text
polynomial in n
exponential in k
```

rather than exponential in the entire graph size.

---

## 12. Dominating Set Requires Richer States

A binary selected/not-selected state is insufficient for many domination formulations.

A bag vertex may be:

- selected;
- dominated by a selected vertex;
- not yet dominated and waiting for a future vertex.

A typical state therefore uses several labels per bag vertex.

This increases the state space, but still makes it depend primarily on the treewidth.

The general lesson is identical to profile DP:

> State design must preserve every future-relevant boundary condition and nothing irrelevant.

---

## 13. Connectivity Problems Are Harder

Problems involving:

- Hamiltonian paths/cycles;
- Steiner trees;
- connected dominating sets;
- connected subgraphs;

must remember how partial components connect through the bag.

This leads to connectivity partitions or canonical labels, closely related to plug DP.

Two states with the same selected vertices but different connectivity are **not equivalent**.

Canonicalization is therefore essential.

---

## 14. State Canonicalization

Suppose a bag has connectivity labels:

```text
[7, 7, 3, 3, 7]
```

The actual numeric labels are irrelevant; only equality relationships matter.

Canonicalize to:

```text
[0, 0, 1, 1, 0]
```

This ensures equivalent states share one key.

Without canonicalization, the same mathematical state can appear under many arbitrary label permutations, causing state explosion.

---

## 15. Treewidth DP as Variable Elimination

There is a deep connection to graphical models.

A bag can be viewed as the current scope of variables that have not yet been eliminated.

Processing the decomposition corresponds to eliminating variables while maintaining factors over small separators.

This connects treewidth DP with:

- factor graphs;
- constraint satisfaction;
- junction-tree algorithms;
- exact probabilistic inference;
- variable elimination;
- weighted model counting.

The common principle is **small intermediate scope**.

---

## 16. Complexity Model

Let:

- `n` = number of graph vertices;
- `k` = treewidth;
- `q` = per-vertex state domain size;
- `S(k)` = number of boundary states;
- `T(k)` = transition cost.

Then a typical bound is:

```text
O(n × S(k) × T(k))
```

For simple `q`-color assignments:

```text
S(k) ≈ q^(k+1)
```

For connectivity states, the number can involve Bell-number-like growth, so the hidden dependence on `k` can be much larger.

Parameterized complexity therefore requires tracking the exact state-space function, not merely saying “exponential in treewidth.”

---

## 17. Finding a Tree Decomposition

There are two distinct engineering problems:

### Given decomposition

Run DP over it.

### Find decomposition

Compute or approximate a low-width decomposition.

Exact treewidth computation is itself difficult in general. Practical systems may use heuristics such as elimination-order strategies.

Common concepts include:

- minimum-degree elimination;
- minimum-fill elimination;
- greedy elimination;
- separator-based heuristics;
- chordal completion intuition.

Do not mix decomposition construction cost into the DP complexity unless the algorithm actually computes the decomposition.

---

## 18. Elimination Ordering View

Instead of starting from bags, think in terms of repeatedly eliminating vertices.

When eliminating `v`, connect its remaining neighbors into a clique if necessary.

The maximum clique size encountered determines the induced width of the ordering.

This gives an operational bridge:

```text
eimination ordering
      ↓
fill edges
      ↓
induced width
      ↓
tree decomposition
      ↓
DP state size
```

A poor ordering can make an otherwise useful bounded-width algorithm infeasible.

---

## 19. Sparse Graphs Are Not Automatically Low-Treewidth

A graph can have few edges and still have large treewidth.

Conversely, some dense-looking structured graphs can have small treewidth.

Therefore do not use:

```text
number of edges
```

as a substitute for treewidth.

The relevant quantity is the size of the smallest separators / bags under a valid decomposition.

---

## 20. Comparison with Profile DP

| Property | Profile DP | Treewidth DP |
|---|---|---|
| Structure | grid/frontier | arbitrary graph decomposition |
| Separator | geometric frontier | bag |
| State | mask/profile | bag assignment/partition |
| Width parameter | grid width | treewidth |
| Local transitions | placements | introduce/forget/join/edge |
| Connectivity | plug profile | bag connectivity partition |
| Generality | grid-focused | graph-general |

Profile DP can be understood as a highly structured special case of boundary-state DP.

---

## 21. Correctness Proof Template

For every bag `t`, define exactly what `dp[t][state]` means.

Then prove:

### Leaf

The table represents exactly the valid configurations of the smallest processed region.

### Introduce

Every legal extension is generated once.

### Edge

Every newly activated constraint is checked exactly once.

### Forget

All possible values of the forgotten variable are aggregated, and no future constraint can depend on it except through the remaining bag.

### Join

The two child regions interact only through the shared bag, so combining equal boundary states is complete and non-duplicating.

### Root

The root bag represents the entire graph after all forgotten variables have been safely eliminated.

This proof pattern is reusable across many bounded-treewidth problems.

---

## 22. Testing Strategy

Use multiple independent validators.

### Tiny brute force

Compare against exhaustive vertex assignments/subsets.

### Decomposition validation

Check:

- every vertex appears;
- every edge is covered;
- bags containing each vertex form a connected subtree.

### Differential DP

Compare equivalent implementations using:

- arbitrary decomposition;
- normalized nice decomposition;
- elimination-order formulation.

### Metamorphic tests

Examples:

- isolated vertices should factor appropriately;
- graph isomorphisms should preserve answers;
- adding an edge cannot increase a maximum independent-set size;
- increasing the coloring domain cannot reduce the number of proper colorings.

### Adversarial tests

Include paths, trees, cycles, cliques, disconnected graphs, duplicate edges, isolated vertices, width-one decompositions, and intentionally poor elimination orders.

---

## 23. Backend Engineering Applications

Bounded-width DP is useful when a real system has a dependency graph with small separators.

Examples:

- exact configuration validation;
- policy constraint evaluation;
- dependency planning;
- workflow optimization;
- resource-allocation constraints;
- feature-interaction optimization.

A practical backend lesson:

> If a constraint graph has a small structural width, exploit that structure instead of treating the graph as an arbitrary dense combinatorial problem.

---

## 24. AI Engineering Applications

Treewidth is especially important in exact inference and structured reasoning.

Applications include:

- factor-graph inference;
- constraint satisfaction;
- probabilistic graphical models;
- weighted model counting;
- structured prediction;
- exact optimization over bounded-width dependency graphs.

The state-space lesson is central to AI algorithm engineering:

```text
global problem
   ↓
identify conditional independence
   ↓
find small separator
   ↓
compress boundary state
   ↓
exact DP
```

---

## 25. Engineering the Implementation in JavaScript

Important concerns include:

- stable bag-vertex indexing;
- compact state encoding;
- avoiding string allocations in hot loops;
- typed arrays where state domains are dense;
- `Map` for sparse states;
- canonical partition encoding;
- explicit `INF` / `NEG_INF` sentinels;
- iterative traversal when decomposition depth is large;
- deterministic state ordering for reproducibility.

For binary bag states, bitmasks are natural. For larger domains, mixed-radix encoding can pack a bag assignment into one integer when the product fits safely.

---

## 26. Master Recognition Framework

When facing a hard graph problem, ask:

1. Is the graph structurally narrow?
2. Can I find or obtain a small-width decomposition?
3. What information crosses a bag boundary?
4. Can that information be encoded compactly?
5. When is each vertex introduced?
6. When is each edge checked?
7. When can a vertex be forgotten safely?
8. What is duplicated at a join?
9. Do I need connectivity information?
10. What is the exact state-space growth in `k`?

If these questions have clean answers, bounded-treewidth DP may be the right abstraction.

---

## 27. Master Pattern

```text
graph
  ↓
find small separators / elimination order
  ↓
tree decomposition
  ↓
normalize to nice decomposition
  ↓
define boundary state
  ↓
leaf / introduce / edge / forget / join
  ↓
aggregate DP
  ↓
reconstruct if needed
  ↓
validate decomposition + differential-test
```

The deepest connection to the previous lesson is:

> **Profile DP compresses a geometric frontier; treewidth DP compresses an arbitrary graph separator.**

Once this becomes intuitive, treewidth is no longer just a graph-theory definition—it becomes an algorithm-engineering parameter.

---

## 28. Mastery Checklist

- [ ] define tree decomposition
- [ ] explain width vs bag size
- [ ] prove running intersection
- [ ] understand separators
- [ ] construct/validate a decomposition
- [ ] understand nice tree decompositions
- [ ] implement leaf transitions
- [ ] implement introduce-vertex
- [ ] implement introduce-edge
- [ ] implement forget-vertex
- [ ] implement join
- [ ] solve independent set
- [ ] solve coloring
- [ ] model domination states
- [ ] encode connectivity partitions
- [ ] canonicalize labels
- [ ] understand elimination ordering
- [ ] understand fill edges and induced width
- [ ] analyze parameterized complexity
- [ ] compare profile DP with treewidth DP
- [ ] build brute-force oracles
- [ ] validate decompositions
- [ ] differential-test implementations
- [ ] apply the pattern to backend constraints
- [ ] connect the pattern to AI inference
