# 01.17 — Randomization, Sampling & Probabilistic Algorithm Design

> Randomization is not “adding Math.random()”. It is a deliberate algorithm-design technique for controlling expected behavior, sampling large spaces, distributing work, and making adversarial inputs less effective.

## Learning Objectives

By the end of this chapter, you should be able to:

- Distinguish deterministic and randomized algorithms.
- Distinguish worst-case, expected, average-case, and amortized analysis.
- Reason about probability and expected value.
- Implement uniform random selection correctly.
- Understand reservoir sampling.
- Explain randomized Quicksort.
- Reason about randomized hashing and collisions.
- Distinguish Las Vegas and Monte Carlo algorithms.
- Understand high-probability guarantees and error amplification.
- Use reproducible randomness for testing and debugging.
- Apply probabilistic reasoning to backend and AI systems.

---

## 1. Why Randomization Exists

A deterministic algorithm always makes the same choices for the same input.

A randomized algorithm uses random choices during execution.

The purpose may be to:

- avoid predictable worst-case inputs,
- sample without reading everything,
- distribute load,
- simplify an algorithm,
- obtain an expected performance guarantee,
- approximate an expensive computation.

The key question is:

> What property does randomness improve?

Randomness should be tied to a measurable algorithmic benefit.

---

## 2. Deterministic vs Randomized

### Deterministic

```text
input
 ↓
fixed decisions
 ↓
fixed output
```

### Randomized

```text
input + random choices
 ↓
algorithm
 ↓
output/distribution of outputs
```

For a randomized algorithm, complexity may be a random variable rather than one fixed number.

Therefore we often analyze:

```text
expected running time
```

or a probability that runtime exceeds some threshold.

---

## 3. Worst-Case vs Expected Complexity

Worst-case complexity asks:

> What is the maximum cost over all valid inputs and random outcomes?

Expected complexity asks:

> What is the average cost over the algorithm's random choices for a fixed input?

These are different questions.

A randomized algorithm can have:

```text
worst-case = O(n²)
expected   = O(n log n)
```

Randomization does not magically erase the worst case. It can make bad behavior unlikely.

---

## 4. Average-Case vs Expected Complexity

These terms are often confused.

### Average-case analysis

Usually averages over an assumed input distribution.

### Expected analysis of a randomized algorithm

Averages over the algorithm's internal random choices.

You must state what is random.

For example:

```text
fixed input + random pivot
```

is an expected-runtime analysis over pivot choices.

---

## 5. Expected Value

For a discrete random variable X:

```text
E[X] = Σ x · P(X = x)
```

Expected value is the probability-weighted average.

Simple example:

A fair six-sided die has expected value:

```text
(1 + 2 + 3 + 4 + 5 + 6) / 6 = 3.5
```

Algorithm analysis uses the same idea for random costs.

---

## 6. Linearity of Expectation

One of the most useful tools in randomized analysis is:

```text
E[X + Y] = E[X] + E[Y]
```

Importantly, independence is **not required** for linearity of expectation.

For many random events, it is easier to calculate each event's expected contribution and add them than to model the entire distribution.

---

## 7. Indicator Variables

Define an indicator:

```text
I = 1 if event occurs
I = 0 otherwise
```

Then:

```text
E[I] = P(event)
```

This gives a powerful analysis pattern:

```text
expected total
= sum of expected individual contributions
```

Indicator variables are widely used in randomized algorithm proofs.

---

## 8. Uniform Random Selection

Suppose you need one uniformly random element from an array of length `n`.

The index should satisfy:

```text
P(index = i) = 1/n
```

In JavaScript:

```js
const index = Math.floor(Math.random() * n);
```

assuming `n > 0`.

The important property is uniformity, not merely “random-looking” output.

---

## 9. Randomness Quality vs Algorithmic Randomness

For ordinary algorithmic randomization, a pseudorandom generator is often sufficient.

For security-sensitive tasks, ordinary application randomness may be inappropriate.

Examples:

```text
randomized Quicksort → algorithmic randomness
session tokens       → security randomness
cryptographic keys   → cryptographic randomness
```

Never confuse these requirements.

---

## 10. Fisher-Yates Shuffle

A correct uniform shuffle can be constructed with Fisher-Yates.

Conceptually:

```text
for i from n-1 down to 1:
    choose j uniformly from [0, i]
    swap i and j
```

JavaScript:

```js
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

Each permutation is intended to have equal probability.

---

## 11. Why Naive Shuffle Can Be Biased

A common mistake is:

```js
for (let i = 0; i < n; i++) {
  const j = Math.floor(Math.random() * n);
  swap(array[i], array[j]);
}
```

This does not generally generate every permutation with equal probability.

The lesson is important:

> Random choices do not automatically imply a uniform output distribution.

Uniformity must be proved or obtained from a known correct construction.

---

## 12. Randomized Quicksort

Quicksort's performance depends heavily on pivot selection.

A deterministic pivot rule can be attacked by specially structured input.

Randomized Quicksort chooses the pivot randomly.

Conceptually:

```text
array
 ↓
random pivot
 ↓
partition
 ↓
left + right
```

Expected complexity:

```text
O(n log n)
```

Worst case remains:

```text
O(n²)
```

but the bad partition sequence becomes unlikely under the randomness assumptions.

---

## 13. Randomized Quicksort Recurrence Intuition

Unlike a fixed recurrence such as:

```text
T(n) = 2T(n/2) + O(n)
```

randomized Quicksort has random subproblem sizes.

The expected runtime is derived by considering the probability that pairs of elements are compared.

The deeper lesson is:

> Randomized algorithms may require probabilistic reasoning rather than one deterministic recursion tree.

---

## 14. Randomized Algorithms and Adversaries

Suppose an attacker knows a deterministic pivot rule.

They may construct an input that repeatedly causes bad partitions.

If the pivot is selected randomly after the input is fixed, the attacker cannot easily predict the exact pivot sequence.

Randomization can therefore reduce the effectiveness of predictable adversarial structure.

This is useful beyond sorting:

- hashing,
- load distribution,
- randomized testing,
- sampling,
- distributed systems.

---

## 15. Las Vegas Algorithms

A Las Vegas randomized algorithm always produces a correct answer, but its runtime is random.

Conceptually:

```text
randomness
 ↓
variable runtime
 ↓
always correct result
```

Randomized Quicksort is commonly treated as a Las Vegas algorithm when implemented normally: the ordering may vary and runtime varies, but the sorted result remains correct.

---

## 16. Monte Carlo Algorithms

A Monte Carlo randomized algorithm has a bounded or controlled runtime, but may have a probability of error.

Conceptually:

```text
randomness
 ↓
bounded computation
 ↓
