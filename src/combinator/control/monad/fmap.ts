import { Parser, SubParsers, Data, State, Config, IntermediateParser, SubData } from '../../data/parser';
import { bind } from './bind';

export function fmap<P extends Parser<unknown>>(parser: IntermediateParser<P>, f: (rs: SubData<P>[], state: State<P>, config: Config<P>) => Data<P>[]): P;
export function fmap<U, P extends Parser<unknown>>(parser: P, f: (rs: Data<P>[], state: State<P>, config: Config<P>) => U[]): Parser<U, SubParsers<P>, State<P>, Config<P>>;
export function fmap<T, U, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>, f: (rs: T[], state: S, config: C) => U[]): Parser<U, D, S, C> {
  return bind(parser, (rs, r, state, config) => [f(rs, state, config), r]);
}
