import { Parser } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string) => string, parser: P): P;
export function convert<T, D extends Parser<unknown>[]>(conv: (source: string) => string, parser: Parser<T, D>): Parser<T, D> {
  assert(parser);
  return (source, state, config) => {
    if (source === '') return;
    source = conv(source);
    return source === ''
      ? [[], '', state]
      : parser(source, state, config);
  };
}
