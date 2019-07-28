import { Parser, Data, SubData, SubParsers, SubParser, eval, exec, verify } from '../parser';
import { concat } from 'spica/concat';

export function sequence<P extends Parser<unknown, any>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : SubParser<P>;
export function sequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return source => {
    if (parsers.length === 0) return;
    let rest = source;
    const data: T[] = [];
    for (const parser of parsers) {
      if (rest === '') return;
      const result = parser(rest);
      assert(verify(rest, result));
      if (!result) return;
      void concat(data, eval(result));
      rest = exec(result);
    }
    return [data, rest];
  };
}
