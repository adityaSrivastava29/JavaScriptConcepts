// ============================================================
// call, bind, apply — Practice File
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: call — immediate invocation, comma-separated args
// ─────────────────────────────────────────────────────────────

console.log("--- Section 1: call ---");

function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

console.log(greet.call(alice, "Hello", "!")); // "Hello, Alice!"
console.log(greet.call(bob, "Hi", ".")); // "Hi, Bob."

// Borrowing Array methods for array-like objects
function logArgs() {
  const arr = Array.prototype.slice.call(arguments); // arguments → real array
  console.log(arr.map((x) => x * 2));
}
logArgs(1, 2, 3); // [2, 4, 6]

// Constructor chaining with call
function Animal(name) {
  this.name = name;
}
function Dog(name, breed) {
  Animal.call(this, name); // inherit own props
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const rex = new Dog("Rex", "Lab");
console.log(rex.name, rex.breed); // "Rex" "Lab"

// ─────────────────────────────────────────────────────────────
// SECTION 2: apply — immediate invocation, array args
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 2: apply ---");

function sum(a, b, c) {
  return a + b + c;
}

console.log(sum.apply(null, [1, 2, 3])); // 6
console.log(greet.apply(alice, ["Hey", "~"])); // "Hey, Alice~"

// Classic: Math.max with an array (pre-ES6 idiom)
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(Math.max.apply(null, nums)); // 9
console.log(Math.min.apply(null, nums)); // 1

// apply vs spread (modern equivalent)
console.log(Math.max(...nums)); // 9 — same result

// Borrowing Array.prototype.reduce via apply
function sumArgs() {
  return Array.prototype.reduce.call(arguments, (acc, n) => acc + n, 0);
}
console.log(sumArgs(1, 2, 3, 4, 5)); // 15

// ─────────────────────────────────────────────────────────────
// SECTION 3: bind — returns new function, deferred
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 3: bind ---");

const greetAlice = greet.bind(alice, "Hello");
console.log(greetAlice("!")); // "Hello, Alice!"
console.log(greetAlice("...")); // "Hello, Alice..."

// Partial application
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// bind for pre-filling log levels
function log(level, message) {
  return `[${level}] ${message}`;
}
const info = log.bind(null, "INFO");
const error = log.bind(null, "ERROR");
console.log(info("Server started")); // [INFO] Server started
console.log(error("DB connection lost")); // [ERROR] DB connection lost

// bind on a class method (fixing `this` for callbacks)
class Counter {
  constructor() {
    this.count = 0;
  }
  increment() {
    this.count++;
    return this.count;
  }
}
const counter = new Counter();
const boundIncrement = counter.increment.bind(counter);
console.log(boundIncrement()); // 1
console.log(boundIncrement()); // 2

// ─────────────────────────────────────────────────────────────
// SECTION 4: Polyfill — myCall
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 4: myCall Polyfill ---");

Function.prototype.myCall = function (context, ...args) {
  // null/undefined → globalThis; primitives → wrapped in Object
  context = context == null ? globalThis : Object(context);
  const sym = Symbol("fn"); // unique key to avoid collisions
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};

function sayHello(greeting) {
  return `${greeting}, I am ${this.name}`;
}
const user1 = { name: "Alice" };
console.log(sayHello.myCall(user1, "Hello")); // "Hello, I am Alice"

// Verify it works like native call
console.log(sayHello.myCall({ name: "Bob" }, "Hi")); // "Hi, I am Bob"

// ─────────────────────────────────────────────────────────────
// SECTION 5: Polyfill — myApply
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 5: myApply Polyfill ---");

Function.prototype.myApply = function (context, args) {
  context = context == null ? globalThis : Object(context);
  if (args !== undefined && !Array.isArray(args)) {
    throw new TypeError("args must be an array");
  }
  const sym = Symbol("fn");
  context[sym] = this;
  const result = args ? context[sym](...args) : context[sym]();
  delete context[sym];
  return result;
};

function addThree(a, b, c) {
  return a + b + c;
}
console.log(addThree.myApply(null, [10, 20, 30])); // 60
console.log(Math.max.myApply(null, [5, 3, 9, 1])); // 9

// ─────────────────────────────────────────────────────────────
// SECTION 6: Polyfill — myBind (the famous interview question)
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 6: myBind Polyfill ---");

Function.prototype.myBind = function (context, ...outerArgs) {
  const fn = this; // capture original function

  function boundFn(...innerArgs) {
    // If called with `new`, ignore bound context; use new's fresh object
    if (this instanceof boundFn) {
      return new fn(...outerArgs, ...innerArgs);
    }
    return fn.apply(context, [...outerArgs, ...innerArgs]);
  }

  // Preserve prototype so instanceof works correctly after `new boundFn()`
  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
  }

  return boundFn;
};

// Test 1: basic bind
function introduce(greeting, punct) {
  return `${greeting}, I'm ${this.name}${punct}`;
}
const introduceAlice = introduce.myBind({ name: "Alice" }, "Hello");
console.log(introduceAlice("!")); // "Hello, I'm Alice!"
console.log(introduceAlice("...")); // "Hello, I'm Alice..."

