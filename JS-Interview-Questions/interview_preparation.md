# Full Stack Developer MERN Interview Questions

> **Position:** Full Stack Developer (2-4 years experience)  
> **Tech Stack:** React.js, Node.js, MongoDB, Express.js, HTML & CSS

---

## Candidate Profile: Aditya Kumar

| Category | Details |
|----------|---------|
| **Experience** | 3+ years at Cognizant Technology Solutions |
| **Education** | B.Tech in CSE (NIET, 8.4 CGPA) |
| **Certifications** | AWS Certified Developer - Associate, AWS Cloud Practitioner, GitHub Foundations |
| **Recognition** | Star Performer (February 2025) |
| **Key Achievements** | 99.9% uptime, 40% faster response times, 87% deployment time reduction |
| **Personal Projects** | AI Chat Application (Gemini API), Custom AI Persona Platform (OpenAI GPT) |

---

## Table of Contents
1. [React.js Questions](#1-reactjs-questions)
2. [Node.js & Express.js Questions](#2-nodejs--expressjs-questions)
3. [MongoDB Questions](#3-mongodb-questions)
4. [JavaScript Core Concepts](#4-javascript-core-concepts)
5. [ES6/ES7 & Programming Paradigms](#5-es6es7--programming-paradigms)
6. [Asynchronous Programming](#6-asynchronous-programming)
7. [Git & Version Control](#7-git--version-control)
8. [Linux/Ubuntu Commands](#8-linuxubuntu-commands)
9. [Browser Performance & Rendering](#9-browser-performance--rendering)
10. [Elasticsearch (Good to Have)](#10-elasticsearch-good-to-have)
11. [Agile Development](#11-agile-development)
12. [Project-Specific Questions](#12-project-specific-questions)
13. [Behavioral & Situational Questions](#13-behavioral--situational-questions)

---

## 1. React.js Questions

### Q1: What is React.js and why would you choose it over other frameworks?

**Answer:**
React.js is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It uses a component-based architecture and a virtual DOM for efficient updates.

**Why choose React:**
- **Virtual DOM:** React creates a virtual representation of the DOM, which makes updates faster by only re-rendering changed components
- **Component-based architecture:** Reusable, modular components make code maintainable
- **Unidirectional data flow:** Makes debugging easier and application behavior predictable
- **Large ecosystem:** Rich set of libraries, tools, and community support
- **React hooks:** Simplify state management without class components

**Example:**
```jsx
// A simple functional component with hooks
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>Welcome, {user.name}</div>;
};
```

---

### Q2: Explain the component lifecycle in React. How do hooks replace lifecycle methods?

**Answer:**
Traditional class component lifecycle methods are replaced by hooks in functional components:

| Class Lifecycle | Hook Equivalent |
|-----------------|-----------------|
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [dependencies])` |
| `componentWillUnmount` | `useEffect(() => { return () => cleanup }, [])` |
| `shouldComponentUpdate` | `React.memo()` or `useMemo()` |

**Example:**
```jsx
// Class component lifecycle
class MyComponent extends React.Component {
  componentDidMount() {
    this.subscription = dataSource.subscribe();
  }
  
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

// Equivalent with hooks
const MyComponent = () => {
  useEffect(() => {
    const subscription = dataSource.subscribe();
    
    // Cleanup function (componentWillUnmount)
    return () => subscription.unsubscribe();
  }, []); // Empty array = run once on mount
};
```

---

### Q3: What is the Virtual DOM and how does React's reconciliation algorithm work?

**Answer:**
The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes occur, React:

1. **Creates a new Virtual DOM tree** with the updated state
2. **Diffs** the new tree against the previous one (Reconciliation)
3. **Calculates minimal changes** needed
4. **Batches updates** and applies them to the real DOM

**The Diffing Algorithm:**
- Compares elements of the same type
- Uses `key` props to identify list items efficiently
- Only updates changed attributes, not entire elements

**Example demonstrating keys:**
```jsx
// Bad - without keys, React re-renders all items
{items.map(item => <ListItem data={item} />)}

// Good - with unique keys, React can track individual items
{items.map(item => <ListItem key={item.id} data={item} />)}
```

---

### Q4: Explain useState and useEffect hooks with practical examples.

**Answer:**

**useState:** Manages local component state in functional components.

```jsx
const [count, setCount] = useState(0);

// Update state
setCount(count + 1);           // Direct update
setCount(prev => prev + 1);    // Functional update (recommended)
```

**useEffect:** Handles side effects like data fetching, subscriptions, DOM manipulation.

```jsx
// Fetching data on component mount
useEffect(() => {
  const controller = new AbortController();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (!error.name === 'AbortError') {
        setError(error);
      }
    }
  };
  
  fetchData();
  
  // Cleanup to prevent memory leaks
  return () => controller.abort();
}, []); // Empty dependency array = runs once on mount
```

---

### Q5: How do you manage state in a large React application? Compare Redux, Context API, and other solutions.

**Answer:**

| Solution | Best For | Pros | Cons |
|----------|----------|------|------|
| **useState/useReducer** | Local component state | Simple, built-in | Prop drilling in deep trees |
| **Context API** | Theme, auth, simple global state | Built-in, no extra library | Re-renders all consumers |
| **Redux** | Complex state, large apps | Predictable, DevTools, middleware | Boilerplate, learning curve |
| **Redux Toolkit** | Modern Redux apps | Less boilerplate, built-in best practices | Still Redux complexity |
| **Zustand/Jotai** | Moderate complexity | Minimal API, performant | Smaller ecosystem |

**Example with Context API:**
```jsx
// Create context
const ThemeContext = React.createContext('light');

// Provider
const App = () => (
  <ThemeContext.Provider value="dark">
    <Navbar />
    <MainContent />
  </ThemeContext.Provider>
);

// Consumer using useContext
const Navbar = () => {
  const theme = useContext(ThemeContext);
  return <nav className={`navbar-${theme}`}>...</nav>;
};
```

**Example with Redux Toolkit:**
```jsx
// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, loading: false },
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
```

---

### Q6: What are React Hooks rules and why do they exist?

**Answer:**

**Rules of Hooks:**
1. **Only call hooks at the top level** - Never inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Functional components or custom hooks

**Why these rules exist:**
React relies on the order of hook calls to correctly associate state with components. Conditional hook calls would break this ordering.

**Example - Wrong:**
```jsx
// ❌ BAD - conditional hook
const Component = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // Hook order changes!
  }
};
```

**Example - Correct:**
```jsx
// ✅ GOOD - hook at top level
const Component = ({ isLoggedIn }) => {
  const [user, setUser] = useState(null);
  
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }
  
  return <Dashboard user={user} />;
};
```

---

### Q7: How do you optimize React application performance?

**Answer:**

1. **React.memo()** - Prevents unnecessary re-renders of functional components
2. **useMemo()** - Memoizes expensive calculations
3. **useCallback()** - Memoizes callback functions
4. **Code splitting** - Dynamic imports with `React.lazy()`
5. **Virtualization** - For long lists (react-window, react-virtualized)

**Examples:**
```jsx
// React.memo - only re-renders if props change
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// useMemo - caches computed value
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.price - b.price);
}, [items]);

// useCallback - stable function reference
const handleClick = useCallback((id) => {
  setSelectedId(id);
}, []);

// Code splitting with React.lazy
const Dashboard = React.lazy(() => import('./Dashboard'));

const App = () => (
  <Suspense fallback={<Loading />}>
    <Dashboard />
  </Suspense>
);
```

---

## 2. Node.js & Express.js Questions

### Q8: What is Node.js and how does its event loop work?

**Answer:**
Node.js is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run server-side. It uses an event-driven, non-blocking I/O model.

**Event Loop Phases:**
1. **Timers** - Executes `setTimeout()` and `setInterval()` callbacks
2. **Pending callbacks** - Executes I/O callbacks deferred
3. **Idle, prepare** - Internal use
4. **Poll** - Retrieves new I/O events; executes I/O related callbacks
5. **Check** - Executes `setImmediate()` callbacks
6. **Close callbacks** - Executes close handlers

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

**Example demonstrating event loop:**
```javascript
console.log('1 - Start');

setTimeout(() => console.log('2 - Timeout'), 0);

Promise.resolve().then(() => console.log('3 - Promise'));

setImmediate(() => console.log('4 - Immediate'));

console.log('5 - End');

// Output: 1 - Start, 5 - End, 3 - Promise, 2 - Timeout, 4 - Immediate
```

---

### Q9: Explain middleware in Express.js with examples.

**Answer:**
Middleware functions have access to the request object (req), response object (res), and the next middleware function. They can:
- Execute any code
- Modify request/response objects
- End the request-response cycle
- Call the next middleware

**Types of Middleware:**
1. **Application-level** - `app.use()`, `app.METHOD()`
2. **Router-level** - `router.use()`, `router.METHOD()`
3. **Error-handling** - Four arguments `(err, req, res, next)`
4. **Built-in** - `express.json()`, `express.static()`
5. **Third-party** - `cors`, `helmet`, `morgan`

**Example:**
```javascript
const express = require('express');
const app = express();

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Error handling middleware (must have 4 params)
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

// Apply middleware
app.use(express.json());
app.use(logger);
app.use('/api/protected', authenticate);
app.use(errorHandler); // Error handler last
```

---

### Q10: How do you structure a Node.js/Express application for scalability?

**Answer:**
A well-structured application follows separation of concerns:

```
project/
├── src/
│   ├── config/           # Environment, database config
│   │   ├── db.js
│   │   └── index.js
│   ├── controllers/      # Request handlers
│   │   ├── userController.js
│   │   └── productController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/           # API routes
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── services/         # Business logic
│   │   ├── userService.js
│   │   └── emailService.js
│   ├── utils/            # Helper functions
│   │   ├── logger.js
│   │   └── validators.js
│   └── app.js            # Express app setup
├── tests/                # Test files
├── .env                  # Environment variables
└── server.js             # Entry point
```

**Example - Clean Architecture:**
```javascript
// routes/userRoutes.js
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validateUser } = require('../middleware/validate');

router.get('/', authenticate, userController.getAll);
router.post('/', validateUser, userController.create);
router.get('/:id', authenticate, userController.getById);

// controllers/userController.js
const userService = require('../services/userService');

exports.getAll = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// services/userService.js
const User = require('../models/User');

exports.getAllUsers = async (filters) => {
  const { page = 1, limit = 10, sortBy = 'createdAt' } = filters;
  return User.find()
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(limit);
};
```

---

### Q11: How do you handle errors in Express.js?

**Answer:**

**Best Practices:**
1. Create custom error classes
2. Use async error handling wrapper
3. Centralized error handling middleware
4. Separate operational vs programmer errors

**Example:**
```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// utils/catchAsync.js
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Controller using catchAsync
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.json({ success: true, data: user });
});

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production - don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};
```

---

### Q12: What are Streams in Node.js? Explain different types.

**Answer:**
Streams are objects that let you read data from a source or write data to a destination in a continuous manner, handling data piece by piece without loading everything into memory.

**Types of Streams:**
| Type | Description | Example |
|------|-------------|---------|
| **Readable** | Read data from source | `fs.createReadStream()`, HTTP request |
| **Writable** | Write data to destination | `fs.createWriteStream()`, HTTP response |
| **Duplex** | Both read and write | TCP sockets |
| **Transform** | Modify data while reading/writing | Compression, encryption |

**Example - Reading a large file efficiently:**
```javascript
const fs = require('fs');
const zlib = require('zlib');

// Without streams - loads entire file into memory
const data = fs.readFileSync('large-file.txt');

// With streams - processes in chunks
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt');
const gzip = zlib.createGzip();

// Pipe: readable -> transform -> writable
readStream
  .pipe(gzip)
  .pipe(writeStream)
  .on('finish', () => console.log('File compressed successfully'));

// Stream events
readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});
```

**Creating a custom Transform stream:**
```javascript
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin
  .pipe(upperCaseTransform)
  .pipe(process.stdout);
