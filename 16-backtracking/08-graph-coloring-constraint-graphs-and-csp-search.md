# 16.08 — Graph Coloring, Constraint Graphs & CSP Search

## 1. Concept Definition

Graph coloring assigns a color to every vertex so that adjacent vertices receive different colors.

The decision problem asks whether a graph can be colored with at most `k` colors. Optimization asks for the minimum number of colors required, the **chromatic number**.

## 2. CSP Model

Graph coloring maps directly to CSP:

```text
Variables  → vertices
Domains    → available colors
Constraints → adjacent vertices must differ
Search     → assign → propagate → recurse → undo
```

## 3. Basic Backtracking

Choose an uncolored vertex, try each currently legal color, recurse, and undo the assignment after the branch finishes.

A partial coloring is valid when every colored edge satisfies the inequality constraint.

## 4. State Representation

Typical state:

```text
colors[v]
adjacencyList
availableColors[v]
```

A simpler implementation can derive legal colors from already colored neighbors on demand.

## 5. Color Availability

For vertex `v`, collect colors used by colored neighbors and remove them from the domain.

The remaining colors are legal candidates.

## 6. MRV Heuristic

Select the uncolored vertex with the smallest legal domain.

This fail-first strategy often detects impossible branches earlier.

## 7. Degree Tie-Breaking

If multiple vertices have the same domain size, choose the vertex with the largest number of uncolored neighbors.

The intuition is to assign the variable with the greatest future impact first.

## 8. Saturation Degree

DSATUR chooses the uncolored vertex with the largest number of distinct colors already used by its neighbors.

Degree is commonly used as a tie-breaker.

## 9. Least-Constraining Color

Among legal colors, prefer the color that removes the fewest options from neighboring vertices.

This affects search order, not the set of valid colorings.

## 10. Forward Checking

After assigning a color, remove that color from each uncolored neighbor's domain.

If any neighbor becomes domain-empty, backtrack immediately.

## 11. Constraint Propagation

Propagation can repeatedly apply forced consequences.

For example, if a vertex has exactly one legal color, assign it and propagate again.

## 12. Clique Lower Bound

A clique of size `q` requires at least `q` colors because every pair of its vertices is adjacent.

Finding large cliques therefore provides a lower bound on the chromatic number.

## 13. Greedy Upper Bound

A valid greedy coloring provides an upper bound on the chromatic number.

It does not generally prove that the number of colors used is minimum.

## 14. Branch and Bound

For minimum-color search, maintain an incumbent coloring using `bestColors` colors.

Any partial branch whose lower bound is already at least the incumbent can be pruned when it cannot improve the objective.

Bounds must be mathematically safe.

## 15. Decision vs Optimization

Separate:

```text
k-colorability → can k colors work?
chromatic number → what is the minimum k?
```

Decision search can be used repeatedly to determine the minimum color count, while optimization search can integrate branch and bound.

## 16. Greedy Coloring

A simple greedy algorithm processes vertices in some order and assigns the smallest available color.

Its result depends strongly on ordering.

Common orderings include degree, smallest-last, and DSATUR-inspired choices.

## 17. Why Greedy Is Not Exact

A greedy coloring may use more colors than necessary.

Therefore it is useful as:

- a fast feasible solution
- an upper bound
- a candidate ordering strategy

but not as a universal exact chromatic-number algorithm.

## 18. Bipartite Boundary

A graph is bipartite exactly when it is 2-colorable.

BFS/DFS parity coloring provides a polynomial-time test for this special case.

This is an important example of recognizing when a general CSP can collapse into a simpler graph algorithm.

## 19. Complete Graph Boundary

A complete graph on `n` vertices requires exactly `n` colors.

This provides a useful correctness and worst-case test.

## 20. Sparse vs Dense Graphs

The cost of coloring depends strongly on graph density.

Adjacency lists are generally appropriate for sparse graphs; adjacency matrices can be useful for dense graphs and constant-time edge checks.

## 21. Symmetry Breaking

Color labels are interchangeable.

If a valid coloring uses colors `0,1,2`, relabeling them can produce an equivalent coloring.

