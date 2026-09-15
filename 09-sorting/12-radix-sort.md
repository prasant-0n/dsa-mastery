# 09.12 — Radix Sort

## 1. Definition

Radix Sort is a non-comparison sorting family that orders keys by processing their digits, characters, or fixed-width components one position at a time.

Two major strategies are:

- **LSD (Least Significant Digit first)** — process from the least significant position toward the most significant;
- **MSD (Most Significant Digit first)** — partition by the most significant position and recursively refine groups.

## 2. Why It Matters

Radix Sort shows how structured keys can be sorted without pairwise comparisons.

It connects:

- Counting Sort;
- stable distribution;
- digit representations;
- bucketization;
- fixed-width keys;
- string sorting;
- multi-pass algorithms;
- memory/performance trade-offs.

## 3. Key Model

Assume a key can be represented as `d` digits in a base `b`.

Examples:

```text
decimal integers → base 10
binary integers  → base 2
bytes             → base 256
```

The choice of representation directly affects the number of passes and auxiliary structures.

## 4. LSD Mental Model

For LSD Radix Sort:

```text
least significant digit
→ next digit
→ ...
→ most significant digit
```

Each pass must be **stable** so that ordering established by less significant positions is preserved while processing more significant positions.

## 5. Why Stability Is Essential

Suppose two records currently have equal digits at the current position.

Their existing relative order contains information from previously processed digits.

If the current pass rearranges equal-digit records arbitrarily, that previous ordering can be destroyed.

Therefore stable digit sorting is a correctness requirement for standard LSD Radix Sort.

## 6. LSD Algorithm

A simplified LSD process is:

```text
for position = 0 ... maxDigits - 1:
    stable-sort-by-digit(position)
```

Counting Sort is commonly used for each digit because the digit domain is small and discrete.

## 7. Digit Extraction

For non-negative integer values in base `b`, a digit at position `p` can be conceptually obtained from:

```text
floor(value / b^p) % b
```

Implementations should consider integer range and numeric safety.

## 8. Complexity

Let:

```text
n = number of keys
d = number of digit positions
b = radix/base
```

When each digit pass uses Counting Sort:

```text
Time:  O(d(n + b))
Space: O(n + b)
```

for the common stable-output model.

The actual cost depends on digit width, representation, and implementation details.

## 9. Base Selection

A larger base can reduce the number of digit passes but increase the counting structure size.

A smaller base increases passes but reduces per-pass bucket space.

Therefore:

```text
base choice = pass-count trade-off + memory/cache trade-off
```

There is no universally optimal base independent of workload and implementation.

## 10. Example

For decimal values:

```text
[170, 45, 75, 90, 802, 24, 2, 66]
```

LSD processing uses:

```text
ones
→ tens
→ hundreds
```

Each pass is stable.

The final ordering is:

```text
[2, 24, 45, 66, 75, 90, 170, 802]
```

## 11. Correctness Invariant for LSD

After processing digit positions `0 ... p`, the array is sorted according to those processed positions as a composite key, with more significant unprocessed positions ignored.

Stability ensures that the ordering established by earlier positions remains intact within equal current-digit groups.

## 12. MSD Mental Model

MSD Radix Sort starts from the most significant digit:

```text
partition into digit groups
→ recursively sort each group by the next digit
```

This resembles recursive bucket partitioning.

## 13. LSD vs MSD

| Property | LSD | MSD |
|---|---|---|
| Direction | Least → most significant | Most → least significant |
| Typical implementation | Iterative passes | Recursive/bucket refinement |
| Stability | Required for standard LSD | Depends on implementation |
| Natural for fixed-width keys | Yes | Yes |
| Natural for variable-length strings | Less direct | Often useful |
| Auxiliary behavior | Output buffers commonly used | Bucket/recursion management varies |

The choice depends on key representation and workload.

## 14. Signed Integers

Basic LSD formulations are easiest for non-negative integers.

Signed values require a representation strategy.

Possible approaches include:

- separately sorting negative and non-negative values;
- transforming signed values into an order-preserving unsigned representation;
- using a signed-aware digit mapping.

The transformation must preserve the desired numerical order.

## 15. Fixed-Width Unsigned Keys

Fixed-width keys simplify Radix Sort because every item has a known number of positions.

Examples include:

- 32-bit identifiers;
- byte arrays;
- packed numeric keys.

The digit count can be determined directly from the representation width.

## 16. Strings

Radix techniques can also process strings by character position.

You must explicitly define:

- alphabet ordering;
- fixed vs variable length;
- treatment of missing positions;
- case normalization;
- Unicode semantics.

Character-based sorting is not automatically equivalent to locale-aware human language collation.

## 17. Objects and Records

For records:

```js
keySelector(record)
```

can extract the sortable key.

If records share a key, stable distribution can preserve their original order.

The key extraction cost should be considered separately from digit-processing cost.

## 18. Counting Sort Connection

Each LSD digit pass can use stable Counting Sort:

```text
key
→ digit extraction
→ frequency counts
→ cumulative positions
→ stable placement
```

Therefore understanding stable Counting Sort is a prerequisite for implementing LSD Radix Sort correctly.

## 19. Correctness of Stable Digit Pass

For one digit pass:

1. every item is assigned to exactly one digit bucket;
2. bucket order follows digit order;
3. equal-digit items retain their incoming order.

Thus the pass sorts by the current digit while preserving the ordering established by previously processed less significant digits.

## 20. Memory Model

A stable LSD pass commonly requires:

```text
count array: O(b)
output array: O(n)
```

