# 08.18 — Fibonacci Search & Alternative Ordered Search Strategies

## 1. Concept Definition

Fibonacci search is an ordered-array search algorithm that uses Fibonacci numbers to partition the active interval instead of using the exact midpoint.

The method maintains a Fibonacci-sized interval and reduces it according to Fibonacci offsets.

## 2. Why It Matters

Fibonacci search is historically important because it shows that binary search is not the only way to repeatedly shrink an ordered search interval.

More importantly, it teaches a broader lesson:

> Search performance depends on both the elimination strategy and the cost model of the underlying access operation.

## 3. Mental Model

Binary search repeatedly divides an interval approximately in half.

Fibonacci search uses neighboring Fibonacci offsets:

```text
..., 5, 8, 13, 21, 34, ...
```

The interval shrinks according to these ratios until the candidate region becomes small.

## 4. Preconditions

Classic Fibonacci search assumes:

- sorted indexed data;
- random access;
- a total ordering;
- a finite search interval.

It is primarily an educational and alternative ordered-search technique rather than a universal replacement for binary search.

## 5. Fibonacci Numbers

The sequence is:

```text
F0 = 0
F1 = 1
Fn = F(n-1) + F(n-2)
```

The algorithm selects the smallest Fibonacci number greater than or equal to the active interval length.

## 6. Partitioning

Instead of choosing:

```text
mid = low + floor((high - low) / 2)
```

Fibonacci search chooses a position based on a Fibonacci offset.

The remaining interval can then be represented by smaller Fibonacci numbers.

## 7. Search Invariant

At every step:

> If the target exists, it remains inside the active candidate interval represented by the current Fibonacci range.

The Fibonacci state must shrink after every comparison.

## 8. Why Fibonacci Ratios Work

Consecutive Fibonacci numbers approach the golden ratio:

```text
Fn / Fn-1 → φ
```

where `φ ≈ 1.618`.

The resulting partitions are asymmetric but still shrink the candidate region systematically.

## 9. Complexity

The number of iterations is:

```text
O(log n)
```

because Fibonacci numbers grow exponentially.

Iterative auxiliary space is:

```text
O(1)
```

excluding any precomputed Fibonacci table.

## 10. Comparison with Binary Search

Both provide logarithmic search over sorted arrays.

Binary search uses a midpoint and usually has simpler implementation and reasoning.

Fibonacci search uses Fibonacci offsets and can have different access patterns.

The correct comparison depends on the hardware and access model rather than complexity alone.

## 11. Historical Cost Model

Fibonacci search has historically been discussed for systems where arithmetic or memory-access behavior made certain partition patterns interesting.

Modern general-purpose CPUs make the practical advantage highly workload- and implementation-dependent.

Do not infer practical superiority from asymptotic complexity.

## 12. Random Access Requirement

The algorithm still needs access to positions inside the interval.

If random access is expensive, the cost of reaching the chosen index can dominate comparison count.

This is why algorithm analysis must distinguish:

```text
number of comparisons
```

from:

```text
cost per access
```

## 13. Cache and Memory Behavior

On modern hardware, cache locality and branch behavior can affect measured performance.

Fibonacci search's theoretical partition structure does not by itself guarantee better cache behavior.

Benchmark the actual implementation when performance matters.

## 14. Duplicates

Duplicates do not invalidate exact membership search, but they complicate boundary semantics.

For first or last occurrence, the algorithm must continue searching the relevant side after equality rather than immediately returning.

## 15. Lower Bound

A Fibonacci-style search can be adapted to locate:

```text
first index with A[i] >= target
```

by treating the comparison as a monotone boundary predicate.

The invariant and result semantics must be defined explicitly.

## 16. Upper Bound

Likewise, upper-bound semantics can locate:

```text
first index with A[i] > target
```

The equality branch differs from lower bound and must be handled deliberately.

## 17. Descending Arrays

For descending arrays, the ordering comparisons reverse.

The Fibonacci partition mechanism itself does not fundamentally change; the comparison-to-direction mapping does.

## 18. Comparator-Based Search

Fibonacci search can operate on records if a comparator defines their sorted order.

The comparator should be consistent and transitive enough for ordered-search reasoning.

## 19. Fibonacci vs Exponential Search

These algorithms solve different structural problems.

**Fibonacci search:**

```text
known finite interval → Fibonacci partitioning
```

**Exponential search:**

```text
unknown upper bound → exponential bracketing → binary search
```

They can both ultimately exploit logarithmic interval reduction but address different boundary assumptions.

## 20. Fibonacci vs Interpolation Search

Interpolation search estimates a position from numeric values.

Fibonacci search uses only ordering and interval size.

Therefore Fibonacci search does not require a distribution model for numeric keys.

## 21. Ternary Search Distinction

Ternary search partitions an interval into three regions and is commonly useful in unimodal optimization settings.

For ordinary exact search on sorted discrete data, binary-style elimination already provides logarithmic reduction with fewer partitions per iteration.

The underlying problem structure determines the appropriate search method.

## 22. Jump Search Distinction

Jump search divides the array into blocks and searches block-by-block before performing a local linear scan.

With a block size near `sqrt(n)`, its typical complexity is:

```text
O(sqrt(n))
```

It provides another example of trading partition precision for simpler movement patterns.

## 23. Linear Search Baseline

Linear search requires no ordering assumption:

```text
O(n)
```

This makes it the correct reference algorithm for arbitrary unsorted data and for validating optimized ordered-search implementations.

## 24. Search Strategy Selection

A useful decision framework is:

```text
Unsorted data
→ linear / hash-based strategy

Sorted + known bounds
→ binary-family strategy

Sorted + unknown bound
→ exponential search

Numeric + favorable distribution
→ interpolation may be considered

Sorted + alternative partition/access model
→ Fibonacci or jump search may be evaluated
```

