# 03 — Memoization: Top-Down DP & Cache Design

> **Phase 17 — Dynamic Programming**
>
> Memoization is not merely “put results in a cache.” It is a disciplined way to evaluate a recursive state graph while ensuring that every future-equivalent state is solved once.

---

## 1. Memoization Mental Model

Start with a correct recursive definition:

```text
solve(state)
    ↓
base case?
    ↓ no
solve smaller states
    ↓
combine their answers
```

Without caching, the same state may be evaluated repeatedly.

Memoization changes the execution model:

```text
request state
    ↓
cache hit? ── yes ──> return cached answer
    │
    no
    ↓
compute state
    ↓
cache answer
    ↓
return
```

The mathematical recurrence does not change. Only the evaluation strategy changes.

---

## 2. What Must Be Cached?

Cache the answer to a **state**, not to an arbitrary function call.

A state is cacheable when:

1. the state representation is sufficient
2. equal states have the same remaining problem
3. the answer depends only on the state and immutable problem data
4. solving the state has no hidden dependence on unrelated mutable history

If these conditions fail, caching can produce incorrect results.

---

## 3. Pure State → Deterministic Answer

The ideal memoized function behaves conceptually like:

```text
answer = f(state, fixedInput)
```

For the same `state` and fixed input:

```text
f(S) === same answer
```

This is why memoization is closely related to referential transparency.

A dangerous design is:

```text
f(state) depends on global mutable variable
```

Two calls with the same state may then have different meanings.

---

## 4. Cache-Key Design

The cache key must uniquely identify the state.

### Primitive state

```js
const memo = new Map();
memo.set(index, answer);
```

### Multiple numeric dimensions

```js
const memo = new Map();
const key = `${index}|${capacity}`;
memo.set(key, answer);
```

String keys are convenient but can introduce allocation and collision-design concerns.

For performance-sensitive code, nested maps or integer encoding may be preferable.

### Structured state

```js
const key = JSON.stringify({ row, col, remaining });
```

This is simple but potentially expensive. Prefer a canonical compact representation when the state space is large.

---

## 5. Nested Map Design

For a small fixed number of dimensions:

```js
const memo = new Map();

function getMemo(i, capacity) {
  const row = memo.get(i);
  return row?.get(capacity);
}
```

This avoids repeatedly constructing serialized keys.

The tradeoff is additional map structure and implementation complexity.

---

## 6. Sentinel vs `Map.has()`

Do not confuse “not cached” with a legitimate cached answer.

This is fragile:

```js
if (memo.get(state)) {
  return memo.get(state);
}
```

It fails when the correct answer is `0`, `false`, `''`, or another falsy value.

Prefer:

```js
if (memo.has(state)) {
  return memo.get(state);
}
```

Or use a carefully chosen sentinel when the value domain guarantees it cannot collide.

---

## 7. Generic Top-Down Template

```js
function solve(state) {
  if (isBase(state)) {
    return baseValue(state);
  }

  if (memo.has(state)) {
    return memo.get(state);
  }

  const answer = combine(
    transitions(state).map(solve)
  );

  memo.set(state, answer);
  return answer;
}
```

The exact implementation changes, but the control flow is remarkably stable.

---

## 8. Memoization Invariant

Maintain this invariant:

> **Every entry in the memo contains the correct answer for exactly the state represented by its key.**

At the end of `solve(state)`:

```text
memo[state] = mathematically correct answer for state
```

This makes correctness reasoning much easier.

---

## 9. Memoization Does Not Automatically Make DP Polynomial

Caching removes repeated evaluation of identical states.

If the number of distinct states is still exponential, the algorithm may remain exponential.

General model:

```text
Time ≈ number of reachable distinct states × transition cost
Space ≈ number of cached states + recursion stack
```

For example, a subset-state DP may have `2^n` states even though every state is evaluated only once.

The important question is therefore:

> **How many distinct states exist?**

Not merely:

> “Did I add a memo object?”

---

## 10. Reachable vs Allocated State Space

Top-down memoization naturally follows reachable states.

Suppose a theoretical state space contains:

```text
1,000,000 possible states
```

