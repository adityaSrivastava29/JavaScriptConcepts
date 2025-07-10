
function x() {
    let a = 10;
    let b = 20;
    setTimeout(function() {
        console.log(a + b); // 30
    }, 3000);
    console.log('This will run first'); // This will run first
    // setTimeout is asynchronous, so it will not block the execution of the next line  
}
//x();

// setTimeout is a function that takes a callback and a delay in milliseconds
// The callback will be executed after the specified delay
// In this case, the callback is an anonymous function that logs the sum of a and b
// The delay is 3000 milliseconds (3 seconds)


function y(){
    for(var i  = 1; i <= 5; i++){
      setTimeout(() => {
        console.log(i); 
      }, timeout = i * 1000);
    }
}
//y();

// This will log 5 five times because the loop completes before the timeouts execute
// The value of i is 6 when the timeouts execute, so it logs 6   
// why?
// The reason is that var is function-scoped, not block-scoped
// When the loop finishes, the value of i is 6, and all the timeouts will log 6
// To fix this, we can use let instead of var, which is block-scoped
// or we can use an IIFE (Immediately Invoked Function Expression) to capture the value of i at each iteration
// Example using IIFE
function z() {
    for (var i = 1; i <= 5; i++) {
         function close(i){
            setTimeout(() =>{
                console.log(i);
            }, i * 1000);
         }
         close(i); // Pass i to the IIFE
         // This will create a new scope for each iteration of the loop 
            // and capture the current value of i
            // The IIFE will be executed immediately, and the value of i will be passed to it
            // The setTimeout function will then use this captured value of i
            // This way, each timeout has its own copy of i, and they log the expected values
            // this will log 1, 2, 3, 4, 5 as expected
    }
}
z();
// The IIFE captures the current value of i at each iteration and passes it to the set
// timeout function as iCopy        
// This way, each timeout has its own copy of i, and they log the expected values
// Note: Using let instead of var would also fix the issue without needing an IIFE
// Example using let
function a() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            console.log(i);
        }, i * 1000);
    }
}       
//a();                    
// This will also log 0, 1, 2, 3, 4 as expected
// The let keyword creates a block scope, so each iteration of the loop has its own i variable
// This is a common issue when using var in loops with asynchronous functions
// The problem with the original code is that the variable i is declared with var, which is function-scoped
// and not block-scoped. This means that by the time the setTimeout callback executes, the loop has already completed,
// and the value of i is 5 for all callbacks.
// This is a common pitfall in JavaScript when using var in loops with asynchronous functions.
// The original code logs 5 five times because the loop completes before the timeouts execute.
// The value of i is 5 when the timeouts execute, so it logs 5.
// This is a common pitfall in JavaScript when using var in loops with asynchronous functions.
// The original code logs 5 five times because the loop completes before the timeouts execute.
// The value of i is 5 when the timeouts execute, so it logs 5.
// This is a common pitfall in JavaScript when using var in loops with asynchronous functions.  
// The original code logs 5 five times because the loop completes before the timeouts execute.
// The value of i is 5 when the timeouts execute, so it logs 5          
// This is a common pitfall in JavaScript when using var in loops with asynchronous functions.


