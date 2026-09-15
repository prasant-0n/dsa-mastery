# 09.01 — Sorting Fundamentals & Ordering Models

## 1. Concept Definition

Sorting transforms a collection into an order defined by a comparison or key relation.

For ascending numeric order:

```text
A[0] <= A[1] <= ... <= A[n-1]
```

Sorting is not merely rearranging values. It establishes an invariant that enables faster searching, grouping, merging, deduplication, ranking, and downstream algorithms.

## 2. Why Sorting Matters

Sorting is one of the most reusable algorithmic transformations.

A sorted representation can turn repeated work into simpler operations:

```text
sort once → binary search many times
sort → two pointers
sort → interval processing
sort → duplicate grouping
sort → ordered merge
```

## 3. Ordering Model

Before sorting, define the ordering relation.

Possible orders include:

- ascending;
- descending;
- lexicographic;
- numeric;
- chronological;
- custom comparator order;
- compound/lexicographic object order.

An algorithm is correct only relative to a coherent ordering contract.

## 4. Comparator Model

A comparator conventionally returns:

```text
< 0 → a precedes b
  0 → equivalent under ordering
> 0 → a follows b
```

The comparator should define a consistent ordering appropriate for the data.

## 5. Ordering vs Equality

Ordering equivalence does not necessarily mean identity.

Two records can compare equal by:

```text
createdAt
```

while having different IDs.

Sorting must therefore define what happens to equivalent elements, especially when stability matters.

## 6. Total, Partial & Weak Ordering

A **total order** can compare every pair consistently.

A **partial order** may leave some elements incomparable.

A **weak ordering** can intentionally group equivalent elements.

Most standard comparison sorting algorithms assume a comparator with suitable consistency for the algorithm's requirements.

## 7. Sorting Contracts

A production sorting API should specify:

```text
Input
Ordering
Comparator/key
Mutation behavior
Stability
Result representation
Time complexity
Space complexity
```

Do not leave mutation or tie behavior implicit.

## 8. In-Place vs Out-of-Place

An in-place sort rearranges elements within the original storage, usually using limited auxiliary memory.

An out-of-place sort creates another representation or requires additional storage.

The choice is a memory/immutability trade-off, not simply a performance label.

## 9. Stable vs Unstable Sorting

A stable sort preserves the relative order of elements equivalent under the comparator.

Example:

```text
Before:
A(priority=1)
B(priority=1)

After stable sort by priority:
A, B
```

An unstable sort may return:

```text
B, A
```

without violating the ordering relation.

## 10. Why Stability Matters

Stability enables multi-stage sorting.

For example:

```text
sort by name
→ stable sort by department
```

can preserve name ordering within each department.

In production, a deterministic tie-breaker can sometimes remove the need to depend on stability, but these are distinct concepts.

## 11. Adaptive Sorting

An adaptive algorithm exploits existing order.

For example, nearly sorted input may require substantially less work than random input for some algorithms.

Adaptiveness should be treated as a workload property.

## 12. Comparison-Based Sorting

Comparison sorting learns ordering through comparisons:

```text
compare(a, b)
```

Important comparison-based algorithms include:

- bubble sort;
- selection sort;
- insertion sort;
- merge sort;
- quicksort;
- heap sort;
- shell sort.

## 13. Non-Comparison Sorting

Some sorting methods exploit additional information about keys rather than relying solely on pairwise comparisons:

- counting sort;
- radix sort;
- bucket sort.

These methods can beat the comparison-sorting lower bound when their assumptions hold.

## 14. Comparison-Sorting Lower Bound

For general comparison sorting, the decision-tree model gives a lower bound of:

```text
Ω(n log n)
```

comparisons in the worst case for sorting arbitrary distinct elements.

The bound does not prohibit non-comparison methods because they use additional key structure.

## 15. Decision Tree Mental Model

Each comparison produces a branch:

```text
        compare
       /       \
    a < b     a >= b
```

To distinguish among many possible input permutations, the decision tree must have sufficient leaves.

This leads to the `Ω(n log n)` comparison lower bound.

## 16. Time Complexity Dimensions

For sorting, distinguish:

```text
comparison count
moves/swaps
key extraction
auxiliary memory
preprocessing
```

Two algorithms with the same Big-O may behave differently because their operation costs differ.

## 17. Space Complexity

Report auxiliary space separately from the input itself.

For example:

```text
O(1) auxiliary
O(n) auxiliary
O(log n) recursion stack
```

The exact implementation matters.

## 18. Recursion and Stack Usage

Recursive sorting algorithms consume call-stack space.

A complexity claim such as `O(log n)` space may refer only to stack depth under balanced recursion and may not hold for pathological recursion.

State the assumptions.

## 19. Mutation Semantics in JavaScript

JavaScript's `Array.prototype.sort()` mutates the array.

A non-mutating API may require copying first:

```js
const sorted = [...values].sort(compare);
```

That introduces additional memory and copy cost.

## 20. JavaScript Comparator Semantics

For numeric sorting, do not rely on default lexical ordering.

Use:

```js
(a, b) => a - b
```

rather than allowing numeric values to be compared as strings.

## 21. Complex Objects

Object sorting typically uses:

```text
key selector + comparator
```

Example conceptual order:

```text
priority ASC
→ createdAt ASC
→ id ASC
```

The complete order should be deterministic when reproducibility matters.

## 22. Key Extraction Cost

If computing the sort key is expensive, repeatedly extracting it during comparisons can dominate runtime.

A decorate-sort-undecorate approach can precompute keys:

```text
records
→ { record, key }
→ sort by key
→ recover records
```

