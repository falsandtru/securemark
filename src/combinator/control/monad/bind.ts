import { Parser, Result, List, Node, Context } from '../../data/parser';

export function bind<P extends Parser>(parser: Parser.IntermediateParser<P>, f: (nodes: List<Node<Parser.SubNode<P>>>, context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>): P;
export function bind<P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>): P;
export function bind<N, P extends Parser>(parser: Parser<N, Parser.Context<P>, Parser.SubParsers<P>>, f: (nodes: List<Node<N>>, context: Parser.Context<P>) => Result<Parser.Node<P>, Parser.Context<P>, Parser.SubParsers<P>>): P;
export function bind<U, P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => Result<U, Parser.Context<P>, Parser.SubParsers<P>>): Parser<U, Parser.Context<P>, Parser.SubParsers<P>>;
export function bind<N, U>(parser: Parser<N>, f: (nodes: List<Node<N>>, context: Context) => Result<U>): Parser<U> {
  assert(parser);
  return input => {
    const context = input;
    const { source, position } = context;
    if (position === source.length) return;
    const res1 = parser(input);
    if (res1 === undefined) {
      context.position = position;
      return;
    }
    context.range = context.position - position;
    const res2 = f(res1, context);
    if (res2 === undefined) {
      context.position = position;
      return;
    }
    return res2;
  };
}
