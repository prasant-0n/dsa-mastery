# 03.4 — Array Searching

## Definition

Array searching is the process of locating an element, deciding whether a value exists, or finding an index that satisfies a condition.

The fundamental question is:

> **What information does the array already give us that can reduce the search space?**

For an unsorted array, a linear scan is usually unavoidable in the worst case. If the array is sorted, binary search can reduce the search space logarithmically.

---

## Why Searching Matters

Searching is one of the most reusable DSA operations. It appears inside:

- duplicate detection
- lookup systems
- filtering
- interval processing
- two-pointer algorithms
- binary search
- indexing
- caching
- database query planning
- AI retrieval pipelines

The important skill is not memorizing `indexOf()`. It is recognizing the **structure and guarantees** that make a faster search possible.

---

## Mental Model

A search algorithm repeatedly answers:

```text
Where could the answer still be?
```

For a linear scan:

```text
candidate space shrinks by one element
```

For binary search on a sorted array:

```text
candidate space is roughly halved
```

The second strategy is faster because sortedness provides information that allows entire regions to be eliminated.

---

## Linear Search

Given:

```js
const arr = [7, 2, 9, 4, 1];
```

To find `4`:

```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

Worst case:

```text
Θ(n)
```

Best case:

```text
Θ(1)
```

Auxiliary space:

```text
Θ(1)
```

---

## Why Linear Search Is Sometimes Optimal

Suppose the array is unsorted and we need exact membership.

If the target is not present, an algorithm may need to inspect every element.

Therefore the worst-case lower bound is:

```text
Ω(n)
```

A linear scan achieves:

```text
O(n)
```

So it is asymptotically optimal under the ordinary comparison model for an unsorted array with no extra preprocessing/index.

---

## First Match

Often the contract asks for the first occurrence.

```js
function firstIndexOf(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

The early return is not just a micro-optimization. It directly expresses the problem contract.

Invariant:

> Before checking index `i`, no index before `i` contains the target.

---

## Last Match

To find the last occurrence:

```js
function lastIndexOfValue(arr, target) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

The same `O(n)` worst-case complexity applies, but reverse traversal can make the common case faster when the target tends to occur near the end.

---

## Search by Predicate

Many problems are not really “find value X.” They are:

> Find the first element satisfying condition P.

Example:

```js
function firstGreaterThan(arr, limit) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > limit) return i;
  }
  return -1;
}
```

This generalization is extremely important because later patterns build on predicates rather than exact equality.

---

## Boolean Search

If the contract only asks whether an element exists:

```js
function contains(arr, target) {
  for (const value of arr) {
    if (value === target) return true;
  }
  return false;
}
```

Do not continue scanning after the answer is known.

This is an example of **short-circuiting**.

---

## `includes()` and `indexOf()`

JavaScript provides:

```js
arr.includes(target);
arr.indexOf(target);
```

These are convenient for ordinary equality-based searches.

For DSA practice, you should still understand how to implement the underlying scan manually because the algorithmic reasoning is more general than the built-in API.

---

## Searching Objects by Property

Example:

```js
const users = [
  { id: 10, name: "A" },
  { id: 20, name: "B" }
];
```

A linear search can find an ID:

```js
function findUser(users, id) {
  for (const user of users) {
    if (user.id === id) return user;
  }
  return null;
}
```

Complexity is still `O(n)` if no additional index exists.

The fact that the elements are objects does not magically make lookup constant-time.

---

## Multiple Queries: A Critical Optimization Question

Suppose we have:

```text
N array elements
Q search queries
```

Performing a linear scan for every query costs:

```text
O(NQ)
```

If many membership queries are required, preprocessing may help.

For example, build a `Set`:

```js
const lookup = new Set(arr);
```

Then repeated average-case membership checks can be approximately:

```text
Build:   O(N)
Queries: O(Q) expected
Total:   O(N + Q) expected
```

with `O(N)` additional memory.

This is a classic time-space trade-off.

---

## Search vs Indexing

A search asks:

```text
Where is this value?
```

An index changes the representation so the answer can be obtained faster.

Examples:

```text
array scan → O(n)
Set lookup → expected O(1)
binary search on sorted array → O(log n)
Map key lookup → expected O(1)
```

But each requires different assumptions and has different update costs.

---

## Sorted Arrays Change the Problem

Consider:

```text
[2, 5, 8, 12, 17, 21, 30]
```

If searching for `17`, sortedness tells us that after inspecting the middle, an entire half can be eliminated.

This enables binary search.

The key insight is:

> **Binary search is not merely a faster loop; it is an algorithm enabled by an ordering invariant.**

---

## Binary Search

Basic implementation:

```js
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

