import { Parser, eval, exec } from '../../data/parser';

export function line<P extends Parser<any, any>>(parser: P, allowTrailingWhitespace?: boolean): P;
export function line<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, allowTrailingWhitespace = true): Parser<T, S> {
  return source => {
    if (source === '') return;
    const result = parser(source);
    if (!result) return result;
    const src = source.slice(0, source.length - exec(result).length);
    const fst = firstline(source);
    return src.length <= fst.length
      ? src.length === fst.length
        ? result
        : allowTrailingWhitespace && firstline(exec(result)).trim() === ''
          ? [eval(result), source.slice(fst.length)]
          : undefined
      : undefined;
  };
}

export function subline<P extends Parser<any, any>>(parser: P): P;
export function subline<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return source => {
    if (source === '') return;
    const result = parser(source);
    if (!result) return result;
    return source.length - exec(result).length <= source.split('\n', 1)[0].length
      ? result
      : undefined;
  };
}

export function firstline(source: string): string {
  const i = source.indexOf('\n');
  return i === -1
    ? source
    : source.slice(0, i + 1);
}
