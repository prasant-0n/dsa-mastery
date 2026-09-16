# 12.12 — Binomial Heaps: Binomial Trees, Union & Amortized Priority-Queue Operations

## Objective

A binomial heap is a collection of binomial trees with unique degrees. It is designed around efficient union/meld and provides a useful bridge between ordinary heaps, binary representations, and mergeable priority queues.

## 1. Binomial Tree

A binomial tree `B_k` is defined recursively:

```text
B_0 = one node
B_k = link two B_(k-1) trees
```

The root of the preferred tree becomes the parent of the other root.

## 2. Structural Properties

A binomial tree `B_k` contains:

```text
2^k nodes
height k
root degree k
```

Its children are roots of binomial trees with degrees:

```text
k-1, k-2, ..., 0
```

## 3. Binomial Heap

A binomial heap is a collection of heap-ordered binomial trees with no two roots having the same degree.

The root list is maintained in increasing degree order in the standard representation.

## 4. Binary Representation Connection

Because there can be at most one tree of each degree, the number of nodes corresponds naturally to the binary representation of the heap size.

For example:

```text
13 = 1101₂
```

corresponds to trees of degrees:

```text
3, 2, 0
```

## 5. Heap-Order Invariant

Every binomial tree satisfies the selected heap-order rule:

```text
parent is preferred over child
```

The heap therefore contains the globally preferred root among its roots.

## 6. Make-Heap

An empty binomial heap contains no trees. Initialization is `O(1)`.

## 7. Link Operation

To link two trees of equal degree:

1. compare their roots;
2. choose the preferred root as parent;
3. attach the other root as a child;
4. increase the parent's degree.

The result is a binomial tree of degree `k + 1`.

## 8. Why Equal Degrees Matter

Linking two `B_k` trees creates exactly one `B_(k+1)`. This is analogous to binary addition carrying a `1` into the next bit.

## 9. Union

Union merges two root lists and repeatedly links roots with equal degrees.

The process resembles binary addition with carries.

## 10. Union Complexity

With root lists maintained by degree, union is `O(log N)` because there are only logarithmically many possible degrees.

## 11. Insert

A singleton `B_0` tree can be unioned into the heap. This gives `O(log N)` worst-case insertion in the straightforward representation.

Some variants and implementations use additional strategies, but the standard binomial-heap model should be understood first.

## 12. Find-Min

If roots are stored only by degree, finding the minimum root requires scanning the root list:

```text
O(log N)
```

because there are at most `O(log N)` roots.

A cached minimum pointer can improve this to `O(1)` access, subject to maintaining the pointer correctly.

## 13. Extract-Min

To extract the minimum:

1. find the minimum root;
2. remove it from the root list;
3. reverse or otherwise reconstruct its child-root sequence as required by the representation;
4. form a binomial heap from those children;
5. union the resulting heap with the remaining heap.

## 14. Child Degrees

For a `B_k` root, its children represent `B_(k-1)` through `B_0`. Removing the root therefore produces a valid collection of distinct-degree binomial trees after the representation is normalized.

## 15. Decrease-Key

A decreased key may violate heap order with its parent. The entry can be repeatedly exchanged upward until heap order is restored.

The operation follows a path whose length is bounded by the tree height.

## 16. Delete

A common approach is:

```text
decrease-key to an extreme priority
→ extract-min
```

This reuses existing operations instead of implementing a separate structural deletion algorithm.

## 17. Degree Bound

A binomial tree of degree `k` contains `2^k` nodes. Therefore a binomial heap containing `N` nodes has maximum degree `O(log N)`.

## 18. Root Count

There is at most one root of each degree, so the number of roots is `O(log N)`.

This bound drives the complexity of root-list scanning and union.

## 19. Binary-Carry Mental Model

Think of each tree degree as a binary digit:

```text
0 → no tree of this degree
1 → one tree of this degree
```

Linking equal degrees is a carry.

## 20. Amortized Reasoning

Binomial heaps provide an excellent setting for understanding how a sequence of inserts and unions can be interpreted through binary carries. A long sequence can contain different individual costs even though the total number of links is bounded by the number of carries performed.

## 21. Root List Representation

A root list can be represented using linked nodes, arrays, or other structures. The representation affects locality, allocation behavior, and implementation complexity.

## 22. Pointer-Based Representation

Typical nodes may store:

```text
parent
child
sibling
degree
key/value
```

