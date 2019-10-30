import { Parser, exec, check } from '../../data/parser';

export function match<P extends Parser<unknown, any, object>>(pattern: RegExp, f: (matched: string[]) => P): P;
export function match<T, S extends Parser<unknown, any, object>[]>(pattern: RegExp, f: (matched: string[]) => Parser<T, S, object>): Parser<T, S, object> {
  assert(!pattern.global && pattern.source.startsWith('^'));
  return (source, config) => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const rest = source.slice(param[0].length);
    const result = f(param)(rest, config);
    assert(check(source, result, false));
    if (!result) return;
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}
