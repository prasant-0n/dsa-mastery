// 01.11 — Randomized Algorithms, Expected Complexity & Probabilistic Reasoning
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. State the probability model before claiming an expected bound.
// 3. Distinguish expected, worst-case, amortized, and high-probability guarantees.
// 4. For Monte Carlo algorithms, quantify the error probability where possible.
// 5. Do not use non-cryptographic randomness for security-sensitive exercises.

// -----------------------------------------------------------------------------
// Exercise 01 — Uniform Random Index
// -----------------------------------------------------------------------------
// Implement a function that chooses an array index uniformly at random.
//
// Verify conceptually that every index has probability 1 / n.
//
// Then explain why ordinary pseudorandomness is different from cryptographic
// randomness.

// -----------------------------------------------------------------------------
// Exercise 02 — Expected Cost
// -----------------------------------------------------------------------------
// An operation has the following random costs:
// - cost 1 with probability 0.5
// - cost 3 with probability 0.3
// - cost 10 with probability 0.2
//
// Calculate the expected cost.
//
// Then explain why expected cost does not mean every execution costs that amount.

// -----------------------------------------------------------------------------
// Exercise 03 — Expected vs Worst Case
// -----------------------------------------------------------------------------
// Construct an algorithm whose:
// - expected runtime is O(n),
// - worst-case runtime is O(n^2).
//
// Explain exactly what randomness causes the difference.

// -----------------------------------------------------------------------------
// Exercise 04 — Reservoir Sampling, k = 1
// -----------------------------------------------------------------------------
// Implement reservoir sampling for a stream where you want exactly one uniformly
// random item.
//
// Derive the invariant:
// “After processing i items, every processed item has probability 1/i of being
// the selected item.”

// -----------------------------------------------------------------------------
// Exercise 05 — Reservoir Sampling, General k
// -----------------------------------------------------------------------------
// Implement reservoir sampling for k items from an unknown-length stream.
//
// Analyze:
// - runtime,
// - memory,
// - uniformity invariant.
//
// Explain why storing the complete stream is unnecessary.

// -----------------------------------------------------------------------------
// Exercise 06 — Randomized Quicksort
// -----------------------------------------------------------------------------
// Implement quicksort with a randomly selected pivot.
//
// Analyze:
// - partition cost,
// - balanced recursion,
// - highly unbalanced recursion,
// - expected runtime,
// - worst-case runtime,
// - recursion-space behavior.

// -----------------------------------------------------------------------------
// Exercise 07 — Quicksort Pivot Experiment
// -----------------------------------------------------------------------------
// Generate several input shapes:
// - sorted,
// - reverse sorted,
// - random,
// - many duplicates.
//
// Compare a deterministic pivot strategy against randomized pivot selection.
//
// Record observations and explain why empirical results do not replace a formal
// complexity argument.

// -----------------------------------------------------------------------------
// Exercise 08 — Randomized Hashing Model
// -----------------------------------------------------------------------------
// Model n keys being assigned to m buckets.
//
// Calculate the probability of no collision using:
//   (m/m) * ((m-1)/m) * ...
//
// Then calculate the probability of at least one collision.
//
// Test the intuition with small values of n and m.

// -----------------------------------------------------------------------------
// Exercise 09 — Birthday-Paradox Intuition
// -----------------------------------------------------------------------------
// For a fixed number of buckets, find approximately how many random assignments
// make a collision likely.
//
// Explain why collisions become likely much earlier than n = m.
//
// Do not rely only on memorized thresholds; derive the intuition.

// -----------------------------------------------------------------------------
// Exercise 10 — Las Vegas Classification
// -----------------------------------------------------------------------------
// Create or identify a randomized algorithm that always returns a correct answer
// but whose runtime depends on random choices.
//
// Explain why it is a Las Vegas algorithm.
//
// State:
// - correctness guarantee,
// - expected runtime,
// - worst-case runtime.

// -----------------------------------------------------------------------------
// Exercise 11 — Monte Carlo Classification
// -----------------------------------------------------------------------------
// Design a simple randomized estimation algorithm that can return an incorrect
// answer with a known probability.
//
// State:
// - runtime bound,
// - error probability,
// - assumptions,
// - how repeated trials could reduce error.

