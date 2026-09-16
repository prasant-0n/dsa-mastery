# 13.02 — Trie Node Representation & Memory Model

## Objective

Understand how a trie node is represented in memory, how child containers affect performance and space, and how to choose a representation for a real workload.

## 1. Node as State

A trie node represents a prefix state. At minimum it needs access to outgoing transitions and a way to distinguish a complete key.

```text
Node
├── children
├── terminal
└── optional payload
```

## 2. Edge Representation

An edge represents the next symbol. In a basic character trie, one edge consumes one symbol.

```text
prefix + symbol → next prefix
```

## 3. Child Container Choices

Common JavaScript choices:

- `Map`
- plain object
- array indexed by alphabet position
- typed-array-backed tables
- custom compact structures

There is no universally optimal representation.

## 4. Map-Based Nodes

A `Map` naturally models sparse children:

```text
symbol → child node
```

It supports arbitrary symbol keys and explicit membership semantics.

## 5. Object-Based Nodes

Objects can be convenient for small alphabets, but property-key coercion and inherited-property behavior must be considered. A null-prototype object can avoid some prototype-chain hazards.

## 6. Array-Based Nodes

For a fixed compact alphabet, map each symbol to an integer and use an array:

```text
index = alphabetCode(symbol)
child = children[index]
```

This can provide direct indexing at the cost of unused slots.

## 7. Dense vs Sparse Representation

If only a few children exist out of a large alphabet, a dense array wastes memory. If most positions are populated, a dense representation can be appropriate.

## 8. Branching Factor

Let `B` be the number of children of a node. The actual branching distribution matters more than the theoretical alphabet size.

## 9. Node Count

For a set of keys, the number of trie nodes is approximately the number of distinct prefixes plus the root.

For keys with heavy prefix sharing, node count can be much smaller than the sum of key lengths.

## 10. Upper Bound

If there are `N` keys and key lengths `L1...LN`, a simple upper bound is:

```text
nodes ≤ 1 + Σ Li
```

because every inserted symbol can create at most one new node.

## 11. Memory Model

Total memory is not simply the number of nodes. Estimate:

```text
node objects
+ child containers
+ child entries/references
+ terminal metadata
+ payloads
+ allocator/runtime overhead
```

## 12. Per-Node Overhead

Two tries with identical logical node counts can have very different memory usage because their node and child-container representations differ.

## 13. Sparse Map Memory

A map-based node stores only present edges but has container and entry overhead. This is often suitable when branching is sparse.

## 14. Dense Array Memory

An array stores a slot for every possible alphabet symbol. This can be efficient for small dense alphabets but expensive for large alphabets.

## 15. Hybrid Representation

A production trie can switch representations based on child count:

```text
few children → sparse
many children → dense
```

Such adaptive representations add implementation complexity and migration cost.

## 16. Alphabet Encoding

If the alphabet is known, encode symbols into compact integer IDs. This reduces repeated key handling and enables array-based child storage.

## 17. Unicode and Encoding

For JavaScript strings, decide whether traversal operates on UTF-16 code units or Unicode code points. User-visible text may require grapheme-aware processing instead.

## 18. Byte Tries

For binary protocols, indexes, or encoded text, bytes may be the natural alphabet. This changes the alphabet size and representation trade-off.

## 19. Payload Placement

Payloads should normally live only where required. Storing large payload objects on every node unnecessarily increases memory retention.

## 20. Terminal Metadata

A terminal node may contain:

```text
isTerminal
value
frequency
record IDs
ranking information
```

Separate metadata from structural state when that improves memory behavior or lifecycle management.

## 21. Root Representation

The root does not represent a consumed symbol. It represents the empty prefix and may be terminal if empty keys are allowed.

## 22. Object Identity

Each node is an independent state object. Accidentally sharing a child node between unrelated prefixes can corrupt the trie because updates become visible through multiple paths.

## 23. Ownership Invariant

Unless the design explicitly uses structural sharing, each edge should point to the intended unique child node for that parent-symbol pair.

## 24. Structural Sharing

Persistent tries may intentionally share immutable nodes. In that case, ownership changes into a controlled immutability/versioning contract.

## 25. Cache Locality

