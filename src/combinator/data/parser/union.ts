import { Parser, Data, SubData, SubParsers, IntermediateParser, check } from '../parser';

export function union<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : IntermediateParser<P>;
export function union<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => void 0;
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
