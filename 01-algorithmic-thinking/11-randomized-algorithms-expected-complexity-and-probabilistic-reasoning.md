# 01.11 — Randomized Algorithms, Expected Complexity & Probabilistic Reasoning

> Some algorithms deliberately use randomness to simplify implementation, improve expected performance, avoid adversarial inputs, or explore a large search space efficiently.

## Learning Objectives

By the end of this chapter, you should be able to:

- Explain why randomized algorithms exist.
- Distinguish deterministic, randomized, worst-case, and expected complexity.
- Separate expected runtime from amortized runtime.
- Understand random sampling and uniform selection.
- Analyze randomized quicksort conceptually.
- Understand randomized hashing and collision reasoning.
- Distinguish Las Vegas and Monte Carlo algorithms.
- Reason about probability without confusing it with certainty.
- Understand expected behavior in backend and AI systems.
- Recognize when a probabilistic guarantee is appropriate and when a deterministic bound is required.

---

## 1. Why Randomness in Algorithms?

A deterministic algorithm always makes the same choices for the same input.

A randomized algorithm uses random choices during execution.

Why?

Randomness can:

- avoid predictable bad cases,
- simplify algorithms,
- improve expected performance,
- sample large datasets efficiently,
- distribute work,
- reduce adversarial effects,
- support probabilistic data structures,
- explore large search spaces.

Randomness is not automatically an optimization.

The algorithm must be analyzed under an explicit probability model.

---

## 2. Deterministic vs Randomized

### Deterministic

```text
same input + same algorithm
        ↓
same execution choices
```

### Randomized

```text
same input + random choices
        ↓
possibly different execution paths
```

The same input can therefore have different runtimes across executions.

That changes how complexity should be described.

---

## 3. Worst-Case vs Expected Complexity

For randomized algorithms, we often distinguish:

```text
Worst-case runtime
Expected runtime
```

Suppose an algorithm takes:

```text
O(n) with high probability
O(n²) on some random outcomes
```

You cannot simply say:

```text
Runtime = O(n)
```

without specifying the guarantee.

A stronger statement might be:

> The expected runtime is O(n), while the worst-case runtime remains O(n²).

The exact probability model matters.

---

## 4. Expected Value

If a random variable `X` has possible outcomes `x₁, x₂, ...` with probabilities `p₁, p₂, ...`, then:

```text
E[X] = Σ pᵢxᵢ
```

Example:

```text
50% chance of cost 1
50% chance of cost 5
```

Expected cost:

```text
0.5(1) + 0.5(5) = 3
```

Expected cost is a weighted average over random outcomes.

---

## 5. Expected Runtime Is Not Average Input Runtime

There are different sources of randomness.

### Average-case input analysis

The input is treated as coming from a distribution.

### Randomized algorithm analysis

The algorithm itself introduces random choices.

A randomized algorithm can have expected runtime even when the input is fixed.

This distinction is important.

---

## 6. Expected vs Amortized

These are frequently confused.

### Expected complexity

Uses probability over random outcomes.

### Amortized complexity

Analyzes total cost across an operation sequence.

Example:

```text
Randomized quicksort
→ expected O(n log n)
```

versus:

```text
Dynamic-array append
→ amortized O(1)
```

The first depends on random choices.

The second is a sequence-based guarantee.

```text
Expected ≠ Amortized
```

---

## 7. Uniform Random Choice

Suppose you need to choose one element uniformly from an array of length `n`.

The desired probability is:

```text
P(each index) = 1/n
```

In JavaScript:

```js
const index = Math.floor(Math.random() * arr.length);
```

For ordinary algorithmic exercises this models a random index.

For security-sensitive systems, `Math.random()` is not an appropriate cryptographic randomness source.

---

## 8. Random Sampling

Sometimes you need a sample without storing the entire dataset.

This is especially useful for streams.

A classic technique is **reservoir sampling**.

Goal:

> Select `k` items uniformly from a stream whose final length is unknown.

The algorithm maintains a fixed-size reservoir.

This gives:

```text
Memory = O(k)
```

instead of:

```text
Memory = O(n)
```

for storing all `n` items.

---

## 9. Reservoir Sampling — Core Idea

For a reservoir of size 1:

```text
first item → keep it
second item → replace with probability 1/2
third item → replace with probability 1/3
...
item i → replace with probability 1/i
```

Each item ends with equal probability of being selected.

The important lesson is not just the implementation.

It is the invariant:

> After processing `i` items, every processed item has probability `1/i` of being in the reservoir of size 1.

---

