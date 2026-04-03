import { Parser, SubParsers } from '../parser';
import { success, always } from './state';

export function sequence<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function sequence<T>(parsers: SubParsers<T>): Parser<T> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
    case 1:
      return () => parsers;
    default:
      return parsers.reduceRight((acc, parser) => always([
        parser,
        success(acc),
      ]));
  }
}
