# 41 — Cactus Graph DP: Block-Cut Trees, Cycle States & Bounded-Overlap Decomposition

## 0. Learning Objective

Cactus graphs sit between trees and general graphs: cycles are allowed, but their overlap is tightly controlled. That structural restriction lets us turn many apparently cyclic graph problems into dynamic programs over a block-cut tree, while handling each cycle with a small boundary-state computation.

This lesson develops a reusable pattern:

> **Decompose a cactus into tree-like blocks, solve each block locally, and combine the block summaries through articulation vertices.**

The goal is not to memorize one cactus problem. The goal is to recognize when a graph has bounded-overlap structure and convert that structure into a DP with explicit interface states.

---

## 1. What Is a Cactus Graph?

An undirected graph is a **cactus graph** when every edge belongs to at most one simple cycle.

Equivalent structural intuition:

- any two simple cycles share at most one vertex;
- every biconnected component is either a single bridge edge or a simple cycle, for a connected cactus;
- after compressing each biconnected component into a block node, the resulting block-cut structure is a tree.

Example:

```text
      a---b
      |   |
      d---c       cycle block
       \\
        e---f     bridge chain
```

The exact drawing is not important. The key invariant is that cycles do not overlap by edges.

### Why this matters for DP

A general graph can have dense, intertwined dependency structure. A cactus has a tree-shaped global dependency structure with small local cyclic components.

This suggests:

```text
graph
  ↓
biconnected blocks
  ↓
block-cut tree
  ↓
local block DP
  ↓
articulation-state merge
  ↓
rooted tree DP
```

---

## 2. Cactus DP as Interface-State DP

A useful abstraction is:

- **global structure:** a tree;
- **local component:** bridge or cycle;
- **interface:** one or two endpoint/articulation states;
- **summary:** a table indexed by the state exposed to the parent.

For a tree edge, the interface is tiny because removing the edge separates the graph.

For a cycle block, the whole block must be considered, but after fixing the state of one boundary vertex, the cycle can be processed as a path and closed consistently at the end.

This is the same deeper idea seen in many advanced DPs:

> A difficult object becomes tractable when the information crossing its separator is small.

---

## 3. Biconnected Components: The Structural Gateway

Run a biconnected-component decomposition using Tarjan-style DFS.

For an undirected graph, maintain:

- discovery time `tin[u]`;
- low-link value `low[u]`;
- DFS parent;
- an edge stack.

For a DFS tree edge `(u, v)`, after processing `v`:

```text
low[u] = min(low[u], low[v])
```

For a back edge `(u, v)` to an ancestor:

```text
low[u] = min(low[u], tin[v])
```

When `low[v] >= tin[u]`, the edges popped from the edge stack form one biconnected component.

For a valid cactus, each resulting block should be:

1. a bridge containing two vertices and one edge, or
2. a simple cycle containing the cycle's vertices and edges.

This validation is important in engineering code. Do not silently assume arbitrary input is a cactus.

---

## 4. Block-Cut Tree

Construct a bipartite auxiliary tree:

- one node for each original vertex that participates in a block;
- one node for each biconnected block;
- connect vertex-node `v` to block-node `B` when `v` belongs to `B`.

For a connected cactus, this structure is a tree.

Why?

Every block is connected to the rest of the graph through articulation vertices, and cactus blocks cannot form an overlapping cyclic block structure.

The block-cut tree gives a canonical rooting order:

```text
root original vertex
        |
      block
     / |  \\
   vertex ... vertex
      |
    child block
```

Now ordinary tree-DP machinery becomes available.

---

## 5. State Design: What Crosses a Block Boundary?

Suppose the parent is an articulation vertex `u` and a child block `B` contains `u` plus several descendant vertices.

A general block summary can be represented as:

```text
summary[B][state_of_parent_boundary]
```

For a binary selection problem, the state might be:

```text
0 = u is not selected
1 = u is selected
```

For a coloring problem:

```text
state = color(u)
```

For a bounded-state resource problem:

```text
state = remaining / used boundary capacity
```

The design rule is:

> Store exactly the information the parent needs; nothing about the internal block that cannot affect future compatibility.

---

## 6. Bridge Block DP

A bridge is just a two-vertex relationship, so its local DP looks like ordinary tree DP.

For weighted independent set, let:

```text
dp[u][0] = best value in u's descendant region when u is excluded
dp[u][1] = best value when u is included
```

