# 03.3 — Array Insertion, Deletion & Mutation

## Definition

Array insertion and deletion change the sequence of elements. Mutation changes the existing array object rather than creating a separate result.

The central DSA question is:

> **How many existing elements must move when the structure changes?**

For an array, inserting or deleting near the beginning can require shifting many elements, while operations at the end are usually much cheaper.

---

## Why It Matters

This chapter establishes the reasoning behind:

- `push` and `pop`
- `shift` and `unshift`
- middle insertion/deletion
- manual shifting
- in-place mutation
- copying vs mutation
- stable compaction
- swap-with-last deletion
- dynamic-array capacity
- mutation-related correctness bugs

These ideas later appear in linked lists, heaps, hash tables, caches, queues, and in-place algorithms.

---

## Mental Model: Positions Must Be Preserved

Consider:

```text
[10, 20, 30, 40]
```

Insert `99` at index `1`:

```text
[10, 99, 20, 30, 40]
```

The elements originally at indices `1..3` must move right.

Delete index `1`:

```text
[10, 30, 40]
```

The elements after index `1` must move left.

So the cost depends on the number of affected positions, not merely on the fact that an insertion or deletion occurred.

---

## Insertion Cost

Suppose an array has `n` elements and we insert at index `i`.

Approximately:

```text
n - i
```

elements may need to shift.

Therefore:

```text
Time = Θ(n - i)
```

Worst case, when inserting at the beginning:

```text
Θ(n)
```

At the end, ignoring possible capacity growth:

```text
Θ(1)
```

With dynamic resizing, an append can occasionally cost `Θ(n)`, giving `O(1)` amortized append under geometric growth.

---

## Deletion Cost

Deleting index `i` can require shifting:

```text
n - i - 1
```

elements left.

Therefore:

```text
Time = Θ(n - i - 1)
```

Worst case: delete from the front → `Θ(n)`.

Delete from the end → `Θ(1)`.

---

## `push()`

```js
arr.push(value);
```

Adds an element at the logical end.

Typical analysis:

```text
Worst case per operation: O(n) when resize/copy occurs
Amortized:                O(1)
```

The amortized result assumes a suitable geometric growth strategy.

---

## `pop()`

```js
arr.pop();
```

Removes the last element.

Typical DSA model:

```text
Time = O(1)
```

No shifting of remaining elements is required.

---

## `unshift()`

```js
arr.unshift(value);
```

Adds at the front.

Conceptually, existing elements must move right:

```text
[10, 20, 30]
 ↓
[99, 10, 20, 30]
```

Typical complexity:

```text
O(n)
```

---

## `shift()`

```js
arr.shift();
```

Removes the first element.

Remaining elements must move toward the front in the standard array model.

Typical complexity:

```text
O(n)
```

---

## `splice()`

`splice()` is a general mutation operation.

```js
arr.splice(start, deleteCount, ...items);
```

It can simultaneously:

- delete
- insert
- replace

Because affected elements may shift, its cost is generally proportional to the affected portion and can be `O(n)`.

Do not memorize one universal exact bound without considering how many elements are affected.

---

## Mutation vs Non-Mutation

Mutation:

```js
function addLast(arr, value) {
  arr.push(value);
  return arr;
}
```

Non-mutating approach:

```js
function addLastCopy(arr, value) {
  return [...arr, value];
}
```

The first modifies the original array. The second creates a new outer array.

Typical auxiliary/output implications:

```text
mutating append → O(1) auxiliary, amortized
copy append     → O(n) output allocation
```

The correct choice depends on the problem contract and architecture.

---

## Why Mutation Matters in Software Systems

Mutation can be efficient, but it creates shared-state risks.

```js
const items = [1, 2, 3];
const alias = items;

items.push(4);

console.log(alias); // [1, 2, 3, 4]
```

A function that mutates an input can unexpectedly affect another part of a program holding the same reference.

In production systems, this can create difficult-to-debug state coupling.

---

## Manual Insertion

To understand insertion, implement the shifting yourself.

Conceptually:

```text
Before:
[10, 20, 30, 40]
       ↑ insertion point

Shift right:
[10, 20, 20, 30, 40]

Write new value:
[10, 99, 20, 30, 40]
```

If working in place, shift **from right to left**.

Why?

Because shifting left-to-right can overwrite values that have not yet been copied.

---

## Right-to-Left Shifting

For insertion into an array in place:

```js
for (let i = arr.length; i > index; i--) {
  arr[i] = arr[i - 1];
}

arr[index] = value;
```

The direction is essential.

Invariant:

> After processing position `i`, the elements that originally occupied the affected suffix have been shifted safely one position to the right.

---

## Manual Deletion

For in-place deletion at index `i`, shift the suffix left:

```js
for (let j = i; j < arr.length - 1; j++) {
  arr[j] = arr[j + 1];
}

arr.pop();
```

The shift direction is now **left-to-right** because each destination receives the next element.

Again, direction follows the dependency between source and destination.

---

## Stable Deletion

