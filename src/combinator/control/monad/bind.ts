import { Parser, Result, List, Data, Ctx, Node, Context, SubParsers, SubNode, IntermediateParser, failsafe } from '../../data/parser';

export function bind<P extends Parser>(parser: IntermediateParser<P>, f: (nodes: List<Data<SubNode<P>>>, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<P extends Parser>(parser: P, f: (nodes: List<Data<Node<P>>>, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<N, P extends Parser>(parser: Parser<N, Context<P>, SubParsers<P>>, f: (nodes: List<Data<N>>, context: Context<P>) => Result<Node<P>, Context<P>, SubParsers<P>>): P;
export function bind<U, P extends Parser>(parser: P, f: (nodes: List<Data<Node<P>>>, context: Context<P>) => Result<U, Context<P>, SubParsers<P>>): Parser<U, Context<P>, SubParsers<P>>;
export function bind<N, U>(parser: Parser<N>, f: (nodes: List<Data<N>>, context: Ctx) => Result<U>): Parser<U> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const result = parser(input);
    if (result === undefined) return;
    context.range = context.position - position;
    return f(result, context);
  });
}
