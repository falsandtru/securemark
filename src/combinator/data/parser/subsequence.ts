import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function subsequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  switch (parsers.length) {
    case 0:
    case 1:
      return union(parsers);
    case 2:
      return union([inits(parsers), parsers[1]] as any as S);
    default:
      return subsequence([parsers[0], subsequence(parsers.slice(1))] as any as S);
  }
}
