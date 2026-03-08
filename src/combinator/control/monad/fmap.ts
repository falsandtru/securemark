import { Parser, List, Node, Ctx } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser>(parser: Parser.IntermediateParser<P>, f: (nodes: List<Node<Parser.SubNode<P>>>, context: Parser.Context<P>) => List<Node<Parser.Node<P>>>): P;
export function fmap<P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => List<Node<Parser.Node<P>>>): P;
export function fmap<N, P extends Parser>(parser: Parser<N, Parser.Context<P>, Parser.SubParsers<P>>, f: (nodes: List<Node<N>>, context: Parser.Context<P>) => List<Node<Parser.Node<P>>>): P;
export function fmap<U, P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => List<Node<U>>): Parser<U, Parser.Context<P>, Parser.SubParsers<P>>;
export function fmap<N, U>(parser: Parser<N>, f: (nodes: List<Node<N>>, context: Ctx) => List<Node<U>>): Parser<U> {
  return bind(parser, (nodes, context) => f(nodes, context));
}
