import { Parser, SubParsers } from './parser';

export function combine<P extends Parser<any, any>>(parsers: SubParsers<P>): SubParsers<P> extends Array<infer Q> ? Q extends Parser<infer R, any> ? Parser<R, SubParsers<P>> : never : never;
export function combine<S extends Parser<any, any>[]>(parsers: S): S extends Array<infer P> ? P extends Parser<infer R, any> ? Parser<R, S> : never : never;
export function combine<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  return source => {
    let rest = source;
    const results: T[] = [];
    for (const parse of parsers) {
      if (rest === '') break;
      const r = parse(rest);
      if (!r) continue;
      assert(r[1].length < rest.length);
      assert(rest.endsWith(r[1]));
      if (r[1].length >= rest.length) return;
      void results.push(...r[0]);
      rest = r[1];
      break;
    }
    assert(rest === source || source.slice(1).endsWith(rest));
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}
