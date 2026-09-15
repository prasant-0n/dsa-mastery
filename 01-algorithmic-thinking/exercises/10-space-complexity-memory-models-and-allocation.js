// 01.10 — Space Complexity, Memory Models & Allocation Reasoning
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. State what memory is input, output, auxiliary, stack, or shared.
// 3. Distinguish peak live memory from total allocation.
// 4. Do not confuse references with copied objects.
// 5. For production analysis, consider concurrency and allocation pressure.

// -----------------------------------------------------------------------------
// Exercise 01 — Constant Auxiliary Space
// -----------------------------------------------------------------------------
// Implement a function that computes the sum of an array without allocating a
// data structure proportional to input size.
//
// Explain why its auxiliary space is O(1).

// -----------------------------------------------------------------------------
// Exercise 02 — Hashing Time-Space Trade-Off
// -----------------------------------------------------------------------------
// Implement duplicate detection in two ways:
// A. nested comparison,
// B. Set-based lookup.
//
// Compare:
// - time,
// - auxiliary space,
// - worst-case behavior,
// - practical trade-offs.

// -----------------------------------------------------------------------------
// Exercise 03 — Input vs Auxiliary vs Output
// -----------------------------------------------------------------------------
// Write a function that transforms an array into another array.
//
// Explicitly classify:
// - input space,
// - output space,
// - auxiliary working space.
//
// State which convention you are using when reporting total space.

// -----------------------------------------------------------------------------
// Exercise 04 — Aliasing
// -----------------------------------------------------------------------------
// Given:
//
// const original = [1, 2, 3];
// const alias = original;
// const copy = [...original];
//
// Explain the additional storage represented by alias and copy.
// Extend the example with nested objects and discuss shallow copying.

// -----------------------------------------------------------------------------
// Exercise 05 — Deep Copy
// -----------------------------------------------------------------------------
// Create a nested data structure containing arrays and objects.
//
// Implement a deep-copy routine for the supported structure.
//
// Analyze its space complexity in terms of the number of copied nodes.
// Explain why deep-copy cost depends on the amount of data actually duplicated.

// -----------------------------------------------------------------------------
// Exercise 06 — Recursive Stack Space
// -----------------------------------------------------------------------------
// Implement:
// A. recursion that decreases n by one,
// B. recursion that halves n.
//
// Determine for each:
// - runtime,
// - recursion depth,
// - stack space.
//
// Explain why the two functions have different stack requirements.

// -----------------------------------------------------------------------------
// Exercise 07 — Balanced Tree vs Skewed Tree
// -----------------------------------------------------------------------------
// Build or model two trees containing the same number of nodes:
// A. approximately balanced,
// B. completely skewed.
//
// Analyze recursive DFS stack space for each.
//
// Explain why the same algorithm can use O(log n) stack space on one tree and
// O(n) on another.

// -----------------------------------------------------------------------------
// Exercise 08 — BFS vs DFS Memory
// -----------------------------------------------------------------------------
// Implement BFS and DFS traversal for a tree or graph.
//
// Track the maximum size of:
// - DFS stack / recursion stack,
// - BFS queue,
// - visited set.
//
// Explain how tree shape changes the memory behavior.

// -----------------------------------------------------------------------------
// Exercise 09 — Graph Representation
// -----------------------------------------------------------------------------
// Represent a graph using:
// A. adjacency matrix,
// B. adjacency list.
//
// Analyze memory in terms of V and E.
//
// Test your reasoning for:
// - sparse graphs,
// - dense graphs.

// -----------------------------------------------------------------------------
// Exercise 10 — Intermediate Arrays
// -----------------------------------------------------------------------------
// Implement a transformation pipeline similar to:
//
// arr.filter(...).map(...).filter(...)
//
// Identify the intermediate structures that may be created.
//
// Compare the memory behavior with a single-pass loop that performs all required
// transformations.

// -----------------------------------------------------------------------------
// Exercise 11 — Peak Live Memory vs Total Allocation
// -----------------------------------------------------------------------------
// Write a loop that repeatedly creates and discards temporary arrays.
//
// Estimate:
// - peak live memory,
// - total allocated memory over the full run.
//
// Explain why these quantities can differ significantly.

