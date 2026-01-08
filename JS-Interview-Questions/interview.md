# JavaScript Interview Guide - Complete Reference

## 1. What is the difference between 'Pass by Value' and 'Pass by Reference'?

**Pass by Value:** A copy of the actual value is passed. Changes to the parameter inside the function don't affect the original variable.

**Pass by Reference:** A reference to the memory location is passed. Changes inside the function affect the original variable.

**In JavaScript:**
- Primitives (string, number, boolean, null, undefined, symbol) are passed by value
- Objects (including arrays and functions) are passed by reference

```javascript
// Pass by Value (Primitives)
let num = 10;
function changeValue(x) {
    x = 20;
}
changeValue(num);
console.log(num); // 10 (unchanged)

// Pass by Reference (Objects)
let obj = { name: "John" };
function changeName(object) {
    object.name = "Jane";
}
changeName(obj);
console.log(obj.name); // "Jane" (changed)
```

---

## 2. What is the difference between map and filter?

**map():** Transforms each element and returns a new array of the same length.

**filter():** Returns a new array containing only elements that pass a test condition.

```javascript
const numbers = [1, 2, 3, 4, 5];

// map - transforms each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - selects elements based on condition
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4]
```

---

## 3. What is the difference between map() and forEach()?

**map():** Returns a new array with transformed elements. Chainable.

**forEach():** Executes a function for each element but returns undefined. Not chainable.

```javascript
const nums = [1, 2, 3];

// map returns new array
const squared = nums.map(n => n * n);
console.log(squared); // [1, 4, 9]

// forEach returns undefined
const result = nums.forEach(n => n * n);
console.log(result); // undefined

// map is chainable
const chained = nums.map(n => n * 2).filter(n => n > 2);
console.log(chained); // [4, 6]
```

---

## 4. What is the difference between Pure and Impure functions?

**Pure Function:**
- Always returns the same output for the same input
- Has no side effects (doesn't modify external state)
- Doesn't depend on external state

**Impure Function:**
- May return different outputs for same input
- Has side effects or depends on external state

```javascript
// Pure Function
function add(a, b) {
    return a + b;
}
console.log(add(2, 3)); // Always 5

// Impure Function (modifies external state)
let total = 0;
function addToTotal(num) {
    total += num; // Side effect
    return total;
}

// Impure Function (depends on external state)
function getTotal() {
    return total; // Depends on external variable
}
```

---

## 5. What is the difference between for-in and for-of?

**for...in:** Iterates over enumerable property keys (strings) of an object.

**for...of:** Iterates over values of iterable objects (arrays, strings, Map, Set).

```javascript
const array = ['a', 'b', 'c'];
const object = { name: 'John', age: 30 };

// for...in - iterates over keys/indices
for (let key in array) {
    console.log(key); // "0", "1", "2" (indices as strings)
}

for (let key in object) {
    console.log(key); // "name", "age"
}

// for...of - iterates over values
for (let value of array) {
    console.log(value); // "a", "b", "c"
}

// for...of doesn't work with plain objects
// for (let value of object) {} // Error!
```

---

## 6. What are the differences between call(), apply() and bind()?

All three methods are used to set the `this` context in functions.

**call():** Invokes function immediately with specified `this` and arguments passed individually.

**apply():** Invokes function immediately with specified `this` and arguments passed as an array.

**bind():** Returns a new function with specified `this` that can be invoked later.

```javascript
const person = {
    name: 'John',
    greet: function(greeting, punctuation) {
        return `${greeting}, I'm ${this.name}${punctuation}`;
    }
};

const anotherPerson = { name: 'Jane' };

// call - arguments passed individually
console.log(person.greet.call(anotherPerson, 'Hello', '!'));
// "Hello, I'm Jane!"

// apply - arguments passed as array
console.log(person.greet.apply(anotherPerson, ['Hi', '.']));
// "Hi, I'm Jane."

// bind - returns new function
const greetJane = person.greet.bind(anotherPerson, 'Hey');
console.log(greetJane('?')); // "Hey, I'm Jane?"
```

---

## 7. List out some key features of ES6

**Major ES6 Features:**

1. **let and const** - Block-scoped variables
2. **Arrow functions** - Concise function syntax
3. **Template literals** - String interpolation with backticks
4. **Destructuring** - Extract values from arrays/objects
5. **Default parameters** - Function parameter defaults
6. **Rest and Spread operators** - `...` syntax
7. **Classes** - Syntactic sugar for prototypal inheritance
8. **Modules** - import/export syntax
9. **Promises** - Async handling
10. **Enhanced object literals** - Shorthand properties and methods

```javascript
// Arrow functions
const add = (a, b) => a + b;

// Template literals
const name = 'John';
console.log(`Hello, ${name}!`);

// Destructuring
const [first, second] = [1, 2];
const { name: userName, age } = { name: 'Jane', age: 25 };

// Spread operator
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];

// Classes
class Person {
    constructor(name) {
        this.name = name;
    }
}
```

---

## 8. What's the spread operator in JavaScript?

The spread operator `...` expands iterables into individual elements.

**Use cases:**
- Copy arrays/objects
- Merge arrays/objects
- Pass array elements as function arguments
- Convert iterables to arrays

```javascript
// Copy array
const original = [1, 2, 3];
const copy = [...original];

// Merge arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]

// Function arguments
const nums = [1, 5, 3];
console.log(Math.max(...nums)); // 5

// Copy object
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Merge objects
const merged = { ...obj1, ...obj2 };
```

---

## 9. What is rest operator in JavaScript?

The rest operator `...` collects multiple elements into an array. It's used in function parameters and destructuring.

```javascript
// Rest in function parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Rest in destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [3, 4, 5]

// Rest with objects
const { name, ...otherProps } = { name: 'John', age: 30, city: 'NYC' };
console.log(otherProps); // { age: 30, city: 'NYC' }
```

---

## 10. What are DRY, KISS, YAGNI, SOLID Principles?

**DRY (Don't Repeat Yourself):** Avoid code duplication. Extract common logic into reusable functions.

**KISS (Keep It Simple, Stupid):** Write simple, understandable code. Avoid unnecessary complexity.

**YAGNI (You Aren't Gonna Need It):** Don't add functionality until it's needed. Avoid over-engineering.

**SOLID Principles:**
- **S**ingle Responsibility: Each function/class should have one purpose
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes should be substitutable for base types
- **I**nterface Segregation: Many specific interfaces are better than one general
- **D**ependency Inversion: Depend on abstractions, not concretions

```javascript
// DRY - Bad
function calculateAreaSquare(side) {
    return side * side;
}
function calculateAreaRectangle(length, width) {
    return length * width;
}

// DRY - Good
function calculateArea(shape, ...dimensions) {
    if (shape === 'square') return dimensions[0] ** 2;
    if (shape === 'rectangle') return dimensions[0] * dimensions[1];
}

// KISS - Keep it simple
// Bad: Overcomplicated
const isEven = num => num % 2 === 0 ? true : false;
// Good: Simple
const isEvenSimple = num => num % 2 === 0;
```

---

## 11. What is temporal dead zone?

The Temporal Dead Zone (TDZ) is the period between entering a scope and the variable declaration being executed. During this time, accessing the variable throws a ReferenceError.

Applies to `let` and `const` (not `var`).

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// The TDZ is the area between scope start and declaration
{
    // TDZ starts here for 'y'
    console.log(y); // ReferenceError
    let y = 10; // TDZ ends here
}

// var doesn't have TDZ (gets hoisted with undefined)
console.log(z); // undefined (no error)
var z = 20;
```

---

## 12. Different ways to create object in JavaScript

