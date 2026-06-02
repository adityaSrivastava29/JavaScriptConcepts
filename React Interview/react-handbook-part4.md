# 🚀 Senior Frontend Engineer / React Developer Interview Handbook
## Part 4: Sections 16–20 | NPM → Q&A → Mental Models → Checklist → FAANG Deep Dive

---

# SECTION 16: NPM Package Development

---

## 16.1 How npm Install Works Internally

```
npm install <package>
        │
        ▼
1. Check package.json for package name + version range
        │
        ▼
2. Query npm registry (registry.npmjs.org)
   → Returns package metadata (versions, dependencies, dist tarball URL)
        │
        ▼
3. Resolve dependency tree
   → Check package-lock.json for locked versions
   → Resolve peer/dev/production deps
        │
        ▼
4. Download tarballs (.tgz) to npm cache (~/.npm)
        │
        ▼
5. Extract to node_modules/
        │
        ▼
6. Run lifecycle scripts (preinstall, install, postinstall)
        │
        ▼
7. Update package-lock.json
```

### package.json vs package-lock.json

| | package.json | package-lock.json |
|---|---|---|
| Written by | Developer | npm (auto-generated) |
| Versions | Ranges (`^1.2.3`, `~1.2.3`) | Exact versions |
| Committed | Yes | Yes |
| Purpose | Declare intent | Lock exact dependency tree |
| npm install with lock | Uses lock versions | — |
| npm update | Updates within ranges, regenerates lock | — |

### Dependency Types

```json
{
  "dependencies": {
    "react": "^18.0.0"       // needed at runtime in production
  },
  "devDependencies": {
    "jest": "^29.0.0"        // only needed during development/build
  },
  "peerDependencies": {
    "react": ">=16.8.0"      // consumer must provide this — not installed by npm
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  },
  "optionalDependencies": {
    "fsevents": "^2.3.2"     // install if possible, ok if fails
  }
}
```

**When to use peerDependencies:** For library packages (React components, plugins). You don't bundle React into your library — the consuming app provides it. This avoids multiple React instances.

---

## 16.2 Semantic Versioning

```
    1    .    2    .    3    -    beta.1
    │         │         │         │
  MAJOR     MINOR     PATCH    Pre-release
    │         │         │
  Breaking  New feat  Bug fix
  changes   (backward  (backward
            compat)    compat)

npm version ranges:
  ^1.2.3 → >=1.2.3 <2.0.0 (compatible changes: minor + patch)
  ~1.2.3 → >=1.2.3 <1.3.0 (patch releases only)
  1.2.3  → exactly 1.2.3
  *      → any version (dangerous!)
  >=1.2.3 <2.0.0 → explicit range
```

---

## 16.3 Create an NPM Package — Complete Guide

### Step 1: Initialize

```bash
mkdir my-react-hooks
cd my-react-hooks
npm init -y
git init
```

### Step 2: Package Structure

```
my-react-hooks/
├── src/
│   ├── index.ts          # main entry, exports everything
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useIntersection.ts
├── dist/                  # built output (gitignored)
│   ├── index.js          # CommonJS
│   ├── index.mjs         # ES Module
│   └── index.d.ts        # TypeScript declarations
├── tests/
│   └── useDebounce.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts         # or rollup.config.js
├── .npmignore
└── README.md
```

### Step 3: package.json

```json
{
  "name": "@myorg/react-hooks",
  "version": "1.0.0",
  "description": "Reusable React hooks",
  "main": "./dist/index.js",          // CommonJS entry (require)
  "module": "./dist/index.mjs",       // ESM entry (import)  
  "types": "./dist/index.d.ts",       // TypeScript types
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],                   // only these files in npm package
  "sideEffects": false,                // enables tree shaking
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "prepublishOnly": "npm run build && npm test"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "devDependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vitest": "^1.0.0"
  },
  "keywords": ["react", "hooks", "typescript"],
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/myorg/react-hooks" }
}
```

### Step 4: Vite Library Mode

```js
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }),  // generates .d.ts files
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactHooks',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      // Externalize peer dependencies — don't bundle them!
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
```

### Step 5: Source Code

```ts
// src/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Debounces a value by the specified delay.
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// src/index.ts
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useIntersection } from './useIntersection';
```

### Step 6: .npmignore

```
src/
tests/
*.config.ts
*.config.js
.github/
node_modules/
coverage/
```

### Step 7: Publish

```bash
# Login
npm login

# Dry run — see what will be published
npm pack --dry-run

# Publish to npm registry
npm publish --access public

# For scoped packages:
npm publish --access public  # public scoped
npm publish                  # private scoped (paid npm account)

# Update version (automatically commits and tags)
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
npm publish
```

