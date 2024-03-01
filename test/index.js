const LiteralMap = require('../cjs');

console.assert(JSON.stringify({...new LiteralMap}) === '{}');

const lm = new LiteralMap([['a', 1]]);

console.assert(lm instanceof LiteralMap);
console.assert(lm instanceof Map);
console.assert(lm.size === 1);
console.assert(lm.a === 1);
console.assert(lm.get('a') === 1);
console.assert(LiteralMap.get(lm, 'a') === 1);
console.assert('a' in lm);

lm.b = 2;
console.assert(lm.size === 2);
console.assert(lm.a === 1);
console.assert(lm.b === 2);
console.assert(lm.get('a') === 1);
console.assert(lm.get('b') === 2);

lm.set('c', 3);
console.assert(lm.size === 3);
console.assert(lm.a === 1);
console.assert(lm.b === 2);
console.assert(lm.c === 3);
console.assert(lm.get('a') === 1);
console.assert(lm.get('b') === 2);
console.assert(lm.get('c') === 3);

let obj = {...lm};
console.assert(JSON.stringify(obj) === '{"a":1,"b":2,"c":3}');

Object.defineProperty(lm, 'd', {value: 4, enumerable: true, configurable: true});
console.assert('d' in lm);
obj = {...lm};
console.assert(JSON.stringify(obj) === '{"a":1,"b":2,"c":3,"d":4}');

delete lm.d;
obj = {...lm};
console.assert(JSON.stringify(obj) === '{"a":1,"b":2,"c":3}');

delete lm.c;
obj = {...lm};
console.assert(JSON.stringify(obj) === '{"a":1,"b":2}');

console.assert(structuredClone([...lm]));
console.assert(structuredClone({...lm}));
console.assert(structuredClone(new Map(lm)));

lm.f = function () {
  return this === lm;
};
console.assert(lm.f());

console.assert(LiteralMap.set(lm, 'a', 9) === lm);
console.assert(lm.a === 9);

console.assert(LiteralMap.size(lm) === lm.size);


console.assert(JSON.stringify({...new LiteralMap([[{}, 1]])}) === '{}');
