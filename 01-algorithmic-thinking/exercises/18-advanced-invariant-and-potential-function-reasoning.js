// 01.18 — Advanced Invariants & Potential-Function Reasoning
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. Write the invariant/progress argument before coding.
// 3. Separate correctness proof from complexity proof.
// 4. For amortized problems, state the potential explicitly.

// -----------------------------------------------------------------------------
// Exercise 01 — Design a Useful Invariant
// -----------------------------------------------------------------------------
// Write a loop that scans an array and determines whether a target exists.
//
// Before coding, define a strong invariant that relates the processed prefix to
// the search result.
//
// Prove initialization, maintenance, and termination.

// -----------------------------------------------------------------------------
// Exercise 02 — Weak vs Strong Invariant
// -----------------------------------------------------------------------------
// For a sorting/searching loop, write:
// A. one true but nearly useless invariant,
// B. one strong invariant that helps prove correctness.
//
// Explain why the second is more useful.

// -----------------------------------------------------------------------------
// Exercise 03 — Binary Search Proof
// -----------------------------------------------------------------------------
// Implement binary search on a sorted array.
//
// Explicitly define:
// - invariant,
// - initialization,
// - maintenance,
// - termination condition,
// - postcondition,
// - ranking/progress function.
//
// Include tests for empty input, singleton input, boundaries, and missing values.

// -----------------------------------------------------------------------------
// Exercise 04 — Termination Without Correctness
// -----------------------------------------------------------------------------
// Construct an algorithm that definitely terminates but returns an incorrect
// result.
//
// Explain why termination alone does not establish correctness.

// -----------------------------------------------------------------------------
// Exercise 05 — Correctness Without Termination
// -----------------------------------------------------------------------------
// Construct a loop whose invariant is correct but whose implementation can run
// forever.
//
// Identify the missing progress argument.

// -----------------------------------------------------------------------------
// Exercise 06 — Ranking Function
// -----------------------------------------------------------------------------
// For a recursive interval-reduction algorithm, define a non-negative ranking
// function that strictly decreases on every recursive transition.
//
// Prove that the recursion terminates.

// -----------------------------------------------------------------------------
// Exercise 07 — Lexicographic Progress
// -----------------------------------------------------------------------------
// Design a nested recursive or iterative process where a single scalar progress
// measure is awkward.
//
// Define a tuple-valued lexicographic ranking function and prove termination.

// -----------------------------------------------------------------------------
// Exercise 08 — Backtracking Soundness
// -----------------------------------------------------------------------------
// Implement a backtracking generator for constrained sequences.
//
// Prove that every returned sequence is valid.
//
// Your proof must explicitly identify the state invariant.

// -----------------------------------------------------------------------------
// Exercise 09 — Backtracking Completeness
// -----------------------------------------------------------------------------
// Extend Exercise 08 to prove that every valid solution is reachable.
//
// Identify exactly where each legal choice is explored.
//
// Explain how an unsafe pruning rule could destroy completeness.

// -----------------------------------------------------------------------------
// Exercise 10 — Safe Pruning Proof
// -----------------------------------------------------------------------------
// Solve a subset-sum-style problem with non-negative values.
//
// Add a pruning rule based on the current sum.
//
// Prove formally that the pruned branch cannot contain a valid solution.

// -----------------------------------------------------------------------------
// Exercise 11 — Branch-and-Bound
// -----------------------------------------------------------------------------
// Design an optimization search where each partial state has an upper or lower
// bound on the best possible completion.
//
// Implement branch-and-bound.
//
// Explain why the bound preserves correctness.

// -----------------------------------------------------------------------------
// Exercise 12 — Dynamic Array Potential
// -----------------------------------------------------------------------------
// Model a dynamic array that doubles capacity when full.
//
// Define a potential function.
//
// Calculate the amortized cost of:
// - ordinary insertion,
// - insertion that triggers resize.
//
// Show why the total cost of N insertions is O(N).

