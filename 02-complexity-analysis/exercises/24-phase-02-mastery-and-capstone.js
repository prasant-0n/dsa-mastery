/**
 * PHASE 02 — COMPLEXITY ANALYSIS
 * 02.24 — MASTERY & CAPSTONE
 *
 * Instructions:
 * - Do not look up the answer first.
 * - Derive the complexity from first principles.
 * - Preserve meaningful parameters.
 * - State assumptions and cost models.
 * - Keep every exercise UNSOLVED.
 */

// ============================================================
// 01 — EXACT OPERATION COUNT
// ============================================================

// Determine the exact number of calls to work() as a function of n.
function exercise01(n) {
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      work();
      count++;
    }
  }

  return count;
}

// ============================================================
// 02 — DEPENDENT LOOP
// ============================================================

// Derive a tight bound for the number of iterations.
function exercise02(n) {
  let count = 0;

  for (let i = 1; i <= n; i *= 2) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }

  return count;
}

// ============================================================
// 03 — HARMONIC PATTERN
// ============================================================

// Analyze the loop using a summation. Do not classify it only
// from visual nesting.
function exercise03(n) {
  let count = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j += i) {
      count++;
    }
  }

  return count;
}

// ============================================================
// 04 — RECURSIVE COMPLEXITY
// ============================================================

// Derive and solve the recurrence.
function exercise04(n) {
  if (n <= 1) return 1;

  return exercise04(Math.floor(n / 2)) + n;
}

// ============================================================
// 05 — TWO RECURSIVE BRANCHES
// ============================================================

// Determine time and auxiliary space complexity.
function exercise05(n) {
  if (n <= 1) return 1;

  return exercise05(n - 1) + exercise05(n - 1);
}

// ============================================================
// 06 — MASTER THEOREM
// ============================================================

// Solve the recurrence represented by this implementation.
function exercise06(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = exercise06(arr.slice(0, mid));
  const right = exercise06(arr.slice(mid));

  return merge(left, right);
}

// ============================================================
// 07 — MULTIPLE PARAMETERS
// ============================================================

// Let R = rows and C = columns. Preserve both parameters.
function exercise07(matrix) {
  let total = 0;

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      total += matrix[r][c];
    }
  }

  return total;
}

// ============================================================
// 08 — OUTPUT-SENSITIVE ANALYSIS
// ============================================================

// N = number of input records, K = number of matching records.
// Analyze time and output space while preserving K.
function exercise08(records, predicate) {
  const result = [];

  for (const record of records) {
    if (predicate(record)) result.push(record);
  }

  return result;
}

// ============================================================
// 09 — PARAMETERIZED COMPLEXITY
// ============================================================

// K is a small structural parameter. Derive complexity in N and K.
function exercise09(items, k) {
  let count = 0;

  function search(start, depth) {
    if (depth === k) {
      count++;
      return;
    }

    for (let i = start; i < items.length; i++) {
      search(i + 1, depth + 1);
    }
  }

  search(0, 0);
  return count;
}

// ============================================================
// 10 — AMORTIZED REASONING
// ============================================================

// Analyze worst-case and amortized cost of push operations.
function exercise10(values) {
  const data = [];
  let capacity = 1;

  for (const value of values) {
    if (data.length === capacity) {
      capacity *= 2;
      // Conceptually copy all existing elements.
    }
    data.push(value);
  }

  return data;
}

// ============================================================
// 11 — AUXILIARY SPACE
// ============================================================

// Analyze auxiliary space, output space, and peak live memory.
function exercise11(items) {
  const result = [];

  for (const item of items) {
    result.push({ value: item.value });
  }

  return result;
}

// ============================================================
// 12 — STREAMING MODEL
// ============================================================

// Assume input is consumed as a stream and cannot be rewound.
// Determine time and retained-state complexity.
function exercise12(stream) {
  let count = 0;
  let sum = 0;

  for (const value of stream) {
    count++;
    sum += value;
  }

  return { count, sum };
}

// ============================================================
// 13 — SEARCH SPACE
// ============================================================

// Analyze the naive search-tree size in terms of branching factor
// and depth. Then identify what memoization would change.
function exercise13(state, depth) {
  if (depth === 0) return 1;

  let total = 0;
  for (const next of generateNextStates(state)) {
    total += exercise13(next, depth - 1);
  }

  return total;
}

