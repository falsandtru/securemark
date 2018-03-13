import { Parser } from './parser';

export function build<P extends Parser<any, any>>(builder: () => P): P;
export function build<T, S extends Parser<any, any>[]>(builder: () => Parser<T, S>): Parser<T, S> {
  let parser: Parser<T, S>;
  return source =>
    (parser = parser || builder())(source);
}
