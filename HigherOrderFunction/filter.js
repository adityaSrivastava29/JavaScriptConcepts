// Filter function
// Filter function is basically used to filter the value inside an array. The arr.filter() method is used to create a new array from a given array consisting of only those elements from the given array which satisfy a condition set by the argument method.

const arr = [5, 1, 3, 2, 6];
// filter odd values
function isOdd(x) {
  return x % 2;
}
const oddArr = arr.filter(isOdd); // [5,1,3]
console.log(oddArr); // Output: [5, 1, 3]
// Other way of writing the above:
const oddArrAlt = arr.filter((x) => x % 2);
console.log(oddArrAlt); // Output: [5, 1, 3]

//pollyfill for filter
Array.prototype.myFilter = function(callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) { // Pass current element, index, and array to the callback
      result.push(this[i]);
    }
  }
  return result;
}
function isEven(x){
    return x % 2 === 0 ;
}
const myEvenArr = arr.myFilter(isEven);
console.log(myEvenArr); // Output:  [ 2, 6 ]

