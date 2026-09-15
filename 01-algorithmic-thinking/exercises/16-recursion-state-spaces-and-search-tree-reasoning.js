// 01.16 — Recursion, State Spaces & Search-Tree Reasoning
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. For every recursive problem, identify state, base case, transition, and progress.
// 3. Analyze both total work and maximum recursion depth.
// 4. For search problems, reason about branching factor and state count.

// -----------------------------------------------------------------------------
// Exercise 01 — Recursive State
// -----------------------------------------------------------------------------
// Write a recursive function that computes the sum from 1 through N.
//
// Before coding, explicitly define:
// - state,
// - base case,
// - transition,
// - progress measure.
//
// Derive time and auxiliary-space complexity.

// -----------------------------------------------------------------------------
// Exercise 02 — Linear vs Logarithmic Recursion
// -----------------------------------------------------------------------------
// Implement two recursive functions:
// A. reduce n by 1 each call,
// B. reduce n by half each call.
//
// Draw their call chains and compare recursion depth.
//
// Explain why one is O(n) depth and the other O(log n) depth.

// -----------------------------------------------------------------------------
// Exercise 03 — Recurrence Derivation
// -----------------------------------------------------------------------------
// For each recurrence below, explain the recursive structure and determine the
// asymptotic complexity:
// A. T(n) = T(n - 1) + O(1)
// B. T(n) = T(n / 2) + O(1)
// C. T(n) = 2T(n / 2) + O(n)
// D. T(n) = 2T(n - 1) + O(1)

// -----------------------------------------------------------------------------
// Exercise 04 — Recursion Tree
// -----------------------------------------------------------------------------
// Draw the first four levels of the recursion tree for:
//   T(n) = 2T(n / 2) + O(n)
//
// Calculate the total non-recursive work at each level.
//
// Explain why the final complexity is O(n log n).

// -----------------------------------------------------------------------------
// Exercise 05 — Recursion Depth vs Work
// -----------------------------------------------------------------------------
// Design a recursive algorithm whose recursion depth is O(log n) but whose total
// work is greater than O(log n).
//
// Explain why depth and total work must be analyzed separately.

// -----------------------------------------------------------------------------
// Exercise 06 — Naive Fibonacci
// -----------------------------------------------------------------------------
// Implement recursive Fibonacci without memoization.
//
// Draw the call tree for fib(5).
//
// Identify repeated states and derive the exponential-growth intuition.

// -----------------------------------------------------------------------------
// Exercise 07 — Fibonacci Memoization
// -----------------------------------------------------------------------------
// Convert Exercise 06 into a memoized recursive solution.
//
// Identify the complete state.
//
// Explain why the number of unique states is linear and analyze time/space.

// -----------------------------------------------------------------------------
// Exercise 08 — Search Tree Counting
// -----------------------------------------------------------------------------
// Consider a search tree with branching factor approximately b and depth d.
//
// Estimate the number of nodes explored.
//
// Test your formula with:
// - b = 2, d = 5
// - b = 3, d = 4
// - b = 4, d = 6
//
// Explain why even modest branching can become expensive.

// -----------------------------------------------------------------------------
// Exercise 09 — Subset Search
// -----------------------------------------------------------------------------
// Generate all subsets of an array of N elements using recursion.
//
// Identify:
// - state,
// - two choices at each position,
// - depth,
// - number of leaves,
// - output size.
//
// Explain why the exponential behavior is unavoidable if every subset must be
// explicitly returned.

// -----------------------------------------------------------------------------
// Exercise 10 — Permutation Search
// -----------------------------------------------------------------------------
// Generate all permutations of N distinct elements.
//
// Draw the first levels of the search tree.
//
// Determine the number of leaves and explain how the branching factor changes as
// positions are filled.

// -----------------------------------------------------------------------------
// Exercise 11 — Backtracking State Restoration
// -----------------------------------------------------------------------------
// Build a backtracking solution that constructs sequences under a constraint.
//
// Explicitly identify:
// - mutable state,
// - apply step,
// - recursive step,
// - undo step.
//
// Add a test designed specifically to detect state leaking between sibling branches.

// -----------------------------------------------------------------------------
// Exercise 12 — Safe Pruning
// -----------------------------------------------------------------------------
// Solve a subset-selection problem where all values are non-negative and a partial
// sum exceeding the target makes success impossible.
//
// Add pruning.
//
// Prove why the pruning condition is safe.
//
// Explain why the same pruning rule would not necessarily be valid when negative
// values are allowed.

