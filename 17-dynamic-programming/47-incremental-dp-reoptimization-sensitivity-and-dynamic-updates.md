# 47 — Incremental DP: Reoptimization, Sensitivity & Dynamic Updates

## 1. Why this chapter exists

Classical dynamic programming assumes the input is fixed: build the state space, evaluate every reachable state, and return an optimum. Production systems often violate that assumption.

Prices change. A task duration is edited. A feature weight is corrected. A policy constraint flips. One edge cost in a DAG changes. A resource limit grows. Recomputing the entire DP may be correct, but it can waste work when most optimal-state values are unaffected.

This chapter studies **incremental DP**: maintaining DP results after small input changes.

The central engineering question is:

> After an input mutation, which DP states can possibly change, and in what order should only those states be recomputed?

This is different from Lesson 31's online transition optimization. There, data structures accelerate the computation of newly arriving states. Here, the challenge is **reusing an already computed DP solution under mutation**.

---

## 2. Static DP versus dynamic reoptimization

Let a static DP be represented by

\[
dp[v] = F_v(dp[u_1], dp[u_2], \ldots, x_v),
\]

where `x` denotes external input parameters.

A mutation changes some parameter from `x` to `x'` and therefore changes a subset of transition functions or base values.

Static recomputation evaluates all states:

```text
initialize all state values
for states in dependency order:
    evaluate state
```

Incremental recomputation instead tries to evaluate only the **affected closure**:

```text
identify directly changed states
expand to states depending on them
recompute affected states in dependency order
```

The difficult part is not the arithmetic. It is correctly determining the dependency closure.

---

## 3. Dependency graphs are the foundation

Treat every DP state as a node in a directed dependency graph.

If state `v` reads state `u`, create an edge

```text
u -> v
```

Then an update to `u` can only influence nodes reachable from `u`.

For DAG DP this gives a powerful invariant:

> A state outside the forward dependency closure of every changed state cannot change solely because of those mutations.

This lets us separate the algorithm into three layers:

1. **Mutation detection** — which base data or transition parameters changed?
2. **Influence analysis** — which DP states may depend on those changes?
3. **Selective re-evaluation** — recompute the affected states in a valid order.

---

## 4. Directly affected versus transitively affected states

Suppose a DAG has

```text
A -> B -> C -> D
A -> E -> D
```

and only the base value used by `B` changes.

Then:

- `B` is directly affected.
- `C` may be affected.
- `D` may be affected.
- `A` and `E` are not affected by this mutation.

Do not confuse **potentially affected** with **actually changed**.

The forward closure tells us which states must be considered. During propagation, a newly recomputed value may equal its old value, allowing propagation to stop along that branch when the transition is known to be value-insensitive to the change.

This produces two useful strategies:

- **Conservative invalidation:** recompute every potentially affected state.
- **Change propagation:** recompute and continue only when a state value actually changes.

The second can be much cheaper, but it requires stronger semantic assumptions.

---

## 5. Invalidation is not the same as recomputation

A common design mistake is:

```text
changed input -> delete every cached DP state
```

That destroys the main benefit of incremental computation.

Instead maintain three concepts:

```text
VALID      state corresponds to current input
DIRTY      some dependency may have changed
UNKNOWN    state has not yet been evaluated for this version
```

A versioned cache is often cleaner:

```js
cache[state].value
cache[state].version
```

A state is reusable when its version is still compatible with the current dependency versions.

For large state spaces, a separate dirty bitset or timestamp array can avoid clearing the entire structure after every update.

---

## 6. Versioning and generations

Suppose updates arrive as:

```text
update #101
update #102
update #103
```

A global generation counter can identify the current input version:

```js
version += 1;
```

However, a global version alone does not say whether a particular state is stale. The useful pattern is:

```text
stateVersion[v] = last version at which v was validated
```

For hierarchical dependencies, dependency fingerprints can be stronger than a global timestamp. A state can remain valid even though the global version advanced, provided none of its relevant inputs changed.

This is the same conceptual problem seen in build systems and memoized execution graphs.

---

## 7. Incremental DAG DP

DAG DP is the cleanest setting because dependencies are acyclic.

Let the original topological order be fixed:

```text
v1, v2, ..., vn
```

If a set of states becomes dirty, we can recompute only those states in the original topological order.

Two implementation styles are common.

