# 03.6 — Two Pointers

## Definition

The **two-pointer technique** maintains two indices that move through a sequence according to a proven rule. Instead of repeatedly reconsidering the same candidates, the algorithm eliminates or processes regions of the search space as pointers move.

The key idea is not simply “use two variables.” It is:

> **Design pointer movement so that every pointer advances monotonically and the invariant tells you why discarded candidates cannot become the answer.**

## Why It Matters

Two pointers are one of the highest-value array techniques because they can turn many quadratic pair/search problems into linear or near-linear algorithms.

Typical transformations:

- `O(n²)` pair enumeration → `O(n)` after sorting
- repeated shifting → one read pointer + one write pointer
- merging sorted sequences → `O(n + m)`
- comparing both ends → `O(n)`
- selecting candidates from opposite ends → one-pass elimination

It is also a foundation for sliding-window algorithms and several linked-list techniques introduced later.

---

## Mental Model

Imagine the array as a search space.

```text
left  → → →        ← ← ←  right
[  ... candidate region ...  ]
```

At every step:

1. inspect the state represented by the pointers;
2. determine which candidates remain possible;
3. eliminate an impossible region;
4. move one or both pointers;
5. preserve the invariant.

A correct two-pointer solution therefore needs four things:

- pointer meaning;
- pointer movement rule;
- invariant;
- termination condition.

---

## Main Families

### 1. Opposite-Direction Pointers

Pointers start at both ends.

```js
let left = 0;
let right = arr.length - 1;
```

Useful for:

- pair sum in sorted arrays;
- palindrome checks;
- reversing an array;
- container/area problems;
- partitioning from both sides.

### 2. Same-Direction Pointers

Both pointers move from left to right, usually at different rates or with different responsibilities.

Common meanings:

- `read` scans every element;
- `write` marks the next output position.

Useful for:

- removing duplicates in-place;
- removing selected values;
- compaction;
- stable filtering.

### 3. Fast/Slow Pointers

One pointer may advance faster than another. In arrays this can model a moving read position and a slower retained position. Linked-list applications come later.

### 4. Merge Pointers

One pointer tracks each sorted sequence.

```text
A: [1, 4, 8, 12]
     ^
B: [2, 3, 9]
     ^
```

Compare the current values and advance the pointer whose value was consumed.

---

# Pattern 1 — Pair Sum in a Sorted Array

Given a sorted array and target `T`:

```text
[1, 2, 4, 7, 9, 12]
 ^              ^
 L              R
```

Let `sum = arr[left] + arr[right]`.

- If `sum === T`, found a pair.
- If `sum < T`, increase `left`.
- If `sum > T`, decrease `right`.

### Why Movement Is Safe

Because the array is sorted:

- if the current sum is too small, keeping `left` while decreasing `right` can only make the sum smaller;
- therefore `right` cannot solve the problem, so `left` must advance.

The symmetric argument applies when the sum is too large.

### Complexity

- Time: `O(n)`
- Auxiliary space: `O(1)`

Sorting first, if the input is not sorted, costs typically `O(n log n)` and may alter the original order unless a copy or indexed representation is used.

---

# Pattern 2 — Remove Duplicates In-Place

For a sorted array, duplicates are adjacent.

Use:

- `read` — scans every element;
- `write` — points to the next unique position.

Invariant:

> Before processing `read`, positions before `write` contain exactly the unique values encountered so far, in original sorted order.

This gives `O(n)` time and `O(1)` auxiliary space.

---

# Pattern 3 — Remove an Element In-Place

The same read/write structure can compact values that should remain.

```js
let write = 0;

for (let read = 0; read < arr.length; read++) {
  if (arr[read] !== target) {
    arr[write] = arr[read];
    write++;
  }
}
```

The logical result occupies `arr[0 .. write - 1]`.

Do not confuse the logical length with the physical JavaScript array length unless the problem explicitly requires resizing.

---

# Pattern 4 — Move Zeroes

A stable version uses a write pointer for the next non-zero value.

Conceptually:

1. scan all elements;
2. compact non-zero values toward the front;
3. fill the remaining suffix with zeroes.

This is a general **stable compaction** pattern.

---

# Pattern 5 — Reverse In-Place

Start from both ends:

```js
while (left < right) {
  // swap
  left++;
  right--;
}
```

Invariant:

> Everything outside `[left, right]` is already in its final position.

Each iteration fixes two positions.

Time is `O(n)` and auxiliary space is `O(1)`.

---

# Pattern 6 — Merge Two Sorted Arrays

Maintain one pointer per input.

At each step:

```text
A[i] <= B[j] → consume A[i]
A[i] >  B[j] → consume B[j]
```

Every element is consumed once.

Complexity:

- Time: `O(n + m)`
- Output space: `O(n + m)` for a new merged array
- Auxiliary space: `O(1)` excluding the required output, depending on implementation.

The distinction between **output space** and **auxiliary space** matters.

---

# Pattern 7 — Intersection and Union of Sorted Arrays

