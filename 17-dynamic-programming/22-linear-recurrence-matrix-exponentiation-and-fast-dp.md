# 22 — Linear Recurrence, Matrix Exponentiation & Fast DP

## 1. Why This Topic Matters

Many dynamic programs spend `O(n)` time because the state at step `i` depends on a fixed-size vector of previous states. When `n` becomes enormous, the recurrence itself is not the problem—the repeated application of the same transition is.

If a transition is linear and time-invariant, repeated DP steps can often be accelerated with exponentiation. Instead of applying a transition `n` times, represent it as an operator and compute its `n`th power using binary exponentiation.

This chapter connects:

- ordinary DP
- linear recurrences
- matrix multiplication
- binary exponentiation
- fast doubling
- companion matrices
- transfer matrices
- semiring-style DP
- polynomial recurrence acceleration
- backend and AI state-transition systems

The central mental model is:

> **A fixed linear DP transition is an operator. Large time horizons can be handled by exponentiating that operator.**

---

## 2. From DP to a State Transition

Suppose a DP maintains a vector

`v_t = [x_t, x_{t-1}, ..., x_{t-k+1}]ᵀ`.

For a fixed linear recurrence,

`x_t = c_1 x_{t-1} + c_2 x_{t-2} + ... + c_k x_{t-k}`.

The next state can be written as

`v_{t+1} = T v_t`.

Therefore,

`v_n = T^(n-m) v_m`.

The important shift is from:

> compute every intermediate DP state

to:

> compute the power of the transition operator directly.

This is useful only when the transition has the required algebraic structure. Arbitrary DP cannot automatically be matrix-exponentiated.

---

## 3. Fibonacci as the Canonical Example

For

`F_n = F_{n-1} + F_{n-2}`

use

`v_n = [F_n, F_{n-1}]ᵀ`.

Then

`v_{n+1} = [[1, 1], [1, 0]] v_n`.

Thus

`v_n = T^(n-1) v_1`.

The transition matrix is tiny, but the exponent may be huge. Binary exponentiation reduces the number of matrix powers from linear in `n` to logarithmic in `n`.

---

## 4. Matrix Representation

A matrix represents a linear transformation.

For matrices `A` and `B`, composition is:

`C = A × B`.

Matrix multiplication is associative:

`(A × B) × C = A × (B × C)`.

Associativity is the property that makes binary exponentiation possible.

For an identity matrix `I`:

`I × A = A × I = A`.

Exponentiation follows:

- `A^0 = I`
- `A^1 = A`
- `A^2 = A × A`
- `A^4 = A^2 × A^2`
- `A^8 = A^4 × A^4`

For odd exponents, multiply the accumulated result by the current power.

---

## 5. Binary Matrix Exponentiation

The standard algorithm is the same conceptual pattern as fast exponentiation for numbers.

```text
result = I
base = A
while exponent > 0:
    if exponent is odd:
        result = result × base
    base = base × base
    exponent = floor(exponent / 2)
```

For a dense `k × k` matrix with ordinary cubic multiplication:

`O(k³ log n)` time and `O(k²)` matrix storage.

If only a matrix-vector product is required after the power has been computed, avoid unnecessary full matrix work where possible.

---

## 6. Matrix Orientation Is Part of Correctness

Two common conventions are:

- column vectors: `v' = T v`
- row vectors: `v' = v T`

Both are valid. Mixing them is not.

Before implementing, explicitly document:

1. state-vector ordering
2. whether vectors are rows or columns
3. transition direction
4. exponent offset
5. base states

A large percentage of matrix-DP bugs are indexing/orientation errors rather than multiplication errors.

---

## 7. Complexity: What Actually Gets Faster?

For fixed recurrence order `k`, ordinary DP costs approximately:

`O(nk)`.

Matrix exponentiation costs approximately:

`O(k³ log n)`.

For constant `k`, this becomes effectively `O(log n)` in the horizon `n`.

However, the asymptotic comparison depends on `k` and the multiplication strategy. Matrix exponentiation is not automatically faster for small `n`.

Memory is generally `O(k²)` for dense matrices.

