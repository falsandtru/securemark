import { Parser, List, Data, Ctx } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser>(parser: Parser.IntermediateParser<P>, f: (nodes: List<Data<Parser.SubNode<P>>>, context: Parser.Context<P>) => List<Data<Parser.Node<P>>>): P;
export function fmap<P extends Parser>(parser: P, f: (nodes: List<Data<Parser.Node<P>>>, context: Parser.Context<P>) => List<Data<Parser.Node<P>>>): P;
export function fmap<N, P extends Parser>(parser: Parser<N, Parser.Context<P>, Parser.SubParsers<P>>, f: (nodes: List<Data<N>>, context: Parser.Context<P>) => List<Data<Parser.Node<P>>>): P;
export function fmap<U, P extends Parser>(parser: P, f: (nodes: List<Data<Parser.Node<P>>>, context: Parser.Context<P>) => List<Data<U>>): Parser<U, Parser.Context<P>, Parser.SubParsers<P>>;
export function fmap<N, U>(parser: Parser<N>, f: (nodes: List<Data<N>>, context: Ctx) => List<Data<U>>): Parser<U> {
  return bind(parser, (nodes, context) => f(nodes, context));
}
