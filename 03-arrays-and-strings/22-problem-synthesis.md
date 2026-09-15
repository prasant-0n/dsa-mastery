# 03.22 — Problem Synthesis

## Purpose

This chapter turns the individual techniques from Phase 03 into a single **problem-solving system**.

The goal is not to memorize 100 array/string tricks. The goal is to look at an unfamiliar problem and derive:

```text
contract
→ constraints
→ representation
→ candidate space
→ invariant/state
→ brute force
→ bottleneck
→ pattern
→ optimized algorithm
→ proof
→ complexity
→ implementation
→ validation
```

This is the bridge from learning DSA topics to actually solving DSA problems.

---

# 1. Start With the Contract

Before coding, identify:

- input;
- output;
- allowed mutations;
- ordering requirements;
- duplicate semantics;
- numeric domain;
- Unicode/string assumptions;
- exact vs approximate requirements;
- invalid-input behavior.

A problem statement is an API contract.

If the contract is misunderstood, a fast algorithm can still be wrong.

---

# 2. Extract Constraints

Ask:

```text
How large is N?
How many queries Q?
Is K small or large?
Is the input sorted?
Are values bounded?
Can the input be modified?
Is the data static or changing?
```

Constraints eliminate entire algorithm families.

For example:

```text
N ≈ 20 → exponential may be possible
N ≈ 10^5 → O(N log N) is often plausible
N ≈ 10^7 → constants, memory, and streaming matter
```

These are heuristics, not laws.

---

# 3. Identify the Computational Object

Determine whether the problem is fundamentally about:

- individual elements;
- contiguous subarrays;
- subsequences;
- pairs/triples;
- intervals;
- strings/patterns;
- matrices;
- ranked candidates;
- windows;
- ranges;
- frequency state.

The object often reveals the pattern.

---

# 4. Enumerate the Candidate Space

Ask:

> What are all possible answers I could choose from?

Examples:

### Subarrays

There are `O(N²)` contiguous ranges.

### Pairs

There are `O(N²)` pairs.

### Triples

There are `O(N³)` naive combinations.

### Subsequences

There can be `O(2^N)` subsequences.

### Permutations

There can be `O(N!)` permutations.

This immediately tells you whether exhaustive enumeration is feasible.

---

# 5. Build a Brute-Force Oracle

The brute-force solution should be:

- obviously correct;
- easy to reason about;
- useful for small inputs.

It provides:

```text
correctness baseline
→ test oracle
→ bottleneck identification
→ optimized comparison
```

Do not skip brute force merely because it is slow.

---

# 6. Find the Repeated Work

Optimization usually begins with:

> What am I calculating again that I already know?

Common repeated work:

- rescanning a range;
- recomputing a sum;
- recounting frequencies;
- restarting a string match;
- sorting repeatedly;
- revisiting candidates;
- recomputing overlapping windows.

Remove the repeated work using state, preprocessing, or representation changes.

---

# 7. Representation Transformation

Many strong solutions change the representation.

Examples:

```text
raw values
→ frequency map

array
→ sorted array

range queries
→ prefix sums

characters
→ integer IDs

intervals
→ sorted events

vectors
→ normalized vectors/index
```

The algorithm often becomes obvious after the representation changes.

---

# 8. Pattern Selection Matrix

| Signal | Likely direction |
|---|---|
| contiguous + fixed length | fixed sliding window |
| contiguous + variable constraint | variable sliding window |
| sorted + pair relation | two pointers |
| repeated membership | Set/Map |
| frequency relation | frequency table/map |
| static range sums | prefix sums |
| range updates | difference array |
| sorted search | binary search |
| ordered candidate lists | two pointers / heap |
| Top-K | heap / selection |
| intervals | sort + scan / sweep |
| exact pattern matching | KMP/Z/rolling hash |
| palindrome symmetry | two pointers / center expansion |
| bounded numeric domain | counting/frequency array |
| huge sparse domain | Map/compression |

This table is a starting point, not a substitute for reasoning.

---

# 9. Two Pointers: Recognize Monotonic Movement

Two pointers are appropriate when pointer movement can be justified without backtracking.

Typical signals:

```text
sorted order
left/right boundary
opposing ends
merge of ordered sequences
read/write compaction
```

The key question is:

> Why can this pointer move forward permanently?

If you cannot answer that, the technique may be unjustified.

---

# 10. Sliding Window: Recognize Local State

Sliding windows work when the relevant answer can be maintained as the boundary moves.

Typical state:

```text
left
right
sum
frequency
count
constraint state
```

