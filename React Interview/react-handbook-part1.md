---
render_with_liquid: false
---

# 🚀 Senior Frontend Engineer / React Developer Interview Handbook

## Part 1: Sections 1–5 | Fundamentals → Core → Hooks → Internals → Performance

> **Target:** 3–5 YOE React developers aiming for Product, Startup, and FAANG-level interviews.
> **Philosophy:** First principles → Deep internals → Production examples → Interview mastery.

---

# SECTION 1: React Fundamentals

---

## 1.1 What is React?

### Concept

React is a **declarative, component-based JavaScript library** for building user interfaces. It was created by Facebook (Meta) and open-sourced in 2013.

> React is **not a framework** — it is a **UI library** focused solely on the View layer of an application.

### Why It Exists

**The problem before React:**

- jQuery and vanilla JS required direct DOM manipulation.
- As apps grew, keeping the DOM in sync with application state became error-prone and slow.
- Large teams couldn't share UI components effectively.
- Two-way data binding (Angular 1) created complex debugging scenarios.

**The solution React brought:**

1. **One-way data flow** — predictable, debuggable state changes.
2. **Virtual DOM** — fast, intelligent DOM updates.
3. **Component model** — encapsulated, reusable UI pieces.
4. **Declarative UI** — describe _what_ UI should look like, not _how_ to change it.

### Internal Working

React's core loop:

```
State Changes → React re-renders component → Virtual DOM diff → Minimal real DOM patches
```

```
Application State
      │
      ▼
  Component Tree (React Elements / Virtual DOM)
      │
      ▼
  Reconciler (Diffing Algorithm / Fiber)
      │
      ▼
  Renderer (ReactDOM → Real DOM)
```

### Interview Questions

**Q: What is React and why was it created?**

> React is a declarative UI library that solves the problem of efficiently keeping the DOM in sync with application state through Virtual DOM diffing and a component-based architecture. Facebook created it to handle the complexity of large-scale interactive UIs like the Facebook News Feed.

**Q: Is React a framework or a library?**

> It is a library — it only handles the View layer. You need additional tools (React Router, Redux, etc.) for a full framework experience. Compare with Angular which is a full opinionated framework.

**Q: React vs Angular vs Vue?**

| Feature        | React         | Angular        | Vue                   |
| -------------- | ------------- | -------------- | --------------------- |
| Type           | Library       | Full Framework | Progressive Framework |
| Language       | JS / JSX      | TypeScript     | JS / SFC              |
| Data Binding   | One-way       | Two-way        | Two-way               |
| Learning Curve | Medium        | High           | Low                   |
| Size           | Small (~43KB) | Large          | Medium                |
| Used by        | Meta, Airbnb  | Google         | Alibaba               |
| Rendering      | Virtual DOM   | Real DOM / Ivy | Virtual DOM           |

---

## 1.2 SPA vs MPA

### Concept

|              | Single Page Application (SPA) | Multi Page Application (MPA) |
| ------------ | ----------------------------- | ---------------------------- |
| Navigation   | JS routing, no full reload    | Full page reload from server |
| Initial Load | Slow (loads all JS)           | Fast per page                |
| Subsequent   | Fast (no server roundtrip)    | Slow (full reload)           |
| SEO          | Challenging (needs SSR/SSG)   | Excellent natively           |
| Examples     | Gmail, Twitter, Figma         | Amazon, Wikipedia            |

### Why It Exists

SPAs were created to provide **native app-like experience** in the browser — instant navigation without white flash or full reload.

### Common Mistake

> Assuming SPA is always better. For content-heavy sites (e-commerce, blogs), MPA or SSR/SSG is better for SEO and initial load performance.

---

## 1.3 Virtual DOM

### Concept

The Virtual DOM (VDOM) is a **lightweight JavaScript object representation** of the actual DOM tree kept in memory.

### Why It Exists

Direct DOM manipulation is expensive because:

- The DOM is a C++ object exposed to JavaScript — crossing this bridge is slow.
- Every DOM change can trigger **Layout → Paint → Composite** in the browser.
- Batching these changes manually is error-prone.

Virtual DOM solves this by:

1. Rendering components to a cheap JavaScript object tree first.
2. Comparing (diffing) the new tree with the previous tree.
3. Computing the **minimal set of changes** needed.
4. Applying only those changes to the real DOM in a batch.

### Internal Working

```
setState() called
      │
      ▼
React creates new Virtual DOM tree
      │
      ▼
Reconciler diffs new tree vs old tree (Fiber)
      │
      ▼
Creates a list of effects (insertions, updates, deletions)
      │
      ▼
Commit Phase: applies effects to real DOM
```

**VDOM Node structure (simplified):**

```js
// What JSX compiles to:
const element = {
  type: "div",
  props: {
    className: "container",
    children: [
      { type: "h1", props: { children: "Hello" }, key: null, ref: null },
    ],
  },
  key: null,
  ref: null,
  $$typeof: Symbol(react.element),
};
```

### Is Virtual DOM Always Faster?

**No.** This is a common misconception.

- For **simple static pages**, direct DOM manipulation is faster — no VDOM overhead.
- VDOM shines in **complex, frequently updated UIs** where it reduces unnecessary DOM writes.
- Frameworks like Svelte compile away the VDOM entirely and can be faster for specific cases.