```javascript
// 1. Object Literal
const obj1 = { name: 'John', age: 30 };

// 2. Object Constructor
const obj2 = new Object();
obj2.name = 'Jane';
obj2.age = 25;

// 3. Constructor Function
function Person(name, age) {
    this.name = name;
    this.age = age;
}
const obj3 = new Person('Bob', 35);

// 4. Object.create()
const proto = { greet() { return 'Hello'; } };
const obj4 = Object.create(proto);
obj4.name = 'Alice';

// 5. ES6 Class
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
const obj5 = new User('Charlie', 28);

// 6. Factory Function
function createPerson(name, age) {
    return { name, age };
}
const obj6 = createPerson('David', 32);
```

---

## 13. What's the difference between Object.keys, values and entries?

**Object.keys():** Returns an array of object's own property keys.

**Object.values():** Returns an array of object's own property values.

**Object.entries():** Returns an array of [key, value] pairs.

```javascript
const person = {
    name: 'John',
    age: 30,
    city: 'NYC'
};

// Object.keys()
console.log(Object.keys(person));
// ["name", "age", "city"]

// Object.values()
console.log(Object.values(person));
// ["John", 30, "NYC"]

// Object.entries()
console.log(Object.entries(person));
// [["name", "John"], ["age", 30], ["city", "NYC"]]

// Practical use with destructuring
Object.entries(person).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});
```

---

## 14. What's the difference between Object.freeze() vs Object.seal()?

**Object.freeze():**
- Prevents adding, deleting, and modifying properties
- Makes object immutable
- Properties become read-only

**Object.seal():**
- Prevents adding and deleting properties
- Allows modifying existing properties
- Properties remain writable

```javascript
// Object.freeze()
const frozen = { name: 'John', age: 30 };
Object.freeze(frozen);

frozen.name = 'Jane'; // Ignored (strict mode: TypeError)
frozen.city = 'NYC'; // Ignored (can't add)
delete frozen.age; // Ignored (can't delete)
console.log(frozen); // { name: 'John', age: 30 }

// Object.seal()
const sealed = { name: 'John', age: 30 };
Object.seal(sealed);

sealed.name = 'Jane'; // Works! (can modify)
sealed.city = 'NYC'; // Ignored (can't add)
delete sealed.age; // Ignored (can't delete)
console.log(sealed); // { name: 'Jane', age: 30 }
```

---

## 15. What is a polyfill in JavaScript?

A polyfill is code that implements a feature on browsers that don't support it natively. It provides modern functionality to older browsers.

```javascript
// Polyfill for Array.prototype.includes (ES7)
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or undefined');
        }
        
        const arr = Object(this);
        const len = arr.length >>> 0;
        
        if (len === 0) return false;
        
        const startIndex = fromIndex | 0;
        let k = Math.max(startIndex >= 0 ? startIndex : len - Math.abs(startIndex), 0);
        
        while (k < len) {
            if (arr[k] === searchElement) return true;
            k++;
        }
        
        return false;
    };
}

// Polyfill for Promise (simplified)
if (typeof Promise === 'undefined') {
    window.Promise = function(executor) {
        // Implementation...
    };
}
```

---

## 16. What is generator function in JavaScript?

Generator functions can pause execution and resume later. They return an iterator object and use `yield` to pause.

**Syntax:** `function*` with asterisk

```javascript
// Basic generator
function* countUp() {
    yield 1;
    yield 2;
    yield 3;
}

const counter = countUp();
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }

// Infinite generator
function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const gen = infiniteSequence();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1

// Practical example: ID generator
function* idGenerator() {
    let id = 1;
    while (true) {
        yield id++;
    }
}

const getId = idGenerator();
console.log(getId.next().value); // 1
console.log(getId.next().value); // 2
```

---

## 17. What is prototype in JavaScript?

Prototype is an object from which other objects inherit properties. Every JavaScript object has a prototype.

**Key concepts:**
- All objects have `__proto__` property pointing to their prototype
- Functions have `prototype` property used when creating instances
- Prototype chain enables inheritance

```javascript
// Constructor function
function Person(name) {
    this.name = name;
}

// Adding method to prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const john = new Person('John');
console.log(john.greet()); // "Hello, I'm John"

// Prototype chain
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true

// Inheritance
function Employee(name, role) {
    Person.call(this, name);
    this.role = role;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

const emp = new Employee('Jane', 'Developer');
console.log(emp.greet()); // "Hello, I'm Jane"
```

---

## 18. What is IIFE?

IIFE (Immediately Invoked Function Expression) is a function that runs as soon as it's defined.

**Benefits:**
- Creates private scope
- Avoids polluting global namespace
- Executes code immediately

```javascript
// Basic IIFE
(function() {
    console.log('I run immediately!');
})();

// IIFE with parameters
(function(name) {
    console.log(`Hello, ${name}!`);
})('John');

// IIFE with return value
const result = (function() {
    return 42;
})();
console.log(result); // 42

// Module pattern using IIFE
const calculator = (function() {
    // Private variable
    let result = 0;
    
    // Public API
    return {
        add: function(x) {
            result += x;
            return this;
        },
        subtract: function(x) {
            result -= x;
            return this;
        },
        getResult: function() {
            return result;
        }
    };
})();

calculator.add(5).subtract(2);
console.log(calculator.getResult()); // 3
```

---

## 19. What is CORS?

CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts resources on a web page to be requested from another domain.

**Same-Origin Policy:** Browser security feature that prevents JavaScript from making requests to a different domain than the one serving the page.

**CORS Headers:**
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

```javascript
// Browser blocks this by default (different origin)
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('CORS error:', error));

// Server must respond with CORS headers:
// Access-Control-Allow-Origin: *
// or
// Access-Control-Allow-Origin: https://yoursite.com

// Preflight request (OPTIONS) for complex requests
fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'John' })
});
```

---

## 20. What are the different datatypes in JavaScript?

**Primitive Types (7):**
1. **String:** Text data
2. **Number:** Numeric values (including NaN, Infinity)
3. **Boolean:** true/false
4. **Undefined:** Variable declared but not assigned
5. **Null:** Intentional absence of value
6. **Symbol:** Unique identifier (ES6)
7. **BigInt:** Large integers (ES2020)

**Non-Primitive (Reference) Types:**
1. **Object:** Collections of key-value pairs
2. **Array:** Ordered list of values
3. **Function:** Executable code block

```javascript
// Primitives
let str = "Hello"; // String
let num = 42; // Number
let bool = true; // Boolean
let undef; // Undefined
let nul = null; // Null
let sym = Symbol('id'); // Symbol
let bigInt = 9007199254740991n; // BigInt

// Objects
let obj = { name: 'John' };
let arr = [1, 2, 3];
let func = function() { return 'Hello'; };

// Type checking
console.log(typeof str); // "string"
console.log(typeof num); // "number"
console.log(typeof bool); // "boolean"
console.log(typeof undef); // "undefined"
console.log(typeof nul); // "object" (known bug)
console.log(typeof sym); // "symbol"
console.log(typeof bigInt); // "bigint"
console.log(typeof obj); // "object"
console.log(typeof arr); // "object"
console.log(typeof func); // "function"
```

---

## 21. What are the differences between TypeScript and JavaScript?

| Feature | JavaScript | TypeScript |
|---------|-----------|------------|
| **Type System** | Dynamic, loosely typed | Static, strongly typed |
| **Compilation** | Interpreted | Compiled to JavaScript |
| **Type Checking** | Runtime | Compile-time |
| **Interfaces** | Not supported | Supported |
| **IDE Support** | Basic | Advanced (autocomplete, refactoring) |
| **Learning Curve** | Easier | Steeper |
| **Error Detection** | Runtime | Compile-time |

```javascript
// JavaScript
function add(a, b) {
    return a + b;
}
console.log(add(5, "10")); // "510" (unexpected)

// TypeScript
function addTS(a: number, b: number): number {
    return a + b;
}
// addTS(5, "10"); // Compile error: Type 'string' not assignable

// TypeScript interfaces
interface User {
    name: string;
    age: number;
    email?: string; // Optional
}

const user: User = {
    name: "John",
    age: 30
};
```

---

