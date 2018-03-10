import { Parser } from './parser';

export function bracket<P extends Parser<any, any>[], R>(start: string | RegExp, parser: Parser<R, P>, end: string | RegExp): Parser<R, P> {
  return lmr_ => {
    const l = match(lmr_, start);
    if (l === undefined) return;
    const mr_ = lmr_.slice(l.length);
    const [rs = [], r_ = mr_] = parser(mr_) || [];
    assert(mr_.endsWith(r_));
    const r = match(r_, end);
    if (r === undefined) return;
    return l + r !== '' || r_.length - r.length < lmr_.length
      ? [rs, r_.slice(r.length)]
      : undefined;
  };

  function match(source: string, pattern: string | RegExp): string | undefined {
    if (typeof pattern !== 'string') {
      const result = source.slice(0, 9).match(pattern);
      return result
        ? match(source, result[0])
        : undefined;
    }
    return source.startsWith(pattern)
      ? pattern
      : undefined;
  }
}
