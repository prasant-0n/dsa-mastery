# 03.8 — Subarrays & Subsequence Reasoning

## Definition

A **subarray** is a contiguous portion of an array. A **subsequence** preserves relative order but does not require contiguity.

```text
arr = [1, 2, 3, 4]

Subarray:    [2, 3]
Subsequence: [1, 3, 4]
```

This distinction is fundamental. Many wrong solutions come from treating a subsequence like a subarray, or vice versa.

---

## 1. Subarray Structure

For an array of length `N`, every subarray is identified by two boundaries:

```text
left <= right
```

There are:

```text
N(N + 1) / 2
```

non-empty subarrays, so there are `Θ(N²)` possible subarrays.

This immediately tells us that an algorithm explicitly enumerating every subarray cannot be asymptotically better than `Ω(N²)` if it must inspect or output all of them.

But many problems ask for a **summary** of all subarrays. Those can often be solved in `O(N)` or `O(N log N)` using prefix sums, hashing, sliding windows, or other representations.

---

# 2. Subarray vs Subsequence

| Property | Subarray | Subsequence |
|---|---|---|
| Contiguous | Yes | No |
| Relative order | Preserved | Preserved |
| Number of candidates | `Θ(N²)` | `Θ(2^N)` generally |
| Typical tools | prefix sum, window, two pointers | DP, recursion, greedy, state search |
| Example | `[2,3]` | `[1,3]` |

For a sequence of `N` elements:

- subarrays are quadratic in count;
- subsequences are exponential in count.

That difference drives algorithm selection.

---

# 3. Enumerating All Subarrays

The direct structure is:

```js
for (let left = 0; left < n; left++) {
  for (let right = left; right < n; right++) {
    // arr[left..right]
  }
}
```

There are `Θ(N²)` boundary pairs.

If the body is `O(1)`, total time is `Θ(N²)`.

If each subarray is copied or rescanned, the complexity can become `Θ(N³)`.

This is a critical complexity distinction.

---

# 4. Brute-Force Subarray Sum

A naive solution computes every subarray sum from scratch.

For each `(left, right)`, sum all elements from `left` through `right`.

Complexity:

```text
Θ(N³)
```

because there are `Θ(N²)` subarrays and a sum may require `Θ(N)` work.

This is a classic example of repeated work.

---

# 5. Incremental Subarray Sum

Fix `left` and extend `right` while maintaining a running sum:

```text
left fixed
right →

sum += arr[right]
```

Now each extension costs `O(1)`.

Total:

```text
Θ(N²)
```

This is better than recomputing each sum from scratch.

---

# 6. Prefix Sum Optimization

If a static array requires many range-sum computations, prefix sums can reduce each range sum to `O(1)` after `O(N)` preprocessing.

For inclusive `[l, r]`:

```text
sum(l,r) = prefix[r + 1] - prefix[l]
```

This gives a useful hierarchy:

```text
naive repeated sum       O(N³)
incremental enumeration  O(N²)
prefix-based query       O(N) preprocessing + O(1) per query
```

The right solution depends on whether the task asks to enumerate subarrays or summarize them.

---

# 7. Maximum Subarray Sum

A famous optimization is Kadane's algorithm.

At index `i`, define:

```text
bestEndingHere = maximum sum of a subarray ending at i
```

Transition:

```text
bestEndingHere = max(arr[i], bestEndingHere + arr[i])
```

Global answer:

```text
best = max(best, bestEndingHere)
```

Complexity:

- Time: `O(N)`
- Auxiliary space: `O(1)`

The important idea is state compression: we do not need every subarray sum, only the best state that can extend into the future.

---

# 8. Kadane's Invariant

A useful invariant is:

> After processing index `i`, `bestEndingHere` is the maximum sum among all non-empty subarrays whose right endpoint is exactly `i`.

Why only two choices?

A best subarray ending at `i` either:

1. starts at `i`; or
2. extends the best subarray ending at `i-1`.

Therefore the recurrence is complete.

This is a fundamental example of deriving an algorithm from state meaning rather than memorizing code.

---

# 9. Empty Subarray Semantics

Maximum-subarray problems differ depending on whether an empty subarray is allowed.

For:

```text
[-5, -2, -8]
```

if non-empty is required, the answer is `-2`.

If empty is allowed with sum `0`, the answer may be `0`.

Never assume the convention. It is part of the contract.

---

# 10. Maximum Subarray with Indices

Kadane's state can be extended to track:

- current start;
- best start;
- best end;
- best sum.

This demonstrates a general rule:

> If the answer requires reconstruction, store enough state to reconstruct it without destroying the complexity guarantee.

---

# 11. Fixed-Length Subarrays

For every subarray of length `K`, a sliding window gives linear time.

```text
[ a b c d e f ]
  ← K →
```

Compute the first window, then:

```text
windowSum += entering
windowSum -= leaving
```

Complexity:

- Time: `O(N)`
- Auxiliary space: `O(1)`

This is a special case of eliminating repeated overlap between adjacent subarrays.

---

# 12. Variable-Length Subarrays

