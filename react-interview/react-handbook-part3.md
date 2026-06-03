---
layout: note
prev_url: /react-interview/react-handbook-part2
prev_title: Part 2
next_url: /react-interview/react-handbook-part4
next_title: Part 4
---

{% raw %}

# 🚀 Senior Frontend Engineer / React Developer Interview Handbook

## Part 3: Sections 11–15 | Machine Coding → Testing → Security → Build → Micro Frontends

---

# SECTION 11: React Machine Coding Round

---

## 11.1 Machine Coding Strategy

Before coding, always:

1. **Clarify requirements** (2 min) — edge cases, constraints.
2. **Sketch component tree** (2 min) — on paper or whiteboard.
3. **Identify state** — what changes? Where does it live?
4. **Start with data types** — TypeScript interfaces first.
5. **Build skeleton** then fill in logic.
6. **Add edge cases** — empty states, loading, errors.
7. **Optimize** — only if time permits, mention React.memo/useMemo.

---

## 11.2 Todo App (with Full Features)

```jsx
// Types
const FILTERS = { ALL: "all", ACTIVE: "active", COMPLETED: "completed" };

// Main component
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState(FILTERS.ALL);

  const addTodo = useCallback(
    (e) => {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      setTodos((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text, completed: false },
      ]);
      setInput("");
    },
    [input]
  );

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FILTERS.ACTIVE:
        return todos.filter((t) => !t.completed);
      case FILTERS.COMPLETED:
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  return (
    <div className="todo-app">
      <h1>Todos</h1>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>

      {todos.length > 0 && (
        <footer>
          <span>{activeCount} items left</span>
          <FilterBar filter={filter} onFilter={setFilter} />
          {activeCount < todos.length && (
            <button onClick={clearCompleted}>Clear completed</button>
          )}
        </footer>
      )}
    </div>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => (
  <li className={todo.completed ? "completed" : ""}>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <span>{todo.text}</span>
    <button
      onClick={() => onDelete(todo.id)}
      aria-label={`Delete ${todo.text}`}>
      ×
    </button>
  </li>
));

const FilterBar = React.memo(({ filter, onFilter }) => (
  <div role="group" aria-label="Filter todos">
    {Object.values(FILTERS).map((f) => (
      <button
        key={f}
        className={filter === f ? "active" : ""}
        onClick={() => onFilter(f)}
        aria-pressed={filter === f}>
        {f}
      </button>
    ))}
  </div>
));
```

**Edge cases:** Empty input, duplicate todos (allowed), all completed state, persistence (localStorage via useLocalStorage hook).

---

## 11.3 Infinite Scroll

```jsx
function InfiniteScrollList() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchPage(page);
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasNextPage);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // IntersectionObserver: trigger when loader enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" } // trigger 200px before reaching bottom
    );
    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadMore]);

  return (
    <div>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
      <div ref={loaderRef}>
        {loading && <Spinner />}
        {!hasMore && <p>All items loaded</p>}
      </div>
    </div>
  );
}
```

**Edge cases:** Duplicate loads (loading guard), race conditions, empty state, error retry, back button behavior.

---

## 11.4 Debounced Search with Autocomplete

```jsx
function SearchWithAutocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    fetchSuggestions(debouncedQuery, { signal: abortRef.current.signal })
      .then((data) => {
        setSuggestions(data);
        setIsOpen(data.length > 0);
        setSelectedIndex(-1);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setSuggestions([]);
      })
      .finally(() => setLoading(false));

    return () => abortRef.current?.abort();
  }, [debouncedQuery]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        if (selectedIndex >= 0) selectSuggestion(suggestions[selectedIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.label);
    setIsOpen(false);
    setSuggestions([]);
    // trigger search / navigation
  };

  return (
    <div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)} // delay for click
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={
          selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
        }
      />
      {loading && <Spinner />}
      {isOpen && (
        <ul id="suggestions-list" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              className={i === selectedIndex ? "highlighted" : ""}
              onMouseDown={() => selectSuggestion(s)} // mousedown before blur
            >
              {highlightMatch(s.label, query)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Accessibility:** ARIA combobox pattern, keyboard navigation (Arrow/Enter/Escape), screen reader announcement.

---

## 11.5 Nested Comments

```jsx
// Recursive comment component
function Comment({ comment, depth = 0 }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="comment" style={{ marginLeft: depth * 24 }}>
      <div className="comment-header">
        <Avatar user={comment.author} />
        <span className="username">{comment.author.name}</span>
        <span className="time">{formatRelativeTime(comment.createdAt)}</span>
        {comment.replies?.length > 0 && (
          <button onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? `▶ ${comment.replies.length} replies` : "▼ collapse"}
          </button>
        )}
      </div>

      <p className="comment-body">{comment.text}</p>

      <div className="comment-actions">
        <button onClick={() => setShowReplyBox((r) => !r)}>Reply</button>
        <LikeButton commentId={comment.id} />
      </div>

      {showReplyBox && (
        <ReplyBox
          parentId={comment.id}
          onSubmit={() => setShowReplyBox(false)}
        />
      )}

      {/* Recursive rendering */}
      {!collapsed &&
        comment.replies?.map((reply) => (
          <Comment key={reply.id} comment={reply} depth={depth + 1} />
        ))}
    </div>
  );
}

