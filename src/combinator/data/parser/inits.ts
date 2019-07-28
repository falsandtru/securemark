import { Parser, Data, SubData, SubParsers, SubParser } from '../parser';
import { union } from './union';
import { sequence } from './sequence';
import { bind } from '../../control/monad/bind';

export function inits<P extends Parser<unknown, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function inits<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  let ps: S;
  return parsers.length < 2
    ? union(parsers)
    : bind<T, any, S>(parsers[0], (rs, rest) =>
        union([
          sequence([
            () => [rs, rest],
            inits(ps = ps || parsers.slice(1) as S),
          ]),
          () => [rs, rest]
        ])(` ${rest}`));
}
