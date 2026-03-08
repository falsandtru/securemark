import { Parser, Result, List, Data, Ctx, failsafe } from '../../data/parser';
import { matcher, clear } from '../../../combinator';

export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Context<P>>, parser: Parser.IntermediateParser<P>, closer: string | RegExp | Parser<S, Parser.Context<P>>,
  optional?: false,
  backtracks?: readonly number[],
  f?: (rss: [List<Data<S>>, List<Data<Parser.SubNode<P>>>, List<Data<S>>], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Parser.SubNode<P>>> | undefined], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Context<P>>, parser: Parser.IntermediateParser<P>, closer: string | RegExp | Parser<S, Parser.Context<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
  f?: (rss: [List<Data<S>>, List<Data<Parser.SubNode<P>>> | undefined, List<Data<S>>], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Parser.SubNode<P>>> | undefined], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Context<P>>, parser: P, closer: string | RegExp | Parser<S, Parser.Context<P>>,
  optional?: false,
  backtracks?: readonly number[],
  f?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>>, List<Data<S>>], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>> | undefined], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Context<P>>, parser: P, closer: string | RegExp | Parser<S, Parser.Context<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
  f?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>> | undefined, List<Data<S>>], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>> | undefined], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser<string>, S = string>(
  opener: string | RegExp | Parser<S, Parser.Context<P>>, parser: string | RegExp | P, closer: string | RegExp | Parser<S, Parser.Context<P>>,
  optional?: false,
  backtracks?: readonly number[],
  f?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>>, List<Data<S>>], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>> | undefined], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser<string>, S = string>(
  opener: string | RegExp | Parser<S, Parser.Context<P>>, parser: string | RegExp | P, closer: string | RegExp | Parser<S, Parser.Context<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
  f?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>> | undefined, List<Data<S>>], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Data<S>>, List<Data<Parser.Node<P>>> | undefined], context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>,
): P;
export function surround<N>(
  opener: string | RegExp | Parser<N>, parser: string | RegExp | Parser<N>, closer: string | RegExp | Parser<N>,
  optional: boolean = false,
  backtracks: readonly number[] = [],
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
  const [blen, rbs, wbs] = reduce(backtracks);
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
    if (rbs && isBacktrack(context, rbs, position, blen)) {
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
  opener: string | RegExp | Parser<Parser.Node<P>, Parser.Context<P>>,
  parser: P,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function open<P extends Parser<string>>(
  opener: string | RegExp | Parser<Parser.Node<P>, Parser.Context<P>>,
  parser: string | RegExp | P,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function open<N>(
  opener: string | RegExp | Parser<N, Ctx>,
  parser: string | RegExp | Parser<N>,
  optional?: boolean,
  backtracks: readonly number[] = [],
): Parser<N> {
  return surround(opener, parser as Parser<N>, '', optional, backtracks);
}
export function close<P extends Parser>(
  parser: P,
  closer: string | RegExp | Parser<Parser.Node<P>, Parser.Context<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function close<P extends Parser<string>>(
  parser: string | RegExp | P,
  closer: string | RegExp | Parser<Parser.Node<P>, Parser.Context<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function close<N>(
  parser: string | RegExp | Parser<N>,
  closer: string | RegExp | Parser<N, Ctx>,
  optional?: boolean,
  backtracks: readonly number[] = [],
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
  assert(1 & backtrack);
  assert(backtrack >>> commandsize);
  assert(0 < length && length < 3);
  const { backtracks = {}, offset = 0 } = context;
  for (let i = 0; i < length; ++i) {
    if (backtracks[position + i + offset] & backtrack >>> commandsize) return true;
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
  assert(2 & backtrack);
  assert(backtrack >>> commandsize);
  assert(0 < length && length < 3);
  const { backtracks = {}, offset = 0 } = context;
  for (let i = 0; i < length; ++i) {
    backtracks[position + i + offset] |= backtrack >>> commandsize;
  }
}
function reduce(backtracks: readonly number[]): readonly [number, number, number] {
  let len = 1;
  let rbs = 0;
  let wbs = 0;
  for (const backtrack of backtracks) {
    if (backtrack >>> commandsize === 0) {
      len = backtrack;
      assert(len > 0);
      continue;
    }
    assert(backtrack >>> commandsize);
    if (1 & backtrack) {
      rbs |= backtrack;
    }
    if (2 & backtrack) {
      wbs |= backtrack;
    }
  }
  return [len, rbs, wbs];
}

function revert(context: Ctx, linebreak: number | undefined): void {
  context.linebreak = linebreak;
}
