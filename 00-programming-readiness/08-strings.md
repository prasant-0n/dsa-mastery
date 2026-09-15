# 00.8 — Strings

## 1. Why Strings Matter for DSA

Strings are sequences of characters and are among the most common inputs in algorithm problems and backend systems.

String problems introduce important ideas that later appear in:

- arrays
- hashing
- two pointers
- sliding windows
- stacks
- recursion
- dynamic programming
- pattern matching
- text processing

The key mental shift is:

> A string is data that can often be analyzed as a sequence, but JavaScript strings are immutable.

---

## 2. String Mental Model

```js
const word = 'hello';
```

Conceptually:

```text
index:  0  1  2  3  4
        h  e  l  l  o
```

Valid indexes range from:

```text
0 ... word.length - 1
```

You can read a character by index:

```js
word[1]; // 'e'
```

---

## 3. Strings Are Immutable

You cannot directly replace a character in a string:

```js
const word = 'cat';
word[0] = 'b';
```

This does not mutate the string into `bat`.

Instead, create a new string:

```js
const updated = 'b' + word.slice(1);
```

This distinction is critical when reasoning about repeated string modifications.

---

## 4. String Length

```js
const text = 'hello';
console.log(text.length); // 5
```

As with arrays:

```text
length = number of elements
last index = length - 1
```

An empty string has length `0` and no valid character index.

---

## 5. Traversal

### Indexed traversal

```js
for (let i = 0; i < text.length; i++) {
    console.log(text[i]);
}
```

### Value traversal

```js
for (const char of text) {
    console.log(char);
}
```

Use the indexed form when position matters.

---

## 6. Character Access

Common approaches:

```js
text[index];
text.charAt(index);
```

Modern code generally uses bracket access when the intent is simply indexed character access.

---

## 7. Comparing Strings

Strict equality compares strings by their sequence of characters:

```js
'abc' === 'abc'; // true
'abc' === 'abd'; // false
```

Case matters:

```js
'Cat' === 'cat'; // false
```

Never normalize case unless the problem or business requirement says comparison should be case-insensitive.

---

## 8. String Concatenation

```js
const first = 'hello';
const second = 'world';

const result = first + ' ' + second;
```

Template literals are often clearer:

```js
const result = `${first} ${second}`;
```

For algorithmic code, remember that constructing new strings has a cost. Do not assume concatenation is always `O(1)`.

---

## 9. `slice`

`slice` returns part of a string without changing the original:

```js
const text = 'abcdef';
const part = text.slice(1, 4);

// 'bcd'
```

The end boundary is exclusive.

This makes `slice` useful for substring problems, but repeated slicing inside a loop can create unnecessary work.

---

## 10. `substring` and `substr`

`substring()` also extracts a section:

```js
text.substring(1, 4);
```

`substr()` is legacy and should not be used in new code.

For DSA, `slice()` is generally the clearest choice when you need substring extraction.

---

## 11. Searching Within Strings

Common operations include:

```js
text.includes('abc');
text.indexOf('abc');
text.startsWith('abc');
text.endsWith('abc');
```

These are useful, but understand that searching a string is not automatically `O(1)`. The cost depends on the operation and input sizes.

For algorithm problems requiring repeated substring searches, analyze the total work rather than treating each call as free.

---

## 12. Splitting Strings

```js
const words = 'one two three'.split(' ');
```

This creates an array.

For a string of length `n`, splitting generally requires `O(n)` work and creates output proportional to the resulting pieces.

This is convenient but can consume significant memory on large inputs.

---

## 13. Joining Strings

The inverse operation is commonly:

```js
words.join(' ');
```

It creates a new string from the array elements.

For large text processing, prefer deliberate construction strategies instead of repeatedly creating intermediate strings.

---

## 14. Case Conversion

```js
text.toLowerCase();
text.toUpperCase();
```

These return new strings.

Case normalization is often used before case-insensitive comparisons:

```js
text.toLowerCase() === target.toLowerCase();
```

But for Unicode-heavy applications, case conversion can have language-specific behavior. Production text processing should not assume ASCII-only semantics unless the domain guarantees it.

---

## 15. Trimming

```js
text.trim();
text.trimStart();
text.trimEnd();
```

These return new strings.

Useful for processing user input, configuration, and text records.

---

## 16. Whitespace Is Data

Do not automatically assume whitespace should be ignored.

For example:

```text
'hello'
' hello'
'hello '
```

are different strings.

Whether whitespace matters is part of the input contract.

---

## 17. Character Codes

JavaScript provides character-code operations:

```js
const code = 'A'.charCodeAt(0);
const char = String.fromCharCode(65);
```

These are useful for ASCII-oriented algorithm problems.

Be careful: JavaScript strings use UTF-16 code units, so a JavaScript character is not always equivalent to one Unicode code point or one user-perceived character.

---

## 18. Unicode and Code Points

Consider:

```js
const text = '😀';
```

Its `.length` is not `1` because JavaScript string indexing operates on UTF-16 code units.

For code-point-aware iteration:

```js
for (const char of text) {
    console.log(char);
}
```

This is one reason `for...of` and indexed access are not always semantically interchangeable for Unicode text.

