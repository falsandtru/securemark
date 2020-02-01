import { Parser, Data, SubData, SubParsers, IntermediateParser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

export function inits<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : IntermediateParser<P>;
export function inits<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  return (source, config) => {
    let rest = source;
    let data: T[] | undefined;
    for (let i = 0, len = parsers.length; i < len; ++i) {
      if (rest === '') break;
      const result = parsers[i](rest, config);
      assert(check(rest, result));
      if (!result) break;
      data = data
        ? concat(data, eval(result))
        : eval(result);
      rest = exec(result);
    }
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data || [], rest]
      : void 0;
  };
}
