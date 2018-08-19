import { Parser, SubParsers } from './parser';

export function union<P extends Parser<any, any>>(parsers: SubParsers<P>): P;
export function union<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return source => {
        const [rs = [], rest = undefined] = parsers[0](source) || [];
        if (rest === undefined) return union(parsers.slice(1))(source);
        assert(source.slice(1).endsWith(rest));
        if (rest.length >= source.length) return;
        assert(rest === source || source.slice(1).endsWith(rest));
        return rest.length < source.length
          ? [rs, rest]
          : undefined;
      };
  }
}
