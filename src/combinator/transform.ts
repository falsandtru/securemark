import { Parser, Result } from './parser';

export function transform<R, S, P extends Parser<any, any>[]>(parser: Parser<R, P>, f: (rs: R[], rest: string) => Result<S, P>): Parser<S, P> {
  return (source: string): Result<S, P> => {
    const [rs, rest = undefined] = parser(source) || [[]];
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
