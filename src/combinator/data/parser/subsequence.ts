import { Parser, Ctx, Tree, Context, SubParsers, SubTree } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<unknown>>(parsers: SubParsers<P>): SubTree<P> extends Tree<P> ? P : Parser<SubTree<P>, Context<P>, SubParsers<P>>;
export function subsequence<T, D extends Parser<T>[]>(parsers: D): Parser<T, Ctx, D> {
  assert(parsers.every(f => f));
  return union(
    parsers.map((_, i) =>
      i < parsers.length - 1
        ? inits([parsers[i], subsequence(parsers.slice(i + 1))])
        : parsers[i]) as D);
}