// Flatten tree for efficient rendering at scale
// Consider: flat array with parentId, render virtual list
function flattenComments(comments, parentId = null, depth = 0) {
  return comments
    .filter((c) => c.parentId === parentId)
    .flatMap((c) => [
      { ...c, depth },
      ...flattenComments(comments, c.id, depth + 1),
    ]);
}
```

---

## 11.6 Data Table (Sortable, Filterable, Paginated)

```jsx
function DataTable({ data, columns }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredData = useMemo(() => {
    if (!filter) return data;
    const lower = filter.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(row[col.key]).toLowerCase().includes(lower))
    );
  }, [data, filter, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
    setCurrentPage(1); // reset page on sort
  };

  return (
    <div>
      <input
        placeholder="Search..."
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setCurrentPage(1);
        }}
      />

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: "pointer" }}>
                {col.label}
                {sortConfig.key === col.key &&
                  (sortConfig.direction === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />
    </div>
  );
}
```

---

## 11.7 Shopping Cart

```jsx
// Cart store with Zustand
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0)
            return { items: state.items.filter((i) => i.id !== id) };
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: "shopping-cart" } // persists to localStorage
  )
);

function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItem = useCartStore((s) =>
    s.items.find((i) => i.id === product.id)
  );

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {cartItem ? (
        <QuantitySelector
          quantity={cartItem.quantity}
          onIncrease={() => addItem(product)}
          onDecrease={() =>
            useCartStore
              .getState()
              .updateQuantity(product.id, cartItem.quantity - 1)
          }
        />
      ) : (
        <button onClick={() => addItem(product)}>Add to Cart</button>
      )}
    </div>
  );
}
```

---

# SECTION 12: React Testing

---

## 12.1 Testing Philosophy

```
Testing Trophy (Kent C. Dodds):
          ╔══════════╗
          ║ E2E (few)║
         ╔╩══════════╩╗
         ║ Integration║
        ╔╩════════════╩╗
        ║  Unit (fast) ║
       ╔╩══════════════╩╗
       ║  Static (types)║
       ╚════════════════╝
```

**Rule of thumb:** Write more integration tests than unit tests. Test behavior, not implementation.

---

## 12.2 Jest — Unit Testing

### Setup

```js
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
};
```

### Testing Pure Functions

```js
// utils/formatPrice.test.js
import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("formats dollars with cents", () => {
    expect(formatPrice(10.5)).toBe("$10.50");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("rounds to 2 decimal places", () => {
    expect(formatPrice(10.999)).toBe("$11.00");
  });
});
```

### Testing Custom Hooks

```js
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("starts at initial value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("increments count", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

---

## 12.3 React Testing Library (RTL)

### Core Principles

1. Test what the **user sees and interacts with** — not implementation details.
2. Use **accessible queries**: `getByRole`, `getByLabelText`, `getByText`.
3. Avoid querying by class names, test IDs (unless necessary), or component internals.

### Query Priority

```
Most preferred → Least preferred:
getByRole > getByLabelText > getByPlaceholderText > getByText > getByDisplayValue > getByAltText > getByTitle > getByTestId
```

### Component Testing

```jsx
// LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows error on invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/invalid email/i);
  });

  it("calls onSubmit with credentials on valid input", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "SecurePass123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "SecurePass123",
    });
  });

  it("shows loading state during submission", async () => {
    const mockSubmit = jest.fn(() => new Promise(() => {})); // never resolves
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
  });
});
```

### Mocking API Calls (MSW — Mock Service Worker)

```js
// mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: "Alice" }]));
  }),

  rest.post("/api/login", async (req, res, ctx) => {
    const { email, password } = await req.json();
    if (password === "wrong") {
      return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
    }
    return res(ctx.json({ token: "fake-token", user: { email } }));
  }),
];

// mocks/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const server = setupServer(...handlers);

// setupTests.js
import { server } from "./mocks/server";
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 12.4 RTL vs Enzyme

|                | React Testing Library  | Enzyme                        |
| -------------- | ---------------------- | ----------------------------- |
| Philosophy     | Test behavior/UX       | Test implementation           |
| API            | DOM-centric            | Component-centric             |
| Queries        | By role, text, label   | By component type, props      |
| Shallow render | No (renders full tree) | Yes (isolates component)      |
| Active         | Yes                    | No (deprecated for React 17+) |
| Recommendation | ✅ Use this            | ❌ Avoid                      |

---

## 12.5 What NOT to Test

1. **Implementation details**: Internal state, private methods, component structure.
2. **Library code**: Assume React, Router, Redux work correctly.
3. **Trivial code**: Passthrough props, simple getters.
4. **Styles**: CSS values, class names (unless testing CSS-in-JS logic).
5. **Third-party components**: Trust their tests.

---

## 12.6 E2E Testing with Cypress

```js
// cypress/e2e/checkout.cy.js
describe("Checkout Flow", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products", { fixture: "products.json" });
    cy.visit("/products");
  });

  it("completes a purchase", () => {
    // Add to cart
    cy.findByText("Add to Cart").first().click();
    cy.findByRole("status", { name: /cart/i }).should("contain", "1");

    // Go to cart
    cy.findByRole("link", { name: /cart/i }).click();
    cy.url().should("include", "/cart");

    // Proceed to checkout
    cy.findByRole("button", { name: /checkout/i }).click();

    // Fill shipping info
    cy.findByLabelText(/email/i).type("test@example.com");
    cy.findByLabelText(/address/i).type("123 Main St");

    // Complete order
    cy.intercept("POST", "/api/orders", { id: "order-123" }).as("createOrder");
    cy.findByRole("button", { name: /place order/i }).click();
    cy.wait("@createOrder");

    // Success page
    cy.findByText(/order confirmed/i).should("be.visible");
  });
});
```

---

## 12.7 Test Coverage Strategy

```
100% coverage does not mean bug-free.
Focus on: critical paths, edge cases, business logic.

Coverage targets (realistic):
- Unit: 80%+
- Integration: Key user flows
- E2E: Top 5 critical paths only
```

---

# SECTION 13: React Security

---

## 13.1 XSS (Cross-Site Scripting)

### What It Is

Attacker injects malicious scripts into your UI that execute in users' browsers.

### React's Built-in Protection

```jsx
// React automatically escapes this — safe
const userInput = '<script>alert("xss")</script>';
return <div>{userInput}</div>;
// Renders as text: &lt;script&gt;alert("xss")&lt;/script&gt;
```

### The Dangerous API

```jsx
// ❌ DANGEROUS: bypasses React's XSS protection
<div dangerouslySetInnerHTML={{ __html: userContent }} />;

