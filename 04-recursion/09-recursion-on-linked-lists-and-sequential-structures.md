# 04.9 — Recursion on Linked Lists & Sequential Structures

## Purpose

A linked list is another recursive data structure.

A list can be viewed as:

```text
empty
OR
node + rest-of-list
```

That makes many linked-list algorithms map naturally to recursion.

The key mental model is:

> A recursive linked-list call should describe exactly the remaining suffix of the list that still needs to be solved.

---

# 1. Recursive Definition of a Singly Linked List

A node can be modeled as:

```js
{
    value,
    next
}
```

Conceptually:

```text
List = null
    OR
       Node(value, nextList)
```

The `next` reference points to another list.

---

# 2. Natural Base Case

For a singly linked list, the most common terminal state is:

```text
node === null
```

This represents the empty remainder of the list.

For many recursive algorithms:

```text
solve(null) = base result
```

The base result depends on the operation.

---

# 3. Recursive State

The simplest recursive state is:

```text
node
```

because `node.next` defines the remaining problem.

Unlike an array, an index is often unnecessary.

This is a useful example of matching algorithmic state to the data structure.

---

# 4. Traversal

A recursive traversal looks conceptually like:

```text
process(node)
→ process(node.next)
```

The call stack represents the prefix of nodes currently being explored.

This is linear recursion with one recursive branch per node.

---

# 5. Forward Processing

If work occurs before recursion:

```text
process(node)
recurse(node.next)
```

values are observed from head to tail.

This is analogous to pre-order processing in a tree.

---

# 6. Reverse Processing

If work occurs after recursion:

```text
recurse(node.next)
process(node)
```

values are observed from tail to head.

This is a powerful demonstration of return-time behavior.

However, the list is still traversed in the forward pointer direction; only the timing of processing changes.

---

# 7. Length of a Linked List

The recurrence is:

```text
length(null) = 0
length(node) = 1 + length(node.next)
```

For `N` nodes:

```text
Time  = O(N)
Stack = O(N)
```

The stack complexity is linear because the list may be completely unbalanced from a recursive perspective.

---

# 8. Sum and Aggregation

Many list metrics follow:

```text
solve(null) = identity
solve(node) = node.value + solve(node.next)
```

The same pattern works for:

- sum;
- count;
- product;
- maximum;
- predicate checks.

---

# 9. Searching a List

A recursive search can ask:

```text
Does current node match?
OR
Does the remaining list contain the target?
```

Conceptually:

```text
match(node)
OR
search(node.next)
```

This can short-circuit as soon as a match is found.

---

# 10. Recursive Reversal

Linked-list reversal is an important recursion problem.

Suppose:

```text
A → B → C → null
```

Recursively reverse:

```text
B → C
```

Then connect `C` back to `B`.

The critical operation is changing the pointer relationship safely.

---

# 11. Recursive Reversal Mental Model

At the recursive level:

```text
reverse(node)
```

assume the suffix beginning at `node.next` can be reversed.

Then reconnect the current node at the end of that reversed suffix.

The recursive assumption must be precise:

> The returned head represents a correctly reversed version of the original suffix.

---

# 12. Pointer Rewiring

A common reversal step is conceptually:

```text
node.next.next = node
node.next = null
```

The second assignment is important because it prevents the old forward edge from remaining as a cycle.

Pointer manipulation requires careful ownership reasoning.

---

# 13. Why the Base Case Matters for Reversal

For reversal, the base case commonly handles:

```text
null
single node
```

A single node is already reversed.

Returning that node gives the previous stack frame a new head around which it can reconnect pointers.

---

# 14. Recursive vs Iterative Reversal

### Recursive
Advantages:

- elegant structural expression;
- demonstrates recursive reasoning;
- useful for learning pointer transformations.

Disadvantages:

- `O(N)` call-stack usage;
- unsafe for extremely long lists;
- pointer bugs can be harder to debug.

