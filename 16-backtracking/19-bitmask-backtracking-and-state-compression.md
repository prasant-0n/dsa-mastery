# 16.19 — Bitmask Backtracking and State Compression

## 1. Why Bitmasks Matter

Backtracking repeatedly asks questions such as:

```text
Is this item already used?
Is this constraint already satisfied?
Which choices remain available?
```

When the state is a small finite set of boolean conditions, a **bitmask** can represent the entire set compactly.

Instead of:

```text
used = [false, true, false, true, ...]
```

we can encode the same state as bits:

```text
mask = 01010₂
```

This turns many state operations into constant-time bitwise operations.

---

## 2. Set Representation

For a universe of `n` elements:

```text
bit i = 1 → element i is selected
bit i = 0 → element i is not selected
```

For example:

```text
Elements:  A B C D E
Bits:      0 1 0 1 1
```

means:

```text
{B, D, E}
```

In JavaScript, ordinary bitwise operators work on signed 32-bit integers, so for larger universes use `BigInt` or another representation.

---

## 3. Core Bit Operations

Given a mask `M` and bit position `i`:

```text
set:
M | (1 << i)

clear:
M & ~(1 << i)

check:
(M & (1 << i)) !== 0

toggle:
M ^ (1 << i)
```

For `BigInt`, use `1n << BigInt(i)` and keep operands consistently typed.

The abstraction is:

```text
membership state
      ↓
compact integer
      ↓
bitwise transitions
```

---

## 4. Backtracking State Compression

Suppose we generate permutations of `n` elements.

A conventional solver maintains:

```text
used[i]
currentPath
```

The `used` array can become:

```text
usedMask
```

Then choosing element `i` becomes:

```text
nextMask = usedMask | bit(i)
```

and availability is:

```text
(usedMask & bit(i)) === 0
```

The recursive state becomes smaller and easier to hash.

---

## 5. Why State Compression Helps

Bitmask state can improve:

- memory usage,
- hashing speed,
- memoization keys,
- subset operations,
- equality checks,
- cache locality,
- transition simplicity.

But do not confuse compact representation with better asymptotic complexity.

If the search still visits `2^n` states, bitmasks do not magically make it polynomial.

---

## 6. Subset Enumeration

Every subset of an `n`-element universe corresponds to one mask:

```text
0 ... (2^n - 1)
```

Therefore subset enumeration can be viewed as traversing masks directly.

Backtracking and mask enumeration are two representations of the same subset state space:

```text
Backtracking:
choose / skip

Mask iteration:
integer from 0 to 2^n - 1
```

Backtracking remains useful when constraints allow early pruning.

---

## 7. Enumerating Submasks

Given a mask `M`, all non-empty submasks can be generated using:

```text
sub = M
while (sub !== 0) {
    // process sub
    sub = (sub - 1) & M
}
```

This is an important state-compression primitive.

It enumerates only subsets contained in `M` rather than all subsets of the universe.

Across all masks, the total number of `(mask, submask)` pairs is `O(3^n)`.

---

## 8. Available-Choice Mask

Instead of checking every candidate individually, maintain a mask of currently available choices.

For universe mask `ALL`:

```text
available = ALL & ~used
```

Then repeatedly extract a set bit:

```text
bit = available & -available
available ^= bit
```

This allows the recursion to branch directly over currently available choices.

The exact bit-extraction technique depends on the numeric representation and JavaScript's signed 32-bit semantics.

---

## 9. Bitmask as a Constraint Set

Bitmasks are not limited to `used` elements.

They can represent:

- occupied cells,
- visited graph vertices,
- selected features,
- satisfied requirements,
- forbidden positions,
- assigned resources,
- active permissions.

For example:

```text
requiredMask
satisfiedMask

remaining = requiredMask & ~satisfiedMask
```

This makes set-based constraint reasoning explicit.

---

## 10. Compatibility Masks

Precompute which choices are compatible.

For each item `i`:

```text
conflictMask[i]
```

