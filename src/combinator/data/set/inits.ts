import { Parser, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { sequence } from './sequence';
import { bind } from '../../control/monad/bind';

export function inits<P extends Parser<any, any>>(parsers: SubParsers<P>): SubParser<P>;
export function inits<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return parsers.length <= 1
    ? union(parsers)
    : bind(parsers[0], (rs, rest) =>
        union([
          sequence([
            () => [rs, rest],
            inits(parsers.slice(1)),
          ]),
          () => [rs, rest]
        ])(` ${rest}`));
}
