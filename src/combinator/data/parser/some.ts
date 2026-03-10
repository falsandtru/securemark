import { Parser, List, Node } from '../parser';
import { Delimiters } from '../delimiter';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

export function some<P extends Parser>(parser: P, limit?: number): P;
export function some<P extends Parser>(parser: P, delimiters?: readonly DelimiterOption[]): P;
export function some<P extends Parser>(parser: P, end: string | RegExp, delimiters?: readonly DelimiterOption[]): P;
export function some<N>(parser: Parser<N>, end?: number | string | RegExp | readonly DelimiterOption[], delimiters?: readonly DelimiterOption[], limit = -1): Parser<N> {
  if (typeof end === 'number') {
    limit = end;
    end = undefined;
  }
  else if (Array.isArray(end)) {
    delimiters = end;
    end = undefined;
  }
  assert(parser);
  const match = Delimiters.matcher(end as string);
  const delims = delimiters?.map(([delimiter, precedence]) => ({
    signature: Delimiters.signature(delimiter),
    matcher: Delimiters.matcher(delimiter),
    precedence,
  }));
  return input => {
    const { context } = input;
    const { source, position } = context;
    //assert(context.backtracks ??= {});
    let nodes: List<Node<N>> | undefined;
    delims && context.delimiters.push(delims);
    // whileは数倍遅い
    for (const len = source.length; context.position < len;) {
      if (match(input)) break;
      if (context.delimiters.match(input)) break;
      const result = parser(input);
      if (result === undefined) break;
      nodes = nodes?.import(result) ?? result;
      if (limit >= 0 && context.position - position > limit) break;
    }
    delims && context.delimiters.pop(delims.length);
    assert(context.position >= position);
    return context.position > position
      ? nodes
      : undefined;
  };
}
