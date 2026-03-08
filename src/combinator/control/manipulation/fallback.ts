import { Parser } from '../../data/parser';
import { union } from '../../data/parser/union';

export function fallback<P extends Parser>(parser: P, otherwise: Parser<Parser.Node<P>, Parser.Context<P>>): P;
export function fallback<N>(parser: Parser<N>, otherwise: Parser<N>): Parser<N> {
  return union([parser, otherwise]);
}
