# 06.06 — Stack-Based Backtracking, Undo/Redo & State Restoration

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter develops a deeper use of stacks: representing reversible decisions and restoring earlier state. The goal is to understand backtracking as state management rather than memorizing recursive templates.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- model a search path as a stack of decisions;
- distinguish a decision stack from a value stack;
- understand checkpoint and rollback semantics;
- implement undo/redo histories;
- restore mutable state safely during backtracking;
- distinguish full snapshots from inverse operations and mutation logs;
- transform recursive backtracking into explicit-stack iteration;
- reason about ownership, aliasing, and state leakage;
- design bounded history and memory policies;
- prove that a backtracking algorithm restores its invariants;
- apply state-restoration patterns to backend workflows and AI search.

---

# 2. The Core Idea: Decisions Are State

A backtracking algorithm repeatedly performs:

```text
choose
  ↓
apply
  ↓
explore
  ↓
undo
  ↓
try another choice
```

The stack can represent the sequence of decisions currently active.

Example:

```text
root
 └── A
      └── C
           └── F
```

The active path is:

```text
[A, C, F]
```

When F is exhausted:

```text
pop F
restore state
```

Then C can try another branch.

---

# 3. Decision Stack vs Data Stack

Not every stack contains the same kind of information.

### Data stack

Stores values being processed.

Examples:

```text
postfix evaluation
expression parsing
```

### Decision stack

Stores choices and enough information to resume or undo them.

Examples:

```text
DFS
backtracking
workflow rollback
undo history
```

A decision frame may contain:

```text
current state
next choice index
mutation information
checkpoint
metadata
```

This is much closer to a call-stack frame than a simple value.

---

# 4. Backtracking State Machine

A useful conceptual frame is:

```text
ENTER
 ↓
CHOOSE
 ↓
APPLY
 ↓
EXPLORE
 ↓
UNDO
 ↓
NEXT CHOICE
 ↓
EXIT
```

The algorithm must ensure that every `APPLY` has a matching restoration before another incompatible branch is explored.

That requirement is the heart of correctness.

---

# 5. Why Restoration Is Difficult

Suppose state is:

```js
const state = {
  selected: [],
  remaining: new Set(['A', 'B', 'C'])
};
```

A choice mutates multiple structures.

If you undo only:

```text
selected.pop()
```

but forget to restore `remaining`, the next branch starts from corrupted state.

This is called **state leakage between branches**.

A correct backtracking algorithm must restore every mutation that affects the search state.

---

# 6. Restoration Strategies

There are three common approaches.

## Strategy A — Full snapshot

Before branching:

```text
snapshot = copy(state)
```

After exploration:

```text
state = snapshot
```

Simple but potentially expensive.

## Strategy B — Inverse operation

Apply:

```text
add(x)
```

Restore with:

```text
remove(x)
```

Usually memory-efficient.

## Strategy C — Mutation log / checkpoint

Record exact mutations:

```text
property changed
old value
new value
```

Rollback to a checkpoint.

This generalizes well to complex mutable state.

---

# 7. Snapshot vs Undo Log

Suppose state size is `S` and search depth is `D`.

Full snapshots can consume roughly:

```text
O(S × D)
```

in the worst case if every level retains a full copy.

An inverse-operation approach may use:

```text
O(D)
```

for path metadata, assuming each mutation is constant-size.

But inverse operations are harder to make correct when mutations interact.

Therefore:

> Choose the restoration mechanism based on state size, mutation complexity, and correctness risk.

---

# 8. Checkpoints

A checkpoint represents a restoration boundary.

Conceptually:

```text
checkpoint = mutationLog.length
```

After exploring a branch:

```text
rollbackTo(checkpoint)
```

Only mutations after the checkpoint need to be reversed.

This is a powerful abstraction because the caller does not need to know every individual mutation.

---

# 9. Rollback Invariant

At the beginning of every sibling branch:

> The mutable state must be observationally equivalent to the state that existed immediately before the parent made its branch choice.

This invariant prevents branch contamination.

For every recursive/iterative search frame:

```text
enter frame → establish checkpoint
explore branch
rollback checkpoint
explore next branch
```

---

# 10. Permutations as a State-Restoration Problem

To generate permutations:

```text
choose unused item
mark used
append to path
recurse
remove from path
unmark used
```

The critical pair is:

```text
mark used
unmark used
```

and:

```text
push path
pop path
```

Both are state restoration operations.

If either inverse is missing, the output becomes incomplete or incorrect.

---

# 11. Subsets and Choice Frames

For each item there are often two choices:

```text
exclude
include
```

A recursive implementation implicitly stores:

```text
index
current decision
next branch
```

An explicit stack must represent those fields itself.

A useful frame might conceptually be:

```text
{
  index,
  branch: 0,
  appliedChoice: null
}
```

This makes the recursive call stack visible as data.

---

# 12. Explicit Stack Transformation

Recursive:

```text
search(state)
    for each choice
        apply(choice)
        search(state)
        undo(choice)
```

Explicit stack:

