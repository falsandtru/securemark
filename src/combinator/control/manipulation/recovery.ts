import { Parser, Input, Result, Ctx, Node, Context } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (input: Input<Context<P>>, reason: unknown) => Result<Node<P>>): P;
export function recover<N>(parser: Parser<N>, fallback: (input: Input<Ctx>, reason: unknown) => Result<N>): Parser<N> {
  return input => {
    const { context } = input;
    const { source, position } = context;
    try {
      return parser(input);
    }
    catch (reason) {
      assert(reason instanceof Error && reason.name === 'AssertionError' && !+console.error(reason) || 1);
      context.source = source;
      context.position = position;
      return fallback(input, reason);
    }
  };
}
