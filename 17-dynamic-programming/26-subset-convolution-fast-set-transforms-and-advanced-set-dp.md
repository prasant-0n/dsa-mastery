# 26 — Subset Convolution, Fast Set Transforms & Advanced Set DP

> **Phase 17 — Dynamic Programming**

## 1. Why This Topic Matters

Bitmask DP gives us `2^n` states, but many advanced problems ask for relationships between **two disjoint subsets** or require repeatedly combining subset-based functions. Naively enumerating all pairs of submasks often costs `O(3^n)` or worse.

Subset convolution introduces a precise algebra for combining functions over disjoint subsets:

`h[S] = sum over A union B = S, A intersection B = empty of f[A] g[B]`.

The key mental model is:

> **Ordinary subset DP reasons about one subset. Subset convolution reasons about how a subset can be decomposed into disjoint parts.**

This connects:

- subset DP
- zeta transforms
- Möbius inversion
- ranked transforms
- subset convolution
- disjoint-set combination
- fast `O(n^2 2^n)` convolution
- inclusion-exclusion
- set partitions
- algebraic DP.

---

## 2. Subset Functions

A subset function maps every subset to a value:

`f : 2^[n] -> R`.

Store it as:

`f[mask]`.

Examples:

- cost of selecting exactly `mask`
- number of ways to construct `mask`
- best score for `mask`
- whether `mask` is feasible.

The important distinction is that a subset function has one value per subset; it is not automatically a DP recurrence.

---

## 3. Disjoint Decomposition

For a target subset `S`, a disjoint decomposition is:

`S = A union B`, with `A intersection B = empty`.

Every element of `S` chooses exactly one of three roles:

1. belongs to `A`;
2. belongs to `B`;
3. is not in `S`.

This explains the familiar `3^n` count behind nested submask enumeration.

For each `S`, there are `2^|S|` choices for `A`, because `B = S \ A`.

Across every `S`:

`sum_S 2^|S| = 3^n`.

---

## 4. Naive Subset Convolution

The direct formula is:

`h[S] = sum_{A subseteq S} f[A] g[S \ A]`.

This costs:

`O(3^n)` time.

For small `n`, this may be entirely appropriate and is an essential oracle. For larger `n`, it becomes the bottleneck.

Never optimize before implementing the naive version: the naive convolution is one of the best correctness oracles for the fast algorithm.

---

## 5. Why Ordinary Zeta Transform Is Not Enough

The subset zeta transform computes:

`F[S] = sum_{A subseteq S} f[A]`.

It is useful for subset aggregation and can be computed in:

`O(n 2^n)`.

But multiplying ordinary zeta transforms does **not** directly compute disjoint subset convolution, because the product permits overlapping contributions.

The missing information is the **cardinality rank** of each subset contribution.

This motivates the ranked zeta transform.

---

## 6. Ranked Subset Functions

Define:

`f_k[S] = f[S]` if `|S| = k`, otherwise `0`.

Then compute the subset zeta transform independently for every rank:

`F_k[S] = sum_{A subseteq S, |A|=k} f[A]`.

The rank dimension records how many elements were assigned to the first component.

This is the critical state expansion that makes fast subset convolution possible.

---

## 7. Fast Subset Convolution

For functions over a ring, a standard fast subset-convolution strategy is:

1. separate `f` and `g` by subset cardinality;
2. perform ranked subset zeta transforms;
3. multiply matching rank combinations;
4. recover the desired rank by Möbius inversion;
5. read rank `|S|` for each target subset.

Conceptually:

```text
f, g
 ↓
ranked zeta transforms
 ↓
rank-wise convolution in cardinality
 ↓
Möbius inversion
 ↓
h[S]
```

The resulting complexity is approximately:

`O(n^2 2^n)` time and `O(n^2 2^n)` storage in the straightforward implementation.

Memory engineering is therefore a first-class concern.

---

## 8. The Rank Equation

If a target set `S` is partitioned into `A` and `B`, then:

`|A| + |B| = |S|`.

Therefore the transformed convolution for rank `k` is:

`H_k[S] = sum_{i=0}^k F_i[S] G_{k-i}[S]`.

After Möbius inversion, the rank-`|S|` component gives the desired disjoint convolution.

The rank equation is the algebraic replacement for enumerating every disjoint pair explicitly.

---

## 9. Möbius Inversion

The subset zeta transform is reversible.

If:

`F[S] = sum_{A subseteq S} f[A]`,

then Möbius inversion recovers `f` by applying the inverse contribution for each bit.

For ordinary numeric functions, the update is conceptually:

```text
for each bit i:
    for each mask containing i:
        F[mask] -= F[mask without i]
```

The transform pair is:

```text
zeta:      subset sums
Möbius:    recover exact subset contributions
```

A common bug is reversing the bit loop semantics or mixing subset and superset transforms.

---

## 10. Algebraic Requirements

Fast subset convolution is not merely a bit trick. The operations must support the required addition, subtraction, and multiplication structure.

