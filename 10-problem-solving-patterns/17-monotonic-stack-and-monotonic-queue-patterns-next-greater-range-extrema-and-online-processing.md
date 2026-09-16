# 10.17 — Monotonic Stack & Monotonic Queue Patterns: Next Greater, Range Extrema & Online Processing

## 1. Objective

Monotonic stacks and queues maintain elements in monotone order so obsolete candidates can be discarded permanently.

```text
new element arrives
→ remove candidates that can never win
→ preserve invariant
→ answer current/future query
```

The key skill is proving why a discarded candidate can never become relevant again.

## 2. Why It Exists

Repeatedly scanning left/right neighbors or every window can be quadratic. A monotonic structure exploits dominance to process each element a bounded number of times.

## 3. Monotonic Stack Model

A monotonic stack maintains values or indices in nondecreasing or nonincreasing order.

The stack usually stores **indices**, because index distance and expiration boundaries are often part of the answer.

## 4. Increasing vs Decreasing

An increasing stack keeps candidate values increasing from bottom to top.

A decreasing stack keeps candidate values decreasing.

Choose the direction from the relationship the problem asks for.

## 5. Next Greater Element

Scan from left to right. While the incoming value is greater than the top candidate, resolve that candidate.

The unresolved stack contains exactly those positions whose required greater element has not yet appeared.

## 6. Next Smaller Element

Reverse the comparison rule.

The same structural pattern solves next-smaller queries.

## 7. Previous Greater / Smaller

Scanning direction and comparison determine whether the desired witness is previous or next.

Write the invariant before choosing the loop direction.

## 8. Equality Semantics

`>` and `>=` are not interchangeable.

Duplicate values can change whether equal elements remain separate candidates, especially in nearest-boundary problems.

## 9. Index vs Value Storage

Store indices when you need:

- distance;
- boundaries;
- original positions;
- expiration.

Store values only when position is irrelevant.

## 10. Amortized Complexity

An element can be pushed once and popped once.

Therefore a monotonic-stack scan is typically:

```text
Time: O(N)
Auxiliary space: O(N)
```

The inner `while` does not automatically imply quadratic complexity.

## 11. Daily Temperatures Pattern

For each unresolved position, the first later value satisfying the comparison resolves its answer.

The stack stores unresolved indices in monotone order.

## 12. Stock Span Pattern

Maintain previous values that remain potential nearest greater boundaries. Remove dominated values before using the surviving top boundary.

## 13. Nearest Greater Distance

Once a previous/next boundary is identified, subtract indices to derive distance.

This is a common transformation from relational search to positional answer.

## 14. Largest Rectangle in Histogram

Maintain increasing bar indices. When a lower bar arrives, repeatedly finalize rectangles whose height can no longer extend rightward.

The width depends on the surviving stack boundary and current index.

## 15. Maximal Rectangle in Matrix

Convert each matrix row into histogram heights, then solve each histogram with the monotonic-stack rectangle algorithm.

This composition turns a 2D problem into repeated 1D structure.

## 16. Contribution Counting

Monotonic boundaries can identify the previous smaller and next smaller elements around each value.

The distance to each boundary can then determine how many subarrays use that value as a minimum or maximum under a specified tie convention.

## 17. Duplicate Tie Handling

For contribution problems, one boundary often uses strict comparison while the other uses non-strict comparison.

This assigns equal-valued subarrays to one canonical representative and prevents double counting.

## 18. Monotonic Queue

A deque can maintain candidates for a moving window while removing:

1. expired indices from the front;
2. dominated indices from the back.

The front is the current extremum candidate.

## 19. Sliding Window Maximum

For each new index:

```text
remove expired front
remove smaller/equal dominated back candidates
push new index
front = maximum candidate
```

The exact equality rule determines duplicate retention behavior.

## 20. Sliding Window Minimum

Reverse the dominance comparison.

The same deque architecture supports both extrema.

## 21. Why Dominated Candidates Can Be Removed

Suppose candidate `A` is older than candidate `B`, and `B` is at least as good as `A` for every future window in which both are valid.

Then `A` can never become the better answer after `B` expires because `A` expires no later. Therefore `A` is dominated and can be discarded.

This dominance argument is the core proof technique.

