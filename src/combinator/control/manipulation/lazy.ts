import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown, any, object>>(builder: () => P): P;
export function lazy<T, D extends Parser<unknown, any, object>[]>(builder: () => Parser<T, D, object>): Parser<T, D, object> {
  let parser: Parser<T, D, object>;
  return (source, config) =>
    (parser = parser || builder())(source, config);
}