> "The Virtual DOM is overhead that pays off only when the cost of unnecessary DOM updates is higher than the cost of diffing." — Rich Harris (Svelte creator)

### Interview Answer

> Virtual DOM is a performance optimization for complex UIs. It batches DOM updates, avoids unnecessary re-paints, and provides a clean abstraction. But it's not magic — for simple apps, direct DOM manipulation can be faster.

---

## 1.4 Reconciliation & Diffing Algorithm

### Concept

Reconciliation is the process by which React determines **what changed** in the Virtual DOM and **how to update** the real DOM efficiently.

### Why It Exists

A naive diff of two arbitrary trees has O(n³) complexity. React implements a heuristic O(n) algorithm based on two assumptions:

1. **Two elements of different types will produce different trees.**
2. **The developer can hint stable identity via `key` props.**

### Diffing Rules

**Rule 1: Different type = destroy and rebuild**

```jsx
// Old tree
<div><Counter /></div>

// New tree
<span><Counter /></span>

// Result: div is destroyed, span is created fresh
// Counter component is unmounted and remounted!
```

**Rule 2: Same type = update props**

```jsx
// Old
<div className="old" />

// New
<div className="new" />

// Result: only className attribute updated, DOM node reused
```

**Rule 3: Keys help identify list items**

```jsx
// Without keys: React diffs by position
// With keys: React diffs by identity
```

### Internal Working — Fiber Reconciler

React 16+ uses the **Fiber** reconciler (covered in depth in Section 4):

- Each component corresponds to a **Fiber node**.
- React builds a **work-in-progress tree** by cloning the current tree.
- Changes are collected as **effects** during the render phase.
- Effects are flushed to the DOM in the commit phase.

### Interview Questions

**Q: What is the time complexity of React's diffing?**

> O(n) — linear in the number of nodes, thanks to heuristics based on element type and keys.

**Q: What happens when element type changes?**

> The old subtree is completely unmounted (all component lifecycles fire), and the new subtree is mounted fresh. This is why wrapping content in conditionally-typed elements can cause unexpected unmounts.

---

## 1.5 JSX Internal Transformation

### Concept

JSX is **syntactic sugar** — it is not HTML and not valid JavaScript. Babel/TypeScript transforms it into `React.createElement()` calls.

### Transformation

```jsx
// JSX
const element = <h1 className="title">Hello, {name}</h1>;

// After Babel transform (React 17- classic runtime)
const element = React.createElement(
  "h1",
  { className: "title" },
  "Hello, ",
  name
);

// React 17+ automatic runtime (no import needed)
import { jsx as _jsx } from "react/jsx-runtime";
const element = _jsx("h1", { className: "title", children: ["Hello, ", name] });
```

### React.createElement() Return Value

```js
{
  $$typeof: Symbol(react.element),  // Security: prevents XSS via JSON injection
  type: 'h1',
  key: null,
  ref: null,
  props: { className: 'title', children: ['Hello, ', name] },
  _owner: null,  // Fiber that created this element
}
```

> `$$typeof: Symbol(react.element)` is a security feature. JSON cannot contain Symbols, so a malicious server response can never inject a fake React element.

### Why JSX?

```jsx
// Without JSX — verbose and hard to read
React.createElement(
  "div",
  { className: "container" },
  React.createElement("h1", null, "Title"),
  React.createElement("p", null, "Content")
);

// With JSX — readable, HTML-like
<div className="container">
  <h1>Title</h1>
  <p>Content</p>
</div>;
```

### Interview Questions

**Q: What does JSX compile to?**

> `React.createElement()` calls (pre-React 17) or `jsx()` calls from `react/jsx-runtime` (React 17+ automatic transform). These return plain JavaScript objects called React elements.

**Q: Why can't you use `if` statements directly in JSX?**

> JSX is an expression context. `if` is a statement. Use ternary operators, logical `&&`, or extract logic into variables/functions.

**Q: Why must there be only one root element in JSX?**

> Because `React.createElement()` returns a single object. Use `<React.Fragment>` or `<>...</>` to return multiple elements without adding extra DOM nodes.

---

## 1.6 React Rendering Process & Lifecycle

### Rendering Phases

```
┌─────────────────────────────────────────────────────┐
│                   RENDER PHASE                      │
│  (Pure, no side effects, can be interrupted)        │
│  • React calls your function/render method          │
│  • Builds Virtual DOM tree                          │
│  • Runs reconciliation / diffing                    │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   COMMIT PHASE                      │
│  (Synchronous, cannot be interrupted)               │
│  • beforeMutation effects                           │
│  • Mutation: applies DOM changes                    │
│  • Layout effects (useLayoutEffect)                 │
│  • Passive effects (useEffect) — async              │
└─────────────────────────────────────────────────────┘
```

### Functional Component Rendering

