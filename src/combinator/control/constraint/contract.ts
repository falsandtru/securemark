import { undefined } from 'spica/global';
import { isArray } from 'spica/alias';
import { Parser, Ctx, Data, Context, eval, exec, check } from '../../data/parser';

//export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<T, D extends Parser<unknown>[]>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T, D>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, D> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P): P;
export function validate<T, D extends Parser<unknown>[]>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T, D>): Parser<T, D> {
  if (!isArray(patterns)) return validate([patterns], parser);
  assert(patterns.length > 0);
  assert(patterns.every(pattern => pattern instanceof RegExp ? !pattern.global && pattern.source.startsWith('^') : true));
  assert(parser);
  const matchers = patterns.map<(source: string) => boolean>(pattern =>
    typeof pattern === 'string'
      ? source => source.slice(0, pattern.length) === pattern
      : source => pattern.test(source));
  const match = (source: string) => {
    for (let i = 0, len = matchers.length; i < len; ++i) {
      if (matchers[i](source)) return true;
    }
    return false;
  };
  return (source, context) => {
    if (source === '') return;
    if (!match(source)) return;
    const result = parser(source, context);
    assert(check(source, result));
    if (!result) return;
    assert(exec(result).length < source.length);
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}

export function verify<P extends Parser<unknown>>(parser: P, cond: (results: readonly Data<P>[], rest: string, context: Context<P>) => boolean): P;
export function verify<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, cond: (results: readonly T[], rest: string, context: Ctx) => boolean): Parser<T, D> {
  assert(parser);
  return (source, context) => {
    if (source === '') return;
    const result = parser(source, context);
    assert(check(source, result));
    if (!result) return;
    if (!cond(eval(result), exec(result), context)) return;
    assert(exec(result).length < source.length);
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}
