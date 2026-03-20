import { Parser, Context } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser>(parsers: Parser.SubParsers<P>, delimitation?: boolean): Parser.SubNode<P> extends Parser.Node<P> ? P : Parser<Parser.SubNode<P>, Parser.Context<P>, Parser.SubParsers<P>>;
export function tails<N, D extends Parser<N>[]>(parsers: D, delimitation?: boolean): Parser<N, Context, D> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i), delimitation)) as D);
}
