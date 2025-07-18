
// Higher Order Functions in JavaScript

// 1. What is a Higher Order Function?
// A higher order function is a function that either takes one or more functions as arguments, or returns a function as its result.

// Example 1: Passing a function as an argument
function greet(name) {
    return `Hello, ${name}!`;
}

function processUserInput(callback) {
    const name = 'Aditya';
    return callback(name);
}

console.log(processUserInput(greet)); // Output: Hello, Aditya!

// Example 2: Returning a function
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplier(2);
console.log(double(5)); // Output: 10

// 2. Why use Higher Order Functions?
// - Abstraction: Hide details and expose only necessary parts.
// - Reusability: Write generic functions that work with other functions.
// - Functional Programming: Enables techniques like map, filter, reduce.

// 3. Built-in Higher Order Functions
const numbers = [1, 2, 3, 4, 5];

// map: transforms each element
const squares = numbers.map(x => x * x);
console.log(squares); // [1, 4, 9, 16, 25]

// filter: selects elements based on condition
const evens = numbers.filter(x => x % 2 === 0);
console.log(evens); // [2, 4]

// reduce: accumulates values
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// 4. Custom Higher Order Function Example
function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}

repeat(3, console.log); // Logs 0, 1, 2

// 5. Returning Functions (Closures)
function makeCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2

// 6. Practical Example: Function Composition
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

const add1 = x => x + 1;
const times2 = x => x * 2;
const add1ThenTimes2 = compose(times2, add1);
console.log(add1ThenTimes2(5)); // (5 + 1) * 2 = 12


const radius = [1, 2, 3, 4];
const calculateArea = function (radius) {
  const output = [];
  for (let i = 0; i < radius.length; i++) {
    output.push(Math.PI * radius[i] * radius[i]);
  }
  return output;
};
console.log(calculateArea(radius));

const calculateCircumference = function (radius) {
  const output = [];
  for (let i = 0; i < radius.length; i++) {
    output.push(2 * Math.PI * radius[i]);
  }
  return output;
};
console.log(calculateCircumference(radius));

const radiusArr = [1, 2, 3, 4];

// logic to calculate area
const area = function (radius) {
    return Math.PI * radius * radius;
}

// logic to calculate circumference
const circumference = function (radius) {
    return 2 * Math.PI * radius;
}

const calculate = function(radiusArr, operation) {
    const output = [];
    for (let i = 0; i < radiusArr.length; i++) {
        output.push(operation(radiusArr[i]));
    }
    return output;
}
console.log(calculate(radiusArr, area));
console.log(calculate(radiusArr, circumference));
// Over here calculate is HOF
// Over here we have extracted logic into separate functions. This is the beauty of functional programming.
// We can also use built-in higher order functions like map to achieve the same result
const areas = radiusArr.map(area);
console.log(areas);
const circumferences = radiusArr.map(circumference);
console.log(circumferences);    



