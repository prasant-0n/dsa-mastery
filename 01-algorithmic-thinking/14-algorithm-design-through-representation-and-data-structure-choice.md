# 01.14 — Algorithm Design Through Representation & Data-Structure Choice

> Many algorithm improvements begin before the algorithm: choose a representation that makes the required operation cheap.

## Learning Objectives

By the end of this chapter, you should be able to:

- Explain why representation is part of algorithm design.
- Map required operations to appropriate data structures.
- Analyze access, search, insertion, deletion, ordering, and aggregation needs.
- Recognize when arrays, sets, maps, linked structures, heaps, trees, or graphs fit a problem.
- Understand how representation changes complexity.
- Separate logical data from physical representation.
- Recognize representation transforms as optimization techniques.
- Analyze time-space and build-query trade-offs.
- Apply representation thinking to backend and AI systems.

---

## 1. The Algorithm Often Starts With Representation

A common beginner workflow is:

```text
Read problem
↓
Write loops
↓
Try to optimize
```

An expert workflow is closer to:

```text
Understand required operations
↓
Choose representation
↓
Identify invariant
↓
Choose algorithm
↓
Optimize bottleneck
```

The same logical data can be represented in multiple ways.

Different representations expose different operations efficiently.

---

## 2. Logical Data vs Representation

Suppose the requirement is:

> Store user IDs and repeatedly determine whether an ID exists.

Logically, this is a collection of IDs.

Possible representations:

```text
Array
Set
Object
Map
Database index
Bloom filter + authoritative store
```

The logical requirement is the same.

The operational behavior is not.

Representation determines what information is immediately available to the algorithm.

---

## 3. Start With Required Operations

Before choosing a data structure, list the operations.

For example:

```text
read by index
search by value
insert at end
delete by key
count frequency
find minimum
find maximum
get highest priority
iterate in sorted order
check membership
```

Then ask:

> Which representation makes the dominant operation cheap?

Never choose a data structure merely because it is familiar.

---

## 4. Operation Frequency Matters

Suppose a system performs:

```text
1 write
1,000,000 reads
```

A read-optimized representation may be worthwhile.

But if it performs:

```text
1,000,000 writes
1 read
```

the trade-off changes.

Algorithm engineering is often:

```text
cost per operation × operation frequency
```

rather than simply memorizing individual Big-O values.

---

## 5. Arrays: Contiguous Indexed Representation

An array gives direct indexed access.

```js
const values = [10, 20, 30, 40];
values[2]; // 30
```

Conceptually:

```text
index → location
```

Typical strengths:

- O(1) indexed access,
- compact representation,
- efficient iteration,
- good locality in many implementations,
- natural fit for sequences.

Typical weaknesses:

- insertion/deletion in the middle can require shifting,
- searching by arbitrary value is usually O(n) without additional structure.

---

## 6. Arrays Are Often the Default Starting Point

Arrays are powerful because many problems are fundamentally about sequences.

They support patterns such as:

- two pointers,
- sliding window,
- prefix sums,
- binary search on sorted data,
- sorting + scanning,
- dynamic programming tables.

But “use an array” should not become a reflex.

Ask whether the required operation is actually indexed sequence access.

---

## 7. Set: Membership-Oriented Representation

If the dominant operation is:

```text
Does x exist?
```

an array may be the wrong representation.

A `Set` expresses the requirement directly:

```js
const seen = new Set();
seen.add(42);
seen.has(42);
```

Expected membership is typically O(1) under normal hash-table assumptions.

The important idea is not the syntax.

It is the representation:

```text
value → membership state
```

---

## 8. Map: Key-to-Value Representation

If the requirement is:

```text
key → associated information
```

use a map-like representation.

```js
const scores = new Map();
scores.set("alice", 95);
scores.get("alice");
```

Typical uses:

- lookup tables,
- frequency counting,
- grouping,
- memoization,
- ID → entity mapping,
- cache indexes.

The representation directly encodes the relationship.

---

## 9. Frequency Maps

Consider counting values.

Naive representation:

```text
For every value:
    scan previous values
```

A frequency map transforms the problem:

```text
value → count
```

Then each update is expected O(1), giving O(n) expected total time for n items.

This is an example of:

> changing representation to eliminate repeated searching.

---

## 10. Object vs Map in JavaScript

JavaScript objects can also represent key-value relationships:

```js
const counts = Object.create(null);
counts["apple"] = 3;
```

