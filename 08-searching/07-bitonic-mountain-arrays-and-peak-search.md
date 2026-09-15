# 08.07 — Bitonic / Mountain Arrays & Peak Search

## 1. Concept Definition

A mountain (bitonic) array increases up to a peak and then decreases.

```text
        peak
         /\
        /  \
       /    \
______/      \____
```

A canonical mountain array has:

```text
strictly increasing prefix
→ peak
→ strictly decreasing suffix
```

Peak search exploits this local ordering to eliminate half of the search space.

## 2. Why It Matters

Peak search extends the central binary-search idea:

> Determine which side contains the required answer from the local relationship around the midpoint.

Unlike ordinary binary search, there may be no target value. The algorithm can search for a structural property instead.

## 3. Mental Model

At index `mid`, compare:

```text
A[mid] and A[mid + 1]
```

If:

```text
A[mid] < A[mid + 1]
```

we are on the ascending slope, so a peak exists to the right.

If:

```text
A[mid] > A[mid + 1]
```

we are on the descending slope or at the peak, so a peak exists at or to the left.

## 4. Peak Definition

For a strict mountain array, the peak is the unique index `p` satisfying:

```text
A[p - 1] < A[p] > A[p + 1]
```

Boundary handling depends on the exact problem contract.

Do not use a peak definition without specifying whether boundary elements can qualify.

## 5. Core Invariant

A useful invariant is:

> At least one valid peak remains inside the current search interval.

When the slope rises toward the right, discard the left portion that cannot contain the chosen peak under the problem model.

When the slope falls, retain the left side including `mid`.

## 6. Why `mid + 1` Is Safe

Suppose:

```text
A[mid] < A[mid + 1]
```

The sequence is increasing at that boundary.

Therefore `mid` cannot be a strict peak.

For a finite sequence, continuing right must eventually encounter a position where the slope stops increasing or the boundary is reached, giving a peak under the standard peak-array assumptions.

## 7. Why `mid` Is Retained on a Descending Slope

If:

```text
A[mid] > A[mid + 1]
```

then `mid` may itself be the peak.

Therefore the new interval should retain `mid` rather than discarding it:

```text
right = mid
```

This is a classic example of an update derived directly from the invariant.

## 8. Complexity

Each iteration discards roughly half the remaining candidates:

```text
Time → O(log n)
Auxiliary space → O(1)
```

for iterative peak search.

A recursive version uses `O(log n)` call-stack space.

## 9. Mountain Validation

Finding a peak is not the same as proving the entire input is a valid mountain array.

Validation generally requires checking:

1. at least one increasing step;
2. exactly one peak under strict semantics;
3. at least one decreasing step;
4. no violations of the two-phase ordering.

A full validation scan is typically:

```text
O(n)
```

## 10. Peak Search Without Validation

Many interview problems guarantee the mountain property.

If the contract guarantees valid input, an `O(log n)` peak search is sufficient.

Do not add an `O(n)` validation pass automatically if the input contract already provides the invariant.

## 11. Peak in an Arbitrary Array

A local peak can be defined as:

```text
A[i] >= A[i - 1]
AND
A[i] >= A[i + 1]
```

with boundary conventions.

An arbitrary array can contain many peaks, so the goal must be:

```text
find any peak
```

or:

```text
find a particular peak
```

These are different problems.

## 12. Strict vs Non-Strict Peaks

Strict peak:

```text
left < peak > right
```

Non-strict peak:

```text
left <= peak >= right
```

Duplicates make these semantics important.

## 13. Duplicates

Consider:

```text
[1, 3, 3, 2]
```

The peak may be a plateau rather than a unique index.

If the task requires any non-strict peak, a modified search may still work.

If it requires a specific plateau boundary, additional boundary-search reasoning is needed.

## 14. Bitonic Search

A classic bitonic-search problem asks for a target in a mountain array.

A clean decomposition is:

