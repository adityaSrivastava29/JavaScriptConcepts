# JavaScript Interview Questions: Closures Edition


---

## Q1: What is a Closure in JavaScript?
**A:**
A closure is a function along with a reference to its outer environment. In other words, a closure is a combination of a function and its lexical scope bundled together.

**Example:**
```js
function outer() {
  var a = 10;
  function inner() {
    console.log(a);
  } // inner forms a closure with outer
  return inner;
}
outer()(); // 10
```
- Here, `outer()` returns `inner`, and calling it prints `10` because `inner` has access to `a` from its outer scope.

---

## Q2: Does the order of variable declaration matter for closures?
**A:**
No, the inner function forms a closure with its outer environment, so the sequence doesn't matter.

**Example:**
```js
function outer() {
  function inner() {
    console.log(a);
  }
  var a = 10;
  return inner;
}
outer()(); // 10 
var close = outer();
close(); // 10
```

---

## Q3: Does changing `var` to `let` affect closures?
**A:**
No, the closure will still work the same way.

**Example:**
```js
function outer() {
  let a = 10;
  function inner() {
    console.log(a);
  }
  return inner;
}
outer()(); // 10
```

---

## Q4: Do closures capture function arguments?
**A:**
Yes, inner functions have access to their outer function's arguments.

**Example:**
```js
function outer(str) {
  let a = 10;
  function inner() {
    console.log(a, str);
  }
  return inner;
}
outer("Hello There")(); // 10 "Hello There"
```

---

## Q5: Can closures access variables from multiple outer scopes?
**A:**
Yes, closures can access variables from all their parent scopes.

**Example:**
```js
function outest() {
  var c = 20;
  function outer(str) {
    let a = 10;
    function inner() {
      console.log(a, c, str);
    }
    return inner;
  }
  return outer;
}
outest()("Hello There")(); // 10 20 "Hello There"
```

---

## Q6: What if there are conflicting variable names in the scope chain?
**A:**
The inner function will use the closest variable in its scope chain. If not found, it will look further out.

**Example:**
```js
function outest() {
  var c = 20;
  function outer(str) {
    let a = 10;
    function inner() {
      console.log(a, c, str);
    }
    return inner;
  }
  return outer;
}
let a = 100;
outest()("Hello There")(); // 10 20 "Hello There"
```
- Here, `a` inside `outer` shadows the global `a`.

---

## Q7: What are the advantages of closures?
- Module Design Pattern
- Currying
- Memoization
- Data hiding and encapsulation
- setTimeouts and async code

---

## Q8: How do closures help with data hiding and encapsulation?

**Without closures:**
```js
var count = 0;
function increment() {
  count++;
}
// Anyone can access and modify count
```

**With closures:**
```js
function counter() {
  var count = 0;
  function increment() {
    count++;
  }
}
// count is not accessible from outside
```

**With closure and function return:**
```js
function counter() {
  var count = 0;
  return function increment() {
    count++;
    console.log(count);
  }
}
var counter1 = counter();
counter1(); // 1
var counter2 = counter();
counter2(); // 1 (separate instance)
```

**With constructor for scalability:**
```js
function Counter() {
  var count = 0;
  this.incrementCounter = function() {
    count++;
    console.log(count);
  }
  this.decrementCounter = function() {
    count--;
    console.log(count);
  }
}
var counter1 = new Counter();
counter1.incrementCounter();
counter1.incrementCounter();
counter1.decrementCounter();
// 1 2 1
```

---

## Q9: What are the disadvantages of closures?
Closures can cause overconsumption of memory because closed-over variables are not garbage collected until the closure is released. This can lead to memory leaks if not handled properly.

**Example:**
```js
function a() {
  var x = 0;
  return function b() {
    console.log(x);
  };
}
var y = a();
y(); // x is not garbage collected as long as y exists
```

**Garbage Collector:**
JavaScript engines automatically free up unused memory, but closed-over variables remain as long as the closure exists. Modern engines are smart and will only keep variables that are actually referenced by the closure.

---

## Q10: setTimeout, Closures, and Loop Pitfalls

### The Problem with `var` in Loops
```js
function y() {
  for (var i = 1; i <= 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
  }
}
// y();
```
- This will log `6` five times. Why? Because `var` is function-scoped, so all callbacks share the same `i`.

### Fix with IIFE
```js
function z() {
  for (var i = 1; i <= 5; i++) {
    (function(closeI) {
      setTimeout(() => {
        console.log(closeI);
      }, closeI * 1000);
    })(i);
  }
}
// z();
```
- The IIFE captures the current value of `i` for each iteration.

### Fix with `let`
```js
function a() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
  }
}
// a();
```
- `let` is block-scoped, so each callback gets its own `i`.

---

## Summary
Closures are a fundamental concept in JavaScript, enabling powerful patterns like data hiding, currying, and async programming. Understanding closures is essential for interviews and real-world coding.
