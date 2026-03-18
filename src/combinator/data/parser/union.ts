import { Parser, Context } from '../parser';

export function union<P extends Parser>(parsers: Parser.SubParsers<P>): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function union<N, D extends Parser<N>[]>(parsers: D): Parser<N, Context, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return eval([
        '(', parsers.map((_, i) => `parser${i},`).join(''), ') =>',
        'input =>',
        parsers.map((_, i) => `|| parser${i}(input)`).join('').slice(2),
      ].join(''))(...parsers);
  }
}
