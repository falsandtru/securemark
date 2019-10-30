import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown, any, object>>(builder: () => P): P;
export function lazy<T, S extends Parser<unknown, any, object>[]>(builder: () => Parser<T, S, object>): Parser<T, S, object> {
  let parser: Parser<T, S, object>;
  return (source, config) =>
    (parser = parser || builder())(source, config);
}
