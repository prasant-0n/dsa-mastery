# 13.01 — Trie Fundamentals & Prefix-Tree Mental Model

## Objective

Understand the trie as a specialized tree for storing sequences of symbols so that shared prefixes share structure. Build the mental model needed for autocomplete, dictionary lookup, routing, indexing, and AI/NLP systems.

## 1. What Is a Trie?

A **trie** is a rooted tree in which a path from the root represents a sequence of symbols. A node may mark the end of a complete key.

Example:

```text
                 root
                /    \
               c      d
               |      |
               a      o
              / \     |
             t   r    g
```

The words `cat`, `car`, and `dog` share structure where their prefixes overlap.

## 2. Why Tries Exist

Hash tables provide fast exact-key lookup, but they do not naturally expose prefix structure. Sorted arrays and search trees can support ordered operations, but prefix traversal may require additional work.

A trie makes the prefix explicit in the data structure itself.

## 3. Mental Model

Think of a trie as:

```text
key = sequence of choices
node = prefix state
edge = next symbol
terminal marker = complete key
```

For a key `code`:

```text
root → c → o → d → e → terminal
```

## 4. Trie vs Binary Tree

A normal binary tree has at most two child positions. A trie may have one child per symbol in its alphabet.

The branching factor depends on the representation and alphabet.

## 5. Trie vs General Tree

A trie is a specialized general tree where edges correspond to symbols or sequence fragments and paths encode keys.

## 6. Prefix Sharing

Suppose the keys are:

```text
car
card
care
cat
```

The prefix `ca` is stored once and shared by all four keys.

This is the defining structural advantage of a trie.

## 7. Node Model

A basic node commonly contains:

```text
children
isTerminal
optional value
optional metadata
```

In JavaScript, `children` can be represented using `Map`, an object, an array, or a specialized structure.

## 8. Terminal Nodes

A node represents a complete key only when explicitly marked terminal.

Therefore:

```text
app
apple
```

can coexist. The node for `app` is terminal even though it has a child for `l`.

## 9. Exact Search

To search for a key, process its symbols from left to right. At every step, follow the corresponding child.

The search succeeds only if:

1. every symbol exists;
2. the final node is terminal.

## 10. Prefix Search

To determine whether any key begins with a prefix, only the path for the prefix must exist. The final node does not need to be terminal.

This distinction is fundamental:

```text
exact key → terminal required
prefix → path required
```

## 11. Insert

Insertion walks the key and creates missing nodes. After processing the final symbol, mark the final node terminal and optionally store a value.

## 12. Delete

Deletion has two conceptual parts:

1. unmark the terminal node;
2. remove nodes that are no longer needed.

Structural cleanup must stop when a node is still required by another key.

## 13. Complexity Model

Let `L` be key length.

For a standard trie with constant-time child selection:

```text
insert  → O(L)
search  → O(L)
delete  → O(L)
prefix  → O(P)
```

where `P` is prefix length.

Enumeration after a prefix additionally depends on the size of the matching subtree.

## 14. Alphabet Matters

The complexity above assumes child lookup is appropriate for the representation.

Possible choices:

| Representation | Typical Trade-off |
|---|---|
| Array | fast access, potentially high memory |
| Object | convenient, key semantics need care |
| Map | flexible, potentially more overhead |
| Sorted children | compact, lookup may cost more |

## 15. Space Complexity

A trie can use one node per distinct prefix. Its space is approximately proportional to the number of stored prefix states plus child metadata.

Worst-case node count is related to the total number of symbols inserted.

## 16. Shared Prefixes vs Memory

Prefix sharing can save memory when many keys share prefixes. However, a trie can consume substantial memory when keys have little shared structure, especially with large per-node child containers.

## 17. Dense vs Sparse Children

A dense alphabet can justify an array of child references. A sparse alphabet generally benefits from a map-like representation.

The correct choice depends on:

```text
alphabet size
branching factor
key distribution
memory budget
lookup cost
cache behavior
```

## 18. Character Semantics

For strings, decide what a “symbol” means:

- UTF-16 code unit;
- Unicode code point;
- grapheme cluster;
- normalized token;
- byte.

JavaScript strings require deliberate Unicode handling when user-visible text is involved.

## 19. Normalization

Keys may need canonicalization before insertion/search:

```text
case folding
Unicode normalization
whitespace policy
punctuation policy
locale-specific rules
```

Normalization must be consistent between writes and reads.

## 20. Values at Terminal Nodes

A trie can store metadata at terminal nodes, such as:

```text
word frequency
record ID
ranking score
payload
category
permissions
```

This turns the trie into an index rather than only a membership structure.

## 21. Duplicate Inserts

Define the contract explicitly. An insertion may:

- replace an existing value;
- preserve the first value;
- increment frequency;
- reject duplicates.

## 22. Empty String

If empty strings are valid keys, the root itself must be able to represent a terminal key.

This is a common edge case.

## 23. Iterative Traversal

Trie operations are naturally iterative because a key is processed sequentially. Iteration also avoids unnecessary call-stack growth for long keys.

