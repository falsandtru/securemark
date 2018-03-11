import { Parser } from './parser';

export function some<P extends Parser<any, any>>(parser: P, until?: string | RegExp): P;
export function some<S extends Parser<any, any>[], R>(parser: Parser<R, S>, until?: string | RegExp): Parser<R, S> {
  assert(parser);
  return source => {
    let rest = source;
    const results: R[] = [];
    while (true) {
      if (rest === '') break;
      if (until && match(rest, until)) break;
      const result = parser(rest);
      if (!result) break;
      const [rs, r] = result;
      void results.push(...rs);
      assert(r.length < rest.length);
      assert(rest.endsWith(r));
      rest = r;
    }
    return rest.length === source.length
      ? undefined
      : [results, rest];
  };
}

function match(source: string, pattern: string | RegExp): boolean {
  return typeof pattern === 'string'
    ? source.startsWith(pattern)
    : source.slice(0, 9).search(pattern) === 0;
}
