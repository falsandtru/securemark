import { Parser, Result, List, Data, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, eval, failsafe } from '../../data/parser';
import { matcher, clear } from '../../../combinator';

export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [List<Data<S>>, List<Data<SubNode<P>>>, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<SubNode<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [List<Data<S>>, List<Data<SubNode<P>>> | undefined, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<SubNode<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  f?: (rss: [List<Data<S>>, List<Data<Node<P>>>, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<P extends Parser<unknown>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  f?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  backtracks?: readonly number[],
): P;
export function surround<N>(
  opener: string | RegExp | Parser<N>, parser: Parser<N>, closer: string | RegExp | Parser<N>,
  optional: boolean = false,
  f?: (rss: [List<Data<N>>, List<Data<N>>, List<Data<N>>], context: Ctx) => Result<N>,
  g?: (rss: [List<Data<N>>, List<Data<N>> | undefined], context: Ctx) => Result<N>,
  backtracks: readonly number[] = [],
): Parser<N> {
  switch (typeof opener) {
    case 'string':
    case 'object':
      opener = clear(matcher(opener, true));
  }
  switch (typeof closer) {
    case 'string':
    case 'object':
      closer = clear(matcher(closer, true));
  }
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const { linebreak } = context;
    context.linebreak = 0;
    const resultO = opener(input);
    assert(context.position >= position);
    const nodesO = eval(resultO);
    if (!nodesO) {
      return void revert(context, linebreak);
    }
    if (isBacktrack(context, backtracks, position, context.position - position || 1)) {
      return void revert(context, linebreak);
    }
    const resultM = context.position < source.length ? parser(input) : undefined;
    assert(context.position >= position);
    context.range = context.position - position;
    const nodesM = eval(resultM);
    if (!resultM && !optional) {
      setBacktrack(context, backtracks, position);
      const result = g?.([nodesO, nodesM], context);
      revert(context, linebreak);
      return result;
    }
    const resultC = resultM || optional ? closer(input) : undefined;
    assert(context.position >= position);
    context.range = context.position - position;
    const nodesC = eval(resultC);
    if (!nodesC) {
      setBacktrack(context, backtracks, position);
      const result = g?.([nodesO, nodesM], context);
      revert(context, linebreak);
      return result;
    }
    if (context.position === position) {
      return void revert(context, linebreak);
    }
    context.range = context.position - position;
    const result = f
      ? f([nodesO, nodesM!, nodesC], context)
      : nodesO.import(nodesM ?? new List()).import(nodesC);
    if (result) {
      context.linebreak ||= linebreak;
    }
    else {
      revert(context, linebreak);
    }
    return result;
  });
}
export function open<P extends Parser<unknown>>(
  opener: string | RegExp | Parser<Node<P>, Context<P>>,
  parser: P,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function open<N>(
  opener: string | RegExp | Parser<N, Ctx>,
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
  closer: string | RegExp | Parser<N, Ctx>,
  optional?: boolean,
  backtracks?: readonly number[],
): Parser<N> {
  return surround('', parser, closer, optional, undefined, undefined, backtracks);
}

const statesize = 2;
export function isBacktrack(
  context: Ctx,
  backtracks: readonly number[],
  position: number = context.position,
  length: number = 1,
): boolean {
  const { source } = context;
  if (position === source.length) return false;
  if (length === 0) return false;
  for (const backtrack of backtracks) {
    if (backtrack & 1) {
      const { backtracks = {}, offset = 0 } = context;
      for (let i = 0; i < length; ++i) {
        if (position + i === source.length) break;
        if (source[position + i] !== source[position + 0]) break;
        const pos = position + i + offset;
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
  // 以降バックトラックの可能性がなく記録不要の場合もあるが判別が面倒なので省略
  const { source } = context;
  if (position === source.length) return;
  if (length === 0) return;
  for (const backtrack of backtracks) {
    if (backtrack & 2) {
      const { backtracks = {}, offset = 0 } = context;
      for (let i = 0; i < length; ++i) {
        if (position + i === source.length) break;
        const pos = position + i + offset;
        backtracks[pos] |= 1 << size(backtrack >>> statesize);
      }
    }
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
