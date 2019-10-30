import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown, any, object>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function tails<T, S extends Parser<T, any, object>[]>(parsers: S): Parser<T, S, object> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))) as unknown as S);
}
