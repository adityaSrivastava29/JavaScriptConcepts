---
layout: note
prev_url: /react-interview/react-handbook-part2
prev_title: React Handbook Part 2
next_url: /react-interview/react-handbook-part1
next_title: React Handbook Part 1
---

{% raw %}

# Redux & Redux Toolkit (RTK) — Complete Interview Guide

> Covers: Plain Redux from scratch → Redux Toolkit → RTK Query → Real-world patterns

---

## Table of Contents

1. [Why Redux?](#1-why-redux)
2. [Plain Redux — No RTK](#2-plain-redux--no-rtk)
3. [Redux Middleware — Thunk from scratch](#3-redux-middleware--thunk-from-scratch)
4. [Redux Toolkit (RTK) — Modern Redux](#4-redux-toolkit-rtk--modern-redux)
5. [createSlice in depth](#5-createslice-in-depth)
6. [createAsyncThunk in depth](#6-createasyncthunk-in-depth)
7. [createEntityAdapter](#7-createentityadapter)
8. [createSelector (Reselect)](#8-createselector-reselect)
9. [RTK Query — Complete Guide](#9-rtk-query--complete-guide)
10. [RTK Query Advanced — Tags, Pagination, Optimistic Updates](#10-rtk-query-advanced)
11. [Project Folder Structure](#11-project-folder-structure)
12. [TypeScript with RTK](#12-typescript-with-rtk)
13. [Testing Redux](#13-testing-redux)
14. [Interview Q&A — Redux & RTK](#14-interview-qa)

---

## 1. Why Redux?

### The Problem Redux Solves

```
Without Redux (prop drilling):
App
  └── Dashboard
        └── Sidebar
              └── UserAvatar  ← needs user data from top
```

```
With Redux:
Store (single source of truth)
  ├── UserAvatar  ← reads directly from store
  ├── Header      ← reads directly from store
  └── Settings    ← reads + writes directly
```

### Three Core Principles

| Principle                      | Meaning                                                       |
| ------------------------------ | ------------------------------------------------------------- |
| **Single source of truth**     | The whole app state lives in one store                        |
| **State is read-only**         | You can only change state by dispatching actions              |
| **Changes via pure functions** | Reducers are pure — same input → same output, no side effects |

### When to Use Redux

- Shared state accessed by many components in different parts of the tree
- Complex state logic with many transitions
- Server state with caching (RTK Query)
- Need for time-travel debugging / reproducible state

### When NOT to Use Redux

- Local UI state (open/close modal → `useState`)
- Server state only (use RTK Query / React Query instead)
- Small apps with simple state

---

## 2. Plain Redux — No RTK

Understanding plain Redux helps you understand what RTK is solving.

### Install

```bash
npm install redux react-redux
```

### Step 1 — Define Action Types

```js
// store/actionTypes.js
export const INCREMENT = "counter/INCREMENT";
export const DECREMENT = "counter/DECREMENT";
export const ADD_TODO = "todos/ADD_TODO";
export const TOGGLE_TODO = "todos/TOGGLE_TODO";
export const DELETE_TODO = "todos/DELETE_TODO";
```

### Step 2 — Define Action Creators

```js
// store/actions.js
import {
  INCREMENT,
  DECREMENT,
  ADD_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
} from "./actionTypes";

export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false },
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: id,
});
```

### Step 3 — Write Reducers

```js
// store/counterReducer.js
import { INCREMENT, DECREMENT } from "./actionTypes";

const initialState = { count: 0 };

export function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 }; // MUST return new object!
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state; // Always return state for unknown actions
  }
}
```

```js
// store/todosReducer.js
import { ADD_TODO, TOGGLE_TODO, DELETE_TODO } from "./actionTypes";

const initialState = [];

export function todosReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload]; // new array, don't push!

    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed } // new object!
          : todo
      );

    case DELETE_TODO:
      return state.filter((todo) => todo.id !== action.payload);

    default:
      return state;
  }
}
```

### Step 4 — Combine Reducers & Create Store

```js
// store/index.js
import { createStore, combineReducers } from "redux";
import { counterReducer } from "./counterReducer";
import { todosReducer } from "./todosReducer";

const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
});

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__?.() // enable Redux DevTools
);
```

### Step 5 — Provide Store to React

```jsx
// main.jsx / index.jsx
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Step 6 — Use in Components

```jsx
// Counter.jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store/actions";

export function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

```jsx
// TodoList.jsx
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleTodo, deleteTodo } from "./store/actions";
import { useState } from "react";

export function TodoList() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button
        onClick={() => {
          dispatch(addTodo(text));
          setText("");
        }}>
        Add
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => dispatch(toggleTodo(todo.id))}>
              {todo.text}
            </span>
            <button onClick={() => dispatch(deleteTodo(todo.id))}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### The Boilerplate Problem (Why RTK Exists)

Plain Redux requires you to:

1. Manually define action type constants
2. Manually write action creators
3. Write `switch` statements in reducers
4. Manually spread state (`...state`) to avoid mutation
5. Set up middleware manually
6. Configure DevTools manually

**RTK eliminates all of this.**

---

## 3. Redux Middleware — Thunk from Scratch

### What is Middleware?

Middleware sits between `dispatch` and the reducer. It can intercept, delay, or transform actions.

```
dispatch(action)
  → middleware1
    → middleware2
      → reducer
```

### Writing Thunk Middleware from Scratch

```js
// Without redux-thunk, dispatch only accepts plain objects.
// Thunk allows dispatching functions (for async operations).

const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    // It's a thunk! Call it with dispatch and getState
    return action(store.dispatch, store.getState);
  }
  // Plain action — pass to next middleware / reducer
  return next(action);
};
```

### Applying Middleware

```js
import { createStore, applyMiddleware } from "redux";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
```

### Using Thunk (Plain Redux)

```js
// Async action creator returns a function, not an object
export const fetchUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: "user/fetchPending" });
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    dispatch({ type: "user/fetchFulfilled", payload: data });
  } catch (err) {
    dispatch({ type: "user/fetchRejected", payload: err.message });
  }
};

// In component:
dispatch(fetchUser("123"));
```

### Logger Middleware Example

```js
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log("prev state", store.getState());
  console.log("action", action);
  const result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};
```

---

## 4. Redux Toolkit (RTK) — Modern Redux

### Install

```bash
npm install @reduxjs/toolkit react-redux
```

### What RTK Provides

| RTK API                 | Replaces                                           |
| ----------------------- | -------------------------------------------------- |
| `configureStore`        | `createStore` + `applyMiddleware` + DevTools setup |
| `createSlice`           | action types + action creators + reducer           |
| `createAsyncThunk`      | manual thunk functions                             |
| `createEntityAdapter`   | normalized state helpers                           |
| `createSelector`        | memoized selectors (Reselect)                      |
| `createApi` (RTK Query) | all data fetching + caching logic                  |

### configureStore

```js
// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import todosReducer from "./todosSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    user: userReducer,
  },
  // middleware is pre-configured with redux-thunk + serializability check
  // devtools enabled in development automatically
});

// TypeScript: infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**What `configureStore` does automatically:**

- Adds `redux-thunk` middleware
- Adds Redux DevTools Extension support
- Adds development-only checks (serializable state, immutability)

---

## 5. createSlice in depth

A **slice** is a self-contained unit of Redux state — it combines the reducer + action creators in one place.

### Full Example — Counter Slice

```js
// store/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter", // used as prefix for action types
  initialState: {
    value: 0,
    step: 1,
    history: [],
  },

  reducers: {
    // Simple reducer
    increment(state) {
      state.value += state.step; // Immer allows direct mutation!
      state.history.push(state.value);
    },

    decrement(state) {
      state.value -= state.step;
      state.history.push(state.value);
    },

    // Reducer with payload
    incrementByAmount(state, action) {
      state.value += action.payload;
    },

    // Reducer with prepare callback (customize action)
    addWithMeta: {
      reducer(state, action) {
        state.value += action.payload.amount;
      },
      prepare(amount) {
        return {
          payload: {
            amount,
            timestamp: new Date().toISOString(),
            id: Math.random(),
          },
        };
      },
    },

    setStep(state, action) {
      state.step = action.payload;
    },

    reset() {
      // Returning a new state (instead of mutating) is also valid
      return { value: 0, step: 1, history: [] };
    },
  },
});

// Actions are auto-generated
export const {
  increment,
  decrement,
  incrementByAmount,
  setStep,
  reset,
  addWithMeta,
} = counterSlice.actions;

// Action types (for reference or testing)
console.log(increment.type); // "counter/increment"
console.log(incrementByAmount.type); // "counter/incrementByAmount"

// Reducer
export default counterSlice.reducer;
```

### Full Example — Todos Slice

```js
// store/todosSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    filter: "all", // "all" | "active" | "completed"
  },

  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(text) {
        return {
          payload: {
            id: nanoid(), // RTK provides nanoid!
            text,
            completed: false,
            createdAt: Date.now(),
          },
        };
      },
    },

    toggleTodo(state, action) {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed; // direct mutation via Immer
      }
    },

    deleteTodo(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },

    editTodo(state, action) {
      const { id, text } = action.payload;
      const todo = state.items.find((t) => t.id === id);
      if (todo) todo.text = text;
    },

    setFilter(state, action) {
      state.filter = action.payload;
    },

    clearCompleted(state) {
      state.items = state.items.filter((t) => !t.completed);
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  clearCompleted,
} = todosSlice.actions;
export default todosSlice.reducer;
```

### Selectors — Colocate with Slice

```js
// Add to bottom of todosSlice.js
export const selectAllTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;
export const selectActiveTodos = (state) =>
  state.todos.items.filter((t) => !t.completed);
export const selectCompletedTodos = (state) =>
  state.todos.items.filter((t) => t.completed);
export const selectTodoById = (id) => (state) =>
  state.todos.items.find((t) => t.id === id);
```

### Immer — How It Works Inside createSlice

```js
// What you write (looks like mutation):
increment(state) {
  state.value += 1;
}

// What Immer does behind the scenes:
// 1. Creates a draft proxy of state
// 2. Records your mutations on the draft
// 3. Produces a new immutable object from those mutations
// 4. Returns the new immutable object — original state untouched!

// Rules:
// ✅ You can mutate the draft state
// ✅ OR return a new value — but NOT both
// ❌ Don't return undefined accidentally

reset(state) {
  return { value: 0 };  // ✅ returning new value
}

// ❌ This is a bug:
badReset(state) {
  state = { value: 0 };  // ❌ reassigning local variable - doesn't work!
  // You need to return it or mutate in-place
}
```

---

## 6. createAsyncThunk in depth

### Basic Usage

```js
// store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. Create the async thunk
export const fetchUserById = createAsyncThunk(
  "users/fetchById", // action type prefix
  async (userId, thunkAPI) => {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data; // becomes action.payload in fulfilled
  }
);

// 2. Handle lifecycle actions in createSlice
const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: {},
    loading: "idle", // "idle" | "pending" | "succeeded" | "failed"
    error: null,
    currentRequestId: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.entities[action.payload.id] = action.payload;
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.error = action.error.message;
        }
      });
  },
});

export default usersSlice.reducer;
```

### thunkAPI — Full Power

```js
export const fetchCartWithAuth = createAsyncThunk(
  "cart/fetchWithAuth",
  async (_, thunkAPI) => {
    const {
      dispatch, // dispatch other actions
      getState, // read current state
      rejectWithValue, // return a known error payload
      fulfillWithValue, // return a success payload with meta
      signal, // AbortController signal for cancellation
      extra, // injected extra argument (e.g. API service)
    } = thunkAPI;

    // Access other slice state
    const token = getState().auth.token;
    if (!token) {
      return thunkAPI.rejectWithValue("Not authenticated");
    }

    try {
      const response = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        signal, // supports abort!
      });

      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message);
      }

      return await response.json();
    } catch (err) {
      if (err.name === "AbortError") {
        return thunkAPI.rejectWithValue("Request cancelled");
      }
      throw err;
    }
  }
);
```

### Handling rejectWithValue

```js
extraReducers: (builder) => {
  builder.addCase(fetchCartWithAuth.rejected, (state, action) => {
    // action.error.message  — for thrown errors
    // action.payload        — for rejectWithValue (your custom message)
    state.error = action.payload ?? action.error.message;
  });
};
```

### Cancelling a Request

```js
function SearchResults({ query }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const promise = dispatch(searchProducts(query));
    return () => {
      promise.abort(); // createAsyncThunk supports .abort() on the returned promise
    };
  }, [query]);
}
```

### Dispatching Other Actions Inside Thunk

```js
export const loginAndFetchProfile = createAsyncThunk(
  "auth/loginAndFetch",
  async (credentials, { dispatch }) => {
    const { token } = await login(credentials);
    // Dispatch another slice action
    dispatch(setToken(token));
    // Dispatch another thunk
    await dispatch(fetchUserProfile());
    return token;
  }
);
```

### Error Handling Pattern

```js
// In component
async function handleLogin(credentials) {
  const result = await dispatch(loginUser(credentials));

  if (loginUser.fulfilled.match(result)) {
    navigate("/dashboard");
  } else if (loginUser.rejected.match(result)) {
    setError(result.payload || "Login failed");
  }
}
```

---

## 7. createEntityAdapter

Manages normalized state (like a lookup table) with automatic CRUD helpers.

### What is Normalized State?

```js
// Denormalized (bad for lookups)
items: [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" }
]

// Normalized (fast lookups by id)
ids: [1, 2],
entities: {
  1: { id: 1, name: "Apple" },
  2: { id: 2, name: "Banana" }
}
```

### Full Example

```js
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

// 1. Create adapter
const productsAdapter = createEntityAdapter({
  // Optional: custom id selector (default: item.id)
  selectId: (product) => product.productId,
  // Optional: sort order
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// 2. Initial state includes ids[], entities{}
const initialState = productsAdapter.getInitialState({
  loading: false,
  error: null,
  // extra fields beyond ids/entities
  totalCount: 0,
});

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const res = await fetch("/api/products");
  return res.json();
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Adapter gives you these methods:
    addOne: productsAdapter.addOne,
    addMany: productsAdapter.addMany,
    updateOne: productsAdapter.updateOne,
    updateMany: productsAdapter.updateMany,
    upsertOne: productsAdapter.upsertOne, // add or update
    upsertMany: productsAdapter.upsertMany,
    removeOne: productsAdapter.removeOne,
    removeMany: productsAdapter.removeMany,
    setAll: productsAdapter.setAll, // replace entire list

    // Custom reducer using adapter methods
    updatePrice(state, action) {
      const { id, price } = action.payload;
      productsAdapter.updateOne(state, { id, changes: { price } });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        productsAdapter.setAll(state, action.payload.items);
        state.totalCount = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addOne, removeOne, updatePrice } = productsSlice.actions;
export default productsSlice.reducer;

// 3. Generate selectors
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
  selectEntities: selectProductEntities,
  selectTotal: selectProductCount,
} = productsAdapter.getSelectors((state) => state.products);
```

### Usage in Component

```jsx
function ProductList() {
  const products = useSelector(selectAllProducts);
  const product = useSelector((state) => selectProductById(state, "abc123"));
  const total = useSelector(selectProductCount);

  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

---

## 8. createSelector (Reselect)

Memoized selectors — recompute only when inputs change.

### The Problem Without Memoization

```js
// This creates a new array every render → child re-renders even if data is same!
const activeTodos = useSelector((state) =>
  state.todos.items.filter((t) => !t.completed)
);
```

### Basic createSelector

```js
import { createSelector } from "@reduxjs/toolkit";

// Input selectors (cheap — just read from state)
const selectTodoItems = (state) => state.todos.items;
const selectFilter = (state) => state.todos.filter;

// Output selector (expensive — runs only when inputs change)
export const selectFilteredTodos = createSelector(
  [selectTodoItems, selectFilter],
  (items, filter) => {
    switch (filter) {
      case "active":
        return items.filter((t) => !t.completed);
      case "completed":
        return items.filter((t) => t.completed);
      default:
        return items;
    }
  }
);

// Multiple inputs
export const selectTodoStats = createSelector([selectTodoItems], (items) => ({
  total: items.length,
  active: items.filter((t) => !t.completed).length,
  completed: items.filter((t) => t.completed).length,
}));
```

### Parameterized Selectors (Factory Pattern)

```js
// Selector that takes an argument
export const makeSelectTodoById = () =>
  createSelector([(state) => state.todos.items, (_, id) => id], (items, id) =>
    items.find((t) => t.id === id)
  );

// Usage — each component instance gets its own memoized selector
function TodoItem({ id }) {
  const selectTodo = useMemo(makeSelectTodoById, []);
  const todo = useSelector((state) => selectTodo(state, id));
  return <li>{todo?.text}</li>;
}
```

### When createSelector Recalculates

```
state.todos.items changes  →  selectFilteredTodos recalculates
state.todos.filter changes →  selectFilteredTodos recalculates
state.counter changes      →  selectFilteredTodos does NOT recalculate (different input)
Same state                 →  Returns cached result (same array reference!)
```

---

## 9. RTK Query — Complete Guide

RTK Query is a data-fetching and caching tool built into RTK. Think of it as React Query but integrated with Redux.

### Install (already in @reduxjs/toolkit)

```bash
npm install @reduxjs/toolkit react-redux
```

### Why RTK Query?

| Without RTK Query             | With RTK Query                       |
| ----------------------------- | ------------------------------------ |
| Manual loading/error state    | Automatic `isLoading`, `isError`     |
| Manual cache management       | Automatic caching by endpoint + args |
| Duplicate requests            | Auto-deduplication                   |
| Manual refetch on mutations   | Auto-invalidation via tags           |
| useEffect + fetch boilerplate | Single hook call                     |

### Step 1 — Create an API Slice

```js
// store/api/postsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
  // Key in Redux state (must be unique)
  reducerPath: "postsApi",

  // Base configuration for all requests
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
    // Add auth headers to every request
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Tag types for cache invalidation
  tagTypes: ["Post", "Comment", "User"],

  // Define endpoints
  endpoints: (builder) => ({
    // QUERY — fetches and caches data
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Post"],
    }),

    getPostById: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    getPostsByUser: builder.query({
      query: (userId) => `/posts?userId=${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post", id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // MUTATION — creates/updates/deletes data
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      // After create, invalidate the list cache → auto-refetch
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      // Invalidate only this specific post
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

// Auto-generated hooks (naming: use + EndpointName + Query/Mutation)
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
```

### Step 2 — Add to Store

```js
// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "./api/postsApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer, // RTK Query manages its own state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware), // required for caching!
});
```

### Step 3 — Use in Components

```jsx
// PostList.jsx
import { useGetPostsQuery, useDeletePostMutation } from "../store/api/postsApi";

export function PostList() {
  const {
    data: posts, // the result data
    isLoading, // true on first load, no cached data
    isFetching, // true whenever fetching (including refetch)
    isSuccess, // true if last request succeeded
    isError, // true if last request failed
    error, // the error object
    refetch, // manually trigger a refetch
  } = useGetPostsQuery();

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>
          {post.title}
          <button onClick={() => deletePost(post.id)} disabled={isDeleting}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```jsx
// CreatePostForm.jsx
import { useState } from "react";
import { useCreatePostMutation } from "../store/api/postsApi";

export function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [createPost, { isLoading, isSuccess, isError, error, reset }] =
    useCreatePostMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    await createPost({ title, body, userId: 1 });
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Create Post"}
      </button>
      {isSuccess && <p>Post created!</p>}
      {isError && <p>Error: {error.message}</p>}
    </form>
  );
}
```

```jsx
// PostDetail.jsx
import { useGetPostByIdQuery } from "../store/api/postsApi";

export function PostDetail({ postId }) {
  const { data: post, isLoading } = useGetPostByIdQuery(postId, {
    // Options:
    skip: !postId, // don't fetch if postId is null
    pollingInterval: 30_000, // refetch every 30 seconds
    refetchOnMountOrArgChange: true, // always refetch on mount
    refetchOnFocus: true, // refetch when window regains focus
    refetchOnReconnect: true, // refetch on network reconnect
  });

  if (isLoading) return <Spinner />;
  return (
    <article>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </article>
  );
}
```

---

## 10. RTK Query Advanced

### Cache Behavior & Tags Explained

Tags are the key to automatic refetching.

```
providesTags  → "this query provides data tagged as X"
invalidatesTags → "this mutation invalidates all queries tagged X → auto-refetch"
```

```js
// Detailed tag patterns

// Pattern 1: List + individual items
getPosts: builder.query({
  query: () => "/posts",
  providesTags: (result) =>
    result
      ? [
          { type: "Post", id: "LIST" },          // for the list
          ...result.map(({ id }) => ({ type: "Post", id })),  // for each item
        ]
      : [{ type: "Post", id: "LIST" }],
}),

// When deleting, invalidate both list and the specific post:
deletePost: builder.mutation({
  invalidatesTags: (result, error, id) => [
    { type: "Post", id },
    { type: "Post", id: "LIST" },
  ],
}),

// When creating, only invalidate list (new post doesn't have an id yet):
createPost: builder.mutation({
  invalidatesTags: [{ type: "Post", id: "LIST" }],
}),
```

### transformResponse — Shape the Data

```js
getPosts: builder.query({
  query: () => "/posts",
  // Transform before caching
  transformResponse: (response) => {
    return response.map((post) => ({
      ...post,
      titleUpperCase: post.title.toUpperCase(),
    }));
  },
}),

// Paginated response shape
getPagedPosts: builder.query({
  query: ({ page, limit }) => `/posts?_page=${page}&_limit=${limit}`,
  transformResponse: (response, meta) => {
    const total = parseInt(meta.response.headers.get("X-Total-Count"), 10);
    return { posts: response, total, pages: Math.ceil(total / 10) };
  },
}),
```

### Pagination

```js
// In endpoints
getPostsPaged: builder.query({
  query: ({ page = 1, limit = 10 }) => `/posts?_page=${page}&_limit=${limit}`,
  providesTags: (result, error, { page }) => [{ type: "Post", id: `PAGE_${page}` }],
}),
```

```jsx
// Paginated component
function PaginatedPosts() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetPostsPagedQuery({
    page,
    limit: 10,
  });

  // Prefetch next page
  const prefetchPage = usePrefetch("getPostsPaged");

  return (
    <div>
      {isLoading ? <Spinner /> : <PostList posts={data?.posts} />}
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1 || isFetching}
        onMouseEnter={() => prefetchPage({ page: page - 1 })}>
        ← Prev
      </button>
      <span>Page {page}</span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={isFetching}
        onMouseEnter={() => prefetchPage({ page: page + 1 })}>
        Next →
      </button>
    </div>
  );
}
```

### Optimistic Updates

```js
updatePost: builder.mutation({
  query: ({ id, ...patch }) => ({
    url: `/posts/${id}`,
    method: "PATCH",
    body: patch,
  }),

  // Optimistic update — update cache before response
  async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
    // 1. Optimistically update the cache
    const patchResult = dispatch(
      postsApi.util.updateQueryData("getPostById", id, (draft) => {
        Object.assign(draft, patch);  // Immer draft!
      })
    );

    try {
      await queryFulfilled;  // 2. Wait for real response
    } catch {
      patchResult.undo();    // 3. Rollback on error
    }
  },
}),
```

### Custom baseQuery — Handle Auth Refresh

```js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenRefreshed, loggedOut } from "../authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// Wrapper that handles 401 → refresh token → retry
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to refresh
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult.data) {
      api.dispatch(tokenRefreshed(refreshResult.data));
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(loggedOut());
    }
  }

  return result;
};

