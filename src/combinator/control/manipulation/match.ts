import { Parser, exec, check } from '../../data/parser';

export function match<P extends Parser<unknown, any>>(pattern: RegExp, f: (matched: string[]) => P): P;
export function match<T, S extends Parser<unknown, any>[]>(pattern: RegExp, f: (matched: string[]) => Parser<T, S>): Parser<T, S> {
  return source => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const rest = source.slice(param[0].length);
    const result = f(param)(rest);
    assert(check(source, result, false));
    if (!result) return;
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}