### Iterative
Usually:

```text
Time  = O(N)
Space = O(1)
```

for a standard in-place reversal.

Therefore recursion is not automatically the production-optimal implementation.

---

# 15. Finding the Middle

A recursive solution can maintain multiple pieces of state, such as:

```text
current node
fast node
slow node
```

But the classic fast/slow-pointer solution is usually iterative.

This is an important design lesson:

> A problem may be expressible recursively without recursion being the best engineering choice.

---

# 16. Two-Pointer Recursive State

When recursive state contains multiple references, define exactly what each reference means.

For example:

```text
slow = node at position i
fast = node at position 2i
```

The recursive transition must preserve that invariant.

Never add state merely because it feels useful.

---

# 17. Comparing Linked Lists

To compare two lists recursively:

```text
if both null → equal
if exactly one null → unequal
if values differ → unequal
otherwise compare next nodes
```

The recursive state becomes:

```text
nodeA + nodeB
```

This is a clean example of multi-parameter recursive state.

---

# 18. Merge Two Sorted Lists

Given two sorted lists, choose the smaller current node and recursively merge the remaining lists.

Conceptually:

```text
choose smaller head
→ recursively merge remaining suffix
```

Only one recursive branch is required at each step.

The total work is linear in the number of nodes processed.

---

# 19. Merge Recurrence

If `m` and `n` are list lengths:

```text
T(m, n) = T(m-1, n) + O(1)
```

or:

```text
T(m, n) = T(m, n-1) + O(1)
```

depending on which list contributes the next node.

Overall:

```text
O(m + n)
```

---

# 20. Recursive Sorting of a Linked List

Merge sort is especially suitable for linked lists because merging can be performed through pointer manipulation rather than array indexing.

The structure is:

```text
split list
→ recursively sort halves
→ merge sorted lists
```

This combines recursion, divide and conquer, and pointer manipulation.

---

# 21. Linked-List Merge Sort Complexity

For `N` nodes:

```text
Time = O(N log N)
```

The recursion depth is approximately:

```text
O(log N)
```

assuming the list is split reasonably evenly.

The exact auxiliary space depends on whether merging and splitting allocate additional structures or operate through pointers.

---

# 22. Recursion on Sequential Structures

The same idea applies beyond linked lists.

Sequential structures can often expose a smaller remainder:

```text
string → suffix
array → remaining range
stream → remaining segment
list → next node
```

The important question is:

> What is the smallest state that completely describes what remains?

---

# 23. Avoiding Structural Copies

For arrays and strings, recursive slicing may create copies:

```js
solve(value.slice(1));
```

This can introduce extra time and memory costs.

Prefer index/range state when the problem permits:

```js
solve(value, index + 1);
```

For linked lists, pointer references naturally provide suffix state without copying nodes.

---

# 24. Recursive Mutation

Linked-list recursion frequently mutates pointers.

This creates an additional correctness requirement:

> Every pointer mutation must preserve the list's intended ownership and connectivity.

Before changing `next`, determine:

```text
what node it currently references
what reference will replace it
whether the old reference is still needed
whether the mutation can create a cycle
```

---

# 25. Cycles in Linked Lists

A normal linked list is expected to terminate at `null`.

But malformed or deliberately cyclic structures may look like:

```text
A → B → C
    ↑   ↓
    └───┘
```

Naive recursion will never reach the base case.

Cycle detection changes the problem from simple linear traversal to graph-like traversal.

---

# 26. Cycle Detection and Identity

A recursive cycle detector may maintain a `Set` of visited node identities.

Conceptually:

```text
if visited.has(node) → cycle
visited.add(node)
recurse(node.next)
```

This uses additional memory but establishes termination for cyclic input.

---

# 27. Stack Depth Is a Production Concern

A linked list of `N` nodes creates a recursion depth of `O(N)` for straightforward recursive traversal.

