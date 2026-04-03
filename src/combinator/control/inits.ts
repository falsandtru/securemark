import { Parser, SubParsers } from '../parser';
import { union } from './union';
import { sequence } from './sequence';
import { recovery } from './state';

export function inits<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function inits<T>(parsers: SubParsers<T>): Parser<T> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return (_, output) => output.context;
    case 1:
      return () => parsers;
    default:
      return parsers.reduceRight((acc, parser, i) =>
        sequence([
          parser,
          i !== 0
            ? acc
            : union([
                acc,
                recovery(),
              ]),
        ]));
  }
}
