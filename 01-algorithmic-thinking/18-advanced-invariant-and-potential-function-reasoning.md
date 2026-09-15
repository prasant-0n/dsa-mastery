# 01.18 — Advanced Invariants & Potential-Function Reasoning

> This chapter upgrades correctness and complexity reasoning from “I think this works” into a disciplined method for proving state validity, termination, amortized cost, and the safety of optimizations.

## Learning Objectives

By the end of this chapter, you should be able to:

- Design loop invariants rather than merely recognize them.
- Use preconditions, postconditions, and invariants together.
- Prove termination using well-founded progress measures.
- Use ranking functions for loops and recursive algorithms.
- Use potential functions for amortized analysis.
- Connect potential functions to aggregate and accounting methods.
- Reason about dynamic arrays, stacks, queues, heaps, and caches.
- Prove pruning and state-transition optimizations.
- Separate correctness proofs from complexity proofs.
- Apply proof thinking to backend and AI algorithm engineering.

---

## 1. Correctness Is a State Property

An algorithm transforms states:

```text
initial state
    ↓
transition
    ↓
valid state
    ↓
transition
    ↓
valid state
    ↓
final state
```

A correctness proof establishes that the algorithm never enters an invalid state and eventually reaches a state satisfying the required postcondition.

This gives three major proof questions:

1. Is the initial state valid?
2. Does every allowed transition preserve validity?
3. Does the algorithm terminate with the required result?

---

## 2. Preconditions, Invariants, Postconditions

### Preconditions

What must be true before execution?

### Invariant

What remains true throughout execution?

### Postcondition

What must be true when execution finishes?

A common proof structure is:

```text
Precondition
   ↓
Initialization
   ↓
Invariant
   ↓
Maintenance
   ↓
Invariant
   ↓
Termination
   ↓
Postcondition
```

---

## 3. Designing an Invariant

Do not start by asking:

> What invariant does this code have?

Instead ask:

> What fact would make the remaining work obviously correct?

Then formulate that fact precisely.

For a sorted-prefix algorithm, a useful invariant may be:

```text
The processed prefix is sorted and contains exactly the elements
that have been processed so far.
```

A strong invariant usually connects:

```text
algorithm state
+
original input
+
required result
```

---

## 4. Weak vs Strong Invariants

A weak invariant may be true but useless.

Example:

```text
index >= 0
```

This says little about correctness.

A stronger invariant might say:

```text
all positions before index satisfy the required condition
```

The goal is not to find any true statement.

The goal is to find a statement strong enough to imply the postcondition at termination.

---

## 5. Loop Invariant Example: Linear Search

Suppose we search for a target in an array.

Before checking index `i`, maintain:

```text
No element in [0, i) equals target.
```

Initialization:

```text
[0, 0) is empty
```

Maintenance:

If `array[i] !== target`, then no element in `[0, i + 1)` equals target.

Termination:

Either:

```text
target found
```

or:

```text
all elements were checked
```

The invariant directly establishes correctness.

---

## 6. Binary Search Invariants

Binary search is an excellent example of a proof-driven algorithm.

One valid formulation is:

```text
If target exists, it lies within [low, high].
```

At each iteration:

```text
mid = floor((low + high) / 2)
```

If `target < array[mid]`:

```text
high = mid - 1
```

If `target > array[mid]`:

```text
low = mid + 1
```

Each transition preserves the invariant while shrinking the candidate interval.

---

## 7. Invariant + Progress

Correctness alone is not enough.

An algorithm can preserve an invariant forever.

Example:

```js
while (true) {
  // invariant remains true
}
```

Therefore termination requires a separate argument.

The standard structure is:

```text
invariant → correctness of states
progress measure → eventual termination
```

This distinction is fundamental.

---

## 8. Ranking Functions

A ranking function maps the current state to a non-negative quantity that strictly decreases on every transition.

Example:

```text
remaining = high - low + 1
```

in binary search.

Every iteration reduces the candidate interval.

Eventually:

```text
remaining <= 0
```

and the loop terminates.

---

## 9. Well-Founded Progress

A useful progress measure must not decrease forever.

Natural numbers are well-founded under strict decrease:

```text
5 → 4 → 3 → 2 → 1 → 0
```

There is no infinite strictly decreasing sequence of non-negative integers.

This gives a rigorous termination argument.

---

## 10. Recursive Termination

The same idea applies to recursion.

For:

```js
function solve(n) {
  if (n <= 0) return;
  solve(n - 1);
}
```

ranking function:

```text
n
```

Each recursive transition decreases it.

