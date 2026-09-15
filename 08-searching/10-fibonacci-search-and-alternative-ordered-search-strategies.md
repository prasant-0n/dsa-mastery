# 08.10 — Fibonacci Search & Alternative Ordered Search Strategies

## 1. Concept Definition

Fibonacci search is an ordered-search technique that uses Fibonacci numbers to choose probe positions instead of the midpoint used by binary search.

Binary search repeatedly divides the interval approximately in half.

Fibonacci search uses a sequence:

```text
1, 1, 2, 3, 5, 8, 13, 21, ...
```

to partition the remaining search interval.

The important lesson is not memorizing Fibonacci arithmetic. It is understanding that **different interval-partition strategies can preserve logarithmic search behavior while changing access patterns and implementation trade-offs**.

## 2. Why It Exists

Fibonacci search was historically useful when comparison costs and memory-access characteristics made certain partition patterns attractive.

Modern general-purpose systems usually have excellent binary-search implementations and hardware characteristics that reduce the practical need for Fibonacci search.

Nevertheless, it is valuable for understanding:

- ordered search;
- alternative interval reduction;
- comparison counting;
- access patterns;
- search invariants;
- algorithm engineering.

## 3. Mental Model

Instead of asking:

```text
What is the midpoint?
```

Fibonacci search asks:

```text
What Fibonacci-sized partition should I probe next?
```

The search interval is represented using Fibonacci offsets.

## 4. Fibonacci Numbers

Define:

```text
F(0) = 0
F(1) = 1
F(k) = F(k - 1) + F(k - 2)
```

A Fibonacci search chooses the smallest Fibonacci number large enough to cover the search interval and progressively reduces that number as the interval shrinks.

## 5. Search Preconditions

Standard Fibonacci search requires:

1. sorted data;
2. indexed access;
3. a defined comparison relation;
4. a finite search interval.

As with binary search, correctness comes from the sorted-order contract.

## 6. Core Structure

Conceptually:

```text
find Fibonacci number >= n
        ↓
choose offset
        ↓
compare target with probe
        ↓
retain left/right Fibonacci-sized region
        ↓
reduce Fibonacci state
        ↓
repeat
```

## 7. Complexity

Fibonacci numbers grow exponentially:

```text
F(k) ≈ φ^k / √5
```

where:

```text
φ = (1 + √5) / 2
```

Therefore:

```text
k = O(log n)
```

and Fibonacci search has:

```text
Time → O(log n)
Auxiliary space → O(1)
```

for the standard iterative form.

## 8. Binary Search Comparison

| Property | Binary Search | Fibonacci Search |
|---|---|---|
| Ordering required | Yes | Yes |
| Search complexity | O(log n) | O(log n) |
| Partition rule | midpoint | Fibonacci offsets |
| Typical implementation | simpler | more specialized |
| Random indexed array | excellent baseline | usually unnecessary |
| Historical motivation | broad | access/comparison trade-offs |

The table describes structural differences, not a universal performance ranking.

## 9. Why Fibonacci Search Is Logarithmic

Each step reduces the active interval according to consecutive Fibonacci numbers.

Because Fibonacci numbers increase exponentially with their index, only logarithmically many Fibonacci states are needed to cover `n` elements.

The exact recurrence is less important than understanding the exponential growth that produces logarithmic search depth.

## 10. Probe Position

A typical probe is derived from the current Fibonacci offset:

```text
probe = min(offset + F(k - 2), n - 1)
```

The exact variables depend on the implementation convention.

Do not memorize a formula without defining what each Fibonacci state represents.

## 11. Search Invariant

A useful invariant is:

> If the target exists, it remains within the active ordered interval represented by the current Fibonacci state.

Every update must preserve that statement.

## 12. Left-Side Elimination

If:

```text
A[probe] < target
```

then all positions at or before `probe` can be discarded under ascending sorted-order semantics.

The Fibonacci state is reduced to represent the remaining right region.

## 13. Right-Side Elimination

If:

```text
A[probe] > target
```

then positions after `probe` can be discarded.

The Fibonacci state changes to represent the remaining left region.

## 14. Equality

If:

```text
A[probe] === target
```

an exact-search API can return the probe index.

For first/last occurrence semantics, equality is not necessarily the final answer.

Boundary searching still needs explicit treatment.

## 15. Duplicates

Duplicates do not invalidate ordinary exact search if the data remains sorted.

