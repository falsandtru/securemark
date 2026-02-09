import { Parser, Result, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, eval, exec, check } from '../../data/parser';

export function bind<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: SubNode<P>[], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<N, P extends Parser<unknown>>(parser: Parser<N, Context<P>, SubParsers<P>>, f: (nodes: N[], rest: string, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<U, P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], rest: string, context: Context<P>) => Result<U, Context<P>, SubParsers<P>>): Parser<U, Context<P>, SubParsers<P>>;
export function bind<N, U>(parser: Parser<N>, f: (nodes: N[], rest: string, context: Ctx) => Result<U>): Parser<U> {
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
