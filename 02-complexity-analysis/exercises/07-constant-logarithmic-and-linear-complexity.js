/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.7 — Constant, Logarithmic & Linear Complexity
 *
 * Solve without looking at solutions.
 * Derive the execution count before assigning a complexity class.
 */

// ============================================================
// Exercise 01 — O(1)
// ============================================================
function exercise01(numbers, index) {
  return numbers[index];
}

// TODO: Explain why this is O(1) under the standard random-access model.


// ============================================================
// Exercise 02 — Constant Work
// ============================================================
function exercise02(x) {
  const a = x + 1;
  const b = a * 2;
  const c = b - 3;
  return c;
}

// TODO: Explain why several operations can still produce O(1) complexity.


// ============================================================
// Exercise 03 — O(n)
// ============================================================
function exercise03(numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

// TODO: Derive the tight complexity.


// ============================================================
// Exercise 04 — O(log n)
// ============================================================
function exercise04(n) {
  let steps = 0;

  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }

  return steps;
}

// TODO:
// 1. Write the sequence of n-values.
// 2. Derive the number of iterations.
// 3. Give the tight complexity.


// ============================================================
// Exercise 05 — Multiplicative Growth
// ============================================================
function exercise05(n) {
  let steps = 0;

  for (let i = 1; i < n; i *= 2) {
    steps++;
  }

  return steps;
}

// TODO: Explain why this is logarithmic rather than linear.


// ============================================================
// Exercise 06 — Division by Three
// ============================================================
function exercise06(n) {
  let steps = 0;

  while (n > 1) {
    n = Math.floor(n / 3);
    steps++;
  }

  return steps;
}

// TODO: Determine the complexity and explain why the logarithm base
// does not change the asymptotic class.


// ============================================================
// Exercise 07 — Linear Scan
// ============================================================
function exercise07(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// TODO: Give best-case and worst-case complexity.
// Explain when a linear scan is asymptotically optimal.


// ============================================================
// Exercise 08 — Logarithmic Outer Loop
// ============================================================
function exercise08(numbers) {
  let i = 1;
  let count = 0;

  while (i < numbers.length) {
    count++;
    i *= 2;
  }

  return count;
}

// TODO: Determine the complexity and justify it mathematically.


// ============================================================
// Exercise 09 — Logarithmic Iterations + Linear Work
// ============================================================
function exercise09(numbers) {
  let i = 1;
  let count = 0;

  while (i < numbers.length) {
    for (const number of numbers) {
      void number;
      count++;
    }

    i *= 2;
  }

  return count;
}

// TODO: Explain why this is not O(log n).
// Derive the total complexity.


// ============================================================
// Exercise 10 — Binary Search
// ============================================================
function exercise10(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return middle;

    if (numbers[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

// TODO:
// 1. State the input assumptions.
// 2. Explain search-space reduction.
// 3. Give worst-case complexity.


// ============================================================
// Exercise 11 — Logarithmic Loop With Extra Work
// ============================================================
function exercise11(numbers) {
  let x = numbers.length;

  while (x > 1) {
    const first = numbers[0];
    void first;
    x = Math.floor(x / 2);
  }
}

// TODO: The loop is logarithmic. What is the total complexity?
// Explain why the constant work inside each iteration does not change it.


// ============================================================
// Exercise 12 — Logarithmic Loop With Includes
// ============================================================
function exercise12(numbers, target) {
  let x = numbers.length;

  while (x > 1) {
    numbers.includes(target);
    x = Math.floor(x / 2);
  }
}

// TODO: Assume includes() is O(n) worst case.
// Derive the total complexity.


// ============================================================
// Exercise 13 — Sequential Linear Passes
// ============================================================
function exercise13(numbers) {
  let sum = 0;

  for (const number of numbers) {
    sum += number;
  }

  for (const number of numbers) {
    sum += number * 2;
  }

  return sum;
}

// TODO: Derive the total complexity before simplifying.


// ============================================================
// Exercise 14 — Preprocessing vs Queries
// ============================================================
// You have N records and Q queries.
// Strategy A scans all N records for every query.
// Strategy B sorts once in O(N log N), then answers every query in O(log N).
//
// TODO:
// 1. Write the total complexity of A.
// 2. Write the total complexity of B.
// 3. Explain when B becomes attractive.
// 4. Identify the hidden assumptions.


// ============================================================
// Exercise 15 — Balanced Tree Reasoning
// ============================================================
// A balanced binary search tree contains n nodes.
//
// TODO:
// 1. Explain why its height is O(log n).
// 2. Explain why a root-to-leaf lookup is O(log n).
// 3. Explain what happens to lookup complexity if the tree degenerates
//    into a chain.


// ============================================================
// Exercise 16 — Heap Reasoning
// ============================================================
// A binary heap contains n elements.
//
// TODO:
// Explain why moving an element from a leaf toward the root or from the
// root toward a leaf can take O(log n) time.
// Connect the answer to the height of the complete binary tree.


// ============================================================
// Exercise 17 — Constant vs Linear
// ============================================================
function exercise17(numbers) {
  return numbers[0];
}

function exercise17b(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total;
}

// TODO:
// Compare the two functions for n = 10 and n = 1,000,000.
// Explain which complexity class each belongs to and why.


// ============================================================
// Exercise 18 — Backend Cost Model
// ============================================================
function exercise18(cache, key) {
  return cache.get(key);
}

// TODO:
// Assume a hash-based Map with expected O(1) lookup.
// 1. Give the expected time complexity.
// 2. Explain why this is not a universal worst-case guarantee.
// 3. State one production factor that Big-O does not capture.


// ============================================================
// Exercise 19 — AI Candidate Processing
// ============================================================
function exercise19(candidates) {
  let best = -Infinity;

  for (const candidate of candidates) {
    const score = candidate.score;
    if (score > best) best = score;
  }

  return best;
}

// TODO:
// 1. Let K = candidates.length.
// 2. Give the tight time complexity.
// 3. Explain why this can be preferable to pairwise comparison.
// 4. State the auxiliary-space complexity.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function exercise20(numbers, target) {
  // Stage 1
  const first = numbers[0];
  void first;

  // Stage 2
  let x = numbers.length;
  while (x > 1) {
    x = Math.floor(x / 2);
  }

  // Stage 3
  for (const number of numbers) {
    if (number === target) return true;
  }

  // Stage 4
  x = numbers.length;
  while (x > 1) {
    for (const number of numbers) {
      void number;
    }
    x = Math.floor(x / 2);
  }

  return false;
}

// TODO:
// 1. Analyze each stage independently.
// 2. Combine the costs.
// 3. Give the tightest useful bound.
// 4. Explain why the logarithmic stages do not dominate the linear or
//    n log n stages.
// 5. State best-case and worst-case behavior where relevant.
