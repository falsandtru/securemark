import { Parser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

const memsize = 1000;

export function some<P extends Parser<unknown, any>>(parser: P, until?: string | RegExp): P;
export function some<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, until?: string | RegExp): Parser<T, S> {
  assert(parser);
  assert(until instanceof RegExp ? !until.global && until.source.startsWith('^') : true);
  let memory = '';
  return source => {
    if (source === memory) return;
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
    memory = source.length < memsize && rest || memory;
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data, rest]
      : undefined;
  };
}

function match(source: string, pattern: string | RegExp): boolean {
  return typeof pattern === 'string'
    ? source.startsWith(pattern)
    : pattern.test(source);
}
