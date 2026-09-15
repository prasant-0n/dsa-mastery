# 02.10 — Best, Average & Worst Case

## Learning Objective

Learn how to analyze an algorithm under different input conditions and distinguish **best-case, average-case, worst-case, expected-case, and amortized complexity**.

The central lesson:

> Complexity is a function of the input, not simply a property of the code.

The same algorithm can perform very differently depending on the structure of the input.

---

# 1. Why Cases Matter

Consider linear search:

```js
function linearSearch(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return i;
  }

  return -1;
}
```

If the target is the first element:

```text
1 comparison
```

If the target is the last element:

```text
n comparisons
```

If the target does not exist:

```text
n comparisons
```

Therefore the same algorithm has different costs for different inputs.

---

# 2. Best-Case Complexity

The **best case** asks:

> What is the minimum amount of work this algorithm can perform over valid inputs of size `n`?

For linear search:

```text
Best case = Θ(1)
```

because the target may appear at index `0`.

Best case is useful for understanding the algorithm's most favorable behavior, but it is usually insufficient for capacity planning.

---

# 3. Worst-Case Complexity

The **worst case** asks:

> What is the maximum amount of work the algorithm may perform over valid inputs of size `n`?

For linear search:

```text
Worst case = Θ(n)
```

because the algorithm may inspect every element.

Worst-case analysis is especially useful for:

- latency guarantees
- resource limits
- denial-of-service resistance
- capacity planning
- correctness under adversarial inputs
- hard performance contracts

---

# 4. Average-Case Complexity

Average-case analysis asks:

> What is the expected cost over a specified distribution of inputs?

This requires an assumption about the input distribution.

Without a probability model, “average case” is underspecified.

For example, saying:

```text
Linear search is O(n) on average.
```

is incomplete unless we explain how target positions or target absence are distributed.

---

# 5. A Simple Linear Search Average Case

Suppose:

- the target is guaranteed to exist
- every position is equally likely

Then the expected number of comparisons is:

```text
(1 + 2 + 3 + ... + n) / n
```

Using:

```text
1 + 2 + ... + n = n(n + 1) / 2
```

we obtain:

```text
(n + 1) / 2
```

Therefore:

```text
Expected comparisons = Θ(n)
```

Notice the distinction:

```text
Best case     Θ(1)
Average case  Θ(n)
Worst case    Θ(n)
```

---

# 6. Big-O Does Not Mean Worst Case

A major misconception is:

> Big-O means worst-case complexity.

False.

Big-O is a mathematical upper-bound notation.

You can state:

```text
Best-case time is O(n)
Average-case time is O(n)
Worst-case time is O(n)
```

The phrase “worst-case Big-O” is common in interviews because worst-case bounds are frequently reported, but the notation itself does not encode the case.

Always specify:

```text
best / average / worst
```

separately from:

```text
O / Ω / Θ
```

---

# 7. Big-Theta and Cases

If an algorithm performs between constant multiples of `n` operations for a particular case, we can write:

```text
Θ(n)
```

For linear search:

```text
Best case: Θ(1)
Worst case: Θ(n)
```

If the target is uniformly distributed among positions and guaranteed to exist:

```text
Average case: Θ(n)
```

Different cases can therefore have different tight bounds.

---

# 8. Input Structure Determines Cost

Consider:

```js
function countUntilNegative(items) {
  let count = 0;

  for (const value of items) {
    count++;
    if (value < 0) break;
  }

  return count;
}
```

The algorithm stops early.

Best case:

```text
Θ(1)
```

if the first value is negative.

Worst case:

```text
Θ(n)
```

if there is no negative value or the first negative appears at the end.

This is an **input-sensitive algorithm**.

---

# 9. Early Exit Does Not Automatically Improve Worst Case

Early termination can dramatically improve typical latency.

But if a valid input still forces the algorithm to inspect all `n` elements, then:

```text
Worst case = Θ(n)
```

This is one of the most important distinctions in algorithm engineering:

```text
common/typical behavior
        ≠
worst-case guarantee
```

---

# 10. Best Case Can Be Misleading

Suppose an algorithm has:

```text
Best case: Θ(1)
Worst case: Θ(n²)
```

Reporting only:

```text
O(1)
```

would be technically possible as a statement about best-case upper bounds, but practically misleading if the system can encounter quadratic inputs.

Always report the relevant case explicitly.

---

# 11. Worst Case and Adversarial Inputs

Worst-case analysis asks what the most expensive valid input can force.

For a linear search, an adversary can place the target at the end or omit it.

Therefore:

```text
n comparisons
```

are unavoidable for that algorithm on such an input.

Adversarial reasoning is particularly important for:

- public APIs
- user-controlled inputs
- security-sensitive systems
- parsers
- rate limiters
- caches
- search systems

---

# 12. Average Case Requires a Distribution

Suppose a target can appear at any position.

These two distributions produce different expected costs:

### Uniform distribution

Every position has equal probability.

