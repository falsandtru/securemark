import { Parser, List, Data, Ctx } from '../../data/parser';
import { fmap } from '../monad/fmap';

export function dup<N, C extends Ctx, D extends Parser<unknown, C>[]>(parser: Parser<N, C, D>): Parser<List<Data<N>>, C, D>;
export function dup<N>(parser: Parser<N>): Parser<List<Data<N>>> {
  return fmap(parser, nodes => new List([new Data(nodes)]));
}
