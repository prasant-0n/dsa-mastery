# 02.12 — Analyzing Loops

## Learning Objective

Learn a systematic method for analyzing loops of every common shape: linear, logarithmic, nested, dependent, triangular, shrinking, expanding, two-pointer, multi-variable, conditional, and mixed loops.

The central rule is:

> **Never classify a loop from its syntax. Count how the loop variables evolve.**

---

# 1. The Loop-Analysis Model

For every loop, ask:

```text
1. What is the loop variable?
2. What is its initial value?
3. How does it change each iteration?
4. What condition ends the loop?
5. How many iterations are possible?
6. What work happens inside each iteration?
```

Then calculate:

```text
Total cost = iteration count × cost per iteration
```

For nested loops, analyze the inner loop as a function of the outer-loop state.

---

# 2. Constant-Step Loops

```js
for (let i = 0; i < n; i++) {
  work();
}
```

The variable changes by a constant amount:

```text
i → i + 1
```

Number of iterations:

```text
Θ(n)
```

The same remains true for:

```js
i += 2
i += 10
i += 1000
```

as long as the increment is a constant independent of `n`.

---

# 3. Multiplicative-Step Loops

```js
for (let i = 1; i < n; i *= 2) {
  work();
}
```

The variable changes by a constant factor:

```text
i → 2i
```

After `k` iterations:

```text
2ᵏ ≈ n
```

Therefore:

```text
k = Θ(log n)
```

This is the most important visual distinction:

```text
constant additive change → usually linear
constant multiplicative change → usually logarithmic
```

---

# 4. Division Loops

```js
let n = input;

while (n > 1) {
  n = Math.floor(n / 2);
}
```

The value repeatedly shrinks:

```text
n → n/2 → n/4 → n/8 → ...
```

Therefore:

```text
Θ(log n)
```

The exact base of the logarithm does not matter asymptotically when it is constant.

---

# 5. Additive Shrinking

Consider:

```js
let i = n;

while (i > 0) {
  i -= 3;
}
```

Approximately:

```text
n / 3
```

iterations.

Therefore:

```text
Θ(n)
```

Division by a constant is not logarithmic when the loop variable decreases by a constant amount each time.

---

# 6. Multiplicative Shrinking

```js
let i = n;

while (i > 1) {
  i = Math.floor(i / 3);
}
```

The value is divided by a constant factor.

Therefore:

```text
Θ(log n)
```

The same principle applies to multiplication by constants greater than one.

---

# 7. Linear Loop With Nonzero Starting Point

```js
for (let i = 5; i <= n; i++) {
  work();
}
```

Iterations are approximately:

```text
n - 4
```

which is:

```text
Θ(n)
```

Constant offsets do not change the asymptotic class.

---

# 8. Loop With a Variable Bound

```js
for (let i = 0; i < m; i++) {
  work();
}
```

The complexity is:

```text
Θ(m)
```

not necessarily `Θ(n)`.

Input parameters should reflect what actually controls the loop.

---

# 9. Nested Independent Loops

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    work();
  }
}
```

The inner loop runs `m` times for each of `n` outer iterations.

Therefore:

```text
Θ(nm)
```

---

# 10. Nested Loops With the Same Bound

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    work();
  }
}
```

Therefore:

```text
Θ(n²)
```

This is the special case of `Θ(nm)` where:

```text
m = n
```

---

# 11. Nested Linear × Logarithmic

```js
for (let i = 0; i < n; i++) {
  for (let j = 1; j < n; j *= 2) {
    work();
  }
}
```

Outer:

```text
Θ(n)
```

Inner:

```text
Θ(log n)
```

Total:

```text
Θ(n log n)
```

---

# 12. Nested Logarithmic Loops

```js
for (let i = 1; i < n; i *= 2) {
  for (let j = 1; j < m; j *= 2) {
    work();
  }
}
```

Total:

```text
Θ(log n · log m)
```

---

# 13. Triangular Loop

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

The inner count depends on `i`:

```text
0 + 1 + 2 + ... + (n - 1)
```

Therefore:

```text
Θ(n²)
```

The key is not “two loops.” It is the summation induced by the dependency.

---

# 14. Reverse Triangular Loop

```js
for (let i = 0; i < n; i++) {
  for (let j = i; j < n; j++) {
    work();
  }
}
```

Inner counts are:

```text
n, n-1, n-2, ..., 1
```

Therefore:

```text
Θ(n²)
```

---

# 15. Diagonal Exclusion

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (i !== j) work();
  }
}
```

There are:

```text
n²
```

possible pairs and exactly `n` excluded diagonal pairs.

Therefore:

```text
n² - n = Θ(n²)
```

A small exclusion does not change the asymptotic class.

---

# 16. Dependent Multiplicative Loop

Consider:

```js
for (let i = 1; i < n; i *= 2) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

