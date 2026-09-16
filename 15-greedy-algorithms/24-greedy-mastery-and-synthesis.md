# 15.24 — Greedy Mastery & Synthesis

## 1. Purpose

This chapter consolidates Phase 15 into one reusable reasoning framework.

The goal is not to memorize greedy algorithms. The goal is to recognize when a local decision is globally safe, when it is only approximately safe, and when greedy reasoning should be abandoned.

## 2. The Greedy Mental Model

A greedy algorithm repeatedly performs:

```text
observe current state
→ identify feasible candidates
→ score/rank candidates
→ select one candidate
→ commit the decision
→ update state
→ repeat
```

The difficult part is proving that commitment is safe.

## 3. The Five Questions

For any greedy problem ask:

1. What is the exact objective?
2. What is the local choice?
3. What information does the choice use?
4. Why can this choice be committed permanently?
5. What assumptions make the argument valid?

If question 4 cannot be answered, search for a counterexample.

## 4. Greedy Decision Pipeline

Use this standard pipeline:

```text
Model
→ Constraints
→ Candidate set
→ Greedy rule
→ Invariant
→ Proof
→ Complexity
→ Counterexample search
→ Testing
```

## 5. Exact Greedy

An exact greedy algorithm always returns an optimum for every valid input covered by its assumptions.

Examples from this phase include:

- activity selection
- fractional knapsack
- Huffman coding
- Kruskal MST
- Prim MST
- Dijkstra under nonnegative edge weights

## 6. Approximate Greedy

Some greedy algorithms intentionally sacrifice exactness for scalability while providing a mathematical bound.

Examples include classical Set Cover and monotone submodular maximization under cardinality constraints.

The guarantee must be stated together with its assumptions.

## 7. Heuristic Greedy

A heuristic greedy algorithm has no universal guarantee for the intended objective but can still be useful operationally.

Examples include many practical scheduling, placement, routing, and compression heuristics.

Empirical success is not a proof of optimality.

## 8. Greedy Proof Families

Most correctness arguments fall into recognizable families:

- exchange argument
- cut property
- staying-ahead argument
- dominance
- prefix safety
- matroid structure
- diminishing returns

Learn the proof family rather than memorizing isolated proofs.

## 9. Exchange Argument Template

```text
Take an optimal solution O.
Identify greedy choice g.
Find a choice x in O that can be exchanged with g.
Show feasibility remains true.
Show objective does not worsen.
Repeat inductively.
```

## 10. Cut Property Template

For MST problems, identify a cut and show that a minimum-weight safe edge crossing the cut can belong to an MST.

This explains why Kruskal and Prim work while arbitrary edge-ranking rules do not.

## 11. Staying Ahead

For some scheduling or sequence problems, prove that after every step the greedy partial solution is at least as good as a corresponding partial solution of any competitor.

This creates a direct induction over progress.

## 12. Dominance

If one candidate is never worse than another under all relevant constraints and objectives, the dominated candidate can often be discarded.

Dominance is also useful for reducing search spaces in exact algorithms.

## 13. Prefix Safety

In encoding and string problems, an early decision can be safe when representation structure guarantees that it cannot create ambiguity or invalidate an optimal continuation.

Prefix properties should be stated explicitly.

## 14. Matroid Signal

When feasible sets form a matroid, greedy selection by weight has a powerful correctness foundation.

The key ideas are:

- hereditary feasibility
- exchange property

This explains why some subset-selection problems have clean greedy solutions.

## 15. Submodular Signal

A monotone submodular objective has diminishing returns:

```text
A ⊆ B
⇒ marginal(x | A) ≥ marginal(x | B)
```

Under appropriate constraints, repeated maximum-marginal selection gives strong approximation guarantees.

## 16. Greedy Choice vs Marginal Choice

There are two common patterns:

```text
static score
```

and

```text
current marginal gain
```

Marginal-gain algorithms must recompute or validate scores when previous choices change candidate value.

## 17. Static vs Dynamic Scores

Static scores are common in:

- fractional knapsack
- job sequencing by fixed profit
- fixed-priority scheduling

Dynamic scores appear in:

- coverage
- caching
- replica placement
- retrieval diversity
- resource allocation

Confusing these models causes incorrect implementations.

## 18. Feasibility Before Ranking

Always distinguish:

```text
feasible candidate
```

from:

```text
high-scoring candidate
```

A high score cannot justify violating a hard constraint.

## 19. Hard vs Soft Constraints

Hard constraints must always hold.

Soft objectives can be traded off.

Production schedulers often use:

```text
filter hard constraints
→ calculate soft score
→ greedy selection
```

## 20. Tie-Breaking

Define deterministic tie-breaking when reproducibility matters.

Possible keys include:

```text
score
→ deadline
→ ID
```

