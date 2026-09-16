# 12.02 — Heap Operations: Insert, Extract, Sift-Up, Sift-Down & Complexity

## 1. Objective

This chapter turns the heap invariant into concrete mutation algorithms. The focus is not memorizing code, but understanding exactly why insertion and extraction preserve completeness and heap order.

## 2. Operation Model

For an array-backed binary heap, the principal operations are:

```text
peek
insert
extract-min / extract-max
```

Each operation has a clearly defined precondition, mutation, restoration phase, and postcondition.

## 3. Insert: Structural Step

A new value is appended to the end of the array. This is the only position that preserves the complete-tree shape.

The append may violate heap order with its parent.

## 4. Insert: Restoration Step

Use sift-up:

```text
while parent relation is violated:
    swap node with parent
```

The process stops at the root or when the heap relation becomes valid.

## 5. Sift-Up Invariant

Before each iteration, the subtree below the current node is a valid heap and the only possible violation is between the current node and its parent.

After swapping upward, the same property holds at the new position.

## 6. Insert Complexity

A node can move at most one level per iteration. A complete binary tree has height `O(log N)`.

Therefore:

```text
Time:  O(log N)
Space: O(1) auxiliary for iterative implementation
```

## 7. Extract: Structural Step

Removing the root directly would create a hole. Move the last element to the root, then remove the final array slot.

This preserves the complete-tree shape.

## 8. Extract: Restoration Step

The replacement root may violate heap order with its children. Sift-down moves it toward the appropriate child until the invariant is restored.

## 9. Choosing the Child

For a min-heap, choose the smaller child. For a max-heap, choose the larger child.

This choice matters because moving into the more extreme child is what restores the strongest local ordering condition.

## 10. Sift-Down Invariant

Before each iteration, every subtree below the current node is a valid heap. Only the current node may violate the heap property with its children.

After selecting the appropriate child and swapping, the same condition moves downward.

## 11. Extract Complexity

Sift-down traverses at most the height of the heap:

```text
Time:  O(log N)
Space: O(1) auxiliary when iterative
```

## 12. Peek

The root is the extreme element:

```text
peek-min → heap[0]
peek-max → heap[0]
```

No restructuring is required.

```text
Time: O(1)
```

## 13. Empty Heap

An empty heap has no root. Extraction and peek behavior must follow the API contract.

Possible contracts include returning `undefined` or throwing a domain-specific error.

## 14. Single Element

For a one-element heap:

- peek returns the element;
- extraction removes it;
- no sift operation is necessary.

This is a useful boundary case for testing.

## 15. Two Elements

A two-element heap has one parent and one child. This is the smallest case where both insertion and extraction can require a swap.

## 16. Duplicates

Equal values satisfy the heap property. A strict comparison is not required unless the API explicitly demands unique priorities.

## 17. Comparator Contract

A robust implementation should define one ordering convention and use it consistently in:

- insertion;
- extraction;
- heapify;
- replacement;
- validation.

A comparator that changes semantics between operations can silently corrupt the heap.

## 18. Objects as Heap Entries

A heap can store objects such as:

```js
{ priority, sequence, value }
```

The comparator determines ordering while the stored object retains application data.

## 19. Stable Priority Ordering

To preserve FIFO order among equal priorities, add a monotonically increasing sequence number and compare:

```text
priority first → sequence second
```

The heap itself does not provide stability automatically.

## 20. Replace-Root Optimization

When the current root is removed and immediately replaced by a new candidate, it can be more efficient to assign the replacement directly and perform one sift-down instead of performing separate extraction and insertion operations.

## 21. Arbitrary Removal

Removing an element at index `i` requires preserving completeness and restoring heap order around the replacement value.

After replacing the removed position with the last element, the replacement may need to move either upward or downward.

## 22. Priority Updates

Changing a value's priority can invalidate the heap property in either direction.

For a min-heap:

- decreasing priority may require sift-up;
- increasing priority may require sift-down.

The direction must be derived from the old and new ordering.

## 23. Why Only One Path Changes

After an insertion, only the new leaf is structurally new. After root extraction, only the replacement root is initially suspicious. This locality is what makes restoration logarithmic rather than linear.

## 24. Recursive vs Iterative Restoration

Sift-up and sift-down can be written recursively, but iterative implementations avoid recursion-depth concerns and typically make allocation/control-flow behavior explicit.