The outer values are:

```text
1, 2, 4, 8, ..., n
```

The inner work is:

```text
1 + 2 + 4 + ... + n
```

This geometric sum is:

```text
Θ(n)
```

Therefore the whole algorithm is:

```text
Θ(n)
```

This is an important counterexample to the naive rule that nested loops must be quadratic.

---

# 17. Shrinking Inner Bound

```js
for (let i = 0; i < n; i++) {
  for (let j = n; j > i; j--) {
    work();
  }
}
```

Inner work is:

```text
n - i
```

Total:

```text
Σ(n - i)
```

which is:

```text
Θ(n²)
```

---

# 18. Outer Logarithmic, Inner Linear

```js
for (let i = 1; i < n; i *= 2) {
  for (let j = 0; j < n; j++) {
    work();
  }
}
```

Outer:

```text
Θ(log n)
```

Inner:

```text
Θ(n)
```

Total:

```text
Θ(n log n)
```

---

# 19. A Loop That Looks Quadratic but Is Linear

```js
let i = 0;
let j = 0;

while (i < n && j < n) {
  if (condition) i++;
  else j++;
}
```

Each iteration increments either `i` or `j`.

Neither variable can increment more than `n` times.

Therefore total iterations are at most:

```text
2n
```

and complexity is:

```text
Θ(n)
```

This is the classic two-pointer counting argument.

---

# 20. Two Pointers With Different Directions

```js
let left = 0;
let right = n - 1;

while (left < right) {
  left++;
  right--;
}
```

The interval shrinks by two positions per iteration.

Therefore:

```text
Θ(n)
```

The number of variables is irrelevant; what matters is total progress.

---

# 21. Multiple Variables With Different Rates

```js
let i = 0;
let j = 1;

while (i < n) {
  i++;
  j *= 2;
}
```

The loop terminates when `i` reaches `n`.

Therefore the loop executes:

```text
Θ(n)
```

The fact that `j` grows exponentially does not make the loop logarithmic because `i` controls termination.

Always identify the **termination-controlling variable**.

---

# 22. Variable Controls Termination

Consider:

```js
let i = 1;
let j = n;

while (i < j) {
  i *= 2;
}
```

The loop is controlled by:

```text
i *= 2
```

so:

```text
Θ(log n)
```

Now:

```js
let i = 1;
let j = n;

while (i < j) {
  j--;
}
```

The controlling variable decreases by one:

```text
Θ(n)
```

The key is the variable that determines termination.

---

# 23. Loop With Conditional Update

```js
let i = 0;

while (i < n) {
  if (condition) i += 2;
  else i += 1;
}
```

Every iteration advances `i` by at least one.

Therefore:

```text
iterations ≤ n
```

If the loop can repeatedly advance by one, the worst case is:

```text
Θ(n)
```

---

# 24. Conditional Update With Multiplication

```js
let i = 1;

while (i < n) {
  if (condition) i *= 2;
  else i += 1;
}
```

Worst-case analysis must consider a path where the algorithm repeatedly takes the slower update:

```text
i += 1
```

Therefore the worst-case time can be:

```text
Θ(n)
```

The presence of a logarithmic branch does not guarantee logarithmic worst-case complexity.

---

# 25. Nested Conditional Loops

```js
for (let i = 0; i < n; i++) {
  if (condition(i)) {
    for (let j = 0; j < n; j++) {
      work();
    }
  }
}
```

Worst case: the condition is true for every `i`.

Therefore:

```text
Θ(n²)
```

For average-case analysis, the probability that the condition is true must be modeled.

---

# 26. Loop With Break

```js
for (let i = 0; i < n; i++) {
  if (items[i] === target) break;
  work();
}
```

Best case:

```text
Θ(1)
```

Worst case:

```text
Θ(n)
```

The `break` changes the number of executed iterations but does not automatically change the worst-case class.

---

# 27. Nested Loop With Break

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (condition(i, j)) break;
    work();
  }
}
```

Best case can be:

```text
Θ(n)
```

if every inner loop exits immediately.

Worst case can remain:

```text
Θ(n²)
```

if every inner loop runs fully.

Case analysis is necessary.

---

# 28. Loop With `continue`

```js
for (let i = 0; i < n; i++) {
  if (skip(i)) continue;
  work();
}
```

The loop still executes `n` iterations.

Therefore the worst-case time is:

```text
Θ(n)
```

unless `skip()` or `work()` has a different complexity.

`continue` skips work; it does not automatically reduce the number of loop iterations.

---

# 29. Nested Loop With `continue`

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (skip(i, j)) continue;
    work();
  }
}
```

