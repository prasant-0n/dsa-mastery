# 00.6 — Arrays

## 1. Why Arrays Matter for DSA

Arrays are one of the most important data structures in algorithmic problem solving.

They provide:

- ordered storage
- indexed access
- predictable traversal
- compact representation of sequences
- a foundation for many advanced techniques

A large portion of DSA problems can be reduced to reasoning about an indexed sequence.

---

## 2. Array Mental Model

Think of an array as an ordered sequence of positions:

```text
index:   0    1    2    3    4
        ┌────┬────┬────┬────┬────┐
value:  │ 10 │ 20 │ 30 │ 40 │ 50 │
        └────┴────┴────┴────┴────┘
```

For an array of length `n`, valid indexes are:

```text
0 ... n - 1
```

The number of elements and the largest valid index are different concepts.

---

## 3. Creating Arrays

```js
const numbers = [10, 20, 30];
const empty = [];
const repeated = Array(5).fill(0);
```

Be careful with nested arrays and shared references. For example:

```js
const rows = Array(3).fill([]);
```

creates three references to the **same array**, not three independent rows.

Prefer:

```js
const rows = Array.from({ length: 3 }, () => []);
```

---

## 4. Indexed Access

Reading an element by index is constant-time in the normal JavaScript array model.

```js
const value = numbers[1];
```

Updating an existing position is also typically `O(1)`:

```js
numbers[1] = 99;
```

This is why arrays are excellent when an algorithm needs frequent direct access by position.

---

## 5. Traversal

### Indexed traversal

```js
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

### Value traversal

```js
for (const value of arr) {
    console.log(value);
}
```

Use indexed traversal when you need the position. Use value traversal when you only need values.

---

## 6. Length

```js
arr.length
```

returns the current array length.

Do not confuse:

```text
last index = arr.length - 1
length     = number of elements
```

For an empty array:

```js
[].length === 0;
```

There is no valid last index.

---

## 7. Adding and Removing Elements

### End of array

```js
arr.push(value);
arr.pop();
```

These are typically `O(1)` amortized operations.

### Beginning of array

```js
arr.unshift(value);
arr.shift();
```

These generally require shifting other elements, making them `O(n)`.

This difference matters when designing high-volume data processing code.

---

## 8. Inserting at an Index

```js
arr.splice(index, 0, value);
```

Insertion in the middle generally requires shifting elements, so it is `O(n)`.

Similarly:

```js
arr.splice(index, 1);
```

may require shifting subsequent elements.

Don't assume every built-in array method is constant time.

---

## 9. Searching

A basic linear search is:

```js
function findIndex(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }

    return -1;
}
```

Worst-case time: `O(n)`

Auxiliary space: `O(1)`

Later, sorted arrays will let us improve certain searches to `O(log n)` using binary search.

---

## 10. Copying Arrays

These create a shallow copy:

```js
const copy1 = [...arr];
const copy2 = arr.slice();
```

The important word is **shallow**.

For primitive values, this is usually straightforward. For nested objects or arrays, referenced objects remain shared.

```js
const original = [{ value: 1 }];
const copy = [...original];

copy[0].value = 99;
```

The object inside `original` is also changed because both arrays reference the same object.

---

## 11. Mutation vs Non-Mutation

Mutating operations include examples such as:

```js
push
pop
shift
unshift
splice
sort
reverse
```

Non-mutating approaches include:

```js
slice
map
filter
concat
```

Modern JavaScript also provides non-mutating counterparts such as:

```js
toSorted()
toReversed()
toSpliced()
```

For algorithmic work, always know whether the input is being changed.

---

## 12. Reverse Traversal

```js
for (let i = arr.length - 1; i >= 0; i--) {
    console.log(arr[i]);
}
```

Reverse traversal is fundamental for:

- suffix computations
- right-to-left scans
- monotonic structures
- dynamic programming
- two-pointer techniques

The algorithm is still `O(n)` because each element is visited once.

---

## 13. Step-Based Traversal

A loop does not have to move one position at a time.

```js
for (let i = 0; i < arr.length; i += 2) {
    // process every second element
}
```

The important question is not the exact step size but how the number of iterations grows relative to input size.

---

## 14. Prefix and Suffix Thinking

Arrays become much more powerful when you stop viewing each element in isolation.

For example, a prefix sum array can store cumulative information:

```js
const prefix = new Array(arr.length);
let sum = 0;

