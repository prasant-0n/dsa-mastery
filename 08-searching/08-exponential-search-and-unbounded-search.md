# 08.08 — Exponential Search & Unbounded Search

## 1. Concept Definition

Exponential search is a technique for searching a sorted sequence when the useful search range is not known in advance or may be much larger than the initial region of interest.

It first expands a boundary exponentially:

```text
1 → 2 → 4 → 8 → 16 → 32 → ...
```

Once the target is bracketed, ordinary binary search is applied to the discovered interval.

## 2. Core Pattern

```text
unknown range
     ↓
probe 1
     ↓
probe 2
     ↓
probe 4
     ↓
probe 8
     ↓
found a containing interval
     ↓
binary search
```

The technique combines **geometric range discovery** with **binary search**.

## 3. Why It Exists

Ordinary binary search assumes that valid boundaries are already known.

Exponential search is useful when:

- the array is conceptually unbounded;
- the target is near the beginning of a sorted sequence;
- a stream-like or external interface exposes indexed access without an explicit useful upper bound;
- the search interval must be discovered dynamically.

## 4. Preconditions

For ordinary exact exponential search, the underlying sequence must be ordered according to the search comparator.

The search interface must also support some form of indexed/probe access or an equivalent operation.

If accessing an index is expensive, the access cost must be included in the model.

## 5. Mental Model

Suppose:

```text
A = [2, 4, 7, 11, 18, 25, 31, 40, 55, ...]
T = 25
```

Instead of assuming the answer lies inside a predefined `[0, n - 1]`, probe progressively farther positions.

Once a probe exceeds the target, the target is bracketed.

## 6. Bracketing Phase

A standard progression is:

```text
bound = 1
while A[bound] < target:
    bound *= 2
```

The previous bound and current bound define a candidate interval.

Conceptually:

```text
[previousBound, currentBound]
```

contains the target if the target exists and the sequence satisfies the expected ordering.

## 7. Binary-Search Phase

After bracketing:

```text
left  = previousBound
right = currentBound
```

perform ordinary binary search, usually clipped to the actual sequence length when the length is known.

## 8. Complexity

If the target is at position `p`, the exponential phase takes:

```text
O(log p)
```

probes.

The subsequent binary search also operates over an interval of size `O(p)` and therefore costs:

```text
O(log p)
```

Total:

```text
O(log p)
```

for constant-cost indexed access.

## 9. Why the Complexity Depends on Position

If the target is near the beginning, exponential search can avoid searching a huge irrelevant suffix.

For a target at position `p`, only a logarithmic number of expanding probes is needed before the target's region is known.

This is especially meaningful when the conceptual sequence is much larger than the prefix containing the answer.

## 10. Known-Length Arrays

If `n` is known, the current exponential bound should be clipped:

```text
right = Math.min(bound, n - 1)
```

This prevents probing outside the valid array range.

The implementation must still handle a target that is absent and larger than every element.

## 11. Unbounded Search

An unbounded-search abstraction behaves as though the sequence has no known finite upper boundary.

The API may expose a sentinel when an index is outside the available range.

Example contract:

```text
valueAt(i)
→ value if available
→ sentinel if beyond the sequence
```

The sentinel semantics must be compatible with the ordering model.

## 12. Sentinel Design

A dangerous design is using a sentinel that can also be a legitimate data value.

Better options include:

- explicit `undefined`/absence result;
- tagged result objects;
- an API-specific end-of-sequence marker;
- a separate availability operation.

The search algorithm must distinguish:

```text
missing index
```

from:

```text
real value
```

## 13. Unknown-Length Sequence

If the sequence length is unknown, probing beyond the logical end must be safe.

A conceptual interface is:

```js
valueAt(index)
```

where an out-of-range access is represented explicitly.

The algorithm can then increase its bound until either:

```text
target found
```

or:

```text
value >= target
```

or:

```text
end of sequence
```

## 14. Duplicate Values

Duplicates affect occurrence semantics but do not necessarily prevent exponential search.

For exact search:

```text
return any matching index
```

may be sufficient.

For first occurrence, the bracketed interval can be followed by a lower-bound search.

For last occurrence, use an upper-bound-style search.

## 15. Lower Bound with Exponential Search

To find:

```text
first index where A[i] >= target
```

