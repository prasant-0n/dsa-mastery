# 27 — Linear Recurrence, Matrix Exponentiation & Fast DP

> **Phase 17 — Dynamic Programming**

## 1. Why This Topic Matters

Many DPs repeatedly apply the same fixed transition. If the state transition is linear and the state dimension is small, the entire recurrence can be treated as an operator and exponentiated.

The central mental model is:

> **A fixed linear DP transition is an operator. A huge number of repeated steps can be compressed into logarithmically many operator compositions.**

This chapter connects linear recurrences, matrix exponentiation, fast doubling, companion matrices, transfer matrices, semiring-style transitions, polynomial recurrence acceleration, and large-horizon DP engineering.

---

## 2. From Recurrence to State Vector

For an order-`k` recurrence,

`x_n = c1*x_(n-1) + ... + ck*x_(n-k)`,

store enough history in a vector:

`v_n = [x_n, x_(n-1), ..., x_(n-k+1)]^T`.

There is a fixed matrix `T` such that:

`v_(n+1) = T*v_n`.

Therefore repeated DP becomes:

`v_n = T^(n-m)*v_m`.

The first task is always to prove that one matrix application is exactly one DP transition.

---

## 3. Fibonacci

For `F_n = F_(n-1) + F_(n-2)`, one valid column-vector convention is:

`[F_(n+1), F_n]^T = [[1,1],[1,0]] [F_n,F_(n-1)]^T`.

Binary exponentiation reduces repeated application from `O(n)` matrix steps to `O(log n)` matrix multiplications.

Fibonacci is the teaching example, not the whole technique.

---

## 4. Binary Matrix Exponentiation

For an associative matrix product:

```text
result = identity
base = A
while exponent > 0:
    if exponent is odd:
        result = result * base
    base = base * base
    exponent = floor(exponent / 2)
```

For dense `k × k` multiplication this is `O(k^3 log n)` time and `O(k^2)` matrix storage.

The exponentiation invariant is:

`result * base^remaining = A^originalExponent`.

---

## 5. Matrix Orientation Is Correctness

Two conventions are valid:

- column vectors: `v' = T*v`
- row vectors: `v' = v*T`

Never mix them.

Document:

1. state ordering;
2. vector orientation;
3. transition direction;
4. base state;
5. exponent offset;
6. output extraction index.

Test the first two or three transitions by hand before exponentiating.

---

## 6. Complexity Comparison

A fixed-order recurrence may cost `O(nk)` by ordinary DP.

Dense matrix exponentiation costs approximately `O(k^3 log n)`.

For constant `k`, the dependence on the horizon changes from linear to logarithmic.

For larger `k`, generic matrix multiplication may be too expensive. Specialized recurrence methods can reduce the matrix overhead.

---

## 7. Fast Doubling

Fibonacci admits identities that directly jump from `n` to `2n`:

`F_(2n) = F_n * (2F_(n+1) - F_n)`

`F_(2n+1) = F_n^2 + F_(n+1)^2`.

This gives `O(log n)` arithmetic operations with constant-sized state.

The lesson is broader:

> **Use the most specialized correct algebraic representation available.**

---

## 8. Companion Matrices

An order-`k` recurrence can be represented by a companion matrix whose first row contains the recurrence coefficients and whose lower rows shift the history.

This converts a scalar recurrence into a fixed-dimensional linear state machine.

The matrix must be derived from the chosen state convention rather than copied blindly.

---

## 9. Base-State Alignment

Matrix exponentiation does not eliminate base cases.

A reliable derivation is:

1. write the recurrence;
2. choose state ordering;
3. derive one transition;
4. verify it numerically on known states;
5. choose the base vector;
6. derive the exact exponent;
7. extract the requested component.

Most practical bugs occur in this alignment rather than in binary exponentiation itself.

---

## 10. Modular Arithmetic

Recurrence values can become enormous. With modulus `M`, reduce after arithmetic operations.

JavaScript's `Number` is exact only within its safe integer range. For exact large modular products, use `BigInt` or a mathematically justified bounded representation.

