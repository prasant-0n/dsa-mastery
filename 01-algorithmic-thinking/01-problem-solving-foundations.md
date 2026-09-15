# 01.1 — Problem-Solving Foundations

## 1. What Is Algorithmic Thinking?

Algorithmic thinking is the ability to transform a problem into a precise sequence of operations that can be executed correctly and efficiently.

It is different from simply knowing syntax or data structures.

The core skill is:

```text
Problem
  ↓
Understand
  ↓
Model
  ↓
Decompose
  ↓
Choose strategy
  ↓
Implement
  ↓
Verify
  ↓
Analyze
  ↓
Improve
```

A strong DSA engineer does not immediately ask:

> "Which data structure should I use?"

First ask:

> "What exactly is the computational problem?"

---

## 2. Problem Statement → Contract

Before solving a problem, convert the statement into a contract.

Identify:

- inputs
- outputs
- constraints
- valid input domain
- required behavior
- ordering requirements
- uniqueness requirements
- mutation requirements
- error/invalid-input behavior

Example:

```text
Input:
array of integers + target integer

Output:
index of target's first occurrence, or -1

Requirement:
return the smallest valid index
```

A vague problem statement becomes a precise computational contract.

---

## 3. Constraints Are Clues

Constraints are not administrative details. They often reveal the intended algorithm.

Suppose:

```text
n ≤ 20
```

An exponential or combinatorial solution may be acceptable.

Suppose:

```text
n ≤ 10^5
```

An `O(n²)` solution is usually suspicious.

Suppose:

```text
array is sorted
```

That is a major algorithmic clue.

Suppose:

```text
values arrive continuously
```

Streaming or online processing may be relevant.

Always translate constraints into computational requirements.

---

## 4. Input Size Changes the Strategy

A rough first filter:

| Input size | Often reasonable |
|---|---|
| `n ≤ 10` | brute force / exponential may work |
| `n ≤ 20` | exponential may sometimes work |
| `n ≤ 10²` | `O(n²)` often practical |
| `n ≤ 10³` | `O(n²)` may be possible |
| `n ≤ 10⁵` | usually `O(n log n)` or `O(n)` |
| `n ≤ 10⁶` | usually near-linear and memory-conscious |
| very large / streaming | online, indexed, batched, or approximate methods may be needed |

These are heuristics, not laws.

Actual runtime depends on constants, hardware, language, memory access, and the operation being performed.

---

## 5. Decompose the Problem

Large problems should be divided into smaller responsibilities.

Example:

```text
Find the most frequent value in an array
```

Decompose:

```text
1. Traverse the input
2. Count each value
3. Track the best candidate
4. Return the result
```

Then ask whether the counting step can be implemented efficiently.

This naturally leads toward frequency maps.

---

## 6. Identify the Computational Shape

Before choosing a specific algorithm, classify the problem.

Common shapes include:

```text
Traversal
Search
Counting
Filtering
Aggregation
Ordering
Matching
Pairing
Range query
Prefix/suffix computation
Recursive decomposition
Graph traversal
Optimization
State-space exploration
```

Recognizing the shape is more valuable than memorizing isolated solutions.

---

## 7. Brute Force Is the Baseline

A brute-force solution directly explores the obvious possibilities.

Example: find whether an array contains a duplicate.

Brute force:

```text
compare every pair
```

Complexity:

```text
O(n²)
```

The brute-force solution is valuable because it gives us:

- a correctness baseline
- a starting implementation
- a reference for testing optimized solutions
- insight into what repeated work exists

Do not skip brute force mentally even when you know an optimization.

---

## 8. Optimization Means Removing Repeated Work

A large fraction of DSA optimization can be understood as:

> Do not repeatedly compute information that can be stored, reused, ordered, or incrementally maintained.

Examples:

```text
Repeated lookup
→ hash table

Repeated range sum
→ prefix sum

Repeated minimum extraction
→ heap

Repeated search in sorted data
→ binary search

Repeated overlapping subproblems
→ memoization / DP

Repeated nearest-neighbor search
→ specialized indexing
```

This is one of the most important algorithmic instincts to develop.

---

## 9. Ask What Information Must Be Remembered

When optimizing, ask:

> "What information from the past would make the next operation cheaper?"

Examples:

```text
Need to know whether value appeared?
→ Set

Need frequency?
→ Map

Need most recent position?
→ Map<value, index>

Need minimum among active values?
→ heap

Need previous cumulative total?
→ prefix state
```

The data structure is often a representation of the information the algorithm needs to remember.

---

## 10. Invariants

An invariant is a statement that remains true throughout an algorithm.

Example: finding a maximum value while traversing an array.

Invariant:

> After processing index `i`, `max` contains the maximum value among all processed elements.

Invariants help prove correctness.

For two pointers:

> All positions outside the active search range have already been resolved.

For binary search:

> If the target exists, it remains inside the current search interval.

Learning to state invariants explicitly is a major step toward expert-level DSA reasoning.

---

## 11. Correctness Before Optimization

Use this order:

```text
Can I describe the algorithm?
        ↓
Can I prove it produces the required result?
        ↓
Can I analyze its complexity?
        ↓
Can I optimize the bottleneck?
```

A fast incorrect algorithm is still incorrect.

Optimization should preserve the problem contract.

---

## 12. Edge Cases

Before implementation, deliberately test boundary conditions.

Common categories:

```text
empty input
single element
minimum allowed input
maximum allowed input
duplicate values
all values equal
already sorted input
reverse sorted input
negative values
zero
missing target
multiple valid answers
```

Do not treat edge cases as an afterthought.

They are part of the algorithm's contract.

---

## 13. Example: Duplicate Detection

Problem:

> Determine whether an array contains a duplicate value.

### Brute Force

Compare every pair.

```text
for i
    for j > i
        compare arr[i] and arr[j]
```

Time:

```text
O(n²)
```

Space:

```text
O(1)
```

### Optimization

Ask:

> What information should be remembered?

We only need to know whether a value has appeared before.

Use a `Set`.

```js
function hasDuplicate(values) {
    const seen = new Set();

    for (const value of values) {
        if (seen.has(value)) {
            return true;
        }

        seen.add(value);
    }

    return false;
}
```

Complexity:

```text
Expected time: O(n)
Auxiliary space: O(n)
```

The optimization came from changing what information is retained.

---

## 14. Early Exit

If the answer becomes known before processing the entire input, stop.

Example:

```js
function containsZero(values) {
    for (const value of values) {
        if (value === 0) {
            return true;
        }
    }

    return false;
}
```

Best case:

```text
O(1)
```

Worst case:

```text
O(n)
```

Early exit improves actual work but does not automatically change worst-case Big-O complexity.

---

## 15. Separate Search Space From Work

When analyzing an algorithm, distinguish:

```text
How many candidates exist?
How much work is performed for each candidate?
```

For nested loops:

```text
number of iterations × work per iteration
```

For recursive algorithms:

```text
number of recursive calls
×
work per call
```

This habit prevents many complexity mistakes.

---

## 16. Representation Changes the Algorithm

The same information can be represented differently.

Example:

```text
Array
→ ordered sequence

Set
→ membership

Map
→ key → value association

Heap
→ highest/lowest priority

Tree
→ hierarchical relationships

Graph
→ arbitrary relationships
```

Choosing a representation changes what operations are cheap.

This is why data structures and algorithms must be learned together.

---

## 17. Time vs Space Trade-Off

Optimization often trades memory for speed.

Example:

```text
Brute force duplicate detection
Time:  O(n²)
Space: O(1)

Set-based duplicate detection
Time:  O(n)
Space: O(n)
```

The correct choice depends on the system constraints.

In backend engineering, memory pressure can be as important as CPU time.

---

## 18. Production Thinking

A DSA solution does not exist in isolation in production.

Consider:

- input size
- latency target
- memory budget
- concurrency
- allocation behavior
- data distribution
- worst-case behavior
- streaming vs batch processing
- failure behavior
- observability
- maintainability

A theoretically optimal algorithm can still be a poor production choice if its constants, memory behavior, or operational complexity are unsuitable.

---

## 19. Backend Connection

Algorithmic thinking directly appears in backend systems:

```text
request
  ↓
validate
  ↓
identify computational task
  ↓
choose representation
  ↓
process efficiently
  ↓
return result
```

Examples:

- deduplicating events
- pagination
- caching
- rate limiting
- top-K queries
- log processing
- batching
- scheduling
- indexing
- search

---

## 20. AI Connection

AI systems are also algorithmic systems.

Examples:

```text
embedding retrieval
→ nearest-neighbor search

RAG retrieval
→ search + ranking

recommendation
→ candidate generation + ranking

training pipeline
→ batching + streaming + aggregation

data preprocessing
→ transformation + filtering + deduplication
```

The same fundamental questions apply:

> What must be computed?

> What information should be retained?

> What work is repeated?

> What constraints dominate?

---

## 21. Problem-Solving Checklist

Before coding:

```text
[ ] What exactly is the input?
[ ] What exactly is the output?
[ ] What are the constraints?
[ ] What are the edge cases?
[ ] What is the simplest correct solution?
[ ] What is its complexity?
[ ] What work is repeated?
[ ] What information could be remembered?
[ ] Is the input ordered?
[ ] Can I stop early?
[ ] What invariant can I maintain?
[ ] What trade-off am I making?
```

After coding:

```text
[ ] Test normal cases
[ ] Test edge cases
[ ] Verify correctness
[ ] Derive time complexity
[ ] Derive space complexity
[ ] Look for unnecessary work
[ ] Explain the solution without code
[ ] Solve a variation
```

---

## 22. Key Takeaways

1. Algorithmic thinking starts with the problem, not the data structure.
2. Constraints are clues about feasible algorithms.
3. Brute force provides a correctness baseline.
4. Optimization often means removing repeated work.
5. Data structures represent information the algorithm needs to remember.
6. Invariants help establish correctness.
7. Edge cases are part of the contract.
8. Time and space must be analyzed together.
9. Production algorithm choices include operational constraints beyond Big-O.
10. Expert DSA skill comes from deriving strategies, not memorizing solutions.

---

## 23. Self-Check

- [ ] I can convert a problem statement into an input/output contract.
- [ ] I can extract algorithmic clues from constraints.
- [ ] I can derive a brute-force approach before optimizing.
- [ ] I can identify repeated work.
- [ ] I can explain what information should be remembered.
- [ ] I can state an invariant for a simple algorithm.
- [ ] I can compare time/space trade-offs.
- [ ] I can distinguish best-case from worst-case complexity.
- [ ] I can reason about production constraints beyond Big-O.
