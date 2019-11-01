import { Parser, Result, Data, SubParsers, Config, State, SubData, SubParser, eval, exec, check } from '../../data/parser';

export function bind<P extends Parser<unknown>>(parser: SubParser<P>, f: (rs: SubData<P>[], rest: string, config: Config<P>, state: State<P>) => Result<Data<P>, SubParsers<P>, Config<P>, State<P>>): P;
export function bind<T, U, D extends Parser<unknown, any, C, S>[], C extends object = object, S extends object = object>(parser: Parser<T, D, C, S>, f: (rs: T[], rest: string, config: C, state: S) => Result<U, D, C, S>): Parser<U, D, C, S>;
export function bind<T, U, D extends Parser<unknown, any, C, S>[], C extends object = object, S extends object = object>(parser: Parser<T, D, C, S>, f: (rs: T[], rest: string, config: C, state: S) => Result<U, D, C, S>): Parser<U, D, C, S> {
  assert(parser);
  return (source, config, state) => {
    if (source === '') return;
    const res1 = parser(source, config, state);
    assert(check(source, res1));
    if (!res1) return;
    const res2 = f(eval(res1), exec(res1), config, state);
    assert(check(source, res2));
    assert(check(exec(res1), res2, false));
    if (!res2) return;
    return exec(res2).length <= exec(res1).length
      ? res2
      : undefined;
  };
}
