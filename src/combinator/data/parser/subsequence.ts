import { Parser, Context } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser>(parsers: Parser.SubParsers<P>): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function subsequence<N, D extends Parser<N>[]>(parsers: D): Parser<N, Context, D> {
  assert(parsers.every(f => f));
  return union(
    parsers.map((_, i) =>
      i + 1 < parsers.length
        ? inits([parsers[i], subsequence(parsers.slice(i + 1))])
        : parsers[i]) as D);
}
