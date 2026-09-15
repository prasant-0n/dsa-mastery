# 01.6 — Edge Cases, Defensive Reasoning & Failure Modes

> Robust algorithmic thinking means reasoning not only about the normal path, but also about the smallest, largest, empty, malformed, duplicated, adversarial, and boundary inputs allowed by the contract.

## Learning Objectives

By the end of this chapter, you should be able to:

- Derive edge cases from constraints instead of memorizing lists.
- Separate valid boundary cases from invalid inputs.
- Identify failure modes before implementation.
- Reason about empty, singleton, duplicate, ordered, reversed, and extreme inputs.
- Understand off-by-one, overflow, mutation, aliasing, and termination failures.
- Build adversarial test cases systematically.
- Distinguish defensive programming from silently changing an algorithm's contract.
- Apply failure-mode reasoning to backend and AI systems.

---

## 1. Why Edge Cases Matter

Most algorithm bugs are not caused by the main idea being completely wrong.

They often occur at boundaries:

```text
empty input
first element
last element
minimum value
maximum value
single candidate
all values equal
no valid answer
multiple valid answers
```

A robust algorithm handles every input covered by its contract.

Therefore:

> Edge-case reasoning is part of algorithm design, not merely testing after implementation.

---

## 2. Normal Cases vs Boundary Cases

A normal case exercises the common path.

A boundary case stresses where an assumption changes.

Example:

```js
for (let i = 0; i < nums.length; i++) {
  // ...
}
```

Important boundaries include:

```text
i = 0
 i = nums.length - 1
nums.length = 0
nums.length = 1
```

Instead of asking:

> “What edge cases should I memorize?”

ask:

> “Where can the algorithm's assumptions change?”

---

## 3. Deriving Edge Cases from Constraints

Suppose:

```text
1 <= n <= 100,000
-10^9 <= nums[i] <= 10^9
```

Immediately derive:

- `n = 1`
- `n = 100,000`
- values at `-10^9`
- values at `10^9`
- all minimum values
- all maximum values
- duplicates
- increasing order
- decreasing order

If the constraint instead allows:

```text
0 <= n <= 100,000
```

then the empty input becomes a required case.

Constraints are therefore also a test-generation specification.

---

## 4. The Edge-Case Matrix

For many array/string problems, begin with this matrix:

| Dimension | Cases |
|---|---|
| Size | empty, 1, 2, large |
| Values | minimum, maximum, zero, negative |
| Distribution | unique, duplicate, all equal |
| Order | sorted, reverse sorted, random |
| Target | absent, first, last, repeated |
| Structure | already optimal, worst arrangement |
| Output | empty, singleton, full input |
| Mutation | mutable, shared, aliased |

You do not always need every combination. Use the contract and algorithm to select meaningful combinations.

---

## 5. Empty Input

Empty inputs expose assumptions about “the first element,” “the last element,” and initialization.

Potential failures:

```js
const first = nums[0];
```

returns `undefined` when the array is empty.

Or:

```js
let max = nums[0];
```

may create an invalid initial state if the contract does not permit empty arrays.

The correct response depends on the contract:

- return a defined sentinel,
- return `undefined`,
- throw an error,
- or explicitly require non-empty input.

Do not invent behavior silently.

---

## 6. Singleton Input

A one-element input tests whether the algorithm incorrectly assumes two or more elements.

Examples:

- pair problems,
- adjacent comparisons,
- linked-list deletion,
- tree traversal,
- partitioning,
- sliding windows.

For example, a two-pointer algorithm should define what happens when:

```text
left === right
```

before attempting to use two distinct elements.

---

## 7. Two-Element Input

Two elements are especially useful for pair-based algorithms.

Test:

```text
valid pair
invalid pair
duplicate values
same value used incorrectly
```

This often exposes incorrect loop boundaries such as:

```js
for (let j = 0; j < nums.length; j++) {
```

