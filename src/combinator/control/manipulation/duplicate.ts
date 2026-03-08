import { Parser, List, Node, Context } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function dup<N, C extends Context, D extends Parser<unknown, C>[]>(parser: Parser<N, C, D>): Parser<List<Node<N>>, C, D>;
export function dup<N>(parser: Parser<N>): Parser<List<Node<N>>> {
  return fmap(parser, nodes => new List([new Node(nodes)]));
}