## 24. Recursive Traversal

Recursive traversal becomes useful when enumerating a subtree, collecting descendants, or performing transformations. Its depth is related to the maximum key length.

## 25. Trie Invariants

A valid basic trie should satisfy:

1. root exists;
2. every child is reachable from its parent;
3. every edge corresponds to the intended symbol representation;
4. terminal state accurately represents complete keys;
5. no invalid child references exist.

## 26. Correctness of Search

Search is correct because each consumed symbol corresponds to exactly one transition under the chosen child representation. If a transition is missing, the key cannot exist in the trie. If all transitions exist, terminal state distinguishes a stored key from merely a stored prefix.

## 27. Correctness of Insert

Insertion preserves existing paths and creates exactly the missing suffix path. Marking the final node terminal makes the inserted sequence represent a complete key without invalidating other keys sharing its prefixes.

## 28. Correctness of Delete

Deleting a key must not remove a node that is part of another stored key. Therefore cleanup is safe only when the node is non-terminal and has no children.

## 29. Common Mistakes

- treating a prefix as a complete key;
- forgetting terminal state;
- deleting shared prefixes;
- allocating dense child arrays without measuring memory;
- inconsistent normalization;
- using object keys without understanding property semantics;
- ignoring Unicode behavior;
- claiming trie space is always smaller than a hash table.

## 30. Backend Applications

Tries are useful for:

- URL/path routing;
- command lookup;
- prefix-based configuration;
- permission namespaces;
- autocomplete APIs;
- dictionary services;
- hierarchical key lookup.

## 31. AI / NLP Applications

Tries can support:

- vocabulary lookup;
- token prefix exploration;
- autocomplete;
- lexicon indexing;
- constrained decoding dictionaries;
- entity dictionaries;
- candidate generation.

A trie does not replace an embedding index; it solves a different retrieval problem based on symbolic prefixes.

## 32. Interview Reasoning

When asked about a trie, immediately identify:

```text
What is the alphabet?
What is the average key length?
How many keys?
How much prefix sharing?
Exact lookup or prefix lookup?
Need enumeration?
Need ranking?
Need deletion?
Memory constraint?
```

## 33. Trie vs Hash Table

| Requirement | Trie | Hash Table |
|---|---|---|
| exact lookup | strong | strong |
| prefix lookup | natural | not natural |
| ordered traversal | structural | not inherent |
| predictable by key length | natural | depends on hashing |
| memory overhead | can be high | often lower |
| shared prefixes | yes | no |

## 34. Trie vs Sorted Array

A sorted array can support binary search and prefix ranges, often with excellent locality. A trie provides direct character-by-character navigation and natural prefix traversal.

The workload determines the better representation.

## 35. Trie vs Radix Tree

A standard trie can contain many one-child nodes. A radix tree compresses chains of nodes into longer edge labels. Radix trees are introduced later in Phase 13.

## 36. Testing Strategy

Test:

- empty trie;
- one key;
- shared prefixes;
- one key being a prefix of another;
- duplicate inserts;
- delete missing key;
- delete prefix key;
- delete longer key;
- empty string;
- Unicode;
- normalization;
- large key lengths.

## 37. Benchmarking

Measure separately:

```text
insert throughput
exact-search latency
prefix-search latency
enumeration cost
memory per key
allocation count
```

Do not benchmark only average runtime. Include realistic key distributions.

## 38. Backend Design Exercise

Design a prefix-routing service where routes such as:

```text
/api
/api/users
/api/users/:id
/api/orders
```

must be indexed for prefix-aware lookup.

Define the key normalization, terminal metadata, conflict semantics, and complexity.

## 39. AI Design Exercise

Design an autocomplete dictionary storing:

```text
term
frequency
metadata
```

The structure should find the prefix node and enumerate or rank descendants.

## 40. Complexity Ledger

For every implementation record:

```text
L = key length
P = prefix length
N = number of keys
S = total stored symbols/nodes
B = branching factor
```

Then derive time and memory costs using those parameters.

## 41. Production Engineering

A production trie should consider:

- memory fragmentation;
- object allocation;
- cache locality;
- serialization;
- persistence;
- concurrency;
- snapshotting;
- versioning;
- input validation;
- normalization;
- observability.

## 42. Revision Checklist

- [ ] I can explain why a trie exists.
- [ ] I can draw a trie from a set of keys.
- [ ] I can distinguish a prefix from a complete key.
- [ ] I can implement insert/search/delete.
- [ ] I understand terminal nodes.
- [ ] I can derive O(L) operation costs.
- [ ] I can reason about dense vs sparse children.
- [ ] I understand the memory trade-offs.
- [ ] I can compare trie, hash table, and sorted array.
- [ ] I can explain backend and AI applications.

## Key Takeaways

1. **A trie makes prefix structure explicit.**
2. **The fundamental state is a path plus terminal metadata.**
3. **Exact lookup depends on both path existence and terminal state.**
4. **Trie performance is strongly tied to key length and child representation.**
5. **Memory representation is often the central engineering trade-off.**