When the condition is monotonic, a moving window can maintain a valid interval.

Typical positive-number example:

> Find the minimum-length subarray whose sum is at least `target`.

Expand `right` until valid, then move `left` while validity remains.

The key requirement is not “subarray” itself. It is **monotonicity of the validity condition**.

---

# 13. When Sliding Window Fails

A common mistake is applying a positive-number sliding-window technique to arbitrary integers.

For example, with negative values, increasing the window does not necessarily increase its sum.

Therefore the monotonicity required by the usual shrinking/expanding proof can disappear.

Alternatives may include:

- prefix sums;
- hash maps;
- monotonic structures;
- binary search over prefix sums when applicable;
- more advanced algorithms.

Always prove the movement rule.

---

# 14. Subarray Sum Equals K

For arbitrary integers, a prefix-sum frequency map provides an `O(N)` expected-time solution.

Let:

```text
prefix = sum of arr[0..i]
```

A subarray ending at `i` has sum `K` when an earlier prefix equals:

```text
prefix - K
```

Maintain frequencies of previous prefix sums.

### Core invariant

> Before processing the current element, the map contains the frequencies of all prefix sums ending before the current position.

Then:

```text
answer += frequency(prefix - K)
```

This is one of the most important examples of combining prefix state with hashing.

---

# 15. Why Prefix + Hashing Works

Suppose:

```text
prefix[j] - prefix[i] = K
```

Then:

```text
prefix[i] = prefix[j] - K
```

Therefore, instead of searching all previous boundaries, store their prefix sums in a hash map.

This changes a potentially quadratic boundary-pair search into expected linear time.

---

# 16. Longest Subarray with a Property

Many longest-subarray problems can be reframed as:

> Find two boundaries satisfying a relationship between prefix states.

Examples include:

- longest zero-sum subarray;
- longest subarray with equal numbers of two values;
- longest subarray satisfying a transformed balance condition.

A common strategy is:

1. transform the input into a prefix-state sequence;
2. identify when two prefix states imply a valid interval;
3. store the earliest useful boundary for each state.

The earliest occurrence often maximizes future interval length.

---

# 17. Equal 0s and 1s

Transform:

```text
0 → -1
1 → +1
```

Then an interval has equal numbers of zeroes and ones exactly when its transformed sum is zero.

The problem becomes a longest zero-sum subarray problem.

This is an important algorithmic technique:

> Transform a problem until an existing invariant or data structure applies.

---

# 18. Product / Multiplicative Subarrays

Multiplicative problems require different reasoning because multiplication does not share all the useful properties of addition.

Zeroes and negative values can radically change behavior.

Do not blindly replace addition with multiplication in prefix-sum reasoning.

The right state may involve:

- sign;
- product magnitude;
- zero boundaries;
- logarithms for specialized numerical contexts.

The exact contract determines the representation.

---

# 19. Subsequence Fundamentals

A subsequence can be generated by deciding whether each element is:

```text
include
or
exclude
```

This creates a binary decision tree with approximately:

```text
2^N
```

subsequences.

That does not mean every subsequence problem requires exponential time. Often the algorithm summarizes many subsequences through dynamic programming or greedy state.

---

# 20. Subsequence vs Subarray Search

### Contiguous requirement

Think:

- window;
- prefix sums;
- two pointers;
- monotonic queue;
- boundary pairs.

### Non-contiguous requirement

Think:

- DP;
- greedy;
- recursion/backtracking;
- state transitions;
- subsequence matching.

The wording of the problem often reveals the computational model.

---

# 21. Subsequence Matching

Given a short sequence `pattern` and a longer sequence `text`, determine whether the pattern is a subsequence of the text.

Use two pointers:

```text
p → pattern
 t → text
```

When values match, advance both. Otherwise advance only `t`.

Time:

```text
O(|text|)
```

Auxiliary space: `O(1)`.

The pattern pointer never moves backward.

---

# 22. Longest Increasing Subsequence Preview

The Longest Increasing Subsequence (LIS) is a subsequence problem, not a subarray problem.

A basic DP solution is:

```text
O(N²)
```

An optimized approach uses a tails representation and binary search for:

```text
O(N log N)
```

The key conceptual lesson is that the optimized algorithm does not explicitly store every candidate subsequence. It maintains a compressed representation sufficient to preserve the best future possibilities.

Detailed LIS techniques belong to later dynamic-programming and binary-search material.

---

# 23. Counting Subarrays vs Counting Subsequence Candidates

For `N = 30`:

```text
subarrays ≈ 465
subsequences = 2^30 ≈ 1 billion
```

For `N = 100`:

```text
subarrays = 5050
subsequences = 2^100
```

This difference should influence your first feasibility estimate.

If a problem asks for an optimal subsequence, look for compressed state rather than enumerating all subsequences.

---

# 24. Output-Sensitive Reasoning

If the problem literally asks you to output every subarray, there are `Θ(N²)` outputs, so `Ω(N²)` time is unavoidable.

If it asks for only:

- maximum sum;
- number of valid subarrays;
- existence;
- minimum length;
- longest length;

