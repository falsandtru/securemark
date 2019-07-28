import { Parser, eval, exec, verify } from '../../data/parser';

export function line<P extends Parser<unknown, any>>(parser: P, allowTrailingWhitespace?: boolean): P;
export function line<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, allowTrailingWhitespace = true): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const fst = firstline(source);
    const result = parser(fst);
    assert(verify(fst, result));
    if (!result) return;
    return (allowTrailingWhitespace ? exec(result).trim() === '' : exec(result) === '')
      ? [eval(result), source.slice(fst.length)]
      : undefined;
  };
}

export function subline<P extends Parser<unknown, any>>(parser: P): P;
export function subline<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const result = parser(source);
    assert(verify(source, result));
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
