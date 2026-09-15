# 10.02 — Two Pointers: Foundations, Invariants & Advanced Patterns

## 1. Objective

Two pointers is a family of techniques that maintains two positions over a sequence while using structure to avoid reconsidering the same state repeatedly.

The core idea is:

```text
maintain positions
→ inspect relationship
→ eliminate impossible states
→ move pointer(s) monotonically
```

## 2. Why It Exists

Brute-force pair or range problems often examine the same elements repeatedly.

Two pointers can reduce repeated exploration when the input or predicate provides enough structure to justify monotonic movement.

## 3. Basic Forms

Common forms include:

1. opposite ends;
2. same-direction fast/slow;
3. read/write pointers;
4. partition pointers;
5. merge pointers;
6. variable-distance pointers.

## 4. Opposite-End Model

For sorted data, initialize:

```text
left = 0
right = n - 1
```

Then compare the current pair and determine which region cannot contain the answer.

## 5. The Critical Proof

Moving a pointer is only correct when you can prove that the discarded region cannot contain a valid solution.

For a sorted two-sum problem:

- if the sum is too small, increasing `left` is the only direction that can increase the sum;
- if the sum is too large, decreasing `right` is the only direction that can decrease it.

This is the reasoning that makes the algorithm correct.

## 6. Same-Direction Model

Both pointers can move forward:

```text
slow ≤ fast
```

Examples include:

- removing duplicates;
- compaction;
- partitioning;
- merging filtered data;
- maintaining a valid prefix.

## 7. Fast/Slow Pointers

A fast pointer explores while a slow pointer marks a structural boundary.

The two speeds need not literally differ in every problem; the important concept is that each pointer has a distinct role.

## 8. Read/Write Pointers

Use one pointer to read every element and another to write retained elements.

Example mental model:

```text
read → inspect
write → commit valid value
```

This supports in-place filtering with `O(1)` auxiliary space when mutation is allowed.

## 9. Merge Pointers

Two sorted sequences can be merged using one pointer per sequence.

At each step, compare the current heads and consume the smaller item.

Each input element is consumed once, giving linear total work in the combined input size.

## 10. Three-Pointer Extensions

Some problems use:

```text
left + middle + right
```

Examples include 3-way partitioning and three-sum reasoning.

The proof must identify what region each pointer represents.

## 11. Sorting as a Precondition

Many two-pointer algorithms require sorted input.

If input is unsorted, there may be two choices:

```text
sort + two pointers
```

or

```text
hashing / another direct method
```

Compare preprocessing cost, memory, output requirements, and query frequency.

## 12. Two Sum

For sorted values:

```text
sum < target → left++
sum > target → right--
sum == target → found
```

Complexity after sorting is `O(N)` for one scan.

If sorting is required first, include `O(N log N)` preprocessing.

## 13. Duplicate Handling

Duplicates can change pointer movement and output semantics.

For unique combinations, explicitly skip equivalent values at the correct pointer boundaries.

Do not skip duplicates without proving that doing so cannot remove a required result.

## 14. Pair Counting

Counting pairs is different from finding one pair.

When equal values create multiple combinations, the algorithm must account for multiplicity.

This may require grouping runs or using frequency information.

## 15. Closest Pair / Closest Sum

Two pointers can maintain the best distance seen while using ordering to decide which pointer can improve the current candidate.

The invariant should state what the current best answer represents.

## 16. Partitioning

Partition algorithms maintain regions with different properties.

Example:

```text
[processed-low][unknown][processed-high]
```

The pointer movements preserve the region invariant.

## 17. Dutch National Flag

Three regions can be maintained for values below, equal to, and above a pivot/category.

The important skill is defining the unknown region and proving that each operation shrinks it.

## 18. Container / Boundary Problems

Some geometry problems use two ends and move the pointer associated with the limiting boundary.

The correctness argument must show why keeping the non-limiting boundary cannot produce a better result after the movement.

## 19. String Two Pointers

Two pointers can compare strings from opposite or same directions.

Applications include:

- palindrome checks;
- subsequence matching;
- normalized comparison;
- merging token sequences.

## 20. Subsequence Matching

For checking whether `A` is a subsequence of `B`:

```text
pointerA
pointerB
```

Advance `B` continuously and advance `A` only when a match occurs.

