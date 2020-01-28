import { WeakMap } from 'spica/global';
import { Parser, Config } from '../../data/parser';
import { extend } from 'spica/assign';
import { memoize } from 'spica/memoize';

export function guard<P extends Parser<object>>(f: (config: Config<P>) => boolean, parser: P): P;
export function guard<T extends object, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(f: (config: C) => boolean, parser: Parser<T, D, S, C>): Parser<T, D, S, C> {
  return (source, config) =>
    f(config)
      ? parser(source, config)
      : void 0;
}

export function configure<P extends Parser<object>>(config: Partial<Config<P>>, parser: P): P;
export function configure<T extends object, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(config: C, parser: Parser<T, D, S, C>): Parser<T, D, S, C> {
  const ex = memoize<C, C>(base => extend({}, base, config), new WeakMap());
  return (source, base) =>
    parser(source, ex(base));
}
