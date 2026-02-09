import { Parser, Input, Result, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, eval, exec, check } from '../../data/parser';
import { fmap } from '../monad/fmap';
import { unshift, push } from 'spica/array';

export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [S[], SubNode<P>[], S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], SubNode<P>[], string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  backtrackstate?: number,
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [S[], SubNode<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], SubNode<P>[] | undefined, string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  backtrackstate?: number,
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [S[], Node<P>[], S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], Node<P>[], string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  backtrackstate?: number,
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [S[], Node<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], Node<P>[] | undefined, string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
  backtrackstate?: number,
): P;
export function surround<N>(
  opener: string | RegExp | Parser<N>, parser: Parser<N>, closer: string | RegExp | Parser<N>,
  optional: boolean = false,
  f?: (rss: [N[], N[], N[]], rest: string, context: Ctx) => Result<N>,
  g?: (rss: [N[], N[], string], rest: string, context: Ctx) => Result<N>,
  backtracks: readonly number[] = [],
  backtrackstate: number = 0,
): Parser<N> {
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
    const sme_ = source;
    if (sme_ === '') return;
    const { linebreak } = context;
    context.linebreak = undefined;
    const resultS = opener({ source: sme_, context });
    assert(check(sme_, resultS, false));
    if (resultS === undefined) return void revert(context, linebreak);
    const nodesS = eval(resultS);
    const me_ = exec(resultS);
    for (const backtrack of backtracks) {
      if (backtrack & 1) {
        const { backtracks = {}, backtrack: state = 0, offset = 0 } = context;
        for (let i = 0; i < source.length - me_.length; ++i) {
          if (source[i] !== source[0]) break;
          const pos = source.length - i + offset - 1;
          assert(pos >= 0);
          if (!(pos in backtracks)) continue;
          const shift = backtrack >>> statesize & state >>> statesize ? state & (1 << statesize) - 1 : 0;
          if (backtracks[pos] & 1 << size(backtrack >>> statesize) + shift) return void revert(context, linebreak);
        }
      }
    }
    const { backtrack = 0 } = context;
    context.backtrack = backtrack | backtrackstate;
    const resultM = me_ !== '' ? parser({ source: me_, context }) : undefined;
    assert(check(me_, resultM));
    context.backtrack = backtrack;
    const nodesM = eval(resultM);
    const e_ = exec(resultM, me_);
    if (!nodesM && !optional) return void revert(context, linebreak);
    const resultE = closer({ source: e_, context });
    assert(check(e_, resultE, false));
    const nodesE = eval(resultE);
    const rest = exec(resultE, e_);
    if (rest.length === sme_.length) return void revert(context, linebreak);
    for (const backtrack of backtracks) {
      if (backtrack & 2 && nodesE === undefined) {
        const { backtracks = {}, backtrack: state = 0, offset = 0 } = context;
        const pos = source.length + offset - 1;
        assert(pos >= 0);
        const shift = backtrack >>> statesize & state >>> statesize ? state & (1 << statesize) - 1 : 0;
        backtracks[pos] |= 1 << size(backtrack >>> statesize) + shift;
      }
    }
    context.recent = [
      sme_.slice(0, sme_.length - me_.length),
      me_.slice(0, me_.length - e_.length),
      e_.slice(0, e_.length - rest.length),
    ];
    const result = nodesE
      ? f
        ? f([nodesS, nodesM!, nodesE], rest, context)
        : [push(unshift(nodesS, nodesM ?? []), nodesE), rest] satisfies [N[], string]
      : g
        ? g([nodesS, nodesM!, me_], rest, context)
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

export function open<P extends Parser<unknown>>(opener: string | RegExp | Parser<Node<P>, Context<P>>, parser: P, optional?: boolean): P;
export function open<N>(opener: string | RegExp | Parser<N>, parser: Parser<N>, optional = false): Parser<N> {
  return surround(opener, parser, '', optional);
}
export function close<P extends Parser<unknown>>(parser: P, closer: string | RegExp | Parser<Node<P>, Context<P>>, optional?: boolean): P;
export function close<N>(parser: Parser<N>, closer: string | RegExp | Parser<N>, optional: boolean = false): Parser<N> {
  return surround('', parser, closer, optional);
}

export function clear<D extends Parser<unknown, C>[], C extends Ctx>(parser: Parser<unknown, C, D>): Parser<never, C, D> {
  return fmap<never, Parser<unknown, C, D>>(parser, () => []);
}
