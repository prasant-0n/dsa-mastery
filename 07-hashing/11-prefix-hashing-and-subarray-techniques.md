# 07.11 — Prefix Hashing & Subarray Techniques

## 1. Concept Definition

**Prefix hashing** combines a running prefix state with a `Map` to answer subarray questions without repeatedly scanning every possible range.

For an array `a`:

```text
P[i] = a[0] + a[1] + ... + a[i - 1]
```

Using the half-open convention, the sum of subarray `[l, r)` is:

```text
sum(l, r) = P[r] - P[l]
```

The key insight is that a subarray property can often be rewritten as a relationship between **two prefix states**.

## 2. Why It Exists

There are `O(n²)` possible contiguous subarrays in an array of length `n`. Enumerating every range and calculating its sum independently is usually too expensive.

Prefix sums allow range sums to be derived in constant time after linear preprocessing. Hashing goes further: it lets us find pairs of prefix states that satisfy a required relationship.

```text
Brute force
all subarrays → calculate / compare

Optimized
prefix state → Map → identify compatible previous state
```

## 3. Mental Model

Imagine each position producing a checkpoint:

```text
index:  0   1   2   3   4
prefix: 0   3   1   6   4
```

A subarray is the **difference between two checkpoints**.

For target sum `T`:

```text
P[r] - P[l] = T

therefore

P[l] = P[r] - T
```

So at prefix `P[r]`, ask:

> “Have I seen prefix `P[r] - T` before?”

That question is exactly what a Map can answer efficiently.

## 4. Prefix Sum Construction

For an array `values`:

```js
let prefix = 0;
for (const value of values) {
  prefix += value;
}
```

A complete prefix array can be represented as:

```text
prefix[0] = 0
prefix[i + 1] = prefix[i] + values[i]
```

The extra leading zero makes range formulas uniform.

## 5. Range Sum Model

For `[l, r)`:

```text
sum = prefix[r] - prefix[l]
```

For inclusive `[l, r]`:

```text
sum = prefix[r + 1] - prefix[l]
```

Be consistent about the indexing convention. Off-by-one errors are one of the most common prefix-sum bugs.

## 6. Prefix State + Frequency Map

For counting subarrays with sum `target`, maintain:

```text
frequency[prefixValue] = number of times this prefix has appeared
```

At current prefix `P`:

```text
needed = P - target
answer += frequency[needed]
frequency[P] += 1
```

The initial state is essential:

```text
frequency[0] = 1
```

It represents the empty prefix before the first element.

## 7. Why the Frequency Map Works

Suppose:

```text
P[r] - P[l] = target
```

Then:

```text
P[l] = P[r] - target
```

Every earlier occurrence of that required prefix represents a different valid starting boundary.

Therefore the Map must store **counts**, not merely membership, when the problem asks for the number of valid subarrays.

## 8. Example: Zero-Sum Subarray

For:

```text
[4, -1, -3, 2]
```

prefix states are:

```text
0 → 4 → 3 → 0 → 2
```

The repeated prefix `0` means:

```text
prefix[j] - prefix[i] = 0
```

so the elements between those boundaries sum to zero.

General rule:

> **Equal prefix sums imply a zero-sum subarray between them.**

## 9. Longest Subarray with a Target Sum

For:

```text
P[r] - P[l] = target
```

we need:

```text
P[l] = P[r] - target
```

To maximize `r - l`, preserve the **earliest index** at which each prefix value appeared.

This gives a fundamental rule:

```text
Counting problem       → store frequency
Longest-range problem  → usually store earliest index
Latest-position problem → store latest index
```

The required state depends on the objective.

## 10. Prefix State Is Not Always a Sum

The “prefix” idea is broader than arithmetic sums.

A prefix state can encode:

- cumulative sum;
- parity;
- balance between categories;
- count difference;
- bitmask state;
- frequency signature;
- transformed score.

The algorithmic pattern remains:

```text
prefix state
    ↓
Map / Set
    ↓
find a compatible previous state
```

## 11. Equal 0/1 Subarrays

For a binary array, transform:

```text
0 → -1
1 → +1
```

Then a subarray containing equal numbers of `0` and `1` has transformed sum `0`.

Therefore the problem becomes a zero-sum prefix problem.

This demonstrates an important technique:

> **Transform the input so the desired property becomes a known prefix relationship.**

## 12. Prefix State for Parity

Suppose a problem asks whether a range has an even or odd number of some category.

Instead of storing the complete count, store only the relevant state:

```text
count % 2
```

Then equal parity states identify a range with even count.

This is state compression:

```text
large numeric state → minimal state required by the question
```

## 13. Prefix XOR

For XOR-based problems:

```text
prefixXor[i + 1] = prefixXor[i] ^ values[i]
```

Because XOR is self-inverse:

```text
rangeXor(l, r) = prefixXor[r] ^ prefixXor[l]
```

Equal prefix XOR states imply a zero-XOR range.

Prefix hashing therefore applies beyond addition.

## 14. Prefix Frequency Signatures

For categorical strings or arrays, maintain a cumulative frequency state.

For two categories, the difference may be sufficient:

```text
balance = count(A) - count(B)
```

Equal balances at two positions imply equal counts of A and B in the intervening range.

For multiple categories, a vector or canonical encoded state may be required.

## 15. Hash Map vs Prefix Array

Use a prefix array when you primarily need deterministic range queries:

```text
prefix[r] - prefix[l]
```

Use a Map when you need to locate previous prefix states satisfying a relationship.

You can use both when a problem requires:

- arbitrary range queries;
- state indexing;
- repeated target queries.

The right structure depends on the question, not the topic label.

## 16. Brute Force → Optimized Derivation

Consider counting subarrays with sum `target`.

### Brute force

```text
for each left boundary
    extend right boundary
    calculate sum
```

Depending on implementation, this is `O(n²)`.

### Prefix + Map

```text
prefix = 0
frequency[0] = 1

for x:
    prefix += x
    needed = prefix - target
    answer += frequency[needed]
    frequency[prefix] += 1
```

Expected time:

```text
O(n)
```

Auxiliary space:

```text
O(u)
```

where `u` is the number of distinct prefix states.

## 17. Correctness Invariant — Counting

Before processing the next value:

> `frequency[s]` equals the number of processed prefix boundaries whose prefix state is `s`.

At current prefix `P`, every previous prefix equal to `P - target` forms one valid target-sum subarray ending at the current boundary.

Therefore adding `frequency[P - target]` counts exactly the newly discovered ranges.

## 18. Correctness Invariant — Longest Range

For each stored prefix state `s`:

> The Map stores the earliest processed boundary having state `s`.

At current boundary `r`, if state `P - target` exists at index `l`, then `[l, r)` has the target property.

Because `l` is the earliest possible compatible boundary, the resulting range is the longest compatible range ending at `r`.

## 19. Prefix Hashing and Negative Numbers

Sliding-window sum techniques often rely on non-negative values. Prefix hashing does **not** require that assumption for target-sum equations.

For example:

```text
[3, -2, 5, -1]
```

negative values can cause the running sum to move in either direction, but the algebra:

```text
P[r] - P[l] = target
```

still holds.

This is one reason prefix hashing is more general than a simple expanding/shrinking window for arbitrary integer arrays.

## 20. Multiple Queries

If there are many range-sum queries on a static array:

```text
precompute prefix sums → O(n)
answer each query      → O(1)
```

Total:

```text
O(n + q)
```

for `q` queries, ignoring input/output costs.

This is a classic preprocessing trade-off:

```text
more upfront memory/work
        ↓
faster repeated queries
```

## 21. Prefix Hashing with Constraints

Before implementing, inspect constraints:

- integer magnitude;
- number of elements;
- number of queries;
- number of distinct states;
- required output size;
- whether values can be negative;
- whether input is static or streaming.

In JavaScript, numeric precision matters. For integer sums that may exceed the exact safe integer range, consider `BigInt` when the problem's semantics permit it.

## 22. Streaming Prefix Hashing

You do not always need to materialize the entire prefix array.

For one-pass problems, maintain only:

```text
current prefix state
Map of required previous states
answer
```

This can reduce memory from `O(n)` to `O(u)`.

This is particularly useful for:

- large streams;
- backend event processing;
- online analytics;
- AI token streams.

## 23. Backend Engineering Applications

Prefix hashing appears in backend workloads such as:

### Usage windows

Convert cumulative counters into range usage:

```text
usage(r) - usage(l)
```

### Event streams

Detect cumulative-state relationships over ordered events.

### Billing / accounting

Calculate range totals from cumulative values while carefully defining corrections and immutable boundaries.

### Analytics

Precompute or maintain cumulative metrics for fast interval queries.

### Log/event analysis

Detect intervals satisfying count/balance conditions.