For a child `v` connected by a bridge:

```text
child contribution if u = 0:
    max(dp[v][0], dp[v][1])

child contribution if u = 1:
    dp[v][0]
```

Then:

```text
dp[u][0] = sum(max(dp[v][0], dp[v][1]))

dp[u][1] = weight[u] + sum(dp[v][0])
```

The cycle case is where cactus DP becomes interesting.

---

## 7. Cycle Block as a Path With a Closure Constraint

Consider a cycle:

```text
v0 -- v1 -- v2 -- ... -- vk-1
 |                       |
 +-----------------------+
```

For a binary selection state, each vertex has state `0/1`.

For independent set, adjacent selected vertices are forbidden.

A direct way to solve the cycle is:

1. condition on the state of one vertex `v0`;
2. run path DP from `v1` through `vk-1`;
3. enforce compatibility between `v0` and `vk-1`.

For each fixed start state `s0`:

```text
best[s0][state_of_current]
```

Transition from previous state `p` to current state `c` is allowed when the block constraint accepts `(p, c)`.

At the end:

```text
answer_for_s0 = best_after_cycle_end[state_last]
                subject to compatible(state_last, s0)
```

Take the optimum over `s0`.

This converts a cyclic local dependency into a constant-state path DP.

---

## 8. Cycle DP With Child Subtrees

The real cactus problem is not merely an isolated cycle. Each cycle vertex can have bridge descendants or child blocks attached to it.

First solve all child blocks attached beneath each cycle vertex.

That yields a local state table for each cycle vertex:

```text
local[v][state_of_v]
```

Then run the cycle DP over those already-compressed vertex summaries.

Conceptually:

```text
subtree/block children
        ↓
local state table at each cycle vertex
        ↓
cycle transition
        ↓
summary exposed to parent articulation vertex
```

This is a two-level DP:

- tree aggregation into vertices;
- path-like DP around each cycle.

---

## 9. Weighted Independent Set on a Cactus

Let each vertex have weight `w[v]`.

Goal:

> Select a maximum-weight set of vertices such that no edge has both endpoints selected.

For each original vertex `u`, maintain:

```text
dp[u][0]
dp[u][1]
```

For bridge children, use the ordinary transition.

For cycle blocks, compute the cycle summary conditioned on the articulation vertex state.

The root answer is:

```text
max(dp[root][0], dp[root][1])
```

### Reconstruction

Store, for every block and state:

- which child state was chosen;
- which cycle start state was assumed;
- the predecessor state along the cycle;
- tie-breaking metadata if deterministic output is required.

A value-only DP and a witness-producing DP are different interfaces. Design them separately.

---

## 10. Counting Independent Sets

Replace `max` with `sum`.

For every state:

```text
count[u][state]
```

If counting exact objects:

```text
count = sum(product(...))
```

For large counts in JavaScript:

- use `BigInt` for exact integer counts;
- or compute modulo a specified modulus;
- never silently mix `Number` and `BigInt`.

The same block decomposition still works because the local transition algebra changed while the structural decomposition did not.

This is one reason semiring-style thinking is useful: the graph structure and the aggregation algebra can be separated.

---

## 11. Vertex Cover on a Cactus

For minimum-weight vertex cover, use the complementary edge constraint:

```text
for every edge (u, v), at least one endpoint is selected
```

On a bridge:

```text
u = 0  ⇒  v must be 1
u = 1  ⇒  v may be 0 or 1
```

On a cycle, run the same conditioned path DP but with the compatibility rule:

```text
allowed(p, c) = (p === 1 || c === 1)
```

The same framework solves independent set, vertex cover, and many binary local-constraint problems. Only the transition relation and aggregation operator change.

---

## 12. General Binary Constraint Cycle DP

Suppose every edge has a local compatibility function:

```text
compatible(a, b) -> boolean
```

and every vertex has a local score:

```text
score(v, state)
```

Then a cycle block can be solved by:

```text
for startState in states:
    dp[startState][startState] = score(v0, startState)
    process v1 ... vk-1
    close cycle against startState
```

For `S` states and cycle length `L`, the simple implementation costs roughly:

```text
O(L * S^2)
```

For tiny fixed `S`, this is effectively linear in the cycle length.

This becomes a reusable **cycle transfer operator**.

---

## 13. Matrix View of a Cycle Block

For a fixed finite state space, a cycle transition can be represented as a small matrix/operator.

