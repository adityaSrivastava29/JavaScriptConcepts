[← Back to Home](../index.md)

# JavaScript Array Methods: map, filter, and reduce

## Introduction
JavaScript arrays come with powerful built-in methods: `map`, `filter`, and `reduce`. These methods help you process and transform arrays in a clean, functional way. Let's understand each concept, see code examples, and learn how to write custom polyfills for them.

---

## 1. map()
- `map()` creates a new array by applying a function to every element of the original array.
- It does not change the original array.

### Example
```js
const arr = [1, 2, 3, 4, 5];
function double(x) {
    return x * 2;
}
const outputDouble = arr.map(double); // [2, 4, 6, 8, 10]
console.log(outputDouble);

// Using an anonymous function
const outputDoubleAlt = arr.map(function(x) {
    return x * 2;
});
console.log(outputDoubleAlt); // [2, 4, 6, 8, 10]

// Using an arrow function
const outputDoubleAltArrow = arr.map(x => x * 2);
console.log(outputDoubleAltArrow); // [2, 4, 6, 8, 10]

// Mapping to binary
function binary(x) {
    return x.toString(2);
}
const binaryArr = arr.map(binary);
console.log(binaryArr); // ["1", "10", "11", "100", "101"]

// Mapping objects
const users = [
    { firstName: "Aditya", lastName: "Kumar", age: 23 },
    { firstName: "Ashish", lastName: "Kumar", age: 29 },
    { firstName: "Ankit", lastName: "Roy", age: 29 },
    { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];
const fullNameArray = users.map(x => x.firstName + " " + x.lastName);
console.log(fullNameArray); // ["Aditya Kumar", "Ashish Kumar", ...]
```

### Polyfill for map
```js
Array.prototype.myMap = function(callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};
// Usage:
console.log(arr.myMap(x => x * 2)); // [2, 4, 6, 8, 10]
// Explanation:
// This is a custom implementation (polyfill) of the Array.prototype.map method.
// It creates a new array called 'result'.
// For each element in the original array, it calls the 'callback' function,
// passing the current element, its index, and the array itself.
// The return value of the callback is pushed into the 'result' array.
// After looping through all elements, it returns the new array.
// This works just like the built-in map method, allowing you to transform each element of an array.
```

---

## 2. filter()

- `filter()` creates a new array with only the elements that pass a test (provided by a function).
- It does not change the original array.

### Example
```js
const arr = [5, 1, 3, 2, 6];
function isOdd(x) {
  return x % 2;
}
const oddArr = arr.filter(isOdd); // [5, 1, 3]
console.log(oddArr);

// Using an arrow function
const oddArrAlt = arr.filter(x => x % 2);
console.log(oddArrAlt); // [5, 1, 3]

function isEven(x) {
  return x % 2 === 0;
}
const evenArr = arr.filter(isEven); // [2, 6]
console.log(evenArr);
```

### Polyfill for filter
```js
Array.prototype.myFilter = function(callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};
// Usage:
console.log(arr.myFilter(x => x % 2 === 0)); // [2, 6]
// Explanation:
// This is a custom implementation (polyfill) of Array.prototype.filter.
// It creates a new array called 'result'.
// For each element in the original array, it calls the 'callback' function
// with the current element, its index, and the array itself.
// If the callback returns true, the element is added to the 'result' array.
// After looping through all elements, it returns the new array containing only the elements that passed the test.
// This works just like the built-in filter method, allowing you to select elements based on a condition.
```

---

## 3. reduce()

- `reduce()` processes each element in the array and accumulates a single result.
- It takes a callback function and an optional initial value.

### Example
```js
const arr = [1, 2, 7, 3, 4, 5];
// Sum of array
const sum = arr.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 22

// Find max value
const max = arr.reduce((acc, curr) => acc > curr ? acc : curr, 0);
console.log(max); // 7

// Count users by age
const users = [
    { firstName: "Aditya", lastName: "Kumar", age: 23 },
    { firstName: "Ashish", lastName: "Kumar", age: 29 },
    { firstName: "Ankit", lastName: "Roy", age: 29 },
    { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];
const ageCount = users.reduce((acc, curr) => {
    acc[curr.age] = (acc[curr.age] || 0) + 1;
    return acc;
}, {});
console.log(ageCount); // { '23': 1, '29': 2, '50': 1 }

// Names of people whose age < 30
const lessThan30 = users.reduce((acc, curr) => {
    if (curr.age < 30) acc.push(curr.firstName);
    return acc;
}, []);
console.log(lessThan30); // ["Aditya", "Ashish", "Ankit"]
```

### Polyfill for reduce
```js
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0];
  let startIndex = initialValue !== undefined ? 0 : 1;
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};
// Usage:
const mySum = arr.myReduce((acc, curr) => acc + curr, 0);
const myMax = arr.myReduce((acc, curr) => acc > curr ? acc : curr, 0);
console.log("Sum", mySum); // 22
console.log("Max", myMax); // 7
// Explanation:
// This is a custom implementation (polyfill) of Array.prototype.reduce.
// It initializes an 'accumulator' with the initial value or the first element of the array.
// It then loops through the array starting from the second element (if no initial value is provided).
// For each element, it calls the 'callback' function with the current accumulator, the current     element, its index, and the array itself.
// The return value of the callback becomes the new accumulator.
// After looping through all elements, it returns the final accumulated value.
// This works just like the built-in reduce method, allowing you to combine all elements into a single value.
```

---

# 🔧 What is a Polyfill?

A **polyfill** is a piece of code that replicates modern JavaScript features in older environments where those features are not available natively. For array methods like `map`, `filter`, and `reduce`, a polyfill recreates their behavior using basic JavaScript.

---

## 🧠 Key Concepts to Remember

### 1. 📋 The General Pattern

All three polyfills (`map`, `filter`, `reduce`) follow a similar structure:

* ✅ Validate the **callback function**
* 🗃️ Create a **result container**

  * `map` / `filter`: New array
  * `reduce`: Any type (depending on usage)
* 🔁 Loop through the original array
* 🧪 Apply the **callback function** with proper parameters
* 🔚 Return the **result**

---

### 2. ⚠️ Important Implementation Details

* 🔍 **Sparse Arrays**:
  Use `if (i in this)` to skip missing indices in sparse arrays.

* 🎯 **thisArg Support**:
  Use `callback.call(thisArg, ...)` to explicitly set the `this` context inside the callback.

* 📦 **Callback Parameters**:

  * `map` / `filter`: `(element, index, array)`
  * `reduce`: `(accumulator, element, index, array)`

---

### 3. 🧭 The Mental Models

| Method   | Behavior                      | Result Type                                 |
| -------- | ----------------------------- | ------------------------------------------- |
| `map`    | 🔁 Transform each item        | 🆕 New array (same length)                  |
| `filter` | ✅ Keep some items             | 🆕 New array (same or shorter)              |
| `reduce` | 🧩 Combine all items into one | 🔣 Any value (e.g., number, string, object) |

---

### 4. 💡 Why This Matters

Understanding polyfills helps you:

* 🔎 **Debug** issues with these methods
* 🚀 Understand **performance implications**
* 🧰 Write **more efficient code**
* 🔐 Handle **edge cases** better
* 🙌 Appreciate what the browser does for you!

---

## 👉 [Polyfills in details](HigherOrderFunction/Polyfills.html)

## Summary
- `map`, `filter`, and `reduce` are essential for working with arrays in JavaScript.
- They help you write clean, readable, and functional code.
- Polyfills show how these methods work under the hood and are useful for learning or supporting older environments.