## 22. What is authentication vs authorization?

**Authentication:** Verifying who you are (identity verification).
- Login with username/password
- Biometric verification
- OTP/2FA

**Authorization:** Verifying what you can access (permission verification).
- Role-based access control
- Permission levels
- Resource restrictions

```javascript
// Authentication example
async function authenticate(username, password) {
    const user = await findUser(username);
    const isValid = await comparePassword(password, user.hashedPassword);
    
    if (isValid) {
        // Create session/token
        return generateToken(user);
    }
    throw new Error('Invalid credentials');
}

// Authorization example
function authorize(user, resource, action) {
    const permissions = user.permissions;
    
    if (permissions.includes(`${resource}:${action}`)) {
        return true; // Authorized
    }
    
    throw new Error('Unauthorized access');
}

// Middleware example
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    
    // Authentication
    const user = verifyToken(token);
    if (!user) return res.status(401).send('Unauthenticated');
    
    // Authorization
    if (!user.role.includes('admin')) {
        return res.status(403).send('Unauthorized');
    }
    
    next();
}
```

---

## 23. Difference between null and undefined?

**undefined:** Variable declared but not assigned a value. Default state.

**null:** Intentional absence of value. Explicitly assigned.

```javascript
// undefined - variable declared but not initialized
let x;
console.log(x); // undefined
console.log(typeof x); // "undefined"

// null - intentionally empty
let y = null;
console.log(y); // null
console.log(typeof y); // "object" (known bug)

// Function with no return
function noReturn() {
    // No return statement
}
console.log(noReturn()); // undefined

// Object property doesn't exist
const obj = { name: 'John' };
console.log(obj.age); // undefined

// Explicit null assignment
let user = { name: 'Jane' };
user = null; // Clear reference

// Comparison
console.log(null == undefined); // true (loose equality)
console.log(null === undefined); // false (strict equality)
```

---

## 24. What is the output of 3+2+"7"?

```javascript
console.log(3 + 2 + "7"); // "57"

// Explanation:
// Step 1: 3 + 2 = 5 (number + number = number)
// Step 2: 5 + "7" = "57" (number + string = string concatenation)

// More examples:
console.log("3" + 2 + 7); // "327" (string + number = string, continues)
console.log(3 + "2" + 7); // "327"
console.log("3" + (2 + 7)); // "39" (parentheses force number addition first)
console.log(3 - 2 + "7"); // "17" (subtraction, then concatenation)
console.log("10" - 5); // 5 (string coerced to number for subtraction)
console.log("10" + 5); // "105" (concatenation with +)
```

---

## 25. Slice vs Splice in JavaScript?

**slice():** Returns a shallow copy of a portion. Doesn't modify original array.

**splice():** Changes contents by removing/replacing/adding elements. Modifies original array.

```javascript
const fruits = ['apple', 'banana', 'orange', 'mango', 'grape'];

// slice(start, end) - extracts without modifying
const sliced = fruits.slice(1, 3);
console.log(sliced); // ['banana', 'orange']
console.log(fruits); // Original unchanged

// slice with negative indices
console.log(fruits.slice(-2)); // ['mango', 'grape']

// splice(start, deleteCount, item1, item2, ...) - modifies original
const spliced = fruits.splice(1, 2, 'kiwi', 'lemon');
console.log(spliced); // ['banana', 'orange'] (removed items)
console.log(fruits); // ['apple', 'kiwi', 'lemon', 'mango', 'grape']

// splice to add without removing
fruits.splice(2, 0, 'pear');
console.log(fruits); // ['apple', 'kiwi', 'pear', 'lemon', 'mango', 'grape']

// splice to remove only
fruits.splice(1, 1);
console.log(fruits); // ['apple', 'pear', 'lemon', 'mango', 'grape']
```

---

## 26. What is destructuring?

Destructuring is a syntax for extracting values from arrays or properties from objects into distinct variables.

```javascript
// Array Destructuring
const colors = ['red', 'green', 'blue'];
const [first, second, third] = colors;
console.log(first); // 'red'

// Skip elements
const [primary, , tertiary] = colors;
console.log(tertiary); // 'blue'

// Rest operator
const [head, ...tail] = colors;
console.log(tail); // ['green', 'blue']

// Object Destructuring
const person = {
    name: 'John',
    age: 30,
    city: 'NYC'
};

const { name, age } = person;
console.log(name); // 'John'

// Rename variables
const { name: fullName, age: years } = person;
console.log(fullName); // 'John'

// Default values
const { country = 'USA' } = person;
console.log(country); // 'USA'

// Nested destructuring
const user = {
    id: 1,
    info: {
        name: 'Jane',
        address: {
            city: 'LA'
        }
    }
};

const { info: { name: userName, address: { city } } } = user;
console.log(userName, city); // 'Jane' 'LA'

// Function parameters
function greet({ name, age }) {
    console.log(`${name} is ${age} years old`);
}
greet(person); // 'John is 30 years old'
```

---

## 27. What is setTimeout in JavaScript?

`setTimeout()` executes a function after a specified delay (in milliseconds). Returns a timeout ID.

```javascript
// Basic usage
setTimeout(() => {
    console.log('Executed after 2 seconds');
}, 2000);

// With parameters
setTimeout((name, age) => {
    console.log(`${name} is ${age}`);
}, 1000, 'John', 30);

// Store timeout ID to cancel
const timeoutId = setTimeout(() => {
    console.log('This will not run');
}, 5000);

clearTimeout(timeoutId); // Cancel the timeout

// Common use case: Debouncing
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const searchInput = debounce((query) => {
    console.log('Searching for:', query);
}, 500);
```

---

## 28. What is setInterval in JavaScript?

`setInterval()` repeatedly executes a function at specified intervals (in milliseconds). Returns an interval ID.

```javascript
// Basic usage
const intervalId = setInterval(() => {
    console.log('Runs every 2 seconds');
}, 2000);

// Stop after some time
setTimeout(() => {
    clearInterval(intervalId);
    console.log('Interval stopped');
}, 10000);

// Counter example
let count = 0;
const counter = setInterval(() => {
    count++;
    console.log(count);
    
    if (count === 5) {
        clearInterval(counter);
        console.log('Counter stopped');
    }
}, 1000);

// Clock example
function updateClock() {
    const now = new Date();
    console.log(now.toLocaleTimeString());
}

const clockInterval = setInterval(updateClock, 1000);

// Cleanup
// clearInterval(clockInterval);
```

---

## 29. What are Promises in JavaScript?

Promises represent the eventual completion or failure of an asynchronous operation. They have three states: pending, fulfilled, rejected.