### GitHub Packages (Private Registry)

```bash
# .npmrc in project root
@myorg:registry=https://npm.pkg.github.com

# Authenticate
npm login --registry=https://npm.pkg.github.com

# package.json — name must be scoped with org
{
  "name": "@myorg/react-hooks",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

---

## 16.4 Package Security

```bash
# Audit for known vulnerabilities
npm audit
npm audit fix           # auto-fix
npm audit fix --force   # ⚠️ may include breaking changes

# Check what's in your package before publishing
npm pack

# Verify package integrity
npm install --ignore-scripts  # don't run install scripts (safer in CI)
```

---

# SECTION 17: Frequently Asked React Interview Questions

---

## Top 100 React Interview Questions

### Fundamentals (1–25)

1. What is React and why was it created?
2. What is the Virtual DOM? How is it different from Real DOM?
3. What is JSX? What does it compile to?
4. What is the difference between a React element and a React component?
5. What is reconciliation? Explain the diffing algorithm.
6. What is the significance of `key` prop in lists?
7. Why should you not use array index as `key`?
8. What is `React.Fragment` and when do you use it?
9. What is the difference between controlled and uncontrolled components?
10. What are React lifecycle methods? Map them to hooks.
11. What is the difference between `props` and `state`?
12. What is prop drilling? How do you avoid it?
13. What is `children` prop?
14. What is `defaultProps`? How to provide defaults in functional components?
15. What is `PropTypes`? How does TypeScript replace it?
16. What are synthetic events in React?
17. What is event delegation in React?
18. What is the difference between `onClick={() => fn()}` and `onClick={fn}`?
19. What is React.StrictMode? What does it do?
20. What is a pure component?
21. What is a Higher-Order Component (HOC)?
22. What are render props?
23. What is the Context API?
24. What is `React.memo`? When should you use it?
25. What is the difference between `React.Component` and `React.PureComponent`?

### Hooks (26–50)

26. What are React Hooks? Why were they introduced?
27. What are the Rules of Hooks?
28. What is `useState`? How does it work internally?
29. What is the difference between `useState` and `useReducer`?
30. What is `useEffect`? How does it replace lifecycle methods?
31. What is the cleanup function in `useEffect`?
32. What happens if you don't provide a dependency array to `useEffect`?
33. Can `useEffect` be async? How to handle async in `useEffect`?
34. What is `useRef`? Why doesn't it cause re-renders?
35. What is the difference between `useRef` and `createRef`?
36. What is `useMemo`? When should you use it?
37. What is `useCallback`? When should you use it?
38. What is the difference between `useMemo` and `useCallback`?
39. What is `useContext`? What are its performance implications?
40. What is `useReducer`? When to prefer it over `useState`?
41. What is `useLayoutEffect`? How is it different from `useEffect`?
42. What is `useImperativeHandle`? What is `forwardRef`?
43. What is `useId`? (React 18)
44. What is `useDeferredValue`? (React 18)
45. What is `useTransition`? (React 18)
46. What is `useSyncExternalStore`? (React 18)
47. What is `useInsertionEffect`? (React 18)
48. How do you create a custom hook? What are the rules?
49. Can custom hooks share state between components?
50. What is `useDebugValue`?

### Performance (51–65)

51. Why does a React component re-render?
52. How to prevent unnecessary re-renders?
53. What is code splitting? How to implement it in React?
54. What is `React.lazy`? How does it work with `Suspense`?
55. What is lazy loading? How is it different from code splitting?
56. What is virtualization / windowing? Name React libraries for it.
57. What is tree shaking? How to ensure your code is tree-shakeable?
58. How to optimize large lists in React?
59. How does `useMemo` hurt performance?
60. What is debounce? What is throttle? Difference?
61. What is the React DevTools Profiler?
62. What are Web Vitals? Name the core ones.
63. What is bundle analysis? How do you do it?
64. How to prefetch routes / data in React?
65. What is stale-while-revalidate?

### Advanced/Architecture (66–85)

66. What is Fiber Architecture? Why was it introduced?
67. What is the Render Phase vs Commit Phase?
68. What is Concurrent Mode / Concurrent Rendering?
69. What is time slicing in React?
70. What are Lanes in React 18?
71. What is automatic batching in React 18?
72. What is the double buffering in Fiber?
73. What is `flushSync`?
74. What is Suspense? How does it work internally?
75. What are Server Components? How are they different from SSR?
76. What is hydration? What is partial hydration?
77. What is SSR? SSG? ISR? CSR? Differences?
78. What is the React Compiler (React Forget)?
79. What are new features in React 19?
80. What is `startTransition`?
81. What is the Scheduler package in React?
82. What is `$$typeof` on a React element?
83. What is the StrictMode double-invoke behavior?
84. What happens when you call `setState` in the render phase?
85. What is `getDerivedStateFromProps`? When to use it?

### State Management (86–95)

86. When should you use external state management?
87. What is Redux? How does it work?
88. What is Redux Toolkit? How does it improve Redux?
89. What is Immer? How does RTK use it?
90. What is Zustand? How is it different from Redux?
91. Context API vs Redux — when to use which?
92. What is client state vs server state?
93. What is React Query? What problems does it solve?
94. What is optimistic update? How to implement it in React Query?
95. What is Jotai/Recoil atomic state management?

### Ecosystem (96–100)

96. What is React Router? What's new in v6?
97. What is the difference between `BrowserRouter` and `HashRouter`?
98. What is Next.js? How does it extend React?
99. What is Vite? How is it different from webpack?
100. What is TypeScript? How does it benefit React development?

---

## Top 30 React Performance Questions

1. What causes unnecessary re-renders? How to diagnose?
2. How does React.memo work? When is it not useful?
3. When does `useCallback` NOT improve performance?
4. What is the wrong way to use `useMemo`?
5. How to optimize Context to prevent wide re-renders?
6. What is virtualization? When must you use it?
7. How does `React.lazy` + `Suspense` improve performance?
8. What is the performance impact of inline functions in JSX?
9. How to reduce time-to-interactive?
10. What is First Contentful Paint (FCP)?
11. What is Largest Contentful Paint (LCP)? How to improve it?
12. What is Cumulative Layout Shift (CLS)?
13. What is Interaction to Next Paint (INP)?
14. How does code splitting affect performance metrics?
15. What is prefetching vs lazy loading?
16. How to profile React apps for performance bottlenecks?
17. What is the impact of Context on performance?
18. How does automatic batching in React 18 improve performance?
19. What is `useDeferredValue`? When to use over `useTransition`?
20. What is the waterfall problem in data fetching?
21. How does `Suspense` help with data fetching waterfalls?
22. What are Web Workers? How to use with React?
23. What is service worker caching for React apps?
24. How to handle high-frequency events (scroll, resize) in React?
25. What is `requestAnimationFrame` and when to use in React?
26. How to reduce bundle size?
27. What is tree shaking? How to verify it's working?
28. What is dynamic import()? How is it different from React.lazy?
29. How does image optimization affect performance?
30. How to implement infinite scroll without performance degradation?

---

## Top 30 React System Design Questions

1. Design a real-time collaborative document editor (Google Docs).
2. Design Instagram's news feed.
3. Design a real-time chat application.
4. Design an e-commerce product listing page.
5. Design a dashboard with real-time analytics.
6. Design a file upload component with progress.
7. Design an infinite scroll news feed.
8. Design a multi-step checkout flow.
9. Design a type-ahead search component.
10. Design a video streaming player component.
11. How to design a component library?
12. How to structure a large React application?
13. How to implement multi-tenancy in a React app?
14. How to design an offline-first React app?
15. Design a notification system.
16. How to implement dark/light theme switching?
17. Design a drag-and-drop interface.
18. How to handle global error handling in React?
19. Design a permission/role-based access control system.
20. How would you scale a React app to support 10 teams?
21. What is micro frontend architecture? When to use it?
22. How to implement feature flags in React?
23. Design a rich text editor component.
24. How to design a table component that handles 1M rows?
25. Design a calendar/scheduling component.
26. How to implement optimistic updates?
27. Design a form builder with dynamic fields.
28. How to design a React app for SEO?
29. Design the frontend architecture for a SaaS dashboard.
30. How to handle authentication state across multiple tabs?

---

## Top 30 React Hooks Questions

1. Why were hooks introduced?
2. What are the rules of hooks and why?
3. What is the internal data structure behind hooks?
4. Why does useState use a linked list?
5. What is closure stale state? How `useCallback` can cause it?
6. When does `useEffect` cleanup run?
7. Why does `useEffect` run twice in development (Strict Mode)?
8. When to use `useLayoutEffect` over `useEffect`?
9. What is the difference between `useRef` and a closure variable?
10. How does `useMemo` cache comparison work?
11. What is `useReducer` dispatch function stability?
12. How does `useContext` subscription work?
13. What is `useImperativeHandle`? Real-world use case?
14. What are the limitations of `useCallback`?
15. How to implement `useWhyDidYouUpdate` for debugging?
16. How to handle race conditions in `useEffect`?
17. How to implement `usePrevious`?
18. How to implement `useAsync` / `useFetch`?
19. What is `useId` used for? (React 18)
20. What is the difference between `useTransition` and `useDeferredValue`?
21. How to test custom hooks with `renderHook`?
22. Can you call hooks conditionally? How to work around it?
23. What is `useSyncExternalStore`? Why was it created?
24. How to share logic between hooks without sharing state?
25. What is a hook factory pattern?
26. How to implement infinite scroll with a hook?
27. How to implement form state with hooks?
28. What is `useOptimistic`? (React 19)
29. What is `useFormStatus`? (React 19)
30. How to implement `useMachineState` (XState + hooks)?

---

## Top 30 Production Debugging Questions

1. How to diagnose why a component re-renders too often?
2. How to find memory leaks in a React app?
3. How to debug a white screen of death in production?
4. How to debug a broken infinite scroll?
5. Component renders correctly in dev but not production — why?
6. How to debug stale closure issues?
7. How to debug WebSocket disconnections in React?
8. How to reproduce and fix a race condition in useEffect?
9. How to debug performance regressions?
10. How to use React DevTools to find the slowest components?
11. What is source mapping? How to use in production debugging?
12. How to implement error boundaries effectively?
13. How to set up error tracking (Sentry) in React?
14. How to debug CORS errors in a React app?
15. `useEffect` runs more than expected — how to debug?
16. How to debug when state is reset unexpectedly?
17. `key` prop causing unexpected unmount — how to diagnose?
18. How to debug layout shift (CLS) in React?
19. How to debug slow initial load?
20. How to identify which npm package increased bundle size?
21. How to debug hydration mismatch errors in SSR?
22. How to debug context value not updating?
23. How to trace a React query cache miss?
24. How to debug flaky E2E tests?
25. How to reproduce a production bug locally?
26. How to debug API request waterfalls?
27. How to monitor frontend performance in production?
28. How to debug React Router navigation issues?
29. Event handler called multiple times — how to debug?
30. How to debug a micro frontend communication failure?

---

# SECTION 18: React Mental Models

---

## 18.1 React as a Pure Function: UI = f(state)

```
UI = f(state)

