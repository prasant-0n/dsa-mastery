# 09.04 — Bubble Sort

## 1. Definition

Bubble Sort repeatedly compares adjacent elements and swaps them when they are out of order.

For ascending order, a pass moves larger elements toward the right side of the array.

```text
[5, 1, 4, 2]
 ↓
compare adjacent pairs
 ↓
[1, 4, 2, 5]
```

## 2. Why Learn Bubble Sort?

Bubble Sort is rarely the default choice for production-scale sorting, but it is valuable because its mechanics expose:

- adjacent comparisons;
- exchange operations;
- loop invariants;
- sorted suffixes;
- early termination;
- stability;
- best/average/worst-case analysis.

It is a useful laboratory for learning how an implementation follows a correctness invariant.

## 3. Core Mental Model

Think of each pass as pushing an extreme element toward its final position.

For ascending sorting:

```text
unsorted region | sorted suffix
```

After each complete pass, at least one maximum element of the remaining unsorted region is placed into its final position.

## 4. Basic Algorithm

For each pass:

1. scan adjacent pairs;
2. compare them;
3. swap if they are inverted;
4. shrink the unsorted boundary.

Pseudocode:

```text
for end from n-1 down to 1:
    for i from 0 to end-1:
        if A[i] > A[i+1]:
            swap(A[i], A[i+1])
```

## 5. Loop Invariant

Before each outer-loop pass with boundary `end`:

```text
A[end+1 ... n-1]
```

is already sorted and contains the largest elements in their final positions.

After the pass, `A[end]` becomes the maximum element of the remaining region.

## 6. Correctness Reasoning

Assume the unsorted region is `A[0...end]`.

During the inner scan, whenever an adjacent inversion exists, it is exchanged.

Therefore the largest value encountered keeps moving rightward until it reaches `end`.

Thus the invariant is preserved and the sorted suffix grows by one element.

When the boundary reaches the beginning, the entire array is sorted.

## 7. Complexity

For the straightforward implementation:

```text
Best:    O(n²)
Average: O(n²)
Worst:   O(n²)
Space:   O(1) auxiliary
```

The basic version performs the same nested-loop structure even when the array is already sorted.

## 8. Early-Exit Optimization

Track whether any swap occurred during a pass.

If a complete pass makes no swaps, the array is already sorted and the algorithm can terminate.

```text
swapped = false

perform pass

if no swap:
    stop
```

## 9. Optimized Best Case

With early exit and a suitable comparator:

```text
Best: O(n)
```

for already sorted input.

The average and worst-case bounds remain:

```text
O(n²)
```

## 10. Stability

Bubble Sort can be stable when it swaps only when:

```text
compare(A[i], A[i+1]) > 0
```

Equal elements are not exchanged, so their relative order remains unchanged.

Swapping equal elements unnecessarily can destroy stability.

## 11. In-Place Behavior

The standard implementation rearranges elements inside the original array and uses constant auxiliary storage:

```text
O(1)
```

excluding the input itself.

A wrapper that copies the array first is no longer constant-space at the API level.

## 12. Swap Cost

Bubble Sort can perform many writes because every local inversion may cause a swap.

For data with many inversions, movement cost can be substantial even when comparison counts are already understood.

## 13. Relationship to Inversions

An inversion is a pair:

```text
i < j and A[i] > A[j]
```

Bubble Sort repeatedly resolves local inversions.

The total number of inversions is therefore useful for understanding how much disorder the algorithm must process.

## 14. Example

Input:

```text
[5, 1, 4, 2]
```

First pass:

```text
5 1 4 2
↓
1 5 4 2
1 4 5 2
1 4 2 5
```

The largest element, `5`, reaches the final position.

Second pass:

```text
1 4 2 | 5
→ 1 2 4 | 5
```

Then:

```text
1 2 4 5
```

## 15. JavaScript Implementation Pattern

A basic implementation should accept an explicit comparator:

```js
function bubbleSort(values, compare) {
  for (let end = values.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      if (compare(values[i], values[i + 1]) > 0) {
        [values[i], values[i + 1]] = [values[i + 1], values[i]];
      }
    }
  }
  return values;
}
```

For a learning implementation, write this yourself rather than copying it.

## 16. Early-Exit JavaScript Pattern

The optimized version adds:

```js
let swapped = false;
```

Set it to `true` whenever a swap occurs.

At the end of a pass:

```js
if (!swapped) break;
```

## 17. Comparator Discipline