For additive optimization, use max-plus style multiplication.

For counting, use ordinary addition and multiplication.

For Boolean feasibility, use OR/AND.

Then the cycle is a closed product of local transfer operators.

This connects cactus DP to earlier lessons on:

- finite-state DP;
- transfer matrices;
- semiring DP;
- matrix exponentiation.

Do not confuse the global cactus decomposition with arbitrary matrix multiplication: only the **small local cycle state space** is being represented this way.

---

## 14. Rooting the Block-Cut Tree Correctly

Choose an original vertex as root.

Then alternate node types:

```text
original vertex
    ↓
child block
    ↓
child original vertices
    ↓
child blocks
```

For each block, one vertex is its parent boundary and all other vertices are descendants in the rooted block-cut tree.

That single-parent-boundary invariant is what makes the block summary sufficient.

For iterative JavaScript implementations, prefer an explicit stack:

```text
stack = [[root, parentBlock]]
```

rather than deeply recursive traversal when the graph may contain very long bridge chains.

---

## 15. A Generic Block DP Interface

A useful engineering interface is:

```text
solveBlock(block, parentVertex, childSummaries)
    -> summary[parentState]
```

For a bridge:

```text
summary = local two-endpoint transition
```

For a cycle:

```text
summary = cycle path DP + closure
```

The parent does not need to know which type of block produced the summary.

This gives a clean architecture:

```text
Graph parser
    ↓
Cactus validator / decomposition
    ↓
Block tree builder
    ↓
Bottom-up DP engine
    ↓
Block solver registry
    ↓
Root aggregation
```

---

## 16. Connected Selection Problems

Not every cactus DP is a simple independent-set state.

Suppose we want a maximum-weight **connected** selected vertex set.

A subtree summary may need states such as:

```text
0 = nothing selected
1 = selected and connected to boundary
2 = selected component exists but is closed away from boundary
```

The important issue is preventing multiple disconnected partial components from being merged incorrectly.

For a cycle block, this can require more than a binary state because the cycle can expose connectivity through both sides of the block.

When a problem's boundary interaction grows, increase the state deliberately and document the invariant.

---

## 17. Two-Sided Cycle Interfaces

Some problems need to remember information about both endpoints while a cycle is temporarily opened into a path.

Typical pattern:

```text
fixed boundary state at v0
        ↓
path DP through cycle
        ↓
state at vk-1
        ↓
closure with v0
```

If both boundary states matter, the local summary can be a matrix:

```text
summary[a][b]
```

where `a` is the state imposed at one interface and `b` is the state exposed at another.

This is particularly useful when composing blocks in a more general bounded-width decomposition.

---

## 18. Cactus DP Versus Tree DP

Tree DP:

```text
one edge separates child region from parent
```

Cactus DP:

```text
one block separates child region from parent
```

The difference is local cyclicity.

A bridge behaves like a tree edge. A cycle needs an internal closure computation.

Therefore cactus DP can be viewed as:

> **Tree DP over blocks + a specialized solver for each biconnected block.**

This mental model is more reusable than memorizing separate cactus problems.

---

## 19. Cactus DP Versus Treewidth DP

Both techniques exploit small separators, but their assumptions differ.

### Cactus

The biconnected blocks have very simple structure:

- bridge;
- cycle.

The interface states can therefore be handled with simple local transitions.

### Treewidth DP

A bag can contain many vertices and arbitrary edges among them. The state may need to encode much richer information, such as connectivity partitions.

The cactus case is a highly structured special case with simpler blocks.

A good recognition habit is:

```text
Is the graph literally a cactus?
    ↓ yes
Use block/cycle DP.
    ↓ no
Could a bounded-treewidth decomposition be appropriate?
```

---

## 20. Rerooting on a Cactus

After obtaining a rooted solution, some problems ask for a value for every possible starting vertex.

The same two-pass philosophy used in tree rerooting still applies, but the message crossing a block must be recomputed consistently.

Think of each directed incidence:

```text
vertex → block
block → vertex
```

as a message.

For each block, compute an aggregate from all incident sides and then exclude the recipient side using an appropriate prefix/suffix or cycle-message technique.

Rerooting on cactus graphs is more delicate than tree rerooting because a cycle block has two directions around its ring. Make the message invariant explicit before coding.

---

## 21. Cycle Prefix/Suffix Messages

For a long cycle, if the state space is small, local prefix and suffix messages can make exclusion-style calculations efficient.

