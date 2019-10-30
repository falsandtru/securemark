import { Parser, Data, SubParser, SubData } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown, any, object>>(parser: SubParser<P>, f: (rs: SubData<P>[]) => Data<P>[]): P;
export function fmap<T, U, S extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, S, C>, f: (rs: T[]) => U[]): Parser<U, S, C>;
export function fmap<T, U, S extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, S, C>, f: (rs: T[]) => U[]): Parser<U, S, C> {
  return bind(parser, (rs, r, c) => [f(rs), r, c]);
}