```text
1. Find peak in O(log n).
2. Binary-search ascending segment.
3. Binary-search descending segment.
```

Total:

```text
O(log n)
```

because the three logarithmic phases are additive.

## 15. Search Ascending Segment

The left segment follows ordinary ascending binary search:

```text
A[mid] < target → right
A[mid] > target → left
```

The peak itself belongs to the boundary and must be handled according to the selected intervals.

## 16. Search Descending Segment

The right segment uses reversed comparison directions:

```text
A[mid] < target → left
A[mid] > target → right
```

The ordering relation, not the array index direction alone, determines the update.

## 17. One-Pass Bitonic Search

A more advanced implementation can combine peak detection and target elimination into one procedure.

However, the proof becomes more complicated.

For maintainability, decomposing the problem into verified primitives is often easier unless a single-pass constraint matters.

## 18. Peak as a Search-Space Predicate

Define the slope predicate:

```text
P(i) = A[i] < A[i + 1]
```

For a strict mountain array, the predicate has the form:

```text
true true true false false
```

The peak is near the transition from increasing to decreasing.

This connects peak finding directly to boundary search.

## 19. Boundary Interpretation

For a strict mountain array:

```text
increasing region | decreasing region
                  ↑
                 peak
```

The peak can therefore be understood as the last position where the increasing condition holds, with appropriate index handling.

## 20. Mathematical View

Let the peak index be `p`.

Then:

```text
A[0] < A[1] < ... < A[p]
A[p] > A[p+1] > ... > A[n-1]
```

The sequence has two monotone regions separated by one turning point.

## 21. Correctness Proof

### Initialization
The interval contains at least one valid peak under the input assumptions.

### Maintenance
If `A[mid] < A[mid+1]`, a peak exists to the right. Otherwise, a peak exists at or to the left.

### Progress
The interval strictly shrinks because one side of `mid` is discarded.

### Termination
When `left === right`, the remaining position is a peak.

### Postcondition
The returned index satisfies the required peak condition.

## 22. Why This Is Not Ordinary Exact Search

There is no target equality test driving the algorithm.

Instead, the algorithm uses a local structural comparison:

```text
slope rising?
```

The answer is derived from the geometry of the search space.

This is an important step toward advanced binary-search problem solving.

## 23. Boundary Cases

For a valid strict mountain array:

```text
n >= 3
```

is common in problem contracts.

But generalized peak APIs may allow:

```text
n = 1
n = 2
```

Therefore the function contract must define these cases.

## 24. Multiple Peaks

Arbitrary arrays may contain:

```text
low peak → high peak → low peak → high peak
```

A binary-search peak algorithm can return **a** peak under appropriate assumptions, not necessarily the global maximum.

If the problem asks for the maximum, the input structure or algorithm must support that stronger requirement.

## 25. Global Maximum vs Local Peak

A local peak satisfies neighboring conditions.

A global maximum satisfies:

```text
A[i] >= A[j] for every j
```

These are not equivalent for arbitrary arrays.

A mountain array's unique peak is both local and global under strict mountain semantics.

## 26. Search for Target in Mountain Array

The decomposition is:

```text
peak = findPeak(A)
left = binarySearchAscending(A[0..peak], target)
right = binarySearchDescending(A[peak+1..n-1], target)
```

If the target can occur in both sides due to duplicate semantics, the required occurrence rule must be specified.

## 27. Complexity with Slices

In JavaScript, avoid creating physical subarrays merely to call binary search if the goal is `O(1)` auxiliary space.

Prefer index ranges:

```text
binarySearch(A, target, left, right)
```

Creating slices can introduce:

```text
O(k)
```

copying and memory costs.

## 28. Backend Applications

Peak-search reasoning can model:

- traffic curves;
- load profiles;
- latency distributions represented as ordered samples;
- resource utilization peaks;
- time-series turning points.

Real time-series data may not satisfy strict mountain assumptions, so validation or signal-processing methods may be required.

