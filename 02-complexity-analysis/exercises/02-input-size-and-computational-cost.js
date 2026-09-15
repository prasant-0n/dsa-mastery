/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.2 — Input Size & Computational Cost
 *
 * Instructions:
 * - Solve every exercise without looking up a solution first.
 * - Write your reasoning before writing code when requested.
 * - For complexity exercises, define the input-size parameters explicitly.
 * - Do not simply write a Big-O label; explain what work is being counted.
 */

// ============================================================
// Exercise 01 — Define Input Size
// ============================================================
// Given an array of users, state the most natural input-size
// parameter for the following operation:
//
//   Count how many users are present.
//
// TODO: Write your answer as a comment.


// ============================================================
// Exercise 02 — Multiple Input Parameters
// ============================================================
// Given two arrays `a` and `b`, define the independent input-size
// parameters needed to analyze an algorithm that compares every
// element of `a` with every element of `b`.
//
// TODO: Write the parameters and explain why one `n` is insufficient.


// ============================================================
// Exercise 03 — Work Per Element
// ============================================================
function exercise03(numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

// TODO:
// 1. Define the input-size parameter.
// 2. Identify the dominant operation.
// 3. State how many times it executes.
// 4. Derive the time complexity.
// 5. Derive auxiliary space complexity.


// ============================================================
// Exercise 04 — Pairwise Work
// ============================================================
function exercise04(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      count++;
    }
  }

  return count;
}

// TODO: Derive the exact number of iterations as a function of n,
// then give the asymptotic time complexity.


// ============================================================
// Exercise 05 — Matrix Dimensions
// ============================================================
function exercise05(matrix) {
  let count = 0;

  for (const row of matrix) {
    for (const value of row) {
      count += value;
    }
  }

  return count;
}

// TODO:
// Assume the matrix has r rows and c columns.
// Derive time complexity using r and c.
// Explain when it would be valid to describe it as O(n²).


// ============================================================
// Exercise 06 — Nested Does Not Always Mean n²
// ============================================================
function exercise06(n) {
  let j = 0;
  let operations = 0;

  for (let i = 0; i < n; i++) {
    while (j < n) {
      j++;
      operations++;
    }
  }

  return operations;
}

// TODO: Determine the total number of executions of the while-body.
// Explain why this is NOT O(n²).


// ============================================================
// Exercise 07 — Independent Parameters
// ============================================================
function exercise07(a, b) {
  let count = 0;

  for (const x of a) {
    for (const y of b) {
      if (x === y) count++;
    }
  }

  return count;
}

// TODO: Let n = a.length and m = b.length.
// Derive time complexity and explain why O(n²) is not the most
// precise general expression.


// ============================================================
// Exercise 08 — Constraints and Feasibility
// ============================================================
// A problem has n <= 25 and requires exploring every subset.
//
// TODO:
// 1. Express the number of subsets.
// 2. Estimate the number when n = 25.
// 3. Explain why exponential complexity may still be considered.


// ============================================================
// Exercise 09 — Cost Function
// ============================================================
// An algorithm performs:
//   - 4 operations for every input element
//   - 10 setup operations
//
// TODO:
// 1. Write an exact cost function.
// 2. Give the asymptotic time complexity.
// 3. Explain which information is discarded when simplifying it.


// ============================================================
// Exercise 10 — Expensive Operation
// ============================================================
function exercise10(users, loadPermissions) {
  const result = [];

  for (const user of users) {
    result.push(loadPermissions(user.id));
  }

  return result;
}

// TODO:
// Build a realistic cost model for this function when
// loadPermissions performs a database query.
// Identify the important workload parameters and explain why
// counting only JavaScript loop iterations is incomplete.


// ============================================================
// Exercise 11 — Output Size
// ============================================================
function exercise11(numbers) {
  const output = [];

  for (const number of numbers) {
    output.push(number * 2);
  }

  return output;
}

// TODO:
// 1. Analyze time complexity.
// 2. Analyze output space.
// 3. Analyze auxiliary space separately.
// 4. Explain why producing n outputs imposes a lower-bound intuition.


// ============================================================
// Exercise 12 — Repeated Work
// ============================================================
function exercise12(items) {
  for (const item of items) {
    expensiveOperation(item);
  }
}

function expensiveOperation(item) {
  for (let i = 0; i < itemsGlobal.length; i++) {
    // Simulated expensive work.
    void item;
  }
}

const itemsGlobal = [];

// TODO: Assume items.length = n and itemsGlobal.length = m.
// Model the total work using n and m.
// Do not collapse the two parameters without justification.


// ============================================================
// Exercise 13 — Backend Workload Model
// ============================================================
// An API receives B users in a batch. For every user it performs
// one database lookup and then scans K permission records returned
// by that lookup.
//
// TODO:
// Define the relevant parameters and build a simple computational
// cost model. Identify which part may dominate in practice.


// ============================================================
// Exercise 14 — Search Candidate Reduction
// ============================================================
// A search system has N documents but an index produces K candidates.
// Every candidate is then reranked using constant work per candidate.
//
// TODO:
// 1. What is the reranking complexity?
// 2. Why is K more relevant than N for this stage?
// 3. What relationship between K and N makes the optimization useful?


// ============================================================
// Exercise 15 — Benchmark vs Growth
// ============================================================
// Algorithm A takes 20 ms for n = 1,000.
// Algorithm B takes 10 ms for n = 1,000.
// A is O(n), B is O(n²).
//
// TODO: Explain why the single benchmark is insufficient to choose
// the algorithm for an unknown future workload.
// Give an example of what additional experiment you would run.


// ============================================================
// Exercise 16 — Dominant Cost
// ============================================================
function exercise16(numbers) {
  numbers.sort((a, b) => a - b);

  let sum = 0;
  for (const number of numbers) {
    sum += number;
  }

  return sum;
}

// TODO:
// Identify the major computational stages.
// Which stage dominates asymptotically for n elements?
// Explain why the loop does not change the final asymptotic class.


// ============================================================
// Exercise 17 — Three Dimensions
// ============================================================
// A program processes a 3D data cube with dimensions x, y, z.
// It visits every cell exactly once.
//
// TODO:
// 1. Give the time complexity using all three dimensions.
// 2. State the assumption needed to write it as O(n³).


// ============================================================
// Exercise 18 — Database Scan vs Request Size
// ============================================================
// An API request contains only 2 filters, but the database examines
// 5 million rows before returning 50 results.
//
// TODO: Explain why the request payload size is not an adequate
// measure of the algorithmic workload. Identify a more meaningful
// parameter for analyzing this operation.


// ============================================================
// Exercise 19 — Complexity Interview Explanation
// ============================================================
function exercise19(numbers) {
  const seen = new Set();

  for (const number of numbers) {
    if (seen.has(number)) return true;
    seen.add(number);
  }

  return false;
}

// TODO: Prepare a 30-second interview explanation covering:
// - input-size parameter
// - dominant operation
// - expected time complexity
// - auxiliary space complexity
// - the assumption behind Set lookup complexity


// ============================================================
// Exercise 20 — Synthesis
// ============================================================
// Design two solutions for this problem:
//
// Given n user IDs, determine whether any ID occurs more than once.
//
// Requirements:
// 1. Give a brute-force approach.
// 2. Give an optimized approach.
// 3. Define the input-size parameter.
// 4. Derive time and space complexity for both.
// 5. Explain the representation change that produces the optimization.
// 6. State one practical backend trade-off.
//
// TODO: Write your analysis first, then implement both functions.

function duplicateBruteForce(userIds) {
  // TODO
}

function duplicateOptimized(userIds) {
  // TODO
}
