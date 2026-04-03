import { Parser, SubParsers } from '../parser';
import { union } from './union';
import { inits } from './inits';

export function subsequence<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function subsequence<T>(parsers: SubParsers<T>): Parser<T> {
  assert(parsers.every(f => f));
  return union(
    parsers.map((_, i) =>
      i + 1 !== parsers.length
        ? inits([
            parsers[i],
            subsequence(parsers.slice(i + 1)),
          ])
        : parsers[i]));
}
