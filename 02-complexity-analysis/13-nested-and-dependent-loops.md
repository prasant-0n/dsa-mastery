# 02.13 — Nested & Dependent Loops

## Learning Objective

Learn to analyze nested loops whose iteration counts depend on one another, including triangular, shrinking, geometric, harmonic, logarithmic, polynomial, and mixed-bound patterns.

The central rule:

> **Nested loops do not automatically mean multiplication. First determine whether the inner bound depends on the outer state.**

---

# 1. Independent vs Dependent Nesting

### Independent

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    work();
  }
}
```

Every outer iteration runs the same inner workload:

```text
T(n,m) = n × m
      = Θ(nm)
```

### Dependent

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

The inner workload changes with `i`:

```text
T(n) = Σ i
```

Therefore:

```text
Θ(n²)
```

The dependency determines the analysis method.

---

# 2. Why “Nested = n²” Is Wrong

Consider:

```js
for (let i = 1; i < n; i *= 2) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

The outer loop has:

```text
log n
```

iterations.

But the inner work is:

```text
1 + 2 + 4 + ... + n
```

which is:

```text
Θ(n)
```

So the complete algorithm is:

```text
Θ(n)
```

This is why visual loop counting is unreliable.

---

# 3. The General Summation Model

For a dependent nested loop:

```js
for (let i = 1; i <= n; i++) {
  for (let j = 0; j < f(i); j++) {
    work();
  }
}
```

write:

```text
T(n) = Σ f(i)
```

Then simplify the sum.

Common examples:

```text
f(i) = 1      → Θ(n)
f(i) = i      → Θ(n²)
f(i) = i²     → Θ(n³)
f(i) = n/i    → Θ(n log n)
f(i) = 2ⁱ     → Θ(2ⁿ)
```

---

# 4. Triangular Growth

```js
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= i; j++) {
    work();
  }
}
```

Total:

```text
1 + 2 + ... + n
```

Therefore:

```text
n(n + 1)/2 = Θ(n²)
```

Geometrically, the loop visits roughly half of an `n × n` matrix.

---

# 5. Reverse Triangle

```js
for (let i = 1; i <= n; i++) {
  for (let j = i; j <= n; j++) {
    work();
  }
}
```

Total:

```text
n + (n-1) + ... + 1
```

Again:

```text
Θ(n²)
```

Different bounds can generate the same asymptotic class.

---

# 6. Triangular Matrix Interpretation

Suppose an algorithm processes only pairs where:

```text
j > i
```

The number of pairs is:

```text
n(n-1)/2
```

This is `Θ(n²)`.

This pattern appears in:

- pairwise comparisons
- duplicate checks
- all-pairs similarity
- collision detection
- graph edge generation

---

# 7. Excluding the Diagonal

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (i !== j) work();
  }
}
```

There are:

```text
n² - n
```

valid non-diagonal pairs.

Therefore:

```text
Θ(n²)
```

Removing `n` cases from `n²` does not change the dominant growth.

---

# 8. Cubic Dependent Loop

```js
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= i; j++) {
    for (let k = 1; k <= j; k++) {
      work();
    }
  }
}
```

The work is:

```text
Σᵢ Σⱼ j
```

The inner sum contributes approximately:

```text
Θ(i²)
```

and summing across `i` gives:

```text
Θ(n³)
```

This is a nested dependency chain.

---

# 9. Polynomial Inner Bounds

Consider:

```js
for (let i = 1; i <= n; i++) {
  for (let j = 0; j < i²; j++) {
    work();
  }
}
```

Total:

```text
Σ i²
```

Since:

```text
Σ i² = Θ(n³)
```

we get:

```text
Θ(n³)
```

General pattern:

```text
Σ iᵖ = Θ(nᵖ⁺¹)
```

for fixed nonnegative integer `p`.

---

# 10. Geometric Dependent Loop

```js
for (let i = 1; i <= n; i *= 2) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

Total:

```text
1 + 2 + 4 + ... + n
```

The geometric sum is dominated by its final term:

```text
Θ(n)
```

Therefore:

```text
Θ(n)
```

---

# 11. Geometric Growth With a Different Base

```js
for (let i = 1; i <= n; i *= 3) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

Total:

```text
1 + 3 + 9 + ... + n
```

Again:

```text
Θ(n)
```

The constant base changes constants, not the asymptotic result.

---

# 12. Harmonic Dependency

```js
for (let i = 1; i <= n; i++) {
  for (let j = 0; j < n / i; j++) {
    work();
  }
}
```

Total:

```text
Σ n/i
```

Factor out `n`:

```text
n Σ 1/i
```

Since the harmonic sum is `Θ(log n)`:

```text
Θ(n log n)
```

---

# 13. Harmonic Dependency With Floor

```js
for (let i = 1; i <= n; i++) {
  for (let j = 0; j < Math.floor(n / i); j++) {
    work();
  }
}
```

The floor changes individual counts but not the asymptotic result:

```text
Θ(n log n)
```

Asymptotic analysis often tolerates bounded rounding differences.

---

# 14. Logarithmic Outer, Linear Inner

```js
for (let i = 1; i <= n; i *= 2) {
  for (let j = 0; j < n; j++) {
    work();
  }
}
```

The inner workload is independent of `i`:

```text
n
```

and the outer loop runs:

```text
log n
```

times.

Therefore:

```text
Θ(n log n)
```

---

# 15. Logarithmic Outer, Shrinking Inner

```js
for (let i = 1; i <= n; i *= 2) {
  for (let j = i; j <= n; j *= 2) {
    work();
  }
}
```

At outer value `i`, inner iterations are approximately:

```text
log(n/i)
```

Let outer levels be:

```text
i = 2ᵏ
```

Then inner work is approximately:

```text
log n - k
```

Summing across `Θ(log n)` levels gives:

```text
Θ((log n)²)
```

This is a useful advanced pattern.

---

# 16. Square-Root Dependent Bound

```js
for (let i = 1; i * i <= n; i++) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

Outer bound:

```text
i ≤ √n
```

Inner work:

```text
Θ(i)
```

Total:

```text
Σᵢ₌₁^√n i
= Θ(n)
```

Again, nesting does not imply quadratic complexity.

---

# 17. Root-Based Nested Bounds

Consider:

```js
for (let i = 1; i * i < n; i++) {
  for (let j = 0; j * j < i; j++) {
    work();
  }
}
```

Outer iterations:

```text
Θ(√n)
```

Inner iterations:

```text
Θ(√i)
```

Total:

```text
Σ √i
```

up to `√n`.

Using:

```text
Σᵢ₌₁ᵐ √i = Θ(m^(3/2))
```

with:

```text
m = √n
```

we get:

```text
Θ(n^(3/4))
```

This illustrates why solving bounds explicitly matters.

---

# 18. Loop Bounds Based on the Outer Variable

Whenever you see:

```js
for (let i = ... ) {
  for (let j = 0; j < f(i); j++) {
```

immediately write:

```text
Σ f(i)
```

This simple transformation converts code into mathematics.

Examples:

```text
j < i       → Σ i
j < i²      → Σ i²
j < n/i     → Σ n/i
j < 2ⁱ      → Σ 2ⁱ
```

---

# 19. Sequential Nested Blocks

Suppose:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) work();
}

for (let i = 0; i < n; i++) {
  for (let j = 1; j < n; j *= 2) work();
}
```

First block:

```text
Θ(n²)
```

Second block:

```text
Θ(n log n)
```

Total:

```text
Θ(n² + n log n)
= Θ(n²)
```

Sequential blocks add.

---

# 20. Nested vs Sequential: A Critical Distinction

These are different:

### Sequential

```js
for (...) {}
for (...) {}
```

Costs add.

### Nested

```js
for (...) {
  for (...) {}
}
```

Costs interact through repeated execution.

But even nested loops require dependency analysis before multiplying.

---

# 21. Dependent Two-Pointer Loops

```js
let i = 0;
let j = n - 1;