contains every item that conflicts with `i`.

Then:

```text
(conflictMask[i] & selectedMask) === 0
```

means `i` is compatible with the current selection.

This replaces repeated pairwise conflict checks with a bitwise intersection.

---

## 11. Graph Backtracking with Bitmasks

For a graph problem, a visited set can be represented as:

```text
visitedMask
```

and an adjacency list can be supplemented by:

```text
adjacencyMask[v]
```

Then unvisited neighbors are:

```text
adjacencyMask[v] & ~visitedMask
```

This is particularly useful for small dense graphs and exact exponential algorithms.

---

## 12. Bitmask DP + Backtracking

Bitmask states often overlap.

If the future depends only on:

```text
currentVertex
visitedMask
```

then memoization can use:

```text
memo[currentVertex][visitedMask]
```

This creates a hybrid:

```text
backtracking search
      +
state compression
      +
 memoization
```

This pattern appears in Hamiltonian-path/TSP-style problems, assignment problems, and subset optimization.

---

## 13. Example — Hamiltonian Search

A recursive state can be:

```text
(currentVertex, visitedMask)
```

Transition:

```text
for each unvisited neighbor:
    recurse(neighbor, visitedMask | bit(neighbor))
```

Without memoization, many equivalent states may be recomputed.

With memoization, each reachable `(vertex, mask)` state can be solved once.

The state-space size is approximately:

```text
O(n · 2^n)
```

before accounting for transition cost.

---

## 14. Exact Search with Required Features

Suppose a configuration must satisfy a set of required capabilities.

Represent capabilities as bits:

```text
candidateMask
requiredMask
```

A candidate satisfies all requirements when:

```text
(candidateMask & requiredMask) === requiredMask
```

For multiple candidates, accumulated coverage becomes:

```text
coveredMask | candidateMask
```

The recursive state can therefore be:

```text
(index, coveredMask)
```

This is a compact model for feature-selection and coverage problems.

---

## 15. Dominance with Bitmask State

State compression makes dominance checks easier to express.

Suppose two states reach the same structural position:

```text
same index
same remaining constraints
```

but one has a better objective.

The weaker state can be discarded if future possibilities are identical.

A correct dominance rule still requires a proof; compact state representation does not make an unsafe pruning rule safe.

---

## 16. Symmetry and Canonical State

Bitmasks can make canonicalization cheap.

If multiple branches represent the same selected set regardless of ordering, store:

```text
selectedMask
```

rather than every permutation of that set.

This converts many order-dependent paths into one canonical state.

Use this carefully: if ordering itself affects future constraints or objective values, collapsing states can destroy valid solutions.

---

## 17. JavaScript Number vs BigInt

JavaScript requires special attention.

### Number

Bitwise operators convert operands to signed 32-bit integers.

Therefore ordinary bitwise masks are practical only for a limited number of bits.

### BigInt

`BigInt` supports larger integer masks:

```js
1n << BigInt(i)
```

But do not mix:

```text
Number
```

and:

```text
BigInt
```

in the same bitwise expression.

Choose the representation deliberately based on the state size.

---

## 18. Memoization Key Design

A compressed state must encode every variable that influences the future.

Bad key:

```text
visitedMask
```

when the current vertex also changes future transitions.

Correct key:

```text
currentVertex + visitedMask
```

Likewise:

```text
(index, mask, remainingCapacity)
```

may be required when capacity affects future choices.

The rule is:

> If changing a state variable can change the optimal future result, that variable belongs in the state key.

---

## 19. Correctness Invariants

Maintain:

1. Every set bit corresponds to exactly one selected/visited/satisfied entity.
2. Every unset bit represents an entity not currently represented by the mask.
3. Every recursive transition updates the mask consistently with the actual state mutation.
4. Backtracking restores the previous mask exactly.
5. Every memoization key contains all future-relevant state.
6. Every compatibility mask is derived from the same problem model as the search.
7. Any symmetry or dominance pruning preserves at least one optimal/valid representative.

