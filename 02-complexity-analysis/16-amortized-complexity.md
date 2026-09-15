# 02.16 — Amortized Complexity

## Learning Objective

Learn to analyze a sequence of operations by distributing occasional expensive operations across many cheap operations.

The central idea:

> **Amortized complexity asks for the average cost per operation over a sequence, without assuming a probability distribution.**

---

# 1. Why Amortized Analysis Exists

Some data structures contain operations that are usually cheap but occasionally expensive.

Example: a dynamic array.

Most appends are approximately constant time:

```text
append → O(1)
```

But when capacity is full, the array may need to:

```text
allocate larger storage
copy existing elements
```

That individual operation can cost:

```text
O(n)
```

Yet a long sequence of appends can still have:

```text
O(1) amortized cost per append
```

Amortized analysis explains why.

---

# 2. Amortized vs Worst-Case vs Average-Case

These concepts are different.

### Worst-case

Maximum cost of one operation or input.

### Average-case

Expected cost under a probability distribution over inputs/operations.

### Amortized

Average cost over a sequence of operations, regardless of probability.

A dynamic-array append can be:

```text
Worst-case:  O(n)
Amortized:   O(1)
```

There is no contradiction.

---

# 3. A Simple Sequence

Suppose operations have costs:

```text
1, 1, 1, 1, 8
```

Total cost:

```text
12
```

Across five operations:

```text
12 / 5 = 2.4
```

The expensive operation is paid for by the whole sequence.

Amortized analysis generalizes this idea mathematically.

---

# 4. Aggregate Method

The aggregate method calculates:

```text
Total cost of n operations
--------------------------
          n
```

If the total cost is `O(n)`, then amortized cost per operation is:

```text
O(1)
```

Example: a binary counter.

---

# 5. Binary Counter

Suppose a binary counter starts at:

```text
0000
```

and increments repeatedly.

Some increments flip only one bit:

```text
0000 → 0001
```

Some flip many bits:

```text
0111 → 1000
```

The worst-case cost of one increment can be:

```text
O(log n)
```

But across a long sequence, each bit flips at a predictable frequency.

---

# 6. Aggregate Analysis of a Binary Counter

For a `k`-bit counter:

- lowest bit flips every increment
- second bit flips every 2 increments
- third bit every 4 increments
- fourth bit every 8 increments

Across `n` increments, total flips are approximately:

```text
n + n/2 + n/4 + n/8 + ...
```

This geometric series is:

```text
O(n)
```

Therefore:

```text
Amortized cost per increment = O(1)
```

---

# 7. Dynamic Arrays

A dynamic array typically maintains:

```text
size
capacity
```

When:

```text
size < capacity
```

append is cheap.

When:

```text
size = capacity
```

resizing occurs.

With geometric growth such as doubling:

```text
capacity → 2 × capacity
```

resizing costs are occasional but increasingly expensive.

---

# 8. Why Dynamic-Array Append Is O(1) Amortized

Suppose capacities are:

```text
1, 2, 4, 8, 16, ...
```

The total number of copied elements across all resizes up to `n` elements is approximately:

```text
1 + 2 + 4 + ... + n
```

which is:

```text
O(n)
```

Therefore `n` appends perform:

```text
O(n)
```

total work.

So one append costs:

```text
O(1) amortized
```

---

# 9. Why Incremental Growth Can Be Expensive

Suppose capacity grows by one each time.

Then appending elements can require:

```text
1 + 2 + 3 + ... + n
```

copies.

That is:

```text
Θ(n²)
```

total copying work.

Therefore the amortized append cost becomes:

```text
Θ(n)
```

This is why geometric growth is important.

---

# 10. Accounting Method

The accounting method assigns an artificial “amortized charge” to each operation.

Cheap operations may be charged slightly more than their immediate cost.

The extra amount is stored as **credit** and later pays for expensive operations.

For a dynamic array, one conceptual strategy is:

```text
charge each append a few units
```

Some units pay for the current insertion.

Some become credit attached to elements.

When resizing occurs, accumulated credit pays for copying.

The exact accounting scheme must ensure:

```text
credit never becomes negative
```

---

# 11. Accounting Method Invariant

A valid accounting proof needs:

```text
Accumulated credit ≥ 0
```

throughout the sequence.

If the credit account becomes negative, the proposed amortized charges are insufficient.

This connects amortized analysis with invariant reasoning.

---

# 12. Potential Method

The potential method defines a potential function:

```text
Φ(state) ≥ 0
```

representing stored “energy” in the data structure.

For operation `i`:

```text
amortized cost
= actual cost
+ Φ(after) - Φ(before)
```

So an operation can:

- increase potential → save credit for later
- decrease potential → spend previously stored credit

---

# 13. Potential-Method Interpretation

Think of potential as stored work.

Cheap operation:

```text
actual cost = small
potential increases
```

Expensive operation:

```text
actual cost = large
potential decreases
```

Across the entire sequence, potential changes telescope.

This gives a rigorous way to spread expensive work across earlier operations.

