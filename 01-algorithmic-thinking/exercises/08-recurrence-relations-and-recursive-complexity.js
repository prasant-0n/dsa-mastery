// 01.8 — Recurrence Relations & Recursive Complexity
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. Derive the recurrence from the code before solving it.
// 3. Always analyze runtime, recursion depth, and auxiliary space separately.
// 4. Draw a recursion tree for branching recurrences when useful.
// 5. Do not apply the Master Theorem unless its form and conditions fit.

// -----------------------------------------------------------------------------
// Exercise 01 — Linear Recursion
// -----------------------------------------------------------------------------
// Implement countdown(n) recursively.
//
// Derive:
// - base case,
// - recurrence,
// - total runtime,
// - recursion depth,
// - auxiliary stack space.

// -----------------------------------------------------------------------------
// Exercise 02 — Linear Recursion with Linear Work
// -----------------------------------------------------------------------------
// Write a recursive function that performs O(n) work before calling itself with
// n - 1.
//
// Derive and solve the recurrence.
// Explain why linear recursion depth does not imply linear total runtime.

// -----------------------------------------------------------------------------
// Exercise 03 — Halving Recursion
// -----------------------------------------------------------------------------
// Implement a function that repeatedly replaces n with floor(n / 2).
//
// Derive:
// - recurrence,
// - recursion depth,
// - runtime,
// - stack space.
//
// Explain the logarithm using repeated halving rather than memorization.

// -----------------------------------------------------------------------------
// Exercise 04 — One Half-Sized Call + Linear Work
// -----------------------------------------------------------------------------
// Implement a recursive function with:
// - one recursive call on n / 2,
// - O(n) work outside recursion.
//
// Derive and solve the recurrence.
//
// Explain why the result is not O(n log n).

// -----------------------------------------------------------------------------
// Exercise 05 — Two Half-Sized Calls
// -----------------------------------------------------------------------------
// Implement a merge-sort-shaped recursion:
// - two calls on n / 2,
// - O(n) combine work.
//
// Derive the recurrence and analyze it using:
// - recursion tree,
// - Master Theorem.

// -----------------------------------------------------------------------------
// Exercise 06 — Recursion Tree
// -----------------------------------------------------------------------------
// For T(n) = 2T(n/2) + n:
//
// Draw at least four recursion levels.
// For each level record:
// - number of nodes,
// - work per node,
// - total work at the level.
//
// Then derive the final complexity.

// -----------------------------------------------------------------------------
// Exercise 07 — Naive Fibonacci
// -----------------------------------------------------------------------------
// Implement fibonacciNaive(n).
//
// Draw the call tree for fib(6).
// Count repeated states.
// Derive the recurrence:
//   T(n) = T(n - 1) + T(n - 2) + O(1)
//
// Give an exponential upper bound and explain why the repeated work occurs.

// -----------------------------------------------------------------------------
// Exercise 08 — Fibonacci Memoization
// -----------------------------------------------------------------------------
// Implement fibonacciMemoized(n).
//
// State the memo-table invariant.
//
// Compare:
// - distinct states,
// - recursive calls,
// - runtime,
// - stack space,
// - memoization space.

// -----------------------------------------------------------------------------
// Exercise 09 — Recurrence Classification
// -----------------------------------------------------------------------------
// Determine the asymptotic complexity of each:
// A. T(n) = T(n - 1) + O(1)
// B. T(n) = T(n - 1) + O(n)
// C. T(n) = T(n / 2) + O(1)
// D. T(n) = T(n / 2) + O(n)
// E. T(n) = 2T(n / 2) + O(1)
// F. T(n) = 2T(n / 2) + O(n)
// G. T(n) = 2T(n - 1) + O(1)
// H. T(n) = T(n - 1) + T(n - 2) + O(1)
//
// For each, explain the reasoning rather than writing only the final Big-O.

// -----------------------------------------------------------------------------
// Exercise 10 — Master Theorem Practice
// -----------------------------------------------------------------------------
// Solve these using the Master Theorem where applicable:
// A. 2T(n/2) + n
// B. 4T(n/2) + n
// C. 4T(n/2) + n^2
// D. 8T(n/2) + n^2
// E. T(n/2) + 1
//
// For each, identify a, b, f(n), and n^(log_b a).

// -----------------------------------------------------------------------------
// Exercise 11 — Master Theorem Rejection
// -----------------------------------------------------------------------------
// Explain why the basic Master Theorem does not directly apply to:
// A. T(n) = T(n - 1) + n
// B. T(n) = T(n - 1) + T(n - 2) + 1
// C. T(n) = T(n/2) + T(n/3) + n
//
// Choose an alternative analysis technique for each.

