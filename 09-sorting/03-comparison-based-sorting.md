# 09.03 — Comparison-Based Sorting

## 1. Definition

Comparison-based sorting determines relative order by comparing elements through a comparator.

```text
compare(a, b)
```

The algorithm's decisions depend on comparison outcomes rather than directly exploiting the internal numeric representation of keys.

## 2. Why It Matters

Comparison sorting is the foundation for understanding:

- bubble sort;
- selection sort;
- insertion sort;
- merge sort;
- quicksort;
- heap sort;
- shell sort;
- the `Ω(n log n)` comparison lower bound.

The central engineering question is not “which sort is famous?” but:

```text
What information can the algorithm exploit, and what cost model applies?
```

## 3. Comparator Contract

Assume a comparator where:

```text
compare(a, b) < 0  → a precedes b
compare(a, b) = 0  → equivalent under ordering
compare(a, b) > 0  → a follows b
```

For reliable sorting, the comparator should be consistent with the intended ordering.

## 4. Decision-Based Model

A comparison gives limited information:

```text
        compare(a,b)
        /          \
    a < b        a >= b
```

Repeated comparisons create a decision tree whose leaves represent distinguishable orderings.

## 5. Comparison-Sorting Lower Bound

For arbitrary distinct elements, there are `n!` possible permutations.

A binary comparison tree of height `h` has at most `2^h` leaves.

Therefore:

```text
2^h >= n!
```

Taking logarithms gives:

```text
h >= log2(n!) = Ω(n log n)
```

Thus a general comparison sorter requires `Ω(n log n)` comparisons in the worst case.

## 6. What the Lower Bound Does Not Say

It does not mean every sorting task requires `Ω(n log n)` time.

The bound applies to the general comparison model.

If keys have additional structure, non-comparison methods can exploit it.

## 7. Main Families

Comparison-based algorithms can be grouped roughly as:

```text
Quadratic educational/simple:
Bubble, Selection, Insertion

Divide and conquer:
Merge, Quick

Heap-based:
Heap Sort

Gap-based:
Shell Sort
```

Each has different stability, memory, adaptiveness, and worst-case behavior.

## 8. Bubble Sort

Bubble sort repeatedly compares adjacent elements and exchanges inverted pairs.

A typical implementation has:

```text
Worst: O(n²)
Auxiliary: O(1)
```

With strict swap conditions it can be stable.

Its primary value in this roadmap is understanding local exchange, invariants, and early-exit optimization.

## 9. Selection Sort

Selection sort repeatedly selects the next minimum and places it into its final position.

Typical complexity:

```text
Time: O(n²)
Auxiliary: O(1)
```

Naive swapping makes it generally unstable.

A key property is that it performs relatively few swaps compared with algorithms that repeatedly shift elements.

## 10. Insertion Sort

Insertion sort maintains a sorted prefix and inserts each next element into its appropriate location.

Typical properties:

```text
Worst: O(n²)
Best: O(n)
Auxiliary: O(1)
```

It is naturally stable and adaptive to low inversion counts.

## 11. Merge Sort

Merge sort divides the input, recursively sorts the pieces, and merges sorted runs.

Typical properties:

```text
Time: O(n log n)
Auxiliary: O(n) for a straightforward array implementation
Stable: yes, with appropriate tie handling
```

Its predictable asymptotic behavior and linear merge operation make it important for external and large-data sorting.

## 12. Quicksort

Quicksort partitions around a pivot and recursively processes the partitions.

Typical average behavior is:

```text
O(n log n)
```

but poor pivot behavior can produce:

```text
O(n²)
```

Worst-case avoidance can involve randomized pivots, better pivot selection, or introspective fallbacks.

## 13. Heap Sort

Heap sort builds a heap and repeatedly extracts the next extreme element.

Typical properties:

```text
Worst: O(n log n)
Auxiliary: O(1) for a standard iterative in-place formulation
Stable: generally no
```

It provides a useful worst-case time guarantee with low auxiliary memory.

