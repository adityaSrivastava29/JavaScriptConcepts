---
layout: note
---

# JavaScript Polyfills — Complete Notes
> A polyfill is a piece of code that provides modern JavaScript functionality in older environments that don't support it.

> A **polyfill** is code that implements a feature on browsers/engines that do not natively support it. You are re-creating the _exact_ behavior of a built-in, manually.
>
> **Interview mental model:** "I am adding a method to the prototype (or creating a standalone function) that works identically to the native one — same inputs, same outputs, same edge cases."

---

## Table of Contents

1. [Array.prototype.forEach](#1-arrayprototypeforeach)
2. [Array.prototype.map](#2-arrayprototypemap)
3. [Array.prototype.filter](#3-arrayprototypefilter)
4. [Array.prototype.reduce](#4-arrayprototypereduce)
5. [Function.prototype.bind](#5-functionprototypebind)
6. [debounce](#6-debounce)
7. [throttle](#7-throttle)
8. [Promise.all](#8-promiseall)
9. [Promise.allSettled](#9-promiseallsettled)
10. [Promise.race](#10-promiserace)
11. [Promise.any](#11-promiseany)

---

## 1. `Array.prototype.forEach`

### Original Behaviour

```js
array.forEach(callbackFn(currentValue, index, array), thisArg?)
```

- Calls `callbackFn` once for every element **in order**.
- **Always returns `undefined`** — it is purely for side effects.
- Does NOT mutate the original array (unless the callback does).
- Skips empty slots (sparse arrays).

```js
// Native
[1, 2, 3].forEach((val, i) => console.log(i, val));
// 0 1 | 1 2 | 2 3
```

### Mental Model

> "Walk every index. Call the function. Throw away the return value."

### Polyfill

```js
Array.prototype.myForEach = function (callbackFn, thisArg) {
  // 'this' is the array the method is called on
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // skip empty (sparse) slots
      callbackFn.call(thisArg, this[i], i, this);
    }
  }
  // implicitly returns undefined
};

// Test
[10, 20, 30].myForEach((val, i) => console.log(i, val));
```

### Interview Points

- Return value is always `undefined` — don't use it to build arrays, use `map` instead.
- `thisArg` lets you control what `this` is inside the callback.
- Cannot be stopped mid-way (unlike `for...of` with `break`). If you need to stop, use `some()` or `every()`.
- Skips sparse array holes; `for` loop does not.

---

## 2. `Array.prototype.map`

### Original Behaviour

```js
array.map(callbackFn(currentValue, index, array), thisArg?)
```

- Returns a **new array** of the same length.
- Each element in the new array is the **return value** of `callbackFn`.
- Does NOT mutate the original array.

```js
// Native
[1, 2, 3].map((x) => x * 2); // [2, 4, 6]
```

### Mental Model

> "Transform every element. Collect the results into a new array of the same length."

### Polyfill

```js
Array.prototype.myMap = function (callbackFn, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callbackFn.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

// Test
console.log([1, 2, 3].myMap((x) => x * 2)); // [2, 4, 6]
```

### Interview Points

- Always returns a **new array** — original is untouched.
- Length of returned array equals length of original array.
- If `callbackFn` returns nothing (undefined), that slot gets `undefined`.
- `map` vs `forEach`: use `map` when you need the transformed array, `forEach` for side effects only.

---

## 3. `Array.prototype.filter`

### Original Behaviour

```js
array.filter(callbackFn(currentValue, index, array), thisArg?)
```

- Returns a **new array** containing only elements for which `callbackFn` returns **truthy**.
- Result array can be shorter (or even empty) than the original.

```js
// Native
[1, 2, 3, 4, 5].filter((x) => x % 2 === 0); // [2, 4]
```

### Mental Model

> "Keep only the elements that pass the test. Build a new, potentially smaller array."

### Polyfill

```js
Array.prototype.myFilter = function (callbackFn, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callbackFn.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// Test
console.log([1, 2, 3, 4, 5].myFilter((x) => x % 2 === 0)); // [2, 4]
```

### Interview Points

- Returns a **new array** (never mutates).
- Result length ≤ original length.
- The callback is a **predicate** (must return true/false).
- Chaining: `arr.filter(...).map(...)` is a common pattern.

---

## 4. `Array.prototype.reduce`

### Original Behaviour

```js
array.reduce(callbackFn(accumulator, currentValue, index, array), initialValue?)
```

- Reduces array to a **single value** by repeatedly applying `callbackFn`.
- `accumulator` is the running result; starts as `initialValue` (or first element if not provided).
- If no `initialValue` and array is empty → `TypeError`.

```js
// Native
[1, 2, 3, 4].reduce((acc, val) => acc + val, 0); // 10
```

### Mental Model

> "Carry a running total. For each element, update it. Return the final total."

### Polyfill

```js
Array.prototype.myReduce = function (callbackFn, initialValue) {
  let accumulator;
  let startIndex;

  if (arguments.length < 2) {
    // No initialValue provided
    if (this.length === 0)
      throw new TypeError("Reduce of empty array with no initial value");
    accumulator = this[0];
    startIndex = 1;
  } else {
    accumulator = initialValue;
    startIndex = 0;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callbackFn(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

// Test
console.log([1, 2, 3, 4].myReduce((acc, val) => acc + val, 0)); // 10
console.log([1, 2, 3, 4].myReduce((acc, val) => acc + val)); // 10 (no initialValue)
```

### Interview Points

- Always provide `initialValue` to avoid bugs with empty arrays.
- Can implement `map` and `filter` using `reduce`.
- Accumulator can be anything: number, array, object, string.
- Classic use cases: sum, flatten, groupBy, count occurrences.

```js
// map via reduce
const doubled = [1, 2, 3].reduce((acc, val) => [...acc, val * 2], []); // [2,4,6]

// filter via reduce
const evens = [1, 2, 3, 4].reduce(
  (acc, val) => (val % 2 === 0 ? [...acc, val] : acc),
  []
); // [2,4]
```

---

## 5. `Function.prototype.bind`

### Original Behaviour

```js
fn.bind(thisArg, ...partialArgs);
```

- Returns a **new function** with `this` permanently set to `thisArg`.
- Supports **partial application** — pre-filling arguments.
- The bound function, when called with `new`, ignores the bound `this`.

```js
// Native
const obj = { name: "Alice" };
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const boundGreet = greet.bind(obj, "Hello");
console.log(boundGreet()); // "Hello, Alice"
```

### Mental Model

> "Freeze the `this` and optionally freeze some arguments. Give back a ready-to-call copy."

### Polyfill

```js
Function.prototype.myBind = function (thisArg, ...outerArgs) {
  const fn = this; // the original function

  // The returned bound function
  function boundFn(...innerArgs) {
    // Handle 'new' usage: when called with new, 'this' is the new instance
    if (this instanceof boundFn) {
      return new fn(...outerArgs, ...innerArgs);
    }
    return fn.apply(thisArg, [...outerArgs, ...innerArgs]);
  }

  // Preserve prototype chain so instanceof checks work
  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
  }

  return boundFn;
};

// Test
const obj = { name: "Alice" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const bound = greet.myBind(obj, "Hello");
console.log(bound("!")); // "Hello, Alice!"
```

### Interview Points

- `bind` ≠ `call`/`apply`: `call`/`apply` invoke immediately; `bind` returns a function.
- Partial application: pass some args now, rest later.
- `new` overrides bound `this` — important edge case.
- `bind` is used heavily in React class components (`this.handleClick = this.handleClick.bind(this)`).

---

## 6. `debounce`

### Original Behaviour

Debounce delays a function call until after a specified wait period has elapsed since the **last** invocation. If called again within the wait window, the timer resets.

```
Calls:   --A---B---C-----------D--
Output:  -------------------C----D  (only fires after inactivity)
```

### Mental Model

> "Wait until the user stops doing the thing, then act. Every new event resets the countdown."

### Use Cases

- Search bar autocomplete (fire API only when user stops typing)
- Window resize handlers
- Form validation on keystroke

### Polyfill

```js
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer); // Reset the clock every call
    timer = setTimeout(() => {
      fn.apply(this, args); // Fire after silence
    }, delay);
  };
}

// Test
const search = debounce((query) => console.log("Searching:", query), 500);
search("j");
search("ja");
search("jav");
search("java"); // only this fires (after 500ms of silence)
```

### Interview Points

- `clearTimeout` on every call is the key — it resets the wait window.
- `this` and `args` must be forwarded correctly (use regular function + `apply`, not arrow function for `this`).
- Leading vs trailing debounce: fire at the start of silence vs the end.
- `debounce` collapses many calls into **one**.

---

## 7. `throttle`

### Original Behaviour

Throttle ensures a function fires **at most once per interval**, no matter how many times it is called during that interval.

```
Calls:   --A-B-C-D-E-F--------G--
Output:  --A-----C-----E------G--  (fires at regular intervals)
```

### Mental Model

> "Allow one call every N milliseconds. Ignore the rest in between. Resume after the interval."

### Use Cases

- Scroll event handlers (update progress bar at most every 100ms)
- Button spam prevention
- Mouse move tracking

### Polyfill

```js
function throttle(fn, interval) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Test
const onScroll = throttle(
  () => console.log("Scroll handled at", Date.now()),
  200
);
// Even if onScroll is called 100 times in 1s, it fires at most 5 times.
```

### Interview Points

- `Date.now() - lastTime >= interval` is the gate check.
- Throttle preserves a **steady rate** of calls; debounce collapses to **one final call**.
- Key difference from debounce:
  - `debounce` → waits for silence
  - `throttle` → fires regularly during continuous activity
- Can also be implemented with `setTimeout` (timer-based throttle).

### Debounce vs Throttle — Side by Side

|                     | Debounce             | Throttle                              |
| ------------------- | -------------------- | ------------------------------------- |
| **When it fires**   | After activity stops | At regular intervals during activity  |
| **Use case**        | Search input, resize | Scroll, mouse move, button spam       |
| **Mental model**    | "Wait for quiet"     | "One per N ms"                        |
| **Calls collapsed** | All but the last     | All except the first of each interval |

---

## 8. `Promise.all`

### Original Behaviour

```js
Promise.all(iterable) → Promise
```

- Accepts an array of promises.
- Resolves when **all** promises resolve → returns array of results **in original order**.
- **Rejects immediately** if any promise rejects (fast-fail).
- Non-promise values are wrapped in `Promise.resolve()`.

```js
Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then(
  console.log
); // [1, 2, 3]

Promise.all([
  Promise.resolve(1),
  Promise.reject("Error"),
  Promise.resolve(3),
]).catch(console.error); // 'Error'
```

### Mental Model

> "All must win. One loss ends the game immediately."

### Polyfill

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, i) => {
      Promise.resolve(promise) // handle non-promise values
        .then((value) => {
          results[i] = value; // preserve order by using index
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject); // first rejection short-circuits
    });
  });
}

// Test
promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then(
  console.log
); // [1, 2, 3]
```

### Interview Points

- Use `results[i] = value` (not `push`) to **preserve order** even when promises resolve out of order.
- Empty array → resolves immediately with `[]`.
- One reject → whole thing rejects (all-or-nothing).
- Use `Promise.resolve(promise)` to safely handle plain values.

---

## 9. `Promise.allSettled`

### Original Behaviour

```js
Promise.allSettled(iterable) → Promise
```

- Waits for **all** promises to settle (either fulfill or reject).
- **Never rejects** — always resolves.
- Returns an array of descriptor objects:
  - Fulfilled: `{ status: 'fulfilled', value: ... }`
  - Rejected: `{ status: 'rejected', reason: ... }`

```js
Promise.allSettled([Promise.resolve("ok"), Promise.reject("fail")]).then(
  console.log
);
// [
//   { status: 'fulfilled', value: 'ok' },
//   { status: 'rejected', reason: 'fail' }
// ]
```

### Mental Model

> "Wait for every promise to finish, win or lose. Report the full scorecard."

### Polyfill

```js
function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let settled = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then((value) => {
          results[i] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[i] = { status: "rejected", reason };
        })
        .finally(() => {
          settled++;
          if (settled === promises.length) resolve(results);
        });
    });
  });
}

// Test
promiseAllSettled([Promise.resolve("ok"), Promise.reject("fail")]).then(
  console.log
);
```

### Interview Points

- `allSettled` never rejects — perfect when you want results of **all** attempts regardless of failures.
- Use `finally` (or a counter in both `.then` and `.catch`) to track when all have settled.
- Difference from `Promise.all`:
  - `all` → fast-fail on first rejection
  - `allSettled` → patient, waits for everyone

---

## 10. `Promise.race`

### Original Behaviour

```js
Promise.race(iterable) → Promise
```

- Resolves or rejects with the outcome of the **first promise to settle** (whichever finishes first).
- Other promises still run, but their outcomes are ignored.

```js
Promise.race([
  new Promise((res) => setTimeout(() => res("slow"), 1000)),
  new Promise((res) => setTimeout(() => res("fast"), 100)),
]).then(console.log); // 'fast'
```

### Mental Model

> "First one across the finish line wins — and takes everything."

### Polyfill

```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve).catch(reject);
    }
    // After first settlement, subsequent resolve/reject calls are ignored
    // because a Promise can only settle once
  });
}

