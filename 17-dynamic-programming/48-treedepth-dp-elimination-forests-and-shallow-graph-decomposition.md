# 48 — Treedepth DP, Elimination Forests & Shallow Graph Decomposition

## 1. Why this chapter exists

Treewidth asks how complicated a graph becomes when decomposed into bags of bounded size. **Treedepth** measures a different kind of structural simplicity: whether the graph can be represented by a shallow rooted forest whose ancestor-descendant closure contains every graph edge.

This gives a powerful DP viewpoint:

> When a graph has small treedepth, dependencies can be organized around a shallow elimination forest, allowing recursive dynamic programming over depth rather than over arbitrary graph size.

Treedepth is especially useful when the parameter is much smaller than the treewidth of the input graph, when recursive separators are natural, or when the problem naturally interacts with ancestor chains.

This chapter focuses on the algorithmic pattern rather than on one particular optimization problem.

---

## 2. Treedepth definition

A rooted forest `F` has a **closure** obtained by adding an edge between every vertex and each of its ancestors.

A graph `G` has treedepth at most `h` if there exists a rooted forest `F` of height at most `h` such that every edge of `G` appears in the closure of `F`.

Write:

```text
G ⊆ closure(F)
height(F) <= h
```

The smallest possible `h` is the treedepth `td(G)`.

The parameter is fundamentally about **depth of hierarchical elimination**, not width of bags.

---

## 3. Elimination forests

An elimination forest assigns every vertex a parent, except roots, such that every graph edge joins an ancestor with a descendant.

Example:

```text
        r
      /   \
     a     b
    / \     \
   c   d     e
```

The actual graph may contain edges:

```text
r-a, r-b, a-c, a-d, b-e, r-d
```

The important condition is not that graph edges equal forest edges. A graph edge may connect a vertex directly to a much deeper descendant as long as the ancestor relation contains it.

This makes the forest a compact representation of all possible dependencies.

---

## 4. Treedepth versus treewidth

These parameters answer different structural questions.

### Treewidth

Treewidth controls the size of separators/bags needed in a tree decomposition.

### Treedepth

Treedepth controls the height of an elimination forest.

Some consequences:

- bounded treedepth implies bounded treewidth;
- treedepth can be substantially larger than treewidth;
- many recursive algorithms become naturally depth-parameterized on low-treedepth graphs;
- tree-depth is sensitive to long paths.

A path with many vertices has small treewidth but large treedepth.

Therefore:

```text
treewidth -> shallow separators with bounded bags
treedepth  -> shallow ancestor hierarchy
```

Do not substitute one decomposition for the other without checking the recurrence.

---

## 5. Why depth can be a powerful DP parameter

If the elimination forest has height `h`, every vertex has at most `h` ancestors.

For a vertex `v`, graph neighbors can only lie among:

- ancestors of `v`, or
- descendants of `v`.

When processing a subtree, the interaction with the rest of the graph is therefore constrained by the ancestor chain.

A generic state can look like:

```text
DP(subtree(v), summary of decisions on ancestors(v))
```

The boundary size is bounded by depth rather than by an arbitrary decomposition bag.

For fixed `h`, many state spaces become `f(h) * n` or `f(h) * poly(n)`.

The exact function depends on the problem and state alphabet.

---

## 6. Elimination ordering intuition

Another way to view treedepth is recursively:

1. choose a vertex as a root;
2. remove it;
3. each connected component becomes a child subtree;
4. recursively continue.

The height counts the maximum number of nested eliminations.

This is useful for DP design because recursion follows a structural certificate rather than arbitrary vertex order.

A decomposition certificate should be treated as part of the input contract when the algorithm relies on it.

---

## 7. Validating an elimination forest

Given a forest `F`, verify:

1. every vertex appears exactly once;
2. parent pointers form an acyclic forest;
3. the maximum root-to-leaf depth is at most `h`;
4. for every graph edge `(u,v)`, one endpoint is an ancestor of the other.

The last condition is the crucial closure test.

A practical validator can compute entry/exit times from a DFS over the forest and test ancestor relationships in `O(1)` per graph edge after linear preprocessing.

