import { Parser, Data, SubParser, SubData } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: SubParser<P>, f: (rs: SubData<P>[]) => Data<P>[]): P;
export function fmap<T, U, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>, f: (rs: T[]) => U[]): Parser<U, D, C, S>;
export function fmap<T, U, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>, f: (rs: T[]) => U[]): Parser<U, D, C, S> {
  return bind(parser, (rs, r, c) => [f(rs), r, c]);
}
