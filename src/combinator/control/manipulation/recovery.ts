import { Parser, Input, Result, Tree, Context } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (input: Input<Context<P>>, reason: unknown) => Result<Tree<P>>): P;
export function recover<T>(parser: Parser<T>, fallback: (input: Input, reason: unknown) => Result<T>): Parser<T> {
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
