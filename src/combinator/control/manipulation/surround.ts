import { Parser, Result, Ctx, Data, SubParsers, Context, SubData, IntermediateParser, eval, exec } from '../../data/parser';
import { fmap } from '../monad/fmap';
import { unshift, push } from 'spica/array';

export function surround<P extends Parser<unknown>, S = Data<P>>(
  opener: string | RegExp | Parser<S, any, Context<P>>, parser: P, closer: string | RegExp | Parser<S, any, Context<P>>, optional?: false,
  f?: (rss: [S[], SubData<P>[], S[]], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
  g?: (rss: [S[], SubData<P>[]], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
): P;
export function surround<P extends Parser<unknown>, S = Data<P>>(
  opener: string | RegExp | Parser<S, any, Context<P>>, parser: P, closer: string | RegExp | Parser<S, any, Context<P>>, optional?: boolean,
  f?: (rss: [S[], SubData<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
  g?: (rss: [S[], SubData<P>[] | undefined], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
): P;
export function surround<P extends Parser<unknown>, S = Data<P>>(
  opener: string | RegExp | Parser<S, any, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, any, Context<P>>, optional?: false,
  f?: (rss: [S[], SubData<P>[], S[]], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
  g?: (rss: [S[], SubData<P>[]], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
): P;
export function surround<P extends Parser<unknown>, S = Data<P>>(
  opener: string | RegExp | Parser<S, any, Context<P>>, parser: IntermediateParser<P>, closer: string | RegExp | Parser<S, any, Context<P>>, optional?: boolean,
  f?: (rss: [S[], SubData<P>[] | undefined, S[]], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
  g?: (rss: [S[], SubData<P>[] | undefined], rest: string, context: Context<P>) => Result<Data<P>, SubParsers<P>, Context<P>>,
): P;
export function surround<T, D extends Parser<unknown>[]>(
  opener: string | RegExp | Parser<T, any>, parser: Parser<T, D>, closer: string | RegExp | Parser<T, any>, optional: boolean = false,
  f?: (rss: [T[], T[], T[]], rest: string, context: Ctx) => Result<T, D, Ctx>,
  g?: (rss: [T[], T[]], rest: string, context: Ctx) => Result<T, D, Ctx>,
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
    const res1 = opener(lmr_, context);
    if (!res1) return;
    const rl = eval(res1);
    const mr_ = exec(res1);
    assert(lmr_.endsWith(mr_));
    const res2 = mr_ !== '' ? parser(mr_, context) : void 0;
    const rm = res2 && eval(res2);
    const r_ = exec(res2, mr_);
    assert(mr_.endsWith(r_));
    if (!res2 && !optional) return;
    const res3 = closer(r_, context);
    const rr = res3 && eval(res3);
    const rest = exec(res3, r_);
    if (rest.length === lmr_.length) return;
    assert(r_.endsWith(rest));
    return rr
      ? f
        ? f([rl, rm!, rr], rest, context)
        : [rm ? push(unshift(rl, rm), rr) : push(rl, rr), rest]
      : g
        ? g([rl, rm!], rest, context)
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
export function open<T, D extends Parser<unknown, any, C>[], C extends object>(opener: string | RegExp | Parser<T, any, C>, parser: Parser<T, D, C>, optional = false): Parser<T, D, C> {
  return surround(opener, parser, '', optional);
}
export function close<P extends Parser<unknown, any, object>>(parser: P, closer: string | RegExp | Parser<Data<P>, any, Context<P>>, optional?: boolean): P;
export function close<T, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>, closer: string | RegExp | Parser<T, any, C>, optional: boolean = false): Parser<T, D, C> {
  return surround('', parser, closer, optional);
}

export function clear<D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<unknown, D, C>): Parser<never, D, C> {
  return fmap<never, Parser<unknown, D, C>>(parser, () => []);
}
