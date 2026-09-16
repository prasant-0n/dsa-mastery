# 10.16 — Bit Manipulation Patterns: Masks, XOR, Bitsets & State Compression

## 1. Objective

Bit manipulation represents compact state using individual binary digits. It can turn sets, flags, parity, and small finite-state information into efficient integer operations.

```text
integer bits
→ each bit represents a boolean state
→ bit operations transform many states at once
```

## 2. Why It Exists

Bit-level representations can reduce memory, simplify state transitions, and enable constant-time operations on small fixed universes.

The important DSA skill is not memorizing operators; it is recognizing when the state has a natural binary representation.

## 3. Binary Mental Model

An integer can be represented as powers of two:

```text
13 = 1101₂ = 8 + 4 + 1
```

Each bit position can represent a binary feature.

## 4. Core Operators

JavaScript provides:

```text
&   AND
|   OR
^   XOR
~   NOT
<<  left shift
>>  signed right shift
>>> unsigned right shift
```

Bitwise JavaScript operations operate on signed 32-bit integer representations. This limitation must be considered for larger domains.

## 5. Set / Clear / Toggle / Test

For bit position `p`, define a mask:

```text
1 << p
```

Then conceptually:

```text
set:    x | mask
clear:  x & ~mask
toggle: x ^ mask
test:   x & mask
```

## 6. Bit Masks as Sets

If bit `i` represents element `i`, an integer can encode a subset.

Membership becomes a bit test; insertion and deletion become bit operations.

This is especially useful when the universe is small.

## 7. Enumerating Set Bits

Repeatedly identify and remove the least significant set bit.

The classic transformation is:

```text
x & (x - 1)
```

which clears the lowest set bit.

## 8. Least Significant Set Bit

For nonzero two's-complement integers, `x & -x` isolates the lowest set bit under the relevant fixed-width representation.

In JavaScript, reason carefully about signed 32-bit conversion.

## 9. Popcount

Population count measures the number of set bits.

A straightforward loop can clear one set bit per iteration, making work proportional to the number of set bits rather than word width.

## 10. Parity

XOR is useful for parity because equal values cancel:

```text
x ^ x = 0
x ^ 0 = x
```

For a collection where every value appears twice except one, XOR can isolate the unique value.

## 11. XOR Cancellation

XOR is:

- associative;
- commutative;
- self-inverting.

These properties make it useful for cancellation and prefix-state reasoning.

## 12. Prefix XOR

A prefix XOR state supports range XOR queries because overlapping equal prefixes cancel.

This is analogous to prefix sums but uses XOR algebra instead of addition.

## 13. Missing / Duplicate Values

XOR can identify a missing or unique value when the input model guarantees the necessary pairing structure.

The guarantee is part of the algorithm's correctness contract.

## 14. Power of Two

For a positive integer represented in the relevant fixed-width domain, a power of two has exactly one set bit.

A common test is based on:

```text
x & (x - 1)
```

with explicit handling for zero and signed-width semantics.

## 15. Bit Shifts

Left shifting by `k` conceptually multiplies by `2^k` when no overflow/width conversion changes the interpretation.

Right shifts divide by powers of two with signedness-dependent semantics.

Do not assume arbitrary JavaScript numbers behave like unlimited-width integers under bitwise operators.

## 16. JavaScript Number vs BigInt

JavaScript `Number` is floating-point and bitwise operators coerce operands to signed 32-bit integers.

`BigInt` supports arbitrary-size integers but cannot be mixed directly with `Number` in arithmetic or bitwise operations.

Choose deliberately based on the state domain.

## 17. Subset Enumeration

For `N` small elements, every subset can be represented by an `N`-bit mask.

```text
0 ... (1 << N) - 1
```

Each bit determines inclusion.

The state space is `2^N`, but each state representation is compact.

## 18. Submask Enumeration

For a mask `m`, repeatedly use:

```text
sub = (sub - 1) & m
```

to enumerate its submasks.

This is useful in subset DP and combinatorial optimization.

## 19. Bitmask DP

A bitmask can represent which resources, vertices, tasks, or features have been selected.

A DP state might look like:

```text
DP[mask][last]
```

The approach is exponential in the number of represented entities and is practical only for appropriately small `N`.

## 20. State Compression

Bitmasks are one form of state compression.

Instead of storing many booleans independently, encode them into a compact word or several words.

Compression can reduce memory and improve cache behavior while increasing decoding complexity.

## 21. Bitsets

A bitset represents a large boolean set using packed bits.

Operations such as union, intersection, and difference become word-level operations over chunks.

For universes larger than one machine word, use an array of words rather than pretending one JavaScript integer contains unlimited bits.

## 22. Bitset Intersection

For packed bitsets:

```text
A ∩ B → word[i] = A[i] & B[i]
```

Union uses OR; symmetric difference uses XOR.

Complexity is proportional to the number of machine words processed.

## 23. Bitset Backend Uses

Bitsets can represent:

- feature flags;
- permission sets;
- capability sets;
- compact membership indexes;
- blocked/allowed identifiers;
- scheduling availability.

## 24. Bitset AI Uses

Applications include:

- compact feature presence;
- candidate filters;
- vocabulary/category masks;
- fast set intersections;
- sparse constraint state for small universes.

For large sparse IDs, hash sets or specialized sparse bitsets may be more appropriate.

## 25. Bitmask Graph State

Small graph problems can encode visited vertices as a mask.

This is useful for Hamiltonian-style search, traveling-salesperson DP, and subset reachability.

## 26. Bitmask BFS

When a search state includes both position and a small set of collected features, represent the feature set as a mask:

```text
state = (position, mask)
```

Visited must include both components. Tracking only position can incorrectly merge distinct states.

## 27. Gray Code

Gray-code sequences change one bit between consecutive states.

This can be useful when enumerating subsets while minimizing the number of changed features between adjacent configurations.

## 28. Bit Tricks and Invariants

Every bit trick should be derived from its binary behavior.

Do not treat an expression as magic. Explain what each bit position does before relying on it in production code.

## 29. Complexity

For a single fixed-width integer, common bit operations are treated as constant-time at the algorithmic level.

For a bitset of `W` machine words:

```text
set operation: O(1) or O(W), depending on representation
whole-bitset operation: O(W)
```

Bitmask subset enumeration remains `O(2^N)` states.

## 30. Common Mistakes

1. Forgetting JavaScript bitwise 32-bit coercion.
2. Mixing `Number` and `BigInt`.
3. Using signed shifts without understanding sign extension.
4. Treating a bitmask as scalable to arbitrary `N`.
5. Omitting zero handling in power-of-two tests.
6. Forgetting all relevant state dimensions in visited keys.
7. Claiming bit tricks are universally faster without measurement.
8. Ignoring output size in subset enumeration.

## 31. Edge Cases

Test:

- zero;
- one;
- highest supported bit;
- negative values;
- duplicate values;
- empty subset;
- full subset;
- `N = 0`;
- mask with no set bits;
- mask with all bits set;
- `BigInt` inputs.

## 32. Correctness Proof

For masks, prove each operation changes exactly the intended bit positions.

For XOR algorithms, use associativity, commutativity, and self-cancellation.

For bitmask DP/search, prove that each mask uniquely represents the intended subset and that transitions preserve state semantics.

## 33. Backend Applications

Bit-level state is useful in:

- permission/capability checks;
- feature flags;
- compact status storage;
- membership filtering;
- scheduling availability;
- cache metadata.

## 34. AI Applications

Bit representations can support:

- compact candidate constraints;
- feature masks;
- set-based filtering;
- small-universe state compression;
- combinatorial search;
- subset dynamic programming.

## 35. Testing Strategy

Use:

- binary truth-table tests;
- reference Set comparisons;
- randomized masks;
- property tests for set algebra;
- differential bitset vs boolean-array tests;
- boundary tests around 31/32-bit behavior;
- `Number` vs `BigInt` contract tests.

## 36. Interview Framework

When a problem suggests bit manipulation:

```text
1. Is the state naturally boolean?
2. Is the universe small and bounded?
3. Can one bit represent one state?
4. What does each operator do to each bit?
5. Can XOR cancellation apply?
6. Can the state become a subset mask?
7. Is bitmask DP feasible for the input size?
8. What are JavaScript's integer-width semantics?
9. Would a bitset or hash set be better?
10. What invariant proves the bit transformation?
```

## 37. Revision Checklist

- [ ] I can set, clear, toggle, and test bits.
- [ ] I understand XOR cancellation.
- [ ] I can derive popcount techniques.
- [ ] I can enumerate subsets with masks.
- [ ] I understand submask enumeration.
- [ ] I can design bitmask DP states.
- [ ] I understand bitsets beyond one machine word.
- [ ] I know JavaScript 32-bit bitwise limitations.
- [ ] I can use masks in graph/search states.
- [ ] I can explain backend and AI applications.

## 38. Key Takeaways

1. **Bit manipulation is state representation: each bit can encode a boolean decision or feature.**
2. **XOR's algebraic properties make it especially useful for cancellation and prefix-state techniques.**
3. **Bitmasks turn small-set problems into compact integer states, enabling subset enumeration and bitmask DP.**
4. **For larger universes, bitsets extend the same idea across multiple machine words.**
5. **JavaScript's 32-bit bitwise coercion makes numeric semantics part of the algorithm's correctness contract.**