For more complex recursion, the progress measure may be:

- remaining elements,
- interval size,
- number of unvisited states,
- depth remaining,
- lexicographically ordered tuple.

---

## 11. Lexicographic Ranking

Sometimes one quantity may increase while another decreases.

A single scalar measure may be awkward.

Use a tuple:

```text
(a, b)
```

with lexicographic ordering.

For example:

```text
(a decreases)
```

or:

```text
(a stays same, b decreases)
```

can prove termination when both dimensions are bounded appropriately.

This appears in nested algorithms, parsers, and recursive state machines.

---

## 12. Proof of a Backtracking Algorithm

A backtracking algorithm needs more than “it tries everything.”

You should establish:

1. Every generated state represents a valid sequence of choices.
2. Every legal next choice is considered unless safely pruned.
3. Undo restores the parent state.
4. Every complete valid solution is reachable.
5. Invalid branches cannot produce valid solutions.

This separates completeness from pruning correctness.

---

## 13. Completeness vs Soundness

### Soundness

Every returned solution is valid.

### Completeness

Every required valid solution is found, assuming the problem requires exhaustive enumeration.

A pruning rule can preserve soundness but destroy completeness.

Therefore every pruning optimization needs a proof of what guarantee it preserves.

---

## 14. Safe Pruning Proof

Suppose a search branch has state `S`.

A pruning rule is safe for exhaustive search if:

```text
S satisfies prune condition
⇒
no valid solution reachable from S
```

For optimization search, the condition may instead be:

```text
best possible result reachable from S
cannot beat current best
```

The distinction matters.

---

## 15. Potential Functions

A potential function assigns stored “credit” to the current state.

Let:

```text
Φ(state) ≥ 0
```

represent potential energy.

The amortized cost of an operation can be defined as:

```text
amortized cost
= actual cost + Φ(after) - Φ(before)
```

Expensive operations can consume previously accumulated potential.

Cheap operations can build potential for future work.

---

## 16. Dynamic Array Potential

Consider a dynamic array that doubles capacity when full.

Most insertions are cheap:

```text
O(1)
```

Occasionally, resizing costs:

```text
O(n)
```

A useful potential is related to unused capacity.

Cheap insertions increase potential.

A resize consumes potential to pay for copying elements.

Therefore the amortized insertion cost remains:

```text
O(1)
```

---

## 17. Potential-Method Proof Structure

For an operation sequence:

```text
actual cost c_i
potential before Φ_{i-1}
potential after  Φ_i
```

Define:

```text
â_i = c_i + Φ_i - Φ_{i-1}
```

Summing:

```text
Σ â_i
= Σ c_i + Φ_n - Φ_0
```

If:

```text
Φ_n ≥ 0
Φ_0 = 0
```

then total actual cost is bounded by total amortized cost.

This is the mathematical foundation of potential-based amortized analysis.

---

## 18. Potential Function Requirements

A useful potential function usually satisfies:

```text
Φ(initial) = 0 or known constant
Φ(state) ≥ 0
```

The potential should correlate with future expensive work.

Good potential:

```text
stored work / stored credit
```

Bad potential:

```text
arbitrary number unrelated to future cost
```

Designing the potential is often the hardest part.

---

## 19. Stack with Multipop

Suppose a stack supports:

```text
push → O(1)
pop → O(1)
pop(k) → O(k)
```

A sequence can contain many expensive multipops.

But each pushed element can be removed only once.

Potential intuition:

```text
Φ = number of elements in stack
```

A push adds potential.

A pop consumes potential.

Therefore the total cost over a sequence of operations can be bounded linearly in the number of pushes and pops.

---

## 20. Two-Stack Queue

A queue can be implemented using two stacks:

```text
in-stack
out-stack
```

When `out-stack` is empty, transfer all elements:

```text
in → out
```

That single transfer may cost O(n).

But each element is transferred only a bounded number of times.

Potential reasoning explains why queue operations are O(1) amortized even though one operation can cost O(n).

---

## 21. Monotonic Stack Potential

In a monotonic-stack algorithm, an element may be pushed once and popped once.

Even though one iteration may pop many elements:

```text
while stack not empty and condition:
    pop
```

The total number of pops over the whole input is at most the number of pushes.

Potential:

```text
Φ = stack size
```

This proves O(n) total stack operations.

---

## 22. Sliding Window Potential

In many sliding-window algorithms:

```text
left moves forward
right moves forward
```

Although there may be nested loops, each pointer moves at most `n` times.

Potential/counting intuition:

```text
remaining pointer movements
```

This is why code that visually resembles O(n²) can actually be O(n).

