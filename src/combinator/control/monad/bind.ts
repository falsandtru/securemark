import { Parser, Result, Ctx, Tree, Context, SubParsers, SubTree, IntermediateParser, eval, exec, check } from '../../data/parser';

export function bind<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: SubTree<P>[], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>): P;
export function bind<P extends Parser<unknown>>(parser: P, f: (nodes: Tree<P>[], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>): P;
export function bind<T, P extends Parser<unknown>>(parser: Parser<T, Context<P>, SubParsers<P>>, f: (nodes: T[], rest: string, context: Context<P>) => Result<Tree<P>, Context<P>, SubParsers<P>>): P;
export function bind<U, P extends Parser<unknown>>(parser: P, f: (nodes: Tree<P>[], rest: string, context: Context<P>) => Result<U, Context<P>, SubParsers<P>>): Parser<U, Context<P>, SubParsers<P>>;
export function bind<T, U>(parser: Parser<T>, f: (nodes: T[], rest: string, context: Ctx) => Result<U>): Parser<U> {
  assert(parser);
  return input => {
    const { source, context } = input;
    if (source === '') return;
    const res1 = parser(input);
    assert(check(source, res1));
    if (res1 === undefined) return;
    const res2 = f(eval(res1), exec(res1), context);
    assert(check(source, res2));
    assert(check(exec(res1), res2, false));
    if (res2 === undefined) return;
    return exec(res2).length <= exec(res1).length
      ? res2
      : undefined;
  };
}
