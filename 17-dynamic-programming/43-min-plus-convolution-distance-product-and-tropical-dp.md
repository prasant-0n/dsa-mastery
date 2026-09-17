# 43 — Min-Plus Convolution, Distance Product & Tropical DP

## 0. Learning Objective

Many dynamic programs have the form

```text
dp[i] = min over j { A[j] + B[i-j] }
```

or, in graph form,

```text
C[i][j] = min over k { A[i][k] + B[k][j] }
```

These are **min-plus** or **tropical** combinations. The same pattern appears in sequence DP, shortest paths, distance products, scheduling, partition transitions, and algebraic graph algorithms.

This lesson develops the deeper abstraction:

> **A DP transition can be treated as an algebraic product. Once the aggregation operator is identified, we can reason about min-plus convolution, distance products, repeated closure, sparsity, structure, and acceleration systematically.**

The goal is not to memorize a single optimization trick. The goal is to recognize when an expensive `min over k` transition is really a tropical product and decide whether the right tool is direct DP, structural optimization, sparse computation, or repeated matrix-style composition.

---

## 1. Tropical / Min-Plus Algebra

In ordinary arithmetic,

```text
addition  = +
multiplication = ×
```

In min-plus algebra,

```text
addition-like operation      = min
multiplication-like operation = +
```

So a product becomes

```text
(a ⊗ b) = a + b
```

and an aggregation becomes

```text
(a ⊕ b) = min(a, b)
```

The additive identity is

```text
∞
```

and the multiplicative identity is

```text
0
```

because

```text
min(x, ∞) = x
x + 0 = x
```

Always distinguish the algebraic identity from a finite sentinel used in JavaScript.

---

## 2. Min-Plus Convolution

Given arrays `A` and `B`, define

```text
C[t] = min over i+j=t { A[i] + B[j] }
```

This is the min-plus convolution.

The direct algorithm is:

```text
for t:
    C[t] = INF
    for i:
        j = t - i
        if j is valid:
            C[t] = min(C[t], A[i] + B[j])
```

For lengths around `n`, this is typically `O(n²)`.

The important observation is that this is not an arbitrary nested loop. It has algebraic structure.

---

## 3. Why Convolution Appears in DP

Suppose a partition DP is

```text
dp[t] = min over i < t { dp[i] + cost(i, t) }
```

If the cost can be transformed into

```text
cost(i, t) = B[t-i]
```

then

```text
dp[t] = min_i { dp[i] + B[t-i] }
```

which is exactly min-plus convolution.

This happens when the cost depends only on interval length, duration, distance, or another translation-invariant quantity.

Before optimizing any DP, inspect whether the transition can be normalized into a convolution-like form.

---

## 4. Min-Plus Versus Ordinary Convolution

Ordinary convolution:

```text
C[t] = sum_i A[i] * B[t-i]
```

Min-plus convolution:

```text
C[t] = min_i A[i] + B[t-i]
```

The index structure looks similar but the algebra is different.

This matters because FFT-based ordinary convolution does not automatically solve min-plus convolution.

Do not import an ordinary polynomial-convolution technique without proving that the required algebra is preserved.

---

## 5. Max-Plus Is the Dual Form

For maximization,

```text
C[t] = max_i { A[i] + B[t-i] }
```

is max-plus convolution.

A common transformation is

```text
max-plus(A, B) = - min-plus(-A, -B)
```

when finite values and arithmetic ranges make the transformation safe.

The same DP architecture can therefore support:

- minimum cost;
- maximum score;
- longest path style recurrences.

The aggregation identity changes accordingly.

---

## 6. Distance Product of Matrices

For matrices `A` and `B`, the min-plus matrix product is

```text
C[i][j] = min_k { A[i][k] + B[k][j] }
```

This is called the **distance product**.

Compare ordinary matrix multiplication:

```text
C[i][j] = sum_k A[i][k] * B[k][j]
```

The index structure is identical; the algebra is different.

This gives a powerful mental model:

```text
one-step transitions
       ↓
min-plus product
       ↓
multi-step optimal transitions
```

---

## 7. Why Distance Product Is a DP

Let `D^(1)` represent the cost of using one edge.

Then

```text
D^(2) = D^(1) ⊗ D^(1)
```

computes the best cost using at most/exactly the relevant number of two-step transitions, depending on initialization and diagonal semantics.

More generally,

```text
D^(t+1)[i][j]
  = min_k { D^(t)[i][k] + W[k][j] }
```

is just a graph DP over the previous layer.

Matrix notation compresses the recurrence; it does not remove the underlying state-transition reasoning.

---

## 8. Exact-Length Paths Versus At-Most Paths

This distinction is critical.

If `W` is the edge-cost matrix and

```text
D_t[i][j]
```

means the minimum cost of a walk using **exactly** `t` edges, then

```text
D_{t+1} = D_t ⊗ W
```

with

```text
D_0[i][j] = 0 if i == j else ∞
```

For **at most** `t` edges, the semantics require an additional closure/identity choice or an explicit aggregation over lengths.

Never use a power interpretation without first writing the exact state semantics.

---

## 9. Min-Plus Matrix Exponentiation

When the same transition matrix is applied repeatedly, binary exponentiation can reduce the number of matrix products.

Define

```text
P = W
P^2 = P ⊗ P
P^4 = P^2 ⊗ P^2
...
```

Then decompose `k` in binary.

The algebraic requirement is associativity of the product:

```text
(A ⊗ B) ⊗ C = A ⊗ (B ⊗ C)
```

For the standard min-plus algebra this holds because `+` is associative and distributes appropriately over `min`.

The computational primitive remains matrix multiplication, with `min/+` replacing `sum/*`.

---

## 10. Complexity

A dense min-plus product of two `n × n` matrices costs

```text
O(n³)
```

Naive binary exponentiation therefore costs roughly

```text
O(n³ log k)
```

for exponent `k`.

Memory is usually

```text
O(n²)
```

per dense matrix.

For large `n`, the key question is often not just asymptotic exponentiation but whether the matrix is sparse, structured, or small enough for a specialized transition method.

---

## 11. Sparse Min-Plus Product

If most entries are `∞`, a dense triple loop wastes work.

Use adjacency-style representations:

```text
row i -> reachable k entries
row k -> reachable j entries
```

Then only finite combinations are considered.

A simple sparse product can cost approximately according to the number of compatible finite triples rather than `n³`.

The exact bound depends on sparsity distribution; avoid claiming a universal `O(m²)` style bound without deriving it for the representation.

---

## 12. DAG Shortest Paths as a Degenerate Tropical DP

A DAG shortest-path recurrence is

```text
dp[v] = min over (u,v) { dp[u] + w(u,v) }
```

This is a local min-plus transition.

The difference from dense distance products is representation:

```text
DAG DP -> exploit topological order and sparse edges
matrix DP -> exploit repeated dense state transitions
```

The same algebra appears, but the engineering choice is different.

This is a useful unification of graph DP and algebraic DP.

---

## 13. APSP Connection

For weighted graphs without problematic negative cycles, repeated distance-product operations connect to all-pairs shortest paths.

Conceptually,

```text
best paths with bounded number of edges
       ↓
min-plus closure
       ↓
all-pairs shortest distances
```

This does not mean every APSP algorithm should literally use matrix exponentiation. Floyd-Warshall, repeated squaring, sparse shortest-path methods, and other approaches exploit different structure.

The lesson is to recognize the same recurrence behind all of them.

---

## 14. Floyd-Warshall as In-Place Tropical DP

Floyd-Warshall uses

```text
dp[i][j] = min(
    dp[i][j],
    dp[i][k] + dp[k][j]
)
```

for each intermediate vertex `k`.

This is a min-plus recurrence over the set of allowed intermediate states.

Its state semantics are different from exact-length path DP:

```text
D_k[i][j] = best path from i to j using only intermediates from a chosen prefix
```