// ✅ Always sanitize before using dangerouslySetInnerHTML
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />;
```

### Other XSS Vectors

```jsx
// ❌ href injection
const url = 'javascript:alert("xss")'; // user-provided
<a href={url}>Click me</a>;

// ✅ Validate URL scheme
function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
<a href={isSafeUrl(url) ? url : "#"}>Click me</a>;
```

---

## 13.2 CSRF (Cross-Site Request Forgery)

### What It Is

Attacker tricks a logged-in user's browser into making unauthorized requests.

### React-Level Mitigations

```jsx
// 1. Include CSRF token in all mutating requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

api.interceptors.request.use((config) => {
  if (["post", "put", "delete", "patch"].includes(config.method)) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

// 2. SameSite cookies (server-side, but frontend devs should know)
// Set-Cookie: sessionId=abc; SameSite=Strict; Secure; HttpOnly
// SameSite=Strict: cookie not sent in cross-site requests
```

---

## 13.3 Authentication & Token Storage

### JWT Storage Options

| Storage              | XSS Risk | CSRF Risk | Notes                   |
| -------------------- | -------- | --------- | ----------------------- |
| localStorage         | HIGH     | None      | Accessible by JS        |
| sessionStorage       | HIGH     | None      | Cleared on tab close    |
| Memory (React state) | None     | None      | Lost on page refresh    |
| HttpOnly Cookie      | None     | Medium    | Best for session tokens |
| Cookie + SameSite    | None     | Low       | Best practice           |

### Recommended Approach

```jsx
// ✅ Store access token in memory only
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

// HttpOnly cookie for refresh token (server sets it)
// When access token expires: hit /api/refresh → server issues new access token

// In axios interceptor:
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    // refresh token is in HttpOnly cookie — browser sends it automatically
    await api.post("/auth/refresh");
    const newToken = await api.get("/auth/token");
    setAccessToken(newToken.data.accessToken);
    return api(error.config); // retry
  }
});
```

---

## 13.4 Content Security Policy (CSP)

```html
<!-- Prevent inline scripts, restrict sources -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' 'nonce-{RANDOM_NONCE}';
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
           img-src 'self' https://cdn.example.com data:;
           connect-src 'self' https://api.example.com;
           font-src 'self' https://fonts.gstatic.com;" />
```

> With a strict CSP, even if XSS code is injected, it cannot execute without the correct nonce.

---

## 13.5 Production Security Checklist

```markdown
## React App Security Checklist

### XSS Prevention

- [ ] Never use dangerouslySetInnerHTML without DOMPurify sanitization
- [ ] Validate all URL props to prevent javascript: scheme injection
- [ ] Implement CSP headers with strict policy
- [ ] Use `rel="noopener noreferrer"` on external links

### Authentication

- [ ] Store JWT access tokens in memory (not localStorage)
- [ ] Store refresh tokens in HttpOnly, Secure, SameSite=Strict cookies
- [ ] Implement token rotation on refresh
- [ ] Add logout across all tabs (BroadcastChannel)

### API Security

- [ ] Include CSRF token in all mutating requests
- [ ] Implement request rate limiting
- [ ] Validate and sanitize all user inputs
- [ ] Never expose sensitive data in URL params

### Dependencies

- [ ] Run `npm audit` regularly in CI
- [ ] Use Dependabot or Snyk for automated vulnerability alerts
- [ ] Pin critical dependency versions
- [ ] Review new dependency permissions before install

### HTTPS & Headers

- [ ] HTTPS everywhere (including dev via mkcert)
- [ ] HSTS header enabled
- [ ] X-Frame-Options: DENY (prevent clickjacking)
- [ ] X-Content-Type-Options: nosniff

### Secrets

- [ ] No API keys, tokens, or passwords in frontend code or git history
- [ ] Use environment variables for config (never committed)
- [ ] Git pre-commit hooks to catch accidental secrets (git-secrets, detect-secrets)
```

---

# SECTION 14: React Build and Deployment

---

## 14.1 Build Process

### What Happens During `npm run build`?

```
Source Files (.jsx, .tsx, .scss)
        │
        ▼
1. TypeScript Compilation
   • Type checking (tsc)
   • Strip types → JavaScript
        │
        ▼
2. Babel Transpilation
   • JSX → React.createElement() / jsx()
   • Modern JS → backwards-compatible JS
   • Based on .browserslistrc targets
        │
        ▼
3. Module Bundling (Webpack / Vite / Rollup)
   • Resolve imports/requires
   • Build dependency graph
   • Code splitting by route/component
   • Tree shaking (dead code removal)
        │
        ▼
4. Optimization
   • Minification (Terser for JS, cssnano for CSS)
   • CSS extraction and optimization
   • Asset optimization (images, fonts)
   • Content hashing for cache busting
        │
        ▼
5. Output: /build or /dist
   • index.html (with asset references)
   • main.[hash].js (app bundle)
   • [route].[hash].js (lazy chunks)
   • [hash].css (styles)
   • assets/ (images, fonts)
```

### Vite vs Webpack vs Create React App

|                  | Vite                 | Webpack (CRA)        | Parcel      |
| ---------------- | -------------------- | -------------------- | ----------- |
| Dev server       | ESM native (instant) | Bundled (slow start) | Zero-config |
| HMR              | Very fast            | Slower               | Fast        |
| Build            | Rollup (optimized)   | Webpack              | Custom      |
| Config           | Minimal              | Complex              | Zero-config |
| Modern           | ✅                   | Legacy               | ✅          |
| Plugin ecosystem | Growing              | Mature               | Small       |

### Create React App — Commands

```bash
# JavaScript
npx create-react-app my-app
cd my-app && npm start