```javascript
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    
    setTimeout(() => {
        if (success) {
            resolve('Operation successful!');
        } else {
            reject('Operation failed!');
        }
    }, 1000);
});

// Consuming a Promise
myPromise
    .then(result => {
        console.log(result); // 'Operation successful!'
        return 'Next value';
    })
    .then(value => {
        console.log(value); // 'Next value'
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        console.log('Cleanup');
    });

// Practical example: API call
function fetchUser(id) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.example.com/users/${id}`)
            .then(response => {
                if (!response.ok) reject('User not found');
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

// Promise chaining
fetchUser(1)
    .then(user => fetchUser(user.managerId))
    .then(manager => console.log('Manager:', manager))
    .catch(error => console.error(error));
```

---

## 30. What is a callstack in JavaScript?

The call stack is a mechanism for the JavaScript interpreter to keep track of function calls. It follows LIFO (Last In, First Out) principle.

**How it works:**
- When a function is called, it's pushed onto the stack
- When a function returns, it's popped from the stack
- Stack overflow occurs when too many functions are on the stack

```javascript
function first() {
    console.log('First function start');
    second();
    console.log('First function end');
}

function second() {
    console.log('Second function start');
    third();
    console.log('Second function end');
}

function third() {
    console.log('Third function');
}

first();

// Call Stack visualization:
// 1. first() pushed
// 2. second() pushed
// 3. third() pushed
// 4. third() popped (completes)
// 5. second() popped (completes)
// 6. first() popped (completes)

// Stack overflow example
function recursive() {
    recursive(); // No base case
}
// recursive(); // Uncaught RangeError: Maximum call stack size exceeded
```

---

## 31. What is a closure?

A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.

**Key benefits:**
- Data privacy
- Function factories
- Maintaining state

```javascript
// Basic closure
function outer() {
    const outerVar = 'I am from outer';
    
    function inner() {
        console.log(outerVar); // Accesses outer variable
    }
    
    return inner;
}

const closureFunc = outer();
closureFunc(); // 'I am from outer'

// Counter with closure (data privacy)
function createCounter() {
    let count = 0; // Private variable
    
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
// console.log(counter.count); // undefined (private)

// Function factory
function multiplyBy(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

## 32. What are callbacks in JavaScript?

A callback is a function passed as an argument to another function, to be executed later.

```javascript
// Simple callback
function greet(name, callback) {
    console.log(`Hello, ${name}!`);
    callback();
}

greet('John', function() {
    console.log('Callback executed');
});

// Array methods with callbacks
const numbers = [1, 2, 3, 4, 5];

numbers.forEach(function(num) {
    console.log(num * 2);
});

// Asynchronous callbacks
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: 'John' };
        callback(data);
    }, 1000);
}

fetchData(function(result) {
    console.log('Data received:', result);
});

// Callback hell (pyramid of doom)
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                console.log(d);
            });
        });
    });
});

// Error-first callback pattern
function readFile(filename, callback) {
    // Node.js style callback
    if (error) {
        callback(error, null);
    } else {
        callback(null, data);
    }
}

readFile('file.txt', function(err, data) {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Data:', data);
});
```

---

## 33. What are Higher Order Functions in JavaScript?

Higher Order Functions are functions that either take functions as arguments or return functions.

```javascript
// Function that takes function as argument
function applyOperation(arr, operation) {
    return arr.map(operation);
}

const numbers = [1, 2, 3, 4];
const doubled = applyOperation(numbers, x => x * 2);
console.log(doubled); // [2, 4, 6, 8]

// Function that returns function
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// Built-in higher order functions
const arr = [1, 2, 3, 4, 5];

// map
const squared = arr.map(x => x * x);

// filter
const evens = arr.filter(x => x % 2 === 0);

// reduce
const sum = arr.reduce((acc, x) => acc + x, 0);

// Custom higher order function
function withLogging(func) {
    return function(...args) {
        console.log('Arguments:', args);
        const result = func(...args);
        console.log('Result:', result);
        return result;
    };
}

const add = (a, b) => a + b;
const addWithLogging = withLogging(add);
addWithLogging(2, 3);
// Arguments: [2, 3]
// Result: 5
```

---

## 34. What is the difference between == and === in JavaScript?

**== (Loose Equality):** Compares values after type coercion.

**=== (Strict Equality):** Compares both value and type without coercion.

```javascript
// Loose equality (==)
console.log(5 == "5"); // true (string coerced to number)
console.log(true == 1); // true
console.log(false == 0); // true
console.log(null == undefined); // true
console.log("" == 0); // true

// Strict equality (===)
console.log(5 === "5"); // false (different types)
console.log(true === 1); // false
console.log(false === 0); // false
console.log(null === undefined); // false
console.log("" === 0); // false

// Edge cases
console.log(NaN == NaN); // false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true

// Best practice: Use === by default
const value = getUserInput();
if (value === "admin") {
    // Safe comparison
}

// Use == only when you specifically want type coercion
if (value == null) {
    // Checks for both null and undefined
}
```

---

## 35. Is JavaScript a dynamically typed or statically typed language?

JavaScript is a **dynamically typed** language.

**Dynamic Typing:** Variable types are determined at runtime and can change.

**Static Typing:** Variable types are determined at compile time and cannot change (like TypeScript, Java, C++).

```javascript
// Dynamic typing - variables can change types
let variable = 42;
console.log(typeof variable); // "number"

variable = "Hello";
console.log(typeof variable); // "string"

variable = true;
console.log(typeof variable); // "boolean"

variable = { name: "John" };
console.log(typeof variable); // "object"

// Functions can accept any type
function add(a, b) {
    return a + b;
}

console.log(add(5, 3)); // 8
console.log(add("Hello", " World")); // "Hello World"
console.log(add(5, "3")); // "53"

// No compile-time type checking
const num = "not a number";
// const result = num * 2; // No error until runtime
```

---

## 36. What is the difference between IndexedDB and sessionStorage?

**IndexedDB:**
- NoSQL database for storing large amounts of structured data
- Asynchronous API
- Stores objects, blobs, files
- Much larger storage (GBs)
- Persistent until explicitly deleted
- Complex API

**sessionStorage:**
- Key-value storage
- Synchronous API
- Stores strings only
- ~5-10MB limit
- Data cleared when tab/window closes
- Simple API

```javascript
// sessionStorage
sessionStorage.setItem('user', JSON.stringify({ name: 'John' }));
const user = JSON.parse(sessionStorage.getItem('user'));
sessionStorage.removeItem('user');
sessionStorage.clear();

// IndexedDB
const request = indexedDB.open('MyDatabase', 1);

request.onerror = () => console.error('Database failed');
request.onsuccess = (event) => {
    const db = event.target.result;
    
    // Start transaction
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    
    // Add data
    const addRequest = objectStore.add({ id: 1, name: 'John' });
    
    addRequest.onsuccess = () => console.log('Data added');
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore('users', { keyPath: 'id' });
};
```

---

## 37. What are Interceptors?

Interceptors are functions that intercept HTTP requests or responses before they're handled by `then` or `catch`. Commonly used in Axios.

**Use cases:**
- Add authentication tokens
- Log requests/responses
- Handle errors globally
- Transform data
- Add loading indicators

```javascript
// Axios Request Interceptor
axios.interceptors.request.use(
    config => {
        // Add auth token to every request
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('Request:', config);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Axios Response Interceptor
axios.interceptors.response.use(
    response => {
        // Transform response data
        console.log('Response:', response);
        return response;
    },
    error => {
        // Handle errors globally
        if (error.response.status === 401) {
            // Redirect to login
            window.location.href = '/login';
        }
        
        if (error.response.status === 500) {
            console.error('Server error');
        }
        
        return Promise.reject(error);
    }
);

// Custom fetch interceptor
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch request:', args);
    return originalFetch(...args)
        .then(response => {
            console.log('Fetch response:', response);
            return response;
        });
};
```

---

## 38. What is Hoisting?

Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.

**What gets hoisted:**
- `var` declarations (initialized with `undefined`)
- `function` declarations (fully hoisted)
- `let` and `const` (hoisted but not initialized - TDZ)

```javascript
// var hoisting
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Equivalent to:
// var x;
// console.log(x);
// x = 5;

// Function hoisting
greet(); // Works! "Hello"

function greet() {
    console.log('Hello');
}

// let/const hoisting (TDZ)
// console.log(y); // ReferenceError
let y = 10;

// Function expressions are NOT fully hoisted
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
    console.log('Hi');
};

// Class declarations are NOT hoisted
// const obj = new MyClass(); // ReferenceError
class MyClass {
    constructor() {}
}

// Variable vs function priority
var myFunc = 'I am a variable';

function myFunc() {
    return 'I am a function';
}

console.log(typeof myFunc); // "string" (variable wins)
```

---

## 39. What are the differences between let, var and const?

| Feature | var | let | const |
|---------|-----|-----|-------|
| **Scope** | Function | Block | Block |
| **Hoisting** | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| **Re-declaration** | Allowed | Not allowed | Not allowed |
| **Re-assignment** | Allowed | Allowed | Not allowed |
| **Temporal Dead Zone** | No | Yes | Yes |

```javascript
// Scope
function testScope() {
    if (true) {
        var varVariable = 'var';
        let letVariable = 'let';
        const constVariable = 'const';
    }
    
    console.log(varVariable); // 'var' (function scoped)
    // console.log(letVariable); // ReferenceError (block scoped)
    // console.log(constVariable); // ReferenceError (block scoped)
}

// Re-declaration
var a = 1;
var a = 2; // OK

let b = 1;
// let b = 2; // SyntaxError

const c = 1;
// const c = 2; // SyntaxError

// Re-assignment
var x = 1;
x = 2; // OK

let y = 1;
y = 2; // OK

const z = 1;
// z = 2; // TypeError

// const with objects (reference is constant, not content)
const obj = { name: 'John' };
obj.name = 'Jane'; // OK (modifying property)
obj.age = 30; // OK (adding property)
// obj = {}; // TypeError (can't reassign)

// Loop behavior
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3

for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 100);
}
// Prints: 0, 1, 2
```

---

## 40. Differences between Promise.all, allSettled, any, race?

**Promise.all():** Waits for all promises to resolve. Rejects if any fails.

**Promise.allSettled():** Waits for all promises to settle (resolve or reject). Never rejects.

**Promise.any():** Returns first resolved promise. Rejects if all fail.

**Promise.race():** Returns first settled promise (resolved or rejected).

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.reject('Error');
const promise4 = new Promise(resolve => setTimeout(() => resolve(4), 100));

// Promise.all - all must succeed
Promise.all([promise1, promise2])
    .then(results => console.log(results)) // [1, 2]
    .catch(error => console.error(error));

Promise.all([promise1, promise3])
    .then(results => console.log(results))
    .catch(error => console.error(error)); // 'Error'

// Promise.allSettled - waits for all, never rejects
Promise.allSettled([promise1, promise2, promise3])
    .then(results => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'fulfilled', value: 2 },
//   { status: 'rejected', reason: 'Error' }
// ]

// Promise.any - first success wins
Promise.any([promise3, promise1, promise2])
    .then(result => console.log(result)) // 1 (first resolved)
    .catch(error => console.error(error));

Promise.any([promise3, Promise.reject('Another error')])
    .catch(error => console.error(error)); // AggregateError

// Promise.race - first to settle wins
Promise.race([promise1, promise4])
    .then(result => console.log(result)); // 1 (faster)

Promise.race([promise3, promise1])
    .catch(error => console.error(error)); // 'Error' (if faster)
```

---

## 41. What are limitations of arrow functions?

**Arrow function limitations:**
1. No `this` binding (lexical `this`)
2. Cannot be used as constructors
3. No `arguments` object
4. No `prototype` property
5. Cannot be used as generators
6. Not suitable for methods that need dynamic `this`

```javascript
// 1. Lexical 'this'
const obj = {
    name: 'John',
    regularFunc: function() {
        console.log(this.name); // 'John'
    },
    arrowFunc: () => {
        console.log(this.name); // undefined (lexical this from outer scope)
    }
};

// 2. Cannot be constructors
const RegularFunc = function() {
    this.value = 42;
};
const instance1 = new RegularFunc(); // OK

const ArrowFunc = () => {
    this.value = 42;
};
// const instance2 = new ArrowFunc(); // TypeError

// 3. No 'arguments' object
function regularFunction() {
    console.log(arguments); // Works
}

const arrowFunction = () => {
    // console.log(arguments); // ReferenceError
};

// Use rest parameters instead
const arrowWithRest = (...args) => {
    console.log(args); // Works
};

// 4. No prototype
console.log(RegularFunc.prototype); // {}
console.log(ArrowFunc.prototype); // undefined

// 5. Cannot be generators
function* regularGenerator() {
    yield 1;
}

// const arrowGenerator = *() => { // Syntax error
//     yield 1;
// };

// When to use regular functions
const button = document.querySelector('button');
button.addEventListener('click', function() {
    console.log(this); // button element
});

button.addEventListener('click', () => {
    console.log(this); // window (or undefined in strict mode)
});
```

---

## 42. What is difference between find vs findIndex?

**find():** Returns the first element that satisfies the condition, or `undefined`.

**findIndex():** Returns the index of the first element that satisfies the condition, or `-1`.

```javascript
const users = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 35 }
];

// find - returns the element
const user = users.find(u => u.age > 28);
console.log(user); // { id: 2, name: 'Jane', age: 30 }

const notFound = users.find(u => u.age > 100);
console.log(notFound); // undefined

// findIndex - returns the index
const index = users.findIndex(u => u.age > 28);
console.log(index); // 1

const notFoundIndex = users.findIndex(u => u.age > 100);
console.log(notFoundIndex); // -1

// Practical use cases
const numbers = [5, 12, 8, 130, 44];

// Use find when you need the value
const firstLarge = numbers.find(n => n > 10);
console.log(firstLarge); // 12

// Use findIndex when you need to modify or remove
const indexToRemove = numbers.findIndex(n => n > 100);
if (indexToRemove !== -1) {
    numbers.splice(indexToRemove, 1);
}
console.log(numbers); // [5, 12, 8, 44]
```

---

## 43. What is tree shaking in JavaScript?

Tree shaking is a dead-code elimination technique used by module bundlers (Webpack, Rollup) to remove unused code from the final bundle.

**Requirements:**
- ES6 module syntax (import/export)
- Static imports
- Side-effect-free code

```javascript
// utils.js - exporting multiple functions
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

// main.js - only importing what we need
import { add } from './utils.js';

console.log(add(5, 3));

// After tree shaking, subtract and multiply are removed from bundle

// BAD - prevents tree shaking (dynamic import)
const utils = require('./utils.js');
console.log(utils.add(5, 3));

// BAD - side effects prevent tree shaking
import './styles.css'; // Always included
import { someFunction } from './module-with-side-effects.js';

// Package.json configuration
{
    "sideEffects": false // Tell bundler no side effects
}

// or specify files with side effects
{
    "sideEffects": ["*.css", "*.scss"]
}
```

---

## 44. What is the main difference between Local Storage and Session Storage?

**localStorage:**
- Data persists until explicitly deleted
- Shared across all tabs/windows of same origin
- ~5-10MB storage limit
- Survives browser restart

**sessionStorage:**
- Data cleared when tab/window closes
- Separate for each tab/window
- ~5-10MB storage limit
- Does not survive browser restart

```javascript
// localStorage - persists
localStorage.setItem('user', 'John');
localStorage.setItem('theme', JSON.stringify({ mode: 'dark' }));

console.log(localStorage.getItem('user')); // 'John'
const theme = JSON.parse(localStorage.getItem('theme'));

localStorage.removeItem('user');
localStorage.clear(); // Remove all

// sessionStorage - temporary
sessionStorage.setItem('tempData', 'This is temporary');

console.log(sessionStorage.getItem('tempData'));

sessionStorage.removeItem('tempData');
sessionStorage.clear();

// Practical examples
// localStorage: user preferences, authentication tokens
localStorage.setItem('authToken', 'abc123');
localStorage.setItem('preferredLanguage', 'en');

// sessionStorage: form data, wizard state
sessionStorage.setItem('formStep', '2');
sessionStorage.setItem('cartItems', JSON.stringify(['item1', 'item2']));

// Event listener for storage changes (only localStorage)
window.addEventListener('storage', (e) => {
    console.log('Key:', e.key);
    console.log('Old value:', e.oldValue);
    console.log('New value:', e.newValue);
});
```

---

## 45. What is eval()?

`eval()` executes JavaScript code represented as a string. **AVOID USING IT** - major security risk.

**Why avoid eval():**
- Security vulnerabilities (XSS attacks)
- Performance issues (can't be optimized)
- Debugging difficulties
- Scope issues

```javascript
// Basic eval usage
eval('console.log("Hello")'); // Prints "Hello"

const x = 10;
const result = eval('x * 2'); // 20

// String to code
const code = '2 + 2';
console.log(eval(code)); // 4

// SECURITY RISK - never use with user input
const userInput = "alert('XSS attack!')";
// eval(userInput); // DANGEROUS!

// Alternatives to eval()

// 1. Function constructor (slightly safer, but still avoid)
const func = new Function('a', 'b', 'return a + b');
console.log(func(2, 3)); // 5

// 2. JSON.parse for JSON data
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString); // SAFE

// 3. Template literals for dynamic strings
const name = 'John';
const greeting = `Hello, ${name}!`; // SAFE

// 4. Object property access
const operation = 'add';
const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};
console.log(operations[operation](5, 3)); // 8 (SAFE)
```

---

## 46. What is the difference between Shallow copy and deep copy?

**Shallow Copy:** Copies only the first level. Nested objects/arrays are still referenced.

**Deep Copy:** Recursively copies all levels. Completely independent copy.

```javascript
// Original object with nested structure
const original = {
    name: 'John',
    age: 30,
    address: {
        city: 'NYC',
        country: 'USA'
    },
    hobbies: ['reading', 'gaming']
};