However, they make occurrence semantics important:

- any occurrence;
- first occurrence;
- last occurrence;
- count of occurrences.

Fibonacci search by itself does not automatically provide lower-bound or upper-bound behavior.

## 16. Lower Bound

A lower bound asks for:

```text
first index with A[i] >= target
```

A Fibonacci-based implementation can be constructed, but the invariant must be redesigned around a boundary rather than equality.

In many applications, ordinary binary lower bound is simpler.

## 17. Upper Bound

An upper bound asks for:

```text
first index with A[i] > target
```

Again, the search objective is a boundary, not a direct equality match.

## 18. Descending Data

For descending arrays, comparison directions reverse.

The Fibonacci partition mechanism itself does not fundamentally depend on ascending values; the comparison predicate does.

## 19. Comparator-Based Search

A generalized API should separate ordering from search mechanics:

```text
compare(a, b)
```

This permits searching:

- numbers;
- strings;
- objects by key;
- version values;
- domain-specific ordered records.

## 20. Numeric vs Comparator Search

Interpolation search requires numeric interpolation.

Fibonacci search does not.

This makes Fibonacci search applicable to arbitrary ordered keys, provided indexed access and a comparator exist.

## 21. Memory Access Considerations

The practical performance of ordered search depends on more than comparison count.

Consider:

- cache locality;
- branch prediction;
- memory latency;
- random access cost;
- data representation;
- comparator cost.

The asymptotic complexity does not capture all these factors.

## 22. Cache Behavior

Binary search can perform non-sequential accesses across a large array.

Fibonacci search also performs non-sequential probes.

Whether one access pattern is preferable depends on the hardware, data size, implementation, and workload.

Benchmark rather than assuming a universal cache advantage.

## 23. Comparison Cost

If comparisons are expensive, reducing the number of comparisons may matter.

Examples:

```text
long strings
complex object keys
locale-sensitive comparisons
multi-field records
```

The total cost should be modeled as:

```text
number of comparisons × comparison cost
+
index/access cost
```

## 24. Search on Expensive Keys

A comparator may involve normalization or multiple fields.

Precomputing comparable keys can change the cost model:

```text
raw object comparison
vs
precomputed scalar key comparison
```

This is an algorithm-engineering decision rather than a property unique to Fibonacci search.

## 25. Unbounded Search

Fibonacci search can be combined with range discovery when the array length or valid search range is not immediately known.

Conceptually:

```text
discover range
→ establish Fibonacci coverage
→ search
```

However, if exponential range discovery is already being used, binary search is often the simpler second-stage search.

## 26. Fibonacci vs Exponential Search

These solve different primary problems:

**Exponential search:** discover a useful bounded range in an ordered sequence whose extent is unknown or large.

**Fibonacci search:** search a known finite ordered interval using Fibonacci partitioning.

They can be composed, but they should not be conflated.

## 27. Alternative Ordered Search Strategies

The broader family includes:

- binary search;
- Fibonacci search;
- interpolation search;
- exponential search;
- jump search;
- ternary search under appropriate unimodal assumptions;
- learned position prediction with verified correction.

Each depends on different structural assumptions.

## 28. Jump Search

Jump search divides the array into blocks and jumps by a chosen step before performing local linear search.

With an appropriate block size, its classic complexity is:

```text
O(√n)
```

It is conceptually simpler but asymptotically different from logarithmic search.

## 29. Ternary Search

Ternary search divides a search interval into three parts.

It is appropriate for certain unimodal optimization problems, especially when the objective is not a discrete exact lookup.

For ordinary sorted-array exact search, binary search generally provides a more direct formulation.

## 30. Choosing the Strategy

A useful decision framework is:

```text
sorted + arbitrary ordered keys
    → binary/Fibonacci family

sorted + approximately uniform numeric keys
    → interpolation may be considered

unknown range
    → exponential range discovery

unimodal objective
    → peak/ternary/answer-search reasoning
```

The structure of the data and objective determines the valid family.

## 31. Production Baseline

For most in-memory sorted-array workloads, start with a well-tested binary-search implementation.

Consider an alternative only when there is a concrete reason such as:

- unusual access model;
- specialized comparator costs;
- measurable workload characteristics;
- compatibility with an existing data structure;
- educational or research requirements.

## 32. Correctness Proof

### Initialization
The active Fibonacci interval covers the entire possible target region.

### Maintenance
Each comparison eliminates only positions that cannot contain the target under sorted-order semantics.

