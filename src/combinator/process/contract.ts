import { Parser, Result, Input, Output } from '../parser';
import { always } from '../control/state';
import { tester } from '../delimiter';

export function contract<P extends Parser>(patterns: string | RegExp, parser: P, cond: (input: Parser.Input<P>, output: Output<Parser.Node<P>>) => boolean): P;
export function contract<P extends Parser>(precond: (input: Parser.Input<P>, output: Output<Parser.Node<P>>) => boolean, parser: P, postcond: (input: Parser.Input<P>, output: Output<Parser.Node<P>>) => boolean): P;
export function contract<T>(precond: string | RegExp | ((input: Input, output: Output<T>) => boolean), parser: Parser<T>, postcond: (input: Input, output: Output<T>) => boolean): Parser<T> {
  if (typeof precond !== 'function') {
    precond = tester(precond, false);
  }
  return validate(precond, verify(parser, postcond));
}

export function validate<P extends Parser>(pattern: string | RegExp, parser: P): P;
export function validate<P extends Parser>(cond: (input: Parser.Input<P>, output: Output<Parser.Node<P>>) => boolean, parser: P): P;
export function validate<T>(cond: string | RegExp | ((input: Input, output: Output<T>) => boolean), parser: Parser<T>): Parser<T> {
  if (typeof cond !== 'function') {
    cond = tester(cond, false);
  }
  return always([
    (input, output) =>
      output.state && cond(input, output) ? output.context : Result.skip,
    parser,
  ]);
}

export function verify<P extends Parser>(parser: P, cond: (input: Parser.Input<P>, output: Output<Parser.Node<P>>) => boolean): P;
export function verify<T>(parser: Parser<T>, cond: (input: Input, output: Output<T>) => boolean): Parser<T> {
  assert(parser);
  return always([
    parser,
    (input, output) =>
      output.state && cond(input, output) ? output.context : Result.fail,
  ]);
}
