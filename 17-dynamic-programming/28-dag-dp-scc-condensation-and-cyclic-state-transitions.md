# 28 — DAG DP, SCC Condensation & Cyclic State Transitions

> **Phase 17 — Dynamic Programming**

## 1. Why This Topic Matters

Dynamic programming is fundamentally about evaluating states in an order that respects dependencies. A directed acyclic graph gives that order explicitly through a topological ordering.

Real systems often contain cycles. The key advanced technique is to separate **acyclic dependency structure** from **cyclic local structure** using strongly connected components (SCCs).

The mental model is:

> **Topological DP solves acyclic dependencies. SCC condensation turns a cyclic graph into a DAG, after which the remaining cyclic behavior must be modeled explicitly rather than ignored.**

---

## 2. DAG DP as State Evaluation

Given a directed graph with no cycles, every edge `u → v` represents a dependency.

A topological order places `u` before `v` for every edge. This gives a valid bottom-up evaluation order.

Typical objectives:

- reachability;
- number of paths;
- minimum cost;
- maximum score;
- longest path;
- resource accumulation;
- earliest/latest arrival.

The recurrence follows the graph rather than an array index.

---

## 3. Topological Sorting

Kahn's algorithm repeatedly removes zero-indegree vertices.

DFS-based topological sorting records vertices after exploring outgoing dependencies.

A valid implementation should also detect cycles when the problem requires a DAG.

For `V` vertices and `E` edges, standard topological sorting is `O(V + E)`.

---

## 4. Longest and Shortest Paths on DAGs

Unlike general graphs, DAGs allow dynamic programming for path optimization even with negative edge weights, because there are no directed cycles.

For longest path:

`dp[v] = max(dp[u] + w(u,v))`.

For shortest path:

`dp[v] = min(dp[u] + w(u,v))`.

The topological order guarantees every predecessor is finalized before its successor.

---

## 5. Path Counting on DAGs

For a source `s`:

`ways[s] = 1`.

For each edge `u → v`:

`ways[v] += ways[u]`.

This counts directed paths in a DAG because every path has a unique final edge into its destination.

Use `BigInt` or modular arithmetic when counts exceed JavaScript's safe integer range.

---

## 6. State-Graph DP

Many DPs are really graph problems in disguise:

```text
DP state
   ↓
legal transition
   ↓
directed edge
   ↓
state graph
   ↓
topological evaluation
```

Examples include:

- word transformation states;
- workflow states;
- parsing states;
- dependency scheduling;
- finite automata without cycles;
- game states with strictly decreasing resources.

Recognizing the graph often makes dependency order obvious.

---

## 7. Strongly Connected Components

An SCC is a maximal set of vertices where every vertex can reach every other vertex in the same component.

Common algorithms include:

- Kosaraju's algorithm;
- Tarjan's algorithm;
- iterative variants for stack-safe implementations.

SCC decomposition runs in `O(V + E)`.

---

## 8. Condensation Graph

Collapse every SCC into one super-node.

The resulting **condensation graph is always a DAG**.

Therefore:

```text
cyclic graph
    ↓
SCC decomposition
    ↓
condensation DAG
    ↓
topological DP across components
```

This is one of the most important bridges between graph algorithms and advanced DP.

---

## 9. What SCC Condensation Does — and Does Not — Solve

Condensation removes cycles from the component-level dependency graph.

It does **not** automatically solve the internal problem inside an SCC.

An SCC may contain:

- infinitely many walks;
- positive-weight cycles;
- negative-weight cycles;
- repeated-state processes;
- finite-state periodic behavior;
- combinatorial internal choices.

The internal semantics must determine the correct DP formulation.

---

## 10. Reachability with SCCs

For ordinary reachability, SCC condensation is extremely useful.

Every vertex in an SCC is mutually reachable. The component DAG then captures reachability between components.

For repeated reachability queries, component IDs can reduce the problem substantially, especially when combined with DAG reachability techniques or bitsets.

---

## 11. Counting Paths vs Counting Walks

This distinction is critical.

A **path** generally does not repeat vertices. A **walk** may repeat vertices.

