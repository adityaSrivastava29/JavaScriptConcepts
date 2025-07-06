# JavaScript Closures: In-Depth Guide with Examples
The concept of **closures** in JavaScript, using the code examples from `closures.js`.

---

## 1. Basic Closure Example
```js
function outerFunction() {
    let outerVariable = 'I am from outer!';
    function innerFunction() {
        console.log(outerVariable);
    }
    return innerFunction;
}
const closure1 = outerFunction();
closure1(); // Output: I am from outer!
```
**Explanation:**
- `innerFunction` forms a closure over `outerVariable` from `outerFunction`.
- Even after `outerFunction` finishes, `innerFunction` can access `outerVariable`.

---

## 2. Closure with Private Variables (Data Encapsulation)
```js
function makeCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```
**Explanation:**
- `count` is private to the returned function, not accessible from outside.
- Each call to `counter()` increments and returns the private `count`.

---

## 3. Closures in Loops (Common Pitfall & Solution)
**Problem:**
```js
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs.push(function() {
        console.log('Problem:', i);
    });
}
funcs[0](); // 3
funcs[1](); // 3
funcs[2](); // 3
```
**Solution 1: IIFE**
```js
var funcsFixed = [];
for (var j = 0; j < 3; j++) {
    (function(jCopy) {
        funcsFixed.push(function() {
            console.log('Fixed:', jCopy);
        });
    })(j);
}
funcsFixed[0](); // 0
funcsFixed[1](); // 1
funcsFixed[2](); // 2
```
**Solution 2: Use `let`**
```js
let funcsLet = [];
for (let k = 0; k < 3; k++) {
    funcsLet.push(function() {
        console.log('Let:', k);
    });
}
funcsLet[0](); // 0
funcsLet[1](); // 1
funcsLet[2](); // 2
```
**Explanation:**
- Using `var` causes all functions to share the same variable.
- IIFE or `let` creates a new scope for each iteration.

---

## 4. Closures for Function Factories
```js
function makeMultiplier(multiplier) {
    return function(x) {
        return x * multiplier;
    };
}
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
double(5); // 10
triple(5); // 15
```
**Explanation:**
- `makeMultiplier` returns a function that remembers the `multiplier` value.

---

## 5. Closures in Asynchronous Code
**Problem:**
```js
for (var m = 0; m < 3; m++) {
    setTimeout(function() {
        console.log('Async Problem:', m);
    }, 100);
}
// All log 3
```
**Solution:**
```js
for (let n = 0; n < 3; n++) {
    setTimeout(function() {
        console.log('Async Fixed:', n);
    }, 200);
}
// Logs 0, 1, 2
```
**Explanation:**
- `let` creates a new binding for each iteration, so closures capture the correct value.

---

## 6. Practical Example: Hiding Implementation Details
```js
function Person(name) {
    let _name = name;
    return {
        getName: function() { return _name; },
        setName: function(newName) { _name = newName; }
    };
}
const p = Person('Alice');
p.getName(); // Alice
p.setName('Bob');
p.getName(); // Bob
```
**Explanation:**
- `_name` is private, only accessible via `getName` and `setName`.
- Demonstrates data privacy using closures.

---

## 7. Interview Question: What is a closure?
> A closure is a function that remembers its lexical scope even when the function is executed outside that scope. It allows functions to access variables from an enclosing scope, even after that scope has closed.

## 8. Interview Question: Why are closures useful?
- Data privacy (private variables)
- Function factories
- Partial application/currying
- Event handlers and callbacks
- Maintaining state in async code

---

## 9. Advanced: Currying with Closures
```js
function add(a) {
    return function(b) {
        return a + b;
    };
}
const add5 = add(5);
add5(10); // 15
```
**Explanation:**
- `add` returns a function that remembers `a`.
- This is the basis for currying and partial application.

---


## 10. Memory Leaks and Closures
> Be careful: Closures can cause memory leaks if they retain references to large objects unnecessarily. Always clean up references if not needed.

**Example:**
```js
function createLeak() {
    let largeArray = new Array(1e6).fill('leak'); // Large object
    return function() {
        // This closure keeps largeArray in memory
        console.log('Still holding largeArray of length:', largeArray.length);
    };
}

let leaky = createLeak();
// Even if we don't need largeArray anymore, it's not garbage collected
// because the closure (leaky) still references it.
// To avoid the leak, set leaky = null when done:
// leaky = null;
```

---

## Summary
Closures are a powerful feature in JavaScript, enabling data privacy, function factories, and more. Understanding closures is essential for interviews and real-world development.

---

**Practice:** Try modifying the examples in `closures.js` and observe the results to deepen your understanding.
