// 01.6 — Edge Cases, Defensive Reasoning & Failure Modes
//
// Rules:
// 1. Keep exercises unsolved.
// 2. Derive tests from the contract and algorithm assumptions.
// 3. For every implementation, include boundary and adversarial cases.
// 4. When a solution fails, minimize the failing input and identify the violated
//    assumption or invariant.

// -----------------------------------------------------------------------------
// Exercise 01 — Edge-Case Matrix
// -----------------------------------------------------------------------------
// Pick any array algorithm from earlier chapters.
// Build an edge-case matrix covering:
// - empty input, if allowed,
// - one element,
// - two elements,
// - minimum values,
// - maximum values,
// - duplicates,
// - all equal,
// - sorted,
// - reverse sorted,
// - target absent/present at boundaries.
//
// For every test, explain which assumption it attacks.

// -----------------------------------------------------------------------------
// Exercise 02 — Empty Input Contract
// -----------------------------------------------------------------------------
// Implement a function that returns the maximum value of an array.
//
// Choose and document one explicit empty-input contract:
// - return undefined,
// - return a sentinel,
// - or reject the input.
//
// Explain why silently returning an arbitrary value would be incorrect.

// -----------------------------------------------------------------------------
// Exercise 03 — Singleton and Pair Boundaries
// -----------------------------------------------------------------------------
// Implement a pair-sum function.
//
// Test:
// - [],
// - [5],
// - [5, 5],
// - [2, 3], target 5,
// - [2, 3], target 6.
//
// Decide whether the same index may be used twice and make the contract explicit.

// -----------------------------------------------------------------------------
// Exercise 04 — Duplicate Semantics
// -----------------------------------------------------------------------------
// Implement a function whose behavior depends on duplicate values.
//
// Compare these inputs:
// - [1, 1]
// - [1, 2, 1]
// - [1, 1, 1]
// - [1, 2, 3]
//
// Explicitly distinguish:
// - unique values,
// - unique indices,
// - frequency counts.

// -----------------------------------------------------------------------------
// Exercise 05 — Boundary Search Tests
// -----------------------------------------------------------------------------
// Build a complete test set for binarySearch(nums, target):
// - empty,
// - one element present,
// - one element absent,
// - target first,
// - target last,
// - target below minimum,
// - target above maximum,
// - target between values,
// - duplicate target values.
//
// For every case, explain what the final candidate interval should be.

// -----------------------------------------------------------------------------
// Exercise 06 — Off-by-One Bug Hunt
// -----------------------------------------------------------------------------
// Write a deliberately broken loop that processes an array boundary incorrectly.
//
// Then create the smallest input that exposes the bug.
//
// Record:
// - intended interval,
// - actual interval,
// - failing input,
// - exact incorrect iteration,
// - corrected boundary.

// -----------------------------------------------------------------------------
// Exercise 07 — Negative Values Break an Assumption
// -----------------------------------------------------------------------------
// Implement the longest subarray with sum <= limit using sliding window for
// non-negative numbers.
//
// Then create an input containing negative values where the strategy fails or
// where its monotonicity argument no longer holds.
//
// Explain precisely which assumption disappeared.

// -----------------------------------------------------------------------------
// Exercise 08 — Mutation During Traversal
// -----------------------------------------------------------------------------
// Implement removeEvens(nums) in-place.
//
// First write a version that accidentally skips adjacent even values.
// Then construct the smallest failing input.
// Finally fix the algorithm using one of:
// - controlled index adjustment,
// - reverse traversal,
// - write-pointer compaction.
//
// Compare the trade-offs.

// -----------------------------------------------------------------------------
// Exercise 09 — Aliasing Failure
// -----------------------------------------------------------------------------
// Create two variables referencing the same array.
//
// Pass one into a function that mutates it.
//
// Demonstrate how the other variable changes.
// Then create a non-mutating version and explain the space cost.

// -----------------------------------------------------------------------------
// Exercise 10 — Recursive No-Progress Failure
// -----------------------------------------------------------------------------
// Write a recursive function that can fail to terminate because the recursive
// call does not reduce the problem.
//
// Then identify:
// - intended progress measure,
// - missing progress,
// - corrected recursive step,
// - termination argument.

// -----------------------------------------------------------------------------
// Exercise 11 — Backtracking State Leak
// -----------------------------------------------------------------------------
// Implement a small subset/permutation-style backtracking algorithm.
//
// Introduce a bug by forgetting to undo a choice.
//
// Find the smallest input where one branch contaminates another.
//
// State the invariant for the path state before each sibling branch.

// -----------------------------------------------------------------------------
// Exercise 12 — Hashing Contract Bug
// -----------------------------------------------------------------------------
// Implement a frequency counter.
//
// Create two versions:
// - membership only,
// - frequency counting.
//
// Construct a problem where using Set instead of a frequency Map/object produces
// the wrong answer.
//
// Explain the state invariant for the frequency structure.