```

---

### Q13: What is clustering in Node.js? How do you scale Node.js applications?

**Answer:**
Node.js runs on a single thread, but clustering allows you to create child processes that share the same server port to utilize multiple CPU cores.

**Using the cluster module:**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Replace the dead worker
    cluster.fork();
  });
  
} else {
  // Workers share the TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\n`);
  }).listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}
```

**Using PM2 (Production Process Manager):**
```bash
# Start with cluster mode
pm2 start app.js -i max    # Uses all CPU cores
pm2 start app.js -i 4      # Uses 4 instances

# Other useful PM2 commands
pm2 list                   # List all processes
pm2 logs                   # View logs
pm2 monit                  # Monitor resources
pm2 restart all            # Restart all apps
pm2 reload all             # Zero-downtime reload
```

**Scaling strategies diagram:**
```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │   (Nginx/AWS)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Server 1    │   │   Server 2    │   │   Server 3    │
│ ┌───────────┐ │   │ ┌───────────┐ │   │ ┌───────────┐ │
│ │ Worker 1  │ │   │ │ Worker 1  │ │   │ │ Worker 1  │ │
│ │ Worker 2  │ │   │ │ Worker 2  │ │   │ │ Worker 2  │ │
│ │ Worker 3  │ │   │ │ Worker 3  │ │   │ │ Worker 3  │ │
│ │ Worker 4  │ │   │ │ Worker 4  │ │   │ │ Worker 4  │ │
│ └───────────┘ │   │ └───────────┘ │   │ └───────────┘ │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

### Q14: What is the difference between process.nextTick() and setImmediate()?

**Answer:**

| Feature | `process.nextTick()` | `setImmediate()` |
|---------|---------------------|------------------|
| **When executed** | Before I/O callbacks | After I/O callbacks |
| **Priority** | Higher (microtask queue) | Lower (macrotask queue) |
| **Use case** | Critical async operations | Yield to I/O operations |

**Example demonstrating the difference:**
```javascript
console.log('1 - Start');

setTimeout(() => console.log('2 - setTimeout'), 0);

setImmediate(() => console.log('3 - setImmediate'));

process.nextTick(() => console.log('4 - nextTick'));

Promise.resolve().then(() => console.log('5 - Promise'));

console.log('6 - End');

// Output:
// 1 - Start
// 6 - End
// 4 - nextTick    (microtask - runs first after sync code)
// 5 - Promise     (microtask - runs after nextTick)
// 2 - setTimeout  (timer phase)
// 3 - setImmediate (check phase)
```

**When to use each:**
```javascript
// Use process.nextTick for:
// 1. Error handling before continuing
function apiCall(callback) {
  if (typeof callback !== 'function') {
    return process.nextTick(() => {
      throw new TypeError('Callback must be a function');
    });
  }
  // ... rest of function
}

// 2. Ensuring async behavior
function asyncOperation(callback) {
  process.nextTick(callback); // Always async
}

// Use setImmediate for:
// 1. Breaking up CPU-intensive tasks
function processLargeArray(array, callback) {
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + 1000, array.length);
    
    while (index < end) {
      // Process item
      index++;
    }
    
    if (index < array.length) {
      setImmediate(processChunk); // Allow I/O between chunks
    } else {
      callback();
    }
  }
  
  processChunk();
}
```

