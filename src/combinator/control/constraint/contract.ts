import { Parser, Data, eval, exec, check } from '../../data/parser';

export function contract<P extends Parser<unknown, any>>(pattern: RegExp | string, parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function contract<T, S extends Parser<unknown, any>[]>(pattern: RegExp | string, parser: Parser<T, S>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, S> {
  return verify(validate(pattern, parser), cond);
}

export function validate<P extends Parser<unknown, any>>(pattern: RegExp | string, parser: P): P;
export function validate<T, S extends Parser<unknown, any>[]>(pattern: RegExp | string, parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    if (typeof pattern === 'string' ? !source.startsWith(pattern) : !source.match(pattern)) return;
    const result = parser(source);
    assert(check(source, result));
    if (!result) return;
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}

export function verify<P extends Parser<unknown, any>>(parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function verify<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const result = parser(source);
    assert(check(source, result));
    if (!result) return;
    if (!cond(eval(result), exec(result))) return;
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}
