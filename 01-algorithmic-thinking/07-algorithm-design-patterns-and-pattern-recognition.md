# 01.7 — Algorithm Design Patterns & Pattern Recognition

> Pattern recognition is not memorizing that a problem “looks like Two Sum.” It is recognizing the computational structure that makes a particular technique valid.

## Learning Objectives

By the end of this chapter, you should be able to:

- Understand what an algorithmic pattern actually represents.
- Separate problem story from computational structure.
- Recognize when to use common patterns.
- Derive patterns from constraints, operations, and invariants.
- Distinguish similar-looking patterns that require different assumptions.
- Build a reusable pattern-selection decision process.
- Avoid forcing a familiar pattern onto an unsuitable problem.
- Connect patterns to backend and AI engineering.

---

## 1. What Is an Algorithmic Pattern?

An algorithmic pattern is a reusable way of organizing computation around a recurring structural property.

A pattern usually specifies:

```text
State representation
      +
State transition
      +
Invariant
      +
Search / processing strategy
```

Examples:

- Two pointers maintain two positions and exploit ordering or directional structure.
- Sliding window maintains a contiguous region and updates its state incrementally.
- Hashing remembers information for fast lookup.
- Prefix sums transform repeated aggregation into constant-time queries after preprocessing.
- Binary search repeatedly eliminates part of an ordered search space.
- Divide and conquer recursively separates independent subproblems.

The pattern is the **reasoning structure**, not the code template.

---

## 2. Pattern Recognition Is Computational Modeling

Consider these problem statements:

```text
Find two numbers with a target sum.
Find duplicate IDs.
Find a user by ID.
Find whether an event was already processed.
```

The stories are different.

The underlying operation may be the same:

```text
membership / association lookup
```

That suggests a hash-based representation.

Similarly:

```text
Longest substring satisfying a constraint
Longest subarray satisfying a constraint
Process events within a time range
```

may share the structure:

```text
maintain a moving contiguous region
```

Pattern recognition therefore begins by removing the story and identifying the computation.

---

## 3. The Pattern Recognition Pipeline

Use this process:

```text
Read problem
    ↓
Extract input / output
    ↓
Identify required operations
    ↓
Read constraints
    ↓
Find repeated work
    ↓
Identify useful structure
    ↓
Choose state representation
    ↓
State invariant
    ↓
Select pattern
    ↓
Prove correctness
    ↓
Analyze complexity
```

This prevents “pattern guessing.”

---

## 4. Pattern Families

The major families you will encounter throughout DSA include:

```text
Traversal
├── Linear scan
├── Two pointers
├── Sliding window
└── Multi-pointer traversal

Lookup / State
├── Hashing
├── Frequency counting
├── Prefix / suffix state
└── Memoization

Search
├── Linear search
├── Binary search
├── Search on answer
└── Graph search

Ordering / Selection
├── Sorting
├── Heap / priority queue
├── Quickselect
└── Greedy selection

Recursion / Decomposition
├── Divide and conquer
├── Backtracking
└── Dynamic programming

Graph / Tree
├── DFS
├── BFS
├── Topological ordering
├── Shortest path
└── Connectivity

String / Specialized
├── Frequency / hashing
├── Prefix structures
├── Tries
├── Rolling hash
└── String matching
```

The later phases study these in depth. This chapter teaches you how to recognize them.

---

## 5. Pattern 1 — Linear Scan

### Clues

Use a linear scan when:

- every element may need inspection,
- no stronger ordering or indexing exists,
- only one/few passes are needed,
- state can be maintained incrementally.

Examples:

- maximum value,
- count values,
- find first match,
- compute sum,
- validate a sequence.

Typical complexity:

```text
Time: O(n)
Space: O(1)
```

### Mental model

```text
current element
      ↓
update state
      ↓
next element
```

A good linear scan often eliminates the need for a more complicated structure.

---

## 6. Pattern 2 — Two Pointers

### Clues

Look for:

- sorted sequence,
- pair relationships,
- opposite ends,
- partitioning,
- comparing symmetric positions,
- monotonic pointer movement.

Example structures:

```text
left →       ← right
```

or:

```text
slow →
fast →→
```

### Key question

> Can each pointer move permanently without losing a possible answer?

If you cannot prove that, do not use two pointers merely because the input is an array.

---

## 7. Pattern 3 — Sliding Window

### Clues

