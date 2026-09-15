/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.20 — Complexity Analysis for Backend & AI
 *
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Request vs System Complexity
// ============================================================
// One request processes N records in O(N) time.
// C requests can execute concurrently.

// TODO:
// 1. Give per-request CPU complexity.
// 2. Give first-order aggregate CPU demand.
// 3. Explain why this is not a statement that every request literally takes CN.


// ============================================================
// Exercise 02 — N+1 Query Model
// ============================================================
async function loadOrders(orders) {
  const result = [];

  for (const order of orders) {
    result.push(await loadItems(order.id));
  }

  return result;
}

async function loadItems(id) {
  return [];
}

// TODO:
// 1. Estimate database round trips for N orders.
// 2. Explain the fixed cost paid per round trip.
// 3. Describe the algorithmic benefit of batching child records.


// ============================================================
// Exercise 03 — Indexed Lookup Workload
// ============================================================
// Dataset size = N
// Index build = O(N log N)
// Query cost = O(log N)
// Number of queries = Q

// TODO: Derive total workload complexity.
// Then compare it conceptually with Q full O(N) scans.


// ============================================================
// Exercise 04 — Pagination
// ============================================================
// There are N records, page size P, and Q pages requested.

// TODO:
// 1. Derive processed-record work if each page processes exactly P records.
// 2. Explain what happens if QP is approximately N.
// 3. Explain why database offset behavior may add additional cost.


// ============================================================
// Exercise 05 — Top-K Selection
// ============================================================
// N candidates exist, but only K results are required.

// TODO:
// Compare full sorting with heap-based Top-K selection.
// State the assumptions behind the O(N log K) model.


// ============================================================
// Exercise 06 — Deduplication
// ============================================================
function deduplicate(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}

// TODO:
// Give expected/typical time, worst-case auxiliary space, and output space.
// Explain the time-space trade-off compared with pairwise comparison.


// ============================================================
// Exercise 07 — Rate Limiter Representation
// ============================================================
// U active users.
// Option A stores up to W timestamps per user.
// Option B stores a constant-size token bucket per user.

// TODO:
// Compare asymptotic memory of both representations.
// Explain what information Option A retains that Option B does not.


// ============================================================
// Exercise 08 — Cache Workload
// ============================================================
// Q requests access an expensive operation.
// Cache miss ratio is m.

// TODO:
// Build a first-order model for downstream expensive-operation count.
// Explain why this is not a worst-case Big-O guarantee.


// ============================================================
// Exercise 09 — Streaming
// ============================================================
function processAll(records) {
  const all = [...records];
  return all.map(processRecord);
}

function processRecord(record) {
  return record;
}

// TODO:
// Compare materializing all N records with processing bounded batches of B.
// State working-memory complexity for each design.


// ============================================================
// Exercise 10 — Concurrency × Memory
// ============================================================
// Each request uses M MB of working memory.
// At most C requests are active.

// TODO:
// 1. Derive first-order aggregate working memory.
// 2. Calculate it for M = 25 MB and C = 200.
// 3. List shared-memory/runtime factors omitted by this model.


// ============================================================
// Exercise 11 — Backend Batch Cost
// ============================================================
// Processing a batch of B records costs C + Bp.

// TODO:
// 1. Derive average cost per record.
// 2. Explain the amortization benefit of increasing B.
// 3. List three reasons not to make B arbitrarily large.


// ============================================================
// Exercise 12 — Queueing
// ============================================================
// A service takes S milliseconds of service time per request.
// Incoming request rate increases toward service capacity.

// TODO:
// Explain why queueing delay can increase even when S stays constant.
// Explain why Big-O of the request handler does not capture this behavior.


// ============================================================
// Exercise 13 — Vector Storage
// ============================================================
// N vectors, D dimensions, b bytes/value.

// TODO:
// 1. Derive raw vector storage.
// 2. Calculate raw bytes for N=1,000,000, D=768, b=4.
// 3. Explain why real index memory is larger.


