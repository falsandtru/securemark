import { Parser, CtxOptions, Node, Context, SubParsers, SubNode } from '../parser';

export function union<P extends Parser<unknown>>(parsers: SubParsers<P>): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function union<N, D extends Parser<N>[]>(parsers: D): Parser<N, CtxOptions, D> {
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
