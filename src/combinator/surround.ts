import { Parser } from './parser';

export function surround<P extends Parser<any, any>>(start: string | RegExp, parser: P, end: string | RegExp, strict?: boolean): P;
export function surround<T, S extends Parser<any, any>[]>(start: string | RegExp, parser: Parser<T, S>, end: string | RegExp, strict = true): Parser<T, S> {
  assert(parser);
  return lmr_ => {
    if (lmr_ === '') return;
    const l = match(lmr_, start);
    if (l === undefined) return;
    const mr_ = lmr_.slice(l.length);
    const [rs = [], r_ = mr_] = mr_ !== '' && parser(mr_) || [];
    if (strict && r_.length === mr_.length) return;
    if (r_.length > mr_.length) return;
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
