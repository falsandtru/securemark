import { Parser, Ctx, Node, Context, SubParsers } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function dup<P extends Parser<unknown[]>>(parser: Parser<Node<P>[number], Context<P>, SubParsers<P>>): P;
export function dup<N, C extends Ctx, D extends Parser<unknown, C>[]>(parser: Parser<N, C, D>): Parser<N[], C, D>;
export function dup<N>(parser: Parser<N>): Parser<N[]> {
  return fmap(parser, nodes => [nodes]);
}