### Front-loaded distribution

The target is very likely to appear near the beginning.

The code is identical.

The expected complexity can differ in constants and, depending on the distribution family, potentially in asymptotic behavior.

Therefore:

> **Average-case analysis is always relative to a probability model.**

---

# 13. Expected Complexity vs Average-Case Complexity

These terms are related but should not be treated as identical automatically.

**Average-case complexity** usually means averaging algorithm cost over a specified distribution of inputs.

**Expected complexity** can also arise from randomness inside the algorithm.

For example, randomized Quicksort has an expected running time of:

```text
O(n log n)
```

under its random pivot process, while its worst case remains:

```text
O(n²)
```

The source of randomness matters.

---

# 14. Worst Case vs Expected Case

A randomized algorithm can have:

```text
Worst case: O(n²)
Expected:   O(n log n)
```

This does not mean the worst case disappeared.

It means randomization makes expensive behavior unlikely under the algorithm's probability model.

For production systems, also consider tail behavior such as:

```text
p95
p99
p99.9
```

because expected latency alone may hide dangerous outliers.

---

# 15. Example — Quicksort

Quicksort's partitioning behavior depends heavily on pivot choices and input arrangement.

A highly unbalanced partition can produce:

```text
T(n) = T(n - 1) + O(n)
```

which gives:

```text
O(n²)
```

A balanced partition approximately gives:

```text
T(n) = 2T(n/2) + O(n)
```

which gives:

```text
O(n log n)
```

Randomized pivot selection makes balanced behavior much more likely, yielding expected `O(n log n)` time under the usual model.

---

# 16. Best, Average & Worst Case Table

For a typical comparison-based Quicksort implementation:

| Case | Typical bound |
|---|---:|
| Best | Θ(n log n) |
| Expected / Average under suitable assumptions | Θ(n log n) |
| Worst | Θ(n²) |

The exact best-case statement depends on the partition implementation, but the key concept is the difference between balanced and highly unbalanced recursion.

---

# 17. Binary Search Cases

For binary search on a sorted array:

```text
Best case:  Θ(1)
Worst case: Θ(log n)
```

If the target is found immediately at the midpoint, the algorithm stops after one comparison.

Otherwise the search interval keeps shrinking.

The logarithmic worst case comes from repeatedly reducing the search space by a constant factor.

---

# 18. Hash Table Lookup Cases

Hash tables require more careful language.

Under suitable assumptions:

```text
Expected lookup ≈ O(1)
```

But pathological collision behavior can produce much worse performance depending on the implementation and assumptions.

Therefore a production analysis should identify:

- hash-quality assumptions
- collision handling
- adversarial input possibilities
- resizing behavior
- implementation guarantees

Never write “Map lookup is always O(1)” without qualification.

---

# 19. Amortized Complexity Is Different

Suppose a dynamic array occasionally resizes.

One insertion can cost:

```text
Θ(n)
```

because elements may need to be copied.

But across many insertions:

```text
Amortized insertion = Θ(1)
```

This is not the same as saying:

```text
Worst-case insertion = Θ(1)
```

It is still possible for an individual operation to cost `Θ(n)`.

Keep these concepts separate:

```text
Worst-case
Average-case
Expected-case
Amortized-case
```

---

# 20. A Useful Comparison

| Concept | Question |
|---|---|
| Best case | What is the cheapest valid input? |
| Worst case | What is the most expensive valid input? |
| Average case | What is the expected cost under an input distribution? |
| Expected case | What is the expected cost under the algorithm/input randomness model? |
| Amortized | What is the average cost over a sequence, with total cost bounded? |

These are different analytical questions.

---

# 21. Backend Example — API Validation

Suppose an API validates a list of IDs and stops at the first invalid ID.

If invalid IDs usually appear early:

```text
Typical latency may be low.
```

But if clients can submit valid IDs throughout the list:

```text
Worst case = Θ(n)
```

Capacity planning should not assume the common case unless the workload contract supports that assumption.

---

# 22. Backend Example — Cache Lookup

Suppose a request checks:

```text
L1 cache
↓
L2 cache
↓
database
```

A cache hit may be extremely cheap.

A miss can trigger much more work.

Therefore request cost depends on workload state:

```text
Best case   → cache hit
Worst case  → cache miss + database work
```

For production performance, analyze both algorithmic complexity and system-level latency distributions.

---

# 23. Backend Example — Rate Limiting

A rate limiter may have cheap normal operations but expensive maintenance or eviction events.

You should ask:

```text
What happens on a normal request?
What happens when state is missing?
What happens during cleanup?
What happens during a burst?
What happens under adversarial traffic?
```

This is case-based complexity reasoning applied to backend engineering.

---

# 24. AI Example — Retrieval

Suppose a retrieval pipeline evaluates `k` candidates.

Normal requests may have:

```text
k = 20
```

while some queries produce:

```text
k = 10,000
```

The same ranking algorithm may therefore have very different latency depending on candidate-set size.

