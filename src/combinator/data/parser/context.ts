import { ObjectCreate, min } from 'spica/alias';
import { Parser, Result, Ctx, Tree, Context } from '../../data/parser';
import { clone } from 'spica/assign';

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
  if (reset) {
    context.logger = {};
  }
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
        context[prop as string] ??= clone({}, change[1] as object);
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
    }
    context[prop] = values[i];
    values[i] = undefined;
  }
  return result;
}

export function syntax<P extends Parser<unknown>>(precedence: number, state: number, parser: P): P;
export function syntax<T>(prec: number, state: number, parser: Parser<T>): Parser<T> {
  return precedence(prec, ({ source, context }) => {
    if (source === '') return;
    context.offset ??= 0;
    const stateOuter = context.state ?? 0;
    context.state = stateOuter | state;
    const result: Result<T> = parser({ source, context });
    context.state = stateOuter;
    return result;
  });
}

export function creation<P extends Parser<unknown>>(cost: number, recursion: number, parser: P): P;
export function creation(cost: number, recursion: number, parser: Parser<unknown>): Parser<unknown> {
  assert(cost >= 0);
  assert(recursion >= 0);
  return ({ source, context }) => {
    const resources = context.resources ?? { clock: cost || 1, recursions: [1] };
    const { recursions } = resources;
    assert(recursions.length > 0);
    const rec = min(recursion, recursions.length);
    if (rec > 0 && recursions[rec - 1] < 1) throw new Error('Too much recursion');
    rec > 0 && --recursions[rec - 1];
    const result = parser({ source, context });
    rec > 0 && ++recursions[rec - 1];
    if (result === undefined) return;
    if (resources.clock < cost) throw new Error('Too many creations');
    resources.clock -= cost;
    return result;
  };
}

export function precedence<P extends Parser<unknown>>(precedence: number, parser: P): P;
export function precedence<T>(precedence: number, parser: Parser<T>): Parser<T> {
  assert(precedence >= 0);
  return ({ source, context }) => {
    const { delimiters, precedence: p = 0 } = context;
    const shift = delimiters && precedence > p;
    context.precedence = precedence;
    // デリミタはシフト後に設定しなければならない
    shift && delimiters.shift(precedence);
    const result = parser({ source, context });
    shift && delimiters.unshift();
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
