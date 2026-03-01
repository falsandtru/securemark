import { Parser, List, Data, Ctx, SubParsers, Node, Context, IntermediateParser, SubNode } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: List<Data<SubNode<P>>>, context: Context<P>) => List<Data<Node<P>>>): P;
export function fmap<P extends Parser<unknown>>(parser: P, f: (nodes: List<Data<Node<P>>>, context: Context<P>) => List<Data<Node<P>>>): P;
export function fmap<N, P extends Parser<unknown>>(parser: Parser<N, Context<P>, SubParsers<P>>, f: (nodes: List<Data<N>>, context: Context<P>) => List<Data<Node<P>>>): P;
export function fmap<U, P extends Parser<unknown>>(parser: P, f: (nodes: List<Data<Node<P>>>, context: Context<P>) => List<Data<U>>): Parser<U, Context<P>, SubParsers<P>>;
export function fmap<N, U>(parser: Parser<N>, f: (nodes: List<Data<N>>, context: Ctx) => List<Data<U>>): Parser<U> {
  return bind(parser, (nodes, context) => f(nodes, context));
}