`Map` provides explicit map semantics and supports arbitrary key types.

Choose based on requirements rather than habit.

For algorithmic exercises, `Map` and `Set` often communicate intent more clearly.

---

## 11. Linked Lists: Representation for Local Structural Updates

A linked list represents a sequence through nodes and references.

```text
[node] → [node] → [node]
```

A node contains:

```text
value
next reference
```

Its strength is not fast random access.

Its strength is that, once a node/location is known, structural updates can be cheap.

This distinction is essential:

```text
finding location
≠
updating structure
```

---

## 12. Linked List Complexity Is Often Misunderstood

People memorize:

```text
linked-list insertion = O(1)
```

That is incomplete.

Insertion is O(1) **when the required position/node is already known**.

If you must first traverse n nodes to find the position:

```text
find position → O(n)
insert → O(1)
total → O(n)
```

The data structure does not magically eliminate the cost of locating information.

---

## 13. Stack: Represent the Most-Recent State

A stack supports:

```text
push
pop
peek
```

with LIFO semantics.

Use it when the newest unresolved state must be handled first.

Examples:

- function-call reasoning,
- expression parsing,
- undo operations,
- DFS,
- monotonic-stack problems,
- bracket matching.

The representation encodes the ordering rule.

---

## 14. Queue: Represent Arrival Order

A queue supports FIFO behavior.

Typical uses:

- BFS,
- task processing,
- request buffering,
- message processing,
- producer-consumer systems.

The representation captures:

```text
first in → first out
```

A queue is not merely an array with two indexes.

It is an abstraction expressing a state-transition policy.

---

## 15. Deque: Two-Sided Operations

A deque supports insertion and removal from both ends.

It is useful when an algorithm needs to maintain a moving boundary from either direction.

Examples:

- sliding-window maximum,
- monotonic deque,
- 0-1 BFS,
- task scheduling policies.

The correct representation can eliminate expensive shifting.

---

## 16. Heap: Represent Priority

Suppose you repeatedly need:

```text
smallest item
```

or:

```text
largest item
```

Sorting the entire collection after every insertion may be wasteful.

A heap represents partial ordering sufficient for priority access.

Typical operations:

```text
peek → O(1)
push → O(log n)
pop → O(log n)
```

The key insight:

> You do not always need the entire data sorted. You may only need the best next item.

---

## 17. Heap vs Fully Sorted Array

Suppose you receive n items and repeatedly need the minimum.

A fully sorted representation gives:

```text
minimum → O(1)
```

but maintaining sorted order during arbitrary insertions can be expensive.

A heap stores less ordering information:

```text
parent has required priority relative to children
```

This weaker invariant makes updates efficient.

Representation is therefore a balance between:

```text
amount of maintained information
vs
cost of operations
```

---

## 18. Tree: Represent Hierarchical Relationships

If the data has parent-child relationships:

```text
root
├── child
│   ├── grandchild
│   └── grandchild
└── child
```

an array may still store it, but a tree representation makes the structure explicit.

Trees naturally support reasoning about:

- hierarchy,
- recursive decomposition,
- search paths,
- ordered structure,
- directory systems,
- syntax trees.

---

## 19. Binary Search Tree Representation

A binary search tree adds an ordering invariant:

```text
left subtree < node < right subtree
```

If balanced, search/insert/delete can be O(log n).

If badly skewed:

```text
O(n)
```

The representation alone is insufficient.

The maintained invariant and shape matter.

---

## 20. Hash Table vs Tree

Suppose you need key lookup.

A hash table typically provides expected O(1) lookup.

A balanced search tree typically provides O(log n) lookup.

Why might you choose the tree?

Because it can maintain ordering and support operations such as:

- predecessor,
- successor,
- range queries,
- ordered iteration.

Hashing trades away natural ordering for expected constant-time lookup.

---

## 21. Representation Must Match the Query

Consider:

```text
Find all users with age between 20 and 30.
```

A hash index on exact age may not be ideal for the range operation.

An ordered representation can support range navigation more naturally.

Therefore ask:

```text
What queries dominate?
```

not:

```text
Which data structure is theoretically fastest?
```

There is no universally fastest data structure.

---

## 22. Graph Representation

A graph can be represented using:

### Adjacency matrix

```text
matrix[u][v]
```

Useful when:

- the graph is dense,
- direct edge existence checks dominate,
- the vertex count is manageable.

### Adjacency list