### Style A — mark then sweep

1. Start from directly changed states.
2. DFS/BFS through reverse dependency edges.
3. Mark every reachable state dirty.
4. Scan the global topological order.
5. Recompute only dirty states.

### Style B — worklist propagation

1. Put directly changed states in a queue.
2. Pop one state.
3. Recompute it from current dependencies.
4. If its value changed, enqueue dependents.
5. Continue until the queue is empty.

Style B can avoid touching large unaffected regions.

---

## 8. Change propagation and early stabilization

Consider a max DP:

\[
dp[v] = \max_{u \to v}(dp[u] + w(u,v)).
\]

Suppose one edge weight increases but the winning predecessor of `v` remains unchanged and the resulting value at `v` does not change.

Then descendants may also remain unchanged.

A propagation algorithm can therefore use the invariant:

> If a state's recomputed value equals its previous value and its transition semantics depend only on predecessor values and fixed local parameters, no descendant needs to be revisited because of that path of change.

This is not universally safe. For example:

- a state stores the **set of all optimal witnesses**, not only the optimum value;
- tie-breaking depends on a changed key;
- counts of optimal solutions must also be maintained;
- metadata or certificates change even when the scalar objective does not.

Always define exactly what the DP state means before using value-equality as a stopping condition.

---

## 9. Incremental shortest/longest path on DAGs

A DAG shortest path DP is a direct example:

\[
d[v] = \min_{u \to v}(d[u] + w(u,v)).
\]

An edge-weight mutation affects its head and potentially all descendants.

### Weight increase

A weight increase can invalidate the old shortest predecessor. Affected descendants may need full local recomputation over all incoming edges.

### Weight decrease

A decrease can improve the head immediately and may propagate improvements forward.

The important distinction is that dynamic DAG optimization is easier than fully dynamic general-graph shortest paths because the dependency graph remains acyclic and a stable evaluation order exists.

This chapter deliberately stays in DP-friendly acyclic settings rather than treating general dynamic shortest path algorithms as interchangeable with DP maintenance.

---

## 10. Sensitivity analysis: how much can a mutation matter?

Incremental DP naturally leads to **sensitivity analysis**.

For a scalar parameter \(\theta\), ask:

\[
\frac{\partial\,dp[v]}{\partial \theta}
\]

for continuous relaxations, or more generally:

> Which states can change when `theta` changes, and what is the range of possible impact?

For discrete optimization, useful sensitivity questions include:

- Does the optimal value change?
- Does the optimal decision change?
- Can the selected witness change while the value stays equal?
- What is the smallest parameter perturbation that changes the optimum?
- Which downstream states are structurally dependent on the parameter?

This is often more useful operationally than a formal derivative.

---

## 11. Argmin/argmax stability

Many DPs store both a value and a chosen action:

```text
dp[v] = best score
choice[v] = best predecessor/action
```

A mutation can leave `dp[v]` unchanged while changing `choice[v]` because two candidates become tied.

Therefore an incremental system must define whether correctness means maintaining:

1. only the optimal value,
2. one valid optimal witness,
3. a canonical witness under tie-breaking,
4. all optimal witnesses/counts, or
5. an auditable certificate.

The invalidation policy depends on that contract.

For canonical witnesses, a tie-key mutation may require recomputing states even when the objective value does not change.

---

## 12. Incremental knapsack: what can and cannot be reused

Consider 0/1 knapsack:

\[
dp[c] = \max(dp[c], dp[c-w_i] + value_i).
\]

If one item's value changes, many capacities may be affected. A naive approach is to rerun all items.

But there are still reusable structures:

- DP states for capacities whose best solution provably excludes the modified item.
- Prefix/suffix DP around the modified item.
- Parent or contribution information identifying which states rely on the item.
- Meet-in-the-middle decompositions for repeated what-if queries.

This illustrates an important lesson:

> Not every DP admits a cheap local repair merely because one input changed.

Incremental algorithms depend on the structure of the dependency graph and on whether the mutation admits a localized effect.

---

## 13. Prefix/suffix decomposition for what-if queries

A powerful technique for repeated point mutations is to precompute summaries on both sides of a decision.

For a sequence problem, compute:

```text
prefixDP[i] = optimum using positions < i
suffixDP[i] = optimum using positions >= i
```

Then a mutation at position `i` may be analyzed by combining the unaffected left and right summaries with a local transition.

