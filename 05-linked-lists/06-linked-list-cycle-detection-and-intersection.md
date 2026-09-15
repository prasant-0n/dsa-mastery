# 05.06 — Linked List Cycle Detection & Intersection

## Purpose

Cycles and intersections expose the deeper structure of linked lists. They require reasoning about reachability, pointer trajectories, identity, and what happens when the assumption of a terminating chain is violated.

> A linked-list problem is often about node identity and reachability, not merely about node values.

---

# 1. Acyclic vs Cyclic Lists

Normal singly linked list:

```text
A → B → C → D → null
```

Cyclic list:

```text
A → B → C → D
    ↑       ↓
    └───────┘
```

In a cycle, traversal never reaches `null`.

This changes the termination assumptions of many algorithms.

---

# 2. Why Cycle Detection Matters

An accidental cycle can cause:

- infinite loops;
- requests that never finish;
- memory-retention problems through reachability;
- corrupted caches or queues;
- non-terminating diagnostics.

Cycle detection is therefore both a DSA problem and a defensive engineering technique.

---

# 3. Identity vs Value

Cycle detection is about **node identity**.

This list:

```text
A(5) → B(5) → C(5) → null
```

has duplicate values but no cycle.

Conversely:

```text
A(5) → B(7) → A
```

has a cycle even though values differ.

Never detect cycles by comparing node values.

---

# 4. Hash Set Cycle Detection

The simplest approach stores every visited node:

```js
const seen = new Set();
let current = head;

while (current !== null) {
    if (seen.has(current)) return true;
    seen.add(current);
    current = current.next;
}

return false;
```

Complexity:

```text
Time:  O(N)
Space: O(N)
```

where N is the number of distinct reachable nodes before detection/termination.

---

# 5. Floyd's Tortoise and Hare

Floyd's algorithm uses two pointers:

```text
slow → 1 step
fast → 2 steps
```

If a cycle exists, the faster pointer eventually catches the slower pointer inside the cycle.

```js
let slow = head;
let fast = head;

while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
}

return false;
```

Complexity:

```text
Time:  O(N)
Space: O(1)
```

---

# 6. Why Floyd Works

Once both pointers enter the cycle, consider their positions modulo the cycle length.

The fast pointer gains one node of distance per iteration relative to slow.

Because there are finitely many positions, the relative distance eventually becomes zero.

Therefore they meet.

This is a modular arithmetic argument disguised as pointer traversal.

---

# 7. Detecting the Cycle Entry

Detecting that a cycle exists is only the first problem.

We may also need the first node belonging to the cycle.

Floyd's algorithm can do this in O(N) time and O(1) space.

After slow and fast meet:

```text
reset one pointer to head
advance both one step at a time
```

Their next meeting point is the cycle entry.

---

# 8. Why Resetting Finds the Entry

Let:

```text
a = distance from head to cycle entry
b = distance from entry to meeting point
L = cycle length
```

At the meeting point, Floyd's equations imply the distance relationship needed for the remaining distance from head to entry to match the distance from meeting point to entry modulo `L`.

Moving one pointer from head and one from the meeting point at equal speed therefore makes them meet at the entry.

The important idea is the invariant relationship, not memorizing the equation.

---

# 9. Cycle Length

Once a meeting point is known, cycle length can be measured by walking around the cycle until returning to the same node.

```text
O(C)
```

where C is the cycle length.

Since C ≤ N, the overall complexity remains O(N).

---

# 10. Cycle Start and Prefix Length

A cyclic list can be modeled as:

```text
prefix → cycle
```

For example:

```text
A → B → C → D → E
        ↑       ↓
        └───────┘
```

Here:

```text
prefix length = 2
cycle length  = 3
```

Separating these regions makes many cycle problems easier to reason about.

---

# 11. Remove a Cycle

Once the cycle entry is known, find the node immediately before the entry within the cycle.

Then:

```js
lastInCycle.next = null;
```

This converts the reachable structure back into a terminating list.

Time remains O(N), and auxiliary space can remain O(1).

---

# 12. Cycle Detection Is About Termination

A normal traversal assumes:

```text
repeated next steps eventually reach null
```

Cycle detection tests exactly that assumption.

This makes cycle detection an example of **termination analysis** applied to pointer-based state transitions.

