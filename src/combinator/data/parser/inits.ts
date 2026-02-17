import { Parser, CtxOptions, Node, Context, SubParsers, SubNode, eval, Ctx } from '../parser';
import { push } from 'spica/array';

export function inits<P extends Parser<unknown, Ctx>>(parsers: SubParsers<P>, resume?: (nodes: SubNode<P>[]) => boolean): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function inits<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: N[]) => boolean): Parser<N, CtxOptions, D> {
  assert(parsers.every(f => f));
  if (parsers.length === 1) return parsers[0];
  return input => {
    const { context } = input;
    const { source, position } = context;
    let nodes: N[] | undefined;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (context.position === source.length) break;
      if (context.delimiters?.match(context)) break;
      const result = parsers[i](input);
      if (result === undefined) break;
      nodes = nodes
        ? push(nodes, eval(result))
        : eval(result);
      if (resume?.(eval(result)) === false) break;
    }
    assert(context.position >= position);
    return nodes && context.position > position
      ? [nodes]
      : undefined;
  };
}
