import { Parser, Result } from './parser';

export function loop<P extends Parser<any, any>>(parser: P, until?: string | RegExp): P;
export function loop<P extends Parser<any, any>[], R>(parser: Parser<R, P>, until?: string | RegExp): Parser<R, P> {
  assert(parser);
  return (source: string): Result<R, P> => {
    let rest = source;
    const results: R[] = [];
    while (true) {
      if (rest === '') break;
      if (until && rest.slice(0, 9).search(until) === 0) break;
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
