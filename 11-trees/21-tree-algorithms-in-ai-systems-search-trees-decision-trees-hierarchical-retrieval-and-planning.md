# 11.21 — Tree Algorithms in AI Systems: Search Trees, Decision Trees, Hierarchical Retrieval & Planning

## 1. Objective

Trees appear in AI as search spaces, decision models, hierarchical indexes, planning structures, expression representations, and interpretable rule systems. The key skill is recognizing when tree structure reduces a large state space into manageable branching decisions.

## 2. Search-Tree Mental Model

A search tree represents states and actions:

```text
state
├── action A → state
├── action B → state
└── action C → state
```

A node is a state representation; an edge represents a transition.

## 3. State vs Tree Node

A state may appear multiple times in a search tree through different paths. Therefore a search tree is not necessarily the same thing as the underlying state graph.

This distinction matters for duplicate detection and memory usage.

## 4. Breadth-First Search

BFS explores states by depth. For unit-cost transitions it finds a shortest path in number of actions, assuming a finite graph and appropriate duplicate handling.

## 5. Depth-First Search

DFS explores one branch deeply before backtracking. It can use substantially less frontier memory than BFS but does not generally return a shortest solution.

## 6. Iterative Deepening

Iterative Deepening DFS repeatedly searches depth limits:

```text
limit = 0, 1, 2, 3, ...
```

It combines DFS-style memory usage with shortest-depth discovery under suitable unit-cost assumptions.

## 7. Uniform-Cost Search

Uniform-Cost Search expands the lowest path-cost frontier node. A priority queue is required when transition costs differ.

## 8. Best-First Search

Best-first strategies prioritize states using an evaluation function. The choice of evaluation determines search behavior and correctness properties.

## 9. A* Search

A* commonly uses:

```text
f(n) = g(n) + h(n)
```

where `g` is accumulated path cost and `h` estimates remaining cost.

## 10. Heuristic Admissibility

A heuristic is admissible when it never overestimates the true remaining cost. Under the standard assumptions, admissibility supports optimality of A* tree search.

## 11. Consistency

A consistent heuristic satisfies a triangle-inequality-like condition. Consistency is particularly useful for graph search because it supports nondecreasing evaluation values along paths and simplifies duplicate/reopen handling.

## 12. Duplicate Detection

Graph search maintains a closed/visited structure so the same state does not expand indefinitely through different paths.

A state identity function must be explicit.

## 13. State Canonicalization

Equivalent states should map to the same canonical representation when duplicate detection depends on equality.

Poor canonicalization can cause either incorrect merging or excessive duplicate work.

## 14. Transposition Tables

In game and combinatorial search, a transposition table caches information about previously encountered states, preventing repeated evaluation of equivalent positions reached through different move orders.

## 15. Minimax Trees

Two-player adversarial search alternates maximizing and minimizing levels. A terminal evaluation is propagated upward according to the player-to-move objective.

## 16. Alpha-Beta Pruning

Alpha-beta pruning avoids exploring branches that cannot affect the final minimax decision.

The result is unchanged from minimax when implemented correctly, but the number of evaluated nodes can be substantially reduced depending on move ordering.

## 17. Branching Factor

If branching factor is `b` and depth is `d`, naïve tree search can grow on the order of `b^d`. Reducing branching, depth, or repeated states can dominate performance improvements.

## 18. Decision Trees

A decision tree recursively partitions examples according to feature tests. Internal nodes represent decisions; leaves represent predictions or actions.

## 19. Decision Tree Splits

A split can be selected using criteria such as impurity reduction or information gain. The algorithm should distinguish training objective from deployment-time inference complexity.

## 20. Overfitting

Deep decision trees can fit training data extremely closely. Depth limits, minimum sample constraints, pruning, and validation procedures can control model complexity.

## 21. Inference Complexity

Decision-tree inference generally follows one root-to-leaf path, so inference cost is related to tree depth and feature-test cost rather than total node count.

## 22. Ensemble Trees

Random forests and gradient-boosted tree systems use many trees. Inference then requires traversing multiple trees, making model size, depth, and number of trees important engineering parameters.

## 23. Hierarchical Retrieval

Large candidate spaces can be partitioned hierarchically so retrieval first selects promising regions and then refines within them.

This reduces the amount of candidate data examined when the hierarchy is well aligned with the query distribution.

## 24. Hierarchical Clustering

A clustering hierarchy represents nested groups. It can support coarse-to-fine retrieval or category navigation.

The tree does not itself guarantee that nearby semantic items will be grouped correctly; the clustering objective and construction method matter.

## 25. Tree-Based Nearest-Neighbor Search

Spatial structures such as KD-trees partition coordinate space. Queries prune regions that cannot contain a better candidate under the chosen distance metric.

## 26. Ball Trees

Ball trees partition points into metric regions bounded by balls. They can be useful for some high-dimensional metric workloads, though performance depends strongly on dimensionality and data distribution.

## 27. VP Trees

Vantage-Point Trees recursively partition metric spaces around a selected reference point. They are applicable where only a distance function is available.

