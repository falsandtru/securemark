import { Parser, exec } from '../../data/parser';

export function match<P extends Parser<any, any>>(pattern: RegExp, f: (matched: string[]) => P): P;
export function match<P extends Parser<any, any>, R extends [number | string, ...any[]]>(pattern: RegExp, g: (matched: string[]) => R, f: (param: R) => P): P;
export function match<T, S extends Parser<any, any>[] = [], R extends [number | string, ...any[]] = [string]>(pattern: RegExp, g: (matched: string[]) => Parser<T, S> | R, f?: (param: R) => Parser<T, S>): Parser<T, S> {
  const parser = memory();
  return source => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const rest = source.slice(param[0].length);
    const result = f
      ? parser(f, g(param) as R)(rest)
      : (g(param) as Parser<T, S>)(rest);
    if (!result) return;
    assert(rest.endsWith(exec(result)));
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}

function memory(): <P extends [number | string, ...unknown[]], V>(f: (p: P) => V, p: P) => V {
  const memo = new Map();
  return (f, p, k = p[0]) =>
    memo.has(k)
      ? memo.get(k)!
      : memo.set(k, f(p)).get(k)!;
}
