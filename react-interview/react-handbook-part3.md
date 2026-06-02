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
                                   Shell / Container
                                   (composes MFEs)
```

### Why Use It?

| Problem (Monolith)           | Solution (Micro Frontend)  |
| ---------------------------- | -------------------------- |
| Large team = merge conflicts | Independent team ownership |
| Deploy one → breaks all      | Independent deployments    |
| Forced tech stack            | Team can choose their own  |
| Slow CI/CD                   | Faster per-team pipelines  |
| Hard to scale teams          | Clear ownership boundaries |

### Drawbacks

- **Increased complexity**: Multiple builds, deployments, versioning.
- **Bundle duplication**: React loaded multiple times (mitigated by shared libs).
- **Communication overhead**: Events, shared state across boundaries.
- **UI consistency**: Harder to maintain design system.
- **Performance**: Network waterfalls loading MFEs.

---

## 15.2 Module Federation (Webpack 5)

### Concept

Module Federation allows a JavaScript application to **dynamically load code from another application** at runtime, sharing modules between them.

```js
// Remote app (product-catalog) — webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "productCatalog",
      filename: "remoteEntry.js", // entry point exposed to host
      exposes: {
        "./ProductList": "./src/components/ProductList",
        "./ProductCard": "./src/components/ProductCard",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};

// Host app (shell) — webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        productCatalog:
          "productCatalog@https://catalog.example.com/remoteEntry.js",
        cart: "cart@https://cart.example.com/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};

// Usage in shell — loads ProductList from remote at runtime
const ProductList = React.lazy(() => import("productCatalog/ProductList"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductList />
    </Suspense>
  );
}
```

---

## 15.3 Communication Strategies Between MFEs

### Custom Events (Decoupled)

```js
// MFE 1: User logs in
window.dispatchEvent(
  new CustomEvent("user:login", {
    detail: { userId: "123", name: "Alice" },
    bubbles: true,
  })
);

// MFE 2: Cart listens for login to fetch user's cart
window.addEventListener("user:login", (event) => {
  const { userId } = event.detail;
  fetchCart(userId);
});
```

### Shared State via URL

```js
// MFEs communicate via URL params and query string
// Shell app manages routing, MFEs read from URL
// Example: /checkout?cartId=abc&coupon=SAVE10
```

### Pub/Sub via Event Bus

```js
// Shared event bus library
class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    (this.listeners[event] ??= []).push(callback);
    return () => this.off(event, callback);
  }

  emit(event, data) {
    this.listeners[event]?.forEach((cb) => cb(data));
  }

  off(event, callback) {
    this.listeners[event] = this.listeners[event]?.filter(
      (cb) => cb !== callback
    );
  }
}

// Exposed as a singleton on window (or via shared module)
window.__eventBus = window.__eventBus ?? new EventBus();
```

---

## 15.4 Single-SPA

Single-SPA is a JavaScript framework for micro frontends that routes between multiple frameworks.

```js
// root-config.js
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@myorg/navbar",
  app: () => import("@myorg/navbar"),
  activeWhen: ["/"], // active on all routes
});

registerApplication({
  name: "@myorg/products",
  app: () => import("@myorg/products"),
  activeWhen: "/products",
});

registerApplication({
  name: "@myorg/checkout",
  app: () => import("@myorg/checkout"),
  activeWhen: "/checkout",
});

start();
```

---

## 15.5 Version Management & Shared Dependencies

### Strategy: Singleton Sharing

```js
// In Module Federation, mark React as singleton:
shared: {
  react: {
    singleton: true,         // only one instance loaded
    requiredVersion: '^18.0.0', // warn if version mismatch
    eager: true,             // load immediately, not lazily
  }
}

// Without singleton: 3 MFEs = 3 React instances = hooks break!
```

### Strategy: Design System Package

```
@myorg/design-system (npm package)
    ↓ consumed by
├── @myorg/shell
├── @myorg/products
└── @myorg/cart
```

All MFEs share the same design system version. Upgrade in one place.

---

## 15.6 Real-World Examples

**Amazon:** Different teams own different page sections. Product listing, recommendations, cart, and checkout are separate deployments.

**Spotify:** Web player, browse, search, and podcast sections built and deployed by different teams.

**IKEA:** Planner tool, product catalog, and checkout are separate micro frontends with different tech stacks per team.

---

## 15.7 Micro Frontend Interview Questions

**Q: What are the main challenges of micro frontends?**

> 1. **Bundle duplication**: Shared libraries (React, design system) loaded multiple times. Mitigate with Module Federation `shared` config. 2. **Routing conflicts**: Multiple routers in the same page. Use the shell for top-level routing. 3. **Authentication**: Session must be accessible across MFEs — use shared cookie or custom event. 4. **Design consistency**: Enforce a shared design system package. 5. **Performance**: MFEs load sequentially causing waterfalls — mitigate with preloading.

**Q: How to share React version across MFEs?**

> Use Webpack Module Federation's `shared` config with `singleton: true`. This ensures only one instance of React is loaded regardless of how many MFEs request it. All MFEs must have compatible version ranges.

**Q: How do deployments work in Micro Frontends?**

> Each MFE has its own CI/CD pipeline. Changes in one MFE trigger only that MFE's build and deploy. The host app references remote MFEs by URL — either pinned version URLs (`remoteEntry.v1.2.3.js`) for stability or latest URLs (`remoteEntry.js`) for continuous deployment.

---

_End of Part 3 — Sections 11–15_

{% endraw %}
