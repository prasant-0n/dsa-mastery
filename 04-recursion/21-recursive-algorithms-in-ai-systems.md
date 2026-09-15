# 04.21 — Recursive Algorithms in AI Systems

## Purpose

AI systems frequently operate on hierarchical or recursively defined structures: syntax trees, expression trees, search spaces, nested tool plans, symbolic programs, proof trees, document hierarchies, and structured representations.

This chapter connects recursion to practical AI engineering while keeping the DSA foundation explicit: state, branching, depth, memoization, pruning, correctness, and resource control.

> In AI engineering, recursion is most useful when the problem itself has hierarchical state or a recursively generated search space.

---

# 1. Where Recursion Appears in AI

Important examples include:

- AST/code analysis;
- symbolic expression evaluation;
- search and planning;
- game trees;
- proof/search trees;
- hierarchical document processing;
- recursive program generation;
- tree-structured feature processing;
- nested agent/tool plans.

Not every AI algorithm is recursive. Use recursion because the computational structure requires it, not because AI sounds hierarchical.

---

# 2. Search Trees

Many AI problems can be represented as:

```text
state
├── action A → state
├── action B → state
└── action C → state
```

Recursive search explores descendants of a state.

The key quantities are:

```text
branching factor b
depth d
```

A naive search tree may contain roughly:

```text
O(b^d)
```

nodes.

---

# 3. State Representation

A recursive AI search should define exactly what determines the future.

Typical state includes:

- current position;
- remaining resources;
- constraints;
- selected actions;
- environment facts;
- accumulated objective.

Do not put irrelevant history into the state unless it changes future possibilities.

---

# 4. Planning

A planner may recursively ask:

```text
What actions are possible?
→ apply action
→ recursively plan from new state
```

This is a state-space search problem.

The recursion is only the control mechanism; the real design problem is state representation and transition correctness.

---

# 5. Depth-Limited Search

Unbounded recursive search is dangerous.

A depth limit creates:

```text
if depth === MAX_DEPTH:
    stop expansion
```

This bounds recursion but does not necessarily bound total work, because branching can still be large.

---

# 6. Iterative Deepening

Iterative deepening repeatedly searches with increasing depth:

```text
limit = 0
→ search
limit = 1
→ search
limit = 2
→ search
```

It combines useful properties of depth-first memory usage with progressively deeper solutions.

Repeated work is the trade-off.

---

# 7. Heuristic Search

AI search often orders branches using a heuristic:

```text
best-looking child first
```

Ordering does not automatically make a search algorithm correct.

Keep this distinction:

> Heuristics can change search efficiency without changing the valid solution set—provided they do not become unsound pruning rules.

---

# 8. Safe Pruning

Pruning removes states that cannot contribute to a valid or sufficiently good solution.

A pruning rule must have a correctness argument.

Examples:

- violated hard constraint;
- impossible remaining capacity;
- admissible lower/upper bound proving no improvement;
- dominated state under a valid dominance relation.

---

# 9. Branch and Bound

For optimization search:

```text
incumbent = best known solution
bound = best possible result below this state
```

If the bound cannot beat the incumbent, prune the branch.

The bound must be optimistic in the correct direction for pruning to remain sound.

---

# 10. Memoization in AI Search

Different action sequences can reach the same state.

Then the search tree contains duplicate computation.

Memoization converts repeated state exploration into reuse:

```text
canonical state → result
```

The challenge is designing a correct canonical state key.

---

# 11. Search Tree vs State Graph

This distinction is essential.

A search tree represents:

```text
history of choices
```

A state graph represents:

```text
unique computational states
```

Two different histories can reach the same state.

Memoization exploits that convergence.

---

# 12. Game Trees

Board games naturally form recursive trees:

```text
position
→ legal moves
→ resulting positions
→ legal moves
```

Minimax recursively evaluates future positions.

Alpha-beta pruning can eliminate branches that cannot affect the final decision.

---

# 13. Minimax

Conceptually:

```text
MAX node → choose maximum child value
MIN node → choose minimum child value
```

Terminal states provide utility values.

Recursive correctness depends on evaluating the appropriate player objective at every depth.

---

# 14. Alpha-Beta Pruning

Alpha-beta maintains bounds on what ancestors already know.

If a subtree cannot improve the relevant decision, exploration can stop.

