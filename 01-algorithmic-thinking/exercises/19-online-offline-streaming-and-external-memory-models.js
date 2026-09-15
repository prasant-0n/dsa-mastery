// 01.19 — Online, Offline, Streaming & External-Memory Algorithmic Models
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. State the computational model before coding.
// 3. Explicitly track time, memory, and I/O where relevant.
// 4. Distinguish exact from approximate solutions.

// -----------------------------------------------------------------------------
// Exercise 01 — Model Classification
// -----------------------------------------------------------------------------
// Classify each workload as primarily online, offline, streaming, batch, or a
// hybrid. Explain why:
// A. processing a static CSV after upload,
// B. live API request routing,
// C. counting events from an unbounded stream,
// D. nightly analytics over a day's data,
// E. continuously updating search indexes.

// -----------------------------------------------------------------------------
// Exercise 02 — One Pass vs Memory
// -----------------------------------------------------------------------------
// Design two one-pass algorithms:
// A. one using O(1) memory,
// B. one using O(n) memory.
//
// Explain why “one pass” does not mean “constant space.”

// -----------------------------------------------------------------------------
// Exercise 03 — Online Minimum
// -----------------------------------------------------------------------------
// Process an incoming numeric stream and maintain its minimum value.
//
// Requirements:
// - one pass,
// - O(1) additional state.
//
// State the invariant after processing each prefix.

// -----------------------------------------------------------------------------
// Exercise 04 — Streaming Top-K
// -----------------------------------------------------------------------------
// Maintain the largest K values from a stream using a heap.
//
// Analyze:
// - time,
// - memory,
// - state invariant.
//
// Explain why sorting every value is unnecessary.

// -----------------------------------------------------------------------------
// Exercise 05 — Exact Streaming Deduplication
// -----------------------------------------------------------------------------
// Detect duplicate event IDs in a stream using exact state.
//
// Analyze memory as the number of unique IDs grows.
//
// Explain why an exact solution may become unsuitable for an unbounded stream.

// -----------------------------------------------------------------------------
// Exercise 06 — Approximate Deduplication
// -----------------------------------------------------------------------------
// Replace the exact Set from Exercise 05 with a probabilistic membership structure.
//
// Explain:
// - what false positives mean,
// - whether false negatives are possible in your chosen structure,
// - when the approximation is acceptable,
// - how memory changes.

// -----------------------------------------------------------------------------
// Exercise 07 — Sliding Window Maximum
// -----------------------------------------------------------------------------
// Process an array/stream with a fixed-size window and compute the maximum for
// each window.
//
// Use a deque-based approach.
//
// Prove why expired and dominated elements can be removed safely.
//
// Analyze total operations using amortized reasoning.

// -----------------------------------------------------------------------------
// Exercise 08 — Tumbling Window Aggregation
// -----------------------------------------------------------------------------
// Group incoming events into fixed non-overlapping windows.
//
// Maintain a count and sum for each active window.
//
// Explain what state must be retained and when it can be discarded.

// -----------------------------------------------------------------------------
// Exercise 09 — Late Events
// -----------------------------------------------------------------------------
// Simulate events with event timestamps that arrive out of order.
//
// Design a policy for:
// A. immediately closing a window,
// B. allowing bounded lateness.
//
// Explain how the choice changes correctness and state requirements.

// -----------------------------------------------------------------------------
// Exercise 10 — Online vs Offline Query Processing
// -----------------------------------------------------------------------------
// Given a static array and many range queries, design:
// A. an online solution that answers each query immediately,
// B. an offline solution that can reorder/process queries together.
//
// Compare preprocessing, query time, memory, and assumptions.

// -----------------------------------------------------------------------------
// Exercise 11 — Micro-Batching
// -----------------------------------------------------------------------------
// Simulate an event consumer that starts processing when either:
// - batch size reaches B, or
// - waiting time reaches T milliseconds.
//
// Measure throughput and added latency as B and T change.

// -----------------------------------------------------------------------------
// Exercise 12 — Backpressure Simulation
// -----------------------------------------------------------------------------
// Simulate a producer and consumer where the producer can be faster than the
// consumer.
//
// Implement a bounded queue.
//
// Decide what happens when the queue is full:
// - block,
// - reject/drop,
// - sample,
// - apply backpressure.
//
// Measure queue growth and memory behavior.

