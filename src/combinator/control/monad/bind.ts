import { Parser, Result, Data, SubData, SubParsers, SubParser, BaseParser, eval, exec, validate } from '../../data/parser';

export function bind<P extends Parser<any, any>>(parser: SubParser<P>, f: (rs: SubData<P>[], rest: string) => Result<Data<P>, SubParsers<P>>): P;
export function bind<T, P extends Parser<any, any>>(parser: BaseParser<T, P>, f: (rs: T[], rest: string) => Result<Data<P>, SubParsers<P>>): P;
export function bind<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S>;
export function bind<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const res1 = parser(source);
    validate(source, res1);
    if (!res1) return;
    const res2 = f(eval(res1), exec(res1));
    validate(source, res2);
    if (!res2) return;
    assert(exec(res1).endsWith(exec(res2)));
    return exec(res2).length <= exec(res1).length
      ? res2
      : undefined;
  };
}
