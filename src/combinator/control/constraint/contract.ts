import { Parser, Data, eval, exec, check } from '../../data/parser';

export function contract<P extends Parser<unknown, any, object>>(pattern: RegExp | string, parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function contract<T, S extends Parser<unknown, any, object>[]>(pattern: RegExp | string, parser: Parser<T, S, object>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, S, object> {
  return verify(validate(pattern, parser), cond);
}

export function validate<P extends Parser<unknown, any, object>>(pattern: RegExp | string, parser: P): P;
export function validate<T, S extends Parser<unknown, any, object>[]>(pattern: RegExp | string, parser: Parser<T, S, object>): Parser<T, S, object> {
  assert(pattern instanceof RegExp ? !pattern.global && pattern.source.startsWith('^') : true);
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    if (typeof pattern === 'string' ? !source.startsWith(pattern) : !pattern.test(source)) return;
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return;
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}

export function verify<P extends Parser<unknown, any, object>>(parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function verify<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, S, object> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return;
    if (!cond(eval(result), exec(result))) return;
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}
