# 13.14 — Trie Memory & Cache Engineering

## 1. Concept Definition

Trie memory and cache engineering studies how node layout, child representation, string storage, allocation strategy, locality, and metadata placement affect real-world performance.

Asymptotic complexity tells us how work scales. It does not tell us how many bytes each node consumes, how many cache lines a lookup touches, or how allocation and garbage collection affect tail latency.

## 2. Why Memory Engineering Matters

A logically simple trie can become expensive because every node may contain:

- object headers
- child containers
- pointers/references
- terminal metadata
- strings
- ranking metadata
- allocator overhead

For large dictionaries, metadata overhead can dominate the actual key bytes.

## 3. Mental Model

Think in three layers:

```text
Logical keys
    ↓
Trie topology
    ↓
Physical memory layout
```

Two structures can implement the same algorithm while having dramatically different memory behavior because their physical representations differ.

## 4. Memory Budget

Define a budget before optimization:

```text
B = total allowed bytes
N = nodes
E = edges
K = stored keys
M = metadata bytes
```

A useful engineering question is:

> How many keys can this representation support before the memory budget is exhausted?

This is often more actionable than simply saying “space is O(N).”

## 5. Object-Heavy JavaScript Trie

A straightforward JavaScript node might contain:

```js
{
  children: new Map(),
  terminal: false,
  value: null
}
```

This is easy to implement but may carry substantial per-object overhead.

For large datasets, millions of small objects can create memory pressure and garbage-collection work.

## 6. Child Representation Choices

Common representations include:

- `Map`
- plain object
- sorted array
- compact array
- fixed alphabet array
- typed-array-backed indexes
- custom packed structures

There is no universally optimal representation.

Choose according to alphabet size, child density, lookup pattern, mutation rate, and memory budget.

## 7. Fixed Alphabet Arrays

For a tiny dense alphabet, an array can provide direct indexing:

```text
child[c] → node
```

This can make lookup predictable but wastes space when nodes have few children.

A trie over lowercase English letters may tolerate this differently from a trie over arbitrary Unicode symbols.

## 8. Sparse Children

For sparse nodes, storing only existing children can be more memory efficient.

Options include:

```text
symbol → child
```

using a map, or a compact sorted representation.

The trade-off is additional lookup work and potentially less predictable memory access.

## 9. Small-Node Optimization

Many tries have a large number of nodes with only one or two children.

A specialized representation can optimize common degrees:

```text
0 children → compact terminal node
1 child    → inline child representation
2 children → tiny array
many       → Map/array representation
```

This is a form of adaptive representation.

## 10. Adaptive Child Containers

A node can transition representation as its degree changes.

For example:

```text
0 → 1 → 2 → 4 → many
```

Each threshold should be chosen from measured workload data.

Representation transitions complicate mutation and serialization, so complexity must justify the benefit.

## 11. Cache Locality

CPU caches favor data that is physically near recently accessed data.

Pointer-heavy structures can cause pointer chasing:

```text
node → Map → entry → node → Map → entry → node
```

A packed representation can reduce indirections.

Therefore two `O(L)` trie lookups may have very different latency.

## 12. Pointer Chasing

Ordinary tries can perform one pointer transition per symbol.

Long paths therefore generate many dependent memory accesses.

Radix compression reduces structural depth and may reduce pointer chasing, although edge-label comparison becomes more expensive.

This is one reason compressed tries can improve practical performance even when both algorithms are asymptotically similar.

## 13. Struct-of-Arrays vs Array-of-Structs

A node can be represented as one object per node:

```text
node = { terminal, childIndex, metadata }
```

or with parallel arrays:

```text
terminal[nodeId]
firstChild[nodeId]
metadata[nodeId]
```

Struct-of-arrays layouts can improve locality for operations that access only selected fields.

Array-of-structs layouts can be simpler and more natural for object-oriented mutation.

## 14. Integer Node IDs

Instead of JavaScript object references, nodes can be represented by integer IDs into arrays.

Conceptually:

```text
nodeId = 42
children[42] = ...
terminal[42] = true
```

