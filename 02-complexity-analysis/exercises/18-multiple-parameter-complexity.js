/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.18 — Multiple-Parameter Complexity
 *
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Matrix Traversal
// ============================================================
function scanMatrix(matrix) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      work(matrix[r][c]);
    }
  }
}

function work(value) {}

// TODO: If the matrix has R rows and C columns, derive time and space.


// ============================================================
// Exercise 02 — Sequential Parameters
// ============================================================
function processTwoArrays(a, b) {
  for (const x of a) work(x);
  for (const y of b) work(y);
}

// TODO: If |a| = A and |b| = B, derive complexity.
// Explain why the answer is not automatically O(AB).


// ============================================================
// Exercise 03 — Cartesian Product
// ============================================================
function allPairs(a, b) {
  for (const x of a) {
    for (const y of b) {
      work(x, y);
    }
  }
}

// TODO: Derive complexity in terms of A and B.


// ============================================================
// Exercise 04 — Three Independent Dimensions
// ============================================================
function tripleLoop(A, B, C) {
  for (let i = 0; i < A; i++) {
    for (let j = 0; j < B; j++) {
      for (let k = 0; k < C; k++) {
        work(i, j, k);
      }
    }
  }
}

// TODO: Derive time complexity.


// ============================================================
// Exercise 05 — Matrix Multiplication Shape
// ============================================================
// Matrix A has dimensions R × K.
// Matrix B has dimensions K × C.

// TODO:
// 1. Derive the naive multiplication time complexity.
// 2. Explain why the result is not simply O(n^3) without assumptions.


// ============================================================
// Exercise 06 — String Scanning
// ============================================================
function scanStrings(strings) {
  for (const s of strings) {
    for (let i = 0; i < s.length; i++) {
      work(s[i]);
    }
  }
}

// TODO:
// 1. Express complexity using N strings and maximum length L.
// 2. Give a tighter expression using S = total characters.


// ============================================================
// Exercise 07 — Pairwise String Comparison
// ============================================================
function compareAllStrings(strings) {
  for (let i = 0; i < strings.length; i++) {
    for (let j = i + 1; j < strings.length; j++) {
      compare(strings[i], strings[j]);
    }
  }
}

function compare(a, b) {}

// TODO: If there are N strings and each comparison costs O(L), derive time.
// What assumption about comparison cost is being made?