A matrix-vector multiplication is only `O(k²)`, so specialized recurrence methods can do substantially better than generic dense matrix exponentiation.

---

## 8. Fast Doubling for Fibonacci

Fibonacci has special identities:

`F_(2n) = F_n × (2F_(n+1) − F_n)`

and

`F_(2n+1) = F_n² + F_(n+1)²`.

These permit recursive or iterative doubling in `O(log n)` time while using constant-sized arithmetic state.

Fast doubling is an example of a broader principle:

> **Exploit algebraic structure before reaching for a general-purpose matrix.**

It is usually simpler and faster for Fibonacci than generic matrix multiplication.

---

## 9. General k-th Order Linear Recurrences

Consider:

`x_n = c_1 x_(n-1) + ... + c_k x_(n-k)`.

Build the companion transition:

```text
[c1 c2 c3 ... ck]
[ 1  0  0 ...  0]
[ 0  1  0 ...  0]
[ .  .  .      .]
[ 0  0  0 ...  1 0]
```

with the exact dimension/order determined by the chosen state convention.

The first row performs the recurrence; the shifted rows move previous values through the state.

This converts a scalar recurrence into a fixed-dimensional state transition.

---

## 10. Base-State Alignment

Matrix exponentiation does not remove the need to define initial conditions correctly.

For a recurrence of order `k`, you need enough initial values to determine the future.

A reliable workflow is:

1. write the recurrence
2. choose the state ordering
3. derive one transition by hand
4. test the transition on the first few known states
5. determine the exponent offset
6. only then implement fast power.

Never guess the exponent from the final formula.

---

## 11. Modular Arithmetic

Large recurrence values grow exponentially in many problems, so competitive and production algorithmic tasks often request a modulus.

For modulus `M`:

`(a + b) mod M`

and

`(a × b) mod M`

can be performed at every operation.

Normalize negative coefficients consistently:

`((x % M) + M) % M`.

In JavaScript, `Number` is exact for integers only within its safe-integer range. For large products or arbitrary exactness, use `BigInt` and be explicit about conversions.

Do not silently mix `Number` and `BigInt` in arithmetic.

---

## 12. Safe Modular Multiplication in JavaScript

A multiplication such as

`a * b`

can lose integer precision when values approach the `Number` safe-integer boundary, even if the final result is reduced modulo `M`.

For exact modular arithmetic, options include:

- `BigInt`
- a carefully bounded numeric modulus
- specialized multiplication techniques when the environment requires them.

The simplest correctness-first implementation in JavaScript is usually `BigInt`.

Benchmark before optimizing away from exact arithmetic.

---

## 13. Matrix Exponentiation Over Other Algebras

The matrix pattern is broader than ordinary arithmetic.

Depending on the algebra, matrix-like composition can model:

- counting: addition/multiplication
- reachability: OR/AND
- shortest paths: min/plus
- maximum-score paths: max/plus

This is often described through semiring-like structures.

The abstraction requires appropriate associative composition and identity behavior. Do not assume every operation pair forms a valid matrix-exponentiation algebra merely because it has two binary operators.

For min-plus matrices, for example:

`C[i][j] = min_k(A[i][k] + B[k][j])`.

Powers then represent repeated fixed-length transitions.

---

## 14. Transfer Matrices

A transfer matrix describes transitions between a finite set of states.

If one step has transition matrix `T`, then `T^n` represents `n` repeated steps.

This connects directly to earlier profile DP:

- profile = compressed frontier state
- transition graph = legal next profiles
- transfer matrix = weighted transition operator
- exponentiation = jump across many repeated layers.

This is especially useful when a narrow-width structure repeats for a huge number of rows/columns.

---

## 15. Sparse Transition Operators

A dense `k × k` matrix has `k²` entries, but many state-transition systems are sparse.

Examples:

- automata
- graph transitions
- finite-state workflows
- profile transitions
- small planning models.

If a transition has few outgoing edges, sparse representations can reduce the cost of applying one step.

But repeated squaring tends to densify matrices. Therefore, the right representation can change as powers grow.

This creates an engineering tradeoff:

> sparse one-step representation vs dense powered representation.

Measure actual density and operation counts instead of assuming sparse is always superior.

