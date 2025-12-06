# JavaScript Loops: A Complete Guide

## 1. Why Loops?
Loops let you repeat an action multiple times without duplicating code. They are essential for:
- Iterating over arrays, objects, strings
- Processing data (filtering, transforming, aggregating)
- Running asynchronous tasks sequentially

---
## 2. Core Loop Types
### 2.1 `for` Loop (Classic Index Loop)
Best when you need the index or want fine-grained control.
```js
const cars = ["BMW", "Mercedes", "Toyota", "Honda"];
for (let i = 0; i < cars.length; i++) {
  console.log(i, cars[i]);
}
```
Key points:
- Initialization (`let i = 0`), condition (`i < cars.length`), update (`i++`)
- Can `break` or `continue`
- Good for performance-sensitive code

### 2.2 `while` Loop
Runs while the condition is true.
```js
let count = 3;
while (count > 0) {
  console.log("Count:", count);
  count--;
}
```
Use when the number of iterations isn’t known ahead of time.

### 2.3 `do...while` Loop
Executes **at least once** before checking the condition.
```js
let n = 0;
do {
  console.log("Executed once even if condition is false initially");
} while (n > 0);
```

### 2.4 `for...of` (Iterable Loop)
Great for arrays, strings, Maps, Sets.
```js
const langs = ["JS", "Python", "Go"];
for (const lang of langs) {
  console.log(lang);
}
```
Benefits:
- Cleaner than index loops
- Works with any iterable (implements `[Symbol.iterator]`)

### 2.5 `for...in` (Object Property Enumeration)
Iterates over **enumerable keys** (including inherited ones).
```js
const user = { name: "Aditya", age: 23 };
for (const key in user) {
  console.log(key, user[key]);
}
```
Avoid using `for...in` on arrays (order isn’t guaranteed). Combine with `hasOwnProperty` if needed:
```js
for (const key in user) {
  if (Object.prototype.hasOwnProperty.call(user, key)) {
    console.log(key, user[key]);
  }
}
```

### 2.6 `Array.prototype.forEach`
Higher-order method for arrays.
```js
const nums = [1, 2, 3];
nums.forEach((value, index) => console.log(index, value));
```
Limitations:
- Can’t use `break` / `continue`
- Doesn’t return a new array (use `map` if transforming)

### 2.7 `for await...of` (Async Iteration)
Used with async iterables or arrays of promises.
```js
const urls = [
  fetch('https://jsonplaceholder.typicode.com/todos/1'),
  fetch('https://jsonplaceholder.typicode.com/todos/2')
];

(async () => {
  for await (const res of urls) {
    const data = await res.json();
    console.log(data.id);
  }
})();
```

---
## 3. Comparing Loop Types
| Loop          | Use Case | Supports break/continue | Best For |
|---------------|----------|--------------------------|----------|
| for           | Indexed control | Yes | Arrays with index needs |
| while         | Unknown end condition | Yes | Event polling, dynamic termination |
| do...while    | Run at least once | Yes | Menu/input loops |
| for...of      | Iterables | Yes | Arrays, strings, Sets, Maps |
| for...in      | Enumerating object keys | Yes | Plain objects (with hasOwnProperty) |
| forEach       | Array iteration with side-effects | No | Simple per-item processing |
| for await...of| Async iterables/promises | Yes | Sequential async handling |

---
## 4. Loop Control: `break`, `continue`, and Labels
```js
for (let i = 0; i < 5; i++) {
  if (i === 2) continue; // Skip 2
  if (i === 4) break;    // Stop loop
  console.log(i);
}
```
### Labeled Break (Avoid unless necessary)
```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer;
    console.log(i, j);
  }
}
```

---
## 5. Iterating Objects Safely
```js
const person = { first: 'Ada', last: 'Lovelace' };
Object.keys(person).forEach(k => console.log(k, person[k]));
Object.entries(person).forEach(([k, v]) => console.log(k, v));
```
Prefer `Object.keys/values/entries` over `for...in` when you want only own properties.

