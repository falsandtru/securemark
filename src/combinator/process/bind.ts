import { Parser, Result, Input, Output, List, Node } from '../parser';
import { always } from '../control/state';

type ResultM<T> = List<Node<T>> | undefined;

export function bind<P extends Parser>(parser: Parser.IntermediateParser<P>, f: (nodes: List<Node<Parser.SubNode<P>>>, Input: Parser.Input<P>, output: Output<Parser.Node<P>>) => ResultM<Parser.Node<P>>): P;
export function bind<P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, Input: Parser.Input<P>, output: Output<Parser.Node<P>>) => ResultM<Parser.Node<P>>): P;
export function bind<T, P extends Parser>(parser: Parser<T, Parser.Input<P>, Parser.SubParsers<P>>, f: (nodes: List<Node<T>>, Input: Parser.Input<P>, output: Output<Parser.Node<P>>) => ResultM<Parser.Node<P>>): P;
export function bind<U, P extends Parser>(parser: P, f: (nodes: List<Node<Parser.Node<P>>>, Input: Parser.Input<P>, output: Output<Parser.Node<P>>) => ResultM<U>): Parser<U, Parser.Input<P>, Parser.SubParsers<P>>;
export function bind<T>(parser: Parser<T>, f: (nodes: List<Node<T>>, Input: Input, output: Output<T>) => ResultM<T>): Parser<T> {
  assert(parser);
  interface Memory {
    readonly position: number;
  }
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      input.memory = {
        position: input.position,
      };
      output.push();
      return output.context;
    },
    parser,
    (input, output) => {
      const nodes = output.pop();
      if (!output.state) return;
      input.range = input.position - input.memory.position;
      const result = f(nodes, input, output);
      return result
        ? output.import(result)
        : Result.fail;
    },
  ]);
}
