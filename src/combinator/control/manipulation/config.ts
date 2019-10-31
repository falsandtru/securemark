import { Parser, Config } from '../../data/parser';
import { extend } from 'spica/assign';

const singleton = {};

export function override<P extends Parser<object, any, object>>(config: Config<P>, parser: P): P;
export function override<T extends object, S extends Parser<unknown, any, C>[], C extends object>(config: C, parser: Parser<T, S, C>): Parser<T, S, C> {
  const memory = new WeakMap<C, C>();
  return (source, base: C) => {
    base = !memory.has(base) && Object.keys(base).length === 0
      ? singleton as C
      : base;
    return parser(source, memory.get(base) || memory.set(base, extend<C>(extend({}, base), config)).get(base)!);
  };
}
