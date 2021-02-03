import { Parser, Ctx, Tree, Context, SubParsers } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function dup<P extends Parser<unknown[]>>(parser: Parser<Tree<P>[number], Context<P>, SubParsers<P>>): P;
export function dup<T, C extends Ctx, D extends Parser<unknown, C>[]>(parser: Parser<T, C, D>): Parser<T[], C, D>;
export function dup<T>(parser: Parser<T>): Parser<T[]> {
  return fmap(parser, nodes => [nodes]);
}
