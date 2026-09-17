# 23 — DP Reconstruction, Path Recovery & Optimal Solution Tracing

Dynamic programming often answers only the numerical question: *what is the optimal value?* Production systems and interviews frequently need the actual solution: which items, operations, states, edges, partitions, or decisions produced that value.

The core principle is:

> **Value DP computes what is achievable; reconstruction recovers a witness that proves how it was achieved.**

## 1. Value vs Witness

A DP may return a minimum cost, maximum score, feasibility boolean, count, probability, or optimal length. A witness is a concrete object consistent with that result: an LCS string, knapsack item set, shortest sequence of actions, edit script, path, partition, policy, or schedule.

A correct reconstruction algorithm must satisfy two properties: the recovered object is feasible, and evaluating it produces the DP's reported value.

## 2. Three Reconstruction Strategies

### Store parent/choice information

Alongside `dp[state]`, store the predecessor or decision that achieved the selected value. After DP finishes, walk backward from the target.

Advantages: simple and fast reconstruction. Cost: additional memory.

### Re-derive choices from the completed DP table

If the recurrence is known, inspect neighboring states and determine which transition is consistent with the optimal value. This avoids a separate parent table but requires the relevant DP values to remain available.

### Recompute during reconstruction

When memory has been compressed aggressively, recompute selected subproblems or checkpoints while tracing the solution. This trades additional time for reduced memory.

## 3. Parent Pointers

For a state `s`, suppose

`dp[s] = best over actions a of transitionValue(s, a)`.

When action `a*` wins, store:

`parent[s] = predecessor` and/or `choice[s] = a*`.

Reconstruction becomes a graph walk through the chosen predecessor relation until a base state is reached.

Invariant:

> Every stored parent must correspond to a legal transition whose value explains the stored DP value.

## 4. Tie-Breaking Is Part of the Specification

Multiple optimal solutions are common. Without an explicit rule, reconstruction may be correct but nondeterministic.

Possible policies include first discovered, smallest index, lexicographically smallest witness, fewest operations, earliest completion, or domain-specific priority.

Do not claim lexicographically smallest reconstruction merely because you choose the locally smallest predecessor. Local tie-breaking produces a globally desired ordering only when that property is proved.

## 5. Reconstruction in 1D DP

For minimum-step or maximum-score linear DP, store which previous index produced each state.

Example mental model:

`dp[i] = min(dp[i-1] + cost1, dp[i-2] + cost2)`.

Store whether `i-1` or `i-2` won. Trace from `i = n` to the base state and reverse the collected decisions.

## 6. Knapsack Reconstruction

With a full `dp[i][capacity]` table, compare the state with the previous item layer.

If `dp[i][c] == dp[i-1][c]`, item `i` may have been skipped. If taking it explains the value, it may be selected.

Ties require policy. A one-dimensional compressed knapsack table destroys the historical item layers needed for naive backtracking. Solutions include explicit parents, recomputation, persistent metadata, or retaining selected checkpoints.

## 7. LCS Reconstruction

For LCS on prefixes:

- if characters match and the diagonal transition explains the optimum, include the character and move diagonally;
- otherwise move toward a neighboring state that preserves the optimum.

If both neighbors have equal values, multiple optimal LCS strings may exist. Deterministic or lexicographic reconstruction requires an explicit strategy.

## 8. Edit Script Reconstruction

Edit distance reconstruction translates predecessor movement into operations:

- diagonal equal character → match
- diagonal unequal character → replace
- vertical/horizontal movement → delete/insert according to orientation.

The recovered operation sequence must transform the source into the target and have total cost equal to the DP optimum.

## 9. Grid Path Reconstruction

For grid optimization, store the predecessor direction or infer it from neighboring values. Trace from destination to source, then reverse the path.

Validate that every recovered move is legal and that summing path weights reproduces the reported optimum.

## 10. Interval DP Reconstruction

Interval DP often stores the split point `k` that produced the optimum for `[l, r]`.

The witness is typically a recursive decomposition tree. Matrix-chain multiplication, optimal parenthesization, triangulation, and partition problems naturally reconstruct by recursively visiting the selected split.

