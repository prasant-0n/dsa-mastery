# 11.13 — B-Trees, B+ Trees & Multiway Search Trees

## 1. Objective

B-Trees and B+ Trees are balanced multiway search structures designed to reduce tree height and expensive storage/page accesses. They are fundamental to database and storage-engine indexing.

## 2. Why Multiway Trees Exist

A binary tree has at most two child branches per internal node. Storage systems often prefer nodes containing many keys because one node can fit a disk or memory page.

More keys per node means fewer levels and fewer page accesses.

## 3. Multiway Search Tree Model

A node can contain multiple sorted keys and multiple child pointers.

For keys:

```text
k1 < k2 < ... < km
```

child ranges are partitioned by those separator keys.

## 4. B-Tree Invariants

A B-Tree maintains:

- sorted keys within every node;
- child pointers separating key ranges;
- bounded node occupancy;
- all leaves at the same depth;
- a root-specific occupancy rule.

Exact minimum/maximum occupancy depends on the chosen order convention.

## 5. Order vs Minimum Degree

Texts use different terminology such as order, fanout, and minimum degree `t`.

Always state the convention before deriving split/merge thresholds.

## 6. Height

Because each internal node has many children and occupancy is bounded below, B-Tree height grows logarithmically with the number of keys.

The logarithm's base is related to the effective fanout.

## 7. Search

Search compares the target against sorted keys inside a node, chooses the appropriate child, and continues until a match or leaf miss.

Within-node search may use linear or binary search depending on node size and implementation.

## 8. Node Search Cost

If a node contains `K` keys:

```text
linear scan: O(K)
binary search: O(log K)
```

But in storage systems, page/I/O cost may dominate CPU comparison cost.

## 9. Insertion

B-Tree insertion descends to the target leaf while maintaining occupancy constraints.

A full node may be split before descending or after insertion depending on the algorithm formulation.

## 10. Node Splitting

A split partitions a full node around a separator key.

The separator is promoted to the parent in a standard B-Tree.

Splitting may propagate upward and can create a new root.

## 11. Root Splitting

When the root becomes full, splitting it creates a new root with increased height.

The all-leaves-at-one-depth invariant remains intact.

## 12. Deletion

B-Tree deletion must preserve minimum occupancy.

A deficient child can be repaired by:

- borrowing/redistributing from a sibling;
- merging with a sibling and separator information.

## 13. Borrowing

If a sibling has spare keys, a key can move through the parent to repair the deficient node.

The exact separator movement depends on whether the sibling is left or right.

## 14. Merging

When neighboring nodes cannot lend a key, nodes can merge using a separator from the parent.

Underflow can propagate upward.

## 15. B-Tree vs B+ Tree

In a B+ Tree, internal nodes primarily store separator keys while actual records/record pointers are stored in leaves.

Leaf nodes are commonly linked, enabling efficient ordered scans.

## 16. B+ Tree Search

Search descends through internal separators until reaching a leaf containing the target key or target range.

Even keys that appear as internal separators may correspond to data stored only at the leaf level.

## 17. Leaf-Level Links

Linked B+ Tree leaves make range scans efficient:

```text
find first leaf → follow next-leaf links
```

This avoids repeatedly traversing from the root for every adjacent key.

## 18. Range Queries

B+ Trees are especially effective for ordered range queries because after locating the first matching leaf, sequential leaf traversal can scan the remaining range.

## 19. Clustered vs Nonclustered Data

An index may point directly to data pages or to record identifiers. Physical data layout and index layout determine the actual cost of retrieving records.

## 20. Page-Oriented Design

A storage-engine node is often designed around a fixed-size page.

The fanout should account for:

- key size;
- pointer size;
- record/reference size;
- node metadata;
- alignment;
- page size.

## 21. Fanout Calculation

A simplified capacity estimate can be derived from page bytes divided by average entry bytes.

Real systems also reserve space for headers, fragmentation, variable-length keys, and implementation metadata.

## 22. Cache and I/O Behavior

The purpose of high fanout is not merely mathematical elegance. It reduces the number of nodes/pages touched during search.

Memory hierarchy matters:

```text
CPU cache → RAM → storage
```

Different levels have very different access costs.

## 23. Variable-Length Keys

Variable-length keys complicate node capacity and splitting. A node may have fewer entries even when its key count is below a nominal maximum.

Production implementations track bytes, not only entry count, when appropriate.

## 24. Prefix Compression

