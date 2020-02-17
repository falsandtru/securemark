import { Parser, Result, Ctx, Data, SubParsers, Context, IntermediateParser, SubData } from '../../data/parser';
import { fmap } from '../monad/fmap';
import { bind } from '../monad/bind';
import { unshift, push } from 'spica/array';

export function surround<T, U, D extends Parser<unknown, any, C>[], C extends Ctx>(
  opener: string | RegExp | Parser<T, any, C>, parser: Parser<T, D, C>, closer: string | RegExp | Parser<T, any, C>, optional: false,
  f?: (rss: [T[], T[], T[]], rest: string, source: string, context: C) => Result<U, D, C>,
): Parser<U, D, C>;
export function surround<T, U, D extends Parser<unknown, any, C>[], C extends Ctx>(
  opener: string | RegExp | Parser<T, any, C>, parser: Parser<T, D, C>, closer: string | RegExp | Parser<T, any, C>, optional?: boolean,
  f?: (rss: [T[], T[] | undefined, T[]], rest: string, source: string, context: C) => Result<U, D, C>,
): Parser<U, D, C>;
export function surround<P extends Parser<unknown>, S = never>(
  opener: string | RegExp | Parser<S, any, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, any, Context<P>>, optional: false,
  f?: (rss: [S[], SubData<P>[], S[]], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
  g?: (rss: [S[], SubData<P>[]], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
): P;
export function surround<P extends Parser<unknown>, S = never>(
  opener: string | RegExp | Parser<S, any, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, any, Context<P>>, optional?: boolean,
  f?: (rss: [S[], SubData<P>[] | undefined, S[]], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
  g?: (rss: [S[], SubData<P>[] | undefined], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
): P;
export function surround<T, D extends Parser<unknown>[]>(
  opener: string | RegExp | Parser<T, any>, parser: IntermediateParser<Parser<T, D>>, closer: string | RegExp | Parser<T, any>, optional: boolean = false,
  f?: (rss: [T[], T[], T[]], rest: string, source: string, context: Ctx) => Result<T, D, Ctx>,
  g?: (rss: [T[], T[]], rest: string, source: string, context: Ctx) => Result<T, D, Ctx>,
): Parser<T, D> {
  switch (typeof opener) {
    case 'string':
    case 'object':
      // @ts-ignore
      return surround(match(opener), parser, closer, optional, f, g);
  }
  switch (typeof closer) {
    case 'string':
    case 'object':
      // @ts-ignore
      return surround(opener, parser, match(closer), optional, f, g);
  }
  return (lmr_, context) => {
    if (lmr_ === '') return;
    const [rl = [], mr_] = opener(lmr_, context) || [];
    if (mr_ === void 0) return;
    assert(lmr_.endsWith(mr_));
    const [rm, r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
    assert(mr_.endsWith(r_));
    if (!optional && r_.length === mr_.length) return;
    const [rr, rest = r_] = closer(r_, context) || [];
    if (rest.length === lmr_.length) return;
    assert(r_.endsWith(rest));
    return rr
      ? f
        ? f([rl, rm!, rr], rest, lmr_, context)
        : [rm ? push(unshift(rl, rm), rr) : push(rl, rr), rest]
      : g
        ? g([rl, rm!], rest, lmr_, context)
        : void 0;
  };
}

function match(pattern: string | RegExp): (source: string, context: Ctx) => [never[], string] | undefined {
  switch (typeof pattern) {
    case 'string':
      return source => source.slice(0, pattern.length) === pattern ? [[], source.slice(pattern.length)] : void 0;
    case 'object':
      return source => {
        const m = source.match(pattern);
        return m
          ? [[], source.slice(m[0].length)]
          : void 0;
      };
  }
}

export function open<P extends Parser<unknown, any, object>>(opener: string | RegExp | Parser<Data<P>, any, Context<P>>, parser: P, optional?: boolean): P;
//export function open<T, D extends Parser<unknown, any, C>[], C extends object>(opener: string | RegExp | Parser<T, any, C>, parser: Parser<T, D, C>, optional?: boolean): Parser<T, D, C>;
export function open<T, D extends Parser<unknown, any, C>[], C extends object>(opener: string | RegExp | Parser<T, any, C>, parser: Parser<T, D, C>, optional = false): Parser<T, D, C> {
  if (typeof opener === 'string') return open(match(opener), parser, optional);
  if (typeof opener === 'object') return open(match(opener), parser, optional);
  return (source, context) => {
    if (source === '') return;
    const [rl = [], mr_] = opener(source, context) || [];
    if (mr_ === void 0) return;
    assert(source.endsWith(mr_));
    const [rm = [], r_] = mr_ !== '' && parser(mr_, context) || [];
    if (r_ === void 0) return optional && mr_.length < source.length ? [rl, mr_] : void 0;
    assert(mr_.endsWith(r_));
    void unshift(rl, rm);
    return r_.length < source.length
      ? [rm, r_]
      : void 0;
  };
}
export function close<P extends Parser<unknown, any, object>>(parser: P, closer: string | RegExp | Parser<Data<P>, any, Context<P>>, f?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>, g?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, any, Context<P>>): P;
export function close<P extends Parser<unknown, any, object>>(parser: P, closer: string | RegExp | Parser<Data<P>, any, Context<P>>, optional?: boolean, f?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>, g?: (rs: Data<P>[], rest: string, source: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>): P;
//export function close<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: string | RegExp | Parser<T, any, C>, f?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, SubParsers<P>, C>, g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, SubParsers<P>, C>): Parser<T | U, D, C>;
//export function close<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: string | RegExp | Parser<T, any, C>, optional?: boolean, f?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, SubParsers<P>, C>, g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, SubParsers<P>, C>): Parser<T | U, D, C>;
export function close<T, U, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: string | RegExp | Parser<T, any, C>, optional: ((rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>) | boolean = false, f?: ((rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>), g?: (rs: T[], rest: string, source: string, context: C) => Result<T | U, any, C>): Parser<T | U, D, C> {
  if (typeof closer === 'string') return close(parser, match(closer), optional as any, f as any, g as any);
  if (typeof closer === 'object') return close(parser, match(closer), optional as any, f as any, g as any);
  if (typeof optional === 'function') return close(parser, closer as any, void 0, optional as any, f as any);
  return (source, context) => {
    if (source === '') return;
    const [rm = [], r_ = source] = parser(source, context) || [];
    assert(source.endsWith(r_));
    if (!optional && r_.length === source.length) return;
    const [rr = [], rest] = r_ !== '' && closer(r_, context) || [];
    if (rest === void 0) return g ? g(rm, r_, source, context) : void 0;
    assert(r_.endsWith(rest));
    if (rest.length === source.length) return;
    void push(rm, rr);
    return f
      ? f(rm, rest, source, context)
      : [rm, rest];
  };
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
