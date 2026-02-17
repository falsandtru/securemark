import { Parser, failsafe } from '../../data/parser';
import { firstline, isBlank } from './line';

export function block<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function block<N>(parser: Parser<N>, separation = true): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const result = parser(input);
    if (result === undefined) return;
    if (separation && !isBlank(firstline(source, context.position))) return;
    assert(context.position === source.length || source[context.position - 1] === '\n');
    return context.position === source.length || source[context.position - 1] === '\n'
      ? result
      : undefined;
  });
}