```jsx
function Counter() {
  const [count, setCount] = useState(0); // Hook state

  // This entire function body is the "render"
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

Each render is a **snapshot**: React captures props, state, and event handlers as they were at the time of that render. They don't change within one render.

### Tricky Questions

**Q: Does React always update the DOM when a component re-renders?**

> No. React re-renders the component (calls the function) but only updates the real DOM if the resulting Virtual DOM differs from the previous one.

**Q: Is rendering the same as painting?**

> No. Rendering is React calling your component function and diffing the output. Painting is the browser drawing pixels. React can render many times without causing a browser repaint if the DOM didn't change.

---

# SECTION 2: React Core Concepts

---

## 2.1 Functional vs Class Components

### Functional Components (Modern)

```jsx
function UserCard({ name, age }) {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    document.title = `${name}'s profile`;
    return () => {
      document.title = "App";
    };
  }, [name]);

  return (
    <div>
      <h2>
        {name} ({age})
      </h2>
      <button onClick={() => setLikes((l) => l + 1)}>❤️ {likes}</button>
    </div>
  );
}
```

### Class Components (Legacy)

```jsx
class UserCard extends React.Component {
  state = { likes: 0 };

  componentDidMount() {
    document.title = `${this.props.name}'s profile`;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name) {
      document.title = `${this.props.name}'s profile`;
    }
  }

  componentWillUnmount() {
    document.title = "App";
  }

  render() {
    return (
      <div>
        <h2>
          {this.props.name} ({this.props.age})
        </h2>
        <button onClick={() => this.setState((s) => ({ likes: s.likes + 1 }))}>
          ❤️ {this.state.likes}
        </button>
      </div>
    );
  }
}
```

### Comparison

| Feature          | Functional                    | Class               |
| ---------------- | ----------------------------- | ------------------- |
| Syntax           | Simpler                       | Verbose             |
| `this` keyword   | Not needed                    | Required            |
| Hooks            | Yes                           | No                  |
| Performance      | Slightly better (no instance) | Slightly heavier    |
| Error Boundaries | No (yet)                      | Yes                 |
| Code reuse       | Custom Hooks                  | HOCs / Render Props |

> **Production Decision:** Always use functional components. Class components are legacy. Only keep them for Error Boundaries (which require `getDerivedStateFromError`).

---

## 2.2 Props

### Concept

Props (properties) are **read-only inputs** passed from parent to child components. They are immutable within the receiving component.

### Internal Working

Props are just the `props` argument of `React.createElement()`. React passes them as a frozen-ish object to the component function.

```jsx
// Parent
<UserProfile name="Alice" age={30} onLogout={handleLogout} />;

// Child receives
function UserProfile({ name, age, onLogout }) {
  // name, age, onLogout are read-only here
}
```

### Props vs State

|                    | Props                         | State                 |
| ------------------ | ----------------------------- | --------------------- |
| Who owns it        | Parent                        | Component itself      |
| Mutable?           | No (by child)                 | Yes (via setState)    |
| Triggers re-render | When parent updates           | When setState called  |
| Purpose            | Configuration / Communication | Dynamic internal data |

### Common Mistakes

```jsx
// ❌ Mutating props
function Bad({ items }) {
  items.push("new item"); // NEVER do this
  return (
    <ul>
      {items.map((i) => (
        <li>{i}</li>
      ))}
    </ul>
  );
}

// ✅ Derive new data
function Good({ items }) {
  const allItems = [...items, "new item"];
  return (
    <ul>
      {allItems.map((i) => (
        <li>{i}</li>
      ))}
    </ul>
  );
}
```

---

## 2.3 State & State Immutability

### Concept

State is **local, mutable data** managed by a component. When state changes, React re-renders the component.

### Why Immutability?

React uses **reference equality** (`===`) to detect state changes. If you mutate state directly, the reference doesn't change, so React won't re-render.

```jsx
// ❌ Direct mutation — React won't detect this change
const [user, setUser] = useState({ name: "Alice", age: 30 });
user.age = 31; // same reference!
setUser(user); // React sees same object, skips re-render

// ✅ New object — React detects change
setUser({ ...user, age: 31 }); // new reference

// ✅ Arrays
const [items, setItems] = useState([1, 2, 3]);
setItems([...items, 4]); // new array
setItems(items.filter((i) => i !== 2)); // new array
```

### Functional Updates

```jsx
// ❌ Stale closure problem
function increment() {
  setCount(count + 1); // 'count' captured at render time
  setCount(count + 1); // still uses same stale value!
  // count only increments by 1, not 2
}

// ✅ Functional update — always uses latest state
function increment() {
  setCount((c) => c + 1);
  setCount((c) => c + 1); // correctly increments by 2
}
```

---

## 2.4 Controlled vs Uncontrolled Components

### Controlled Components

React controls the form element's value via state.

```jsx
function ControlledForm() {
  const [email, setEmail] = useState("");

  return (
    <input
      type="email"
      value={email} // React owns the value
      onChange={(e) => setEmail(e.target.value)} // React updates on change
    />
  );
}
```

**Use when:** You need instant validation, conditional rendering based on input, or need to format input on-the-fly.

### Uncontrolled Components

The DOM manages the element's value; React reads it via `ref` when needed.

```jsx
function UncontrolledForm() {
  const inputRef = useRef();

  function handleSubmit() {
    console.log(inputRef.current.value); // Read on submit
  }

  return <input type="email" ref={inputRef} />;
}
```

**Use when:** Integrating with non-React libraries, file inputs (`<input type="file">`), or performance-critical forms with many fields.

|                 | Controlled      | Uncontrolled     |
| --------------- | --------------- | ---------------- |
| Source of truth | React state     | DOM              |
| Validation      | Realtime        | On submit        |
| Complex logic   | Easier          | Harder           |
| Performance     | More re-renders | Fewer re-renders |

---

## 2.5 Keys in Lists

### Why Keys Matter

Keys help React identify which items changed, were added, or removed in a list. Without keys, React uses position-based diffing.

```jsx
// ❌ No keys — React uses index
// If items reorder, React may update every element
const list = items.map((item) => <li>{item.name}</li>);