---

### Q15: How do you handle security in Node.js applications?

**Answer:**

**1. Use Helmet for HTTP security headers:**
```javascript
const helmet = require('helmet');
app.use(helmet()); // Sets various security headers

// Specific headers
// X-XSS-Protection
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Content-Security-Policy
```

**2. Rate limiting to prevent brute force:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // 5 failed attempts
  message: 'Too many login attempts'
});

app.use('/api/auth/login', authLimiter);
```

**3. Input validation and sanitization:**
```javascript
const { body, validationResult } = require('express-validator');

app.post('/user',
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('name').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process valid input
  }
);
```

**4. Prevent NoSQL injection:**
```javascript
// ❌ Vulnerable to injection
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password // Can be { $gt: '' }
  });
});

// ✅ Safe - use mongo-sanitize
const sanitize = require('mongo-sanitize');

app.post('/login', async (req, res) => {
  const email = sanitize(req.body.email);
  const password = sanitize(req.body.password);
  
  const user = await User.findOne({ email });
  const isValid = await bcrypt.compare(password, user.password);
});
```

**5. Secure environment variables:**
```javascript
// .env file (never commit!)
JWT_SECRET=your-super-secret-key
DB_PASSWORD=database-password

// config.js
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: `mongodb+srv://user:${process.env.DB_PASSWORD}@cluster.mongodb.net`
};
```

**Security checklist:**
- ✅ Use HTTPS in production
- ✅ Hash passwords with bcrypt (salt rounds: 12+)
- ✅ Use parameterized queries
- ✅ Validate and sanitize all inputs
- ✅ Implement rate limiting
- ✅ Set secure cookie flags
- ✅ Use helmet for security headers
- ✅ Keep dependencies updated (npm audit)
- ✅ Never expose stack traces in production

---

### Q16: What are the differences between CommonJS and ES Modules?

**Answer:**

| Feature | CommonJS (CJS) | ES Modules (ESM) |
|---------|----------------|------------------|
| **Syntax** | `require()` / `module.exports` | `import` / `export` |
| **Loading** | Synchronous | Asynchronous |
| **Hoisting** | Not hoisted | Imports are hoisted |
| **Default in Node** | Yes (legacy) | Needs `"type": "module"` |
| **File extension** | `.js`, `.cjs` | `.mjs` or configure package.json |

**CommonJS example:**
```javascript
// math.js (CommonJS)
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = { add, subtract };
// or
module.exports.add = add;
exports.subtract = subtract;

// app.js
const { add, subtract } = require('./math');
const math = require('./math');
console.log(math.add(2, 3));
```

**ES Modules example:**
```javascript
// math.mjs (ES Modules)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default { add, subtract };

// app.mjs
import { add, subtract } from './math.mjs';
import math from './math.mjs';
console.log(add(2, 3));