Implementations can reuse the output buffer across passes to avoid repeated allocations.

## 21. Allocation Engineering

Repeatedly creating arrays inside every digit pass can increase allocation pressure.

A production implementation can allocate reusable buffers once and swap source/destination references between passes.

This preserves the asymptotic complexity while reducing allocation overhead.

## 22. Numeric Safety in JavaScript

JavaScript `Number` represents integers exactly only within its safe integer range.

For large identifiers, consider:

- `BigInt`;
- fixed-width typed arrays;
- explicit byte representations.

Digit extraction must match the chosen representation.

## 23. Typed Arrays

For fixed-width integer data, typed arrays can make the representation explicit and may reduce memory overhead.

Examples include:

```text
Uint8Array
Uint16Array
Uint32Array
BigInt64Array
BigUint64Array
```

The implementation still needs to respect the semantics of the selected numeric type.

## 24. Backend Applications

Radix-style processing can be useful for:

- fixed-width IDs;
- byte-oriented keys;
- compact event identifiers;
- large batches of bounded numeric records;
- external/distributed sorting stages.

For database queries, use database indexes and ordering capabilities where appropriate rather than automatically sorting records in application memory.

## 25. AI Applications

Potential applications include:

- fixed-width token IDs;
- bucketed feature keys;
- integer-coded categorical data;
- deterministic candidate ordering;
- preprocessing of structured numeric datasets.

Large-scale AI pipelines commonly use specialized parallel or distributed sorting primitives rather than a hand-written JavaScript Radix Sort.

## 26. Radix Sort vs Counting Sort

Counting Sort directly exploits a compact key range.

Radix Sort breaks a larger structured key into multiple compact components.

A useful relationship is:

```text
Counting Sort = one compact-domain ordering step
Radix Sort    = repeated compact-domain ordering steps
```

## 27. Radix Sort vs Comparison Sort

Radix Sort can achieve near-linear behavior when the number of digit passes is bounded and digit processing is efficient.

Comparison sorting is more general and does not require a structured discrete key representation.

The correct choice depends on:

- key structure;
- `n`;
- digit count;
- radix;
- memory limits;
- stability requirements;
- implementation environment.

## 28. Radix Sort vs Hashing

Hashing answers membership or key-to-value lookup questions; Radix Sort establishes an ordering.

A hash function does not preserve numerical or lexicographic ordering in general.

Therefore hashing cannot simply replace a sorting algorithm when ordered output is required.

## 29. Benchmarking

Measure:

- number of digit passes;
- digit extraction operations;
- count-array operations;
- writes;
- allocations;
- elapsed time;
- memory usage.

Compare multiple bases on the same workloads.

## 30. Workload Design

Benchmark with:

- narrow numeric ranges;
- wide numeric ranges;
- many duplicates;
- random values;
- sorted values;
- fixed-width keys;
- signed values;
- object records.

A base that performs well on one distribution may behave differently on another.

## 31. Common Mistakes

1. Using an unstable digit sort for LSD Radix Sort.
2. Processing digits in the wrong direction.
3. Incorrect digit extraction.
4. Mishandling zero-padding or missing string positions.
5. Ignoring signed-number ordering.
6. Choosing an impractically large radix.
7. Reallocating buffers on every pass unnecessarily.
8. Ignoring JavaScript integer safety.
9. Claiming `O(n)` without specifying digit assumptions.
10. Confusing Radix Sort with hashing.

## 32. Edge Cases

Test:

- empty;
- singleton;
- zero;
- repeated values;
- all equal;
- different digit lengths;
- negative values;
- maximum supported integer values;
- fixed-width keys;
- equal-key records;
- variable-length strings.

## 33. Testing Strategy

Verify:

```text
sortedness
permutation preservation
stable digit passes
final stability when promised
signed-order correctness
representation constraints
```

Test every digit pass independently before trusting the complete algorithm.

## 34. Interview Questions

1. What is Radix Sort?
2. Compare LSD and MSD Radix Sort.
3. Why must LSD digit sorting be stable?
4. Derive `O(d(n+b))`.
5. How does base selection affect performance?
6. How can negative integers be handled?
7. How does Radix Sort relate to Counting Sort?
8. How would you sort fixed-width IDs?
9. What changes when sorting strings?
10. Why can Radix Sort beat comparison sorting for structured keys?

## 35. Revision Checklist

- [ ] I can explain LSD and MSD Radix Sort.
- [ ] I can extract digits in a chosen base.
- [ ] I can implement a stable digit Counting Sort.
- [ ] I understand the LSD stability invariant.
- [ ] I can derive `O(d(n+b))`.
- [ ] I understand radix/base trade-offs.
- [ ] I can reason about signed integers.
- [ ] I understand fixed-width and string keys.
- [ ] I can account for output-buffer memory.
- [ ] I can benchmark different radix bases fairly.

## 36. Key Takeaways

1. **Radix Sort orders structured keys digit by digit rather than comparing complete keys.**
2. **LSD Radix Sort depends on stable processing at every digit.**
3. **Counting Sort is a natural engine for each digit pass.**
4. **A common complexity model is `O(d(n+b))` with `O(n+b)` auxiliary space.**
5. **Radix/base selection trades digit-pass count against per-pass memory and work.**
6. **Signed integers, strings, and objects require explicit representation and ordering contracts.**
7. **The algorithm is powerful when key structure is fixed or otherwise efficiently decomposable.**
8. **The deeper lesson is compositional ordering: preserve information from earlier passes while progressively refining the key.**
