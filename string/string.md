
[← Back to Home](../index.md)

# **JavaScript Strings**

JavaScript `String` is a **primitive, immutable, UTF-16 encoded sequence of code units**.
A companion **String object wrapper** provides methods for inspection, slicing, searching, transformation, comparison, and Unicode operations.

Strings are immutable: **all operations return new strings**.

---

# **1. Construction**

```js
const a = "hello";
const b = 'hello';
const c = `hello ${1 + 2}`;
const d = String("hello"); 
const e = new String("hello");
```

---

# **2. Indexing Semantics**

```js
const s = "Aditya";
s[0];      // "A"
s.length;  // 6
```

Strings cannot be mutated.

---

# **3. Character Access Methods**

---

### **`charAt(index)` — Returns the character at the specified index.**

```js
"aditya".charAt(2); // "i"
```

### **`charCodeAt(index)` — Returns UTF-16 code unit at index.**

```js
"ABC".charCodeAt(0); // 65
```

### **`codePointAt(index)` — Returns full Unicode code point.**

```js
"𐌀".codePointAt(0); // 66304
```

### **`at(index)` — Returns character at index; supports negative indexing.**

```js
"aditya".at(-1); // "a"
```

---

# **4. Search & Match Operations**

---

### **`indexOf(sub, fromIndex?)` — Returns first index of `sub`, or -1 if not found.**

```js
"banana".indexOf("na"); // 2
```

### **`lastIndexOf(sub, fromIndex?)` — Returns last index of `sub`.**

```js
"banana".lastIndexOf("na"); // 4
```

### **`includes(sub, fromIndex?)` — Returns true if substring exists.**

```js
"javascript".includes("script"); // true
```

### **`startsWith(prefix, pos?)` — Checks if string begins with prefix.**

```js
"aditya".startsWith("adi"); // true
```

### **`endsWith(suffix, length?)` — Checks if string ends with suffix.**

```js
"aditya".endsWith("tya"); // true
```

### **`search(regex)` — Returns index of first regex match.**

```js
"hello123".search(/\d/); // 5
```

### **`match(regex)` — Returns array of matches or null.**

```js
"abc123".match(/\d+/); // ["123"]
```

### **`matchAll(regex)` — Returns iterator over all regex matches.**

```js
[... "a1b2c3".matchAll(/\d/g)];
```

---

# **5. Extraction / Slicing**

---

### **`slice(start, end)` — Extracts substring; supports negative indices.**

```js
"javascript".slice(0, 4); // "java"
```

### **`substring(start, end)` — Extracts substring; swaps reversed indices.**

```js
"javascript".substring(4, 0);
```

### **`substr(start, length)` — Extracts substring of given length (legacy).**

```js
"javascript".substr(4, 6);
```

---

# **6. Transformation Methods**

---

### **`toUpperCase()` — Returns uppercased copy.**

```js
"adi".toUpperCase();
```

### **`toLowerCase()` — Returns lowercased copy.**

```js
"ADI".toLowerCase();
```

### **`trim()` — Removes leading & trailing whitespace.**

```js
"  x  ".trim();
```

### **`trimStart()` / `trimEnd()` — Removes leading or trailing whitespace.**

```js
"  x  ".trimStart();
```

### **`repeat(n)` — Repeats string n times.**

```js
"ha".repeat(3);
```

### **`replace(searchValue, replaceValue)` — Replaces first match (or regex).**

```js
"banana".replace("a", "A");
```

### **`replaceAll(searchValue, replaceValue)` — Replaces all occurrences.**

```js
"banana".replaceAll("a", "A");
```

### **`padStart(targetLength, padString?)` — Pads the start to target length.**

```js
"5".padStart(3, "0");
```

### **`padEnd(targetLength, padString?)` — Pads the end to target length.**

```js
"5".padEnd(3, "0");
```

---

# **7. Splitting**

### **`split(separator, limit?)` — Splits string into array.**

```js
"1,2,3".split(",");
```

---

# **8. Iteration**

### **`for...of` — Iterates by Unicode code points.**

```js
for (const ch of "aditya") console.log(ch);
```

### **`String.prototype[Symbol.iterator]` — Underlying iterator.**

---

# **9. Template Strings**

### **Multiline literals**

```js
`
Hello
World
`
```

### **Expressions**

```js
`Total: ${2 + 3}`;
```

### **Tagged templates**

```js
tag`line1\nline2`;
```

---

# **10. Unicode / Normalization**

---

### **`normalize(form)` — Normalizes Unicode strings.**

```js
"\u1E9B\u0323".normalize("NFC");
```

### Surrogate pair handling

```js
"𐌀".length;      // 2
[... "𐌀"].length; // 1
```

---

# **11. Conversion**

### **`toString()` — Converts value to string.**

```js
(123).toString();
```

### **`valueOf()` — Returns primitive string of wrapper.**

```js
new String("abc").valueOf();
```

---

# **12. Locale-Aware Comparison**

### **`localeCompare()` — Compares strings using locale rules.**

```js
"ä".localeCompare("z", "de");
```

---

# **13. Method Category Summary**

| Category       | Methods                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------- |
| Character      | `charAt`, `charCodeAt`, `codePointAt`, `at`                                                   |
| Search         | `indexOf`, `lastIndexOf`, `includes`, `startsWith`, `endsWith`, `match`, `matchAll`, `search` |
| Extraction     | `slice`, `substring`, `substr`                                                                |
| Transformation | `toUpperCase`, `toLowerCase`, `trim*`, `repeat`, `replace*`, `padStart`, `padEnd`             |
| Splitting      | `split`                                                                                       |
| Unicode        | `normalize`                                                                                   |
| Locale         | `localeCompare`                                                                               |
| Iteration      | `Symbol.iterator`, `for...of`                                                                 |
| Conversion     | `toString`, `valueOf`                                                                         |

---

# **14. Edge Cases**

### Immutability

All string operations create new strings.

### `slice` vs. `substring`

* Negative index allowed only in `slice`.
* `substring` swaps arguments.

### Unicode pitfalls

UTF-16 code units cause `"😀".length === 2`.

### Regex replace function

```js
"123".replace(/\d+/g, m => m * 2);
```

---

# **15. Examples**

### Pipeline transformation

```js
"   aDiTyA   "
  .trim()
  .toLowerCase()
  .replaceAll("a","@")
  .padStart(10,"_");
```

### Manual slice

```js
function sub(s,a,b){
  let r="";
  for(let i=a;i<b;i++) r+=s[i];
  return r;
}
```

---

# **16. ASCII Table**

(Your included image remains valid.)

---

# **17. Interview Questions**

1. Why are JavaScript strings immutable?
2. Why does `"😀".length === 2`?
3. Difference: `slice`, `substring`, `substr`.
4. Difference: `charCodeAt` vs `codePointAt`.
5. Why avoid `new String()`?
6. What does `localeCompare` provide?
7. How does `matchAll` differ from `match`?
8. How does JS encode strings internally?
9. What are surrogate pairs?
10. How do you correctly count user-visible characters? (`Intl.Segmenter`)

---

If you want, I can also export this as **PDF**, **Markdown file**, **Notion-friendly format**, or **interview cheat sheet**.