// Dynamic import (works in both)
const module = await import('./math.mjs');
```

**package.json configuration:**
```json
{
  "name": "my-app",
  "type": "module",  // Enable ES Modules for .js files
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

**Key differences in behavior:**
```javascript
// CommonJS - this is valid
if (condition) {
  const module = require('./module');  // Dynamic require
}

// ESM - imports must be at top level
import { something } from './module';  // Must be at top

// ESM - use dynamic import() for conditional
if (condition) {
  const module = await import('./module');
}
```

---

## 3. MongoDB Questions

### Q12: Explain MongoDB's document model and when to use embedded vs referenced documents.

**Answer:**

MongoDB stores data in flexible, JSON-like documents (BSON). Design decisions:

| Approach | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Embedded** | One-to-few, data accessed together | Faster reads, atomic writes | Document size limit (16MB), data duplication |
| **Referenced** | One-to-many, many-to-many | Normalized, flexible | Requires multiple queries or $lookup |

**Example - Embedded (Good for blog posts with comments):**
```javascript
// Embedded document schema
const blogPostSchema = new Schema({
  title: String,
  content: String,
  author: {
    name: String,
    email: String,
    avatar: String
  },
  comments: [{
    user: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
});
```

**Example - Referenced (Good for users with multiple orders):**
```javascript
// User schema
const userSchema = new Schema({
  name: String,
  email: String
});

// Order schema with reference
const orderSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  total: Number
});

// Populate references
const orders = await Order.find()
  .populate('user', 'name email')
  .populate('products.product', 'name price');
```

---

### Q13: How do you create indexes in MongoDB and why are they important?

**Answer:**
Indexes improve query performance by allowing MongoDB to find documents without scanning every document.

**Types of Indexes:**
- **Single field** - Index on one field
- **Compound** - Index on multiple fields
- **Multikey** - Index on array fields
- **Text** - Full-text search
- **Geospatial** - Location queries
- **Unique** - Enforce unique values

**Example:**
```javascript
const userSchema = new Schema({
  email: { 
    type: String, 
    unique: true,  // Creates unique index
    index: true    // Creates regular index
  },
  firstName: String,
  lastName: String,
  location: {
    type: { type: String }, 
    coordinates: [Number]
  },
  createdAt: { type: Date, default: Date.now }
});

// Compound index
userSchema.index({ firstName: 1, lastName: 1 });

// Text index for search
userSchema.index({ firstName: 'text', lastName: 'text' });

// Geospatial index
userSchema.index({ location: '2dsphere' });

// Using explain() to analyze query
const result = await User.find({ email: 'test@example.com' })
  .explain('executionStats');
  
console.log(result.executionStats.executionTimeMillis);
```

---

### Q14: Explain MongoDB aggregation pipeline with a practical example.

**Answer:**
The aggregation pipeline processes documents through stages, each transforming the data.

**Common Stages:**
- `$match` - Filter documents
- `$group` - Group and aggregate
- `$project` - Shape output
- `$sort` - Order results
- `$lookup` - Join collections
- `$unwind` - Deconstruct arrays

**Example - Sales Analytics:**
```javascript
// Get monthly sales report with top products
const salesReport = await Order.aggregate([
  // Stage 1: Filter orders from last 6 months
  {
    $match: {
      createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
      status: 'completed'
    }
  },
  
  // Stage 2: Unwind products array
  { $unwind: '$products' },
  
  // Stage 3: Lookup product details
  {
    $lookup: {
      from: 'products',
      localField: 'products.productId',
      foreignField: '_id',
      as: 'productDetails'
    }
  },
  
  // Stage 4: Group by month and product
  {
    $group: {
      _id: {
        month: { $month: '$createdAt' },
        year: { $year: '$createdAt' },
        productId: '$products.productId'
      },
      totalQuantity: { $sum: '$products.quantity' },
      totalRevenue: { $sum: '$products.subtotal' },
      productName: { $first: { $arrayElemAt: ['$productDetails.name', 0] } }
    }
  },
  
  // Stage 5: Sort by revenue
  { $sort: { totalRevenue: -1 } },
  
  // Stage 6: Limit to top 10
  { $limit: 10 },
  
  // Stage 7: Project final shape
  {
    $project: {
      _id: 0,
      month: '$_id.month',
      year: '$_id.year',
      productName: 1,
      totalQuantity: 1,
      totalRevenue: { $round: ['$totalRevenue', 2] }
    }
  }
]);
```

---

### Q15: How do you handle transactions in MongoDB?

**Answer:**
MongoDB supports multi-document ACID transactions (since v4.0 for replica sets, v4.2 for sharded clusters).

**Example:**
```javascript
const session = await mongoose.startSession();

try {
  session.startTransaction();
  
  // Transfer money between accounts
  const fromAccount = await Account.findByIdAndUpdate(
    fromAccountId,
    { $inc: { balance: -amount } },
    { session, new: true }
  );
  
  if (fromAccount.balance < 0) {
    throw new Error('Insufficient funds');
  }
  
  await Account.findByIdAndUpdate(
    toAccountId,
    { $inc: { balance: amount } },
    { session }
  );
  
  // Create transaction record
  await Transaction.create([{
    from: fromAccountId,
    to: toAccountId,
    amount,
    type: 'transfer'
  }], { session });
  
  await session.commitTransaction();
  console.log('Transaction successful');
  
} catch (error) {
  await session.abortTransaction();
  console.error('Transaction failed:', error);
  throw error;
  
} finally {
  session.endSession();
}
```

---

### Q16: What are the different types of NoSQL databases? Why choose MongoDB?

**Answer:**

**Types of NoSQL databases:**
| Type | Examples | Best For |
|------|----------|----------|
| **Document** | MongoDB, CouchDB | Flexible schemas, JSON-like data |
| **Key-Value** | Redis, DynamoDB | Caching, sessions, simple lookups |
| **Column-Family** | Cassandra, HBase | Time-series, analytics at scale |
| **Graph** | Neo4j, Amazon Neptune | Relationships, social networks |

**Why choose MongoDB:**
- **Flexible schema** - No need to define structure upfront
- **Scalability** - Horizontal scaling with sharding
- **Developer experience** - JSON-like documents match application objects
- **Rich queries** - Supports complex queries, aggregations, full-text search
- **High availability** - Built-in replication

**Example use case:**
```javascript
// E-commerce product with varying attributes
const product1 = {
  name: "iPhone 15",
  category: "electronics",
  specs: { ram: "8GB", storage: "256GB", color: "black" }
};

const product2 = {
  name: "Nike Air Max",
  category: "footwear",
  specs: { size: "10", material: "mesh", sole: "air cushion" }
};

// Both can be stored in the same collection!
```

---

### Q17: Explain MongoDB CRUD operations with examples.

**Answer:**

```javascript
// CREATE
// Insert one document
const result = await User.create({
  name: 'Aditya',
  email: 'aditya@example.com',
  age: 25
});

// Insert many documents
await User.insertMany([
  { name: 'User1', email: 'user1@example.com' },
  { name: 'User2', email: 'user2@example.com' }
]);

// READ
// Find one
const user = await User.findOne({ email: 'aditya@example.com' });

// Find by ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Find all with conditions
const users = await User.find({ age: { $gte: 18 } })
  .select('name email')  // Projection
  .sort({ name: 1 })     // Sort ascending
  .skip(0)               // Pagination
  .limit(10);

// UPDATE
// Update one document
await User.updateOne(
  { email: 'aditya@example.com' },
  { $set: { age: 26 }, $inc: { loginCount: 1 } }
);

// Find and update (returns updated document)
const updated = await User.findByIdAndUpdate(
  userId,
  { $push: { orders: newOrderId } },
  { new: true, runValidators: true }
);

// Update many
await User.updateMany(
  { isActive: false },
  { $set: { status: 'inactive' } }
);

// DELETE
// Delete one
await User.deleteOne({ email: 'user@example.com' });

// Delete many
await User.deleteMany({ createdAt: { $lt: oneYearAgo } });

// Find and delete (returns deleted document)
const deleted = await User.findByIdAndDelete(userId);
```

---

### Q18: What is sharding in MongoDB? When would you use it?

**Answer:**
Sharding is MongoDB's method for horizontal scaling - distributing data across multiple machines.

**When to use sharding:**
- Single server can't handle data volume
- Write/read throughput exceeds single server capacity
- Data needs to be geographically distributed

**Key Concepts:**
```
┌─────────────────────────────────────────────────────────┐
│                      mongos (Router)                     │
│         Routes queries to appropriate shards             │
└─────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Shard 1 │    │  Shard 2 │    │  Shard 3 │
    │ (A - G)  │    │ (H - N)  │    │ (O - Z)  │
    └──────────┘    └──────────┘    └──────────┘
```

**Shard Key strategies:**

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **Range** | `{ timestamp: 1 }` | Good for range queries | Hotspots possible |
| **Hashed** | `{ _id: 'hashed' }` | Even distribution | No range queries |
| **Zone** | Geographic regions | Data locality | More complex |

**Example:**
```javascript
// Enable sharding on database
sh.enableSharding("myDatabase");

// Shard a collection with hashed key
sh.shardCollection("myDatabase.users", { _id: "hashed" });

// Shard with range key
sh.shardCollection("myDatabase.orders", { userId: 1, orderDate: 1 });
```

---

### Q19: Explain MongoDB replication and replica sets.

**Answer:**
Replication provides redundancy and high availability by maintaining multiple copies of data across servers.

**Replica Set Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                      Primary Node                        │
│     • Receives all write operations                      │
│     • Records changes in oplog                          │
└─────────────────────────────────────────────────────────┘
                    │ Replicates to
         ┌──────────┴──────────┐
         ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│  Secondary 1     │   │  Secondary 2     │
│  • Read replicas │   │  • Read replicas │
│  • Can become    │   │  • Can become    │
│    primary       │   │    primary       │
└─────────────────┘   └─────────────────┘
```

**Key Benefits:**
- **High availability** - Automatic failover if primary fails
- **Read scaling** - Read from secondaries
- **Data safety** - Multiple copies of data

**Mongoose connection with replica set:**
```javascript
mongoose.connect('mongodb://server1:27017,server2:27017,server3:27017/mydb', {
  replicaSet: 'myReplicaSet',
  readPreference: 'secondaryPreferred', // Read from secondary when possible
  w: 'majority',                        // Write concern
  wtimeoutMS: 5000
});

// Read preference options
// primary - Default, read from primary
// primaryPreferred - Primary if available, else secondary
// secondary - Only secondaries
// secondaryPreferred - Secondary if available, else primary
// nearest - Lowest network latency
```

---

### Q20: What are MongoDB operators? Explain comparison and logical operators.

**Answer:**

**Comparison Operators:**
```javascript
// $eq - Equal
await User.find({ age: { $eq: 25 } });

// $ne - Not equal
await User.find({ status: { $ne: 'inactive' } });

// $gt, $gte - Greater than (or equal)
await User.find({ age: { $gt: 18 } });

// $lt, $lte - Less than (or equal)
await Order.find({ total: { $lte: 1000 } });

// $in - Match any value in array
await User.find({ role: { $in: ['admin', 'moderator'] } });

// $nin - Not in array
await User.find({ status: { $nin: ['banned', 'suspended'] } });
```

**Logical Operators:**
```javascript
// $and - All conditions must match
await User.find({
  $and: [
    { age: { $gte: 18 } },
    { status: 'active' }
  ]
});

// $or - At least one condition must match
await Product.find({
  $or: [
    { category: 'electronics' },
    { price: { $lt: 100 } }
  ]
});

// $not - Negates an expression
await User.find({
  age: { $not: { $gt: 65 } }
});

// $nor - None of the conditions match
await User.find({
  $nor: [
    { status: 'banned' },
    { isDeleted: true }
  ]
});
```

**Array Operators:**
```javascript
// $all - Array contains all specified elements
await Product.find({ tags: { $all: ['sale', 'featured'] } });

// $elemMatch - At least one element matches all conditions
await Order.find({
  items: { 
    $elemMatch: { 
      product: 'iPhone', 
      quantity: { $gte: 2 } 
    } 
  }
});

// $size - Array of specific length
await User.find({ skills: { $size: 5 } });
```

**Update Operators:**
```javascript
// $set - Set field value
await User.updateOne({ _id: userId }, { $set: { name: 'New Name' } });

// $unset - Remove field
await User.updateOne({ _id: userId }, { $unset: { tempField: '' } });

// $inc - Increment value
await Product.updateOne({ _id: productId }, { $inc: { stock: -1, sales: 1 } });

// $push - Add to array
await User.updateOne({ _id: userId }, { $push: { orders: newOrderId } });

// $pull - Remove from array
await User.updateOne({ _id: userId }, { $pull: { cart: { productId: pId } } });

// $addToSet - Add to array if not exists
await User.updateOne({ _id: userId }, { $addToSet: { tags: 'premium' } });
```

---

### Q21: How do you optimize MongoDB queries? What are explain() and hint()?

**Answer:**

**Using explain() to analyze queries:**
```javascript
// Get execution stats
const explanation = await User.find({ email: 'test@example.com' })
  .explain('executionStats');

console.log(explanation.executionStats);
// {
//   executionTimeMillis: 2,
//   totalDocsExamined: 1,    // Documents scanned
//   totalKeysExamined: 1,    // Index entries scanned
//   nReturned: 1             // Documents returned
// }

// Key metrics to watch:
// - IXSCAN = Using index (good)
// - COLLSCAN = Collection scan (needs index)
// - totalDocsExamined should be close to nReturned
```

**Common optimization techniques:**

```javascript
// 1. Create appropriate indexes
userSchema.index({ email: 1 });                    // Single field
userSchema.index({ lastName: 1, firstName: 1 });   // Compound index
userSchema.index({ '$**': 'text' });               // Text index

// 2. Use projection to limit returned fields
const users = await User.find({}, { name: 1, email: 1 }); // Only name and email

// 3. Use lean() for read-only operations
const users = await User.find().lean(); // Returns plain JS objects

// 4. Pagination with skip and limit
const page = 2, limit = 20;
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);

