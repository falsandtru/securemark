import { Parser, exec, check } from '../../data/parser';
import { memoize as memoize_ } from 'spica/memoization';

export function match<P extends Parser<unknown, any>>(pattern: RegExp, f: (matched: string[]) => P): P;
export function match<T, D extends Parser<unknown, any>[]>(pattern: RegExp, f: (matched: string[]) => Parser<T, D>): Parser<T, D> {
  assert(!pattern.global && pattern.source.startsWith('^'));
  return (source, config, state) => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const rest = source.slice(param[0].length);
    const result = f(param)(rest, config, state);
    assert(check(source, result, false));
    if (!result) return;
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}

export function memoize<a, b, c>(f: (a: a) => b, g: (b: b) => c): (a: a) => c {
  g = memoize_(g);
  return a => g(f(a));
}
