# 05.14 — Skip Lists & Probabilistic Linked Structures

## Purpose

A skip list augments a sorted linked list with multiple levels of forward pointers. Higher levels skip over many nodes, allowing search, insertion, and deletion to achieve **expected O(log N)** time while retaining a relatively simple pointer-based design.

The central idea is:

> Add probabilistic express lanes to a linked list.

---

## 1. Why a Plain Sorted Linked List Is Slow

A sorted singly linked list provides:

```text
search    O(N)
insert    O(N)   // finding the position dominates
remove    O(N)   // finding the node/predecessor dominates
```

Even though pointer rewiring after the position is known is O(1), locating the position remains linear.

---

## 2. Skip List Mental Model

A skip list can look conceptually like:

```text
L2:  A --------------------→ G --------→ M
L1:  A --------→ D --------→ G ----→ J → M
L0:  A → B → C → D → E → F → G → H → I → J → K → L → M
```

Level 0 contains every node.
Higher levels contain selected nodes that act as shortcuts.

---

## 3. Node Representation

A skip-list node has multiple forward references:

```js
class SkipNode {
    constructor(value, level) {
        this.value = value;
        this.forward = new Array(level).fill(null);
    }
}
```

The number of forward pointers is the node's **height**.

---

## 4. Levels

Level 0 is the base linked list.

A node promoted to level 1 has:

```text
forward[0]
forward[1]
```

A node at level 3 has:

```text
forward[0]
forward[1]
forward[2]
```

Every higher-level edge must represent a valid forward relationship in the sorted structure.

---

## 5. Search Strategy

Search begins at the highest useful level.

At each level:

```text
while next.value < target:
    move forward
```

When moving further would overshoot, descend one level.

Eventually level 0 identifies the target or insertion position.

---

## 6. Search Complexity

For a well-behaved randomized skip list:

```text
Expected: O(log N)
```

Worst-case height and search can still be O(N).

This distinction is fundamental:

```text
expected complexity ≠ guaranteed worst-case complexity
```

---

## 7. Random Height

A common construction promotes a node repeatedly with probability `p`:

```text
height = 1
while random() < p:
    height++
```

Typical values use a probability below 1, such as 1/2, though the exact choice is an engineering parameter.

Randomization prevents ordinary input ordering from deterministically producing a degenerate structure.

---

## 8. Why Randomization Helps

Without randomization, an adversarial insertion pattern could produce poor shortcut distribution.

Randomized promotion makes the level structure probabilistic rather than directly controlled by sorted input order.

The expected height remains logarithmic under the standard independent-promotion model.

---

## 9. Expected Height

With promotion probability `p`, the expected number of nodes reaching progressively higher levels decreases geometrically.

Conceptually:

```text
N
↓ pN
↓ p²N
↓ p³N
...
```

This geometric decay is the source of logarithmic expected search behavior.

---

## 10. Insertion

Insertion first performs a top-down search while recording the predecessor at every level:

```text
update[0]
update[1]
update[2]
...
```

After choosing the new node height, its forward references are inserted between the corresponding predecessor and successor at each level.

Expected complexity:

```text
O(log N)
```

---

## 11. Deletion

Deletion follows the same predecessor discovery process.

For every level where the target appears:

```text
update[level].forward[level] = target.forward[level]
```

The node is removed from all levels simultaneously.

Expected complexity is O(log N).

---

## 12. Sentinel Head

Skip lists commonly use a head sentinel with maximum configured height:

```text
HEAD → ...
```

This avoids special cases when inserting or deleting nodes near the beginning.

---

## 13. Maximum Level

Implementations usually define a maximum level.

The maximum should be large enough for the expected data size but finite so node representation and metadata remain bounded.

A practical implementation should also define what happens if a generated height exceeds the configured maximum.

---

## 14. Duplicate Keys

A skip list must define duplicate semantics.

Possible contracts:

- allow duplicates;
- reject duplicates;
- update an existing value;
- store multiple values per key.

If duplicates are allowed, define whether search returns the first, last, or arbitrary matching node.

---

## 15. Stable Ordering

If duplicate keys carry identities or insertion order, stability must be explicitly modeled.

A comparator can use a secondary sequence number:

```text
(key, insertionSequence)
```

This turns ambiguous equality into deterministic ordering.

---

## 16. Range Queries

Because the base level remains sorted, a skip list can locate the beginning of a range efficiently and then traverse level 0 for the output.

For a range containing K returned elements:

```text
expected search: O(log N)
output traversal: O(K)
```

Total expected cost:

```text
O(log N + K)
```

---

## 17. Lower Bound

A useful primitive is:

> Find the first node whose key is greater than or equal to target.

This is the linked-structure equivalent of an array's lower-bound search.

Once implemented, many ordered operations can be built on top of it.

---

## 18. Upper Bound

Similarly:

> Find the first node whose key is strictly greater than target.

Lower-bound and upper-bound semantics make duplicate handling precise and enable range queries.

---

## 19. Skip List vs Balanced Tree

