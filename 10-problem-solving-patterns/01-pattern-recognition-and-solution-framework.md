# 10.01 — Pattern Recognition & the Problem-Solving Framework

## 1. Objective

Phase 10 shifts from learning isolated algorithms to recognizing reusable structures in unfamiliar problems.

The core skill is:

```text
Understand → Model → Recognize → Derive → Prove → Implement → Analyze → Test
```

## 2. What Is a Problem-Solving Pattern?

A pattern is a reusable relationship between:

- input structure;
- constraints;
- required output;
- state that must be maintained;
- operations that change that state.

A pattern is **not** a memorized code template.

## 3. Why Pattern Recognition Matters

Interview and production problems are often presented in unfamiliar language.

The underlying structure may still resemble:

- two pointers;
- sliding window;
- prefix/suffix state;
- hashing;
- binary search on a monotone condition;
- stack/monotonic stack;
- heap/top-K;
- BFS/DFS;
- greedy choice;
- dynamic programming.

## 4. Step 1 — Understand the Contract

Before choosing a pattern, identify:

```text
Input
Output
Constraints
Ordering
Duplicates
Mutation
Valid/invalid cases
```

Never start with “Which pattern is this?” before understanding what must be computed.

## 5. Step 2 — Quantify the Constraints

Estimate `N`, number of queries `Q`, value range, memory limits, and whether input is sorted or streaming.

Constraints eliminate entire classes of solutions.

For example:

```text
N ≈ 10^5 → O(N²) usually requires justification
N ≈ 10^7 → even O(N log N) may need engineering analysis
```

These are reasoning signals, not universal rules.

## 6. Step 3 — Build a Baseline

Write the simplest correct approach mentally or in pseudocode.

Then ask:

```text
What work is repeated?
What information am I throwing away?
What constraint am I not using?
```

Optimization should emerge from an observation.

## 7. Step 4 — Identify the State

Many patterns are fundamentally state-management strategies.

Examples:

```text
sliding window → state of current range
prefix sum → cumulative state
hash map → previously observed state
monotonic stack → unresolved ordered state
heap → best K state
DP → solved subproblem state
```

## 8. Step 5 — Identify the Movement

Ask what can move monotonically.

Examples:

```text
two pointers → left/right movement
window → expand/shrink
binary search → search boundary
stack → push/pop boundary
BFS → frontier expansion
```

Monotonic movement often eliminates repeated work.

## 9. Pattern Family: Two Pointers

Signals include:

- sorted input;
- pairs or triplets;
- opposite ends;
- removing duplicates;
- partitioning.

Typical reasoning:

```text
left/right
→ compare
→ discard an impossible region
→ move one pointer
```

## 10. Pattern Family: Sliding Window

Signals include:

- contiguous subarray/substring;
- longest/shortest range;
- at most/exactly K;
- frequency constraints.

The key invariant describes what the current window contains.

## 11. Pattern Family: Prefix/Suffix State

Use cumulative information when many queries or local decisions depend on everything before/after a position.

Examples:

- prefix sums;
- prefix minimum/maximum;
- suffix maximum;
- difference arrays.

## 12. Pattern Family: Hashing

Signals include:

- exact membership;
- duplicates;
- frequency;
- complement lookup;
- grouping by key.

The key question is whether previous observations can be represented compactly for constant/expected-time lookup.

## 13. Pattern Family: Binary Search

Do not limit binary search to sorted arrays.

The deeper signal is a **monotone predicate**:

```text
false false false true true true
```

The task is to locate the transition.

## 14. Pattern Family: Monotonic Stack

Signals include:

- next greater/smaller;
- previous greater/smaller;
- unresolved elements waiting for a future element;
- nearest boundary under an ordering condition.

Each element is often pushed and popped at most once, producing linear total work.

## 15. Pattern Family: Heap / Top-K

Signals include:

- best K;
- worst K;
- continuously changing top candidates;
- streaming selection;
- scheduling by priority.

A heap maintains a bounded frontier rather than globally ordering everything.

## 16. Pattern Family: BFS / DFS

Signals include:

- reachability;
- connected components;
- shortest path in unweighted graphs;
- hierarchical traversal;
- state-space exploration.

Choose based on the structure and required information, not habit.

## 17. Pattern Family: Greedy

A greedy solution repeatedly commits to a local choice.

The critical question is not “Can I choose the obvious option?” but:

```text
Why can this choice never destroy an optimal solution?
```

An exchange argument or other proof is usually required.

## 18. Pattern Family: Dynamic Programming

Signals include:

- overlapping subproblems;
- optimal substructure;
- decisions across positions/states;
- minimum/maximum/count over choices.

Derive the state and transition before writing a DP table.

## 19. Pattern Family: Divide and Conquer

Signals include:

- independent subproblems;
- recursive partitioning;
- combine step;
- logarithmic depth.

Ask whether the combine operation is cheaper than solving the original problem directly.

## 20. Pattern Composition

Real problems often combine patterns.

Examples:

```text
hash map + sliding window
sort + two pointers
binary search + greedy feasibility
heap + streaming
DFS + memoization
BFS + visited set
prefix sum + hash map
```

The ability to compose patterns is more important than recognizing a single label.

## 21. Pattern Selection Decision Tree

Use this rough process:

```text
Contiguous range?
  → sliding window / prefix state

Sorted or sortable?
  → two pointers / binary search / sort+sweep

Exact membership/frequency?
  → hashing

Best K?
  → heap / selection

Monotone feasibility?
  → binary search on answer

Nearest unresolved boundary?
  → monotonic stack

Graph/state space?
  → BFS / DFS / shortest-path family

Repeated overlapping choices?
  → DP

Provably safe local choice?
  → greedy
```

This is a heuristic classifier, not a substitute for proof.

## 22. Correctness Through Invariants

Every optimized pattern should have an invariant.

Example sliding window:

> The current window always satisfies the required validity condition after the shrink step.

Example two pointers:

> All discarded pairs cannot contain a valid solution under the established ordering argument.

## 23. Complexity Reasoning

Count state transitions rather than only visible loops.

A nested-looking loop may still be `O(N)` if each pointer moves only forward a total of `N` times.

## 24. Failure Modes

Pattern recognition fails when developers:

1. match keywords mechanically;
2. ignore constraints;
3. skip the baseline;
4. cannot state the invariant;
5. optimize without proving discarded states are irrelevant;
6. confuse contiguous ranges with subsequences;
7. confuse exact lookup with ordering;
8. use DP without defining state semantics.

## 25. Backend Applications

Pattern recognition appears in:

- API pagination;
- rate-limit windows;
- deduplication;
- cache eviction;
- scheduling;
- log processing;
- top-K feeds;
- query optimization.

## 26. AI Applications

Common patterns include:

- sliding windows over token streams;
- top-K candidate selection;
- beam-style frontier management;
- hash-based candidate deduplication;
- binary search over thresholds;
- dynamic programming for sequence tasks.

## 27. Interview Method

When given a new problem, say internally:

```text
1. What exactly is being asked?
2. What are the constraints?
3. What is the brute-force solution?
4. What repeated work exists?
5. What state could preserve useful history?
6. What can move monotonically?
7. Which pattern removes the repeated work?
8. What invariant proves it?
9. What is the complexity?
```

## 28. Revision Checklist

- [ ] I can define a pattern without memorizing code.
- [ ] I can derive a baseline first.
- [ ] I can use constraints to eliminate approaches.
- [ ] I can identify useful state.
- [ ] I can identify monotonic movement.
- [ ] I understand the major pattern families.
- [ ] I can combine multiple patterns.
- [ ] I can state an invariant.
- [ ] I can derive complexity from state transitions.
- [ ] I can explain the approach in an interview.

## 29. Key Takeaways

1. **Pattern recognition is the process of mapping problem structure to reusable algorithmic ideas.**
2. **Constraints and the baseline solution should drive pattern selection.**
3. **Most patterns can be understood as compactly maintaining useful state while eliminating repeated work.**
4. **A pattern is not complete until its invariant and complexity are understood.**
5. **Expert problem solving comes from composing patterns when one pattern alone is insufficient.**
