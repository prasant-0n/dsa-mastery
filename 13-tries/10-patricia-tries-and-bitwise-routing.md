# 13.10 — Patricia Tries & Bitwise Routing

## 1. Concept Definition

A **Patricia trie** is a compressed trie that removes paths containing no branching decision. In a bitwise Patricia structure, the discriminating symbols are bits rather than characters.

This makes Patricia-style structures useful for compact binary-key indexes, routing prefixes, longest-prefix matching, and other workloads where the key space is naturally represented as bits.

## 2. Why Bitwise Compression Exists

A binary trie can represent every bit of every key, but many paths contain no decision point. Patricia compression stores only the decisions that distinguish keys.

Benefits can include:

- fewer structural nodes
- compact representation of sparse binary key spaces
- efficient prefix-oriented lookup
- natural support for longest-prefix matching
- predictable traversal based on discriminating bits

The trade-off is increased implementation complexity and careful bit-level correctness requirements.

## 3. Mental Model

Imagine every binary key as a path through a binary tree. At each bit, go left for `0` and right for `1`.

A Patricia tree asks a stronger question:

> At which bit do the candidate keys first differ?

Only those discriminating positions need to remain as structural decisions.

## 4. Bitwise Computational Model

For fixed-width keys of `W` bits, a Patricia lookup examines a sequence of discriminating bit positions.

The number of structural decisions can be much smaller than `W`, especially when keys share long prefixes.

For variable-width keys, the implementation must additionally define:

- key length
- end-of-key semantics
- prefix semantics
- representation of missing bits
- maximum key width

Never analyze a bitwise structure without specifying the key model.

## 5. Binary Trie Baseline

A binary trie stores one node per bit position:

```text
             root
            /    \
           0      1
          / \    / \
         0   1  0   1
```

This baseline is valuable because Patricia compression can be understood as removing unary paths from it.

## 6. Patricia Representation

A simplified internal node can contain:

```js
{
  bitIndex: 7,
  left: ...,
  right: ...
}
```

A leaf stores the complete key and associated value.

The `bitIndex` identifies the discriminating bit used at that decision. A search follows the bit at that position rather than consuming every preceding bit structurally.

## 7. Discriminating Bit

For two different binary keys, the first differing bit is their discriminating position.

Given equal-length bit strings `a` and `b`:

1. scan from the most significant position
2. find the first position where `a[i] !== b[i]`
3. use that bit as the branching decision

With machine-word keys, XOR is a common way to find differences:

```text
x = a XOR b
```

The most significant set bit identifies the first differing position when the bit ordering is defined appropriately.

## 8. Lookup

A Patricia lookup typically:

1. starts at the root
2. reads the node's discriminating bit
3. chooses left or right
4. continues while discriminating positions increase according to the representation
5. reaches a leaf
6. verifies the complete key

The final key verification is important because structural traversal alone may identify a candidate rather than prove exact equality.

## 9. Why Leaf Verification Matters

Patricia trees compress structure aggressively. Therefore, a traversal can reach a leaf representing the closest structural candidate.

Exact lookup should still verify:

```text
candidateKey === queryKey
```

or an equivalent bitwise comparison.

This separation is a useful mental model:

- internal nodes perform routing
- leaves establish exact identity

## 10. Insertion

Insertion generally follows these steps:

1. search for the candidate leaf
2. compare the new key with that leaf
3. if equal, update the value
4. otherwise find the first differing bit
5. locate the correct insertion position according to bit-index ordering
6. create a new internal decision node
7. attach the old and new candidates on opposite branches

The ordering invariant on discriminating bit indexes is central to correctness.

## 11. Patricia Ordering Invariant

A common Patricia representation requires the discriminating bit indexes encountered during descent to follow a strict ordering.

For example, if traversal moves from a parent decision at bit `3` to a child decision at bit `9`, the child represents a later decision.

The exact inequality direction depends on whether bit indexes are numbered from most significant or least significant bit. State the convention before implementing.

## 12. Prefix Semantics

