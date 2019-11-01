import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function tails<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))) as unknown as D);
}
