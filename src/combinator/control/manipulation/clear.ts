import { Parser, CtxOptions } from '../../data/parser';


export function clear<D extends Parser<unknown, C>[], C extends CtxOptions>(parser: Parser<unknown, C, D>): Parser<never, C, D> {
  return input => parser(input) && [[]];
}
