# 13.05 — Trie Traversal & Enumeration

## Objective

Learn how to traverse a trie systematically and enumerate complete keys or values from the whole structure or from a selected prefix. The focus is on traversal state, output ordering, complexity, memory, and production-scale enumeration.

## 1. Why Traversal Matters

Insert and search follow one key path. Enumeration must explore a subtree and therefore introduces branching, traversal order, output cost, and potentially large result sets.

## 2. Traversal Model

A trie is a rooted tree. Standard tree traversal ideas apply:

```text
DFS
BFS
iterative DFS
recursive DFS
```

The symbol stored on each edge reconstructs the key represented by a node.

## 3. Prefix Traversal

A prefix query has two stages:

```text
root → prefix node
prefix node → enumerate descendants
```

Separating these stages makes complexity easier to reason about.

## 4. DFS Enumeration

Depth-first traversal is the natural default when collecting all keys beneath a prefix.

Conceptually:

```text
visit(node, prefix)
  if terminal → emit(prefix)
  for child:
      visit(child, prefix + symbol)
```

## 5. BFS Enumeration

Breadth-first traversal processes shallower prefixes before deeper prefixes. It may be useful when shorter matches should be considered first.

## 6. Lexicographic Order

If children are traversed in sorted symbol order, DFS can emit keys in lexicographic order.

The ordering guarantee depends on the child representation and comparator.

## 7. Unordered Enumeration

If child iteration order is unspecified, the trie still returns the correct set of keys but not necessarily deterministic ordering.

Do not accidentally promise sorted output.

## 8. Terminal Nodes During Traversal

A node can be both terminal and an internal node.

For:

```text
car
card
```

the `car` node must be emitted before or after descendants according to the chosen traversal contract.

## 9. Preorder vs Postorder

For trie enumeration:

```text
preorder → emit terminal before children
postorder → emit children before terminal
```

Either is valid if explicitly specified.

## 10. Recursive DFS

Recursive traversal is simple and expressive. Auxiliary stack depth is proportional to the maximum key length.

Very deep keys may exceed practical JavaScript call-stack limits.

## 11. Iterative DFS

Use an explicit stack to avoid call-stack limitations:

```text
stack = [{ node, prefix }]
while stack not empty:
    state = pop()
    process state
    push children
```

## 12. Prefix Reconstruction

There are several strategies:

- carry the complete prefix string;
- carry a mutable character buffer;
- carry parent pointers and reconstruct at terminals;
- store compact path information.

Each has different allocation behavior.

## 13. String Allocation Cost

Repeatedly creating `prefix + symbol` can allocate many intermediate strings. For large enumerations, use a mutable path buffer where practical.

## 14. Parent Pointers

Parent pointers can allow path reconstruction but increase node memory and complicate mutation semantics.

## 15. Output-Sensitive Complexity

Let `P` be prefix length and `R` the number of visited nodes. Enumeration is at least proportional to the work required to visit those nodes and produce the requested output.

If `K` complete keys are returned and their total output length is `T`, output construction itself costs at least `Ω(T)` under ordinary materialized-output models.

## 16. Count-Only Queries

If the caller only needs the number of matching keys, do not materialize every key. Traverse the subtree while accumulating a count.

## 17. Exists-Under-Prefix

If the goal is only to know whether a prefix has any stored descendant key, stop at the first terminal descendant.

This can be much cheaper than full enumeration.

## 18. Early Termination

Enumeration APIs should support limits when appropriate:

```text
prefix
limit
cursor
```

A limit prevents unnecessary work and memory use.

## 19. Pagination

Large prefix result sets should generally be paginated rather than returned as one massive array.

A cursor must encode enough traversal state to resume deterministically if deterministic pagination is required.

## 20. Stable Pagination

Concurrent mutations complicate pagination. Snapshot-based or versioned traversal can provide stronger consistency than traversing a live mutable trie.

## 21. BFS Memory

BFS can require memory proportional to the width of the explored frontier. Wide tries can make this much larger than DFS's depth-oriented stack.

## 22. DFS Memory

DFS auxiliary traversal state is typically related to tree depth plus child-iteration state. Output storage may dominate total memory when many results are materialized.

## 23. Generator-Based Enumeration

JavaScript generators can expose results lazily:

```text
for (const key of trie.enumerate(prefix)) {
    ...
}
```

This avoids materializing all results up front.

## 24. Lazy vs Eager APIs

