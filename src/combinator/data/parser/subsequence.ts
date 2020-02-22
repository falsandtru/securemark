import { Parser, SubParsers } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<unknown>>(parsers: SubParsers<P>): P;
export function subsequence<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
    case 1:
      return union(parsers);
    case 2:
      return union([inits(parsers), parsers[1]] as unknown as D);
    default:
      return subsequence([parsers[0], subsequence(parsers.slice(1))] as unknown as D);
  }
}
