import { Parser, Result, Data, SubData } from './parser';

export function transform<P extends Parser<any, any>>(parser: P, f: (rs: SubData<P>[], rest: string) => Result<Data<P>, any>): P;
export function transform<U, P extends Parser<any, any>>(parser: P, f: (rs: SubData<P>[], rest: string) => Result<U, any>): P;
export function transform<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<T, any>): Parser<T, S>;
export function transform<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, any>): Parser<U, S>;
export function transform<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, any>): Parser<U, S> {
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
