# 00.7 — Objects

## 1. Why Objects Matter for DSA

JavaScript objects provide key-value storage and are fundamental to understanding how structured data is represented.

They are especially important before learning hashing because many DSA techniques need to answer questions such as:

```text
Have I seen this value?
What information belongs to this key?
How can I associate a value with metadata?
```

Objects also appear constantly in backend code as records, configuration, request data, and domain entities.

---

## 2. Object Mental Model

Think of an object as a collection of properties:

```js
const user = {
    name: 'Prasanta',
    age: 25,
};
```

Conceptually:

```text
key       → value
───────────────
name      → 'Prasanta'
age       → 25
```

Unlike arrays, objects are primarily about **named properties**, not positional indexes.

---

## 3. Creating Objects

```js
const user = {};

const product = {
    id: 101,
    name: 'Ring',
    price: 5000,
};
```

Properties can be added later:

```js
product.stock = 10;
```

For algorithmic code, prefer clear and deliberate object shapes rather than constantly changing structure without reason.

---

## 4. Reading Properties

Dot notation:

```js
product.price;
```

Bracket notation:

```js
product['price'];
```

Bracket notation becomes important when the property name is dynamic:

```js
const key = 'price';
console.log(product[key]);
```

A common beginner mistake is:

```js
product.key
```

which looks for a literal property named `key`, rather than the value stored in the variable `key`.

---

## 5. Adding, Updating, and Deleting

```js
const user = {};

user.name = 'A';
user.name = 'B';
delete user.name;
```

These operations are conceptually simple, but their performance depends on the underlying JavaScript engine and object usage pattern.

For algorithmic reasoning, don't automatically treat arbitrary object operations as a universal substitute for a formal hash table. JavaScript's `Map` is often a better semantic choice when the actual requirement is key-value hashing.

---

## 6. Checking for a Property

These are not equivalent:

```js
obj.key !== undefined
```

and

```js
Object.hasOwn(obj, 'key')
```

The first checks the retrieved value and can be ambiguous when a property intentionally contains `undefined`.

`Object.hasOwn()` explicitly asks whether the object owns the property.

This distinction matters in frequency maps and data-processing code.

---

## 7. Own Properties vs Inherited Properties

JavaScript objects can have prototypes.

```js
const obj = {};
```

`obj` inherits properties and behavior through its prototype chain.

Therefore, when you need to inspect an object's own data, prefer deliberate checks such as:

```js
Object.hasOwn(obj, key);
```

Do not assume every property visible through lookup was explicitly stored on that object.

---

## 8. Enumerating Objects

Common techniques include:

```js
Object.keys(obj);
Object.values(obj);
Object.entries(obj);
```

Example:

```js
const scores = {
    alice: 10,
    bob: 20,
};

for (const [name, score] of Object.entries(scores)) {
    console.log(name, score);
}
```

Enumeration is proportional to the number of properties being inspected, so iterating all properties is typically `O(n)` where `n` is the number of properties.

---

## 9. Computed Property Names

Dynamic keys can be created using brackets:

```js
const key = 'status';

const result = {
    [key]: 'active',
};
```

This becomes useful when building lookup structures dynamically.

---

## 10. Objects as Records

Objects are excellent for representing structured records:

```js
const order = {
    id: 1001,
    customerId: 42,
    total: 15000,
    status: 'paid',
};
```

This is different from using an object primarily as a lookup table.

```text
Record object:
    describes ONE thing

Lookup object:
    associates MANY keys with values
```

Keeping these mental models separate will make later data-structure decisions easier.

---

## 11. Objects as Lookup Tables

A simple lookup table can be represented as:

```js
const prices = {
    gold: 7000,
    silver: 100,
};

console.log(prices['gold']);
```

This can be useful when keys are known and naturally represented as strings.

However, for general-purpose hashing, `Map` usually communicates the intent more clearly and handles arbitrary key types directly.

---

## 12. Frequency Counting Preview

Objects can be used to count occurrences:

```js
const frequency = {};

for (const value of arr) {
    frequency[value] = (frequency[value] ?? 0) + 1;
}
```

This is a preview of a major DSA pattern: **frequency counting**.

We will study hashing formally later.

Important: keys on ordinary objects are property keys, so non-symbol keys are coerced to strings. This can produce behavior that differs from `Map`.

---

## 13. The `Map` Distinction

JavaScript provides `Map` specifically for key-value associations:

```js
const map = new Map();

map.set('apple', 3);
map.set('banana', 5);

console.log(map.get('apple'));
```

A `Map` can use objects, arrays, functions, and other values as keys without converting them to strings.

For example:

```js
const a = {};
const b = {};

const map = new Map();
map.set(a, 'first');
map.set(b, 'second');
```

This distinction becomes central in the Hashing phase.

---

## 14. Object vs Map

| Requirement | Object | `Map` |
|---|---|---|
| Structured record | Excellent | Usually unnecessary |
| Named fields | Excellent | Less natural |
| Arbitrary key types | No | Yes |
| Explicit key-value API | Limited | Excellent |
| Easy size tracking | `Object.keys()` | `map.size` |
| DSA frequency/lookup table | Sometimes | Often preferred |
| Prototype concerns | Yes | No object prototype chain for entries |

