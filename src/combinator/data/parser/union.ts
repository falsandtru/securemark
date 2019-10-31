import { Parser, Data, SubData, SubParsers, SubParser, check } from '../parser';

export function union<P extends Parser<unknown, any, object>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function union<T, D extends Parser<T, any, object>[]>(parsers: D): Parser<T, D, object> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return (source, config) => {
        for (const parser of parsers) {
          const result = parser(source, config);
          assert(check(source, result));
          if (result) return result;
        }
      };
  }
}