The recurrence is therefore another manifestation of the same algebra, but with a different state partition.

---

## 15. Tropical Matrix Powers Versus Floyd-Warshall

Both manipulate path costs, but they organize computation differently.

### Repeated tropical powers

State dimension emphasizes number of transitions or repeated operator application.

### Floyd-Warshall

State dimension emphasizes the set of allowed intermediate vertices.

The right interpretation depends on the problem's controlling parameter:

```text
huge path length / repeated stationary operator
    -> powers may be useful

moderate vertex count / arbitrary dense graph
    -> closure-style DP may be simpler
```

Do not choose by formula recognition alone; derive the state semantics first.

---

## 16. Min-Plus Convolution With Structural Cost

The naive `O(n²)` convolution can sometimes be improved when the arrays or cost satisfy additional structure.

Examples include:

- monotone argmins;
- convex/concave cost;
- Monge structure;
- bounded candidate ranges;
- small value domains;
- sparse finite entries;
- separable costs.

These connect directly to earlier DP optimization techniques such as:

- divide-and-conquer optimization;
- SMAWK;
- monotone queues;
- convex hull methods.

The important point is that **min-plus form is the base abstraction, not the optimization itself**.

---

## 17. Min-Plus Convolution and Monge Arrays

Define the candidate matrix

```text
M[t][i] = A[i] + B[t-i]
```

for valid indices.

Under suitable convexity/Monge assumptions, the position of the minimizing candidate can move monotonically as `t` changes.

Then the full quadratic computation may admit structural optimization.

The exact implication depends on the cost construction and indexing. Always prove the required inequality rather than assuming every convolution is Monge.

---

## 18. Unimodality Is Not Enough

Suppose for each target `t`, the candidate values over `i` are unimodal.

That can support local search for one target, but it does not automatically provide a globally monotone sequence of argmins across targets.

These are different properties:

```text
per-row unimodality
≠
monotone argmin positions
≠
Monge structure
≠
total monotonicity
```

This distinction matters when selecting divide-and-conquer or SMAWK-style acceleration.

---

## 19. Min-Plus Convolution and CHT

Convex Hull Trick often accelerates transitions such as

```text
dp[i] = min_j { m_j * x_i + b_j }
```

That is a min-plus optimization over affine functions.

General min-plus convolution instead has a discrete shifted-array form.

Sometimes a cost can be algebraically transformed from one to the other; often it cannot.

Use CHT only after deriving the required affine structure.

---

## 20. Repeated Min-Plus Convolution

A recurrence may apply the same convolution operator many times:

```text
D_{t+1} = D_t ⊗ K
```

A direct implementation costs roughly

```text
O(T n²)
```

for `T` iterations.

If the operator is stationary, repeated application suggests exponentiation or another repeated-operator technique.

The design question becomes:

> Can the operator be composed with itself more cheaply than replaying every time step?

This is the same idea behind matrix exponentiation and transfer-matrix DP.

---

## 21. Semiring-Generalized Distance Products

The min-plus algebra is one member of a broader family.

The same matrix shape can support:

| Algebra | Meaning |
|---|---|
| Boolean | reachability |
| min-plus | shortest cost |
| max-plus | maximum score |
| sum-product | path counting / weighted paths |
| max-product | best probability-like score |

The implementation can be parameterized by:

```text
combine
extend
zero
one
```

But only when the algebraic laws required by the algorithm are actually satisfied.

---

## 22. Negative Weights and Cycles

Min-plus DP becomes subtle when cycles exist and negative costs are allowed.

A negative cycle can make the shortest-walk objective unbounded below.

Therefore before applying a repeated min-plus process, ask:

```text
Are negative edges present?
Can cycles be repeated?
Is the objective over walks or simple paths?
Is there a finite horizon?
Is the graph acyclic?
```

A finite-horizon recurrence can remain well-defined even when an unrestricted shortest-walk problem is not.

---

## 23. Infinity and Numeric Safety in JavaScript

A common pattern is:

```js
const INF = Number.POSITIVE_INFINITY;
```