// SHALLOW COPY methods

// 1. Spread operator
const shallow1 = { ...original };
shallow1.name = 'Jane'; // OK
shallow1.address.city = 'LA'; // Modifies original!
console.log(original.address.city); // 'LA'

// 2. Object.assign()
const shallow2 = Object.assign({}, original);

// 3. Array.slice()
const arr = [1, 2, [3, 4]];
const shallowArr = arr.slice();
shallowArr[2][0] = 99;
console.log(arr[2][0]); // 99 (modified original)

// DEEP COPY methods

// 1. JSON.parse/stringify (limitations: loses functions, undefined, dates)
const deep1 = JSON.parse(JSON.stringify(original));
deep1.address.city = 'LA';
console.log(original.address.city); // 'NYC' (unchanged)

// 2. structuredClone (modern, recommended)
const deep2 = structuredClone(original);

// 3. Custom recursive function
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }
    
    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

const deep3 = deepClone(original);

// 4. Lodash library
// const deep4 = _.cloneDeep(original);
```

---

## 47. What are the difference between undeclared and undefined variables?

**Undefined:** Variable declared but not assigned a value.

**Undeclared:** Variable not declared at all.

```javascript
// Undefined - declared but not initialized
let declaredVar;
console.log(declaredVar); // undefined
console.log(typeof declaredVar); // "undefined"