Fixing the first vertex to color `0` removes one global symmetry.

More aggressive canonical color introduction rules can reduce equivalent branches, but they must preserve the requested output semantics.

## 22. Canonical Color Introduction

When constructing a coloring, introduce a new color only when needed and assign it the next canonical color index.

This can enumerate partitions of vertices into color classes without exploring arbitrary color-label permutations.

## 23. Color-Class Representation

Instead of storing only `colors[v]`, maintain color classes:

```text
classes[0]
classes[1]
...
```

This can simplify some objective and symmetry calculations.

## 24. DSATUR Connection

DSATUR is a classic coloring heuristic based on saturation degree.

A branch-and-bound version can solve many practical exact coloring instances much faster than naive vertex ordering.

## 25. Constraint Graph Interpretation

The graph itself is the CSP constraint graph.

Every edge represents a binary inequality constraint.

This makes graph coloring a particularly clean bridge between graph algorithms and general CSP reasoning.

## 26. Tree Graphs

Every nonempty tree is bipartite and therefore needs at most two colors.

A tree can be colored in linear time using BFS or DFS.

This illustrates why structural graph properties can outperform generic backtracking.

## 27. Chordal Graph Boundary

Chordal graphs have special coloring algorithms based on perfect elimination orderings.

Recognizing graph classes can replace exponential general coloring with specialized polynomial algorithms.

## 28. Planar Graph Boundary

Planar graphs have a bounded coloring requirement, but finding an optimal coloring remains a different problem from merely proving a general upper bound.

Do not confuse a theoretical color bound with an algorithm that constructs a minimum coloring for every graph.

## 29. Exact Algorithms

Exact coloring can use:

- backtracking
- branch and bound
- DSATUR
- integer programming
- SAT
- constraint programming

The right approach depends on graph size, density, and whether one solution or the optimum is required.

## 30. SAT Encoding

A Boolean encoding can define variables such as:

```text
x(v,c) = vertex v receives color c
```

Constraints enforce exactly one color per vertex and prevent adjacent vertices from sharing a color.

## 31. ILP Encoding

Binary variables can represent vertex-color assignments.

Linear constraints enforce assignment and adjacency restrictions.

This connects graph coloring to optimization solver techniques.

## 32. Counting Colorings

Counting valid `k`-colorings is harder than merely finding one.

Backtracking can enumerate or count colorings, but symmetry and memoization become important as the graph grows.

## 33. Memoization Boundary

Different assignment orders can reach equivalent residual CSP states.

Memoization is useful only when the state key fully captures future constraints.

For arbitrary graphs, designing compact canonical keys can itself be expensive.

## 34. Connected Components

Independent connected components can be colored separately.

If only feasibility is required, every component must be feasible.

If counting colorings with fixed labeled colors, the counts of independent components multiply.

## 35. Backend Applications

Graph-coloring reasoning appears in:

- scheduling jobs into non-conflicting slots
- assigning services to isolated resource groups
- database query/resource conflict planning
- test execution slot assignment
- partitioning incompatible workloads

Vertices represent tasks/resources and edges represent conflicts.

## 36. AI Applications

Useful models include:

- assigning agents to non-conflicting groups
- experiment batching
- GPU/resource allocation conflicts
- tool scheduling
- evaluation workload partitioning
- knowledge-graph clustering constraints

Again, the graph is a constraint model; the real system may use additional costs and capacities.

## 37. Hybrid AI + CSP

An AI system can propose an assignment order or candidate colors while an exact validator enforces graph constraints.

This separates heuristic proposal from deterministic legality.

## 38. Correctness Invariant

At every recursion depth:

> Every assigned vertex has a legal color, and every processed edge whose endpoints are both assigned satisfies the coloring constraint.

Forward-checking domains contain only colors that remain legal under current assignments.

## 39. Completeness

If every legal color is considered for every selected vertex and no valid state is incorrectly pruned, every valid coloring remains reachable.

Variable and color ordering may change discovery order but not completeness.

## 40. Safe Pruning

Safe pruning examples include:

- a vertex has no legal color
- a `k`-color decision exceeds the allowed colors
- a proven lower bound is already incompatible with the optimization objective
- an exact graph-class theorem establishes infeasibility

Heuristic suspicion is not sufficient for pruning.

## 41. Independent Validation

Given a returned coloring, verify every edge:

```text
colors[u] !== colors[v]
```

and verify every color lies within the declared range.

An independent validator should not reuse the solver's internal conflict logic blindly.

## 42. Testing Strategy

Test:

- empty graph
- single vertex
- edgeless graph
- one edge
- path
- cycle
- odd cycle
- complete graph
- bipartite graph
- disconnected graph
- duplicate edges
- self-loops
- sparse random graphs
- dense random graphs

A self-loop makes ordinary proper coloring impossible because a vertex would have to differ from itself.

## 43. Differential Testing

Compare:

```text
naive backtracking
MRV
DSATUR
branch and bound
bipartite solver where applicable
SAT/ILP oracle for small cases
```

Normalize color labels when comparing equivalent unlabeled colorings.

## 44. Metamorphic Testing

Graph isomorphisms should preserve colorability and chromatic number.

Renaming vertices should not change the feasibility result.

Adding an edge cannot reduce the minimum number of colors required.

Removing an edge cannot increase it.

These are strong metamorphic properties.

## 45. Performance Metrics

Measure:

- recursive nodes
- conflicts detected
- domain reductions
- branches pruned
- maximum depth
- colors used
- runtime
- memory

For exact coloring, nodes visited often provide more diagnostic information than runtime alone.

## 46. Complexity

General graph coloring optimization is computationally difficult, so exact backtracking has exponential worst-case behavior.

Greedy coloring is fast but does not generally guarantee optimality.

Special graph classes can admit polynomial-time algorithms.

## 47. Implementation Lab

Implement:

1. graph validation
2. simple greedy coloring
3. k-colorability backtracking
4. MRV coloring
5. degree tie-breaker
6. DSATUR heuristic
7. forward checking
8. canonical color introduction
9. exact chromatic-number search
10. branch-and-bound coloring
11. bipartite special-case solver
12. coloring validator
13. coloring counterexample generator
14. differential test harness
15. Backend conflict-slot assignment
16. AI resource-conflict assignment

## 48. Interview Framework

Explain:

```text
Variables:
vertices

Domain:
colors 0..k-1

Constraint:
adjacent vertices differ

Heuristic:
MRV / DSATUR

Propagation:
remove neighbor's chosen color

Choice:
assign legal color

Transition:
apply → recurse → undo

Base:
all vertices assigned
```

Then discuss why greedy is not universally optimal and how branch and bound improves exact search.

## 49. Revision Checklist

- [ ] Model graph coloring as a CSP.
- [ ] Implement basic backtracking.
- [ ] Implement MRV.
- [ ] Understand degree and DSATUR ordering.
- [ ] Implement forward checking.
- [ ] Understand color-label symmetry.
- [ ] Implement canonical color introduction.
- [ ] Distinguish feasibility from chromatic-number optimization.
- [ ] Use greedy coloring as an upper bound.
- [ ] Use clique information as a lower bound.
- [ ] Understand branch and bound.
- [ ] Recognize bipartite/tree special cases.
- [ ] Understand SAT/ILP encodings.
- [ ] Validate independently.
- [ ] Differential-test exact solvers.
- [ ] Apply conflict coloring to Backend and AI scheduling/resource problems.

## Key Takeaways

1. Graph coloring is a canonical CSP over a graph's constraint edges.
2. MRV, degree ordering, DSATUR, and forward checking can dramatically reduce practical search.
3. Greedy coloring supplies useful feasible solutions and upper bounds but is not generally exact.
4. Clique and structural graph properties provide safe lower bounds and special-case algorithms.
5. Color-label symmetry is a major source of redundant search.
6. Exact coloring connects naturally to branch and bound, SAT, ILP, and constraint programming.
7. Independent validation and metamorphic testing are essential when optimizing the search engine.
8. The same model directly represents Backend conflict scheduling and AI resource-assignment constraints.
