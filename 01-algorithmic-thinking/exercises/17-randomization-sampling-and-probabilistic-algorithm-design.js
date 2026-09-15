// 01.17 — Randomization, Sampling & Probabilistic Algorithm Design
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. State the probability model before implementing.
// 3. Distinguish expected behavior from worst-case guarantees.
// 4. Record seeds/inputs when building randomized tests.

// -----------------------------------------------------------------------------
// Exercise 01 — Expected Value
// -----------------------------------------------------------------------------
// A process takes 1 ms with probability 0.8 and 11 ms with probability 0.2.
// Calculate its expected runtime.
//
// Then create a second distribution with the same expected runtime but a very
// different tail profile. Explain why the systems may behave differently.

// -----------------------------------------------------------------------------
// Exercise 02 — Linearity of Expectation
// -----------------------------------------------------------------------------
// There are N independent-looking events, but do not assume independence unless
// necessary.
//
// Design indicator variables for counting how many events occur and derive the
// expected total using linearity of expectation.

// -----------------------------------------------------------------------------
// Exercise 03 — Uniform Random Index
// -----------------------------------------------------------------------------
// Implement a function that returns one uniformly random index from an array.
//
// Define the required probability for every index.
//
// Handle the empty-array case explicitly.

// -----------------------------------------------------------------------------
// Exercise 04 — Uniform Random Element
// -----------------------------------------------------------------------------
// Implement random selection from a non-empty array without changing the array.
//
// Explain why every element has equal probability.
//
// Discuss what changes if the array contains duplicate values.

// -----------------------------------------------------------------------------
// Exercise 05 — Fisher-Yates Shuffle
// -----------------------------------------------------------------------------
// Implement an in-place Fisher-Yates shuffle.
//
// Explain why the j-th random choice has range [0, i].
//
// Prove informally why each permutation receives equal probability.

// -----------------------------------------------------------------------------
// Exercise 06 — Detect Shuffle Bias
// -----------------------------------------------------------------------------
// Implement a deliberately naive shuffle.
//
// Run a large number of trials and count how frequently each permutation occurs
// for a tiny array such as [1, 2, 3].
//
// Compare the observed distribution with Fisher-Yates.
//
// Explain the source of the bias.

// -----------------------------------------------------------------------------
// Exercise 07 — Randomized Quicksort
// -----------------------------------------------------------------------------
// Implement Quicksort using a randomly selected pivot.
//
// Instrument the implementation to count comparisons.
//
// Run many trials on the same adversarially structured input.
//
// Compare observed behavior with a deterministic pivot strategy.

// -----------------------------------------------------------------------------
// Exercise 08 — Quicksort Complexity Reasoning
// -----------------------------------------------------------------------------
// For randomized Quicksort, explain:
// - why worst-case remains O(n^2),
// - why expected behavior is O(n log n),
// - why random pivot selection reduces predictable bad partitions.
//
// Do not rely only on memorized complexity; explain the probabilistic intuition.

// -----------------------------------------------------------------------------
// Exercise 09 — Randomized Quickselect
// -----------------------------------------------------------------------------
// Implement randomized Quickselect to find the k-th smallest element.
//
// Compare it with full sorting.
//
// Explain expected vs worst-case complexity.

// -----------------------------------------------------------------------------
// Exercise 10 — Reservoir Sampling, One Item
// -----------------------------------------------------------------------------
// Implement uniform sampling of one item from a stream whose length is unknown.
//
// You may iterate over the stream only once.
//
// Memory must remain O(1) apart from the input iterator.
//
// Explain why every stream item has equal final probability.

// -----------------------------------------------------------------------------
// Exercise 11 — Reservoir Sampling, K Items
// -----------------------------------------------------------------------------
// Extend Exercise 10 to maintain a uniform sample of K items.
//
// Requirements:
// - one pass,
// - O(K) memory,
// - unknown stream length.
//
// Prove the survival probability of an item after later stream elements arrive.

// -----------------------------------------------------------------------------
// Exercise 12 — Sampling Without Replacement
// -----------------------------------------------------------------------------
// Implement uniform selection of K distinct elements from a random-access array.
//
// Compare:
// A. partial Fisher-Yates,
// B. full shuffle followed by slicing.
//
// Analyze time and extra space.