// ✅ Stable unique keys — React tracks by identity
const list = items.map((item) => <li key={item.id}>{item.name}</li>);
```

### Why Not Array Index?

```jsx
// Consider: ['Alice', 'Bob', 'Charlie'] with index keys
// If Alice is removed: ['Bob', 'Charlie']
// Bob is now index 0 (was 1), Charlie is index 1 (was 2)
// React sees index 0 changed from 'Alice' to 'Bob' and updates it
// React sees index 1 changed from 'Bob' to 'Charlie' and updates it
// React REMOVES index 2 (Charlie)
// Result: 2 DOM updates + 1 removal = WRONG and slow

// With id keys:
// React removes the node with key='alice-id' = 1 DOM removal
```

**Rules:**

- Keys must be **unique among siblings** (not globally).
- Keys must be **stable** (same across renders).
- Keys must be **predictable** (not random like `Math.random()`).

### Tricky Question

**Q: Can you use the same key in different lists?**

> Yes. Keys only need to be unique **among siblings** in the same list. The same key in different lists is fine.

**Q: Can keys be strings or numbers?**

> Both work. React converts them to strings internally.

---

## 2.6 Conditional Rendering

```jsx
function Notification({ type, message }) {
  // Method 1: Ternary
  return <div>{type === "error" ? <ErrorIcon /> : <InfoIcon />}</div>;
}

// Method 2: && short-circuit
function Alert({ show, message }) {
  return <div>{show && <p>{message}</p>}</div>;
}

// ⚠️ Tricky: falsy value '0' renders as "0"
function Count({ count }) {
  return <div>{count && <span>Items: {count}</span>}</div>;
  // If count=0: renders "0" not nothing!
  // Fix: use count > 0 && ... or ternary
}
```

---

# SECTION 3: React Hooks Deep Dive

---

## 3.1 useState

### Concept

`useState` adds local state to functional components. Returns a `[state, setter]` tuple.

### Internal Working

React maintains a **linked list of hooks** for each component fiber. `useState` corresponds to a node in this list. The order of hook calls must be consistent across renders (hence no hooks in conditions or loops).

```
Fiber Node
├── memoizedState → Hook 1 (useState: count=0) → Hook 2 (useState: name='') → null
└── ...
```

```jsx
function Counter() {
  // Hook 1: { memoizedState: 0, queue: [], next: → Hook 2 }
  const [count, setCount] = useState(0);

  // Hook 2: { memoizedState: '', queue: [], next: null }
  const [name, setName] = useState("");
}
```

### State Update Queue

When you call `setCount(1)` and then `setCount(2)` synchronously:

```jsx
// React 18: automatic batching
function handleClick() {
  setCount((c) => c + 1); // queued
  setName("Alice"); // queued
  // React batches both and re-renders ONCE
}
```

React 18 introduced **automatic batching** — all state updates inside event handlers, setTimeout, promises, and native event listeners are batched.

### Lazy Initialization

```jsx
// ❌ Expensive function called every render
const [state, setState] = useState(expensiveComputation());

// ✅ Lazy init — function called only once
const [state, setState] = useState(() => expensiveComputation());
```

### Interview Questions

**Q: Why can't you call useState inside a condition?**

> React relies on the **order of hook calls** to map state to the correct hook node in the fiber's linked list. If a hook is skipped due to a condition, all subsequent hooks get the wrong state.

**Q: What's the difference between `setState(value)` and `setState(fn)`?**

> Direct value sets state to that value. Functional form receives the previous state and returns the new state. Use functional form when new state depends on old state to avoid stale closure issues.

---

## 3.2 useEffect

### Concept

`useEffect` synchronizes a component with an **external system** (DOM, API, timers, subscriptions).

### Lifecycle Mapping

```
Functional      →   Class Equivalent
─────────────────────────────────────
useEffect(fn)   →   componentDidMount + componentDidUpdate
useEffect(fn,[])→   componentDidMount only
useEffect(fn,[x])→  componentDidMount + componentDidUpdate (when x changes)
cleanup fn      →   componentWillUnmount + before next effect
```

### Structure

```jsx
useEffect(() => {
  // 1. Setup code (runs after render)
  const subscription = api.subscribe(userId, handler);

  // 2. Cleanup (runs before next effect OR on unmount)
  return () => {
    subscription.unsubscribe();
  };
}, [userId]); // 3. Dependencies
```

### Dependency Array Rules

```jsx
// No array: runs after EVERY render
useEffect(() => {
  console.log("every render");
});

// Empty array: runs once after mount
useEffect(() => {
  fetchData();
}, []);

// Specific deps: runs when deps change
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

### Common Mistake: Infinite Loop

