# 11.06 — Binary Tree Construction, Serialization, Deserialization & Reconstruction

## 1. Objective

Tree construction and serialization turn hierarchical structure into a transferable representation and back again. The central requirement is preserving enough information to reconstruct the intended structure unambiguously.

## 2. Why Serialization Exists

Trees may need to cross:

- process boundaries;
- network APIs;
- storage systems;
- caches;
- test fixtures;
- queues;
- application restarts.

A serializer defines a representation; a deserializer reconstructs the data structure from that representation.

## 3. Serialization Contract

A production serialization format should define:

1. supported node values;
2. null/missing-child representation;
3. ordering semantics;
4. duplicate-value behavior;
5. versioning expectations;
6. malformed-input behavior;
7. size and resource limits.

## 4. Why Values Alone Are Insufficient

For a binary tree, preorder values without null markers do not necessarily identify the shape.

For example, a single-child chain can have the same value sequence under multiple structural arrangements.

Structure must therefore be encoded explicitly or reconstructed using additional information.

## 5. Preorder + Null Markers

A common representation is:

```text
node → value, serialize(left), serialize(right)
null → null marker
```

The resulting sequence contains both values and shape.

## 6. Recursive Serialization

The recursive serializer follows the tree definition directly:

```text
serialize(node)
  if null → marker
  return value + serialize(left) + serialize(right)
```

Its time complexity is `O(N)` and its recursive auxiliary space is `O(H)` apart from output storage.

## 7. Iterative Serialization

An explicit stack can replace recursive calls. Stack entries represent pending nodes or traversal frames.

This is useful when input trees may be deeper than the safe JavaScript call-stack depth.

## 8. Deserialization State

A preorder-with-null-markers decoder consumes tokens in exactly the same structural order used by the serializer.

Conceptually:

```text
token → construct node
       → recursively consume left subtree
       → recursively consume right subtree
```

## 9. Token Consumption Invariant

At every recursive decoder call, the next unread token must represent exactly the root of the subtree being reconstructed.

This invariant is the core correctness argument.

## 10. Iterative Deserialization

An iterative decoder can maintain frames representing nodes whose child slots are still unresolved.

Each token fills the next required child position.

## 11. Round-Trip Property

For valid trees and a lossless representation:

```text
deserialize(serialize(T)) ≡ T
```

where equivalence must specify whether identity, values, or structure is being compared.

## 12. Structural vs Identity Equality

Deserialization creates new node objects. Therefore object identity normally differs after a round trip.

The useful property is usually structural/value equivalence rather than reference equality.

## 13. Preorder + Inorder Reconstruction

When node values are unique, preorder identifies the root while inorder identifies left/right partitions.

Recursive reconstruction:

```text
preorder root
→ locate root in inorder
→ recursively build left range
→ recursively build right range
```

A map from value to inorder position reduces repeated searches.

## 14. Duplicate Values

With duplicate values, a simple value-to-index map is insufficient because multiple nodes can share the same value.

Solutions require explicit occurrence tracking, stable identities, or a serialization format that records structure directly.

## 15. Inorder + Postorder

Postorder identifies the root as the final value of a subtree. The same partition principle can reconstruct a tree when the necessary uniqueness assumptions hold.

## 16. Level-Order Construction

A binary tree can also be represented by level-order values with explicit missing-child markers.

A queue of parent nodes tracks which child slot should receive each token.

## 17. Complete-Tree Array Representation

For complete trees, an array can represent structure implicitly:

```text
left(i)  = 2i + 1
right(i) = 2i + 2
```

No null markers are required when completeness is guaranteed.

## 18. Sparse Array Representation

Using the same positional indexing for sparse trees can introduce large gaps and memory waste.

Choose an explicit representation when sparsity is significant.

## 19. Compact Encoding

Serialization size can be reduced using techniques such as:

- compact null markers;
- integer encoding;
- dictionary/reference encoding for repeated values;
- structural bitmaps;
- binary formats.

The format must remain unambiguous.

## 20. Streaming Serialization

Large trees may not fit comfortably into one intermediate string or array. A streaming serializer can emit tokens incrementally.

This reduces peak memory but complicates error handling and framing.

## 21. Streaming Deserialization

A streaming decoder should maintain enough parser state to continue when only part of the token stream has arrived.

The parser must distinguish incomplete input from invalid input.

## 22. Validation

Deserializers should validate:

- token type;
- structural grammar;
- maximum depth;
- maximum node count;
- value constraints;
- trailing tokens;
- malformed or truncated streams.

Never assume serialized input is trustworthy merely because it came from an internal boundary.

## 23. Resource Limits

A malicious or corrupted representation can cause:

- excessive allocation;
- extreme recursion depth;
- huge strings;
- oversized node counts;
- parser denial of service.

Production decoders should enforce explicit limits.

## 24. Versioning

Persistent serialization formats should be versioned when the schema can evolve.

A decoder may need to support multiple versions or perform controlled migrations.

## 25. Schema Evolution

Adding optional metadata is generally easier than changing structural semantics.

A robust format defines compatibility rules before deployment.

## 26. Error Semantics

Distinguish:

```text
valid complete input
valid prefix but incomplete
malformed input
resource-limit violation
unsupported version
```

This distinction matters in streaming and network systems.

## 27. Canonical Serialization

A canonical format produces one deterministic representation for equivalent trees. This is useful for:

- hashing;
- caching;
- deduplication;
- snapshot comparison;
- reproducible tests.

## 28. Structural Hashing

A canonical serialization or recursive structural hash can provide a compact subtree fingerprint.

Hash equality should not automatically be treated as mathematical equality when collision risk matters; exact verification may be required.

## 29. Construction from Sorted Data

A sorted array can be converted into a height-balanced BST by recursively selecting a middle element as the root and partitioning the remaining ranges.

This provides approximately logarithmic height when the selection is balanced.

## 30. Construction from Insertion Order

Building a BST by inserting values preserves insertion-induced shape. Sorted insertion creates a highly skewed tree.

Therefore construction strategy directly affects later search complexity.

## 31. Complexity

For a tree with `N` nodes:

```text
Serialization: O(N)
Deserialization: O(N)
```

Reconstruction from preorder + inorder can be:

```text
O(N)
```

when positions are indexed in a map and uniqueness assumptions hold.

Auxiliary recursion/stack is typically `O(H)` plus representation/storage requirements.

## 32. Correctness Proof

For preorder-with-null serialization:

1. each subtree emits exactly one root token or null marker;
2. left and right subtree encodings follow the root in fixed order;
3. the decoder consumes the same grammar;
4. therefore every token maps to exactly one structural position.

This establishes round-trip structural equivalence.

## 33. Common Mistakes

1. Omitting null markers when structure matters.
2. Assuming duplicate values are unique identifiers.
3. Forgetting trailing-token validation.
4. Recursing on untrusted depth without limits.
5. Confusing object identity with structural equality.
6. Using a sparse array representation for highly irregular trees.
7. Ignoring serialization versioning for persistent data.

## 34. Edge Cases

Test:

- empty tree;
- single node;
- one-sided tree;
- complete tree;
- highly skewed tree;
- duplicate values;
- null-valued nodes if allowed;
- malformed tokens;
- truncated input;
- extra trailing tokens;
- very deep trees;
- very large values.

## 35. Backend Applications

Serialization is directly relevant to:

- cache snapshots;
- API payloads;
- job/message queues;
- distributed service boundaries;
- persistent hierarchy storage;
- AST transport;
- configuration trees.

## 36. AI Applications

Tree serialization can support:

- search-state persistence;
- planning snapshots;
- AST pipelines;
- decision-tree storage;
- structured reasoning state;
- experiment reproducibility.

## 37. Testing Strategy

Use:

- round-trip tests;
- structural equality checks;
- randomized tree generation;
- duplicate-value cases;
- malformed-input tests;
- resource-limit tests;
- recursive vs iterative differential tests;
- canonical serialization tests.

## 38. Interview Framework

When asked to construct or serialize a tree:

```text
1. What information must survive the round trip?
2. Are null children encoded?
3. Are values unique?
4. Is the tree binary/general/complete/BST?
5. Is the input trusted?
6. Can recursion depth become unsafe?
7. Is the representation streamed or materialized?
8. What are time and memory costs?
9. What happens on malformed input?
10. Is versioning required?
```

## 39. Revision Checklist

- [ ] I can serialize a binary tree with null markers.
- [ ] I can deserialize it correctly.
- [ ] I understand the token-consumption invariant.
- [ ] I can explain preorder + inorder reconstruction.
- [ ] I understand duplicate-value ambiguity.
- [ ] I understand level-order representations.
- [ ] I understand complete-tree array encoding.
- [ ] I can design a streaming representation.
- [ ] I can validate malformed/untrusted input.
- [ ] I can explain backend and AI serialization use cases.

## 40. Key Takeaways

1. **A lossless tree representation must preserve every piece of information needed to recover the intended structure.**
2. **Null markers make preorder serialization structurally unambiguous for binary trees.**
3. **Traversal-based reconstruction depends critically on assumptions about value uniqueness.**
4. **Production deserialization is a parsing problem with validation, limits, error semantics, and versioning—not merely object creation.**
5. **Round-trip testing is one of the strongest correctness properties for serialization systems.**
