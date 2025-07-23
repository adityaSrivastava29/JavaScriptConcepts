# Promises in JavaScript

## Introduction
Promises are a modern way to handle asynchronous operations in JavaScript. They represent a value that may be available now, later, or never. Promises help you write cleaner, more readable code compared to callbacks.

---

## What is a Promise?
A Promise is a JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. Think of it as a "placeholder" for a value that will be available in the future.

A Promise can be in one of three states:
- **Pending:** Initial state, neither fulfilled nor rejected.
- **Fulfilled:** The operation completed successfully.
- **Rejected:** The operation failed.

---

## Real World Example: Promises in Action
```js
const githubUserInfoURL = "https://api.github.com/users/adityasrivastava29"; 

const user = fetch(githubUserInfoURL);
// Fetch returns a Promise
// user is a Promise object that will resolve to the response of the fetch operation
console.log(user); // This will log a Promise object
user.then((response) => {
    return response.json(); // Convert the response to JSON
}).then((data) => {
    console.log(data); // This will log the user data
}).catch((error) => {
    console.error("Error fetching user data:", error); // Handle any errors
}); // Catch any errors in the promise chain

```
## Why Do We Need Promises?
Before Promises, JavaScript handled asynchronous operations with callbacks, which led to several problems:
1. Callback Hell

```js 
// Without Promises - Callback Hell
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            getFinalData(c, function(d) {
                // Finally do something with d
                console.log(d);
            });
        });
    });
});
```

2. Error Handling Complexity
```js  
// Callback error handling is messy
getData(function(err, a) {
    if (err) {
        handleError(err);
        return;
    }
    getMoreData(a, function(err, b) {
        if (err) {
            handleError(err);
            return;
        }
        // More nested error checking...
    });
});
```
3. No Built-in Composition
Callbacks don't compose well - you can't easily combine multiple asynchronous operations.

## Promise Solutions
Promises solve these issues by providing:

- Flat chain structure instead of nested callbacks
- Unified error handling with .catch()
- Better composition with methods like Promise.all()

```js  
//With Promises - Clean and readable
getData()
    .then(a => getMoreData(a))
    .then(b => getEvenMoreData(b))
    .then(c => getFinalData(c))
    .then(d => console.log(d))
    .catch(err => handleError(err));
```
---

## Creating a Promise
The constructor syntax for a promise object is:

```js
let promise = new Promise(function(resolve, reject) {
  // executor (the producing code, "singer")
});
```
-  “producing code” that does something and takes time. For instance, some code that loads the data over a network. That’s a “singer”.
- “consuming code” that wants the result of the “producing code” once it’s ready. Many functions may need that result. These are the “fans”.

The function passed to `new Promise` is called the *executor*. When `new Promise` is created, the executor runs automatically. It contains the producing code which should eventually produce the result. the executor is the "singer".

Its arguments `resolve` and `reject` are callbacks provided by JavaScript itself. Our code is only inside the executor.

When the executor obtains the result, be it soon or late, doesn't matter, it should call one of these callbacks:

- `resolve(value)` — if the job is finished successfully, with result `value`.
- `reject(error)` — if an error has occurred, `error` is the error object.

So to summarize: the executor runs automatically and attempts to perform a job. When it is finished with the attempt, it calls `resolve` if it was successful or `reject` if there was an error.

The `promise` object returned by the `new Promise` constructor has these internal properties :  `state` and `result`, We can't directly access them. We can use the methods `.then`/`.catch`/`.finally` for that.

- `state` — initially `"pending"`, then changes to either `"fulfilled"` when `resolve` is called or `"rejected"` when `reject` is called.
- `result` — initially `undefined`, then changes to `value` when `resolve(value)` is called or `error` when `reject(error)` is called.

```js

const myPromise = new Promise((resolve, reject) => {
  // Simulate async work
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Operation successful!');
    } else {
      reject('Operation failed!');
    }
  }, 1000);
});
```

---

A promise that is either resolved or rejected is called "settled", as opposed to an initially "pending" promise.

<!-- ```` header="There can be only a single result or an error" -->

`There can be only a single result or an error`

The executor should call only one `resolve` or one `reject`. Any state change is final.

All further calls of `resolve` and `reject` are ignored:

```js
let promise = new Promise(function(resolve, reject) {
  resolve("done");


  reject(new Error("…")); // ignored
  setTimeout(() => resolve("…")); // ignored
});
```

The idea is that a job done by the executor may have only one result or an error.

Also, `resolve`/`reject` expect only one argument (or none) and will ignore additional arguments.

<!-- ```` -->

-----

## Consuming a Promise
You use `.then()` to handle success and `.catch()` for errors.
```js
myPromise
  .then(result => {
    console.log(result); // 'Operation successful!'
  })
  .catch(error => {
    console.error(error); // 'Operation failed!'
  });
```
**Explanation:**
- `.then()` is called when the promise is fulfilled (resolved). You get the result as an argument.
- `.catch()` is called if the promise is rejected (an error occurs). You get the error as an argument.
- You can chain multiple `.then()` calls for sequential operations.

