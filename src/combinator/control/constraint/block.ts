import { Parser, failsafe } from '../../data/parser';
import { isBlankline } from './line';

export function block<P extends Parser>(parser: P, separation?: boolean): P;
export function block<N>(parser: Parser<N>, separation = true): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const result = parser(input);
    if (result === undefined) return;
    if (separation && !isBlankline(source, context.position)) return;
    assert(context.position === source.length || source[context.position - 1] === '\n');
    return context.position === source.length || source[context.position - 1] === '\n'
      ? result
      : undefined;
  });
}
