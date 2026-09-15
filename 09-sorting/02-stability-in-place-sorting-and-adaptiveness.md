# 09.02 — Stability, In-Place Sorting & Adaptiveness

## 1. Concept Definition

Sorting algorithms differ in properties beyond time complexity. Three important dimensions are:

- **stability** — whether equivalent elements preserve relative order;
- **in-place behavior** — how much auxiliary storage is required;
- **adaptiveness** — whether existing input order can reduce work.

These properties describe different dimensions and should never be treated as interchangeable.

## 2. Stability

A sorting algorithm is stable when elements that compare equivalent remain in their original relative order.

Example:

```text
Input:
A(score=5)
B(score=2)
C(score=5)

Stable sort by score:
B, A, C
```

A and C remain ordered as they were originally.

## 3. Why Stability Exists

Stability is useful when records have multiple fields and earlier ordering should be preserved for ties.

It can support multi-pass sorting:

```text
stable sort by secondary key
stable sort by primary key
```

The earlier secondary ordering remains within equal primary-key groups.

## 4. Stability vs Determinism

These are different.

A sort can be deterministic while unstable if it uses a deterministic tie-breaking rule.

Stability specifically refers to preserving the original relative order of comparator-equivalent elements.

## 5. Stability Test

Attach an original position to every record:

```js
{ key: 5, originalIndex: 0 }
```

After sorting by `key`, inspect equal-key groups and verify that `originalIndex` remains increasing.

## 6. In-Place Sorting

An algorithm is commonly called in-place when it uses only a small amount of auxiliary storage relative to the input.

The exact definition can vary by algorithm and implementation, so report the actual auxiliary space rather than relying on the label alone.

## 7. In-Place Does Not Mean Zero Memory

An in-place recursive algorithm can still consume stack space.

For example:

```text
O(1) explicit auxiliary storage
+ O(log n) recursion stack
```

may still be reported as `O(log n)` auxiliary space under the chosen accounting model.

## 8. Out-of-Place Sorting

Out-of-place sorting uses additional structures such as temporary arrays.

Merge sort commonly requires `O(n)` auxiliary storage in a straightforward implementation.

The additional memory can simplify correctness and provide predictable behavior.

## 9. Adaptiveness

An adaptive sorting algorithm takes advantage of existing order.

For example, insertion sort can approach linear work when the input is already sorted or nearly sorted under suitable implementations.

Adaptiveness is a property of behavior over input distributions.

## 10. Measuring Disorder

“Nearly sorted” is not one universal metric.

Possible measures include:

- number of inversions;
- maximum displacement;
- number of runs;
- adjacent disorder;
- percentage of misplaced elements.

An algorithm may adapt to one disorder model but not another.

## 11. Inversions

An inversion is a pair `(i, j)` where:

```text
i < j
and
A[i] > A[j]
```

The number of inversions quantifies one useful form of disorder.

Insertion sort's work is closely related to the number of inversions.

## 12. Runs

A run is a contiguous sequence that is already ordered according to the comparator.

Inputs with long ordered runs can benefit from algorithms that detect and exploit those runs.

This idea contributes to hybrid algorithms such as TimSort.

## 13. Adaptiveness vs Best-Case Complexity

An algorithm having a linear best case does not automatically mean it is adaptive in every meaningful sense.

You should ask:

```text
What property of the input causes the work to decrease?
```

That property is the actual adaptive mechanism.

## 14. Stability and In-Place Trade-Off

Some algorithms can be modified to improve stability or reduce auxiliary memory, but the changes may affect complexity, implementation complexity, or constant factors.

There is no universal free optimization.

## 15. Stable Insertion Sort

Insertion sort naturally preserves equal-element order when insertion uses a strict comparison for shifting.

Changing the condition carelessly can make an implementation unstable.

This demonstrates that stability can depend on implementation details, not just algorithm names.

## 16. Stable Merge

Merge sort can be stable when ties are resolved by taking the element from the left run first.

Conceptually:

```text
if left <= right:
    take left
else:
    take right
```

That tie rule preserves original run order.

## 17. Quicksort Stability

A conventional in-place quicksort is not stable.

A stable quicksort can be engineered, but additional storage or more complicated movement rules may be required.

The important lesson is to evaluate the actual implementation.

## 18. Heap Sort Stability

Heap sort is generally unstable because heap operations can move equivalent elements across each other.

Adding identity-aware tie-breaking can make output deterministic, but deterministic tie-breaking is not the same as preserving original order.

## 19. Selection Sort Stability

Naive selection sort is generally unstable because swapping the selected minimum into position can cross equivalent elements.

Stable variants exist but may require shifting rather than swapping, changing movement costs.

## 20. Bubble Sort Stability

Bubble sort can be stable when it swaps only when the left element is strictly greater than the right element.

Swapping equal elements unnecessarily destroys stability.

## 21. Property Matrix

A useful way to compare algorithms is:

| Property | Question |
|---|---|
| Stable | Do equal keys retain relative order? |
| In-place | What auxiliary memory is required? |
| Adaptive | Does existing order reduce work? |
| Worst-case | What is the maximum running time? |
| Recursion | What stack depth can occur? |

Do not collapse these into one ranking.

## 22. Mutation Policy

There are two separate questions:

1. Does the algorithm rearrange the input storage?
2. Does the API promise to preserve the caller's input?

