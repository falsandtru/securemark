import { Parser, Result } from '../parser.d';

export function loop<P extends Parser<any, any>[], R>(parser: Parser<R, P>, until?: RegExp): Parser<R, P> {
  return (source: string): Result<R, P> => {
    let rest = source;
    if (until && rest.slice(0, 99).search(until) === 0) return;
    const results: R[] = [];
    while (true) {
      if (rest === '') break;
      const r = parser(rest);
      if (!r) break;
      void results.push(...r[0]);
      assert(r[1].length < rest.length);
      rest = r[1];
      if (until && rest.slice(0, 99).search(until) === 0) break;
    }
    return rest.length < source.length
      ? [results, rest]
      : void 0;
  };
}