possibly incorrect result
```

The algorithm must specify:

```text
error probability
```

and often:

```text
one-sided or two-sided error
```

---

## 17. Las Vegas vs Monte Carlo

| Property | Las Vegas | Monte Carlo |
|---|---|---|
| Correctness | Always correct | May err |
| Runtime | Random | Usually bounded/controlled |
| Randomness affects | Cost/path | Result probability |
| Main guarantee | Correct answer | Error bound |

The distinction is fundamental in probabilistic algorithm design.

---

## 18. Error Probability

Suppose one randomized trial has error probability:

```text
p
```

If independent repetitions are performed and we accept only if all repetitions fail/succeed according to the algorithm's rule, the combined error can often decrease exponentially.

For example, if failure probability is `p` per independent trial:

```text
P(all k fail) = p^k
```

This is the basis of error amplification.

---

## 19. Error Amplification

Suppose an algorithm has:

```text
error ≤ 1/4
```

Repeated independent trials can reduce the error dramatically.

For example:

```text
(1/4)^2 = 1/16
(1/4)^3 = 1/64
```

The exact amplification strategy depends on whether the algorithm uses majority voting, one-sided verification, or another acceptance rule.

Never repeat an algorithm blindly; first understand how independent trials combine.

---

## 20. High-Probability Guarantees

Sometimes we want a statement such as:

```text
with probability at least 1 - δ,
performance is within bound B
```

This is stronger than simply saying:

```text
expected performance is B
```

A system can have a good expected value but undesirable tail behavior.

Production engineering often cares about both.

---

## 21. Tail Behavior

Consider two systems with the same expected latency:

```text
System A → tightly concentrated
System B → usually fast but occasionally extremely slow
```

Their operational behavior can be very different.

Therefore randomized algorithm engineering should consider:

- expectation,
- variance,
- tail probability,
- worst case,
- resource limits.

This connects probabilistic analysis directly to backend SLOs.

---

## 22. Reservoir Sampling

Suppose a stream contains an unknown number of items:

```text
x1, x2, x3, ...
```

and you want a uniformly random sample of size `k` without storing the entire stream.

Reservoir sampling solves this in one pass with O(k) memory.

For a reservoir of size 1:

```text
first item → keep
second item → replace with probability 1/2
third item → replace with probability 1/3
...
```

At the end, every item has equal probability of being selected.

---

## 23. Reservoir Sampling Algorithm

For one sample:

```js
function sampleOne(stream) {
  let result;
  let count = 0;

  for (const item of stream) {
    count += 1;
    if (Math.floor(Math.random() * count) === 0) {
      result = item;
    }
  }

  return result;
}
```

Memory:

```text
O(1)
```

assuming the stream itself is not materialized.

The algorithm is especially useful for unbounded or very large streams.

---

## 24. Why Reservoir Sampling Works

When item `i` arrives, it is selected with probability:

```text
1/i
```

For it to remain selected at the end, it must survive every later replacement.

The probability telescopes so that each item ends with equal probability.

This is a good example of designing a local random rule whose global distribution is correct.

---

## 25. Sampling Without Replacement

Sampling `k` distinct elements uniformly from a large population can be done through:

- partial Fisher-Yates,
- reservoir sampling,
- specialized algorithms based on stream characteristics.

The correct technique depends on whether the data is:

```text
random-access
streaming
known-size
unknown-size
small
huge
```

Algorithm selection remains workload-driven.

---

## 26. Randomized Hashing

Hash tables depend on mapping keys into buckets.

If an adversary can predict the hash behavior, they may construct many colliding keys.

Randomized hashing introduces a random component so the exact mapping is harder to predict.

The objective is not necessarily perfect collision avoidance.

It is often to make pathological collision behavior unlikely.

---

## 27. Hash Collisions Are Inevitable

If there are more possible keys than buckets, collisions must occur.

By the pigeonhole principle:

```text
keys > buckets
⇒
there exists a collision
```

A good hashing strategy manages collisions rather than pretending they can be eliminated completely.

---

## 28. Birthday-Paradox Intuition

Collisions can become likely much sooner than people intuitively expect.

If many random values are mapped into a finite space, the number of possible pairs grows quadratically:

```text
n(n - 1) / 2
```

Therefore collision probability can become significant when the number of sampled values is on the order of the square root of the space size.

This intuition is important for:

- hash values,
- fingerprints,
- randomized identifiers,
- probabilistic data structures.

---

## 29. Randomized Testing

Random input generation can discover edge cases that manually written tests miss.

Useful strategy:

```text
random generator
↓
run optimized algorithm
↓
run trusted brute-force oracle
↓
compare outputs
```

This is called differential testing.

Randomized testing becomes especially powerful when combined with a small exact reference implementation.

---

## 30. Reproducible Randomness

Pure randomness can make bugs difficult to reproduce.

A production-quality test harness should often support a seed:

```text
seed = 12345
↓
repeat exact random sequence
↓
reproduce failure
```

This gives both:

```text
randomized exploration
+
repeatable debugging
```

JavaScript's built-in `Math.random()` does not provide a standard seed-setting API, so reproducible tests commonly use a dedicated seeded PRNG implementation.

---

## 31. Randomized Testing Strategy

A strong randomized test loop is:

```text
1. generate input
2. validate input contract
3. run brute-force oracle
4. run optimized algorithm
5. compare results
6. on failure, record seed/input
7. minimize the failing case
```

This combines:

- probabilistic exploration,
- deterministic correctness checking,
- counterexample minimization.

---

## 32. Randomness and Correctness

Randomization must not replace correctness reasoning.

You still need to establish:

```text
what distribution is required?
what random choices are made?
what invariant holds?
what guarantee is probabilistic?
what remains deterministic?
```

For a sampling algorithm, the output distribution is part of correctness.

For a Monte Carlo algorithm, the error bound is part of correctness.

---

## 33. Randomized Selection

Randomization can also help select elements without fully sorting.

Quickselect chooses a pivot and partitions around it.

Expected complexity:

```text
O(n)
```

Worst case:

```text
O(n²)
```

This is useful when you need:

```text
k-th smallest
median
quantile-like selection
```

rather than the complete sorted order.

---

## 34. Randomized Algorithms and Lower Bounds

Randomization can change what guarantees are possible under a computational model, but it does not mean all lower bounds disappear.

A lower bound depends on:

- input model,
- allowed operations,
- randomness assumptions,
- error tolerance,
- online/offline access,
- computational resources.

Always state the model before making a complexity claim.

---

## 35. Backend: Sampling Large Data Streams

Backend systems frequently process:

- logs,
- events,
- telemetry,
- click streams,
- audit records.

Keeping every record may be too expensive.

Random sampling can provide a representative subset for:

- debugging,
- analytics,
- monitoring,
- exploratory analysis.

Reservoir sampling is particularly useful when stream size is unknown.

---

## 36. Backend: Load Distribution

Randomized choices can distribute work.

Examples:

```text
random worker selection
randomized request routing
jittered retry timing
randomized sampling
```

The objective is often to avoid synchronized behavior or concentrated load.

Randomness should be evaluated against:

- fairness,
- variance,
- tail latency,
- failure correlation.

---

## 37. Backend: Retry Jitter

Suppose many clients retry after the same failure.

Without jitter:

```text
failure
↓
all retry at t + fixed delay
↓
traffic spike
```

Randomized jitter spreads retries across time.

Conceptually:

```text
retry delay = base delay + random component
```

This is a practical probabilistic load-shaping technique.

---

## 38. Backend: Randomized Experiments

Random assignment is fundamental to many experiments.

Users can be randomly assigned to:

```text
control
vs
experiment
```

The goal is to reduce systematic selection bias under appropriate assumptions.

Algorithmic reasoning still matters:

- assignment distribution,
- sample size,
- independence assumptions,
- reproducibility,
- imbalance,
- statistical power.

---

## 39. AI: Candidate Sampling

AI pipelines often operate on enormous candidate spaces.

Random sampling can create a manageable candidate set.

Example:

```text
10 million candidates
↓
random/stratified sample
↓
100k candidates
↓
expensive scoring
```

But random sampling may miss important candidates.

Therefore the sampling strategy must match the recall requirement.

---

## 40. AI: Negative Sampling

Training systems sometimes need negative examples from a huge universe.

Instead of evaluating every possible negative:

```text
all possible negatives
```

sample a subset:

```text
candidate negatives
↓
sampled negatives
↓
training objective
```

The sampling distribution affects what the model learns.

This is not merely a performance optimization; it changes the statistical objective.

---

## 41. AI: Randomized Approximation

Some computations are too expensive to perform exactly.

Randomized approximation can estimate:

- counts,
- expectations,
- similarities,
- candidate quality,
- large-scale statistics.

The engineering question becomes:

```text
accuracy
vs
computation
vs
memory
```

The error guarantee must be understood before deploying the approximation.

---

## 42. AI: Search and Random Restarts

A difficult search problem can sometimes benefit from multiple randomized starts:

```text
random start
↓
local/search procedure
↓
solution

