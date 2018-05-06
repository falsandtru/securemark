import { Parser, Data } from './parser';

export function contract<P extends Parser<any, any>>(pattern: RegExp | string, parser: P, cond: (results: Data<P>[], rest: string) => boolean): P;
export function contract<T, S extends Parser<any, any>[]>(pattern: RegExp | string, parser: Parser<T, S>, cond: (results: T[], rest: string) => boolean): Parser<T, S> {
  return verify(validate(pattern, parser), cond);
}

export function validate<P extends Parser<any, any>>(pattern: RegExp | string, parser: P): P;
export function validate<T, S extends Parser<any, any>[]>(pattern: RegExp | string, parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    const result = match(source, pattern);
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

export function verify<P extends Parser<any, any>>(parser: P, cond: (results: Data<P>[], rest: string) => boolean): P;
export function verify<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, cond: (results: T[], rest: string) => boolean): Parser<T, S> {
  assert(parser);
  return source => {
    const [rs = [], r = undefined] = parser(source) || [];
    if (r === undefined) return;
    if (!cond(rs, r)) return;
    assert(source.endsWith(r));
    return r.length < source.length
      ? [rs, r]
      : undefined;
  };
}

function match(source: string, pattern: string | RegExp): string[] | null {
  if (typeof pattern === 'string') return source.startsWith(pattern)
    ? [pattern]
    : null;
  return source.match(pattern);
}
