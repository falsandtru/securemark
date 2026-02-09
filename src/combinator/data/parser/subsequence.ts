import { Parser, Ctx, Node, Context, SubParsers, SubNode } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<unknown>>(parsers: SubParsers<P>, resume?: (nodes: SubNode<P>[], rest: string) => boolean): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function subsequence<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: N[], rest: string) => boolean): Parser<N, Ctx, D> {
  assert(parsers.every(f => f));
  return union(
    parsers.map((_, i) =>
      i + 1 < parsers.length
        ? inits([parsers[i], subsequence(parsers.slice(i + 1), resume)], resume)
        : parsers[i]) as D);
}
