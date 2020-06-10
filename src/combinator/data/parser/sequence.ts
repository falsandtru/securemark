import { undefined } from 'spica/global';
import { Parser, Data, SubParsers, Context, SubData, eval, exec, check } from '../parser';
import { push } from 'spica/array';

export function sequence<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : Parser<SubData<P>, SubParsers<P>, Context<P>>;
export function sequence<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  return (source, context) => {
    let rest = source;
    let data: T[] | undefined;
    for (let i = 0, len = parsers.length; i < len; ++i) {
      if (rest === '') return;
      assert(!context?.delimiters?.some(match => match(rest)));
      const result = parsers[i](rest, context);
      assert(check(rest, result));
      if (!result) return;
      assert(result);
      data = data
        ? push(data, eval(result))
        : eval(result);
      rest = exec(result);
    }
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data || [], rest]
      : undefined;
  };
}
