import { Parser, Tree, Context } from '../../data/parser';
import { union } from '../../data/parser/union';

export function fallback<P extends Parser<unknown>>(parser: P, otherwise: Parser<Tree<P>, Context<P>>): P;
export function fallback<T, P extends Parser<T>>(parser: P, otherwise: Parser<T, Context<P>>): P;
export function fallback<T>(parser: Parser<T>, otherwise: Parser<T>): Parser<T> {
  return union([parser, otherwise]);
}
