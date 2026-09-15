# 02.6 — Big-Ω and Big-Θ

## Learning Objective

Learn to distinguish **upper bounds, lower bounds, and tight asymptotic bounds**.

By the end of this chapter you should be able to:

- explain Big-O, Big-Ω, and Big-Θ precisely;
- derive lower bounds for simple algorithms;
- recognize when a complexity is tightly bounded;
- avoid confusing worst-case analysis with Big-O notation itself;
- use asymptotic bounds to reason about algorithm limits and optimality.

---

# 1. Three Important Asymptotic Notations

The three core notations are:

```text
O(g(n))   → asymptotic upper bound
Ω(g(n))   → asymptotic lower bound
Θ(g(n))   → asymptotically tight bound
```

Think of them as three different questions:

```text
O   → How large can the growth be?
Ω   → How small can the growth be?
Θ   → What growth class does it actually match?
```

---

# 2. Big-O — Upper Bound

We learned that:

```text
f(n) = O(g(n))
```

means there exist constants `c > 0` and `n₀` such that:

```text
0 ≤ f(n) ≤ c · g(n)
```

for every:

```text
n ≥ n₀
```

Big-O therefore describes an asymptotic **upper bound**.

Example:

```text
f(n) = 3n + 5
```

is:

```text
O(n)
```

---

# 3. Big-Ω — Lower Bound

Big-Ω reverses the direction.

```text
f(n) = Ω(g(n))
```

means there exist constants `c > 0` and `n₀` such that:

```text
0 ≤ c · g(n) ≤ f(n)
```

for every:

```text
n ≥ n₀
```

In plain language:

> `f(n)` eventually grows at least as fast as a constant multiple of `g(n)`.

---

# 4. Big-Ω Example

Consider:

```text
f(n) = 3n + 5
```

We can show:

```text
f(n) = Ω(n)
```

For every `n ≥ 1`:

```text
3n + 5 ≥ 3n
```

Choose:

```text
c = 3
n₀ = 1
```

Therefore:

```text
3n + 5 = Ω(n)
```

---

# 5. Big-Θ — Tight Bound

Big-Θ means the function is bounded both above and below by the same asymptotic growth class.

```text
f(n) = Θ(g(n))
```

means there exist positive constants `c₁`, `c₂`, and `n₀` such that:

```text
0 ≤ c₁g(n) ≤ f(n) ≤ c₂g(n)
```

for every:

```text
n ≥ n₀
```

Therefore:

```text
Θ(g(n))
```

is a **tight asymptotic bound**.

---

# 6. Why Θ Is Powerful

Suppose:

```text
f(n) = 7n + 20
```

We can establish:

```text
f(n) = O(n)
```

and:

```text
f(n) = Ω(n)
```

Together:

```text
f(n) = Θ(n)
```

This says the function genuinely grows linearly up to constant factors.

---

# 7. Relationship Between O, Ω, and Θ

A useful mental model:

```text
             Upper bound
                  │
                  ▼
               O(g(n))
                  ▲
                  │
            Θ(g(n))
                  │
                  ▼
               Ω(g(n))
                  │
                  ▼
             Lower bound
```

More precisely:

```text
Θ(g(n)) = O(g(n)) ∩ Ω(g(n))
```

A tight bound requires both directions.

---

# 8. Proving Θ

To prove:

```text
f(n) = Θ(g(n))
```

you need two proofs:

### Upper bound

Show:

```text
f(n) = O(g(n))
```

### Lower bound

Show:

```text
f(n) = Ω(g(n))
```

Then conclude:

```text
f(n) = Θ(g(n))
```

---

# 9. Θ Proof Example

Prove:

```text
f(n) = n² + 3n + 10
```

is:

```text
Θ(n²)
```

## Upper bound

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

So:

```text
f(n) = O(n²)
```

## Lower bound

For every positive `n`:

```text
n² + 3n + 10 ≥ n²
```

Therefore:

```text
f(n) = Ω(n²)
```

Both hold:

```text
f(n) = Θ(n²)
```

---

