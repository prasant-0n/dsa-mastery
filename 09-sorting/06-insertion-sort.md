# 09.06 — Insertion Sort

## 1. Definition

Insertion Sort builds a sorted prefix one element at a time. For each next element, it finds its correct position within the already-sorted prefix and shifts larger elements to make room.

```text
sorted prefix | next item | unsorted suffix
```

## 2. Why It Matters

Insertion Sort is one of the most important elementary sorting algorithms because it connects directly to:

- sorted-prefix invariants;
- adaptive algorithms;
- inversion counting;
- stable sorting;
- in-place insertion;
- online processing;
- hybrid sorting algorithms.

Unlike Selection Sort, its work can decrease dramatically when the input is already close to sorted.

## 3. Mental Model

Take cards from an unsorted pile and insert each card into the correct position in the cards already held.

The held cards are always sorted.

## 4. Core Algorithm

For each index `i`:

1. save `A[i]` as the key;
2. scan left while preceding elements are greater;
3. shift those elements right;
4. insert the key into the resulting gap.

Pseudocode:

```text
for i = 1 ... n-1:
    key = A[i]
    j = i - 1

    while j >= 0 and A[j] > key:
        A[j + 1] = A[j]
        j--

    A[j + 1] = key
```

## 5. Loop Invariant

Before processing index `i`:

```text
A[0 ... i-1]
```

is sorted and contains exactly the original elements from that prefix.

After inserting `A[i]`, the prefix `A[0 ... i]` is sorted and preserved.

## 6. Correctness

The key element belongs somewhere in the sorted prefix.

Every element greater than the key is shifted one position right. Because the prefix was already sorted, once the scan reaches an element less than or equal to the key, the gap immediately after it is the correct insertion position.

The invariant therefore expands by one element each iteration.

## 7. Complexity

Typical bounds:

```text
Best:    O(n)
Average: O(n²)
Worst:   O(n²)
Auxiliary: O(1)
```

The best case occurs when the input is already sorted or nearly so under the relevant disorder model.

## 8. Inversion Relationship

Insertion Sort's shifting work is closely related to inversions.

For an element, the number of larger preceding elements determines how far it must move left.

Therefore total movement is proportional to the number of inversions:

```text
shifts ≈ inversion count
```

up to implementation-specific details such as the final key write.

## 9. Adaptiveness

Insertion Sort is adaptive because existing order reduces the amount of shifting and comparison work.

For already sorted data:

```text
Θ(n)
```

comparisons/work with a conventional implementation.

This makes it useful for small or nearly sorted datasets.

## 10. Stability

Insertion Sort is naturally stable when the shift condition is strict:

```text
A[j] > key
```

If equal elements are not shifted past one another, their relative order is preserved.

Changing the condition to move equal elements can break stability.

## 11. In-Place Behavior

The standard implementation stores the current key and uses a few indexes:

```text
O(1) auxiliary space
```

It rearranges elements in the original array.

## 12. Shifting vs Swapping

Insertion Sort is normally expressed with shifts rather than repeated swaps.

For example:

```text
[2, 4, 7, 9, 5]
```

Save `5`, then shift:

```text
[2, 4, 7, 9, _]
[2, 4, 7, _, 9]
[2, 4, _, 7, 9]
```

then insert `5`:

```text
[2, 4, 5, 7, 9]
```

This directly exposes the insertion position.

## 13. Binary Insertion Sort

Because the prefix is already sorted, binary search can locate the insertion position.

This can reduce comparisons to approximately:

```text
O(n log n)
```

but shifting elements still costs:

```text
O(n²)
```

in the worst case for an array.

Therefore binary insertion does not generally change the overall worst-case movement complexity.

## 14. Online Property

Insertion Sort can process values incrementally:

```text
receive item
→ insert into sorted prefix
→ receive next item
→ insert again
```

This makes the algorithm conceptually useful for online ordered maintenance, although other data structures are usually preferable for large dynamic workloads.

## 15. Sentinel Variants

Implementations can sometimes use sentinels or other boundary techniques to simplify inner-loop checks.

Such optimizations must preserve the array contract and should be evaluated only after the basic implementation is correct.

## 16. Example

Input:

```text
[5, 2, 4, 6, 1, 3]
```

Start:

```text
[5]
```

Insert `2`:

```text
[2, 5]
```

Insert `4`:

```text
[2, 4, 5]
```

Insert `6`:

```text
[2, 4, 5, 6]
```

Continue until:

```text
[1, 2, 3, 4, 5, 6]
```

## 17. JavaScript Pattern

A reusable implementation should accept a comparator:

```js
function insertionSort(values, compare) {
  for (let i = 1; i < values.length; i++) {
    const key = values[i];
    let j = i - 1;

    while (j >= 0 && compare(values[j], key) > 0) {
      values[j + 1] = values[j];
      j--;
    }

    values[j + 1] = key;
  }

  return values;
}
```

Derive this from the invariant rather than memorizing the loop.

## 18. Comparator Discipline

The comparator determines the insertion relation.

For ascending numbers:

```js
(a, b) => a - b
```

For objects, define the desired ordering explicitly.

The strict `> 0` shift condition is important for stability.

## 19. Complexity Derivation

Best case:

```text
1 + 1 + ... + 1 = Θ(n)
```

when each key is already after its correct predecessor.

Worst case:

```text
1 + 2 + ... + (n-1)
= Θ(n²)
```

when each new element must travel across nearly the entire sorted prefix.

## 20. Worst-Case Input

Reverse-sorted data maximizes inversions for distinct elements.

Every newly processed element must move close to the beginning.

This produces quadratic comparisons and shifts.

## 21. Nearly Sorted Input

If only a small number of inversions exist, Insertion Sort can be much closer to linear than its worst-case bound suggests.

This is one of its most important practical algorithmic properties.

## 22. Selection vs Insertion

| Property | Selection Sort | Insertion Sort |
|---|---|---|
| Prefix invariant | Yes | Yes |
| Worst time | O(n²) | O(n²) |
| Best time | O(n²) | O(n) |
| Auxiliary space | O(1) | O(1) |
| Stability | Generally no | Naturally stable |
| Adaptiveness | Low | High |
| Typical movement | Few swaps | Shifts based on disorder |

## 23. Bubble vs Insertion

Both can be stable and adaptive in suitable implementations, but their movement mechanics differ.

Insertion Sort directly inserts a key into the sorted prefix, whereas Bubble Sort repeatedly exchanges adjacent inversions.

For low inversion counts, insertion-based reasoning is especially natural.

## 24. When to Use

Insertion Sort is useful for:

- small arrays;
- nearly sorted arrays;
- incremental insertion into small ordered sequences;
- teaching adaptive sorting;
- hybrid sorting base cases.

## 25. When Not to Use

For large random datasets, quadratic worst-case behavior generally makes standalone Insertion Sort inappropriate when scalable sorting is required.

Use the workload's constraints and available optimized primitives to select the approach.

## 26. Backend Applications

The algorithmic pattern is useful for:

- maintaining small ordered buffers;
- incremental event batches;
- tiny in-memory queues that need ordering;
- sorting small partitions inside hybrid algorithms.

Large database result sets should normally use database ordering/indexing rather than application-side quadratic insertion sorting.

## 27. AI Applications

Insertion-based ordering can be relevant to:

- small candidate sets;
- incremental ranking buffers;
- tiny sorted metadata collections;
- educational implementations of online ranking.

Large AI workloads generally use optimized, vectorized, parallel, or specialized sorting systems.

## 28. Correctness Properties

A correct implementation must maintain:

```text
sorted prefix invariant
+ permutation preservation
```

For stable sorting:

```text
equivalent elements preserve relative order
```

## 29. Common Mistakes

1. Overwriting the key before saving it.
2. Using the wrong shift condition.
3. Moving equal elements unnecessarily.
4. Incorrect `j` boundary handling.
5. Forgetting the final insertion.
6. Claiming binary insertion makes array sorting `O(n log n)` overall.
7. Ignoring mutation behavior.
8. Confusing inversion count with the number of comparisons in every implementation.
9. Using an inconsistent comparator.
10. Off-by-one errors around `j = -1`.

## 30. Edge Cases

Test:

- empty;
- singleton;
- two elements;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- one element far out of place;
- nearly sorted;
- object records with equal keys.

## 31. Testing Strategy

Verify:

```text
sortedness
permutation preservation
stability
mutation contract
```

Compare against a trusted reference on randomized inputs.

Also measure inversion count and compare it with observed shift behavior.

## 32. Benchmarking

Benchmark by disorder level:

- sorted;
- low inversion count;
- moderate disorder;
- random;
- reverse sorted.

Record:

- comparisons;
- shifts;
- writes;
- elapsed time.

## 33. Interview Questions

1. What is the invariant of Insertion Sort?
2. Why is its best case `O(n)`?
3. Why is it adaptive?
4. How are inversions related to its work?
5. Why is it stable?
6. What happens if the shift condition uses `>=`?
7. Why does binary insertion not eliminate quadratic shifting?
8. Why is Insertion Sort useful inside hybrid sorting algorithms?
9. What is its auxiliary space?
10. When would you choose it for a small or nearly sorted dataset?

## 34. Revision Checklist

- [ ] I can implement Insertion Sort from memory.
- [ ] I can state its sorted-prefix invariant.
- [ ] I can derive best-case `O(n)`.
- [ ] I can derive worst-case `O(n²)`.
- [ ] I understand the inversion relationship.
- [ ] I understand why strict shifting preserves stability.
- [ ] I can explain binary insertion and its limits.
- [ ] I can account for shifts and writes.
- [ ] I can test permutation and stability.
- [ ] I understand why it is useful for small/nearly sorted data.

## 35. Key Takeaways

1. **Insertion Sort maintains a sorted prefix and inserts each new element into it.**
2. **Its best case is linear because existing order reduces insertion work.**
3. **Its worst case is quadratic because an element may cross the entire prefix.**
4. **Its movement cost is closely connected to inversion count.**
5. **It is naturally stable and in-place in its standard implementation.**
6. **Binary search can reduce insertion-position comparisons but not array shifting cost.**
7. **Insertion Sort is particularly useful for small or nearly sorted data and as a component of hybrid algorithms.**
8. **Its deeper lesson is adaptive algorithm design: exploit structure that is already present in the input.**