A prefix represents a set of keys whose first `p` bits match.

For longest-prefix routing, the algorithm should track the deepest valid prefix match while traversing the structure.

This differs from exact lookup because a query may legitimately match a stored prefix without being identical to a stored leaf key.

## 13. Longest-Prefix Matching

Longest-prefix matching is fundamental to routing.

Conceptually:

```text
stored prefixes:
0
00
001
0011

query:
001101...

answer:
0011
```

The search must preserve the most specific valid prefix encountered rather than simply returning the first match.

## 14. IPv4 / IPv6 Boundary

IP addresses are naturally fixed-width binary keys:

- IPv4: 32 bits
- IPv6: 128 bits

A prefix such as an address plus prefix length can therefore be represented as a bitwise prefix.

A production routing table has additional concerns such as route precedence, updates, memory layout, synchronization, and integration with networking infrastructure. A teaching Patricia tree should not be mistaken for a complete production routing stack.

## 15. Bit Operations in JavaScript

JavaScript's ordinary bitwise operators operate on signed 32-bit integers. This matters when implementing wider keys.

For IPv6 or other wide binary keys, consider:

- `BigInt`
- fixed-size byte arrays
- typed arrays
- custom word representations

Do not silently use JavaScript `Number` for arbitrary 64/128-bit bitwise logic.

## 16. Finding the First Differing Bit

For fixed-width byte arrays, compare bytes first, then identify the first differing bit within the byte.

For two words:

```text
xor = a XOR b
```

If `xor !== 0`, the position of its highest or lowest set bit can identify a differing bit depending on the chosen traversal convention.

The implementation must document endian and bit-index semantics.

## 17. Endianness and Representation

A routing index can represent a key as:

- network-order bytes
- host-order words
- strings of `'0'`/`'1'`
- arrays of bytes
- `BigInt`

These are not interchangeable without explicit conversion rules.

For production networking systems, a canonical byte order should be established at the boundary and preserved internally.

## 18. Deletion

Deletion removes a key while preserving every remaining routing decision.

Typical Patricia deletion may require:

1. finding the target leaf
2. locating its parent decision
3. removing the redundant decision when appropriate
4. reconnecting the surviving subtree

The exact pointer manipulation depends on the Patricia representation, so invariants should be written before code.

## 19. Binary Trie vs Patricia Trie

| Property | Binary Trie | Patricia Trie |
|---|---|---|
| Structural step | Every bit | Discriminating bits |
| Node count | Potentially high | Usually lower |
| Implementation | Simpler | More complex |
| Prefix navigation | Direct | Compressed |
| Key verification | Natural | Important at leaves |
| Memory overhead | Can be high | Often reduced |
| Routing use | Possible | Natural fit |

Compression is not automatically faster; memory layout, branch prediction, key verification, and workload shape matter.

## 20. Patricia vs Character Radix Tree

Both compress paths, but they compress different alphabets.

- character radix tree → strings/tokens
- Patricia → bits or machine-level discriminators

Character radix trees are natural for textual prefixes. Patricia structures are natural for fixed-width binary prefixes and routing-style workloads.

## 21. Routing Table Model

A route can be modeled as:

```js
{
  prefix: bytes,
  prefixLength: 24,
  nextHop: value,
  metric: 10
}
```

The index answers:

> Among all stored prefixes matching this destination, which one is the most specific valid prefix?

Policy selection can then occur after structural matching.

## 22. Duplicate Prefixes and Policy

Multiple routes can share the same prefix. Therefore, a production design may need a policy layer for:

- metric
- priority
- administrative preference
- tenant
- protocol
- health state

Do not mix structural prefix matching with unrelated policy decisions unless the API explicitly requires it.

## 23. Persistent and Immutable Patricia Trees

Patricia structures can support immutable snapshots by copying only the modified decision path and sharing untouched subtrees.

This can be useful for read-heavy systems where routing readers require stable snapshots while updates are prepared separately.

The design must account for:

- copied nodes
- shared leaves
- version publication
- reclamation
- update batching

