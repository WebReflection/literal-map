# literal-map

<sup>**Social Media Photo by [Pisit Heng](https://unsplash.com/@pisitheng) on [Unsplash](https://unsplash.com/)**</sup>

[![build](https://github.com/WebReflection/literal-map/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/literal-map/actions/workflows/node.js.yml) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/literal-map/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/literal-map?branch=main)

A Map that acts like an object literal to better reflect Python dictionaries in JS or allow literal to *Map* or *Map* to literals migrations.

```js
import LiteralMap from 'literal-map';

// create Map like instances
const lm = new LiteralMap([['a', 1], ['b', 2]]);

lm instanceof Map;        // true
lm instanceof LiteralMap; // true

// access properties like object literals
// or just like Python dictionaries
lm.a === 1;               // true
lm.get('a') === 1;        // true

// set new properties or remove these
delete lm.b;
lm.c = 3;

// destructor or spread like literals
JSON.stringify({...lm, b:2}); // {"a":1,"c":3,"b":2}

// serialize like literals
JSON.stringify(lm);       // {"a":1,"c":3}

// array spread like Map
[...lm];                  // [['a',1],['c',3]]
```

## API Details

  * the class returns a *Proxy* of a map with a handler that simplifies access to, and manipulation of, the underlying data as object literal
  * all explicitly set fields/properties are stored in the map
  * special descriptors are also directly stored in the map and, if enumerable, spread as literal too
  * overriding *Map* inherited methods or properties is allowed, the same as one can override `hasOwnProperty` in any object literal. If deleted, inherited fields will work again as before.
  * *structuredClone* cannot work with *Proxy* out of the box, but:
    * `structuredClone({...lm})` works
    * `structuredClone([...lm])` works
    * `structuredClone(new Map(lm))` also works

### Differently from Python dictionaries

In Python, there is a difference when `dict.get(...)` is accessed *VS* `dict["get"]`:

  * the former will always use the inherited method even if `dict["get"] = 123` was previously used
  * the latter will result into JSON field and it's accessed as such, not as the method

In this regard, Python dictionaries are less surprise prone if a dictionary is created as:

```python
obj = {"get": 1, "set": 2}

# test
obj["get"]      # 1
obj["set"]      # 2

# valid and working!
obj.get("get")  # 1
```

Unfortunately in JS it's not possible to disambiguate between direct access and square-brackets access, but because an object literal can be defined as such, some method might be shadowed:

```js
const obj = new LiteralMap(
  Object.entries({"get": 1, "set": 2})
);

// test
obj["get"];     // 1
obj["set"];     // 2

// unexpected thrown error
obj.get("get"); // obj.get is not a function
```

### Explicit Workaround

When explicit usage of underlying inherited method or fields is meant, and the instance is known to be a Python dictionary, it's always possible to forward through the class itself inherited utilities:

```js
// at runtime or trapped once: it's the same!
const { get, set, size } = LiteralMap;

const obj = new LiteralMap(
  Object.entries({"get": 1, "set": 2})
);

// test
obj.get;        // 1
obj.set;        // 2

// valid and working!
size(obj);          // 2

get(obj, "get");    // 1
set(obj, "get", 3); // obj

obj.get;            // 3
```

While ergonomics are not perfect with the suggested workaround, it is possible when non object literals are meant or expected to always do the right thing underneath and without penalizing performance in a relevant way.

The internal map is also meant to never leak in the wild, so that undesired operations that could break expectations should never happen.