then the output size is small and an algorithm may be much faster than enumerating all candidates.

Always distinguish **candidate-space size** from **required output size**.

---

# 25. Choosing the Right Tool

| Problem shape | Strong first candidate |
|---|---|
| Enumerate all subarrays | nested boundaries `O(N²)` |
| Static range sums | prefix sums |
| Fixed-length window | sliding window |
| Positive values + monotonic threshold | sliding window / two pointers |
| Arbitrary integers + exact sum | prefix sum + hash map |
| Maximum subarray sum | Kadane |
| Longest zero-sum interval | prefix sum + earliest index |
| Equal 0s and 1s | transformation + prefix state |
| Subsequence existence | two pointers |
| Optimal subsequence | DP / greedy / binary-search-based method depending on property |
| Enumerate subsequences | recursion/backtracking, `O(2^N)` output |

This table is a starting point, not a substitute for proving the algorithm.

---

# Backend Applications

Subarray-style reasoning appears in:

### Time-Series Windows

Analyze contiguous event intervals:

- requests in a time range;
- errors in consecutive events;
- throughput windows;
- rolling metrics.

### Log Analysis

Find the highest-error contiguous period or longest valid sequence segment.

### Batch Processing

Compute fixed-size batches with incremental state instead of rescanning each batch.

### Event Streams

Prefix-state and hashing techniques can detect cumulative conditions efficiently.

Production considerations include event ordering, late events, memory limits, and whether the stream is finite or unbounded.

---

# AI Applications

### Token Sequence Segments

Contiguous token spans are subarray-like structures.

### Document Chunking

Fixed and variable windows over token sequences use sliding-window reasoning.

### Retrieval Candidate Sequences

Subsequence reasoning can model ordered matching between query tokens and document tokens.

### Time-Series / Embedding Streams

Contiguous windows can be summarized incrementally rather than recomputed from scratch.

### Dataset Statistics

Prefix-state transformations can turn interval conditions into efficient aggregate queries.

The broader AI lesson is the same:

> exploit structure in the sequence instead of enumerating every possible candidate.

---

# Common Mistakes

1. Confusing subarray with subsequence.
2. Assuming every subarray problem needs `O(N²)` enumeration.
3. Recomputing every subarray sum from scratch.
4. Applying sliding window when negative values destroy monotonicity.
5. Forgetting whether empty subarrays are allowed.
6. Forgetting that all-subarray output itself is quadratic.
7. Treating all subsequence problems as exponential.
8. Losing the original order when solving a subsequence problem.
9. Using a frequency map without identifying the required prefix state.
10. Storing the wrong earliest/latest prefix occurrence.
11. Ignoring integer overflow/precision in cumulative sums.
12. Claiming `O(N)` without accounting for hashing's expected-complexity assumption.

---

# Interview Framework

For a subarray/subsequence problem:

1. Determine **contiguous or non-contiguous**.
2. Identify `N` and the candidate-space size.
3. Ask whether all candidates must be output.
4. Look for additive/prefix structure.
5. Check whether a sliding-window monotonicity proof exists.
6. Consider prefix + hashing for boundary relationships.
7. Consider DP/greedy for subsequences.
8. Define empty/non-empty semantics.
9. Define whether indices or values must be returned.
10. Prove the state invariant.
11. Derive time and space complexity.
12. Test negative values, duplicates, zeroes, and boundary cases.

---

# Revision Checklist

- [ ] I can distinguish subarray and subsequence.
- [ ] I know the number of subarrays is `Θ(N²)`.
- [ ] I understand why subsequences are generally `Θ(2^N)`.
- [ ] I can enumerate subarrays in `O(N²)`.
- [ ] I understand incremental subarray sums.
- [ ] I can use prefix sums for range/subarray queries.
- [ ] I understand Kadane's algorithm and its invariant.
- [ ] I understand fixed-length windows.
- [ ] I know when variable windows require monotonicity.
- [ ] I know why negative values can break common sliding-window logic.
- [ ] I understand subarray sum equals `K` using prefix + hashing.
- [ ] I understand longest zero-sum interval reasoning.
- [ ] I can transform equal-0/1 problems.
- [ ] I can test subsequence existence with two pointers.
- [ ] I understand the LIS distinction.
- [ ] I can reason about output-sensitive lower bounds.
- [ ] I can choose an appropriate pattern from the problem contract.
- [ ] I can explain backend and AI applications.

## Key Takeaways

1. **Subarray = contiguous; subsequence = ordered but not necessarily contiguous.**
2. There are `Θ(N²)` subarrays but generally `Θ(2^N)` subsequences.
3. Candidate-space size does not determine the final algorithm if state can summarize many candidates.
4. Prefix sums, hashing, sliding windows, and Kadane's algorithm eliminate repeated subarray work.
5. Sliding windows require a valid monotonicity argument; negative values can invalidate common versions.
6. Prefix-sum + hashing turns boundary relationships into expected `O(N)` algorithms.
7. Subsequence problems often require DP, greedy reasoning, or state compression rather than enumeration.
8. Always derive the solution from the exact contract, invariant, and representation.
