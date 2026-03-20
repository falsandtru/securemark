import { Parser, List, Node, Context, failsafe } from '../parser';

export function sequence<P extends Parser>(parsers: Parser.SubParsers<P>, delimitation?: boolean): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function sequence<N, D extends Parser<N>[]>(parsers: D, delimitation = false): Parser<N, Context, D> {
  assert(parsers.every(f => f));
  if (parsers.length === 1) return parsers[0];
  return failsafe(input => {
    const context = input;
    const { source } = context;
    let nodes: List<Node<N>> | undefined;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (context.position === source.length) return;
      if (delimitation && context.delimiters.test(input)) return;
      const result = parsers[i](input);
      if (result === undefined) return;
      nodes = nodes?.import(result) ?? result;
    }
    return nodes;
  });
}
