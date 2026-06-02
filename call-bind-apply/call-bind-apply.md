---
layout: note
---

# `call`, `bind`, `apply` in JavaScript

---

## Table of Contents

1. [What is `this`?](#1-what-is-this)
2. [Function.prototype.call()](#2-functionprototypecall)
3. [Function.prototype.apply()](#3-functionprototypeapply)
4. [Function.prototype.bind()](#4-functionprototypebind)
5. [call vs apply vs bind — Quick Comparison](#5-call-vs-apply-vs-bind--quick-comparison)
6. [Polyfill: myCall](#6-polyfill-mycall)
7. [Polyfill: myApply](#7-polyfill-myapply)
8. [Polyfill: myBind](#8-polyfill-mybind)
9. [Common Use Cases](#9-common-use-cases)
10. [Common Gotchas](#10-common-gotchas)
11. [Interview Questions — Famous & Tricky](#11-interview-questions--famous--tricky)

---

## 1. What is `this`?

`this` refers to the **execution context** — the object that is currently calling the function.

| Context                    | `this` value                        |
| -------------------------- | ----------------------------------- |
| Global scope (non-strict)  | `window` / `global`                 |
| Global scope (strict mode) | `undefined`                         |
| Object method              | The object before the dot           |
| Constructor (`new`)        | The newly created object            |
| Arrow function             | Lexically inherited — no own `this` |
| `call` / `apply` / `bind`  | Explicitly set by you               |
| Event handler              | The DOM element                     |

`call`, `apply`, and `bind` all let you **explicitly control** what `this` is inside a function.

---

## 2. `Function.prototype.call()`

Calls a function with a given `this` and **individual arguments**.

```js
func.call(thisArg, arg1, arg2, ...)
```

- Executes **immediately**
- Arguments passed **comma-separated**

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Alice" };
greet.call(user, "Hello", "!"); // "Hello, Alice!"
```

### Borrowing methods with `call`

```js
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const arr = Array.prototype.slice.call(arrayLike);
console.log(arr); // ["a", "b", "c"]
```

### Calling parent constructor with `call`

```js
function Animal(name) {
  this.name = name;
}
function Dog(name, breed) {
  Animal.call(this, name); // inherit own props
  this.breed = breed;
}
```

---

## 3. `Function.prototype.apply()`

Calls a function with a given `this` and arguments as an **array**.

```js
func.apply(thisArg, [arg1, arg2, ...])
```

- Executes **immediately**
- Arguments passed as an **array or array-like**

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Bob" };
greet.apply(user, ["Hi", "."]); // "Hi, Bob."
```

### Classic use — Math.max with an array

```js
const nums = [3, 1, 4, 1, 5, 9];
Math.max.apply(null, nums); // 9
// Modern equivalent: Math.max(...nums)
```

### apply vs spread

```js
// These are equivalent in ES6+:
fn.apply(ctx, args);
fn.call(ctx, ...args);
```

---

## 4. `Function.prototype.bind()`

Returns a **new function** with `this` permanently bound. Does NOT execute immediately.

```js
const boundFn = func.bind(thisArg, arg1, arg2, ...)
```

- Does **NOT execute** immediately — returns a new function
- `this` is **permanently** locked (even `call`/`apply` can't override it on a bound function)
- Supports **partial application** (pre-filling arguments)

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Carol" };
const greetCarol = greet.bind(user, "Hey");
greetCarol("!"); // "Hey, Carol!"
greetCarol("..."); // "Hey, Carol..."
```

### Partial Application with `bind`

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);

double(5); // 10
triple(5); // 15
```

### Fixing `this` in event listeners

```js
class Counter {
  constructor() {
    this.count = 0;
  }
  increment() {
    this.count++;
    console.log(this.count);
  }
}

const c = new Counter();
// ❌ this will be the button element:
document.querySelector("button").addEventListener("click", c.increment);
// ✅ bind fixes this:
document.querySelector("button").addEventListener("click", c.increment.bind(c));
```

### `bind` and `new` — important edge case

When a bound function is used with `new`, the bound `this` is **ignored** — `new` creates a fresh object.

```js
function Foo(x) {
  this.x = x;
}
const BoundFoo = Foo.bind({ x: 999 });
const obj = new BoundFoo(1);
console.log(obj.x); // 1 — not 999, `new` wins over bind
```

---

## 5. call vs apply vs bind — Quick Comparison

| Feature               | `call`             | `apply`            | `bind`                       |
| --------------------- | ------------------ | ------------------ | ---------------------------- |
| Executes immediately  | ✅ Yes             | ✅ Yes             | ❌ No                        |
| Returns               | Return value of fn | Return value of fn | New bound function           |
| Arguments             | Comma-separated    | Array / array-like | Comma-separated (partial ok) |
| `this` locked forever | No                 | No                 | Yes                          |
| Partial application   | No                 | No                 | ✅ Yes                       |

**Memory trick:**

- **C**all → **C**omma-separated
- **A**pply → **A**rray
- **B**ind → **B**orrow (returns new fn)

---

## 6. Polyfill: `myCall`

```js
Function.prototype.myCall = function (context, ...args) {
  // If context is null/undefined, use globalThis
  context = context ?? globalThis;
  // Attach `this` (the function) to the context object temporarily
  const fnSymbol = Symbol("fn"); // unique key to avoid collision
  context[fnSymbol] = this;
  // Call it
  const result = context[fnSymbol](...args);
  // Clean up
  delete context[fnSymbol];
  return result;
};

// Test:
function sayHi(greeting) {
  return `${greeting}, ${this.name}`;
}
const obj = { name: "Alice" };
sayHi.myCall(obj, "Hello"); // "Hello, Alice"
```

**How it works:**

1. Temporarily set the function as a property on the context object
2. Call it as a method → `this` inside the function becomes the context
3. Delete the temporary property and return the result

---

## 7. Polyfill: `myApply`

```js
Function.prototype.myApply = function (context, args) {
  context = context ?? globalThis;
  if (
    args !== undefined &&
    !Array.isArray(args) &&
    !(args instanceof Object && "length" in args)
  ) {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  const result = args ? context[fnSymbol](...args) : context[fnSymbol]();
  delete context[fnSymbol];
  return result;
};

// Test:
function sum(a, b, c) {
  return a + b + c;
}
sum.myApply(null, [1, 2, 3]); // 6
```

---

## 8. Polyfill: `myBind`

This is the **most famous interview question** in this topic.

```js
Function.prototype.myBind = function (context, ...outerArgs) {
  const fn = this; // the original function

  function boundFn(...innerArgs) {
    // If called with `new`, ignore the bound context
    // `new boundFn()` sets `this` to a new object; instanceof checks that
    if (this instanceof boundFn) {
      return new fn(...outerArgs, ...innerArgs);
    }
    return fn.apply(context, [...outerArgs, ...innerArgs]);
  }

  // Preserve prototype so `instanceof` works correctly with `new`
  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
  }

  return boundFn;
};

// Test 1: Normal use
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const greetAlice = greet.myBind({ name: "Alice" }, "Hello");
greetAlice("!"); // "Hello, Alice!"
greetAlice("..."); // "Hello, Alice..."

// Test 2: Partial application
function multiply(a, b) {
  return a * b;
}
const double = multiply.myBind(null, 2);
double(10); // 20

// Test 3: new overrides bound context
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind({ x: 999 }, 10);
const p = new BoundPoint(20);
console.log(p.x, p.y); // 10, 20 — not 999
```

### Why the `instanceof boundFn` check?

The ES spec says: when a bound function is invoked with `new`, the **original** function is used as the constructor, and the bound `this` is **ignored**.

---

## 9. Common Use Cases

### 1. Method borrowing

```js
const person = {
  name: "Alice",
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};

const anotherPerson = { name: "Bob" };
person.greet.call(anotherPerson); // "Hi, I'm Bob"
```

### 2. Array-like objects → real arrays

```js
function example() {
  // `arguments` is array-like, not a real array
  const args = Array.prototype.slice.call(arguments);
  // Modern: const args = [...arguments] or Array.from(arguments)
  return args.map((x) => x * 2);
}
example(1, 2, 3); // [2, 4, 6]
```

### 3. `hasOwnProperty` on a polluted object

```js
const obj = Object.create(null); // no prototype
obj.key = "value";
// obj.hasOwnProperty("key") → TypeError: not a function!
Object.prototype.hasOwnProperty.call(obj, "key"); // true ✅
```

### 4. `toString` type checking (famous pattern)

```js
function getType(val) {
  return Object.prototype.toString.call(val);
}
getType([]); // "[object Array]"
getType({}); // "[object Object]"
getType(null); // "[object Null]"
getType(undefined); // "[object Undefined]"
getType(() => {}); // "[object Function]"
```

### 5. Currying / Partial Application with `bind`

```js
function log(level, message) {
  console.log(`[${level}] ${message}`);
}
const info = log.bind(null, "INFO");
const error = log.bind(null, "ERROR");

info("Server started"); // [INFO] Server started
error("DB connection lost"); // [ERROR] DB connection lost
```

---

## 10. Common Gotchas

### Arrow functions ignore `call`/`apply`/`bind`

```js
const obj = { name: "Alice" };
const arrowFn = () => `Hello, ${this.name}`;

arrowFn.call(obj); // "Hello, undefined" — arrow fn has no own `this`
arrowFn.bind(obj)(); // "Hello, undefined" — bind returns arrow fn, `this` unchanged
```

> Arrow functions capture `this` **lexically** at definition time. You cannot rebind them.

### `bind` returns a new function — identity changes

```js
class Button {
  handleClick() {
    console.log("clicked");
  }
  attach() {
    // ❌ saves different function each time — can't removeEventListener
    el.addEventListener("click", this.handleClick.bind(this));
  }
}

// ✅ Save the bound function:
class Button {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log("clicked");
  }
}
```

### `null`/`undefined` as `thisArg` in non-strict mode

```js
function show() {
  console.log(this);
}
show.call(null); // logs `window` (global) in non-strict mode
show.call(undefined); // logs `window` (global) in non-strict mode
// In strict mode: logs null / undefined respectively
```

### Chaining `bind` — second `bind` has no effect on `this`

```js
function fn() {
  return this.x;
}
const a = fn.bind({ x: 1 });
const b = a.bind({ x: 2 }); // tries to rebind, but `a` is already locked
b(); // 1 — first bind wins
```

---

## 11. Interview Questions — Famous & Tricky

---

### Q1. What is the difference between `call`, `apply`, and `bind`?

|               | `call`             | `apply`                | `bind`                |
| ------------- | ------------------ | ---------------------- | --------------------- |
| Executes now? | Yes                | Yes                    | No (returns fn)       |
| Args format   | Spread             | Array                  | Spread (partial ok)   |
| Use case      | Borrow method once | Borrow with array args | Lock `this` for later |

---

### Q2. Implement `Function.prototype.bind` polyfill (with `new` support).

> See Section 8 above — the full polyfill with `instanceof boundFn` check and prototype preservation.

Key points interviewers look for:

- Merging `outerArgs` and `innerArgs` (partial application)
- Handling the `new` keyword correctly (bound `this` must be ignored)
- Preserving `prototype` for `instanceof` to work

---

### Q3. What is the output?

```js
const obj = { x: 10 };

function getX() {
  return this.x;
}

const bound = getX.bind(obj);
const reBound = bound.bind({ x: 99 });

console.log(bound()); // ?
console.log(reBound()); // ?
```

**Answer:** Both log `10`. Once a function is bound, its `this` is permanently locked. Calling `bind` on an already-bound function has no effect on `this`.

---

### Q4. What is the output?

```js
const obj = {
  name: "Alice",
  greet: () => {
    return `Hi, ${this.name}`;
  },
};

console.log(obj.greet.call({ name: "Bob" })); // ?
```

**Answer:** `"Hi, undefined"`. Arrow functions don't have their own `this`. `call` cannot override the lexically captured `this` (which is the outer scope — not `obj`).

---

### Q5. Implement `Function.prototype.call` polyfill.

```js
Function.prototype.myCall = function (context, ...args) {
  context = context ?? globalThis;
  const sym = Symbol();
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};
```

Why `Symbol()`? To guarantee no collision with existing properties on the context object.

---

### Q6. What is the output?

```js
function Person(name) {
  this.name = name;
}

const BoundPerson = Person.bind({ name: "Bound" });
const p = new BoundPerson("Alice");

console.log(p.name); // ?
```

**Answer:** `"Alice"`. When a bound function is used with `new`, the bound `this` is ignored. `new` creates a fresh object and passes `"Alice"` as the constructor argument.

---

### Q7. How would you use `apply` to find the max of an array (pre-ES6)?

```js
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
Math.max.apply(null, nums); // 9

// ES6+:
Math.max(...nums); // 9
```

`Math.max` takes individual args, not an array. `apply` spreads the array as individual arguments.

---

### Q8. What happens when `null` is passed to `call`?

```js
function fn() {
  console.log(this);
}
fn.call(null); // window (non-strict) or null (strict mode)
fn.call(undefined); // window (non-strict) or undefined (strict mode)
```

In **strict mode**, `null`/`undefined` are passed as-is. In non-strict mode, they're replaced with the global object.

---

### Q9. Use `call` to detect the real type of a value (famous pattern).

```js
function typeOf(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

typeOf([]); // "array"
typeOf({}); // "object"
typeOf(null); // "null"
typeOf(undefined); // "undefined"
typeOf(new Date()); // "date"
typeOf(/regex/); // "regexp"
```

This is more reliable than `typeof` (which returns `"object"` for `null` and arrays).

---

### Q10. Tricky partial application question.

```js
function add(a, b, c) {
  return a + b + c;
}

const addFive = add.bind(null, 2, 3);
console.log(addFive(10)); // ?
```

**Answer:** `15`. `bind(null, 2, 3)` pre-fills `a=2, b=3`. Calling `addFive(10)` fills `c=10`. Result: `2 + 3 + 10 = 15`.

---

### Q11. How is `bind` different from an arrow function for fixing `this`?

```js
class Timer {
  constructor() {
    this.seconds = 0;
  }

  // Arrow function approach — `this` fixed at definition time
  startArrow() {
    setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  // bind approach — explicit binding
  startBind() {
    setInterval(
      function () {
        this.seconds++;
      }.bind(this),
      1000
    );
  }
}
```

Both work. Arrow function is cleaner. Key difference: arrow functions **can't** be used as constructors or have their own `arguments` object; `bind` creates a regular function with locked `this`.

---

### Q12. Implement `Function.prototype.apply` polyfill.

```js
Function.prototype.myApply = function (context, args) {
  context = context ?? globalThis;
  const sym = Symbol();
  context[sym] = this;
  const result = args ? context[sym](...args) : context[sym]();
  delete context[sym];
  return result;
};
```

---

### Q13. What is the output?

```js
const obj = { val: 42 };

function printVal() {
  console.log(this.val);
}

setTimeout(printVal.bind(obj), 0); // ?
setTimeout(printVal.call(obj), 0); // ?
```

**Answer:**

- `printVal.bind(obj)` — passes a bound function to `setTimeout`. Logs `42` after 0ms.
- `printVal.call(obj)` — **immediately** calls `printVal` (logs `42` right away), and passes `undefined` (return value) to `setTimeout`. `setTimeout` gets `undefined`, does nothing useful.

---

### Q14. Borrowing `Array` methods for `arguments`.

```js
function sum() {
  // `arguments` is not a real array — no .reduce()
  return Array.prototype.reduce.call(arguments, (acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
```

---

### Q15. Explain the `instanceof` check in the `bind` polyfill.

```js
function boundFn(...innerArgs) {
  if (this instanceof boundFn) {
    // Called with `new` — create new instance, ignore bound context
    return new fn(...outerArgs, ...innerArgs);
  }
  return fn.apply(context, [...outerArgs, ...innerArgs]);
}
```

When invoked as `new boundFn()`, `this` inside `boundFn` is an instance of `boundFn`. The check detects this and delegates to the original function as a constructor, discarding the bound `this`.

---

## Quick Reference Cheat Sheet

```
// call — immediate, comma args
fn.call(thisArg, arg1, arg2)

// apply — immediate, array args
fn.apply(thisArg, [arg1, arg2])

// bind — deferred, returns new fn, partial application
const newFn = fn.bind(thisArg, arg1)
newFn(arg2)

// Arrow functions: CANNOT be rebound with call/apply/bind

// null thisArg behavior:
//   non-strict → global object
//   strict mode → null/undefined as-is

// bind is permanent — calling bind() again won't change this

// new + bound fn → bound this is IGNORED, new creates fresh obj
```