// -----------------------------------------------------------------------------
// Exercise 13 — Queue Stability
// -----------------------------------------------------------------------------
// Simulate several combinations of arrival and service rates.
//
// Identify which workloads produce stable queues and which produce unbounded
// backlog under the simplified model.
//
// Explain the result mathematically.

// -----------------------------------------------------------------------------
// Exercise 14 — External Merge Sort
// -----------------------------------------------------------------------------
// Assume an input dataset is larger than available memory.
//
// Implement a simulation that:
// 1. splits input into memory-sized chunks,
// 2. sorts each chunk,
// 3. treats chunks as sorted runs,
// 4. merges the runs using a min-heap.
//
// Track the number of logical reads/writes.

// -----------------------------------------------------------------------------
// Exercise 15 — K-Way Merge
// -----------------------------------------------------------------------------
// Given K sorted iterators, merge them into one sorted stream.
//
// Use a min-heap.
//
// Analyze complexity in terms of N total items and K streams.
//
// Explain why this pattern is useful for external-memory algorithms.

// -----------------------------------------------------------------------------
// Exercise 16 — Pagination Comparison
// -----------------------------------------------------------------------------
// Model a large ordered dataset and compare:
// A. offset pagination,
// B. keyset/cursor pagination.
//
// Simulate deep pages and count the number of records examined.
//
// Explain which data representation/index makes the cursor approach efficient.

// -----------------------------------------------------------------------------
// Exercise 17 — Online vs Offline Caching
// -----------------------------------------------------------------------------
// Design a cache policy for a request stream without future knowledge.
//
// Then imagine an offline algorithm that knows the complete request sequence.
//
// Compare the decisions and explain why future knowledge changes the problem.

// -----------------------------------------------------------------------------
// Exercise 18 — AI Embedding Pipeline
// -----------------------------------------------------------------------------
// Simulate processing a large document collection through an embedding stage.
//
// Compare:
// A. one document at a time,
// B. fixed-size batches,
// C. micro-batches with a time threshold.
//
// Measure:
// - throughput,
// - peak memory,
// - waiting latency,
// - failed-work/retry granularity.

// -----------------------------------------------------------------------------
// Exercise 19 — Incremental RAG Index Update
// -----------------------------------------------------------------------------
// Given a corpus where only a small fraction of documents change, compare:
// A. rebuild the entire index,
// B. reprocess only changed documents/chunks.
//
// Model the work saved as corpus size grows.
//
// Identify what metadata is required to safely detect changed content.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Large-Scale Algorithm Design
// -----------------------------------------------------------------------------
// Design a production-style algorithm for processing a very large event dataset.
//
// Your design must explicitly specify:
// 1. online/offline/streaming/batch model,
// 2. one-pass or multi-pass requirement,
// 3. memory budget,
// 4. exact vs approximate guarantees,
// 5. state representation,
// 6. data structures,
// 7. batching strategy,
// 8. backpressure behavior,
// 9. ordering/event-time semantics,
// 10. failure and checkpoint strategy,
// 11. CPU complexity,
// 12. memory complexity,
// 13. I/O complexity if applicable,
// 14. scalability bottlenecks,
// 15. backend or AI application.
//
// Finish with an explanation of why the chosen computational model is more
// appropriate than a naive in-memory batch algorithm.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can distinguish online and offline computation.
// [ ] I understand streaming vs batch processing.
// [ ] I understand one-pass vs multi-pass constraints.
// [ ] I know why one-pass does not imply O(1) memory.
// [ ] I can design bounded-memory streaming algorithms.
// [ ] I can maintain streaming Top-K.
// [ ] I can reason about exact vs approximate state.
// [ ] I understand sliding and tumbling windows.
// [ ] I can reason about late events.
// [ ] I understand micro-batching trade-offs.
// [ ] I can reason about backpressure.
// [ ] I understand queue stability intuition.
// [ ] I can design external merge sort.
// [ ] I can implement K-way merge with a heap.
// [ ] I understand external-memory/I/O-aware complexity.
// [ ] I can explain why B-trees reduce storage I/O depth.
// [ ] I understand indexing as preprocessing.
// [ ] I can compare offset and cursor pagination.
// [ ] I can apply streaming/batching models to AI pipelines.
// [ ] I can choose a computational model before choosing an algorithm.