An implementation can be algorithmically in-place while an API wrapper copies the input first.

## 23. Copy Cost

If an API promises non-mutation:

```js
const copy = [...values];
```

requires:

```text
O(n)
```

additional memory and linear copy work before sorting.

This should be included in the practical cost model.

## 24. Stability Through Decorate-Sort

When using a sorting primitive with uncertain stability, explicit original positions can be included as a tie-breaker:

```text
(key, originalIndex)
```

This creates deterministic stable-like behavior at the application level, assuming the underlying sort respects the compound ordering.

## 25. When Stability Is Unnecessary

If equal keys are genuinely interchangeable and no downstream operation observes their order, stability may provide no useful semantic value.

Do not pay for a property that the contract does not require.

## 26. Backend Applications

Stability is relevant to:

- API sorting by primary/secondary fields;
- report generation;
- event ordering;
- deterministic batch processing;
- pagination tie behavior.

In cursor pagination, an explicit unique tie-breaker is often preferable because it defines a total order rather than relying implicitly on previous array order.

## 27. AI Applications

Stability and deterministic ordering can matter for:

- ranking candidates with equal scores;
- reproducible evaluation;
- deterministic preprocessing;
- ordered metadata pipelines;
- beam/candidate post-processing.

The required semantics should be documented explicitly.

## 28. Adaptive Backend Workloads

Backend data is often partially ordered because of:

- append-heavy logs;
- timestamped events;
- incrementally updated records;
- batches that arrive mostly ordered.

An adaptive algorithm can exploit this structure when the workload and algorithm support it.

## 29. Correctness of Stability

A stable sorting implementation must satisfy both:

```text
ordered output
```

and:

```text
equivalent elements preserve original relative order
```

The ordinary sortedness property alone cannot prove stability.

## 30. Correctness of In-Place Algorithms

In-place algorithms must preserve the same sorting postcondition as out-of-place algorithms.

Memory optimization does not change the correctness target:

```text
sorted + permutation preserved
```

## 31. Adaptive Correctness

Adaptiveness changes the amount of work, not the required result.

Every valid input must still satisfy the same sorting contract regardless of how much existing order the algorithm exploits.

## 32. Benchmarking Adaptiveness

Do not benchmark only random arrays.

Include:

- sorted;
- reverse sorted;
- nearly sorted;
- few inversions;
- many runs;
- duplicate-heavy;
- random.

Measure operation counts as well as wall-clock time.

## 33. Common Mistakes

1. Assuming stable means faster.
2. Assuming in-place means zero auxiliary memory.
3. Confusing deterministic output with stability.
4. Ignoring recursion stack space.
5. Measuring adaptiveness only on random data.
6. Forgetting copy cost for non-mutating wrappers.
7. Claiming an algorithm is stable without checking its tie behavior.
8. Treating algorithm names as guarantees independent of implementation.
9. Ignoring the actual disorder metric.
10. Paying for stability when the contract does not require it.

## 34. Edge Cases

Test stability with:

- all equal keys;
- two equal keys separated by other records;
- duplicate-heavy data;
- already ordered records;
- reverse ordered records;
- compound keys with tied primary fields.

Test memory behavior with:

- empty arrays;
- singleton arrays;
- very large arrays;
- recursive worst-case partitions where applicable.

## 35. Implementation Lab

Implement and instrument:

1. stable insertion sort;
2. unstable selection sort;
3. stable merge operation;
4. in-place partition;
5. stability validator;
6. permutation validator;
7. inversion counter;
8. run detector;
9. mutation detector;
10. adaptive benchmark harness.

## 36. Interview Questions

1. What exactly is a stable sort?
2. Is stable sorting the same as deterministic sorting?
3. What does in-place mean?
4. Does an in-place recursive algorithm use zero extra memory?
5. What makes insertion sort adaptive?
6. How are inversions related to insertion sort?
7. Why can selection sort be unstable?
8. How can merge sort preserve stability?
9. Why is conventional heap sort unstable?
10. How would you test stability?

## 37. Revision Checklist

- [ ] I can define stability precisely.
- [ ] I can distinguish stability from determinism.
- [ ] I can explain in-place vs out-of-place.
- [ ] I can account for recursion stack space.
- [ ] I can define adaptiveness.
- [ ] I understand inversion-based disorder.
- [ ] I understand run-based disorder.
- [ ] I can explain why tie-handling affects stability.
- [ ] I can test sorting for stability and permutation preservation.
- [ ] I can evaluate adaptive behavior using multiple input distributions.

## 38. Key Takeaways

1. **Stability, in-place behavior, and adaptiveness are independent sorting properties.**
2. **Stability preserves relative order among comparator-equivalent elements.**
3. **Determinism can be achieved with tie-breakers without being stable.**
4. **In-place does not mean zero memory because recursion and implementation details still matter.**
5. **Adaptiveness is meaningful only relative to a specific model of input disorder.**
6. **Inversions and runs are useful ways to reason about existing order.**
7. **Tie-handling decisions can determine whether an implementation is stable.**
8. **Production sorting contracts should explicitly state mutation and stability requirements.**
9. **Benchmarking must include realistic input distributions, not only random data.**
10. **The deeper skill is choosing sorting properties from the workload contract rather than memorizing labels.**
