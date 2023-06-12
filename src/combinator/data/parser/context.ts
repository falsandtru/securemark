import { ObjectCreate } from 'spica/alias';
import { Parser, Result, Ctx, Tree, Context, eval, exec } from '../../data/parser';
import { Memo } from './context/memo';

export function reset<P extends Parser<unknown>>(base: Context<P>, parser: P): P;
export function reset<T>(base: Ctx, parser: Parser<T>): Parser<T> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return ({ source, context }) =>
    apply(parser, source, ObjectCreate(context), changes, values, true);
}

export function context<P extends Parser<unknown>>(base: Context<P>, parser: P): P;
export function context<T>(base: Ctx, parser: Parser<T>): Parser<T> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return ({ source, context }) =>
    apply(parser, source, context, changes, values);
}

function apply<P extends Parser<unknown>>(parser: P, source: string, context: Context<P>, changes: readonly [string, unknown][], values: unknown[], reset?: boolean): Result<Tree<P>>;
function apply<T>(parser: Parser<T>, source: string, context: Ctx, changes: readonly [string, unknown][], values: unknown[], reset = false): Result<T> {
  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'resources':
        assert(reset);
        assert(!context.offset);
        assert(!context.precedence);
        assert(!context.delimiters);
        assert(!context.state);
        assert(!context.memo);
        context[prop as string] ??= ObjectCreate(change[1] as object);
        continue;
    }
    values[i] = context[prop];
    context[prop] = change[1];
  }
  const result = parser({ source, context });
  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'resources':
        assert(reset);
        break;
      case 'memo':
        assert(reset);
        context.memo!.clear();
        break;
    }
    context[prop] = values[i];
    values[i] = undefined;
  }
  return result;
}

export function syntax<P extends Parser<unknown>>(syntax: number, precedence: number, state: number, parser: P): P;
export function syntax<T>(syntax: number, prec: number, state: number, parser?: Parser<T>): Parser<T> {
  return precedence(prec, ({ source, context }) => {
    if (source === '') return;
    const memo = context.memo ??= new Memo();
    context.offset ??= 0;
    const position = source.length + context.offset!;
    const stateOuter = context.state ?? 0;
    const stateInner = context.state = stateOuter | state;
    const cache = syntax & memo.targets && stateInner && memo.get(position, syntax, stateInner);
    const result: Result<T> = cache
      ? cache.length === 0
        ? undefined
        : [cache[0], source.slice(cache[1])]
      : parser!({ source, context });
    if (stateOuter && !cache && syntax & memo.targets) {
      memo.set(position, syntax, stateInner, eval(result), source.length - exec(result, '').length);
    }
    else if (!stateOuter && result && memo.length! >= position + memo.margin) {
      memo.resize(position + memo.margin);
    }
    context.state = stateOuter;
    return result;
  });
}

export function creation<P extends Parser<unknown>>(parser: P): P;
export function creation<P extends Parser<unknown>>(cost: number, parser: P): P;
export function creation<P extends Parser<unknown>>(cost: number, recursion: boolean, parser: P): P;
export function creation(cost: number | Parser<unknown>, recursion?: boolean | Parser<unknown>, parser?: Parser<unknown>): Parser<unknown> {
  if (typeof cost === 'function') return creation(1, true, cost);
  if (typeof recursion === 'function') return creation(cost, true, recursion);
  assert(cost >= 0);
  assert(recursion !== undefined);
  return ({ source, context }) => {
    assert([recursion = recursion!]);
    const resources = context.resources ?? { clock: cost || 1, recursion: 1 };
    if (resources.clock <= 0) throw new Error('Too many creations');
    if (resources.recursion < +recursion) throw new Error('Too much recursion');
    recursion && --resources.recursion;
    const result = parser!({ source, context });
    recursion && ++resources.recursion;
    if (result) {
      resources.clock -= cost;
    }
    return result;
  };
}

export function precedence<P extends Parser<unknown>>(precedence: number, parser: P): P;
export function precedence<T>(precedence: number, parser: Parser<T>): Parser<T> {
  assert(precedence > 0);
  return ({ source, context }) => {
    const p = context.precedence;
    context.precedence = precedence;
    const result = parser({ source, context });
    context.precedence = p;
    return result;
  };
}

export function guard<P extends Parser<unknown>>(f: (context: Context<P>) => boolean | number, parser: P): P;
export function guard<T>(f: (context: Ctx) => boolean | number, parser: Parser<T>): Parser<T> {
  return ({ source, context }) =>
    f(context)
      ? parser({ source, context })
      : undefined;
}

export function constraint<P extends Parser<unknown>>(state: number, parser: P): P;
export function constraint<P extends Parser<unknown>>(state: number, positive: boolean, parser: P): P;
export function constraint<T>(state: number, positive: boolean | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  assert(state);
  return ({ source, context }) => {
    const s = positive
      ? state & context.state!
      : state & ~context.state!;
    return s === state
      ? parser!({ source, context })
      : undefined;
  };
}

export function state<P extends Parser<unknown>>(state: number, parser: P): P;
export function state<P extends Parser<unknown>>(state: number, positive: boolean, parser: P): P;
export function state<T>(state: number, positive: boolean | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  assert(state);
  return ({ source, context }) => {
    const s = context.state ?? 0;
    context.state = positive
      ? s | state
      : s & ~state;
    const result = parser!({ source, context });
    context.state = s;
    return result;
  };
}

//export function log<P extends Parser<unknown>>(log: number, parser: P, cond?: (ns: readonly Tree<P>[]) => boolean): P;
//export function log<T>(log: number, parser: Parser<T>, cond: (ns: readonly T[]) => boolean = () => true): Parser<T> {
//  assert(log);
//  return ({ source, context }) => {
//    const l = context.log ?? 0;
//    context.log = 0;
//    const result = parser!({ source, context });
//    context.log = result && cond(eval(result))
//      ? l | log
//      : l;
//    return result;
//  };
//}