Your component is a pure function.
Given the same state, it always produces the same UI.

function UserCard(state) {
  return <div>{state.name}</div>;
}

// React's job: call f(state) when state changes, update DOM to match.
```

**Implication:** You never imperatively update the DOM. You update state, React figures out the DOM. This is the fundamental mental shift from jQuery.

---

## 18.2 React as a Spreadsheet

Think of React state like a spreadsheet:

```
A1 (firstName) = "Alice"
A2 (lastName)  = "Smith"
A3 (fullName)  = A1 + " " + A2   ← computed, updates automatically

In React:
const [firstName] = useState('Alice');
const [lastName]  = useState('Smith');
const fullName    = `${firstName} ${lastName}`;  // "derived" - no state needed
```

**Mental model:** Don't duplicate derived state. Just like you don't store `fullName` in a spreadsheet cell if it's computed from other cells.

---

## 18.3 React Rendering Mental Model (Snapshots)

Each render is a **snapshot in time**:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // This click handler "closes over" the count from THIS render
  function handleClick() {
    setTimeout(() => {
      // This 'count' is FROZEN at the value when this render happened
      alert(count);
    }, 3000);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

If you click, then immediately click again twice, the first alert shows the count from when it was clicked, not the latest count. **Each render has its own props, state, and event handlers.**

```
Render 1: count=0, handleClick captures count=0
Render 2: count=1, handleClick captures count=1
Render 3: count=2, handleClick captures count=2

