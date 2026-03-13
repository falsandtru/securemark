import { Parser, Input, Result, Context } from '../../data/parser';

export function recover<P extends Parser>(parser: P, catcher: (input: Input<Parser.Context<P>>, reason: unknown) => Result<Parser.Node<P>>): P;
export function recover<N>(parser: Parser<N>, catcher: (input: Input<Context>, reason: unknown) => Result<N>): Parser<N> {
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
      return catcher(input, reason);
    }
  };
}