Do not hard-code numeric comparison if the goal is a reusable sorting primitive.

Use:

```js
(a, b) => a - b
```

for ascending numbers, or an explicit object comparator for records.

## 18. Complexity Derivation

The inner loop performs approximately:

```text
(n-1) + (n-2) + ... + 1
```

comparisons.

Therefore:

```text
n(n-1)/2 = Θ(n²)
```

for the standard nested-loop version.

## 19. Best-Case Derivation

Without early exit, an already sorted array still executes the nested loops:

```text
Θ(n²)
```

With early exit, the first pass performs `n-1` comparisons and zero swaps, then terminates:

```text
Θ(n)
```

## 20. Worst Case

Reverse-sorted input maximizes local inversions for distinct values.

The algorithm performs quadratic comparison work and can also perform quadratic numbers of swaps.

## 21. When to Use

Bubble Sort can be useful for:

- teaching;
- tiny controlled datasets;
- demonstrations of adjacent exchange;
- validating sorting concepts;
- educational benchmarking.

## 22. When Not to Use

For general production sorting of nontrivial datasets, standard optimized library sorting or an algorithm selected for the workload is normally more appropriate.

Do not choose Bubble Sort merely because its implementation is simple.

## 23. Backend Applications

Its direct production use is limited, but its concepts map to backend reasoning:

- local adjacent reordering;
- invariant-driven processing;
- small-window ordering;
- educational implementations of ranking and event ordering.

For large API datasets or database records, use appropriate indexed/database sorting or optimized platform primitives.

## 24. AI Applications

Bubble Sort itself is rarely appropriate for large AI workloads, but its adjacent-exchange model is useful for understanding:

- local ordering;
- inversion reduction;
- iterative refinement;
- correctness invariants.

The algorithmic lesson is more valuable than the algorithm as a production primitive.

## 25. Common Mistakes

1. Using `>=` instead of `>` and accidentally breaking stability.
2. Forgetting to shrink the sorted boundary.
3. Incorrect inner-loop limits.
4. Returning before the current pass completes.
5. Claiming `O(n)` best case without an early-exit mechanism.
6. Ignoring mutation semantics.
7. Forgetting permutation preservation.
8. Counting only comparisons while ignoring swaps.
9. Using the wrong comparator.
10. Off-by-one errors at `end = 0` or `end = 1`.

## 26. Edge Cases

Test:

- `[]`;
- `[1]`;
- `[2, 1]`;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- negative numbers;
- object records with equal keys.

## 27. Testing Contract

A correct implementation should satisfy:

```text
sorted(output)
AND
permutation(output, input)
```

If stability is promised:

```text
stable(output, input)
```

Also test that an in-place implementation actually mutates the intended array and that a non-mutating wrapper does not.

## 28. Benchmarking

Measure separately:

- comparisons;
- swaps;
- passes;
- wall-clock time.

Use at least:

```text
sorted
reverse sorted
random
duplicate-heavy
nearly sorted
```

## 29. Interview Questions

1. What is Bubble Sort's invariant?
2. Why is its standard complexity `O(n²)`?
3. How does early exit change the best case?
4. How can Bubble Sort remain stable?
5. Why is reverse-sorted data expensive?
6. What is its auxiliary space?
7. How are inversions related to Bubble Sort?
8. Why is Bubble Sort generally not preferred for production sorting?
9. How would you adapt it to objects?
10. What tests prove that your implementation is correct?

## 30. Revision Checklist

- [ ] I can implement Bubble Sort from memory.
- [ ] I can state and prove its loop invariant.
- [ ] I can derive `Θ(n²)` comparisons.
- [ ] I understand early termination.
- [ ] I can explain the `O(n)` best case of the optimized version.
- [ ] I understand why strict comparison preserves stability.
- [ ] I can account for swap/write costs.
- [ ] I can test ordering and permutation preservation.
- [ ] I can explain why it is mainly educational at scale.
- [ ] I can implement it with a custom comparator.

## 31. Key Takeaways

1. **Bubble Sort repeatedly resolves adjacent inversions.**
2. **Its fundamental invariant is a growing sorted suffix.**
3. **The standard implementation is quadratic.**
4. **Early exit reduces the best case to linear time on already sorted input.**
5. **Strict swap conditions preserve stability.**
6. **The algorithm is in-place in its standard form.**
7. **Comparison count alone is not the complete cost model; swaps and writes matter.**
8. **Its main value is teaching invariants, complexity, stability, and optimization reasoning.**
