import { Parser, SubParsers } from '../parser';
import { failure, always, recovery } from './state';

export function union<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function union<T>(parsers: SubParsers<T>): Parser<T> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      return (_, output) => output.context;
    case 1:
      return () => parsers;
    default:
      return parsers.reduceRight((acc, parser) => always([
        parser,
        failure(recovery(acc)),
      ]));
  }
}
