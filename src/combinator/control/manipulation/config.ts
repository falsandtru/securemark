import { WeakMap } from 'spica/global';
import { ObjectCreate } from 'spica/alias';
import { Parser, Config } from '../../data/parser';
import { template } from 'spica/assign';
import { concat } from 'spica/concat';
import { type } from 'spica/type';
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
  const ex = memoize<C, C>(base => merge({}, base, config), new WeakMap());
  return (source, base) =>
    parser(source, ex(base));
}

const merge = template((prop, target, source) => {
  switch (type(source[prop])) {
    case 'Array':
      switch (type(target[prop])) {
        case 'Array':
          return target[prop] = concat(target[prop].slice(), source[prop]);
        default:
          return target[prop] = merge([], source[prop]);
      }
    case 'Object':
      switch (type(target[prop])) {
        case 'Object':
          return target[prop] = merge(target[prop], source[prop]);
        default:
          return target[prop] = merge(source[prop] instanceof Object ? {} : ObjectCreate(null), source[prop]);
      }
    default:
      return target[prop] = source[prop];
  }
});