// 5. Use hint() to force specific index
const users = await User.find({ status: 'active' })
  .hint({ status: 1, createdAt: -1 });

// 6. Covered queries (only indexed fields returned)
await User.find(
  { email: 'test@example.com' },
  { email: 1, _id: 0 }
).hint({ email: 1 });
```

**Query anti-patterns to avoid:**
```javascript
// ❌ Avoid $regex without anchors (can't use index efficiently)
await User.find({ name: { $regex: 'john' } });

// ✅ Better - anchored regex
await User.find({ name: { $regex: '^john', $options: 'i' } });

// ❌ Avoid $ne and $nin (scan entire collection)
await User.find({ status: { $ne: 'deleted' } });

// ✅ Better - use positive matching
await User.find({ status: { $in: ['active', 'pending'] } });

// ❌ Avoid skip() with large offsets
await User.find().skip(10000).limit(10); // Slow!

// ✅ Better - use range-based pagination
await User.find({ _id: { $gt: lastSeenId } }).limit(10);
```

---

## 4. JavaScript Core Concepts

### Q16: Explain closures in JavaScript with examples.

**Answer:**
A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned.

**Example - Private variables:**
```javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
console.log(counter.count);       // undefined (private!)
```

**Example - Function factory:**
```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**Common pitfall - Loop closures:**
```javascript
// Problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs: 3, 3, 3
}

// Solution 1: Use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs: 0, 1, 2
}

// Solution 2: Use IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i); // Logs: 0, 1, 2
}
```

---

### Q17: What is the difference between == and ===? Explain type coercion.

**Answer:**

- `==` (Loose equality): Compares values after type coercion
- `===` (Strict equality): Compares values AND types without coercion

**Type Coercion Rules:**
```javascript
// String to Number
'5' == 5       // true (string converted to number)
'5' === 5      // false (different types)

// Boolean to Number
true == 1      // true (true becomes 1)
false == 0     // true (false becomes 0)
'1' == true    // true ('1' -> 1, true -> 1)

// null and undefined
null == undefined  // true (special case)
null === undefined // false

// Object to primitive
[1] == 1       // true ([1].valueOf() -> '1' -> 1)
[1,2] == '1,2' // true (array converted to string)

// Falsy values
0 == false     // true
'' == false    // true
null == false  // false (null only equals undefined)
```

**Best Practice:** Always use `===` unless you specifically need type coercion.

---

### Q18: Explain 'this' keyword in JavaScript and how it behaves in different contexts.

**Answer:**
`this` refers to the context in which a function is executed.

| Context | `this` refers to |
|---------|------------------|
| Global | `window` (browser) / `global` (Node) |
| Object method | The object |
| Regular function | `undefined` (strict) / `window` (non-strict) |
| Arrow function | Lexical `this` (inherited from outer scope) |
| Constructor | New instance |
| Event handler | The element that received the event |

**Examples:**
```javascript
// Object method
const obj = {
  name: 'Object',
  greet() {
    console.log(this.name); // 'Object'
  }
};

// Arrow function lexical this
const obj2 = {
  name: 'Object2',
  greet: () => {
    console.log(this.name); // undefined (lexical scope)
  },
  delayedGreet() {
    setTimeout(() => {
      console.log(this.name); // 'Object2' (arrow inherits this)
    }, 100);
  }
};

// Explicit binding
function greet() {
  console.log(`Hello, ${this.name}`);
}

const person = { name: 'Aditya' };

greet.call(person);    // Hello, Aditya
greet.apply(person);   // Hello, Aditya

const boundGreet = greet.bind(person);
boundGreet();          // Hello, Aditya
```

---

### Q19: What is the difference between var, let, and const?

**Answer:**

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized as undefined) | Yes (TDZ) | Yes (TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |

**Examples:**
```javascript
// Hoisting difference
console.log(a); // undefined (hoisted)
console.log(b); // ReferenceError (TDZ)
var a = 1;
let b = 2;

// Block scope
if (true) {
  var x = 1;
  let y = 2;
  const z = 3;
}
console.log(x); // 1
console.log(y); // ReferenceError
console.log(z); // ReferenceError

// const with objects (reference is constant, not value)
const arr = [1, 2, 3];
arr.push(4);     // OK
arr = [1, 2];    // TypeError

const obj = { a: 1 };
obj.b = 2;       // OK
obj = { c: 3 };  // TypeError
```

---

### Q20: Explain prototypes and prototypal inheritance.

**Answer:**
JavaScript uses prototypal inheritance - objects inherit from other objects through the prototype chain.

**Example:**
```javascript
// Constructor function
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Override method
Dog.prototype.speak = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // Rex barks

// ES6 class syntax (syntactic sugar over prototypes)
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks`);
  }
}
```

---

## 5. ES6/ES7 & Programming Paradigms

### Q21: Explain key ES6+ features that you use regularly.

**Answer:**

**1. Destructuring:**
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age, city = 'Unknown' } = person;

// Nested destructuring
const { address: { street, zipCode } } = user;

// Function parameters
function greet({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
```

**2. Spread operator:**
```javascript
// Array spread
const combined = [...arr1, ...arr2];
const copy = [...original];

// Object spread
const updated = { ...user, name: 'New Name' };
const merged = { ...defaults, ...options };
```

