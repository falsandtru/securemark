import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { bind } from '../../control/monad/bind';
import { concat } from 'spica/concat';

export function sequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function sequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  let ps: S;
  return parsers.length < 2
    ? union(parsers)
    : bind(parsers[0], (rs1, rest) =>
        bind(sequence(ps = ps || parsers.slice(1) as S), (rs2, rest) =>
          [concat(rs1, rs2), rest])
          (rest));
}