For a learning implementation, also build a slower parent-chain oracle to validate the validator itself.

---

## 8. Ancestor-chain state design

Suppose each vertex receives a label from a finite domain `C`.

For a subtree rooted at `v`, the local objective may depend on the labels of `v` and its ancestors.

A direct conceptual state is:

```text
state = (depth position, labels on ancestor chain)
```

If each label has `q` possibilities and the depth is at most `h`, a naive chain state can have up to:

```text
q^h
```

configurations.

This is the central fixed-parameter tradeoff:

```text
exponential in h
linear/polynomial in n
```

State compression, symmetry, and problem-specific constraints can reduce the constant dramatically.

---

## 9. Vertex labeling DP

Consider a graph labeling problem with local pairwise costs:

\[
\min \sum_v unary(v,label_v) + \sum_{(u,v)\in E} pair(u,v,label_u,label_v).
\]

In a valid elimination forest, every edge connects an ancestor-descendant pair.

For a subtree rooted at `v`, once the ancestor labels are fixed, all external interactions are determined by those labels.

This yields a recursive DP:

```text
solve(v, ancestor-context)
    choose label for v
    solve every child with extended context
    add local unary + all ancestor-related edge costs
    minimize over label(v)
```

The key correctness argument is that no graph edge can jump between unrelated branches.

---

## 10. Maximum independent set on an elimination forest

Independent set is an instructive example.

If `v` is selected, every descendant directly adjacent to `v` is forbidden. However, not every descendant is a child in the elimination forest.

Therefore a tree-shaped DP using only parent-child constraints is insufficient.

The correct state must account for which ancestors are selected, or equivalently which ancestor decisions forbid the current vertex.

This illustrates the general rule:

> Forest edges are decomposition edges; graph edges remain semantic constraints.

Never replace graph adjacency by forest adjacency unless the problem definition guarantees they are identical.

---

## 11. Coloring DP

For `q`-coloring, store the colors on the ancestor chain relevant to the current vertex.

When assigning color `c` to `v`, inspect every graph edge from `v` to an ancestor.

For proper coloring, reject:

```text
color(v) == color(ancestor)
```

The descendant side is handled recursively because future descendants receive the updated context.

This makes low-treedepth coloring a direct example of context-carrying recursive DP.

---

## 12. Dominating set and richer local constraints

For problems such as dominating set, a vertex may need to know more than one binary fact about each ancestor.

Examples of context information:

```text
selected?
dominated?
open demand?
resource contribution?
```

A useful design method is:

1. list every graph edge that can cross the current subtree boundary;
2. identify the information required to evaluate those edges later;
3. encode only that information into the ancestor-context state.

The forest depth bounds the number of boundary vertices, while semantic compression bounds the per-vertex state alphabet.

---

## 13. Generic finite-domain ancestor DP

A generic recurrence can be written as:

```text
DP(v, ctx) = aggregate over label(v)
              localCost(v, label(v), ctx)
              + combine(children,
                        extend(ctx, label(v)))
```

Where:

- `ctx` is the relevant ancestor summary;
- `extend` appends the current decision;
- `aggregate` may be min, max, sum, Boolean OR, or another semiring operation;
- `combine` merges child contributions.

This unifies a family of problems under one implementation architecture.

---

## 14. Context truncation

Although the full ancestor chain has length at most `h`, not every ancestor matters to every problem.

Suppose constraints only inspect graph edges. Then the context may retain only ancestor vertices that are graph neighbors of some future descendant.

Safe compression requires a proof of sufficiency:

> Two contexts are equivalent if every possible completion of the remaining subtree produces the same optimal continuation value.

This is the same state-sufficiency principle seen throughout DP, now applied to a recursive decomposition.

---

## 15. Symmetry reduction

Sometimes labels are interchangeable.

For graph coloring, for example, the absolute names of colors may matter less than the equality pattern among ancestor colors.

Instead of storing:

```text
red, blue, green, red
```

store a canonical pattern such as:

```text
0, 1, 2, 0
```

