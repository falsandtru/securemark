import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../parser';
import { reduce } from 'spica/memoize';
import { push } from 'spica/array';

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp | number, deep?: string | RegExp, limit?: number): P;
export function some<T>(parser: Parser<T>, until?: string | RegExp | number, deep?: string | RegExp, limit = -1): Parser<T> {
  assert(parser);
  assert(until instanceof RegExp ? !until.flags.match(/[gmy]/) && until.source.startsWith('^') : true);
  assert(deep instanceof RegExp ? !deep.flags.match(/[gmy]/) && deep.source.startsWith('^') : true);
  if (typeof until === 'number') return some(parser, undefined, deep, until);
  const match: (source: string) => boolean = typeof until === 'string'
    ? source => source.slice(0, until.length) === until
    : source => until?.test(source) ?? false;
  const delim: (source: string) => boolean = typeof deep === 'string'
    ? source => source.slice(0, deep.length) === deep
    : reduce(source => deep?.test(source) ?? false);
  const signature = typeof deep === 'string'
    ? `s:${deep}`
    : `r:${deep?.source ?? ''}`;
  return (source, context) => {
    if (source === '') return;
    let rest = source;
    let nodes: T[] | undefined;
    if (context && deep) {
      // bracket>annotation>bracket>reference>bracket>link>media|bracket
      // bracket>annotation>bracket>reference>bracket>index>bracket
      context.delimiters ??= { stack: [], matchers: {} };
      context.delimiters.stack.push(signature);
      context.delimiters.matchers[signature] ??= delim;
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context?.delimiters?.stack.some(sig => context.delimiters!.matchers[sig](rest))) break;
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
      context.delimiters?.stack.pop();
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