but only:

```text
12,000 reachable states
```

are needed for the target.

Memoization may evaluate approximately those 12,000 states.

This is one reason top-down DP is attractive for sparse state graphs.

---

## 11. Recursion Stack Is Separate From Memo Memory

Memoization uses heap-like storage for cached states.

Recursive calls use the call stack.

Therefore:

```text
Total auxiliary memory
≈ memoized states + maximum recursion depth
```

A DP may have only `O(n)` cached states but still fail in JavaScript if recursion becomes too deep.

Memoization does **not** eliminate recursion depth.

---

## 12. Cache Placement

A common safe pattern is:

```js
if (memo.has(state)) return memo.get(state);

const answer = compute(state);
memo.set(state, answer);
return answer;
```

Do not cache a result before all information required to establish its correctness is available.

If recursive evaluation can encounter cycles, a separate “currently evaluating” marker may be required.

---

## 13. Cyclic State Graphs

Classic DP normally assumes an acyclic dependency relation or another well-founded measure.

Consider:

```text
A → B
B → C
C → A
```

Naive memoization does not solve this cycle:

```text
solve(A)
  → solve(B)
      → solve(C)
          → solve(A)
              → ...
```

For cyclic state graphs, you need a different strategy such as:

- cycle detection
- a monotone fixed-point computation
- shortest-path formulation
- SCC condensation
- another problem-specific formulation

Do not assume that “recursive + Map” automatically handles cycles.

---

## 14. Three-State Evaluation Model

For complex recursive state graphs, it can be useful to distinguish:

```text
UNSEEN
ACTIVE
DONE
```

Conceptually:

```text
UNSEEN → ACTIVE → DONE
             ↓
          cycle edge
```

This allows cycle detection and clearer debugging.

For ordinary DAG DP, the simpler `Map.has()` cache is often enough.

---

## 15. Sparse-State Memoization

Use `Map` when states are irregular:

```js
const memo = new Map();
```

Typical examples:

- string indices plus variable constraints
- graph states
- subset states
- large coordinate ranges with few reachable points
- composite search states

A dense array is often wasteful when state IDs are large but sparse.

---

## 16. Dense vs Sparse Cache

| Property | Array | Map |
|---|---|---|
| Dense integer states | Excellent fit | Works but unnecessary overhead |
| Sparse states | Can waste memory | Natural fit |
| Composite keys | Awkward | Natural |
| Random numeric indices | Fast/simple | Flexible |
| Memory predictability | High for dense bounds | Depends on entries |
| Serialization required | No | Only if you choose it |

Choose the representation from the state space, not habit.

---

## 17. Memoization with Reconstruction

Sometimes the DP answer is not enough.

Suppose:

```text
dp[state] = maximum value
```

but the caller needs the actual decisions.

Store additional information:

```js
memo.set(state, {
  value: bestValue,
  choice: bestChoice,
});
```

Or reconstruct decisions afterward from a separate choice structure.

Keep the distinction clear:

```text
value computation
vs
solution reconstruction
```

---

## 18. Returning Immutable Results

If a cached result is an object or array, mutation can corrupt future calls.

Dangerous:

```js
const result = memo.get(state);
result.push(item);
```

If the cached object is shared, the cache has now changed.

Safer designs include:

- immutable values
- defensive copies
- parent pointers
- persistent structures
- storing only scalar objective values and reconstructing later

Memoization and mutation must be designed together.

---

## 19. Memoization + Mutable Backtracking State

This is a frequent source of bugs.

Suppose the recursive function uses:

```js
path.push(choice);
solve(nextState);
path.pop();
```

Caching only `nextState` is correct **only if the future answer truly does not depend on `path`**.

If the path affects future legality or score, it belongs in the state.

Rule:

> **If changing a piece of hidden mutable history can change the future answer, that information cannot be omitted from the memo key.**

---

## 20. Memoization and Output Enumeration

Memoization is straightforward for scalar optimization/counting/feasibility answers.

It is more subtle when a state returns **all solutions**.

If:

```text
solve(state) = list of all completions
```

then the cached output itself may be huge.

Possible alternatives:

- count solutions
- return one solution
- stream solutions
- memoize only feasibility
- memoize suffix structures
- use DAG reconstruction

Caching does not make output size disappear.

---

## 21. Counting Can Need BigInt

If a DP counts exponentially many combinations, JavaScript `Number` may lose integer precision.

Use `BigInt` when exact counts exceed the safe integer range.

Example:

```js
let ways = 0n;
ways += previousWays;
```

Maintain type consistency:

```text
BigInt + BigInt
```

not:

```text
BigInt + Number
```

---

## 22. Memoization and Negative Results

Negative or zero answers are still valid cached answers.

Examples:

```text
minimum answer = 0
maximum answer = -5
feasibility = false
count = 0
```

All of these must be cacheable.

This is another reason to use explicit cache membership rather than truthiness.

---

## 23. State Canonicalization

Different representations of the same logical state must map to one cache key.

For example, if a state contains an unordered set:

```text
{A, B, C}
```

and another path represents it as:

```text
{C, A, B}
```

they should share a key if order is irrelevant.

Canonical forms include:

- sorted representation
- bitmask
- normalized tuple
- unique integer encoding

Canonicalization can dramatically reduce duplicate states.

---

## 24. State Compression and Memoization

Suppose the state is:

```text
(index, usedItems)
```

and `usedItems` can be represented as a bitmask.

Then:

```text
(index, Set)
```

can become:

```text
(index, mask)
```

The memo key becomes smaller and equality becomes cheaper.

This connects memoization directly to state-compression techniques studied elsewhere in the roadmap.

---

## 25. Memoization vs Tabulation

Memoization:

```text
target
 ↓
needed dependencies
 ↓
needed dependencies
```

Tabulation:

```text
base states
 ↓
all required next states
 ↓
...
 ↓
target
```

They evaluate the same recurrence in different directions.

A useful interview statement is:

> “I first derive the state graph. Memoization performs demand-driven DFS over it; tabulation evaluates it in a dependency order.”

---

## 26. When Top-Down Is a Good Fit

Top-down memoization is often useful when:

- only a subset of states is reachable
- the recurrence is naturally recursive
- deriving the solution from the target is simple
- the state graph is irregular
- you want an easy correctness oracle
- implementation clarity matters more than avoiding recursion

It may be less attractive when:

- recursion depth is large
- every state will be visited anyway
- tight iteration performance matters
- space compression naturally follows from bottom-up dependencies

---

## 27. Memoization Performance Model

Measure more than wall-clock time.

Useful metrics:

```text
recursive calls
cache lookups
cache hits
cache misses
unique states
maximum recursion depth
transition operations
cache memory
```

A useful ratio is:

```text
cache hit rate = cache hits / cache lookups
```

A high hit rate indicates substantial repeated-state elimination, although hit rate alone does not determine total performance.

---

## 28. Correctness Proof Structure

For a memoized recurrence, prove:

### Base cases

Every base state returns its mathematically correct answer.

### Transition correctness

Every recursive transition represents a valid decomposition of the state.

### Completeness

Every valid candidate needed for the answer is considered.

### Cache soundness

The memo key identifies a sufficient state, so cached results are valid for every future call with that state.

### Induction

Assuming recursive dependencies are correct, the combine operation produces the correct answer for the current state.

### Target

The initial state's answer is the requested result.

---

## 29. Testing Memoized DP

Build a small-input brute-force oracle.

Then compare:

```text
brute force
    vs
memoized DP
```

Also compare against an independent tabulated implementation when practical.

Test:

- empty inputs
- smallest valid inputs
- impossible states
- zero-valued answers
- negative-valued answers where allowed
- duplicate transitions
- sparse reachable states
- maximum practical recursion depth
- state-key collisions
- repeated calls to the same state
- mutation-sensitive cases

---

## 30. Metamorphic Testing

Properties should follow from the problem's mathematics.

Examples:

### Idempotent duplicate transition

If duplicate identical transitions are semantically supposed to represent one choice, adding the duplicate should not change the answer.

### Independent unreachable state

Adding a state that cannot be reached from the target should not change the result.

### Equivalent state encoding