---

## 16. Repeated Operator Application

Sometimes you do not need `T^n` explicitly.

If the task is only:

`v_n = T^n v_0`,

you can exponentiate the operator while applying selected powers directly to the vector.

For example:

```text
while n > 0:
    if n is odd:
        v = T × v
    T = T × T
    n >>= 1
```

This can save storage for the final result matrix, although powered matrices still need to be maintained.

For specialized recurrences, polynomial methods can reduce this further.

---

## 17. Characteristic Polynomial Intuition

A k-th order linear recurrence has a characteristic polynomial such as

`p(x) = x^k − c_1 x^(k-1) − ... − c_k`.

The recurrence means sufficiently high powers of `x` can be reduced using the recurrence coefficients.

This gives another route to computing `x^n` modulo the recurrence polynomial and extracting the coefficient combination needed for `x_n`.

The conceptual progression is:

```text
naive recurrence
    ↓
state vector
    ↓
companion matrix
    ↓
matrix exponentiation
    ↓
polynomial reduction / recurrence-specific acceleration
```

---

## 18. Kitamasa-Style Polynomial Reduction

For a fixed-order recurrence, one can represent

`x^n`

as a linear combination of lower powers modulo the characteristic recurrence.

Repeated polynomial multiplication followed by reduction can compute the coefficient vector for very large `n`.

This can achieve roughly `O(k² log n)` time with a straightforward polynomial reduction implementation, with further optimizations possible.

This method is more specialized and easier to implement incorrectly than matrix exponentiation. Learn the algebra before optimizing the implementation.

---

## 19. Reconstruction Limitations

Ordinary DP often stores choices to reconstruct a path or sequence.

Matrix exponentiation primarily computes the final transformed state. It does not naturally preserve every intermediate decision.

If reconstruction is required, consider:

- storing additional transition metadata
- recursive decomposition of the exponent
- checkpointing
- reconstructing only a requested segment
- keeping the original DP when the horizon is moderate.

Fast evaluation and full trace reconstruction are different requirements.

---

## 20. Periodicity and Cycles

Finite-state systems may eventually repeat, especially under a finite modulus.

Cycle detection can sometimes replace exponentiation, but only when a finite state space and deterministic transition guarantee the needed repetition.

Do not infer periodicity merely because outputs look repetitive.

For a deterministic state transition over a finite state set, repeated states imply a cycle. For huge numeric states or non-deterministic systems, different reasoning is required.

---

## 21. Correctness Proof Template

A robust proof has several layers.

### Matrix representation

Prove that one matrix application produces exactly one recurrence transition.

### Exponentiation

Prove binary exponentiation maintains:

`result × base^remaining = A^originalExponent`.

### Extraction

Prove that the desired scalar is located at the documented position of the final state vector.

### Specialized optimization

For fast doubling or polynomial reduction, prove each algebraic identity and show that the transformed state remains equivalent to the original recurrence.

---

## 22. Testing Strategy

Use multiple independent oracles.

### Small brute force

Compute the recurrence directly for small `n`.

### Differential testing

Compare:

- naive DP
- matrix exponentiation
- fast doubling where applicable
- recurrence-specific acceleration.

### Metamorphic tests

Check known recurrence identities and consistency between adjacent states.

### Algebraic tests

Verify:

- `A^0 = I`
- `A^1 = A`
- `A^(a+b) = A^a A^b`
- `A^(2a) = A^a A^a`.

### Numeric adversarial tests

Include:

- `n = 0`
- `n = 1`
- modulus `1`
- negative coefficients
- very large exponents
- coefficients near the modulus
- zero coefficients
- recurrence order `1`
- degenerate transitions.

---

## 23. JavaScript Engineering

For a serious implementation:

- use `BigInt` where exact large integer arithmetic is required
- avoid accidental `Number`/`BigInt` mixing
- normalize modular values
- validate matrix dimensions
- keep matrix multiplication allocation-conscious
- avoid recursion for huge exponent depth when iteration is simpler
- separate mathematical logic from I/O
- benchmark dense vs specialized implementations.

For large matrices, allocation and cache behavior can matter as much as the asymptotic formula.

