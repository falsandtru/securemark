import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown, any>>(builder: () => P): P;
export function lazy<T, D extends Parser<unknown, any>[]>(builder: () => Parser<T, D>): Parser<T, D> {
  let parser: Parser<T, D>;
  return (source, config) =>
    (parser = parser || builder())(source, config);
}
