import { Parser, exec } from '../../data/parser';
import { firstline } from './line';

export function block<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function block<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, separation = true): Parser<T, D> {
  assert(parser);
  return (source, state, config) => {
    if (source === '') return;
    const result = parser(source, state, config);
    if (!result) return;
    const rest = exec(result);
    if (separation && firstline(rest).trim() !== '') return;
    return rest === '' || source[source.length - rest.length - 1] === '\n'
      ? result
      : undefined;
  };
}