```text
u → [v1, v2, v3]
```

Useful when:

- the graph is sparse,
- traversal of neighbors dominates.

Representation changes both memory and traversal cost.

---

## 23. Sparse vs Dense Representation

For V vertices:

Adjacency matrix uses approximately:

```text
O(V²)
```

space.

Adjacency list uses approximately:

```text
O(V + E)
```

space.

If:

```text
E << V²
```

an adjacency list is generally much more space-efficient.

This is a direct example of choosing representation from input structure.

---

## 24. Trie: Represent Prefix Structure

A trie represents strings through shared prefixes.

```text
c
└── a
    └── t
```

Words such as:

```text
cat
car
can
```

share:

```text
ca
```

A trie is useful for:

- autocomplete,
- prefix search,
- dictionary matching,
- routing-like prefix structures.

The representation stores shared structure explicitly.

---

## 25. Prefix Sums: Transform the Representation

Suppose you repeatedly need range sums.

Original representation:

```text
[a0, a1, a2, ...]
```

Transform it into:

```text
prefix[i] = sum of values before i
```

Then a range sum can be computed from two prefix values.

The original problem has not changed.

The representation has.

This is a representation transform.

---

## 26. Difference Arrays: Encode Changes Instead of Values

Suppose many range updates are required.

Instead of repeatedly modifying every element, represent boundary changes:

```text
start += delta
end + 1 -= delta
```

After all updates, reconstruct the final values using a prefix accumulation.

This is a powerful general principle:

> Sometimes represent the operations/changes rather than the final state.

---

## 27. Coordinate Compression

Suppose values are huge:

```text
10^12
10^15
10^18
```

but only relative ordering matters.

Map them to ranks:

```text
smallest → 0
next → 1
...
```

Now a huge value domain becomes a compact index domain.

This enables array-based structures where direct addressing was previously impossible.

---

## 28. Sorting as a Representation Transform

Sorting is not only an algorithm for producing sorted output.

It can transform data into a representation where other operations become easier.

Examples:

```text
sort
↓
remove duplicates with one scan
```

```text
sort
↓
two-pointer processing
```

```text
sort
↓
binary search
```

```text
sort
↓
interval merging
```

The cost of sorting can be justified by the operations it enables afterward.

---

## 29. Preprocessing as Stored Information

Preprocessing converts raw input into a richer representation.

Examples:

```text
array → prefix sums
array → sorted array
records → hash index
strings → trie
vectors → ANN index
```

The pattern is:

```text
build structure once
↓
answer repeated operations cheaply
```

This is one of the most important ideas in backend engineering.

---

## 30. Time-Space Trade-Off

A richer representation usually costs memory.

For example:

```text
raw data
```

may require little additional memory but repeated scans.

An index requires:

```text
extra memory
```

but can reduce query time.

Therefore:

```text
memory ↔ computation
```

is a fundamental trade-off.

---

## 31. Build Cost vs Query Cost

For Q queries:

```text
total cost
=
build cost
+
Q × query cost
```

Suppose:

```text
scan query = O(n)
indexed query = expected O(1)
index build = O(n)
```

Then repeated queries can justify the index quickly.

But if Q = 1, the index may provide little benefit.

Always analyze the whole workload.

---

## 32. Representation and Invariants

A representation is powerful when it makes an invariant easy to maintain.

Examples:

### Heap

```text
parent maintains priority relationship
```

### BST

```text
left < node < right
```

### Hash table

```text
key maps to its designated bucket/probe structure
```

### Prefix sum

```text
prefix[i] represents a known aggregate of a defined range
```

### Sliding window

```text
window always satisfies the required condition
```

The representation and invariant work together.

---

## 33. Representation Can Remove a Loop

Suppose a naive algorithm repeatedly asks:

```text
Have I seen x before?
```

With an array, that may require scanning.

With a Set:

```js
seen.has(x)
```

The important improvement is not “Set is faster.”

It is:

```text
replace repeated search
with direct membership representation
```

That is algorithmic reasoning.

---

## 34. Representation Can Remove Repeated Computation

Suppose many queries need:

```text
sum(l, r)
```

Naively:

```text
loop from l to r
```

Repeated queries repeat work.

Prefix sums store the required aggregate information ahead of time.

This turns:

```text
recompute
```

into:

```text
lookup + combine
```

---

## 35. Representation Can Reduce Search Space

A heap does not store every pairwise ordering.