```jsx
// ❌ Infinite loop: effect sets state, state causes re-render, effect runs again
useEffect(() => {
  setData(fetchedData); // triggers re-render
}); // no dependency array!

// ✅ Only run when needed
useEffect(() => {
  fetchData().then(setData);
}, []); // or with specific deps
```

### Why useEffect Runs Twice in Strict Mode

React 18 Strict Mode in development:

1. Mounts component
2. **Immediately unmounts** (runs cleanup)
3. **Remounts** component (runs effect again)

This simulates future React behavior where components may be unmounted and remounted while preserving state. It exposes bugs in effects that don't clean up properly.

```jsx
// ❌ Bug exposed by Strict Mode double-invoke
useEffect(() => {
  window.addEventListener("resize", handler);
  // No cleanup! After double-invoke: 2 listeners attached
}, []);

// ✅ Correct
useEffect(() => {
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);
```

### Interview Questions

**Q: What is the cleanup function in useEffect?**

> The function returned from `useEffect`. It runs before the next effect execution and on unmount. Used to cancel subscriptions, clear timers, abort fetch requests to prevent memory leaks and stale state updates.

**Q: Can you use async directly in useEffect?**

```jsx
// ❌ Can't make useEffect async directly
useEffect(async () => {
  const data = await fetch("/api"); // cleanup must return void, not Promise
}, []);

// ✅ Define async function inside
useEffect(() => {
  async function load() {
    const data = await fetch("/api").then((r) => r.json());
    setData(data);
  }
  load();
}, []);
```

---

## 3.3 useRef

### Concept

`useRef` returns a mutable ref object: `{ current: initialValue }`. The key property: **updating `ref.current` does NOT trigger a re-render.**

### Why No Re-render?

Unlike state (stored in fiber's `memoizedState`), refs are stored in `fiber.ref` — a plain mutable object that React doesn't track. React never reads `ref.current` during rendering.

### Use Cases

```jsx
// Use Case 1: DOM access
function FocusInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}

// Use Case 2: Persist mutable values without triggering re-render
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  function start() {
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
  }

  return (
    <div>
      {seconds}s<button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// Use Case 3: Track previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current; // returns value from previous render
}
```

### Tricky Question

**Q: What's the difference between `useRef` and a variable outside the component?**

> A variable outside the component is **shared across all instances**. A `useRef` is **per component instance**. Also, `useRef` persists across renders while local variables are recreated each render.

---

## 3.4 useMemo

### Concept

`useMemo` memoizes the **result of a computation**, recomputing only when dependencies change.

```jsx
const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b]);
```

### Internal Working

React stores the previous dependency values and previous result. On re-render, it shallow-compares new deps with stored deps. If all equal, returns cached result; otherwise recomputes.

### When to Use

```jsx
// ✅ Expensive computation
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.value - b.value);
}, [items]); // 100,000 items — sorting every render is wasteful

// ✅ Referential stability for child component
const config = useMemo(() => ({ theme: "dark", lang: "en" }), []);
// Without memo: new object every render = child always re-renders

// ❌ Premature optimization — not expensive
const name = useMemo(() => `${first} ${last}`, [first, last]);
// String concat is trivial; memo adds overhead
```

### When useMemo Hurts Performance

1. **Overhead for cheap computations** — comparing deps is not free.
2. **Memory pressure** — storing the cached value uses memory.
3. **Over-memoization** — complex dependency arrays that change frequently.

---

## 3.5 useCallback

### Concept

`useCallback` memoizes a **function reference**, returning the same function instance if dependencies haven't changed.

```jsx
const memoizedFn = useCallback(() => doSomething(a, b), [a, b]);

// Equivalent to:
const memoizedFn = useMemo(() => () => doSomething(a, b), [a, b]);
```

### Why It Matters

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New function reference every render
  const handleClick = () => setCount((c) => c + 1);

  // ✅ Stable reference
  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  // Without useCallback, Child re-renders on every Parent render
  // because handleClick is a new object each time
  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});
```

### useMemo vs useCallback

```
useMemo(fn, deps)     → memoizes the RETURN VALUE of fn
useCallback(fn, deps) → memoizes fn ITSELF
useCallback(fn, deps) === useMemo(() => fn, deps)
```

---

## 3.6 React.memo

### Concept

`React.memo` is a Higher-Order Component that **skips re-rendering** a component if its props haven't changed (shallow comparison).

```jsx
const ExpensiveComponent = React.memo(function ({ data, onAction }) {
  // Only re-renders if data or onAction reference changes
  return <div>{data.map(renderItem)}</div>;
});
```

### Custom Comparison

```jsx
const Component = React.memo(MyComponent, (prevProps, nextProps) => {
  // Return true to SKIP re-render (props are "equal")
  // Return false to RE-RENDER (props changed)
  return prevProps.id === nextProps.id;
});
```

### Common Mistake

```jsx
function Parent() {
  return (
    // ❌ Object literal — new reference every render!
    <Memoized style={{ color: "red" }} />
    // React.memo sees new style prop → re-renders anyway

    // ✅ Memoize the object
    // const style = useMemo(() => ({ color: 'red' }), []);
    // <Memoized style={style} />
  );
}
```

---

## 3.7 useReducer

### Concept

`useReducer` is an alternative to `useState` for **complex state logic** or when next state depends on previous state in multiple ways.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### Pattern

```jsx
// 1. Define state shape
const initialState = { count: 0, step: 1, history: [] };