// Test 2: partial application
function power(base, exp) {
  return base ** exp;
}
const square = power.myBind(null, 2);
const cube = power.myBind(null, 3);
console.log(square(4)); // 16  (2^4)  — wait, base=2, exp=4
console.log(cube(3)); // 27  (3^3)

// Test 3: new overrides bound context
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind({ x: 999 }, 10); // pre-fill x=10
const p = new BoundPoint(20); // y=20, bound this ignored
console.log(p.x, p.y); // 10 20 — NOT 999

// Test 4: instanceof still works after new
console.log(p instanceof Point); // true (prototype preserved)

// ─────────────────────────────────────────────────────────────
// SECTION 7: Arrow functions ignore call/apply/bind
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 7: Arrow Functions & this ---");

const obj = { name: "Alice" };

const arrowFn = () => `Hello, ${this?.name ?? "undefined"}`;

console.log(arrowFn.call(obj)); // "Hello, undefined" — call has no effect
console.log(arrowFn.apply(obj)); // "Hello, undefined"
console.log(arrowFn.bind(obj)()); // "Hello, undefined"

// Regular fn vs arrow in same object
const person = {
  name: "Carol",
  regularGreet: function () {
    return `Hi from ${this.name}`;
  },
  arrowGreet: () => `Hi from ${this?.name ?? "undefined"}`,
};
console.log(person.regularGreet.call({ name: "Dave" })); // "Hi from Dave"
console.log(person.arrowGreet.call({ name: "Dave" })); // "Hi from undefined"

// ─────────────────────────────────────────────────────────────
// SECTION 8: Chaining bind — second bind has no effect on `this`
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 8: bind chaining ---");

function getVal() {
  return this.x;
}

const bound1 = getVal.bind({ x: 1 });
const bound2 = bound1.bind({ x: 2 }); // tries to rebind — won't work

console.log(bound1()); // 1
console.log(bound2()); // 1 — first bind wins

// ─────────────────────────────────────────────────────────────
// SECTION 9: null/undefined as thisArg
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 9: null/undefined thisArg ---");

function showThis() {
  // In non-strict: this === globalThis when null/undefined passed
  return this === globalThis ? "globalThis" : JSON.stringify(this);
}

console.log(showThis.call(null)); // "globalThis" (non-strict)
console.log(showThis.call(undefined)); // "globalThis" (non-strict)
console.log(showThis.call(42)); // "42" (primitive wrapped in Object)

// ─────────────────────────────────────────────────────────────
// SECTION 10: Object.prototype.toString.call — reliable type check
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 10: toString type checking ---");

function typeOf(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

console.log(typeOf([])); // "array"
console.log(typeOf({})); // "object"
console.log(typeOf(null)); // "null"
console.log(typeOf(undefined)); // "undefined"
console.log(typeOf(42)); // "number"
console.log(typeOf("str")); // "string"
console.log(typeOf(new Date())); // "date"
console.log(typeOf(/regex/)); // "regexp"
console.log(typeOf(() => {})); // "function"

// ─────────────────────────────────────────────────────────────
// SECTION 11: Tricky interview output questions
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 11: Tricky Output Questions ---");

// Q: What does reBound() return?
function fn() {
  return this.x;
}
const a = fn.bind({ x: 1 });
const b = a.bind({ x: 2 }); // rebind attempt
console.log(a()); // 1
console.log(b()); // 1 — first bind is permanent

// Q: call vs bind in setTimeout
const target = { val: 99 };
function printVal() {
  return this.val;
}

// bind — passes a bound function, executes later with correct this
const bindResult = printVal.bind(target);
console.log(typeof bindResult); // "function"
console.log(bindResult()); // 99

// call — executes immediately, setTimeout receives the return value (undefined)
const callResult = printVal.call(target); // executes NOW
console.log(callResult); // 99

// Q: new + bind
function Foo(x) {
  this.x = x;
}
const BoundFoo = Foo.bind({ x: 999 }); // bound this = {x:999}
const instance = new BoundFoo(42); // new ignores bound this
console.log(instance.x); // 42 — not 999

// Q: partial application accumulation
function add(a, b, c) {
  return a + b + c;
}
const addTen = add.bind(null, 10);
const addTenAndFive = addTen.bind(null, 5); // adds 5 as next arg
console.log(addTenAndFive(3)); // 18 (10 + 5 + 3)

// ─────────────────────────────────────────────────────────────
// SECTION 12: hasOwnProperty with call on Object.create(null)
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 12: hasOwnProperty + call ---");

const dict = Object.create(null); // no prototype — no hasOwnProperty!
dict.key = "value";
dict.other = "data";

// dict.hasOwnProperty("key") → TypeError: not a function

// Solution: borrow from Object.prototype
console.log(Object.prototype.hasOwnProperty.call(dict, "key")); // true
console.log(Object.prototype.hasOwnProperty.call(dict, "missing")); // false
// Modern alternative:
console.log(Object.hasOwn(dict, "key")); // true (ES2022)
