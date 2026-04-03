import { Parser, List, Node } from '../parser';
import { fmap } from './fmap';

export function reverse<P extends Parser>(parser: P): P;
export function reverse<T>(parser: Parser<T>): Parser<T> {
  return fmap(parser, nodes => nodes.foldr((node, acc) => acc.push(nodes.delete(node)), new List<Node<T>>()));
}
