import { Parser, Result } from './parser';

export function match<T, S extends Parser<any, any>[]>(pattern: RegExp, f: (matched: string[], source: string) => Result<T, S>): Parser<T, S> {
  return source => {
    const result = source.match(pattern);
    if (!result) return;
    assert(source.startsWith(result[0]));
    const [rs = [], rest = undefined] = f(result, source) || [];
    if (rest === undefined) return;
    return rest.length < source.length
      ? [rs, rest]
      : undefined;
  };
}
