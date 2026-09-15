# 03.1 — Array Fundamentals & Memory Model

## Definition

An **array** is an ordered collection of elements accessed by position (index). In JavaScript, `Array` is a dynamic, zero-indexed, mutable collection with behavior that is richer than a fixed-size contiguous array in lower-level languages.

For DSA, the important abstraction is:

> **Given an index, retrieve or update the corresponding element efficiently.**

Arrays are one of the most important structures in DSA because many higher-level techniques—two pointers, sliding windows, prefix sums, binary search, heaps, sorting, dynamic programming tables, and matrix algorithms—operate directly on arrays.

---

## Why It Matters

You should become extremely comfortable with arrays before moving deeper into DSA because arrays teach:

- indexing
- traversal
- positional reasoning
- boundaries
- mutation
- copying
- memory trade-offs
- operation complexity
- in-place algorithms
- subarrays and ranges

A large percentage of interview problems can be reduced to reasoning about an array plus a carefully maintained state.

---

## Mental Model

Think of an array as a row of indexed slots:

```text
index:   0    1    2    3    4
         ↓    ↓    ↓    ↓    ↓
data:   10   20   30   40   50
```

The index identifies **where** an element lives in the logical sequence.

For an array of length `n`, valid indices are:

```text
0 ... n - 1
```

Therefore:

```js
arr[0]       // first element
arr[n - 1]   // last element
arr[n]       // not a valid existing element
```

The most important boundary identity is:

```text
first index = 0
last index  = length - 1
```

---

## JavaScript Arrays

JavaScript arrays are dynamic objects with array-specific engine optimizations. Do **not** assume that every JavaScript array operation has exactly the same memory behavior as a C/C++ fixed-size contiguous array.

For algorithmic analysis, however, we commonly model indexed access as `O(1)` under the standard RAM-style abstraction.

```js
const numbers = [10, 20, 30, 40];

console.log(numbers[2]); // 30
numbers[2] = 99;
```

The logical operation is direct indexed access/update.

---

## Array Size

Use `.length` to obtain the logical number of elements.

```js
const numbers = [10, 20, 30];
console.log(numbers.length); // 3
```

If `n = numbers.length`, then the traversal boundary is normally:

```js
for (let i = 0; i < n; i++) {
  // process numbers[i]
}
```

### Why `< n`?

Because `n` itself is not a valid index.

```text
n = 5
valid indices = 0, 1, 2, 3, 4
```

This single distinction prevents many off-by-one errors.

---

## Core Operations

| Operation | Typical DSA Model | Notes |
|---|---:|---|
| Access by index | `O(1)` | `arr[i]` |
| Update by index | `O(1)` | `arr[i] = x` |
| Traverse | `O(n)` | visit elements |
| Search unsorted array | `O(n)` | may inspect all elements |
| Search sorted array | `O(log n)` | binary search when preconditions hold |
| Append | usually `O(1)` amortized | dynamic-array behavior |
| Remove from end | usually `O(1)` | `pop()` |
| Insert/remove at front | `O(n)` | elements may shift |
| Insert/remove in middle | `O(n)` | elements may shift |
| Copy entire array | `O(n)` | depends on operation |

These are models, not promises about every JavaScript engine implementation or every unusual array shape.

---

## Access vs Search

Do not confuse these two operations.

### Access

You already know the index:

```js
const value = arr[7];
```

The algorithm does not need to inspect preceding elements.

```text
Time: O(1)
```

### Search

You know a value or condition but not its index:

```js
const target = 42;
```

For an unsorted array, you may need to inspect every element.

```text
Time: O(n)
```

This distinction is foundational:

> **Known position → access. Unknown position → search.**

---

## Traversal

A traversal visits elements according to some rule.

```js
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

If the array contains `n` elements and each visit performs `O(1)` work:

```text
Time = Θ(n)
Extra space = Θ(1)
```

Traversal is the base operation behind many array algorithms.

---

## Forward and Reverse Traversal

Forward:

```js
for (let i = 0; i < arr.length; i++) {
  // arr[i]
}
```

Reverse:

```js
for (let i = arr.length - 1; i >= 0; i--) {
  // arr[i]
}
```

Both are `Θ(n)` when every element is visited once.

Direction changes the state transition, not the asymptotic amount of work.

---

## Mutation

JavaScript arrays are mutable.

```js
const arr = [1, 2, 3];
arr[1] = 99;