For production JavaScript, iterative restoration is generally a straightforward default.

## 25. Tail Behavior

In a complete tree, the final array position is always a leaf. Appending there preserves completeness without requiring tree traversal.

This is one of the central reasons array-backed heaps are simple to implement.

## 26. Operation Trace

For a min-heap insertion:

```text
append
  ↓
compare parent
  ↓
violation?
 ├─ no → done
 └─ yes → swap → continue upward
```

For extraction:

```text
save root
  ↓
move last → root
  ↓
remove last slot
  ↓
compare children
  ↓
violation?
 ├─ no → done
 └─ yes → swap with smaller child → continue downward
```

## 27. Correctness: Insert

1. Append preserves completeness.
2. The new value is the only newly introduced possible violation.
3. Each sift-up swap moves that violation toward the root.
4. The process terminates at the root or a valid parent relation.
5. Therefore the resulting structure is complete and heap-ordered.

## 28. Correctness: Extract

1. Replacing the root with the final element preserves completeness after removing the final slot.
2. Only the replacement root can initially violate heap order.
3. Sift-down moves the violation toward a leaf.
4. Choosing the appropriate child preserves heap order behind the moving position.
5. Termination produces a valid heap.

## 29. Termination

Sift-up strictly decreases the current index. Sift-down strictly increases it along a finite root-to-leaf path. Therefore both iterative processes terminate.

## 30. Complexity Accounting

When analyzing a heap operation, separate:

```text
array access cost
comparison cost
swap/mutation cost
number of levels traversed
```

The usual `O(log N)` bound assumes comparisons and element moves are constant time.

## 31. Expensive Comparators

If comparing two entries requires `O(C)` work, then a sift operation can cost:

```text
O(C log N)
```

This matters when keys require parsing, normalization, locale-aware comparison, or expensive derived calculations.

## 32. Large Objects

Moving large objects by reference in JavaScript is different from copying their payload. Nevertheless, object allocation and garbage collection can dominate real workloads.

Keep heap entries compact when performance matters.

## 33. Heap Operation vs Full Sorting

If only the next highest-priority item is needed repeatedly, maintaining a heap avoids sorting the entire collection after every insertion.

A full sort is useful when the complete ordered sequence is required.

## 34. Backend Application

A job scheduler can maintain:

```text
(priority, enqueueTime, jobId)
```

and repeatedly extract the highest-priority runnable job.

Tie-breaking and cancellation semantics must be explicitly designed.

## 35. AI Application

A best-first or A* frontier can store search nodes ordered by evaluation score. Each expansion inserts new candidates and extracts the most promising candidate.

This is a direct application of heap insert/extract operations.

## 36. Testing Strategy

For every mutation:

1. perform the operation;
2. validate the heap invariant;
3. compare extracted order with a reference sorted sequence.

Randomized sequences are particularly effective at catching index and child-selection errors.

## 37. Common Bugs

- off-by-one parent index;
- choosing the wrong child;
- stopping sift-down too early;
- failing to handle one-child nodes;
- forgetting to remove the final slot;
- applying the wrong comparator direction;
- corrupting sequence tie-breakers.

## 38. Interview Derivation

If asked to implement a priority queue, explain:

```text
Need extreme element
→ store it at root
→ complete shape enables array representation
→ insert at end
→ restore upward
→ remove root by moving last element
→ restore downward
```

Then derive `O(log N)` from heap height.

## 39. Revision Checklist

- [ ] I can derive insertion without memorizing code.
- [ ] I can derive extraction without memorizing code.
- [ ] I understand why sift-up moves upward.
- [ ] I understand why sift-down chooses the extreme child.
- [ ] I can prove both operations correct.
- [ ] I can explain termination.
- [ ] I can analyze comparator cost.
- [ ] I can handle duplicate priorities and stable ties.
- [ ] I can explain heap operations in backend and AI systems.

## Key Takeaways

1. **Insert preserves completeness by appending and restores order with sift-up.**
2. **Extract preserves completeness by moving the last element to the root and restores order with sift-down.**
3. **The restoration path is bounded by heap height, giving `O(log N)` operations.**
4. **Correct child selection is the critical detail in sift-down.**
5. **Real performance depends on comparator cost, object representation, allocation behavior, and workload—not just Big-O.**
