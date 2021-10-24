import { Parser, Result, Ctx, Tree, Context } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (source: string, context: Context<P>, reason: unknown) => Result<Tree<P>>): P;
export function recover<T>(parser: Parser<T>, fallback: (source: string, context: Ctx, reason: unknown) => Result<T>): Parser<T> {
  return (source, context) => {
    try {
      return parser(source, context);
    }
    catch (reason) {
      assert(reason instanceof Error && reason.name === 'AssertionError' && !+console.error(reason) && eval(`throw new Error("${reason.name}")`) || 1);
      return fallback(source, context, reason);
    }
  };
}
