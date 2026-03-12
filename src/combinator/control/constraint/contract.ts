import { Parser, Input, List, Node, Context } from '../../data/parser';
import { tester, bind } from '../../../combinator';

//export function contract<P extends Parser>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (nodes: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<N>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<N>, cond: (nodes: readonly N[], rest: string) => boolean): Parser<N> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser>(pattern: string | RegExp, parser: P): P;
export function validate<P extends Parser>(cond: ((input: Input<Parser.Context<P>>) => boolean), parser: P): P;
export function validate<N>(pattern: string | RegExp | ((input: Input<Context>) => boolean), parser: Parser<N>): Parser<N> {
  if (typeof pattern === 'function') return guard(pattern, parser);
  const test = tester(pattern, false);
  return input => test(input) && parser(input);
}

function guard<P extends Parser>(f: (input: Input<Parser.Context<P>>) => boolean, parser: P): P;
function guard<N>(f: (input: Input<Context>) => boolean, parser: Parser<N>): Parser<N> {
  return input => f(input) ? parser(input) : undefined;
}

export function verify<P extends Parser>(parser: P, cond: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>) => boolean): P;
export function verify<N>(parser: Parser<N>, cond: (nodes: List<Node<N>>, context: Context) => boolean): Parser<N> {
  assert(parser);
  return bind(parser, (nodes, context) => cond(nodes, context) ? nodes : undefined)
}