Benefits can include compact references, easier serialization, and predictable storage.

Costs include more manual memory management and complexity.

## 15. Typed Arrays

Typed arrays can store compact numeric metadata:

- `Uint32Array` for child indexes
- `Uint8Array` for flags
- `Float64Array` for scores

They are especially useful when the structure can be encoded as numeric tables.

JavaScript object APIs and typed-array layouts can coexist: use objects at the application boundary and packed storage internally where justified.

## 16. String Storage

Storing a complete string at every terminal node duplicates data that already exists along the path.

Alternatives include:

- reconstructing keys during traversal
- storing terminal IDs
- storing slices/offsets
- interned strings
- compressed edge labels

The correct choice depends on how frequently complete keys must be returned.

## 17. String Interning

If many values repeat the same strings, interning can avoid duplicate storage.

However, an intern pool can itself become a long-lived memory root. It needs explicit lifecycle and eviction considerations when data is dynamic.

## 18. Radix Edge Labels

Compressed tries can store labels as:

```text
copied string
source + offset + length
byte range
```

Offset-based labels can reduce copying but retain the source buffer.

This can unexpectedly keep a large source string alive because one small edge references a large backing allocation.

## 19. Allocation Behavior

Frequent insert/delete operations can generate many short-lived objects.

Potential consequences:

- allocation overhead
- garbage-collection pressure
- fragmentation in native implementations
- latency spikes

Pooling or reusable node storage can help specialized workloads, but pools introduce lifecycle and retention complexity.

## 20. Free Lists

An array-backed trie can maintain a free list of reusable node IDs.

Conceptually:

```text
free → 17 → 31 → 48
```

Deletion returns IDs to the pool; insertion can reuse them.

The implementation must prevent stale references from treating a recycled node as the previous logical node.

## 21. Cache-Aware Prefix Search

Prefix queries often revisit hot nodes.

Useful cached metadata can include:

- subtree key count
- top suggestions
- maximum score
- terminal count
- route metadata

Caching can reduce repeated traversal but increases memory and invalidation cost.

## 22. Hot-Node Detection

Measure access frequency before deciding what to cache.

A hot node may be identified through:

- request counters
- sampling
- approximate frequency sketches
- periodic profiling

Do not instrument every operation indefinitely if the counters themselves become a significant memory or CPU cost.

## 23. Top-K Cache Engineering

A prefix node may cache its top `K` suggestions.

Advantages:

- fast autocomplete
- bounded result work

Costs:

- write amplification
- cache invalidation
- memory per prefix
- ranking maintenance

A common strategy is to cache only sufficiently hot prefixes.

## 24. Cache Invalidation

When a terminal key changes, affected ancestor caches may become stale.

Options include:

- eager invalidation
- incremental update
- versioned metadata
- lazy validation
- periodic rebuild

The consistency requirement determines the acceptable strategy.

## 25. Versioned Cache Metadata

A node can associate cached data with a tree version:

```text
cache.version === snapshot.version
```

Readers can reject stale cache entries without requiring every mutation to synchronously update every cache.

This pairs naturally with immutable snapshots.

## 26. Snapshot-Friendly Memory

Persistent tries share unchanged nodes across versions.

This saves copying but means hot shared subtrees may remain alive across many versions.

Memory analysis must therefore distinguish:

- allocated nodes
- reachable nodes
- unique nodes
- retained nodes across snapshots

## 27. Memory Retention

A small reference to an old root can retain an enormous subtree.

Common causes:

- request contexts holding snapshots
- caches holding old versions
- closures retaining roots
- debugging structures
- failed cleanup paths

Production systems should track snapshot age and retained memory.

## 28. GC Considerations in Node.js

Large object graphs can interact with garbage collection in ways not visible from asymptotic analysis.

Useful measurements include:

- heap size
- allocation rate
- GC pause time
- old-generation growth
- retained object counts

A benchmark that ignores GC can produce misleading results.

## 29. Serialization Layout

Packed trie representations can serialize efficiently because node references become integer indexes.

A serialized format should specify:

- version
- key encoding
- node arrays
- edge data
- metadata schema
- endianness where binary
- integrity checks