The worst case still permits:

```text
n²
```

inner iterations.

Therefore worst-case complexity remains:

```text
Θ(n²)
```

---

# 30. Loop With Data-Dependent Work

```js
for (const item of items) {
  process(item);
}
```

If:

```text
process(item) = O(f(item))
```

then total cost is:

```text
Σ f(item)
```

not necessarily simply `O(n)`.

This is important when per-item work varies with input size.

---

# 31. Nested Loop With Growing Inner Work

```js
for (let i = 1; i <= n; i++) {
  for (let j = 0; j < i * i; j++) {
    work();
  }
}
```

Total:

```text
Σ i²
```

Therefore:

```text
Θ(n³)
```

Always derive the inner bound before classifying the outer loop combination.

---

# 32. Harmonic Loop

```js
for (let i = 1; i <= n; i++) {
  for (let j = 0; j < n / i; j++) {
    work();
  }
}
```

Total work:

```text
n/1 + n/2 + n/3 + ... + n/n
```

Factor out `n`:

```text
n(1 + 1/2 + ... + 1/n)
```

The harmonic sum is `Θ(log n)`, so:

```text
Θ(n log n)
```

---

# 33. Logarithmic Outer Loop With Shrinking Inner Loop

```js
for (let i = 1; i <= n; i *= 2) {
  for (let j = i; j <= n; j *= 2) {
    work();
  }
}
```

For each outer value, the inner loop runs approximately:

```text
log(n / i)
```

Summing across logarithmic outer levels produces a quadratic logarithmic expression:

```text
Θ((log n)²)
```

This demonstrates why exact variable relationships matter.

---

# 34. Loop Bounds Based on Squares

```js
for (let i = 0; i * i < n; i++) {
  work();
}
```

The loop stops when:

```text
i² ≥ n
```

Therefore:

```text
i ≈ √n
```

and complexity is:

```text
Θ(√n)
```

Not every loop is limited to the standard classes `1, log n, n, n log n, n²`.

---

# 35. Loop Bounds Based on Powers

```js
for (let i = 1; i * i * i < n; i++) {
  work();
}
```

The loop stops around:

```text
i ≈ n^(1/3)
```

Therefore:

```text
Θ(n^(1/3))
```

The general principle is to solve the termination inequality.

---

# 36. Nested Square-Root Loop

```js
for (let i = 1; i * i < n; i++) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

Outer iterations:

```text
Θ(√n)
```

Inner work grows with `i`.

Total:

```text
Σ i, i = 1 ... √n
```

which is:

```text
Θ(n)
```

This is another example where nested loops do not imply `Θ(n²)`.

---

# 37. Mixed Additive and Multiplicative Updates

```js
let i = 1;

while (i < n) {
  if (i < 100) i++;
  else i *= 2;
}
```

The first part performs only a constant number of iterations.

After that, the variable doubles.

Therefore total complexity is:

```text
Θ(log n)
```

Constant-size phases should not dominate asymptotic analysis.

---

# 38. Phase-Based Loop Analysis

Consider an algorithm with:

```text
Phase A = Θ(n)
Phase B = Θ(n log n)
Phase C = Θ(n²)
```

Sequential total:

```text
Θ(n + n log n + n²)
```

Dominant term:

```text
Θ(n²)
```

Analyze each phase independently before combining them.

---

# 39. Loop + Expensive Operation

```js
for (let i = 0; i < n; i++) {
  items.sort(compare);
}
```

If sorting costs `Θ(n log n)` and happens `n` times:

```text
n × n log n
```

Therefore:

```text
Θ(n² log n)
```

The loop itself is not the complete complexity.

---

# 40. Loop + Hash Lookup

```js
for (const item of items) {
  if (set.has(item)) {
    work();
  }
}
```

Under expected constant-time hash lookup:

```text
n × O(1)
= O(n)
```

But the precise production analysis should state the assumptions around the hash structure.

---

# 41. Loop + Binary Search

```js
for (const target of targets) {
  binarySearch(sortedItems, target);
}
```

If:

```text
|targets| = m
|sortedItems| = n
```

then:

```text
Θ(m log n)
```

This is a common backend lookup pattern.

---

# 42. Loop + Database Query

```js
for (const user of users) {
  await loadPermissions(user.id);
}
```

If there are `n` users:

```text
n database operations
```

Even if each operation is treated as constant for a simplified model, the system performs `Θ(n)` network/database round trips.

In real backend engineering, this operation count can dominate CPU work.

---

# 43. Loop + Vector Similarity

Suppose:

```text
n candidates
```

and each similarity calculation costs:

```text
Θ(d)
```

for dimension `d`.

A simple loop therefore costs:

```text
Θ(nd)
```

If every pair of candidates is compared instead:

```text
Θ(n²d)
```

---

# 44. The “Looks Like O(n²)” Trap

Never reason:

```text
nested loop = O(n²)
```

without examining the bounds.

Examples:

```text
n × n           → Θ(n²)
n × log n       → Θ(n log n)
log n × log n   → Θ(log² n)
Σ 2ᶦ            → Θ(n)
Σ i             → Θ(n²)
Σ i²            → Θ(n³)
```

The iteration relationship determines the answer.

---

# 45. A Mechanical Loop-Analysis Algorithm

For each loop:

```text
STEP 1
Identify the controlling variable.

