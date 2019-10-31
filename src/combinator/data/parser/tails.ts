import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown, any, object>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function tails<T, D extends Parser<T, any, object>[]>(parsers: D): Parser<T, D, object> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))) as unknown as D);
}