Arrays and compact representations can improve locality. Pointer-heavy object graphs may increase indirection and reduce locality.

The runtime and workload determine whether this matters measurably.

## 26. Allocation Behavior

Inserting a new key may allocate several nodes. Repeated short-lived tries can create significant allocation and garbage-collection pressure.

## 27. Memory Retention

Deletion must release unreachable child structures when appropriate. References held by external caches, metadata, or snapshots can prevent reclamation.

## 28. Serialization

If a trie is persisted, choose an explicit representation rather than serializing arbitrary runtime objects. Define node IDs, child encoding, terminal state, and payload format.

## 29. Snapshotting

A read-heavy service may use immutable snapshots so readers can traverse a stable trie while a new version is built.

## 30. Concurrency

Mutable tries require synchronization if multiple execution contexts can mutate shared state. Immutable snapshots can simplify concurrent reads.

## 31. Compact Node Layout

For high-scale workloads, consider integer node IDs and flat arrays:

```text
terminal[nodeId]
firstChild[nodeId]
nextSibling[nodeId]
```

This can reduce object overhead but increases implementation complexity.

## 32. Child-Sibling Representation

Instead of a child container per node, a trie can encode children using linked sibling structures. This is compact in some sparse workloads but changes lookup costs.

## 33. Sorted Child Arrays

Store children in sorted order and search within the child list. This can trade memory for additional lookup comparisons.

## 34. Representation Decision Framework

Ask:

```text
What is the alphabet size?
What is the average branching factor?
How many keys?
How long are keys?
How much prefix sharing exists?
What is the memory budget?
What is the read/write ratio?
```

## 35. Complexity Caveat

`O(L)` assumes child selection is effectively constant-time. If child lookup takes `O(log B)` or `O(B)`, include that cost.

## 36. Memory Complexity

A useful model is:

```text
O(S + E + M)
```

where `S` is node state, `E` is child-edge representation, and `M` is stored metadata/payload size.

## 37. Benchmarking Representations

Benchmark equivalent logical tries using:

- Map children;
- object children;
- dense arrays;
- compact custom layouts.

Measure both runtime and memory.

## 38. Backend Implications

Routing and autocomplete services can have millions of prefixes. A representation that is convenient for a prototype may be too memory-intensive for production.

## 39. AI Implications

Vocabulary and candidate dictionaries can be large. Prefix sharing, compact encoding, and snapshot-based reads can materially affect memory and latency.

## 40. Correctness Invariants

For every node verify:

1. children are valid;
2. each symbol maps to the intended child;
3. terminal metadata is coherent;
4. no accidental cycles exist in a normal mutable trie;
5. representation-specific metadata agrees with logical children.

## 41. Common Mistakes

- assuming `Map` is always best;
- allocating a full alphabet array for every node;
- ignoring runtime object overhead;
- confusing key count with node count;
- forgetting payload memory;
- accidental child aliasing;
- inconsistent symbol encoding;
- measuring speed without measuring memory.

## 42. Interview Questions

Be prepared to answer:

- Why use `Map` instead of an object?
- When is an array better?
- What determines trie space?
- How does prefix sharing change memory?
- What happens with Unicode?
- How would you compact a large trie?
- How would you support concurrent reads?

## 43. Production Design Exercise

Design two versions of the same trie:

1. a readable JavaScript implementation;
2. a memory-conscious production representation.

Explain what complexity and maintainability trade-offs the second version introduces.

## Revision Checklist

- [ ] I can design a trie node from first principles.
- [ ] I understand Map, object, and array child representations.
- [ ] I can estimate node count and memory.
- [ ] I understand dense vs sparse branching.
- [ ] I can reason about Unicode and alphabet encoding.
- [ ] I understand allocation, locality, and retention.
- [ ] I can design compact or hybrid representations.
- [ ] I can explain persistence and concurrent-read strategies.
- [ ] I can include child lookup cost in complexity analysis.

## Key Takeaways

1. **Trie performance is determined as much by node representation as by the abstract algorithm.**
2. **Node count measures logical structure; real memory also includes container, entry, metadata, and runtime overhead.**
3. **Sparse and dense child representations make different trade-offs.**
4. **Production trie engineering requires deliberate symbol encoding, memory management, concurrency, and persistence decisions.**
