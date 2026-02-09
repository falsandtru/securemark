import { Parser, Ctx, SubParsers, Node, Context, IntermediateParser, SubNode } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (nodes: SubNode<P>[], rest: string, context: Context<P>) => Node<P>[]): P;
export function fmap<P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], rest: string, context: Context<P>) => Node<P>[]): P;
export function fmap<N, P extends Parser<unknown>>(parser: Parser<N, Context<P>, SubParsers<P>>, f: (nodes: N[], rest: string, context: Context<P>) => Node<P>[]): P;
export function fmap<U, P extends Parser<unknown>>(parser: P, f: (nodes: Node<P>[], rest: string, context: Context<P>) => U[]): Parser<U, Context<P>, SubParsers<P>>;
export function fmap<N, U>(parser: Parser<N>, f: (nodes: N[], rest: string, context: Ctx) => U[]): Parser<U> {
  return bind(parser, (nodes, rest, context) => [f(nodes, rest, context), rest]);
}