This idea appears in:

- deletion queries,
- replacement queries,
- removing one item from a set,
- path rerouting around one changed component,
- sensitivity of sequence DP,
- divide-and-conquer offline what-if analysis.

The key pattern is **cut the dependency graph at the mutation site**.

---

## 14. Checkpointing and partial recomputation

When full state replay is expensive, store periodic checkpoints.

Example:

```text
state 0 ... checkpoint A ... checkpoint B ... checkpoint C ... final
```

A mutation near checkpoint B can restart computation from B instead of state 0.

This creates a time-memory tradeoff:

- more checkpoints → faster repair, more memory;
- fewer checkpoints → lower memory, longer recomputation.

Checkpointing is especially useful when the DP is sequential and the state between checkpoints is compact.

For large structured pipelines, this resembles incremental build caches and event-sourced projections.

---

## 15. Dependency indexing

A dynamic DP engine needs efficient reverse dependencies.

Forward representation:

```js
parents[v] = states used by v;
```

Incremental propagation also needs:

```js
dependents[u] = states that consume u;
```

If the DP graph is static, build both once.

If transitions themselves change dynamically, dependency indexes may also need updates.

This distinction matters:

```text
value mutation     -> update values, reuse graph
structure mutation -> update graph and invalidate topology assumptions
```

A system should never silently apply a value-only incremental algorithm to a topology mutation.

---

## 16. Structural updates versus parameter updates

Classify updates before choosing an algorithm.

### Parameter update

The state graph remains the same; local values or transition weights change.

Examples:

- edge cost changes,
- item reward changes,
- penalty changes,
- task duration changes.

These are the best candidates for incremental repair.

### Structural update

The set of states or dependency edges changes.

Examples:

- adding/removing a task,
- adding/removing a DAG edge,
- changing the automaton topology,
- changing a grammar production.

These may require:

- rebuilding affected adjacency lists,
- recomputing topological information,
- invalidating larger regions,
- or falling back to full recomputation.

---

## 17. Monotone updates

Some DPs have special update properties.

For a maximization DP under a monotone increase in a source reward, values often cannot decrease. For a minimization DP under a cost increase, values often cannot improve due to that increase.

This can support directional propagation:

```text
lower bounds only
upper bounds only
improvements only
worsenings only
```

But monotonicity must be proved for the specific recurrence.

It can fail when the state contains derived metadata, exact counts, or coupled constraints.

Do not infer monotonicity from the optimization direction alone.

---

## 18. Incremental counting DP

Counting is often harder to maintain than optimization.

Suppose

\[
dp[v] = \sum_{u \to v} dp[u].
\]

If one upstream count changes by `delta`, downstream counts can change by propagated linear combinations of that delta.

For purely additive DAG counting, this suggests **delta propagation**:

\[
\Delta dp[v] = \sum_{u \to v} \Delta dp[u].
\]

This is a stronger structure than generic min/max DP because the operator is linear.

It also motivates algebraic reasoning:

- additive semiring → delta propagation may be simple;
- min/max semiring → changes are piecewise and may trigger predecessor replacement;
- non-idempotent counting → multiplicity must be preserved carefully.

This is one reason algebraic structure matters in incremental algorithms.

---

## 19. Delta semirings and algebraic updates

If a DP operates over a semiring, ask whether updates can be represented as deltas.

For addition/multiplication-like algebra, the change of a composition may be expressible from old and new components.

For idempotent operators such as min/max, subtraction is usually unavailable, so exact delta formulas may not exist.

Therefore distinguish:

```text
recompute affected state
```

from

```text
update affected state using an algebraic delta formula
```

The latter requires stronger algebraic assumptions.

---

## 20. Rollback and persistent DP states

Repeated what-if analysis benefits from immutable or persistent representations.

A persistent DP version can support:

```text
base version
   ├── hypothetical update A
   ├── hypothetical update B
   └── hypothetical update C
```

Without persistence, applying A and then undoing it before B may require substantial work.

Useful techniques include:

- copy-on-write state tables,
- persistent segment trees,
- versioned maps,
- edit logs,
- checkpoints plus replay.

This is particularly valuable for interactive optimization tools and scenario analysis.

---

## 21. Batch updates

Processing mutations one by one is not always optimal.

