import { Parser, exec } from '../../data/parser';

export function match<P extends Parser<any, any>>(pattern: RegExp, f: (matched: string[]) => P, memidx?: number): P;
export function match<T, S extends Parser<any, any>[] = []>(pattern: RegExp, f: (matched: string[]) => Parser<T, S>, memidx?: number): Parser<T, S> {
  const parser = memory();
  return source => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    assert(memidx === undefined || memidx < param.length);
    const rest = source.slice(param[0].length);
    const result = memidx === undefined
      ? f(param)(rest)
      : parser(param[memidx], f, param)(rest);
    if (!result) return;
    assert(rest.endsWith(exec(result)));
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}

function memory(): <k, p, z>(k: k, f: (p: p) => z, p: p) => z {
  const memo = new Map();
  return (k, f, p) =>
    memo.has(k)
      ? memo.get(k)!
      : memo.set(k, f(p)).get(k)!;
}
