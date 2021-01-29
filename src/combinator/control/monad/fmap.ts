import { Parser, Ctx, SubParsers, Data, Context, IntermediateParser, SubData } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (rs: SubData<P>[], rest: string, context: Context<P>) => Data<P>[]): P;
export function fmap<P extends Parser<unknown>>(parser: P, f: (rs: Data<P>[], rest: string, context: Context<P>) => Data<P>[]): P;
export function fmap<T, P extends Parser<unknown>>(parser: Parser<T, SubParsers<P>, Context<P>>, f: (rs: T[], rest: string, context: Context<P>) => Data<P>[]): P;
export function fmap<U, P extends Parser<unknown>>(parser: P, f: (rs: Data<P>[], rest: string, context: Context<P>) => U[]): Parser<U, SubParsers<P>, Context<P>>;
export function fmap<T, U>(parser: Parser<T>, f: (rs: T[], rest: string, context: Ctx) => U[]): Parser<U> {
  return bind(parser, (rs, r, context) => [f(rs, r, context), r]);
}
