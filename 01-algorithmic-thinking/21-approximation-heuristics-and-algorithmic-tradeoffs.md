# 01.21 — Approximation, Heuristics & Algorithmic Trade-Offs

> Not every important problem has a practical exact algorithm. Expert algorithmic engineering requires knowing when exactness is feasible, when approximation is justified, how to quantify error, and how to make heuristic decisions without pretending they are guarantees.

## Learning Objectives

By the end of this chapter, you should be able to:

- Distinguish exact algorithms, approximation algorithms, heuristics, and randomized methods.
- Recognize when exact optimization is computationally expensive.
- Understand approximation ratios and additive error.
- Distinguish worst-case guarantees from empirical performance.
- Reason about lower bounds and solution quality.
- Understand relaxation, greedy approximation, local search, and bounded search.
- Use heuristics responsibly when no strong guarantee is available.
- Analyze quality, latency, memory, and operational trade-offs together.
- Apply approximate thinking to backend and AI systems.

---

## 1. Exact vs Approximate vs Heuristic

### Exact algorithm

Always returns an optimal/correct solution according to the problem definition.

### Approximation algorithm

Returns a solution whose quality is bounded relative to the optimum.

### Heuristic

Uses a practical strategy intended to produce good solutions quickly, but may have no formal quality guarantee.

### Randomized algorithm

Uses randomness as part of computation. It may be exact or approximate.

These categories can overlap.

```text
randomized + exact
randomized + approximate
approximation + deterministic
heuristic + randomized
```

---

## 2. Why Approximation Exists

Some optimization problems become prohibitively expensive as input grows.

A simplified choice may be:

```text
Exact:
quality = optimal
latency = too high

Approximate:
quality = near-optimal
latency = acceptable
```

In production, a slightly worse answer delivered within the required latency budget can be more useful than a perfect answer delivered too late.

---

## 3. Decision vs Optimization Problems

A decision problem asks:

```text
Does a solution satisfying condition X exist?
```

An optimization problem asks:

```text
What is the best solution?
```

Approximation is primarily concerned with optimization quality.

For example:

```text
Decision: Is there a route <= 100 km?
Optimization: What is the shortest route?
```

---

## 4. The Optimal Solution as a Reference

Let:

```text
OPT = optimal objective value
ALG = algorithm's objective value
```

Approximation quality compares `ALG` with `OPT`.

For a minimization problem, a multiplicative guarantee may be:

```text
ALG <= r × OPT
```

where `r >= 1`.

A 2-approximation therefore guarantees:

```text
ALG <= 2 × OPT
```

---

## 5. Maximization Problems

For maximization, a common guarantee is:

```text
ALG >= OPT / r
```

where `r >= 1`.

Equivalently, a `0.5`-approximation can mean:

```text
ALG >= 0.5 × OPT
```

Be careful with terminology: approximation-ratio conventions differ between minimization and maximization.

---

## 6. Additive Approximation

Sometimes multiplicative error is inappropriate.

An additive guarantee can look like:

```text
|ALG - OPT| <= ε
```

This is especially useful when the objective has a natural absolute error tolerance.

Example:

```text
OPT = 1000
ALG = 1003
error = 3
```

Whether an error of 3 is acceptable depends on the application.

---

## 7. Relative Error

Relative error can be expressed as:

```text
|ALG - OPT| / |OPT|
```

For example:

```text
OPT = 100
ALG = 105
relative error = 5%
```

Relative error often makes quality comparisons more meaningful across different scales.

---

## 8. Lower Bounds and Approximation

To prove approximation quality, we often need a lower bound on `OPT`.

If:

```text
ALG <= 2 × LB
```

and:

```text
LB <= OPT
```

then:

```text
ALG <= 2 × OPT
```

The strategy is powerful:

```text
construct solution
+
construct lower bound
→
compare them
```

This connects approximation analysis directly to lower-bound reasoning from earlier chapters.

---

## 9. Greedy as an Approximation Strategy

Greedy algorithms make locally attractive decisions.

Greedy is not automatically optimal.

There are three different possibilities:

```text
greedy + proof of optimality

greedy + approximation guarantee

greedy + no guarantee
```

The third category is a heuristic, not automatically an approximation algorithm.

---

## 10. Example: Set Cover Intuition

Suppose we need to cover required items using the fewest available sets.

A common greedy strategy repeatedly chooses the set covering the largest number of currently uncovered items.

The decision is locally attractive, but the globally optimal selection may differ.

The important lesson is not memorizing one greedy rule:

