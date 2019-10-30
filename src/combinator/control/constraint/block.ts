import { Parser, exec } from '../../data/parser';
import { firstline } from './line';

export function block<P extends Parser<unknown, any, object>>(parser: P, separation?: boolean): P;
export function block<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>, separation = true): Parser<T, S, object> {
  assert(parser);
  return (source, config) => {
    if (source === '') return;
    const result = parser(source, config);
    if (!result) return;
    const rest = exec(result);
    if (separation && firstline(rest).trim() !== '') return;
    return rest === '' || source[source.length - rest.length - 1] === '\n'
      ? result
      : undefined;
  };
}