## 10. Reservoir Sampling for k Items

For reservoir size `k`:

1. Fill the reservoir with the first `k` items.
2. For item `i > k`, choose a random integer from `[1, i]`.
3. If the chosen value is within the reservoir range, replace that reservoir position.

Result:

```text
Memory: O(k)
Time: O(n)
```

The sample is uniform under the standard model.

---

## 11. Why Randomized Quicksort Exists

Quicksort partitions an array around a pivot.

Its performance depends strongly on pivot quality.

If the pivot repeatedly creates highly unbalanced partitions:

```text
n → n-1 + 0
```

then runtime can become:

```text
O(n²)
```

If partitions are reasonably balanced:

```text
n → n/2 + n/2
```

then runtime is:

```text
O(n log n)
```

Random pivot selection makes consistently bad pivot choices much less likely under the usual randomized model.

---

## 12. Randomized Quicksort Complexity

A randomized quicksort typically has:

```text
Expected time: O(n log n)
Worst-case time: O(n²)
```

Randomness does not remove the theoretical worst case.

It changes the probability of encountering pathological pivot sequences.

This is a central randomized-algorithm lesson:

> Expected efficiency and worst-case guarantees can be different properties of the same algorithm.

---

## 13. Expected Recursion Shape

A randomized pivot is likely to split the array reasonably often.

The expected recursion tree is therefore close to a balanced tree in aggregate.

You should not claim:

> “Random pivot always creates two equal halves.”

It does not.

The correct reasoning is probabilistic:

```text
Random pivot
    ↓
varied split sizes
    ↓
expected total partition cost
    ↓
expected O(n log n)
```

---

## 14. Randomness Against Adversarial Inputs

Suppose an adversary knows your deterministic pivot strategy.

They may construct an input that repeatedly produces poor partitions.

Randomizing the pivot makes the pivot choice independent of the input's predictable structure, assuming the randomness is appropriate and not exposed or manipulated.

This idea is useful beyond sorting:

- randomized hashing,
- randomized load distribution,
- randomized graph algorithms,
- randomized sampling.

---

## 15. Las Vegas Algorithms

A **Las Vegas algorithm** always produces a correct result, but its runtime may depend on random choices.

Example concept:

```text
randomized quicksort
```

The output remains correctly sorted regardless of pivot choices.

Randomness affects performance, not correctness.

Typical statement:

```text
Correctness: guaranteed
Runtime: expected bound
```

---

## 16. Monte Carlo Algorithms

A **Monte Carlo algorithm** has a bounded or controlled runtime but may have a probability of producing an incorrect result.

Typical statement:

```text
Runtime: bounded
Correctness: probabilistic
```

The exact error model depends on the algorithm.

A common engineering technique is to reduce error probability by repeated independent trials.

---

## 17. Las Vegas vs Monte Carlo

| Property | Las Vegas | Monte Carlo |
|---|---|---|
| Correctness | Guaranteed | Probabilistic |
| Runtime | Random/expected | Usually bounded/controlled |
| Randomness affects | Performance | Possibly correctness |
| Typical concern | Tail runtime | Error probability |

Do not memorize the names without remembering the guarantee they describe.

---

## 18. Randomized Hashing

Hash tables often rely on a hash function mapping keys to buckets.

Poor hashing can create many collisions.

A randomized hash family can reduce predictable collision attacks when implemented appropriately.

The general idea is:

```text
key
 ↓
randomized hash choice
 ↓
bucket
```

The randomization makes it harder for an adversary to deliberately construct a large collision set without knowing the secret/random choice.

Actual language/runtime implementations vary, so algorithmic reasoning should not be confused with claims about a specific JavaScript engine.

---

## 19. Collision Reasoning

If `n` items are mapped into `m` buckets, collisions become likely as the number of items grows relative to the number of buckets.

The **birthday paradox** gives useful intuition: collisions can become likely well before `n` reaches `m`.

The key engineering lesson is:

> A large hash range does not mean collisions are impossible.

Systems need a collision-handling strategy.

---

## 20. Probability of At Least One Collision

For `n` uniformly random assignments into `m` buckets, the probability of no collision is:

```text
P(no collision)
= (m/m) × ((m-1)/m) × ((m-2)/m) × ... × ((m-n+1)/m)
```

Therefore:

```text
P(at least one collision)
= 1 - P(no collision)
```

This exact expression is useful conceptually.

For large values, approximations are often more practical.

---

## 21. Randomized Load Distribution

Suppose work must be distributed across servers.

A deterministic mapping can create hotspots when traffic has skewed keys.