These are 3 separate closures, like 3 separate photos.
```

---

## 18.4 State as a Queue

```
// Initial state: 0

setCount(count + 1);  // Enqueue: replace with 0+1
setCount(count + 1);  // Enqueue: replace with 0+1 (stale! same count=0)
setCount(count + 1);  // Enqueue: replace with 0+1

// Final result: 1 (not 3!)

// With functional updates:
setCount(c => c + 1);  // Enqueue: add 1 to whatever it is
setCount(c => c + 1);  // Enqueue: add 1 to whatever it is
setCount(c => c + 1);  // Enqueue: add 1 to whatever it is

// Final result: 3 ✅
```

**Mental model:** `setState(value)` says "replace with this value at the next render." `setState(fn)` says "apply this transformation to the queued value."

---

## 18.5 Reconciliation Mental Model (The Tree Diff)

```
Old Tree:          New Tree:
   App               App
   │                 │
   div               div
   ├─ h1             ├─ h1 (same type → update props)
   ├─ List           └─ Table (different type → DESTROY List, CREATE Table!)
   │   ├─ Item[0]
   │   ├─ Item[1]
   │   └─ Item[2]

Rule: Different type = fresh start.
      Same type = update existing node.
      Keys = stable identity for list items.
```

**Practical implication:** Don't define components inside other components' render:

```jsx
// ❌ InputField is recreated every render of Form
function Form() {
  function InputField({ label }) {
    const [value, setValue] = useState('');
    return <input value={value} onChange={e => setValue(e.target.value)} />;
  }
  return <InputField label="Name" />;
}
// React sees a NEW component type each render → unmounts + remounts InputField
// State is lost on every Form re-render!

