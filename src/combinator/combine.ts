import { Parser, SubParsers } from './parser';

export function combine<P extends Parser<any, any>>(parsers: SubParsers<P>): P;
export function combine<S extends Parser<any, any>[]>(parsers: S): S extends Array<infer P> ? P extends Parser<infer R, any> ? Parser<R, S> : never : never;
export function combine<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return source => {
    let rest = source;
    const results: T[] = [];
    for (const parser of parsers) {
      if (rest === '') break;
      const [rs = [], r = undefined] = parser(rest) || [];
      if (r === undefined) continue;
      assert(rest.slice(1).endsWith(r));
      if (r.length >= rest.length) return;
      void results.push(...rs);
      rest = r;
      break;
    }
    assert(rest === source || source.slice(1).endsWith(rest));
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}
