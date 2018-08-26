import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function subsequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return parsers.length < 2
    ? union(parsers)
    : union([inits(parsers), subsequence(parsers.slice(1))] as S);
}