// Test
promiseRace([
  new Promise((res) => setTimeout(() => res("slow"), 1000)),
  new Promise((res) => setTimeout(() => res("fast"), 100)),
]).then(console.log); // 'fast'
```

### Interview Points

- A Promise can only be resolved/rejected **once** — subsequent calls are no-ops. That's why the polyfill is so simple.
- Useful for **timeout patterns**:
  ```js
  const withTimeout = (promise, ms) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), ms)
      ),
    ]);
  ```
- If iterable is empty → the returned promise stays **pending forever**.

---

## 11. `Promise.any`

### Original Behaviour

```js
Promise.any(iterable) → Promise
```

- Resolves with the value of the **first promise that fulfills**.
- **Ignores rejections** unless ALL promises reject.
- If all reject → rejects with an `AggregateError` containing all rejection reasons.

```js
Promise.any([
  Promise.reject("err1"),
  Promise.resolve("success"),
  Promise.reject("err2"),
]).then(console.log); // 'success'

Promise.any([Promise.reject("e1"), Promise.reject("e2")]).catch((err) =>
  console.log(err.errors)
); // ['e1', 'e2']
```

### Mental Model

> "First WIN takes it. Only give up when everyone has lost."

### Polyfill

```js
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;

    if (promises.length === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then(resolve) // first fulfillment wins
        .catch((reason) => {
          errors[i] = reason; // collect rejection reasons in order
          rejectedCount++;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}

// Test
promiseAny([
  Promise.reject("e1"),
  Promise.resolve("ok"),
  Promise.reject("e2"),
]).then(console.log); // 'ok'

promiseAny([Promise.reject("e1"), Promise.reject("e2")]).catch((err) =>
  console.log(err.errors)
); // ['e1', 'e2']
```

### Interview Points

- Opposite of `Promise.all` in a sense: `all` fails fast, `any` succeeds fast.
- Only rejects when **every** promise has rejected → `AggregateError`.
- Store errors by **index** (not push) to preserve order in `AggregateError.errors`.

---

## Quick Reference — Promise Methods

| Method               | Resolves when               | Rejects when                       | Use case                                     |
| -------------------- | --------------------------- | ---------------------------------- | -------------------------------------------- |
| `Promise.all`        | ALL fulfill                 | ANY rejects (fast-fail)            | Need all results, zero tolerance for failure |
| `Promise.allSettled` | ALL settle                  | Never                              | Need full status report                      |
| `Promise.race`       | FIRST settles (win or lose) | FIRST rejects (if first to settle) | Timeout, fastest responder                   |
| `Promise.any`        | FIRST fulfills              | ALL reject (`AggregateError`)      | First successful result matters              |

---

## Common Interview Gotchas

1. **Order preservation in `all` / `allSettled` / `any`**: Use index assignment (`results[i]`) not `push`, since async resolution order is unpredictable.

2. **`bind` with `new`**: When a bound function is used as a constructor, the bound `this` is ignored; the new instance becomes `this`.

3. **`reduce` without `initialValue`**: Blows up on empty arrays — always safer to provide one.

4. **`debounce` vs `throttle` on whiteboard**:

   - Draw a timeline with rapid events
   - Show debounce only firing at the end
   - Show throttle firing at regular intervals throughout

5. **Promise state is immutable**: Once settled, calling `resolve`/`reject` again is a no-op — this is what makes `race`'s polyfill so elegant.

6. **`forEach` can't be stopped**: Use `some()` (stops on first `true`) or `every()` (stops on first `false`) when you need early exit.