// -----------------------------------------------------------------------------
// Exercise 13 — Las Vegas vs Monte Carlo
// -----------------------------------------------------------------------------
// Design two toy randomized algorithms:
// A. always correct but variable runtime,
// B. fixed/controlled runtime but with a measurable probability of error.
//
// Explain which is Las Vegas and which is Monte Carlo.

// -----------------------------------------------------------------------------
// Exercise 14 — Error Amplification
// -----------------------------------------------------------------------------
// An independent randomized trial has failure probability 0.1.
//
// Calculate the probability that all failures occur after:
// - 2 trials,
// - 3 trials,
// - 5 trials,
// - 10 trials.
//
// Then design a repetition strategy for a hypothetical one-sided-error algorithm.

// -----------------------------------------------------------------------------
// Exercise 15 — High-Probability Bound
// -----------------------------------------------------------------------------
// Create a randomized experiment and estimate the probability that its observed
// average differs from its expected value by more than a chosen threshold.
//
// Repeat the experiment for multiple sample sizes.
//
// Explain why larger sample sizes can improve concentration.

// -----------------------------------------------------------------------------
// Exercise 16 — Randomized Hashing Simulation
// -----------------------------------------------------------------------------
// Simulate hashing N generated keys into M buckets.
//
// Measure:
// - number of collisions,
// - maximum bucket size,
// - average bucket occupancy.
//
// Repeat using different random seeds and compare distributions.

// -----------------------------------------------------------------------------
// Exercise 17 — Birthday-Paradox Experiment
// -----------------------------------------------------------------------------
// Simulate the probability of at least one collision when choosing random values
// from a finite domain.
//
// Increase the number of samples gradually.
//
// Compare the observed collision probability with the square-root-of-domain
// intuition.

// -----------------------------------------------------------------------------
// Exercise 18 — Differential Randomized Testing
// -----------------------------------------------------------------------------
// Choose an algorithm that has:
// - a simple brute-force implementation,
// - a more optimized implementation.
//
// Generate many random valid inputs and compare outputs.
//
// When a mismatch occurs, record enough information to reproduce it.
//
// Add a strategy for shrinking/minimizing the failing input.

// -----------------------------------------------------------------------------
// Exercise 19 — Backend Retry Jitter
// -----------------------------------------------------------------------------
// Simulate many clients retrying after a shared failure.
//
// Compare:
// A. fixed retry delay,
// B. randomized jitter.
//
// Measure the number of retries occurring in each time bucket.
//
// Explain how randomness can reduce synchronized load spikes.

// -----------------------------------------------------------------------------
// Exercise 20 — AI Candidate Sampling
// -----------------------------------------------------------------------------
// Model an AI retrieval/ranking pipeline with a large candidate universe.
//
// Compare:
// A. exhaustive scoring,
// B. random candidate sampling followed by expensive scoring,
// C. stratified or heuristic candidate sampling.
//
// Measure:
// - computation,
// - recall of the best candidates,
// - sample size,
// - sensitivity to the sampling distribution.
//
// Explain when random sampling is useful and when it is unsafe.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can distinguish deterministic and randomized algorithms.
// [ ] I can distinguish expected and average-case analysis.
// [ ] I can calculate simple expected values.
// [ ] I understand linearity of expectation.
// [ ] I can use indicator variables.
// [ ] I understand uniform random selection.
// [ ] I can implement Fisher-Yates correctly.
// [ ] I can explain shuffle bias.
// [ ] I understand randomized Quicksort.
// [ ] I understand randomized Quickselect.
// [ ] I can distinguish Las Vegas and Monte Carlo algorithms.
// [ ] I understand error amplification.
// [ ] I can reason about high-probability guarantees.
// [ ] I can reason about tail behavior.
// [ ] I can implement reservoir sampling.
// [ ] I understand randomized hashing and collisions.
// [ ] I understand birthday-paradox intuition.
// [ ] I can build reproducible randomized tests.
// [ ] I can apply randomization to backend load shaping.
// [ ] I can evaluate sampling trade-offs in AI pipelines.