## 14. Shell Sort

Shell sort generalizes insertion sorting using gaps to move elements across larger distances.

Its exact complexity depends heavily on the chosen gap sequence.

Therefore a Shell sort complexity claim must state the gap sequence or implementation assumptions.

## 15. Stability Comparison

Typical textbook properties:

| Algorithm | Stable? | Typical auxiliary space |
|---|---|---:|
| Bubble | Yes, with strict swaps | O(1) |
| Selection | Generally no | O(1) |
| Insertion | Yes | O(1) |
| Merge | Yes, suitable merge | O(n) |
| Quick | Generally no | O(log n) stack under balanced recursion; implementation-dependent |
| Heap | Generally no | O(1) |
| Shell | Generally no | O(1) |

These are properties of conventional implementations, not immutable laws of every possible variant.

## 16. In-Place Comparison

When memory is constrained, in-place algorithms can reduce auxiliary storage.

But compare the entire cost:

```text
memory
+ cache behavior
+ movement cost
+ stability requirements
+ implementation complexity
+ worst-case guarantees
```

## 17. Adaptive Comparison

Insertion sort exploits local order directly.

Other algorithms may exploit sorted runs, partitions, or hybrid strategies.

Adaptiveness should be evaluated against a defined disorder model.

## 18. Partitioning Mental Model

Quicksort relies on partitioning:

```text
values <= pivot | pivot | values > pivot
```

The exact partition invariant depends on the implementation.

Correctness requires proving that every element is placed into a region consistent with the pivot relation.

## 19. Merge Mental Model

Merge combines two sorted sequences:

```text
left  = [1, 4, 7]
right = [2, 3, 8]

→ [1, 2, 3, 4, 7, 8]
```

Each input element is consumed once, giving:

```text
O(n + m)
```

merge work.

## 20. Heap Mental Model

A heap provides a structured way to repeatedly access an extreme element.

Sorting through heap extraction turns repeated selection into:

```text
build heap
→ extract repeatedly
→ output ordered sequence
```

The heap's structural invariant is central to correctness.

## 21. Operation Cost Model

Do not count only comparisons.

For real workloads consider:

```text
comparisons
swaps
writes
reads
key extraction
allocations
cache behavior
```

For complex objects, one comparator call may be much more expensive than one primitive comparison.

## 22. Cache and Memory Behavior

Two `O(n log n)` algorithms can behave differently because of:

- contiguous access;
- temporary-buffer access;
- pointer chasing;
- branch behavior;
- memory bandwidth.

Asymptotic analysis remains necessary, but production benchmarking adds information about constants and hardware effects.

## 23. Worst-Case Engineering

A production quicksort implementation should consider adversarial or pathological input.

Possible engineering techniques include:

- randomized pivot selection;
- median-based pivot heuristics;
- recursion-depth limits;
- heap-sort fallback;
- three-way partitioning for duplicates.

## 24. Duplicate-Heavy Inputs

Many duplicate values can change partition behavior dramatically.

Three-way partitioning separates:

```text
less | equal | greater
```

This can reduce unnecessary work when many values equal the pivot.

## 25. Recursive Depth

Quicksort's stack behavior depends on partition balance.

Balanced recursion gives approximately:

```text
O(log n)
```

stack depth.

Repeatedly poor partitions can produce:

```text
O(n)
```

depth in a naive implementation.

## 26. Divide-and-Conquer Recurrence

Balanced divide-and-conquer sorting often follows:

```text
T(n) = 2T(n/2) + O(n)
```

which resolves to:

```text
O(n log n)
```

This recurrence will recur throughout merge sort and many other algorithms.

## 27. Comparison Sort Selection Framework

When selecting a comparison sorter, ask:

1. Is stability required?
2. Is mutation acceptable?
3. How much memory is available?
4. Is worst-case latency important?
5. Is the input nearly sorted?
6. Are duplicates common?
7. Are comparisons expensive?
8. Are repeated queries expected?
9. Is predictable performance required?
10. Is an optimized platform implementation already available?

