# 38 — Tree Knapsack: Subtree Capacity & Convolution DP

## 1. Why Tree Knapsack Is Different

Tree knapsack combines two structures:

- a rooted tree dependency structure;
- a capacity dimension.

A node's DP must summarize not only a local constraint but also how capacity is distributed among its child subtrees.

This is the key distinction from ordinary tree DP: **children are no longer independent scalar choices; their capacity allocations must be convolved.**

---

## 2. Canonical State

A common state is:

```text
dp[u][k] = best value obtainable inside subtree(u)
           using exactly k units/items
```

Variants may use:

- at most `k`;
- minimum cost for exactly `k`;
- number of ways;
- feasibility;
- multiple resources.

State semantics must be fixed before deriving transitions.

---

## 3. Rooting and Postorder

Root the tree and process nodes after their children.

For every node `u`, initialize the state contributed by `u` itself. Then merge each child one at a time.

Unlike Lesson 15's constant-size states, the transition can contain a nested capacity loop.

---

## 4. Child Merge as Knapsack Convolution

Suppose `cur[a]` represents the processed children using capacity `a`, and child `v` has `child[b]`.

The merge is:

```text
next[a+b] = max(next[a+b], cur[a] + child[b])
```

This is a max-plus convolution over capacity.

For counting, replace `max` with `+` and multiplication/addition according to the counting model.

The convolution viewpoint is the central mental model.

---

## 5. A Simple Example

Suppose a node has two children.

```text
child A: capacity → value
0 → 0
1 → 5
2 → 7

child B:
0 → 0
1 → 4
2 → 9
```

To obtain capacity `2` at the parent, consider:

```text
A:0 + B:2
A:1 + B:1
A:2 + B:0
```

and select the best compatible combination.

This is exactly the same resource-allocation principle as knapsack, but repeated along the tree.

---

## 6. Exact vs At-Most Capacity

These semantics must not be mixed.

### Exactly k

`dp[u][k]` means exactly `k` resources are consumed.

### At most k

`dp[u][k]` means no more than `k` resources are consumed.

A common engineering choice is to maintain exact states during merges and take a maximum over `k <= K` only at the final query.

---

## 7. Node Selection Model

One canonical problem is:

> Select nodes under a global capacity while receiving node rewards.

If selecting a node forces or forbids certain descendants, the tree constraint becomes part of the state.

For example:

```text
dp[u][k][selected]
```

can combine:

- local parent/child compatibility;
- capacity allocation.

The dimensions should represent independent pieces of information that the parent actually needs.

---

## 8. Tree Knapsack with Dependency Constraints

A common formulation requires a child to be selectable only when its parent is selected.

Then:

```text
dp[u][k][0]
dp[u][k][1]
```

represent states based on whether `u` is selected.

When `u` is selected, child states may be constrained to their selected-compatible state. When `u` is not selected, the allowed child state depends on the problem.

Do not invent this transition generically: derive it from the exact dependency rule.

---

## 9. Initialization

A leaf is the simplest tree knapsack.

If selecting a leaf costs one unit and yields value `w`:

```text
dp[leaf][0] = 0
dp[leaf][1] = w
```

For larger nodes, the initial table represents only the node's own contribution before any children are merged.

Initialization is often where off-by-one capacity errors originate.

---

## 10. Feasibility and Negative Infinity

Use an explicit unreachable sentinel.

For max-value DP:

```text
NEG_INF = unreachable
```

Never combine an unreachable state as though it were a real value.

This matters especially during convolution because many `(a,b)` pairs are impossible.

---

## 11. Complexity of Naive Tree Knapsack

If each node has capacity up to `K`, merging a child can cost roughly:

```text
O(sizeCapacity[u] * sizeCapacity[v])
```

Across all child merges, a conservative bound is often:

```text
O(n K²)
```

but the real cost can be substantially smaller when each subtree's capacity is capped by its size or another local bound.

Always analyze the **actual reachable capacity of each subtree**, not just `nK²` mechanically.

