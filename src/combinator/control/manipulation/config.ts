import { Parser, Config } from '../../data/parser';

const singleton = {};
const keys: WeakMap<object, string[]> = new WeakMap();

export function override<P extends Parser<object, any, object>>(config: Config<P>, parser: P): P {
  const memory: WeakMap<typeof config, typeof config> = new WeakMap();
  return ((source, base: typeof config) => {
    base = !memory.has(base) && Object.keys(base).length === 0
      ? singleton as typeof config
      : base;
    return parser(source, memory.get(base) || memory.set(base, extend(extend({}, base), config)).get(base)!);
  }) as P;
}

function extend<T extends object>(target: object, source: T): T {
  for (const key of keys.get(source) || keys.set(source, Object.keys(source)).get(source)!) {
    switch (typeof (source[key] ?? undefined)) {
      case 'object':
        switch (typeof (target[key] ?? undefined)) {
          case 'object':
            target[key] = extend(target[key], source[key]);
            break;
          default:
            target[key] = extend({}, source[key]);
        }
        continue;
    }
    target[key] = source[key];
  }
  return target as T;
}
