import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown, any, object, object>>(builder: () => P): P;
export function lazy<T, D extends Parser<unknown, any, object, object>[]>(builder: () => Parser<T, D, object, object>): Parser<T, D, object, object> {
  let parser: Parser<T, D, object, object>;
  return (source, config) =>
    (parser = parser || builder())(source, config);
}