The critical issue is whether removing the left element and adding the right element is sufficient to update the state.

Negative values often break naive monotonic-window assumptions.

---

# 11. Prefix/Suffix: Recognize Reusable Range State

Use prefix/suffix structures when many queries depend on cumulative information.

Examples:

```text
range sum
left maximum
right minimum
cumulative token cost
range XOR
```

The trade-off is usually:

```text
preprocessing + memory
↔ faster repeated queries
```

---

# 12. Hashing: Recognize Identity or Frequency

Use hashing when the problem repeatedly asks:

```text
Have I seen this?
How many times?
Where was it seen?
What is associated with this key?
```

Typical structures:

```js
Set
Map
```

Hashing converts repeated search into expected constant-time lookup under normal assumptions.

Worst-case behavior and memory still matter.

---

# 13. Sorting as an Algorithmic Transformation

Sorting is useful when order reveals structure.

After sorting, you may gain:

- adjacent duplicates;
- monotonic movement;
- two-pointer solutions;
- interval ordering;
- binary search;
- deterministic grouping.

But sorting costs time and may mutate input.

Ask whether the ordering benefit justifies the preprocessing cost.

---

# 14. Binary Search: Search the Monotonic Boundary

Do not think only:

> “The array is sorted.”

Think:

> “There is a monotonic predicate whose boundary I can locate.”

Examples:

```text
first value >= target
first value > target
first feasible capacity
first time a condition becomes true
```

This expands binary search far beyond ordinary lookup.

---

# 15. Intervals: Normalize the Model

Before solving an interval problem, define:

- closed/open boundaries;
- overlap semantics;
- touching intervals;
- sorting key;
- event tie-breaking.

Many interval bugs are representation bugs rather than algorithm bugs.

---

# 16. Strings: Define the Character Model

Before string algorithms, establish:

```text
ASCII?
Unicode code points?
Grapheme clusters?
Case-sensitive?
Normalized?
Whitespace significant?
```

A frequency-array solution assuming lowercase ASCII is invalid for arbitrary Unicode input.

The character model is part of the contract.

---

# 17. Subarray vs Subsequence

This distinction determines the search space.

### Subarray

Contiguous:

```text
[i ... j]
```

### Subsequence

Order preserved but gaps allowed.

```text
[i1, i2, i3, ...]
```

Confusing these two can produce a completely different algorithm.

---

# 18. Matrix Problems: Think in Coordinates

Represent a matrix cell as:

```text
(row, column)
```

Then explicitly define:

- valid bounds;
- neighbors;
- traversal order;
- visited state;
- row/column dimensions.

Many 2D algorithms become graph problems once cells and transitions are defined.

---

# 19. Top-K: Do Not Sort Automatically

If only `K` best items are needed:

```text
full sort → O(N log N)
heap → O(N log K)
```

when `K << N`, a heap can avoid unnecessary ordering work.

For some workloads, Quickselect or specialized selection is preferable.

Output requirements should drive the algorithm.

---

# 20. Merge vs Recompute

If multiple sources are already sorted, exploit that structure.

Two sources:

```text
O(N + M)
```

using two pointers.

Many sources:

```text
O(T log K)
```

with a heap, where `K` is the number of active sources and `T` is total output/input processed as appropriate.

Never discard useful ordering information.

---

# 21. Choose State Before Code

For a stateful algorithm, write down:

```text
state variables
meaning of each variable
invariant
transition
termination condition
```

Example for a sliding window:

```text
left = active boundary
right = next processed position
freq = frequencies inside window
```

Then define exactly when each changes.

---

# 22. Invariant-First Design

A good invariant describes what remains true throughout execution.

Examples:

### Binary search

The answer remains inside the maintained search interval.

### Two pointers

Everything outside the active region has already been classified correctly.

### Prefix sum

`prefix[i]` represents the sum of the first `i` elements.

### Heap

The heap root is the best/worst element according to the heap ordering.

If the invariant is unclear, the implementation is probably not fully understood.

---

# 23. Prove Pointer Monotonicity

A common interview mistake is saying:

> “Two pointers makes it O(N).”

That is not a proof.

You must show:

```text
each pointer moves in one direction
→ total pointer movements ≤ O(N)
```

The same reasoning explains many sliding-window algorithms.

---

# 24. Complexity From Operations, Not Lines

A single source line can hide expensive work:

```js
arr.includes(x)
text.slice(...)
array.sort(...)
```

Ask what the operation costs.

