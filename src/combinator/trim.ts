import { Parser } from './parser';

export function trim<P extends Parser<any, any>>(parser: P): P;
export function trim<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimWith(parser, source => source.trim());
}

function trimWith<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, trim: (source: string) => string): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    source = trim(source);
    return source !== ''
      ? parser(source)
      : [[], ''];
  };
}
