// 01.4 — Brute Force, Optimization & Trade-Offs
//
// Rules:
// 1. Keep every exercise unsolved until you can explain the reasoning.
// 2. For optimization exercises, write the brute-force baseline first.
// 3. Record time and auxiliary-space complexity for both versions.
// 4. State the exact observation that makes the optimization possible.
// 5. Test optimized solutions against the brute-force version on small inputs.
// 6. Add edge cases before considering an exercise complete.

// -----------------------------------------------------------------------------
// Exercise 01 — Pair Sum: Brute Force
// -----------------------------------------------------------------------------
// Implement twoSumBruteForce(nums, target).
// Return the indices of two distinct values whose sum equals target, or [-1, -1].
// Use every valid pair as the baseline search.
//
// Requirements:
// - Explain why checking j from i + 1 is sufficient.
// - Record best, average, and worst-case behavior where meaningful.
// - Record auxiliary space.

// -----------------------------------------------------------------------------
// Exercise 02 — Pair Sum: Hash Optimization
// -----------------------------------------------------------------------------
// Implement twoSumOptimized(nums, target) using a Map.
//
// Requirements:
// - Write Exercise 01 first.
// - Identify exactly which repeated work is removed.
// - Explain why checking the needed complement works.
// - Compare time/space with brute force.

// -----------------------------------------------------------------------------
// Exercise 03 — Duplicate Detection
// -----------------------------------------------------------------------------
// Implement:
//   hasDuplicateBruteForce(values)
//   hasDuplicateSet(values)
//
// Compare their complexity and explain the time/space trade-off.
//
// Also answer:
// - When would the brute-force version be acceptable?
// - What does “O(1) average lookup” mean for Set?

// -----------------------------------------------------------------------------
// Exercise 04 — Range Sum: Brute Force vs Prefix Sum
// -----------------------------------------------------------------------------
// Given nums and many [left, right] queries, implement:
//   rangeSumBruteForce(nums, left, right)
//   buildPrefixSum(nums)
//   rangeSumWithPrefix(prefix, left, right)
//
// Requirements:
// - Analyze one query and many-query workloads separately.
// - Explain when preprocessing is worth its cost.
// - Define the prefix-sum invariant.

// -----------------------------------------------------------------------------
// Exercise 05 — Multiple Range Queries
// -----------------------------------------------------------------------------
// Given an array and Q range-sum queries, implement a complete solver twice:
// 1. Traverse every requested range.
// 2. Precompute prefix sums and answer each query efficiently.
//
// Measure the total asymptotic cost in terms of n and Q.

// -----------------------------------------------------------------------------
// Exercise 06 — Pair Sum in a Sorted Array
// -----------------------------------------------------------------------------
// Implement:
//   twoSumSortedBruteForce(nums, target)
//   twoSumSortedTwoPointers(nums, target)
//
// The input is sorted for the optimized version.
//
// Requirements:
// - Explain why moving the left pointer is safe when the sum is too small.
// - Explain why moving the right pointer is safe when the sum is too large.
// - State the invariant maintained by the two pointers.

// -----------------------------------------------------------------------------
// Exercise 07 — Search: Linear vs Binary
// -----------------------------------------------------------------------------
// Implement:
//   linearSearchSorted(nums, target)
//   binarySearch(nums, target)
//
// Compare their worst-case time complexity.
//
// Requirements:
// - Explain what information sorting provides.
// - Explain exactly which region is eliminated after each binary-search step.
// - Include empty, one-element, first-element, last-element, and absent-target cases.

// -----------------------------------------------------------------------------
// Exercise 08 — Top-K: Full Sort vs Heap
// -----------------------------------------------------------------------------
// Implement two approaches for returning the k largest values:
// 1. Sort all values and take the final k.
// 2. Maintain a min-heap of size k.
//
// Requirements:
// - Implement the heap yourself; do not use a library priority queue.
// - Analyze O(n log n) vs O(n log k).
// - Analyze auxiliary space.
// - Explain why a full ordering is unnecessary when only K values matter.

// -----------------------------------------------------------------------------
// Exercise 09 — Longest Valid Contiguous Range
// -----------------------------------------------------------------------------
// Choose a condition for which a sliding-window solution is valid, for example:
// “find the longest contiguous subarray whose sum is <= limit” for non-negative
// numbers.
//
// Implement:
//   longestValidBruteForce(nums, limit)
//   longestValidWindow(nums, limit)
//
// Requirements:
// - Explain why non-negative values matter.
// - Identify the monotonic property used to shrink the window safely.
// - Do not apply sliding window without proving the required property.

// -----------------------------------------------------------------------------
// Exercise 10 — Naive Fibonacci vs Memoization
// -----------------------------------------------------------------------------
// Implement:
//   fibonacciNaive(n)
//   fibonacciMemoized(n)
//
// Requirements:
// - Draw the repeated-subproblem structure for a small n.
// - Count or estimate recursive calls.
// - Explain exactly what memoization stores.
// - Compare time and space complexity.