// -----------------------------------------------------------------------------
// Exercise 13 — Numeric Boundary Reasoning
// -----------------------------------------------------------------------------
// Investigate arithmetic near:
// - Number.MAX_SAFE_INTEGER,
// - Number.MIN_SAFE_INTEGER.
//
// Create examples showing why exact integer reasoning can become unsafe outside
// the safe range.
//
// Then identify when BigInt would be appropriate and what API/type trade-offs it
// introduces.

// -----------------------------------------------------------------------------
// Exercise 14 — String Edge Cases
// -----------------------------------------------------------------------------
// Build tests for a palindrome function covering:
// - "",
// - "a",
// - "aa",
// - "ab",
// - spaces,
// - mixed case,
// - repeated characters,
// - Unicode characters.
//
// Decide which behaviors belong in the contract rather than assuming them.

// -----------------------------------------------------------------------------
// Exercise 15 — Minimal Counterexample
// -----------------------------------------------------------------------------
// Take one intentionally broken algorithm from an earlier exercise.
//
// Start with a failing input of at least 10 elements.
// Repeatedly remove elements while preserving failure until you reach a minimal
// or near-minimal counterexample.
//
// Document every reduction and identify the violated assumption.

// -----------------------------------------------------------------------------
// Exercise 16 — Property-Based Tests
// -----------------------------------------------------------------------------
// Choose a sorting algorithm and write property checks for:
// - sorted output,
// - same element multiset before and after,
// - idempotence: sort(sort(x)) === sort(x).
//
// Do not rely only on a list of expected arrays.

// -----------------------------------------------------------------------------
// Exercise 17 — Differential Testing
// -----------------------------------------------------------------------------
// Choose one brute-force and one optimized implementation from 01.4.
//
// Generate many small random inputs and compare their outputs.
//
// Requirements:
// - preserve the first failing input,
// - print both outputs,
// - minimize the failing input when possible,
// - add the discovered regression case to the permanent test set.

// -----------------------------------------------------------------------------
// Exercise 18 — Defensive Validation Boundary
// -----------------------------------------------------------------------------
// Design an API boundary for a function that requires sorted input.
//
// Compare three designs:
// 1. trust the caller,
// 2. validate sortedness,
// 3. sort internally.
//
// Analyze:
// - correctness,
// - runtime,
// - mutation,
// - memory,
// - maintainability.
//
// Decide where validation should live in a production system.

// -----------------------------------------------------------------------------
// Exercise 19 — Backend Failure-Mode Matrix
// -----------------------------------------------------------------------------
// Design edge cases for each:
//
// A. LRU cache
// B. Rate limiter
// C. Queue
// D. Cursor pagination
//
// For each, cover:
// - empty state,
// - capacity boundary,
// - repeated operation,
// - invalid transition,
// - concurrent or retry-related behavior,
// - resource exhaustion.
//
// State the expected behavior for every case.

// -----------------------------------------------------------------------------
// Exercise 20 — AI Retrieval Failure-Mode Matrix
// -----------------------------------------------------------------------------
// Design tests for a Top-K vector retrieval stage covering:
// - empty corpus,
// - K = 0,
// - K > corpus size,
// - duplicate vectors,
// - identical scores,
// - dimension mismatch,
// - no result above threshold,
// - extremely large candidate set.
//
// For each case, define the contract and expected behavior.

// -----------------------------------------------------------------------------
// Exercise 21 — Adversarial Test Design
// -----------------------------------------------------------------------------
// Choose one algorithm and list every assumption it makes.
//
// For each assumption:
// 1. Determine whether the contract permits it to fail.
// 2. If yes, construct a test that attacks it.
// 3. If no, document the precondition explicitly.
//
// Finish by identifying which assumption is most dangerous in production.

// -----------------------------------------------------------------------------
// Exercise 22 — Full Failure-Oriented Review
// -----------------------------------------------------------------------------
// Take one solution from this repository and perform a complete review.
//
// Produce:
// - input contract,
// - output contract,
// - assumptions,
// - invariants,
// - boundary cases,
// - adversarial cases,
// - resource limits,
// - mutation behavior,
// - termination argument,
// - likely production failure modes,
// - tests covering each category.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I derive edge cases from constraints rather than memorizing them.
// [ ] I test empty, singleton, and boundary inputs when the contract permits them.
// [ ] I attack uniqueness and ordering assumptions.
// [ ] I can identify off-by-one failures.
// [ ] I can identify mutation and aliasing failures.
// [ ] I can construct minimal counterexamples.
// [ ] I can use property-based reasoning.
// [ ] I can differential-test an optimized algorithm.
// [ ] I know when defensive validation belongs at a system boundary.
// [ ] I can reason about backend operational failure modes.
// [ ] I can reason about AI retrieval edge cases.
// [ ] I can review an algorithm by attacking its assumptions before declaring it robust.
