import { Parser, Result, Data, SubParsers, Config } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (source: string, config: Config<P>, reason: unknown) => Result<Data<P>, SubParsers<P>>): P;
export function recover<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, fallback: (source: string, config: object, reason: unknown) => Result<Data<Parser<T, D>>, SubParsers<Parser<T, D>>>): Parser<T, D> {
  return (source, config) => {
    try {
      return parser(source, config);
    }
    catch (reason) {
      assert(reason instanceof Error && reason.name === 'AssertionError' && !+console.error(reason) && eval(`throw new Error("${reason.name}")`) || 1);
      return fallback(source, config, reason);
    }
  };
}
