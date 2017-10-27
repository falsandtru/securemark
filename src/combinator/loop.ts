import { Parser, Result } from './parser';

export function loop<P extends Parser<any, any>[], R>(parser: Parser<R, P>, until?: string | RegExp | ((rest: string) => boolean)): Parser<R, P> {
  const check = ((): (rest: string) => boolean => {
    switch (typeof until) {
      case 'undefined':
        return () => false;
      case 'function':
        return until as any;
      default:
        return rest => rest.slice(0, 99).search(until as string | RegExp) === 0;
    }
  })();
  return (source: string): Result<R, P> => {
    let rest = source;
    const results: R[] = [];
    while (true) {
      if (rest === '') break;
      if (check(rest)) break;
      const result = parser(rest);
      if (!result) break;
      const [rs, r] = result;
      void results.push(...rs);
      assert(r.length < rest.length);
      assert(rest.endsWith(r));
      rest = r;
    }
    if (rest.length === source.length) return;
    return !until || check(rest)
      ? [results, rest]
      : undefined;
  };
}
