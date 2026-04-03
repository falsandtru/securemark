import { Parser, SubParsers } from '../parser';
import { success, always } from './state';

export function sequence<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function sequence<T>(parsers: SubParsers<T>): Parser<T> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      assert(false);
      return (_, output) => output.context;
    case 1:
      return parsers[0];
    default:
      return parsers.reduceRight((acc, parser) => always([
        parser,
        success(acc),
      ]));
  }
}
