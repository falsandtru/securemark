import { Parser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

export function some<P extends Parser<unknown, any>>(parser: P, until?: string | RegExp): P;
export function some<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, until?: string | RegExp): Parser<T, S> {
  assert(parser);
  return source => {
    let rest = source;
    const data: T[] = [];
    while (true) {
      if (rest === '') break;
      if (until && match(rest, until)) break;
      const result = parser(rest);
      assert(check(rest, result));
      if (!result) break;
      void concat(data, eval(result));
      rest = exec(result);
    }
    return rest.length < source.length
      ? [data, rest]
      : undefined;
  };
}

function match(source: string, pattern: string | RegExp): boolean {
  return typeof pattern === 'string'
    ? source.startsWith(pattern)
    : source.search(pattern) === 0;
}