console.log(arr); // [1, 99, 3]
```

Mutation means the existing array's contents change.

When solving DSA problems, always determine whether the contract permits mutation.

### Why this matters

An in-place algorithm may use:

```text
O(1) auxiliary space
```

while a copying approach may require:

```text
O(n) auxiliary space
```

The answer can therefore change depending on whether mutation is allowed.

---

## Reference Semantics

An array variable holds a reference to an array object.

```js
const a = [1, 2, 3];
const b = a;

b[0] = 99;

console.log(a); // [99, 2, 3]
```

`a` and `b` refer to the same array.

This is different from making a copy:

```js
const a = [1, 2, 3];
const b = [...a];

b[0] = 99;

console.log(a); // [1, 2, 3]
```

The spread creates a new array and copies the element references into it.

---

## Shallow Copy

For primitive elements:

```js
const a = [1, 2, 3];
const b = [...a];
```

The values behave independently.

For nested objects, the copy is shallow:

```js
const a = [{ value: 1 }];
const b = [...a];

b[0].value = 99;

console.log(a[0].value); // 99
```

The outer array is different, but the nested object is shared.

This becomes important when analyzing auxiliary memory and mutation.

---

## Sparse Arrays

JavaScript can represent arrays with missing indices:

```js
const arr = [];
arr[3] = 10;

console.log(arr.length); // 4
```

There are logical positions up to index `3`, but indices `0`, `1`, and `2` were not explicitly assigned.

For DSA practice, prefer dense arrays unless a problem specifically tests sparse behavior. Sparse arrays can have different runtime characteristics and should not be used to make simplistic memory assumptions.

---

## `length` Is Not Always the Number of Assigned Values

```js
const arr = [];
arr[5] = 10;

console.log(arr.length); // 6
```

`length` is based on the highest array index plus one, not necessarily the count of explicitly stored values.

For ordinary dense DSA arrays, these concepts usually coincide.

---

## Array and Memory

At the conceptual DSA level, an array provides efficient positional access because positions can be mapped to locations.

A useful abstraction is:

```text
base + index × element-size
```

This is the classic contiguous-array mental model.

JavaScript engines are more complicated internally, but the abstraction explains why indexed access is modeled as `O(1)`.

### Important distinction

Do not claim:

> “JavaScript arrays are always physically contiguous.”

Instead say:

> “The DSA array abstraction provides constant-time indexed access; JavaScript engines implement arrays with optimized internal representations that may vary.”

That distinction is important for expert-level reasoning.

---

## Dynamic Array Growth

A dynamic array must sometimes allocate more storage as it grows.

Conceptually:

```text
capacity: 4
[ A B C D ]
      ↓ append when full
capacity grows
[ A B C D E ... ]
```

A resize can require copying existing elements, making that particular operation `O(n)`.

With geometric growth, append is generally analyzed as:

```text
O(1) amortized
```

not worst-case `O(1)`.

This connects directly to the amortized analysis from Phase 02.

---

## Insertions and Shifting

Suppose:

```text
[10, 20, 30, 40]
```

Insert `99` at index `1`:

```text
[10, 99, 20, 30, 40]
```

Elements after the insertion point must move.

If `k` elements must shift:

```text
Cost = Θ(k)
```

Worst case:

```text
k = n
Cost = Θ(n)
```

The same reasoning applies to deletion from the front or middle.

---

## `push`, `pop`, `shift`, `unshift`

```js
arr.push(x);     // append
arr.pop();       // remove last
arr.shift();     // remove first
arr.unshift(x);  // insert first
```

Typical algorithmic expectations:

```text
push    → O(1) amortized
pop     → O(1)
shift   → O(n)
unshift → O(n)
```

Why?

Removing or inserting at the front changes the positions of many remaining elements in the array abstraction.

---

## `slice` vs `splice`

These are frequently confused.

### `slice`

Creates a new array and does not mutate the original.

```js
const part = arr.slice(1, 4);
```

Copying `k` elements costs approximately:

```text
O(k)
```

### `splice`

Mutates the original array.

```js
arr.splice(1, 2);
```

Removing/inserting elements can require shifting:

```text
O(n)
```

depending on the position and number of affected elements.

---

## Array Equality

JavaScript does not compare array contents with `===`.

```js
[1, 2] === [1, 2] // false
```

The two expressions create different array objects.

```js
const a = [1, 2];
const b = a;