| Property | Skip List | Balanced Tree |
|---|---|---|
| Typical search | expected O(log N) | O(log N) worst-case |
| Typical insert | expected O(log N) | O(log N) |
| Typical delete | expected O(log N) | O(log N) |
| Implementation | pointer + randomization | rotations/rebalancing |
| Worst-case guarantee | O(N) | O(log N) |
| Range traversal | natural level-0 list | tree traversal |
| Concurrency variants | attractive | more complex |

Neither dominates in every workload.

---

## 20. Skip List vs Hash Table

Hash tables generally provide expected O(1) point lookup, but they do not naturally preserve sorted order.

Skip lists provide ordered operations and range traversal at expected O(log N).

Choose based on required semantics, not complexity numbers alone.

---

## 21. Skip List vs Heap

A heap efficiently exposes the minimum/maximum but does not support general ordered search or arbitrary range queries efficiently.

A skip list is appropriate when ordered navigation is part of the API.

---

## 22. Memory Cost

A skip list stores multiple forward references.

Expected total pointer count remains O(N) under a geometric height distribution, but the constant factor is greater than a plain linked list.

Therefore the speed improvement comes with additional memory.

---

## 23. Pointer Integrity

For every level `i`, the sequence reached through `forward[i]` must remain sorted according to the comparator.

The level-0 chain must contain every logical element exactly once unless duplicates are intentionally represented.

A single incorrect pointer can corrupt one level while leaving others apparently valid.

---

## 24. Concurrency Considerations

Skip lists are interesting for concurrent ordered data structures because updates can be localized to multiple forward-pointer relationships.

However, a correct concurrent skip list requires synchronization, atomic operations, or a specialized lock-free algorithm.

A normal JavaScript skip list is not automatically thread-safe merely because its operations are pointer-based.

---

## 25. Backend Applications

Skip-list concepts are useful for:

- ordered in-memory indexes;
- sorted sets;
- range queries;
- scheduling structures;
- leaderboard-like ordered data;
- time-ordered records;
- memory indexes.

A notable production example is the use of skip-list-like structures in storage engines and sorted collections, although the exact implementation varies by system.

---

## 26. AI Applications

Ordered probabilistic structures can support:

- ranked candidate sets;
- beam/frontier ordering;
- approximate priority management;
- dynamic ordered state collections;
- retrieval candidates where range navigation matters.

For large numerical tensors, skip lists are generally inappropriate; specialized vector indexes and contiguous numerical representations are better suited.

---

## 27. Deterministic Testing

Randomized algorithms create a testing challenge.

Use injectable randomness when possible:

```js
createSkipList({ random: seededRandom })
```

This makes structural tests reproducible while production can use an appropriate random source.

---

## 28. Adversarial Behavior

Because standard skip lists have probabilistic guarantees, an implementation should distinguish:

```text
expected performance
vs
hard worst-case guarantees
```

If worst-case latency is a strict requirement, a balanced tree or another deterministic structure may be preferable.

---

## 29. Common Mistakes

1. Treating expected O(log N) as guaranteed O(log N).
2. Forgetting to update every affected level during insertion/deletion.
3. Corrupting level 0 while higher levels appear correct.
4. Generating a height above the configured maximum.
5. Leaving duplicate-key semantics undefined.
6. Using nondeterministic randomness in structural tests.
7. Forgetting the O(K) output cost of range queries.
8. Comparing skip lists with hash tables without considering ordering requirements.
9. Assuming pointer-based structures are automatically concurrent-safe.
10. Ignoring the extra memory used by higher-level pointers.

---

## 30. Problem-Solving Framework

When designing a skip list:

```text
1. Define key and comparator semantics.
2. Define duplicate behavior.
3. Define maximum level.
4. Choose promotion probability.
5. Design the sentinel.
6. Implement level-0 correctness first.
7. Add predecessor/update tracking.
8. Add randomized promotion.
9. Validate every level's ordering.
10. Test lower/upper bounds and ranges.
11. Measure memory and expected performance.
12. Decide whether probabilistic guarantees fit the production requirement.
```

---

## 31. Revision Checklist

- [ ] Explain why a plain sorted linked list is O(N) for search.
- [ ] Draw a multi-level skip list.
- [ ] Explain node height.
- [ ] Explain randomized promotion.
- [ ] Derive the expected logarithmic behavior conceptually.
- [ ] Implement top-down search.
- [ ] Track predecessors at each level.
- [ ] Implement insertion.
- [ ] Implement deletion.
- [ ] Handle duplicates precisely.
- [ ] Implement lower bound and upper bound.
- [ ] Support range queries.
- [ ] Explain expected vs worst-case complexity.
- [ ] Compare skip lists with balanced trees and hash tables.
- [ ] Explain deterministic testing of randomized structures.

# Key Takeaways

1. A skip list is a multi-level linked list with probabilistic express lanes.
2. Search, insertion, and deletion are expected O(log N).
3. Worst-case complexity can still be O(N).
4. Random promotion produces the expected logarithmic structure.
5. Sentinel nodes and predecessor arrays simplify implementation.
6. Level 0 remains the authoritative complete ordered sequence.
7. Range queries cost expected O(log N + K), where K is output size.
8. Skip lists trade extra pointers and probabilistic guarantees for simpler ordered operations.
9. Deterministic tests should control randomness.
10. Choose a skip list because its ordering and engineering trade-offs fit the workload—not because O(log N) sounds better.
