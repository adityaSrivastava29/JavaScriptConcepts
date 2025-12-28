# Debouncing and Throttling in JavaScript

## Introduction

Debouncing and throttling are optimization techniques to control how often a function executes. They are essential for handling high-frequency events like scrolling, resizing, typing, and mouse movement.

---

## Problem We're Solving

Without debouncing/throttling, event handlers can fire hundreds or thousands of times per second:

```js
// BAD: Function fires every time user types
const input = document.querySelector("input");
input.addEventListener("input", (e) => {
  // API call happens on EVERY keystroke
  fetch(`/search?q=${e.target.value}`);
});
```

This causes:

- Excessive API calls
- Poor performance
- Wasted bandwidth
- Battery drain on mobile

---

## Debouncing

### What is Debouncing?

**Debouncing delays the execution of a function until a specified time has passed since the last time it was invoked.** It waits for a pause in events before executing.

**Use Case:** Search input, auto-save, form validation

### How It Works

```
User types: a -> ab -> abc -> abcd (pauses for 500ms)
With debouncing (500ms):
- 'a' → timer starts
- 'ab' → timer resets
- 'abc' → timer resets
- 'abcd' → timer resets
- 500ms passes → function executes with "abcd"
```

### Basic Debounce Implementation

```js
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Usage
const search = debounce((query) => {
  console.log("Searching for:", query);
  // API call here
}, 500);

const input = document.querySelector("input");
input.addEventListener("input", (e) => search(e.target.value));
```

**Step-by-step execution:**

1. User types 'a' → `clearTimeout` clears any pending timer
2. New timer set for 500ms
3. User types 'b' before 500ms → Previous timer cleared, new one set
4. After 500ms of no typing → Function finally executes

### Debounce with Context (`this` binding)

```js
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```

### Debounce with Leading and Trailing Options

```js
function debounce(func, delay, options = {}) {
  let timeoutId;
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    // Leading: execute immediately on first call
    if (options.leading && now - lastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    }

    clearTimeout(timeoutId);

    // Trailing: execute after delay if called again
    if (options.trailing !== false) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastCall = Date.now();
      }, delay);
    }
  };
}

// Usage
const handleResize = debounce(
  () => {
    console.log("Resizing...");
  },
  300,
  { leading: true, trailing: true }
);

window.addEventListener("resize", handleResize);
```

### Real-World Debounce Examples

#### 1. Search API Call

```js
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const searchUsers = debounce(async (query) => {
  if (!query) return;
  const response = await fetch(`/api/search?q=${query}`);
  const results = await response.json();
  console.log(results);
}, 500);

document.querySelector("#search").addEventListener("input", (e) => {
  searchUsers(e.target.value);
});
```

#### 2. Auto-Save Form

```js
const autoSave = debounce((formData) => {
  console.log("Auto-saving:", formData);
  // Save to backend
}, 2000);

document.querySelector("form").addEventListener("input", () => {
  const formData = new FormData(event.target.form);
  autoSave(formData);
});
```

#### 3. Window Resize Handler

```js
const handleResize = debounce(() => {
  console.log("Window resized to:", window.innerWidth, window.innerHeight);
  // Recalculate layout
}, 300);

window.addEventListener("resize", handleResize);
```

---

## Throttling

### What is Throttling?

**Throttling ensures a function executes at most once during a specified time interval.** It maintains a steady execution rate.

**Use Case:** Scroll events, mouse tracking, button clicks during animations

### How It Works

```
User scrolls: event → event → event → event → event
With throttling (300ms):
- event → execute immediately
- 100ms later: event → ignored (within 300ms window)
- 200ms later: event → ignored
- 300ms later: event → execute
- 100ms later: event → ignored
```

### Basic Throttle Implementation

```js
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log("Scrolling at:", window.scrollY);
}, 300);

window.addEventListener("scroll", handleScroll);
```

**Step-by-step execution:**

1. User scrolls → `inThrottle` is false → Execute function, set `inThrottle = true`
2. More scroll events within 300ms → Ignored because `inThrottle = true`
3. After 300ms → `inThrottle = false` → Next scroll will execute

### Throttle with Timestamp Approach

```js
function throttle(func, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      func.apply(this, args);
      lastCall = now;
    }
  };
}
```

### Throttle with Leading and Trailing

```js
function throttle(func, limit, options = {}) {
  let inThrottle;
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (!lastCall && options.leading === false) {
      lastCall = now;
    }

    if (now - lastCall >= limit) {
      if (options.leading !== false) {
        func.apply(this, args);
      }
      lastCall = now;
    } else if (!inThrottle && options.trailing !== false) {
      inThrottle = true;
      setTimeout(() => {
        func.apply(this, args);
        inThrottle = false;
      }, limit - (now - lastCall));
    }
  };
}
```

### Real-World Throttle Examples

#### 1. Scroll Event Performance

```js
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const handleScroll = throttle(() => {
  const scrollTop = window.scrollY;
  console.log("Scroll position:", scrollTop);

  // Expensive calculations
  if (scrollTop > 500) {
    console.log("User scrolled past 500px");
  }
}, 300);

window.addEventListener("scroll", handleScroll);
```

#### 2. Mouse Movement Tracking

```js
const trackMouseMove = throttle((e) => {
  console.log("Mouse at:", e.clientX, e.clientY);
  // Update UI with mouse position
}, 50); // Fire at most every 50ms

document.addEventListener("mousemove", trackMouseMove);
```

#### 3. Button Click During Animation

```js
const handleClick = throttle(() => {
  console.log("Button clicked");
  // Expensive animation
  animateElement();
}, 1000); // Only allow clicks once per second

document.querySelector("button").addEventListener("click", handleClick);
```

