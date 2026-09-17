# 50 — Fast Polynomial DP: FFT, NTT & Convolution Acceleration

## 1. Why this lesson exists

Earlier counting and generating-function DP introduced polynomial states and convolution. The next bottleneck appears when polynomial multiplication itself becomes the dominant cost.

If two degree-`n` polynomials are multiplied naively, every pair of coefficients may interact:

```text
c[k] = sum(a[i] * b[k - i])
```

which costs `O(n²)`.

This lesson studies how fast convolution turns some quadratic DP transitions into near-linearithmic operations using **FFT** or **NTT**, and how to recognize when that acceleration is actually justified.

The goal is not to memorize transform code. The goal is to understand the algebraic contract:

```text
DP transition
    ↓
polynomial multiplication / convolution
    ↓
transform domain
    ↓
pointwise multiplication
    ↓
inverse transform
```

---

## 2. Convolution as a DP transition

Suppose two independent components have distributions `A` and `B`.

If `A[i]` counts ways to produce total `i` and `B[j]` counts ways to produce total `j`, then the combined distribution is:

\[
C[k] = \sum_{i+j=k} A[i]B[j].
\]

That is exactly polynomial convolution.

This occurs in:

- tree knapsack and subtree merges;
- counting by total weight;
- score distributions;
- product generating functions;
- bounded combinatorial composition;
- probability distribution aggregation.

The algorithmic question is whether the degree is large enough for an asymptotically faster convolution to matter.

---

## 3. Naive convolution baseline

For arrays `a` and `b`:

```js
const c = Array(a.length + b.length - 1).fill(0);
for (let i = 0; i < a.length; i++) {
  for (let j = 0; j < b.length; j++) {
    c[i + j] += a[i] * b[j];
  }
}
```

Complexity:

```text
O(nm)
```

for lengths `n` and `m`.

Keep this implementation even after adding FFT/NTT. It is an essential correctness oracle for small inputs.

---

## 4. The transform idea

The central FFT identity is that convolution in coefficient space becomes pointwise multiplication in the frequency domain.

Conceptually:

```text
A * B
  ↓ FFT
FFT(A * B) = FFT(A) · FFT(B)
```

Therefore:

```text
FFT(A)
FFT(B)
   ↓
pointwise multiply
   ↓
IFFT
   ↓
A * B
```

The transform changes the expensive all-pairs interaction into independent coordinate-wise products.

---

## 5. Why zero-padding is required

A linear convolution of lengths `n` and `m` has length

```text
n + m - 1
```

A discrete Fourier transform is inherently cyclic over its transform length. If the arrays are not padded sufficiently, coefficients wrap around and produce **cyclic convolution** instead of the desired linear convolution.

Choose a transform length `N` satisfying:

```text
N >= n + m - 1
```

For radix-2 FFT implementations, `N` is usually the next power of two.

---

## 6. Complex-number FFT

The classical FFT evaluates a polynomial at roots of unity using complex arithmetic.

For a sequence `a[0..N-1]`, the DFT evaluates:

\[
A_k = \sum_{j=0}^{N-1} a_j \omega_N^{jk},
\]

where `\omega_N` is an `N`-th root of unity.

The inverse transform reconstructs the coefficients.

A naive DFT costs `O(N²)`. FFT exploits symmetry recursively to reduce it to `O(N log N)`.

---

## 7. Cooley–Tukey decomposition

For a radix-2 transform, split coefficients into even and odd positions:

```text
A(x)
  = even terms
  + x * odd terms
```

The transform of the full sequence can then be assembled from the transforms of the two half-sized sequences.

This yields the recurrence:

\[
T(N)=2T(N/2)+O(N),
\]

so

\[
T(N)=O(N\log N).
\]

The important idea is divide-and-conquer over the evaluation problem, not the specific iterative implementation.

---

## 8. Iterative FFT engineering

A production-oriented iterative radix-2 FFT usually performs:

1. bit-reversal permutation;
2. length-2 butterflies;
3. length-4 butterflies;
4. larger butterfly stages up to `N`.

Typical butterfly:

```text
u = a[i]
v = a[j] * twiddle

a[i] = u + v
a[j] = u - v
```

The iterative form avoids recursion overhead and gives predictable memory access.

---

## 9. Numerical error in complex FFT

Complex FFT is floating-point arithmetic. The result should theoretically be integral for integer polynomial coefficients, but floating-point roundoff introduces small errors.

A common workflow is:

```text
compute FFT
multiply spectra
inverse FFT
round near-integers
```

This requires a tolerance strategy and careful testing.

For very large integer coefficients, naive rounding can become unsafe because accumulated numerical error may exceed half an integer unit.

---

## 10. NTT: exact transform modulo a prime

The **Number Theoretic Transform (NTT)** replaces complex roots of unity with roots of unity in a finite field.

For a suitable prime modulus `p`, an `N`-th primitive root of unity exists when:

\[
N \mid (p-1).
\]

Then the transform can be performed exactly modulo `p`.

There is no floating-point rounding error.

The trade-off is that the modulus must support the required transform length and coefficient arithmetic.

---

## 11. Primitive roots and supported lengths

For an NTT modulus:

```text
p = c * 2^k + 1
```

supports power-of-two transform lengths up to `2^k` when the chosen root has the required order.

For a transform of length `N`, choose a primitive `N`-th root from a primitive root of the field:

\[
g_N = g^{(p-1)/N} \pmod p.
\]

Implementation must validate:

- modulus primality or trusted modulus selection;
- maximum supported transform length;
- inverse root;
- modular inverse of `N`.

---

## 12. NTT butterfly

An NTT butterfly has the same structural form as FFT:

```text
u = a[i]
v = a[j] * w mod p

a[i] = (u + v) mod p
a[j] = (u - v) mod p
```

Only the arithmetic domain changed.

This is a useful recurring pattern:

> FFT and NTT share an algorithmic skeleton; their numeric foundations differ.

---

## 13. Inverse NTT

The inverse transform uses the inverse root of unity and multiplies every output by:

\[
N^{-1} \pmod p.
\]

For prime modulus `p`:

\[
N^{-1} = N^{p-2} \pmod p
\]

by Fermat's little theorem when `N` is nonzero modulo `p`.

A reliable implementation should keep forward and inverse conventions explicit rather than relying on hidden sign assumptions.

---

## 14. Convolution with NTT

The exact modular convolution pipeline is:

```text
choose N >= n + m - 1
pad a, b to N
NTT(a)
NTT(b)
for i: c[i] = a[i] * b[i] mod p
inverse NTT(c)
truncate to n + m - 1
```

Complexity:

```text
O(N log N)
```

modular operations, assuming the transform length is valid for the modulus.

---

## 15. JavaScript numeric safety for NTT

JavaScript `Number` represents integers exactly only up to `2^53 - 1`.

A modular multiplication such as

```text
a * b
```

can exceed that range even when `a` and `b` are each below the modulus.

Three common strategies are:

1. use `BigInt` for exact modular arithmetic;
2. choose a modulus small enough for safe multiplication under `Number` constraints;
3. use specialized multiplication techniques with proven bounds.

For a mastery implementation, build both a clear `BigInt` reference and a measured high-performance version.

---

## 16. FFT vs NTT

### Complex FFT

```text
Pros: flexible transform lengths; large practical ecosystem
Cons: floating-point error; rounding required
```

### NTT

```text
Pros: exact modular arithmetic; deterministic integer results
Cons: constrained moduli; multiple-modulus work may be required for large integers
```

The choice depends on the required output semantics, coefficient size, runtime environment, and available arithmetic.

---

## 17. Multiple NTT moduli and CRT

One NTT modulus may be insufficient to reconstruct exact integer coefficients.

