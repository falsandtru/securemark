import { Parser, CtxOptions, Node, Context, SubParsers, SubNode } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser<unknown>>(parsers: SubParsers<P>, resume?: (nodes: SubNode<P>[]) => boolean): SubNode<P> extends Node<P> ? P : Parser<SubNode<P>, Context<P>, SubParsers<P>>;
export function tails<N, D extends Parser<N>[]>(parsers: D, resume?: (nodes: N[]) => boolean): Parser<N, CtxOptions, D> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i), resume)) as D);
}
