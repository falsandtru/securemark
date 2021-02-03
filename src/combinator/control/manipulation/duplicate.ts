import { Parser, Ctx, Data, SubParsers, Context } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function dup<P extends Parser<unknown[]>>(parser: Parser<Data<P>[number], SubParsers<P>, Context<P>>): P;
export function dup<T, D extends Parser<unknown, any, C>[], C extends Ctx>(parser: Parser<T, D, C>): Parser<T[], D, C>;
export function dup<T>(parser: Parser<T>): Parser<T[]> {
  return fmap(parser, ns => [ns]);
}