This is a selection framework, not a universal ranking.

## 25. Correctness: Initialization

Choose a Fibonacci number large enough to cover the active interval.

The initial candidate region therefore contains every possible target position.

## 26. Correctness: Maintenance

After comparing the probe value with the target, eliminate only the region proven impossible.

Update the Fibonacci state so that it represents the remaining interval.

## 27. Correctness: Termination

The Fibonacci offset decreases toward zero.

Eventually either:

- the target is found;
- the candidate region becomes empty;
- the remaining candidate fails the target condition.

## 28. Correctness Proof Structure

### Invariant
The target, if present, is inside the active interval.

### Preservation
Comparison selects the only interval that can still contain the target.

### Progress
The Fibonacci index decreases each iteration.

### Termination
The finite Fibonacci state reaches its terminal configuration.

### Postcondition
The returned result satisfies the documented exact or boundary-search contract.

## 29. Complexity Model

For `n` elements:

```text
Time → O(log n)
Auxiliary space → O(1)
```

under the standard indexed-access model.

If Fibonacci numbers are generated dynamically, account for the constant number of integer states and their arithmetic cost.

## 30. JavaScript Considerations

JavaScript implementations should consider:

- integer-safe array indices;
- avoiding unnecessary Fibonacci arrays;
- bounds checks;
- `Number` precision for very large conceptual sizes;
- clear handling of empty input.

Normal JavaScript arrays cannot practically represent arbitrary mathematical index spaces, so the abstraction must match the actual data structure.

## 31. Backend Applications

Potential applications include searching sorted in-memory structures where an alternative access pattern is worth benchmarking.

The broader backend lesson is to model:

- index access;
- cache effects;
- branch behavior;
- query frequency;
- data size;
- preprocessing cost.

For databases, use the database engine's indexing mechanisms rather than assuming application-level Fibonacci search transfers directly.

## 32. AI Applications

Potential educational or specialized uses include:

- sorted numeric candidate arrays;
- threshold search;
- ordered metadata lookup;
- experimentation with alternative search kernels.

For high-dimensional vector retrieval, Fibonacci search is generally not the relevant search abstraction because vector similarity is not a one-dimensional total-order problem.

## 33. Testing Strategy

For each sorted dataset:

1. search every present value;
2. search absent values;
3. test boundaries;
4. compare against binary search;
5. compare against linear reference;
6. repeat with duplicates if supported.

## 34. Differential Testing

Use binary or linear search as a trusted reference.

For every target, verify:

```text
same found/not-found semantics
```

and, for boundary variants:

```text
same returned index semantics
```

## 35. Benchmarking

Record:

- comparisons;
- array accesses;
- iterations;
- execution time;
- dataset size;
- target position;
- cache-sensitive workload characteristics where measurable.

Do not claim practical benefit without workload-specific measurement.

## 36. Common Mistakes

1. Using Fibonacci search on unsorted data.
2. Mishandling Fibonacci offsets after eliminating a region.
3. Returning an out-of-range index.
4. Confusing Fibonacci search with exponential search.
5. Ignoring duplicate boundary semantics.
6. Assuming logarithmic complexity implies faster real-world execution.
7. Ignoring access cost and cache behavior.
8. Using a Fibonacci table unnecessarily.
9. Forgetting descending-order comparison changes.
10. Applying one search strategy without examining the data/access model.

## 37. Edge Cases

Test:

- empty array;
- singleton;
- two elements;
- target at first position;
- target at last position;
- absent target below minimum;
- absent target above maximum;
- duplicate values;
- all equal values;
- descending arrays;
- very large arrays within the supported index domain.

## 38. Implementation Lab

Implement:

1. Fibonacci exact search;
2. lower-bound Fibonacci search;
3. upper-bound Fibonacci search;
4. descending variant;
5. comparator-based variant;
6. binary-search reference;
7. linear reference;
8. randomized differential tests;
9. comparison/access counters;
10. benchmark against binary and jump search.

## 39. Interview Questions

1. What is Fibonacci search?
2. Why is its complexity `O(log n)`?
3. How does it differ from binary search?
4. Why do Fibonacci numbers provide logarithmic interval reduction?
5. How does it handle duplicates?
6. Can it implement lower bound?
7. How does descending order change the algorithm?
8. How does it differ from exponential search?
9. What access-model considerations matter in practice?
10. Why should asymptotic complexity not be treated as a practical performance guarantee?

## 40. Revision Checklist

- [ ] I can explain Fibonacci search from first principles.
- [ ] I can derive its partition positions.
- [ ] I understand why the complexity is logarithmic.
- [ ] I can maintain the candidate interval invariant.
- [ ] I can distinguish it from exponential search.
- [ ] I can adapt it to lower/upper bounds.
- [ ] I can handle descending data.
- [ ] I can reason about access and cache costs.
- [ ] I can compare it experimentally with binary search.
- [ ] I know when the problem structure does not justify using it.

## 41. Key Takeaways

1. **Fibonacci search is an alternative logarithmic search strategy for sorted indexed data.**
2. **It partitions using Fibonacci offsets rather than the exact midpoint.**
3. **Its asymptotic complexity is `O(log n)`.**
4. **Its practical behavior depends on the access and hardware cost model.**
5. **It can be adapted to boundary semantics, descending order, and comparator-defined records.**
6. **It does not require the value-distribution assumptions of interpolation search.**
7. **It solves a known-bound ordered-search problem, unlike exponential search's boundary-discovery role.**
8. **Benchmarking is necessary before attributing practical performance advantages.**
9. **The deeper lesson is that multiple logarithmic search strategies can exist, and algorithm selection must consider assumptions and cost models.**
