// function statement
// Function statements are hoisted, meaning they can be called before they are defined in the code.
// function can be assigned to a variable, passed as an argument, or returned from another function.
// Function statements are also known as function declarations.
function a() {
    console.log("Function Statement or Declaration");
}

a(); // Calling the function statement


//function expression
// Function expressions are not hoisted, so they must be defined before they are called.  

var b = function() {
    console.log("Function Expression"); 
}
b(); // Calling the function expression

// difference between function statement and function expression is that function statements are hoisted, while function expressions are not.
// Function expressions can be anonymous or named, while function statements are always named.
// Function expressions can be assigned to variables, passed as arguments, or returned from other functions.
// Function statements are defined using the `function` keyword followed by a name, while function expressions can be anonymous or named.
// Function declaration is a named function that is defined using the `function` keyword.





//Anonymous function
// Anonymous functions are function expressions that do not have a name.
// They are often used as arguments to other functions or as immediately invoked function expressions (IIFE
// anonymous function are used as values, such as in callbacks or event handlers.

var c = function() {
    console.log("Anonymous Function");
}

setTimeout(c, 2000); // Calling the anonymous function after 1 second

//Named function Expression
var d = function namedFunction() {
    console.log("Named Function Expression");
}

d(); // Calling the named function expression
 // namedFunction(); // Calling the named function expression by its name will throw an error because it is not hoisted like a function declaration.
// referemce error: namedFunction is not defined

setTimeout(d, 3000); // Calling the named function expression after 3 seconds

//Differece between arguments and parameters ?
// Parameters are the variables listed as part of a function's definition.
// Arguments are the actual values that are passed to the function when it is called.
// Parameters are used to define the inputs that a function can accept, while arguments are the actual values passed to those parameters when the function is invoked.


// First class functions

// In JavaScript, functions are first-class citizens, meaning they can be treated like any other value.
// They can be assigned to variables, passed as arguments to other functions, returned from functions,  
// and stored in data structures like arrays and objects.
// This allows for powerful programming patterns like higher-order functions, callbacks, and function composition.
// Example of first-class functions

function firstClassFunctionExample() {
    console.log("This is a first-class function.");
}

firstClassFunctionExample(); // Calling the first-class function

//Arrow functions

// Arrow functions are a concise way to write function expressions in JavaScript.
// They use the `=>` syntax and do not have their own `this`, making them particularly useful for callbacks and methods that require the context of the surrounding scope.
const arrowFunctionExample = () => {
    console.log("This is an arrow function.");
};

arrowFunctionExample(); // Calling the arrow function

//callback functions
// Callback functions are functions that are passed as arguments to other functions and are executed after a certain event or condition is met.
// They are commonly used in asynchronous programming, event handling, and functional programming patterns.
// Example of a callback function   
function callbackExample(callback) {
    console.log("Executing callback function...");
    callback(); // Calling the passed callback function
}
callbackExample(() => {
    console.log("This is the callback function being executed.");
});

function xx(yy){
 console.log("This is a function that accepts a callback yy and called in xx.");
 yy(); // Calling the callback function passed to xx
}

xx(function yy(){
   console.log("This is a callback function yy passed to xx.");
});
 
 let counter = 0; 

// using a global variable to keep track of clicks but not recommended in production code
// Using a global variable to keep track of clicks is not recommended in production code,
// as it can lead to unexpected behavior and make the code harder to maintain.
// Instead, consider using closures or state management libraries for better control over state.
document.getElementById("clickMe")
.addEventListener("click", function xyz() {
    console.log("Button clicked! ", ++counter); // This is a callback function executed on button click.
});

function attachEventListener() {
    let localCounter = 0; // Using a local variable to keep track of clicks
    document.getElementById("clickMe2")
    .addEventListener("click", function closureExample() {
        console.log("Button clicked! ", ++localCounter); // This is a closure that captures the local variable.
    });
}
attachEventListener();





