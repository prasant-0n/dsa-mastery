# 37 — SOS DP: Subset/Superset Transforms & Fast Subset Queries

## 1. What SOS DP solves

Sum Over Subsets (SOS) DP is a family of techniques for answering aggregate queries over all submasks or supermasks of bitmasks efficiently.

Given values `f[mask]`, a common goal is:

```text
F[mask] = Σ f[sub] for every sub ⊆ mask
```

Naively this can require `O(3^n)` work across all masks. SOS DP computes all answers in `O(n 2^n)`.

The deeper idea is **factorizing a subset-lattice aggregation into one bit at a time**.

---

## 2. Bitmask universe

For `n` Boolean dimensions there are `2^n` masks.

A mask represents a subset of `{0,1,...,n-1}`.

Basic operations:

```text
sub ⊆ mask  iff  (sub & mask) === sub
```

The universe size is exponential in `n`, so SOS DP is appropriate only when `n` is small enough for `2^n` memory/time.

In JavaScript, remember that ordinary bitwise operators are 32-bit signed operations. Use `BigInt` masks when dimensions exceed the safe bitwise range, or use another representation.

---

## 3. Subset zeta transform

The subset zeta transform is:

```text
F[mask] = Σ_{sub ⊆ mask} f[sub]
```

The in-place recurrence processes one bit at a time:

```text
for bit = 0..n-1:
    for mask = 0..2^n-1:
        if mask has bit:
            F[mask] += F[mask without bit]
```

After processing bit `b`, the DP has incorporated choices differing only in the first `b+1` dimensions.

This invariant is the key to proving correctness.

---

## 4. Why the transform is O(n2^n)

There are `n` bit dimensions and `2^n` masks.

Each `(bit, mask)` pair is processed at most once:

```text
O(n 2^n)
```

This replaces repeated enumeration of every submask.

The improvement is substantial because the total number of `(mask, submask)` pairs is `3^n`.

---

## 5. Superset zeta transform

The dual query is:

```text
F[mask] = Σ_{sup ⊇ mask} f[sup]
```

Process the same lattice in the opposite direction:

```text
if mask does NOT have bit:
    F[mask] += F[mask with bit]
```

Subset and superset transforms are closely related by complement symmetry.

---

## 6. Möbius inversion

A zeta transform loses the original per-mask values unless we invert it.

For subset sums, Möbius inversion applies:

```text
for bit:
    for mask containing bit:
        F[mask] -= F[mask without bit]
```

After inversion,

```text
mobius(zeta(f)) = f
```

The subtraction version assumes an algebra where additive inverses exist.

---

## 7. Transform invariant

A useful proof invariant is:

> After processing the first `b` bits, each mask contains the sum of original values over all submasks that agree with the remaining bits and vary freely over the processed dimensions.

At the end, every subset of the mask has been included exactly once.

This invariant also explains why bit-processing order does not change the final zeta result.

---

## 8. Naive baseline

For each mask:

```text
sub = mask
while true:
    answer[mask] += f[sub]
    if sub === 0: break
    sub = (sub - 1) & mask
```

The number of submasks of a mask is `2^{popcount(mask)}`.

Across all masks:

```text
Σ_mask 2^{popcount(mask)} = 3^n
```

Always implement this baseline for tiny `n`. It is an excellent differential-testing oracle.

---

## 9. Superset enumeration baseline

The analogous supermask enumeration can be written using complement or direct bit addition.

The baseline is valuable for validating the optimized transform before trusting it on larger inputs.

---

## 10. Counting masks with a property

Suppose each mask represents a set of selected features. SOS DP can answer:

- number of valid sub-feature sets;
- total weight of compatible subsets;
- whether any compatible subset exists;
- maximum/minimum value among compatible subsets;
- number of supersets satisfying a condition.

The aggregation operator determines which transform is appropriate.

---

## 11. Beyond sums: semiring-style SOS

The subset lattice is independent of the aggregation algebra.

Instead of ordinary addition, one may compute:

```text
OR over submasks
AND over submasks
MIN over submasks
MAX over submasks
```

provided the operation behaves appropriately for repeated accumulation.

For example, subset maximum can use:

```text
F[mask] = max(F[mask], F[mask without bit])
```

This makes SOS a broader **lattice DP** pattern rather than merely a sum trick.

---

## 12. Exact arithmetic and modular arithmetic

Counting transforms often grow extremely quickly.

Use `BigInt` for exact integer counts when necessary. For modular counts, reduce after operations.

With arbitrary modulus, subtraction must be normalized:

```text
((a - b) % M + M) % M
```

Do not use floating-point arithmetic for exact combinatorial counts.

---

## 13. Superset/subset duality

Complement maps subset queries to superset queries.

For a universe mask `U`:

```text
sub ⊆ mask
```

corresponds to

```text
U ^ sub ⊇ U ^ mask
```

This duality can reduce the number of independent algorithms that need to be memorized.

---

## 14. SOS DP as repeated one-bit aggregation

The transform can be understood as a product of simple two-point operations.

For every bit, each state combines:

```text
state without bit
state with bit
```

After all bits are processed, the full subset lattice has been aggregated.

This viewpoint is useful when adapting SOS to richer values or custom summaries.

---

## 15. Subset convolution distinction

SOS zeta transforms are **not** the same as subset convolution.

Subset convolution asks for:

```text
h[S] = Σ_{A ⊆ S} f[A] g[S \ A]
```

