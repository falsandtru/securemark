import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../parser';
import { Delimiters } from './context/delimiter';
import { unshift, push } from 'spica/array';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

export function some<P extends Parser<unknown>>(parser: P, end?: string | RegExp | number, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<T>(parser: Parser<T>, end?: string | RegExp | number, delimiters: readonly DelimiterOption[] = [], limit = -1): Parser<T> {
  if (typeof end === 'number') return some(parser, undefined, delimiters, end);
  assert(parser);
  assert([end].concat(delimiters.map(o => o[0])).every(d => d instanceof RegExp ? !d.flags.match(/[gmy]/) && d.source.startsWith('^') : true));
  const match = Delimiters.matcher(end);
  const delims = delimiters.map(([delimiter, precedence]) => ({
    signature: Delimiters.signature(delimiter),
    matcher: Delimiters.matcher(delimiter),
    precedence,
  }));
  return (source, context) => {
    if (source === '') return;
    let rest = source;
    let nodes: T[] | undefined;
    if (delims.length > 0) {
      context.delimiters ??= new Delimiters();
      context.delimiters.push(...delims);
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context.delimiters?.match(rest, context.precedence)) break;
      const result = parser(rest, context);
      assert.doesNotThrow(() => limit < 0 && check(rest, result));
      if (!result) break;
      nodes = nodes
        ? nodes.length < eval(result).length
          ? unshift(nodes, eval(result))
          : push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (limit >= 0 && source.length - rest.length > limit) break;
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
