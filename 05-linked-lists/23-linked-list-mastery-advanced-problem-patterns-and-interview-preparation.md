# 05.23 — Linked List Mastery: Advanced Problem Patterns & Interview Preparation

## Purpose

This chapter turns the entire linked-list phase into an interview-ready problem-solving system. The objective is not memorization. You should be able to recognize a structure, select a pattern, derive the algorithm, prove correctness, analyze complexity, implement safely, and defend trade-offs.

---

## 1. The Interview Pipeline

For an unfamiliar linked-list problem:

```text
clarify contract
→ model structure
→ identify pattern
→ establish invariant
→ derive algorithm
→ explain brute force
→ optimize
→ implement
→ test edge cases
→ analyze complexity
→ discuss trade-offs
```

Do not code before you know what the pointers represent.

---

## 2. Pattern: Fast and Slow Pointers

Use two traversal speeds when the problem involves:

- middle positions;
- cycle detection;
- cycle entry;
- palindrome structure;
- relative distance.

Core invariant:

```text
fast advances twice as quickly as slow
```

Typical time: O(N). Auxiliary space: O(1).

---

## 3. Pattern: Fixed-Gap Pointers

Maintain a constant distance between pointers.

Classic example:

```text
find kth node from end
```

Advance the lead pointer by `k`, then advance both until the lead reaches the boundary.

This converts a two-pass idea into one traversal.

---

## 4. Pattern: Sentinel / Dummy Node

Use a dummy node when head mutation creates special cases.

Common problems:

```text
remove first matching node
remove kth node from end
merge lists
partition list
insert before head
```

The dummy creates a uniform predecessor relationship.

---

## 5. Pattern: Three-Pointer Reversal

The fundamental iterative reversal state is:

```text
previous ← current → next
```

At each step:

```text
next = current.next
current.next = previous
previous = current
current = next
```

Invariant:

> `previous` represents the already-reversed prefix.

Time O(N), auxiliary space O(1).

---

## 6. Pattern: Reverse Then Process

Some problems become simpler after reversing a portion of the structure.

Examples:

- palindrome detection;
- suffix transformations;
- symmetric comparisons.

If the original structure must remain usable, restore it after processing.

---

## 7. Pattern: Segment Reversal

For reversing `[left, right]`:

```text
before → first ... last → after
```

Reconnect:

```text
before → reversed segment → after
```

The main risk is losing the boundary references.

---

## 8. Pattern: Group Reversal

For groups of size `k`, first determine the policy for an incomplete final group:

```text
reverse incomplete
OR
leave incomplete unchanged
```

The policy changes the algorithm and test cases.

---

## 9. Pattern: Multiple Chains

Partitioning is easier when building independent chains:

```text
less
  ↓
equal
  ↓
greater
```

At the end, connect the chains.

This avoids repeated insertion into one list and makes stability easier to reason about.

---

## 10. Pattern: Merge by Identity

For two sorted lists, compare values to determine order but preserve node identity when required.

Stable merge convention can be:

```text
A.value <= B.value → choose A
```

This preserves the relative order of equal keys from A before B.

---

## 11. Pattern: K-Way Merge

For `K` sorted lists:

```text
sequential merge        → O(TK) worst-case
heap-based merge        → O(T log K)
divide-and-conquer merge→ O(T log K)
```

`T` is the total number of nodes.

Choose based on constraints and implementation complexity.

---

## 12. Pattern: Intersection by Reference Identity

Two linked lists intersect when they share the same node object, not merely the same value.

Pointer switching:

```text
A → ... → null → B
B → ... → null → A
```

The pointers traverse equal total path lengths and converge when an intersection exists.

---

## 13. Pattern: Cycle Detection and Entry

Floyd's algorithm:

```text
slow += 1
fast += 2
```

If they meet, a cycle exists.

To find the entry, reset one pointer to the head and advance both one step at a time until they meet again.

Time O(N), auxiliary space O(1).

---

## 14. Pattern: Ordered List Reasoning

For an ordered list, define the invariant explicitly:

```text
compare(node, node.next) <= 0
```

Insertion requires finding the correct predecessor.

Do not claim insertion is O(1) unless the insertion position/node is already known.

---

## 15. Pattern: Recursive Structural Reasoning

Recursive linked-list problems usually need:

```text
base case
smaller problem
local transformation
return reconstructed head
```

Always reason about what the recursive call guarantees before modifying its result.

---

## 16. Pattern: Immutable / Persistent Transformation

If old versions must remain valid:

```text
do not mutate shared nodes
copy only the required path
share untouched suffix/prefix
```

This converts pointer mutation into structural sharing.

---

## 17. Pattern: Map + Linked List

When the problem requires both:

```text
fast key lookup
+
ordered mutation
```

consider:

```text
Map<key, node>
+
Doubly Linked List
```

This is the canonical LRU-cache pattern.

---

## 18. Pattern: Queue + Identity Index

For cancellable FIFO work:

```text
Map<id, node>
+
Doubly linked queue
```

The map locates the node; the list removes it without scanning.

This is a common backend design question.

---

## 19. Pattern: Ownership Validation

Before inserting an externally supplied node, ask:

```text
Is it already linked?
Does another container own it?
Are its neighbors valid?
```

Intrusive structures especially require explicit membership rules.

---

## 20. Pattern: Reference Model

For difficult implementations, maintain a simple model:

```text
optimized structure
        ↓
reference array/model
        ↓
compare observable behavior
```

The model is intentionally simple and is used to expose pointer bugs.

---

## 21. Edge-Case Matrix

Always test:

```text
empty
one node
two nodes
head target
tail target
middle target
missing target
duplicate values
all equal
already sorted
reverse sorted
cycle
shared node
invalid node
```

Not every problem accepts every state, but every allowed state should be deliberate.

---

## 22. Complexity Defense

When asked for complexity, explain the source of the cost.

Example:

```text
Traversal: O(N)
Pointer rewiring: O(1) per affected node
Total: O(N)
Auxiliary pointers: O(1)
```

Avoid giving a complexity label without reasoning.

---

## 23. Common Interview Traps

1. Comparing node values instead of node identity for intersection.
2. Losing `next` before rewiring.
3. Forgetting the head can change.
4. Forgetting the tail after mutation.
5. Creating accidental cycles.
6. Mishandling duplicate values.
7. Claiming O(1) insertion when searching costs O(N).
8. Mutating shared persistent state.
9. Ignoring incomplete groups.
10. Forgetting to restore a list after a temporary mutation.

---

## 24. How to Explain a Solution

Use this format:

```text
Observation:
The key property is ...

Approach:
I will maintain ...

Invariant:
After each iteration ...

Complexity:
Time ... because ...
Space ... because ...

Edge cases:
I handle ...
```

This demonstrates reasoning rather than memorized code.

---

## 25. Backend Interview Mapping

Know how to explain linked lists in:

- LRU caches;
- cancellable queues;
- worker scheduling;
- retry queues;
- resource pools;
- free lists;
- session ordering.

Always discuss why another structure might be better.

---

## 26. AI Interview Mapping

Know how to explain linked structures in:

- BFS/DFS frontiers;
- beam candidates;
- search-state versions;
- inference queues;
- candidate ordering;
- AI caches;
- retry processing.

The strongest answers combine structures rather than forcing linked lists everywhere.

---

## 27. JavaScript-Specific Concerns

In JavaScript:

- nodes are objects;
- references are managed by the garbage collector;
- object allocation can affect performance;
- arrays often have excellent locality;
- recursive depth is limited by the call stack;
- `Map` and `Set` are useful companion structures.

Algorithmic complexity should be combined with runtime behavior.

---

## 28. When Linked Lists Lose

Prefer arrays or other structures when:

```text
random access dominates
sequential locality dominates
bulk numeric processing dominates
bounded FIFO is better served by a ring buffer
priority selection dominates
range queries dominate
```

Interview maturity includes rejecting an inappropriate structure.

---

## 29. Mastery Test

You are interview-ready when you can solve, from memory:

```text
reverse list
find middle
find kth from end
remove nth from end
merge sorted lists
merge K lists
remove duplicates
partition list
reorder list
palindrome list
cycle detection
cycle entry
intersection
reverse in groups
LRU cache
cancellable queue
```

And explain each solution without relying on memorized wording.

---

## 30. Final Problem-Solving Checklist

Before submitting:

```text
[ ] Contract understood
[ ] Pattern identified
[ ] Edge cases identified
[ ] Invariant stated
[ ] Brute force understood
[ ] Optimized algorithm derived
[ ] Pointer updates ordered safely
[ ] Head/tail handled
[ ] Cycle behavior understood
[ ] Complexity proven
[ ] Tests considered
[ ] Trade-offs explained
```

---

## Interview Questions

1. Reverse a singly linked list and prove the invariant.
2. Find the middle in one pass.
3. Find the kth node from the end in one pass.
4. Remove the nth node from the end without a separate length pass.
5. Detect and locate a cycle.
6. Determine whether two lists intersect by node identity.
7. Merge two sorted lists stably.
8. Merge K sorted lists and compare approaches.
9. Reverse nodes in groups of K.
10. Determine whether a list is a palindrome while restoring it.
11. Design an LRU cache.
12. Design a cancellable bounded queue.
13. Explain persistent linked-list structural sharing.
14. Explain intrusive linked lists.
15. Explain why arrays may outperform linked lists despite worse theoretical mutation costs.

## Revision Checklist

- [ ] Recognize fast/slow pointer problems.
- [ ] Recognize fixed-gap pointer problems.
- [ ] Use dummy nodes confidently.
- [ ] Reverse safely with three pointers.
- [ ] Reverse segments and groups.
- [ ] Partition using multiple chains.
- [ ] Merge sorted lists stably.
- [ ] Solve K-way merge.
- [ ] Detect cycles and cycle entries.
- [ ] Find intersections by identity.
- [ ] Reason about ownership and aliasing.
- [ ] Explain persistent structures.
- [ ] Design Map + Linked List systems.
- [ ] Use reference-model testing.
- [ ] Defend complexity and trade-offs.

# Key Takeaways

1. Linked-list interviews test pointer reasoning, invariants, and edge-case discipline.
2. Fast/slow pointers, fixed gaps, sentinels, reversal, partitioning, and merging are the highest-value reusable patterns.
3. Node identity and value equality are fundamentally different concepts.
4. O(1) local mutation depends on already knowing the relevant node or position.
5. Strong engineers explain correctness and trade-offs, not just code.
6. Backend and AI problems often combine linked lists with maps, heaps, sets, queues, or persistent structures.
7. Mastery means deriving the solution from the workload rather than recalling a memorized template.