when the pair requires `j > i`.

---

## 8. Duplicate Values

Duplicates break assumptions that values are unique.

Examples:

```text
[5, 5]
[1, 2, 2, 3]
[a, a, a]
```

Ask:

- Can the same value appear more than once?
- Can the same index be used twice?
- Does “unique” mean unique values or unique positions?
- Does the algorithm preserve duplicate counts?

These are different contracts.

---

## 9. All Values Equal

An input such as:

```text
[7, 7, 7, 7, 7]
```

is an excellent stress test.

It exposes:

- incorrect equality handling,
- infinite pointer movement,
- duplicate assumptions,
- unstable partition logic,
- incorrect binary-search boundaries.

Whenever equality affects control flow, test all-equal data.

---

## 10. Sorted and Reverse-Sorted Inputs

Order-sensitive algorithms should be tested against:

```text
already sorted
reverse sorted
nearly sorted
all equal
```

These inputs can represent best-case or worst-case structures.

They also reveal whether an algorithm accidentally depends on a particular input arrangement.

---

## 11. Target at Boundaries

For search problems, always consider:

```text
target at first index
target at last index
target absent before all values
target absent after all values
target between two values
```

Binary search bugs frequently appear here because the implementation must update both boundaries correctly.

---

## 12. Off-by-One Errors

An off-by-one error occurs when a boundary is shifted by one position.

Typical forms:

```js
i < n
```
vs
```js
i <= n
```

or:

```js
right = mid - 1
```
vs
```js
right = mid
```

A systematic approach is to define the interval explicitly.

### Closed interval

```text
[left, right]
```

contains both endpoints.

### Half-open interval

```text
[left, right)
```

contains `left` but excludes `right`.

Choose one convention and preserve it consistently.

---

## 13. Boundary Invariants

Boundary bugs become easier when the interval's meaning is explicit.

For example:

```text
[left, right]
```

might mean:

> Every possible target position not yet eliminated is inside this interval.

Then every update must preserve that statement.

This connects directly to the invariant work from 01.5.

---

## 14. Negative Numbers and Zero

Algorithms often accidentally assume positive values.

Test:

```text
negative
zero
positive
mixed signs
```

This matters for:

- sums,
- products,
- modulo,
- sliding windows,
- prefix sums,
- maximum/minimum,
- sorting,
- arithmetic conditions.

For example, a sliding-window sum technique that relies on non-negative values may fail when negative values are introduced.

The problem is not “negative numbers are an edge case.”

The problem is that the algorithm's monotonicity assumption has disappeared.

---

## 15. Numeric Boundaries in JavaScript

JavaScript `Number` uses IEEE-754 double precision.

Integer calculations are exact only within the safe integer range:

```js
Number.MIN_SAFE_INTEGER
Number.MAX_SAFE_INTEGER
```

For DSA problems involving very large integers, determine whether:

- values remain safely representable,
- `BigInt` is required,
- multiplication/addition can exceed safe precision,
- conversion between `Number` and `BigInt` is involved.

Do not treat numeric overflow as impossible simply because JavaScript does not expose a conventional fixed-width integer overflow model for `Number`.

---

## 16. String Boundary Cases

For strings, test:

```text
""
"a"
"aa"
spaces only
leading/trailing spaces
mixed case
repeated characters
Unicode characters
emoji when relevant
```

Important questions:

- Are comparisons case-sensitive?
- Does whitespace matter?
- Are Unicode code points relevant?
- Is normalization required?
- Does the problem define ASCII-only input?

Do not add expensive Unicode normalization when the contract explicitly guarantees ASCII.

---

## 17. Mutation Failure Modes

Mutation can introduce bugs that are invisible when using isolated examples.

Watch for:

```text
shared references
aliasing
mutation during traversal
input modification
nested-object mutation
```

For example:

```js
const a = [1, 2, 3];
const b = a;
```

Now:

```js
a.push(4);
```