```text
push initial frame

while stack not empty
    inspect top frame

    if more choices exist
        apply choice
        push child frame
    else
        pop frame
        restore parent state
```

The key is that a frame must remember where execution should resume.

Simply pushing child states without continuation metadata can change the algorithm's semantics.

---

# 13. Iterative DFS as the Same Idea

A simple DFS stack may contain only nodes:

```text
[node]
```

But to exactly simulate recursive DFS with mutable local state, a frame often needs:

```text
node
nextChildIndex
localState
```

This distinction matters when converting recursion to iteration.

---

# 14. Undo/Redo Architecture

A typical editor model uses two stacks:

```text
undoStack
redoStack
```

After a new action:

```text
undoStack.push(action)
redoStack.clear()
```

Undo:

```text
action = undoStack.pop()
applyInverse(action)
redoStack.push(action)
```

Redo:

```text
action = redoStack.pop()
apply(action)
undoStack.push(action)
```

The two-stack model encodes directional history.

---

# 15. Why New Actions Clear Redo

Suppose:

```text
A → B → C
```

Undo C:

```text
undo = [A, B]
redo = [C]
```

Now perform D:

```text
A → B → D
```

C is no longer on the current timeline.

Therefore:

```text
redo.clear()
```

This is not arbitrary UI behavior; it follows from history semantics.

---

# 16. Command Pattern

An undoable operation can be represented as a command:

```text
execute()
undo()
```

Example:

```text
InsertCharacter
DeleteCharacter
MoveNode
ChangeProperty
```

The history stack stores commands rather than raw states.

This can dramatically reduce memory when operations are small and invertible.

---

# 17. Snapshot-Based History

Alternatively, store snapshots:

```text
S0
S1
S2
S3
```

Undo simply moves to an earlier snapshot.

Advantages:

- simple restoration;
- straightforward correctness.

Disadvantages:

- potentially high memory usage;
- copying large state can be expensive.

Persistent/immutable structures can reduce this trade-off through structural sharing.

---

# 18. Mutation Logs

A mutation log records changes rather than entire states.

Example:

```text
SET x: 10 → 20
DELETE key: A
INSERT key: B
```

Undo reverses the log:

```text
SET x: 20 → 10
DELETE key: B
INSERT key: A
```

The log itself is naturally stack-like because the most recent mutation must be reversed first.

---

# 19. Aliasing and Reference Safety

JavaScript makes state restoration subtle because objects are references.

This is dangerous:

```js
const snapshot = state;
```

That does not create an independent snapshot.

Both variables refer to the same object.

A genuine snapshot requires an appropriate copy strategy.

But deep copying blindly can itself be incorrect or expensive for:

```text
Map
Set
Date
class instances
cycles
shared references
external resources
```

Choose the representation deliberately.

---

# 20. Ownership and Mutation Contracts

A production backtracking component should define:

```text
who owns state?
who may mutate it?
who restores it?
can callers observe intermediate state?
can callbacks retain references?
```

If external code can observe a mutable object during exploration, rollback may not restore what external observers have already seen.

This is one reason immutable state can simplify correctness.

---

# 21. Backtracking Invariant Example

Suppose:

```text
path = chosen elements
used = selected-element set
```

Invariant:

```text
x ∈ path  ⇔  x ∈ used
```

After choosing `x`:

```text
path.push(x)
used.add(x)
```

After rollback:

```text
path.pop()
used.delete(x)
```

Both structures must change together.

This is an example of a **cross-structure invariant**.

---

# 22. Pruning

Backtracking becomes useful only when branches can be eliminated.

Example:

```text
if partialSum > target
    stop branch
```

The decision stack represents the active path, while the pruning rule prevents unnecessary descendants.

A strong backtracking solution therefore combines:

```text
state representation
choice ordering
constraint checking
pruning
restoration
```

---

# 23. Branch Ordering

Even when two algorithms have the same worst-case complexity, branch ordering can change practical runtime drastically.

Useful heuristics include:

- most constrained choice first;
- highest probability first;
- cheapest validation first;
- fail-fast ordering;
- domain-specific priority.

For AI search, branch ordering can determine whether useful solutions are found early.

---

# 24. Backend Applications

State-restoration stacks appear in:

- transaction/savepoint systems;
- workflow editors;
- undoable administrative actions;
- configuration changes;
- nested request processing;
- parser rollback;
- migration tooling;
- rule evaluation;
- staged form editing;
- resource acquisition/release.

Database transactions provide an important conceptual analogy:

```text
checkpoint
→ perform changes
→ commit
or
→ rollback
```

The implementation is different from an in-memory stack, but the state-management reasoning is closely related.

---

# 25. AI Applications

Backtracking and state restoration are fundamental to:

- DFS search;
- constraint satisfaction;
- puzzle solving;
- planning;
- symbolic reasoning;
- game search;
- structured generation;
- tool-plan exploration;
- candidate program synthesis.

An AI search frame can contain:

```text
state
parent
next action
score
constraints
checkpoint
```

