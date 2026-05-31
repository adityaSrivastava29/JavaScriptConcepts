// ============================================================
// PROTOTYPES & INHERITANCE — Practice File
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: Prototype Chain Basics
// ─────────────────────────────────────────────────────────────

const animal = {
  type: "Animal",
  describe() {
    return `I am a ${this.type}`;
  },
};

const dog = Object.create(animal);
dog.type = "Dog";
dog.bark = function () {
  return "Woof!";
};

console.log("--- Section 1: Prototype Chain ---");
console.log(dog.describe()); // "I am a Dog" (inherited method, own `type`)
console.log(dog.bark()); // "Woof!"
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty("type")); // true  (own prop)
console.log(dog.hasOwnProperty("describe")); // false (on animal)

// ─────────────────────────────────────────────────────────────
// SECTION 2: __proto__ vs prototype
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 2: __proto__ vs prototype ---");

function Foo() {}

const f = new Foo();
console.log(f.__proto__ === Foo.prototype); // true  — instance's [[Prototype]]
console.log(Foo.__proto__ === Function.prototype); // true  — Foo's own prototype
console.log(Foo.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null  — end of chain

// ─────────────────────────────────────────────────────────────
// SECTION 3: Constructor Functions + prototype methods
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 3: Constructor Functions ---");

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hi, I'm ${this.name} and I'm ${this.age}.`;
};

Person.prototype.toString = function () {
  return `Person(${this.name}, ${this.age})`;
};

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

console.log(alice.greet()); // "Hi, I'm Alice and I'm 30."
console.log(alice.hasOwnProperty("greet")); // false — on prototype
console.log(alice.hasOwnProperty("name")); // true  — own property
console.log(alice instanceof Person); // true
console.log(alice.constructor === Person); // true

// ─────────────────────────────────────────────────────────────
// SECTION 4: Implement `new` from scratch (Famous Interview Q)
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 4: Custom `new` ---");

function myNew(Constructor, ...args) {
  // Step 1: Create object linked to Constructor.prototype
  const obj = Object.create(Constructor.prototype);
  // Step 2: Call constructor with `this` = new object
  const result = Constructor.apply(obj, args);
  // Step 3: If constructor returns an object, use it; else use obj
  return result !== null && typeof result === "object" ? result : obj;
}

function Car(make, model) {
  this.make = make;
  this.model = model;
}
Car.prototype.info = function () {
  return `${this.make} ${this.model}`;
};

const myCar = myNew(Car, "Toyota", "Camry");
console.log(myCar.info()); // "Toyota Camry"
console.log(myCar instanceof Car); // true

// ─────────────────────────────────────────────────────────────
// SECTION 5: Implement `Object.create` from scratch
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 5: Custom Object.create ---");

function myObjectCreate(proto) {
  if (
    proto !== null &&
    typeof proto !== "object" &&
    typeof proto !== "function"
  ) {
    throw new TypeError("proto must be an object or null");
  }
  function F() {}
  F.prototype = proto;
  return new F();
}

const base = {
  hello() {
    return "hello";
  },
};
const derived = myObjectCreate(base);
console.log(derived.hello()); // "hello"
console.log(Object.getPrototypeOf(derived) === base); // true

// ─────────────────────────────────────────────────────────────
// SECTION 6: Prototypal Inheritance (ES5 Style)
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 6: ES5 Prototypal Inheritance ---");

function Shape(color) {
  this.color = color;
}
Shape.prototype.getColor = function () {
  return this.color;
};
Shape.prototype.toString = function () {
  return `Shape(${this.color})`;
};

function Circle(color, radius) {
  Shape.call(this, color); // inherit own properties
  this.radius = radius;
}

// Set up prototype chain
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle; // ← fix constructor reference!

Circle.prototype.area = function () {
  return Math.PI * this.radius ** 2;
};
Circle.prototype.toString = function () {
  return `Circle(${this.color}, r=${this.radius})`;
};

const c = new Circle("red", 5);
console.log(c.getColor()); // "red"   — inherited from Shape
console.log(c.area().toFixed(2)); // "78.54"
console.log(c instanceof Circle); // true
console.log(c instanceof Shape); // true
console.log(c.constructor === Circle); // true (because we fixed it)

// ─────────────────────────────────────────────────────────────
// SECTION 7: ES6 Class Inheritance
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 7: ES6 Class Inheritance ---");

class Vehicle {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }
  describe() {
    return `${this.make} goes at ${this.speed}km/h`;
  }
  static compare(v1, v2) {
    return v1.speed - v2.speed;
  }
}

class ElectricCar extends Vehicle {
  constructor(make, speed, range) {
    super(make, speed);
    this.range = range;
  }
  describe() {
    return `${super.describe()}, range: ${this.range}km`;
  }
}

const tesla = new ElectricCar("Tesla", 250, 500);
console.log(tesla.describe()); // "Tesla goes at 250km/h, range: 500km"
console.log(tesla instanceof ElectricCar); // true
console.log(tesla instanceof Vehicle); // true
console.log(typeof Vehicle); // "function" — classes ARE functions

// ─────────────────────────────────────────────────────────────
// SECTION 8: Implement `instanceof` from scratch
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 8: Custom instanceof ---");

function myInstanceof(obj, Constructor) {
  if (typeof Constructor !== "function")
    throw new TypeError("Right-hand side must be a function");
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

console.log(myInstanceof(tesla, ElectricCar)); // true
console.log(myInstanceof(tesla, Vehicle)); // true
console.log(myInstanceof(tesla, Array)); // false

// ─────────────────────────────────────────────────────────────
// SECTION 9: Property Shadowing & Prototype Mutation Gotcha
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 9: Property Shadowing ---");

function Animal2(name) {
  this.name = name;
}
Animal2.prototype.legs = 4;

const cat = new Animal2("Whiskers");
console.log(cat.legs); // 4  — from prototype
console.log(cat.hasOwnProperty("legs")); // false

cat.legs = 2; // creates OWN property, shadows prototype
console.log(cat.legs); // 2  — own property wins
console.log(cat.hasOwnProperty("legs")); // true
console.log(Animal2.prototype.legs); // 4  — prototype unchanged

delete cat.legs;
console.log(cat.legs); // 4  — prototype revealed again after delete

// ─────────────────────────────────────────────────────────────
// SECTION 10: Shared Mutable State on Prototype (Common Bug)
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 10: Shared Mutable Prototype State ---");

// ❌ BAD — array on prototype is shared
function TeamBad() {}
TeamBad.prototype.members = [];

const t1 = new TeamBad();
const t2 = new TeamBad();
t1.members.push("Alice");
console.log(t2.members); // ["Alice"] — BUG! shared reference

// ✅ GOOD — array in constructor
function TeamGood() {
  this.members = [];
}

const t3 = new TeamGood();
const t4 = new TeamGood();
t3.members.push("Bob");
console.log(t4.members); // [] — independent

// ─────────────────────────────────────────────────────────────
// SECTION 11: Constructor Property Trap
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 11: Constructor Property Trap ---");

function Bar() {}

// Replace prototype — breaks constructor reference
Bar.prototype = {
  greet() {
    return "hello";
  },
};

const b1 = new Bar();
console.log(b1.constructor === Bar); // false ❌ — now Object!
console.log(b1.constructor === Object); // true

// Fix: manually set constructor back
Bar.prototype = {
  constructor: Bar,
  greet() {
    return "hello";
  },
};

const b2 = new Bar();
console.log(b2.constructor === Bar); // true ✅

// ─────────────────────────────────────────────────────────────
// SECTION 12: Object.create(null) — Pure Dictionary
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 12: Object.create(null) ---");

const dict = Object.create(null);
dict.name = "Alice";
dict.age = 30;

console.log(dict.name); // "Alice"
console.log(Object.getPrototypeOf(dict)); // null
console.log("toString" in dict); // false — no prototype chain!

// Safe to use as a map: no prototype pollution risk
const userInput = "constructor";
console.log(dict[userInput]); // undefined — safe!

// ─────────────────────────────────────────────────────────────
// SECTION 13: Mixin Pattern
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 13: Mixins ---");

const Serializable = {
  serialize() {
    return JSON.stringify(this);
  },
};
const Validatable = {
  validate() {
    return Object.keys(this).length > 0;
  },
};

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

Object.assign(Product.prototype, Serializable, Validatable);

const p = new Product(1, "Book", 9.99);
console.log(p.serialize()); // '{"id":1,"name":"Book","price":9.99}'
console.log(p.validate()); // true

// ─────────────────────────────────────────────────────────────
// SECTION 14: Constructor returns an object — tricky!
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 14: Constructor Return Value ---");

function ReturnsObject() {
  this.x = 1;
  return { y: 2 }; // object return overrides `this`
}
const ro = new ReturnsObject();
console.log(ro.x); // undefined — `this` was discarded
console.log(ro.y); // 2

function ReturnsPrimitive() {
  this.x = 1;
  return 42; // primitive return is IGNORED
}
const rp = new ReturnsPrimitive();
console.log(rp.x); // 1 — primitive ignored, `this` is returned

// ─────────────────────────────────────────────────────────────
// SECTION 15: Symbol.hasInstance — Custom instanceof
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 15: Symbol.hasInstance ---");

class EvenNumber {
  static [Symbol.hasInstance](num) {
    return typeof num === "number" && num % 2 === 0;
  }
}

console.log(2 instanceof EvenNumber); // true
console.log(3 instanceof EvenNumber); // false
console.log(10 instanceof EvenNumber); // true

// ─────────────────────────────────────────────────────────────
// SECTION 16: for..in and prototype enumeration
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 16: for..in Prototype Enumeration ---");

const parent = { inherited: true };
const child2 = Object.create(parent);
child2.own = "mine";

for (const key in child2) {
  console.log(key, "| own?", child2.hasOwnProperty(key));
  // "own"       | own? true
  // "inherited" | own? false
}

// Guard with hasOwnProperty or use Object.keys() (own only):
console.log(Object.keys(child2)); // ["own"] — own enumerable props only
console.log(Object.hasOwn(child2, "inherited")); // false (ES2022)

// ─────────────────────────────────────────────────────────────
// SECTION 17: Class is just a function — proof
// ─────────────────────────────────────────────────────────────

console.log("\n--- Section 17: Class === Function under the hood ---");

class MyClass {
  constructor(val) {
    this.val = val;
  }
  double() {
    return this.val * 2;
  }
}

console.log(typeof MyClass); // "function"
console.log(MyClass === MyClass.prototype.constructor); // true
const mc = new MyClass(5);
console.log(mc.double()); // 10
console.log(Object.getPrototypeOf(mc) === MyClass.prototype); // true
