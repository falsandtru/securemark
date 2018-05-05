import { Parser } from './parser';

export function match<P extends Parser<any, any>>(pattern: RegExp | string, parser: P): P;
export function match<T, S extends Parser<any, any>[]>(pattern: RegExp | string, parser: Parser<T, S>): Parser<T, S> {
  return source => {
    const result = match_(source, pattern);
    if (!result) return;
    assert(source.startsWith(result[0]));
    const [rs = [], r = undefined] = parser(source) || [];
    if (r === undefined) return;
    assert(source.endsWith(r));
    return r.length < source.length
      ? [rs, r]
      : undefined;
  };
}

function match_(source: string, pattern: string | RegExp): string[] | null {
  if (typeof pattern === 'string') return source.startsWith(pattern)
    ? [pattern]
    : null;
  return source.match(pattern);
}