In a DAG, path and walk counting coincide because cycles do not exist.

In a graph containing an SCC, unrestricted walk counts can become unbounded when a cycle can be traversed arbitrarily many times.

Therefore blindly applying DAG path-counting after SCC compression can be mathematically wrong.

---

## 12. Weighted Cycles

Optimization behaves differently depending on cycle weights.

For maximum-weight walks:

- a reachable positive cycle can make the optimum unbounded;
- otherwise finite-state restrictions may make the problem well-defined.

For minimum-weight walks:

- a reachable negative cycle can make the optimum unbounded.

A correct algorithm must establish whether the optimization domain is finite before applying DP.

---

## 13. Finite-Horizon Cyclic DP

A cycle does not make every DP impossible.

If the number of transitions is bounded by `T`, expand the state with time:

`dp[t][state]`.

The time dimension turns repeated cyclic transitions into an acyclic layered graph:

```text
state at t
    ↓
state at t+1
    ↓
state at t+2
    ↓
...
```

This is the same principle behind finite-horizon stochastic and game DP.

---

## 14. Fixed-Point and Closure Semantics

Some cyclic state systems ask for a stable closure rather than a finite-horizon value.

Examples include monotone reachability propagation and data-flow analysis.

Such problems may require:

- fixed-point iteration;
- worklists;
- monotone lattices;
- SCC-local convergence;
- widening/narrowing in specialized static-analysis settings.

This is no longer ordinary acyclic DP. The termination and convergence argument must be explicit.

---

## 15. SCC-Local DP

A useful advanced pattern is:

1. compute SCCs;
2. build the condensation DAG;
3. process components in topological order;
4. solve or summarize each component's internal behavior;
5. propagate the summary to outgoing components.

The summary may be:

- reachability;
- minimum cost;
- maximum score;
- a transfer relation;
- a finite-state operator;
- a matrix/transfer matrix;
- a set of feasible resources.

The summary must preserve exactly the information required by downstream components.

---

## 16. SCCs + Transfer Operators

A cyclic SCC with a finite state representation can sometimes be summarized by an operator.

This connects directly to Lesson 27:

```text
SCC
 ↓
finite internal state space
 ↓
transition operator
 ↓
operator composition / matrix power
 ↓
component summary
 ↓
condensation DAG DP
```

Thus SCC decomposition and linear-recurrence acceleration can cooperate rather than compete.

---

## 17. Condensation DAG Dynamic Programming

Suppose each component `C` has a summary value `S[C]` and edges between components carry transition costs.

Then ordinary DAG DP can propagate the summaries:

`dp[D] = aggregate(dp[C] + transition(C,D))`.

The difficult part is not the topological loop. It is proving that `S[C]` contains sufficient information about every internal behavior relevant to outgoing transitions.

---

## 18. Multiple Sources and Sinks

Initialize all sources according to the problem's semantics.

For optimization, unreachable states should use a true sentinel such as `Infinity` or `-Infinity`, not an arbitrary large number that can collide with valid answers.

For counting, zero is normally the unreachable identity.

For Boolean reachability, false is the natural identity.

Identity selection is part of state design.

---

## 19. Reconstruction on DAGs

Store a parent or predecessor when an improved value is accepted.

For counting, reconstruction requires choosing a specific witness among potentially many paths.

For lexicographic tie-breaking, compare candidate witnesses consistently rather than relying on traversal order accidentally.

If memory is constrained, recomputation or checkpoint strategies can be used.

---

## 20. Parallelism Insight

All vertices in the same topological layer have no dependency on one another through the current layer.

This exposes potential parallel evaluation.

For production workloads, parallelism is only valid when:

- dependencies are respected;
- aggregation operations are safe;
- shared writes are synchronized or partitioned;
- numerical ordering requirements are understood.

The conceptual DAG is therefore also a dependency graph for scheduling.

---

## 21. Backend Engineering Applications

Useful patterns include:

- dependency resolution;
- workflow orchestration;
- build pipelines;
- package graphs;
- event-processing state machines;
- prerequisite planning;
- service dependency analysis;
- cyclic workflow diagnosis.

