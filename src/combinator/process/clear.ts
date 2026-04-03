import { Parser, SubParsers, Input } from '../parser';
import { always } from '../control/state';

export function clear<S extends SubParsers<unknown>, I extends Input>(parser: Parser<unknown, I, S>): Parser<never, I, S> {
  return always([
    (_, output) => {
      output.push();
      return output.context;
    },
    parser,
    (_, output) => {
      output.pop();
      return output.context;
    },
  ]);
}