console.log(a === b); // true
```

This compares references.

Content equality requires an algorithm, such as element-by-element comparison.

If both arrays contain `n` elements, direct content comparison is generally:

```text
O(n)
```

in the worst case.

---

## Bounds and Off-by-One Errors

A classic bug:

```js
for (let i = 0; i <= arr.length; i++) {
  // BUG: i === arr.length is outside the valid index range
}
```

Correct:

```js
for (let i = 0; i < arr.length; i++) {
  // valid indices only
}
```

Always translate the array boundary into a mathematical range:

```text
0 ≤ i < n
```

This invariant is more reliable than memorizing syntax.

---

## Empty Arrays

```js
const arr = [];
```

Then:

```text
length = 0
first index = none
last index = none
```

Never blindly access:

```js
arr[arr.length - 1]
```

without considering the empty case.

A robust algorithm should explicitly understand what its contract says for empty input.

---

## Single-Element Arrays

```js
const arr = [42];
```

This is useful for exposing:

- incorrect two-pointer termination
- bad initialization
- incorrect minimum/maximum assumptions
- off-by-one errors
- incorrect “second element” access

Always test `n = 1` mentally.

---

## Arrays with Duplicates

Do not assume uniqueness unless the problem guarantees it.

```js
[5, 5, 5, 5]
```

Duplicates affect:

- searching
- frequency counting
- two pointers
- sorting
- deduplication
- binary search variants
- interval processing

Constraints determine whether duplicate handling is required.

---

## Arrays of Objects

Arrays frequently store records rather than primitives.

```js
const users = [
  { id: 1, score: 80 },
  { id: 2, score: 95 }
];
```

Traversal remains linear:

```js
for (const user of users) {
  // process user
}
```

But operations involving object fields may have different practical costs than primitive arithmetic, and copying the array is shallow.

---

## Nested Arrays

A matrix can be represented as an array of arrays:

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
```

For `R` rows and `C` columns, visiting every cell costs:

```text
Θ(R × C)
```

This is the foundation for matrix algorithms later in this phase.

---

## Arrays vs Objects / Maps

Choose based on the operation you need.

| Need | Natural Choice |
|---|---|
| Position-based access | Array |
| Preserve ordered sequence | Array |
| Membership / uniqueness | Set |
| Key → value lookup | Map |
| Frequency by key | Map |
| Process in insertion order | Array / Queue depending on operations |

Do not choose a data structure because it is familiar. Choose it because its operations match the workload.

---

## Brute Force Baseline

For many array problems, the first solution is a complete scan.

Example: find the maximum.

```js
function findMax(arr) {
  if (arr.length === 0) return undefined;

  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}
```

Complexity:

```text
Time:  Θ(n)
Space: Θ(1)
```

This simple pattern becomes the basis for much more advanced algorithms.

---

## Correctness Invariant for a Scan

For the maximum example, after processing indices `0 ... i - 1`:

> `max` is the largest value among all processed elements.

Initialization:

```text
max = arr[0]
```

Maintenance:

```text
if arr[i] > max, update max
```

Termination:

```text
all elements processed
```

Therefore `max` is the global maximum.

This connects array programming directly to the invariant reasoning from Phase 01.

---

## Backend Applications

Arrays appear everywhere in backend systems:

- request batches
- query results
- pagination results
- event batches
- log records
- transaction lines
- ranking candidates
- worker queues
- API payload collections
- cache entries
- time-series samples

Examples:

```text
database result → array of records
API response    → array of items
batch job       → array of tasks
Top-K candidates → array of ranked items
```

The key backend question is not merely “Can I use an array?” but:

> **What operations dominate the workload, and does an array make those operations cheap enough?**

---

## AI Applications

Arrays are fundamental in AI engineering:

- token sequences
- embedding vectors
- batches of embeddings
- model inputs
- candidate lists
- logits
- feature vectors
- attention-related data structures
- evaluation datasets

For an embedding:

```text
vector = [x₁, x₂, ..., x_D]
```

A similarity calculation often requires visiting all `D` dimensions:

```text
Θ(D)
```

For `N` candidate vectors with dimension `D`, naive exact comparison against every candidate can become:

```text
Θ(ND)
```

This is why representation and algorithm selection become critical at AI scale.

---

## Common Mistakes

### 1. Confusing index with value

```js
for (let i = 0; i < arr.length; i++) {
  // i is the index
  // arr[i] is the value
}
```

### 2. Using `<=` instead of `<`

```js
// Wrong
for (let i = 0; i <= arr.length; i++) {}
```

### 3. Assuming `arr2 = arr1` copies the array

It copies the reference.

### 4. Assuming all array operations are `O(1)`

Only indexed access/update has the standard constant-time model. Front/middle insertion, deletion, and full copies are different.

### 5. Ignoring empty input

Many initialization bugs appear immediately on `[]`.

### 6. Claiming JavaScript arrays are always contiguous

The abstraction and engine implementation are not identical.

### 7. Forgetting mutation

A method may change the original array or create a new one. Know which.

---

## Edge-Case Checklist

For every array problem, consider:

```text
□ empty array
□ one element
□ two elements
□ all equal
□ duplicates
□ already sorted
□ reverse sorted
□ negative values
□ zero values
□ very large values
□ minimum/maximum valid input size
□ mutation allowed or forbidden
□ sparse input if relevant
```

Do not mechanically test every case when the contract rules one out. Derive the relevant cases from the constraints.

---

## Interview Questions

### Q1. Why is array access usually O(1)?

Because the array abstraction supports direct positional access rather than requiring a scan from the beginning.

### Q2. Why is searching an unsorted array O(n)?

Because the target may be absent or located at the last position, requiring inspection of all elements.

### Q3. Why is inserting at the front O(n)?

Because many existing elements may need to shift to preserve positional ordering.

### Q4. Is `push()` always O(1)?

No. A particular append can trigger resizing. With geometric dynamic-array growth, the standard bound is **O(1) amortized**.

### Q5. What is the difference between an array and a reference to an array?

An array is the object; a variable stores a reference to that object. Multiple variables can reference the same array.

### Q6. What is the difference between `slice()` and `splice()`?

`slice()` creates a new array without mutating the original; `splice()` mutates the original and can require shifting elements.

### Q7. What is the space complexity of scanning an array?

Usually `O(1)` auxiliary space if no additional structure proportional to `n` is created.

---

## Expert Reasoning Pattern

When you receive an array problem, ask:

```text
1. What does each element represent?
2. What does the index represent?
3. What is n?
4. Is the array sorted?
5. Are duplicates allowed?
6. Is mutation allowed?
7. What operation dominates?
8. Do I need access, search, insertion, deletion, or transformation?
9. Can preprocessing change future query cost?
10. What invariant will my algorithm maintain?
```

This converts “I see an array” into algorithmic reasoning.

---

## Revision Checklist

- [ ] I can explain the array abstraction.
- [ ] I understand zero-based indexing.
- [ ] I can derive valid index boundaries.
- [ ] I can distinguish access from search.
- [ ] I know the typical complexity of common array operations.
- [ ] I understand dynamic-array amortization.
- [ ] I understand JavaScript array reference semantics.
- [ ] I understand shallow copying.
- [ ] I can reason about mutation and auxiliary space.
- [ ] I can explain why front insertion/deletion is expensive.
- [ ] I can identify array edge cases.
- [ ] I can write a correct linear scan with an invariant.
- [ ] I can connect arrays to backend workloads.
- [ ] I can connect arrays to AI vectors and candidate processing.

---

## Key Takeaways

1. **An array is fundamentally an ordered, index-addressable sequence.**
2. **Indexed access/update is modeled as O(1).**
3. **Unsorted search is O(n) in the worst case.**
4. **Insertion/deletion away from the end can require shifting and cost O(n).**
5. **Dynamic-array append is typically O(1) amortized, not worst-case O(1).**
6. **JavaScript arrays have reference semantics and mutable contents.**
7. **Array copying and nested references affect space and correctness.**
8. **Valid indices satisfy `0 ≤ i < n`.**
9. **The array abstraction is simpler than the JavaScript engine's internal representation.**
10. **Arrays are the foundation for many advanced DSA patterns and backend/AI workloads.**