Look for:

- contiguous subarray/substring,
- longest/shortest valid range,
- fixed-size range,
- dynamic range,
- incremental state.

Mental model:

```text
[ left ........ right ]
```

Instead of recomputing every range, maintain the current window state.

### Critical question

> What property allows the window to move monotonically?

If adding/removing elements does not provide predictable state changes, a sliding window may not work.

---

## 8. Pattern 4 — Hashing / Frequency Map

### Clues

Look for:

- membership,
- duplicate detection,
- frequency counting,
- matching complements,
- grouping by key,
- association between values and metadata.

Typical transformations:

```text
Repeated search → stored lookup
```

Examples:

- Two Sum,
- anagram checks,
- duplicate detection,
- counting frequencies,
- grouping records.

### State question

Ask:

> What exactly should the Map/Set contain after processing each item?

That becomes the invariant.

---

## 9. Pattern 5 — Prefix / Suffix State

### Clues

Look for:

- repeated range queries,
- “before every index,”
- “after every index,”
- left/right aggregate information,
- cumulative properties.

Examples:

- prefix sum,
- prefix maximum,
- suffix maximum,
- product except self,
- range aggregation.

Mental model:

```text
raw sequence
     ↓
precomputed directional state
     ↓
cheap local query
```

---

## 10. Pattern 6 — Binary Search

### Clues

Look for:

- ordered search space,
- monotonic predicate,
- answer region with a false → true or true → false transition,
- ability to eliminate a large portion after one decision.

Important distinction:

> Binary search is fundamentally about **search-space elimination**, not merely sorted arrays.

It can sometimes search an answer space rather than an explicit array.

---

## 11. Pattern 7 — Sort + Scan

### Clues

Look for problems where ordering exposes useful relationships:

- duplicates become adjacent,
- intervals can be processed by endpoint order,
- closest values become neighbors,
- two-pointer movement becomes possible,
- greedy choices become easier to justify.

Mental model:

```text
unordered
   ↓
sort
   ↓
structure becomes visible
   ↓
scan
```

Always account for sorting cost and whether mutating/copying the input is acceptable.

---

## 12. Pattern 8 — Heap / Priority Queue

### Clues

Look for:

- repeatedly need minimum/maximum,
- scheduling by priority,
- Top-K,
- merge multiple sorted streams,
- continuously selecting the next best candidate.

Ask:

> Do I need a complete ordering, or only the next extreme candidate?

If only the extreme matters, a heap may be more appropriate than full sorting.

---

## 13. Pattern 9 — Recursion / Divide and Conquer

### Clues

Look for:

- naturally hierarchical data,
- self-similar structure,
- independent smaller subproblems,
- recursively defined problems.

Divide and conquer:

```text
problem
├── subproblem
├── subproblem
└── combine
```

Examples:

- merge sort,
- tree algorithms,
- recursive partitioning.

The key question is:

> Can the smaller problems be solved independently and combined efficiently?

---

## 14. Pattern 10 — Memoization / Dynamic Programming

### Clues

Look for:

- overlapping subproblems,
- repeated recursive states,
- optimization over choices,
- state transitions,
- “best answer up to state X.”

Mental model:

```text
state
 ↓
smaller states
 ↓
reuse already solved states
```

The central question is:

> What is the smallest state that completely describes the remaining problem?

That question becomes increasingly important in Phase 17.

---

## 15. Pattern 11 — Backtracking

### Clues

Look for:

- generate all valid configurations,
- permutations/combinations,
- constraint satisfaction,
- choose → explore → undo,
- search tree with invalid branches.

Mental model:

```text
choose
  ↓
explore
  ↓
undo
  ↓
next choice
```

Optimization often comes from pruning branches that cannot lead to valid solutions.

---

## 16. Pattern 12 — Greedy

### Clues

Look for problems where a locally optimal decision may be provably extended to a globally optimal solution.

The danger:

```text
local best ≠ always global best
```

Therefore greedy recognition must be followed by a proof of the greedy-choice property.

Never use greedy merely because the problem “asks for the maximum/minimum.”

---

## 17. Pattern 13 — Graph Traversal

### Clues

Look for:

- entities connected by relationships,
- reachability,
- dependencies,
- paths,
- connected components,
- state transitions.

Translate:

```text
objects + relationships
        ↓
      graph
```

Then choose:

```text
DFS / BFS / specialized graph algorithm
```

based on what the problem asks.

---

## 18. Pattern 14 — State-Space Search

Some problems are not naturally arrays or graphs initially, but every possible configuration forms a state space.

Examples:

- game states,
- puzzle configurations,
- scheduling choices,
- transformations,
- AI search.

Model:

```text
state
 ↓ possible transitions
new states
 ↓
...
```

Then ask whether you need:

- exhaustive search,
- BFS,
- DFS,
- backtracking,
- memoization,
- pruning,
- heuristic search.

This is particularly important for AI engineering.

---

## 19. Pattern 15 — Monotonic Stack / Queue

### Clues

Look for:

- next greater/smaller element,
- maintaining candidates while newer values invalidate older ones,
- sliding-window maximum/minimum,
- monotonic relationships.

The central idea:

> Remove states that can no longer become useful.

Mental model:

```text
candidate states
      ↓
new information
      ↓
remove dominated states
      ↓
maintain monotonic structure
```

This pattern becomes important in later array and advanced-DSA phases.

---

## 20. Pattern 16 — Union-Find / Disjoint Set

### Clues

Look for:

- dynamically merging groups,
- connectivity queries,
- whether two elements belong to the same component,
- Kruskal-style minimum spanning tree processing.

Mental model:

```text
individual components
        ↓ union
larger components
```

The structure maintains component membership efficiently.

---

## 21. Pattern 17 — Difference / Delta Techniques

Sometimes repeatedly modifying ranges is expensive.

Instead of updating every element in a range:

```text
[l, r]
```

record only where the change starts and stops.

Mental model:

```text
range updates
     ↓
delta representation
     ↓
reconstruct final state
```

This is another example of changing representation to reduce repeated work.

---

## 22. Pattern 18 — Search on the Answer

Instead of searching through input values, search over possible answers.

Suppose the question is:

> “What is the minimum capacity that allows the workload to finish within D days?”

If we can test:

```text
canFinish(capacity)
```

and the result is monotonic:

```text
capacity too small → false
capacity large enough → true
```

then binary search can operate over the answer range.

This is one of the most important advanced pattern-recognition skills.

---

## 23. Pattern 19 — Coordinate Compression

When values are huge but only relative ordering or distinct positions matter, replace large coordinates with compact ranks.

Example:

```text
[1000000000, 50, 700000]
```

can become:

```text
[2, 0, 1]
```

when only relative order matters.

This can reduce memory and make indexed structures practical.

---

## 24. Pattern 20 — Offline Processing

If operations can be reordered without changing the required result, process them in an order that makes computation cheaper.

Mental model:

```text
incoming operations
       ↓
reorder / batch
       ↓
process efficiently
       ↓
restore required output order
```

This appears in advanced algorithms, query processing, event systems, and data engineering.

---

## 25. Pattern Selection by Constraint

Constraints are one of the strongest pattern filters.

For example:

```text
n ≤ 20
```

may allow exhaustive search.

```text
n ≈ 10^5
```

usually pushes toward O(n log n) or O(n).

```text
n ≈ 10^6
```

may make allocation-heavy or quadratic solutions dangerous.

```text
millions of repeated queries
```

suggest preprocessing or indexing.

Pattern recognition without constraint analysis is incomplete.

---

## 26. Pattern Selection by Operation

Ask what operation dominates.

| Required operation | Candidate pattern / structure |
|---|---|
| membership | Set / Map |
| frequency | Map / frequency array |
| ordered search | Binary search |
| pair relation in sorted data | Two pointers |
| contiguous valid range | Sliding window |
| repeated range aggregate | Prefix/suffix |
| repeated min/max | Heap |
| repeated same subproblem | Memoization / DP |
| all configurations | Backtracking |
| connectivity | Graph / Union-Find |
| next greater/smaller | Monotonic stack |
| threshold optimization | Binary search on answer |
| huge coordinate domain | Coordinate compression |
| repeated offline queries | Offline processing |

Use this table as a clue generator, not a substitution for reasoning.

---

## 27. Pattern Selection by Invariant

A stronger approach is to choose a pattern based on the invariant you want to maintain.

Examples:

### Two pointers

```text
Remaining candidates are represented by [left, right].
```

### Sliding window

```text
Current window satisfies / nearly satisfies a validity condition.
```

### Hash map

```text
Map contains exactly the relevant processed information.
```

