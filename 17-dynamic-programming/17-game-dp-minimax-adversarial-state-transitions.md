# 17 — Game DP: Minimax, Adversarial States & Optimal Play

> **Phase 17 — Dynamic Programming**
>
> Game DP models sequential decisions where players have conflicting objectives. The key extension beyond ordinary optimization DP is that the value of a state depends on **whose turn it is** and that the opponent is assumed to make an optimal response.

---

## 1. Core Mental Model

For a deterministic two-player zero-sum game, define a value from one player's perspective:

```text
V(state) = best outcome the current player can force
```

If the current player chooses an action, the opponent controls the next state. Therefore the recurrence alternates between maximizing and minimizing choices.

```text
V(s) = max V(next)    when MAX moves
V(s) = min V(next)    when MIN moves
```

The recurrence is DP when different move sequences reach the same game state.

---

## 2. State Must Capture the Entire Future-Relevant Position

A game state may include:

```text
(board position)
(remaining interval)
(remaining stones)
(current score difference)
(visited/occupied cells)
(player to move)
```

If the same board configuration can have different legal moves depending on whose turn it is, the player-to-move component is mandatory.

The state must be sufficient: two histories that produce the same state must have the same future game semantics.

---

## 3. Terminal States

Terminal conditions define the value of the game.

Examples:

```text
no legal move → loss
completed board → utility
empty interval → 0 score difference
```

Write terminal semantics before deriving the recurrence. A wrong terminal value propagates through every ancestor state.

---

## 4. Score-Difference Formulation

For many take-away games, store:

```text
V(s) = maximum score difference
       (current player's final score - opponent's final score)
```

If the current player takes value `x` and reaches state `t`:

```text
candidate = x - V(t)
```

Then:

```text
V(s) = max(candidate over legal moves)
```

This removes an explicit MAX/MIN player dimension because the sign flip automatically represents the opponent's advantage.

If `V(s) > 0`, the current player can force a positive final advantage under the model.

---

## 5. Classic Interval Game

Given an array of values, players alternately take either endpoint.

Define:

```text
dp[l][r] = best score difference current player can force
            from interval [l, r]
```

Recurrence:

```text
dp[l][r] = max(
  a[l] - dp[l + 1][r],
  a[r] - dp[l][r - 1]
)
```

Base case:

```text
dp[i][i] = a[i]
```

This is interval DP combined with adversarial optimization.

---

## 6. Minimax State Formulation

Alternatively define:

```text
V(s, player)
```

Then:

```text
V(s, MAX) = max utility(next)
V(s, MIN) = min utility(next)
```

This is explicit and useful when the objective is not naturally expressible as score difference.

The score-difference formulation is often simpler, but it requires a zero-sum interpretation.

---

## 7. Zero-Sum Assumption

Minimax is not automatically correct for every multiplayer problem.

The simple recurrence assumes:

- two players;
- deterministic or explicitly modeled transitions;
- opposing objectives;
- a utility that one player maximizing is equivalent to the other minimizing.

If both players can benefit simultaneously, or have different non-zero-sum preferences, a simple scalar minimax value is insufficient.

---

## 8. Memoization vs Tabulation

Top-down minimax DP is natural when the reachable state space is sparse:

```text
solve(state) {
  if (memo.has(state)) return memo.get(state);
  // evaluate legal moves
}
```

Bottom-up DP is useful when states have an obvious dependency order, such as interval length or remaining resources.

Choose based on the state graph, not ideology.

---

## 9. Game DP as DAG DP

If every move strictly decreases a resource such as:

```text
remaining elements
remaining stones
remaining turns
```

the state graph is acyclic.

Then minimax is simply a DAG dynamic program whose aggregation operator alternates according to the player or is encoded by score difference.

This connection makes correctness and complexity easier to reason about.

---

## 10. Winning-State Boolean DP

For impartial win/lose games, the state can be boolean:

```text
win[s] = true if current player has a move to a losing state
```

Therefore:

```text
win[s] = exists move such that win[next] === false
```

A terminal state with no legal move is losing:

