import { Parser, Result } from './parser';

export function transform<R, S, P extends Parser<any, any>[]>(parser: Parser<R, P>, f: (rs: R[], rest: string) => Result<S, P>): Parser<S, P> {
  return (source: string): Result<S, P> => {
    const [rs, rest] = parser(source) || [[], source];
    if (rest === source) return;
    const result = f(rs, rest);
    if (!result || !rest.endsWith(result[1])) return;
    return result;
  };
}