The proof comes from bounded total state transitions.

---

## 23. Aggregate vs Potential Method

### Aggregate method

Count total cost of a whole sequence directly.

### Accounting method

Assign amortized charges to operations.

### Potential method

Store abstract credit in the state.

All three prove the same kind of statement:

```text
total actual cost over a sequence
≤ manageable bound
```

Choose whichever gives the clearest proof.

---

## 24. Correctness and Complexity Are Separate Proofs

An algorithm can be:

```text
correct but slow
```

or:

```text
fast but incorrect
```

Therefore produce two separate arguments:

### Correctness

Why does it return the required result?

### Complexity

Why does it perform within the claimed resource bound?

Do not use one as evidence for the other.

---

## 25. Proof-Driven Optimization

Before optimizing:

```text
correct baseline
```

Then identify:

```text
repeated work
```

and replace it with:

```text
cached state
better representation
stronger invariant
pruning
preprocessing
```

After optimization, prove that the transformation preserves the required result.

This is safer than optimizing by intuition alone.

---

## 26. Representation Invariants

Data structures often maintain internal invariants.

Examples:

### Heap

```text
parent priority ≤ child priority
```

for a min-heap.

### BST

```text
left subtree keys < node key < right subtree keys
```

under the chosen duplicate policy.

### Hash table

```text
key is retrievable according to its hashing/equality contract
```

### LRU cache

```text
linked-list order agrees with recency metadata
```

A data-structure operation is correct only if it preserves the representation invariant.

---

## 27. Heapify as an Invariant Problem

During heap construction, the key proof question is:

> Which region is already a heap, and what property is restored after each sift operation?

A sift-down operation preserves the heap property below the current node while moving the violating value toward a valid position.

This invariant-driven view is much more reliable than memorizing heapify code.

---

## 28. Hashing Invariants

A hash table relies on a contract between:

```text
hash(key)
+
equality(keyA, keyB)
```

If two keys are equal, they must behave consistently with the hash strategy.

Violating this contract can make logically present keys unreachable.

This is a representation-level correctness issue, not merely a performance issue.

---

## 29. Cache Invariants

An LRU cache typically maintains:

```text
map[key] → node
```

and a linked structure representing recency order.

A correct implementation must preserve:

```text
map and linked-list membership agree
```

and:

```text
front = most recently used
back = least recently used
```

Every `get`, `put`, eviction, and deletion must preserve these invariants.

---

## 30. Backend: Rate Limiter Invariants

Consider a token-bucket limiter.

Potential/state may include:

```text
tokens available
last refill timestamp
capacity
refill rate
```

Invariant:

```text
tokens ∈ [0, capacity]
```

Transitions must preserve this bound.

A refill operation must not create more tokens than capacity.

This turns concurrency-sensitive logic into explicit state reasoning.

---

## 31. Backend: Job Queue Invariants

A job queue may maintain:

```text
queued
running
completed
failed
```

Useful invariants include:

```text
a job cannot be simultaneously queued and completed
running count ≤ concurrency limit
completed jobs are not eligible for retry
```

If a retry transition violates these invariants, the system can duplicate work or exceed capacity.

---

## 32. Backend: Retry Progress

A retry policy needs a progress measure.

For example:

```text
remaining attempts
```

strictly decreases.

Without a bounded retry count or another termination condition, failure can produce an infinite retry loop.

Backoff changes timing, not the logical need for a termination/progress argument.

---

## 33. AI: Beam Search Invariants

Beam search maintains a bounded set of candidate states.

Useful invariant:

```text
beam contains at most B candidates
```

At each expansion:

```text
expand candidates
↓
score
↓
select top B
```

The invariant controls memory and computation.

But beam pruning can eliminate the globally optimal path, so completeness is not preserved in general.

---

## 34. AI: Top-K Retrieval Invariant

For streaming Top-K retrieval:

```text
heap contains the best K items seen so far
```

After processing every prefix of the stream, this remains true.

At the end:

```text
heap = global Top-K
```

This is an excellent example of an invariant proving correctness while the heap controls memory.

---

## 35. AI: RAG Candidate Pipeline

A retrieval pipeline can maintain staged invariants:

```text
retrieval stage
→ candidate set satisfies retrieval contract
```

```text
filter stage
→ every candidate satisfies required metadata constraints
```

```text
reranking stage
→ ranking scores correspond to the same query/model/version
```

```text
final stage
→ output count and policy constraints are satisfied
```

Explicit invariants make multi-stage algorithmic pipelines easier to validate.

---

## 36. Potential Functions in Production Systems