// 2. Define reducer — pure function
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count],
      };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "RESET":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// 3. Use in component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      Count: {state.count} (step: {state.step})
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>
        Step 5
      </button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

### useState vs useReducer

|                 | useState        | useReducer            |
| --------------- | --------------- | --------------------- |
| Complexity      | Simple values   | Complex objects       |
| Logic location  | Inline          | Centralized reducer   |
| Testability     | Component tests | Pure function tests   |
| Action tracking | Hard            | Easy (action history) |
| Analogy         | Variable        | Redux store           |

---

## 3.8 useLayoutEffect

### Concept

`useLayoutEffect` fires **synchronously after DOM mutations but before the browser paints**. Use it to read layout and synchronously re-render.

```
Render → Commit (DOM mutations) → useLayoutEffect → Browser Paint → useEffect
```

### When to Use

```jsx
// Measure DOM element before paint to avoid flash
function Tooltip({ children, text }) {
  const ref = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    // Calculate tooltip position synchronously before paint
    setPosition(calculatePosition(rect));
  }, []);

  return (
    <div ref={ref}>
      {children}
      <div style={position}>{text}</div>
    </div>
  );
}
```

> **Rule:** Prefer `useEffect`. Use `useLayoutEffect` only when you see visual flickering caused by DOM reads/writes that need to be synchronous.

---

## 3.9 useContext

### Concept

`useContext` subscribes to a React Context, allowing you to consume values without prop drilling.

```jsx
// 1. Create context
const ThemeContext = createContext("light");

// 2. Provide value
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere in tree
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      className={theme}
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
      Toggle Theme
    </button>
  );
}
```

### Performance Caveat

Every component that calls `useContext(MyContext)` **re-renders whenever the context value changes**, even if it only uses part of the value.

```jsx
// ❌ All consumers re-render when either theme or user changes
const AppContext = createContext({ theme: "light", user: null });

// ✅ Split contexts by change frequency
const ThemeContext = createContext("light");
const UserContext = createContext(null);
```

---

## 3.10 Custom Hooks

### Concept

Custom hooks are functions starting with `use` that can call other hooks. They extract reusable stateful logic from components.

### Examples

```jsx
// useFetch — data fetching hook
function useFetch(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

// useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [value, setStoredValue];
}
```

### Interview Questions

**Q: What makes a function a custom hook?**

> Naming convention starting with `use` and the ability to call other hooks inside it. The `use` prefix tells React (and linters) to apply hook rules to it.

**Q: Can custom hooks share state?**

> No. Each component that calls a custom hook gets its own isolated state. Custom hooks share logic, not state. To share state, use Context or external state management.

---

# SECTION 4: React Internals

---

## 4.1 Fiber Architecture

### Why Fiber Was Created

**Pre-Fiber (Stack Reconciler — React ≤15):**

- Reconciliation was **synchronous and recursive**.
- Once started, it couldn't be interrupted.
- On large trees, it could block the main thread for 100ms+, causing jank.
- No way to prioritize urgent updates (user input) over less urgent ones (data fetch).

**Fiber (React 16+):**

- Reconciliation is **incremental and interruptible**.
- Work is split into small units called "fibers."
- React can pause work, prioritize urgent updates, and resume later.
- Enables Concurrent Mode, Suspense, and Time Slicing.

### Fiber Node Structure

```js
// Simplified Fiber node
{
  // Identity
  type: 'div' | FunctionComponent | ClassComponent,
  key: null | string,

  // Tree structure
  child: Fiber | null,      // first child
  sibling: Fiber | null,    // next sibling
  return: Fiber | null,     // parent fiber

  // State
  memoizedState: Hook | null,     // hooks linked list
  memoizedProps: Props,           // props from last render
  pendingProps: Props,            // props for this render

  // Effects
  effectTag: number,              // what needs to change (insert/update/delete)
  nextEffect: Fiber | null,       // linked list of fibers with effects

  // Scheduler
  lanes: Lanes,                   // priority of pending work
  childLanes: Lanes,

  // Double buffering
  alternate: Fiber | null,        // the other tree (current ↔ work-in-progress)
}
```

### Double Buffering

React maintains **two fiber trees**:

- **Current tree**: What is currently rendered on screen.
- **Work-In-Progress (WIP) tree**: What React is building for the next render.

```
Current Tree          Work-In-Progress Tree
(on screen)           (being built)
────────────          ─────────────────────
  App Fiber    ←──►    App Fiber (alternate)
  │                    │
  Div Fiber    ←──►    Div Fiber (alternate)
  │                    │
  List Fiber   ←──►    List Fiber (alternate)
```

When the WIP tree is complete, React **atomically swaps** it to become the current tree. This prevents partial UI states from being shown.

### Interview Questions

**Q: Explain Fiber Architecture.**

> Fiber is React's reconciliation algorithm that represents each component as a unit of work (a fiber node). It allows React to break rendering into chunks, pause work, prioritize updates, and resume — enabling Concurrent Mode. Each fiber node is a linked list node containing component type, props, state, effects, and priority metadata.

**Q: What is the "alternate" pointer in a fiber?**

