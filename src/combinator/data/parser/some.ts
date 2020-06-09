import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../parser';
import { push } from 'spica/array';

export function some<P extends Parser<unknown>>(parser: P, until?: string | RegExp, deep?: string | RegExp): P;
export function some<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, until?: string | RegExp, deep?: string | RegExp): Parser<T, D> {
  assert(parser);
  assert(until instanceof RegExp ? !until.global && until.source.startsWith('^') : true);
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
    let data: T[] | undefined;
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
      assert(check(rest, result));
      if (!result) break;
      assert(result);
      data = data
        ? push(data, eval(result))
        : eval(result);
      rest = exec(result);
    }
    if (context && deep) {
      context.delimiters?.length! > 1
        ? context.delimiters?.pop()
        : context.delimiters = undefined;
    }
    memory = rest || memory;
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data || [], rest]
      : undefined;
  };
}