The important DSA lesson is not the specific game algorithm but the pattern:

```text
recursive search + propagated bounds + sound pruning
```

---

# 15. Beam-Style Search

Some AI systems deliberately keep only a limited number of promising candidates at each level.

Unlike exact pruning, this can discard a globally optimal path.

Therefore it should be classified as a heuristic approximation rather than exact search.

---

# 16. Recursive Program Generation

A program generator can recursively construct syntax:

```text
Program
→ Statement
→ Expression
→ nested Expression
```

The search space may be enormous.

Useful controls include:

- grammar constraints;
- type constraints;
- depth limits;
- cost limits;
- duplicate-state detection.

---

# 17. AST-Based AI Code Analysis

Code can be represented as an AST and recursively analyzed for:

- function calls;
- identifiers;
- control flow constructs;
- dependency patterns;
- unsafe APIs;
- complexity metrics.

AST structure often allows more precise analysis than raw text matching.

---

# 18. Recursive Code Transformation

AI-assisted coding tools may transform syntax trees recursively:

```text
parse
→ locate subtree
→ transform
→ validate
→ serialize
```

Transformations should preserve syntax and semantic invariants required by the downstream system.

---

# 19. Hierarchical Document Processing

Documents can be represented as:

```text
document
→ sections
→ subsections
→ paragraphs
→ blocks
```

Recursive processing can calculate summaries, metadata, token budgets, or structural statistics.

Large documents should be processed with bounded depth and chunking rather than blindly recursing through everything.

---

# 20. Tree-Structured Data for AI Pipelines

Recursive traversal can support:

- hierarchical chunking;
- taxonomy processing;
- knowledge structures;
- dependency analysis;
- structured retrieval.

The traversal algorithm should preserve stable identifiers when downstream systems need reproducible references.

---

# 21. Symbolic Reasoning

Symbolic systems frequently manipulate recursive expressions:

```text
f(g(x), h(y))
```

Recursive evaluation and transformation are natural here.

Memoization can help when identical symbolic subexpressions recur.

---

# 22. Proof and Reasoning Trees

A proof/search procedure may expand:

```text
claim
→ possible rule
→ subclaims
→ subclaims...
```

The resulting search can have huge branching factors.

Correctness requires distinguishing:

```text
valid deduction
from
plausible heuristic
```

---

# 23. Tool and Agent Planning

A nested plan can be represented as:

```text
Goal
→ subgoal
→ tool action
→ resulting state
→ next subgoal
```

Recursive decomposition is useful for hierarchical planning, but production systems should bound:

- tool calls;
- depth;
- wall-clock time;
- token consumption;
- monetary cost;
- retry count.

---

# 24. Recursive Retrieval

A retrieval strategy may recursively expand promising nodes:

```text
query
→ candidate
→ related candidate
→ related candidate...
```

Without limits, relevance expansion can become an uncontrolled graph walk.

Use visited-state tracking, budgets, and explicit stopping criteria.

---

# 25. Dynamic Programming Connection

AI search may have overlapping states.

The progression is:

```text
recursive search
→ repeated states
→ memoization
→ dynamic programming / graph optimization
```

Recognizing state convergence is often more important than choosing recursion itself.

---

# 26. State Explosion

Multiple state dimensions can create a huge state space:

```text
position × remaining budget × constraints × history
```

Before implementing recursion, estimate state count and branching factor.

If the state is too large, consider:

- compression;
- abstraction;
- pruning;
- approximation;
- iterative search;
- learned heuristics.

---

# 27. Exact vs Approximate Search

AI engineering often involves a deliberate trade-off.

### Exact
Guarantees a property under stated assumptions.

### Approximate
Trades guarantees for speed, memory, or scalability.

Examples include:

- beam search;
- heuristic pruning;
- bounded-depth planning;
- sampled search.

Always state which guarantees are being sacrificed.

---

# 28. Learned Heuristics

A model can rank branches or estimate value.

This can improve search order dramatically, but the model's prediction is not automatically a proof.

Keep separate:

```text
heuristic score
objective value
correctness constraint
pruning certificate
```

---

# 29. Determinism and Reproducibility

AI search can become difficult to debug when branch ordering changes between runs.

Production systems may need:

- deterministic tie-breaking;
- seeded randomness;
- recorded search traces;
- versioned heuristic models.

Reproducibility is an engineering feature, not merely a testing convenience.

---

# 30. Observability for Recursive AI

Useful metrics include:

```text
search depth
nodes expanded
branches pruned
cache hit rate
average branching factor
maximum depth
latency
tokens consumed
model/tool calls
termination reason
```

These metrics expose both algorithmic and system-level bottlenecks.

---

# 31. Resource-Bounded AI Search

A production recursive search should have explicit budgets:

```text
maxDepth
maxNodes
maxTime
maxTokens
maxCost
```

Termination should be explicit and observable.

A system that eventually terminates only because a process crashes is not resource-bounded.

---

# 32. Stack Safety

Deep recursive search can exceed the language runtime's call stack.

For large or untrusted depth, use:

- explicit stacks;
- queues/worklists;
- generators;
- resumable state machines.

This allows search to pause, resume, cancel, and inspect progress.

---

# 33. Backend + AI Integration

A backend AI service may combine recursive algorithms with:

```text
API request
→ planner
→ recursive search
→ tool calls
→ state updates
→ result validation
```

The algorithm must respect distributed-system realities: timeouts, retries, idempotency, rate limits, and partial failure.

---

# 34. Security

Recursive AI workflows can amplify attacker-controlled input.

Threats include:

- recursive prompt structures;
- deeply nested data;
- huge branching requests;
- tool-call loops;
- cache poisoning through incorrect state keys;
- cross-tenant state leakage.

Treat recursive state as security-sensitive when it carries authorization or tenant context.

---

# 35. Design Procedure

```text
1. Define the AI state precisely.
2. Define legal transitions.
3. Estimate branching and depth.
4. Define terminal conditions.
5. Separate objective from heuristic score.
6. Define safe pruning rules.
7. Canonicalize repeated states.
8. Add memoization where states converge.
9. Decide exact vs approximate guarantees.
10. Add depth/node/time/token/cost budgets.
11. Make termination explicit.
12. Add deterministic behavior where reproducibility matters.
13. Instrument the search.
14. Provide an iterative fallback for deep search.
15. Test adversarial branching and malformed state.
```

---

# 36. Interview Explanation Template

> “I model the AI problem as a state space first. Recursion is then a mechanism for expanding successor states. I analyze branching factor and depth, define terminal states, and distinguish heuristic ordering from correctness-preserving pruning. If different histories reach the same state, I canonicalize the state and memoize it. For production, I bound depth, nodes, time, tokens, and cost, instrument the search, and use an explicit stack when recursion depth is unsafe.”

---

# 37. Revision Checklist

- [ ] Can I model an AI problem as a recursive state space?
- [ ] Can I estimate branching factor and depth?
- [ ] Can I distinguish search trees from state graphs?
- [ ] Can I design canonical state keys?
- [ ] Can I identify overlapping states?
- [ ] Can I prove pruning safety?
- [ ] Can I explain branch-and-bound?
- [ ] Can I explain minimax and alpha-beta at the DSA level?
- [ ] Can I distinguish exact search from heuristic approximation?
- [ ] Can I use learned heuristics without confusing them with proofs?
- [ ] Can I design recursive AST/code processing?
- [ ] Can I bound recursive agent/tool planning?
- [ ] Can I instrument recursive AI search?
- [ ] Can I preserve reproducibility?
- [ ] Can I replace deep recursion with explicit state machines?
- [ ] Can I identify security risks in recursive AI workflows?

# Key Takeaways

1. Many AI problems are recursive state-space problems, but recursion itself is not the main abstraction—the state is.
2. Branching factor and depth determine the raw search explosion.
3. Memoization becomes powerful when different histories converge on the same state.
4. Heuristic ordering is different from correctness-preserving pruning.
5. Exact and approximate search have different guarantees and should be labeled explicitly.
6. AST recursion is highly relevant to AI code analysis and transformation.
7. Agent and tool planning requires hard resource budgets, not just algorithmic termination arguments.
8. Learned heuristics can guide search but do not automatically establish correctness.
9. Production AI recursion needs observability, reproducibility, cancellation, and security boundaries.
10. The expert skill is recognizing when recursion should evolve into memoization, dynamic programming, graph search, approximation, or an explicit state machine.
