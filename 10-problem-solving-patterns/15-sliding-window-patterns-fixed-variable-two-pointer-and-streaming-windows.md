# 10.15 — Sliding Window Patterns: Fixed, Variable, Two-Pointer & Streaming Windows

## 1. Objective

A sliding window maintains a contiguous region of a sequence while moving its boundaries incrementally.

```text
expand right
→ maintain invariant
→ shrink left when required
→ record answer
```

The pattern avoids repeatedly rebuilding overlapping ranges.

## 2. Why It Exists

Many contiguous-subarray and substring problems have overlapping candidate ranges. If the window state can be updated incrementally, a quadratic enumeration can often become linear or near-linear.

## 3. Window State

A window is usually represented by:

```text
[left, right)
```

plus state such as:

- sum;
- frequency map;
- distinct-count;
- maximum/minimum structure;
- constraint counters.

## 4. Fixed-Size Window

For window size `K`:

1. add the entering element;
2. remove the leaving element;
3. evaluate the window.

After initialization, each step performs constant or bounded incremental work.

## 5. Fixed-Window Complexity

For a sequence of length `N`:

```text
Time: O(N)
Auxiliary state: depends on maintained structure
```

The output itself may add cost.

## 6. Variable-Size Window

A variable window changes size to maintain a condition.

A common structure is:

```text
for each right:
    add right
    while constraint is violated:
        remove left
        left++
    update answer
```

## 7. The Monotonicity Requirement

The classic variable-window technique works when violating or satisfying a constraint has a useful monotone relationship with moving the left boundary.

If shrinking can make a violation worse, the standard two-pointer proof may fail.

## 8. Window Invariant

A typical invariant is:

> After the shrink phase, the current window satisfies the required constraint.

The algorithm then evaluates the best valid window ending at the current right boundary.

## 9. Longest Valid Window

For longest-window problems, once the window is valid, update:

```text
best = max(best, right - left)
```

The proof relies on the fact that the chosen left boundary represents the earliest valid boundary for that right endpoint under the maintained rule.

## 10. Shortest Valid Window

For minimum-window problems, repeatedly shrink while the condition remains satisfied and record the smallest valid window.

This requires a clear feasibility invariant and often a frequency/deficit counter.

## 11. Frequency Map Windows

Character or value counts support conditions such as:

- at most `K` distinct values;
- exactly `K` distinct values;
- required multiplicities;
- anagram containment.

The map must be updated symmetrically when either boundary moves.

## 12. At-Most K Distinct

Maintain a frequency map and distinct count.

When distinct values exceed `K`, move the left boundary until the invariant is restored.

This is a foundational pattern for many substring problems.

## 13. Exactly K Distinct

A useful identity is:

```text
exactly(K) = atMost(K) - atMost(K - 1)
```

when counting subarrays/substrings under the same interpretation of distinctness.

## 14. Frequency Deficits

For minimum-window requirements, track how many required occurrences are still missing.

Adding a useful value can decrease the deficit; removing one can increase it.

This avoids rescanning the entire frequency map.

## 15. Sum-Based Windows

For nonnegative values, a target-sum window can often use two pointers because increasing the right boundary cannot decrease the sum and increasing the left boundary cannot increase it.

Negative values break this monotonicity; prefix sums and hashing may be more appropriate.

## 16. Maximum/Minimum in a Window

A monotonic deque maintains candidates in sorted order while discarding elements that can never become the answer for a future window.

This gives linear total processing for fixed-size sliding-window extrema.

## 17. Window + Heap

A heap can maintain order statistics inside a moving window, but deletions of expired elements require an explicit strategy such as lazy deletion or indexed removal.

The complexity differs from the monotonic-deque solution.

## 18. Window + Hashing

Hash maps are useful when the constraint is based on frequency, membership, or distinctness.

The expected lookup/update cost should be stated separately from worst-case hash-table behavior.

## 19. Window + Prefix Sum

Prefix sums can answer a window's aggregate in constant time, but maintaining a running aggregate is often simpler for ordinary sum windows.

Choose the representation based on the operation and query pattern.

## 20. Two Pointers vs Sliding Window

A sliding window is a specialized two-pointer pattern where the pointers delimit a contiguous maintained region.

Not every two-pointer algorithm is a sliding window: some use two independent positions moving according to ordering relationships.

## 21. Streaming Windows

In a stream, the window may be defined by:

- last `K` events;
- last `T` seconds;
- event-count limits;
- watermark/time semantics.

