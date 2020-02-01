import { Parser } from '../../data/parser';

export function surround<P extends Parser<unknown>>(start: string | RegExp, parser: P, end: string | RegExp, strict?: boolean): P;
export function surround<T, D extends Parser<unknown>[]>(start: string | RegExp, parser: Parser<T, D>, end: string | RegExp, strict = true): Parser<T, D> {
  assert(start instanceof RegExp ? !start.global && start.source.startsWith('^') : true);
  assert(end instanceof RegExp ? !end.global && end.source.startsWith('^') : true);
  assert(parser);
  const starts = match(start);
  const ends = match(end);
  return (lmr_, config) => {
    if (lmr_ === '') return;
    const l = starts(lmr_);
    if (l === void 0) return;
    assert(lmr_.startsWith(l));
    const mr_ = l ? lmr_.slice(l.length) : lmr_;
    const [rs = [], r_ = mr_] = mr_ !== '' && parser(mr_, config) || [];
    if (strict && r_.length === mr_.length) return;
    if (r_.length > mr_.length) return;
    assert(mr_.endsWith(r_));
    const r = ends(r_);
    if (r === void 0) return;
    assert(r_.startsWith(r));
    return l + r !== '' || r_.length - r.length < lmr_.length
      ? [rs, r ? r_.slice(r.length) : r_]
      : void 0;
  };
}

function match(pattern: string | RegExp): (source: string) => string | undefined {
  return typeof pattern === 'string'
    ? source => source.slice(0, pattern.length) === pattern ? pattern : void 0
    : source => source.match(pattern)?.[0];
}
