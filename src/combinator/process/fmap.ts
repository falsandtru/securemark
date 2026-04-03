import { Parser, Input, Output, List, Node } from '../parser';
import { bind } from './bind';

export function fmap<P extends Parser>(parser: Parser.IntermediateParser<P>, f: (nodes: List<Node<Parser.SubNode<P>>>, input: Parser.Input<P>, output: Output<Parser.Node<P>>) => List<Node<Parser.Node<P>>>): P;
export function fmap<P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, input: Parser.Input<P>, output: Output<Parser.Node<P>>) => List<Node<Parser.Node<P>>>): P;
export function fmap<T, P extends Parser>(parser: Parser<T, Parser.Input<P>, Parser.SubParsers<P>>, f: (nodes: List<Node<T>>, input: Parser.Input<P>, output: Output<Parser.Node<P>>) => List<Node<Parser.Node<P>>>): P;
export function fmap<U, P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, input: Parser.Input<P>, output: Output<Parser.Node<P>>) => List<Node<U>>): Parser<U, Parser.Input<P>, Parser.SubParsers<P>>;
export function fmap<T>(parser: Parser<T>, f: (nodes: List<Node<T>>, input: Input, output: Output<T>) => List<Node<T>>): Parser<T> {
  return bind(parser, (nodes, input, output) => f(nodes, input, output));
}
