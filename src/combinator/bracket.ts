import { Parser, Result } from './parser';

export function bracket<R, P extends Parser<any, any>[]>(start: string | RegExp, parser: Parser<R, P>, end: string | RegExp): Parser<R, P> {
  return (lmr_: string): Result<R, P> => {
    const l = match(lmr_, start);
    if (l === undefined) return;
    const mr_ = lmr_.slice(l.length);
    const [rs, r_] = parser(mr_) || [[], mr_];
    if (!mr_.endsWith(r_)) return;
    const r = match(r_, end);
    if (r === undefined) return;
    if (r_ === mr_ && l + r === '') return;
    return [rs, r_.slice(r.length)];
  };

  function match(source: string, pattern: string | RegExp): string | undefined {
    return typeof pattern === 'string'
      ? source.startsWith(pattern)
        ? pattern
        : undefined
      : source.slice(0, 9).search(pattern) === 0
        ? source.slice(0, 9).match(pattern)![0]
        : undefined;
  }
}