also changes `b`.

If an algorithm's contract says the input must remain unchanged, this is a correctness failure even if the returned value is correct.

---

## 18. Array Mutation During Traversal

This is a classic failure mode:

```js
for (let i = 0; i < nums.length; i++) {
  if (shouldRemove(nums[i])) {
    nums.splice(i, 1);
  }
}
```

After removal, later elements shift left.

Possible solutions include:

- decrementing the index appropriately,
- traversing from right to left,
- building a new result,
- using a controlled write pointer.

The right choice depends on the mutation contract and space requirements.

---

## 19. Failure Modes in Search

Search algorithms commonly fail because of:

- incorrect boundaries,
- missing target handling,
- duplicate handling,
- invalid assumptions about ordering,
- infinite loops,
- incorrect midpoint updates.

For every search algorithm ask:

```text
What region is still possible?
What region has been eliminated?
Why is the elimination safe?
How does the remaining region shrink?
What happens when only one candidate remains?
```

---

## 20. Failure Modes in Recursion

Check:

### Missing base case

The recursion never reaches a terminal state.

### No progress

```js
return solve(n);
```

does not reduce the problem.

### Wrong progress

The problem changes but does not necessarily move toward the base case.

### Incorrect state restoration

Especially important in backtracking when mutable state is shared between branches.

### Excessive depth

A theoretically correct recursive algorithm may fail operationally because of call-stack limits.

---

## 21. Failure Modes in Backtracking

Backtracking commonly requires:

```text
choose
explore
undo
```

The `undo` step is essential.

If a choice is not reverted, the next branch inherits state from the previous branch.

Invariant:

> Before exploring each sibling branch, the shared state represents exactly the choices made on the current path and no choices from completed sibling paths.

---

## 22. Failure Modes in Hashing

Hash-based algorithms can fail when the stored state does not match the intended contract.

Ask:

- Are keys unique?
- Do duplicate occurrences matter?
- Do I need counts or only membership?
- Am I storing indices or values?
- Can keys collide semantically even if their types differ?
- Is insertion happening before or after the lookup for this problem?

The difference between:

```text
seen values
```

and:

```text
frequency counts
```

is algorithmically important.

---

## 23. Failure Modes in Sliding Window

Do not use a sliding window simply because the problem mentions a subarray or substring.

First establish whether the required condition has a monotonic behavior that makes pointer movement safe.

Potential failure:

```text
negative values
```

can make the sum increase and decrease unpredictably as the window changes.

Then:

```text
“move left when invalid”
```

may no longer produce a correct search.

Pattern recognition must always be paired with proof of assumptions.

---

## 24. Adversarial Test Design

Good tests are not random examples. They attack assumptions.

For every algorithm, identify:

```text
Initialization assumptions
Boundary assumptions
Ordering assumptions
Uniqueness assumptions
Range assumptions
Mutation assumptions
Termination assumptions
```

Then construct inputs that violate each assumption **only when that violation is permitted by the contract**.

This produces meaningful adversarial tests.

---

## 25. Minimal Counterexamples

When an algorithm fails, find the smallest input that demonstrates the bug.

Example:

A complicated failing array:

```text
[8, 4, 4, 7, 2, 9, 4]
```

may reduce to:

```text
[2, 2]
```

A minimal counterexample makes the violated assumption obvious.

Use this workflow:

```text
Failure
  ↓
Reduce input
  ↓
Find smallest failing case
  ↓
Identify violated invariant / assumption
  ↓
Fix algorithm
  ↓
Retest original failure
```

This is a powerful debugging skill.

---

## 26. Property-Based Thinking

Instead of testing only exact outputs, test properties that must always hold.

For a sorting algorithm:

```text
output is ordered
AND
output contains the same elements as input
```

For a reverse operation:

```text
reverse(reverse(x)) === x
```

For a set-based deduplication operation:

```text
no duplicate values remain
```

