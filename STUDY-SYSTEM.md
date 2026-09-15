# DSA Study System

## 1. The Learning Loop

Every major topic follows:

**Theory → Mental Model → Manual Trace → Implementation → Complexity → Problems → Variations → Interview → Backend/AI Application → Revision**

## 2. Do Not Memorize Solutions

When approaching a problem:

1. Restate the problem.
2. Extract inputs, outputs, and constraints.
3. Produce a brute-force solution.
4. Identify the bottleneck.
5. Look for structure or a reusable pattern.
6. Select a data structure.
7. Derive the optimized approach.
8. Explain why it is correct.
9. Implement it.
10. Analyze time and space.
11. Test edge cases.
12. Solve a variation.

## 3. Hint Ladder

When stuck, use progressively stronger help instead of immediately reading a solution:

**Hint 1 → Hint 2 → Stronger Hint → Approach → Pseudocode → Implementation**

After seeing a solution, close it and re-implement it from memory. Then solve a variation.

## 4. Problem Difficulty

Use this progression:

- Level 0 — Mechanical
- Level 1 — Easy
- Level 2 — Easy+
- Level 3 — Medium
- Level 4 — Medium+
- Level 5 — Hard

Do not jump to hard problems before the underlying pattern is stable.

## 5. Mastery Checklist

For each topic, verify:

- [ ] I can define it.
- [ ] I understand why it exists.
- [ ] I can explain the mental model.
- [ ] I can implement it without copying.
- [ ] I can trace it manually.
- [ ] I know operation complexities.
- [ ] I know the trade-offs.
- [ ] I can identify when to use it.
- [ ] I know when not to use it.
- [ ] I can solve standard problems.
- [ ] I can solve variations.
- [ ] I can recognize the pattern in unfamiliar problems.
- [ ] I can explain it in an interview.
- [ ] I can connect it to backend or AI engineering.

## 6. Revision Cadence

### Daily

Review the previous session, revisit mistakes, and reproduce key implementations from memory.

### Weekly

Re-solve selected problems without notes and update the mistake log.

### Monthly

Perform a mixed-topic test containing unfamiliar problems and review weak patterns.

## 7. Mistake Log

Every meaningful mistake should record:

- Problem
- Incorrect assumption
- Where the reasoning failed
- Correct principle
- How to detect the mistake next time

## 8. Backend + AI Integration

Once a concept is learned, deliberately identify a system where it matters.

Examples:

- Hashing → caching, deduplication, indexing
- Heap → scheduling, Top-K analytics
- Queue → jobs, workers, BFS
- Trie → autocomplete, prefix search
- Graphs → dependency systems, workflows, networks
- Sliding window → rate limiting, streaming analytics
- Binary search → search-space reduction
- ANN/HNSW → vector retrieval
- Top-K → ranking and retrieval

## 9. Engineering Standards

Implementations should favor:

- Clear names
- Small focused functions
- Explicit invariants
- Tests for edge cases
- Predictable error behavior
- Complexity comments where useful
- No unnecessary framework code

Primary language: **JavaScript / Node.js**.