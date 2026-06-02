# 🧠 Tricky JavaScript Interview Questions

> A comprehensive collection of tricky JS questions, output-based puzzles, and their detailed explanations.

---

## 📚 Table of Contents

1. [Hoisting](#1-hoisting)
2. [var / let / const](#2-var--let--const)
3. [Type Coercion & Comparison](#3-type-coercion--comparison)
4. [Closures in Loops](#4-closures-in-loops)
5. [this Keyword](#5-this-keyword)
6. [Prototypes & Inheritance](#6-prototypes--inheritance)
7. [Event Loop & Async](#7-event-loop--async)
8. [Truthy / Falsy](#8-truthy--falsy)
9. [Spread, Rest & Destructuring](#9-spread-rest--destructuring)
10. [Functions & Arrow Functions](#10-functions--arrow-functions)
11. [Objects & Arrays](#11-objects--arrays)
12. [Output-Based Questions](#12-output-based-questions)

---

## 1. Hoisting

### Q1. What is the output?

```js
console.log(x);
var x = 5;
console.log(x);
```

**Output:**
```
undefined
5
```

**Explanation:**  
`var` declarations are hoisted to the top of their scope but **not initialized**. At the time of the first `console.log`, `x` exists (hoisted) but has the value `undefined`. After `x = 5`, it prints `5`.

---

### Q2. What is the output?

```js
console.log(foo());
function foo() {
  return "Hello";
}
```

**Output:**
```
Hello
```

**Explanation:**  
Function **declarations** are fully hoisted (both declaration AND body), so calling `foo()` before its declaration works fine.

---

### Q3. What is the output?

```js
console.log(bar());
var bar = function () {
  return "Hi";
};
```

**Output:**
```
TypeError: bar is not a function
```

**Explanation:**  
`bar` is a **function expression** assigned to a `var`. Only the variable declaration is hoisted (`var bar = undefined`), not the function body. So at the time of `console.log(bar())`, `bar` is `undefined`, and calling `undefined()` throws a TypeError.

---

### Q4. What is the output?

```js
var x = 1;
function test() {
  console.log(x);
  var x = 2;
  console.log(x);
}
test();
```

**Output:**
```
undefined
2
```

**Explanation:**  
Inside `test()`, the local `var x` is hoisted to the top of the function scope. So the first `console.log(x)` sees the hoisted-but-uninitialized local `x` (not the outer `x = 1`), printing `undefined`. Then `x = 2` is assigned, so the second log prints `2`.

---

### Q5. What is the output?

```js
console.log(typeof myVar);
let myVar = 10;
```

**Output:**
```
ReferenceError: Cannot access 'myVar' before initialization
```

**Explanation:**  
`let` and `const` are hoisted but remain in the **Temporal Dead Zone (TDZ)** from the start of the block until the declaration is reached. Accessing them in the TDZ throws a ReferenceError.

---

## 2. var / let / const

### Q6. What is the output?

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Output:**
```
3
3
3
```

**Explanation:**  
`var` is **function-scoped** (or globally scoped here). All three arrow functions share the same `i` variable. By the time the setTimeout callbacks run, the loop has finished and `i` is `3`.

---

### Q7. What is the output?

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Output:**
```
0
1
2
```

**Explanation:**  
`let` is **block-scoped**. Each iteration of the loop creates a **new binding** of `i`. Each arrow function captures its own `i`, so they print `0`, `1`, `2`.

---

### Q8. What is the output?

```js
const obj = { name: "Alice" };
obj.name = "Bob";
console.log(obj.name);
```

**Output:**
```
Bob
```

**Explanation:**  
`const` prevents **reassignment** of the variable binding, but it does NOT make the object immutable. You can still mutate the object's properties.

---

### Q9. What is the output?

```js
let a = 1;
{
  let a = 2;
  console.log(a);
}
console.log(a);
```

**Output:**
```
2
1
```

**Explanation:**  
`let` is block-scoped. Inside the block, `a = 2` is a separate variable. Outside the block, `a = 1` is the outer scope variable.

---

### Q10. What is the output?

```js
var a = 10;
function foo() {
  var a = 20;
  return function () {
    console.log(a);
  };
}
foo()();
```

**Output:**
```
20
```

**Explanation:**  
The returned function forms a **closure** over the inner `a = 20`. When invoked, it logs `20`.

---

## 3. Type Coercion & Comparison

### Q11. What is the output?

```js
console.log(1 + "2" + "2");
console.log(1 + +"2" + "2");
console.log(1 + -"1" + "2");
console.log(+"1" + "1" + "2");
console.log("A" - "B" + "2");
console.log("A" - "B" + 2);
```

**Output:**
```
"122"
"32"
"02"
"112"
"NaN2"
NaN
```

**Explanation:**
- `1 + "2"` → `"12"` (number + string = string concatenation), then `"12" + "2"` = `"122"`
- `+"2"` converts string `"2"` to number `2`. So `1 + 2 = 3`, then `3 + "2"` = `"32"`
- `-"1"` converts `"1"` to `-1`. So `1 + (-1) = 0`, then `0 + "2"` = `"02"`
- `+"1"` = `1`, then `1 + "1"` = `"11"`, then `"11" + "2"` = `"112"`
- `"A" - "B"` → `NaN` (both coerce to `NaN`), then `NaN + "2"` = `"NaN2"` (string concatenation)
- `NaN + 2` = `NaN` (numeric addition with NaN)

---

### Q12. What is the output?

```js
console.log(0 == false);
console.log(0 === false);
console.log("" == false);
console.log(null == undefined);
console.log(null === undefined);
console.log(NaN == NaN);
```

**Output:**
```
true
false
true
true
false
false
```

**Explanation:**
- `0 == false` → both coerce to `0`, so `true`
- `0 === false` → different types (number vs boolean), `false`
- `"" == false` → both coerce to `0`, so `true`
- `null == undefined` → special rule in spec: `null` and `undefined` are equal with `==`
- `null === undefined` → different types, `false`
- `NaN == NaN` → `NaN` is never equal to anything, including itself

---

### Q13. What is the output?

```js
console.log([] == []);
console.log({} == {});
console.log([] == ![]);
```

**Output:**
```
false
false
true
```

**Explanation:**
- `[] == []` → two different object references, not equal
- `{} == {}` → two different object references, not equal
- `[] == ![]`:
  - `![]` → `false` (any object is truthy, so `![]` = `false`)
  - Now `[] == false`
  - `false` coerces to `0`
  - `[]` coerces to `""` (via `.toString()`), then `""` coerces to `0`
  - `0 == 0` → `true`

---

### Q14. What is the output?

```js
console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);
console.log(typeof []);
console.log(typeof {});
console.log(typeof function(){});
```

**Output:**
```
"object"
"undefined"
"number"
"object"
"object"
"function"
```

**Explanation:**
- `typeof null` → `"object"` is a **historical bug** in JavaScript that was never fixed
- `typeof undefined` → `"undefined"`
- `typeof NaN` → `"number"` — NaN stands for "Not a Number" but is ironically of type number
- `typeof []` → `"object"` — arrays are objects
- `typeof {}` → `"object"`
- `typeof function(){}` → `"function"` — functions are a special subtype

---

### Q15. What is the output?

```js
console.log(+"");
console.log(+null);
console.log(+undefined);
console.log(+false);
console.log(+true);
console.log(+[]);
console.log(+{});
```

**Output:**
```
0
0
NaN
0
1
0
NaN
```

**Explanation:**
- `+""` → `0` (empty string to number)
- `+null` → `0`
- `+undefined` → `NaN`
- `+false` → `0`
- `+true` → `1`
- `+[]` → `0` (array to string `""`, then to `0`)
- `+{}` → `NaN` (object to string `"[object Object]"`, then `NaN`)

---

## 4. Closures in Loops

### Q16. What is the output?

```js
function makeAdders() {
  var adders = [];
  for (var i = 0; i < 3; i++) {
    adders.push(function (x) {
      return i + x;
    });
  }
  return adders;
}
var adders = makeAdders();
console.log(adders[0](10));
console.log(adders[1](10));
console.log(adders[2](10));
```

**Output:**
```
13
13
13
```

**Explanation:**  
All closures capture the same `i` variable (because `var` is function-scoped). After the loop, `i = 3`. So every adder adds `3 + 10 = 13`.

---

### Q17. Fix Q16 using IIFE.

```js
function makeAdders() {
  var adders = [];
  for (var i = 0; i < 3; i++) {
    adders.push(
      (function (j) {
        return function (x) {
          return j + x;
        };
      })(i)
    );
  }
  return adders;
}
var adders = makeAdders();
console.log(adders[0](10)); // 10
console.log(adders[1](10)); // 11
console.log(adders[2](10)); // 12
```

**Explanation:**  
The IIFE immediately captures the current value of `i` as `j`. Each closure now has its own `j`.

---

## 5. this Keyword

### Q18. What is the output?

```js
const obj = {
  name: "Alice",
  greet: function () {
    console.log(this.name);
  },
};
obj.greet();
const fn = obj.greet;
fn();
```

**Output:**
```
Alice
undefined
```

**Explanation:**  
- `obj.greet()` → `this` = `obj`, so `obj.name` = `"Alice"`
- `const fn = obj.greet` → the function is **detached**. When called as `fn()` in non-strict mode, `this` = global object (`window`/`global`), which has no `name` property → `undefined`

---

### Q19. What is the output?

```js
const obj = {
  name: "Alice",
  greet: () => {
    console.log(this.name);
  },
};
obj.greet();
```

**Output:**
```
undefined
```

**Explanation:**  
Arrow functions do NOT have their own `this`. They inherit `this` from their **lexical scope** — in this case, the surrounding scope when the object was defined (the module/global scope). `this.name` is `undefined` in the global scope.

---

### Q20. What is the output?

```js
function Person(name) {
  this.name = name;
  this.sayHi = function () {
    setTimeout(function () {
      console.log("Hi, I am " + this.name);
    }, 100);
  };
}
const p = new Person("Bob");
p.sayHi();
```

**Output:**
```
Hi, I am undefined
```

**Explanation:**  
The `setTimeout` callback is a regular function. When it runs, `this` refers to the global object (or `undefined` in strict mode), not the `Person` instance. Fix: use arrow function or `.bind(this)`.

---

### Q21. Fix Q20 with an arrow function.

```js
function Person(name) {
  this.name = name;
  this.sayHi = function () {
    setTimeout(() => {
      console.log("Hi, I am " + this.name); // Hi, I am Bob
    }, 100);
  };
}
const p = new Person("Bob");
p.sayHi();
```

**Explanation:**  
Arrow functions inherit `this` from the enclosing `sayHi` method, where `this` is the `Person` instance.

---

## 6. Prototypes & Inheritance

### Q22. What is the output?

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + " makes a noise.";
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const d = new Dog("Rex");
console.log(d instanceof Dog);
console.log(d instanceof Animal);
console.log(d.speak());
```

**Output:**
```
true
true
Rex makes a noise.
```

**Explanation:**  
`Dog.prototype` inherits from `Animal.prototype` via `Object.create`. `instanceof` walks the prototype chain, so `d` is an instance of both. `speak()` is found on `Animal.prototype` via the chain.

---

### Q23. What is the output?

```js
const a = {};
const b = Object.create(a);
a.x = 10;
console.log(b.x);
console.log(b.hasOwnProperty("x"));
```

**Output:**
```
10
false
```

**Explanation:**  
`b` inherits from `a` via the prototype chain. `b.x` finds `x` on `a` through the chain, so it prints `10`. But `x` is NOT an own property of `b`, so `hasOwnProperty("x")` returns `false`.

---

## 7. Event Loop & Async

### Q24. What is the output?

```js
console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

**Output:**
```
Start
End
Promise
setTimeout
```

**Explanation:**  
- Synchronous code runs first: `"Start"`, `"End"`
- **Microtask queue** (Promises) runs before the **macrotask queue** (setTimeout)
- So `"Promise"` runs before `"setTimeout"`

---

### Q25. What is the output?

```js
console.log("1");

setTimeout(function () {
  console.log("2");
  Promise.resolve().then(function () {
    console.log("3");
  });
}, 0);

Promise.resolve().then(function () {
  console.log("4");
  setTimeout(function () {
    console.log("5");
  }, 0);
});

console.log("6");
```

**Output:**
```
1
6
4
2
3
5
```

**Explanation:**
1. Sync: `1`, `6`
2. Microtask queue: Promise callback → prints `4`, schedules a new setTimeout for `5`
3. Macrotask queue: first setTimeout → prints `2`, schedules a Promise for `3`
4. Microtask queue after that macrotask: prints `3`
5. Macrotask queue: the setTimeout from step 2 → prints `5`

---

### Q26. What is the output?

```js
async function foo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("C");
foo();
console.log("D");
```

**Output:**
```
C
A
D
B
```

**Explanation:**
- `"C"` logs synchronously
- `foo()` is called: `"A"` logs, then `await` pauses `foo()` and schedules the rest as a microtask
- `"D"` logs synchronously
- Microtask runs: `"B"` logs

---

### Q27. What is the output?

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Output:**
```
3  (after 0s)
3  (after 1s)
3  (after 3s)
```

**Explanation:**  
`var i` is shared. All callbacks capture the same `i`. By the time each fires, the loop is complete and `i === 3`.

---

## 8. Truthy / Falsy

### Q28. Which of the following are falsy?

```js
Boolean(0)
Boolean("")
Boolean(null)
Boolean(undefined)
Boolean(NaN)
Boolean(false)
Boolean(0n)        // BigInt zero
Boolean(-0)
Boolean([])
Boolean({})
Boolean("0")
Boolean("false")
```

**Answer — Falsy values:**
```
false, 0, "", null, undefined, NaN, 0n, -0
```

**Truthy values:**
```
[], {}, "0", "false"  ← ALL truthy!
```

**Key Trick:** Empty array `[]` and empty object `{}` are **truthy**. The string `"0"` and `"false"` are also **truthy** (non-empty strings).

---

### Q29. What is the output?

```js
console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log({} + {});
```

**Output:**
```
""
"[object Object]"
"[object Object]"
"[object Object][object Object]"
```

**Explanation:**
- `[] + []` → `"" + ""` = `""`
- `[] + {}` → `"" + "[object Object]"` = `"[object Object]"`
- `{} + []` → when `{}` is at the start of a statement it can be parsed as an **empty block**, so this may print `0` in some consoles. As an expression (in context): `"[object Object]"`
- `{} + {}` → `"[object Object][object Object]"`

> ⚠️ `{} + []` is one of the most notorious JS quirks. In a browser console (where `{}` is an empty block), it prints `0`. In an expression context, it prints `"[object Object]"`.

---

## 9. Spread, Rest & Destructuring

### Q30. What is the output?

```js
const [a, , b, c = 10] = [1, 2, 3];
console.log(a, b, c);
```

**Output:**
```
1 3 10
```

**Explanation:**
- `a = 1`, second element `2` is **skipped**, `b = 3`, `c` uses default `10` because the array has no 4th element.

---

### Q31. What is the output?

```js
const { x: a, y: b = 5 } = { x: 1 };
console.log(a, b);
```

**Output:**
```
1 5
```

**Explanation:**  
`x: a` means "take `x` from the object and assign it to `a`". `y: b = 5` means "take `y`, assign to `b`, default to `5` if `y` is `undefined`".

---

### Q32. What is the output?

```js
const arr = [1, 2, 3];
const [first, ...rest] = arr;
console.log(first);
console.log(rest);
```

**Output:**
```
1
[2, 3]
```

---

### Q33. What is the output?

```js
function foo(a, b, ...args) {
  console.log(a, b, args);
}
foo(1, 2, 3, 4, 5);
```

**Output:**
```
1 2 [3, 4, 5]
```

**Explanation:**  
The rest parameter `...args` collects all remaining arguments into an array.

---

## 10. Functions & Arrow Functions

### Q34. What is the output?

```js
function foo() {
  return
  {
    name: "Alice"
  }
}
console.log(foo());
```

**Output:**
```
undefined
```

**Explanation:**  
JavaScript's **Automatic Semicolon Insertion (ASI)** inserts a semicolon after `return`, making it `return;`. The object literal on the next line is never returned. Fix: put the opening brace on the same line as `return`.

---

### Q35. What is the output?

```js
const multiply = (x) => x * 2;
const square = (x) => x ** 2;
const transform = (fn, val) => fn(val);

console.log(transform(multiply, 4));
console.log(transform(square, 4));
```

**Output:**
```
8
16
```

---

### Q36. What is the output?

```js
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
const counter = outer();
console.log(counter());
console.log(counter());
console.log(counter());
```

**Output:**
```
1
2
3
```

**Explanation:**  
Classic **closure** example. `inner` closes over `count`. Each call to `counter()` increments and returns the shared `count`.

---

### Q37. What is the output?

```js
console.log((function (x) {
  return x * x;
})(5));
```

**Output:**
```
25
```

**Explanation:**  
IIFE (Immediately Invoked Function Expression) — defined and immediately called with argument `5`.

---

## 11. Objects & Arrays

### Q38. What is the output?

```js
const obj = { a: 1 };
const clone = obj;
clone.a = 99;
console.log(obj.a);
```

**Output:**
```
99
```

**Explanation:**  
Objects are assigned **by reference**. `clone` and `obj` point to the same object. Mutating `clone.a` also changes `obj.a`.

---

### Q39. What is the output?

```js
const arr = [1, 2, 3];
arr[10] = 99;
console.log(arr.length);
console.log(arr[5]);
```

**Output:**
```
11
undefined
```

**Explanation:**  
Setting `arr[10]` extends the array length to `11`. Indices `3` through `9` are **empty slots** (sparse array), which return `undefined` when accessed.

---

### Q40. What is the output?

```js
const a = [1, 2, 3];
const b = [1, 2, 3];
console.log(a == b);
console.log(a === b);
console.log(JSON.stringify(a) === JSON.stringify(b));
```

**Output:**
```
false
false
true
```

**Explanation:**  
`==` and `===` compare objects by reference, not by value. `a` and `b` are different array instances. `JSON.stringify` converts them to strings, which ARE equal by value.

---

### Q41. What is the output?

```js
const obj = {};
obj[true] = "yes";
obj[1] = "one";
obj["1"] = "uno";
console.log(obj);
```

**Output:**
```
{ '1': 'uno', true: 'yes' }
```

**Explanation:**  
Object keys are always strings (or Symbols). `true` coerces to `"true"`. The number `1` and string `"1"` both coerce to `"1"`, so the last assignment `"uno"` overwrites `"one"`.

---

## 12. Output-Based Questions

### Q42. What is the output?

```js
let x = 10;
let y = x++;
console.log(x, y);
```

**Output:**
```
11 10
```

**Explanation:**  
`x++` (post-increment) returns the current value of `x` (`10`) and THEN increments `x` to `11`. So `y = 10`, `x = 11`.

---

### Q43. What is the output?

```js
let x = 10;
let y = ++x;
console.log(x, y);
```

**Output:**
```
11 11
```

**Explanation:**  
`++x` (pre-increment) increments FIRST then returns the new value. So `x = 11`, `y = 11`.

---

### Q44. What is the output?

```js
console.log(2 ** 3 ** 2);
```

**Output:**
```
512
```

**Explanation:**  
The `**` operator is **right-associative**. `3 ** 2 = 9`, then `2 ** 9 = 512`.

---

### Q45. What is the output?

```js
console.log(0.1 + 0.2 === 0.3);
console.log(0.1 + 0.2);
```

**Output:**
```
false
0.30000000000000004
```

**Explanation:**  
Floating-point arithmetic in JavaScript (IEEE 754) is imprecise. `0.1 + 0.2` yields `0.30000000000000004`, not exactly `0.3`.

---

### Q46. What is the output?

```js
let obj = {
  value: 10,
  getValue: function () {
    return this.value;
  },
};

let getValue = obj.getValue;
console.log(obj.getValue());
console.log(getValue());
```

**Output:**
```
10
undefined
```

**Explanation:**  
`obj.getValue()` → `this` = `obj` → `10`. `getValue()` is detached → `this` = global → no `value` property → `undefined`.

---

### Q47. What is the output?

```js
console.log(typeof typeof 42);
```

**Output:**
```
"string"
```

**Explanation:**  
`typeof 42` = `"number"` (a string). `typeof "number"` = `"string"`.

---

### Q48. What is the output?

```js
console.log(null + 1);
console.log(undefined + 1);
console.log(null + undefined);
```

**Output:**
```
1
NaN
NaN
```

**Explanation:**
- `null` coerces to `0` in numeric contexts → `0 + 1 = 1`
- `undefined` coerces to `NaN` → `NaN + 1 = NaN`
- `0 + NaN = NaN`

---

### Q49. What is the output?

```js
const a = "5";
const b = 3;
console.log(a - b);
console.log(a + b);
console.log(a * b);
```

**Output:**
```
2
"53"
15
```

**Explanation:**
- `-`, `*` operators coerce both operands to numbers → `5 - 3 = 2`, `5 * 3 = 15`
- `+` with a string triggers **string concatenation** → `"5" + 3 = "53"`

---

### Q50. What is the output?

```js
let a = { n: 1 };
let b = a;
a.x = a = { n: 2 };

console.log(a.x);
console.log(b.x);
```

**Output:**
```
undefined
{ n: 2 }
```

**Explanation:**  
This is about **assignment order and references**:
1. `a.x = a = { n: 2 }` — property access `a.x` is evaluated first (references the OLD object that both `a` and `b` point to)
2. Then `a = { n: 2 }` runs — `a` now points to the **new object** `{ n: 2 }`
3. Then `a.x = { n: 2 }` sets `.x` on the **old object** (which `b` still references)
- New `a = { n: 2 }` has no `.x` → `undefined`
- `b` = old object which got `.x` set to `{ n: 2 }`

---

### Q51. What is the output?

```js
function test() {
  console.log(a);
  console.log(foo());

  var a = 1;
  function foo() {
    return 2;
  }
}
test();
```

**Output:**
```
undefined
2
```

**Explanation:**  
`var a` is hoisted as `undefined`. `foo` is a function declaration and fully hoisted, so `foo()` returns `2`.

---

### Q52. What is the output?

```js
console.log([] == false);
console.log([] == 0);
console.log([] == "");
console.log([""] == false);
```

**Output:**
```
true
true
true
true
```

**Explanation:**  
All via coercion:
- `[]` → `""` → `0`
- `false` → `0`
- All comparisons eventually become `0 == 0`

---

### Q53. What is the output?

```js
const p1 = new Promise((resolve) => {
  resolve(1);
  resolve(2);
  resolve(3);
});
p1.then(console.log);
```

**Output:**
```
1
```

**Explanation:**  
A Promise can only be resolved **once**. The first `resolve(1)` transitions the promise to fulfilled state. Subsequent resolve calls are ignored.

---

### Q54. What is the output?

```js
async function fetchData() {
  return 42;
}
const result = fetchData();
console.log(result);
result.then(console.log);
```

**Output:**
```
Promise { 42 }
42
```

**Explanation:**  
An `async` function always returns a **Promise**. `result` is a resolved Promise with value `42`. The `.then` callback logs `42` asynchronously.

---

### Q55. What is the output?

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const g = gen();
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
```

**Output:**
```
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true }
```

**Explanation:**  
Generator functions return an iterator. Each `next()` call runs until the next `yield`. After the last `yield`, `done` becomes `true` and `value` is `undefined`.

---

### Q56. What is the output?

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
};
const { a, ...rest } = obj;
console.log(a);
console.log(rest);
```

**Output:**
```
1
{ b: 2, c: 3 }
```

---

### Q57. What is the output?

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b);
```

**Output:**
```
2 1
```

**Explanation:**  
Destructuring swap — no temporary variable needed. The right side `[b, a]` creates `[2, 1]`, which is destructured into `a=2, b=1`.

---

### Q58. What is the output?

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});
promise.then(() => console.log(3));
console.log(4);
```

**Output:**
```
1
2
4
3
```

**Explanation:**  
The Promise executor runs **synchronously**: prints `1`, resolves, prints `2`. The `.then` callback is a **microtask** and runs after current synchronous code. `4` is synchronous, so it prints before `3`.

---

### Q59. What is the output?

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Output:**
```
true
false
```

**Explanation:**  
Comparison operators are **left-associative**:
- `1 < 2` = `true`, then `true < 3` = `1 < 3` = `true`
- `3 > 2` = `true`, then `true > 1` = `1 > 1` = `false`

---

### Q60. What is the output?

```js
var x = 21;
var girl = function () {
  console.log(x);
  var x = 20;
};
girl();
```

**Output:**
```
undefined
```

**Explanation:**  
Inside `girl()`, `var x` is hoisted to the top of the function scope. So at `console.log(x)`, the local `x` exists but is `undefined` (not the outer `x = 21`).

---

### Q61. What is the output?

```js
console.log(typeof null === "object");
console.log(null instanceof Object);
```

**Output:**
```
true
false
```

**Explanation:**
- `typeof null === "object"` is `true` due to the historical JS bug
- `null instanceof Object` is `false` — `null` has no prototype chain, so `instanceof` correctly returns `false`

---

### Q62. What is the output?

```js
const obj = {
  name: "Alice",
  sayName() {
    const inner = () => {
      console.log(this.name);
    };
    inner();
  },
};
obj.sayName();
```

**Output:**
```
Alice
```

**Explanation:**  
`sayName` is a regular method, so `this` = `obj`. `inner` is an **arrow function** defined inside `sayName`, so it inherits `this` from `sayName`. Thus `this.name = "Alice"`.

---

### Q63. What is the output?

```js
let i = 0;
while (i < 5) {
  if (i === 3) break;
  console.log(i);
  i++;
}
```

**Output:**
```
0
1
2
```

**Explanation:**  
The loop breaks when `i === 3`, so only `0`, `1`, `2` are printed.

---

### Q64. What is the output?

```js
function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(add(1)(2)(3));
```

**Output:**
```
6
```

**Explanation:**  
**Currying** via closures. Each function captures the previous argument. `1 + 2 + 3 = 6`.

---

### Q65. What is the output?

```js
const obj1 = { ref: { value: 1 } };
const obj2 = { ...obj1 };
obj2.ref.value = 99;
console.log(obj1.ref.value);
```

**Output:**
```
99
```

**Explanation:**  
The spread operator performs a **shallow copy**. `obj2.ref` is the same reference as `obj1.ref`. Mutating `obj2.ref.value` also changes `obj1.ref.value`.

---

### Q66. What is the output?

```js
[1, 2, 3].map(parseInt);
```

**Output:**
```
[1, NaN, NaN]
```

**Explanation:**  
`Array.map` passes three arguments to the callback: `(element, index, array)`. `parseInt` accepts two arguments: `(string, radix)`.
- `parseInt(1, 0)` → radix `0` is treated as `10` → `1`
- `parseInt(2, 1)` → radix `1` is invalid → `NaN`
- `parseInt(3, 2)` → base-2, but `3` is not valid in base-2 → `NaN`

---

### Q67. What is the output?

```js
const arr = [3, 1, 2];
arr.sort();
console.log(arr);
```

**Output:**
```
[1, 2, 3]
```

But what about:

```js
const arr = [10, 9, 2, 1, 100];
arr.sort();
console.log(arr);
```

**Output:**
```
[1, 10, 100, 2, 9]
```

**Explanation:**  
`Array.sort()` sorts elements as **strings** by default. `"10" < "2"` lexicographically because `"1" < "2"`. To sort numerically: `arr.sort((a, b) => a - b)`.

---

### Q68. What is the output?

```js
const obj = {};
console.log(obj.toString());
console.log(obj.valueOf());
```

**Output:**
```
[object Object]
{}
```

**Explanation:**  
- `toString()` returns `"[object Object]"` by default
- `valueOf()` returns the object itself

---

### Q69. What is the output?

```js
let a = { x: 1 };
let b = JSON.parse(JSON.stringify(a));
b.x = 99;
console.log(a.x);
```

**Output:**
```
1
```

**Explanation:**  
`JSON.parse(JSON.stringify(obj))` creates a **deep copy**. `b` is completely independent of `a`, so mutating `b.x` does not affect `a.x`.

---

### Q70. What is the output?

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound.`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks.`;
  }
}

const d = new Dog("Rex");
console.log(d.speak());
console.log(d instanceof Dog);
console.log(d instanceof Animal);
```

**Output:**
```
Rex barks.
true
true
```

**Explanation:**  
`Dog` overrides `speak()`. `instanceof` walks the prototype chain — `Dog.prototype` extends `Animal.prototype`, so `d` is an instance of both.

---

## 🔥 Bonus — Classic JS Quirks

```js
console.log([] + []);           // ""
console.log([] + {});           // "[object Object]"
console.log({} + []);           // "[object Object]" (or 0 in console)
console.log(+[]);               // 0
console.log(+{});               // NaN
console.log(+null);             // 0
console.log(+undefined);        // NaN
console.log(!!"false");         // true  (non-empty string)
console.log(!!"");              // false
console.log(!!null);            // false
console.log(!!0);               // false
console.log(typeof NaN);        // "number"
console.log(NaN === NaN);       // false
console.log(isNaN("hello"));    // true  (coerces to NaN)
console.log(Number.isNaN("hello")); // false (strict — no coercion)
console.log(null == undefined); // true
console.log(null === undefined);// false
console.log(0.1 + 0.2 === 0.3);// false (floating point)
```

---

> 📌 **Key Takeaways:**
> - `var` is function-scoped, `let`/`const` are block-scoped
> - `==` uses type coercion, `===` does not
> - Arrow functions don't have their own `this`
> - Promises (microtasks) run before setTimeout (macrotasks)
> - `typeof null === "object"` is a bug, not a feature
> - `NaN !== NaN` — use `Number.isNaN()` for safe NaN checks
> - Array/Object `==` compares by reference, not value
