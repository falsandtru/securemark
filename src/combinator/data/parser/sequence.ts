import { Parser, Ctx, Node, Context, SubParsers, SubNode, eval, exec, check } from '../parser';
import { push } from 'spica/array';

export function sequence<P extends Parser<unknown>>(parsers: SubParsers<P>, resume?: (nodes: SubNode<P>[], rest: string) => boolean): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function sequence<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: N[], rest: string) => boolean): Parser<N, Ctx, D> {
  assert(parsers.every(f => f));
  if (parsers.length === 1) return parsers[0];
  return ({ source, context }) => {
    let rest = source;
    let nodes: N[] | undefined;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (rest === '') return;
      if (context.delimiters?.match(rest, context)) return;
      const result = parsers[i]({ source: rest, context });
      assert(check(rest, result, false));
      if (result === undefined) return;
      nodes = nodes
        ? push(nodes, eval(result))
        : eval(result);
      rest = exec(result);
      if (resume?.(eval(result), exec(result)) === false) return;
    }
    assert(rest.length <= source.length);
    return nodes && rest.length < source.length
      ? [nodes, rest]
      : undefined;
  };
}