// Use in createApi
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  // ...
});
```

### Manually Updating Cache

```js
// Force refetch
dispatch(postsApi.util.invalidateTags(["Post"]));

// Update cache manually without refetch
dispatch(
  postsApi.util.updateQueryData("getPosts", undefined, (draftPosts) => {
    draftPosts.push({ id: 999, title: "New post" });
  })
);

// Prefetch in event handlers
const prefetchPost = usePrefetch("getPostById");
<div onMouseEnter={() => prefetchPost(post.id)}>
  <PostCard post={post} />
</div>;
```

### Polling

```jsx
function LiveDashboard() {
  const { data } = useGetStatsQuery(undefined, {
    pollingInterval: 5000, // refetch every 5 seconds
    skipPollingIfUnfocused: true, // pause when tab is not active
  });
  return <Stats data={data} />;
}
```

---

## 11. Project Folder Structure

```
src/
├── app/
│   ├── store.ts           ← configureStore + all reducers/middleware
│   └── hooks.ts           ← typed useAppDispatch, useAppSelector
│
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── LoginForm.tsx
│   │   └── authSelectors.ts
│   │
│   ├── posts/
│   │   ├── postsSlice.ts
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   └── CreatePostForm.tsx
│   │
│   └── cart/
│       ├── cartSlice.ts
│       └── CartSummary.tsx
│
└── services/
    ├── api.ts             ← RTK Query createApi (shared baseQuery)
    ├── postsApi.ts        ← posts endpoints
    └── usersApi.ts        ← users endpoints
