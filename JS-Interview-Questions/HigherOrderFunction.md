# Higher Order Functions in JavaScript

## What is a Higher Order Function?
A higher order function is a function that either:
- Takes one or more functions as arguments
- Returns a function as its result
for eg.

```js
function x() {
    console.log("Hi");
};
function y(x) {
    x();
};
y(); // Hi
// y is a higher order function
// x is a callback function
```

## Why use Higher Order Functions?
- **Abstraction:** Hide details and expose only necessary parts
- **Reusability:** Write generic functions that work with other functions
- **Functional Programming:** Enables techniques like map, filter, reduce

## Examples

### 1. Passing a function as an argument
```js
function greet(name) {
    return `Hello, ${name}!`;
}
function processUserInput(callback) {
    const name = 'Aditya';
    return callback(name);
}
console.log(processUserInput(greet)); // Output: Hello, Aditya!
```

### 2. Returning a function
```js
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}
const double = multiplier(2);
console.log(double(5)); // Output: 10
```

### 3. Built-in Higher Order Functions
There are various built in HOFs, and some of the most common ones are map(), filter() and reduce().

- **map** is a method that we use to apply a function to each element in an array, and it returns a new array with the modified elements.

- The **filter()** function takes an array and returns a new array with only the values that meet certain criteria. It also does not mutate the original array. It is often used to select a subset of data from an array based on certain criteria.

- The **reduce()** method in JavaScript is an array method that executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element. The result is a single output value.

```js
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(x => x * x); // [1, 4, 9, 16, 25]
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15
```

### 4. Custom Higher Order Function Example
```js
// repeat is a higher order function because it takes another function (action) as an argument
function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i); // action is called for each value of i
    }
}
// Here, console.log is passed as the action, so it logs 0, 1, 2
repeat(3, console.log); // Logs 0, 1, 2
```

### 5. Returning Functions (Closures)
```js
// makeCounter returns a function, so it's a higher order function
// The returned function forms a closure over the count variable
function makeCounter() {
    let count = 0;
    return function() {
        count++; // count is remembered between calls
        return count;
    };
}
const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// Each call to counter() increases and returns the count
```

### 6. Function Composition
```js
// compose is a higher order function that takes two functions and returns a new function
function compose(f, g) {
    return function(x) {
        return f(g(x)); // applies g to x, then f to the result
    };
}
const add1 = x => x + 1;
const times2 = x => x * 2;
const add1ThenTimes2 = compose(times2, add1);
console.log(add1ThenTimes2(5)); // (5 + 1) * 2 = 12
// add1ThenTimes2 first adds 1 to 5, then multiplies the result by 2
```

## Interview Approach Example: Calculating Area and Circumference

### First Approach (Not DRY)
```js
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
```

### Better Approach Using Higher Order Function
```js
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

```

### Polyfill of map (Custom Implementation)
```js
// Over here calculate is nothing but polyfill of map function
// console.log(radiusArr.map(area)) == console.log(calculate(radiusArr, area));

Array.prototype.calculate = function(operation) {
    const output = [];
    for (let i = 0; i < this.length; i++) {
        output.push(operation(this[i]));
    }
    return output;
}
console.log(radiusArr.calculate(area));
```

## Summary
Higher order functions are a key concept in JavaScript, enabling powerful patterns for abstraction, reusability, and functional programming.
