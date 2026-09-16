# 13.03 — Trie Insert, Search & Prefix Operations

## Objective

Master the three foundational trie operations: inserting a key, finding an exact key, and navigating to a prefix. The focus is on state transitions, contracts, invariants, complexity, and production-safe implementation choices.

## 1. The Three Core Queries

A basic trie answers three related but different questions:

```text
insert(key)
search(key)
hasPrefix(prefix)
```

`search` asks whether a complete key exists. `hasPrefix` asks whether the path exists, even if the prefix itself is not a stored key.

## 2. Key as a Sequence

For a key such as `backend`:

```text
b → a → c → k → e → n → d
```

The trie processes one symbol at a time and transitions between prefix states.

## 3. Insert Contract

Given a key and optional value, insertion must ensure that every symbol has a corresponding path and that the final node represents a complete key.

Define duplicate-key behavior explicitly.

## 4. Search Contract

Exact search succeeds only when every transition exists and the final node is terminal.

A path alone is insufficient.

## 5. Prefix Contract

Prefix lookup succeeds when every symbol in the prefix can be followed from the root. Terminal state is not required.

## 6. Traversal Primitive

All three operations can share a common primitive:

```text
start at root
for each symbol:
    find child
    if missing → fail
    move to child
return final node
```

Insert differs because it creates missing children.

## 7. Iterative Insert

An iterative implementation is natural:

```text
node = root
for symbol in key:
    if child missing:
        create child
    node = child
mark node terminal
```

## 8. Iterative Search

Search never mutates the structure:

```text
node = root
for symbol in key:
    child = lookup(node, symbol)
    if absent: return not-found
    node = child
return terminal state
```

## 9. Prefix Navigation

Prefix lookup can reuse exact traversal but stops at the prefix node. This node becomes the entry point for later enumeration or autocomplete.

## 10. Complexity

For key length `L` and child lookup cost `C(B)`:

```text
insert  = O(L · C(B))
search  = O(L · C(B))
prefix  = O(P · C(B))
```

With effectively constant-time child selection, these become `O(L)`, `O(L)`, and `O(P)`.

## 11. Mutation Cost

Insertion can allocate up to `L` new nodes in the worst case. With shared prefixes, fewer nodes are created.

## 12. Duplicate Inserts

Possible policies:

```text
replace
ignore
reject
increment frequency
merge payload
```

The data structure should not silently choose business semantics.

## 13. Empty Key

If empty keys are allowed, the root represents the empty sequence and can be terminal.

## 14. Prefix-Key Relationship

Consider:

```text
app
apple
```

Both are valid. The node for `app` is terminal and also has a child path for `apple`.

## 15. Values

A terminal node may store a value. Non-terminal nodes may also carry metadata when the application needs prefix-level information.

## 16. Frequency Metadata

For autocomplete, each terminal key can store a frequency. Prefix nodes can optionally store aggregate metadata for faster ranking.

## 17. Prefix Enumeration

After locating the prefix node, enumerate its subtree. The cost is approximately:

```text
prefix traversal + output size + traversal overhead
```

A prefix query returning many results cannot be truly `O(P)` because producing those results itself costs time.

## 18. Lexicographic Enumeration

If children are traversed in sorted symbol order, descendants can be emitted lexicographically. The child representation determines the cost of maintaining that order.

## 19. Early Failure

Exact search can stop immediately when a transition is missing. This makes unsuccessful queries sensitive to the location of the first mismatch.

## 20. Common Prefix Work

Keys such as:

```text
user
users
username
```

reuse the same prefix path. Insertions should never duplicate existing prefix nodes unnecessarily.

## 21. Normalization Boundary

Normalize keys before traversal when the application requires canonical matching. The same normalization must be applied consistently to insertion and lookup.

## 22. Unicode

Define symbol semantics before implementation. JavaScript iteration can operate over code units or code points, and user-visible graphemes may require a different abstraction.

## 23. Case Sensitivity

Decide whether:

```text
Node
node
NODE
```

