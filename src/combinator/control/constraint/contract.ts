import { Parser, Data, eval, exec, check } from '../../data/parser';

export function contract<P extends Parser<unknown, any, object, object>>(pattern: RegExp | string, parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function contract<T, D extends Parser<unknown, any, object, object>[]>(pattern: RegExp | string, parser: Parser<T, D, object, object>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, D, object, object> {
  return verify(validate(pattern, parser), cond);
}

export function validate<P extends Parser<unknown, any, object, object>>(pattern: RegExp | string, parser: P): P;
export function validate<T, D extends Parser<unknown, any, object, object>[]>(pattern: RegExp | string, parser: Parser<T, D, object, object>): Parser<T, D, object, object> {
  assert(pattern instanceof RegExp ? !pattern.global && pattern.source.startsWith('^') : true);
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    switch (typeof pattern) {
      case 'string':
        if (source.startsWith(pattern)) break;
        return;
      default:
        if (pattern.test(source)) break;
        return;
    }
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return;
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}

export function verify<P extends Parser<unknown, any, object, object>>(parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function verify<T, D extends Parser<unknown, any, object, object>[]>(parser: Parser<T, D, object, object>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, D, object, object> {
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
