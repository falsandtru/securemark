import { Parser, Data, SubData, SubParsers, SubParser, verify } from '../parser';

export function union<P extends Parser<unknown, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function union<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return source => {
        for (const parser of parsers) {
          const result = parser(source);
          assert(verify(source, result));
          if (result) return result;
        }
      };
  }
}
