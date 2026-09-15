/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.19 — Practical Performance & Cost Models
 *
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Same Big-O, Different Constants
// ============================================================
function algorithmA(items) {
  let total = 0;
  for (const x of items) total += x;
  return total;
}

function algorithmB(items) {
  let total = 0;
  for (const x of items) {
    total += x;
    total += 1;
    total -= 1;
  }
  return total;
}

// TODO:
// Both are O(n). Explain why their practical runtime can differ.


// ============================================================
// Exercise 02 — Crossover Point
// ============================================================
// T1(n) = 20n
// T2(n) = n^2

// TODO:
// 1. Estimate the crossover point.
// 2. Determine which model is smaller below and above that point.
// 3. Explain why real benchmarks may differ from the simple model.


// ============================================================
// Exercise 03 — Fixed + Variable Cost
// ============================================================
// An operation costs C + 5n microseconds.

// TODO:
// 1. Give asymptotic complexity.
// 2. Explain when C matters most.
// 3. Explain why Big-O does not expose C.


// ============================================================
// Exercise 04 — Latency Percentiles
// ============================================================
// Measurements in milliseconds:
// 5, 5, 5, 5, 5, 5, 5, 5, 5, 500

// TODO:
// 1. Explain why the mean can hide the outlier.
// 2. Identify why tail percentiles matter in backend systems.
// 3. Distinguish p50 and p99 conceptually.


// ============================================================
// Exercise 05 — CPU vs I/O
// ============================================================
function endpoint(records) {
  for (const record of records) {
    cpuWork(record);
  }
  databaseQuery();
}

function cpuWork(record) {}
function databaseQuery() {}

// TODO:
// If CPU work is O(N) but the database query takes 200 ms independently of N,
// build a simple practical cost model. Which component might dominate for
// small N?


// ============================================================
// Exercise 06 — N+1 Queries
// ============================================================
async function loadParents(parents) {
  const result = [];

  for (const parent of parents) {
    result.push(await loadChildren(parent.id));
  }

  return result;
}

async function loadChildren(id) {
  return [];
}

// TODO:
// 1. Estimate number of database round trips for N parents.
// 2. Explain why network/database cost can dominate a cheap application loop.
// 3. Describe the high-level optimization direction.


// ============================================================
// Exercise 07 — Sequential vs Batch Network Calls
// ============================================================
// Each network round trip costs approximately R milliseconds.
// There are Q requests.

// TODO:
// Compare:
// 1. Q individual round trips.
// 2. One batched round trip.
// Include a variable processing cost for the returned data.


// ============================================================
// Exercise 08 — Benchmark Scaling
// ============================================================
// Observed times:
// n=1,000     -> 2 ms
// n=2,000     -> 4 ms
// n=4,000     -> 8 ms
// n=8,000     -> 16 ms

// TODO:
// What growth pattern does this suggest?
// What additional experiment would strengthen the conclusion?


// ============================================================
// Exercise 09 — Quadratic Scaling
// ============================================================
// Observed times:
// n=1,000     -> 1 ms
// n=2,000     -> 4 ms
// n=4,000     -> 16 ms

// TODO:
// 1. Identify the likely asymptotic growth.
// 2. Explain the evidence using scaling ratios.


// ============================================================
// Exercise 10 — Input Distribution
// ============================================================
function findValue(items, target) {
  for (const item of items) {
    if (item === target) return true;
  }
  return false;
}

// TODO:
// Compare likely benchmark behavior when target is:
// 1. Always first.
// 2. Always last.
// 3. Randomly positioned.
// 4. Usually absent.
// Explain why a single benchmark distribution is insufficient.


// ============================================================
// Exercise 11 — Allocation Pressure
// ============================================================
function versionA(items) {
  return items.map(x => ({ value: x * 2 }));
}

function versionB(items) {
  const result = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    result[i] = { value: items[i] * 2 };
  }
  return result;
}

// TODO:
// Both create O(n) output objects. Explain why implementation details such as
// allocation rate and GC behavior can still affect measured performance.


// ============================================================
// Exercise 12 — Cache Locality
// ============================================================
// Compare conceptually:
// 1. Sequentially scanning an array.
// 2. Accessing elements in a highly irregular order.

