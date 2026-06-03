---
layout: note
prev_url: /react-interview/react-handbook-part1
prev_title: Part 1
next_url: /react-interview/react-handbook-part3
next_title: Part 3
---

{% raw %}

# 🚀 Senior Frontend Engineer / React Developer Interview Handbook

## Part 2: Sections 6–10 | State Management → Router → API → Patterns → System Design

---

# SECTION 6: State Management

---

## 6.1 When to Use External State Management?

### Decision Framework

```
Local UI State (show/hide modal, form inputs)
    → useState / useReducer

Shared State (a few components)
    → Context API + useReducer

Complex shared state, many updates, DevTools needed
    → Redux Toolkit / Zustand

Server State (cache, async data)
    → React Query / TanStack Query / SWR

Derived/Atomic state, fine-grained subscriptions
    → Recoil / Jotai
```

---

## 6.2 Context API

### Concept

Context provides a way to pass data through the component tree without prop drilling. It is built into React — no extra library needed.

### Architecture

```
React.createContext(defaultValue)
    │
    ▼
<Context.Provider value={...}>  ← Provides value to subtree
    │
    ├─ <ConsumerA />  ← useContext(Context) — subscribes
    ├─ <ConsumerB />  ← useContext(Context) — subscribes
    └─ ...
```

### Complete Pattern

```jsx
// 1. Create context + custom hook
const UserContext = createContext(null);

function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

// 2. Provider with state
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const userData = await api.login(credentials);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 3. Usage anywhere in tree
function NavBar() {
  const { user, logout } = useUser();
  return (
    <header>
      {user ? <button onClick={logout}>Logout</button> : <LoginLink />}
    </header>
  );
}
```

### Performance: Context Splitting

```jsx
// ❌ Single context: ALL consumers re-render when ANYTHING changes
const AppContext = createContext({
  user: null,
  theme: "light",
  sidebarOpen: false,
});

// ✅ Split by change frequency
const UserContext = createContext(null); // rarely changes
const ThemeContext = createContext("light"); // changes on toggle
const UIContext = createContext({}); // changes frequently (sidebar, modal)
```

### Context vs Redux

|             | Context API              | Redux                         |
| ----------- | ------------------------ | ----------------------------- |
| Bundle size | 0KB (built-in)           | ~10KB (RTK)                   |
| DevTools    | Basic React DevTools     | Powerful Redux DevTools       |
| Middleware  | No                       | Yes (thunk, saga)             |
| Performance | Re-renders all consumers | Selective subscriptions       |
| Boilerplate | Low                      | Medium (RTK reduced it)       |
| Best for    | Simple/medium apps       | Large apps with complex state |

---

## 6.3 Redux & Redux Toolkit (RTK)

> 📖 **Deep dive:** [Redux & RTK Complete Guide](/react-interview/redux-rtk-guide) — Plain Redux from scratch → RTK Slices → RTK Query → Testing → Interview Q&A

### Architecture

```
View (React Component)
  │ dispatch(action)
  ▼
Store → Reducer (pure function: (state, action) → newState)
  │ state
  ▼
View (re-renders via useSelector)
```

### Redux Toolkit — Modern Redux

```jsx
// store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for API calls
export const fetchUser = createAsyncThunk("user/fetch", async (userId) => {
  const response = await api.getUser(userId);
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.data = null; // Immer allows this "mutation" syntax!
    },
    updateName: (state, action) => {
      state.data.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, updateName } = userSlice.actions;
export default userSlice.reducer;

// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // add more slices
  },
});

// In component
function UserProfile() {
  const dispatch = useDispatch();
  const { data: user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser("123"));
  }, []);

  if (loading) return <Spinner />;
  return <div>{user?.name}</div>;
}
```

### Why Redux Uses Immutability

1. **Change detection**: React-Redux uses `===` to detect state changes for selector optimization. Mutation breaks this.
2. **Time-travel debugging**: Immutable history allows Redux DevTools to replay state changes.
3. **Predictability**: Pure reducers are easy to test and reason about.

