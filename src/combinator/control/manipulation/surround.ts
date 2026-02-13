import { Parser, Input, Result, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, eval, exec, check } from '../../data/parser';
import { consume } from '../../../combinator';
import { unshift, push } from 'spica/array';

export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [S[], SubNode<P>[], S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], SubNode<P>[], string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [S[], SubNode<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], SubNode<P>[] | undefined, string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [S[], Node<P>[], S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], Node<P>[], string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [S[], Node<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [S[], Node<P>[] | undefined, string], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<N>(
  opener: string | RegExp | Parser<N>, parser: Parser<N>, closer: string | RegExp | Parser<N>,
  optional: boolean = false,
  f?: (rss: [N[], N[], N[]], rest: string, context: Ctx) => Result<N>,
  g?: (rss: [N[], N[], string], rest: string, context: Ctx) => Result<N>,
  backtracks: readonly number[] = [],
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
    if (getBacktrack(context, backtracks, sme_, sme_.length - me_.length)) return void revert(context, linebreak);
    const resultM = me_ !== '' ? parser({ source: me_, context }) : undefined;
    assert(check(me_, resultM));
    const nodesM = eval(resultM);
    const e_ = exec(resultM, me_);
    const resultE = nodesM || optional ? closer({ source: e_, context }) : undefined;
    assert(check(e_, resultE, false));
    const nodesE = eval(resultE);
    const rest = exec(resultE, e_);
    nodesE || setBacktrack(context, backtracks, sme_.length);
    if (!nodesM && !optional) return void revert(context, linebreak);
    if (rest.length === sme_.length) return void revert(context, linebreak);
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
export function open<P extends Parser<unknown>>(
  opener: string | RegExp | Parser<Node<P>, Context<P>>,
  parser: P,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function open<N>(
  opener: string | RegExp | Parser<N>,
  parser: Parser<N>,
  optional?: boolean,
  backtracks?: readonly number[],
): Parser<N> {
  return surround(opener, parser, '', optional, undefined, undefined, backtracks);
}
export function close<P extends Parser<unknown>>(
  parser: P,
  closer: string | RegExp | Parser<Node<P>, Context<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function close<N>(
  parser: Parser<N>,
  closer: string | RegExp | Parser<N>,
  optional?: boolean,
  backtracks?: readonly number[],
): Parser<N> {
  return surround('', parser, closer, optional, undefined, undefined, backtracks);
}

const statesize = 2;
export function getBacktrack(
  context: Ctx,
  backtracks: readonly number[],
  source: string,
  length: number = 1,
): boolean {
  if (length > 0) for (const backtrack of backtracks) {
    if (backtrack & 1) {
      const { backtracks = {}, offset = 0 } = context;
      for (let i = 0; i < length; ++i) {
        if (source[i] !== source[0]) break;
        const pos = source.length - i + offset - 1;
        assert(pos >= 0);
        if (!(pos in backtracks)) continue;
        if (backtracks[pos] & 1 << size(backtrack >>> statesize)) return true;
      }
    }
  }
  return false;
}
export function setBacktrack(
  context: Ctx,
  backtracks: readonly number[],
  position: number,
  length: number = 1,
): void {
  if (length > 0) for (const backtrack of backtracks) {
    if (backtrack & 2) {
      const { backtracks = {}, offset = 0 } = context;
      for (let i = 0; i < length; ++i) {
        const pos = position - i + offset - 1;
        assert(pos >= 0);
        backtracks[pos] |= 1 << size(backtrack >>> statesize);
      }
    }
  }
}

function match(pattern: string | RegExp): (input: Input) => [never[], string] | undefined {
  switch (typeof pattern) {
    case 'string':
      return ({ source }) => source.slice(0, pattern.length) === pattern ? [[], source.slice(pattern.length)] : undefined;
    case 'object':
      return ({ source, context }) => {
        const m = source.match(pattern);
        if (m === null) return;
        consume(m[0].length, context);
        return [[], source.slice(m[0].length)];
      };
  }
}
function revert(context: Ctx, linebreak: number | undefined): void {
  context.linebreak = linebreak;
}
function size(bits: number): number {
  if (bits === 0) return 0;
  let p = 0;
  for (let s = 32 / 2; s > 0; s >>>= 1) {
    const q = p + s;
    if (bits >>> q === 0) continue;
    p = q;
  }
  return p + 1;
}
assert(size(0 << 0) === 0);
assert(size(1 << 0) === 1);
assert(size(1 << 1) === 2);
assert(size(1 << 30) === 31);
assert(size(1 << 31) === 32);
