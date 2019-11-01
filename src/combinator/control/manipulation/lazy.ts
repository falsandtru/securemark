import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown>>(builder: () => P): P;
export function lazy<T, D extends Parser<unknown>[]>(builder: () => Parser<T, D>): Parser<T, D> {
  let parser: Parser<T, D>;
  return (source, state, config) =>
    (parser = parser || builder())(source, state, config);
}