// Undeclared - never declared
// console.log(undeclaredVar); // ReferenceError: undeclaredVar is not defined
console.log(typeof undeclaredVar); // "undefined" (typeof doesn't throw error)

// Checking safely
if (typeof someVariable !== 'undefined') {
    console.log('Variable exists');
}

// Undefined as a value
let x = undefined;
console.log(x === undefined); // true

// Function with no return
function noReturn() {
    // No return statement
}
console.log(noReturn()); // undefined

// Object property doesn't exist
const obj = { name: 'John' };
console.log(obj.age); // undefined

// Array index out of bounds
const arr = [1, 2, 3];
console.log(arr[10]); // undefined

// Implicit undefined
function test(a, b, c) {
    console.log(c); // undefined if not passed
}
test(1, 2);
```

---

## 48. What is event bubbling?

Event bubbling is when an event triggers on an element, then bubbles up to its ancestors in the DOM tree.

**Event Flow:**
1. Capture phase (top to bottom)
2. Target phase (at the element)
3. Bubble phase (bottom to top) ← Most commonly used

```javascript
// HTML structure
// <div id="grandparent">
//   <div id="parent">
//     <button id="child">Click me</button>
//   </div>
// </div>

const grandparent = document.getElementById('grandparent');
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// Event bubbling (default)
child.addEventListener('click', (e) => {
    console.log('Child clicked');
});

parent.addEventListener('click', (e) => {
    console.log('Parent clicked');
});

grandparent.addEventListener('click', (e) => {
    console.log('Grandparent clicked');
});

// Clicking button logs:
// "Child clicked"
// "Parent clicked"
// "Grandparent clicked"

// Stop bubbling
child.addEventListener('click', (e) => {
    e.stopPropagation(); // Stops bubbling
    console.log('Child clicked only');
});

// Event delegation (leveraging bubbling)
grandparent.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        console.log('Button clicked via delegation');
    }
});
```

---

## 49. What is event capturing?

Event capturing (trickling) is when an event travels from the root down to the target element. Opposite of bubbling.

**Phases:**
1. Capturing phase (window → target)
2. Target phase
3. Bubbling phase (target → window)

```javascript
// HTML structure
// <div id="outer">
//   <div id="inner">
//     <button id="btn">Click</button>
//   </div>
// </div>

const outer = document.getElementById('outer');
const inner = document.getElementById('inner');
const btn = document.getElementById('btn');

// Enable capturing with third parameter = true
outer.addEventListener('click', () => {
    console.log('Outer (capturing)');
}, true); // Capturing phase

inner.addEventListener('click', () => {
    console.log('Inner (capturing)');
}, true);

btn.addEventListener('click', () => {
    console.log('Button (target)');
});

inner.addEventListener('click', () => {
    console.log('Inner (bubbling)');
}, false); // Default bubbling

outer.addEventListener('click', () => {
    console.log('Outer (bubbling)');
}, false);

// Clicking button logs:
// "Outer (capturing)"
// "Inner (capturing)"
// "Button (target)"
// "Inner (bubbling)"
// "Outer (bubbling)"

// Practical use: Intercept events before they reach target
document.addEventListener('click', (e) => {
    if (e.target.matches('.disabled')) {
        e.stopPropagation();
        e.preventDefault();
        console.log('Disabled element clicked');
    }
}, true); // Capture phase
```

---

## 50. What are cookies?

Cookies are small pieces of data stored in the browser, sent with every HTTP request to the same domain.

**Properties:**
- Max size: ~4KB
- Can set expiration
- Can be HTTPOnly (not accessible via JavaScript)
- Can be Secure (HTTPS only)
- Used for sessions, tracking, preferences

```javascript
// Set cookie
document.cookie = "username=John";

// Set cookie with expiration
const expires = new Date();
expires.setDate(expires.getDate() + 7); // 7 days
document.cookie = `token=abc123; expires=${expires.toUTCString()}`;

// Set cookie with path and domain
document.cookie = "theme=dark; path=/; domain=example.com";

// Secure and HTTPOnly flags (server-side)
// Set-Cookie: token=abc123; Secure; HttpOnly; SameSite=Strict

// Read cookies
console.log(document.cookie); // "username=John; token=abc123; theme=dark"

// Parse cookies
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

console.log(getCookie('username')); // "John"

// Delete cookie (set expiration to past)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

// Cookie helper functions
const cookieUtils = {
    set: (name, value, days) => {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    },
    
    get: (name) => {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [key, val] = cookie.split('=');
            if (key === name) return val;
        }
        return null;
    },
    
    delete: (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
};
```

---

## 51. typeof operator

`typeof` operator returns a string indicating the type of a value.

```javascript
// Primitives
console.log(typeof "hello"); // "string"
console.log(typeof 42); // "number"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof Symbol('id')); // "symbol"
console.log(typeof 9007199254740991n); // "bigint"

// Objects
console.log(typeof {}); // "object"
console.log(typeof []); // "object" (arrays are objects)
console.log(typeof null); // "object" (known bug in JS)
console.log(typeof new Date()); // "object"

// Functions
console.log(typeof function() {}); // "function"
console.log(typeof class {}); // "function"

// Edge cases
console.log(typeof NaN); // "number" (Not a Number is a number!)
console.log(typeof Infinity); // "number"

// Checking for null (workaround for typeof bug)
const value = null;
if (value === null) {
    console.log('Value is null');
}

// Checking for arrays
const arr = [1, 2, 3];
console.log(Array.isArray(arr)); // true (correct way)
console.log(typeof arr); // "object" (not helpful)

