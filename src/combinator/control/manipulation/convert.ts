import { Parser } from '../../data/parser';

export function convert<P extends Parser<unknown, any>>(conv: (source: string) => string, parser: P): P;
export function convert<T, D extends Parser<unknown, any>[]>(conv: (source: string) => string, parser: Parser<T, D>): Parser<T, D> {
  assert(parser);
  return (source, config, state) => {
    if (source === '') return;
    source = conv(source);
    return source === ''
      ? [[], '', config]
      : parser(source, config, state);
  };
}
