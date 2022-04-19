import { undefined } from 'spica/global';
import { Parser, Delimiters, eval, exec, check } from '../parser';
import { memoize, reduce } from 'spica/memoize';
import { push } from 'spica/array';

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
  (pattern: string | RegExp | undefined): (source: string) => boolean => {
    switch (typeof pattern) {
      case 'undefined':
        return () => false;
      case 'string':
        return source => source.slice(0, pattern.length) === pattern;
      case 'object':
        return reduce(source => pattern.test(source));
    }
  },
  signature);

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp | number, deep?: string | RegExp, limit?: number): P;
export function some<T>(parser: Parser<T>, until?: string | RegExp | number, deep?: string | RegExp, limit = -1): Parser<T> {
  assert(parser);
  assert(until instanceof RegExp ? !until.flags.match(/[gmy]/) && until.source.startsWith('^') : true);
  assert(deep instanceof RegExp ? !deep.flags.match(/[gmy]/) && deep.source.startsWith('^') : true);
  if (typeof until === 'number') return some(parser, undefined, deep, until);
  const match = matcher(until);
  const delimiter = {
    signature: signature(deep),
    matcher: matcher(deep),
  } as const;
  return (source, context) => {
    if (source === '') return;
    let rest = source;
    let nodes: T[] | undefined;
    if (deep && context) {
      // bracket > link > media | bracket
      // bracket > index > bracket
      context.delimiters ??= new Delimiters();
      context.delimiters.push(delimiter);
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context.delimiters?.match(rest)) break;
      const result = parser(rest, context);
      assert.doesNotThrow(() => limit < 0 && check(rest, result));
      if (!result) break;
      nodes = nodes
        ? push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (limit >= 0 && source.length - rest.length > limit) break;
    }
    if (deep && context.delimiters) {
      context.delimiters.pop();
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
