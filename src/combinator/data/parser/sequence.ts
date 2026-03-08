import { Parser, List, Data, Ctx, Node, Context, SubParsers, SubNode } from '../parser';

export function sequence<P extends Parser>(parsers: SubParsers<P>, resume?: (nodes: List<Data<SubNode<P>>>) => boolean): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function sequence<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: List<Data<N>>) => boolean): Parser<N, Ctx, D> {
  assert(parsers.every(f => f));
  if (parsers.length === 1) return parsers[0];
  return input => {
    const { context } = input;
    const { source } = context;
    let nodes: List<Data<N>> | undefined;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (context.position === source.length) return;
      if (context.delimiters?.match(input)) return;
      const result = parsers[i](input);
      if (result === undefined) return;
      nodes = nodes?.import(result) ?? result;
      if (resume?.(result) === false) return;
    }
    return nodes;
  };
}
