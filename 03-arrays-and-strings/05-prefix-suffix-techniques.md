# 03.5 — Prefix & Suffix Techniques

## Definition
Prefix and suffix techniques precompute reusable information about portions of an array so later operations avoid repeated work.

```text
prefix[i] → information about arr[0..i]
suffix[i] → information about arr[i..n-1]
```

## Why It Matters

This pattern is foundational for range queries, split-point problems, product-except-self, frequency queries, dynamic programming, interval reasoning, backend aggregation, and AI sequence/candidate processing.

## Core Mental Model

Ask:

> What computation am I repeating for every index or query?

If the answer depends on a growing left or right portion, store that state once.

## Prefix Sum

```js
function buildPrefixSum(arr) {
  const prefix = new Array(arr.length);
  let running = 0;
  for (let i = 0; i < arr.length; i++) {
    running += arr[i];
    prefix[i] = running;
  }
  return prefix;
}
```

Time: `O(n)`; space: `O(n)`.

A cleaner sentinel representation is:

```text
prefix[0] = 0
prefix[i + 1] = prefix[i] + arr[i]
```

For inclusive `[l, r]`:

```text
sum(l..r) = prefix[r + 1] - prefix[l]
```

Thus after `O(n)` preprocessing, each range-sum query is `O(1)`.

## Preprocessing Trade-Off

Brute-force `Q` range queries can cost `O(nQ)` in the worst case. Prefix sums reduce the total to:

```text
build:  O(n)
queries: O(Q)
total:   O(n + Q)
space:   O(n)
```

The optimization is worthwhile when query volume justifies preprocessing and memory.

## Prefix Min / Max

Prefix information can be any reusable state.

```text
arr:       [4, 2, 9, 3, 7]
prefixMax: [4, 4, 9, 9, 9]
```

Invariant:

> After processing `i`, the stored prefix state represents exactly `arr[0..i]`.

## Suffix Min / Max

Suffixes are computed right-to-left.

```text
arr:       [4, 2, 9, 3, 7]
suffixMax: [9, 9, 9, 7, 7]
```

```js
function buildSuffixMax(arr) {
  const suffix = new Array(arr.length);
  let best = -Infinity;
  for (let i = arr.length - 1; i >= 0; i--) {
    best = Math.max(best, arr[i]);
    suffix[i] = best;
  }
  return suffix;
}
```

## Prefix + Suffix Split Reasoning

Many problems have the shape:

```text
left information | split | right information
```

Examples:

- left maximum + right minimum
- left sum + right sum
- left count + right count
- left product + right product

Typical solution:

```text
precompute left state
precompute right state
scan split points
```

This can turn repeated quadratic work into `O(n)` preprocessing plus `O(n)` scanning.

## Product Except Self

For:

```text
[1, 2, 3, 4]
```

produce:

```text
[24, 12, 8, 6]
```

Conceptually:

```text
output[i] = product(left of i) × product(right of i)
```

A prefix/suffix implementation is `O(n)` time. With a left-to-right product accumulator followed by a right-to-left accumulator, auxiliary space can be `O(1)` excluding the required output array.

## Prefix State vs Materialized Prefix Array

You do not always need an array.

If only the current cumulative state is needed:

```js
let sum = 0;
for (const value of arr) sum += value;
```

uses `O(1)` auxiliary space.

Materialize prefix state when future operations need random access to historical values.

## Prefix Frequency

Prefix arrays can store counts rather than numeric sums.

For:

```text
[1, 0, 1, 1, 0]
```

one-count prefix state can be:

```text
[0, 1, 1, 2, 3, 3]
```

Then the number of ones in `[l, r]` is `prefix[r + 1] - prefix[l]`.

## Prefix XOR

XOR supports cancellation:

```text
a ^ a = 0
x ^ 0 = x
```

So:

```text
rangeXor(l, r) = prefix[r + 1] ^ prefix[l]
```

This shows why prefix methods depend on the algebraic properties of the accumulated operation.

## What Prefix Does NOT Solve Automatically

A prefix array does not universally answer arbitrary range operations in `O(1)`. For example, range minimum cannot generally be obtained by subtracting a left contribution from a prefix minimum.

