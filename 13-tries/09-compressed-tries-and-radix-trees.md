# 13.09 — Compressed Tries & Radix Trees

## 1. Concept Definition

A **compressed trie** reduces the node overhead of an ordinary trie by collapsing every maximal non-branching path into one edge carrying a string label. A radix tree is the standard string-oriented form of this idea.

If an ordinary trie stores `c → o → m → p → u → t → e → r`, a compressed trie can store a single edge labeled `computer` when no key branches along that path.

A Patricia trie is a closely related compressed-trie family; bitwise Patricia structures compress paths according to discriminating bits rather than characters.

## 2. Why Compression Exists

An ordinary trie may allocate one node per character. This is attractive for prefix navigation, but long sparse keys can create many nodes with only one child.

Compression can reduce:

- node count
- pointer/map overhead
- metadata duplication
- traversal steps
- memory consumed by sparse paths

The trade-off is that each edge now contains a label, so lookup and update must compare multiple characters at an edge.

## 3. Mental Model

Think of an ordinary trie as a road network with one intersection for every character. A radix tree removes intersections that do not represent decisions.

Each edge answers two questions:

1. Does the remaining query begin with this edge label?
2. If so, how much of the label was consumed?

A terminal marker still matters. A key can end at an internal node, even when that node has children.

## 4. Computational Model

Let `L` be the key length. A search visits a sequence of compressed edges whose labels concatenate to the searched key prefix.

At a high level:

- ordinary trie: roughly one structural step per symbol
- radix tree: fewer structural steps, but each step may compare many symbols

If character comparisons are counted explicitly, lookup cost is better described as **structural traversal work + compared-character work**. With bounded-width strings and normal string comparison, this is often effectively `O(L)` for one key, but the exact cost model should be stated.

## 5. Core Representation

A useful node model is:

```js
{
  terminal: false,
  value: undefined,
  children: new Map()
}
```

Each child edge can carry:

```js
{
  label: "puter",
  child: nextNode
}
```

The outgoing edges of a node must have distinct first symbols. Otherwise a query would not know which edge to follow.

## 6. Core Invariants

A correct radix tree maintains:

1. Every edge label is non-empty.
2. Sibling edges have different first symbols.
3. Concatenating labels from root to a terminal node reconstructs the stored key.
4. A terminal node represents a complete key even if it has children.
5. After compression, a non-terminal node should not have exactly one child.
6. Deletion must never remove a subtree belonging to another key.

These invariants are more important than the particular JavaScript representation.

## 7. Exact Search

To search for a key:

1. Start at the root.
2. Select the outgoing edge whose first symbol matches the remaining key.
3. Compare the query segment with the edge label.
4. If the entire label matches, continue at the child.
5. If the query ends exactly at the child, return the child only when it is terminal.
6. Any partial mismatch means the key is absent.

The important distinction is **exact edge consumption** versus **partial edge matching**.

## 8. Prefix Search

Prefix queries are slightly more subtle than exact queries.

The requested prefix may:

- end exactly at a node
- end in the middle of an edge label
- fail inside an edge label

If a prefix ends inside a matching edge, every key below that edge can still satisfy the prefix. The implementation must therefore retain enough context to enumerate the entire descendant subtree.

## 9. Insertion

Radix insertion has four important cases.

### Case A — No matching edge
Create a new edge containing the remaining key.

### Case B — Full edge label matches
Continue into the child.

### Case C — The new key ends inside an existing edge
Split the edge. The split point becomes terminal for the new key, while the old suffix remains below it.

### Case D — Partial overlap
Split the existing edge at the common-prefix boundary, create a shared intermediate node, and attach both suffixes.

The split operation is the central mutation of a radix tree.

## 10. Edge Splitting

Suppose the tree contains:

```text
root
 └── "teamwork" → A
```

and we insert `teamster`.

The common prefix is `team`. The result is conceptually:

```text
root
 └── "team"
      ├── "work"   → A
      └── "ster"   → B
```

Neither original key is lost, and the shared prefix is represented once.

## 11. Deletion and Collapse

Deletion removes terminal state first. Then the implementation may collapse redundant structure.

Typical cleanup:

- leaf + non-terminal → remove edge
- non-terminal node with one child → merge its edge with the child edge
- terminal node with children → retain it