```

### Typed Hooks (TypeScript)

```ts
// app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 12. TypeScript with RTK

### Typed Slice

```ts
// features/counter/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CounterState = {
  value: 0,
  status: "idle",
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});
```

### Typed createAsyncThunk

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../../app/store";

// Specify types: [ReturnType, ArgType, ThunkAPIConfig]
export const fetchUserById = createAsyncThunk<
  User, // return type
  string, // argument type (userId)
  {
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: string;
  }
>("users/fetchById", async (userId: string, { rejectWithValue }) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    return rejectWithValue("Failed to fetch user");
  }
  return (await response.json()) as User;
});
```

### Typed RTK Query

```ts
// services/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsResponse {
  posts: Post[];
  total: number;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
    }),
  }),
});
```

---

## 13. Testing Redux

### Testing Reducers (Pure Functions)

```js
// counterSlice.test.js
import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
} from "./counterSlice";

describe("counterReducer", () => {
  it("should return initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual({
      value: 0,
      step: 1,
      history: [],
    });
  });

  it("should increment", () => {
    const state = { value: 5, step: 1, history: [] };
    expect(counterReducer(state, increment())).toEqual({
      value: 6,
      step: 1,
      history: [6],
    });
  });

  it("should handle incrementByAmount", () => {
    const state = { value: 5, step: 1, history: [] };
    expect(counterReducer(state, incrementByAmount(3))).toEqual(
      expect.objectContaining({ value: 8 })
    );
  });
});
```

### Testing Async Thunks

```js
import { configureStore } from "@reduxjs/toolkit";
import usersReducer, { fetchUserById } from "./usersSlice";