### Progress
The Fibonacci state decreases and the active interval shrinks.

### Termination
The Fibonacci state reaches its terminal configuration and remaining candidate positions are checked according to the contract.

### Postcondition
A returned index satisfies the target condition; otherwise the target is absent from the searched interval.

## 33. Termination Details

Fibonacci implementations can be error-prone around the final few states.

Explicitly reason about:

- `F(k) == 1`;
- one remaining candidate;
- offset boundaries;
- `probe` clamping;
- final equality checks.

Do not rely on accidental loop behavior.

## 34. Common Mistakes

1. Incorrect Fibonacci initialization.
2. Using the wrong Fibonacci offset for the probe.
3. Failing to clamp the probe.
4. Losing a candidate during interval updates.
5. Mishandling the final candidate.
6. Assuming Fibonacci search is automatically faster than binary search.
7. Confusing Fibonacci search with exponential search.
8. Ignoring comparator cost.
9. Implementing lower/upper bounds as exact search.
10. Forgetting duplicate and occurrence semantics.

## 35. Edge Cases

Test:

- empty array;
- singleton;
- two elements;
- Fibonacci-sized arrays;
- non-Fibonacci sizes;
- target at first position;
- target at last position;
- target absent;
- duplicates;
- all equal values;
- descending order;
- custom comparator.

## 36. Backend Applications

Potential applications include:

- ordered in-memory indexes;
- version lookup;
- timestamped records;
- sorted configuration snapshots;
- specialized lookup structures.

In most production backend code, the primary value is understanding the search abstraction and its trade-offs rather than replacing standard binary search without evidence.

## 37. AI Applications

Alternative ordered-search reasoning can appear in:

- sorted metadata lookup;
- ordered candidate thresholds;
- model-version selection;
- ranked configuration tables;
- structured retrieval indexes.

For large retrieval systems, specialized indexes often dominate simple array search.

## 38. Testing Strategy

Build a linear reference implementation and test:

```text
all array lengths in a small range
all target positions
absent targets
duplicates
custom comparators
```

Compare exact results under the documented contract.

## 39. Benchmarking

Compare binary and Fibonacci search using:

- random targets;
- boundary targets;
- absent targets;
- expensive comparators;
- small arrays;
- cache-resident arrays;
- large arrays.

Record comparisons and wall-clock time separately.

A benchmark should report workload characteristics and environment details.

## 40. Interview Questions

1. What is Fibonacci search?
2. Why is it `O(log n)`?
3. How does its partition strategy differ from binary search?
4. What is the role of Fibonacci numbers?
5. How do you maintain the search invariant?
6. How do duplicates affect occurrence semantics?
7. Can Fibonacci search handle custom comparators?
8. How is it different from exponential search?
9. When would you benchmark it against binary search?
10. What are the practical trade-offs of using a less common search algorithm?

## 41. Revision Checklist

- [ ] I can explain Fibonacci search without memorizing code.
- [ ] I understand the Fibonacci-number growth argument.
- [ ] I can derive the probe from the current Fibonacci state.
- [ ] I can maintain the candidate-preservation invariant.
- [ ] I can handle final-state edge cases.
- [ ] I understand exact-search vs boundary-search semantics.
- [ ] I can compare Fibonacci and binary search.
- [ ] I can distinguish Fibonacci search from exponential search.
- [ ] I understand comparator and access costs.
- [ ] I can benchmark alternative search strategies correctly.
- [ ] I know why binary search is often the baseline in production.

## 42. Key Takeaways

1. **Fibonacci search is an `O(log n)` ordered-search algorithm based on Fibonacci partitioning.**
2. **Its core correctness principle is the same as binary search: eliminate only regions proven unable to contain the target.**
3. **Fibonacci numbers grow exponentially, producing logarithmic search depth.**
4. **Its practical value depends on the access model, comparison cost, workload, and implementation.**
5. **It does not require numeric keys, unlike interpolation search.**
6. **Fibonacci search and exponential search solve different search-space problems.**
7. **Lower/upper-bound behavior requires boundary-specific invariants.**
8. **Alternative search algorithms should be selected from explicit structural assumptions and measured requirements.**
9. **For ordinary in-memory sorted arrays, a well-tested binary search remains an important baseline.**
10. **Expert search engineering means understanding the family of strategies, their assumptions, and their complete cost model—not merely memorizing one implementation.**