// ============================================================
// Exercise 08 — Graph Traversal
// ============================================================
function traverseGraph(graph, start) {
  const visited = new Set([start]);
  const stack = [start];

  while (stack.length) {
    const node = stack.pop();

    for (const next of graph[node] ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
}

// TODO: Express time and space in terms of V and E.


// ============================================================
// Exercise 09 — N Queries Over N Records
// ============================================================
function naiveQueries(records, queries) {
  for (const query of queries) {
    for (const record of records) {
      matches(query, record);
    }
  }
}

function matches(query, record) {
  return query === record;
}

// TODO: If there are N records and Q queries, derive total time.
// Explain why preserving N and Q is important.


// ============================================================
// Exercise 10 — Preprocessing + Queries
// ============================================================
// Suppose an index takes O(N log N) to build and each query takes O(log N).

// TODO:
// 1. Express total complexity for Q queries.
// 2. Compare against Q naive O(N) scans.
// 3. Under what workload condition does preprocessing become attractive?


// ============================================================
// Exercise 11 — Parameter Relationship
// ============================================================
// Given Q <= N:
//   O(N + Q)

// TODO:
// Simplify the expression and prove why the simplification is valid.


// ============================================================
// Exercise 12 — Graph Bound Information
// ============================================================
// A simple graph has V vertices and E edges, with E <= V^2.

// TODO:
// 1. Show that O(V + E) is bounded by O(V^2).
// 2. Explain why O(V + E) can still be a more informative answer.


// ============================================================
// Exercise 13 — Pairwise Vector Similarity
// ============================================================
// There are N vectors, each with D dimensions.
// Every pair of vectors is compared.

// TODO:
// Derive time complexity.
// Then derive memory if all vectors are already input and no additional
// candidate matrix is stored.


// ============================================================
// Exercise 14 — Query Candidate Scoring
// ============================================================
function scoreCandidates(queries, candidates) {
  for (const query of queries) {
    for (const candidate of candidates) {
      score(query, candidate);
    }
  }
}

function score(query, candidate) {
  return 0;
}

// TODO: If there are Q queries, K candidates/query, and each score costs O(D),
// derive the total complexity. Modify the model if the candidate list is shared
// and contains K candidates for every query.


// ============================================================
// Exercise 15 — Concurrent Backend Processing
// ============================================================
// A request processes N records and uses O(N) working memory.
// C requests run concurrently.

// TODO:
// 1. Estimate aggregate live working memory.
// 2. Explain why request-level complexity is insufficient for capacity planning.


// ============================================================
// Exercise 16 — Dependent Bounds
// ============================================================
function dependent(A, B) {
  for (let i = 0; i < A; i++) {
    for (let j = 0; j < Math.min(B, i); j++) {
      work();
    }
  }
}

// TODO:
// Analyze the sum separately for:
// 1. A <= B
// 2. A > B
// Give useful asymptotic bounds for both regimes.


// ============================================================
// Exercise 17 — Build + Update + Query
// ============================================================
// A system has:
//   Build: O(N log N)
//   Update: O(log N)
//   Query: O(log N)
//
// There are U updates and Q queries.

// TODO: Derive total workload complexity.
// Explain why omitting U can make the model incomplete.


// ============================================================
// Exercise 18 — Output-Sensitive Complexity
// ============================================================
// An algorithm reads N input records and outputs K matching records.
// It spends O(1) work per input record and O(1) work per emitted result.

// TODO:
// 1. Give a natural complexity bound.
// 2. Explain why K is an important parameter even if K <= N.


// ============================================================
// Exercise 19 — Piecewise Complexity
// ============================================================
function piecewise(A, B) {
  if (A < B) {
    for (let i = 0; i < A; i++) {
      for (let j = 0; j < A; j++) work();
    }
  } else {
    for (let i = 0; i < A; i++) {
      for (let j = 0; j < B; j++) work();
    }
  }
}

// TODO:
// Derive the complexity separately for A < B and A >= B.
// Explain why a single simplified expression may hide useful structure.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
// A retrieval system has:
//   N = indexed vectors
//   Q = queries
//   K = candidates/query
//   D = vector dimensions
//
// Index build costs O(N log N).
// Each query retrieves K candidates in O(log N) metadata work and computes
// O(D) similarity for every candidate.
//
// TODO:
// 1. Derive total build + query time for Q queries.
// 2. Preserve all independent parameters.
// 3. State assumptions required by the model.
// 4. Explain how changing K affects runtime.
// 5. Explain how changing D affects runtime.
// 6. Explain when it would be justified to simplify the expression.
// 7. Give a production interpretation of the dominant parameters.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I preserve independent parameters instead of blindly using n.
// [ ] I distinguish additive and multiplicative parameter costs.
// [ ] I can analyze R × C matrices.
// [ ] I can analyze R × K × C matrix multiplication.
// [ ] I can use total string length as a parameter.
// [ ] I can analyze V/E graph complexity.
// [ ] I can model N records and Q queries.
// [ ] I can model build + update + query workloads.
// [ ] I understand parameter relationships.
// [ ] I know when simplification is justified.
// [ ] I understand output-sensitive complexity.
// [ ] I can analyze dependent bounds.
// [ ] I can analyze piecewise complexity.
// [ ] I can model Q × K × D AI workloads.
// [ ] I can account for concurrency in backend systems.
// [ ] I can explain why O(V + E) may be more useful than O(V^2).
// [ ] I can state assumptions behind a complexity model.
// [ ] I can identify the true production bottleneck parameter.