while (i < j) {
  if (condition) i++;
  else j--;
}
```

Although two state variables change, each iteration permanently reduces the remaining search interval.

At most:

```text
n - 1
```

increments/decrements are needed in total.

Therefore:

```text
Θ(n)
```

This is dependency in state, not nested iteration.

---

# 22. Nested Search With Early Break

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (found(i, j)) break;
    work();
  }
}
```

Best case:

```text
Θ(n)
```

if every inner loop exits immediately.

Worst case:

```text
Θ(n²)
```

if no inner loop exits early.

The `break` changes case behavior, not necessarily the worst-case class.

---

# 23. Dependent Loop With Early Termination

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {
    if (condition(i, j)) break;
    work();
  }
}
```

Worst case still permits the complete triangular workload:

```text
Σ i = Θ(n²)
```

Average behavior depends on the probability and location of termination.

---

# 24. Multiple Dependent Parameters

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m - i; j++) {
    work();
  }
}
```

The exact valid range depends on the relationship between `n` and `m`.

For example, if `m ≥ n`:

```text
Σ(m - i)
= nm - Θ(n²)
```

so the bound is:

```text
Θ(nm)
```

under suitable parameter relationships.

Do not simplify multi-parameter expressions without stating those relationships.

---

# 25. Min/Max-Dependent Bounds

Consider:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < Math.min(i, m); j++) {
    work();
  }
}
```

The complexity depends on the relationship between `n` and `m`.

A safe expression is:

```text
Θ(Σ min(i,m))
```

For large enough `n` relative to `m`, this becomes approximately:

```text
Θ(nm)
```

plus lower-order terms.

This is why piecewise reasoning can be necessary.

---

# 26. Piecewise Complexity

Some algorithms genuinely have different asymptotic behavior under different parameter relationships.

For example:

```text
if m ≥ n:
    Θ(nm)

if m < n:
    another bound may dominate
