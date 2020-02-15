import { Parser, Ctx, Result, Data, Context, exec } from '../../data/parser';
import { fmap } from '../monad/fmap';
import { bind } from '../monad/bind';
import { unshift, push } from 'spica/array';

export function surround<P extends Parser<unknown>>(start: string | RegExp, parser: P, end: string | RegExp | Parser<unknown>, strict?: boolean): P;
export function surround<T, D extends Parser<unknown>[]>(start: string | RegExp, parser: Parser<T, D>, end: string | RegExp | Parser<unknown>, strict = true): Parser<T, D> {
  assert(start instanceof RegExp ? !start.global && start.source.startsWith('^') : true);
  assert(end instanceof RegExp ? !end.global && end.source.startsWith('^') : true);
  assert(parser);
  const starts = match(start);
  const ends = match(end);
  return (lmr_, context) => {
    if (lmr_ === '') return;
    const l = starts(lmr_, context);
    if (l === void 0) return;
    assert(lmr_.startsWith(l));
    const mr_ = l ? lmr_.slice(l.length) : lmr_;
    const [rs = [], r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
    assert(mr_.endsWith(r_));
    if (strict && r_.length === mr_.length) return;
    const r = ends(r_, context);
    if (r === void 0) return;
    assert(r_.startsWith(r));
    return l + r !== '' || r_.length - r.length < lmr_.length
      ? [rs, r ? r_.slice(r.length) : r_]
      : void 0;
  };
}

function match(pattern: string | RegExp | Parser<unknown>): (source: string, context: Ctx) => string | undefined {
  switch (typeof pattern) {
    case 'string':
      return source => source.slice(0, pattern.length) === pattern ? pattern : void 0;
    case 'object':
      return source => source.match(pattern)?.[0];
    default:
      return (source, context) => {
        const res = pattern(source, context);
        return res && source.slice(0, source.length - exec(res).length);
      };
  }
}

export function open<P extends Parser<unknown, any, object>>(opener: Parser<Data<P>, any, Context<P>>, parser: P, optional?: boolean): P;
//export function open<T, D extends Parser<unknown, any, C>[], C extends object>(opener: Parser<T, any, C>, parser: Parser<T, D, C>, optional?: boolean): Parser<T, D, C>;
export function open<T, D extends Parser<unknown, any, C>[], C extends object>(opener: Parser<T, any, C>, parser: Parser<T, D, C>, optional = false): Parser<T, D, C> {
  return (lmr_, context) => {
    if (lmr_ === '') return;
    const [rl = [], mr_ = lmr_] = opener(lmr_, context) || [];
    assert(lmr_.endsWith(mr_));
    if (mr_.length === lmr_.length) return;
    assert(rl.length === 1);
    const [rm = [], r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
    assert(mr_.endsWith(r_));
    if (r_.length === mr_.length) return optional ? [rl, mr_] : void 0;
    rl.length > 0 && void rm.unshift(...rl);
    return r_.length < lmr_.length
      ? [rm, r_]
      : void 0;
  };
}
export function close<P extends Parser<unknown, any, object>>(parser: P, closer: Parser<Data<P>, any, Context<P>>, f?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, any, Context<P>>, g?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, any, Context<P>>): P;
export function close<P extends Parser<unknown, any, object>>(parser: P, closer: Parser<Data<P>, any, Context<P>>, keepSymbols?: boolean, optional?: boolean, f?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, any, Context<P>>, g?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, any, Context<P>>): P;
//export function close<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: Parser<T, any, C>, f?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>, g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C>;
//export function close<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: Parser<T, any, C>, keepSymbols?: boolean, f?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>, g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C>;
export function close<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: Parser<T, any, C>, keepSymbols: ((rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>) | boolean = false, optional: ((rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>) | boolean = false, f?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>, g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C> {
  if (typeof keepSymbols === 'function' || typeof optional === 'function') return close(parser, closer as any, void 0, void 0, keepSymbols as any, optional as any);
  return (source, context) => {
    const [rs = [], r_ = source] = parser(source, context) || [];
    assert(source.endsWith(r_));
    if (!optional && r_.length === source.length) return;
    const [rr = [], rest = r_] = r_ !== '' && closer(r_, context) || [];
    assert(r_.endsWith(rest));
    if (rest.length === source.length) return;
    if (rest.length === r_.length) return g ? g(rs, rest, source, context) : void 0;
    assert(rr.length === 1);
    !keepSymbols && rs.length > 0 && void rs.shift();
    keepSymbols && rr.length > 0 && void push(rs, rr);
    return f
      ? f(rs, rest, source, context)
      : [rs, rest];
  };
}

export function open_<T, D extends Parser<unknown, any, C>[], C extends object>(opener: Parser<T, any, C>, parser: Parser<T, D, C>, optional = false): Parser<T[], D, C> {
  return (lmr_, context) => {
    if (lmr_ === '') return;
    const [rl = [], mr_ = lmr_] = opener(lmr_, context) || [];
    assert(lmr_.endsWith(mr_));
    if (mr_.length === lmr_.length) return;
    const [rm = [], r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
    assert(mr_.endsWith(r_));
    return r_.length < mr_.length
      ? [[rl, rm], r_]
      : optional
        ? [[rl], mr_]
        : void 0;
  };
}
export function close_<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T[], D, C>, closer: Parser<T, any, C>, f: (rs: [T[], T[], T[]], rest: string, source: string, context: C) => Result<U, any, C>, g: (rs: [T[], T[]?], rest: string, source: string, context: C) => Result<U, any, C>): Parser<U, D, C>;
export function close_<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T[], D, C>, closer: Parser<T, any, C>, f?: (rs: [T[], T[], T[]], rest: string, source: string, context: C) => Result<T | U, any, C>, g?: (rs: [T[], T[]?], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C>;
export function close_<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T[], D, C>, closer: Parser<T, any, C>, f?: (rs: [T[], T[], T[]], rest: string, source: string, context: C) => Result<T | U, any, C>, g?: (rs: [T[], T[]?], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C> {
  return bind<T | U, Parser<T[], D, C>>(parser, (rs, r_, source, context) => {
    const [rr = [], rest = r_] = r_ !== '' && closer(r_, context) || [];
    assert(r_.endsWith(rest));
    return rest.length < r_.length
      ? f
        ? f([rs[0], rs[1] || [], rr], rest, source, context)
        : [push(unshift(rs[0], rs[1] || []), rr), rest]
      : g
        ? g(rs as T[][] as [T[]], r_, source, context)
        : void 0;
  });
}

export function when<T, S extends readonly T[], U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, cond: (rs: readonly T[], rest: string, source: string, context: C) => rs is S, f: (rs: S, rest: string, source: string, context: C) => Result<T | U, any, C>, g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C> {
  return bind<T | U, Parser<T, D, C>>(parser, (rs, rest, source, context) =>
    cond(rs, rest, source, context)
      ? f(rs, rest, source, context)
      : g
        ? g(rs, rest, source, context)
        : [rs, rest]);
}
export function clear<D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<unknown, D, C>): Parser<never, D, C> {
  return fmap<never, Parser<unknown, D, C>>(parser, () => []);
}
