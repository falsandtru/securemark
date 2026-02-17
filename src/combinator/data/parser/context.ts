import { min } from 'spica/alias';
import { Parser, Result, Ctx, CtxOptions, Node, Context } from '../../data/parser';
import { clone } from 'spica/assign';

export function reset<P extends Parser<unknown>>(base: CtxOptions, parser: P): P;
export function reset<N>(base: Ctx, parser: Parser<N>): Parser<N> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return ({ context }) =>
    apply(parser, context, changes, values, true);
}

export function context<P extends Parser<unknown>>(base: CtxOptions, parser: P): P;
export function context<N>(base: Ctx, parser: Parser<N>): Parser<N> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return ({ context }) =>
    apply(parser, context, changes, values);
}

function apply<P extends Parser<unknown>>(parser: P, context: Context<P>, changes: readonly [string, unknown][], values: unknown[], reset?: boolean): Result<Node<P>>;
function apply<N>(parser: Parser<N>, context: Ctx, changes: readonly [string, unknown][], values: unknown[], reset = false): Result<N> {
  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'source':
      case 'position':
        continue;
      case 'resources':
        assert(reset);
        assert(!context.offset);
        assert(!context.precedence);
        assert(!context.delimiters);
        assert(!context.state);
        values[i] = context[prop];
        context[prop as string] ??= clone({}, change[1] as object);
        continue;
      case 'backtracks':
        change[1] = {};
    }
    values[i] = context[prop];
    context[prop] = change[1];
  }
  const result = parser({ context });
  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'source':
      case 'position':
        continue;
      case 'resources':
        assert(reset);
    }
    context[prop] = values[i];
    values[i] = undefined;
  }
  return result;
}

export function creation<P extends Parser<unknown>>(cost: number, parser: P): P;
export function creation(cost: number, parser: Parser<unknown>): Parser<unknown> {
  assert(cost >= 0);
  return input => {
    const { context } = input;
    const resources = context.resources ?? { clock: cost || 1, recursions: [1] };
    const { recursions } = resources;
    assert(recursions.length > 0);
    const result = parser(input);
    if (result === undefined) return;
    consume(cost, context);
    return result;
  };
}
export function consume(cost: number, context: Ctx): void {
  const { resources } = context;
  if (!resources) return;
  if (resources.clock < cost) throw new Error('Too many creations');
  resources.clock -= cost;
}

export function recursion<P extends Parser<unknown>>(recursion: number, parser: P): P;
export function recursion(recursion: number, parser: Parser<unknown>): Parser<unknown> {
  assert(recursion >= 0);
  return input => {
    const { context } = input;
    const resources = context.resources ?? { clock: 1, recursions: [1] };
    const { recursions } = resources;
    assert(recursions.length > 0);
    const rec = min(recursion, recursions.length);
    if (rec > 0 && recursions[rec - 1] < 1) throw new Error('Too much recursion');
    rec > 0 && --recursions[rec - 1];
    const result = parser(input);
    rec > 0 && ++recursions[rec - 1];
    return result;
  };
}

export function precedence<P extends Parser<unknown>>(precedence: number, parser: P): P;
export function precedence<N>(precedence: number, parser: Parser<N>): Parser<N> {
  assert(precedence >= 0);
  return input => {
    const { context } = input;
    const { delimiters, precedence: p = 0 } = context;
    const shift = delimiters && precedence > p;
    context.precedence = precedence;
    // デリミタはシフト後に設定しなければならない
    shift && delimiters.shift(precedence);
    const result = parser(input);
    shift && delimiters.unshift();
    context.precedence = p;
    return result;
  };
}

export function state<P extends Parser<unknown>>(state: number, parser: P): P;
export function state<P extends Parser<unknown>>(state: number, positive: boolean, parser: P): P;
export function state<N>(state: number, positive: boolean | Parser<N>, parser?: Parser<N>): Parser<N> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  assert(state);
  assert(parser = parser!);
  return input => {
    const { context } = input;
    const s = context.state ?? 0;
    context.state = positive
      ? s | state
      : s & ~state;
    const result = parser(input);
    context.state = s;
    return result;
  };
}

export function constraint<P extends Parser<unknown>>(state: number, parser: P): P;
//export function constraint<P extends Parser<unknown>>(state: number, positive: boolean, parser: P): P;
export function constraint<N>(state: number, positive: boolean | Parser<N>, parser?: Parser<N>): Parser<N> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = false;
  }
  assert(state);
  assert(parser = parser!);
  return input => {
    const { context } = input;
    const s = positive
      ? state & context.state!
      : state & ~context.state!;
    return s === state
      ? parser(input)
      : undefined;
  };
}