Two sorted arrays can be processed simultaneously.

For intersection:

- equal → record once and advance appropriately;
- smaller value → advance that array's pointer.

For union:

- emit the smaller value;
- on equality, emit once and advance both;
- continue remaining values.

Duplicate policy must be specified before implementation.

---

# Pattern 8 — Sorted Squares

A sorted array containing negative and positive numbers does not produce sorted squares.

The largest square must come from one of the two ends because magnitude increases toward an end.

Therefore:

- compare `abs(arr[left])` and `abs(arr[right])`;
- place the larger square at the current output position from right to left;
- move the corresponding pointer.

This is a good example of **representation reasoning**: the useful order is based on absolute magnitude, not numeric value.

---

# Pattern 9 — Partitioning

Two pointers can divide an array according to a predicate.

Examples:

- values `< pivot` vs values `>= pivot`;
- negative vs non-negative;
- valid vs invalid records.

But there is an important distinction:

- ordinary partitioning does not necessarily preserve order;
- stable partitioning requires additional work or a read/write compaction strategy.

Always state whether stability is required.

---

# Pattern 10 — Three Sum

Three Sum is a composition pattern:

1. sort the array;
2. fix one element `i`;
3. solve the remaining two-sum problem with two pointers;
4. skip duplicates carefully.

Typical complexity:

- sorting: `O(n log n)`;
- outer loop: `O(n)`;
- two-pointer scan per fixed element: `O(n)`;
- total: `O(n²)`.

This demonstrates an important principle:

> Two pointers do not automatically make a problem `O(n)`; the surrounding algorithm determines the final complexity.

---

# Pattern 11 — Closest Pair Sum

For a sorted array, compare the current pair against the best distance from the target.

- sum too small → move `left`;
- sum too large → move `right`;
- exact target → optimal and may terminate immediately.

The invariant is based on monotonicity of the pair sum as a pointer moves.

---

# Pattern 12 — Container / Maximum Area

With heights at both ends:

```text
area = min(height[left], height[right]) * (right - left)
```

The pointer at the shorter boundary must move inward.

Why?

The width decreases after any movement. Keeping the shorter boundary cannot produce a larger limiting height by moving the taller boundary alone, so that candidate can be safely eliminated.

This is an important example of **proof-driven pointer movement** rather than memorizing a pattern.

---

# Pointer Monotonicity

A powerful test for a two-pointer algorithm is:

> **Does each pointer move monotonically, and can every skipped candidate be proven impossible?**

If a pointer sometimes needs to move backward, ordinary two-pointer reasoning may no longer apply.

Monotonic movement gives a strong complexity bound because each pointer can move only a limited number of times.

For two pointers over an array:

```text
left  : 0 → n
right : n → 0
```

Total pointer movements are `O(n)`, not `O(n²)`.

---

# Two Pointers vs Brute Force

Consider pair sum.

### Brute Force

Check every pair:

```text
(i, j)
```

There are approximately `n² / 2` pairs.

Time: `O(n²)`.

### Sorted + Two Pointers

Sort once and eliminate entire regions of pairs using monotonicity.

Time:

```text
O(n log n) + O(n) = O(n log n)
```

If the array is already sorted, the search itself is `O(n)`.

### Hashing Alternative

For an unsorted array, a hash-based solution can often achieve expected `O(n)` time with `O(n)` extra space.

Therefore the correct question is not:

> “Can I use two pointers?”

It is:

> “Which representation and invariant give the best solution under the constraints?”

---

# When Two Pointers Works Well

Look for:

- sorted data;
- monotonic relationships;
- pair relationships;
- comparisons from both ends;
- merging sorted sequences;
- stable compaction;
- partitioning;
- one-pass processing where pointer movement never needs to reverse.

# When Not to Use It

Do not force two pointers when:

- the data is unsorted and hashing is clearly better;
- there is no monotonicity supporting pointer elimination;
- arbitrary previous positions must be revisited;
- pointer movement cannot be proven safe;
- the problem requires random access to many unrelated ranges;
- sorting would destroy required original-order semantics and no index mapping is allowed.

---

# Invariants: The Core Skill

For every two-pointer problem, write a sentence such as:

### Pair Sum
> All pairs excluded by the current pointer movement cannot contain the target.

### Remove Duplicates
> `arr[0..write-1]` contains the unique values processed so far.

### Reverse
> Values outside the active interval are already in final positions.

### Merge
> Everything already emitted is the smallest possible next prefix of the merged order.

### Partition
> The processed region satisfies the required predicate arrangement.

If you cannot state the invariant clearly, the pointer movement probably has not been justified yet.

---

# JavaScript Considerations

JavaScript arrays are mutable and operations such as `shift()` and `unshift()` can involve moving many elements. For algorithmic exercises, pointer/index manipulation is usually preferable when the goal is linear-time processing.

Be careful with:

- mutation of the caller's array;
- copying before sorting;
- `splice()` hidden shifting costs;
- sparse arrays;
- duplicate handling;
- numeric precision for large values;
- returning logical length vs a resized array;
- accidentally moving both pointers when only one is justified.

---

# Backend Applications

Two-pointer reasoning appears outside interview problems.

### Sorted ID Reconciliation

Compare two sorted ID streams to identify:

- missing records;
- newly added records;
- common records.

### Pagination / Stream Alignment

Align two ordered event streams using one cursor per stream.

### Log Reconciliation

Compare timestamp-ordered logs from two services without repeatedly rescanning either log.

### Batch Merge

Merge already sorted database/query batches efficiently.

### Deduplication

After sorting identifiers, a write pointer can compact duplicates before bulk insertion.

The production question is always broader than Big-O:

- Is sorting worth the cost?
- Is the data already ordered?
- Does mutation matter?
- Can the entire input fit in memory?
- Would streaming be better?

---

# AI Applications

Two-pointer ideas also appear in AI/data pipelines.

### Ranked-List Intersection

Two retrieval systems may produce sorted candidate IDs or scores. Pointer-based merging can efficiently compute intersections or unions.

### Candidate Merge

Merge sorted candidate streams from multiple retrieval sources before deduplication or reranking.

### Token Sequence Comparison

Compare sequences from both ends or align ordered sequences where the comparison rule is monotonic.

### Retrieval Filtering

When candidates are sorted by an agreed key, two pointers can avoid repeatedly scanning both candidate sets.

The underlying principle remains the same:

> exploit ordering to eliminate work.

---

# Complexity Summary

| Pattern | Typical Time | Auxiliary Space |
|---|---:|---:|
| Pair sum, sorted | `O(n)` | `O(1)` |
| Reverse in-place | `O(n)` | `O(1)` |
| Remove duplicates | `O(n)` | `O(1)` |
| Stable compaction | `O(n)` | `O(1)` |
| Merge sorted arrays | `O(n+m)` | `O(1)` excluding output |
| Sorted intersection | `O(n+m)` | output-dependent |
| Sorted squares | `O(n)` | output-dependent |
| Three Sum | `O(n²)` after sorting | usually `O(1)` auxiliary excluding output |
| Pair sum after sorting | `O(n log n)` | depends on sorting/copy strategy |

Always separate **algorithm time**, **auxiliary space**, and **required output space**.

---

# Common Mistakes

1. Using two pointers without a monotonicity argument.
2. Moving the wrong pointer after a comparison.
3. Forgetting `left < right` boundaries.
4. Mishandling duplicate values.
5. Sorting when original order must be preserved.
6. Claiming `O(n)` when sorting first costs `O(n log n)`.
7. Calling an output array “auxiliary space” without qualification.
8. Accidentally mutating input.
9. Returning the wrong logical length after in-place compaction.
10. Assuming two pointers always means exactly two moving indices.
11. Ignoring empty and singleton arrays.
12. Failing to prove why skipped candidates cannot become valid later.

---

# Interview Framework

When given a two-pointer problem, explain it in this order:

1. **Contract** — what exactly must be returned?
2. **Ordering** — is the input sorted or can sorting be allowed?
3. **Pointer meaning** — what does each pointer represent?
4. **Invariant** — what remains true after every iteration?
5. **Movement rule** — why can one pointer safely advance?
6. **Termination** — when is the search space exhausted?
7. **Complexity** — count sorting, scanning, output, and auxiliary memory separately.
8. **Edge cases** — empty, singleton, duplicates, all equal, negatives, boundaries.
9. **Alternatives** — compare hashing, sorting, brute force, or another representation.

---

# Revision Checklist

- [ ] I can identify opposite-direction two pointers.
- [ ] I can identify same-direction read/write pointers.
- [ ] I can explain pointer monotonicity.
- [ ] I can solve pair sum on sorted data.
- [ ] I can reverse an array in-place.
- [ ] I can remove duplicates in-place.
- [ ] I can perform stable compaction.
- [ ] I can merge sorted arrays.
- [ ] I can find intersections/unions of sorted arrays.
- [ ] I can solve sorted squares.
- [ ] I understand partitioning and stability.
- [ ] I understand Three Sum as a composed pattern.
- [ ] I can prove pointer movement with an invariant.
- [ ] I can distinguish two pointers from sliding window.
- [ ] I can compare two pointers with hashing.
- [ ] I can calculate complexity including sorting.
- [ ] I can explain backend applications.
- [ ] I can explain AI/data-pipeline applications.

## Key Takeaways

1. Two pointers are fundamentally about **safe search-space elimination**.
2. Pointer movement must be justified by **ordering, monotonicity, or a maintained invariant**.
3. Same-direction read/write pointers are a powerful in-place compaction pattern.
4. Sorting can create the ordering required for two pointers, but its cost must be included.
5. Two pointers do not imply `O(n)` for the entire algorithm; composition matters.
6. The best DSA solution comes from choosing the right representation, not from memorizing named patterns.
