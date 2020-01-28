import { isArray } from 'spica/alias';
import { Parser, Data, Config, eval, exec, check } from '../../data/parser';

export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
export function contract<T, D extends Parser<unknown>[]>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T, D>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, D> {
  return verify(validate(patterns, parser), cond);
}

export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P): P;
export function validate<T, D extends Parser<unknown>[]>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T, D>): Parser<T, D> {
  if (!isArray(patterns)) return validate([patterns], parser);
  assert(patterns.some(pattern => pattern instanceof RegExp ? !pattern.global && pattern.source.startsWith('^') : true));
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    if (patterns.every(pattern => !match(source, pattern))) return;
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return;
    return exec(result).length < source.length
      ? result
      : void 0;
  };

  function match(source: string, pattern: string | RegExp): boolean {
    switch (typeof pattern) {
      case 'string':
        return source.startsWith(pattern);
      default:
        return pattern.test(source);
    }
  }
}

export function verify<P extends Parser<unknown>>(parser: P, cond: (results: readonly Data<P>[], rest: string, config: Config<P>) => boolean): P;
export function verify<T, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>, cond: (results: readonly T[], rest: string, config: C) => boolean): Parser<T, D, S, C> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return;
    if (!cond(eval(result), exec(result), config)) return;
    return exec(result).length < source.length
      ? result
      : void 0;
  };
}