---

# 13. Two Lists Intersecting

Consider:

```text
List A: A1 → A2 ─┐
                 ↓
                 C1 → C2 → null
                 ↑
List B: B1 → B2 ─┘
```

The lists intersect because they share the same node objects from `C1` onward.

Intersection is about **reference identity**, not equal values.

---

# 14. Value Equality vs Node Intersection

These lists do not necessarily intersect:

```text
A1(5) → A2(8) → null
B1(5) → B2(8) → null
```

Equal values are insufficient.

Intersection means:

```js
nodeA === nodeB
```

for the same object in memory.

---

# 15. Intersection With a Set

Store nodes from the first list:

```js
const seen = new Set();
```

Then traverse the second list and return the first node already present.

Complexity:

```text
Time:  O(N + M)
Space: O(N)
```

where N and M are the reachable nodes in the two lists.

---

# 16. Intersection With Pointer Switching

For two **acyclic** singly linked lists, an elegant O(1)-space method uses two pointers.

```text
pA traverses A then B
pB traverses B then A
```

If they intersect, they eventually align at the shared node.

If they do not intersect, both become `null`.

Complexity:

```text
Time:  O(N + M)
Space: O(1)
```

---

# 17. Why Pointer Switching Works

Suppose the lists have unique prefixes of lengths `a` and `b`, followed by a shared suffix of length `c`.

Pointer A travels:

```text
a + c + b
```

Pointer B travels:

```text
b + c + a
```

Both distances are equal:

```text
a + b + c
```

Therefore they reach the shared suffix at the same relative point.

---

# 18. Length Alignment Method

Another O(1)-space approach is:

1. find length of A;
2. find length of B;
3. advance the longer list by the difference;
4. move both pointers together;
5. compare node identity.

This is more explicit than pointer switching and is useful when teaching or debugging.

---

# 19. Tail Identity Shortcut

For two acyclic lists:

```text
A → ... → tailA
B → ... → tailB
```

if:

```js
tailA !== tailB
```

then the lists cannot intersect.

Why?

Once two singly linked lists intersect, they share the entire suffix through the same final node.

This can provide an inexpensive early rejection after determining tails.

---

# 20. Intersection of Cyclic Lists

Cyclic lists make intersection significantly more subtle.

There are cases where:

- both lists enter the same cycle at the same entry node;
- both enter the same cycle at different entry nodes;
- one structure reaches a cycle that the other also reaches;
- the cycles are completely separate.

Do not apply the standard acyclic pointer-switching algorithm blindly.

---

# 21. Same Cycle, Same Entry

If two cyclic lists have the same cycle entry:

```text
A → B → C ↘
           D → E
           ↑   ↓
           └───┘
X → Y ─────↗
```

Their prefixes may differ, but the cycle is shared.

The first intersection may occur in the prefixes or exactly at the shared cycle entry depending on the structure.

---

# 22. Same Cycle, Different Entries

Suppose:

```text
entryA = C
entryB = E
```

but both belong to the same cycle.

Then the lists intersect somewhere in that cycle even though their cycle-entry nodes differ.

A cycle walk from one entry can determine whether the other entry is reachable within the same cycle.

---

# 23. Disjoint Cycles

If the cycle of A cannot reach the cycle entry of B, the lists do not intersect.

This can be tested by walking one complete cycle and checking for the other cycle's entry.

The operation is O(C) after cycle detection.

---

# 24. Intersection and Shared Ownership

Intersection means shared node identity.

Therefore, two list abstractions can have different heads while sharing part of their physical structure.

Mutation through one head can affect the other list.

This is an ownership and aliasing concern, not merely an intersection algorithm problem.

---

# 25. Cycle Detection in Production Systems

A cycle may indicate:

- a programming bug;
- malformed imported data;
- intentional circular data structure;
- a corrupted cache/queue;
- a graph represented accidentally as a list.

Production code should distinguish intentional cycles from invariant violations.

Do not automatically “fix” a cycle if cycles are part of the valid data model.

---

# 26. Backend Applications

Cycle detection and intersection reasoning are useful in:

- detecting corrupted linked queues;
- validating custom cache structures;
- diagnosing pointer-based memory structures;
- shared work-chain analysis;
- defensive validation of in-memory data structures.