A common bug is collapsing a terminal node and accidentally changing the meaning of a shorter key.

## 12. Compression as a Separate Operation

It is possible to implement a normalized trie first and run a compression pass later. This can be useful for teaching, testing, migration, or snapshot generation.

A compression pass should repeatedly eliminate non-terminal unary nodes while preserving key reconstruction.

## 13. Lexicographic Traversal and Autocomplete

Radix trees naturally support prefix enumeration. For deterministic lexicographic output, child edges must be visited according to their first-symbol ordering and descendants must be traversed consistently.

Autocomplete can combine:

- prefix navigation
- subtree enumeration
- terminal metadata
- ranking
- bounded Top-K selection

Compression changes structural cost, not the underlying prefix semantics.

## 14. Longest-Prefix Matching

Longest-prefix matching asks for the longest stored key that is a prefix of the query.

This is useful when keys represent:

- hierarchical namespaces
- routing prefixes
- configuration scopes
- object-storage prefixes
- authorization scopes

While traversing the query, remember the deepest terminal match. If a later edge fails, return the last valid terminal match.

## 15. Patricia / Bitwise Boundary

Character radix trees are not the same as bitwise Patricia tries.

Bitwise Patricia structures choose discriminating bits and are useful for compact routing or binary-key indexing. The shared principle is path compression: eliminate paths that contain no branching decision.

The key design question is always: **what constitutes the discriminating symbol?**

## 16. Memory Representation Choices

Edge labels can be stored as:

- copied strings
- substrings
- source-string offsets and lengths
- byte ranges
- arrays of code points/tokens

Offset-based representations can reduce repeated string copying but require source ownership and lifetime rules.

For large immutable dictionaries, this trade-off can materially affect memory usage.

## 17. JavaScript Engineering

JavaScript implementations should explicitly decide:

- whether keys are ASCII, UTF-16 code units, Unicode code points, or tokens
- whether edge labels are copied or sliced
- how child edges are indexed
- how duplicate keys update values
- whether `Map` or a compact array is appropriate for children
- whether iteration order is part of the API

Do not silently assume that one JavaScript string element equals one Unicode character.

## 18. Complexity

For a key of length `L`, a well-designed radix lookup generally performs work proportional to the amount of key material examined, plus child-selection and representation overhead.

Useful analysis dimensions are:

- key length
- number of edges visited
- total characters compared
- output size for prefix enumeration
- number of copied nodes for persistent updates

Prefix enumeration is output-sensitive: returning `K` results necessarily costs at least `Ω(K)` just to emit them.

## 19. Radix Tree vs Ordinary Trie

| Property | Ordinary Trie | Radix Tree |
|---|---|---|
| Node per symbol | Usually yes | No |
| Sparse-path memory | Higher | Lower |
| Structural depth | Up to key length | Usually smaller |
| Edge comparison | Small | Potentially larger |
| Prefix semantics | Direct | Requires edge-aware handling |
| Split/merge complexity | Lower | Higher |
| Good for long sparse keys | Less attractive | Often attractive |

The right choice depends on workload, memory limits, mutation rate, and query distribution.

## 20. Comparison With Other Structures

### Hash Map
Excellent expected exact lookup, but no native ordered prefix traversal.

### Sorted Array
Compact and cache-friendly; prefix queries can use binary search, but frequent mutation is expensive.

### Ordinary Trie
Simple symbol-by-symbol prefix navigation, but potentially large node overhead.

### Radix Tree
Preserves prefix structure while reducing sparse-path overhead.

### Database Index
May provide persistence, concurrency, durability, and query planning that an in-memory radix tree does not.

## 21. Persistent / Immutable Radix Trees

For immutable updates, copy only the nodes along the modified path and share untouched subtrees.

A persistent insertion therefore trades allocation for snapshot safety:

```text
old root ── shared ── unchanged subtree
new root ── copied path
```

This supports:

- versioned dictionaries
- lock-free readers over immutable snapshots
- rollback
- reproducible search state

The number of copied nodes depends on compressed structural depth rather than raw key length, although label handling still matters.

## 22. Concurrency and Snapshots

A read-mostly system can publish a new immutable radix-tree root while existing readers continue using the previous snapshot.

This avoids fine-grained mutation locks at the cost of update allocations and eventual reclamation requirements.

