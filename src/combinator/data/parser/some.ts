import { Parser, List, Data } from '../parser';
import { Delimiters } from './context/delimiter';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

export function some<P extends Parser>(parser: P, limit?: number): P;
export function some<P extends Parser>(parser: P, end?: string | RegExp, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<N>(parser: Parser<N>, end?: string | RegExp | number, delimiters: readonly DelimiterOption[] = [], limit = -1): Parser<N> {
  if (typeof end === 'number') return some(parser, undefined, delimiters, end);
  assert(parser);
  const match = Delimiters.matcher(end);
  const delims = delimiters.map(([delimiter, precedence]) => ({
    signature: Delimiters.signature(delimiter),
    matcher: Delimiters.matcher(delimiter),
    precedence,
  }));
  return input => {
    const { context } = input;
    const { source, position } = context;
    //assert(context.backtracks ??= {});
    let nodes: List<Data<N>> | undefined;
    if (delims.length > 0) {
      context.delimiters ??= new Delimiters();
      context.delimiters.push(delims);
    }
    // whileは数倍遅い
    for (const len = source.length; context.position < len;) {
      if (match(input)) break;
      if (context.delimiters?.match(input)) break;
      const result = parser(input);
      if (result === undefined) break;
      nodes = nodes?.import(result) ?? result;
      if (limit >= 0 && context.position - position > limit) break;
    }
    if (delims.length > 0) {
      context.delimiters!.pop(delims.length);
    }
    assert(context.position >= position);
    return context.position > position
      ? nodes
      : undefined;
  };
}
