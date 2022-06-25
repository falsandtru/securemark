import { undefined, Array, Object } from 'spica/global';
import { hasOwnProperty, ObjectCreate } from 'spica/alias';
import { Parser, Result, Ctx, Context, eval, exec, Tree } from '../../data/parser';
import { Memo } from './context/memo';

export function reset<P extends Parser<unknown>>(base: Context<P>, parser: P): P;
export function reset<T>(base: Ctx, parser: Parser<T>): Parser<T> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return (source, context) =>
    apply(parser, source, ObjectCreate(context), changes, values);
}

export function context<P extends Parser<unknown>>(base: Context<P>, parser: P): P;
export function context<T>(base: Ctx, parser: Parser<T>): Parser<T> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return (source, context) =>
    apply(parser, source, context, changes, values);
}

function apply<P extends Parser<unknown>>(parser: P, source: string, context: Context<P>, changes: [string, any][], values: any[]): Result<Tree<P>>;
function apply<T>(parser: Parser<T>, source: string, context: Ctx, changes: [string, any][], values: any[]): Result<T> {
  if (context) for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'resources':
        assert(typeof change[1] === 'object');
        assert(context[prop] || !(prop in context));
        if (prop in context && !hasOwnProperty(context, prop)) break;
        // @ts-expect-error
        context[prop] = ObjectCreate(change[1]);
        break;
      default:
        values[i] = context[prop];
        context[prop] = change[1];
    }
  }
  const result = parser(source, context);
  if (context) for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'resources':
        break;
      default:
        context[prop] = values[i];
        values[i] = undefined;
    }
  }
  return result;
}

export function syntax<P extends Parser<unknown>>(syntax: number, precedence: number, parser: P): P;
export function syntax<P extends Parser<unknown>>(syntax: number, precedence: number, cost: number, parser: P): P;
export function syntax<T>(syntax: number, precedence: number, cost: number | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof cost === 'function') {
    parser = cost;
    cost = 1;
  }
  return (source, context) => {
    if (source === '') return;
    const r = context.rule ?? 0;
    context.rule = r | syntax;
    context.backtrackable ??= ~0;
    context.state ??= 0;
    const p = context.precedence;
    context.precedence = precedence;
    const { resources = { budget: 1, recursion: 1 } } = context;
    if (resources.budget <= 0) throw new Error('Too many creations');
    if (resources.recursion <= 0) throw new Error('Too much recursion');
    --resources.recursion;
    const pos = source.length;
    const cache = syntax && context.memo?.get(pos, context.rule, syntax, context.state);
    const result: Result<T> = cache
      ? [cache[0], source.slice(cache[1])]
      : parser!(source, context);
    ++resources.recursion;
    if (result) {
      if (!cache) {
        assert(cost = cost as number);
        resources.budget -= cost;
      }
      if (syntax) {
        if (r & context.backtrackable) {
          context.memo ??= new Memo();
          cache ?? context.memo.set(pos, context.rule, syntax, context.state, eval(result), source.length - exec(result).length);
          assert.deepStrictEqual(cache && cache, cache && context.memo.get(pos, context.rule, syntax, context.state));
        }
        else if (context.memo?.length! >= pos) {
          assert(!(r & context.backtrackable));
          context.memo!.clear(pos);
        }
      }
    }
    context.precedence = p;
    context.rule = r;
    return result;
  };
}

export function creator<P extends Parser<unknown>>(parser: P): P;
export function creator<P extends Parser<unknown>>(cost: number, parser: P): P;
export function creator(cost: number | Parser<unknown>, parser?: Parser<unknown>): Parser<unknown> {
  if (typeof cost === 'function') return creator(1, cost);
  assert(cost >= 0);
  return (source, context) => {
    const { resources = { budget: 1, recursion: 1 } } = context;
    if (resources.budget <= 0) throw new Error('Too many creations');
    if (resources.recursion <= 0) throw new Error('Too much recursion');
    --resources.recursion;
    const result = parser!(source, context);
    ++resources.recursion;
    if (result) {
      resources.budget -= cost;
    }
    return result;
  };
}

export function precedence<P extends Parser<unknown>>(precedence: number, parser: P): P;
export function precedence<T>(precedence: number, parser: Parser<T>): Parser<T> {
  return (source, context) => {
    const p = context.precedence;
    context.precedence = precedence;
    const result = parser(source, context);
    context.precedence = p;
    return result;
  };
}

export function guard<P extends Parser<unknown>>(f: (context: Context<P>) => boolean | number, parser: P): P;
export function guard<T>(f: (context: Ctx) => boolean | number, parser: Parser<T>): Parser<T> {
  return (source, context) =>
    f(context)
      ? parser(source, context)
      : undefined;
}

export function state<P extends Parser<unknown>>(state: number, parser: P): P;
export function state<P extends Parser<unknown>>(state: number, positive: boolean, parser: P): P;
export function state<T>(state: number, positive: boolean | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  return (source, context) => {
    const s = context.state ?? 0;
    context.state = positive
      ? s | state
      : s & ~state;
    const result = parser!(source, context);
    context.state = s;
    return result;
  };
}
