# 03.10 — In-Place Array Techniques

## Definition

An **in-place algorithm** transforms an input data structure while using only a small amount of additional working memory. The output may be stored inside the original array rather than in a separate full-size array.

The important distinction is:

> In-place is a statement about **auxiliary memory**, not about whether the input is mutated.

An algorithm may mutate in place, while another algorithm may use an existing output buffer or overwrite only a logical prefix.

---

## Why It Matters

In-place techniques are valuable when:

- memory is constrained;
- arrays are large;
- allocation and garbage collection matter;
- the contract permits mutation;
- streaming/embedded environments require bounded memory;
- interview problems explicitly require `O(1)` auxiliary space.

The central skill is learning to reuse existing storage safely without losing information that has not yet been processed.

---

# 1. In-Place vs Out-of-Place

### Out-of-place

```js
const result = [];
```

A new structure stores the transformed result.

### In-place

```js
arr[i] = transformedValue;
```

The original storage is reused.

For `N` elements:

```text
new output array → O(N) output/auxiliary storage
in-place         → potentially O(1) auxiliary storage
```

But in-place does not automatically mean faster. Extra logic, cache behavior, and mutation costs still matter.

---

# 2. Mutation Is a Contract Decision

Before modifying an array, determine:

- Is mutation allowed?
- Must original order be preserved?
- Must the original values remain available?
- Is the returned array required to have the same length?
- Is only a logical prefix considered the result?

An `O(1)` solution that violates the API contract is not a correct solution.

---

# 3. Read / Write Pointer

One of the most important in-place patterns is:

```text
read  → scans input
write → marks next output position
```

Invariant:

> The region before `write` contains exactly the valid transformed values processed so far.

Applications:

- remove elements;
- remove duplicates;
- move zeroes;
- compact valid records;
- stable filtering.

Time is usually `O(N)` and auxiliary space `O(1)`.

---

# 4. In-Place Reverse

Use two pointers:

```text
left →       ← right
```

Swap until they meet.

Invariant:

> Elements outside the active interval are already in their final positions.

Complexity:

- Time: `O(N)`
- Auxiliary space: `O(1)`.

This is the fundamental swap-based in-place transformation.

---

# 5. Swap Correctly

A JavaScript swap can use:

```js
[arr[i], arr[j]] = [arr[j], arr[i]];
```

Conceptually this still uses temporary values. The algorithm remains `O(1)` auxiliary space because the temporary storage is constant-sized.

Do not confuse constant temporary allocation with an `O(N)` data structure.

---

# 6. Remove an Element

To remove all occurrences of `target` without allocating a second array:

```text
read → scans
write → next retained position
```

When `arr[read]` should remain, write it to `arr[write]` and advance `write`.

The resulting logical length is `write`.

Whether the physical suffix must be cleared depends on the contract.

---

# 7. Remove Duplicates from Sorted Array

Sorted order gives a powerful invariant:

> Once a value differs from the last retained value, it is the next unique value.

Use a write pointer for unique values.

This is `O(N)` time and `O(1)` auxiliary space.

Without sorted input, arbitrary duplicate removal generally needs another representation such as a `Set`, sorting, or a specialized constraint.

---

# 8. Move Zeroes

Stable in-place move-zeroes:

1. compact all non-zero values toward the front;
2. fill the remaining positions with zeroes.

This preserves the relative order of non-zero values.

It is an instance of stable compaction.

The same pattern can move:

- valid records first;
- non-empty strings first;
- active jobs first;
- non-null values first.

---

# 9. Stable vs Unstable In-Place Partition

Suppose the task is:

```text
predicate(value) → left side
otherwise         → right side
```

### Unstable partition

Two opposite pointers can swap misplaced values.

Often:

- Time: `O(N)`
- Auxiliary space: `O(1)`.

But relative order may change.

### Stable partition

Preserving order generally requires more movement or additional storage.

A simple read/write compaction works when the output can be defined as “all matching values followed by all non-matching values,” but arranging both groups stably in the same array can require `O(N²)` movement in straightforward approaches.

Stability is therefore a real algorithmic constraint, not a cosmetic property.

---

# 10. Rotate Array In-Place

An array can be rotated right by `K` positions using three reversals:

1. reverse the whole array;
2. reverse the first `K` elements;
3. reverse the remaining elements.

Normalize:

```text
K = K % N
```

before operating.

Each reversal is linear, so total time is `O(N)` and auxiliary space is `O(1)`.

The algorithm is a composition of an existing primitive rather than a completely new trick.

---

# 11. Normalize Rotation

For negative rotations or very large `K`, normalize carefully.

For right rotation:

```text
K = ((K % N) + N) % N
```