---

## Chaining Promises
You can chain multiple `.then()` calls for sequential async operations.
```js
fetch(githubUserInfoURL)
  .then(response => response.json())
  .then(data => {
    return fetch(`https://api.github.com/users/${data.login}/repos`);
  })
  .then(response => response.json())
  .then(repos => {
    console.log(repos); // List of repositories
  })
  .catch(error => {
    console.error(error);
  });
```
**Explanation:**
- Each `.then()` returns a new promise, allowing you to chain further operations.
- If any promise in the chain is rejected, control jumps to the nearest `.catch()`.
- This pattern is useful for running async operations in sequence.

---

## Promise Methods
### 1. Promise.resolve()
Creates a promise that is resolved with a given value.
```js
Promise.resolve('Hello').then(console.log); // 'Hello'
```

### 2. Promise.reject()
Creates a promise that is rejected with a given reason.
```js
Promise.reject('Error!').catch(console.error); // 'Error!'
```

### 3. Promise.all()
Waits for all promises to resolve (or any to reject).
```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
Promise.all([p1, p2]).then(values => console.log(values)); // [1, 2]
```

### 4. Promise.race()
Resolves or rejects as soon as one of the promises does.
```js
const p1 = new Promise(res => setTimeout(() => res('First'), 100));
const p2 = new Promise(res => setTimeout(() => res('Second'), 200));
Promise.race([p1, p2]).then(console.log); // 'First'
```

### 5. Promise.allSettled()
Waits for all promises to settle (resolve or reject).
```js
const p1 = Promise.resolve('Success');
const p2 = Promise.reject('Fail');
Promise.allSettled([p1, p2]).then(results => console.log(results));
```

---

## Error Handling
Always use `.catch()` to handle errors in promise chains.
```js
fetch('invalid-url')
  .then(response => response.json())
  .catch(error => {
    console.error('Fetch failed:', error);
  });
```
**Explanation:**
- If any error occurs in the chain, `.catch()` will handle it.
- You can also use `.finally()` to run code regardless of success or failure.

---

## Async/Await (Promise Syntax Sugar)
Async/await makes working with promises easier and more readable.
```js
async function getUserInfo() {
  try {
    const response = await fetch(githubUserInfoURL);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
getUserInfo();
```
**Explanation:**
- `async` functions always return a promise.
- `await` pauses the function until the promise resolves or rejects.
- Use `try/catch` for error handling with async/await.

---

## Common Mistakes
- Forgetting to return a promise in `.then()`
- Not handling errors with `.catch()`
- Mixing callbacks and promises
- Returning non-promise values in a chain (breaks chaining)
- Not using `Promise.all` for parallel async operations

---

## Tricky Promises Interview Questions

### 1. What will be the output?
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```
**Answer:**
A
D
C
B

**Explanation:**
- 'A' and 'D' are logged synchronously.
- Promise `.then()` callbacks are microtasks and run before macrotasks (like `setTimeout`).
- So 'C' is logged before 'B'.

---

### 2. What does this code print?
```js
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { throw new Error('Oops!'); })
  .catch(err => {
    console.log(err.message);
    return 42;
  })
  .then(x => console.log(x));
```
**Answer:**
Oops!
42

**Explanation:**
- The error thrown in the chain is caught by `.catch()`.
- `.catch()` returns 42, which is passed to the next `.then()`.

---

### 3. What will be logged?
```js
const p = Promise.resolve('start');
p.then(() => {
  return p;
}).then(console.log);
```
**Answer:**
start
**Explanation:**
- Returning the same promise from a `.then()` does not cause infinite recursion. The resolved value is passed to the next `.then()`.

---

### 4. How to run multiple promises in parallel and get all results?
```js
const p1 = Promise.resolve('one');
const p2 = Promise.resolve('two');
Promise.all([p1, p2]).then(console.log);
```
**Answer:**
['one', 'two']
**Explanation:**
- `Promise.all` waits for all promises to resolve and returns an array of results.

---

### 5. How to handle both resolved and rejected promises together?
```js
Promise.allSettled([
  Promise.resolve('ok'),
  Promise.reject('fail')
]).then(console.log);
```
**Answer:**
[
  { status: 'fulfilled', value: 'ok' },
  { status: 'rejected', reason: 'fail' }
]
**Explanation:**
- `Promise.allSettled` returns the status and value/reason for each promise.

---

## Summary
- Promises are essential for handling async code in JavaScript.
- They make code cleaner and easier to manage than callbacks.
- Use `.then()`, `.catch()`, and async/await for readable, robust code.
- Learn promise methods for advanced async patterns.

---

## Further Reading
- [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript.info: Promises](https://javascript.info/promise)
