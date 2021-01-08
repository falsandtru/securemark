import { Parser, Result, Ctx, Data, SubParsers, Context } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (source: string, context: Context<P>, reason: unknown) => Result<Data<P>, SubParsers<P>>): P;
export function recover<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, fallback: (source: string, context: Ctx, reason: unknown) => Result<T, D>): Parser<T, D> {
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
