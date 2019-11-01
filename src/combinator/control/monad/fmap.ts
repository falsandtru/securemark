import { Parser, Data, SubParser, SubData } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: SubParser<P>, f: (rs: SubData<P>[]) => Data<P>[]): P;
export function fmap<T, U, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>, f: (rs: T[]) => U[]): Parser<U, D, S, C>;
export function fmap<T, U, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>, f: (rs: T[]) => U[]): Parser<U, D, S, C> {
  return bind(parser, (rs, r, state) => [f(rs), r, state]);
}