Potential is not always literally memory or tokens.

It can represent:

- buffered work,
- queued tasks,
- accumulated credit,
- dirty records waiting for batch processing,
- cache state,
- deferred computation.

The engineering interpretation is:

> Cheap work can accumulate resources that pay for future expensive work.

This is why amortized reasoning appears naturally in real systems.

---

## 37. Common Mistakes

### Mistake 1 — Choosing a trivial invariant

True does not mean useful.

### Mistake 2 — Forgetting initialization

An invariant must hold before the first transition.

### Mistake 3 — Proving maintenance but not termination

A correct invariant can be preserved forever.

### Mistake 4 — Confusing amortized and average-case analysis

Amortized analysis is about operation sequences, not probability.

### Mistake 5 — Using a negative potential without accounting for the initial/final bound

Potential analysis requires careful global accounting.

### Mistake 6 — Claiming pruning is safe without proving it

“Obviously impossible” is not a proof.

### Mistake 7 — Mixing correctness and complexity arguments

They answer different questions.

### Mistake 8 — Ignoring representation invariants

Data structures can return wrong answers even when individual operations look plausible.

### Mistake 9 — Forgetting state restoration

Backtracking correctness depends on exact restoration.

### Mistake 10 — Treating production state transitions as informal

Retries, caches, queues, and rate limiters need explicit invariants.

---

## 38. Advanced Proof Workflow

For a new algorithm:

```text
1. Define the state.
2. Define the valid-state invariant.
3. Define the goal/postcondition.
4. Define transitions.
5. Prove initialization.
6. Prove maintenance.
7. Define a progress/ranking function.
8. Prove termination.
9. Prove the postcondition.
10. Identify repeated work.
11. Design optimization.
12. Prove optimization preserves correctness.
13. Analyze total cost.
14. Analyze peak memory.
15. Identify production failure modes.
```

This is a practical expert workflow.

---

## 39. Interview Proof Template

When asked “Why does this work?”:

```text
The invariant is ______.

It is true initially because ______.

Each iteration/transition preserves it because ______.

The progress measure is ______ and strictly moves toward termination.

When the algorithm terminates, the invariant plus the termination condition imply ______.

Therefore the algorithm satisfies the required postcondition.
```

For amortized analysis, add:

```text
The potential is Φ = ______.

The amortized cost is actual cost + ΔΦ.

Summing over the sequence gives ______.
```

---

## 40. Key Takeaways

1. Invariants describe what must remain true across state transitions.
2. A useful invariant should be strong enough to support the final proof.
3. Preconditions, invariants, and postconditions form a complete correctness framework.
4. Invariants do not automatically prove termination.
5. Ranking functions provide rigorous progress arguments.
6. Well-founded measures prevent infinite descent.
7. Backtracking requires soundness, completeness reasoning, and exact state restoration.
8. Safe pruning requires a proof that the removed branch cannot affect the required result/optimum.
9. Potential functions assign abstract stored credit to states.
10. Amortized cost can be expressed as actual cost plus change in potential.
11. Dynamic arrays, two-stack queues, monotonic stacks, and sliding windows benefit from potential/aggregate reasoning.
12. Correctness and complexity are separate proofs.
13. Data structures depend on representation invariants.
14. Backend rate limiters, queues, retries, and caches can be reasoned about as state machines with invariants.
15. AI beam search and Top-K retrieval also have explicit invariants.
16. Production-grade algorithm engineering is proof-driven state management plus cost reasoning.
17. Expert engineers can explain not only what an algorithm does, but why every transition is safe and why the resource bound holds.

---

## Revision Checklist

- [ ] I can design a useful loop invariant.
- [ ] I can prove initialization.
- [ ] I can prove invariant maintenance.
- [ ] I can connect termination to the postcondition.
- [ ] I can design a ranking function.
- [ ] I understand well-founded progress.
- [ ] I can reason about recursive termination.
- [ ] I can distinguish soundness and completeness.
- [ ] I can prove a pruning condition.
- [ ] I understand potential functions.
- [ ] I can derive amortized cost using potential.
- [ ] I understand dynamic-array amortization.
- [ ] I understand two-stack queue amortization.
- [ ] I understand monotonic-stack total-cost reasoning.
- [ ] I can use invariants to reason about heaps and caches.
- [ ] I can separate correctness from complexity proofs.
- [ ] I can model backend systems with explicit invariants.
- [ ] I can reason about AI beam-search and Top-K invariants.
- [ ] I can perform proof-driven optimization.
- [ ] I can explain an algorithm rigorously in an interview.
