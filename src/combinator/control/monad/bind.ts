import { undefined } from 'spica/global';
import { Parser, Result, Ctx, Data, SubParsers, Context, SubData, IntermediateParser, eval, exec, check } from '../../data/parser';

export function bind<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: SubData<P>[], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>): P;
export function bind<P extends Parser<unknown>>(parser: P, f: (nodes: Data<P>[], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>): P;
export function bind<T, P extends Parser<unknown>>(parser: Parser<T, SubParsers<P>, Context<P>>, f: (nodes: T[], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>): P;
export function bind<U, P extends Parser<unknown>>(parser: P, f: (nodes: Data<P>[], rest: string, context: Context<P>) => Result<U, SubParsers<P>, Context<P>>): Parser<U, SubParsers<P>, Context<P>>;
export function bind<T, U>(parser: Parser<T>, f: (nodes: T[], rest: string, context: Ctx) => Result<U>): Parser<U> {
  assert(parser);
  return (source, context) => {
    if (source === '') return;
    const res1 = parser(source, context);
    assert(check(source, res1));
    if (!res1) return;
    const res2 = f(eval(res1), exec(res1), context);
    assert(check(source, res2));
    assert(check(exec(res1), res2, false));
    if (!res2) return;
    return exec(res2).length <= exec(res1).length
      ? res2
      : undefined;
  };
}
