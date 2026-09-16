# 15.15 — Matroid Greedy & Independence Systems

## 1. Concept Definition

A **matroid** is a combinatorial structure that captures a broad class of optimization problems where a greedy algorithm can safely build an optimal maximum-weight independent set.

A matroid consists of a finite ground set `E` and a family of independent subsets `I` satisfying:

1. **Non-empty:** `∅ ∈ I`.
2. **Hereditary property:** if `A ∈ I` and `B ⊆ A`, then `B ∈ I`.
3. **Exchange property:** if `A, B ∈ I` and `|A| < |B|`, there exists `x ∈ B - A` such that `A ∪ {x} ∈ I`.

The exchange property is the mathematical reason greedy selection works.

## 2. Why Matroids Matter

Many greedy algorithms look unrelated at first. Matroid theory gives a unifying explanation for an important class:

```text
sort by descending weight
→ accept an item if independence is preserved
→ obtain an optimal maximum-weight independent set
```

The key lesson is not “greedy usually works.” It is:

> Greedy works when the problem has the right structural exchange property.

## 3. Independence System

An independence system satisfies the hereditary property but does not necessarily satisfy the exchange property.

Therefore:

```text
matroid ⊂ independence systems
```

Not every independence system supports the classical matroid greedy theorem.

## 4. Hereditary Property

If a collection is feasible, removing elements cannot make it infeasible.

For example, if a set of jobs satisfies a resource constraint and we remove one job, the remaining jobs still satisfy the constraint.

This property alone is insufficient for weighted greedy optimality.

## 5. Exchange Property

Suppose `A` and `B` are independent and:

```text
|A| < |B|
```

The exchange axiom guarantees that some element from `B - A` can be added to `A` without breaking independence.

This prevents the feasible sets from having incompatible local choices that trap greedy.

## 6. Uniform Matroid

Choose at most `k` elements from `n` candidates.

Independent sets satisfy:

```text
|S| <= k
```

The greedy algorithm simply selects the `k` highest-weight elements.

This explains why “choose the largest `k` values” is optimal for this particular structure.

## 7. Graphic Matroid

Let `E` be the edges of an undirected graph.

A set of edges is independent when it contains no cycle.

The maximal independent sets are spanning trees for a connected graph.

Therefore maximum-weight independent-set greedy becomes a spanning-tree problem, closely related to Kruskal's algorithm.

## 8. Partition Matroid

Partition the ground set into groups and impose a capacity on each group.

Example:

```text
Group A: choose at most 2
Group B: choose at most 1
Group C: choose at most 3
```

An independent set obeys every group capacity.

Weighted greedy can select candidates in descending weight while accepting an item only when its partition capacity remains valid.

## 9. Transversal Matroid

A transversal matroid is derived from matchable subsets in a bipartite graph.

Its independent sets are subsets that can be matched injectively to the other side.

This connects matroid theory with matching and assignment problems.

## 10. Greedy Matroid Algorithm

For weights `w(e)`:

1. sort elements by non-increasing weight
2. start with `A = ∅`
3. inspect elements in order
4. add `e` when `A ∪ {e}` is independent
5. return `A`

For a matroid, this returns a maximum-weight independent set.

## 11. Why Sorting Is Correct

Suppose greedy selects an element with larger weight before an element with smaller weight.

The exchange property lets us transform an optimal solution so that the greedy choice is included without reducing its total weight.

Repeating this argument establishes optimality.

## 12. Weighted vs Unweighted

For an unweighted matroid, every maximal independent set has the same cardinality: the **rank**.

For weighted optimization, the goal is maximum total weight, not merely maximum size.

This distinction is fundamental.

## 13. Rank

The rank of a subset `X` is:

```text
r(X) = maximum size of an independent subset of X
```

The rank function provides another mathematical view of matroids.

Important properties include monotonicity and submodularity.

## 14. Bases

A **basis** is a maximal independent set.

In a matroid, all bases have the same cardinality.

For a connected graph, the bases of the graphic matroid correspond to spanning trees.

## 15. Basis Exchange

If `A` and `B` are bases and `x ∈ A - B`, there exists `y ∈ B - A` such that:

```text
(A - {x}) ∪ {y}
```

is also a basis.

Basis exchange is a powerful way to reason about transformations between optimal solutions.

## 16. Greedy Correctness Template

To prove a greedy algorithm through matroid structure:

```text
1. define the ground set
2. define independence
3. prove non-empty family
4. prove hereditary property
5. prove exchange property
6. sort by weight
7. accept feasible elements
8. apply the matroid greedy theorem
```

Do not merely observe that greedy succeeds on examples.

## 17. Independence Oracle

A generic matroid greedy implementation can delegate feasibility to an independence oracle:

```text
isIndependent(current, candidate) -> boolean
```

This abstraction separates the greedy algorithm from the representation of the matroid.

## 18. Complexity Model

If there are `m` elements:

```text
sorting: O(m log m)
```

The total complexity also includes the cost of every independence-oracle call.

If the oracle costs `T(m)`, a straightforward implementation may require roughly:

```text
O(m log m + m · T(m))
```

The actual bound depends on the oracle and representation.

## 19. Graphic Matroid with DSU

For the graphic matroid, cycle detection can be implemented using Disjoint Set Union.

For each edge `(u, v)`:

```text
if find(u) !== find(v):
    accept edge
    union(u, v)
```

This produces Kruskal's algorithm.

## 20. Partition Matroid Implementation

Maintain a count per partition group.

For each candidate in descending weight order:

```text
if count[group] < capacity[group]:
    accept
```

This gives a direct example of matroid greedy with an inexpensive independence test.

## 21. Matroid Intersection Boundary

The intersection of two matroids is generally **not itself a matroid**.

