import { Parser, eval } from '../parser';
import { Delimiters } from './context/delimiter';
import { unshift, push } from 'spica/array';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number, linebreak?: boolean];

export function some<P extends Parser<unknown>>(parser: P, limit?: number): P;
export function some<P extends Parser<unknown>>(parser: P, end?: string | RegExp, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<N>(parser: Parser<N>, end?: string | RegExp | number, delimiters: readonly DelimiterOption[] = [], limit = 0): Parser<N> {
  if (typeof end === 'number') return some(parser, undefined, delimiters, end);
  assert(parser);
  assert([end].concat(delimiters.map(o => o[0])).every(d => d instanceof RegExp ? !d.flags.match(/[gmy]/) && d.source.startsWith('^') : true));
  const match = Delimiters.matcher(end);
  const delims = delimiters.map(([delimiter, precedence, linebreakable = true]) => ({
    signature: Delimiters.signature(delimiter, linebreakable),
    matcher: Delimiters.matcher(delimiter),
    precedence,
    linebreakable,
  }));
  return input => {
    const { context } = input;
    const { source, position } = context;
    //assert(context.backtracks ??= {});
    let nodes: N[] | undefined;
    if (delims.length > 0) {
      context.delimiters ??= new Delimiters();
      context.delimiters.push(delims);
    }
    while (true) {
      if (context.position === source.length) break;
      if (match(context)) break;
      if (context.delimiters?.match(context)) break;
      const result = parser(input);
      if (result === undefined) break;
      nodes = nodes
        ? nodes.length < eval(result).length / 8
          ? unshift(nodes, eval(result))
          : push(nodes, eval(result))
        : eval(result);
      if (limit > 0 && context.position - position > limit) break;
    }
    if (delims.length > 0) {
      context.delimiters!.pop(delims.length);
    }
    assert(context.position >= position);
    return nodes && context.position > position
      ? [nodes]
      : undefined;
  };
}