For AI systems, case analysis should consider:

- candidate count
- embedding dimension
- corpus size
- query length
- reranking depth
- batch size
- cache hit/miss state

---

# 25. Distribution-Aware AI Performance

An AI retrieval system might have:

```text
Most queries → small candidate set
Rare queries → huge candidate set
```

Average latency can look acceptable while p99 latency is unacceptable.

Therefore production AI systems often need both:

```text
expected/average performance
+
tail/worst-case controls
```

Possible controls include:

- candidate caps
- timeouts
- early termination
- approximate retrieval
- batching
- caching
- fallback strategies

---

# 26. Case Analysis and Constraints

Constraints help determine which case matters most.

If the input is fully controlled and `n ≤ 20`, an exponential worst case may be acceptable.

If users can submit `n ≤ 1,000,000`, even a linear worst case may require careful engineering.

Therefore complexity analysis should combine:

```text
case behavior
+
input constraints
+
workload distribution
+
resource budget
```

---

# 27. Dominant Case for Engineering

There is no universal rule that worst case is always the only relevant metric.

Choose based on the system requirement.

### Security-sensitive service

Worst case may dominate.

### Interactive search

p95/p99 latency may dominate.

### Offline analytics

Total throughput may dominate.

### Randomized algorithm

Expected and tail behavior both matter.

### Real-time control system

Hard latency bounds may dominate.

The correct analysis is requirement-driven.

---

# 28. How to Analyze Cases Correctly

Use this procedure:

```text
1. Define input size.
2. Define the relevant input structure.
3. Identify what causes early termination or extra work.
4. Construct a best-case input.
5. Construct a worst-case input.
6. Define the probability distribution if average/expected analysis is needed.
7. Count the work for each case.
8. Separate asymptotic growth from constant factors.
9. Analyze memory separately.
10. Consider tail behavior for production systems.
11. State all assumptions.
```

---

# 29. Common Mistakes

## Mistake 1 — “O means worst case”

Big-O is an upper-bound notation, not a case label.

## Mistake 2 — Reporting only the best case

This can hide unacceptable worst-case behavior.

## Mistake 3 — Calling something average-case without a distribution

Average-case analysis requires assumptions.

## Mistake 4 — Confusing expected and amortized complexity

Randomness and operation sequences are different sources of averaging.

## Mistake 5 — Ignoring early termination

Early exits can change best and average behavior.

## Mistake 6 — Assuming typical input equals guaranteed input

Production workloads can contain rare pathological cases.

## Mistake 7 — Ignoring tail latency

A good mean does not imply a good p99.

## Mistake 8 — Assuming randomization eliminates worst cases

Randomization often changes expected behavior, not necessarily the worst-case bound.

---

# 30. Interview Framework

When asked for complexity, answer in this order:

```text
1. Best case
2. Average/expected case, if meaningful
3. Worst case
4. Space complexity
5. Assumptions
```

Example:

> Linear search is Θ(1) in the best case when the target is first, Θ(n) in the worst case when the target is last or absent, and Θ(n) expected under a uniform target-position distribution. It uses Θ(1) auxiliary space.

This is much stronger than simply saying:

> O(n).

---

# 31. Mastery Checklist

- [ ] Define best-case complexity.
- [ ] Define worst-case complexity.
- [ ] Define average-case complexity.
- [ ] Explain why average case requires a distribution.
- [ ] Explain expected complexity.
- [ ] Distinguish expected from amortized complexity.
- [ ] Explain why Big-O does not inherently mean worst case.
- [ ] Analyze linear search across all cases.
- [ ] Analyze binary search across cases.
- [ ] Explain early termination.
- [ ] Explain adversarial inputs.
- [ ] Analyze Quicksort cases.
- [ ] Explain randomized expected behavior.
- [ ] Distinguish worst-case guarantees from typical behavior.
- [ ] Connect case analysis to p95/p99 latency.
- [ ] Apply case analysis to backend workloads.
- [ ] Apply case analysis to AI retrieval pipelines.
- [ ] State probability assumptions explicitly.
- [ ] Analyze memory independently.
- [ ] Choose the relevant case based on system requirements.

---

# Key Takeaways

1. **Best, average, and worst case answer different questions about the same algorithm.**
2. **Big-O describes an upper bound; it does not itself mean worst case.**
3. **Average-case analysis requires a defined probability distribution.**
4. **Expected complexity may arise from random inputs or randomness inside the algorithm.**
5. **Amortized complexity averages cost over a sequence of operations and is distinct from average-case analysis.**
6. **Early termination often improves best and typical behavior without changing the worst-case bound.**
7. **Worst-case reasoning is essential when inputs can be adversarial or resource guarantees matter.**
8. **Production systems should consider tail latency, not just average latency.**
9. **AI and backend workloads often require distribution-aware analysis because input sizes and system states vary.**
10. **A strong complexity analysis states the case, bound, assumptions, and relevant resource constraints explicitly.**
