import { Parser, Result } from './parser';

export function capture<T, S extends Parser<any, any>[] = never[]>(pattern: RegExp, f: (matched: string[], rest: string) => Result<T, S> | [T[], string]): Parser<T, S> {
  return source => {
    const result = source.match(pattern);
    if (!result) return;
    assert(source.startsWith(result[0]));
    const rest = source.slice(result[0].length);
    const [rs = [], r = undefined] = f(result, rest) || [];
    if (r === undefined) return;
    assert(rest.endsWith(r));
    return r.length < source.length && r.length <= rest.length
      ? [rs, r]
      : undefined;
  };
}
