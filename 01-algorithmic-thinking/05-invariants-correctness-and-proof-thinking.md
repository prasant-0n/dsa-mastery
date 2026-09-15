# 01.5 — Invariants, Correctness & Proof Thinking

> An algorithm is not mastered when you can run it successfully. You have mastered it when you can explain **why it must work**.

## Learning Objectives

By the end of this chapter, you should be able to:

- Define algorithmic correctness.
- Distinguish an invariant, precondition, postcondition, and termination argument.
- State what must remain true during a loop or recursive process.
- Use invariants to design algorithms instead of discovering correctness afterward.
- Prove simple algorithms informally and systematically.
- Reason about two pointers, binary search, prefix sums, recursion, and greedy-style state.
- Detect subtle bugs by identifying which invariant was violated.
- Explain correctness clearly in backend and AI engineering contexts.

---

## 1. Why Correctness Matters

An algorithm can be:

- fast but wrong,
- elegant but incomplete,
- correct for normal inputs but wrong on edge cases,
- correct for one implementation detail but wrong under its stated contract.

Complexity answers:

> **How much work does the algorithm perform?**

Correctness answers:

> **Does the algorithm always produce the required result when its assumptions hold?**

Expert algorithmic reasoning requires both.

```text
Correctness + Feasibility + Efficiency
                ↓
          Good algorithm
```

---

## 2. Algorithm Correctness

An algorithm is correct when, for every input satisfying its stated preconditions, it terminates and produces an output satisfying its postconditions.

This gives three questions:

1. **Precondition:** What must be true before execution?
2. **Progress / invariant:** What remains true during execution?
3. **Postcondition:** What is guaranteed when execution finishes?

And one additional requirement:

4. **Termination:** Why does the algorithm eventually stop?

```text
Precondition
     ↓
Algorithm
     ↓
Invariant maintained
     ↓
Termination
     ↓
Postcondition
```

---

## 3. Preconditions

A precondition describes assumptions about the input.

Examples:

### Binary search

```text
nums is sorted according to the search ordering
```

### Sliding window for sum <= limit

```text
nums contains non-negative values
```

### Heap operation

```text
The heap structure satisfies its heap property before the operation
```

A precondition is part of the algorithm's contract. If the caller violates it, correctness is no longer guaranteed unless the implementation explicitly handles that case.

---

## 4. Postconditions

A postcondition describes what must be true after the algorithm finishes.

Examples:

### Search

If the algorithm returns index `i`:

```text
nums[i] === target
```

If it returns `-1`:

```text
target does not occur in the searched region
```

### Maximum

If `maxValue` is returned:

```text
maxValue >= every element in the input
```

### Sorting

After sorting:

```text
nums[i] <= nums[i + 1]
```

for every valid adjacent pair, and the output contains the same elements as the input according to the sorting contract.

---

## 5. What Is an Invariant?

An **invariant** is a property that remains true at a defined point throughout an algorithm's execution.

The phrase “remains true” is important.

An invariant is not merely an observation about one example.

It is a statement that must hold for **every iteration or recursive state** where the invariant is defined.

Example:

```js
let sum = 0;

for (let i = 0; i < nums.length; i++) {
  sum += nums[i];
}
```

A useful invariant at the start of each iteration is:

> `sum` equals the sum of all elements in `nums[0 ... i - 1]`.

That statement lets us reason about the algorithm without mentally executing every possible input.

---

## 6. Loop Invariant Proof Structure

A classic loop-invariant proof has three parts:

### 6.1 Initialization

Show the invariant is true before the first iteration.

### 6.2 Maintenance

Assume it is true before an iteration. Show that executing the loop body preserves it.

### 6.3 Termination

When the loop ends, combine the invariant with the termination condition to prove the required result.

```text
Initialization
      ↓
Invariant true
      ↓
Maintenance
      ↓
Invariant still true
      ↓
...
      ↓
Termination
      ↓
Invariant + exit condition
      ↓
Postcondition
```

This is one of the most useful proof techniques in DSA.

---

## 7. Example — Maximum Element

```js
function maxValue(nums) {
  if (nums.length === 0) return undefined;

  let max = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) {
      max = nums[i];
    }
  }

  return max;
}
```

### Precondition

The input is an array. The empty-array behavior is explicitly defined as `undefined`.

### Invariant

At the start of iteration `i`:

> `max` is the maximum value among `nums[0 ... i - 1]`.

### Initialization

Before the first iteration, `i = 1` and `max = nums[0]`.

Therefore `max` is the maximum of the processed region.

### Maintenance

For `nums[i]`:

- If it is larger than `max`, update `max`.
- Otherwise retain `max`.

Therefore `max` remains the maximum of the processed region.

### Termination

When `i === nums.length`, the processed region is the entire array.

Therefore `max` is the maximum element.

---