When updates are frequent, a static prefix array may become expensive to maintain. A point update can invalidate many later prefix values, potentially requiring `O(n)` work. Fenwick trees and segment trees address broader dynamic range-query workloads.

## Difference Array

A difference array reverses the usual goal: it represents range updates efficiently.

For adding `x` to every position in `[l, r]`:

```text
diff[l]     += x
diff[r + 1] -= x
```

A prefix accumulation reconstructs the final values.

```text
prefix sums    → efficient range queries
difference     → efficient range updates
```

## Repeated Work Example

Computing `sum(arr[0..i])` independently for every `i` costs:

```text
1 + 2 + ... + n = O(n²)
```

A single prefix pass costs `O(n)`.

The Phase 01 principle is:

```text
identify repeated work
→ store reusable state
→ reuse it
→ prove the new complexity
```

## Brute Force vs Optimized

For each range `[l, r]`:

```text
brute force → scan range
optimized   → prefix lookup
```

Always include preprocessing in the total complexity. Do not claim `O(1)` as the whole algorithm if an `O(n)` prefix build is required.

## Edge Cases

```text
□ empty array
□ one element
□ l = 0
□ r = n - 1
□ l = r
□ negative numbers
□ zero values
□ duplicates
□ invalid ranges
□ large sums/products
□ boundary indices
```

JavaScript `Number` has finite integer precision. Exact sums beyond the safe integer range may require `BigInt` or another representation.

## Backend Applications

Prefix/suffix techniques can support cumulative request counts, event-log range aggregation, usage metrics, batch offsets, pagination boundaries, and threshold calculations.

For mutable/high-frequency data, specialized indexes or streaming aggregation may be better than rebuilding static prefix state.

## AI Applications

Applications include cumulative sequence features, left/right contextual features, candidate score aggregation, token statistics, preprocessing feature arrays, and prefix/suffix DP states.

The deeper AI connection is reusable computation: calculate a contribution once and reuse it across many positions or candidates.

## Common Mistakes

1. Off-by-one errors in range formulas.
2. Forgetting the sentinel-zero convention.
3. Building `O(n)` state when a scalar is enough.
4. Claiming query complexity without counting preprocessing.
5. Assuming prefix techniques work for every range operation.
6. Ignoring update costs.
7. Using the wrong left/right boundary.
8. Ignoring numeric precision for large aggregates.

## Interview Framework

```text
1. What work is repeated?
2. Is it a left-prefix or right-suffix property?
3. Can I cache the state?
4. Do I need the whole array or only a scalar?
5. Can a sentinel simplify boundaries?
6. Can a query be expressed using two prefix states?
7. Are updates present?
8. What memory trade-off am I accepting?
9. What is the total preprocessing + query cost?
10. What invariant proves each state?
```

## Revision Checklist

- [ ] Build prefix sums.
- [ ] Answer range sums in `O(1)` after preprocessing.
- [ ] Use the sentinel-zero representation.
- [ ] Build prefix/suffix min/max.
- [ ] Combine left and right states.
- [ ] Solve product-except-self conceptually.
- [ ] Distinguish scalar state from materialized state.
- [ ] Use prefix frequencies.
- [ ] Understand prefix XOR.
- [ ] Explain prefix vs difference arrays.
- [ ] Analyze preprocessing/query/update trade-offs.
- [ ] Connect the pattern to backend and AI systems.

## Key Takeaways

1. Prefix/suffix techniques eliminate repeated work by storing reusable state.
2. Prefix sums reduce static range-sum queries to `O(1)` after `O(n)` preprocessing.
3. Sentinel-zero prefixes simplify boundaries.
4. Prefix state can represent sums, counts, XOR, minima, maxima, products, and other suitable aggregates.
5. A scalar accumulator is preferable when historical random access is unnecessary.
6. Prefix + suffix state is powerful for split-point problems.
7. Difference arrays target efficient range updates rather than range queries.
8. Static prefix state has an update-cost trade-off.
9. Correct complexity must include preprocessing.
10. The general pattern is: **compute once, reuse many times.**