```text
win[terminal] = false
```

This is often more compact than storing numerical utilities.

---

## 11. Losing States

The complementary property is:

```text
lose[s] = every legal move leads to a winning state
```

For finite acyclic games:

```text
win[s] = !every(win[next])
```

This creates a powerful interview pattern: identify a state as winning if you can move to something losing.

---

## 12. Move Reconstruction

A value alone does not tell you how to play.

Store:

```text
bestMove[state]
```

when evaluating the state.

For score-difference DP, a move is optimal if it maximizes:

```text
immediateGain - V[next]
```

For boolean games, store any move leading to a losing state.

If deterministic output matters, explicitly define tie-breaking.

---

## 13. Tie-Breaking Is Part of the Contract

Several moves may have the same minimax value.

Possible deterministic policies:

- smallest move index;
- lexicographically smallest move;
- shortest move encoding;
- domain-specific preference.

Do not rely accidentally on object property order or adjacency-list order if output reproducibility matters.

---

## 14. Alpha-Beta Pruning vs Game DP

Classical minimax search may explore an exponential game tree.

Alpha-beta pruning reduces the number of explored branches when good bounds are available, but it does **not** remove the fundamental state duplication problem.

Game DP exploits repeated states:

```text
game tree → game graph → memoize shared states
```

The two techniques can be combined, but their benefits come from different sources.

---

## 15. Transposition Tables

In practical game engines, the same position may be reached through different move orders.

A **transposition table** caches evaluated positions:

```text
positionKey → value / bound / depth metadata
```

This is the game-search analogue of memoization.

For a finite exact DP, a canonical state representation is essential. For large game-tree search, hashing and collision strategy become engineering concerns.

---

## 16. Depth-Limited Search and Evaluation

When the complete game state space is too large, exact DP may be infeasible.

A common approximation is:

```text
search to depth D
→ evaluate frontier positions heuristically
```

This is no longer an exact full-game DP unless the frontier values are exact.

Keep the distinction explicit between:

- exact terminal DP;
- depth-limited minimax;
- heuristic evaluation;
- Monte Carlo search.

---

## 17. Iterative Deepening

Iterative deepening searches:

```text
depth 1
→ depth 2
→ depth 3
→ ...
```

It combines a depth-first memory profile with progressively deeper search.

Transposition tables can retain useful information between iterations, subject to the chosen search semantics.

---

## 18. Negamax

For two-player zero-sum games, minimax can often be simplified:

```text
V(s) = max(-V(next))
```

This is the **negamax** formulation.

The sign change represents switching perspective from the current player to the opponent.

Negamax is especially useful when both players have symmetric move-generation and evaluation logic.

---

## 19. Misère Variants

Normal-play and misère-play games differ in terminal semantics.

For example:

```text
normal play: no move → lose
misère play: no move → win
```

Do not reuse a win/lose recurrence without changing its boundary condition and verifying the game rules.

---

## 20. Multi-Player Games

Simple two-player minimax does not generalize automatically to three or more players.

A scalar score difference is usually insufficient because there may not be one single opposing objective.

A multi-player state may require a utility vector:

```text
(u1, u2, u3, ...)
```

and a clearly specified preference rule for the player making each decision.

---

## 21. Stochastic Games

If moves produce random outcomes, combine game optimization with probability DP:

```text
V(s) = max_action Σ_t P(t | s, action) × V(t)
```

For an opponent's turn:

```text
V(s) = min_action Σ_t P(t | s, action) × V(t)
```

This connects directly to the previous lesson on stochastic DP.

---

## 22. State Compression

Game DP often becomes practical only after compressing the state.

Common representations:

- bitmasks for small sets;
- encoded board positions;
- interval endpoints;
- remaining-count vectors;
- canonicalized symmetric positions.

A smaller canonical state can dramatically reduce memory and computation.

---

## 23. Symmetry Reduction

If rotations, reflections, or equivalent labels produce the same future game, canonicalize equivalent positions.

For example:

```text
canonical(state) = minimum encoding among all symmetry transforms
```