where `A` and `S\A` must be disjoint.

Lesson 26 develops fast subset convolution. SOS is one of the transforms used as a building block, but ordinary pointwise multiplication after a zeta transform does not automatically compute subset convolution.

---

## 16. OR, AND and XOR convolution

Different subset operations produce different transforms:

- OR convolution → subset-style zeta transform;
- AND convolution → superset-style zeta transform;
- XOR convolution → Walsh-Hadamard transform.

Recognizing the operation is essential before selecting a transform.

---

## 17. Walsh-Hadamard connection

For XOR convolution, the Fast Walsh-Hadamard Transform (FWHT) diagonalizes the XOR operation.

The high-level pattern is analogous:

```text
transform
→ pointwise operation
→ inverse transform
```

but the transform and inverse signs/scaling differ from ordinary zeta/Möbius transforms.

---

## 18. SOS with richer state

Instead of a scalar `f[mask]`, a state may contain:

```text
{ count, bestScore, arg, metadata }
```

The merge operation must define how these fields combine.

For example, a max-value summary might store both the maximum and the mask that achieved it. Tie-breaking must be deterministic if reconstruction matters.

---

## 19. Dominance and Pareto summaries

If each mask contains multiple candidate states, a subset transform can become expensive unless dominated states are removed.

A candidate `A` dominates `B` when `A` is at least as good in every relevant dimension and strictly better in one.

Maintaining Pareto frontiers can reduce practical state counts, but worst-case exponential growth remains possible.

---

## 20. SOS + subset DP

A common advanced pattern is:

```text
compute a DP over exact masks
        ↓
SOS transform the resulting values
        ↓
answer all subset/superset queries
```

This is useful when the expensive combinatorial DP is performed once and many related queries follow.

Always ask whether the transform is needed globally or whether only a small number of masks can be queried directly.

---

## 21. Meet-in-the-middle bridge

When `n` is too large for `2^n`, split the dimensions into two halves.

Meet-in-the-middle reduces an `O(2^n)` enumeration to roughly `O(2^{n/2})`-scale components for many problems.

SOS and meet-in-the-middle solve different structural bottlenecks:

- SOS exploits a full subset lattice;
- meet-in-the-middle exploits decomposition into two halves.

Choosing between them depends on the query structure.

---

## 22. Memory engineering

A dense SOS array requires `O(2^n)` states.

For JavaScript:

- `Float64Array` for floating summaries;
- `Int32Array` for bounded integer summaries;
- `BigInt64Array` when its value constraints fit;
- ordinary arrays or maps when values need arbitrary `BigInt` objects.

Avoid accidental nested arrays when a flat typed array is sufficient.

---

## 23. Common failure modes

### Wrong direction
Subset and superset transforms have opposite source states.

### Incorrect bit iteration
Mixing an in-place update scheme with the wrong condition can silently double-count.

### JavaScript bitwise overflow
Masks use signed 32-bit operations.

### Wrong inverse
Möbius inversion must undo exactly the transform that was applied.

### Counting the wrong object
A transform can be perfectly implemented while answering a different subset relation than the problem asks.

---

## 24. Correctness proof template

For subset zeta:

1. define `F_b[mask]` after processing the first `b` bits;
2. state exactly which original submasks are included;
3. prove the base state at `b = 0`;
4. show one bit transition partitions the included subsets into two groups;
5. prove no subset is omitted or counted twice;
6. conclude the final state equals the required subset sum.

Use the analogous argument for superset and Möbius transforms.

---

## 25. Testing strategy

Use:

- naive `O(3^n)` subset enumeration;
- naive superset enumeration;
- `zeta → Möbius` round trips;
- random values including negatives;
- sparse and dense inputs;
- all-zero/all-one inputs;
- `n = 0`;
- maximum supported bit dimension;
- modular and exact arithmetic cross-checks.

A transform should be tested independently of the problem-specific DP that produced its input.

---

## 26. Backend applications

SOS-style transforms can support:

- feature compatibility aggregation;
- permission-set analysis;
- configuration subset queries;
- capability matching;
- dependency-set aggregation;
- combinatorial analytics over a small feature universe.

The key production constraint is the exponential `2^n` memory footprint. Put hard limits on the universe size.

---

## 27. AI engineering applications

Finite feature masks can represent:

- tool capability combinations;
- constrained action sets;
- rule activation patterns;
- structured feature compatibility;
- exact candidate-space statistics.

An AI system may propose candidate masks, but SOS should provide deterministic exact aggregation when correctness matters.

---

## 28. Recognition checklist

When you see many queries of the form:

```text
all submasks of S
all supermasks of S
```

ask:

1. Is the universe small enough for `2^n`?
2. Is the query aggregate decomposable one bit at a time?
3. Can I use subset zeta?
4. Can I use superset zeta?
5. Do I need Möbius inversion?
6. Is this actually subset convolution?
7. Is the operation OR/AND/XOR instead?
8. Would direct enumeration be cheaper for the actual query count?

---

## 29. Master pattern

```text
Identify subset/superset query
          ↓
Build naive oracle
          ↓
Represent values by mask
          ↓
Factor aggregation by bits
          ↓
Run O(n 2^n) transform
          ↓
Use Möbius inversion when needed
          ↓
Choose exact/modular representation
          ↓
Validate against O(3^n) baseline
```

The central insight is that SOS DP does not magically remove exponential state space. It **compresses repeated subset enumeration into structured bit-by-bit aggregation**.