**3. Template literals:**
```javascript
const message = `Hello ${name}, you have ${count} messages`;

// Multi-line strings
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
```

**4. Arrow functions:**
```javascript
const add = (a, b) => a + b;
const square = x => x * x;
const getUser = () => ({ name: 'John', age: 30 });
```

**5. Optional chaining & Nullish coalescing:**
```javascript
// Optional chaining (?.)
const street = user?.address?.street;
const firstItem = arr?.[0];
const result = obj?.method?.();

// Nullish coalescing (??)
const value = input ?? 'default'; // Only null/undefined trigger default
const count = 0 ?? 10;  // 0 (different from ||)
```

---

### Q22: Explain the differences between functional and object-oriented programming.

**Answer:**

| Aspect | Functional Programming | Object-Oriented Programming |
|--------|------------------------|------------------------------|
| Core concept | Pure functions | Objects with state & behavior |
| Data | Immutable | Mutable |
| State | Avoided | Encapsulated in objects |
| Side effects | Minimal | Common |
| Composition | Function composition | Inheritance & composition |

**Functional approach:**
```javascript
// Pure functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Function composition
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const addTax = amount => amount * 1.18;
const applyDiscount = amount => amount * 0.9;
const formatPrice = amount => `₹${amount.toFixed(2)}`;

const calculateFinalPrice = compose(formatPrice, addTax, applyDiscount);
console.log(calculateFinalPrice(1000)); // ₹1062.00

// Higher-order functions
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

const names = users
  .filter(u => u.age >= 25)
  .map(u => u.name)
  .reduce((acc, name) => acc + ', ' + name);
```

**Object-oriented approach:**
```javascript
class ShoppingCart {
  constructor() {
    this.items = [];
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  
  applyDiscount(percent) {
    const discount = this.getTotal() * (percent / 100);
    return this.getTotal() - discount;
  }
}

class PremiumCart extends ShoppingCart {
  constructor() {
    super();
    this.memberDiscount = 10;
  }
  
  getTotal() {
    return super.getTotal() * (1 - this.memberDiscount / 100);
  }
}
```

---

## 6. Asynchronous Programming

### Q23: Explain callbacks, Promises, and async/await. What problems do they solve?

**Answer:**

**Callbacks (Traditional):**
```javascript
// Callback hell
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      console.log(details);
      // More nesting...
    });
  });
});
```

**Promises (ES6):**
```javascript
// Chain promises
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => console.log(details))
  .catch(error => console.error(error));

// Promise.all - parallel execution
const [users, products] = await Promise.all([
  fetchUsers(),
  fetchProducts()
]);

// Promise.race - first to complete
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
]);

// Promise.allSettled - all complete regardless of success/failure
const results = await Promise.allSettled([
  fetchData1(),
  fetchData2(),
  fetchData3()
]);
```

**Async/Await (ES7):**
```javascript
// Clean, synchronous-looking code
async function getUserOrders(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    return details;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Parallel execution with async/await
async function fetchDashboardData() {
  const [users, orders, products] = await Promise.all([
    fetchUsers(),
    fetchOrders(),
    fetchProducts()
  ]);
  
  return { users, orders, products };
}
```

---

### Q24: How do you handle errors in asynchronous code?

**Answer:**

**Pattern 1: Try-catch with async/await:**
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
    } else if (error instanceof TypeError) {
      console.error('Network error:', error);
    } else {
      console.error('Fetch error:', error);
    }
    throw error;
  }
}
```

**Pattern 2: Error-first result tuple:**
```javascript
// Utility function
async function to(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

// Usage
const [error, user] = await to(fetchUser(id));

if (error) {
  console.error('Failed to fetch user:', error);
  return;
}

console.log('User:', user);
```

**Pattern 3: Higher-order error handler:**
```javascript
// Express.js async handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
}));
```

---

## 7. Git & Version Control

### Q25: Explain your Git workflow and common commands you use.

**Answer:**

**Common workflow:**
```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes and stage
git add -A
git status

# Commit with meaningful message
git commit -m "feat: add JWT authentication middleware"

# Push to remote
git push -u origin feature/user-authentication

# Keep branch updated with main
git fetch origin
git rebase origin/main

# Squash commits before merge
git rebase -i HEAD~3

# Create pull request (via GitHub/GitLab)

# After review, merge and clean up
git checkout main
git pull origin main
git branch -d feature/user-authentication
```

**Useful commands:**
```bash
# View commit history
git log --oneline -n 10
git log --graph --all --oneline

# Undo changes
git checkout -- <file>        # Discard working changes
git reset HEAD <file>         # Unstage file
git reset --soft HEAD~1       # Undo last commit, keep changes
git reset --hard HEAD~1       # Undo last commit, discard changes

# Stash changes
git stash
git stash list
git stash pop
git stash apply stash@{1}

# Cherry-pick specific commit
git cherry-pick <commit-hash>

# Resolve merge conflicts
git mergetool
git add <resolved-file>
git merge --continue
```

---

## 8. Linux/Ubuntu Commands

### Q26: What Linux commands do you use regularly for development?

**Answer:**

```bash
# Navigation and file operations
cd /path/to/directory
ls -la                      # List all files with details
pwd                         # Print working directory
mkdir -p dir1/dir2          # Create nested directories
cp -r source dest           # Copy recursively
mv old new                  # Move/rename
rm -rf directory            # Remove directory forcefully

# File viewing and editing
cat file.txt                # View entire file
less file.txt               # Paginated view
head -n 20 file.txt         # First 20 lines
tail -f logfile.log         # Follow log file in real-time
nano file.txt               # Edit with nano
vim file.txt                # Edit with vim

# Searching
grep -r "pattern" .         # Search recursively
grep -rn "error" --include="*.js"  # Search in JS files with line numbers
find . -name "*.log"        # Find files by name
find . -type f -mtime -1    # Files modified in last day

# Process management
ps aux | grep node          # Find node processes
top                         # System monitor
htop                        # Better system monitor
kill -9 <PID>               # Force kill process
lsof -i :3000               # Find what's using port 3000

# Network
curl -X GET http://localhost:3000/api
wget http://example.com/file
netstat -tulpn              # List listening ports
ss -tulpn                   # Modern alternative

# Package management (Ubuntu)
sudo apt update
sudo apt install nodejs
sudo apt upgrade

# Permissions
chmod 755 script.sh         # Make executable
chown user:group file       # Change ownership

# SSH
ssh user@server
scp file.txt user@server:/path
ssh-keygen -t rsa -b 4096
```

---

## 9. Browser Performance & Rendering

### Q27: Explain how browsers render web pages and how to optimize performance.

**Answer:**

**Browser Rendering Pipeline:**
1. **Parse HTML** → DOM Tree
2. **Parse CSS** → CSSOM Tree
3. **Combine** → Render Tree
4. **Layout** → Calculate positions and sizes
5. **Paint** → Fill pixels
6. **Composite** → Layer composition

**Performance Optimization Techniques:**

```html
<!-- Critical CSS inline -->
<style>
  /* Above-the-fold CSS */
</style>

<!-- Non-critical CSS async -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Preload critical resources -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Defer non-critical JavaScript -->
<script defer src="app.js"></script>
<script async src="analytics.js"></script>
```

**JavaScript optimizations:**
```javascript
// Debounce scroll/resize handlers
const debounce = (fn, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
};

window.addEventListener('resize', debounce(handleResize, 250));

// Use requestAnimationFrame for animations
function animate() {
  // Update animation
  element.style.transform = `translateX(${position}px)`;
  requestAnimationFrame(animate);
}