## 8. Invariants Are Design Tools

Do not wait until after coding to invent an invariant.

A stronger workflow is:

```text
Define desired result
       ↓
Define useful state
       ↓
State what that state means
       ↓
Choose operations that preserve the meaning
       ↓
Implement
```

For example, if you say:

> “`seen` contains exactly the values processed so far.”

then adding a value to `seen` only when it has actually been processed follows naturally.

The invariant becomes a design constraint.

---

## 9. Two-Pointer Invariants

Consider a sorted array where we search for a pair whose sum equals `target`.

```text
left →
← right
```

At every step, the invariant can be stated as:

> Every pair already eliminated cannot be a valid solution under the sorted-order property.

If:

```text
nums[left] + nums[right] < target
```

then every index below `right` produces an even smaller or equal sum with `nums[left]`.

Therefore `left` can move right.

If the sum is too large, `right` can move left.

The correctness comes from the **ordering invariant**, not from the syntax of two pointers.

---

## 10. Binary Search Invariant

Binary search is frequently implemented incorrectly because people memorize the loop rather than the invariant.

One useful formulation is:

> If the target exists, it is contained within the current search interval `[left, right]`.

Every iteration must preserve this statement.

If `nums[mid] < target`, then the target cannot be at `mid` or anywhere to its left under sorted ordering.

Therefore:

```text
left = mid + 1
```

If `nums[mid] > target`:

```text
right = mid - 1
```

The algorithm is correct because each update preserves the candidate-region invariant while shrinking the search space.

---

## 11. Prefix Sum Invariant

Suppose:

```js
prefix[i + 1] = prefix[i] + nums[i];
```

A useful invariant is:

> `prefix[i]` equals the sum of the first `i` elements of `nums`.

Then:

```text
sum(left, right)
= prefix[right + 1] - prefix[left]
```

Correctness follows directly from the meaning maintained by the prefix array.

---

## 12. Sliding Window Invariant

For a non-negative array and a window whose sum must remain `<= limit`, a useful invariant is:

> Before evaluating the next expansion, the current window satisfies the required sum constraint.

When adding a new right element makes the window invalid, move `left` until the constraint is restored.

Why does this work?

Because non-negative values provide the required monotonic behavior:

```text
Expanding → sum cannot decrease
Shrinking  → sum cannot increase
```

Without this property, the same proof does not automatically hold.

This is why blindly applying sliding window is dangerous.

---

## 13. Recursive Correctness

Recursion needs a different but related proof structure.

For a recursive function:

1. Prove the base case is correct.
2. Assume the recursive call correctly solves the smaller problem.
3. Prove the current function transforms that smaller result into the correct solution for the current problem.
4. Prove each call moves toward a base case.

This is essentially **mathematical induction expressed through program structure**.

---

## 14. Example — Recursive Sum

```js
function sumTo(n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1);
}
```

### Base case

For `n <= 0`, returning `0` matches the chosen definition.

### Inductive assumption

Assume:

```text
sumTo(n - 1) = 1 + 2 + ... + (n - 1)
```

### Recursive step

The function returns:

```text
n + sumTo(n - 1)
```

Therefore:

```text
n + 1 + 2 + ... + (n - 1)
= 1 + 2 + ... + n
```

### Progress

`n` decreases on every call, so the recursion moves toward the base case.

---

## 15. Termination Is Part of Correctness

A function that returns the correct result eventually but never terminates is not a correct algorithm.

Every algorithm should have a progress argument.

Examples:

### Forward loop

```text
i increases toward n
```

### Reverse loop

```text
i decreases toward -1
```

### Binary search

```text
search interval strictly shrinks
```

### Recursion

```text
problem size decreases toward base case
```

### Backtracking

```text
finite decision tree is explored
```

A useful question is:

> What quantity is moving toward a terminal state?

---

## 16. Variant Functions / Progress Measures

A **variant** or progress measure is a quantity that moves monotonically toward termination.

Examples:

```text
remaining elements
remaining search interval
remaining recursion depth
number of unresolved choices
```

For binary search:

```text
right - left
```

should strictly decrease after each non-terminal iteration.

This gives a clean termination argument.

---

## 17. Correctness and Edge Cases

Edge cases are not separate from correctness.

They are inputs that test whether your stated contract actually holds at the boundaries.

Examples:

- empty array,
- one element,
- duplicate values,
- all values equal,
- negative values,
- target absent,
- target at first/last position,
- already sorted input,
- reverse-sorted input,
- maximum/minimum numeric boundaries.

Instead of memorizing edge cases, ask:

> Which assumption becomes weakest at the boundary?

---

## 18. Finding Bugs Through Invariants

Consider:

```js
function removeEvens(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      nums.splice(i, 1);
    }
  }

  return nums;
}
```

A deletion changes later indices.