For standard Möbius inversion, subtraction is required, so a ring-like setting is convenient.

Boolean OR/AND does not automatically support the same inverse transform because ordinary subtraction is unavailable.

Therefore distinguish:

- semiring DP
- ring-based transform algorithms
- Boolean transforms
- modular arithmetic.

Always verify that the algebra supports the transform you intend to use.

---

## 11. Modulo Arithmetic

Competitive implementations often work modulo `M`.

All additions, subtractions, and multiplications are performed modulo `M`.

Normalize negative values after Möbius subtraction:

`((x % M) + M) % M`.

If exact products exceed JavaScript's safe integer range, use `BigInt` consistently.

Do not mix `Number` and `BigInt` in the same arithmetic expression.

---

## 12. Integer vs BigInt Representation

The transform has potentially many arithmetic operations. `BigInt` can preserve exactness but may increase runtime and memory usage.

A practical engineering approach is:

1. determine whether the modulus and intermediate bounds guarantee safe `Number` arithmetic;
2. otherwise use `BigInt`;
3. benchmark the actual transform;
4. keep a small exact oracle for regression tests.

The bitmask representation and arithmetic representation remain separate design decisions.

---

## 13. Subset Convolution vs Submask Enumeration

Use direct submask enumeration when:

- `n` is small;
- only a few target masks are needed;
- the transition has additional constraints that destroy transform structure;
- implementation simplicity matters.

Use fast subset convolution when:

- values are required for many/all masks;
- the operation has the required algebraic structure;
- `3^n` is too expensive;
- `O(n^2 2^n)` is within the available limits.

The fast method is not universally superior.

---

## 14. Set Partition DP

A common use is partitioning a universe into groups.

Suppose `cost[S]` is the cost of one group containing exactly `S`.

A DP for two groups may use subset convolution-like decomposition:

`dp[S] = min_{A disjoint B, A union B = S} cost[A] + cost[B]`.

For arbitrary optimization operators, the exact fast-transform method may differ from ordinary arithmetic convolution.

The first question is always:

> What algebra does the transition use?

Do not assume the numeric convolution algorithm transfers unchanged to min-plus optimization.

---

## 15. Inclusion-Exclusion Connection

Möbius inversion is closely related to inclusion-exclusion.

Both recover exact contributions from cumulative quantities by alternating signs.

Subset DP therefore has a useful conceptual ladder:

```text
exact subset value
      ↓
zeta transform
cumulative subset value
      ↓
Möbius inversion
exact subset value
```

Understanding this makes many inclusion-exclusion transformations less mysterious.

---

## 16. OR / AND / XOR Convolutions

Several set-based convolutions have specialized transforms.

- **OR convolution** pairs subsets through union-like combination.
- **AND convolution** pairs through intersection-like combination.
- **XOR convolution** pairs through symmetric difference.

Their transforms and algebraic requirements differ.

Do not call every set transform “subset convolution.” The operation defining how two masks combine determines the correct transform family.

---

## 17. Fast Walsh-Hadamard Transform Connection

XOR convolution is commonly accelerated using the Fast Walsh-Hadamard Transform (FWHT).

The high-level pattern is similar:

```text
transform inputs
   ↓
pointwise combination
   ↓
inverse transform
```

Subset convolution instead uses ranked subset zeta/Möbius structure because disjoint union is the target operation.

This gives a broader algorithmic lesson:

> **Choose a transform whose basis matches the composition operation.**

---

## 18. Sparse vs Dense State Storage

Fast transforms usually expect dense arrays of size `2^n` for each rank.

If only a small set of masks is reachable, a sparse DP may be much cheaper.

But sparse maps have hashing and allocation overhead, while dense typed arrays provide predictable memory access.

Before implementing, estimate:

`2^n × (n + 1)` transformed values.

For JavaScript, this can become a memory limit long before arithmetic becomes the bottleneck.

---

## 19. Memory Optimization

The straightforward ranked transform stores roughly:

`(n + 1) × 2^n`

values for each input function and intermediate product.

Possible optimizations include:

- process ranks carefully;
- reuse buffers;
- use typed arrays where safe;
- use modular `Number` arrays when exact;
- avoid storing both transformed and inverse copies unnecessarily;
- exploit symmetry of ranks;
- stream intermediate products when the dependency graph permits it.

Memory reduction must preserve transform dependencies.

---

## 20. Correctness Invariant

For ranked zeta transform:

> `F[k][S]` equals the sum of `f[A]` over every `A subseteq S` with `|A| = k`.

For ranked convolution:

> `H[k][S]` combines every pair of transformed contributions whose ranks sum to `k`.

After Möbius inversion:

> the recovered rank-`k` value represents exact contributions rather than cumulative subset contributions.

For the final target `k = |S|`, every contributing pair must be disjoint and cover exactly `S`.

---

## 21. Testing Strategy

Build three levels of oracle:

### Level 1 — Direct submask convolution

`O(3^n)` implementation for tiny `n`.

### Level 2 — Transform implementation

