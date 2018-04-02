import { Parser, Result } from './parser';

export function transform<P extends Parser<any, any>>(parser: P, f: (rs: P extends Parser<infer T, any> ? T[] : never, rest: string) => P extends Parser<infer T, infer S> ? Result<T, S> : never): P;
export function transform<T, U, S extends Parser<any, any>[] = never[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S>;
export function transform<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S> {
  return source => {
    if (source === '') return;
    const [rs = [], rest = undefined] = parser(source) || [];
    if (rest === undefined) return;
    assert(source.slice(1).endsWith(rest));
    if (rest.length >= source.length) return;
    const result = f(rs, rest);
    assert(!result || rest.endsWith(result[1]));
    return result && result[1].length <= rest.length
      ? result
      : undefined;
  };
}