Suppose ten nearby transition weights change. Ten separate propagation passes may repeatedly touch the same states.

A better strategy can be:

1. apply all mutations,
2. union their affected roots,
3. compute one dependency closure,
4. perform one repair pass.

This is analogous to batching invalidations in reactive systems.

The right batch size depends on latency requirements and update locality.

---

## 22. Lazy repair versus eager repair

Two service models are common.

### Eager

Repair the DP immediately after each mutation.

Useful when:

- reads dominate,
- every update must produce a current answer,
- latency of reads matters most.

### Lazy

Record mutations and repair only when a query arrives.

Useful when:

- many updates happen before the next read,
- queries inspect only small portions of the state,
- batching can collapse repeated invalidations.

This is a systems tradeoff, not merely an algorithmic choice.

---

## 23. Query-local repair

Sometimes the user does not need the entire DP table.

If a query asks only for `dp[t]`, we can maintain or recompute the dependency closure of `t` rather than the whole graph.

Reverse dependencies answer:

> Which inputs can influence this query state?

This leads to a useful design:

```text
input mutation -> mark potentially dirty
query(target)   -> repair only dirty ancestors of target, then evaluate
```

For many selective-query workloads, this can outperform global repair by a wide margin.

---

## 24. Correctness invariant for incremental DP

A clean proof target is:

> After repair terminates, every affected state equals the value produced by a full recomputation on the current input.

A standard proof has three parts.

### Soundness of invalidation

Every state that can differ from the old solution is included in the candidate affected set.

### Correct evaluation order

A state is recomputed only after every dependency needed for its current recurrence has been repaired.

### Fixed-point termination

If using a worklist, termination occurs when no queued state changes the value represented by its dependents.

For DAGs, a topological sweep gives a particularly simple termination argument because no state needs to be revisited after all predecessors are current.

---

## 25. When value convergence is not enough

Incremental algorithms often fail because they compare only one field.

A DP state may be:

```js
{
  value,
  count,
  choice,
  certificate,
  sensitivity
}
```

If `value` remains equal but `choice` or `count` changes, the state is semantically changed.

Define an explicit state equality predicate:

```js
sameState(previous, next)
```

Do not default to `Object.is(value, previousValue)` unless the DP contract really is scalar-value-only.

---

## 26. Adversarial update patterns

Incremental DP needs tests that defeat optimistic assumptions.

Important cases include:

- update at a high-fanout source,
- update on the current optimal path,
- update on a non-winning alternative that becomes optimal,
- repeated toggling of one value,
- tie creation and tie breaking,
- cascading changes through a long chain,
- updates whose net effect cancels out,
- batch updates that should be equivalent to sequential updates,
- structural edge insertion/removal,
- huge numeric changes causing overflow or precision problems.

A strong test oracle is still:

```text
incremental result == fresh full recomputation
```

for every generated update sequence.

---

## 27. Differential and metamorphic testing

### Differential testing

Run:

```text
freshSolve(currentInput)
```

and compare against:

```text
incrementalSolver.apply(update)
```

### Metamorphic properties

Useful properties include:

- applying a mutation and then restoring the original value returns to the original answer;
- batching updates yields the same final result as sequential application;
- an update to an unreachable component cannot change a target state outside its dependency closure;
- a no-op update leaves all semantic state unchanged;
- replaying the same update sequence from the same base version is deterministic.

These catch stale-cache and missed-invalidation bugs that ordinary examples often miss.

---

## 28. Complexity accounting

Let:

- `N` = total number of DP states,
- `E` = dependency edges,
- `A` = number of affected states,
- `E_A` = edges inspected within the affected region.

A static DAG DP might cost:

\[
O(N + E).
\]

A conservative incremental repair may cost:

\[
O(A + E_A)
\]

plus the cost of discovering the affected closure.

Worst case:

\[
A=N,
\]

so incremental DP does **not** magically improve asymptotic worst-case complexity.

Its value comes from common-case locality, repeated updates, and workload-aware reuse.

Always benchmark:

```text
update locality
fanout
affected fraction
query/update ratio
batch size
cache hit rate
```

---

## 29. Backend engineering applications

Incremental DP ideas appear in backend systems whenever derived state depends on mutable inputs.

Examples:

- pricing or tariff optimization after one rule changes;
- scheduling after one task duration changes;
- dependency-aware build planning;
- resource allocation what-if queries;
- feature-rule evaluation in workflow engines;
- route scoring inside DAG-based business processes;
- recomputing recommendation aggregates after localized changes.

A production design should expose:

```text
applyUpdate()
query()
rebuild()
validateAgainstFreshSolve()
metrics()
```

Observability should include the number of invalidated states, recomputed states, skipped states, and full-rebuild fallbacks.

---

## 30. AI engineering applications

Incremental DP is useful when inference problems change slightly between requests.

Examples include:

- decoding under an updated constraint weight;
- sequence scoring after a local token or feature correction;
- lattice rescoring with changed transition costs;
- dynamic structured prediction what-if analysis;
- constrained planning after a small reward adjustment;
- repeated beam-independent exact rescoring of a stable state graph.

The central engineering idea is not “AI-specific DP.” It is **reuse the stable computational structure while changing only the affected parameters**.

---

## 31. Recognition checklist

When you see a repeated optimization/query problem, ask:

1. Is the DP state graph stable across updates?
2. What exactly can mutate: values, weights, states, or edges?
3. Can I build reverse dependencies?
4. What is the forward influence closure of one mutation?
5. Is the objective monotone under the update?
6. Can equal values still hide changed witnesses/counts?
7. Can I batch updates?
8. Can I repair only a query-local region?
9. Is there an algebraic delta formula?
10. What is the fallback when the affected region becomes too large?

That final question is important: a robust incremental engine should be willing to abandon incremental repair and run a full rebuild when that is cheaper or safer.

---

## 32. Common failure modes

### Failure 1 — invalidating too little

A changed predecessor is missed, producing stale downstream values.

### Failure 2 — invalidating too much

The entire table is cleared after every mutation.

### Failure 3 — confusing scalar value with semantic state

Witnesses, counts, or certificates remain stale.

### Failure 4 — using value equality without proof

A stable objective value does not always imply stable downstream semantics.

### Failure 5 — assuming topology is unchanged

A structural mutation invalidates the dependency graph itself.

### Failure 6 — ignoring worst-case collapse

A large update can touch nearly every state.

### Failure 7 — no fresh-recompute oracle

Incremental bugs can remain invisible without differential validation.

---

## 33. Interview framework

For an incremental-DP interview question, reason in this order:

```text
1. Define the original DP state.
2. Draw the dependency graph conceptually.
3. Classify the mutation.
4. Identify directly affected states.
5. Compute the transitive dependency closure.
6. Choose topological sweep or worklist repair.
7. Define semantic state equality.
8. Prove skipped states cannot change.
9. Give worst-case and expected complexity.
10. Compare with full recomputation.
11. Add a correctness oracle and adversarial tests.
12. State when to fall back to rebuild.
```

The strongest answers distinguish **algorithmic correctness** from **performance assumptions**.

---

## 34. Master pattern

Incremental DP can be summarized as:

\[
\boxed{\text{mutate} \rightarrow \text{invalidate} \rightarrow \text{propagate} \rightarrow \text{repair} \rightarrow \text{verify}}
\]

The reusable design pattern is:

```text
stable state graph
      ↓
reverse dependency index
      ↓
localized mutation
      ↓
candidate affected closure
      ↓
selective recomputation
      ↓
change propagation / stabilization
      ↓
query or certify result
```

The deepest lesson is that dynamic optimization is fundamentally about **dependency locality**.

If the structure of the DP remains stable, previous computation is an asset. The goal is not to pretend every update is local; the goal is to prove exactly when locality is safe, measure when it is useful, and fall back to a full rebuild when it is not.

---

## 35. Final challenge

Build an incremental DP engine for a weighted DAG.

Requirements:

- construct a DAG and a topological order;
- compute a baseline shortest path DP;
- support edge-weight mutations;
- maintain reverse dependencies;
- repair only affected states when safe;
- maintain both distance and predecessor choice;
- detect tie changes correctly;
- support batched mutations;
- expose affected-state metrics;
- compare every result against full recomputation in tests;
- detect when an incremental repair is no longer cost-effective and trigger a full rebuild.

Then extend the engine to one of:

- longest path,
- path counting,
- knapsack what-if analysis,
- sequence DP replacement queries,
- or a semiring-generic incremental evaluator.

Your final implementation should demonstrate not just that incremental DP works, but **why every skipped state is safe to skip**.
