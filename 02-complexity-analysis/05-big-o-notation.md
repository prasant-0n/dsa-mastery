# 02.5 — Big-O Notation

## Learning Objective

Understand **Big-O notation as a formal language for describing asymptotic upper bounds**, rather than treating it as a list of labels to memorize.

By the end of this chapter you should be able to derive Big-O from a cost function, prove simple upper bounds, simplify expressions correctly, distinguish an algorithm's actual complexity from a valid but loose upper bound, and use Big-O meaningfully in backend and AI engineering.

> **Big-O describes an asymptotic upper bound. It does not mean “exactly this many operations.”**

---

## 1. Why Big-O Exists

Suppose an algorithm performs:

```text
T(n) = 7n² + 20n + 100
```

The exact expression contains implementation-specific details.

For large `n`, the `n²` term dominates the growth.

We summarize that growth as:

```text
O(n²)
```

Big-O lets us compare scalability without depending on every constant or lower-order term.

---

## 2. Formal Definition

A function `f(n)` is:

```text
O(g(n))
```

if there exist positive constants `c` and `n₀` such that:

```text
0 ≤ f(n) ≤ c · g(n)
```

for every:

```text
n ≥ n₀
```

In plain language:

> After some sufficiently large input size, `f(n)` is bounded above by a constant multiple of `g(n)`.

The constants do not need to be exactly known.

---

## 3. The Important Parts of the Definition

There are three important ideas.

### Constant factor

`c` may scale `g(n)`.

### Threshold

The relationship only needs to hold after some `n₀`.

### Upper bound

Big-O gives an asymptotic upper bound.

Therefore, if:

```text
f(n) = n
```

then all of these are technically valid:

```text
O(n)
O(n²)
O(n³)
```

because `n` is eventually bounded by each of those larger functions.

But `O(n)` is the **tightest standard growth description** among them.

---

## 4. Big-O Is Not an Exact Count

If an algorithm performs:

```text
3n + 10
```

operations, saying:

```text
O(n)
```

does not mean it performs exactly `n` operations.

It means its growth is bounded by a constant multiple of a linear function for sufficiently large `n`.

This distinction prevents one of the most common misunderstandings of Big-O.

---

## 5. Big-O and Dominant Terms

Suppose:

```text
T(n) = 5n³ + 100n² + 900n + 7
```

As `n` grows:

```text
n³
```

eventually dominates:

```text
n², n, 1
```

Therefore:

```text
T(n) = O(n³)
```

### Simplification rule

For ordinary polynomial-style expressions:

1. Ignore constant coefficients.
2. Keep the fastest-growing term.
3. Ignore lower-order terms.

But do this **after** deriving the total cost.

---

## 6. Removing Constant Factors

Consider:

```text
T(n) = 50n
```

Then:

```text
T(n) = O(n)
```

The `50` affects real execution time, but not the asymptotic growth class.

Similarly:

```text
1000n → O(n)
```

and:

```text
0.001n → O(n)
```

This is why Big-O is excellent for scalability comparisons but insufficient for complete performance engineering.

---

## 7. Removing Lower-Order Terms

Consider:

```text
T(n) = n² + n
```

For large `n`, the quadratic term dominates.

Therefore:

```text
O(n² + n) = O(n²)
```

Likewise:

```text
n³ + n² + n + 1
→ O(n³)
```

---

## 8. Addition Rule

If an algorithm performs two sequential stages:

```text
T₁(n) = O(f(n))
T₂(n) = O(g(n))
```

then:

```text
T(n) = O(f(n) + g(n))
```

Example:

```text
O(n) + O(n²)
= O(n + n²)
= O(n²)
```

The faster-growing term dominates.

---

## 9. Multiplication Rule

If one operation is repeated `n` times and each operation costs `O(n)`:

```text
n × O(n)
= O(n²)
```

Example:

```js
for (let i = 0; i < n; i++) {
  linearWork();
}
```

If:

```text
linearWork() = O(n)
```

then:

```text
Time = O(n²)
```

---

## 10. Big-O of Common Growth Classes

A useful ordering is:

```text
O(1)
  <
O(log n)
  <
O(n)
  <
O(n log n)
  <
O(n²)
  <
O(n³)
  <
O(2ⁿ)
  <
O(n!)
```

This means that, asymptotically, each class grows faster than the classes to its left.

The ordering becomes a powerful mental model for feasibility.

---

## 11. Big-O and Feasibility

Suppose two algorithms solve the same problem:

```text
A = O(n)
B = O(n²)
```

For small `n`, either might be acceptable.

As `n` becomes large, the quadratic algorithm's work grows much faster.

This is why complexity analysis is useful before implementation: it can eliminate an approach that cannot scale.

---

## 12. Tightness Matters

Suppose:

```text
T(n) = n
```

Technically:

```text
T(n) = O(n²)
```

is true.

But reporting `O(n²)` hides useful information.

When discussing an algorithm's complexity, normally report the **tightest useful asymptotic upper bound** you can justify.

For this function:

```text
O(n)
```

is the appropriate description.

Later we will formally distinguish Big-O from Big-Ω and Big-Θ.

---

## 13. Big-O Proof Example

Show that:

```text
f(n) = 3n + 5
```

is:

```text
O(n)
```

We need constants `c` and `n₀` such that:

```text
3n + 5 ≤ c n
```

For `n ≥ 1`:

```text
5 ≤ 5n
```

Therefore:

```text
3n + 5 ≤ 8n
```

Choose:

```text
c = 8
n₀ = 1
```

Thus:

```text
3n + 5 = O(n)
```

The point is not the specific constant `8`; many valid constants could work.

---

## 14. Another Proof Example

Show:

```text
f(n) = n² + 3n + 10
```

is:

```text
O(n²)
```

For `n ≥ 1`:

```text
n ≤ n²
1 ≤ n²
```

Therefore:

```text
n² + 3n + 10
≤ n² + 3n² + 10n²
= 14n²
```

Choose:

```text
c = 14
n₀ = 1
```

Hence:

```text
n² + 3n + 10 = O(n²)
```

---

## 15. Big-O of Logarithmic Functions

Suppose:

```text
T(n) = 4 log n + 20
```

The constant multiplier and additive constant do not change the growth class:

```text
O(log n)
```

Likewise:

```text
7 log₂ n + 100
→ O(log n)
```

---

## 16. Different Log Bases

Using the change-of-base relationship:

```text
logₐ n = log_b n / log_b a
```

The denominator is a constant when the bases are fixed.

Therefore:

```text
O(log₂ n)
= O(log₁₀ n)
= O(ln n)
```

The base can matter for implementation details, but not for the usual asymptotic classification.

---

## 17. Big-O for Multiple Parameters

Suppose:

```text
T(n, m) = n + m
```

The correct description is:

```text
O(n + m)
```

Do not automatically replace it with:

```text
O(n)
```

unless a problem constraint justifies treating `m` as bounded by or proportional to `n`.

Likewise:

```text
T(n, m) = nm
→ O(nm)
```

This precision matters in real systems where dimensions can scale independently.

---

## 18. Big-O of `max` Expressions

Suppose:

```text
T(n, m) = n + m
```

It is also true that:

```text
n + m = O(max(n, m))
```

because:

```text
n ≤ max(n,m)
m ≤ max(n,m)
```

so:

```text
n + m ≤ 2 max(n,m)
```

Both forms can be useful:

```text
O(n + m)
```

preserves the independent parameters, while:

```text
O(max(n,m))
```

emphasizes the dominant dimension.

---

## 19. Big-O of Products

If:

```text
T(n,m) = 3nm + n + m
```

and both dimensions can grow independently, the dominant term is:

```text
nm
```

Therefore:

```text
O(nm)
```

Do not turn it into `O(n²)` without an assumption connecting `n` and `m`.

---

## 20. Big-O for Code

Example:

```js
function countPairs(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      count++;
    }
  }

  return count;
}
```

Let:

```text
n = numbers.length
```

Outer loop:

```text
n
```

Inner loop for each outer iteration:

```text
n
```

Total:

```text
n × n = n²
```

Therefore:

```text
O(n²)
```

---

## 21. Big-O for Conditional Code

Consider:

```js
function example(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  for (const number of numbers) {
    console.log(number);
  }

  return numbers.length;
}
```

The conditional check is `O(1)`.

The loop is `O(n)`.

Total:

```text
O(1) + O(n)
= O(n)
```

Constant setup does not change the asymptotic class.

---

## 22. Big-O and Branches

Consider:

```js
if (condition) {
  linearWork();
} else {
  quadraticWork();
}
```

If one branch is `O(n)` and the other `O(n²)`, the worst-case upper bound is:

```text
O(n²)
```

For more precise analysis, distinguish best-case, worst-case, or branch-dependent behavior when appropriate.

---

## 23. Big-O and Early Return

Consider:

```js
function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}
```

The loop may stop early.

Best case:

```text
O(1)
```

Worst case:

```text
O(n)
```

A statement like:

```text
O(n)
```

usually communicates the worst-case upper bound unless the context specifies another case.

---

## 24. Big-O Does Not Tell You Everything

Two algorithms can both be:

```text
O(n)
```

while having very different practical performance.

For example:

```text
Algorithm A: 2n operations
Algorithm B: 500n operations
```

Both are `O(n)`, but A may be dramatically faster.

Other practical factors include:

- cache locality
- branch prediction
- allocation
- garbage collection
- vectorization
- I/O
- network latency
- database access
- synchronization
- implementation language/runtime

Big-O is a powerful abstraction, not a complete performance model.

---

## 25. Big-O and Amortized Complexity

Some operations are occasionally expensive but cheap on average over a sequence under an amortized analysis.

For example, a dynamic array may occasionally resize and copy many elements.

An individual resize can cost `O(n)`, while append operations can have `O(1)` amortized complexity under geometric growth.

Do not confuse:

```text
worst-case cost of one operation
```

with:

```text
amortized cost over a sequence
```

We will analyze amortized complexity formally later in Phase 02.

---

## 26. Big-O and Expected Complexity

Hash-table operations are often described as expected `O(1)` under standard assumptions.

This is different from a deterministic worst-case guarantee.

Similarly, randomized algorithms may have expected or high-probability bounds.

Therefore, a mature complexity statement includes the model when necessary:

```text
Expected O(1)
Worst-case O(n)
```

rather than blindly writing:

```text
O(1)
```

---

## 27. Backend Example — Request Work

Suppose an endpoint processes `n` records and performs:

```text
O(n)
```

local processing plus:

```text
n database calls
```

If each database call has significant latency, saying only:

```text
O(n)
```

hides the important production bottleneck.

The asymptotic request count is linear, but the **cost per external operation** may dominate end-to-end latency.

Algorithmic engineering therefore combines asymptotic reasoning with a resource-aware cost model.

---

## 28. Backend Example — Rate Limiting

Suppose a rate limiter checks a key using an expected `O(1)` Map operation:

```js
if (limits.has(clientId)) {
  // ...
}
```

The lookup is expected constant time with respect to the number of tracked clients.

But memory grows with the number of retained keys:

```text
Space = O(C)
```

where `C` is the number of tracked clients.

Complexity must therefore be analyzed across both time and space.

---

## 29. AI Example — Candidate Reduction

Suppose a retrieval system starts with:

```text
N = corpus size
```

and reduces it to:

```text
K = candidate count
```

before expensive reranking.

If reranking is linear:

```text
O(K)
```

rather than:

```text
O(N)
```

If pairwise candidate comparisons are needed:

```text
O(K²)
```

The reduction from `N` to `K` can therefore be algorithmically significant.

---

## 30. Big-O and Algorithm Selection

A disciplined selection process is:

```text
1. Define workload parameters.
2. Derive candidate algorithms.
3. Derive time complexity.
4. Derive space complexity.
5. Compare against constraints.
6. Consider worst/expected/amortized behavior.
7. Consider expensive external resources.
8. Benchmark realistic implementations.
```

Big-O is one component of the decision, not the entire decision.

---

## 31. Common Big-O Mistakes

### Mistake 1 — Saying Big-O means exact runtime

It describes asymptotic growth/upper bounding, not milliseconds.

### Mistake 2 — Thinking Big-O means “worst case” by definition

Big-O is an upper-bound notation. Worst-case analysis is a separate dimension.

### Mistake 3 — Dropping parameters without justification

`O(n + m)` should not automatically become `O(n)`.

### Mistake 4 — Counting source lines

Count execution frequency.

### Mistake 5 — Assuming nested syntax determines complexity

Analyze actual iteration relationships.

### Mistake 6 — Ignoring helper functions

Expand their cost.

### Mistake 7 — Reporting a deliberately loose bound

If you can justify `O(n)`, don't report `O(n²)` merely because it is technically true.

### Mistake 8 — Treating every O(1) as equally fast

Constants and implementation details still matter in production.

### Mistake 9 — Forgetting assumptions

Expected hash-table complexity, amortized dynamic-array behavior, and randomized bounds depend on their analysis models.

---

## 32. Interview Framework

When asked:

> “What is the Big-O?”

Use:

> **1. Define the input-size parameter.**
>
> **2. Identify the dominant operation.**
>
> **3. Count how many times it executes.**
>
> **4. Build the total cost.**
>
> **5. Remove constants and lower-order terms.**
>
> **6. State the resulting asymptotic upper bound.**
>
> **7. Mention expected/amortized assumptions if relevant.**

Example:

> “For `n` elements, the outer loop executes `n` times and the inner loop executes `n` times per outer iteration, so the total work is `n²`. Therefore the algorithm is O(n²) time. The bound is based on the standard RAM-style operation model.”

---

## 33. Mastery Checklist

You should be able to:

- [ ] Explain what Big-O means formally.
- [ ] Explain Big-O in plain language.
- [ ] Distinguish upper bounds from exact operation counts.
- [ ] Remove constant factors correctly.
- [ ] Remove lower-order terms correctly.
- [ ] Add sequential complexity terms.
- [ ] Multiply repeated work correctly.
- [ ] Compare common growth classes.
- [ ] Explain why `O(n²)` is technically a valid bound for `O(n)` but not tight.
- [ ] Handle multiple input parameters.
- [ ] Analyze branches and early returns.
- [ ] State assumptions behind expected/amortized complexity.
- [ ] Explain why Big-O is not a complete performance model.
- [ ] Apply Big-O reasoning to backend workloads.
- [ ] Apply Big-O reasoning to AI retrieval pipelines.
- [ ] Prove simple Big-O bounds using constants and thresholds.

---

## Key Takeaways

1. **Big-O is an asymptotic upper-bound notation.**
2. **It does not mean exact runtime or exact operation count.**
3. **Constants and lower-order terms are ignored in the asymptotic class.**
4. **Derive the total cost before simplifying it.**
5. **The tightest useful bound is normally the best way to communicate complexity.**
6. **Independent parameters should remain explicit unless constraints justify combining them.**
7. **Big-O is not synonymous with worst-case analysis.**
8. **Expected and amortized bounds require their own assumptions.**
9. **Big-O describes scalability, while production performance also depends on constants and system resources.**
10. **Expert complexity analysis means being able to justify the bound, not merely name it.**