If the algorithm increments `i` immediately after deletion, the next element shifts into the current position and may never be examined.

The problem can be exposed by asking:

> What does `i` mean after a deletion?

The intended invariant is no longer preserved.

This is a powerful debugging technique:

```text
Bug
 ↓
State meaning becomes false
 ↓
Invariant violated
 ↓
Find the operation that broke it
```

---

## 19. Correctness of Hash-Based Lookup

Suppose `seen` stores every value processed before the current element.

Invariant:

> `seen` contains exactly the relevant previously processed values.

At each element:

1. Check whether the required value is already in `seen`.
2. If yes, the required pair exists.
3. If no, add the current value.

The correctness argument depends on preserving the meaning of `seen`.

The data structure itself does not prove correctness. The invariant describing its contents does.

---

## 20. Correctness vs Complexity

Two algorithms can both be correct while having radically different efficiency.

```text
Algorithm A
Correct: yes
Time:    O(n²)

Algorithm B
Correct: yes
Time:    O(n)
```

Correctness should generally be established before optimization.

Then optimization must preserve the contract.

```text
Correct baseline
      ↓
Optimization
      ↓
Same preconditions
      ↓
Same postconditions
      ↓
Lower cost
```

---

## 21. Proof Obligations for Common Patterns

| Pattern | Important proof question |
|---|---|
| Linear scan | What does processed state mean? |
| Two pointers | Why can a pointer move without losing a solution? |
| Sliding window | Why can the window be expanded/shrunk safely? |
| Binary search | Why can the eliminated half be discarded? |
| Hashing | What exactly does the lookup structure contain? |
| Prefix sums | What does each prefix entry represent? |
| Heap | What property does the heap maintain? |
| Recursion | Why is the smaller problem sufficient? |
| Memoization | Why are identical subproblems interchangeable? |
| Backtracking | Why is pruning a branch safe? |
| Greedy | Why is the local choice compatible with an optimal solution? |
| Graph traversal | What has been visited and why is revisiting unnecessary? |

---

## 22. Heap Invariant

For a min-heap:

> Every parent value is less than or equal to its children according to the heap ordering.

That invariant explains why the root is always the minimum element.

When inserting:

```text
append new value
↓
bubble upward
↓
restore heap property
```

When removing the root:

```text
move last value to root
↓
bubble downward
↓
restore heap property
```

The implementation is correct if every operation preserves the heap invariant.

---

## 23. Graph Traversal Invariant

For a typical BFS/DFS traversal:

> Every vertex marked `visited` has already been discovered according to the traversal's rules.

For BFS specifically, an additional useful property is that vertices are discovered in nondecreasing distance from the source in an unweighted graph.

The `visited` structure prevents repeated exploration and ensures the traversal remains finite on a finite graph.

---

## 24. Greedy Algorithms Require Stronger Proofs

A greedy algorithm repeatedly makes a locally attractive choice.

That alone does **not** prove correctness.

You must show why the local choice can participate in an optimal global solution.

Common proof ideas include:

- exchange argument,
- staying-ahead argument,
- cut/property argument,
- greedy-choice property.

This becomes important later in Phase 15.

The key warning is:

> “It seems optimal” is not a proof.

---

## 25. Proof Thinking for AI Algorithms

AI infrastructure also contains algorithmic invariants.

### Vector retrieval

A retrieval structure may maintain an index invariant describing which vectors belong to which searchable region.

### Ranking

A Top-K structure maintains an invariant about which candidates currently belong to the retained set.

### Batching

A batch-processing pipeline maintains invariants about which records are processed, pending, acknowledged, or retried.

### Deduplication

A deduplication structure maintains an invariant such as:

> Every retained identifier represents a record not previously accepted under the deduplication policy.

Correctness matters even when the system is probabilistic or approximate. Approximation changes the contract; it does not eliminate the need for one.

---

## 26. Backend Engineering and Invariants

Production systems are full of state invariants.

Examples:

### Cache

```text
If an entry is in the index, its corresponding cache node exists.
```

### LRU cache

```text
Every cached key maps to exactly one node.
The linked list represents recency order.
```

### Rate limiter

```text
The stored counter/window state represents the accepted
request history according to the configured policy.
```

### Queue

```text
Every dequeued item was previously enqueued and has not already been dequeued.
```

### Job scheduler

```text
A completed job cannot remain in the pending set.
```

Algorithmic invariants are therefore not merely interview theory. They are a foundation for maintaining correct state in real systems.

---

## 27. A Practical Proof Template

For every non-trivial algorithm, write:

```markdown
## Correctness

### Precondition
...

### Invariant
...

### Initialization
...

### Maintenance
...

### Termination
...

### Postcondition
...
```

For recursive algorithms:

```markdown
### Base Case
...

### Recursive Assumption
...

### Recursive Step
...

### Progress Toward Base Case
...
```

