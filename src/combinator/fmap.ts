import { Parser, Data, SubData, SubParser } from './parser';
import { transform } from './transform';

export function fmap<P extends Parser<any, any>>(parser: SubParser<P>, f: (rs: SubData<P>[]) => Data<P>[]): P;
export function fmap<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[]) => U[]): Parser<U, S>;
export function fmap<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[]) => U[]): Parser<U, S> {
  return transform(parser, (rs, r) => [f(rs), r]);
}
