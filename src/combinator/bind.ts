import { Parser, Result, Data, SubData, SubParsers, SubParser, BaseParser, exec } from './parser';

export function bind<P extends Parser<any, any>>(parser: SubParser<P>, f: (rs: SubData<P>[], rest: string) => Result<Data<P>, SubParsers<P>>): P;
export function bind<T, P extends Parser<any, any>>(parser: BaseParser<T, P>, f: (rs: T[], rest: string) => Result<Data<P>, SubParsers<P>>): P;
export function bind<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S>;
export function bind<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const [rs = [], rest = undefined] = parser(source) || [];
    if (rest === undefined) return;
    assert(source.slice(1).endsWith(rest));
    if (rest.length >= source.length) return;
    const result = f(rs, rest);
    assert(!result || rest.endsWith(exec(result)));
    return result && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}