// ============================================================
// 14 — I/O-AWARE THINKING
// ============================================================

// Assume records are stored externally and transferred in blocks of B.
// Derive CPU and block-transfer complexity separately.
function exercise14(records) {
  let total = 0;

  for (const record of records) {
    total += record.amount;
  }

  return total;
}

// ============================================================
// 15 — PARALLEL WORK VS SPAN
// ============================================================

// Consider a parallel reduction over N values.
// Determine total work and dependency span.
function exercise15(values) {
  if (values.length === 1) return values[0];

  const next = [];

  for (let i = 0; i < values.length; i += 2) {
    next.push(values[i] + (values[i + 1] ?? 0));
  }

  return exercise15(next);
}

// ============================================================
// 16 — BACKEND N+1 MODEL
// ============================================================

// N = parent records, F = downstream records fetched per parent.
// Model database work, network round trips, and returned data.
async function exercise16(parents, fetchChildren) {
  const result = [];

  for (const parent of parents) {
    const children = await fetchChildren(parent.id);
    result.push({ parent, children });
  }

  return result;
}

// ============================================================
// 17 — DISTRIBUTED FAN-OUT / FAN-IN
// ============================================================

// N requests each fan out to F workers. Analyze total work and
// critical-path latency under parallel execution.
async function exercise17(requests, workers) {
  return Promise.all(
    requests.map(async (request) => {
      const responses = await Promise.all(
        workers.map((worker) => worker(request))
      );

      return mergeResponses(responses);
    })
  );
}

// ============================================================
// 18 — AI VECTOR RETRIEVAL
// ============================================================

// Q = queries, N = vectors, D = dimensions, K = returned candidates.
// Compare exact scan with an indexed candidate-generation approach.
function exercise18(query, vectors, k) {
  const scored = [];

  for (const vector of vectors) {
    scored.push({
      vector,
      score: dotProduct(query, vector),
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

// ============================================================
// 19 — FULL PIPELINE MODEL
// ============================================================

// Model the complexity of:
// request -> cache -> retrieval -> top-k -> reranking -> response.
// Preserve Q, N, K, D, and candidate/reranker cost parameters.
function exercise19(requests, cache, retrieve, rerank, k) {
  const output = [];

  for (const request of requests) {
    const cached = cache.get(request.key);

    if (cached) {
      output.push(cached);
      continue;
    }

    const candidates = retrieve(request);
    const topK = candidates.slice(0, k);
    const ranked = rerank(request, topK);
    output.push(ranked);
  }

  return output;
}

// ============================================================
// 20 — CAPSTONE: DEFEND THE COMPLEXITY
// ============================================================

/**
 * You are reviewing a production search endpoint.
 *
 * Workload:
 * - Q requests
 * - each request has one query vector of dimension D
 * - corpus contains N vectors
 * - retrieval returns K candidates
 * - reranking cost per candidate depends on L
 * - F downstream metadata services are queried in parallel
 * - each service returns M bytes on average
 *
 * Your task:
 *
 * 1. Define every relevant parameter.
 * 2. Give an exact-scan retrieval model.
 * 3. Give an indexed retrieval model.
 * 4. Model reranking.
 * 5. Model fan-out/fan-in work.
 * 6. Model communication volume.
 * 7. Analyze per-request memory.
 * 8. Analyze total work for Q requests.
 * 9. Identify which terms affect latency vs throughput.
 * 10. Explain how caching changes expected work.
 * 11. Explain why p99 latency cannot be inferred from Big-O alone.
 * 12. State assumptions for every bound.
 * 13. Identify at least three optimization levers.
 * 14. Explain the trade-off between retrieval quality and K.
 * 15. Give a final complexity defense as if answering a senior
 *     backend/AI engineering interview.
 */
function exercise20(system) {
  // Do not implement this function.
  // Write your complete analysis in your study notes first.
  return system;
}

// ============================================================
// PHASE 02 FINAL SELF-ASSESSMENT
// ============================================================

// Before moving to Phase 03, verify that you can solve all 20
// exercises without copying a memorized complexity label.

// Required evidence of mastery:
// - Derive the bound.
// - Preserve parameters.
// - State the model.
// - Analyze space.
// - Explain assumptions.
// - Defend the answer verbally.