LRU caches normally use an intentionally acyclic doubly linked list. A cycle in that structure is usually a serious invariant violation.

---

# 27. AI Applications

The concepts generalize to graph-like AI state structures:

- detecting repeated states;
- identifying shared search nodes;
- reasoning about cyclic state transitions;
- preventing non-terminating traversal.

In AI search, however, explicit graph representations and visited-state sets are often more appropriate than literal linked lists.

---

# 28. Common Mistakes

1. Comparing values instead of node identity.
2. Using a Set when O(1) space is required.
3. Forgetting `fast.next` in Floyd's loop condition.
4. Assuming a cycle must include the head.
5. Confusing cycle entry with meeting point.
6. Applying acyclic intersection algorithms to cyclic lists.
7. Treating equal tails as equal values rather than shared references.
8. Forgetting that shared nodes create aliasing.
9. Breaking intentional cycles during validation.
10. Failing to define whether “intersection” means first shared node or merely shared reachability.

---

# 29. Edge Cases

Test:

```text
empty list
one node
self-cycle
cycle beginning at head
cycle beginning in middle
long acyclic prefix
cycle length 1
cycle length 2
no intersection
intersection at head
intersection near tail
identical heads
same values but separate nodes
acyclic + cyclic inputs
shared cycle with same entry
shared cycle with different entries
disjoint cycles
```

---

# 30. Complexity Summary

| Problem | Time | Extra Space |
|---|---:|---:|
| Cycle detection with Set | O(N) | O(N) |
| Floyd cycle detection | O(N) | O(1) |
| Find cycle entry | O(N) | O(1) |
| Find cycle length | O(N) | O(1) |
| Remove cycle | O(N) | O(1) |
| Acyclic intersection with Set | O(N+M) | O(N) |
| Acyclic intersection with pointer switching | O(N+M) | O(1) |
| Acyclic intersection with length alignment | O(N+M) | O(1) |

---

# 31. Design Procedure

```text
1. Determine whether input is guaranteed acyclic.
2. Decide whether identity or value equality matters.
3. Identify whether the operation needs detection, entry, length, or removal.
4. Choose Set or O(1)-space pointer reasoning.
5. For two lists, classify acyclic/cyclic combinations.
6. Define what intersection means.
7. Preserve intentional structure.
8. Validate termination and reachability.
9. Analyze time and auxiliary space.
10. Test identity, cycles, aliases, and boundary cases.
```

---

# 32. Interview Explanation Template

> “Cycle detection is an identity and termination problem. For O(1) auxiliary space, I use Floyd's tortoise-and-hare algorithm. If the pointers meet, I can reset one to the head and advance both one step at a time to locate the cycle entry. For acyclic list intersection, I compare node identity rather than values and can use pointer switching to achieve O(N+M) time and O(1) space. Cyclic intersections require separate case analysis.”

---

# 33. Revision Checklist

- [ ] Can I distinguish duplicate values from shared node identity?
- [ ] Can I detect a cycle with a Set?
- [ ] Can I implement Floyd's algorithm?
- [ ] Can I prove why Floyd works?
- [ ] Can I find the cycle entry?
- [ ] Can I find cycle length?
- [ ] Can I remove a cycle safely?
- [ ] Can I find acyclic intersection using a Set?
- [ ] Can I find acyclic intersection with O(1) space?
- [ ] Can I explain pointer switching mathematically?
- [ ] Can I classify cyclic intersection cases?
- [ ] Can I reason about shared ownership and aliasing?
- [ ] Can I distinguish intentional cycles from corrupted structures?

# Key Takeaways

1. Cycle detection is about node identity, not values.
2. Floyd detects cycles in O(N) time and O(1) auxiliary space.
3. The meeting point and cycle entry are different concepts.
4. A cyclic list can be modeled as an acyclic prefix followed by a cycle.
5. Acyclic list intersection is about shared node objects.
6. Pointer switching finds acyclic intersections in O(N+M) time and O(1) space.
7. Cyclic intersection requires explicit case analysis.
8. Shared nodes create aliasing and mutation consequences.
9. Cycle detection is fundamentally a termination and reachability technique.
10. Production systems must distinguish invalid accidental cycles from intentionally cyclic structures.