> RTK uses **Immer** internally — you _write_ mutations but Immer produces a new immutable object behind the scenes.

### RTK Query — Server State in Redux

```jsx
// api/postsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => "/posts", providesTags: ["Post"] }),
    addPost: builder.mutation({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: ["Post"], // auto-refetch getPosts after add
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;

// Component — no manual loading/error state!
function Posts() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <PostList posts={posts} onAdd={addPost} />;
}
```

---

## 6.4 Zustand

### Concept

Zustand is a minimal, fast state management library based on hooks. No boilerplate, no providers.

```jsx
import { create } from "zustand";

// Create store
const useStore = create((set, get) => ({
  // State
  user: null,
  cart: [],

  // Actions
  setUser: (user) => set({ user }),

  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),

  get cartTotal() {
    return get().cart.reduce((sum, item) => sum + item.price, 0);
  },
}));

// Usage — no Provider needed!
function Cart() {
  const { cart, removeFromCart, cartTotal } = useStore();
  return (
    <div>
      Total: ${cartTotal}
      {cart.map((item) => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

// Subscribe to only what you need — no unnecessary re-renders
function UserName() {
  const userName = useStore((state) => state.user?.name); // only re-renders when name changes
  return <span>{userName}</span>;
}
```

### Zustand vs Redux

|             | Zustand           | Redux Toolkit  |
| ----------- | ----------------- | -------------- |
| Setup       | Minimal           | Medium         |
| Bundle size | ~1KB              | ~10KB          |
| Provider    | Not needed        | Needed         |
| DevTools    | Plugin            | Built-in       |
| Middleware  | Supports          | Rich ecosystem |
| TypeScript  | Excellent         | Excellent      |
| Best for    | Small-medium apps | Large apps     |

---

## 6.5 Jotai & Recoil (Atomic State)

### Concept

Atomic state management: state is split into tiny atoms. Components subscribe to only the atoms they use.

```jsx
// Jotai
import { atom, useAtom } from "jotai";

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2); // derived atom

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const doubled = useAtomValue(doubledAtom);
  return (
    <div>
      {count} × 2 = {doubled}{" "}
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

**Benefits:** Fine-grained subscriptions — component only re-renders when its specific atoms change. Great for large apps with many independent state slices.

---

# SECTION 7: React Router

---

## 7.1 React Router DOM v6

### Basic Setup

```jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      User {id} <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
```

### Nested Routes

```jsx
// Parent layout with <Outlet />
function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardHome />} /> {/* /dashboard */}
    <Route path="analytics" element={<Analytics />} /> {/* /dashboard/analytics */}
    <Route path="settings" element={<Settings />} /> {/* /dashboard/settings */}
  </Route>
</Routes>;
```

### Protected Routes

```jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, remember intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;

// In login: redirect back
function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogin() {
    // ...authenticate...
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
  }
}
```

### Lazy Loaded Routes

```jsx
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### BrowserRouter vs HashRouter

|               | BrowserRouter                                     | HashRouter                            |
| ------------- | ------------------------------------------------- | ------------------------------------- |
| URL format    | `/dashboard/analytics`                            | `/#/dashboard/analytics`              |
| Server config | Needs server to serve `index.html` for all routes | No server config needed               |
| SEO           | Better                                            | Worse (hash part ignored by crawlers) |
| Use case      | Modern web apps                                   | Static file hosting, legacy           |
| History API   | pushState                                         | hash change                           |

---

# SECTION 8: API Handling

---

## 8.1 Fetch API & Axios

### Fetch API

```js
// Basic fetch
const response = await fetch("/api/users");
if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
const data = await response.json();

// With options
const response = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
  signal: abortController.signal,
});
```

### Axios

```js
import axios from "axios";

// Create instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401, refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newToken = await refreshToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original); // retry with new token
    }
    return Promise.reject(error);
  }
);
```

