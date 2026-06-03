---
layout: note
next_url: /react-interview/react-handbook-part2
next_title: Part 2
---

{% raw %}

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

# SECTION 3: React Hooks — Complete Reference

---

> **React 18 hooks covered:** `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `React.memo`, `useReducer`, `useLayoutEffect`, `useContext`, `useTransition`, `useDeferredValue`, `useId`, `useSyncExternalStore`, `useImperativeHandle`, `useDebugValue`, Custom Hooks

## How Hooks Work Internally

React maintains a **linked list of hook nodes** per fiber (component instance). Each `use*` call corresponds to one node in the list. This is why:

1. **Hooks cannot be called conditionally** — order must be the same every render so React maps nodes correctly.
2. **Hooks are per-instance** — two `<Counter />` components each have their own hook list.
3. **Hooks survive re-renders** — the fiber persists between renders; only the `memoizedState` field updates.

```
Component Fiber
└── memoizedState
    └── Hook Node 1 (useState: count=0)
        └── Hook Node 2 (useState: name='')
            └── Hook Node 3 (useEffect: deps=[userId])
                └── Hook Node 4 (useMemo: deps=[items])
                    └── null
```

```
Hook Node shape:
{
  memoizedState: any,    // stored value (state, effect, ref, memo result, etc.)
  baseState:     any,    // for useState: state before queued updates
  queue:         Queue,  // update queue for useState/useReducer
  baseQueue:     Update, // pending updates not yet applied
  next:          Hook    // pointer to next hook node
}
```

---

## 3.1 useState — Deep Dive

### Core Concept

`useState` adds local reactive state to functional components. Every call to the setter triggers a re-render with the new value.

```jsx
const [state, setState] = useState(initialValue);
```

### Internal Working

```
Fiber Node
├── memoizedState → Hook 1 (useState: count=0) → Hook 2 (useState: name='') → null
└── ...
```

```jsx
function Counter() {
  // Hook 1: { memoizedState: 0, queue: UpdateQueue, next: → Hook 2 }
  const [count, setCount] = useState(0);
  // Hook 2: { memoizedState: '', queue: UpdateQueue, next: null }
  const [name, setName] = useState("");
}
```

### Functional Updates — Prevent Stale State

```jsx
// ❌ Stale closure — captures count at the time of creation
const handleClick = () => setCount(count + 1);

// ✅ Functional update — always uses latest value
const handleClick = () => setCount((prev) => prev + 1);

// Critical when inside setTimeout or async callbacks:
setTimeout(() => {
  // ❌ count is stale — closure captured count=0
  setCount(count + 1);

  // ✅ Always correct
  setCount((c) => c + 1);
}, 1000);
```

### Lazy Initialization

```jsx
// ❌ expensiveComputation() runs on EVERY render
const [state, setState] = useState(expensiveComputation());

// ✅ Lazy init — function called ONCE (on mount only)
const [state, setState] = useState(() => expensiveComputation());

// ✅ Real example: reading from localStorage
const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});
```

### React 18: Automatic Batching

Before React 18, only event handlers were batched. React 18 batches **everywhere**:

```jsx
// React 17: TWO re-renders (outside event handler)
setTimeout(() => {
  setCount(1); // re-render 1
  setFlag(true); // re-render 2
}, 1000);

// React 18: ONE re-render (automatic batching)
setTimeout(() => {
  setCount(1); // queued
  setFlag(true); // queued
  // single re-render with both updates
}, 1000);

// Opt out of batching (rare):
import { flushSync } from "react-dom";
flushSync(() => setCount(1)); // forces immediate re-render
flushSync(() => setFlag(true));
```

### Object State — Immutability

```jsx
// ❌ Mutating state directly (React won't detect change)
const [user, setUser] = useState({ name: "Alice", age: 25 });
user.age = 26; // mutation
setUser(user); // same reference → React skips re-render

// ✅ Spread to create new object
setUser((prev) => ({ ...prev, age: 26 }));

