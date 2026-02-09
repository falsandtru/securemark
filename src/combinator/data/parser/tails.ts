import { Parser, Ctx, Node, Context, SubParsers, SubNode } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown>>(parsers: SubParsers<P>, resume?: (nodes: SubNode<P>[], rest: string) => boolean): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function tails<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: N[], rest: string) => boolean): Parser<N, Ctx, D> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i), resume)) as D);
}
