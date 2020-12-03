import { Parser } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function reverse<P extends Parser<unknown>>(parser: P): P;
export function reverse<T, D extends Parser<unknown>[]>(parser: Parser<T, D>): Parser<T, D> {
  return fmap(parser, ns => ns.reverse());
}