> It points to the corresponding fiber in the other tree (current ↔ work-in-progress). This enables double buffering — React builds the new tree while the old one stays visible, then swaps atomically.

---

## 4.2 Render Phase vs Commit Phase

### Render Phase

- React traverses the fiber tree, calling component functions.
- **Pure and side-effect free** (in theory).
- Can be **interrupted, paused, or restarted** by the scheduler.
- Produces a list of effects (what needs to change).
- Components may render without their output appearing on screen.

### Commit Phase

Three sub-phases, **all synchronous and uninterruptible**:

```
1. beforeMutation
   • Reads DOM layout for snapshot (getSnapshotBeforeUpdate in class components)

2. mutation
   • Inserts, updates, deletes DOM nodes
   • Calls ref detach (ref.current = null)

3. layout
   • Runs useLayoutEffect (synchronously)
   • Calls ref attach (ref.current = domNode)
   • Runs componentDidMount / componentDidUpdate in class components

4. (async, after paint)
   • Runs useEffect
```

---

## 4.3 React Scheduler

### Concept

The Scheduler is a separate package (`scheduler`) that implements **cooperative multitasking** in JavaScript using message channels (or `setTimeout` as fallback).

### Priority Levels

```
ImmediatePriority    → -1ms  (synchronous, blocking)
UserBlockingPriority → 250ms (user input: clicks, typing)
NormalPriority       → 5000ms (data fetches, renders)
LowPriority          → 10000ms (analytics)
IdlePriority         → Infinity (non-essential work)
```

### How It Works

```
1. React schedules a unit of work with a priority
2. Scheduler checks if there's time remaining in the current frame (5ms budget)
3. If time remains: continue work
4. If no time: yield to browser (via MessageChannel postMessage)
5. Browser handles input, paint, etc.
6. Scheduler resumes work
```

### Lanes

React 18 uses **Lanes** — a bitmask system for priority:

```js
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;
const TransitionLane1 = 0b0000000000000000000000001000000;
```

Multiple lanes can be active simultaneously. React processes higher-priority lanes first.

---

## 4.4 Concurrent Rendering

### Concept

Concurrent Mode allows React to work on **multiple versions of the UI simultaneously**, interrupting lower-priority work when higher-priority work arrives.

```jsx
// React 18: opt into concurrent rendering
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

### Key APIs

```jsx
// useTransition: mark update as non-urgent
function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    setQuery(e.target.value); // urgent: update input immediately

    startTransition(() => {
      setResults(filterItems(e.target.value)); // non-urgent: can be interrupted
    });
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending ? <Spinner /> : <ResultList results={results} />}
    </div>
  );
}

// useDeferredValue: defer a value update
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query during transitions
  return <ExpensiveList filter={deferredQuery} />;
}
```

---

## 4.5 Synthetic Events & Event Delegation

### Concept

React wraps native browser events in a **SyntheticEvent** — a cross-browser compatible wrapper that normalizes event properties.

### Event Delegation

React does NOT attach event listeners to individual DOM nodes. Instead:

```
React 16: attached all listeners to document
React 17+: attached all listeners to the React root (#root div)
```

This change in React 17 was made to support multiple React roots on the same page (e.g., micro-frontends).

```jsx
// You write this:
<button onClick={handleClick}>Click</button>

// React does:
// rootElement.addEventListener('click', reactEventHandler)
// When click occurs, React's handler determines which fiber to call
```

### Benefits

- Fewer event listeners (one per event type on root vs one per element).
- Events work on dynamically rendered elements.
- Consistent event behavior across browsers.

### Tricky Question

**Q: What is `event.stopPropagation()` in React vs native?**

> In React, `e.stopPropagation()` stops the React synthetic event from bubbling through React's component tree. But native event listeners attached to ancestor DOM nodes may still fire (since React uses delegation at the root). Use `e.nativeEvent.stopImmediatePropagation()` to stop native propagation too.

---

## 4.6 React Batching

### Pre-React 18 (Legacy)

Only batched inside React event handlers. Not in setTimeout, Promises, or native events.

```jsx
// React 17: batched (1 re-render)
button.addEventListener("click", () => {
  setCount((c) => c + 1);
  setName("Alice");
}); // via React's synthetic event system

// React 17: NOT batched (2 re-renders)
setTimeout(() => {
  setCount((c) => c + 1); // re-render 1
  setName("Alice"); // re-render 2
}, 0);
```

### React 18: Automatic Batching

All state updates are batched by default, everywhere:

```jsx
// React 18: all batched (1 re-render)
setTimeout(() => {
  setCount((c) => c + 1);
  setName("Alice");
}, 0);

// Opt out with flushSync (rare use case)
import { flushSync } from "react-dom";
flushSync(() => setCount((c) => c + 1)); // forces synchronous re-render
```

---

# SECTION 5: React Performance Optimization

---

## 5.1 Rendering Optimization

### When Does a Component Re-render?

1. Its own **state** changed.
2. Its **parent** re-rendered.
3. A **context value** it consumes changed.
4. Its **key** changed (unmounts + remounts).

```
Parent re-renders
→ All children re-render by default
→ Unless: React.memo (for function components) or PureComponent (for class)
```

### React.memo + useCallback + useMemo: The Trio

```jsx
// Scenario: Parent updates frequently, Child is expensive
function Parent() {
  const [count, setCount] = useState(0);
  const [items] = useState([{ id: 1, name: "Item 1" }]);

  // Without useCallback: new fn reference every Parent render → Child re-renders
  const handleDelete = useCallback((id) => {
    // delete logic
  }, []); // stable reference

  // Without useMemo: new array reference every render → Child re-renders
  const filteredItems = useMemo(() => items.filter((i) => i.active), [items]);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <ExpensiveChild items={filteredItems} onDelete={handleDelete} />
    </>
  );
}