```

A rigorous analysis should not force every problem into a single expression when the constraints define meaningful regimes.

---

# 27. Nested Loop With Data-Dependent Bound

```js
for (const item of items) {
  for (let j = 0; j < item.count; j++) {
    work();
  }
}
```

Total work is:

```text
Σ item.count
```

not automatically `Θ(n²)`.

If each `item.count ≤ m`, then:

```text
O(nm)
```

If the sum of counts is known to be `M`, then:

```text
Θ(M)
```

This is often much more precise.

---

# 28. Backend Example — N+1 Query Pattern

Suppose each of `n` users triggers a query that loads `m` records on average.

The database interaction shape may be:

```text
n requests
×
per-request work
```

If each query returns `m` records and processing each record costs constant time:

```text
Θ(nm)
```

But the number of round trips is still:

```text
Θ(n)
```

These are separate dimensions of system cost.

---

# 29. Backend Example — Pagination

Suppose an endpoint loops through pages until all `N` records are processed, with page size `P`.

Number of pages:

```text
Θ(N/P)
```

If each page requires one network/database request:

```text
Θ(N/P)
```

round trips.

Changing `P` changes the computational and operational trade-off.

---

# 30. Backend Example — Pairwise Validation

If a service compares every pair of `n` entities:

```text
n(n - 1)/2
```

comparisons.

Therefore:

```text
Θ(n²)
```

At scale, replacing pairwise comparison with hashing, indexing, sorting, or partitioning may change the computational structure.

---

# 31. AI Example — Pairwise Similarity

For `n` embeddings with dimension `d`, comparing every pair requires:

```text
Θ(n²)
```

pairs.

Each vector similarity may cost:

```text
Θ(d)
```

Therefore:

```text
Θ(n²d)
```

This is a classic combinatorial bottleneck in naive retrieval or clustering pipelines.

---

# 32. AI Example — Candidate × Feature Processing

Suppose:

```text
k candidates
f features per candidate
```

and every feature is processed once:

```text
Θ(kf)
```

If `f` itself grows with another parameter, preserve it:

```text
Θ(kfd)
```

when appropriate.

The general lesson is to model the dimensions of the workload explicitly.

---

# 33. Common Mistakes

## Mistake 1 — Nested loops automatically mean O(n²)

False.

## Mistake 2 — Multiplying dependent bounds

A dependent inner bound often requires a summation.

## Mistake 3 — Ignoring geometric sums

`1 + 2 + 4 + ... + n` is `Θ(n)`, not `Θ(n log n)`.

## Mistake 4 — Ignoring harmonic sums

`n + n/2 + ... + 1` is `Θ(n log n)`.

## Mistake 5 — Ignoring parameter relationships

`n`, `m`, and `d` may represent independent dimensions.

## Mistake 6 — Ignoring early exits

Case analysis may change substantially.

## Mistake 7 — Treating database operations as CPU operations

Count network/database round trips separately when they matter.

## Mistake 8 — Assuming output size is irrelevant

If an algorithm must emit `Θ(n²)` results, it cannot run in `o(n²)` time while explicitly producing them.

---

# 34. Expert Workflow

For every nested loop:

```text
1. Name all input parameters.
2. Identify the outer variable sequence.
3. Express inner iterations as a function of the outer state.
4. Decide whether the inner bound is independent or dependent.
5. If independent → multiply.
6. If dependent → write a summation.
7. Simplify using known sums.
8. Account for conditional/break behavior.
9. Include body/helper/I/O cost.
10. Preserve multiple parameters.
11. State assumptions and relevant cases.
```

This workflow should become automatic.

---

# 35. Interview Framework

When asked to analyze nested loops, avoid:

> “There are two loops, so O(n²).”

Instead say:

> “The inner loop runs `f(i)` times for each outer iteration, so total work is `Σ f(i)`. Evaluating that sum gives the final bound.”

For example:

```js
for (let i = 1; i <= n; i *= 2) {
  for (let j = 0; j < i; j++) work();
}
```

Answer:

> “The outer values are powers of two. The total inner work is `1 + 2 + 4 + ... + n`, a geometric sum dominated by its final term, so the total is Θ(n).”

That demonstrates reasoning rather than pattern memorization.

---

# 36. Mastery Checklist

- [ ] Distinguish independent and dependent nested loops.
- [ ] Convert dependent loops into summations.
- [ ] Analyze triangular sums.
- [ ] Analyze polynomial sums.
- [ ] Analyze geometric sums.
- [ ] Analyze harmonic sums.
- [ ] Analyze logarithmic nesting.
- [ ] Analyze root-based bounds.
- [ ] Handle early exits in nested loops.
- [ ] Preserve multiple parameters.
- [ ] Recognize piecewise parameter relationships.
- [ ] Analyze data-dependent inner work.
- [ ] Distinguish sequential from nested blocks.
- [ ] Analyze two-pointer state movement separately from nesting.
- [ ] Include helper-function cost.
- [ ] Include database/network operation counts.
- [ ] Apply nested-loop reasoning to backend workloads.
- [ ] Apply nested-loop reasoning to AI vector/candidate workloads.
- [ ] Avoid “nested loop = O(n²)” reasoning.
- [ ] Explain the mathematical derivation in interviews.

---

# Key Takeaways

1. **Nested loops require bound analysis, not visual classification.**
2. **Independent loops can often be multiplied; dependent loops often require summations.**
3. **Triangular sums commonly produce Θ(n²).**
4. **Polynomial inner bounds can produce higher polynomial complexity.**
5. **Geometric dependent loops can produce only Θ(n) total work.**
6. **Harmonic dependencies commonly produce Θ(n log n).**
7. **Multiple parameters and their relationships must be preserved.**
8. **Early exits change best/average behavior but may leave worst-case complexity unchanged.**
9. **Backend nested work includes database/network round trips, not merely JavaScript operations.**
10. **AI pairwise workloads commonly expose `Θ(n²d)` computational structure.**
11. **The expert skill is converting loop evolution into mathematics and then simplifying the mathematics.**
