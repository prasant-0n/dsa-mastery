/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.13 — Nested & Dependent Loops
 *
 * Goal: stop using "nested loops = O(n²)" as a shortcut.
 * Derive the actual iteration relationship.
 */

// ============================================================
// Exercise 01 — Independent Nesting
// ============================================================
function exercise01(n, m) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      work();
    }
  }
}

function work() {}

// TODO: Give the tight bound in terms of n and m.


// ============================================================
// Exercise 02 — Triangular Dependency
// ============================================================
function exercise02(n) {
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      work();
    }
  }
}

// TODO: Write the summation and derive Θ complexity.


// ============================================================
// Exercise 03 — Reverse Triangle
// ============================================================
function exercise03(n) {
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      work();
    }
  }
}

// TODO: Count the total inner iterations.


// ============================================================
// Exercise 04 — Pairwise Exclusion
// ============================================================
function exercise04(n) {
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      count++;
    }
  }

  return count;
}

// TODO:
// 1. Derive the exact count.
// 2. Give the asymptotic complexity.
// 3. Explain its interpretation as choosing 2 elements.


// ============================================================
// Exercise 05 — Cubic Dependency
// ============================================================
function exercise05(n) {
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      for (let k = 1; k <= j; k++) {
        work();
      }
    }
  }
}

// TODO: Derive the complexity using nested summations.


// ============================================================
// Exercise 06 — Polynomial Inner Bound
// ============================================================
function exercise06(n) {
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i * i; j++) {
      work();
    }
  }
}

// TODO: Express the work as Σ i² and simplify.


// ============================================================
// Exercise 07 — Geometric Dependency
// ============================================================
function exercise07(n) {
  for (let i = 1; i <= n; i *= 2) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }
}

// TODO: Explain why this is Θ(n), not Θ(n²).


// ============================================================
// Exercise 08 — Geometric Base 3
// ============================================================
function exercise08(n) {
  for (let i = 1; i <= n; i *= 3) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }
}

// TODO: Derive the complexity using a geometric sum.


// ============================================================
// Exercise 09 — Harmonic Dependency
// ============================================================
function exercise09(n) {
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < Math.floor(n / i); j++) {
      work();
    }
  }
}

// TODO: Express the total as a harmonic sum and derive Θ(n log n).


// ============================================================
// Exercise 10 — Logarithmic Outer / Linear Inner
// ============================================================
function exercise10(n) {
  for (let i = 1; i <= n; i *= 2) {
    for (let j = 0; j < n; j++) {
      work();
    }
  }
}

// TODO: Analyze both dimensions and combine them.


// ============================================================
// Exercise 11 — Logarithmic Dependency
// ============================================================
function exercise11(n) {
  for (let i = 1; i <= n; i *= 2) {
    for (let j = i; j <= n; j *= 2) {
      work();
    }
  }
}

// TODO: Derive the Θ((log n)²) bound.
// Show the inner iteration count at outer level k.


// ============================================================
// Exercise 12 — Square-Root Dependency
// ============================================================
function exercise12(n) {
  for (let i = 1; i * i <= n; i++) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }
}

// TODO: Derive the outer bound and then sum the inner work.


// ============================================================
// Exercise 13 — Root Inside Root
// ============================================================
function exercise13(n) {
  for (let i = 1; i * i < n; i++) {
    for (let j = 0; j * j < i; j++) {
      work();
    }
  }
}

// TODO: Derive the Θ(n^(3/4)) bound carefully.


// ============================================================
// Exercise 14 — Early Break
// ============================================================
function exercise14(n) {
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

// TODO:
// 1. Best-case complexity.
// 2. Worst-case complexity.
// 3. Explain why the break does not eliminate the worst-case quadratic bound.


// ============================================================
// Exercise 15 — Sequential vs Nested
// ============================================================
function exercise15(n) {
  for (let i = 0; i < n; i++) work();
  for (let i = 0; i < n; i++) work();
}

function exercise15b(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) work();
  }
}

// TODO: Analyze both functions and explain why one is Θ(n) and the other
// is Θ(n²).


// ============================================================
// Exercise 16 — Data-Dependent Bound
// ============================================================
function exercise16(items) {
  let total = 0;

  for (const item of items) {
    for (let j = 0; j < item.count; j++) {
      total++;
    }
  }

  return total;
}

// TODO:
// Express complexity as Σ item.count.
// Then give an O(nm) bound if every count <= m.


// ============================================================
// Exercise 17 — Backend N+1 Shape
// ============================================================
async function exercise17(users) {
  const result = [];

  for (const user of users) {
    const records = await loadRecords(user.id);
    result.push(records);
  }

  return result;
}

async function loadRecords(id) {
  // Represents one database/network operation.
}

// TODO:
// 1. Count round trips for n users.
// 2. If each query returns m records and each record costs O(1) to process,
//    derive CPU/data-processing complexity.
// 3. Explain why query count is a separate operational concern.


// ============================================================
// Exercise 18 — AI Pairwise Similarity
// ============================================================
function exercise18(vectors) {
  let total = 0;

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      total += similarity(vectors[i], vectors[j]);
    }
  }

  return total;
}

function similarity(a, b) {
  // Assume Θ(d).
  return 0;
}

// TODO: If there are n vectors of dimension d, derive total complexity.


// ============================================================
// Exercise 19 — Multiple Parameters
// ============================================================
function exercise19(n, m) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < Math.min(i, m); j++) {
      work();
    }
  }
}

// TODO:
// 1. Write a summation using min(i, m).
// 2. Analyze the regime m >= n.
// 3. Analyze the regime m < n.
// 4. Explain why piecewise reasoning can be more precise than blindly
//    writing O(nm).


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function exercise20(n, m) {
  // Block A
  for (let i = 1; i <= n; i *= 2) {
    for (let j = 0; j < i; j++) {
      work();
    }
  }

  // Block B
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < Math.floor(m / i); j++) {
      work();
    }
  }

  // Block C
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      work();
    }
  }
}

// TODO:
// 1. Analyze Block A.
// 2. Analyze Block B.
// 3. Analyze Block C.
// 4. Add the costs.
// 5. Give the final bound in terms of n and m.
// 6. Explain which block dominates under common assumptions such as m = n.
// 7. State auxiliary-space complexity.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I distinguish independent and dependent nested loops.
// [ ] I convert dependent bounds into summations.
// [ ] I can analyze triangular and cubic dependencies.
// [ ] I can analyze geometric dependencies.
// [ ] I can recognize harmonic dependencies.
// [ ] I can analyze logarithmic nesting.
// [ ] I can handle root-based bounds.
// [ ] I understand best/worst cases with break.
// [ ] I preserve multiple parameters.
// [ ] I can reason piecewise when parameters have relationships.
// [ ] I can separate database round trips from CPU/data-processing work.
// [ ] I can analyze pairwise AI vector computation.
// [ ] I no longer assume nested loops automatically mean O(n²).