const ExpensiveChild = React.memo(({ items, onDelete }) => {
  // Only re-renders when items or onDelete actually change
  return (
    <ul>
      {items.map((i) => (
        <li key={i.id}>{i.name}</li>
      ))}
    </ul>
  );
});
```

---

## 5.2 Code Splitting & Lazy Loading

### Concept

Bundle all your JS upfront → slow initial load. Code splitting breaks the bundle into chunks loaded on demand.

```jsx
// Without code splitting: everything in main bundle
import Dashboard from "./Dashboard";
import Analytics from "./Analytics";

// With code splitting: separate chunks per route
const Dashboard = React.lazy(() => import("./Dashboard"));
const Analytics = React.lazy(() => import("./Analytics"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-Level Splitting

```jsx
// Heavy component loaded only when needed
const HeavyEditor = React.lazy(() => import("./RichTextEditor"));

function Post({ isEditing }) {
  return isEditing ? (
    <Suspense fallback={<div>Loading editor...</div>}>
      <HeavyEditor />
    </Suspense>
  ) : (
    <PostView />
  );
}
```

---

## 5.3 Virtualization / Windowing

### Problem

Rendering 10,000 list items = 10,000 DOM nodes = slow scroll, high memory.

### Solution

Only render items **currently visible** in the viewport.

```jsx
import { FixedSizeList as List } from "react-window";

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {" "}
      {/* style contains top/height for positioning */}
      {items[index].name}
    </div>
  );

  return (
    <List
      height={600} // visible window height
      itemCount={items.length}
      itemSize={50} // each row height
      width="100%">
      {Row}
    </List>
  );
}
```

**Libraries:**

- `react-window` — lightweight, simple API
- `react-virtualized` — feature-rich, heavier
- `@tanstack/virtual` — headless, most flexible

---

## 5.4 Bundle Optimization

### Tree Shaking

Dead code elimination — unused exports are removed during build.

```js
// ✅ Named imports: bundlers can tree-shake
import { debounce } from "lodash-es"; // only imports debounce

// ❌ Default import: pulls entire library
import _ from "lodash"; // imports ALL of lodash (~70KB)
```

### Bundle Analysis

```bash
# Analyze what's in your bundle
npx webpack-bundle-analyzer build/stats.json

# For Vite
npm run build -- --profile
# Or use rollup-plugin-visualizer
```

**What to look for:**

- Duplicate packages (multiple versions of same library)
- Unexpectedly large dependencies
- Opportunities for dynamic imports

---

## 5.5 Debounce & Throttle for API Optimization

```jsx
// Debounce: wait for user to stop typing before searching
function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Throttle: limit scroll event handler to 60fps
function useThrottle(fn, limit) {
  const lastRun = useRef(Date.now());
  return useCallback(
    (...args) => {
      if (Date.now() - lastRun.current >= limit) {
        fn(...args);
        lastRun.current = Date.now();
      }
    },
    [fn, limit]
  );
}
```

---

## 5.6 Request Cancellation with AbortController

```jsx
function useData(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort(); // cancel on cleanup
  }, [url]);

  return data;
}
```

---

## 5.7 Performance Profiling

### React DevTools Profiler

1. Open React DevTools → Profiler tab.
2. Click Record → Interact with app → Stop.
3. Inspect flamegraph: each bar = one render.
4. Colors: Gray (didn't render), Green (fast), Yellow/Red (slow).
5. Look for components that render when they shouldn't.

### Chrome Performance Tab

1. Open DevTools → Performance → Record.
2. Interact → Stop.
3. Look for **Long Tasks** (>50ms) in the Main thread.
4. Find React reconciliation, layout, paint costs.

### Lighthouse

```bash
# Run from Chrome DevTools → Lighthouse tab
# Or from CLI:
npx lighthouse https://yourapp.com --output html
```

Key metrics to watch:

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID/INP** (Interaction to Next Paint): < 200ms

---

## 5.8 Performance Interview Questions

**Q: Why does a React app become slow?**

> Common causes: unnecessary re-renders cascading down component tree, expensive computations on every render, large bundle size causing slow initial load, blocking JS causing poor FID, unvirtualized long lists causing layout thrashing.

**Q: How to optimize re-renders?**

> 1. `React.memo` to skip re-renders when props don't change. 2. `useCallback`/`useMemo` for referential stability. 3. Lift state down to keep expensive subtrees isolated. 4. Split contexts by change frequency. 5. Use `useTransition` for non-urgent updates.

**Q: Is React.memo always beneficial?**

> No. It adds overhead (shallow prop comparison) and memory usage. It's beneficial when: the component is expensive to render, it renders frequently, and its props rarely change. For cheap components, the memo overhead may cost more than it saves.

---

_End of Part 1 — Sections 1–5_