## 22. Monotonic Queue vs Heap

A monotonic deque can provide `O(N)` processing for fixed-window extrema.

A heap generally provides logarithmic update/removal costs and supports broader order-statistic operations.

Choose based on the required operations, not on the name of the pattern.

## 23. Monotonic Stack + Binary Search

Some problems combine boundary candidates with binary search, but only when the remaining predicate is ordered.

Do not add binary search merely because a stack is already present.

## 24. Monotonic Structures + Prefix State

Prefix transformations can identify cumulative properties while monotonic structures maintain nearest valid boundaries.

The two techniques solve different dimensions of the problem and can compose.

## 25. Streaming Interpretation

A monotonic deque can process an incoming stream with bounded state for fixed-size windows.

For time-based streams, expiration depends on timestamps rather than simply `index - K`.

## 26. Online Algorithms

A monotonic structure is naturally online when each new item can be processed without needing future input.

This is useful for streaming metrics and real-time decision logic.

## 27. Backend Applications

Examples include:

- rolling latency maxima/minima;
- recent metric extrema;
- threshold monitoring;
- online anomaly features;
- request-window analysis;
- resource utilization tracking.

## 28. AI Applications

Applications include:

- sequence feature extraction;
- rolling token/statistical extrema;
- temporal anomaly detection;
- candidate dominance filtering;
- streaming inference features.

## 29. Correctness Proof

A monotonic-stack proof should establish:

1. every stored candidate remains unresolved and potentially useful;
2. every popped candidate is permanently dominated or has found its first valid witness;
3. the remaining stack preserves the monotonic invariant;
4. each produced answer satisfies the required boundary relation.

For queues, additionally prove that expired candidates cannot be returned.

## 30. Complexity

Typical bounds:

```text
monotonic stack scan: O(N)
monotonic deque window: O(N)
space: O(N)
```

Explain amortized pushes/pops and account for output storage separately.

## 31. Common Mistakes

1. Choosing the wrong monotonic direction.
2. Storing values when indices are required.
3. Incorrect `>` vs `>=` handling.
4. Forgetting expired queue entries.
5. Miscomputing histogram width.
6. Double-counting duplicate extrema.
7. Assuming a monotonic structure supports arbitrary order statistics.
8. Claiming worst-case `O(1)` per operation without amortized context.

## 32. Edge Cases

Test:

- empty input;
- singleton;
- strictly increasing;
- strictly decreasing;
- all equal;
- alternating high/low;
- duplicate extrema;
- window size one;
- window size equal to input;
- no greater/smaller witness;
- zero/negative values.

## 33. Testing Strategy

Use:

- brute-force nearest-boundary references;
- brute-force window extrema;
- randomized arrays;
- duplicate-heavy inputs;
- invariant assertions after every operation;
- push/pop accounting;
- differential stack/deque vs naive tests.

## 34. Interview Framework

When a problem repeatedly asks for nearest greater/smaller or window extrema:

```text
1. What candidate is being searched for?
2. Can a candidate be permanently dominated?
3. Which monotone direction preserves useful candidates?
4. Should I store indices?
5. What does equality mean?
6. When is a candidate resolved?
7. When does it expire?
8. Can every candidate be pushed/popped once?
9. What invariant proves correctness?
10. What are the amortized time and space costs?
```

## 35. Revision Checklist

- [ ] I can derive next greater/smaller algorithms.
- [ ] I can distinguish increasing and decreasing stacks.
- [ ] I understand index-based storage.
- [ ] I can explain amortized O(N).
- [ ] I can solve histogram rectangles.
- [ ] I understand duplicate tie conventions.
- [ ] I can build a monotonic deque.
- [ ] I can solve sliding-window extrema.
- [ ] I can explain dominance-based pruning.
- [ ] I can apply the pattern to backend/AI streams.

## 36. Key Takeaways

1. **Monotonic structures work by permanently discarding dominated candidates.**
2. **The invariant and dominance proof are more important than memorizing a template.**
3. **Indices usually matter because distance, boundaries, and expiration are part of the problem state.**
4. **Each element is typically pushed and popped at most once, giving linear amortized processing.**
5. **Equality handling is a correctness decision, especially for duplicate values and contribution counting.**
