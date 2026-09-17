# 15 — Tree DP: Subtree States, Tree Matching, Diameter & Rerooting

## 1. Core Mental Model

Root an undirected tree. The resulting parent→child structure is a DAG, so a subtree can be summarized and evaluated in postorder.

The central question is: **what is the smallest sufficient state that a subtree can send to its parent?**

Typical form:

```text
dp[u][state] = combine(own contribution, compatible child states)
```

Because a tree has `n - 1` edges, a local transition over every child is usually `O(n)` overall.

---

## 2. Rooting and Evaluation Order

Build adjacency lists and choose any root. Compute `parent[]` and a traversal `order[]`; processing `order` backwards gives postorder.

```js
const parent = Array(n).fill(-1);
const order = [root];
parent[root] = root;

for (let i = 0; i < order.length; i++) {
  const u = order[i];
  for (const v of graph[u]) {
    if (v === parent[u]) continue;
    parent[v] = u;
    order.push(v);
  }
}

for (let i = order.length - 1; i >= 0; i--) {
  const u = order[i];
  // children are already solved
}
```

For production JavaScript, iterative traversal avoids call-stack failures on a path-like tree.

---

## 3. Subtree-State Design

A state must be sufficient: once the state is known, the parent should not need the internal subtree structure.

Useful states include:

- selected/not selected
- matched to parent/not matched
- best downward path
- aggregate such as size/sum/min/max
- a small finite state describing a constraint

If the parent has two different compatibility cases, expect at least two states.

---

## 4. Maximum Independent Set on a Tree

No adjacent vertices may both be selected. Define:

```text
take[u] = best value when u is selected
skip[u] = best value when u is not selected
```

Then:

```text
take[u] = weight[u] + Σ skip[v]
skip[u] = Σ max(take[v], skip[v])
```

The root answer is `max(take[root], skip[root])`.

### Proof invariant
After processing `u`, each state is optimal among valid solutions satisfying that state at `u`. Once `u`'s state is fixed, child subtrees are independent except for the local adjacency constraint.

For reconstruction, store which child state was selected.

---

## 5. Tree Matching

A matching chooses edges with no shared endpoint. The parent-child relationship creates a local capacity constraint: a vertex can be matched to at most one child if it is not already matched to its parent.

One useful formulation computes a baseline where `u` is not matched to a child, then considers the gain from matching `u` with one particular child. The transition becomes a **best single improvement** problem rather than a generic subset choice.

This pattern—baseline plus a constrained local gain—is broadly reusable in tree DP.

---

## 6. Tree Diameter DP

Define:

```text
down[u] = longest weighted path beginning at u and going downward
```

For child `v` with edge weight `w`:

```text
candidate = w + down[v]
```

The longest path passing through `u` uses the two largest child candidates. Track the global maximum.

For an unweighted tree, every edge weight is `1`. For weighted trees, use the supplied weights.

This is an important decomposition: every simple path has a highest vertex under the chosen root, so its two branches can be combined there.

---

## 7. Subtree Aggregates

Many tree problems are simply postorder aggregation:

```text
state[u] = own(u) ⊕ state[child1] ⊕ state[child2] ...
```

Examples:

- subtree size
- subtree sum
- count of marked nodes
- minimum/maximum descendant value
- height
- custom associative summaries

If `⊕` is associative and constant-time, the complete computation is linear.

---

## 8. Why Rerooting DP Exists

A normal subtree DP answers the problem relative to one root. Some tasks require an answer for **every possible root**.

Re-running the complete DP from every root can become `O(n²)`.

Rerooting uses two passes:

1. **Bottom-up:** compute information from descendants.
2. **Top-down:** propagate the contribution from the parent/outside side.

For every node, combine the outside contribution with all child contributions to obtain its all-tree answer.

---

## 9. Prefix/Suffix Exclusion

At node `u`, suppose child contributions are `c[0...k-1]`. For child `i`, rerooting needs all sibling contributions except `c[i]`.

Naively recomputing that combination for every child can cost `O(k²)`.

Prefix/suffix aggregation gives:

```text
prefix[i] = combine(c[0...i-1])
suffix[i] = combine(c[i...k-1])
exclude(i) = combine(prefix[i], suffix[i+1])
```

Across a tree, the sum of all degrees is `O(n)`, so this keeps many rerooting algorithms at `O(n)`.

---

## 10. Distance-Sum Rerooting

Let `ans[u]` be the sum of distances from `u` to all nodes. First compute subtree sizes and `ans[root]`.

For an unweighted tree, moving the root across `u → v` gives:

```text
ans[v] = ans[u] + n - 2 * size[v]
```

The `size[v]` nodes in `v`'s subtree become one edge closer; the remaining `n - size[v]` nodes become one edge farther.

For edge weight `w`:

```text
ans[v] = ans[u] + w * (n - 2 * size[v])
```

This is a canonical example of turning a global objective into a local rerooting delta.

---

## 11. Generic Rerooting Abstraction

Many all-roots problems can be described using:

- `merge`: combine neighboring messages
- `lift`: transform a message across an edge
- an identity/neutral element when no neighbor contribution exists

Conceptually:

```text
bottom[u] = merge(own(u), lift(bottom[v], edge) for children v)

up[v] = lift(
  merge(own(u), up[u], every child contribution except v),
  edge(u,v)
)

answer[u] = merge(own(u), up[u], all child contributions)
```

Do not force unrelated states into a generic framework. The abstraction is useful only when its algebra matches the actual problem.

---

## 12. Tree DP as Specialized DAG DP

After rooting, every dependency points toward a parent. There are no cross edges, and every non-root node has exactly one parent.

Therefore postorder is a valid topological order. Tree DP is essentially DAG DP with unusually strong structure and only `O(n)` edges.

---

## 13. Reconstruction and Tie-Breaking

Value computation and reconstruction should be separated when possible.

Record decisions such as:

- selected state for a node
- matched child
- child producing the best downward branch
- two branches producing a diameter

If multiple optimal solutions exist, explicitly define the required tie-breaking rule. Do not accidentally make adjacency-list order an API contract.

---

## 14. Complexity and Engineering

For standard local tree DP:

- traversal: `O(n)`
- postorder DP: `O(n)`
- rerooting: `O(n)` when merge/lift are `O(1)`
- memory: `O(n)`

Watch for hidden sibling recomputation that turns a linear-looking recurrence into `O(n²)` on a star.

In JavaScript, use `BigInt` when totals/counts can exceed `Number.MAX_SAFE_INTEGER`; do not mix `number` and `bigint` in arithmetic.

Validate tree inputs in production APIs when required: wrong edge counts, disconnected graphs, cycles, invalid endpoints, and unsafe depth are separate concerns from the DP itself.

---

## 15. Correctness Proof Templates

### Subtree DP
1. Define every state precisely.
2. Assume child states are optimal by induction.
3. Decompose every valid solution at `u` into compatible child solutions.
4. Show the recurrence considers every legal local choice.
5. Therefore the chosen transition is optimal.

### Rerooting
1. Prove bottom-up messages summarize each rooted subtree.
2. Prove top-down messages summarize everything outside the child subtree.
3. Exclude exactly the child being propagated into.
4. Lift the remaining message across the edge.
5. Combine all neighbor messages to obtain the complete all-tree answer at each node.

---

## 16. Testing Strategy

Use:

- brute force for small trees
- differential testing against an independent implementation
- randomized trees
- path, star, balanced, and highly skewed trees
- `n = 1` and `n = 2`
- equal weights and many ties
- negative node weights where supported
- large numeric values
- random vertex relabeling
- randomized adjacency ordering

For rerooting, compare every node's result against a slow per-root oracle on small trees. This catches subtle parent/outside-state errors.

---

## 17. Backend Applications

Tree DP maps naturally to hierarchical data:

- organization structures
- dependency trees
- filesystem/resource aggregation
- category/menu trees
- hierarchical permissions
- quotas and inheritance
- network-tree metrics

A production implementation should keep the state contract explicit and avoid recursive traversal for attacker-controlled or extremely deep input.

---

## 18. AI Engineering Applications

The same abstraction appears in:

- parse-tree scoring
- hierarchical search
- syntax-tree transformations
- tree-structured message aggregation
- hierarchical clustering summaries
- constrained tree decoding
- dynamic programs over latent hierarchical structures

A useful connection is message passing: each subtree compresses its internal structure into a sufficient message sent to its parent.

---

## 19. Interview Framework

When you see a tree problem, ask:

1. Is it really a tree?
2. Can I root it?
3. What must a subtree tell its parent?
4. Does the parent impose a compatibility state?
5. Is bottom-up DP enough?
6. Do I need reconstruction?
7. Do I need an answer for every root?
8. What information crosses the parent edge?
9. Can sibling exclusion be done in `O(1)` using prefix/suffix or a delta formula?
10. Could recursion depth fail?
11. What is the invariant and exact complexity?

The strongest solution derives the state before writing code.

---

## 20. Master Pattern

```text
Tree
 ↓
Root it
 ↓
Define sufficient subtree state
 ↓
Postorder transition
 ↓
Reconstruct if needed
 ↓
Need every root?
 ↓
Bottom-up + top-down rerooting
 ↓
Optimize sibling exclusion
 ↓
Prove invariants + brute-force small cases
```

Tree DP is not a list of tricks. It is a method for compressing hierarchical structure into local sufficient states and, when necessary, propagating those states in both directions.