### Axios vs Fetch

|                   | Fetch                    | Axios          |
| ----------------- | ------------------------ | -------------- |
| Built-in          | Yes (browser/Node 18+)   | No (3rd party) |
| Auto JSON parse   | No (manual `.json()`)    | Yes            |
| Interceptors      | No                       | Yes            |
| Timeout           | Manual (AbortController) | Built-in       |
| Progress          | No                       | Yes            |
| Error for 4xx/5xx | No (check `response.ok`) | Yes (throws)   |
| Bundle size       | 0KB                      | ~13KB          |

---

## 8.2 React Query / TanStack Query

### Why React Query?

**Without React Query (manual data fetching):**

```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // No caching — refetches on every mount
  // No background refetch
  // No deduplication
  // Must manage loading/error manually
}
```

**With React Query:**

```jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Users() {
  // Cached, deduped, background-refetched automatically
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // consider fresh for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <UserList users={users} />;
}

// Mutations with optimistic updates
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot current data
      const previous = queryClient.getQueryData(["users"]);

      // Optimistically update
      queryClient.setQueryData(["users"], (old) =>
        old.map((u) => (u.id === id ? { ...u, ...data } : u))
      );

      return { previous }; // context for rollback
    },
    onError: (err, vars, context) => {
      // Rollback on error
      queryClient.setQueryData(["users"], context.previous);
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

### Client State vs Server State

|             | Client State            | Server State             |
| ----------- | ----------------------- | ------------------------ |
| Location    | Browser memory          | Remote database          |
| Examples    | Theme, modal open, form | Users, products, posts   |
| Ownership   | Frontend app            | Backend / API            |
| Library     | useState, Zustand       | React Query, SWR         |
| Stale?      | Always current          | Can be stale             |
| Sync issues | No                      | Yes (cache invalidation) |

### React Query Features

- **Caching**: Responses cached by query key.
- **Background refetch**: Refetch on window focus, reconnect.
- **Deduplication**: Multiple components with same query = 1 request.
- **Pagination/Infinite**: `useInfiniteQuery` built-in.
- **Stale-while-revalidate**: Show stale data while fetching fresh.
- **Retry on failure**: Auto-retry with exponential backoff.

---

## 8.3 SWR

```jsx
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

function Profile() {
  const { data, error, isLoading } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000, // polling every 30s
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <div>{data.name}</div>;
}
```

**SWR vs React Query:** React Query is more feature-rich (devtools, mutations, optimistic updates). SWR is simpler and smaller. Both use stale-while-revalidate pattern.

---

# SECTION 9: Advanced React Patterns

---

## 9.1 Higher-Order Components (HOC)

### Concept

A HOC is a function that takes a component and returns a new enhanced component.

```jsx
// Pattern: withAuth HOC
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();

    if (!user) return <Redirect to="/login" />;

    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

