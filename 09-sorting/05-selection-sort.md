# 09.05 — Selection Sort

## 1. Definition

Selection Sort repeatedly finds the minimum element in the unsorted region and places it at the next final position.

For ascending order:

```text
sorted prefix | unsorted region
```

After each outer-loop iteration, one new minimum is fixed permanently in the sorted prefix.

## 2. Why Learn Selection Sort?

Selection Sort is valuable for understanding:

- prefix invariants;
- minimum selection;
- comparison counting;
- swap minimization;
- in-place algorithms;
- stability trade-offs;
- selection versus movement cost.

It is simple, but its engineering characteristics differ meaningfully from Bubble and Insertion Sort.

## 3. Mental Model

Imagine the array divided into two regions:

```text
[ sorted | unsorted ]
```

Find the smallest element in the unsorted region and exchange it with the first unsorted position.

Repeat until no unsorted elements remain.

## 4. Basic Algorithm

```text
for start = 0 ... n-2:
    minIndex = start

    for i = start+1 ... n-1:
        if A[i] < A[minIndex]:
            minIndex = i

    swap(A[start], A[minIndex])
```

## 5. Loop Invariant

At the beginning of iteration `start`:

```text
A[0 ... start-1]
```

is sorted and contains the smallest `start` elements in their final positions.

The remaining suffix contains the rest.

## 6. Correctness

During each iteration, the algorithm scans the entire unsorted region and identifies its minimum.

Placing that minimum at `start` extends the sorted prefix by one element.

Because the chosen element is no greater than every remaining element, the prefix remains correctly ordered.

When the prefix covers the entire array, the array is sorted.

## 7. Complexity

Standard Selection Sort performs:

```text
Best:    O(n²)
Average: O(n²)
Worst:   O(n²)
Space:   O(1) auxiliary
```

The number of comparisons is approximately:

```text
(n-1) + (n-2) + ... + 1
= n(n-1)/2
= Θ(n²)
```

## 8. Why Already-Sorted Input Is Still Quadratic

Unlike optimized Bubble Sort, Selection Sort must search the remaining region to know which element is minimum.

Therefore even if the array is already sorted, it performs quadratic comparison work.

## 9. Swap Count

Selection Sort performs at most approximately `n-1` placement swaps, ignoring implementation-specific no-op swaps.

This is significantly fewer writes than algorithms that repeatedly exchange adjacent inversions.

That makes movement cost an important part of its analysis.

## 10. Comparison vs Movement

Selection Sort demonstrates that two algorithms can have similar comparison complexity but different write behavior.

A useful cost model is:

```text
Total cost ≈ comparisons × comparisonCost
           + writes × writeCost
```

When writes are expensive, minimizing movement can matter.

## 11. Stability

Conventional Selection Sort is generally **unstable**.

Example conceptually:

```text
A(key=1), B(key=2), C(key=1)
```

Selecting C as the minimum and swapping it toward the front can move C ahead of A.

The equal-key relative order has changed.

## 12. Stable Selection Sort

A stable variant can avoid the disruptive swap.

Instead:

1. find the minimum;
2. remove it from its current position;
3. shift intervening elements right;
4. insert the minimum at the front.

This preserves relative order but increases movement cost.

## 13. Stability Trade-Off

Naive version:

```text
few writes + unstable
```

Stable shifting version:

```text
more writes + stable
```

This is a concrete example of an algorithmic trade-off.

## 14. In-Place Behavior

The standard implementation needs only a few variables:

```text
minIndex
start
current index
```

Therefore auxiliary space is:

```text
O(1)
```

A wrapper that copies the input before sorting has additional `O(n)` storage.

## 15. Adaptiveness

Selection Sort is not strongly adaptive to existing sortedness.

It still scans the remaining suffix on every iteration.

Therefore an already sorted array does not reduce its asymptotic comparison work.

## 16. Selection Sort vs Bubble Sort

Both are generally quadratic, but their mechanics differ.

| Property | Selection Sort | Bubble Sort |
|---|---|---|
| Core operation | Select minimum | Exchange adjacent inversions |
| Standard comparisons | Θ(n²) | Θ(n²) |
| Standard auxiliary space | O(1) | O(1) |
| Writes/swaps | Usually low | Can be high |
| Stability | Generally no | Can be stable |
| Adaptive best case | No | Yes with early exit |

This is a comparison of properties, not a universal choice rule.

## 17. Selection Sort vs Insertion Sort

Insertion Sort maintains a sorted prefix but inserts each next item into it.

Selection Sort scans for the minimum and places it.

Insertion Sort can exploit low inversion counts; Selection Sort generally cannot.

Selection Sort can perform fewer swaps.

## 18. Example

Input:

```text
[64, 25, 12, 22, 11]
```

Iteration 1:

```text
minimum = 11
[11, 25, 12, 22, 64]
```

Iteration 2:

```text
minimum = 12
[11, 12, 25, 22, 64]
```

Continue until the entire prefix is fixed.

## 19. JavaScript Pattern

A reusable implementation should accept a comparator:

```js
function selectionSort(values, compare) {
  for (let start = 0; start < values.length - 1; start++) {
    let minIndex = start;

    for (let i = start + 1; i < values.length; i++) {
      if (compare(values[i], values[minIndex]) < 0) {
        minIndex = i;
      }
    }

    if (minIndex !== start) {
      [values[start], values[minIndex]] =
        [values[minIndex], values[start]];
    }
  }

  return values;
}
```

Derive the invariant and complexity yourself before implementing it.

## 20. Comparator Discipline

Selection Sort should not assume numeric values.

For objects, define the ordering explicitly:

```js
(a, b) => a.priority - b.priority
```

For compound ordering, compare the primary field and then the required tie-breakers.

## 21. Mutation Semantics

The standard implementation mutates the array.

If the public API requires immutability:

```js
const result = [...values];
```

must be accounted for in the total memory and copy-cost model.

## 22. Correctness Properties

A correct implementation must satisfy:

```text
1. output is sorted
2. output preserves the input multiset
```

If a stable variant is promised:

```text
3. equivalent elements preserve original relative order
```

## 23. Common Mistakes

1. Initializing `minIndex` incorrectly.
2. Starting the inner loop at the wrong index.
3. Swapping before the full scan is complete.
4. Forgetting the final placement step.
5. Claiming the algorithm is stable because it uses one swap per pass.
6. Forgetting that sorted input remains quadratic.
7. Performing unnecessary self-swaps.
8. Ignoring write cost.
9. Using an inconsistent comparator.
10. Forgetting permutation preservation.

## 24. Edge Cases

Test:

- empty array;
- singleton;
- two elements;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- negative numbers;
- object records with equal keys.

## 25. Backend Applications

Selection Sort itself is generally educational at scale, but its reasoning is relevant to systems where selecting a minimum repeatedly is useful:

- small in-memory batches;
- minimizing writes in constrained environments;
- simple deterministic selection logic;
- teaching scheduling and priority-selection concepts.

For large datasets, optimized library/database algorithms are normally used.

## 26. AI Applications

The algorithm provides a useful conceptual model for repeated minimum/maximum selection, but it is generally unsuitable for large AI data sorting.

Its ideas can still help explain:

- candidate selection;
- ranking loops;
- write-vs-comparison trade-offs;
- selection-based processing.

For top-k tasks, specialized selection or heap techniques can avoid fully sorting all elements.

## 27. Testing Strategy

Test with a trusted reference and verify:

```text
sortedness
+ permutation
+ stability if promised
```

Instrument:

```text
comparisons
swaps
writes
```

This makes the algorithm's trade-offs measurable.

## 28. Benchmarking

Use workloads including:

- sorted;
- reverse sorted;
- random;
- duplicate-heavy;
- nearly sorted.

Selection Sort should demonstrate relatively stable comparison counts across these distributions, while swap counts can differ.

## 29. Interview Questions

1. What is Selection Sort's loop invariant?
2. Why is its time complexity `O(n²)` even on sorted input?
3. Why does it usually perform fewer swaps than Bubble Sort?
4. Why is conventional Selection Sort unstable?
5. How can you make Selection Sort stable?
6. What trade-off does stable Selection Sort introduce?
7. What is its auxiliary space?
8. Is Selection Sort adaptive?
9. Why might write cost matter?
10. When would a full sort be unnecessary for a top-k problem?

## 30. Revision Checklist

- [ ] I can implement Selection Sort from memory.
- [ ] I can state its sorted-prefix invariant.
- [ ] I can derive its `Θ(n²)` comparisons.
- [ ] I understand why sorted input remains quadratic.
- [ ] I can explain its low swap count.
- [ ] I can explain why conventional Selection Sort is unstable.
- [ ] I can design a stable shifting variant.
- [ ] I can compare comparison cost with movement cost.
- [ ] I can prove sortedness and permutation preservation.
- [ ] I can explain its limitations for production-scale sorting.

## 31. Key Takeaways

1. **Selection Sort repeatedly selects the minimum from the unsorted region.**
2. **Its core invariant is a growing sorted prefix.**
3. **Its comparison count is Θ(n²) regardless of input order.**
4. **It can use very few swaps compared with adjacent-exchange sorting.**
5. **Conventional Selection Sort is generally unstable.**
6. **Stable variants trade additional movement for preserved relative order.**
7. **It is in-place in its standard implementation.**
8. **It is mainly valuable as a foundation for algorithmic reasoning rather than large-scale production sorting.**
