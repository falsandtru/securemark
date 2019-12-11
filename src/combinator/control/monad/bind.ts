import { Parser, Result, Data, SubParsers, State, Config, SubData, IntermediateParser, eval, exec, check } from '../../data/parser';

export function bind<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (rs: SubData<P>[], rest: string, config: Config<P>) => Result<Data<P>, SubParsers<P>, State<P>, Config<P>>): P;
export function bind<P extends Parser<unknown>>(parser: P, f: (rs: Data<P>[], rest: string, config: Config<P>) => Result<Data<P>, SubParsers<P>, State<P>, Config<P>>): P;
export function bind<U, P extends Parser<unknown>>(parser: P, f: (rs: Data<P>[], rest: string, config: Config<P>) => Result<U, SubParsers<P>, State<P>, Config<P>>): Parser<U, SubParsers<P>, State<P>, Config<P>>;
export function bind<T, U, D extends Parser<unknown, any, S, C>[], S extends object = object, C extends object = object>(parser: Parser<T, D, S, C>, f: (rs: T[], rest: string, config: C) => Result<U, D, S, C>): Parser<U, D, S, C> {
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