Restoration allows sibling candidates to be explored without reconstructing the entire world state.

---

# 26. Memory Engineering

For large search spaces, copying complete state per branch can dominate runtime and memory.

Possible alternatives:

```text
incremental mutation + rollback
persistent data structures
copy-on-write
delta logs
compact decision frames
```

The correct choice depends on:

```text
state size
mutation frequency
branching factor
search depth
sharing requirements
latency target
```

---

# 27. Failure Modes

### State leakage

A mutation is not undone.

### Double rollback

The same mutation is reversed twice.

### Wrong rollback order

Mutations are restored in an order that violates dependencies.

### Snapshot aliasing

The supposed snapshot shares mutable state with the active state.

### Unbounded history

Undo stack grows without a policy.

### Incomplete frame

An explicit-stack conversion forgets continuation state.

### External observation

Observers retain references to temporary state.

---

# 28. Correctness Proof Structure

For a backtracking algorithm, prove:

### Invariant

The current state represents exactly the choices encoded by the active stack path.

### Apply correctness

Applying a choice produces the correct child state.

### Restoration correctness

Rollback returns the state to the exact parent-state invariant.

### Completeness

Every legal choice is eventually explored unless pruned by a proven-invalid condition.

### Termination

Each frame has finitely many choices and is eventually exited.

This converts a recursive intuition into a rigorous algorithmic argument.

---

# 29. Complexity Analysis

Let:

```text
N = number of explored states
D = maximum depth
C = cost of applying/restoring one choice
```

A generic backtracking search may cost approximately:

```text
O(N × C)
```

with active path memory:

```text
O(D)
```

if state mutation is incremental and each frame stores O(1) metadata.

With full snapshots of size S at each depth:

```text
memory can approach O(D × S)
```

Therefore restoration strategy directly affects complexity.

---

# 30. Bounded Undo History

Production systems often limit history:

```text
MAX_UNDO = K
```

When the limit is exceeded:

```text
remove oldest history entry
```

A pure stack is not sufficient for efficient oldest-entry eviction; a deque or ring buffer may be more appropriate.

This illustrates an important design principle:

> Choose the data structure from the complete workload, not from one operation.

---

# 31. Testing Strategy

Backtracking requires more than example tests.

Test:

```text
empty state
single choice
multiple choices
nested choices
immediate pruning
complete exploration
rollback after failure
rollback after success
repeated rollback
aliasing cases
maximum depth
maximum history
```

A particularly valuable property is:

```text
state after branch exploration
== state before branch exploration
```

for every branch boundary.

---

# 32. Differential Testing

For an explicit-stack implementation, compare against a trusted recursive reference.

Generate small inputs and verify:

```text
same solutions
same ordering when ordering is specified
same final state
same number of accepted states
```

This is highly effective when transforming recursive algorithms into iterative ones.

---

# 33. Production Design Framework

When designing a reversible-state component:

```text
1. Define state ownership.
2. Define mutation operations.
3. Define checkpoints.
4. Define rollback semantics.
5. Choose snapshot/log/inverse strategy.
6. Define invariants.
7. Bound memory and depth.
8. Define failure behavior.
9. Test branch isolation.
10. Benchmark copy vs rollback.
11. Add observability.
12. Document whether operations are reversible.
```

---

# 34. Interview Framework

When asked a backtracking problem:

```text
1. Define the state.
2. Define the choices.
3. Define the constraint.
4. Define the terminal condition.
5. Explain pruning.
6. Explain apply/undo.
7. State the invariant.
8. Explain recursive stack state.
9. Analyze branching/depth.
10. Discuss iterative conversion.
11. Discuss memory restoration strategy.
```

Do not start by writing recursion.

Start by defining the state transition.

---

# 35. Revision Checklist

- [ ] I understand decision stacks.
- [ ] I can model a backtracking frame.
- [ ] I understand checkpoints and rollback.
- [ ] I can compare snapshots, inverse operations, and mutation logs.
- [ ] I can identify state leakage.
- [ ] I understand aliasing in JavaScript.
- [ ] I can convert recursive search to explicit-stack iteration.
- [ ] I can implement undo/redo semantics.
- [ ] I can define cross-structure invariants.
- [ ] I understand pruning and branch ordering.
- [ ] I can analyze restoration cost.
- [ ] I can design bounded history.
- [ ] I can test branch isolation.
- [ ] I can explain backend transaction/workflow analogies.
- [ ] I can explain AI search applications.

---

# 36. Key Takeaways

1. Backtracking is controlled state mutation plus restoration.
2. A decision stack records the active path and continuation state.
3. Every mutation needs a reliable restoration strategy.
4. Snapshots are simple; inverse operations and logs can be more memory-efficient.
5. Checkpoints make rollback composable.
6. Cross-structure invariants must be restored together.
7. Recursive call stacks can be represented explicitly as frames.
8. Branch ordering and pruning often dominate practical performance.
9. Undo/redo is a history-management problem, not merely two arrays.
10. Production-grade backtracking requires ownership, memory limits, failure semantics, and strong tests.