// ✅ Define outside
function InputField({ label }) {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
function Form() {
  return <InputField label="Name" />;
}
```

---

## 18.6 Memoization Mental Model

```
Without memo:
Parent renders → Child ALWAYS renders
Cost: Parent render time + Child render time

With React.memo:
Parent renders → React asks "did Child's props change?"
  Yes (by reference) → Child renders
  No  (same reference) → Child SKIPS render
Cost: Parent render time + shallow prop comparison

With useMemo/useCallback:
Parent renders → "did this value/function's deps change?"
  Yes → recompute
  No  → return cached value
Cost: Parent render time + dep comparison (smaller than recompute)
```

**When memo is worth it:**
- Child render is expensive (big component tree, complex computations)
- Parent re-renders frequently
- Props are referentially stable (objects/functions memoized)

---

## 18.7 Effects Mental Model (Synchronization)

```
Wrong mental model: "This runs when X changes."
Correct mental model: "This synchronizes an external system with React's state."

useEffect(() => {
  // synchronize: subscribe to external data source
  const sub = chatAPI.subscribe(roomId, handler);

  // cleanup: undo the synchronization
  return () => chatAPI.unsubscribe(sub);
}, [roomId]); // re-synchronize whenever roomId changes
```

**Practical rule:** If you can't write a cleanup function, your effect is probably not a synchronization — it might be an event handler.

```jsx
// ❌ Wrong use of effect for one-time event response
useEffect(() => {
  if (submitted) {
    api.submitForm(data); // side effect from user action
  }
}, [submitted, data]);

// ✅ Put in event handler
function handleSubmit() {
  api.submitForm(data);
  setSubmitted(true);
}
```

---

# SECTION 19: Production React Checklist

---

## Performance Checklist

```markdown
## Performance
- [ ] Core Web Vitals measured (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Lighthouse score ≥ 90 for Performance
- [ ] Code splitting implemented (route-based at minimum)
- [ ] Images: WebP format, lazy loading, proper sizes attribute, CDN
- [ ] Fonts: preload critical fonts, font-display: swap
- [ ] Bundle analyzed: no duplicate packages, no unexpectedly large deps
- [ ] Lists with >50 items: virtualization implemented
- [ ] Memoization used correctly (React.memo, useMemo, useCallback)
- [ ] No inline function/object creation in JSX for memoized components
- [ ] useTransition used for non-urgent state updates
- [ ] API calls debounced/throttled where appropriate
- [ ] React Query or SWR for server state (caching, dedup, background refresh)
```

## Security Checklist

```markdown
## Security
- [ ] No dangerouslySetInnerHTML without DOMPurify sanitization
- [ ] All external URLs validated for safe scheme (http/https only)
- [ ] JWT stored in memory (not localStorage)
- [ ] Refresh token in HttpOnly, Secure, SameSite=Strict cookie
- [ ] CSRF token included in all mutating requests
- [ ] CSP headers configured
- [ ] npm audit clean (no high/critical vulnerabilities)
- [ ] No secrets in frontend code or environment variables committed to git
- [ ] rel="noopener noreferrer" on all external links
- [ ] X-Frame-Options: DENY header set
```

## Accessibility Checklist

```markdown
## Accessibility
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] All form inputs have associated labels
- [ ] Images have meaningful alt text (empty alt for decorative)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus management: visible focus ring, logical tab order
- [ ] Keyboard navigation works without mouse
- [ ] ARIA roles used correctly (not over-engineered)
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Error messages associated with form fields via aria-describedby
- [ ] Dynamic content announced via aria-live regions
```

## SEO Checklist

```markdown
## SEO
- [ ] SSR or SSG for public-facing pages (not CSR)
- [ ] Meaningful <title> per page (React Helmet / Next.js Head)
- [ ] Meta description per page
- [ ] Open Graph tags for social sharing
- [ ] Structured data (JSON-LD) for key page types
- [ ] Canonical URLs set
- [ ] sitemap.xml generated and submitted
- [ ] robots.txt configured correctly
- [ ] Core Web Vitals optimized (Google ranking factor)
```

## Testing Checklist

```markdown
## Testing
- [ ] Unit tests for all utility functions
- [ ] Component tests for all critical UI components
- [ ] Integration tests for key user flows
- [ ] E2E tests for top 5 critical paths
- [ ] Test coverage > 70% on business logic
- [ ] Tests run in CI on every PR
- [ ] No tests disabled with `.skip` or `xit` without reason
- [ ] MSW set up for API mocking in tests
- [ ] Snapshot tests used sparingly (only for stable UI)
```

## Deployment Checklist

```markdown
## Deployment
- [ ] CI/CD pipeline runs tests before deploy
- [ ] Environment variables managed securely (secrets manager)
- [ ] Build artifacts versioned (content hashes)
- [ ] CDN configured for static assets
- [ ] Cache headers: 1yr for hashed assets, no-cache for index.html
- [ ] HTTPS enforced with valid certificate
- [ ] Rollback strategy defined
- [ ] Blue/green or canary deployment for zero-downtime
- [ ] Smoke tests after deployment
```

## Monitoring Checklist

```markdown
## Monitoring & Observability
- [ ] Error tracking configured (Sentry / Datadog RUM)
- [ ] Performance monitoring (Datadog / New Relic / web-vitals library)
- [ ] Real User Monitoring (RUM) for production performance
- [ ] Custom events tracked for business metrics
- [ ] Alerts configured for error rate spikes
- [ ] Source maps uploaded to error tracking service
- [ ] Feature flags in place for gradual rollouts
- [ ] Log aggregation for API errors
```

---

# SECTION 20: FAANG-Level Deep Dive

---

## 20.1 React Fiber Internals — Staff Engineer Level

### The Work Loop

React's work loop is the core of the Fiber architecture:

```js
// Simplified work loop (packages/react-reconciler/src/ReactFiberWorkLoop.js)

function workLoop(shouldYield) {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber) {
  // 1. Begin work: process the fiber
  const next = beginWork(fiber.alternate, fiber, renderLanes);

  fiber.memoizedProps = fiber.pendingProps;

  if (next === null) {
    // No children: complete this fiber
    completeUnitOfWork(fiber);
  }

  return next; // return child to process next
}
```

### beginWork — What Happens

```
beginWork(current, workInProgress, renderLanes):
  Based on workInProgress.tag:
  
  FunctionComponent → renderWithHooks()
    → calls your function component
    → processes hooks (useState, useEffect, etc.)
    → returns React elements
    → reconcileChildren() to build child fibers
    
  ClassComponent → constructClassInstance() → mountClassInstance()
    → calls render()
    
  HostComponent → processUpdateQueue()
    → creates DOM element (during mount)
    → diffs props (during update)
```

### completeWork — Building the DOM

```
completeWork(fiber):
  For HostComponent (div, span, etc.):
    Mount: createDOMElement() → appendAllChildren()
    Update: updateProperties() (diff and create update payload)
    
  Bubbles up effects to parent fiber's effectList
```

---

## 20.2 Concurrent Features — Internals

### How startTransition Works

```js
// Simplified implementation concept
function startTransition(scope) {
  const prevTransition = ReactCurrentBatchConfig.transition;
  
  // Mark: we're in a transition
  ReactCurrentBatchConfig.transition = {};
  
  try {
    scope(); // run your state updates
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}

// During dispatch:
// If transition is set → assign TransitionLane (low priority)
// If not → assign DefaultLane (normal priority)
```

### How Suspense Works Internally

```
Component throws a Promise during render:
        │
        ▼
React catches the throw (try/catch in renderer)
        │
        ▼
Looks up the component tree for nearest <Suspense> boundary
        │
        ▼
Shows fallback UI
        │
        ▼
Attaches .then() to the thrown Promise
        │
        ▼
When Promise resolves: re-renders the suspended subtree
```

```jsx
// Suspense-compatible data source (simplified)
function createResource(promise) {
  let status = 'pending';
  let result;

  const suspender = promise.then(
    (data) => { status = 'success'; result = data; },
    (err)  => { status = 'error'; result = err; }
  );

  return {
    read() {
      if (status === 'pending') throw suspender;    // React catches this!
      if (status === 'error')   throw result;       // React Error Boundary catches
      if (status === 'success') return result;      // Happy path
    }
  };
}
```

---

## 20.3 Server Components (React 19 / Next.js App Router)

### Architecture

```
Traditional SSR:
  Server renders HTML → Browser downloads HTML + JS → Hydration
  (All HTML + All JS bundle needed)

Server Components:
  Server renders RSC Payload (special format) → Browser streams it
  Client Components hydrate with interactivity
  Server Components: no JS in browser bundle!
```

### Mental Model

```jsx
// Server Component — runs on server only
// Can directly access DB, file system, secrets
async function ProductPage({ id }) {
  const product = await db.products.findById(id); // direct DB access!

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Server Component passing data to Client Component */}
      <AddToCartButton productId={product.id} price={product.price} />
    </article>
  );
}

