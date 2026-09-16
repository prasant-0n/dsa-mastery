# 15.17 — Approximation Algorithms & Local-Ratio Ideas

## 1. Concept Definition

An approximation algorithm efficiently produces a feasible solution whose objective value is provably close to the optimum.

For optimization problems where exact algorithms may be too expensive, the central question becomes:

```text
How much quality do we lose for the speed and scalability we gain?
```

## 2. Optimization Language

For a minimization problem, an algorithm is an `α`-approximation when:

```text
ALG <= α · OPT
```

For a maximization problem:

```text
ALG >= OPT / α
```

Equivalent formulations are often expressed as a fraction of optimum, such as `1 - 1/e`.

## 3. Feasibility vs Quality

Approximation correctness has two separate parts:

1. the returned solution satisfies all constraints
2. its objective value satisfies the approximation guarantee

A fast but infeasible solution is not an approximation solution.

## 4. Approximation Ratio

The approximation ratio measures worst-case solution quality relative to optimum.

Always specify:

- minimization or maximization
- objective definition
- input class
- constraints
- deterministic or randomized algorithm
- whether the ratio is worst-case or empirical

## 5. Absolute vs Relative Error

An approximation ratio is multiplicative.

Relative error can instead be written as:

```text
|ALG - OPT| / OPT
```

These are related but should not be casually treated as identical metrics.

## 6. Additive Approximation

Some algorithms have guarantees of the form:

```text
ALG <= OPT + C
```

rather than a multiplicative ratio.

The useful guarantee depends on the problem's objective scale.

## 7. PTAS and FPTAS

A PTAS provides a `(1 + ε)` approximation for every fixed `ε > 0` in polynomial time, with the polynomial degree potentially depending on `1/ε`.

An FPTAS is polynomial in both input size and `1/ε`.

These classes are important when trading precision for runtime.

## 8. Greedy as Approximation

Greedy algorithms can be exact under strong structure such as matroids, or approximate when the structure only supports a bounded-quality local strategy.

Examples:

```text
Matroid greedy -> exact
Set Cover greedy -> logarithmic approximation
Maximum Coverage greedy -> 1 - 1/e
```

## 9. Local-Ratio Method

The local-ratio technique decomposes item weights into simpler weight components.

A typical proof has the form:

```text
original weights
= residual weights + structured component
```

The structured component is handled locally, while the residual problem is solved recursively or inductively.

## 10. Why Local Ratio Works

The proof shows that if the algorithm performs well with respect to both the residual instance and the structured weight component, it performs well on their sum.

This is a proof framework rather than one single algorithm.

## 11. Weight Decomposition

Given weights `w`, choose a component `w'` and define:

```text
w'' = w - w'
```

Then:

```text
w = w' + w''
```

The decomposition is chosen so that `w'` has an easy local structure.

## 12. Residual Instance

The residual instance preserves the part of the objective not explained by the local component.

The algorithm recursively or iteratively solves the residual problem.

## 13. Local-Ratio Proof Pattern

A reusable proof template is:

1. choose a local weight component
2. prove the component has a bounded relationship with any feasible solution
3. remove or reduce that component
4. solve the residual instance
5. add the local decision
6. combine the guarantees

## 14. Vertex Cover Example

Weighted Vertex Cover is a classic setting for local-ratio reasoning.

For an edge `(u,v)`, subtract the smaller endpoint weight from both endpoints.

At least one endpoint becomes zero.

A zero-weight endpoint can be selected in a reverse reconstruction step.

This produces a constant-factor approximation framework.

## 15. Why Zero Weights Matter

The local reduction deliberately creates zero-weight elements.

Zero is not merely an implementation edge case; it becomes a structural signal that a local decision can be made safely.

## 16. Maximal Matching Connection

For unweighted Vertex Cover, selecting both endpoints of every edge in a maximal matching gives a 2-approximation.

The matching edges are disjoint, so every vertex cover must contain at least one endpoint from each matched edge.

Selecting both endpoints therefore uses at most twice the optimum number of vertices.

## 17. Primal-Dual Connection

Approximation algorithms can often be understood through linear programming relaxations and dual solutions.

The primal-dual view and local-ratio view are closely related for several covering problems.

## 18. Relaxation

An integer optimization problem can sometimes be relaxed by allowing variables to take fractional values.

The fractional optimum provides a lower bound for minimization problems.

Rounding then converts the fractional solution into a feasible integral solution.

## 19. Rounding as Approximation

A common pipeline is:

```text
integer problem
→ LP relaxation
→ solve fractional problem
→ round
→ prove loss bound
```

The rounding rule determines the approximation guarantee.

## 20. Randomized Rounding

Randomized rounding converts fractional variables into discrete decisions probabilistically.

The proof typically uses expected objective value and probability bounds for constraint satisfaction.

It introduces randomness but can produce strong approximation guarantees.

## 21. Greedy vs Local Ratio

Greedy usually makes a direct local choice based on marginal benefit, ratio, or earliest boundary.

Local ratio instead reasons through objective decomposition.

Both are local methods, but their proof mechanisms differ.

## 22. Counterexamples

A proposed approximation rule must be tested against adversarial instances.

Useful questions:

- Can one locally attractive choice block many good choices?
- Can a ratio ignore fixed costs?
- Can ties produce poor solutions?
- Does the guarantee survive added constraints?

## 23. Exact Oracle for Testing

For tiny inputs, brute force can calculate the true optimum.

