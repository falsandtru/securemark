import { Parser, List, Node } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function reverse<P extends Parser>(parser: P): P;
export function reverse<N>(parser: Parser<N>): Parser<N> {
  return fmap(parser, nodes => nodes.foldr((node, acc) => acc.push(nodes.delete(node)) && acc, new List<Node<N>>()));
}