| Strategy | Benefit | Cost |
|---|---|---|
| eager array | simple consumer API | high peak memory |
| generator | streaming | more complex lifecycle |
| callback | controlled output | callback semantics |
| paginated | bounded responses | cursor complexity |

## 25. Ranking During Enumeration

Autocomplete systems may need ranked descendants rather than arbitrary traversal order. A trie traversal can generate candidates, while a heap or cached metadata can perform ranking.

Do not confuse structural traversal order with relevance ranking.

## 26. Cached Top-K Metadata

A prefix node can store a bounded set of high-ranking descendants. This can make repeated top-K prefix queries faster at the cost of update complexity and stale metadata management.

## 27. Traversal With Values

Terminal nodes may emit:

```text
key
value
frequency
recordId
metadata
```

Define the result contract before implementation.

## 28. Duplicate Logical Keys

A trie normally represents a key once. If duplicate occurrences are meaningful, terminal metadata must represent the multiplicity or a separate collection.

## 29. Filtering

Traversal can apply filters such as:

```text
active
category
permission
score threshold
locale
```

But expensive filters can dominate traversal cost. Measure the complete workload.

## 30. Access Control

Backend enumeration must not leak keys that the caller is not authorized to see. Filtering after retrieving sensitive descendants may still expose information through timing or counts.

## 31. Snapshot Semantics

For consistent large scans, use a stable version or immutable snapshot when the application requires repeatable traversal.

## 32. Mutation During Traversal

Mutating a trie while traversing it can invalidate iterator assumptions. Define whether concurrent modifications are:

- prohibited;
- weakly consistent;
- fail-fast;
- snapshot-based.

## 33. Cycle Safety

A normal trie is acyclic. If implementation corruption introduces cycles, naive traversal can loop forever. Debug validators should detect impossible cycles.

## 34. Correctness Invariant

During DFS, the carried prefix must equal the path from the root to the current node.

This invariant is the foundation of correct key reconstruction.

## 35. Correctness of Enumeration

Every emitted key must correspond to a reachable terminal node, and every terminal node in the selected subtree must eventually be visited unless early termination or filtering intentionally excludes it.

## 36. Lexicographic Proof

If children are visited in increasing symbol order and DFS emits terminal nodes before descendants, then keys are emitted in lexicographic order under the same symbol ordering.

## 37. Common Mistakes

- forgetting terminal nodes with children;
- assuming child order is sorted;
- materializing huge result sets unnecessarily;
- losing the prefix during traversal;
- using recursion for unbounded key lengths;
- mutating the structure without defining iterator semantics;
- claiming enumeration is `O(P)` regardless of result size.

## 38. Backend Applications

Traversal powers:

- autocomplete results;
- route discovery;
- namespace listing;
- configuration key exploration;
- dictionary APIs;
- permission namespace inspection.

## 39. AI Applications

Traversal can generate:

- lexical candidates;
- constrained token candidates;
- entity dictionary matches;
- prefix completion candidates;
- vocabulary subsets.

## 40. Benchmarking

Measure:

- nodes visited;
- keys emitted;
- total output bytes;
- allocations;
- p50/p95/p99 latency;
- peak traversal memory.

Compare DFS, BFS, generators, and cached top-K approaches under realistic distributions.

## 41. Production Design Exercise

Design a paginated autocomplete endpoint:

```text
GET /suggest?q=dev&limit=20&cursor=...
```

Specify traversal order, cursor state, consistency semantics, authorization, and memory limits.

## 42. Interview Framework

When asked to enumerate trie matches:

```text
1. locate prefix node
2. choose traversal
3. define ordering
4. preserve path state
5. define terminal handling
6. make output cost explicit
7. consider limit/pagination
8. derive complexity
```

## Revision Checklist

- [ ] I can perform DFS enumeration.
- [ ] I can perform BFS enumeration.
- [ ] I understand lexicographic traversal.
- [ ] I can reconstruct keys correctly.
- [ ] I understand output-sensitive complexity.
- [ ] I can implement lazy enumeration.
- [ ] I understand pagination and snapshot semantics.
- [ ] I can reason about mutation during traversal.
- [ ] I can separate traversal order from ranking.
- [ ] I can design a production autocomplete enumeration API.

## Key Takeaways

1. **Trie enumeration is tree traversal plus path reconstruction.**
2. **Prefix lookup and descendant enumeration are separate complexity components.**
3. **Enumeration is inherently output-sensitive.**
4. **Traversal order is a representation and contract decision, not an automatic property.**
5. **Production enumeration requires bounded output, pagination, consistency, memory control, and authorization semantics.**
