import { Parser, SubParsers } from '../parser';

export function union<P extends Parser<any, any>>(parsers: SubParsers<P>): P;
export function union<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    case 2:
      return source => parsers[0](source) || parsers[1](source);
    default:
      return union([parsers[0], union(parsers.slice(1))] as S);
  }
}