// -----------------------------------------------------------------------------
// Exercise 12 — Expansion Method
// -----------------------------------------------------------------------------
// Solve by repeated expansion:
//   T(n) = T(n - 1) + n
//
// Write enough expansion steps to reveal the summation.
// Then use the summation to derive the final asymptotic bound.

// -----------------------------------------------------------------------------
// Exercise 13 — Work per Level
// -----------------------------------------------------------------------------
// Analyze a recursive function with recurrence:
//   T(n) = 3T(n/3) + O(n)
//
// Determine:
// - recursion depth,
// - nodes per level,
// - work per node,
// - total work per level,
// - total runtime.

// -----------------------------------------------------------------------------
// Exercise 14 — Recursion Depth vs Runtime
// -----------------------------------------------------------------------------
// Compare two algorithms:
// A. depth O(n), runtime O(n)
// B. depth O(log n), runtime O(n log n)
//
// Explain why these are not contradictory.
//
// Then give one recursive example matching each shape.

// -----------------------------------------------------------------------------
// Exercise 15 — Sequential Recursive Calls
// -----------------------------------------------------------------------------
// Analyze:
//
// function f(n) {
//   if (n <= 1) return;
//   f(n - 1);
//   f(n - 1);
// }
//
// Determine:
// - total number of calls,
// - runtime,
// - maximum simultaneous stack depth.
//
// Explain why total calls and active stack frames are different quantities.

// -----------------------------------------------------------------------------
// Exercise 16 — Recursive Search with Pruning
// -----------------------------------------------------------------------------
// Design a backtracking search with branching factor approximately b and depth d.
//
// Analyze the unpruned search space.
// Then introduce a pruning condition and explain how it changes the number of
// explored states.
//
// Do not claim a new Big-O bound without stating the pruning assumptions.

// -----------------------------------------------------------------------------
// Exercise 17 — Backend Recursion
// -----------------------------------------------------------------------------
// Model recursive processing of a hierarchical structure such as nested folders.
//
// Analyze:
// - total nodes N,
// - maximum nesting depth D,
// - per-node work,
// - stack space,
// - worst-case behavior for a deeply nested structure.
//
// Explain when iterative traversal would be safer operationally.

// -----------------------------------------------------------------------------
// Exercise 18 — AI Search Tree
// -----------------------------------------------------------------------------
// Assume an AI search process has branching factor b and depth d.
//
// Calculate the approximate number of nodes without pruning.
// Then analyze how retaining only K candidates per level changes the search shape.
//
// Explain the trade-off between search breadth, quality, runtime, and memory.

// -----------------------------------------------------------------------------
// Exercise 19 — Derive Recurrence from Code
// -----------------------------------------------------------------------------
// Analyze each recursive function you write or encounter using this template:
//
// 1. Base case
// 2. Input size
// 3. Number of recursive calls
// 4. Size of each recursive input
// 5. Non-recursive work
// 6. Recurrence
// 7. Recurrence solution
// 8. Recursion depth
// 9. Auxiliary space
//
// Apply the template to at least five different recursive algorithms.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Complexity Defense
// -----------------------------------------------------------------------------
// Choose one recursive algorithm you previously implemented.
//
// Prepare an interview-ready explanation covering:
// - why the recurrence has its exact form,
// - why the solution is correct,
// - why the runtime has its final bound,
// - why stack space has its final bound,
// - whether memoization or pruning could change the complexity.
//
// Finish by identifying one production concern that Big-O alone does not capture.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can derive a recurrence directly from recursive code.
// [ ] I can identify base cases and non-recursive work.
// [ ] I can distinguish one recursive call from branching recursion.
// [ ] I can solve linear recursive recurrences by expansion.
// [ ] I can reason about logarithmic depth from repeated halving.
// [ ] I can draw and analyze a recursion tree.
// [ ] I can apply the Master Theorem when its form fits.
// [ ] I know when the Master Theorem does not apply directly.
// [ ] I distinguish recursion depth from total runtime.
// [ ] I calculate active stack space rather than total call count.
// [ ] I understand why naive Fibonacci is exponential.
// [ ] I understand how memoization changes the computational structure.
// [ ] I understand how pruning changes branching search.
// [ ] I can analyze recursive backend and AI workloads.
// [ ] I can defend a recursive complexity result in an interview.
