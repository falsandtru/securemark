import { Parser, Data, SubData, SubParsers, SubParser, check } from '../parser';

export function union<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function union<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return (source, state, config) => {
        for (const parser of parsers) {
          const result = parser(source, state, config);
          assert(check(source, result));
          if (result) return result;
        }
      };
  }
}