---

# 14. Dynamic Array Potential Intuition

For a doubling dynamic array, potential can be designed around how full the array is.

As elements accumulate after a resize:

```text
potential increases
```

When another resize happens:

```text
potential pays for copying
```

A carefully chosen potential proves constant amortized append cost.

The exact potential function depends on the resizing policy.

---

# 15. Stack With Multipop

Consider a stack supporting:

```text
push(x)
pop()
multipop(k)
```

where `multipop(k)` removes up to `k` elements.

A single `multipop(k)` can cost:

```text
O(k)
```

But each element can be popped only after it was pushed.

Across a sequence of `n` operations:

```text
Total pops ≤ Total pushes ≤ n
```

Therefore the total popping work is:

```text
O(n)
```

and stack operations have:

```text
O(1) amortized cost
```

---

# 16. Two-Stack Queue

Implement a queue using:

```text
inStack
outStack
```

Enqueue:

```text
push into inStack
```

Dequeue when `outStack` is empty:

```text
move all items from inStack → outStack
pop from outStack
```

One transfer can cost:

```text
O(n)
```

but each element is transferred at most once in each direction for a relevant lifecycle.

Therefore queue operations are:

```text
O(1) amortized
```

---

# 17. Monotonic Stack

A monotonic stack may appear to contain a nested loop:

```js
for (const x of items) {
  while (stack.length && shouldRemove(stack.at(-1), x)) {
    stack.pop();
  }
  stack.push(x);
}
```

The `while` loop can pop many elements for one input item.

But each element is:

```text
pushed at most once
popped at most once
```

Therefore total stack operations are:

```text
O(n)
```

and the algorithm is:

```text
O(n) amortized
```

This is one of the most important DSA applications of amortized reasoning.

---

# 18. Sliding Window Pointer Movement

Consider:

```js
let left = 0;

for (let right = 0; right < n; right++) {
  while (invalid()) {
    left++;
  }
}
```

The `while` loop may run many times during one iteration of `right`.

But:

```text
right moves at most n times
left moves at most n times
```

Therefore total pointer movement is:

```text
O(n)
```

not `O(n²)`.

---

# 19. Pay-Once Reasoning

A useful mental model:

> **If an expensive operation permanently removes or advances something, ask whether the same object can pay that cost again.**

Examples:

- element popped from a monotonic stack
- pointer advanced in a sliding window
- item moved between queue stacks
- element copied during a bounded number of resizes
- token removed from a processing buffer

If each object can incur expensive work only a constant number of times, total work may be linear.

---

# 20. Amortized Analysis of Buffers

Suppose a buffer periodically flushes accumulated records.

Most writes may be cheap:

```text
append → O(1)
```

Occasionally:

```text
flush → O(k)
```

If every record is flushed once, total flush work across `n` records is:

```text
O(n)
```

Therefore average cost per record can be:

```text
O(1) amortized
```

This pattern appears frequently in backend batching.

---

# 21. Batching and Amortization

Suppose a system performs expensive setup work once for a batch of `B` items.

If setup costs:

```text
O(B)
```

and every item is processed once, total cost remains proportional to processed data.

But if setup contains a fixed cost `C`:

```text
Cost per item ≈ C/B + per-item cost
```

Larger batches amortize fixed overhead but may increase:

- latency
- memory usage
- queueing delay
- failure blast radius

Amortized efficiency is not automatically good system design.

---

# 22. Amortization vs Tail Latency

Amortized `O(1)` does **not** mean every operation is fast.

An operation may still occasionally take:

```text
O(n)
```

This matters in backend systems.

A dynamic-array resize or cache maintenance operation can create a latency spike even when long-run amortized cost is excellent.

Therefore production engineering must consider:

```text
amortized cost
+
p99/p999 latency
+
allocation/GC behavior
+
contention
+
I/O
```

---

# 23. Amortized Complexity and Concurrency

An amortized guarantee for a single-threaded data structure does not automatically remain sufficient under concurrency.

Concurrent systems introduce:

- locks
- contention
- atomic operations
- retries
- scheduling
- cache coherence
- synchronization overhead

The computational sequence must be analyzed together with the concurrency model.

---

# 24. Cache Eviction Work

Suppose a cache occasionally performs cleanup after reaching a threshold.

If cleanup scans `k` expired entries and each entry is removed permanently, total cleanup work can be amortized over the entries removed.

But if every request repeatedly rescans the same retained entries, the pay-once argument fails.

The key question is:

```text
Can the same work recur without permanently reducing the future workload?
```

---

# 25. Retry Systems and Amortization

Retries require special care.

If failed work is retried repeatedly, an apparently bounded operation may perform unbounded or multiplicative work.

Do not claim amortized constant cost merely because each individual attempt is cheap.

You must model:

```text
attempts per operation
failure behavior
backoff
queueing
repeated processing
```

This is particularly important in backend job systems.

---

# 26. AI Example — Incremental Index Maintenance

Suppose an index occasionally rebuilds or compacts data.

