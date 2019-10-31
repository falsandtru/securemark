import { Parser } from '../../data/parser';

export function convert<P extends Parser<unknown, any, object>>(conv: (source: string) => string, parser: P): P;
export function convert<T, D extends Parser<unknown, any, object>[]>(conv: (source: string) => string, parser: Parser<T, D, object>): Parser<T, D, object> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    source = conv(source);
    return source === ''
      ? [[], '', config]
      : parser(source, config);
  };
}
