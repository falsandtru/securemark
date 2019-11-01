import { Parser, Data, SubData, SubParsers, SubParser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

export function sequence<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function sequence<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  return (source, config, state) => {
    let rest = source;
    const data: T[] = [];
    for (const parser of parsers) {
      if (rest === '') return;
      const result = parser(rest, config, state);
      assert(check(rest, result));
      if (!result) return;
      void concat(data, eval(result));
      rest = exec(result);
    }
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data, rest, config]
      : undefined;
  };
}
