import { Parser, Result, Data, SubParsers, Config } from '../../data/parser';

export function recover<P extends Parser<unknown>>(parser: P, fallback: (source: string, config: Config<P>, err: unknown) => Result<Data<P>, SubParsers<P>>): P;
export function recover<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, fallback: (source: string, config: object, err: unknown) => Result<Data<Parser<T, D>>, SubParsers<Parser<T, D>>>): Parser<T, D> {
  return (source, config) => {
    try {
      return parser(source, config);
    }
    catch (err) {
      assert(err instanceof Error && err.name === 'AssertionError' && !+console.error(err) && eval(`throw new Error("${err.name}")`) || 1);
      return fallback(source, config, err);
    }
  };
}