For greedy algorithms, add:

```markdown
### Why the Greedy Choice Is Safe
...
```

---

## 28. How to Discover an Invariant

When you do not know the invariant, use this process:

1. Identify what the algorithm has already processed.
2. Ask what information the current variables summarize.
3. Write that meaning as a complete sentence.
4. Test the sentence before the first iteration.
5. Test it after one iteration.
6. Test it after a difficult iteration.
7. Determine what operation preserves it.
8. Determine what it implies when the algorithm terminates.

Example:

Instead of:

> “`i` is the loop index.”

write:

> “Before iteration `i`, every element before index `i` has already been processed, and `max` is the largest among those processed elements.”

That statement contains useful semantic information.

---

## 29. Proof Is Not Formal Mathematics Every Time

For everyday DSA, correctness explanations can be informal but rigorous.

You do not need symbolic logic for every array loop.

A good explanation should be:

- precise,
- complete enough to cover all cases,
- based on the algorithm's maintained state,
- connected to the final result.

The goal is not to sound mathematical.

The goal is to eliminate hidden assumptions.

---

## 30. Common Mistakes

### Mistake 1 — Saying “it works” because examples pass

Examples do not establish correctness for all valid inputs.

### Mistake 2 — Giving complexity instead of a proof

O(n) tells you cost, not correctness.

### Mistake 3 — Using an invariant that is too weak

“Some values have been processed” is usually not enough.

State exactly what has been processed and what the stored variables mean.

### Mistake 4 — Forgetting initialization

An invariant that becomes true only after several iterations cannot prove the first iteration.

### Mistake 5 — Forgetting termination

A shrinking search region or decreasing problem size should be explicit.

### Mistake 6 — Applying a pattern without its assumptions

Two pointers, sliding window, and greedy algorithms all require specific structural properties.

### Mistake 7 — Confusing implementation details with correctness

The invariant should describe semantic state, not merely syntax.

---

## 31. DSA Mental Model

When writing an algorithm, think:

```text
What must be true before I start?
        ↓
What does my state mean?
        ↓
What must remain true after every step?
        ↓
What operation preserves that meaning?
        ↓
What gets smaller / closer to completion?
        ↓
What does the invariant tell me when I stop?
        ↓
Does that prove the required result?
```

This turns coding from trial-and-error into reasoning.

---

## 32. Interview Explanation Template

When asked, “Why does your algorithm work?” answer:

1. **State the invariant.**
2. **Explain initialization.**
3. **Explain why each update preserves it.**
4. **Explain why the algorithm terminates.**
5. **Connect the final invariant to the required answer.**
6. **Then give complexity.**

Example:

> “At the start of each iteration, `max` is the largest value among all elements processed so far. Initially that is true because only the first element has been processed. Each new value either becomes the new maximum or leaves the current maximum unchanged, so the invariant remains true. When the loop finishes, every element has been processed, so `max` is the maximum of the entire array. The algorithm takes O(n) time and O(1) auxiliary space.”

That is much stronger than:

> “We loop through the array and keep the biggest value.”

---

## 33. Key Takeaways

1. Correctness and efficiency are separate dimensions.
2. Preconditions define the assumptions under which an algorithm is valid.
3. Postconditions define the required result.
4. Invariants describe what remains true during execution.
5. Loop correctness can be reasoned about through initialization, maintenance, and termination.
6. Recursive correctness follows base case, recursive assumption, recursive step, and progress.
7. A termination argument is part of correctness.
8. Two pointers work because pointer movement preserves a correctness argument.
9. Binary search works because its candidate-region invariant is preserved while the region shrinks.
10. Sliding-window correctness depends on the problem's monotonic structure.
11. Data structures are useful partly because their invariants guarantee useful operations.
12. Invariants are design tools, not merely proof tools.
13. Many backend bugs are invariant violations in disguise.
14. AI systems also require explicit contracts and invariants, even when algorithms are approximate.
15. “It works on my examples” is not a correctness proof.
16. Expert DSA means being able to explain **why** an algorithm must work.

---

## Self-Check

Answer these without notes:

1. What is an invariant?
2. What is the difference between a precondition and a postcondition?
3. What are initialization, maintenance, and termination?
4. State an invariant for a maximum-element scan.
5. State the candidate-region invariant for binary search.
6. Why does a two-pointer move preserve correctness on a sorted array?
7. Why does sliding window often require non-negative values?
8. How do you prove a recursive algorithm correct?
9. What is a progress measure?
10. How can an invariant expose an array-deletion bug?
11. What invariant does a min-heap maintain?
12. Why is “the greedy choice looks best” not a proof?
13. Give one backend system invariant.
14. Give one AI retrieval invariant.
15. Can you explain one of your optimized solutions using precondition → invariant → termination → postcondition?
