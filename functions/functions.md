# JavaScript Functions: Concepts and Examples



---

## 1. Function Statement (Function Declaration)
A function statement is also known as a function declaration. It is hoisted, so you can call it before its definition in the code.

```js
function a() {
    console.log("Function Statement or Declaration");
}

a(); // Calling the function statement
```

**Key Points:**
- Hoisted (can be called before definition)
- Always named
- Cannot be used as a value directly

---

## 2. Function Expression
A function expression is created when a function is assigned to a variable. Function expressions are not hoisted, so they must be defined before use.

```js
var b = function() {
    console.log("Function Expression");
}
b(); // Calling the function expression
```

**Key Points:**
- Not hoisted
- Can be anonymous or named
- Can be assigned to variables, passed as arguments, or returned from other functions

---

## 3. Anonymous Function
An anonymous function is a function without a name. It is often used as a value, such as in callbacks or event handlers.

```js
var c = function() {
    console.log("Anonymous Function");
}
setTimeout(c, 2000); // Calling the anonymous function after 2 seconds
```

**Key Points:**
- No name
- Used as values, callbacks, or arguments

---

## 4. Named Function Expression
A named function expression is a function expression with a name. The name is only accessible inside the function itself.

```js
var d = function namedFunction() {
    console.log("Named Function Expression");
}
d(); // Works
// namedFunction(); // ReferenceError: namedFunction is not defined
setTimeout(d, 3000); // Calling after 3 seconds
```

**Key Points:**
- Name is local to the function body
- Not hoisted

---

## 5. Difference Between Arguments and Parameters
- **Parameters** are variables listed in the function definition.
- **Arguments** are the actual values passed to the function when it is called.

```js
function sum(a, b) { // a, b are parameters
    return a + b;
}
sum(2, 3); // 2, 3 are arguments
```

---

## 6. First-Class Functions
In JavaScript, functions are first-class citizens. This means:
- They can be assigned to variables
- Passed as arguments
- Returned from other functions
- Stored in data structures

```js
function firstClassFunctionExample() {
    console.log("This is a first-class function.");
}
firstClassFunctionExample();
```

**Key Points:**
- Enables higher-order functions, callbacks, and function composition

---

## 7. Arrow Functions
Arrow functions are a concise way to write function expressions. They do not have their own `this` and are best for callbacks and methods that use the surrounding context.

```js
const arrowFunctionExample = () => {
    console.log("This is an arrow function.");
};
arrowFunctionExample();
```

**Key Points:**
- Shorter syntax
- No own `this`, `arguments`, or `super`
- Cannot be used as constructors

---

## Summary Table
| Concept                  | Hoisted | Named | Can be Anonymous | Can be Value | Example Use Case         |
|--------------------------|---------|-------|------------------|--------------|-------------------------|
| Function Statement       | Yes     | Yes   | No               | No           | Declarations            |
| Function Expression      | No      | Yes/No| Yes              | Yes          | Callbacks, assignments  |
| Anonymous Function       | No      | No    | Yes              | Yes          | Callbacks, IIFE         |
| Named Function Expression| No      | Yes   | No               | Yes          | Recursion, debugging    |
| Arrow Function           | No      | No    | Yes              | Yes          | Callbacks, short syntax |

---

**Practice:** Try modifying the examples and see how hoisting, naming, and context affect function behavior in JavaScript.