Then memoize the canonical representation.

Only perform symmetry reduction when the transformation truly preserves legal moves and utility.

---

## 24. Cycles and Draws

Not every game state graph is acyclic.

Cycles can produce:

- draws;
- repeated positions;
- infinite play;
- non-terminating paths.

A recursive memoization implementation cannot simply assume that a cyclic state will eventually receive a value.

Cyclic games require explicit game-theoretic semantics, such as draw values, repetition rules, fixed-point reasoning, or bounded search.

---

## 25. Correctness Proof — Score Difference

For each state `s`, prove:

> `V(s)` equals the maximum final score difference the player to move can force from `s`.

Induction on remaining moves:

1. Base states have the correct immediate terminal utility.
2. Assume every successor state has the correct value.
3. For each legal move, the current player receives immediate gain minus the opponent's optimal continuation value.
4. The current player chooses the maximum candidate.
5. Therefore `V(s)` is exactly the optimal achievable score difference.

---

## 26. Correctness Proof — Boolean Winning State

For a finite acyclic game:

1. A terminal state with no legal move is losing.
2. A state is winning if it has at least one move to a losing state.
3. If every legal move leads to a winning state, the current player cannot force a win and the state is losing.
4. Induction over the dependency order establishes correctness for all states.

---

## 27. Complexity

If there are `S` unique states and each has at most `B` legal moves:

```text
Time:  O(S × B)
Space: O(S)
```

This is fundamentally different from exploring the raw game tree, whose number of paths can be exponential in depth.

State encoding, hashing, move generation, and canonicalization may add substantial real-world costs.

---

## 28. Testing Strategy

Use:

- brute-force game-tree enumeration for tiny instances;
- differential testing against an independent solver;
- random small positions;
- symmetry transformations;
- move-order permutations;
- terminal-state tests;
- forced-win and forced-loss positions;
- ties and deterministic tie-breaking;
- cyclic/draw cases where supported;
- very deep linear games to expose recursion problems.

For score-difference games, verify the perspective/sign convention explicitly.

---

## 29. Backend Engineering Applications

Game-DP patterns also appear in adversarial backend decisions:

- competitive resource allocation simulations;
- conflict resolution planning;
- scheduling with opposing objectives;
- negotiation state exploration;
- security attack/defense simulations.

Do not label a production optimization problem “minimax” merely because it has multiple actors. Verify whether the actors actually have opposing objectives and strategic control.

---

## 30. AI Engineering Applications

Game DP is directly related to:

- adversarial planning;
- search-based agents;
- board-game engines;
- finite-horizon strategic planning;
- opponent modeling;
- game-state evaluation;
- minimax/negamax search;
- transposition tables.

A crucial engineering distinction is **exact state-space optimization versus heuristic search**. State compression, pruning, learned evaluation, and sampling can make large problems tractable, but they change the guarantees.

---

## 31. Interview Framework

When you see a game problem, ask:

1. Who is the current player?
2. Is the game zero-sum?
3. Is the state sufficient?
4. Is the state graph acyclic?
5. What are terminal values?
6. Is a boolean win/lose state enough?
7. Would score difference simplify the recurrence?
8. Can states repeat through different move orders?
9. Can I canonicalize or compress the state?
10. Do I need the actual strategy, not only the value?
11. Are there cycles, draws, or misère rules?
12. Is exact DP feasible, or do I need bounded/heuristic search?

---

## 32. Master Pattern

```text
Game rules
   ↓
Define player-relative sufficient state
   ↓
Define terminal utility
   ↓
Enumerate legal moves
   ↓
Opponent becomes the next-state value
   ↓
MAX / MIN or score-difference / negamax
   ↓
Memoize shared states
   ↓
Compress + canonicalize where valid
   ↓
Reconstruct optimal play if required
   ↓
Handle cycles/draws explicitly
   ↓
Prove + brute-force small states
```

Game DP is the dynamic-programming view of adversarial search: the essential problem is not “search every sequence,” but “identify the canonical game state and compute the value that optimal play can force from it.”