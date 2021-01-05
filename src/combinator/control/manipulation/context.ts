import { undefined, WeakMap } from 'spica/global';
import { ObjectCreate, ObjectGetPrototypeOf } from 'spica/alias';
import { Parser, Ctx, Context } from '../../data/parser';
import { template } from 'spica/assign';
import { type, isPrimitive } from 'spica/type';
import { memoize } from 'spica/memoize';

export function guard<P extends Parser<unknown>>(f: (context: Context<P>) => boolean, parser: P): P;
export function guard<T extends unknown, D extends Parser<unknown>[]>(f: (context: Ctx) => boolean, parser: Parser<T, D>): Parser<T, D> {
  return (source, context) =>
    f(context)
      ? parser(source, context)
      : undefined;
}

export function update<P extends Parser<unknown>>(context: Context<P>, parser: P): P;
export function update<T extends unknown, D extends Parser<unknown>[]>(base: Ctx, parser: Parser<T, D>): Parser<T, D> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const clone = memoize<Ctx, Ctx>(context => ObjectCreate(context), new WeakMap());
  return (source, context) =>
    parser(source, inherit(clone(context), base));
}

export function context<P extends Parser<unknown>>(context: Context<P>, parser: P): P;
export function context<T extends unknown, D extends Parser<unknown>[]>(base: Ctx, parser: Parser<T, D>): Parser<T, D> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const inherit_ = memoize<Ctx, Ctx>(context => inherit(ObjectCreate(context), base), new WeakMap());
  return (source, context) =>
    parser(source, inherit_(context));
}

const inherit = template((prop, target, source) => {
  assert(!Object.isSealed(target));
  assert(Object.isExtensible(target));
  //assert(Object.freeze(source));
  switch (prop) {
    case 'resources':
      assert(typeof source[prop] === 'object');
      if (prop in (ObjectGetPrototypeOf(target) || {})) return;
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
          return target[prop] = ObjectCreate(source[prop]);
      }
    default:
      return target[prop] = isPrimitive(source[prop])
        ? source[prop]
        : ObjectCreate(source[prop]);
  }
});