This is often convenient because

```text
INF + finite = INF
min(INF, finite) = finite
```

But finite sentinel arithmetic becomes dangerous when using large numeric bounds.

For exact integer costs beyond `Number.MAX_SAFE_INTEGER`, consider `BigInt`.

Do not mix `Number` and `BigInt` in arithmetic.

For performance-sensitive implementations, document the numeric contract explicitly.

---

## 24. Memory Engineering

Dense `n × n` JavaScript arrays can be expensive.

Possible representations include:

- nested arrays for clarity;
- flat arrays for predictable indexing;
- typed arrays for fixed-range values;
- sparse maps for highly sparse matrices;
- rolling matrices when only two layers are required.

For min-plus products, three dense matrices may be needed during exponentiation if aliasing is not carefully managed.

Measure memory, not just asymptotic complexity.

---

## 25. Vector × Matrix Min-Plus Product

Sometimes a full matrix product is unnecessary.

Given a vector `v` and matrix `M`:

```text
out[j] = min_i { v[i] + M[i][j] }
```

This costs `O(n²)` in the dense case.

For repeated application,

```text
v = v ⊗ M
```

can be accelerated using precomputed powers:

```text
v ⊗ M^k
```

with roughly `O(n² log k)` dense work when the powers are already available and each vector-matrix product is computed directly.

This is often substantially cheaper than constructing a full result matrix at every step.

---

## 26. Path Reconstruction

A scalar min-plus value does not itself contain the optimal path.

For a transition

```text
C[i][j] = min_k { A[i][k] + B[k][j] }
```

store an argmin witness:

```text
choice[i][j] = best k
```

If the product is repeated through exponentiation, reconstruction becomes more involved because the chosen midpoint belongs to a composed operator.

A practical approach is checkpointing the composition tree or storing midpoint decisions for each powered operator.

Witness storage can multiply memory substantially.

---

## 27. Tie-Breaking

If several `k` values produce the same optimum, deterministic reconstruction requires an explicit rule.

Examples:

```text
choose smallest k
choose largest k
lexicographically smallest reconstructed path
```

A local tie rule is safe only when it is compatible with the desired global witness ordering.

Value correctness and witness determinism are separate specifications.

---

## 28. Truncated / Bounded Min-Plus Convolution

Sometimes only a prefix of the convolution is needed:

```text
C[0..K]
```

Then invalid or unnecessary indices should not be computed.

Likewise, if costs above a threshold `T` are irrelevant, values may be capped or represented as unreachable when the semantics permit it.

This is particularly useful in resource-bounded DP and pseudo-polynomial algorithms.

Any pruning rule must be justified against the objective.

---

## 29. Sparse and Bounded-Domain Cases

Min-plus convolution may be much cheaper than `O(n²)` when only a few entries are finite.

Suppose

```text
A has p finite entries
B has q finite entries
```

A direct sparse pair enumeration considers roughly `p × q` combinations.

If `p` and `q` are much smaller than `n`, this can dominate dense computation.

Choose representation based on actual density, not the declared array length alone.

---

## 30. Min-Plus DP on Schedules

Suppose a task can transition from start time `i` to end time `t` with cost depending on duration.

A common recurrence is

```text
dp[t] = min_i { dp[i] + durationCost(t-i) }
```

which is min-plus convolution.

This appears in:

- batch scheduling;
- machine setup planning;
- segmentation;
- resource replenishment;
- time-bucket optimization.

The engineering advantage is that a domain-specific recurrence can sometimes be transformed into a standard convolution engine.

---

## 31. Tropical DP for Backend State Transitions

Consider a service workflow where a system moves through finite states with transition penalties:

```text
state_i -> state_j : latency / cost / risk
```

If a request must undergo a fixed number of stages, min-plus powers can compute the minimum total transition cost.

Useful applications include:

- routing through service stages;
- dependency migration planning;
- SLA-aware workflow selection;
- bounded-step state planning.

The backend representation should preserve:

```text
state identity
transition legality
cost semantics
numeric contract
traceability
```

---

## 32. Tropical DP for AI Engineering

Weighted finite-state decoding can be expressed using tropical or max-plus operators.

Examples:

- constrained decoding;
- dynamic beam lattices;
- finite-state normalization;
- sequence segmentation;
- shortest-cost token transformations.

A recurring pattern is

```text
model score + structural transition score
        ↓
max-plus DP
```

or

```text
model cost + structural transition cost
        ↓
min-plus DP
```

This is a structured inference perspective, not a claim that all neural decoding is finite-state.

---

## 33. Testing Strategy

For min-plus algorithms, use multiple independent checks.

### Brute-force oracle

Enumerate all candidate split points for tiny arrays or all short paths in tiny graphs.

### Differential testing

Compare:

```text
naive O(n²)
vs
optimized implementation
```

### Algebraic tests

Verify:

```text
A ⊗ I = A
I ⊗ A = A
```

where `I` has zero diagonal and infinity elsewhere.

### Metamorphic tests

Examples:

- adding a constant to every transition in a fixed-length path shifts all exact-length optima predictably;
- relabeling graph vertices preserves distances under corresponding relabeling;
- transposed representations obey the corresponding reversed-product relation.

Always derive the expected transformation before using it as a test.

---

## 34. Correctness Proof Template

For a min-plus recurrence, prove:

1. **State meaning** — exactly what each DP entry represents.
2. **Candidate completeness** — every valid final decomposition chooses some candidate `k`.
3. **Candidate soundness** — every considered `k` constructs a valid solution.
4. **Optimal substructure** — fixing `k` reduces the remainder to a previously defined optimal state.
5. **Aggregation correctness** — `min` chooses the best valid candidate.
6. **Boundary conditions** — empty/zero-step cases are correct.
7. **Reconstruction consistency** — stored choices correspond to the value recurrence.

The algebra makes the recurrence compact, but the proof remains a standard DP proof.

---

## 35. Recognition Framework

When you see

```text
best[target] = min over middle { left[middle] + right(middle, target) }
```

ask:

```text
Is this min-plus?
    ↓
Can the transition be written as convolution?
    ↓
Is the operator repeated?
    ↓
Is the state graph sparse or dense?
    ↓
Does Monge / convexity / monotonicity hold?
    ↓
Would vector × matrix be enough?
    ↓
Is a full power / closure actually necessary?
```

This decision process prevents overengineering.

---

## 36. Master Pattern

The full abstraction is:

```text
DP recurrence
   ↓
identify aggregation algebra
   ↓
min-plus / max-plus / other semiring
   ↓
identify structure
   ├── sparse graph
   ├── convolution
   ├── Monge / monotone
   ├── repeated stationary operator
   └── bounded horizon
   ↓
choose representation + optimization
   ↓
prove semantics
   ↓
validate against naive oracle
```

The key lesson is not "use matrix exponentiation".

The key lesson is:

> **Understand the operator first. Then choose the data structure and optimization that match the operator's structure.**

---

## 37. Interview Framework

When asked to optimize a min-based DP:

1. State the DP semantics precisely.
2. Write the raw transition.
3. Identify whether the transition is min-plus or max-plus.
4. Check whether it reduces to convolution or matrix product.
5. Check structural properties before choosing an optimization.
6. State complexity of both baseline and optimized form.
7. Explain numeric and reconstruction constraints.
8. Give a counterexample to any optimization assumption you cannot prove.

A strong solution is the one whose acceleration follows from a demonstrated invariant.

---

## 38. Final Engineering Principle

Min-plus algebra is a lens, not a solution by itself.

The same recurrence can be solved through:

- ordinary DP;
- sparse graph processing;
- monotone optimization;
- Monge/SMAWK techniques;
- convolution-style methods;
- tropical matrix multiplication;
- exponentiation of repeated operators.

Expert-level DP means recognizing the shared algebraic structure while still respecting the exact state semantics, input constraints, numerical behavior, and reconstruction requirements.
