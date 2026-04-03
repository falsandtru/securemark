import { Parser, SubParsers, Result } from '../parser';
import { failure, always } from './state';

export function union<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function union<T>(parsers: SubParsers<T>): Parser<T> {
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
        failure(recovery(acc)),
      ]));
  }
}

function recovery<P extends Parser>(parser: P): P;
function recovery<T>(parser: Parser<T>): Parser<T> {
  return (input, output) => {
    if (!output.state) {
      output.state = true;
      // @ts-expect-error
      output.context ??= Result.succ;
    }
    return parser(input, output);
  };
}
