// 01.9 — Amortized Analysis & Aggregate Cost Reasoning
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. Analyze a SEQUENCE of operations, not only one operation.
// 3. State both amortized cost and worst individual cost when relevant.
// 4. Do not confuse amortized analysis with average-case analysis.
// 5. Explain why expensive work cannot happen too frequently.

// -----------------------------------------------------------------------------
// Exercise 01 — Dynamic Array Model
// -----------------------------------------------------------------------------
// Design a simple dynamic-array abstraction with:
// - fixed initial capacity,
// - append(value),
// - automatic capacity growth.
//
// Record the actual cost of each operation for a sequence of appends.
//
// Derive the total cost of n appends when capacity doubles.

// -----------------------------------------------------------------------------
// Exercise 02 — Aggregate Analysis
// -----------------------------------------------------------------------------
// For n appends to a dynamic array whose capacity doubles:
//
// 1. List the resize points.
// 2. Calculate the number of copied elements at each resize.
// 3. Express the total copying cost as a geometric sum.
// 4. Bound the sum.
// 5. Add ordinary insertion work.
// 6. Derive amortized cost per append.

// -----------------------------------------------------------------------------
// Exercise 03 — Bad Growth Strategy
// -----------------------------------------------------------------------------
// Analyze a dynamic array whose capacity increases by exactly one whenever full.
//
// Derive:
// - total copy cost for n appends,
// - total runtime,
// - amortized append cost.
//
// Compare it with geometric growth.

// -----------------------------------------------------------------------------
// Exercise 04 — Growth Factor Comparison
// -----------------------------------------------------------------------------
// Compare constant growth factors such as:
// - x2
// - x1.5
// - x1.25
//
// For each, reason about:
// - number of resizes,
// - total copying work,
// - unused capacity,
// - allocation pressure.
//
// Explain why Big-O alone does not tell the whole production story.

// -----------------------------------------------------------------------------
// Exercise 05 — Stack Multipop
// -----------------------------------------------------------------------------
// Implement a stack with:
// - push(value)
// - pop()
// - multipop(k)
//
// Construct a sequence that makes one multipop expensive.
// Then prove that a sequence of m operations still has O(m) total pop work.

// -----------------------------------------------------------------------------
// Exercise 06 — Two-Stack Queue
// -----------------------------------------------------------------------------
// Implement a queue using two stacks:
// - enqueue(value)
// - dequeue()
//
// Allow a transfer from inStack to outStack when outStack is empty.
//
// Analyze:
// - worst cost of one dequeue,
// - total transfer cost,
// - amortized dequeue cost.

// -----------------------------------------------------------------------------
// Exercise 07 — Pay-Once Reasoning
// -----------------------------------------------------------------------------
// Choose an operation whose cost appears repeatedly expensive.
// Identify a resource that can be consumed at most once or a bounded number of
// times per element.
//
// Use that resource to prove an amortized bound.
//
// Write the proof without using probability.

// -----------------------------------------------------------------------------
// Exercise 08 — Monotonic Stack
// -----------------------------------------------------------------------------
// Implement a monotonic stack for a suitable array problem.
//
// The implementation may contain:
//   while (stack is not empty && condition) stack.pop();
//
// Prove that the total number of pushes and pops is O(n).
//
// Explain why the inner while loop does not make the complete algorithm O(n^2).

// -----------------------------------------------------------------------------
// Exercise 09 — Sliding Window Pointer Movement
// -----------------------------------------------------------------------------
// Implement a sliding-window algorithm containing a nested while loop.
//
// Track how many times:
// - right moves,
// - left moves.
//
// Prove that both pointers move monotonically and derive the total runtime.

// -----------------------------------------------------------------------------
// Exercise 10 — Accounting Method
// -----------------------------------------------------------------------------
// Construct an accounting-method proof for dynamic-array append.
//
// Choose an amortized charge per append.
// Divide the charge into:
// - immediate work,
// - stored credit.
//
// Show that stored credit is sufficient to pay for future copying.
//
// State the invariant that prevents credit from becoming negative.

// -----------------------------------------------------------------------------
// Exercise 11 — Potential Method
// -----------------------------------------------------------------------------
// Define a potential function for a dynamic array.
//
// For each append, calculate conceptually:
//   amortized cost = actual cost + change in potential
//
// Choose a potential that remains non-negative and explain why it pays for
// resizing work.

