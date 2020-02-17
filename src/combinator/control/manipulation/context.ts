import { WeakMap } from 'spica/global';
import { Parser, Ctx, Context } from '../../data/parser';
import { template } from 'spica/assign';
import { type } from 'spica/type';
import { memoize } from 'spica/memoize';
import { push } from 'spica/array';

export function guard<P extends Parser<object>>(f: (context: Context<P>) => boolean, parser: P): P;
export function guard<T extends object, D extends Parser<unknown, any>[]>(f: (context: Ctx) => boolean, parser: Parser<T, D>): Parser<T, D> {
  return (source, context) =>
    f(context)
      ? parser(source, context)
      : void 0;
}

export function update<P extends Parser<object>>(context: Context<P>, parser: P): P;
export function update<T extends object, D extends Parser<unknown, any, C>[], C extends Ctx>(context: C, parser: Parser<T, D, C>): Parser<T, D, C> {
  const extend = memoize<C, C>(base => extend_<C>({}, base, context), new WeakMap());
  return (source, base) =>
    context.resource
      ? parser(source, extend_<C>({}, base, context))
      : parser(source, extend(base));
}

const extend_ = template((prop, target, source) => {
  switch (prop) {
    case 'resource':
      return target[prop] = target[prop] || source[prop];
  }
  switch (type(source[prop])) {
    case 'Array':
      switch (type(target[prop])) {
        case 'Array':
          return target[prop] = push(target[prop].slice(), source[prop]);
        default:
          return target[prop] = extend_([], source[prop]);
      }
    case 'Object':
      switch (type(target[prop])) {
        case 'Object':
          return target[prop] = extend_(target[prop], source[prop]);
        default:
          return target[prop] = extend_({}, source[prop]);
      }
    case 'number':
      switch (type(target[prop])) {
        case 'number':
          return target[prop] = target[prop] + source[prop];
        default:
          return target[prop] = source[prop];
      }
    default:
      return target[prop] = source[prop];
  }
});
