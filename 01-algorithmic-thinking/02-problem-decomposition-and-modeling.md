# 01.2 — Problem Decomposition & Computational Modeling

## 1. Why This Skill Matters

Many difficult DSA problems are not difficult because of syntax. They are difficult because the original problem is too large or vague to reason about directly.

Problem decomposition converts:

```text
large / vague problem
        ↓
smaller precise subproblems
        ↓
relationships between subproblems
        ↓
computational model
        ↓
algorithm
```

Expert problem solving begins before code.

---

## 2. From Story to Computation

Interview and production problems are often presented as stories.

Example:

> A service receives user events and must determine whether an event has already been processed.

Strip away the story:

```text
Input:
sequence of event IDs

Task:
detect whether an ID has appeared before

Required operation:
membership lookup
```

Now the computational shape is obvious:

```text
Set / hash-based membership
```

The first job is to remove irrelevant narrative detail.

---

## 3. Identify Entities and Relationships

Ask:

```text
What things exist?
What properties do they have?
How are they related?
What changes?
What must be preserved?
```

Example: social network friend suggestions.

Entities:

```text
users
connections
```

Relationship:

```text
user A ↔ user B
```

Now the problem may be modeled as a graph rather than an array.

This is the bridge between problem statements and data structures.

---

## 4. Identify Operations

Do not only identify the data.

Identify what operations the algorithm repeatedly needs.

Examples:

| Required operation | Natural representation |
|---|---|
| indexed access | array |
| membership | Set |
| key lookup | Map |
| minimum/maximum priority | heap |
| ordered search | sorted array / tree |
| hierarchy | tree |
| arbitrary relationships | graph |
| prefix lookup | trie |
| range aggregation | prefix structure / tree-based structure |

The correct structure depends on required operations, not on the data's name.

---

## 5. Define the State

State is the minimum information needed to describe the current progress of the algorithm.

For linear traversal:

```text
index
current best
accumulated result
```

For two pointers:

```text
left
right
```

For binary search:

```text
left
right
mid
```

For backtracking:

```text
current choice
remaining choices
partial solution
```

For dynamic programming:

```text
state variables
that uniquely describe the remaining decision problem
```

A major expert skill is finding the smallest sufficient state.

---

## 6. Separate Input State From Algorithm State

The input is not necessarily the complete state of the algorithm.

Example:

```js
function maxValue(values) {
    let best = -Infinity;

    for (const value of values) {
        best = Math.max(best, value);
    }

    return best;
}
```

Input state:

```text
values
```

Algorithm state:

```text
best
current position
```

This distinction becomes increasingly important in graph algorithms, dynamic programming, and state-space search.

---

## 7. Define the Goal Precisely

Avoid vague goals such as:

```text
"find the best answer"
"process the data"
"make it fast"
```

Translate them into precise conditions.

Example:

```text
Find the smallest index i such that values[i] === target.
```

Now correctness can be tested directly.

---

## 8. Decompose by Responsibility

A useful decomposition technique is to assign one responsibility to each step.

Example: top-K frequent values.

```text
1. Count frequencies
2. Determine which values are candidates
3. Maintain only the best K candidates
4. Produce required ordering
```

This reveals possible strategies:

```text
frequency map
+
heap / sorting / selection
```

The decomposition exposes the algorithmic components.

---

## 9. Decompose by Constraints

Sometimes constraints determine the decomposition.

Suppose:

```text
n = 10^7
memory is limited
input arrives as a stream
```

A solution that loads and sorts everything may be inappropriate.

Decompose instead into:

```text
read chunk
→ process
→ retain necessary state
→ discard unnecessary data
→ continue
```

This is algorithmic thinking for real systems.

---

## 10. Find the Bottleneck

Not every operation needs optimization.

Suppose an algorithm does:

```text
O(n)
+
O(n²)
+
O(n)
```

The dominant component is:

```text
O(n²)
```

Focus optimization effort there first.

Do not make every line clever when one structural operation dominates the runtime.

---

## 11. Identify Repeated Work

Ask:

> What am I calculating more than once?

Example:

```text
For every pair of users,
recompute whether they share a friend.
```

Potential decomposition:

```text
precompute friend membership
→ answer repeated queries cheaply
```

This leads to the broader optimization pattern:

```text
recompute
→ remember
→ reuse
```

This pattern appears throughout DSA.

---

## 12. Model the Search Space

Many problems are really about exploring a set of possible states.

Examples:

```text
binary search
→ ordered interval

backtracking
→ decision tree

BFS
→ graph layers

DFS
→ graph/tree paths

DP
→ state space with overlapping subproblems
```

Ask:

```text
What are the possible states?
What transitions are allowed?
Which states are reachable?
Which states can be eliminated?
```

This is a powerful bridge toward advanced algorithms.

---

## 13. Eliminate Impossible States

Optimization often comes from proving that certain possibilities cannot contain the answer.

Examples:

### Binary Search

If the target is greater than the middle value in a sorted array:

```text
left half is impossible
```

### Two Pointers

A monotonic relationship can eliminate many pairs at once.

### Dynamic Programming

Previously solved states eliminate repeated computation.

### Branch and Bound

A bound can eliminate branches that cannot improve the answer.

A central question is:

> What can I prove I do not need to examine?

---

## 14. Choose the Smallest Useful Model

Do not model more information than necessary.

If the problem only asks:

```text
Have I seen this value?
```

You may need:

```text
Set<value>
```

Not:

```text
Map<value, complete historical record>
```

Extra state can increase:

- memory
- complexity
- implementation risk
- synchronization requirements

Minimal sufficient state is usually easier to reason about.

---

## 15. Example — Two Sum

Problem:

> Given an array and target, find two values whose sum equals the target.

### Naive model

Generate all pairs:

```text
(i, j), where i < j
```

Then test:

```text
values[i] + values[j] === target
```

Complexity:

```text
O(n²)
```

### Decomposition

For current value `x`, we need:

```text
target - x
```

So the problem becomes:

```text
for each x:
    check whether complement was seen
```

Required operation:

```text
membership lookup
```

Representation:

```text
Set
```

This gives an expected `O(n)` solution.

The optimization came from modeling the relationship between the current value and the required complement.

---

## 16. Example — Nested Data

Suppose a backend receives:

```js
const data = {
    users: [
        { name: 'A', orders: [{ total: 100 }] },
        { name: 'B', orders: [{ total: 250 }] }
    ]
};
```

Question:

> Calculate the total value of every order regardless of nesting depth.

The computational model is not simply "loop through an object."

It is:

```text
node
├── primitive
├── array
└── object
```

Then recursively:

```text
if primitive number → aggregate
if array → process each element
if object → process each property
```

The data model determines the traversal strategy.

---

## 17. Preconditions and Postconditions

A useful correctness technique is to define:

### Preconditions

What must be true before the algorithm begins?

Example:

```text
binary search requires sorted input
```

### Postconditions

What must be true when it finishes?

Example:

```text
returned index points to target
or no valid target exists
```

This makes hidden assumptions explicit.

---

## 18. Invariants as the Bridge

Decomposition tells us what the pieces are.

Invariants tell us what remains true while those pieces execute.

Example: two-pointer search.

```text
Before each iteration:
all discarded regions have already been proven unable to contain a valid answer.
```

That statement explains why shrinking the search space is safe.

---

## 19. Recursive Decomposition

Recursion is another decomposition mechanism.

Instead of solving:

```text
problem of size n
```

directly, define:

```text
problem of size n
→ current work
+ problem of smaller size
```

For factorial:

```text
factorial(n)
= n × factorial(n - 1)
```

For binary search:

```text
search current midpoint
→ recursively search one remaining half
```

The recursive definition is itself a computational model.

---

## 20. Model Transformations

Sometimes the key insight is to transform the problem into an easier representation.

Examples:

```text
array → frequency map
string → character frequencies
matrix → graph
intervals → sorted endpoints
problem → state graph
text → tokens
vectors → indexed search structure
```

Ask:

> What representation makes the required operation cheap?

This question is one of the highest-value habits in DSA.

---

## 21. Backend Engineering Connection

Backend problems frequently require decomposition across system boundaries.

Example: request deduplication.

```text
request
 ↓
extract idempotency key
 ↓
check existing state
 ↓
if known → reuse result
 ↓
otherwise process
 ↓
store result
```

This is both software decomposition and algorithmic decomposition.

The same thinking applies to:

- queues
- rate limiters
- caches
- pagination
- batch jobs
- event processing
- search endpoints
- ranking pipelines

---

## 22. AI Engineering Connection

AI pipelines are naturally decomposable.

Example retrieval:

```text
query
 ↓
normalize
 ↓
encode
 ↓
candidate retrieval
 ↓
filter
 ↓
rank
 ↓
rerank
 ↓
return top K
```

Each stage has its own computational model and bottleneck.

At scale, decomposition allows independent optimization of retrieval, ranking, memory, latency, and batching.

---

## 23. A Reusable Modeling Template

For every new problem, write:

```text
Problem:

Goal:

Inputs:

Outputs:

Constraints:

Entities:

Relationships:

Required operations:

State:

Search space:

Brute force:

Repeated work:

Optimization opportunity:

Chosen representation:

Invariant:

Termination condition:

Complexity target:
```

Do this before implementation for unfamiliar problems.

---

## 24. Common Mistakes

- Coding before understanding the contract.
- Choosing a data structure before identifying required operations.
- Modeling the story instead of the computation.
- Tracking unnecessary state.
- Ignoring constraints.
- Optimizing a non-bottleneck.
- Failing to identify repeated work.
- Assuming every problem needs a sophisticated data structure.
- Ignoring ordering or uniqueness properties in the input.
- Using recursion without defining the smaller subproblem.
- Treating implementation difficulty as algorithmic difficulty.

---

## 25. Key Takeaways

1. Strip narrative away and expose the computational task.
2. Identify entities, relationships, operations, and constraints.
3. Define the smallest sufficient state.
4. Start with a simple correct model.
5. Find repeated work and bottlenecks.
6. Ask what states can be eliminated safely.
7. Choose representations based on required operations.
8. Use invariants to connect decomposition to correctness.
9. Transform representations when the new form makes computation cheaper.
10. Good algorithm design begins with a good computational model.

---

## 26. Self-Check

- [ ] I can turn a story-based problem into a computational problem.
- [ ] I can identify entities and relationships.
- [ ] I can list the operations the algorithm needs.
- [ ] I can define minimal algorithm state.
- [ ] I can identify the search space.
- [ ] I can identify repeated work.
- [ ] I can identify the dominant bottleneck.
- [ ] I can describe what states can be eliminated.
- [ ] I can transform a problem into a more useful representation.
- [ ] I can write preconditions, postconditions, and invariants.
- [ ] I can model a problem before writing code.