Therefore simply applying ordinary weighted matroid greedy is not generally valid for matroid intersection.

Matroid intersection requires more advanced augmentation algorithms.

## 22. Multiple Constraints Boundary

A problem may look like a matroid but actually impose several unrelated constraints.

For example:

- maximum number of items
- budget limit
- per-category capacity
- dependency constraints

Combining constraints can destroy the exchange property.

Always verify the structure instead of assuming it.

## 23. Knapsack Boundary

0/1 Knapsack is not a matroid optimization problem under the usual weight-capacity formulation.

The simple “sort by value” greedy rule fails.

Fractional Knapsack has a ratio-based greedy solution, but that comes from divisibility and a different structure.

## 24. Set Cover Boundary

Set Cover is not a matroid greedy problem.

Its classical greedy algorithm is an approximation algorithm, not an exact maximum-weight independent-set algorithm.

This distinction connects the previous chapters:

```text
matroid greedy -> exact under matroid structure
set-cover greedy -> approximate under set-cover structure
```

## 25. Scheduling Boundary

Some scheduling problems have exchange arguments that justify greedy rules without necessarily being presented as matroids.

Matroids are therefore one important source of greedy correctness, not the only source.

## 26. Greedy Failure Detection

When designing a greedy algorithm, ask:

- Is feasibility hereditary?
- Can larger feasible solutions exchange an element into smaller feasible solutions?
- Do all maximal feasible sets have equal size?
- Can an optimal solution be transformed to contain the greedy choice?

A “no” answer should trigger deeper analysis.

## 27. Counterexample Construction

For a non-matroid independence system, search for independent sets `A` and `B` such that:

```text
|A| < |B|
```

but every element in `B - A` makes `A` dependent.

Such a pair directly violates the exchange axiom.

## 28. Backend Applications

Matroid-like structures can model:

- selecting a bounded number of resources
- per-tenant capacity selection
- category-constrained feature activation
- acyclic dependency selection
- selecting non-conflicting infrastructure edges

The abstraction is useful only when the actual feasibility rule satisfies the required properties.

## 29. AI Applications

Potential AI engineering applications include:

- selecting bounded feature groups
- selecting diverse candidates under partition constraints
- selecting non-cyclic graph structures
- constrained experiment selection
- resource/category-constrained candidate selection

Many practical AI objectives add costs or nonlinear values, so structural validation remains essential.

## 30. Greedy + Data Structures

Matroid greedy often becomes practical through specialized independence structures:

```text
uniform matroid    -> counter
partition matroid  -> group counters
graphic matroid    -> DSU
matching-derived   -> matching/augmentation machinery
```

The data structure is part of the algorithm, not merely an implementation detail.

## 31. Correctness Invariant

During greedy execution:

```text
current solution is independent
```

At every accepted step, independence must remain true.

The exchange property then supports the global optimality argument.

## 32. Testing Strategy

Build tiny exhaustive instances and verify:

- hereditary property
- exchange property
- equal basis cardinality
- greedy feasibility
- greedy objective vs brute-force optimum

For non-matroids, deliberately search for exchange violations.

## 33. Property-Based Testing

Randomly generate candidate independence systems and test the axioms.

This can help discover:

- missing constraints
- incorrect independence checks
- hidden counterexamples
- assumptions that are true only for generated data

## 34. Brute-Force Oracle

For a small ground set of size `n`, enumerate all `2^n` subsets.

Use the independence predicate to identify feasible subsets and calculate the exact maximum weight.

Then compare the generic greedy result with the oracle.

## 35. Benchmarking

Measure separately:

- sorting time
- independence-check time
- accepted/rejected candidates
- oracle calls
- memory
- total objective value

For graphic matroids, compare naive cycle detection with DSU.

## 36. JavaScript Engineering

When weights can exceed safe integer precision, use `BigInt` consistently or use a suitable numeric representation.

Do not mix `Number` and `BigInt` arithmetic directly.

Use stable, deterministic tie-breaking when reproducibility matters.

## 37. Interview Framework

When asked “Why does greedy work?” do not answer only with intuition.

Use:

```text
problem structure
→ independence definition
→ matroid axioms
→ exchange property
→ greedy choice
→ exchange transformation
→ optimality
→ complexity
```

## 38. Common Mistakes

- assuming every hereditary system is a matroid
- confusing maximal with maximum
- assuming every greedy algorithm is a matroid algorithm
- forgetting weights
- treating matroid intersection as a matroid
- applying the theorem after adding arbitrary constraints
- proving only feasibility but not optimality

## 39. Revision Checklist

- [ ] Define a matroid.
- [ ] Explain hereditary and exchange properties.
- [ ] Define independence systems.
- [ ] Explain uniform, partition, and graphic matroids.
- [ ] Implement generic weighted matroid greedy.
- [ ] Understand rank and bases.
- [ ] Explain basis exchange.
- [ ] Connect graphic matroid greedy to Kruskal.
- [ ] Explain the independence-oracle complexity model.
- [ ] Identify non-matroid boundaries such as Knapsack and Set Cover.
- [ ] Construct exchange-property counterexamples.
- [ ] Validate matroid axioms with brute force.

## Key Takeaways

1. Matroids provide a rigorous structural explanation for an important class of exact greedy algorithms.
2. Hereditary feasibility alone is not enough; the exchange property is the critical ingredient.
3. Weighted greedy over a matroid produces a maximum-weight independent set.
4. Uniform, partition, and graphic matroids connect abstract theory to practical algorithms.
5. Kruskal's algorithm can be understood through the graphic matroid.
6. Adding constraints can destroy matroid structure, so the theorem must not be applied blindly.
7. Independence oracles and specialized data structures determine real implementation complexity.
8. Exhaustive and property-based testing are excellent tools for validating both greedy implementations and structural assumptions.