For ordinary DSA exercises, the input is often restricted to ASCII or lowercase English letters. Always read the constraints before choosing assumptions.

---

## 19. Converting a String to an Array

```js
const chars = [...text];
```

or:

```js
const chars = Array.from(text);
```

These produce arrays of iterated characters/code points rather than simply exposing UTF-16 code units through ordinary indexing.

This can be useful when an algorithm needs mutable sequence operations.

---

## 20. Building Strings Efficiently

Because strings are immutable, repeated reconstruction deserves attention.

Instead of repeatedly creating increasingly large strings in complex processing, consider collecting pieces:

```js
const parts = [];

for (const value of values) {
    parts.push(String(value));
}

const result = parts.join('');
```

The exact performance depends on the workload and runtime, but the important DSA lesson is:

> Understand how much data is copied or created at each step.

---

## 21. Palindrome Thinking

A palindrome reads the same from both directions.

```text
racecar
```

A two-pointer approach compares symmetric positions:

```js
let left = 0;
let right = text.length - 1;

while (left < right) {
    if (text[left] !== text[right]) {
        return false;
    }

    left++;
    right--;
}

return true;
```

Time: `O(n)`

Auxiliary space: `O(1)`

This connects strings directly to the two-pointer technique introduced earlier with arrays.

---

## 22. String → Array → String

A common transformation is:

```text
string
  ↓
array of characters
  ↓
modify
  ↓
join
  ↓
string
```

Example:

```js
const chars = [...text];
chars.reverse();
const reversed = chars.join('');
```

This is easy to write but requires additional memory proportional to the input size.

If the algorithm only needs comparisons, a direct two-pointer scan may be more space-efficient.

---

## 23. Strings and Hashing Preview

Many string problems ask questions such as:

```text
How many times does each character occur?
Have I seen this character?
What is the first unique character?
Are these two strings anagrams?
```

These are naturally connected to frequency maps and hashing.

Example concept:

```js
const frequency = {};

for (const char of text) {
    frequency[char] = (frequency[char] ?? 0) + 1;
}
```

Hashing will be studied formally later; here the goal is to recognize the pattern.

---

## 24. Strings in Backend Engineering

Backend systems process strings constantly:

- request parameters
- URLs
- headers
- JSON fields
- search queries
- log messages
- identifiers
- validation data
- CSV/text processing
- database text fields

Important production concerns include input size, encoding, normalization, and repeated transformations.

A small-looking string operation can become expensive when applied to millions of records.

---

## 25. Strings in AI Engineering

Strings are the raw material for many AI pipelines:

```text
raw text
  ↓
normalization
  ↓
segmentation/tokenization
  ↓
representation
  ↓
search / ranking / generation
```

Later, algorithmic string knowledge will support text preprocessing, tokenization concepts, pattern matching, retrieval, and ranking pipelines.

---

## 26. Common Mistakes

- Trying to mutate a string character directly.
- Confusing `length` with the last valid index.
- Assuming indexed characters always represent full Unicode characters.
- Repeatedly creating substrings without considering total cost.
- Calling `split()` on very large data without considering memory.
- Assuming string search is `O(1)`.
- Forgetting that case and whitespace may be significant.
- Using ASCII assumptions without checking input constraints.
- Reversing through an intermediate array when `O(1)` auxiliary space is required.

---

## 27. DSA Mental Model

Whenever you receive a string, ask:

```text
1. What characters are allowed?
2. Is the input ASCII or arbitrary Unicode?
3. Does case matter?
4. Does whitespace matter?
5. Do I need indexes?
6. Can I scan once?
7. Do I need a frequency map?
8. Can two pointers solve it?
9. Am I creating new strings repeatedly?
10. What are the time and auxiliary-space costs?
```

---

## 28. Exercises

1. Return the length of a string without using a built-in length property.
2. Print every character with its index.
3. Count vowels in a string.
4. Count uppercase and lowercase letters separately.
5. Reverse a string without using `reverse()`.
6. Determine whether a string is a palindrome using two pointers.
7. Return the first occurrence of a target character.
8. Count the frequency of every character using an object.
9. Implement the same frequency counter using `Map`.
10. Determine whether two strings are anagrams.
11. Remove all spaces from a string without using a regular-expression replacement.
12. Replace every occurrence of one character with another.
13. Find the longest word in a sentence.
14. Reverse the order of words in a sentence while preserving each word.
15. Convert a string to an array of characters, modify it, and rebuild the string.
16. Solve a palindrome check without creating a character array.
17. Test your assumptions with a Unicode character such as an emoji and explain the `.length` result.
18. Compare two approaches to building a large string and document what data each approach allocates.

---

## 29. Self-Check

- [ ] I understand strings as sequences.
- [ ] I understand that JavaScript strings are immutable.
- [ ] I can traverse strings by index and with `for...of`.
- [ ] I understand `slice()` and substring boundaries.
- [ ] I know common string search operations.
- [ ] I understand splitting and joining costs.
- [ ] I understand the basic Unicode/code-point distinction.
- [ ] I can solve palindrome problems with two pointers.
- [ ] I recognize frequency counting as a hashing problem.
- [ ] I can reason about string allocation and repeated transformations.
- [ ] I can connect string algorithms to backend and AI text processing.
