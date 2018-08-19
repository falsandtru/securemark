import { Parser } from '../../data/parser';

export function convert<P extends Parser<any, any>>(conv: (source: string) => string, parser: P): P;
export function convert<T, S extends Parser<any, any>[]>(conv: (source: string) => string, parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    source = conv(source);
    return source !== ''
      ? parser(source)
      : [[], ''];
  };
}