are distinct keys. This is a contract decision, not a trie property.

## 24. Child Lookup Semantics

The child lookup operation must distinguish:

```text
missing child
vs
child whose value is falsy
```

Do not use truthiness as a substitute for membership.

## 25. JavaScript Map

`Map` provides explicit key membership and works naturally for sparse children. It is often a clear default for educational implementations.

## 26. Object Pitfalls

Plain objects have property semantics that differ from `Map`. Special property names and prototype inheritance can create surprising behavior. A null-prototype object or `Map` can avoid these issues.

## 27. Array Children

For a known compact alphabet, an array provides direct indexing. The symbol must first be encoded into an integer.

## 28. Error Semantics

Define behavior for:

- non-string keys;
- null/undefined;
- invalid symbols;
- empty keys;
- duplicate keys.

A library should validate or document these cases explicitly.

## 29. Invariants After Insert

After insertion:

1. every symbol in the key has a path;
2. the final node is terminal;
3. existing keys remain searchable;
4. unrelated branches remain unchanged.

## 30. Invariants After Search

Search must be observational unless explicitly designed otherwise. It should not create nodes or mutate terminal state.

## 31. Prefix Invariant

If `hasPrefix(p)` is true, every prefix of `p` must also correspond to a reachable path.

## 32. Correctness Proof for Insert

Use induction over the key symbols. After processing the first `i` symbols, the current node represents exactly that prefix. Creating a missing transition preserves this property. After all symbols are consumed, marking the node terminal establishes the complete-key postcondition.

## 33. Correctness Proof for Search

At each iteration, the current node represents the consumed prefix. If a required transition is absent, no stored key can contain that exact prefix path. If all transitions exist, terminal state determines whether the full key was inserted.

## 34. Correctness Proof for Prefix Search

The same path invariant shows that successful traversal establishes existence of the requested prefix. No terminal condition is needed.

## 35. Edge Cases

Test at least:

- empty trie;
- empty key;
- one-character key;
- missing first symbol;
- missing middle symbol;
- key equal to another key;
- key that is a prefix of another;
- another key that is a prefix of the query;
- duplicate insertion.

## 36. Backend Applications

Core operations support:

- API route prefix matching;
- command lookup;
- autocomplete endpoints;
- configuration namespaces;
- hierarchical permission keys.

## 37. AI Applications

Core operations can support:

- vocabulary membership;
- token-prefix lookup;
- lexicon search;
- entity candidate generation;
- constrained string generation.

## 38. Trie Does Not Mean Faster Everywhere

A trie is advantageous when prefix structure is part of the query. For simple exact membership, a hash table can be simpler and may use less memory.

## 39. Benchmark Design

Compare:

```text
exact lookup
prefix lookup
insertion
memory
```

under workloads with both high and low prefix sharing.

## 40. Interview Problem Pattern

When you see “starts with,” “prefix,” “autocomplete,” or “dictionary of strings,” consider a trie. Then verify whether constraints justify its memory cost.

## 41. Production Design

A production trie API should document:

- key normalization;
- symbol semantics;
- duplicate policy;
- value lifecycle;
- memory limits;
- concurrency model;
- persistence/snapshot behavior.

## Revision Checklist

- [ ] I can implement insertion from first principles.
- [ ] I can implement exact search.
- [ ] I can implement prefix lookup.
- [ ] I understand terminal-state semantics.
- [ ] I can derive operation complexity.
- [ ] I can prove correctness using path invariants.
- [ ] I understand duplicate, empty-key, and Unicode cases.
- [ ] I can compare Map, object, and array children.
- [ ] I can identify backend and AI applications.

## Key Takeaways

1. **Insert, exact search, and prefix navigation are different contracts built on the same path traversal primitive.**
2. **Terminal state distinguishes a stored key from merely existing prefix structure.**
3. **Operation complexity is driven by key/prefix length plus child lookup cost.**
4. **Correctness comes from maintaining the prefix-path invariant through every transition.**
5. **The decision to use a trie must include its memory and representation costs.**