---
## 6. Avoid Mutating While Iterating
Bad pattern:
```js
const arr = [1,2,3,4];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 === 0) arr.splice(i, 1); // Skips elements
}
```
Better:
```js
const filtered = arr.filter(x => x % 2 !== 0);
```
Or iterate from end:
```js
for (let i = arr.length - 1; i >= 0; i--) {
  if (arr[i] % 2 === 0) arr.splice(i, 1);
}
```

---
## 7. Building Transformations Manually
```js
const numbers = [1,2,3,4];
// map alternative
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}
// filter alternative
const evens = [];
for (const n of numbers) {
  if (n % 2 === 0) evens.push(n);
}
// reduce alternative (sum)
let sum = 0;
for (const n of numbers) sum += n;
```

---
## 8. Performance Notes
- `for` with cached length is slightly faster in tight loops:
```js
for (let i = 0, len = arr.length; i < len; i++) {}
```
- Avoid heavy synchronous loops in the UI thread (they block rendering)
- For large data, consider batching with `setTimeout` / `requestIdleCallback`

---
## 9. Async Pitfalls in Loops
### Using `var` inside loops with async callbacks
```js
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0); // 4,4,4
}
```
Fix with `let` (block scoping) or IIFE:
```js
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0); // 1,2,3
}
```
Sequential async with `for...of`:
```js
async function process(ids) {
  for (const id of ids) {
    await doAsync(id); // waits each turn
  }
}
```
Parallel async:
```js
await Promise.all(ids.map(doAsync));
```

---
## 10. When to Use What
| Need | Pick |
|------|------|
| Index + control | for |
| Unknown iteration count | while |
| Run at least once | do...while |
| Clean element iteration | for...of |
| Own object keys | Object.keys + forEach |
| Transform / filter / accumulate | map / filter / reduce |
| Async sequential | for await...of or for...of with await |
| Async parallel | Promise.all |

---
## 11. Practical Examples
### Summing Nested Arrays
```js
const matrix = [[1,2],[3,4],[5,6]];
let total = 0;
for (const row of matrix) {
  for (const value of row) total += value;
}
console.log(total); // 21
```
### Counting Frequencies
```js
const letters = ['a','b','a','c','b','a'];
const freq = {};
for (const ch of letters) {
  freq[ch] = (freq[ch] || 0) + 1;
}
console.log(freq); // { a:3, b:2, c:1 }
```
### Flatten One Level
```js
const nested = [1,[2,3],[4,5]];
const flat = [];
for (const item of nested) {
  if (Array.isArray(item)) {
    for (const inner of item) flat.push(inner);
  } else flat.push(item);
}
console.log(flat); // [1,2,3,4,5]
```

---
## 12. Edge Cases
- Mutating `length` during a loop affects iteration.
- `forEach` skips holes in sparse arrays; `for` does not if index exists.
- `for...in` order is not guaranteed for integer-like keys.
- `break` in `try/finally` still executes `finally`.

---
## 13. Mini Cheatsheet
| Goal | Preferred | Alternate |
|------|-----------|-----------|
| Iterate array values | for...of | for / forEach |
| Need index + value | for | arr.entries() + for...of |
| Iterate string chars | for...of | classic for |
| Object own keys | Object.keys(obj) | for...in + hasOwnProperty |
| Parallel async tasks | Promise.all | forEach + async (avoid) |
| Sequential async tasks | for...of + await | reduce chain |

---
## 14. Practice Exercises
1. Reverse an array in-place using a `for` loop.
2. Write a loop to find the second largest number.
3. Use `for...of` to sum only even numbers in an array.
4. Implement a manual version of `Array.prototype.filter` using a loop.
5. Loop through a string and count vowels.

---
## 15. Summary
Mastering loops means knowing not just the syntax, but **which tool fits which scenario**. Start with readable constructs (`for...of`, array methods) and drop to lower-level loops (`for`, `while`) when you need control or performance.

Happy looping!