“Stable” means the relative order of retained elements is preserved.

Example:

```text
[10, 20, 30, 40]
remove 20

[10, 30, 40]
```

If the original order matters, use shifting/compaction.

This can cost `O(n)`.

---

## Unordered Fast Deletion

If element order does **not** matter, deleting an arbitrary element can be optimized.

Example:

```text
[10, 20, 30, 40]
remove index 1
```

Replace it with the last element:

```text
[10, 40, 30]
```

Then remove the last slot.

Conceptually:

```js
arr[index] = arr[arr.length - 1];
arr.pop();
```

Typical complexity:

```text
O(1)
```

This is a major example of a **data-structure contract enabling an optimization**.

Trade-off:

```text
fast deletion ↔ loses order
```

---

## Stable vs Unstable Mutation

When designing an algorithm, ask:

```text
Does element order matter?
```

If yes:

```text
preserve order → shifting/compaction → O(n) worst case
```

If no:

```text
swap with last → pop → O(1)
```

This distinction is frequently more important than the syntax used.

---

## Removing Multiple Elements

Repeated `splice()` calls can be expensive.

For example, removing many values one by one from arbitrary positions can repeatedly shift the same elements.

A better approach for stable filtering is often a read/write compaction pass:

```text
read  → scans every original element
write → places retained elements
```

Then truncate the unused suffix.

Total:

```text
Time = O(n)
Auxiliary space = O(1)
```

This is much better than potentially performing `O(n)` work for each deletion.

---

## Mutation and Traversal Interaction

This is dangerous:

```js
for (let i = 0; i < arr.length; i++) {
  if (shouldDelete(arr[i])) {
    arr.splice(i, 1);
  }
}
```

Why?

After deletion:

```text
arr[i + 1] → arr[i]
```

Then the loop increments `i`, skipping the newly shifted element.

The problem is not just complexity. It violates the intended traversal invariant.

---

## Backward Deletion

If deleting individual elements with shifting, traversing backward can simplify correctness:

```js
for (let i = arr.length - 1; i >= 0; i--) {
  if (shouldDelete(arr[i])) {
    arr.splice(i, 1);
  }
}
```

Deleting a later element does not change the indices of earlier elements.

However, repeated `splice()` can still be `O(n²)` overall.

Backward traversal fixes one correctness issue; it does not automatically solve the performance problem.

---

## `delete arr[i]` Is Not Normal Array Deletion

Avoid confusing:

```js
delete arr[i];
```

with:

```js
arr.splice(i, 1);
```

`delete` removes the property and can create a sparse array; it does not shift later elements left.

For DSA sequence deletion, `splice()` or manual shifting/compaction is usually the relevant abstraction.

---

## Array Capacity vs Length

Conceptually distinguish:

```text
length   = number of logical elements
capacity = available storage before growth is needed
```

JavaScript does not expose a normal user-facing capacity property for arrays, but the dynamic-array concept explains amortized append analysis.

Example:

```text
size     = 4
capacity = 8
```

Appending another element changes size but not necessarily capacity.

When capacity is exhausted, resizing may allocate new storage and copy elements.

---

## Geometric Growth

Suppose capacity grows roughly by a constant factor:

```text
1 → 2 → 4 → 8 → 16 → ...
```

Across `n` appends, the total number of copied elements is bounded by a geometric series:

```text
1 + 2 + 4 + ... + n = O(n)
```

Therefore total work for `n` appends is:

```text
O(n)
```

and average/amortized cost per append is:

```text
O(1)
```

This is why dynamic arrays can efficiently support repeated appends despite occasional expensive resizes.

---

## In-Place Mutation and Space Complexity

An in-place insertion/deletion algorithm can use constant auxiliary variables, but it may still modify the input.

Example:

```text
Time = O(n)
Auxiliary space = O(1)
```

If instead you create a new array:

```text
Time = O(n)
Output space = O(n)
```

Neither is universally “better.” The contract determines whether mutation and additional memory are acceptable.

---

## Mutation and Aliasing

Consider:

```js
const original = [1, 2, 3];
const reference = original;
```

Then:

```js
original.splice(1, 1);
```

also changes what `reference` observes.

By contrast:

```js
const copy = original.slice();
```

creates a separate outer array.

This is an algorithmic correctness concern when arrays are shared between components or functions.

---

## Deep vs Shallow Mutation

```js
const a = [{ value: 1 }];
const b = [...a];

b[0].value = 99;
```

The outer arrays differ, but the object at index `0` is shared.

Therefore:

```text
different array object ≠ recursively independent data
```

When a problem says “do not mutate the input,” determine whether that means:

- do not mutate the outer array, or
- do not mutate nested objects either.

The contract matters.

---

## Brute Force vs Optimized Mutation

Suppose we need to remove all zeroes while preserving order.

A naive approach might repeatedly call `splice()`.

Potential complexity:

```text
O(n²)
```

A compaction pass can do it in:

```text
O(n)
```