// Client Component — runs on both server (initial HTML) and client
'use client';
function AddToCartButton({ productId, price }) {
  const [added, setAdded] = useState(false); // hooks ✅ (client component)

  return (
    <button onClick={() => {
      addToCart(productId);
      setAdded(true);
    }}>
      {added ? '✓ Added' : `Add to Cart ($${price})`}
    </button>
  );
}
```

### What Server Components Cannot Do

- Use hooks (useState, useEffect, etc.)
- Use browser APIs (window, document)
- Use event handlers (onClick, onChange)
- Use Context (as consumer)

### Benefits

1. **Zero bundle impact**: Server components don't ship JS to client.
2. **Direct backend access**: DB, file system, internal APIs — no intermediate API needed.
3. **Automatic code splitting**: Every Client Component becomes an async chunk.
4. **Streaming**: Server can stream HTML as data resolves.

---

## 20.4 Rendering Modes: CSR vs SSR vs SSG vs ISR

```
CSR (Client-Side Rendering):
  Server: serves empty HTML shell
  Browser: downloads JS → runs React → renders HTML → fetches data
  First load: SLOW (blank screen → JS executes → UI appears)
  Subsequent: FAST (SPA navigation)
  SEO: BAD (crawlers see empty HTML)
  Use: Web apps, dashboards, logged-in areas