Do not silently depend on object or iteration order.

## 21. Ordering Sensitivity

Ask whether the algorithm is invariant to input ordering.

If not, document the ordering policy and test permutations.

Ordering can turn an otherwise simple heuristic into a highly variable system.

## 22. Counterexample Workflow

When unsure whether greedy works:

```text
write exact rule
→ create tiny instances
→ brute-force optimum
→ compare
→ minimize failure
→ inspect failed proof step
```

This is faster than guessing.

## 23. Exact Oracle

For a tiny instance, enumerate every feasible solution.

The oracle provides ground truth for:

- correctness testing
- approximation measurement
- counterexample discovery
- regression tests

## 24. Counterexample Taxonomy

Common failure sources:

- indivisible choices
- future interactions
- ignored constraints
- changing marginal value
- negative weights
- ordering effects
- stale distributed state
- objective mismatch

## 25. Greedy vs Dynamic Programming

Prefer DP when decisions interact through a state and no safe exchange property exists.

Typical boundaries:

- 0/1 knapsack
- weighted interval scheduling
- arbitrary coin change

## 26. Greedy vs Graph Algorithms

Use the graph invariant that matches the problem:

```text
BFS       → unweighted shortest path
Dijkstra  → nonnegative weighted shortest path
A*        → heuristic-guided shortest path
Bellman-Ford → negative edges
MST greedy → connectivity/minimum spanning tree
```

Never transfer one greedy proof to a different objective without re-deriving assumptions.

## 27. Greedy vs Backtracking

Backtracking is appropriate when the exact answer requires exploring combinations.

Greedy can still help as:

- a construction heuristic
- a branching heuristic
- an upper/lower bound
- an initial feasible solution

## 28. Greedy vs Branch and Bound

A greedy solution can provide an initial incumbent solution.

That incumbent can strengthen pruning in an exact branch-and-bound solver.

This is an important production use of greedy algorithms even when greedy itself is not exact.

## 29. Greedy + Heap

Many practical greedy algorithms require repeatedly extracting the best candidate.

A heap changes repeated selection from scanning all candidates to efficient priority operations.

Examples:

- interval partitioning
- Huffman coding
- Prim
- Dijkstra
- lazy greedy
- resource scheduling

## 30. Greedy + DSU

Disjoint Set Union supports greedy connectivity decisions efficiently.

Kruskal is the canonical example.

The combination is:

```text
sort edges
→ inspect cheapest
→ union if safe
```

## 31. Greedy + Sorting

Sorting often creates the order in which greedy choices become safe.

Examples:

- earliest finish time
- descending profit
- ascending edge weight
- value density

The sort is part of the algorithm, not merely preprocessing.

## 32. Greedy + Stack

Monotonic stacks support greedy sequence decisions where earlier elements can be discarded safely.

The key is to identify the condition that makes removal irreversible.

## 33. Greedy + Bitset

Coverage and set-selection problems can use bitsets to accelerate marginal coverage calculations.

This is an engineering optimization; it does not change the mathematical greedy proof.

## 34. Greedy + Distributed Coordination

Distributed greedy requires:

- state ownership
- versioning
- idempotency
- atomic commit
- lease handling
- failure recovery

A centralized proof does not automatically survive concurrent execution.

## 35. Greedy in Backend Engineering

Common applications:

- request scheduling
- load balancing
- cache placement
- replica placement
- rate-limit allocation
- autoscaling
- worker assignment
- test distribution
- observability selection

First define the actual production objective.

## 36. Greedy in AI Engineering

Common applications:

- retrieval selection
- source selection
- evaluation-set construction
- tool selection
- GPU scheduling
- inference batching
- model placement
- data-processing allocation

The same framework applies: objective, constraints, candidate score, invariant, proof/guarantee.

## 37. Online Greedy

Online algorithms receive input incrementally and cannot assume future information.

Evaluate them against the correct online benchmark, often through competitive analysis or empirical regret/quality measures depending on the problem.

## 38. Approximation Engineering

When exact optimization is too expensive:

```text
exactness
↔ approximation quality
↔ latency
↔ memory
↔ communication
```

The acceptable trade-off is a system requirement, not an algorithmic assumption.

## 39. Observability of Greedy Decisions

Production systems should record:

```text
candidate set
feasibility filters
greedy score
selected candidate
state/version
objective contribution
```

This makes decisions explainable and debuggable.

## 40. Safety Invariants

Optimization must not break system safety.

Examples:

```text
capacity ≥ 0
quota ≤ limit
resource compatibility = true
output remains valid
request isolation preserved
```

## 41. Testing Pyramid

Use:

```text
unit tests
→ invariant tests
→ property tests
→ differential tests
→ adversarial tests
→ concurrency/fault tests
→ production benchmarks
```

