import { Parser } from './parser';

export function trim<P extends Parser<any, any>>(parser: P): P;
export function trim<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    source = source.trim();
    if (source === '') return [[], ''];
    const [results = [], rest = undefined] = parser(source) || [];
    if (rest === undefined) return;
    assert(source.slice(1).endsWith(rest));
    if (rest.length >= source.length) return;
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}