// -----------------------------------------------------------------------------
// Exercise 12 — Error Amplification
// -----------------------------------------------------------------------------
// A randomized test fails with probability p on an independent trial.
//
// For several values of p and k, calculate:
//   p^k
//
// where all k trials must fail for the combined procedure to fail.
//
// Explain the independence assumption.

// -----------------------------------------------------------------------------
// Exercise 13 — Expected vs High Probability
// -----------------------------------------------------------------------------
// Construct two runtime distributions with similar expected runtime but very
// different tails.
//
// Explain why a backend engineer might prefer the algorithm with the better tail
// even if its expected runtime is not the absolute minimum.

// -----------------------------------------------------------------------------
// Exercise 14 — Reproducible Randomness
// -----------------------------------------------------------------------------
// Build a small seedable pseudorandom abstraction or use a simple deterministic
// pseudo-random generator for an experiment.
//
// Demonstrate:
// - same seed → same sequence,
// - different seed → different sequence.
//
// Explain why this is useful for debugging and algorithm experiments.

// -----------------------------------------------------------------------------
// Exercise 15 — Randomized Sampling for Logs
// -----------------------------------------------------------------------------
// Design a sampler for a high-volume log stream.
//
// Compare:
// A. keep every event,
// B. keep every kth event,
// C. uniform reservoir sampling.
//
// Analyze memory, sampling bias, and suitability for unknown stream length.

// -----------------------------------------------------------------------------
// Exercise 16 — Backend Load Distribution
// -----------------------------------------------------------------------------
// Model requests being assigned to servers.
//
// Compare:
// A. deterministic assignment by key,
// B. random assignment,
// C. a load-aware strategy.
//
// Explain how skewed request sizes can defeat naive random balancing.

// -----------------------------------------------------------------------------
// Exercise 17 — AI Candidate Sampling
// -----------------------------------------------------------------------------
// Suppose an AI retrieval pipeline has a huge candidate pool.
//
// Design a randomized sampling stage before expensive ranking.
//
// Analyze:
// - candidate reduction,
// - expected computation,
// - memory,
// - retrieval quality risk,
// - reproducibility.

// -----------------------------------------------------------------------------
// Exercise 18 — Randomized Testing
// -----------------------------------------------------------------------------
// Build a randomized test harness for a sorting function.
//
// Generate random arrays containing:
// - duplicates,
// - negatives,
// - empty arrays,
// - large values,
// - already sorted data.
//
// Compare the implementation against a trusted oracle.
//
// Store any minimal failing case as a regression test.

// -----------------------------------------------------------------------------
// Exercise 19 — Security Boundary
// -----------------------------------------------------------------------------
// Consider a backend feature that generates unpredictable tokens.
//
// Explain why a normal algorithmic pseudorandom generator may be inappropriate.
//
// Identify the properties required from a cryptographic randomness source.
//
// Do not implement a custom cryptographic generator.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Randomized Algorithm Analysis
// -----------------------------------------------------------------------------
// Choose one randomized algorithm and produce a production-grade analysis:
//
// 1. What is randomized?
// 2. What probability model is assumed?
// 3. What is the correctness guarantee?
// 4. What is expected runtime?
// 5. What is worst-case runtime?
// 6. Is there a high-probability guarantee?
// 7. What is the memory complexity?
// 8. What are the tail risks?
// 9. Is reproducibility required?
// 10. Is the random source appropriate?
// 11. Can an adversary influence inputs?
// 12. What operational metrics should be monitored?
//
// Finish by explaining why the phrase “randomized = faster” is an insufficient
// engineering argument.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I understand why randomized algorithms exist.
// [ ] I can calculate expected cost from a probability distribution.
// [ ] I distinguish expected and worst-case runtime.
// [ ] I distinguish expected and amortized complexity.
// [ ] I understand uniform random selection.
// [ ] I understand reservoir sampling.
// [ ] I understand randomized quicksort.
// [ ] I can reason about hash collisions probabilistically.
// [ ] I understand Las Vegas algorithms.
// [ ] I understand Monte Carlo algorithms.
// [ ] I understand error amplification.
// [ ] I distinguish expected performance from tail performance.
// [ ] I understand reproducible randomness.
// [ ] I know why cryptographic randomness is a separate concern.
// [ ] I can apply randomized reasoning to backend systems.
// [ ] I can apply randomized reasoning to AI retrieval/search.
// [ ] I can state the exact guarantee of a randomized algorithm.