// Checking for objects (excluding null and arrays)
function isPlainObject(value) {
    return typeof value === 'object' 
        && value !== null 
        && !Array.isArray(value);
}

// Undeclared variables
console.log(typeof undeclaredVariable); // "undefined" (no error)
```

---

## 52. What is 'this' in JavaScript and how it behaves in various scenarios?

`this` refers to the object that is executing the current function. Its value depends on how the function is called.

```javascript
// 1. Global context
console.log(this); // window (browser) or global (Node.js)

// 2. Object method
const person = {
    name: 'John',
    greet: function() {
        console.log(this.name); // 'John'
    }
};
person.greet();

// 3. Standalone function
function showThis() {
    console.log(this); // window (non-strict) or undefined (strict mode)
}
showThis();

// 4. Arrow function (lexical this)
const obj = {
    name: 'Jane',
    regularFunc: function() {
        const arrow = () => {
            console.log(this.name); // 'Jane' (inherits from regularFunc)
        };
        arrow();
    }
};
obj.regularFunc();

// 5. Constructor function
function Person(name) {
    this.name = name; // 'this' refers to new instance
}
const john = new Person('John');
console.log(john.name); // 'John'

// 6. Event handler
button.addEventListener('click', function() {
    console.log(this); // button element
});

button.addEventListener('click', () => {
    console.log(this); // window (arrow function)
});

// 7. call, apply, bind
const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

function sayName() {
    console.log(this.name);
}

sayName.call(user1); // 'Alice'
sayName.apply(user2); // 'Bob'

const boundFunc = sayName.bind(user1);
boundFunc(); // 'Alice'

// 8. Class methods
class MyClass {
    constructor(name) {
        this.name = name;
    }
    
    method() {
        console.log(this.name);
    }
    
    arrowMethod = () => {
        console.log(this.name); // Lexical this
    }
}

const instance = new MyClass('Test');
instance.method(); // 'Test'

// 9. Lost 'this' context
const obj2 = {
    name: 'Lost',
    greet: function() {
        console.log(this.name);
    }
};

const greetFunc = obj2.greet;
greetFunc(); // undefined (lost context)

// Fix: bind
const boundGreet = obj2.greet.bind(obj2);
boundGreet(); // 'Lost'
```

---

## 53. How do you optimize the performance of an application?

**Frontend Optimization Techniques:**

```javascript
// 1. Debouncing - delay execution until pause in events
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const searchInput = debounce((query) => {
    // API call
    fetch(`/api/search?q=${query}`);
}, 500);

// 2. Throttling - limit execution frequency
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('scroll', throttle(() => {
    console.log('Scroll event');
}, 200));

// 3. Memoization - cache function results
function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (key in cache) {
            return cache[key];
        }
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

const expensiveCalc = memoize((n) => {
    console.log('Calculating...');
    return n * n;
});

// 4. Lazy loading images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// 5. Code splitting (dynamic imports)
button.addEventListener('click', async () => {
    const module = await import('./heavy-module.js');
    module.doSomething();
});

// 6. Virtual scrolling for large lists
// Render only visible items

// 7. Use Web Workers for heavy computations
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => {
    console.log('Result:', e.data);
};