> When greedy is not provably optimal, ask whether it has a bounded approximation guarantee or is merely a heuristic.

---

## 11. Relaxation

A difficult optimization problem can sometimes be transformed into an easier relaxed problem.

Conceptually:

```text
hard constraints
↓
relax constraints
↓
easier problem
↓
solve
↓
convert back to valid solution
```

The relaxed optimum can provide a bound on the true optimum.

This is a major source of approximation algorithms.

---

## 12. Rounding

A relaxed solution may contain fractional values:

```text
x = 0.73
```

while the original problem requires:

```text
x ∈ {0, 1}
```

Rounding converts the relaxed solution into a valid discrete solution.

The rounding strategy determines both feasibility and approximation quality.

---

## 13. Local Search

Local search starts with a candidate solution and repeatedly applies an improving local modification.

```text
solution
↓
neighbor
↓
better neighbor
↓
...
↓
local optimum
```

A local optimum is not necessarily a global optimum.

Local search can be extremely useful when the search space is enormous and small improvements are cheap to evaluate.

---

## 14. Neighborhood Design

Local search quality depends heavily on the definition of a neighbor.

For a route, possible moves include:

- swap two positions,
- reverse a segment,
- relocate one item.

A poor neighborhood can trap the algorithm in bad local optima.

Therefore the representation of the solution and the transition operation are algorithmic design decisions.

---

## 15. Hill Climbing

Basic hill climbing repeatedly chooses an improving neighbor.

Problem:

```text
local optimum
plateau
ridge
```

Possible improvements include:

- random restarts,
- larger neighborhoods,
- allowing temporary worsening moves,
- tabu mechanisms.

These can improve empirical performance but do not automatically create formal guarantees.

---

## 16. Simulated Annealing Intuition

Simulated annealing can sometimes accept a worse move early in the search.

Conceptually:

```text
high exploration
↓
progressively lower exploration
↓
more exploitation
```

The goal is to escape local optima.

It is a heuristic/metaheuristic unless a specific theoretical guarantee is established.

---

## 17. Beam Search

Beam search keeps only the best `k` candidates at each level.

```text
all candidates
↓
score
↓
keep top k
↓
expand
```

Compared with exhaustive search:

```text
memory ↓
computation ↓
optimality guarantee ↓
```

Beam width is a direct quality/latency/memory control.

This idea appears heavily in AI search and generation systems.

---

## 18. Branch-and-Bound

Branch-and-bound explores candidate solutions but uses bounds to eliminate branches that cannot beat the current best solution.

```text
branch
↓
compute bound
↓
if impossible to improve → prune
else → explore
```

Unlike arbitrary heuristic pruning, branch-and-bound can preserve exactness if the bound is valid.

This distinction is crucial.

---

## 19. Approximation vs Pruning

Pruning does not automatically mean approximation.

If a branch can be mathematically proven unable to contain a better solution:

```text
safe pruning → exact algorithm
```

If the branch is discarded only because it appears unlikely to matter:

```text
heuristic pruning → potentially approximate/heuristic result
```

Always ask whether discarded search space has a correctness/quality proof.

---

## 20. Anytime Algorithms

An anytime algorithm can return a usable answer early and improve it with additional computation.

```text
time = 10ms  → acceptable
 time = 100ms → better
 time = 1s    → better still
```

This is extremely useful when latency budgets vary.

An anytime algorithm should expose the relationship between:

```text
computation budget
vs
solution quality
```

---

## 21. Time-Bounded Optimization

Suppose a scheduler has only 50 ms.

A practical design may be:

```text
start with feasible solution
↓
improve while budget remains
↓
return best-known solution
```

This is often preferable to an algorithm that may fail to produce an answer within the request deadline.

---

## 22. Feasibility Before Optimization

For many systems, a valid solution is more important than an optimal one.

Separate:

```text
Phase 1: find feasible solution
Phase 2: improve quality
```

This makes systems more robust under limited computation.

---

## 23. Approximation Schemes

Some problems admit stronger families of approximation algorithms.

A polynomial-time approximation scheme (PTAS) aims to produce a solution within:

```text
(1 + ε) × OPT
```

for minimization problems, for a chosen `ε > 0`.

The runtime may increase substantially as `ε` becomes smaller.

This demonstrates an important trade-off:

```text
quality ↑
computation ↑
```

---

## 24. FPTAS Intuition

A fully polynomial-time approximation scheme controls runtime polynomially in both input size and `1/ε`.

The important engineering lesson is that an approximation parameter can become an explicit computational control knob.