Don't choose based only on habit. Choose based on the data model.

---

## 15. Object References

Objects are reference values.

```js
const original = { count: 1 };
const alias = original;

alias.count = 2;
```

Now:

```js
original.count === 2;
```

Both variables refer to the same object.

This is one of the most important concepts to master before manipulating nested data structures.

---

## 16. Shallow Copy

Common shallow-copy techniques include:

```js
const copy1 = { ...original };
const copy2 = Object.assign({}, original);
```

The top-level object is different:

```js
copy1 !== original;
```

But nested objects remain shared:

```js
const original = {
    profile: {
        name: 'A',
    },
};

const copy = { ...original };
copy.profile.name = 'B';
```

`original.profile.name` is now also `'B'`.

---

## 17. Destructuring

Objects can be destructured:

```js
const user = {
    name: 'A',
    age: 25,
};

const { name, age } = user;
```

This is useful for readability, especially when passing structured data into functions.

Remember that destructuring does not magically deep-copy nested objects.

---

## 18. Optional Chaining

Optional chaining safely accesses potentially missing nested properties:

```js
const city = user.address?.city;
```

This is useful in production data-processing code, but don't use it blindly in an algorithm where a missing property should represent an invalid state. Sometimes explicit validation is more correct.

---

## 19. Nullish Coalescing

Use `??` when you want a fallback only for `null` or `undefined`:

```js
const count = frequency[key] ?? 0;
```

This is often preferable to `||` in algorithms because valid values such as `0`, `false`, or `''` should not necessarily trigger the fallback.

---

## 20. Object Property Ordering

Modern JavaScript defines rules for property enumeration order, but objects should not be treated as a replacement for an ordered sequence when ordering is the actual requirement.

If your algorithm fundamentally depends on positional ordering, use an array or another data structure whose semantics express that requirement.

---

## 21. Backend Applications

Objects are everywhere in backend systems:

- request bodies
- response DTOs
- configuration
- domain records
- serialized JSON
- validation data
- aggregation results
- metadata

Example:

```js
const response = {
    data: records,
    pagination: {
        page: 1,
        limit: 20,
    },
};
```

A backend engineer should be able to distinguish a data record from a lookup structure and select the appropriate data structure accordingly.

---

## 22. AI Applications

Objects frequently represent metadata associated with numerical data:

```js
const document = {
    id: 'doc-123',
    embedding: [0.1, -0.2, 0.7],
    metadata: {
        source: 'manual',
        page: 12,
    },
};
```

A retrieval pipeline may combine arrays for vectors with objects for metadata.

Later, this distinction becomes important when implementing vector search, ranking, and retrieval pipelines.

---

## 23. Common Mistakes

- Confusing `obj.key` with `obj[key]`.
- Assuming objects are ordered arrays.
- Using an object as a general-purpose hash map without understanding property-key coercion.
- Forgetting inherited properties.
- Treating `undefined` as proof that a property does not exist.
- Assuming spread syntax performs a deep copy.
- Mutating nested data through a shallow copy.
- Using `||` when `0` or `false` is a valid value.
- Repeatedly calling `Object.keys()` inside a loop without considering the cost.
- Using an object when `Map` better expresses the algorithm.

---

## 24. DSA Mental Model

Whenever you reach for an object, ask:

```text
1. Am I representing one record?
2. Am I representing a lookup table?
3. What are my keys?
4. Are keys naturally strings?
5. Do I need arbitrary key types?
6. Do I need insertion/lookup/delete semantics?
7. Am I relying on property existence or property value?
8. Is this data shared by reference?
9. Am I mutating nested state?
10. Would Map, Set, or an array express the requirement better?
```

This decision-making skill is more important than memorizing object syntax.

---

## 25. Exercises

1. Create an object representing a product with `id`, `name`, `price`, and `stock`.
2. Read and update a property using both dot and bracket notation.
3. Write a function that safely checks whether an object owns a given property.
4. Return all keys, values, and entries of an object.
5. Build a frequency table for an array using an object.
6. Build the same frequency table using `Map` and compare the two implementations.
7. Write a function that converts an array of objects into a lookup object keyed by `id`.
8. Demonstrate the difference between `obj.key` and `obj[key]`.
9. Demonstrate aliasing with two variables referencing the same object.
10. Demonstrate a shallow copy where a nested object remains shared.
11. Create a nested object and safely read a deeply nested optional property.
12. Create a counter where `0` is a valid value and demonstrate why `??` can be safer than `||`.
13. Given an array of records, group them by a property. Do not use `Map` yet; use an object and document the key assumptions.
14. Explain when you would choose an array, object, or `Map` for a given problem.

---

## 26. Self-Check

- [ ] I understand objects as key-value structures.
- [ ] I know dot vs bracket notation.
- [ ] I understand dynamic keys.
- [ ] I can enumerate object properties.
- [ ] I understand own vs inherited properties.
- [ ] I understand object references and shallow copies.
- [ ] I know why `Map` is different from an object.
- [ ] I can implement basic frequency counting.
- [ ] I understand `??` vs `||`.
- [ ] I can choose between array, object, and `Map` based on semantics.
- [ ] I can explain how objects appear in backend and AI data models.
