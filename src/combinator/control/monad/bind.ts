import { Parser, Result, List, Node, Context, failsafe } from '../../data/parser';

export function bind<P extends Parser>(parser: Parser.IntermediateParser<P>, f: (nodes: List<Node<Parser.SubNode<P>>>, context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>): P;
export function bind<P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>): P;
export function bind<N, P extends Parser>(parser: Parser<N, Parser.Context<P>, Parser.SubParsers<P>>, f: (nodes: List<Node<N>>, context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>): P;
export function bind<U, P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => Result<U, Parser.Context<P>, Parser.SubParsers<P>>): Parser<U, Parser.Context<P>, Parser.SubParsers<P>>;
export function bind<N, U>(parser: Parser<N>, f: (nodes: List<Node<N>>, context: Context) => Result<U>): Parser<U> {
  assert(parser);
  return failsafe(input => {
    const context = input;
    const { source, position } = context;
    if (position === source.length) return;
    const result = parser(input);
    if (result === undefined) return;
    context.range = context.position - position;
    return f(result, context);
  });
}