## 24. Concurrency

Read-mostly routing structures often benefit from immutable publication:

```text
reader A → snapshot N
reader B → snapshot N
writer   → constructs N+1
publish  → snapshot N+1
```

This avoids locking every lookup, but the system still needs safe lifetime management for old snapshots.

Mutable concurrent Patricia structures require explicit synchronization and memory-ordering design.

## 25. Backend Applications

Bitwise prefix indexes can support:

- network route lookup
- CIDR prefix indexes
- binary protocol dispatch
- compact key indexes
- hierarchical binary namespaces
- access-control prefix matching
- sharded key routing

For distributed systems, the Patricia tree usually serves as an in-process lookup component rather than replacing the distributed control plane.

## 26. AI Engineering Applications

Bitwise Patricia structures are less common than textual tries in AI systems, but the underlying technique can help with:

- compact binary identifiers
- feature-key prefix indexes
- compressed routing metadata
- binary embedding/index metadata
- memory-efficient lookup structures

For textual token vocabularies, character/token tries or radix trees are usually the more direct abstraction.

## 27. Correctness Invariants

A robust implementation should verify:

1. every leaf has a valid complete key
2. every internal node has a valid discriminating bit index
3. branch selection agrees with the stored bit
4. discriminating indexes satisfy the representation's ordering invariant
5. exact lookup verifies leaf identity
6. deletion preserves every remaining key
7. longest-prefix lookup returns the most specific matching prefix

## 28. Testing Strategy

Test:

- empty tree
- one key
- identical keys
- keys differing at the first bit
- keys differing at the last bit
- long common prefixes
- nested prefixes
- duplicate prefixes
- deletion of root-adjacent decisions
- repeated insert/delete cycles
- random fixed-width keys
- adversarial clustered prefixes

Use a simple binary trie or linear reference implementation as a differential oracle.

## 29. Complexity Analysis

For fixed-width keys of `W` bits, naive binary-trie traversal can require `O(W)` structural steps.

A Patricia tree traverses only discriminating decisions, but each lookup may still require final key verification. A useful model therefore separates:

- number of internal decisions
- bit extraction cost
- final key-comparison cost
- prefix-policy evaluation cost

For fixed-width small keys, these may be treated as constants in application-level analysis; for general keys, they should not be hidden.

## 30. Interview Framework

When solving a Patricia/routing problem:

1. Define the key width and representation.
2. Define bit numbering and endianness.
3. State the discriminating-bit invariant.
4. Build the binary-trie baseline.
5. Explain path compression.
6. Derive lookup and leaf verification.
7. Derive insertion around the first differing bit.
8. Derive deletion and pointer repair.
9. Explain exact vs longest-prefix lookup.
10. Analyze complexity and memory.
11. Compare with binary trie, hash map, radix tree, and sorted prefixes.

## 31. Revision Checklist

- [ ] Explain Patricia compression from a binary trie.
- [ ] Define a discriminating bit.
- [ ] Implement first-differing-bit detection.
- [ ] Implement exact lookup with leaf verification.
- [ ] Implement insertion.
- [ ] Implement deletion.
- [ ] State and validate bit-index ordering invariants.
- [ ] Implement prefix matching.
- [ ] Implement longest-prefix matching.
- [ ] Explain IPv4/IPv6 representation choices.
- [ ] Handle JavaScript 32-bit bitwise limitations.
- [ ] Compare Patricia with character radix trees.
- [ ] Design a snapshot-based routing index.
- [ ] Build a differential reference implementation.

## Key Takeaways

1. Patricia tries compress binary decision paths down to discriminating bits.
2. Internal nodes route; leaf verification establishes exact key identity.
3. Bit numbering, endian convention, and key width are part of correctness.
4. Longest-prefix matching is a central routing application.
5. JavaScript requires care for keys wider than 32 bits.
6. Persistent snapshots can provide efficient read-mostly update isolation.
7. Differential testing against a simple binary trie is an effective correctness strategy.
