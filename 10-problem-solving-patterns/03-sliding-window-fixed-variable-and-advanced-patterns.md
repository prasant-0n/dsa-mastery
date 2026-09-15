# 10.03 — Sliding Window: Fixed, Variable & Advanced Patterns

## 1. Objective

Sliding window is a specialized two-pointer technique for problems involving a contiguous range.

The window is represented by:

```text
[left ... right]
```

The core idea is to update the existing window instead of recomputing every subarray or substring from scratch.

## 2. Why It Exists

Brute force may inspect every contiguous range, producing quadratic or worse work.

A sliding window can often process each element a bounded number of times by expanding and shrinking the active range monotonically.

## 3. Fixed-Size Window

For window size `K`:

```text
add right
remove left when size > K
```

Typical applications:

- maximum sum of K elements;
- moving averages;
- fixed-size frequency analysis;
- rolling metrics.

## 4. Variable-Size Window

A variable window changes its size according to a validity condition:

```text
expand right
→ condition violated
→ shrink left
→ restore validity
```

The key question is whether the validity condition supports monotonic shrinking.

## 5. Window Invariant

A typical invariant is:

> After the shrink phase, the current window satisfies the required constraint.

The exact invariant depends on the problem.

## 6. Longest Valid Window

For problems asking for the longest valid contiguous range:

```text
expand
→ shrink until valid
→ update maximum
```

If both pointers move only forward, total pointer movement can be linear.

## 7. Shortest Valid Window

For minimum-length problems:

```text
expand until valid
→ record candidate
→ shrink while valid
```

The shrink loop can still be linear overall when `left` never moves backward.

## 8. At Most K Distinct Values

Maintain a frequency map and distinct-count state.

When the window exceeds K distinct values, remove values from the left until validity is restored.

This combines:

```text
sliding window + hashing
```

## 9. Exactly K Distinct Values

A useful transformation is:

```text
exactly(K) = atMost(K) - atMost(K - 1)
```

This is valid when the counted quantity is additive in the relevant sense.

## 10. Frequency-Constrained Windows

Maintain counts for required or forbidden values.

Examples:

- anagram windows;
- minimum covering substring;
- character quotas;
- token constraints.

## 11. Minimum Covering Window

Maintain:

- required frequency map;
- current frequency map;
- number of satisfied requirements.

Expand until all requirements are satisfied, then shrink while preserving validity.

## 12. Maximum Frequency Windows

Some windows are valid when the maximum frequency or another aggregate remains under a threshold.

The aggregate must be updated correctly when the left side is removed.

## 13. Sum-Constrained Windows

For non-negative values, a sum constraint often supports monotonic shrinking because removing elements cannot increase the sum.

For arbitrary negative values, this monotonic property can fail.

This is an important boundary of the standard sliding-window technique.

## 14. Why Negative Numbers Matter

Consider:

```text
sum(window) <= target
```

With negative numbers, removing the leftmost value can increase the sum.

Therefore the usual expand/shrink proof may no longer hold.

Never apply a window pattern without checking the monotonicity assumption.

## 15. Average / Ratio Constraints

Some average constraints can be transformed into sum conditions using algebra, but the transformation must preserve the problem semantics.

Do not assume a simple window exists merely because the input is contiguous.

## 16. String Windows

Sliding windows are especially common for strings:

- longest substring without repeats;
- minimum covering substring;
- permutation/anagram detection;
- bounded character frequency.

## 17. Longest Substring Without Repetition

Maintain the last-seen position or a frequency structure.

When a repeated character violates the invariant, advance the left boundary beyond the conflicting occurrence.

The last-seen-index method can skip multiple unnecessary left movements.

## 18. Anagram Detection

For fixed-length windows, compare frequency state rather than sorting every window.

This transforms repeated per-window work into incremental updates.

## 19. Rolling Hash Connection

A rolling hash can represent a moving sequence efficiently, but hash collisions require a correctness policy when exact equality is required.

Hashing is an optimization technique, not automatically an exact proof of string equality.

## 20. Prefix Sum vs Sliding Window

Use sliding windows when state can be updated incrementally and validity is monotonic.

Prefix sums can be preferable when arbitrary range-sum queries are needed or when negative values break window monotonicity.

## 21. Deque-Backed Windows

Some window problems require tracking a maximum/minimum efficiently.

A monotonic deque can maintain candidates:

```text
window movement + monotonic deque
```

Each element is inserted and removed a bounded number of times.

## 22. Maximum in Every Window