// ✅ Nested updates — spread at every level
const [form, setForm] = useState({ user: { name: "", address: { city: "" } } });
setForm((prev) => ({
  ...prev,
  user: {
    ...prev.user,
    address: { ...prev.user.address, city: "NYC" },
  },
}));
// For deeply nested state, consider useImmer or RTK's Immer integration
```

### State Reset Pattern

```jsx
// Force complete state reset by changing the key prop
// React treats different keys as different component instances
function Form({ userId }) {
  return <UserForm key={userId} />;
}
// When userId changes, UserForm is unmounted & remounted with fresh state
```

### Interview Questions

**Q: Why can't you call useState inside a condition?**

> React maps hook calls to fiber nodes by their **call order**. Skipping a hook in a condition shifts all subsequent hooks to wrong nodes, corrupting state.

**Q: What's the difference between `setState(value)` and `setState(fn)`?**

> Direct value replaces state immediately. Functional form receives the guaranteed **latest state** (not the closed-over value), preventing stale state bugs in async code or when multiple updates are batched.

**Q: Does setState immediately update state?**

> No. State updates are **scheduled** — `state` still holds the old value after calling `setState`. The new value is only available in the next render. To read the new value synchronously, store it in a local variable first.

---

## 3.2 useEffect — Deep Dive

### Concept

`useEffect` **synchronizes** a component with an external system. Think of it as: "after rendering, do this side effect and optionally clean it up."

```
Render → Paint → useEffect (async, after paint)
```

### Lifecycle Mapping

```
Functional              →   Class Equivalent
────────────────────────────────────────────────────────
useEffect(fn)           →   componentDidMount + componentDidUpdate (every render)
useEffect(fn, [])       →   componentDidMount only
useEffect(fn, [x, y])   →   componentDidMount + componentDidUpdate (when x or y changes)
cleanup fn (return)     →   componentWillUnmount + before next effect run
```

### Anatomy

```jsx
useEffect(() => {
  // ① SETUP — runs after commit phase
  const subscription = websocket.connect(roomId);
  subscription.onMessage((msg) => setMessages((m) => [...m, msg]));

  // ② CLEANUP — runs before next effect OR on unmount
  return () => {
    subscription.disconnect();
  };
}, [roomId]); // ③ DEPS — re-run only when roomId changes
```

### Dependency Array Rules

```jsx
// No array → runs after EVERY render (rarely what you want)
useEffect(() => {
  document.title = count;
});

// Empty array → runs ONCE after mount
useEffect(() => {
  initAnalytics();
}, []);

// With deps → runs on mount + whenever dep changes
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

**ESLint rule `exhaustive-deps`**: Always include every reactive value (props, state, context) used inside the effect in the dependency array.

### Async Data Fetching — Best Practices

```jsx
// ❌ Can't make useEffect itself async (returns Promise, not cleanup fn)
useEffect(async () => {
  const data = await fetch("/api/user"); // Promise returned, not cleanup
}, []);

// ✅ Pattern 1: inline async function
useEffect(() => {
  let cancelled = false;

  async function fetchUser() {
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      if (!cancelled) setUser(data); // guard against unmount race
    } catch (err) {
      if (!cancelled) setError(err.message);
    }
  }
  fetchUser();

  return () => {
    cancelled = true;
  }; // cancellation flag
}, [userId]);

// ✅ Pattern 2: AbortController (preferred — actually cancels the request)
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/user/${userId}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err.message);
    });

  return () => controller.abort(); // cancels in-flight request
}, [userId]);
```

### Strict Mode Double-Invoke

React 18 Strict Mode mounts → **unmounts** → **remounts** every component in development:

```
Mount → cleanup → Mount (again)
```

Purpose: expose effects that don't clean up correctly.

```jsx
// ❌ Bug — Strict Mode reveals double event listener
useEffect(() => {
  document.addEventListener("keydown", handler);
  // Runs twice → 2 listeners attached after double-invoke!
}, []);

// ✅ Always return cleanup
useEffect(() => {
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, []);
```

### Common useEffect Patterns

```jsx
// Pattern: sync state to URL
useEffect(() => {
  const params = new URLSearchParams({ q: searchTerm });
  window.history.replaceState({}, "", `?${params}`);
}, [searchTerm]);

// Pattern: listen to window events
useEffect(() => {
  const handler = (e) =>
    setSize({ w: e.target.innerWidth, h: e.target.innerHeight });
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);

// Pattern: run once on mount, reset a third-party lib
useEffect(() => {
  const map = new mapboxgl.Map({ container: mapRef.current });
  return () => map.remove();
}, []);
```

### Interview Questions

**Q: What is the cleanup function in useEffect?**

> The function returned from `useEffect`. Runs before the **next effect execution** and on **unmount**. Prevents memory leaks by cancelling subscriptions, clearing timers, and aborting requests.

**Q: Can you use async directly in useEffect?**

> No — `useEffect`'s callback must return either a cleanup function or `undefined`. An async function returns a Promise, which React ignores (and it causes a warning). Define an async function _inside_ the effect and call it.

**Q: Why does my effect run twice in development?**

