import { Parser } from '../../data/parser';

export function surround<P extends Parser<unknown>>(start: string | RegExp, parser: P, end: string | RegExp, strict?: boolean): P;
export function surround<T, D extends Parser<unknown>[]>(start: string | RegExp, parser: Parser<T, D>, end: string | RegExp, strict = true): Parser<T, D> {
  assert(start instanceof RegExp ? !start.global && start.source.startsWith('^') : true);
  assert(end instanceof RegExp ? !end.global && end.source.startsWith('^') : true);
  assert(parser);
  return (lmr_, config) => {
    if (lmr_ === '') return;
    const l = match(lmr_, start);
    if (l === undefined) return;
    assert(lmr_.startsWith(l));
    const mr_ = l ? lmr_.slice(l.length) : lmr_;
    const [rs = [], r_ = mr_] = mr_ !== '' && parser(mr_, config) || [];
    if (strict && r_.length === mr_.length) return;
    if (r_.length > mr_.length) return;
    assert(mr_.endsWith(r_));
    const r = match(r_, end);
    if (r === undefined) return;
    assert(r_.startsWith(r));
    return l + r !== '' || r_.length - r.length < lmr_.length
      ? [rs, r ? r_.slice(r.length) : r_]
      : undefined;
  };
}

function match(source: string, pattern: string | RegExp): string | undefined {
  if (pattern === '') return pattern;
  if (typeof pattern === 'string') return source.startsWith(pattern)
    ? pattern
    : undefined;
  const result = source.match(pattern);
  return result && source.startsWith(result[0])
    ? result[0]
    : undefined;
}