Each pointer moves forward only, giving linear work in the input lengths.

## 21. Sliding Window Connection

Sliding window is a specialized two-pointer technique where the two pointers define a contiguous interval.

```text
left ... right
```

The distinction is useful:

```text
two pointers → general pointer relationship
sliding window → pointers define active contiguous state
```

## 22. Variable-Distance Pointers

Pointers may move by different amounts based on the current state.

The essential requirement remains monotonic progress and a correctness argument for every skipped region.

## 23. Linked-Structure Two Pointers

Two pointers also work on linked lists.

Examples:

- cycle detection;
- midpoint finding;
- nth-from-end;
- intersection detection.

Here pointer movement is based on node references rather than array indices.

## 24. Cycle Detection

Floyd's method uses slow and fast movement.

A cycle causes the relative positions to eventually coincide under the standard assumptions.

The proof depends on reasoning about relative speed modulo the cycle length.

## 25. Nth Node From End

Maintain a fixed gap between two pointers.

After the leading pointer reaches the end, the trailing pointer is at the desired offset.

The invariant is the fixed distance between them.

## 26. Intersection of Linked Lists

A pointer-switching technique can equalize path lengths when two singly linked lists share a suffix.

The reasoning depends on each pointer traversing the combined path lengths.

## 27. Invariants

Typical two-pointer invariants:

### Opposite ends

> Every region already discarded cannot contain a valid solution.

### Read/write

> All positions before the write pointer contain exactly the retained elements processed so far.

### Merge

> The output prefix contains the smallest remaining elements from both inputs in correct order.

### Fast/slow

> The pointer relationship maintains the required distance or structural property.

## 28. Complexity

Many two-pointer algorithms are `O(N)` because each pointer moves monotonically and each element is processed a bounded number of times.

Do not infer `O(N)` merely from seeing two pointers. Prove the total movement.

## 29. Common Mistakes

1. Applying two pointers to unsorted data without justification.
2. Moving a pointer without proving the discarded region is impossible.
3. Mishandling duplicates.
4. Confusing finding a pair with counting all pairs.
5. Forgetting sorting cost.
6. Creating unnecessary arrays when an in-place contract is required.
7. Using nested pointer loops that revisit positions without bounded movement.
8. Mixing index and value semantics.

## 30. Edge Cases

Test:

- empty input;
- one element;
- two elements;
- all duplicates;
- negative values;
- zero;
- extreme numeric values;
- target absent;
- target repeated;
- odd/even linked-list length;
- cyclic and acyclic lists.

## 31. Backend Applications

Two-pointer reasoning appears in:

- merging sorted API streams;
- log reconciliation;
- time-range overlap;
- ordered event comparison;
- pagination merge;
- memory-efficient filtering.

## 32. AI Applications

Applications include:

- merging ranked candidate streams;
- sequence alignment preprocessing;
- token/subsequence matching;
- ordered candidate reconciliation;
- pairwise similarity workflows.

## 33. Interview Framework

When you see a potential two-pointer problem:

```text
1. Is there useful ordering?
2. What does each pointer represent?
3. What region can be eliminated?
4. Why is that region impossible?
5. Do pointers move monotonically?
6. What invariant is preserved?
7. What is total pointer movement?
8. How do duplicates affect the result?
```

## 34. Revision Checklist

- [ ] I understand opposite-end pointers.
- [ ] I understand same-direction pointers.
- [ ] I understand read/write pointers.
- [ ] I understand merge pointers.
- [ ] I can prove pointer movement.
- [ ] I can handle duplicates correctly.
- [ ] I can connect two pointers to sliding windows.
- [ ] I understand linked-list pointer techniques.
- [ ] I can derive complexity from total movement.
- [ ] I can explain two-pointer solutions in an interview.

## 35. Key Takeaways

1. **Two pointers is fundamentally about eliminating repeated states through justified monotonic movement.**
2. **Sorting often supplies the ordering that makes pointer movement provably safe.**
3. **The invariant explains what each pointer means and why discarded regions can be ignored.**
4. **Sliding windows, merge scans, partitioning, and fast/slow techniques are related members of the broader pointer family.**
5. **The expert skill is proving why every pointer movement is safe, not memorizing pointer increments.**