> React 18 Strict Mode intentionally double-invokes effects to surface cleanup bugs. This only happens in development. Production runs effects once. Fix by ensuring your cleanup fully undoes the setup.

---

## 3.3 useRef — Deep Dive

### Concept

`useRef` returns `{ current: initialValue }` — a **mutable object** whose changes do **not trigger re-renders**. The ref object is the same across all renders (stable reference).

### Why No Re-render?

State is stored in `fiber.memoizedState` and React schedules re-renders when it changes. Refs are a plain JS object stored in the fiber but **React never reads them during rendering**. Mutating `ref.current` is invisible to React.

```
useState change → schedules re-render ✓
ref.current change → no re-render ✓ (intentional)
```

### 4 Use Cases

```jsx
// ─── USE CASE 1: DOM element access ───────────────────────────────────────
function AutoFocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return <input ref={inputRef} />;
}

// ─── USE CASE 2: Mutable value that survives renders (no re-render needed) ─
function StopWatch() {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null); // store interval ID — no need to re-render for this

  const start = () => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stop = () => clearInterval(timerRef.current);

  return (
    <div>
      {elapsed}s <button onClick={start}>Start</button>{" "}
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// ─── USE CASE 3: Track previous render value ──────────────────────────────
function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value; // update AFTER render — captures previous value
  });
  return ref.current; // returns value from last render
}

function Component({ count }) {
  const prevCount = usePrevious(count);
  return (
    <div>
      Now: {count}, Before: {prevCount}
    </div>
  );
}

// ─── USE CASE 4: Avoid stale closures in callbacks ─────────────────────────
function SearchBox({ onSearch }) {
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }); // sync ref with latest prop

  useEffect(() => {
    // This callback never becomes stale — always calls latest onSearch
    const handler = debounce((e) => onSearchRef.current(e.target.value), 300);
    inputRef.current.addEventListener("input", handler);
    return () => inputRef.current.removeEventListener("input", handler);
  }, []); // safe to have empty deps — uses ref internally
}
```

### Callback Refs

Instead of `useRef`, pass a function as the `ref` prop — called with the DOM node when mounted:

```jsx
function MeasureDiv() {
  const [height, setHeight] = useState(0);

  // Called with element on mount, null on unmount
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return <div ref={measuredRef}>Measure me. Height: {height}px</div>;
}
```

### Tricky Interview Questions

**Q: useRef vs variable outside component?**

> Outside variable: **shared across all instances**, persists forever. `useRef`: **per instance**, cleaned up on unmount. Local variable: recreated each render, not persisted.

**Q: When would you use a ref over state?**

> When the value must not cause a re-render: timers, abort controllers, previous values, focus management, third-party library instances, or reading DOM measurements.

---

## 3.4 useMemo — Deep Dive

### Concept

`useMemo` **caches the return value** of a function between renders. Recomputes only when dependencies change.

```jsx
const result = useMemo(() => expensiveComputation(a, b), [a, b]);
```

### Internal Mechanism

React stores `[deps, cachedResult]`. On re-render: shallow-compare new deps with stored deps. If equal → return cached result. If different → call function, store new result.

### When to Use (with real benchmarks)

```jsx
// ✅ GOOD: Expensive transformation of data
const filteredAndSorted = useMemo(() => {
  return products
    .filter((p) => p.category === selectedCategory)
    .sort((a, b) => a.price - b.price);
}, [products, selectedCategory]);
// Avoids O(n log n) sort on every keystroke when other state changes

// ✅ GOOD: Derived data used as dep by another hook
const userIds = useMemo(() => users.map((u) => u.id), [users]);
useEffect(() => {
  subscribe(userIds);
}, [userIds]); // Without memo, new array ref every render → infinite loop

// ✅ GOOD: Stable object/array passed to React.memo child
const chartConfig = useMemo(
  () => ({
    colors: ["#f00", "#0f0"],
    animation: { duration: 300 },
  }),
  []
);

// ❌ BAD: Trivial computation
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
// String concatenation is ~0.001ms. Memo overhead > computation cost.

// ❌ BAD: Only used once, not passed to children
const tax = useMemo(() => price * 0.08, [price]);
// No child depends on referential stability — memo adds no value
```

### useMemo vs useEffect for Derived State

```jsx
// ❌ Using useEffect to derive state (adds extra render cycle)
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(...));
}, [items]);

// ✅ Use useMemo — synchronous, no extra render
const filtered = useMemo(() => items.filter(...), [items]);
```

---

## 3.5 useCallback — Deep Dive

### Concept

`useCallback` **caches a function reference** between renders. Returns the same function instance if dependencies haven't changed.