## 28. Backend Applications

Comparison sorting is used for:

- API result ordering;
- deterministic pagination;
- event ordering;
- batch processing;
- ranking;
- interval processing;
- report generation.

For database-backed data, application-side sorting should not replace an appropriate database ordering/index strategy without a reason.

## 29. AI Applications

Comparison sorting appears in:

- score ordering;
- candidate ranking;
- evaluation pipelines;
- threshold processing;
- deterministic output preparation.

For top-k workloads, a full sort may do more work than a heap or selection-based approach. The required output size should influence the algorithm.

## 30. Correctness Proof Template

For any comparison sorter, prove:

### Ordering
Every adjacent pair satisfies the comparator order.

### Preservation
The output is a permutation of the input.

### Termination
Every loop or recursive branch makes measurable progress.

### Stability
If promised, equivalent elements retain their original relative order.

## 31. Common Mistakes

1. Memorizing complexities without assumptions.
2. Forgetting worst-case quicksort behavior.
3. Calling every in-place algorithm `O(1)` space while ignoring recursion.
4. Assuming all implementations of an algorithm share identical properties.
5. Ignoring duplicate-heavy inputs.
6. Ignoring comparator/key costs.
7. Treating comparison sorting as the only sorting model.
8. Using a full sort when only top-k is needed.
9. Ignoring database-side ordering for database-scale data.
10. Failing to prove permutation preservation.

## 32. Edge Cases

Test:

- empty input;
- one element;
- all equal;
- two distinct values;
- reverse sorted;
- already sorted;
- duplicate-heavy;
- extreme values;
- expensive comparators;
- adversarial partition patterns.

## 33. Implementation Lab

Implement from scratch:

1. bubble sort;
2. selection sort;
3. insertion sort;
4. merge operation;
5. merge sort;
6. partition;
7. quicksort;
8. heap construction;
9. heap sort;
10. one Shell sort gap strategy.

Instrument comparisons and writes.

## 34. Practice Requirements

For every implementation, record:

```text
algorithm
preconditions
invariant
best case
average case
worst case
auxiliary space
stability
adaptiveness
mutation behavior
```

Do not copy the values from a table without deriving why they hold.

## 35. Interview Questions

1. Why is comparison sorting bounded by `Ω(n log n)`?
2. Why can insertion sort be linear on sorted input?
3. Why can quicksort degrade to quadratic time?
4. How does three-way partitioning help duplicates?
5. Why is merge sort naturally stable?
6. Why is heap sort generally unstable?
7. Why does recursion depth matter in quicksort?
8. Why can two `O(n log n)` sorts have different real performance?
9. When is a full sort unnecessary for top-k?
10. What properties must a correct sorting algorithm satisfy?

## 36. Revision Checklist

- [ ] I can derive the comparison-sorting lower bound.
- [ ] I understand bubble, selection, and insertion sort mechanics.
- [ ] I understand merge sort's divide/merge model.
- [ ] I understand quicksort partitioning and worst-case behavior.
- [ ] I understand heap sort's heap invariant.
- [ ] I understand why Shell sort depends on its gap sequence.
- [ ] I can distinguish stability, space, and adaptiveness.
- [ ] I can account for comparator and movement costs.
- [ ] I can reason about duplicate-heavy input.
- [ ] I can select a comparison strategy from workload requirements.

## 37. Key Takeaways

1. **Comparison sorting is fundamentally about learning relative order through comparisons.**
2. **The general comparison model has a worst-case `Ω(n log n)` lower bound.**
3. **Bubble, selection, and insertion expose the basic mechanics; merge, quick, and heap expose scalable design patterns.**
4. **Algorithm properties depend on implementation details and explicit contracts.**
5. **Worst-case behavior, memory, stability, adaptiveness, and operation costs must be analyzed separately.**
6. **Duplicates, comparator cost, and input distribution can materially change practical behavior.**
7. **Production sorting is a workload-engineering problem, not a contest to name one universally superior algorithm.**
