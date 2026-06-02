---
layout: note
---

# Prototypes & Inheritance in JavaScript

---

## Table of Contents

1. [What is a Prototype?](#1-what-is-a-prototype)
2. [Prototype Chain](#2-prototype-chain)
3. [**proto** vs prototype](#3-__proto__-vs-prototype)
4. [Object.create()](#4-objectcreate)
5. [Constructor Functions](#5-constructor-functions)
6. [ES6 Classes (Syntactic Sugar)](#6-es6-classes-syntactic-sugar)
7. [Inheritance Patterns](#7-inheritance-patterns)
8. [hasOwnProperty & property lookup](#8-hasownproperty--property-lookup)
9. [Object.getPrototypeOf / Object.setPrototypeOf](#9-objectgetprototypeof--objectsetprototypeof)
10. [instanceof operator](#10-instanceof-operator)
11. [Mixins](#11-mixins)
12. [Common Gotchas](#12-common-gotchas)
13. [Interview Questions — Famous & Tricky](#13-interview-questions--famous--tricky)

---

## 1. What is a Prototype?

Every JavaScript object has an **internal slot** `[[Prototype]]` that references another object (or `null`).  
When you access a property that doesn't exist on an object, JS automatically looks up the chain through `[[Prototype]]`. This is the **prototype chain**.

```js
const obj = { a: 1 };
// obj.__proto__ === Object.prototype  ✅
// Object.prototype.__proto__ === null  ✅ (end of chain)
```

**Key rule:** Functions have a `.prototype` property (used when called with `new`). All objects have a `[[Prototype]]` (internal, exposed via `__proto__` or `Object.getPrototypeOf`).

---

## 2. Prototype Chain

```
myObj  →  Constructor.prototype  →  Object.prototype  →  null
```

Property lookup algorithm:

1. Check own properties of `myObj`
2. If not found, go to `myObj.__proto__` (i.e., `Constructor.prototype`)
3. Keep walking up until found or `null` is reached → `undefined`

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound.`;
};

const dog = new Animal("Rex");
console.log(dog.speak()); // "Rex makes a sound." — found on prototype
console.log(dog.hasOwnProperty("speak")); // false — lives on prototype, not dog
```

---

## 3. `__proto__` vs `prototype`

|           | `prototype`                               | `__proto__`                           |
| --------- | ----------------------------------------- | ------------------------------------- |
| Lives on  | **Functions** only                        | **Every object**                      |
| Purpose   | Template for instances created with `new` | Link to the object's actual prototype |
| Standard? | Yes (`Function.prototype`)                | Legacy (use `Object.getPrototypeOf`)  |

```js
function Foo() {}

// Foo.prototype  — the object assigned as [[Prototype]] of instances
// Foo.__proto__  — Foo's own prototype (Function.prototype)

const f = new Foo();
f.__proto__ === Foo.prototype; // true
Foo.__proto__ === Function.prototype; // true
Function.prototype.__proto__ === Object.prototype; // true
```

> **Interview trap:** `__proto__` is NOT the same as `.prototype`. Candidates mix these up constantly.

---

## 4. `Object.create()`

Creates a new object with a **specified prototype**.

```js
const animal = {
  speak() {
    return `${this.name} speaks`;
  },
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.speak(); // "Rex speaks"

Object.getPrototypeOf(dog) === animal; // true
```

### `Object.create(null)`

Creates an object with **no prototype** — a true "dictionary" (no `toString`, `hasOwnProperty`, etc.).

```js
const map = Object.create(null);
map.key = "value";
"hasOwnProperty" in map; // false — no prototype chain at all!
```

---

## 5. Constructor Functions

Before ES6 classes, the standard pattern was constructor functions + prototype:

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

Person.prototype.toString = function () {
  return `Person(${this.name}, ${this.age})`;
};

const alice = new Person("Alice", 30);
alice.greet(); // "Hi, I'm Alice"
```

### What `new` does (step by step):

1. Creates a plain new object `{}`
2. Sets its `[[Prototype]]` to `Constructor.prototype`
3. Calls the constructor with `this` bound to that new object
4. Returns the new object (unless the constructor explicitly returns a different object)

```js
// Manual "new":
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

> **Famous interview question:** "Implement your own `new` operator."

---

## 6. ES6 Classes (Syntactic Sugar)

Classes are just constructor functions under the hood — the prototype chain works identically.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound.`;
  }
  static create(name) {
    // lives on Animal, NOT Animal.prototype
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // must call super before using this
    this.breed = breed;
  }
  speak() {
    return `${this.name} barks.`;
  }
}

const d = new Dog("Rex", "Lab");
d instanceof Dog; // true
d instanceof Animal; // true — prototype chain includes Animal.prototype
```

### Class vs Constructor function differences:

- Classes are NOT hoisted (unlike function declarations)
- Class bodies run in **strict mode** automatically
- `super` is only available in classes
- Methods defined in class body are **non-enumerable**

---

## 7. Inheritance Patterns

### A. Prototypal Inheritance (ES5)

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} speaks`;
};

function Dog(name, breed) {
  Animal.call(this, name); // "super()" equivalent — inherit own props
  this.breed = breed;
}

// Set up prototype chain:
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // fix the constructor reference!

Dog.prototype.bark = function () {
  return "Woof!";
};

const d = new Dog("Rex", "Lab");
d.speak(); // "Rex speaks" — inherited from Animal.prototype
d.bark(); // "Woof!"
```

> **Trap:** Forgetting `Dog.prototype.constructor = Dog` causes `d.constructor === Animal` instead of `Dog`.

### B. ES6 Class Inheritance

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} speaks`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() {
    return "Woof!";
  }
}
```

### C. Mixin Pattern (multiple inheritance workaround)

```js
const Serializable = (Base) =>
  class extends Base {
    serialize() {
      return JSON.stringify(this);
    }
  };

const Validatable = (Base) =>
  class extends Base {
    validate() {
      return Object.keys(this).length > 0;
    }
  };

class User extends Serializable(Validatable(class {})) {
  constructor(name) {
    super();
    this.name = name;
  }
}

const u = new User("Alice");
u.serialize(); // '{"name":"Alice"}'
u.validate(); // true
```

---

## 8. `hasOwnProperty` & Property Lookup

```js
const parent = { shared: true };
const child = Object.create(parent);
child.own = "mine";

"own" in child; // true  (checks chain)
"shared" in child; // true  (checks chain)
child.hasOwnProperty("own"); // true
child.hasOwnProperty("shared"); // false — lives on parent

// Safe version (child might have Object.create(null) prototype):
Object.prototype.hasOwnProperty.call(child, "own"); // true
// OR modern:
Object.hasOwn(child, "own"); // true (ES2022)
```

---

## 9. `Object.getPrototypeOf` / `Object.setPrototypeOf`

```js
const proto = {
  greet() {
    return "hello";
  },
};
const obj = Object.create(proto);

Object.getPrototypeOf(obj) === proto; // true

// Change prototype at runtime (avoid — bad for perf):
const newProto = {
  greet() {
    return "hi";
  },
};
Object.setPrototypeOf(obj, newProto);
obj.greet(); // "hi"
```

> **Note:** `Object.setPrototypeOf` at runtime breaks V8 optimizations. Prefer `Object.create` at construction time.

---

## 10. `instanceof` Operator

Checks if `Constructor.prototype` appears anywhere in the object's prototype chain.

```js
class A {}
class B extends A {}
const b = new B();

b instanceof B; // true
b instanceof A; // true
b instanceof Object; // true

// Custom Symbol.hasInstance:
class EvenNumber {
  static [Symbol.hasInstance](num) {
    return typeof num === "number" && num % 2 === 0;
  }
}
2 instanceof EvenNumber; // true
3 instanceof EvenNumber; // false
```

> **Tricky:** `instanceof` can fail across iframes/realms because each realm has its own `Array.prototype`.

---

## 11. Mixins

JavaScript doesn't support multiple inheritance natively. Mixins are a pattern to copy methods from multiple sources.

```js
const flyMixin = {
  fly() {
    return `${this.name} is flying`;
  },
};
const swimMixin = {
  swim() {
    return `${this.name} is swimming`;
  },
};

class Duck {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(Duck.prototype, flyMixin, swimMixin);

const d = new Duck("Donald");
d.fly(); // "Donald is flying"
d.swim(); // "Donald is swimming"
```

---

## 12. Common Gotchas

### Shared mutable state on prototype

```js
function Team() {}
Team.prototype.members = []; // ⚠️ shared across ALL instances!

const t1 = new Team();
const t2 = new Team();
t1.members.push("Alice");
console.log(t2.members); // ["Alice"] — oops!

// Fix: initialize in constructor
function Team() {
  this.members = [];
}
```

### `constructor` property

```js
function Foo() {}
Foo.prototype = {};           // replaced the prototype object
const f = new Foo();
f.constructor === Foo;        // false! Now Object
f.constructor === Object;     // true

// Fix:
Foo.prototype = { constructor: Foo, ... };
```

### Arrow functions have no `prototype`

```js
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor
Foo.prototype; // undefined
```

### `Object.create(null)` has no `toString`

```js
const obj = Object.create(null);
obj.toString(); // TypeError: obj.toString is not a function
String(obj); // TypeError too
```

---

## 13. Interview Questions — Famous & Tricky

---

### Q1. What is the difference between `__proto__` and `prototype`?

**Answer:**

- `.prototype` is a property on **constructor functions**, used to set up `[[Prototype]]` for instances created with `new`.
- `.__proto__` (or `Object.getPrototypeOf()`) is the actual `[[Prototype]]` link on every object instance.

```js
function Foo() {}
const f = new Foo();
f.__proto__ === Foo.prototype; // true
Foo.__proto__ === Function.prototype; // true
```

---

### Q2. Implement the `new` operator from scratch.

```js
function myNew(Constructor, ...args) {
  // 1. Create object with Constructor.prototype as [[Prototype]]
  const obj = Object.create(Constructor.prototype);
  // 2. Call constructor with this = obj
  const result = Constructor.apply(obj, args);
  // 3. If constructor returns an object, use that; otherwise use obj
  return result !== null && typeof result === "object" ? result : obj;
}

function Person(name) {
  this.name = name;
}
const p = myNew(Person, "Alice");
p.name; // "Alice"
p instanceof Person; // true
```

---

### Q3. What does `Object.create(null)` return? When would you use it?

Returns an object with **no prototype** — no `toString`, `valueOf`, `hasOwnProperty`.  
Use cases:

- Pure dictionary/map with no risk of prototype pollution
- When checking `key in obj` and you don't want inherited props to interfere

---

### Q4. Fix the prototype chain for constructor function inheritance.

```js
// BROKEN:
function Animal(name) {
  this.name = name;
}
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Animal.prototype; // ❌ mutating Animal.prototype directly!

// CORRECT:
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

---

### Q5. Explain prototype pollution. How do you prevent it?

**Prototype pollution** occurs when an attacker modifies `Object.prototype`, affecting all objects.

```js
// Attack:
const payload = '{"__proto__": {"admin": true}}';
const obj = JSON.parse(payload);
Object.assign({}, obj); // pollutes Object.prototype.admin

({}).admin; // true — ALL objects are now "admin"!
```

**Prevention:**

- Use `JSON.parse` with a reviver that blocks `__proto__`, `constructor`, `prototype`
- Use `Object.create(null)` for user-controlled data stores
- Use `Map` instead of plain objects for dynamic key storage
- Validate/sanitize input before `Object.assign` or deep merge

---

### Q6. What is the output?

```js
function Foo() {}
Foo.prototype.x = 1;

const a = new Foo();
const b = new Foo();

a.x = 2;

console.log(a.x); // ?
console.log(b.x); // ?
delete a.x;
console.log(a.x); // ?
```

**Answer:**

- `a.x` → `2` (own property shadows prototype)
- `b.x` → `1` (from prototype)
- After `delete a.x` → `1` (own prop removed, prototype value revealed again)

---

### Q7. Does `class` create a true class like Java/C++?

No. ES6 `class` is **syntactic sugar** over constructor functions and prototypal inheritance.

```js
class Animal {}
typeof Animal; // "function"
Animal === Animal.prototype.constructor; // true
```

Differences from Java:

- No private fields by spec until `#` syntax (ES2022)
- No method overloading
- Single inheritance only (use mixins for more)
- Runtime prototype manipulation is possible

---

### Q8. What is the output?

```js
class A {
  constructor() {
    this.x = 1;
  }
}
class B extends A {
  constructor() {
    // missing super()
    this.y = 2; // ReferenceError!
  }
}
new B();
```

**Answer:** `ReferenceError: Must call super constructor in derived class before accessing 'this'`  
`super()` must be called before `this` in derived class constructors.

---

### Q9. How does `instanceof` work internally?

`a instanceof B` walks `a`'s prototype chain looking for `B.prototype`.

```js
function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

---

### Q10. What is the difference between classical and prototypal inheritance?

|               | Classical (Java/C++)  | Prototypal (JavaScript)        |
| ------------- | --------------------- | ------------------------------ |
| Based on      | Classes as blueprints | Objects linking to objects     |
| Instances     | Created from class    | Created from objects           |
| Flexibility   | Rigid hierarchy       | Dynamic, can change at runtime |
| Multiple inh. | Interfaces/abstract   | Mixins                         |
| Memory        | Copy of structure     | Shared via prototype chain     |

---

### Q11. Tricky — What does this log?

```js
const obj = {};
Object.prototype.foo = "bar";
console.log(obj.foo); // "bar"
console.log(obj.hasOwnProperty("foo")); // false

for (let key in obj) {
  console.log(key); // "foo" — prototype props appear in for..in!
}

// Always guard:
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    /* safe */
  }
}
```

---

### Q12. Implement `Object.create` from scratch.

```js
function myObjectCreate(proto) {
  if (
    proto !== null &&
    typeof proto !== "object" &&
    typeof proto !== "function"
  ) {
    throw new TypeError("proto must be object or null");
  }
  function F() {}
  F.prototype = proto;
  return new F();
}
```

---

### Q13. What happens when constructor returns an object?

```js
function Foo() {
  this.x = 1;
  return { y: 2 }; // returning object overrides `this`
}
const f = new Foo();
console.log(f.x); // undefined
console.log(f.y); // 2
// f is the returned object, not the `this` object

function Bar() {
  this.x = 1;
  return 42; // primitive return is ignored
}
const b = new Bar();
console.log(b.x); // 1 — primitive return ignored, `this` is used
```

---

### Q14. Shadowing — property on prototype vs own

```js
function Animal() {}
Animal.prototype.legs = 4;

const cat = new Animal();
cat.legs; // 4 (from prototype)
cat.hasOwnProperty("legs"); // false

cat.legs = 2; // creates OWN property, shadows prototype
cat.legs; // 2
cat.hasOwnProperty("legs"); // true
Animal.prototype.legs; // still 4 — prototype unchanged
```

---

### Q15. Explain the "constructor property" trap.

```js
function Foo() {}
console.log(Foo.prototype.constructor === Foo); // true ✅

// Replace prototype:
Foo.prototype = { greet() {} };
console.log(Foo.prototype.constructor === Foo); // false ❌ — now Object

const f = new Foo();
console.log(f.constructor === Foo); // false
console.log(f.constructor === Object); // true

// Always fix after replacing:
Foo.prototype = {
  constructor: Foo,
  greet() {},
};
```

---

## Quick Reference — Cheat Sheet

```
Object Literal           {}
  [[Prototype]] →        Object.prototype
                           [[Prototype]] → null

new Constructor()
  [[Prototype]] →        Constructor.prototype
                           [[Prototype]] → Object.prototype → null

Object.create(proto)
  [[Prototype]] →        proto

Object.create(null)
  [[Prototype]] →        null   (no chain at all)
```

| Method                              | Purpose                                   |
| ----------------------------------- | ----------------------------------------- |
| `Object.create(proto)`              | Create obj with given prototype           |
| `Object.getPrototypeOf(obj)`        | Get `[[Prototype]]`                       |
| `Object.setPrototypeOf(obj, proto)` | Change `[[Prototype]]` (avoid at runtime) |
| `obj.hasOwnProperty(key)`           | Check if key is own (not inherited)       |
| `Object.hasOwn(obj, key)`           | Modern, safer version (ES2022)            |
| `key in obj`                        | Checks own + inherited                    |
| `obj instanceof Ctor`               | Checks prototype chain                    |
| `Object.assign(target, src)`        | Shallow copy own enumerable props         |
