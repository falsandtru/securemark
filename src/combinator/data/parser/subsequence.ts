import { Parser, List, Node, Ctx } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser>(parsers: Parser.SubParsers<P>, resume?: (nodes: List<Node<Parser.SubNode<P>>>) => boolean): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function subsequence<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: List<Node<N>>) => boolean): Parser<N, Ctx, D> {
  assert(parsers.every(f => f));
  return union(
    parsers.map((_, i) =>
      i + 1 < parsers.length
        ? inits([parsers[i], subsequence(parsers.slice(i + 1), resume)], resume)
        : parsers[i]) as D);
}