subject to the problem's semantics.

Canonicalization can replace a `q^h` state space with a number related to set partitions when color names are fully symmetric.

Do not apply symmetry reduction when labels carry asymmetric costs or externally meaningful identities.

---

## 16. Bottom-up versus top-down treedepth DP

Two implementations are common.

### Top-down

Pass ancestor context recursively.

Advantages:

- natural for sparse reachable states;
- context is explicit;
- easy to prune invalid states.

Risk:

- recursion depth can be large when `h` is not genuinely small;
- JavaScript call stacks are not a substitute for a proven depth bound.

### Bottom-up

Compute tables per forest node and combine them with context-indexed summaries.

Advantages:

- iterative implementations are easier;
- reusable child tables;
- explicit memory accounting.

Choice depends on state sharing and problem structure.

---

## 17. Rerooting and decomposition choice

A graph may admit several valid elimination forests.

Changing the root changes:

- ancestor contexts;
- maximum depth;
- number of distinct local states;
- amount of pruning.

Therefore decomposition quality is algorithmically relevant even after a valid certificate is found.

A production-oriented solver should distinguish:

```text
valid decomposition
quality of decomposition
cost of computing decomposition
```

For learning, compare multiple valid forests on the same graph and measure DP state counts.

---

## 18. Relationship to tree decomposition DP

Treewidth DP stores state information on a bag. Treedepth DP can instead store information along an ancestor chain.

Conceptually:

```text
Treewidth:
  boundary = bag
  state size depends on bag width

Treedepth:
  boundary = ancestor context
  state size depends on depth and context alphabet
```

Tree decompositions naturally support arbitrary local interactions inside a bag.

Elimination forests impose a stronger structural shape and can yield shallower recursive contexts when the graph is low-treedepth.

A useful interview question is:

> Which parameter actually bounds the number of semantic decisions crossing the current recursion boundary?

---

## 19. Treedepth and parameterized complexity

A common target form is:

\[
O(f(h,q) \cdot n^c)
\]

where:

- `h` is treedepth;
- `q` is a finite state/label domain;
- `n` is graph size.

The exponential part belongs to the structural parameter rather than to arbitrary `n`.

When presenting such an algorithm, state clearly:

1. the parameter;
2. the state count as a function of the parameter;
3. transitions per state;
4. decomposition preprocessing cost;
5. memory complexity.

This is essential for honest fixed-parameter analysis.

---

## 20. Weighted optimization over ancestor relations

Many objectives have interactions between a vertex and multiple ancestors.

Suppose:

\[
score(v) = base(v, x_v) + \sum_{a \in Anc(v)\cap N(v)} w(a,v,x_a,x_v).
\]

When `v` is assigned, these terms become immediately evaluable because all relevant ancestor decisions are in context.

This creates an especially clean recurrence for:

- weighted coloring;
- pairwise labeling;
- conflict penalties;
- hierarchical resource assignment;
- constrained scheduling on shallow precedence structures.

The same pattern generalizes beyond pairwise interactions when a bounded ancestor summary is sufficient.

---

## 21. Counting and probability variants

Replace the optimization operator with another algebraic aggregation.

### Counting

```text
DP = sum(product of child contributions)
```

### Feasibility

```text
DP = OR(AND(child constraints))
```

### Probability

Use the appropriate sum-product model over transitions.

The decomposition remains unchanged. Only the algebra over states changes.

This is another example of separating structural decomposition from semantic aggregation.

---

## 22. Witness reconstruction

For optimization DP, store a chosen action or backpointer for every state.

During reconstruction:

1. recover the optimal root state;
2. recover the chosen label/action;
3. extend the ancestor context;
4. recursively reconstruct children.

For compact states, storing a full context in every backpointer may be expensive.

Alternatives include:

- parent-state IDs;
- compressed transition records;
- checkpointing;
- deterministic re-derivation from stored values.

The same value-versus-witness distinction from earlier DP chapters applies here.

---

## 23. Sparse state storage

Not every theoretical context is reachable.

Use:

```js
Map<encodedContext, value>
```

