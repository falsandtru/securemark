import { undefined, Function } from 'spica/global';
import { isArray } from 'spica/alias';
import { Parser, Ctx, Data, Context, eval, exec, check } from '../../data/parser';

//export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<T, D extends Parser<unknown>[]>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T, D>, cond: (results: readonly T[], rest: string) => boolean): Parser<T, D> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P): P;
export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], has: string, parser: P): P;
export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], has: string, end: string, parser: P): P;
export function validate<T, D extends Parser<unknown>[]>(patterns: string | RegExp | (string | RegExp)[], has: string | Parser<T, D>, end?: string | Parser<T, D>, parser?: Parser<T, D>): Parser<T, D> {
  if (typeof has === 'function') return validate(patterns, '', '', has);
  if (typeof end === 'function') return validate(patterns, has, '', end);
  if (!isArray(patterns)) return validate([patterns], has, end!, parser!);
  assert(patterns.length > 0);
  assert(patterns.every(pattern => pattern instanceof RegExp ? !pattern.global && pattern.source.startsWith('^') : true));
  assert(parser);
  const match: (source: string) => boolean = Function('patterns', [
    '"use strict";',
    "return source =>",
    'false',
    ...patterns.map((pattern, i) =>
      typeof pattern === 'string'
        ? `|| source.slice(0, ${pattern.length}) === '${pattern}'`
        : `|| patterns[${i}].test(source)`),
  ].join(''))(patterns);
  const match2 = (source: string): boolean => {
    if (!has) return true;
    const i = end ? source.indexOf(end, 1) : -1;
    return i > -1
      ? source.slice(0, i).indexOf(has, 1) > -1
      : source.indexOf(has, 1) > -1;
  };
  return (source, context) => {
    if (source === '') return;
    if (!match(source)) return;
    if (!match2(source)) return;
    const result = parser!(source, context);
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