## 28. Search Pruning

A tree search is useful when node metadata provides a safe lower/upper bound allowing entire subtrees to be discarded.

The pruning bound must be mathematically valid or the algorithm may lose correctness.

## 29. Beam Search

Beam search keeps only a bounded number of candidates at each depth. It trades completeness/optimality guarantees for bounded memory and focused exploration.

## 30. Hierarchical Planning

A planning hierarchy can decompose a large goal into subgoals. High-level actions expand into lower-level action sequences.

This is useful when domain structure provides meaningful abstractions.

## 31. Monte Carlo Tree Search

MCTS repeatedly performs selection, expansion, simulation, and backpropagation. Tree statistics guide exploration toward promising actions.

## 32. UCT-Style Selection

A common selection principle balances exploitation and exploration using an upper-confidence expression. The exact formula and constants depend on the algorithm and assumptions.

## 33. Tree Policy vs Default Policy

MCTS separates:

- tree policy: how existing tree nodes are selected;
- expansion policy: when new nodes are added;
- default/rollout policy: how simulations proceed;
- backup policy: how outcomes update ancestors.

## 34. Search Tree Memory Management

Large searches need memory controls such as:

- transposition tables;
- node recycling;
- depth limits;
- beam limits;
- subtree pruning;
- compact state encoding.

## 35. Caching AI Search

Memoization keys should represent complete relevant state. Omitting a state variable can produce incorrect cached results.

## 36. Backend + AI Retrieval Systems

A backend retrieval service may combine:

```text
request
  ↓
coarse hierarchy
  ↓
candidate subset
  ↓
exact scoring
  ↓
reranking
  ↓
response
```

The tree is one stage of the pipeline rather than a complete retrieval solution.

## 37. Correctness Invariants

For AI search systems validate:

1. state identity is deterministic;
2. legal transitions remain legal;
3. heuristic bounds satisfy their stated assumptions;
4. pruning never removes a provably relevant candidate incorrectly;
5. cached values correspond to the exact required state;
6. terminal results propagate according to the objective.

## 38. Complexity

Typical conceptual bounds include:

```text
BFS: O(b^d) space/time in tree-search form
DFS: O(bd) frontier space
A*: exponential worst-case in general
Decision-tree inference: O(depth)
MCTS: proportional to simulation budget × per-simulation work
```

Actual performance depends heavily on duplicate detection, pruning, heuristic quality, branching factor, and state representation.

## 39. Common Mistakes

1. Confusing search trees with state graphs.
2. Using state identity that omits relevant variables.
3. Assuming heuristics are admissible without proof.
4. Treating beam search as guaranteed optimal.
5. Ignoring duplicate states.
6. Building hierarchies without validating retrieval quality.
7. Treating model inference cost as independent of tree depth/size.

## 40. Testing Strategy

Use:

- small exhaustive search spaces;
- reference shortest-path algorithms;
- heuristic-bound tests;
- randomized state transitions;
- adversarial branching factors;
- cache-key collision tests;
- pruning-vs-exhaustive differential tests;
- retrieval recall/latency benchmarks.

## 41. Backend Applications

AI tree algorithms can power:

- workflow planning;
- rule engines;
- search services;
- hierarchical recommendation;
- query optimization;
- routing and candidate filtering.

## 42. AI Engineering Applications

They are directly relevant to:

- game search;
- planning;
- decision trees;
- hierarchical retrieval;
- nearest-neighbor search;
- code/AST reasoning;
- experiment search spaces.

## 43. Interview Framework

```text
1. What is the state?
2. What is the action/transition model?
3. Is this a tree or an underlying graph?
4. What is the branching factor?
5. Is optimality required?
6. Can a heuristic provide safe pruning?
7. How are duplicate states detected?
8. What is the memory budget?
9. What can be cached?
10. Which guarantees are sacrificed by approximation or beam limits?
```

## 44. Revision Checklist

- [ ] I can distinguish a search tree from a state graph.
- [ ] I understand BFS, DFS, UCS, and A* conceptually.
- [ ] I can explain admissible and consistent heuristics.
- [ ] I understand transposition tables.
- [ ] I can explain minimax and alpha-beta pruning.
- [ ] I understand decision-tree inference.
- [ ] I understand hierarchical retrieval.
- [ ] I know KD-tree/Ball-tree/VP-tree concepts.
- [ ] I understand beam search and its trade-offs.
- [ ] I can explain MCTS at a systems level.

## 45. Key Takeaways

1. **AI search trees represent exploration of states and actions; the underlying problem may actually be a graph with repeated states.**
2. **Heuristics are valuable only when their correctness assumptions and trade-offs are understood.**
3. **Decision trees optimize a different problem: learning a hierarchy of feature-based decisions for prediction.**
4. **Hierarchical retrieval reduces candidate work when the hierarchy supplies useful and safe pruning structure.**
5. **Production AI search is a resource-management problem as much as an algorithm problem: state encoding, caching, pruning, memory, latency, and evaluation all matter.**