Conceptually:

```text
prefix[i] = contribution from cycle segment before i
suffix[i] = contribution from cycle segment after i
```

To recompute a message that excludes one cycle vertex or one incident subtree, combine the two sides while applying the cycle closure constraint.

This is the cycle analogue of prefix/suffix sibling exclusion in ordinary rerooting DP.

---

## 22. Optimization, Counting, Feasibility: One Structure, Three Algebras

The same cactus decomposition can support multiple semantics.

### Optimization

```text
combine = max / min
extend  = +
```

### Counting

```text
combine = +
extend  = ×
```

### Feasibility

```text
combine = OR
extend  = AND
```

This is a semiring-like viewpoint. It is not magic: the operations still need to satisfy the algebraic properties required by the recurrence.

---

## 23. Numeric Safety in JavaScript

Cactus DP can overflow JavaScript `Number` when counts or path-like scores become large.

Use:

```js
BigInt
```

for exact large integer results.

For modular arithmetic, keep values normalized and use `BigInt` when products can exceed safe integer precision.

For optimization values:

- use a carefully chosen finite sentinel for unreachable states;
- do not add to an unreachable sentinel without checking it first;
- avoid `Infinity + (-Infinity)` style contamination in mixed formulations.

Numeric type is part of the state invariant.

---

## 24. Complexity

Let:

- `n` = number of vertices;
- `m` = number of edges;
- `S` = number of boundary states.

For a cactus:

```text
m = O(n)
```

because the graph has tree-like structure plus non-overlapping cycle edges.

With fixed `S`, decomposition plus local DP is typically:

```text
O(n + m)
```

or more generally:

```text
O(n * S^2)
```

for simple cycle transitions with `S` states.

Memory is generally:

```text
O(n * S)
```

plus decomposition metadata.

Always state whether your complexity assumes `S` is a constant.

---

## 25. Correctness Proof Template

A reusable proof has four layers.

### Lemma 1 — Block decomposition
Every valid block is a bridge or a simple cycle, and the block-cut structure is a tree.

### Lemma 2 — Child summary sufficiency
After solving all descendant blocks, the returned boundary-state summary contains all information needed by the parent block.

### Lemma 3 — Local block recurrence
The bridge/cycle solver enumerates exactly the feasible local state assignments and aggregates their values correctly.

### Lemma 4 — Global composition
Because the block-cut structure is a tree, descendant regions interact only through their boundary articulation states, so bottom-up composition yields the global optimum/count/feasibility result.

For cyclic blocks, explicitly prove the closure condition at the final-to-first boundary.

---

## 26. Common Failure Modes

### Failure 1 — Treating a cycle like a tree
You forget the final edge between the last and first cycle vertices.

### Failure 2 — Solving the raw graph recursively
Cycles cause repeated states or infinite recursion. Decompose first.

### Failure 3 — Wrong block classification
A non-cactus biconnected component is processed as though it were a simple cycle.

### Failure 4 — Losing articulation identity
A block summary must refer to the exact parent boundary vertex.

### Failure 5 — Overly rich state
You store internal details that cannot influence the parent, creating unnecessary complexity.

### Failure 6 — Under-specified state
You omit a boundary property needed to preserve feasibility.

### Failure 7 — Incorrect rerooting
Cycle messages are not equivalent to tree-edge messages; direction and closure matter.

### Failure 8 — Numeric contamination
Unreachable states or unsafe integer arithmetic silently corrupt answers.

---

## 27. Testing Strategy

### Tiny brute-force oracle
For very small cactus graphs:

1. enumerate all vertex subsets or states;
2. check the constraint directly;
3. compute the exact optimum/count;
4. compare against the DP.

### Structural tests
Generate:

- pure trees;
- one-cycle cacti;
- chains of cycles sharing articulation vertices;
- many triangles;
- long cycles;
- single-vertex attachments;
- isolated vertices where supported;
- malformed non-cactus graphs for validator testing.

### Metamorphic tests
Useful invariants include:

- relabeling vertices preserves the answer;
- changing traversal order preserves the answer;
- reversing cycle representation preserves the answer;
- adding an independent zero-weight leaf should have a predictable effect depending on the problem;
- decomposition order must not affect results.

### Adversarial tests
Include:

- deep bridge chains;
- giant single cycles;
- many short cycles;
- articulation hubs;
- zero/negative weights when permitted;
- extremely large exact counts.