For a cache:

```text
get(k) returns the most recently stored valid value for k
```

Property-based reasoning scales beyond individual examples.

---

## 27. Differential Testing

When you have a trusted brute-force implementation:

```text
small random input
       ↓
┌───────────────┐
│ brute force   │
└──────┬────────┘
       │ expected
       ↓
compare
       ↑ actual
┌──────┴────────┐
│ optimized     │
└───────────────┘
```

If outputs differ, preserve the failing input.

Then minimize it.

This combines:

- correctness,
- testing,
- optimization,
- debugging.

---

## 28. Defensive Programming vs Contract Changes

Defensive programming means protecting valid system behavior against realistic failure modes.

It does **not** mean silently inventing new semantics.

For example, if an algorithm requires a sorted array, you could:

```text
validate sortedness
```

or clearly document:

```text
Precondition: input is sorted.
```

Automatically sorting inside the function may make the function appear safer, but it also changes:

- runtime,
- mutation behavior,
- memory usage,
- caller expectations.

Defensive behavior must be intentional.

---

## 29. Input Validation vs Algorithm Constraints

Distinguish:

### External API boundary

Validate untrusted input.

### Internal algorithm

Rely on documented preconditions when they are guaranteed by the architecture.

For example:

```text
HTTP request → validate
                 ↓
validated service contract
                 ↓
sorted-array algorithm
```

Revalidating expensive invariants deep inside every internal function can create unnecessary overhead.

Production architecture should define where validation belongs.

---

## 30. Backend Failure Modes

Backend algorithms operate under additional failure dimensions:

- concurrency,
- stale state,
- retries,
- partial failure,
- timeouts,
- duplicate requests,
- memory pressure,
- unbounded queues,
- malformed external data.

### Example — Queue

A correct queue algorithm may still fail operationally if:

```text
producer rate > consumer rate
```

for long enough to exhaust memory.

Therefore algorithmic reasoning should include both:

```text
logical correctness
+
resource behavior under workload
```

---

## 31. Backend Edge Cases

### Pagination

Test:

- empty result,
- first page,
- last page,
- page size 1,
- maximum page size,
- deleted records between requests,
- duplicate cursors.

### Rate limiting

Test:

- exactly at limit,
- one request over limit,
- window boundary,
- clock movement assumptions,
- concurrent requests.

### Caching

Test:

- missing key,
- expired key,
- capacity 0/1,
- repeated access,
- eviction boundary,
- overwrite existing key.

---

## 32. AI Failure Modes

AI systems have additional algorithmic edge cases:

- empty retrieval results,
- duplicate candidates,
- identical embeddings,
- zero-length input,
- dimension mismatch,
- extremely large candidate sets,
- approximate-search false negatives,
- ranking ties,
- score normalization differences.

For vector systems, always define:

```text
What happens when there are fewer than K results?
What happens when multiple results have equal scores?
What happens when the query vector has the wrong dimension?
What happens when no candidate satisfies the threshold?
```

Approximate algorithms require especially clear contracts about acceptable error.

---

## 33. Failure-Oriented Design

Before implementing, create a small table:

| Assumption | Failure case | Expected behavior |
|---|---|---|
| non-empty input | `[]` | defined by contract |
| sorted input | unsorted data | reject / document |
| unique values | duplicates | handle / reject |
| valid index | out-of-range | sentinel / error |
| finite input | huge input | resource analysis |
| positive values | negative values | handle / precondition |
| bounded queue | producer overload | backpressure / reject |

This forces assumptions into the open.

---

## 34. A Systematic Edge-Case Workflow

Use this process for every new problem:

```text
1. Read the constraints
        ↓
2. Write the input/output contract
        ↓
3. Identify algorithm assumptions
        ↓
4. Identify boundaries
        ↓
5. Identify state transitions
        ↓
6. Identify termination boundaries
        ↓
7. Construct minimal cases
        ↓
8. Construct worst-case cases
        ↓
9. Construct adversarial cases
        ↓
10. Test the brute-force oracle if available
        ↓
11. Test the optimized solution
        ↓
12. Minimize any failure
```

