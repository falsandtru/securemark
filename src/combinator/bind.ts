import { Parser, Result, Data, SubData, SubParser } from './parser';

export function bind<P extends Parser<any, any>>(parser: SubParser<P>, f: (rs: SubData<P>[], rest: string) => Result<Data<P>, any>): P;
export function bind<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, any>): Parser<U, S>;
export function bind<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, any>): Parser<U, S> {
  assert(parser);
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