---

## 28. Differential Testing Architecture

Implement at least two paths:

```text
reference solver
    brute force on tiny inputs

optimized solver
    block-cut tree + block DP
```

Then generate thousands of small random cacti.

When a mismatch occurs, shrink the graph while preserving the cactus property.

A minimal counterexample often reveals one of three issues:

- missing cycle closure;
- incorrect articulation-state merge;
- bad block decomposition.

---

## 29. Backend Engineering Applications

Functional and cactus-like dependency structures occur in systems that have mostly tree-shaped ownership with a small number of cycles or shared components.

Examples:

- dependency optimization in package/build graphs with controlled cycle structure;
- resource selection over hierarchical infrastructure with shared ring segments;
- workflow optimization where a process hierarchy contains bounded shared loops;
- network reliability or configuration checks on infrastructure topologies modeled as cactus-like graphs;
- scheduling policies over modular subsystems connected at articulation points.

The engineering lesson is to exploit the actual topology instead of treating every graph as a generic dense graph.

---

## 30. AI Engineering Applications

The same structure appears whenever a finite-state objective is evaluated over a graph whose interaction topology has small cyclic overlap.

Examples:

- constrained inference over structured dependency graphs;
- tree-and-cycle factor graphs with small local state spaces;
- structured policy selection on modular environments;
- exact dynamic programs over interpretable graph-structured decision systems;
- hybrid symbolic/learned systems where learned scores become local vertex or transition weights.

The reusable pattern is:

```text
learned local score
      +
exact structural DP
      ↓
globally constrained solution
```

This can be useful when local model predictions must still obey hard combinatorial constraints.

---

## 31. Recognition Framework

When reading a problem, ask:

```text
1. Is the graph undirected?
2. Does every edge belong to at most one cycle?
3. Are biconnected components only bridges/cycles?
4. Is the global interaction tree-like after block compression?
5. Is the boundary state small?
6. Can each cycle be opened into a path and closed afterward?
7. Is the objective additive/compositional?
```

If the answers are mostly yes, cactus DP is a strong candidate.

---

## 32. Master Pattern

The complete reasoning chain is:

```text
Recognize cactus structure
        ↓
Validate / decompose biconnected components
        ↓
Build block-cut tree
        ↓
Root the block structure
        ↓
Solve descendant blocks first
        ↓
Compress each child into boundary-state summaries
        ↓
Solve bridge blocks directly
        ↓
Solve cycle blocks with conditioned path DP + closure
        ↓
Merge block summaries upward
        ↓
Reconstruct / reroot when required
        ↓
Verify with brute force and structural invariants
```

The deepest principle is:

> **Cyclic structure is manageable when the cycle interface is small and the global block dependency remains a tree.**

That principle generalizes far beyond cactus graphs.

---

## 33. Interview Framework

A strong explanation under interview pressure should follow this order:

1. Define the cactus property.
2. Explain why biconnected blocks are bridges or cycles.
3. Build the block-cut tree.
4. State the boundary DP invariant.
5. Explain bridge transitions.
6. Explain cycle DP by fixing one start state and closing the cycle.
7. Give complexity.
8. Explain reconstruction if asked.
9. Mention validator and edge cases.
10. Prove why block summaries compose independently.

Avoid jumping directly into code. The decomposition is the main algorithmic insight.

---

## 34. Final Checklist

Before declaring a cactus DP implementation complete, verify:

- [ ] Cactus validity is understood or validated.
- [ ] Biconnected decomposition is correct.
- [ ] Block-cut structure is built correctly.
- [ ] Parent boundary semantics are explicit.
- [ ] Bridge transitions are correct.
- [ ] Cycle order is correct.
- [ ] Cycle closure is enforced.
- [ ] Child summaries are merged exactly once.
- [ ] Reconstruction metadata is consistent.
- [ ] Numeric behavior is safe.
- [ ] Tiny brute-force differential tests pass.
- [ ] Metamorphic tests pass.
- [ ] Deep and large-cycle inputs are stack-safe.
- [ ] Complexity is derived from actual state size.
- [ ] A correctness proof matches the implemented invariant.

---

## Master Insight

**Cactus DP is not primarily about cycles. It is about controlling the amount of information that crosses a cycle's boundary.**

Once the graph is decomposed into simple blocks and each block exposes a small state summary, the global problem becomes another form of dynamic programming over a tree of interfaces.