```jsx
const memoizedFn = useCallback(() => doSomething(a, b), [a, b]);
// Exactly equivalent to:
const memoizedFn = useMemo(() => () => doSomething(a, b), [a, b]);
```

### Why It Matters — Re-render Prevention

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // ❌ New reference on every render → Child re-renders even when count changes
  const handleSubmit = (value) => saveToServer(value);

  // ✅ Stable reference → Child only re-renders when deps change
  const handleSubmit = useCallback((value) => saveToServer(value), []);

  return (
    <>
      <input onChange={(e) => setText(e.target.value)} />
      <ExpensiveForm onSubmit={handleSubmit} /> {/* React.memo'd */}
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </>
  );
}

const ExpensiveForm = React.memo(({ onSubmit }) => {
  console.log("ExpensiveForm rendered");
  return <form onSubmit={() => onSubmit(formData)}>...</form>;
});
```

### useCallback with useEffect — Avoiding Infinite Loops

```jsx
// ❌ Infinite loop: handleFetch is new every render → useEffect re-runs
function Component({ userId }) {
  const handleFetch = async () => {
    const data = await fetch(`/api/${userId}`);
    setUser(await data.json());
  };

  useEffect(() => {
    handleFetch();
  }, [handleFetch]); // handleFetch changes every render!
}

// ✅ useCallback makes handleFetch stable
const handleFetch = useCallback(async () => {
  const data = await fetch(`/api/${userId}`);
  setUser(await data.json());
}, [userId]);

useEffect(() => {
  handleFetch();
}, [handleFetch]); // only re-runs when userId changes
```

### Mental Model: useMemo vs useCallback

```
useMemo(fn, deps)     → memoizes fn()    (the RESULT of calling fn)
useCallback(fn, deps) → memoizes fn      (fn ITSELF, not called)

useCallback(fn, deps) === useMemo(() => fn, deps)  // they are equivalent
```

---

## 3.6 React.memo — Deep Dive

### Concept

`React.memo` is a **Higher-Order Component** that wraps a component and skips re-rendering if its props haven't changed (shallow comparison).

```jsx
const MemoizedComponent = React.memo(MyComponent);
// or inline:
const MemoizedComponent = React.memo(function MyComponent({ id, name }) {
  return <div>{name}</div>;
});
```

### Shallow Comparison — What It Means

```jsx
// Primitives: compared by value ✓
{ id: 1 } === { id: 1 }      // ✓ no re-render (same primitive)

// Objects/arrays: compared by reference ✗
{ user: { id: 1 } } !== { user: { id: 1 } }   // different objects → re-render!
[1, 2, 3] !== [1, 2, 3]                         // different arrays → re-render!
```

### Custom Comparison Function

```jsx
const UserCard = React.memo(
  function UserCard({ user, onEdit }) {
    return (
      <div>
        {user.name} <button onClick={onEdit}>Edit</button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true → skip re-render
    // Return false → trigger re-render
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.updatedAt === nextProps.user.updatedAt
      // Deliberately exclude onEdit — parent re-creates it often
    );
  }
);
```

### Common Pitfalls

```jsx
// ─── PITFALL 1: Inline objects ───────────────────────────────────────────
function Parent() {
  return (
    // ❌ New object every render — React.memo useless
    <Memoized config={{ theme: "dark" }} />
  );
}
// Fix:
const config = useMemo(() => ({ theme: "dark" }), []);
return <Memoized config={config} />;

// ─── PITFALL 2: Inline functions ─────────────────────────────────────────
<Memoized onClick={() => handleClick(id)} />; // ❌ New function every render
const handleItem = useCallback(() => handleClick(id), [id]);
<Memoized onClick={handleItem} />; // ✅

// ─── PITFALL 3: Context consumers ────────────────────────────────────────
// React.memo does NOT prevent re-renders from useContext inside the component
// If context changes, the component re-renders regardless of memo
```

---

## 3.7 useReducer — Deep Dive

### Concept

`useReducer` handles **complex state logic** where the next state depends on the previous state and a discrete action. Think of it as a tiny Redux store inside a component.

```jsx
const [state, dispatch] = useReducer(reducer, initialState, initFn?);
```

### Complete Example — Shopping Cart

```jsx
const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...state.items, { ...action.payload, qty: 1 }];
      return { ...state, items, total: calcTotal(items) };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload);
      return { ...state, items, total: calcTotal(items) };
    }
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_CART":
      return initialState;
    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
}

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  async function checkout() {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await api.placeOrder(state.items);
      dispatch({ type: "CLEAR_CART" });
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: e.message });
    }
  }

  return (
    <div>
      {state.items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
        />
      ))}
      <strong>Total: ${state.total}</strong>
      <button onClick={checkout} disabled={state.loading}>
        {state.loading ? "Placing order…" : "Checkout"}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </div>
  );
}
```

### Lazy Initialization (Third Argument)

```jsx
function init(initialCount) {
  return { count: initialCount, history: [] };
}

