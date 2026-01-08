[← Back to Home](../index.md)

# JavaScript Event Loop - Complete Interview Guide

## Table of Contents
1. [What is the Event Loop?](#what-is-the-event-loop)
2. [Call Stack](#call-stack)
3. [Web APIs](#web-apis)
4. [Callback Queue (Task Queue)](#callback-queue-task-queue)
5. [Microtask Queue](#microtask-queue)
6. [Event Loop Process](#event-loop-process)
7. [Code Examples with Outputs](#code-examples-with-outputs)
8. [Common Interview Questions](#common-interview-questions)
9. [Advanced Concepts](#advanced-concepts)
10. [Best Practices](#best-practices)

---

## What is the Event Loop?

The **Event Loop** is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously monitors the call stack and queues, moving tasks from queues to the call stack when it's empty.

The event loop is a process that continuously monitors both the call stack and the
event queue and checks whether or not the call stack is empty. If the call stack is
empty and there are pending events in the event queue, the event loop dequeues the
event from the event queue and pushes it to the call stack. The call stack executes
the event, and any additional events generated during the execution are added to
the end of the event queue.
Note: The event loop allows Node.js to perform non-blocking I/O operations, even
though JavaScript is single-threaded, by offloading operations to the system kernel
whenever possible. Since most modern kernels are multi-threaded, they can handle
multiple operations executing in the background

### Key Points:
- JavaScript is **single-threaded** but can handle **asynchronous operations**
- Event Loop enables **non-blocking behavior**
- It manages the execution order of synchronous and asynchronous code

---

## Call Stack

The **Call Stack** is a LIFO (Last In, First Out) data structure that keeps track of function calls.

Call Stack is a data structure for javascript interpreters to keep track of function
calls(creates execution context) in the program. It has two major actions,
1. Whenever you call a function for its execution, you are pushing it to the stack.
2. Whenever the execution is completed, the function is popped out of the stack.
Let’s take an example and it’s state representation in a diagram format
function hungry() {
eatFruits();
}
function eatFruits() {
return "I'm eating fruits";
}
// Invoke the `hungry` function
hungry();
The above code processed in a call stack as below,
3. Add the hungry() function to the call stack list and execute the code.
4. Add the eatFruits() function to the call stack list and execute the code.
5. Delete the eatFruits() function from our call stack list.
6. Delete the hungry() function from the call stack list since there are no items
anymore.

### How it works:
1. When a function is called, it's pushed onto the stack
2. When a function returns, it's popped off the stack
3. The stack must be empty for the event loop to process queued tasks

### Example:
```javascript
function first() {
    console.log("First function");
    second();
}

function second() {
    console.log("Second function");
}

first();
```

**Output:**
```
First function
Second function
```

**Call Stack Visualization:**
```
Step 1: [first()]
Step 2: [first(), second()]
Step 3: [first()]  // second() popped
Step 4: []         // first() popped
```

---

## Web APIs

**Web APIs** are browser-provided APIs that handle asynchronous operations like:
- `setTimeout()` / `setInterval()`
- DOM events
- HTTP requests (fetch, XMLHttpRequest)
- File I/O operations

### Example:
```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout callback");
}, 0);

console.log("End");
```

**Output:**
```
Start
End
Timeout callback
```

**Explanation:** Even with 0ms delay, the setTimeout callback goes to Web APIs, then to the callback queue, and only executes after the call stack is empty.

---

## Callback Queue (Task Queue)

The **Callback Queue** stores callbacks from Web APIs waiting to be executed. It follows FIFO (First In, First Out) principle.

### Example:
```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);
setTimeout(() => console.log("3"), 0);

console.log("4");
```

**Output:**
```
1
4
2
3
```

**Queue Order:** Callbacks are processed in the order they were added to the queue.

---

## Microtask Queue

The **Microtask Queue** has **higher priority** than the Callback Queue. It includes:
- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- `async/await` operations

### Priority Order:
1. **Call Stack** (highest priority)
2. **Microtask Queue**
3. **Callback Queue** (lowest priority)

### Example:
```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");
```

**Output:**
```
1
4
3
2
```

**Explanation:** Promise callback (microtask) executes before setTimeout callback (macrotask).

---

## Event Loop Process

The Event Loop follows this continuous process:

1. **Execute** all synchronous code in the call stack
2. **Check** if call stack is empty
3. **Process** all microtasks (Promise callbacks, etc.)
4. **Process** one macrotask from callback queue
5. **Repeat** the process

### Visual Representation:
```
┌─────────────────┐
│   Call Stack    │ ← Executes functions
└─────────────────┘
         ↑
┌─────────────────┐
│  Microtask      │ ← Higher priority
│    Queue        │   (Promises, async/await)
└─────────────────┘
         ↑
┌─────────────────┐
│   Callback      │ ← Lower priority
│    Queue        │   (setTimeout, setInterval)
└─────────────────┘
         ↑
┌─────────────────┐
│   Web APIs      │ ← Handles async operations
└─────────────────┘
```

---

## Code Examples with Outputs

### Example 1: Basic Event Loop
```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise 1");
});

console.log("End");
```

**Output:**
```
Start
End
Promise 1
Timeout 1
```

### Example 2: Multiple Promises and Timeouts
```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => {
    console.log("3");
    return Promise.resolve();
}).then(() => {
    console.log("4");
});

setTimeout(() => console.log("5"), 0);

console.log("6");
```

**Output:**
```
1
6
3
4
2
5
```

### Example 3: Nested Promises
```javascript
console.log("A");

Promise.resolve().then(() => {
    console.log("B");
    Promise.resolve().then(() => {
        console.log("C");
    });
});

console.log("D");
```

**Output:**
```
A
D
B
C
```

### Example 4: async/await with Event Loop
```javascript
console.log("1");

async function asyncFunction() {
    console.log("2");
    await Promise.resolve();
    console.log("3");
}

asyncFunction();

console.log("4");
```
* async functions start synchronously
* await splits execution into:
   * sync part
   * microtask continuation

* Even an already-resolved Promise yields

* Microtasks run after all synchronous code

* JavaScript never pauses the thread


**Output:**
```
1
2
4
3
```

### Example 5: Complex Event Loop
```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
    Promise.resolve().then(() => console.log("3"));
}, 0);

Promise.resolve().then(() => {
    console.log("4");
    setTimeout(() => console.log("5"), 0);
});

console.log("6");
```

**Output:**
```
1
6
4
2
3
5
```

### Example 6: Event Loop with setImmediate (Node.js)
```javascript
// Node.js environment
console.log("1");

setImmediate(() => console.log("2"));

setTimeout(() => console.log("3"), 0);

Promise.resolve().then(() => console.log("4"));

console.log("5");
```

**Output:**
```
1
5
4
3
2
```

---

## Common Interview Questions

### Q1: What's the difference between microtasks and macrotasks?

**Answer:**
- **Microtasks** (Promise callbacks, queueMicrotask) have higher priority
- **Macrotasks** (setTimeout, setInterval, I/O) have lower priority
- All microtasks are processed before the next macrotask

### Q2: Why does this code output in this order?
```javascript
setTimeout(() => console.log("1"), 0);
Promise.resolve().then(() => console.log("2"));
console.log("3");
```

**Answer:**
```
3
2
1
```
- "3" executes immediately (synchronous)
- "2" is a microtask (higher priority)
- "1" is a macrotask (lower priority)

### Q3: How does async/await work with the event loop?

**Answer:**
```javascript
async function example() {
    console.log("A");
    await Promise.resolve();
    console.log("B"); // This becomes a microtask
}

example();
console.log("C");
```

**Output:**
```
A
C
B
```

### Q4: What happens with nested setTimeout?

```javascript
setTimeout(() => {
    console.log("1");
    setTimeout(() => console.log("2"), 0);
}, 0);

setTimeout(() => console.log("3"), 0);
```

**Output:**
```
1
3
2
```

---

## Advanced Concepts

### 1. Starvation of Macrotasks
```javascript
function recursiveMicrotask() {
    Promise.resolve().then(() => {
        console.log("Microtask");
        recursiveMicrotask(); // This will starve macrotasks
    });
}

setTimeout(() => console.log("Macrotask"), 0);
recursiveMicrotask();
```

**Warning:** This creates an infinite loop of microtasks, preventing macrotasks from executing.

### 2. Event Loop Phases (Node.js)
1. **Timer Phase** - setTimeout, setInterval
2. **Pending Callbacks** - I/O callbacks
3. **Idle, Prepare** - Internal use
4. **Poll** - Fetch new I/O events
5. **Check** - setImmediate callbacks
6. **Close Callbacks** - Close events

### 3. requestAnimationFrame (Browser)
```javascript
console.log("1");

requestAnimationFrame(() => console.log("2"));

setTimeout(() => console.log("3"), 0);

Promise.resolve().then(() => console.log("4"));

console.log("5");
```

**Output:**
```
1
5
4
3
2
```

---

## Best Practices

### 1. Avoid Blocking the Event Loop
```javascript
// Bad - blocks event loop
function heavyTask() {
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
        result += i;
    }
    return result;
}

// Good - non-blocking
function heavyTaskAsync() {
    return new Promise((resolve) => {
        setTimeout(() => {
            let result = 0;
            for (let i = 0; i < 1000000000; i++) {
                result += i;
            }
            resolve(result);
        }, 0);
    });
}
```

### 2. Use Microtasks Wisely
```javascript
// Prefer this for immediate execution after current task
Promise.resolve().then(() => {
    console.log("This runs before next macrotask");
});

// Over this for non-time-critical tasks
setTimeout(() => {
    console.log("This runs in next macrotask");
}, 0);
```

### 3. Understanding Promise Chaining
```javascript
Promise.resolve()
    .then(() => {
        console.log("1");
        return Promise.resolve();
    })
    .then(() => {
        console.log("2");
    });

Promise.resolve()
    .then(() => {
        console.log("3");
    });
```

**Output:**
```
1
3
2
```

---

## Summary

The JavaScript Event Loop is crucial for understanding asynchronous JavaScript. Remember:

1. **Call Stack** executes synchronous code
2. **Microtask Queue** has higher priority (Promises, async/await)
3. **Callback Queue** has lower priority (setTimeout, setInterval)
4. **Event Loop** continuously moves tasks from queues to call stack
5. **All microtasks** are processed before the next macrotask

Understanding these concepts will help you write better asynchronous code and ace JavaScript interviews!

---

## Practice Problems

Try to predict the output of these code snippets:

### Problem 1:
```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
setTimeout(() => console.log("D"), 0);
Promise.resolve().then(() => console.log("E"));
console.log("F");
```

### Problem 2:
```javascript
async function async1() {
    console.log("1");
    await async2();
    console.log("2");
}

async function async2() {
    console.log("3");
}

console.log("4");
async1();
console.log("5");
```

**Solutions:**
- Problem 1: A, F, C, E, B, D
- Problem 2: 4, 1, 3, 5, 2