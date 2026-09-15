/**
 * PHASE 02 — COMPLEXITY ANALYSIS
 * 02.23 — ADVANCED COMPLEXITY ANALYSIS
 *
 * Keep every exercise UNSOLVED.
 *
 * For each exercise, document:
 * - meaningful parameters
 * - computational/cost model
 * - time complexity
 * - auxiliary/peak space where relevant
 * - assumptions
 * - expected/worst/amortized/tail behavior where relevant
 */

// ============================================================
// 01 — NON-UNIFORM OPERATION COST
// ============================================================

// N = number of strings, L = average/max string length.
// Analyze the cost of sorting these strings when comparisons may inspect
// multiple characters.
function exercise01(strings) {
  return strings.slice().sort((a, b) => a.localeCompare(b));
}

// ============================================================
// 02 — OUTPUT-SENSITIVE ANALYSIS
// ============================================================

// N = input size, K = number of matching pairs.
// Derive a useful output-sensitive bound and discuss the cost of emitting K
// results.
function exercise02(items, predicate) {
  const result = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (predicate(items[i], items[j])) result.push([items[i], items[j]]);
    }
  }

  return result;
}

// ============================================================
// 03 — PARAMETERIZED COMPLEXITY
// ============================================================

// N = number of items, K = selected subset size.
// Determine the complexity in terms of N and K. Decide whether the resulting
// expression fits the usual fixed-parameter tractability form.
function exercise03(items, k) {
  let solutions = 0;

  function choose(start, depth) {
    if (depth === k) {
      solutions++;
      return;
    }

    for (let i = start; i < items.length; i++) {
      choose(i + 1, depth + 1);
    }
  }

  choose(0, 0);
  return solutions;
}

// ============================================================
// 04 — SEARCH TREE VS STATE GRAPH
// ============================================================

// b = branching factor, d = depth.
// Analyze naive search-tree complexity. Then explain how memoization changes
// the analysis if many paths reach the same state.
function exercise04(state, depth) {
  if (depth === 0) return 1;

  let count = 0;
  for (const next of generateNextStates(state)) {
    count += exercise04(next, depth - 1);
  }

  return count;
}

// ============================================================
// 05 — EXPECTED VS WORST CASE
// ============================================================

// Analyze randomized pivot selection in Quickselect.
// State both worst-case and expected complexity, including the assumptions
// behind the expected bound.
function exercise05(values, k) {
  if (values.length === 1) return values[0];

  const pivot = values[Math.floor(Math.random() * values.length)];
  const less = values.filter((x) => x < pivot);
  const equal = values.filter((x) => x === pivot);
  const greater = values.filter((x) => x > pivot);

  if (k < less.length) return exercise05(less, k);
  if (k < less.length + equal.length) return pivot;
  return exercise05(greater, k - less.length - equal.length);
}

// ============================================================
// 06 — HIGH-PROBABILITY REASONING
// ============================================================

// Suppose one randomized trial fails with probability p.
// Derive how repeated independent trials change failure probability under
// an appropriate success-combination rule.
function exercise06(p, repetitions) {
  // Do not calculate the final expression here.
  return { p, repetitions };
}

// ============================================================
// 07 — AMORTIZED / DEAMORTIZED THINKING
// ============================================================

// A structure performs expensive rebuilds after reaching capacity.
// Analyze amortized cost, then describe what a deamortized design would need
// to do to move work from occasional expensive operations into incremental work.
function exercise07(items) {
  const structure = [];
  let capacity = 1;

  for (const item of items) {
    if (structure.length === capacity) {
      capacity *= 2;
      // Conceptually rebuild/copy the structure.
    }
    structure.push(item);
  }

  return structure;
}

// ============================================================
// 08 — I/O / EXTERNAL-MEMORY MODEL
// ============================================================

// N = number of records, B = records transferred per block.
// Analyze CPU work and block-transfer complexity separately.
function exercise08(records) {
  let sum = 0;

  for (const record of records) {
    sum += record.value;
  }

  return sum;
}

// ============================================================
// 09 — CACHE-AWARE ACCESS
// ============================================================

// Compare the memory-access behavior of row-major and column-major traversal
// for an R x C matrix. Give the RAM-model complexity and discuss locality.
function exercise09(matrix) {
  let sum = 0;

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      sum += matrix[r][c];
    }
  }

  return sum;
}

// ============================================================
// 10 — STREAMING MEMORY
// ============================================================

// Analyze a one-pass streaming algorithm. Determine which state must remain
// live and whether memory grows with N.
function exercise10(stream) {
  let count = 0;
  let sum = 0;
  let maximum = -Infinity;

  for (const value of stream) {
    count++;
    sum += value;
    maximum = Math.max(maximum, value);
  }

  return { count, sum, maximum };
}

// ============================================================
// 11 — APPROXIMATION TRADE-OFF
// ============================================================

// Compare exact and approximate processing of a large candidate set.
// Define runtime, memory, and quality/error dimensions.
function exercise11(candidates, budget) {
  // Do not implement an approximation here.
  // Write the model and trade-off analysis instead.
  return { candidates, budget };
}

// ============================================================
// 12 — BRANCH-AND-BOUND
// ============================================================

