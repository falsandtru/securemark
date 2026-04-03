import { Parser, SubParsers, Result } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function inits<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function inits<T>(parsers: SubParsers<T>): Parser<T> {
  assert(parsers.every(f => f));
  switch (parsers.length) {
    case 0:
      assert(false);
      return (_, output) => output.context;
    case 1:
      return parsers[0];
    default:
      return parsers.reduceRight((acc, parser, i) =>
        sequence([
          parser,
          i !== 0
            ? acc
            : union([
                acc,
                recovery,
              ]),
        ]));
  }
}

const recovery: Parser<never> = (_, output) => {
  if (output.state) {
    output.state = true;
    // @ts-expect-error
    output.context ??= Result.succ;
  }
  return output.context;
};