# TypeScript
npx create-react-app my-app --template typescript

# ⚠️ CRA is no longer maintained — avoid for new projects
```

### Vite — Commands (Recommended)

```bash
# Interactive setup (picks framework + variant)
npm create vite@latest my-app
cd my-app && npm install && npm run dev

# JavaScript + React (non-interactive)
npm create vite@latest my-app -- --template react

# TypeScript + React
npm create vite@latest my-app -- --template react-ts

# Using yarn / pnpm
yarn create vite my-app --template react-ts
pnpm create vite my-app --template react-ts

# Scripts after setup
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build → /dist
npm run preview  # locally preview /dist
npm run lint     # ESLint
```

### Parcel — Commands

```bash
# No config needed — install and go
npm install --save-dev parcel
mkdir my-app && cd my-app && npm init -y

# Create entry point
echo '<html><body><script type="module" src="./src/index.jsx"></script></body></html>' > index.html
mkdir src && touch src/index.jsx

# Scripts in package.json
# "start": "parcel index.html"
# "build": "parcel build index.html"

npm start       # dev server with HMR
npm run build   # output → /dist
```

### Next.js — Commands (SSR / Full-stack React)

```bash
# JavaScript
npx create-next-app@latest my-app

# TypeScript (recommended)
npx create-next-app@latest my-app --typescript

# With all options pre-set (TypeScript, ESLint, Tailwind, App Router)
npx create-next-app@latest my-app \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

npm run dev    # http://localhost:3000
npm run build  # production build
npm run start  # run production build locally
```

### Vite Configuration

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }), // bundle analysis
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 500, // warn if chunk > 500KB
  },
  resolve: {
    alias: { "@": "/src" },
  },
});
```

---

## 14.2 CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run test -- --coverage --ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci && npm run build

      # Deploy to AWS S3 + CloudFront
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete \
            --cache-control "max-age=31536000,immutable" \
            --exclude "index.html"
          aws s3 cp dist/index.html s3://${{ secrets.S3_BUCKET }}/index.html \
            --cache-control "no-cache,no-store,must-revalidate"

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## 14.3 Nginx Configuration

```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.com;
    root /var/www/myapp/dist;
    index index.html;

    # SSL
    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    # Serve index.html for ALL routes (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache hashed assets forever
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Never cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

---

## 14.4 Docker

```dockerfile
# Multi-stage Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

# SECTION 15: Micro Frontend Architecture

---

## 15.1 What is Micro Frontend?

### Concept

Micro frontends extend microservices principles to the frontend. A large web app is split into **independently developed, deployed, and owned** frontend applications that appear as one to the user.

```
Traditional Monolith:         Micro Frontend:
┌────────────────────┐        ┌──────────┬──────────┬──────────┐
│                    │        │  Team A  │  Team B  │  Team C  │
│  One Big Frontend  │        │  Header  │  Product │  Cart    │
│  (single deploy)   │        │  Repo    │  Catalog │  Checkout│
│                    │        │  Deploy  │  Deploy  │  Deploy  │
└────────────────────┘        └──────────┴──────────┴──────────┘
                                          │
                                   Shell / Container App
                              (owns routing + composes MFEs)
```

### Why Use It?

| Problem (Monolith)           | Solution (Micro Frontend)    |
| ---------------------------- | ---------------------------- |
| Large team = merge conflicts | Independent team ownership   |
| Deploy one → risk breaks all | Independent deployments      |
| Forced tech stack            | Teams choose their own stack |
| Slow CI/CD (huge test suite) | Faster per-team pipelines    |
| Hard to scale teams          | Clear domain ownership       |
| One team blocks all others   | Parallel development         |

### Drawbacks

- **Increased complexity**: Multiple builds, deployments, versioning.
- **Bundle duplication**: React loaded multiple times without sharing config.
- **Cross-MFE bugs**: Hard to reproduce — which app caused it?
- **UI inconsistency**: Design drift across teams without a shared system.
- **Performance**: Sequential network waterfalls loading MFEs.
- **Testing**: Integration testing across MFE boundaries is hard.

---

## 15.2 How to Split a Monolith into Micro Frontends

### Step 1 — Identify Domain Boundaries

Split by **business domain**, not by technical layers.

```
❌ Bad split (technical layers):
   MFE-1: All buttons/inputs (UI components)
   MFE-2: All API calls
   MFE-3: All pages

✅ Good split (business domains):
   MFE-1: Auth (login, register, forgot password)
   MFE-2: Product Catalog (browse, search, filters)
   MFE-3: Cart & Checkout (cart, payment, order confirmation)
   MFE-4: User Account (profile, orders, settings)
   Shell:  Navigation, routing, auth state handoff
```

### Step 2 — Define the Folder / Repo Structure

**Polyrepo** (separate git repo per MFE — most common at scale):

```
github.com/myorg/shell-app        ← composes everything
github.com/myorg/mfe-auth
github.com/myorg/mfe-catalog
github.com/myorg/mfe-cart
github.com/myorg/design-system    ← shared npm package
```

**Monorepo** (all MFEs in one repo, separate builds — good for smaller orgs):

```
/packages
  /shell
  /mfe-auth
  /mfe-catalog
  /mfe-cart
  /design-system
/package.json   ← workspace root (npm workspaces / turborepo)
```

### Step 3 — Choose an Integration Approach