// -----------------------------------------------------------------------------
// Exercise 13 — Branch Ordering
// -----------------------------------------------------------------------------
// Design a branch-and-bound style search where choices can be explored in different
// orders.
//
// Compare:
// A. arbitrary ordering,
// B. promising-first ordering.
//
// Explain how finding a good solution earlier can strengthen later pruning.

// -----------------------------------------------------------------------------
// Exercise 14 — State Equivalence
// -----------------------------------------------------------------------------
// Construct a recursive problem where two different histories reach the same
// future-relevant state.
//
// Identify the minimal state that determines all future decisions.
//
// Explain why histories with the same state can share a memoized result.

// -----------------------------------------------------------------------------
// Exercise 15 — Wrong Memoization State
// -----------------------------------------------------------------------------
// Create a small recursive problem with at least two state variables.
//
// Intentionally memoize using only one variable.
//
// Find an input where the cache returns an incorrect result.
//
// Then define the correct complete state.

// -----------------------------------------------------------------------------
// Exercise 16 — Recursive DFS
// -----------------------------------------------------------------------------
// Implement recursive DFS on an adjacency-list graph.
//
// Include cycle handling.
//
// Explain the role of the visited set as part of the algorithmic state.
//
// Analyze time, auxiliary memory, and maximum recursion depth.

// -----------------------------------------------------------------------------
// Exercise 17 — Recursive vs Iterative DFS
// -----------------------------------------------------------------------------
// Implement the same DFS using:
// A. recursion,
// B. an explicit stack.
//
// Compare their state representation, complexity, and JavaScript stack-safety.
//
// Explain why changing implementation style does not automatically change the
// underlying search space.

// -----------------------------------------------------------------------------
// Exercise 18 — Top-Down vs Bottom-Up DP
// -----------------------------------------------------------------------------
// Choose a recursive overlapping-subproblem problem.
//
// Implement:
// A. plain recursion,
// B. top-down memoization,
// C. bottom-up dynamic programming.
//
// Compare:
// - number of states evaluated,
// - memory,
// - recursion depth,
// - implementation complexity.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Search Tree
// -----------------------------------------------------------------------------
// Model a small AI-style search problem where each state has several possible next
// actions.
//
// Implement a bounded beam-search-like strategy that retains only the best B states
// at each level.
//
// Explain:
// - state representation,
// - branching factor,
// - depth,
// - pruning/beam limitation,
// - quality vs computation trade-off.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Search-Space Analysis
// -----------------------------------------------------------------------------
// Choose a non-trivial recursive/backtracking problem and produce a complete
// analysis:
//
// 1. Define the state.
// 2. Define the base case.
// 3. Define all transitions.
// 4. Prove termination.
// 5. Estimate branching factor.
// 6. Estimate maximum depth.
// 7. Derive the naive search-tree complexity.
// 8. Identify repeated states, if any.
// 9. Add memoization if valid.
// 10. Identify safe pruning opportunities.
// 11. Analyze worst-case complexity after pruning.
// 12. Analyze maximum memory usage.
// 13. Compare recursive and iterative implementations.
// 14. Explain a backend or AI engineering application.
//
// Finish with an interview-style explanation of why your final design explores the
// required state space efficiently.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can define recursive state precisely.
// [ ] I can identify base cases.
// [ ] I can prove recursive progress/termination.
// [ ] I can derive recurrences.
// [ ] I can draw recursion trees.
// [ ] I can distinguish recursion depth from total work.
// [ ] I understand branching-factor growth.
// [ ] I can identify exponential search spaces.
// [ ] I can identify overlapping states.
// [ ] I can explain memoization as unique-state reuse.
// [ ] I can distinguish search trees from state graphs.
// [ ] I can implement safe backtracking state restoration.
// [ ] I can prove pruning conditions.
// [ ] I understand branch ordering and branch-and-bound intuition.
// [ ] I can define minimal sufficient memoization state.
// [ ] I can implement recursive DFS with cycle handling.
// [ ] I can compare recursive and iterative DFS.
// [ ] I understand top-down vs bottom-up DP.
// [ ] I can analyze AI search-space limitations such as beam width.
// [ ] I can perform a complete search-space analysis from first principles.