Adjacent sorted keys can share prefixes. Prefix compression can increase effective fanout but makes comparisons and updates more complicated.

## 25. Copy-on-Write Trees

Persistent or MVCC-style storage can use copy-on-write B-Tree variants. Updates create new pages while preserving older versions for readers.

## 26. Write Amplification

Splits, merges, logging, copy-on-write, and page flushing can make the physical cost of an update much larger than the logical number of tree operations.

Algorithmic complexity should therefore be separated from storage-engine I/O/write costs.

## 27. Concurrency

Production B-Trees require concurrency control around page access and structural modifications.

Techniques can include latches, lock coupling, optimistic validation, or specialized concurrent index algorithms.

## 28. Crash Recovery

Persistent tree updates must consider crashes between page writes. Write-ahead logging, copy-on-write, checksums, and recovery protocols can preserve consistency depending on the architecture.

## 29. B-Link Trees

B-Link-style designs add sibling links and high keys to simplify concurrent structural changes and searches while splits propagate.

The important engineering principle is maintaining safe navigation during concurrent page modification.

## 30. Complexity

For height `H`:

```text
Search: O(H * node-search-cost)
Insert: O(H) logical node work, plus splits/I/O
Delete: O(H) logical node work, plus merges/borrows/I/O
```

With bounded fanout, `H = O(log N)`.

## 31. Correctness Invariants

A validator should check:

1. keys are sorted within each node;
2. child ranges are correct;
3. occupancy bounds hold;
4. all leaves have equal depth;
5. root rules hold;
6. B+ leaf links are ordered and connected;
7. parent separators correctly describe child ranges.

## 32. Common Mistakes

1. Confusing B-Tree and B+ Tree record placement.
2. Using inconsistent order/minimum-degree definitions.
3. Splitting around the wrong separator.
4. Forgetting root split handling.
5. Mishandling deletion underflow.
6. Ignoring byte capacity for variable-length entries.
7. Treating CPU comparisons as the only cost in storage systems.
8. Forgetting leaf links in B+ range scans.

## 33. Edge Cases

Test:

- empty tree;
- root-only tree;
- root split;
- repeated splits;
- cascading splits;
- deletion from leaf;
- sibling redistribution;
- merges;
- cascading underflow;
- duplicate keys;
- variable-length keys;
- range scans.

## 34. Backend Applications

B-Trees/B+ Trees are central to:

- database indexes;
- ordered key-value stores;
- filesystem metadata indexes;
- storage engines;
- range-query services;
- persistent ordered maps.

## 35. AI Applications

They can support:

- ordered feature metadata;
- time/range-indexed datasets;
- retrieval metadata stores;
- persistent experiment indexes;
- structured lookup over large offline corpora.

## 36. Testing Strategy

Use:

- invariant validation after every mutation;
- reference-map differential tests;
- randomized insert/delete sequences;
- split/merge targeted tests;
- range-query differential tests;
- leaf-link consistency tests;
- crash/recovery simulation for persistent implementations.

## 37. Interview Framework

```text
1. Why use a multiway tree instead of a binary tree?
2. What determines fanout?
3. State the B-Tree occupancy invariants.
4. Explain a node split.
5. Explain deletion underflow.
6. What differs in a B+ Tree?
7. Why are linked leaves useful?
8. How does page size affect design?
9. Why can storage cost differ from asymptotic CPU cost?
10. How would you validate the structure?
```

## 38. Revision Checklist

- [ ] I understand multiway search trees.
- [ ] I can state B-Tree invariants.
- [ ] I understand fanout and height.
- [ ] I can explain node splitting.
- [ ] I understand deletion borrowing and merging.
- [ ] I can distinguish B-Tree and B+ Tree layouts.
- [ ] I understand linked B+ leaves.
- [ ] I can reason about page capacity.
- [ ] I understand storage/I/O costs.
- [ ] I can validate B-Tree invariants.

## 39. Key Takeaways

1. **B-Trees trade binary branching for high fanout to reduce tree height and page accesses.**
2. **Insertion uses splitting; deletion uses redistribution and merging to preserve occupancy.**
3. **B+ Trees concentrate records in leaves and link those leaves for efficient ordered range scans.**
4. **Real storage-engine performance depends on page size, key width, cache behavior, I/O, concurrency, and write amplification—not only Big-O.**
5. **Precise occupancy conventions must be stated because terminology such as order and minimum degree varies across implementations and texts.**
