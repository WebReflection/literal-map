# literal-map

<sup>**Social Media Photo by [Pisit Heng](https://unsplash.com/@pisitheng) on [Unsplash](https://unsplash.com/)**</sup>

[![build](https://github.com/WebReflection/literal-map/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/literal-map/actions/workflows/node.js.yml)

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

### API Details

  * the class returns a *Proxy* of a map with a handler that simplifies access to, and manipulation of, the underlying data as object literal
  * all explicitly set fields/properties are stored in the map
  * special descriptors are also directly stored in the map and, if enumerable, spread as literal too
  * overriding *Map* inherited methods or properties is allowed, the same as one can override `hasOwnProperty` in any object literal. If deleted, inherited fields will work again as before.
  * *structuredClone* cannot work with *Proxy* out of the box, but:
    * `structuredClone({...lm})` works
    * `structuredClone([...lm])` works
    * `structuredClone(new Map(lm))` also works