// Lazy load images
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));

// Avoid layout thrashing
// Bad
elements.forEach(el => {
  const height = el.offsetHeight; // Force layout
  el.style.height = height + 10 + 'px'; // Trigger reflow
});

// Good - batch reads and writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';
});
```

---

## 10. Elasticsearch (Good to Have)

### Q28: What is Elasticsearch and when would you use it?

**Answer:**
Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It's used for:
- Full-text search
- Log and event data analysis
- Real-time analytics
- Application monitoring

**Basic example with Node.js:**
```javascript
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

// Create index
await client.indices.create({
  index: 'products',
  body: {
    mappings: {
      properties: {
        name: { type: 'text' },
        description: { type: 'text' },
        price: { type: 'float' },
        category: { type: 'keyword' }
      }
    }
  }
});

// Index document
await client.index({
  index: 'products',
  body: {
    name: 'iPhone 15',
    description: 'Latest Apple smartphone with advanced features',
    price: 999.99,
    category: 'electronics'
  }
});

// Search
const result = await client.search({
  index: 'products',
  body: {
    query: {
      multi_match: {
        query: 'apple phone',
        fields: ['name', 'description']
      }
    }
  }
});
```

---

## 11. Agile Development

### Q29: Describe your experience with Agile methodology. What ceremonies have you participated in?

**Answer:**

**Key Ceremonies I've participated in:**

1. **Sprint Planning**
   - Reviewing product backlog
   - Estimating stories using story points
   - Committing to sprint goals
   - Breaking down user stories into tasks

2. **Daily Standups**
   - What I did yesterday
   - What I'm doing today
   - Any blockers

3. **Sprint Review/Demo**
   - Demonstrating completed features to stakeholders
   - Gathering feedback
   - Discussing what to build next

4. **Retrospective**
   - What went well
   - What could be improved
   - Action items for next sprint

**Example sprint story:**
```markdown
### User Story: User Authentication
As a user, I want to log in securely so that I can access my personalized dashboard.

**Acceptance Criteria:**
- [ ] Users can log in with email/password
- [ ] JWT tokens are issued on successful login
- [ ] Invalid credentials show error message
- [ ] Session expires after 24 hours

**Story Points:** 5
**Sprint:** 14
```

---

## 12. Project-Specific Questions

> These questions may come up based on your resume projects. Be ready to discuss them in depth.

### Q30: Tell me about your AI Chat Application project.

**Answer:**
"I built an intelligent chat application using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) integrated with **Google Gemini API**.

**Key Technical Decisions:**

1. **Real-time messaging with WebSocket:**
```javascript
// Server-side WebSocket setup
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  socket.on('message', async (data) => {
    // Store message in MongoDB
    const message = await Message.create({
      content: data.content,
      conversationId: data.conversationId,
      role: 'user'
    });
    
    // Get AI response
    const aiResponse = await geminiService.generateResponse(
      data.content,
      data.conversationHistory
    );
    
    // Emit AI response back
    socket.emit('ai-response', {
      content: aiResponse,
      role: 'assistant'
    });
  });
});
```

2. **Gemini API Integration:**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }
  
  async generateResponse(prompt, history = []) {
    const chat = this.model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    });
    
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }
}
```

3. **Chat persistence in MongoDB:**
```javascript
const conversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  messages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});
```

**Challenges solved:**
- Implemented conversation context management for coherent multi-turn conversations
- Added typing indicators using WebSocket events
- Built responsive UI that works across desktop and mobile

**Live on GitHub:** github.com/adityaSrivastava29/AI-Powered-Chatbot"

---

### Q31: Explain your Custom AI Persona Platform architecture.

**Answer:**
"This platform allows users to create and interact with customizable AI personas with distinct personalities, built with MERN stack and **OpenAI GPT** integration.

**Architecture Overview:**

```
┌─────────────────────────────────────────────────────────────┐
│                     React.js Frontend                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │Persona Config│ │Chat Interface│ │ User Management      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express.js API Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Auth Routes │  │Persona Routes│ │   Chat Routes        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   MongoDB   │       │ OpenAI API  │       │    Redis    │
│(User/Persona)│       │     GPT     │       │   (Cache)   │
└─────────────┘       └─────────────┘       └─────────────┘
```

**Key Features implemented:**

1. **Dynamic Persona Configuration:**
```javascript
const personaSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  personality: {
    traits: [String],        // ['friendly', 'professional', 'humorous']
    tone: String,            // 'casual' | 'formal' | 'enthusiastic'
    expertise: [String]      // ['technology', 'cooking', 'travel']
  },
  systemPrompt: String,      // Custom instructions for the AI
  avatarUrl: String,
  isPublic: { type: Boolean, default: false }
});
```

2. **System prompt engineering:**
```javascript
const buildSystemPrompt = (persona) => {
  return `You are ${persona.name}. 
Your personality traits: ${persona.personality.traits.join(', ')}.
Your tone is ${persona.personality.tone}.
Areas of expertise: ${persona.personality.expertise.join(', ')}.
${persona.systemPrompt}
Stay in character throughout the conversation.`;
};
```

3. **Cost optimization strategies (reduced API costs by 40%):**
```javascript
// Conversation context management
const optimizeContext = (messages, maxTokens = 2000) => {
  // Keep system prompt + recent messages within token limit
  let tokenCount = 0;
  const optimized = [];
  
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content);
    if (tokenCount + tokens > maxTokens) break;
    tokenCount += tokens;
    optimized.unshift(messages[i]);
  }
  
  return optimized;
};

// Request batching for multiple quick messages
const batchedResponses = await processBatchedRequests(pendingMessages);

// Caching similar queries
const cachedResponse = await redis.get(`prompt:${hashPrompt(prompt)}`);
```

**Live Demo:** adityasri.in/ai-persona-chat-frontend"

---

### Q32: How did you handle authentication and security in your projects?

**Answer:**
"I implemented secure JWT-based authentication with proper security measures:

```javascript
// JWT Token generation
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      throw new AppError('User not found', 401);
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    next(error);
  }
};

// Password hashing with bcrypt
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Input validation with express-validator
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/),
  handleValidationErrors
];
```

**Security measures implemented:**
- HTTPS enforcement
- Rate limiting to prevent brute force attacks
- Helmet.js for security headers
- CORS configuration
- Input sanitization to prevent XSS
- Environment variables for sensitive data"

---

### Q33: How do you handle errors and edge cases in API integrations?

**Answer:**
"Working with external APIs like OpenAI and Gemini, robust error handling is critical:

```javascript
class AIService {
  async generateResponse(prompt, options = {}) {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.callAPI(prompt, options);
        return response;
        
      } catch (error) {
        lastError = error;
        
        // Handle specific error types
        if (error.status === 429) {
          // Rate limit - exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Rate limited. Retrying in ${delay}ms...`);
          await this.sleep(delay);
          continue;
        }
        
        if (error.status === 503) {
          // Service unavailable - retry with backoff
          await this.sleep(attempt * 2000);
          continue;
        }
        
        if (error.status === 400) {
          // Bad request - don't retry, fix the input
          throw new AppError('Invalid request to AI service', 400);
        }
        
        if (error.status >= 500) {
          // Server error - retry
          await this.sleep(1000);
          continue;
        }
        
        throw error;
      }
    }
    
    // All retries exhausted
    console.error('AI service failed after retries:', lastError);
    throw new AppError('AI service temporarily unavailable', 503);
  }
  
  // Fallback response
  getDefaultResponse() {
    return "I'm having trouble processing that request. Please try again.";
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Key patterns:**
- Exponential backoff for rate limits
- Circuit breaker pattern for repeated failures
- Graceful degradation with fallback responses
- Comprehensive logging for debugging
- User-friendly error messages"

---

## 13. Behavioral & Situational Questions

### Q34: Tell me about yourself and your experience.

**Answer:**
"I'm a Full-Stack Software Engineer with over 3 years of experience building scalable web applications. I graduated with a B.Tech in Computer Science from Noida Institute of Engineering and Technology with 8.4 CGPA in 2022.

Currently, I work at **Cognizant Technology Solutions** where I've architected and delivered production-ready applications using **React.js, TypeScript, Node.js, and PostgreSQL**. My work serves **100,000+ active users** with **99.9% uptime**.

**Key Achievements:**
- Engineered **25+ high-performance RESTful APIs** achieving 40% improvement in response times through database optimization and Redis caching
- Built a **reusable React component library** with TypeScript that resulted in 60% code reusability
- Automated deployment pipelines reducing deployment time from **2 hours to 15 minutes** (87% reduction)
- Recognized as **Star Performer (February 2025)** for delivering critical production fixes within 24-hour SLA

I'm also **AWS Certified Developer - Associate** and have hands-on experience with Docker, Kubernetes, and CI/CD pipelines using GitHub Actions.

On the side, I've built personal projects like an **AI Chat Application** using MERN stack with Google Gemini API and a **Custom AI Persona Platform** with OpenAI GPT integration.

I'm excited about Mirable Solutions because your focus on product development using the MERN stack aligns perfectly with my experience and passion for building cutting-edge solutions."

---

### Q35: Describe a challenging technical problem you solved.

**Answer:**
"At Cognizant, we had a critical performance issue where our API response times were significantly impacting the user experience for an application serving 100,000+ users.

**The Problem:**
- Slow database queries on high-frequency operations
- No caching mechanism in place
- Response times averaging 800ms+
- Users experiencing delays during peak hours

**My Approach:**

1. **Analyzed query patterns** - Identified the most frequently accessed endpoints and their database queries

2. **Implemented Redis caching strategy:**
```javascript
const getUser = async (userId) => {
  // Check cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  // Query database and cache result
  const user = await User.findById(userId);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
};
```

3. **Optimized database queries:**
   - Added proper indexes on frequently queried fields
   - Used pagination and projection to limit data transfer
   - Optimized JOIN queries in PostgreSQL

4. **Implemented query optimization in MongoDB:**
```javascript
// Before: Full document retrieval
const users = await User.find({});

// After: Projection + Indexing
const users = await User.find({}, { name: 1, email: 1 })
  .lean()
  .limit(100);
```

**Result:** 
- Achieved **40% improvement in response times**
- Reduced average response time from 800ms to ~480ms
- System maintained **99.9% uptime**
- This was part of the work that earned me the **Star Performer** recognition"

---

### Q36: How do you handle working under pressure with tight deadlines?

**Answer:**
"At Cognizant, I've handled multiple high-pressure situations, and I follow a structured approach:

1. **Prioritize ruthlessly** - Focus on critical path features
2. **Break down tasks** - Large tasks become manageable pieces
3. **Communicate proactively** - Early escalation prevents last-minute surprises
4. **Automate where possible** - Use existing tools and pipelines
5. **Focus on working software** - Iterate after delivering the MVP

**Example - Production Critical Fix:**
I was recognized as **Star Performer (February 2025)** specifically for handling a critical production issue. Here's what happened:

- A major bug was impacting users in production during peak hours
- Had a **24-hour SLA** to deliver the fix
- I quickly analyzed logs and identified the root cause (a race condition in our async processing)
- Wrote a fix with proper tests
- Coordinated with QA for expedited testing
- Used our **automated CI/CD pipeline** (which I helped build) to deploy quickly
- Deployed the fix within SLA with zero additional incidents

The same CI/CD automation I built earlier (reducing deployment from 2 hours to 15 minutes) was crucial in meeting this tight deadline."

---

### Q37: Tell me about a time you had a disagreement with a team member.

**Answer:**
"At Cognizant, I had a situation where our team was debating the testing strategy for a new microservices project. A senior developer preferred minimal unit tests with heavy reliance on manual QA, while I advocated for a comprehensive automated testing approach.

**The Situation:**
- We were building microservices processing 2+ million events monthly
- Manual testing was becoming a bottleneck
- I believed automated testing would improve velocity

**How I handled it:**
1. **Listened to concerns** - Understood his worry about initial time investment
2. **Presented data** - Showed how bugs caught early cost less to fix
3. **Proposed a pilot** - Suggested implementing Jest tests for one critical service first
4. **Demonstrated value** - Showed how CI/CD could run tests automatically

**Outcome:**
- We implemented my testing strategy for the pilot service
- Achieved **95% code coverage**
- **Reduced production bugs by 70%**
- **Manual testing effort reduced by 80%**
- Team adopted the approach across all services
- Eventually led the initiative to introduce automated testing best practices team-wide

**Key learning:** Data and proof-of-concept demonstrations are more persuasive than theoretical arguments."

---

### Q38: Where do you see yourself in 3-5 years?

**Answer:**
"In the next 3-5 years, I see myself growing along these dimensions:

**Technical depth:**
- I'm already **AWS Certified Developer - Associate** and want to deepen my cloud expertise
- I'm passionate about **AI integration in applications** - I've built an AI Chat Application with Gemini API and a Custom AI Persona Platform with OpenAI GPT
- I want to become an expert in architecting scalable full-stack solutions

**Leadership:**
- Currently mentoring and leading innovation initiatives at Cognizant
- Want to lead feature teams and drive architectural decisions
- Continue improving team practices (I've already introduced automated testing and CI/CD best practices that increased deployment frequency from weekly to daily)

**Product mindset:**
- Understanding business impact of technical decisions
- Contributing to product strategy, not just implementation

**At Mirable Solutions specifically:**
- I'm excited about your product development focus
- The MERN stack aligns perfectly with my experience
- I see great opportunity to apply my AI/ML integration experience to enhance your products
- Would love to take increasing ownership in architecting and delivering key features"

---

### Q39: Do you have any questions for us?

**Suggested questions to ask:**

1. "What does the typical product development cycle look like here? How do developers collaborate with product and design teams?"

2. "What's the current tech stack composition? Are there plans to adopt any new technologies?"

3. "How is the team structured? Will I be working on a specific product or across multiple projects?"

4. "What does success look like for a developer in the first 90 days?"

5. "What are the biggest technical challenges the team is currently facing?"

6. "How does the team approach code reviews and knowledge sharing?"

7. "What opportunities are there for learning and professional development?"

---

## Quick Reference Cards

### React Hooks Cheatsheet
| Hook | Purpose |
|------|---------|
| `useState` | Local state |
| `useEffect` | Side effects |
| `useContext` | Context consumption |
| `useReducer` | Complex state logic |
| `useMemo` | Memoize values |
| `useCallback` | Memoize functions |
| `useRef` | Persist values, DOM refs |

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### MongoDB Operators
| Operator | Usage |
|----------|-------|
| `$eq`, `$ne`, `$gt`, `$lt` | Comparison |
| `$in`, `$nin` | Array membership |
| `$and`, `$or`, `$not` | Logical |
| `$set`, `$unset`, `$inc` | Update |
| `$push`, `$pull`, `$addToSet` | Array update |

---

> **Good luck with your interview tomorrow!** 🚀
