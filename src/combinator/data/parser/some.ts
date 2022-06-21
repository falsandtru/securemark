import { undefined } from 'spica/global';
import { Parser, Delimiters, eval, exec, check } from '../parser';
import { memoize, reduce } from 'spica/memoize';
import { push } from 'spica/array';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

const signature = (pattern: string | RegExp | undefined): string => {
  switch (typeof pattern) {
    case 'undefined':
      return signature('');
    case 'string':
      return `s:${pattern}`;
    case 'object':
      return `r/${pattern.source}/${pattern.flags}`;
  }
};
const matcher = memoize(
  (pattern: string | RegExp | undefined): (source: string) => true | undefined => {
    switch (typeof pattern) {
      case 'undefined':
        return () => undefined;
      case 'string':
        return source => source.slice(0, pattern.length) === pattern || undefined;
      case 'object':
        return reduce(source => pattern.test(source) || undefined);
    }
  },
  signature);

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp | number, deeps?: readonly DelimiterOption[], limit?: number): P;
export function some<T>(parser: Parser<T>, until?: string | RegExp | number, deeps: readonly DelimiterOption[] = [], limit = -1): Parser<T> {
  if (typeof until === 'number') return some(parser, undefined, deeps, until);
  assert(parser);
  assert([until].concat(deeps.map(o => o[0])).every(d => d instanceof RegExp ? !d.flags.match(/[gmy]/) && d.source.startsWith('^') : true));
  const match = matcher(until);
  const delimiters = deeps.map(([delimiter, precedence]) => ({
    signature: signature(delimiter),
    matcher: matcher(delimiter),
    precedence,
  }));
  return (source, context) => {
    if (source === '') return;
    let rest = source;
    let nodes: T[] | undefined;
    if (delimiters.length > 0) {
      context.delimiters ??= new Delimiters();
      context.delimiters.push(...delimiters);
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context.delimiters?.match(rest, context.precedence)) break;
      const result = parser(rest, context);
      assert.doesNotThrow(() => limit < 0 && check(rest, result));
      if (!result) break;
      nodes = nodes
        ? push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (limit >= 0 && source.length - rest.length > limit) break;
    }
    if (delimiters.length > 0) {
      context.delimiters!.pop(delimiters.length);
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
