import { Parser, Data, SubData, SubParsers, SubParser, eval, exec, verify } from '../parser';
import { concat } from 'spica/concat';

export function inits<P extends Parser<unknown, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function inits<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return source => {
    let rest = source;
    const data: T[] = [];
    for (const parser of parsers) {
      if (rest === '') break;
      const result = parser(rest);
      assert(verify(rest, result));
      if (!result) break;
      void concat(data, eval(result));
      rest = exec(result);
    }
    return rest.length < source.length
      ? [data, rest]
      : undefined;
  };
}