```text
ε larger → faster, less precise
ε smaller → slower, more precise
```

---

## 25. Exactness Has a Cost

“Exact” should not be treated as automatically superior.

Compare:

| Strategy | Quality | Latency | Complexity | Guarantee |
|---|---|---|---|---|
| Exact | Optimal | Often high | High | Strong |
| Approximation | Bounded loss | Lower | Moderate | Formal |
| Heuristic | Often good | Often low | Variable | Usually weak/none |

The correct choice depends on the contract.

---

## 26. Quality-Latency Trade-Off

A production system may have a curve like:

```text
more computation
      ↓
better quality
      ↓
diminishing returns
```

The optimal operating point is not necessarily maximum quality.

For a 100 ms request budget:

```text
95ms / high quality
```

may be better than:

```text
2s / slightly better quality
```

---

## 27. Error Budgets

Approximation quality can be expressed as an explicit budget.

Example:

```text
maximum acceptable relative error = 2%
```

Now algorithm selection becomes measurable:

```text
Does candidate algorithm stay within 2%?
Does it meet latency?
Does it fit memory?
```

This turns vague “good enough” reasoning into an engineering contract.

---

## 28. Offline Evaluation

Heuristics should be evaluated against representative datasets.

Measure:

- objective quality,
- average latency,
- p95/p99 latency,
- memory,
- throughput,
- failure rate,
- sensitivity to input distribution.

Average quality alone can hide catastrophic worst-case behavior.

---

## 29. Adversarial Inputs

A heuristic that works well on normal data may fail badly on specific structures.

Test:

- random inputs,
- sorted inputs,
- reverse-sorted inputs,
- repeated values,
- highly skewed data,
- pathological cases,
- maximum-size inputs.

Do not confuse benchmark success with a mathematical guarantee.

---

## 30. Approximation vs Average-Case Performance

These are different concepts.

### Approximation guarantee

Controls solution quality relative to the optimum.

### Average-case analysis

Controls expected runtime or behavior under an input distribution.

A heuristic can have excellent average quality and no worst-case quality guarantee.

An approximation algorithm can have a formal quality guarantee while having nontrivial runtime.

---

## 31. Randomized Approximation

Randomness can help explore solution space.

Examples:

- randomized rounding,
- random restarts,
- random sampling,
- randomized local search.

Now analyze both:

```text
solution quality
+
probability of obtaining that quality
```

A statement such as “usually good” is incomplete without defining what usually means.

---

## 32. Sampling as Approximation

For huge datasets, exact aggregation may require reading everything.

Sampling can estimate:

- averages,
- proportions,
- frequencies,
- distributions.

Trade-off:

```text
sample size ↑
→ variance generally ↓
→ computation ↑
```

Sampling is often a practical approximation technique for analytics.

---

## 33. Streaming Approximation

When exact state is too large, compact summaries can approximate global properties.

Examples include approximate counting and frequency estimation.

The core design question is:

```text
How much memory can we spend
for how much error?
```

This directly connects approximation to streaming algorithms from Chapter 01.19.

---

## 34. Backend: Top-K

If the system needs only the highest-ranked K items, fully sorting millions of records may be unnecessary.

Possible approaches:

```text
full sort → O(n log n)
heap selection → O(n log k)
selection → expected/appropriate lower cost
```

This is not necessarily approximation: exact Top-K can be computed without fully sorting the input.

This is an important reminder:

> First eliminate unnecessary work before accepting approximation.

---

## 35. Backend: Rate Limiting

A rate limiter may choose between:

```text
exact centralized counter
```

and:

```text
partitioned/approximate tracking
```

The choice depends on the consequence of false positives and false negatives.

For security-sensitive limits, approximation may be unacceptable.

For analytics or soft quotas, approximate state may be reasonable.

---

## 36. Backend: Cache Eviction

An exact globally optimal cache eviction strategy requires future knowledge that the system generally does not possess.

Practical policies such as LRU, LFU, TinyLFU-style admission, or application-specific heuristics use observable history to approximate future usefulness.

The engineering goal is usually:

```text
high hit rate
+
low overhead
+
predictable memory
```

rather than theoretical optimality.

---

## 37. Backend: Job Scheduling

An optimal schedule can be computationally difficult when many constraints interact.

A practical scheduler may use:

```text
priority
+
deadline
+
resource availability
+
locality
+
fairness
```

Then continuously improve the schedule as new information arrives.

This is a natural use case for heuristics and anytime algorithms.

---

