import 'spica/global';
import { isArray } from 'spica/alias';
import { Parser, Ctx, Tree, Context, eval, exec, check } from '../../data/parser';

//export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (results: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<T>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T>, cond: (results: readonly T[], rest: string) => boolean): Parser<T> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P): P;
export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], has: string, parser: P): P;
export function validate<T>(patterns: string | RegExp | (string | RegExp)[], has: string | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof has === 'function') return validate(patterns, '', has);
  if (!isArray(patterns)) return validate([patterns], has, parser!);
  assert(patterns.length > 0);
  assert(patterns.every(pattern => pattern instanceof RegExp ? !pattern.flags.match(/[gmy]/) && pattern.source.startsWith('^') : true));
  assert(parser);
  const match: (source: string) => boolean = global.eval([
    'source =>',
    patterns.map(pattern =>
      typeof pattern === 'string'
        ? `|| source.slice(0, ${pattern.length}) === '${pattern}'`
        : `|| /${pattern.source}/${pattern.flags}.test(source)`).join('').slice(2),
  ].join(''));
  return ({ source, context }) => {
    if (source === '') return;
    if (!match(source)) return;
    const result = parser!({ source, context });
    assert(check(source, result));
    if (!result) return;
    assert(exec(result).length < source.length);
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}

export function verify<P extends Parser<unknown>>(parser: P, cond: (results: readonly Tree<P>[], rest: string, context: Context<P>) => boolean): P;
export function verify<T>(parser: Parser<T>, cond: (results: readonly T[], rest: string, context: Ctx) => boolean): Parser<T> {
  assert(parser);
  return ({ source, context }) => {
    if (source === '') return;
    const result = parser({ source, context });
    assert(check(source, result));
    if (!result) return;
    if (!cond(eval(result), exec(result), context)) return;
    assert(exec(result).length < source.length);
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}