// -----------------------------------------------------------------------------
// Exercise 12 — Streaming vs Materialization
// -----------------------------------------------------------------------------
// Design two record-processing functions:
// A. loads all N records before processing,
// B. processes records in bounded chunks.
//
// Compare their working-memory requirements.
//
// Explain the trade-off between memory, throughput, and implementation complexity.

// -----------------------------------------------------------------------------
// Exercise 13 — Dynamic Array Capacity
// -----------------------------------------------------------------------------
// Implement a simplified dynamic array with geometric capacity growth.
//
// Track:
// - logical size,
// - capacity,
// - allocated slots,
// - copied elements during resize.
//
// Explain why capacity remains O(n) while the constant factor matters in practice.

// -----------------------------------------------------------------------------
// Exercise 14 — Unbounded Cache
// -----------------------------------------------------------------------------
// Implement a simple Map-based cache.
//
// Insert entries indefinitely and analyze memory growth.
//
// Then add a bounded-size eviction policy.
//
// Compare the asymptotic and operational memory behavior.

// -----------------------------------------------------------------------------
// Exercise 15 — Concurrency Multiplier
// -----------------------------------------------------------------------------
// Assume one request requires O(n) working memory.
//
// Model total working memory for C concurrent requests.
//
// Include:
// - shared baseline memory,
// - per-request memory,
// - a shared cache.
//
// Explain why analyzing one request in isolation can be misleading.

// -----------------------------------------------------------------------------
// Exercise 16 — Backpressure
// -----------------------------------------------------------------------------
// Model a producer-consumer queue.
//
// Analyze memory when:
// A. the queue is unbounded,
// B. the queue has a fixed capacity.
//
// Explain how backpressure changes the memory bound and what happens when the
// producer is faster than the consumer.

// -----------------------------------------------------------------------------
// Exercise 17 — Backend Batch Processing
// -----------------------------------------------------------------------------
// Design a batch processor for N records with configurable batch size B.
//
// Analyze:
// - working memory,
// - number of batches,
// - database/network overhead,
// - throughput trade-offs.
//
// Explain why the asymptotic memory bound alone does not select the best B.

// -----------------------------------------------------------------------------
// Exercise 18 — AI Vector Memory
// -----------------------------------------------------------------------------
// Suppose a system stores N vectors of dimension D.
//
// Derive raw storage in terms of N, D, and bytes per value.
//
// Then account conceptually for:
// - index overhead,
// - metadata,
// - candidate buffers,
// - final retrieval context.
//
// Explain why O(ND) is useful but insufficient for capacity planning.

// -----------------------------------------------------------------------------
// Exercise 19 — Allocation Pressure
// -----------------------------------------------------------------------------
// Create two implementations of the same transformation:
// A. creates many temporary objects,
// B. reuses a bounded working structure where safe.
//
// Compare:
// - peak memory,
// - allocation count conceptually,
// - garbage-collection pressure,
// - readability and safety.
//
// Do not assume lower allocation automatically means a better implementation.

// -----------------------------------------------------------------------------
// Exercise 20 — Production-Grade Space Analysis
// -----------------------------------------------------------------------------
// Choose one algorithm you have implemented previously and produce a complete
// memory analysis containing:
//
// 1. Input space
// 2. Output space
// 3. Auxiliary space
// 4. Stack space
// 5. Peak live memory
// 6. Total allocation behavior
// 7. Shared vs per-request memory
// 8. Concurrency impact
// 9. Retention risks
// 10. GC/allocation considerations
// 11. Big-O result
// 12. Concrete production risks
//
// Finish with one optimization that trades memory for time and one that trades
// time for memory.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can distinguish input, output, and auxiliary space.
// [ ] I can calculate recursive stack space.
// [ ] I distinguish stack depth from total recursive calls.
// [ ] I understand references, aliasing, shallow copies, and deep copies.
// [ ] I can analyze arrays, Maps, Sets, and graph representations.
// [ ] I understand in-place algorithms.
// [ ] I can identify hidden/intermediate allocations.
// [ ] I distinguish peak live memory from total allocation.
// [ ] I understand streaming and bounded buffering.
// [ ] I understand how concurrency multiplies working memory.
// [ ] I understand why unbounded retention is dangerous.
// [ ] I understand the role of garbage collection in practical memory behavior.
// [ ] I can reason about backend memory under load.
// [ ] I can reason about AI vector/index memory.
// [ ] I can produce a production-grade space-complexity analysis.
