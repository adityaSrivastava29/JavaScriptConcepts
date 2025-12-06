# JavaScript Regular Expressions — 

Covers: syntax, flags, character classes, quantifiers, groups, assertions, Unicode, APIs, performance, pitfalls, debugging, common patterns, and interview questions.

---

## 1. Basics — what a RegExp is

A RegExp is a pattern describing a set of strings. Two creation forms:

```js
const r1 = /abc/i;            // literal form, flags after closing slash
const r2 = new RegExp("a\\d+", "g"); // constructor form; note double-escaping in string
```

`/…/` is parsed at script-compile time; `RegExp()` builds at runtime.

---

## 2. Flags (modifiers)

* `g` — **global**: find all matches; affects `lastIndex` for `exec()` and `test()` behavior.
* `i` — **ignore case**.
* `m` — **multiline**: `^` and `$` match at line boundaries.
* `s` — **dotAll**: `.` matches newline.
* `u` — **unicode**: enables full Unicode semantics (code points, `\u{…}`, `\p{…}`).
* `y` — **sticky**: match starting exactly at `lastIndex`; does not search ahead.
* `d` — **indices** (ES2022): `match`/`exec` return indices of captures via `.indices` property.

Examples:

```js
/^\w+/m      // multiline start-of-line word
/./s         // dotAll: dot matches \n
/\p{Letter}/u // unicode property escape
```

---

## 3. Literal vs RegExp constructor differences

* Literals: `/\d+/` — no double escaping in pattern.
* Constructor: `new RegExp("\\d+", "g")` — backslashes must be escaped because of JS string parsing.
* Use constructor for dynamic patterns.

---

## 4. Character classes & shorthand

* Literal class: `[abc]` — any of `a`, `b`, or `c`.
* Ranges: `[A-Za-z0-9]`.
* Negation: `[^a-z]`.
* Predefined shorthands:

  * `\d` → digit `[0-9]` (in Unicode mode can vary)
  * `\D` → non-digit
  * `\w` → word char `[A-Za-z0-9_]` (note: `\w` does not include many Unicode letters unless `u`+`\p{...}` used)
  * `\W` → non-word
  * `\s` → whitespace (space, tab, newline, etc.)
  * `\S` → non-whitespace
* Dot: `.` matches any character except newline by default; with `s` it matches newline too.

---

## 5. Unicode and property escapes

* `u` flag required for Unicode code point features like `\u{1F600}` and `\p{...}`.
* Unicode property escapes: `\p{Script=Hiragana}`, `\p{Letter}`, `\p{Emoji}`. Use `\P{...}` for negation.
* Example: match letters from all scripts:

  ```js
  /\p{Letter}+/u
  ```

---

## 6. Quantifiers

* Greedy:

  * `a*` — 0 or more (greedy)
  * `a+` — 1 or more
  * `a?` — 0 or 1
  * `a{n}` — exactly n
  * `a{n,}` — n or more
  * `a{n,m}` — between n and m
* Lazy (non-greedy): add `?` after quantifier: `a+?`, `a*?`, `a{2,4}?`
* Possessive quantifiers: **not supported** in JavaScript (e.g., `a++` is invalid); emulate using atomic constructs where possible (JS lacks atomic group support).
* Use reluctant quantifiers to avoid overconsumption when needed.

---

## 7. Grouping & capture

* Capturing group: `( … )` — stores match in numbered groups and in `.groups` if named.
* Non-capturing: `(?: … )` — groups without capturing (useful for alternation or quantifier scoping).
* Named capture (ES2018+): `(?<name> … )` → access via `.groups.name`.
* Backreference: `\1`, `\2`, or `\k<name>` (named backreference).
* Example:

  ```js
  const re = /^(?<area>\d{3})-(\d{3})-(\d{4})$/;
  const m = re.exec("123-456-7890");
  m.groups.area // "123"
  ```

---

## 8. Assertions (lookaround)

