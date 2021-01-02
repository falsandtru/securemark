import { undefined, Function } from 'spica/global';
import { Parser, Data, SubParsers, Context, SubData } from '../parser';

export function union<P extends Parser<unknown>>(parsers: SubParsers<P>): SubData<P> extends Data<P> ? P : Parser<SubData<P>, SubParsers<P>, Context<P>>;
export function union<T, D extends Parser<T>[]>(parsers: D): Parser<T, D> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return Function('parsers', [
        '"use strict";',
        "return (source, context) =>",
        '0',
        ...parsers.map((_, i) => `|| parsers[${i}](source, context)`),
      ].join(''))(parsers);
  }
}
