import { Parser, List, Node } from '../parser';
import { Delimiters } from '../delimiter';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

export function some<P extends Parser>(parser: P, limit?: number): P;
export function some<P extends Parser>(parser: P, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<P extends Parser>(parser: P, delimiter: string | RegExp, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<P extends Parser>(parser: P, delimiter: string | RegExp, after: string | RegExp, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<N>(parser: Parser<N>, delimiter?: number | string | RegExp | readonly DelimiterOption[], after?: number | string | RegExp | readonly DelimiterOption[], delimiters?: number | readonly DelimiterOption[], limit = 0): Parser<N> {
  if (typeof delimiter === 'number') {
    limit = delimiter;
    delimiters = undefined;
    delimiter = undefined;
  }
  else if (Array.isArray(delimiter)) {
    limit = after as number;
    delimiters = delimiter;
    delimiter = undefined;
  }
  else if (after === undefined || Array.isArray(after)) {
    limit = delimiters as number;
    delimiters = after;
    after = undefined;
  }
  else {
    delimiters = delimiters as readonly DelimiterOption[];
  }
  assert(parser);
  assert(delimiter !== '');
  assert(delimiters === undefined || Array.isArray(delimiters));
  const match = Delimiters.tester(delimiter as string, after as string);
  const delims = delimiters?.map(([delimiter, precedence]) => ({
    signature: Delimiters.signature(delimiter),
    tester: Delimiters.tester(delimiter),
    precedence,
  }));
  return input => {
    const context = input;
    const { source, position } = context;
    let nodes: List<Node<N>> | undefined;
    delims && context.delimiters.push(delims);
    // whileは数倍遅い
    for (const len = source.length; context.position < len;) {
      if (match(input)) break;
      if (context.delimiters.test(input)) break;
      const pos = context.position;
      const result = parser(input);
      if (result === undefined) break;
      if (context.position === pos) break;
      nodes = nodes?.import(result) ?? result;
      // 次にパースに成功すれば確実に制限値を超えるので制限値ちょうどでも中止する
      if (limit > 0 && context.position - position >= limit) break;
    }
    delims && context.delimiters.pop(delims.length);
    assert(context.position >= position);
    return context.position > position
      ? nodes
      : undefined;
  };
}
