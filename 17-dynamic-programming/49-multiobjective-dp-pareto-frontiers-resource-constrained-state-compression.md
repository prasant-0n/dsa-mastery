# 49 — Multiobjective DP: Pareto Frontiers, Resource Constraints & State Compression

## 1. Why this chapter exists

Many dynamic programs optimize one scalar objective:

\[
DP(s)=\operatorname{opt}_{a\in A(s)} f(s,a,DP(s')).
\]

Real engineering problems often have several objectives at the same time:

- maximize revenue while minimizing cost,
- maximize quality while staying within latency and memory budgets,
- minimize distance while minimizing risk,
- maximize accuracy while respecting a resource limit,
- optimize throughput, reliability, and operating cost together.

A single scalar DP value is no longer sufficient unless the objectives can be combined into one justified scalar objective.

This chapter studies **multiobjective dynamic programming**: each DP state may carry a set of nondominated outcomes rather than one number.

The central question becomes:

> Which outcomes must survive so that no future continuation can make a discarded outcome relevant?

That is a state-compression problem, an optimization problem, and a correctness problem at the same time.

This lesson is distinct from ordinary DP optimization lessons. The goal is not merely to make a scalar recurrence faster. The goal is to represent a **frontier of incomparable trade-offs** without losing globally relevant solutions.

---

## 2. Formal model

Let a state `s` admit decisions `a`. Each transition contributes a vector cost or reward:

\[
\mathbf{x}=(x_1,x_2,\ldots,x_d).
\]

A complete solution has vector objective

\[
\mathbf{X}=\sum_i \mathbf{x}_i
\]

for additive objectives, or a more general compositional operator in other DPs.

For a minimization problem, vector `x` **dominates** vector `y` when:

\[
x_i \le y_i \quad\forall i
\]

and at least one coordinate is strictly smaller.

For maximization, reverse the inequalities. Mixed directions can be normalized by negating maximization coordinates or by defining a direction vector.

The **Pareto frontier** is the set of feasible vectors not dominated by another feasible vector.

A key consequence:

> There may be no single best vector.

Instead, the DP state must preserve every outcome that could still become optimal under a future preference or resource constraint.

---

## 3. Dominance is safe only under compositional assumptions

Suppose state `s` has two partial outcomes `x` and `y`, and `x` dominates `y`.

Discarding `y` is safe when every possible continuation preserves the dominance relation.

For additive nonnegative-resource transitions this is straightforward. If the same continuation adds `c` to both outcomes:

\[
x+c \preceq y+c.
\]

But dominance pruning can become unsound when the future transition depends on information omitted from the vector.

Examples:

- a hidden mode changes future costs;
- a remaining resource is not included in the state;
- future feasibility depends on the exact path rather than only accumulated metrics;
- objectives interact non-monotonically.

Therefore a dominance rule is a theorem about the **state contract**, not merely a convenient optimization.

---

## 4. State sufficiency in multiobjective DP

A robust state design answers:

1. What historical information can affect future transitions?
2. Which objective/resource dimensions must be retained?
3. Are all future comparisons based only on the stored summary?
4. Is the combination operator monotone with respect to dominance?

A common representation is:

```text
DP[state] = set of labels
label = {
    objectiveVector,
    witness / predecessor,
    resourceSummary,
    metadata
}
```

The scalar DP mental model becomes:

```text
a value per state
```

while the multiobjective model becomes:

```text
a frontier of labels per state
```

This is sometimes called **label-setting** or **label-correcting** reasoning, especially in resource-constrained path problems.

---

## 5. Pareto frontier invariant

For each DP state `s`, define `F[s]` as its retained labels.

The basic invariant is:

> `F[s]` contains exactly the nondominated summaries among the partial solutions represented by the processed portion of the state graph, subject to the chosen state semantics.

An implementation can safely maintain only a subset if it proves that every discarded label is dominated by a retained label under a continuation-preserving relation.

This invariant is the multiobjective analogue of the ordinary DP invariant that `dp[s]` equals the optimum value among all paths/choices reaching `s`.

---

## 6. Example: cost and risk constrained path DP

Suppose a DAG edge has:

```text
cost = money spent
risk = expected failure exposure
```

A state may hold labels:

```text
(10, 9)
(11, 6)
(15, 3)
```

None dominates another.

A later policy may impose:

```text
risk <= 6
```

making `(11, 6)` and `(15, 3)` candidates. Another policy may impose:

```text
risk <= 4
```

leaving `(15, 3)`.

A scalarized objective such as `cost + lambda * risk` chooses one point for one particular `lambda`; the Pareto frontier keeps the set of trade-offs available for many future queries.

---

## 7. Scalarization versus explicit Pareto DP

There are three common approaches.

### Weighted-sum scalarization

Choose

\[
\min_x \lambda_1x_1+\cdots+\lambda_dx_d.
\]

Advantages:
- simple scalar DP,
- often fast,
- useful when the policy weight is known.

Limitations:
- may miss unsupported Pareto points on non-convex fronts;
- different weights may require many separate runs;
- a policy change can require recomputation.

### Lexicographic optimization

Optimize objective 1 first, then objective 2 among ties, and so on.

This produces one deterministic optimum but does not expose the entire trade-off surface.

### Explicit Pareto DP

Store nondominated vectors directly.

Advantages:
- preserves trade-offs,
- supports later constraints and preference queries,
- can answer many what-if policy questions.

Cost:
- frontier size can be exponential or pseudo-polynomial;
- dominance maintenance becomes a major engineering concern.

---

## 8. Frontier explosion

The central difficulty is that

\[
|F[s]|
\]

may be large.

A scalar DP often has one value per state. A multiobjective DP may have many labels per state.

Worst-case frontier size can be exponential in the input size or in the number of objectives.

Therefore complexity should be reported as:

\[
O(\text{transition work} \times \text{frontier size})
\]

or more precisely using the maximum/average label count per state.

Never claim a multiobjective DP is polynomial merely because the underlying graph is a DAG.

The graph may be easy while the frontier is combinatorially large.

---

## 9. Label generation

A transition from state `u` to `v` transforms every retained label `L` at `u`:

```text
L' = combine(L, transition)
```

Then `L'` competes with existing labels in `F[v]`.

A correct generic pipeline is:

```text
for each predecessor state u:
    for each label in F[u]:
        candidate = extend(label, edge)
        insert candidate into F[v]
        prune dominated labels
```

The entire lesson becomes easier once `extend`, `dominates`, and `prune` are explicit contracts.

---

## 10. Dominance insertion

The naive insertion algorithm is:

1. If an existing label dominates the candidate, discard the candidate.
2. Otherwise insert the candidate.
3. Remove every existing label dominated by the candidate.

This is simple but can cost `O(k)` per insertion for frontier size `k`.

With many transitions, this becomes the main bottleneck.

Engineering therefore depends heavily on frontier data structures and objective dimensionality.

---

## 11. Two-objective frontier geometry

For two objectives, a minimization frontier can often be ordered by one coordinate.

If labels are sorted by increasing `cost`, then a nondominated frontier must have strictly decreasing `risk` after duplicate handling.

This gives powerful specialized algorithms:

- binary search by one coordinate,
- predecessor/successor checks,
- ordered maps,
- monotone scans during merge,
- skyline computation in `O(k log k)` for a batch.

This geometric structure is much weaker in three or more dimensions, where generic dominance queries become harder.

---

## 12. Batch skyline pruning

Suppose a transition merge generates candidates:

```text
(8, 10)
(9, 8)
(12, 7)
(11, 9)
...
```

Instead of checking every candidate against every other candidate, compute a skyline in batches.

For two objectives:

1. sort by objective 1;
2. scan in the appropriate direction;
3. keep a candidate only if objective 2 improves the best seen value.

This reduces a batch from quadratic comparisons to sorting plus a linear scan.

The same idea extends to higher dimensions using specialized data structures, recursive dominance algorithms, or offline methods, but complexity grows rapidly with dimension.

---

## 13. Epsilon dominance

Exact Pareto fronts may be too large for production.

An approximation can retain a label only when it is not approximately dominated under a tolerance.

For example, for minimization one might define:

\[
x_i \le (1+\epsilon)y_i
\]

for multiplicative approximation, or coordinate-wise additive tolerances.

This can dramatically reduce frontier size.

But the semantics change:

```text
exact DP
```

becomes

```text
approximate DP
```

The approximation guarantee must be explicit. Never silently replace exact dominance with heuristic bucketing.

---

## 14. Resource-constrained shortest path as a canonical problem

A classic structure is:

```text
primary objective: minimize cost
resource: latency <= B
```

One representation is:

\[
dp[v][r] = \text{minimum cost reaching }v\text{ with resource }r.
\]

When the resource is a small integer bound, this may become ordinary pseudo-polynomial DP.

When the resource range is huge, sparse labels are often preferable:

```text
F[v] = {(resource, cost), ...}
```

The frontier representation is therefore the sparse analogue of a dense resource-indexed DP table.

This is an important bridge between classic knapsack-style DP and label-based multiobjective optimization.

---

## 15. Resource dominance

For a minimization objective and a resource to minimize, label `(r1,c1)` dominates `(r2,c2)` when:

\[
r_1\le r_2,\quad c_1\le c_2.
\]

If one label uses no more resource and no more cost, the worse label can never become useful under a monotone continuation.

For a resource capacity `r <= B`, this pruning is especially powerful because many labels are immediately redundant.

The exact relation depends on resource direction:

- resource consumed → smaller is better;
- capacity remaining → larger may be better;
- reward accumulated → larger is better.

Normalize semantics before implementing dominance.

---

## 16. Dense DP versus sparse frontiers

A bounded resource gives two implementation styles.

### Dense

```js
dp[state][resource] = best objective
```

Advantages:
- predictable memory;
- simple transitions;
- fast typed-array implementations.

Disadvantages:
- wastes space on unreachable resources;
- may be impossible when the resource bound is huge.

### Sparse

```js
frontier[state] = [label, label, ...]
```

Advantages:
- stores only reachable nondominated points;
- naturally supports irregular ranges.

Disadvantages:
- object/array overhead in JavaScript;
- more expensive dominance maintenance;
- memory locality is worse.

The correct representation depends on density, dimension, and query workload.

---

## 17. Counting and multiplicity on a frontier

A label can represent more than one solution.

For example:

```text
label = {
  vector,
  count
}
```

If two paths produce exactly the same objective vector, merge them and add their counts.

This is different from dominance:

```text
same vector -> combine multiplicity
worse vector -> discard if safely dominated
better vector -> may delete others
```

With `BigInt` counts, exact multiplicity can be maintained even when the number of optimal solutions is enormous.

---

## 18. Reconstructing Pareto-optimal witnesses

Each retained label can store:

```text
parentState
parentLabelId
transitionId
```

This creates a **label DAG** even when the original DP state graph is simple.

Important engineering questions:

- Can labels be deleted after their children have been generated?
- Must references remain stable?
- How is memory reclaimed?
- How are all Pareto-optimal witnesses enumerated?
- How are ties represented?

For large frontiers, immutable label IDs are usually easier to audit than deep object copies.

---

## 19. Querying the frontier

Once the full frontier is available, many downstream questions become cheap.

Examples:

```text
minimum cost with risk <= R
minimum risk with cost <= C
maximum reward under two budgets
lexicographically best feasible point
weighted objective for a chosen lambda
```

For two sorted objectives, these queries often reduce to binary search.

Thus an expensive preprocessing DP can support many cheap policy queries.

This is especially useful when the optimization preferences change more frequently than the underlying data.

---

## 20. Hybrid scalarization + frontier refinement

One practical architecture is:

1. use scalarized runs to find promising regions;
2. generate candidate labels near policy boundaries;
3. maintain an exact local frontier where needed;
4. fall back to exact expansion when a proof of dominance is unavailable.

Another hybrid is:

```text
coarse approximate frontier
        ↓
exact refinement of selected cells
```

This is useful when an application needs interactive responses but exact guarantees only for final decisions.

The approximation/exact boundary must remain explicit.

---

## 21. Multiobjective knapsack

Suppose each item contributes:

```text
weight
profit
risk
```

A capacity-constrained DP can retain, for each weight, nondominated `(profit, risk)` pairs.

A candidate can be removed when another candidate has:

```text
at least as much profit
and at most as much risk
```

for the same or compatible capacity state.

This creates a nested frontier structure:

```text
capacity state
    -> Pareto labels
```

The main challenge is frontier explosion.

Useful engineering tools include:

- weight-based dense DP when capacity is small;
- sparse maps when weights are large;
- batch skyline pruning;
- approximate epsilon grids when exactness is not mandatory.

---

## 22. Multiobjective sequence DP

Sequence alignment can also become multiobjective:

- maximize similarity,
- minimize edits,
- minimize gap cost,
- minimize risk or latency.

A DP cell no longer necessarily stores one alignment score. It may store a frontier of trade-offs.

This connects naturally to the repository's earlier sequence DP, edit-distance, alignment, automaton, and WFST material.

The important new idea is not the recurrence itself. It is the **frontier-valued state** and the dominance invariant.

---

## 23. Label explosion and adaptive pruning

A production system should measure frontier behavior instead of assuming it is small.

Useful metrics:

```text
labels generated
labels retained
labels dominated
max frontier size
average frontier size
peak memory
merge time
pruning time
```

When a frontier grows rapidly, possible responses include:

- switch to dense resource DP;
- bucket objective values;
- apply epsilon dominance;
- change objective decomposition;
- increase scalarization;
- impose explicit query-specific bounds;
- fall back to a slower exact algorithm only for selected states.

These are algorithm-policy choices and must preserve the application's correctness contract.

---

## 24. Higher-dimensional dominance

For `d >= 3`, simple sorted-frontier tricks become insufficient.

Possible techniques include:

- range trees,
- Fenwick/segment trees after coordinate compression for specialized queries,
- divide-and-conquer dominance algorithms,
- offline skyline computation,
- kd-trees or other spatial indexes for heuristic workloads.

However, data structures only help when the query type matches their supported operations.

Do not add a sophisticated dominance structure before measuring the real bottleneck.

---

## 25. Objective directions and normalization

A safe implementation should normalize every objective to one convention.

For example:

```js
objective = [cost, -profit, risk]
```

where all coordinates are minimized.

Then one generic dominance predicate can be used.

Store the original interpretation separately so public APIs remain readable.

A surprising number of multiobjective bugs come from mixing:

```text
smaller is better
```

with

```text
larger is better
```

inside one pruning routine.

---

## 26. Feasibility versus preference

Separate two concepts:

### Hard constraints

```text
latency <= 200ms
memory <= 2GB
risk <= 0.05
```

These eliminate solutions.

### Soft objectives

```text
maximize quality
minimize cost
```

These define the Pareto frontier.

A clean architecture often performs:

```text
hard-feasibility filter
        ↓
Pareto pruning
        ↓
policy query
```

Mixing constraints into objective semantics can accidentally retain infeasible labels or discard feasible ones.

---

## 27. Monotonicity and safe resource pruning

Many resource constraints are monotone:

if resource usage already exceeds a hard upper bound and future transitions cannot reduce usage, the label can be discarded immediately.

Similarly, if an objective can only worsen from the current point, a bound can prune the branch.

This is branch-and-bound reasoning integrated into multiobjective DP.

The proof obligation is:

> The pruning bound must dominate every possible continuation from this partial state.

An optimistic bound may prune only when the current best policy threshold already cannot be beaten.

---

## 28. Multiobjective DP and parameterized complexity

Suppose a resource bound is `B`, objectives are integer-valued, and every transition changes resource by a nonnegative amount.

A dense resource DP may have complexity roughly:

\[
O(|E|B)
\]

or a related pseudo-polynomial form.

A Pareto representation instead depends on the number of nondominated labels.

This gives two parameterizations:

```text
numeric bound
```

versus

```text
frontier complexity
```

Choosing the smaller effective parameter can determine the implementation strategy.

---

## 29. Correctness proof template

A standard proof has four parts.

### Lemma 1 — State sufficiency

Every two partial solutions represented by the same state summary have identical future feasibility and transition semantics, except for the stored objectives/resources.

### Lemma 2 — Dominance preservation

If `x` dominates `y` at a state, every valid continuation of `y` has a continuation through `x` that is no worse under every tracked dimension.

### Lemma 3 — Frontier completeness

Every nondominated partial solution is generated or represented by a retained label.

### Theorem — Query correctness

Selecting the best label satisfying the final policy/constraints returns the desired answer.

Without Lemma 2, pruning is only a heuristic.

---

## 30. Differential testing strategy

The strongest practical oracle for small instances is brute force.

For random small inputs:

1. enumerate every feasible complete solution;
2. compute its objective vector;
3. build the true Pareto frontier;
4. run the optimized DP;
5. canonicalize both frontiers;
6. compare exact sets.

Then test every retained witness against the original problem semantics.

For approximate variants, compare the approximation guarantee rather than exact frontier equality.

---

## 31. Metamorphic tests

Useful properties include:

### Duplicate transition
Adding an identical transition should change multiplicity only when counting solutions, not the set of objective vectors.

### Positive constant shift
Adding the same constant to an objective for every complete solution should preserve Pareto ordering.

### Dominated item
Adding an item that is provably dominated under all feasible continuations should not improve the frontier.

### Relaxed resource bound
Increasing a monotone resource capacity should never remove an already feasible Pareto point from the feasible frontier, though the frontier may gain new points.

### Objective scaling
Multiplying one objective by a positive constant preserves dominance ordering on that coordinate.

These tests catch subtle direction and pruning bugs.

---

## 32. Backend engineering applications

### Capacity-aware request routing

State = partial routing decision.

Objectives = latency, cost, reliability.

A frontier can answer different customer or SLO policies without rebuilding the routing DP.

### Resource allocation

State = tasks processed.

Objectives = value, compute cost, memory, risk.

The final planner queries the frontier for the active budget policy.

### Scheduling

Objectives = makespan, penalty, resource usage.

A Pareto frontier exposes trade-offs to an operations layer instead of forcing one arbitrary scalar weight.

---

## 33. AI engineering applications

Structured inference can have multiple competing criteria:

- model score,
- latency,
- token budget,
- safety penalty,
- memory footprint.

A frontier-valued DP can retain candidate structured hypotheses under several dimensions and choose among them after runtime policy information becomes available.

For sequence decoding, this resembles maintaining multiple paths in a weighted automaton while pruning labels that are provably dominated under the tracked dimensions.

The central engineering rule remains:

> Never prune a hypothesis merely because it is worse on one objective; prune it only when another hypothesis is no worse on every tracked dimension and future continuation preserves that relation.

---

## 34. JavaScript engineering

Prefer compact numeric arrays when objective dimension and representation are fixed.

For example:

```js
// conceptual label layout
// [objective0, objective1, parentLabelId, transitionId]
```

Avoid creating millions of tiny objects if profiling shows garbage collection pressure.

Use `Number` only when exact integer arithmetic is safe. Use `BigInt` for exact large counts or arithmetic outside safe integer limits.

Do not mix `Number` and `BigInt` in arithmetic expressions without explicit conversion.

For two-dimensional fronts, sorted arrays can be faster and more memory-efficient than generic sets.

Benchmark before selecting the representation.

---

## 35. Production failure modes

Common mistakes:

1. treating one weighted sum as the complete Pareto frontier;
2. pruning on one objective instead of true dominance;
3. forgetting an objective direction;
4. omitting a resource dimension from the state;
5. assuming frontier size is small;
6. merging equal vectors incorrectly when counts matter;
7. deleting labels that are still referenced by witnesses;
8. using approximate pruning while claiming exactness;
9. using floating-point equality for exact objective vectors;
10. failing to revalidate final labels against hard constraints.

Most of these are contract failures rather than syntax errors.

---

## 36. Recognition framework

When you see a problem with several competing quantities, ask:

```text
1. Are there multiple objectives or hard resource constraints?
2. Can future decisions depend only on a compact state summary?
3. Is dominance preserved under every continuation?
4. Is the frontier small, bounded, or pseudo-polynomial?
5. Can a dense resource DP avoid explicit labels?
6. Is two-dimensional skyline pruning available?
7. Are approximate guarantees acceptable?
8. Do I need all trade-offs, or only one fixed policy?
9. Can I preprocess a frontier once and answer many policy queries?
10. What is the exact witness/counting contract?
```

This prevents both under-modeling and unnecessary frontier complexity.

---

## 37. Master pattern

The reusable pattern is:

```text
problem
  ↓
state sufficiency
  ↓
vector-valued partial solution
  ↓
dominance relation
  ↓
transition extension
  ↓
frontier insertion / skyline pruning
  ↓
resource and bound pruning
  ↓
final policy query
  ↓
witness + verification
```

At expert level, the most important skill is not implementing a particular skyline data structure. It is proving that the retained frontier is sufficient for every future continuation relevant to the application's contract.

---

## 38. Final takeaway

Ordinary DP asks:

> What is the best value for this state?

Multiobjective DP asks:

> Which incomparable values must survive for this state so that no valid future decision is lost?

That change sounds small, but it changes the representation, complexity analysis, pruning proof, memory model, testing strategy, and production architecture.

The essential discipline is:

```text
State must be sufficient.
Dominance must be proved safe.
Frontier size must be measured.
Approximation must be explicit.
Witnesses and multiplicities must have clear semantics.
```

Once those contracts are explicit, Pareto-frontier DP becomes a systematic extension of the same DP principles developed throughout this phase: state design, transitions, invariants, decomposition, compression, correctness, and engineering trade-offs.