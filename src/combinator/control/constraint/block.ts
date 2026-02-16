import { Parser, exec, failsafe } from '../../data/parser';
import { firstline, isBlank } from './line';

export function block<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function block<N>(parser: Parser<N>, separation = true): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const { source } = input;
    if (source === '') return;
    const result = parser(input);
    if (result === undefined) return;
    const rest = exec(result);
    if (separation && !isBlank(firstline(rest))) return;
    assert(rest === '' || source[source.length - rest.length - 1] === '\n');
    return rest === '' || source[source.length - rest.length - 1] === '\n'
      ? result
      : undefined;
  });
}
