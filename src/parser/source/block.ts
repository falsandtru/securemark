import { Parser } from '../../combinator';

export function block<P extends Parser<any, any>>(parser: P): P;
export function block<S extends Parser<any, any>[], R>(parser: Parser<R, S>): Parser<R, S> {
  return source => {
    const result = parser(source);
    if (!result) return result;
    const rest = result[1];
    const src = source.slice(0, source.length - rest.length);
    assert(src !== '');
    return rest === '' || src[src.length - 1] === '\n'
      ? result
      : undefined;
  };
}