// Analyze worst-case complexity and explain what kind of bound allows a branch
// to be pruned safely.
function exercise12(state, bound, best) {
  if (isComplete(state)) {
    return evaluate(state);
  }

  let answer = best;

  for (const next of expand(state)) {
    if (upperBound(next) <= bound) continue;
    answer = Math.max(answer, exercise12(next, bound, answer));
  }

  return answer;
}

// ============================================================
// 13 — PARALLEL WORK AND SPAN
// ============================================================

// Analyze total work W and span S of a parallel reduction.
function exercise13(values) {
  if (values.length <= 1) return values[0] ?? 0;

  const next = [];

  for (let i = 0; i < values.length; i += 2) {
    next.push(values[i] + (values[i + 1] ?? 0));
  }

  return exercise13(next);
}

// ============================================================
// 14 — DISTRIBUTED COMMUNICATION
// ============================================================

// N = requests, F = workers, M = average bytes per worker response.
// Model total work, messages, bytes transferred, and synchronized latency.
async function exercise14(requests, workers) {
  return Promise.all(
    requests.map((request) =>
      Promise.all(workers.map((worker) => worker(request)))
    )
  );
}

// ============================================================
// 15 — DISTRIBUTED SKEW
// ============================================================

// Analyze why average partition size is insufficient when one partition is
// much larger than the others. Express total synchronized runtime using the
// slowest partition.
function exercise15(partitions) {
  return Promise.all(partitions.map(processPartition));
}

// ============================================================
// 16 — BUILD / QUERY / UPDATE
// ============================================================

// N = initial records, U = updates, Q = queries.
// Compare an indexed design against a scan-based design using:
// Build(N) + U * Update(N) + Q * Query(N).
function exercise16(records, updates, queries) {
  const index = new Map();

  for (const record of records) {
    index.set(record.id, record);
  }

  for (const update of updates) {
    index.set(update.id, update);
  }

  return queries.map((id) => index.get(id));
}

// ============================================================
// 17 — QUERY / ORACLE COMPLEXITY
// ============================================================

// Treat oracle calls as the primary resource. Count the number of queries made
// to determine the answer and separately discuss local computation.
function exercise17(items, oracle) {
  let answer = 0;

  for (const item of items) {
    if (oracle(item)) answer++;
  }

  return answer;
}

// ============================================================
// 18 — ONLINE / COMPETITIVE REASONING
// ============================================================

// An online cache must make eviction decisions without knowing future access.
// Explain what should be compared with an optimal offline strategy and how a
// competitive ratio would be interpreted.
function exercise18(cache, requests) {
  for (const request of requests) {
    cache.handle(request);
  }
}

// ============================================================
// 19 — AI VECTOR RETRIEVAL MODEL
// ============================================================

// Q = queries, N = corpus vectors, D = dimensions, K = candidates.
// Compare exact scan with candidate-generation + reranking.
function exercise19(queryVectors, corpusVectors, k) {
  const results = [];

  for (const query of queryVectors) {
    const scored = [];

    for (const vector of corpusVectors) {
      scored.push(dotProduct(query, vector));
    }

    scored.sort((a, b) => b - a);
    results.push(scored.slice(0, k));
  }

  return results;
}

// ============================================================
// 20 — ADVANCED FULL-SYSTEM SYNTHESIS
// ============================================================

/**
 * Design a complexity model for this production system:
 *
 * Q  = requests
 * N  = indexed vectors
 * D  = vector dimensions
 * K  = retrieved candidates
 * L  = reranker input-length parameter
 * F  = parallel metadata services
 * M  = bytes returned by each service
 * B  = batch size
 * C  = concurrent requests
 * U  = index updates
 *
 * Pipeline:
 *
 * request
 *   -> cache
 *   -> vector retrieval
 *   -> Top-K
 *   -> reranking
 *   -> parallel metadata fan-out
 *   -> merge
 *   -> response
 *
 * Analyze:
 *
 * 1. Exact retrieval complexity.
 * 2. Indexed retrieval complexity.
 * 3. Reranking complexity.
 * 4. Top-K complexity.
 * 5. Metadata fan-out work.
 * 6. Communication volume.
 * 7. Per-request peak memory.
 * 8. Aggregate work for Q requests.
 * 9. Effect of batching B.
 * 10. Effect of concurrency C.
 * 11. Build/update/query trade-offs.
 * 12. Expected cache-hit impact.
 * 13. Tail-latency and straggler effects.
 * 14. Quality/error trade-offs for approximate retrieval.
 * 15. Identify the dominant term under at least three different workload
 *     regimes.
 * 16. State all computational-model assumptions.
 * 17. Propose three optimizations and explain which term each reduces.
 * 18. Give an adversarial workload that breaks your optimistic assumptions.
 * 19. Define what should be benchmarked rather than inferred from Big-O.
 * 20. Defend the complete complexity model as a senior Backend + AI engineer.
 */
function exercise20(system) {
  // Do not implement.
  // Produce a written complexity model using the requirements above.
  return system;
}

// ============================================================
// ADVANCED COMPLEXITY MASTER CHECK
// ============================================================

// Before moving to Phase 02.24, verify that you can:
// - choose the correct model,
// - preserve meaningful parameters,
// - derive rather than guess bounds,
// - distinguish CPU from I/O/network work,
// - distinguish worst/expected/amortized/tail behavior,
// - reason about output size,
// - reason about parallel work/span,
// - reason about distributed communication and skew,
// - connect complexity to backend and AI system behavior.
