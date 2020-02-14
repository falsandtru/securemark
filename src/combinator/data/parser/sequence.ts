import { Parser, Data, SubData, SubParsers, IntermediateParser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

export function sequence<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : IntermediateParser<P>;
export function sequence<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  return (source, context) => {
    let rest = source;
    let data: T[] | undefined;
    for (let i = 0, len = parsers.length; i < len; ++i) {
      if (rest === '') return;
      const result = parsers[i](rest, context);
      assert(check(rest, result));
      if (!result) return;
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
