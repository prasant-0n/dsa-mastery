# 10.07 — Monotonic Stack & Monotonic Queue Patterns

## 1. Objective

Monotonic stacks and queues maintain candidates in sorted order so dominated states can be discarded permanently.

Core transformation:

```text
repeated nearest/boundary scanning
→ maintain ordered candidates
→ remove dominated candidates
→ process each element a bounded number of times
```

## 2. Why It Exists

Brute-force nearest-greater/smaller problems repeatedly scan left or right.
A monotonic structure remembers only candidates that can still matter.

## 3. Monotonic Stack

A stack is monotonic when its stored values or keys remain nondecreasing or nonincreasing according to the problem.

Typical variants:

- increasing stack;
- decreasing stack;
- index stack;
- value stack.

## 4. Next Greater Element

For each value, find the first later value that is greater.

A decreasing candidate stack can resolve elements when a larger value arrives.

The stack contains unresolved candidates whose answer has not yet been found.

## 5. Next Smaller Element

Reverse the comparison logic to resolve the first later smaller value.

The invariant changes with the ordering direction, so define it explicitly.

## 6. Previous Greater / Smaller

Traverse from the opposite direction or adapt the stack semantics to represent unresolved candidates on the left.

The key concept remains nearest qualifying boundary discovery.

## 7. Why Each Element Is Linear

An element can generally be:

```text
pushed once
popped once
```

Therefore total stack operations are `O(N)` even though a pop loop appears nested.

This is amortized reasoning.

## 8. Index vs Value Storage

Store indices when the answer requires:

- distance;
- boundaries;
- window expiration;
- reconstruction.

Store values only when identity/location is unnecessary.

## 9. Equal Values

Decide whether the stack should use:

```text
<
<=
>
>=
```

The equality rule determines duplicate handling and can change correctness.

## 10. Daily Temperatures Pattern

Store unresolved indices in a decreasing-temperature stack.
When a warmer temperature arrives, pop and resolve all earlier entries that it satisfies.

## 11. Stock Span Pattern

Maintain previous prices that remain relevant to the current price.
Dominated prices can be removed while preserving the span invariant.

## 12. Largest Rectangle in Histogram

Maintain an increasing stack of bar indices.
When a lower bar appears, previously stored bars receive their right boundary.

The width is determined by the nearest smaller boundaries.

## 13. Sentinel Technique

Appending a conceptual sentinel can force unresolved stack entries to be processed at the end.

Sentinels simplify control flow but require careful boundary handling.

## 14. Circular Arrays

To find next greater elements in a circular array, conceptually process the sequence twice or use modular indexing.

The stack should still represent unresolved candidates under the same invariant.

## 15. Monotonic Queue

A deque can maintain candidates in monotonic order while elements enter and leave a sliding window.

Typical use:

```text
sliding window maximum/minimum
```

## 16. Sliding Window Maximum

Maintain a decreasing deque of indices.

Remove:

1. expired indices from the front;
2. dominated indices from the back.

The front is the current maximum candidate.

## 17. Sliding Window Minimum

Reverse the monotonic ordering for minimum queries.

## 18. Dominance

An item can be removed when another item is at least as useful for every future state under the problem's ordering.

This is the central reasoning behind monotonic structures.

## 19. Dominance Proof

Before popping an element, prove:

> The new candidate makes the old candidate irrelevant for every future query in which the old candidate could have been used.

Without this proof, the pop rule is only a guess.

## 20. Monotonic Stack + Prefix State

Some boundary problems combine a stack with prefix sums or other cumulative state.

Example categories include subarray contribution and range-boundary computations.

## 21. Monotonic Stack + Sorting

Sorting can establish an ordering before stack processing, but it may destroy original-position semantics.

Always preserve the information required by the output.

## 22. Contribution Technique

Instead of calculating every subarray, determine how many ranges consider each element the minimum or maximum.

Nearest smaller/greater boundaries from monotonic stacks provide the required left/right extent.

## 23. Equal-Value Tie Breaking

For contribution problems, one side often uses strict comparison and the other non-strict comparison to assign equal values to exactly one representative.

The tie-breaking policy must be derived, not copied blindly.

## 24. Queue Expiration

In time-based or index-based windows, a deque may remove expired candidates from the front.

The expiration rule is part of the invariant.

## 25. Streaming Semantics

For streams, define whether the structure processes:

- event time;
- processing time;
- bounded windows;
- late events.

A textbook deque assumes a simple ordered arrival model.

## 26. Backend Applications

Monotonic structures appear in:

- rolling maximum/minimum metrics;
- latency windows;
- alert thresholds;
- stock/order analytics;
- time-series processing;
- efficient range monitoring.

## 27. AI Applications

Applications include:

- maintaining best candidates over a moving context;
- sequence extrema;
- temporal feature extraction;
- streaming score windows;
- pruning dominated candidates.

## 28. Correctness Invariants

### Next Greater

> The stack contains exactly unresolved indices whose next qualifying greater value has not yet appeared.

### Histogram

> The stack maintains indices with increasing heights whose left smaller boundary is already known.

### Monotonic Queue

> The deque contains only non-dominated candidates for the current window, in monotonic value order.

## 29. Complexity

Typical monotonic stack/queue algorithms:

```text
Time: O(N) amortized
Space: O(N)
```

Explain why every element is inserted and removed only a bounded number of times.

## 30. Common Mistakes

1. Choosing the wrong monotonic direction.
2. Using `<` instead of `<=` or vice versa.
3. Storing values when indices are required.
4. Forgetting expired window entries.
5. Mishandling circular indexing.
6. Failing to flush unresolved stack entries.
7. Applying a dominance rule without proof.
8. Ignoring equal-value tie breaking.

## 31. Edge Cases

Test:

- empty input;
- one element;
- strictly increasing;
- strictly decreasing;
- all equal;
- duplicate plateaus;
- circular arrays;
- window size one;
- window size equal to input;
- unresolved final elements.

## 32. Interview Framework

When repeated nearest-boundary scanning appears:

```text
1. What candidate is unresolved?
2. What event resolves it?
3. When does a candidate become permanently dominated?
4. What ordering should the stack/deque maintain?
5. Do I need indices?
6. What equality rule is correct?
7. Why is every pop safe?
8. Why is total work linear amortized?
```

## 33. Revision Checklist

- [ ] I can derive next greater/smaller patterns.
- [ ] I understand unresolved candidates.
- [ ] I can choose increasing vs decreasing order.
- [ ] I understand strict vs non-strict comparisons.
- [ ] I can solve histogram-style boundary problems.
- [ ] I understand monotonic queues.
- [ ] I can maintain sliding-window extrema.
- [ ] I can prove dominance.
- [ ] I can derive amortized `O(N)` complexity.
- [ ] I can apply the pattern to backend/AI streams.

## 34. Key Takeaways

1. **Monotonic structures work by permanently discarding candidates that cannot become useful again.**
2. **The stack represents unresolved candidates; the queue represents non-dominated candidates in an active window.**
3. **Equality handling is part of the algorithm's contract, especially with duplicates and contribution problems.**
4. **The linear runtime comes from bounded total pushes and pops, not from the absence of nested loops.**
5. **Every deletion needs a dominance argument explaining why the discarded candidate can never improve a future answer.**
