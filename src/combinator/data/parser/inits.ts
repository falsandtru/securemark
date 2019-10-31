import { Parser, Data, SubData, SubParsers, SubParser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

export function inits<P extends Parser<unknown, any, object>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function inits<T, D extends Parser<T, any, object>[]>(parsers: D): Parser<T, D, object> {
  assert(parsers.every(f => f));
  return (source, config) => {
    let rest = source;
    const data: T[] = [];
    for (const parser of parsers) {
      if (rest === '') break;
      const result = parser(rest, config);
      assert(check(rest, result));
      if (!result) break;
      void concat(data, eval(result));
      rest = exec(result);
    }
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data, rest, config]
      : undefined;
  };
}
