import { Parser, Ctx, Tree, Context, SubParsers, SubTree } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown>>(parsers: SubParsers<P>): SubTree<P> extends Tree<P> ? P : Parser<SubTree<P>, Context<P>, SubParsers<P>>;
export function tails<T, D extends Parser<T>[]>(parsers: D): Parser<T, Ctx, D> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))) as D);
}
