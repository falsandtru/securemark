import { Parser } from './parser';

export function trim<P extends Parser<any, any>>(parser: P): P;
export function trim<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trim_(parser, s => s.trim());
}

export function trimStart<P extends Parser<any, any>>(parser: P): P;
export function trimStart<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trim_(parser, (source: string): string => {
    const mid = source.trim();
    return source.slice(source.lastIndexOf(mid));
  });
}

export function trimEnd<P extends Parser<any, any>>(parser: P): P;
export function trimEnd<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trim_(parser, (source: string): string => {
    const mid = source.trim();
    return source.slice(0, source.lastIndexOf(mid) + mid.length);
  });
}

function trim_<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, trim: (source: string) => string): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    source = trim(source);
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
