# 03.7 — Frequency & Counting with Arrays

## Definition

Frequency counting converts a collection of values into a representation of **how often each value occurs**. Instead of repeatedly scanning the array to answer occurrence questions, we maintain counts that can be queried or updated efficiently.

The core transformation is:

```text
raw values → frequency representation → constant/expected-time lookup
```

This chapter focuses on array-based counting and the reasoning behind choosing an array, object, `Map`, or `Set` as the counting representation.

---

## Why It Matters

Frequency counting is one of the most reusable DSA patterns. It appears in:

- duplicate detection;
- occurrence counting;
- majority/frequency problems;
- anagrams;
- top-frequency problems;
- histogram construction;
- grouping;
- counting distinct values;
- prefix-frequency queries;
- bounded-integer counting;
- backend deduplication and aggregation;
- AI token/candidate statistics.

It is often the first major example of **spending memory to remove repeated work**.

---

## Mental Model

Suppose:

```text
[4, 2, 4, 1, 2, 4]
```

Instead of repeatedly asking “how many 4s?” scan once:

```text
4 → 3
2 → 2
1 → 1
```

Now each frequency lookup is expected `O(1)` with a hash-based representation.

The algorithm has transformed the problem from repeated search into state maintenance.

---

# 1. Direct Counting with an Array

If values are small non-negative integers within a known range, an array can be the most efficient representation.

For values in `[0, K]`:

```js
const count = new Array(K + 1).fill(0);

for (const value of arr) {
  count[value]++;
}
```

### Complexity

For `n` input values and range size `K`:

- Time: `O(n + K)` if initialization of all buckets matters;
- Auxiliary space: `O(K)`.

If `K` is tiny relative to `n`, this is excellent.

---

# 2. Frequency Array vs Hash Map

The representation depends on the key domain.

| Representation | Best when | Typical lookup |
|---|---|---:|
| Array | Dense small integer keys | `O(1)` |
| `Map` | General keys / sparse domain | expected `O(1)` |
| Object | String-like keys, simple cases | expected `O(1)` |
| `Set` | Presence only, no count | expected `O(1)` |
| Sorted array | Ordering is useful | `O(log n)` search |

Do not choose a frequency array merely because values happen to be numbers. If the range is enormous and sparse, allocating `K` buckets can waste memory.

---

# 3. Counting Frequencies

The standard pattern:

```js
function frequencyMap(arr) {
  const freq = new Map();

  for (const value of arr) {
    freq.set(value, (freq.get(value) ?? 0) + 1);
  }

  return freq;
}
```

### Invariant

> After processing the first `i` elements, `freq[x]` equals the number of occurrences of `x` among those processed elements.

This invariant is simple but extremely important: it makes many counting algorithms easy to prove.

---

# 4. Count Occurrences of One Value

A single scan is enough:

```text
count = number of positions i where arr[i] === target
```

Time: `O(n)`.

If many target queries arrive against the same static array, preprocessing frequencies changes the economics:

```text
build: O(n)
Q queries: O(Q) expected
combined: O(n + Q)
```

with `O(U)` storage where `U` is the number of distinct values.

---

# 5. Detect Duplicates

A frequency structure can detect whether any value appears more than once.

Two common strategies:

### Set

You only need existence:

```text
seen value again → duplicate
```

### Frequency

You need exact counts:

```text
freq[value]++
```

If exact multiplicity is not needed, a `Set` communicates the intent better.

---

# 6. Count Distinct Values

The number of distinct values is the number of keys in the frequency representation.

For a `Set`:

```js
const distinct = new Set(arr).size;
```

Time: expected `O(n)`.

Auxiliary space: `O(U)`.

---

# 7. Find the Most Frequent Value

Build frequencies and track the best candidate.

You can either:

1. update the current maximum while counting; or
2. count first, then scan the frequency entries.

The second approach is often easier to reason about because counting and selection are separate phases.

For deterministic tie-breaking, define the rule explicitly:

- smallest value wins;
- first occurrence wins;
- lexicographically smallest wins;
- etc.

Tie-breaking is part of the algorithm contract.

---

# 8. Frequency Array for Bounded Integers

Suppose:

```text
arr = [0, 3, 1, 3, 2, 1]
```

A frequency array becomes:

```text
value: 0 1 2 3
count:  1 2 1 2
```

This gives direct access to every possible value.

It also enables useful derived operations:

- histogram;
- counting values below a threshold;
- reconstruction of sorted values;
- prefix frequencies over the value domain.

---

# 9. Reconstruct a Sorted Array from Frequencies

If integer values are bounded, count first and emit each value according to its frequency.

Example:

```text
input:     [3,1,2,1,3]
frequency: 1→2, 2→1, 3→2
output:    [1,1,2,3,3]
```

If the value range is `K`, reconstruction costs `O(K + n)`.

This is the conceptual basis of **counting sort**.

---

# 10. Counting Sort Connection

Counting sort does not compare elements against each other. It exploits a bounded key domain.