This converts arbitrary integer shifts into `[0, N-1]`.

Always handle `N = 0` before taking `K % N`.

---

# 12. In-Place Merge

Merging two sorted arrays is easy when an output array is available. In-place merging is harder because writing early can overwrite unread data.

The general lesson is:

> Before overwriting a location, prove that its original value is no longer needed.

When one array has extra capacity at its end, merging from the **back** can avoid overwriting unread elements.

This is a classic example of designing traversal direction around data dependencies.

---

# 13. In-Place Matrix Transpose

For a square matrix, swap:

```text
matrix[r][c]
↔
matrix[c][r]
```

only for `c > r`.

This avoids duplicate swaps and diagonal self-swaps.

It is an important 2D example of in-place transformation.

---

# 14. In-Place Filtering

Suppose:

```text
arr = [valid, invalid, valid, invalid]
```

A write pointer can overwrite invalid positions with later valid values.

The logical output is:

```text
arr[0 .. write - 1]
```

This is particularly useful when the physical array length does not need to be immediately changed.

If references in the discarded suffix keep large objects alive, clearing that suffix may also matter for memory retention.

---

# 15. Clearing the Discarded Suffix

Consider:

```js
arr.length = write;
```

This changes the physical array length.

Whether that is desirable depends on the API contract.

If removed elements contain references to large objects, retaining them in the suffix can prolong reachability until the array is resized or the slots are cleared.

Algorithmic space complexity and garbage-collector retention are related but distinct concerns.

---

# 16. In-Place Deduplication

For sorted values, compact duplicates.

For unsorted values, alternatives include:

- `Set` with `O(N)` auxiliary memory;
- sort then compact, typically `O(N log N)` time;
- specialized constraints that permit marking or encoding.

The right choice depends on whether:

- order matters;
- mutation is allowed;
- extra memory is allowed;
- values have useful bounds.

---

# 17. In-Place vs Copy-Then-Transform

Copying before mutation can be safer:

```js
const copy = arr.slice();
```

But it costs `O(N)` memory and time.

Use it when:

- input preservation is required;
- the simpler algorithm reduces risk;
- the memory budget allows it.

Do not sacrifice correctness merely to claim `O(1)` space.

---

# 18. Hidden Allocations in JavaScript

Be careful with apparently convenient methods:

- `slice()` creates a new array;
- `filter()` creates a new array;
- `map()` creates a new array;
- spread creates/copies structures;
- `Array.from()` creates a new array;
- repeated concatenation can allocate repeatedly.

These operations are not inherently bad. They simply mean the algorithm is not strictly constant auxiliary space when the produced arrays are part of the working state.

---

# 19. In-Place Does Not Mean No Allocation

An algorithm can be asymptotically in-place while still creating constant-size temporary values.

For example:

```js
const temp = arr[i];
```

is `O(1)` space.

The relevant question is whether additional memory grows with `N`.

Also distinguish allocation count from asymptotic space: repeatedly allocating temporary objects may create substantial GC pressure even if peak live auxiliary memory remains constant.

---

# 20. Information Loss and Safe Overwriting

The hardest part of in-place algorithms is usually not swapping. It is deciding **when old information can safely be destroyed**.

Before an overwrite, ask:

1. Has the original value already been consumed?
2. Is another pointer still able to reach it?
3. Can it be reconstructed?
4. Does the output contract require it later?

This is the core mental model behind in-place algorithm design.

---

# 21. Invariant-Driven In-Place Design

A strong design template is:

```text
1. Define processed region.
2. Define unprocessed region.
3. Define where output currently lives.
4. Identify values that must remain untouched.
5. Choose pointer movement.
6. Prove every overwrite is safe.
7. Prove termination.
```

For read/write compaction:

> `arr[0..write-1]` is the correct compacted output for all processed input elements.

For reverse:

> Positions outside `[left,right]` are final.

For partition:

> Processed left/right regions satisfy their respective predicates, with only the active interval unresolved.

---

# 22. Time Complexity of In-Place Algorithms

In-place primarily constrains space. It does **not** guarantee a particular time complexity.

Examples:

| Operation | Time | Aux Space |
|---|---:|---:|
| Reverse | `O(N)` | `O(1)` |
| Remove element | `O(N)` | `O(1)` |
| Remove duplicates sorted | `O(N)` | `O(1)` |
| Move zeroes | `O(N)` | `O(1)` |
| Rotate by reversal | `O(N)` | `O(1)` |
| Selection sort | `O(N²)` | `O(1)` |
| In-place quicksort average | `O(N log N)` | recursion-dependent |
| In-place insertion sort | `O(N²)` worst case | `O(1)` |