---

## 35. Edge-Case Checklist

Before declaring a solution complete:

### Input size

- [ ] Empty input, if permitted
- [ ] One element
- [ ] Two elements
- [ ] Maximum allowed size

### Values

- [ ] Minimum allowed value
- [ ] Maximum allowed value
- [ ] Zero
- [ ] Negative values, if permitted
- [ ] Duplicate values
- [ ] All values equal

### Structure

- [ ] Sorted
- [ ] Reverse sorted
- [ ] Nearly sorted
- [ ] Random
- [ ] Worst-case arrangement

### Search / boundaries

- [ ] Target absent
- [ ] Target first
- [ ] Target last
- [ ] Multiple targets
- [ ] Boundary index

### State

- [ ] Empty state
- [ ] Full state
- [ ] State transition at boundary
- [ ] Mutation / aliasing
- [ ] Repeated operation

### Resource behavior

- [ ] Maximum input memory
- [ ] Recursion depth
- [ ] Allocation behavior
- [ ] Worst-case runtime

---

## 36. Interview Framework

When asked, “What edge cases would you test?”, do not recite a memorized list.

Say:

> “I would derive edge cases from the constraints and the algorithm's assumptions. First I would test the smallest valid inputs, then boundary values, duplicates, ordering extremes, absent/present targets, and cases that stress each state transition. I would also test the maximum input size for resource behavior.”

Then give examples specific to the problem.

That demonstrates reasoning rather than memorization.

---

## 37. DSA Mental Model

Think:

```text
What does my algorithm assume?
        ↓
Can the contract permit that assumption to fail?
        ↓
Where are the boundaries?
        ↓
What happens at the smallest state?
        ↓
What happens at the largest state?
        ↓
What happens when values repeat?
        ↓
What happens when no answer exists?
        ↓
What happens at each state transition?
        ↓
Can I construct a minimal counterexample?
```

This is defensive algorithmic reasoning.

---

## 38. Key Takeaways

1. Edge cases are part of correctness.
2. Derive edge cases from constraints and assumptions.
3. Empty and singleton inputs expose initialization bugs.
4. Duplicate values expose uniqueness assumptions.
5. Sorted and reverse-sorted inputs expose ordering assumptions.
6. Boundary targets expose interval errors.
7. Negative values can destroy monotonicity assumptions.
8. Off-by-one bugs are usually boundary-definition failures.
9. Mutation can violate algorithm contracts even when returned values look correct.
10. Recursive algorithms need both a valid base case and measurable progress.
11. Backtracking must restore shared state between branches.
12. Minimal counterexamples make debugging much easier.
13. Property-based tests check deeper correctness than individual examples.
14. Differential testing can use brute force as an oracle.
15. Defensive programming must not silently change the algorithm's contract.
16. Backend and AI algorithms must consider operational failure modes in addition to logical correctness.
17. Robust algorithm engineers attack their own assumptions before production does.

---

## Self-Check

1. How do you derive edge cases from constraints?
2. Why are empty and singleton inputs especially useful?
3. What assumptions should you test for a two-pointer algorithm?
4. Why can negative values invalidate a sliding-window strategy?
5. What is an off-by-one error?
6. Why are all-equal arrays useful adversarial inputs?
7. How can mutation violate an otherwise correct algorithm?
8. What is a minimal counterexample?
9. What is property-based testing?
10. How does differential testing help verify optimized algorithms?
11. What is the difference between validation and changing a contract?
12. Give three backend algorithm failure modes that are not ordinary input-value bugs.
13. Give three AI retrieval edge cases.
14. How would you test a cache at its capacity boundary?
15. Can you identify the assumptions of one algorithm you have already implemented and attack each one with a test?
