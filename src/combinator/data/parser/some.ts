import { Parser, List, Node } from '../parser';
import { Delimiters } from '../delimiter';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

export function some<P extends Parser>(parser: P, limit?: number): P;
export function some<P extends Parser>(parser: P, delimiters?: readonly DelimiterOption[]): P;
export function some<P extends Parser>(parser: P, delimiter: string | RegExp, delimiters?: readonly DelimiterOption[]): P;
export function some<P extends Parser>(parser: P, delimiter: string | RegExp, after: string | RegExp, delimiters?: readonly DelimiterOption[]): P;
export function some<N>(parser: Parser<N>, delimiter?: number | string | RegExp | readonly DelimiterOption[], after?: string | RegExp | readonly DelimiterOption[], delimiters?: readonly DelimiterOption[], limit = -1): Parser<N> {
  if (typeof delimiter === 'number') {
    limit = delimiter;
    delimiter = undefined;
  }
  else if (Array.isArray(delimiter)) {
    delimiters = delimiter;
    delimiter = undefined;
  }
  else if (after === undefined || Array.isArray(after)) {
    delimiters = after;
    after = undefined;
  }
  assert(parser);
  assert(delimiter !== '');
  const match = Delimiters.matcher(delimiter as string, after as string);
  const delims = delimiters?.map(([delimiter, precedence]) => ({
    signature: Delimiters.signature(delimiter),
    matcher: Delimiters.matcher(delimiter),
    precedence,
  }));
  return input => {
    const context = input;
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
