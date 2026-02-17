import { Parser, Result, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, eval, failsafe } from '../../data/parser';

export function bind<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: SubNode<P>[], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<N, P extends Parser<unknown>>(parser: Parser<N, Context<P>, SubParsers<P>>, f: (nodes: N[], context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<U, P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], context: Context<P>) => Result<U, Context<P>, SubParsers<P>>): Parser<U, Context<P>, SubParsers<P>>;
export function bind<N, U>(parser: Parser<N>, f: (nodes: N[], context: Ctx) => Result<U>): Parser<U> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const res1 = parser(input);
    assert(context.position > position || !res1);
    if (res1 === undefined) return;
    context.range = context.position - position;
    const res2 = f(eval(res1), context);
    assert(context.position > position || !res2);
    if (res2 === undefined) return;
    return context.position > position
      ? res2
      : undefined;
  });
}