// 8. Request Animation Frame for animations
function animate() {
    // Animation logic
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 9. Avoid memory leaks
// - Remove event listeners
// - Clear timers
// - Abort fetch requests

const controller = new AbortController();
fetch('/api/data', { signal: controller.signal });
// Later: controller.abort();
```

**Other Optimization Techniques:**
- Minimize and compress assets
- Use CDN
- Enable caching
- Reduce bundle size (tree shaking)
- Optimize images (WebP, lazy loading)
- Use service workers
- Database query optimization
- Server-side rendering

---

## 54. What is meant by debouncing and throttling?

**Debouncing:** Delays function execution until after a specified time has passed since the last invocation.

**Throttling:** Ensures function executes at most once in a specified time period.

```javascript
// DEBOUNCING
// Use case: Search input, window resize, form validation

function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Example: Search as user types
const searchBox = document.getElementById('search');
const debouncedSearch = debounce((query) => {
    console.log('Searching for:', query);
    fetch(`/api/search?q=${query}`);
}, 500);

searchBox.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
// Only searches after user stops typing for 500ms

// THROTTLING
// Use case: Scroll events, mouse move, button clicks

function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Example: Scroll event
const throttledScroll = throttle(() => {
    console.log('Scroll position:', window.scrollY);
}, 1000);

window.addEventListener('scroll', throttledScroll);
// Executes at most once per second

// Advanced throttle with leading and trailing
function throttleAdvanced(func, limit, options = {}) {
    let timeout;
    let previous = 0;
    
    return function(...args) {
        const now = Date.now();
        
        if (!previous && options.leading === false) {
            previous = now;
        }
        
        const remaining = limit - (now - previous);
        
        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(() => {
                previous = options.leading === false ? 0 : Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

// Comparison
// Debouncing: User types "hello"
// - Waits until typing stops
// - Only 1 API call after 500ms of inactivity

// Throttling: User scrolls continuously
// - Executes immediately
// - Then once every 1000ms while scrolling
```

---

## 55. How does prototypal inheritance work?

Prototypal inheritance is when objects inherit properties and methods from other objects through the prototype chain.

```javascript
// Basic prototype chain
const animal = {
    eats: true,
    walk() {
        console.log('Animal walks');
    }
};

const dog = Object.create(animal);
dog.barks = true;

console.log(dog.eats); // true (inherited)
console.log(dog.barks); // true (own property)
dog.walk(); // 'Animal walks' (inherited method)

// Constructor function inheritance
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log(`${this.name} barks`);
};

const myDog = new Dog('Buddy', 'Labrador');
myDog.eat(); // 'Buddy is eating' (inherited)
myDog.bark(); // 'Buddy barks' (own method)

// ES6 Class syntax (syntactic sugar over prototypes)
class AnimalClass {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        console.log(`${this.name} is eating`);
    }
}

class DogClass extends AnimalClass {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    bark() {
        console.log(`${this.name} barks`);
    }
}

const myDog2 = new DogClass('Max', 'Poodle');

// Prototype chain
console.log(myDog2.__proto__ === DogClass.prototype); // true
console.log(DogClass.prototype.__proto__ === AnimalClass.prototype); // true
console.log(AnimalClass.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true (end of chain)

// Check inheritance
console.log(myDog2 instanceof DogClass); // true
console.log(myDog2 instanceof AnimalClass); // true
console.log(myDog2 instanceof Object); // true
```

---

## 56. What is the event loop in JavaScript?

The event loop is the mechanism that handles asynchronous operations in JavaScript's single-threaded environment.

**Components:**
1. **Call Stack:** Executes synchronous code
2. **Web APIs:** Handle async operations (setTimeout, fetch, DOM events)
3. **Callback Queue (Task Queue):** Holds callbacks from async operations
4. **Microtask Queue:** Holds Promise callbacks (higher priority)
5. **Event Loop:** Moves tasks from queues to call stack

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

Promise.resolve().then(() => {
    console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
// Explanation:
// 1. '1' - sync, executes immediately
// 4. '4' - sync, executes immediately
// 3. '3' - microtask (Promise), executes before macrotasks
// 2. '2' - macrotask (setTimeout), executes last

// Detailed example
console.log('Start');

setTimeout(() => {
    console.log('Timeout 1');
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise 1');
        return Promise.resolve();
    })
    .then(() => {
        console.log('Promise 2');
    });

setTimeout(() => {
    console.log('Timeout 2');
}, 0);

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2

// Event loop phases:
// 1. Execute all synchronous code
// 2. Process all microtasks (Promises)
// 3. Process one macrotask (setTimeout, setInterval)
// 4. Repeat

// Visualization
function eventLoopDemo() {
    console.log('Call stack: Start');
    
    setTimeout(() => {
        console.log('Macrotask Queue: setTimeout');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('Microtask Queue: Promise');
    });
    
    console.log('Call stack: End');
}

eventLoopDemo();
```

---

## 57. What is the purpose of the 'use strict' directive?

`'use strict'` enables strict mode, which enforces stricter parsing and error handling.

**Benefits:**
- Eliminates silent errors
- Prevents accidental globals
- Makes code more secure
- Enables optimizations

```javascript
'use strict';

// 1. Prevents accidental globals
function test() {
    // x = 10; // ReferenceError: x is not defined
    let x = 10; // Must declare with let/const/var
}

// 2. Prevents duplicate parameter names
// function sum(a, a, b) { // SyntaxError
//     return a + a + b;
// }

// 3. Prevents deleting variables
let obj = { x: 1 };
// delete obj; // SyntaxError

// 4. Makes 'this' undefined in functions
function showThis() {
    console.log(this); // undefined (not window)
}
showThis();

// 5. Prevents octal syntax
// const num = 0123; // SyntaxError

// 6. Prevents writing to read-only properties
const frozen = Object.freeze({ name: 'John' });
// frozen.name = 'Jane'; // TypeError

// 7. Prevents with statement
// with (obj) { // SyntaxError
//     console.log(x);
// }

// 8. 'eval' doesn't create variables in surrounding scope
eval('var x = 10');
// console.log(x); // ReferenceError

// Enable for entire file
'use strict';

// Or for individual functions
function strictFunction() {
    'use strict';
    // Strict mode only in this function
}

// ES6 modules and classes are automatically strict
class MyClass {
    // Already in strict mode
}
```

---

## 58. Explain the difference between synchronous and asynchronous code?

**Synchronous:** Code executes line by line. Each operation waits for the previous one to complete.

**Asynchronous:** Code can execute without waiting. Other code continues while async operations complete.

```javascript
// SYNCHRONOUS
console.log('1');
console.log('2');
console.log('3');
// Output: 1, 2, 3 (predictable order)

function syncOperation() {
    let sum = 0;
    for (let i = 0; i < 1000000000; i++) {
        sum += i;
    }
    return sum;
}

console.log('Start');
const result = syncOperation(); // Blocks execution
console.log('End'); // Waits for syncOperation to finish

// ASYNCHRONOUS
console.log('Start');

setTimeout(() => {
    console.log('Async operation');
}, 0);

console.log('End');
// Output: Start, End, Async operation

// Real-world async examples

// 1. Callbacks
function fetchDataCallback(callback) {
    setTimeout(() => {
        callback({ data: 'Some data' });
    }, 1000);
}

fetchDataCallback((result) => {
    console.log(result);
});

// 2. Promises
function fetchDataPromise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: 'Some data' });
        }, 1000);
    });
}

fetchDataPromise().then(result => console.log(result));

// 3. Async/Await (looks synchronous, but is async)
async function getData() {
    console.log('Fetching...');
    const result = await fetchDataPromise();
    console.log(result);
    console.log('Done');
}

// 4. Multiple async operations

// Parallel (faster)
async function parallelFetch() {
    const [data1, data2] = await Promise.all([
        fetch('/api/data1'),
        fetch('/api/data2')
    ]);
    // Both fetch simultaneously
}

// Sequential (slower)
async function sequentialFetch() {
    const data1 = await fetch('/api/data1'); // Waits
    const data2 = await fetch('/api/data2'); // Then waits
}
```

---

## 59. How does the async/await syntax work?

`async/await` is syntactic sugar over Promises, making asynchronous code look synchronous.

**Key points:**
- `async` function always returns a Promise
- `await` pauses execution until Promise resolves
- Only works inside `async` functions
- Makes error handling easier with try/catch

```javascript
// Basic async function
async function fetchUser() {
    return { name: 'John' }; // Automatically wrapped in Promise
}

fetchUser().then(user => console.log(user));

// Using await
async function getData() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
}

// Error handling
async function fetchWithErrorHandling() {
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error('Request failed');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw if needed
    } finally {
        console.log('Cleanup');
    }
}

// Multiple awaits
async function multipleRequests() {
    // Sequential (slow)
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    
    // Parallel (fast)
    const [user2, posts2] = await Promise.all([
        fetchUser(1),
        fetchPosts(1)
    ]);
    
    return { user2, posts2 };
}

// Await in loops
async function processItems(items) {
    // Sequential processing
    for (const item of items) {
        await processItem(item);
    }
    
    // Parallel processing
    await Promise.all(items.map(item => processItem(item)));
}

// Top-level await (ES2022, in modules)
// const data = await fetch('/api/data');

// Async IIFE (older approach)
(async () => {
    const data = await fetch('/api/data');
    console.log(data);
})();

// Converting Promise chain to async/await
// Promise chain
fetch('/api/user')
    .then(response => response.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(response => response.json())
    .then(posts => console.log(posts))
    .catch(error => console.error(error));

// Async/await (cleaner)
async function fetchUserPosts() {
    try {
        const userResponse = await fetch('/api/user');
        const user = await userResponse.json();
        
        const postsResponse = await fetch(`/api/posts/${user.id}`);
        const posts = await postsResponse.json();
        
        console.log(posts);
    } catch (error) {
        console.error(error);
    }
}
```

---

## 60. How do you handle errors in JavaScript?

Error handling ensures graceful failure and debugging.

```javascript
// 1. Try-Catch-Finally
try {
    // Code that might throw an error
    const result = riskyOperation();
    console.log(result);
} catch (error) {
    // Handle the error
    console.error('Error occurred:', error.message);
} finally {
    // Always executes (cleanup)
    console.log('Cleanup');
}

// 2. Throwing custom errors
function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

try {
    divide(10, 0);
} catch (error) {
    console.error(error.message);
}

// 3. Custom error classes
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function validateUser(user) {
    if (!user.email) {
        throw new ValidationError('Email is required');
    }
}

try {
    validateUser({});
} catch (error) {
    if (error instanceof ValidationError) {
        console.log('Validation failed:', error.message);
    }
}

// 4. Promise error handling
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error));

// 5. Async/await error handling
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// 6. Global error handlers
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', message);
    return true; // Prevents default handling
};

window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// 7. Error boundary pattern (React-like)
function errorBoundary(fn) {
    return function(...args) {
        try {
            return fn(...args);
        } catch (error) {
            console.error('Caught error:', error);
            // Fallback behavior
            return null;
        }
    };
}

const safeFn = errorBoundary(riskyFunction);

// 8. Retry logic
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

---

## 61. What is memoization and how can it be implemented?

Memoization is an optimization technique that caches function results to avoid redundant calculations.

```javascript
// Basic memoization
function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (key in cache) {
            console.log('From cache');
            return cache[key];
        }
        
        console.log('Calculating');
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

// Example: Expensive calculation
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(40)); // Slow first time
console.log(memoizedFib(40)); // Instant from cache

// Memoization with size limit (LRU cache)
function memoizeWithLimit(fn, limit = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn(...args);
        
        // Remove oldest if limit reached
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}

// React-style memoization (useMemo)
let memoizedValue;
let prevDeps;

function useMemo(fn, deps) {
    if (!prevDeps || deps.some((dep, i) => dep !== prevDeps[i])) {
        memoizedValue = fn();
        prevDeps = deps;
    }
    return memoizedValue;
}

// Memoize class methods
class Calculator {
    constructor() {
        this.cache = {};
    }
    
    expensiveOperation(n) {
        if (n in this.cache) {
            return this.cache[n];
        }
        
        // Expensive calculation
        const result = n * n * n;
        this.cache[n] = result;
        return result;
    }
}

// Practical example: API calls
const memoizedFetch = memoize(async (url) => {
    const response = await fetch(url);
    return await response.json();
});

// First call: hits API
await memoizedFetch('/api/users');

// Second call: returns cached result
await memoizedFetch('/api/users');
```

---