The optimization comes from avoiding repeated movement of the same elements.

This follows the Phase 01 workflow:

```text
brute force
→ identify repeated shifting
→ change representation/operation
→ one-pass compaction
→ prove order preservation
```

---

## Backend Applications

Array mutation and insertion/deletion reasoning appears in:

- worker queues
- request batches
- pagination buffers
- in-memory caches
- event processing
- ranked candidate lists
- transaction line items
- temporary aggregation buffers

A critical production question is whether order matters.

For example:

```text
ordered job queue
→ cannot arbitrarily swap elements

unordered candidate pool
→ swap-with-last deletion may be acceptable
```

The data contract determines the algorithmic freedom.

---

## AI Applications

AI systems frequently maintain mutable candidate collections:

- top-K candidates
- beam-search states
- token buffers
- evaluation batches
- temporary feature arrays
- inference batches

If candidate order represents ranking, stable deletion may matter. If candidates are merely a set of active states, unordered deletion may be preferable for speed.

This is a concrete example of algorithm design depending on the semantics of the data.

---

## Common Mistakes

### 1. Assuming every insertion is O(1)

Only insertion at the end avoids ordinary shifting, and dynamic growth still matters.

### 2. Using `splice()` repeatedly in a loop

Repeated shifting can produce `O(n²)` behavior.

### 3. Shifting in the wrong direction

For in-place insertion, shift right-to-left. For deletion, shift left-to-right.

### 4. Using swap-with-last when order matters

It changes relative ordering.

### 5. Confusing `delete arr[i]` with sequence deletion

`delete` can create a hole rather than shift elements.

### 6. Ignoring aliasing

Mutating one reference can affect all aliases.

### 7. Treating O(1) auxiliary space as “does not use memory”

The algorithm still uses variables and may modify existing storage; `O(1)` means memory does not grow with `n` under the stated model.

---

## Edge Cases

Always consider:

```text
□ empty array
□ insertion into empty array
□ insertion at index 0
□ insertion at index n
□ deletion at index 0
□ deletion at index n - 1
□ single-element deletion
□ invalid index
□ repeated values
□ all elements removed
□ no elements removed
□ mutation allowed/forbidden
□ order required/not required
□ shared references
```

---

## Interview Questions

### Q1. Why is insertion at the beginning O(n)?

Because existing elements may need to shift right to make room.

### Q2. Why is `push()` amortized O(1)?

Most appends are constant work, while occasional resizes copy many elements. Geometric growth makes the total resize work across many appends linear.

### Q3. How can you delete an array element in O(1)?

If order does not matter, replace the target with the last element and remove the last element.

### Q4. Why is that not valid when order matters?

Because the replacement changes the relative ordering of elements.

### Q5. Why can repeated `splice()` calls become O(n²)?

Each deletion can shift a large portion of the array, and many deletions can repeat that movement.

### Q6. Why should insertion shifts move from right to left?

Moving left-to-right can overwrite source values before they are copied.

### Q7. Why is mutation an architectural concern?

Because aliases can observe the mutation, creating hidden coupling and unexpected state changes.

---

## Expert Reasoning Framework

For every insertion/deletion problem:

```text
1. Is order required?
2. Is mutation allowed?
3. Where is the operation performed?
4. How many elements can move?
5. Can repeated movement be avoided?
6. Can a write pointer compact the array?
7. Can swap-with-last be used?
8. Is dynamic resizing relevant?
9. Are there aliases to the array?
10. What invariant proves the mutation is correct?
```

This turns API knowledge into algorithmic reasoning.

---

## Revision Checklist

- [ ] I can explain why front insertion is O(n).
- [ ] I can explain why pop is O(1).
- [ ] I understand amortized push.
- [ ] I can manually insert using right-to-left shifting.
- [ ] I can manually delete using left-to-right shifting.
- [ ] I understand stable vs unordered deletion.
- [ ] I can implement swap-with-last deletion.
- [ ] I understand why repeated splice can become O(n²).
- [ ] I can use compaction for O(n) stable filtering.
- [ ] I understand mutation and aliasing.
- [ ] I know why `delete arr[i]` is different from sequence deletion.
- [ ] I can reason about capacity vs logical length.
- [ ] I can connect these choices to backend workloads.
- [ ] I can connect these choices to AI candidate/state management.

---

## Key Takeaways

1. **Insertion/deletion cost depends on how many elements must move.**
2. **Front/middle insertion or deletion is typically O(n).**
3. **End operations are typically O(1), with append analyzed amortized under dynamic growth.**
4. **In-place insertion shifts right-to-left; deletion shifts left-to-right.**
5. **Stable deletion preserves order but can cost O(n).**
6. **Swap-with-last deletion can be O(1) when order does not matter.**
7. **Repeated shifting is a common source of avoidable O(n²) algorithms.**
8. **Mutation changes shared state when aliases exist.**
9. **A data contract such as “order does not matter” can unlock major optimizations.**
10. **The correct mutation strategy is determined by correctness requirements, not convenience.**