This supports the classic child-sibling representation.

## 23. Array-Based Alternative

A compact array representation can improve locality for some workloads, but it must preserve the binomial-tree relationships and efficient root operations.

## 24. Comparison with Binary Heaps

| Property | Binary Heap | Binomial Heap |
|---|---|---|
| Main structure | one complete tree | forest of binomial trees |
| Union | not fundamental | O(log N) |
| Root count | 1 | O(log N) |
| Find-min | O(1) | O(log N), or O(1) with cached min |
| Insert | O(log N) | O(log N) standard |
| Extract-min | O(log N) | O(log N) |
| Storage | contiguous array | commonly pointer-based |

## 25. Comparison with Fibonacci Heaps

Both support a forest of heap-ordered trees and efficient union. Fibonacci heaps introduce more aggressive laziness and cascading cuts to obtain stronger amortized bounds for decrease-key.

Binomial heaps maintain a stricter degree structure, making their organization easier to reason about.

## 26. Backend Applications

Binomial heaps can be useful conceptually or practically when priority queues need repeated merging and logarithmic structural bounds are desirable.

Possible workloads include combining independently generated task queues or priority batches.

## 27. AI Applications

Search systems that merge independently generated candidate frontiers can use binomial-heap ideas to reason about efficient priority-queue union.

The practical choice should be benchmarked against binary, pairing, or Fibonacci alternatives.

## 28. Correctness Invariants

Maintain:

1. each tree is a valid binomial tree;
2. each tree satisfies heap order;
3. root degrees are strictly increasing or otherwise uniquely represented;
4. parent/child/sibling relationships are consistent;
5. the root list contains exactly the heap's trees.

## 29. Link Correctness

Linking two equal-degree `B_k` trees creates `B_(k+1)` because the preferred root becomes the new root and the other root becomes one additional child subtree.

## 30. Union Correctness

Repeatedly resolving equal-degree roots is equivalent to carrying in binary addition. When the process ends, no degree is duplicated and every original node remains represented exactly once.

## 31. Extract-Min Correctness

Removing the minimum root leaves its child trees, each of which remains a valid binomial tree. Unioning those trees with the remaining root list restores the unique-degree invariant.

## 32. Testing Strategy

Test:

- empty heap;
- singleton heap;
- powers of two;
- sizes just below and above powers of two;
- repeated inserts;
- repeated unions;
- extract-min;
- decrease-key;
- delete;
- duplicate priorities.

## 33. Binary Representation Tests

For every heap size, verify that the degrees of its roots correspond to the set bits of the size's binary representation.

This is a powerful structural test.

## 34. Reference Model

Compare extraction order against a sorted reference collection. After each operation, also validate the binomial-tree structural invariants.

## 35. Benchmarking

Measure:

- insert latency;
- union latency;
- find-min latency;
- extract-min latency;
- decrease-key latency;
- allocations;
- memory;
- pointer traversal.

Compare identical workloads across heap families.

## 36. Common Mistakes

1. Linking trees with different degrees.
2. Forgetting the degree increment after linking.
3. Corrupting child/sibling relationships.
4. Assuming find-min is automatically `O(1)` without a cached pointer.
5. Losing the unique-degree invariant during union.
6. Confusing binomial-tree degree with node count.

## 37. Interview Framework

```text
Need mergeable priority queues
→ represent heap as unique-degree binomial trees
→ equal-degree trees link
→ linking behaves like binary carry
→ union processes carries
→ root count is O(log N)
→ analyze find-min/extract/update costs
→ compare with binary/Fibonacci/pairing heaps
```

## Revision Checklist

- [ ] I can define a binomial tree recursively.
- [ ] I know the `2^k` node property.
- [ ] I can explain the unique-degree invariant.
- [ ] I can implement/link equal-degree trees conceptually.
- [ ] I understand union as binary addition.
- [ ] I can derive root-count and degree bounds.
- [ ] I can explain extract-min.
- [ ] I can compare binomial, binary, pairing, and Fibonacci heaps.

## Key Takeaways

1. **A binomial heap is a forest of heap-ordered binomial trees with unique degrees.**
2. **A `B_k` tree contains `2^k` nodes and has height `k`.**
3. **Union works like binary addition: equal-degree trees link as carries.**
4. **The logarithmic number of possible degrees gives logarithmic root-list size.**
5. **Binomial heaps provide a structured mergeable alternative to array-based binary heaps.**