Most updates may be cheap:

```text
O(1) or O(log n)
```

while periodic compaction is expensive.

Amortized analysis can determine whether total maintenance work remains bounded per update.

But AI systems also need to consider:

- memory pressure
- disk I/O
- latency spikes
- concurrent queries
- index freshness
- rebuild scheduling

---

# 27. AI Example — Batched Inference

Suppose model setup or kernel-launch overhead is shared across a batch.

Processing requests individually may repeatedly pay fixed overhead.

Batching can amortize that cost across many requests.

But larger batches can increase:

```text
queueing latency
memory usage
worst-case request delay
```

Therefore the algorithmic question and serving-system question are related but not identical.

---

# 28. Aggregate, Accounting, Potential — Comparison

| Method | Main Idea | Typical Use |
|---|---|---|
| Aggregate | Total sequence cost | Dynamic arrays, counters |
| Accounting | Charge operations and store credit | Data-structure proofs |
| Potential | Store energy in a potential function | Formal amortized proofs |

All three establish the same fundamental type of guarantee:

```text
sequence total cost / number of operations
```

---

# 29. Amortized Analysis Does Not Use Probability

This is a critical distinction.

Suppose an operation is expensive only once every million operations.

You do **not** need to assume that expensive events occur randomly.

Instead, you prove structurally that across any valid sequence, the expensive operations cannot happen too often.

Therefore:

```text
amortized ≠ expected
```

---

# 30. Amortized vs Expected Complexity

### Expected

Uses probabilities:

```text
E[cost]
```

### Amortized

Uses sequence structure:

```text
Σ cost / number of operations
```

A randomized algorithm may have expected `O(1)` cost.

A deterministic data structure may have amortized `O(1)` cost.

These are fundamentally different guarantees.

---

# 31. Common Failure of Amortized Reasoning

Bad argument:

> “This expensive operation doesn't happen often, so it is amortized O(1).”

That is not a proof.

You must establish why it cannot happen often.

Valid reasoning looks like:

```text
Each element is inserted once.
Each element can be removed once.
Therefore total removals ≤ n.
```

or:

```text
Resizes occur at capacities 1,2,4,8,...
Total copied elements form a geometric sum.
Therefore total copying ≤ O(n).
```

---

# 32. Expert Amortized-Analysis Workflow

```text
1. Define the operation sequence.
2. Identify expensive operations.
3. Determine what causes them.
4. Ask what future work is reduced by the expensive operation.
5. Find a pay-once / bounded-repetition property.
6. Choose aggregate, accounting, or potential method.
7. Bound total sequence cost.
8. Divide by number of operations.
9. Separately analyze worst-case single-operation cost.
10. For production systems, analyze latency spikes and resource behavior.
```

---

# 33. Interview Framework

A strong answer should distinguish:

```text
Worst-case single operation = ?
Total sequence cost = ?
Amortized per operation = ?
```

Example dynamic array:

> “A resize can cost O(n) for one append because existing elements are copied. However, with geometric capacity growth, resizes occur at exponentially increasing capacities. The total number of copied elements over n appends is O(n), so n appends cost O(n) total and O(1) amortized per append. The single resize remains O(n) worst case.”

---

# 34. Mastery Checklist

- [ ] Distinguish amortized, worst-case, and average-case complexity.
- [ ] Understand aggregate analysis.
- [ ] Understand the accounting method.
- [ ] Understand the potential method.
- [ ] Analyze dynamic-array resizing.
- [ ] Explain why geometric growth gives O(1) amortized append.
- [ ] Explain why incremental growth can be O(n) amortized.
- [ ] Analyze binary counters.
- [ ] Analyze multipop stacks.
- [ ] Analyze two-stack queues.
- [ ] Analyze monotonic stacks.
- [ ] Analyze sliding-window pointer movement.
- [ ] Recognize pay-once reasoning.
- [ ] Analyze buffers and batching.
- [ ] Distinguish amortized cost from tail latency.
- [ ] Understand why retries can break simple amortization arguments.
- [ ] Apply amortized reasoning to backend systems.
- [ ] Apply amortized reasoning to AI indexing/batching.
- [ ] Prove rather than merely assert an amortized bound.
- [ ] Explain the guarantee clearly in interviews.

---

# Key Takeaways

1. **Amortized analysis studies a sequence of operations, not the probability of an individual operation.**
2. **An operation can be O(n) worst case and O(1) amortized.**
3. **Dynamic arrays are the canonical example.**
4. **Aggregate analysis bounds total sequence cost.**
5. **Accounting stores prepaid credit conceptually.**
6. **Potential functions model stored work mathematically.**
7. **Monotonic stacks and sliding windows are classic practical examples.**
8. **The pay-once principle is a powerful way to discover amortized bounds.**
9. **Amortized O(1) does not guarantee low tail latency for every individual operation.**
10. **Backend batching, buffering, caching, and AI index maintenance often contain amortizable work.**
11. **A valid amortized argument proves that expensive work cannot recur too frequently over the sequence.**