repeat
↓
keep best
```

This can reduce dependence on one unlucky starting state.

Examples include heuristic optimization and combinatorial search.

---

## 43. Probabilistic Data Structures

Many large-scale systems trade exactness for memory efficiency.

Examples include:

- Bloom filters,
- Count-Min Sketch,
- HyperLogLog.

These are not all “randomized algorithms” in exactly the same sense, but they rely heavily on hashing, probability, and controlled error.

They are especially relevant to backend and AI infrastructure.

---

## 44. Bloom Filter Intuition

A Bloom filter can answer:

```text
definitely not present
```

or:

```text
possibly present
```

It may produce false positives but, in its standard form, avoids false negatives.

This is a classic probabilistic trade-off:

```text
small memory
+
fast membership checks
+
controlled false-positive probability
```

---

## 45. Common Mistakes

### Mistake 1 — Calling any random-looking code randomized algorithm design

Randomness needs a defined algorithmic purpose.

### Mistake 2 — Confusing expected and average-case complexity

Identify what is being averaged.

### Mistake 3 — Assuming random means uniform

A random process can be biased.

### Mistake 4 — Ignoring worst-case behavior

Expected O(n log n) does not mean worst-case O(n log n).

### Mistake 5 — Using insecure randomness for security

Algorithmic randomness and cryptographic randomness have different requirements.

### Mistake 6 — Forgetting independence assumptions

Some probability calculations require independence; linearity of expectation does not.

### Mistake 7 — Ignoring distributional effects in AI sampling

Sampling changes what the downstream system sees.

### Mistake 8 — Repeating Monte Carlo trials without analyzing error combination

Amplification requires a correct probabilistic argument.

### Mistake 9 — Ignoring tail behavior

Good expectation can coexist with unacceptable rare latency spikes.

### Mistake 10 — Failing to record randomness during testing

A random failure that cannot be reproduced is expensive to debug.

---

## 46. Randomized Algorithm Selection Checklist

Ask:

```text
1. Why is randomness useful here?
2. What is random?
3. What is fixed?
4. What distribution is required?
5. Is uniformity required?
6. What is the expected complexity?
7. What is the worst-case complexity?
8. Is there an error probability?
9. Is the algorithm Las Vegas or Monte Carlo?
10. Can error be amplified?
11. What assumptions are required?
12. What happens in the tails?
13. Can the randomness be reproduced?
14. Is security-grade randomness required?
15. Does sampling change downstream behavior?
16. What is the memory cost?
17. What happens under adversarial input?
```

---

## 47. Interview Explanation Template

When explaining a randomized algorithm:

```text
1. State the problem.
2. Explain why deterministic behavior is problematic/expensive.
3. Identify the random choice.
4. Explain the distribution of that choice.
5. State the correctness guarantee.
6. Analyze expected complexity.
7. Analyze worst-case complexity.
8. State any error probability.
9. Explain assumptions.
10. Explain practical trade-offs.
```

---

## 48. Key Takeaways

1. Randomization is an algorithm-design technique, not decoration.
2. Expected complexity averages over random choices; average-case usually concerns an input distribution.
3. Expected and worst-case guarantees can differ substantially.
4. Linearity of expectation is one of the most powerful analysis tools.
5. Indicator variables turn event probabilities into expected costs.
6. Uniform random selection requires a correct probability distribution.
7. Fisher-Yates provides a standard uniform-shuffle construction.
8. Randomized Quicksort obtains O(n log n) expected performance while retaining an O(n²) worst case.
9. Las Vegas algorithms preserve correctness and randomize runtime/path behavior.
10. Monte Carlo algorithms allow controlled probability of error.
11. Error amplification can make small failure probabilities dramatically smaller.
12. Tail behavior matters in production systems.
13. Reservoir sampling enables uniform sampling from streams with O(k) memory.
14. Randomized hashing can reduce predictable collision attacks.
15. Randomized testing becomes much stronger when paired with a brute-force oracle.
16. Reproducible randomness is essential for debugging randomized tests.
17. Backend systems use randomization for sampling, load distribution, and retry jitter.
18. AI systems use sampling to control huge candidate spaces and approximate expensive computation.
19. Probabilistic data structures trade exactness for memory and speed.
20. Every probabilistic algorithm must state its guarantee and assumptions precisely.

---

## Revision Checklist

- [ ] I can distinguish deterministic and randomized algorithms.
- [ ] I can distinguish expected, average-case, worst-case, and amortized analysis.
- [ ] I understand expected value.
- [ ] I can use linearity of expectation.
- [ ] I understand indicator variables.
- [ ] I can perform uniform random selection.
- [ ] I can explain why a naive shuffle may be biased.
- [ ] I understand Fisher-Yates.
- [ ] I understand randomized Quicksort.
- [ ] I can explain adversarial-input resistance.
- [ ] I can distinguish Las Vegas and Monte Carlo algorithms.
- [ ] I understand error probability and amplification.
- [ ] I understand high-probability guarantees.
- [ ] I can reason about tail behavior.
- [ ] I understand reservoir sampling.
- [ ] I can explain randomized hashing and collisions.
- [ ] I can design randomized differential tests.
- [ ] I know why reproducible seeds matter.
- [ ] I can identify backend uses of randomization.
- [ ] I can identify AI sampling and approximation trade-offs.
