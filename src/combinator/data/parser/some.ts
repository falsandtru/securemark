import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../parser';
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
const [matcher, delimiter] = [...Array(2)].map(() =>
  memoize(
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
    signature));

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp | number, deep?: string | RegExp, limit?: number): P;
export function some<T>(parser: Parser<T>, until?: string | RegExp | number, deep?: string | RegExp, limit = -1): Parser<T> {
  assert(parser);
  assert(until instanceof RegExp ? !until.flags.match(/[gmy]/) && until.source.startsWith('^') : true);
  assert(deep instanceof RegExp ? !deep.flags.match(/[gmy]/) && deep.source.startsWith('^') : true);
  if (typeof until === 'number') return some(parser, undefined, deep, until);
  const match = matcher(until);
  const delim = delimiter(deep);
  const sig = signature(deep);
  return (source, context) => {
    if (source === '') return;
    let rest = source;
    let nodes: T[] | undefined;
    if (context && deep) {
      // bracket > annotation > bracket > reference > bracket > link > media | bracket
      // bracket > annotation > bracket > reference > bracket > index > bracket
      context.delimiters ??= { stack: [], matchers: {} };
      context.delimiters.stack.push(sig);
      context.delimiters.matchers[sig] ??= delim;
      assert(context.delimiters.matchers[sig] === delim);
    }
    const { stack, matchers } = context.delimiters ?? {};
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (stack?.some(sig => matchers![sig](rest))) break;
      const result = parser(rest, context);
      assert.doesNotThrow(() => limit < 0 && check(rest, result));
      if (!result) break;
      nodes = nodes
        ? push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (limit >= 0 && source.length - rest.length > limit) break;
    }
    if (context && deep) {
      stack?.pop();
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
