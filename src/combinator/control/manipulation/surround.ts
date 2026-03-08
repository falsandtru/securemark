import { Parser, Result, List, Data, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, failsafe } from '../../data/parser';
import { matcher, clear } from '../../../combinator';

export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
  f?: (rss: [List<Data<S>>, List<Data<SubNode<P>>>, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<SubNode<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
  f?: (rss: [List<Data<S>>, List<Data<SubNode<P>>> | undefined, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<SubNode<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
  f?: (rss: [List<Data<S>>, List<Data<Node<P>>>, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
  f?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
): P;
export function surround<P extends Parser<string>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: string | RegExp | P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: false,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
  f?: (rss: [List<Data<S>>, List<Data<Node<P>>>, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
): P;
export function surround<P extends Parser<string>, S = string>(
  opener: string | RegExp | Parser<S, Context<P>>, parser: string | RegExp | P, closer: string | RegExp | Parser<S, Context<P>>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
  f?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined, List<Data<S>>], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Node<P>>> | undefined], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>,
): P;
export function surround<N>(
  opener: string | RegExp | Parser<N>, parser: string | RegExp | Parser<N>, closer: string | RegExp | Parser<N>,
  optional: boolean = false,
  backtracks: readonly [] | readonly [number] | readonly [number, number] = [],
  f?: (rss: [List<Data<N>>, List<Data<N>>, List<Data<N>>], context: Ctx) => Result<N>,
  g?: (rss: [List<Data<N>>, List<Data<N>> | undefined], context: Ctx) => Result<N>,
): Parser<N> {
  switch (typeof opener) {
    case 'string':
    case 'object':
      opener = clear(matcher(opener, true));
  }
  assert(opener);
  switch (typeof parser) {
    case 'string':
    case 'object':
      parser = clear(matcher(parser, true));
  }
  assert(parser);
  switch (typeof closer) {
    case 'string':
    case 'object':
      closer = clear(matcher(closer, true));
  }
  assert(closer);
  const [rbs, wbs] = reduce(backtracks);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const { linebreak } = context;
    context.linebreak = 0;
    const nodesO = opener(input);
    if (!nodesO) {
      return void revert(context, linebreak);
    }
    if (rbs && isBacktrack(context, rbs, position, context.position - position || 1)) {
      return void revert(context, linebreak);
    }
    const nodesM = context.position < source.length ? parser(input) : undefined;
    context.range = context.position - position;
    if (!nodesM && !optional) {
      wbs && setBacktrack(context, wbs, position);
      const result = g?.([nodesO, nodesM], context);
      return result || void revert(context, linebreak);
    }
    const nodesC = nodesM || optional ? closer(input) : undefined;
    context.range = context.position - position;
    if (!nodesC) {
      wbs && setBacktrack(context, wbs, position);
      const result = g?.([nodesO, nodesM], context);
      return result || void revert(context, linebreak);
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
    return result || void revert(context, linebreak);
  });
}
export function open<P extends Parser>(
  opener: string | RegExp | Parser<Node<P>, Context<P>>,
  parser: P,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
): P;
export function open<P extends Parser<string>>(
  opener: string | RegExp | Parser<Node<P>, Context<P>>,
  parser: string | RegExp | P,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
): P;
export function open<N>(
  opener: string | RegExp | Parser<N, Ctx>,
  parser: string | RegExp | Parser<N>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
): Parser<N> {
  return surround(opener, parser as Parser<N>, '', optional, backtracks);
}
export function close<P extends Parser>(
  parser: P,
  closer: string | RegExp | Parser<Node<P>, Context<P>>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
): P;
export function close<P extends Parser<string>>(
  parser: string | RegExp | P,
  closer: string | RegExp | Parser<Node<P>, Context<P>>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
): P;
export function close<N>(
  parser: string | RegExp | Parser<N>,
  closer: string | RegExp | Parser<N, Ctx>,
  optional?: boolean,
  backtracks?: readonly [] | readonly [number] | readonly [number, number],
): Parser<N> {
  return surround('', parser as Parser<N>, closer, optional, backtracks);
}

const commandsize = 2;
export function isBacktrack(
  context: Ctx,
  backtrack: number,
  position: number = context.position,
  length: number = 1,
): boolean {
  assert(backtrack & 1);
  if (length === 0) return false;
  const { source } = context;
  if (position === source.length) return false;
  const { backtracks = {}, offset = 0 } = context;
  for (let i = 0; i < length; ++i) {
    if (position + i === source.length) break;
    if (i > 0 && source[position + i] !== source[position]) break;
    const pos = position + i + offset;
    if (backtracks[pos] & backtrack >>> commandsize) return true;
  }
  return false;
}
export function setBacktrack(
  context: Ctx,
  backtrack: number,
  position: number,
  length: number = 1,
): void {
  // バックトラックの可能性がなく記録不要の場合もあるが判別が面倒なので省略
  assert(backtrack & 2);
  if (length === 0) return;
  const { source } = context;
  if (position === source.length) return;
  const { backtracks = {}, offset = 0 } = context;
  for (let i = 0; i < length; ++i) {
    if (position + i === source.length) break;
    const pos = position + i + offset;
    backtracks[pos] |= backtrack >>> commandsize;
  }
}
function reduce(backtracks: readonly number[]): readonly [number, number] {
  let rbs = 0;
  let wbs = 0;
  for (const backtrack of backtracks) {
    if (backtrack & 1) {
      rbs |= backtrack;
    }
    if (backtrack & 2) {
      wbs |= backtrack;
    }
  }
  return [rbs, wbs];
}

function revert(context: Ctx, linebreak: number | undefined): void {
  context.linebreak = linebreak;
}
