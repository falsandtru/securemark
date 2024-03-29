import { Parser, exec } from '../../data/parser';
import { firstline, isBlank } from './line';

export function block<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function block<T>(parser: Parser<T>, separation = true): Parser<T> {
  assert(parser);
  return ({ source, context }) => {
    if (source === '') return;
    const result = parser({ source, context });
    if (result === undefined) return;
    const rest = exec(result);
    if (separation && !isBlank(firstline(rest))) return;
    assert(rest === '' || source[source.length - rest.length - 1] === '\n');
    return rest === '' || source[source.length - rest.length - 1] === '\n'
      ? result
      : undefined;
  };
}