This trades memory for reduced repeated computation.

## 23. Sorting and Searching

Sorting often exists to enable later searches.

For `Q` queries, compare:

```text
Q × O(n)
```

against:

```text
O(n log n) + Q × O(log n)
```

when sorting once enables binary search.

The crossover depends on workload and constants.

## 24. Sorting and Two Pointers

Many pair/triplet problems become easier after sorting because relative ordering enables directional pointer movement.

This is a common algorithmic pattern:

```text
sort → establish monotonic structure → scan
```

## 25. Sorting and Deduplication

Sorting groups equal values together:

```text
1 1 1 2 2 3 4 4
```

A linear scan can then count or remove duplicates.

Hashing can perform exact deduplication differently, so the choice depends on whether ordering is also required.

## 26. Sorting and Intervals

Sorting interval endpoints by start time enables standard merge and overlap algorithms.

Again, sorting is a preprocessing transformation that creates useful structure.

## 27. Sorting and Merging

Two sorted sequences can be merged in linear time:

```text
O(n + m)
```

This primitive is central to merge sort and external sorting.

## 28. Backend Applications

Sorting appears in:

- API result ordering;
- pagination;
- ranking;
- log processing;
- batch aggregation;
- event timelines;
- cache organization;
- report generation.

For database-scale datasets, database indexes and `ORDER BY` execution should generally handle storage-level sorting rather than loading everything into application memory.

## 29. AI Applications

Sorting supports:

- ranking candidates;
- ordering model scores;
- top-k preparation;
- threshold discovery;
- deterministic evaluation output;
- preprocessing structured feature metadata.

For very large numeric workloads, specialized numerical systems may use vectorized or parallel sorting implementations.

## 30. Correctness Invariant

The fundamental postcondition of sorting is:

```text
for every valid i:
compare(A[i], A[i+1]) <= 0
```

For stable sorting, an additional invariant is required:

> Equivalent elements retain their original relative order.

## 31. Permutation Property

Sorting must preserve the multiset of input elements.

Therefore correctness has at least two dimensions:

1. **ordering:** output is sorted;
2. **preservation:** output contains exactly the original elements.

Checking only adjacent ordering is insufficient because an algorithm could accidentally drop or duplicate values.

## 32. Stability Property

For equivalent elements `x` and `y` where `x` appeared before `y` originally:

```text
x before y
```

must remain true in a stable output.

This should be tested with records carrying unique original positions.

## 33. Common Mistakes

1. Forgetting the ordering contract.
2. Using lexical ordering for numbers.
3. Confusing stable with deterministic.
4. Ignoring mutation behavior.
5. Reporting only Big-O without space analysis.
6. Forgetting recursion-stack cost.
7. Assuming comparison sorting is the only sorting family.
8. Ignoring key-extraction cost.
9. Treating ordering equality as object identity.
10. Claiming an algorithm is universally fastest without specifying the workload.

## 34. Edge Cases

Test:

- empty input;
- singleton;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- negative numbers;
- extreme numeric values;
- `NaN` where numeric domains permit it;
- objects with equal primary keys;
- expensive key extraction;
- very large arrays.

## 35. Testing Strategy

Every sorting implementation should be checked for:

```text
sortedness
+ permutation preservation
+ stability when promised
```

Compare against a trusted reference on randomized inputs.

## 36. Benchmarking

Measure:

- comparisons;
- swaps/moves;
- key extraction calls;
- allocations;
- recursion depth;
- wall-clock time.

Benchmark different input distributions:

- random;
- sorted;
- reverse sorted;
- duplicate-heavy;
- nearly sorted.

## 37. Implementation Lab

Build a sorting interface with:

```text
sort(values, options)
```

and explicit:

- comparator;
- stable/unstable contract;
- mutation policy;
- validation mode;
- instrumentation.

Then use it as the foundation for later sorting chapters.

## 38. Interview Questions

1. What is sorting?
2. What is a stable sort?
3. What is an in-place sort?
4. What is adaptive sorting?
5. Why is comparison sorting bounded by `Ω(n log n)`?
6. Why can counting/radix sort beat that bound?
7. Why does JavaScript need a numeric comparator?
8. What is the difference between equality and ordering equivalence?
9. How does sorting help binary search?
10. What are the correctness properties of a sorting algorithm?

## 39. Revision Checklist

- [ ] I can define a sorting contract.
- [ ] I understand total and partial ordering concepts.
- [ ] I understand stable vs unstable sorting.
- [ ] I understand in-place vs out-of-place sorting.
- [ ] I can explain the comparison-sorting lower bound.
- [ ] I can distinguish comparison and non-comparison sorting.
- [ ] I understand JavaScript mutation semantics.
- [ ] I can model key-extraction cost.
- [ ] I can state sorting correctness as ordering + permutation preservation.
- [ ] I can explain how sorting enables later algorithms.

## 40. Key Takeaways

1. **Sorting establishes an ordering invariant that unlocks many downstream algorithms.**
2. **The ordering contract must be explicit.**
3. **Stability, mutation, adaptiveness, and auxiliary space are independent properties.**
4. **General comparison sorting has a worst-case `Ω(n log n)` comparison lower bound.**
5. **Non-comparison methods exploit additional key structure.**
6. **Sorting correctness requires both ordered output and preservation of the input multiset.**
7. **Comparator/key-extraction cost matters in real systems.**
8. **The right sorting strategy depends on data distribution, key structure, memory, workload, and downstream operations.**
9. **The deeper lesson is to treat sorting as a structural transformation, not simply as a list of named algorithms.**
