import { Parser, Node, Context } from '../../data/parser';
import { union } from '../../data/parser/union';

export function fallback<P extends Parser<unknown>>(parser: P, otherwise: Parser<Node<P>, Context<P>>): P;
export function fallback<N>(parser: Parser<N>, otherwise: Parser<N>): Parser<N> {
  return union([parser, otherwise]);
}