// -----------------------------------------------------------------------------
// Exercise 12 — Average vs Amortized
// -----------------------------------------------------------------------------
// Create two examples:
// A. An average-case O(1) operation whose guarantee depends on randomness or an
//    input distribution.
// B. An amortized O(1) operation whose sequence guarantee does not require a
//    probability distribution.
//
// Explain the exact difference between the proofs.

// -----------------------------------------------------------------------------
// Exercise 13 — Worst Individual Cost vs Amortized Cost
// -----------------------------------------------------------------------------
// Find or construct a data structure operation with:
// - worst individual cost O(n),
// - amortized cost O(1).
//
// Explain why saying “the operation is O(1)” without the word amortized would
// be misleading.

// -----------------------------------------------------------------------------
// Exercise 14 — Backend Cache Maintenance
// -----------------------------------------------------------------------------
// Design a cache where expired entries are occasionally cleaned up in batches.
//
// Model:
// - normal operation cost,
// - cleanup cost,
// - maximum cleanup frequency.
//
// Determine whether an amortized bound is possible.
// Then explain why the worst cleanup pause still matters for request latency.

// -----------------------------------------------------------------------------
// Exercise 15 — Backend Buffer Flush
// -----------------------------------------------------------------------------
// Model a log/event buffer that collects records and periodically flushes them
// to persistent storage.
//
// Analyze:
// - per-record work,
// - batch flush work,
// - total work over m records,
// - amortized cost,
// - individual flush latency.
//
// Explain which metrics should be monitored in production.

// -----------------------------------------------------------------------------
// Exercise 16 — AI Batch Inference
// -----------------------------------------------------------------------------
// Suppose requests are accumulated into batches before inference.
//
// Compare:
// A. immediate per-request processing,
// B. batched processing.
//
// Build a simple cost model and reason about:
// - throughput,
// - amortized per-request cost,
// - batching delay,
// - tail latency,
// - memory usage.

// -----------------------------------------------------------------------------
// Exercise 17 — AI Index Maintenance
// -----------------------------------------------------------------------------
// Model a vector/index structure where updates are cheap but periodic compaction
// or rebuilding is expensive.
//
// Determine when amortized analysis can establish a useful sequence bound.
// Then identify production conditions where that amortized bound is insufficient.

// -----------------------------------------------------------------------------
// Exercise 18 — Sequence Adversary
// -----------------------------------------------------------------------------
// Construct a worst-case operation sequence for a dynamic array.
//
// Show that even an adversarial sequence cannot force more than linear total
// copying across n appends when capacity grows geometrically.
//
// Explain why this is an amortized guarantee rather than an average-case claim.

// -----------------------------------------------------------------------------
// Exercise 19 — Compare Three Proof Methods
// -----------------------------------------------------------------------------
// Prove the amortized O(1) append bound for a geometric dynamic array using:
// 1. Aggregate analysis.
// 2. Accounting method.
// 3. Potential method.
//
// For each proof, identify what makes the expensive resize affordable.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Production Analysis
// -----------------------------------------------------------------------------
// Choose one amortized data structure or algorithm and write a production-grade
// complexity analysis containing:
//
// - operation sequence,
// - worst individual operation,
// - amortized cost,
// - total sequence cost,
// - auxiliary memory,
// - allocation behavior,
// - latency-spike risk,
// - event-loop impact if applicable,
// - observability metrics,
// - trade-offs.
//
// Finish by explaining why Big-O alone is insufficient for this system.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can define amortized analysis precisely.
// [ ] I can distinguish amortized from average-case complexity.
// [ ] I can analyze a sequence instead of an isolated operation.
// [ ] I can perform aggregate analysis.
// [ ] I understand geometric dynamic-array resizing.
// [ ] I can prove amortized O(1) append.
// [ ] I understand accounting-method credit.
// [ ] I understand potential-method state potential.
// [ ] I can analyze multipop stacks.
// [ ] I can analyze two-stack queues.
// [ ] I can prove monotonic-stack linearity.
// [ ] I can explain nested sliding-window loops using bounded pointer movement.
// [ ] I can state both amortized and worst individual costs.
// [ ] I understand why amortized O(1) does not guarantee low tail latency.
// [ ] I can apply amortized reasoning to backend systems.
// [ ] I can apply amortized reasoning to AI infrastructure.