// Mock fetch
global.fetch = jest.fn();

describe("fetchUserById thunk", () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { users: usersReducer } });
    fetch.mockClear();
  });

  it("dispatches fulfilled on success", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", name: "John" }),
    });

    await store.dispatch(fetchUserById("1"));
    const state = store.getState().users;
    expect(state.entities["1"]).toEqual({ id: "1", name: "John" });
    expect(state.loading).toBe("idle");
  });

  it("dispatches rejected on failure", async () => {
    fetch.mockRejectedValue(new Error("Network error"));

    await store.dispatch(fetchUserById("1"));
    const state = store.getState().users;
    expect(state.error).toBe("Network error");
  });
});
```

### Testing Selectors

```js
import { selectFilteredTodos } from "./todosSlice";

describe("selectFilteredTodos", () => {
  const state = {
    todos: {
      items: [
        { id: 1, text: "Buy milk", completed: false },
        { id: 2, text: "Read book", completed: true },
      ],
      filter: "active",
    },
  };

  it("filters active todos", () => {
    const result = selectFilteredTodos(state);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Buy milk");
  });
});
```

### Testing RTK Query with MSW (Mock Service Worker)

```js
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "../test-utils";
import { PostList } from "./PostList";

const server = setupServer(
  http.get("/api/posts", () => {
    return HttpResponse.json([
      { id: 1, title: "First post" },
      { id: 2, title: "Second post" },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders posts", async () => {
  const { findByText } = renderWithProviders(<PostList />);
  expect(await findByText("First post")).toBeInTheDocument();
  expect(await findByText("Second post")).toBeInTheDocument();
});
```

---

## 14. Interview Q&A

### Core Redux Questions

**Q: What is the difference between Redux and Context API?**

Context API is a React primitive for passing data through the tree — it re-renders all consumers on every state change and has no built-in optimization. Redux uses selective subscriptions via `useSelector` + reference equality checks, so only components whose selected slice changed re-render. Redux also has DevTools, middleware, and a structured update pattern.

**Q: Why must reducers be pure functions?**

Pure = same inputs → same output, no side effects. Redux relies on this to: (1) detect changes using `===` comparison, (2) enable time-travel debugging (replay actions), (3) make state predictable and testable.

**Q: What happens when you mutate state directly in a reducer?**

The reference doesn't change, so `===` comparison says "nothing changed" → React-Redux won't trigger re-renders → UI goes stale. Always return a new object/array.

**Q: What is Immer and why does RTK use it?**

Immer creates a mutable draft proxy of your state. You write imperative mutations on the draft, and Immer produces a new immutable object. RTK uses Immer in `createSlice` so you can write `state.count++` instead of `{ ...state, count: state.count + 1 }`, reducing bugs from accidentally forgetting to spread.

**Q: What is the difference between `isLoading` and `isFetching` in RTK Query?**

|                                   | `isLoading` | `isFetching` |
| --------------------------------- | ----------- | ------------ |
| First load (no cache)             | `true`      | `true`       |
| Subsequent refetch (cache exists) | `false`     | `true`       |
| Mutation in progress              | `false`     | `false`      |

Use `isLoading` to show skeleton on first load. Use `isFetching` to show a subtle refresh indicator.

**Q: How does RTK Query cache work?**

Each endpoint+args combination gets a cache entry. The cache is keyed by `reducerPath + endpointName + serializedArgs`. Cache entries are kept for `keepUnusedDataFor` seconds (default 60) after the last subscriber unmounts. Accessing the same query from multiple components shares one cache entry and one network request.

**Q: Explain tag-based invalidation in RTK Query.**

Tags are labels. `providesTags` marks what data a query caches. `invalidatesTags` marks what data a mutation makes stale. When a mutation runs and its `invalidatesTags` overlaps with any query's `providesTags`, RTK Query refetches those queries automatically. This is how you keep lists fresh after a create/delete.

**Q: What is the difference between `createAsyncThunk` returning a value vs calling `rejectWithValue`?**

- **Thrown error** → dispatches `rejected` action, `action.error` has the error info, `action.payload` is undefined.
- **`rejectWithValue(data)`** → dispatches `rejected` action, `action.payload` has your custom data, `action.error` is a generic "Rejected" error. Use `rejectWithValue` to pass structured error info to the reducer/component.

**Q: How do you handle optimistic updates in RTK Query?**

Use `onQueryStarted` in a mutation endpoint. Call `postsApi.util.updateQueryData(...)` to update the cache immediately (before the response). Await `queryFulfilled`, and if it throws, call `patchResult.undo()` to roll back. This gives instant UI feedback with safe rollback on network failure.

**Q: How does `createEntityAdapter` normalize state?**

It stores items as `{ ids: [], entities: {} }` — `ids` is an ordered array of IDs for iteration, `entities` is a lookup object by ID for O(1) access. It generates CRUD methods (addOne, updateOne, removeOne, etc.) that operate on this shape, eliminating the need to write spread-and-filter boilerplate.

**Q: What is `createSelector` and when would you use it?**

`createSelector` from Reselect creates memoized selectors. A selector only recomputes when its input selectors return different values. Use it whenever your selector does expensive computation (filter, sort, map, aggregation) that would otherwise run on every render. Without memoization, the selector returns a new array/object reference each time → `useSelector` thinks state changed → component re-renders.

**Q: What middleware does `configureStore` add by default?**

1. `redux-thunk` — lets you dispatch functions (async actions)
2. Serializability check (dev only) — warns if non-serializable values (functions, Promises, class instances) are in state or actions
3. Immutability check (dev only) — warns if state is mutated outside reducers

**Q: Can you use RTK Query with a REST and a GraphQL API at the same time?**

Yes. Create two separate `createApi` instances with different `reducerPath` values and `baseQuery` configurations. Add both reducers and both middleware to `configureStore`.

---

_This guide covers Redux from first principles through RTK Query advanced patterns. Practice: build a Todo app with plain Redux → migrate it to RTK → add RTK Query for server-synced todos._

{% endraw %}
