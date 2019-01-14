export function memoize<a, b extends [unknown, ...unknown[]], c>(f: (a: a) => b, g: (b: b) => c): (a: a) => c {
  const mem = new Map<b[0], c>();
  return a => {
    const b = f(a)
    assert(b.length > 0);
    const k = b[0];
    return mem.has(k)
      ? mem.get(k)!
      : mem.set(k, g(b)).get(k)!;
  };
}
