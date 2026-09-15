/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.12 — Analyzing Loops
 *
 * Rule: never classify a loop from syntax alone.
 * Derive the iteration count from variable evolution and bounds.
 */

// ============================================================
// Exercise 01 — Constant Step
// ============================================================
function exercise01(n) {
  for (let i = 0; i < n; i += 5) {
    work();
  }
}

function work() {}

// TODO: Derive the number of iterations and Θ complexity.


// ============================================================
// Exercise 02 — Multiplicative Step
// ============================================================
function exercise02(n) {
  for (let i = 1; i < n; i *= 3) {
    work();
  }
}

// TODO: Derive the iteration count mathematically.


// ============================================================
// Exercise 03 — Division Step
// ============================================================
function exercise03(n) {
  while (n > 1) {
    n = Math.floor(n / 2);
  }
}

// TODO: Analyze time complexity.


// ============================================================
// Exercise 04 — Independent Nested Loops
// ============================================================
function exercise04(n, m) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      work();
    }
  }
}

// TODO: Give the tight bound in terms of n and m.


// ============================================================
// Exercise 05 — Linear × Logarithmic
// ============================================================
function exercise05(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j *= 2) {
      work();
    }
  }
}

// TODO: Analyze outer and inner loops separately, then combine.


// ============================================================
// Exercise 06 — Triangular Loop
// ============================================================
function exercise06(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }
}

// TODO:
// 1. Write the exact summation.
// 2. Simplify it.
// 3. Give Θ complexity.


// ============================================================
// Exercise 07 — Reverse Triangle
// ============================================================
function exercise07(n) {
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      work();
    }
  }
}

// TODO: Derive the total number of executions.


// ============================================================
// Exercise 08 — Geometric Sum
// ============================================================
function exercise08(n) {
  for (let i = 1; i < n; i *= 2) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }
}

// TODO: Show why the nested loops together are Θ(n).


// ============================================================
// Exercise 09 — Outer Log, Inner Linear
// ============================================================
function exercise09(n) {
  for (let i = 1; i < n; i *= 2) {
    for (let j = 0; j < n; j++) {
      work();
    }
  }
}

// TODO: Give Θ complexity.


// ============================================================
// Exercise 10 — Two Pointers
// ============================================================
function exercise10(items) {
  let left = 0;
  let right = items.length - 1;

  while (left < right) {
    if (items[left] < items[right]) left++;
    else right--;
  }
}

// TODO: Prove why total loop iterations are O(n).
// Do not simply say "while loop = O(n)".


// ============================================================
// Exercise 11 — Two Variables, One Controller
// ============================================================
function exercise11(n) {
  let i = 0;
  let j = 1;

  while (i < n) {
    i++;
    j *= 2;
  }
}

// TODO: Explain why the loop is Θ(n), even though j grows exponentially.


// ============================================================
// Exercise 12 — Controller Changes
// ============================================================
function exercise12(n) {
  let i = 1;
  let j = n;

  while (i < j) {
    i *= 2;
  }
}

function exercise12b(n) {
  let i = 1;
  let j = n;

  while (i < j) {
    j--;
  }
}

// TODO: Analyze both functions and explain the difference.


// ============================================================
// Exercise 13 — Conditional Increment
// ============================================================
function exercise13(n) {
  let i = 0;

  while (i < n) {
    if (condition()) i += 2;
    else i += 1;
  }
}

function condition() {
  return false;
}

// TODO: Give the worst-case time complexity and justify it.


// ============================================================
// Exercise 14 — Conditional Multiplication
// ============================================================
function exercise14(n) {
  let i = 1;

  while (i < n) {
    if (condition()) i *= 2;
    else i += 1;
  }
}

// TODO: Determine the worst-case complexity.
// Explain why the logarithmic branch does not determine the worst case.


// ============================================================
// Exercise 15 — Break
// ============================================================
function exercise15(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) break;
    work();
  }
}

// TODO: Determine best and worst cases.


// ============================================================
// Exercise 16 — Nested Break
// ============================================================
function exercise16(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (shouldStop(i, j)) break;
      work();
    }
  }
}

function shouldStop(i, j) {
  return false;
}

// TODO: Give best-case and worst-case time complexity.


// ============================================================
// Exercise 17 — Square-Root Bound
// ============================================================
function exercise17(n) {
  for (let i = 0; i * i < n; i++) {
    work();
  }
}

// TODO: Solve the stopping condition and derive Θ complexity.


// ============================================================
// Exercise 18 — Harmonic Loop
// ============================================================
function exercise18(n) {
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < Math.floor(n / i); j++) {
      work();
    }
  }
}

// TODO:
// Express the work using a harmonic sum and derive the final bound.


// ============================================================
// Exercise 19 — Expensive Body
// ============================================================
function exercise19(items) {
  for (const item of items) {
    items.sort(compare);
  }
}

function compare(a, b) {
  return a - b;
}

// TODO:
// Assume items.length = n and sorting costs Θ(n log n).
// Derive the total complexity.


// ============================================================
// Exercise 20 — Full Loop Analysis
// ============================================================
function exercise20(n, m) {
  for (let i = 1; i < n; i *= 2) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }

  for (let a = 0; a < n; a++) {
    for (let b = 1; b < m; b *= 2) {
      work();
    }
  }

  let left = 0;
  let right = n - 1;

  while (left < right) {
    left++;
    right--;
  }
}

// TODO:
// 1. Analyze the first nested section.
// 2. Analyze the second nested section.
// 3. Analyze the two-pointer section.
// 4. Add the costs.
// 5. Give the final tight bound in terms of n and m.
// 6. Explain why the first section is not Θ(n log n).
// 7. State auxiliary-space complexity.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I identify the termination-controlling variable.
// [ ] I can distinguish additive and multiplicative updates.
// [ ] I can solve loop stopping conditions.
// [ ] I analyze nested dependent bounds with sums.
// [ ] I recognize geometric sums.
// [ ] I recognize harmonic sums.
// [ ] I can prove two-pointer loops are linear.
// [ ] I analyze break/continue correctly.
// [ ] I can handle nonstandard bounds such as sqrt(n).
// [ ] I include expensive body/helper costs.
// [ ] I preserve multiple parameters.
// [ ] I can analyze backend and AI loop workloads.