Ranked zeta → rank convolution → Möbius.

### Level 3 — Independent special cases

Test identities such as:

- one function is nonzero only at the empty set;
- one function is a singleton indicator;
- symmetric inputs `f = g`;
- all-zero input;
- single-element universe;
- maximum-size masks.

Compare every mask, not only the final answer.

---

## 22. Differential and Metamorphic Testing

Useful properties include:

- commutativity when the convolution algebra is commutative;
- zero-function identity;
- identity function at the empty set;
- scaling by a constant;
- permutation of element labels;
- equivalence between direct and transformed implementations.

For label permutations, transform the input masks and expected output consistently.

These tests expose indexing errors that ordinary examples often miss.

---

## 23. Adversarial Cases

Include:

- `n = 0`;
- `n = 1`;
- only empty-set values;
- only full-set values;
- sparse nonzero functions;
- dense random functions;
- negative coefficients when supported;
- modulus `1`;
- values near numeric limits;
- repeated equal values;
- asymmetric functions;
- every possible rank represented.

A transform can be algebraically correct but fail because of a single mask-index or rank-index error.

---

## 24. Backend Engineering Applications

Potential applications include exact optimization over a small finite universe:

- combining dependency subsets;
- composing feature groups;
- permission-policy composition;
- service capability sets;
- configuration partitioning;
- small workflow component combinations.

The engineering constraint is usually the universe size. If `n` grows, exponential memory dominates quickly.

For production, expose transform size, estimated memory, arithmetic mode, and fallback strategy.

---

## 25. AI Engineering Applications

Subset convolution and related transforms can support:

- exact combinatorial feature selection;
- structured subset scoring;
- small discrete planning spaces;
- partition-based inference;
- composition of compatible capability sets;
- exact search components inside hybrid AI systems.

These are tools for small discrete state spaces, not replacements for general neural inference.

---

## 26. Complexity

Let `n` be the universe size.

Naive subset convolution:

`O(3^n)` time.

Straightforward fast subset convolution:

`O(n^2 2^n)` time.

Typical transformed storage:

`O(n 2^n)` values per major function/intermediate layer.

The crossover depends heavily on constants, language runtime, memory bandwidth, and implementation strategy.

---

## 27. Common Failure Modes

- confusing disjoint union with ordinary subset containment;
- multiplying ordinary zeta transforms and forgetting overlap;
- omitting the rank dimension;
- using the wrong Möbius sign/update;
- mixing subset and superset transforms;
- assuming Boolean algebra supports ordinary Möbius inversion;
- exceeding JavaScript memory limits;
- silently losing integer precision;
- using a transform for an algebra it does not support;
- comparing only final outputs instead of every mask;
- optimizing away the naive oracle too early.

---

## 28. Interview Recognition Framework

When a problem contains many values indexed by subsets, ask:

1. Are we combining two disjoint subsets?
2. Is the target the union of those subsets?
3. Does naive submask enumeration produce `3^n`?
4. Is the algebra ring-like enough for zeta/Möbius inversion?
5. Do we need all masks or only a few?
6. Would a ranked transform remove the explicit disjoint-pair enumeration?
7. Is XOR/OR/AND convolution actually the correct operation instead?
8. Can `O(n^2 2^n)` memory fit?
9. What is the independent oracle?
10. Can symmetry or sparsity reduce the universe?

---

## 29. Master Pattern

```text
subset-indexed functions
        ↓
identify composition operation
        ↓
write naive convolution / DP
        ↓
count the 3^n bottleneck
        ↓
choose matching transform
        ↓
add rank when disjointness requires it
        ↓
zeta transform
        ↓
combine transformed ranks
        ↓
Möbius inversion
        ↓
recover exact subset answers
        ↓
differential-test against O(3^n)
        ↓
audit memory + algebraic assumptions
```

The deepest lesson is:

> **Transform algorithms are algebraic DP accelerators. The speedup comes from changing the representation of the composition, not from a bit-level trick.**

## 30. Mastery Checklist

- [ ] Explain subset convolution from first principles.
- [ ] Derive the `3^n` naive complexity.
- [ ] Implement direct disjoint-subset convolution.
- [ ] Implement subset zeta transform.
- [ ] Implement Möbius inversion.
- [ ] Explain why ordinary zeta multiplication is insufficient.
- [ ] Implement ranked subset transforms.
- [ ] Derive the rank-convolution equation.
- [ ] Implement fast subset convolution.
- [ ] Handle modular arithmetic safely.
- [ ] Distinguish ring transforms from semiring DP.
- [ ] Compare subset, OR, AND, and XOR convolutions.
- [ ] Understand FWHT at a conceptual level.
- [ ] Engineer dense memory for `n 2^n` states.
- [ ] Differential-test every transformed result.
- [ ] Use metamorphic and adversarial tests.
- [ ] Prove the transform invariant.
- [ ] Identify when the transform is invalid or unnecessary.
- [ ] Complete the backend and AI labs in the exercise file.
