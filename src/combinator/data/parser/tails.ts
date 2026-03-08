import { Parser, List, Node, Ctx } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser>(parsers: Parser.SubParsers<P>, resume?: (nodes: List<Node<Parser.SubNode<P>>>) => boolean): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function tails<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: List<Node<N>>) => boolean): Parser<N, Ctx, D> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i), resume)) as D);
}