---

## 24. Backend Engineering Applications

Linear recurrence acceleration appears in systems where a state evolves repeatedly under a stable transition model.

Potential applications include:

- batch forecasting models with fixed recurrence rules
- repeated capacity or inventory transitions
- finite-state workflow simulation
- repeated rate-limit state transitions
- automaton-based event aggregation
- long-horizon deterministic simulations.

The key engineering question is not “Can this be a matrix?” but:

> Is the transition fixed, finite-dimensional, associative under composition, and worth accelerating?

For dynamic production rules, ordinary simulation may be safer because the transition operator changes over time.

---

## 25. AI Engineering Applications

The same structure appears in finite-state AI models:

- weighted finite-state automata
- repeated transition scoring
- constrained sequence models
- finite-horizon planning abstractions
- state-transition aggregation.

Transfer matrices can count or score paths through a finite state graph. Matrix powers can summarize repeated identical transition layers.

For general neural networks, this technique does not replace model inference. It applies when the relevant computation has a stable algebraic finite-state structure.

---

## 26. Interview Reasoning Framework

When given a huge-`n` recurrence:

1. Write the recurrence exactly.
2. Identify recurrence order `k`.
3. List the minimum initial state.
4. Build one explicit transition.
5. Choose row/column orientation.
6. Determine the exponent offset.
7. Estimate naive complexity.
8. Ask whether the transition is fixed and linear.
9. Choose matrix exponentiation or a specialized identity.
10. Decide `Number` vs `BigInt`/modular arithmetic.
11. Test the first few states against brute force.
12. State the correctness invariant.
13. State the complexity in terms of `k` and `log n`.

A strong interview answer explains *why* exponentiation is valid rather than merely reciting Fibonacci code.

---

## 27. Common Failure Modes

### Failure 1 — Wrong state order
The matrix is internally consistent but represents a different recurrence.

### Failure 2 — Wrong exponent
The transition is correct but starts from the wrong base state.

### Failure 3 — Row/column mismatch
Multiplication direction is reversed.

### Failure 4 — Numeric overflow
Intermediate products lose precision before modulo reduction.

### Failure 5 — Premature specialization
Kitamasa or custom algebra is introduced before proving the simpler matrix model.

### Failure 6 — Assuming time invariance
A transition that changes at every step cannot be represented by one fixed matrix without augmenting the state.

### Failure 7 — Overlooking sparse structure
A generic dense implementation may waste substantial work.

### Failure 8 — Confusing acceleration with reconstruction
Computing the final state quickly does not automatically recover the complete sequence of decisions.

---

## 28. Master Pattern

```text
DP recurrence
    ↓
identify finite sufficient state
    ↓
express one step as a fixed operator
    ↓
prove operator composition is associative
    ↓
choose representation
    ├── generic matrix
    ├── sparse transition
    ├── specialized doubling
    └── recurrence polynomial
    ↓
exponentiate / compose in O(log n) stages
    ↓
validate against naive DP
    ↓
optimize arithmetic and memory only after correctness
```

The deepest lesson is:

> **Fast DP is often about recognizing repeated structure in the transition, not optimizing the loop that performs it.**

---

## 29. Mastery Checklist

Before considering this topic mastered, you should be able to:

- [ ] derive a transition matrix from a recurrence
- [ ] explain why binary exponentiation works
- [ ] implement matrix multiplication safely
- [ ] implement matrix power
- [ ] solve Fibonacci with matrix exponentiation
- [ ] derive and implement fast doubling
- [ ] build a companion matrix for a k-order recurrence
- [ ] reason about modular arithmetic and `BigInt`
- [ ] distinguish matrix-vector from matrix-matrix costs
- [ ] recognize transfer-matrix opportunities
- [ ] explain sparse vs dense transitions
- [ ] understand semiring-style matrix DP
- [ ] explain why reconstruction is different
- [ ] understand characteristic-polynomial reduction
- [ ] implement a Kitamasa-style method
- [ ] prove correctness with invariants
- [ ] differential-test optimized recurrence solvers
- [ ] identify when matrix exponentiation is not applicable
- [ ] connect repeated-state DP to backend and AI systems.