SSR (Server-Side Rendering):
  Server: runs React → generates full HTML per request → sends to browser
  Browser: receives full HTML (fast paint) → JS downloads → hydrates
  First load: FAST (full HTML immediately)
  SEO: GOOD (crawlers see full HTML)
  Server cost: HIGH (renders on every request)
  Use: E-commerce, news, dynamic personalized pages

SSG (Static Site Generation):
  Build time: runs React → generates full HTML → saves as static files
  Server: serves pre-built HTML files
  First load: FASTEST (static file from CDN)
  SEO: EXCELLENT
  Server cost: MINIMAL (CDN)
  Con: Stale data (need rebuild to update)
  Use: Blogs, documentation, marketing sites

ISR (Incremental Static Regeneration) — Next.js:
  Combines SSG + on-demand revalidation
  First request: serve pre-built HTML
  After revalidation time: regenerate in background
  Next request: serve new HTML
  Use: E-commerce catalogs, news with reasonable staleness
```

---

## 20.5 Hydration

### What Is It?

Hydration is the process of **attaching React's event handlers and state to server-rendered HTML**.

```
Server:  <button class="btn">Count: 0</button>  (static HTML)
                         ↓
Browser: React reads existing DOM nodes
         Attaches onClick handler to button
         Sets up React state
         Now: button is interactive ✅
```

### Hydration Mismatch

```jsx
// ❌ Server renders different HTML than client
function TimeStamp() {
  return <span>{new Date().toISOString()}</span>;
  // Server renders: 2024-01-01T00:00:00Z
  // Client renders: 2024-01-01T00:00:01Z (slightly later)
  // React warning: "Hydration failed because server rendered HTML doesn't match"
}

// ✅ Use useEffect to render client-only dynamic content
function TimeStamp() {
  const [time, setTime] = useState(null); // null on both server and client

  useEffect(() => {
    setTime(new Date().toISOString()); // only runs client-side
  }, []);

  return <span>{time ?? 'Loading...'}</span>;
}
```

### Partial Hydration / Progressive Hydration

React 18 + Server Components support streaming and partial hydration:
- Different parts of the page hydrate independently.
- Above-fold content hydrates first (visible sooner).
- Below-fold content hydrates lazily.

---

## 20.6 React Compiler (React Forget)

### What Is It?

The React Compiler (formerly "React Forget") is a build-time compiler that **automatically adds memoization** to React components — making `useMemo`, `useCallback`, and `React.memo` largely unnecessary to write manually.

```jsx
// Before compiler (manual memoization)
function Component({ a, b }) {
  const value = useMemo(() => expensiveCompute(a), [a]);
  const handler = useCallback(() => doSomething(b), [b]);
  return <Child value={value} onAction={handler} />;
}