* Lookahead:

  * Positive: `(?=… )` — assert following text matches.
  * Negative: `(?!… )` — assert following text does not match.
* Lookbehind (ES2018+):

  * Positive: `(?<=… )` — assert preceding text.
  * Negative: `(?<!… )` — assert preceding text not match.
* Lookbehind must be of finite and well-defined length for many engines; JS requires pattern to be determinable (no complex variable-length constructs that make engine disallow it).
* Examples:

  ```js
  /\d+(?=%)/     // digits followed by percent (but percent not consumed)
  /(?<=\$)\d+/   // digits preceded by a dollar sign
  ```

---

## 9. Anchors

* `^` — start of input (or line with `m`).
* `$` — end of input (or line with `m`).
* `\b` — word boundary (transition between `\w` and `\W`).
* `\B` — not word boundary.
* `\A`, `\z` are not standard JS anchors (use `^` and `$` with care).

---

## 10. Common methods / RegExp API

* `RegExp.prototype.test(str)` → boolean; with `g`/`y` it advances `lastIndex`.
* `RegExp.prototype.exec(str)` → match array with captures; repeated `exec` calls iterate when `g`/`y` set and update `lastIndex`.
* String methods using regex:

  * `str.match(re)` — if `re` has `g` returns array of matches; else returns same as `exec`.
  * `str.matchAll(re)` — returns iterator of full match objects (with groups); `re` should have `g` or `y` to get multiple matches.
  * `str.replace(re, replacement|fn)` — replacement string can use `$1`, `$<name>`, `$&`, `$`` , `$'`, or a function `(match, p1, p2, ..., offset, input, groups) => ...`.
  * `str.search(re)` — returns index of first match or -1.
  * `str.split(re)` — splits string by pattern; capturing groups appear in result.
* Example: use function replacement to transform:

  ```js
  "a1b2".replace(/\d/g, d => String(Number(d) * 2)); // "a2b4"
  ```

---

## 11. `lastIndex`, `g`, `y`, and `exec` behavior

* When a RegExp has `g` or `y`, it maintains `lastIndex`. `exec()` starts matching at `lastIndex`.
* `g` searches from `lastIndex` forward for the next match; `y` requires the match to start exactly at `lastIndex`.
* Reset `lastIndex = 0` when reusing regex across different input strings or use non-global regex for single checks.

Pitfall:

```js
const re = /a/g;
re.test("a"); // true, lastIndex becomes 1
re.test("a"); // false, since lastIndex=1 and search starts after end
```

---

## 12. Escaping rules / special chars

Characters with special regex meaning must be escaped: `.^$*+?()[]\{}|/`

* Escape slash in literal: `/\//` matches `/`.
* In constructor string: `new RegExp("\\.")` to match a literal dot.
* To build dynamic regex from arbitrary user input, escape metacharacters:

```js
function escapeRE(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
```

---

## 13. Greedy vs lazy vs catastrophic backtracking

* Greedy quantifiers try to match as much as possible then backtrack; lazy quantifiers try to match as little as possible.
* Catastrophic backtracking arises from nested ambiguous quantifiers, e.g. `^(a+)+$` on long non-matching input; causes exponential-time behavior.
* Avoid by:

  * Using atomic constructs (not available natively in JS) or refactoring expression.
  * Using alternation anchored with explicit boundaries or possessive-like logic (emulate via lookahead).
  * Prefer specific character classes and anchors.
* Example problematic: `/^(a|aa)+b/` on long `a...a` then `b` absent — heavy backtracking.

---

## 14. Performance tips

* Anchor patterns (`^`, `$`) when possible.
* Avoid `.*` when you can use more precise classes (e.g., `[^"]*` instead of `.*` inside quoted parsing).
* Use non-capturing groups `(?:...)` when capture not required.
* Use `\d`/`\w` with `u` only if Unicode semantics required.
* For repeated processing, precompile regexes once.
* For complex patterns or heavy parsing, consider tokenizer approach rather than a single monstrous regex.

