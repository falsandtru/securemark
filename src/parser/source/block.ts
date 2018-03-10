import { Parser } from '../../combinator';

export function block<P extends Parser<any, any>>(parser: P): P;
export function block<S extends Parser<any, any>[], R>(parser: Parser<R, S>): Parser<R, S> {
  return source => {
    if (source.length === 0) return;
    const result = parser(source);
    if (!result) return result;
    const rest = result[1];
    return rest === '' || source[source.length - rest.length - 1] === '\n'
      ? result
      : undefined;
  };
}
