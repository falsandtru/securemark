import { Parser, Result, Data, SubData, SubParsers, SubParser, eval, exec, verify } from '../../data/parser';

export function bind<P extends Parser<unknown, any>>(parser: SubParser<P>, f: (rs: SubData<P>[], rest: string) => Result<Data<P>, SubParsers<P>>): P;
export function bind<T, U, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S>;
export function bind<T, U, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const res1 = parser(source);
    assert(verify(source, res1));
    if (!res1) return;
    const res2 = f(eval(res1), exec(res1));
    assert(verify(source, res2));
    assert(verify(exec(res1), res2, false));
    if (!res2) return;
    return exec(res2).length <= exec(res1).length
      ? res2
      : undefined;
  };
}
