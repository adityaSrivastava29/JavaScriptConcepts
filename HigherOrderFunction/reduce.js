
const arr = [1, 2, 7, 3, 4, 5];

// Traditional way to find the sum of an array
function findSum(arr){
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}
console.log(findSum(arr));

// Using reduce to find the sum of an array

const output  = arr.reduce(function(accumlator,current){
   accumlator = accumlator + current;
   return accumlator;
},0)

console.log(output);

// Traditional way to find max
function findMax(arr){
    let max  = 0;
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if(element > max)
        {
            max = element;
        }
        
    }
    return max;
}
console.log(findMax(arr));

// using reduce to find max of an array

const maxOutput = arr.reduce(function(acc,curr){

  if(curr > acc){
    acc = curr;
  }
  return acc;
},0)
console.log(maxOutput);


const users = [
    { firstName: "Aditya", lastName: "Kumar", age: 23 },
    { firstName: "Ashish", lastName: "Kumar", age: 29 },
    { firstName: "Ankit", lastName: "Roy", age: 29 },
    { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];


const findNumberofPeoplewithage = users.reduce(function(acc, curr){

    if(acc[curr.age]){
       acc[curr.age] += 1;
    }else{
        acc[curr.age] = 1;
    }
   return acc;
},{})

console.log(findNumberofPeoplewithage);
// name of people whose age < 30
const  lessThan30 = users.reduce(function(acc,curr){
     
    if(curr.age < 30)
      {
        acc.push(curr.firstName);
      }

    return acc;
},[])

console.log(lessThan30);

//pollyfill for reduce
// Add a custom reduce method to the Array prototype
Array.prototype.myReduce = function(callback, initialValue) {
  // If an initial value is provided, set accumulator to it
  // Otherwise, use the first element of the array
  let accumulator = initialValue !== undefined ? initialValue : this[0];

  // Determine the starting index:
  // If initial value is given, start at index 0
  // If not, start at index 1 (since index 0 is used as accumulator)
  let startIndex = initialValue !== undefined ? 0 : 1;

  // Loop through the array from the starting index to the end
  for (let i = startIndex; i < this.length; i++) {
    // Apply the callback function to accumulate the result
    accumulator = callback(accumulator, this[i], i, this);
  }

  // Return the final accumulated result
  return accumulator;
};

// Use myReduce to sum all the elements of the array
// Callback: adds current value to the accumulator
// Initial value is 0
const mySum = arr.myReduce((acc, curr) => acc + curr, 0);

// Use myReduce to find the maximum element in the array
// Callback: keeps the larger of accumulator or current value
// Initial value is 0
const myMax = arr.myReduce((acc, curr) => acc > curr ? acc : curr, 0);
console.log("Max " + myMax); // Output: 7
console.log("Sum " + mySum); // Output: 22