---

## Debouncing vs Throttling: Side-by-Side

```
Event frequency: ------E--E--E--E--E--E--E--E------

DEBOUNCE (300ms):
------E--E--E--E--E--E--E--E------
                                  ^
                            Executes once
                            after last event

THROTTLE (300ms):
------E--E--E--E--E--E--E--E------
      ^        ^        ^        ^
   Executes every 300ms consistently
```

| Aspect         | Debounce                              | Throttle                       |
| -------------- | ------------------------------------- | ------------------------------ |
| **Executes**   | After delay since last call           | At regular intervals           |
| **Best For**   | Search, resize, input                 | Scroll, mousemove, clicks      |
| **Waits For**  | Pauses in events                      | Fixed time interval            |
| **Last Event** | Always captured                       | May be missed                  |
| **Use When**   | Action should happen after user stops | Action should happen regularly |

---

## Comparison Table

| Scenario             | Technique | Delay  | Reason                              |
| -------------------- | --------- | ------ | ----------------------------------- |
| Search input         | Debounce  | 500ms  | Wait for user to finish typing      |
| Window resize        | Debounce  | 300ms  | Wait for resize to complete         |
| Scroll to top button | Throttle  | 300ms  | Show/hide regularly while scrolling |
| Mouse tracking       | Throttle  | 50ms   | Smooth but controlled updates       |
| Form auto-save       | Debounce  | 2000ms | Save after user pauses              |
| API rate limiting    | Throttle  | 1000ms | Control API call frequency          |

---

## Key Differences
Difference Between Throttling and Debouncing
Both throttling and debouncing are techniques for controlling function execution, but they serve different purposes:

| Feature	| Throttling	| Debouncing 
| -------------------- | --------- | ------ | 
Execution Control	| Ensures function runs at most once per interval	| Delays function execution until event stops
Best Use Cases	| Scroll events, API calls, keypress handling	| Search input, auto-save, form validation
Frequency of Execution	| Runs at regular intervals	| Runs only once after a delay

---

## Combining Debounce + Throttle

Sometimes you want both behaviors:

```js
function debounceAndThrottle(func, debounceDelay, throttleDelay) {
  let timeoutId;
  let lastCall = 0;

  return function (...args) {
    clearTimeout(timeoutId);
    const now = Date.now();

    if (now - lastCall >= throttleDelay) {
      func.apply(this, args);
      lastCall = now;
    } else {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastCall = Date.now();
      }, debounceDelay);
    }
  };
}

// Execute at most every 300ms, but wait 500ms after last event
const handler = debounceAndThrottle(
  () => {
    console.log("Handler executed");
  },
  500,
  300
);
```

---

## Advanced: Request Animation Frame Throttle

For smooth animations, use `requestAnimationFrame`:

```js
function rafThrottle(func) {
  let rafId;
  let lastCall = 0;

  return function (...args) {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      lastCall = Date.now();
    });
  };
}

const smoothScroll = rafThrottle(() => {
  console.log("Smooth scroll at:", window.scrollY);
});

window.addEventListener("scroll", smoothScroll);
```

---

## Performance Tips

1. **Choose the right delay:**

   - Search: 300-500ms
   - Resize: 150-300ms
   - Scroll: 50-100ms
   - Auto-save: 1000-3000ms

2. **Consider requestAnimationFrame for visual updates**

3. **Test on low-end devices** to find optimal delays

4. **Use browser DevTools to measure performance**

5. **Avoid nested debounces/throttles** (hard to debug)

---

## Common Mistakes

### ❌ Wrong: Creating new debounce every render (React)

```js
// BAD - new function created every render
const MyComponent = () => {
  const handleSearch = debounce((query) => {
    // search logic
  }, 500);

  return <input onChange={(e) => handleSearch(e.target.value)} />;
};
```

### ✅ Right: Memoize debounced function

```js
// GOOD - debounced function persists across renders
import { useMemo } from "react";

const MyComponent = () => {
  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        // search logic
      }, 500),
    []
  );

  return <input onChange={(e) => handleSearch(e.target.value)} />;
};
```

---

## Library Solutions

### Lodash

```js
import { debounce, throttle } from "lodash-es";

const handleSearch = debounce(
  (query) => {
    console.log("Searching:", query);
  },
  500,
  { leading: false, trailing: true }
);

const handleScroll = throttle(
  () => {
    console.log("Scrolling");
  },
  300,
  { leading: true, trailing: true }
);
```

### Custom Hook (React)

```js
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

// Usage
const handleSearch = useDebounce((query) => {
  console.log("Search:", query);
}, 500);
```

---

## Interview Questions

### Q1: What's the difference between debounce and throttle?

**A:** Debounce waits for a pause in events before executing. Throttle executes at regular intervals regardless of event frequency.

### Q2: When would you use each?

**A:**

- Debounce: Search input, auto-save, form validation
- Throttle: Scroll events, resize, mouse movement

### Q3: Implement a debounce function

```js
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

### Q4: How to cancel a debounced function?

```js
function debounce(func, delay) {
  let timeoutId;
  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  }
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}

const search = debounce((query) => console.log(query), 500);
search.cancel(); // Cancel pending execution
```

---

## Summary

- **Debounce:** Wait for pause → Execute once
- **Throttle:** Execute regularly → Control frequency
- Choose based on whether you care about **event completion** (debounce) or **steady rate** (throttle)
- Test with real user data and measure performance
- Use libraries like Lodash for production code
- Remember to handle cleanup in frameworks like React
