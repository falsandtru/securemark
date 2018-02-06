import { Parser } from './parser';

export function combine<PS extends Parser<any, any>[]>(parsers: PS): PS extends Array<infer P> ? P extends Parser<infer R, any> ? Parser<R, PS> : never : never
export function combine<R, P extends Parser<R, any>[]>(parsers: P): Parser<R, P>
export function combine<R, P extends Parser<R, any>[]>(parsers: P): Parser<R, P> {
  assert(parsers.every(f => !!f));
  return source => {
    let rest = source;
    const results: R[] = [];
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