### Heap

```text
Heap contains the currently relevant priority ordering.
```

### DP

```text
state[i] stores the optimal / required result for subproblem i.
```

Pattern selection becomes much more reliable when you can state the invariant before coding.

---

## 28. Similar Patterns Are Not Interchangeable

### Two pointers vs sliding window

A sliding window is a specialized form of pointer-based traversal for contiguous ranges.

But not every two-pointer problem is a sliding-window problem.

### Hashing vs sorting

Both can accelerate lookup-related tasks, but their trade-offs differ.

### Binary search vs two pointers

Binary search repeatedly halves a search space.

Two pointers typically move through a structure monotonically.

### DFS vs BFS

Both traverse graphs, but their state order and guarantees differ.

### Greedy vs DP

Greedy commits to a local choice.

DP preserves multiple states so future choices can be compared.

Recognizing the distinction is as important as recognizing the pattern.

---

## 29. Pattern Failure Is a Skill

Expert pattern recognition includes knowing when **not** to use a pattern.

Ask:

```text
What assumption does this pattern require?
Is that assumption guaranteed?
Can I prove pointer movement?
Can I prove pruning?
Can I prove greedy choice?
Can I prove state compression?
```

If the answer is no, return to modeling.

```text
Pattern doesn't fit
       ↓
Do not force it
       ↓
Re-model the problem
```

---

## 30. Pattern Recognition Example

Problem:

> Given an array, determine whether two values sum to a target.

### Step 1 — Required operation

Need fast lookup for a complement.

### Step 2 — Representation

Store previously seen values.

### Step 3 — Pattern

Hash lookup.

### Step 4 — Invariant

```text
seen contains exactly the values from earlier positions.
```

### Step 5 — Complexity

```text
O(n) average time
O(n) auxiliary space
```

Notice that the pattern emerged from the operation and invariant.

---

## 31. Pattern Recognition Example — Longest Valid Range

Problem:

> Find the longest contiguous range satisfying a condition.

Initial clue:

```text
contiguous
```

Candidate pattern:

```text
sliding window
```

But then ask:

```text
Can the window condition be maintained incrementally?
Is pointer movement monotonic?
```

If yes → sliding window may fit.

If no → consider:

- prefix sums,
- hashing,
- binary search,
- monotonic structures,
- dynamic programming,
- another representation.

The word “contiguous” is a clue, not a proof.

---

## 32. Backend Pattern Recognition

Backend systems repeatedly expose the same computational structures.

### Request deduplication

```text
membership → Set / Map
```

### Cache lookup

```text
keyed lookup → Map
```

### LRU cache

```text
Map + linked list
```

### Rate limiter

```text
keyed state + time-window representation
```

### Top-K API

```text
heap / ranking structure
```

### Cursor pagination

```text
ordered index + boundary condition
```

### Job scheduler

```text
priority queue / heap
```

### Dependency execution

```text
graph + topological ordering
```

Pattern recognition lets you move from business requirements to computational structures quickly.

---

## 33. AI Pattern Recognition

AI engineering has the same algorithmic foundations.

### Retrieval

```text
nearest candidates → indexing / search
```

### Top-K candidate generation

```text
heap / selection
```

### RAG context selection

```text
ranking + bounded selection
```

### Embedding deduplication

```text
hashing / similarity structure
```

### Vector search

```text
high-dimensional nearest-neighbor search
```

### Beam-style search

```text
state-space search + bounded candidate retention
```

### Model preprocessing

```text
batching / prefix-like cumulative state / indexing
```

The AI layer introduces domain-specific structures, but the underlying algorithmic reasoning remains the same.

---

## 34. Pattern Recognition Decision Tree

When facing a new problem:

```text
Is every item likely required?
 └─ yes → linear scan?

Is there useful ordering?
 ├─ yes → two pointers / binary search / sort + scan
 └─ no

Is fast membership or frequency required?
 └─ yes → hashing

Is the problem about a contiguous range?
 └─ yes → test sliding-window assumptions

Are repeated range queries present?
 └─ yes → prefix/suffix preprocessing

Do I repeatedly need an extreme value?
 └─ yes → heap / priority queue

Are subproblems repeated?
 └─ yes → memoization / DP

Are there choices forming a search tree?
 └─ yes → backtracking / pruning

Are entities connected?
 └─ yes → graph modeling

Is the answer space monotonic?
 └─ yes → binary search on answer

Do values have huge coordinates but limited distinct ranks?
 └─ yes → coordinate compression
```

