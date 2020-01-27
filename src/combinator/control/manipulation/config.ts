import { Parser, Config } from '../../data/parser';
import { extend } from 'spica/assign';

const { Object: Obj, WeakMap } = global;

export function guard<P extends Parser<object>>(f: (config: Config<P>) => boolean, parser: P): P;
export function guard<T extends object, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(f: (config: C) => boolean, parser: Parser<T, D, S, C>): Parser<T, D, S, C> {
  return (source, config) =>
    f(config)
      ? parser(source, config)
      : void 0;
}

const singleton = Obj.freeze({});

export function configure<P extends Parser<object>>(config: Config<P>, parser: P): P;
export function configure<T extends object, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(config: C, parser: Parser<T, D, S, C>): Parser<T, D, S, C> {
  const memory = new WeakMap<C, C>();
  return (source, base) => {
    base = !memory.has(base) && Obj.keys(base).length === 0
      ? singleton as C
      : base;
    return parser(source, memory.get(base) || memory.set(base, extend<C>({}, base, config)).get(base)!);
  };
}
