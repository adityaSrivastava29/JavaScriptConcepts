
const arr = [1, 2, 3, 4, 5];

function double(x){
    return x * 2;
}

function triple(x){
    return x * 3;
}

const outputDouble = arr.map(double); 
console.log(outputDouble); // [2, 4, 6, 8, 10]
// alernate way to use map

const outputDoubleAlt = arr.map(function(x) { // Using a regular function 
    return x * 2;
});
// This is equivalent to the previous example
// It uses a regular function instead of an arrow function  

console.log(outputDoubleAlt); // [2, 4, 6, 8, 10]

const outputDoubleAltArrow = arr.map(x => x * 2);
console.log(outputDoubleAltArrow); // [2, 4, 6, 8, 10]

const outputTriple = arr.map(triple);
console.log(outputTriple); // [3, 6, 9, 12, 15]

function binary(x) {
    return x.toString(2);
}
const binaryArr = arr.map(binary);

// The above code can be rewritten as :
const binaryArr1 = arr.map(function binary(x) {
    return x.toString(2);
});

// OR -> Arrow function
const binaryArr2 = arr.map((x) => x.toString(2));

const users = [
    { firstName: "Aditya", lastName: "Kumar", age: 23 },
    { firstName: "Ashish", lastName: "Kumar", age: 29 },
    { firstName: "Ankit", lastName: "Roy", age: 29 },
    { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];
const fullNameArray = users.map(x => {
    return x.firstName + " " + x.lastName;
})
console.log(fullNameArray);

// Polifill for map
Array.prototype.myMap = function(callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this)); // Pass current element, index, and array to the callback
  }
  return result;
};
//  This is a custom implementation of the map function that mimics the behavior of Array.prototype.map
// It iterates over the array, applies the callback function to each element, and returns a new array with the results.
// The callback function can take three arguments: the current element, its index, and the array
// This allows for more flexibility in how the callback is used, similar to the built-in map
// This custom implementation can be used in the same way as the built-in map function, allowing
// developers to use it in their code without relying on the built-in method.
// This is useful for environments where the built-in map function is not available or for educational purposes
// Usage:
console.log(arr.myMap(x => x * 200)); // [2, 4, 6]



