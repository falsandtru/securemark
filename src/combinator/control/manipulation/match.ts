import { Parser, Result, Data, SubParsers, exec } from '../../data/parser';

export function match<P extends Parser<any, any>>(pattern: RegExp, f: (matched: string[], rest: string) => Result<Data<P>, SubParsers<P>>): P;
export function match<T, S extends Parser<any, any>[] = []>(pattern: RegExp, f: (matched: string[], rest: string) => Result<T, S>): Parser<T, S> {
  return source => {
    if (source === '') return;
    const res = source.match(pattern);
    if (!res) return;
    assert(source.startsWith(res[0]));
    const rest = source.slice(res[0].length);
    const result = f(res, rest);
    if (!result) return;
    assert(rest.endsWith(exec(result)));
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}
