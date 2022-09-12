import { undefined } from 'spica/global';
import { Parser, Ctx, Tree, Context, SubParsers, SubTree } from '../parser';

export function union<P extends Parser<unknown>>(parsers: SubParsers<P>): SubTree<P> extends Tree<P> ? P : Parser<SubTree<P>, Context<P>, SubParsers<P>>;
export function union<T, D extends Parser<T>[]>(parsers: D): Parser<T, Ctx, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    case 2:
      return input => parsers[0](input) ?? parsers[1](input);
    case 3:
      return input => parsers[0](input) ?? parsers[1](input) ?? parsers[2](input);
    default:
      return input => {
        for (let i = 0; i < parsers.length; ++i) {
          const parser = parsers[i];
          const result = parser(input);
          if (result) return result;
        }
      };
  }
}
