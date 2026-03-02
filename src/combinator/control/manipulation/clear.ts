import { Parser, List, Ctx } from '../../data/parser';

export function clear<D extends Parser<unknown, C>[], C extends Ctx>(parser: Parser<unknown, C, D>): Parser<never, C, D> {
  return input => parser(input) && new List();
}
