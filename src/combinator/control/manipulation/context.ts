import { WeakMap } from 'spica/global';
import { Parser, Ctx, Context } from '../../data/parser';
import { extend, template } from 'spica/assign';
import { type } from 'spica/type';
import { memoize } from 'spica/memoize';

export function guard<P extends Parser<object>>(f: (context: Context<P>) => boolean, parser: P): P;
export function guard<T extends object, D extends Parser<unknown, any>[]>(f: (context: Ctx) => boolean, parser: Parser<T, D>): Parser<T, D> {
  return (source, context) =>
    f(context)
      ? parser(source, context)
      : void 0;
}

export function configure<P extends Parser<object>>(context: Context<P>, parser: P): P;
export function configure<T extends object, D extends Parser<unknown, any, C>[], C extends Ctx>(context: C, parser: Parser<T, D, C>): Parser<T, D, C> {
  return (source, base) =>
    parser(source, extend(base, context));
}

export function update<P extends Parser<object>>(context: Context<P>, parser: P): P;
export function update<T extends object, D extends Parser<unknown, any, C>[], C extends Ctx>(context: C, parser: Parser<T, D, C>): Parser<T, D, C> {
  const extend = memoize<C, C>(base => merge<C>({}, base, context), new WeakMap());
  return (source, base) =>
    parser(source, extend(base));
}

const merge = template((prop, target, source) => {
  switch (prop) {
    case 'resource':
      return target[prop] = target[prop] || source[prop];
  }
  switch (type(source[prop])) {
    case 'Object':
      switch (type(target[prop])) {
        case 'Object':
          return target[prop] = merge(target[prop], source[prop]);
        default:
          return target[prop] = merge({}, source[prop]);
      }
    default:
      return target[prop] = source[prop];
  }
});
