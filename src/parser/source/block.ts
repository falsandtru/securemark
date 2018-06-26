import { Parser, exec } from '../../combinator';
import { firstline } from './line';

export function block<P extends Parser<any, any>>(parser: P, separation?: boolean): P;
export function block<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, separation = true): Parser<T, S> {
  return source => {
    if (source.length === 0) return;
    const result = parser(source);
    if (!result) return;
    const rest = exec(result);
    if (separation && firstline(rest).trim() !== '') return;
    return rest === '' || source[source.length - rest.length - 1] === '\n'
      ? result
      : undefined;
  };
}
