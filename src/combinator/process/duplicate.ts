import { Parser, SubParsers, Input, List, Node } from '../parser';
import { fmap } from './fmap';

export function dup<T, I extends Input, S extends SubParsers<T, I>>(parser: Parser<T, I, S>): Parser<List<Node<T>>, I, S>;
export function dup<T>(parser: Parser<T>): Parser<List<Node<T>>> {
  return fmap(parser, nodes => new List([new Node(nodes)]));
}
