# JavaScript Closures: In-Depth Guide with Examples
A closure is a function that has access to the parent scope, even after the parent function has closed.
A closure is formed when a function remembers the variables fro its lexical scope even when the function is executed outside its lexical scope. 

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

## setTimeout, Closures, and Loop Pitfalls

This section explains how closures interact with `setTimeout` and loops, a common source of confusion in JavaScript.

### Example 1: The Problem with `var` in Loops
```js
function y() {
    for (var i = 1; i <= 5; i++) {
        setTimeout(() => {
            console.log(i);
        }, i * 1000);
    }
}
 y();
```
**What happens?**
- This will log `6` five times (after 1s, 2s, ..., 5s).
- Why? Because `var` is function-scoped, not block-scoped. By the time the callbacks run, the loop is done and `i` is `6`.

### Example 2: Fix with IIFE (Immediately Invoked Function Expression)
```js
function z() {
    for (var i = 1; i <= 5; i++) {
        (function(closeI) {
            setTimeout(() => {
                console.log(closeI);
            }, closeI * 1000);
        })(i);
    }
}
 z();
```
**How does this work?**
- The IIFE creates a new scope for each iteration, capturing the current value of `i` as `closeI`.
- Each timeout callback now has its own copy of the value.
- This logs `1, 2, 3, 4, 5` as expected.

### Example 3: Fix with `let`
```js
function a() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            console.log(i);
        }, i * 1000);
    }
}
 a();
```
**How does this work?**
- `let` is block-scoped, so each iteration gets a new binding of `i`.
- Each callback closes over its own `i` value.
- This logs `0, 1, 2, 3, 4` as expected.

### Key Concepts
- **Closures** allow the callback to "remember" the variable from its surrounding scope.
- With `var`, all callbacks share the same variable, leading to unexpected results in async code.
- Use `let` or an IIFE to capture the correct value for each iteration.

**Summary:**
> When using asynchronous functions like `setTimeout` inside loops, always be mindful of variable scope. Use `let` or an IIFE to avoid common pitfalls with closures and `var`.


---

**Practice:** Try modifying the examples in `closures.js` & `setTimeOutPractice.js`  and observe the results to deepen your understanding.