Time:

```text
O(log n)
```

Auxiliary space:

```text
O(1)
```

provided the implementation is iterative.

---

## Binary Search Preconditions

Before using binary search, verify:

```text
□ the search domain is ordered
□ the ordering relation is known
□ the predicate is monotonic in the relevant form
□ the bounds are correct
□ the answer is within the represented domain
```

Without the necessary ordering/monotonicity guarantee, binary search is invalid.

---

## Binary Search Invariant

A useful invariant for exact search is:

> If the target exists, it lies within the current inclusive interval `[left, right]`.

Every iteration must preserve this statement.

If `arr[mid] < target` in an ascending array, everything at or before `mid` is too small, so:

```text
left = mid + 1
```

If `arr[mid] > target`, everything at or after `mid` is too large, so:

```text
right = mid - 1
```

---

## Why Binary Search Is O(log n)

Each iteration approximately halves the remaining search space:

```text
n
n/2
n/4
n/8
...
1
```

We ask how many halvings are required to reach one element:

```text
n / 2^k ≈ 1
```

Therefore:

```text
2^k ≈ n
k ≈ log₂ n
```

So the running time is:

```text
Θ(log n)
```

---

## First Occurrence in a Sorted Array

Ordinary binary search may return any matching duplicate.

For:

```text
[1, 2, 2, 2, 5]
```

if the contract asks for the first `2`, the algorithm must continue searching left after finding a match.

Typical pattern:

```text
answer = -1

if match:
    answer = mid
    move left
```

This is a foundation for boundary-search problems.

---

## Last Occurrence

Similarly, for the last matching value:

```text
if match:
    answer = mid
    move right
```

Both first- and last-occurrence searches remain:

```text
O(log n)
```

---

## Lower Bound

A lower-bound search finds the first index where:

```text
arr[i] >= target
```

For an ascending sorted array:

```text
[1, 3, 3, 7, 9]
```

lower bound of `3` is index `1`.

Lower bounds are more general than exact membership and become extremely useful in interval, scheduling, and optimization problems.

---

## Upper Bound

An upper bound finds the first index where:

```text
arr[i] > target
```

For:

```text
[1, 3, 3, 7, 9]
```

upper bound of `3` is index `3`.

The count of values equal to `target` can then be calculated as:

```text
upperBound(target) - lowerBound(target)
```

This is an important example of solving a counting problem through boundary searches.

---

## Searching a Rotated Sorted Array

Example:

```text
[4, 5, 6, 7, 0, 1, 2]
```

The entire array is not sorted, but at least one half around the midpoint is sorted.

The algorithm can determine which half is sorted and whether the target lies within that range.

This is a more advanced use of binary-search reasoning: exploit a partial ordering invariant rather than requiring global sortedness.

---

## Monotonic Predicate Search

Binary search does not fundamentally require searching for an exact array value.

It can search for the boundary of a monotonic predicate:

```text
false false false false true true true
                    ↑ first true
```

The task becomes:

> Find the smallest position where the predicate becomes true.

This is the conceptual bridge to **binary search on the answer**, covered later in the roadmap.

---

## Brute Force vs Optimized Search

Suppose we need to find whether a value exists in a sorted array.

Brute force:

```text
linear scan → O(n)
```

Optimized:

```text
binary search → O(log n)
```

The optimization is possible because sortedness provides an elimination rule.

Without sortedness, binary search cannot simply be applied.

---

## Search and Mutation

Searching and modifying an array are related but should be analyzed separately.

For example:

```text
find target → O(n)
delete target → potentially O(n)
```

Together, the operation may still be `O(n)`.

If many searches and deletions occur, the data structure may need to change rather than repeatedly scanning and shifting.

This is where algorithm selection becomes a data-structure problem.

---

## Search Complexity Table

