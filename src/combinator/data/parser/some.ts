import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../parser';
import { push } from 'spica/array';

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp | number, deep?: string | RegExp, limit?: number): P;
export function some<T>(parser: Parser<T>, until?: string | RegExp | number, deep?: string | RegExp, limit = -1): Parser<T> {
  assert(parser);
  assert(until instanceof RegExp ? !until.global && until.source.startsWith('^') : true);
  if (typeof until === 'number') return some(parser, undefined, deep, until);
  const match: (source: string) => boolean = typeof until === 'string' && until !== undefined
    ? source => source.slice(0, until.length) === until
    : source => !!until && until.test(source);
  const delim: (source: string) => boolean = typeof deep === 'string' && deep !== undefined
    ? source => source.slice(0, deep.length) === deep
    : source => !!deep && deep.test(source);
  let memory = '';
  return (source, context) => {
    if (source === memory) return;
    let rest = source;
    let nodes: T[] | undefined;
    if (context && deep) {
      context.delimiters
        ? context.delimiters.push(delim)
        : context.delimiters = [delim];
      assert(context.delimiters.length <= 3);
    }
    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context?.delimiters?.some(match => match(rest))) break;
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
    memory = limit < 0 && rest || memory;
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
