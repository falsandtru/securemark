import { Parser, Data, SubData, SubParser } from '../../data/parser';
import { proc } from './proc';

export function bind<P extends Parser<unknown, any>>(parser: SubParser<P>, f: (rs: SubData<P>[]) => Data<P>[] | undefined): P;
export function bind<T, U, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, f: (rs: T[]) => U[] | undefined): Parser<U, S>;
export function bind<T, U, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, f: (rs: T[]) => U[] | undefined): Parser<U, S> {
  return proc(parser, (rs, rest) => {
    const result = f(rs);
    return result && [result, rest];
  });
}