A common strategy is:

```text
integer convolution
      ↓
NTT modulo p1
NTT modulo p2
NTT modulo p3
      ↓
Chinese Remainder Theorem
      ↓
reconstruct integer coefficient
```

The product of the moduli must exceed a proven bound on the true coefficient magnitude.

Without a coefficient bound, CRT reconstruction can produce an ambiguous residue representative.

---

## 18. Truncation inside polynomial DP

Suppose only coefficients through degree `K` are relevant.

After convolution, retain:

```text
0 ... K
```

and discard larger degrees.

This is especially important in DP because an otherwise fast convolution may create a much larger intermediate polynomial than the final problem needs.

The truncation is safe when future operations cannot move degree from above `K` back below `K`.

---

## 19. Tree DP + fast convolution

In tree knapsack, two child distributions may be merged repeatedly:

```text
parent = convolution(childA, childB)
```

If subtree capacities are large, naive merging can dominate runtime.

A transform-based merge can accelerate large child combinations, but only the largest merges usually justify the transform overhead.

This motivates hybrid policies:

```text
small × small  -> naive convolution
large × large  -> NTT/FFT
```

The crossover point should be benchmarked for the actual implementation.

---

## 20. Product of many polynomials

A DP may need:

\[
P(x)=P_1(x)P_2(x)\cdots P_m(x).
\]

Multiplying from left to right can be inefficient because intermediate degrees grow unevenly.

A better strategy is often a **product tree**:

```text
P1 P2 P3 P4 P5 P6 P7 P8
 \ /   \ /   \ /   \ /
  P12   P34   P56   P78
     \   /       \   /
      P1234      P5678
           \     /
             P
```

Balanced multiplication keeps the operands more similarly sized and can reduce total work.

---

## 21. Small-to-large polynomial merging

Tree-shaped DP often combines many child polynomials.

Useful engineering principle:

> Merge smaller representations into larger representations carefully, and avoid repeatedly rebuilding huge state from scratch.

The exact optimal strategy depends on degree distributions. A priority queue of polynomial sizes can approximate optimal pairwise multiplication order for independent factors.

This is closely related to optimal merge patterns.

---

## 22. Polynomial exponentiation

To compute:

\[
P(x)^k,
\]

use binary exponentiation:

```text
result = 1
base = P
while k > 0:
    if k is odd: result = multiply(result, base)
    base = multiply(base, base)
    truncate if safe
    k >>= 1
```

Each multiplication may use FFT or NTT.

This appears in repeated combinatorial composition and generating-function models.

---

## 23. Formal generating functions meet fast convolution

Lesson 33 introduced generating functions conceptually. Here the implementation bridge is:

```text
generating-function product
          ↓
polynomial convolution
          ↓
FFT / NTT
```

The mathematical representation remains a generating function; the algorithmic acceleration happens at the coefficient level.

Do not confuse the transform with the DP itself. FFT/NTT is an acceleration layer over a valid polynomial recurrence.

---

## 24. Batch polynomial DP

Suppose a recurrence repeatedly performs:

```text
next = base + convolution(kernel, current)
```

If the kernel is fixed, transform it once:

```text
K = FFT(kernel)
```

Then repeated transitions can use:

```text
FFT(current)
pointwise multiply by K
inverse FFT
```

The reuse strategy depends on whether the current vector changes every step and whether transforms can be combined or cached.

This can be much more efficient than reconstructing the same transform repeatedly.

---

## 25. Convolution theorem under other coefficient domains

The key requirement is not specifically complex numbers. The transform method relies on an algebra containing suitable roots of unity and invertible transform normalization.

NTT provides one exact finite-field realization.

For some algorithms, other transforms or algebraic domains may be possible, but the implementation must preserve the assumptions needed for inversion and pointwise multiplication.

Always document the coefficient ring or field.

---

## 26. Modulus and transform compatibility

Before calling NTT, check:

```text
N is supported by p
primitive root exists
N divides p - 1
```

A transform length can be numerically convenient yet mathematically unsupported.

A common production failure is selecting a familiar modulus but silently requesting a longer power-of-two transform than it supports.

Make this a runtime assertion.

---

## 27. Cyclic versus linear convolution tests

A high-value adversarial test is to use nonzero coefficients near both ends:

```text
A = [a0, 0, ..., an]
B = [b0, 0, ..., bm]
```

Without adequate zero-padding, the tail wraps into the beginning.

Your test suite should explicitly distinguish:

```text
linear convolution
cyclic convolution
```

and verify the requested semantics.

---

## 28. Numerical and algebraic correctness testing

For FFT:

- compare rounded results against naive convolution;
- test tiny and large coefficient ranges;
- test cancellation-sensitive inputs;
- measure maximum reconstruction error.

For NTT:

- compare against exact `BigInt` convolution modulo `p`;
- verify inverse-transform identity;
- test all-zero and one-hot vectors;
- test maximum supported lengths.

For both:

- random differential tests;
- metamorphic scaling tests;
- commutativity tests where applicable.

---

## 29. Complexity accounting

Let `N` be the chosen transform length.

A convolution costs approximately:

```text
2 forward transforms + 1 inverse transform + N pointwise products
```

so asymptotically:

\[
O(N\log N).
\]

Memory is typically:

\[
O(N)
\]

for in-place transforms, with additional buffers depending on implementation.

The true cost includes:

- modular multiplications;
- BigInt overhead if used;
- allocation/copying;
- cache locality;
- transform setup;
- repeated transforms across DP states.

---

## 30. When FFT/NTT is the wrong choice

Do not use a transform merely because it is asymptotically faster.

Prefer naive convolution when:

- degrees are small;
- one polynomial is tiny;
- only a few coefficients are needed;
- the transform setup dominates;
- the representation is sparse;
- exact arbitrary-precision integer output makes CRT expensive.

Hybrid algorithms are often better than a transform-only design.

---

## 31. Backend engineering applications

Fast convolution can support backend workloads involving large bounded distributions:

- combining many resource-allocation distributions;
- exact configuration counts;
- workload-size distributions;
- probabilistic aggregation over discrete outcomes;
- batched capacity planning models.

Production safeguards should include degree limits, memory budgets, cancellation/error detection for floating FFTs, and deterministic fallbacks.

---

## 32. AI engineering applications

Transform-accelerated polynomial DP can appear in structured systems that aggregate discrete distributions or constrained combinations:

- exact score-distribution models;
- structured decoding subproblems;
- combinatorial candidate counting;
- discrete resource allocation;
- bounded planning distributions.

The algorithm should remain deterministic and independently testable even if an AI system proposes recurrence structures or parameters.

---

## 33. Recognition checklist

When a DP repeatedly combines coefficient arrays, ask:

1. Is the transition exactly convolution?
2. Are degrees large enough for acceleration?
3. Is the coefficient domain modular, integer, or floating point?
4. Can I truncate degrees safely?
5. Is the transform length supported?
6. Can I reuse transformed kernels?
7. Should small merges use naive convolution?
8. Would a product tree reduce total work?
9. Do I need CRT for exact integer coefficients?
10. Have I retained a naive oracle?

---

## 34. Master pattern

```text
Derive correct polynomial DP
        ↓
Identify convolution transitions
        ↓
Keep naive reference implementation
        ↓
Bound/truncate degrees
        ↓
Choose FFT or NTT arithmetic
        ↓
Select valid transform length
        ↓
Transform → pointwise multiply → inverse transform
        ↓
Validate against exact/small oracle
        ↓
Use hybrid crossover and memory limits
        ↓
Benchmark real DP merge patterns
```

The deepest lesson is that FFT/NTT is not a magical replacement for DP. It is a specialized way to accelerate a very specific algebraic transition: **polynomial convolution**.