## 38. AI: Approximate Nearest Neighbor Search

Exact nearest-neighbor search can become expensive at large scale.

Approximate nearest-neighbor methods trade some exactness for:

- lower latency,
- lower search cost,
- better scalability.

The key evaluation dimensions are:

```text
recall@K
latency
memory
index build cost
update cost
```

This is one of the most important approximation trade-offs in modern AI retrieval.

---

## 39. AI: Retrieval Quality vs Latency

A retrieval pipeline can tune:

```text
candidate count
→
reranking depth
→
context size
```

More candidates may improve recall but increase:

- vector-search cost,
- network traffic,
- reranking cost,
- model inference cost.

Therefore retrieval is a constrained optimization problem.

---

## 40. AI: Beam Search and Generation

Beam width is a computational budget.

```text
beam width ↑
→ search space explored ↑
→ computation ↑
→ potential quality ↑
```

But more search does not guarantee better task-level outcomes in every generation system.

The metric must match the actual objective.

---

## 41. AI: Sampling and Candidate Generation

Large candidate spaces can be sampled rather than exhaustively evaluated.

The system can then:

```text
sample candidates
↓
score candidates
↓
retain promising candidates
↓
rerank/refine
```

This separates expensive global search from cheaper candidate generation.

---

## 42. AI: Approximate Data Structures

AI infrastructure frequently uses structures that trade exactness for resource efficiency.

Examples:

- Bloom filters,
- sketches,
- approximate counters,
- ANN indexes,
- compressed indexes.

For each one ask:

```text
What error can occur?
What error cannot occur?
What memory is saved?
What latency is saved?
```

---

## 43. False Positives vs False Negatives

Approximate algorithms can make different kinds of mistakes.

Example:

```text
false positive = report candidate when none exists
false negative = miss a real candidate
```

The acceptable error depends on the application.

A security filter may prefer false positives over false negatives.

A recall-sensitive retrieval stage may strongly penalize false negatives.

---

## 44. Cascaded Algorithms

Instead of applying an expensive algorithm to everything:

```text
cheap filter
↓
moderate candidate generation
↓
expensive exact/accurate scoring
```

This is often superior to choosing one algorithm globally.

The cheap stages reduce the input size of expensive stages.

This is a general pattern in backend and AI systems.

---

## 45. Approximate First, Exact Later

A powerful design pattern is:

```text
approximate candidate generation
↓
exact verification
```

Examples:

- approximate retrieval → exact distance on candidates,
- heuristic scheduling → constraint validation,
- Bloom filter → authoritative lookup,
- coarse ranking → precise reranking.

The approximate stage reduces work without becoming the final source of truth.

---

## 46. When NOT to Approximate

Avoid approximation when:

- correctness has legal/financial consequences,
- safety depends on exact decisions,
- errors are unacceptable,
- the exact solution is already cheap,
- the approximation error cannot be measured,
- failure modes are poorly understood.

Approximation is an engineering decision, not a shortcut to use automatically.

---

## 47. Heuristic Design Checklist

Before trusting a heuristic, ask:

```text
1. What objective are we optimizing?
2. What constraints must never be violated?
3. Is feasibility guaranteed?
4. Is there a formal quality bound?
5. If not, what empirical evidence exists?
6. What inputs make it fail?
7. What is the worst observed quality?
8. What is p95/p99 latency?
9. How much memory does it require?
10. Can it return an answer within a fixed budget?
11. Can a better solution be produced incrementally?
12. Can exact verification happen afterward?
13. What error types matter most?
14. Can we detect low-confidence results?
15. What happens when assumptions about input distribution break?
```

---

## 48. Algorithm Selection Matrix

| Requirement | Preferred direction |
|---|---|
| Small input + exact answer | Exact algorithm |
| Large input + strong quality requirement | Approximation with guarantee |
| Huge search space + flexible objective | Heuristic/local search |
| Variable computation budget | Anytime algorithm |
| Expensive exact scoring | Candidate generation + exact reranking |
| Streaming + bounded memory | Approximate summary |
| High recall retrieval | Approximate candidate generation + reranking |
| Safety-critical decision | Exact/verified approach |

The table is a starting point, not a substitute for modeling constraints.

---

## 49. Common Mistakes

### Mistake 1 — Calling every greedy algorithm an approximation algorithm

A guarantee requires proof.

### Mistake 2 — Treating heuristic success on benchmarks as a guarantee

Empirical performance is not a worst-case bound.

### Mistake 3 — Approximating before eliminating unnecessary work

