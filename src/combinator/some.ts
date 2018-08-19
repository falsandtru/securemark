import { Parser, eval, exec, validate } from './parser';
import { concat } from 'spica/concat';

export function some<P extends Parser<any, any>>(parser: P, until?: string | RegExp): P;
export function some<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, until?: string | RegExp): Parser<T, S> {
  assert(parser);
  return source => {
    let rest = source;
    const results: T[] = [];
    while (true) {
      if (rest === '') break;
      if (until && match(rest, until)) break;
      const result = parser(rest);
      validate(rest, result);
      if (!result) break;
      if (exec(result).length >= rest.length) return;
      void concat(results, eval(result));
      rest = exec(result);
    }
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}

function match(source: string, pattern: string | RegExp): boolean {
  return typeof pattern === 'string'
    ? source.startsWith(pattern)
    : source.search(pattern) === 0;
}