Randomized assignment can distribute work more evenly in some architectures.

But random assignment is not magic.

If one request is 1,000 times larger than another, random distribution can still produce imbalance.

Weighted workloads may require:

- weighted routing,
- consistent hashing,
- load-aware routing,
- queue-based balancing.

---

## 22. Random Sampling in Backend Systems

Randomized sampling is useful for:

- log sampling,
- metrics sampling,
- request tracing,
- approximate analytics,
- large-dataset inspection,
- A/B experimentation.

Sampling can reduce processing and storage costs.

But the sampling method must match the desired statistical guarantee.

Uniform sampling, weighted sampling, reservoir sampling, and stratified sampling solve different problems.

---

## 23. Randomized Algorithms in AI

AI systems frequently use randomness.

Examples include:

- randomized initialization,
- sampling,
- candidate generation,
- approximate search,
- randomized projections,
- Monte Carlo estimation,
- stochastic optimization.

The algorithmic question remains:

```text
What is random?
What distribution is assumed?
What guarantee is provided?
What happens in the worst case?
```

---

## 24. Randomized Approximation

Some problems are expensive to solve exactly.

A randomized algorithm may estimate an answer using samples.

Example pattern:

```text
Huge dataset
   ↓
random sample
   ↓
estimate statistic
```

If the sample is representative under the assumed model, useful estimates can be obtained with far less computation.

The trade-off is:

```text
less computation
     ↓
probabilistic error
```

The required sample size depends on the desired confidence and error tolerance.

---

## 25. High Probability vs Expected

These statements are different.

### Expected bound

The average runtime over the algorithm's random choices is small.

### High-probability bound

The probability of exceeding a specified bound is very small.

For example:

```text
Expected runtime = O(n log n)
```

does not automatically imply a specific high-probability bound without further analysis.

This distinction matters for latency-sensitive systems.

---

## 26. Tail Behavior

Two algorithms can have the same expected runtime but very different tails.

Example:

```text
Algorithm A
almost always near 10 ms

Algorithm B
usually 1 ms
rarely 500 ms
```

Both might have similar expectations under some distribution.

But backend users may strongly prefer A because tail latency is more predictable.

Therefore:

```text
Expected performance
≠
Tail performance
```

---

## 27. Repetition Can Reduce Error

Suppose a randomized test has independent error probability `p`.

Running independent trials can reduce the probability that all trials fail.

If all `k` trials must fail for the overall procedure to fail:

```text
P(all fail) = p^k
```

For `0 < p < 1`, this decreases exponentially with `k`.

This is a common Monte Carlo amplification technique.

The independence assumption must actually hold for this calculation to be valid.

---

## 28. Randomness and Reproducibility

Production systems often need reproducible behavior for debugging.

A useful design is to control the random source through a seedable abstraction where appropriate.

Conceptually:

```text
seed + algorithm + input
        ↓
reproducible random sequence
```

This can help:

- reproduce bugs,
- compare experiments,
- run deterministic tests,
- investigate performance anomalies.

Security-sensitive randomness has different requirements and should use an appropriate cryptographic source.

---

## 29. Randomness and Testing

Randomized testing can expose edge cases that hand-written tests miss.

A robust workflow is:

```text
random input generation
        ↓
run implementation
        ↓
compare against trusted oracle
        ↓
shrink failing case
        ↓
store minimal regression test
```

This connects randomized algorithms with property-based and differential testing.

Random generation is especially useful for testing:

- sorting,
- parsers,
- graph algorithms,
- data structures,
- serializers,
- state machines.

---

## 30. Randomness Does Not Replace Correctness Proofs

A randomized algorithm still needs a correctness argument.

You should be able to state:

```text
What does the algorithm guarantee for every random outcome?
```

for Las Vegas algorithms, or:

```text
What is the probability of error?
```

for Monte Carlo algorithms.

Randomness is part of the algorithm's state, not an excuse to skip reasoning.

---

## 31. When Not to Use Randomized Algorithms

Avoid randomness when a deterministic guarantee is required and a suitable deterministic algorithm exists.

Examples may include:

- strict compliance workflows,
- deterministic financial calculations,
- exact ordering requirements,
- safety-critical decisions,
- reproducibility-sensitive processing.

This is not an absolute rule.

The correct choice depends on the required guarantee.

---

## 32. Backend Decision Framework

Before using randomness, ask:

```text
1. What problem does randomness solve?
2. What distribution is assumed?
3. What is the worst-case behavior?
4. What is the expected behavior?
5. What is the tail behavior?
6. Is reproducibility required?
7. Is the random source secure enough?
8. Can an adversary influence inputs?
9. What happens when randomness behaves unusually?
10. Can we observe and debug the behavior?
```

This turns “randomized” from a buzzword into an engineering decision.

---

## 33. AI Decision Framework

For AI workloads:

```text
What is sampled?
      ↓
From what distribution?
      ↓
What is the candidate/search space?
      ↓
What quality guarantee exists?
      ↓
What error probability exists?
      ↓
What runtime/memory is expected?
      ↓
What happens in the tail?
```

This framework applies to approximate retrieval, sampling, candidate generation, and randomized search.

---

## 34. Common Mistakes

### Mistake 1 — Saying “randomized means faster”

Randomness is useful only when it improves a relevant property.

### Mistake 2 — Confusing expected and worst-case complexity

Randomization often improves expected performance without eliminating worst-case behavior.

### Mistake 3 — Confusing expected and amortized analysis

They use different reasoning models.

### Mistake 4 — Treating probability as certainty

An event with low probability can still happen.

### Mistake 5 — Ignoring independence assumptions

Many probability calculations require independent trials.

### Mistake 6 — Using weak randomness for security

Algorithmic randomness and cryptographic randomness have different requirements.

### Mistake 7 — Ignoring reproducibility

Uncontrolled randomness makes debugging difficult.

### Mistake 8 — Ignoring tail behavior

Expected runtime alone may not satisfy latency SLOs.

### Mistake 9 — Assuming uniform sampling solves every sampling problem

The desired statistical distribution determines the correct method.

---

## 35. DSA Mental Model

When you see a randomized algorithm:

```text
What is randomized?
        ↓
What probability distribution does it use?
        ↓
What happens for each random outcome?
        ↓
What is worst-case behavior?
        ↓
What is expected behavior?
        ↓
Is there a high-probability guarantee?
        ↓
What is the error probability, if any?
        ↓
Can randomness be reproduced?
        ↓
Is the random source appropriate?
```

---

## 36. Interview Explanation Template

A strong explanation should specify the guarantee.

Example:

> “Randomized quicksort chooses the pivot randomly. Every pivot choice still produces a correct sort, so correctness is deterministic. Randomization reduces the likelihood of repeatedly choosing pathological pivots, giving expected O(n log n) runtime, while the theoretical worst case remains O(n²).”

That is substantially better than:

> “Random quicksort is O(n log n).”

---

## 37. Key Takeaways

1. Randomized algorithms deliberately use random choices.
2. Randomness can avoid predictable adversarial behavior.
3. Expected complexity depends on a probability model.
4. Expected complexity is different from amortized complexity.
5. Worst-case and expected runtime can differ for the same randomized algorithm.
6. Reservoir sampling provides uniform samples with bounded memory.
7. Randomized quicksort has expected O(n log n) and worst-case O(n²) under the standard model.
8. Las Vegas algorithms guarantee correctness while runtime may be random.
9. Monte Carlo algorithms trade a controlled probability of error for runtime or simplicity.
10. High-probability guarantees are stronger statements than expected bounds alone.
11. Tail latency matters even when expected runtime is excellent.
12. Randomized hashing can reduce predictable collision attacks when appropriately designed.
13. Sampling can reduce backend and AI computation, but the sampling distribution matters.
14. Reproducible randomness is valuable for testing and debugging.
15. Security-sensitive systems require appropriate cryptographic randomness.
16. Randomness should be introduced to solve a concrete engineering problem, not because it sounds sophisticated.
17. Expert reasoning states the exact guarantee: correctness, expected time, worst-case time, error probability, or high-probability bound.

---

## Self-Check

1. Why do randomized algorithms exist?
2. What is expected complexity?
3. How is expected complexity different from average-case analysis?
4. How is expected complexity different from amortized complexity?
5. What is reservoir sampling?
6. Why does randomized quicksort have expected O(n log n)?
7. Why does randomization not eliminate quicksort's worst case?
8. What is a Las Vegas algorithm?
9. What is a Monte Carlo algorithm?
10. What does “with high probability” mean conceptually?
11. Why do independent trials reduce error probability exponentially in repeated Monte Carlo amplification?
12. Why is reproducible randomness useful in backend engineering?
13. Why is `Math.random()` not a cryptographic randomness source?
14. How can randomized sampling help AI pipelines?
15. Why must tail behavior be considered separately from expected runtime?
16. Can you state a randomized algorithm's guarantee precisely instead of simply saying it is “fast”?
