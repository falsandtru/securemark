import { Parser, Result, Ctx } from '../../data/parser';

export function recover<T, D extends Parser<unknown, any, C>[], C extends Ctx>(parser: Parser<T, D, C> | Parser<T, [...Parser<never, any, C>[], Parser<T, D, C>], C>, fallback: (source: string, context: C, reason: unknown) => Result<T, D, C>): Parser<T, D, C>;
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
