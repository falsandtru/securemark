import { Parser, Result, List, Node, Context, Options } from '../../data/parser';
import { min } from 'spica/alias';
import { clone } from 'spica/assign';

export function reset<P extends Parser>(base: Options, parser: P): P;
export function reset<N>(base: Context, parser: Parser<N>): Parser<N> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return ({ context }) =>
    // 大域離脱時の汚染回避のため複製
    apply(parser, { ...context }, changes, values, true);
}

export function context<P extends Parser>(base: Options, parser: P): P;
export function context<N>(base: Context, parser: Parser<N>): Parser<N> {
  assert(Object.getPrototypeOf(base) === Object.prototype);
  assert(Object.freeze(base));
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return ({ context }) =>
    apply(parser, context, changes, values);
}

function apply<P extends Parser>(parser: P, context: Parser.Context<P>, changes: readonly [string, unknown][], values: unknown[], reset?: boolean): Result<Parser.Node<P>>;
function apply<N>(parser: Parser<N>, context: Context, changes: readonly [string, unknown][], values: unknown[], reset = false): Result<N> {
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

export function creation<P extends Parser>(cost: number, parser: P): P;
export function creation(cost: number, parser: Parser): Parser {
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
export function consume(cost: number, context: Context): void {
  const { resources } = context;
  if (!resources) return;
  if (resources.clock < cost) throw new Error('Too many creations');
  resources.clock -= cost;
}

export function recursion<P extends Parser>(recursion: number, parser: P): P;
export function recursion(recursion: number, parser: Parser): Parser {
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

export function precedence<P extends Parser>(precedence: number, parser: P): P;
export function precedence<N>(precedence: number, parser: Parser<N>): Parser<N> {
  assert(precedence >= 0);
  return input => {
    const { context } = input;
    const { delimiters, precedence: p } = context;
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

export function state<P extends Parser>(state: number, parser: P): P;
export function state<P extends Parser>(state: number, positive: boolean, parser: P): P;
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

export function constraint<P extends Parser>(state: number, parser: P): P;
//export function constraint<P extends Parser>(state: number, positive: boolean, parser: P): P;
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
      ? state & context.state
      : state & ~context.state;
    return s === state
      ? parser(input)
      : undefined;
  };
}

export function matcher(pattern: string | RegExp, advance: boolean, after?: Parser<string>): Parser<string> {
  assert(pattern instanceof RegExp ? !pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^') : true);
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]/.test(pattern.source)
    : false;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new List([new Node(pattern)]);
      return input => {
        const { context } = input;
        const { source, position } = context;
        if (!source.startsWith(pattern, position)) return;
        if (advance) {
          context.position += pattern.length;
        }
        const next = after?.(input);
        return after
          ? next && new List([new Node(pattern)]).import(next)
          : new List([new Node(pattern)]);
      };
    case 'object':
      assert(pattern.sticky);
      return input => {
        const { context } = input;
        const { source, position } = context;
        pattern.lastIndex = position;
        if (!pattern.test(source)) return;
        const src = source.slice(position, pattern.lastIndex);
        count && consume(src.length, context);
        if (advance) {
          context.position += src.length;
        }
        const next = after?.(input);
        return after
          ? next && new List([new Node(src)]).import(next)
          : new List([new Node(src)]);
      };
  }
}

export function tester(pattern: string | RegExp, advance: boolean, after?: Parser<unknown>): Parser<never> {
  assert(pattern instanceof RegExp ? !pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^') : true);
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]/.test(pattern.source)
    : false;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new List();
      return input => {
        const { context } = input;
        const { source, position } = context;
        if (!source.startsWith(pattern, position)) return;
        if (advance) {
          context.position += pattern.length;
        }
        if (after && after(input) === undefined) return;
        return new List();
      };
    case 'object':
      assert(pattern.sticky);
      return input => {
        const { context } = input;
        const { source, position } = context;
        pattern.lastIndex = position;
        if (!pattern.test(source)) return;
        const len = pattern.lastIndex - position;
        count && consume(len, context);
        if (advance) {
          context.position += len;
        }
        if (after && after(input) === undefined) return;
        return new List();
      };
  }
}
