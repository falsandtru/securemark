import { Parser, List, Node, Context } from '../parser';

export function inits<P extends Parser>(parsers: Parser.SubParsers<P>, resume?: (nodes: List<Node<Parser.SubNode<P>>>) => boolean): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function inits<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: List<Node<N>>) => boolean): Parser<N, Context, D> {
  assert(parsers.every(f => f));
  if (parsers.length === 1) return parsers[0];
  return input => {
    const { context } = input;
    const { source } = context;
    let nodes: List<Node<N>> | undefined;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (context.position === source.length) break;
      if (context.delimiters?.match(input)) break;
      const result = parsers[i](input);
      if (result === undefined) break;
      nodes = nodes?.import(result) ?? result;
      if (resume?.(result) === false) break;
    }
    return nodes;
  };
}
