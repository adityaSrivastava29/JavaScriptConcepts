[← Back to Home](../index.md)

# Promises in JavaScript

## Introduction
Promises are a modern way to handle asynchronous operations in JavaScript. They were natively introduced in **ECMAScript 2015 (ES6)**. Before this, developers relied on third-party libraries like **Bluebird** and **Q**.

Promises represent a value that may be available now, later, or never. They help you write cleaner, more readable code compared to callbacks.

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

# Promise API 

The `Promise` class provides 6 static methods for handling multiple promises efficiently.

## 1. Promise.all(promises)

**Purpose**: Execute promises in parallel, wait for ALL to complete  
**Behavior**: Resolves when all promises resolve, rejects if ANY promise rejects  
**Result**: Array of results in same order as input promises

`NOTE` : Please note that the order of the resulting array members is the same as in its source promises. Even though the first promise takes the longest time to resolve, it’s still first in the array of results.

```javascript
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)),
  new Promise(resolve => setTimeout(() => resolve(2), 2000)),
  new Promise(resolve => setTimeout(() => resolve(3), 1000))
]).then(console.log); // [1, 2, 3] after 3 seconds

// Real-world example: Multiple API calls
let urls = ['api/user1', 'api/user2', 'api/user3'];
let requests = urls.map(url => fetch(url));
Promise.all(requests).then(responses => {
  // All requests completed successfully
});
```

**Key Points**:
- Fails fast: if one rejects, entire operation fails
- Non-promise values passed through as-is
- Maintains order regardless of completion time
- Other promises continue executing but results ignored on failure

## 2. Promise.allSettled(promises)

**Purpose**: Wait for ALL promises to complete, regardless of outcome  
**Behavior**: Never rejects, always waits for all promises to settle  
**Result**: Array of objects with `{status, value/reason}`

```javascript
Promise.allSettled([
  fetch('https://api.github.com/users/validuser'),
  fetch('https://invalid-url'),
  Promise.resolve('direct value')
]).then(results => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Success: ${result.value}`);
    } else {
      console.log(`Failed: ${result.reason}`);
    }
  });
});
```

**Result Format**:
- Success: `{status: "fulfilled", value: result}`
- Failure: `{status: "rejected", reason: error}`

**Polyfill** (for older browsers):
```javascript
if (!Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return Promise.all(promises.map(p => 
      Promise.resolve(p).then(
        value => ({status: 'fulfilled', value}),
        reason => ({status: 'rejected', reason})
      )
    ));
  };
}
```

## 3. Promise.race(promises)

**Purpose**: Get result of the FIRST promise to settle (resolve OR reject)  
**Behavior**: Resolves/rejects with first settled promise  
**Result**: Single value from the fastest promise

```javascript
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('slow'), 3000)),
  new Promise(resolve => setTimeout(() => resolve('fast'), 1000)),
  new Promise((_, reject) => setTimeout(() => reject('error'), 2000))
]).then(console.log); // 'fast' (after 1 second)
```

**Use Cases**:
- Implementing timeouts
- Getting fastest response from multiple sources
- Circuit breaker patterns

## 4. Promise.any(promises)

**Purpose**: Get result of the FIRST promise to FULFILL (ignores rejections)  
**Behavior**: Resolves with first successful promise, rejects only if ALL fail  
**Result**: Single value from first successful promise, or AggregateError

```javascript
Promise.any([
  new Promise((_, reject) => setTimeout(() => reject('Error 1'), 1000)),
  new Promise(resolve => setTimeout(() => resolve('Success!'), 2000)),
  new Promise(resolve => setTimeout(() => resolve('Also success'), 3000))
]).then(console.log); // 'Success!' (after 2 seconds)

// All fail scenario
Promise.any([
  Promise.reject('Error 1'),
  Promise.reject('Error 2')
]).catch(error => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors); // ['Error 1', 'Error 2']
});
```

## 5. Promise.resolve(value)

**Purpose**: Create an immediately resolved promise  
**Use Case**: Ensure consistent promise interface

```javascript
// These are equivalent
Promise.resolve(42);
new Promise(resolve => resolve(42));

// Practical example: Caching with consistent API
let cache = new Map();
function loadCached(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url)); // Always return promise
  }
  return fetch(url).then(response => {
    cache.set(url, response);
    return response;
  });
}
```

## 6. Promise.reject(error)

**Purpose**: Create an immediately rejected promise  
**Use Case**: Rarely used in practice (async/await preferred)

```javascript
// These are equivalent
Promise.reject(new Error('Failed'));
new Promise((_, reject) => reject(new Error('Failed')));
```

## Quick Comparison

| Method | Waits For | Resolves When | Rejects When |
|--------|-----------|---------------|--------------|
| `all` | All to settle | All resolve | Any rejects |
| `allSettled` | All to settle | Always (never rejects) | Never |
| `race` | First to settle | First resolves | First rejects |
| `any` | First to fulfill | First resolves | All reject |

## Best Practices

1. **Use `Promise.all`** for parallel operations where you need all results
2. **Use `Promise.allSettled`** when you want all results regardless of failures
3. **Use `Promise.race`** for timeout implementations or fastest-wins scenarios
4. **Use `Promise.any`** when you need the first successful result
5. **`Promise.all` is most commonly used** in real applications
6. **Consider error handling** - `Promise.all` fails fast, others have different behaviors

## Error Handling Patterns
Always use `.catch()` to handle errors in promise chains.
- If any error occurs in the chain, `.catch()` will handle it.
- You can also use `.finally()` to run code regardless of success or failure.
```javascript
// Pattern 1: Fail fast with Promise.all
Promise.all([api1(), api2(), api3()])
  .then(results => console.log('All succeeded:', results))
  .catch(error => console.log('At least one failed:', error));

// Pattern 2: Handle partial failures with Promise.allSettled
Promise.allSettled([api1(), api2(), api3()])
  .then(results => {
    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    console.log(`${successful.length} succeeded, ${failed.length} failed`);
  });
```

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