Likewise, nested loops are not automatically `O(N²)` if the inner pointer moves globally rather than restarting.

Analyze actual execution count.

---

# 25. Multi-Parameter Complexity

Use separate variables when dimensions are independent.

Examples:

```text
N = documents
D = vector dimension
K = Top-K
Q = queries
M = pattern length
```

A retrieval algorithm might be:

```text
O(ND + N log K + KR)
```

rather than incorrectly reporting only `O(N)`.

---

# 26. Static vs Dynamic Workloads

For static data with many queries:

```text
preprocess once
→ answer quickly
```

For highly dynamic data:

```text
cheap updates
↔ query cost
```

The same array may justify different data structures depending on workload.

---

# 27. Online vs Offline

### Online

Process input without seeing the future.

### Offline

You may reorder or preprocess operations after seeing the full workload.

Offline knowledge can enable:

- sorting queries;
- batching;
- coordinate compression;
- query reordering;
- grouped processing.

The algorithmic model is part of the problem contract.

---

# 28. Exact vs Approximate

Ask whether the output must be exact.

If approximation is permitted, possibilities expand:

```text
sampling
sketches
approximate Top-K
ANN
heuristics
```

But define:

- error bound;
- probability of failure;
- recall target;
- quality metric.

Otherwise you cannot evaluate correctness.

---

# 29. Backend Synthesis Example

Problem:

> Merge events from several already-sorted tenant feeds, remove duplicates, and return the latest 100 events.

Reasoning:

```text
sorted sources
→ k-way merge
→ deduplication
→ Top-K/bounded output
```

Do not concatenate everything and sort if the source ordering can be exploited.

Production concerns:

- tenant isolation;
- deterministic tie-breaking;
- memory bounds;
- malformed events;
- backpressure.

---

# 30. AI Synthesis Example

Problem:

> Retrieve the best 20 documents from a large embedding collection and rerank them.

Reasoning:

```text
N vectors × D dimensions
→ candidate retrieval
→ Top-K
→ deduplicate/filter
→ expensive reranking
→ Top-20
```

The important optimization is often reducing the expensive candidate set.

Production concerns:

- recall;
- latency;
- memory;
- deterministic ranking;
- batching;
- index freshness.

---

# 31. Brute Force → Optimization Template

Use this template for unfamiliar problems:

```text
1. enumerate candidates
2. implement the obvious solution
3. calculate complexity
4. locate repeated work
5. identify reusable state
6. choose a representation
7. apply the matching pattern
8. define invariant
9. prove correctness
10. analyze complexity
11. test against brute force
12. benchmark if performance matters
```

This process is more valuable than memorizing solution code.

---

# 32. Failure Analysis Template

When an approach fails, classify the failure:

```text
wrong representation
wrong candidate space
wrong monotonicity assumption
wrong invariant
wrong edge-case contract
wrong complexity assumption
memory explosion
allocation overhead
output-size explosion
```

Then change the model, not merely random lines of code.

---

# 33. Problem-Solving Decision Tree

```text
Is the data ordered?
 ├─ yes → can order be exploited?
 │        ├─ search → binary search
 │        ├─ pair/merge → two pointers
 │        └─ intervals → sort + scan
 │
 └─ no → repeated lookup/frequency?
          ├─ yes → Set/Map/frequency state
          └─ no → contiguous range?
                   ├─ yes → window/prefix
                   └─ no → search/state-space/DP/etc.
```

This is intentionally incomplete: the correct pattern must still be justified.

---

# 34. Interview Explanation Template

A strong explanation follows:

```text
The brute-force approach is ...
Its complexity is ...
The bottleneck is ...
Because the input has property X, I can transform it using Y.
I maintain state Z with invariant I.
Each operation moves/progresses because ...
Therefore the total complexity is ...
The edge cases are ...
```

This demonstrates reasoning rather than memorization.

---

# 35. Implementation Review

Before submitting code, inspect:

- boundary conditions;
- empty input;
- singleton input;
- duplicates;
- negative values;
- sorted/reverse-sorted data;
- mutation;
- overflow/precision;
- Unicode;
- large input;
- deterministic ordering;
- output size.

Then compare with the intended invariant.

---

# 36. Optimization Review

Ask:

1. Did I reduce candidate enumeration?
2. Did I remove repeated work?
3. Did I exploit ordering?
4. Did I choose the correct representation?
5. Did I trade memory for speed intentionally?
6. Did I reduce unnecessary output work?
7. Did I introduce hidden allocations?
8. Did I preserve correctness?
9. Is the optimization actually relevant at the target scale?