# 10. A Common Confusion

Consider:

```text
f(n) = n
```

These statements are all technically true:

```text
f(n) = O(n)
f(n) = O(n²)
f(n) = O(n³)
```

But only:

```text
Θ(n)
```

captures its tight growth class among these choices.

Similarly:

```text
f(n) = Ω(1)
f(n) = Ω(log n)
f(n) = Ω(n)
```

are all true.

The tight lower bound is:

```text
Ω(n)
```

Together:

```text
Θ(n)
```

---

# 11. O Does Not Mean Θ

This distinction is fundamental.

If:

```text
f(n) = Θ(n)
```

then it is also true that:

```text
f(n) = O(n²)
```

But that does **not** mean:

```text
f(n) = Θ(n²)
```

A loose upper bound is not a tight bound.

---

# 12. Ω Does Not Mean Best Case

Another common mistake:

> “Ω means best case.”

That is false.

`Ω` describes a mathematical lower bound.

Best-case, average-case, and worst-case describe **which input cases are being analyzed**.

These are separate concepts.

For example, an algorithm can have:

```text
Worst-case time: Θ(n)
Best-case time: Θ(1)
```

Its worst-case function can still have an Ω lower bound of `n`.

---

# 13. O Does Not Automatically Mean Worst Case

Likewise:

> “Big-O means worst case.”

That is an oversimplification.

Big-O means upper bound.

You can analyze different functions under different cases:

```text
Best-case T_best(n) = O(1)
Worst-case T_worst(n) = O(n)
```

In algorithm interviews, when someone casually asks for “the Big-O,” they often expect the worst-case upper bound, but that is a convention of context—not the definition of Big-O.

---

# 14. Best, Average, and Worst Case + Asymptotic Notation

These are two separate dimensions.

### Dimension 1 — Input-case model

```text
Best case
Average case
Worst case
Expected case
Amortized sequence
```

### Dimension 2 — Asymptotic notation

```text
O
Ω
Θ
```

You can combine them.

Example:

```text
Worst-case time = O(n)
Best-case time = Θ(1)
Expected time = Θ(log n)
```

The notation and case model answer different questions.

---

# 15. Example — Linear Search

Consider:

```js
function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}
```

Let:

```text
n = numbers.length
```

## Best case

Target is first:

```text
Θ(1)
```

## Worst case

Target is absent or last:

```text
Θ(n)
```

Therefore:

```text
Worst-case = Θ(n)
```

and consequently:

```text
Worst-case = O(n)
Worst-case = Ω(n)
```

The tight statement is:

```text
Worst-case = Θ(n)
```

---

# 16. Why Lower Bounds Matter

An upper bound says:

> “This algorithm can be done within this growth rate.”

A lower bound says:

> “Under this model, you cannot do better than this growth rate for the stated problem.”

This becomes crucial when deciding whether an algorithm is merely good or asymptotically optimal.

For example, if a problem has an established lower bound:

```text
Ω(n)
```

and your algorithm runs in:

```text
Θ(n)
```

then your algorithm is asymptotically optimal in that model.

---

# 17. Algorithm Bound vs Problem Lower Bound

Be careful with two different statements.

### Algorithm bound

```text
This implementation runs in Θ(n).
```

### Problem lower bound

```text
Every algorithm in this computational model requires Ω(n).
```

The second statement is much stronger.

It concerns the problem itself under specified assumptions, not just one implementation.

---

# 18. Example — Finding a Maximum

Given an unsorted array of `n` elements, any comparison-based algorithm that must guarantee the maximum generally needs to inspect every element.

Why?

If one element is never inspected, there can be another valid input differing only at that position where that element is the maximum.

Therefore:

```text
Problem lower bound = Ω(n)
```

A simple scan takes:

```text
Θ(n)
```

So the scan is asymptotically optimal for this model.

---

# 19. Example — Binary Search

For sorted data with random access, binary search repeatedly halves the remaining search space.

The search requires:

```text
Θ(log n)
```

comparisons in the worst case up to constant-factor conventions.

Thus:

```text
O(log n)
Ω(log n)
Θ(log n)
```

for the corresponding worst-case comparison count.

---

# 20. Example — Comparison Sorting

For comparison-based sorting, there is a fundamental lower bound:

```text
Ω(n log n)
```

in the standard comparison model.

Algorithms such as Merge Sort and Heap Sort achieve:

```text
Θ(n log n)
```

worst-case time.

Therefore they match the comparison-sorting lower bound asymptotically.

This is an important example of:

```text
problem lower bound
        +
algorithm upper bound
        ↓
optimal Θ bound
```

The proof of the sorting lower bound will be studied more deeply in Phase 01's lower-bound material and revisited here as complexity analysis.

---

# 21. Constants Still Exist

Suppose:

```text
A(n) = 100n
B(n) = n²
```

Asymptotically:

```text
A = Θ(n)
B = Θ(n²)
```

For sufficiently large `n`, the linear algorithm eventually wins in growth.

But for small or moderate `n`, the constant factor can matter.

For example:

```text
100n < n²
```

when:

```text
n > 100
```

This illustrates why asymptotic notation should not be confused with practical runtime for a particular workload.

---

# 22. Θ and Exact Growth Class

A useful intuition is:

```text
O → ceiling
Ω → floor
Θ → narrow asymptotic band
```

If:

```text
c₁g(n) ≤ f(n) ≤ c₂g(n)
```

then `f(n)` and `g(n)` grow at the same asymptotic rate.

That is what makes Θ especially useful when communicating algorithm complexity.

---

# 23. Composition Examples

Suppose:

```text
T(n) = 4n² + 3n + 100
```

Then:

```text
T(n) = O(n²)
T(n) = Ω(n²)
T(n) = Θ(n²)
```

Now consider:

```text
T(n) = n log n + n
```

Then:

```text
T(n) = Θ(n log n)
```

because `n log n` eventually dominates `n`.

---

# 24. Multiple Parameters

Suppose:

```text
T(n,m) = n + m
```

A tight description is:

```text
Θ(n + m)
```

You should not automatically write:

```text
Θ(n)
```

unless the relationship between `n` and `m` is constrained.

Likewise:

```text
T(n,m) = nm + n + m
```

is:

```text
Θ(nm)
```

when `n` and `m` grow independently in the usual positive-domain model.

---

# 25. Code Example — Triangular Loop

```js
function triangular(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }

  return count;
}
```

The inner loop runs:

```text
0 + 1 + 2 + ... + (n - 1)
```

times.

The sum is:

```text
n(n - 1) / 2
```

which expands to:

```text
(n² - n) / 2
```

Therefore:

```text
T(n) = Θ(n²)
```

and consequently:

```text
T(n) = O(n²)
T(n) = Ω(n²)
```

---

# 26. Backend Engineering Interpretation

Suppose a service processes `n` records with a single pass.

If every record must be inspected:

```text
Time = Ω(n)
```

If your implementation performs one constant amount of work per record:

```text
Time = O(n)
```

Together:

```text
Time = Θ(n)
```

This is more informative than merely saying `O(n)` because it communicates that the implementation is linear and that the workload itself requires linear inspection under the model.

---

# 27. Backend Example — Pagination

Suppose an API returns `k` records.

Even an otherwise efficient implementation must spend at least enough work to produce the output.

A basic output-sensitive lower bound is:

```text
Ω(k)
```

If the endpoint performs constant work per returned item and no additional larger workload dominates:

```text
Θ(k)
```

This is one reason output size should be included in real complexity models.

---

# 28. AI Engineering Interpretation

Suppose a retrieval stage evaluates `N` candidates and computes a constant-cost score for each:

```text
Time = Θ(N)
```

If the system reduces candidates to `K` before an expensive reranker:

```text
Reranking = Θ(K)
```

If pairwise candidate interaction is required:

```text
Θ(K²)
```

Lower bounds help ask a different question:

> Is the expensive work unavoidable, or is it caused by the chosen representation or retrieval strategy?

