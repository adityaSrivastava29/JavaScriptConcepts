 
// 1. Basic Closure Example
function outerFunction() {
    let outerVariable = 'Mai outer se hu!';
    function innerFunction() {
        console.log(outerVariable); // innerFunction has access to outerVariable
    }
    return innerFunction;
}

const closure1 = outerFunction();
closure1(); // Output: Mai outer se hu!

// 2. Closure with Private Variables (Data Encapsulation)
function makeCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

const counter = makeCounter();
const counter2 = makeCounter(); // Separate counter instance
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter2()); // 1
console.log(counter()); // 3

// 3. Closures in Loops (Common Pitfall & Solution)
// Problem: All functions log the same value
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs.push(function() {
        console.log('Problem:', i);
    });
}
funcs[0](); // Problem: 3
funcs[1](); // Problem: 3
funcs[2](); // Problem: 3

// Solution: Use IIFE or let
var funcsFixed = [];
for (var j = 0; j < 3; j++) {
    (function(jCopy) {
        funcsFixed.push(function() {
            console.log('Fixed:', jCopy);
        });
    })(j);
}
funcsFixed[0](); // Fixed: 0
funcsFixed[1](); // Fixed: 1
funcsFixed[2](); // Fixed: 2

// Or use let (ES6)
let funcsLet = [];
for (let k = 0; k < 3; k++) {
    funcsLet.push(function() {
        console.log('Let:', k);
    });
}
funcsLet[0](); // Let: 0
funcsLet[1](); // Let: 1
funcsLet[2](); // Let: 2

// 4. Closures for Function Factories
function makeMultiplier(multiplier) {
    return function(x) {
        return x * multiplier;
    };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// 5. Closures in Asynchronous Code
for (var m = 0; m < 3; m++) {
    setTimeout(function() {
        console.log('Async Problem:', m);
    }, 100);
}
// All log 3

for (let n = 0; n < 3; n++) {
    setTimeout(function() {
        console.log('Async Fixed:', n);
    }, 200);
}
// Logs 0, 1, 2

// 6. Practical Example: Hiding Implementation Details
function Person(name) {
    let _name = name;
    return {
        getName: function() { return _name; },
        setName: function(newName) { _name = newName; }
    };
}

const p = Person('Aditya');
console.log(p.getName()); // Aditya
p.setName('Bablu');
console.log(p.getName()); // Bablu

// 7. Interview Questions: What is a closure?
// A closure is a function that remembers its lexical scope even when the function is executed outside that scope.
// It allows functions to access variables from an enclosing scope, even after that scope has closed.

// 8. Interview Questions: Why are closures useful?
// - Data privacy (private variables)
// - Function factories
// - Partial application/currying
// - Event handlers and callbacks
// - Maintaining state in async code

// 9. Advanced: Currying with Closures
function add(a) {
    return function(b) {
        return a + b;
    };
}
const add5 = add(5);
console.log(add5(10)); // 15

// 10. Memory Leaks and Closures
// Be careful: Closures can cause memory leaks if they retain references to large objects unnecessarily.

// Example: Memory Leak with Closures
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
