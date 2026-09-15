/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.9 — Exponential & Factorial Complexity
 *
 * Solve without looking at solutions.
 * Model the search space before assigning a complexity class.
 */

// ============================================================
// Exercise 01 — Growth Classification
// ============================================================
// Classify each as polynomial, exponential, or factorial:
//
// A. O(n²)
// B. O(2ⁿ)
// C. O(n!)
// D. O(n³)
// E. O(3ⁿ)
// F. O(n log n)
//
// TODO: Explain the defining structural difference between the classes.


// ============================================================
// Exercise 02 — Binary Recursive Branching
// ============================================================
function exercise02(n) {
  if (n === 0) return;

  exercise02(n - 1);
  exercise02(n - 1);
}

// TODO:
// 1. Write the recurrence.
// 2. Describe the recursion tree.
// 3. Give the asymptotic time complexity.
// 4. Give the recursion-depth space complexity.


// ============================================================
// Exercise 03 — Subset Count
// ============================================================
// TODO: An input contains n independent binary choices.
// 1. Derive the number of possible states.
// 2. Explain why this produces 2^n.
// 3. Explain the lower bound if every state must be explicitly output.


// ============================================================
// Exercise 04 — Three-Way Branching
// ============================================================
function exercise04(n) {
  if (n === 0) return;

  exercise04(n - 1);
  exercise04(n - 1);
  exercise04(n - 1);
}

// TODO: Derive the complexity using branching factor and depth.


// ============================================================
// Exercise 05 — Branching Factor
// ============================================================
// A search tree has branching factor b = 4 and depth d.
//
// TODO:
// 1. Estimate the number of nodes asymptotically.
// 2. Explain why the result is exponential in d.
// 3. What happens if the depth increases by one?


// ============================================================
// Exercise 06 — Naive Fibonacci
// ============================================================
function exercise06(n) {
  if (n <= 1) return n;

  return exercise06(n - 1) + exercise06(n - 2);
}

// TODO:
// 1. Write the recurrence.
// 2. Explain why overlapping subproblems exist.
// 3. Give a safe Big-O upper bound.
// 4. Explain the tighter Fibonacci-related growth if you know it.


// ============================================================
// Exercise 07 — Memoization
// ============================================================
function exercise07(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);

  const value = exercise07(n - 1, memo) + exercise07(n - 2, memo);
  memo.set(n, value);
  return value;
}

// TODO:
// 1. Identify the unique state represented by n.
// 2. Explain why each state is computed once.
// 3. Give time complexity.
// 4. Give auxiliary space complexity.
// 5. Contrast it with naive Fibonacci.


// ============================================================
// Exercise 08 — Subset Generation
// ============================================================
function exercise08(items, index = 0, current = []) {
  if (index === items.length) {
    console.log(current);
    return;
  }

  current.push(items[index]);
  exercise08(items, index + 1, current);
  current.pop();

  exercise08(items, index + 1, current);
}

// TODO:
// 1. Identify the branching factor.
// 2. Identify the depth.
// 3. Count the leaves.
// 4. Give a suitable time bound when printing each subset is considered
//    separately.
// 5. Give recursion-space complexity excluding output storage.


// ============================================================
// Exercise 09 — Permutation Count
// ============================================================
// TODO:
// 1. Derive the number of permutations of n distinct items.
// 2. Explain why the first position has n choices, the second n-1, etc.
// 3. Give the resulting complexity for explicit permutation enumeration.


// ============================================================
// Exercise 10 — Permutation Generation
// ============================================================
function exercise10(items, start = 0) {
  if (start === items.length) {
    console.log(items);
    return;
  }

  for (let i = start; i < items.length; i++) {
    [items[start], items[i]] = [items[i], items[start]];
    exercise10(items, start + 1);
    [items[start], items[i]] = [items[i], items[start]];
  }
}

// TODO:
// 1. Derive the number of leaves.
// 2. Estimate the recursion-tree size.
// 3. If printing each complete permutation costs Θ(n), what is the total
//    output-processing complexity?


// ============================================================
// Exercise 11 — Factorial vs Exponential
// ============================================================
// TODO: Compare 2^n and n!.
// 1. Compute both for n = 10.
// 2. Compute both for n = 20.
// 3. Explain why factorial eventually grows faster than any fixed-base
//    exponential.


// ============================================================
// Exercise 12 — Pruning
// ============================================================
// A backtracking algorithm has a theoretical search tree of O(2^n),
// but it prunes branches that violate a constraint.
//
// TODO:
// 1. Explain how pruning affects practical work.
// 2. Explain why this does not automatically prove a polynomial worst-case
//    complexity.
// 3. Give one example of a safe pruning condition.


// ============================================================
// Exercise 13 — Memoization vs Pruning
// ============================================================
// TODO: Explain the difference between:
//
//     pruning
//     memoization
//
// Then describe a search problem where both techniques can be useful.


// ============================================================
// Exercise 14 — Exponential Time, Linear Space
// ============================================================
function exercise14(n) {
  if (n === 0) return;

  exercise14(n - 1);
  exercise14(n - 1);
}

// TODO: Explain why this can have exponential total time but only O(n)
// recursion-stack space.
// Distinguish total calls from maximum simultaneous depth.


// ============================================================
// Exercise 15 — BFS State Explosion
// ============================================================
// A BFS explores a state space with branching factor b and depth d.
//
// TODO:
// 1. Estimate the total number of nodes.
// 2. Estimate the largest frontier size near depth d.
// 3. Explain why BFS can require exponential memory.


// ============================================================
// Exercise 16 — 0/1 Knapsack
// ============================================================
// A naive recursive knapsack algorithm makes two choices for every item:
// include or exclude.
//
// TODO:
// 1. Give the approximate recursion-tree complexity.
// 2. Identify the repeated state dimensions.
// 3. Explain how DP can reduce the repeated computation.
// 4. Explain why O(nW) is called pseudo-polynomial.


// ============================================================
// Exercise 17 — Backend Configuration Search
// ============================================================
// A backend has n independent binary configuration flags and attempts to
// validate every possible configuration.
//
// TODO:
// 1. How many configurations exist?
// 2. Give the brute-force complexity if validation per configuration is O(1).
// 3. Give two strategies that could reduce the practical search space.


// ============================================================
// Exercise 18 — Scheduling Permutations
// ============================================================
// A scheduler tries every ordering of n distinct jobs.
//
// TODO:
// 1. How many schedules are considered?
// 2. If evaluating one schedule costs O(n), what is the total cost?
// 3. Name three algorithmic alternatives that may avoid exhaustive search.


// ============================================================
// Exercise 19 — AI Search
// ============================================================
// An AI search process has branching factor b and depth d.
//
// TODO:
// 1. Give the naive search-tree complexity.
// 2. Explain how beam width B changes the search behavior conceptually.
// 3. Explain the quality/optimality trade-off introduced by pruning to B.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function exercise20(n) {
  if (n <= 0) return 1;

  const left = exercise20(n - 1);
  const right = exercise20(n - 1);

  return left + right;
}

// TODO:
// 1. Write the recurrence.
// 2. Solve or tightly bound the recurrence.
// 3. Determine maximum recursion depth.
// 4. Determine total time complexity.
// 5. Determine auxiliary-space complexity.
// 6. Explain whether memoization would help this exact function.
// 7. Explain how the answer would change if the recursive calls represented
//    the same logical state repeatedly.
