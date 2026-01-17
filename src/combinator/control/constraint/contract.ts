import { isArray } from 'spica/alias';
import { Parser, Input, Ctx, Tree, Context, eval, exec, check } from '../../data/parser';

//export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (nodes: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<T>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<T>, cond: (nodes: readonly T[], rest: string) => boolean): Parser<T> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P): P;
export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], has: string, parser: P): P;
export function validate<P extends Parser<unknown>>(cond: ((input: Input<Context<P>>) => boolean), parser: P): P;
export function validate<T>(patterns: string | RegExp | (string | RegExp)[] | ((input: Input<Ctx>) => boolean), has: string | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof patterns === 'function') return guard(patterns, has as Parser<T>);
  if (typeof has === 'function') return validate(patterns, '', has);
  if (!isArray(patterns)) return validate([patterns], has, parser!);
  assert(patterns.length > 0);
  assert(patterns.every(pattern => pattern instanceof RegExp ? !pattern.flags.match(/[gmy]/) && pattern.source.startsWith('^') : true));
  assert(parser = parser!);
  const match: (source: string) => boolean = global.eval([
    'source =>',
    patterns.map(pattern =>
      typeof pattern === 'string'
        ? `|| source.slice(0, ${pattern.length}) === '${pattern}'`
        : `|| /${pattern.source}/${pattern.flags}.test(source)`).join('').slice(2),
  ].join(''));
  return input => {
    const { source } = input;
    if (source === '') return;
    if (!match(source)) return;
    const result = parser(input);
    assert(check(source, result));
    if (result === undefined) return;
    assert(exec(result).length < source.length);
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}

function guard<P extends Parser<unknown>>(f: (input: Input<Context<P>>) => boolean, parser: P): P;
function guard<T>(f: (input: Input<Ctx>) => boolean, parser: Parser<T>): Parser<T> {
  return input =>
    f(input)
      ? parser(input)
      : undefined;
}

export function verify<P extends Parser<unknown>>(parser: P, cond: (nodes: readonly Tree<P>[], rest: string, context: Context<P>) => boolean): P;
export function verify<T>(parser: Parser<T>, cond: (nodes: readonly T[], rest: string, context: Ctx) => boolean): Parser<T> {
  assert(parser);
  return input => {
    const { source, context } = input;
    if (source === '') return;
    const result = parser(input);
    assert(check(source, result));
    if (result === undefined) return;
    if (!cond(eval(result), exec(result), context)) return;
    assert(exec(result).length < source.length);
    return exec(result).length < source.length
      ? result
      : undefined;
  };
}
