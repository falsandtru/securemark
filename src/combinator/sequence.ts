import { Parser, SubParsers, SubParser, eval, exec, validate } from './parser';
import { concat } from 'spica/concat';

export function sequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubParser<P>;
export function sequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return source => {
    let rest = source;
    const results: T[] = [];
    for (const parser of parsers) {
      if (rest === '') return;
      const result = parser(rest);
      validate(rest, result);
      if (!result) return;
      if (exec(result).length >= rest.length) return;
      void concat(results, eval(result));
      rest = exec(result);
    }
    assert(rest === source || source.slice(1).endsWith(rest));
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}