---

## 20. Testing Strategy

### Representation Tests

For every element:

```text
set → check → clear → check
```

### Round-Trip Tests

Verify:

```text
mask
→ decode
→ encode
→ same mask
```

### Differential Testing

Compare a bitmask solver against a simple array/set-based reference solver on small random instances.

### Memoization Testing

Compare:

```text
memoized result
vs.
non-memoized result
```

while also comparing explored-state counts.

### Adversarial Cases

Test:

- zero elements,
- one element,
- maximum supported mask width,
- all bits set,
- no available choices,
- complete graph,
- empty graph,
- highly conflicting candidates,
- many equivalent states.

---

## 21. Complexity

Typical state-space sizes include:

```text
all subsets:                 O(2^n)
subset + submask enumeration: O(3^n) total pairs
vertex + visited-mask DP:    O(n · 2^n) states
```

Transition cost must be included separately.

Bitwise operations are generally constant-time for the chosen machine representation, but `BigInt` operations depend on operand size and should not automatically be treated as unit-cost for arbitrarily large masks.

---

## 22. Backend Engineering Applications

Bitmask state compression is useful for compact finite-state decision systems:

- feature compatibility,
- permission/role combinations,
- deployment capability matching,
- configuration search,
- resource allocation,
- small dependency graphs,
- scheduling availability sets.

A backend can expose a domain model while internally representing finite sets as masks for fast validation and search.

---

## 23. AI Engineering Applications

AI-generated candidates can be converted into deterministic bitsets:

```text
AI candidate
   ↓
normalized feature IDs
   ↓
feature mask
   ↓
compatibility / constraint checks
   ↓
exact backtracking or DP
```

This creates a useful boundary:

```text
probabilistic proposal
        ↓
deterministic compressed state
        ↓
exact verification/search
```

The mask is a representation, not a substitute for validating the underlying semantics.

---

## 24. Interview Framework

Explain bitmask backtracking in this order:

1. Identify a finite boolean state.
2. Assign one bit to each entity/constraint.
3. Replace set membership with bit operations.
4. Define the recursive state completely.
5. Generate available choices using masks.
6. Update state with OR/AND/XOR operations.
7. Memoize repeated compressed states when useful.
8. Prove that the mask contains all future-relevant information.
9. Analyze `2^n`, `3^n`, or `n·2^n` state growth where applicable.
10. Discuss JavaScript `Number` vs `BigInt` semantics.

The critical question is:

> What information have you compressed, and what information must never be lost?

---

## 25. Revision Checklist

You should be able to answer:

- How does a bitmask represent a set?
- How do you set, clear, check, and toggle a bit?
- Why is state compression useful in backtracking?
- How do you enumerate submasks?
- Why is the total mask/submask pair count `O(3^n)`?
- How do compatibility masks replace repeated conflict checks?
- How can graph traversal use adjacency masks?
- How does bitmask state combine with memoization?
- Why must every future-relevant variable be in the memoization key?
- When should JavaScript use `BigInt` instead of bitwise `Number` masks?
- How can symmetry be represented canonically with masks?
- Why does compact state not change the fundamental exponential nature of many problems?

---

## 26. Master Pattern

```text
FINITE BOOLEAN STATE
        ↓
ASSIGN ONE BIT PER ENTITY
        ↓
COMPRESS STATE INTO MASK
        ↓
COMPUTE AVAILABLE / VALID CHOICES
        ↓
CHOOSE ONE BIT
        ↓
UPDATE MASK
        ↓
RECURSE / MEMOIZE
        ↓
RESTORE OR DERIVE NEXT MASK
```

The evolution is:

```text
Backtracking
    ↓
Explicit set / array state
    ↓
Bitmask representation
    ↓
Fast compatibility operations
    ↓
Canonical compressed states
    ↓
Memoized exponential search
    ↓
Bitmask DP / exact state-space optimization
```

The core principle is:

> **Compress only the representation—not the information required to make the next decision correctly.**
