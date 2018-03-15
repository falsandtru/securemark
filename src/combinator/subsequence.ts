import { Parser, SubParsers } from './parser';

export function subsequence<P extends Parser<any, any>>(parsers: SubParsers<P>): SubParsers<P> extends Array<infer Q> ? Q extends Parser<infer R, any> ? Parser<R, SubParsers<P>> : never : never;
export function subsequence<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
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
    }
    assert(rest === source || source.slice(1).endsWith(rest));
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}