| Strategy | Preconditions | Search | Extra Space |
|---|---|---:|---:|
| Linear scan | None | O(n) | O(1) |
| Reverse scan | None | O(n) | O(1) |
| Set lookup | Hashable values / suitable equality | Expected O(1) | O(n) |
| Binary search | Sorted/monotonic domain | O(log n) | O(1) |
| First/last binary boundary | Sorted/monotonic domain | O(log n) | O(1) |
| Rotated sorted search | Specific rotation structure | O(log n) in standard distinct-value case | O(1) |

The table describes asymptotic models, not guarantees for every JavaScript engine or workload.

---

## Common Mistakes

### 1. Using binary search on unsorted data

Sortedness or an equivalent monotonic property is required.

### 2. Incorrect midpoint logic

Prefer:

```js
const mid = left + Math.floor((right - left) / 2);
```

### 3. Infinite binary-search loops

Every iteration must shrink the search interval.

### 4. Returning immediately for first/last occurrence

A match is not necessarily the required boundary.

### 5. Ignoring duplicate values

Exact search and boundary search are different contracts.

### 6. Forgetting the preprocessing cost

A sorted array or `Set` may require construction work and memory.

### 7. Assuming Set lookup is deterministic O(1)

The usual analysis is expected/amortized under a hash-table model, not an unconditional mathematical guarantee for every implementation/workload.

---

## Edge Cases

```text
□ empty array
□ one element
□ target at first index
□ target at last index
□ target absent
□ duplicate targets
□ all values equal
□ already sorted
□ reverse sorted
□ negative values
□ insertion/deletion after search
□ invalid binary-search bounds
□ target smaller than minimum
□ target larger than maximum
```

---

## Backend Applications

Search appears in:

- locating records in in-memory batches
- checking duplicate request IDs
- finding pagination boundaries
- selecting items from sorted result sets
- cache membership checks
- maintaining ordered event sequences
- threshold/boundary detection

For repeated lookup workloads, ask whether an index, hash structure, or sorted representation should replace repeated scans.

---

## AI Applications

Search is foundational in AI engineering:

- candidate lookup
- top-K boundary selection
- sorted score lists
- token/sequence searches
- beam-search state lookup
- retrieval thresholds
- nearest-neighbor candidate filtering

Exact vector search can still require scanning many vectors; faster retrieval systems rely on additional structure and approximate algorithms. The same core idea applies: **use structure to eliminate candidates.**

---

## Interview Framework

When asked to design a search algorithm:

```text
1. What exactly must be returned?
2. Is the data sorted?
3. Is there a monotonic predicate?
4. Is preprocessing allowed?
5. How many queries are there?
6. Is extra memory allowed?
7. Are duplicates possible?
8. Is the first/last occurrence required?
9. What is the worst-case complexity?
10. What invariant proves correctness?
```

---

## Revision Checklist

- [ ] I can implement linear search.
- [ ] I can explain its lower bound on unsorted data.
- [ ] I understand predicate-based searching.
- [ ] I understand early termination.
- [ ] I can explain search vs indexing.
- [ ] I can implement iterative binary search.
- [ ] I can state binary-search preconditions.
- [ ] I can state and maintain the binary-search invariant.
- [ ] I can implement first occurrence.
- [ ] I can implement last occurrence.
- [ ] I understand lower and upper bounds.
- [ ] I understand monotonic predicate search.
- [ ] I can compare scan, Set, and binary search.
- [ ] I can reason about preprocessing/query trade-offs.

---

## Key Takeaways

1. **Linear search is the baseline for arbitrary unsorted arrays.**
2. **Binary search is enabled by ordering or monotonicity.**
3. **Search complexity depends on how aggressively the algorithm can eliminate candidates.**
4. **First/last occurrence requires boundary reasoning, not just equality detection.**
5. **Repeated queries can justify preprocessing into a Set, Map, or sorted index.**
6. **Preprocessing changes the total cost model; never hide it.**
7. **Binary-search correctness comes from a shrinking search-space invariant.**
8. **Many “search” problems are really boundary-finding problems.**
9. **Backend and AI retrieval systems apply the same search-space reduction principle at larger scales.**
10. **The right search algorithm follows from the data's guarantees and workload.**