| Approach                    | How                                      | When to use                             |
| --------------------------- | ---------------------------------------- | --------------------------------------- |
| **Module Federation**       | JS bundles loaded at runtime via Webpack | Same-framework teams (React + React)    |
| **iframes**                 | Each MFE in its own iframe               | Strong isolation needed, legacy MFEs    |
| **Web Components**          | Custom Elements API                      | Cross-framework (React + Vue + Angular) |
| **Single-SPA**              | JS framework for routing between MFEs    | Mixed frameworks, SPA feel              |
| **Server-Side Composition** | Server assembles HTML fragments          | SSR, Edge computing (Next.js + Vercel)  |
| **Build-time Integration**  | npm packages, imported at build time     | Shared component libraries only         |

### Step 4 — Scaffold Each MFE

Each MFE is a standalone React app that can also run in isolation:

```
mfe-catalog/
├── public/
│   └── index.html          ← standalone dev entry
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── bootstrap.jsx       ← async bootstrap (required for MF)
│   └── index.jsx           ← entry: standalone OR remote
├── webpack.config.js       ← ModuleFederationPlugin config
└── package.json
```

```jsx
// src/index.jsx — entry for BOTH standalone and remote
import("./bootstrap"); // async import ensures shared deps load first

// src/bootstrap.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Standalone dev mode
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}

// Export mount/unmount for shell to control lifecycle
export function mount(el, { routerBaseName } = {}) {
  const r = ReactDOM.createRoot(el);
  r.render(<App baseName={routerBaseName} />);
  return () => r.unmount();
}
```

---

## 15.3 Module Federation (Webpack 5) — Complete Setup

### Install

```bash
# Each MFE and the shell
npm install webpack webpack-cli webpack-dev-server
npm install @babel/core babel-loader @babel/preset-react @babel/preset-env
npm install html-webpack-plugin
```

### Remote MFE — webpack.config.js (mfe-catalog)

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",

  output: {
    publicPath: "http://localhost:3001/", // MUST match where this MFE is hosted
    uniqueName: "mfeCatalog",
  },

  resolve: { extensions: [".jsx", ".js"] },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "mfeCatalog", // unique ID — used by host to reference
      filename: "remoteEntry.js", // the manifest file host loads

      // What this MFE exposes to others
      exposes: {
        "./App": "./src/bootstrap", // full app
        "./ProductList": "./src/components/ProductList",
        "./ProductCard": "./src/components/ProductCard",
        "./useCart": "./src/hooks/useCart", // even hooks can be exposed!
      },

      // Shared dependencies — avoids loading React twice
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: false, // lazy load (recommended)
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        },
      },
    }),

    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],

  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" }, // required for CORS
  },
};
```

### Shell (Host) — webpack.config.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",

  output: { publicPath: "http://localhost:3000/" },

  plugins: [
    new ModuleFederationPlugin({
      name: "shell",

      // Register all remote MFEs
      remotes: {
        // format: "name@url/remoteEntry.js"
        mfeCatalog: "mfeCatalog@http://localhost:3001/remoteEntry.js",
        mfeCart: "mfeCart@http://localhost:3002/remoteEntry.js",
        mfeAuth: "mfeAuth@http://localhost:3003/remoteEntry.js",
      },

      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "react-router-dom": { singleton: true },
      },
    }),

    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],

  devServer: { port: 3000, historyApiFallback: true },
};
```

### Shell App — Routing with Lazy Remote MFEs

```jsx
// shell/src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-load remote MFEs — loaded only when route is visited
const CatalogApp = lazy(() => import("mfeCatalog/App"));
const CartApp = lazy(() => import("mfeCart/App"));
const AuthApp = lazy(() => import("mfeAuth/App"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary fallback={<div>Failed to load module. Retry?</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/products/*"
              element={<CatalogApp baseName="/products" />}
            />
            <Route path="/cart/*" element={<CartApp baseName="/cart" />} />
            <Route path="/auth/*" element={<AuthApp baseName="/auth" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
```

### Error Boundary for MFE Load Failures

```jsx
// Always wrap remote imports — network can fail!
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div>
            <p>This section failed to load.</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

### Dynamic Remotes (Load URL at Runtime)

```js
// Load remote URL from config API instead of hardcoding
// Useful when MFE URLs change per environment (dev/staging/prod)

async function loadRemoteModule(scope, module, url) {
  // Inject the remote's script tag dynamically
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  await __webpack_init_sharing__("default");
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  return factory();
}

// Usage
const { default: ProductList } = await loadRemoteModule(
  "mfeCatalog",
  "./ProductList",
  "https://catalog.example.com/remoteEntry.js"
);
```

---

## 15.4 Vite + Module Federation (Modern Setup)

```bash
npm install @originjs/vite-plugin-federation --save-dev
```

```js
// mfe-catalog/vite.config.js (remote)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfeCatalog",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/bootstrap",
        "./ProductList": "./src/components/ProductList",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  build: { target: "esnext" }, // required for top-level await
});
```

```js
// shell/vite.config.js (host)
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        mfeCatalog: "http://localhost:3001/assets/remoteEntry.js",
        mfeCart: "http://localhost:3002/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
});
```

---

## 15.5 Communication Strategies — Complete Guide

### Strategy 1: Custom DOM Events (Loosest Coupling)

Best for: fire-and-forget notifications between MFEs that don't share a framework.

```js
// ---- PUBLISHER (mfe-auth) ----
function publishEvent(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

// After successful login:
publishEvent("mfe:user:login", {
  userId: "u123",
  name: "Alice",
  token: "eyJ...", // or don't pass sensitive data — just signal the event
  roles: ["user", "admin"],
});

// After logout:
publishEvent("mfe:user:logout", {});
```

```js
// ---- SUBSCRIBER (mfe-cart) ----
function onUserLogin(handler) {
  const listener = (e) => handler(e.detail);
  window.addEventListener("mfe:user:login", listener);
  return () => window.removeEventListener("mfe:user:login", listener); // cleanup
}

// In React component:
useEffect(() => {
  const unsubscribe = onUserLogin(({ userId }) => {
    fetchCartForUser(userId);
  });
  return unsubscribe;
}, []);
```

### Strategy 2: Shared Event Bus (Typed, Centralized)

Best for: bidirectional communication with guaranteed delivery.

```js
// shared-event-bus/index.js  (npm package shared by all MFEs)

class EventBus {
  #listeners = new Map();

  on(event, handler) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(handler);
    // Return unsubscribe function
    return () => this.#listeners.get(event)?.delete(handler);
  }

  once(event, handler) {
    const wrapper = (data) => {
      handler(data);
      unsubscribe();
    };
    const unsubscribe = this.on(event, wrapper);
    return unsubscribe;
  }

  emit(event, data) {
    this.#listeners.get(event)?.forEach((h) => {
      try {
        h(data);
      } catch (e) {
        console.error(`EventBus error [${event}]:`, e);
      }
    });
  }

  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
  }

  clear(event) {
    if (event) this.#listeners.delete(event);
    else this.#listeners.clear();
  }
}

