const { getOwnPropertyDescriptor, ownKeys } = Reflect;

const getPropertyDescriptor = value => ({
  value,
  enumerable: true,
  writable: true,
  configurable: true
});

const handler = {
  deleteProperty: (map, k) => map.has(k) ? map.delete(k) : delete map[k],
  get(map, k, proxy) {
    const own = map.has(k);
    const v = own ? map.get(k) : map[k];
    return typeof v === 'function' ? v.bind(own ? proxy : map) : v;
  },
  getOwnPropertyDescriptor(map, k) {
    if (map.has(k)) return getPropertyDescriptor(map.get(k));
    if (k in map) return getOwnPropertyDescriptor(map, k);
  },
  has: (map, k) => map.has(k) || k in map,
  ownKeys: map => [...map.keys(), ...ownKeys(map)],
  set: (map, k, v) => (map.set(k, v), true),
};

export default class LiteralMap extends Map {
  constructor(...args) {
    /* c8 ignore start */
    return new Proxy(super(...args), handler);
    /* c8 ignore stop */
  }
}