// -----------------------------------------------------------------------------
// Exercise 11 — Build a Brute-Force Oracle
// -----------------------------------------------------------------------------
// Pick a small combinatorial problem and implement the simplest correct
// exhaustive solution you can.
//
// Then write a second, optimized solution for the same contract.
//
// Document:
// - Input contract
// - Output contract
// - Why the oracle is correct
// - Why the optimized version should be equivalent

// -----------------------------------------------------------------------------
// Exercise 12 — Differential Testing
// -----------------------------------------------------------------------------
// Generate many random small inputs and compare:
//   expected = bruteForce(input)
//   actual   = optimized(input)
//
// Requirements:
// - Use deterministic randomness or a fixed seed if practical.
// - Stop and print the smallest failing input when outputs differ.
// - Include hand-written edge cases.
// - Do not compare only one random example.

// -----------------------------------------------------------------------------
// Exercise 13 — Choose the Algorithm
// -----------------------------------------------------------------------------
// For each scenario, choose an approach and justify it:
// A. n <= 20, operation runs once.
// B. n = 1,000,000, operation runs once.
// C. Same array, 100,000 range-sum queries.
// D. Need only the largest 20 values from 10 million values.
// E. Need membership checks for every incoming event.
// F. Search a sorted collection repeatedly.
//
// For each answer, state time, space, and the key structural clue.

// -----------------------------------------------------------------------------
// Exercise 14 — Optimize Only After Finding the Bottleneck
// -----------------------------------------------------------------------------
// Take one intentionally inefficient implementation from an earlier chapter.
//
// Before changing code, write:
// - What operation dominates runtime?
// - How many times is it repeated?
// - What input size makes it problematic?
// - What evidence would you collect in production?
//
// Only then implement an optimization.

// -----------------------------------------------------------------------------
// Exercise 15 — Same Big-O, Different Constants
// -----------------------------------------------------------------------------
// Implement two asymptotically O(n) versions of the same task, such as summing
// or counting values.
//
// Compare:
// - allocations,
// - intermediate arrays,
// - callback/function-call overhead,
// - memory behavior,
// - readability.
//
// Use a representative benchmark rather than a single tiny input.
//
// Explain why Big-O alone cannot determine production performance.

// -----------------------------------------------------------------------------
// Exercise 16 — When Extra Memory Is Worth It
// -----------------------------------------------------------------------------
// Pick three algorithms where an O(n) memory structure reduces runtime.
//
// For each one, document:
// - memory consumed,
// - time saved,
// - workload that benefits,
// - workload where the extra memory may not be justified.

// -----------------------------------------------------------------------------
// Exercise 17 — When Brute Force Is Better
// -----------------------------------------------------------------------------
// Create three realistic scenarios where the brute-force solution is preferable
// to a more sophisticated alternative.
//
// Consider:
// - small constraints,
// - low frequency,
// - correctness/maintainability,
// - memory constraints,
// - use as a testing oracle.

// -----------------------------------------------------------------------------
// Exercise 18 — Backend Optimization Scenario
// -----------------------------------------------------------------------------
// You receive 500,000 request records and need to remove duplicate request IDs.
// Implement and compare at least two approaches.
//
// Then design a version suitable for a streaming workload where all records
// cannot remain in memory indefinitely.
//
// Discuss:
// - time,
// - memory,
// - retention policy,
// - correctness of deduplication,
// - operational trade-offs.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Retrieval Optimization Scenario
// -----------------------------------------------------------------------------
// Assume a corpus contains millions of vectors and a query must retrieve the
// nearest candidates.
//
// Explain and model these stages:
//   brute-force comparison
//       ↓
//   candidate generation / indexing
//       ↓
//   Top-K retrieval
//       ↓
//   expensive reranking
//
// You do not need to implement a production ANN index yet.
// Focus on identifying where exhaustive work becomes infeasible and how a
// multi-stage architecture reduces expensive computation.

// -----------------------------------------------------------------------------
// Exercise 20 — Trade-Off Table
// -----------------------------------------------------------------------------
// Create a table comparing at least five algorithm pairs.
//
// Columns:
// - Problem
// - Brute-force approach
// - Optimized approach
// - Time before
// - Time after
// - Space before
// - Space after
// - Structural observation
// - Correctness risk
// - Production trade-off
//
// Finish by writing one paragraph answering:
// “What did the optimized algorithm actually change about the computation?”

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// Before moving to 01.5, you should be able to:
// [ ] Write a correct brute-force baseline.
// [ ] Identify repeated work without guessing a pattern.
// [ ] Explain why a data structure removes that work.
// [ ] Recognize when sorting exposes useful structure.
// [ ] Prove when two pointers or sliding window are safe.
// [ ] Use preprocessing when query volume justifies it.
// [ ] Recognize repeated subproblems.
// [ ] Explain time-space trade-offs.
// [ ] Build and use a brute-force oracle.
// [ ] Differential-test an optimized solution.
// [ ] Distinguish asymptotic improvement from constant-factor tuning.
// [ ] Explain an optimization clearly in an interview.
// [ ] Make a production decision using constraints, workload, memory, and
//     maintainability rather than Big-O alone.