// After compiler (you write this)
function Component({ a, b }) {
  const value = expensiveCompute(a); // compiler adds memoization
  const handler = () => doSomething(b); // compiler adds memoization
  return <Child value={value} onAction={handler} />;
}
// Compiler generates optimal code with fine-grained memoization
```

### Requirements

- Components must follow React rules (pure render functions, hooks rules).
- If violations detected, compiler skips that component (opt-out).
- Part of React 19, usable via Babel/Vite plugin.

---

## 20.7 React 19 Features

### New Hooks

```jsx
// useOptimistic: optimistic UI updates
function LikeButton({ postId, initialLikes }) {
  const [likes, setOptimisticLikes] = useOptimistic(
    initialLikes,
    (state, increment) => state + increment
  );

  async function handleLike() {
    setOptimisticLikes(1); // immediately update UI
    await likePost(postId); // actual server call
    // If server call succeeds: real state matches
    // If fails: automatically reverts to initialLikes
  }

  return <button onClick={handleLike}>❤️ {likes}</button>;
}

// useFormStatus: get status of parent form
function SubmitButton() {
  const { pending } = useFormStatus(); // reads from parent <form>
  return <button disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>;
}

// useActionState: manage state from form actions
function ContactForm() {
  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      const result = await submitContact(formData);
      return result;
    },
    null // initial state
  );

  return (
    <form action={formAction}>
      <input name="email" />
      {state?.error && <p>{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
```

### ref as a Prop (No more forwardRef)

```jsx
// React 19: ref is just a prop
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// No more:
// const MyInput = React.forwardRef((props, ref) => <input ref={ref} {...props} />);
```

### Other React 19 Changes

- `use()` hook: read a Promise or Context during render (works in conditions!)
- `<Context>` as provider (no more `<Context.Provider>`)
- Improved error messages
- Document metadata: `<title>`, `<link>`, `<meta>` supported directly in components
- Asset preloading: `preload`, `preinit` APIs

---

## 20.8 Staff Engineer Interview: React Architecture Question

**Q: Your company has a monolithic React app with 50 engineers. It takes 20 minutes to build and deploy. How would you architect a solution?**

**Framework for answering:**

1. **Diagnose the problem**
   - Build time slow: large bundle, complex dependency graph, CI bottleneck?
   - Deployment risk: all changes in one deploy, hard to isolate issues.
   - Team coordination: merge conflicts, shared globals, unclear ownership.

2. **Immediate wins (0–3 months)**
   - Optimize CI: parallel test execution, caching node_modules.
   - Vite migration from webpack: dev server from 2min to instant.
   - Code splitting: route-based chunks reduce main bundle.

3. **Medium term (3–6 months)**
   - Feature-sliced design: organize by domain not by type.
   - NPM packages for shared utilities/design system.
   - Separate CI/CD for design system package.

4. **Long term (6–12 months)**
   - Evaluate micro frontends with Module Federation.
   - Domain-based decomposition (teams own vertical slices).
   - Each MFE: own repo, own CI/CD, own deployment.
   - Shell app composes MFEs.

5. **Tradeoffs to mention**
   - Micro frontends increase runtime complexity.
   - Require investment in shared infrastructure (design system, auth).
   - Not right for all team sizes — overhead has a cost.

---

## 20.9 React Scheduler Internals

### Message Channel for Task Scheduling

```js
// React uses MessageChannel for near-immediate async scheduling
// Why not setTimeout(fn, 0)? Minimum 4ms delay in browsers.
// MessageChannel fires in the next task (< 1ms).

const channel = new MessageChannel();
const port = channel.port2;

channel.port1.onmessage = performWork;

function scheduleImmediateWork() {
  port.postMessage(null); // fires in next microtask queue → macrotask
}
```

### Priority Queue

React's scheduler maintains a **min-heap priority queue** of tasks sorted by expiration time:

```
Tasks sorted by: startTime + timeout
   (UserBlocking timeout = 250ms)
   (Normal timeout = 5000ms)

workLoop:
  while (tasks exist):
    peek at top task (soonest to expire)
    if currentTime >= task.expirationTime:
      mark as OVERDUE → execute now (sync, can't skip)
    else if current frame has time left:
      execute task
    else:
      yield (postMessage to resume after browser paint)
```

---

*End of Part 4 — Sections 16–20*

---

## Index of All Files

| File | Sections | Topics |
|---|---|---|
| [react-handbook-part1.md](react-handbook-part1.md) | 1–5 | Fundamentals, Core, Hooks, Internals, Performance |
| [react-handbook-part2.md](react-handbook-part2.md) | 6–10 | State Mgmt, Router, API, Patterns, System Design |
| [react-handbook-part3.md](react-handbook-part3.md) | 11–15 | Machine Coding, Testing, Security, Build, Micro FE |
| [react-handbook-part4.md](react-handbook-part4.md) | 16–20 | NPM, Q&A, Mental Models, Checklist, FAANG Internals |