For each fixed-size window, maintain decreasing candidate values in a deque.

The front represents the current maximum.

Remove indices that leave the window and dominated candidates that can never become maximum.

## 23. Time-Based Windows

Backend streams often define windows by timestamps rather than element count.

Example:

```text
events during the last 60 seconds
```

The left boundary advances according to time, not a fixed number of records.

## 24. Event-Time Semantics

Streaming systems may receive late events.

A production window needs an explicit policy for:

- event time;
- processing time;
- lateness;
- watermarks;
- out-of-order events.

A simple array window does not solve these distributed semantics automatically.

## 25. Memory-Bounded Windows

If the window can grow indefinitely, the implementation needs a bounded-memory policy or a mathematical state representation that avoids retaining every element.

## 26. Window Aggregation

Maintain incremental state for:

- sum;
- count;
- frequency;
- min/max via deque;
- custom reversible aggregates where possible.

The key requirement is efficient addition and removal.

## 27. Irreversible Aggregates

Some aggregates are easy to add but expensive to remove.

For example, maintaining an exact median requires more sophisticated structures than a simple running sum.

Possible structures include two heaps with lazy deletion or other balanced data structures.

## 28. Backend Applications

Sliding windows appear in:

- rate limiting;
- rolling metrics;
- log aggregation;
- fraud/rule detection;
- request throttling;
- telemetry;
- time-based analytics;
- stream processing.

## 29. AI Applications

AI systems use windows for:

- token context processing;
- streaming inference;
- rolling feature extraction;
- sequence chunking;
- candidate streams;
- temporal anomaly detection.

## 30. Rate Limiting Example

A request limiter can maintain recent request timestamps.

For a fixed time interval:

```text
append current timestamp
→ remove timestamps outside window
→ inspect count
```

The production design must additionally consider concurrency, distributed instances, clock behavior, and memory bounds.

## 31. Correctness Proof

For every window algorithm, explain:

1. what the window represents;
2. what makes it valid;
3. why expansion cannot skip a necessary candidate;
4. why shrinking preserves the intended search space;
5. why every relevant window is considered or safely represented.

## 32. Complexity

For standard monotonic windows:

```text
right moves ≤ N
left moves ≤ N
```

Therefore total pointer movement is `O(N)`, plus the cost of maintaining auxiliary state.

For hash-based windows, include key-operation costs and expected/worst-case caveats.

## 33. Common Mistakes

1. Applying sliding windows to non-monotonic constraints.
2. Forgetting to remove left-side state.
3. Mishandling duplicate frequencies.
4. Using values instead of indices when boundaries matter.
5. Confusing substring with subsequence.
6. Recomputing aggregates unnecessarily.
7. Ignoring negative values.
8. Ignoring timestamp disorder in streaming systems.
9. Forgetting memory growth.
10. Failing to explain why the shrink operation is safe.

## 34. Edge Cases

Test:

- empty input;
- `K = 0`;
- `K = 1`;
- `K > N`;
- all identical values;
- all unique values;
- negative numbers;
- zero;
- repeated boundary values;
- required value absent;
- window becoming empty;
- late/out-of-order events.

## 35. Interview Framework

When a contiguous-range problem appears:

```text
1. Is the answer about a contiguous range?
2. Can the window state be updated incrementally?
3. Is validity monotonic as left/right move?
4. What state must be maintained?
5. What happens when the window becomes invalid?
6. Can each pointer move only forward?
7. What is the invariant?
8. What breaks the approach?
```

## 36. Revision Checklist

- [ ] I can distinguish fixed and variable windows.
- [ ] I can state a window invariant.
- [ ] I can solve at-most-K distinct problems.
- [ ] I understand exactly-K transformations.
- [ ] I can maintain frequency state.
- [ ] I understand why negative values can break sum windows.
- [ ] I can use a monotonic deque for window extrema.
- [ ] I can reason about time-based windows.
- [ ] I can analyze total pointer movement.
- [ ] I can explain backend and AI window applications.

## 37. Key Takeaways

1. **A sliding window is valid only when the window state can be updated and the boundary movement is justified by a monotonic property.**
2. **Fixed windows maintain a known size; variable windows maintain a validity condition.**
3. **Hash maps, deques, prefix state, and other structures can extend the basic window technique.**
4. **Negative values, non-monotonic predicates, and out-of-order streams are important limits of naive window reasoning.**
5. **The expert skill is proving that expanding and shrinking the window does not discard a necessary solution.**