SCCs can expose mutually dependent subsystems. Condensation then provides a component-level DAG for higher-level analysis.

---

## 22. AI Engineering Applications

Graph-state DP appears in:

- finite-state decoding;
- structured prediction;
- weighted automata;
- constrained planning;
- dependency-aware generation;
- dynamic computation graphs;
- symbolic search spaces.

When cycles exist, finite horizons, SCC summaries, fixed points, or repeated transition operators may be appropriate depending on the objective.

---

## 23. Correctness Proof Template

A robust proof should separate four claims:

### Claim 1 — Graph decomposition

Every vertex belongs to exactly one SCC, and the condensation graph is acyclic.

### Claim 2 — Internal summary

The summary computed for each SCC preserves exactly the information required by outgoing transitions.

### Claim 3 — Component recurrence

The condensation-DAG recurrence considers every valid component-level dependency exactly once.

### Claim 4 — Final extraction

The selected component/state value corresponds to the original graph problem.

For cyclic internal operators, prove their algebra separately.

---

## 24. Testing Strategy

Build independent oracles for small graphs.

Test:

- empty graph;
- isolated vertices;
- one SCC;
- all vertices acyclic;
- several SCCs in a chain;
- SCCs with multiple outgoing edges;
- self-loops;
- parallel edges;
- disconnected components;
- positive and negative edge weights;
- finite-horizon cyclic transitions.

Use differential tests against brute force for bounded instances.

---

## 25. Recognition Framework

When a DP problem gives a directed state graph, ask:

1. Is the graph guaranteed to be acyclic?
2. If yes, can I topologically order states?
3. If not, what exactly does a cycle mean?
4. Is the horizon finite?
5. Are repeated walks allowed?
6. Can an objective become unbounded?
7. Can SCCs summarize the cyclic regions?
8. Is the internal SCC finite-state?
9. Can a transfer operator or matrix represent repeated behavior?
10. What proof establishes termination and correctness?

Do not force a DAG recurrence onto a cyclic problem without answering these questions.

---

## 26. Common Failure Modes

- running DAG DP on a graph containing cycles;
- treating SCC compression as a complete solution;
- confusing paths with unrestricted walks;
- ignoring positive/negative cycle unboundedness;
- using arbitrary sentinels;
- losing information in SCC summaries;
- forgetting disconnected components;
- relying on DFS recursion for huge JavaScript graphs;
- counting duplicate edges incorrectly;
- assuming fixed-point iteration always terminates;
- using finite-horizon expansion when the horizon is actually unbounded.

---

## 27. Master Pattern

```text
identify states and transitions
        ↓
determine graph semantics
        ↓
if DAG → topological DP
        ↓
if cyclic → characterize cycle meaning
        ↓
finite horizon? → add time/state layer
        ↓
otherwise → compute SCCs
        ↓
condensation DAG
        ↓
summarize internal SCC behavior
        ↓
propagate summaries across components
        ↓
validate bounded cases against brute force
        ↓
prove termination + correctness
```

The deepest lesson is:

> **A cycle is not merely a nuisance in DP; it changes the mathematical object being optimized or counted.**

---

## 28. Mastery Checklist

- [ ] Implement Kahn topological sort.
- [ ] Implement DFS topological sorting with cycle detection.
- [ ] Solve longest/shortest path on a DAG.
- [ ] Count paths on a DAG with safe arithmetic.
- [ ] Implement SCC decomposition.
- [ ] Build the condensation DAG.
- [ ] Distinguish path counting from walk counting.
- [ ] Detect positive/negative-cycle unboundedness where relevant.
- [ ] Build finite-horizon cyclic DP.
- [ ] Design an SCC-local summary.
- [ ] Combine SCC summaries with DAG DP.
- [ ] Connect finite SCC transitions to transfer operators.
- [ ] Handle reconstruction and tie-breaking.
- [ ] Test adversarial cyclic graphs.
- [ ] Prove decomposition, summary sufficiency, recurrence, and extraction.
- [ ] Complete backend and AI labs.