first discover a range containing the transition, then apply lower-bound logic inside that range.

The two stages are conceptually independent:

```text
range discovery
+
boundary search
```

## 16. Upper Bound with Exponential Search

Similarly:

```text
first index where A[i] > target
```

can be found by exponential bracketing followed by upper-bound search.

The exact predicate must remain consistent through both phases.

## 17. Early Targets

One reason exponential search can be useful is that it quickly detects targets near the beginning.

For example, a target at index `0` or `1` requires very little range expansion.

This can matter when a workload has strongly front-loaded query positions.

## 18. Target Beyond All Known Values

For a finite array:

```text
A = [1, 3, 5, 7]
T = 100
```

exponential growth reaches or exceeds the array boundary.

The implementation must then conclude that the target is absent rather than probing indefinitely.

## 19. Empty Sequence

For:

```text
[]
```

there is no valid probe.

Return the documented not-found result immediately.

## 20. Singleton Sequence

For:

```text
[7]
```

both cases must be tested:

```text
T = 7
T != 7
```

This catches incorrect initial bounds and termination conditions.

## 21. Overflow in Bound Growth

In fixed-width integer environments:

```text
bound *= 2
```

can overflow.

Even though JavaScript uses `Number`, very large indices can exceed safe integer precision.

Robust implementations should define the supported index range and guard growth accordingly.

## 22. Access Cost Model

Do not automatically treat `valueAt(i)` as `O(1)`.

If the abstraction represents:

- a database lookup;
- remote storage;
- network access;
- disk-backed data;
- a decompression operation;

then probe cost may dominate the algorithm.

The real model becomes:

```text
number of probes × cost per probe
```

## 23. External-Memory Considerations

For disk or remote storage, logarithmic logical probes do not automatically imply low latency.

Each random access may cause:

```text
I/O
network round trip
cache miss
storage lookup
```

In such systems, B-tree-like indexes and locality-aware structures may be more appropriate.

Exponential search is primarily a conceptual range-discovery technique unless the storage layer specifically benefits from it.

## 24. Cache Behavior

For in-memory arrays, exponential probing jumps across increasingly distant positions.

Binary search itself may also have weaker sequential locality than linear scanning.

Therefore practical performance for small arrays may favor a simpler linear scan despite asymptotic differences.

Benchmark under realistic workloads.

## 25. Hybrid Search

A practical implementation may combine:

```text
small prefix linear scan
→ exponential expansion
→ binary search
```

This can reduce overhead for very small targets or arrays.

Any hybrid threshold should be measured rather than assumed universally optimal.

## 26. Exponential Search vs Binary Search

### Binary search
Requires a known search interval.

```text
O(log n)
```

### Exponential search
Discovers an interval first.

```text
O(log p)
```

where `p` is related to the target's position.

The methods solve slightly different range-knowledge problems.

## 27. Exponential Search vs Linear Search

Linear search:

```text
O(p)
```

for a target around position `p`.

Exponential + binary search:

```text
O(log p)
```

under constant-cost indexed access and sorted ordering.

However, for tiny `p`, constant factors can make linear search competitive.

## 28. Correctness: Bracketing

A bracketing proof should establish:

> After expansion terminates, the target, if present, lies between the previous and current bounds.

If:

```text
A[bound] >= target
```

and the previous bound was known to contain a value `< target`, the transition has been bracketed.

Boundary and end-of-sequence cases require separate handling.

## 29. Correctness: Binary Phase

Once a valid containing interval is established, ordinary binary-search correctness applies.

Therefore the overall proof can be decomposed:

```text
proof of bracketing
+
proof of binary search
=
proof of exponential search
```

This decomposition simplifies reasoning.

## 30. Monotonic Predicate Version

Exponential expansion does not require a numeric target specifically.

It can locate a transition in an unknown-length monotonic predicate:

```text
false false false true true true ...
```

Probe positions:

```text
1, 2, 4, 8, ...
```

until a true result is observed, then boundary-search the discovered interval.

## 31. Search-on-Answer Connection

The same pattern appears when the answer range is not initially tightly known.

One can sometimes:

```text
exponentially expand answer bound
→ discover a feasible region
→ binary-search the boundary
```

This is useful when a safe upper bound is difficult to derive but feasibility becomes monotonic.

## 32. Backend Applications