Never rely on JavaScript object insertion order as a durable binary format contract.

## 30. Memory-Mapped / External Storage Boundary

For extremely large dictionaries, the complete trie may not fit comfortably in memory.

Possible architectures include:

- paged trie nodes
- memory-mapped structures in native systems
- database-backed indexes
- cache tiers
- compressed immutable segments

The performance model then includes page/cache misses and I/O latency.

## 31. Backend Applications

Memory-aware trie engineering matters for:

- large routing tables
- autocomplete services
- namespace indexes
- authorization dictionaries
- URL routers
- configuration stores
- object-prefix indexes

A production system should define a memory budget and a degradation policy before deployment.

## 32. AI Applications

AI systems can contain very large lexicons and prefix metadata.

Memory engineering can improve:

- constrained decoding
- token-prefix filtering
- entity dictionaries
- tool-name indexes
- retrieval candidate generation

For inference, memory locality can matter because the trie may be traversed repeatedly across many requests.

## 33. Benchmark Methodology

Measure at least:

1. cold-cache behavior where meaningful
2. warm-cache behavior
3. average latency
4. p95/p99 latency
5. memory footprint
6. allocation rate
7. GC behavior
8. insertion throughput
9. prefix-query throughput
10. result size distribution

Use representative and adversarial workloads.

## 34. Memory/Latency Trade-Off

More metadata can make reads faster while consuming more memory.

For example:

```text
No prefix cache
→ low memory, more traversal

Top-K prefix cache
→ high memory/write cost, faster hot reads
```

There is no universal optimum; choose a point on the workload-specific trade-off curve.

## 35. Production Guardrails

Define limits for:

- maximum keys
- maximum memory
- maximum cached prefixes
- maximum Top-K size
- maximum key length
- maximum update rate
- snapshot retention

When limits are exceeded, define behavior explicitly: reject, evict, compact, rebuild, or degrade.

## 36. Common Mistakes

- optimizing node count while ignoring child-container overhead
- assuming arrays are always faster than maps
- ignoring cache locality
- retaining giant backing strings through slices
- caching every prefix
- measuring only average latency
- ignoring garbage collection
- comparing implementations with different workloads
- using microbenchmarks as production proof

## 37. Complexity

The logical trie operations remain approximately:

- lookup: `O(L)`
- insertion: `O(L)`
- deletion: `O(L)` plus pruning/metadata work

Physical performance additionally depends on:

- cache misses
- allocation
- GC
- branch behavior
- child-container representation
- string comparison
- metadata maintenance

These costs belong in an engineering-level complexity model.

## 38. Interview Framework

For a memory-performance trie question:

1. Establish workload and memory budget.
2. Estimate per-node and per-edge overhead.
3. Identify pointer-heavy components.
4. Choose child representation based on degree distribution.
5. Consider packed node IDs.
6. Analyze string storage.
7. Analyze cache locality.
8. Decide what metadata is worth caching.
9. Measure GC and tail latency.
10. Define degradation and observability.

## 39. Revision Checklist

- [ ] Estimate actual node memory.
- [ ] Compare `Map`, object, arrays, and packed representations.
- [ ] Explain pointer chasing.
- [ ] Explain struct-of-arrays vs array-of-structs.
- [ ] Implement an integer-ID representation.
- [ ] Analyze radix edge storage.
- [ ] Explain allocation and GC effects.
- [ ] Design hot-prefix caching.
- [ ] Analyze cache invalidation.
- [ ] Measure retained memory across snapshots.
- [ ] Benchmark p95/p99 latency.
- [ ] Define memory guardrails.

## Key Takeaways

1. Big-O does not describe physical memory or cache behavior.
2. Node and child-container overhead can dominate trie memory.
3. Packed representations can improve locality and reduce overhead.
4. Radix compression reduces pointer chasing but introduces edge-comparison work.
5. Prefix caches trade memory and write amplification for faster hot reads.
6. Persistent snapshots require careful retained-memory analysis.
7. Production trie optimization must measure memory, allocation, GC, locality, and tail latency—not just operation counts.