It stores enough ordering to identify the next priority element efficiently.

A trie stores shared prefixes.

A sorted array stores global ordering.

A hash table stores key-location relationships.

Each representation changes the search space available to the algorithm.

---

## 36. Choosing a Representation: Decision Framework

Use this process:

```text
1. What operations are required?
2. Which operation dominates?
3. How frequently does each operation occur?
4. What are n, Q, and memory limits?
5. Is ordering required?
6. Is random access required?
7. Is membership required?
8. Is priority required?
9. Is hierarchy required?
10. Is prefix/range structure required?
11. Can preprocessing be afforded?
12. Is the data static or frequently changing?
13. What consistency guarantees are required?
14. What representation makes the invariant simplest?
15. What are the production costs: memory, GC, cache, I/O, network?
```

---

## 37. Static vs Dynamic Data

Representation choice depends heavily on mutability.

### Mostly static

You can afford expensive preprocessing:

```text
sort
index
compress
build search structure
```

### Highly dynamic

You need efficient updates:

```text
insert
update
delete
```

A representation that makes reads cheap but writes extremely expensive may be inappropriate.

---

## 38. Batch vs Online Processing

### Batch

You can see the entire dataset before answering.

This allows:

- sorting,
- aggregation,
- compression,
- offline indexing.

### Online

Items arrive continuously.

You may need:

- streaming structures,
- bounded memory,
- incremental updates,
- approximate summaries.

Representation must match when information becomes available.

---

## 39. Backend Application: Cache Design

A cache may need:

```text
key → value
```

plus:

```text
recency
expiration
capacity
```

A simple Map may provide lookup but not all eviction semantics.

An LRU cache commonly combines structures such as:

```text
Map + doubly linked list
```

The Map gives fast key lookup.

The linked list maintains recency order.

This is a canonical example of **combining representations** to satisfy multiple operation requirements.

---

## 40. Backend Application: Rate Limiting

A rate limiter may need:

```text
identity → request state
```

plus time-window information.

Possible representations include:

- hash maps,
- queues,
- deques,
- sorted timestamps,
- counters,
- token-bucket state.

The correct structure depends on the policy:

```text
fixed window
sliding window
leaky bucket
token bucket
```

The policy determines the state that must be represented.

---

## 41. Backend Application: Job Scheduling

If jobs have priorities, a FIFO queue is insufficient.

A priority queue represents:

```text
next job = highest-priority eligible job
```

If jobs also have deadlines, the representation may need deadline ordering or multiple queues.

Again:

```text
requirements → operations → representation
```

---

## 42. Backend Application: Deduplication

For exact duplicate detection in a batch:

```text
Set
```

is a natural representation.

For large streams where false positives are acceptable:

```text
Bloom filter
```

can reduce memory.

This is a direct example of:

```text
exactness requirement
↓
representation choice
↓
memory/performance trade-off
```

---

## 43. AI Application: Vector Search

A vector corpus can be represented as:

```text
raw vectors
```

or transformed into an index.

Possible structures include:

- graph-based indexes,
- tree-based indexes,
- hash-based indexes,
- quantized/vector-compressed structures.

The choice depends on:

- dimension,
- corpus size,
- update frequency,
- recall target,
- latency target,
- memory budget.

The representation is part of the retrieval algorithm.

---

## 44. AI Application: Top-K Retrieval

Suppose a model produces millions of candidate scores but only the best K are needed.

Fully sorting all candidates stores more ordering information than necessary.

A heap can maintain only the current top K.

Typical pattern:

```text
scan candidates
↓
maintain size-K heap
↓
retain only candidates that can enter Top-K
```

This is representation matched to the output requirement.

---

## 45. AI Application: RAG Retrieval Pipeline

A retrieval pipeline may transform:

```text
documents
↓
chunks
↓
embeddings
↓
vector index
↓
candidates
↓
reranking structure
↓
final context
```

Each stage creates a representation optimized for the next operation.

This is why algorithmic thinking matters in AI engineering:

> AI systems are pipelines of representations, transformations, and constrained searches.

---

## 46. Common Mistakes

### Mistake 1 — Choosing the familiar structure

Familiarity is not a complexity argument.

### Mistake 2 — Looking only at one operation

A structure can optimize lookup while making updates expensive.

### Mistake 3 — Ignoring workload frequency

One expensive build may be worthwhile for millions of queries.

### Mistake 4 — Ignoring memory

Faster structures often store additional information.