For integer keys in a manageable range:

1. count occurrences;
2. derive positions or emit values;
3. produce sorted output.

Typical complexity:

```text
O(n + K)
```

This can beat comparison sorting's `O(n log n)` when `K` is sufficiently small.

But if `K` is huge compared with `n`, the representation can become impractical.

---

# 11. Frequency + Prefix Frequency

Frequency counting can be extended into prefix-frequency state.

For a bounded value `x`, define:

```text
prefixCount[i][x]
```

as the number of occurrences of `x` in the first `i` positions.

Then a range-frequency query can be answered by subtraction:

```text
count(x, l..r) = prefixCount[r + 1][x] - prefixCount[l][x]
```

The trade-off is potentially large memory: `O(nK)` for all values and positions.

For one target, a single prefix-frequency array costs only `O(n)`.

---

# 12. Frequency + Two Pointers

Counting and two pointers can be combined.

Examples:

- count duplicate runs after sorting;
- skip repeated candidates in Three Sum;
- count values in sorted ranges;
- compress equal adjacent values.

This is an important reminder that patterns are composable rather than isolated tricks.

---

# 13. Frequency + Sorting

Sometimes sorting provides a simpler representation than hashing.

Example:

```text
[3, 1, 3, 2, 1, 1]
↓ sort
[1, 1, 1, 2, 3, 3]
↓ scan runs
1 → 3
2 → 1
3 → 2
```

Complexity:

- sorting: `O(n log n)`;
- frequency scan: `O(n)`;
- total: `O(n log n)`.

Advantages include deterministic ordering and potentially lower auxiliary memory depending on the sorting algorithm and mutation constraints.

---

# 14. Anagram Reasoning

Two strings are anagrams when their character multisets are equal.

A frequency representation can compare the character counts.

For a bounded alphabet, an array is often ideal.

For a general Unicode/domain problem, carefully define what “character” means. JavaScript UTF-16 strings and Unicode code points are not identical concepts.

Do not silently assume ASCII when the contract does not provide that guarantee.

---

# 15. Majority and Frequency Thresholds

Frequency counting can solve problems such as:

- does any value occur at least `k` times?
- what values occur exactly `k` times?
- is there a value occurring more than `n/2` times?
- how many values meet a frequency threshold?

However, if the task has special structure, a specialized algorithm may use less memory. For example, majority-element problems can sometimes be solved with Boyer–Moore voting.

The lesson is:

> Frequency counting is a baseline representation, not automatically the optimal representation.

---

# 16. Frequency Comparison

A common abstraction is:

```text
frequency(A) === frequency(B)
```

This supports:

- anagram detection;
- multiset equality;
- inventory comparison;
- batch reconciliation;
- token distribution comparison.

For equality, remember to compare both key presence and counts.

A common bug is checking only that every key in `A` exists in `B` without verifying the reverse direction.

---

# 17. Negative and Sparse Integer Domains

An array indexed by value works naturally for non-negative bounded integers.

For negative values, options include:

- offset indexing if the range is small;
- `Map` for a sparse/general domain;
- coordinate compression when ordering matters and the distinct domain is manageable.

Example offset:

```text
values: -3 ... 4
index:    0 ... 7
```

with `index = value - minValue`.

Memory depends on `maxValue - minValue + 1`, not merely on the number of elements.

---

# 18. Coordinate Compression

When values are huge but only relative ordering matters:

```text
[1000000000, 50, 1000000000, 700]
```

can be mapped to ranks:

```text
50 → 0
700 → 1
1000000000 → 2
```

Then arrays can be used over the compressed domain.

Coordinate compression is useful when:

- the number of distinct values `U` is manageable;
- values themselves are too large for direct indexing;
- ordering/equality matters more than absolute magnitude.

It is another example of representation transforming algorithm choice.

---

# 19. Complexity Model

Let:

- `N` = number of input elements;
- `U` = number of distinct values;
- `K` = numeric key range.

Typical costs:

| Technique | Time | Auxiliary Space |
|---|---:|---:|
| One target scan | `O(N)` | `O(1)` |
| Hash frequency | expected `O(N)` | `O(U)` |
| Array frequency | `O(N + K)` | `O(K)` |
| Sort + run counting | `O(N log N)` | sorting-dependent |
| Coordinate compression | typically `O(N log U)` | `O(U)` |
| Prefix frequency for one target | `O(N)` build | `O(N)` |
| Full value × position prefix counts | `O(NK)` | `O(NK)` |

Use the smallest meaningful parameterization instead of collapsing everything into `N`.

---

# 20. When to Use Frequency Counting

Use it when the problem asks about:

- occurrences;
- duplicates;
- multiplicity;
- distinct values;
- frequency thresholds;
- multiset equality;
- repeated membership/count queries.

Especially strong when:

- the number of distinct values is manageable;
- hashing is acceptable;
- the key domain is bounded;
- many queries reuse the same static input.

# When Not to Use It

Avoid it when:

- you only need one membership query and a direct scan is simpler;
- memory is extremely constrained;
- the key domain is enormous and sparse;
- ordering is central and sorting provides more useful structure;
- a specialized constant-space algorithm exists and is required;
- the data is streaming and the full distinct-key state cannot fit in memory.

---

# Streaming Frequency Counting

For a stream:

```text
x1, x2, x3, ...
```

maintain counts incrementally.

Memory is `O(U)` for exact counts.

If `U` is too large, approximate structures may be considered in advanced systems, such as Count-Min Sketch. That is a probabilistic data structure and belongs to later advanced DSA work.

The key engineering question becomes:

> Can the exact state fit in memory, and if not, what error guarantee is acceptable?

---

# Backend Applications

### API Request Deduplication

Count or track repeated request identifiers to detect duplicates.

### Batch Validation

Count incoming IDs, SKUs, user IDs, or event types before processing.

### Log Aggregation

Frequency tables answer questions such as:

- most common error codes;
- requests per route;
- events per tenant;
- repeated failure signatures.

### Inventory Reconciliation

Compare frequency maps between expected and received items.

### Rate-Limit Buckets

Frequency/count state can represent request usage over a bounded time interval.

Production concerns include:

- concurrency;
- memory retention;
- expiration;
- distributed state;
- approximate vs exact counts.

---

# AI Applications

### Token Frequency

Count token occurrences for corpus statistics, diagnostics, and preprocessing.

### Candidate Deduplication

Frequency or membership state can identify repeated retrieval candidates before reranking.

### Label Distribution

Count classes for dataset analysis and imbalance detection.

### Feature Histograms

Bounded numeric features can use bucket arrays.

### Retrieval Aggregation

When several retrieval sources return candidate IDs, frequency can measure how many systems independently retrieved each candidate.

This can become a ranking signal:

```text
candidate score = weighted evidence across retrieval sources
```

The underlying DSA pattern is still frequency aggregation.

---

# Correctness Framework

For a frequency map, the central invariant is:

> After processing the first `i` elements, every stored count equals the exact number of occurrences of that key among those `i` elements.

At termination, `i = N`, so the map contains the exact frequency of every key.

For a bounded frequency array:

> `count[v]` equals the number of processed elements whose value is exactly `v`.

This proof is an induction over the input traversal.

---

# Common Mistakes

1. Using an enormous frequency array for a sparse domain.
2. Forgetting negative values.
3. Confusing distinct count with total count.
4. Checking membership when exact frequency is required.
5. Ignoring tie-breaking rules.
6. Comparing only one direction in multiset equality.
7. Forgetting the cost of initializing `K` buckets.
8. Claiming `O(1)` memory for a frequency structure.
9. Assuming JavaScript object keys behave exactly like arbitrary `Map` keys.
10. Ignoring Unicode semantics in string-frequency problems.
11. Forgetting that streaming exact frequency requires `O(U)` state.
12. Choosing frequency counting when a specialized algorithm needs less memory.

---

# Interview Framework

When you see a frequency/counting problem:

1. Identify the **key domain**.
2. Identify `N`, `U`, and possibly `K`.
3. Ask whether you need **membership** or **multiplicity**.
4. Choose array / `Map` / `Set` / sorting accordingly.
5. State the frequency invariant.
6. Build the counts.
7. Process the derived condition.
8. Define tie-breaking and duplicate semantics.
9. Calculate time including initialization and sorting.
10. Calculate auxiliary memory using the actual domain size.
11. Consider whether a specialized algorithm beats generic counting.

---

# Revision Checklist

- [ ] I can build a frequency map.
- [ ] I understand array-based counting.
- [ ] I can choose between array, `Map`, `Set`, and sorting.
- [ ] I can detect duplicates.
- [ ] I can count distinct values.
- [ ] I can find the most frequent value.
- [ ] I understand counting sort.
- [ ] I can use prefix frequency for repeated queries.
- [ ] I understand sparse vs dense domains.
- [ ] I understand negative-value handling.
- [ ] I understand coordinate compression.
- [ ] I can compare two multisets.
- [ ] I understand frequency thresholds.
- [ ] I can reason about streaming frequency state.
- [ ] I can derive the frequency invariant.
- [ ] I can calculate `O(N)`, `O(U)`, and `O(K)` correctly.
- [ ] I can explain backend applications.
- [ ] I can explain AI applications.
- [ ] I can identify when frequency counting is not optimal.

## Key Takeaways

1. Frequency counting replaces repeated searches with maintained state.
2. The correct representation depends on the key domain: dense integer domains favor arrays; general/sparse domains often favor hashing.
3. Always distinguish `N` (elements), `U` (distinct keys), and `K` (numeric range).
4. A frequency structure trades memory for faster repeated queries.
5. Counting sort is a direct consequence of exploiting a bounded key domain.
6. Coordinate compression can convert huge sparse values into a manageable indexed domain.
7. Frequency counting is a reusable baseline, but specialized algorithms can sometimes do better.
8. The core correctness tool is the frequency invariant.
