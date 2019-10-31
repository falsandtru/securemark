import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<unknown, any, object>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function subsequence<T, D extends Parser<T, any, object>[]>(parsers: D): Parser<T, D, object> {
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