---

# 37. Testing Strategy

Use layers:

### Hand cases

Understand behavior.

### Boundary cases

Expose off-by-one errors.

### Random small cases

Compare with brute force.

### Adversarial cases

Stress assumptions.

### Large cases

Validate scaling.

### Production-shaped cases

Validate actual distributions.

---

# 38. Metamorphic Reasoning

When exact expected output is difficult to write, test relationships.

Examples:

- reversing an array twice returns the original;
- adding an irrelevant element should not change an unrelated query;
- duplicating a dataset changes counts predictably;
- sorting twice produces the same order;
- normalization is idempotent when the normalization contract guarantees it.

These properties expose classes of bugs rather than individual examples.

---

# 39. Performance Synthesis

A complete analysis contains:

```text
asymptotic time
asymptotic space
preprocessing cost
output cost
allocation behavior
memory locality
I/O/network cost
parallelism potential
```

Not every problem needs every dimension, but production engineering requires knowing which dimensions matter.

---

# 40. Phase 03 Master Problem Set

For every future array/string problem, write:

```text
Problem:
Contract:
Constraints:
Candidate space:
Brute force:
Brute force complexity:
Bottleneck:
Representation:
Pattern:
State:
Invariant:
Optimized approach:
Correctness:
Time:
Space:
Edge cases:
Alternative:
Production considerations:
```

This turns every problem into a reusable reasoning artifact.

---

# 41. Synthesis Problems

The exercise file for this chapter deliberately mixes techniques instead of grouping them by topic.

Expect combinations such as:

- hashing + sliding window;
- sorting + two pointers;
- prefix sums + hashing;
- intervals + sweep line;
- binary search + feasibility;
- string normalization + frequency;
- Top-K + heap;
- k-way merge + deduplication;
- matrix traversal + state;
- token sequences + candidate selection.

The goal is **pattern composition**.

---

# 42. Expert-Level Principle

Do not ask:

> “Which LeetCode pattern is this?”

Ask:

> “What information must the algorithm remember, what candidates must it eliminate, and what property lets me eliminate them safely?”

That question generalizes far beyond interview problems.

---

# 43. Phase 03 Mastery Standard

You should be able to take an unfamiliar array/string problem and independently:

1. formalize it;
2. estimate feasibility;
3. build brute force;
4. identify the bottleneck;
5. choose a representation;
6. recognize or derive a pattern;
7. define state and invariant;
8. implement without reference;
9. prove the critical step;
10. derive complexity;
11. test against an oracle;
12. explain production trade-offs.

If you can do this consistently, Phase 03 has achieved its purpose.

---

# Revision Checklist

- [ ] I can formalize an unfamiliar array/string problem.
- [ ] I can estimate the candidate space.
- [ ] I can build a brute-force oracle.
- [ ] I can identify repeated work.
- [ ] I can choose a representation deliberately.
- [ ] I can recognize two-pointer conditions.
- [ ] I can recognize valid sliding-window conditions.
- [ ] I can use prefix/suffix state appropriately.
- [ ] I can choose hashing for identity/frequency workloads.
- [ ] I can use sorting as a representation transformation.
- [ ] I can recognize monotonic binary-search boundaries.
- [ ] I can model intervals precisely.
- [ ] I can distinguish substring, subarray, and subsequence.
- [ ] I can reason about matrix coordinates and boundaries.
- [ ] I can choose Top-K without blindly sorting.
- [ ] I can merge ordered sources efficiently.
- [ ] I can define state and invariants before implementation.
- [ ] I can analyze multi-parameter complexity.
- [ ] I can distinguish static, dynamic, online, and offline workloads.
- [ ] I can reason about exact vs approximate computation.
- [ ] I can test optimized solutions against brute force.
- [ ] I can explain backend and AI applications.

## Key Takeaways

1. Expert problem solving is a process, not a pattern-matching reflex.
2. Candidate-space analysis tells you what must be eliminated or represented efficiently.
3. Most optimizations remove repeated work through state, preprocessing, ordering, or representation changes.
4. Every nontrivial optimization should have a correctness argument.
5. Invariants are the bridge between intuition and reliable implementation.
6. Complexity should preserve independent parameters and include meaningful resource costs.
7. Pattern composition is more important than memorizing isolated patterns.
8. Brute-force solutions remain valuable as correctness oracles.
9. Backend and AI systems are large-scale applications of the same algorithmic reasoning.
10. The real Phase 03 goal is to solve unfamiliar array/string problems from first principles.