Different representations that canonicalize to the same state should produce the same result.

Do not invent metamorphic properties merely to increase test count; each must have a justification.

---

## 31. Adversarial Memoization Tests

Construct cases that expose:

```text
wrong cache key
falsy cached value
mutable cached result
missing state dimension
non-canonical state
cycle
very deep recursion
large sparse keys
large number of distinct states
```

These cases are often more valuable than random happy-path examples.

---

## 32. Backend Engineering Applications

Memoization appears in backend systems whenever the same deterministic computation is repeatedly requested.

Examples:

- dependency resolution
- configuration expansion
- authorization-policy evaluation
- route or query planning
- repeated validation of equivalent request states
- resource scheduling subproblems
- graph-based dependency analysis

The engineering lesson is the same:

```text
canonical state
      ↓
deterministic computation
      ↓
cache
      ↓
reuse
```

Production systems additionally need:

- invalidation policy
- TTL where appropriate
- bounded memory
- observability
- concurrency considerations
- cache stampede protection
- versioned keys when inputs change

Algorithmic memoization and distributed caching are related ideas but not interchangeable.

---

## 33. AI Engineering Applications

Memoization is useful when an AI system repeatedly evaluates deterministic subproblems.

Examples:

- planning states
- constrained sequence states
- tool-combination states
- search states
- structured decoding subproblems
- deterministic validators

A robust architecture separates:

```text
probabilistic proposal
        ↓
canonical state
        ↓
deterministic evaluator
        ↓
memoized result
```

This makes repeated validation or search-state evaluation cheaper and easier to test.

Do not cache model outputs blindly when the model context, temperature, tool state, or external world can change the meaning of a request.

---

## 34. Interview Derivation Framework

When given a recursive problem, say:

1. “What is the smallest sufficient state?”
2. “Which different histories can reach the same state?”
3. “What is the recurrence from that state?”
4. “What are the base cases?”
5. “How many distinct states exist?”
6. “What is the transition cost?”
7. “Can I memoize the state?”
8. “Could recursion depth become a practical problem?”
9. “Would tabulation or space compression be cleaner?”
10. “How will I prove and test the recurrence?”

This demonstrates reasoning instead of formula recall.

---

## 35. Master Pattern

```text
                 Problem
                    │
                    ▼
             Define sufficient state
                    │
                    ▼
              Base case?
              /         \
            yes          no
             │            │
             ▼            ▼
         return base   cache hit?
                         /    \
                       yes     no
                        │       │
                        ▼       ▼
                     return   solve dependencies
                                  │
                                  ▼
                               combine
                                  │
                                  ▼
                              cache result
                                  │
                                  ▼
                                return
```

The essential discipline is:

> **Canonical state → explicit cache membership → solve dependencies → combine → cache exactly once.**

---

## 36. Completion Checklist

Before considering memoization mastered, you should be able to:

- [ ] define a sufficient state
- [ ] derive a recurrence before coding
- [ ] identify overlapping states
- [ ] choose a correct cache key
- [ ] distinguish cache miss from falsy values
- [ ] use `Map` for sparse states
- [ ] use arrays for dense states when appropriate
- [ ] explain memoization as state-graph evaluation
- [ ] count distinct states
- [ ] analyze recursion-stack cost
- [ ] detect cycles when relevant
- [ ] handle mutable result hazards
- [ ] reconstruct solutions when required
- [ ] compress state representations
- [ ] compare top-down and bottom-up evaluation
- [ ] prove cache soundness
- [ ] build a brute-force oracle
- [ ] perform differential testing
- [ ] design justified metamorphic tests
- [ ] benchmark cache behavior
- [ ] explain production caching differences

---

## 37. Final Takeaway

Memoization is best understood as **controlled reuse of answers to future-equivalent states**.

The cache is not the algorithmic insight. The real insight is discovering the correct state.

Once the state is correct:

```text
recurrence
    ↓
state graph
    ↓
memoized DFS
    ↓
one computation per reachable state
```

That mental model scales from Fibonacci to multidimensional DP, graph states, bitmask states, sequence optimization, planning, and advanced algorithmic systems.