Potential applications include:

- searching ordered in-memory event logs;
- locating a threshold in a growing sequence;
- probing partition boundaries;
- finding the first matching timestamp in an indexed logical sequence;
- adaptive range discovery.

For databases and distributed storage, the physical access model must be considered before using random probing.

## 33. AI Applications

Potential uses include:

- locating thresholds in sorted score streams;
- finding boundaries in ordered candidate lists;
- adaptive search over monotonic resource parameters;
- probing progressively larger candidate windows.

The technique is most useful when ordering/monotonicity and efficient random access are both available.

## 34. Testing Strategy

Test:

- empty sequence;
- singleton;
- target at index `0`;
- target at index `1`;
- target near the beginning;
- target near a power-of-two boundary;
- target exactly at a probe boundary;
- target between probe boundaries;
- target beyond all values;
- duplicate values;
- unknown-length sequence;
- out-of-range sentinel behavior.

## 35. Differential Testing

Compare:

```text
exponentialSearch
vs
linear reference
```

for small generated sorted arrays.

For lower/upper-bound variants, compare against a linear boundary reference rather than only exact-match behavior.

## 36. Benchmarking

Measure separately:

1. range-discovery probes;
2. binary-search comparisons;
3. total indexed accesses;
4. wall-clock latency;
5. cache/I/O behavior when relevant.

Do not infer production performance solely from asymptotic complexity.

## 37. Common Mistakes

1. Using exponential search on unsorted data.
2. Forgetting to clip the bound to a known array length.
3. Treating an unknown-length sentinel as a normal value.
4. Using an ambiguous sentinel that can be a real value.
5. Forgetting empty/singleton cases.
6. Overflowing the bound-growth calculation.
7. Ignoring index-access cost.
8. Mixing range discovery with incorrect boundary semantics.
9. Assuming exponential search is always faster than linear search.
10. Claiming `O(log n)` without defining the relevant position/range model.

## 38. Implementation Lab

Implement:

1. exponential exact search on a known-length sorted array;
2. exponential search through an unknown-length accessor;
3. exponential lower bound;
4. exponential upper bound;
5. first occurrence;
6. last occurrence;
7. monotonic predicate boundary search;
8. exponential answer-bound discovery.

For each implementation document the access contract.

## 39. Interview Questions

1. What problem does exponential search solve that ordinary binary search does not?
2. Why does the bound grow exponentially?
3. Why is the complexity `O(log p)`?
4. How do you handle a known finite array?
5. How do you handle an unbounded sequence?
6. What makes a sentinel safe or unsafe?
7. How do duplicates affect first/last occurrence?
8. Can exponential search work on a monotonic predicate?
9. What happens when indexed access is not `O(1)`?
10. How can exponential search help discover an answer bound?

## 40. Revision Checklist

- [ ] I can explain why exponential range discovery exists.
- [ ] I can derive the `1, 2, 4, 8, ...` probing sequence.
- [ ] I can prove the target becomes bracketed.
- [ ] I can combine bracketing with binary search.
- [ ] I understand `O(log p)` complexity.
- [ ] I can handle known and unknown sequence lengths.
- [ ] I can design safe end-of-sequence semantics.
- [ ] I can derive lower/upper-bound variants.
- [ ] I understand access-cost implications.
- [ ] I can apply exponential discovery to monotonic predicates.
- [ ] I can test boundary and sentinel cases.
- [ ] I can compare exponential, binary, and linear search under a realistic workload.

## 41. Key Takeaways

1. **Exponential search discovers a useful search interval before applying binary search.**
2. **Geometric expansion reaches a position near the target using logarithmically many probes.**
3. **For a target around position `p`, the indexed-access model gives `O(log p)` search work.**
4. **Unknown-length sequences require explicit and safe end-of-sequence semantics.**
5. **Lower/upper bounds can be applied after exponential bracketing.**
6. **The same pattern works for monotonic predicates, not only exact values.**
7. **Probe cost, cache behavior, I/O, and network latency can dominate theoretical complexity.**
8. **Correctness is naturally decomposed into bracketing correctness plus binary-search correctness.**
9. **Hybrid linear/exponential strategies may be useful, but thresholds should be benchmarked.**
10. **The transferable skill is discovering an unknown boundary geometrically and then exploiting monotonicity locally.**
