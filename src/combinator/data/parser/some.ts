import { Parser, eval, exec, check } from '../parser';
import { concat } from 'spica/concat';

export function some<P extends Parser<unknown, any, object>>(parser: P, until?: string | RegExp): P;
export function some<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>, until?: string | RegExp): Parser<T, S, object> {
  assert(parser);
  assert(until instanceof RegExp ? !until.global && until.source.startsWith('^') : true);
  let memory = '';
  return (source, config) => {
    if (source === memory) return;
    let rest = source;
    const data: T[] = [];
    while (true) {
      if (rest === '') break;
      if (until && match(rest, until)) break;
      const result = parser(rest, config);
      assert(check(rest, result));
      if (!result) break;
      void concat(data, eval(result));
      rest = exec(result);
    }
    memory = rest || memory;
    assert(rest.length <= source.length);
    return rest.length < source.length
      ? [data, rest, config]
      : undefined;
  };
}

function match(source: string, pattern: string | RegExp): boolean {
  return typeof pattern === 'string'
    ? source.startsWith(pattern)
    : pattern.test(source);
}