// init() is called with initialState as its argument
const [state, dispatch] = useReducer(reducer, initialCount, init);
// Useful when init logic is expensive or needs to be reusable (e.g., for reset)
```

### useReducer with useContext — Mini Redux Pattern

```jsx
// Global state without Redux
const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  // Memoize value to prevent re-renders when state parts haven't changed
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

// Any component can read and dispatch
function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
```

### useState vs useReducer Decision Guide

| When to use `useState`               | When to use `useReducer`                  |
| ------------------------------------ | ----------------------------------------- |
| 1–2 independent state values         | 3+ related state values                   |
| Simple toggles, text input           | Complex objects with multiple sub-fields  |
| Next state not derived from previous | State transitions depend on current state |
| Quick prototyping                    | Logic needs to be tested in isolation     |
| No action tracking needed            | Debugging benefits from named actions     |

---

## 3.8 useLayoutEffect

### Concept

`useLayoutEffect` fires **synchronously after DOM mutations, before the browser paint**. The timeline:

```
Render → Commit (DOM mutations) → useLayoutEffect (sync) → Browser Paint → useEffect (async)
```

This means the user **never sees an intermediate state** — reads and writes happen before anything is displayed.

### When to Use (vs useEffect)

```jsx
// ✅ USE useLayoutEffect: read DOM geometry before paint to prevent flash
function Popover({ anchorEl, children }) {
  const popoverRef = useRef();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!popoverRef.current || !anchorEl) return;
    const anchor = anchorEl.getBoundingClientRect();
    const pop = popoverRef.current.getBoundingClientRect();

    setPos({
      top: anchor.bottom + window.scrollY,
      left: Math.max(0, anchor.left - pop.width / 2),
    });
  }, [anchorEl]);

  return (
    <div ref={popoverRef} style={{ position: "absolute", ...pos }}>
      {children}
    </div>
  );
}

// ❌ With useEffect: popover flashes at (0,0) for one frame, then jumps to correct position
```

```jsx
// ✅ USE useLayoutEffect: animate from previous position (FLIP animation)
function AnimatedItem({ id, position }) {
  const ref = useRef();
  const prevPos = useRef();

  useLayoutEffect(() => {
    if (prevPos.current) {
      const deltaY =
        prevPos.current.top - ref.current.getBoundingClientRect().top;
      ref.current.style.transform = `translateY(${deltaY}px)`;
      ref.current.style.transition = "none";
      requestAnimationFrame(() => {
        ref.current.style.transition = "transform 300ms";
        ref.current.style.transform = "";
      });
    }
    prevPos.current = ref.current.getBoundingClientRect();
  });
}
```

> **Rule of thumb:** Start with `useEffect`. Switch to `useLayoutEffect` only if you observe a visual flash.

> **SSR Warning:** `useLayoutEffect` does nothing on the server (no DOM). React warns about this. Use `useEffect` in SSR contexts, or a custom `useIsomorphicLayoutEffect` that switches between them.

```jsx
// useIsomorphicLayoutEffect — safe in SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

---

## 3.9 useContext — Deep Dive

### Concept

`useContext(MyContext)` subscribes a component to a context value. Every time the **Provider's value changes**, all consumers re-render.

```jsx
// 1. Create (outside components, module level)
const ThemeContext = createContext("light"); // default value

// 2. Provide
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// 3. Consume (anywhere in the tree)
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
      Current: {theme}
    </button>
  );
}
```

### Performance: Context Re-render Problem

```jsx
// ❌ ALL consumers re-render when ANY value in the context changes
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [cart, setCart] = useState([]);

  // Every setUser call re-renders ALL cart and theme consumers
  return (
    <AppContext.Provider
      value={{ user, setUser, theme, setTheme, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
}
```

### Solutions for Context Performance

```jsx
// ✅ Solution 1: Split contexts by update frequency
const UserContext = createContext(null); // changes rarely
const ThemeContext = createContext("light"); // changes on toggle
const CartContext = createContext([]); // changes on add/remove

// ✅ Solution 2: Separate state and dispatch (state rarely changes, dispatch never does)
const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, []);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}
// Components that only dispatch never re-render when cart state changes!

// ✅ Solution 3: Selector pattern with useMemo
function useCartItemCount() {
  const cart = useContext(CartStateContext);
  return useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
}
```

