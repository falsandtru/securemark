import { Parser, Result, Ctx } from '../../data/parser';

export function recover<T, C extends Ctx, D extends Parser<unknown, C>[]>(parser: Parser<T, C, D> | Parser<T, C, [...Parser<never, C>[], Parser<T, C, D>]>, fallback: (source: string, context: C, reason: unknown) => Result<T, C, D>): Parser<T, C, D>;
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