when the reachable fraction is small.

Use dense arrays only when:

- state encoding is compact;
- most contexts are reachable;
- predictable iteration matters.

A practical solver should measure:

```text
reachable / theoretical states
average states per node
maximum states per node
```

before choosing the representation.

---

## 24. Encoding ancestor contexts

Possible encodings include:

- base-`q` integers for small `q`;
- BigInt bit-packing;
- arrays of small integers;
- canonical partition IDs;
- interned immutable strings for debugging only.

For JavaScript, be careful with 32-bit bitwise operators. Values above the signed 32-bit range are coerced differently from ordinary numeric arithmetic.

Use `BigInt` or arithmetic encoding when the context exceeds safe bitwise width.

---

## 25. Memoization and repeated contexts

Different recursive paths may produce equivalent ancestor summaries.

Memoization can share those states:

```text
memo[v][context] = best value below v
```

The memo key must include every variable that influences the recurrence.

If the graph decomposition is static, vertex `v` can often be part of the table index while only the context needs to be encoded dynamically.

State omission is a correctness bug, not merely a performance issue.

---

## 26. Pruning and dominance

Suppose two contexts impose exactly the same future feasibility constraints, but one already has a worse objective value.

Then the dominated state may be discarded.

For resource-vector contexts, maintain a Pareto frontier when safe:

```text
resource A lower and objective no worse
=> dominates
```

Dominance must be proven against all future transitions. Local numeric improvement alone is not enough.

---

## 27. Decomposition discovery versus DP

Finding a small-treedepth decomposition can itself be a nontrivial algorithmic task.

Separate the pipeline into:

```text
input graph
   -> decomposition discovery/verification
   -> elimination forest certificate
   -> DP engine
   -> reconstruction/answer
```

For a learning repository, begin with the forest supplied explicitly. Then add small-instance heuristics or exact search for decomposition discovery.

Never hide decomposition cost when reporting total runtime.

---

## 28. Exact small-instance treedepth search

For tiny graphs, implement a recursive verifier/searcher:

1. choose a root candidate;
2. remove it;
3. solve every remaining connected component independently;
4. minimize `1 + max(component depth)`.

Memoize subgraphs using canonical vertex subsets.

This is exponential in graph size and should be treated as an oracle/testing tool rather than the production solver.

It is valuable because it can generate optimal-depth certificates for differential experiments.

---

## 29. Path graphs as an adversarial example

Paths are a useful sanity check because they have low treewidth but growing treedepth.

Use them to compare:

- treewidth-style DP;
- path-specific DP;
- treedepth DP;
- decomposition size and depth.

This demonstrates why choosing the right structural parameter matters.

Also test:

- stars;
- complete graphs;
- disconnected unions;
- balanced trees;
- random shallow closures.

Each exposes different decomposition behavior.

---

## 30. Correctness proof template

A clean proof can follow four claims.

### Claim 1 — decomposition validity

Every graph edge joins an ancestor-descendant pair in the supplied forest.

### Claim 2 — context sufficiency

The state context contains exactly the information required for all interactions between the processed subtree and the unprocessed graph.

### Claim 3 — local recurrence correctness

For every state, each legal local choice and every child state are considered exactly once under the intended aggregation semantics.

### Claim 4 — root optimum

At the forest roots, there is no unrepresented external context, so the minimum/maximum/count/probability over valid root states equals the required global result.

The exercise file asks you to turn these claims into explicit proof artifacts.

---

## 31. Testing strategy

Use several independent layers.

### Brute-force oracle

For tiny graphs, enumerate all assignments/solutions.

### Decomposition validator

Reject invalid elimination forests.

### Differential testing

Compare:

```text
forest DP
vs
brute force
```

### Metamorphic testing

Examples:

- relabeling vertices should preserve the optimum;
- duplicate disconnected components should combine according to the objective algebra;
- adding a graph edge must not improve a minimization constraint problem when that edge adds a restriction;
- changing only an asymmetric unary cost should affect only semantics involving that cost.

### Adversarial testing