### Mistake 5 — Confusing location cost with update cost

Linked-list insertion is only cheap once the insertion point is known.

### Mistake 6 — Assuming O(1) means universally fast

Expected O(1) hashing still has constants, collisions, allocations, and memory effects.

### Mistake 7 — Ignoring data distribution

Sparse and dense graphs require different representations.

### Mistake 8 — Ignoring mutability

A structure ideal for static data may be poor for heavily updated data.

### Mistake 9 — Over-indexing

Every index has storage and maintenance costs.

### Mistake 10 — Optimizing before identifying the dominant operation

Representation choice should follow workload analysis.

---

## 47. Representation Selection Matrix

| Requirement | Natural Representation |
|---|---|
| Indexed sequence access | Array |
| Membership | Set / hash structure |
| Key → value | Map / hash table |
| LIFO | Stack |
| FIFO | Queue |
| Both-end operations | Deque |
| Repeated min/max priority | Heap |
| Hierarchy | Tree |
| Ordered lookup/range | Balanced tree / sorted structure |
| Prefix queries | Trie |
| Sparse graph traversal | Adjacency list |
| Dense graph edge lookup | Adjacency matrix |
| Range aggregates | Prefix sums / segment structures |
| Range updates | Difference array / lazy structures |
| Compact numeric domain | Coordinate compression |
| Exact duplicate detection | Set |
| Memory-efficient approximate membership | Bloom filter |
| Top-K | Heap |

This table is a starting point, not a substitute for workload analysis.

---

## 48. Expert-Level Principle

Do not ask:

> “Which data structure is fastest?”

Ask:

> “What information must my algorithm access repeatedly, and what representation makes that information cheap to obtain while satisfying the workload's constraints?”

That question leads naturally to advanced data structures and system design.

---

## 49. Final Algorithmic Workflow

```text
Problem
  ↓
Extract required operations
  ↓
Estimate operation frequency
  ↓
Analyze constraints
  ↓
Identify repeated work
  ↓
Choose representation
  ↓
Define invariant
  ↓
Choose algorithm
  ↓
Analyze time + space
  ↓
Evaluate workload trade-offs
  ↓
Consider backend/AI production constraints
```

This workflow should become automatic.

---

## 50. Key Takeaways

1. Representation is part of algorithm design.
2. Data structures exist to make specific operations efficient.
3. Choose structures from required operations, not familiarity.
4. Operation frequency matters.
5. Arrays optimize indexed sequence access.
6. Sets optimize membership under hashing assumptions.
7. Maps encode key-to-value relationships.
8. Heaps maintain enough ordering for efficient priority access.
9. Trees encode hierarchy and ordered relationships.
10. Tries encode prefix structure.
11. Graph representation must match graph density and operations.
12. Prefix sums and difference arrays are representation transforms.
13. Sorting can be useful as a preprocessing representation.
14. Coordinate compression changes a huge value domain into a compact rank domain.
15. Richer representations usually consume additional memory.
16. Build cost must be evaluated against future query savings.
17. Static and dynamic workloads favor different representations.
18. Backend systems frequently combine multiple data structures to satisfy competing operations.
19. AI retrieval systems are fundamentally representation-and-search pipelines.
20. Expert algorithm design begins by asking what information must be cheap to access.

---

## Revision Checklist

- [ ] Can I explain why representation is part of algorithm design?
- [ ] Can I list the dominant operations before choosing a data structure?
- [ ] Can I distinguish lookup cost from update cost?
- [ ] Can I explain when arrays are preferable?
- [ ] Can I explain Set vs Map?
- [ ] Can I explain why linked-list insertion is not automatically O(1)?
- [ ] Can I explain heap vs fully sorted representation?
- [ ] Can I choose adjacency list vs matrix from graph density?
- [ ] Can I explain why tries are useful for prefix queries?
- [ ] Can I derive prefix sums as a representation transform?
- [ ] Can I explain coordinate compression?
- [ ] Can I evaluate build cost vs query cost?
- [ ] Can I identify time-space trade-offs?
- [ ] Can I combine structures such as Map + linked list for LRU?
- [ ] Can I choose a representation for a rate limiter?
- [ ] Can I choose a representation for Top-K retrieval?
- [ ] Can I explain why vector indexes are representations, not magic algorithms?
- [ ] Can I reason about static vs dynamic workloads?
- [ ] Can I select a structure from constraints instead of memorization?
