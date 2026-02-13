import { Parser, eval, exec, check } from '../parser';
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
  return ({ source, context }) => {
    if (source === '') return;
    assert(context.backtracks ??= {});
    let rest = source;
    let nodes: N[] | undefined;
    if (delims.length > 0) {
      context.delimiters ??= new Delimiters();
      context.delimiters.push(delims);
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context.delimiters?.match(rest, context)) break;
      const result = parser({ source: rest, context });
      assert.doesNotThrow(() => limit === 0 && check(rest, result));
      if (result === undefined) break;
      nodes = nodes
        ? nodes.length < eval(result).length / 8
          ? unshift(nodes, eval(result))
          : push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (limit > 0 && source.length - rest.length > limit) break;
    }
    if (delims.length > 0) {
      context.delimiters!.pop(delims.length);
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
