import { Parser, Ctx, SubParsers, Node, Context, IntermediateParser, SubNode } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: SubNode<P>[], context: Context<P>) => Node<P>[]): P;
export function fmap<P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], context: Context<P>) => Node<P>[]): P;
export function fmap<N, P extends Parser<unknown>>(parser: Parser<N, Context<P>, SubParsers<P>>, f: (nodes: N[], context: Context<P>) => Node<P>[]): P;
export function fmap<U, P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], context: Context<P>) => U[]): Parser<U, Context<P>, SubParsers<P>>;
export function fmap<N, U>(parser: Parser<N>, f: (nodes: N[], context: Ctx) => U[]): Parser<U> {
  return bind(parser, (nodes, context) => [f(nodes, context)]);
}