## 29. AI Applications

Related concepts appear in:

- score curves;
- confidence profiles;
- ranking landscapes;
- hyperparameter sweeps;
- monotonic performance curves;
- identifying turning points in sampled metrics.

Do not assume a real-world metric is unimodal merely because a binary-search pattern would be convenient.

## 30. Testing Strategy

For strict mountain arrays:

1. Generate a valid increasing prefix.
2. Select a peak.
3. Generate a decreasing suffix.
4. Test every valid peak position.
5. Test targets at peak, slopes, and outside range.

For arbitrary arrays, use a linear reference to validate any-peak behavior.

## 31. Differential Testing

For peak search:

```text
optimizedPeak(A)
vs
linearPeakReference(A)
```

The reference only needs to satisfy the same documented peak contract.

Do not require identical indices when multiple valid peaks exist.

## 32. Common Mistakes

1. Treating peak search as exact target search.
2. Discarding `mid` when it may be the peak.
3. Assuming every array is a valid mountain.
4. Confusing local peak with global maximum.
5. Mishandling duplicates.
6. Searching the descending side with ascending comparisons.
7. Creating slices and accidentally increasing memory/copying cost.
8. Forgetting boundary conventions.
9. Claiming unique peak when the input permits plateaus.
10. Returning a peak without proving it satisfies the contract.

## 33. Edge Cases

Test:

- smallest valid mountain;
- peak at index `1`;
- peak at `n - 2`;
- strictly increasing input;
- strictly decreasing input;
- single-element input if allowed;
- two-element input if allowed;
- duplicate plateau;
- target equals peak;
- target on either slope;
- target absent.

## 34. Implementation Lab

Implement:

1. strict mountain validation;
2. peak search;
3. arbitrary-array any-peak search;
4. ascending binary search on a mountain segment;
5. descending binary search;
6. bitonic target search;
7. index-range implementations without slicing;
8. duplicate-aware peak behavior under a defined contract.

## 35. Interview Questions

1. How do you find a peak in `O(log n)`?
2. Why does comparing `A[mid]` and `A[mid+1]` work?
3. Why is `mid` retained on a descending slope?
4. What is the difference between a local peak and global maximum?
5. How do you search for a target in a mountain array?
6. Why is descending binary search different?
7. How do duplicates affect peak uniqueness?
8. Can arbitrary arrays be searched for any peak in logarithmic time?
9. What invariant does peak search maintain?
10. Why should you avoid array slicing when constant auxiliary space matters?

## 36. Revision Checklist

- [ ] I can define a mountain array precisely.
- [ ] I can define a local peak.
- [ ] I can derive the slope-based binary-search rule.
- [ ] I can prove the peak invariant.
- [ ] I can find a peak in `O(log n)` under the required assumptions.
- [ ] I can find the peak of a strict mountain array.
- [ ] I can search both ascending and descending segments.
- [ ] I understand bitonic target search.
- [ ] I distinguish local peak from global maximum.
- [ ] I understand duplicate/plateau effects.
- [ ] I can preserve `O(1)` auxiliary space using index ranges.
- [ ] I can validate against a reference implementation.

## 37. Key Takeaways

1. **Peak search is binary search over structural information rather than target equality.**
2. **A rising slope implies a peak exists to the right under the standard finite-array model.**
3. **A falling slope allows the midpoint to remain a peak candidate.**
4. **The peak invariant is candidate preservation, just as in other binary-search variants.**
5. **A mountain array can be searched by finding its peak and then searching two differently ordered regions.**
6. **Descending binary search reverses the comparison directions.**
7. **Local peak, global maximum, and unique mountain peak are distinct concepts.**
8. **Duplicates require explicit peak semantics and can destroy uniqueness.**
9. **Index-range APIs avoid unnecessary slicing and preserve auxiliary-space guarantees.**
10. **The transferable skill is recognizing a monotonic local signal that permits safe search-space elimination.**
