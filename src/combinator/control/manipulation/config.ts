import { Parser, Config } from '../../data/parser';
import { extend } from 'spica/assign';

export function check<P extends Parser<object, any>>(f: (config: Config<P>) => boolean, parser: P): P;
export function check<T extends object, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(f: (config: C) => boolean, parser: Parser<T, D, C, S>): Parser<T, D, C, S> {
  return (source, config) =>
    f(config)
      ? parser(source, config)
      : undefined;
}

const singleton = {};

export function configure<P extends Parser<object, any>>(config: Config<P>, parser: P): P;
export function configure<T extends object, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(config: C, parser: Parser<T, D, C, S>): Parser<T, D, C, S> {
  const memory = new WeakMap<C, C>();
  return (source, base: C) => {
    base = !memory.has(base) && Object.keys(base).length === 0
      ? singleton as C
      : base;
    return parser(source, memory.get(base) || memory.set(base, extend<C>(extend({}, base), config)).get(base)!);
  };
}