STEP 2
Write its values across iterations.

STEP 3
Determine whether the change is:
  + constant
  - constant
  × constant
  ÷ constant
  data-dependent

STEP 4
Solve the stopping condition.

STEP 5
Count the loop iterations.

STEP 6
Analyze the body.

STEP 7
For nesting, sum or multiply according to the dependency.

STEP 8
Combine sequential phases.

STEP 9
Simplify.
```

This procedure is more reliable than memorizing visual patterns.

---

# 46. Common Mistakes

## Mistake 1 — Every nested loop is O(n²)

False. Bounds may be logarithmic, dependent, or geometric.

## Mistake 2 — Every `i *= 2` loop is O(log n)

Only if `i` controls termination in the expected way.

## Mistake 3 — Ignoring the controlling variable

A second variable may change quickly but not control termination.

## Mistake 4 — Multiplying dependent loops blindly

Dependent bounds often require summations.

## Mistake 5 — Ignoring helper costs

The loop body may be expensive.

## Mistake 6 — Ignoring `break`

Early exit affects cases and iteration counts.

## Mistake 7 — Treating `continue` as loop termination

`continue` skips the current body but continues the loop.

## Mistake 8 — Collapsing `n` and `m`

Independent parameters should remain explicit.

## Mistake 9 — Ignoring I/O

Database and network operations can dominate production latency.

## Mistake 10 — Guessing from syntax

The correct answer comes from counting the actual evolution of state.

---

# 47. Interview Framework

When shown unfamiliar loops:

```text
1. Define input parameters.
2. Identify the controlling variable.
3. Write its sequence of values.
4. Determine iteration count.
5. Analyze the body.
6. Handle nested dependencies with sums.
7. Add sequential phases.
8. State assumptions.
9. Give time complexity.
10. Give auxiliary-space complexity.
```

Example:

```js
for (let i = 1; i < n; i *= 2) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

Strong explanation:

> The outer loop takes logarithmically many values: `1, 2, 4, ...`. The inner work at each level equals `i`, so total work is `1 + 2 + 4 + ... + n = Θ(n)`. Therefore the complete algorithm is Θ(n), not Θ(n log n) or Θ(n²).

---

# 48. Mastery Checklist

- [ ] Analyze constant-step loops.
- [ ] Analyze multiplicative-step loops.
- [ ] Analyze division loops.
- [ ] Identify the termination-controlling variable.
- [ ] Analyze independent nested loops.
- [ ] Analyze dependent nested loops.
- [ ] Derive triangular sums.
- [ ] Recognize geometric sums.
- [ ] Recognize harmonic sums.
- [ ] Analyze two-pointer loops.
- [ ] Handle `break` correctly.
- [ ] Handle `continue` correctly.
- [ ] Analyze conditional updates.
- [ ] Analyze square-root and other nonstandard bounds.
- [ ] Include helper-function complexity.
- [ ] Preserve multiple parameters.
- [ ] Include database/network operation counts.
- [ ] Analyze backend N+1 patterns.
- [ ] Analyze AI candidate/vector loops.
- [ ] Derive complexity mechanically instead of guessing.

---

# Key Takeaways

1. **A loop's syntax does not determine its complexity; variable evolution does.**
2. **Constant additive changes usually produce linear iteration counts.**
3. **Constant multiplicative changes usually produce logarithmic iteration counts.**
4. **Nested loops must be analyzed using their actual bounds and dependencies.**
5. **Dependent loops often require summations rather than blind multiplication.**
6. **Geometric sums can make a nested loop linear.**
7. **Two-pointer loops can contain multiple variables while remaining linear because total movement is bounded.**
8. **The termination-controlling variable is often the key to classifying a loop.**
9. **`break`, conditional updates, and data-dependent work require case-aware reasoning.**
10. **Helper functions, built-ins, database calls, network operations, and vector calculations must be included in the body cost.**
11. **A mechanical counting procedure is more reliable than memorizing “one loop = O(n)” or “two loops = O(n²).”**
