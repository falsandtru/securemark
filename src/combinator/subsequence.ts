import { Parser, SubParsers, SubParser } from './parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubParser<P>;
export function subsequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return parsers.length <= 1
    ? union(parsers)
    : union([inits(parsers), subsequence(parsers.slice(1))] as S);
}