Sometimes an exact optimization such as Top-K is already efficient enough.

### Mistake 4 — Ignoring error type

False positives and false negatives can have very different consequences.

### Mistake 5 — Optimizing the wrong metric

A better mathematical objective may produce worse product outcomes.

### Mistake 6 — Ignoring tail latency

A heuristic with good average latency can still violate production deadlines.

### Mistake 7 — No feasibility guarantee

A fast “solution” that violates hard constraints is not a valid solution.

### Mistake 8 — No fallback

Approximate systems should often have a verification, fallback, or confidence strategy.

### Mistake 9 — Treating ANN as “randomly inaccurate”

ANN methods have specific index/search trade-offs that should be measured.

### Mistake 10 — Increasing computation without measuring diminishing returns

More search does not always produce proportionally better outcomes.

---

## 50. Expert Decision Framework

Use this sequence:

```text
1. Define the exact objective.
2. Separate hard constraints from soft objectives.
3. Determine whether exact computation is feasible.
4. Establish lower/upper bounds where possible.
5. Eliminate unnecessary work.
6. Identify whether approximation is actually needed.
7. If approximation is needed, quantify the error budget.
8. Prefer a formal guarantee when practical.
9. Otherwise choose and benchmark a heuristic.
10. Test adversarial and production-like inputs.
11. Measure quality + latency + memory + throughput.
12. Analyze tail behavior.
13. Add validation/fallback where appropriate.
14. Make the quality/compute knob explicit.
15. Re-evaluate when workload distribution changes.
```

---

## 51. Interview Explanation Template

When asked why you would use an approximation or heuristic:

```text
The exact solution has computational cost X and the input scale is N.
Our hard constraints are A, B, and C.
The exact method cannot meet the latency/resource budget.
Therefore we use strategy Y.

Its quality is guaranteed to be within Z, or, if no formal guarantee exists,
we validate it against representative and adversarial workloads.

We measure quality, p95/p99 latency, memory, and failure behavior.
If needed, we use approximate candidate generation followed by exact validation.
```

This is much stronger than saying:

> “The heuristic is faster.”

---

## 52. Key Takeaways

1. Exact, approximation, heuristic, and randomized are different dimensions and can overlap.
2. Approximation exists because exact optimization can be computationally infeasible.
3. Approximation quality should be quantified.
4. A formal approximation guarantee requires proof.
5. Lower bounds are powerful tools for proving approximation ratios.
6. Greedy is not automatically optimal or approximate.
7. Relaxation and rounding are major approximation techniques.
8. Local search trades global guarantees for practical exploration.
9. Branch-and-bound can remain exact when pruning is mathematically safe.
10. Anytime algorithms make computation budget an explicit quality knob.
11. Feasibility should be separated from optimization when possible.
12. Quality, latency, memory, throughput, and tail behavior must be evaluated together.
13. Approximation is not the same as average-case performance.
14. Sampling and compact summaries provide practical approximate computation.
15. Approximation should be avoided when error consequences are unacceptable.
16. Backend scheduling, caching, analytics, and retrieval contain many optimization problems.
17. ANN search is a fundamental AI approximation trade-off.
18. Candidate generation followed by exact verification is a powerful architecture.
19. Heuristics require empirical validation and explicit failure analysis.
20. Expert algorithmic engineering means choosing the weakest computational guarantee that safely satisfies the real system contract—not blindly maximizing exactness.

---

## Revision Checklist

- [ ] I can distinguish exact, approximation, heuristic, and randomized algorithms.
- [ ] I understand approximation ratios.
- [ ] I understand additive and relative error.
- [ ] I can use lower bounds to reason about approximation quality.
- [ ] I know why greedy does not automatically imply approximation.
- [ ] I understand relaxation and rounding.
- [ ] I understand local search and local optima.
- [ ] I understand branch-and-bound and safe pruning.
- [ ] I understand anytime algorithms.
- [ ] I can define an error budget.
- [ ] I can distinguish formal guarantees from empirical performance.
- [ ] I can reason about false positives and false negatives.
- [ ] I can design approximate-first/exact-later pipelines.
- [ ] I can evaluate quality versus latency.
- [ ] I can reason about ANN retrieval trade-offs.
- [ ] I can apply approximation thinking to backend scheduling/caching.
- [ ] I can apply approximation thinking to AI retrieval/search.
- [ ] I can identify when approximation is unsafe.
- [ ] I can defend an algorithm choice in an interview.
- [ ] I can explain the trade-off without hiding the loss of guarantees.
