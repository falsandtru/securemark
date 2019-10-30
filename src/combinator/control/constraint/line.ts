import { Parser, eval, exec, check } from '../../data/parser';

export function line<P extends Parser<unknown, any, object>>(parser: P, allowTrailingWhitespace?: boolean): P;
export function line<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>, allowTrailingWhitespace = true): Parser<T, S, object> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const fst = firstline(source);
    const result = parser(fst, config);
    assert(check(fst, result));
    if (!result) return;
    return (allowTrailingWhitespace ? exec(result).trim() === '' : exec(result) === '')
      ? [eval(result), source.slice(fst.length), config]
      : undefined;
  };
}

export function subline<P extends Parser<unknown, any, object>>(parser: P): P;
export function subline<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>): Parser<T, S, object> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return result;
    return source.length - exec(result).length <= firstline(source, false).length
      ? result
      : undefined;
  };
}

export function firstline(source: string, keepLinebreak = true): string {
  const i = source.indexOf('\n');
  return i === -1
    ? source
    : source.slice(0, keepLinebreak ? i + 1 : i);
}
