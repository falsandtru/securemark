import { Parser, Input, Result, Ctx, Tree, Context, SubParsers, SubTree, IntermediateParser, eval, exec, check } from '../../data/parser';
import { fmap } from '../monad/fmap';
import { unshift, push } from 'spica/array';

export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [S[], SubTree<P>[], S[]], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], SubTree<P>[], string], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  bstate?: number,
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [S[], SubTree<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], SubTree<P>[] | undefined, string], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  bstate?: number,
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [S[], Tree<P>[], S[]], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], Tree<P>[], string], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  bstate?: number,
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [S[], Tree<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], Tree<P>[] | undefined, string], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  bstate?: number,
): P;
export function surround<T>(
  opener: string | RegExp | Parser<T>, parser: Parser<T>, closer: string | RegExp | Parser<T>,
  optional: boolean = false,
  f?: (rss: [T[], T[], T[]], rest: string, context: Ctx) => Result<T>,
  g?: (rss: [T[], T[], string], rest: string, context: Ctx) => Result<T>,
  backtracks: readonly number[] = [],
  bstate: number = 0,
): Parser<T> {
  switch (typeof opener) {
    case 'string':
    case 'object':
      opener = match(opener);
  }
  switch (typeof closer) {
    case 'string':
    case 'object':
      closer = match(closer);
  }
  const statesize = 2;
  return ({ source, context }) => {
    const lmr_ = source;
    if (lmr_ === '') return;
    const { linebreak } = context;
    context.linebreak = undefined;
    const res1 = opener({ source: lmr_, context });
    assert(check(lmr_, res1, false));
    if (res1 === undefined) return void revert(context, linebreak);
    const rl = eval(res1);
    const mr_ = exec(res1);
    for (const backtrack of backtracks) {
      if (backtrack & 1) {
        const { backtracks = {}, backtrack: state = 0, offset = 0 } = context;
        for (let i = 0; i < source.length - mr_.length; ++i) {
          if (source[i] !== source[0]) break;
          const pos = source.length + offset - i - 1;
          if (!(pos in backtracks)) continue;
          const shift = backtrack >>> statesize & state >>> statesize ? state & (1 << statesize) - 1 : 0;
          if (backtracks[pos] & 1 << size(backtrack >>> statesize) + shift) return void revert(context, linebreak);
        }
      }
    }
    const { backtrack: state = 0 } = context;
    context.backtrack = state | bstate;
    const res2 = mr_ !== '' ? parser({ source: mr_, context }) : undefined;
    assert(check(mr_, res2));
    context.backtrack = state;
    const rm = eval(res2);
    const r_ = exec(res2, mr_);
    if (!rm && !optional) return void revert(context, linebreak);
    const res3 = closer({ source: r_, context });
    assert(check(r_, res3, false));
    const rr = eval(res3);
    const rest = exec(res3, r_);
    if (rest.length === lmr_.length) return void revert(context, linebreak);
    for (const backtrack of backtracks) {
      if (backtrack & 2 && rr === undefined) {
        const { backtracks = {}, backtrack: state = 0, offset = 0 } = context;
        const shift = backtrack >>> statesize & state >>> statesize ? state & (1 << statesize) - 1 : 0;
        backtracks[source.length + offset - 1] |= 1 << size(backtrack >>> statesize) + shift;
      }
    }
    context.recent = [
      lmr_.slice(0, lmr_.length - mr_.length),
      mr_.slice(0, mr_.length - r_.length),
      r_.slice(0, r_.length - rest.length),
    ];
    const result = rr
      ? f
        ? f([rl, rm!, rr], rest, context)
        : [push(unshift(rl, rm ?? []), rr), rest] satisfies [T[], string]
      : g
        ? g([rl, rm!, mr_], rest, context)
        : undefined;
    if (result) {
      context.linebreak ??= linebreak;
    }
    else {
      revert(context, linebreak);
    }
    return result;
  };
}

function match(pattern: string | RegExp): (input: Input) => [never[], string] | undefined {
  switch (typeof pattern) {
    case 'string':
      return ({ source }) => source.slice(0, pattern.length) === pattern ? [[], source.slice(pattern.length)] : undefined;
    case 'object':
      return ({ source }) => {
        const m = source.match(pattern);
        return m
          ? [[], source.slice(m[0].length)]
          : undefined;
      };
  }
}
function size(bits: number): number {
  if (bits === 0) return 0;
  let p = 0;
  for (let s = 32 / 2; s > 0; s >>>= 1) {
    if (bits >>> p + s === 0) continue;
    p += s;
  }
  return p + 1;
}
assert(size(0 << 0) === 0);
assert(size(1 << 0) === 1);
assert(size(1 << 1) === 2);
assert(size(1 << 30) === 31);
assert(size(1 << 31) === 32);
function revert(context: Ctx, linebreak: number | undefined): void {
  context.linebreak = linebreak;
}

export function open<P extends Parser<unknown>>(opener: string | RegExp | Parser<Tree<P>, Context<P>>, parser: P, optional?: boolean): P;
export function open<T>(opener: string | RegExp | Parser<T>, parser: Parser<T>, optional = false): Parser<T> {
  return surround(opener, parser, '', optional);
}
export function close<P extends Parser<unknown>>(parser: P, closer: string | RegExp | Parser<Tree<P>, Context<P>>, optional?: boolean): P;
export function close<T>(parser: Parser<T>, closer: string | RegExp | Parser<T>, optional: boolean = false): Parser<T> {
  return surround('', parser, closer, optional);
}

export function clear<D extends Parser<unknown, C>[], C extends Ctx>(parser: Parser<unknown, C, D>): Parser<never, C, D> {
  return fmap<never, Parser<unknown, C, D>>(parser, () => []);
}