Production systems must also consider late events, ordering, time zones, correction events, retention, and distributed aggregation. A textbook prefix sum assumes an ordered, well-defined sequence.

## 24. AI Engineering Applications

Prefix-state hashing can support:

- token-stream statistics;
- cumulative cost/token-budget tracking;
- sequence-window constraints;
- search-state signatures;
- cumulative feature counts;
- detecting repeated sequence states;
- exact memoization of sequence prefixes.

For AI pipelines, define whether “same state” means exact equality, normalized equality, or semantic similarity. A normal Map only provides exact key semantics.

## 25. Common Mistakes

1. Forgetting the initial prefix state.
2. Mixing inclusive and exclusive range conventions.
3. Storing membership when frequency is required.
4. Storing the latest index when the longest range needs the earliest index.
5. Overwriting the earliest prefix index.
6. Assuming values must be non-negative.
7. Using floating-point arithmetic for exact integer relationships without considering precision.
8. Confusing prefix sums with subarray sums.
9. Building an entire prefix array when a streaming Map is sufficient.
10. Using an incomplete state signature.
11. Forgetting that multiple equal prefix states create multiple valid subarrays.
12. Ignoring memory growth when the number of distinct prefix states is large.

## 26. Edge Cases & Failure Modes

Test:

- empty array;
- one element;
- target `0`;
- all zeros;
- all negative values;
- mixed positive and negative values;
- repeated prefix states;
- no matching state;
- every possible subarray matching;
- very large sums;
- duplicate-heavy state distributions;
- large input with many distinct prefix states.

## 27. Interview Problem Families

Recognize these signals:

| Signal | Likely technique |
|---|---|
| range sum queries | prefix sum |
| count subarrays with sum `k` | prefix sum + frequency Map |
| longest subarray with sum `k` | prefix sum + earliest-index Map |
| zero-sum subarray | repeated prefix state |
| equal 0/1 counts | transform + prefix state |
| even/odd range property | parity prefix state |
| zero XOR range | prefix XOR + Set/Map |
| repeated cumulative state | prefix state + Set/Map |
| many static interval queries | preprocessing |

## 28. Problem-Solving Framework

When you see a subarray problem:

```text
1. Is the range contiguous?
2. What property defines a valid range?
3. Can the property be expressed using two prefix states?
4. What is the prefix state?
5. What previous state is compatible with the current state?
6. Do I need existence, count, earliest index, or latest index?
7. Which Map value should I store?
8. What is the invariant?
9. What is the expected time and auxiliary space?
10. Are key construction or numeric precision costs significant?
```

## 29. Implementation Lab

For every exercise:

```text
A. Write the brute-force subarray enumeration.
B. Derive the prefix equation.
C. Rearrange the equation to find the required prior state.
D. Decide Set vs frequency Map vs index Map.
E. Define the initial prefix state.
F. State the invariant.
G. Implement the one-pass algorithm.
H. Prove why each discovered state represents a valid range.
I. Analyze time and auxiliary space.
J. Test negative, zero, duplicate-state, and boundary cases.
```

## 30. Revision Checklist

- [ ] I can derive a prefix-sum range formula.
- [ ] I understand the half-open indexing convention.
- [ ] I can count target-sum subarrays with a frequency Map.
- [ ] I can find the longest target-sum subarray with earliest indices.
- [ ] I understand why `frequency[0] = 1` is necessary.
- [ ] I can transform equal-0/1 problems into zero-sum problems.
- [ ] I can apply prefix XOR.
- [ ] I can design non-sum prefix states.
- [ ] I can distinguish count vs earliest-index vs latest-index storage.
- [ ] I can reason about negative values.
- [ ] I can apply prefix hashing in streaming systems.
- [ ] I can explain backend and AI applications.
- [ ] I can derive the correctness invariant.
- [ ] I can derive expected time and auxiliary space.

## 31. Key Takeaways

1. **A subarray is the difference between two prefix boundaries.**
2. **Prefix hashing turns range relationships into Map lookups.**
3. **The equation determines exactly what previous state must be stored.**
4. **Counting requires frequencies; longest-range problems usually require earliest indices.**
5. **Prefix state can represent sums, XOR, parity, balances, or other compressed state.**
6. **Transformations can convert unfamiliar problems into known prefix patterns.**
7. **The initial prefix state is a correctness requirement, not an implementation detail.**
8. **Streaming prefix hashing can avoid storing the entire prefix array.**
9. **Always define the state, invariant, complexity, and numeric assumptions before coding.**
