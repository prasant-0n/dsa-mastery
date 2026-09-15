# 10.05 — Hashing Patterns: Frequency Maps, Seen Sets & Prefix-State Hashing

## 1. Objective

Hashing becomes a problem-solving pattern when previously observed information can be stored for fast lookup.

The transformation is:

```text
repeated search
→ store useful state
→ lookup previous state
→ avoid rescanning
```

## 2. The Core Question

Ask:

> What information from the past would let me answer the current question immediately?

That information becomes the hash-table key or value.

## 3. Seen Set Pattern

Use a `Set` when only membership matters.

Typical signals:

- has this appeared before?
- have I visited this state?
- is this identifier already used?
- have I processed this item?

## 4. Frequency Map Pattern

Use a `Map` when multiplicity matters.

Typical signals:

- how many times?
- most frequent;
- anagram counts;
- inventory quantities;
- duplicate frequency.

## 5. Index Map Pattern

Store a useful position rather than only membership.

Examples:

```text
value → first index
value → latest index
value → all indices
```

The required answer determines which representation is correct.

## 6. Complement Lookup

For pair problems, store previously seen values and look for the required complement.

For target `T` and current value `x`:

```text
needed = T - x
```

This turns repeated pair search into expected linear processing.

## 7. Frequency vs Index

These are different states.

If the problem asks for counts, store counts.

If it asks for earliest occurrence, preserve the earliest occurrence.

Overwriting state without considering the output requirement can destroy correctness.

## 8. Grouping Pattern

Map a canonical key to a collection of records.

Examples:

- group words by anagram signature;
- group records by tenant;
- group events by category.

The key must capture exactly the equivalence relation required by the problem.

## 9. Canonicalization

Different representations can describe the same logical entity.

Examples:

- normalized case;
- trimmed identifiers;
- sorted-character signatures;
- normalized timestamps.

Canonicalization should be explicit and should not accidentally merge distinct entities.

## 10. Anagram Signature

Words can be grouped using:

```text
sorted characters
```

or a frequency signature.

A frequency signature can avoid sorting every word when the alphabet is appropriately bounded.

## 11. Duplicate Detection

A seen set gives a direct pattern:

```text
for each value:
  if seen → duplicate
  else → add
```

The correctness argument is based on the set representing exactly the previously processed values.

## 12. First Duplicate

Process left-to-right and return when a value already exists in the seen set.

The traversal order establishes that the returned duplicate is the first duplicate under the chosen definition.

## 13. First Unique Value

Two passes are often simple and robust:

```text
pass 1 → frequencies
pass 2 → first frequency-1 value
```

A one-pass design may be possible but needs more state.

## 14. Longest Distinct Range

Combine hashing with a moving boundary.

Typical state:

```text
value → latest index
left boundary
```

When a duplicate appears inside the current range, move the boundary beyond its previous occurrence.

This combines:

```text
hash map + sliding window
```

## 15. Prefix State + Hashing

Store prefix states to detect relationships between earlier and current positions.

The general pattern is:

```text
current state
→ derive required previous state
→ lookup it
```

## 16. Prefix Sum + Hash Map

For target subarray sum `K`:

```text
needed = currentPrefix - K
```

If `needed` appeared earlier, the intervening range has sum `K`.

Store frequencies when counting all ranges.

## 17. Earliest Prefix State

For longest-range problems, store the earliest occurrence of each state.

The later the second occurrence and earlier the first occurrence, the longer the candidate range.

## 18. Frequency of Prefix States

For counting problems, store the number of times each state has appeared.

Every matching previous state creates another valid range boundary pair.

## 19. Balance-State Pattern

Transform categories into numeric contributions.

Example:

```text
A → +1
B → -1
```

Equal prefix balances imply equal counts between the two boundaries.

This is a general state-design technique.

## 20. Modular-State Pattern

For divisibility conditions, reduce a cumulative value to a remainder class.

Equal remainders imply a difference divisible by the modulus.

Normalize JavaScript negative remainders consistently.

## 21. XOR-State Pattern

For XOR properties:

```text
needed = currentXor ^ target
```

Store previous XOR states in a map.

This is the XOR analogue of prefix-sum hashing.

## 22. State Compression

The best hash key is often a compressed representation of the relevant history.

Examples:

- integer balance;
- remainder;
- bitmask;
- tuple of small counters;
- canonical string.

The goal is to retain exactly the information needed by the transition.

## 23. Bitmask State

When the domain is small, a bitmask can represent membership state compactly.

This is useful for:

- character parity;
- subset membership;
- small feature combinations.

## 24. Collision Semantics

A hash map abstracts collision handling, but algorithmic correctness must still rely on logical key equality rather than hash identity alone.

Probabilistic hashing introduces additional collision risk and therefore requires a documented correctness policy.

## 25. JavaScript Map and Set

Prefer `Map` when keys should retain their JavaScript identity/value semantics without object-property coercion.

Prefer `Set` for membership.

Plain objects can be useful for controlled string-key dictionaries, but inherited properties and special keys require care.

## 26. Complexity

Typical hash-pattern solution:

```text
Time: expected O(N)
Space: O(N)
```

But include:

- key construction cost;
- canonicalization cost;
- memory overhead;
- worst-case lookup considerations.

## 27. Hashing vs Sorting

For duplicate/frequency tasks:

```text
hashing → expected linear
sorting → O(N log N)
```

Sorting may still be useful when ordered output or deterministic grouping is required.

Do not choose by Big-O alone; consider memory and workload characteristics.

## 28. Hashing vs Binary Search

For repeated membership queries:

- hashing can provide expected constant-time lookup;
- sorted data can provide logarithmic lookup and ordered operations.

The required operation determines the useful structure.

## 29. Hashing + Sliding Window

This composition is one of the most important patterns in Phase 10.

Examples:

- longest substring without repetition;
- at-most-K distinct;
- minimum covering window.

The window defines the active state; hashing stores its frequency or last-seen information.

## 30. Hashing + Prefix State

Another core composition:

```text
prefix state
+
hash lookup
=
subarray property in expected O(N)
```

This pattern appears in sums, XOR, balances, modular constraints, and custom state machines.

## 31. Backend Applications

Hash patterns are foundational for:

- idempotency keys;
- request deduplication;
- cache lookup;
- authorization maps;
- tenant grouping;
- event deduplication;
- unique identifier validation;
- aggregation.

## 32. AI Applications

Applications include:

- candidate deduplication;
- vocabulary frequency;
- token statistics;
- exact memoization;
- label counting;
- feature grouping;
- prefix-state sequence algorithms.

## 33. Correctness Invariants

### Seen Set

> The set contains exactly the distinct values processed before the current item.

### Frequency Map

> The stored count equals the number of processed occurrences for every tracked key.

### Latest Index

> The stored index is the latest processed occurrence of the key.

### Prefix State

> The map contains exactly the required earlier states under the selected indexing convention.

## 34. Common Mistakes

1. Storing the wrong state for the requested output.
2. Forgetting the initial prefix state.
3. Mishandling duplicate frequencies.
4. Canonicalizing too aggressively.
5. Using an object without considering key semantics.
6. Ignoring key-computation cost.
7. Assuming probabilistic hashes are exact without a collision policy.
8. Forgetting memory usage.
9. Overwriting earliest occurrence when longest-range logic needs it.
10. Using hashing when ordered output is central.

## 35. Edge Cases

Test:

- empty input;
- singleton;
- all duplicates;
- all unique;
- negative numbers;
- zero;
- target zero;
- repeated prefix states;
- Unicode strings;
- empty tokens;
- normalization collisions;
- large frequency counts.

## 36. Interview Framework

When hashing appears promising:

```text
1. What past information is needed?
2. Can it be represented as a key?
3. Do I need membership, count, first index, latest index, or all indices?
4. Can a prefix state expose the answer?
5. Can a canonical representation define equivalence?
6. What is the expected complexity?
7. What memory does the map require?
8. What happens with duplicates and edge cases?
```

## 37. Revision Checklist

- [ ] I can choose Set vs Map.
- [ ] I can design frequency maps.
- [ ] I can design index maps.
- [ ] I understand complement lookup.
- [ ] I can group by canonical keys.
- [ ] I understand prefix-state hashing.
- [ ] I can solve balance/modulo/XOR state problems.
- [ ] I can combine hashing with sliding windows.
- [ ] I can analyze memory and key costs.
- [ ] I can explain backend and AI applications.

## 38. Key Takeaways

1. **Hashing is a state-retrieval pattern: store exactly the past information needed to answer the current step.**
2. **Set, frequency map, index map, and grouped map represent different problem requirements.**
3. **Prefix-state hashing turns relationships between earlier and current states into subarray solutions.**
4. **The hardest part is often designing the right key/state, not calling `Map.get()`.**
5. **Expected `O(N)` is valuable, but memory, key cost, ordering requirements, and collision semantics remain part of the engineering analysis.**