for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    prefix[i] = sum;
}
```

This basic idea leads to efficient range-query techniques later.

---

## 15. Two-Dimensional Arrays

An array can contain arrays:

```js
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
```

Access:

```js
matrix[row][column]
```

Traversal:

```js
for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
        console.log(matrix[row][column]);
    }
}
```

For an `r × c` matrix, visiting every cell is `O(r × c)`.

---

## 16. Sparse Arrays

JavaScript arrays can contain holes:

```js
const arr = [];
arr[5] = 10;
```

Now the array has length `6`, but indexes `0` through `4` are empty slots.

For beginner DSA work, avoid relying on sparse-array behavior unless the problem specifically requires it. Prefer dense arrays with deliberate values.

---

## 17. Numeric Data and JavaScript Numbers

JavaScript uses `number` for ordinary numeric values and represents them using IEEE 754 double-precision floating point.

For integer algorithms, remember the safe integer boundary:

```js
Number.MAX_SAFE_INTEGER
Number.MIN_SAFE_INTEGER
```

For exact integers beyond that range, JavaScript provides `BigInt`.

Most normal DSA integer problems stay within safe integer limits, but production systems processing very large identifiers or counts require deliberate consideration.

---

## 18. Array Methods: Know Their Cost

Common methods should be understood rather than memorized as syntax.

| Operation | Typical complexity |
|---|---:|
| `arr[i]` | `O(1)` |
| `arr[i] = x` | `O(1)` |
| `push` | `O(1)` amortized |
| `pop` | `O(1)` |
| `shift` | `O(n)` |
| `unshift` | `O(n)` |
| `splice` | `O(n)` in general |
| linear search | `O(n)` |
| `slice` | `O(k)` for copied elements |
| `map` | `O(n)` |
| `filter` | `O(n)` |
| `sort` | implementation-dependent; don't assume `O(n)` |
| `reverse` | `O(n)` |

`k` represents the number of elements copied where appropriate.

---

## 19. Arrays in Backend Engineering

Arrays appear everywhere in backend systems:

- batches of records
- request payloads
- query results
- event streams represented in memory
- pagination results
- processing pipelines
- queues and buffers
- sorted result sets

But a JavaScript array is not automatically the best structure for every operation.

For example, repeatedly removing items from the front of a large array can cause unnecessary work. Later we will study queues and deques that are better suited to such workloads.

---

## 20. Arrays in AI Engineering

Arrays are fundamental representations for numerical data:

```text
feature vector
embedding
batch
matrix
sequence
```

For example:

```js
const embedding = [0.12, -0.42, 0.91, 0.33];
```

Many AI algorithms perform repeated traversal and arithmetic over arrays. Understanding indexing, memory, copying, and iteration cost is therefore foundational for later work on vectors, similarity search, matrices, and retrieval systems.

---

## 21. Common Mistakes

- Using `arr.length` as the last index.
- Accessing `arr[arr.length]` expecting the last element.
- Using `shift()` repeatedly on large arrays without considering its cost.
- Mutating an array when the algorithm requires the original input.
- Assuming spread syntax performs a deep copy.
- Accidentally creating shared nested arrays with `Array(n).fill([])`.
- Modifying an array while traversing it without reasoning about index movement.
- Confusing an array's length with the number of valid elements in sparse arrays.
- Assuming every built-in method is `O(1)`.

---

## 22. DSA Mental Model

Whenever you use an array, ask:

```text
1. What does each index represent?
2. What does each value represent?
3. Do I need index access?
4. Do I need ordered traversal?
5. Am I reading or mutating?
6. Where are the boundaries?
7. How many elements will I visit?
8. Am I shifting elements unnecessarily?
9. Do I need a copy?
10. Is another data structure more appropriate?
```

This mindset is more important than memorizing array methods.

---

## 23. Exercises

1. Return the first element of an array safely, including the empty-array case.
2. Return the last element without hard-coding an index.
3. Traverse an array from left to right and return its sum.
4. Traverse an array from right to left and return its sum.
5. Find the minimum and maximum values in one traversal.
6. Reverse an array in place using two pointers.
7. Return a new reversed copy without changing the input.
8. Insert a value at a given index without using `splice`.
9. Remove a value at a given index without using `splice`.
10. Move all elements one position to the right in place.
11. Build a prefix-sum array.
12. Given a matrix, calculate the sum of every cell.
13. Traverse only the main diagonal of a square matrix.
14. Determine whether an array is a palindrome.
15. Implement linear search and explain its best-case and worst-case complexity.
16. Demonstrate the difference between a shallow array copy and a nested-object copy.
17. Demonstrate why repeatedly using `shift()` can be problematic for large arrays.
18. Create a `3 × 3` matrix without accidentally sharing row references.

---

## 24. Self-Check

- [ ] I understand array indexes and boundaries.
- [ ] I understand direct access vs traversal.
- [ ] I know the typical costs of `push`, `pop`, `shift`, `unshift`, and `splice`.
- [ ] I understand shallow copying.
- [ ] I can distinguish mutating and non-mutating operations.
- [ ] I can traverse forward and backward.
- [ ] I can reason about nested-array complexity.
- [ ] I understand why array methods still have algorithmic costs.
- [ ] I can explain when an array is a poor choice.
- [ ] I can connect arrays to backend data processing and AI numerical data.