// Pattern: withLogging HOC
function withLogging(WrappedComponent, componentName) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log(`[${componentName}] mounted`);
      return () => console.log(`[${componentName}] unmounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };
}
```

### Drawbacks of HOCs

1. **Wrapper hell**: Deeply nested `withA(withB(withC(Component)))`.
2. **Props collision**: HOC might pass a prop with the same name as an existing prop.
3. **Opaque in DevTools**: Shows as `withAuth(Dashboard)` not `Dashboard`.
4. **Static typing is harder**: Complex TypeScript generics needed.

> Modern React: Prefer **Custom Hooks** over HOCs for logic reuse.

---

## 9.2 Render Props

### Concept

A component accepts a function as a prop (`render` or `children`) and calls it to render its output. The function receives data.

```jsx
// Mouse tracker using render prop
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
      {children(position)} {/* Call the children function with data */}
    </div>
  );
}

// Usage
<MouseTracker>
  {({ x, y }) => <div>Mouse: {x}, {y}</div>}
</MouseTracker>

// More commonly: named render prop
<DataProvider
  render={({ data, loading }) =>
    loading ? <Spinner /> : <List data={data} />
  }
/>
```

> Modern React: Prefer **Custom Hooks** over Render Props. The above becomes `useMouse()`.

---

## 9.3 Compound Components

### Concept

A pattern where a parent component shares implicit state with its children via Context. Children are semantically related but independently placed.

```jsx
// Example: Compound Select component
const SelectContext = createContext();

function Select({ children, value, onChange }) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  );
}

function Option({ value, children }) {
  const { value: selected, onChange } = useContext(SelectContext);
  return (
    <div
      className={`option ${selected === value ? "selected" : ""}`}
      onClick={() => onChange(value)}>
      {children}
    </div>
  );
}

// Attach as static properties for convenience
Select.Option = Option;

// Usage — flexible composition
<Select value={selected} onChange={setSelected}>
  <Select.Option value="react">React</Select.Option>
  <Select.Option value="vue">Vue</Select.Option>
  <Select.Option value="angular">Angular</Select.Option>
</Select>;
```

### Real-World Examples

- `<Tabs>`, `<Tab>`, `<TabPanel>` (Radix UI, Headless UI)
- `<Menu>`, `<MenuItem>` (Reach UI)
- `<Accordion>`, `<AccordionItem>` patterns

---

## 9.4 Provider Pattern

### Concept

Wrapping a component tree with a provider that supplies dependencies/services (theme, i18n, auth) via Context.

```jsx
// Pattern: Multiple providers composed
function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider>{children}</RouterProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Routes />
    </AppProviders>
  );
}
```

---

## 9.5 Headless Components

### Concept

Components that provide **behavior and accessibility** but **no styling**. Consumers bring their own UI.

```jsx
// Headless Accordion (no styles, just logic + a11y)
function useAccordion(items) {
  const [openIndex, setOpenIndex] = useState(null);

  const getItemProps = (index) => ({
    isOpen: openIndex === index,
    toggle: () => setOpenIndex((i) => (i === index ? null : index)),
  });

  return { getItemProps };
}

// Libraries: Radix UI, Headless UI (Tailwind), Downshift, React Aria
import * as Accordion from "@radix-ui/react-accordion";

// Users apply their own styling
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger className="my-custom-trigger">
      Question
    </Accordion.Trigger>
    <Accordion.Content className="my-custom-content">Answer</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>;
```

---

## 9.6 Controlled vs Uncontrolled Component Pattern

### Concept for Libraries (not forms)

Component libraries expose both controlled and uncontrolled modes:

```jsx
// Uncontrolled: component manages its own state
<Accordion defaultOpen={['item-1']} />

// Controlled: parent manages state
<Accordion open={openItems} onOpenChange={setOpenItems} />

// Implementation: useControllableState pattern
function useControllableState({ prop, defaultProp, onChange }) {
  const [uncontrolled, setUncontrolled] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  const setValue = useCallback((next) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  }, [isControlled, onChange]);

  return [value, setValue];
}
```

---

# SECTION 10: React System Design

---

## 10.1 Frontend System Design Framework

For every system design question, follow this structure:

```
1. Clarify Requirements
   → Functional: What features?
   → Non-functional: Scale? Performance? Offline? Accessibility?

2. Component Architecture
   → Break UI into components
   → Identify shared/reusable parts

3. State Management
   → What state exists?
   → Where does it live?
   → Client vs Server state?

4. Data Flow & API Layer
   → API contracts
   → Caching strategy
   → Real-time needs (WebSocket, SSE, Polling)?

5. Routing Structure
   → URL design
   → Code splitting strategy

6. Performance
   → Initial load
   → Runtime performance
   → Bundle optimization

7. Error Handling & Edge Cases
8. Accessibility
9. Security
10. Monitoring & Observability
```

---

## 10.2 Design: Google Docs Frontend

### Requirements

- Real-time collaborative editing
- Rich text formatting
- User presence (cursors)
- Offline support
- Version history

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     React App                            │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Toolbar   │  │  Document    │  │  Collaborators  │  │
│  │ Component  │  │  Editor      │  │  Panel          │  │
│  └────────────┘  └──────┬───────┘  └────────┬────────┘  │
│                         │                   │           │
│  ┌──────────────────────▼───────────────────▼────────┐  │
│  │              Editor State (Slate.js / ProseMirror) │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │          Collaboration Layer (Yjs / CRDT)          │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │ WebSocket
                    ┌─────▼──────┐
                    │  Backend   │
                    │  (CRDT     │
                    │  Sync)     │
                    └────────────┘
```

### Key Technical Decisions

**Real-time sync:** Use **CRDT** (Conflict-free Replicated Data Types) via Yjs. CRDTs allow offline editing and automatic merge without conflicts.

**State management:**

- Editor content: Yjs document (distributed state)
- UI state: Zustand (sidebar open, active toolbar, user presence)
- User data: React Query (profile, permissions)

**Performance:**

- Virtual rendering for large documents
- Only re-render affected paragraphs on edit
- Debounce network sync (don't send every keystroke)

**Offline support:**

- IndexedDB persistence via `y-indexeddb`
- Service Worker for asset caching
- Sync when reconnected

---

## 10.3 Design: Instagram Feed

### Requirements

- Infinite scroll feed
- Like/comment/share
- Stories
- Image optimization
- Notifications

### Component Architecture

```
App
├── Stories (horizontal scroll)
│   └── StoryItem
├── Feed (infinite scroll)
│   └── Post
│       ├── PostHeader (user info)
│       ├── PostMedia (image/video)
│       ├── PostActions (like, comment, share)
│       └── PostComments (collapsed)
└── BottomNav
```

### State Management

```
Server State (React Query):
- /feed?cursor=xxx → feed posts
- /stories → stories
- /users/:id → user profiles

Client State (Zustand):
- likedPosts: Set<postId>  (optimistic updates)
- savedPosts: Set<postId>
- activeModal: null | 'comments' | 'share'

Real-time (WebSocket):
- New posts from followed users
- Like/comment counts updates
- DM notifications
```

### Infinite Scroll Implementation

```jsx
function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['feed'],
      queryFn: ({ pageParam = null }) =>
        api.getFeed({ cursor: pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <VirtualList items={posts} renderItem={(post) => <Post key={post.id} post={post} />} />
    <div ref={loadMoreRef}>{isFetchingNextPage && <Spinner />}</div>
  );
}
```

### Performance

- **Image lazy loading**: `loading="lazy"` + Intersection Observer
- **Image optimization**: WebP format, CDN, srcset for responsive
- **Virtualization**: react-window for large feeds
- **Prefetch**: Load next page before user reaches bottom

---

## 10.4 Design: Real-Time Chat Application

### Architecture

```
Frontend:
├── ConversationList (sidebar)
├── MessageThread (main area)
│   ├── MessageList (virtualized)
│   └── MessageInput (controlled, emoji picker)
└── OnlinePresence

Transport: WebSocket (Socket.io or native)
Fallback: Long Polling

State:
├── Server: React Query (conversations, messages)
├── Real-time: Socket.io events → React Query cache updates
└── Client: Zustand (active conversation, typing indicators, online status)
```

### WebSocket Integration

```jsx
// Real-time chat with React Query integration
function useChatSocket(userId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io("/chat", { auth: { token: getToken() } });

    socket.on("message:new", (message) => {
      // Update React Query cache directly — no refetch needed
      queryClient.setQueryData(["messages", message.conversationId], (old) =>
        old ? [...old, message] : [message]
      );
      // Update conversation preview
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    socket.on("typing:start", ({ userId, conversationId }) => {
      useTypingStore.setState((s) => ({
        typing: {
          ...s.typing,
          [conversationId]: [...(s.typing[conversationId] ?? []), userId],
        },
      }));
    });

    return () => socket.disconnect();
  }, [userId]);
}
```

---

## 10.5 Design: E-Commerce Frontend

### Folder Structure

```
src/
├── app/                    # App-level config
│   ├── store.ts            # Redux/Zustand store
│   ├── queryClient.ts      # React Query client
│   └── router.tsx          # Route definitions
│
├── features/               # Feature-sliced design
│   ├── catalog/
│   │   ├── components/     # ProductCard, FilterBar, SortSelect
│   │   ├── hooks/          # useProducts, useFilters
│   │   ├── api/            # productsApi.ts
│   │   └── store/          # catalogSlice.ts
│   │
│   ├── cart/
│   │   ├── components/     # CartDrawer, CartItem, CartSummary
│   │   ├── hooks/          # useCart
│   │   └── store/          # cartSlice.ts (persisted)
│   │
│   ├── checkout/
│   │   ├── components/     # ShippingForm, PaymentForm, OrderReview
│   │   ├── hooks/          # useCheckout
│   │   └── api/            # checkoutApi.ts
│   │
│   └── auth/
│       ├── components/     # LoginForm, RegisterForm
│       ├── hooks/          # useAuth
│       └── api/            # authApi.ts
│
├── shared/                 # Cross-cutting concerns
│   ├── ui/                 # Design system components
│   ├── hooks/              # useDebounce, useLocalStorage
│   ├── utils/              # formatPrice, validateEmail
│   └── types/              # TypeScript types
│
└── pages/                  # Route-level components
    ├── HomePage.tsx
    ├── CatalogPage.tsx
    ├── ProductPage.tsx
    ├── CartPage.tsx
    └── CheckoutPage.tsx
```

### Critical E-Commerce Performance

```jsx
// 1. Product images: CDN + WebP + blur placeholder
<img
  src={product.imageUrl}
  loading="lazy"
  decoding="async"
  style={{ backgroundImage: `url(${product.blurDataURL})` }}
/>;

// 2. Search: Debounced + React Query
const debouncedSearch = useDebounce(searchTerm, 300);
const { data } = useQuery({
  queryKey: ["products", debouncedSearch, filters],
  queryFn: () => searchProducts(debouncedSearch, filters),
  keepPreviousData: true, // no loading flash on filter change
});

// 3. Cart: Persistent + Optimistic
// Persist in localStorage, sync to server
// Optimistic: update cart UI before server confirms

// 4. Product page: Code split heavy components
const ReviewSection = lazy(() => import("./ReviewSection"));
const RelatedProducts = lazy(() => import("./RelatedProducts"));
// Load above-fold first, defer below-fold
```

---

## 10.6 Design: Analytics Dashboard

### Architecture

```
Dashboard
├── DateRangePicker
├── FilterPanel
├── MetricsGrid
│   ├── MetricCard (Revenue, Users, Conversions)
│   └── TrendChart
├── ChartSection
│   ├── LineChart (time series)
│   ├── BarChart (comparison)
│   └── PieChart (distribution)
└── DataTable (top pages, top products)
```

### State Design

```tsx
// URL as state for shareable dashboards
// /analytics?from=2024-01-01&to=2024-01-31&segments=organic,paid

function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      dateRange: {
        from: searchParams.get("from") ?? getDefaultFrom(),
        to: searchParams.get("to") ?? getDefaultTo(),
      },
      segments: searchParams.getAll("segments"),
    }),
    [searchParams]
  );

  const setFilters = useCallback((newFilters) => {
    setSearchParams(toSearchParams(newFilters), { replace: true });
  }, []);

  return { filters, setFilters };
}

// React Query with refetch interval for live dashboards
const { data } = useQuery({
  queryKey: ["metrics", filters],
  queryFn: () => fetchMetrics(filters),
  refetchInterval: 60_000, // refresh every minute
  staleTime: 30_000,
});
```

---

_End of Part 2 — Sections 6–10_

{% endraw %}