## 11. Tree DP Reconstruction

Tree DP reconstruction must respect state meaning. If `dp[u][taken]` represents an optimal subtree solution conditioned on whether `u` is selected, the reconstruction function receives that condition and determines each child's compatible state.

Parent decisions can often be recomputed from child DP values, reducing metadata storage.

## 12. Bitmask DP Reconstruction

For `dp[mask][last]`, store the previous `last`, previous mask, or selected next element. Since the previous mask may be derivable by clearing a bit, only the missing decision sometimes needs storage.

For assignment DP, the number of assigned items may be `popcount(mask)`, so part of the state is implicit and need not be stored.

## 13. DAG DP Reconstruction

DP is often evaluation over a DAG of states. Reconstruction chooses one incoming/outgoing edge that certifies the optimal recurrence.

This unifies sequence, grid, interval, tree, and bitmask reconstruction:

1. DP evaluates state values.
2. Each optimal state has one or more certifying transitions.
3. Reconstruction follows certifying transitions to base states.

## 14. Reconstructing All Optimal Solutions

One parent pointer recovers one witness. To enumerate all optimal witnesses, retain every transition that preserves optimality or re-evaluate all optimal transitions during traversal.

The number of optimal witnesses can be exponential even when the DP table is polynomial. Therefore output-sensitive complexity matters.

Never promise polynomial-time enumeration when the output itself may be exponential.

## 15. Counting Optimal Solutions

Sometimes the requirement is not to enumerate witnesses but count them.

Maintain a pair such as:

`(bestValue, numberOfWaysToAchieveBestValue)`.

When a transition improves the value, replace both. When it ties the value, accumulate the count. Carefully avoid duplicate semantic solutions when different transition histories represent the same witness.

## 16. Lexicographically Smallest Optimal Witness

A common advanced requirement is to recover the lexicographically smallest solution among all optimal ones.

Potential approaches include suffix feasibility/value DP plus greedy reconstruction, ranked transitions, next-occurrence structures, or richer DP states.

The safe pattern is:

> At each reconstruction step, choose the smallest candidate only after proving that an optimal completion still exists.

This is greedy reconstruction backed by DP feasibility, not unsupported greedy choice.

## 17. Memory Compression vs Reconstruction

Rolling arrays may reduce value computation from `O(nm)` memory to `O(m)`, but the full witness may require historical information.

Options:

- keep the full table
- store compact parent directions
- checkpoint rows and recompute between them
- divide and conquer reconstruction
- use a problem-specific linear-space algorithm.

Space optimization should be evaluated against the output requirements, not only the final numeric value.

## 18. Hirschberg as a Reconstruction Pattern

LCS can be reconstructed in linear auxiliary row memory using divide and conquer. Compute forward and backward DP rows to identify a midpoint split, then recursively reconstruct both halves.

This demonstrates a broader technique:

> Recompute enough value information to identify a split instead of storing the entire parent graph.

The tradeoff is more complex logic in exchange for reduced memory.

## 19. Checkpointing

For very large sequential DP, store full reconstruction metadata only at periodic checkpoints. During reconstruction, recompute the DP inside one checkpoint interval to recover local decisions.

This creates a tunable time-space tradeoff and mirrors checkpoint/recompute strategies used in large computational pipelines.

## 20. Persistent Decision Structures

Copying a complete path for every state is usually expensive. Instead, represent witnesses with linked immutable nodes or parent references. States can share prefixes/suffixes rather than duplicating arrays.

However, persistent structures may still grow large. Measure total node count and lifetime rather than assuming structural sharing solves every memory problem.

## 21. Reconstruction Under Space-Optimized DP

A classic bug is to update a one-dimensional DP array in place and store a parent that later becomes inconsistent because the referenced state is overwritten.

Parent metadata must represent the logical historical state, not merely a mutable array position. Use immutable references, iteration/version information, or another reconstruction strategy.

## 22. Verification as a Certificate

Treat the reconstructed solution as a certificate.

A separate verifier should check:

1. structural validity
2. constraints
3. objective value
4. consistency with the reported DP optimum.

