import { undefined, WeakMap } from 'spica/global';
import { hasOwnProperty, ObjectCreate } from 'spica/alias';
import { Parser, Ctx, Context } from '../../data/parser';
import { template } from 'spica/assign';
import { type } from 'spica/type';
import { memoize } from 'spica/memoize';

export function guard<P extends Parser<unknown>>(f: (context: Context<P>) => boolean, parser: P): P;
export function guard<T>(f: (context: Ctx) => boolean, parser: Parser<T>): Parser<T> {
  return (source, context) =>
    f(context)
      ? parser(source, context)
      : undefined;
}

export function reset<P extends Parser<unknown>>(context: Context<P>, parser: P): P;
export function reset<T>(base: Ctx, parser: Parser<T>): Parser<T> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  return (source, context) =>
    parser(source, inherit(ObjectCreate(context), base));
}

export function context<P extends Parser<unknown>>(context: Context<P>, parser: P): P;
export function context<T>(base: Ctx, parser: Parser<T>): Parser<T> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const override = memoize<Ctx, Ctx>(context => inherit(ObjectCreate(context), base), new WeakMap());
  return (source, context) =>
    parser(source, override(context));
}

const inherit = template((prop, target, source) => {
  assert(!Object.isSealed(target));
  assert(Object.isExtensible(target));
  //assert(Object.freeze(source));
  if (target[prop] === source[prop]) return;
  switch (prop) {
    case 'resources':
      assert(typeof source[prop] === 'object');
      assert(target[prop] || !(prop in target));
      if (prop in target && !hasOwnProperty(target, prop)) return;
      return target[prop] = ObjectCreate(source[prop]);
  }
  assert(!target.hasOwnProperty(prop));
  switch (type(source[prop])) {
    case 'Object':
      assert(Object.getPrototypeOf(source[prop]) === Object.prototype);
      //assert(Object.freeze(source[prop]));
      switch (type(target[prop])) {
        case 'Object':
          return target[prop] = inherit(ObjectCreate(target[prop]), source[prop]);
        default:
          return target[prop] = source[prop];
      }
    default:
      return target[prop] = source[prop];
  }
});
