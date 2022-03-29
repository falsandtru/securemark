import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../parser';
import { push } from 'spica/array';

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp | number, deep?: string | RegExp, limit?: number): P;
export function some<T>(parser: Parser<T>, until?: string | RegExp | number, deep?: string | RegExp, limit = -1): Parser<T> {
  assert(parser);
  assert(until instanceof RegExp ? !until.global && until.source.startsWith('^') : true);
  assert(deep instanceof RegExp ? !deep.global && deep.source.startsWith('^') : true);
  if (typeof until === 'number') return some(parser, undefined, deep, until);
  const match: (source: string) => boolean = typeof until === 'string'
    ? source => source.slice(0, until.length) === until
    : source => until?.test(source) ?? false;
  const delim: (source: string) => boolean = typeof deep === 'string'
    ? source => source.slice(0, deep.length) === deep
    : source => deep?.test(source) ?? false;
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
      context.delimiters
        ? context.delimiters.push({ signature, match: delim })
        : context.delimiters = [{ signature, match: delim }];
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context?.delimiters?.some(({ signature: sig, match }, i, delims) => {
        if (sig[0] === 'r') for (let j = 1; j <= 2 && i - j >= 0; ++j) {
          if (delims[i - j].signature === sig) return false;
        }
        return match(rest);
      })) break;
      assert(!context?.delimiters?.some(delim => delim.match(rest)));
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
      context.delimiters?.length! > 1
        ? context.delimiters?.pop()
        : context.delimiters = undefined;
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