---

## 3.10 useTransition (React 18)

### Concept

`useTransition` marks a state update as **non-urgent** — React can interrupt it to keep the UI responsive. Expensive updates (filtering large lists, navigating to a slow page) won't block typing or button clicks.

```jsx
const [isPending, startTransition] = useTransition();
```

### Problem it Solves

```jsx
// ❌ Without useTransition: typing in search feels laggy
// Every keystroke re-renders a 10,000-item list synchronously
function SearchPage() {
  const [query, setQuery] = useState("");
  const results = filterItems(items, query); // expensive

  return (
    <>
      <input onChange={(e) => setQuery(e.target.value)} />
      <ResultsList items={results} />
    </>
  );
}
```

```jsx
// ✅ With useTransition: input stays responsive, list update is deferred
function SearchPage() {
  const [query, setQuery] = useState(""); // urgent: input
  const [deferredQuery, setDeferredQuery] = useState(""); // non-urgent: list
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // immediate (urgent)
    startTransition(() => {
      setDeferredQuery(e.target.value); // deferred (non-urgent)
    });
  }

  const results = filterItems(items, deferredQuery);

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList items={results} />
    </>
  );
}
```

### Route Transitions

```jsx
// Show loading state during slow route navigations
function NavLink({ to, children }) {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => startTransition(() => navigate(to))}
      aria-busy={isPending}>
      {children}
      {isPending && "…"}
    </button>
  );
}
```

### useTransition vs setTimeout

|                         | `useTransition`              | `setTimeout`               |
| ----------------------- | ---------------------------- | -------------------------- |
| Interruptible           | ✅ Yes (React 18 Concurrent) | ❌ No                      |
| Knows about React state | ✅ Yes                       | ❌ No                      |
| Delays visible feedback | ❌ No                        | ✅ Yes (intentional delay) |
| `isPending` flag        | ✅ Yes                       | ❌ Manual                  |

---

## 3.11 useDeferredValue (React 18)

### Concept

`useDeferredValue` defers **updating a value** until higher-priority updates (user interactions) have been processed. It's the "value" equivalent of `useTransition` (which wraps state updates).

```jsx
const deferredValue = useDeferredValue(value);
```

### When to Use

Use `useDeferredValue` when you **can't wrap the state update** in `startTransition` (e.g., value comes from props or an external library):

```jsx
// ✅ Value comes from a prop you don't control
function SearchResults({ query }) {
  // query comes from parent
  const deferredQuery = useDeferredValue(query);

  // Expensive — uses deferred (possibly stale) query
  const results = useMemo(
    () => filterItems(allItems, deferredQuery),
    [deferredQuery]
  );

  const isStale = query !== deferredQuery; // show when results are outdated

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      {results.map((r) => (
        <ResultItem key={r.id} item={r} />
      ))}
    </div>
  );
}
```

### useTransition vs useDeferredValue

|                  | `useTransition`          | `useDeferredValue`                 |
| ---------------- | ------------------------ | ---------------------------------- |
| Wraps            | A state **update**       | A **value**                        |
| Control location | Where you call setState  | Where you consume the value        |
| Use when         | You own the state setter | Value comes from props/external    |
| Both expose      | `isPending`              | Staleness via `value !== deferred` |

---

## 3.12 useId (React 18)

### Concept

`useId` generates a **stable, unique ID** that is consistent between server and client (hydration-safe). Use for linking form inputs to labels, ARIA attributes, etc.

```jsx
const id = useId(); // e.g., ":r0:", ":r1:", ":r2:"
```

### Why Not `Math.random()` or Incrementing Counter?

```jsx
// ❌ Different between server and client → hydration mismatch
const id = Math.random();
const id = ++globalCounter;

// ✅ useId is deterministic — same on server and client
function EmailField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}

// ✅ One useId, multiple related IDs
function ComboBox() {
  const id = useId();
  return (
    <div>
      <label htmlFor={`${id}-input`}>Country</label>
      <input
        id={`${id}-input`}
        aria-controls={`${id}-listbox`}
        aria-labelledby={`${id}-label`}
      />
      <ul id={`${id}-listbox`} role="listbox">
        ...
      </ul>
    </div>
  );
}
```

---

## 3.13 useSyncExternalStore (React 18)

### Concept

`useSyncExternalStore` subscribes to **external stores** (non-React state: Redux, Zustand, browser APIs like `localStorage`, `window.matchMedia`) in a way that is **concurrent-mode safe**.