That question is central to algorithmic engineering for AI systems.

---

# 29. A Critical Distinction: Algorithm vs Problem

When you say:

```text
Algorithm A = Θ(n log n)
```

you are characterizing that algorithm's growth.

When you say:

```text
The problem requires Ω(n log n)
```

you are claiming something about every algorithm within a specified model.

Do not interchange these statements.

A problem lower-bound proof can establish that an entire class of algorithms cannot asymptotically beat a certain rate.

---

# 30. Asymptotic Optimality

An algorithm is asymptotically optimal when its upper bound matches a proven problem lower bound.

Example:

```text
Problem lower bound = Ω(n)
Algorithm = O(n)
```

Therefore:

```text
Algorithm = Θ(n)
```

and it is asymptotically optimal under that model.

This does **not** mean it is automatically the fastest implementation in practice.

Constants, memory behavior, I/O, hardware, and workload shape can still matter.

---

# 31. Common Mistakes

## Mistake 1 — “Ω means best case”

False. Ω is a lower-bound notation.

## Mistake 2 — “O means worst case”

False as a definition. O is an upper bound.

## Mistake 3 — “O(n²) means the algorithm is quadratic”

Not necessarily. `O(n²)` may be a loose upper bound for a linear algorithm.

## Mistake 4 — “If an algorithm is O(n), it is also Θ(n)”

Not from O alone. You need a matching Ω(n) lower bound for that function.

## Mistake 5 — Confusing problem and algorithm bounds

An algorithm's complexity and a problem's lower bound are different claims.

## Mistake 6 — Ignoring the computational model

Lower bounds depend on what operations the model permits.

## Mistake 7 — Assuming asymptotic optimality means practical optimality

It does not.

## Mistake 8 — Dropping independent parameters

Preserve `n`, `m`, `k`, etc. unless constraints justify simplification.

---

# 32. Interview Framework

When asked to explain `O`, `Ω`, and `Θ`:

> **Big-O is an asymptotic upper bound. Big-Ω is an asymptotic lower bound. Big-Θ is a tight asymptotic bound because the function is bounded above and below by the same growth class.**

Example:

```text
T(n) = 3n² + 5n + 10
```

Then:

```text
T(n) = O(n²)
T(n) = Ω(n²)
T(n) = Θ(n²)
```

A strong interview explanation should also clarify that best/worst/average case and O/Ω/Θ are different dimensions.

---

# 33. Mastery Checklist

- [ ] Define Big-O formally.
- [ ] Define Big-Ω formally.
- [ ] Define Big-Θ formally.
- [ ] Explain upper vs lower vs tight bounds.
- [ ] Prove a simple Ω bound.
- [ ] Prove a simple O bound.
- [ ] Combine both to prove Θ.
- [ ] Explain why O(n²) can be true for an O(n) function.
- [ ] Explain why Ω does not mean best case.
- [ ] Explain why O does not inherently mean worst case.
- [ ] Separate input-case analysis from asymptotic notation.
- [ ] Distinguish algorithm bounds from problem lower bounds.
- [ ] Explain asymptotic optimality.
- [ ] Handle multiple input parameters.
- [ ] Apply tight bounds to code.
- [ ] Use lower-bound reasoning for backend workloads.
- [ ] Use complexity bounds to reason about AI retrieval workloads.

---

# Key Takeaways

1. **Big-O gives an asymptotic upper bound.**
2. **Big-Ω gives an asymptotic lower bound.**
3. **Big-Θ gives a tight asymptotic bound.**
4. **Θ can be established by proving both O and Ω.**
5. **Best/worst/average case are separate from O/Ω/Θ notation.**
6. **A loose O bound is not the same as a tight Θ bound.**
7. **Problem lower bounds are stronger claims than bounds on one implementation.**
8. **Matching an algorithm's upper bound with a problem's lower bound establishes asymptotic optimality.**
9. **Lower bounds depend on the computational model and assumptions.**
10. **Expert complexity analysis asks not only “How fast is this algorithm?” but also “Can this problem be solved asymptotically faster?”**
