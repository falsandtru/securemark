import { Parser, Result } from './parser';

export function match<T, S extends Parser<any, any>[] = never[]>(pattern: RegExp, f: (rest: string, matched: string[]) => Result<T, S> | [T[], string]): Parser<T, S> {
  return source => {
    const result = source.match(pattern);
    if (!result) return;
    assert(source.startsWith(result[0]));
    const [rs = [], r = undefined] = f(source, result) || [];
    if (r === undefined) return;
    assert(source.endsWith(r));
    return r.length < source.length
      ? [rs, r]
      : undefined;
  };
}