Then compute:

```text
empirical ratio = approximation objective / optimal objective
```

with the direction adjusted for minimization vs maximization.

This is an engineering test, not a proof of the worst-case bound.

## 24. Adversarial Instance Generation

Generate instances containing:

- dominant candidates
- misleading ratios
- nested sets
- expensive high-value items
- many equal scores
- sparse and dense constraints

Compare greedy/local-ratio results with exact solutions.

## 25. Approximation Gap

For a minimization problem:

```text
absolute gap = ALG - OPT
ratio = ALG / OPT
```

For maximization:

```text
absolute gap = OPT - ALG
ratio = ALG / OPT
```

Tracking both helps explain practical behavior.

## 26. Lower Bounds

To prove an approximation ratio, establish a lower bound on optimum or compare against a structural certificate.

Examples include:

- matching size for Vertex Cover
- LP relaxation value
- number of uncovered elements
- packing constraints

## 27. Certificates

A certificate is evidence that supports a bound without requiring the exact optimum.

A strong engineering implementation can return both:

```text
solution + quality certificate
```

when the problem permits it.

## 28. Backend Applications

Approximation can help with:

- service placement
- replica selection
- test-suite minimization
- monitoring coverage
- resource allocation
- cache placement
- dependency reduction
- deployment planning

The objective and constraints must be explicit before selecting an approximation technique.

## 29. AI Applications

AI systems frequently face combinatorial selection problems:

- representative document selection
- retrieval corpus reduction
- evaluation-set selection
- sensor/source selection
- feature subset selection
- batch construction
- model/resource placement

Approximation can make large candidate spaces tractable.

## 30. Coverage vs Cost

A common practical objective is:

```text
maximize coverage - λ · cost
```

or:

```text
maximize coverage subject to budget
```

These formulations can lead to different algorithms and guarantees.

## 31. Approximation Under Changing Constraints

A guarantee proved for one constraint set cannot automatically be reused after adding:

- capacities
- fairness
- precedence
- dependencies
- multiple budgets
- online arrival
- dynamic updates

Re-derive the algorithmic model.

## 32. Online Approximation

Online algorithms must make decisions without knowing future inputs.

Performance is commonly measured against an offline optimum using a competitive ratio.

This is conceptually related to approximation but has different information assumptions.

## 33. Streaming Approximation

Streaming algorithms trade memory and passes for solution quality.

The approximation guarantee should include the streaming model's assumptions.

## 34. Distributed Approximation

Large optimization problems may require distributed candidate evaluation.

Challenges include:

- inconsistent snapshots
- duplicate work
- communication cost
- coordination
- partial failure

The mathematical approximation guarantee does not automatically cover these systems issues.

## 35. Numerical Engineering

When objective values are floating-point numbers:

- define tolerances
- avoid unstable subtraction
- document precision assumptions
- avoid comparing nearly equal ratios without a policy

For exact integer objectives, prefer exact integer arithmetic where practical.

## 36. Production Observability

Record:

- selected items
- objective value
- runtime
- memory
- approximation certificate if available
- number of iterations
- rejected candidates
- stopping condition

This makes approximation behavior auditable.

## 37. Correctness Checklist

For every approximation implementation:

```text
feasibility
+ objective calculation
+ approximation proof assumptions
+ edge cases
+ complexity
+ empirical differential tests
```

All five matter.

## 38. Interview Framework

When asked to design an approximation algorithm:

1. state the exact optimization problem
2. explain why exact optimization is difficult or expensive
3. define the approximation objective
4. describe the local rule or decomposition
5. prove feasibility
6. derive a quality bound
7. analyze runtime and memory
8. discuss counterexamples
9. explain practical engineering trade-offs

## 39. Implementation Lab

Implement and compare:

1. greedy Set Cover
2. greedy Maximum Coverage
3. maximal-matching Vertex Cover
4. local-ratio Vertex Cover
5. brute-force exact oracles
6. approximation-ratio calculators
7. adversarial instance generators
8. quality/runtime benchmarks
9. certificate generation
10. backend and AI optimization models

## 40. Revision Checklist

- [ ] Define approximation ratio for minimization and maximization.
- [ ] Distinguish feasibility from solution quality.
- [ ] Understand absolute vs relative error.
- [ ] Understand PTAS and FPTAS.
- [ ] Explain local-ratio weight decomposition.
- [ ] Understand the Vertex Cover local-ratio idea.
- [ ] Explain maximal matching as a 2-approximation certificate.
- [ ] Understand LP relaxation and rounding at a conceptual level.
- [ ] Distinguish offline approximation from online competitive analysis.
- [ ] Build exact brute-force oracles for tiny instances.
- [ ] Test approximation algorithms adversarially.
- [ ] Apply approximation thinking to Backend and AI engineering.

## Key Takeaways

1. Approximation algorithms replace exact optimality with a provable quality guarantee.
2. Feasibility and approximation quality are separate correctness requirements.
3. Greedy is one approximation technique; local ratio, LP relaxation, rounding, and primal-dual methods provide other frameworks.
4. Local-ratio algorithms reason by decomposing weights into manageable local components and residual weights.
5. Structural lower bounds and certificates are often more useful than computing the exact optimum.
6. Guarantees belong to precise mathematical models and assumptions; adding constraints can invalidate them.
7. Exact brute-force oracles on tiny instances are essential for implementation validation, while proofs establish worst-case guarantees.
