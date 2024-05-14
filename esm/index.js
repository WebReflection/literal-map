const { get, getOwnPropertyDescriptor, ownKeys } = Reflect;

const getPropertyDescriptor = value => ({
  value,
  enumerable: true,
  writable: true,
  configurable: true
});

// String or Symbol
const sos = k => {
  switch (typeof k) {
    case 'string':
    case 'symbol':
      return true;
  }
  return false;
}

const _ = Symbol();
const prototype = 'prototype';

const handler = {
  deleteProperty: (map, k) => map.has(k) ? map.delete(k) : delete map[k],
  get(map, k, proxy) {
    if (k === _) return map;
    const own = map.has(k);
    if (!own && k === 'constructor') return constructor;
    const v = own ? map.get(k) : map[k];
    return typeof v === 'function' ? v.bind(own ? proxy : map) : v;
  },
  getOwnPropertyDescriptor: (map, k) => (
    map.has(k) ?
      getPropertyDescriptor(map.get(k)) :
      getOwnPropertyDescriptor(map, k)
  ),
  has: (map, k) => map.has(k) || k in map,
  ownKeys: map => [...map.keys(), ...ownKeys(map)].filter(sos),
  set: (map, k, v) => (map.set(k, v), true),
};

const constructor = new Proxy(
  class LiteralMap extends Map {
    constructor(...args) {
      /* c8 ignore start */
      return new Proxy(super(...args), handler);
      /* c8 ignore stop */
    }
  },
  {
    get: (Class, k, ...rest) => (
      k !== prototype && k in Class[prototype] ?
        (proxy, ...args) => {
          const map = proxy[_];
          let value = map[k];
          if (typeof value === 'function')
            value = value.apply(map, args);
          // prevent leaking the internal map elsewhere
          return value === map ? proxy : value;
        } :
        get(Class, k, ...rest)
    )
  }
);

export default constructor;