In JavaScript, very deep recursion can exceed the call-stack limit.

Therefore:

```text
educational recursion ≠ automatically production-safe recursion
```

For untrusted or potentially huge lists, iterative traversal is often safer.

---

# 28. Correctness Pattern

For a recursive list function, prove:

### Base case
The result is correct for an empty/small list.

### Recursive assumption
Assume the function correctly solves the suffix beginning at `node.next`.

### Current step
Show that the current node is processed correctly using that suffix result.

This is induction over list length.

---

# 29. Backend Applications

Recursive linked-list reasoning appears in:

- pointer-based data structures;
- parser chains;
- custom queues/stacks;
- linked caches;
- graph adjacency structures;
- immutable list implementations;
- internal algorithmic utilities.

In production backend systems, iterative implementations are often preferred when input depth can be large.

---

# 30. AI Applications

The concepts transfer to AI engineering through:

- sequence processing;
- recursive token/segment processing;
- linked state representations;
- pointer-based search structures;
- recursive candidate chains.

The larger lesson is decomposition of a sequential state into a current element plus a remaining suffix.

---

# 31. When to Use Recursive Linked-List Algorithms

Use recursion when:

- the list is reasonably bounded;
- structural clarity is valuable;
- the recursive formulation simplifies correctness;
- the exercise/problem specifically benefits from recursion;
- recursion depth is known to be safe.

---

# 32. When Not to Use It

Prefer iteration when:

- list length may be very large;
- input is untrusted;
- constant auxiliary space matters;
- the recursive version provides no meaningful clarity advantage;
- production reliability is more important than structural elegance.

---

# 33. Design Procedure

```text
1. Define the node structure.
2. Identify the terminal state.
3. Define solve(node) precisely.
4. Decide whether work happens before or after recursion.
5. Define pointer/state transitions.
6. Check mutation safety.
7. Check for cycles.
8. Prove the recursive contract.
9. Derive time complexity.
10. Derive stack and auxiliary space.
11. Compare with an iterative implementation.
12. Consider maximum input depth in production.
```

---

# 34. Interview Explanation Template

> “A linked list is recursively defined as a node followed by another list, so the natural recursive state is the current node. The base case is the empty list. Each call processes or combines the current node with the recursively solved suffix. The traversal takes O(N) time and O(N) recursive stack space, so for large or untrusted lists I would generally prefer an iterative implementation.”

---

# 35. Revision Checklist

- [ ] Can I model a linked list recursively?
- [ ] Can I define the correct base case?
- [ ] Can I recursively traverse a list?
- [ ] Can I process values before and after recursion?
- [ ] Can I recursively aggregate list values?
- [ ] Can I recursively compare two lists?
- [ ] Can I recursively merge sorted lists?
- [ ] Can I explain recursive list reversal?
- [ ] Can I reason about pointer rewiring?
- [ ] Can I detect how mutation can create cycles?
- [ ] Can I distinguish list cycles from normal termination?
- [ ] Can I derive O(N) time and O(N) stack space?
- [ ] Can I explain why iterative reversal is usually more space-efficient?
- [ ] Can I apply divide and conquer to linked-list sorting?
- [ ] Can I decide when recursion is inappropriate in production?

# Key Takeaways

1. A linked list is naturally recursive: node plus the remaining list.
2. The node reference is often sufficient recursive state.
3. Work before recursion processes forward; work after recursion processes in reverse return order.
4. Linked-list reversal demonstrates recursive pointer rewiring.
5. Multi-parameter state must have explicit invariants.
6. Merge operations can recursively consume one node at a time.
7. Merge sort combines recursion with divide and conquer for O(N log N) sorting.
8. Pointer mutation requires careful connectivity and cycle reasoning.
9. A cyclic list invalidates the usual `null` termination assumption.
10. Straightforward recursive list traversal uses O(N) stack space, so iteration is often safer for large production inputs.