A memory-optimal algorithm can still be computationally expensive.

---

# 23. Sorting and In-Place Thinking

Some sorting algorithms naturally support in-place operation.

### Selection Sort

Repeatedly select the minimum and swap it into position.

- Time: `O(N²)`
- Auxiliary space: `O(1)`.

### Insertion Sort

Shift elements within the array to insert each value.

- Best time: `O(N)` on already sorted input;
- Worst time: `O(N²)`;
- Auxiliary space: `O(1)`.

### Quicksort

Partitioning can be performed in place, but recursive stack space must be analyzed. Worst-case recursion depth can become `O(N)` without appropriate pivot behavior.

---

# 24. In-Place and Stability

In-place and stable are independent properties.

An algorithm can be:

- in-place and unstable;
- in-place and stable;
- out-of-place and stable;
- out-of-place and unstable.

Never infer stability from low memory usage.

For records with equal keys, define whether their original relative order must survive.

---

# 25. Backend Applications

### Batch Compaction

Remove invalid or expired records from a mutable batch buffer.

### Buffer Reuse

Reuse arrays between processing cycles to reduce allocations.

### Log Filtering

Compact events in memory before serialization.

### Queue Buffers

Read/write indices can process reusable buffers without repeatedly shifting elements.

### Memory-Constrained Workers

Bounded-memory transformations reduce peak working-set size.

Production considerations include ownership, concurrency, object retention, and whether mutating shared structures is safe.

---

# AI Applications

### Tensor / Feature Buffers

Large numeric arrays may be transformed in place to reduce memory pressure when the original values are no longer needed.

### Token Buffer Compaction

Remove padding or invalid entries from mutable token buffers.

### Candidate Filtering

Compact candidate arrays before expensive scoring.

### Batch Reuse

Reusable buffers can reduce allocation and garbage-collection pressure in high-throughput inference pipelines.

The trade-off is correctness and ownership: destructive mutation is safe only when no later stage needs the original representation.

---

# Common Mistakes

1. Claiming `O(1)` space while creating a full output array.
2. Overwriting data before it has been consumed.
3. Forgetting logical length after compaction.
4. Assuming mutation is automatically allowed.
5. Ignoring stability requirements.
6. Using `slice`, `filter`, or spread and calling the algorithm in-place.
7. Forgetting recursion stack space in recursive in-place algorithms.
8. Mishandling `K % N` when `N = 0`.
9. Treating output space as auxiliary space without explaining the distinction.
10. Retaining discarded object references unnecessarily.
11. Assuming in-place implies `O(N)` time.
12. Failing to prove why each overwrite is safe.

---

# Interview Framework

When asked for an in-place solution:

1. Confirm whether mutation is allowed.
2. Define the exact output representation.
3. Identify what information must survive.
4. Choose swap or read/write pointers.
5. Define processed and unprocessed regions.
6. State the invariant.
7. Prove overwrites are safe.
8. Prove termination.
9. Calculate time complexity.
10. Calculate auxiliary space separately from output space.
11. Check stability and ordering requirements.
12. Test empty, singleton, duplicates, all-equal, already-valid, and worst-case arrangements.

---

# Revision Checklist

- [ ] I understand what in-place means.
- [ ] I can distinguish auxiliary, output, and total space.
- [ ] I can use read/write pointers.
- [ ] I can reverse an array in place.
- [ ] I can remove elements in place.
- [ ] I can remove duplicates from sorted arrays.
- [ ] I can move zeroes stably.
- [ ] I understand stable vs unstable partitioning.
- [ ] I can rotate an array using reversals.
- [ ] I understand safe overwrite reasoning.
- [ ] I understand in-place merge constraints.
- [ ] I can transpose a square matrix in place.
- [ ] I recognize hidden JavaScript allocations.
- [ ] I understand mutation and ownership concerns.
- [ ] I can analyze recursion stack space.
- [ ] I can distinguish in-place from stable.
- [ ] I can prove an in-place invariant.
- [ ] I can explain backend and AI applications.

## Key Takeaways

1. In-place algorithms primarily reduce **auxiliary memory that grows with input size**.
2. Mutation is a contract decision, not a synonym for in-place.
3. Read/write pointers are the fundamental in-place compaction pattern.
4. The central difficulty is deciding when information can be safely overwritten.
5. In-place does not imply linear time, stability, or zero allocations.
6. JavaScript convenience methods such as `filter`, `map`, `slice`, and spread can create `O(N)` working storage.
7. Always distinguish input mutation, auxiliary space, output space, and peak live memory.
8. Strong in-place solutions are built from explicit processed/unprocessed regions and invariants.
