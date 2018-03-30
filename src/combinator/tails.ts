import { Parser, SubParsers } from './parser';
import { combine } from './combine';
import { sequence } from './sequence';

export function tails<P extends Parser<any, any>>(parsers: SubParsers<P>): P;
export function tails<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  return combine(parsers.map((_, i) => sequence(parsers.slice(i))) as S);
}
