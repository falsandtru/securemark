import { Parser, exec } from '../../data/parser';

export function match<P extends Parser<any, any>>(pattern: RegExp, f: (matched: string[]) => P): P;
export function match<T, S extends Parser<any, any>[] = []>(pattern: RegExp, f: (matched: string[]) => Parser<T, S>): Parser<T, S> {
  return source => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const rest = source.slice(param[0].length);
    const result = f(param)(rest);
    if (!result) return;
    assert(rest.endsWith(exec(result)));
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}