---

## 12. Subtree-Size Capacity Capping

If each selected node costs one unit, subtree `u` can never use more than:

```text
subtreeSize[u]
```

Therefore allocate only:

```text
0..min(K, subtreeSize[u])
```

This simple bound can reduce both runtime and memory dramatically.

It also makes the convolution loops easier to reason about.

---

## 13. Small-to-Large Capacity Merging

When child states have different sizes, merge the smaller capacity table into the larger accumulated table where possible.

This does not automatically change every tree-knapsack problem to `O(n log n)`, because convolution still examines compatible pairs.

But careful capacity accounting and merge ordering can substantially reduce practical work.

Do not claim a new asymptotic bound without proving it.

---

## 14. Tree Knapsack vs Ordinary Knapsack

Ordinary knapsack processes a sequence of item types:

```text
item 1 → item 2 → item 3 → ...
```

Tree knapsack processes hierarchical groups:

```text
        u
      / | \
     A  B  C
```

The state of each group is itself a DP table. Merging a child therefore performs a convolution between two DPs.

This is the structural reason tree knapsack is harder.

---

## 15. Max-Plus Convolution View

For optimization:

```text
h[k] = max_i (a[i] + b[k-i])
```

is max-plus convolution.

Tree knapsack repeatedly performs this operation while traversing the tree.

This connects tree knapsack to broader optimization techniques such as:

- Monge optimization;
- convexity;
- divide-and-conquer optimization;
- specialized convolution;
- FFT-like methods for algebraic counting variants.

The applicability of an optimization depends on the shape of the child DP tables.

---

## 16. Counting Tree Knapsack

For counting:

```text
h[k] = Σ_i a[i] * b[k-i]
```

This is ordinary polynomial convolution.

The interpretation becomes:

```text
polynomial for subtree A
× polynomial for subtree B
= polynomial for combined subtree
```

This directly connects tree DP with the generating-function material from earlier lessons.

---

## 17. Boolean Tree Knapsack

For feasibility, use boolean states:

```text
h[k] = OR_i (a[i] AND b[k-i])
```

The same tree structure remains, but the algebra changes.

This illustrates a powerful principle:

> Tree DP defines the dependency structure; the state algebra defines the aggregation behavior.

---

## 18. Multiple Resource Dimensions

A state such as:

```text
dp[u][weight][time]
```

creates multidimensional convolution.

The state space can become enormous.

Before adding a dimension ask:

- Is it genuinely required by the parent?
- Can one resource be converted into a value dimension?
- Can dominated states be removed?
- Is a Pareto frontier sufficient?
- Is approximation acceptable?

State explosion is often the real algorithmic difficulty.

---

## 19. Dominance Pruning

Suppose two states use capacities `c1 <= c2`, but the first has value `v1 >= v2`.

For an at-most-capacity max problem, state 2 may be dominated.

Maintaining only nondominated states can reduce practical convolution cost.

However, dominance must respect the exact state semantics. A state that looks dominated for one future transition may be required when additional constraints exist.

---

## 20. Reconstruction

Value-only tree knapsack can use rolling child tables.

Reconstruction requires remembering which capacity was assigned to every child during each merge, or recomputing those decisions during a second pass.

Possible strategies:

- parent decision tables;
- checkpointing;
- divide-and-conquer reconstruction;
- recomputation from stored child tables.

Separate **value memory** from **witness memory** when optimizing production implementations.

---

## 21. Tree Knapsack with Bounded Child Capacity

A child may have a local maximum capacity determined by its subtree.

When merging:

```text
for a in current capacities:
    for b in child capacities:
        if a + b <= K:
            update(a+b)
```

Always cap the inner loop using both `K` and the child's reachable range.

This simple bound is often the difference between a theoretical and practical implementation.

---

## 22. Merge Order

The order in which children are merged does not change the mathematical result when the merge operation is associative at the object level, but it can change runtime and memory behavior.

Useful heuristics may include:

- merge smaller tables first;
- process constrained children first;
- exploit zero-capacity or sparse states early.

Treat these as engineering optimizations unless you can prove an asymptotic improvement.

---

## 23. Relationship to Lesson 15

Lesson 15 introduced tree DP using constant-size subtree messages such as:

```text
take / skip
```

Tree knapsack extends the same principle:

```text
subtree message = a whole capacity-indexed DP table
```

The conceptual framework is the same; the transition algebra is more expensive because sibling subproblems must divide a shared resource.

---

## 24. Relationship to Lessons 26, 31 and 32

Several previously learned tools become relevant:

- subset convolution helps when the resource is a subset rather than an integer capacity;
- Fenwick/segment trees help when transitions can be reduced to range queries;
- Monge/convex optimization can accelerate certain structured max-plus convolutions.

The goal is not to apply every optimization, but to recognize the structural conditions that permit one.

---

## 25. Correctness Proof

For each node `u`, prove:

> `dp[u][k]` equals the optimal result over exactly the allowed configurations inside `subtree(u)` consuming capacity `k`.

Induction:

1. leaf initialization is correct;
2. assume every child table has the stated meaning;
3. every valid configuration of `u` partitions the capacity among `u` and its children;
4. the convolution enumerates every legal partition;
5. no illegal partition is accepted;
6. the aggregation selects/counts the correct result.

This is the fundamental proof pattern.

---

## 26. Testing

Build a brute-force oracle for very small trees.

Test:

- single node;
- chain;
- star;
- balanced tree;
- capacity `0`;
- capacity larger than `n`;
- zero-value nodes;
- negative values where supported;
- duplicate values;
- all states unreachable except zero;
- random trees;
- random capacities.

For optimization variants, compare optimized convolution against the naive merge on random small arrays.

---

## 27. Numeric Safety

Counting variants can grow exponentially.

Use:

- `BigInt` for exact counts;
- modular arithmetic when the problem specifies a modulus;
- safe sentinels for optimization;
- explicit checks when `Number` precision could be exceeded.

Never silently convert large exact counts through floating-point `Number`.

---

## 28. Backend Applications

Tree knapsack models hierarchical resource allocation:

- organization budgets;
- project portfolios;
- dependency-aware feature selection;
- hierarchical inventory;
- infrastructure capacity planning;
- menu/category selection with dependencies.

Production systems should cap `K`, validate tree structure, and expose predictable failure behavior for oversized state spaces.

---

## 29. AI Engineering Applications

The pattern appears in hierarchical selection and structured optimization:

- allocating inference budgets across a hierarchy;
- selecting model/tool components under a resource limit;
- hierarchical feature selection;
- tree-structured candidate optimization;
- constrained decoding over hierarchical actions.

Exact tree DP is especially useful when the hierarchy and constraints are small enough for deterministic optimization.

---

## 30. Recognition Checklist

When a problem says:

```text
There is a tree
AND
there is a global capacity/resource
AND
child choices share that resource
```

ask:

1. Can the tree be rooted?
2. What capacity does each subtree consume?
3. What does `dp[u][k]` mean exactly?
4. How is `u` initialized?
5. How are child tables merged?
6. Is the merge max-plus, sum-product, boolean, or another algebra?
7. Can capacity be capped by subtree size?
8. Are states dominated?
9. Can merge order reduce practical work?
10. Does a structural optimization such as Monge apply?
11. How will the witness be reconstructed?

---

## 31. Master Pattern

```text
Root tree
   ↓
Define capacity-indexed subtree state
   ↓
Initialize local contribution
   ↓
Process children
   ↓
Convolve current table with child table
   ↓
Cap reachable capacities
   ↓
Prune dominated states if valid
   ↓
Optimize structured convolutions if provable
   ↓
Reconstruct if required
   ↓
Validate against brute force
```

The core insight is simple but powerful:

> **Tree DP compresses a subtree into a message. Tree knapsack makes that message a capacity-indexed function, and every child merge becomes a convolution over the shared resource.**
