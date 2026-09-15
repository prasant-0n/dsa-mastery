# 08.19 — Jump Search & Block-Based Search Strategies

## 1. Concept Definition

Jump search is an ordered-array search technique that moves through the data in blocks and then performs a local linear scan inside the candidate block.

For a block size `b`:

```text
jump → jump → jump → ... → local scan
```

The classic choice is approximately:

```text
b = sqrt(n)
```

## 2. Why It Matters

Jump search demonstrates a useful middle ground between:

- linear search, which examines every element;
- binary search, which repeatedly halves the interval.

It teaches explicit control over the trade-off between coarse navigation and fine-grained local scanning.

## 3. Mental Model

Imagine a sorted array divided into blocks:

```text
[0 ... b-1] [b ... 2b-1] [2b ... 3b-1] ...
```

First identify the block that could contain the target, then scan only that block.

## 4. Preconditions

Classic jump search assumes:

- sorted data;
- indexed access;
- a meaningful ordering relation;
- finite data.

Without sortedness, the block-elimination step is invalid.

## 5. Candidate-Block Invariant

During the jump phase:

> If the target exists, it remains inside the block selected for the local scan.

A jump is safe only when the ordering proves that every skipped element cannot satisfy the target query.

## 6. Basic Algorithm

For ascending data:

1. choose block size `b`;
2. inspect the block boundary;
3. jump while the boundary remains below the target;
4. stop at the first block whose range may contain the target;
5. linearly scan that block.

## 7. Complexity Derivation

With block size `b`:

```text
number of jumps ≈ n / b
local scan ≤ b
```

Therefore:

```text
T(n, b) = O(n / b + b)
```

## 8. Choosing Block Size

Minimize the simplified cost:

```text
n / b + b
```

The balance occurs near:

```text
b = sqrt(n)
```

producing:

```text
O(sqrt(n))
```

under the standard unit-cost model.

## 9. Why the Square Root Appears

If the block is too small:

```text
many jumps
```

If the block is too large:

```text
large local scan
```

The square-root choice balances the two costs.

## 10. Block Size Is a Policy

The mathematically convenient choice is not always optimal in production.

A real system may have:

- expensive random access;
- cheap sequential scans;
- cache lines;
- storage pages;
- remote blocks;
- variable record sizes.

Therefore expose block size as a policy when the access model justifies it.

## 11. Perfect vs Partial Final Blocks

`n` does not need to be divisible by `b`.

The final block may contain fewer than `b` elements.

Correct implementations must clamp the final boundary to `n - 1`.

## 12. Boundary Search

Jump search can support lower and upper bounds by changing the local scan contract.

For lower bound:

```text
first index with A[i] >= target
```

For upper bound:

```text
first index with A[i] > target
```

The block discovery phase remains based on monotone ordering.

## 13. Duplicates

Duplicates do not invalidate block selection, but they matter for occurrence semantics.

A local scan must continue far enough to find:

- first occurrence;
- last occurrence;
- all occurrences in a range.

## 14. First Occurrence

If the target appears near the beginning of a block, return immediately only if no earlier block can contain the target.

A robust lower-bound formulation makes this easier to reason about.

## 15. Last Occurrence

For last occurrence, a successful match does not terminate the search automatically.

The algorithm must establish whether later elements or blocks can contain another equal value.

## 16. Descending Arrays

For descending data, boundary comparisons reverse.

The block-search structure stays the same:

```text
coarse block discovery → local scan
```

but the monotone direction changes.

## 17. Comparator-Based Search

For records, define:

```text
compare(record, target)
```

or use a key selector followed by a comparator.

The comparator must match the sorted order of the blocks.

## 18. Jump Search vs Binary Search

Binary search has:

```text
O(log n)
```

worst-case comparisons.

Jump search has:

```text
O(sqrt(n))
```

with the classic block-size choice.

The methods should therefore not be treated as asymptotically equivalent.

However, actual access costs can alter practical trade-offs.

## 19. Jump Search vs Linear Search

Linear search:

```text
O(n)
```

Jump search:

```text
O(sqrt(n))
```

under its standard assumptions.

Jump search gains efficiency by using ordering to skip blocks.

## 20. Jump Search vs Fibonacci Search

Both are ordered searches, but they use different partition models.

Jump search explicitly trades:

```text
coarse jumps + local scan
```

while Fibonacci search repeatedly shrinks the candidate interval through Fibonacci offsets.

## 21. Jump Search vs Interpolation Search

Interpolation search uses numeric value estimates.

Jump search requires only ordering and a block policy.

Therefore jump search is less dependent on numeric distribution assumptions.

## 22. Cache and Sequential Access

The local scan is sequential within a block, which can be useful when sequential access is substantially cheaper than arbitrary probing.

However, the jump phase still performs indexed accesses.

Benchmark the actual memory hierarchy or storage system before drawing performance conclusions.

## 23. External-Memory Interpretation

A block can conceptually correspond to a storage page.

In that model, the cost of a jump may represent an I/O operation while the local scan may occur inside an already-loaded page.

The classical `sqrt(n)` result assumes a simpler unit-cost model and may not be optimal for page-based systems.

## 24. Remote Data

If each jump triggers a network request, minimizing jumps can be more important than minimizing CPU comparisons.

Possible engineering adaptations include:

- larger blocks;
- server-side filtering;
- cached block metadata;
- batched reads;
- pagination tokens.

## 25. Backend Applications

Block-based searching can be useful for:

- sorted in-memory data;
- page-oriented indexes;
- ordered logs;
- time-series ranges;
- local caches.

For database tables, the storage engine's own index structures should generally be preferred over scanning application-level blocks.

## 26. AI Applications

Potential applications include:

- sorted candidate score arrays;
- threshold lookup;
- ordered metadata tables;
- local lookup tables for inference preprocessing.

For high-dimensional vector retrieval, this is generally not the appropriate abstraction.

## 27. Correctness Proof

### Initialization
The complete array is the candidate domain.

### Jump Maintenance
Each skipped block contains values proven unable to contain the target.

### Stopping Condition
The selected block is the first block whose boundary does not rule it out.

### Local Search
The linear scan checks every remaining candidate position in the block.

### Postcondition
If the target exists, the algorithm finds it; otherwise every candidate block has been eliminated or scanned.

## 28. Termination

The jump index strictly advances until:

- a candidate block is found;
- the end of the array is reached.

The local scan advances monotonically through a finite block.

Therefore the algorithm terminates.

## 29. Complexity with Arbitrary Block Size

For block size `b`:

```text
Time = O(n / b + b)
```

For `b = sqrt(n)`:

```text
O(sqrt(n))
```

Auxiliary space:

```text
O(1)
```

for an iterative implementation.

## 30. Access-Weighted Cost Model

If a jump costs `Cj` and a local element scan costs `Cs`, model:

```text
Cost(b) ≈ (n / b) * Cj + b * Cs
```

The optimal block size then depends on the ratio:

```text
Cj / Cs
```

not just on `n`.

This is a key algorithm-engineering extension of the square-root analysis.

## 31. Adaptive Block Size

A production system can choose block size using:

- observed access latency;
- cache behavior;
- page size;
- record density;
- query distribution.

If workload characteristics change, a fixed theoretically derived block size may become suboptimal.

## 32. Common Mistakes

1. Forgetting the sortedness requirement.
2. Choosing `sqrt(n)` without understanding the cost model.
3. Overshooting the final block boundary.
4. Searching the wrong block after a jump.
5. Mishandling duplicates.
6. Returning the first match when last occurrence is required.
7. Claiming `O(sqrt(n))` while using an inappropriate block policy without stating assumptions.
8. Ignoring remote/storage access costs.
9. Confusing jump search with exponential search.
10. Using application-level jump search where a storage engine already provides indexed lookup.

## 33. Edge Cases

Test:

- empty array;
- singleton;
- smaller than block size;
- exactly divisible by block size;
- partial final block;
- target at block boundary;
- target just before/after boundary;
- absent target;
- duplicates across blocks;
- all equal values;
- descending data.

## 34. Testing Strategy

Generate sorted arrays with varying:

- sizes;
- block sizes;
- target positions;
- duplicate distributions.

Compare every result with a linear reference.

## 35. Differential Testing

Verify:

```text
jump search == linear reference
```

for exact search.

For boundary operations:

```text
jump lower/upper bound == linear boundary reference
```

Record block and local-scan decisions for debugging invariant failures.

## 36. Benchmarking

Measure separately:

- number of jumps;
- local comparisons;
- total accesses;
- block size;
- runtime;
- cache or I/O behavior when measurable.

Compare several block sizes instead of assuming `sqrt(n)` is optimal for every workload.

## 37. Implementation Lab

Implement:

1. classic jump search;
2. configurable block size;
3. lower bound;
4. upper bound;
5. first occurrence;
6. last occurrence;
7. descending search;
8. comparator-based search;
9. access-weighted benchmark;
10. adaptive block-size experiment.

## 38. Interview Questions

1. What is jump search?
2. Why is the classic complexity `O(sqrt(n))`?
3. How is `sqrt(n)` derived?
4. What happens if the block size is too small?
5. What happens if it is too large?
6. How would you support duplicates?
7. How would you implement lower bound?
8. How does descending order change the comparisons?
9. How does storage-page cost alter block-size selection?
10. How does jump search differ from exponential search?

## 39. Revision Checklist

- [ ] I can derive `O(n / b + b)`.
- [ ] I can derive the `sqrt(n)` heuristic.
- [ ] I can explain the candidate-block invariant.
- [ ] I can handle partial final blocks.
- [ ] I can implement configurable block sizes.
- [ ] I can adapt the search to lower/upper bounds.
- [ ] I understand duplicate occurrence semantics.
- [ ] I can model access-weighted block cost.
- [ ] I can compare jump search with binary search.
- [ ] I can benchmark rather than assume an optimal block size.

## 40. Key Takeaways

1. **Jump search combines coarse block jumps with a local linear scan.**
2. **Its general cost is `O(n / b + b)`.**
3. **The classical `sqrt(n)` block size balances jumps and local scanning under a simple unit-cost model.**
4. **Real systems may require a different block size because access costs are not uniform.**
5. **Duplicates require explicit occurrence semantics.**
6. **The method works with ascending, descending, and comparator-defined ordered data.**
7. **Block-based reasoning connects naturally to cache lines, pages, and remote access models.**
8. **The deeper lesson is to expose partition granularity as a cost-model decision rather than treating `sqrt(n)` as a universal constant.**