For highly concurrent mutable trees, ownership, synchronization, atomic publication, and memory reclamation must be designed explicitly.

## 23. Backend Applications

Compressed tries can support:

- URL/path routing
- longest-prefix route lookup
- hierarchical configuration
- namespace indexes
- filesystem-like paths
- object-storage prefixes
- compact autocomplete dictionaries
- multi-tenant key namespaces

For production routing, a radix tree is often only one layer inside a larger system involving caching, authorization, versioning, and observability.

## 24. AI Engineering Applications

Potential applications include:

- compact token-prefix lexicons
- constrained decoding dictionaries
- entity namespaces
- vocabulary prefix lookup
- hierarchical labels
- prompt/tool namespace validation
- candidate prefix filtering

For AI workloads, separate **candidate generation** from **candidate ranking**. A radix tree can efficiently define the legal prefix space, while another component may score candidates.

## 25. Testing Strategy

Test the structural mutation boundaries aggressively:

1. insert unrelated keys
2. insert a key that is a prefix of an existing key
3. insert a key for which an existing key is a prefix
4. split in the middle of an edge
5. delete a leaf
6. delete a terminal branching node
7. delete a key that triggers collapse
8. rebuild/compress and compare semantics
9. serialize and deserialize
10. compare results against an ordinary trie or `Set`

Property-based testing is especially valuable because split/merge sequences create many structural states.

## 26. Adversarial Workloads

Benchmark with:

- long common prefixes
- highly sparse keys
- repeated insert/delete cycles
- random keys
- Unicode keys
- very large prefix-result sets
- hot prefixes
- duplicate updates

A structure that looks fast on random short strings can behave very differently on long shared prefixes.

## 27. Correctness Proof Pattern

For insertion, prove:

- every old key remains reconstructible
- the new key becomes terminal
- no sibling first-symbol invariant is violated

For deletion, prove:

- the target key is no longer terminal
- every other key remains reconstructible
- collapse removes only redundant structure

For prefix search, prove that the selected subtree is exactly the set of keys beginning with the requested prefix.

## 28. Common Mistakes

- treating a radix edge as a single character
- forgetting that a prefix can end inside an edge
- splitting at the wrong character index
- losing the old suffix during insertion
- deleting a shared prefix incorrectly
- collapsing terminal nodes
- allowing two sibling edges with the same first symbol
- assuming `substring`/slicing has zero engineering cost
- ignoring Unicode semantics
- reporting `O(L)` without defining character-comparison cost

## 29. Interview Framework

When given a compressed-trie problem:

1. Identify exact vs prefix semantics.
2. Define the key alphabet.
3. Choose node and edge representation.
4. State invariants.
5. Derive insertion cases.
6. Derive deletion and collapse cases.
7. Analyze compared characters and structural edges.
8. Handle terminal nodes explicitly.
9. Test split/merge boundaries.
10. Compare against trie, hash map, and sorted-array alternatives.

## 30. Revision Checklist

- [ ] Explain why path compression reduces memory overhead.
- [ ] Draw the ordinary-trie-to-radix transformation.
- [ ] Implement exact lookup.
- [ ] Implement insertion with edge splitting.
- [ ] Implement deletion with collapse.
- [ ] Handle prefixes ending inside edges.
- [ ] State radix invariants.
- [ ] Derive lookup and update complexity using character comparisons.
- [ ] Implement longest-prefix matching.
- [ ] Explain persistent radix trees.
- [ ] Compare radix trees with tries, hash maps, and sorted arrays.
- [ ] Design a backend namespace/routing index.
- [ ] Design an AI constrained lexicon.
- [ ] Validate with differential and property-based tests.

## Key Takeaways

1. A radix tree compresses maximal non-branching paths into labeled edges.
2. Edge splitting is the central insertion operation.
3. Deletion must preserve terminal semantics and collapse only redundant nodes.
4. Prefix queries may terminate inside an edge, so they require edge-aware logic.
5. Complexity should account for both structural traversal and characters compared.
6. Compression reduces node overhead but increases mutation and representation complexity.
7. Production use depends on workload, memory, update rate, concurrency, and persistence requirements.
8. The most reliable implementations are invariant-driven and heavily tested around split/merge boundaries.