// Singleton — all MFEs get the same instance via window
window.__MFE_BUS__ = window.__MFE_BUS__ ?? new EventBus();
export const bus = window.__MFE_BUS__;

// Typed event catalog
export const EVENTS = {
  USER_LOGIN: "user:login",
  USER_LOGOUT: "user:logout",
  CART_UPDATED: "cart:updated",
  CART_ITEM_ADDED: "cart:item:added",
  PRODUCT_VIEWED: "product:viewed",
  CHECKOUT_STARTED: "checkout:started",
  CHECKOUT_DONE: "checkout:completed",
};
```

```js
// mfe-cart usage:
import { bus, EVENTS } from "@myorg/shared-event-bus";

bus.on(EVENTS.USER_LOGIN, ({ userId }) => fetchCart(userId));
bus.on(EVENTS.CART_ITEM_ADDED, ({ product, qty }) => updateCartBadge(qty));

// Emit from mfe-catalog:
bus.emit(EVENTS.CART_ITEM_ADDED, { product, qty: 1 });
```

### Strategy 3: Shared State via Redux / Zustand (Tightest Coupling)

Best for: MFEs built by same team sharing complex state; Module Federation shared instance.

```js
// @myorg/shared-store (exposed via Module Federation)
import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    login: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const sharedStore = configureStore({
  reducer: { auth: authSlice.reducer },
});
```

```js
// webpack.config.js of shell — expose shared store
exposes: {
  "./store": "./src/shared-store",
},

// mfe-cart imports it:
import { sharedStore } from "shell/store";
const token = sharedStore.getState().auth.token;
```

### Strategy 4: URL / Query Params (Stateless, Bookmarkable)

Best for: passing data between routes without tight coupling.

```js
// mfe-catalog: user selects filters → update URL
const navigate = useNavigate();
navigate("/products?category=shoes&minPrice=50&sort=popular");

// mfe-search: reads same URL params
const [params] = useSearchParams();
const category = params.get("category"); // "shoes"
const sort = params.get("sort"); // "popular"
```

### Strategy 5: Props / Callbacks from Shell (Parent → Child)

Best for: shell passing config, user context, or callbacks to MFEs.

```jsx
// Shell passes user context and callbacks as props to MFE components
<CatalogApp
  user={currentUser}
  onAddToCart={(product) => cartService.add(product)}
  onNavigate={(path) => navigate(path)}
  config={{ currency: "USD", locale: "en-US" }}
/>
```

### Communication Strategy Decision Matrix

| Need                                | Best Strategy                              |
| ----------------------------------- | ------------------------------------------ |
| Auth state everywhere               | Shared Store (Redux) via Module Federation |
| Cart count in navbar                | Custom DOM Event or Event Bus              |
| Navigation between MFEs             | URL / React Router in Shell                |
| MFE notifies shell (modal, error)   | Custom DOM Event                           |
| Real-time sync (like notifications) | WebSocket in shell + Event Bus to MFEs     |
| Config (env, feature flags)         | Props from shell or shared config module   |
| Cross-MFE form state                | URL params or Shared Store                 |

---

## 15.6 Routing in Micro Frontends

### Shell Owns Top-Level Routes

```jsx
// Shell routes to MFE apps based on path prefix
<Routes>
  <Route path="/auth/*" element={<AuthMFE />} />
  <Route path="/products/*" element={<CatalogMFE />} />
  <Route path="/cart/*" element={<CartMFE />} />
  <Route path="/account/*" element={<AccountMFE />} />