// -----------------------------------------------------------------------------
// Exercise 13 — Two-Stack Queue Potential
// -----------------------------------------------------------------------------
// Implement a queue using two stacks.
//
// Identify an appropriate potential function.
//
// Explain why an occasional O(n) transfer still produces O(1) amortized queue
// operations.

// -----------------------------------------------------------------------------
// Exercise 14 — Monotonic Stack
// -----------------------------------------------------------------------------
// Implement a next-greater-element style monotonic-stack algorithm.
//
// The code contains a loop that can pop many elements.
//
// Prove total O(n) stack operations using aggregate or potential reasoning.

// -----------------------------------------------------------------------------
// Exercise 15 — Sliding Window Amortization
// -----------------------------------------------------------------------------
// Implement a sliding-window algorithm containing nested while/for behavior.
//
// Prove that each pointer moves only O(n) times.
//
// Explain why the visual nesting does not imply O(n^2).

// -----------------------------------------------------------------------------
// Exercise 16 — Heap Invariant
// -----------------------------------------------------------------------------
// Implement sift-up and sift-down for a binary heap.
//
// For each operation, define the heap invariant before and after the transition.
//
// Prove that the operation restores the invariant.

// -----------------------------------------------------------------------------
// Exercise 17 — LRU Cache Invariants
// -----------------------------------------------------------------------------
// Implement an LRU cache using a Map and doubly linked list.
//
// Define at least three invariants connecting:
// - map membership,
// - linked-list membership,
// - recency order.
//
// After every operation, verify the invariants with assertions.

// -----------------------------------------------------------------------------
// Exercise 18 — Backend Rate Limiter
// -----------------------------------------------------------------------------
// Model a token-bucket rate limiter.
//
// Define the state and prove the invariant:
//   0 <= tokens <= capacity
//
// Prove that refill and consume transitions preserve the invariant.
//
// Add a bounded retry/progress rule for rejected requests if appropriate.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Top-K Invariant
// -----------------------------------------------------------------------------
// Implement streaming Top-K retrieval using a min-heap.
//
// Maintain the invariant:
//   heap contains the best K items seen so far.
//
// Prove the invariant after each processed item.
//
// Analyze time and memory.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Proof-Driven Algorithm Review
// -----------------------------------------------------------------------------
// Choose a non-trivial algorithm and perform a complete engineering proof review.
//
// Document:
// 1. Problem contract.
// 2. Preconditions.
// 3. State representation.
// 4. Core invariant.
// 5. Initialization proof.
// 6. Maintenance proof.
// 7. Ranking/progress function.
// 8. Termination proof.
// 9. Postcondition proof.
// 10. Soundness.
// 11. Completeness, if applicable.
// 12. Any pruning proof.
// 13. Complexity proof.
// 14. Peak-memory proof.
// 15. Potential function, if amortized reasoning applies.
// 16. Production failure modes.
// 17. Backend or AI application.
// 18. A deliberately adversarial test suite.
//
// Finish with a concise interview explanation proving both correctness and
// complexity.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can design a useful invariant instead of merely identify one.
// [ ] I can prove initialization.
// [ ] I can prove maintenance.
// [ ] I can connect termination to the postcondition.
// [ ] I can design ranking functions.
// [ ] I understand well-founded progress.
// [ ] I can prove backtracking soundness.
// [ ] I can reason about completeness.
// [ ] I can prove pruning is safe.
// [ ] I understand branch-and-bound correctness.
// [ ] I can define a potential function.
// [ ] I can derive amortized cost from potential changes.
// [ ] I understand dynamic-array amortization.
// [ ] I understand two-stack queue amortization.
// [ ] I can prove monotonic-stack O(n) total operations.
// [ ] I can use representation invariants for data structures.
// [ ] I can reason about backend state invariants.
// [ ] I can reason about AI Top-K invariants.
// [ ] I can separate correctness and complexity proofs.
// [ ] I can perform a complete proof-driven algorithm review.
