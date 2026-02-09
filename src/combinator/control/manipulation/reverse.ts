import { Parser } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function reverse<P extends Parser<unknown>>(parser: P): P;
export function reverse<N>(parser: Parser<N>): Parser<N> {
  return fmap(parser, nodes => nodes.reverse());
}