// TODO:
// Explain why both can be O(n) while practical performance differs.


// ============================================================
// Exercise 13 — JavaScript Warm-Up
// ============================================================
function hotFunction(items) {
  let sum = 0;
  for (const x of items) sum += x;
  return sum;
}

// TODO:
// Design a benchmark that avoids interpreting the first few executions as
// representative steady-state performance. Include warm-up and repeated
// measurements.


// ============================================================
// Exercise 14 — Differential Benchmark
// ============================================================
function sumA(items) {
  return items.reduce((sum, x) => sum + x, 0);
}

function sumB(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) sum += items[i];
  return sum;
}

// TODO:
// Design a fair experiment comparing these implementations.
// Include correctness validation before comparing timings.


// ============================================================
// Exercise 15 — Bottleneck Identification
// ============================================================
// Endpoint breakdown:
// DB:        80 ms
// Network:   15 ms
// CPU:       5 ms

// TODO:
// 1. Identify the dominant component.
// 2. Explain why making CPU 10× faster has limited end-to-end impact.
// 3. Give the expected new total if CPU falls from 5 ms to 0.5 ms, assuming
//    all other costs remain unchanged.


// ============================================================
// Exercise 16 — Concurrency and Memory
// ============================================================
// Each request requires 20 MB working memory.
// C requests may be active simultaneously.

// TODO:
// 1. Derive aggregate working-memory requirement.
// 2. Calculate it for C = 100.
// 3. Explain why this is a capacity-planning concern rather than merely an
//    algorithm-level concern.


// ============================================================
// Exercise 17 — AI Retrieval Cost
// ============================================================
// A retrieval stage scores K candidates for each query.
// Each score requires D-dimensional work.
// There are Q queries.

// TODO:
// 1. Derive asymptotic work.
// 2. Identify which parameter reductions can improve runtime.
// 3. List practical hardware/runtime factors that Big-O does not capture.


// ============================================================
// Exercise 18 — Batching Trade-Off
// ============================================================
// Individual inference request cost:
//   fixed setup C + per-item cost P
//
// A batch of B items pays C once.

// TODO:
// 1. Express average setup cost per item.
// 2. Explain why increasing B can improve throughput.
// 3. Explain why very large B can hurt latency and memory.


// ============================================================
// Exercise 19 — Queueing Near Saturation
// ============================================================
// A service has a fixed service time of 10 ms per request.
// Arrival rate increases toward the maximum sustainable throughput.

// TODO:
// Explain why user-visible latency can increase sharply even though the
// per-request algorithm has not changed. Include queueing in the model.


// ============================================================
// Exercise 20 — Full Performance Model
// ============================================================
// A backend endpoint:
//   - scans N records in O(N) CPU time,
//   - performs Q database round trips costing R each,
//   - allocates M units of temporary memory,
//   - serves C concurrent requests.
//
// An AI endpoint:
//   - processes K candidates/query,
//   - uses D-dimensional scoring,
//   - batches B requests.
//
// TODO:
// 1. Write a practical symbolic cost model for the backend endpoint.
// 2. Identify CPU, network/database, memory, and concurrency dimensions.
// 3. Write the core computational model for the AI endpoint.
// 4. Identify how batching changes fixed overhead.
// 5. Identify latency and memory risks of increasing B.
// 6. Explain what you would benchmark first.
// 7. Explain how you would identify the true bottleneck.
// 8. State why asymptotic complexity alone is insufficient for this analysis.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I understand Big-O vs actual runtime.
// [ ] I can reason about constant factors.
// [ ] I can estimate crossover points.
// [ ] I distinguish latency and throughput.
// [ ] I understand tail latency.
// [ ] I can separate CPU, memory, I/O, and network costs.
// [ ] I understand database round-trip costs.
// [ ] I can design scaling benchmarks.
// [ ] I can benchmark realistic input distributions.
// [ ] I understand JavaScript warm-up.
// [ ] I understand allocation and GC effects.
// [ ] I can perform differential benchmarking.
// [ ] I can identify bottlenecks.
// [ ] I understand concurrency and capacity planning.
// [ ] I can model AI retrieval cost.
// [ ] I understand batching trade-offs.
// [ ] I understand queueing effects.
// [ ] I can combine theoretical and practical cost models.
