import { Parser, Result, Data, SubParsers, Config, SubData, SubParser, eval, exec, check } from '../../data/parser';

export function bind<P extends Parser<unknown, any, object>>(parser: SubParser<P>, f: (rs: SubData<P>[], rest: string, config: Config<P>) => Result<Data<P>, SubParsers<P>, Config<P>>): P;
export function bind<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, f: (rs: T[], rest: string, config: C) => Result<U, D, C>): Parser<U, D, C>;
export function bind<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, f: (rs: T[], rest: string, config: C) => Result<U, D, C>): Parser<U, D, C> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const res1 = parser(source, config);
    assert(check(source, res1));
    if (!res1) return;
    const res2 = f(eval(res1), exec(res1), config);
    assert(check(source, res2));
    assert(check(exec(res1), res2, false));
    if (!res2) return;
    return exec(res2).length <= exec(res1).length
      ? res2
      : undefined;
  };
}
