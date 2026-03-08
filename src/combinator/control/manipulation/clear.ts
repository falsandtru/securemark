import { Parser, List, Context } from '../../data/parser';

export function clear<D extends Parser<unknown, C>[], C extends Context>(parser: Parser<unknown, C, D>): Parser<never, C, D> {
  return input => parser(input) && new List();
}