Target maximum depth, dense ancestor-descendant closure, unreachable contexts, symmetric labels, ties, and numeric extremes.

---

## 32. Backend engineering applications

Low-treedepth structures appear as useful abstractions for hierarchical services and dependency graphs.

Examples:

- policy/conflict evaluation over shallow organizational hierarchies;
- resource assignment with bounded ancestor interactions;
- dependency scoring in configuration trees enriched with ancestor edges;
- validation of shallow rule graphs.

The architecture should expose the decomposition as a versioned, validated artifact rather than treating it as hidden implementation detail.

For changing weights or rules, Lesson 47's incremental-repair ideas can be layered on top of the treedepth DP when the decomposition remains stable.

---

## 33. AI and structured inference applications

A shallow elimination hierarchy can be used as the structural backbone for finite-domain inference.

Examples include:

- structured labeling under bounded interaction depth;
- constrained sequence-to-graph assignments;
- shallow factor-graph subproblems;
- rule-constrained decoding;
- hierarchical feature consistency.

The key engineering pattern is:

```text
structure -> context state -> local score -> semiring aggregation
```

This creates a controlled exact-inference setting when the structural parameter is small.

Approximate methods such as beam pruning should be compared against the exact DP, not silently substituted for it.

---

## 34. Relationship to other DSA Mastery lessons

This lesson connects directly to:

- tree DP: recursive postorder aggregation;
- treewidth DP: bounded structural boundary states;
- profile DP: frontier compression;
- automaton DP: finite context transitions;
- semiring/transfer-matrix DP: algebraic aggregation;
- incremental DP: reuse when weights change but decomposition stays fixed.

The unifying principle is:

> Find a structural certificate that makes the future depend on a compact state, then evaluate that state space with the appropriate DP algebra.

---

## 35. Interview recognition framework

When you see a graph problem, ask:

1. Is there a supplied or discoverable shallow elimination forest?
2. Do graph edges always connect ancestor-descendant pairs?
3. What information from the ancestor chain affects the future?
4. Can that context be canonicalized or compressed?
5. Which aggregation algebra is required?
6. What is the exact state bound in terms of treedepth and domain size?
7. Can witnesses be reconstructed?
8. What decomposition-validation and brute-force tests are available?

If the answers are clear, a treedepth DP may be appropriate.

---

## 36. Common failure modes

### Mistaking forest edges for graph edges

Ancestor-descendant graph edges can skip many forest levels.

### Omitting an ancestor dependency

This merges states that are not equivalent.

### Claiming FPT without a parameter bound

State the parameter dependence explicitly.

### Ignoring decomposition cost

A fast DP does not imply a fast total solver if decomposition discovery dominates.

### Unsafe symmetry reduction

Color or label permutations may stop being equivalent when costs are asymmetric.

### Recursive stack overflow

A theoretical depth parameter does not guarantee safe runtime recursion in JavaScript unless the bound is enforced.

### Over-compressing witnesses

An optimal value alone may not recover the requested construction or canonical tie-break.

---

## 37. Master implementation pattern

A robust implementation can follow:

```text
validate elimination forest
        |
        v
precompute ancestor metadata
        |
        v
encode/canonicalize context
        |
        v
memoized per-node DP
        |
        +--> prune/dominance when proven safe
        |
        v
aggregate child results
        |
        v
recover root optimum
        |
        v
reconstruct witness
        |
        v
differential + adversarial validation
```

This is the core engineering recipe for treedepth-based DP.

---

## 38. Final mental model

Think of treedepth DP as **DP over a shallow causal hierarchy**.

The graph may contain many edges, but every edge is anchored to an ancestor relation. Once the relevant ancestor context is known, a subtree can often be solved independently of the rest of the graph.

The mastery pattern is:

```text
graph structure
   -> elimination forest
   -> bounded ancestor context
   -> compact DP state
   -> recursive aggregation
   -> exact result + witness
```

The hard part is not writing recursion. It is proving that the chosen context is sufficient, quantifying the parameterized state space, validating the decomposition, and knowing when the structural assumption actually buys you something.
