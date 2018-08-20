import { Parser, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { bind } from '../../control/monad/bind';
import { concat } from 'spica/concat';

export function sequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubParser<P>;
export function sequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return parsers.length <= 1
    ? union(parsers)
    : bind(parsers[0], (rs1, rest) =>
        bind(sequence(parsers.slice(1)), (rs2, rest) =>
          [concat(rs1, rs2), rest])
          (rest));
}