The data structure must support expiration of old events efficiently.

## 22. Time-Based Windows

For timestamped events, maintain events in nondecreasing arrival or event-time order when possible.

Expire entries whose timestamp falls outside the configured interval.

Out-of-order event processing requires additional semantics and cannot be solved by blindly assuming arrival order equals event time.

## 23. Session Windows

Sessionization groups events separated by less than a configured inactivity gap.

This is a windowing problem with a dynamic boundary determined by event timing.

## 24. Rate Limiting

Sliding-window rate limiting can track timestamps or counters representing recent requests.

Production systems must also define clock semantics, distributed coordination, memory limits, and approximation choices.

## 25. Circular / Ring Windows

A fixed-size rolling buffer can store only the current window and overwrite expired entries.

This gives bounded memory for count-based windows.

## 26. Amortized Pointer Movement

Although a nested `while` loop may appear quadratic, if `left` and `right` each only move forward, every element enters and leaves the window at most once.

Therefore total pointer movement is `O(N)`.

## 27. Correctness Proof

Prove:

1. every candidate right endpoint is processed;
2. window state exactly represents `[left, right)`;
3. shrinking restores the invariant;
4. no relevant candidate is skipped by monotone boundary movement;
5. recorded answers correspond to valid windows.

## 28. Common Mistakes

1. Applying variable windows when the predicate is not monotone.
2. Forgetting to remove expired elements from state.
3. Leaving zero-frequency keys in a distinct-count map.
4. Using a sum-window rule with negative numbers.
5. Mishandling empty windows.
6. Confusing `K` distinct with exactly `K` occurrences.
7. Ignoring out-of-order timestamps in streaming systems.
8. Claiming `O(N)` without amortized pointer reasoning.

## 29. Edge Cases

Test:

- empty sequence;
- `K = 0`;
- `K > N`;
- single element;
- all equal values;
- all distinct values;
- negative values;
- zero values;
- impossible target;
- target already satisfied by one item;
- duplicate timestamps;
- out-of-order events.

## 30. Backend Applications

Sliding windows are fundamental in:

- API rate limiting;
- metrics aggregation;
- log/event processing;
- anomaly detection;
- rolling usage limits;
- recent-request deduplication;
- stream processing.

## 31. AI Applications

Applications include:

- token/context windows;
- sequence feature extraction;
- rolling statistics;
- streaming inference;
- temporal anomaly detection;
- candidate-window scoring.

A model's context window also creates a resource constraint, although production context management may require more than a simple contiguous sliding window.

## 32. Testing Strategy

Use:

- brute-force window enumeration on small inputs;
- differential tests;
- invariant checks after every pointer movement;
- randomized frequency patterns;
- adversarial monotonicity cases;
- timestamp ordering tests;
- memory-bound tests for streaming windows.

## 33. Complexity

Typical patterns:

```text
fixed window: O(N)
monotone two-pointer: O(N)
frequency-map window: expected O(N)
monotonic deque extrema: O(N)
heap-backed window: often O(N log K)
```

Include state memory and preprocessing costs.

## 34. Interview Framework

When a contiguous-range problem appears:

```text
1. Is the region contiguous?
2. Is the window fixed or variable?
3. What state summarizes the window?
4. What happens when right expands?
5. What happens when left shrinks?
6. Is the validity predicate monotone?
7. Can every pointer move only forward?
8. Do I need a map, deque, heap, or prefix state?
9. What is the amortized cost?
10. What breaks if negative values or out-of-order events exist?
```

## 35. Revision Checklist

- [ ] I can implement fixed-size windows.
- [ ] I can prove linear pointer movement.
- [ ] I understand variable-window monotonicity.
- [ ] I can maintain frequency maps correctly.
- [ ] I can solve at-most/exactly-K distinct problems.
- [ ] I understand minimum-window deficits.
- [ ] I can use a monotonic deque for window extrema.
- [ ] I know when negative values invalidate sum-window reasoning.
- [ ] I understand streaming/time-based windows.
- [ ] I can explain backend and AI applications.

## 36. Key Takeaways

1. **Sliding windows exploit overlap between contiguous ranges and maintain state incrementally.**
2. **The classic variable-window method depends on a monotone feasibility relationship.**
3. **Frequency maps, monotonic deques, heaps, and prefix state are interchangeable only when their maintained operations and guarantees match the problem.**
4. **Two forward-moving pointers often yield linear total work through amortized reasoning.**
5. **Streaming windows require explicit expiration, ordering, memory, and time semantics.**
