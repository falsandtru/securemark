import { Parser, eval, exec, check } from '../../data/parser';

export function line<P extends Parser<unknown>>(parser: P, allowTrailingWhitespace?: boolean): P;
export function line<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, allowTrailingWhitespace = true): Parser<T, D> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const fst = firstline(source);
    const result = parser(fst, config);
    assert(check(fst, result));
    if (!result) return;
    return (allowTrailingWhitespace ? exec(result).trim() === '' : exec(result) === '')
      ? [eval(result), source.slice(fst.length)]
      : void 0;
  };
}

export function subline<P extends Parser<unknown>>(parser: P): P;
export function subline<T, D extends Parser<unknown>[]>(parser: Parser<T, D>): Parser<T, D> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const result = parser(source, config);
    assert(check(source, result));
    if (!result) return result;
    return source.length - exec(result).length <= firstline(source, false).length
      ? result
      : void 0;
  };
}

export function firstline(source: string, keepLinebreak = true): string {
  const i = source.indexOf('\n');
  return i === -1
    ? source
    : source.slice(0, keepLinebreak ? i + 1 : i);
}