Each layer catches different failure classes.

## 42. Benchmarking Greedy Algorithms

Measure both algorithmic and operational metrics:

- runtime
- memory
- objective value
- approximation gap
- throughput
- latency
- communication
- retries
- fairness

## 43. Complexity Checklist

Always derive:

```text
sorting cost
selection cost
heap/DSU cost
state-update cost
memory cost
```

For distributed systems additionally derive:

```text
message count
bytes transferred
rounds
retry cost
```

## 44. Implementation Quality Checklist

A production greedy implementation should have:

- explicit input validation
- deterministic tie-breaking
- safe numeric handling
- clear invariants
- bounded resource usage
- observable decisions
- regression tests
- documented assumptions

## 45. Master Decision Tree

```text
Is there a local rule?
        ↓
Can I prove it is safe?
   ↙            ↘
 yes             no
  ↓               ↓
implement      find counterexample
  ↓               ↓
verify         exact/DP/backtracking

If not exact:
        ↓
Is there a formal approximation guarantee?
   ↙              ↘
 yes              no
  ↓                ↓
approximation    heuristic
```

## 46. Phase 15 Synthesis Table

| Family | Typical Tool | Key Safety Idea |
|---|---|---|
| Scheduling | Sorting | Exchange / staying ahead |
| Fractional allocation | Ratio | Divisibility |
| Job sequencing | DSU/slots | Latest feasible slot |
| Prefix compression | Heap | Exchange structure |
| MST | DSU/heap | Cut property |
| Shortest path | Heap | Finalization invariant |
| A* | Heap | Admissible/consistent heuristic |
| Set Cover | Marginal gain | Approximation guarantee |
| Submodular maximization | Marginal gain | Diminishing returns |
| Distributed greedy | Coordination | State consistency |
| Resource allocation | Heap/priority | Feasibility + objective |
| String construction | Stack/counts | Feasibility-aware local choice |

## 47. Final Interview Framework

For any greedy interview problem, explain in this order:

```text
1. Problem model
2. Objective
3. Constraints
4. Greedy choice
5. Why the choice is safe
6. Invariant
7. Proof
8. Algorithm
9. Complexity
10. Edge cases
11. Counterexample boundary
12. Alternative algorithm
```

This demonstrates reasoning rather than memorization.

## 48. Final Implementation Lab

Build one reusable greedy toolkit containing:

1. sorting-based greedy runner
2. heap-based greedy runner
3. DSU-based greedy runner
4. monotonic-stack greedy runner
5. marginal-gain engine
6. exact brute-force oracle
7. counterexample generator
8. counterexample minimizer
9. approximation analyzer
10. property-test harness
11. benchmark harness
12. distributed greedy simulator
13. Backend resource allocator
14. AI resource allocator

## 49. Master Revision Checklist

- [ ] Define greedy algorithms from first principles.
- [ ] Distinguish exact, approximate, and heuristic greedy.
- [ ] Recognize exchange arguments.
- [ ] Recognize cut properties.
- [ ] Recognize staying-ahead arguments.
- [ ] Recognize matroid structure.
- [ ] Recognize diminishing returns.
- [ ] Separate feasibility from scoring.
- [ ] Handle ties and ordering explicitly.
- [ ] Construct minimal counterexamples.
- [ ] Build exact brute-force oracles.
- [ ] Use differential and metamorphic testing.
- [ ] Analyze approximation guarantees.
- [ ] Combine greedy with sorting, heaps, DSU, stacks, and bitsets.
- [ ] Handle distributed state and failures.
- [ ] Apply greedy reasoning to Backend systems.
- [ ] Apply greedy reasoning to AI systems.
- [ ] Know when to switch to DP, graph algorithms, or exact search.

## 50. Phase 15 Completion Standard

You have mastered greedy algorithms when you can take an unfamiliar optimization problem and independently:

```text
model it
→ identify candidate choices
→ propose a greedy rule
→ attempt a proof
→ attack the rule with counterexamples
→ classify its guarantee
→ implement it efficiently
→ test it against an exact oracle
→ benchmark it
→ explain its production trade-offs
```

That is the transferable skill this phase is designed to build.

## Key Takeaways

1. Greedy is a reasoning framework, not a collection of memorized tricks.
2. The central question is always why a local choice can be committed safely.
3. Exactness requires a proof; approximation requires a stated guarantee; heuristics require honest empirical characterization.
4. Counterexamples are as important as proofs because they reveal the boundary of applicability.
5. Data structures such as sorting, heaps, DSU, stacks, and bitsets turn greedy ideas into efficient implementations.
6. Backend and AI systems add resource, concurrency, fairness, latency, and failure constraints to the classical model.
7. Expert greedy engineering combines mathematical proof, adversarial testing, complexity analysis, and production observability.