```jsx
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

### Why It Exists

React 18's concurrent rendering can render a component multiple times before committing. If you read external state with `useEffect` + `useState`, you can get **tearing** — different components seeing different values of the same external store in one render pass. `useSyncExternalStore` prevents this.

### Examples

```jsx
// ✅ Subscribe to window online/offline status
function useOnlineStatus() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("online", onChange);
      window.addEventListener("offline", onChange);
      return () => {
        window.removeEventListener("online", onChange);
        window.removeEventListener("offline", onChange);
      };
    },
    () => navigator.onLine, // client snapshot
    () => true // server snapshot (assume online)
  );
}

function NetworkBadge() {
  const isOnline = useOnlineStatus();
  return <span>{isOnline ? "🟢 Online" : "🔴 Offline"}</span>;
}

// ✅ Subscribe to window dimensions
function useWindowSize() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    },
    () => ({ width: window.innerWidth, height: window.innerHeight }),
    () => ({ width: 0, height: 0 })
  );
}

// ✅ Custom external store (without Redux/Zustand)
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    setState: (fn) => {
      state = fn(state);
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const counterStore = createStore({ count: 0 });

function Counter() {
  const { count } = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getState
  );
  return (
    <div>
      {count}
      <button
        onClick={() => counterStore.setState((s) => ({ count: s.count + 1 }))}>
        +
      </button>
    </div>
  );
}
```

---

## 3.14 useImperativeHandle

### Concept

`useImperativeHandle` customizes the **ref handle** exposed to parent components when using `forwardRef`. Instead of exposing the raw DOM node, expose only the methods you want.

```jsx
useImperativeHandle(ref, () => ({ method1, method2 }), [deps]);
```

### Pattern

```jsx
// Child exposes a custom API via ref
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
  const videoRef = useRef(null);

  // Expose only play/pause/seek — NOT the entire DOM node
  useImperativeHandle(
    ref,
    () => ({
      play: () => videoRef.current.play(),
      pause: () => videoRef.current.pause(),
      seek: (time) => {
        videoRef.current.currentTime = time;
      },
      getDuration: () => videoRef.current.duration,
    }),
    []
  );

  return <video ref={videoRef} src={src} />;
});

// Parent uses the exposed API
function MoviePage() {
  const playerRef = useRef(null);

  return (
    <>
      <VideoPlayer ref={playerRef} src="/movie.mp4" />
      <button onClick={() => playerRef.current.play()}>Play</button>
      <button onClick={() => playerRef.current.pause()}>Pause</button>
      <button onClick={() => playerRef.current.seek(120)}>Skip to 2min</button>
    </>
  );
}
```

### forwardRef Pattern

```jsx
// forwardRef allows passing ref through a component
const Input = forwardRef(function Input({ label, ...props }, ref) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...props} />
    </div>
  );
});

// Parent accesses the DOM input directly
const inputRef = useRef(null);
<Input ref={inputRef} label="Name" />;
inputRef.current.focus(); // works!
```

---

## 3.15 useDebugValue

### Concept

`useDebugValue` adds a **label** to a custom hook in React DevTools. Purely a DX improvement — no runtime behavior.

```jsx
function useFriendStatus(friendId) {
  const [isOnline, setIsOnline] = useState(false);

  // Label shown in DevTools: "FriendStatus: Online" or "FriendStatus: Offline"
  useDebugValue(isOnline ? "Online" : "Offline");

  // Or with a formatter (only called when DevTools panel is open)
  useDebugValue(lastSeen, (date) => `Last seen: ${date.toLocaleDateString()}`);

  useEffect(() => {
    // subscribe to friend status...
  }, [friendId]);

  return isOnline;
}
```

> Only add `useDebugValue` in custom hooks that are part of a shared library. Not needed for app-specific hooks.

---

## 3.16 Custom Hooks — Advanced Patterns

### Rule: What Makes a Custom Hook

1. Name starts with `use`
2. Can call other hooks inside it
3. Each component calling the hook gets **isolated state** (hooks share logic, not state)

### Production-Grade Custom Hook Examples

```jsx
// ─── useFetch: AbortController + race condition safe ──────────────────────
function useFetch(url) {
  const [state, dispatch] = useReducer((s, a) => ({ ...s, ...a }), {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    dispatch({ loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => dispatch({ data, loading: false }))
      .catch((err) => {
        if (err.name !== "AbortError")
          dispatch({ error: err.message, loading: false });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// ─── useDebounce: debounce any value ──────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// ─── useLocalStorage: sync state with localStorage ────────────────────────
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (v) => {
      const toStore = v instanceof Function ? v(value) : v;
      setValue(toStore);
      try {
        localStorage.setItem(key, JSON.stringify(toStore));
      } catch {}
    },
    [key, value]
  );

  return [value, set];
}

// ─── useEventListener: attach/detach DOM events ───────────────────────────
function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef(handler);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element?.addEventListener) return;
    const listener = (e) => savedHandler.current(e);
    element.addEventListener(eventName, listener);
    return () => element.removeEventListener(eventName, listener);
  }, [eventName, element]);
}