Do not mix `Number` and `BigInt` in arithmetic expressions.

Normalize subtraction consistently into `[0,M)`.

---

## 11. Matrix Multiplication Engineering

A production-quality multiplication routine should:

- validate dimensions;
- avoid unnecessary allocations;
- skip zero terms where beneficial;
- reduce modulo at controlled points;
- use `BigInt` consistently when required;
- avoid aliasing input/output matrices accidentally.

For small matrices, straightforward cubic multiplication is usually preferable to complicated optimization.

---

## 12. Matrix Exponentiation Beyond Arithmetic

The operator pattern can work over other algebraic structures when the operations provide the necessary associativity and identity.

Examples include:

- counting: `+ / *`
- reachability: `OR / AND`
- shortest path: `min / +`
- maximum score: `max / +`.

For min-plus multiplication:

`C[i][j] = min_k(A[i][k] + B[k][j])`.

Then matrix powers represent repeated fixed-length transitions.

Do not assume arbitrary operators form a valid matrix-exponentiation algebra.

---

## 13. Transfer Matrices

A finite-state transition system can be represented by a transfer matrix.

This is particularly useful when a structure repeats across a huge number of layers.

Connection to profile DP:

```text
profile state
    ↓
legal transitions
    ↓
weighted transition matrix
    ↓
matrix power
    ↓
huge repeated width/height
```

Thus matrix exponentiation can be viewed as an acceleration layer on top of a finite-state DP.

---

## 14. Sparse Operators

A one-step transition may be sparse, even though its powers become dense.

Use sparse representations when one-step application dominates and density remains low. Consider dense matrices after repeated squaring if that becomes cheaper.

This is an engineering decision based on actual density and operation counts, not a universal rule.

---

## 15. Operator Application Without Full Final Matrix

If only `T^n*v` is required, binary exponentiation can apply selected powers directly to the vector.

This avoids retaining an unnecessary final matrix, although powered matrices still need to be maintained during squaring.

For special recurrences, fast doubling or polynomial methods may eliminate most matrix overhead.

---

## 16. Characteristic Polynomial

An order-`k` recurrence has a characteristic polynomial of degree `k`.

The recurrence relation permits powers of the formal variable above degree `k-1` to be reduced to lower powers.

Conceptually:

```text
recurrence
   ↓
companion matrix
   ↓
matrix exponentiation
   ↓
characteristic polynomial
   ↓
polynomial reduction
```

This gives a route to recurrence-specific acceleration.

---

## 17. Kitamasa-Style Acceleration

For fixed-order recurrences, compute the coefficient representation of `x^n` modulo the recurrence polynomial.

A straightforward polynomial multiplication/reduction approach can reach roughly `O(k^2 log n)` time.

It is more specialized than matrices and therefore requires stronger algebraic discipline and testing.

Do not optimize to Kitamasa before the matrix model is proven correct.

---

## 18. Reconstruction

Fast exponentiation naturally computes a final state, not every intermediate decision.

If a path or action trace is required, consider:

- exponentiation decomposition trees;
- checkpointing;
- recursive reconstruction over time ranges;
- additional transition metadata;
- keeping ordinary DP when the horizon is moderate.

Fast value computation and witness reconstruction are separate requirements.

---

## 19. Periodicity and Cycles

A finite deterministic state machine may eventually repeat a state, creating a cycle. Under suitable finite-state conditions, cycle detection can compete with exponentiation.

Do not infer periodicity merely from observed repeated outputs.

Under modular arithmetic, numeric sequences can become periodic, but the period may be difficult to derive and can be much larger than expected.

---

## 20. Differential Testing

Use an ordinary DP as the oracle for small horizons.

Compare:

- naive recurrence;
- matrix exponentiation;
- fast doubling where applicable;
- polynomial acceleration where applicable.

Test every small `n`, not merely large random values.

Also verify matrix identities such as:

`A^0 = I` and `A^(a+b) = A^a*A^b`.

---

## 21. Adversarial Cases

Include:

- `n = 0`;
- `n = 1`;
- order `1` recurrences;
- zero coefficients;
- negative coefficients;
- modulus `1`;
- very large exponents;
- coefficients near the modulus;
- degenerate matrices;
- identity and zero transitions;
- exact values near `Number.MAX_SAFE_INTEGER`.

These expose state alignment and numeric bugs quickly.

---

## 22. Correctness Proof Template

A complete proof should establish:

### Claim 1 — Transition representation

One matrix application equals one recurrence step.

### Claim 2 — Matrix power

`T^r` equals exactly `r` repeated transitions.

### Claim 3 — Binary exponentiation

The exponentiation invariant preserves the desired power.

### Claim 4 — Extraction

The selected component of the final vector equals the requested DP value.

For specialized methods, prove their algebraic identities separately.

---

## 23. Backend Engineering Applications

Potential applications include:

- finite-state workflow simulation;
- repeated rate-limit state transitions;
- automaton-based event aggregation;
- long-horizon capacity models;
- stable batch forecasting recurrences;
- repeated deterministic configuration transitions.

Production systems should record the state dimension, arithmetic mode, exponent, transition version, and validation status.

A changing transition invalidates the single-fixed-matrix assumption unless the varying transitions can themselves be composed into a repeating operator.

---

## 24. AI Engineering Applications

Transfer operators can accelerate finite-state structured computation such as:

- weighted finite-state automata;
- repeated sequence transitions;
- constrained decoding abstractions;
- finite-state planning;
- repeated profile transitions.

This is an exact algorithmic technique for finite structured state spaces, not a replacement for general neural inference.

---

## 25. Interview Recognition Framework

For a huge-`n` recurrence, ask:

1. What is the recurrence order?
2. What is the minimum sufficient state?
3. Is the transition fixed?
4. Is it linear or otherwise closed under an associative operator?
5. Can I represent one step as a matrix/operator?
6. What is the exact base vector?
7. What exponent reaches the target?
8. Is matrix exponentiation sufficient, or is fast doubling/polynomial reduction better?
9. What arithmetic representation is safe?
10. How will I prove and test the result?

A strong solution explains the representation before writing the power loop.

---

## 26. Common Failure Modes

- wrong state ordering;
- wrong exponent offset;
- row/column convention mismatch;
- incorrect companion-matrix shift rows;
- extracting the wrong component;
- modular precision loss in JavaScript;
- mixing `Number` and `BigInt`;
- assuming time-varying transitions are one fixed matrix;
- using matrix exponentiation when the state dimension is too large;
- optimizing before establishing a brute-force oracle;
- claiming reconstruction without preserving enough information.

---

## 27. Master Pattern

```text
identify repeated fixed transition
        ↓
define minimum sufficient state
        ↓
derive one transition operator
        ↓
verify first few states
        ↓
choose base vector + exponent offset
        ↓
exponentiate operator
        ↓
extract target state
        ↓
validate against ordinary DP
        ↓
consider specialized acceleration
        ↓
audit numeric safety + reconstruction needs
```

The deepest lesson is:

> **Fast DP often comes from recognizing that repeated computation is repeated algebraic composition.**

---

## 28. Mastery Checklist

- [ ] Derive a recurrence state vector.
- [ ] Build a correct companion matrix.
- [ ] Implement matrix multiplication.
- [ ] Implement binary matrix exponentiation.
- [ ] Prove the exponentiation invariant.
- [ ] Implement Fibonacci by matrix power.
- [ ] Implement Fibonacci by fast doubling.
- [ ] Handle modular `BigInt` arithmetic safely.
- [ ] Implement an order-`k` recurrence engine.
- [ ] Understand transfer matrices.
- [ ] Understand min-plus / max-plus operator matrices.
- [ ] Compare sparse and dense operators.
- [ ] Understand characteristic-polynomial reduction.
- [ ] Implement a Kitamasa-style experiment.
- [ ] Test reconstruction limitations.
- [ ] Differential-test against naive DP.
- [ ] Build adversarial numeric tests.
- [ ] Prove every representation step.
- [ ] Complete backend and AI labs.
