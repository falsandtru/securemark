import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown, any, object, object>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function tails<T, D extends Parser<T, any, object, object>[]>(parsers: D): Parser<T, D, object, object> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))) as unknown as D);
}
