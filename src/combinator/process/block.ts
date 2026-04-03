import { Parser, Result, Segment } from '../parser';
import { always } from '../control/state';
import { backtrack } from '../effect/backtrack';
import { isEmptyline } from './line';

export function block<P extends Parser>(parser: P, separation?: boolean, segment?: number): P;
export function block<T>(parser: Parser<T>, separation = true, segment = 0): Parser<T> {
  assert(parser);
  const cont: Result<T> = [
    parser,
    (input, output) => {
      const { source, position } = input;
      if (!output.state || separation && !isEmptyline(source, position)) return;
      assert(position === source.length || source[position - 1] === '\n');
      if (segment !== 0 && ~input.segment & Segment.write) {
        input.segment = segment;
      }
      return output.context;
    },
  ];
  return backtrack(always([
    (input, output) => {
      const { source, position } = input;
      if (position === source.length) return;
      if (segment !== 0 && input.segment & Segment.write) {
        if (input.segment !== (segment | Segment.write)) return;
        input.position = source.length;
        return output.context;
      }
      return cont;
    },
  ]));
}
