import { Parser } from './parser';

export function surround<T, S extends Parser<any, any>[]>(start: string | RegExp, parser: Parser<T, S>, end: string | RegExp): Parser<T, S> {
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
}

function match(source: string, pattern: string | RegExp): string | undefined {
  if (typeof pattern === 'string') return source.startsWith(pattern)
    ? pattern
    : undefined;
  const result = source.match(pattern);
  return result
    ? result[0]
    : undefined;
}