For optimization problems, this creates a powerful testing architecture: solver produces `(value, witness)` and verifier independently evaluates the witness.

## 23. Differential Testing

For small instances, brute-force every candidate solution. Compare:

- optimal value
- witness feasibility
- witness objective
- tie-breaking rule where specified.

A solver can return the correct value while reconstruction is wrong, so testing only the scalar result is insufficient.

## 24. Metamorphic Testing

Useful properties depend on the problem. Examples:

- recovered LCS must be a subsequence of both inputs
- recovered edit script must actually transform source to target
- selected knapsack items must respect capacity
- grid path must use legal moves
- interval split tree must cover exactly the original interval
- reconstructed policy must use legal actions.

These checks do not require knowing the optimal witness in advance.

## 25. Backend Engineering Applications

Backend systems often need an explanation, not just an optimum. Examples include scheduling, resource allocation, routing, workflow planning, pricing rules, batch assignment, and deployment planning.

Store stable domain decisions rather than implementation-specific table coordinates when traces need to survive beyond one computation.

Auditability may justify additional reconstruction metadata even when a value-only algorithm could use less memory.

## 26. AI Engineering Applications

Planning and search systems often require a policy/action sequence. DP value functions answer how good a state is; reconstruction extracts actions that realize the value.

Applications include finite-horizon planning, constrained decoding, sequence alignment, structured prediction, dynamic-programming decoders, and finite-state models.

A value function without a consistent action extractor is incomplete when the system must execute or explain a plan.

## 27. Correctness Proof Template

Prove:

### Value correctness
The DP recurrence computes the claimed optimum.

### Transition certificate
Every reconstruction step follows a legal transition that preserves the optimal recurrence equality.

### Termination
Tracing reaches a base state.

### Witness validity
The reversed/assembled decisions form a valid complete solution.

### Objective equality
The witness's evaluated objective equals the reported DP value.

### Tie-breaking correctness
If a canonical witness is required, separately prove the tie policy yields it.

## 28. Complexity

Separate computation from reconstruction.

If DP costs `T` time and `S` memory, parent-pointer reconstruction commonly adds `O(S)` metadata and `O(L)` trace time, where `L` is witness length.

Recomputation-based reconstruction can reduce stored metadata while increasing time. Enumerating all optimal witnesses is output-sensitive and can be exponential.

## 29. Interview Framework

When asked to return the actual solution:

1. define the DP state and value recurrence
2. identify what transition information is needed
3. decide parent storage vs re-derivation
4. define tie-breaking
5. explain interaction with space optimization
6. reconstruct from target to base
7. reverse/assemble the witness
8. verify feasibility and objective
9. state time and memory separately for value computation and reconstruction.

## 30. Master Pattern

```text
state-value DP
    ↓
identify certifying transitions
    ↓
choose reconstruction strategy
    ├── parent pointers
    ├── re-derive from table
    ├── recompute/checkpoint
    └── divide and conquer
    ↓
define tie policy
    ↓
trace target → base
    ↓
assemble witness
    ↓
independently verify witness
```

The deepest lesson is:

> **An optimal number is often only half the answer. A robust DP implementation can explain which legal decisions certify that number.**

## 31. Mastery Checklist

- [ ] distinguish value computation from witness recovery
- [ ] reconstruct using parent pointers
- [ ] reconstruct by re-deriving transitions
- [ ] recover knapsack selections
- [ ] recover LCS and edit scripts
- [ ] recover grid and DAG paths
- [ ] reconstruct interval split trees
- [ ] reconstruct tree and bitmask DP decisions
- [ ] define deterministic tie-breaking
- [ ] count optimal solutions
- [ ] reason about all-optimal enumeration complexity
- [ ] recover lexicographically constrained witnesses safely
- [ ] explain rolling-array reconstruction problems
- [ ] understand Hirschberg-style recomputation
- [ ] design checkpoint/recompute strategies
- [ ] independently verify recovered witnesses
- [ ] differential-test value and reconstruction
- [ ] apply reconstruction to backend and AI planning systems
