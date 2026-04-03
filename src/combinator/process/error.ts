import { Parser } from '../parser';
import { always } from '../control/state';

export function error<P extends Parser>(parser: P): P;
export function error<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return always([
    (input, output) => {
      if (!output.error) return output.context;
      return parser(input, output);
    },
  ]);
}