</Routes>
```

### Each MFE Has Its Own Sub-Router

```jsx
// mfe-catalog/src/App.jsx
// baseName comes from shell as a prop
function CatalogApp({ baseName = "/products" }) {
  return (
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/:id" element={<ProductDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
// Final URLs: /products/, /products/123, /products/category/shoes
```

### Cross-MFE Navigation

```js
// ❌ Don't import router from another MFE
// ✅ Use window.history or a navigation event

// Option 1: Direct history API
window.history.pushState({}, "", "/cart");
window.dispatchEvent(new PopStateEvent("popstate")); // notify shell router

// Option 2: Navigation event via bus
bus.emit("shell:navigate", { path: "/cart", state: { from: "catalog" } });

// Shell listens and uses its own navigate():
bus.on("shell:navigate", ({ path }) => shellNavigate(path));
```

---

## 15.7 Deployment Strategies

### Strategy A — Independent Deploys (Most Common)

Each MFE has its own CI/CD. The shell references MFEs by URL.

```
Merge to main (mfe-catalog)
        │
        ▼
CI: install → test → build → upload to CDN
        │
        ▼
CDN: catalog.cdn.example.com/remoteEntry.js  (updated in-place)
        │
        ▼
Shell loads the NEW catalog automatically on next page load
(no shell redeploy needed!)
```

```yaml
# .github/workflows/deploy-mfe-catalog.yml
name: Deploy mfe-catalog
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }

      - run: npm ci
      - run: npm test -- --ci
      - run: npm run build

      - name: Upload to S3 (CDN origin)
        run: |
          aws s3 sync dist/ s3://myapp-mfe-catalog/ --delete \
            --cache-control "max-age=31536000,immutable" \
            --exclude "remoteEntry.js"
          # remoteEntry.js is NOT cached (must always get latest)
          aws s3 cp dist/remoteEntry.js s3://myapp-mfe-catalog/remoteEntry.js \
            --cache-control "no-cache, no-store, must-revalidate"

      - name: Invalidate CDN for remoteEntry.js
        run: |
          aws cloudfront create-invalidation \
            --distribution-id $CF_DIST_ID \
            --paths "/remoteEntry.js"
        env:
          CF_DIST_ID: ${{ secrets.MFE_CATALOG_CF_DIST }}
```

### Strategy B — Versioned Deploys (Zero-Risk)

Shell pins to a specific version URL. You control when to upgrade.

```
CDN layout:
catalog.cdn.example.com/
  v1.2.3/remoteEntry.js    ← old version still serving
  v1.2.4/remoteEntry.js    ← new version deployed
  v1.2.5/remoteEntry.js    ← latest

Shell config (env var):
CATALOG_MFE_URL=https://catalog.cdn.example.com/v1.2.5/remoteEntry.js
```

```js
// Shell webpack.config.js — URL from environment
remotes: {
  mfeCatalog: `mfeCatalog@${process.env.CATALOG_MFE_URL}`,
  mfeCart:    `mfeCart@${process.env.CART_MFE_URL}`,
},
```

### Strategy C — Feature Flags per MFE Version

```js
// Remote URL served by a feature flag service
async function getMFEConfig() {
  const flags = await fetch("/api/feature-flags").then((r) => r.json());
  return {
    catalogUrl: flags["catalog-mfe-v2"]
      ? "https://cdn.example.com/catalog/v2/remoteEntry.js"
      : "https://cdn.example.com/catalog/v1/remoteEntry.js",
  };
}
```

### Deployment Architecture Diagram

```
Developer pushes to mfe-catalog main
          │
          ▼
GitHub Actions CI
  ├── npm test
  ├── npm run build
  └── Upload to S3 bucket: s3://myapp-mfe-catalog/
          │
          ▼
CloudFront CDN
  URL: catalog.cdn.myapp.com/remoteEntry.js
          │
          ▼
Shell App (shell.myapp.com)
  webpack remote: "mfeCatalog@catalog.cdn.myapp.com/remoteEntry.js"
          │
          ▼
Browser loads shell → shell fetches remoteEntry.js from CDN
  → catalog code executes in browser as if it was part of shell
```

### Key CDN Caching Rules

```
remoteEntry.js        → Cache-Control: no-store    (always fresh)
main.[hash].js        → Cache-Control: max-age=31536000, immutable
[chunk].[hash].js     → Cache-Control: max-age=31536000, immutable
assets/[img].[hash]   → Cache-Control: max-age=31536000, immutable
```

---

## 15.8 Single-SPA — Full Setup

Single-SPA is a framework for combining multiple SPAs on one page with proper lifecycle management.

```bash
npx create-single-spa
# Choose: single-spa root config
```

```js
// root-config/src/myorg-root-config.js
import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

// Declare the layout in HTML (declarative routing)
const routes = constructRoutes(`
  <single-spa-router>
    <application name="@myorg/navbar"></application>
    <route path="/auth">
      <application name="@myorg/auth"></application>
    </route>
    <route path="/products">
      <application name="@myorg/catalog"></application>
    </route>
    <route path="/cart">
      <application name="@myorg/cart"></application>
    </route>
  </single-spa-router>
`);

const applications = constructApplications({
  routes,
  loadApp: ({ name }) => System.import(name), // uses SystemJS import maps
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start({ urlRerouteOnly: true });
```

```html
<!-- index.html — SystemJS import map points to MFE bundles -->
<script type="systemjs-importmap">
  {
    "imports": {
      "@myorg/root-config": "//localhost:9000/myorg-root-config.js",
      "@myorg/navbar": "//localhost:8080/myorg-navbar.js",
      "@myorg/auth": "//localhost:8081/myorg-auth.js",
      "@myorg/catalog": "//localhost:8082/myorg-catalog.js",
      "@myorg/cart": "//localhost:8083/myorg-cart.js",
      "react": "//cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js",
      "react-dom": "//cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"
    }
  }
</script>
```

### MFE Lifecycle (Single-SPA Required Exports)

```jsx
// mfe-catalog/src/root.component.jsx
export default function Root({ name }) {
  return <CatalogApp />;
}

// mfe-catalog/src/myorg-catalog.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary: (err) => <div>Catalog failed to load: {err.message}</div>,
});

// single-spa expects these exact named exports
export const { bootstrap, mount, unmount } = lifecycles;
```

---

## 15.9 Web Components — Framework-Agnostic MFEs

Use when teams use different frameworks (React + Vue + Angular).

```js
// mfe-catalog — exposed as a Web Component
class CatalogWidget extends HTMLElement {
  #root = null;
  #unmount = null;

  connectedCallback() {
    // Attributes become props
    const category = this.getAttribute("category") ?? "all";
    this.#root = document.createElement("div");
    this.appendChild(this.#root);

    // Mount React inside the custom element
    import("./catalog-app").then(({ mount }) => {
      this.#unmount = mount(this.#root, { category });
    });
  }

  disconnectedCallback() {
    this.#unmount?.(); // clean up React tree
  }

  // Observe attribute changes
  static get observedAttributes() {
    return ["category"];
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "category" && this.#root) {
      // Re-mount or update props
    }
  }
}

customElements.define("catalog-widget", CatalogWidget);
```

```html
<!-- Used in shell (framework-agnostic!) -->
<catalog-widget category="shoes"></catalog-widget>
<cart-widget user-id="u123"></cart-widget>
```

---

## 15.10 Shared Dependencies & Design System

### Design System as Shared npm Package

```bash
# Publish design system
cd packages/design-system
npm publish --access public

# All MFEs consume it
npm install @myorg/design-system
```

```jsx
// All MFEs use same tokens, components
import { Button, Card, Typography, tokens } from "@myorg/design-system";

function ProductCard({ product }) {
  return (
    <Card elevation={2}>
      <Typography variant="h3">{product.name}</Typography>
      <Button variant="primary" onClick={onAddToCart}>
        Add to Cart
      </Button>
    </Card>
  );
}
```

### Shared Utilities Package

```
@myorg/shared-utils
  ├── auth.js         ← getToken(), isLoggedIn(), refreshToken()
  ├── analytics.js    ← trackEvent(), trackPageView()
  ├── errorTracking.js ← captureException() (Sentry wrapper)
  ├── http.js         ← configured axios instance with interceptors
  └── eventBus.js     ← shared event bus
```

---

## 15.11 Testing Micro Frontends

### Unit + Integration — Same as Normal React

Each MFE is tested in isolation like a normal React app:

```bash
cd mfe-catalog && npm test
```

### Contract Testing (Pact.js)

Ensure the shell and MFE agree on the interface:

```js
// Shell is the consumer — defines what it expects from mfe-catalog
const { Pact } = require("@pact-foundation/pact");

const provider = new Pact({ consumer: "shell", provider: "mfe-catalog" });

describe("mfe-catalog contract", () => {
  it("ProductList component renders with products array prop", async () => {
    // Define expected interaction
    await provider.addInteraction({
      state: "products exist",
      uponReceiving: "a request for ProductList",
      withRequest: { component: "ProductList", props: { products: Array } },
      willRespondWith: { renders: true },
    });
  });
});
```

### E2E — Cypress Against Composed Shell

```js
// cypress/e2e/mfe-integration.cy.js
// Shell loads all MFEs — test the composed app
describe("Product to Cart flow (cross-MFE)", () => {
  it("adds product from catalog and sees it in cart", () => {
    cy.visit("/products");

    // catalog MFE
    cy.findByText("Nike Air Max")
      .closest('[data-testid="product-card"]')
      .findByRole("button", { name: /add to cart/i })
      .click();

    // Cart badge in shell navbar updates
    cy.findByRole("status", { name: /cart count/i }).should("contain", "1");

    // cart MFE
    cy.findByRole("link", { name: /cart/i }).click();
    cy.url().should("include", "/cart");
    cy.findByText("Nike Air Max").should("exist");
  });
});
```

---

## 15.12 Micro Frontend Interview Questions

**Q: How do you decide what to split into a micro frontend?**

> Split by **business domain**, not technical layer. A good heuristic: if two features have different team ownership, different deploy frequency, or independent business value — they're candidates for separate MFEs. Avoid splitting purely for technical reasons (e.g., "all forms in one MFE"). The cost of splitting must be justified by team autonomy gains.

**Q: What are the main challenges of micro frontends?**

> 1. **Bundle duplication** — multiple React copies without Module Federation `shared` singleton. 2. **Routing conflicts** — two History routers clash. Fix: shell owns top-level routing, MFEs use sub-routers with `basename`. 3. **Auth state sharing** — use shared store via MF or HttpOnly cookie accessible to all MFEs. 4. **Design inconsistency** — enforce via shared npm design system package. 5. **Cross-MFE debugging** — hard to trace bugs across app boundaries; add correlation IDs.

**Q: How does Module Federation differ from npm packages for sharing code?**

> npm packages are shared at **build time** — every MFE bundles its own copy unless the shared config deduplicates. Changes require republish + install + rebuild all consumers. Module Federation shares at **runtime** — all MFEs in the same page share one instance from the network. Updates to a remote are available on next page load with zero changes to consumers.

**Q: How do you handle authentication across MFEs?**

> The recommended pattern: Auth MFE handles login and stores the **access token in memory** (not localStorage). Refresh token in an **HttpOnly cookie** (accessible to server, invisible to JS). Other MFEs get the access token via: (1) shared Redux store via Module Federation, (2) custom event from auth MFE after login, or (3) each MFE calls a `/api/auth/token` endpoint that reads the HttpOnly cookie and returns the current token.

**Q: Why must `remoteEntry.js` never be CDN-cached?**

> `remoteEntry.js` is the manifest — it maps module names to their hashed chunk filenames. If it's cached, the shell loads a stale manifest and tries to fetch chunks that may have been replaced (404). All other chunks have content-hash filenames and can be cached forever (`immutable`). `remoteEntry.js` gets `Cache-Control: no-store`.

**Q: What is the difference between Build-time and Runtime integration?**

> **Build-time** (npm packages): MFEs are published as npm packages, consumed at build time. All code ends up in one final bundle. Deployments require rebuilding the shell to get updates. Simple but defeats independent deploys. **Runtime** (Module Federation / Single-SPA): MFEs are loaded dynamically from CDN at runtime. Each MFE deploys independently — the shell gets updates automatically. This is the true micro frontend model.

**Q: How do you prevent one broken MFE from crashing the entire shell?**

> Wrap every remote import in an **Error Boundary** + **Suspense**. If the network request for `remoteEntry.js` fails, or if the remote component throws, the Error Boundary catches it and shows a fallback UI. The rest of the shell (nav, other MFEs) continues working. Also implement **health checks** — shell can ping MFE health endpoints before loading them.

---

_End of Part 3 — Sections 11–15_

{% endraw %}
