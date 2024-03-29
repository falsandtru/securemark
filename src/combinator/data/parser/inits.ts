import { Parser, Ctx, Tree, Context, SubParsers, SubTree, eval, exec, check } from '../parser';
import { push } from 'spica/array';

export function inits<P extends Parser<unknown>>(parsers: SubParsers<P>, resume?: (nodes: SubTree<P>[], rest: string) => boolean): SubTree<P> extends Tree<P> ? P : Parser<SubTree<P>, Context<P>, SubParsers<P>>;
export function inits<T, D extends Parser<T>[]>(parsers: D, resume?: (nodes: T[], rest: string) => boolean): Parser<T, Ctx, D> {
  assert(parsers.every(f => f));
  if (parsers.length === 1) return parsers[0];
  return ({ source, context }) => {
    let rest = source;
    let nodes: T[] | undefined;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (rest === '') break;
      if (context.delimiters?.match(rest, context.precedence)) break;
      const result = parsers[i]({ source: rest, context });
      assert(check(rest, result, false));
      if (result === undefined) break;
      nodes = nodes
        ? push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (resume?.(eval(result), exec(result)) === false) break;
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
