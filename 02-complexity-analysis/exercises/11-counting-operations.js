/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.11 — Counting Operations
 *
 * Goal: derive complexity by counting work, not by guessing from syntax.
 */

// ============================================================
// Exercise 01 — Single Loop
// ============================================================
function exercise01(n) {
  for (let i = 0; i < n; i++) {
    doWork();
  }
}

function doWork() {}

// TODO: Count body executions and give the asymptotic complexity.


// ============================================================
// Exercise 02 — Constant Multiplier
// ============================================================
function exercise02(n) {
  for (let i = 0; i < n; i++) {
    doWork();
    doWork();
    doWork();
    doWork();
    doWork();
  }
}

// TODO: Derive an approximate operation count and simplify it.


// ============================================================
// Exercise 03 — Sequential Loops
// ============================================================
function exercise03(n) {
  for (let i = 0; i < n; i++) doWork();
  for (let j = 0; j < n; j++) doWork();
  for (let k = 0; k < n; k++) doWork();
}

// TODO: Add the costs. Do not multiply them.


// ============================================================
// Exercise 04 — Different Parameters
// ============================================================
function exercise04(n, m) {
  for (let i = 0; i < n; i++) doWork();
  for (let j = 0; j < m; j++) doWork();
}

// TODO: Give the tight bound in terms of n and m.


// ============================================================
// Exercise 05 — Nested Loops
// ============================================================
function exercise05(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      doWork();
    }
  }
}

// TODO: Count total body executions.


// ============================================================
// Exercise 06 — Triangular Loop
// ============================================================
function exercise06(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      doWork();
    }
  }
}

// TODO:
// 1. Write the exact summation.
// 2. Simplify the summation.
// 3. Give Θ complexity.


// ============================================================
// Exercise 07 — Reverse Triangular Loop
// ============================================================
function exercise07(n) {
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      doWork();
    }
  }
}

// TODO: Derive the number of executions using a summation.


// ============================================================
// Exercise 08 — Cubic Sum
// ============================================================
function exercise08(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i * i; j++) {
      doWork();
    }
  }
}

// TODO:
// Express the total work as Σ i² and derive the final complexity.


// ============================================================
// Exercise 09 — Multiplicative Loop
// ============================================================
function exercise09(n) {
  for (let i = 1; i < n; i *= 2) {
    doWork();
  }
}

// TODO: Derive the iteration count mathematically.


// ============================================================
// Exercise 10 — Linear × Logarithmic
// ============================================================
function exercise10(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j *= 2) {
      doWork();
    }
  }
}

// TODO: Count outer and inner iterations separately, then combine.


// ============================================================
// Exercise 11 — Two Pointers
// ============================================================
function exercise11(items) {
  let left = 0;
  let right = items.length - 1;

  while (left < right) {
    if (items[left] < items[right]) left++;
    else right--;
  }
}

// TODO: Explain why the loop is Θ(n), not Θ(n²).
// Bound the total number of pointer movements.


// ============================================================
// Exercise 12 — Helper Function Cost
// ============================================================
function exercise12(items) {
  for (const item of items) {
    expensiveHelper(items);
  }
}

function expensiveHelper(items) {
  for (const item of items) {
    doWork();
  }
}

// TODO: Analyze exercise12 when items.length = n.
// Explain why the helper function cannot be treated as O(1).


// ============================================================
// Exercise 13 — Conditional Branch
// ============================================================
function exercise13(items) {
  for (const item of items) {
    if (item > 0) doWork();
    else doWork();
  }
}

// TODO: Explain why the two branches add rather than multiply.


// ============================================================
// Exercise 14 — Pairwise Comparisons
// ============================================================
function exercise14(items) {
  let count = 0;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      count++;
    }
  }

  return count;
}

// TODO:
// 1. Derive the exact number of pairs.
// 2. Give the asymptotic complexity.
// 3. Explain the output-size interpretation.


// ============================================================
// Exercise 15 — Harmonic Pattern
// ============================================================
function exercise15(n) {
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < Math.floor(n / i); j++) {
      doWork();
    }
  }
}

// TODO:
// Express the work as n(1 + 1/2 + ... + 1/n) and derive the bound.


// ============================================================
// Exercise 16 — Sequential Function Calls
// ============================================================
function exercise16(items) {
  linearPass(items);
  quadraticPass(items);
}

function linearPass(items) {
  for (const item of items) doWork();
}

function quadraticPass(items) {
  for (const a of items) {
    for (const b of items) doWork();
  }
}

// TODO: Add the two costs and simplify.


// ============================================================
// Exercise 17 — JavaScript Built-in Cost
// ============================================================
function exercise17(items, targets) {
  let found = 0;

  for (const target of targets) {
    if (items.includes(target)) found++;
  }

  return found;
}

// Assume items.length = n and targets.length = m.
// TODO: Analyze the complexity under the ordinary linear-scan behavior
// of Array.prototype.includes.


// ============================================================
// Exercise 18 — Backend N+1 Query Shape
// ============================================================
async function exercise18(users) {
  const results = [];

  for (const user of users) {
    const permissions = await loadPermissions(user.id);
    results.push({ user, permissions });
  }

  return results;
}

async function loadPermissions(userId) {
  // Represents one database/network operation.
}

// TODO:
// If there are n users, count the database operations.
// Explain why the query count matters independently of CPU complexity.


// ============================================================
// Exercise 19 — AI Pairwise Similarity
// ============================================================
function exercise19(vectors) {
  let total = 0;

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      total += similarity(vectors[i], vectors[j]);
    }
  }

  return total;
}

function similarity(a, b) {
  // Assume Θ(d), where d is vector dimension.
  return 0;
}

// TODO:
// If there are n vectors of dimension d, derive the total complexity.


// ============================================================
// Exercise 20 — Full Counting Synthesis
// ============================================================
function exercise20(items, m) {
  for (let i = 0; i < items.length; i++) {
    for (let j = 1; j < m; j *= 2) {
      doWork();
    }
  }

  for (let k = 0; k < items.length; k++) {
    expensiveHelper(items);
  }
}

// TODO:
// Let n = items.length.
// 1. Analyze the first nested section.
// 2. Analyze the second section.
// 3. Add the costs.
// 4. Give the final tight bound in terms of n and m.
// 5. State auxiliary-space complexity.
// 6. Identify the dominant term when m is polynomial in n.
// 7. Explain how your answer changes if expensiveHelper is optimized.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I count operations before simplifying to Big-O/Θ.
// [ ] I know when sequential costs add.
// [ ] I know when nested costs multiply.
// [ ] I can derive triangular sums.
// [ ] I can recognize geometric/logarithmic loops.
// [ ] I can recognize harmonic sums.
// [ ] I can analyze helper functions.
// [ ] I preserve multiple parameters such as n and m.
// [ ] I include database/network operation counts when relevant.
// [ ] I can derive AI pairwise-computation complexity.
