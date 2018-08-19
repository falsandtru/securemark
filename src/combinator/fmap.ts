﻿import { Parser, Data, SubData, SubParser, BaseParser } from './parser';
import { bind } from './bind';

export function fmap<P extends Parser<any, any>>(parser: SubParser<P>, f: (rs: SubData<P>[]) => Data<P>[]): P;
export function fmap<T, P extends Parser<any, any>>(parser: BaseParser<T, P>, f: (rs: T[]) => Data<P>[]): P;
export function fmap<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[]) => U[]): Parser<U, S>;
export function fmap<T, U, S extends Parser<any, any>[]>(parser: Parser<T, S>, f: (rs: T[]) => U[]): Parser<U, S> {
  return bind(parser, (rs, r) => [f(rs), r]);
}
