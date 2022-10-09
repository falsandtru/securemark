import { Parser, Ctx, Tree, Context, SubParsers, SubTree } from '../parser';

export function union<P extends Parser<unknown>>(parsers: SubParsers<P>): SubTree<P> extends Tree<P> ? P : Parser<SubTree<P>, Context<P>, SubParsers<P>>;
export function union<T, D extends Parser<T>[]>(parsers: D): Parser<T, Ctx, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return eval([
        'input =>',
        parsers.map((_, i) => `|| parsers[${i}](input)`).join('').slice(2),
      ].join(''));
  }
}