// ─── useIntersectionObserver: lazy loading / infinite scroll ──────────────
function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []); // options deliberately excluded — treat as stable

  return [ref, isIntersecting];
}

// Usage:
function LazyImage({ src }) {
  const [ref, isVisible] = useIntersectionObserver();
  return <img ref={ref} src={isVisible ? src : undefined} alt="" />;
}

// ─── useForm: controlled form state ───────────────────────────────────────
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((t) => ({ ...t, [name]: true }));
      if (validate) setErrors(validate(values));
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    (onSubmit) => (e) => {
      e.preventDefault();
      const errs = validate ? validate(values) : {};
      setErrors(errs);
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
      if (Object.keys(errs).length === 0) onSubmit(values);
    },
    [values, validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}
```

### Interview Questions

**Q: What makes a function a custom hook?**

> Name starts with `use` + can call other hooks. The `use` prefix signals to React and linters to enforce hook rules on it.

**Q: Can custom hooks share state between components?**

> No. Each component gets its own isolated state. Custom hooks share **logic** (the code pattern), not state. To share state, use Context, Redux, or Zustand.

**Q: What's the difference between a custom hook and a utility function?**

> A utility function is a plain function — no hooks inside, no reactivity. A custom hook can call `useState`, `useEffect`, etc. — it's reactive and tied to the component lifecycle. Both can be extracted and reused, but only custom hooks can manage React state.

---

## 3.17 Hooks Rules & Common Mistakes

### The Two Rules of Hooks

1. **Only call hooks at the top level** — not inside conditions, loops, or nested functions.
2. **Only call hooks from React components or custom hooks** — not from plain JS functions.

```jsx
// ❌ RULE 1 VIOLATION: conditional hook
function BadComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [data, setData] = useState(null); // different hook count per render!
  }
  // Fix: always call the hook, guard inside
}

// ✅ CORRECT
function GoodComponent({ isLoggedIn }) {
  const [data, setData] = useState(null);
  if (!isLoggedIn) return null; // early return is fine AFTER hooks
}

// ❌ RULE 2 VIOLATION: hook in plain function
function fetchData(url) {
  const [data, setData] = useState(null); // not a component or custom hook!
}
```

### Stale Closure — The Most Common Bug

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ❌ count is captured at 0 and never updates (stale closure)
    const id = setInterval(() => {
      setCount(count + 1);  // always sets to 1
    }, 1000);
    return () => clearInterval(id);
  }, []);  // count is missing from deps

  // Fix 1: use functional update
  setCount((c) => c + 1);  // no dependency on count needed

  // Fix 2: add count to deps (clears/recreates interval each render)
  }, [count]);

  // Fix 3: use a ref
  const countRef = useRef(count);
  countRef.current = count;
  setInterval(() => setCount(countRef.current + 1), 1000);
}
```

### Complete Hooks Cheat Sheet

| Hook                   | Purpose                     | Triggers Re-render        |
| ---------------------- | --------------------------- | ------------------------- |
| `useState`             | Local reactive state        | ✅ Yes                    |
| `useReducer`           | Complex state with actions  | ✅ Yes                    |
| `useEffect`            | Side effects after render   | ❌ No (unless sets state) |
| `useLayoutEffect`      | Sync DOM reads before paint | ❌ No (unless sets state) |
| `useRef`               | Mutable value / DOM ref     | ❌ No                     |
| `useMemo`              | Cache computed value        | ❌ No                     |
| `useCallback`          | Cache function reference    | ❌ No                     |
| `useContext`           | Subscribe to context        | ✅ Yes (on value change)  |
| `useTransition`        | Mark update as non-urgent   | ✅ Yes (`isPending`)      |
| `useDeferredValue`     | Defer a value update        | ❌ No (defers re-render)  |
| `useId`                | Stable unique ID            | ❌ No                     |
| `useSyncExternalStore` | External store subscription | ✅ Yes                    |
| `useImperativeHandle`  | Customize exposed ref       | ❌ No                     |
| `useDebugValue`        | DevTools label              | ❌ No                     |

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

{% endraw %}
