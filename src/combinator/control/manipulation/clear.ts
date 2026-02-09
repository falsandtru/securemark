import { Parser, Ctx } from '../../data/parser';
import { fmap } from '../monad/fmap';


export function clear<D extends Parser<unknown, C>[], C extends Ctx>(parser: Parser<unknown, C, D>): Parser<never, C, D> {
  return fmap<never, Parser<unknown, C, D>>(parser, () => []);
}
