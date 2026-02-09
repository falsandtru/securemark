import { Parser, Input, Result, Node, Context } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (input: Input<Context<P>>, reason: unknown) => Result<Node<P>>): P;
export function recover<N>(parser: Parser<N>, fallback: (input: Input, reason: unknown) => Result<N>): Parser<N> {
  return input => {
    try {
      return parser(input);
    }
    catch (reason) {
      assert(reason instanceof Error && reason.name === 'AssertionError' && !+console.error(reason) && eval(`throw new Error("${reason.name}")`) || 1);
      return fallback(input, reason);
    }
  };
}