// ============================================================
// Exercise 14 — Pairwise Similarity
// ============================================================
// N vectors of D dimensions.
// Every pair is compared.

// TODO:
// Derive time complexity.
// Explain why increasing N is especially dangerous compared with increasing D
// by the same multiplicative factor.


// ============================================================
// Exercise 15 — Retrieval + Reranking
// ============================================================
// Q queries.
// K retrieved candidates per query.
// Similarity cost = O(D) per candidate.
// Reranking cost = O(L) per candidate.

// TODO:
// 1. Derive total similarity work.
// 2. Derive total reranking work.
// 3. Combine them into one expression.
// 4. Identify the optimization levers.


// ============================================================
// Exercise 16 — Top-K AI Retrieval
// ============================================================
// N candidates are scored, but only K are retained.

// TODO:
// Compare full sorting and heap-based selection.
// Explain when K << N makes the difference significant.


// ============================================================
// Exercise 17 — Inference Batching
// ============================================================
// A batch of B requests pays fixed cost C plus per-request cost P.

// TODO:
// 1. Derive average cost per request.
// 2. Explain throughput benefits.
// 3. Explain memory and tail-latency risks.
// 4. Describe a constrained optimization objective.


// ============================================================
// Exercise 18 — RAG Pipeline
// ============================================================
// A RAG request has stages:
// embedding E, retrieval R, scoring S, reranking X, generation G.

// TODO:
// 1. Build a simple latency model.
// 2. Explain why optimizing retrieval alone may not improve end-to-end latency.
// 3. Explain how profiling identifies the actual bottleneck.


// ============================================================
// Exercise 19 — Index Build vs Updates vs Queries
// ============================================================
// Build cost = O(N log N)
// U updates, each O(log N)
// Q queries, each O(log N)

// TODO:
// 1. Derive total workload.
// 2. Explain why a query-only benchmark is incomplete.
// 3. Describe when a more expensive index can still be a bad choice.


// ============================================================
// Exercise 20 — Full Backend + AI Synthesis
// ============================================================
// Backend:
//   N records/request
//   Q database calls/request
//   R cost per database round trip
//   M memory/request
//   C concurrent requests
//
// AI:
//   Q2 queries
//   K candidates/query
//   D dimensions
//   B inference batch size
//   L context length
//
// TODO:
// 1. Build symbolic CPU/network/memory models for the backend.
// 2. Identify the effect of Q database round trips.
// 3. Identify the effect of concurrency C.
// 4. Build the core retrieval scoring model Q2*K*D.
// 5. Explain how K and D affect retrieval cost.
// 6. Explain batching trade-offs for B.
// 7. Explain why L must be modeled separately for model-dependent inference.
// 8. Identify which metrics you would measure in production.
// 9. Explain how you would locate the bottleneck.
// 10. Give one structural optimization for the backend and one for the AI
//     pipeline, including their trade-offs.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I can model per-request and system-level complexity.
// [ ] I can analyze N+1 query patterns.
// [ ] I understand indexed build/query trade-offs.
// [ ] I can reason about pagination complexity.
// [ ] I can analyze Top-K selection.
// [ ] I can analyze hash-based deduplication.
// [ ] I can model rate-limiter state.
// [ ] I can reason about cache miss workloads.
// [ ] I can compare streaming and materialization.
// [ ] I can model concurrency × memory.
// [ ] I understand batching and amortization.
// [ ] I understand queueing effects.
// [ ] I can calculate vector storage.
// [ ] I can derive pairwise vector complexity.
// [ ] I can model Q × K × D retrieval work.
// [ ] I understand reranking parameters.
// [ ] I understand AI Top-K trade-offs.
// [ ] I can model inference batching.
// [ ] I can decompose RAG latency.
// [ ] I can model build/update/query workloads.
// [ ] I can connect complexity to production metrics.