This is a starting framework, not a complete decision tree.

---

## 35. Pattern Recognition Checklist

Before selecting a pattern:

- [ ] What is the exact input/output contract?
- [ ] What operations are required?
- [ ] What are the constraints?
- [ ] What work is repeated?
- [ ] Is ordering available?
- [ ] Is contiguity important?
- [ ] Is fast membership needed?
- [ ] Are there repeated queries?
- [ ] Are subproblems repeated?
- [ ] Is the search space monotonic?
- [ ] Is the data hierarchical or graph-shaped?
- [ ] Can candidates be eliminated safely?
- [ ] What state must I maintain?
- [ ] What invariant would make the algorithm correct?
- [ ] What assumption makes the pattern valid?

---

## 36. Common Mistakes

### Mistake 1 — Pattern memorization

Knowing a template without understanding its invariant produces fragile solutions.

### Mistake 2 — Keyword matching

“Substring” does not automatically mean sliding window.

“Sorted” does not automatically mean binary search.

“Optimization” does not automatically mean greedy.

### Mistake 3 — Ignoring constraints

The same pattern can be appropriate at one scale and unnecessary at another.

### Mistake 4 — Ignoring proof

A pattern is valid only when its assumptions hold.

### Mistake 5 — Using a more complex pattern unnecessarily

A simple linear scan may be better than a sophisticated structure when constraints are small.

### Mistake 6 — Confusing similar patterns

Two pointers, sliding window, prefix sums, and binary search can all appear in range-related problems, but their correctness conditions differ.

---

## 37. DSA Mental Model

Do not think:

```text
Problem → memorized pattern
```

Think:

```text
Problem
  ↓
Computational model
  ↓
Operations
  ↓
Constraints
  ↓
Structure
  ↓
State
  ↓
Invariant
  ↓
Pattern
  ↓
Proof
  ↓
Complexity
```

This is the transition from beginner pattern matching to expert algorithm design.

---

## 38. Interview Framework

When asked, “What pattern would you use?”, answer:

1. **Identify the structure.**
2. **State the relevant constraint.**
3. **Explain the repeated work or search-space property.**
4. **Name the pattern.**
5. **State the invariant.**
6. **Explain why its assumptions hold.**
7. **Give complexity.**

Example:

> “Because the data is sorted and I need to find a pair relationship, I can use two pointers. The key property is that if the current sum is too small, increasing the left pointer is safe because all values to its left are no larger. The candidate region therefore shrinks monotonically. This gives O(n) time and O(1) auxiliary space.”

---

## 39. Key Takeaways

1. Algorithmic patterns are reusable computational structures, not code templates.
2. Pattern recognition starts with modeling the problem.
3. Constraints strongly influence pattern selection.
4. Invariants explain why a pattern works.
5. Two pointers require safe monotonic movement.
6. Sliding windows require an appropriate contiguous-state property.
7. Hashing trades memory for fast lookup.
8. Prefix techniques trade preprocessing for cheap queries.
9. Binary search is about eliminating a search space.
10. Heaps are useful when complete ordering is unnecessary.
11. DP is often about identifying and reusing states.
12. Backtracking explores choices while pruning impossible branches.
13. Greedy requires a correctness proof for its local choices.
14. Graph problems emerge from entities and relationships.
15. Advanced patterns include monotonic structures, Union-Find, difference techniques, offline processing, and coordinate compression.
16. Pattern failure analysis is as important as pattern recognition.
17. The expert question is not “What pattern is this?” but **“What structure makes this pattern valid?”**

---

## Self-Check

1. What is an algorithmic pattern?
2. Why is a pattern more than a code template?
3. How do constraints help identify patterns?
4. When should you consider hashing?
5. What makes two-pointer movement safe?
6. What makes a sliding-window solution valid?
7. Why is binary search fundamentally a search-space technique?
8. When is a heap preferable to sorting everything?
9. What indicates memoization or DP?
10. What makes a greedy solution difficult to justify?
11. How do you distinguish two pointers from sliding window?
12. What is search on the answer?
13. When is coordinate compression useful?
14. Why can pattern recognition fail even when the problem looks familiar?
15. Can you derive a pattern from the operation + constraint + invariant rather than from keywords?