---

## 15. Useful patterns & examples

**Email (simple, pragmatic)**

```js
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**URL (very simple)**

```js
/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
```

**Extract all words (Unicode-aware)**

```js
const words = [...text.matchAll(/\p{L}[\p{L}\p{N}_']*/gu)];
```

**Capture duplicate adjacent words (case-insensitive)**

```js
/\b(\w+)\s+\1\b/i
```

**Validate hex color**

```js
/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
```

**Split on commas not inside quotes**

```js
const parts = str.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
```

**Remove HTML tags (simple)**

```js
str.replace(/<[^>]*>/g, "");
```

---

## 16. Debugging & testing tools (workflow)

* Build small pieces incrementally; test subpatterns.
* Use `console.log` with `RegExp.prototype.exec` for captures:

  ```js
  const m = /(\d+)-(\w+)/.exec("12-abc");
  console.log(m[1], m[2]);
  ```
* Use online regex testers (debugger tools) when pattern complex (note: those testers may run different engines).
* Add anchors and flags explicitly to see expected behavior.

---

## 17. Common pitfalls

* Forgetting to escape user input in `RegExp()` constructor → security risk (ReDoS) and broken patterns.
* Reusing global regex objects across string inputs without resetting `.lastIndex`.
* Assuming `str.match(re)` returns same shape for `g` vs non-`g` regex.
* Expecting `.` to match newline without `s`.
* Counting characters via `.length` for Unicode user-visible characters — use grapheme segmentation (`Intl.Segmenter`) or use `[...str]` to iterate code points (still not grapheme clusters).

---

## 18. Advanced topics (brief)

* **`Intl.Segmenter`** for grapheme cluster-aware iteration (user-visible characters).
* **Regex indices (`d` flag)**: get start/end indices for captures.
* **Unicode property escapes** `\p{…}` for script/category matching.
* **Composition vs normalization**: normalize text before matching combining characters.

---

## 19. Quick reference cheat-sheet

* Create:

  * Literal: `/pattern/flags`
  * Constructor: `new RegExp("pattern", "flags")`
* Test: `re.test(str)`
* First match with captures: `re.exec(str)` or `str.match(re)` (non-global)
* All matches: `str.matchAll(/.../g)` or loop `while (m = re.exec(str))`
* Replace: `str.replace(re, (m, g1, g2, offset, input, groups) => ...)`
* Escape user input: `s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`

---

## 20. Replacement template tokens

Inside replacement string:

* `$&` — matched substring
* `$1`, `$2`, … — captures
* `$<name>` — named capture
* `$`` — portion before match
* `$'` — portion after match
* `$$` — literal `$`

Example:

```js
"John".replace(/(J)(ohn)/, "$2, $1"); // "ohn, J"
```

---

## 21. Interview questions (regex-focused)

1. Explain differences between `g` and `y` flags.
2. How does `lastIndex` work and what pitfalls does it cause with `test()` and `exec()`?
3. Why use non-capturing groups `(?: … )`?
4. How to safely build a regex from user input? (Show escape function.)
5. Explain greedy vs lazy quantifiers and give examples.
6. What is catastrophic backtracking and how to mitigate it?
7. How do lookaheads differ from lookbehinds; give use-cases for each.
8. How to match full Unicode letters in JS reliably? (Use `u` + `\p{Letter}` or `Intl.Segmenter`.)
9. Why is `new RegExp(".")` different from `/./s` sometimes? (String escaping & flags.)
10. How to capture replacement groups with names and use them in `.replace()`.

---

## 22. Short sample patterns with explanation

**Phone with optional country code**

```js
/^(?:\+?(\d{1,3}))?[-. (]?(\d{3})[-. )]?(\d{3})[-. ]?(\d{4})$/
```

* `(?: … )?` optional non-capturing country code.
* `(\d{3})` area code captured.

**CSV field split respecting quotes**

```js
/(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g
```

* Handles quoted fields with internal `""` escapes.

---

