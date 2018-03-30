import { Parser, SubParsers } from './parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<any, any>>(parsers: SubParsers<P>): P;
export function tails<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))) as S);
}
