import { Parser, List, Segment } from '../../data/parser';
import { isEmptyline } from './line';

export function block<P extends Parser>(parser: P, separation?: boolean, segment?: number): P;
export function block<N>(parser: Parser<N>, separation = true, segment = 0): Parser<N> {
  assert(parser);
  return input => {
    const context = input;
    const { source, position } = context;
    if (position === source.length) return;
    if (segment !== 0 && context.segment & Segment.write) {
      if (context.segment !== (segment | Segment.write)) return;
      context.position = source.length;
      return new List();
    }
    const result = parser(input);
    if (result === undefined ||
        separation && !isEmptyline(source, context.position)) {
      context.position = position;
      return;
    }
    assert(context.position === source.length || source[context.position - 1] === '\n');
    if (segment !== 0 && context.segment & Segment.write ^ Segment.write) {
      context.segment = segment;
    }
    return result;
  };
}
