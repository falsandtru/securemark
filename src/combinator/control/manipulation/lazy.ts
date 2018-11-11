import { Parser } from '../../data/parser';

export function lazy<P extends Parser<any, any>>(builder: () => P): P;
export function lazy<T, S extends Parser<any, any>[]>(builder: () => Parser<T, S>): Parser<T, S> {
  let parser: Parser<T, S>;
  return source =>
    (parser = parser || builder())(source);
}
