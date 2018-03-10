import { Parser, Result } from './parser';

export function transform<S extends Parser<any, any>[], T, U>(parser: Parser<T, S>, f: (rs: T[], rest: string) => Result<U, S>): Parser<U, S> {
  return source => {
    const [rs = [], rest = undefined] = parser(source) || [];
    if (rest === undefined) return;
    assert(source.slice(1).endsWith(rest));
    if (rest.length >= source.length) return;
    const result = f(rs, rest);
    assert(!result || rest.endsWith(result[1]));
    return result && result[1].length <= rest.length
      ? result
      : undefined;
  };
}
