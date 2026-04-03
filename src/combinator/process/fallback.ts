import { Parser, SubParsers } from '../parser';
import { union } from '../control/union';

export function fallback<P extends Parser>(parser: P, otherwise: Parser<Parser.Node<P>, Parser.Input<P>, SubParsers<Parser.SubNode<P>, Parser.Input<P>>>): P;
export function fallback<N>(parser: Parser<N>, otherwise: Parser<N>): Parser<N> {
  return union([parser, otherwise]);
}
